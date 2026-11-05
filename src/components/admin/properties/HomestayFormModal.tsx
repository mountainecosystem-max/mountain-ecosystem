import { useState, useEffect } from 'react'
import type { FC, FormEvent } from 'react'
import {
  X,
  Home,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Check,
  MapPin,
  Sparkles,
  Wifi,
  Users,
  Image as ImageIcon
} from 'lucide-react'
import type { AdminHomestay } from '../../../types'
import {
  createAdminHomestay,
  updateAdminHomestay,
  type CreateHomestayInput
} from '../../../services/adminHomestayService'

interface HomestayFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (homestay: AdminHomestay, isEdit: boolean) => void
  editingHomestay?: AdminHomestay | null
}

const REGION_PRESETS = [
  'Sikkim',
  'Darjeeling',
  'Kalimpong',
  'Arunachal Pradesh',
  'Himachal Pradesh',
  'Uttarakhand'
]

const LEASE_STATUS_OPTIONS = [
  'Available for Lease',
  'Reserved for Resident',
  'Under Negotiation',
  'Seasonal Hold'
]

const FURNISHING_OPTIONS = [
  'Furnished Stone & Cedar',
  'Handcrafted Pine & Wool',
  'Semi-Furnished Himalayan Wood',
  'Minimalist Timber Loft'
]

const PHOTO_PRESETS = [
  {
    name: 'Cedar Loft',
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Stone Cottage',
    url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Valley View Lodge',
    url: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80'
  }
]

const QUICK_TEMPLATES: Array<{
  name: string
  data: Partial<CreateHomestayInput>
}> = [
  {
    name: 'Chuchen Stone & Cedar Loft',
    data: {
      name: 'Chuchen Stone & Cedar Residency',
      region: 'Sikkim',
      location: 'Chuchen, West Sikkim',
      elevation: '1,820m',
      monthlyRate: '₹28,000 / month',
      securityDeposit: '₹20,000 refundable',
      minLeaseTerm: '3 months',
      leaseStatus: 'Available for Lease',
      furnishing: 'Furnished Stone & Cedar',
      hostName: 'Tenzing & Pema Lepcha',
      hostRole: '3rd-Gen Orchard Stewards',
      hostYears: 8,
      roomType: 'Entire 2-Bedroom Stone Cottage',
      wifi: '100 Mbps Starlink Backhaul',
      capacity: '2–3 Residents',
      images: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80'
      ],
      description:
        'Nestled against ancient rhododendron forest, this hand-dressed dry-stone cottage features cedar-lined interiors, a wood-burning Bukhari hearth, and unhindered sunrise views of Mount Pandim.',
      amenities: [
        'Wood-burning Bukhari Fireplace',
        'Dedicated ergonomic writing desk overlooking valley',
        'Filtered spring water plumbed directly from high glacier source',
        'Full kitchen with brass cookware and gas burner'
      ],
      features: [
        'Zero sound pollution — located at trailhead termination',
        'Direct access to organic cardamom permaculture terraces',
        'Daily morning milk and sourdough delivery optional'
      ],
      utilitiesIncluded: ['High-speed Starlink WiFi', 'Firewood supply (1 rick/month)', 'Fresh spring water']
    }
  },
  {
    name: 'Rinchenpong Orchard Sanctuary',
    data: {
      name: 'Rinchenpong Mandarin Orchard Lodge',
      region: 'Sikkim',
      location: 'Rinchenpong, West Sikkim',
      elevation: '1,700m',
      monthlyRate: '₹32,000 / month',
      securityDeposit: '₹25,000 refundable',
      minLeaseTerm: '6 months sabbatical',
      leaseStatus: 'Available for Lease',
      furnishing: 'Handcrafted Pine & Wool',
      hostName: 'Kunzang Norbu',
      hostRole: 'Monastery Elder & Botanist',
      hostYears: 12,
      roomType: 'Private 1-Bedroom Attic Suite',
      wifi: '60 Mbps Fiber Broadband',
      capacity: 'Solo Writer or Couple',
      images: [
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80'
      ],
      description:
        'Peaceful second-floor studio perched above historic 80-year-old heirloom mandarin groves. Walking distance to 17th-century monastery with extensive Buddhist library.',
      amenities: ['Monastery bell chimes', 'Solar hot water backup', 'Private wrap-around wooden balcony'],
      features: ['Silent meditation corner', 'Strict organic permaculture estate'],
      utilitiesIncluded: ['Electricity & Solar', 'Spring water', 'Broadband internet']
    }
  }
]

export const HomestayFormModal: FC<HomestayFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingHomestay
}) => {
  const isEdit = Boolean(editingHomestay)

  const [name, setName] = useState('')
  const [region, setRegion] = useState('Sikkim')
  const [location, setLocation] = useState('')
  const [elevation, setElevation] = useState('1,700m')
  const [monthlyRate, setMonthlyRate] = useState('₹28,000 / month')
  const [securityDeposit, setSecurityDeposit] = useState('₹20,000 refundable')
  const [minLeaseTerm, setMinLeaseTerm] = useState('3 months')
  const [leaseStatus, setLeaseStatus] = useState('Available for Lease')
  const [furnishing, setFurnishing] = useState('Furnished Stone & Cedar')
  const [hostName, setHostName] = useState('')
  const [hostRole, setHostRole] = useState('Local Host')
  const [hostYears, setHostYears] = useState(3)
  const [roomType, setRoomType] = useState('Entire 2-Bedroom Stone Cottage')
  const [wifi, setWifi] = useState('100 Mbps Starlink / Fiber')
  const [capacity, setCapacity] = useState('2 Residents')
  const [images, setImages] = useState<string[]>([])
  const [newImage, setNewImage] = useState('')
  const [description, setDescription] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])
  const [newAmenity, setNewAmenity] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [utilitiesIncluded, setUtilitiesIncluded] = useState<string[]>([])
  const [newUtility, setNewUtility] = useState('')
  const [isPublished, setIsPublished] = useState(true)

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingHomestay) {
      setName(editingHomestay.name)
      setRegion(editingHomestay.region)
      setLocation(editingHomestay.location)
      setElevation(editingHomestay.elevation)
      setMonthlyRate(editingHomestay.monthlyRate)
      setSecurityDeposit(editingHomestay.securityDeposit)
      setMinLeaseTerm(editingHomestay.minLeaseTerm)
      setLeaseStatus(editingHomestay.leaseStatus)
      setFurnishing(editingHomestay.furnishing)
      setHostName(editingHomestay.host.name)
      setHostRole(editingHomestay.host.role)
      setHostYears(editingHomestay.host.yearsHosting)
      setRoomType(editingHomestay.roomType)
      setWifi(editingHomestay.wifi)
      setCapacity(editingHomestay.capacity)
      setImages(editingHomestay.images || [])
      setDescription(editingHomestay.description)
      setAmenities(editingHomestay.amenities || [])
      setFeatures(editingHomestay.features || [])
      setUtilitiesIncluded(editingHomestay.utilitiesIncluded || [])
      setIsPublished(editingHomestay.isPublished)
    } else {
      setName('')
      setRegion('Sikkim')
      setLocation('')
      setElevation('1,700m')
      setMonthlyRate('₹28,000 / month')
      setSecurityDeposit('₹20,000')
      setMinLeaseTerm('3 months')
      setLeaseStatus('Available for Lease')
      setFurnishing('Furnished Stone & Cedar')
      setHostName('')
      setHostRole('Local Host')
      setHostYears(3)
      setRoomType('Entire Stone & Cedar Cottage')
      setWifi('100 Mbps Fiber')
      setCapacity('2 Residents')
      setImages([
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
      ])
      setDescription('')
      setAmenities([])
      setFeatures([])
      setUtilitiesIncluded([])
      setIsPublished(true)
    }
    setError(null)
    setNewImage('')
    setNewAmenity('')
    setNewFeature('')
    setNewUtility('')
  }, [editingHomestay, isOpen])

  if (!isOpen) return null

  const applyTemplate = (template: typeof QUICK_TEMPLATES[number]) => {
    const d = template.data
    if (d.name) setName(d.name)
    if (d.region) setRegion(d.region)
    if (d.location) setLocation(d.location)
    if (d.elevation) setElevation(d.elevation)
    if (d.monthlyRate) setMonthlyRate(d.monthlyRate)
    if (d.securityDeposit) setSecurityDeposit(d.securityDeposit)
    if (d.minLeaseTerm) setMinLeaseTerm(d.minLeaseTerm)
    if (d.leaseStatus) setLeaseStatus(d.leaseStatus)
    if (d.furnishing) setFurnishing(d.furnishing)
    if (d.hostName) setHostName(d.hostName)
    if (d.hostRole) setHostRole(d.hostRole)
    if (d.hostYears !== undefined) setHostYears(d.hostYears)
    if (d.roomType) setRoomType(d.roomType)
    if (d.wifi) setWifi(d.wifi)
    if (d.capacity) setCapacity(d.capacity)
    if (d.images) setImages(d.images)
    if (d.description) setDescription(d.description)
    if (d.amenities) setAmenities(d.amenities)
    if (d.features) setFeatures(d.features)
    if (d.utilitiesIncluded) setUtilitiesIncluded(d.utilitiesIncluded)
  }

  const handleAddImage = () => {
    if (!newImage.trim()) return
    setImages((prev) => [...prev, newImage.trim()])
    setNewImage('')
  }
  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddAmenity = () => {
    if (!newAmenity.trim()) return
    setAmenities((prev) => [...prev, newAmenity.trim()])
    setNewAmenity('')
  }
  const handleRemoveAmenity = (idx: number) => {
    setAmenities((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddFeature = () => {
    if (!newFeature.trim()) return
    setFeatures((prev) => [...prev, newFeature.trim()])
    setNewFeature('')
  }
  const handleRemoveFeature = (idx: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAddUtility = () => {
    if (!newUtility.trim()) return
    setUtilitiesIncluded((prev) => [...prev, newUtility.trim()])
    setNewUtility('')
  }
  const handleRemoveUtility = (idx: number) => {
    setUtilitiesIncluded((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !location.trim() || !monthlyRate.trim() || !hostName.trim() || !description.trim()) {
      setError('Please fill in Sanctuary Name, Location, Monthly Rate, Host Name, and Description.')
      return
    }

    if (images.length === 0) {
      setError('Please add at least one photograph URL for the property listing.')
      return
    }

    setIsSubmitting(true)

    const payload: CreateHomestayInput = {
      name: name.trim(),
      region,
      location: location.trim(),
      elevation: elevation.trim(),
      monthlyRate: monthlyRate.trim(),
      securityDeposit: securityDeposit.trim(),
      minLeaseTerm: minLeaseTerm.trim(),
      leaseStatus,
      furnishing,
      hostName: hostName.trim(),
      hostRole: hostRole.trim(),
      hostYears,
      roomType: roomType.trim(),
      wifi: wifi.trim(),
      capacity: capacity.trim(),
      images,
      description: description.trim(),
      amenities,
      features,
      utilitiesIncluded,
      isPublished
    }

    try {
      if (isEdit && editingHomestay) {
        const res = await updateAdminHomestay(editingHomestay.id, payload)
        if (res.error) {
          setError(res.error)
        } else if (res.data) {
          onSuccess(res.data, true)
          onClose()
        }
      } else {
        const res = await createAdminHomestay(payload)
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
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-normal text-[#123D2D]">
                {isEdit ? 'Edit Homestay Sanctuary' : 'Register Homestay / Residential Lease'}
              </h2>
              <p className="text-[11px] font-mono text-[#576159] tracking-wider uppercase">
                {isEdit ? `ID: ${editingHomestay?.id}` : 'Long-term residential sanctuaries & sabbatical lofts'}
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

          <form id="homestay-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Region */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Sanctuary / Homestay Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chuchen Stone & Cedar Residency"
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                />
              </div>

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
            </div>

            {/* Location & Elevation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Location / Hamlet *
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#576159] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Chuchen, West Sikkim"
                    className="w-full bg-white border border-[#CBDAC4] pl-9 pr-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Elevation
                </label>
                <input
                  type="text"
                  value={elevation}
                  onChange={(e) => setElevation(e.target.value)}
                  placeholder="e.g. 1,820m"
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                />
              </div>
            </div>

            {/* Rates, Deposit & Term */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Monthly Rate *
                </label>
                <input
                  type="text"
                  required
                  value={monthlyRate}
                  onChange={(e) => setMonthlyRate(e.target.value)}
                  placeholder="e.g. ₹28,000 / month"
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Security Deposit
                </label>
                <input
                  type="text"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  placeholder="e.g. ₹20,000 refundable"
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Min Lease Term
                </label>
                <input
                  type="text"
                  value={minLeaseTerm}
                  onChange={(e) => setMinLeaseTerm(e.target.value)}
                  placeholder="e.g. 3 months"
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                />
              </div>
            </div>

            {/* Status & Furnishing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Lease Availability Status
                </label>
                <select
                  value={leaseStatus}
                  onChange={(e) => setLeaseStatus(e.target.value)}
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                >
                  {LEASE_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Interior & Furnishing
                </label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                >
                  {FURNISHING_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Host Details */}
            <div className="p-4 bg-white border border-[#CBDAC4] rounded-sm space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold">
                Host & Stewardship Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#576159] mb-1">Host Name *</label>
                  <input
                    type="text"
                    required
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="e.g. Tenzing & Pema Lepcha"
                    className="w-full bg-[#FAF8F5] border border-[#CBDAC4] px-3 py-1.5 text-xs text-[#123D2D] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#576159] mb-1">Stewardship Role</label>
                  <input
                    type="text"
                    value={hostRole}
                    onChange={(e) => setHostRole(e.target.value)}
                    placeholder="e.g. Organic Orchardist"
                    className="w-full bg-[#FAF8F5] border border-[#CBDAC4] px-3 py-1.5 text-xs text-[#123D2D] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#576159] mb-1">Years Hosting</label>
                  <input
                    type="number"
                    min={0}
                    value={hostYears}
                    onChange={(e) => setHostYears(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-[#CBDAC4] px-3 py-1.5 text-xs text-[#123D2D] rounded-sm"
                  />
                </div>
              </div>
            </div>

            {/* Room Type, Wifi & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Room Configuration
                </label>
                <input
                  type="text"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  placeholder="e.g. Entire 2-Bed Cedar Loft"
                  className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Wifi / Connectivity
                </label>
                <div className="relative">
                  <Wifi className="w-3.5 h-3.5 text-[#576159] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={wifi}
                    onChange={(e) => setWifi(e.target.value)}
                    placeholder="e.g. 100 Mbps Starlink"
                    className="w-full bg-white border border-[#CBDAC4] pl-9 pr-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                  Resident Capacity
                </label>
                <div className="relative">
                  <Users className="w-3.5 h-3.5 text-[#576159] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="e.g. 2–3 Residents"
                    className="w-full bg-white border border-[#CBDAC4] pl-9 pr-3 py-2 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                  />
                </div>
              </div>
            </div>

            {/* Images Array */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold">
                  Photographs & Architecture Visuals ({images.length}) *
                </label>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#576159]">
                  <span>Quick Presets:</span>
                  {PHOTO_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setImages((prev) => [...prev, p.url])}
                      className="text-[#285A40] hover:underline"
                    >
                      +{p.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <ImageIcon className="w-3.5 h-3.5 text-[#576159] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-white border border-[#CBDAC4] pl-9 pr-3 py-1.5 text-xs text-[#123D2D] rounded-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-3 py-1.5 bg-[#123D2D] text-white hover:bg-[#285A40] text-xs font-mono rounded-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {images.map((imgUrl, idx) => (
                    <div key={idx} className="relative group border border-[#CBDAC4] rounded-sm overflow-hidden aspect-video bg-black/10">
                      <img src={imgUrl} alt={`Homestay ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                Monograph & Architectural Description *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the timber craftsmanship, solar orientation, hearth heating, mountain vistas, and daily rhythm..."
                className="w-full bg-white border border-[#CBDAC4] p-3 text-sm text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
              />
            </div>

            {/* Amenities list editor */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                Resident Amenities ({amenities.length})
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                  placeholder="e.g. Wood-burning Bukhari Fireplace..."
                  className="flex-1 bg-white border border-[#CBDAC4] px-3 py-1.5 text-xs text-[#123D2D] rounded-sm"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="px-3 py-1.5 bg-[#123D2D] text-white hover:bg-[#285A40] text-xs font-mono rounded-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#CBDAC4] text-xs text-[#123D2D] rounded-sm font-mono"
                    >
                      <span>✓ {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(idx)}
                        className="text-red-500 hover:text-red-700 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Features list editor */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                Property Features ({features.length})
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  placeholder="e.g. Zero sound pollution, organic terraces..."
                  className="flex-1 bg-white border border-[#CBDAC4] px-3 py-1.5 text-xs text-[#123D2D] rounded-sm"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-1.5 bg-[#123D2D] text-white hover:bg-[#285A40] text-xs font-mono rounded-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {features.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#CBDAC4] text-xs text-[#123D2D] rounded-sm font-mono"
                    >
                      <span>★ {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-red-500 hover:text-red-700 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Utilities Included editor */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                Utilities Included ({utilitiesIncluded.length})
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newUtility}
                  onChange={(e) => setNewUtility(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUtility())}
                  placeholder="e.g. Starlink WiFi, Firewood supply..."
                  className="flex-1 bg-white border border-[#CBDAC4] px-3 py-1.5 text-xs text-[#123D2D] rounded-sm"
                />
                <button
                  type="button"
                  onClick={handleAddUtility}
                  className="px-3 py-1.5 bg-[#123D2D] text-white hover:bg-[#285A40] text-xs font-mono rounded-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {utilitiesIncluded.length > 0 && (
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {utilitiesIncluded.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#CBDAC4] text-xs text-[#123D2D] rounded-sm font-mono"
                    >
                      <span>⚡ {item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveUtility(idx)}
                        className="text-red-500 hover:text-red-700 ml-1"
                      >
                        ×
                      </button>
                    </span>
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
                    ? 'Live — Visible to prospective residents on public homepage'
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
            form="homestay-form"
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
                <span>{isEdit ? 'Update Sanctuary' : 'Register Sanctuary'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
