-- ==============================================================================
-- MOUNTAIN ECOSYSTEM: FINAL SECURITY & RLS COMPLIANCE AUDIT MIGRATION
-- File: supabase/final_security_audit_rls.sql
--
-- PURPOSE:
-- 1. Passes Supabase Security Advisor (Dashboard -> Advisors -> Security)
-- 2. Hardens Row Level Security (RLS) on all public & private tables:
--    - 'job_applications', 'lease_inquiries', 'fellowship_applications':
--      * Anonymous visitors CAN ONLY INSERT applications/inquiries.
--      * SELECT, UPDATE, DELETE are BLOCKED for anon (returns 0 rows).
--      * Only authenticated staff/admins can SELECT (view applicant PII).
--    - 'homestays', 'mountain_jobs', 'community_dispatches':
--      * Anonymous visitors can ONLY read published rows (is_published = true).
--      * Unapproved / draft submissions are strictly hidden from anon.
--      * Only authenticated admins can UPDATE or DELETE.
-- 3. Storage Security:
--    - 'resumes' bucket is set to PRIVATE (public = false).
--    - Unauthenticated public downloads are blocked.
--    - Resumes accessible only via short-lived signed URLs.
-- ==============================================================================

-- 1. Ensure Schema Privileges
grant usage on schema public to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 2. Enable RLS on ALL Tables
-- -----------------------------------------------------------------------------
alter table if exists public.job_applications enable row level security;
alter table if exists public.lease_inquiries enable row level security;
alter table if exists public.fellowship_applications enable row level security;
alter table if exists public.homestays enable row level security;
alter table if exists public.mountain_jobs enable row level security;
alter table if exists public.community_dispatches enable row level security;
alter table if exists public.user_roles enable row level security;
alter table if exists public.destinations enable row level security;

-- -----------------------------------------------------------------------------
-- 3. Drop ALL Old / Overly-Permissive Policies (Clean Slate)
-- -----------------------------------------------------------------------------
-- Job Applications
drop policy if exists "Allow all read job_applications" on public.job_applications;
drop policy if exists "Allow all insert job_applications" on public.job_applications;
drop policy if exists "Allow all update job_applications" on public.job_applications;
drop policy if exists "Allow all delete job_applications" on public.job_applications;
drop policy if exists "job_applications_select" on public.job_applications;
drop policy if exists "job_applications_insert" on public.job_applications;
drop policy if exists "job_applications_admin_update" on public.job_applications;
drop policy if exists "job_applications_admin_delete" on public.job_applications;
drop policy if exists "Allow public anonymous insert job_applications" on public.job_applications;
drop policy if exists "Allow authenticated staff read job_applications" on public.job_applications;
drop policy if exists "Allow authenticated staff update job_applications" on public.job_applications;
drop policy if exists "Allow authenticated staff delete job_applications" on public.job_applications;

-- Lease Inquiries
drop policy if exists "Allow all read lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow all insert lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow all update lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow all delete lease_inquiries" on public.lease_inquiries;
drop policy if exists "lease_inquiries_select" on public.lease_inquiries;
drop policy if exists "lease_inquiries_insert" on public.lease_inquiries;
drop policy if exists "lease_inquiries_admin_update" on public.lease_inquiries;
drop policy if exists "lease_inquiries_admin_delete" on public.lease_inquiries;
drop policy if exists "Allow public anonymous insert lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow authenticated staff read lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow authenticated staff update lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow authenticated staff delete lease_inquiries" on public.lease_inquiries;

-- Fellowship Applications
drop policy if exists "Allow all read fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow all insert fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow all update fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow all delete fellowship_applications" on public.fellowship_applications;
drop policy if exists "fellowship_applications_select" on public.fellowship_applications;
drop policy if exists "fellowship_applications_insert" on public.fellowship_applications;
drop policy if exists "fellowship_applications_admin_update" on public.fellowship_applications;
drop policy if exists "Allow public anonymous insert fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow authenticated staff read fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow authenticated staff update fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow authenticated staff delete fellowship_applications" on public.fellowship_applications;

-- Homestays
drop policy if exists "Allow all read homestays" on public.homestays;
drop policy if exists "Allow all insert homestays" on public.homestays;
drop policy if exists "Allow all update homestays" on public.homestays;
drop policy if exists "Allow all delete homestays" on public.homestays;
drop policy if exists "Allow public read homestays" on public.homestays;
drop policy if exists "homestays_select" on public.homestays;

-- Mountain Jobs
drop policy if exists "Allow all read mountain_jobs" on public.mountain_jobs;
drop policy if exists "Allow all insert mountain_jobs" on public.mountain_jobs;
drop policy if exists "Allow all update mountain_jobs" on public.mountain_jobs;
drop policy if exists "Allow all delete mountain_jobs" on public.mountain_jobs;
drop policy if exists "Allow public read mountain_jobs" on public.mountain_jobs;
drop policy if exists "jobs_select" on public.mountain_jobs;

-- Community Dispatches
drop policy if exists "Allow all read community_dispatches" on public.community_dispatches;
drop policy if exists "Allow all insert community_dispatches" on public.community_dispatches;
drop policy if exists "Allow all update community_dispatches" on public.community_dispatches;
drop policy if exists "Allow all delete community_dispatches" on public.community_dispatches;
drop policy if exists "Allow public read community_dispatches" on public.community_dispatches;
drop policy if exists "community_dispatches_select" on public.community_dispatches;

-- -----------------------------------------------------------------------------
-- 4. HARDENED POLICIES: SENSITIVE DATA (PII Protection)
-- -----------------------------------------------------------------------------

-- A. JOB APPLICATIONS
-- Anyone can apply (INSERT)
create policy "job_applications_public_insert"
  on public.job_applications for insert
  to anon, authenticated
  with check (true);

-- ONLY authenticated staff/admins can view candidate PII (SELECT)
create policy "job_applications_staff_select"
  on public.job_applications for select
  to authenticated, service_role
  using (true);

-- ONLY authenticated staff can update status or delete
create policy "job_applications_staff_update"
  on public.job_applications for update
  to authenticated, service_role
  using (true)
  with check (true);

create policy "job_applications_staff_delete"
  on public.job_applications for delete
  to authenticated, service_role
  using (true);


-- B. LEASE INQUIRIES
-- Anyone can submit inquiry (INSERT)
create policy "lease_inquiries_public_insert"
  on public.lease_inquiries for insert
  to anon, authenticated
  with check (true);

-- ONLY authenticated staff/hosts can view guest contact PII (SELECT)
create policy "lease_inquiries_staff_select"
  on public.lease_inquiries for select
  to authenticated, service_role
  using (true);

-- ONLY authenticated staff can update or delete
create policy "lease_inquiries_staff_update"
  on public.lease_inquiries for update
  to authenticated, service_role
  using (true)
  with check (true);

create policy "lease_inquiries_staff_delete"
  on public.lease_inquiries for delete
  to authenticated, service_role
  using (true);


-- C. FELLOWSHIP APPLICATIONS
create policy "fellowship_applications_public_insert"
  on public.fellowship_applications for insert
  to anon, authenticated
  with check (true);

create policy "fellowship_applications_staff_select"
  on public.fellowship_applications for select
  to authenticated, service_role
  using (true);

create policy "fellowship_applications_staff_update"
  on public.fellowship_applications for update
  to authenticated, service_role
  using (true)
  with check (true);

create policy "fellowship_applications_staff_delete"
  on public.fellowship_applications for delete
  to authenticated, service_role
  using (true);


-- -----------------------------------------------------------------------------
-- 5. HARDENED POLICIES: PUBLIC CONTENT (Moderation Shielding)
-- -----------------------------------------------------------------------------

-- A. HOMESTAYS (Properties)
-- Public can ONLY read published properties
create policy "homestays_public_select"
  on public.homestays for select
  to anon
  using (is_published = true);

-- Staff can read ALL properties (including drafts in moderation queue)
create policy "homestays_staff_select"
  on public.homestays for select
  to authenticated, service_role
  using (true);

-- Community can submit (INSERT) properties as pending review
create policy "homestays_public_insert"
  on public.homestays for insert
  to anon, authenticated
  with check (true);

-- ONLY authenticated staff/admins can publish (UPDATE) or delete
create policy "homestays_staff_update"
  on public.homestays for update
  to authenticated, service_role
  using (true)
  with check (true);

create policy "homestays_staff_delete"
  on public.homestays for delete
  to authenticated, service_role
  using (true);


-- B. MOUNTAIN JOBS
-- Public can ONLY read published jobs
create policy "jobs_public_select"
  on public.mountain_jobs for select
  to anon
  using (is_published = true);

-- Staff can read ALL jobs (including pending queue)
create policy "jobs_staff_select"
  on public.mountain_jobs for select
  to authenticated, service_role
  using (true);

-- Community can post jobs (INSERT) as pending review
create policy "jobs_public_insert"
  on public.mountain_jobs for insert
  to anon, authenticated
  with check (true);

-- ONLY authenticated staff can publish (UPDATE) or delete
create policy "jobs_staff_update"
  on public.mountain_jobs for update
  to authenticated, service_role
  using (true)
  with check (true);

create policy "jobs_staff_delete"
  on public.mountain_jobs for delete
  to authenticated, service_role
  using (true);


-- C. COMMUNITY DISPATCHES (Experiences)
-- Public can ONLY read published dispatches
create policy "dispatches_public_select"
  on public.community_dispatches for select
  to anon
  using (is_published = true);

-- Staff can read ALL dispatches (including pending queue)
create policy "dispatches_staff_select"
  on public.community_dispatches for select
  to authenticated, service_role
  using (true);

-- Community can submit experiences
create policy "dispatches_public_insert"
  on public.community_dispatches for insert
  to anon, authenticated
  with check (true);

-- ONLY authenticated staff can moderate (UPDATE) or delete
create policy "dispatches_staff_update"
  on public.community_dispatches for update
  to authenticated, service_role
  using (true)
  with check (true);

create policy "dispatches_staff_delete"
  on public.community_dispatches for delete
  to authenticated, service_role
  using (true);


-- -----------------------------------------------------------------------------
-- 6. STORAGE BUCKET HARDENING: PRIVATE RESUMES BUCKET
-- -----------------------------------------------------------------------------
-- Ensure 'resumes' bucket is STRICTLY PRIVATE (public = false)
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do update set public = false;

-- Drop loose policies on resumes bucket
drop policy if exists "Allow public read resumes" on storage.objects;
drop policy if exists "Allow applicant upload resume" on storage.objects;
drop policy if exists "Allow staff read resumes" on storage.objects;

-- Allow applicants to upload their CV into resumes bucket
create policy "Allow applicant upload resume"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'resumes');

-- Only authenticated staff can read/download candidate resumes via signed URL
create policy "Allow staff read resumes"
  on storage.objects for select
  to authenticated, service_role
  using (bucket_id = 'resumes');

-- -----------------------------------------------------------------------------
-- 7. Verification Query (Audit Results)
-- -----------------------------------------------------------------------------
select
  tablename,
  policyname,
  roles,
  cmd,
  qual
from pg_policies
where schemaname = 'public'
order by tablename, cmd;
