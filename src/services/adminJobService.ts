import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { AdminJob } from '../types'

export interface DbJobRow {
  id: string
  title: string
  employer: string
  employer_badge: string | null
  location: string
  region: string
  type: string
  salary: string
  housing_included: boolean | null
  category: string
  description: string
  responsibilities: string[] | null
  requirements: string[] | null
  benefits: string[] | null
  posted_date: string | null
  is_published: boolean | null
  created_at: string
  updated_at: string
}

export const mapDbRowToAdminJob = (row: DbJobRow): AdminJob => ({
  id: row.id,
  title: row.title,
  employer: row.employer,
  employerBadge: row.employer_badge || undefined,
  location: row.location,
  region: row.region,
  type: row.type as AdminJob['type'],
  salary: row.salary,
  housingIncluded: Boolean(row.housing_included),
  category: row.category as AdminJob['category'],
  description: row.description,
  responsibilities: row.responsibilities || [],
  requirements: row.requirements || [],
  benefits: row.benefits || [],
  postedDate: row.posted_date || 'Recently Listed',
  isPublished: Boolean(row.is_published ?? true),
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || new Date().toISOString()
})

export interface CreateJobInput {
  title: string
  employer: string
  employerBadge?: string
  location: string
  region: string
  type: 'Full-time' | 'Seasonal' | 'Residency' | 'Contract'
  salary: string
  housingIncluded?: boolean
  category: 'Hospitality & Estates' | 'Guiding & Conservation' | 'Agriculture & Craft' | 'Digital & Remote'
  description: string
  responsibilities?: string[]
  requirements?: string[]
  benefits?: string[]
  postedDate?: string
  isPublished?: boolean
}

// 1. Fetch all jobs (Admin view: drafts + published)
export const fetchAdminJobs = async (): Promise<{
  data: AdminJob[]
  error: string | null
  permissionDenied?: boolean
}> => {
  if (!isSupabaseConfigured()) {
    return { data: [], error: 'Supabase credentials not configured in .env' }
  }

  try {
    const { data, error } = await supabase
      .from('mountain_jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      const isPermission = error.code === '42501' || error.message?.includes('permission denied')
      return { data: [], error: error.message, permissionDenied: isPermission }
    }

    return {
      data: ((data as DbJobRow[]) || []).map(mapDbRowToAdminJob),
      error: null
    }
  } catch (err: unknown) {
    return {
      data: [],
      error: err instanceof Error ? err.message : 'Failed to query mountain_jobs'
    }
  }
}

// 2. Create job
export const createAdminJob = async (
  input: CreateJobInput
): Promise<{ data: AdminJob | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase credentials not configured.' }
  }

  const payload = {
    title: input.title.trim(),
    employer: input.employer.trim(),
    employer_badge: input.employerBadge?.trim() || null,
    location: input.location.trim(),
    region: input.region.trim(),
    type: input.type,
    salary: input.salary.trim(),
    housing_included: Boolean(input.housingIncluded),
    category: input.category,
    description: input.description.trim(),
    responsibilities: input.responsibilities || [],
    requirements: input.requirements || [],
    benefits: input.benefits || [],
    posted_date: input.postedDate?.trim() || 'Recently Listed',
    is_published: input.isPublished ?? true
  }

  try {
    const { data, error } = await supabase
      .from('mountain_jobs')
      .insert(payload)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: mapDbRowToAdminJob(data as DbJobRow), error: null }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to create job residency'
    }
  }
}

// 3. Update job
export const updateAdminJob = async (
  id: string,
  input: Partial<CreateJobInput>
): Promise<{ data: AdminJob | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase credentials not configured.' }
  }

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  }

  if (input.title !== undefined) payload.title = input.title.trim()
  if (input.employer !== undefined) payload.employer = input.employer.trim()
  if (input.employerBadge !== undefined) payload.employer_badge = input.employerBadge.trim() || null
  if (input.location !== undefined) payload.location = input.location.trim()
  if (input.region !== undefined) payload.region = input.region.trim()
  if (input.type !== undefined) payload.type = input.type
  if (input.salary !== undefined) payload.salary = input.salary.trim()
  if (input.housingIncluded !== undefined) payload.housing_included = Boolean(input.housingIncluded)
  if (input.category !== undefined) payload.category = input.category
  if (input.description !== undefined) payload.description = input.description.trim()
  if (input.responsibilities !== undefined) payload.responsibilities = input.responsibilities
  if (input.requirements !== undefined) payload.requirements = input.requirements
  if (input.benefits !== undefined) payload.benefits = input.benefits
  if (input.postedDate !== undefined) payload.posted_date = input.postedDate.trim()
  if (input.isPublished !== undefined) payload.is_published = input.isPublished

  try {
    const { data, error } = await supabase
      .from('mountain_jobs')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: mapDbRowToAdminJob(data as DbJobRow), error: null }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to update job'
    }
  }
}

// 4. Toggle publish status
export const toggleAdminJobPublish = async (
  id: string,
  isPublished: boolean
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured.' }
  }

  try {
    const { error } = await supabase
      .from('mountain_jobs')
      .update({ is_published: isPublished, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to toggle status'
    }
  }
}

// 5. Delete job
export const deleteAdminJob = async (
  id: string
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured.' }
  }

  try {
    const { error } = await supabase.from('mountain_jobs').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete job'
    }
  }
}
