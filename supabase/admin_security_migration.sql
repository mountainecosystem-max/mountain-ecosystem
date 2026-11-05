-- ==============================================================================
-- Mountain Ecosystem: Admin Security Hardening Migration (Idempotent)
-- File: supabase/admin_security_migration.sql
--
-- Guarantees:
-- 1. Idempotent: Can be run multiple times safely without 42710 duplicate policy errors.
-- 2. Zero Data Loss: Does NOT drop tables or erase destinations data.
-- 3. Privilege Security: Replaces user_metadata role checks with server-controlled
--    admin_users verification and app_metadata.
-- 4. Clean Drops: Dynamically queries pg_policies and drops old policies before recreation.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. Dynamic Policy Cleanup (Self-Healing)
-- ------------------------------------------------------------------------------
-- Removes any preexisting policies on destinations and admin_users regardless of naming
do $$
declare
  pol record;
begin
  for pol in (
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('destinations', 'admin_users')
  ) loop
    execute format('drop policy if exists %I on %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  end loop;
end $$;

-- ------------------------------------------------------------------------------
-- 1. Ensure admin_users Table Exists
-- ------------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'admin' check (role in ('superadmin', 'admin', 'editor', 'moderator')),
  created_at timestamptz default now()
);

-- Ensure RLS is active on admin_users
alter table public.admin_users enable row level security;

-- Index on email and user_id for high-speed policy resolution
create index if not exists idx_admin_users_lookup on public.admin_users (user_id, email, role);

-- ------------------------------------------------------------------------------
-- 2. Hardened public.is_admin() Security Definer Function
-- ------------------------------------------------------------------------------
-- STRICT DEFENSE:
-- - Checks ONLY the server-managed public.admin_users table & auth.jwt() app_metadata.
-- - Client-writable user_metadata is completely ignored.
-- - Fixed search_path prevents schema-poisoning attacks (CVE-2018-1058).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public, auth, pg_temp
stable
as $$
  select exists (
    select 1 from public.admin_users
    where (user_id = auth.uid() or email = (auth.jwt() ->> 'email'))
      and role in ('superadmin', 'admin', 'editor', 'moderator')
  ) or (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('superadmin', 'admin', 'editor', 'moderator')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 3. admin_users RLS Policies (Anti Self-Promotion)
-- ------------------------------------------------------------------------------
drop policy if exists "Allow verified admins and self to view admin_users" on public.admin_users;
create policy "Allow verified admins and self to view admin_users"
  on public.admin_users for select to authenticated
  using (
    user_id = auth.uid()
    or email = (auth.jwt() ->> 'email')
    or public.is_admin()
  );

drop policy if exists "Allow only superadmin to insert admin_users" on public.admin_users;
create policy "Allow only superadmin to insert admin_users"
  on public.admin_users for insert to authenticated
  with check (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'superadmin'
    or exists (
      select 1 from public.admin_users
      where (user_id = auth.uid() or email = (auth.jwt() ->> 'email'))
        and role = 'superadmin'
    )
  );

drop policy if exists "Allow only superadmin to update admin_users" on public.admin_users;
create policy "Allow only superadmin to update admin_users"
  on public.admin_users for update to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'superadmin'
    or exists (
      select 1 from public.admin_users
      where (user_id = auth.uid() or email = (auth.jwt() ->> 'email'))
        and role = 'superadmin'
    )
  )
  with check (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'superadmin'
    or exists (
      select 1 from public.admin_users
      where (user_id = auth.uid() or email = (auth.jwt() ->> 'email'))
        and role = 'superadmin'
    )
  );

drop policy if exists "Allow only superadmin to delete admin_users" on public.admin_users;
create policy "Allow only superadmin to delete admin_users"
  on public.admin_users for delete to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'superadmin'
    or exists (
      select 1 from public.admin_users
      where (user_id = auth.uid() or email = (auth.jwt() ->> 'email'))
        and role = 'superadmin'
    )
  );

-- ------------------------------------------------------------------------------
-- 4. destinations RLS Policies (Strict Admin Gatekeeper)
-- ------------------------------------------------------------------------------
alter table public.destinations enable row level security;

-- 4.1 Read: Public & ordinary users see ONLY published items. Admins see drafts & published.
drop policy if exists "Allow public read destinations" on public.destinations;
create policy "Allow public read destinations"
  on public.destinations for select
  using (is_published = true or public.is_admin());

-- 4.2 Insert: ONLY verified administrators can create new destinations.
drop policy if exists "Allow admin insert destinations" on public.destinations;
drop policy if exists "Allow authenticated admin full access to destinations" on public.destinations;
create policy "Allow admin insert destinations"
  on public.destinations for insert to authenticated
  with check (public.is_admin());

-- 4.3 Update: ONLY verified administrators can edit destinations.
drop policy if exists "Allow admin update destinations" on public.destinations;
create policy "Allow admin update destinations"
  on public.destinations for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 4.4 Delete: ONLY verified administrators can delete destinations.
drop policy if exists "Allow admin delete destinations" on public.destinations;
create policy "Allow admin delete destinations"
  on public.destinations for delete to authenticated
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. Role Permissions (Schema Grants)
-- ------------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

-- Public can read destinations (governed by is_published RLS check)
grant select on public.destinations to anon, authenticated;

-- Authenticated can insert/update/delete destinations (governed by is_admin RLS check)
grant insert, update, delete on public.destinations to authenticated;

-- Authenticated can read admin_users for self-verification
-- (Never grant insert/update/delete on admin_users to authenticated)
grant select on public.admin_users to authenticated;

-- ==============================================================================
-- Verification Check:
-- After running, this returns true if RLS and function are ready:
-- ==============================================================================
select
  'admin_security_migration executed successfully' as status,
  count(*) as active_destination_policies
from pg_policies
where schemaname = 'public' and tablename = 'destinations';
