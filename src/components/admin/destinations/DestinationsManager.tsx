import { useState, useEffect, useCallback } from 'react'
import type { FC } from 'react'
import {
  Compass,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  LayoutGrid,
  List,
  MapPin,
  Copy,
  Check
} from 'lucide-react'
import type { AdminDestination } from '../../../types'
import {
  fetchAdminDestinations,
  toggleAdminDestinationPublish,
  deleteAdminDestination
} from '../../../services/adminDestinationService'
import { DestinationFormModal } from './DestinationFormModal'
import { DeleteConfirmModal } from './DeleteConfirmModal'

export const DestinationsManager: FC = () => {
  const [destinations, setDestinations] = useState<AdminDestination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingDestination, setEditingDestination] = useState<AdminDestination | null>(null)
  const [deletingDestination, setDeletingDestination] = useState<AdminDestination | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [copiedSql, setCopiedSql] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Load destinations
  const loadDestinations = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setPermissionDenied(false)

    const res = await fetchAdminDestinations()

    if (res.error) {
      setError(res.error)
      if (res.permissionDenied) {
        setPermissionDenied(true)
      }
    } else {
      setDestinations(res.data)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadDestinations()
  }, [loadDestinations])

  // Toggle publish/unpublish
  const handleTogglePublish = async (dest: AdminDestination) => {
    const newStatus = !dest.isPublished
    const res = await toggleAdminDestinationPublish(dest.id, newStatus)

    if (res.error) {
      showToast(`Error: ${res.error}`)
    } else {
      setDestinations((prev) =>
        prev.map((d) => (d.id === dest.id ? { ...d, isPublished: newStatus } : d))
      )
      showToast(newStatus ? `"${dest.name}" is now Live` : `"${dest.name}" saved as Draft`)
    }
  }

  // Handle Delete confirm
  const handleConfirmDelete = async () => {
    if (!deletingDestination) return
    setIsDeleting(true)

    const res = await deleteAdminDestination(deletingDestination.id)

    if (res.error) {
      showToast(`Delete failed: ${res.error}`)
    } else {
      setDestinations((prev) => prev.filter((d) => d.id !== deletingDestination.id))
      showToast(`"${deletingDestination.name}" deleted successfully`)
      setDeletingDestination(null)
    }

    setIsDeleting(false)
  }

  // Handle form success
  const handleFormSuccess = (savedDest: AdminDestination, isEdit: boolean) => {
    if (isEdit) {
      setDestinations((prev) => prev.map((d) => (d.id === savedDest.id ? savedDest : d)))
      showToast(`Updated "${savedDest.name}"`)
    } else {
      setDestinations((prev) => [savedDest, ...prev])
      showToast(`Created sanctuary "${savedDest.name}"`)
    }
    setFormModalOpen(false)
    setEditingDestination(null)
  }

  // Copy SQL snippet
  const handleCopySql = () => {
    const sql = `GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, anon; GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;`
    navigator.clipboard.writeText(sql)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 3000)
  }

  // Filter calculations
  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.region.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRegion = regionFilter === 'all' || dest.region === regionFilter

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'published'
        ? dest.isPublished
        : !dest.isPublished

    return matchesSearch && matchesRegion && matchesStatus
  })

  // Metrics
  const totalCount = destinations.length
  const publishedCount = destinations.filter((d) => d.isPublished).length
  const draftCount = destinations.filter((d) => !d.isPublished).length
  const featuredCount = destinations.filter((d) => d.featured).length

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B2516] border border-[#8FA777] text-white px-5 py-3 rounded-sm shadow-2xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#8FA777]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#CBDAC4]">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.24em] text-[#285A40] font-bold mb-1">
            <Compass className="w-3.5 h-3.5 text-[#285A40]" />
            <span>MODULE 01 • BOTANICAL ATLAS MANAGEMENT</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#123D2D] font-normal tracking-tight">
            Destinations & Sanctuaries
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#576159] font-light">
            Manage high-altitude tea belt sanctuaries, geographic coordinates, seasonal windows, and editorial narratives.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadDestinations}
            disabled={isLoading}
            className="p-2.5 border border-[#CBDAC4] text-[#123D2D] hover:bg-white rounded-sm transition-colors text-xs font-mono"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingDestination(null)
              setFormModalOpen(true)
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#123D2D] hover:bg-[#0A241A] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#8FA777]" />
            <span>New Destination</span>
          </button>
        </div>
      </div>

      {/* Permission Denied Helper Alert */}
      {permissionDenied && (
        <div className="p-4 sm:p-5 bg-amber-50 border border-amber-300 rounded-sm text-xs text-amber-900 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-sm">
                Supabase PostgreSQL Permission Required
              </strong>
              <p className="mt-0.5 text-xs text-amber-800 leading-relaxed font-sans">
                PostgreSQL returned error code <code className="bg-amber-100 px-1 py-0.5 font-mono">42501 (permission denied)</code>. To allow full read/write access to your Supabase tables, copy and execute this permission grant in your Supabase SQL Editor:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-100/80 p-2.5 rounded border border-amber-300/80 font-mono text-[11px] overflow-x-auto">
            <span className="flex-1 select-all truncate text-amber-950">
              GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, anon; GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;
            </span>
            <button
              type="button"
              onClick={handleCopySql}
              className="inline-flex items-center gap-1 px-3 py-1 bg-amber-900 text-white rounded text-[10px] uppercase font-semibold shrink-0"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy SQL</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono">
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-[#576159]">Total Recorded</div>
          <div className="font-serif text-2xl sm:text-3xl text-[#123D2D] font-normal mt-1">
            {totalCount}
          </div>
        </div>

        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-emerald-700">Published Live</div>
          <div className="font-serif text-2xl sm:text-3xl text-emerald-800 font-normal mt-1">
            {publishedCount}
          </div>
        </div>

        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-amber-700">Drafts / Inactive</div>
          <div className="font-serif text-2xl sm:text-3xl text-amber-800 font-normal mt-1">
            {draftCount}
          </div>
        </div>

        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm shadow-xs">
          <div className="text-[10px] uppercase tracking-wider text-[#285A40]">Homepage Featured</div>
          <div className="font-serif text-2xl sm:text-3xl text-[#285A40] font-normal mt-1">
            {featuredCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs font-mono">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#576159] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sanctuary name, region, or keywords..."
            className="w-full pl-9 pr-3 py-2 bg-[#F8F6F0] border border-[#CBDAC4] text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Region Dropdown */}
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-2 bg-[#F8F6F0] border border-[#CBDAC4] text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
          >
            <option value="all">All Regions</option>
            <option value="Darjeeling Tea Belt">Darjeeling Tea Belt</option>
            <option value="Kalimpong Green Ridge">Kalimpong Green Ridge</option>
            <option value="Sikkim Forest Valleys">Sikkim Forest Valleys</option>
            <option value="Dooars Sal Canopy">Dooars Sal Canopy</option>
            <option value="Singalila Alpine Ridge">Singalila Alpine Ridge</option>
          </select>

          {/* Status Tabs */}
          <div className="inline-flex border border-[#CBDAC4] rounded-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 transition-colors ${
                statusFilter === 'all' ? 'bg-[#123D2D] text-white font-semibold' : 'hover:bg-gray-100 text-[#576159]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 transition-colors ${
                statusFilter === 'published' ? 'bg-[#123D2D] text-white font-semibold' : 'hover:bg-gray-100 text-[#576159]'
              }`}
            >
              Live
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 transition-colors ${
                statusFilter === 'draft' ? 'bg-[#123D2D] text-white font-semibold' : 'hover:bg-gray-100 text-[#576159]'
              }`}
            >
              Drafts
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex border border-[#CBDAC4] rounded-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 ${viewMode === 'table' ? 'bg-[#123D2D] text-white' : 'hover:bg-gray-100 text-[#576159]'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#123D2D] text-white' : 'hover:bg-gray-100 text-[#576159]'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Loading, Error, Empty, or Data Views */}
      {isLoading ? (
        <div className="bg-white border border-[#CBDAC4] p-12 text-center rounded-sm space-y-3">
          <RefreshCw className="w-6 h-6 text-[#285A40] animate-spin mx-auto" />
          <p className="text-xs font-mono text-[#576159]">Querying Supabase destinations ledger...</p>
        </div>
      ) : error && !permissionDenied ? (
        <div className="bg-red-50 border border-red-300 p-6 rounded-sm text-center text-xs text-red-800 font-mono space-y-3">
          <AlertCircle className="w-6 h-6 text-red-600 mx-auto" />
          <p>Database error: {error}</p>
          <button
            type="button"
            onClick={loadDestinations}
            className="px-4 py-2 bg-red-700 text-white rounded-sm uppercase tracking-wider text-[10px]"
          >
            Retry Query
          </button>
        </div>
      ) : filteredDestinations.length === 0 ? (
        /* Clean Editorial Empty State */
        <div className="bg-white border border-[#CBDAC4] p-12 sm:p-16 text-center rounded-sm shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#E8EFE3] border border-[#CBDAC4] flex items-center justify-center mx-auto mb-4 text-[#285A40]">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl text-[#123D2D] font-normal">
            No Destinations Found
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#576159] font-light max-w-md mx-auto leading-relaxed">
            {searchQuery || regionFilter !== 'all' || statusFilter !== 'all'
              ? 'No destinations match your active filters. Clear search or reset filter parameters.'
              : 'Your Supabase destinations table is currently empty. Create your first botanical sanctuary to display on the public atlas.'}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            {searchQuery || regionFilter !== 'all' || statusFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setRegionFilter('all')
                  setStatusFilter('all')
                }}
                className="px-4 py-2 border border-[#CBDAC4] text-[#123D2D] text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-gray-50"
              >
                Reset Filters
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setEditingDestination(null)
                setFormModalOpen(true)
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#123D2D] hover:bg-[#0A241A] text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#8FA777]" />
              <span>Add First Destination</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* Tabular Management View */
        <div className="bg-white border border-[#CBDAC4] rounded-sm shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#E8EFE3] border-b border-[#CBDAC4] text-[#123D2D] font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Sanctuary</th>
                <th className="py-3 px-4">Region & Elevation</th>
                <th className="py-3 px-4">Season</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBDAC4]/60">
              {filteredDestinations.map((dest) => (
                <tr key={dest.id} className="hover:bg-[#F8F6F0]/70 transition-colors">
                  {/* Sanctuary Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-12 h-10 object-cover rounded-sm border border-[#CBDAC4] shrink-0"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=80'
                        }}
                      />
                      <div>
                        <div className="font-serif text-sm font-medium text-[#123D2D]">
                          {dest.name}
                        </div>
                        <div className="text-[11px] text-[#576159] line-clamp-1">{dest.subtitle}</div>
                      </div>
                    </div>
                  </td>

                  {/* Region & Elevation */}
                  <td className="py-3 px-4 font-mono text-xs text-[#576159]">
                    <div className="text-[#123D2D] font-medium">{dest.region}</div>
                    <div className="text-[11px] text-[#576159] mt-0.5">{dest.elevation}</div>
                  </td>

                  {/* Season */}
                  <td className="py-3 px-4 text-xs text-[#576159] max-w-[160px] truncate">
                    {dest.season}
                  </td>

                  {/* Status Toggle Switch */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(dest)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider font-semibold border transition-colors ${
                        dest.isPublished
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      {dest.isPublished ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-amber-600" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Featured Badge */}
                  <td className="py-3 px-4 text-center">
                    {dest.featured ? (
                      <span className="inline-block px-2 py-0.5 bg-[#285A40]/15 text-[#123D2D] text-[10px] font-mono rounded-sm font-semibold">
                        ★ Hero Atlas
                      </span>
                    ) : (
                      <span className="text-[#576159]/60 font-mono text-[11px]">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDestination(dest)
                          setFormModalOpen(true)
                        }}
                        className="p-1.5 text-[#576159] hover:text-[#123D2D] hover:bg-[#E8EFE3] rounded-sm transition-colors"
                        title="Edit destination record"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingDestination(dest)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                        title="Delete destination"
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
      ) : (
        /* Visual Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white border border-[#CBDAC4] rounded-sm overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#285A40] transition-colors"
            >
              <div>
                {/* Image Cover with Status Tag */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
                    }}
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(dest)}
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-semibold rounded-sm shadow-sm border ${
                        dest.isPublished
                          ? 'bg-emerald-900/90 text-white border-emerald-500'
                          : 'bg-amber-900/90 text-white border-amber-500'
                      }`}
                    >
                      {dest.isPublished ? '● Live' : '○ Draft'}
                    </button>

                    {dest.featured && (
                      <span className="px-2 py-0.5 bg-[#0B2516]/90 text-[#F8F6F0] text-[9px] font-mono uppercase tracking-wider rounded-sm border border-white/20">
                        ★ Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#285A40] uppercase tracking-wider font-semibold mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>{dest.region}</span>
                    <span className="text-[#CBDAC4]">•</span>
                    <span>{dest.elevation}</span>
                  </div>

                  <h3 className="font-serif text-lg text-[#123D2D] font-medium leading-snug">
                    {dest.name}
                  </h3>

                  <p className="text-xs text-[#576159] mt-1.5 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-[#F8F6F0] border-t border-[#CBDAC4] flex items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-[#576159] truncate max-w-[140px]">
                  {dest.season}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDestination(dest)
                      setFormModalOpen(true)
                    }}
                    className="p-1.5 text-[#576159] hover:text-[#123D2D] hover:bg-white rounded-sm"
                    title="Edit destination"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingDestination(dest)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-white rounded-sm"
                    title="Delete destination"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Destination Form Modal (Create / Edit) */}
      <DestinationFormModal
        isOpen={formModalOpen}
        destinationToEdit={editingDestination}
        onClose={() => {
          setFormModalOpen(false)
          setEditingDestination(null)
        }}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        destination={deletingDestination}
        isOpen={Boolean(deletingDestination)}
        isDeleting={isDeleting}
        onClose={() => setDeletingDestination(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
