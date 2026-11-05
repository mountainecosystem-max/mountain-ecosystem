-- ==============================================================================
-- COMMUNITY POSTING & RLS MIGRATION
-- Mountain Ecosystem Platform
--
-- PURPOSE:
-- 1. Enable any authenticated user (logged in via Google or member session)
--    to publish community dispatches to the community ledger.
-- 2. Preserve strict admin-only update and delete controls.
-- 3. Maintain 100% security on admin_users, destinations, and settings.
-- ==============================================================================

-- 1. Grant table insertion permissions on community_dispatches to authenticated users
grant insert on public.community_dispatches to authenticated;

-- 2. Drop existing insert policy if present to ensure idempotency
drop policy if exists "Allow authenticated insert community_dispatches" on public.community_dispatches;

-- 3. Create RLS policy allowing any authenticated user to insert new dispatches
create policy "Allow authenticated insert community_dispatches"
  on public.community_dispatches
  for insert
  to authenticated
  with check (true);

-- 4. Verify existing admin full access policies remain active
drop policy if exists "Allow authenticated admin full access to community_dispatches" on public.community_dispatches;
create policy "Allow authenticated admin full access to community_dispatches"
  on public.community_dispatches
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 5. Verification query
select
  'community_posting_migration executed successfully' as status,
  count(*) as active_dispatch_policies
from pg_policies
where schemaname = 'public' and tablename = 'community_dispatches';
