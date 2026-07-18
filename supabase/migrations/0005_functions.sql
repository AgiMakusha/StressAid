-- 0005_functions.sql
-- Hardened RPCs. All are SECURITY DEFINER (owned by the migration role
-- `postgres`), use a fixed safe search_path, contain no dynamic SQL, fully
-- qualify every object, validate inputs, and return generic errors that never
-- reveal ownership or existence details.
--
-- Grants:
--   anon + authenticated : get_public_round, submit_round_response
--   authenticated only   : create_campaign, start_new_round, list_my_campaigns,
--                          get_round_dashboard, set_round_status
--
-- Answers are never logged. Below-threshold dashboards never load distributions.

-- =========================================================================
-- PUBLIC: round metadata for the student link. Reveals nothing sensitive.
-- =========================================================================
create or replace function public.get_public_round(p_public_code uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_title text;
  v_class text;
  v_round_name text;
  v_language text;
  v_status text;
begin
  select c.title, c.class_display_name, r.display_name, c.language, r.status
    into v_title, v_class, v_round_name, v_language, v_status
  from public.assessment_rounds r
  join public.campaigns c on c.id = r.campaign_id
  where r.public_code = p_public_code;

  if not found or v_status <> 'live' then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'title', v_title,
    'classDisplayName', v_class,
    'roundDisplayName', v_round_name,
    'language', v_language
  );
end;
$$;

revoke all on function public.get_public_round(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.get_public_round(uuid) to anon, authenticated;

-- =========================================================================
-- PUBLIC: anonymous aggregate submission. Six answers, one atomic function.
-- =========================================================================
create or replace function public.submit_round_response(
  p_public_code uuid,
  p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_round_id uuid;
  v_status text;
  v_keys constant text[] :=
    array['mood', 'safety', 'engagement', 'fomo', 'socialAspects', 'predictability'];
  v_key text;
  v_val jsonb;
  v_mood int;
  v_safety int;
  v_engagement int;
  v_fomo int;
  v_social int;
  v_pred int;
begin
  -- Lock the round row so a submission cannot race with closure.
  select r.id, r.status
    into v_round_id, v_status
  from public.assessment_rounds r
  where r.public_code = p_public_code
  for update;

  if not found or v_status <> 'live' then
    -- Generic failure: never reveal whether the code exists or is closed.
    raise exception 'submission_unavailable' using errcode = 'P0001';
  end if;

  -- Validate the answers object BEFORE writing anything.
  if p_answers is null or jsonb_typeof(p_answers) is distinct from 'object' then
    raise exception 'invalid_answers' using errcode = 'P0001';
  end if;

  if (select count(*) from jsonb_object_keys(p_answers)) <> 6 then
    raise exception 'invalid_answers' using errcode = 'P0001';
  end if;

  if not (p_answers ?& v_keys) then
    raise exception 'invalid_answers' using errcode = 'P0001';
  end if;

  foreach v_key in array v_keys loop
    v_val := p_answers -> v_key;
    -- Must be a JSON number that is an integer 0..4 (rejects strings, decimals,
    -- booleans, null, arrays, objects, negatives and out-of-range values).
    if v_val is null
       or jsonb_typeof(v_val) is distinct from 'number'
       or (v_val #>> '{}') !~ '^[0-4]$' then
      raise exception 'invalid_answers' using errcode = 'P0001';
    end if;
  end loop;

  v_mood       := (p_answers ->> 'mood')::int;
  v_safety     := (p_answers ->> 'safety')::int;
  v_engagement := (p_answers ->> 'engagement')::int;
  v_fomo       := (p_answers ->> 'fomo')::int;
  v_social     := (p_answers ->> 'socialAspects')::int;
  v_pred       := (p_answers ->> 'predictability')::int;

  -- Atomically increment exactly one counter in each of the six sections.
  update public.round_section_aggregates a
  set
    never_count     = a.never_count     + (case when v.val = 0 then 1 else 0 end),
    rarely_count    = a.rarely_count    + (case when v.val = 1 then 1 else 0 end),
    sometimes_count = a.sometimes_count + (case when v.val = 2 then 1 else 0 end),
    often_count     = a.often_count     + (case when v.val = 3 then 1 else 0 end),
    always_count    = a.always_count    + (case when v.val = 4 then 1 else 0 end)
  from (
    values
      ('mood', v_mood),
      ('safety', v_safety),
      ('engagement', v_engagement),
      ('fomo', v_fomo),
      ('socialAspects', v_social),
      ('predictability', v_pred)
  ) as v (section, val)
  where a.round_id = v_round_id and a.section_id = v.section;

  -- Coarse date only. Never a precise per-submission timestamp.
  update public.assessment_rounds
  set aggregates_updated_on = current_date
  where id = v_round_id;

  return jsonb_build_object('success', true);
end;
$$;

revoke all on function public.submit_round_response(uuid, jsonb)
  from public, anon, authenticated, service_role;
grant execute on function public.submit_round_response(uuid, jsonb) to anon, authenticated;

-- =========================================================================
-- TEACHER: create a campaign and its first round.
-- =========================================================================
create or replace function public.create_campaign(
  p_title text,
  p_class_display_name text,
  p_expected_participant_count integer,
  p_minimum_response_threshold integer default 10,
  p_language text default 'en'
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_owner uuid := auth.uid();
  v_campaign_id uuid;
  v_round_id uuid;
  v_public_code uuid;
begin
  if v_owner is null then
    raise exception 'not_authenticated' using errcode = 'P0001';
  end if;

  -- Table CHECK constraints enforce lengths/ranges/feasibility/language.
  insert into public.campaigns (
    owner_id, title, class_display_name,
    expected_participant_count, minimum_response_threshold, language
  )
  values (
    v_owner, p_title, p_class_display_name,
    p_expected_participant_count, coalesce(p_minimum_response_threshold, 10),
    coalesce(p_language, 'en')
  )
  returning id into v_campaign_id;

  insert into public.assessment_rounds (
    campaign_id, round_number, display_name, status,
    expected_participant_count, minimum_response_threshold
  )
  values (
    v_campaign_id, 1, 'Round 1', 'live',
    p_expected_participant_count, coalesce(p_minimum_response_threshold, 10)
  )
  returning id, public_code into v_round_id, v_public_code;

  return jsonb_build_object(
    'campaignId', v_campaign_id,
    'roundId', v_round_id,
    'publicCode', v_public_code
  );
end;
$$;

revoke all on function public.create_campaign(text, text, integer, integer, text)
  from public, anon, authenticated, service_role;
grant execute on function public.create_campaign(text, text, integer, integer, text)
  to authenticated;

-- =========================================================================
-- TEACHER: start a fresh round for an owned campaign.
-- =========================================================================
create or replace function public.start_new_round(
  p_campaign_id uuid,
  p_display_name text default null
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_owner uuid := auth.uid();
  v_campaign_owner uuid;
  v_expected int;
  v_threshold int;
  v_next int;
  v_display text;
  v_round_id uuid;
  v_public_code uuid;
begin
  if v_owner is null then
    raise exception 'not_authenticated' using errcode = 'P0001';
  end if;

  -- Lock the campaign row so concurrent round creation cannot collide on the
  -- (campaign_id, round_number) unique constraint.
  select c.owner_id, c.expected_participant_count, c.minimum_response_threshold
    into v_campaign_owner, v_expected, v_threshold
  from public.campaigns c
  where c.id = p_campaign_id
  for update;

  if not found or v_campaign_owner <> v_owner then
    raise exception 'campaign_not_found' using errcode = 'P0001';
  end if;

  select coalesce(max(round_number), 0) + 1
    into v_next
  from public.assessment_rounds
  where campaign_id = p_campaign_id;

  v_display := btrim(coalesce(p_display_name, ''));
  if v_display = '' then
    v_display := 'Round ' || v_next::text;
  end if;

  insert into public.assessment_rounds (
    campaign_id, round_number, display_name, status,
    expected_participant_count, minimum_response_threshold
  )
  values (
    p_campaign_id, v_next, v_display, 'live', v_expected, v_threshold
  )
  returning id, public_code into v_round_id, v_public_code;

  return jsonb_build_object(
    'roundId', v_round_id,
    'roundNumber', v_next,
    'publicCode', v_public_code
  );
end;
$$;

revoke all on function public.start_new_round(uuid, text)
  from public, anon, authenticated, service_role;
grant execute on function public.start_new_round(uuid, text) to authenticated;

-- =========================================================================
-- TEACHER: list own campaigns with safe per-round metadata (no distributions).
-- =========================================================================
create or replace function public.list_my_campaigns()
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_owner uuid := auth.uid();
  v_result jsonb;
begin
  if v_owner is null then
    raise exception 'not_authenticated' using errcode = 'P0001';
  end if;

  select coalesce(jsonb_agg(camp order by camp_created), '[]'::jsonb)
    into v_result
  from (
    select
      c.created_at as camp_created,
      jsonb_build_object(
        'id', c.id,
        'title', c.title,
        'classDisplayName', c.class_display_name,
        'expectedParticipantCount', c.expected_participant_count,
        'minimumResponseThreshold', c.minimum_response_threshold,
        'language', c.language,
        'createdOn', c.created_at::date,
        'rounds', (
          select coalesce(jsonb_agg(rnd order by rnd_number), '[]'::jsonb)
          from (
            select
              r.round_number as rnd_number,
              jsonb_build_object(
                'id', r.id,
                'roundNumber', r.round_number,
                'displayName', r.display_name,
                'status', r.status,
                'publicCode', r.public_code,
                'createdOn', r.created_at::date,
                'aggregatesUpdatedOn', r.aggregates_updated_on,
                'responseCount', (
                  select coalesce(
                    a.never_count + a.rarely_count + a.sometimes_count
                      + a.often_count + a.always_count, 0)
                  from public.round_section_aggregates a
                  where a.round_id = r.id and a.section_id = 'mood'
                )
              ) as rnd
            from public.assessment_rounds r
            where r.campaign_id = c.id
          ) rounds_sub
        )
      ) as camp
    from public.campaigns c
    where c.owner_id = v_owner
  ) camps_sub;

  return v_result;
end;
$$;

revoke all on function public.list_my_campaigns()
  from public, anon, authenticated, service_role;
grant execute on function public.list_my_campaigns() to authenticated;

-- =========================================================================
-- TEACHER: threshold-gated dashboard for an owned round.
-- =========================================================================
create or replace function public.get_round_dashboard(p_round_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_owner uuid := auth.uid();
  v_title text;
  v_class text;
  v_round_name text;
  v_status text;
  v_expected int;
  v_threshold int;
  v_updated_on date;
  v_response_count int;
  v_meta jsonb;
  v_sections jsonb;
begin
  if v_owner is null then
    raise exception 'not_authenticated' using errcode = 'P0001';
  end if;

  select c.title, c.class_display_name, r.display_name, r.status,
         r.expected_participant_count, r.minimum_response_threshold,
         r.aggregates_updated_on
    into v_title, v_class, v_round_name, v_status,
         v_expected, v_threshold, v_updated_on
  from public.assessment_rounds r
  join public.campaigns c on c.id = r.campaign_id
  where r.id = p_round_id and c.owner_id = v_owner;

  if not found then
    raise exception 'round_not_found' using errcode = 'P0001';
  end if;

  -- Canonical Mood total is the authoritative response count.
  select coalesce(
    a.never_count + a.rarely_count + a.sometimes_count
      + a.often_count + a.always_count, 0)
    into v_response_count
  from public.round_section_aggregates a
  where a.round_id = p_round_id and a.section_id = 'mood';

  v_meta := jsonb_build_object(
    'title', v_title,
    'classDisplayName', v_class,
    'roundDisplayName', v_round_name,
    'status', v_status,
    'expectedParticipantCount', v_expected,
    'aggregatesUpdatedOn', v_updated_on
  );

  -- Below threshold: return immediately, WITHOUT loading any distributions.
  if v_response_count < v_threshold then
    return jsonb_build_object(
      'resultsAvailable', false,
      'responseCount', v_response_count,
      'threshold', v_threshold,
      'remaining', v_threshold - v_response_count,
      'meta', v_meta
    );
  end if;

  -- At or above threshold: load exactly six distributions in canonical order.
  select jsonb_agg(sect order by ord)
    into v_sections
  from (
    select
      array_position(
        array['mood', 'safety', 'engagement', 'fomo', 'socialAspects', 'predictability'],
        a.section_id
      ) as ord,
      jsonb_build_object(
        'sectionId', a.section_id,
        'never', a.never_count,
        'rarely', a.rarely_count,
        'sometimes', a.sometimes_count,
        'often', a.often_count,
        'always', a.always_count
      ) as sect
    from public.round_section_aggregates a
    where a.round_id = p_round_id
  ) t;

  return jsonb_build_object(
    'resultsAvailable', true,
    'responseCount', v_response_count,
    'threshold', v_threshold,
    'sections', v_sections,
    'meta', v_meta
  );
end;
$$;

revoke all on function public.get_round_dashboard(uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.get_round_dashboard(uuid) to authenticated;

-- =========================================================================
-- TEACHER: toggle round status live <-> closed for an owned round.
-- =========================================================================
create or replace function public.set_round_status(
  p_round_id uuid,
  p_status text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_owner uuid := auth.uid();
  v_current text;
  v_campaign_owner uuid;
begin
  if v_owner is null then
    raise exception 'not_authenticated' using errcode = 'P0001';
  end if;

  if p_status not in ('live', 'closed') then
    raise exception 'invalid_status' using errcode = 'P0001';
  end if;

  -- Lock the round so status change cannot race with a submission.
  select r.status, c.owner_id
    into v_current, v_campaign_owner
  from public.assessment_rounds r
  join public.campaigns c on c.id = r.campaign_id
  where r.id = p_round_id
  for update;

  if not found or v_campaign_owner <> v_owner then
    raise exception 'round_not_found' using errcode = 'P0001';
  end if;

  update public.assessment_rounds
  set
    status = p_status,
    closed_at = case when p_status = 'closed' then now() else null end
  where id = p_round_id;

  return jsonb_build_object('status', p_status);
end;
$$;

revoke all on function public.set_round_status(uuid, text)
  from public, anon, authenticated, service_role;
grant execute on function public.set_round_status(uuid, text) to authenticated;
