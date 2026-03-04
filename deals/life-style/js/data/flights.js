// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Flight Data
// ══════════════════════════════════════════════

const FLIGHT_AIRPORTS = [
  { code: 'DXB', city: 'Dubai',      name: 'Dubai International Airport',          country: 'UAE' },
  { code: 'AUH', city: 'Abu Dhabi',  name: 'Zayed International Airport',          country: 'UAE' },
  { code: 'SHJ', city: 'Sharjah',    name: 'Sharjah International Airport',        country: 'UAE' },
  { code: 'LHR', city: 'London',     name: 'Heathrow Airport',                     country: 'UK' },
  { code: 'BOM', city: 'Mumbai',     name: 'Chhatrapati Shivaji Intl Airport',     country: 'India' },
  { code: 'DEL', city: 'Delhi',      name: 'Indira Gandhi Intl Airport',           country: 'India' },
  { code: 'BKK', city: 'Bangkok',    name: 'Suvarnabhumi Airport',                 country: 'Thailand' },
  { code: 'JFK', city: 'New York',   name: 'John F. Kennedy Intl Airport',         country: 'USA' },
  { code: 'SIN', city: 'Singapore',  name: 'Changi Airport',                       country: 'Singapore' },
  { code: 'CDG', city: 'Paris',      name: 'Charles de Gaulle Airport',            country: 'France' },
  { code: 'IST', city: 'Istanbul',   name: 'Istanbul Airport',                     country: 'Turkey' },
  { code: 'MLE', city: 'Malé',       name: 'Velana International Airport',         country: 'Maldives' },
  { code: 'CMB', city: 'Colombo',    name: 'Bandaranaike Intl Airport',            country: 'Sri Lanka' },
  { code: 'CAI', city: 'Cairo',      name: 'Cairo International Airport',          country: 'Egypt' },
  { code: 'MCT', city: 'Muscat',     name: 'Muscat International Airport',         country: 'Oman' },
  { code: 'BAH', city: 'Bahrain',    name: 'Bahrain International Airport',        country: 'Bahrain' },
  { code: 'DOH', city: 'Doha',       name: 'Hamad International Airport',          country: 'Qatar' },
  { code: 'KUL', city: 'Kuala Lumpur', name: 'KL International Airport',           country: 'Malaysia' },
  { code: 'MNL', city: 'Manila',     name: 'Ninoy Aquino Intl Airport',            country: 'Philippines' },
  { code: 'NBO', city: 'Nairobi',    name: 'Jomo Kenyatta Intl Airport',           country: 'Kenya' },
];

const FLIGHT_ROUTES = [
  // International — Long haul
  { from: 'DXB', to: 'LHR', distance: 5466, durationMin: 435, baseEconomy: 2800, baseBusiness: 8500,  baseFirst: 18000 },
  { from: 'DXB', to: 'JFK', distance: 11023, durationMin: 840, baseEconomy: 4500, baseBusiness: 14000, baseFirst: 28000 },
  { from: 'DXB', to: 'CDG', distance: 5243, durationMin: 420, baseEconomy: 2700, baseBusiness: 8200,  baseFirst: 17000 },
  { from: 'DXB', to: 'SIN', distance: 5843, durationMin: 450, baseEconomy: 2600, baseBusiness: 8000,  baseFirst: 16000 },
  { from: 'DXB', to: 'BKK', distance: 4913, durationMin: 390, baseEconomy: 2200, baseBusiness: 7000,  baseFirst: 14000 },
  { from: 'DXB', to: 'KUL', distance: 5669, durationMin: 435, baseEconomy: 2400, baseBusiness: 7500,  baseFirst: 15000 },
  // International — Medium haul
  { from: 'DXB', to: 'BOM', distance: 1930, durationMin: 195, baseEconomy: 1200, baseBusiness: 4500,  baseFirst: 9000 },
  { from: 'DXB', to: 'DEL', distance: 2200, durationMin: 210, baseEconomy: 1350, baseBusiness: 4800,  baseFirst: 9500 },
  { from: 'DXB', to: 'IST', distance: 2991, durationMin: 270, baseEconomy: 1500, baseBusiness: 5000,  baseFirst: 10000 },
  { from: 'DXB', to: 'MLE', distance: 2899, durationMin: 255, baseEconomy: 1800, baseBusiness: 5500,  baseFirst: 11000 },
  { from: 'DXB', to: 'CMB', distance: 3349, durationMin: 270, baseEconomy: 1600, baseBusiness: 5200,  baseFirst: null },
  { from: 'DXB', to: 'CAI', distance: 2407, durationMin: 240, baseEconomy: 1400, baseBusiness: 4800,  baseFirst: null },
  { from: 'DXB', to: 'NBO', distance: 4464, durationMin: 330, baseEconomy: 2100, baseBusiness: 6500,  baseFirst: null },
  // Regional / Domestic
  { from: 'DXB', to: 'MCT', distance: 350,  durationMin: 60,  baseEconomy: 600,  baseBusiness: 1800, baseFirst: null },
  { from: 'DXB', to: 'BAH', distance: 450,  durationMin: 75,  baseEconomy: 700,  baseBusiness: 2000, baseFirst: null },
  { from: 'DXB', to: 'DOH', distance: 380,  durationMin: 70,  baseEconomy: 650,  baseBusiness: 1900, baseFirst: null },
];

const AIRLINE_FLEET = {
  'MER-024': { code: 'EK', name: 'Emirates',      classes: ['economy','business','first'], hubCode: 'DXB', color: '#D71921' },
  'MER-025': { code: 'EY', name: 'Etihad Airways', classes: ['economy','business','first'], hubCode: 'AUH', color: '#BD8B13' },
  'MER-026': { code: 'FZ', name: 'flydubai',       classes: ['economy','business'],         hubCode: 'DXB', color: '#F26522' },
  'MER-027': { code: 'G9', name: 'Air Arabia',     classes: ['economy'],                    hubCode: 'SHJ', color: '#ED1C24' },
  'MER-028': { code: 'QR', name: 'Qatar Airways',  classes: ['economy','business','first'], hubCode: 'DOH', color: '#5C0632' },
};

const FARE_RULES = {
  economy: {
    baggage:      '30 kg checked + 7 kg cabin',
    changeFee:    'AED 250 + fare difference',
    cancellation: 'AED 500 penalty',
    seatSelection:'AED 50 – 150',
    meal:         'Complimentary (standard)',
    lounge:       'Not included',
  },
  business: {
    baggage:      '40 kg checked + 2 × 7 kg cabin',
    changeFee:    'Free (fare difference applies)',
    cancellation: 'AED 250 penalty',
    seatSelection:'Complimentary',
    meal:         'Complimentary (premium)',
    lounge:       'Complimentary lounge access',
  },
  first: {
    baggage:      '50 kg checked + 2 × 7 kg cabin',
    changeFee:    'Free',
    cancellation: 'Free up to 24 h before departure',
    seatSelection:'Complimentary (suite)',
    meal:         'À la carte dining',
    lounge:       'First-class lounge + chauffeur',
  },
};

// Expose globally
window.FLIGHT_AIRPORTS = FLIGHT_AIRPORTS;
window.FLIGHT_ROUTES   = FLIGHT_ROUTES;
window.AIRLINE_FLEET   = AIRLINE_FLEET;
window.FARE_RULES      = FARE_RULES;
