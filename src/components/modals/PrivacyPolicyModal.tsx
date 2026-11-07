import { useState } from 'react'
import type { FC } from 'react'
import {
  X,
  ShieldCheck,
  Lock,
  EyeOff,
  CheckCircle2,
  FileText,
  UserCheck,
  AlertTriangle,
  Scale,
  Languages
} from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export const PrivacyPolicyModal: FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const [lang, setLang] = useState<'en' | 'hi'>('en')

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
    >
      <div
        className="bg-[#F8F6F0] border border-[#CBDAC4] text-[#123D2D] rounded-sm max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with DPDP Statutory Tag & Language Selector */}
        <div className="sticky top-0 bg-[#F8F6F0] border-b border-[#CBDAC4] px-5 sm:px-8 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.16em] text-[#285A40] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#285A40]" />
              <span>DPDP ACT 2023 COMPLIANT • GOVT OF INDIA</span>
            </div>
            <h2 id="privacy-policy-title" className="font-serif text-lg sm:text-2xl text-[#0B2516] font-medium mt-0.5">
              {lang === 'en' ? 'Privacy Policy & Data Stewardship Charter' : 'गोपनीयता नीति एवं डेटा संरक्षण घोषणापत्र'}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bilingual Eighth Schedule Toggle (Section 5(3) DPDP Compliance) */}
            <div className="flex items-center bg-[#E8EFE3] p-0.5 rounded-sm border border-[#CBDAC4] text-xs font-mono">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-xs transition-colors flex items-center gap-1 ${
                  lang === 'en'
                    ? 'bg-[#0B2516] text-white font-semibold shadow-xs'
                    : 'text-[#285A40] hover:text-[#0B2516]'
                }`}
                aria-label="View Privacy Policy in English"
              >
                <span>EN</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 rounded-xs transition-colors flex items-center gap-1 ${
                  lang === 'hi'
                    ? 'bg-[#0B2516] text-white font-semibold shadow-xs'
                    : 'text-[#285A40] hover:text-[#0B2516]'
                }`}
                aria-label="View Privacy Policy in Hindi (Eighth Schedule Language)"
              >
                <Languages className="w-3 h-3" />
                <span>हिंदी</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#576159] hover:text-[#0B2516] hover:bg-[#E8EFE3] rounded-sm transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-8 space-y-6 text-xs sm:text-sm text-[#48534C] font-sans leading-relaxed">
          {lang === 'en' ? (
            /* ================= ENGLISH VERSION ================= */
            <>
              {/* Statutory Framework Banner */}
              <div className="p-4 bg-[#E8EFE3]/80 border border-[#CBDAC4] rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#123D2D] uppercase tracking-wider">
                  <Scale className="w-4 h-4 text-[#285A40]" />
                  <span>Statutory Notice under Digital Personal Data Protection Act, 2023</span>
                </div>
                <p className="text-xs text-[#285A40] font-light leading-normal">
                  This statutory notice is published in strict conformity with the <strong>Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023, Government of India)</strong>. Under this Act, <strong>{BRAND_CONFIG.name}</strong> acts as the <strong>Data Fiduciary</strong>, and you as a traveller, property steward, job applicant, or mountain resident act as the <strong>Data Principal</strong>.
                </p>
              </div>

              {/* Section 1: Itemized Personal Data & Purpose */}
              <div className="space-y-2">
                <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#285A40]" />
                  <span>1. Itemized Personal Data Collected & Specified Purpose (Sections 5 & 6)</span>
                </h3>
                <p>
                  In accordance with the principle of <em>Data Minimization</em>, we collect strictly the personal data necessary to facilitate authentic mountain exchanges:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#333D36]">
                  <li>
                    <strong>Homestay & Property Inquiries:</strong> Full Name, WhatsApp/Phone Number, Email Address, and Requested Lease Dates. <em>Specified Purpose:</em> Facilitating direct, commission-free contact between verified mountain property hosts and prospective residents.
                  </li>
                  <li>
                    <strong>Mountain Job Applications:</strong> Name, Contact Details, Mountain Terrain Experience, and Resume/Credentials. <em>Specified Purpose:</em> Transmission directly to ethical mountain employers for seasonal hospitality, guiding, or agriculture vacancies with housing.
                  </li>
                  <li>
                    <strong>Community Ledger & Price Dispatches:</strong> Author Name, Mountain Region, and Field Observations. <em>Specified Purpose:</em> Preserving authentic ground price transparency and trail safety for Himalayan travellers.
                  </li>
                  <li>
                    <strong>Staff Authentication:</strong> Email and encrypted credentials for authorized regional moderators.
                  </li>
                </ul>
                <div className="p-3 bg-white border border-[#CBDAC4] rounded-sm flex items-start gap-2 text-xs text-[#123D2D]">
                  <EyeOff className="w-4 h-4 text-[#285A40] shrink-0 mt-0.5" />
                  <span><strong>Zero Third-Party Commercial Sale:</strong> We never sell, rent, monetize, or transfer your personal data to commercial data brokers, advertising networks, or third-party telemarketers.</span>
                </div>
              </div>

              {/* Section 2: Lawful Consent & Withdrawal */}
              <div className="space-y-2">
                <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#285A40]" />
                  <span>2. Unambiguous Consent & Right to Withdraw (Section 6(4))</span>
                </h3>
                <p>
                  Your consent is obtained through clear affirmative action via explicit checkboxes prior to submitting any inquiry, job application, or community post.
                </p>
                <p className="text-xs bg-[#E8EFE3]/50 p-3 border border-[#CBDAC4] rounded-sm text-[#285A40]">
                  <strong>Right to Withdraw Consent:</strong> Under Section 6(4) of the DPDP Act 2023, you have the statutory right to withdraw your consent at any time with the same ease with which it was given. Upon receipt of your withdrawal request, we will cease processing your personal data within 7 business days.
                </p>
              </div>

              {/* Section 3: Statutory Rights of Data Principals */}
              <div className="space-y-2">
                <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#285A40]" />
                  <span>3. Statutory Rights of the Data Principal (Sections 11, 12, 13 & 14)</span>
                </h3>
                <p>
                  As an Indian citizen and Data Principal under the DPDP Act 2023, you possess the following enforceable rights:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#333D36]">
                  <li>
                    <strong>Right to Access Summary (Section 11):</strong> Request a complete summary of all personal data held and processed by us.
                  </li>
                  <li>
                    <strong>Right to Correction & Updating (Section 12(1)):</strong> Correct inaccurate, incomplete, or out-of-date personal data.
                  </li>
                  <li>
                    <strong>Right to Erasure / Right to be Forgotten (Section 12(3)):</strong> Request immediate permanent deletion of your inquiry records, resumes, and contact numbers.
                  </li>
                  <li>
                    <strong>Right of Grievance Redressal (Section 13):</strong> Access a speedy, cost-free grievance redressal mechanism regarding your personal data.
                  </li>
                  <li>
                    <strong>Right to Nominate (Section 14):</strong> Designate another individual to exercise your data rights in the event of death or incapacity.
                  </li>
                </ul>
              </div>

              {/* Section 4: Protection of Children's Personal Data */}
              <div className="space-y-2">
                <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>4. Protection of Children's Personal Data (Section 9)</span>
                </h3>
                <p className="text-xs text-[#333D36]">
                  In strict compliance with <strong>Section 9 of the DPDP Act 2023</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#333D36]">
                  <li>
                    The {BRAND_CONFIG.name} platform is designed for individuals aged 18 years and older. We do not knowingly collect personal data from minors under 18 years without verifiable parental/guardian consent.
                  </li>
                  <li>
                    We <strong>strictly prohibit</strong> any behavioral tracking, profiling, or targeted advertising directed at children.
                  </li>
                </ul>
              </div>

              {/* Section 5: Cryptographic Security & Row Level Security */}
              <div className="space-y-2">
                <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#285A40]" />
                  <span>5. Reasonable Security Safeguards & Encryption (Section 8(5))</span>
                </h3>
                <p>
                  To prevent unauthorized access, data breaches, or scraping:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#333D36]">
                  <li>
                    <strong>Row-Level Security (RLS):</strong> All Supabase PostgreSQL tables strictly enforce cryptographic RLS policies. Unauthenticated visitors cannot scrape applicant phone numbers or emails.
                  </li>
                  <li>
                    <strong>Transport Layer Security:</strong> All data transmissions are encrypted using TLS 1.3 / HTTPS with HSTS headers.
                  </li>
                  <li>
                    <strong>Data Storage:</strong> Encrypted databases hosted with compliant cloud standards, restricted exclusively to authorized regional stewards.
                  </li>
                </ul>
              </div>

              {/* Section 6: Grievance Redressal Officer & Data Protection Board of India */}
              <div className="p-4 bg-[#F2EFE8] border border-[#CBDAC4] rounded-sm space-y-2.5">
                <h3 className="font-serif text-base text-[#0B2516] font-semibold">
                  6. Designated Grievance Redressal Officer & Appellate Mechanism
                </h3>
                <p className="text-xs text-[#333D36]">
                  In compliance with <strong>Section 8(9) & Section 13</strong> of the DPDP Act 2023, you may address any privacy concerns, data erasure requests, or statutory grievances to our designated Grievance Officer:
                </p>
                <div className="text-xs font-mono space-y-1 bg-white p-3 border border-[#CBDAC4] rounded-xs text-[#123D2D]">
                  <div><strong>Designation:</strong> Data Protection Steward & Grievance Redressal Officer</div>
                  <div><strong>Entity:</strong> {BRAND_CONFIG.name} Legal & Community Compliance</div>
                  <div>
                    <strong>Official Email:</strong>{' '}
                    <a href={`mailto:${BRAND_CONFIG.supportEmail}`} className="underline text-[#285A40]">
                      {BRAND_CONFIG.supportEmail}
                    </a>
                  </div>
                  <div><strong>Statutory Turnaround Time:</strong> Response and resolution within 30 days of grievance receipt.</div>
                </div>
                <p className="text-xs text-[#576159] leading-normal">
                  <strong>Right to Appeal to the Data Protection Board of India (DPBI):</strong> If your grievance is not resolved to your satisfaction within 30 days, you have the statutory right under the DPDP Act 2023 to submit a complaint directly to the <em>Data Protection Board of India, New Delhi</em>.
                </p>
              </div>
            </>
          ) : (
            /* ================= HINDI VERSION (EIGHTH SCHEDULE COMPLIANCE) ================= */
            <>
              {/* Statutory Framework Banner */}
              <div className="p-4 bg-[#E8EFE3]/80 border border-[#CBDAC4] rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#123D2D] uppercase tracking-wider">
                  <Scale className="w-4 h-4 text-[#285A40]" />
                  <span>डिजिटल वैयक्तिक डेटा संरक्षण अधिनियम, 2023 (DPDP Act) के अंतर्गत वैधानिक सूचना</span>
                </div>
                <p className="text-xs text-[#285A40] font-light leading-normal">
                  यह वैधानिक सूचना भारत सरकार के <strong>डिजिटल वैयक्तिक डेटा संरक्षण अधिनियम, 2023 (Digital Personal Data Protection Act, 2023)</strong> के पूर्ण अनुपालन में प्रकाशित की गई है। इस अधिनियम के अंतर्गत, <strong>{BRAND_CONFIG.name}</strong> एक <strong>डेटा फिड्यूशरी (Data Fiduciary)</strong> के रूप में कार्य करता है, तथा आप (यात्री, गृहस्वामी, या नौकरी आवेदक) <strong>डेटा प्रिंसिपल (Data Principal)</strong> हैं।
                </p>
              </div>

              {/* Section 1: Data Collection in Hindi */}
              <div className="space-y-2">
                <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#285A40]" />
                  <span>1. एकत्रित किया जाने वाला व्यक्तिगत डेटा एवं उद्देश्य (धारा 5 एवं 6)</span>
                </h3>
                <p>
                  डेटा न्यूनतमकरण (Data Minimization) के सिद्धांत के तहत हम केवल वही जानकारी एकत्र करते हैं जो आपकी पर्वतीय सेवाओं के लिए अनिवार्य है:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#333D36]">
                  <li>
                    <strong>होमस्टे एवं लीज पूछताछ:</strong> पूरा नाम, व्हाट्सएप/फोन नंबर, ईमेल और रहने की अवधि। <em>उद्देश्य:</em> सत्यापित पहाड़ी होमस्टे स्वामियों से आपका सीधा संपर्क स्थापित कराना।
                  </li>
                  <li>
                    <strong>पर्वतीय रोजगार आवेदन:</strong> नाम, संपर्क सूत्र, पहाड़ी क्षेत्रों का अनुभव एवं बायोडाटा। <em>उद्देश्य:</em> नैतिक नियोक्ताओं तक आपका आवेदन पहुंचाना।
                  </li>
                  <li>
                    <strong>सामुदायिक मूल्य सूचकांक एवं रिपोर्ट:</strong> लेखक का नाम, क्षेत्र एवं जमीनी रिपोर्ट। <em>उद्देश्य:</em> पारदर्शी साझा टैक्सी दरों व सुरक्षित यात्रा की जानकारी साझा करना।
                  </li>
                </ul>
                <div className="p-3 bg-white border border-[#CBDAC4] rounded-sm flex items-start gap-2 text-xs text-[#123D2D]">
                  <EyeOff className="w-4 h-4 text-[#285A40] shrink-0 mt-0.5" />
                  <span><strong>डेटा की बिक्री पर पूर्ण प्रतिबंध:</strong> हम आपका व्यक्तिगत डेटा कभी भी किसी विज्ञापन कंपनी, डेटा ब्रोकर या टेलीमार्केटर को नहीं बेचते हैं।</span>
                </div>
              </div>

              {/* Section 2: Consent in Hindi */}
              <div className="space-y-2">
                <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#285A40]" />
                  <span>2. स्पष्ट सहमति एवं सहमति वापस लेने का अधिकार (धारा 6(4))</span>
                </h3>
                <p>
                  आपकी सहमति किसी भी फॉर्म को जमा करने से पहले चेकबॉक्स पर स्पष्ट स्वीकृति द्वारा ली जाती है।
                </p>
                <p className="text-xs bg-[#E8EFE3]/50 p-3 border border-[#CBDAC4] rounded-sm text-[#285A40]">
                  <strong>सहमति वापस लेने का अधिकार:</strong> धारा 6(4) के अंतर्गत, आप किसी भी समय अपनी सहमति उसी सरलता से वापस ले सकते हैं जैसे आपने दी थी। सहमति वापसी की सूचना मिलने के 7 कार्य दिवसों के भीतर हम आपका डेटा संसाधित करना बंद कर देंगे।
                </p>
              </div>

              {/* Section 3: Rights of Data Principal in Hindi */}
              <div className="space-y-2">
                <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#285A40]" />
                  <span>3. डेटा प्रिंसिपल के वैधानिक अधिकार (धारा 11, 12, 13 एवं 14)</span>
                </h3>
                <p>
                  DPDP अधिनियम 2023 के अंतर्गत आपको निम्नलिखित कानूनी अधिकार प्राप्त हैं:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#333D36]">
                  <li>
                    <strong>जानकारी प्राप्त करने का अधिकार (धारा 11):</strong> हमारे पास मौजूद अपने सभी व्यक्तिगत डेटा का सारांश देखने का अधिकार।
                  </li>
                  <li>
                    <strong>डेटा सुधार का अधिकार (धारा 12(1)):</strong> गलत, अपूर्ण या पुराने व्यक्तिगत डेटा को ठीक कराने का अधिकार।
                  </li>
                  <li>
                    <strong>डेटा मिटाने का अधिकार / भूलने का अधिकार (धारा 12(3)):</strong> अपनी पूछताछ, बायोडाटा एवं संपर्क जानकारी को स्थायी रूप से नष्ट कराने का अधिकार।
                  </li>
                  <li>
                    <strong>शिकायत निवारण का अधिकार (धारा 13):</strong> गोपनीयता व डेटा संबंधित शिकायतों के त्वरित निवारण का अधिकार।
                  </li>
                  <li>
                    <strong>नामांकन का अधिकार (धारा 14):</strong> मृत्यु या अक्षमता की स्थिति में अपने डेटा अधिकारों का प्रयोग करने हेतु किसी प्रतिनिधि को नामित करने का अधिकार।
                  </li>
                </ul>
              </div>

              {/* Section 4: Children Data in Hindi */}
              <div className="space-y-2">
                <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>4. बच्चों के व्यक्तिगत डेटा का संरक्षण (धारा 9)</span>
                </h3>
                <p className="text-xs text-[#333D36]">
                  <strong>धारा 9 के अंतर्गत:</strong> यह मंच 18 वर्ष और उससे अधिक आयु के व्यक्तियों के लिए है। हम 18 वर्ष से कम आयु के नाबालिगों का डेटा उनके माता-पिता/अभिभावक की सहमति के बिना एकत्र नहीं करते। बच्चों पर किसी भी प्रकार की ट्रैकिंग या विज्ञापनों का लक्ष्यीकरण पूर्णतः निषिद्ध है।
                </p>
              </div>

              {/* Section 5: Security in Hindi */}
              <div className="space-y-2">
                <h3 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#285A40]" />
                  <span>5. सुरक्षा उपाय एवं एन्क्रिप्शन (धारा 8(5))</span>
                </h3>
                <p className="text-xs text-[#333D36]">
                  आपके डेटा को अनधिकृत पहुंच या डेटा चोरी से बचाने के लिए डेटाबेस स्तर पर <strong>Row-Level Security (RLS)</strong> और डेटा ट्रांसमिशन के समय <strong>TLS 1.3/HTTPS एन्क्रिप्शन</strong> का उपयोग किया गया है।
                </p>
              </div>

              {/* Section 6: Grievance Officer in Hindi */}
              <div className="p-4 bg-[#F2EFE8] border border-[#CBDAC4] rounded-sm space-y-2.5">
                <h3 className="font-serif text-base text-[#0B2516] font-semibold">
                  6. नामित शिकायत निवारण अधिकारी एवं भारतीय डेटा संरक्षण बोर्ड
                </h3>
                <p className="text-xs text-[#333D36]">
                  धारा 8(9) एवं धारा 13 के अंतर्गत, किसी भी गोपनीयता प्रश्न या डेटा मिटाने के अनुरोध हेतु हमारे शिकायत निवारण अधिकारी से संपर्क करें:
                </p>
                <div className="text-xs font-mono space-y-1 bg-white p-3 border border-[#CBDAC4] rounded-xs text-[#123D2D]">
                  <div><strong>पदनाम:</strong> डेटा संरक्षण एवं शिकायत निवारण अधिकारी (Grievance Officer)</div>
                  <div><strong>संस्था:</strong> {BRAND_CONFIG.name} लीगल एवं कम्प्लायंस</div>
                  <div>
                    <strong>आधिकारिक ईमेल:</strong>{' '}
                    <a href={`mailto:${BRAND_CONFIG.supportEmail}`} className="underline text-[#285A40]">
                      {BRAND_CONFIG.supportEmail}
                    </a>
                  </div>
                  <div><strong>कानूनी निस्तारण समय:</strong> शिकायत प्राप्ति के 30 दिनों के भीतर समाधान।</div>
                </div>
                <p className="text-xs text-[#576159] leading-normal">
                  <strong>भारतीय डेटा संरक्षण बोर्ड (DPBI) में अपील का अधिकार:</strong> यदि आप हमारे समाधान से संतुष्ट नहीं होते हैं, तो आपको <em>डेटा संरक्षण बोर्ड (Data Protection Board of India), नई दिल्ली</em> के समक्ष अपील दर्ज करने का वैधानिक अधिकार प्राप्त है।
                </p>
              </div>
            </>
          )}

          {/* Section 7: Effective Date & Verification Seal */}
          <div className="pt-4 border-t border-[#CBDAC4] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#576159]">
            <span>{lang === 'en' ? 'Effective Date: November 2026' : 'प्रभावी तिथि: नवंबर 2026'}</span>
            <span className="flex items-center gap-1.5 text-[#285A40] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#285A40]" />
              <span>{lang === 'en' ? 'DPDP Act 2023 Verified Standard' : 'DPDP अधिनियम 2023 सत्यापित मानक'}</span>
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#E8EFE3]/50 border-t border-[#CBDAC4] px-5 sm:px-8 py-3.5 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2 bg-[#0B2516] hover:bg-[#123D2D] text-white text-xs font-sans font-semibold uppercase tracking-wider rounded-sm transition-colors shadow-xs active:scale-[0.98]"
          >
            {lang === 'en' ? 'I Understand & Agree' : 'मैं समझता/समझती हूँ और सहमत हूँ'}
          </button>
        </div>
      </div>
    </div>
  )
}
