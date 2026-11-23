import type { FC } from 'react'
import {
  Home,
  Briefcase,
  MessageSquare,
  ArrowRight,
  PlusCircle
} from 'lucide-react'
import type { SaaSModuleTab } from './SaaSModuleNavigator'

interface HeroProps {
  onSelectTab: (tab: SaaSModuleTab) => void
  onOpenCreateDispatch: () => void
  onOpenPostJob: () => void
  onOpenListProperty: () => void
  counts?: {
    properties?: number
    jobs?: number
    dispatches?: number
  }
}

export const Hero: FC<HeroProps> = ({
  onSelectTab,
  onOpenCreateDispatch,
  onOpenPostJob,
  onOpenListProperty,
  counts
}) => {
  return (
    <section className="relative w-full pt-32 sm:pt-40 lg:pt-44 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-[#0B1528] text-white overflow-hidden border-b border-[#1E3A8A]/40">
      {/* High-Resolution Mountain Atmosphere (Rock-solid, zero jank) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/hero-darjeeling.jpg"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2200&q=90'
          }}
          alt="Emerald green tea terraces and cedar ridges in Darjeeling"
          className="w-full h-full object-cover object-center brightness-90 contrast-105"
          loading="eager"
        />

        {/* Linear/Forgebs Dark Gradient Depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 90% 60% at 50% 0%, rgba(37, 117, 252, 0.18) 0%, rgba(11, 27, 61, 0.88) 55%, rgba(6, 14, 30, 0.98) 100%)
            `
          }}
        />

        {/* Subtle geometric dot grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10 text-center flex flex-col items-center">
        {/* Tier-1 Tech Announcement Pill */}
        <div className="inline-flex items-center gap-2 bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 text-[#7DD3FC] text-[11px] sm:text-xs font-medium px-4 py-1.5 rounded-full mb-5 sm:mb-7 backdrop-blur-xl shadow-xs transition-colors cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span className="text-white/95 tracking-tight font-medium">Pan-India Mountain Digital Exchange</span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-[#7DD3FC] hidden sm:inline tracking-tight">Himachal, Ladakh, Uttarakhand, Kashmir & Nilgiris</span>
        </div>

        {/* Confident, Modern Headline (Linear / Apple / Forgebs style) */}
        <h1 className="font-display text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-white max-w-4xl mx-auto leading-[1.12] drop-shadow-sm">
          Community Experiences. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7DD3FC] via-[#38BDF8] to-[#2575fc]">
            Mountain Jobs. Properties for Lease & Sale.
          </span>
        </h1>

        {/* Concise Platform Purpose */}
        <p className="mt-4 sm:mt-6 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          The unified digital exchange for the Indian mountains: discover genuine local dispatches, hire or apply for verified valley jobs with accommodation, and browse residential spaces for long-term lease or sale.
        </p>

        {/* 3 Core Interactive SaaS Cards (Properties, Jobs, Community) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-8 sm:mt-12 w-full max-w-5xl text-left">
          {/* Pillar 1: Properties for Lease & Sale */}
          <div className="group bg-gradient-to-b from-white/[0.10] to-white/[0.03] hover:from-white/[0.14] hover:to-white/[0.05] backdrop-blur-xl border border-white/15 hover:border-sky-400/40 p-5 sm:p-6 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:shadow-blue-950/40 flex flex-col justify-between card-hover-lift">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F224A] to-[#1E3A8A] text-[#38BDF8] flex items-center justify-center border border-[#38BDF8]/30 shadow-inner">
                  <Home className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <span className="text-[11px] font-sans bg-white/10 backdrop-blur-md text-sky-200 border border-white/15 px-3 py-0.5 rounded-full font-medium">
                  {counts?.properties || 6} Available
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-[#38BDF8] transition-colors">
                Properties (Lease & Sale)
              </h3>
              <p className="text-xs text-slate-300/90 font-normal mt-2 leading-relaxed">
                Post your stone cottage, wooden chalet, or mountain land across India for long-term lease or outright sale with verified details.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2.5">
              <button
                onClick={() => onSelectTab('stays')}
                type="button"
                className="btn-glass px-3.5 py-2 w-full sm:w-auto"
              >
                <span>Browse</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
              </button>
              <button
                onClick={onOpenListProperty}
                type="button"
                className="btn-primary px-4 py-2 w-full sm:w-auto"
              >
                <PlusCircle className="w-3.5 h-3.5 text-sky-200" />
                <span>List Space</span>
              </button>
            </div>
          </div>

          {/* Pillar 2: Mountain Jobs (Hire & Work) */}
          <div className="group bg-gradient-to-b from-white/[0.10] to-white/[0.03] hover:from-white/[0.14] hover:to-white/[0.05] backdrop-blur-xl border border-white/15 hover:border-sky-400/40 p-5 sm:p-6 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:shadow-blue-950/40 flex flex-col justify-between card-hover-lift">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F224A] to-[#1E3A8A] text-[#38BDF8] flex items-center justify-center border border-[#38BDF8]/30 shadow-inner">
                  <Briefcase className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <span className="text-[11px] font-sans bg-white/10 backdrop-blur-md text-sky-200 border border-white/15 px-3 py-0.5 rounded-full font-medium">
                  {counts?.jobs || 4} Openings
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-[#38BDF8] transition-colors">
                Mountain Jobs & Hiring
              </h3>
              <p className="text-xs text-slate-300/90 font-normal mt-2 leading-relaxed">
                Post vacancies to hire local talent or applicants. Apply for dignified mountain positions and paid fellowships with lodging.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2.5">
              <button
                onClick={() => onSelectTab('jobs')}
                type="button"
                className="btn-glass px-3.5 py-2 w-full sm:w-auto"
              >
                <span>View Jobs</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
              </button>
              <button
                onClick={onOpenPostJob}
                type="button"
                className="btn-primary px-4 py-2 w-full sm:w-auto"
              >
                <PlusCircle className="w-3.5 h-3.5 text-sky-200" />
                <span>Post Job</span>
              </button>
            </div>
          </div>

          {/* Pillar 3: Community Section (Experiences & Stories) */}
          <div className="group bg-gradient-to-b from-white/[0.10] to-white/[0.03] hover:from-white/[0.14] hover:to-white/[0.05] backdrop-blur-xl border border-white/15 hover:border-sky-400/40 p-5 sm:p-6 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:shadow-blue-950/40 flex flex-col justify-between card-hover-lift">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F224A] to-[#1E3A8A] text-[#38BDF8] flex items-center justify-center border border-[#38BDF8]/30 shadow-inner">
                  <MessageSquare className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <span className="text-[11px] font-sans bg-white/10 backdrop-blur-md text-sky-200 border border-white/15 px-3 py-0.5 rounded-full font-medium">
                  {counts?.dispatches || 6} Stories
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-[#38BDF8] transition-colors">
                Community Experiences
              </h3>
              <p className="text-xs text-slate-300/90 font-normal mt-2 leading-relaxed">
                Post field notes, trail conditions, ground transportation price benchmarks, and genuine experiences for fellow travellers.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2.5">
              <button
                onClick={() => onSelectTab('community')}
                type="button"
                className="btn-glass px-3.5 py-2 w-full sm:w-auto"
              >
                <span>Stories</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
              </button>
              <button
                onClick={onOpenCreateDispatch}
                type="button"
                className="btn-primary px-4 py-2 w-full sm:w-auto"
              >
                <PlusCircle className="w-3.5 h-3.5 text-sky-200" />
                <span>Share Story</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
