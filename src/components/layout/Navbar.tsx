import { useState, useEffect, useRef } from 'react'
import type { FC } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  X,
  MountainSnow,
  Mail,
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
}

export const Navbar: FC<NavbarProps> = ({
  onOpenJoinModal
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
      <div className="bg-[#060E1E] text-[#CBD5E1] text-[11px] sm:text-xs py-1 px-3 sm:px-6 border-b border-[#0F224A]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="hidden md:flex items-center gap-1.5 text-[#38BDF8] font-medium font-mono text-[11px]">
              <MountainSnow className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Pan-India Mountain Digital Infrastructure • Elevation 800m – 4,500m</span>
            </span>
            <span className="hidden md:inline text-white/20">|</span>
            <a
              href={`mailto:${BRAND_CONFIG.supportEmail}`}
              className="hover:text-white flex items-center gap-1.5 transition text-[#D8E8D5] font-mono text-[10px] sm:text-[11px]"
            >
              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#38BDF8]" />
              <span>{BRAND_CONFIG.supportEmail}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-[#0C1E3D] text-[#60A5FA] border border-[#1E40AF]/40 text-[9px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              <span className="hidden sm:inline">Curated Mountain Exchange • Two-Tier Verification</span>
              <span className="sm:hidden">Two-Tier Verified</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Bar */}
      <header
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B1B3D]/98 backdrop-blur-md shadow-xl border-b border-[#1E3A8A]/50 py-2'
            : 'bg-[#0B1B3D]/95 backdrop-blur-sm border-b border-[#1E3A8A]/40 py-2 sm:py-2.5'
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
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold text-[#E2E8F0]" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-[#38BDF8] transition-colors py-1 relative group tracking-wider uppercase font-mono text-[11px]"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2575fc] transition-all duration-200 group-hover:w-full" />
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
                      to="/admin/properties"
                      className="text-xs font-mono text-[#7DD3FC] hover:text-white px-2.5 py-1 rounded-full bg-[#0F224A] border border-[#38BDF8]/40"
                    >
                      Admin Staff
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F224A] border border-[#38BDF8]/40 text-xs font-mono text-[#7DD3FC]">
                      <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
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
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs text-[#E7EFE3] hover:text-white bg-white/10 hover:bg-white/15 rounded-full border border-white/20 transition-all active:scale-95 font-sans font-medium shadow-xs"
                  title="Staff Portal (Restricted to Administrators)"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Admin Staff</span>
                </Link>
              )}
            </div>

            {/* Quick Action Button: Post Listing */}
            <button
              onClick={() => onOpenJoinModal?.('host')}
              type="button"
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#2575fc] via-[#1d63d8] to-[#1e40af] hover:from-[#1d63d8] hover:to-[#2575fc] text-white text-[11px] sm:text-xs md:text-sm font-sans font-semibold tracking-wide px-3 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md shadow-blue-900/30 hover:shadow-lg hover:shadow-blue-600/30 transition-all transform active:scale-95 border border-sky-400/30 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7DD3FC]" />
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
                className={`min-w-[42px] min-h-[42px] flex items-center justify-center p-2 rounded-lg border transition-all ${
                  staffMenuOpen
                    ? 'bg-[#1E3A8A] text-white border-[#38BDF8]'
                    : 'text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
                }`}
                aria-label="Admin and staff portal options"
                aria-expanded={staffMenuOpen}
              >
                <MoreVertical className="w-5 h-5 text-[#38BDF8]" />
              </button>

              {/* Three-Dot Dropdown Menu */}
              {staffMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#081226] border border-[#1E3A8A] rounded-2xl shadow-2xl p-2 z-50 text-white animate-fade-in-scale backdrop-blur-xl">
                  {currentUser ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 border-b border-[#1E3A8A]/80">
                        <p className="text-[10px] font-mono uppercase text-[#38BDF8] tracking-wider font-semibold">
                          Logged In
                        </p>
                        <p className="text-xs text-white truncate font-medium mt-0.5">
                          {currentUser.email}
                        </p>
                      </div>

                      {profile && (
                        <Link
                          to="/admin/properties"
                          onClick={() => setStaffMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 text-xs font-mono text-white hover:bg-[#152A56] rounded-xl transition group"
                        >
                          <span className="flex items-center gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
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
                      <div className="px-3 py-1.5 border-b border-[#1E3A8A]/80 mb-1">
                        <p className="text-[10px] font-mono uppercase text-[#38BDF8] tracking-wider font-semibold">
                          Staff & Account Access
                        </p>
                      </div>

                      {/* Primary Item: Admin / Staff Login */}
                      <Link
                        to="/admin/login"
                        onClick={() => setStaffMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2.5 text-xs font-mono text-white bg-[#152A56]/70 hover:bg-[#1E3A8A] border border-[#2575fc]/40 rounded-xl transition group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#0B1B3D] border border-[#38BDF8]/40 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>Admin / Staff Login</span>
                              <span className="bg-[#060E1E] text-[#38BDF8] text-[9px] px-1.5 py-0.2 rounded font-mono border border-[#38BDF8]/30">Staff</span>
                            </div>
                            <div className="text-[10px] text-white/60">Restricted portal</div>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#38BDF8] group-hover:translate-x-0.5 transition" />
                      </Link>
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
              className="min-w-[42px] min-h-[42px] flex items-center justify-center p-2 text-white hover:text-[#38BDF8] focus:outline-none lg:hidden rounded-lg hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#081226] text-white border-t border-[#1E3A8A] px-5 py-5 space-y-3 shadow-2xl animate-fade-in-scale">
            {/* Mobile Navigation Links */}
            <nav className="space-y-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 text-sm font-mono tracking-wider text-[#E2E8F0] hover:text-[#38BDF8] hover:bg-white/5 rounded-lg transition"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Admin / Staff Portal link inside drawer as well */}
            <div className="pt-2 border-t border-[#1E3A8A]/80 space-y-2">
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 px-3 text-xs font-mono text-[#38BDF8] hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Admin / Staff Portal</span>
                </span>
                <span className="text-[10px] font-mono bg-[#060E1E] text-[#38BDF8] px-1.5 py-0.5 rounded border border-[#38BDF8]/30">Staff Only</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-[#1E3A8A] space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenJoinModal?.('host')
                }}
                className="w-full text-center flex items-center justify-center gap-2 bg-gradient-to-r from-[#2575fc] to-[#1E3A8A] hover:from-[#1d63d8] hover:to-[#2575fc] text-white font-bold py-2.5 rounded-xl text-sm uppercase tracking-wider shadow-md"
              >
                <PlusCircle className="w-4 h-4 text-[#7DD3FC]" />
                <span>Post Listing (Property / Job)</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
