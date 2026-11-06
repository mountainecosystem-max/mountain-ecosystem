import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { AdminHomestay } from '../types'
import { slugify } from './adminDestinationService'
import {
  MOUNTAIN_STORAGE_KEYS,
  getStoredItems,
  setStoredItems,
  notifyDataUpdated
} from './ecosystemService'

export interface DbHomestayRow {
  id: string
  slug: string
  name: string
  region: string
  location: string
  elevation: string
  monthly_rate: string
  security_deposit: string
  min_lease_term: string
  lease_status: string | null
  furnishing: string | null
  rating: number | null
  reviews_count: number | null
  host_name: string
  host_role: string | null
  host_years: number | null
  host_avatar: string | null
  room_type: string
  wifi: string
  capacity: string
  images: string[] | null
  description: string
  amenities: string[] | null
  features: string[] | null
  utilities_included: string[] | null
  is_published: boolean | null
  created_at: string
  updated_at: string
}

export const mapDbRowToAdminHomestay = (row: DbHomestayRow): AdminHomestay => ({
  id: row.id,
  slug: row.slug || '',
  name: row.name,
  region: row.region,
  location: row.location,
  elevation: row.elevation,
  monthlyRate: row.monthly_rate,
  securityDeposit: row.security_deposit,
  minLeaseTerm: row.min_lease_term,
  leaseStatus: row.lease_status || 'Available for Lease',
  furnishing: row.furnishing || 'Furnished Stone & Cedar',
  rating: Number(row.rating) || 5.0,
  reviewsCount: Number(row.reviews_count) || 0,
  host: {
    name: row.host_name,
    role: row.host_role || 'Local Host',
    yearsHosting: Number(row.host_years) || 1,
    avatar: row.host_avatar || ''
  },
  roomType: row.room_type,
  wifi: row.wifi,
  capacity: row.capacity,
  images: row.images || [],
  description: row.description,
  amenities: row.amenities || [],
  features: row.features || [],
  utilitiesIncluded: row.utilities_included || [],
  isPublished: Boolean(row.is_published ?? true),
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || new Date().toISOString()
})

export interface CreateHomestayInput {
  name: string
  slug?: string
  region: string
  location: string
  elevation: string
  monthlyRate: string
  securityDeposit: string
  minLeaseTerm: string
  leaseStatus?: string
  furnishing?: string
  rating?: number
  reviewsCount?: number
  hostName: string
  hostRole?: string
  hostYears?: number
  hostAvatar?: string
  roomType: string
  wifi: string
  capacity: string
  images?: string[]
  description: string
  amenities?: string[]
  features?: string[]
  utilitiesIncluded?: string[]
  isPublished?: boolean
}

// 1. Fetch all homestays (Admin: drafts & published)
export const fetchAdminHomestays = async (): Promise<{
  data: AdminHomestay[]
  error: string | null
  permissionDenied?: boolean
}> => {
  let dbHomestays: AdminHomestay[] = []

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('homestays')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        dbHomestays = ((data as DbHomestayRow[]) || []).map(mapDbRowToAdminHomestay)
      }
    } catch (err: unknown) {
      console.warn('Supabase query error in fetchAdminHomestays:', err)
    }
  }

  // Merge with locally stored custom items
  const localHomestays = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.HOMESTAYS)
  const existingIds = new Set(dbHomestays.map((h) => h.id))
  const existingNames = new Set(dbHomestays.map((h) => h.name.toLowerCase().trim()))

  const mappedLocal: AdminHomestay[] = localHomestays
    .filter((h: any) => !existingIds.has(h.id) && !existingNames.has(h.name.toLowerCase().trim()))
    .map((h: any) => ({
      id: h.id,
      slug: slugify(h.name),
      name: h.name,
      region: h.region,
      location: h.location,
      elevation: h.elevation,
      monthlyRate: h.monthlyRate,
      securityDeposit: h.securityDeposit,
      minLeaseTerm: h.minLeaseTerm,
      leaseStatus: h.leaseStatus || 'Available for Lease',
      furnishing: h.furnishing || 'Furnished Stone & Cedar',
      rating: Number(h.rating) || 5.0,
      reviewsCount: Number(h.reviewsCount) || 1,
      host: h.host || {
        name: h.hostName || 'Host',
        role: 'Verified Host',
        yearsHosting: 1,
        avatar: ''
      },
      roomType: h.roomType,
      wifi: h.wifi,
      capacity: h.capacity,
      images: h.images || [],
      description: h.description,
      amenities: h.amenities || [],
      features: h.features || [],
      utilitiesIncluded: h.utilitiesIncluded || [],
      isPublished: h.isPublished !== false,
      createdAt: h.createdAt || new Date().toISOString(),
      updatedAt: h.updatedAt || new Date().toISOString()
    }))

  return {
    data: [...mappedLocal, ...dbHomestays],
    error: null
  }
}

// 2. Create homestay
export const createAdminHomestay = async (
  input: CreateHomestayInput
): Promise<{ data: AdminHomestay | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase credentials not configured.' }
  }

  const generatedSlug = (input.slug && input.slug.trim()) || slugify(input.name)

  const payload = {
    slug: generatedSlug,
    name: input.name.trim(),
    region: input.region.trim(),
    location: input.location.trim(),
    elevation: input.elevation.trim(),
    monthly_rate: input.monthlyRate.trim(),
    security_deposit: input.securityDeposit.trim(),
    min_lease_term: input.minLeaseTerm.trim(),
    lease_status: input.leaseStatus || 'Available for Lease',
    furnishing: input.furnishing || 'Furnished Stone & Cedar',
    rating: input.rating ?? 5.0,
    reviews_count: input.reviewsCount ?? 0,
    host_name: input.hostName.trim(),
    host_role: input.hostRole?.trim() || 'Local Host',
    host_years: input.hostYears ?? 1,
    host_avatar: input.hostAvatar?.trim() || null,
    room_type: input.roomType.trim(),
    wifi: input.wifi.trim(),
    capacity: input.capacity.trim(),
    images: input.images || [],
    description: input.description.trim(),
    amenities: input.amenities || [],
    features: input.features || [],
    utilities_included: input.utilitiesIncluded || [],
    is_published: input.isPublished ?? true
  }

  try {
    const { data, error } = await supabase
      .from('homestays')
      .insert(payload)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: mapDbRowToAdminHomestay(data as DbHomestayRow), error: null }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to create homestay listing'
    }
  }
}

// 3. Update homestay
export const updateAdminHomestay = async (
  id: string,
  input: Partial<CreateHomestayInput>
): Promise<{ data: AdminHomestay | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase credentials not configured.' }
  }

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  }

  if (input.name !== undefined) payload.name = input.name.trim()
  if (input.slug !== undefined) payload.slug = input.slug.trim() || slugify(input.name || '')
  if (input.region !== undefined) payload.region = input.region.trim()
  if (input.location !== undefined) payload.location = input.location.trim()
  if (input.elevation !== undefined) payload.elevation = input.elevation.trim()
  if (input.monthlyRate !== undefined) payload.monthly_rate = input.monthlyRate.trim()
  if (input.securityDeposit !== undefined) payload.security_deposit = input.securityDeposit.trim()
  if (input.minLeaseTerm !== undefined) payload.min_lease_term = input.minLeaseTerm.trim()
  if (input.leaseStatus !== undefined) payload.lease_status = input.leaseStatus
  if (input.furnishing !== undefined) payload.furnishing = input.furnishing
  if (input.hostName !== undefined) payload.host_name = input.hostName.trim()
  if (input.hostRole !== undefined) payload.host_role = input.hostRole.trim()
  if (input.hostYears !== undefined) payload.host_years = input.hostYears
  if (input.hostAvatar !== undefined) payload.host_avatar = input.hostAvatar.trim()
  if (input.roomType !== undefined) payload.room_type = input.roomType.trim()
  if (input.wifi !== undefined) payload.wifi = input.wifi.trim()
  if (input.capacity !== undefined) payload.capacity = input.capacity.trim()
  if (input.images !== undefined) payload.images = input.images
  if (input.description !== undefined) payload.description = input.description.trim()
  if (input.amenities !== undefined) payload.amenities = input.amenities
  if (input.features !== undefined) payload.features = input.features
  if (input.utilitiesIncluded !== undefined) payload.utilities_included = input.utilitiesIncluded
  if (input.isPublished !== undefined) payload.is_published = input.isPublished

  try {
    const { data, error } = await supabase
      .from('homestays')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: mapDbRowToAdminHomestay(data as DbHomestayRow), error: null }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to update homestay'
    }
  }
}

// 4. Toggle publish status
export const toggleAdminHomestayPublish = async (
  id: string,
  isPublished: boolean
): Promise<{ success: boolean; error: string | null }> => {
  // Update in localStorage
  const localHomestays = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.HOMESTAYS)
  const updatedLocal = localHomestays.map((h: any) => (h.id === id ? { ...h, isPublished } : h))
  setStoredItems(MOUNTAIN_STORAGE_KEYS.HOMESTAYS, updatedLocal)
  notifyDataUpdated()

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('homestays')
        .update({ is_published: isPublished, updated_at: new Date().toISOString() })
        .eq('id', id)
    } catch {}
  }

  return { success: true, error: null }
}

// 5. Delete homestay
export const deleteAdminHomestay = async (
  id: string
): Promise<{ success: boolean; error: string | null }> => {
  // Remove from localStorage
  const localHomestays = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.HOMESTAYS)
  setStoredItems(MOUNTAIN_STORAGE_KEYS.HOMESTAYS, localHomestays.filter((h: any) => h.id !== id))
  notifyDataUpdated()

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('homestays').delete().eq('id', id)
    } catch {}
  }

  return { success: true, error: null }
}
