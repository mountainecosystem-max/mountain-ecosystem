-- ==============================================================================
-- MOUNTAIN ECOSYSTEM: COMPLETE AUTHENTICATION & AUTHORIZATION MIGRATION
-- File: supabase/complete_auth_authorization_migration.sql
--
-- This migration guarantees:
-- 1. Two Completely Separate Experiences:
--    - Public Platform: Google OAuth & member auth for community posting, applications, and enquiries.
--    - Admin Portal: Strictly staff email/password authentication via public.admin_users.
-- 2. Anti Self-Promotion Security:
--    - user_metadata.role is NEVER trusted for authorization.
--    - Only public.is_admin() (backed by public.admin_users and app_metadata) grants admin rights.
--    - Google signup and public accounts NEVER receive admin privileges automatically.
-- 3. Content Ownership & Privacy:
--    - Dispatches: Authenticated users can publish; authors can edit/delete own dispatches; admins moderate all.
--    - Applications & Enquiries: Applicants can view only their own records; admins view all; public cannot read applicant PII.
--    - Platform Content (Destinations, Jobs, Homestays): Public reads published; only staff can create/modify/delete.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Ensure public.admin_users Exists with Proper Constraints
-- ------------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'admin' check (role in ('superadmin', 'admin', 'editor', 'moderator')),
  created_at timestamptz default now()
);

alter table public.admin_users enable row level security;
create index if not exists idx_admin_users_lookup on public.admin_users (user_id, email, role);

-- ------------------------------------------------------------------------------
-- 2. Hardened public.is_admin() Security Definer Function
-- ------------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public, auth, pg_temp
stable
as $$
  select exists (
    select 1 from public.admin_users
    where (user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email'))
      and role in ('superadmin', 'admin', 'editor', 'moderator')
  ) or (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('superadmin', 'admin', 'editor', 'moderator')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 3. Add user_id to Community & Application Tables (Safe & Idempotent)
-- ------------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='community_dispatches' and column_name='user_id') then
    alter table public.community_dispatches add column user_id uuid references auth.users(id) on delete set null;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='job_applications' and column_name='user_id') then
    alter table public.job_applications add column user_id uuid references auth.users(id) on delete set null;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='lease_inquiries' and column_name='user_id') then
    alter table public.lease_inquiries add column user_id uuid references auth.users(id) on delete set null;
  end if;

  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='fellowship_applications' and column_name='user_id') then
    alter table public.fellowship_applications add column user_id uuid references auth.users(id) on delete set null;
  end if;
end $$;

-- ------------------------------------------------------------------------------
-- 4. Clean Dynamic Drop of Preexisting Policies to Prevent Conflicts
-- ------------------------------------------------------------------------------
do $$
declare
  pol record;
begin
  for pol in (
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'admin_users',
        'destinations',
        'community_dispatches',
        'jobs',
        'job_applications',
        'homestays',
        'lease_inquiries',
        'fellowship_applications',
        'architectural_specimens'
      )
  ) loop
    execute format('drop policy if exists %I on %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  end loop;
end $$;

-- ------------------------------------------------------------------------------
-- 5. RLS Policies: public.admin_users
-- ------------------------------------------------------------------------------
create policy "admin_users_select"
  on public.admin_users for select to authenticated
  using (
    user_id = auth.uid()
    or lower(email) = lower(auth.jwt() ->> 'email')
    or public.is_admin()
  );

create policy "admin_users_insert"
  on public.admin_users for insert to authenticated
  with check (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'superadmin'
    or exists (
      select 1 from public.admin_users
      where (user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email'))
        and role = 'superadmin'
    )
  );

create policy "admin_users_update"
  on public.admin_users for update to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'superadmin'
    or exists (
      select 1 from public.admin_users
      where (user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email'))
        and role = 'superadmin'
    )
  );

create policy "admin_users_delete"
  on public.admin_users for delete to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'superadmin'
    or exists (
      select 1 from public.admin_users
      where (user_id = auth.uid() or lower(email) = lower(auth.jwt() ->> 'email'))
        and role = 'superadmin'
    )
  );

-- ------------------------------------------------------------------------------
-- 6. RLS Policies: Destinations & Core Content (Admin CRUD, Public Read Published)
-- ------------------------------------------------------------------------------
alter table public.destinations enable row level security;

create policy "destinations_select"
  on public.destinations for select
  using (is_published = true or public.is_admin());

create policy "destinations_insert"
  on public.destinations for insert to authenticated
  with check (public.is_admin());

create policy "destinations_update"
  on public.destinations for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "destinations_delete"
  on public.destinations for delete to authenticated
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. RLS Policies: Community Dispatches (Public Read, Member Insert, Author/Admin Edit)
-- ------------------------------------------------------------------------------
alter table public.community_dispatches enable row level security;

create policy "community_dispatches_select"
  on public.community_dispatches for select
  using (is_published = true or user_id = auth.uid() or public.is_admin());

create policy "community_dispatches_insert"
  on public.community_dispatches for insert to authenticated
  with check (true);

create policy "community_dispatches_update"
  on public.community_dispatches for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "community_dispatches_delete"
  on public.community_dispatches for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ------------------------------------------------------------------------------
-- 8. RLS Policies: Jobs & Applications
-- ------------------------------------------------------------------------------
alter table public.jobs enable row level security;

create policy "jobs_select"
  on public.jobs for select
  using (is_published = true or public.is_admin());

create policy "jobs_admin_insert"
  on public.jobs for insert to authenticated
  with check (public.is_admin());

create policy "jobs_admin_update"
  on public.jobs for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "jobs_admin_delete"
  on public.jobs for delete to authenticated
  using (public.is_admin());

-- Applications: Insert by anyone/member, Select by author or admin, Update/Delete by admin
alter table public.job_applications enable row level security;

create policy "job_applications_select"
  on public.job_applications for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "job_applications_insert"
  on public.job_applications for insert
  with check (true);

create policy "job_applications_admin_update"
  on public.job_applications for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "job_applications_admin_delete"
  on public.job_applications for delete to authenticated
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 9. RLS Policies: Homestays & Lease Inquiries
-- ------------------------------------------------------------------------------
alter table public.homestays enable row level security;

create policy "homestays_select"
  on public.homestays for select
  using (is_published = true or public.is_admin());

create policy "homestays_admin_insert"
  on public.homestays for insert to authenticated
  with check (public.is_admin());

create policy "homestays_admin_update"
  on public.homestays for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "homestays_admin_delete"
  on public.homestays for delete to authenticated
  using (public.is_admin());

alter table public.lease_inquiries enable row level security;

create policy "lease_inquiries_select"
  on public.lease_inquiries for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "lease_inquiries_insert"
  on public.lease_inquiries for insert
  with check (true);

create policy "lease_inquiries_admin_update"
  on public.lease_inquiries for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "lease_inquiries_admin_delete"
  on public.lease_inquiries for delete to authenticated
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 10. RLS Policies: Fellowship Applications
-- ------------------------------------------------------------------------------
alter table public.fellowship_applications enable row level security;

create policy "fellowship_applications_select"
  on public.fellowship_applications for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "fellowship_applications_insert"
  on public.fellowship_applications for insert
  with check (true);

create policy "fellowship_applications_admin_update"
  on public.fellowship_applications for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------------------------
-- 11. Role Grants & Schema Security
-- ------------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on public.destinations, public.jobs, public.homestays, public.community_dispatches to anon, authenticated;

grant insert on public.community_dispatches to authenticated;
grant update, delete on public.community_dispatches to authenticated;

grant insert on public.job_applications, public.lease_inquiries, public.fellowship_applications to anon, authenticated;
grant select on public.job_applications, public.lease_inquiries, public.fellowship_applications to authenticated;

grant select on public.admin_users to authenticated;

grant insert, update, delete on public.destinations, public.jobs, public.homestays to authenticated;
grant update, delete on public.job_applications, public.lease_inquiries, public.fellowship_applications to authenticated;
