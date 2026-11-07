import { useState } from 'react'
import type { FC } from 'react'
import {
  Video,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  RefreshCw,
  PhoneCall,
  MessageCircle,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react'

type ConferencePlatform = 'google_meet' | 'whatsapp' | 'jitsi_popout'
type MeetingPurpose = 'property_verification' | 'job_interview' | 'steward_sync'

interface VerificationChecklistItem {
  id: string
  label: string
  description: string
  checked: boolean
}

function generateRoomSlug(type: MeetingPurpose): string {
  const prefix =
    type === 'property_verification'
      ? 'Property-Verify'
      : type === 'job_interview'
      ? 'Job-Interview'
      : 'Steward-Sync'
  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `MountainEcosystem-${prefix}-${randomSuffix}`
}

export const VideoConferenceManager: FC = () => {
  const [platform, setPlatform] = useState<ConferencePlatform>('google_meet')
  const [purpose, setPurpose] = useState<MeetingPurpose>('property_verification')
  const [participantName, setParticipantName] = useState<string>('Host / Applicant')
  const [participantPhone, setParticipantPhone] = useState<string>('')
  const [roomSlug, setRoomSlug] = useState<string>(() => generateRoomSlug('property_verification'))
  const [customMeetUrl, setCustomMeetUrl] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)

  // Verification Checklist State
  const [checklist, setChecklist] = useState<VerificationChecklistItem[]>([
    {
      id: 'docs',
      label: 'Land Title / Jamabandi & NOC Inspection',
      description: 'Verify original revenue patta or registry documents on camera to prevent fraudulent listings.',
      checked: false
    },
    {
      id: 'walkthrough',
      label: '360° Real-time Property & Room Walkthrough',
      description: 'Live inspection of rooms, heating radiator, bathroom hygiene, and balcony mountain vistas.',
      checked: false
    },
    {
      id: 'power_backup',
      label: 'Winter Heating & Solar Inverter Verification',
      description: 'Confirm operating fireplace/heater and at least 4–8 hours battery inverter backup for remote work.',
      checked: false
    },
    {
      id: 'wifi_test',
      label: 'Live Fiber Speed Test Screen Share',
      description: 'Ask host to run Speedtest.net live on screen to confirm stated Mbps for remote developers.',
      checked: false
    },
    {
      id: 'emergency',
      label: 'Host ID Verification & Emergency Access Road',
      description: 'Check government Aadhaar/Voter ID matching host name and confirm 4x4 road clearance in snow.',
      checked: false
    }
  ])

  const handlePurposeChange = (newPurpose: MeetingPurpose) => {
    setPurpose(newPurpose)
    setRoomSlug(generateRoomSlug(newPurpose))
  }

  // Generate links based on selected platform
  const getMeetingLink = (): string => {
    if (platform === 'google_meet') {
      return customMeetUrl.trim() || 'https://meet.google.com/new'
    }
    if (platform === 'whatsapp') {
      const cleanPhone = participantPhone.replace(/[^0-9]/g, '')
      const msg = encodeURIComponent(
        `🏔️ Mountain Ecosystem: Hello ${participantName}, this is the steward team calling for your ${
          purpose === 'property_verification' ? 'homestay verification' : 'interview'
        }. Please accept our WhatsApp Video Call.`
      )
      return cleanPhone ? `https://wa.me/${cleanPhone}?text=${msg}` : 'https://web.whatsapp.com/'
    }
    return `https://meet.jit.si/${encodeURIComponent(roomSlug)}`
  }

  const activeLink = getMeetingLink()

  const copyInvite = async () => {
    try {
      const purposeText =
        purpose === 'property_verification'
          ? 'Live Homestay/Property Verification Call'
          : purpose === 'job_interview'
          ? 'Mountain Job Candidate Interview'
          : 'Regional Steward Coordination Call'

      const inviteText = `🏔️ Mountain Ecosystem Video Conference Invite\n\nPurpose: ${purposeText}\nParticipant: ${participantName}\nPlatform: ${
        platform === 'google_meet' ? 'Google Meet' : platform === 'whatsapp' ? 'WhatsApp Video' : 'Secure WebRTC Room'
      }\n\nJoin Link:\n${activeLink}\n\n(No app required. Open in your mobile or laptop browser).`

      await navigator.clipboard.writeText(inviteText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
    }
  }

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const completedCount = checklist.filter((i) => i.checked).length

  return (
    <div className="space-y-6">
      {/* 1. Top Header Banner */}
      <div className="bg-[#0B2516] border border-[#1F4E34] text-[#F8F6F0] p-6 sm:p-8 rounded-sm shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-[#8FA777] uppercase font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#8FA777]" />
              <span>MODULE 04 • UNLIMITED VIRTUAL VERIFICATION SUITE</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Virtual Conference & Host Verification Suite
            </h1>
            <p className="text-xs sm:text-sm text-[#D8E8D5] font-light max-w-2xl leading-relaxed">
              Conduct unlimited HD video calls for property authenticity inspections, remote job candidate interviews, and regional steward coordination. Free from 5-minute disconnect limits or mandatory third-party software downloads.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-[#8FA777]/30 text-[#8FA777] rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Unlimited Call Line Ready</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Platform Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Option 1: Google Meet */}
        <div
          onClick={() => setPlatform('google_meet')}
          className={`p-4 rounded-sm border cursor-pointer transition-all ${
            platform === 'google_meet'
              ? 'bg-[#0B2516] border-[#8FA777] text-white shadow-md'
              : 'bg-[#F8F6F0] border-[#CBDAC4] text-[#0B2516] hover:bg-[#E8EFE3]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-xs">
              M
            </div>
            {platform === 'google_meet' && (
              <span className="text-[10px] font-mono uppercase bg-[#8FA777] text-[#0B2516] font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="font-serif text-base font-semibold">Google Meet (1-Click)</div>
          <div className={`text-xs mt-1 leading-normal ${platform === 'google_meet' ? 'text-white/80' : 'text-[#576159]'}`}>
            Unlimited HD call with screen sharing. Works in any browser without 5-min limits.
          </div>
        </div>

        {/* Option 2: WhatsApp Video Call */}
        <div
          onClick={() => setPlatform('whatsapp')}
          className={`p-4 rounded-sm border cursor-pointer transition-all ${
            platform === 'whatsapp'
              ? 'bg-[#0B2516] border-[#8FA777] text-white shadow-md'
              : 'bg-[#F8F6F0] border-[#CBDAC4] text-[#0B2516] hover:bg-[#E8EFE3]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-500 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            {platform === 'whatsapp' && (
              <span className="text-[10px] font-mono uppercase bg-[#8FA777] text-[#0B2516] font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="font-serif text-base font-semibold">WhatsApp Video Call</div>
          <div className={`text-xs mt-1 leading-normal ${platform === 'whatsapp' ? 'text-white/80' : 'text-[#576159]'}`}>
            Best for mountain homestay hosts. Direct mobile video call on their phone number.
          </div>
        </div>

        {/* Option 3: Full-Screen WebRTC Room */}
        <div
          onClick={() => setPlatform('jitsi_popout')}
          className={`p-4 rounded-sm border cursor-pointer transition-all ${
            platform === 'jitsi_popout'
              ? 'bg-[#0B2516] border-[#8FA777] text-white shadow-md'
              : 'bg-[#F8F6F0] border-[#CBDAC4] text-[#0B2516] hover:bg-[#E8EFE3]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            {platform === 'jitsi_popout' && (
              <span className="text-[10px] font-mono uppercase bg-[#8FA777] text-[#0B2516] font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          <div className="font-serif text-base font-semibold">Full-Tab WebRTC Room</div>
          <div className={`text-xs mt-1 leading-normal ${platform === 'jitsi_popout' ? 'text-white/80' : 'text-[#576159]'}`}>
            Runs in standalone window (bypassing the 5-min iframe embedding cutoff).
          </div>
        </div>
      </div>

      {/* 3. Main Operational Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Meeting Parameters & Action Launcher */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#F8F6F0] border border-[#CBDAC4] p-5 sm:p-6 rounded-sm space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#CBDAC4] pb-3">
              <h2 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
                <Video className="w-4 h-4 text-[#285A40]" />
                <span>Call Dispatch Parameters</span>
              </h2>
              <span className="text-xs font-mono text-[#285A40] uppercase font-semibold">
                {platform === 'google_meet' ? 'Google Meet Mode' : platform === 'whatsapp' ? 'WhatsApp Mode' : 'WebRTC Mode'}
              </span>
            </div>

            {/* Purpose Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#285A40] font-semibold">
                Meeting Purpose
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => handlePurposeChange('property_verification')}
                  className={`p-2.5 rounded-sm border text-center transition-all ${
                    purpose === 'property_verification'
                      ? 'bg-[#0B2516] text-white border-[#0B2516] font-semibold shadow-xs'
                      : 'bg-white text-[#285A40] border-[#CBDAC4] hover:bg-[#E8EFE3]'
                  }`}
                >
                  Host Verify
                </button>
                <button
                  type="button"
                  onClick={() => handlePurposeChange('job_interview')}
                  className={`p-2.5 rounded-sm border text-center transition-all ${
                    purpose === 'job_interview'
                      ? 'bg-[#0B2516] text-white border-[#0B2516] font-semibold shadow-xs'
                      : 'bg-white text-[#285A40] border-[#CBDAC4] hover:bg-[#E8EFE3]'
                  }`}
                >
                  Job Interview
                </button>
                <button
                  type="button"
                  onClick={() => handlePurposeChange('steward_sync')}
                  className={`p-2.5 rounded-sm border text-center transition-all ${
                    purpose === 'steward_sync'
                      ? 'bg-[#0B2516] text-white border-[#0B2516] font-semibold shadow-xs'
                      : 'bg-white text-[#285A40] border-[#CBDAC4] hover:bg-[#E8EFE3]'
                  }`}
                >
                  Steward Sync
                </button>
              </div>
            </div>

            {/* Participant Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#285A40] font-semibold">
                Guest / Host / Applicant Name
              </label>
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="e.g. Pemba Sherpa (Lebong Homestay)"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBDAC4] rounded-sm text-[#0B2516] focus:outline-none focus:border-[#0B2516]"
              />
            </div>

            {/* Phone Number (For WhatsApp Mode) */}
            {platform === 'whatsapp' && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#285A40] font-semibold">
                  Host / Candidate WhatsApp Number (with country code)
                </label>
                <input
                  type="tel"
                  value={participantPhone}
                  onChange={(e) => setParticipantPhone(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBDAC4] rounded-sm text-[#0B2516] font-mono focus:outline-none focus:border-[#0B2516]"
                />
              </div>
            )}

            {/* Custom Google Meet URL (For Google Meet Mode) */}
            {platform === 'google_meet' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#285A40] font-semibold">
                    Google Meet Room Link
                  </label>
                  <span className="text-[10px] text-[#576159] font-mono">Optional Custom Link</span>
                </div>
                <input
                  type="text"
                  value={customMeetUrl}
                  onChange={(e) => setCustomMeetUrl(e.target.value)}
                  placeholder="e.g. https://meet.google.com/abc-defg-hij (Leave blank to generate fresh)"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBDAC4] rounded-sm text-[#0B2516] font-mono focus:outline-none focus:border-[#0B2516]"
                />
              </div>
            )}

            {/* Jitsi Room ID (For Jitsi Mode) */}
            {platform === 'jitsi_popout' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#285A40] font-semibold">
                    Encrypted Room ID
                  </label>
                  <button
                    type="button"
                    onClick={() => setRoomSlug(generateRoomSlug(purpose))}
                    className="text-[11px] font-mono text-[#285A40] hover:text-[#0B2516] flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>New ID</span>
                  </button>
                </div>
                <div className="px-3 py-2 bg-[#E8EFE3]/80 border border-[#CBDAC4] rounded-sm font-mono text-xs text-[#0B2516] truncate">
                  {roomSlug}
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <a
                href={activeLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3.5 text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] text-white ${
                  platform === 'whatsapp'
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : platform === 'google_meet'
                    ? 'bg-blue-700 hover:bg-blue-800'
                    : 'bg-[#0B2516] hover:bg-[#123D2D]'
                }`}
              >
                {platform === 'whatsapp' ? (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    <span>Call Host via WhatsApp Video</span>
                  </>
                ) : platform === 'google_meet' ? (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch Google Meet (No 5-Min Limit)</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch WebRTC Room (Standalone Window)</span>
                  </>
                )}
              </a>

              <button
                type="button"
                onClick={copyInvite}
                className="w-full py-2.5 px-3 bg-white hover:bg-[#E8EFE3] text-[#0B2516] border border-[#CBDAC4] rounded-sm text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Invite Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#285A40]" />
                    <span>Copy WhatsApp / Email Invitation Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Technical Explanation on 5-Minute Disconnect Warning */}
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-sm text-xs space-y-1.5 leading-relaxed">
            <div className="font-semibold flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Why Did Jitsi Show A 5-Minute Warning?</span>
            </div>
            <p className="text-[11px] text-amber-950 font-light">
              8x8 (the company running Jitsi) recently added an automated restriction that disconnects calls after 5 minutes <strong>ONLY if embedded inside an iframe</strong> to force people to buy their paid cloud service.
            </p>
            <p className="text-[11px] text-amber-950 font-light">
              By using <strong>Google Meet</strong>, <strong>WhatsApp Video Call</strong>, or opening the conference in a <strong>standalone browser tab</strong>, the 5-minute disconnect restriction is <strong>100% bypassed</strong> with unlimited call duration!
            </p>
          </div>
        </div>

        {/* Right Column: 5-Point Host Verification Protocol & Live Audit */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#F8F6F0] border border-[#CBDAC4] p-5 sm:p-6 rounded-sm space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#CBDAC4] pb-2">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#285A40]" />
                <span className="font-serif text-base font-semibold text-[#0B2516]">
                  Live Video Verification Checklist
                </span>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#E8EFE3] text-[#285A40]">
                {completedCount}/{checklist.length} Completed
              </span>
            </div>

            <p className="text-xs text-[#576159] leading-relaxed">
              While on the live video call with the host or job candidate, audit these 5 points to prevent fraud and protect mountain travellers:
            </p>

            <div className="space-y-2.5 pt-1">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-xs border transition-colors cursor-pointer text-xs ${
                    item.checked
                      ? 'bg-[#E8EFE3] border-[#A5C896] text-[#0B2516]'
                      : 'bg-white border-[#CBDAC4] text-[#48534C] hover:bg-[#F2EFE8]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="mt-0.5 rounded text-[#285A40] focus:ring-[#285A40]"
                  />
                  <div className="flex-1 space-y-0.5">
                    <div className={`font-medium text-xs ${item.checked ? 'line-through text-[#285A40]' : 'text-[#0B2516]'}`}>
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#576159] leading-normal font-light">
                      {item.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Final Action on Verification */}
            <div className="p-3.5 bg-white border border-[#CBDAC4] rounded-sm flex items-center justify-between text-xs font-mono">
              <div className="text-[#285A40]">
                {completedCount === checklist.length ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>All 5 Verification Standards Satisfied!</span>
                  </span>
                ) : (
                  <span>Check off all 5 items to verify listing</span>
                )}
              </div>
              <span className="text-[10px] text-[#576159]">
                Anti-Fraud Protocol Active
              </span>
            </div>
          </div>

          {/* Quick Advantage Badges */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-[#F8F6F0] border border-[#CBDAC4] rounded-sm space-y-1">
              <Clock className="w-4 h-4 text-[#285A40] mx-auto" />
              <div className="text-xs font-serif font-semibold text-[#0B2516]">Unlimited Time</div>
              <div className="text-[10px] text-[#576159]">Zero 5-min disconnects</div>
            </div>

            <div className="p-3 bg-[#F8F6F0] border border-[#CBDAC4] rounded-sm space-y-1">
              <PhoneCall className="w-4 h-4 text-[#285A40] mx-auto" />
              <div className="text-xs font-serif font-semibold text-[#0B2516]">WhatsApp Ready</div>
              <div className="text-[10px] text-[#576159]">Direct mobile call</div>
            </div>

            <div className="p-3 bg-[#F8F6F0] border border-[#CBDAC4] rounded-sm space-y-1">
              <Sparkles className="w-4 h-4 text-[#285A40] mx-auto" />
              <div className="text-xs font-serif font-semibold text-[#0B2516]">100% Free</div>
              <div className="text-[10px] text-[#576159]">Zero subscriptions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
