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
    <section className="relative w-full pt-36 sm:pt-40 lg:pt-44 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 bg-[#071F13] text-white overflow-hidden border-b border-[#143D24]">
      {/* High-Resolution Mountain & Emerald Tea Garden Atmosphere */}
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

        {/* Luminous emerald atmosphere gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(5, 23, 13, 0.90) 0%, 
                rgba(7, 28, 16, 0.74) 40%, 
                rgba(7, 28, 16, 0.92) 80%, 
                rgba(4, 18, 10, 0.99) 100%
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
        <div className="inline-flex items-center gap-2 bg-[#092617]/90 border border-[#2D6B48]/80 text-[#C6E8A3] text-[10px] sm:text-xs font-mono font-semibold px-3.5 py-1.5 rounded-full mb-3 sm:mb-5 mt-1 sm:mt-0 backdrop-blur-md shadow-lg animate-float-slow">
          <Compass className="w-3.5 h-3.5 text-[#34D399]" />
          <span>ALL-INDIA MOUNTAIN DIGITAL EXCHANGE • PAN-INDIA MOUNTAINS</span>
        </div>

        {/* Main Motto Headline */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold uppercase tracking-tight text-white max-w-4xl mx-auto leading-[1.06] drop-shadow-md">
          COMMUNITY EXPERIENCES. <br />
          <span className="text-[#A5C896]">MOUNTAIN JOBS. PROPERTIES FOR LEASE & SALE.</span>
        </h1>

        {/* Concise Platform Purpose */}
        <p className="mt-4 sm:mt-5 text-[#E7EFE3] text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed drop-shadow">
          A dedicated SaaS platform for all mountain regions of India: post and discover genuine mountain experiences, post vacancies and hire for mountain jobs, and list or acquire properties for lease or sale across Himachal, Uttarakhand, Ladakh, Kashmir, Sikkim, Northeast, Bengal Hills, and the Western Ghats.
        </p>

        {/* 3 Core Interactive SaaS Cards (Properties, Jobs, Community) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8 sm:mt-10 w-full max-w-5xl text-left">
          {/* Pillar 1: Properties for Lease & Sale */}
          <div className="group bg-gradient-to-b from-white/[0.12] to-white/[0.04] hover:from-white/[0.18] hover:to-white/[0.08] backdrop-blur-xl border border-white/15 hover:border-emerald-400/50 p-5 sm:p-6 rounded-3xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0B2516] to-[#164E2D] text-[#A5C896] flex items-center justify-center border border-emerald-500/30 shadow-inner">
                  <Home className="w-5 h-5 text-[#A5C896]" />
                </div>
                <span className="text-[11px] font-sans bg-[#164E2D]/80 backdrop-blur-md text-[#C6E8A3] border border-emerald-500/30 px-3 py-1 rounded-full font-medium shadow-xs">
                  {counts?.properties || 6} Available
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white uppercase group-hover:text-[#A5C896] transition-colors tracking-tight">
                Properties (Lease & Sale)
              </h3>
              <p className="text-xs text-[#D8E8D5]/80 font-light mt-2 leading-relaxed">
                Post your stone cottage, wooden chalet, or mountain land across India for long-term lease or outright sale with complete address details.
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectTab('stays')}
                type="button"
                className="group/btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium text-[#D8E8D5] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
              >
                <span>Browse Listings</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A5C896] group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onOpenListProperty}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-sans font-semibold text-white bg-gradient-to-r from-[#164E2D] to-[#1F6B3E] hover:from-[#1A5B35] hover:to-[#267F4B] border border-[#34D399]/40 shadow-sm hover:shadow-md hover:shadow-emerald-950/40 active:scale-95 transition-all duration-200"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#34D399]" />
                <span>List Space</span>
              </button>
            </div>
          </div>

          {/* Pillar 2: Mountain Jobs (Hire & Work) */}
          <div className="group bg-gradient-to-b from-white/[0.12] to-white/[0.04] hover:from-white/[0.18] hover:to-white/[0.08] backdrop-blur-xl border border-white/15 hover:border-emerald-400/50 p-5 sm:p-6 rounded-3xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0B2516] to-[#164E2D] text-[#A5C896] flex items-center justify-center border border-emerald-500/30 shadow-inner">
                  <Briefcase className="w-5 h-5 text-[#34D399]" />
                </div>
                <span className="text-[11px] font-sans bg-[#164E2D]/80 backdrop-blur-md text-[#C6E8A3] border border-emerald-500/30 px-3 py-1 rounded-full font-medium shadow-xs">
                  {counts?.jobs || 4} Openings
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white uppercase group-hover:text-[#A5C896] transition-colors tracking-tight">
                Mountain Jobs & Hiring
              </h3>
              <p className="text-xs text-[#D8E8D5]/80 font-light mt-2 leading-relaxed">
                Anyone can post vacancies to hire local talent or applicants. Apply for dignified mountain jobs and paid residencies.
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectTab('jobs')}
                type="button"
                className="group/btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium text-[#D8E8D5] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
              >
                <span>View Jobs</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#34D399] group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onOpenPostJob}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-sans font-semibold text-white bg-gradient-to-r from-[#164E2D] to-[#1F6B3E] hover:from-[#1A5B35] hover:to-[#267F4B] border border-[#34D399]/40 shadow-sm hover:shadow-md hover:shadow-emerald-950/40 active:scale-95 transition-all duration-200"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Post Job</span>
              </button>
            </div>
          </div>

          {/* Pillar 3: Community Section (Experiences & Stories) */}
          <div className="group bg-gradient-to-b from-white/[0.12] to-white/[0.04] hover:from-white/[0.18] hover:to-white/[0.08] backdrop-blur-xl border border-white/15 hover:border-emerald-400/50 p-5 sm:p-6 rounded-3xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-950/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0B2516] to-[#164E2D] text-[#A5C896] flex items-center justify-center border border-emerald-500/30 shadow-inner">
                  <MessageSquare className="w-5 h-5 text-[#A5C896]" />
                </div>
                <span className="text-[11px] font-sans bg-[#164E2D]/80 backdrop-blur-md text-[#C6E8A3] border border-emerald-500/30 px-3 py-1 rounded-full font-medium shadow-xs">
                  {counts?.dispatches || 6} Stories
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white uppercase group-hover:text-[#A5C896] transition-colors tracking-tight">
                Community Experiences
              </h3>
              <p className="text-xs text-[#D8E8D5]/80 font-light mt-2 leading-relaxed">
                Post your field notes, mountain adventures, trail logs, and transparent transport price reports for fellow travelers.
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectTab('community')}
                type="button"
                className="group/btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-medium text-[#D8E8D5] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
              >
                <span>Read Stories</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A5C896] group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={onOpenCreateDispatch}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-sans font-semibold text-white bg-gradient-to-r from-[#164E2D] to-[#1F6B3E] hover:from-[#1A5B35] hover:to-[#267F4B] border border-[#34D399]/40 shadow-sm hover:shadow-md hover:shadow-emerald-950/40 active:scale-95 transition-all duration-200"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Share Story</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
