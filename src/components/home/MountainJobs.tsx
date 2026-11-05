import { useState } from 'react'
import type { FC } from 'react'
import type { Job } from '../../types'
import {
  Briefcase,
  MapPin,
  ArrowRight,
  Filter,
  Building2,
  PlusCircle,
  ShieldCheck
} from 'lucide-react'
import { DataLoadingSkeleton, DataEmptyState, DataErrorState } from '../common/StateViews'

interface MountainJobsProps {
  jobs: Job[]
  onSelectJob: (job: Job) => void
  onPostJobClick: () => void
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export const MountainJobs: FC<MountainJobsProps> = ({
  jobs,
  onSelectJob,
  onPostJobClick,
  isLoading = false,
  error = null,
  onRetry
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  const categories = [
    { label: 'All Openings', value: 'all' },
    { label: 'Hospitality & Estates', value: 'Hospitality & Estates' },
    { label: 'Guiding & Conservation', value: 'Guiding & Conservation' },
    { label: 'Agriculture & Craft', value: 'Agriculture & Craft' },
    { label: 'Digital & Remote', value: 'Digital & Remote' },
  ]

  const regions = [
    { id: 'all', label: 'All Mountains' },
    { id: 'Himachal', label: 'Himachal Pradesh' },
    { id: 'Uttarakhand', label: 'Uttarakhand' },
    { id: 'Ladakh', label: 'Ladakh & Kashmir' },
    { id: 'Sikkim', label: 'Sikkim & Northeast' },
    { id: 'Bengal', label: 'Bengal Hills' },
    { id: 'Nilgiris', label: 'Nilgiris & Western Ghats' }
  ]

  const filteredJobs = jobs.filter((j) => {
    const matchesCategory = activeCategory === 'all' || j.category === activeCategory
    const matchesRegion =
      selectedRegion === 'all'
        ? true
        : j.region.toLowerCase().includes(selectedRegion.toLowerCase()) ||
          j.location.toLowerCase().includes(selectedRegion.toLowerCase())
    return matchesCategory && matchesRegion
  })

  return (
    <section id="jobs" className="py-16 sm:py-20 bg-[#FAF7EE] border-t border-[#CBDAC4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Jobs Exchange */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#CBDAC4] gap-6">
          <div className="max-w-3xl">
            <span className="text-[#164E2D] text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Briefcase className="w-4 h-4 text-[#D96B27]" />
              <span>EMPLOYMENT EXCHANGE • HIRE & WORK</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A2316] uppercase leading-tight">
              MOUNTAIN JOBS & RECRUITMENT
            </h2>
            <p className="text-stone-700 text-sm sm:text-base mt-2 font-light leading-relaxed">
              Anyone can post jobs to hire mountain talent, and anyone can browse and apply to join positions across all Indian mountain ranges—Himachal Pradesh, Uttarakhand, Ladakh, Kashmir, Sikkim, Bengal Hills, and the Western Ghats.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end shrink-0">
            <button
              onClick={onPostJobClick}
              type="button"
              className="inline-flex items-center gap-2 bg-[#164E2D] hover:bg-[#0A2316] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[#A5C896]" />
              <span>Post a Mountain Job</span>
            </button>
          </div>
        </div>

        {/* Region & Category Dual Filter Bar */}
        <div className="space-y-3 pb-6 mb-8 border-b border-[#CBDAC4]/70">
          {/* Pan-India Region Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#164E2D] font-bold shrink-0 mr-1">
              Region:
            </span>
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                type="button"
                className={`px-3 py-1 text-xs font-mono rounded-full transition-all whitespace-nowrap ${
                  selectedRegion === reg.id
                    ? 'bg-[#164E2D] text-white font-bold shadow-xs'
                    : 'bg-white/90 border border-[#CBDAC4] text-stone-600 hover:bg-[#E8EFE3] hover:text-[#0A2316]'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Role Category Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <Filter className="w-3.5 h-3.5 text-[#164E2D] mr-1 flex-shrink-0 hidden sm:inline" />
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  type="button"
                  className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all whitespace-nowrap ${
                    activeCategory === cat.value
                      ? 'bg-[#0B2516] text-white font-bold shadow-xs'
                      : 'bg-white border border-[#CBDAC4] text-stone-600 hover:bg-[#E8EFE3] hover:text-[#0A2316]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#164E2D]">
              <ShieldCheck className="w-4 h-4 text-[#164E2D]" />
              <span>Verified Dignified Wages • Lodging & Food Included</span>
            </div>
          </div>
        </div>

        {/* State Handling */}
        {isLoading ? (
          <DataLoadingSkeleton variant="rows" count={4} />
        ) : error ? (
          <DataErrorState message={error} onRetry={onRetry} />
        ) : filteredJobs.length === 0 ? (
          <DataEmptyState
            title="No Active Mountain Jobs in this Category"
            description="There are currently no open positions listed here. Mountain employers, tea estates, and local businesses can post vacancies now."
            actionLabel="Post a Job Opening"
            onAction={onPostJobClick}
          />
        ) : (
          /* Jobs List Cards */
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="group bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 card-hover-lift"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectJob(job)
                  }
                }}
                aria-label={`View role details for ${job.title} at ${job.employer}`}
              >
                {/* Role Details */}
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#164E2D] font-mono">
                      <Building2 className="w-3.5 h-3.5" />
                      {job.employer}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="inline-flex items-center gap-1 text-xs text-stone-500 font-mono">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      {job.location}
                    </span>
                    <span className="text-stone-300 hidden sm:inline">•</span>
                    <span className="bg-[#FAF7EE] text-[#0A2316] text-[10px] font-mono px-2 py-0.5 rounded border border-[#CBDAC4]">
                      {job.category}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-950 uppercase tracking-tight group-hover:text-[#164E2D] transition-colors leading-snug">
                    {job.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 font-light mt-1.5 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-mono text-stone-600">
                    <span className="bg-stone-50 border border-stone-200 px-2 py-0.5 rounded">
                      {job.type}
                    </span>
                    <span className="bg-stone-50 border border-stone-200 px-2 py-0.5 rounded">
                      Lodging: {job.housingIncluded ? 'Included' : 'Not Included'}
                    </span>
                  </div>
                </div>

                {/* Right Action: Compensation & Apply CTA */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="font-display text-xl sm:text-2xl font-bold text-[#0A2316]">
                      {job.salary}
                    </div>
                    <div className="text-[10px] font-mono text-[#164E2D] font-semibold">
                      Verified Living Wage
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectJob(job)
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#164E2D] hover:bg-[#0A2316] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl shadow transition transform active:scale-95"
                  >
                    <span>Apply / Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
