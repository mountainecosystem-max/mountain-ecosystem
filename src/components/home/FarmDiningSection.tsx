import type { FC } from 'react'
import { Sprout, Flame, CheckCircle2, Coffee } from 'lucide-react'

export const FarmDiningSection: FC = () => {
  return (
    <section id="dining" className="py-16 sm:py-24 bg-[#071F13] text-white relative overflow-hidden border-y border-[#143D24]">
      {/* Background Decorative Gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 80% 50%, rgba(217, 107, 39, 0.15) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="bg-[#123D26] text-[#A5C896] border border-[#1F4E34] text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#D96B27]" />
              <span>TRADITIONAL WOOD-FIRED HEARTH</span>
            </span>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase leading-tight text-white">
              ORGANIC MOUNTAIN FEASTS COOKED SLOWLY OVER CEDAR WOOD
            </h2>

            <p className="text-[#D8E8D5] text-sm sm:text-base leading-relaxed font-light">
              No commercial frozen foods, no artificial bouillon. Everything placed on your wooden table is pulled fresh from terraced black-soil gardens or harvested from local cooperative dairy smallholders across the tea ridge.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 bg-[#0A2617] p-4 rounded-2xl border border-[#1B4D31]">
                <div className="w-8 h-8 rounded-lg bg-[#05170D] flex items-center justify-center shrink-0">
                  <Sprout className="w-4 h-4 text-[#34D399]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Daily Sunrise Harvest</h4>
                  <p className="text-xs text-[#D8E8D5]/80 mt-0.5 leading-relaxed font-light">
                    Wild mustard greens (rayo saag), bamboo shoots (tama), and mountain fiddlehead ferns (ningro).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-[#0A2617] p-4 rounded-2xl border border-[#1B4D31]">
                <div className="w-8 h-8 rounded-lg bg-[#05170D] flex items-center justify-center shrink-0">
                  <Coffee className="w-4 h-4 text-[#A5C896]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Single-Estate Tea Pairings</h4>
                  <p className="text-xs text-[#D8E8D5]/80 mt-0.5 leading-relaxed font-light">
                    Fresh whole-leaf Darjeeling first flush, roasted Tibetan suja (butter tea), and herbal lemongrass infusions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-[#0A2617] p-4 rounded-2xl border border-[#1B4D31]">
                <div className="w-8 h-8 rounded-lg bg-[#05170D] flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-[#D96B27]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Earthen Pot Hearth Slow-Cooking</h4>
                  <p className="text-xs text-[#D8E8D5]/80 mt-0.5 leading-relaxed font-light">
                    Black Himalayan dal simmered for 6 hours with local ghee, freshly hand-steamed buckwheat momos, and roasted red dhotis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Imagery Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#1B4D31]">
              <img
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80"
                alt="Darjeeling Mountain Tea Harvest & Fresh Farm Cuisine"
                className="w-full h-[420px] sm:h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05170D]/90 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-[#05170D]/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#1F4E34] text-white">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#A5C896] font-bold uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
                    <span>Included With Every Cottage Reservation</span>
                  </div>
                  <p className="font-display text-xl sm:text-2xl font-bold">
                    Complimentary Farm-to-Table Breakfast & Estate High-Tea
                  </p>
                  <p className="text-xs text-[#D8E8D5]/80 mt-1 font-light">
                    Fresh eggs, pasture butter, handmade bread, and endless pots of single-estate Darjeeling tea served on the morning sun-deck.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
