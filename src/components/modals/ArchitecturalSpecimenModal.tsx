import { useEffect } from 'react'
import type { FC } from 'react'
import { X, Compass, Layers, ShieldCheck, Flame, Mountain, Droplets, Quote, ArrowRight } from 'lucide-react'
import type { ArchitecturalSpecimen } from '../../types'

interface ArchitecturalSpecimenModalProps {
  specimen: ArchitecturalSpecimen | null
  onClose: () => void
  onExploreStays?: () => void
}

export const ArchitecturalSpecimenModal: FC<ArchitecturalSpecimenModalProps> = ({
  specimen,
  onClose,
  onExploreStays
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (specimen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [specimen, onClose])

  if (!specimen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#06180E]/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="specimen-title"
    >
      <div
        className="relative w-full max-w-4xl bg-[#0B2516] border border-[#1F4E34] text-[#F8F6F0] shadow-2xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Folio Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#06180E]/90 text-[10px] font-mono tracking-[0.24em] text-[#8FA777] uppercase">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FA777]" />
            <span className="text-[#F8F6F0] font-semibold">HIMALAYAN MATERIAL ARCHIVE</span>
            <span className="text-white/30">•</span>
            <span>{specimen.code}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-white/50">{specimen.archetype}</span>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-[#E7EFE3]/80 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
              aria-label="Close Archival Specimen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-h-[80vh] overflow-y-auto px-6 sm:px-10 py-8 space-y-8">
          {/* Header Title & Subtitle */}
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-[#8FA777] uppercase mb-2">
              <Compass className="w-3.5 h-3.5 text-[#8FA777]" />
              <span>{specimen.archetype}</span>
            </div>
            <h2 id="specimen-title" className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
              {specimen.title}
            </h2>
            <p className="font-serif italic text-lg sm:text-xl text-[#B2C89E] mt-1 font-light">
              {specimen.subtitle}
            </p>
          </div>

          {/* Photographic Archival Specimen with Blueprint Stamp */}
          <div className="relative aspect-[16/9] w-full overflow-hidden border border-white/10 bg-[#06180E]">
            <img
              src={specimen.image}
              alt={specimen.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2516] via-transparent to-transparent opacity-80" />
            
            {/* Specimen Stamp Badge */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-[#E7EFE3] bg-[#0B2516]/80 backdrop-blur-md px-3.5 py-2 border border-white/15">
              <span>LINEAGE: {specimen.craftLineage}</span>
              <span className="text-[#8FA777]">ELEVATION: {specimen.elevationRange}</span>
            </div>
          </div>

          {/* Technical Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[#06180E]/70 border border-white/10">
              <div className="flex items-center gap-2 text-[#8FA777] text-[10px] font-mono tracking-[0.2em] uppercase mb-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Thermal Dynamic</span>
              </div>
              <div className="font-serif text-lg text-white font-normal">{specimen.thermalRating}</div>
            </div>

            <div className="p-4 bg-[#06180E]/70 border border-white/10">
              <div className="flex items-center gap-2 text-[#8FA777] text-[10px] font-mono tracking-[0.2em] uppercase mb-1.5">
                <Mountain className="w-3.5 h-3.5" />
                <span>Seismic Resilience</span>
              </div>
              <div className="font-serif text-lg text-white font-normal">{specimen.seismicIndex}</div>
            </div>

            <div className="p-4 bg-[#06180E]/70 border border-white/10">
              <div className="flex items-center gap-2 text-[#8FA777] text-[10px] font-mono tracking-[0.2em] uppercase mb-1.5">
                <Droplets className="w-3.5 h-3.5" />
                <span>Watershed Safety</span>
              </div>
              <div className="font-serif text-lg text-white font-normal">Zero Runoff Contamination</div>
            </div>
          </div>

          {/* Architectural Overview */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8FA777]">
              Archival Monograph & Historic Context
            </h3>
            <p className="text-base text-[#E7EFE3]/90 font-light leading-relaxed font-sans">
              {specimen.overview}
            </p>
          </div>

          {/* Material Composition Analysis */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8FA777] flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Material Provenance & Composition Breakdown</span>
              </h3>
              <span className="text-[10px] font-mono text-[#E7EFE3]/60">100% REGIONALLY HEWN</span>
            </div>

            <div className="space-y-3">
              {specimen.materials.map((mat) => (
                <div key={mat.name} className="p-3.5 bg-[#06180E]/50 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="font-semibold text-white">{mat.name}</span>
                    <span className="font-mono text-[#8FA777]">{mat.percentage}% of envelope</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-[#8FA777]"
                      style={{ width: `${mat.percentage}%` }}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#E7EFE3]/70">
                    <span>Source: {mat.source}</span>
                    <span className="text-[#B2C89E] italic">{mat.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indigenous Engineering Principles */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-[#8FA777] flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Indigenous Engineering & Bioclimatic Physics</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {specimen.engineeringPrinciples.map((principle) => (
                <div key={principle.label} className="p-4 bg-[#06180E]/60 border border-white/10 space-y-2">
                  <div className="text-xs font-mono text-[#FDFBF7] font-semibold border-b border-white/10 pb-1.5">
                    {principle.label}
                  </div>
                  <p className="text-xs text-[#E7EFE3]/80 leading-relaxed font-sans">
                    {principle.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Master Craftsman Quote */}
          <div className="p-5 sm:p-6 bg-[#06180E]/90 border-l-2 border-[#8FA777] space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8FA777]">
              <Quote className="w-3.5 h-3.5" />
              <span>Oral Craft Testimony</span>
            </div>
            <p className="font-serif italic text-base sm:text-lg text-[#F8F6F0] leading-relaxed">
              "{specimen.quote.text}"
            </p>
            <div className="text-xs font-mono text-[#E7EFE3]/70">
              <span className="font-semibold text-white">{specimen.quote.author}</span> — {specimen.quote.craftTitle} ({specimen.quote.location})
            </div>
          </div>

          {/* Ecological Stewardship Callout */}
          <div className="p-4 bg-[#1F4E34]/30 border border-[#1F4E34] text-xs font-sans text-[#E7EFE3] flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#8FA777] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Fragile Ecosystem Protection: </span>
              <span>{specimen.ecologicalProtection}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 sm:px-10 py-4 border-t border-white/10 bg-[#06180E]/95">
          <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8FA777]">
            CATALOGUE REF: {specimen.code} • EASTERN HIMALAYAN ARCHITECTURAL GUILD
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-[#E7EFE3] hover:text-white border border-white/20 hover:bg-white/5 transition-colors"
            >
              Close Ledger
            </button>

            {onExploreStays && (
              <button
                onClick={() => {
                  onClose()
                  onExploreStays()
                }}
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-sans font-semibold tracking-wider uppercase bg-[#FDFBF7] text-[#0B2516] hover:bg-white transition-all shadow-md"
              >
                <span>View Homestays with this Craft</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0B2516]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
