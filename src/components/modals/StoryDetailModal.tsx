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
      className="fixed inset-0 z-[70] overflow-y-auto bg-[#0B1B3D]/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#F8FAFC] border border-slate-200 rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 -mb-1 sm:hidden shrink-0" />
        {/* Sticky Header */}
        <div className="sticky top-0 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200 px-6 sm:px-8 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#2575fc] font-bold">
              <Leaf className="w-3.5 h-3.5 text-[#2575fc]" />
              <span>{destination ? 'REGIONAL BOTANICAL JOURNAL' : 'COMMUNITY GROUND DISPATCH'}</span>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5 tracking-tight">
              {destination
                ? `${destination.name} • Elevation ${destination.elevation}`
                : `${dispatch?.location} • ${dispatch?.date}`}
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 flex items-center justify-center p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {destination && (
            <>
              <div className="h-[280px] sm:h-[340px] overflow-hidden rounded-xl bg-[#0B1B3D] relative shadow-md">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D]/90 via-[#0B1B3D]/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7DD3FC]">
                    {destination.region}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-white tracking-tight mt-0.5">
                    {destination.name}
                  </h2>
                </div>
              </div>

              <blockquote className="p-4 bg-sky-50/70 border-l-4 border-[#2575fc] italic font-serif text-base sm:text-lg text-[#0F172A] rounded-r-lg">
                "{destination.storyQuote}"
              </blockquote>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#0F172A] font-bold mb-2">
                  Topography & Tea Ecology
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {destination.description}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#0F172A] font-bold mb-3">
                  Key Cultural, Tea & Nature Trails
                </h3>
                <ul className="space-y-2">
                  {destination.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2575fc]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl flex items-center justify-between text-xs font-mono text-[#0F172A]">
                <span>Best Travelling Season: {destination.season}</span>
                <span className="font-bold text-[#2575fc]">{destination.coordinates}</span>
              </div>
            </>
          )}

          {dispatch && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-[#2575fc] bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200 font-semibold">
                    {dispatch.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-500">• {dispatch.readTime}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#0F172A] font-normal leading-tight tracking-tight">
                  {dispatch.title}
                </h2>
              </div>

              {/* Author badge */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <img
                  src={dispatch.author.avatar}
                  alt={dispatch.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-sky-200"
                />
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">{dispatch.author.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {dispatch.author.role} • {dispatch.author.communityBadge}
                  </div>
                </div>
              </div>

              {/* Price Report details if present */}
              {dispatch.priceData && (
                <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#2575fc] font-bold mb-2">
                    OFFICIAL PRICE BENCHMARK ({dispatch.priceData.lastUpdated})
                  </div>
                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-sky-200">
                    <div>
                      <div className="text-[11px] text-slate-500">Standard Shared Rate</div>
                      <div className="font-serif text-xl font-bold text-[#0F172A]">
                        {dispatch.priceData.sharedRate}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">Private Hired Rate</div>
                      <div className="font-serif text-xl font-bold text-[#0F172A]">
                        {dispatch.priceData.privateRate}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 font-mono">
                    {dispatch.priceData.fairPriceNote}
                  </p>
                </div>
              )}

              {/* Full Content */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#0F172A] font-bold mb-2">
                  Full Ground Dispatch
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                  {dispatch.fullContent}
                </p>
              </div>
            </>
          )}

          {/* Community Feedback Advisory */}
          <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5 font-sans leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#2575fc] shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block font-mono text-[10px] uppercase tracking-wider text-[#0F172A]">
                Community Sourced Insight:
              </strong>
              Experiences and fares are shared by independent travellers and locals. Conditions in mountain passes shift rapidly. Please cross-verify with local operators and checkpoints.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              type="button"
              className="btn-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
