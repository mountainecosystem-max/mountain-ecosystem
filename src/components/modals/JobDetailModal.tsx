import { useState } from 'react'
import type { FC, FormEvent, ChangeEvent } from 'react'
import type { Job } from '../../types'
import {
  X,
  MapPin,
  Briefcase,
  Home,
  CheckCircle2,
  Check,
  ArrowRight,
  AlertCircle,
  Leaf,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Upload
} from 'lucide-react'
import { z } from 'zod'
import { submitJobApplication, uploadApplicantResume } from '../../services/ecosystemService'
import { isSafeDocumentFile } from '../../utils/imagePrivacy'

interface JobDetailModalProps {
  job: Job | null
  onClose: () => void
  onOpenPrivacy?: () => void
}

// Zod schema for job application
const applicationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  note: z.string().min(15, 'Please share a brief note on why this mountain role resonates with you (min 15 chars)'),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

export const JobDetailModal: FC<JobDetailModalProps> = ({ job, onClose, onOpenPrivacy }) => {
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    phone: '',
    note: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!job) return null

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setResumeError(null)

    if (!isSafeDocumentFile(file)) {
      setResumeError('Please upload a valid document (PDF, DOC, DOCX, or TXT). Executables and scripts are strictly blocked.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError('Resume file size must be under 5 MB.')
      return
    }

    setResumeFile(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const result = applicationSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ApplicationFormData, string>> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ApplicationFormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    if (!agreedToPrivacy) {
      setErrors((prev) => ({
        ...prev,
        note: 'Please check and agree to the Privacy Policy before transmitting your application.'
      }))
      return
    }

    setErrors({})
    setIsSubmitting(true)

    let resumeStoragePath: string | undefined = undefined
    if (resumeFile) {
      const uploadRes = await uploadApplicantResume(resumeFile)
      if (uploadRes.storagePath) {
        resumeStoragePath = uploadRes.storagePath
      }
    }

    await submitJobApplication({
      jobId: job.id,
      ...formData,
      resumeFileName: resumeFile?.name,
      resumeStoragePath
    })
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0A241A]/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#F8F6F0] border border-[#CBDAC4] rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#F8F6F0] border-b border-[#CBDAC4] px-6 sm:px-8 py-5 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#285A40] font-bold">
              <Leaf className="w-3.5 h-3.5 text-[#285A40]" />
              <span>ROLE SPECIFICATION</span>
            </div>
            <div className="text-xs text-[#576159] font-mono mt-0.5">
              Ref ID: {job.id.toUpperCase()} • Posted {job.postedDate}
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-[#576159] hover:text-[#123D2D] hover:bg-[#E8EFE3] rounded-sm transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-[#123D2D]">{job.employer}</span>
              {job.employerBadge && (
                <span className="text-[10px] font-mono uppercase text-[#285A40] bg-[#E8EFE3] px-2 py-0.5 rounded-sm border border-[#CBDAC4]">
                  {job.employerBadge}
                </span>
              )}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#123D2D] font-normal leading-tight">
              {job.title}
            </h2>

            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-[#CBDAC4]">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#123D2D] bg-[#E8EFE3] border border-[#CBDAC4] px-3 py-1 rounded-sm">
                <MapPin className="w-3.5 h-3.5 text-[#285A40]" />
                {job.location}
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#576159] bg-[#FAF8F3] border border-[#CBDAC4] px-3 py-1 rounded-sm">
                <Briefcase className="w-3.5 h-3.5 text-[#285A40]" />
                {job.type}
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#123D2D] font-bold bg-[#285A40]/15 border border-[#285A40]/30 px-3 py-1 rounded-sm">
                {job.salary}
              </span>

              {job.housingIncluded && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#285A40] bg-[#E8EFE3] border border-[#CBDAC4] px-3 py-1 rounded-sm font-medium">
                  <Home className="w-3.5 h-3.5" />
                  Estate Housing & Organic Meals Included
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#123D2D] font-bold mb-2">
              The Mission & Setting
            </h3>
            <p className="text-sm text-[#576159] leading-relaxed font-light">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#123D2D] font-bold mb-3">
              Core Responsibilities
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#576159] font-light">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-[#285A40] font-mono font-bold">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#123D2D] font-bold mb-3">
              Qualifications & Temperament
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#576159] font-light">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#285A40] flex-shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-[#E8EFE3]/60 p-4 sm:p-5 rounded-sm border border-[#CBDAC4]">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#123D2D] font-bold mb-2">
              Living Accommodations & Stewardship Perks
            </h3>
            <ul className="space-y-2 text-xs text-[#123D2D] font-mono">
              {job.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#285A40] flex-shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Application Form (Validated with Zod) */}
          <div className="pt-6 border-t border-[#CBDAC4]">
            {submitted ? (
              <div className="bg-[#E8EFE3] border border-[#285A40]/40 p-6 rounded-sm text-center">
                <CheckCircle2 className="w-8 h-8 text-[#285A40] mx-auto mb-2" />
                <h4 className="font-serif text-xl text-[#123D2D] font-medium">
                  Application Dispatched
                </h4>
                <p className="text-xs text-[#576159] font-mono mt-1">
                  Your details and motivation have been forwarded directly to the hiring steward at {job.employer}. You will receive a response within 48 hours.
                </p>
                <button
                  onClick={onClose}
                  type="button"
                  className="mt-4 px-4 py-2 bg-[#123D2D] text-[#E8EFE3] text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-[#0A241A]"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-[#123D2D] font-medium">
                    Apply for this Mountain Opportunity
                  </h3>
                  <span className="text-[10px] font-mono text-[#285A40] font-bold">
                    Direct • Zero Middleman Fees
                  </span>
                </div>

                {/* Fraud & Security Advisory */}
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-sm text-xs text-amber-950 font-sans leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <strong className="font-semibold block font-mono text-[10px] uppercase tracking-wider text-amber-950">
                        Zero-Fee Policy • Fraud se bachein:
                      </strong>
                      <p className="text-[11px] text-amber-900 leading-relaxed font-light">
                        Never share sensitive <strong>OTPs, bank account credentials, advance recruitment fees, or personal identity documents</strong> (Aadhaar, Passport, PAN) without verified employment contracts. Mountain jobs never ask for application fees or equipment charges.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Tshering Lepcha"
                      className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                    />
                    {errors.fullName && (
                      <p className="text-[10px] text-[#C47755] mt-1 flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@domain.com"
                      className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-[#C47755] mt-1 flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98320 00000"
                    className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                  />
                  {errors.phone && (
                    <p className="text-[10px] text-[#C47755] mt-1 flex items-center gap-1 font-mono">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1">
                    Why does this mountain role resonate with your path? *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    placeholder="Briefly describe your relevant background, mountain readiness, or creative goals..."
                    className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                  />
                  {errors.note && (
                    <p className="text-[10px] text-[#C47755] mt-1 flex items-center gap-1 font-mono">
                      <AlertCircle className="w-3 h-3" />
                      {errors.note}
                    </p>
                  )}
                </div>

                {/* Optional Resume / Bio Document Attachment */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1">
                    Attach CV / Resume / Bio (Optional)
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white border border-[#CBDAC4] rounded-sm cursor-pointer hover:border-[#285A40] transition">
                    <Upload className="w-4 h-4 text-[#285A40] shrink-0" />
                    <div className="flex-1 truncate text-xs">
                      {resumeFile ? (
                        <span className="font-semibold text-[#123D2D] truncate block">
                          📄 {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)
                        </span>
                      ) : (
                        <span className="text-[#576159]">
                          Click to select PDF, DOCX or TXT (Max 5MB)
                        </span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {resumeError && (
                    <p className="text-[10px] text-[#C47755] mt-1 font-mono">{resumeError}</p>
                  )}
                  <p className="text-[10px] text-[#576159] font-mono mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#285A40]" />
                    <span>Private & Encrypted • Resumes are kept in a protected private bucket and never indexed publicly.</span>
                  </p>
                </div>

                {/* DPDP Section 6 Candidate Protection & Privacy Agreement */}
                <div className="p-2.5 bg-[#FAF8F3] border border-[#CBDAC4] rounded-sm">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedToPrivacy}
                      onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                      required
                      className="mt-0.5 w-3.5 h-3.5 rounded border-stone-400 text-[#123D2D] focus:ring-[#123D2D] cursor-pointer"
                    />
                    <span className="text-[11px] text-[#576159] leading-relaxed font-sans">
                      Under DPDP Act 2023, I consent to the collection and transmission of my contact info & CV solely to <strong>{job.employer}</strong> for evaluating this role. I have reviewed the{' '}
                      <button
                        type="button"
                        onClick={onOpenPrivacy}
                        className="text-[#123D2D] font-semibold underline hover:text-black"
                      >
                        Privacy Policy
                      </button>.
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
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#91A77B]" />
                      <span>Transmitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application to {job.employer}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#91A77B]" />
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
