/**
 * TEMPORARY DEVELOPMENT PREVIEW DATA ONLY
 * -----------------------------------------------------------------------------
 * This file contains sample staging data for interface design, layout testing,
 * and staging review prior to client database population.
 *
 * It is completely separated from production database queries.
 * In production mode, the application queries Supabase directly.
 * -----------------------------------------------------------------------------
 */

import type { Destination, Dispatch, Job, Homestay, ArchitecturalSpecimen, PriceIndexItem } from '../types'
import { BRAND_CONFIG } from '../config/branding'

export const DEV_PREVIEW_DESTINATIONS: Destination[] = [
  {
    id: 'darjeeling',
    name: 'Darjeeling',
    subtitle: 'Emerald Tea Sanctuaries & Cedar Ridgelines',
    region: 'Eastern Himalaya • West Bengal',
    elevation: '2,042 m',
    description:
      'Where century-old biodynamic tea gardens cascade down steep emerald hillsides, wrapped in moving monsoon mists and ancient cedar groves. Darjeeling is a living sanctuary of organic tea agriculture, Lepcha botanical heritage, and moss-covered stone forest walkways.',
    storyQuote: 'The morning mist clears over Happy Valley in silver ribbons, revealing miles of vibrant green tea terraces before the town has even stirred its first brew.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85',
    season: 'Autumn (Oct–Dec) & Spring (Mar–May)',
    tags: ['Artisanal Tea Gardens', 'Cedar Pine Trails', 'Monastic Ridge Walks', 'First Flush Harvest'],
    featured: true,
    coordinates: '27.0410° N, 88.2663° E',
    highlights: ['First flush plucking walks at Glenburn', 'Ghoom Old Monastery pine trail', 'Observatory Hill mossy cedar walk', 'Batasia emerald loop']
  },
  {
    id: 'kalimpong',
    name: 'Kalimpong',
    subtitle: 'Lush Orchid Ridges & Teesta River Terraces',
    region: 'Eastern Himalaya • West Bengal',
    elevation: '1,247 m',
    description:
      'A gentler, subtropical green ridge overlooking the roaring Teesta River. Famous for sustainable orchid nurseries, artisanal sourdough bakeries, and panoramic views of Kanchenjunga across rolling ginger terraced valleys.',
    storyQuote: 'Sitting on the veranda of an old stone home in Kalimpong, listening to the afternoon rain gently fall on the cardamom leaves below.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    season: 'Year-round lush green climate',
    tags: ['Orchid Greenhouses', 'River Gorge Views', 'Artisan Bakeries', 'Terraced Farming'],
    featured: false,
    coordinates: '27.0667° N, 88.4667° E',
    highlights: ['Deolo hill paragliding over tea valleys', 'Morgan House pine gardens', 'Zang Dhok Palri monastery overlook', 'Pedong forest village']
  },
  {
    id: 'sikkim',
    name: 'Sikkim Valleys',
    subtitle: '100% Organic Valleys & Sacred Alpine Forest',
    region: 'Eastern Himalaya • Sikkim',
    elevation: '1,650 m',
    description:
      'The world’s first 100% organic state. Forest-rich mountain corridors where ancient Buddhist gompas rise above bamboo groves, cardamom forests, and clean glacial river waters flowing from snowmelt peaks.',
    storyQuote: 'In Sikkim, every vegetable on your host’s wooden table was pulled from the rich black mountain earth less than an hour ago.',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=85',
    season: 'Spring Rhododendrons & Crystal Autumn',
    tags: ['100% Organic Cuisine', 'Sacred Rhododendrons', 'Monastery Trails', 'Glacial Streams'],
    featured: false,
    coordinates: '27.3389° N, 88.6065° E',
    highlights: ['Yuksom historical coronation throne trail', 'Ravangla Buddha Park cedar grove', 'Dzongu Lepcha ancestral reserve', 'Pelling monastery forest trail']
  },
  {
    id: 'dooars',
    name: 'Dooars Canopy',
    subtitle: 'Wild Sal Forests & Tea Plantation Foothills',
    region: 'Eastern Himalaya • West Bengal Foothills',
    elevation: '150 m',
    description:
      'Where the dramatic green Himalayan mountains meet the vast tropical floodplains. Endless emerald tea estates bordered by dense Sal forest reserves, elephant migratory corridors, and rushing pebble-bed rivers.',
    storyQuote: 'Waking up to the calls of hornbills across a sea of tea bushes, with the steep green mountain wall rising straight out of the forest canopy.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85',
    season: 'Winter (Nov–Feb) & Post-Monsoon',
    tags: ['Dense Sal Forests', 'Elephant Corridors', 'Riverbed Sanctuaries', 'Tea Frontier'],
    featured: false,
    coordinates: '26.7500° N, 89.0000° E',
    highlights: ['Murti river pebble bank walks', 'Gorumara rhino watchtowers', 'Jaldapara grassland trails', 'Samsing mountain stream pools']
  }
]

export const DEV_PREVIEW_DISPATCHES: Dispatch[] = [
  {
    id: 'disp-1',
    type: 'price_report',
    title: 'Siliguri to Darjeeling Shared Sumo Winter Fare Standard',
    excerpt: 'Verified transport syndicate rates from Siliguri Junction to Darjeeling Motor Stand via Kurseong.',
    fullContent:
      'The official Darjeeling Motor Transport Syndicate has reaffirmed that standard shared Sumo rates remain locked at ₹350 per passenger seat from Siliguri Junction to Darjeeling Club Stand. Travellers arriving at NJP Railway station should avoid unregulated touts outside the main porch and proceed directly to the prepaid ticket booth at Platform 1 exit or the Siliguri Junction stand. Luggage in the rear cargo boot is included free of charge unless exceeding 25kg.',
    location: 'Siliguri ⇄ Darjeeling Ridge',
    date: 'Feb 1, 2026',
    readTime: '3 min read',
    author: {
      name: 'Pemba Tshering',
      role: 'Mountain Logistics Steward',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      communityBadge: 'Verified Transport Union Liaison'
    },
    verified: true,
    helpfulCount: 84,
    priceData: {
      item: 'Siliguri ⇄ Darjeeling Transit',
      sharedRate: '₹350 / seat',
      privateRate: '₹2,800 / cab',
      fairPriceNote: 'Official union rate counter at Siliguri Junction Platform 1 exit. No surcharge for standard rucksack under 25kg.',
      lastUpdated: 'Feb 2026',
      stabilityScore: 98.4,
      history: [
        { month: 'Oct', rate: 350 },
        { month: 'Nov', rate: 350 },
        { month: 'Dec', rate: 380 },
        { month: 'Jan', rate: 350 },
        { month: 'Feb', rate: 350 }
      ]
    }
  },
  {
    id: 'disp-2',
    type: 'traveller_story',
    title: 'Three Weeks of Low-Bandwidth Writing in a Kurseong Tea Worker’s Cooperative',
    excerpt: 'How living alongside tea pluckers at 1,500m amid morning mist changed my perception of Himalayan time, sourdough baking, and creative solitude.',
    fullContent:
      'I arrived in Makaibari with two laptops and an anxious deadline. Within three days, the rhythm of Mrs. Subba’s kitchen took over. The morning tea is not brewed in hurried tea-bags; fresh autumn green leaves are steeped in water drawn from an oak spring. By midday, rain taps against the corrugated tin roof with hypnotic constancy. With stable 80 Mbps optical fiber now reaching the lower village hamlets, you can participate in a global engineering standup at 3 PM and sit beside a hearth fire peeling ginger at 5 PM.',
    location: 'Kurseong, Darjeeling Hills',
    date: 'Jan 28, 2026',
    readTime: '6 min read',
    author: {
      name: 'Rohan Deshmukh',
      role: 'Remote Software Architect & Writer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      communityBadge: 'Resident Creator (3 Months)'
    },
    verified: true,
    helpfulCount: 142
  },
  {
    id: 'disp-3',
    type: 'host_story',
    title: 'Reviving Heirloom Buckwheat & Fermented Bamboo in Dzongu',
    excerpt: 'Our family opened our heritage stone loft for long-stay researchers to fund the conservation of traditional Lepcha agricultural seeds.',
    fullContent:
      'Dzongu is a protected reserve for the Lepcha people in North Sikkim. When sabbatical researchers lease our wood-and-stone loft, every meal comes from within 400 meters of the hearth: wild nettle soup, finger-millet unleavened bread, and organic buckwheat harvested by hand. Mountain residency here must be slow. If you want a disco and loud jeep engines, do not come here. But if you want to understand how a community lives with the spirit of Mt. Kanchenjunga, our door is unlocked.',
    location: 'Passingdang, Dzongu, Sikkim',
    date: 'Jan 21, 2026',
    readTime: '5 min read',
    author: {
      name: 'Karmila Lepcha',
      role: 'Homestay Host & Seed Custodian',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      communityBadge: 'Indigenous Host Elder'
    },
    verified: true,
    helpfulCount: 215
  },
  {
    id: 'disp-4',
    type: 'price_report',
    title: 'Mirik Valley Mandarin Orange Farmgate Harvest Index',
    excerpt: 'Direct-from-orchard rates for winter oranges, fresh raw honey, and cold-pressed mustard oil in the Mirik–Bungkulung belt.',
    fullContent:
      'The early harvest of sweet Himalayan mandarins in Bungkulung has begun. At roadside stalls along Mirik Lake, vendors charge ₹180 to ₹220 per dozen for tourist crates. If you walk 20 minutes down into the village cooperatives near Soureni, you can purchase tree-ripened oranges directly from the growers at ₹70 to ₹90 per dozen, with proceeds staying entirely in the growers’ cooperative hands.',
    location: 'Mirik & Soureni, Darjeeling District',
    date: 'Feb 1, 2026',
    readTime: '3 min read',
    author: {
      name: 'Sangita Rai',
      role: 'Organic Produce Cooperative Secretary',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      communityBadge: 'Verified Cooperative Host'
    },
    verified: true,
    helpfulCount: 97,
    priceData: {
      item: 'Bungkulung Heirloom Oranges (Dozen)',
      sharedRate: '₹80 (Farmgate)',
      privateRate: '₹200 (Highway tourist stall)',
      fairPriceNote: 'Buy directly from the Soureni Village Hall farmer cooperative. Always verify the citrus stem freshness.',
      lastUpdated: 'Feb 2026',
      stabilityScore: 96.2,
      history: [
        { month: 'Oct', rate: 90 },
        { month: 'Nov', rate: 80 },
        { month: 'Dec', rate: 75 },
        { month: 'Jan', rate: 80 },
        { month: 'Feb', rate: 85 }
      ]
    }
  }
]

export const DEV_PREVIEW_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Heritage Estate Manager & Agro-Tourism Host',
    employer: 'Glenburn Valley Estate',
    employerBadge: '120-Year Heritage Estate',
    location: 'Darjeeling Valley, West Bengal',
    region: 'Darjeeling',
    type: 'Full-time',
    salary: '₹45,000 – ₹60,000 / month',
    housingIncluded: true,
    category: 'Hospitality & Estates',
    description:
      'Lead estate guest operations, tea factory tastings, and trail excursions across 1,600 acres of biodynamic tea forests. Ideal for a seasoned hospitality professional who values quiet mountain stewardship and organic estate community culture.',
    responsibilities: [
      'Manage daily host operations for 8 boutique colonial bungalows',
      'Curate estate culinary programs utilizing 100% on-site organic kitchen gardens',
      'Train local village youth in natural history guiding and guest concierge services',
      'Oversee winter maintenance of stone fireplaces and solar hot-water systems'
    ],
    requirements: [
      '3+ years in boutique hospitality or mountain retreat operations',
      'Fluent in English and working proficiency in Nepali / Hindi',
      'Deep appreciation for organic agriculture and quiet mountain living',
      'Ability to commit to a minimum 12-month residential contract'
    ],
    benefits: [
      'Private 2-bedroom stone cottage with cedar fireplace and valley view',
      'All organic estate meals provided from company kitchen gardens',
      'High-speed 100 Mbps optic fiber connection',
      'Annual mountain wellness stipend and health insurance'
    ],
    postedDate: 'Feb 2, 2026'
  },
  {
    id: 'job-2',
    title: 'Botanical & Birding Naturalist Guide',
    employer: 'Singalila Conservation Collective',
    employerBadge: 'Eco-Tourism Guild Member',
    location: 'Manebhanjan to Sandakphu Ridge',
    region: 'Darjeeling',
    type: 'Seasonal',
    salary: '₹35,000 – ₹45,000 / month',
    housingIncluded: true,
    category: 'Guiding & Conservation',
    description:
      'Guide small groups of respectful international researchers, birdwatchers, and botanical artists through the rhododendron canopies of Singalila National Park. Focus on red panda habitat awareness and native orchid cataloging.',
    responsibilities: [
      'Lead 4-to-6 day guided ridge walks between 2,000m and 3,636m elevation',
      'Document high-altitude bird sightings (Satyr Tragopan, Blood Pheasant) for community database',
      'Enforce Leave No Trace wilderness protocols and forest fire prevention',
      'Facilitate evening fireside natural history talks at partner village homestays'
    ],
    requirements: [
      'Formal naturalist or mountain guiding credential (WFR certification preferred)',
      'Extensive knowledge of Eastern Himalayan flora, avifauna, and weather patterns',
      'Excellent physical stamina for high-altitude walking (up to 15km/day)',
      'Strong interpersonal and cross-cultural communication skills'
    ],
    benefits: [
      'Full accommodation and meals across partner ridge homestays',
      'High-grade technical mountain gear allowance (Gore-Tex outerwear & binoculars)',
      'Accident and high-altitude emergency rescue coverage',
      'Off-season stipend for independent ecological research'
    ],
    postedDate: 'Jan 30, 2026'
  },
  {
    id: 'job-3',
    title: 'Biodynamic Orchard & Permaculture Resident',
    employer: 'Pedong Permaculture Farm',
    employerBadge: 'Certified Organic Soil Association',
    location: 'Pedong, Kalimpong Hills',
    region: 'Kalimpong',
    type: 'Residency',
    salary: '₹28,000 – ₹35,000 / month',
    housingIncluded: true,
    category: 'Agriculture & Craft',
    description:
      '6-month residential position focused on cold-climate composting, heirloom mandarin orchard rejuvenation, and rain-water harvesting terracing in the serene hills of Pedong.',
    responsibilities: [
      'Supervise compost tea preparation and bio-char inoculation for 500 fruit trees',
      'Coordinate weekly harvest boxes for regional homestays and community kitchens',
      'Conduct weekend regenerative farming workshops for visiting sabbatical creators',
      'Maintain drip irrigation lines and gravity-fed greywater reed filtration beds'
    ],
    requirements: [
      'Background in permaculture design, organic horticulture, or soil science',
      'Hands-on comfort with manual field work in steep terrace terrains',
      'Self-motivated, contemplative mindset suited for rural quietude',
      'Curiosity for indigenous Lepcha companion planting traditions'
    ],
    benefits: [
      'Independent mud-plaster wood loft overlooking the Rachela peak',
      'Abundant farmgate organic produce, eggs, and raw dairy',
      'Weekly mentorship from senior agro-forestry elders',
      `Opportunity to publish findings in ${BRAND_CONFIG.name} community ledger`
    ],
    postedDate: 'Feb 1, 2026'
  }
]

export const DEV_PREVIEW_HOMESTAYS: Homestay[] = [
  {
    id: 'stay-1',
    name: 'The Cedar & Slate Ridge Cottage',
    region: 'Darjeeling Hills',
    location: 'Takdah Cantonment Pine Forest, Darjeeling',
    elevation: '1,850 m',
    monthlyRate: '₹32,000',
    securityDeposit: '₹32,000',
    minLeaseTerm: '1–6 Months',
    leaseStatus: 'Available for Immediate Lease',
    furnishing: 'Fully Furnished Cedar & Stone',
    rating: 4.96,
    reviewsCount: 38,
    host: {
      name: 'Pema & Tenzing Bhutia',
      role: 'Third-Generation Forest Stewards',
      yearsHosting: 6,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    },
    roomType: 'Entire Standalone Mountain Cottage',
    wifi: '100 Mbps Optic Fiber (Uncapped)',
    capacity: '1–2 Sabbatical Residents • 1 Bedroom • Kitchen • Study',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85'
    ],
    description:
      'Perched beneath towering Himalayan cedar and pine canopies in historic Takdah. Built with hand-cut local stone, reclaimed cedar floors, and a traditional cast-iron Bukhari wood stove that keeps the entire space toasty throughout cold mountain nights. Equipped with dedicated 100 Mbps fiber internet and an ergonomic oak writing desk facing morning mountain mists.',
    amenities: [
      'Dedicated 100 Mbps Optical Fiber with UPS backup',
      'Cast-iron Bukhari wood stove with seasoned pine firewood included',
      'Fully equipped mountain kitchen with organic spices and brass cookware',
      'Double-glazed panoramic study windows facing Kanchenjunga ridge',
      'Solar thermal hot-water geyser with immersion backup',
      'Direct access to Takdah orchid walking trails and pine forest walks'
    ],
    features: ['Zero Traffic Noise', 'Forest Sanctuary Boundary', 'Organic Kitchen Garden', 'Direct Host Support'],
    utilitiesIncluded: ['Optic Fiber Internet', 'Firewood Quota (150kg/month)', 'Municipal Spring Water', 'Waste Management']
  },
  {
    id: 'stay-2',
    name: 'Kanchenjunga Vista Heritage Loft',
    region: 'West Sikkim',
    location: 'Yuksom Historic Valley, West Sikkim',
    elevation: '1,780 m',
    monthlyRate: '₹28,000',
    securityDeposit: '₹28,000',
    minLeaseTerm: '1–12 Months',
    leaseStatus: 'Available from March',
    furnishing: 'Handcrafted Pinewood & Brass',
    rating: 4.98,
    reviewsCount: 42,
    host: {
      name: 'Sonam Norbu',
      role: 'Organic Cardamom Farmer & Mountaineer',
      yearsHosting: 8,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    roomType: 'Private Top-Floor Cedar Loft & Balcony',
    wifi: '80 Mbps Stable Fiber + Power Backup',
    capacity: '1–3 Residents • 2 Bedrooms • Private Balcony',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85'
    ],
    description:
      'A serene upper-level residential sanctuary in historic Yuksom—the coronation capital of Sikkim. Features high exposed-beam ceilings, hand-rubbed beeswax wooden floors, and a sweeping private terrace overlooking cardamom terraces and Mt. Kabru.',
    amenities: [
      'Private sunrise terrace with 180° Himalayan snowpeak panorama',
      'High-speed 80 Mbps fiber optic with 4-hour battery inverter',
      'En-suite modern bathroom with rain shower and stone sink',
      'Daily complimentary farm-fresh organic milk and pasture eggs',
      'Warm wool yak rugs and down duvets for alpine comfort',
      'Quiet library nook with books on Himalayan flora, fauna, and Buddhism'
    ],
    features: ['100% Organic Village Setting', 'Snowpeak Sunrise Overlook', 'Monastery Ridge Proximity', 'Quiet Sabbatical Ready'],
    utilitiesIncluded: ['Optic Fiber Internet', 'Electricity with Solar Battery', 'Pure Spring Water', 'Weekly Linen Laundry']
  }
]

export const DEV_PREVIEW_SPECIMENS: ArchitecturalSpecimen[] = [
  {
    id: 'specimen-bukhari-hearth',
    code: 'ARC-01',
    title: 'The Cast-Iron Bukhari & River-Stone Thermal Mass',
    subtitle: 'Sub-Zero Radiant Heat Banking & Gravity-Draft Flues',
    archetype: 'Thermal Earth & Cast Metallurgy',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85',
    elevationRange: '1,800m – 3,800m',
    thermalRating: '14-Hour Heat Banking Post-Burn',
    seismicIndex: 'Class 4 Anchored Masonry Base',
    craftLineage: 'Sherpa, Lepcha & Tibetan Hearth-Smithing Lineage',
    overview:
      'A high-altitude mountain sanctuary is defined by its thermal core. The Himalayan Bukhari pairs a hand-hammered cast iron firebox with an interlocking 350kg river-granite thermal bank. Instead of burning firewood rapidly into an open chimney, a double-wall gravity air baffle redirects superheated draft through serpentine stone flues, soaking the masonry with latent heat that radiantly sustains lofts throughout freezing winter nights without drafts.',
    materials: [
      {
        name: 'Teesta River Granite Slabs',
        source: 'Hand-chiseled from non-riverbed gravel scree',
        percentage: 45,
        role: 'Thermal storage battery; absorbs & radiantly discharges heat over 14 hours'
      },
      {
        name: 'Reclaimed Hammered Cast Iron',
        source: 'Forged by artisanal valley blacksmiths',
        percentage: 30,
        role: 'Combustion firebox core & rapid radiant warming surface'
      },
      {
        name: 'Refractory Red River Silt & Husk',
        source: 'High-plasticity valley river beds',
        percentage: 25,
        role: 'Flexible heat-expansion mortar preventing masonry cracks'
      }
    ],
    engineeringPrinciples: [
      {
        label: 'Gravity-Draft Sub-Floor Induction',
        detail:
          'Pre-warmed intake air drawn from sub-floor crawlspaces prevents cold floor drafts while maximizing internal combustion efficiency by 48%.'
      },
      {
        label: 'Passive Latent Thermal Radiance',
        detail:
          'The stone core reaches 78°C during evening firewood burn and gently steps down to 24°C over 14 hours, maintaining an even bedroom temperature until dawn.'
      },
      {
        label: 'Spark-Arrestor Forest Safety',
        detail:
          'Triple-screened copper arrestor cap on the chimney exhaust prevents hot ember sparks from escaping into flammable pine and deodar canopies.'
      }
    ],
    ecologicalProtection:
      'Consumes 60% less firewood than open fireplaces, burning exclusively seasoned fallen branches and dried pinecones to preserve high-altitude virgin forests.',
    quote: {
      text:
        'A mountain stone never forgets the warmth of the fire. When the snow wind screams over Ghoom ridge at midnight, the river stone keeps your floor warm until morning prayer.',
      author: 'Karma Tenzing Bhutia',
      craftTitle: 'Master Hearth Mason (4th Generation)',
      location: 'Lebong Ridge, Darjeeling'
    }
  },
  {
    id: 'specimen-dhajji-dewari',
    code: 'ARC-02',
    title: 'Dhajji-Dewari & Woven Ikra Wood Lofts',
    subtitle: 'Seismic-Elastic Timber Lattice & Breathable Mud Plaster',
    archetype: 'Vernacular Timber & Bamboo Wattle',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    elevationRange: '1,200m – 2,600m',
    thermalRating: 'Constant 52% Relative Humidity Equilibrium',
    seismicIndex: 'Grade-9 Shear Vibration Dissipation',
    craftLineage: 'Himalayan Joinery Guilds & Lepcha Bamboo Weavers',
    overview:
      'Developed over four centuries along the Himalayan collision fault line, Dhajji-Dewari architecture utilizes mortise-and-tenon cedar frames subdivided into small diagonal bays. Infilled with hand-woven bamboo wattle (Ikra) and coated with aged lime-mud plaster, the entire building acts like an elastic wicker basket during tectonic tremor—swaying and absorbing kinetic energy without brittle fracture.',
    materials: [
      {
        name: 'Reclaimed Himalayan Cedar / Deodar',
        source: 'Hand-adzed from dismantled heritage colonial tea bungalows',
        percentage: 40,
        role: 'Interlocking structural seismic timber frame with natural insect resistance'
      },
      {
        name: 'Split Bamboo Wattle (Ikra)',
        source: 'Regeneratively harvested valley bamboo forests',
        percentage: 25,
        role: 'Tensile lattice infill that flexes without breaking during earth tremors'
      },
      {
        name: 'Slaked Oyster Lime (Chuna) & Clay',
        source: 'Traditional artisan wood-fired lime pits',
        percentage: 25,
        role: 'Breathable hygroscopic wall coat preventing mold in 90% monsoon humidity'
      },
      {
        name: 'Fermented Barley Straw',
        source: 'Highland organic crop byproduct',
        percentage: 10,
        role: 'Natural tensile fiber binding mud plaster without cement'
      }
    ],
    engineeringPrinciples: [
      {
        label: 'Ductile Energy Dissipation',
        detail:
          'Tightly mortised wooden peg joints allow timber bays to dissipate ground shear waves, preventing structural collapse during seismic events.'
      },
      {
        label: 'Hygroscopic Humidity Buffering',
        detail:
          'Mud-plaster walls naturally absorb up to 1.8 liters of airborne moisture per square meter during the wet monsoon, releasing it gradually during dry autumn months.'
      },
      {
        label: 'Acoustic Rainfall Dampening',
        detail:
          'The organic bamboo-straw-clay sandwich dampens torrential cloudburst rainfall from 85dB down to a gentle 38dB interior whisper.'
      }
    ],
    ecologicalProtection:
      '100% biodegradable and zero embodied carbon. Timbers are salvaged across three generations, and dismantled walls decompose naturally into fertile loam.',
    quote: {
      text:
        'Modern concrete is proud and snaps in an earthquake. Cedar and bamboo are humble—they bow to the mountain, dance with the ground, and stay standing for grandchildren.',
      author: 'Dawa Tshering Lepcha',
      craftTitle: 'Indigenous Timber Guild Elder',
      location: 'Pedong Hills, Kalimpong'
    }
  }
]

export const DEV_PREVIEW_PRICE_INDEX: PriceIndexItem[] = [
  {
    id: 'price-sumo-darjeeling',
    category: 'transit',
    item: 'Siliguri ⇄ Darjeeling Ridge',
    routeOrOrigin: 'Hill Cart Rd via Kurseong (NJP Stand)',
    primaryRate: '₹350',
    rateUnit: '/ seat',
    secondaryRate: '₹2,800',
    secondaryLabel: 'Private Cab',
    stabilityScore: 98.4,
    trendStatus: 'stable',
    trendSummary: 'Flat Union Rate (5-Mo Verified)',
    monthlyHistory: [
      { month: 'Oct', rate: 350 },
      { month: 'Nov', rate: 350 },
      { month: 'Dec', rate: 380 },
      { month: 'Jan', rate: 350 },
      { month: 'Feb', rate: 350 }
    ],
    lastVerified: 'Feb 2026',
    verifiedBy: 'Darjeeling District Motor Transport Syndicate',
    notes: 'Official union ticket counter; standard rucksacks under 25kg included'
  },
  {
    id: 'price-sumo-kalimpong',
    category: 'transit',
    item: 'Siliguri ⇄ Kalimpong Ridge',
    routeOrOrigin: 'NH-10 via Teesta Bazaar (Sevoke Stand)',
    primaryRate: '₹300',
    rateUnit: '/ seat',
    secondaryRate: '₹2,400',
    secondaryLabel: 'Private Cab',
    stabilityScore: 97.2,
    trendStatus: 'stable',
    trendSummary: 'Fixed Corridor Rate (5-Mo Verified)',
    monthlyHistory: [
      { month: 'Oct', rate: 300 },
      { month: 'Nov', rate: 300 },
      { month: 'Dec', rate: 320 },
      { month: 'Jan', rate: 300 },
      { month: 'Feb', rate: 300 }
    ],
    lastVerified: 'Feb 2026',
    verifiedBy: 'Kalimpong Drivers Welfare Association',
    notes: 'Departs every 25 mins from Sevoke Road junction stand'
  },
  {
    id: 'price-tea-first-flush',
    category: 'farmgate',
    item: 'Organic First Flush Tea (Spring)',
    routeOrOrigin: 'Makaibari & Happy Valley Cooperatives',
    primaryRate: '₹1,850',
    rateUnit: '/ kg',
    secondaryRate: '₹4,200',
    secondaryLabel: 'Commercial Retail',
    stabilityScore: 99.1,
    trendStatus: 'fair_fixed',
    trendSummary: 'Direct Cooperative Farmgate Index',
    monthlyHistory: [
      { month: 'Oct', rate: 1800 },
      { month: 'Nov', rate: 1850 },
      { month: 'Dec', rate: 1850 },
      { month: 'Jan', rate: 1850 },
      { month: 'Feb', rate: 1850 }
    ],
    lastVerified: 'Feb 2026',
    verifiedBy: 'Darjeeling Organic Tea Workers Collective',
    notes: 'Hand-plucked tender two leaves & a bud; vacuum sealed at estate'
  },
  {
    id: 'price-cardamom-badi-elaichi',
    category: 'farmgate',
    item: 'Large Organic Cardamom (Badi Elaichi)',
    routeOrOrigin: 'Yuksom & Dzongu Valley Growers',
    primaryRate: '₹1,420',
    rateUnit: '/ kg',
    secondaryRate: '₹2,600',
    secondaryLabel: 'Urban Retail',
    stabilityScore: 95.8,
    trendStatus: 'slight_fluctuation',
    trendSummary: 'Winter Cured Harvest Index',
    monthlyHistory: [
      { month: 'Oct', rate: 1380 },
      { month: 'Nov', rate: 1400 },
      { month: 'Dec', rate: 1420 },
      { month: 'Jan', rate: 1420 },
      { month: 'Feb', rate: 1420 }
    ],
    lastVerified: 'Feb 2026',
    verifiedBy: 'Sikkim Organic Mission Growers Guild',
    notes: 'Woodsmoke kiln-cured jumbo pods direct from indigenous growers'
  }
]
