import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { Calendar, PhoneCall } from 'lucide-react'

interface MobileStickyBookingBarProps {
  onBookClick?: () => void
}

export const MobileStickyBookingBar: FC<MobileStickyBookingBarProps> = ({ onBookClick }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past hero (e.g. 350px)
      setIsVisible(window.scrollY > 350)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  const handleAction = () => {
    if (onBookClick) {
      onBookClick()
    } else {
      const el = document.getElementById('homestays')
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#071F13]/98 backdrop-blur-md border-t border-[#1C4E33] px-4 py-3 shadow-[0_-10px_25px_rgba(0,0,0,0.4)] animate-fade-in-scale">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[#A5C896] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
            <span>Zero Middleman Fees</span>
          </div>
          <div className="text-xs font-display font-bold text-white mt-0.5">
            Pine Cottages from <span className="text-[#A5C896]">₹3,999</span>/nt
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:+919830029272"
            className="p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-xl border border-white/10 transition shrink-0"
            aria-label="Call Host Helpline"
          >
            <PhoneCall className="w-4 h-4 text-[#D96B27]" />
          </a>

          <button
            onClick={handleAction}
            type="button"
            className="inline-flex items-center gap-1.5 bg-[#D96B27] hover:bg-[#B85418] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-lg transition active:scale-95 shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Find Dates</span>
          </button>
        </div>
      </div>
    </div>
  )
}
