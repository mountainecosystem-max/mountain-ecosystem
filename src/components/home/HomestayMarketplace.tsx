import { useState } from 'react'
import type { FC } from 'react'
import type { Homestay } from '../../types'
import {
  Wifi,
  Star,
  MapPin,
  ArrowRight,
  Check,
  Sparkles,
  Flame,
  Users,
  PlusCircle,
  Tag,
  Building2,
  ShieldCheck
} from 'lucide-react'
import { DataLoadingSkeleton, DataEmptyState, DataErrorState } from '../common/StateViews'

interface HomestayMarketplaceProps {
  homestays: Homestay[]
  onSelectHomestay: (homestay: Homestay) => void
  onListHomestayClick: () => void
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export const HomestayMarketplace: FC<HomestayMarketplaceProps> = ({
  homestays,
  onSelectHomestay,
  onListHomestayClick,
  isLoading = false,
  error = null,
  onRetry
}) => {
  const [filterType, setFilterType] = useState<'all' | 'lease' | 'sale'>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  const regions = [
    { id: 'all', label: 'All Indian Mountains' },
    { id: 'Himachal', label: 'Himachal Pradesh' },
    { id: 'Uttarakhand', label: 'Uttarakhand' },
    { id: 'Ladakh', label: 'Ladakh & Kashmir' },
    { id: 'Sikkim', label: 'Sikkim & Northeast' },
    { id: 'Bengal', label: 'Bengal Hills' },
    { id: 'Nilgiris', label: 'Nilgiris & Western Ghats' }
  ]

  // Filter homestays by Lease vs Sale and Region
  const filteredProperties = homestays.filter((stay, idx) => {
    // Strictly respect listingType if specified; fallback only for legacy mock data
    const isSale = stay.listingType ? stay.listingType === 'sale' : idx % 2 === 1
    const matchesType =
      filterType === 'all'
        ? true
        : filterType === 'sale'
        ? isSale
        : !isSale

    const matchesRegion =
      selectedRegion === 'all'
        ? true
        : stay.region.toLowerCase().includes(selectedRegion.toLowerCase()) ||
          stay.location.toLowerCase().includes(selectedRegion.toLowerCase())

    return matchesType && matchesRegion
  })

  return (
    <section id="stays" className="py-16 sm:py-20 bg-[#FAF7EE] border-t border-[#CBDAC4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Properties for Lease & Sale */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#CBDAC4] gap-6">
          <div className="max-w-3xl">
            <span className="text-[#164E2D] text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Building2 className="w-4 h-4 text-[#D96B27]" />
              <span>PAN-INDIA PROPERTY EXCHANGE • LEASE & SALE</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A2316] uppercase leading-tight">
              MOUNTAIN PROPERTIES FOR LEASE & SALE
            </h2>
            <p className="text-stone-700 text-sm sm:text-base mt-2 font-light leading-relaxed">
              Verified stone cottages, cedar chalets, and mountain parcels across all Indian mountain ranges—Himachal Pradesh, Uttarakhand, Ladakh, Kashmir, Sikkim, Bengal Hills, and the Western Ghats. Post your property for lease or sale with complete verified address details.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end shrink-0">
            <button
              onClick={onListHomestayClick}
              type="button"
              className="inline-flex items-center gap-2 bg-[#164E2D] hover:bg-[#0A2316] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[#A5C896]" />
              <span>Post a Property (Lease / Sale)</span>
            </button>
          </div>
        </div>

        {/* Lease vs Sale Mode Selector + Territory Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-8 gap-4 border-b border-[#CBDAC4]/70">
          {/* Lease / Sale Segmented Tabs */}
          <div className="inline-flex items-center bg-white p-1 rounded-full border border-[#CBDAC4] shadow-xs">
            <button
              onClick={() => setFilterType('all')}
              type="button"
              className={`px-4 py-2 min-h-[38px] text-xs font-mono uppercase tracking-wider rounded-full transition-all flex items-center justify-center ${
                filterType === 'all'
                  ? 'bg-[#0B2516] text-white font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Listings
            </button>
            <button
              onClick={() => setFilterType('lease')}
              type="button"
              className={`px-4 py-2 min-h-[38px] text-xs font-mono uppercase tracking-wider rounded-full transition-all flex items-center justify-center ${
                filterType === 'lease'
                  ? 'bg-[#164E2D] text-white font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🏡 For Lease
            </button>
            <button
              onClick={() => setFilterType('sale')}
              type="button"
              className={`px-4 py-2 min-h-[38px] text-xs font-mono uppercase tracking-wider rounded-full transition-all flex items-center justify-center ${
                filterType === 'sale'
                  ? 'bg-[#D96B27] text-white font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🏷️ For Sale
            </button>
          </div>

          {/* Region Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {regions.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelectedRegion(reg.id)}
                type="button"
                className={`px-3.5 py-2 min-h-[38px] text-xs font-mono uppercase tracking-wider rounded-full transition-all whitespace-nowrap flex items-center justify-center ${
                  selectedRegion === reg.id
                    ? 'bg-[#0B2516] text-white font-semibold'
                    : 'bg-white border border-[#CBDAC4] text-stone-600 hover:bg-[#E8EFE3] hover:text-[#0A2316]'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Verification & Title Disclaimer */}
        <div className="mb-8 p-3.5 sm:p-4 rounded-xl bg-emerald-50/90 border border-emerald-300 flex items-start sm:items-center gap-3 text-xs text-emerald-900 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 font-sans leading-relaxed">
            <strong className="font-semibold text-emerald-950 uppercase tracking-wide font-mono text-[11px] block sm:inline sm:mr-2">
              🛡️ Independent Verification Advisory:
            </strong>
            Please independently verify all property title deeds, municipal land registry records, year-round water supply, winter road access, and physical premises before executing lease agreements or transferring advance deposits.
          </div>
        </div>

        {/* State Handling: Loading, Error, Empty, or Cards Grid */}
        {isLoading ? (
          <DataLoadingSkeleton count={3} />
        ) : error ? (
          <DataErrorState message={error} onRetry={onRetry} />
        ) : filteredProperties.length === 0 ? (
          <DataEmptyState
            title="No Properties Matching this Filter"
            description="There are currently no listings matching this criteria. You can post a property for lease or sale right now."
            actionLabel="Post Property Listing"
            onAction={onListHomestayClick}
          />
        ) : (
          /* Property Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProperties.map((stay, idx) => {
              const isSale = stay.listingType ? stay.listingType === 'sale' : idx % 2 === 1
              const numericMonthly =
                parseInt(stay.monthlyRate.replace(/[^0-9]/g, ''), 10) || 32000
              const salePrice =
                stay.salePrice || `₹${(numericMonthly * 150).toLocaleString('en-IN')}`

              return (
                <article
                  key={stay.id}
                  onClick={() => onSelectHomestay(stay)}
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer card-hover-lift"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectHomestay(stay)
                    }
                  }}
                  aria-label={`View details for ${stay.name}`}
                >
                  <div>
                    {/* Visual Photo Card with Lease/Sale Pill */}
                    <div className="relative h-60 sm:h-64 overflow-hidden bg-[#0A2316]">
                      <img
                        src={stay.images[0]}
                        alt={stay.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20 pointer-events-none" />

                      {/* Prominent FOR LEASE vs FOR SALE Badge */}
                      <div className="absolute top-4 left-4">
                        {isSale ? (
                          <span className="bg-[#D96B27] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>FOR SALE</span>
                          </span>
                        ) : (
                          <span className="bg-[#164E2D] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#A5C896]" />
                            <span>FOR LEASE (1–12 MOS)</span>
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="absolute top-4 right-4">
                        <span className="bg-stone-950/85 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10 shadow">
                          <Star className="w-3.5 h-3.5 fill-[#EAB308] text-[#EAB308]" />
                          <span>{stay.rating.toFixed(2)}</span>
                        </span>
                      </div>

                      {/* Location & Elevation Stamp */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                        <span className="flex items-center gap-1 bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md">
                          <MapPin className="w-3 h-3 text-[#A5C896]" />
                          <span>{stay.region}</span>
                        </span>

                        <span className="bg-stone-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[#A5C896]">
                          {stay.elevation}
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6">
                      <h3 className="font-display text-2xl font-bold text-stone-950 uppercase tracking-tight group-hover:text-[#164E2D] transition-colors leading-tight">
                        {stay.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-mono mt-1">
                        {stay.location}
                      </p>

                      <p className="text-xs sm:text-sm text-stone-600 font-light mt-2.5 line-clamp-2 leading-relaxed">
                        {stay.description}
                      </p>

                      {/* Key Infrastructure Specs */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-100 text-xs font-mono text-stone-700">
                        <div className="flex items-center gap-1.5 truncate">
                          <Flame className="w-3.5 h-3.5 text-[#D96B27] shrink-0" />
                          <span className="truncate">{stay.furnishing.split('&')[0].trim()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Wifi className="w-3.5 h-3.5 text-[#164E2D] shrink-0" />
                          <span className="truncate">{stay.wifi.split('Dedicated')[0].trim()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Check className="w-3.5 h-3.5 text-[#164E2D] shrink-0" />
                          <span className="truncate">Direct Village Pact</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Users className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                          <span className="truncate">{stay.capacity}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Pricing Footer & Action */}
                  <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between mt-auto">
                    <div>
                      {isSale ? (
                        <div>
                          <div className="text-[10px] font-mono text-stone-500 uppercase font-semibold">
                            Outright Sale Price
                          </div>
                          <div className="font-display text-2xl font-bold text-[#D96B27]">
                            {salePrice}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[10px] font-mono text-stone-500 uppercase font-semibold">
                            Monthly Sabbatical Lease
                          </div>
                          <div className="font-display text-2xl font-bold text-[#0A2316]">
                            {stay.monthlyRate.startsWith('₹') ? stay.monthlyRate : `₹${stay.monthlyRate}`}
                            <span className="text-xs text-stone-500 font-normal"> / mo</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectHomestay(stay)
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#164E2D] hover:bg-[#0A2316] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl shadow transition transform active:scale-95"
                    >
                      <span>{isSale ? 'Buy / Inquire' : 'Lease Space'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
