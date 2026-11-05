import { useState, useEffect } from 'react'
import type { FC, FormEvent } from 'react'
import {
  X,
  Compass,
  ArrowRight,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Plus,
  Trash2
} from 'lucide-react'
import type { AdminDestination } from '../../../types'
import {
  createAdminDestination,
  updateAdminDestination,
  slugify,
  type CreateDestinationInput
} from '../../../services/adminDestinationService'

interface DestinationFormModalProps {
  isOpen: boolean
  destinationToEdit?: AdminDestination | null
  onClose: () => void
  onSuccess: (destination: AdminDestination, isEdit: boolean) => void
}

const REGION_OPTIONS = [
  'Darjeeling Tea Belt',
  'Kalimpong Green Ridge',
  'Sikkim Forest Valleys',
  'Dooars Sal Canopy',
  'Singalila Alpine Ridge',
  'Kurseong Pine Hills'
]

const SAMPLE_IMAGES = [
  {
    label: 'Misty Tea Gardens',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85'
  },
  {
    label: 'Alpine Monastery Ridge',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85'
  },
  {
    label: 'Cedar Forest Trail',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=85'
  }
]

export const DestinationFormModal: FC<DestinationFormModalProps> = ({
  isOpen,
  destinationToEdit,
  onClose,
  onSuccess
}) => {
  const isEdit = Boolean(destinationToEdit)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [region, setRegion] = useState(REGION_OPTIONS[0])
  const [elevation, setElevation] = useState('2,042m')
  const [coordinates, setCoordinates] = useState('27°04\'10" N • 88°16\'05" E')
  const [season, setSeason] = useState('March – June & October – December')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [storyQuote, setStoryQuote] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [highlights, setHighlights] = useState<string[]>([''])
  const [featured, setFeatured] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [sortOrder, setSortOrder] = useState(0)

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form if editing
  useEffect(() => {
    if (destinationToEdit) {
      setName(destinationToEdit.name)
      setSlug(destinationToEdit.slug || slugify(destinationToEdit.name))
      setSubtitle(destinationToEdit.subtitle)
      setRegion(destinationToEdit.region)
      setElevation(destinationToEdit.elevation)
      setCoordinates(destinationToEdit.coordinates)
      setSeason(destinationToEdit.season)
      setImage(destinationToEdit.image)
      setDescription(destinationToEdit.description)
      setStoryQuote(destinationToEdit.storyQuote || '')
      setTagsInput(destinationToEdit.tags?.join(', ') || '')
      setHighlights(destinationToEdit.highlights?.length ? destinationToEdit.highlights : [''])
      setFeatured(destinationToEdit.featured)
      setIsPublished(destinationToEdit.isPublished)
      setSortOrder(destinationToEdit.sortOrder || 0)
    } else {
      // Reset form
      setName('')
      setSlug('')
      setSubtitle('')
      setRegion(REGION_OPTIONS[0])
      setElevation('2,042m')
      setCoordinates('27°04\'10" N • 88°16\'05" E')
      setSeason('March – June & October – December')
      setImage(SAMPLE_IMAGES[0].url)
      setDescription('')
      setStoryQuote('')
      setTagsInput('Biodynamic Tea, Organic Living, Heritage Ridges')
      setHighlights(['Certified biodynamic estates', 'Solar micro-hydro grid', 'Local host cooperatives'])
      setFeatured(false)
      setIsPublished(true)
      setSortOrder(0)
    }
    setError(null)
  }, [destinationToEdit, isOpen])

  if (!isOpen) return null

  // Handle auto slug creation on name change if not manually edited
  const handleNameChange = (val: string) => {
    setName(val)
    if (!isEdit && (!slug || slug === slugify(name))) {
      setSlug(slugify(val))
    }
  }

  // Highlights handlers
  const handleAddHighlight = () => {
    setHighlights((prev) => [...prev, ''])
  }

  const handleUpdateHighlight = (index: number, val: string) => {
    setHighlights((prev) => {
      const updated = [...prev]
      updated[index] = val
      return updated
    })
  }

  const handleRemoveHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Destination name is required.')
      return
    }

    if (!subtitle.trim()) {
      setError('Subtitle / editorial title is required.')
      return
    }

    if (!image.trim()) {
      setError('Please provide an image URL.')
      return
    }

    if (!description.trim()) {
      setError('Full description is required.')
      return
    }

    setIsSubmitting(true)

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const cleanHighlights = highlights.map((h) => h.trim()).filter(Boolean)

    const payload: CreateDestinationInput = {
      name,
      slug: slug || slugify(name),
      subtitle,
      region,
      elevation,
      coordinates,
      season,
      image,
      description,
      storyQuote,
      tags,
      highlights: cleanHighlights,
      featured,
      isPublished,
      sortOrder
    }

    try {
      if (isEdit && destinationToEdit) {
        const res = await updateAdminDestination(destinationToEdit.id, payload)
        if (res.error || !res.data) {
          setError(res.error || 'Failed to update destination')
        } else {
          onSuccess(res.data, true)
        }
      } else {
        const res = await createAdminDestination(payload)
        if (res.error || !res.data) {
          setError(res.error || 'Failed to create destination')
        } else {
          onSuccess(res.data, false)
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#F8F6F0] border border-[#CBDAC4] rounded-sm max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#0B2516] text-[#F8F6F0] border-b border-[#1F4E34] px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-[#8FA777]" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8FA777]">
                {isEdit ? 'RECORD MODIFICATION' : 'NEW SANCTUARY DISPATCH'}
              </div>
              <h2 className="font-serif text-xl sm:text-2xl text-white font-normal mt-0.5">
                {isEdit ? `Edit: ${destinationToEdit?.name}` : 'Create New Destination'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/60 hover:text-white rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-[#202622]">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-300 rounded-sm text-xs text-red-800 flex items-start gap-2 font-mono">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Row 1: Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1 font-semibold">
                Destination Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Makaibari Organic Tea Estate"
                className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1 font-semibold">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="makaibari-organic-tea-estate"
                className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs font-mono text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
              />
            </div>
          </div>

          {/* Row 2: Subtitle & Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1 font-semibold">
                Editorial Subtitle *
              </label>
              <input
                type="text"
                required
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Birthplace of Himalayan Biodynamic Tea"
                className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1 font-semibold">
                Himalayan Region *
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
              >
                {REGION_OPTIONS.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Elevation, Coordinates, Season */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1 font-semibold">
                Elevation
              </label>
              <input
                type="text"
                value={elevation}
                onChange={(e) => setElevation(e.target.value)}
                placeholder="e.g. 1,450m"
                className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs font-mono text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1 font-semibold">
                Coordinates
              </label>
              <input
                type="text"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                placeholder='26°52"18" N • 88°16"44" E'
                className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs font-mono text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1 font-semibold">
                Prime Season
              </label>
              <input
                type="text"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                placeholder="March – June & Autumn"
                className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
              />
            </div>
          </div>

          {/* Row 4: Image URL with Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] font-semibold">
                Photograph URL *
              </label>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#576159]">
                <span>Sample presets:</span>
                {SAMPLE_IMAGES.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => setImage(sample.url)}
                    className="px-2 py-0.5 bg-[#CBDAC4]/50 hover:bg-[#CBDAC4] text-[#123D2D] rounded-sm transition-colors text-[9px]"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 bg-white border border-[#CBDAC4] px-3 py-2 text-xs font-mono text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
              />

              {/* Preview Thumbnail */}
              <div className="w-24 h-14 bg-gray-200 border border-[#CBDAC4] rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Row 5: Full Description */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1 font-semibold">
              Full Editorial Narrative *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the landscape, the historical tea roots, ecological commitments, forest trails, and community rhythm..."
              className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
            />
          </div>

          {/* Row 6: Story Quote */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1 font-semibold">
              Voice from the Ridge (Story / Host Quote)
            </label>
            <textarea
              rows={2}
              value={storyQuote}
              onChange={(e) => setStoryQuote(e.target.value)}
              placeholder='"We do not own the forest canopy; we only steward the dew lines each dawn..."'
              className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs italic text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
            />
          </div>

          {/* Row 7: Tags */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] mb-1 font-semibold">
              Category Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Biodynamic Tea, Forest Sanctuary, Organic Living, Heritage"
              className="w-full bg-white border border-[#CBDAC4] px-3 py-2 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
            />
          </div>

          {/* Row 8: Highlights */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#576159] font-semibold">
                Sanctuary Key Highlights
              </label>
              <button
                type="button"
                onClick={handleAddHighlight}
                className="inline-flex items-center gap-1 text-[10px] font-mono text-[#285A40] hover:text-[#123D2D] font-bold"
              >
                <Plus className="w-3 h-3" />
                <span>Add Bullet Point</span>
              </button>
            </div>

            <div className="space-y-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateHighlight(idx, e.target.value)}
                    placeholder="e.g. 100% solar micro-hydro powered"
                    className="flex-1 bg-white border border-[#CBDAC4] px-3 py-1.5 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
                  />
                  {highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="p-1.5 text-red-500 hover:text-red-700 rounded-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Row 9: Status Checks */}
          <div className="pt-4 border-t border-[#CBDAC4] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded border-[#CBDAC4] text-[#123D2D] focus:ring-[#285A40]"
              />
              <span className="text-[#123D2D] font-semibold">Publish Immediately</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-[#CBDAC4] text-[#123D2D] focus:ring-[#285A40]"
              />
              <span className="text-[#123D2D] font-semibold">Featured on Public Homepage</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-[11px] text-[#576159] uppercase tracking-wider shrink-0">
                Sort Order:
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-20 bg-white border border-[#CBDAC4] px-2 py-1 text-xs text-[#123D2D] rounded-sm focus:outline-none focus:border-[#285A40]"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-6 border-t border-[#CBDAC4] flex items-center justify-end gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 border border-[#CBDAC4] text-[#576159] hover:text-[#123D2D] hover:bg-white rounded-sm transition-colors uppercase tracking-wider"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#123D2D] hover:bg-[#0A241A] text-white rounded-sm transition-colors uppercase tracking-wider font-semibold disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#8FA777]" />
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                <>
                  <span>{isEdit ? 'Save Changes' : 'Create Sanctuary'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8FA777]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
