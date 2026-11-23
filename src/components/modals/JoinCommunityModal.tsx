import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import { X, CheckCircle2, ArrowRight, AlertCircle, Leaf, Loader2, ShieldAlert } from 'lucide-react'
import { z } from 'zod'
import { submitFellowshipApplication } from '../../services/ecosystemService'
import { BRAND_CONFIG } from '../../config/branding'

interface JoinCommunityModalProps {
  initialRole?: 'traveller' | 'host' | 'seeker' | 'employer'
  onClose: () => void
  onOpenPrivacy?: () => void
}

const joinSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  role: z.enum(['traveller', 'host', 'seeker', 'employer']),
  region: z.string().min(1, 'Please select your primary Himalayan region of interest'),
  intent: z.string().min(10, `Please describe what brings you to ${BRAND_CONFIG.name} (min 10 characters)`),
})

type JoinFormData = z.infer<typeof joinSchema>

export const JoinCommunityModal: FC<JoinCommunityModalProps> = ({
  initialRole = 'traveller',
  onClose,
  onOpenPrivacy
}) => {
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [formData, setFormData] = useState<JoinFormData>({
    fullName: '',
    email: '',
    phone: '',
    role: initialRole,
    region: 'Darjeeling & Kurseong Tea Hills',
    intent: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof JoinFormData, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const result = joinSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof JoinFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof JoinFormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    if (!agreedToPrivacy) {
      setErrors((prev) => ({
        ...prev,
        intent: 'Please check and agree to the Privacy Policy & Community Charter before enrolling.'
      }))
      return
    }

    setErrors({})
    setIsSubmitting(true)
    await submitFellowshipApplication(formData)
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-[#0B1B3D]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#F8FAFC] border border-slate-200 rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 -mb-1 sm:hidden shrink-0" />
        {/* Header */}
        <div className="sticky top-0 bg-[#F8FAFC] border-b border-slate-200 px-6 sm:px-8 py-5 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#2575fc] font-bold">
              <Leaf className="w-3.5 h-3.5 text-[#2575fc]" />
              <span>COMMUNITY FELLOWSHIP</span>
            </div>
            <h2 className="font-serif text-2xl text-[#0F172A] font-normal mt-0.5">
              Join {BRAND_CONFIG.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 flex items-center justify-center p-1.5 text-slate-600 hover:text-[#0F172A] hover:bg-sky-50 active:bg-slate-200 rounded-full transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="bg-sky-50 border border-[#2575fc]/40 p-8 rounded-sm text-center">
              <CheckCircle2 className="w-10 h-10 text-[#2575fc] mx-auto mb-3" />
              <h3 className="font-serif text-2xl text-[#0F172A] font-medium">
                Welcome to the Ridge
              </h3>
              <p className="text-xs text-slate-600 font-mono mt-2 leading-relaxed">
                Your fellowship enrollment has been received. Our community stewards in Kurseong & Gangtok will review your application and send your credential pass to {formData.email}.
              </p>
              <button
                onClick={onClose}
                type="button"
                className="mt-6 px-6 py-2.5 bg-[#0B1B3D] text-slate-200 text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-[#0B1B3D] border border-[#2575fc]"
              >
                Return to Mountain Platform
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 font-light leading-relaxed">
                We are building a cooperative network connecting respectful travellers, local hosts, job seekers, and ethical employers across the Eastern Himalayas. Zero subscription fees.
              </p>

              {/* Role Picker */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1 font-semibold">
                  I am participating as *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'traveller', label: 'Traveller / Creator' },
                    { key: 'host', label: 'Homestay Host' },
                    { key: 'seeker', label: 'Mountain Job Seeker' },
                    { key: 'employer', label: 'Mountain Employer' },
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: r.key as any })}
                      className={`py-2 px-3 text-xs font-mono rounded-sm border text-left transition-colors ${
                        formData.role === r.key
                          ? 'bg-[#0B1B3D] text-slate-200 border-[#2575fc] font-bold'
                          : 'bg-white text-[#0F172A] border-slate-200 hover:border-[#2575fc]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Tshering Norbu"
                  className="w-full bg-white border border-slate-200 px-3 py-2 text-base sm:text-xs text-[#0F172A] rounded-sm focus:outline-none focus:border-[#2575fc]"
                />
                {errors.fullName && (
                  <p className="text-[10px] text-[#f96933] mt-1 font-mono flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. name@domain.com"
                    className="w-full bg-white border border-slate-200 px-3 py-2 text-base sm:text-xs text-[#0F172A] rounded-sm focus:outline-none focus:border-[#2575fc]"
                  />
                  {errors.email && (
                    <p className="text-[10px] text-[#f96933] mt-1 font-mono flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98320 00000"
                    className="w-full bg-white border border-slate-200 px-3 py-2 text-base sm:text-xs text-[#0F172A] rounded-sm focus:outline-none focus:border-[#2575fc]"
                  />
                  {errors.phone && (
                    <p className="text-[10px] text-[#f96933] mt-1 font-mono flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1">
                  Primary Region of Engagement *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full bg-white border border-slate-200 px-3 py-2 text-base sm:text-xs text-[#0F172A] rounded-sm focus:outline-none focus:border-[#2575fc]"
                >
                  <option value="Darjeeling & Kurseong Tea Hills">Darjeeling & Kurseong Tea Hills</option>
                  <option value="Kalimpong Orchid Ridge">Kalimpong Orchid Ridge</option>
                  <option value="West & North Sikkim Organic Valleys">West & North Sikkim Organic Valleys</option>
                  <option value="Dooars Foothills & Sal Forests">Dooars Foothills & Sal Forests</option>
                  <option value="All Eastern Himalayas">All Eastern Himalayas</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-600 mb-1">
                  Your Intention or Introduction *
                </label>
                <textarea
                  rows={3}
                  value={formData.intent}
                  onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                  placeholder={`Share what brings you to ${BRAND_CONFIG.name} (e.g. looking for a quiet month-long writing stay, wanting to host travellers, seeking an alpine guide role)...`}
                  className="w-full bg-white border border-slate-200 px-3 py-2 text-base sm:text-xs text-[#0F172A] rounded-sm focus:outline-none focus:border-[#2575fc]"
                />
                {errors.intent && (
                  <p className="text-[10px] text-[#f96933] mt-1 font-mono flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.intent}
                  </p>
                )}
              </div>

              {/* Critical Anti-Fraud & Verification Advisory */}
              <div className="p-3 bg-amber-500/10 border border-amber-600/30 rounded-sm text-xs text-amber-950 font-sans">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-amber-950 flex items-center gap-1.5">
                      <span>Trust & Safety Warning • Fraud se bachein</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed font-light">
                      Never share sensitive <strong>OTPs, bank account credentials, advance token money, or personal identity documents</strong> (Aadhaar, Passport, PAN) without independent in-person or official live verification. Mountain fellowship enrollment is strictly free.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Policy & Community Charter Agreement */}
              <div className="p-2.5 bg-white border border-slate-200 rounded-sm">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToPrivacy}
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                    required
                    className="mt-0.5 w-3.5 h-3.5 rounded border-stone-400 text-[#0F172A] focus:ring-[#123D2D] cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    I have read and agree to the{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="text-[#0F172A] font-semibold underline hover:text-black"
                    >
                      Privacy Policy & Community Charter
                    </button>
                    .
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3.5 px-6 text-xs sm:text-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7DD3FC]" />
                    <span>Enrolling in Fellowship...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Fellowship Enrollment</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#7DD3FC]" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
