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
  Leaf
} from 'lucide-react'
import { BRAND_CONFIG } from '../../config/branding'
import type { Destination, Homestay, Job, Dispatch, PriceIndexItem } from '../../types'

interface ChatMessage {
  id: string
  sender: 'steward' | 'user'
  text: string
  timestamp: string
  action?: {
    label: string
    targetId: string
  }
}

interface RidgeConciergeChatbotProps {
  destinations?: Destination[]
  homestays?: Homestay[]
  jobs?: Job[]
  dispatches?: Dispatch[]
  priceIndices?: PriceIndexItem[]
}

export const RidgeConciergeChatbot: FC<RidgeConciergeChatbotProps> = ({
  destinations = [],
  homestays = [],
  jobs = [],
  dispatches = [],
  priceIndices = []
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [showGreetingBubble, setShowGreetingBubble] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const initialGreeting: ChatMessage = {
    id: 'msg-1',
    sender: 'steward',
    text: `Namaste & Tashi Delek! I am Anaya, your ${BRAND_CONFIG.name} AI Concierge. I can help you find mountain properties for lease or outright sale, check verified transit rates, browse and apply for mountain jobs, or guide you through community experiences across Himachal Pradesh, Uttarakhand, Ladakh, Kashmir, Sikkim, Bengal Hills, and the Western Ghats. How may I assist your mountain journey today?`,
    timestamp: 'Just now'
  }

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting])

  // Suggested prompt chips for instant answers
  const suggestionChips = [
    { label: '🏔️ Stays for remote work', query: 'Recommend a quiet homestay for remote work with fast broadband' },
    { label: '💰 Fair shared jeep fares', query: 'What are the fair shared jeep prices from Siliguri to Darjeeling?' },
    { label: '💼 Open mountain jobs', query: 'What mountain jobs and residencies are currently available?' },
    { label: '🌿 Ecological Charter', query: 'What is the Ecological Non-Extraction Charter and porter limit?' },
    { label: '🏛️ Traditional Architecture', query: 'Tell me about the traditional Himalayan architectural materials' }
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

  const handleSend = (textToSend?: string) => {
    const userText = (textToSend || input).trim()
    if (!userText) return

    setHasInteracted(true)
    setShowGreetingBubble(false)

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMessage])
    if (!textToSend) setInput('')
    setIsTyping(true)

    // Generate intelligent response grounded in webpage details
    setTimeout(() => {
      const botResponse = generateKnowledgeResponse(userText)
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 600 + Math.random() * 400)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  const handleReset = () => {
    setMessages([initialGreeting])
  }

  // Knowledge Engine grounded in platform data
  const generateKnowledgeResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase()
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // 1. Homestays & Remote Work / Leases & Sales
    if (q.includes('homestay') || q.includes('stay') || q.includes('property') || q.includes('sale') || q.includes('remote') || q.includes('work') || q.includes('wifi') || q.includes('broadband') || q.includes('rent') || q.includes('sabbatical') || q.includes('lease') || q.includes('buy')) {
      const stayCount = homestays.length || 6
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `We feature ${stayCount} verified mountain properties across India (Himachal Pradesh, Uttarakhand, Ladakh, Kashmir, Sikkim, Bengal Hills, and the Nilgiris) for both long-term residential lease and outright purchase.\n\n• High-speed fiber broadband (100–300 Mbps) with dedicated workstations.\n• Full verified addresses with landmark, village, and elevation.\n• Monthly leases (₹21,000 to ₹42,000/mo) and outright sales with verified land title covenants.\n\nWould you like to browse current listings or add your own property?`,
        timestamp: now,
        action: {
          label: 'View Mountain Properties',
          targetId: 'stays'
        }
      }
    }

    // 2. Transport, Shared Jeeps & Price Index
    if (q.includes('price') || q.includes('fare') || q.includes('jeep') || q.includes('transport') || q.includes('taxi') || q.includes('cost') || q.includes('index') || q.includes('manali') || q.includes('spiti') || q.includes('siliguri') || q.includes('darjeeling')) {
      const livePriceLines = priceIndices.length > 0
        ? priceIndices.slice(0, 3).map(p => `• ${p.item} (${p.routeOrOrigin}): ${p.primaryRate} ${p.rateUnit}`).join('\n')
        : '• Shared 4x4 Bolero (Manali to Kaza/Spiti): ₹1,200 per seat.\n• Shared Sumo (Siliguri to Darjeeling): ₹350 per seat.\n• Shared Jeep (Rishikesh to Chopta): ₹450 per seat.'
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `According to our verified Pan-India Community Ground Price Index:\n\n${livePriceLines}\n• Certified High-Altitude Porter (strictly capped at 20kg): ₹900 – ₹1,200/day.\n• Heirloom Orchard Produce: ₹70 – ₹90/dozen direct farmgate.\n\nAll rates are verified by local driver unions and mountain residents to prevent seasonal overcharging.`,
        timestamp: now,
        action: {
          label: 'Inspect Ground Price Ledger',
          targetId: 'community'
        }
      }
    }

    // 3. Mountain Jobs & Residencies
    if (q.includes('job') || q.includes('work') || q.includes('career') || q.includes('hiring') || q.includes('fellowship') || q.includes('employment') || q.includes('salary') || q.includes('residency') || q.includes('hire')) {
      const jobCount = jobs.length || 6
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `We currently host ${jobCount} ethical Mountain Job vacancies and Residencies across India. Current openings include:\n\n• Riverside Eco-Lodge Lead (Tirthan Valley, Himachal Pradesh)\n• Agro-Forestry & Seed Steward (Mukteshwar, Uttarakhand)\n• Solar Microgrid Operations Lead (Leh, Ladakh)\n• Heritage Tea Estate Manager (Darjeeling, Bengal)\n\nEvery opening guarantees dignified mountain living wages, free lodging, and organic meals. Anyone can also post jobs directly on our exchange!`,
        timestamp: now,
        action: {
          label: 'Explore Mountain Jobs',
          targetId: 'jobs'
        }
      }
    }

    // 4. Destinations, Seasons & Hiking
    if (q.includes('destination') || q.includes('region') || q.includes('season') || q.includes('weather') || q.includes('darjeeling') || q.includes('kalimpong') || q.includes('sikkim') || q.includes('dooars') || q.includes('trek') || q.includes('hike') || q.includes('mountain') || q.includes('kanchenjunga')) {
      const destSummary = destinations.length > 0
        ? destinations.slice(0, 4).map((d, i) => `${i + 1}. ${d.name} (${d.elevation}): ${d.subtitle}`).join('\n')
        : '1. Darjeeling Tea Belt (2,042m): Biodynamic misty tea slopes\n2. Kalimpong Orchid Ridge (1,247m): Subtropical flowers & paper workshops\n3. Sikkim Organic Valleys (1,600m): Sacred cedar groves\n4. Dooars Sal Forest (300m): Dense foothills & riverside tea'
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `The ${BRAND_CONFIG.name} spans four primary botanical sanctuaries:\n\n${destSummary}\n\nBest seasons: Autumn (Oct–Nov) for crisp peak visibility; Spring (Mar–Apr) for blooming rhododendrons.`,
        timestamp: now,
        action: {
          label: 'Explore Destination Atlas',
          targetId: 'destinations'
        }
      }
    }

    // 5. Himalayan Architecture & Materials
    if (q.includes('architecture') || q.includes('specimen') || q.includes('ledger') || q.includes('material') || q.includes('dhajji') || q.includes('stone') || q.includes('slate') || q.includes('bamboo') || q.includes('wood')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `Our Himalayan Architectural & Material Ledger documents indigenous vernacular building crafts:\n\n• Dhajji-Dewari: Earthquake-resilient cedar timber frames with interlocking stone rubble infill.\n• Chorten Slate Masonry: Hand-chiseled metamorphic river stone assembled without cement mortar.\n• Ikra Woven Reeds: Flexible river reeds plastered in clay and lime wash.\n• Bamboo Wattle & Daub: Breathable, renewable thermal walls.\n\nYou can explore our interactive Digital Museum right on this page!`,
        timestamp: now,
        action: {
          label: 'View Architectural Ledger',
          targetId: 'architecture'
        }
      }
    }

    // 6. Ecological Charter, Porter Limits, Rules & Ethics
    if (q.includes('ethic') || q.includes('charter') || q.includes('porter') || q.includes('plastic') || q.includes('rule') || q.includes('nature') || q.includes('green') || q.includes('ecology') || q.includes('pledge')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `The ${BRAND_CONFIG.name} Ecological Non-Extraction Charter requires all guests and partners to honor 4 core tenets:\n\n1. Porter Dignity: Loads are strictly capped at 20kg per porter with mandated high-altitude gear and fair base pay.\n2. Zero Single-Use Plastics: We use mountain filtered glass carafes and reusable ridge hydration stations.\n3. Sacred Space Reverence: Strict quietude in monastic cedar forests and respect for ancestral prayer walls (pass clockwise).\n4. Direct Local Economy: 100% of homestay and guiding fees remain with the indigenous families.`,
        timestamp: now,
        action: {
          label: 'Review FAQs & Charter',
          targetId: 'faqs'
        }
      }
    }

    // 7. Community Dispatches & Posting
    if (q.includes('post') || q.includes('write') || q.includes('dispatch') || q.includes('contribute') || q.includes('story') || q.includes('publish')) {
      const dispatchNote = dispatches.length > 0 ? `We currently have ${dispatches.length} published dispatches in our ledger.` : ''
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `Any verified community fellow or traveller can publish field dispatches to our ledger! ${dispatchNote}\n\nSimply sign in with your email account, click "Submit Ground Dispatch", and share your trail notes, tea harvest updates, or regional price reports. Posts are verified to keep our platform transparent.`,
        timestamp: now,
        action: {
          label: 'Read Community Ledger',
          targetId: 'community'
        }
      }
    }

    // 8. Sign in / Admin / Account
    if (q.includes('login') || q.includes('sign in') || q.includes('admin') || q.includes('account') || q.includes('auth')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'steward',
        text: `We maintain two distinct experiences:\n\n• Public Visitors & Fellows: Sign in with your email using the "Sign In" button in the top navigation to publish field dispatches and track inquiries.\n• Administrative Staff: Staff members authenticate via email/password at /admin/login. Admin accounts are provisioned securely by platform stewards.`,
        timestamp: now,
        action: {
          label: 'Visit Frequently Asked Questions',
          targetId: 'faqs'
        }
      }
    }

    // Default Friendly Steward Response
    return {
      id: `bot-${Date.now()}`,
      sender: 'steward',
      text: `Thank you for asking. The ${BRAND_CONFIG.name} is dedicated to connecting respectful travellers, indigenous host families, and regenerative stewards across ${BRAND_CONFIG.region}.\n\nYou can explore our verified Homestay Marketplace, Mountain Jobs, Architectural Ledger, or Community Price Index. If you have a custom inquiry, write directly to ${BRAND_CONFIG.supportEmail}.`,
      timestamp: now,
      action: {
        label: 'Explore Destinations',
        targetId: 'destinations'
      }
    }
  }

  return (
    <>
      {/* 1. Proactive Greeting Bubble (Pops up gently above button, compact on mobile) */}
      {showGreetingBubble && !isOpen && (
        <div className="fixed bottom-20 right-3 sm:right-6 z-40 max-w-[280px] sm:max-w-xs bg-[#0B2516] text-[#F8F6F0] border border-[#1F4E34] p-3 sm:p-3.5 rounded-xl shadow-2xl animate-fade-in-scale font-sans">
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
            Need advice on mountain properties for lease or sale, fair transit fares, or jobs? Ask me anything!
          </p>
          <button
            onClick={() => {
              setShowGreetingBubble(false)
              setIsOpen(true)
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
            setIsOpen(!isOpen)
            setShowGreetingBubble(false)
            setHasInteracted(true)
          }}
          className={`group flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-full text-xs font-sans font-semibold tracking-wide transition-all duration-300 shadow-2xl active:scale-95 ${
            isOpen
              ? 'bg-[#123D2D] text-white border border-[#8FA777]/50'
              : 'bg-[#0B2516] hover:bg-[#123D2D] text-white border border-[#1F4E34] animate-pulse-glow'
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
          className="fixed bottom-18 sm:bottom-20 right-2 sm:right-6 z-50 w-[95vw] sm:w-[420px] max-h-[82vh] bg-[#0B2516] border border-[#1F4E34] text-[#F8F6F0] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-scale font-sans"
        >
          {/* Header */}
          <div className="bg-[#0B2516] border-b border-[#1F4E34] p-4 flex items-center justify-between">
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
                </div>
                <p className="text-[11px] font-mono text-[#8FA777]/80 truncate">
                  Mountain Companion • {BRAND_CONFIG.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
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
          <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[50vh] sm:max-h-[380px] text-xs">
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

                  <div className={`space-y-1.5 max-w-[85%] ${isSteward ? '' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-sm whitespace-pre-line leading-relaxed ${
                        isSteward
                          ? 'bg-[#123D2D]/80 border border-[#1F4E34] text-[#E8EFE3] text-left'
                          : 'bg-[#FDFBF7] text-[#0B2516] font-medium text-left shadow-md'
                      }`}
                    >
                      <p className="font-light">{msg.text}</p>

                      {/* Interactive Section Action Button */}
                      {msg.action && (
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

                    <div className="text-[10px] font-mono text-white/40 px-1">
                      {msg.timestamp}
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
                  <span className="text-[10px] text-white/50 ml-1">Anaya consulting ledger...</span>
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
              placeholder="Ask Anaya about mountain properties, jobs, community stories..."
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
