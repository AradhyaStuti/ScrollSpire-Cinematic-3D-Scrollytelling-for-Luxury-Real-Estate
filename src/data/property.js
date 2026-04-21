// Mock data shaped to the Sanity `property` schema in the original build
// guide. In prod, swap this for client.fetch(propertyQuery).

export const property = {
  name: 'Kohinoor Heights',
  tagline: 'A mountain of light, above the Arabian skyline.',
  location: 'Worli Sea Face · Mumbai',
  state: 'Maharashtra · India',
  floors: 48,
  residences: 12,
  residencesAvailable: 8,
  priceFrom: '₹32 Cr',
  handover: 'Handover · Q4 2027',
  reraNumber: 'P51900 12345',
  timezone: 'Asia/Kolkata',
  credits: {
    developer: 'Aurelia Urban Projects',
    architect: 'Rahul Mehrotra Associates',
    interiors: 'Hirsch Bedner · Mumbai',
    landscape: 'Kishore Pradhan Studio'
  },
  testimonial: {
    quote:
      'It is not a tower. It is an address — the way a paragraph is not a novel.',
    author: 'Architectural Digest · India'
  },
  ctaHeadline: 'Claim Your Address.',
  contactEmail: 'concierge@kohinoorheights.in',
  contactPhone: '+91 22 6190 2200',
  videoPoster:
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1920&q=70',
  heroImage:
    'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=1920&q=70',
  lifestyleImage:
    'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1920&q=70',
  amenities: [
    {
      title: 'Aakash Sky Pool',
      subtitle: 'The Sky Pool',
      description:
        'A 38th-floor cantilevered pool suspended over Worli Bay — 42 metres of glass-edged water engineered to meet the horizon.',
      metric: 42,
      metricUnit: 'm',
      metricLabel: 'Edge length',
      image:
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=70'
    },
    {
      title: 'The Durbar Lobby',
      subtitle: 'The Royal Court',
      description:
        'Carved Makrana marble, hand-chased brass latticework, and a twelve-metre ceiling — received by a full-time concierge.',
      metric: 12,
      metricUnit: 'm',
      metricLabel: 'Ceiling height',
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=70'
    },
    {
      title: 'Chhatri Penthouse',
      subtitle: 'The Crown Residence',
      description:
        'A single sky-villa crowns the tower. Private lift, rooftop garden, and a gilded pavilion opening to the Arabian Sea.',
      metric: 1,
      metricUnit: 'of 1',
      metricLabel: 'Residence',
      image:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=70'
    },
    {
      title: 'Ayur Sanctuary',
      subtitle: 'The Wellness Floor',
      description:
        'Ayurvedic treatment suites, marble hammam, yoga shala, and a private steam pavilion — reserved for residents only.',
      metric: 24,
      metricUnit: '/7',
      metricLabel: 'Access',
      image:
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=70'
    }
  ],
  materials: [
    {
      name: 'Makrana Marble',
      origin: 'Rajasthan',
      note: 'The same quarry as the Taj Mahal — hand-selected for veining.',
      image:
        'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&w=800&q=70'
    },
    {
      name: 'Burma Teak',
      origin: 'Myanmar',
      note: 'Air-dried, hand-oiled. Floors that darken with time, not wear.',
      image:
        'https://images.unsplash.com/photo-1604709177225-055f99402ea3?auto=format&fit=crop&w=800&q=70'
    }
  ]
}
