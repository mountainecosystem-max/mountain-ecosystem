import { useState } from 'react'
import type { FC } from 'react'
import { ChevronDown, HelpCircle, Compass, Home, Briefcase, FileText, ShieldCheck, Sparkles } from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'

interface FAQItem {
  id: string
  category: 'stays' | 'jobs' | 'community' | 'ethics'
  question: string
  answer: string
}

export const FAQSection: FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'stays' | 'jobs' | 'community' | 'ethics'>('all')
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-3'])

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'stays',
      question: `What makes ${BRAND_CONFIG.name} homestays different from commercial hotel aggregators?`,
      answer: `Every homestay and village cottage in our ledger is independently vetted in person by regional stewards. We strictly partner with indigenous host families, ancestral tea planters, and sustainable homesteads in the ${BRAND_CONFIG.region}. Rather than inflating commercial tourist surcharges, we enforce transparent monthly and seasonal lease rates that flow directly to the hosting family and village infrastructure.`
    },
    {
      id: 'faq-2',
      category: 'stays',
      question: 'Can remote workers, writers, and researchers book long-term village sabbaticals?',
      answer: `Yes. In fact, long-term sabbaticals (1 to 6 months) are our primary specialty. Our residential lease listings feature verified broadband stability, dedicated desk setups, quiet tea estate views, and solar/inverter electricity backups specifically suited for writers, remote engineers, botanists, and academic fellows.`
    },
    {
      id: 'faq-3',
      category: 'community',
      question: 'How does the Fair Mountain Price Index operate?',
      answer: `Commercial tourist inflation often distorts local transport and living costs in the Himalayas. Our community ledger crowd-sources verified price benchmarks for shared local jeeps, ridge porters, organic produce, and village guides. All price dispatches are submitted by verified community members and local residents to guarantee transparency and fair compensation.`
    },
    {
      id: 'faq-4',
      category: 'jobs',
      question: 'How do Mountain Jobs and seasonal residencies work?',
      answer: `Mountain employers—including regenerative tea gardens, heritage libraries, botanical gardens, and sustainable eco-lodges—post verified vacancies on our exchange. Applicants can apply directly through the platform. We ensure that every listing guarantees dignified wages, safe high-altitude lodging, and fair working standards.`
    },
    {
      id: 'faq-5',
      category: 'community',
      question: 'Who can publish field dispatches and stories to the Community Ledger?',
      answer: `Anyone authenticated with a verified community member account can submit field notes, trail updates, weather observations, and cultural journals. Each dispatch is attributed to a verified contributor profile to keep the platform free from commercial spam or fake reviews.`
    },
    {
      id: 'faq-6',
      category: 'ethics',
      question: 'What is the Ecological Non-Extraction Charter?',
      answer: `We uphold a strict regenerative pledge: zero single-use plastics, respect for sacred Himalayan groves, fair porter load limits (strictly capped at 20kg), and preservation of indigenous Lepcha, Bhutia, and Nepali architectural heritage. Travellers agree to tread lightly, leave trails pristine, and honor local cultural traditions.`
    },
    {
      id: 'faq-7',
      category: 'stays',
      question: 'How are reservations, payments, and security deposits handled?',
      answer: `Initial inquiries are submitted directly through the platform ledger to ensure host-guest alignment. Once the host confirms availability and terms, agreements are sealed with standardized fair lease documentation. Payments are handled without middleman commissions, protecting both guest and host integrity.`
    },
    {
      id: 'faq-8',
      category: 'ethics',
      question: 'What health, elevation, and weather precautions should travellers take?',
      answer: `The Eastern Himalayas span elevations from 300m in the Dooars forests to over 3,600m on the Singalila Ridge. We advise guests heading above 2,500m to acclimatize gradually. Our regional guides provide real-time updates on monsoon road clearance, mountain permits, and ridge medical outposts.`
    }
  ]

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter((item) => item.category === activeCategory)

  const categories = [
    { key: 'all', label: 'All Inquiries', icon: Sparkles },
    { key: 'stays', label: 'Stays & Leases', icon: Home },
    { key: 'jobs', label: 'Mountain Jobs', icon: Briefcase },
    { key: 'community', label: 'Community Ledger', icon: FileText },
    { key: 'ethics', label: 'Ecology & Ethics', icon: ShieldCheck }
  ]

  return (
    <section id="faqs" className="py-20 sm:py-24 bg-[#F2EFE9] border-t border-[#CBDAC4] text-[#123D2D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#123D2D]/10 text-[#123D2D] text-[11px] font-mono uppercase tracking-[0.2em] mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-[#285A40]" />
            <span>HIMALAYAN INQUIRY LEDGER</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0B2516] font-medium tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm font-sans text-[#48534C] leading-relaxed">
            Essential guidelines on village homestay leases, verified mountain jobs, fair regional pricing, and our ecological community charter.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.key
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key as any)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-sans font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0B2516] text-[#F8F6F0] shadow-md'
                    : 'bg-white/70 hover:bg-white text-[#285A40] border border-[#CBDAC4]/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#8FA777]' : 'text-[#285A40]'}`} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id)
            return (
              <div
                key={faq.id}
                className={`border rounded-sm transition-all duration-300 ${
                  isOpen
                    ? 'bg-white border-[#285A40]/40 shadow-sm'
                    : 'bg-white/60 hover:bg-white border-[#CBDAC4]/70'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-5 sm:px-7 py-4.5 sm:py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-serif text-base sm:text-lg text-[#0B2516] font-medium leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#0B2516] text-[#F8F6F0] rotate-180'
                        : 'bg-[#E8EFE3] text-[#123D2D]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-7 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-[#48534C] font-sans leading-relaxed border-t border-[#E8EFE3]/60">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Helpful Support Footnote */}
        <div className="mt-12 text-center p-6 bg-white/70 border border-[#CBDAC4] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-serif text-base text-[#0B2516] font-medium">Have a specific regional inquiry?</h4>
            <p className="text-xs text-[#576159] mt-0.5">
              Our regional stewards and village elders respond to trail, lease, and fellowship inquiries.
            </p>
          </div>
          <a
            href={`mailto:${BRAND_CONFIG.supportEmail}`}
            className="inline-flex items-center gap-2 bg-[#0B2516] hover:bg-[#123D2D] text-white text-xs font-sans font-semibold uppercase tracking-wider px-5 py-2.5 rounded-sm shadow-sm transition-colors shrink-0"
          >
            <Compass className="w-3.5 h-3.5 text-[#8FA777]" />
            <span>Contact Stewards</span>
          </a>
        </div>
      </div>
    </section>
  )
}
