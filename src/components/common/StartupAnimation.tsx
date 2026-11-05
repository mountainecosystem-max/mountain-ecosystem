import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { BRAND_CONFIG } from '../../config/branding'

export const StartupAnimation: FC = () => {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Start fade out after 1.2s
    const fadeTimer = setTimeout(() => {
      setFading(true)
    }, 1200)

    // Complete and remove from DOM after 1.9s
    const removeTimer = setTimeout(() => {
      setVisible(false)
    }, 1900)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05170D] transition-opacity duration-700 ease-out select-none pointer-events-none ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(22, 78, 45, 0.35) 0%, rgba(5, 23, 13, 0.95) 70%, rgba(3, 15, 8, 1) 100%)'
        }}
      />

      {/* Central Animated Logo Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 animate-fade-in-scale">
        {/* Emblem */}
        <div className="relative mb-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#0A2316] border-2 border-[#34D399]/40 flex items-center justify-center shadow-2xl p-2.5">
            <img
              src="/logo-icon.png"
              alt={BRAND_CONFIG.name}
              className="w-full h-full object-contain filter drop-shadow animate-pulse"
              onError={(e) => {
                // If local image fails, show SVG fallback
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          {/* Subtle luminous halo */}
          <div className="absolute inset-0 rounded-full border border-[#A5C896]/30 animate-ping opacity-25" />
        </div>

        {/* Brand Name */}
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase drop-shadow-md">
          {BRAND_CONFIG.name}
        </h1>

        {/* Territory Kicker */}
        <p className="mt-1.5 text-[11px] sm:text-xs font-mono text-[#A5C896] uppercase tracking-[0.25em] font-semibold">
          PAN-INDIA MOUNTAIN DIGITAL INFRASTRUCTURE
        </p>

        {/* Elegant glowing loading bar */}
        <div className="w-36 h-0.5 bg-white/10 rounded-full mt-6 overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#34D399] to-[#A5C896] w-full animate-shimmer" />
        </div>
      </div>
    </div>
  )
}
