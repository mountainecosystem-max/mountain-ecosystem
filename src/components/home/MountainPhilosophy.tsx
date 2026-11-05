import type { FC } from 'react'
import { Flame, Wifi, Utensils, ShieldCheck, HeartHandshake, Trees, ArrowRight } from 'lucide-react'

interface MountainPhilosophyProps {
  onExploreCottages?: () => void
}

export const MountainPhilosophy: FC<MountainPhilosophyProps> = ({ onExploreCottages }) => {
  const handleScrollToStays = () => {
    if (onExploreCottages) {
      onExploreCottages()
    } else {
      const el = document.getElementById('homestays')
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="philosophy" className="py-16 sm:py-24 bg-white border-y border-[#CBDAC4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Imagery Cluster (Awara Layout with Himalayan Visuals) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-100">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85"
                alt="Darjeeling Mountain & Tea Garden Homestay View"
                className="w-full h-[400px] sm:h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2316]/90 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-[#164E2D] text-white text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow">
                  Private Pine Ridge & Tea Terraces
                </span>
                <p className="font-display text-2xl sm:text-3xl font-bold mt-2.5 leading-snug">
                  No Concrete Resorts. Just Pure Nature & Kinship.
                </p>
                <p className="text-xs sm:text-sm text-[#D8E8D5] mt-1 font-mono">
                  Takdah Alpine Valley • 3rd Generation Local Mountain Stewards
                </p>
              </div>
            </div>

            {/* Overlapping Host Warmth Badge */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-[#FAF7EE] text-stone-900 p-4 sm:p-5 rounded-2xl shadow-xl border border-[#CBDAC4] max-w-[270px]">
              <div className="flex items-center gap-2 mb-1.5">
                <HeartHandshake className="w-5 h-5 text-[#D96B27]" />
                <span className="font-display font-bold text-xs uppercase tracking-wider text-[#0A2316]">
                  Himalayan Hospitality
                </span>
              </div>
              <p className="text-[11px] text-stone-700 leading-relaxed font-light">
                Hosted by indigenous Bhutia, Lepcha & Gurung families. Genuine warmth, folklore & fresh garden butter tea.
              </p>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[#164E2D] text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Trees className="w-4 h-4 text-[#164E2D]" />
              <span>THE MOUNTAIN SANCTUARY PHILOSOPHY</span>
            </span>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A2316] uppercase leading-tight">
              YOUR SOUL DESERVES QUIETUDE. NOT HOTEL CROWDS.
            </h2>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-light">
              We built this ecosystem as an antidote to commercial mass-tourism hotels. Tucked away on secluded pine ridges and organic tea slopes between Takdah, Mirik, and Kalimpong, our sanctuaries are cared for by generational mountain families who share their ancestral hearths, organic farm harvests, and sacred ridge trails with respectful travelers and sabbatical creators.
            </p>

            {/* 4 Feature Benefit Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="w-9 h-9 rounded-xl bg-[#0A2316] text-[#A5C896] flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-[#D96B27]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">Real Wood Fireplaces</h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    River-stone hearths and seasoned pine logs in every private cottage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="w-9 h-9 rounded-xl bg-[#0A2316] text-[#A5C896] flex items-center justify-center shrink-0">
                  <Wifi className="w-4 h-4 text-[#34D399]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">Fiber Wi-Fi & Generator</h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Verified 150 Mbps optical fiber for remote creative workations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="w-9 h-9 rounded-xl bg-[#0A2316] text-[#A5C896] flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4 text-[#D96B27]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">Zero Commercial Frozen Food</h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    100% freshly cooked meals with garden greens, organic tea, and mountain herbs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="w-9 h-9 rounded-xl bg-[#0A2316] text-[#A5C896] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">Safe Private Sanctuary</h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Gated tea garden estate with direct pre-paid pick-up from Bagdogra & NJP.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleScrollToStays}
                type="button"
                className="inline-flex items-center gap-2 bg-[#0A2316] hover:bg-[#164E2D] text-[#D8E8D5] hover:text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition shadow-md active:scale-95"
              >
                <span>Choose Your Cottage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
