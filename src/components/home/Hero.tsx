import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import {
  CalendarPlus,
  CalendarMinus,
  BedDouble,
  Users,
  ArrowRight,
  Mountain,
  Sprout,
  Star,
  SunMedium,
  CheckCircle2,
  Wifi,
  Flame,
  Compass
} from 'lucide-react'

interface HeroProps {
  onSearch: (destination: string, category: string) => void
  onExploreClick?: () => void
  onJoinClick?: () => void
}

export const Hero: FC<HeroProps> = ({ onSearch, onExploreClick: _onExploreClick, onJoinClick: _onJoinClick }) => {
  // Set default dates: check-in tomorrow, check-out in 3 days
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultCheckout = new Date(today)
  defaultCheckout.setDate(defaultCheckout.getDate() + 4)

  const formatDate = (d: Date) => d.toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState<string>(formatDate(tomorrow))
  const [checkOut, setCheckOut] = useState<string>(formatDate(defaultCheckout))
  const [cottageType, setCottageType] = useState('ALL')
  const [guests, setGuests] = useState('2')

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Scroll smoothly to the homestays section and trigger search callback
    const el = document.getElementById('homestays')
    el?.scrollIntoView({ behavior: 'smooth' })
    onSearch(cottageType, `${guests} Guests`)
  }

  return (
    <div className="relative">
      {/* 1. Main Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center pt-32 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-[#071F13] overflow-hidden text-white">
        {/* High-Resolution Mountain & Emerald Tea Garden Panorama */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/hero-darjeeling.jpg"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2200&q=90'
            }}
            alt="Misty emerald green tea terraces in Darjeeling with traditional stone monastery stupa on ridgeline"
            className="w-full h-full object-cover object-center animate-hero-drift brightness-105 contrast-105 saturate-110"
            loading="eager"
            fetchPriority="high"
          />

          {/* Lush Tea Garden Atmosphere Gradient: Deep forest green to transparent emerald */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(180deg, 
                  rgba(5, 23, 13, 0.75) 0%, 
                  rgba(7, 28, 16, 0.45) 35%, 
                  rgba(10, 35, 22, 0.65) 75%, 
                  rgba(5, 20, 11, 0.95) 100%
                )
              `
            }}
          />

          {/* Radial depth glow for readable typography */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 90% 65% at 50% 40%, rgba(3, 14, 8, 0.4) 0%, transparent 80%)'
            }}
          />
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto w-full text-center relative z-10 flex flex-col items-center">
          {/* Mountain Territory Badge (Awara Style) */}
          <div className="inline-flex items-center gap-2 bg-[#092617]/90 border border-[#2D6B48]/80 text-[#C6E8A3] text-[11px] sm:text-xs font-mono font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-md shadow-lg animate-float-slow">
            <Compass className="w-3.5 h-3.5 text-[#D96B27]" />
            <span>TAKDAH, MIRIK & DARJEELING RIDGES • EASTERN HIMALAYAS</span>
          </div>

          {/* High-Impact Main Headline (Awara Display Typography) */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white max-w-5xl mx-auto leading-[1.04] drop-shadow-lg">
            WAKE UP <span className="text-[#A5C896]">ABOVE THE CLOUDS.</span> <br />
            YOUR TEA GARDEN & <span className="text-[#D96B27]">MOUNTAIN SANCTUARY.</span>
          </h1>

          {/* Clear Core Motto Subtitle */}
          <p className="mt-5 text-[#E7EFE3] text-sm sm:text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed drop-shadow">
            Handcrafted fragrant pine chalets, Swedish river-stone fireplaces, organic single-estate teas, and 180° Kanchenjunga panoramas at 6,850 ft. Direct host bookings with zero middleman commissions.
          </p>

          {/* 2. Signature Floating Availability Search Bar (From Awara Homestays) */}
          <div className="mt-8 sm:mt-10 w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-stone-200/90 text-left text-stone-900 transition-all hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 items-end">
              {/* Check-In Date */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1 font-mono">
                  <CalendarPlus className="w-3.5 h-3.5 text-[#164E2D]" />
                  <span>Check-In</span>
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-[#164E2D] focus:ring-1 focus:ring-[#164E2D]"
                />
              </div>

              {/* Check-Out Date */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1 font-mono">
                  <CalendarMinus className="w-3.5 h-3.5 text-[#164E2D]" />
                  <span>Check-Out</span>
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-[#164E2D] focus:ring-1 focus:ring-[#164E2D]"
                />
              </div>

              {/* Cottage Style / Ridge */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1 font-mono">
                  <BedDouble className="w-3.5 h-3.5 text-[#164E2D]" />
                  <span>Cottage Style</span>
                </label>
                <select
                  value={cottageType}
                  onChange={(e) => setCottageType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-[#164E2D] cursor-pointer"
                >
                  <option value="ALL">All Mountain Cottages</option>
                  <option value="Cedar Wood Chalet">The Cedar Wood Chalet</option>
                  <option value="Glasshouse Star Attic">Glasshouse Star Attic Suite</option>
                  <option value="Pine Mist Family Villa">Pine Mist Family Villa</option>
                  <option value="Heritage Planter Suite">1924 Planter Heritage Suite</option>
                  <option value="Valley Nest Cabin">Valley Nest Cabin</option>
                  <option value="Kanchenjunga Penthouse Loft">Kanchenjunga Loft</option>
                </select>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1 font-mono">
                  <Users className="w-3.5 h-3.5 text-[#164E2D]" />
                  <span>Guests</span>
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-[#164E2D] cursor-pointer"
                >
                  <option value="1">1 Solo Traveler</option>
                  <option value="2">2 Guests (Couple / Friends)</option>
                  <option value="3">3 Guests (With Daybed)</option>
                  <option value="4">4 Guests (Family)</option>
                  <option value="6">5–6 Guests (Full Cottage)</option>
                </select>
              </div>

              {/* Search CTA Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-[#164E2D] hover:bg-[#0E331F] text-white font-bold uppercase tracking-wider text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-95"
                >
                  <span>Find Stays</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>

            {/* Trust Guarantee Indicators Underneath Search */}
            <div className="mt-3.5 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#164E2D]" />
                <span>100% Farm Breakfast & Single Estate Tea Included</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-[#164E2D]" />
                <span>High-Speed Fiber Internet for Workations</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#D96B27]" />
                <span>Complimentary Evening Firewood & Bonfire Hearth</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four-Metric Trust & Statistics Strip (Direct from Awara) */}
      <section className="bg-[#FAF7EE] border-y border-[#CBDAC4] py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {/* Stat 1 */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-[#0A2316] text-[#A5C896] flex items-center justify-center mb-2 shadow-sm">
              <Mountain className="w-5 h-5 text-[#A5C896]" />
            </div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#0A2316]">6,850 FT</p>
            <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-stone-600 font-mono">
              Himalayan Ridge Elevation
            </p>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-[#0A2316] text-[#A5C896] flex items-center justify-center mb-2 shadow-sm">
              <Sprout className="w-5 h-5 text-[#34D399]" />
            </div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#0A2316]">100% ORGANIC</p>
            <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-stone-600 font-mono">
              Farm-To-Table Kitchen & Teas
            </p>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-[#0A2316] text-[#A5C896] flex items-center justify-center mb-2 shadow-sm">
              <Star className="w-5 h-5 fill-[#EAB308] text-[#EAB308]" />
            </div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#0A2316]">4.97 ★</p>
            <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-stone-600 font-mono">
              Rated by 1,400+ Guests
            </p>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-[#0A2316] text-[#A5C896] flex items-center justify-center mb-2 shadow-sm">
              <SunMedium className="w-5 h-5 text-[#D96B27]" />
            </div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-[#0A2316]">180° PANORAMA</p>
            <p className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-stone-600 font-mono">
              Kanchenjunga Peak Views
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
