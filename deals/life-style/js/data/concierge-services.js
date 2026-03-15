// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Concierge Services Data
// ══════════════════════════════════════════════

const CONCIERGE_SERVICE_TYPES = [
  {
    id: 'golf',
    name: 'Golf Access',
    description: 'Tee off at prestigious golf courses across the UAE with complimentary green fees',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600&h=400&fit=crop',
    turnaround: '24 hours',
    minTier: 'platinum',
    features: ['Premium Courses', 'Green Fees Included', 'Buggy & Equipment'],
  },
  {
    id: 'club',
    name: 'Club Access',
    description: 'Exclusive entry to luxury lounges and private members clubs',
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop',
    turnaround: '4 hours',
    minTier: 'platinum',
    features: ['Private Lounges', 'Guest Passes', 'Priority Entry'],
  },
  {
    id: 'airport',
    name: 'Airport Pickup & Drop',
    description: 'Complimentary luxury airport transfers with meet & greet service',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&h=400&fit=crop',
    turnaround: '4 hours',
    minTier: 'platinum',
    features: ['Luxury Vehicles', 'Meet & Greet', 'Flight Tracking'],
  },
  {
    id: 'courier',
    name: 'Local Courier',
    description: 'Same-day courier service for documents and parcels across the UAE',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
    turnaround: '2 hours',
    minTier: 'platinum',
    features: ['Same-Day Delivery', 'Tracked Service', 'Insured Parcels'],
  },
  {
    id: 'restaurant',
    name: 'Restaurant Reservations',
    description: 'Priority seating at the UAE\'s most exclusive restaurants',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    turnaround: '4 hours',
    minTier: 'platinum',
    features: ['Priority Seating', 'Chef\'s Table', 'Special Occasion Setup'],
  },
  {
    id: 'events',
    name: 'Event & Ticket Procurement',
    description: 'VIP access and tickets to sold-out events and premieres',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
    turnaround: '24 hours',
    minTier: 'platinum',
    features: ['VIP Seats', 'Sold-Out Events', 'Backstage Access'],
  },
  {
    id: 'travel',
    name: 'Travel Planning & Itineraries',
    description: 'Custom-crafted luxury travel itineraries and arrangements',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop',
    turnaround: '48 hours',
    minTier: 'infinite',
    features: ['Custom Itineraries', 'Private Transfers', 'Luxury Stays'],
  },
  {
    id: 'gifts',
    name: 'Gift Sourcing & Delivery',
    description: 'Source and deliver luxury gifts with bespoke presentation',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=400&fit=crop',
    turnaround: '24 hours',
    minTier: 'infinite',
    features: ['Luxury Brands', 'Custom Wrapping', 'Same-Day Option'],
  },
  {
    id: 'shopping',
    name: 'Personal Shopping',
    description: 'Private appointments and personal styling consultations',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop',
    turnaround: '24 hours',
    minTier: 'infinite',
    features: ['Private Appointments', 'Style Consultation', 'After-Hours Access'],
  },
  {
    id: 'spa',
    name: 'Spa & Wellness Bookings',
    description: 'Reserve premium spa treatments and wellness packages',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop',
    turnaround: '4 hours',
    minTier: 'platinum',
    features: ['Premium Spas', 'Couples Packages', 'Private Rooms'],
  },
];

const CONCIERGE_TIME_SLOTS = [
  '09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30','14:00','14:30',
  '15:00','15:30','16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30','20:00','20:30','21:00',
];

window.CONCIERGE_SERVICE_TYPES = CONCIERGE_SERVICE_TYPES;
window.CONCIERGE_TIME_SLOTS = CONCIERGE_TIME_SLOTS;
