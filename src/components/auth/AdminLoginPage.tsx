import { useState, useEffect } from 'react'
import type { FC, FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { BRAND_CONFIG, setPageTitle } from '../../config/branding'
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2, ArrowLeft, KeyRound } from 'lucide-react'

export const AdminLoginPage: FC = () => {
  const { login, isSupabaseReady, isAuthenticated, currentUser, profile } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setPageTitle('Staff Login')
  }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/destinations'
    navigate(from, { replace: true })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please provide both email and password.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await login(email, password)
      if (!res.success) {
        setError(res.error || 'Invalid credentials or user does not exist.')
      } else {
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/destinations'
        navigate(from, { replace: true })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#06180E] text-[#F8F6F0] flex flex-col justify-between selection:bg-[#8FA777]/30 selection:text-white">
      {/* Top Header */}
      <header className="p-6 sm:p-8 flex items-center justify-between border-b border-white/10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#8FA777]" />
          <span>RETURN TO PUBLIC WEBSITE</span>
        </Link>

        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[#8FA777]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PORTAL PROTOCOL • 256-BIT ENCRYPTION</span>
        </div>
      </header>

      {/* Main Form Centerpiece */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#0B2516] border border-[#1F4E34] p-8 sm:p-10 shadow-2xl rounded-sm">
          {/* Official Brand Logo & Headline */}
          <div className="text-center mb-8">
            <img
              src={BRAND_CONFIG.logo.horizontal}
              alt={BRAND_CONFIG.logo.alt}
              className="h-16 w-auto mx-auto mb-4 object-contain brightness-105 filter drop-shadow-sm"
            />
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-[0.24em] text-[#8FA777] mb-2 font-semibold">
              <KeyRound className="w-3 h-3" />
              <span>STAFF & MANAGEMENT PORTAL</span>
            </div>
            <p className="mt-2 text-xs font-sans text-white/60 font-light leading-relaxed">
              Authenticate to manage destinations, verify mountain jobs, approve residential leases, and moderate community ledgers.
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-950/60 border border-red-500/40 rounded-sm flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {!isSupabaseReady && (
            <div className="mb-6 p-3.5 bg-amber-950/60 border border-amber-500/40 rounded-sm flex items-start gap-2.5 text-xs text-amber-200 font-mono">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be configured in your .env file.</div>
            </div>
          )}

          {/* Community User Notification */}
          {currentUser && !profile && (
            <div className="mb-6 p-3.5 bg-amber-950/60 border border-amber-500/40 rounded-sm flex items-start gap-2.5 text-xs text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                Signed in as <strong className="text-white">{currentUser.email}</strong> (Community Member). Administrative staff authorization is required.
              </div>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={`admin@${BRAND_CONFIG.name.toLowerCase().replace(/\s+/g, '-')}.org`}
                  className="w-full bg-black/30 border border-white/20 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-white/30 rounded-sm focus:outline-none focus:border-[#8FA777]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/30 border border-white/20 pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-white/30 rounded-sm focus:outline-none focus:border-[#8FA777]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-[#F8F6F0] hover:bg-white text-[#0B2516] py-3 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B2516]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authorize Staff Session</span>
                  <ArrowRight className="w-4 h-4 text-[#0B2516]" />
                </>
              )}
            </button>
          </form>

          {/* Secure Staff Governance Notice */}
          <div className="mt-6 pt-6 border-t border-white/10 text-[11px] font-mono text-white/50 leading-relaxed space-y-2">
            <p className="text-white/70 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8FA777]" />
              <span>Administrative Staff Access Only</span>
            </p>
            <p>
              Administrative accounts are securely provisioned in the database. Public self-registration and non-staff Google logins are strictly barred from the admin management console.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-[10px] font-mono text-white/40 border-t border-white/10 uppercase tracking-wider">
        {BRAND_CONFIG.name} PLATFORM • ADMINISTRATIVE CONSOLE • {BRAND_CONFIG.region}
      </footer>
    </div>
  )
}
