// ══════════════════════════════════════════════
// DEMO LIFESTYLE — State Store
// ══════════════════════════════════════════════

const Store = {
  _state: {},
  _subscribers: {},
  _key: 'enbd_lifestyle_state',

  init() {
    const saved = localStorage.getItem(this._key);
    if (saved) {
      try { this._state = JSON.parse(saved); } catch(e) { this._state = {}; }
    }
    // Always reseed static data from source files (picks up any data changes)
    this._state.offers    = [...OFFERS];
    this._state.merchants = [...MERCHANTS];
    this._state.events    = [...EVENTS];
    // Preserve user-generated data from localStorage
    if (!this._state.bookings) {
      this._state.bookings = [...SAMPLE_BOOKINGS];
    }
    if (!this._state.auth) {
      this._state.auth = { isLoggedIn: false, currentUser: null };
    }
    if (!this._state.auditLog) {
      this._state.auditLog = [];
    }
    this._persist();
  },

  get(path) {
    if (!path) return this._state;
    return path.split('.').reduce((obj, key) => obj && obj[key], this._state);
  },

  set(path, value) {
    const keys = path.split('.');
    let obj = this._state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    this._persist();
    this._notify(path);
  },

  _persist() {
    try { localStorage.setItem(this._key, JSON.stringify(this._state)); } catch(e) {}
  },

  subscribe(path, callback) {
    if (!this._subscribers[path]) this._subscribers[path] = [];
    this._subscribers[path].push(callback);
    return () => {
      this._subscribers[path] = this._subscribers[path].filter(cb => cb !== callback);
    };
  },

  _notify(path) {
    Object.keys(this._subscribers).forEach(subPath => {
      if (path.startsWith(subPath) || subPath.startsWith(path)) {
        this._subscribers[subPath].forEach(cb => cb(this.get(subPath)));
      }
    });
  },

  // ── Booking Actions ──
  createBooking(data) {
    const user = this.get('auth.currentUser');
    const bookings = this.get('bookings') || [];
    const now = new Date().toISOString();
    const booking = {
      id: Format.bookingId(),
      userId: user.id,
      offerId: data.offerId,
      type: data.type || 'offer',
      status: 'confirmed',
      bookingDate: data.bookingDate,
      partySize: data.partySize || 1,
      timePreference: data.timePreference || 'any',
      specialRequests: data.specialRequests || '',
      createdAt: now,
      confirmationCode: Format.confirmationCode(),
      statusHistory: [
        { status: 'pending', at: now, note: 'Booking submitted' },
        { status: 'confirmed', at: now, note: 'Auto-confirmed' },
      ],
    };
    bookings.unshift(booking);
    this.set('bookings', bookings);
    AuditLog.log('BOOKING_CREATED', `Booking ${booking.id} created by ${user.name}. Confirmation: ${booking.confirmationCode}.`);
    return booking;
  },

  cancelBooking(bookingId) {
    const bookings = this.get('bookings') || [];
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    booking.status = 'cancelled';
    booking.statusHistory.push({
      status: 'cancelled',
      at: new Date().toISOString(),
      note: 'Cancelled by user',
    });
    this.set('bookings', [...bookings]);
    const user = this.get('auth.currentUser');
    AuditLog.log('BOOKING_CANCELLED', `Booking ${bookingId} cancelled by ${user.name}.`);
  },

  // ── Golf Booking Actions ──
  createGolfBooking(data) {
    const user = this.get('auth.currentUser');
    const bookings = this.get('bookings') || [];
    const now = new Date().toISOString();
    const booking = {
      id: Format.bookingId(),
      userId: user.id,
      offerId: data.courseId,
      type: 'golf',
      status: 'confirmed',
      bookingDate: data.bookingDate,
      teeTime: data.teeTime,
      partySize: data.players || 1,
      golfCartIncluded: data.cartIncluded || false,
      specialRequests: data.specialRequests || '',
      createdAt: now,
      confirmationCode: Format.confirmationCode(),
      statusHistory: [
        { status: 'pending', at: now, note: 'Golf booking submitted' },
        { status: 'confirmed', at: now, note: 'Auto-confirmed' },
      ],
    };
    bookings.unshift(booking);
    this.set('bookings', bookings);
    AuditLog.log('GOLF_BOOKING_CREATED', `Golf booking ${booking.id} at ${data.courseId} by ${user.name}.`);
    return booking;
  },

  getGolfQuota() {
    const user = this.get('auth.currentUser');
    if (!user) return { allowed: 0, used: 0, remaining: 0, benefit: null };
    const tier = user.cardTier;
    const benefit = CARD_BENEFITS[tier]?.golf;
    if (!benefit) return { allowed: 0, used: 0, remaining: 0, benefit: null };
    let allowed = 999;
    if (benefit.includes('4 rounds')) allowed = 4;
    else if (benefit.toLowerCase().includes('unlimited')) allowed = 999;
    const used = (this.get('bookings') || [])
      .filter(b => b.userId === user.id && b.type === 'golf' && b.status === 'confirmed').length;
    return { allowed, used, remaining: Math.max(0, allowed - used), benefit };
  },

  // ── Airport Booking Actions ──
  createAirportBooking(data) {
    const user = this.get('auth.currentUser');
    const bookings = this.get('bookings') || [];
    const now = new Date().toISOString();
    const booking = {
      id: Format.bookingId(),
      userId: user.id,
      offerId: data.vehicleId,
      type: 'airport',
      status: 'confirmed',
      transferType: data.transferType,
      airportId: data.airportId,
      terminal: data.terminal,
      locationId: data.locationId,
      locationName: data.locationName,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      flightNumber: data.flightNumber || '',
      partySize: data.passengers || 1,
      bags: data.bags || 1,
      babySeats: data.babySeats || 0,
      specialRequests: data.specialRequests || '',
      createdAt: now,
      confirmationCode: Format.confirmationCode(),
      statusHistory: [
        { status: 'pending', at: now, note: 'Airport transfer submitted' },
        { status: 'confirmed', at: now, note: 'Auto-confirmed' },
      ],
    };
    bookings.unshift(booking);
    this.set('bookings', bookings);
    AuditLog.log('AIRPORT_BOOKING_CREATED', `Airport transfer ${booking.id} (${data.transferType}) by ${user.name}.`);
    return booking;
  },

  getAirportQuota() {
    const user = this.get('auth.currentUser');
    if (!user) return { allowed: 0, used: 0, remaining: 0, benefit: null };
    const tier = user.cardTier;
    const benefit = CARD_BENEFITS[tier]?.airport;
    if (!benefit) return { allowed: 0, used: 0, remaining: 0, benefit: null };
    let allowed = 999;
    if (benefit.includes('2 complimentary')) allowed = 2;
    else if (benefit.includes('4 complimentary')) allowed = 4;
    else if (benefit.toLowerCase().includes('unlimited')) allowed = 999;
    const used = (this.get('bookings') || [])
      .filter(b => b.userId === user.id && b.type === 'airport' && b.status === 'confirmed').length;
    return { allowed, used, remaining: Math.max(0, allowed - used), benefit };
  },

  // ── Courier Booking Actions ──
  createCourierBooking(data) {
    const user = this.get('auth.currentUser');
    const bookings = this.get('bookings') || [];
    const now = new Date().toISOString();
    const booking = {
      id: Format.bookingId(),
      userId: user.id,
      offerId: data.serviceId,
      type: 'courier',
      status: 'confirmed',
      packageType: data.packageType,
      estimatedWeight: data.estimatedWeight,
      pickupLocationId: data.pickupLocationId,
      pickupLocationName: data.pickupLocationName,
      deliveryLocationId: data.deliveryLocationId,
      deliveryLocationName: data.deliveryLocationName,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      specialHandling: data.specialHandling || '',
      specialRequests: data.specialRequests || '',
      partySize: 1,
      createdAt: now,
      confirmationCode: Format.confirmationCode(),
      statusHistory: [
        { status: 'pending', at: now, note: 'Courier booking submitted' },
        { status: 'confirmed', at: now, note: 'Auto-confirmed' },
      ],
    };
    bookings.unshift(booking);
    this.set('bookings', bookings);
    AuditLog.log('COURIER_BOOKING_CREATED', `Courier booking ${booking.id} (${data.serviceId}) by ${user.name}.`);
    return booking;
  },

  getCourierQuota() {
    const user = this.get('auth.currentUser');
    if (!user) return { allowed: 0, used: 0, remaining: 0, benefit: null };
    const tier = user.cardTier;
    const benefit = CARD_BENEFITS[tier]?.courier;
    if (!benefit) return { allowed: 0, used: 0, remaining: 0, benefit: null };
    let allowed = 999;
    if (benefit.includes('2 complimentary')) allowed = 2;
    else if (benefit.includes('6 complimentary')) allowed = 6;
    else if (benefit.toLowerCase().includes('unlimited')) allowed = 999;
    const used = (this.get('bookings') || [])
      .filter(b => b.userId === user.id && b.type === 'courier' && b.status === 'confirmed').length;
    return { allowed, used, remaining: Math.max(0, allowed - used), benefit };
  },

  // ── Concierge Booking Actions ──
  createConciergeBooking(data) {
    const user = this.get('auth.currentUser');
    const bookings = this.get('bookings') || [];
    const now = new Date().toISOString();
    const booking = {
      id: Format.bookingId(),
      userId: user.id,
      offerId: data.serviceId,
      type: 'concierge',
      status: 'confirmed',
      serviceName: data.serviceName,
      requestDescription: data.requestDescription,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      budgetRange: data.budgetRange || '',
      guests: data.guests || 1,
      contactMethod: data.contactMethod || '',
      contactTime: data.contactTime || '',
      occasion: data.occasion || '',
      specialRequests: data.specialRequests || '',
      partySize: data.guests || 1,
      createdAt: now,
      confirmationCode: Format.confirmationCode(),
      statusHistory: [
        { status: 'pending', at: now, note: 'Concierge request submitted' },
        { status: 'confirmed', at: now, note: 'Auto-confirmed' },
      ],
    };
    bookings.unshift(booking);
    this.set('bookings', bookings);
    AuditLog.log('CONCIERGE_BOOKING_CREATED', `Concierge booking ${booking.id} (${data.serviceId}) by ${user.name}.`);
    return booking;
  },

  getConciergeQuota() {
    const user = this.get('auth.currentUser');
    if (!user) return { allowed: 0, used: 0, remaining: 0, benefit: null };
    const tier = user.cardTier;
    const benefit = CARD_BENEFITS[tier]?.concierge;
    if (!benefit) return { allowed: 0, used: 0, remaining: 0, benefit: null };
    let allowed = 999;
    if (benefit.includes('2 complimentary')) allowed = 2;
    else if (benefit.includes('6 complimentary')) allowed = 6;
    else if (benefit.toLowerCase().includes('unlimited')) allowed = 999;
    const used = (this.get('bookings') || [])
      .filter(b => b.userId === user.id && b.type === 'concierge' && b.status === 'confirmed').length;
    return { allowed, used, remaining: Math.max(0, allowed - used), benefit };
  },

  // ── Clubhouse Booking Actions ──
  createClubhouseBooking(data) {
    const user = this.get('auth.currentUser');
    const bookings = this.get('bookings') || [];
    const now = new Date().toISOString();
    const booking = {
      id: Format.bookingId(),
      userId: user.id,
      offerId: data.categoryId,
      type: 'clubhouse',
      status: 'confirmed',
      categoryName: data.categoryName,
      venueId: data.venueId,
      venueName: data.venueName,
      venueArea: data.venueArea,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      partySize: data.partySize || 1,
      guestName: data.guestName || '',
      guestPhone: data.guestPhone || '',
      preferences: data.preferences || '',
      specialRequests: data.specialRequests || '',
      createdAt: now,
      confirmationCode: Format.confirmationCode(),
      statusHistory: [
        { status: 'pending', at: now, note: 'Club registration submitted' },
        { status: 'confirmed', at: now, note: 'Auto-confirmed' },
      ],
    };
    bookings.unshift(booking);
    this.set('bookings', bookings);
    AuditLog.log('CLUBHOUSE_BOOKING_CREATED', `Club booking ${booking.id} (${data.categoryId}) by ${user.name}.`);
    return booking;
  },

  getClubhouseQuota() {
    const user = this.get('auth.currentUser');
    if (!user) return { allowed: 0, used: 0, remaining: 0, benefit: null };
    const tier = user.cardTier;
    const benefit = CARD_BENEFITS[tier]?.club;
    if (!benefit) return { allowed: 0, used: 0, remaining: 0, benefit: null };
    let allowed = 999;
    if (benefit.includes('2 complimentary')) allowed = 2;
    else if (benefit.includes('6 complimentary')) allowed = 6;
    else if (benefit.toLowerCase().includes('unlimited')) allowed = 999;
    const used = (this.get('bookings') || [])
      .filter(b => b.userId === user.id && b.type === 'clubhouse' && b.status === 'confirmed').length;
    return { allowed, used, remaining: Math.max(0, allowed - used), benefit };
  },

  getUserBookings() {
    const user = this.get('auth.currentUser');
    if (!user) return [];
    return (this.get('bookings') || []).filter(b => b.userId === user.id);
  },

  getBookingCount() {
    return this.getUserBookings().filter(b => b.status === 'confirmed').length;
  },

  // ── Offer Helpers ──
  getOffersByCategory(categoryId) {
    const user = this.get('auth.currentUser');
    const tierLevel = user ? (CONFIG.cardTiers[user.cardTier]?.level || 1) : 1;
    return (this.get('offers') || []).filter(o => {
      if (!o.isActive) return false;
      const minLevel = CONFIG.cardTiers[o.minTier]?.level || 1;
      if (tierLevel < minLevel) return false;
      if (categoryId === 'all') return true;
      return o.category === categoryId;
    });
  },

  getFeaturedOffers() {
    const user = this.get('auth.currentUser');
    const tierLevel = user ? (CONFIG.cardTiers[user.cardTier]?.level || 1) : 1;
    return (this.get('offers') || []).filter(o => {
      if (!o.isActive || !o.isFeatured) return false;
      const minLevel = CONFIG.cardTiers[o.minTier]?.level || 1;
      return tierLevel >= minLevel;
    });
  },

  getPremiumOffers() {
    const user = this.get('auth.currentUser');
    const tierLevel = user ? (CONFIG.cardTiers[user.cardTier]?.level || 1) : 1;
    return (this.get('offers') || []).filter(o => {
      if (!o.isActive || !o.isPremium) return false;
      const minLevel = CONFIG.cardTiers[o.minTier]?.level || 1;
      return tierLevel >= minLevel;
    });
  },

  getExpiringOffers(days = 7) {
    const user = this.get('auth.currentUser');
    const tierLevel = user ? (CONFIG.cardTiers[user.cardTier]?.level || 1) : 1;
    const now = new Date();
    const cutoff = new Date(now.getTime() + days * 86400000);
    return (this.get('offers') || []).filter(o => {
      if (!o.isActive) return false;
      const minLevel = CONFIG.cardTiers[o.minTier]?.level || 1;
      if (tierLevel < minLevel) return false;
      const expiry = new Date(o.validUntil);
      return expiry >= now && expiry <= cutoff;
    });
  },

  getUpcomingEvents() {
    const user = this.get('auth.currentUser');
    const tierLevel = user ? (CONFIG.cardTiers[user.cardTier]?.level || 1) : 1;
    const now = new Date();
    return (this.get('events') || []).filter(e => {
      const minLevel = CONFIG.cardTiers[e.minTier]?.level || 1;
      if (tierLevel < minLevel) return false;
      return new Date(e.date) >= now;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  getMerchant(merchantId) {
    return (this.get('merchants') || []).find(m => m.id === merchantId);
  },

  getDiningMerchants() {
    return (this.get('merchants') || []).filter(m => m.category === 'dining');
  },

  searchAll(query) {
    if (!query || query.length < 2) return { offers: [], events: [], merchants: [] };
    const q = query.toLowerCase();
    const user = this.get('auth.currentUser');
    const tierLevel = user ? (CONFIG.cardTiers[user.cardTier]?.level || 1) : 1;

    const offers = (this.get('offers') || []).filter(o => {
      if (!o.isActive) return false;
      const minLevel = CONFIG.cardTiers[o.minTier]?.level || 1;
      if (tierLevel < minLevel) return false;
      const merchant = this.getMerchant(o.merchantId);
      return o.title.toLowerCase().includes(q) ||
             o.description.toLowerCase().includes(q) ||
             (o.tags || []).some(t => t.includes(q)) ||
             (merchant && merchant.name.toLowerCase().includes(q));
    });

    const events = (this.get('events') || []).filter(e => {
      const minLevel = CONFIG.cardTiers[e.minTier]?.level || 1;
      if (tierLevel < minLevel) return false;
      return e.title.toLowerCase().includes(q) ||
             e.venue.toLowerCase().includes(q) ||
             e.description.toLowerCase().includes(q);
    });

    const merchants = (this.get('merchants') || []).filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      (m.cuisine && m.cuisine.toLowerCase().includes(q)) ||
      m.area.toLowerCase().includes(q)
    );

    return { offers, events, merchants };
  },

  reset() {
    localStorage.removeItem(this._key);
    this._state = {};
    this.init();
  }
};

window.Store = Store;
