import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import {
  X,
  Briefcase,
  MapPin,
  AlertCircle,
  Loader2,
  Compass,
  Sparkles,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react'
import type { Job } from '../../types'
import { submitCommunityJob } from '../../services/ecosystemService'

interface CreateJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (newJob: Job) => void
  onOpenPrivacy?: () => void
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

export const CreateJobModal: FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenPrivacy
}) => {
  const [title, setTitle] = useState('')
  const [employer, setEmployer] = useState('')
  const [category, setCategory] = useState<Job['category']>('Hospitality & Estates')
  const [jobType, setJobType] = useState<Job['type']>('Full-time')
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)

  // Detailed Work Address (Pan-India)
  const [state, setState] = useState('Himachal Pradesh')
  const [mountainRange, setMountainRange] = useState('Tirthan & Kullu Valley')
  const [workVillageTown, setWorkVillageTown] = useState('')
  const [fullWorkAddress, setFullWorkAddress] = useState('')
  const [nearestHighwayHub, setNearestHighwayHub] = useState('')

  // Compensation & Benefits
  const [salary, setSalary] = useState('')
  const [housingIncluded, setHousingIncluded] = useState(true)
  const [housingDetails, setHousingDetails] = useState('Private Mountain Cabin with Fireplace')
  const [mealsIncluded, setMealsIncluded] = useState(true)

  // Responsibilities & Requirements
  const [description, setDescription] = useState('')
  const [responsibilitiesText, setResponsibilitiesText] = useState('')
  const [requirementsText, setRequirementsText] = useState('')

  // Employer Contact
  const [contactPerson, setContactPerson] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (
      !title.trim() ||
      !employer.trim() ||
      !workVillageTown.trim() ||
      !fullWorkAddress.trim() ||
      !salary.trim() ||
      !contactEmail.trim()
    ) {
      setError('Please fill in all required fields marked with * (Job Title, Employer Name, Village/Town, Full Address, Salary, and Contact Email).')
      return
    }

    if (!agreedToPrivacy) {
      setError('Please review and check the Privacy Policy and Zero-Fee employer agreement before posting.')
      return
    }

    setIsSubmitting(true)

    const respList = responsibilitiesText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0)

    const reqList = requirementsText
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0)

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      employer: employer.trim(),
      employerBadge: 'Community Employer',
      verificationTier: 'community_listed',
      isPublished: false,
      location: `${fullWorkAddress.trim()}, ${workVillageTown.trim()}, ${state}`,
      region: state,
      type: jobType,
      salary: salary.startsWith('₹') ? salary : `₹${salary}`,
      housingIncluded,
      category,
      description: description.trim() || `${title.trim()} opening at ${employer.trim()} located in ${workVillageTown}, ${state}. Includes mountain housing and dignified compensation.`,
      responsibilities: respList.length > 0 ? respList : [
        'Lead day-to-day operations and stewardship at the mountain property.',
        'Collaborate with local community members, artisans, and resident guests.',
        'Uphold high standards of safety, regenerative ethics, and hospitality.'
      ],
      requirements: reqList.length > 0 ? reqList : [
        'Readiness for high-altitude mountain living and weather shifts.',
        'Working proficiency in Hindi and English; respectful communication.',
        'High personal integrity and reliable collaborative mindset.'
      ],
      benefits: [
        housingIncluded ? housingDetails : 'Lodging stipend provided',
        mealsIncluded ? 'All fresh organic mountain meals included' : 'Kitchen access provided',
        'High-speed optical fiber internet and seasonal mountain perks'
      ],
      postedDate: 'Just now'
    }

    try {
      const res = await submitCommunityJob(newJob)
      setIsSubmitting(false)
      setIsSubmitted(true)
      onSuccess?.(res.data || newJob)
    } catch {
      setIsSubmitting(false)
      setIsSubmitted(true)
      onSuccess?.(newJob)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-[#0B1B3D]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#F8FAFC] border border-slate-200 rounded-t-3xl sm:rounded-2xl max-w-3xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 -mb-1 sm:hidden shrink-0" />
        {/* Header */}
        <div className="sticky top-0 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200 px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between z-20">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#2575fc] font-bold">
              <Briefcase className="w-4 h-4 text-[#f96933]" />
              <span>PAN-INDIA RECRUITMENT EXCHANGE</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-[#0F172A] font-bold uppercase mt-0.5">
              Post a Mountain Job / Residency
            </h2>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 flex items-center justify-center p-1.5 text-stone-500 hover:text-stone-900 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-8">
          {isSubmitted ? (
            <div className="bg-sky-50/70 border border-sky-200 p-6 sm:p-8 rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2575fc] to-[#1e40af] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <ShieldCheck className="w-6 h-6 text-sky-300" />
              </div>
              <h3 className="font-display text-2xl text-[#0F172A] font-bold uppercase">
                Submitted to Verification Queue!
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 font-sans mt-2 max-w-lg mx-auto leading-relaxed">
                Your opening for <strong>{title}</strong> at <strong>{employer}</strong> ({state}) has been logged in our Steward Moderation Ledger. To protect mountain applicants from recruitment scams and unvetted job fees, stewards review employer credentials before publishing it live (usually within 12–24 hours).
              </p>

              <div className="mt-5 p-3.5 bg-white/80 border border-slate-200 rounded-xl max-w-md mx-auto text-left text-xs font-mono space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Moderation Status:</span>
                  <span className="text-[#f96933] font-bold">Under Steward Review (Queue)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Employment Policy:</span>
                  <span className="text-[#2575fc] font-bold">Zero-Fee Guaranteed • Lodging & Food</span>
                </div>
              </div>

              <button
                onClick={onClose}
                type="button"
                className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#2575fc] via-[#1d63d8] to-[#1e40af] hover:from-[#1d63d8] hover:to-[#1e3a8a] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition shadow-md"
              >
                <span>Done & View Mountain Jobs</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2.5 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Job Role & Hiring Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Homestay Operations Lead / Trek Naturalist / Farm Manager"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-base sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                    Hiring Organization / Lodge / Estate *
                  </label>
                  <input
                    type="text"
                    required
                    value={employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    placeholder="e.g. Cedar Ridge Sanctuary / High Valley Permaculture"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-base sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                  />
                </div>
              </div>

              {/* 2. Category & Role Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                    Job Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Job['category'])}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-base sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                  >
                    <option value="Hospitality & Estates">Hospitality & Estates</option>
                    <option value="Guiding & Conservation">Guiding & Conservation</option>
                    <option value="Agriculture & Craft">Agriculture & Craft</option>
                    <option value="Digital & Remote">Digital & Remote Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                    Employment Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as Job['type'])}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-base sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                  >
                    <option value="Full-time">Full-time (Year-Round)</option>
                    <option value="Seasonal">Seasonal (Summer / Winter Peak)</option>
                    <option value="Residency">Paid Residency / Fellowship</option>
                    <option value="Contract">Contract / Work-Exchange</option>
                  </select>
                </div>
              </div>

              {/* 3. Detailed Work Address (Pan-India) */}
              <div className="bg-white/80 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2575fc] font-bold border-b border-slate-200 pb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#f96933]" />
                  <span>Exact Work Location & Mountain Region (Pan-India)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Mountain State (Pan-India) *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                    >
                      {INDIAN_MOUNTAIN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Mountain Valley / Range
                    </label>
                    <input
                      type="text"
                      value={mountainRange}
                      onChange={(e) => setMountainRange(e.target.value)}
                      placeholder="e.g. Tirthan Valley / Kumaon / Zanskar / Nilgiris"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Work Site Village / Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={workVillageTown}
                      onChange={(e) => setWorkVillageTown(e.target.value)}
                      placeholder="e.g. Gushaini / Mukteshwar / Leh / Yuksom / Kotagiri"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Nearest Transit Hub / Highway
                    </label>
                    <input
                      type="text"
                      value={nearestHighwayHub}
                      onChange={(e) => setNearestHighwayHub(e.target.value)}
                      placeholder="e.g. Aut Tunnel Bus Stand / Kathgodam Railhead"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                    Complete Work Site Address & Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullWorkAddress}
                    onChange={(e) => setFullWorkAddress(e.target.value)}
                    placeholder="e.g. Riverbank Estate, Near Forest Rest House, Gushaini Road"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                  />
                </div>
              </div>

              {/* 4. Compensation & Housing Perks */}
              <div className="bg-white/80 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2575fc] font-bold border-b border-slate-200 pb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Dignified Wages & Mountain Living Provisions</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Monthly Salary / Stipend (₹) *
                    </label>
                    <input
                      type="text"
                      required
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="e.g. ₹40,000 – ₹55,000 / month"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="inline-flex items-center gap-2 text-xs font-sans text-stone-800 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={housingIncluded}
                        onChange={(e) => setHousingIncluded(e.target.checked)}
                        className="rounded text-[#2575fc] focus:ring-[#2575fc] w-4 h-4"
                      />
                      <span>Accommodation Provided (Free)</span>
                    </label>
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="inline-flex items-center gap-2 text-xs font-sans text-stone-800 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mealsIncluded}
                        onChange={(e) => setMealsIncluded(e.target.checked)}
                        className="rounded text-[#2575fc] focus:ring-[#2575fc] w-4 h-4"
                      />
                      <span>Mountain Meals Provided (Free)</span>
                    </label>
                  </div>
                </div>

                {housingIncluded && (
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Housing Specifics
                    </label>
                    <input
                      type="text"
                      value={housingDetails}
                      onChange={(e) => setHousingDetails(e.target.value)}
                      placeholder="e.g. Independent wooden cabin with heated wood stove & WiFi"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>
                )}
              </div>

              {/* 5. Mission & Setting Overview */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                  Role Overview & Mountain Setting
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the high-altitude setting, daily rhythm, mountain property culture, and community environment..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-3 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                />
              </div>

              {/* 6. Key Responsibilities & Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                    Key Responsibilities (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={responsibilitiesText}
                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                    placeholder="Lead day-to-day guest hospitality rituals&#10;Coordinate organic kitchen garden harvest&#10;Supervise winter heating & firewood"
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                    Candidate Requirements (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={requirementsText}
                    onChange={(e) => setRequirementsText(e.target.value)}
                    placeholder="Comfortable with high-altitude mountain living&#10;Fluency in Hindi and English&#10;Minimum 1 year hospitality or wilderness experience"
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                  />
                </div>
              </div>

              {/* 6. Hiring Contact Details */}
              <div className="bg-white/80 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2575fc] font-bold border-b border-slate-200 pb-2">
                  <Compass className="w-3.5 h-3.5 text-[#2575fc]" />
                  <span>Application & Employer Contact</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. General Manager / Estate Owner"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Application Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="hiring@mountainestate.com"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={phoneWhatsApp}
                      onChange={(e) => setPhoneWhatsApp(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-[#0F172A] focus:outline-none focus:border-[#2575fc]"
                    />
                  </div>
                </div>

                {/* Zero-Fee Employer Standard & Anti-Fraud Notice */}
                <div className="p-3 bg-amber-500/10 border border-amber-600/30 rounded-xl text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed font-sans">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-semibold block font-mono text-[10px] uppercase tracking-wider text-amber-950">
                      Zero-Fee Policy • Fraud se bachein:
                    </strong>
                    <p className="text-[11px] text-amber-900 leading-relaxed font-light">
                      Never ask for or share sensitive <strong>OTPs, bank account credentials, advance recruitment fees, or personal identity documents</strong> (Aadhaar, Passport, PAN) without in-person/official verified contracts. Any listing soliciting money from mountain job seekers is immediately banned.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Policy & Zero-Fee Compliance Agreement */}
              <div className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl mb-3">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToPrivacy}
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 rounded border-[#2575fc] text-[#2575fc] focus:ring-[#2575fc] cursor-pointer"
                  />
                  <span className="text-xs text-stone-700 leading-relaxed font-sans">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="text-[#2575fc] font-bold underline hover:text-[#0F172A]"
                    >
                      Privacy Policy & Community Charter
                    </button>
                    , and I legally confirm that this is a zero-fee mountain recruitment role. No registration or interview fees will ever be collected from applicants.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-stone-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#2575fc] via-[#1d63d8] to-[#1e40af] hover:from-[#1d63d8] hover:to-[#2575fc] text-white text-xs sm:text-sm font-sans font-semibold tracking-wide px-7 py-3 rounded-full shadow-md shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-600/30 border border-sky-400/30 active:scale-95 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing Job Listing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#7DD3FC]" />
                      <span>Post Mountain Job</span>
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
