import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import {
  X,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Compass,
  FileText,
  TrendingDown,
  Leaf,
  User,
  MapPin
} from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { createDispatch, type CreateDispatchInput } from '../../services/ecosystemService'
import { BRAND_CONFIG } from '../../config/branding'

interface CreateDispatchModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  onOpenPublicAuth?: () => void
}

const INDIAN_MOUNTAIN_STATES = [
  'Himachal Pradesh',
  'Uttarakhand',
  'Ladakh',
  'Jammu & Kashmir',
  'Sikkim',
  'West Bengal Hills',
  'Arunachal Pradesh',
  'Meghalaya',
  'Tamil Nadu (Nilgiris)',
  'Kerala (Highlands)',
  'Karnataka (Coorg & Chikmagalur)',
  'Other Indian Mountain Range'
]

export const CreateDispatchModal: FC<CreateDispatchModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenPublicAuth
}) => {
  const { currentUser } = useAdminAuth()

  const [type, setType] = useState<CreateDispatchInput['type']>('traveller_story')
  const [title, setTitle] = useState('')
  
  // Pan-India Address Fields
  const [state, setState] = useState('Himachal Pradesh')
  const [villageRoute, setVillageRoute] = useState('')
  const [elevation, setElevation] = useState('2,050 m')

  const [excerpt, setExcerpt] = useState('')
  const [fullContent, setFullContent] = useState('')

  // Price Report Details
  const [priceItem, setPriceItem] = useState('')
  const [priceSharedRate, setPriceSharedRate] = useState('')
  const [pricePrivateRate, setPricePrivateRate] = useState('')

  // Guest author fields (if not logged in)
  const [guestName, setGuestName] = useState('')
  const [guestRole, setGuestRole] = useState('Mountain Traveller & Contributor')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !villageRoute.trim() || !excerpt.trim() || !fullContent.trim()) {
      setError('Please fill in all required fields (Title, Route/Village, Excerpt, and Story Content).')
      return
    }

    const authorName =
      currentUser?.user_metadata?.full_name ||
      currentUser?.email?.split('@')[0] ||
      guestName.trim() ||
      'Mountain Fellow'

    const authorRole = currentUser ? 'Verified Community Contributor' : guestRole.trim() || 'Community Fellow'
    const authorAvatar = currentUser?.user_metadata?.avatar_url || undefined

    const fullLocationString = `${villageRoute.trim()}, ${state} (${elevation.trim() || 'Highland'})`

    setIsSubmitting(true)
    try {
      const res = await createDispatch({
        type,
        title: title.trim(),
        location: fullLocationString,
        excerpt: excerpt.trim(),
        fullContent: fullContent.trim(),
        authorName,
        authorRole,
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
      desc: 'Personal mountain living story',
      icon: Compass
    },
    {
      key: 'price_report',
      label: 'Ground Price Index',
      desc: 'Shared jeep, bus, porter rates',
      icon: TrendingDown
    },
    {
      key: 'host_story',
      label: 'Host & Village Story',
      desc: 'Community heritage & living notes',
      icon: FileText
    },
    {
      key: 'trail_note',
      label: 'Trail Advisory',
      desc: 'Snow condition, road & weather',
      icon: Leaf
    }
  ]

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#071F13]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#0B2516] border border-[#1F4E34] text-[#FAF7EE] rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0B2516]/95 backdrop-blur-md border-b border-[#1F4E34] px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between z-20">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8FA777] font-semibold">
              <Compass className="w-4 h-4 text-[#34D399]" />
              <span>PAN-INDIA COMMUNITY EXPERIENCES</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-white font-bold uppercase mt-0.5">
              Share Mountain Experience / Price Report
            </h2>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8">
          {error && (
            <div className="mb-6 p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {isSubmitted ? (
            <div className="bg-[#123D26] border border-[#8FA777]/40 p-8 sm:p-10 rounded-xl text-center">
              <CheckCircle2 className="w-12 h-12 text-[#34D399] mx-auto mb-3 animate-bounce" />
              <h3 className="font-display text-2xl text-white font-bold uppercase">
                Experience Published to Ledger!
              </h3>
              <p className="text-xs sm:text-sm text-[#D8E8D5] font-sans mt-2 max-w-md mx-auto leading-relaxed">
                Your dispatch has been written to the {BRAND_CONFIG.name} Pan-India community archives. Fellow travellers and locals can now read and upvote your verified field note.
              </p>
              <button
                onClick={onClose}
                type="button"
                className="mt-6 inline-flex items-center gap-2 bg-[#FAF7EE] hover:bg-white text-[#0B2516] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition shadow-md"
              >
                <span>View on Community Ledger</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Contributor Profile Status */}
              <div className="bg-white/5 border border-[#1F4E34] p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#123D26] border border-[#8FA777]/40 flex items-center justify-center font-mono text-xs text-[#A5C896]">
                    {currentUser ? (currentUser.email?.charAt(0).toUpperCase()) : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="text-white font-medium block truncate max-w-[200px]">
                      {currentUser?.user_metadata?.full_name || currentUser?.email || guestName || 'Community Member'}
                    </span>
                    <span className="text-[10px] font-mono text-[#8FA777]">
                      {currentUser ? 'Verified Contributor' : 'Guest Field Note Contributor'}
                    </span>
                  </div>
                </div>

                {!currentUser && onOpenPublicAuth && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      onOpenPublicAuth()
                    }}
                    className="text-[11px] font-mono text-[#A5C896] hover:underline"
                  >
                    Sign in for verified badge →
                  </button>
                )}
              </div>

              {/* 1. Category Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A5C896] mb-2 font-bold">
                  Select Nature of Experience *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {typeOptions.map((opt) => {
                    const Icon = opt.icon
                    const isSelected = type === opt.key
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setType(opt.key)}
                        className={`p-3 text-left border rounded-xl transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-[#123D26] border-[#A5C896] text-white shadow-sm'
                            : 'bg-black/20 border-white/10 text-white/70 hover:border-white/30'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-[#34D399]' : 'text-white/40'}`} />
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

              {/* 2. Dispatch Title */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A5C896] mb-1 font-bold">
                  Experience / Report Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Snow Status on Atal Tunnel Pass / Manali to Kaza Shared Fare Index"
                  className="w-full bg-black/40 border border-[#1F4E34] px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/30 rounded-lg focus:outline-none focus:border-[#A5C896]"
                />
              </div>

              {/* 3. Pan-India Mountain Location & Address */}
              <div className="bg-white/5 border border-[#1F4E34] p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A5C896] font-bold border-b border-white/10 pb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>Pan-India Mountain Location Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      Mountain State (Pan-India) *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-[#071F13] border border-[#1F4E34] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#A5C896]"
                    >
                      {INDIAN_MOUNTAIN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      Altitude / Elevation
                    </label>
                    <input
                      type="text"
                      value={elevation}
                      onChange={(e) => setElevation(e.target.value)}
                      placeholder="e.g. 2,050 m / 3,100 m"
                      className="w-full bg-black/40 border border-[#1F4E34] px-3 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-[#A5C896]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    Specific Route / Trailhead / Village / Ridge Road *
                  </label>
                  <input
                    type="text"
                    required
                    value={villageRoute}
                    onChange={(e) => setVillageRoute(e.target.value)}
                    placeholder="e.g. Old Manali to Solang Valley / Chopta to Tungnath Ridge / Yuksom Valley"
                    className="w-full bg-black/40 border border-[#1F4E34] px-3 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-[#A5C896]"
                  />
                </div>
              </div>

              {/* 4. Conditional Ground Price Details */}
              {type === 'price_report' && (
                <div className="p-4 bg-white/5 border border-[#1F4E34] rounded-xl space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#A5C896] block font-bold">
                    Ground Transit / Rate Metadata
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-mono text-white/60 mb-1">
                        Commodity or Route
                      </label>
                      <input
                        type="text"
                        value={priceItem}
                        onChange={(e) => setPriceItem(e.target.value)}
                        placeholder="e.g. Shared Bolero to Kaza"
                        className="w-full bg-black/40 border border-[#1F4E34] px-2.5 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-[#A5C896]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/60 mb-1">
                        Shared Fare / Rate
                      </label>
                      <input
                        type="text"
                        value={priceSharedRate}
                        onChange={(e) => setPriceSharedRate(e.target.value)}
                        placeholder="e.g. ₹1,200 / seat"
                        className="w-full bg-black/40 border border-[#1F4E34] px-2.5 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-[#A5C896]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/60 mb-1">
                        Charter Vehicle / Guide
                      </label>
                      <input
                        type="text"
                        value={pricePrivateRate}
                        onChange={(e) => setPricePrivateRate(e.target.value)}
                        placeholder="e.g. ₹9,500 / vehicle"
                        className="w-full bg-black/40 border border-[#1F4E34] px-2.5 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-[#A5C896]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Short Summary (Excerpt) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A5C896] mb-1 font-bold">
                  Quick 1-Line Summary *
                </label>
                <input
                  type="text"
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="e.g. Shared 4x4 Boleros running daily from Manali with standard ₹1,200 union fares."
                  className="w-full bg-black/40 border border-[#1F4E34] px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 rounded-lg focus:outline-none focus:border-[#A5C896]"
                />
              </div>

              {/* 6. Full Story Content */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A5C896] mb-1 font-bold">
                  Detailed Experience & Observations *
                </label>
                <textarea
                  required
                  rows={4}
                  value={fullContent}
                  onChange={(e) => setFullContent(e.target.value)}
                  placeholder="Share details on road conditions, snow, winter heating, porter availability, contact booths, or food along the route..."
                  className="w-full bg-black/40 border border-[#1F4E34] p-3 text-xs text-white placeholder:text-white/30 rounded-lg focus:outline-none focus:border-[#A5C896] leading-relaxed"
                />
              </div>

              {/* 7. Guest Contributor Details (if not signed in) */}
              {!currentUser && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full bg-black/40 border border-[#1F4E34] px-3 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-[#A5C896]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 mb-1">
                      Your Contributor Role
                    </label>
                    <input
                      type="text"
                      value={guestRole}
                      onChange={(e) => setGuestRole(e.target.value)}
                      placeholder="e.g. Mountain Trekker / Sabbatical Fellow"
                      className="w-full bg-black/40 border border-[#1F4E34] px-3 py-2 text-xs text-white rounded-lg focus:outline-none focus:border-[#A5C896]"
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#1F4E34] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-white/20 text-xs font-bold text-white/70 hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-[#FAF7EE] hover:bg-white text-[#0B2516] text-xs sm:text-sm font-bold uppercase tracking-wider px-7 py-3 rounded-full transition shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Writing to Ledger...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#0B2516]" />
                      <span>Publish Field Dispatch</span>
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
