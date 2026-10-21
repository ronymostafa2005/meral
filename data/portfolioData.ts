import { AwardItem, CapabilityItem, Project } from '../types/portfolio';

export const PROJECTS: Project[] = [
  {
    id: 'rise-tower',
    slug: 'rise-tower',
    title: 'Rise Tower',
    client: 'Rise Tower Developments',
    year: '2026',
    category: 'Campaign Design',
    tags: ['ART DIRECTION', 'CAMPAIGN', 'EDITORIAL', 'REAL ESTATE'],
    headline: 'The obvious is everywhere. We chose otherwise.',
    summary: 'A campaign system for Rise Tower Developments. Editorial layouts, lifestyle frames, and a quiet navy-and-gold voice that treats the tower as a way of living, not a unit listing.',
    challenge: 'The development needed a campaign that felt considered and calm, without the usual render-and-price language of real estate advertising.',
    solution: 'Meral built a serial visual system: manifesto lines, botanical stills, portrait crops, and a repeating vertical wordmark that holds the campaign together across print and social.',
    results: [
      'Six-piece campaign set',
      'Consistent art direction across manifesto, lifestyle, and development frames',
      'A recognizable Rise Tower voice: quiet, precise, and editorial'
    ],
    coverImage: '/work/rise-1.jpg',
    galleryImages: [
      '/work/rise-1.jpg',
      '/work/rise-2.jpg',
      '/work/rise-3.jpg',
      '/work/rise-4.jpg',
      '/work/rise-5.jpg',
      '/work/rise-6.jpg'
    ],
    featured: true,
    accentColor: '#0E2A33',
    role: ['Art Direction', 'Campaign Design', 'Editorial Layout']
  },
  {
    id: 'pyramids-city',
    slug: 'pyramids-city',
    title: 'Pyramids City',
    client: 'Lux Realty',
    year: '2026',
    category: 'Campaign Design',
    tags: ['CAMPAIGN', 'REAL ESTATE', 'KEY VISUAL'],
    headline: 'In front of the New Capital gates. Ahead of the curve.',
    summary: 'Launch key visual for Pyramids City, placing the development in front of the New Capital gates and leading with the investment line rather than a feature list.',
    challenge: 'A large mixed-use development needed one image that could carry location, ambition, and the entry offer at the same time.',
    solution: 'A dusk architectural frame with a clear typographic stack: project name, location, the 152-acre position, and a 2M down-payment line kept in one reading order.',
    results: [
      'Single key visual for launch',
      'Location and offer readable without a second caption',
      'Lux Realty mark held as a quiet signature, not a stamp'
    ],
    coverImage: '/work/pyramids.jpg',
    galleryImages: ['/work/pyramids.jpg'],
    featured: true,
    accentColor: '#1E3A5F',
    role: ['Art Direction', 'Key Visual', 'Typography']
  },
  {
    id: 'taj-tower-2',
    slug: 'taj-tower-2',
    title: 'Taj Tower 2',
    client: 'Lux Realty',
    year: '2026',
    category: 'Campaign Design',
    tags: ['CAMPAIGN', 'ARCHITECTURE', 'NIGHT VISUAL'],
    headline: 'Where business rises above the city.',
    summary: 'Night campaign for Taj Tower 2. The tower is the subject, and the copy moves from office floors to sky restaurants without crowding the architecture.',
    challenge: 'A commercial tower campaign had to feel elevated while still explaining what the building is for.',
    solution: 'A centered night elevation, light trails at street level, and two short text columns: one for the line “not just where, but why there,” and one for the business story.',
    results: [
      'Night key visual built around the tower elevation',
      'Copy split so the architecture stays open',
      'A campaign line that can travel to other Lux Realty work'
    ],
    coverImage: '/work/taj-tower.jpg',
    galleryImages: ['/work/taj-tower.jpg'],
    featured: true,
    accentColor: '#0B1F3A',
    role: ['Art Direction', 'Campaign Design']
  },
  {
    id: 'village-de-la-capital',
    slug: 'village-de-la-capital',
    title: 'Village de la Capital',
    client: 'Lux Realty',
    year: '2026',
    category: 'Campaign Design',
    tags: ['RESIDENTIAL', 'CAMPAIGN', 'LIFESTYLE'],
    headline: '290 acres of balanced living.',
    summary: 'Residential campaign for Village de la Capital. Stone villas, landscape, and a payment structure presented as a way to start living, not as a rate card.',
    challenge: 'The offer — 1.5% down and a 12-year structure — had to sit inside a lifestyle image without turning the poster into a brochure.',
    solution: 'A bright daylight composition with the villa as the base and the commercial lines set in a small, even stack under the project name.',
    results: [
      'Lifestyle key visual for the residential launch',
      'Payment terms kept secondary to the place',
      'A calm typographic hierarchy on a bright sky'
    ],
    coverImage: '/work/village.jpg',
    galleryImages: ['/work/village.jpg'],
    featured: true,
    accentColor: '#C4A574',
    role: ['Art Direction', 'Campaign Design']
  },
  {
    id: 'silver-sands',
    slug: 'silver-sands',
    title: 'Silver Sands',
    client: 'Lux Realty',
    year: '2026',
    category: 'Campaign Design',
    tags: ['HOSPITALITY', 'CAMPAIGN', 'COASTAL'],
    headline: 'Not a unit — an end-to-end experience.',
    summary: 'Coastal campaign for Silver Sands. The pool, palms, and cabanas carry the picture. The name sits in the water, and the 5% entry line stays in the corner.',
    challenge: 'A resort-style development needed to feel exclusive without listing specifications as the hero.',
    solution: 'The photograph does the selling. Typography is limited to the project name, one experience line, and a short note that high-end specs are the standard.',
    results: [
      'Coastal key visual led by atmosphere',
      'Offer reduced to one readable line',
      'Name placed inside the image, not on a banner'
    ],
    coverImage: '/work/silver-sands.jpg',
    galleryImages: ['/work/silver-sands.jpg'],
    featured: true,
    accentColor: '#8A7048',
    role: ['Art Direction', 'Campaign Design']
  },
  {
    id: 'lux-realty-voice',
    slug: 'lux-realty-voice',
    title: 'Lux Realty — Brand Voice',
    client: 'Lux Realty',
    year: '2026',
    category: 'Brand Voice',
    tags: ['BRAND VOICE', 'EDITORIAL', 'PRINT', 'SOCIAL'],
    headline: 'What you don’t see in the market matters more than what you do.',
    summary: 'The verbal and visual system behind the Lux Realty campaigns: manifesto posters, a printed note, and a still life that positions the practice as consulting, not brokerage.',
    challenge: 'The brand needed a point of view that could sit beside property campaigns without repeating floor plans and prices.',
    solution: 'Four pieces share one voice. A gold manifesto, a stone editorial grid, a printed sheet, and a brass-handle still life each carry a single sentence and the Lux Realty mark.',
    results: [
      'Four-piece brand voice set',
      'One line of thinking used across poster, print, and object',
      'The consultancy position stated without a sales layout'
    ],
    coverImage: '/work/unseen.jpg',
    galleryImages: [
      '/work/unseen.jpg',
      '/work/clarity.jpg',
      '/work/beyond.jpg',
      '/work/investment.jpg'
    ],
    featured: true,
    accentColor: '#A6843D',
    role: ['Brand Voice', 'Art Direction', 'Print & Social']
  }
];

export const CAPABILITIES: CapabilityItem[] = [
  {
    number: '01',
    title: 'Art Direction',
    description: 'The frame, the crop, and the decision of what stays out. Campaigns are directed so the place is felt before it is explained.',
    tags: ['Key Visuals', 'Photography Direction', 'Color', 'Composition', 'Series Design']
  },
  {
    number: '02',
    title: 'Campaign Design',
    description: 'Posters, social frames, and launch visuals for developments. One hierarchy, one offer, and enough quiet for the architecture.',
    tags: ['Real Estate Campaigns', 'Launch Visuals', 'Social Crops', 'Offer Hierarchy', 'Night & Day Systems']
  },
  {
    number: '03',
    title: 'Brand Voice',
    description: 'Lines that can live on a poster and in a brochure. Short, specific, and written to be read once.',
    tags: ['Manifesto Lines', 'Naming Support', 'Tone', 'Editorial Captions', 'Brand Marks in Use']
  },
  {
    number: '04',
    title: 'Print & Editorial',
    description: 'Sheets, grids, and object stills for a brand that needs to exist off the screen as well as on it.',
    tags: ['Print Layout', 'Editorial Grids', 'Still Life', 'Type Systems', 'Campaign Extensions']
  }
];

export const AWARDS: AwardItem[] = [
  {
    id: 'rise',
    title: 'Rise Tower',
    platform: 'Campaign',
    type: 'Six-piece editorial system',
    year: '2026'
  },
  {
    id: 'pyramids',
    title: 'Pyramids City',
    platform: 'Launch',
    type: 'Key visual, New Capital',
    year: '2026'
  },
  {
    id: 'taj',
    title: 'Taj Tower 2',
    platform: 'Campaign',
    type: 'Night architectural visual',
    year: '2026'
  },
  {
    id: 'village',
    title: 'Village de la Capital',
    platform: 'Residential',
    type: 'Lifestyle and offer',
    year: '2026'
  },
  {
    id: 'sands',
    title: 'Silver Sands',
    platform: 'Coastal',
    type: 'Experience-led visual',
    year: '2026'
  },
  {
    id: 'lux',
    title: 'Lux Realty Voice',
    platform: 'Brand',
    type: 'Poster, print, and still life',
    year: '2026'
  }
];

export const STUDIO_STATS = [
  { value: '06', label: 'CAMPAIGNS IN THIS SELECTION' },
  { value: '02', label: 'BRANDS: LUX REALTY & RISE TOWER' },
  { value: '01', label: 'DESIGNER. MERAL.' },
  { value: '04', label: 'DISCIPLINES, FROM ART DIRECTION TO PRINT' }
];

export const CLIENT_LOGOS = [
  'LUX REALTY',
  'RISE TOWER',
  'PYRAMIDS CITY',
  'TAJ TOWER 2',
  'VILLAGE DE LA CAPITAL',
  'SILVER SANDS'
];
