import { useState, useEffect, useCallback } from 'react'
import type { FC } from 'react'
import {
  Briefcase,
  Search,
  RefreshCw,
  AlertCircle,
  Plus,
  MapPin,
  Building,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  LayoutGrid,
  List,
  Home
} from 'lucide-react'
import type { AdminJob } from '../../../types'
import {
  fetchAdminJobs,
  toggleAdminJobPublish,
  deleteAdminJob
} from '../../../services/adminJobService'
import { JobFormModal } from './JobFormModal'
import { JobDeleteConfirmModal } from './JobDeleteConfirmModal'

export const JobsManager: FC = () => {
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)

  // Filters
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<AdminJob | null>(null)
  const [deletingJob, setDeletingJob] = useState<AdminJob | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const loadJobs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setPermissionDenied(false)

    const res = await fetchAdminJobs()

    if (res.error) {
      setError(res.error)
      if (res.permissionDenied) setPermissionDenied(true)
    } else {
      setJobs(res.data)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadJobs()

    const handleUpdate = () => {
      loadJobs()
    }
    window.addEventListener('mountain_data_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('mountain_data_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [loadJobs])

  const handleTogglePublish = async (job: AdminJob) => {
    const newStatus = !job.isPublished
    const res = await toggleAdminJobPublish(job.id, newStatus)

    if (res.error) {
      showToast(`Error: ${res.error}`)
    } else {
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, isPublished: newStatus } : j))
      )
      showToast(newStatus ? `"${job.title}" is now Live` : `"${job.title}" saved as Draft`)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingJob) return
    setIsDeleting(true)

    const res = await deleteAdminJob(deletingJob.id)
    if (res.error) {
      showToast(`Error: ${res.error}`)
    } else {
      setJobs((prev) => prev.filter((j) => j.id !== deletingJob.id))
      showToast(`Deleted "${deletingJob.title}"`)
      setDeletingJob(null)
    }
    setIsDeleting(false)
  }

  const handleModalSuccess = (savedJob: AdminJob, isEdit: boolean) => {
    if (isEdit) {
      setJobs((prev) => prev.map((j) => (j.id === savedJob.id ? savedJob : j)))
      showToast(`Updated "${savedJob.title}"`)
    } else {
      setJobs((prev) => [savedJob, ...prev])
      showToast(`Created "${savedJob.title}"`)
    }
  }

  // Filter logic
  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      search === '' ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.employer.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase()) ||
      j.region.toLowerCase().includes(search.toLowerCase())

    const matchesRegion = regionFilter === 'all' || j.region === regionFilter
    const matchesCategory = categoryFilter === 'all' || j.category === categoryFilter

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && j.isPublished) ||
      (statusFilter === 'draft' && !j.isPublished)

    return matchesSearch && matchesRegion && matchesCategory && matchesStatus
  })

  const publishedCount = jobs.filter((j) => j.isPublished).length
  const draftCount = jobs.filter((j) => !j.isPublished).length
  const housingCount = jobs.filter((j) => j.housingIncluded).length

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
            <Briefcase className="w-3.5 h-3.5 text-[#285A40]" />
            <span>MODULE 02 • RESIDENCIES & MOUNTAIN WORK</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#123D2D] font-normal tracking-tight">
            Mountain Jobs & Residencies
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#576159] font-light">
            Verified tea estate fellowships, botanical apprenticeships, mountain guides, and high-altitude cooperative positions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadJobs}
            disabled={isLoading}
            className="p-2.5 border border-[#CBDAC4] text-[#123D2D] hover:bg-white rounded-sm transition-colors text-xs font-mono"
            title="Refresh jobs database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingJob(null)
              setFormModalOpen(true)
            }}
            className="inline-flex items-center gap-2 bg-[#123D2D] hover:bg-[#285A40] text-white px-4 py-2.5 rounded-sm text-xs font-mono uppercase tracking-wider font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Post Residency / Job</span>
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
              Your current authenticated session could not write to <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">mountain_jobs</code>. Ensure you are signed in with an authorized administrator email.
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
          <div className="text-[10px] uppercase text-[#576159] tracking-wider">Total Listings</div>
          <div className="text-2xl font-serif text-[#123D2D] font-normal mt-1">{jobs.length}</div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#285A40] tracking-wider font-bold">Live on Homepage</div>
          <div className="text-2xl font-serif text-[#285A40] font-normal mt-1">{publishedCount}</div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#576159] tracking-wider">Draft / Internal</div>
          <div className="text-2xl font-serif text-[#576159] font-normal mt-1">{draftCount}</div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#576159] tracking-wider">Housing Provided</div>
          <div className="text-2xl font-serif text-[#123D2D] font-normal mt-1">{housingCount}</div>
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
              All Listings ({jobs.length})
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
              placeholder="Search by role, employer, or valley..."
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
          >
            <option value="all">All Categories</option>
            <option value="Hospitality & Estates">Hospitality & Estates</option>
            <option value="Guiding & Conservation">Guiding & Conservation</option>
            <option value="Agriculture & Craft">Agriculture & Craft</option>
            <option value="Digital & Remote">Digital & Remote</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="p-12 text-center bg-white border border-[#CBDAC4] rounded-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#285A40] mb-3" />
          <div className="text-xs font-mono text-[#576159]">Connecting to Supabase mountain_jobs table...</div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-12 text-center bg-white border border-[#CBDAC4] rounded-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F3EFE6] text-[#285A40] flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg text-[#123D2D]">No Mountain Residencies Found</h3>
          <p className="text-xs text-[#576159] max-w-md mx-auto">
            {jobs.length === 0
              ? 'Your mountain_jobs table currently contains zero listings. Post a verified estate fellowship or click below to populate one.'
              : 'No listings match your search or filter parameters. Try clearing your filters.'}
          </p>
          {jobs.length === 0 && (
            <button
              type="button"
              onClick={() => {
                setEditingJob(null)
                setFormModalOpen(true)
              }}
              className="inline-flex items-center gap-2 bg-[#123D2D] hover:bg-[#285A40] text-white px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm transition-colors mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post First Residency</span>
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
                  <th className="py-3 px-4">Role & Employer</th>
                  <th className="py-3 px-4">Region / Valley</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Salary / Housing</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBDAC4]/60">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    {/* Role & Employer */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#123D2D] text-sm">{job.title}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-[#576159] text-[11px]">
                        <Building className="w-3 h-3 text-[#285A40]" />
                        <span>{job.employer}</span>
                        {job.employerBadge && (
                          <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#F3EFE6] text-[#285A40] border border-[#CBDAC4] rounded-xs">
                            {job.employerBadge}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Region */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-[#123D2D]">
                        <MapPin className="w-3.5 h-3.5 text-[#285A40]" />
                        <span>{job.region}</span>
                      </div>
                      <div className="text-[11px] text-[#576159] pl-5">{job.location}</div>
                    </td>

                    {/* Category & Type */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-[11px] text-[#123D2D]">{job.category}</div>
                      <div className="text-[10px] text-[#576159]">{job.type}</div>
                    </td>

                    {/* Salary & Housing */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-[11px] text-[#123D2D] font-medium">{job.salary}</div>
                      {job.housingIncluded && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-[#285A40]">
                          <Home className="w-3 h-3" />
                          <span>Housing Included</span>
                        </div>
                      )}
                    </td>

                    {/* Status toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(job)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase transition-colors ${
                          job.isPublished
                            ? 'bg-[#285A40]/15 text-[#285A40] hover:bg-[#285A40]/25'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {job.isPublished ? (
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
                            setEditingJob(job)
                            setFormModalOpen(true)
                          }}
                          className="p-1.5 text-[#576159] hover:text-[#123D2D] hover:bg-[#F3EFE6] rounded-sm transition-colors"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingJob(job)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors"
                          title="Delete Job"
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
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-[#CBDAC4] rounded-sm p-5 space-y-4 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-[#FAF8F5] border border-[#CBDAC4] text-[#285A40] uppercase rounded-xs">
                    {job.category} • {job.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(job)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider uppercase ${
                      job.isPublished
                        ? 'bg-[#285A40]/15 text-[#285A40]'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {job.isPublished ? 'Live' : 'Draft'}
                  </button>
                </div>

                <div>
                  <h3 className="font-serif text-lg text-[#123D2D] leading-snug">{job.title}</h3>
                  <div className="text-xs text-[#576159] mt-1 font-medium">{job.employer}</div>
                </div>

                <div className="text-xs text-[#576159] line-clamp-3 leading-relaxed">
                  {job.description}
                </div>

                <div className="pt-2 border-t border-[#CBDAC4]/50 space-y-1 text-[11px] font-mono text-[#576159]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#285A40]" />
                    <span>
                      {job.region} — {job.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#123D2D]">
                    <span className="font-medium">{job.salary}</span>
                    {job.housingIncluded && (
                      <span className="text-[#285A40] text-[10px]">+ Housing</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#CBDAC4] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#576159]">
                  {job.responsibilities?.length || 0} responsibilities
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingJob(job)
                      setFormModalOpen(true)
                    }}
                    className="p-1.5 text-[#576159] hover:text-[#123D2D] hover:bg-[#F3EFE6] rounded-sm transition-colors text-xs font-mono inline-flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingJob(job)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm transition-colors text-xs font-mono inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <JobFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSuccess={handleModalSuccess}
        editingJob={editingJob}
      />

      <JobDeleteConfirmModal
        isOpen={Boolean(deletingJob)}
        onClose={() => setDeletingJob(null)}
        onConfirm={handleConfirmDelete}
        job={deletingJob}
        isDeleting={isDeleting}
      />
    </div>
  )
}
