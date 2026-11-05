import { useState } from 'react'
import type { MouseEvent, FC } from 'react'
import type { Dispatch, DispatchType, PriceIndexItem } from '../../types'
import { PriceSparkline } from '../common/PriceSparkline'
import {
  FileText,
  TrendingDown,
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  ThumbsUp,
  MapPin,
  Leaf
} from 'lucide-react'
import { DataLoadingSkeleton, DataEmptyState, DataErrorState } from '../common/StateViews'

interface CommunityDispatchesProps {
  dispatches: Dispatch[]
  priceIndices?: PriceIndexItem[]
  onSelectDispatch: (dispatch: Dispatch) => void
  onWriteDispatch: () => void
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export const CommunityDispatches: FC<CommunityDispatchesProps> = ({
  dispatches,
  priceIndices = [],
  onSelectDispatch,
  onWriteDispatch,
  isLoading = false,
  error = null,
  onRetry
}) => {
  const activePriceIndices = priceIndices
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [upvotes, setUpvotes] = useState<Record<string, number>>(
    dispatches.reduce((acc, d) => ({ ...acc, [d.id]: d.helpfulCount }), {})
  )

  const handleUpvote = (e: MouseEvent, id: string) => {
    e.stopPropagation()
    setUpvotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }))
  }

  const filterTabs = [
    { label: 'All Dispatches', value: 'all' },
    { label: 'Verified Price Reports', value: 'price_report' },
    { label: 'Tea Estate Journals', value: 'traveller_story' },
    { label: 'Indigenous Host Stories', value: 'host_story' },
    { label: 'Trail & Forest Advisory', value: 'trail_note' },
  ]

  const filtered =
    activeFilter === 'all'
      ? dispatches
      : dispatches.filter((d) => d.type === activeFilter)

  const getTypeBadge = (type: DispatchType) => {
    switch (type) {
      case 'price_report':
        return {
          label: 'Ground Price Index',
          color: 'bg-[#285A40]/15 text-[#123D2D] border-[#285A40]/30',
          icon: TrendingDown,
        }
      case 'traveller_story':
        return {
          label: 'Tea Estate Journal',
          color: 'bg-[#123D2D]/10 text-[#123D2D] border-[#123D2D]/20',
          icon: Compass,
        }
      case 'host_story':
        return {
          label: 'Indigenous Host Dispatch',
          color: 'bg-[#91A77B]/25 text-[#123D2D] border-[#91A77B]/40',
          icon: FileText,
        }
      case 'trail_note':
        return {
          label: 'Singalila Forest Note',
          color: 'bg-[#576159]/15 text-[#123D2D] border-[#576159]/25',
          icon: Leaf,
        }
    }
  }

  return (
    <section id="community" className="py-16 sm:py-20 bg-[#FAF7EE] border-t border-[#CBDAC4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Community Experiences */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#CBDAC4] gap-6">
          <div className="max-w-3xl">
            <span className="text-[#164E2D] text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Compass className="w-4 h-4 text-[#D96B27]" />
              <span>COMMUNITY EXPERIENCES & ARCHIVES</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A2316] uppercase leading-tight">
              COMMUNITY EXPERIENCES & FIELD STORIES
            </h2>
            <p className="text-stone-700 text-sm sm:text-base mt-2 font-light leading-relaxed">
              Real experiences, mountain journals, trail notes, and verified ground price reports posted directly by locals, workers, and travelers living across the Eastern Himalayas.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end shrink-0">
            <button
              onClick={onWriteDispatch}
              type="button"
              className="inline-flex items-center gap-2 bg-[#164E2D] hover:bg-[#0A2316] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition active:scale-95"
            >
              <span>+ Share Your Experience</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A5C896]" />
            </button>
          </div>
        </div>

        {/* Highly Scannable Ground Price & Transit Index Grid Blocks (11/10 Refinement) */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-[#285A40]/15">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#285A40]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-[#123D2D]">
                Ground Transit & Farmgate Price Stability Index
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#576159] uppercase tracking-wider">
              5-Month Verified Syndicate & Cooperative Benchmarks
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activePriceIndices.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white/60 border border-[#CBDAC4] rounded-sm text-xs font-mono text-[#576159]">
                Ground transit syndicate and cooperative benchmarks awaiting live verified reports.
              </div>
            ) : (
              activePriceIndices.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#CBDAC4] p-4 sm:p-5 rounded-sm hover:border-[#285A40] transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between space-y-3.5 card-hover-lift"
                >
                  <div>
                    {/* Category Badge + Month */}
                    <div className="flex items-center justify-between text-[9px] font-mono tracking-wider uppercase mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-sm font-semibold border ${
                          item.category === 'transit'
                            ? 'bg-[#123D2D]/10 text-[#123D2D] border-[#123D2D]/20'
                            : 'bg-[#91A77B]/20 text-[#123D2D] border-[#91A77B]/30'
                        }`}
                      >
                        {item.category === 'transit' ? 'Shared Transit' : 'Farmgate Co-op'}
                      </span>
                      <span className="text-[#576159]">{item.lastVerified}</span>
                    </div>

                    {/* Item Name */}
                    <h4 className="font-serif text-lg text-[#123D2D] font-normal leading-snug line-clamp-1">
                      {item.item}
                    </h4>

                    {/* Route or Origin */}
                    <p className="text-[11px] text-[#576159] font-mono mt-0.5 truncate">
                      {item.routeOrOrigin}
                    </p>

                    {/* Primary Rate & Secondary Comparison */}
                    <div className="mt-3 pt-2.5 border-t border-[#CBDAC4]/60 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="font-serif text-2xl font-bold text-[#123D2D] leading-none">
                          {item.primaryRate}
                        </span>
                        <span className="text-xs font-mono text-[#576159]">{item.rateUnit}</span>
                      </div>

                      {item.secondaryRate && (
                        <div className="text-right">
                          <span className="text-[9px] font-mono text-[#576159] block leading-none">
                            {item.secondaryLabel}
                          </span>
                          <span className="text-xs font-mono font-medium text-[#123D2D] mt-0.5 block">
                            {item.secondaryRate}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compact Pricing Stability Sparkline Chart */}
                  <div className="pt-2 border-t border-[#CBDAC4]/40">
                    <PriceSparkline
                      data={item.monthlyHistory}
                      stabilityScore={item.stabilityScore}
                    />
                  </div>

                  {/* Local Verification Stamp */}
                  <div className="text-[9px] font-mono text-[#576159] leading-tight pt-1 border-t border-[#CBDAC4]/30 flex items-center justify-between">
                    <span className="truncate">{item.verifiedBy}</span>
                    <span className="text-[#285A40] shrink-0 font-bold ml-1">✓ Verified</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center justify-between pb-6 border-b border-[#285A40]/15 mb-8 overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#285A40] hidden sm:block" />
            <div className="flex items-center gap-1.5">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  type="button"
                  className={`px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase rounded-sm transition-all whitespace-nowrap ${
                    activeFilter === tab.value
                      ? 'bg-[#123D2D] text-[#E8EFE3] font-semibold'
                      : 'text-[#123D2D]/70 hover:text-[#123D2D] hover:bg-white/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#285A40]">
            <span className="w-2 h-2 rounded-full bg-[#285A40]" />
            <span>Updated Daily by Mountain Stewards</span>
          </div>
        </div>

        {/* State Handling: Loading, Error, Empty, or Editorial Feed */}
        {isLoading ? (
          <DataLoadingSkeleton count={3} />
        ) : error ? (
          <DataErrorState message={error} onRetry={onRetry} />
        ) : filtered.length === 0 ? (
          <DataEmptyState
            title="No Community Dispatches Published"
            description="There are currently no field dispatches published in this ledger category. Local stewards, tea pluckers, and sabbatical travellers can submit the first verified field note."
            actionLabel="Submit Ground Dispatch"
            onAction={onWriteDispatch}
          />
        ) : (
          /* Curated Editorial Feed Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Lead Highlighted Story (5 cols) */}
          {filtered.length > 0 && (
            <div className="lg:col-span-5">
              <article
                onClick={() => onSelectDispatch(filtered[0])}
                className="group h-full bg-white border border-[#CBDAC4] p-6 sm:p-8 rounded-sm hover:border-[#285A40] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between card-hover-lift"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {(() => {
                      const badge = getTypeBadge(filtered[0].type)
                      const Icon = badge.icon
                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider font-semibold rounded-sm border ${badge.color}`}
                        >
                          <Icon className="w-3 h-3" />
                          {badge.label}
                        </span>
                      )
                    })()}

                    {filtered[0].verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#285A40] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#285A40]" />
                        <span>Verified Field Report</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-[#123D2D] font-normal leading-snug group-hover:text-[#285A40] transition-colors mb-3">
                    {filtered[0].title}
                  </h3>

                  <p className="text-sm text-[#576159] leading-relaxed font-light mb-6">
                    {filtered[0].excerpt}
                  </p>

                  {/* Benchmark Box if Price Data exists (With Compact 5-Month Stability Chart) */}
                  {filtered[0].priceData && (
                    <div className="bg-[#E8EFE3]/70 border border-[#285A40]/30 p-4 rounded-sm mb-6 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#285A40] font-bold">
                        <span>GROUND TRANSIT BENCHMARK ({filtered[0].priceData.lastUpdated})</span>
                        <span className="text-[#123D2D]">UNION REGULATED</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[#285A40]/15">
                        <div>
                          <div className="text-[11px] text-[#576159] font-mono">Shared Sumo Seat</div>
                          <div className="font-serif text-2xl font-bold text-[#123D2D]">
                            {filtered[0].priceData.sharedRate}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] text-[#576159] font-mono">Private Reserved Cab</div>
                          <div className="font-serif text-2xl font-bold text-[#123D2D]">
                            {filtered[0].priceData.privateRate}
                          </div>
                        </div>
                      </div>

                      {/* Compact 5-Month Pricing Stability Trend Chart */}
                      {filtered[0].priceData.history && (
                        <div className="pt-1">
                          <PriceSparkline
                            data={filtered[0].priceData.history}
                            stabilityScore={filtered[0].priceData.stabilityScore || 98.4}
                          />
                        </div>
                      )}

                      <p className="text-xs text-[#576159] font-mono pt-1">
                        {filtered[0].priceData.fairPriceNote}
                      </p>
                    </div>
                  )}
                </div>

                {/* Author Card Footer */}
                <div className="pt-6 border-t border-[#CBDAC4] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={filtered[0].author.avatar}
                      alt={filtered[0].author.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#285A40]/20"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#123D2D]">
                        {filtered[0].author.name}
                      </p>
                      <p className="text-[11px] text-[#576159] font-mono">
                        {filtered[0].author.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleUpvote(e, filtered[0].id)}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#123D2D] hover:bg-[#E8EFE3] rounded-sm transition-colors border border-[#CBDAC4]"
                      title="Mark as verified & helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-[#285A40]" />
                      <span className="font-mono font-medium">{upvotes[filtered[0].id] || filtered[0].helpfulCount}</span>
                    </button>
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* Right Column: Feed Stream Items (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {filtered.slice(1).map((disp) => {
              const badge = getTypeBadge(disp.type)
              const Icon = badge.icon
              return (
                <article
                  key={disp.id}
                  onClick={() => onSelectDispatch(disp)}
                  className="group bg-white border border-[#CBDAC4] p-5 sm:p-6 rounded-sm hover:border-[#285A40] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded-sm border ${badge.color}`}
                      >
                        <Icon className="w-3 h-3" />
                        {badge.label}
                      </span>
                      <span className="text-xs font-mono text-[#576159] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#285A40]" />
                        {disp.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-[#576159]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {disp.readTime}
                      </span>
                      <span>{disp.date}</span>
                    </div>
                  </div>

                  <h4 className="font-serif text-xl sm:text-2xl text-[#123D2D] font-normal leading-snug group-hover:text-[#285A40] transition-colors mb-2">
                    {disp.title}
                  </h4>

                  <p className="text-sm text-[#576159] leading-relaxed font-light line-clamp-2 mb-3.5">
                    {disp.excerpt}
                  </p>

                  {/* Price report summary block with compact trend chart */}
                  {disp.priceData && (
                    <div className="bg-[#E8EFE3]/70 p-3.5 rounded-sm border border-[#285A40]/25 text-xs font-mono text-[#123D2D] mb-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[#285A40] font-bold">{disp.priceData.item}:</span>
                        <span className="font-serif text-base font-bold text-[#123D2D]">{disp.priceData.sharedRate}</span>
                      </div>
                      {disp.priceData.history && (
                        <div className="pt-0.5">
                          <PriceSparkline
                            data={disp.priceData.history}
                            stabilityScore={disp.priceData.stabilityScore || 96}
                          />
                        </div>
                      )}
                      <p className="text-[10px] text-[#576159] leading-tight">
                        {disp.priceData.fairPriceNote}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3.5 border-t border-[#CBDAC4]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={disp.author.avatar}
                        alt={disp.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#285A40]/20"
                      />
                      <span className="text-xs font-medium text-[#123D2D]">
                        {disp.author.name}
                      </span>
                      {disp.author.communityBadge && (
                        <span className="hidden sm:inline text-[10px] font-mono text-[#285A40]">
                          • {disp.author.communityBadge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleUpvote(e, disp.id)}
                        type="button"
                        className="inline-flex items-center gap-1 text-xs text-[#576159] hover:text-[#123D2D] transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-[#285A40]" />
                        <span className="font-mono">{upvotes[disp.id] || disp.helpfulCount}</span>
                      </button>
                      <span className="text-xs font-semibold text-[#123D2D] group-hover:text-[#285A40] flex items-center gap-1 font-mono uppercase tracking-wider">
                        <span>Read Dispatch</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}
      </div>
    </section>
  )
}
