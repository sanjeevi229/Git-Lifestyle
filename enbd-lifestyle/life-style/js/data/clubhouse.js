// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Club House Data
// ══════════════════════════════════════════════

const CLUBHOUSE_CATEGORIES = [
  {
    id: 'beach-resorts',
    name: 'Beach Resorts & Clubs',
    description: 'Exclusive beachfront resorts with private cabanas',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=400&fit=crop',
    maxGuests: 4,
    basePrice: 500,
    minTier: 'platinum',
    features: ['Private Cabana', 'Pool Access', 'Beach Towels', 'Welcome Drinks'],
  },
  {
    id: 'hotel-clubs',
    name: 'Hotel Clubs',
    description: 'Luxury hotel pools, spas & wellness facilities',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    maxGuests: 4,
    basePrice: 350,
    minTier: 'platinum',
    features: ['Pool & Jacuzzi', 'Sauna & Steam', 'Fitness Centre', 'Complimentary Lunch'],
  },
  {
    id: 'fitness-gyms',
    name: 'Fitness & Gyms',
    description: 'World-class fitness centres and personal training',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop',
    maxGuests: 2,
    basePrice: 200,
    minTier: 'infinite',
    features: ['Full Equipment Access', 'Personal Trainer Session', 'Towel & Locker', 'Protein Shake'],
  },
  {
    id: 'water-sports',
    name: 'Water Sports',
    description: 'Kayaking, jet skiing, paddleboarding & more',
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=600&h=400&fit=crop',
    maxGuests: 4,
    basePrice: 450,
    minTier: 'infinite',
    features: ['Equipment Provided', 'Safety Briefing', 'Instructor Included', 'Insurance Covered'],
  },
  {
    id: 'fine-dining',
    name: 'Fine Dining',
    description: 'Exclusive restaurant access with complimentary tasting',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    maxGuests: 6,
    basePrice: 800,
    minTier: 'private',
    features: ['4-Course Tasting Menu', 'Wine Pairing', 'Priority Seating', "Chef's Table Access"],
  },
];

const CLUBHOUSE_VENUES = [
  // Beach Resorts
  { id: 'CV-001', categoryId: 'beach-resorts', name: 'Nikki Beach Resort',      area: 'Pearl Jumeira',   description: 'Bohemian-luxe beach club',       amenities: ['Infinity Pool', 'Beach Bar', 'Cabanas'],           image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop' },
  { id: 'CV-002', categoryId: 'beach-resorts', name: 'Zero Gravity Beach Club', area: 'Dubai Marina',    description: 'Iconic beachfront venue',         amenities: ['Beach Access', 'DJ Pool', 'VIP Lounge'],           image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop' },
  { id: 'CV-003', categoryId: 'beach-resorts', name: 'Twiggy by La Cantine',   area: 'Park Hyatt',      description: 'Mediterranean beach club',        amenities: ['Private Pool', 'Seaside Dining', 'Sunset Lounge'], image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&h=400&fit=crop' },

  // Hotel Clubs
  { id: 'CV-004', categoryId: 'hotel-clubs', name: 'One&Only Royal Mirage',  area: 'Al Sufouh',        description: 'Palatial resort with private beach', amenities: ['Private Beach', 'Spa', 'Gardens'],             image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop' },
  { id: 'CV-005', categoryId: 'hotel-clubs', name: 'Atlantis The Palm',      area: 'Palm Jumeirah',    description: 'Iconic aquatic resort',              amenities: ['Aquaventure', 'Private Beach', 'Marine Habitat'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop' },
  { id: 'CV-006', categoryId: 'hotel-clubs', name: 'Jumeirah Al Naseem',     area: 'Madinat Jumeirah', description: 'Oceanfront luxury resort',            amenities: ['Turtle Lagoon', 'Infinity Pool', 'Wild Wadi Access'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop' },

  // Fitness & Gyms
  { id: 'CV-007', categoryId: 'fitness-gyms', name: 'Warehouse Gym DIFC', area: 'DIFC',         description: 'Industrial-chic premium gym',          amenities: ['CrossFit Zone', 'Olympic Pool', 'Boxing Ring'],  image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&h=400&fit=crop' },
  { id: 'CV-008', categoryId: 'fitness-gyms', name: 'Embody Fitness',     area: 'Business Bay',  description: 'Boutique personal training studio',   amenities: ['PT Sessions', 'Body Scan', 'Nutrition Plan'],    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop' },
  { id: 'CV-009', categoryId: 'fitness-gyms', name: 'GymNation Al Quoz',  area: 'Al Quoz',       description: 'Full-service mega gym',                amenities: ['24/7 Access', 'Group Classes', 'Recovery Zone'], image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&h=400&fit=crop' },

  // Water Sports
  { id: 'CV-010', categoryId: 'water-sports', name: 'SeaYou Watersports',     area: 'JBR',          description: 'Full-range water activities',     amenities: ['Jet Ski', 'Parasailing', 'Flyboarding'],    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop' },
  { id: 'CV-011', categoryId: 'water-sports', name: 'Nemo WaterSports',       area: 'Dubai Marina', description: 'Guided water experiences',        amenities: ['Kayaking', 'Paddleboarding', 'Boat Tour'],  image: 'https://images.unsplash.com/photo-1496318447583-f524534e9ce1?w=600&h=400&fit=crop' },
  { id: 'CV-012', categoryId: 'water-sports', name: 'Al Bateen Watersports',  area: 'Abu Dhabi',    description: 'Capital water adventure hub',     amenities: ['Wake Boarding', 'Scuba Diving', 'Sailing'], image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop' },

  // Fine Dining
  { id: 'CV-013', categoryId: 'fine-dining', name: 'Ossiano',   area: 'Atlantis, The Palm', description: 'Underwater fine dining experience',   amenities: ['Tasting Menu', 'Wine Cellar', 'Aquarium View'],       image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop' },
  { id: 'CV-014', categoryId: 'fine-dining', name: 'ZUMA Dubai', area: 'DIFC',              description: 'Contemporary Japanese izakaya',      amenities: ['Omakase Counter', 'Sake Bar', 'Terrace'],             image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop' },
  { id: 'CV-015', categoryId: 'fine-dining', name: 'Al Mahara',  area: 'Burj Al Arab',      description: 'Iconic seafood restaurant',           amenities: ['Private Aquarium', "Chef's Table", 'Signature Cocktails'], image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600&h=400&fit=crop' },
];

const CLUBHOUSE_TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00',
];

const CLUBHOUSE_PREFERENCE_CHIPS = [
  'Pool Access', 'Spa Access', 'Gym Access', 'Restaurant', 'Beach', 'Private Cabana', 'Kids Area', 'Sunset Session',
];

window.CLUBHOUSE_CATEGORIES = CLUBHOUSE_CATEGORIES;
window.CLUBHOUSE_VENUES = CLUBHOUSE_VENUES;
window.CLUBHOUSE_TIME_SLOTS = CLUBHOUSE_TIME_SLOTS;
window.CLUBHOUSE_PREFERENCE_CHIPS = CLUBHOUSE_PREFERENCE_CHIPS;
