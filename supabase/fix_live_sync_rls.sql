-- ==============================================================================
-- MOUNTAIN ECOSYSTEM: LIVE REALTIME SYNC & PERMISSIVE RLS MIGRATION
-- File: supabase/fix_live_sync_rls.sql
--
-- PURPOSE:
-- 1. Enable visitor submissions (properties, mountain jobs, community experiences)
--    to write directly into Supabase without 401 Unauthorized errors.
-- 2. Immediately reflect submitted items in the Admin Console (/admin/properties,
--    /admin/jobs, /admin/moderation) in real-time.
-- 3. Allow staff and administrators to review, verify, publish/unpublish,
--    and delete any listing or submission.
-- ==============================================================================

-- 1. Grant usage & schema privileges
grant usage on schema public to anon, authenticated, service_role;

grant all on public.homestays to anon, authenticated, service_role;
grant all on public.mountain_jobs to anon, authenticated, service_role;
grant all on public.community_dispatches to anon, authenticated, service_role;
grant all on public.lease_inquiries to anon, authenticated, service_role;
grant all on public.job_applications to anon, authenticated, service_role;
grant all on public.fellowship_applications to anon, authenticated, service_role;

-- 2. Drop existing restrictive policies to prevent duplicate or conflict errors
drop policy if exists "homestays_select" on public.homestays;
drop policy if exists "Allow public read homestays" on public.homestays;
drop policy if exists "homestays_admin_insert" on public.homestays;
drop policy if exists "homestays_admin_update" on public.homestays;
drop policy if exists "homestays_admin_delete" on public.homestays;
drop policy if exists "Allow all read homestays" on public.homestays;
drop policy if exists "Allow all insert homestays" on public.homestays;
drop policy if exists "Allow all update homestays" on public.homestays;
drop policy if exists "Allow all delete homestays" on public.homestays;

drop policy if exists "jobs_select" on public.mountain_jobs;
drop policy if exists "Allow public read mountain_jobs" on public.mountain_jobs;
drop policy if exists "jobs_admin_insert" on public.mountain_jobs;
drop policy if exists "jobs_admin_update" on public.mountain_jobs;
drop policy if exists "jobs_admin_delete" on public.mountain_jobs;
drop policy if exists "Allow all read mountain_jobs" on public.mountain_jobs;
drop policy if exists "Allow all insert mountain_jobs" on public.mountain_jobs;
drop policy if exists "Allow all update mountain_jobs" on public.mountain_jobs;
drop policy if exists "Allow all delete mountain_jobs" on public.mountain_jobs;

drop policy if exists "community_dispatches_select" on public.community_dispatches;
drop policy if exists "Allow public read community_dispatches" on public.community_dispatches;
drop policy if exists "community_dispatches_insert" on public.community_dispatches;
drop policy if exists "community_dispatches_update" on public.community_dispatches;
drop policy if exists "community_dispatches_delete" on public.community_dispatches;
drop policy if exists "Allow authenticated insert community_dispatches" on public.community_dispatches;
drop policy if exists "Allow authenticated admin full access to community_dispatches" on public.community_dispatches;
drop policy if exists "Allow all read community_dispatches" on public.community_dispatches;
drop policy if exists "Allow all insert community_dispatches" on public.community_dispatches;
drop policy if exists "Allow all update community_dispatches" on public.community_dispatches;
drop policy if exists "Allow all delete community_dispatches" on public.community_dispatches;

drop policy if exists "lease_inquiries_select" on public.lease_inquiries;
drop policy if exists "lease_inquiries_insert" on public.lease_inquiries;
drop policy if exists "lease_inquiries_admin_update" on public.lease_inquiries;
drop policy if exists "lease_inquiries_admin_delete" on public.lease_inquiries;
drop policy if exists "Allow public anonymous insert lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow all read lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow all insert lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow all update lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow all delete lease_inquiries" on public.lease_inquiries;

drop policy if exists "job_applications_select" on public.job_applications;
drop policy if exists "job_applications_insert" on public.job_applications;
drop policy if exists "job_applications_admin_update" on public.job_applications;
drop policy if exists "job_applications_admin_delete" on public.job_applications;
drop policy if exists "Allow public anonymous insert job_applications" on public.job_applications;
drop policy if exists "Allow all read job_applications" on public.job_applications;
drop policy if exists "Allow all insert job_applications" on public.job_applications;
drop policy if exists "Allow all update job_applications" on public.job_applications;
drop policy if exists "Allow all delete job_applications" on public.job_applications;

drop policy if exists "fellowship_applications_select" on public.fellowship_applications;
drop policy if exists "fellowship_applications_insert" on public.fellowship_applications;
drop policy if exists "fellowship_applications_admin_update" on public.fellowship_applications;
drop policy if exists "Allow public anonymous insert fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow all read fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow all insert fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow all update fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow all delete fellowship_applications" on public.fellowship_applications;

-- 3. Enable RLS
alter table public.homestays enable row level security;
alter table public.mountain_jobs enable row level security;
alter table public.community_dispatches enable row level security;
alter table public.lease_inquiries enable row level security;
alter table public.job_applications enable row level security;
alter table public.fellowship_applications enable row level security;

-- 4. Setup clean, bidirectional policies
-- HOMESTAYS
create policy "Allow all read homestays" on public.homestays for select using (true);
create policy "Allow all insert homestays" on public.homestays for insert to anon, authenticated with check (true);
create policy "Allow all update homestays" on public.homestays for update to anon, authenticated using (true) with check (true);
create policy "Allow all delete homestays" on public.homestays for delete to anon, authenticated using (true);

-- MOUNTAIN JOBS
create policy "Allow all read mountain_jobs" on public.mountain_jobs for select using (true);
create policy "Allow all insert mountain_jobs" on public.mountain_jobs for insert to anon, authenticated with check (true);
create policy "Allow all update mountain_jobs" on public.mountain_jobs for update to anon, authenticated using (true) with check (true);
create policy "Allow all delete mountain_jobs" on public.mountain_jobs for delete to anon, authenticated using (true);

-- COMMUNITY DISPATCHES
create policy "Allow all read community_dispatches" on public.community_dispatches for select using (true);
create policy "Allow all insert community_dispatches" on public.community_dispatches for insert to anon, authenticated with check (true);
create policy "Allow all update community_dispatches" on public.community_dispatches for update to anon, authenticated using (true) with check (true);
create policy "Allow all delete community_dispatches" on public.community_dispatches for delete to anon, authenticated using (true);

-- LEASE INQUIRIES
create policy "Allow all read lease_inquiries" on public.lease_inquiries for select using (true);
create policy "Allow all insert lease_inquiries" on public.lease_inquiries for insert to anon, authenticated with check (true);
create policy "Allow all update lease_inquiries" on public.lease_inquiries for update to anon, authenticated using (true) with check (true);
create policy "Allow all delete lease_inquiries" on public.lease_inquiries for delete to anon, authenticated using (true);

-- JOB APPLICATIONS
create policy "Allow all read job_applications" on public.job_applications for select using (true);
create policy "Allow all insert job_applications" on public.job_applications for insert to anon, authenticated with check (true);
create policy "Allow all update job_applications" on public.job_applications for update to anon, authenticated using (true) with check (true);
create policy "Allow all delete job_applications" on public.job_applications for delete to anon, authenticated using (true);

-- FELLOWSHIP APPLICATIONS
create policy "Allow all read fellowship_applications" on public.fellowship_applications for select using (true);
create policy "Allow all insert fellowship_applications" on public.fellowship_applications for insert to anon, authenticated with check (true);
create policy "Allow all update fellowship_applications" on public.fellowship_applications for update to anon, authenticated using (true) with check (true);
create policy "Allow all delete fellowship_applications" on public.fellowship_applications for delete to anon, authenticated using (true);
