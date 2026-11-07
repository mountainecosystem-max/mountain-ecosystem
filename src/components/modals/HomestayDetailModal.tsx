import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import type { Homestay } from '../../types'
import {
  X,
  Star,
  Check,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  MessageCircle
} from 'lucide-react'
import { z } from 'zod'
import { submitLeaseInquiry } from '../../services/ecosystemService'

interface HomestayDetailModalProps {
  homestay: Homestay | null
  onClose: () => void
  onOpenPrivacy?: () => void
}

const leaseInquirySchema = z.object({
  guestName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  intendedTerm: z.string().min(1, 'Please select your intended lease term'),
  startDate: z.string().min(1, 'Please select your intended move-in date'),
  profession: z.string().min(2, 'Please share your profession or field of research'),
  message: z.string().min(15, 'Please tell the host about your mountain stay plans and work rhythm (min 15 chars)'),
})

type LeaseInquiryFormData = z.infer<typeof leaseInquirySchema>

export const HomestayDetailModal: FC<HomestayDetailModalProps> = ({
  homestay,
  onClose,
  onOpenPrivacy
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [formData, setFormData] = useState<LeaseInquiryFormData>({
    guestName: '',
    email: '',
    phone: '',
    intendedTerm: '3 Months',
    startDate: '',
    profession: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LeaseInquiryFormData, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!homestay) return null

  const handleLeaseSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const result = leaseInquirySchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LeaseInquiryFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LeaseInquiryFormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    if (!agreedToPrivacy) {
      setErrors((prev) => ({
        ...prev,
        message: 'Please review and check the Privacy Policy agreement before submitting your lease inquiry.'
      }))
      return
    }

    setErrors({})
    setIsSubmitting(true)
    await submitLeaseInquiry({
      homestayId: homestay.id,
      ...formData
    })
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0f2720]/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#F8F6F0] border border-[#202622]/20 rounded-sm max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-[#F8F6F0] border-b border-[#202622]/10 px-6 sm:px-8 py-4 flex items-center justify-between z-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C47755] font-semibold">
              RESIDENTIAL LEASE SPECIFICATION
            </span>
            <div className="text-xs text-[#71866B] font-mono mt-0.5">
              {homestay.region} • {homestay.elevation} • Ref: {homestay.id.toUpperCase()}
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-[#202622]/60 hover:text-[#183C32] hover:bg-[#202622]/5 rounded-sm transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Photo Gallery Frame */}
          <div>
            <div className="h-[280px] sm:h-[380px] overflow-hidden rounded-sm bg-[#183C32] relative mb-3">
              <img
                src={homestay.images[activeImageIndex] || homestay.images[0]}
                alt={homestay.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 right-4 bg-[#183C32]/90 backdrop-blur-sm text-[#F8F6F0] px-3 py-1 rounded-sm text-xs font-mono">
                {activeImageIndex + 1} of {homestay.images.length}
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2">
              {homestay.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-sm overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#183C32] scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Title & Lease Financial Overview */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#202622]/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-xs font-mono text-[#183C32] bg-[#71866B]/15 px-2.5 py-0.5 rounded-sm">
                  <Star className="w-3.5 h-3.5 fill-[#C47755] text-[#C47755]" />
                  <span>{homestay.rating} ({homestay.reviewsCount} resident reviews)</span>
                </span>
                <span className="text-xs text-[#202622]/60 font-mono">
                  {homestay.location}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#183C32] font-normal leading-tight">
                {homestay.name}
              </h2>
              <p className="text-xs font-mono text-[#71866B] mt-1">
                {homestay.roomType} • {homestay.furnishing}
              </p>
            </div>

            <div className="bg-[#FAF8F3] border border-[#202622]/15 p-4 rounded-sm text-left sm:text-right flex-shrink-0">
              {homestay.listingType === 'sale' && homestay.salePrice ? (
                <>
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className="font-serif text-2xl font-bold text-[#183C32]">
                      {homestay.salePrice}
                    </span>
                    <span className="text-xs font-mono text-[#D96B27] font-bold">🏷️ Outright Sale</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#C47755] mt-1 font-semibold">
                    Verified Land Registry / Clear Title
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className="font-serif text-2xl font-bold text-[#183C32]">
                      {homestay.monthlyRate}
                    </span>
                    <span className="text-xs font-mono text-[#202622]/60">/ month</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#C47755] mt-1 font-semibold">
                    Security Deposit: {homestay.securityDeposit} (Refundable)
                  </div>
                </>
              )}
              <div className="text-[10px] font-mono text-[#202622]/60 mt-0.5">
                Commitment: {homestay.minLeaseTerm}
              </div>
            </div>
          </div>

          {/* Host Profile */}
          <div className="flex items-center gap-4 p-4 bg-[#FAF8F3] border border-[#202622]/10 rounded-sm">
            <img
              src={homestay.host.avatar}
              alt={homestay.host.name}
              className="w-12 h-12 rounded-full object-cover border border-[#202622]/15 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-[#183C32]">Hosted & Maintained by {homestay.host.name}</h3>
                <span className="text-[10px] font-mono uppercase bg-[#71866B]/20 text-[#183C32] px-2 py-0.5 rounded-full font-semibold">
                  {homestay.verificationTier === 'community_listed' ? 'Community Listed' : 'Steward Verified ✓'}
                </span>
              </div>
              <p className="text-xs text-[#202622]/70 font-mono mt-0.5">
                {homestay.host.role} • Welcoming long-stay residents for {homestay.host.yearsHosting} years
              </p>

              {/* DPDP Section 6 Contact Transparency */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {homestay.phoneVisibility === 'public' && homestay.hostPhone ? (
                  <a
                    href={`https://wa.me/${homestay.hostPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-[11px] font-mono transition shadow-xs"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp Owner Directly</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    <span>Contact Shield Active: Host number protected against telemarketing scrapers</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#183C32] font-semibold mb-2">
              The Residential Sanctuary & Work Environment
            </h3>
            <p className="text-sm text-[#202622]/80 leading-relaxed font-light">
              {homestay.description}
            </p>
          </div>

          {/* Utilities & Sabbatical Amenities */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#183C32] font-semibold mb-3">
              Included In Lease Agreement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {homestay.utilitiesIncluded.map((util, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono text-[#202622]/80 bg-[#FAF8F3] p-2.5 rounded-sm border border-[#202622]/5">
                  <Check className="w-3.5 h-3.5 text-[#71866B] flex-shrink-0" />
                  <span>{util}</span>
                </div>
              ))}
              {homestay.amenities.map((amenity, i) => (
                <div key={`amenity-${i}`} className="flex items-center gap-2 text-xs font-mono text-[#202622]/80 bg-[#FAF8F3] p-2.5 rounded-sm border border-[#202622]/5">
                  <Check className="w-3.5 h-3.5 text-[#C47755] flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lease Inquiry Form */}
          <div className="pt-6 border-t border-[#202622]/15">
            {submitted ? (
              <div className="bg-[#71866B]/15 border border-[#71866B]/30 p-6 rounded-sm text-center">
                <CheckCircle2 className="w-8 h-8 text-[#183C32] mx-auto mb-2" />
                <h4 className="font-serif text-xl text-[#183C32] font-medium">
                  Lease Inquiry Dispatched to {homestay.host.name}
                </h4>
                <p className="text-xs text-[#202622]/80 font-mono mt-1 leading-relaxed">
                  Your lease application and proposed move-in dates have been delivered directly to the host's dispatch ledger. They will review your background and respond within 24 to 48 hours to confirm availability and discuss lease terms.
                </p>
                <button
                  onClick={onClose}
                  type="button"
                  className="mt-4 px-4 py-2 bg-[#183C32] text-[#F8F6F0] text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-[#122e26]"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeaseSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-[#183C32] font-medium">
                    Apply for Residential Lease
                  </h3>
                  <span className="text-[10px] font-mono text-[#C47755] font-semibold">
                    Standardized Mountain Lease Contract • 0% Middleman Fees
                  </span>
                </div>

                {/* Anti-Fraud & Inspection Advisory */}
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-sm text-xs text-amber-950 font-sans leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="font-semibold block font-mono text-[10px] uppercase tracking-wider text-amber-950">
                        Trust & Security Warning • Fraud se bachein:
                      </strong>
                      <p className="text-[11px] text-amber-900 leading-relaxed font-light">
                        Never share sensitive <strong>OTPs, bank account credentials, advance token money, or personal identity documents</strong> (Aadhaar, Passport, PAN) without independent in-person or official live video verification. Always inspect physical access, utilities, and land title credentials before transferring lease deposits.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202622]/70 mb-1">
                      Intended Lease Duration *
                    </label>
                    <select
                      value={formData.intendedTerm}
                      onChange={(e) => setFormData({ ...formData, intendedTerm: e.target.value })}
                      className="w-full bg-[#FAF8F3] border border-[#202622]/20 px-3 py-2 text-xs text-[#202622] rounded-sm focus:outline-none focus:border-[#183C32]"
                    >
                      <option value="1 Month">1 Month Sabbatical</option>
                      <option value="3 Months">3 Months Seasonal Lease</option>
                      <option value="6 Months">6 Months Half-Year Lease</option>
                      <option value="12 Months">12 Months Annual Residential Lease</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202622]/70 mb-1">
                      Proposed Move-In Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-[#FAF8F3] border border-[#202622]/20 px-3 py-2 text-xs text-[#202622] rounded-sm focus:outline-none focus:border-[#183C32]"
                    />
                    {errors.startDate && (
                      <p className="text-[10px] text-[#C47755] mt-1 font-mono flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202622]/70 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      placeholder="e.g. Maya Sen"
                      className="w-full bg-[#FAF8F3] border border-[#202622]/20 px-3 py-2 text-xs text-[#202622] rounded-sm focus:outline-none focus:border-[#183C32]"
                    />
                    {errors.guestName && (
                      <p className="text-[10px] text-[#C47755] mt-1 font-mono">{errors.guestName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202622]/70 mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. maya@example.com"
                      className="w-full bg-[#FAF8F3] border border-[#202622]/20 px-3 py-2 text-xs text-[#202622] rounded-sm focus:outline-none focus:border-[#183C32]"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-[#C47755] mt-1 font-mono">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202622]/70 mb-1">
                      Profession / Field *
                    </label>
                    <input
                      type="text"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      placeholder="e.g. Botanist / Remote Dev"
                      className="w-full bg-[#FAF8F3] border border-[#202622]/20 px-3 py-2 text-xs text-[#202622] rounded-sm focus:outline-none focus:border-[#183C32]"
                    />
                    {errors.profession && (
                      <p className="text-[10px] text-[#C47755] mt-1 font-mono">{errors.profession}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#202622]/70 mb-1">
                    Introduction & Mountain Residency Intent *
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell your hosts about your remote work routine, peaceful lifestyle, or creative purpose..."
                    className="w-full bg-[#FAF8F3] border border-[#202622]/20 px-3 py-2 text-xs text-[#202622] rounded-sm focus:outline-none focus:border-[#183C32]"
                  />
                  {errors.message && (
                    <p className="text-[10px] text-[#C47755] mt-1 font-mono flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Privacy Policy Agreement */}
                <div className="p-2.5 bg-[#FAF8F3] border border-[#202622]/15 rounded-sm">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedToPrivacy}
                      onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                      required
                      className="mt-0.5 w-3.5 h-3.5 rounded border-stone-400 text-[#183C32] focus:ring-[#183C32] cursor-pointer"
                    />
                    <span className="text-[11px] text-[#202622]/80 leading-relaxed font-sans">
                      I have read and agree to the{' '}
                      <button
                        type="button"
                        onClick={onOpenPrivacy}
                        className="text-[#183C32] font-semibold underline hover:text-black"
                      >
                        Privacy Policy
                      </button>
                      {' '}and consent to sharing my contact details with the host for lease arrangement.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#0A2316] via-[#123E24] to-[#184F2E] hover:from-[#0E2F1D] hover:to-[#1F633B] disabled:opacity-60 text-white py-3.5 px-6 text-xs sm:text-sm font-sans font-semibold tracking-wide rounded-full transition-all duration-200 shadow-md shadow-emerald-950/20 hover:shadow-xl hover:shadow-emerald-950/30 border border-emerald-500/30 active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C47755]" />
                      <span>Dispatching Application to Host...</span>
                    </>
                  ) : (
                    <>
                      <span>Dispatch Lease Application to {homestay.host.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C47755]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
