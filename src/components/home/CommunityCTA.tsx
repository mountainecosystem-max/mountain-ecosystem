import { useState } from 'react'
import type { FormEvent, FC } from 'react'
import { ArrowRight, Check, Mail, HeartHandshake, Compass, Leaf } from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'

interface CommunityCTAProps {
  onJoinClick: (role?: 'traveller' | 'host') => void
}

export const CommunityCTA: FC<CommunityCTAProps> = ({ onJoinClick }) => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
    }
  }

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-[#0F3520] via-[#0B2A18] to-[#0A2214] text-[#E7EFE3] relative overflow-hidden border-t border-[#285A40]/60">
      {/* Background radial botanical glows */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#2E6F48]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-[#91B875]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#285A40]/80 border border-[#A6C98A]/50 rounded-full mb-6">
            <Leaf className="w-3.5 h-3.5 text-[#B8DC98]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#F4F9F0] font-semibold">
              THE MOUNTAIN FELLOWSHIP
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
            The mountains do not need more tourists.
            <span className="block italic text-[#C9E7A8] mt-2">
              They need neighbours.
            </span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-[#EBF3E7]/90 leading-relaxed font-light">
            Whether arriving for a month of writing beside an organic tea garden or opening your family hearth to thoughtful residents, {BRAND_CONFIG.name} is built on transparency, fair living wages, and deep reverence for the ridge.
          </p>
        </div>

        {/* Dual Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Left Card: Travellers & Creators */}
          <div className="bg-[#103322]/90 border border-[#306845] hover:border-[#67A67E] p-8 sm:p-10 rounded-sm flex flex-col justify-between shadow-2xl transition-all">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#285A40] border border-[#91A77B]/40 flex items-center justify-center text-[#E8EFE3] mb-6">
                <Compass className="w-5 h-5 text-[#91A77B]" />
              </div>

              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#91A77B] font-semibold block mb-2">
                FOR RESEARCHERS, CREATORS & TRAVELERS
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-4">
                Immerse in slow mountain living
              </h3>

              <p className="text-sm text-[#E8EFE3]/75 leading-relaxed font-light mb-6">
                Access verified shared-taxi indices, long-stay sabbatical leases with vetted optical fiber, and authentic local tea cooperative guidance without commercial markups.
              </p>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-[#E8EFE3]/80 font-mono">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#91A77B]" />
                  <span>Transparent local price benchmarks & transit schedules</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#91A77B]" />
                  <span>Vetted long stays with verified power & optic fiber</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#91A77B]" />
                  <span>Direct booking with 0% platform extraction</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onJoinClick('traveller')}
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#F8F6F0] text-[#0B2516] hover:bg-white text-xs uppercase tracking-wider font-semibold py-3.5 px-6 rounded-none transition-all shadow-sm active:scale-[0.99]"
            >
              <span>Join as Traveller or Creator</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0B2516]" />
            </button>
          </div>

          {/* Right Card: Hosts, Guides & Enterprises */}
          <div className="bg-[#103322]/90 border border-[#306845] hover:border-[#67A67E] p-8 sm:p-10 rounded-sm flex flex-col justify-between shadow-2xl transition-all">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#285A40] border border-[#91A77B]/40 flex items-center justify-center text-[#E8EFE3] mb-6">
                <HeartHandshake className="w-5 h-5 text-[#91A77B]" />
              </div>

              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#91A77B] font-semibold block mb-2">
                FOR MOUNTAIN HOSTS, GUIDES & FARMS
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white mb-4">
                Keep the value in your community
              </h3>

              <p className="text-sm text-[#E8EFE3]/75 leading-relaxed font-light mb-6">
                List your residential cottage lease, post estate or guiding roles, and publish harvest reports. We never impose algorithm games or extractive commissions.
              </p>

              <ul className="space-y-3 mb-8 text-xs sm:text-sm text-[#E8EFE3]/80 font-mono">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#91A77B]" />
                  <span>Direct guest conversations & mutual respect vetting</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#91A77B]" />
                  <span>Free job listings for local mountain enterprises</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#91A77B]" />
                  <span>Community legal advisory & homestay licensing aid</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onJoinClick('host')}
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1F4E34] text-[#E7EFE3] hover:bg-[#143523] text-xs uppercase tracking-wider font-semibold py-3.5 px-6 rounded-none transition-all shadow-sm active:scale-[0.99] border border-[#8FA777]/40"
            >
              <span>List Your Space or Enterprise</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8FA777]" />
            </button>
          </div>
        </div>

        {/* Editorial Newsletter Dispatch Sign-Up */}
        <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-[#06180E] border border-[#1F4E34] rounded-none text-center">
          <Mail className="w-6 h-6 text-[#8FA777] mx-auto mb-3" />
          <h4 className="font-serif text-xl sm:text-2xl font-normal text-white mb-2">
            The Green Mountain Dispatches
          </h4>
          <p className="text-xs sm:text-sm text-[#E7EFE3]/75 font-light mb-6">
            A fortnightly letter covering weather corridors, local seasonal tea harvests, oral folklore, and new homestay openings. No spam, only quiet mountain dispatches.
          </p>

          {subscribed ? (
            <div className="p-3 bg-[#1F4E34]/40 border border-[#8FA777]/40 rounded-none text-xs font-mono text-[#E7EFE3] flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-[#8FA777]" />
              <span>You have joined the dispatch ledger. Welcome to the ridge.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-[#0B2516] border border-[#1F4E34] text-white px-4 py-3 text-xs sm:text-sm rounded-none placeholder-[#E7EFE3]/40 focus:outline-none focus:border-[#8FA777]"
              />
              <button
                type="submit"
                className="bg-[#F8F6F0] hover:bg-white text-[#0B2516] px-6 py-3 text-xs font-mono uppercase tracking-wider font-semibold rounded-none transition-colors border border-[#F8F6F0] whitespace-nowrap"
              >
                Receive Dispatches
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
