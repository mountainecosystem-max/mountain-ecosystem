-- ==============================================================================
-- Mountain Ecosystem: Supabase Production Relational Schema
-- Designed for client-managed content & visitor applications:
-- 1. destinations (Botanical atlas & high-res geo-coordinates)
-- 2. homestays (Indigenous long-term residency listings & leases)
-- 3. mountain_jobs (Verified valley residencies & cooperative roles)
-- 4. community_dispatches (Syndicate price reports, journals & trail advisories)
-- 5. architectural_specimens (Digital Vernacular Architecture monographs)
-- 6. architectural_materials (Indigenous timber, stone & lime ledger)
-- 7. architectural_principles (Passive solar, seismic & thermal mechanics)
-- 8. price_indices (5-month ground transit syndicate & farmgate benchmarks)
-- 9. price_history (Historical monthly rate trends for sparkline charts)
-- 10. fellowship_applications (Community fellowship membership submissions)
-- 11. job_applications (Residency & job applications submitted via modals)
-- 12. lease_inquiries (Homestay residency inquiries submitted via modals)
-- ==============================================================================

-- Enable UUID generation extension if not already available
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. DESTINATIONS
-- ------------------------------------------------------------------------------
create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  subtitle text not null,
  region text not null,
  elevation text not null,
  description text not null,
  story_quote text,
  image text not null,
  season text not null,
  tags text[] default '{}',
  featured boolean default false,
  coordinates text not null,
  highlights text[] default '{}',
  is_published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_destinations_is_published on destinations (is_published, sort_order);
create index if not exists idx_destinations_region on destinations (region);

-- ------------------------------------------------------------------------------
-- 2. HOMESTAYS (Long-term residential leases)
-- ------------------------------------------------------------------------------
create table if not exists homestays (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  region text not null,
  location text not null,
  elevation text not null,
  monthly_rate text not null,
  security_deposit text not null,
  min_lease_term text not null,
  lease_status text default 'Available for Lease',
  furnishing text default 'Furnished Stone & Cedar',
  rating numeric(3,2) default 5.0,
  reviews_count int default 0,
  host_name text not null,
  host_role text default 'Local Host',
  host_years int default 1,
  host_avatar text,
  room_type text not null,
  wifi text not null,
  capacity text not null,
  images text[] default '{}',
  description text not null,
  amenities text[] default '{}',
  features text[] default '{}',
  utilities_included text[] default '{}',
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_homestays_is_published on homestays (is_published, created_at desc);
create index if not exists idx_homestays_region on homestays (region);

-- ------------------------------------------------------------------------------
-- 3. MOUNTAIN JOBS & RESIDENCIES
-- ------------------------------------------------------------------------------
create table if not exists mountain_jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  employer text not null,
  employer_badge text,
  location text not null,
  region text not null,
  type text not null check (type in ('Full-time', 'Seasonal', 'Residency', 'Contract')),
  salary text not null,
  housing_included boolean default false,
  category text not null check (category in (
    'Hospitality & Estates',
    'Guiding & Conservation',
    'Agriculture & Craft',
    'Digital & Remote'
  )),
  description text not null,
  responsibilities text[] default '{}',
  requirements text[] default '{}',
  benefits text[] default '{}',
  is_published boolean default true,
  posted_date text not null,
  created_at timestamptz default now()
);

create index if not exists idx_mountain_jobs_is_published on mountain_jobs (is_published, created_at desc);
create index if not exists idx_mountain_jobs_category on mountain_jobs (category);

-- ------------------------------------------------------------------------------
-- 4. COMMUNITY DISPATCHES
-- ------------------------------------------------------------------------------
create table if not exists community_dispatches (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('price_report', 'traveller_story', 'host_story', 'trail_note')),
  title text not null,
  excerpt text not null,
  full_content text not null,
  location text not null,
  date text not null,
  read_time text not null,
  author_name text not null,
  author_role text not null,
  author_avatar text,
  community_badge text,
  verified boolean default false,
  helpful_count int default 0,
  is_published boolean default true,
  -- Optional ground price report metadata
  price_item text,
  price_shared_rate text,
  price_private_rate text,
  price_note text,
  price_last_updated text,
  price_stability_score numeric(4,1),
  created_at timestamptz default now()
);

create index if not exists idx_community_dispatches_is_published on community_dispatches (is_published, created_at desc);
create index if not exists idx_community_dispatches_type on community_dispatches (type);

-- ------------------------------------------------------------------------------
-- 5. HIMALAYAN ARCHITECTURAL & MATERIAL LEDGER (SPECIMENS)
-- ------------------------------------------------------------------------------
create table if not exists architectural_specimens (
  id uuid primary key default gen_random_uuid(),
  code text unique not null, -- e.g. "ARC-01"
  title text not null,
  subtitle text not null,
  archetype text not null,
  image text not null,
  elevation_range text not null,
  thermal_rating text not null,
  seismic_index text not null,
  craft_lineage text not null,
  overview text not null,
  ecological_protection text not null,
  quote_text text not null,
  quote_author text not null,
  quote_craft_title text not null,
  quote_location text not null,
  sort_order int default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

create index if not exists idx_architectural_specimens_is_published on architectural_specimens (is_published, sort_order);

-- ------------------------------------------------------------------------------
-- 6. ARCHITECTURAL MATERIALS
-- ------------------------------------------------------------------------------
create table if not exists architectural_materials (
  id uuid primary key default gen_random_uuid(),
  specimen_id uuid references architectural_specimens(id) on delete cascade not null,
  name text not null,
  source text not null,
  percentage int not null,
  role text not null
);

create index if not exists idx_architectural_materials_specimen on architectural_materials (specimen_id);

-- ------------------------------------------------------------------------------
-- 7. ARCHITECTURAL PRINCIPLES
-- ------------------------------------------------------------------------------
create table if not exists architectural_principles (
  id uuid primary key default gen_random_uuid(),
  specimen_id uuid references architectural_specimens(id) on delete cascade not null,
  label text not null,
  detail text not null
);

create index if not exists idx_architectural_principles_specimen on architectural_principles (specimen_id);

-- ------------------------------------------------------------------------------
-- 8. PRICE STABILITY INDICES
-- ------------------------------------------------------------------------------
create table if not exists price_indices (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('transit', 'farmgate')),
  item text not null,
  route_or_origin text not null,
  primary_rate text not null,
  rate_unit text not null,
  secondary_rate text,
  secondary_label text,
  stability_score numeric(4,1) default 98.0,
  trend_status text default 'stable',
  trend_summary text not null,
  last_verified text not null,
  verified_by text not null,
  notes text,
  is_published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create index if not exists idx_price_indices_is_published on price_indices (is_published, sort_order);

-- ------------------------------------------------------------------------------
-- 9. PRICE HISTORY (Sparkline points)
-- ------------------------------------------------------------------------------
create table if not exists price_history (
  id uuid primary key default gen_random_uuid(),
  price_index_id uuid references price_indices(id) on delete cascade not null,
  month text not null,
  rate numeric(10,2) not null,
  sort_order int default 0
);

create index if not exists idx_price_history_index on price_history (price_index_id, sort_order);

-- ------------------------------------------------------------------------------
-- 10. FELLOWSHIP APPLICATIONS (Modal Submissions)
-- ------------------------------------------------------------------------------
create table if not exists fellowship_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  role text not null check (role in ('traveller', 'host', 'seeker', 'employer')),
  region text not null,
  intent text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'waitlisted', 'declined')),
  created_at timestamptz default now()
);

create index if not exists idx_fellowship_applications_status on fellowship_applications (status, created_at desc);

-- ------------------------------------------------------------------------------
-- 11. JOB APPLICATIONS (JobDetailModal Submissions)
-- ------------------------------------------------------------------------------
create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references mountain_jobs(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  note text not null,
  status text default 'submitted' check (status in ('submitted', 'interviewing', 'placed', 'closed')),
  created_at timestamptz default now()
);

create index if not exists idx_job_applications_job on job_applications (job_id, created_at desc);

-- ------------------------------------------------------------------------------
-- 12. LEASE INQUIRIES (HomestayDetailModal Submissions)
-- ------------------------------------------------------------------------------
create table if not exists lease_inquiries (
  id uuid primary key default gen_random_uuid(),
  homestay_id uuid references homestays(id) on delete set null,
  guest_name text not null,
  email text not null,
  phone text not null,
  intended_term text not null,
  start_date text not null,
  profession text not null,
  message text not null,
  status text default 'inquiry' check (status in ('inquiry', 'host_contacted', 'lease_signed', 'cancelled')),
  created_at timestamptz default now()
);

create index if not exists idx_lease_inquiries_homestay on lease_inquiries (homestay_id, created_at desc);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table destinations enable row level security;
alter table homestays enable row level security;
alter table mountain_jobs enable row level security;
alter table community_dispatches enable row level security;
alter table architectural_specimens enable row level security;
alter table architectural_materials enable row level security;
alter table architectural_principles enable row level security;
alter table price_indices enable row level security;
alter table price_history enable row level security;
alter table fellowship_applications enable row level security;
alter table job_applications enable row level security;
alter table lease_inquiries enable row level security;

-- 1. Public Read Access (Published Catalog)
-- Note: destinations RLS is consolidated below in the DESTINATIONS section.
drop policy if exists "Allow public read homestays" on homestays;
create policy "Allow public read homestays" on homestays for select using (is_published = true);

drop policy if exists "Allow public read mountain_jobs" on mountain_jobs;
create policy "Allow public read mountain_jobs" on mountain_jobs for select using (is_published = true);

drop policy if exists "Allow public read community_dispatches" on community_dispatches;
create policy "Allow public read community_dispatches" on community_dispatches for select using (is_published = true);

drop policy if exists "Allow public read architectural_specimens" on architectural_specimens;
create policy "Allow public read architectural_specimens" on architectural_specimens for select using (is_published = true);

drop policy if exists "Allow public read architectural_materials" on architectural_materials;
create policy "Allow public read architectural_materials" on architectural_materials for select using (true);

drop policy if exists "Allow public read architectural_principles" on architectural_principles;
create policy "Allow public read architectural_principles" on architectural_principles for select using (true);

drop policy if exists "Allow public read price_indices" on price_indices;
create policy "Allow public read price_indices" on price_indices for select using (is_published = true);

drop policy if exists "Allow public read price_history" on price_history;
create policy "Allow public read price_history" on price_history for select using (true);

-- 2. Public Safe Submission Policies (Visitors can submit applications, but CANNOT read others' data)
drop policy if exists "Allow public anonymous insert fellowship_applications" on fellowship_applications;
create policy "Allow public anonymous insert fellowship_applications"
  on fellowship_applications for insert to anon, authenticated
  with check (true);

drop policy if exists "Allow public anonymous insert job_applications" on job_applications;
create policy "Allow public anonymous insert job_applications"
  on job_applications for insert to anon, authenticated
  with check (true);

drop policy if exists "Allow public anonymous insert lease_inquiries" on lease_inquiries;
create policy "Allow public anonymous insert lease_inquiries"
  on lease_inquiries for insert to anon, authenticated
  with check (true);

-- ------------------------------------------------------------------------------
-- 13. PLATFORM ADMINISTRATORS & VERIFIED ROLES
-- ------------------------------------------------------------------------------
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'admin' check (role in ('superadmin', 'admin', 'editor', 'moderator')),
  created_at timestamptz default now()
);

alter table admin_users enable row level security;

-- Security definer function to verify administrative privileges
-- CRITICAL SECURITY: Checks ONLY trusted app_metadata (server-controlled) and the admin_users table.
-- NEVER checks user_metadata, which is client-editable!
-- Explicitly specifies search_path to prevent search_path injection attacks (CVE-2018-1058).
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
-- ADMIN_USERS RLS POLICIES (Preventing Privilege Escalation)
-- ------------------------------------------------------------------------------
-- Authenticated users can only read their own record or if already verified admin
drop policy if exists "Allow verified admins and self to view admin_users" on admin_users;
create policy "Allow verified admins and self to view admin_users"
  on admin_users for select to authenticated
  using (
    user_id = auth.uid()
    or email = (auth.jwt() ->> 'email')
    or public.is_admin()
  );

-- STRICT: Regular authenticated users can NEVER insert themselves into admin_users!
-- Only superadmin or direct service_role provisioning can create/update/delete admins.
drop policy if exists "Allow only superadmin to insert admin_users" on admin_users;
create policy "Allow only superadmin to insert admin_users"
  on admin_users for insert to authenticated
  with check (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'superadmin'
    or exists (
      select 1 from public.admin_users
      where (user_id = auth.uid() or email = (auth.jwt() ->> 'email'))
        and role = 'superadmin'
    )
  );

drop policy if exists "Allow only superadmin to update admin_users" on admin_users;
create policy "Allow only superadmin to update admin_users"
  on admin_users for update to authenticated
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

drop policy if exists "Allow only superadmin to delete admin_users" on admin_users;
create policy "Allow only superadmin to delete admin_users"
  on admin_users for delete to authenticated
  using (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'superadmin'
    or exists (
      select 1 from public.admin_users
      where (user_id = auth.uid() or email = (auth.jwt() ->> 'email'))
        and role = 'superadmin'
    )
  );

-- ------------------------------------------------------------------------------
-- DESTINATIONS RLS POLICIES (Strict Admin Enforcement)
-- ------------------------------------------------------------------------------
-- 1. Read: Public and ordinary users see ONLY published items; Admins see all (drafts & published)
drop policy if exists "Allow public read destinations" on destinations;
create policy "Allow public read destinations"
  on destinations for select
  using (is_published = true or public.is_admin());

-- 2. Insert: ONLY verified administrators can create destinations (ordinary users BLOCKED)
drop policy if exists "Allow authenticated admin full access to destinations" on destinations;
drop policy if exists "Allow admin insert destinations" on destinations;
create policy "Allow admin insert destinations"
  on destinations for insert to authenticated
  with check (public.is_admin());

-- 3. Update: ONLY verified administrators can edit destinations
drop policy if exists "Allow admin update destinations" on destinations;
create policy "Allow admin update destinations"
  on destinations for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 4. Delete: ONLY verified administrators can delete destinations
drop policy if exists "Allow admin delete destinations" on destinations;
create policy "Allow admin delete destinations"
  on destinations for delete to authenticated
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- OTHER CATALOG TABLES RLS POLICIES
-- ------------------------------------------------------------------------------
drop policy if exists "Allow authenticated admin full access to homestays" on homestays;
create policy "Allow authenticated admin full access to homestays"
  on homestays for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Allow authenticated admin full access to mountain_jobs" on mountain_jobs;
create policy "Allow authenticated admin full access to mountain_jobs"
  on mountain_jobs for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Allow authenticated admin full access to community_dispatches" on community_dispatches;
create policy "Allow authenticated admin full access to community_dispatches"
  on community_dispatches for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Allow authenticated admin full access to architectural_specimens" on architectural_specimens;
create policy "Allow authenticated admin full access to architectural_specimens"
  on architectural_specimens for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Allow authenticated admin full access to architectural_materials" on architectural_materials;
create policy "Allow authenticated admin full access to architectural_materials"
  on architectural_materials for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Allow authenticated admin full access to architectural_principles" on architectural_principles;
create policy "Allow authenticated admin full access to architectural_principles"
  on architectural_principles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Allow authenticated admin full access to price_indices" on price_indices;
create policy "Allow authenticated admin full access to price_indices"
  on price_indices for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Allow authenticated admin full access to price_history" on price_history;
create policy "Allow authenticated admin full access to price_history"
  on price_history for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Allow authenticated admin full access to fellowship_applications" on fellowship_applications;
create policy "Allow authenticated admin full access to fellowship_applications"
  on fellowship_applications for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Allow authenticated admin full access to job_applications" on job_applications;
create policy "Allow authenticated admin full access to job_applications"
  on job_applications for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Allow authenticated admin full access to lease_inquiries" on lease_inquiries;
create policy "Allow authenticated admin full access to lease_inquiries"
  on lease_inquiries for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ==============================================================================
-- ROLE PERMISSIONS (GRANT SELECT & INSERT TO anon & authenticated)
-- ==============================================================================

grant usage on schema public to anon, authenticated;

-- Allow reading public catalog tables
grant select on destinations to anon, authenticated;
grant select on homestays to anon, authenticated;
grant select on mountain_jobs to anon, authenticated;
grant select on community_dispatches to anon, authenticated;
grant select on architectural_specimens to anon, authenticated;
grant select on architectural_materials to anon, authenticated;
grant select on architectural_principles to anon, authenticated;
grant select on price_indices to anon, authenticated;
grant select on price_history to anon, authenticated;

-- Allow authenticated users to read admin_users (RLS enforces viewing only self/admin)
-- NOTICE: DO NOT GRANT INSERT, UPDATE, OR DELETE on admin_users TO authenticated!
grant select on admin_users to authenticated;

-- Allow public visitor submissions
grant insert on fellowship_applications to anon, authenticated;
grant insert on job_applications to anon, authenticated;
grant insert on lease_inquiries to anon, authenticated;

-- Allow management operations on catalog tables for authenticated role (governed by RLS)
grant insert, update, delete on destinations to authenticated;
grant insert, update, delete on homestays to authenticated;
grant insert, update, delete on mountain_jobs to authenticated;
grant insert, update, delete on community_dispatches to authenticated;
grant insert, update, delete on architectural_specimens to authenticated;
grant insert, update, delete on architectural_materials to authenticated;
grant insert, update, delete on architectural_principles to authenticated;
grant insert, update, delete on price_indices to authenticated;
grant insert, update, delete on price_history to authenticated;
grant select, update, delete on fellowship_applications to authenticated;
grant select, update, delete on job_applications to authenticated;
grant select, update, delete on lease_inquiries to authenticated;
grant all on all sequences in schema public to authenticated;
