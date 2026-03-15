// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Gift Cards Data
// ══════════════════════════════════════════════

const GIFT_CARD_CATEGORIES = [
  { id: 'all',           label: 'All Brands' },
  { id: 'electronics',   label: 'Electronics' },
  { id: 'fashion',       label: 'Fashion & Accessories' },
  { id: 'food',          label: 'Food & Dining' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'beauty',        label: 'Beauty & Wellness' },
];

const GIFT_CARDS = [
  { id: 'gc-reserved',    name: 'Reserved',            category: 'fashion',       color: '#1A1A1A', initials: 'RE', pointsFrom: 100 },
  { id: 'gc-opticplus',   name: 'Opticplus',           category: 'electronics',   color: '#0055A5', initials: 'OP', pointsFrom: 200 },
  { id: 'gc-zeiss',       name: 'Zeiss Vision Centre', category: 'electronics',   color: '#003A78', initials: 'ZV', pointsFrom: 250 },
  { id: 'gc-undiz',       name: 'Undiz',               category: 'fashion',       color: '#E91E63', initials: 'UN', pointsFrom: 100 },
  { id: 'gc-hm',          name: 'H&M',                 category: 'fashion',       color: '#CC0000', initials: 'HM', pointsFrom: 100 },
  { id: 'gc-okaidi',      name: 'Okaidi Obaibi',       category: 'fashion',       color: '#6BBE45', initials: 'OO', pointsFrom: 150 },
  { id: 'gc-footlocker',  name: 'Foot Locker',         category: 'fashion',       color: '#CE1126', initials: 'FL', pointsFrom: 200 },
  { id: 'gc-damas',       name: 'Damas',               category: 'fashion',       color: '#8B6914', initials: 'DA', pointsFrom: 500 },
  { id: 'gc-sephora',     name: 'Sephora',             category: 'beauty',        color: '#000000', initials: 'SE', pointsFrom: 200 },
  { id: 'gc-virgin',      name: 'Virgin Megastore',    category: 'entertainment', color: '#E10000', initials: 'VM', pointsFrom: 150 },
  { id: 'gc-carrefour',   name: 'Carrefour',           category: 'food',          color: '#004E9A', initials: 'CF', pointsFrom: 100 },
  { id: 'gc-ikea',        name: 'IKEA',                category: 'electronics',   color: '#0051BA', initials: 'IK', pointsFrom: 200 },
];

window.GIFT_CARD_CATEGORIES = GIFT_CARD_CATEGORIES;
window.GIFT_CARDS = GIFT_CARDS;
