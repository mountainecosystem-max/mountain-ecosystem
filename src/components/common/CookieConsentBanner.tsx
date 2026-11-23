import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { Cookie, X } from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'

interface CookieConsentBannerProps {
  onOpenCookiePolicy?: () => void
  onOpenPrivacy?: () => void
}

export const CookieConsentBanner: FC<CookieConsentBannerProps> = ({ onOpenCookiePolicy, onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('mountain_cookie_consent')
    if (!consent) {
      // Delay slightly for smoother page entry
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem('mountain_cookie_consent', 'accepted')
    setIsVisible(false)
  }

  const handleEssentialOnly = () => {
    localStorage.setItem('mountain_cookie_consent', 'essential')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div
      role="region"
      aria-label="Cookie Preferences"
      className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-md z-40 bg-[#0B1B3D]/95 backdrop-blur-md border border-[#1E3A8A] text-[#F8FAFC] p-4 sm:p-5 rounded-2xl shadow-2xl shadow-blue-900/40 animate-fade-in font-sans"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-full bg-white/10 border border-[#38BDF8]/30 flex items-center justify-center shrink-0 mt-0.5">
          <Cookie className="w-4 h-4 text-[#7DD3FC]" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7DD3FC] font-semibold">
              PRIVACY & ESSENTIAL COOKIES
            </span>
            <button
              onClick={handleEssentialOnly}
              className="text-white/40 hover:text-white p-0.5 transition-colors"
              aria-label="Dismiss cookie banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-light">
            We use essential cryptographic cookies to authenticate your account and preserve your session in the {BRAND_CONFIG.name}. We never sell personal data or track you across sites.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-4 py-2 min-h-[38px] bg-gradient-to-r from-[#2575fc] via-[#1d63d8] to-[#1e40af] hover:from-[#1d63d8] hover:to-[#1e3a8a] text-white text-[11px] font-semibold uppercase tracking-wider rounded-full transition-all shadow-md shadow-blue-500/20 flex items-center justify-center active:scale-95"
            >
              Accept All
            </button>

            <button
              type="button"
              onClick={handleEssentialOnly}
              className="px-4 py-2 min-h-[38px] bg-white/10 hover:bg-white/15 text-white text-[11px] font-mono uppercase tracking-wider rounded-full transition-colors border border-white/15 flex items-center justify-center active:scale-95"
            >
              Essential Only
            </button>

            {onOpenCookiePolicy && (
              <button
                type="button"
                onClick={onOpenCookiePolicy}
                className="text-[11px] font-mono text-[#7DD3FC] hover:text-white underline underline-offset-4 ml-1"
              >
                Cookie Policy
              </button>
            )}

            {onOpenPrivacy && (
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-[11px] font-mono text-[#7DD3FC] hover:text-white underline underline-offset-4 ml-1"
              >
                Privacy Policy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
