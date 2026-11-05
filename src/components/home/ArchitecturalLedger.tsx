import { useState } from 'react'
import type { FC } from 'react'
import {
  Compass,
  ArrowRight,
  Flame,
  Mountain,
  Layers,
  ShieldCheck,
  Droplets,
  BookOpen
} from 'lucide-react'
import type { ArchitecturalSpecimen } from '../../types'
import { DataLoadingSkeleton, DataEmptyState, DataErrorState } from '../common/StateViews'

interface ArchitecturalLedgerProps {
  specimens: ArchitecturalSpecimen[]
  onSelectSpecimen: (specimen: ArchitecturalSpecimen) => void
  onExploreStays: () => void
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export const ArchitecturalLedger: FC<ArchitecturalLedgerProps> = ({
  specimens,
  onSelectSpecimen,
  onExploreStays,
  isLoading = false,
  error = null,
  onRetry
}) => {
  const hasSpecimens = specimens && specimens.length > 0
  const [activeSpecimenId, setActiveSpecimenId] = useState<string>(
    specimens[0]?.id || 'specimen-bukhari-hearth'
  )

  const activeSpecimen = hasSpecimens
    ? specimens.find((s) => s.id === activeSpecimenId) || specimens[0]
    : null

  return (
    <section
      id="architecture"
      className="relative w-full py-24 sm:py-32 bg-gradient-to-b from-[#0F3520] via-[#0B2A18] to-[#0A2214] text-[#F8F6F0] overflow-hidden border-t border-b border-[#285A40]/60"
    >
      {/* Fine architectural blueprint grid background watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #F8F6F0 1px, transparent 1px),
            linear-gradient(to bottom, #F8F6F0 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        {/* Section Header: Museum Folio */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.24em] text-[#8FA777] mb-4">
              <Compass className="w-3.5 h-3.5 text-[#8FA777]" />
              <span>DIGITAL MUSEUM & VERNACULAR ARCHIVES</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.05] tracking-tight">
              Himalayan Architectural & Material Ledger
            </h2>

            <p className="mt-4 text-base sm:text-lg text-[#E7EFE3]/80 font-light font-sans max-w-2xl leading-relaxed">
              Every homestay sanctuary in our collective is an indigenous engineering marvel. Explore how mountain hosts hand-hew reclaimed cedar timber, engineer 14-hour radiant river-stone hearths, and protect fragile Himalayan watersheds through zero-runoff permaculture.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-mono text-[#E7EFE3]/70">
            <div className="flex items-center gap-2 border border-white/15 px-3.5 py-2 bg-white/5">
              <BookOpen className="w-3.5 h-3.5 text-[#8FA777]" />
              <span>
                {hasSpecimens
                  ? `${specimens.length} ARCHIVAL ${specimens.length === 1 ? 'MONOGRAPH' : 'MONOGRAPHS'}`
                  : 'VERNACULAR ARCHIVE'}
              </span>
            </div>
            <button
              onClick={onExploreStays}
              type="button"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#8FA777] hover:text-white transition-colors py-2 group"
            >
              <span>Explore Listed Sanctuaries</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8FA777] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* State Handling: Loading, Error, Empty, or Specimen Exhibition */}
        {isLoading ? (
          <div className="my-10">
            <DataLoadingSkeleton variant="specimen" />
          </div>
        ) : error ? (
          <div className="my-10">
            <DataErrorState message={error} onRetry={onRetry} isDark={true} />
          </div>
        ) : !hasSpecimens || !activeSpecimen ? (
          <div className="my-10">
            <DataEmptyState
              isDark={true}
              title="No Architectural Specimens Cataloged"
              description="The indigenous architectural ledger is being documented. Archival building monographs will appear here as entries are verified in the database."
              actionLabel="Explore Available Leases"
              onAction={onExploreStays}
            />
          </div>
        ) : (
          <>
            {/* Interactive Specimen Selector Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 my-8 sm:my-10">
          {specimens.map((specimen) => {
            const isSelected = specimen.id === activeSpecimenId
            return (
              <button
                key={specimen.id}
                onClick={() => setActiveSpecimenId(specimen.id)}
                type="button"
                className={`text-left p-3.5 sm:p-4 border transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-[#0B2516] border-[#8FA777] shadow-lg'
                    : 'bg-[#06180E]/60 border-white/10 hover:border-white/25 hover:bg-[#0B2516]/40'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.2em] uppercase mb-1">
                  <span className={isSelected ? 'text-[#8FA777] font-semibold' : 'text-[#E7EFE3]/50'}>
                    {specimen.code}
                  </span>
                  <span className="text-white/40">{specimen.elevationRange.split('–')[0]}</span>
                </div>
                <div className="font-serif text-sm sm:text-base text-white font-normal line-clamp-1">
                  {specimen.title.split('&')[0]}
                </div>
                <div className="text-[10px] text-[#E7EFE3]/60 truncate mt-0.5 font-sans">
                  {specimen.archetype}
                </div>

                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8FA777]" />
                )}
              </button>
            )
          })}
        </div>

        {/* Active Specimen Showcase: Dual-Column Exhibition Grid */}
        {activeSpecimen && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-[#0E321E] border border-[#2D6643] p-6 sm:p-10 shadow-2xl relative">
            {/* Left Column: Visual Photograph & Metric Badges */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/15 bg-[#06180E] group">
                <img
                  src={activeSpecimen.image}
                  alt={activeSpecimen.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06180E] via-transparent to-transparent opacity-80" />

                {/* Overlaid Catalog Badge */}
                <div className="absolute top-4 left-4 bg-[#06180E]/90 backdrop-blur-md px-3 py-1.5 border border-white/15 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8FA777]">
                  ARCHIVE CATALOG // {activeSpecimen.code}
                </div>

                {/* Overlaid Bottom Metric Bar */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-[#F8F6F0] bg-[#06180E]/85 backdrop-blur-md px-3.5 py-2.5 border border-white/10">
                  <span className="text-[#8FA777] font-medium">{activeSpecimen.archetype}</span>
                  <span>ELEV: {activeSpecimen.elevationRange}</span>
                </div>
              </div>

              {/* 3 Metric Insight Blocks */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                <div className="p-3 bg-[#06180E]/70 border border-white/10">
                  <Flame className="w-3.5 h-3.5 text-[#8FA777] mx-auto mb-1" />
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[#E7EFE3]/60">Thermal</div>
                  <div className="font-serif text-xs sm:text-sm text-white font-normal mt-0.5 truncate">
                    {activeSpecimen.thermalRating.split(' ')[0]} {activeSpecimen.thermalRating.split(' ')[1]}
                  </div>
                </div>

                <div className="p-3 bg-[#06180E]/70 border border-white/10">
                  <Mountain className="w-3.5 h-3.5 text-[#8FA777] mx-auto mb-1" />
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[#E7EFE3]/60">Seismic</div>
                  <div className="font-serif text-xs sm:text-sm text-white font-normal mt-0.5 truncate">
                    {activeSpecimen.seismicIndex.split(' ')[0]} {activeSpecimen.seismicIndex.split(' ')[1]}
                  </div>
                </div>

                <div className="p-3 bg-[#06180E]/70 border border-white/10">
                  <Droplets className="w-3.5 h-3.5 text-[#8FA777] mx-auto mb-1" />
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[#E7EFE3]/60">Ecology</div>
                  <div className="font-serif text-xs sm:text-sm text-white font-normal mt-0.5 truncate">
                    100% Bio-Loop
                  </div>
                </div>
              </div>

              {/* Action: Open Full Blueprint Monograph */}
              <button
                onClick={() => onSelectSpecimen(activeSpecimen)}
                type="button"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white/5 hover:bg-white/15 text-[#FDFBF7] text-xs font-mono uppercase tracking-[0.2em] border border-white/20 transition-all duration-200 hover:border-white/40"
              >
                <Layers className="w-3.5 h-3.5 text-[#8FA777]" />
                <span>Inspect Technical Blueprint & Craft Monograph</span>
              </button>
            </div>

            {/* Right Column: Architectural Engineering Narrative & Materials */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.24em] text-[#8FA777] uppercase mb-2">
                  <span>SPECIMEN {activeSpecimen.code}</span>
                  <span className="text-white/30">•</span>
                  <span>{activeSpecimen.craftLineage}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-snug">
                  {activeSpecimen.title}
                </h3>

                <p className="font-serif italic text-base sm:text-lg text-[#B2C89E] mt-1 font-light">
                  {activeSpecimen.subtitle}
                </p>

                <p className="mt-4 text-sm sm:text-base text-[#E7EFE3]/90 font-light leading-relaxed font-sans">
                  {activeSpecimen.overview}
                </p>
              </div>

              {/* Material Composition Breakdown */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs font-mono text-[#8FA777] uppercase tracking-wider">
                  <span>Material Composition & Sourcing</span>
                  <span className="text-[10px] text-[#E7EFE3]/50">100% LOCAL</span>
                </div>

                <div className="space-y-2.5">
                  {activeSpecimen.materials.map((mat) => (
                    <div key={mat.name} className="p-2.5 bg-[#06180E]/50 border border-white/10 text-xs font-sans">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white">{mat.name}</span>
                        <span className="font-mono text-[#8FA777] text-[11px]">{mat.percentage}%</span>
                      </div>
                      <div className="text-[11px] text-[#E7EFE3]/70 leading-snug">
                        {mat.source} — <span className="text-[#B2C89E] italic">{mat.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Craftsman Testimony */}
              <div className="p-4 bg-[#06180E]/80 border-l-2 border-[#8FA777] text-xs font-sans space-y-1.5">
                <p className="font-serif italic text-sm sm:text-base text-[#F8F6F0]">
                  "{activeSpecimen.quote.text}"
                </p>
                <div className="text-[10px] font-mono text-[#8FA777]">
                  {activeSpecimen.quote.author} — {activeSpecimen.quote.craftTitle} ({activeSpecimen.quote.location})
                </div>
              </div>

              {/* Ecological Guarantee Pill */}
              <div className="flex items-center gap-2.5 text-[11px] font-sans text-[#E7EFE3]/80 pt-2 border-t border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#8FA777] shrink-0" />
                <span>
                  <strong className="text-white font-medium">Ecological Stewardship: </strong>
                  {activeSpecimen.ecologicalProtection}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Strip: The 3 Companion Specimens */}
        <div className="mt-12 sm:mt-16">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
            <span className="text-xs font-mono uppercase tracking-[0.22em] text-[#8FA777]">
              Companion Architectural Monograph Archives
            </span>
            <span className="text-[11px] font-mono text-[#E7EFE3]/60">
              CLICK ANY ARCHIVE TO INSPECT BLUEPRINTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specimens
              .filter((s) => s.id !== activeSpecimenId)
              .map((specimen) => (
                <div
                  key={specimen.id}
                  onClick={() => onSelectSpecimen(specimen)}
                  className="group bg-[#0B2516] border border-[#1F4E34]/60 p-5 hover:border-[#8FA777] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[16/10] overflow-hidden border border-white/10">
                      <img
                        src={specimen.image}
                        alt={specimen.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 bg-[#06180E]/90 px-2 py-0.5 text-[9px] font-mono text-[#8FA777] uppercase tracking-wider">
                        {specimen.code}
                      </div>
                    </div>

                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#8FA777]">
                      {specimen.archetype}
                    </div>

                    <h4 className="font-serif text-lg text-white font-normal group-hover:text-[#FDFBF7] leading-snug">
                      {specimen.title}
                    </h4>

                    <p className="text-xs text-[#E7EFE3]/75 font-light line-clamp-2 leading-relaxed">
                      {specimen.overview}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#8FA777]">
                    <span>INSPECT ARCHIVE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  </section>
)
}
