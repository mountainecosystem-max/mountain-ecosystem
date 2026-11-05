import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  X,
  Home,
  User,
  Calendar,
  MountainSnow,
  PhoneCall,
  Mail,
  Search
} from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'
import { useAdminAuth } from '../../context/AdminAuthContext'

interface NavbarProps {
  onOpenJoinModal?: () => void
  onOpenSearch?: () => void
  onOpenAuthModal?: () => void
  onOpenBookCottage?: () => void
}

export const Navbar: FC<NavbarProps> = ({
  onOpenJoinModal,
  onOpenSearch,
  onOpenAuthModal,
  onOpenBookCottage
}) => {
  const { currentUser, profile, logout } = useAdminAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  const navLinks = [
    { name: 'Cottages & Suites', href: '#homestays' },
    { name: 'Experiences', href: '#experiences' },
    { name: 'Tea & Dining', href: '#dining' },
    { name: 'The Philosophy', href: '#philosophy' },
    { name: 'Mountain Jobs', href: '#jobs' },
    { name: 'Community Ledger', href: '#community' },
    { name: 'FAQs', href: '#faqs' }
  ]

  const handleBookClick = () => {
    if (onOpenBookCottage) {
      onOpenBookCottage()
    } else {
      const el = document.getElementById('homestays')
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* 1. Top Announcement & Concierge Strip (Awara Style with Tea Garden Palette) */}
      <div className="bg-[#05170D] text-[#D8E8D5] text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 border-b border-[#143D24]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-2">
          {/* Elevation & Climate Info */}
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1.5 text-[#A5C896] font-medium font-mono">
              <MountainSnow className="w-3.5 h-3.5 text-[#A5C896]" />
              <span>Elevation 6,850 ft • 14°C Crisp Mountain Air • Darjeeling & Takdah Ridges</span>
            </span>
            <span className="hidden md:inline text-white/20">|</span>
            <a
              href="tel:+919830029272"
              className="hover:text-white hidden lg:flex items-center gap-1 transition text-white/80"
            >
              <PhoneCall className="w-3 h-3 text-[#D96B27]" />
              <span>Host Helpline: +91 98300 MOUNTAIN</span>
            </a>
            <span className="hidden lg:inline text-white/20">|</span>
            <a
              href={`mailto:${BRAND_CONFIG.supportEmail}`}
              className="hover:text-white hidden xl:flex items-center gap-1 transition text-white/80"
            >
              <Mail className="w-3 h-3 text-[#A5C896]" />
              <span>{BRAND_CONFIG.supportEmail}</span>
            </a>
          </div>

          {/* Direct Host Booking Guarantee & Quick Links */}
          <div className="flex items-center gap-3">
            <span className="bg-[#0D301B] text-[#7FD69E] border border-[#1E5733] text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
              <span>Direct Host Booking • Zero Platform Fees</span>
            </span>

            <a
              href="#homestays"
              className="text-[#E7EFE3] hover:text-[#C6E8A3] underline text-[11px] hidden sm:flex items-center gap-1 font-medium transition ml-1"
            >
              <Calendar className="w-3 h-3" />
              <span>Explore Stays</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Bar */}
      <header
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A2316]/98 backdrop-blur-md shadow-xl border-b border-[#1C4E33] py-2.5'
            : 'bg-[#0A2316]/90 backdrop-blur-sm border-b border-[#1A452D] py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          {/* Brand Logo & Editorial Title */}
          <a
            href="#"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
            aria-label={`${BRAND_CONFIG.name} Homepage`}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#06180E] text-[#A5C896] rounded-xl flex items-center justify-center shadow-md border border-[#1F4E34] group-hover:scale-105 transition-transform duration-200">
              <Home className="w-5 h-5 sm:w-6 sm:h-6 text-[#A5C896]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                  {BRAND_CONFIG.name.split(' ')[0]}
                </span>
                <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#D96B27] uppercase">
                  {BRAND_CONFIG.name.split(' ').slice(1).join(' ') || 'SANCTUARIES'}
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#A5C896]/90 font-mono -mt-1 font-semibold truncate max-w-[210px] sm:max-w-none">
                Himalayan Pine Chalets & Eco-Living
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs font-semibold text-[#E7EFE3]" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-[#C6E8A3] transition-colors py-1 relative group tracking-wider uppercase font-mono text-[11px]"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8FA777] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action CTAs & Auth Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              type="button"
              className="p-2 text-[#E7EFE3]/80 hover:text-white hover:bg-white/10 rounded-full transition-colors hidden sm:inline-flex"
              aria-label="Search Ecosystem"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User Auth Status */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {profile ? (
                  <Link
                    to="/admin/destinations"
                    className="text-xs font-mono text-[#8FA777] hover:text-white px-2 py-1 rounded bg-[#123D26] border border-[#1F4E34]"
                  >
                    Admin Staff
                  </Link>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#123D26] border border-[#1F4E34] text-xs font-mono text-[#A5C896]">
                    <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                    <span className="max-w-[100px] truncate">
                      {currentUser.user_metadata?.full_name?.split(' ')[0] || currentUser.email?.split('@')[0]}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => logout()}
                  type="button"
                  className="text-[11px] font-mono text-white/60 hover:text-white transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuthModal?.()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#E7EFE3] hover:text-white bg-white/10 hover:bg-white/15 rounded-full border border-white/15 transition active:scale-95 font-medium"
                >
                  <User className="w-3.5 h-3.5 text-[#8FA777]" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
                <Link
                  to="/admin/login"
                  className="text-[10px] font-mono text-white/40 hover:text-white hidden md:inline transition"
                  title="Staff Portal (Restricted to Administrators)"
                >
                  Staff
                </Link>
              </div>
            )}

            {/* High-Impact Awara-Style Booking CTA Pill (Warm Amber Hearth Accent) */}
            <button
              onClick={handleBookClick}
              type="button"
              className="inline-flex items-center gap-2 bg-[#D96B27] hover:bg-[#B85418] text-white text-xs md:text-sm font-bold uppercase tracking-wider px-4 sm:px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all transform active:scale-95"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Book Cottage</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 text-white hover:text-[#C6E8A3] focus:outline-none lg:hidden rounded-lg hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#071F13] text-white border-t border-[#1C4E33] px-5 py-5 space-y-3.5 shadow-2xl animate-fade-in-scale">
            <div className="p-3 bg-[#0A2617] rounded-xl border border-[#1F4E34] mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#A5C896]">
                <MountainSnow className="w-4 h-4 text-[#D96B27]" />
                <span className="font-semibold">Elevation 6,850 ft • 14°C Crisp Air</span>
              </div>
              <p className="text-[11px] text-white/70 mt-1">
                Handcrafted pine chalets & tea garden sanctuaries in Darjeeling & Takdah.
              </p>
            </div>

            <nav className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 text-sm font-mono tracking-wider text-[#E7EFE3] hover:text-[#C6E8A3] hover:bg-white/5 rounded-lg transition"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-[#1F4E34] space-y-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleBookClick()
                }}
                className="w-full text-center flex items-center justify-center gap-2 bg-[#D96B27] hover:bg-[#B85418] text-white font-bold py-2.5 rounded-xl text-sm uppercase tracking-wider shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Check Cottage Availability</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenJoinModal?.()
                }}
                className="w-full text-center block bg-white/10 hover:bg-white/15 text-white font-mono py-2 rounded-xl text-xs uppercase tracking-wider border border-white/20"
              >
                Join Stewardship Fellowship
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
