-- 02-rounds-submission.sql
-- Round creation preserves history; public metadata; anonymous submission
-- increments aggregates atomically, validates payloads, and respects closure.
--
-- Cross-role values are stashed in transaction-scoped GUCs (readable by any
-- role) so we never read a session temp table from the anon role.
begin;
select plan(19);

select tests.create_supabase_user('teacher_a');
select tests.authenticate_as('teacher_a');

create temporary table _ctx on commit drop as
select public.create_campaign('Env check', 'Class 9A', 30, 10, 'en') as created;

create temporary table _r2 on commit drop as
select public.start_new_round(
  ((select created ->> 'campaignId' from _ctx))::uuid, 'Round 2'
) as created;

-- Stash ids for use across role changes.
select set_config('tests.ctx_code', (select created ->> 'publicCode' from _ctx), true);
select set_config('tests.ctx_round', (select created ->> 'roundId' from _ctx), true);
select set_config('tests.r2_round', (select created ->> 'roundId' from _r2), true);

select ok(current_setting('tests.ctx_code') is not null, 'create_campaign returns a public code');
select is((select (created ->> 'roundNumber')::int from _r2), 2, 'start_new_round increments round number');
select isnt((select created ->> 'publicCode' from _r2), current_setting('tests.ctx_code'),
  'new round has a different public code');
select is(
  (select count(*)::int from public.assessment_rounds r
     join public.campaigns c on c.id = r.campaign_id
    where c.owner_id = tests.get_supabase_uid('teacher_a')),
  2, 'previous round preserved after starting a new round');

-- Direct aggregate reads run as superuser (authenticated has no access by design).
set local role postgres;
select is(
  (select count(*)::int from public.round_section_aggregates a
    where a.round_id = current_setting('tests.r2_round')::uuid),
  6, 'new round seeded with six aggregate rows');

-- Public round metadata for the live Round 1.
select is((public.get_public_round(current_setting('tests.ctx_code')::uuid)) ->> 'available',
  'true', 'get_public_round: live round is available');
select is((public.get_public_round(current_setting('tests.ctx_code')::uuid)) ->> 'title',
  'Env check', 'get_public_round: returns the campaign title');

-- Anonymous submission via public code (Round 1).
select tests.clear_authentication();
select is(
  public.submit_round_response(
    current_setting('tests.ctx_code')::uuid,
    '{"mood":4,"safety":0,"engagement":2,"fomo":3,"socialAspects":1,"predictability":4}'::jsonb
  ),
  '{"success": true}'::jsonb, 'valid submission returns success');

set local role postgres;
select is(
  (select (a.never_count + a.rarely_count + a.sometimes_count
             + a.often_count + a.always_count)
     from public.round_section_aggregates a
    where a.round_id = current_setting('tests.ctx_round')::uuid
      and a.section_id = 'mood'),
  1, 'submission increments the Mood section total by one');

-- Invalid payloads are rejected (and roll back entirely).
select tests.clear_authentication();
select throws_ok(
  $$ select public.submit_round_response(current_setting('tests.ctx_code')::uuid,
     '{"mood":5,"safety":0,"engagement":2,"fomo":3,"socialAspects":1,"predictability":4}'::jsonb) $$,
  'invalid_answers', 'out-of-range value is rejected');
select throws_ok(
  $$ select public.submit_round_response(current_setting('tests.ctx_code')::uuid,
     '{"mood":"2","safety":0,"engagement":2,"fomo":3,"socialAspects":1,"predictability":4}'::jsonb) $$,
  'invalid_answers', 'string value is rejected');
select throws_ok(
  $$ select public.submit_round_response(current_setting('tests.ctx_code')::uuid,
     '{"mood":2,"safety":0,"engagement":2,"fomo":3,"socialAspects":1}'::jsonb) $$,
  'invalid_answers', 'missing key is rejected');
select throws_ok(
  $$ select public.submit_round_response(current_setting('tests.ctx_code')::uuid,
     '{"mood":2,"safety":0,"engagement":2,"fomo":3,"socialAspects":1,"predictability":4,"extra":1}'::jsonb) $$,
  'invalid_answers', 'additional key is rejected');
select throws_ok(
  $$ select public.submit_round_response(current_setting('tests.ctx_code')::uuid,
     '{"mood":2.5,"safety":0,"engagement":2,"fomo":3,"socialAspects":1,"predictability":4}'::jsonb) $$,
  'invalid_answers', 'decimal value is rejected');
select throws_ok(
  $$ select public.submit_round_response(current_setting('tests.ctx_code')::uuid,
     '{"mood":true,"safety":0,"engagement":2,"fomo":3,"socialAspects":1,"predictability":4}'::jsonb) $$,
  'invalid_answers', 'boolean value is rejected');
select throws_ok(
  $$ select public.submit_round_response(current_setting('tests.ctx_code')::uuid,
     '{"mood":[1],"safety":0,"engagement":2,"fomo":3,"socialAspects":1,"predictability":4}'::jsonb) $$,
  'invalid_answers', 'array value is rejected');
select throws_ok(
  $$ select public.submit_round_response(current_setting('tests.ctx_code')::uuid,
     '{"mood":null,"safety":0,"engagement":2,"fomo":3,"socialAspects":1,"predictability":4}'::jsonb) $$,
  'invalid_answers', 'null value is rejected');

-- Close Round 1, then confirm it is unavailable and rejects submissions.
select tests.authenticate_as('teacher_a');
select public.set_round_status(current_setting('tests.ctx_round')::uuid, 'closed');
select is((public.get_public_round(current_setting('tests.ctx_code')::uuid)) ->> 'available',
  'false', 'get_public_round: closed round is unavailable');

select tests.clear_authentication();
select throws_ok(
  $$ select public.submit_round_response(current_setting('tests.ctx_code')::uuid,
     '{"mood":2,"safety":0,"engagement":2,"fomo":3,"socialAspects":1,"predictability":4}'::jsonb) $$,
  'submission_unavailable', 'submission to a closed round is rejected');

select * from finish();
rollback;
