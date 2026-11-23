import type { FC } from 'react'
import {
  Compass,
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
    <section className="relative w-full pt-32 sm:pt-40 lg:pt-44 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-[#0B1528] text-white overflow-hidden border-b border-[#1E3A8A]/40">
      {/* High-Resolution Mountain Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/hero-darjeeling.jpg"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2200&q=90'
          }}
          alt="Emerald green tea terraces and cedar ridges in Darjeeling"
          className="w-full h-full object-cover object-center animate-hero-drift brightness-95 contrast-105 saturate-110"
          loading="eager"
        />

        {/* Alpine Glacial Tech midnight navy atmosphere gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(6, 14, 30, 0.88) 0%, 
                rgba(11, 27, 61, 0.72) 40%, 
                rgba(11, 27, 61, 0.88) 80%, 
                rgba(6, 14, 30, 0.98) 100%
              )
            `
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10 text-center flex flex-col items-center">
        {/* SaaS Platform Kicker Badge */}
        <div className="inline-flex items-center gap-2 bg-[#0F224A]/90 border border-[#38BDF8]/40 text-[#7DD3FC] text-[10px] sm:text-xs font-mono font-semibold px-3.5 py-1.5 rounded-full mb-3 sm:mb-5 mt-1 sm:mt-0 backdrop-blur-md shadow-lg shadow-blue-950/30 animate-float-slow">
          <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="hidden sm:inline">ALL-INDIA MOUNTAIN DIGITAL EXCHANGE • PAN-INDIA MOUNTAINS</span>
          <span className="sm:hidden">ALL-INDIA MOUNTAIN DIGITAL EXCHANGE</span>
        </div>

        {/* Main Motto Headline */}
        <h1 className="font-display text-2xl xs:text-3xl sm:text-5xl lg:text-7xl font-bold uppercase tracking-tight text-white max-w-4xl mx-auto leading-[1.08] drop-shadow-md break-words">
          COMMUNITY EXPERIENCES. <br />
          <span className="text-[#38BDF8]">MOUNTAIN JOBS. PROPERTIES FOR LEASE & SALE.</span>
        </h1>

        {/* Concise Platform Purpose */}
        <p className="mt-4 sm:mt-5 text-[#E2E8F0] text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
          A dedicated SaaS platform for all mountain regions of India: post and discover genuine mountain experiences, post vacancies and hire for mountain jobs, and list or acquire properties for lease or sale across Himachal, Uttarakhand, Ladakh, Kashmir, Sikkim, Northeast, Bengal Hills, and the Western Ghats.
        </p>

        {/* 3 Core Interactive SaaS Cards (Properties, Jobs, Community) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mt-7 sm:mt-10 w-full max-w-5xl text-left">
          {/* Pillar 1: Properties for Lease & Sale */}
          <div className="group bg-gradient-to-b from-white/[0.12] to-white/[0.04] hover:from-white/[0.18] hover:to-white/[0.08] backdrop-blur-xl border border-white/15 hover:border-[#38BDF8]/50 p-5 sm:p-6 rounded-3xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-950/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0F224A] to-[#1E3A8A] text-[#38BDF8] flex items-center justify-center border border-[#38BDF8]/30 shadow-inner">
                  <Home className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <span className="text-[11px] font-sans bg-[#1E3A8A]/80 backdrop-blur-md text-[#93C5FD] border border-[#38BDF8]/30 px-3 py-1 rounded-full font-medium shadow-xs">
                  {counts?.properties || 6} Available
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white uppercase group-hover:text-[#38BDF8] transition-colors tracking-tight">
                Properties (Lease & Sale)
              </h3>
              <p className="text-xs text-[#CBD5E1]/90 font-light mt-2 leading-relaxed">
                Post your stone cottage, wooden chalet, or mountain land across India for long-term lease or outright sale with complete address details.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-white/10 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2">
              <button
                onClick={() => onSelectTab('stays')}
                type="button"
                className="group/btn inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full text-xs font-sans font-medium text-[#CBD5E1] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
              >
                <span>Browse</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8] group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onOpenListProperty}
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-1.5 rounded-full text-xs font-sans font-semibold text-white bg-gradient-to-r from-[#2575fc] via-[#1d63d8] to-[#1e40af] hover:from-[#1d63d8] hover:to-[#2575fc] border border-sky-400/40 shadow-sm hover:shadow-md hover:shadow-blue-900/40 active:scale-95 transition-all duration-200"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#7DD3FC]" />
                <span>List Space</span>
              </button>
            </div>
          </div>

          {/* Pillar 2: Mountain Jobs (Hire & Work) */}
          <div className="group bg-gradient-to-b from-white/[0.12] to-white/[0.04] hover:from-white/[0.18] hover:to-white/[0.08] backdrop-blur-xl border border-white/15 hover:border-[#38BDF8]/50 p-5 sm:p-6 rounded-3xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-950/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0F224A] to-[#1E3A8A] text-[#38BDF8] flex items-center justify-center border border-[#38BDF8]/30 shadow-inner">
                  <Briefcase className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <span className="text-[11px] font-sans bg-[#1E3A8A]/80 backdrop-blur-md text-[#93C5FD] border border-[#38BDF8]/30 px-3 py-1 rounded-full font-medium shadow-xs">
                  {counts?.jobs || 4} Openings
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white uppercase group-hover:text-[#38BDF8] transition-colors tracking-tight">
                Mountain Jobs & Hiring
              </h3>
              <p className="text-xs text-[#CBD5E1]/90 font-light mt-2 leading-relaxed">
                Anyone can post vacancies to hire local talent or applicants. Apply for dignified mountain jobs and paid residencies.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-white/10 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2">
              <button
                onClick={() => onSelectTab('jobs')}
                type="button"
                className="group/btn inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full text-xs font-sans font-medium text-[#CBD5E1] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
              >
                <span>View Jobs</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8] group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onOpenPostJob}
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-1.5 rounded-full text-xs font-sans font-semibold text-white bg-gradient-to-r from-[#2575fc] via-[#1d63d8] to-[#1e40af] hover:from-[#1d63d8] hover:to-[#2575fc] border border-sky-400/40 shadow-sm hover:shadow-md hover:shadow-blue-900/40 active:scale-95 transition-all duration-200"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#7DD3FC]" />
                <span>Post Job</span>
              </button>
            </div>
          </div>

          {/* Pillar 3: Community Section (Experiences & Stories) */}
          <div className="group bg-gradient-to-b from-white/[0.12] to-white/[0.04] hover:from-white/[0.18] hover:to-white/[0.08] backdrop-blur-xl border border-white/15 hover:border-[#38BDF8]/50 p-5 sm:p-6 rounded-3xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-950/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0F224A] to-[#1E3A8A] text-[#38BDF8] flex items-center justify-center border border-[#38BDF8]/30 shadow-inner">
                  <MessageSquare className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <span className="text-[11px] font-sans bg-[#1E3A8A]/80 backdrop-blur-md text-[#93C5FD] border border-[#38BDF8]/30 px-3 py-1 rounded-full font-medium shadow-xs">
                  {counts?.dispatches || 6} Stories
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white uppercase group-hover:text-[#38BDF8] transition-colors tracking-tight">
                Community Experiences
              </h3>
              <p className="text-xs text-[#CBD5E1]/90 font-light mt-2 leading-relaxed">
                Post your field notes, mountain adventures, trail logs, and transparent transport price reports for fellow travelers.
              </p>
            </div>

            <div className="mt-5 pt-3.5 border-t border-white/10 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2">
              <button
                onClick={() => onSelectTab('community')}
                type="button"
                className="group/btn inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full text-xs font-sans font-medium text-[#CBD5E1] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
              >
                <span>Stories</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8] group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onOpenCreateDispatch}
                type="button"
                className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-1.5 rounded-full text-xs font-sans font-semibold text-white bg-gradient-to-r from-[#2575fc] via-[#1d63d8] to-[#1e40af] hover:from-[#1d63d8] hover:to-[#2575fc] border border-sky-400/40 shadow-sm hover:shadow-md hover:shadow-blue-900/40 active:scale-95 transition-all duration-200"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#7DD3FC]" />
                <span>Share Story</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
