import { useState } from 'react'
import type { FC } from 'react'
import type { Homestay } from '../../types'
import {
  Wifi,
  Star,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  Flame,
  Users,
  ArrowUpRight
} from 'lucide-react'
import { DataLoadingSkeleton, DataEmptyState, DataErrorState } from '../common/StateViews'

interface HomestayMarketplaceProps {
  homestays: Homestay[]
  onSelectHomestay: (homestay: Homestay) => void
  onListHomestayClick: () => void
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export const HomestayMarketplace: FC<HomestayMarketplaceProps> = ({
  homestays,
  onSelectHomestay,
  onListHomestayClick,
  isLoading = false,
  error = null,
  onRetry
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  const regions = [
    { id: 'all', label: 'All Sanctuaries' },
    { id: 'Darjeeling', label: 'Darjeeling Tea Ridges' },
    { id: 'Kalimpong', label: 'Kalimpong Heights' },
    { id: 'Sikkim', label: 'Sikkim Organic Valleys' },
    { id: 'Dooars', label: 'Dooars Forest Foothills' }
  ]

  const filteredHomestays =
    selectedRegion === 'all'
      ? homestays
      : homestays.filter((h) =>
          h.region.toLowerCase().includes(selectedRegion.toLowerCase())
        )

  // Helper function to derive badge text from homestay properties
  const getBadge = (stay: Homestay, idx: number) => {
    if (idx === 0) return 'Most Loved by Couples'
    if (idx === 1) return 'Architectural Marvel'
    if (idx === 2) return 'Tea Garden Panorama'
    if (stay.elevation.includes('2,000') || stay.elevation.includes('2,100') || stay.elevation.includes('2,042')) {
      return 'High Alpine Ridge'
    }
    return 'Authentic Mountain Hearth'
  }

  return (
    <section id="homestays" className="py-16 sm:py-24 bg-[#FAF7EE] border-t border-[#CBDAC4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Awara Layout with Tea Garden Greenery) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#CBDAC4] gap-6">
          <div className="max-w-3xl">
            <span className="text-[#164E2D] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono mb-2">
              <Sparkles className="w-4 h-4 text-[#D96B27]" />
              <span>HANDCRAFTED PINE SANCTUARIES & COTTAGES</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A2316] uppercase leading-tight">
              OUR COTTAGES & ALPINE SUITES
            </h2>
            <p className="text-stone-700 text-sm sm:text-base mt-2.5 font-light leading-relaxed">
              Designed with local reclaimed cedar timber, private sun-decks framing virgin pine forests, and real wood-burning river-stone hearths for crisp mountain evenings. Available for nightly getaways or 1–12 month sabbatical residential leases.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-end shrink-0">
            <button
              onClick={onListHomestayClick}
              type="button"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#164E2D] hover:text-[#0A2316] border-b-2 border-[#164E2D] pb-1 group transition"
            >
              <span>List Your Mountain Space</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Territory Filter Chips Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                type="button"
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full transition-all whitespace-nowrap ${
                  selectedRegion === reg.id
                    ? 'bg-[#164E2D] text-white font-bold shadow-md'
                    : 'bg-white border border-[#CBDAC4] text-stone-700 hover:bg-[#E8EFE3] hover:text-[#0A2316]'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#164E2D]">
            <ShieldCheck className="w-4 h-4 text-[#164E2D]" />
            <span>Direct Host Pricing • Verified High-Speed Fiber • 100% Organic Farm Kitchen</span>
          </div>
        </div>

        {/* State Handling: Loading, Error, Empty, or Awara-Style Cards Grid */}
        {isLoading ? (
          <DataLoadingSkeleton count={4} />
        ) : error ? (
          <DataErrorState message={error} onRetry={onRetry} />
        ) : filteredHomestays.length === 0 ? (
          <DataEmptyState
            title="No Cottages Currently Available in this Territory"
            description="All sanctuaries in this valley are currently reserved. You may choose another territory or request custom dates from the host network."
            actionLabel="View All Sanctuaries"
            onAction={() => setSelectedRegion('all')}
          />
        ) : (
          /* Awara-Style Rich Cottage Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHomestays.map((stay, idx) => {
              // Calculate nightly equivalent rate from monthly rate string (e.g. "₹32,000")
              const numericMonthly = parseInt(stay.monthlyRate.replace(/[^0-9]/g, ''), 10) || 32000
              const nightlyRate = Math.round(numericMonthly / 22)
              const originalRate = Math.round(nightlyRate * 1.3)

              return (
                <article
                  key={stay.id}
                  onClick={() => onSelectHomestay(stay)}
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer card-hover-lift"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectHomestay(stay)
                    }
                  }}
                  aria-label={`View cottage details for ${stay.name}`}
                >
                  <div>
                    {/* Visual Photo Card with Top Overlay Badges */}
                    <div className="relative h-64 sm:h-72 overflow-hidden bg-[#0A2316]">
                      <img
                        src={stay.images[0]}
                        alt={stay.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />

                      {/* Subtle Vignette Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20 pointer-events-none" />

                      {/* Top Curated Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#05170D]/90 backdrop-blur-md text-[#C6E8A3] border border-[#2D6B48]/60 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                          {getBadge(stay, idx)}
                        </span>
                      </div>

                      {/* Star Rating Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="bg-stone-950/85 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10 shadow">
                          <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
                          <span>{stay.rating.toFixed(2)}</span>
                          <span className="text-white/60 font-normal text-[10px]">({stay.reviewsCount})</span>
                        </span>
                      </div>

                      {/* Elevation & Region Stamp */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                        <span className="flex items-center gap-1 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md">
                          <MapPin className="w-3 h-3 text-[#A5C896]" />
                          <span>{stay.region}</span>
                        </span>

                        <span className="bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[#A5C896]">
                          {stay.elevation}
                        </span>
                      </div>
                    </div>

                    {/* Cottage Details Body */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-display text-2xl font-bold text-stone-950 uppercase tracking-tight group-hover:text-[#164E2D] transition-colors leading-tight">
                            {stay.name}
                          </h3>
                          <p className="text-xs text-stone-500 font-mono mt-1 flex items-center gap-1">
                            <span>{stay.location}</span>
                          </p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-600 font-light mt-2 line-clamp-2 leading-relaxed">
                        {stay.description}
                      </p>

                      {/* Inclusions & Highlights Strip */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-100 text-xs font-mono text-stone-700">
                        <div className="flex items-center gap-1.5 truncate">
                          <Flame className="w-3.5 h-3.5 text-[#D96B27] shrink-0" />
                          <span className="truncate">River-stone Hearth</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Wifi className="w-3.5 h-3.5 text-[#164E2D] shrink-0" />
                          <span className="truncate">{stay.wifi.split('Dedicated')[0].trim()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Check className="w-3.5 h-3.5 text-[#164E2D] shrink-0" />
                          <span className="truncate">Organic Farm Breakfast</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Users className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                          <span className="truncate">{stay.roomType.split('&')[0].trim()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & CTA Card Footer */}
                  <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between mt-auto">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-2xl font-bold text-[#0A2316]">
                          ₹{nightlyRate.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-stone-400 line-through">
                          ₹{originalRate.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-stone-500 font-normal">/ night</span>
                      </div>
                      <div className="text-[10px] font-mono text-[#164E2D] font-semibold">
                        Sabbatical Lease: {stay.monthlyRate.startsWith('₹') ? stay.monthlyRate : `₹${stay.monthlyRate}`} / mo
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectHomestay(stay)
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#164E2D] hover:bg-[#0A2316] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl shadow transition transform active:scale-95"
                    >
                      <span>Reserve</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
