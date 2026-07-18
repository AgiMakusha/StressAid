-- 0003_triggers.sql
-- Aggregate-row seeding. Every new round automatically receives exactly six
-- zeroed section aggregate rows, atomically, in canonical section order.
--
-- SECURITY DEFINER (owned by the migration role `postgres`) so the six inserts
-- succeed even when the round was inserted by a teacher whose RLS grants do not
-- include the aggregate table. Fully qualified names, fixed safe search_path,
-- no dynamic SQL.

create or replace function public.seed_round_aggregates()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
begin
  insert into public.round_section_aggregates (round_id, section_id)
  values
    (new.id, 'mood'),
    (new.id, 'safety'),
    (new.id, 'engagement'),
    (new.id, 'fomo'),
    (new.id, 'socialAspects'),
    (new.id, 'predictability');
  return new;
end;
$$;

-- This helper is a trigger, never an API. Remove any client EXECUTE.
revoke all on function public.seed_round_aggregates()
  from public, anon, authenticated, service_role;

create trigger seed_round_aggregates_after_insert
  after insert on public.assessment_rounds
  for each row
  execute function public.seed_round_aggregates();
