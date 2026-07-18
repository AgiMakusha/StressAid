-- 03-rls-threshold.sql
-- RLS is enabled; anon/authenticated have no direct sensitive table access;
-- teachers are isolated; below-threshold dashboards return no distributions.
begin;
select plan(26);

-- 1) RLS enabled on all three application tables.
select tests.rls_enabled('public', 'campaigns');
select tests.rls_enabled('public', 'assessment_rounds');
select tests.rls_enabled('public', 'round_section_aggregates');

-- 2) anon has NO direct table privileges (catalog checks, no role switch).
select ok(not has_table_privilege('anon', 'public.campaigns', 'SELECT'), 'anon: no SELECT campaigns');
select ok(not has_table_privilege('anon', 'public.campaigns', 'INSERT'), 'anon: no INSERT campaigns');
select ok(not has_table_privilege('anon', 'public.campaigns', 'UPDATE'), 'anon: no UPDATE campaigns');
select ok(not has_table_privilege('anon', 'public.campaigns', 'DELETE'), 'anon: no DELETE campaigns');
select ok(not has_table_privilege('anon', 'public.assessment_rounds', 'SELECT'), 'anon: no SELECT rounds');
select ok(not has_table_privilege('anon', 'public.assessment_rounds', 'INSERT'), 'anon: no INSERT rounds');
select ok(not has_table_privilege('anon', 'public.assessment_rounds', 'UPDATE'), 'anon: no UPDATE rounds');
select ok(not has_table_privilege('anon', 'public.assessment_rounds', 'DELETE'), 'anon: no DELETE rounds');
select ok(not has_table_privilege('anon', 'public.round_section_aggregates', 'SELECT'), 'anon: no SELECT aggregates');
select ok(not has_table_privilege('anon', 'public.round_section_aggregates', 'INSERT'), 'anon: no INSERT aggregates');
select ok(not has_table_privilege('anon', 'public.round_section_aggregates', 'UPDATE'), 'anon: no UPDATE aggregates');
select ok(not has_table_privilege('anon', 'public.round_section_aggregates', 'DELETE'), 'anon: no DELETE aggregates');

-- 3) authenticated has NO direct access to the aggregates table (reads via RPC only).
select ok(not has_table_privilege('authenticated', 'public.round_section_aggregates', 'SELECT'), 'authenticated: no SELECT aggregates');
select ok(not has_table_privilege('authenticated', 'public.round_section_aggregates', 'INSERT'), 'authenticated: no INSERT aggregates');
select ok(not has_table_privilege('authenticated', 'public.round_section_aggregates', 'UPDATE'), 'authenticated: no UPDATE aggregates');
select ok(not has_table_privilege('authenticated', 'public.round_section_aggregates', 'DELETE'), 'authenticated: no DELETE aggregates');

-- 4) Cross-teacher isolation.
select tests.create_supabase_user('teacher_a');
select tests.create_supabase_user('teacher_b');

select tests.authenticate_as('teacher_a');
create temporary table _a on commit drop as
select public.create_campaign('A campaign', 'Class A', 12, 10, 'en') as created;

select is((select jsonb_array_length(public.list_my_campaigns())), 1, 'teacher A sees their campaign');

select tests.authenticate_as('teacher_b');
select is((select jsonb_array_length(public.list_my_campaigns())), 0, 'teacher B sees no campaigns');

select throws_ok(
  $$ select public.get_round_dashboard(((select created ->> 'roundId' from _a))::uuid) $$,
  'round_not_found', 'cross-teacher dashboard access is denied');

select is(
  (select count(*)::int from public.campaigns
    where id = ((select created ->> 'campaignId' from _a))::uuid),
  0,
  'RLS hides another teacher''s campaign row from B');

-- 5) anon runtime lockout.
select tests.clear_authentication();
select throws_ok(
  $$ insert into public.campaigns (owner_id, title, class_display_name, expected_participant_count)
     values (gen_random_uuid(), 't', 'c', 10) $$,
  '42501', NULL, 'anon cannot insert campaigns directly');

-- 6) Below-threshold gating: no distributions returned.
select tests.authenticate_as('teacher_a');
create temporary table _d on commit drop as
select public.get_round_dashboard(((select created ->> 'roundId' from _a))::uuid) as d;

select is((select (d ->> 'resultsAvailable')::boolean from _d), false, 'below threshold: resultsAvailable is false');
select ok((select not (d ? 'sections') from _d), 'below threshold: no sections key present');

select * from finish();
rollback;
