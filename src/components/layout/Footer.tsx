import type { FC } from 'react'
import { Compass, ArrowUp, Leaf, Mail, ShieldCheck } from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'

interface FooterProps {
  onOpenPrivacy?: () => void
  onOpenCookies?: () => void
}

export const Footer: FC<FooterProps> = ({ onOpenPrivacy, onOpenCookies }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gradient-to-b from-[#0F3520] to-[#0A2214] border-t border-[#2B6140] text-[#EAF2E6] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-[#285A40]/60">
          {/* Brand & Manifesto Column (4 cols) */}
          <div className="lg:col-span-4">
            <div className="mb-4">
              <img
                src={BRAND_CONFIG.logo.horizontal}
                alt={BRAND_CONFIG.logo.alt}
                className="h-11 sm:h-12 w-auto object-contain brightness-105 filter drop-shadow-sm"
              />
            </div>

            <p className="text-xs sm:text-sm text-[#E8EFE3]/75 leading-relaxed font-light mb-6">
              {BRAND_CONFIG.missionStatement}
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-[#91A77B]">
              <Compass className="w-4 h-4 text-[#91A77B]" />
              <span>{BRAND_CONFIG.headquarters}</span>
            </div>
          </div>

          {/* Links Column 1: Explore Regions (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[#91A77B] mb-4">
              MOUNTAIN REGIONS
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8EFE3]/80 font-mono">
              <li>
                <a href="#stays" className="hover:text-white hover:underline transition-colors">
                  Himachal Pradesh
                </a>
              </li>
              <li>
                <a href="#stays" className="hover:text-white hover:underline transition-colors">
                  Uttarakhand & Kumaon
                </a>
              </li>
              <li>
                <a href="#stays" className="hover:text-white hover:underline transition-colors">
                  Ladakh & Kashmir
                </a>
              </li>
              <li>
                <a href="#stays" className="hover:text-white hover:underline transition-colors">
                  Sikkim & Northeast
                </a>
              </li>
              <li>
                <a href="#stays" className="hover:text-white hover:underline transition-colors">
                  Bengal Hills & Nilgiris
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Community & Dispatches (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[#91A77B] mb-4">
              COMMUNITY
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8EFE3]/80 font-mono">
              <li>
                <a href="#community" className="hover:text-white hover:underline transition-colors">
                  Ground Price Index
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-white hover:underline transition-colors">
                  Tea Estate Journals
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-white hover:underline transition-colors">
                  Indigenous Host Stories
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-white hover:underline transition-colors">
                  Singalila Ridge Notes
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-white hover:underline transition-colors">
                  Community Charter
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Work & Leases (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[#91A77B] mb-4">
              WORK & LEASES
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8EFE3]/80 font-mono">
              <li>
                <a href="#jobs" className="hover:text-white hover:underline transition-colors">
                  Mountain Job Exchange
                </a>
              </li>
              <li>
                <a href="#jobs" className="hover:text-white hover:underline transition-colors">
                  Estate & Trail Residencies
                </a>
              </li>
              <li>
                <a href="#stays" className="hover:text-white hover:underline transition-colors">
                  Village Sabbaticals
                </a>
              </li>
              <li>
                <a href="#stays" className="hover:text-white hover:underline transition-colors">
                  Fiber Optic Cottages
                </a>
              </li>
              <li>
                <a href="#community" className="hover:text-white hover:underline transition-colors text-[#91A77B]">
                  Ground Price Index
                </a>
              </li>
              <li>
                <a href="#stays" className="hover:text-white hover:underline transition-colors">
                  Fair Lease Standards
                </a>
              </li>
            </ul>
          </div>

          {/* Links Column 4: Trust & Legal (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-[#91A77B] mb-4">
              STANDARDS & TRUST
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E8EFE3]/80 font-mono">
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenCookies}
                  className="hover:text-white hover:underline transition-colors text-left"
                >
                  Cookies Policy
                </button>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white hover:underline transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BRAND_CONFIG.supportEmail}`}
                  className="hover:text-white hover:underline transition-colors flex items-center gap-1.5 text-[#34D399]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{BRAND_CONFIG.supportEmail}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Professional Trust & Verification Standards Strip */}
        <div className="py-6 border-b border-[#285A40]/40 my-2">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#164E2D] border border-[#34D399]/40 flex items-center justify-center shrink-0 text-[#34D399]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-white uppercase font-mono tracking-wider text-[11px] block">
                  Platform Safety & Verification Standard
                </span>
                <p className="text-[#D8E8D5]/70 text-[11px] font-light mt-0.5 leading-relaxed">
                  Never pay money for job openings or interviews. For property leases and sales, independently inspect physical access and registry deeds before transferring deposits. Community reports and ground prices are user-shared benchmarks.
                </p>
              </div>
            </div>
            <a
              href={`mailto:${BRAND_CONFIG.supportEmail}?subject=Trust%20and%20Safety%20Inquiry`}
              className="shrink-0 text-[11px] font-mono text-[#34D399] hover:text-white px-3 py-1.5 rounded-lg border border-[#34D399]/40 hover:bg-[#34D399]/10 transition"
            >
              Report Fraud / Discrepancy →
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Tessimo Watermark */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#E8EFE3]/70">
          <div>
            © {BRAND_CONFIG.copyrightYear} {BRAND_CONFIG.name}. Pan-India Mountain Digital Exchange.
          </div>

          {/* Watermark: Built with love by Tessimo (tessimo.in) */}
          <div className="flex items-center gap-1.5 text-[#D8E8D5] text-xs">
            <span>Built with love by</span>
            <a
              href="https://tessimo.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#34D399] font-bold hover:text-white hover:underline transition-colors"
            >
              Tessimo (tessimo.in)
            </a>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#91A77B]">
              <Leaf className="w-3.5 h-3.5 text-[#91A77B]" />
              <span>100% Community Supported</span>
            </span>

            <button
              onClick={scrollToTop}
              type="button"
              className="inline-flex items-center gap-1 text-[#E8EFE3] hover:text-white transition-colors focus:outline-none"
              title="Return to top of page"
            >
              <span>Top of Ridge</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#91A77B]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
