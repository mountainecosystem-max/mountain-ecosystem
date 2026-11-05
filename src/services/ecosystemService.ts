import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type {
  Destination,
  Dispatch,
  Job,
  Homestay,
  ArchitecturalSpecimen,
  PriceIndexItem
} from '../types'
import {
  DEV_PREVIEW_DESTINATIONS,
  DEV_PREVIEW_HOMESTAYS,
  DEV_PREVIEW_JOBS,
  DEV_PREVIEW_DISPATCHES,
  DEV_PREVIEW_SPECIMENS,
  DEV_PREVIEW_PRICE_INDEX
} from '../data/previewData'

export type DataMode = 'production' | 'preview'

// Database row interface mappings
interface DbDestination {
  id: string
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
}

interface DbHomestay {
  id: string
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
}

interface DbJob {
  id: string
  title: string
  employer: string
  employer_badge: string | null
  location: string
  region: string
  type: 'Full-time' | 'Seasonal' | 'Residency' | 'Contract'
  salary: string
  housing_included: boolean | null
  category: 'Hospitality & Estates' | 'Guiding & Conservation' | 'Agriculture & Craft' | 'Digital & Remote'
  description: string
  responsibilities: string[] | null
  requirements: string[] | null
  benefits: string[] | null
  posted_date: string
}

interface DbDispatch {
  id: string
  type: 'price_report' | 'traveller_story' | 'host_story' | 'trail_note'
  title: string
  excerpt: string
  full_content: string
  location: string
  date: string
  read_time: string
  author_name: string
  author_role: string
  author_avatar: string | null
  community_badge: string | null
  verified: boolean | null
  helpful_count: number | null
  price_item: string | null
  price_shared_rate: string | null
  price_private_rate: string | null
  price_note: string | null
  price_last_updated: string | null
  price_stability_score: number | null
}

// -----------------------------------------------------------------------------
// 1. Destinations Service
// -----------------------------------------------------------------------------
export const fetchDestinations = async (mode: DataMode): Promise<Destination[]> => {
  if (mode === 'preview') {
    return DEV_PREVIEW_DESTINATIONS
  }

  if (!isSupabaseConfigured()) {
    // Supabase not configured in production mode: return empty array so clean empty state is shown
    return []
  }

  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to query destinations from Supabase:', error.message)
    throw new Error(`Unable to load destinations: ${error.message}`)
  }

  if (!data || data.length === 0) return []

  return (data as DbDestination[]).map((d) => ({
    id: d.id,
    name: d.name,
    subtitle: d.subtitle,
    region: d.region,
    elevation: d.elevation,
    description: d.description,
    storyQuote: d.story_quote || '',
    image: d.image,
    season: d.season,
    tags: d.tags || [],
    featured: Boolean(d.featured),
    coordinates: d.coordinates,
    highlights: d.highlights || []
  }))
}

// -----------------------------------------------------------------------------
// 2. Homestays Service
// -----------------------------------------------------------------------------
export const fetchHomestays = async (mode: DataMode): Promise<Homestay[]> => {
  if (mode === 'preview') {
    return DEV_PREVIEW_HOMESTAYS
  }

  if (!isSupabaseConfigured()) {
    return []
  }

  const { data, error } = await supabase
    .from('homestays')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to query homestays from Supabase:', error.message)
    throw new Error(`Unable to load homestay leases: ${error.message}`)
  }

  if (!data || data.length === 0) return []

  return (data as DbHomestay[]).map((h) => ({
    id: h.id,
    name: h.name,
    region: h.region,
    location: h.location,
    elevation: h.elevation,
    monthlyRate: h.monthly_rate,
    securityDeposit: h.security_deposit,
    minLeaseTerm: h.min_lease_term,
    leaseStatus: h.lease_status || 'Available for Lease',
    furnishing: h.furnishing || 'Furnished Stone & Cedar',
    rating: h.rating || 5.0,
    reviewsCount: h.reviews_count || 0,
    host: {
      name: h.host_name,
      role: h.host_role || 'Local Host',
      yearsHosting: h.host_years || 1,
      avatar: h.host_avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    },
    roomType: h.room_type,
    wifi: h.wifi,
    capacity: h.capacity,
    images: h.images && h.images.length > 0 ? h.images : [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85'
    ],
    description: h.description,
    amenities: h.amenities || [],
    features: h.features || [],
    utilitiesIncluded: h.utilities_included || []
  }))
}

// -----------------------------------------------------------------------------
// 3. Mountain Jobs Service
// -----------------------------------------------------------------------------
export const fetchJobs = async (mode: DataMode): Promise<Job[]> => {
  if (mode === 'preview') {
    return DEV_PREVIEW_JOBS
  }

  if (!isSupabaseConfigured()) {
    return []
  }

  const { data, error } = await supabase
    .from('mountain_jobs')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to query jobs from Supabase:', error.message)
    throw new Error(`Unable to load mountain jobs: ${error.message}`)
  }

  if (!data || data.length === 0) return []

  return (data as DbJob[]).map((j) => ({
    id: j.id,
    title: j.title,
    employer: j.employer,
    employerBadge: j.employer_badge || undefined,
    location: j.location,
    region: j.region,
    type: j.type,
    salary: j.salary,
    housingIncluded: Boolean(j.housing_included),
    category: j.category,
    description: j.description,
    responsibilities: j.responsibilities || [],
    requirements: j.requirements || [],
    benefits: j.benefits || [],
    postedDate: j.posted_date
  }))
}

// -----------------------------------------------------------------------------
// 4. Community Dispatches Service
// -----------------------------------------------------------------------------
export const fetchDispatches = async (mode: DataMode): Promise<Dispatch[]> => {
  if (mode === 'preview') {
    return DEV_PREVIEW_DISPATCHES
  }

  if (!isSupabaseConfigured()) {
    return []
  }

  const { data, error } = await supabase
    .from('community_dispatches')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to query dispatches from Supabase:', error.message)
    throw new Error(`Unable to load community dispatches: ${error.message}`)
  }

  if (!data || data.length === 0) return []

  return (data as DbDispatch[]).map((d) => ({
    id: d.id,
    type: d.type,
    title: d.title,
    excerpt: d.excerpt,
    fullContent: d.full_content,
    location: d.location,
    date: d.date,
    readTime: d.read_time,
    author: {
      name: d.author_name,
      role: d.author_role,
      avatar: d.author_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      communityBadge: d.community_badge || undefined
    },
    verified: Boolean(d.verified),
    helpfulCount: d.helpful_count || 0,
    priceData: d.price_item
      ? {
          item: d.price_item,
          sharedRate: d.price_shared_rate || '',
          privateRate: d.price_private_rate || '',
          fairPriceNote: d.price_note || '',
          lastUpdated: d.price_last_updated || 'Recent',
          stabilityScore: d.price_stability_score ? Number(d.price_stability_score) : undefined
        }
      : undefined
  }))
}

// -----------------------------------------------------------------------------
// 5. Architectural Specimens Service
// -----------------------------------------------------------------------------
export const fetchArchitecturalSpecimens = async (
  mode: DataMode
): Promise<ArchitecturalSpecimen[]> => {
  if (mode === 'preview') {
    return DEV_PREVIEW_SPECIMENS
  }

  if (!isSupabaseConfigured()) {
    return []
  }

  const { data, error } = await supabase
    .from('architectural_specimens')
    .select(`
      *,
      materials:architectural_materials(*),
      principles:architectural_principles(*)
    `)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to query architectural specimens from Supabase:', error.message)
    throw new Error(`Unable to load architectural specimens: ${error.message}`)
  }

  if (!data || data.length === 0) return []

  interface SupabaseSpecimenJoin {
    id: string
    code: string
    title: string
    subtitle: string
    archetype: string
    image: string
    elevation_range: string
    thermal_rating: string
    seismic_index: string
    craft_lineage: string
    overview: string
    ecological_protection: string
    quote_text: string
    quote_author: string
    quote_craft_title: string
    quote_location: string
    materials?: { name: string; source: string; percentage: number; role: string }[]
    principles?: { label: string; detail: string }[]
  }

  return (data as SupabaseSpecimenJoin[]).map((s) => ({
    id: s.id,
    code: s.code,
    title: s.title,
    subtitle: s.subtitle,
    archetype: s.archetype,
    image: s.image,
    elevationRange: s.elevation_range,
    thermalRating: s.thermal_rating,
    seismicIndex: s.seismic_index,
    craftLineage: s.craft_lineage,
    overview: s.overview,
    materials: s.materials || [],
    engineeringPrinciples: s.principles || [],
    ecologicalProtection: s.ecological_protection,
    quote: {
      text: s.quote_text,
      author: s.quote_author,
      craftTitle: s.quote_craft_title,
      location: s.quote_location
    }
  }))
}

// -----------------------------------------------------------------------------
// 6. Price Stability Index Service
// -----------------------------------------------------------------------------
export const fetchPriceIndex = async (mode: DataMode): Promise<PriceIndexItem[]> => {
  if (mode === 'preview') {
    return DEV_PREVIEW_PRICE_INDEX
  }

  if (!isSupabaseConfigured()) {
    return []
  }

  const { data, error } = await supabase
    .from('price_indices')
    .select(`
      *,
      history:price_history(*)
    `)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to query price indices from Supabase:', error.message)
    throw new Error(`Unable to load ground price index: ${error.message}`)
  }

  if (!data || data.length === 0) return []

  interface SupabasePriceJoin {
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
    last_verified: string
    verified_by: string
    notes: string | null
    history?: { month: string; rate: number; sort_order: number }[]
  }

  return (data as SupabasePriceJoin[]).map((p) => {
    const sortedHistory = (p.history || []).sort(
      (a, b) => a.sort_order - b.sort_order
    )
    return {
      id: p.id,
      category: p.category,
      item: p.item,
      routeOrOrigin: p.route_or_origin,
      primaryRate: p.primary_rate,
      rateUnit: p.rate_unit,
      secondaryRate: p.secondary_rate || undefined,
      secondaryLabel: p.secondary_label || undefined,
      stabilityScore: Number(p.stability_score) || 98.0,
      trendStatus: p.trend_status,
      trendSummary: p.trend_summary,
      monthlyHistory: sortedHistory.map((h) => ({
        month: h.month,
        rate: Number(h.rate)
      })),
      lastVerified: p.last_verified,
      verifiedBy: p.verified_by,
      notes: p.notes || ''
    }
  })
}

// -----------------------------------------------------------------------------
// 7. Visitor Submissions (Fellowship, Jobs, Lease Inquiries)
// -----------------------------------------------------------------------------
export interface FellowshipSubmission {
  fullName: string
  email: string
  phone: string
  role: 'traveller' | 'host' | 'seeker' | 'employer'
  region: string
  intent: string
}

export interface JobApplicationSubmission {
  jobId?: string
  fullName: string
  email: string
  phone: string
  note: string
}

export interface LeaseInquirySubmission {
  homestayId?: string
  guestName: string
  email: string
  phone: string
  intendedTerm: string
  startDate: string
  profession: string
  message: string
}

export const submitFellowshipApplication = async (
  data: FellowshipSubmission
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const session = (await supabase.auth.getSession()).data?.session
  const userId = session?.user?.id || null

  const payload: Record<string, any> = {
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    role: data.role,
    region: data.region,
    intent: data.intent
  }
  if (userId) payload.user_id = userId

  let { error } = await supabase.from('fellowship_applications').insert(payload)

  // Fallback if user_id column does not exist yet
  if (error && error.message?.includes('user_id')) {
    delete payload.user_id
    const retry = await supabase.from('fellowship_applications').insert(payload)
    error = retry.error
  }

  if (error) {
    console.error('Failed to submit fellowship application to Supabase:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export const submitJobApplication = async (
  data: JobApplicationSubmission
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const session = (await supabase.auth.getSession()).data?.session
  const userId = session?.user?.id || null

  const payload: Record<string, any> = {
    job_id: data.jobId || null,
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    note: data.note
  }
  if (userId) payload.user_id = userId

  let { error } = await supabase.from('job_applications').insert(payload)

  // Fallback if user_id column does not exist yet
  if (error && error.message?.includes('user_id')) {
    delete payload.user_id
    const retry = await supabase.from('job_applications').insert(payload)
    error = retry.error
  }

  if (error) {
    console.error('Failed to submit job application to Supabase:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export const submitLeaseInquiry = async (
  data: LeaseInquirySubmission
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  const session = (await supabase.auth.getSession()).data?.session
  const userId = session?.user?.id || null

  const payload: Record<string, any> = {
    homestay_id: data.homestayId || null,
    guest_name: data.guestName,
    email: data.email,
    phone: data.phone,
    intended_term: data.intendedTerm,
    start_date: data.startDate,
    profession: data.profession,
    message: data.message
  }
  if (userId) payload.user_id = userId

  let { error } = await supabase.from('lease_inquiries').insert(payload)

  // Fallback if user_id column does not exist yet
  if (error && error.message?.includes('user_id')) {
    delete payload.user_id
    const retry = await supabase.from('lease_inquiries').insert(payload)
    error = retry.error
  }

  if (error) {
    console.error('Failed to submit lease inquiry to Supabase:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// -----------------------------------------------------------------------------
// 8. Community Member Posting (Dispatches & Field Notes)
// -----------------------------------------------------------------------------
export interface CreateDispatchInput {
  type: 'price_report' | 'traveller_story' | 'host_story' | 'trail_note'
  title: string
  excerpt: string
  fullContent: string
  location: string
  authorName: string
  authorRole?: string
  authorAvatar?: string
  priceItem?: string
  priceSharedRate?: string
  pricePrivateRate?: string
}

export const createDispatch = async (
  input: CreateDispatchInput
): Promise<{ success: boolean; data?: Dispatch; error?: string }> => {
  const newDispatch: Dispatch = {
    id: `disp-${Date.now()}`,
    type: input.type,
    title: input.title,
    excerpt: input.excerpt,
    fullContent: input.fullContent,
    location: input.location,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: '3 min read',
    author: {
      name: input.authorName,
      role: input.authorRole || 'Community Fellow',
      avatar: input.authorAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      communityBadge: 'Verified Fellow'
    },
    verified: false,
    helpfulCount: 0,
    priceData: input.priceItem
      ? {
          item: input.priceItem,
          sharedRate: input.priceSharedRate || '',
          privateRate: input.pricePrivateRate || '',
          fairPriceNote: 'Submitted by verified community member',
          lastUpdated: 'Just now',
          stabilityScore: 95.0
        }
      : undefined
  }

  if (!isSupabaseConfigured()) {
    return { success: true, data: newDispatch }
  }

  const session = (await supabase.auth.getSession()).data?.session
  const userId = session?.user?.id || null

  const payload: Record<string, any> = {
    type: input.type,
    title: input.title,
    excerpt: input.excerpt,
    full_content: input.fullContent,
    location: input.location,
    date: newDispatch.date,
    read_time: newDispatch.readTime,
    author_name: input.authorName,
    author_role: input.authorRole || 'Community Fellow',
    author_avatar: input.authorAvatar || null,
    community_badge: 'Verified Fellow',
    verified: false,
    helpful_count: 0,
    is_published: true,
    price_item: input.priceItem || null,
    price_shared_rate: input.priceSharedRate || null,
    price_private_rate: input.pricePrivateRate || null
  }
  if (userId) payload.user_id = userId

  let { error } = await supabase.from('community_dispatches').insert(payload)

  // Fallback if user_id column does not exist yet
  if (error && error.message?.includes('user_id')) {
    delete payload.user_id
    const retry = await supabase.from('community_dispatches').insert(payload)
    error = retry.error
  }

  if (error) {
    console.error('Failed to create dispatch in Supabase:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true, data: newDispatch }
}
