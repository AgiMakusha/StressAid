-- 01-schema.sql
-- Schema shape + seeding. Uses BEGIN/ROLLBACK isolation.
begin;
select plan(9);

-- The three aggregate-only tables exist.
select has_table('public', 'campaigns', 'campaigns table exists');
select has_table('public', 'assessment_rounds', 'assessment_rounds table exists');
select has_table('public', 'round_section_aggregates', 'aggregates table exists');

-- There is NO individual-response table.
select hasnt_table('public', 'responses', 'no individual responses table');
select hasnt_table('public', 'round_responses', 'no individual round responses table');

-- A transaction-scoped teacher and campaign for seeding checks.
select tests.create_supabase_user('teacher_a');
select tests.authenticate_as('teacher_a');

select lives_ok(
  $$ select public.create_campaign('Class check-in', 'Class 8B', 24, 10, 'en') $$,
  'create_campaign succeeds for an authenticated teacher'
);

-- Inspect the aggregate table directly as the superuser (authenticated has no
-- direct access to it by design; reads go through RPCs).
set local role postgres;

-- The first round received exactly six aggregate rows...
select is(
  (select count(*)::int
     from public.round_section_aggregates a
     join public.assessment_rounds r on r.id = a.round_id
     join public.campaigns c on c.id = r.campaign_id
    where c.owner_id = tests.get_supabase_uid('teacher_a')),
  6,
  'first round seeded with exactly six aggregate rows'
);

-- ...using the canonical section values.
select set_eq(
  $$ select a.section_id
       from public.round_section_aggregates a
       join public.assessment_rounds r on r.id = a.round_id
       join public.campaigns c on c.id = r.campaign_id
      where c.owner_id = tests.get_supabase_uid('teacher_a') $$,
  $$ values ('mood'),('safety'),('engagement'),('fomo'),('socialAspects'),('predictability') $$,
  'canonical section ids seeded'
);

-- Counters start at zero (Mood-derived response count = 0).
select is(
  (select (a.never_count + a.rarely_count + a.sometimes_count
             + a.often_count + a.always_count)
     from public.round_section_aggregates a
     join public.assessment_rounds r on r.id = a.round_id
     join public.campaigns c on c.id = r.campaign_id
    where c.owner_id = tests.get_supabase_uid('teacher_a')
      and a.section_id = 'mood'),
  0,
  'seeded counters start at zero'
);

select * from finish();
rollback;
