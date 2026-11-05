import type { FC } from 'react'
import { Star, MessageSquareHeart } from 'lucide-react'

interface ReviewItem {
  id: string
  author: string
  location: string
  stayedAt: string
  rating: number
  avatar: string
  quote: string
}

const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Ananya Roy & Devjit Sen',
    location: 'Kolkata',
    stayedAt: 'The Cedar Wood Chalet • Takdah',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    quote:
      'Waking up to Mt. Kanchenjunga painted pink outside our timber bedroom window was surreal. Passang and his family served hot garden tea and fire-roasted momos every evening by the hearth. Zero noise, just birdcalls and pine mist.'
  },
  {
    id: 'rev-2',
    author: 'Marcus Vance',
    location: 'Berlin, Germany',
    stayedAt: 'Glasshouse Star Attic • Mirik Ridge',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    quote:
      'Spent a full month on a remote engineering workation here. The 150 Mbps fiber internet never blinked once, and working with a river-stone fireplace crackling next to my desk was the best month of my career.'
  },
  {
    id: 'rev-3',
    author: 'Priyanka & Siddharth Rao',
    location: 'Bengaluru',
    stayedAt: '1924 Planter Heritage Suite • Kurseong',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    quote:
      'Completely different from standard commercial resorts. Real organic mountain hospitality, no middleman gouging, and the estate tea plucking walk was the highlight of our Himalayas trip.'
  }
]

export const GuestReviewsSection: FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#CBDAC4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#164E2D] text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
            <MessageSquareHeart className="w-4 h-4 text-[#D96B27]" />
            <span>REAL WORDS FROM MOUNTAIN DWELLERS</span>
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A2316] uppercase leading-tight">
            WHAT OUR TRAVELERS & SABBATICAL RESIDENTS SAY
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2 font-light">
            Verified guest testimonials from travellers who woke up above the clouds across our sanctuaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAF7EE] p-6 sm:p-7 rounded-3xl border border-[#CBDAC4] shadow-sm flex flex-col justify-between card-hover-lift"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed font-light">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex items-center gap-3.5">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-sm text-stone-900">{item.author}</h4>
                  <p className="text-[11px] text-stone-500 font-mono">
                    {item.location} • <span className="text-[#164E2D] font-medium">{item.stayedAt}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
