// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Airport Transfer Data
// ══════════════════════════════════════════════

const AIRPORT_LOCATIONS = [
  {
    id: 'DXB',
    name: 'Dubai International Airport',
    code: 'DXB',
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 3'],
    image: 'https://images.unsplash.com/photo-1583418855671-5fef7a6e97a3?w=800&q=80',
    location: 'Garhoud, Dubai',
  },
  {
    id: 'DWC',
    name: 'Al Maktoum International Airport',
    code: 'DWC',
    terminals: ['Terminal 1'],
    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
    location: 'Jebel Ali, Dubai',
  },
  {
    id: 'AUH',
    name: 'Abu Dhabi International Airport',
    code: 'AUH',
    terminals: ['Terminal A', 'Terminal 1'],
    image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=800&q=80',
    location: 'Abu Dhabi',
  },
  {
    id: 'SHJ',
    name: 'Sharjah International Airport',
    code: 'SHJ',
    terminals: ['Terminal 1'],
    image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80',
    location: 'Sharjah',
  },
];

const POPULAR_LOCATIONS = [
  { id: 'LOC-001', name: 'Downtown Dubai', area: 'Dubai', landmark: 'Near Burj Khalifa' },
  { id: 'LOC-002', name: 'Dubai Marina', area: 'Dubai', landmark: 'Marina Walk' },
  { id: 'LOC-003', name: 'Palm Jumeirah', area: 'Dubai', landmark: 'Palm Gateway' },
  { id: 'LOC-004', name: 'DIFC', area: 'Dubai', landmark: 'Gate Avenue' },
  { id: 'LOC-005', name: 'Jumeirah Beach', area: 'Dubai', landmark: 'JBR Walk' },
  { id: 'LOC-006', name: 'Business Bay', area: 'Dubai', landmark: 'Bay Square' },
  { id: 'LOC-007', name: 'Al Barsha', area: 'Dubai', landmark: 'Mall of the Emirates' },
  { id: 'LOC-008', name: 'Deira', area: 'Dubai', landmark: 'Deira City Centre' },
  { id: 'LOC-009', name: 'Abu Dhabi Corniche', area: 'Abu Dhabi', landmark: 'Corniche Road' },
  { id: 'LOC-010', name: 'Yas Island', area: 'Abu Dhabi', landmark: 'Yas Mall' },
  { id: 'LOC-011', name: 'Saadiyat Island', area: 'Abu Dhabi', landmark: 'Louvre Abu Dhabi' },
  { id: 'LOC-012', name: 'Sharjah City Centre', area: 'Sharjah', landmark: 'Al Wahda Street' },
];

const VEHICLE_TYPES = [
  {
    id: 'sedan',
    name: 'Executive Sedan',
    description: 'Mercedes E-Class or similar',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
    maxPassengers: 3,
    maxBags: 3,
    babySeatAvailable: true,
    basePrice: 250,
    minTier: 'platinum',
    features: ['WiFi', 'Water', 'Newspaper', 'USB Charging'],
  },
  {
    id: 'suv',
    name: 'Premium SUV',
    description: 'Range Rover or similar',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    maxPassengers: 5,
    maxBags: 5,
    babySeatAvailable: true,
    basePrice: 400,
    minTier: 'infinite',
    features: ['WiFi', 'Water', 'Newspaper', 'USB Charging', 'Extra Legroom'],
  },
  {
    id: 'luxury',
    name: 'Luxury Limousine',
    description: 'Mercedes S-Class or similar',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afe?w=800&q=80',
    maxPassengers: 3,
    maxBags: 3,
    babySeatAvailable: false,
    basePrice: 600,
    minTier: 'private',
    features: ['WiFi', 'Champagne', 'Premium Snacks', 'USB Charging', 'Privacy Partition'],
  },
];

const AIRPORT_TIME_SLOTS = [
  '00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30',
  '04:00','04:30','05:00','05:30','06:00','06:30','07:00','07:30',
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30',
  '20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30',
];

window.AIRPORT_LOCATIONS = AIRPORT_LOCATIONS;
window.POPULAR_LOCATIONS = POPULAR_LOCATIONS;
window.VEHICLE_TYPES = VEHICLE_TYPES;
window.AIRPORT_TIME_SLOTS = AIRPORT_TIME_SLOTS;
