import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { CheckCircle2, X } from 'lucide-react'
import { Navbar } from '../layout/Navbar'
import { Hero } from './Hero'
import { HomestayMarketplace } from './HomestayMarketplace'
import { MountainPhilosophy } from './MountainPhilosophy'
import { MountainExperiences } from './MountainExperiences'
import { FarmDiningSection } from './FarmDiningSection'
import { PromosOffersSection } from './PromosOffersSection'
import { DestinationStories } from './DestinationStories'
import { CommunityDispatches } from './CommunityDispatches'
import { MountainJobs } from './MountainJobs'
import { ArchitecturalLedger } from './ArchitecturalLedger'
import { GuestReviewsSection } from './GuestReviewsSection'
import { FAQSection } from './FAQSection'
import { CommunityCTA } from './CommunityCTA'
import { Footer } from '../layout/Footer'
import { MobileStickyBookingBar } from '../common/MobileStickyBookingBar'

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

  // Search handler from Hero Floating Search Panel
  const handleHeroSearch = (_cottageType: string, _guestCount: string) => {
    const el = document.getElementById('homestays')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleOpenJoin = (role: 'traveller' | 'host' | 'seeker' | 'employer' = 'traveller') => {
    setJoinRole(role)
    setJoinModalOpen(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7EE] text-[#1E2621] font-sans selection:bg-[#164E2D]/20 selection:text-[#0A2316]">
      {/* Refined Navigation Bar with Top Weather & Concierge Bar */}
      <Navbar
        onOpenJoinModal={() => handleOpenJoin('traveller')}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenSearch={() => {
          const el = document.getElementById('destinations')
          el?.scrollIntoView({ behavior: 'smooth' })
        }}
        onOpenBookCottage={() => {
          const el = document.getElementById('homestays')
          el?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section with Floating Search Panel & 4 Trust Stats */}
        <Hero
          onSearch={handleHeroSearch}
          onExploreClick={() => {
            const el = document.getElementById('homestays')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
          onJoinClick={() => handleOpenJoin('traveller')}
        />

        {/* 2. Featured Cottages & Alpine Suites (Immediate Core Conversion Focus) */}
        <HomestayMarketplace
          homestays={homestays}
          isLoading={isLoading}
          error={errors.homestays}
          onRetry={refetchAll}
          onSelectHomestay={(stay) => setSelectedHomestay(stay)}
          onListHomestayClick={() => handleOpenJoin('host')}
        />

        {/* 3. Mountain Sanctuary Philosophy (Asymmetric Editorial Cluster) */}
        <MountainPhilosophy
          onExploreCottages={() => {
            const el = document.getElementById('homestays')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        {/* 4. Curated Mountain Experiences & Tea Garden Activities */}
        <MountainExperiences
          onBookCottage={() => {
            const el = document.getElementById('homestays')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        {/* 5. Farm-To-Table Dining Section (Wood-Fired Hearth & Estate Teas) */}
        <FarmDiningSection />

        {/* 6. Seasonal Privileges & Sabbatical Voucher Codes */}
        <PromosOffersSection />

        {/* 7. Destination Stories & Territorial Exploration */}
        <DestinationStories
          destinations={destinations}
          isLoading={isLoading}
          error={errors.destinations}
          onRetry={refetchAll}
          onSelectDestination={(dest) => setSelectedDestination(dest)}
        />

        {/* 8. Mountain Jobs & Paid Residencies Exchange */}
        <MountainJobs
          jobs={jobs}
          isLoading={isLoading}
          error={errors.jobs}
          onRetry={refetchAll}
          onSelectJob={(job) => setSelectedJob(job)}
          onPostJobClick={() => handleOpenJoin('employer')}
        />

        {/* 9. Himalayan Architectural & Material Ledger */}
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

        {/* 10. Community Ledger & Fair Price Dispatches */}
        <CommunityDispatches
          dispatches={dispatches}
          priceIndices={priceIndices}
          isLoading={isLoading}
          error={errors.dispatches}
          onRetry={refetchAll}
          onSelectDispatch={(disp) => setSelectedDispatch(disp)}
          onWriteDispatch={() => setDispatchModalOpen(true)}
        />

        {/* 11. Guest Reviews & Sabbatical Testimonials */}
        <GuestReviewsSection />

        {/* 12. Frequently Asked Questions (Inquiry Ledger) */}
        <FAQSection />

        {/* 13. Closing Community CTA */}
        <CommunityCTA
          onJoinClick={(role) => handleOpenJoin(role || 'traveller')}
        />
      </main>

      {/* Editorial Footer */}
      <Footer
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenCookies={() => setCookiesModalOpen(true)}
      />

      {/* Floating Thumb-Friendly Mobile Booking Bar */}
      <MobileStickyBookingBar
        onBookClick={() => {
          const el = document.getElementById('homestays')
          el?.scrollIntoView({ behavior: 'smooth' })
        }}
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

      <CreateDispatchModal
        isOpen={dispatchModalOpen}
        onClose={() => setDispatchModalOpen(false)}
        onOpenPublicAuth={() => setAuthModalOpen(true)}
        onSuccess={() => {
          refetchAll()
        }}
      />

      <PublicAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          refetchAll()
        }}
      />

      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <CookiePolicyModal
        isOpen={cookiesModalOpen}
        onClose={() => setCookiesModalOpen(false)}
      />

      <CookieConsentBanner
        onOpenCookiePolicy={() => setCookiesModalOpen(true)}
      />

      {/* Grounded AI Concierge Chatbot */}
      <RidgeConciergeChatbot
        destinations={destinations}
        homestays={homestays}
        jobs={jobs}
        dispatches={dispatches}
        priceIndices={priceIndices}
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
