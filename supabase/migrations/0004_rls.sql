-- 0004_rls.sql
-- Row Level Security + narrow grants.
--
-- campaigns / assessment_rounds : teachers get owner-scoped direct access.
-- round_section_aggregates      : NO direct client access at all; only the
--                                 SECURITY DEFINER RPCs (owned by postgres)
--                                 read/write it. Anonymous students never touch
--                                 tables directly.

alter table public.campaigns enable row level security;
alter table public.assessment_rounds enable row level security;
alter table public.round_section_aggregates enable row level security;

-- ---- campaigns ----------------------------------------------------------
grant select, insert, update, delete on public.campaigns to authenticated;

create policy campaigns_select_own on public.campaigns
  for select to authenticated
  using (owner_id = auth.uid());

create policy campaigns_insert_own on public.campaigns
  for insert to authenticated
  with check (owner_id = auth.uid());

create policy campaigns_update_own on public.campaigns
  for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy campaigns_delete_own on public.campaigns
  for delete to authenticated
  using (owner_id = auth.uid());

-- ---- assessment_rounds --------------------------------------------------
grant select, insert, update, delete on public.assessment_rounds to authenticated;

create policy rounds_select_own on public.assessment_rounds
  for select to authenticated
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id and c.owner_id = auth.uid()
    )
  );

create policy rounds_insert_own on public.assessment_rounds
  for insert to authenticated
  with check (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id and c.owner_id = auth.uid()
    )
  );

create policy rounds_update_own on public.assessment_rounds
  for update to authenticated
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id and c.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id and c.owner_id = auth.uid()
    )
  );

create policy rounds_delete_own on public.assessment_rounds
  for delete to authenticated
  using (
    exists (
      select 1 from public.campaigns c
      where c.id = campaign_id and c.owner_id = auth.uid()
    )
  );

-- ---- round_section_aggregates -------------------------------------------
-- No grants, no policies: RLS is enabled and denies all direct access for anon
-- and authenticated. Only SECURITY DEFINER RPCs (owner = postgres) may touch it.
revoke all on public.round_section_aggregates from anon, authenticated;
