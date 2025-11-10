/**
 * Service data for Cirque Aflame
 * Defines all available entertainment services
 */

export interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string; // lucide icon name
  shortDescription: string;
  fullDescription: string;
  features: string[];
  priceRange: '$$' | '$$$' | '$$$$';
  image: string;
  category: 'fire' | 'aerial' | 'ground' | 'interactive';
  popular: boolean;
  bookingCount?: number;
  gallery?: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const services: Service[] = [
  {
    id: 'fire-performers',
    title: 'Fire Performers',
    slug: 'fire-performers',
    icon: 'Flame',
    shortDescription: 'Mesmerize your guests with breathtaking fire performances featuring fire spinning, eating, and LED props.',
    fullDescription: 'Our professional fire performers bring an unforgettable element of danger and beauty to your event. With years of experience and a spotless safety record, we create stunning visual displays that captivate audiences of all ages. From intimate gatherings to large festivals, our fire acts are fully customizable to your venue and vision.',
    features: [
      'Fire Spinning & Poi',
      'Fire Eating & Breathing',
      'LED Fire Props',
      'Choreographed Routines',
      'Fully Insured',
      'Safety-First Approach'
    ],
    priceRange: '$$$',
    image: '/images/services/fire-performers.jpg',
    category: 'fire',
    popular: true,
    bookingCount: 247,
    gallery: [
      '/images/gallery/fire-1.jpg',
      '/images/gallery/fire-2.jpg',
      '/images/gallery/fire-3.jpg'
    ],
    seo: {
      title: 'Professional Fire Performers Chicago | Cirque Aflame',
      description: 'Book stunning fire performers in Chicago. Fire spinning, fire eating, LED props. Fully insured, professional entertainment for events of all sizes.',
      keywords: ['fire performers chicago', 'fire spinner', 'fire eating', 'fire show', 'fire entertainment']
    }
  },
  {
    id: 'stilt-walkers',
    title: 'Stilt Walkers',
    slug: 'stilt-walkers',
    icon: 'User',
    shortDescription: 'Towering entertainers who interact with crowds, create photo opportunities, and add whimsy to any event.',
    fullDescription: 'Our stilt walkers elevate your event—literally! These larger-than-life performers roam your venue, interact with guests, pose for photos, and create memorable moments. With custom costumes available to match your theme, stilt walkers add a magical, carnival atmosphere perfect for festivals, corporate events, and celebrations.',
    features: [
      'Heights up to 10 feet',
      'Custom Costumes',
      'Crowd Interaction',
      'Photo Opportunities',
      'Indoor & Outdoor',
      'All Ages Entertainment'
    ],
    priceRange: '$$',
    image: '/images/services/stilt-walkers.jpg',
    category: 'ground',
    popular: true,
    bookingCount: 189,
    seo: {
      title: 'Stilt Walkers for Events Chicago | Cirque Aflame',
      description: 'Hire professional stilt walkers for your Chicago event. Custom costumes, crowd interaction, and unforgettable entertainment.',
      keywords: ['stilt walkers chicago', 'stilt performers', 'circus entertainment', 'event entertainment']
    }
  },
  {
    id: 'led-dancers',
    title: 'LED Dancers',
    slug: 'led-dancers',
    icon: 'Sparkles',
    shortDescription: 'Cutting-edge light shows combining dance and technology for dazzling nighttime performances.',
    fullDescription: 'Transform your event into a high-tech spectacle with our LED dancers. Using state-of-the-art LED props, poi, wings, and costumes, these performers create mesmerizing light shows synchronized to music. Perfect for nighttime events, product launches, and concerts, our LED dancers bring a futuristic flair that audiences won\'t forget.',
    features: [
      'LED Poi & Wings',
      'Programmable Light Shows',
      'Music Synchronization',
      'Custom Choreography',
      'Indoor & Outdoor',
      'Battery-Powered (Safe)'
    ],
    priceRange: '$$$',
    image: '/images/services/led-dancers.jpg',
    category: 'fire',
    popular: true,
    bookingCount: 156,
    seo: {
      title: 'LED Dancers & Light Shows Chicago | Cirque Aflame',
      description: 'Book LED dancers for stunning light shows in Chicago. Programmable LED props, custom choreography, perfect for nighttime events.',
      keywords: ['LED dancers chicago', 'light show', 'LED performers', 'glow show', 'LED entertainment']
    }
  },
  {
    id: 'jugglers',
    title: 'Jugglers',
    slug: 'jugglers',
    icon: 'Circle',
    shortDescription: 'Skilled jugglers performing with balls, clubs, rings, and even fire for family-friendly amazement.',
    fullDescription: 'Our jugglers combine technical skill with comedy and audience interaction to create engaging performances for all ages. From classic ball juggling to fire torches and contact juggling, we offer a range of styles to suit your event. Perfect for walkabout entertainment or staged performances.',
    features: [
      'Ball, Club & Ring Juggling',
      'Fire Juggling',
      'Contact Juggling',
      'Comedy Routines',
      'Workshops Available',
      'All Skill Levels'
    ],
    priceRange: '$$',
    image: '/images/services/jugglers.jpg',
    category: 'ground',
    popular: false,
    bookingCount: 98,
    seo: {
      title: 'Professional Jugglers Chicago | Cirque Aflame',
      description: 'Hire skilled jugglers for your Chicago event. Ball juggling, fire juggling, comedy acts, and interactive performances.',
      keywords: ['jugglers chicago', 'juggling show', 'fire juggling', 'circus juggler', 'comedy juggler']
    }
  },
  {
    id: 'aerialists',
    title: 'Aerialists',
    slug: 'aerialists',
    icon: 'Wind',
    shortDescription: 'Gravity-defying aerial acrobatics on silks, lyra, trapeze, and more for breathtaking performances.',
    fullDescription: 'Our aerial artists bring elegance and athleticism to new heights. Performing on aerial silks, lyra (aerial hoop), trapeze, and aerial hammock, these skilled acrobats create stunning visual moments that leave audiences breathless. Perfect for galas, corporate events, and upscale celebrations requiring a touch of sophistication.',
    features: [
      'Aerial Silks',
      'Lyra (Aerial Hoop)',
      'Static Trapeze',
      'Aerial Hammock',
      'Choreographed Performances',
      'Professional Rigging'
    ],
    priceRange: '$$$$',
    image: '/images/services/aerialists.jpg',
    category: 'aerial',
    popular: true,
    bookingCount: 134,
    seo: {
      title: 'Aerial Performers & Aerialists Chicago | Cirque Aflame',
      description: 'Book professional aerialists in Chicago. Aerial silks, lyra, trapeze performances. Fully rigged and insured for elegant events.',
      keywords: ['aerialists chicago', 'aerial silks', 'aerial hoop', 'lyra performer', 'trapeze artist']
    }
  },
  {
    id: 'balloon-artists',
    title: 'Balloon Artists',
    slug: 'balloon-artists',
    icon: 'Heart',
    shortDescription: 'Expert balloon twisters creating intricate sculptures, characters, and decorations for all-ages entertainment.',
    fullDescription: 'Our balloon artists are masters of the craft, creating everything from simple animals to elaborate sculptures and wearable art. Perfect for children\'s parties, family events, and festivals, balloon twisting provides interactive entertainment that guests of all ages enjoy. Fast, friendly, and endlessly creative.',
    features: [
      'Animals & Characters',
      'Elaborate Sculptures',
      'Wearable Balloon Art',
      'Speed Twisting',
      'Custom Requests',
      'Kid-Friendly'
    ],
    priceRange: '$$',
    image: '/images/services/balloon-artists.jpg',
    category: 'interactive',
    popular: false,
    bookingCount: 112,
    seo: {
      title: 'Balloon Twisters & Artists Chicago | Cirque Aflame',
      description: 'Hire balloon artists for your Chicago event. Expert balloon twisting, sculptures, and interactive entertainment for all ages.',
      keywords: ['balloon twisters chicago', 'balloon artists', 'balloon sculptures', 'balloon animals', 'kids entertainment']
    }
  }
];

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(service => service.slug === slug);
};

export const getServicesByCategory = (category: Service['category']): Service[] => {
  return services.filter(service => service.category === category);
};

export const getPopularServices = (): Service[] => {
  return services.filter(service => service.popular);
};

export const getFeaturedServices = (): Service[] => {
  return services
    .sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0))
    .slice(0, 3);
};
