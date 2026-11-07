import { useState, useEffect, lazy, Suspense } from 'react'
import type { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { CheckCircle2, X } from 'lucide-react'
import { Navbar } from '../layout/Navbar'
import { Hero } from './Hero'
import { SaaSModuleNavigator } from './SaaSModuleNavigator'
import type { SaaSModuleTab } from './SaaSModuleNavigator'
import { HomestayMarketplace } from './HomestayMarketplace'
import { MountainJobs } from './MountainJobs'
import { CommunityDispatches } from './CommunityDispatches'
import { FAQSection } from './FAQSection'
import { Footer } from '../layout/Footer'

// Lazy-loaded interactive modals (loaded on demand to ensure lightning-fast initial page paint)
const JobDetailModal = lazy(() =>
  import('../modals/JobDetailModal').then((m) => ({ default: m.JobDetailModal }))
)
const HomestayDetailModal = lazy(() =>
  import('../modals/HomestayDetailModal').then((m) => ({ default: m.HomestayDetailModal }))
)
const StoryDetailModal = lazy(() =>
  import('../modals/StoryDetailModal').then((m) => ({ default: m.StoryDetailModal }))
)
const JoinCommunityModal = lazy(() =>
  import('../modals/JoinCommunityModal').then((m) => ({ default: m.JoinCommunityModal }))
)
const CreateDispatchModal = lazy(() =>
  import('../modals/CreateDispatchModal').then((m) => ({ default: m.CreateDispatchModal }))
)
const CreatePropertyModal = lazy(() =>
  import('../modals/CreatePropertyModal').then((m) => ({ default: m.CreatePropertyModal }))
)
const CreateJobModal = lazy(() =>
  import('../modals/CreateJobModal').then((m) => ({ default: m.CreateJobModal }))
)
const PrivacyPolicyModal = lazy(() =>
  import('../modals/PrivacyPolicyModal').then((m) => ({ default: m.PrivacyPolicyModal }))
)
const CookiePolicyModal = lazy(() =>
  import('../modals/CookiePolicyModal').then((m) => ({ default: m.CookiePolicyModal }))
)
import { CookieConsentBanner } from '../common/CookieConsentBanner'
import { StartupAnimation } from '../common/StartupAnimation'
import { RidgeConciergeChatbot } from '../chat/RidgeConciergeChatbot'

import { useEcosystemData } from '../../hooks/useEcosystemData'
import type { Destination, Dispatch, Job, Homestay } from '../../types'
import { setPageTitle } from '../../config/branding'

export const PublicHomePage: FC = () => {
  const location = useLocation()
  const [welcomeToast, setWelcomeToast] = useState<{ show: boolean; email?: string } | null>(null)
  const [activeTab, setActiveTab] = useState<SaaSModuleTab>('all')

  useEffect(() => {
    setPageTitle()
  }, [])

  useEffect(() => {
    const state = location.state as { loginSuccess?: boolean; email?: string } | null
    if (state?.loginSuccess) {
      setWelcomeToast({ show: true, email: state.email })
      const timer = setTimeout(() => {
        setWelcomeToast(null)
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [location.state])

  // Ecosystem Dynamic Data Engine (Supabase-ready + Preview Toggle)
  const {
    destinations,
    homestays,
    jobs,
    dispatches,
    priceIndices,
    isLoading,
    errors,
    refetchAll
  } = useEcosystemData()

  // Modal states
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [selectedHomestay, setSelectedHomestay] = useState<Homestay | null>(null)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [selectedDispatch, setSelectedDispatch] = useState<Dispatch | null>(null)
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const [joinRole, setJoinRole] = useState<'traveller' | 'host' | 'seeker' | 'employer'>('host')
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false)
  const [propertyModalOpen, setPropertyModalOpen] = useState(false)
  const [jobModalOpen, setJobModalOpen] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const [cookiesModalOpen, setCookiesModalOpen] = useState(false)

  const allHomestays = homestays
  const allJobs = jobs

  const handleOpenJoin = (role: 'traveller' | 'host' | 'seeker' | 'employer' = 'host') => {
    if (role === 'host') {
      setPropertyModalOpen(true)
    } else if (role === 'employer') {
      setJobModalOpen(true)
    } else {
      setJoinRole(role)
      setJoinModalOpen(true)
    }
  }

  const handleTabChange = (tab: SaaSModuleTab) => {
    setActiveTab(tab)
    if (tab === 'stays') {
      document.getElementById('stays')?.scrollIntoView({ behavior: 'smooth' })
    } else if (tab === 'jobs') {
      document.getElementById('jobs')?.scrollIntoView({ behavior: 'smooth' })
    } else if (tab === 'community') {
      document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7EE] text-[#1E2621] font-sans selection:bg-[#164E2D]/20 selection:text-[#0A2316]">
      {/* 0. Cinematic Launch Startup Animation */}
      <StartupAnimation />

      {/* SaaS App Header */}
      <Navbar
        onOpenJoinModal={handleOpenJoin}
      />

      {/* Main SaaS Platform View */}
      <main className="flex-1">
        {/* 1. SaaS Hero with Platform Mission & Direct Action Cards */}
        <Hero
          onSelectTab={handleTabChange}
          onOpenCreateDispatch={() => setDispatchModalOpen(true)}
          onOpenPostJob={() => setJobModalOpen(true)}
          onOpenListProperty={() => setPropertyModalOpen(true)}
          counts={{
            properties: allHomestays.length,
            jobs: allJobs.length,
            dispatches: dispatches.length
          }}
        />

        {/* 2. Exact Pill-Shaped Module Navigator (Matches User's Reference) */}
        <SaaSModuleNavigator
          activeTab={activeTab}
          onSelectTab={handleTabChange}
        />

        {/* 3. The 3 Core SaaS Sections */}

        {/* Section 1: Stays & Leases (Property Lease & Sale) */}
        {(activeTab === 'all' || activeTab === 'stays') && (
          <HomestayMarketplace
            homestays={allHomestays}
            isLoading={isLoading}
            error={errors.homestays}
            onRetry={refetchAll}
            onSelectHomestay={(stay) => setSelectedHomestay(stay)}
            onListHomestayClick={() => setPropertyModalOpen(true)}
          />
        )}

        {/* Section 2: Mountain Jobs */}
        {(activeTab === 'all' || activeTab === 'jobs') && (
          <MountainJobs
            jobs={allJobs}
            isLoading={isLoading}
            error={errors.jobs}
            onRetry={refetchAll}
            onSelectJob={(job) => setSelectedJob(job)}
            onPostJobClick={() => setJobModalOpen(true)}
          />
        )}

        {/* Section 3: Community Experiences */}
        {(activeTab === 'all' || activeTab === 'community') && (
          <CommunityDispatches
            dispatches={dispatches}
            priceIndices={priceIndices}
            isLoading={isLoading}
            error={errors.dispatches}
            onRetry={refetchAll}
            onSelectDispatch={(disp) => setSelectedDispatch(disp)}
            onWriteDispatch={() => setDispatchModalOpen(true)}
          />
        )}

        {/* Supporting FAQ Section */}
        <FAQSection />
      </main>

      {/* Clean SaaS Footer */}
      <Footer
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenCookies={() => setCookiesModalOpen(true)}
      />

      {/* Interactive Modals (Loaded on-demand via React.lazy) */}
      <Suspense fallback={null}>
        {selectedJob && (
          <JobDetailModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onOpenPrivacy={() => setPrivacyModalOpen(true)}
          />
        )}

        {selectedHomestay && (
          <HomestayDetailModal
            homestay={selectedHomestay}
            onClose={() => setSelectedHomestay(null)}
            onOpenPrivacy={() => setPrivacyModalOpen(true)}
          />
        )}

        {(selectedDestination || selectedDispatch) && (
          <StoryDetailModal
            destination={selectedDestination}
            dispatch={selectedDispatch}
            onClose={() => {
              setSelectedDestination(null)
              setSelectedDispatch(null)
            }}
          />
        )}

        {joinModalOpen && (
          <JoinCommunityModal
            initialRole={joinRole}
            onClose={() => setJoinModalOpen(false)}
            onOpenPrivacy={() => setPrivacyModalOpen(true)}
          />
        )}

        {/* Dedicated Pan-India Mountain Modals with Full Address Details */}
        {propertyModalOpen && (
          <CreatePropertyModal
            isOpen={propertyModalOpen}
            onClose={() => setPropertyModalOpen(false)}
            onOpenPrivacy={() => setPrivacyModalOpen(true)}
            onSuccess={() => {
              refetchAll()
            }}
          />
        )}

        {jobModalOpen && (
          <CreateJobModal
            isOpen={jobModalOpen}
            onClose={() => setJobModalOpen(false)}
            onOpenPrivacy={() => setPrivacyModalOpen(true)}
            onSuccess={() => {
              refetchAll()
            }}
          />
        )}

        {dispatchModalOpen && (
          <CreateDispatchModal
            isOpen={dispatchModalOpen}
            onClose={() => setDispatchModalOpen(false)}
            onOpenPrivacy={() => setPrivacyModalOpen(true)}
            onSuccess={() => {
              refetchAll()
            }}
          />
        )}

        {privacyModalOpen && (
          <PrivacyPolicyModal
            isOpen={privacyModalOpen}
            onClose={() => setPrivacyModalOpen(false)}
          />
        )}

        {cookiesModalOpen && (
          <CookiePolicyModal
            isOpen={cookiesModalOpen}
            onClose={() => setCookiesModalOpen(false)}
          />
        )}
      </Suspense>

      <CookieConsentBanner
        onOpenCookiePolicy={() => setCookiesModalOpen(true)}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
      />

      {/* Grounded AI Concierge Chatbot */}
      <RidgeConciergeChatbot
        destinations={destinations}
        homestays={homestays}
        jobs={jobs}
        dispatches={dispatches}
        priceIndices={priceIndices}
        onOpenPropertyModal={() => setPropertyModalOpen(true)}
        onOpenJobModal={() => setJobModalOpen(true)}
        onOpenDispatchModal={() => setDispatchModalOpen(true)}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
      />

      {/* Welcome Toast Notification */}
      {welcomeToast?.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A2316] text-[#F8F6F0] border border-[#164E2D] p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-scale max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-[#34D399] flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold">Welcome to the Mountain Fellowship</p>
            <p className="text-[11px] text-[#D8E8D5]/80 truncate">
              {welcomeToast.email || 'You are signed in to the fellowship.'}
            </p>
          </div>
          <button
            onClick={() => setWelcomeToast(null)}
            className="text-white/40 hover:text-white p-1"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
