import { useState, useEffect, useRef } from 'react'
import type { FC } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  X,
  MountainSnow,
  Mail,
  User,
  PlusCircle,
  Home,
  Briefcase,
  MessageSquare,
  MoreVertical,
  ShieldCheck,
  LogOut,
  ChevronRight
} from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'
import { useAdminAuth } from '../../context/AdminAuthContext'

interface NavbarProps {
  onOpenJoinModal?: (role?: 'traveller' | 'host' | 'seeker' | 'employer') => void
  onOpenAuthModal?: () => void
}

export const Navbar: FC<NavbarProps> = ({
  onOpenJoinModal,
  onOpenAuthModal
}) => {
  const { currentUser, profile, logout } = useAdminAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [staffMenuOpen, setStaffMenuOpen] = useState(false)
  const staffMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (staffMenuRef.current && !staffMenuRef.current.contains(event.target as Node)) {
        setStaffMenuOpen(false)
      }
    }
    if (staffMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [staffMenuOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false)
        if (staffMenuOpen) setStaffMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen, staffMenuOpen])

  // Strictly the core SaaS modules matching navigation pills
  const navLinks = [
    { name: 'Property Lease & Sale', href: '#stays', icon: Home },
    { name: 'Mountain Jobs', href: '#jobs', icon: Briefcase },
    { name: 'Community Experiences', href: '#community', icon: MessageSquare }
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* 1. Top Announcement Bar (Single Compact Row on Mobile, Zero Stacking) */}
      <div className="bg-[#05170D] text-[#D8E8D5] text-[11px] sm:text-xs py-1 px-3 sm:px-6 border-b border-[#143D24]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="hidden md:flex items-center gap-1.5 text-[#A5C896] font-medium font-mono text-[11px]">
              <MountainSnow className="w-3.5 h-3.5 text-[#A5C896]" />
              <span>Pan-India Mountain Digital Infrastructure • Elevation 800m – 4,500m</span>
            </span>
            <span className="hidden md:inline text-white/20">|</span>
            <a
              href={`mailto:${BRAND_CONFIG.supportEmail}`}
              className="hover:text-white flex items-center gap-1.5 transition text-[#D8E8D5] font-mono text-[10px] sm:text-[11px]"
            >
              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#34D399]" />
              <span>{BRAND_CONFIG.supportEmail}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-[#0D301B] text-[#7FD69E] border border-[#1E5733] text-[9px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
              <span>Verified Mountain Exchange</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Bar */}
      <header
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A2316]/98 backdrop-blur-md shadow-xl border-b border-[#1C4E33] py-2'
            : 'bg-[#0A2316]/95 backdrop-blur-sm border-b border-[#1A452D] py-2 sm:py-2.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label={`${BRAND_CONFIG.name} Homepage`}
          >
            <img
              src={BRAND_CONFIG.logo.horizontal}
              alt={BRAND_CONFIG.logo.alt}
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105 brightness-105"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-[#E7EFE3]" aria-label="Main Navigation">
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Auth Controls (Hidden on mobile) */}
            <div className="hidden lg:flex items-center gap-2">
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
                    <span>Sign In</span>
                  </button>
                  <Link
                    to="/admin/login"
                    className="text-[10px] font-mono text-white/40 hover:text-white transition"
                    title="Staff Portal (Restricted to Administrators)"
                  >
                    Staff
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Action Button: Post Listing */}
            <button
              onClick={() => onOpenJoinModal?.('host')}
              type="button"
              className="inline-flex items-center gap-1.5 bg-[#164E2D] hover:bg-[#0E331F] text-white text-xs sm:text-xs md:text-sm font-bold uppercase tracking-wider px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all transform active:scale-95 border border-[#34D399]/30"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A5C896]" />
              <span>Post Listing</span>
            </button>

            {/* Mobile Three-Dot Toggle for Admin / Staff Login & Auth (lg:hidden) */}
            <div className="relative lg:hidden" ref={staffMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setStaffMenuOpen(!staffMenuOpen)
                  if (mobileMenuOpen) setMobileMenuOpen(false)
                }}
                className={`p-2 rounded-lg border transition-all ${
                  staffMenuOpen
                    ? 'bg-[#164E2D] text-white border-[#34D399]'
                    : 'text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
                }`}
                aria-label="Admin and staff portal options"
                aria-expanded={staffMenuOpen}
              >
                <MoreVertical className="w-5 h-5 text-[#A5C896]" />
              </button>

              {/* Three-Dot Dropdown Menu */}
              {staffMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#071F13] border border-[#1C4E33] rounded-2xl shadow-2xl p-2 z-50 text-white animate-fade-in-scale backdrop-blur-xl">
                  {currentUser ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 border-b border-[#1C4E33]/80">
                        <p className="text-[10px] font-mono uppercase text-[#A5C896] tracking-wider font-semibold">
                          Logged In
                        </p>
                        <p className="text-xs text-white truncate font-medium mt-0.5">
                          {currentUser.email}
                        </p>
                      </div>

                      {profile && (
                        <Link
                          to="/admin/destinations"
                          onClick={() => setStaffMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 text-xs font-mono text-white hover:bg-[#123D26] rounded-xl transition group"
                        >
                          <span className="flex items-center gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                            <span>Admin Dashboard</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white" />
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setStaffMenuOpen(false)
                          logout()
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-mono text-red-300 hover:bg-red-950/40 rounded-xl transition text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="px-3 py-1.5 border-b border-[#1C4E33]/80 mb-1">
                        <p className="text-[10px] font-mono uppercase text-[#A5C896] tracking-wider font-semibold">
                          Staff & Account Access
                        </p>
                      </div>

                      {/* Primary Item: Admin / Staff Login */}
                      <Link
                        to="/admin/login"
                        onClick={() => setStaffMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 text-xs font-mono text-white bg-[#123D26]/70 hover:bg-[#164E2D] border border-[#2D6B48]/60 rounded-xl transition group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#0B2516] border border-[#34D399]/40 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>Admin / Staff Login</span>
                              <span className="bg-[#05170D] text-[#34D399] text-[9px] px-1.5 py-0.2 rounded font-mono border border-[#34D399]/30">Staff</span>
                            </div>
                            <div className="text-[10px] text-white/60">Restricted portal</div>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#34D399] group-hover:translate-x-0.5 transition" />
                      </Link>

                      {/* Secondary Item: Community Member Sign In */}
                      <button
                        type="button"
                        onClick={() => {
                          setStaffMenuOpen(false)
                          onOpenAuthModal?.()
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono text-white hover:bg-white/5 rounded-xl transition text-left group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-[#8FA777]" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">Member Sign In</div>
                            <div className="text-[10px] text-white/50">Traveller & Host</div>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-0.5 transition" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen)
                if (staffMenuOpen) setStaffMenuOpen(false)
              }}
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
          <div className="lg:hidden bg-[#071F13] text-white border-t border-[#1C4E33] px-5 py-5 space-y-3 shadow-2xl animate-fade-in-scale">
            {/* Mobile Navigation Links */}
            <nav className="space-y-1.5">
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

            {/* Admin / Staff Portal link inside drawer as well */}
            <div className="pt-2 border-t border-[#1F4E34]/80 space-y-2">
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 px-3 text-xs font-mono text-[#A5C896] hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Admin / Staff Portal</span>
                </span>
                <span className="text-[10px] font-mono bg-[#05170D] text-[#34D399] px-1.5 py-0.5 rounded border border-[#34D399]/30">Staff Only</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-[#1F4E34] space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenJoinModal?.('host')
                }}
                className="w-full text-center flex items-center justify-center gap-2 bg-[#164E2D] hover:bg-[#0E331F] text-white font-bold py-2.5 rounded-xl text-sm uppercase tracking-wider shadow-md"
              >
                <PlusCircle className="w-4 h-4 text-[#A5C896]" />
                <span>Post Listing (Property / Job)</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
