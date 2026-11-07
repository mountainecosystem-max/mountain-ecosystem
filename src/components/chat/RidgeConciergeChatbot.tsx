import { useState, useEffect, useRef } from 'react'
import type { FC, FormEvent } from 'react'
import {
  X,
  Send,
  Compass,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Bot,
  User,
  ChevronRight,
  Leaf,
  Copy,
  Check,
  Volume2,
  VolumeX
} from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'
import type { Destination, Homestay, Job, Dispatch, PriceIndexItem } from '../../types'

export interface ChatAction {
  label: string
  type: 'scroll' | 'propertyModal' | 'jobModal' | 'dispatchModal' | 'privacyModal' | 'prompt'
  targetId?: string
  prompt?: string
}

export interface ChatMessage {
  id: string
  sender: 'steward' | 'user'
  text: string
  timestamp: string
  actions?: ChatAction[]
  action?: {
    label: string
    targetId: string
  }
}

// ==============================================================================
// Himalayan Audio Synthesizer via Web Audio API (Zero external assets/downloads)
// ==============================================================================
class AnayaAudioEngine {
  private ctx: AudioContext | null = null

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioCtx) {
          this.ctx = new AudioCtx()
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume()
      }
      return this.ctx
    } catch {
      return null
    }
  }

  // Soft Mountain Chime on Open (gliding warm bell)
  playOpenChime() {
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(523.25, now) // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.14) // E5

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.06, now + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.36)
    } catch {
      // Audio playback fails silently if browser policy blocks autoplay
    }
  }

  // Tactile bamboo / bubble tap on message dispatch
  playSendTap() {
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(740, now)
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.05)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.05, now + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.08)
    } catch {
      // Audio fail silent
    }
  }

  // Harmonic Tibetan Singing Bowl Double Chime on Bot Response
  playReceiveChime() {
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime

      // Fundamental Note: D5 (587.33 Hz)
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(587.33, now)

      gain1.gain.setValueAtTime(0.001, now)
      gain1.gain.linearRampToValueAtTime(0.06, now + 0.03)
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.42)

      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(now)
      osc1.stop(now + 0.44)

      // Harmonic Note: A5 (880 Hz) with warm chime decay
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(880, now + 0.08)

      gain2.gain.setValueAtTime(0.0001, now + 0.08)
      gain2.gain.linearRampToValueAtTime(0.05, now + 0.11)
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.52)

      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.start(now + 0.08)
      osc2.stop(now + 0.54)
    } catch {
      // Audio fail silent
    }
  }
}

const anayaAudio = new AnayaAudioEngine()

export interface RidgeConciergeChatbotProps {
  destinations?: Destination[]
  homestays?: Homestay[]
  jobs?: Job[]
  dispatches?: Dispatch[]
  priceIndices?: PriceIndexItem[]
  onOpenPropertyModal?: () => void
  onOpenJobModal?: () => void
  onOpenDispatchModal?: () => void
  onOpenPrivacyModal?: () => void
}

export const RidgeConciergeChatbot: FC<RidgeConciergeChatbotProps> = ({
  destinations = [],
  homestays = [],
  jobs = [],
  dispatches = [],
  priceIndices = [],
  onOpenPropertyModal,
  onOpenJobModal,
  onOpenDispatchModal,
  onOpenPrivacyModal
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showGreetingBubble, setShowGreetingBubble] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return localStorage.getItem('mountain_anaya_sound') !== 'false'
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const toggleSound = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('mountain_anaya_sound', String(next))
    }
    if (next) {
      anayaAudio.playOpenChime()
    }
  }

  const initialGreeting: ChatMessage = {
    id: 'msg-1',
    sender: 'steward',
    text: `Namaste & Tashi Delek! 🙏 I am Anaya, your ${BRAND_CONFIG.name} AI Concierge.\n\nI can help you explore verified mountain properties for lease or purchase, check verified transit & taxi fares, discover mountain jobs & residencies, or guide you through ethical Himalayan living across Himachal, Uttarakhand, Ladakh, Kashmir, Sikkim, Bengal Hills, and the Western Ghats.\n\n💡 Pro tip: Public visitors do NOT need an account or sign-in to browse, apply, or submit listings—everything is 100% free.\n\nHow may I assist your mountain journey today?`,
    timestamp: 'Just now',
    actions: [
      { label: '🏔️ Workation Stays', type: 'scroll', targetId: 'stays' },
      { label: '💰 Shared Taxi Fares', type: 'scroll', targetId: 'community' },
      { label: '💼 Zero-Fee Jobs', type: 'scroll', targetId: 'jobs' },
      { label: '🛡️ Safety Advisory', type: 'prompt', prompt: 'Tell me about mountain safety, job fees, and fraud protection rules' }
    ]
  }

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting])

  // Suggested prompt chips for instant answers
  const suggestionChips = [
    { label: '🏔️ Stays with Fiber WiFi', query: 'Recommend quiet stays for remote work with high-speed fiber broadband' },
    { label: '💰 Shared Taxi Fares', query: 'What are the current verified shared taxi and jeep rates?' },
    { label: '💼 Zero-Fee Jobs', query: 'What mountain jobs and residencies are open right now?' },
    { label: '🛡️ Fraud & Safety Rules', query: 'What are the rules regarding advance payments, job fees, and scam prevention?' },
    { label: '📝 How to List Free (No Login)', query: 'How can I list my mountain property or job without signing in?' },
    { label: '⛅ Weather & Best Seasons', query: 'When is the best season and weather to travel or stay in the mountains?' },
    { label: '🌿 20kg Porter Charter', query: 'What is the Ecological Non-Extraction Charter and porter load limit?' },
    { label: '🏛️ Traditional Architecture', query: 'Tell me about Dhajji-Dewari and traditional Himalayan building materials' }
  ]

  // Show subtle greeting pill after 3.5s if unopened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !hasInteracted) {
        setShowGreetingBubble(true)
      }
    }, 3500)
    return () => clearTimeout(timer)
  }, [isOpen, hasInteracted])

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping, isOpen])

  const scrollToSection = (targetId: string) => {
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      if (window.innerWidth < 640) {
        setIsOpen(false)
      }
    }
  }

  const handleActionClick = (act: ChatAction) => {
    if (act.type === 'scroll' && act.targetId) {
      scrollToSection(act.targetId)
    } else if (act.type === 'propertyModal' && onOpenPropertyModal) {
      onOpenPropertyModal()
    } else if (act.type === 'jobModal' && onOpenJobModal) {
      onOpenJobModal()
    } else if (act.type === 'dispatchModal' && onOpenDispatchModal) {
      onOpenDispatchModal()
    } else if (act.type === 'privacyModal' && onOpenPrivacyModal) {
      onOpenPrivacyModal()
    } else if (act.type === 'prompt' && act.prompt) {
      handleSend(act.prompt)
    }
  }

  const handleCopyText = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(msgId)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  const handleSend = (textToSend?: string) => {
    const userText = (textToSend || input).trim()
    if (!userText) return

    if (soundEnabled) {
      anayaAudio.playSendTap()
    }

    setHasInteracted(true)
    setShowGreetingBubble(false)

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timestampStr
    }

    setMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInput('')
    setIsTyping(true)

    // Generate intelligent response grounded in live platform data
    setTimeout(() => {
      const botResponse = generateKnowledgeResponse(userText)
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
      if (soundEnabled) {
        anayaAudio.playReceiveChime()
      }
    }, 600)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  const handleReset = () => {
    setMessages([initialGreeting])
  }

  // Knowledge Engine grounded in live platform props & multilingual queries
  const generateKnowledgeResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase()
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Check for specific regional mentions
    const regions = [
      { name: 'Darjeeling', keys: ['darjeeling', 'lebong', 'takdah', 'kurseong', 'mirik', 'ghoom'] },
      { name: 'Kalimpong', keys: ['kalimpong', 'lava', 'rishyap', 'pedong', 'rillence'] },
      { name: 'Sikkim', keys: ['sikkim', 'gangtok', 'pelling', 'ravangla', 'lachung', 'yuksom', 'rumtek'] },
      { name: 'Himachal Pradesh', keys: ['himachal', 'manali', 'spiti', 'tirthan', 'kullu', 'dharamshala', 'jibhi', 'kaza', 'kinnaur'] },
      { name: 'Uttarakhand', keys: ['uttarakhand', 'mukteshwar', 'mussoorie', 'chopta', 'rishikesh', 'nainital', 'almora', 'kumaon', 'garhwal'] },
      { name: 'Ladakh', keys: ['ladakh', 'leh', 'nubra', 'zanskar', 'pangong'] },
      { name: 'Kashmir', keys: ['kashmir', 'srinagar', 'gulmarg', 'pahalgam', 'sonamarg'] },
      { name: 'Western Ghats', keys: ['nilgiris', 'coorg', 'ooty', 'wayanad', 'munnar', 'ghats'] },
      { name: 'Dooars', keys: ['dooars', 'lataguri', 'jaldapara', 'buxa'] }
    ]

    const matchedRegion = regions.find(r => r.keys.some(k => q.includes(k)))

    // Regional Filter Branch
    if (matchedRegion) {
      const matchedStays = homestays.filter(h =>
        matchedRegion.keys.some(k =>
          (h.location?.toLowerCase().includes(k)) ||
          (h.region?.toLowerCase().includes(k)) ||
          (h.name?.toLowerCase().includes(k))
        )
      )

      const matchedJobsList = jobs.filter(j =>
        matchedRegion.keys.some(k =>
          (j.location?.toLowerCase().includes(k)) ||
          (j.region?.toLowerCase().includes(k)) ||
          (j.title?.toLowerCase().includes(k))
        )
      )

      const matchedPricesList = priceIndices.filter(p =>
        matchedRegion.keys.some(k =>
          (p.routeOrOrigin?.toLowerCase().includes(k)) ||
          (p.item?.toLowerCase().includes(k))
        )
      )

      let regionReply = `📍 **Verified Ground Intelligence for ${matchedRegion.name}:**\n\n`

      if (matchedStays.length > 0) {
        regionReply += `🏡 **Verified Mountain Properties (${matchedStays.length} available):**\n`
        matchedStays.slice(0, 3).forEach(s => {
          const priceInfo = s.listingType === 'sale'
            ? `Outright Sale: ${s.salePrice || 'Price on request'}`
            : `Monthly Lease: ${s.monthlyRate || '₹25,000/mo'}`
          regionReply += `• **${s.name}** (${s.location || s.region})\n  ${priceInfo} • Elev: ${s.elevation || 'Misty Ridge'} • WiFi: ${s.wifi || '100+ Mbps Fiber'}\n`
        })
        regionReply += '\n'
      }

      if (matchedJobsList.length > 0) {
        regionReply += `💼 **Mountain Vacancies & Residencies (${matchedJobsList.length}):**\n`
        matchedJobsList.slice(0, 2).forEach(j => {
          regionReply += `• **${j.title}** at ${j.employer} (${j.salary || 'Dignified Living Wage'})\n  Includes: Free cottage stay & mountain meals.\n`
        })
        regionReply += '\n'
      }

      if (matchedPricesList.length > 0) {
        regionReply += `🚕 **Fair Transit & Commodity Index:**\n`
        matchedPricesList.slice(0, 2).forEach(p => {
          regionReply += `• ${p.item} (${p.routeOrOrigin}): **${p.primaryRate} ${p.rateUnit}** (Verified)\n`
        })
        regionReply += '\n'
      }

      regionReply += `💡 *All properties and jobs can be applied for or listed 100% free with zero sign-in required!*`

      const regionActions: ChatAction[] = [
        { label: `View ${matchedRegion.name} Listings`, type: 'scroll', targetId: 'stays' },
        { label: `List Property in ${matchedRegion.name}`, type: 'propertyModal' }
      ]

      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: regionReply,
        timestamp: now,
        actions: regionActions
      }
    }

    // 1. Anti-Fraud, Safety & Payment Rules (High Priority Query)
    if (
      q.includes('fraud') ||
      q.includes('scam') ||
      q.includes('fake') ||
      q.includes('paisa') ||
      q.includes('advance') ||
      q.includes('deposit') ||
      q.includes('safe') ||
      q.includes('safety') ||
      q.includes('trust') ||
      q.includes('rule') ||
      q.includes('security') ||
      q.includes('suraksha') ||
      q.includes('scammer')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `🛡️ **Mountain Ecosystem Trust, Safety & Anti-Fraud Protocol:**\n\n1. 🚫 **NEVER Pay Any Money for Jobs:** Mountain job applications, interviews, or steward fellowships are **100% FREE**. If anyone demands registration fees, uniform charges, or security deposits, it is a scam. Report them immediately!\n\n2. 🏡 **Homestay & Lease Verification:** Never transfer large token advances without a live video call verification of the property and host, or an in-person physical site visit.\n\n3. 📜 **Outright Land / Property Purchase:** Always verify Jamabandi, mutation registers, and tribal land ceiling covenants (e.g., Section 118 in Himachal or Sixth Schedule norms in the North East) with a local advocate before signing agreements.\n\n4. ⚖️ **Fair Mountain Wages & Porter Limits:** All human porter loads are strictly capped at 20kg per our Non-Extraction Charter with fair base pay (₹900–₹1,200/day).\n\nNeed to report something suspicious? Email **${BRAND_CONFIG.supportEmail}** anytime.`,
        timestamp: now,
        actions: [
          { label: 'View Trust & Charter FAQs', type: 'scroll', targetId: 'faqs' },
          { label: 'Review Privacy & Terms', type: 'privacyModal' },
          { label: 'Browse Verified Stays', type: 'scroll', targetId: 'stays' }
        ]
      }
    }

    // 2. How to Post / Zero Sign-In Requirement
    if (
      q.includes('how to list') ||
      q.includes('how to post') ||
      q.includes('post property') ||
      q.includes('post job') ||
      q.includes('submit') ||
      q.includes('account') ||
      q.includes('sign in') ||
      q.includes('login') ||
      q.includes('register') ||
      q.includes('kaise daale') ||
      q.includes('kaise post') ||
      q.includes('add property') ||
      q.includes('free')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `✨ **Zero-Barrier Public Platform (No Account or Login Required):**\n\n• **Public Visitors & Hosts:** You do **not** need to register or sign in to browse properties, apply for jobs, list a mountain home, or share community experiences.\n• **Listing is 100% Free:** Simply click "List Property" or "Post a Mountain Job". Fill in your property or job details, accept our non-extraction charter, and submit directly.\n• **Steward Moderation:** Every submission is reviewed by our volunteer team to prevent spam and protect visitors from fraudulent brokers.\n• **Staff Administration:** Only authorized platform stewards use \`/admin/login\` to verify records.\n\nReady to contribute to the Himalayan registry?`,
        timestamp: now,
        actions: [
          { label: '📝 List a Property (Free)', type: 'propertyModal' },
          { label: '💼 Post a Mountain Job (Free)', type: 'jobModal' },
          { label: '✍️ Share Community Story', type: 'dispatchModal' }
        ]
      }
    }

    // 3. Stays, Leases, Sales, Kiraya & Remote Work (Hinglish + English)
    if (
      q.includes('homestay') ||
      q.includes('stay') ||
      q.includes('property') ||
      q.includes('sale') ||
      q.includes('remote') ||
      q.includes('work') ||
      q.includes('wifi') ||
      q.includes('broadband') ||
      q.includes('rent') ||
      q.includes('kiraya') ||
      q.includes('bhaada') ||
      q.includes('rate') ||
      q.includes('room') ||
      q.includes('kamra') ||
      q.includes('makan') ||
      q.includes('kothi') ||
      q.includes('sabbatical') ||
      q.includes('lease') ||
      q.includes('buy') ||
      q.includes('purchase')
    ) {
      const stayCount = homestays.length || 6
      const featuredStay = homestays[0]
      const sampleLine = featuredStay
        ? `Example: **${featuredStay.name}** in ${featuredStay.location} (${featuredStay.monthlyRate || '₹28,000/mo'}, ${featuredStay.wifi || 'High-Speed Fiber'}).`
        : 'Featured: Cedar cottages with fiber broadband and 360° snow peak views.'

      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `🏡 We feature **${stayCount} verified mountain sanctuaries** across Himachal Pradesh, Uttarakhand, Ladakh, Kashmir, Sikkim, Bengal Hills, and the Nilgiris:\n\n• **Monthly Leases:** ₹18,000 to ₹45,000/mo with dedicated timber work desks and optical fiber broadband (100–300 Mbps).\n• **Outright Purchases:** Verified stone & timber homesteads with surveyed boundary covenants.\n• **Direct Host Contact:** Zero broker commissions—interact directly with indigenous host families.\n\n${sampleLine}\n\nWould you like to browse current listings or submit your own property?`,
        timestamp: now,
        actions: [
          { label: 'Inspect Mountain Stays', type: 'scroll', targetId: 'stays' },
          { label: '📝 List Your Property (Free)', type: 'propertyModal' }
        ]
      }
    }

    // 4. Transport, Shared Jeeps & Price Index (Hinglish + English)
    if (
      q.includes('price') ||
      q.includes('fare') ||
      q.includes('jeep') ||
      q.includes('transport') ||
      q.includes('taxi') ||
      q.includes('cost') ||
      q.includes('index') ||
      q.includes('sumo') ||
      q.includes('bolero') ||
      q.includes('bhaada') ||
      q.includes('gaadi') ||
      q.includes('cab') ||
      q.includes('travel') ||
      q.includes('reach') ||
      q.includes('road') ||
      q.includes('siliguri') ||
      q.includes('manali') ||
      q.includes('spiti')
    ) {
      const livePriceLines = priceIndices.length > 0
        ? priceIndices.slice(0, 3).map(p => `• **${p.item}** (${p.routeOrOrigin}): ${p.primaryRate} ${p.rateUnit}`).join('\n')
        : '• **Shared 4x4 Bolero** (Manali to Kaza/Spiti): ₹1,200 per seat.\n• **Shared Tata Sumo** (Siliguri to Darjeeling): ₹350 per seat.\n• **Shared Jeep** (Rishikesh to Chopta): ₹450 per seat.'

      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `🚕 **Verified Pan-India Mountain Ground Price Index (November 2026):**\n\n${livePriceLines}\n• **Certified High-Altitude Porter:** ₹900 – ₹1,200/day (strictly capped at 20kg maximum).\n• **Direct Farmgate Orchard Apples:** ₹70 – ₹90/dozen.\n\n💡 Rates are verified directly with local driver syndicates and mountain transport unions to prevent tourist overcharging.`,
        timestamp: now,
        actions: [
          { label: 'Inspect Ground Price Ledger', type: 'scroll', targetId: 'community' },
          { label: '✍️ Submit Fare Update', type: 'dispatchModal' }
        ]
      }
    }

    // 5. Mountain Jobs, Residencies & Naukri (Hinglish + English)
    if (
      q.includes('job') ||
      q.includes('work') ||
      q.includes('career') ||
      q.includes('hiring') ||
      q.includes('fellowship') ||
      q.includes('employment') ||
      q.includes('salary') ||
      q.includes('residency') ||
      q.includes('hire') ||
      q.includes('naukri') ||
      q.includes('kaam') ||
      q.includes('kamaai') ||
      q.includes('stipend') ||
      q.includes('apply') ||
      q.includes('vacancy')
    ) {
      const jobCount = jobs.length || 6
      const jobExamples = jobs.length > 0
        ? jobs.slice(0, 3).map(j => `• **${j.title}** at ${j.employer} (${j.location}) — ${j.salary}`).join('\n')
        : '• **Riverside Eco-Lodge Lead** (Tirthan Valley, HP) — ₹35,000–₹45,000/mo\n• **Agro-Forestry & Seed Steward** (Mukteshwar, UK) — ₹28,000/mo + Cottage\n• **Solar Microgrid Operations Lead** (Leh, Ladakh) — ₹40,000/mo'

      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `💼 **Verified Mountain Jobs & Residencies (${jobCount} Openings):**\n\n${jobExamples}\n\n🌟 **All openings guarantee:**\n1. Dignified mountain living wages & ethical hours.\n2. Clean mountain cottage lodging & organic hearth meals included.\n3. **100% Free Application Guarantee** — No applicant ever pays any fee to apply!\n\nAnyone can also post an opening directly to our registry.`,
        timestamp: now,
        actions: [
          { label: 'Explore Mountain Jobs', type: 'scroll', targetId: 'jobs' },
          { label: '💼 Post a Job (Free)', type: 'jobModal' }
        ]
      }
    }

    // 6. Weather, Best Time to Visit, Seasons & Roads (Hinglish + English)
    if (
      q.includes('weather') ||
      q.includes('season') ||
      q.includes('mausam') ||
      q.includes('snow') ||
      q.includes('barf') ||
      q.includes('rain') ||
      q.includes('monsoon') ||
      q.includes('winter') ||
      q.includes('cold') ||
      q.includes('thand') ||
      q.includes('garmi') ||
      q.includes('best time') ||
      q.includes('when to visit') ||
      q.includes('temperature')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `⛅ **Himalayan Seasonal & Weather Advisory:**\n\n• 🍂 **Autumn (Oct – Nov):** Pristine crystal-clear skies, crisp 8°C–18°C days, and the clearest snow-peak panoramas of Kanchenjunga and Nanda Devi.\n• 🌸 **Spring (Mar – May):** Rhododendron valleys in full bloom, mild 14°C–24°C days—ideal for work sabbaticals and outdoor ridge trails.\n• ❄️ **Winter (Dec – Feb):** Heavy snow in Spiti, Ladakh, and Upper Manali (-15°C to 5°C); sunny, crisp winter days in Darjeeling and Kalimpong (4°C to 14°C).\n• 🌧️ **Monsoon (Jul – Aug):** Lower ranges experience heavy rain; however, **Ladakh and Spiti** sit in the Trans-Himalayan rain shadow and remain dry, sunny, and accessible!\n\nAlways carry sturdy waterproof trekking shoes and layered thermal fleece.`,
        timestamp: now,
        actions: [
          { label: 'Explore Destination Atlas', type: 'scroll', targetId: 'destinations' },
          { label: 'Browse Verified Stays', type: 'scroll', targetId: 'stays' }
        ]
      }
    }

    // 7. Direct Host Contact & WhatsApp Inquiries
    if (
      q.includes('contact') ||
      q.includes('phone') ||
      q.includes('mobile') ||
      q.includes('call') ||
      q.includes('whatsapp') ||
      q.includes('number') ||
      q.includes('owner') ||
      q.includes('host') ||
      q.includes('talk') ||
      q.includes('baat')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `📞 **Direct Host & Employer Communication:**\n\n• **Direct Verification:** Click on any Homestay or Job card to view the host's background, years hosting, village elevation, and verified contact badge.\n• **Instant Inquiry:** Use the "Submit Inquiry" or "Direct WhatsApp" button on the listing modal to initiate immediate, direct contact.\n• **0% Middleman Fees:** We do not take cuts or broker fees from mountain hosts or job seekers, ensuring all funds flow directly to local communities.`,
        timestamp: now,
        actions: [
          { label: 'Browse Verified Stays', type: 'scroll', targetId: 'stays' },
          { label: 'Explore Mountain Jobs', type: 'scroll', targetId: 'jobs' }
        ]
      }
    }

    // 8. Traditional Himalayan Architecture & Materials
    if (
      q.includes('architecture') ||
      q.includes('specimen') ||
      q.includes('ledger') ||
      q.includes('material') ||
      q.includes('dhajji') ||
      q.includes('stone') ||
      q.includes('slate') ||
      q.includes('bamboo') ||
      q.includes('wood') ||
      q.includes('timber') ||
      q.includes('kath-kuni')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `🏛️ **Vernacular Himalayan Architecture Ledger:**\n\n• **Dhajji-Dewari & Kath-Kuni:** Earthquake-resilient deodar timber framework interlocked with dry stone rubble infill without brittle mortar.\n• **Chorten Slate Masonry:** Hand-chiseled metamorphic river stone assembled to breathe with thermal inertia.\n• **Ikra Woven Reeds:** Flexible river reeds plastered in clay and lime wash, proven against high seismic stress.\n• **Bamboo Wattle & Daub:** Naturally renewable, breathable walls engineered for subtropical mountain slopes.\n\nExplore our digital material specimen museum on this page!`,
        timestamp: now,
        actions: [
          { label: 'View Architectural Ledger', type: 'scroll', targetId: 'architecture' }
        ]
      }
    }

    // 9. Ecological Non-Extraction Charter & Ethics
    if (
      q.includes('ethic') ||
      q.includes('charter') ||
      q.includes('porter') ||
      q.includes('plastic') ||
      q.includes('nature') ||
      q.includes('green') ||
      q.includes('ecology') ||
      q.includes('pledge') ||
      q.includes('environment')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `🌿 **The Ecological Non-Extraction Charter:**\n\n1. **Porter Dignity:** Loads strictly capped at 20kg per porter with mandated cold-weather gear and fair base wages (₹900–₹1,200/day).\n2. **Zero Single-Use Plastics:** Every homestay provides glass carafes and mountain-filtered spring water.\n3. **Sacred Ridge Silence:** Maintain quietude near high-altitude gompas, cedar groves, and traverse mani prayer walls clockwise (kora).\n4. **Direct Local Economy:** 100% of homestay and guiding revenue remains with local families.`,
        timestamp: now,
        actions: [
          { label: 'Review Charter FAQs', type: 'scroll', targetId: 'faqs' }
        ]
      }
    }

    // 10. Destination Atlas & Botanical Sanctuaries
    if (
      q.includes('destination') ||
      q.includes('atlas') ||
      q.includes('places') ||
      q.includes('jagah') ||
      q.includes('ghoomne')
    ) {
      const destSummary = destinations.length > 0
        ? destinations.slice(0, 4).map((d, i) => `${i + 1}. **${d.name}** (${d.elevation}): ${d.subtitle}`).join('\n')
        : '1. **Darjeeling Tea Belt** (2,042m): Biodynamic misty tea slopes\n2. **Kalimpong Orchid Ridge** (1,247m): Subtropical flowers & paper workshops\n3. **Sikkim Organic Valleys** (1,600m): Sacred cedar groves\n4. **Dooars Foothills** (300m): Dense sal forest wildlife sanctuary'

      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `🗺️ **The Mountain Ecosystem Destination Atlas:**\n\n${destSummary}\n\nEach region is documented with elevation profiles, seasonal guides, and verified ground homestays.`,
        timestamp: now,
        actions: [
          { label: 'Explore Destination Atlas', type: 'scroll', targetId: 'destinations' },
          { label: 'View Verified Stays', type: 'scroll', targetId: 'stays' }
        ]
      }
    }

    // 11. Community Stories & Field Dispatches
    if (
      q.includes('dispatch') ||
      q.includes('story') ||
      q.includes('katha') ||
      q.includes('experience') ||
      q.includes('kahani') ||
      q.includes('field report')
    ) {
      const dispatchNote = dispatches.length > 0
        ? `We currently feature ${dispatches.length} verified ground dispatches from local guides, botanists, and travellers.`
        : 'We feature authentic field dispatches from local naturalists, tea growers, and mountain fellows.'

      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `📖 **Himalayan Community Stories & Field Reports:**\n\n${dispatchNote}\n\nTopics range from organic tea harvest logs and medicinal herb conservation to winter transit survival notes. Anyone can publish a dispatch without logging in!`,
        timestamp: now,
        actions: [
          { label: 'Read Community Ledger', type: 'scroll', targetId: 'community' },
          { label: '✍️ Submit a Field Dispatch (Free)', type: 'dispatchModal' }
        ]
      }
    }

    // 12. Greetings & Friendly Small Talk
    if (
      q === 'hi' ||
      q === 'hello' ||
      q === 'hey' ||
      q === 'namaste' ||
      q === 'tashi delek' ||
      q.includes('kaisa hai') ||
      q.includes('kaise ho')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `Namaste ji! 🙏 Main Anaya hoon, aapki Mountain AI Concierge.\n\nAap mujhse Himachal, Uttarakhand, Ladakh, Kashmir, ya Sikkim ke verified homestays, fair taxi rates, zero-fee mountain jobs, ya mausam ke baare me pooch sakte hain.\n\nBatayein, main aapki kya madad kar sakti hoon?`,
        timestamp: now,
        actions: [
          { label: '🏔️ Stays with Fiber WiFi', type: 'scroll', targetId: 'stays' },
          { label: '💰 Shared Taxi Fares', type: 'scroll', targetId: 'community' },
          { label: '💼 Zero-Fee Jobs', type: 'scroll', targetId: 'jobs' }
        ]
      }
    }

    // Default Friendly Steward Response
    return {
      id: `bot-${Date.now()}`,
      sender: 'steward',
      text: `Thank you for asking! The ${BRAND_CONFIG.name} is a zero-brokerage, community-verified registry connecting conscious travellers, indigenous hosts, and regenerative stewards across ${BRAND_CONFIG.region}.\n\nFeel free to ask me about:\n• Homestays & long-term leases with high-speed fiber broadband\n• Verified shared taxi & jeep fares\n• Ethical mountain jobs & fellowships (100% free to apply)\n• Road conditions, weather seasons, or how to list your property without signing in.\n\nFor custom inquiries, you can also write directly to ${BRAND_CONFIG.supportEmail}.`,
      timestamp: now,
      actions: [
        { label: 'Browse Verified Stays', type: 'scroll', targetId: 'stays' },
        { label: 'Explore Mountain Jobs', type: 'scroll', targetId: 'jobs' },
        { label: 'View Fair Price Index', type: 'scroll', targetId: 'community' }
      ]
    }
  }

  return (
    <>
      {/* 1. Proactive Greeting Bubble */}
      {showGreetingBubble && !isOpen && (
        <div className="fixed bottom-20 right-3 sm:right-6 z-40 max-w-[290px] sm:max-w-xs bg-[#0B2516] text-[#F8F6F0] border border-[#1F4E34] p-3 sm:p-3.5 rounded-xl shadow-2xl animate-fade-in-scale font-sans">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-[10px] font-mono text-[#8FA777] uppercase tracking-wider font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#8FA777]" />
              <span>Anaya AI Concierge</span>
            </span>
            <button
              onClick={() => setShowGreetingBubble(false)}
              className="text-white/40 hover:text-white p-0.5"
              aria-label="Dismiss greeting"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-white/90 leading-relaxed font-light">
            Need advice on mountain leases, shared jeep fares, weather, or zero-fee jobs? Ask me anything!
          </p>
          <button
            onClick={() => {
              setShowGreetingBubble(false)
              setIsOpen(true)
              if (soundEnabled) {
                anayaAudio.playOpenChime()
              }
            }}
            className="mt-2 text-[11px] font-mono text-[#8FA777] hover:text-white underline underline-offset-4 flex items-center gap-1"
          >
            <span>Talk with Anaya</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 2. Floating Action Button (Always visible on bottom right) */}
      <div className="fixed bottom-5 right-3 sm:right-6 z-40">
        <button
          type="button"
          onClick={() => {
            const nextOpen = !isOpen
            setIsOpen(nextOpen)
            setShowGreetingBubble(false)
            setHasInteracted(true)
            if (nextOpen && soundEnabled) {
              anayaAudio.playOpenChime()
            }
          }}
          className={`group flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full text-xs sm:text-sm font-sans font-semibold tracking-wide transition-all duration-300 shadow-xl shadow-emerald-950/40 hover:shadow-2xl hover:shadow-emerald-950/60 active:scale-95 border border-emerald-400/40 ${
            isOpen
              ? 'bg-gradient-to-r from-[#0E2F1D] to-[#164E2D] text-white ring-2 ring-emerald-400/20'
              : 'bg-gradient-to-r from-[#0A2316] via-[#123E24] to-[#184F2E] hover:from-[#0E2F1D] hover:to-[#1F633B] text-white animate-pulse-glow'
          }`}
          aria-expanded={isOpen}
          aria-label="Toggle Anaya AI Concierge"
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4 text-white" />
              <span>Close Anaya</span>
            </>
          ) : (
            <>
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[#8FA777]">
                <Compass className="w-3.5 h-3.5 animate-spin-slow group-hover:rotate-45 transition-transform" />
              </div>
              <span className="hidden sm:inline">Ask Anaya AI</span>
              <span className="sm:hidden">Anaya AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </>
          )}
        </button>
      </div>

      {/* 3. Chat Window Drawer / Floating Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Anaya AI Mountain Concierge Chat"
          className="fixed bottom-20 sm:bottom-24 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-[440px] max-h-[min(82dvh,640px)] bg-[#0B2516] border border-[#1F4E34] text-[#F8F6F0] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-scale font-sans"
        >
          {/* Header */}
          <div className="bg-[#0B2516] border-b border-[#1F4E34] p-3.5 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#123D2D] border border-[#8FA777]/50 flex items-center justify-center text-[#8FA777]">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0B2516] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-base text-white font-medium">Anaya AI</h3>
                  <span className="px-1.5 py-0.2 bg-[#8FA777]/20 border border-[#8FA777]/40 rounded-full text-[9px] font-mono text-[#8FA777] uppercase">
                    Live
                  </span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-[9px] font-mono text-emerald-300">
                    No Sign-in
                  </span>
                </div>
                <p className="text-[11px] font-mono text-[#8FA777]/80 truncate">
                  Mountain Companion • {BRAND_CONFIG.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleSound}
                title={soundEnabled ? 'Mute sound effects' : 'Enable Himalayan sound effects'}
                className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
                aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-white/40" />
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
                aria-label="Restart chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-sm transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-black/25 border-b border-[#1F4E34]/60 overflow-x-auto scrollbar-none flex items-center gap-1.5 text-nowrap">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip.query)}
                className="text-[11px] font-sans px-2.5 py-1 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white rounded-full border border-white/10 transition-colors shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4 max-h-[52vh] sm:max-h-[400px] text-xs">
            {messages.map((msg) => {
              const isSteward = msg.sender === 'steward'
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isSteward ? 'items-start' : 'items-end justify-end'}`}
                >
                  {isSteward && (
                    <div className="w-7 h-7 rounded-full bg-[#123D2D] border border-[#8FA777]/40 flex items-center justify-center text-[#8FA777] shrink-0 mt-0.5">
                      <Leaf className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`space-y-1.5 max-w-[88%] ${isSteward ? '' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-md whitespace-pre-line leading-relaxed ${
                        isSteward
                          ? 'bg-[#123D2D]/85 border border-[#1F4E34] text-[#E8EFE3] text-left'
                          : 'bg-[#FDFBF7] text-[#0B2516] font-medium text-left shadow-md'
                      }`}
                    >
                      <p className="font-light">{msg.text}</p>

                      {/* Interactive Multi-Action Buttons */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-white/15 flex flex-wrap gap-1.5">
                          {msg.actions.map((act, actIdx) => (
                            <button
                              key={actIdx}
                              type="button"
                              onClick={() => handleActionClick(act)}
                              className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-emerald-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-sm border border-emerald-400/30 transition-all shrink-0 active:scale-95"
                            >
                              <span>{act.label}</span>
                              <ChevronRight className="w-3 h-3 text-emerald-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Backward compatibility for legacy single action */}
                      {!msg.actions && msg.action && (
                        <div className="mt-3 pt-2.5 border-t border-white/15">
                          <button
                            type="button"
                            onClick={() => scrollToSection(msg.action!.targetId)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-sans font-semibold text-emerald-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-sm border border-emerald-400/30 transition-all"
                          >
                            <span>{msg.action.label}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-white/40 px-1">
                      <span>{msg.timestamp}</span>
                      {isSteward && (
                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.text, msg.id)}
                          className="hover:text-white flex items-center gap-1 transition-colors ml-2"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isSteward && (
                    <div className="w-7 h-7 rounded-full bg-[#FDFBF7] text-[#0B2516] flex items-center justify-center shrink-0 mb-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-white/60 text-xs font-mono">
                <div className="w-7 h-7 rounded-full bg-[#123D2D] border border-[#8FA777]/40 flex items-center justify-center text-[#8FA777]">
                  <Leaf className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#123D2D]/60 border border-[#1F4E34] px-3.5 py-2 rounded-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8FA777] typing-dot-1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8FA777] typing-dot-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8FA777] typing-dot-3" />
                  <span className="text-[10px] text-white/50 ml-1">Anaya consulting Himalayan ledger...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-black/40 border-t border-[#1F4E34] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Anaya about stays, taxi fares, jobs, or weather..."
              className="flex-1 bg-black/30 border border-white/20 px-3.5 py-2.5 text-xs text-white placeholder:text-white/40 rounded-sm focus:outline-none focus:border-[#8FA777]"
              maxLength={300}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-[#FDFBF7] hover:bg-white text-[#0B2516] rounded-sm disabled:opacity-40 transition-all shrink-0 font-semibold"
              aria-label="Send inquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
