import { useState } from 'react'
import type { FC } from 'react'
import type { Job } from '../../types'
import {
  Briefcase,
  MapPin,
  Home,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Building2,
  Clock,
  Leaf
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

  const categories = [
    { label: 'All Openings', value: 'all' },
    { label: 'Hospitality & Estates', value: 'Hospitality & Estates' },
    { label: 'Guiding & Conservation', value: 'Guiding & Conservation' },
    { label: 'Agriculture & Craft', value: 'Agriculture & Craft' },
    { label: 'Digital & Remote', value: 'Digital & Remote' },
  ]

  const filteredJobs =
    activeCategory === 'all'
      ? jobs
      : jobs.filter((j) => j.category === activeCategory)

  return (
    <section id="jobs" className="py-20 lg:py-28 bg-[#F8F6F0] border-t border-[#CBDAC4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#123D2D]/15 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-[#285A40]" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-mono font-semibold text-[#285A40]">
                LABOR & VOCATION • 03
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#123D2D] font-normal tracking-tight">
              Opportunity lives in the mountains.
            </h2>
            <p className="mt-4 text-base text-[#576159] leading-relaxed font-light">
              Ethical employment, mountain residencies, and leadership roles with vetted organic tea sanctuaries, wilderness conservation trusts, and community cooperatives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onPostJobClick}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border border-[#285A40] text-[#123D2D] hover:bg-[#285A40] hover:text-[#E8EFE3] text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors"
            >
              <span>Post an Opportunity</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Category Filters & Marketplace Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#123D2D]/10 mb-8 gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-[#285A40] hidden sm:block mr-1 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                type="button"
                className={`px-3.5 py-1.5 text-xs font-mono tracking-wider uppercase rounded-sm transition-all whitespace-nowrap ${
                  activeCategory === cat.value
                    ? 'bg-[#123D2D] text-[#E8EFE3] font-semibold'
                    : 'text-[#123D2D]/70 hover:text-[#123D2D] hover:bg-[#E8EFE3]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#285A40]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#285A40]" />
            <span>All Listings Include On-Site Accommodation & Food</span>
          </div>
        </div>

        {/* State Handling: Loading, Error, Empty, or Table */}
        {isLoading ? (
          <DataLoadingSkeleton variant="rows" count={4} />
        ) : error ? (
          <DataErrorState message={error} onRetry={onRetry} />
        ) : filteredJobs.length === 0 ? (
          <DataEmptyState
            title="No Active Mountain Jobs or Residencies"
            description="There are currently no open positions listed in this category. Mountain employers, tea estates, and ecological non-profits can post verified opportunities."
            actionLabel="Post an Opportunity"
            onAction={onPostJobClick}
          />
        ) : (
          /* Functional Recruitment Marketplace Table Rows */
          <div className="border border-[#CBDAC4] rounded-sm bg-white divide-y divide-[#CBDAC4] shadow-sm overflow-hidden">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="group p-5 sm:p-7 hover:bg-[#E8EFE3]/40 transition-colors cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6"
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
              {/* Left Column: Role Details & Employer Meta */}
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#123D2D] group-hover:text-[#285A40] transition-colors">
                    <Building2 className="w-3.5 h-3.5 text-[#285A40]" />
                    <span>{job.employer}</span>
                  </div>

                  {job.employerBadge && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[#285A40] bg-[#E8EFE3] px-2.5 py-0.5 rounded-sm border border-[#CBDAC4]">
                      <CheckCircle2 className="w-3 h-3 text-[#285A40]" />
                      {job.employerBadge}
                    </span>
                  )}

                  <span className="text-[10px] font-mono text-[#576159] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Posted {job.postedDate}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-[#123D2D] font-normal leading-snug group-hover:text-[#285A40] transition-colors">
                  {job.title}
                </h3>

                <p className="text-sm text-[#576159] mt-2 line-clamp-2 font-light leading-relaxed">
                  {job.description}
                </p>

                {/* Green Badges Bar */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {/* Distinct Green Location Tag */}
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-sm bg-[#E8EFE3] text-[#123D2D] border border-[#CBDAC4] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#285A40]" />
                    {job.location}
                  </span>

                  <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-sm bg-[#F8F6F0] text-[#576159] border border-[#CBDAC4]">
                    <Briefcase className="w-3 h-3 text-[#285A40]" />
                    {job.type}
                  </span>

                  {job.housingIncluded && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-sm bg-[#285A40]/15 text-[#123D2D] font-medium border border-[#285A40]/30">
                      <Home className="w-3 h-3 text-[#285A40]" />
                      Stone Cottage & Organic Meals Included
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Living Wage Schedule & Apply Action */}
              <div className="flex flex-row lg:flex-col lg:items-end justify-between items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#CBDAC4] flex-shrink-0">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#576159] block">
                    Living Wage Schedule
                  </span>
                  <span className="font-serif text-xl sm:text-2xl font-medium text-[#123D2D]">
                    {job.salary}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#123D2D] text-[#E8EFE3] group-hover:bg-[#285A40] text-xs uppercase tracking-wider font-semibold rounded-sm transition-all duration-200 shadow-sm border border-[#285A40]">
                  <span>View Role & Apply</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#91A77B]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

        {/* Mountain Labor Protocol */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#E8EFE3] border border-[#CBDAC4] rounded-sm text-xs text-[#123D2D] font-mono">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#285A40]" />
            <span>Fair Himalayan Wage Pledge: Living compensation, on-site forest housing, seasonal tea rest cycles, and local priority.</span>
          </div>
          <span className="text-[#285A40] font-bold hover:underline cursor-pointer">
            Read Mountain Labor Protocol →
          </span>
        </div>
      </div>
    </section>
  )
}
