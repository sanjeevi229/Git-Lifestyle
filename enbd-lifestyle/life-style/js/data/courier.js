// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Local Courier Data
// ══════════════════════════════════════════════

const COURIER_SERVICE_TYPES = [
  {
    id: 'same-day',
    name: 'Same-Day Delivery',
    description: 'Delivered within the same business day',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=400&fit=crop',
    maxWeight: 10,
    basePrice: 75,
    minTier: 'platinum',
    features: ['Tracking', 'SMS Updates', 'Insurance up to AED 1,000'],
  },
  {
    id: 'express',
    name: 'Express 2-Hour',
    description: 'Priority express delivery within 2 hours',
    image: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=600&h=400&fit=crop',
    maxWeight: 15,
    basePrice: 150,
    minTier: 'infinite',
    features: ['Live Tracking', 'SMS + Call Updates', 'Insurance up to AED 5,000', 'Priority Handling'],
  },
  {
    id: 'priority',
    name: 'Priority 1-Hour',
    description: 'Dedicated driver, delivered within 1 hour',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop',
    maxWeight: 25,
    basePrice: 300,
    minTier: 'private',
    features: ['Live Tracking', 'Dedicated Driver', 'Insurance up to AED 10,000', 'White Glove Service', 'Priority Handling'],
  },
];

const COURIER_PACKAGE_TYPES = [
  { id: 'documents',     name: 'Documents',     maxWeight: 1,  description: 'Envelopes, contracts, certificates' },
  { id: 'small-parcel',  name: 'Small Parcel',  maxWeight: 5,  description: 'Up to 30×20×15 cm' },
  { id: 'medium-parcel', name: 'Medium Parcel', maxWeight: 15, description: 'Up to 50×40×30 cm' },
  { id: 'large-parcel',  name: 'Large Parcel',  maxWeight: 25, description: 'Up to 80×60×40 cm' },
];

const COURIER_LOCATIONS = [
  { id: 'CL-001', name: 'Downtown Dubai',        area: 'Dubai',     landmark: 'Near Burj Khalifa' },
  { id: 'CL-002', name: 'Dubai Marina',           area: 'Dubai',     landmark: 'Marina Walk' },
  { id: 'CL-003', name: 'Palm Jumeirah',          area: 'Dubai',     landmark: 'The Pointe' },
  { id: 'CL-004', name: 'DIFC',                   area: 'Dubai',     landmark: 'Gate Avenue' },
  { id: 'CL-005', name: 'JBR',                    area: 'Dubai',     landmark: 'The Walk' },
  { id: 'CL-006', name: 'Business Bay',           area: 'Dubai',     landmark: 'Bay Square' },
  { id: 'CL-007', name: 'Al Barsha',              area: 'Dubai',     landmark: 'Mall of the Emirates' },
  { id: 'CL-008', name: 'Deira',                  area: 'Dubai',     landmark: 'Deira City Centre' },
  { id: 'CL-009', name: 'Abu Dhabi Corniche',     area: 'Abu Dhabi', landmark: 'Corniche Road' },
  { id: 'CL-010', name: 'Yas Island',             area: 'Abu Dhabi', landmark: 'Yas Mall' },
  { id: 'CL-011', name: 'Saadiyat Island',        area: 'Abu Dhabi', landmark: 'Louvre Abu Dhabi' },
  { id: 'CL-012', name: 'Sharjah City Centre',    area: 'Sharjah',   landmark: 'City Centre Sharjah' },
];

const COURIER_TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00',
];

window.COURIER_SERVICE_TYPES = COURIER_SERVICE_TYPES;
window.COURIER_PACKAGE_TYPES = COURIER_PACKAGE_TYPES;
window.COURIER_LOCATIONS = COURIER_LOCATIONS;
window.COURIER_TIME_SLOTS = COURIER_TIME_SLOTS;
