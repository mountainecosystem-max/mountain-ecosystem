import { useState, useEffect, useCallback } from 'react'
import type { FC } from 'react'
import {
  ShieldCheck,
  RefreshCw,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Trash2,
  Briefcase,
  Home,
  Check
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../../lib/supabase'

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

export const ModerationManager: FC = () => {
  const [activeTab, setActiveTab] = useState<'fellowship' | 'leases' | 'jobs'>('fellowship')
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

    if (!isSupabaseConfigured()) {
      setIsLoading(false)
      return
    }

    try {
      const [felRes, leaseRes, jobRes] = await Promise.allSettled([
        supabase.from('fellowship_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('lease_inquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('job_applications').select('*').order('created_at', { ascending: false })
      ])

      if (felRes.status === 'fulfilled' && felRes.value.data) {
        setFellowships(felRes.value.data as FellowshipAppRow[])
      }
      if (leaseRes.status === 'fulfilled' && leaseRes.value.data) {
        setLeases(leaseRes.value.data as LeaseInquiryRow[])
      }
      if (jobRes.status === 'fulfilled' && jobRes.value.data) {
        setJobApps(jobRes.value.data as JobAppRow[])
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to query moderation data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSubmissions()
  }, [loadSubmissions])

  // Update fellowship status
  const updateFellowshipStatus = async (id: string, newStatus: FellowshipAppRow['status']) => {
    try {
      const { error } = await supabase
        .from('fellowship_applications')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        showToast(`Error: ${error.message}`)
      } else {
        setFellowships((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
        )
        showToast(`Fellowship status changed to ${newStatus}`)
      }
    } catch {
      showToast('Failed to update status')
    }
  }

  // Delete fellowship submission
  const deleteFellowship = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application record?')) return
    try {
      const { error } = await supabase.from('fellowship_applications').delete().eq('id', id)
      if (error) {
        showToast(`Error: ${error.message}`)
      } else {
        setFellowships((prev) => prev.filter((f) => f.id !== id))
        showToast('Application deleted')
      }
    } catch {
      showToast('Failed to delete')
    }
  }

  // Update lease status
  const updateLeaseStatus = async (id: string, newStatus: LeaseInquiryRow['status']) => {
    try {
      const { error } = await supabase
        .from('lease_inquiries')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        showToast(`Error: ${error.message}`)
      } else {
        setLeases((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        )
        showToast(`Lease status updated to ${newStatus}`)
      }
    } catch {
      showToast('Failed to update status')
    }
  }

  // Delete lease inquiry
  const deleteLease = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lease inquiry?')) return
    try {
      const { error } = await supabase.from('lease_inquiries').delete().eq('id', id)
      if (error) {
        showToast(`Error: ${error.message}`)
      } else {
        setLeases((prev) => prev.filter((l) => l.id !== id))
        showToast('Lease inquiry deleted')
      }
    } catch {
      showToast('Failed to delete')
    }
  }

  // Update job app status
  const updateJobAppStatus = async (id: string, newStatus: JobAppRow['status']) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) {
        showToast(`Error: ${error.message}`)
      } else {
        setJobApps((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
        )
        showToast(`Job application marked as ${newStatus}`)
      }
    } catch {
      showToast('Failed to update status')
    }
  }

  // Delete job app
  const deleteJobApp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job applicant record?')) return
    try {
      const { error } = await supabase.from('job_applications').delete().eq('id', id)
      if (error) {
        showToast(`Error: ${error.message}`)
      } else {
        setJobApps((prev) => prev.filter((j) => j.id !== id))
        showToast('Job application deleted')
      }
    } catch {
      showToast('Failed to delete')
    }
  }

  const pendingFellowships = fellowships.filter((f) => f.status === 'pending').length
  const pendingLeases = leases.filter((l) => l.status === 'inquiry').length
  const pendingJobs = jobApps.filter((j) => j.status === 'submitted').length

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
            <span>MODULE 04 • COMMUNITY STEWARDSHIP & MODERATION</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#123D2D] font-normal tracking-tight">
            Community Moderation & Submissions
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#576159] font-light">
            Review incoming fellowship enrollments, verify traveller background notes, moderate residential lease inquiries, and manage job applicants.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSubmissions}
          disabled={isLoading}
          className="p-2.5 border border-[#CBDAC4] text-[#123D2D] hover:bg-white rounded-sm transition-colors text-xs font-mono"
          title="Refresh submissions"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-4 font-mono">
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#576159] tracking-wider">Pending Fellowships</div>
          <div className="text-2xl font-serif text-[#123D2D] font-normal mt-1">{pendingFellowships}</div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#576159] tracking-wider">Pending Leases</div>
          <div className="text-2xl font-serif text-[#123D2D] font-normal mt-1">{pendingLeases}</div>
        </div>
        <div className="bg-white border border-[#CBDAC4] p-4 rounded-sm">
          <div className="text-[10px] uppercase text-[#576159] tracking-wider">Pending Job Apps</div>
          <div className="text-2xl font-serif text-[#123D2D] font-normal mt-1">{pendingJobs}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#CBDAC4] text-xs font-mono overflow-x-auto">
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
          <span>Fellowship Enrollments ({fellowships.length})</span>
          {pendingFellowships > 0 && (
            <span className="bg-[#285A40] text-white text-[9px] px-1.5 py-0.2 rounded-full">
              {pendingFellowships}
            </span>
          )}
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
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white border border-[#CBDAC4] p-12 text-center rounded-sm">
          <RefreshCw className="w-6 h-6 text-[#285A40] animate-spin mx-auto mb-2" />
          <p className="text-xs font-mono text-[#576159]">Querying incoming submissions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-300 p-6 rounded-sm text-center text-xs text-red-800 font-mono">
          <AlertCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <p>Database error: {error}</p>
        </div>
      ) : activeTab === 'fellowship' ? (
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
                  <span>Region: <strong className="text-[#123D2D]">{app.region}</strong></span>
                </div>

                <p className="text-xs text-[#202622] italic bg-[#F8F6F0] p-3 rounded border border-[#CBDAC4]/40">
                  "{app.intent}"
                </p>

                {/* Moderation Controls */}
                <div className="pt-2 border-t border-[#CBDAC4]/50 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#576159] uppercase">Moderate:</span>
                    <button
                      type="button"
                      onClick={() => updateFellowshipStatus(app.id, 'approved')}
                      disabled={app.status === 'approved'}
                      className="px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-300 rounded-sm inline-flex items-center gap-1 text-[11px] disabled:opacity-40"
                    >
                      <Check className="w-3 h-3" /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFellowshipStatus(app.id, 'waitlisted')}
                      disabled={app.status === 'waitlisted'}
                      className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-300 rounded-sm inline-flex items-center gap-1 text-[11px] disabled:opacity-40"
                    >
                      Waitlist
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFellowshipStatus(app.id, 'declined')}
                      disabled={app.status === 'declined'}
                      className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-300 rounded-sm inline-flex items-center gap-1 text-[11px] disabled:opacity-40"
                    >
                      <XCircle className="w-3 h-3" /> Decline
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
      ) : activeTab === 'leases' ? (
        leases.length === 0 ? (
          <div className="bg-white border border-[#CBDAC4] p-12 text-center rounded-sm">
            <Clock className="w-10 h-10 text-[#285A40] mx-auto mb-3" />
            <h3 className="font-serif text-xl text-[#123D2D]">No Homestay Inquiries Received Yet</h3>
            <p className="text-xs text-[#576159] mt-1 max-w-md mx-auto leading-relaxed">
              Inquiries submitted via the "Dispatch Lease Application" modal on homestay cards will stream here for host dispatch.
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

                <div className="text-xs font-mono text-[#576159] flex flex-wrap gap-4">
                  <span>Email: <strong className="text-[#123D2D]">{inq.email}</strong></span>
                  <span>Phone: <strong className="text-[#123D2D]">{inq.phone}</strong></span>
                  <span>Term: <strong>{inq.intended_term}</strong></span>
                  <span>Start: <strong>{inq.start_date}</strong></span>
                  <span>Profession: <strong>{inq.profession}</strong></span>
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
                      Host Contacted
                    </button>
                    <button
                      type="button"
                      onClick={() => updateLeaseStatus(inq.id, 'lease_signed')}
                      disabled={inq.status === 'lease_signed'}
                      className="px-2.5 py-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-300 rounded-sm text-[11px] disabled:opacity-40"
                    >
                      Lease Signed
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
      ) : (
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
      )}
    </div>
  )
}
