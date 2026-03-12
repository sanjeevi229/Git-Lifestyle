// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Card Benefits Data
// ══════════════════════════════════════════════

const CARD_BENEFITS = {
  classic: {
    dining: 'Up to 15% off at select restaurants',
    entertainment: 'Buy 1 Get 1 on movie tickets',
    wellness: '10% off at partner gyms',
    travel: 'Standard travel insurance',
    shopping: '5% cashback on online shopping',
    lounge: null,
    golf: null,
    airport: null,
    courier: null,
    concierge: null,
    club: null,
    car: null,
    registration: null,
    valet: null,
    points: '1 point per AED 5 spent',
  },
  gold: {
    dining: 'Up to 25% off at 200+ restaurants',
    entertainment: 'Buy 1 Get 1 on attractions & cinema',
    wellness: '20% off at partner spas and gyms',
    travel: 'Enhanced travel insurance',
    shopping: '10% cashback on select retailers',
    lounge: '4 complimentary lounge visits/year',
    golf: null,
    airport: null,
    courier: null,
    concierge: null,
    club: null,
    car: null,
    registration: null,
    valet: null,
    points: '1 point per AED 3 spent',
  },
  platinum: {
    dining: 'Up to 35% off at 500+ restaurants',
    entertainment: 'VIP access to select events',
    wellness: '30% off at premium spas',
    travel: 'Comprehensive travel insurance + free cancellation',
    shopping: '15% cashback on luxury brands',
    lounge: '8 complimentary lounge visits/year',
    golf: '4 rounds per year at select courses',
    airport: '2 complimentary transfers per year',
    courier: '2 complimentary deliveries per month',
    concierge: '2 complimentary requests per month',
    club: '2 complimentary visits per month',
    car: '1 complimentary car service per year',
    registration: null,
    valet: '2 complimentary valet parking per month',
    points: '1 point per AED 2 spent',
  },
  infinite: {
    dining: 'Up to 50% off at 800+ restaurants',
    entertainment: 'VIP access + priority seating',
    wellness: '40% off + complimentary wellness sessions',
    travel: 'Premium travel insurance + meet & greet',
    shopping: '20% cashback on luxury brands',
    lounge: 'Unlimited airport lounge access',
    golf: 'Unlimited golf at partner courses',
    airport: '4 complimentary transfers per year',
    courier: '6 complimentary deliveries per month',
    concierge: '6 complimentary requests per month',
    club: '6 complimentary visits per month',
    car: '2 complimentary car services per year',
    registration: 'Complimentary car registration renewal',
    valet: '4 complimentary valet parking per month',
    points: '1 point per AED 1 spent',
  },
  private: {
    dining: 'Up to 50% off + complimentary tasting menus',
    entertainment: 'Exclusive private events + backstage',
    wellness: 'Complimentary spa memberships',
    travel: 'Private jet booking + premium everything',
    shopping: '25% cashback + personal shopper',
    lounge: 'Unlimited lounge + private terminals',
    golf: 'Unlimited + priority tee times',
    airport: 'Unlimited airport transfers',
    courier: 'Unlimited courier service',
    concierge: 'Unlimited concierge requests',
    club: 'Unlimited club access',
    car: 'Unlimited car servicing',
    registration: 'Complimentary car registration & renewal',
    valet: 'Unlimited valet parking',
    points: '2 points per AED 1 spent',
  },
};

const CARD_BENEFIT_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'golf', label: 'Golf' },
  { id: 'club', label: 'Club' },
  { id: 'airport', label: 'Airport' },
  { id: 'courier', label: 'Courier' },
  { id: 'car', label: 'Car' },
  { id: 'registration', label: 'Registration' },
  { id: 'valet', label: 'Valet' },
];

const CARD_BENEFIT_CARDS = [
  { id: 'golf',         category: 'golf',         title: 'Golf Access',         badge: 'Sports & Leisure',       route: '/golf',    image: 'assets/card benifts/photos/golf_access.jpg' },
  { id: 'club',         category: 'club',         title: 'Club Access',         badge: 'Lifestyle & Leisure',    route: '/club',    image: 'assets/card benifts/photos/club_access.jpg' },
  { id: 'airport',      category: 'airport',      title: 'Airport Pickup/Drop', badge: 'Travel & Transport',     route: '/airport', image: 'assets/card benifts/photos/airport_pickup.jpg' },
  { id: 'courier',      category: 'courier',      title: 'Local Courier',       badge: 'Convenience & Services', route: '/courier', image: 'assets/card benifts/photos/local_courier.jpg' },
  { id: 'car',          category: 'car',          title: 'Car Servicing',       badge: 'Auto & Maintenance',     route: null,       image: 'assets/card benifts/photos/car_servicing.jpg' },
  { id: 'registration', category: 'registration', title: 'Car Registration',    badge: 'Auto & Maintenance',     route: null,       image: 'assets/card benifts/photos/car_registration.jpg' },
  { id: 'valet',        category: 'valet',        title: 'Valet Parking',       badge: 'Convenience & Services', route: null,       image: 'assets/card benifts/photos/valet_parking.jpg' },
];

const CARD_DISPLAY_NAMES = {
  classic: 'Visa Classic',
  gold: 'Visa Gold',
  platinum: 'Visa Platinum',
  infinite: 'Visa Infinite',
  private: 'Visa Private',
};

window.CARD_BENEFITS = CARD_BENEFITS;
window.CARD_BENEFIT_CATEGORIES = CARD_BENEFIT_CATEGORIES;
window.CARD_BENEFIT_CARDS = CARD_BENEFIT_CARDS;
window.CARD_DISPLAY_NAMES = CARD_DISPLAY_NAMES;
