import type { FC } from 'react'
import { Link } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { Menu, ExternalLink, LogOut, Shield, User } from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'

interface AdminNavbarProps {
  onToggleSidebar: () => void
}

export const AdminNavbar: FC<AdminNavbarProps> = ({ onToggleSidebar }) => {
  const { profile, logout } = useAdminAuth()

  return (
    <header className="sticky top-0 z-30 bg-[#0B2516] border-b border-[#1F4E34] text-[#F8F6F0] px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/admin/properties" className="flex items-center gap-3">
          <img
            src={BRAND_CONFIG.logo.icon}
            alt={BRAND_CONFIG.name}
            className="h-8 w-auto object-contain"
          />
          <div className="flex items-center gap-2">
            <span className="font-serif text-base text-white tracking-tight hidden sm:inline">
              {BRAND_CONFIG.name}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#8FA777] uppercase px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-xs">
              ADMIN
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center gap-3 sm:gap-5 text-xs font-mono">
        {/* Link to public website */}
        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-sm transition-colors text-[11px]"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3 h-3 text-[#8FA777]" />
        </Link>

        {/* User Profile Badge */}
        {profile && (
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/10">
            <div className="w-6 h-6 rounded-full bg-[#123D2D] border border-[#8FA777]/30 flex items-center justify-center text-white/80">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-white text-[11px] font-sans font-medium leading-none">
                {profile.fullName}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-[#8FA777] mt-0.5 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" />
                <span>{profile.role}</span>
              </div>
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => logout()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white/70 hover:text-red-300 hover:bg-red-950/40 rounded-sm transition-colors text-[11px]"
          title="Sign out of Admin Portal"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  )
}
