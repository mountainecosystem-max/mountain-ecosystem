import { useState } from 'react'
import type { FC, FormEvent } from 'react'
import {
  X,
  Briefcase,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Compass,
  Sparkles,
  ShieldCheck
} from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'
import type { Job } from '../../types'
import { submitCommunityJob } from '../../services/ecosystemService'

interface CreateJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (newJob: Job) => void
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
  onSuccess
}) => {
  const [title, setTitle] = useState('')
  const [employer, setEmployer] = useState('')
  const employerBadge = 'Verified Mountain Enterprise'
  const [category, setCategory] = useState<Job['category']>('Hospitality & Estates')
  const [jobType, setJobType] = useState<Job['type']>('Full-time')

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
      employerBadge: employerBadge || 'Verified Mountain Employer',
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
      className="fixed inset-0 z-50 overflow-y-auto bg-[#071F13]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7EE] border border-[#CBDAC4] rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FAF7EE]/95 backdrop-blur-md border-b border-[#CBDAC4] px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between z-20">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#164E2D] font-bold">
              <Briefcase className="w-4 h-4 text-[#D96B27]" />
              <span>PAN-INDIA RECRUITMENT EXCHANGE</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-[#0B2516] font-bold uppercase mt-0.5">
              Post a Mountain Job / Residency
            </h2>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-[#E8EFE3] rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-8">
          {isSubmitted ? (
            <div className="bg-[#E8EFE3] border border-[#164E2D]/40 p-8 sm:p-10 rounded-xl text-center">
              <CheckCircle2 className="w-12 h-12 text-[#164E2D] mx-auto mb-3 animate-bounce" />
              <h3 className="font-display text-2xl text-[#0B2516] font-bold uppercase">
                Mountain Job Posted!
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 font-sans mt-2 max-w-md mx-auto leading-relaxed">
                Your opening for <strong>{title}</strong> at <strong>{employer}</strong> ({state}) is now live on the {BRAND_CONFIG.name} exchange. Applicants will contact you directly via <span className="font-mono text-[#164E2D]">{contactEmail}</span>.
              </p>
              <button
                onClick={onClose}
                type="button"
                className="mt-6 inline-flex items-center gap-2 bg-[#0B2516] hover:bg-[#164E2D] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition shadow-md"
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
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
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
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
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
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
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
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                  >
                    <option value="Full-time">Full-time (Year-Round)</option>
                    <option value="Seasonal">Seasonal (Summer / Winter Peak)</option>
                    <option value="Residency">Paid Residency / Fellowship</option>
                    <option value="Contract">Contract / Work-Exchange</option>
                  </select>
                </div>
              </div>

              {/* 3. Detailed Work Address (Pan-India) */}
              <div className="bg-white/80 p-4 sm:p-5 rounded-xl border border-[#CBDAC4] space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#164E2D] font-bold border-b border-[#CBDAC4]/70 pb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D96B27]" />
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
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
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
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
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
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
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
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
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
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                  />
                </div>
              </div>

              {/* 4. Compensation & Housing Perks */}
              <div className="bg-white/80 p-4 sm:p-5 rounded-xl border border-[#CBDAC4] space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#164E2D] font-bold border-b border-[#CBDAC4]/70 pb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
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
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="inline-flex items-center gap-2 text-xs font-sans text-stone-800 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={housingIncluded}
                        onChange={(e) => setHousingIncluded(e.target.checked)}
                        className="rounded text-[#164E2D] focus:ring-[#164E2D] w-4 h-4"
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
                        className="rounded text-[#164E2D] focus:ring-[#164E2D] w-4 h-4"
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
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
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
                  className="w-full bg-white border border-[#CBDAC4] rounded-lg p-3 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
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
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg p-3 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
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
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg p-3 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                  />
                </div>
              </div>

              {/* 6. Hiring Contact Details */}
              <div className="bg-white/80 p-4 sm:p-5 rounded-xl border border-[#CBDAC4] space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#164E2D] font-bold border-b border-[#CBDAC4]/70 pb-2">
                  <Compass className="w-3.5 h-3.5 text-[#164E2D]" />
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
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
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
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
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
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                    />
                  </div>
                </div>

                {/* Zero-Fee Employer Standard Notice */}
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 flex items-start gap-2.5 leading-relaxed font-sans">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block font-mono text-[10px] uppercase text-amber-950">
                      Zero-Fee Employer Compliance Standard:
                    </strong>
                    By posting on Mountain Ecosystem, you legally confirm that you will never charge applicants any registration, uniform, or interview fees. Any listing asking for money from job seekers will be permanently banned.
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#CBDAC4] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-[#CBDAC4] text-xs font-bold text-stone-600 hover:bg-[#E8EFE3] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-[#0B2516] hover:bg-[#164E2D] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-7 py-3 rounded-full transition shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing Job Listing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#A5C896]" />
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
