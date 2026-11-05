import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import { X, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Compass, CheckCircle2 } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { BRAND_CONFIG } from '../../config/branding'

interface PublicAuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: 'signin' | 'signup'
  onSuccess?: () => void
}

export const PublicAuthModal: FC<PublicAuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin',
  onSuccess
}) => {
  const { publicLogin, publicSignUp } = useAdminAuth()

  const [tab, setTab] = useState<'signin' | 'signup'>(initialTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!email.trim() || !password) {
      setError('Please provide your email address and password.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (tab === 'signup' && !fullName.trim()) {
      setError('Please provide your full name.')
      return
    }

    setIsSubmitting(true)
    try {
      if (tab === 'signin') {
        const res = await publicLogin(email, password)
        if (!res.success) {
          setError(res.error || 'Invalid credentials or user does not exist.')
        } else {
          onSuccess?.()
          onClose()
        }
      } else {
        const res = await publicSignUp(email, password, fullName)
        if (!res.success) {
          if (res.error?.toLowerCase().includes('rate limit')) {
            setError(
              'Email rate limit exceeded (Supabase free tier cap: 3 emails/hour). In Supabase Dashboard → Authentication → Providers → Email, turn OFF "Confirm email" to enable unlimited instant signups.'
            )
          } else {
            setError(res.error || 'Account creation could not be completed.')
          }
        } else {
          setSuccessMessage('Account created successfully! Welcome to the fellowship.')
          setTimeout(() => {
            onSuccess?.()
            onClose()
          }, 1000)
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#0B2516] border border-[#1F4E34] text-[#F8F6F0] rounded-sm max-w-md w-full shadow-2xl relative overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-0 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8FA777] font-semibold mb-1">
              <Compass className="w-3.5 h-3.5 text-[#8FA777]" />
              <span>COMMUNITY AUTHENTICATION</span>
            </div>
            <h2 className="font-serif text-2xl text-white font-normal">
              {tab === 'signin' ? `Sign In to ${BRAND_CONFIG.shortName}` : `Join ${BRAND_CONFIG.name}`}
            </h2>
            <p className="text-xs text-white/60 mt-1 font-light">
              Connect to post dispatches, submit enquiries, and participate across the ridge.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-black/40 border border-white/10 rounded-sm">
            <button
              type="button"
              onClick={() => {
                setTab('signin')
                setError(null)
              }}
              className={`py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${
                tab === 'signin'
                  ? 'bg-[#123D2D] text-white font-semibold shadow-xs'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup')
                setError(null)
              }}
              className={`py-2 text-xs font-mono uppercase tracking-wider rounded-xs transition-all ${
                tab === 'signup'
                  ? 'bg-[#123D2D] text-white font-semibold shadow-xs'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-sm flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-sm flex items-start gap-2.5 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {tab === 'signup' && (
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/70 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tshering Norbu"
                    className="w-full bg-black/30 border border-white/20 pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/30 rounded-sm focus:outline-none focus:border-[#8FA777]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/70 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fellow@example.com"
                  className="w-full bg-black/30 border border-white/20 pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/30 rounded-sm focus:outline-none focus:border-[#8FA777]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/70 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/30 border border-white/20 pl-9 pr-3 py-2 text-xs text-white placeholder:text-white/30 rounded-sm focus:outline-none focus:border-[#8FA777]"
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
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{tab === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4 text-[#0B2516]" />
                </>
              )}
            </button>
          </form>

          {/* Privacy & Governance Notice */}
          <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-white/50 leading-relaxed text-center">
            Zero subscription fees • Platform governance ensures community ownership • Staff access is strictly managed via the Staff Portal.
          </div>
        </div>
      </div>
    </div>
  )
}