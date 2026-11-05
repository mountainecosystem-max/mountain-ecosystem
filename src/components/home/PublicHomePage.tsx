import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { CheckCircle2, X } from 'lucide-react'
import { Navbar } from '../layout/Navbar'
import { Hero } from './Hero'
import { DestinationStories } from './DestinationStories'
import { CommunityDispatches } from './CommunityDispatches'
import { MountainJobs } from './MountainJobs'
import { HomestayMarketplace } from './HomestayMarketplace'
import { ArchitecturalLedger } from './ArchitecturalLedger'
import { FAQSection } from './FAQSection'
import { CommunityCTA } from './CommunityCTA'
import { Footer } from '../layout/Footer'

import { JobDetailModal } from '../modals/JobDetailModal'
import { HomestayDetailModal } from '../modals/HomestayDetailModal'
import { StoryDetailModal } from '../modals/StoryDetailModal'
import { ArchitecturalSpecimenModal } from '../modals/ArchitecturalSpecimenModal'
import { JoinCommunityModal } from '../modals/JoinCommunityModal'
import { CreateDispatchModal } from '../modals/CreateDispatchModal'
import { PublicAuthModal } from '../modals/PublicAuthModal'
import { PrivacyPolicyModal } from '../modals/PrivacyPolicyModal'
import { CookiePolicyModal } from '../modals/CookiePolicyModal'
import { CookieConsentBanner } from '../common/CookieConsentBanner'
import { RidgeConciergeChatbot } from '../chat/RidgeConciergeChatbot'

import { useEcosystemData } from '../../hooks/useEcosystemData'
import type { Destination, Dispatch, Job, Homestay, ArchitecturalSpecimen } from '../../types'
import { setPageTitle } from '../../config/branding'

export const PublicHomePage: FC = () => {
  const location = useLocation()
  const [welcomeToast, setWelcomeToast] = useState<{ show: boolean; email?: string } | null>(null)

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
    specimens,
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
  const [selectedSpecimen, setSelectedSpecimen] = useState<ArchitecturalSpecimen | null>(null)
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const [joinRole, setJoinRole] = useState<'traveller' | 'host' | 'seeker' | 'employer'>('traveller')
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const [cookiesModalOpen, setCookiesModalOpen] = useState(false)

  // Search handler from Hero
  const handleHeroSearch = (_region: string, intent: string) => {
    if (intent.includes('Job')) {
      const el = document.getElementById('jobs')
      el?.scrollIntoView({ behavior: 'smooth' })
    } else if (intent.includes('Homestay') || intent.includes('Stay')) {
      const el = document.getElementById('homestays')
      el?.scrollIntoView({ behavior: 'smooth' })
    } else if (intent.includes('Dispatch') || intent.includes('Community')) {
      const el = document.getElementById('community')
      el?.scrollIntoView({ behavior: 'smooth' })
    } else if (intent.includes('Architect') || intent.includes('Ledger')) {
      const el = document.getElementById('architecture')
      el?.scrollIntoView({ behavior: 'smooth' })
    } else if (intent.includes('FAQ') || intent.includes('Question') || intent.includes('Inquiry')) {
      const el = document.getElementById('faqs')
      el?.scrollIntoView({ behavior: 'smooth' })
    } else {
      const el = document.getElementById('destinations')
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleOpenJoin = (role: 'traveller' | 'host' | 'seeker' | 'employer' = 'traveller') => {
    setJoinRole(role)
    setJoinModalOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] text-[#202622] font-sans selection:bg-[#91A77B]/30 selection:text-[#123D2D]">
      {/* Refined Navigation Bar */}
      <Navbar
        onOpenJoinModal={() => handleOpenJoin('traveller')}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenSearch={() => {
          const el = document.getElementById('destinations')
          el?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onSearch={handleHeroSearch}
          onExploreClick={() => {
            const el = document.getElementById('destinations')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
          onJoinClick={() => handleOpenJoin('traveller')}
        />

        {/* 2. Destination Stories */}
        <DestinationStories
          destinations={destinations}
          isLoading={isLoading}
          error={errors.destinations}
          onRetry={refetchAll}
          onSelectDestination={(dest) => setSelectedDestination(dest)}
        />

        {/* 3. Community Feed & Price Reports */}
        <CommunityDispatches
          dispatches={dispatches}
          priceIndices={priceIndices}
          isLoading={isLoading}
          error={errors.dispatches}
          onRetry={refetchAll}
          onSelectDispatch={(disp) => setSelectedDispatch(disp)}
          onWriteDispatch={() => setDispatchModalOpen(true)}
        />

        {/* 4. Mountain Jobs Exchange */}
        <MountainJobs
          jobs={jobs}
          isLoading={isLoading}
          error={errors.jobs}
          onRetry={refetchAll}
          onSelectJob={(job) => setSelectedJob(job)}
          onPostJobClick={() => handleOpenJoin('employer')}
        />

        {/* 5. Homestay Marketplace */}
        <HomestayMarketplace
          homestays={homestays}
          isLoading={isLoading}
          error={errors.homestays}
          onRetry={refetchAll}
          onSelectHomestay={(stay) => setSelectedHomestay(stay)}
          onListHomestayClick={() => handleOpenJoin('host')}
        />

        {/* 6. Himalayan Architectural & Material Ledger (Digital Museum) */}
        <ArchitecturalLedger
          specimens={specimens}
          isLoading={isLoading}
          error={errors.specimens}
          onRetry={refetchAll}
          onSelectSpecimen={(specimen) => setSelectedSpecimen(specimen)}
          onExploreStays={() => {
            const el = document.getElementById('homestays')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        {/* 7. Frequently Asked Questions (Himalayan Inquiry Ledger) */}
        <FAQSection />

        {/* 8. Closing Community CTA */}
        <CommunityCTA
          onJoinClick={(role) => handleOpenJoin(role || 'traveller')}
        />
      </main>

      {/* Polished Editorial Footer */}
      <Footer
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenCookies={() => setCookiesModalOpen(true)}
      />

      {/* Interactive Modals */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />

      <HomestayDetailModal
        homestay={selectedHomestay}
        onClose={() => setSelectedHomestay(null)}
      />

      <StoryDetailModal
        destination={selectedDestination}
        dispatch={selectedDispatch}
        onClose={() => {
          setSelectedDestination(null)
          setSelectedDispatch(null)
        }}
      />

      {/* Himalayan Architectural & Material Ledger Specimen Modal */}
      <ArchitecturalSpecimenModal
        specimen={selectedSpecimen}
        onClose={() => setSelectedSpecimen(null)}
        onExploreStays={() => {
          const el = document.getElementById('homestays')
          el?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      {joinModalOpen && (
        <JoinCommunityModal
          initialRole={joinRole}
          onClose={() => setJoinModalOpen(false)}
        />
      )}

      {/* Community Contributor Post Dispatch Modal */}
      <CreateDispatchModal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        onOpenPublicAuth={() => setAuthModalOpen(true)}
        onSuccess={() => {
          refetchAll()
        }}
      />

      {/* Public Platform Authentication Modal (Email & Password) */}
      <PublicAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false)
          refetchAll()
        }}
      />

      {/* Privacy Policy & Community Charter Modal */}
      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* Cookies & Local Storage Policy Modal */}
      <CookiePolicyModal
        isOpen={cookiesModalOpen}
        onClose={() => setCookiesModalOpen(false)}
      />

      {/* Non-intrusive Cookie Consent Banner */}
      <CookieConsentBanner
        onOpenCookiePolicy={() => setCookiesModalOpen(true)}
      />

      {/* Intelligent Himalayan Ridge Concierge Chatbot */}
      <RidgeConciergeChatbot
        destinations={destinations}
        homestays={homestays}
        jobs={jobs}
        dispatches={dispatches}
        priceIndices={priceIndices}
      />

      {/* Sign-in Welcome Notification */}
      {welcomeToast?.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B2516] border border-[#8FA777]/50 text-white p-4 rounded-sm shadow-2xl flex items-start gap-3 max-w-sm font-sans animate-bounce-short">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-semibold text-emerald-300">Signed In to Mountain Ecosystem</p>
            <p className="text-white/70 font-mono text-[11px] mt-0.5 truncate">
              {welcomeToast.email || 'Community Fellow'}
            </p>
          </div>
          <button
            onClick={() => setWelcomeToast(null)}
            className="text-white/40 hover:text-white p-0.5"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
