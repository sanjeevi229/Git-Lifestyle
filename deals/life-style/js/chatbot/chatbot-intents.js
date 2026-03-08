// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Chatbot Intent Definitions
// ══════════════════════════════════════════════

const CHAT_INTENTS = [
  // Greetings (highest priority)
  {
    id: 'greeting',
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
               'howdy', 'greetings', 'what\'s up', 'hiya', 'assalam', 'salaam', 'marhaba'],
  },

  // Help
  {
    id: 'help',
    patterns: ['help', 'what can you do', 'how does this work', 'options', 'menu',
               'what do you offer', 'guide me', 'assist me', 'show help'],
  },

  // Booking requests (before category browsing — checked first)
  {
    id: 'book-dining',
    patterns: ['book dining', 'book a table', 'book restaurant', 'reserve a table',
               'reserve dining', 'make a reservation', 'book a restaurant', 'reserve restaurant',
               'book me a table', 'dining reservation', 'restaurant booking',
               'can you book dining', 'book a dinner', 'book lunch', 'book brunch'],
  },
  {
    id: 'book-entertainment',
    patterns: ['book entertainment', 'book a show', 'book tickets', 'book a movie',
               'book cinema', 'book concert', 'get tickets', 'buy tickets',
               'can you book entertainment', 'book an event'],
  },
  {
    id: 'book-hotel',
    patterns: ['book a hotel', 'book hotel', 'book a room', 'reserve a room',
               'reserve hotel', 'hotel booking', 'book accommodation', 'book a stay',
               'can you book hotel', 'book a resort'],
  },
  {
    id: 'book-flight',
    patterns: ['book a flight', 'book flight', 'book flights', 'reserve a flight',
               'flight booking', 'can you book flight', 'book me a flight'],
  },
  {
    id: 'book-wellness',
    patterns: ['book spa', 'book a spa', 'book massage', 'book a massage', 'book yoga',
               'book fitness', 'book wellness', 'book a session', 'spa booking',
               'spa reservation', 'can you book spa', 'can you book wellness',
               'book gym', 'book beauty', 'book pilates'],
  },
  {
    id: 'book-travel',
    patterns: ['book travel', 'book a trip', 'book vacation', 'book a vacation',
               'book holiday', 'book a holiday', 'book getaway', 'book a getaway',
               'book cruise', 'can you book travel', 'plan a trip', 'book a package',
               'travel booking'],
  },
  {
    id: 'book-golf',
    patterns: ['book golf', 'book a golf', 'book tee time', 'book a tee time',
               'book a round', 'golf booking', 'reserve tee time',
               'can you book golf', 'book golf round', 'book a golf round'],
  },
  {
    id: 'book-airport',
    patterns: ['book airport', 'book a transfer', 'book airport transfer', 'book pickup',
               'book a pickup', 'book drop off', 'airport transfer booking',
               'can you book airport', 'book airport ride', 'book limousine',
               'schedule pickup', 'schedule transfer'],
  },
  {
    id: 'book-shopping',
    patterns: ['book shopping', 'shop for me', 'can you shop', 'buy for me',
               'purchase for me', 'order for me', 'shopping assistance',
               'can you book shopping', 'personal shopper'],
  },

  // Dining — nearby (before general dining)
  {
    id: 'dining-nearby',
    patterns: ['restaurant near me', 'dining near me', 'food near me', 'eat nearby',
               'near me dining', 'nearby restaurants', 'deals near me', 'offers near me',
               'close to me', 'in my area', 'near me'],
  },

  // Dining
  {
    id: 'dining',
    patterns: ['dining', 'restaurant', 'food', 'eat', 'dinner', 'lunch', 'brunch',
               'breakfast', 'bon appetit', 'fine dining', 'cuisine',
               'dine', 'top dining', 'dining deals'],
  },

  // Events
  {
    id: 'events',
    patterns: ['events', 'event', 'concert', 'show', 'comedy', 'festival', 'what\'s on',
               'happening', 'tonight', 'this weekend', 'upcoming events', 'tickets', 'live',
               'events this week'],
  },

  // Card Benefits
  {
    id: 'card-benefits',
    patterns: ['benefits', 'card benefits', 'my card', 'privileges', 'perks',
               'what do i get', 'tier', 'infinite card', 'card tier', 'my privileges',
               'my benefits', 'card features', 'card perks'],
  },

  // Golf
  {
    id: 'golf',
    patterns: ['golf', 'tee time', 'green fees', 'golf course', 'golf rounds',
               'golf quota', 'how many golf', 'book golf', 'book a golf'],
  },

  // Airport
  {
    id: 'airport',
    patterns: ['airport', 'airport transfer', 'pickup', 'drop off', 'flight pickup',
               'airport ride', 'airport taxi', 'airport limousine', 'airport booking'],
  },

  // Concierge
  {
    id: 'concierge',
    patterns: ['concierge', 'personal assistant', 'request help', 'arrange something',
               'help me plan', 'arrange', 'reservation assistance', 'request concierge'],
  },

  // Bookings
  {
    id: 'bookings',
    patterns: ['my bookings', 'booking', 'reservations', 'my reservation',
               'scheduled', 'upcoming booking', 'check booking', 'view bookings'],
  },

  // Expiring offers
  {
    id: 'expiring',
    patterns: ['expiring', 'ending soon', 'last chance', 'don\'t miss', 'about to expire',
               'hurry', 'limited time', 'expiring offers'],
  },

  // Premium
  {
    id: 'premium',
    patterns: ['premium', 'exclusive', 'vip', 'special offers', 'premium offers',
               'exclusive deals', 'premium exclusives'],
  },

  // Wellness
  {
    id: 'wellness',
    patterns: ['wellness', 'spa', 'gym', 'fitness', 'yoga', 'massage', 'beauty',
               'live well', 'health', 'pilates', 'meditation', 'wellness & spa'],
  },

  // Shopping
  {
    id: 'shopping',
    patterns: ['shopping', 'shop', 'cashback', 'fashion', 'electronics',
               'luxury', 'brands', 'mall', 'retail', 'store'],
  },

  // Travel
  {
    id: 'travel',
    patterns: ['travel', 'trip', 'vacation', 'holiday', 'flight', 'hotel',
               'destination', 'getaway', 'cruise', 'adventure', 'beach', 'travel deals'],
  },

  // Entertainment
  {
    id: 'entertainment',
    patterns: ['entertainment', 'cinema', 'movie', 'film', 'theme park', 'music',
               'good times', 'fun', 'activities', 'outdoor', 'art gallery'],
  },
];

// ── Welcome Screen Quick Prompts ──
const CHAT_WELCOME_PROMPTS = [
  { label: 'Top dining deals',    query: 'top dining deals' },
  { label: 'Events this week',    query: 'events this week' },
  { label: 'My card benefits',    query: 'my card benefits' },
  { label: 'Travel offers',       query: 'travel deals' },
  { label: 'Restaurants near me', query: 'deals near me' },
  { label: 'Expiring soon',       query: 'expiring offers' },
  { label: 'Premium exclusives',  query: 'premium exclusives' },
  { label: 'Wellness & Spa',      query: 'wellness & spa' },
  { label: 'Book golf',           query: 'book a golf round' },
  { label: 'Airport transfer',    query: 'airport transfer' },
];

window.CHAT_INTENTS = CHAT_INTENTS;
window.CHAT_WELCOME_PROMPTS = CHAT_WELCOME_PROMPTS;
