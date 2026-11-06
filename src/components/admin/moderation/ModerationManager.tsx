import { useState, useEffect, useCallback } from 'react'
import type { FC } from 'react'
import {
  ShieldCheck,
  RefreshCw,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Briefcase,
  Home,
  MessageSquare,
  Eye,
  EyeOff,
  MapPin
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../../lib/supabase'
import {
  MOUNTAIN_STORAGE_KEYS,
  getStoredItems,
  setStoredItems,
  notifyDataUpdated
} from '../../../services/ecosystemService'


interface FellowshipAppRow {
  id: string
  full_name: string
  email: string
  phone: string
  role: string
  region: string
  intent: string
  status: 'pending' | 'approved' | 'waitlisted' | 'declined'
  created_at: string
}

interface LeaseInquiryRow {
  id: string
  homestay_id: string | null
  guest_name: string
  email: string
  phone: string
  intended_term: string
  start_date: string
  profession: string
  message: string
  status: 'inquiry' | 'host_contacted' | 'lease_signed' | 'cancelled'
  created_at: string
}

interface JobAppRow {
  id: string
  job_id: string | null
  full_name: string
  email: string
  phone: string
  note: string
  status: 'submitted' | 'interviewing' | 'placed' | 'closed'
  created_at: string
}

interface CommunityDispatchRow {
  id: string
  type: string
  title: string
  excerpt: string
  location: string
  date: string
  author_name: string
  author_role: string
  verified: boolean
  is_published: boolean
  created_at: string
}

export const ModerationManager: FC = () => {
  const [activeTab, setActiveTab] = useState<'experiences' | 'leases' | 'jobs' | 'fellowship'>('experiences')
  const [dispatches, setDispatches] = useState<CommunityDispatchRow[]>([])
  const [fellowships, setFellowships] = useState<FellowshipAppRow[]>([])
  const [leases, setLeases] = useState<LeaseInquiryRow[]>([])
  const [jobApps, setJobApps] = useState<JobAppRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const loadSubmissions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    let dbFel: FellowshipAppRow[] = []
    let dbLease: LeaseInquiryRow[] = []
    let dbJob: JobAppRow[] = []
    let dbDisp: CommunityDispatchRow[] = []

    if (isSupabaseConfigured()) {
      try {
        const [felRes, leaseRes, jobRes, dispRes] = await Promise.allSettled([
          supabase.from('fellowship_applications').select('*').order('created_at', { ascending: false }),
          supabase.from('lease_inquiries').select('*').order('created_at', { ascending: false }),
          supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
          supabase.from('community_dispatches').select('*').order('created_at', { ascending: false })
        ])

        if (felRes.status === 'fulfilled' && felRes.value.data) {
          dbFel = felRes.value.data as FellowshipAppRow[]
        }
        if (leaseRes.status === 'fulfilled' && leaseRes.value.data) {
          dbLease = leaseRes.value.data as LeaseInquiryRow[]
        }
        if (jobRes.status === 'fulfilled' && jobRes.value.data) {
          dbJob = jobRes.value.data as JobAppRow[]
        }
        if (dispRes.status === 'fulfilled' && dispRes.value.data) {
          dbDisp = (dispRes.value.data as any[]).map((d) => ({
            id: d.id,
            type: d.type,
            title: d.title,
            excerpt: d.excerpt || '',
            location: d.location || '',
            date: d.date || '',
            author_name: d.author_name || 'Community Member',
            author_role: d.author_role || 'Contributor',
            verified: Boolean(d.verified),
            is_published: d.is_published !== false,
            created_at: d.created_at || new Date().toISOString()
          }))
        }
      } catch (err: unknown) {
        console.warn('Error loading Supabase submissions:', err)
      }
    }

    // Merge with local storage
    const localDispatches = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.DISPATCHES)
    const existingDispIds = new Set(dbDisp.map((d) => d.id))
    const existingDispTitles = new Set(dbDisp.map((d) => d.title.toLowerCase().trim()))
    const mappedLocalDisp: CommunityDispatchRow[] = localDispatches
      .filter((d: any) => !existingDispIds.has(d.id) && !existingDispTitles.has(d.title.toLowerCase().trim()) && !d.id?.startsWith('dev-') && !d.id?.startsWith('mock-') && !d.id?.startsWith('disp-'))
      .map((d: any) => ({
        id: d.id,
        type: d.type,
        title: d.title,
        excerpt: d.excerpt || '',
        location: d.location || '',
        date: d.date || '',
        author_name: d.author?.name || d.author_name || 'Community Member',
        author_role: d.author?.role || d.author_role || 'Contributor',
        verified: Boolean(d.verified),
        is_published: d.is_published !== false,
        created_at: d.created_at || new Date().toISOString()
      }))
    setDispatches([...mappedLocalDisp, ...dbDisp])

    const localLeases = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.LEASES)
    const existingLeaseIds = new Set(dbLease.map((l) => l.id))
    const mappedLocalLease: LeaseInquiryRow[] = localLeases
      .filter((l: any) => !existingLeaseIds.has(l.id))
      .map((l: any) => ({
        id: l.id,
        homestay_id: l.homestay_id || null,
        guest_name: l.guest_name,
        email: l.email,
        phone: l.phone,
        intended_term: l.intended_term,
        start_date: l.start_date,
        profession: l.profession,
        message: l.message,
        status: l.status || 'inquiry',
        created_at: l.created_at || new Date().toISOString()
      }))
    setLeases([...mappedLocalLease, ...dbLease])

    const localJobs = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.JOB_APPS)
    const existingJobAppIds = new Set(dbJob.map((j) => j.id))
    const mappedLocalJob: JobAppRow[] = localJobs
      .filter((j: any) => !existingJobAppIds.has(j.id))
      .map((j: any) => ({
        id: j.id,
        job_id: j.job_id || null,
        full_name: j.full_name,
        email: j.email,
        phone: j.phone,
        note: j.note,
        status: j.status || 'submitted',
        created_at: j.created_at || new Date().toISOString()
      }))
    setJobApps([...mappedLocalJob, ...dbJob])

    const localFel = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.FELLOWSHIPS)
    const existingFelIds = new Set(dbFel.map((f) => f.id))
    const mappedLocalFel: FellowshipAppRow[] = localFel
      .filter((f: any) => !existingFelIds.has(f.id))
      .map((f: any) => ({
        id: f.id,
        full_name: f.full_name,
        email: f.email,
        phone: f.phone,
        role: f.role,
        region: f.region,
        intent: f.intent,
        status: f.status || 'pending',
        created_at: f.created_at || new Date().toISOString()
      }))
    setFellowships([...mappedLocalFel, ...dbFel])

    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadSubmissions()
    const handleUpdate = () => {
      loadSubmissions()
    }
    window.addEventListener('mountain_data_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('mountain_data_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [loadSubmissions])

  // --- Community Experiences Actions ---
  const toggleDispatchVerify = async (d: CommunityDispatchRow) => {
    const newVerified = !d.verified
    // Update local storage
    const localDispatches = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.DISPATCHES)
    const updatedLocal = localDispatches.map((item: any) =>
      item.id === d.id ? { ...item, verified: newVerified } : item
    )
    setStoredItems(MOUNTAIN_STORAGE_KEYS.DISPATCHES, updatedLocal)
    notifyDataUpdated()

    setDispatches((prev) =>
      prev.map((item) => (item.id === d.id ? { ...item, verified: newVerified } : item))
    )
    showToast(newVerified ? `"${d.title}" is now Verified` : `Verification revoked for "${d.title}"`)

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('community_dispatches')
          .update({ verified: newVerified })
          .eq('id', d.id)
      } catch {}
    }
  }

  const toggleDispatchPublish = async (d: CommunityDispatchRow) => {
    const newPublished = !d.is_published
    // Update local storage
    const localDispatches = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.DISPATCHES)
    const updatedLocal = localDispatches.map((item: any) =>
      item.id === d.id ? { ...item, is_published: newPublished } : item
    )
    setStoredItems(MOUNTAIN_STORAGE_KEYS.DISPATCHES, updatedLocal)
    notifyDataUpdated()

    setDispatches((prev) =>
      prev.map((item) => (item.id === d.id ? { ...item, is_published: newPublished } : item))
    )
    showToast(newPublished ? `"${d.title}" is now Live on site` : `"${d.title}" is now Hidden / Draft`)

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('community_dispatches')
          .update({ is_published: newPublished })
          .eq('id', d.id)
      } catch {}
    }
  }

  const deleteDispatch = async (d: CommunityDispatchRow) => {
    if (!confirm(`Are you sure you want to permanently delete "${d.title}"?`)) return
    // Remove from local storage
    const localDispatches = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.DISPATCHES)
    setStoredItems(
      MOUNTAIN_STORAGE_KEYS.DISPATCHES,
      localDispatches.filter((item: any) => item.id !== d.id)
    )
    notifyDataUpdated()

    setDispatches((prev) => prev.filter((item) => item.id !== d.id))
    showToast(`Deleted experience "${d.title}"`)

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('community_dispatches').delete().eq('id', d.id)
      } catch {}
    }
  }

  // --- Fellowship Actions ---
  const updateFellowshipStatus = async (id: string, newStatus: FellowshipAppRow['status']) => {
    const localFel = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.FELLOWSHIPS)
    const updatedLocal = localFel.map((f: any) => (f.id === id ? { ...f, status: newStatus } : f))
    setStoredItems(MOUNTAIN_STORAGE_KEYS.FELLOWSHIPS, updatedLocal)
    notifyDataUpdated()

    setFellowships((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    )
    showToast(`Fellowship status changed to ${newStatus}`)

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('fellowship_applications').update({ status: newStatus }).eq('id', id)
      } catch {}
    }
  }

  const deleteFellowship = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application record?')) return
    const localFel = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.FELLOWSHIPS)
    setStoredItems(MOUNTAIN_STORAGE_KEYS.FELLOWSHIPS, localFel.filter((f: any) => f.id !== id))
    notifyDataUpdated()

    setFellowships((prev) => prev.filter((f) => f.id !== id))
    showToast('Application deleted')

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('fellowship_applications').delete().eq('id', id)
      } catch {}
    }
  }

  // --- Lease Actions ---
  const updateLeaseStatus = async (id: string, newStatus: LeaseInquiryRow['status']) => {
    const localLeases = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.LEASES)
    const updatedLocal = localLeases.map((l: any) => (l.id === id ? { ...l, status: newStatus } : l))
    setStoredItems(MOUNTAIN_STORAGE_KEYS.LEASES, updatedLocal)
    notifyDataUpdated()

    setLeases((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    )
    showToast(`Lease status updated to ${newStatus}`)

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('lease_inquiries').update({ status: newStatus }).eq('id', id)
      } catch {}
    }
  }

  const deleteLease = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lease inquiry?')) return
    const localLeases = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.LEASES)
    setStoredItems(MOUNTAIN_STORAGE_KEYS.LEASES, localLeases.filter((l: any) => l.id !== id))
    notifyDataUpdated()

    setLeases((prev) => prev.filter((l) => l.id !== id))
    showToast('Lease inquiry deleted')

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('lease_inquiries').delete().eq('id', id)
      } catch {}
    }
  }

  // --- Job Application Actions ---
  const updateJobAppStatus = async (id: string, newStatus: JobAppRow['status']) => {
    const localJobs = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.JOB_APPS)
    const updatedLocal = localJobs.map((j: any) => (j.id === id ? { ...j, status: newStatus } : j))
    setStoredItems(MOUNTAIN_STORAGE_KEYS.JOB_APPS, updatedLocal)
    notifyDataUpdated()

    setJobApps((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
    )
    showToast(`Job application marked as ${newStatus}`)

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('job_applications').update({ status: newStatus }).eq('id', id)
      } catch {}
    }
  }

  const deleteJobApp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job applicant record?')) return
    const localJobs = getStoredItems<any>(MOUNTAIN_STORAGE_KEYS.JOB_APPS)
    setStoredItems(MOUNTAIN_STORAGE_KEYS.JOB_APPS, localJobs.filter((j: any) => j.id !== id))
    notifyDataUpdated()

    setJobApps((prev) => prev.filter((j) => j.id !== id))
    showToast('Job application deleted')

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('job_applications').delete().eq('id', id)
      } catch {}
    }
  }

  const pendingLeases = leases.filter((l) => l.status === 'inquiry').length
  const pendingJobs = jobApps.filter((j) => j.status === 'submitted').length
  const unverifiedExperiences = dispatches.filter((d) => !d.verified).length

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
            <ShieldCheck className="w-3.5 h-3.5 text-[#285A40]" />
            <span>COMMUNITY MODERATION & VERIFICATION PORTAL</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#123D2D] font-normal tracking-tight">
            Community Experiences & Moderation
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#576159] font-light">
            Verify genuine community stories, delete or publish member experiences, review residential lease inquiries, and manage job applicants.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSubmissions}
          disabled={isLoading}
          className="p-2.5 border border-[#CBDAC4] text-[#123D2D] hover:bg-white rounded-sm transition-colors text-xs font-mono flex items-center gap-1.5"
          title="Refresh submissions"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#576159] tracking-wider">Community Experiences</div>
          <div className="text-2xl font-serif text-[#123D2D] font-normal mt-1 flex items-baseline gap-2">
            <span>{dispatches.length}</span>
            {unverifiedExperiences > 0 && (
              <span className="text-xs text-amber-600 font-sans font-medium">({unverifiedExperiences} unverified)</span>
            )}
          </div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#576159] tracking-wider">Lease Inquiries</div>
          <div className="text-2xl font-serif text-[#123D2D] font-normal mt-1 flex items-baseline gap-2">
            <span>{leases.length}</span>
            {pendingLeases > 0 && (
              <span className="text-xs text-amber-600 font-sans font-medium">({pendingLeases} new)</span>
            )}
          </div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#576159] tracking-wider">Job Applications</div>
          <div className="text-2xl font-serif text-[#123D2D] font-normal mt-1 flex items-baseline gap-2">
            <span>{jobApps.length}</span>
            {pendingJobs > 0 && (
              <span className="text-xs text-amber-600 font-sans font-medium">({pendingJobs} new)</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#CBDAC4] text-xs font-mono overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('experiences')}
          className={`pb-3 px-4 uppercase tracking-wider font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'experiences'
              ? 'border-[#123D2D] text-[#123D2D]'
              : 'border-transparent text-[#576159] hover:text-[#123D2D]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Community Experiences ({dispatches.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leases')}
          className={`pb-3 px-4 uppercase tracking-wider font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'leases'
              ? 'border-[#123D2D] text-[#123D2D]'
              : 'border-transparent text-[#576159] hover:text-[#123D2D]'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Lease Inquiries ({leases.length})</span>
          {pendingLeases > 0 && (
            <span className="bg-[#285A40] text-white text-[9px] px-1.5 py-0.2 rounded-full">
              {pendingLeases}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 px-4 uppercase tracking-wider font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'jobs'
              ? 'border-[#123D2D] text-[#123D2D]'
              : 'border-transparent text-[#576159] hover:text-[#123D2D]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Job Applications ({jobApps.length})</span>
          {pendingJobs > 0 && (
            <span className="bg-[#285A40] text-white text-[9px] px-1.5 py-0.2 rounded-full">
              {pendingJobs}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fellowship')}
          className={`pb-3 px-4 uppercase tracking-wider font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'fellowship'
              ? 'border-[#123D2D] text-[#123D2D]'
              : 'border-transparent text-[#576159] hover:text-[#123D2D]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Fellowship ({fellowships.length})</span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white border border-[#CBDAC4] p-12 text-center rounded-sm">
          <RefreshCw className="w-6 h-6 text-[#285A40] animate-spin mx-auto mb-2" />
          <p className="text-xs font-mono text-[#576159]">Querying moderation data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-300 p-6 rounded-sm text-center text-xs text-red-800 font-mono">
          <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <p>Database error: {error}</p>
        </div>
      ) : activeTab === 'experiences' ? (
        /* Community Experiences Moderation */
        dispatches.length === 0 ? (
          <div className="bg-white border border-[#CBDAC4] p-12 text-center rounded-sm">
            <MessageSquare className="w-10 h-10 text-[#285A40] mx-auto mb-3" />
            <h3 className="font-serif text-xl text-[#123D2D]">No Community Experiences Found</h3>
            <p className="text-xs text-[#576159] mt-1 max-w-md mx-auto leading-relaxed">
              When members post field stories or price notes, they will appear here for verification and moderation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dispatches.map((d) => (
              <div key={d.id} className="bg-white border border-[#CBDAC4] p-5 rounded-sm shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#CBDAC4]/50 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-base text-[#123D2D] font-medium">{d.title}</span>
                    <span className="px-2 py-0.5 bg-[#285A40]/10 text-[#285A40] text-[10px] font-mono rounded uppercase">
                      {d.type.replace('_', ' ')}
                    </span>

                    {/* Verified Status Badge */}
                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full flex items-center gap-1 ${
                        d.verified
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-700" />
                      <span>{d.verified ? 'Verified Post' : 'Unverified'}</span>
                    </span>

                    {/* Live vs Draft Status */}
                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full flex items-center gap-1 ${
                        d.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${d.is_published ? 'bg-green-600' : 'bg-amber-600'}`} />
                      <span>{d.is_published ? 'Live on Site' : 'Draft / Hidden'}</span>
                    </span>
                  </div>

                  <div className="text-[10px] font-mono text-[#576159]">
                    {d.date || new Date(d.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-xs font-mono text-[#576159] flex flex-wrap gap-4 items-center">
                  <span>Author: <strong className="text-[#123D2D]">{d.author_name}</strong> ({d.author_role})</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#285A40]" /> {d.location}</span>
                </div>

                <p className="text-xs text-[#202622] leading-relaxed bg-[#F8F6F0] p-3 rounded border border-[#CBDAC4]/40 font-light">
                  {d.excerpt}
                </p>

                {/* Moderation Controls */}
                <div className="pt-2 border-t border-[#CBDAC4]/50 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-[#576159] uppercase font-semibold">Moderation:</span>
                    
                    {/* Toggle Verify Button */}
                    <button
                      type="button"
                      onClick={() => toggleDispatchVerify(d)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[11px] font-medium transition active:scale-95 ${
                        d.verified
                          ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{d.verified ? 'Revoke Verification' : 'Verify Post'}</span>
                    </button>

                    {/* Toggle Publish / Hide Button */}
                    <button
                      type="button"
                      onClick={() => toggleDispatchPublish(d)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[11px] font-medium transition active:scale-95 ${
                        d.is_published
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-green-50 hover:bg-green-100 text-green-800 border border-green-300'
                      }`}
                    >
                      {d.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{d.is_published ? 'Hide from Public' : 'Make Live'}</span>
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => deleteDispatch(d)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 rounded-sm text-[11px] transition active:scale-95"
                    title="Permanently Delete Experience"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'leases' ? (
        /* Lease Inquiries Tab */
        leases.length === 0 ? (
          <div className="bg-white border border-[#CBDAC4] p-12 text-center rounded-sm">
            <Home className="w-10 h-10 text-[#285A40] mx-auto mb-3" />
            <h3 className="font-serif text-xl text-[#123D2D]">No Lease Inquiries Pending</h3>
            <p className="text-xs text-[#576159] mt-1 max-w-md mx-auto leading-relaxed">
              When guests submit an inquiry on a residential property, their residency proposal and dates will stream here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {leases.map((inq) => (
              <div key={inq.id} className="bg-white border border-[#CBDAC4] p-5 rounded-sm shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#CBDAC4]/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base text-[#123D2D] font-medium">{inq.guest_name}</span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full ${
                        inq.status === 'lease_signed'
                          ? 'bg-green-100 text-green-800'
                          : inq.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : inq.status === 'host_contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#576159]">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs font-mono text-[#576159] grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>Email: <strong className="text-[#123D2D] block truncate">{inq.email}</strong></div>
                  <div>Phone: <strong className="text-[#123D2D] block">{inq.phone}</strong></div>
                  <div>Term: <strong className="text-[#123D2D] block">{inq.intended_term}</strong></div>
                  <div>Start: <strong className="text-[#123D2D] block">{inq.start_date || 'Flexible'}</strong></div>
                </div>

                <p className="text-xs text-[#202622] italic bg-[#F8F6F0] p-3 rounded border border-[#CBDAC4]/40">
                  "{inq.message}"
                </p>

                {/* Moderation Controls */}
                <div className="pt-2 border-t border-[#CBDAC4]/50 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#576159] uppercase">Status:</span>
                    <button
                      type="button"
                      onClick={() => updateLeaseStatus(inq.id, 'host_contacted')}
                      disabled={inq.status === 'host_contacted'}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-300 rounded-sm text-[11px] disabled:opacity-40"
                    >
                      Contacted
                    </button>
                    <button
                      type="button"
                      onClick={() => updateLeaseStatus(inq.id, 'lease_signed')}
                      disabled={inq.status === 'lease_signed'}
                      className="px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-300 rounded-sm text-[11px] disabled:opacity-40"
                    >
                      Signed
                    </button>
                    <button
                      type="button"
                      onClick={() => updateLeaseStatus(inq.id, 'cancelled')}
                      disabled={inq.status === 'cancelled'}
                      className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-300 rounded-sm text-[11px] disabled:opacity-40"
                    >
                      Cancel
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteLease(inq.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'jobs' ? (
        /* Jobs Applications Tab */
        jobApps.length === 0 ? (
          <div className="bg-white border border-[#CBDAC4] p-12 text-center rounded-sm">
            <Briefcase className="w-10 h-10 text-[#285A40] mx-auto mb-3" />
            <h3 className="font-serif text-xl text-[#123D2D]">No Job Applications Received Yet</h3>
            <p className="text-xs text-[#576159] mt-1 max-w-md mx-auto leading-relaxed">
              When applicants submit the "Apply for Residency" modal on mountain job listings, their details and qualifications will stream here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobApps.map((j) => (
              <div key={j.id} className="bg-white border border-[#CBDAC4] p-5 rounded-sm shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#CBDAC4]/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base text-[#123D2D] font-medium">{j.full_name}</span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full ${
                        j.status === 'placed'
                          ? 'bg-green-100 text-green-800'
                          : j.status === 'closed'
                          ? 'bg-red-100 text-red-800'
                          : j.status === 'interviewing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {j.status}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#576159]">
                    {new Date(j.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs font-mono text-[#576159] flex flex-wrap gap-4">
                  <span>Email: <strong className="text-[#123D2D]">{j.email}</strong></span>
                  <span>Phone: <strong className="text-[#123D2D]">{j.phone}</strong></span>
                </div>

                <p className="text-xs text-[#202622] italic bg-[#F8F6F0] p-3 rounded border border-[#CBDAC4]/40">
                  "{j.note}"
                </p>

                {/* Moderation Controls */}
                <div className="pt-2 border-t border-[#CBDAC4]/50 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#576159] uppercase">Status:</span>
                    <button
                      type="button"
                      onClick={() => updateJobAppStatus(j.id, 'interviewing')}
                      disabled={j.status === 'interviewing'}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-300 rounded-sm text-[11px] disabled:opacity-40"
                    >
                      Interviewing
                    </button>
                    <button
                      type="button"
                      onClick={() => updateJobAppStatus(j.id, 'placed')}
                      disabled={j.status === 'placed'}
                      className="px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-300 rounded-sm text-[11px] disabled:opacity-40"
                    >
                      Placed / Hired
                    </button>
                    <button
                      type="button"
                      onClick={() => updateJobAppStatus(j.id, 'closed')}
                      disabled={j.status === 'closed'}
                      className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-300 rounded-sm text-[11px] disabled:opacity-40"
                    >
                      Close / Reject
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteJobApp(j.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Fellowship Applications Tab */
        fellowships.length === 0 ? (
          <div className="bg-white border border-[#CBDAC4] p-12 text-center rounded-sm">
            <ShieldCheck className="w-10 h-10 text-[#285A40] mx-auto mb-3" />
            <h3 className="font-serif text-xl text-[#123D2D]">No Fellowship Applications Pending</h3>
            <p className="text-xs text-[#576159] mt-1 max-w-md mx-auto leading-relaxed">
              When travellers, hosts, or job seekers submit the "Join Fellowship" modal on the public homepage, their contact details and intentions will stream here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {fellowships.map((app) => (
              <div key={app.id} className="bg-white border border-[#CBDAC4] p-5 rounded-sm shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#CBDAC4]/50 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base text-[#123D2D] font-medium">{app.full_name}</span>
                    <span className="px-2 py-0.5 bg-[#285A40]/10 text-[#285A40] text-[10px] font-mono rounded uppercase">
                      {app.role}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-full ${
                        app.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : app.status === 'declined'
                          ? 'bg-red-100 text-red-800'
                          : app.status === 'waitlisted'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#576159]">
                    {new Date(app.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-xs font-mono text-[#576159] flex flex-wrap gap-4">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#285A40]" /> {app.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#285A40]" /> {app.phone}</span>
                  <span>Territory: <strong className="text-[#123D2D]">{app.region}</strong></span>
                </div>

                <p className="text-xs text-[#202622] italic bg-[#F8F6F0] p-3 rounded border border-[#CBDAC4]/40 font-light">
                  "{app.intent}"
                </p>

                {/* Moderation Controls */}
                <div className="pt-2 border-t border-[#CBDAC4]/50 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#576159] uppercase">Status:</span>
                    <button
                      type="button"
                      onClick={() => updateFellowshipStatus(app.id, 'approved')}
                      disabled={app.status === 'approved'}
                      className="px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-300 rounded-sm text-[11px] disabled:opacity-40"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFellowshipStatus(app.id, 'waitlisted')}
                      disabled={app.status === 'waitlisted'}
                      className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-300 rounded-sm text-[11px] disabled:opacity-40"
                    >
                      Waitlist
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFellowshipStatus(app.id, 'declined')}
                      disabled={app.status === 'declined'}
                      className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-300 rounded-sm text-[11px] disabled:opacity-40"
                    >
                      Decline
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteFellowship(app.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-sm"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
