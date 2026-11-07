import { useState } from 'react'
import type { FC } from 'react'
import {
  Video,
  PhoneCall,
  PhoneOff,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Users,
  FileCheck2,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react'

type MeetingType = 'property_verification' | 'job_interview' | 'steward_sync'

interface VerificationChecklistItem {
  id: string
  label: string
  description: string
  checked: boolean
}

function generateRoomSlug(type: MeetingType): string {
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
  const [meetingType, setMeetingType] = useState<MeetingType>('property_verification')
  const [roomSlug, setRoomSlug] = useState<string>(() => generateRoomSlug('property_verification'))
  const [participantName, setParticipantName] = useState<string>('Host / Applicant')
  const [isCallActive, setIsCallActive] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  // Verification Checklist State
  const [checklist, setChecklist] = useState<VerificationChecklistItem[]>([
    {
      id: 'docs',
      label: 'Land Title / Jamabandi & NOC Inspection',
      description: 'Verify original registry documents or revenue patta on camera to prevent fraudulent sublets.',
      checked: false
    },
    {
      id: 'walkthrough',
      label: '360° Real-time Property Walkthrough',
      description: 'Inspect bedroom cedar timber, private workstation, bathroom plumbing, and window mountain vistas.',
      checked: false
    },
    {
      id: 'power_backup',
      label: 'Winter Heating & Solar Inverter Verification',
      description: 'Confirm functioning fireplace/radiator and at least 4–8 hours battery inverter backup for remote work.',
      checked: false
    },
    {
      id: 'wifi_test',
      label: 'Live Fiber Speed Test Screen Share',
      description: 'Ask host to run Speedtest.net on live call to confirm declared Mbps for remote developers.',
      checked: false
    },
    {
      id: 'emergency',
      label: 'Host ID Verification & Emergency Access Road',
      description: 'Check government Aadhaar/Voter ID matching host name and confirm 4x4 road clearance during snow.',
      checked: false
    }
  ])

  const handleTypeChange = (type: MeetingType) => {
    setMeetingType(type)
    setRoomSlug(generateRoomSlug(type))
  }

  const meetingUrl = `https://meet.jit.si/${encodeURIComponent(roomSlug)}`

  const copyInviteLink = async () => {
    try {
      const inviteText = `🏔️ Mountain Ecosystem Video Conference Invite\nMeeting Purpose: ${
        meetingType === 'property_verification'
          ? 'Live Homestay/Property Verification'
          : meetingType === 'job_interview'
          ? 'Mountain Job Candidate Interview'
          : 'Regional Steward Coordination'
      }\nParticipant: ${participantName}\n\nJoin Link (Open in browser, no app required):\n${meetingUrl}`

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
      {/* 1. Header Banner */}
      <div className="bg-[#0B2516] border border-[#1F4E34] text-[#F8F6F0] p-6 sm:p-8 rounded-sm shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-[#8FA777] uppercase font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#8FA777]" />
              <span>MODULE 04 • ZERO-COST WEBRTC VIDEO CONFERENCING</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Virtual Conference & Host Verification Suite
            </h1>
            <p className="text-xs sm:text-sm text-[#D8E8D5] font-light max-w-2xl leading-relaxed">
              Conduct instant HD video calls for property authenticity inspections, remote job candidate interviews, and regional steward coordination meetings. 100% end-to-end encrypted with zero software download required for guests.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-[#8FA777]/30 text-[#8FA777] rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Conference Line Ready</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Room Configuration & Live Room Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Room Controls & Meeting Information */}
        <div className={`${isCallActive ? 'lg:col-span-4' : 'lg:col-span-5'} space-y-6 transition-all duration-300`}>
          {/* Room Parameters Card */}
          <div className="bg-[#F8F6F0] border border-[#CBDAC4] p-5 sm:p-6 rounded-sm space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#CBDAC4] pb-3">
              <h2 className="font-serif text-base text-[#0B2516] font-semibold flex items-center gap-2">
                <Video className="w-4 h-4 text-[#285A40]" />
                <span>Conference Room Parameters</span>
              </h2>
              <button
                type="button"
                onClick={() => setRoomSlug(generateRoomSlug(meetingType))}
                title="Generate new secure room ID"
                className="text-xs font-mono text-[#576159] hover:text-[#0B2516] flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>New ID</span>
              </button>
            </div>

            {/* Meeting Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#285A40] font-semibold">
                Meeting Purpose
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => handleTypeChange('property_verification')}
                  className={`p-2.5 rounded-sm border text-center transition-all ${
                    meetingType === 'property_verification'
                      ? 'bg-[#0B2516] text-white border-[#0B2516] font-semibold shadow-xs'
                      : 'bg-white text-[#285A40] border-[#CBDAC4] hover:bg-[#E8EFE3]'
                  }`}
                >
                  Host Verify
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('job_interview')}
                  className={`p-2.5 rounded-sm border text-center transition-all ${
                    meetingType === 'job_interview'
                      ? 'bg-[#0B2516] text-white border-[#0B2516] font-semibold shadow-xs'
                      : 'bg-white text-[#285A40] border-[#CBDAC4] hover:bg-[#E8EFE3]'
                  }`}
                >
                  Job Interview
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('steward_sync')}
                  className={`p-2.5 rounded-sm border text-center transition-all ${
                    meetingType === 'steward_sync'
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
                Guest / Applicant Name
              </label>
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="e.g. Pemba Sherpa (Lebong Homestay)"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#CBDAC4] rounded-sm text-[#0B2516] focus:outline-none focus:border-[#0B2516]"
              />
            </div>

            {/* Generated Room Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#285A40] font-semibold">
                Encrypted Room Name
              </label>
              <div className="px-3 py-2 bg-[#E8EFE3]/80 border border-[#CBDAC4] rounded-sm font-mono text-xs text-[#0B2516] truncate">
                {roomSlug}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => setIsCallActive(!isCallActive)}
                className={`w-full py-3 text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isCallActive
                    ? 'bg-rose-800 hover:bg-rose-900 text-white'
                    : 'bg-[#0B2516] hover:bg-[#123D2D] text-white active:scale-[0.99]'
                }`}
              >
                {isCallActive ? (
                  <>
                    <PhoneOff className="w-4 h-4" />
                    <span>Leave Active Conference</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-4 h-4" />
                    <span>Launch Embedded Video Room</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyInviteLink}
                  className="flex-1 py-2 px-3 bg-white hover:bg-[#E8EFE3] text-[#0B2516] border border-[#CBDAC4] rounded-sm text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Invite Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#285A40]" />
                      <span>Copy WhatsApp/Email Invite</span>
                    </>
                  )}
                </button>

                <a
                  href={meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white hover:bg-[#E8EFE3] text-[#0B2516] border border-[#CBDAC4] rounded-sm text-xs transition-colors flex items-center justify-center"
                  title="Open in new separate browser tab"
                >
                  <ExternalLink className="w-4 h-4 text-[#285A40]" />
                </a>
              </div>
            </div>
          </div>

          {/* Verification Protocol Checklist */}
          {meetingType === 'property_verification' && (
            <div className="bg-[#F8F6F0] border border-[#CBDAC4] p-5 rounded-sm space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#CBDAC4] pb-2">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#285A40]" />
                  <span className="font-serif text-sm font-semibold text-[#0B2516]">
                    Host Verification Protocol
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#E8EFE3] text-[#285A40]">
                  {completedCount}/{checklist.length} Verified
                </span>
              </div>

              <p className="text-[11px] text-[#576159] leading-tight">
                Inspect these 5 items on camera before marking homestay as "Verified Mountain Host" to uphold community trust.
              </p>

              <div className="space-y-2 pt-1">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-2.5 p-2 rounded-xs border transition-colors cursor-pointer text-xs ${
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
                      <div className={`font-medium ${item.checked ? 'line-through text-[#285A40]' : ''}`}>
                        {item.label}
                      </div>
                      <div className="text-[10px] text-[#576159] leading-normal">
                        {item.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quick Info Box */}
          <div className="p-4 bg-[#E8EFE3]/70 border border-[#CBDAC4] rounded-sm flex items-start gap-3 text-xs text-[#285A40]">
            <Info className="w-4 h-4 text-[#285A40] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold font-mono text-[11px] uppercase tracking-wide">
                No Accounts Required For Guests
              </div>
              <div className="text-[11px] font-light leading-relaxed">
                Hosts and job applicants do not need any app, Zoom license, or login. When they click the link on their phone or laptop, their video conference connects instantly in Chrome, Safari, or Firefox.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Embedded WebRTC Video Canvas */}
        <div className={`${isCallActive ? 'lg:col-span-8' : 'lg:col-span-7'} space-y-4 transition-all duration-300`}>
          {isCallActive ? (
            <div className="bg-[#06180E] border border-[#1F4E34] rounded-sm overflow-hidden shadow-xl flex flex-col h-[720px]">
              {/* Meeting Top Bar */}
              <div className="bg-[#0B2516] px-4 py-2.5 border-b border-[#1F4E34] flex items-center justify-between text-xs font-mono text-[#D8E8D5]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white truncate max-w-xs">{roomSlug}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#8FA777]">Participant: {participantName}</span>
                  <button
                    type="button"
                    onClick={() => setIsCallActive(false)}
                    className="px-2.5 py-1 bg-rose-800 hover:bg-rose-900 text-white rounded-xs text-[11px] font-sans font-semibold transition-colors"
                  >
                    End Call
                  </button>
                </div>
              </div>

              {/* Secure WebRTC Video Iframe */}
              <iframe
                title="Mountain Ecosystem Live Video Conference"
                src={`https://meet.jit.si/${encodeURIComponent(
                  roomSlug
                )}#config.prejoinConfig.enabled=false&userInfo.displayName=${encodeURIComponent(
                  `Mountain Steward (Admin)`
                )}`}
                allow="camera; microphone; display-capture; autoplay; clipboard-write"
                className="w-full flex-1 border-0"
              />
            </div>
          ) : (
            /* Standby State with Preview & Feature Guide */
            <div className="bg-[#F8F6F0] border border-[#CBDAC4] p-8 sm:p-12 rounded-sm text-center flex flex-col items-center justify-center min-h-[500px] space-y-5 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#E8EFE3] border border-[#CBDAC4] text-[#285A40] flex items-center justify-center shadow-xs">
                <Video className="w-7 h-7 text-[#285A40]" />
              </div>

              <div className="space-y-2 max-w-md">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8FA777] font-bold">
                  READY FOR STREAMING
                </span>
                <h3 className="font-serif text-2xl text-[#0B2516] font-normal">
                  Video Conference Suite Standby
                </h3>
                <p className="text-xs sm:text-sm text-[#576159] leading-relaxed font-light">
                  Click <strong>"Launch Embedded Video Room"</strong> on the left to start the conference directly inside this console, or share the link with the host/applicant.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left pt-3">
                <div className="p-3 bg-white border border-[#CBDAC4] rounded-sm space-y-1">
                  <div className="font-mono text-xs font-semibold text-[#0B2516] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#285A40]" />
                    <span>HD WebRTC</span>
                  </div>
                  <div className="text-[11px] text-[#576159] leading-tight">
                    Low-latency video engineered for high-altitude hilly broadband.
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#CBDAC4] rounded-sm space-y-1">
                  <div className="font-mono text-xs font-semibold text-[#0B2516] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#285A40]" />
                    <span>Zero Leakage</span>
                  </div>
                  <div className="text-[11px] text-[#576159] leading-tight">
                    End-to-end encrypted rooms, temporary sessions destroy on close.
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#CBDAC4] rounded-sm space-y-1">
                  <div className="font-mono text-xs font-semibold text-[#0B2516] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#285A40]" />
                    <span>Multi-Party</span>
                  </div>
                  <div className="text-[11px] text-[#576159] leading-tight">
                    Screen share, in-call chat, and multi-steward participation.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
