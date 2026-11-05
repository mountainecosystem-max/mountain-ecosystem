import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Compass, Users, Briefcase, Home, Search, ArrowUpRight, HelpCircle, User } from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'
import { useAdminAuth } from '../../context/AdminAuthContext'

interface NavbarProps {
  onOpenJoinModal?: () => void
  onOpenSearch?: () => void
  onOpenAuthModal?: () => void
}

export const Navbar: FC<NavbarProps> = ({ onOpenJoinModal, onOpenSearch, onOpenAuthModal }) => {
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

  // Exact navigation links as specified
  const navLinks = [
    { name: 'Destinations', href: '#destinations', icon: Compass },
    { name: 'Community Ledger', href: '#community', icon: Users },
    { name: 'Mountain Jobs', href: '#jobs', icon: Briefcase },
    { name: 'Residential Leases', href: '#homestays', icon: Home },
    { name: 'FAQs', href: '#faqs', icon: HelpCircle },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0B2516]/95 backdrop-blur-md border-b border-[#1F4E34]/50 py-3 shadow-[0_8px_32px_-8px_rgba(6,24,14,0.6)]'
          : 'bg-gradient-to-b from-[#0B2516]/90 via-[#0B2516]/40 to-transparent py-4 sm:py-5 border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="flex items-center justify-between">
          {/* Configurable Brand Logo */}
          <a
            href="#"
            className="group flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FDFBF7]"
            aria-label={`${BRAND_CONFIG.name} Homepage`}
          >
            <img
              src={BRAND_CONFIG.logo.horizontal}
              alt={BRAND_CONFIG.logo.alt}
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] filter drop-shadow-sm brightness-105"
            />
          </a>

          {/* Elegant Sans-Serif Navigation Links: Editorial Micro-Interactions */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="editorial-nav-link focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FDFBF7]/50"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Header Actions: Search, Sign In, & Independent Floating Cream 'Join Fellowship' Pill */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <button
              onClick={onOpenSearch}
              type="button"
              className="w-8 h-8 flex items-center justify-center text-[#E7EFE3]/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 focus:outline-none"
              aria-label="Search Ecosystem"
              title="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                {profile ? (
                  <Link
                    to="/admin/destinations"
                    className="editorial-nav-link text-xs font-mono text-[#8FA777] hover:text-white"
                  >
                    Staff Console
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    {currentUser.user_metadata?.avatar_url ? (
                      <img
                        src={currentUser.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-5 h-5 rounded-full object-cover border border-[#8FA777]"
                      />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-[#123D2D] border border-[#8FA777]/50 flex items-center justify-center text-[10px] font-mono text-[#8FA777]">
                        {currentUser.email?.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span
                      className="text-[11px] font-mono text-[#8FA777] hidden lg:inline max-w-[120px] truncate"
                      title={currentUser.email}
                    >
                      {currentUser.user_metadata?.full_name?.split(' ')[0] || currentUser.email?.split('@')[0]}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => logout()}
                  type="button"
                  className="editorial-nav-link text-[11px] font-mono text-white/50 hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenAuthModal?.()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-sans rounded-full border border-white/20 transition-all active:scale-95"
                >
                  <User className="w-3.5 h-3.5 text-[#8FA777]" />
                  <span>Sign In</span>
                </button>
                <Link
                  to="/admin/login"
                  className="editorial-nav-link text-[11px] font-mono text-white/40 hover:text-white"
                  title="Staff Portal (Restricted to Administrators)"
                >
                  Staff
                </Link>
              </div>
            )}

            {/* Independent Floating Pill CTA Button: Sharp Solid Cream (#FDFBF7) & Stark Dark Green (#0B2516) */}
            <button
              onClick={onOpenJoinModal}
              type="button"
              className="h-8 inline-flex items-center justify-center gap-1.5 text-[11px] font-sans font-semibold tracking-[0.14em] uppercase bg-[#FDFBF7] text-[#0B2516] hover:bg-white px-4.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 ease-out active:scale-[0.98] border border-[#FDFBF7] shrink-0"
            >
              <span>Join Fellowship</span>
              <ArrowUpRight className="w-3 h-3 text-[#0B2516]" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSearch}
              type="button"
              className="w-8 h-8 flex items-center justify-center text-[#E7EFE3] hover:text-white"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="w-8 h-8 flex items-center justify-center text-[#E7EFE3] hover:text-white focus:outline-none"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-[62px] bg-[#0B2516]/95 backdrop-blur-md z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-[#0B2516] border-b border-[#1F4E34] px-6 py-8"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-base font-sans text-[#E7EFE3] hover:text-white py-2.5 border-b border-[#1F4E34]/40"
                  >
                    <Icon className="w-4 h-4 text-[#8FA777]" />
                    <span>{link.name}</span>
                  </a>
                )
              })}

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onOpenJoinModal?.()
                  }}
                  type="button"
                  className="w-full text-center text-xs uppercase tracking-wider font-sans font-semibold bg-[#FDFBF7] text-[#0B2516] py-3 rounded-full"
                >
                  Join Fellowship
                </button>
                {currentUser ? (
                  <div className="flex flex-col gap-2 pt-2">
                    {profile ? (
                      <Link
                        to="/admin/destinations"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center text-xs uppercase tracking-wider font-sans text-white py-2.5 bg-[#1F4E34] border border-[#8FA777]/40 rounded-full block"
                      >
                        Staff Console
                      </Link>
                    ) : (
                      <div className="text-center text-[11px] font-mono text-[#8FA777] py-1 truncate">
                        Signed in: {currentUser.email}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        logout()
                      }}
                      type="button"
                      className="w-full text-center text-xs uppercase tracking-wider font-mono text-white/60 hover:text-white py-2 border border-white/10 rounded-full"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false)
                        onOpenAuthModal?.()
                      }}
                      className="w-full flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-sans text-white py-2.5 bg-white/10 border border-white/20 rounded-full"
                    >
                      <User className="w-4 h-4 text-[#8FA777]" />
                      <span>Sign In / Register</span>
                    </button>
                    <Link
                      to="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center text-xs uppercase tracking-wider font-mono text-white/50 py-2 border border-white/10 rounded-full block"
                    >
                      Staff Portal
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
