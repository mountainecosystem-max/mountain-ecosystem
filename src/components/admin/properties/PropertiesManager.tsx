import { useState, useEffect, useCallback } from 'react'
import type { FC } from 'react'
import {
  Home,
  Search,
  RefreshCw,
  AlertCircle,
  Plus,
  MapPin,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  Wifi,
  Users
} from 'lucide-react'
import type { AdminHomestay } from '../../../types'
import {
  fetchAdminHomestays,
  toggleAdminHomestayPublish,
  deleteAdminHomestay
} from '../../../services/adminHomestayService'
import { HomestayFormModal } from './HomestayFormModal'
import { HomestayDeleteConfirmModal } from './HomestayDeleteConfirmModal'

export const PropertiesManager: FC = () => {
  const [homestays, setHomestays] = useState<AdminHomestay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [leaseFilter, setLeaseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingHomestay, setEditingHomestay] = useState<AdminHomestay | null>(null)
  const [deletingHomestay, setDeletingHomestay] = useState<AdminHomestay | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const loadProperties = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setPermissionDenied(false)

    const res = await fetchAdminHomestays()

    if (res.error) {
      setError(res.error)
      if (res.permissionDenied) setPermissionDenied(true)
    } else {
      setHomestays(res.data)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadProperties()
  }, [loadProperties])

  const handleTogglePublish = async (h: AdminHomestay) => {
    const newStatus = !h.isPublished
    const res = await toggleAdminHomestayPublish(h.id, newStatus)

    if (res.error) {
      showToast(`Error: ${res.error}`)
    } else {
      setHomestays((prev) =>
        prev.map((item) => (item.id === h.id ? { ...item, isPublished: newStatus } : item))
      )
      showToast(newStatus ? `"${h.name}" is now Live` : `"${h.name}" saved as Draft`)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingHomestay) return
    setIsDeleting(true)

    const res = await deleteAdminHomestay(deletingHomestay.id)
    if (res.error) {
      showToast(`Error: ${res.error}`)
    } else {
      setHomestays((prev) => prev.filter((item) => item.id !== deletingHomestay.id))
      showToast(`Deleted "${deletingHomestay.name}"`)
      setDeletingHomestay(null)
    }
    setIsDeleting(false)
  }

  const handleModalSuccess = (saved: AdminHomestay, isEdit: boolean) => {
    if (isEdit) {
      setHomestays((prev) => prev.map((item) => (item.id === saved.id ? saved : item)))
      showToast(`Updated "${saved.name}"`)
    } else {
      setHomestays((prev) => [saved, ...prev])
      showToast(`Created "${saved.name}"`)
    }
  }

  // Filter logic
  const filtered = homestays.filter((h) => {
    const matchesSearch =
      search === '' ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.region.toLowerCase().includes(search.toLowerCase()) ||
      h.location.toLowerCase().includes(search.toLowerCase()) ||
      h.host.name.toLowerCase().includes(search.toLowerCase())

    const matchesRegion = regionFilter === 'all' || h.region === regionFilter
    const matchesLease = leaseFilter === 'all' || h.leaseStatus === leaseFilter

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && h.isPublished) ||
      (statusFilter === 'draft' && !h.isPublished)

    return matchesSearch && matchesRegion && matchesLease && matchesStatus
  })

  const publishedCount = homestays.filter((h) => h.isPublished).length
  const draftCount = homestays.filter((h) => !h.isPublished).length
  const availableCount = homestays.filter((h) => h.leaseStatus === 'Available for Lease').length

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
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
            <Home className="w-3.5 h-3.5 text-[#285A40]" />
            <span>MODULE 03 • RESIDENTIAL LEASES & SANCTUARIES</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#123D2D] font-normal tracking-tight">
            Homestays & Residential Leases
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#576159] font-light">
            Manage long-term sabbatical leases, hand-dressed stone cottages, cedar lofts, and resident host verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadProperties}
            disabled={isLoading}
            className="p-2.5 border border-[#CBDAC4] text-[#123D2D] hover:bg-white rounded-sm transition-colors text-xs font-mono"
            title="Refresh homestays database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingHomestay(null)
              setFormModalOpen(true)
            }}
            className="inline-flex items-center gap-2 bg-[#123D2D] hover:bg-[#285A40] text-white px-4 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Homestay</span>
          </button>
        </div>
      </div>

      {/* Permission Warning */}
      {permissionDenied && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-sm flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-mono font-bold uppercase tracking-wider">
              RLS Policy Authorization Notice
            </div>
            <div>
              Your current authenticated session could not write to <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">homestays</code>. Ensure you are signed in with an authorized administrator email.
            </div>
          </div>
        </div>
      )}

      {error && !permissionDenied && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-sm flex items-start gap-3 text-xs text-red-900">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#576159] tracking-wider">Total Properties</div>
          <div className="text-2xl font-serif text-[#123D2D] font-normal mt-1">{homestays.length}</div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#285A40] tracking-wider font-bold">Live on Website</div>
          <div className="text-2xl font-serif text-[#285A40] font-normal mt-1">{publishedCount}</div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#576159] tracking-wider">Draft / Internal</div>
          <div className="text-2xl font-serif text-[#576159] font-normal mt-1">{draftCount}</div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#285A40] tracking-wider">Available for Lease</div>
          <div className="text-2xl font-serif text-[#123D2D] font-normal mt-1">{availableCount}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="inline-flex rounded-sm border border-[#CBDAC4] p-1 bg-[#F8F6F0] text-xs font-mono">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#123D2D] text-white shadow-xs font-semibold'
                  : 'text-[#576159] hover:text-[#123D2D]'
              }`}
            >
              All Properties ({homestays.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                statusFilter === 'published'
                  ? 'bg-[#123D2D] text-white shadow-xs font-semibold'
                  : 'text-[#576159] hover:text-[#123D2D]'
              }`}
            >
              Live ({publishedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                statusFilter === 'draft'
                  ? 'bg-[#123D2D] text-white shadow-xs font-semibold'
                  : 'text-[#576159] hover:text-[#123D2D]'
              }`}
            >
              Drafts ({draftCount})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <div className="inline-flex border border-[#CBDAC4] rounded-sm p-0.5 bg-[#F8F6F0]">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xs transition-colors ${
                  viewMode === 'table' ? 'bg-[#123D2D] text-white' : 'text-[#576159] hover:text-[#123D2D]'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-[#123D2D] text-white' : 'text-[#576159] hover:text-[#123D2D]'
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Input & dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#576159] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by property, valley, host..."
              className="w-full bg-[#FAF8F5] border border-[#CBDAC4] pl-9 pr-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
            />
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
          >
            <option value="all">All Regions</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Darjeeling">Darjeeling</option>
            <option value="Kalimpong">Kalimpong</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
          </select>

          <select
            value={leaseFilter}
            onChange={(e) => setLeaseFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
          >
            <option value="all">All Lease Statuses</option>
            <option value="Available for Lease">Available for Lease</option>
            <option value="Reserved for Resident">Reserved for Resident</option>
            <option value="Under Negotiation">Under Negotiation</option>
            <option value="Seasonal Hold">Seasonal Hold</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="p-12 text-center bg-white border border-[#CBDAC4] rounded-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#285A40] mb-3" />
          <div className="text-xs font-mono text-[#576159]">Connecting to Supabase homestays table...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#CBDAC4] rounded-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F3EFE6] text-[#285A40] flex items-center justify-center mx-auto">
            <Home className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg text-[#123D2D]">No Homestay Properties Found</h3>
          <p className="text-xs text-[#576159] max-w-md mx-auto">
            {homestays.length === 0
              ? 'Your homestays table currently contains zero properties. Register a stone-and-timber sanctuary to begin.'
              : 'No properties match your search or filter parameters. Try clearing your filters.'}
          </p>
          {homestays.length === 0 && (
            <button
              type="button"
              onClick={() => {
                setEditingHomestay(null)
                setFormModalOpen(true)
              }}
              className="inline-flex items-center gap-2 bg-[#123D2D] hover:bg-[#285A40] text-white px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Register First Sanctuary</span>
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white border border-[#CBDAC4] rounded-sm overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#CBDAC4] text-[#285A40] font-mono uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Sanctuary & Photo</th>
                  <th className="py-3 px-4">Location / Elevation</th>
                  <th className="py-3 px-4">Host Stewardship</th>
                  <th className="py-3 px-4">Rate & Lease Status</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBDAC4]/60">
                {filtered.map((h) => {
                  const mainPhoto = h.images?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80'
                  return (
                    <tr key={h.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      {/* Sanctuary & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={mainPhoto}
                            alt={h.name}
                            className="w-12 h-12 rounded-sm object-cover border border-[#CBDAC4] shrink-0"
                          />
                          <div>
                            <div className="font-medium text-[#123D2D] text-sm">{h.name}</div>
                            <div className="text-[11px] text-[#576159] font-mono mt-0.5">
                              {h.roomType} • {h.furnishing}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location & Elevation */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-[#123D2D]">
                          <MapPin className="w-3.5 h-3.5 text-[#285A40]" />
                          <span>{h.region}</span>
                        </div>
                        <div className="text-[11px] text-[#576159] pl-5">{h.location} • {h.elevation}</div>
                      </td>

                      {/* Host Stewardship */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-[#123D2D]">{h.host.name}</div>
                        <div className="text-[11px] text-[#576159]">{h.host.role} ({h.host.yearsHosting}y)</div>
                      </td>

                      {/* Rate & Status */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-[#123D2D] font-medium">{h.monthlyRate}</div>
                        <div className="text-[10px] text-[#285A40] mt-0.5">{h.leaseStatus}</div>
                      </td>

                      {/* Publication Status toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(h)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase transition-colors ${
                            h.isPublished
                              ? 'bg-[#285A40]/15 text-[#285A40] hover:bg-[#285A40]/25'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          title="Click to toggle publish status"
                        >
                          {h.isPublished ? (
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

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingHomestay(h)
                              setFormModalOpen(true)
                            }}
                            className="p-1.5 text-[#576159] hover:text-[#123D2D] hover:bg-[#F3EFE6] rounded-sm transition-colors"
                            title="Edit Homestay"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingHomestay(h)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                            title="Delete Homestay"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((h) => {
            const mainPhoto = h.images?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
            return (
              <div
                key={h.id}
                className="bg-white border border-[#CBDAC4] rounded-sm overflow-hidden flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="relative aspect-video bg-black/10">
                    <img src={mainPhoto} alt={h.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(h)}
                      className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider uppercase backdrop-blur-xs ${
                        h.isPublished
                          ? 'bg-[#123D2D]/90 text-[#F8F6F0] border border-[#8FA777]/40'
                          : 'bg-amber-900/90 text-amber-100 border border-amber-500/40'
                      }`}
                    >
                      {h.isPublished ? 'Live' : 'Draft'}
                    </button>
                    <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-xs">
                      {h.region} • {h.elevation}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-serif text-lg text-[#123D2D] leading-snug">{h.name}</h3>
                      <div className="text-xs text-[#576159] mt-0.5">{h.location}</div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[#CBDAC4]/50">
                      <span className="font-bold text-[#123D2D]">{h.monthlyRate}</span>
                      <span className="text-[#285A40] text-[11px]">{h.leaseStatus}</span>
                    </div>

                    <div className="text-xs text-[#576159] line-clamp-2 leading-relaxed">
                      {h.description}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#576159] pt-1">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#285A40]" />
                        <span>{h.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wifi className="w-3.5 h-3.5 text-[#285A40]" />
                        <span className="truncate max-w-[120px]">{h.wifi}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-[#CBDAC4] bg-[#FAF8F5] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#576159]">
                    Host: <span className="font-semibold text-[#123D2D]">{h.host.name}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingHomestay(h)
                        setFormModalOpen(true)
                      }}
                      className="p-1.5 text-[#576159] hover:text-[#123D2D] hover:bg-white rounded-sm transition-colors text-xs font-mono inline-flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingHomestay(h)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors text-xs font-mono inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      <HomestayFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSuccess={handleModalSuccess}
        editingHomestay={editingHomestay}
      />

      <HomestayDeleteConfirmModal
        isOpen={Boolean(deletingHomestay)}
        onClose={() => setDeletingHomestay(null)}
        onConfirm={handleConfirmDelete}
        homestay={deletingHomestay}
        isDeleting={isDeleting}
      />
    </div>
  )
}
