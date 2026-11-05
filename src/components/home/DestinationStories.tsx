import { useState } from 'react'
import type { FC } from 'react'
import type { Destination } from '../../types'
import { ArrowUpRight, Mountain, Sun, Leaf } from 'lucide-react'
import { DataLoadingSkeleton, DataEmptyState, DataErrorState } from '../common/StateViews'

interface DestinationStoriesProps {
  destinations: Destination[]
  onSelectDestination: (dest: Destination) => void
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export const DestinationStories: FC<DestinationStoriesProps> = ({
  destinations,
  onSelectDestination,
  isLoading = false,
  error = null,
  onRetry
}) => {
  const [activeTab, setActiveTab] = useState<string>('all')

  const hasDestinations = destinations && destinations.length > 0
  const featured = hasDestinations ? (destinations.find((d) => d.featured) || destinations[0]) : null
  const supporting = hasDestinations && featured ? destinations.filter((d) => d.id !== featured.id) : []

  const filteredSupporting =
    activeTab === 'all'
      ? supporting
      : supporting.filter((d) => d.id === activeTab)

  return (
    <section id="destinations" className="py-20 lg:py-28 bg-[#F8F6F0] border-t border-[#CBDAC4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 pb-6 border-b border-[#123D2D]/15 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-[#285A40]" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-mono font-semibold text-[#285A40]">
                BOTANICAL ATLAS • 01
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#123D2D] font-normal tracking-tight">
              Four Mountain Sanctuaries.
              <span className="block italic text-[#285A40] mt-1">Lush Green Ridges & Valleys.</span>
            </h2>
            <p className="mt-4 text-base text-[#576159] leading-relaxed font-light">
              Journey through the biodynamic emerald tea gardens of Darjeeling, the orchid ridges of Kalimpong, the sacred organic valleys of Sikkim, and the dense Sal rainforests of the Dooars.
            </p>
          </div>

          {/* Quick Territorial Navigation Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              type="button"
              className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#123D2D] text-[#E8EFE3]'
                  : 'text-[#123D2D]/70 hover:text-[#123D2D] hover:bg-[#E8EFE3]'
              }`}
            >
              All Territories
            </button>
            {hasDestinations && destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => {
                  if (featured && dest.id === featured.id) {
                    setActiveTab('all')
                    onSelectDestination(dest)
                  } else {
                    setActiveTab(dest.id)
                  }
                }}
                type="button"
                className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors whitespace-nowrap ${
                  activeTab === dest.id
                    ? 'bg-[#123D2D] text-[#E8EFE3]'
                    : 'text-[#123D2D]/70 hover:text-[#123D2D] hover:bg-[#E8EFE3]'
                }`}
              >
                {dest.name}
              </button>
            ))}
          </div>
        </div>

        {/* State Handling: Loading, Error, Empty, or Content */}
        {isLoading ? (
          <DataLoadingSkeleton variant="asymmetric" />
        ) : error ? (
          <DataErrorState message={error} onRetry={onRetry} />
        ) : !hasDestinations || !featured ? (
          <DataEmptyState
            title="No Mountain Sanctuaries Published"
            description="Client administrators can configure and publish Eastern Himalayan destination territories through the Supabase database. Published regions will immediately appear here."
            actionLabel="Awaiting Client Entries"
          />
        ) : (
          /* Asymmetric Photography Grid with Strong Greenery Focal Points */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* 1. Large Prominent Featured Destination: Darjeeling Tea Gardens (7 Columns) */}
          <div className="lg:col-span-7">
            <div
              onClick={() => onSelectDestination(featured)}
              className="group relative h-[520px] sm:h-[620px] lg:h-full min-h-[540px] overflow-hidden rounded-sm bg-[#123D2D] cursor-pointer border border-[#285A40]/30 transition-all duration-300 hover:shadow-2xl hover:border-[#91A77B] flex flex-col justify-between"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectDestination(featured)
                }
              }}
              aria-label={`View story and experiences for ${featured.name}`}
            >
              {/* Photo Background: Vibrant Green Tea Gardens in Mist */}
              <img
                src={featured.image}
                alt={featured.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105 brightness-105 contrast-105 saturate-110"
                loading="lazy"
              />

              {/* Luminous Forest Green Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A241A]/85 via-[#123D2D]/30 to-black/10 pointer-events-none" />

              {/* Top Badging */}
              <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8EFE3]/95 backdrop-blur-md rounded-sm text-xs font-mono text-[#123D2D] font-bold border border-[#CBDAC4] shadow-sm">
                  <Mountain className="w-3.5 h-3.5 text-[#285A40]" />
                  {featured.elevation}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#E8EFE3] bg-[#123D2D]/85 backdrop-blur-sm px-3 py-1 rounded-sm border border-[#91A77B]/30">
                    FEATURED GREEN SANCTUARY • 01
                  </span>
                </div>
              </div>

              {/* Bottom Editorial Content */}
              <div className="relative z-10 p-6 sm:p-8 text-[#E8EFE3]">
                <div className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#91A77B] font-semibold mb-2">
                  {featured.region} • {featured.coordinates}
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-white group-hover:text-[#ADC298] transition-colors">
                    {featured.name}
                  </h3>
                  <div className="w-11 h-11 rounded-full bg-white/10 border border-[#91A77B]/40 flex items-center justify-center text-white group-hover:bg-[#285A40] group-hover:border-[#91A77B] transition-all duration-300 flex-shrink-0">
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#91A77B] group-hover:text-white" />
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#E8EFE3]/90 mt-2.5 max-w-xl font-light leading-relaxed">
                  {featured.subtitle}
                </p>

                {/* Archival Pull Quote */}
                <blockquote className="mt-4 pt-4 border-t border-white/20 italic font-serif text-sm sm:text-base text-[#ADC298]">
                  "{featured.storyQuote}"
                </blockquote>

                {/* Cultural Trail Tags */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/15">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2.5 py-1 bg-[#123D2D]/70 backdrop-blur-sm rounded-sm text-[#E8EFE3] border border-[#91A77B]/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Supporting Destinations: Kalimpong, Sikkim, Dooars (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
            {filteredSupporting.map((dest, idx) => (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest)}
                className="group relative h-[180px] sm:h-[195px] overflow-hidden rounded-sm bg-[#123D2D] cursor-pointer border border-[#285A40]/30 transition-all duration-300 hover:shadow-xl hover:border-[#91A77B] card-hover-lift"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectDestination(dest)
                  }
                }}
                aria-label={`View story and experiences for ${dest.name}`}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 brightness-105 contrast-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0A241A]/85 via-[#123D2D]/35 to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="relative z-10 p-4 flex items-center justify-between text-white">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-[#91A77B] font-semibold bg-[#0A241A]/85 px-2.5 py-0.5 rounded-sm border border-[#91A77B]/30">
                    {`0${idx + 2} • ${dest.name.toUpperCase()}`}
                  </span>
                  <span className="text-[11px] font-mono text-[#E8EFE3]/90 bg-black/40 px-2 py-0.5 rounded-sm">
                    {dest.elevation}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-2xl font-normal text-white group-hover:text-[#ADC298] transition-colors">
                        {dest.name}
                      </h4>
                      <p className="text-xs text-[#E8EFE3]/80 line-clamp-1 mt-0.5 font-light">
                        {dest.subtitle}
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-[#285A40] group-hover:border-[#91A77B] transition-all duration-200 flex-shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-[#91A77B] group-hover:text-white" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/15 text-[10px] font-mono text-[#E8EFE3]/70">
                    <Sun className="w-3 h-3 text-[#91A77B]" />
                    <span>Best Season: {dest.season.split('(')[0].trim()}</span>
                    <span className="text-white/30">•</span>
                    <span>{dest.region.split('•')[0].trim()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
)
}
