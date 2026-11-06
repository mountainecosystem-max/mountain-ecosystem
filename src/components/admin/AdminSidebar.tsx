import type { FC } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Compass,
  Briefcase,
  Home,
  ShieldCheck,
  Store,
  Users,
  X,
  Database
} from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const AdminSidebar: FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    {
      to: '/admin/properties',
      label: 'Properties (Lease & Sale)',
      kicker: 'MODULE 01',
      icon: Home,
      description: 'Cottages, Chalets & Mountain Land'
    },
    {
      to: '/admin/jobs',
      label: 'Mountain Jobs',
      kicker: 'MODULE 02',
      icon: Briefcase,
      description: 'Hiring Posts & Valley Residencies'
    },
    {
      to: '/admin/moderation',
      label: 'Community Experiences & Moderation',
      kicker: 'MODULE 03',
      icon: ShieldCheck,
      description: 'Verify Stories, Inquiries & Ledger'
    },
    {
      to: '/admin/destinations',
      label: 'Destinations',
      kicker: 'MODULE 04',
      icon: Compass,
      description: 'Regional Mountain Coordinates'
    },
    {
      to: '/admin/businesses',
      label: 'Local Businesses',
      kicker: 'MODULE 05',
      icon: Store,
      description: 'Artisan Guilds & Farmgate Partners'
    },
    {
      to: '/admin/users',
      label: 'User Management',
      kicker: 'MODULE 06',
      icon: Users,
      description: 'Staff Roles, Hosts & Permissions'
    }
  ]

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[57px] bottom-0 left-0 z-50 lg:z-20 w-72 bg-[#06180E] border-r border-[#1F4E34] text-[#F8F6F0] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } h-screen lg:h-[calc(100vh-57px)]`}
      >
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-thin scrollbar-thumb-white/10">
          {/* Mobile Header with Close button */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 lg:hidden">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8FA777]">
              Navigation Menu
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Kicker */}
          <div className="text-[10px] uppercase font-mono tracking-[0.24em] text-white/40 mb-3 px-3">
            MANAGEMENT MODULES
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-start gap-3 p-3 rounded-sm transition-all border ${
                      isActive
                        ? 'bg-[#0B2516] border-[#8FA777]/50 text-white shadow-sm'
                        : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-[#8FA777] shrink-0 mt-0.5 group-hover:scale-105 transition-transform" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium font-sans">{item.label}</span>
                      <span className="text-[9px] font-mono text-[#8FA777]/80">{item.kicker}</span>
                    </div>
                    <p className="text-[10px] text-white/40 font-mono mt-0.5 leading-snug truncate">
                      {item.description}
                    </p>
                  </div>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom Platform Status Card */}
        <div className="p-4 border-t border-white/10 bg-black/30">
          <div className="flex items-center justify-between text-[10px] font-mono mb-2">
            <div className="flex items-center gap-1.5 text-white/70">
              <Database className="w-3 h-3 text-[#8FA777]" />
              <span>SUPABASE BACKEND</span>
            </div>
            <span className="text-emerald-400 font-semibold">ACTIVE</span>
          </div>
          <p className="text-[9px] font-mono text-white/40 leading-relaxed">
            Direct cryptographic connection via Supabase client. Row Level Security active.
          </p>
        </div>
      </aside>
    </>
  )
}
