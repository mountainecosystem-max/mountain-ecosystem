import { useState, useEffect } from 'react'
import type { FC, FormEvent } from 'react'
import {
  X,
  Briefcase,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Check,
  Building,
  MapPin,
  Sparkles
} from 'lucide-react'
import type { AdminJob } from '../../../types'
import {
  createAdminJob,
  updateAdminJob,
  type CreateJobInput
} from '../../../services/adminJobService'

interface JobFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (job: AdminJob, isEdit: boolean) => void
  editingJob?: AdminJob | null
}

const REGION_PRESETS = [
  'Sikkim',
  'Darjeeling',
  'Kalimpong',
  'Arunachal Pradesh',
  'Himachal Pradesh',
  'Uttarakhand'
]

const CATEGORY_OPTIONS: AdminJob['category'][] = [
  'Hospitality & Estates',
  'Guiding & Conservation',
  'Agriculture & Craft',
  'Digital & Remote'
]

const TYPE_OPTIONS: AdminJob['type'][] = [
  'Full-time',
  'Seasonal',
  'Residency',
  'Contract'
]

// Preset templates for quick testing
const QUICK_TEMPLATES: Array<{
  name: string
  data: Partial<CreateJobInput>
}> = [
  {
    name: 'Estate Tea Residency',
    data: {
      title: 'Biodynamic Tea Estate Resident & Curator',
      employer: 'Temi Heritage Highlands Cooperative',
      employerBadge: 'Single-Estate Certified',
      location: 'Temi Tarku, South Sikkim',
      region: 'Sikkim',
      type: 'Residency',
      category: 'Hospitality & Estates',
      salary: '₹32,000 – ₹42,000 / mo + Private Cedar Cottage',
      housingIncluded: true,
      description:
        'Oversee heritage tasting ceremonies, catalog estate botanical varietals, and curate quiet residential retreats for traveling botanists and writers.',
      responsibilities: [
        'Curate daily estate harvest tea tastings for visiting residents',
        'Maintain micro-climate temperature and humidity logs for orthodox oxidation rooms',
        'Host weekly botanical walks through historic clonal tea sections'
      ],
      requirements: [
        'Demonstrated passion for botanical cultivation or orthodox tea processing',
        'Comfort living in a tranquil, high-altitude estate community',
        'Strong writing and oral storytelling abilities'
      ],
      benefits: [
        'Private stone-and-cedar resident cottage with wood-burning fireplace',
        'Unlimited organic estate meals sourced from kitchen gardens',
        'Monthly seasonal harvest stipend and travel reimbursement'
      ]
    }
  },
  {
    name: 'Alpine Trail Steward',
    data: {
      title: 'High-Altitude Ridge Guide & Wildlife Steward',
      employer: 'Khangchendzonga Mountain Syndicate',
      employerBadge: 'Protected Biosphere Partner',
      location: 'Yuksom to Dzongri Ridge',
      region: 'Sikkim',
      type: 'Seasonal',
      category: 'Guiding & Conservation',
      salary: '₹40,000 – ₹55,000 / expedition cycle',
      housingIncluded: true,
      description:
        'Lead low-impact wilderness expeditions along historic yak routes, monitor rhododendron bloom cycles, and maintain trail safety markers.',
      responsibilities: [
        'Guide small private fellowships (max 6 travelers) along sub-alpine passes',
        'Record wildlife sightings (red panda, blood pheasant) for forest ledger',
        'Conduct trail sanitation and enforce zero-single-use-plastic regulations'
      ],
      requirements: [
        'Certified Wilderness First Responder (WFR) or IMF certification',
        'Fluency in Nepali or Hindi and English',
        'Deep navigational knowledge of Singalila or Khangchendzonga trails'
      ],
      benefits: [
        'Full high-altitude gear allowance and sleeping bivouac kits',
        'Syndicate mountain rescue insurance',
        'End-of-season mountain steward bonus'
      ]
    }
  }
]

export const JobFormModal: FC<JobFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingJob
}) => {
  const isEdit = Boolean(editingJob)

  const [title, setTitle] = useState('')
  const [employer, setEmployer] = useState('')
  const [employerBadge, setEmployerBadge] = useState('')
  const [location, setLocation] = useState('')
  const [region, setRegion] = useState('Sikkim')
  const [type, setType] = useState<AdminJob['type']>('Residency')
  const [category, setCategory] = useState<AdminJob['category']>('Hospitality & Estates')
  const [salary, setSalary] = useState('')
  const [housingIncluded, setHousingIncluded] = useState(true)
  const [description, setDescription] = useState('')
  const [responsibilities, setResponsibilities] = useState<string[]>([])
  const [newResp, setNewResp] = useState('')
  const [requirements, setRequirements] = useState<string[]>([])
  const [newReq, setNewReq] = useState('')
  const [benefits, setBenefits] = useState<string[]>([])
  const [newBenefit, setNewBenefit] = useState('')
  const [isPublished, setIsPublished] = useState(true)

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate state on open / edit change
  useEffect(() => {
    if (editingJob) {
      setTitle(editingJob.title)
      setEmployer(editingJob.employer)
      setEmployerBadge(editingJob.employerBadge || '')
      setLocation(editingJob.location)
      setRegion(editingJob.region)
      setType(editingJob.type)
      setCategory(editingJob.category)
      setSalary(editingJob.salary)
      setHousingIncluded(editingJob.housingIncluded)
      setDescription(editingJob.description)
      setResponsibilities(editingJob.responsibilities || [])
      setRequirements(editingJob.requirements || [])
      setBenefits(editingJob.benefits || [])
      setIsPublished(editingJob.isPublished)
    } else {
      // Defaults for create
      setTitle('')
      setEmployer('')
      setEmployerBadge('')
      setLocation('')
      setRegion('Sikkim')
      setType('Residency')
      setCategory('Hospitality & Estates')
      setSalary('₹30,000 – ₹45,000 / mo')
      setHousingIncluded(true)
      setDescription('')
      setResponsibilities([])
      setRequirements([])
      setBenefits([])
      setIsPublished(true)
    }
    setError(null)
    setNewResp('')
    setNewReq('')
    setNewBenefit('')
  }, [editingJob, isOpen])

  if (!isOpen) return null

  const applyTemplate = (template: typeof QUICK_TEMPLATES[number]) => {
    const d = template.data
    if (d.title) setTitle(d.title)
    if (d.employer) setEmployer(d.employer)
    if (d.employerBadge) setEmployerBadge(d.employerBadge)
    if (d.location) setLocation(d.location)
    if (d.region) setRegion(d.region)
    if (d.type) setType(d.type)
    if (d.category) setCategory(d.category)
    if (d.salary) setSalary(d.salary)
    if (d.housingIncluded !== undefined) setHousingIncluded(d.housingIncluded)
    if (d.description) setDescription(d.description)
    if (d.responsibilities) setResponsibilities(d.responsibilities)
    if (d.requirements) setRequirements(d.requirements)
    if (d.benefits) setBenefits(d.benefits)
  }

  // Add list item helpers
  const handleAddResp = () => {
    if (!newResp.trim()) return
    setResponsibilities((prev) => [...prev, newResp.trim()])
    setNewResp('')
  }
  const handleRemoveResp = (idx: number) => {
    setResponsibilities((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddReq = () => {
    if (!newReq.trim()) return
    setRequirements((prev) => [...prev, newReq.trim()])
    setNewReq('')
  }
  const handleRemoveReq = (idx: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return
    setBenefits((prev) => [...prev, newBenefit.trim()])
    setNewBenefit('')
  }
  const handleRemoveBenefit = (idx: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !employer.trim() || !location.trim() || !salary.trim() || !description.trim()) {
      setError('Please fill in Title, Employer, Location, Salary, and Description.')
      return
    }

    setIsSubmitting(true)

    const payload: CreateJobInput = {
      title: title.trim(),
      employer: employer.trim(),
      employerBadge: employerBadge.trim() || undefined,
      location: location.trim(),
      region,
      type,
      category,
      salary: salary.trim(),
      housingIncluded,
      description: description.trim(),
      responsibilities,
      requirements,
      benefits,
      isPublished
    }

    try {
      if (isEdit && editingJob) {
        const res = await updateAdminJob(editingJob.id, payload)
        if (res.error) {
          setError(res.error)
        } else if (res.data) {
          onSuccess(res.data, true)
          onClose()
        }
      } else {
        const res = await createAdminJob(payload)
        if (res.error) {
          setError(res.error)
        } else if (res.data) {
          onSuccess(res.data, false)
          onClose()
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F5] border border-[#CBDAC4] text-[#123D2D] w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#CBDAC4] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#123D2D]/10 text-[#123D2D] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-normal text-[#123D2D]">
                {isEdit ? 'Edit Mountain Residency / Job' : 'Post New Mountain Residency'}
              </h2>
              <p className="text-[11px] font-mono text-[#576159] tracking-wider uppercase">
                {isEdit ? `ID: ${editingJob?.id}` : 'Verified valley openings & apprenticeships'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#576159] hover:text-[#123D2D] hover:bg-[#F3EFE6] rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {/* Quick presets (only in create mode) */}
          {!isEdit && (
            <div className="p-3.5 bg-[#F3EFE6] border border-[#CBDAC4] rounded-sm">
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#285A40] font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#285A40]" />
                <span>Quick Test Templates:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.name}
                    type="button"
                    onClick={() => applyTemplate(tmpl)}
                    className="text-xs font-mono px-3 py-1 bg-white border border-[#CBDAC4] text-[#123D2D] hover:bg-[#123D2D] hover:text-white rounded-sm transition-colors"
                  >
                    + {tmpl.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-300 rounded-sm flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form id="job-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Title & Employer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Residency / Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Alpine Botanical Curator"
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Employer / Syndicate *
                </label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-[#576159] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={employer}
                    onChange={(e) => setEmployer(e.target.value)}
                    placeholder="e.g. Temi Highlands Cooperative"
                    className="w-full bg-white border border-[#CBDAC4] pl-9 pr-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                  />
                </div>
              </div>
            </div>

            {/* Employer Badge & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Employer Trust Badge (Optional)
                </label>
                <input
                  type="text"
                  value={employerBadge}
                  onChange={(e) => setEmployerBadge(e.target.value)}
                  placeholder="e.g. Heritage Estate Partner, Certified Organic"
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Location / Valley *
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#576159] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Yuksom Ridge, 1,780m"
                    className="w-full bg-white border border-[#CBDAC4] pl-9 pr-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                  />
                </div>
              </div>
            </div>

            {/* Region, Type, Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Region *
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                >
                  {REGION_PRESETS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Tenure / Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AdminJob['type'])}
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AdminJob['category'])}
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Salary & Housing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Salary / Stipend *
                </label>
                <input
                  type="text"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. ₹35,000 – ₹45,000 / mo"
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                />
              </div>

              <div className="pt-5">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={housingIncluded}
                    onChange={(e) => setHousingIncluded(e.target.checked)}
                    className="w-4 h-4 rounded text-[#285A40] border-[#CBDAC4] focus:ring-[#285A40]"
                  />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#123D2D] font-bold">
                    Housing Included
                  </span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                Overview & Description *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the residency role, community living arrangements, seasonal context, and day-to-day rhythms..."
                className="w-full bg-white border border-[#CBDAC4] p-3 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
              />
            </div>

            {/* Responsibilities list editor */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                Core Responsibilities ({responsibilities.length})
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newResp}
                  onChange={(e) => setNewResp(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResp())}
                  placeholder="e.g. Lead daily morning harvest inspection..."
                  className="flex-1 bg-white border border-[#CBDAC4] px-3 py-1.5 text-xs text-[#123D2D] rounded-sm"
                />
                <button
                  type="button"
                  onClick={handleAddResp}
                  className="px-3 py-1.5 bg-[#123D2D] text-white hover:bg-[#285A40] text-xs font-mono rounded-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {responsibilities.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {responsibilities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-white border border-[#CBDAC4] text-xs rounded-sm"
                    >
                      <span>• {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResp(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Requirements list editor */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                Requirements & Experience ({requirements.length})
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddReq())}
                  placeholder="e.g. Wilderness First Responder certificate..."
                  className="flex-1 bg-white border border-[#CBDAC4] px-3 py-1.5 text-xs text-[#123D2D] rounded-sm"
                />
                <button
                  type="button"
                  onClick={handleAddReq}
                  className="px-3 py-1.5 bg-[#123D2D] text-white hover:bg-[#285A40] text-xs font-mono rounded-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {requirements.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {requirements.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-white border border-[#CBDAC4] text-xs rounded-sm"
                    >
                      <span>• {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveReq(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Benefits list editor */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                Benefits & Provisions ({benefits.length})
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                  placeholder="e.g. Free organic estate meals, resident cottage..."
                  className="flex-1 bg-white border border-[#CBDAC4] px-3 py-1.5 text-xs text-[#123D2D] rounded-sm"
                />
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="px-3 py-1.5 bg-[#123D2D] text-white hover:bg-[#285A40] text-xs font-mono rounded-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {benefits.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {benefits.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-white border border-[#CBDAC4] text-xs rounded-sm"
                    >
                      <span>• {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBenefit(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status toggle */}
            <div className="p-3 bg-white border border-[#CBDAC4] rounded-sm flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#123D2D]">
                  Listing Publication Status
                </div>
                <div className="text-[11px] text-[#576159]">
                  {isPublished
                    ? 'Live — Visible to job seekers on public homepage'
                    : 'Draft — Stored privately in Supabase database'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#D1D5DB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#285A40]"></div>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#CBDAC4] bg-white flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-[#CBDAC4] text-xs font-mono text-[#576159] hover:bg-[#F3EFE6] rounded-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="job-form"
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#123D2D] hover:bg-[#285A40] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Supabase...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEdit ? 'Update Residency' : 'Create Residency'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
