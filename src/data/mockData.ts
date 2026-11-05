import type { Destination, Dispatch, Job, Homestay, ArchitecturalSpecimen, PriceIndexItem } from '../types'
import { BRAND_CONFIG } from '../config/branding'

export const DESTINATIONS: Destination[] = [
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
      'Perched on an emerald ridge overlooking the silver curves of the Teesta River, Kalimpong breathes a lush, sub-tropical mountain vitality. Renowned for botanical terraced nurseries, heritage stone bungalows, and wild gladioli glades.',
    storyQuote: 'Kalimpong does not rush you. Its days are measured by the opening of cymbidium orchid bells and the quiet birdsong echoing across pine-crested ravines.',
    image: 'https://images.unsplash.com/photo-1626014303757-6466337e7216?auto=format&fit=crop&w=1200&q=85',
    season: 'Year-round, best Oct–May',
    tags: ['Botanical Nurseries', 'Teesta Gorge Terraces', 'Bamboo Crafts', 'Evergreen Slopes'],
    featured: false,
    coordinates: '27.0667° N, 88.4667° E',
    highlights: ['Pine View cactus nursery', 'Morgan House woodland stroll', 'Deolo Hill emerald ridge', 'Zang Dhok Palri monastery']
  },
  {
    id: 'sikkim',
    name: 'Sikkim',
    subtitle: 'Organic Valleys & Sub-Alpine Cardamom Corridors',
    region: 'Eastern Himalaya • Sikkim',
    elevation: '1,650 – 2,850 m',
    description:
      'India’s first 100% organic state. From the sacred mossy chortens of Yuksom to the hidden wild cardamom groves of Dzongu and the rhododendron-rich forests of Ravangla, Sikkim is a lush green corridor of indigenous mountain stewardship.',
    storyQuote: 'In Dzongu, the emerald mountain rivers are ancestral guardians speaking a dialect older than parchment, winding through dense bamboo and wild fern groves.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    season: 'Mar–Jun (Rhododendron Bloom) & Oct–Dec (Crystal Clear)',
    tags: ['Organic Valley Farms', 'Sacred Forest Lakes', 'Dzongu Protected Reserve', 'Wild Cardamom Groves'],
    featured: false,
    coordinates: '27.5330° N, 88.5122° E',
    highlights: ['Khecheopalri wish-fulfilling forest lake', 'Tashiding holy hilltop grove', 'Passingdang Lepcha eco-reserve', 'Ravangla Buddha Park forest trail']
  },
  {
    id: 'dooars',
    name: 'Dooars',
    subtitle: 'Dense Sal Canopies & Sub-Himalayan Riverbeds',
    region: 'Sub-Himalayan Basin • West Bengal',
    elevation: '120 m',
    description:
      'Where mountain streams plunge into endless emerald Sal rainforests and lush green tea estates. A vital biodiversity haven for wild Asian elephants, one-horned rhinos, and quiet riverside stone settlements along the Murti.',
    storyQuote: 'When evening falls along the Murti river, the scent of wet ferns and wild tea blossoms fills the air while herd paths echo deep in the Sal forest.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85',
    season: 'Nov–Apr (Park open season)',
    tags: ['Elephant Corridors', 'Dense Sal Rainforest', 'Murti River Pebble Stays', 'Tea Plantation Borders'],
    featured: false,
    coordinates: '26.7500° N, 89.0000° E',
    highlights: ['Murti riverbank walks', 'Gorumara dense jungle safari', 'Samsing mountain stream hamlet', 'Rocky Island forest river pools']
  }
]

export const COMMUNITY_DISPATCHES: Dispatch[] = [
  {
    id: 'disp-1',
    type: 'price_report',
    title: 'Siliguri to Darjeeling Shared Taxi & Mountain Route Price Index',
    excerpt: 'Verified November 2026 ground rates for shared Tata Sumos, private Scorpio hires, luggage allowances, and fair driver halting norms along Rohini Road.',
    fullContent:
      'Due to ongoing maintenance along Rohini Road and festive season traffic, standard rates have been updated across Siliguri Junction and Tenzing Norgay Bus Stand. A shared seat in a licensed Tata Sumo is strictly ₹350 per passenger (₹400 for front passenger seat). Private hires average ₹2,600 to ₹3,000 depending on vehicle class. Always ask for the driver union printed slip at the counter. Local shared city cabs within Darjeeling from Chowk Bazaar to Ghoom remain steady at ₹30 per head.',
    location: 'Siliguri Junction ⇄ Darjeeling Town',
    date: 'Nov 3, 2026',
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
    date: 'Oct 28, 2026',
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
    date: 'Oct 21, 2026',
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
    date: 'Nov 1, 2026',
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
  },
  {
    id: 'disp-5',
    type: 'trail_note',
    title: 'Singalila Ridge Winter Route Advisory: Sandakphu Water & Permits',
    excerpt: 'Current trail conditions, drinking water collection points between Tumling and Kalipokhri, and mandatory local guide checkpoints.',
    fullContent:
      'All hikers intending to walk the Singalila National Park trail between Manebhanjan, Tonglu, and Sandakphu must note the updated forest department advisory: hiring a certified local guide from the Manebhanjan Guide Association is mandatory. Water is scarce past Gairibas, so ensure a 2-liter capacity and water purification drops. Homestays in Kalipokhri are offering wood-heated water buckets for ₹80.',
    location: 'Manebhanjan ⇄ Sandakphu (3,636m)',
    date: 'Nov 4, 2026',
    readTime: '4 min read',
    author: {
      name: 'Dawa Tamang',
      role: 'Certified Alpine Trekking Guide',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      communityBadge: 'Singalila Alpine Search & Rescue Volunteer'
    },
    verified: true,
    helpfulCount: 168
  }
]

export const MOUNTAIN_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Boutique Tea Estate Operations & Experience Lead',
    employer: 'Glenburn Heritage Tea Sanctuary',
    employerBadge: 'Heritage Organic Enterprise',
    location: 'Kurseong & Rang Dung Valley',
    region: 'Darjeeling Hills, West Bengal',
    type: 'Full-time',
    salary: '₹55,000 – ₹70,000 / month',
    housingIncluded: true,
    category: 'Hospitality & Estates',
    description:
      'Oversee hospitality rituals, organic tea-trail experiences, and culinary storytelling across a 12-suite estate surrounded by 1,000 acres of tea and forest. Coordinate with village cooks and guides while maintaining exacting standards of warm Himalayan hospitality.',
    responsibilities: [
      'Manage day-to-day operations across guest suites, dining rooms, and garden staff.',
      'Curate educational tea tastings, estate cellar tours, and river picnic excursions.',
      'Train younger village hospitality apprentices in international guest protocols and local storytelling.',
      'Supervise sustainable procurement from surrounding organic grower networks.'
    ],
    requirements: [
      'Minimum 3 years in boutique luxury hospitality, wilderness lodges, or estate retreats.',
      'Fluency in English and working comprehension of Hindi or Nepali.',
      'Deep passion for nature, historical architecture, and quiet mountain living.',
      'Strong empathy and collaborative communication with village artisan staff.'
    ],
    benefits: [
      'Independent stone cottage with wood-burning fireplace and panoramic tea valley view.',
      'All meals prepared fresh by the estate chef using organic farm harvest.',
      'Generous paid annual leave, medical coverage, and high-speed satellite work connectivity.'
    ],
    postedDate: '2 days ago'
  },
  {
    id: 'job-2',
    title: 'Alpine Naturalist & Red Panda Corridor Monitor',
    employer: 'Singalila Wilds Conservation Trust',
    employerBadge: 'Ecological NGO',
    location: 'Manebhanjan & Sandakphu Ridge',
    region: 'West Bengal & Sikkim Border (2,200m–3,600m)',
    type: 'Seasonal',
    salary: '₹42,000 – ₹52,000 / month',
    housingIncluded: true,
    category: 'Guiding & Conservation',
    description:
      'Lead respectful small-group wildlife observation walks along the bamboo-oak Singalila ridge while managing camera traps and community patrol networks focused on the endangered Red Panda and high-altitude avifauna.',
    responsibilities: [
      'Conduct ethical birding and wildlife walks for visiting researchers and naturalists.',
      'Maintain 14 sensor cameras along the bamboo-oak corridor and catalog seasonal sightings.',
      'Deliver weekly evening conservation talks to homestay guests in Tumling and Gairibas.',
      'Coordinate with the West Bengal Forest Department on trail integrity.'
    ],
    requirements: [
      'Degree or verifiable fieldwork in Botany, Zoology, Forestry, or Wilderness Guiding.',
      'High level of alpine physical stamina (regular 15km mountain walks at >2,500m).',
      'Knowledge of Himalayan flora, high-canopy bird calls, and weather reading.',
      'First Aid / Wilderness Medical certification (WFA/WAFA preferred).'
    ],
    benefits: [
      'Basecamp accommodation in Manebhanjan with mountain rations and wood heater.',
      'Full technical alpine gear stipend (warm layers, GPS, binoculars).',
      'Direct mentorship under senior Himalayan field biologists.'
    ],
    postedDate: '3 days ago'
  },
  {
    id: 'job-3',
    title: 'Permaculture Farm Manager & Indigenous Seed Banker',
    employer: 'Dzongu Agroecology Initiative',
    employerBadge: 'Community Owned Cooperative',
    location: 'Passingdang, Dzongu Protected Reserve',
    region: 'North Sikkim',
    type: 'Full-time',
    salary: '₹38,000 – ₹48,000 / month',
    housingIncluded: true,
    category: 'Agriculture & Craft',
    description:
      'Help eight village homestays scale their chemical-free terrace polycultures, build compost heating systems, and safeguard indigenous seed varieties of buckwheat, black cardamom, and medicinal ginger.',
    responsibilities: [
      'Design and manage multi-crop rotation plans across 12 acres of village terrace land.',
      'Construct gravity-fed drip irrigation and compost-tea brewing units.',
      'Facilitate hands-on permaculture workshops for resident travellers and local youths.',
      'Catalog indigenous seed bank accessions with botanical descriptions.'
    ],
    requirements: [
      'Demonstrated 2+ years practical farming experience on hillside or terraced ecosystems.',
      'Knowledge of bio-dynamic composting, organic pest management, and seed saving.',
      'Reverence for indigenous Lepcha land ethics and community consensus.',
      'Comfortable with rural mountain isolation and monsoon season rhythms.'
    ],
    benefits: [
      'Traditional wooden farmstay living quarters with organic kitchen pantry.',
      'Local travel stipend for touring Sikkim agro-ecological centers.',
      'Freedom to conduct personal agricultural research and publish findings.'
    ],
    postedDate: '5 days ago'
  },
  {
    id: 'job-4',
    title: 'Himalayan Editorial Fellow & Audio Archive Producer',
    employer: `${BRAND_CONFIG.name} Cultural Fund`,
    employerBadge: 'Platform Initiative',
    location: 'Kalimpong Town & Rural Ridges',
    region: 'Kalimpong District',
    type: 'Residency',
    salary: '₹35,000 – ₹45,000 / month',
    housingIncluded: true,
    category: 'Digital & Remote',
    description:
      'Spend 6 months recording oral histories of mountain guides, master handloom weavers, and tea estate workers across Darjeeling and Kalimpong. Produce quarterly longform editorial dispatches and mini audio documentaries.',
    responsibilities: [
      'Conduct field interviews and audio recordings in rural tea settlements and villages.',
      'Write evocative, fact-checked essays for the Mountain Dispatches platform publication.',
      'Photograph subjects with documentary respect, dignity, and aesthetic sensitivity.',
      'Organize monthly listening salons in local mountain libraries and schools.'
    ],
    requirements: [
      'Portfolio of published writing, investigative journalism, or narrative podcasting.',
      'Proficiency in portable field recording equipment and narrative editing.',
      'Cultural humility and patience when speaking with elder community members.',
      'Conversational Hindi or Bengali; basic Nepali is a tremendous asset.'
    ],
    benefits: [
      'Residency in a quiet hillside cottage with fiber internet and writing study.',
      'Monthly field transport stipend (motorcycle or shared taxi allowances).',
      'Full editorial freedom under the guidance of veteran travel writers.'
    ],
    postedDate: '1 week ago'
  }
]

export const HOMESTAYS: Homestay[] = [
  {
    id: 'stay-1',
    name: 'The Cedar Loft at Rinchenpong',
    region: 'West Sikkim',
    location: 'Rinchenpong Monastery Ridge',
    elevation: '1,890 m',
    monthlyRate: '₹28,500',
    securityDeposit: '₹30,000',
    minLeaseTerm: '3 Months Min',
    leaseStatus: 'Available for Sabbatical Lease',
    furnishing: 'Fully Furnished • Bukhari Fireplace',
    rating: 4.96,
    reviewsCount: 38,
    host: {
      name: 'Norbu & Dechen Bhutia',
      role: 'Organic Honey Cultivators & Estate Stewards',
      yearsHosting: 6,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    },
    roomType: 'Upper Cedar Loft & Solarium overlooking Pine Canopy',
    wifi: '100 Mbps Dedicated Optical Fiber',
    capacity: 'Suitable for 1–2 Resident Creators • 1 King Loft • Work Study',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=85'
    ],
    description:
      'Hand-hewn from reclaimed local cedar and river stone, enveloped by dense moss-hung pine forest and wild rhododendrons. Features a 180° panorama of Mount Pandim over misty valleys, solid-oak writing desk, cast-iron wood heater, and stable optical fiber.',
    amenities: [
      '100 Mbps Dedicated Optical Fiber with UPS Backup',
      'Traditional Bukhari Fireplace with seasoned pine firewood included',
      'Solar-heated mountain spring water on tap',
      'Fully equipped private kitchenette with induction & gas stove',
      'Ergonomic desk and monitor riser for focused writing',
      'Weekly housekeeping & organic garden basket included'
    ],
    features: ['Long-Term Residential Lease', 'Surrounded by Pine Forest', 'Silent Monastic Ridge', 'Inverter Power Backup'],
    utilitiesIncluded: ['High-Speed Fiber Internet', 'Spring Water Supply', 'Firewood Rations', 'Weekly Organic Harvest']
  },
  {
    id: 'stay-2',
    name: 'Observatory Hill Heritage Croft',
    region: 'Darjeeling Hills',
    location: 'Observatory Hill Pine Walk, Darjeeling Town',
    elevation: '2,100 m',
    monthlyRate: '₹36,000',
    securityDeposit: '₹36,000',
    minLeaseTerm: '6 Months Lease',
    leaseStatus: 'Available from Dec 1',
    furnishing: 'Teakwood Heritage Furnished',
    rating: 4.92,
    reviewsCount: 54,
    host: {
      name: 'Dilip & Maya Pradhan',
      role: 'Heritage Restorers & Tea Archivists',
      yearsHosting: 9,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    roomType: 'Heritage Stone Suite with Private Research Library',
    wifi: '120 Mbps Optic Fiber',
    capacity: '1–2 Residents • 1 Master Suite • Formal Library Study',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85'
    ],
    description:
      'Perched high along the quiet, pedestrian-only pine walkway of Observatory Hill. Built in 1912 with Burmese teak floorboards, a brick hearth, and an expansive bay window looking out over rolling green tea hills and cloud valleys.',
    amenities: [
      'Dedicated Work Library overlooking rolling tea ridges',
      'Functional Brick Fireplace with starter wood',
      'Artisanal Single-Estate Darjeeling Tea Bar',
      'Instant Hot Water Geyser & Radiant Room Heater',
      'Private Veranda with Zero Vehicular Noise',
      'Walking Distance (7 mins) to Chowrasta Mall'
    ],
    features: ['Colonial Masonry Architecture', 'Rare Book Collection', 'Pedestrian Heritage Zone', 'Silent Residential Enclave'],
    utilitiesIncluded: ['120 Mbps Optic Fiber', 'Water Purification', 'Trash Collection', 'Tea Station Replenishment']
  },
  {
    id: 'stay-3',
    name: 'The Orchid Terrace at Dr. Graham’s Ridge',
    region: 'Kalimpong Hills',
    location: '8th Mile, Kalimpong Ridge',
    elevation: '1,280 m',
    monthlyRate: '₹24,500',
    securityDeposit: '₹25,000',
    minLeaseTerm: '1–12 Months Flexible',
    leaseStatus: 'Immediate Lease Available',
    furnishing: 'Furnished • Garden Kitchenette',
    rating: 4.89,
    reviewsCount: 29,
    host: {
      name: 'Malati & Anup Chhetri',
      role: 'Horticulturists & Botanical Stewards',
      yearsHosting: 4,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
    },
    roomType: 'Terrace Garden Cottage & Private Veranda',
    wifi: '90 Mbps Fiber Connection',
    capacity: 'Up to 3 Residents • 2 Bedrooms • Dining Solarium',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1626014303757-6466337e7216?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85'
    ],
    description:
      'Sheltered amidst 80+ species of native Himalayan orchids and terraced organic vegetable plots on the mild, sunny southern slope of Kalimpong. Features a private kitchen, sunlit reading terrace facing the verdant Teesta river gorge, and comfortable workspace.',
    amenities: [
      'Panoramic Sunlit Terrace facing Teesta River Valley',
      'Equipped Kitchenette for self-catering living',
      'Fresh organic greens from host garden plots',
      'Stable 90 Mbps WiFi with battery backup',
      'Gated private garden with parking spot',
      'Pet friendly for responsible long-term guests'
    ],
    features: ['Botanical Nursery Setting', 'Mild Year-Round Microclimate', 'Terraced Garden Access', 'Private Cottage Entrance'],
    utilitiesIncluded: ['90 Mbps Internet', 'Vegetable Garden Access', 'Potable Spring Water', 'Parking Space']
  },
  {
    id: 'stay-4',
    name: 'Riverstone Forest Cottage on the Murti',
    region: 'Dooars Foothills',
    location: 'Chalsa & Murti River Bank, Dooars',
    elevation: '140 m',
    monthlyRate: '₹21,000',
    securityDeposit: '₹20,000',
    minLeaseTerm: '3 Months Min',
    leaseStatus: 'Available for Season (Nov–Apr)',
    furnishing: 'Rustic Timber Furnished',
    rating: 4.94,
    reviewsCount: 42,
    host: {
      name: 'Biren & Shanti Roy',
      role: 'Forest Stewards & Wildlife Guides',
      yearsHosting: 7,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    roomType: 'Riverside Stone Bungalow & Screened Veranda',
    wifi: '60 Mbps Fiber + Dual 4G Backup',
    capacity: '1–2 Residents • 1 Bedroom • Riverside Lawn',
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=85'
    ],
    description:
      'Located directly on the pebble embankment of the clean Murti River where the sub-Himalayan Sal forest meets tea plantation borders. Ideal for naturalists, environmental researchers, or remote professionals who want lush forest surroundings and peaceful birdsong.',
    amenities: [
      'Covered Riverfront Veranda with open-air desk',
      'Complimentary trail bicycles for forest village commutes',
      'Private bathroom with hot-water geyser',
      'Dedicated work desk with dual cellular/fiber connectivity',
      'Open stone fire pit for starlit river evenings',
      'Proximity to Gorumara National Park border'
    ],
    features: ['Direct River Pebble Beach', 'Sal Forest Perimeter', 'Zero Highway Noise', 'Naturalist Community'],
    utilitiesIncluded: ['Optic Fiber Connection', 'Electricity & Water', 'Bicycle Maintenance', 'Night Watch Security']
  }
]

export const ARCHITECTURAL_SPECIMENS: ArchitecturalSpecimen[] = [
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
  },
  {
    id: 'specimen-mica-schist-roof',
    code: 'ARC-03',
    title: 'Dry-Stacked Mica Schist & Cantilevered Eaves',
    subtitle: 'Monsoon Deflection & Mortarless Gravity Masonry',
    archetype: 'High-Altitude Lithic Architecture',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    elevationRange: '2,000m – 4,200m',
    thermalRating: '400mm Exterior Cold-Break Wall Barrier',
    seismicIndex: 'Dry-Friction Interlocking Slate Wedges',
    craftLineage: 'Sikkimese & Bhutanese Borderland Stonecrafters (Zowchen)',
    overview:
      'In high mountain ridges where annual monsoon rainfall surpasses 3,200mm, conventional mortar dissolves over decades. Traditional mountain builders dry-stack metamorphic mica schist stones with interlocking granite through-stones. Deep cantilevered cedar eaves project 1.4 meters outward, casting rainwater safely beyond the stone foundation and creating a protected outdoor perimeter gallery.',
    materials: [
      {
        name: 'Hand-Split Mica Schist',
        source: 'Hand-quarried scree beds above agricultural tree lines',
        percentage: 50,
        role: 'Non-porous water-shedding exterior stone envelope'
      },
      {
        name: 'Cedar Cantilevered Corbel Brackets',
        source: 'Seasoned resinous high-altitude deodar heartwood',
        percentage: 30,
        role: 'Projecting roof supports extending eaves 1.4m beyond exterior walls'
      },
      {
        name: 'Wild Beeswax & Pine Resin Sealant',
        source: 'Ethically gathered forest cliff hives',
        percentage: 10,
        role: 'Waterproof organic timber treatment repelling dry rot and termites'
      },
      {
        name: 'River Pebble Drainage Core',
        source: 'Naturally polished river gravel backfill',
        percentage: 10,
        role: 'Internal gravity drainage cavity preventing hydrostatic wall pressure'
      }
    ],
    engineeringPrinciples: [
      {
        label: 'Hydro-Capillary Disruption',
        detail:
          'Because stones are stacked without mortar, water cannot track horizontally via capillary suction; rainfall drops vertically out through gravity weep holes.'
      },
      {
        label: 'Aerodynamic Storm Pitch',
        detail:
          '44-degree roof pitch coupled with the heavy natural ballast of slate shingles prevents hurricane-force ridge winds from lifting structural rafters.'
      },
      {
        label: 'Bioclimatic Thermal Mass',
        detail:
          'The 400mm thick dry stone barrier buffers interior rooms against drastic alpine temperature swings of up to 22°C between noon and midnight.'
      }
    ],
    ecologicalProtection:
      'Quarried exclusively by hand chisels without dynamite blasting, preserving delicate slope equilibrium and preventing micro-fractures in hillside natural springs.',
    quote: {
      text:
        'Every stone has a face that looks to the sky and a foot that rests on the earth. If you find the balance, gravity does the work that cement can never buy.',
      author: 'Norbu Wangdi',
      craftTitle: 'Lithic Architect & Stone Conservator',
      location: 'Yuksom Ridge, West Sikkim'
    }
  },
  {
    id: 'specimen-closed-loop-watershed',
    code: 'ARC-04',
    title: 'Closed-Loop Alpine Watershed & Solar Composting',
    subtitle: 'Sub-Alpine Bio-Gravel Reed Filtration & Zero-Runoff Sanitation',
    archetype: 'Biophilic Sanitation & Water Ecology',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    elevationRange: '1,500m – 4,500m',
    thermalRating: 'Solar Updraft Slate Chimney (Zero Electricity)',
    seismicIndex: 'Flexible Buried Terraced Bio-Chambers',
    craftLineage: 'High-Altitude Monastic Hydrology & Mountain Permaculture',
    overview:
      'Fragile Himalayan slopes cannot withstand underground septic tank leaks, which seep downhill into community drinking water springs (Dharas). Indigenous mountain homestays utilize gravity-stepped volcanic gravel reed beds to cleanse greywater naturally, paired with twin-vault solar composting units that safely convert waste into pathogen-free organic humus for cardamom and orchard groves without electricity.',
    materials: [
      {
        name: 'Crushed Basalt Gravel Substrate',
        source: 'Sustainably graded local mineral byproducts',
        percentage: 35,
        role: 'Step-down microbial bio-filtration matrix purifying domestic greywater'
      },
      {
        name: 'Phragmites Mountain Wetland Reeds',
        source: 'Wild native high-altitude wetland runners',
        percentage: 25,
        role: 'Deep root zone injecting oxygen into substrate and absorbing nitrogen'
      },
      {
        name: 'Thermal Blackened Slate Solar Vents',
        source: 'Sun-absorbing metamorphic black slate',
        percentage: 20,
        role: 'Solar convective updraft chimney driving continuous odorless aeration'
      },
      {
        name: 'Terracotta & Cast Copper Runnels',
        source: 'Artisanal potteries & copper-smith guilds',
        percentage: 20,
        role: 'Antimicrobial gravity channels preventing bio-film clogging'
      }
    ],
    engineeringPrinciples: [
      {
        label: 'Sub-Surface Microbial Digestion',
        detail:
          'Domestic greywater trickles through three stepped gravel terraces where plant root microbes break down soap and organic matter in under 72 hours.'
      },
      {
        label: 'Passive Solar Convective Draft',
        detail:
          'Morning mountain sun warms the black slate chimney, creating a passive negative-pressure air draft that continuously draws fresh air through the compost chamber.'
      },
      {
        label: 'Hermetic Springhead Protection',
        detail:
          'Sealed above-ground dry vault design ensures zero effluent can enter the surrounding mountainside, protecting fragile downslope village aquifers.'
      }
    ],
    ecologicalProtection:
      'Conserves 24,000 liters of pristine mountain spring water per resident annually and generates high-potassium organic compost for organic cardamom groves.',
    quote: {
      text:
        'Water is the blood of the mountain. What leaves our house must be clean enough for the wild deer drinking at the stream below.',
      author: 'Dr. Sangita Pradhan',
      craftTitle: 'Himalayan Watershed Ecologist & Homestay Founder',
      location: 'Takdah Cantonment Forest, Darjeeling'
    }
  }
]

export const PRICE_INDEX_DATA: PriceIndexItem[] = [
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
