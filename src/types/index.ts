export interface Destination {
  id: string
  name: string
  subtitle: string
  region: string
  elevation: string
  description: string
  storyQuote: string
  image: string
  season: string
  tags: string[]
  featured: boolean
  coordinates: string
  highlights: string[]
}

export type DispatchType = 'price_report' | 'traveller_story' | 'host_story' | 'trail_note'

export interface Dispatch {
  id: string
  type: DispatchType
  title: string
  excerpt: string
  fullContent: string
  location: string
  date: string
  readTime: string
  author: {
    name: string
    role: string
    avatar: string
    communityBadge?: string
  }
  verified: boolean
  helpfulCount: number
  priceData?: {
    item: string
    sharedRate: string
    privateRate: string
    fairPriceNote: string
    lastUpdated: string
    history?: { month: string; rate: number }[]
    stabilityScore?: number
  }
}

export interface PriceIndexItem {
  id: string
  category: 'transit' | 'farmgate'
  item: string
  routeOrOrigin: string
  primaryRate: string
  rateUnit: string
  secondaryRate?: string
  secondaryLabel?: string
  stabilityScore: number
  trendStatus: 'stable' | 'slight_fluctuation' | 'fair_fixed'
  trendSummary: string
  monthlyHistory: {
    month: string
    rate: number
  }[]
  lastVerified: string
  verifiedBy: string
  notes: string
}

export interface Job {
  id: string
  title: string
  employer: string
  employerBadge?: string
  location: string
  region: string
  type: 'Full-time' | 'Seasonal' | 'Residency' | 'Contract'
  salary: string
  housingIncluded: boolean
  category: 'Hospitality & Estates' | 'Guiding & Conservation' | 'Agriculture & Craft' | 'Digital & Remote'
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  postedDate: string
}

export interface Homestay {
  id: string
  name: string
  region: string
  location: string
  elevation: string
  monthlyRate: string
  securityDeposit: string
  minLeaseTerm: string
  leaseStatus: string
  furnishing: string
  rating: number
  reviewsCount: number
  host: {
    name: string
    role: string
    yearsHosting: number
    avatar: string
  }
  roomType: string
  wifi: string
  capacity: string
  images: string[]
  description: string
  amenities: string[]
  features: string[]
  utilitiesIncluded: string[]
}

export interface ArchitecturalMaterial {
  name: string
  source: string
  percentage: number
  role: string
}

export interface ArchitecturalSpecimen {
  id: string
  code: string // e.g. "ARC-01"
  title: string
  subtitle: string
  archetype: string
  image: string
  elevationRange: string
  thermalRating: string
  seismicIndex: string
  craftLineage: string
  overview: string
  materials: ArchitecturalMaterial[]
  engineeringPrinciples: {
    label: string
    detail: string
  }[]
  ecologicalProtection: string
  quote: {
    text: string
    author: string
    craftTitle: string
    location: string
  }
}

export interface AdminDestination extends Destination {
  slug: string
  isPublished: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface AdminJob extends Job {
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminHomestay extends Homestay {
  slug: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminUser {
  id: string
  email: string
  fullName?: string
  role: 'superadmin' | 'admin' | 'editor' | 'moderator'
  createdAt: string
  lastSignIn?: string
}

export interface BusinessItem {
  id: string
  slug: string
  name: string
  category: string
  region: string
  location: string
  contactPerson: string
  email?: string
  phone: string
  website?: string
  description: string
  perks?: string
  isVerified: boolean
  isPublished: boolean
  createdAt: string
}
