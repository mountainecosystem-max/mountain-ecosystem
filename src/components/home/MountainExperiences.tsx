import type { FC } from 'react'
import { Compass, Clock, ArrowRight } from 'lucide-react'

interface ExperienceItem {
  id: string
  title: string
  tag: string
  time: string
  duration: string
  price: string
  description: string
  image: string
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: 'Single-Estate First-Flush Tea Plucking & Tasting Masterclass',
    tag: 'Estate Exclusive',
    time: 'Morning 07:30 AM',
    duration: '3 Hours',
    price: '₹850 / person',
    description:
      'Walk alongside veteran tea pickers through emerald mist-veiled slopes. Pluck two leaves and a bud, witness the orthodox withering pans, and brew three rare Darjeeling flushes on the open veranda.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'exp-2',
    title: 'Pine Forest Shinrin-Yoku & Riverbed Stone Hearth Trek',
    tag: 'Forest Therapy',
    time: 'Daily 09:30 AM',
    duration: '4 Hours',
    price: '₹1,200 / person',
    description:
      'A silent guided meditation hike beneath giant Himalayan cedars and cryptomeria pine groves. Concludes with a wood-fired kettle lunch beside a clean, glacial mountain brook.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'exp-3',
    title: '360° Sunrise Kanchenjunga Ridge Walk & Butter Lamp Prayer',
    tag: 'Signature Sunrise',
    time: 'Early 05:00 AM',
    duration: '2.5 Hours',
    price: '₹650 / person',
    description:
      'Gaze upon the third highest peak on Earth glowing rose-gold at dawn. Visit a 150-year-old Lepcha monastery ridge to light traditional brass butter lamps with the village elders.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'exp-4',
    title: 'Traditional Pahadi Hearth & Handcrafted Momo Workshop',
    tag: 'Farm Kitchen',
    time: 'Evening 05:30 PM',
    duration: '2 Hours',
    price: 'Complimentary',
    description:
      'Gather round the wood-burning hearth with your host Yangchen. Hand-roll buckwheat dumpling wrappers, prepare fresh organic nettle filling, and roast spicy dale chili chutneys.',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'
  }
]

interface MountainExperiencesProps {
  onBookCottage?: () => void
}

export const MountainExperiences: FC<MountainExperiencesProps> = ({ onBookCottage }) => {
  const handleAction = () => {
    if (onBookCottage) {
      onBookCottage()
    } else {
      const el = document.getElementById('homestays')
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="experiences" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-[#164E2D] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 font-mono mb-2">
          <Compass className="w-4 h-4 text-[#D96B27]" />
          <span>BEYOND MERE STAYS</span>
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A2316] uppercase leading-tight">
          CURATED HIMALAYAN EXPERIENCES
        </h2>
        <p className="text-stone-600 text-sm sm:text-base mt-2.5 font-light leading-relaxed">
          Immerse yourself in authentic mountain traditions guided personally by our local naturalist host families across the tea ridges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {EXPERIENCES.map((exp) => (
          <div
            key={exp.id}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-hover-lift"
          >
            <div>
              {/* Photo & Duration Badge */}
              <div className="relative h-48 overflow-hidden bg-[#0A2316]">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 bg-[#05170D]/90 backdrop-blur-md text-[#C6E8A3] border border-[#2D6B48]/50 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  {exp.tag}
                </div>

                <div className="absolute bottom-3 right-3 bg-stone-900/90 text-white text-xs font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#A5C896]" />
                  <span>{exp.duration}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-[10px] font-mono font-semibold text-[#164E2D] uppercase tracking-wider">
                  {exp.time}
                </span>
                <h3 className="font-display text-lg font-bold text-stone-950 mt-1 leading-snug group-hover:text-[#164E2D] transition-colors">
                  {exp.title}
                </h3>
                <p className="text-xs text-stone-600 mt-2 font-light line-clamp-3 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 pt-3 border-t border-stone-100 flex items-center justify-between mt-auto bg-stone-50/60">
              <span className="text-xs font-bold text-[#0A2316] font-mono">{exp.price}</span>
              <button
                onClick={handleAction}
                type="button"
                className="text-xs font-bold text-[#164E2D] hover:text-[#0A2316] hover:underline flex items-center gap-1"
              >
                <span>Reserve</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
