import { useState, useEffect, useCallback } from 'react'
import type { FC, FormEvent } from 'react'
import {
  Store,
  Search,
  RefreshCw,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Car,
  Sprout,
  X,
  Loader2,
  Check,
  Sparkles
} from 'lucide-react'
import {
  fetchAdminPriceIndices,
  createAdminPriceIndex,
  updateAdminPriceIndex,
  deleteAdminPriceIndex,
  toggleAdminPriceIndexPublish,
  type DbPriceIndexRow,
  type CreatePriceIndexInput
} from '../../../services/adminPriceIndexService'

const PRESET_TEMPLATES: Array<{
  name: string
  data: CreatePriceIndexInput
}> = [
  {
    name: 'Siliguri to Gangtok Shared Jeep',
    data: {
      category: 'transit',
      item: 'Siliguri (NJP) ⇄ Gangtok Main Stand',
      routeOrOrigin: 'National Highway 10 Corridors',
      primaryRate: '₹350',
      rateUnit: '/ seat (Shared Sumo)',
      secondaryRate: '₹3,200',
      secondaryLabel: 'Private Vehicle Hire',
      stabilityScore: 94,
      trendStatus: 'stable',
      trendSummary: 'Syndicate rates strictly capped at union counter; no surge pricing during rain.',
      verifiedBy: 'Siliguri Ground Transport Union',
      isPublished: true
    }
  },
  {
    name: 'Temi Cardamom Farmgate Benchmark',
    data: {
      category: 'farmgate',
      item: 'Large Black Cardamom (Bara Elaichi)',
      routeOrOrigin: 'South & West Sikkim Producers Syndicate',
      primaryRate: '₹950 – ₹1,150',
      rateUnit: '/ kg cured dry harvest',
      secondaryRate: 'Grade-A Jumbo Pods',
      secondaryLabel: 'Export Benchmark',
      stabilityScore: 88,
      trendStatus: 'fair_fixed',
      trendSummary: 'Smoked curing floor prices guaranteed by indigenous cooperative collective.',
      verifiedBy: 'Sikkim Organic Farmers Collective',
      isPublished: true
    }
  }
]

export const BusinessesManager: FC = () => {
  const [items, setItems] = useState<DbPriceIndexRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'transit' | 'farmgate'>('all')

  // Modals & form state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DbPriceIndexRow | null>(null)
  const [deletingItem, setDeletingItem] = useState<DbPriceIndexRow | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Form Fields
  const [category, setCategory] = useState<'transit' | 'farmgate'>('transit')
  const [item, setItem] = useState('')
  const [routeOrOrigin, setRouteOrOrigin] = useState('')
  const [primaryRate, setPrimaryRate] = useState('')
  const [rateUnit, setRateUnit] = useState('')
  const [secondaryRate, setSecondaryRate] = useState('')
  const [secondaryLabel, setSecondaryLabel] = useState('')
  const [stabilityScore, setStabilityScore] = useState(92)
  const [trendStatus, setTrendStatus] = useState<'stable' | 'slight_fluctuation' | 'fair_fixed'>('stable')
  const [trendSummary, setTrendSummary] = useState('')
  const [verifiedBy, setVerifiedBy] = useState('Local Transport Syndicate')
  const [isPublished, setIsPublished] = useState(true)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const loadIndices = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const res = await fetchAdminPriceIndices()
    if (res.error) {
      setError(res.error)
    } else {
      setItems(res.data)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadIndices()
  }, [loadIndices])

  const openCreateModal = () => {
    setEditingItem(null)
    setCategory('transit')
    setItem('')
    setRouteOrOrigin('')
    setPrimaryRate('₹350')
    setRateUnit('/ seat')
    setSecondaryRate('')
    setSecondaryLabel('')
    setStabilityScore(92)
    setTrendStatus('stable')
    setTrendSummary('Syndicate fixed benchmark rates.')
    setVerifiedBy('Local Transport Syndicate')
    setIsPublished(true)
    setModalOpen(true)
  }

  const openEditModal = (row: DbPriceIndexRow) => {
    setEditingItem(row)
    setCategory(row.category)
    setItem(row.item)
    setRouteOrOrigin(row.route_or_origin)
    setPrimaryRate(row.primary_rate)
    setRateUnit(row.rate_unit)
    setSecondaryRate(row.secondary_rate || '')
    setSecondaryLabel(row.secondary_label || '')
    setStabilityScore(row.stability_score || 92)
    setTrendStatus(row.trend_status)
    setTrendSummary(row.trend_summary)
    setVerifiedBy(row.verified_by || 'Local Syndicate')
    setIsPublished(Boolean(row.is_published ?? true))
    setModalOpen(true)
  }

  const applyTemplate = (tmpl: typeof PRESET_TEMPLATES[number]) => {
    const d = tmpl.data
    setCategory(d.category)
    setItem(d.item)
    setRouteOrOrigin(d.routeOrOrigin)
    setPrimaryRate(d.primaryRate)
    setRateUnit(d.rateUnit)
    setSecondaryRate(d.secondaryRate || '')
    setSecondaryLabel(d.secondaryLabel || '')
    setStabilityScore(d.stabilityScore || 92)
    setTrendStatus(d.trendStatus)
    setTrendSummary(d.trendSummary)
    setVerifiedBy(d.verifiedBy || 'Local Syndicate')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!item.trim() || !primaryRate.trim() || !routeOrOrigin.trim()) {
      alert('Please fill in Benchmark Name, Route/Origin, and Primary Rate.')
      return
    }

    setIsSubmitting(true)
    const payload: CreatePriceIndexInput = {
      category,
      item: item.trim(),
      routeOrOrigin: routeOrOrigin.trim(),
      primaryRate: primaryRate.trim(),
      rateUnit: rateUnit.trim() || '/ unit',
      secondaryRate: secondaryRate.trim() || undefined,
      secondaryLabel: secondaryLabel.trim() || undefined,
      stabilityScore,
      trendStatus,
      trendSummary: trendSummary.trim() || 'Stable ground benchmark',
      verifiedBy: verifiedBy.trim() || 'Syndicate Ledger',
      isPublished
    }

    try {
      if (editingItem) {
        const res = await updateAdminPriceIndex(editingItem.id, payload)
        if (res.error) {
          showToast(`Error: ${res.error}`)
        } else if (res.data) {
          setItems((prev) => prev.map((i) => (i.id === res.data!.id ? res.data! : i)))
          showToast(`Updated "${res.data.item}"`)
          setModalOpen(false)
        }
      } else {
        const res = await createAdminPriceIndex(payload)
        if (res.error) {
          showToast(`Error: ${res.error}`)
        } else if (res.data) {
          setItems((prev) => [res.data!, ...prev])
          showToast(`Created benchmark "${res.data.item}"`)
          setModalOpen(false)
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTogglePublish = async (row: DbPriceIndexRow) => {
    const newStatus = !row.is_published
    const res = await toggleAdminPriceIndexPublish(row.id, newStatus)
    if (res.error) {
      showToast(`Error: ${res.error}`)
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === row.id ? { ...i, is_published: newStatus } : i))
      )
      showToast(newStatus ? `"${row.item}" is now Live` : `"${row.item}" saved as Draft`)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingItem) return
    const res = await deleteAdminPriceIndex(deletingItem.id)
    if (res.error) {
      showToast(`Error: ${res.error}`)
    } else {
      setItems((prev) => prev.filter((i) => i.id !== deletingItem.id))
      showToast(`Deleted "${deletingItem.item}"`)
      setDeletingItem(null)
    }
  }

  const filtered = items.filter((i) => {
    const matchesSearch =
      search === '' ||
      i.item.toLowerCase().includes(search.toLowerCase()) ||
      i.route_or_origin.toLowerCase().includes(search.toLowerCase()) ||
      (i.verified_by || '').toLowerCase().includes(search.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || i.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const transitCount = items.filter((i) => i.category === 'transit').length
  const farmgateCount = items.filter((i) => i.category === 'farmgate').length
  const liveCount = items.filter((i) => i.is_published).length

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#123D2D] text-[#F8F6F0] border border-[#8FA777]/50 px-4 py-3 rounded-sm shadow-2xl flex items-center gap-2.5 text-xs font-mono animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#8FA777]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#CBDAC4]">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.24em] text-[#285A40] font-bold mb-1">
            <Store className="w-3.5 h-3.5 text-[#285A40]" />
            <span>MODULE 05 • LOCAL ENTERPRISES & SYNDICATE BENCHMARKS</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#123D2D] font-normal tracking-tight">
            Syndicate Benchmarks & Farmgate Indices
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#576159] font-light">
            Manage official taxi union fare charts, cardamom/tea farmgate price indices, and cooperative market ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadIndices}
            disabled={isLoading}
            className="p-2.5 border border-[#CBDAC4] text-[#123D2D] hover:bg-white rounded-sm transition-colors text-xs font-mono"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#123D2D] hover:bg-[#285A40] text-white px-4 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Benchmark</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase tracking-wider text-[#576159]">Total Benchmarks</div>
          <div className="text-2xl font-serif text-[#123D2D] font-normal mt-1">{items.length}</div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase tracking-wider text-[#285A40]">Transit Routes</div>
          <div className="text-2xl font-serif text-[#285A40] font-normal mt-1">{transitCount}</div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase tracking-wider text-[#285A40]">Farmgate Commodities</div>
          <div className="text-2xl font-serif text-[#285A40] font-normal mt-1">{farmgateCount}</div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase tracking-wider text-[#285A40]">Live on Homepage</div>
          <div className="text-2xl font-serif text-[#123D2D] font-normal mt-1">{liveCount}</div>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="inline-flex rounded-sm border border-[#CBDAC4] p-1 bg-[#F8F6F0] text-xs font-mono">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-sm transition-colors ${
              categoryFilter === 'all'
                ? 'bg-[#123D2D] text-white font-semibold'
                : 'text-[#576159] hover:text-[#123D2D]'
            }`}
          >
            All Benchmarks ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('transit')}
            className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 ${
              categoryFilter === 'transit'
                ? 'bg-[#123D2D] text-white font-semibold'
                : 'text-[#576159] hover:text-[#123D2D]'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Transit ({transitCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('farmgate')}
            className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 ${
              categoryFilter === 'farmgate'
                ? 'bg-[#123D2D] text-white font-semibold'
                : 'text-[#576159] hover:text-[#123D2D]'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>Farmgate ({farmgateCount})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#576159] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search routes or commodities..."
            className="w-full bg-[#FAF8F5] border border-[#CBDAC4] pl-9 pr-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
          />
        </div>
      </div>

      {/* Content Table */}
      {isLoading ? (
        <div className="p-12 text-center bg-white border border-[#CBDAC4] rounded-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#285A40] mb-2" />
          <div className="text-xs font-mono text-[#576159]">Loading price_indices table...</div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-xs font-mono text-red-800 flex items-center gap-2 rounded-sm border border-red-300">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#CBDAC4] rounded-sm space-y-3">
          <Store className="w-10 h-10 text-[#285A40] mx-auto mb-2" />
          <h3 className="font-serif text-lg text-[#123D2D]">No Price Benchmarks Registered</h3>
          <p className="text-xs text-[#576159] max-w-md mx-auto">
            Official transport rates or farmgate commodity benchmarks added here will power the public price charts.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#123D2D] hover:bg-[#285A40] text-white px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Benchmark</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#CBDAC4] rounded-sm overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#CBDAC4] text-[#285A40] font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Item & Route / Origin</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Benchmark Rate</th>
                  <th className="py-3 px-4">Stability / Syndicate</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBDAC4]/60">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#123D2D] text-sm">{row.item}</div>
                      <div className="text-[11px] text-[#576159] font-mono mt-0.5">{row.route_or_origin}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-[#FAF8F5] border border-[#CBDAC4] rounded-xs uppercase">
                        {row.category === 'transit' ? <Car className="w-3 h-3 text-[#285A40]" /> : <Sprout className="w-3 h-3 text-[#285A40]" />}
                        <span>{row.category}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-[#123D2D] font-bold text-sm">
                        {row.primary_rate} <span className="text-xs text-[#576159] font-normal">{row.rate_unit}</span>
                      </div>
                      {row.secondary_rate && (
                        <div className="text-[10px] text-[#576159] mt-0.5">
                          {row.secondary_rate} ({row.secondary_label || 'Alternate'})
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] font-mono text-[#576159]">
                      <div className="text-[#123D2D] font-medium">{row.stability_score}% stability index</div>
                      <div className="text-[10px]">{row.verified_by}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(row)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase transition-colors ${
                          row.is_published
                            ? 'bg-[#285A40]/15 text-[#285A40] hover:bg-[#285A40]/25'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {row.is_published ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-[#285A40]" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-amber-700" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(row)}
                          className="p-1.5 text-[#576159] hover:text-[#123D2D] hover:bg-[#F3EFE6] rounded-sm transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingItem(row)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#FAF8F5] border border-[#CBDAC4] text-[#123D2D] w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-[#CBDAC4] bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#285A40]" />
                <h2 className="font-serif text-lg font-normal">
                  {editingItem ? 'Edit Price Benchmark' : 'Add Syndicate Price Benchmark'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#576159] hover:text-[#123D2D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {!editingItem && (
                <div className="p-3 bg-[#F3EFE6] border border-[#CBDAC4] rounded-sm">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#285A40] font-bold mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quick Benchmark Templates:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.name}
                        type="button"
                        onClick={() => applyTemplate(tmpl)}
                        className="text-xs font-mono px-2.5 py-1 bg-white border border-[#CBDAC4] text-[#123D2D] hover:bg-[#123D2D] hover:text-white rounded-sm"
                      >
                        + {tmpl.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form id="price-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                      Benchmark Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as 'transit' | 'farmgate')}
                      className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#285A40]"
                    >
                      <option value="transit">Ground Transit Syndicate (Taxi / Sumo / Bus)</option>
                      <option value="farmgate">Farmgate Agriculture Benchmark (Tea / Spice)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                      Item / Route Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={item}
                      onChange={(e) => setItem(e.target.value)}
                      placeholder="e.g. Siliguri ⇄ Gangtok Main Stand"
                      className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#285A40]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                    Corridor / Region Origin *
                  </label>
                  <input
                    type="text"
                    required
                    value={routeOrOrigin}
                    onChange={(e) => setRouteOrOrigin(e.target.value)}
                    placeholder="e.g. National Highway 10 Corridors"
                    className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#285A40]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                      Primary Rate *
                    </label>
                    <input
                      type="text"
                      required
                      value={primaryRate}
                      onChange={(e) => setPrimaryRate(e.target.value)}
                      placeholder="e.g. ₹350"
                      className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#285A40]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                      Rate Unit *
                    </label>
                    <input
                      type="text"
                      required
                      value={rateUnit}
                      onChange={(e) => setRateUnit(e.target.value)}
                      placeholder="e.g. / seat (Shared Sumo)"
                      className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#285A40]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                      Secondary Rate (Optional)
                    </label>
                    <input
                      type="text"
                      value={secondaryRate}
                      onChange={(e) => setSecondaryRate(e.target.value)}
                      placeholder="e.g. ₹3,200"
                      className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#285A40]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                      Secondary Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={secondaryLabel}
                      onChange={(e) => setSecondaryLabel(e.target.value)}
                      placeholder="e.g. Private Sumo Hire"
                      className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#285A40]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                      Stability Score (%)
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={100}
                      value={stabilityScore}
                      onChange={(e) => setStabilityScore(Number(e.target.value))}
                      className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#285A40]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                      Verifying Syndicate Authority
                    </label>
                    <input
                      type="text"
                      value={verifiedBy}
                      onChange={(e) => setVerifiedBy(e.target.value)}
                      placeholder="e.g. Siliguri Transport Syndicate"
                      className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs rounded-sm focus:outline-none focus:border-[#285A40]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#285A40] font-bold mb-1">
                    Trend Summary & Transparency Note
                  </label>
                  <textarea
                    rows={2}
                    value={trendSummary}
                    onChange={(e) => setTrendSummary(e.target.value)}
                    placeholder="Describe seasonal price stability, monsoon route conditions, or collective counter guarantees..."
                    className="w-full bg-white border border-[#CBDAC4] p-3 text-xs rounded-sm focus:outline-none focus:border-[#285A40]"
                  />
                </div>

                {/* Status Toggle */}
                <div className="p-3 bg-white border border-[#CBDAC4] rounded-sm flex items-center justify-between">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#123D2D]">
                    Publish on Public Price Ledger
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

            <div className="px-6 py-4 border-t border-[#CBDAC4] bg-white flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-[#CBDAC4] text-xs font-mono text-[#576159] hover:bg-[#F3EFE6] rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="price-form"
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#123D2D] hover:bg-[#285A40] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{editingItem ? 'Update Benchmark' : 'Create Benchmark'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF8F5] border border-red-300 text-[#123D2D] w-full max-w-md rounded-sm shadow-2xl overflow-hidden p-6">
            <h3 className="font-serif text-lg text-red-700">Delete Price Benchmark?</h3>
            <p className="text-xs text-[#576159] mt-2">
              Are you sure you want to permanently delete <strong className="text-[#123D2D]">"{deletingItem.item}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 mt-5 pt-3 border-t border-[#CBDAC4]">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-1.5 border border-[#CBDAC4] text-xs font-mono text-[#576159]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-sm"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
