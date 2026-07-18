-- 00-setup.sql
-- LOCAL TEST SETUP ONLY. Runs first (alphabetical) under `supabase test db`.
-- This file is intentionally NOT a migration: it installs pgTAP and the
-- supported Supabase pgTAP test helpers into the LOCAL test database only, and
-- is NEVER installed into the production/application schema. It commits (no
-- ROLLBACK) so the extensions/functions persist for the remaining test files in
-- the same run.
--
-- ---------------------------------------------------------------------------
-- Vendored dependency: basejump "supabase_test_helpers"
--   Project / source: https://github.com/usebasejump/supabase-test-helpers
--   Vendored version:  v0.0.6 (file: supabase_test_helpers--0.0.6.sql)
--   Vendored verbatim below (schemas `tests` + `test_overrides` and helper
--   functions). Installed directly as SQL instead of via the network
--   `dbdev`/`pg_tle` bootstrap (which requires a live call to api.database.dev
--   and is unreliable in CI/offline). NO network dependency is used.
--   These helpers create real `auth.users` rows so the owner foreign key is
--   satisfied without any brittle handcrafted partial insert, and are
--   transaction-scoped inside each test file.
--
-- Upstream license (MIT):
--   Copyright 2023 usebasejump.com
--
--   Permission is hereby granted, free of charge, to any person obtaining a
--   copy of this software and associated documentation files (the "Software"),
--   to deal in the Software without restriction, including without limitation
--   the rights to use, copy, modify, merge, publish, distribute, sublicense,
--   and/or sell copies of the Software, and to permit persons to whom the
--   Software is furnished to do so, subject to the following conditions:
--
--   The above copyright notice and this permission notice shall be included in
--   all copies or substantial portions of the Software.
--
--   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
--   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
--   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
--   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
--   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
--   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
--   DEALINGS IN THE SOFTWARE.
-- ---------------------------------------------------------------------------

-- pgTAP itself + uuid generation used by the helpers.
create extension if not exists pgtap with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;

-- ============================ vendored helpers ============================
create schema if not exists tests;
create schema if not exists test_overrides;

grant usage on schema tests to anon, authenticated, service_role;
alter default privileges in schema tests revoke execute on functions from public;
alter default privileges in schema tests grant execute on functions to anon, authenticated, service_role;

grant usage on schema test_overrides to anon, authenticated, service_role;
alter default privileges in schema test_overrides revoke execute on functions from public;
alter default privileges in schema test_overrides grant execute on functions to anon, authenticated, service_role;

create or replace function tests.create_supabase_user(identifier text, email text default null, phone text default null, metadata jsonb default null)
returns uuid
  security definer
  set search_path = auth, pg_temp
as $$
declare
  user_id uuid;
begin
  user_id := extensions.uuid_generate_v4();
  insert into auth.users (id, email, phone, raw_user_meta_data, raw_app_meta_data, created_at, updated_at)
  values (user_id, coalesce(email, concat(user_id, '@test.com')), phone, jsonb_build_object('test_identifier', identifier) || coalesce(metadata, '{}'::jsonb), '{}'::jsonb, now(), now())
  returning id into user_id;
  return user_id;
end;
$$ language plpgsql;

create or replace function tests.get_supabase_user(identifier text)
returns json
  security definer
  set search_path = auth, pg_temp
as $$
declare
  supabase_user json;
begin
  select json_build_object(
    'id', id,
    'email', email,
    'phone', phone,
    'raw_user_meta_data', raw_user_meta_data,
    'raw_app_meta_data', raw_app_meta_data
  ) into supabase_user
  from auth.users
  where raw_user_meta_data ->> 'test_identifier' = identifier limit 1;

  if supabase_user is null or supabase_user -> 'id' is null then
    raise exception 'User with identifier % not found', identifier;
  end if;
  return supabase_user;
end;
$$ language plpgsql;

create or replace function tests.get_supabase_uid(identifier text)
returns uuid
  security definer
  set search_path = auth, pg_temp
as $$
declare
  supabase_user uuid;
begin
  select id into supabase_user from auth.users where raw_user_meta_data ->> 'test_identifier' = identifier limit 1;
  if supabase_user is null then
    raise exception 'User with identifier % not found', identifier;
  end if;
  return supabase_user;
end;
$$ language plpgsql;

create or replace function tests.authenticate_as(identifier text)
returns void
as $$
declare
  user_data json;
  original_auth_data text;
begin
  original_auth_data := current_setting('request.jwt.claims', true);
  user_data := tests.get_supabase_user(identifier);

  if user_data is null or user_data ->> 'id' is null then
    raise exception 'User with identifier % not found', identifier;
  end if;

  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object(
    'sub', user_data ->> 'id',
    'email', user_data ->> 'email',
    'phone', user_data ->> 'phone',
    'user_metadata', user_data -> 'raw_user_meta_data',
    'app_metadata', user_data -> 'raw_app_meta_data'
  )::text, true);
exception
  when others then
    set local role authenticated;
    set local "request.jwt.claims" to original_auth_data;
    raise;
end
$$ language plpgsql;

create or replace function tests.authenticate_as_service_role()
returns void
as $$
begin
  perform set_config('role', 'service_role', true);
  perform set_config('request.jwt.claims', null, true);
end
$$ language plpgsql;

create or replace function tests.clear_authentication()
returns void as $$
begin
  perform set_config('role', 'anon', true);
  perform set_config('request.jwt.claims', null, true);
end
$$ language plpgsql;

create or replace function tests.rls_enabled(testing_schema text, testing_table text)
returns text as $$
  select is(
    (select count(*)::integer
       from pg_class pc
       join pg_namespace pn on pn.oid = pc.relnamespace and pn.nspname = rls_enabled.testing_schema and pc.relname = rls_enabled.testing_table
       join pg_type pt on pt.oid = pc.reltype
       where relrowsecurity = TRUE),
    1,
    testing_table || ' table in the ' || testing_schema || ' schema should have row level security enabled'
  );
$$ language sql;

-- Emit a minimal TAP plan so the harness records a clean pass for setup.
select plan(1);
select ok(true, 'test helpers installed');
select * from finish();
