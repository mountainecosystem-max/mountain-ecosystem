export interface BrandingConfig {
  /** Full brand / company name (e.g. "Mountain Ecosystem") */
  name: string
  /** Shorter display name for badges or compact UI */
  shortName: string
  /** Primary brand tagline (e.g. "Explore • Work • Belong") */
  tagline: string
  /** Secondary poetic / editorial tagline */
  subTagline: string
  /** Primary geographic territory */
  region: string
  /** Headquarters or territorial anchor */
  headquarters: string
  /** Mission / manifesto statement */
  missionStatement: string
  /** Support / steward contact email */
  supportEmail: string
  /** Copyright year */
  copyrightYear: number
  /** Configurable brand logos */
  logo: {
    /** Primary horizontal logo (emblem + typography) */
    horizontal: string
    /** Square/circular icon only */
    icon: string
    /** Original full canvas asset */
    full: string
    /** Accessible screen-reader text */
    alt: string
  }
  /** Metadata and page titles */
  meta: {
    defaultTitle: string
    titleTemplate: string
    adminTitle: string
    description: string
  }
}

/**
 * Centralized Branding Configuration
 *
 * TO REBRAND THE PLATFORM:
 * Simply update the properties in this object.
 * All public pages, navigation bars, footers, admin dashboards, modals,
 * and page metadata will update consistently.
 */
export const BRAND_CONFIG: BrandingConfig = {
  name: 'Mountain Ecosystem',
  shortName: 'Mountain',
  tagline: 'Explore • Work • Belong across All Indian Mountain Ranges',
  subTagline: 'Pan-India Mountain SaaS for Properties, Jobs & Community Experiences.',
  region: 'Pan-India Mountain Ranges',
  headquarters: 'Connecting Mountain Communities Across India • 800m to 4,500m',
  missionStatement:
    'A unified digital SaaS platform for all mountain regions of India. Connecting travellers, property owners, ethical mountain employers, and high-altitude communities across Himachal Pradesh, Uttarakhand, Ladakh, Jammu & Kashmir, Sikkim, the Northeast, Bengal Hills, and the Western Ghats.',
  supportEmail: 'mountainecosystem@gmail.com',
  copyrightYear: new Date().getFullYear(),
  logo: {
    horizontal: '/logo.png',
    icon: '/logo-icon.png',
    full: '/logo-full.png',
    alt: 'Mountain Ecosystem • Explore • Work • Belong'
  },
  meta: {
    defaultTitle: 'Mountain Ecosystem — Pan-India Mountain Properties, Jobs & Community',
    titleTemplate: '%s | Mountain Ecosystem',
    adminTitle: 'Mountain Ecosystem | Staff Management Console',
    description:
      'A unified digital SaaS platform for all mountain regions of India: discover community experiences, verified mountain jobs, and properties for lease or sale across Himachal, Uttarakhand, Ladakh, Kashmir, Sikkim, Northeast, Bengal Hills, and the Western Ghats.'
  }
}

/**
 * Helper to update document title and metadata based on the central branding configuration
 */
export const setPageTitle = (pageTitle?: string): void => {
  if (typeof document === 'undefined') return
  const finalTitle = pageTitle
    ? BRAND_CONFIG.meta.titleTemplate.replace('%s', pageTitle)
    : BRAND_CONFIG.meta.defaultTitle

  document.title = finalTitle

  // Sync meta description
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  metaDesc.setAttribute('content', BRAND_CONFIG.meta.description)

  // Sync OpenGraph meta tags
  let ogTitle = document.querySelector('meta[property="og:title"]')
  if (!ogTitle) {
    ogTitle = document.createElement('meta')
    ogTitle.setAttribute('property', 'og:title')
    document.head.appendChild(ogTitle)
  }
  ogTitle.setAttribute('content', finalTitle)

  let ogSiteName = document.querySelector('meta[property="og:site_name"]')
  if (!ogSiteName) {
    ogSiteName = document.createElement('meta')
    ogSiteName.setAttribute('property', 'og:site_name')
    document.head.appendChild(ogSiteName)
  }
  ogSiteName.setAttribute('content', BRAND_CONFIG.name)
}
