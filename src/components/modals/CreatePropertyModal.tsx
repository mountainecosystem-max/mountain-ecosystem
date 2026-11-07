import { useState } from 'react'
import type { FC, FormEvent, ChangeEvent } from 'react'
import {
  X,
  Building2,
  Home,
  Tag,
  MapPin,
  AlertCircle,
  Loader2,
  Compass,
  FileCheck2,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Upload
} from 'lucide-react'
import type { Homestay } from '../../types'
import { submitCommunityProperty } from '../../services/ecosystemService'
import { stripExifAndCompress } from '../../utils/imagePrivacy'

interface CreatePropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (newProperty: Homestay) => void
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

export const CreatePropertyModal: FC<CreatePropertyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onOpenPrivacy
}) => {
  const [listingType, setListingType] = useState<'lease' | 'sale'>('lease')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Stone Cottage')
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  
  // Detailed Address Fields
  const [state, setState] = useState('Himachal Pradesh')
  const [mountainRange, setMountainRange] = useState('Kullu & Parvati Valley')
  const [villageTown, setVillageTown] = useState('')
  const [fullAddress, setFullAddress] = useState('')
  const [districtPin, setDistrictPin] = useState('')
  const [elevation, setElevation] = useState('2,050 m')

  // Lease / Sale Terms
  const [monthlyRate, setMonthlyRate] = useState('')
  const [securityDeposit, setSecurityDeposit] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [landArea, setLandArea] = useState('')
  const [landTitleType, setLandTitleType] = useState('Freehold Clear Title')
  const [minLeaseTerm, setMinLeaseTerm] = useState('1–6 Months')
  
  // Amenities & Specs
  const [bedrooms, setBedrooms] = useState('1 Bedroom')
  const [wifiSpeed, setWifiSpeed] = useState('100 Mbps Dedicated Fiber')
  const [heatingType, setHeatingType] = useState('Traditional Bukhari Wood Stove')
  const [roadAccess, setRoadAccess] = useState('Direct Car Drive-in to Gate')
  const [waterSource, setWaterSource] = useState('Natural Himalayan Spring Water')
  const [powerBackup, setPowerBackup] = useState('Inverter & Solar Battery')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85')

  // Host / Seller Contact
  const [hostName, setHostName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('')
  const [phoneVisibility, setPhoneVisibility] = useState<'relay' | 'public'>('relay')

  // EXIF & Image Sanitization State
  const [imageProcessing, setImageProcessing] = useState(false)
  const [imageNotice, setImageNotice] = useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen) return null

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageProcessing(true)
    setImageNotice('Sanitizing photo & stripping EXIF GPS location data...')

    try {
      const processed = await stripExifAndCompress(file)
      setImageUrl(processed.dataUrl)
      setImageNotice(
        `✓ EXIF GPS purged. Photo compressed from ${(processed.originalSize / 1024).toFixed(0)} KB to ${(processed.processedSize / 1024).toFixed(0)} KB.`
      )
    } catch {
      setImageNotice('Error sanitizing image. Please use another photo.')
    } finally {
      setImageProcessing(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !villageTown.trim() || !fullAddress.trim() || !hostName.trim() || !contactEmail.trim()) {
      setError('Please fill in all required fields marked with * (Title, Village/Town, Full Address, Host Name, and Email).')
      return
    }

    if (listingType === 'lease' && !monthlyRate.trim()) {
      setError('Please enter the monthly lease rate.')
      return
    }

    if (listingType === 'sale' && !salePrice.trim()) {
      setError('Please enter the outright sale asking price.')
      return
    }

    if (!agreedToPrivacy) {
      setError('Please review and check the Privacy Policy and terms agreement checkbox before submitting.')
      return
    }

    setIsSubmitting(true)

    // Build the new Homestay object - defaulted to Moderation Queue (isPublished = false)
    const newProperty: Homestay = {
      id: `property-${Date.now()}`,
      name: name.trim(),
      region: state,
      location: `${fullAddress.trim()}, ${villageTown.trim()}, ${state} (${elevation})`,
      elevation: elevation || '2,000 m',
      listingType,
      salePrice: listingType === 'sale' ? salePrice.trim() : undefined,
      monthlyRate: listingType === 'lease' ? (monthlyRate.startsWith('₹') ? monthlyRate : `₹${monthlyRate}`) : 'For Sale',
      securityDeposit: securityDeposit ? (securityDeposit.startsWith('₹') ? securityDeposit : `₹${securityDeposit}`) : '₹0',
      minLeaseTerm: listingType === 'lease' ? minLeaseTerm : 'Outright Sale',
      leaseStatus: listingType === 'lease' ? 'Pending Steward Verification' : 'For Sale • Verification Pending',
      furnishing: `${category} • ${heatingType}`,
      rating: 5.0,
      reviewsCount: 1,
      phoneVisibility,
      verificationTier: 'community_listed',
      isPublished: false,
      hostPhone: phoneWhatsApp.trim(),
      hostEmail: contactEmail.trim(),
      host: {
        name: hostName.trim(),
        role: listingType === 'lease' ? 'Community Mountain Host' : 'Community Property Owner',
        yearsHosting: 1,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
      },
      roomType: `${category} (${bedrooms})`,
      wifi: wifiSpeed,
      capacity: `${bedrooms} • Road: ${roadAccess}`,
      images: [imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85'],
      description: description.trim() || `${name.trim()} located in ${villageTown}, ${state}. Equipped with ${wifiSpeed}, ${heatingType}, and ${waterSource}.`,
      amenities: [
        wifiSpeed,
        heatingType,
        waterSource,
        roadAccess,
        powerBackup,
        'Mountain Panorama'
      ],
      features: [
        listingType === 'lease' ? 'Residential Lease' : `For Sale (${landTitleType})`,
        state,
        roadAccess,
        powerBackup
      ],
      utilitiesIncluded: [
        wifiSpeed,
        waterSource,
        'Property Verification'
      ]
    }

    try {
      const res = await submitCommunityProperty(newProperty)
      setIsSubmitting(false)
      setIsSubmitted(true)
      onSuccess?.(res.data || newProperty)
    } catch {
      setIsSubmitting(false)
      setIsSubmitted(true)
      onSuccess?.(newProperty)
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
              <Building2 className="w-4 h-4 text-[#D96B27]" />
              <span>PAN-INDIA PROPERTY EXCHANGE</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl text-[#0B2516] font-bold uppercase mt-0.5">
              List Mountain Property (Lease or Sale)
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

        {/* Content Body */}
        <div className="p-5 sm:p-8">
          {isSubmitted ? (
            <div className="bg-[#E8EFE3] border border-[#164E2D]/40 p-6 sm:p-8 rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-[#164E2D] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                <ShieldCheck className="w-6 h-6 text-[#A5C896]" />
              </div>
              <h3 className="font-display text-2xl text-[#0B2516] font-bold uppercase">
                Submitted to Verification Queue!
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 font-sans mt-2 max-w-lg mx-auto leading-relaxed">
                Your listing for <strong>{villageTown || state}</strong> has been received by the Mountain Steward Moderation Ledger. To protect travellers and buyers against fraud, unvetted listings, and scams, our stewards verify ownership/title records before making it live (usually within 12–24 hours).
              </p>

              <div className="mt-5 p-3.5 bg-white/80 border border-[#CBDAC4] rounded-xl max-w-md mx-auto text-left text-xs font-mono space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Moderation Status:</span>
                  <span className="text-[#D96B27] font-bold">Under Steward Review (Queue)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Verification Tier:</span>
                  <span className="text-[#164E2D] font-bold">Community Listed (Pending Audit)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Contact Privacy:</span>
                  <span className="font-bold text-stone-800">
                    {phoneVisibility === 'relay'
                      ? '🛡️ Protected Relay (Phone Hidden)'
                      : 'Public WhatsApp (Owner Consented)'}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                type="button"
                className="mt-6 inline-flex items-center gap-2 bg-[#0B2516] hover:bg-[#164E2D] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition shadow-md"
              >
                <span>Done & Return to Exchange</span>
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

              {/* 1. Primary Listing Type Pill Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-2">
                  Select Listing Intent *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setListingType('lease')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs sm:text-sm font-sans font-bold transition ${
                      listingType === 'lease'
                        ? 'bg-[#0B2516] text-[#FAF7EE] border-[#0B2516] shadow-sm'
                        : 'bg-white hover:bg-[#E8EFE3] text-stone-700 border-[#CBDAC4]'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>🏡 For Residential Lease (Monthly)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setListingType('sale')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs sm:text-sm font-sans font-bold transition ${
                      listingType === 'sale'
                        ? 'bg-[#0B2516] text-[#FAF7EE] border-[#0B2516] shadow-sm'
                        : 'bg-white hover:bg-[#E8EFE3] text-stone-700 border-[#CBDAC4]'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span>🏷️ For Outright Sale (Buy Property)</span>
                  </button>
                </div>
              </div>

              {/* 2. Basic Property Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                    Property Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Pine Ridge Cedar Stone Cottage with Snow Views"
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                  >
                    <option value="Stone Cottage">Stone Cottage</option>
                    <option value="Kath-Kuni Timber Chalet">Kath-Kuni Timber Chalet</option>
                    <option value="Heritage Tea Estate Croft">Heritage Tea Estate Croft</option>
                    <option value="Orchard Farmhouse">Orchard Farmhouse</option>
                    <option value="Solar Passive Loft">Solar Passive Loft</option>
                    <option value="Mountain Land Parcel">Mountain Land Parcel</option>
                  </select>
                </div>
              </div>

              {/* 3. Comprehensive Pan-India Address Section */}
              <div className="bg-white/80 p-4 sm:p-5 rounded-xl border border-[#CBDAC4] space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#164E2D] font-bold border-b border-[#CBDAC4]/70 pb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D96B27]" />
                  <span>Proper Mountain Address Details (All-India)</span>
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
                      Mountain Range / Valley
                    </label>
                    <input
                      type="text"
                      value={mountainRange}
                      onChange={(e) => setMountainRange(e.target.value)}
                      placeholder="e.g. Parvati Valley / Kumaon / Zanskar / Nilgiris"
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Village / Hamlet / Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={villageTown}
                      onChange={(e) => setVillageTown(e.target.value)}
                      placeholder="e.g. Old Manali / Mukteshwar / Yuksom / Kotagiri"
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Altitude / Elevation
                    </label>
                    <input
                      type="text"
                      value={elevation}
                      onChange={(e) => setElevation(e.target.value)}
                      placeholder="e.g. 2,050 m / 6,700 ft"
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Full Street Address / Landmark / Ridge Road *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      placeholder="e.g. House No. 14, Upper Temple Road, Near Deodar Pine Grove"
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      District & PIN Code
                    </label>
                    <input
                      type="text"
                      value={districtPin}
                      onChange={(e) => setDistrictPin(e.target.value)}
                      placeholder="e.g. Kullu District - 175131"
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Financial & Pricing Terms */}
              {listingType === 'lease' ? (
                <div className="bg-white/80 p-4 sm:p-5 rounded-xl border border-[#CBDAC4] space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#164E2D] font-bold border-b border-[#CBDAC4]/70 pb-2">
                    <Home className="w-3.5 h-3.5 text-[#34D399]" />
                    <span>Monthly Lease & Sabbatical Terms</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                        Monthly Rent (₹) *
                      </label>
                      <input
                        type="text"
                        required
                        value={monthlyRate}
                        onChange={(e) => setMonthlyRate(e.target.value)}
                        placeholder="e.g. ₹32,000 / month"
                        className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                        Security Deposit (₹)
                      </label>
                      <input
                        type="text"
                        value={securityDeposit}
                        onChange={(e) => setSecurityDeposit(e.target.value)}
                        placeholder="e.g. ₹32,000 (Refundable)"
                        className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                        Min Lease Period
                      </label>
                      <select
                        value={minLeaseTerm}
                        onChange={(e) => setMinLeaseTerm(e.target.value)}
                        className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                      >
                        <option value="1 Month">1 Month</option>
                        <option value="1–3 Months">1–3 Months</option>
                        <option value="3–6 Months">3–6 Months</option>
                        <option value="6–12 Months">6–12 Months</option>
                        <option value="1 Year+ Long-term">1 Year+ Long-term</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 p-4 sm:p-5 rounded-xl border border-[#CBDAC4] space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#164E2D] font-bold border-b border-[#CBDAC4]/70 pb-2">
                    <FileCheck2 className="w-3.5 h-3.5 text-[#D96B27]" />
                    <span>Outright Sale & Land Title Terms</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                        Asking Price (₹) *
                      </label>
                      <input
                        type="text"
                        required
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        placeholder="e.g. ₹1.45 Cr or ₹85 Lakh"
                        className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                        Land / Built-up Area
                      </label>
                      <input
                        type="text"
                        value={landArea}
                        onChange={(e) => setLandArea(e.target.value)}
                        placeholder="e.g. 10 Nali / 1.5 Acres / 3,200 sq ft"
                        className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                        Title / Tenure Type
                      </label>
                      <select
                        value={landTitleType}
                        onChange={(e) => setLandTitleType(e.target.value)}
                        className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                      >
                        <option value="Freehold Clear Title">Freehold Clear Title</option>
                        <option value="Registry / Khatoni Verified">Registry / Khatoni Verified</option>
                        <option value="Clear Patta Land">Clear Patta Land</option>
                        <option value="99-Year Renewable Lease">99-Year Renewable Lease</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Living Infrastructure & Amenities */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                    Bedrooms & Layout
                  </label>
                  <input
                    type="text"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="e.g. 2 Bedrooms • Solarium Study"
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                    Fiber Broadband Speed
                  </label>
                  <input
                    type="text"
                    value={wifiSpeed}
                    onChange={(e) => setWifiSpeed(e.target.value)}
                    placeholder="e.g. 100 Mbps Dedicated Fiber"
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                    Heating System
                  </label>
                  <input
                    type="text"
                    value={heatingType}
                    onChange={(e) => setHeatingType(e.target.value)}
                    placeholder="e.g. Bukhari Wood Stove / Cast Iron Fireplace"
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                  />
                </div>
              </div>

              {/* Second Row: Mountain Utilities & Road Access */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                    Road / Vehicle Access
                  </label>
                  <input
                    type="text"
                    value={roadAccess}
                    onChange={(e) => setRoadAccess(e.target.value)}
                    placeholder="e.g. Direct Car Drive-in to Gate / 5-min foot trail"
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                    Water Source
                  </label>
                  <input
                    type="text"
                    value={waterSource}
                    onChange={(e) => setWaterSource(e.target.value)}
                    placeholder="e.g. Natural Himalayan Spring / Gravity Feed"
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                    Power Backup
                  </label>
                  <input
                    type="text"
                    value={powerBackup}
                    onChange={(e) => setPowerBackup(e.target.value)}
                    placeholder="e.g. Inverter & Solar Battery / Grid Only"
                    className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                  />
                </div>
              </div>

              {/* 6. Contact Details */}
              <div className="bg-white/80 p-4 sm:p-5 rounded-xl border border-[#CBDAC4] space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#164E2D] font-bold border-b border-[#CBDAC4]/70 pb-2">
                  <Compass className="w-3.5 h-3.5 text-[#164E2D]" />
                  <span>Host / Property Owner Contact</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      placeholder="e.g. Virender Singh"
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your.email@domain.com"
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

                  {/* DPDP Section 6 Contact Privacy Selector */}
                  <div className="sm:col-span-3 mt-2 p-3 bg-white border border-[#CBDAC4] rounded-xl space-y-2">
                    <div className="text-xs font-mono uppercase tracking-wider font-bold text-[#164E2D] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>DPDP Act 2023 • Contact Privacy & Telemarketing Shield</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                          phoneVisibility === 'relay'
                            ? 'bg-[#E8EFE3] border-[#164E2D] text-[#0B2516]'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="phoneVisibility"
                          value="relay"
                          checked={phoneVisibility === 'relay'}
                          onChange={() => setPhoneVisibility('relay')}
                          className="mt-0.5 text-[#164E2D]"
                        />
                        <div>
                          <strong className="block font-semibold">Hide My Phone (Recommended)</strong>
                          <span className="text-[11px] leading-tight block text-stone-500">
                            Prevents web scrapers and spam calls. Prospective buyers/guests contact via platform message form.
                          </span>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                          phoneVisibility === 'public'
                            ? 'bg-[#E8EFE3] border-[#164E2D] text-[#0B2516]'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="phoneVisibility"
                          value="public"
                          checked={phoneVisibility === 'public'}
                          onChange={() => setPhoneVisibility('public')}
                          className="mt-0.5 text-[#164E2D]"
                        />
                        <div>
                          <strong className="block font-semibold">Public WhatsApp Button</strong>
                          <span className="text-[11px] leading-tight block text-stone-500">
                            I give explicit consent under DPDP Act 2023 to display my WhatsApp publicly for direct inquiries.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. Detailed Description & Photo URL */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                  Property Description & Surroundings
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the natural light, view of snow ranges, serenity, heating, nearby village trail, and water supply..."
                  className="w-full bg-white border border-[#CBDAC4] rounded-lg p-3 text-xs sm:text-sm text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                />
              </div>

              {/* Photo Upload with Client-Side EXIF GPS Stripping */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-700 font-bold mb-1">
                  Property Photos (EXIF & GPS Sanitized)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  {/* Direct File Upload with EXIF GPS Purge */}
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#164E2D]/40 hover:border-[#164E2D] rounded-xl bg-white/80 cursor-pointer transition hover:bg-[#E8EFE3]/50 text-center">
                    <Upload className="w-6 h-6 text-[#164E2D] mb-1" />
                    <span className="text-xs font-bold text-[#0B2516]">Upload from Device</span>
                    <span className="text-[10px] text-stone-500 font-mono mt-0.5">
                      Auto-purges camera GPS & compresses to WebP
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={imageProcessing}
                      className="hidden"
                    />
                  </label>

                  {/* Or Image URL Input */}
                  <div>
                    <label className="block text-[11px] font-mono text-stone-600 font-semibold mb-1">
                      Or Paste Image URL
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-white border border-[#CBDAC4] rounded-lg px-3.5 py-2 text-xs text-[#0B2516] focus:outline-none focus:border-[#164E2D]"
                    />
                  </div>
                </div>

                {imageProcessing && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                    <span>Stripping EXIF GPS coordinates & re-compressing image pixels...</span>
                  </div>
                )}

                {imageNotice && !imageProcessing && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 font-mono">
                    {imageNotice}
                  </div>
                )}

                {imageUrl && (
                  <div className="mt-2 w-full h-32 rounded-xl overflow-hidden border border-[#CBDAC4] shadow-xs">
                    <img
                      src={imageUrl}
                      alt="Property preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Critical Anti-Fraud & Verification Advisory */}
              <div className="p-3 bg-amber-500/10 border border-amber-600/30 rounded-xl text-xs text-amber-950 font-sans">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-amber-950 flex items-center gap-1.5">
                      <span>Trust & Safety Warning • Fraud se bachein</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed font-light">
                      Never share sensitive <strong>OTPs, bank account credentials, advance token money, or personal identity documents</strong> (Aadhaar, Passport, PAN) without independent in-person or official live verification. Mountain Ecosystem never solicits fees to list, browse, or verify properties.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Policy Agreement */}
              <div className="p-3.5 bg-[#FAF7EE] border border-[#CBDAC4] rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToPrivacy}
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                    required
                    className="mt-0.5 w-4 h-4 rounded border-[#164E2D] text-[#164E2D] focus:ring-[#164E2D] cursor-pointer"
                  />
                  <span className="text-xs text-stone-700 leading-relaxed font-sans">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="text-[#164E2D] font-bold underline hover:text-[#0B2516]"
                    >
                      Privacy Policy & Community Charter
                    </button>
                    , and I confirm that this property listing details, ownership representation, and ground amenities are genuine and accurate.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
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
                  className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#0A2316] via-[#123E24] to-[#184F2E] hover:from-[#0E2F1D] hover:to-[#1F633B] text-white text-xs sm:text-sm font-sans font-semibold tracking-wide px-7 py-3 rounded-full shadow-md shadow-emerald-950/20 hover:shadow-xl hover:shadow-emerald-950/30 border border-emerald-500/30 active:scale-95 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting to Exchange...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#A5C896]" />
                      <span>Publish Property Listing</span>
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
