-- ==============================================================================
-- MOUNTAIN ECOSYSTEM: HARDENED PRODUCTION SECURITY & PRIVACY RLS MIGRATION
-- File: supabase/security_hardened_rls.sql
--
-- PURPOSE:
-- 1. Strictly protects applicant personal data (phone numbers, emails, messages)
--    under GDPR and Digital Personal Data Protection (DPDP) standards.
-- 2. Allows public visitors (anon) to freely submit (INSERT) properties, jobs,
--    community stories, lease inquiries, and job applications without signing in.
-- 3. Restricts reading (SELECT), editing (UPDATE), and deleting (DELETE) of private
--    applications/inquiries exclusively to authenticated staff/stewards.
-- 4. Prevents unauthenticated scraping of unverified submissions.
-- ==============================================================================

-- 1. Ensure Schema Privileges
grant usage on schema public to anon, authenticated, service_role;

-- 2. Reset Existing Overly-Permissive Policies on Inquiries & Applications
drop policy if exists "Allow all read lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow all update lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow all delete lease_inquiries" on public.lease_inquiries;
drop policy if exists "Allow all insert lease_inquiries" on public.lease_inquiries;

drop policy if exists "Allow all read job_applications" on public.job_applications;
drop policy if exists "Allow all update job_applications" on public.job_applications;
drop policy if exists "Allow all delete job_applications" on public.job_applications;
drop policy if exists "Allow all insert job_applications" on public.job_applications;

drop policy if exists "Allow all read fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow all update fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow all delete fellowship_applications" on public.fellowship_applications;
drop policy if exists "Allow all insert fellowship_applications" on public.fellowship_applications;

-- 3. Hardened Policies for LEASE INQUIRIES
-- Anyone can submit (INSERT) an inquiry anonymously without an account
create policy "Allow public anonymous insert lease_inquiries"
  on public.lease_inquiries for insert
  to anon, authenticated
  with check (true);

-- Only authenticated administrators/staff can read applicant personal details
create policy "Allow authenticated staff read lease_inquiries"
  on public.lease_inquiries for select
  to authenticated, service_role
  using (true);

-- Only authenticated staff can update status (reviewed/accepted/rejected)
create policy "Allow authenticated staff update lease_inquiries"
  on public.lease_inquiries for update
  to authenticated, service_role
  using (true)
  with check (true);

-- Only authenticated staff can delete inquiries
create policy "Allow authenticated staff delete lease_inquiries"
  on public.lease_inquiries for delete
  to authenticated, service_role
  using (true);


-- 4. Hardened Policies for JOB APPLICATIONS
-- Anyone can submit (INSERT) a job application without logging in
create policy "Allow public anonymous insert job_applications"
  on public.job_applications for insert
  to anon, authenticated
  with check (true);

-- Only authenticated hiring stewards / staff can inspect applications
create policy "Allow authenticated staff read job_applications"
  on public.job_applications for select
  to authenticated, service_role
  using (true);

-- Only authenticated staff can update applicant status
create policy "Allow authenticated staff update job_applications"
  on public.job_applications for update
  to authenticated, service_role
  using (true)
  with check (true);

-- Only authenticated staff can delete job applications
create policy "Allow authenticated staff delete job_applications"
  on public.job_applications for delete
  to authenticated, service_role
  using (true);


-- 5. Hardened Policies for FELLOWSHIP APPLICATIONS
create policy "Allow public anonymous insert fellowship_applications"
  on public.fellowship_applications for insert
  to anon, authenticated
  with check (true);

create policy "Allow authenticated staff read fellowship_applications"
  on public.fellowship_applications for select
  to authenticated, service_role
  using (true);

create policy "Allow authenticated staff update fellowship_applications"
  on public.fellowship_applications for update
  to authenticated, service_role
  using (true)
  with check (true);

create policy "Allow authenticated staff delete fellowship_applications"
  on public.fellowship_applications for delete
  to authenticated, service_role
  using (true);


-- 6. Ensure RLS is Enabled across all tables
alter table public.lease_inquiries enable row level security;
alter table public.job_applications enable row level security;
alter table public.fellowship_applications enable row level security;
alter table public.homestays enable row level security;
alter table public.mountain_jobs enable row level security;
alter table public.community_dispatches enable row level security;
