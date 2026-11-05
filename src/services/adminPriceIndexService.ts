import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface DbPriceIndexRow {
  id: string
  category: 'transit' | 'farmgate'
  item: string
  route_or_origin: string
  primary_rate: string
  rate_unit: string
  secondary_rate: string | null
  secondary_label: string | null
  stability_score: number | null
  trend_status: 'stable' | 'slight_fluctuation' | 'fair_fixed'
  trend_summary: string
  last_verified: string | null
  verified_by: string | null
  notes: string | null
  is_published: boolean | null
  created_at: string
  updated_at: string
}

export interface CreatePriceIndexInput {
  category: 'transit' | 'farmgate'
  item: string
  routeOrOrigin: string
  primaryRate: string
  rateUnit: string
  secondaryRate?: string
  secondaryLabel?: string
  stabilityScore?: number
  trendStatus: 'stable' | 'slight_fluctuation' | 'fair_fixed'
  trendSummary: string
  lastVerified?: string
  verifiedBy?: string
  notes?: string
  isPublished?: boolean
}

// 1. Fetch all price indices
export const fetchAdminPriceIndices = async (): Promise<{
  data: DbPriceIndexRow[]
  error: string | null
}> => {
  if (!isSupabaseConfigured()) {
    return { data: [], error: 'Supabase credentials not configured in .env' }
  }

  try {
    const { data, error } = await supabase
      .from('price_indices')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return { data: [], error: error.message }
    return { data: (data as DbPriceIndexRow[]) || [], error: null }
  } catch (err: unknown) {
    return {
      data: [],
      error: err instanceof Error ? err.message : 'Failed to query price_indices'
    }
  }
}

// 2. Create price index
export const createAdminPriceIndex = async (
  input: CreatePriceIndexInput
): Promise<{ data: DbPriceIndexRow | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase credentials not configured.' }
  }

  const payload = {
    category: input.category,
    item: input.item.trim(),
    route_or_origin: input.routeOrOrigin.trim(),
    primary_rate: input.primaryRate.trim(),
    rate_unit: input.rateUnit.trim(),
    secondary_rate: input.secondaryRate?.trim() || null,
    secondary_label: input.secondaryLabel?.trim() || null,
    stability_score: input.stabilityScore ?? 92,
    trend_status: input.trendStatus,
    trend_summary: input.trendSummary.trim(),
    last_verified: input.lastVerified?.trim() || 'Recently verified',
    verified_by: input.verifiedBy?.trim() || 'Local Syndicate Ledger',
    notes: input.notes?.trim() || null,
    is_published: input.isPublished ?? true
  }

  try {
    const { data, error } = await supabase
      .from('price_indices')
      .insert(payload)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: data as DbPriceIndexRow, error: null }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to create price index'
    }
  }
}

// 3. Update price index
export const updateAdminPriceIndex = async (
  id: string,
  input: Partial<CreatePriceIndexInput>
): Promise<{ data: DbPriceIndexRow | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: 'Supabase credentials not configured.' }
  }

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString()
  }

  if (input.category !== undefined) payload.category = input.category
  if (input.item !== undefined) payload.item = input.item.trim()
  if (input.routeOrOrigin !== undefined) payload.route_or_origin = input.routeOrOrigin.trim()
  if (input.primaryRate !== undefined) payload.primary_rate = input.primaryRate.trim()
  if (input.rateUnit !== undefined) payload.rate_unit = input.rateUnit.trim()
  if (input.secondaryRate !== undefined) payload.secondary_rate = input.secondaryRate?.trim() || null
  if (input.secondaryLabel !== undefined) payload.secondary_label = input.secondaryLabel?.trim() || null
  if (input.stabilityScore !== undefined) payload.stability_score = input.stabilityScore
  if (input.trendStatus !== undefined) payload.trend_status = input.trendStatus
  if (input.trendSummary !== undefined) payload.trend_summary = input.trendSummary.trim()
  if (input.lastVerified !== undefined) payload.last_verified = input.lastVerified?.trim()
  if (input.verifiedBy !== undefined) payload.verified_by = input.verifiedBy?.trim()
  if (input.notes !== undefined) payload.notes = input.notes?.trim() || null
  if (input.isPublished !== undefined) payload.is_published = input.isPublished

  try {
    const { data, error } = await supabase
      .from('price_indices')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: data as DbPriceIndexRow, error: null }
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to update price index'
    }
  }
}

// 4. Toggle publish status
export const toggleAdminPriceIndexPublish = async (
  id: string,
  isPublished: boolean
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured.' }
  }

  try {
    const { error } = await supabase
      .from('price_indices')
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

// 5. Delete price index
export const deleteAdminPriceIndex = async (
  id: string
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase credentials not configured.' }
  }

  try {
    const { error } = await supabase.from('price_indices').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete price index'
    }
  }
}
