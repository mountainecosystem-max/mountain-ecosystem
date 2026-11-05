import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import { X, Send, Loader2, CheckCircle2, AlertCircle, Compass, FileText, TrendingDown, Leaf, User } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { createDispatch, type CreateDispatchInput } from '../../services/ecosystemService'
import { BRAND_CONFIG } from '../../config/branding'

interface CreateDispatchModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  onOpenPublicAuth?: () => void
}

export const CreateDispatchModal: FC<CreateDispatchModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenPublicAuth
}) => {
  const { currentUser } = useAdminAuth()

  const [type, setType] = useState<CreateDispatchInput['type']>('traveller_story')
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [fullContent, setFullContent] = useState('')
  const [priceItem, setPriceItem] = useState('')
  const [priceSharedRate, setPriceSharedRate] = useState('')
  const [pricePrivateRate, setPricePrivateRate] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !location.trim() || !excerpt.trim() || !fullContent.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    const authorName =
      currentUser?.user_metadata?.full_name ||
      currentUser?.email?.split('@')[0] ||
      'Mountain Fellow'

    const authorAvatar = currentUser?.user_metadata?.avatar_url || undefined

    setIsSubmitting(true)
    try {
      const res = await createDispatch({
        type,
        title: title.trim(),
        location: location.trim(),
        excerpt: excerpt.trim(),
        fullContent: fullContent.trim(),
        authorName,
        authorRole: 'Community Contributor',
        authorAvatar,
        priceItem: type === 'price_report' ? priceItem.trim() : undefined,
        priceSharedRate: type === 'price_report' ? priceSharedRate.trim() : undefined,
        pricePrivateRate: type === 'price_report' ? pricePrivateRate.trim() : undefined
      })

      if (!res.success) {
        setError(res.error || 'Failed to publish dispatch.')
      } else {
        setIsSubmitted(true)
        onSuccess?.()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to publish dispatch.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const typeOptions: {
    key: CreateDispatchInput['type']
    label: string
    desc: string
    icon: typeof Compass
  }[] = [
    {
      key: 'traveller_story',
      label: 'Field Journal',
      desc: 'Reflective personal experience',
      icon: Compass
    },
    {
      key: 'price_report',
      label: 'Ground Price Index',
      desc: 'Transit or farmgate rates',
      icon: TrendingDown
    },
    {
      key: 'host_story',
      label: 'Host Chronicle',
      desc: 'Indigenous heritage & hearth',
      icon: FileText
    },
    {
      key: 'trail_note',
      label: 'Trail Advisory',
      desc: 'Forest trails & weather status',
      icon: Leaf
    }
  ]

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#0B2516] border border-[#1F4E34] text-[#F8F6F0] rounded-sm max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0B2516] border-b border-[#1F4E34] px-6 py-4 flex items-center justify-between z-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8FA777] block font-semibold">
              COMMUNITY LEDGER DISPATCH
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal mt-0.5">
              Publish to {BRAND_CONFIG.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-950/60 border border-red-500/40 rounded-sm flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Condition 1: User is NOT logged in -> Show Sign-in Prompt */}
          {!currentUser ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-white/5 border border-[#8FA777]/30 flex items-center justify-center">
                <Compass className="w-7 h-7 text-[#8FA777]" />
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-serif text-2xl text-white font-medium">
                  Sign in to Publish Dispatch
                </h3>
                <p className="text-xs font-sans text-white/70 leading-relaxed font-light">
                  Sign in with your email account to publish verified field notes, tea estate journals, or ground transport updates to the {BRAND_CONFIG.name} community ledger.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onOpenPublicAuth?.()
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F8F6F0] hover:bg-white text-[#0B2516] font-semibold text-xs py-3.5 px-8 rounded-sm shadow-xl transition-all"
                >
                  <User className="w-4 h-4 text-[#0B2516]" />
                  <span>Sign In / Create Account</span>
                </button>
              </div>

              <p className="text-[11px] font-mono text-white/40 pt-2">
                Standard verified member account • Instant access to the community ledger
              </p>
            </div>
          ) : isSubmitted ? (
            /* Condition 2: Post Successfully Submitted */
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="font-serif text-2xl text-white font-medium">
                Dispatch Published Successfully
              </h3>
              <p className="text-xs font-mono text-white/70 max-w-md mx-auto leading-relaxed">
                Your dispatch has been written to the {BRAND_CONFIG.name} community ledger under your verified author profile.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#F8F6F0] hover:bg-white text-[#0B2516] text-xs font-sans font-semibold uppercase tracking-wider rounded-sm transition-colors"
                >
                  View on Community Ledger
                </button>
              </div>
            </div>
          ) : (
            /* Condition 3: User IS logged in -> Show Posting Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Connected User Badge */}
              <div className="bg-white/5 border border-[#1F4E34] p-3 rounded-sm flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  {currentUser.user_metadata?.avatar_url ? (
                    <img
                      src={currentUser.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover border border-[#8FA777]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#123D2D] border border-[#8FA777]/40 flex items-center justify-center font-mono text-xs text-white">
                      {currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="text-white font-medium block truncate max-w-[200px]">
                      {currentUser.user_metadata?.full_name || currentUser.email}
                    </span>
                    <span className="text-[10px] font-mono text-[#8FA777]">
                      Verified Community Contributor
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/30 rounded-xs">
                  AUTH ACTIVE
                </span>
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8FA777] mb-2 font-semibold">
                  Select Dispatch Nature *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {typeOptions.map((opt) => {
                    const Icon = opt.icon
                    const isSelected = type === opt.key
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setType(opt.key)}
                        className={`p-3 text-left border rounded-sm transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-[#123D2D] border-[#8FA777] text-white'
                            : 'bg-black/20 border-white/10 text-white/70 hover:border-white/30'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-[#8FA777]' : 'text-white/40'}`} />
                        <div>
                          <span className="text-xs font-semibold block">{opt.label}</span>
                          <span className="text-[10px] font-mono text-white/50 block leading-tight mt-0.5">
                            {opt.desc}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8FA777] mb-1.5 font-semibold">
                  Dispatch Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Monastic Walk & Tea Flush Prices in Mirik Valley"
                  className="w-full bg-black/30 border border-white/20 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 rounded-sm focus:outline-none focus:border-[#8FA777]"
                />
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8FA777] mb-1.5 font-semibold">
                  Himalayan Territory or Village *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Happy Valley Tea Estate, Darjeeling (2,042m)"
                  className="w-full bg-black/30 border border-white/20 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 rounded-sm focus:outline-none focus:border-[#8FA777]"
                />
              </div>

              {/* Conditional Price Report Fields */}
              {type === 'price_report' && (
                <div className="p-3 bg-white/5 border border-white/10 rounded-sm space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8FA777] block font-semibold">
                    Ground Price Metadata
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-white/60 mb-1">
                        Commodity / Route
                      </label>
                      <input
                        type="text"
                        value={priceItem}
                        onChange={(e) => setPriceItem(e.target.value)}
                        placeholder="Shared Jeep to Ghoom"
                        className="w-full bg-black/30 border border-white/20 px-2.5 py-2 text-xs text-white rounded-sm focus:outline-none focus:border-[#8FA777]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/60 mb-1">
                        Shared Fare / Unit
                      </label>
                      <input
                        type="text"
                        value={priceSharedRate}
                        onChange={(e) => setPriceSharedRate(e.target.value)}
                        placeholder="₹60 / seat"
                        className="w-full bg-black/30 border border-white/20 px-2.5 py-2 text-xs text-white rounded-sm focus:outline-none focus:border-[#8FA777]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/60 mb-1">
                        Charter Rate
                      </label>
                      <input
                        type="text"
                        value={pricePrivateRate}
                        onChange={(e) => setPricePrivateRate(e.target.value)}
                        placeholder="₹600 / vehicle"
                        className="w-full bg-black/30 border border-white/20 px-2.5 py-2 text-xs text-white rounded-sm focus:outline-none focus:border-[#8FA777]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Short Summary (Excerpt) */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8FA777] mb-1.5 font-semibold">
                  Summary Excerpt (1–2 Sentences) *
                </label>
                <input
                  type="text"
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise overview to headline your dispatch on the community feed..."
                  className="w-full bg-black/30 border border-white/20 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 rounded-sm focus:outline-none focus:border-[#8FA777]"
                />
              </div>

              {/* Full Narrative Content */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-[#8FA777] mb-1.5 font-semibold">
                  Full Dispatch Story or Report *
                </label>
                <textarea
                  required
                  rows={5}
                  value={fullContent}
                  onChange={(e) => setFullContent(e.target.value)}
                  placeholder="Share detailed field observations, honest prices, route conditions, or local host encounters..."
                  className="w-full bg-black/30 border border-white/20 p-3.5 text-xs text-white placeholder:text-white/30 rounded-sm focus:outline-none focus:border-[#8FA777]"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-mono uppercase text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-[#F8F6F0] hover:bg-white text-[#0B2516] px-6 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0B2516]" />
                      <span>Publishing Dispatch...</span>
                    </>
                  ) : (
                    <>
                      <span>Publish Dispatch</span>
                      <Send className="w-3.5 h-3.5 text-[#0B2516]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}