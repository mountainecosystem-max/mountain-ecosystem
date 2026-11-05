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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 sm:mt-10 w-full max-w-4xl text-left">
          {/* Pillar 1: Properties for Lease & Sale */}
          <div className="group bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-[#34D399]/50 p-5 rounded-2xl transition-all shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B2516] text-[#A5C896] flex items-center justify-center border border-[#1F4E34]">
                  <Home className="w-5 h-5 text-[#A5C896]" />
                </div>
                <span className="text-[10px] font-mono bg-[#164E2D] text-[#C6E8A3] px-2.5 py-0.5 rounded-full font-semibold">
                  {counts?.properties || 6} Available
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white uppercase group-hover:text-[#A5C896] transition-colors">
                Properties (Lease & Sale)
              </h3>
              <p className="text-xs text-[#D8E8D5]/80 font-light mt-1.5 leading-relaxed">
                Post your stone cottage, wooden chalet, or mountain land across India for long-term lease or outright sale with complete address details.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectTab('stays')}
                type="button"
                className="text-xs font-semibold text-[#A5C896] hover:text-white flex items-center gap-1 transition"
              >
                <span>Browse Listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenListProperty}
                type="button"
                className="text-[11px] font-mono bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-lg transition border border-white/10 flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3 text-[#34D399]" />
                <span>List Space</span>
              </button>
            </div>
          </div>

          {/* Pillar 2: Mountain Jobs (Hire & Work) */}
          <div className="group bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-[#34D399]/50 p-5 rounded-2xl transition-all shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B2516] text-[#A5C896] flex items-center justify-center border border-[#1F4E34]">
                  <Briefcase className="w-5 h-5 text-[#34D399]" />
                </div>
                <span className="text-[10px] font-mono bg-[#164E2D] text-[#C6E8A3] px-2.5 py-0.5 rounded-full font-semibold">
                  {counts?.jobs || 4} Openings
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white uppercase group-hover:text-[#A5C896] transition-colors">
                Mountain Jobs & Hiring
              </h3>
              <p className="text-xs text-[#D8E8D5]/80 font-light mt-1.5 leading-relaxed">
                Anyone can post vacancies to hire local talent or applicants. Apply for dignified mountain jobs and paid residencies.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectTab('jobs')}
                type="button"
                className="text-xs font-semibold text-[#A5C896] hover:text-white flex items-center gap-1 transition"
              >
                <span>View Jobs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenPostJob}
                type="button"
                className="text-[11px] font-mono bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-lg transition border border-white/10 flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3 text-[#34D399]" />
                <span>Post Job</span>
              </button>
            </div>
          </div>

          {/* Pillar 3: Community Section (Experiences & Stories) */}
          <div className="group bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-[#34D399]/50 p-5 rounded-2xl transition-all shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B2516] text-[#A5C896] flex items-center justify-center border border-[#1F4E34]">
                  <MessageSquare className="w-5 h-5 text-[#A5C896]" />
                </div>
                <span className="text-[10px] font-mono bg-[#164E2D] text-[#C6E8A3] px-2.5 py-0.5 rounded-full font-semibold">
                  {counts?.dispatches || 6} Stories
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-white uppercase group-hover:text-[#A5C896] transition-colors">
                Community Experiences
              </h3>
              <p className="text-xs text-[#D8E8D5]/80 font-light mt-1.5 leading-relaxed">
                Post your field notes, mountain adventures, trail logs, and transparent transport price reports for fellow travelers.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectTab('community')}
                type="button"
                className="text-xs font-semibold text-[#A5C896] hover:text-white flex items-center gap-1 transition"
              >
                <span>Read Stories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenCreateDispatch}
                type="button"
                className="text-[11px] font-mono bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-lg transition border border-white/10 flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3 text-[#34D399]" />
                <span>Share Story</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
