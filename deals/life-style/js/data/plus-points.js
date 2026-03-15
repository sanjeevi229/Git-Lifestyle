// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Plus Points Transfer Data
// ══════════════════════════════════════════════

const PLUS_POINTS_CATEGORIES = [
  { id: 'all',      label: 'All Programs' },
  { id: 'airlines', label: 'Airlines' },
  { id: 'hotels',   label: 'Hotels' },
];

const PLUS_POINTS_PROGRAMS = [
  {
    id: 'pp-privilege',
    name: 'Privilege Club',
    category: 'airlines',
    logo: 'QA',
    logoBg: '#5C0632',
    conversion: '1 Plus Points = 7 Avios',
    linked: false,
  },
  {
    id: 'pp-airrewards',
    name: 'AirRewards',
    category: 'airlines',
    logo: 'AR',
    logoBg: '#E60012',
    conversion: '1 Plus Points = 10 AirRewards points',
    linked: false,
  },
  {
    id: 'pp-maharaja',
    name: 'Maharaja Club',
    category: 'airlines',
    logo: 'MC',
    logoBg: '#C84B31',
    conversion: '1 Plus Points = 15 Maharaja Points',
    linked: false,
  },
  {
    id: 'pp-mabuhay',
    name: 'Mabuhay Miles',
    category: 'airlines',
    logo: 'MM',
    logoBg: '#D4A017',
    conversion: '1 Plus Points = 8 Mabuhay Miles',
    linked: false,
  },
  {
    id: 'pp-cathay',
    name: 'Cathay',
    category: 'airlines',
    logo: 'CX',
    logoBg: '#006564',
    conversion: '1 Plus Points = 5 Asia Miles',
    linked: false,
  },
  {
    id: 'pp-accor',
    name: 'Accor Limitless',
    category: 'hotels',
    logo: 'ALL',
    logoBg: '#1B1464',
    conversion: '1 Plus Points = 12 Accor Points',
    linked: false,
  },
  {
    id: 'pp-skywards',
    name: 'Skywards',
    category: 'airlines',
    logo: 'EK',
    logoBg: '#D71920',
    conversion: '1 Plus Points = 6 Skywards Miles',
    linked: false,
  },
  {
    id: 'pp-marriott',
    name: 'Marriott Bonvoy',
    category: 'hotels',
    logo: 'MB',
    logoBg: '#862633',
    conversion: '1 Plus Points = 10 Bonvoy Points',
    linked: false,
  },
  {
    id: 'pp-hilton',
    name: 'Hilton Honors',
    category: 'hotels',
    logo: 'HH',
    logoBg: '#104C97',
    conversion: '1 Plus Points = 14 Hilton Points',
    linked: false,
  },
  {
    id: 'pp-etihad',
    name: 'Etihad Guest',
    category: 'airlines',
    logo: 'EY',
    logoBg: '#BD8B3E',
    conversion: '1 Plus Points = 5 Etihad Miles',
    linked: false,
  },
];

window.PLUS_POINTS_CATEGORIES = PLUS_POINTS_CATEGORIES;
window.PLUS_POINTS_PROGRAMS = PLUS_POINTS_PROGRAMS;
