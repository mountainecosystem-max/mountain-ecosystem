import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { AdminDestination } from '../types'

export interface DbDestinationRow {
  id: string
  slug: string
  name: string
  subtitle: string
  region: string
  elevation: string
  description: string
  story_quote: string | null
  image: string
  season: string
  tags: string[] | null
  featured: boolean | null
  coordinates: string
  highlights: string[] | null
  is_published: boolean | null
  sort_order: number | null
  created_at: string
  updated_at: string
}

export const mapDbRowToAdminDestination = (row: DbDestinationRow): AdminDestination => ({
  id: row.id,
  slug: row.slug || '',
  name: row.name,
  subtitle: row.subtitle,
  region: row.region,
  elevation: row.elevation,
  description: row.description,
  storyQuote: row.story_quote || '',
  image: row.image,
  season: row.season,
  tags: row.tags || [],
  featured: Boolean(row.featured),
  coordinates: row.coordinates,
  highlights: row.highlights || [],
  isPublished: Boolean(row.is_published),
  sortOrder: Number(row.sort_order) || 0,
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || new Date().toISOString()
})

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

// -----------------------------------------------------------------------------
// 1. Fetch All Destinations (Admin View: includes drafts & published)
// -----------------------------------------------------------------------------
export const fetchAdminDestinations = async (): Promise<{
  data: AdminDestination[]
  error: string | null
  permissionDenied?: boolean
}> => {
  if (!isSupabaseConfigured()) {
    return {
      data: [],
      error: 'Supabase credentials are not configured in your .env file.'
    }
  }

  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      const isPermission = error.code === '42501' || error.message?.includes('permission denied')
      return {
        data: [],
        error: error.message,
        permissionDenied: isPermission
      }
    }

    if (!data) return { data: [], error: null }

    return {
      data: (data as DbDestinationRow[]).map(mapDbRowToAdminDestination),
      error: null
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown database error'
    return {
      data: [],
      error: message
    }
  }
}

// -----------------------------------------------------------------------------
// 2. Create Destination
// -----------------------------------------------------------------------------
export interface CreateDestinationInput {
  name: string
  slug?: string
  subtitle: string
  region: string
  elevation: string
  description: string
  storyQuote?: string
  image: string
  season: string
  tags?: string[]
  featured?: boolean
  coordinates: string
  highlights?: string[]
  isPublished?: boolean
  sortOrder?: number
}

export const createAdminDestination = async (
  input: CreateDestinationInput
): Promise<{ data: AdminDestination | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase credentials not configured.' }
  }

  const generatedSlug = (input.slug && input.slug.trim()) || slugify(input.name)

  const payload = {
    slug: generatedSlug,
    name: input.name.trim(),
    subtitle: input.subtitle.trim(),
    region: input.region.trim(),
    elevation: input.elevation.trim(),
    description: input.description.trim(),
    story_quote: input.storyQuote?.trim() || null,
    image: input.image.trim(),
    season: input.season.trim(),
    tags: input.tags || [],
    featured: Boolean(input.featured),
    coordinates: input.coordinates.trim(),
    highlights: input.highlights || [],
    is_published: input.isPublished ?? true,
    sort_order: input.sortOrder ?? 0
  }

  try {
    const { data, error } = await supabase
      .from('destinations')
      .insert(payload)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return {
      data: mapDbRowToAdminDestination(data as DbDestinationRow),
      error: null
    }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to create destination'
    }
  }
}

// -----------------------------------------------------------------------------
// 3. Update Destination
// -----------------------------------------------------------------------------
export interface UpdateDestinationInput extends Partial<CreateDestinationInput> {
  id: string
}

export const updateAdminDestination = async (
  id: string,
  input: Partial<CreateDestinationInput>
): Promise<{ data: AdminDestination | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase credentials not configured.' }
  }

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  }

  if (input.name !== undefined) payload.name = input.name.trim()
  if (input.slug !== undefined) payload.slug = input.slug.trim() || slugify(input.name || '')
  if (input.subtitle !== undefined) payload.subtitle = input.subtitle.trim()
  if (input.region !== undefined) payload.region = input.region.trim()
  if (input.elevation !== undefined) payload.elevation = input.elevation.trim()
  if (input.description !== undefined) payload.description = input.description.trim()
  if (input.storyQuote !== undefined) payload.story_quote = input.storyQuote.trim() || null
  if (input.image !== undefined) payload.image = input.image.trim()
  if (input.season !== undefined) payload.season = input.season.trim()
  if (input.tags !== undefined) payload.tags = input.tags
  if (input.featured !== undefined) payload.featured = Boolean(input.featured)
  if (input.coordinates !== undefined) payload.coordinates = input.coordinates.trim()
  if (input.highlights !== undefined) payload.highlights = input.highlights
  if (input.isPublished !== undefined) payload.is_published = Boolean(input.isPublished)
  if (input.sortOrder !== undefined) payload.sort_order = Number(input.sortOrder)

  try {
    const { data, error } = await supabase
      .from('destinations')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return {
      data: mapDbRowToAdminDestination(data as DbDestinationRow),
      error: null
    }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to update destination'
    }
  }
}

// -----------------------------------------------------------------------------
// 4. Toggle Publish Status
// -----------------------------------------------------------------------------
export const toggleAdminDestinationPublish = async (
  id: string,
  isPublished: boolean
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured.' }
  }

  try {
    const { error } = await supabase
      .from('destinations')
      .update({
        is_published: isPublished,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to toggle status'
    }
  }
}

// -----------------------------------------------------------------------------
// 5. Delete Destination
// -----------------------------------------------------------------------------
export const deleteAdminDestination = async (
  id: string
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured.' }
  }

  try {
    const { error } = await supabase.from('destinations').delete().eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete destination'
    }
  }
}
