import { useState } from 'react'
import type { FC } from 'react'
import type { Homestay } from '../../types'
import {
  Wifi,
  Star,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Check,
  Leaf,
  Compass,
  ArrowRight
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

  const regions = ['all', 'West Sikkim', 'Darjeeling Hills', 'Kalimpong Hills', 'Dooars Foothills']

  const filteredHomestays =
    selectedRegion === 'all'
      ? homestays
      : homestays.filter((h) =>
          h.region.toLowerCase().includes(
            selectedRegion.toLowerCase().replace(' hills', '').replace(' foothills', '')
          )
        )

  return (
    <section id="homestays" className="py-20 lg:py-28 bg-[#FAF8F3] border-t border-[#CBDAC4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#123D2D]/15 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-[#285A40]" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-mono font-semibold text-[#285A40]">
                RESIDENTIAL LEASES & SABBATICALS • 04
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#123D2D] font-normal tracking-tight">
              Find a place that feels like yours.
            </h2>
            <p className="mt-4 text-base text-[#576159] leading-relaxed font-light">
              Long-stay residential leases (1 to 12 months) in quiet village stone homes and tea plantation cottages. Vetted for dependable high-speed optical fiber, warm hearths, and respectful community living—not short-term tourist turnover.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onListHomestayClick}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#123D2D] text-[#E8EFE3] hover:bg-[#0A241A] text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm border border-[#285A40]"
            >
              <span>List a Long-Stay Space</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#91A77B]" />
            </button>
          </div>
        </div>

        {/* Region Filter Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#CBDAC4] mb-8 gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                type="button"
                className={`px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase rounded-sm transition-colors whitespace-nowrap ${
                  selectedRegion === reg
                    ? 'bg-[#123D2D] text-[#E8EFE3] font-semibold'
                    : 'text-[#123D2D]/70 hover:text-[#123D2D] hover:bg-[#E8EFE3]'
                }`}
              >
                {reg === 'all' ? 'All Eastern Himalayas' : reg}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#285A40]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#285A40]" />
            <span>Standardized Fair Lease Contracts • Direct Host Relationships</span>
          </div>
        </div>

        {/* State Handling: Loading, Error, Empty, or Content */}
        {isLoading ? (
          <DataLoadingSkeleton count={4} />
        ) : error ? (
          <DataErrorState message={error} onRetry={onRetry} />
        ) : filteredHomestays.length === 0 ? (
          <DataEmptyState
            title="No Residential Leases Currently Listed"
            description="There are currently no long-stay residential leases published in this mountain territory. Hosts, local families, and tea estate owners can publish a lease to welcome sabbatical creators."
            actionLabel="List a Mountain Lease"
            onAction={onListHomestayClick}
          />
        ) : (
          /* Residential Homestay Leases Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredHomestays.map((stay) => (
            <article
              key={stay.id}
              onClick={() => onSelectHomestay(stay)}
              className="group bg-white border border-[#CBDAC4] rounded-sm overflow-hidden hover:border-[#285A40] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl flex flex-col justify-between card-hover-lift"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectHomestay(stay)
                }
              }}
              aria-label={`View residential lease details for ${stay.name}`}
            >
              <div>
                {/* Large Photography Frame with Green Forest Backdrop */}
                <div className="relative h-[290px] sm:h-[330px] overflow-hidden bg-[#123D2D]">
                  <img
                    src={stay.images[0]}
                    alt={stay.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A241A]/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8EFE3]/95 backdrop-blur-md rounded-sm text-xs font-mono font-medium text-[#123D2D] shadow-sm border border-[#CBDAC4]">
                      <MapPin className="w-3.5 h-3.5 text-[#285A40]" />
                      {stay.region} • {stay.elevation}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#123D2D]/90 backdrop-blur-md rounded-sm text-xs font-mono font-semibold text-[#E8EFE3] border border-[#91A77B]/30">
                      <Star className="w-3.5 h-3.5 fill-[#91A77B] text-[#91A77B]" />
                      <span>{stay.rating.toFixed(2)}</span>
                      <span className="text-[#E8EFE3]/60">({stay.reviewsCount})</span>
                    </span>
                  </div>

                  {/* Lease Status & Minimum Term Overlay Banner */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[#E8EFE3] text-xs font-mono">
                    <span className="inline-flex items-center gap-1.5 bg-[#0A241A]/85 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-[#91A77B]/30">
                      <Calendar className="w-3.5 h-3.5 text-[#91A77B]" />
                      <span>{stay.minLeaseTerm}</span>
                    </span>

                    <span className="inline-flex items-center gap-1.5 bg-[#0A241A]/85 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-[#91A77B]/30">
                      <Wifi className="w-3.5 h-3.5 text-[#91A77B]" />
                      <span>{stay.wifi.split('Dedicated')[0].trim()}</span>
                    </span>
                  </div>
                </div>

                {/* Lease Information Content */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#123D2D] font-normal leading-snug group-hover:text-[#285A40] transition-colors">
                        {stay.name}
                      </h3>
                      <p className="text-xs font-mono text-[#285A40] mt-1 font-medium">
                        {stay.location}
                      </p>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-[#E8EFE3] border border-[#CBDAC4] flex items-center justify-center text-[#123D2D] group-hover:bg-[#123D2D] group-hover:text-[#E8EFE3] transition-colors flex-shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Room Details & Furnishing */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 mb-3 text-xs font-mono text-[#576159]">
                    <span className="bg-[#E8EFE3] text-[#123D2D] border border-[#CBDAC4] px-2.5 py-1 rounded-sm font-medium">
                      {stay.roomType.split('&')[0].trim()}
                    </span>
                    <span className="bg-[#FAF8F3] border border-[#CBDAC4] px-2.5 py-1 rounded-sm">
                      {stay.furnishing}
                    </span>
                  </div>

                  <p className="text-sm text-[#576159] leading-relaxed font-light line-clamp-2">
                    {stay.description}
                  </p>

                  {/* Utilities & Sabbatical Inclusions */}
                  <div className="mt-4 pt-4 border-t border-[#CBDAC4]">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-[#576159] mb-2 font-bold">
                      RESIDENTIAL INCLUSIONS & INFRASTRUCTURE
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#123D2D]">
                      {stay.utilitiesIncluded.slice(0, 4).map((util) => (
                        <div key={util} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#285A40] flex-shrink-0" />
                          <span className="truncate">{util}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Monthly Rent & Refundable Deposit Details */}
              <div className="px-6 sm:px-7 pb-6 pt-4 border-t border-[#CBDAC4] flex items-center justify-between bg-[#E8EFE3]/50">
                <div className="flex items-center gap-2.5">
                  <img
                    src={stay.host.avatar}
                    alt={stay.host.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#285A40]/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#123D2D] block leading-tight">
                      {stay.host.name}
                    </span>
                    <span className="text-[10px] text-[#576159] font-mono mt-0.5 block">
                      Local Host • {stay.host.yearsHosting} yrs hosting
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline gap-1 justify-end">
                    <span className="font-serif text-2xl font-bold text-[#123D2D] leading-none">
                      {stay.monthlyRate}
                    </span>
                    <span className="text-xs font-mono text-[#576159]">/ month</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#285A40] mt-1 block font-bold">
                    Deposit: {stay.securityDeposit} (Refundable)
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

        {/* Curatorial Bridge Banner to Himalayan Architectural Ledger */}
        <div className="mt-14 p-6 sm:p-8 bg-[#0B2516] text-[#F8F6F0] border border-[#1F4E34] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-[#8FA777] mb-2">
              <Compass className="w-3.5 h-3.5 text-[#8FA777]" />
              <span>INDIGENOUS CRAFTSMANSHIP & MATERIAL ARCHIVES</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Curious how these mountain homes stay warm at -4°C?
            </h3>
            <p className="text-xs sm:text-sm text-[#E7EFE3]/80 font-light mt-1.5 leading-relaxed font-sans">
              Discover the engineering behind hand-hewn cedar beams, 14-hour radiant river-stone Bukhari hearths, and zero-runoff alpine watershed protection in our museum ledger below.
            </p>
          </div>

          <a
            href="#architecture"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#FDFBF7] text-[#0B2516] hover:bg-white text-xs uppercase tracking-[0.16em] font-sans font-semibold shrink-0 transition-all shadow-md group"
          >
            <span>Explore Material Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0B2516] group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
