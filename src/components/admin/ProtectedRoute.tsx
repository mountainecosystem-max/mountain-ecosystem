import type { FC, ReactNode } from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { Compass, Loader2, ShieldAlert, ArrowLeft, LogOut } from 'lucide-react'

export const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, currentUser, profile, logout } = useAdminAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06180E] text-[#F8F6F0] flex flex-col items-center justify-center p-6">
        <div className="flex items-center gap-3 text-sm font-mono tracking-widest text-[#8FA777] uppercase mb-4 animate-pulse">
          <Compass className="w-5 h-5 text-[#8FA777]" />
          <span>AUTHENTICATING STAFF PORTAL</span>
        </div>
        <Loader2 className="w-8 h-8 text-[#8FA777] animate-spin" />
        <p className="mt-4 text-xs font-mono text-white/50">Verifying Supabase cryptographic session...</p>
      </div>
    )
  }

  // Google-authenticated ordinary users attempting /admin access are denied
  if (currentUser && !profile) {
    return (
      <div className="min-h-screen bg-[#06180E] text-[#F8F6F0] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-full max-w-md bg-[#0B2516] border border-red-500/40 p-8 sm:p-10 shadow-2xl rounded-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-950/70 border border-red-500/50 flex items-center justify-center mb-6">
            <ShieldAlert className="w-7 h-7 text-red-400" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 block font-semibold mb-2">
            ADMINISTRATIVE PRIVILEGES REQUIRED
          </span>

          <h2 className="font-serif text-2xl text-white font-medium mb-3">
            Staff Portal Restricted
          </h2>

          <p className="text-xs font-mono text-white/70 leading-relaxed mb-6">
            You are authenticated as <strong className="text-white">{currentUser.email}</strong> (Community Member). This console is strictly restricted to verified staff administrators.
          </p>

          <div className="space-y-3">
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#F8F6F0] hover:bg-white text-[#0B2516] py-3 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4 text-[#0B2516]" />
              <span>Return to Public Website</span>
            </Link>

            <button
              onClick={() => logout()}
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white py-2.5 text-xs font-mono uppercase tracking-wider rounded-sm transition-all border border-white/15"
            >
              <LogOut className="w-3.5 h-3.5 text-[#8FA777]" />
              <span>Sign Out of This Account</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
