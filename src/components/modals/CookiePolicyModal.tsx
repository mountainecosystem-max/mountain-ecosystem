import type { FC } from 'react'
import { X, Cookie, ShieldCheck, Settings } from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'

interface CookiePolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CookiePolicyModal: FC<CookiePolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#F8F6F0] border border-[#CBDAC4] text-[#123D2D] rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-[#F8F6F0] border-b border-[#CBDAC4] px-6 sm:px-8 py-4.5 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#285A40] font-bold">
              <Cookie className="w-4 h-4 text-[#285A40]" />
              <span>TRANSPARENCY & COOKIE STANDARDS</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#0B2516] font-medium mt-0.5">
              Cookies & Local Storage Policy
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center p-1.5 text-[#576159] hover:text-[#0B2516] hover:bg-[#E8EFE3] active:bg-[#CBDAC4] rounded-full transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#48534C] font-sans leading-relaxed">
          {/* Intro Callout */}
          <div className="p-4 bg-[#E8EFE3]/70 border border-[#CBDAC4] rounded-sm">
            <p className="text-xs text-[#285A40]">
              {BRAND_CONFIG.name} uses minimal cookies and browser local storage strictly necessary to authenticate your account, keep sessions secure, and save your viewing preferences. We do not use third-party advertising cookies or cross-site tracking scripts.
            </p>
          </div>

          {/* Section 1: What We Use */}
          <div className="space-y-3">
            <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#285A40]" />
              <span>1. Categories of Cookies We Use</span>
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 bg-white border border-[#CBDAC4] rounded-sm">
                <div className="flex items-center justify-between font-mono text-xs font-semibold text-[#0B2516] mb-1">
                  <span>Strictly Essential (Authentication)</span>
                  <span className="text-[10px] uppercase px-2 py-0.5 bg-[#123D2D] text-white rounded-full">Always Active</span>
                </div>
                <p className="text-xs text-[#576159]">
                  Provided by Supabase Auth (e.g., <code className="text-[#285A40] font-mono">sb-*-auth-token</code>). These store cryptographic tokens confirming you are logged in, enabling you to post dispatches and manage listings safely.
                </p>
              </div>

              <div className="p-3 bg-white border border-[#CBDAC4] rounded-sm">
                <div className="flex items-center justify-between font-mono text-xs font-semibold text-[#0B2516] mb-1">
                  <span>Functional & Preferences</span>
                  <span className="text-[10px] uppercase px-2 py-0.5 bg-[#8FA777]/30 text-[#123D2D] rounded-full">Functional</span>
                </div>
                <p className="text-xs text-[#576159]">
                  Remembers your cookie consent choice and UI layout states so you are not prompted repeatedly on each reload.
                </p>
              </div>

              <div className="p-3 bg-white border border-[#CBDAC4] rounded-sm opacity-75">
                <div className="flex items-center justify-between font-mono text-xs font-semibold text-[#0B2516] mb-1">
                  <span>Marketing & Behavioral Tracking</span>
                  <span className="text-[10px] uppercase px-2 py-0.5 bg-red-100 text-red-700 rounded-full">None Used</span>
                </div>
                <p className="text-xs text-[#576159]">
                  We do not embed third-party advertising pixels, Facebook trackers, or commercial surveillance networks.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Managing Cookies */}
          <div className="space-y-2">
            <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#285A40]" />
              <span>2. How to Manage Cookies in Your Browser</span>
            </h3>
            <p>
              You can instruct your browser to refuse all cookies or notify you when a cookie is sent. However, if you disable essential cookies, account sign-in, dispatch submission, and staff console functionality will not operate correctly.
            </p>
          </div>

          {/* Section 3: Questions */}
          <div className="space-y-1 text-xs text-[#576159] pt-2 border-t border-[#CBDAC4]">
            <p>
              For questions regarding our cookie practices, email us at{' '}
              <a href={`mailto:${BRAND_CONFIG.supportEmail}`} className="text-[#123D2D] font-mono underline">
                {BRAND_CONFIG.supportEmail}
              </a>.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#E8EFE3]/50 border-t border-[#CBDAC4] px-6 sm:px-8 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 bg-[#0B2516] hover:bg-[#123D2D] text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-sm transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  )
}
