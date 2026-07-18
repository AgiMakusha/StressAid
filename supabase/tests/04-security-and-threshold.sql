-- 04-security-and-threshold.sql
-- SECURITY DEFINER hardening + execute-grant matrix, and at-threshold behaviour
-- (exactly six sections in canonical order with equal totals).
begin;
select plan(25);

-- ---- SECURITY DEFINER hardening: secdef + safe fixed search_path ----------
create or replace function tests._fn_hardened(fn_name text)
returns boolean language sql as $$
  select exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = _fn_hardened.fn_name
      and p.prosecdef
      and p.proconfig @> array['search_path=pg_catalog, pg_temp']
  );
$$;

select ok(tests._fn_hardened('get_public_round'), 'get_public_round: SECURITY DEFINER + safe search_path');
select ok(tests._fn_hardened('submit_round_response'), 'submit_round_response: SECURITY DEFINER + safe search_path');
select ok(tests._fn_hardened('create_campaign'), 'create_campaign: SECURITY DEFINER + safe search_path');
select ok(tests._fn_hardened('start_new_round'), 'start_new_round: SECURITY DEFINER + safe search_path');
select ok(tests._fn_hardened('list_my_campaigns'), 'list_my_campaigns: SECURITY DEFINER + safe search_path');
select ok(tests._fn_hardened('get_round_dashboard'), 'get_round_dashboard: SECURITY DEFINER + safe search_path');
select ok(tests._fn_hardened('set_round_status'), 'set_round_status: SECURITY DEFINER + safe search_path');
select ok(tests._fn_hardened('seed_round_aggregates'), 'seed_round_aggregates: SECURITY DEFINER + safe search_path');

-- ---- EXECUTE-grant matrix -------------------------------------------------
-- Public RPCs: anon may execute.
select ok(has_function_privilege('anon', 'public.get_public_round(uuid)', 'EXECUTE'), 'anon may execute get_public_round');
select ok(has_function_privilege('anon', 'public.submit_round_response(uuid, jsonb)', 'EXECUTE'), 'anon may execute submit_round_response');

-- Teacher RPCs: anon may NOT execute.
select ok(not has_function_privilege('anon', 'public.create_campaign(text, text, integer, integer, text)', 'EXECUTE'), 'anon may not execute create_campaign');
select ok(not has_function_privilege('anon', 'public.start_new_round(uuid, text)', 'EXECUTE'), 'anon may not execute start_new_round');
select ok(not has_function_privilege('anon', 'public.list_my_campaigns()', 'EXECUTE'), 'anon may not execute list_my_campaigns');
select ok(not has_function_privilege('anon', 'public.get_round_dashboard(uuid)', 'EXECUTE'), 'anon may not execute get_round_dashboard');
select ok(not has_function_privilege('anon', 'public.set_round_status(uuid, text)', 'EXECUTE'), 'anon may not execute set_round_status');

-- Teacher RPCs: authenticated may execute.
select ok(has_function_privilege('authenticated', 'public.create_campaign(text, text, integer, integer, text)', 'EXECUTE'), 'authenticated may execute create_campaign');
select ok(has_function_privilege('authenticated', 'public.get_round_dashboard(uuid)', 'EXECUTE'), 'authenticated may execute get_round_dashboard');
select ok(has_function_privilege('authenticated', 'public.submit_round_response(uuid, jsonb)', 'EXECUTE'), 'authenticated may execute submit_round_response');

-- Trigger helper is NOT executable by client roles.
select ok(not has_function_privilege('anon', 'public.seed_round_aggregates()', 'EXECUTE'), 'anon may not execute seed_round_aggregates');
select ok(not has_function_privilege('authenticated', 'public.seed_round_aggregates()', 'EXECUTE'), 'authenticated may not execute seed_round_aggregates');

-- ---- At-threshold behaviour ----------------------------------------------
select tests.create_supabase_user('teacher_t');
select tests.authenticate_as('teacher_t');

create temporary table _t on commit drop as
select public.create_campaign('Threshold check', 'Class T', 10, 10, 'en') as created;
select set_config('tests.t_code', (select created ->> 'publicCode' from _t), true);
select set_config('tests.t_round', (select created ->> 'roundId' from _t), true);

-- Submit exactly threshold (10) identical responses as anon.
select tests.clear_authentication();
do $$
declare i int;
begin
  for i in 1..10 loop
    perform public.submit_round_response(
      current_setting('tests.t_code')::uuid,
      '{"mood":3,"safety":3,"engagement":3,"fomo":3,"socialAspects":3,"predictability":3}'::jsonb);
  end loop;
end $$;

select tests.authenticate_as('teacher_t');
create temporary table _dash on commit drop as
select public.get_round_dashboard(current_setting('tests.t_round')::uuid) as d;

select is((select (d ->> 'resultsAvailable')::boolean from _dash), true, 'at threshold: results available');
select is((select jsonb_array_length(d -> 'sections') from _dash), 6, 'at threshold: exactly six sections');
select is(
  (select jsonb_agg(s ->> 'sectionId') from _dash, jsonb_array_elements(d -> 'sections') s),
  '["mood","safety","engagement","fomo","socialAspects","predictability"]'::jsonb,
  'at threshold: canonical section order');
select is((select (d ->> 'responseCount')::int from _dash), 10, 'at threshold: response count equals threshold');
select is(
  (select count(distinct (x.never + x.rarely + x.sometimes + x.often + x.always))::int
     from _dash, jsonb_to_recordset(d -> 'sections')
       as x(never int, rarely int, sometimes int, often int, always int)),
  1,
  'at threshold: all six section totals are equal');

select * from finish();
rollback;
