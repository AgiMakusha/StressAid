-- 0001_hardening.sql
-- Privilege hardening for the public schema.
--
-- The public beta uses only two client roles: `anon` (students, via approved
-- SECURITY DEFINER RPCs) and `authenticated` (teachers, via owner-scoped RLS +
-- SECURITY DEFINER RPCs). There is NO service-role client in the application.
--
-- We remove ambient/default privileges so that newly created tables, sequences
-- and functions are NOT automatically executable/readable by client roles.
-- Access is then granted explicitly and narrowly in later migrations.

-- No one may create objects in the public schema by default.
revoke create on schema public from public;

-- Do not auto-grant on future objects created by the migration role.
alter default privileges for role postgres in schema public
  revoke all on tables from public, anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke all on sequences from public, anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke all on functions from public, anon, authenticated, service_role;
