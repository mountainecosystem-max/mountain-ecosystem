import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import { ArrowRight, MapPin, Search, Calendar, Compass } from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'

interface HeroProps {
  onSearch: (destination: string, category: string) => void
  onExploreClick: () => void
  onJoinClick: () => void
}

export const Hero: FC<HeroProps> = ({ onSearch, onExploreClick, onJoinClick }) => {
  const [selectedRegion, setSelectedRegion] = useState('All Regions')
  const [selectedIntent, setSelectedIntent] = useState('All Experiences')

  const regions = [
    'All Regions',
    'Darjeeling Tea Belt',
    'Kalimpong Green Ridge',
    'Sikkim Forest Valleys',
    'Dooars Sal Canopy'
  ]

  const intents = [
    'All Experiences',
    'Residential Leases (1–12 Mos)',
    'Mountain Jobs & Residencies',
    'Architectural & Material Ledger',
    'Ground Price Dispatches',
    'Tea Cooperative Stays'
  ]

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch(selectedRegion, selectedIntent)
  }

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-between overflow-hidden bg-[#0B2516] text-white pt-32 sm:pt-38 pb-16 lg:pb-20">
      {/* 1. Breathtaking High-Resolution Panoramic Hero Photograph */}
      {/* Misty emerald green tea terraces in Darjeeling with traditional stone monastery stupa on ridgeline */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/hero-darjeeling.jpg"
          onError={(e) => {
            // Fallback to high-res misty tea garden panorama if local file load fails
            e.currentTarget.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2200&q=90'
          }}
          alt="Breathtaking panoramic view of misty emerald-green tea terraces in Darjeeling with a stone monastery stupa on a cedar ridge"
          className="w-full h-full object-cover object-center animate-hero-drift brightness-110 contrast-105 saturate-115"
          loading="eager"
          fetchPriority="high"
        />

        {/* Luminous emerald atmosphere: Lightened to allow natural mountain sunshine and tea foliage to pop vibrantly */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(
                115deg,
                rgba(5, 22, 13, 0.76) 0%,
                rgba(7, 28, 17, 0.60) 25%,
                rgba(11, 38, 23, 0.40) 48%,
                rgba(14, 46, 28, 0.18) 72%,
                rgba(14, 46, 28, 0.0) 90%
              ),
              linear-gradient(
                180deg,
                rgba(4, 18, 10, 0.50) 0%,
                rgba(6, 24, 14, 0.15) 30%,
                rgba(8, 28, 16, 0.02) 55%,
                rgba(6, 22, 13, 0.25) 80%,
                rgba(4, 16, 9, 0.65) 100%
              )
            `
          }}
        />

        {/* Soft atmospheric radial glow focused on text zone */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse 85% 65% at 20% 40%,
                rgba(4, 16, 9, 0.28) 0%,
                rgba(6, 22, 13, 0.10) 45%,
                transparent 80%
              )
            `
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex-1 flex flex-col justify-between">
        {/* Centerpiece: Lead directly with the core punch */}
        <div className="max-w-4xl my-auto py-4 sm:py-6 lg:py-8">
          {/* Subtle Editorial Kicker */}
          <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.24em] text-[#C6E8A3] mb-4 sm:mb-5 drop-shadow-[0_1px_4px_rgba(2,10,5,0.8)] animate-float-slow">
            <Compass className="w-3.5 h-3.5 text-[#B2DC86]" />
            <span>{BRAND_CONFIG.name.toUpperCase()} • {BRAND_CONFIG.tagline.toUpperCase()}</span>
          </div>

          {/* 1. Core punch: Serif Headline (Dropped by exactly 25% on mobile to 36px/text-4xl to prevent single-word wrapping) */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[1.04] sm:leading-[0.98] lg:leading-[0.96] tracking-[-0.02em] font-normal text-white drop-shadow-[0_4px_24px_rgba(2,10,5,0.85)]">
            Closer to the mountains.
            <span className="block italic font-light text-[#D5EBBF] mt-2 sm:mt-3 drop-shadow-[0_2px_16px_rgba(2,10,5,0.7)]">
              Closer to the people.
            </span>
          </h1>

          {/* Descriptive Narrative */}
          <div className="mt-6 sm:mt-8 max-w-2xl">
            <p className="text-base sm:text-lg md:text-xl text-white/95 font-light leading-relaxed font-sans drop-shadow-[0_2px_10px_rgba(2,10,5,0.7)]">
              Discover trusted mountain experiences, local opportunities, and places worth calling home across the emerald tea terraces and cedar ridges of Darjeeling, Kalimpong, Sikkim, and the Dooars.
            </p>

            {/* 2. Anchor with the data: Crisp vertical 2x2 grid on < 768px, horizontal stamp on md+ */}
            <div className="mt-6 sm:mt-7 pt-4 sm:pt-5 border-t border-white/20">
              {/* Mobile (< 768px): Crisp 2x2 Grid */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 md:hidden text-[10px] font-mono tracking-[0.16em] text-[#E7EFE3]/80 uppercase drop-shadow-[0_1px_6px_rgba(2,10,5,0.7)]">
                <div className="flex items-center gap-2 border-r border-white/10 pr-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8FA777] shrink-0" />
                  <span className="font-semibold text-[#F8F6F0] truncate">27°04'10" N • 88°16'05" E</span>
                </div>
                <div className="flex items-center gap-2 pl-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8FA777] shrink-0" />
                  <span className="text-[#8FA777] font-medium">ELEVATION: 2,042M</span>
                </div>
                <div className="flex items-center gap-2 border-r border-white/10 pr-2 pt-2 border-t border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                  <span className="text-[#E7EFE3]/90 truncate">DARJEELING TEA BELT</span>
                </div>
                <div className="flex items-center gap-2 pl-1 pt-2 border-t border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                  <span className="text-[#E7EFE3]/70 truncate">{BRAND_CONFIG.region.toUpperCase()}</span>
                </div>
              </div>

              {/* Desktop & Tablet (>= 768px): Refined Horizontal Stamp */}
              <div className="hidden md:flex items-center justify-between text-[10px] font-mono tracking-[0.22em] text-[#E7EFE3]/80 uppercase drop-shadow-[0_1px_6px_rgba(2,10,5,0.7)]">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8FA777]" />
                  <span className="font-semibold text-[#F8F6F0]">27°04'10" N • 88°16'05" E</span>
                  <span className="text-white/30">•</span>
                  <span className="text-[#8FA777]">ELEVATION: 2,042M</span>
                </div>

                <div className="flex items-center gap-4 text-[#E7EFE3]/70">
                  <span>DARJEELING TEA BELT</span>
                  <span className="text-white/30">•</span>
                  <span>{BRAND_CONFIG.region.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Scannable Feature Highlights with Fine-Line Borders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-3 border-t border-white/10 text-xs font-mono text-[#E7EFE3]/85 drop-shadow-[0_1px_6px_rgba(2,10,5,0.6)]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8FA777]" />
                <span>1–12 Month Leases</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8FA777]" />
                <span>100 Mbps Optic Fiber</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8FA777]" />
                <span>Direct Village Pacts</span>
              </div>
            </div>
          </div>

          {/* Editorial CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreClick}
              type="button"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#F8F6F0] text-[#0B2516] hover:bg-white text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-none shadow-xl transition-all duration-200 active:scale-[0.99] border border-[#F8F6F0]"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0B2516]" />
            </button>

            <button
              onClick={onJoinClick}
              type="button"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/15 backdrop-blur-md text-[#E7EFE3] hover:text-white text-xs uppercase tracking-[0.2em] font-mono font-medium rounded-none border border-white/20 transition-colors"
            >
              <span>Join Fellowship</span>
            </button>
          </div>
        </div>

        {/* Luminous Concierge Search Bar: Crisp Glassmorphism, Brighter Borders, High Contrast */}
        <div className="w-full mt-8 sm:mt-12">
          <div className="bg-[#0E331F]/90 backdrop-blur-md border border-[#3E7D58]/60 rounded-none p-4 sm:p-5 shadow-[0_20px_50px_rgba(4,18,10,0.5)] text-[#E7EFE3]">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-0 md:divide-x md:divide-white/20 items-center">
              {/* Territory Selector */}
              <div className="md:col-span-4 px-3 sm:px-4 py-2">
                <label htmlFor="hero-region" className="block text-[9px] font-mono uppercase tracking-[0.24em] text-[#B5DC96] mb-1 font-semibold">
                  Himalayan Territory
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#A8CC92] flex-shrink-0" />
                  <select
                    id="hero-region"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full bg-transparent text-sm font-serif text-white focus:outline-none cursor-pointer"
                  >
                    {regions.map((reg) => (
                      <option key={reg} value={reg} className="bg-[#0E331F] text-white">
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Purpose Selector */}
              <div className="md:col-span-5 px-3 sm:px-4 py-2">
                <label htmlFor="hero-intent" className="block text-[9px] font-mono uppercase tracking-[0.24em] text-[#B5DC96] mb-1 font-semibold">
                  What are you seeking?
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#A8CC92] flex-shrink-0" />
                  <select
                    id="hero-intent"
                    value={selectedIntent}
                    onChange={(e) => setSelectedIntent(e.target.value)}
                    className="w-full bg-transparent text-sm font-serif text-white focus:outline-none cursor-pointer"
                  >
                    {intents.map((item) => (
                      <option key={item} value={item} className="bg-[#0E331F] text-white">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Action */}
              <div className="md:col-span-3 px-3 sm:px-4 py-1">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#F3EFE6] text-[#0A241A] text-xs uppercase tracking-[0.2em] font-sans font-bold py-3.5 px-4 rounded-none transition-all duration-200 shadow-md active:scale-[0.99] border border-white"
                >
                  <Search className="w-3.5 h-3.5 text-[#0A241A]" />
                  <span>Discover</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
