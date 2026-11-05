import { useState } from 'react'
import type { FC } from 'react'
import { Copy, Check, Sparkles } from 'lucide-react'

interface PromoItem {
  code: string
  title: string
  benefit: string
  validity: string
  description: string
}

const PROMOS: PromoItem[] = [
  {
    code: 'TEAFLUSH20',
    title: 'First-Flush Spring Harvest Escape',
    benefit: '20% OFF 3+ Nights',
    validity: 'Valid March – May',
    description: 'Includes a private guided tea plucking masterclass & complimentary estate tasting basket.'
  },
  {
    code: 'WORKATION30',
    title: 'Remote Creator Sabbatical Lease',
    benefit: '30% OFF Monthly Stay',
    validity: 'Valid Year-Round',
    description: 'Dedicated 150 Mbps optical fiber, ergonomic timber desk, power backup, and weekly linen service.'
  },
  {
    code: 'HEARTHMAGIC',
    title: 'Pine Ridge Bonfire & Dinner',
    benefit: 'Complimentary Feast',
    validity: 'Weekdays (Mon–Thu)',
    description: 'Complimentary outdoor pine log bonfire with hot spiced Himalayan tea and traditional dinner.'
  }
]

export const PromosOffersSection: FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode(null)
    }, 2500)
  }

  return (
    <section id="promos" className="py-16 sm:py-20 bg-[#FAF7EE] border-b border-[#CBDAC4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[#164E2D] text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-[#D96B27]" />
              <span>DIRECT BOOKING PRIVILEGES</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0A2316] uppercase leading-tight">
              SEASONAL PRIVILEGES & SABBATICAL VOUCHERS
            </h2>
            <p className="text-stone-600 text-sm mt-1.5 font-light">
              Use these exclusive vouchers when reserving directly through our indigenous host syndicate.
            </p>
          </div>
        </div>

        {/* Promos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROMOS.map((promo) => {
            const isCopied = copiedCode === promo.code

            return (
              <div
                key={promo.code}
                className="bg-white border border-[#CBDAC4] p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group card-hover-lift"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#123D26] text-[#C6E8A3] text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {promo.benefit}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">{promo.validity}</span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-stone-900 group-hover:text-[#164E2D] transition-colors">
                    {promo.title}
                  </h3>

                  <p className="text-xs text-stone-600 mt-2 font-light leading-relaxed">
                    {promo.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold bg-[#FAF7EE] px-3 py-1.5 rounded-lg border border-[#CBDAC4] text-[#0A2316]">
                    {promo.code}
                  </span>

                  <button
                    onClick={() => handleCopy(promo.code)}
                    type="button"
                    className="text-xs font-semibold text-[#164E2D] hover:text-[#0A2316] flex items-center gap-1.5 transition active:scale-95 px-3 py-1.5 rounded-lg hover:bg-stone-100"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#34D399]" />
                        <span className="text-[#164E2D] font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-400" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
