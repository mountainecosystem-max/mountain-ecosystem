import type { FC } from 'react'
import type { Destination, Dispatch } from '../../types'
import { X, Leaf, ShieldCheck } from 'lucide-react'

interface StoryDetailModalProps {
  destination?: Destination | null
  dispatch?: Dispatch | null
  onClose: () => void
}

export const StoryDetailModal: FC<StoryDetailModalProps> = ({
  destination,
  dispatch,
  onClose,
}) => {
  if (!destination && !dispatch) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0A241A]/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#F8F6F0] border border-[#CBDAC4] rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-[#F8F6F0] border-b border-[#CBDAC4] px-6 sm:px-8 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#285A40] font-bold">
              <Leaf className="w-3.5 h-3.5 text-[#285A40]" />
              <span>{destination ? 'REGIONAL BOTANICAL JOURNAL' : 'COMMUNITY GROUND DISPATCH'}</span>
            </div>
            <div className="text-xs text-[#576159] font-mono mt-0.5">
              {destination
                ? `${destination.name} • Elevation ${destination.elevation}`
                : `${dispatch?.location} • ${dispatch?.date}`}
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-[#576159] hover:text-[#123D2D] hover:bg-[#E8EFE3] rounded-sm transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {destination && (
            <>
              <div className="h-[280px] sm:h-[340px] overflow-hidden rounded-sm bg-[#123D2D] relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A241A]/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-[#E8EFE3]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#91A77B]">
                    {destination.region}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-white">
                    {destination.name}
                  </h2>
                </div>
              </div>

              <blockquote className="p-4 bg-[#E8EFE3]/60 border-l-2 border-[#285A40] italic font-serif text-base sm:text-lg text-[#123D2D]">
                "{destination.storyQuote}"
              </blockquote>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#123D2D] font-bold mb-2">
                  Topography & Tea Ecology
                </h3>
                <p className="text-sm text-[#576159] leading-relaxed font-light">
                  {destination.description}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#123D2D] font-bold mb-3">
                  Key Cultural, Tea & Nature Trails
                </h3>
                <ul className="space-y-2">
                  {destination.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#576159] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#285A40]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-[#E8EFE3]/70 border border-[#CBDAC4] rounded-sm flex items-center justify-between text-xs font-mono text-[#123D2D]">
                <span>Best Travelling Season: {destination.season}</span>
                <span className="font-bold">{destination.coordinates}</span>
              </div>
            </>
          )}

          {dispatch && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-[#285A40] bg-[#E8EFE3] px-2.5 py-0.5 rounded-sm border border-[#CBDAC4]">
                    {dispatch.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-[#576159]">• {dispatch.readTime}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#123D2D] font-normal leading-tight">
                  {dispatch.title}
                </h2>
              </div>

              {/* Author badge */}
              <div className="flex items-center gap-3 p-3 bg-[#E8EFE3]/50 border border-[#CBDAC4] rounded-sm">
                <img
                  src={dispatch.author.avatar}
                  alt={dispatch.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#285A40]/30"
                />
                <div>
                  <div className="text-xs font-bold text-[#123D2D]">{dispatch.author.name}</div>
                  <div className="text-[11px] text-[#576159] font-mono">
                    {dispatch.author.role} • {dispatch.author.communityBadge}
                  </div>
                </div>
              </div>

              {/* Price Report details if present */}
              {dispatch.priceData && (
                <div className="p-4 bg-[#E8EFE3] border border-[#285A40]/30 rounded-sm">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#285A40] font-bold mb-2">
                    OFFICIAL PRICE BENCHMARK ({dispatch.priceData.lastUpdated})
                  </div>
                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-[#CBDAC4]">
                    <div>
                      <div className="text-[11px] text-[#576159]">Standard Shared Rate</div>
                      <div className="font-serif text-xl font-bold text-[#123D2D]">
                        {dispatch.priceData.sharedRate}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#576159]">Private Hired Rate</div>
                      <div className="font-serif text-xl font-bold text-[#123D2D]">
                        {dispatch.priceData.privateRate}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#576159] mt-2 font-mono">
                    {dispatch.priceData.fairPriceNote}
                  </p>
                </div>
              )}

              {/* Full Content */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#123D2D] font-bold mb-2">
                  Full Ground Dispatch
                </h3>
                <p className="text-sm text-[#576159] leading-relaxed font-light whitespace-pre-line">
                  {dispatch.fullContent}
                </p>
              </div>
            </>
          )}

          {/* Community Feedback Advisory */}
          <div className="p-3 bg-stone-100 border border-stone-300 rounded-sm text-xs text-stone-700 flex items-start gap-2.5 font-sans leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block font-mono text-[10px] uppercase tracking-wider text-stone-900">
                Community Sourced Insight:
              </strong>
              Experiences and fares are shared by independent travellers and locals. Conditions in mountain passes shift rapidly. Please cross-verify with local operators and checkpoints.
            </div>
          </div>

          <div className="pt-4 border-t border-[#CBDAC4] flex justify-end">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2.5 bg-[#123D2D] text-[#E8EFE3] text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-[#0A241A] border border-[#285A40]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
