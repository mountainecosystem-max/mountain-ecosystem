import type { FC } from 'react'
import { X, ShieldCheck, Lock, EyeOff, CheckCircle2 } from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export const PrivacyPolicyModal: FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#F8F6F0] border border-[#CBDAC4] text-[#123D2D] rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-[#F8F6F0] border-b border-[#CBDAC4] px-6 sm:px-8 py-4.5 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#285A40] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#285A40]" />
              <span>COMMUNITY TRUST & DATA STEWARDSHIP</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#0B2516] font-medium mt-0.5">
              Privacy Policy & Charter
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#576159] hover:text-[#0B2516] hover:bg-[#E8EFE3] rounded-sm transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#48534C] font-sans leading-relaxed">
          {/* Manifesto Intro Callout */}
          <div className="p-4 bg-[#E8EFE3]/70 border border-[#CBDAC4] rounded-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#123D2D] uppercase tracking-wider">
              <EyeOff className="w-4 h-4 text-[#285A40]" />
              <span>Our Non-Commercial Data Pledge</span>
            </div>
            <p className="text-xs text-[#285A40] font-light">
              {BRAND_CONFIG.name} is built as community digital infrastructure for the {BRAND_CONFIG.region}. We do not sell your personal data, run behavioral advertising trackers, or monetize traveller browsing activity.
            </p>
          </div>

          {/* Section 1: Information Collected */}
          <div className="space-y-2">
            <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
              <span>1. Information We Collect</span>
            </h3>
            <p>
              We collect only the essential information necessary to facilitate respectful mountain travel, community posting, job applications, and residential homestay inquiries:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#333D36]">
              <li><strong>Authentication Data:</strong> When creating an account or signing in with email, we securely store your email address and name to manage your community session.</li>
              <li><strong>Community Ledger Submissions:</strong> Public field notes, mountain price reports, trail updates, and traveller stories you voluntarily choose to publish.</li>
              <li><strong>Inquiry & Application Records:</strong> Contact details (phone, email, message, term dates) entered when submitting a job application or homestay inquiry.</li>
            </ul>
          </div>

          {/* Section 2: How We Use Your Data */}
          <div className="space-y-2">
            <h3 className="font-serif text-base text-[#0B2516] font-semibold">
              2. How Your Data is Used
            </h3>
            <p>
              Your data is utilized solely for legitimate community operations:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#333D36]">
              <li>Maintaining your authenticated session across visits.</li>
              <li>Attributing community ledger dispatches to verified authors to preserve community integrity.</li>
              <li>Directly connecting you with vetted host families and ethical employers upon inquiry submission.</li>
              <li>Enforcing safety, transparent pricing standards, and ecological guidelines.</li>
            </ul>
          </div>

          {/* Section 3: Data Protection & Isolation */}
          <div className="space-y-2">
            <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#285A40]" />
              <span>3. Cryptographic Storage & Security</span>
            </h3>
            <p>
              All data is stored in modern PostgreSQL databases safeguarded by Supabase enterprise encryption and strict <strong>Row-Level Security (RLS)</strong> policies. Sensitive applicant records and personal phone numbers are restricted: only the submitting applicant and authorized stewards have access.
            </p>
          </div>

          {/* Section 4: Your Rights */}
          <div className="space-y-2">
            <h3 className="font-serif text-base text-[#0B2516] font-semibold">
              4. Your Rights & Data Erasure
            </h3>
            <p>
              You maintain complete ownership of your contributions. At any time, you may request:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#333D36]">
              <li>A complete export of your submitted ledger dispatches and applications.</li>
              <li>Immediate deletion or anonymization of your profile and records.</li>
            </ul>
            <p className="text-xs text-[#576159] mt-1">
              To exercise these rights, contact our regional stewards at{' '}
              <a href={`mailto:${BRAND_CONFIG.supportEmail}`} className="text-[#123D2D] font-mono underline">
                {BRAND_CONFIG.supportEmail}
              </a>.
            </p>
          </div>

          {/* Section 5: Effective Date */}
          <div className="pt-4 border-t border-[#CBDAC4] flex items-center justify-between text-xs font-mono text-[#576159]">
            <span>Effective Date: November 2026</span>
            <span className="flex items-center gap-1 text-[#285A40]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Community Standard</span>
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#E8EFE3]/50 border-t border-[#CBDAC4] px-6 sm:px-8 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 bg-[#0B2516] hover:bg-[#123D2D] text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-sm transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}
