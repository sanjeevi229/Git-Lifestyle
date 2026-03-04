// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Configuration
// ══════════════════════════════════════════════

const CONFIG = {
  currency: 'AED',

  categories: [
    { id: 'dining',        label: 'Bon Appetit',   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>', color: '#E85D3A' },
    { id: 'entertainment', label: 'Good Times',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="m10 15 5-3-5-3z"/></svg>', color: '#7C3AED' },
    { id: 'wellness',      label: 'Live Well',     icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', color: '#059669' },
    { id: 'flights',       label: 'Book Flights',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>', color: '#2563EB' },
    { id: 'hotels',        label: 'Book Hotels',   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14"/><path d="M1 21h22"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/><path d="M14 9h1"/><path d="M14 13h1"/><path d="M14 17h1"/></svg>', color: '#0891B2' },
    { id: 'shopping',      label: 'Shop Online',   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>', color: '#DB2777' },
    { id: 'travel',        label: 'Travel Deals',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>', color: '#0D9488' },
    { id: 'events',        label: 'Events',        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/></svg>', color: '#DC2626' },
    { id: 'promotions',    label: 'Promotions',    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1"/></svg>', color: '#EA580C' },
    { id: 'your-card',     label: 'Your Card',     icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>', color: '#475569' },
  ],

  cardTiers: {
    classic:  { label: 'Classic',  level: 1, color: '#6B7280', accent: '#9CA3AF' },
    gold:     { label: 'Gold',     level: 2, color: '#CA8A04', accent: '#FBBF24' },
    platinum: { label: 'Platinum', level: 3, color: '#64748B', accent: '#94A3B8' },
    infinite: { label: 'Infinite', level: 4, color: '#1E293B', accent: '#475569' },
    private:  { label: 'Private',  level: 5, color: '#072447', accent: '#2765FF' },
  },

  bookingStatuses: ['pending', 'confirmed', 'completed', 'cancelled', 'expired'],

  sortOptions: [
    { id: 'recommended', label: 'Recommended for You' },
    { id: 'discount-desc', label: 'Highest Discount' },
    { id: 'expiry-asc', label: 'Ending Soon' },
    { id: 'name-asc', label: 'A — Z' },
  ],

  offerTypes: ['discount', 'bogo', 'cashback', 'complimentary', 'upgrade'],

  cardBenefitIcons: [
    { id: 'golf',       label: 'Golf Access',         icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18v-3"/><path d="M7 21h10"/><path d="M12 3v3"/><circle cx="12" cy="9" r="3"/><path d="M12 12v3"/></svg>' },
    { id: 'club',       label: 'Club Access',          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 10H3"/><path d="M21 6H3"/><path d="M21 14H3"/><path d="M17 18H3"/></svg>' },
    { id: 'airport',    label: 'Airport Pickup/Drop',  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>' },
    { id: 'courier',    label: 'Local Courier',        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>' },
    { id: 'car',        label: 'Car Servicing',        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' },
    { id: 'registration', label: 'Car Registration',   icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>' },
    { id: 'valet',      label: 'Valet Parking',        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17H3v-6l2-4h12l2 4v6h-2"/><path d="M9 17h6"/><path d="M5 7l1-2h12l1 2"/></svg>' },
  ],

  categoryHeroes: {
    dining:        { image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80', video: 'assets/videos/bon-appetit-hero.mp4', tagline: 'Savour exclusive dining privileges at the finest restaurants', sectionTitle: 'Find Your Perfect Table', sectionDesc: 'Filter by cuisine and location to discover your next favourite restaurant' },
    entertainment: { image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80', video: 'assets/videos/good-times.mp4', tagline: 'Unforgettable experiences await with your Demo card', sectionTitle: 'What\'s On Tonight', sectionDesc: 'Browse by category and area to find your ideal entertainment' },
    wellness:      { image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80', tagline: 'Rejuvenate your body and mind with premium wellness offers', sectionTitle: 'Your Wellness Journey', sectionDesc: 'Choose your preferred treatment type and location below' },
    flights:       { image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1200&q=80', tagline: 'Fly to your dream destinations with exclusive card deals', sectionTitle: 'Compare Flight Offers', sectionDesc: 'Browse exclusive airline deals and cashback offers for cardholders' },
    hotels:        { image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', tagline: 'Luxury stays at world-class hotels for less', sectionTitle: 'Find Your Stay', sectionDesc: 'Explore hotel deals and resort packages across popular destinations' },
    shopping:      { image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80', tagline: 'Shop the best brands with exclusive cashback and discounts', sectionTitle: 'Deals Worth Clicking', sectionDesc: 'Browse by brand category to find the best shopping offers' },
    travel:        { image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80', video: 'assets/videos/sea.mp4', tagline: 'Discover handpicked travel deals for cardholders', sectionTitle: 'Plan Your Getaway', sectionDesc: 'Filter by destination type to find your perfect holiday package' },
    events:        { image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80', tagline: 'Get front-row access to the hottest events in town', sectionTitle: 'What\'s Happening', sectionDesc: 'Browse by event type and venue to find something you\'ll love' },
    promotions:    { image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&q=80', tagline: 'Limited-time promotions you don\'t want to miss', sectionTitle: 'Don\'t Miss Out', sectionDesc: 'Grab these time-sensitive offers and seasonal deals before they expire' },
  },

  categorySubcategories: {
    dining: [
      { id: 'Indian',        label: 'Indian',       icon: 'bowlSteam' },
      { id: 'Emirati',       label: 'Emirati',      icon: 'pot' },
      { id: 'International', label: 'International',icon: 'globe' },
      { id: 'Italian',       label: 'Italian',      icon: 'wheat' },
      { id: 'Turkish',       label: 'Turkish',      icon: 'skewer' },
      { id: 'French',        label: 'French',       icon: 'croissant' },
      { id: 'Chinese',       label: 'Chinese',      icon: 'chopsticks' },
      { id: 'Asian Fusion',  label: 'Asian Fusion', icon: 'ramen' },
      { id: 'Japanese',      label: 'Japanese',     icon: 'bento' },
      { id: 'Seafood',       label: 'Seafood',      icon: 'fish' },
      { id: 'Arabic',        label: 'Arabic',       icon: 'flatbread' },
      { id: 'Mediterranean', label: 'Mediterranean',icon: 'olive' },
    ],
    wellness: [
      { id: 'Spa',      label: 'Spa',      icon: 'droplet' },
      { id: 'Fitness',  label: 'Fitness',  icon: 'dumbbell' },
      { id: 'Yoga',     label: 'Yoga',     icon: 'lotus' },
      { id: 'Beauty',   label: 'Beauty',   icon: 'sparkles' },
      { id: 'Pilates',  label: 'Pilates',  icon: 'stretch' },
      { id: 'Massage',  label: 'Massage',  icon: 'handOpen' },
      { id: 'Meditation', label: 'Meditate', icon: 'leaf' },
      { id: 'Nutrition',  label: 'Nutrition',icon: 'apple' },
    ],
    entertainment: [
      { id: 'Cinema',       label: 'Cinema',      icon: 'clapperboard' },
      { id: 'Live Shows',   label: 'Live Shows',  icon: 'theater' },
      { id: 'Theme Parks',  label: 'Theme Parks', icon: 'ferrisWheel' },
      { id: 'Sports',       label: 'Sports',      icon: 'trophy' },
      { id: 'Music',        label: 'Music',       icon: 'music' },
      { id: 'Outdoor',      label: 'Outdoor',     icon: 'mountain' },
      { id: 'Gaming',       label: 'Gaming',      icon: 'gamepad' },
      { id: 'Art',          label: 'Art & Culture',icon: 'palette' },
    ],
    shopping: [
      { id: 'Fashion',      label: 'Fashion',     icon: 'shirt' },
      { id: 'Electronics',  label: 'Electronics', icon: 'smartphone' },
      { id: 'Luxury',       label: 'Luxury',      icon: 'gem' },
      { id: 'Beauty',       label: 'Beauty',      icon: 'wand' },
      { id: 'Jewellery',    label: 'Jewellery',   icon: 'ring' },
      { id: 'Home',         label: 'Home & Living',icon: 'sofa' },
      { id: 'Sports',       label: 'Sports',      icon: 'sneaker' },
      { id: 'Kids',         label: 'Kids',        icon: 'toyBear' },
    ],
    travel: [
      { id: 'Flights',      label: 'Flights',     icon: 'plane' },
      { id: 'Hotels',       label: 'Hotels',      icon: 'home' },
      { id: 'Holidays',     label: 'Holidays',    icon: 'palmTree' },
      { id: 'Cruises',      label: 'Cruises',     icon: 'ship' },
      { id: 'Adventures',   label: 'Adventures',  icon: 'compass' },
      { id: 'Beach',        label: 'Beach',       icon: 'sunrise' },
      { id: 'Camping',      label: 'Camping',     icon: 'tent' },
      { id: 'Visa',         label: 'Visa',        icon: 'passport' },
    ],
    flights: [
      { id: 'Economy',       label: 'Economy',       icon: 'plane' },
      { id: 'Business',      label: 'Business',      icon: 'briefcase' },
      { id: 'First Class',   label: 'First Class',   icon: 'crown' },
      { id: 'Domestic',      label: 'Domestic',       icon: 'home' },
      { id: 'International', label: 'International',  icon: 'globe' },
      { id: 'Weekend',       label: 'Weekend Deals',  icon: 'calendar' },
    ],
    events: [
      { id: 'concert',  label: 'Concerts',      icon: 'music' },
      { id: 'comedy',   label: 'Comedy',         icon: 'mic' },
      { id: 'food',     label: 'Food & Drink',   icon: 'utensils' },
      { id: 'sports',   label: 'Sports',         icon: 'trophy' },
      { id: 'family',   label: 'Family',         icon: 'users' },
      { id: 'cinema',   label: 'Cinema',         icon: 'clapperboard' },
      { id: 'wellness', label: 'Wellness',       icon: 'heart' },
      { id: 'art',      label: 'Art & Culture',  icon: 'palette' },
    ],
  },

  categoryLocations: {
    dining:        ['Downtown Dubai', 'DIFC', 'Jumeirah', 'Palm Jumeirah', 'Al Barsha', 'Dubai Marina', 'Bur Dubai', 'Deira'],
    wellness:      ['Palm Jumeirah', 'Dubai Marina', 'Jumeirah', 'Downtown Dubai', 'Al Barsha', 'Bur Dubai'],
    entertainment: ['Downtown Dubai', 'Al Barsha', 'Jumeirah', 'Dubai Marina', 'Deira', 'Palm Jumeirah'],
    shopping:      ['Downtown Dubai', 'Al Barsha', 'Bur Dubai', 'Deira', 'Dubai Marina', 'Jumeirah'],
    flights:       ['Online', 'Dubai', 'Abu Dhabi', 'Sharjah', 'DXB Terminal 1', 'DXB Terminal 3'],
    travel:        ['Online', 'Palm Jumeirah', 'Dubai Marina', 'Downtown Dubai', 'DIFC', 'Jumeirah'],
    events:        ['Downtown Dubai', 'Jumeirah', 'Palm Jumeirah', 'City Walk', 'Al Quoz', 'Al Barsha', 'Yas Island', 'Al Garhoud'],
    default:       ['Downtown Dubai', 'Jumeirah', 'Al Barsha', 'Bur Dubai', 'Deira', 'DIFC', 'Palm Jumeirah', 'Dubai Marina'],
  },

  curatedCollections: {
    dining: [
      { id: 'nightlife',   label: 'Nightlife',   dealCount: 12, image: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600&q=80' },
      { id: 'fine-dining', label: 'Fine Dining',  dealCount: 14, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80' },
      { id: 'restro-bar',  label: 'Restro bar',   dealCount: 18, image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80' },
      { id: 'iftar',       label: 'Iftar',        dealCount: 28, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80' },
      { id: 'by-the-sea',  label: 'By the sea',   dealCount: 9,  image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&q=80' },
      { id: 'brunch',      label: 'Brunch',       dealCount: 22, image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&q=80' },
    ],
  },

  heroSlides: [
    {
      id: 1,
      title: '{firstName}, Your Card Unlocks More',
      subtitle: 'Exclusive experiences tailored to your Demo card.',
      cta: 'View Benefits',
      route: '/card-benefits',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
      video: 'assets/videos/life-style.mp4',
      videoSD: 'assets/videos/life-style.mp4',
      limitedTag: null,
    },
    {
      id: 2,
      title: '{firstName}, Discover Dining Curated for You',
      subtitle: 'Savor world-class cuisine at the UAE\'s most sought-after restaurants.',
      cta: 'Explore Dining',
      route: '/category/dining',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
      video: 'https://videos.pexels.com/video-files/3769033/3769033-hd_1920_1080_25fps.mp4',
      videoSD: 'https://videos.pexels.com/video-files/3769033/3769033-hd_1280_720_25fps.mp4',
      limitedTag: 'Limited Time',
    },
    {
      id: 3,
      title: '{firstName}, Travel in Style This Season',
      subtitle: 'Special flight and hotel deals for Demo cardholders.',
      cta: 'Book Now',
      route: '/category/travel',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
      video: 'https://videos.pexels.com/video-files/4068182/4068182-hd_1920_1080_30fps.mp4',
      videoSD: 'https://videos.pexels.com/video-files/4068182/4068182-hd_1280_720_30fps.mp4',
      limitedTag: 'Exclusive Offer',
    },
  ],
};

window.CONFIG = CONFIG;
