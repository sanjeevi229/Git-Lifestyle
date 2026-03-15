// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Flight Booking Page
// ══════════════════════════════════════════════

const FlightBookingPage = {
  _offerId: null,
  _offer: null,
  _merchant: null,
  _step: 1,           // 1=search, 2=results, 3=passenger, 4=confirm
  _stickyObserver: null,
  _couponApplied: false,
  _couponCode: '',

  // Search state
  _searchParams: null,
  _flightResults: [],
  _sortBy: 'cheapest',
  _filterStops: 'any',
  _filterAirlines: [],
  _filterRefundable: false,
  _directOnly: false,

  // Selection state
  _selectedOutbound: null,
  _selectedReturn: null,

  // Passenger state
  _passengers: [],
  _selectedTitle: 'Mr',
  _agreedTerms: false,

  // ── CTA labels per step ──
  _ctaLabels: { 1: 'Search Flights', 2: 'Continue', 3: 'Go to payment', 4: 'Confirm Booking' },

  // ══════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════

  render(params) {
    const rawId = params.offerId;
    this._offer = (Store.get('offers') || []).find(o => o.id === rawId);
    if (!this._offer) return this._notFound();
    this._offerId = rawId;
    this._merchant = Store.getMerchant(this._offer.merchantId);
    // Reset
    this._step = 1;
    this._searchParams = null;
    this._flightResults = [];
    this._selectedOutbound = null;
    this._selectedReturn = null;
    this._passengers = [];
    this._couponApplied = false;
    this._couponCode = '';
    this._sortBy = 'cheapest';
    this._filterStops = 'any';
    this._filterAirlines = [];
    this._filterRefundable = false;
    this._directOnly = false;
    this._selectedTitle = 'Mr';
    this._agreedTerms = false;

    // Infer cabin class from offer tags/title
    const t = (this._offer.title + ' ' + (this._offer.tags || []).join(' ')).toLowerCase();
    this._defaultCabin = t.includes('first') ? 'first' : t.includes('business') ? 'business' : 'economy';

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full page__main--booking">
          <div class="container">
            <div class="breadcrumb">
              <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="Router.navigate('/category/flights')">Book Flights</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">${this._merchant ? this._merchant.name : this._offer.title}</span>
            </div>

            <div class="hb-page-header">
              <button class="hb-back-btn" onclick="history.back()">
                ${Icons.chevronLeft ? Icons.chevronLeft(20) : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>'}
              </button>
              <h1 class="hb-page-title">${this._offer.title}</h1>
            </div>

            <div class="fb-layout" id="flightBookingForm">
              ${this._renderStep1()}
            </div>
          </div>
        </main>

        <!-- Sticky CTA -->
        <div class="booking-sticky-cta" id="booking-sticky-cta">
          <button class="btn btn--primary btn--lg booking-sticky-cta__btn" id="stickyContinueBtn">
            Search Flights
          </button>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════
  // STEP 1 — Flight Search Widget
  // ══════════════════════════════════════

  _renderStep1() {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const cabin = this._defaultCabin || 'economy';

    return `
      <!-- Offer Reminder -->
      <div class="fb-offer-strip">
        <span class="fb-offer-strip__badge">${Format.discountLabel(this._offer)}</span>
        <span class="fb-offer-strip__text">${this._offer.title}</span>
        ${this._merchant ? `<span class="fb-offer-strip__airline">${this._merchant.name}</span>` : ''}
      </div>

      <!-- Search Card -->
      <div class="hb-card fb-search-card">
        <h2 class="hb-card__title">${Icons.plane(18)} Search Flights</h2>

        <!-- From / To -->
        <div class="fb-route-row">
          <div class="form-group fb-route-col">
            <label class="form-label">From</label>
            <select id="fbFrom" class="form-input form-select">
              ${FLIGHT_AIRPORTS.map(a => `<option value="${a.code}" ${a.code === 'DXB' ? 'selected' : ''}>${a.code} — ${a.city}</option>`).join('')}
            </select>
          </div>
          <button type="button" class="fb-swap-btn" id="swapAirports" title="Swap">⇄</button>
          <div class="form-group fb-route-col">
            <label class="form-label">To</label>
            <select id="fbTo" class="form-input form-select">
              <option value="">Select destination</option>
              ${FLIGHT_AIRPORTS.filter(a => a.code !== 'DXB').map(a => `<option value="${a.code}" ${a.code === 'LHR' ? 'selected' : ''}>${a.code} — ${a.city}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Dates -->
        <div class="fb-dates-row">
          <div class="form-group" style="flex:1">
            <label class="form-label">Departure</label>
            <input type="date" id="fbDepart" class="form-input" min="${today}" value="${today}" />
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">Return <span class="text-muted">(optional)</span></label>
            <input type="date" id="fbReturn" class="form-input" min="${today}" value="${nextWeek}" />
          </div>
        </div>

        <!-- Passengers + Cabin -->
        <div class="fb-dates-row">
          <div class="form-group" style="flex:1">
            <label class="form-label">Passengers</label>
            <select id="fbPassengers" class="form-input form-select">
              ${[1,2,3,4,5,6,7,8,9].map(n => `<option value="${n}" ${n === 1 ? 'selected' : ''}>${n} Passenger${n > 1 ? 's' : ''}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">Cabin Class</label>
            <select id="fbCabin" class="form-input form-select">
              <option value="economy" ${cabin === 'economy' ? 'selected' : ''}>Economy</option>
              <option value="business" ${cabin === 'business' ? 'selected' : ''}>Business</option>
              <option value="first" ${cabin === 'first' ? 'selected' : ''}>First Class</option>
            </select>
          </div>
        </div>

        <!-- Quick filters -->
        <div class="fb-quick-filters">
          <button type="button" class="request-chip" data-value="direct" id="chipDirect">✈ Direct flights only</button>
          <button type="button" class="request-chip" data-value="flexible">📅 Flexible dates</button>
          <button type="button" class="request-chip" data-value="nearby">📍 Nearby airports</button>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════
  // STEP 2 — Flight Results
  // ══════════════════════════════════════

  _generateFlightResults() {
    const p = this._searchParams;
    const results = [];
    const matchingRoutes = FLIGHT_ROUTES.filter(r => r.from === p.from && r.to === p.to);
    // If no direct routes, try reverse hub connections
    if (matchingRoutes.length === 0) {
      // Create a synthetic route
      matchingRoutes.push({ from: p.from, to: p.to, distance: 3000, durationMin: 300, baseEconomy: 2000, baseBusiness: 6000, baseFirst: 12000 });
    }

    const cabinKey = 'base' + p.cabin.charAt(0).toUpperCase() + p.cabin.slice(1);
    const offerAirlineId = this._offer.merchantId;

    // Seed random from date for consistent results
    const dateSeed = p.departureDate.split('-').join('');
    let seed = parseInt(dateSeed) % 1000;
    const pseudoRandom = () => { seed = (seed * 16807 + 7) % 2147483647; return (seed % 1000) / 1000; };

    for (const route of matchingRoutes) {
      const basePrice = route[cabinKey];
      if (!basePrice) continue;

      for (const [merchantId, airline] of Object.entries(AIRLINE_FLEET)) {
        if (!airline.classes.includes(p.cabin)) continue;

        // Generate 2-3 flights per airline
        const flightCount = 2 + Math.floor(pseudoRandom() * 2);
        for (let i = 0; i < flightCount; i++) {
          const depHour = 5 + Math.floor(pseudoRandom() * 18);
          const depMin = Math.floor(pseudoRandom() * 4) * 15;
          const depTime = `${String(depHour).padStart(2,'0')}:${String(depMin).padStart(2,'0')}`;

          // Price variation (morning/evening cheaper, midday premium)
          const timeMult = depHour >= 10 && depHour <= 14 ? 1.15 : depHour >= 6 && depHour <= 8 ? 0.92 : 1.0;
          const randMult = 0.9 + pseudoRandom() * 0.25;
          const price = Math.round(basePrice * timeMult * randMult);

          // Duration with slight variation
          const durVar = Math.round(route.durationMin * (0.95 + pseudoRandom() * 0.1));

          // Stops: long haul sometimes 1 stop
          const stops = (route.distance > 5000 && pseudoRandom() > 0.5) ? 1 : 0;

          // Arrival time
          const totalMin = depHour * 60 + depMin + durVar + (stops * 90);
          const arrHour = Math.floor(totalMin / 60) % 24;
          const arrMin = totalMin % 60;
          const arrTime = `${String(arrHour).padStart(2,'0')}:${String(arrMin).padStart(2,'0')}`;
          const nextDay = totalMin >= 1440;

          const flightNum = `${airline.code} ${100 + Math.floor(pseudoRandom() * 900)}`;
          const hasOfferDiscount = merchantId === offerAirlineId;

          results.push({
            id: flightNum.replace(' ', '-') + '-' + i,
            airlineId: merchantId,
            airlineName: airline.name,
            airlineCode: airline.code,
            airlineColor: airline.color,
            flightNumber: flightNum,
            from: route.from,
            fromCity: FLIGHT_AIRPORTS.find(a => a.code === route.from)?.city || route.from,
            to: route.to,
            toCity: FLIGHT_AIRPORTS.find(a => a.code === route.to)?.city || route.to,
            departureTime: depTime,
            arrivalTime: arrTime,
            nextDay,
            durationMin: durVar + (stops * 90),
            stops,
            cabin: p.cabin,
            pricePerPerson: price,
            totalPrice: price * parseInt(p.passengers),
            hasOfferDiscount,
            refundable: p.cabin !== 'economy',
          });
        }
      }
    }
    return results;
  },

  _formatDuration(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  },

  _applySortAndFilter(results) {
    let filtered = [...results];

    // Stops filter
    if (this._filterStops === 'direct') filtered = filtered.filter(f => f.stops === 0);
    else if (this._filterStops === '1') filtered = filtered.filter(f => f.stops <= 1);

    // Airlines filter
    if (this._filterAirlines.length > 0) {
      filtered = filtered.filter(f => this._filterAirlines.includes(f.airlineId));
    }

    // Refundable filter
    if (this._filterRefundable) filtered = filtered.filter(f => f.refundable);

    // Sort
    switch (this._sortBy) {
      case 'cheapest':  filtered.sort((a, b) => a.pricePerPerson - b.pricePerPerson); break;
      case 'fastest':   filtered.sort((a, b) => a.durationMin - b.durationMin); break;
      case 'earliest':  filtered.sort((a, b) => a.departureTime.localeCompare(b.departureTime)); break;
      case 'best':
        filtered.sort((a, b) => {
          const scoreA = a.pricePerPerson * 0.6 + a.durationMin * 3 + a.stops * 500;
          const scoreB = b.pricePerPerson * 0.6 + b.durationMin * 3 + b.stops * 500;
          return scoreA - scoreB;
        });
        break;
    }
    return filtered;
  },

  _renderStep2() {
    const p = this._searchParams;
    const filtered = this._applySortAndFilter(this._flightResults);
    const airlines = [...new Map(this._flightResults.map(f => [f.airlineId, { id: f.airlineId, name: f.airlineName, code: f.airlineCode }])).values()];

    return `
      <!-- Search Summary -->
      <div class="fb-search-summary">
        <div class="fb-search-summary__route">
          <strong>${p.from}</strong> → <strong>${p.to}</strong>
          <span class="text-muted">· ${Format.date(p.departureDate)}${p.returnDate ? ' — ' + Format.date(p.returnDate) : ' · One way'}</span>
          <span class="text-muted">· ${p.passengers} pax · ${p.cabin.charAt(0).toUpperCase() + p.cabin.slice(1)}</span>
        </div>
        <button type="button" class="fb-edit-search" id="editSearch">Edit search</button>
      </div>

      <!-- Sort Bar -->
      <div class="fb-sort-bar">
        ${['cheapest','fastest','best','earliest'].map(s => `
          <button type="button" class="fb-sort-pill ${this._sortBy === s ? 'fb-sort-pill--active' : ''}" data-sort="${s}">
            ${s === 'cheapest' ? '💰 Cheapest' : s === 'fastest' ? '⚡ Fastest' : s === 'best' ? '⭐ Best' : '🕐 Earliest'}
          </button>
        `).join('')}
      </div>

      <div class="fb-results-layout">
        <!-- Filters -->
        <div class="fb-filters">
          <h3 class="fb-filters__title">Filters</h3>

          <div class="fb-filter-group">
            <label class="form-label">Stops</label>
            <select id="filterStops" class="form-input form-select fb-filter-input">
              <option value="any" ${this._filterStops === 'any' ? 'selected' : ''}>Any</option>
              <option value="direct" ${this._filterStops === 'direct' ? 'selected' : ''}>Direct only</option>
              <option value="1" ${this._filterStops === '1' ? 'selected' : ''}>Max 1 stop</option>
            </select>
          </div>

          <div class="fb-filter-group">
            <label class="form-label">Airlines</label>
            ${airlines.map(a => `
              <label class="fb-checkbox-label">
                <input type="checkbox" class="fb-airline-check" value="${a.id}" ${this._filterAirlines.includes(a.id) ? 'checked' : ''} />
                <span>${a.code} — ${a.name}</span>
              </label>
            `).join('')}
          </div>

          <div class="fb-filter-group">
            <label class="fb-checkbox-label">
              <input type="checkbox" id="filterRefundable" ${this._filterRefundable ? 'checked' : ''} />
              <span>Refundable fares only</span>
            </label>
          </div>
        </div>

        <!-- Flight Cards -->
        <div class="fb-flight-list">
          <p class="fb-results-count">${filtered.length} flight${filtered.length !== 1 ? 's' : ''} found</p>
          ${filtered.length === 0 ? `
            <div class="fb-no-results">
              <p>No flights match your filters. Try adjusting your criteria.</p>
            </div>
          ` : filtered.map(f => this._renderFlightCard(f)).join('')}
        </div>
      </div>
    `;
  },

  _renderFlightCard(f) {
    return `
      <div class="fb-flight-card ${f.hasOfferDiscount ? 'fb-flight-card--offer' : ''}">
        ${f.hasOfferDiscount ? `<div class="fb-flight-card__offer-tag">${Format.discountLabel(this._offer)}</div>` : ''}
        <div class="fb-flight-card__top">
          <div class="fb-flight-card__airline">
            <div class="fb-flight-card__logo" style="background:${f.airlineColor}">${f.airlineCode}</div>
            <div>
              <div class="fb-flight-card__carrier">${f.airlineName}</div>
              <div class="fb-flight-card__number">${f.flightNumber}</div>
            </div>
          </div>
          <div class="fb-flight-card__price-col">
            <div class="fb-flight-card__price">AED ${f.pricePerPerson.toLocaleString()}</div>
            <div class="fb-flight-card__price-note">per person</div>
          </div>
        </div>

        <div class="fb-flight-card__route">
          <div class="fb-flight-card__endpoint">
            <span class="fb-flight-card__time">${f.departureTime}</span>
            <span class="fb-flight-card__code">${f.from}</span>
          </div>
          <div class="fb-flight-card__duration">
            <span class="fb-flight-card__dur-text">${this._formatDuration(f.durationMin)}</span>
            <div class="fb-flight-card__track"><div class="fb-flight-card__track-line"></div>${f.stops > 0 ? '<div class="fb-flight-card__stop-dot"></div>' : ''}</div>
            <span class="fb-flight-card__stops">${f.stops === 0 ? 'Direct' : f.stops + ' stop'}</span>
          </div>
          <div class="fb-flight-card__endpoint">
            <span class="fb-flight-card__time">${f.arrivalTime}${f.nextDay ? '<sup>+1</sup>' : ''}</span>
            <span class="fb-flight-card__code">${f.to}</span>
          </div>
        </div>

        <div class="fb-flight-card__bottom">
          <div class="fb-flight-card__tags">
            <span class="fb-tag">${f.cabin.charAt(0).toUpperCase() + f.cabin.slice(1)}</span>
            ${f.refundable ? '<span class="fb-tag fb-tag--green">Refundable</span>' : ''}
          </div>
          <button class="btn btn--primary btn--sm fb-select-flight" data-flight-id="${f.id}">Select</button>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════
  // STEP 3 — Passenger Details + Price
  // ══════════════════════════════════════

  _renderStep3() {
    const f = this._selectedOutbound;
    const p = this._searchParams;
    const paxCount = parseInt(p.passengers);
    const priceData = this._calculatePrice();
    const rules = FARE_RULES[p.cabin] || FARE_RULES.economy;
    const user = Auth.getCurrentUser();

    return `
      <!-- Itinerary Card -->
      <div class="hb-card fb-itinerary-card">
        <h2 class="hb-card__title">Flight Itinerary</h2>
        ${this._renderItinerarySegment(f, 'Outbound')}
        ${this._selectedReturn ? this._renderItinerarySegment(this._selectedReturn, 'Return') : ''}

        <!-- Fare Rules (expandable) -->
        <button type="button" class="hb-expandable" id="fareRulesToggle">
          <span>Fare rules & baggage <span class="text-muted">(${p.cabin})</span></span>
          <span class="hb-expandable__arrow">›</span>
        </button>
        <div class="hb-expandable__content" id="fareRulesContent" style="display:none;">
          <div class="fb-fare-rules">
            <div class="fb-fare-rule"><span class="fb-fare-rule__label">🧳 Baggage</span><span>${rules.baggage}</span></div>
            <div class="fb-fare-rule"><span class="fb-fare-rule__label">🔄 Change fee</span><span>${rules.changeFee}</span></div>
            <div class="fb-fare-rule"><span class="fb-fare-rule__label">❌ Cancellation</span><span>${rules.cancellation}</span></div>
            <div class="fb-fare-rule"><span class="fb-fare-rule__label">💺 Seat selection</span><span>${rules.seatSelection}</span></div>
            <div class="fb-fare-rule"><span class="fb-fare-rule__label">🍽️ Meal</span><span>${rules.meal}</span></div>
            <div class="fb-fare-rule"><span class="fb-fare-rule__label">🛋️ Lounge</span><span>${rules.lounge}</span></div>
          </div>
        </div>
      </div>

      <!-- Passenger Forms -->
      ${Array.from({ length: paxCount }, (_, i) => this._renderPassengerForm(i, paxCount, user)).join('')}

      <!-- Coupon Card -->
      <div class="hb-card hb-coupon-card">
        <div class="hb-coupon-header">
          <span class="hb-coupon-icon">🏷️</span>
          <span>Have a coupon code?</span>
        </div>
        <div class="hb-coupon-input" id="couponSection">
          ${this._couponApplied ? `
            <div class="hb-coupon-applied">
              <span class="hb-coupon-applied__code">${this._couponCode}</span>
              <button type="button" class="hb-coupon-remove" id="removeCoupon">Remove</button>
            </div>
          ` : `
            <div class="hb-coupon-form">
              <input type="text" id="couponInput" class="form-input hb-coupon-form__input" placeholder="Enter code" />
              <button type="button" class="btn btn--ghost hb-coupon-form__btn" id="applyCoupon">Apply</button>
            </div>
          `}
        </div>
      </div>

      <!-- Price Breakdown -->
      <div class="hb-card hb-price-card">
        <div class="hb-price-header">
          <h3 class="hb-price-header__title">Price break-up</h3>
          ${priceData.discountPercent > 0 ? `
            <span class="hb-price-badge">${Icons.checkCircle ? Icons.checkCircle(14) : '✓'} ${priceData.discountPercent}% off</span>
          ` : ''}
        </div>

        <div class="hb-price-row hb-price-row--room">
          <span>✈ ${f.airlineName} · ${f.flightNumber} · ${p.cabin}</span>
        </div>

        <div class="hb-price-row">
          <span>Base fare (${p.passengers} pax)</span>
          <span>AED ${priceData.baseFare.toLocaleString()}</span>
        </div>
        <div class="hb-price-row">
          <span>Taxes & fees</span>
          <span>AED ${priceData.taxes.toLocaleString()}</span>
        </div>
        <div class="hb-price-row">
          <span>Service fee</span>
          <span>AED ${priceData.serviceFee.toLocaleString()}</span>
        </div>

        ${priceData.offerDiscount > 0 ? `
          <div class="hb-price-row hb-price-row--discount">
            <span>Card benefit applied</span>
            <span>- AED ${priceData.offerDiscount.toLocaleString()}</span>
          </div>
        ` : ''}

        ${priceData.couponDiscount > 0 ? `
          <div class="hb-price-row hb-price-row--discount">
            <span>Coupon discount</span>
            <span>- AED ${priceData.couponDiscount.toLocaleString()}</span>
          </div>
        ` : ''}

        <div class="hb-price-total">
          <span>To pay</span>
          <span class="hb-price-total__amount">AED ${priceData.toPay.toLocaleString()}</span>
        </div>

        ${priceData.totalSaved > 0 ? `
          <div class="hb-price-saved">You save AED ${priceData.totalSaved.toLocaleString()} with your ENBD card!</div>
        ` : ''}

        <div class="hb-price-match">
          <span class="hb-price-match__icon">🎖️</span>
          <span class="hb-price-match__text">We price match <span class="hb-price-match__dot">·</span> Find it for less, and we'll match …</span>
          <span class="hb-price-match__info">ⓘ</span>
        </div>
      </div>

      <!-- Special Requests -->
      <div class="hb-card hb-special-requests">
        <button type="button" class="hb-expandable" id="specialRequestsToggle">
          <span>Special requests! <span class="text-muted">(Optional)</span></span>
          <span class="hb-expandable__arrow">›</span>
        </button>
        <div class="hb-expandable__content" id="specialRequestsContent" style="display:none;">
          <div class="request-chips" id="requestChips" style="margin-top:12px;">
            <button type="button" class="request-chip" data-value="Window seat">Window Seat</button>
            <button type="button" class="request-chip" data-value="Extra legroom">Extra Legroom</button>
            <button type="button" class="request-chip" data-value="Meal preference">Meal Preference</button>
            <button type="button" class="request-chip" data-value="Wheelchair assistance">Wheelchair</button>
            <button type="button" class="request-chip" data-value="Travel insurance">Insurance</button>
            <button type="button" class="request-chip" data-value="Priority boarding">Priority Boarding</button>
          </div>
          <textarea id="specialRequests" class="form-input" rows="2" placeholder="Any other requests..." style="margin-top:10px;"></textarea>
        </div>
      </div>

      <!-- Terms -->
      <div class="hb-terms">
        <label class="hb-terms__label">
          <input type="checkbox" id="fbAgreeTerms" class="hb-terms__checkbox" />
          <span class="hb-terms__check">${Icons.check ? Icons.check(12) : '✓'}</span>
          <span>By proceeding, you agree to Visa Infinite's <a href="javascript:void(0)" class="hb-terms__link">Privacy Policy</a> and <a href="javascript:void(0)" class="hb-terms__link">Terms & Conditions</a></span>
        </label>
      </div>
    `;
  },

  _renderItinerarySegment(f, label) {
    return `
      <div class="fb-itinerary">
        <div class="fb-itinerary__label">${label}</div>
        <div class="fb-itinerary__segment">
          <div class="fb-itinerary__col">
            <div class="fb-itinerary__time">${f.departureTime}</div>
            <div class="fb-itinerary__city">${f.fromCity} (${f.from})</div>
            <div class="fb-itinerary__date">${Format.date(this._searchParams.departureDate)}</div>
          </div>
          <div class="fb-itinerary__mid">
            <div class="fb-itinerary__airline">${f.airlineCode} · ${f.flightNumber}</div>
            <div class="fb-itinerary__track"><div class="fb-itinerary__track-line"></div><span class="fb-itinerary__plane">✈</span></div>
            <div class="fb-itinerary__dur">${this._formatDuration(f.durationMin)} · ${f.stops === 0 ? 'Direct' : f.stops + ' stop'}</div>
          </div>
          <div class="fb-itinerary__col fb-itinerary__col--end">
            <div class="fb-itinerary__time">${f.arrivalTime}${f.nextDay ? '<sup>+1</sup>' : ''}</div>
            <div class="fb-itinerary__city">${f.toCity} (${f.to})</div>
            <div class="fb-itinerary__date">${Format.date(this._searchParams.departureDate)}</div>
          </div>
        </div>
      </div>
    `;
  },

  _renderPassengerForm(index, total, user) {
    const isPrimary = index === 0;
    const pax = this._passengers[index] || {};

    // Demo defaults for smooth prototype flow
    const demoNames = [
      { first: user.name.split(' ')[0] || 'Sophia', last: user.name.split(' ').slice(1).join(' ') || 'Ahmed' },
      { first: 'Omar', last: 'Hassan' },
      { first: 'Sara', last: 'Ahmed' },
      { first: 'Khalid', last: 'Ibrahim' },
    ];
    const demo = demoNames[index] || demoNames[0];
    const demoDob = '1990-05-15';
    const demoPassport = `AB${1234567 + index}`;
    const demoPassportExpiry = '2028-12-15';
    const demoEmail = isPrimary ? (user.email || 'layla@demo.ae') : '';
    const demoPhone = isPrimary ? '50 123 4567' : '';

    return `
      <div class="hb-card fb-passenger-card">
        <h2 class="hb-card__title">Passenger ${index + 1} ${total > 1 ? `of ${total}` : ''} ${isPrimary ? '<span class="text-muted">(Primary)</span>' : ''}</h2>

        <div class="hb-title-pills" data-pax="${index}">
          <button type="button" class="hb-title-pill ${(pax.title || 'Mr') === 'Mr' ? 'hb-title-pill--active' : ''}" data-title="Mr">Mr</button>
          <button type="button" class="hb-title-pill ${pax.title === 'Ms' ? 'hb-title-pill--active' : ''}" data-title="Ms">Ms</button>
          <button type="button" class="hb-title-pill ${pax.title === 'Mrs' ? 'hb-title-pill--active' : ''}" data-title="Mrs">Mrs</button>
        </div>

        <div class="fb-form-row">
          <div class="form-group" style="flex:1">
            <label class="form-label">First Name <span class="hb-required">*</span></label>
            <input type="text" class="form-input fb-pax-field" data-pax="${index}" data-field="firstName" placeholder="First name" value="${pax.firstName || demo.first}" />
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">Last Name <span class="hb-required">*</span></label>
            <input type="text" class="form-input fb-pax-field" data-pax="${index}" data-field="lastName" placeholder="Last name" value="${pax.lastName || demo.last}" />
          </div>
        </div>

        <div class="fb-form-row">
          <div class="form-group" style="flex:1">
            <label class="form-label">Date of Birth <span class="hb-required">*</span></label>
            <input type="date" class="form-input fb-pax-field" data-pax="${index}" data-field="dob" max="${new Date().toISOString().split('T')[0]}" value="${pax.dob || demoDob}" />
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">Nationality <span class="hb-required">*</span></label>
            <select class="form-input form-select fb-pax-field" data-pax="${index}" data-field="nationality">
              <option value="">Select</option>
              <option value="AE" selected>UAE</option>
              <option value="IN">India</option>
              <option value="PK">Pakistan</option>
              <option value="PH">Philippines</option>
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="EG">Egypt</option>
              <option value="LK">Sri Lanka</option>
              <option value="BD">Bangladesh</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div class="fb-form-row">
          <div class="form-group" style="flex:1">
            <label class="form-label">Passport No. <span class="hb-required">*</span></label>
            <input type="text" class="form-input fb-pax-field" data-pax="${index}" data-field="passport" placeholder="e.g. AB1234567" value="${pax.passport || demoPassport}" />
          </div>
          <div class="form-group" style="flex:1">
            <label class="form-label">Passport Expiry <span class="hb-required">*</span></label>
            <input type="date" class="form-input fb-pax-field" data-pax="${index}" data-field="passportExpiry" min="${new Date().toISOString().split('T')[0]}" value="${pax.passportExpiry || demoPassportExpiry}" />
          </div>
        </div>

        ${isPrimary ? `
          <div class="fb-form-row">
            <div class="form-group" style="flex:1">
              <label class="form-label">Email <span class="hb-required">*</span></label>
              <input type="email" class="form-input fb-pax-field" data-pax="${index}" data-field="email" placeholder="Enter email" value="${pax.email || demoEmail}" />
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label">Phone <span class="hb-required">*</span></label>
              <div class="hb-phone-input">
                <div class="hb-phone-input__prefix">
                  <span class="hb-phone-input__flag">🇦🇪</span>
                  <span class="hb-phone-input__code">+971</span>
                </div>
                <input type="tel" class="form-input hb-phone-input__field fb-pax-field" data-pax="${index}" data-field="phone" placeholder="50 123 4567" value="${pax.phone || demoPhone}" />
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Optional extras (expandable) -->
        <button type="button" class="hb-expandable fb-extras-toggle" data-pax="${index}">
          <span>Extras <span class="text-muted">(Optional)</span></span>
          <span class="hb-expandable__arrow">›</span>
        </button>
        <div class="hb-expandable__content fb-extras-content" data-pax="${index}" style="display:none;">
          <div class="form-group" style="margin-top:10px;">
            <label class="form-label">Frequent Flyer Number</label>
            <input type="text" class="form-input fb-pax-field" data-pax="${index}" data-field="ffn" placeholder="e.g. EK 12345678" />
          </div>
          <div class="fb-form-row">
            <div class="form-group" style="flex:1">
              <label class="form-label">Seat Preference</label>
              <select class="form-input form-select fb-pax-field" data-pax="${index}" data-field="seat">
                <option value="">No preference</option>
                <option value="window">Window</option>
                <option value="aisle">Aisle</option>
                <option value="middle">Middle</option>
              </select>
            </div>
            <div class="form-group" style="flex:1">
              <label class="form-label">Meal Preference</label>
              <select class="form-input form-select fb-pax-field" data-pax="${index}" data-field="meal">
                <option value="">Standard</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="halal">Halal</option>
                <option value="kosher">Kosher</option>
                <option value="gluten-free">Gluten Free</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════
  // STEP 4 — Confirmation
  // ══════════════════════════════════════

  _renderStep4() {
    const f = this._selectedOutbound;
    const p = this._searchParams;
    const priceData = this._calculatePrice();
    const user = Auth.getCurrentUser();
    const pax0 = this._passengers[0] || {};

    return `
      <div class="hb-card">
        <div class="booking-step">
          <div class="steps">
            <div class="step completed"><span class="step__circle">${Icons.check(14)}</span><span class="step__label">Search</span></div>
            <div class="step__line completed"></div>
            <div class="step completed"><span class="step__circle">${Icons.check(14)}</span><span class="step__label">Details</span></div>
            <div class="step__line completed"></div>
            <div class="step active"><span class="step__circle">3</span><span class="step__label">Confirm</span></div>
          </div>
        </div>

        <h2 class="hb-card__title" style="margin-top:20px;">Confirm Your Booking</h2>

        <div class="booking-confirm-details">
          <div class="booking-confirm-row">
            <span class="text-muted">Flight</span>
            <span class="text-semibold">${f.airlineName} ${f.flightNumber}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Route</span>
            <span>${f.fromCity} (${f.from}) → ${f.toCity} (${f.to})</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Departure</span>
            <span>${f.departureTime} · ${Format.date(p.departureDate)}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Arrival</span>
            <span>${f.arrivalTime}${f.nextDay ? ' (+1)' : ''}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Cabin</span>
            <span>${p.cabin.charAt(0).toUpperCase() + p.cabin.slice(1)}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Passengers</span>
            <span>${p.passengers} · ${pax0.title || 'Mr'} ${pax0.firstName} ${pax0.lastName}${parseInt(p.passengers) > 1 ? ' + ' + (parseInt(p.passengers) - 1) + ' more' : ''}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Phone</span>
            <span>+971 ${pax0.phone}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Email</span>
            <span>${pax0.email}</span>
          </div>
          ${this._couponApplied ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Coupon</span>
              <span class="text-semibold" style="color:var(--success)">${this._couponCode}</span>
            </div>
          ` : ''}
          <div class="booking-confirm-row">
            <span class="text-muted">Total</span>
            <span class="text-semibold" style="font-size:18px">AED ${priceData.toPay.toLocaleString()}</span>
          </div>
          ${priceData.totalSaved > 0 ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Saved</span>
              <span style="color:var(--success);font-weight:600;">AED ${priceData.totalSaved.toLocaleString()}</span>
            </div>
          ` : ''}
          <div class="booking-confirm-row">
            <span class="text-muted">Card</span>
            <span>${Format.tierLabel(user.cardTier)} ${user.cardNumber}</span>
          </div>
        </div>

        <div class="hb-confirm-footer">
          <div class="booking-reassurance">
            ${Icons.shield(14)}
            <span>Your card will only be validated. No charge will be made now.</span>
          </div>
          <div class="flex gap-md">
            <button class="btn btn--ghost btn--lg" id="backToStep3" style="flex:1">Back</button>
            <button class="btn btn--primary btn--lg" id="confirmBookingBtn" style="flex:2">Confirm Booking</button>
          </div>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════
  // PRICE CALCULATOR
  // ══════════════════════════════════════

  _calculatePrice() {
    const f = this._selectedOutbound;
    if (!f) return { baseFare: 0, taxes: 0, serviceFee: 0, offerDiscount: 0, couponDiscount: 0, toPay: 0, totalSaved: 0, discountPercent: 0 };
    const paxCount = parseInt(this._searchParams.passengers);
    const baseFare = f.pricePerPerson * paxCount;
    const taxes = Math.round(baseFare * 0.12);
    const serviceFee = 75;
    const subtotal = baseFare + taxes + serviceFee;

    // Offer discount
    let discountPercent = 0;
    if (this._offer.discountValue && this._offer.discountUnit === 'percent') {
      discountPercent = this._offer.discountValue;
    } else if (this._offer.discountValue && this._offer.discountUnit === 'aed') {
      discountPercent = Math.round((this._offer.discountValue / baseFare) * 100);
    } else {
      const defaults = { bogo: 33, complimentary: 25, upgrade: 20, cashback: 15 };
      discountPercent = defaults[this._offer.offerType] || 10;
    }
    const offerDiscount = f.hasOfferDiscount ? Math.round(baseFare * discountPercent / 100) : 0;
    const couponDiscount = this._couponApplied ? 200 : 0;
    const toPay = Math.max(0, subtotal - offerDiscount - couponDiscount);
    const totalSaved = subtotal - toPay;

    return { baseFare, taxes, serviceFee, offerDiscount, couponDiscount, toPay, totalSaved, discountPercent };
  },

  // ══════════════════════════════════════
  // VALIDATION HELPERS
  // ══════════════════════════════════════

  _showFieldError(field, message) {
    if (!field) return;
    field.classList.add('form-input--error');
    const errEl = document.createElement('div');
    errEl.className = 'hb-field-error';
    errEl.textContent = message;
    const parent = field.closest('.hb-phone-input') || field;
    parent.parentNode.insertBefore(errEl, parent.nextSibling);
    const clearError = () => {
      field.classList.remove('form-input--error');
      if (errEl.parentNode) errEl.remove();
      field.removeEventListener('input', clearError);
      field.removeEventListener('change', clearError);
    };
    field.addEventListener('input', clearError);
    field.addEventListener('change', clearError);
  },

  _collectPassengers() {
    const p = this._searchParams;
    const paxCount = parseInt(p.passengers);
    const passengers = [];
    for (let i = 0; i < paxCount; i++) {
      const get = (field) => {
        const el = document.querySelector(`.fb-pax-field[data-pax="${i}"][data-field="${field}"]`);
        return el ? el.value.trim() : '';
      };
      const titleBtn = document.querySelector(`.hb-title-pills[data-pax="${i}"] .hb-title-pill--active`);
      passengers.push({
        title: titleBtn ? titleBtn.dataset.title : 'Mr',
        firstName: get('firstName'),
        lastName: get('lastName'),
        dob: get('dob'),
        nationality: get('nationality'),
        passport: get('passport'),
        passportExpiry: get('passportExpiry'),
        email: get('email'),
        phone: get('phone'),
        ffn: get('ffn'),
        seat: get('seat'),
        meal: get('meal'),
      });
    }
    return passengers;
  },

  _validateStep3() {
    $$('.hb-field-error').forEach(el => el.remove());
    $$('.form-input--error').forEach(el => el.classList.remove('form-input--error'));

    const passengers = this._collectPassengers();
    let firstError = null;

    for (let i = 0; i < passengers.length; i++) {
      const pax = passengers[i];
      const getEl = (field) => document.querySelector(`.fb-pax-field[data-pax="${i}"][data-field="${field}"]`);

      if (!pax.firstName) { const el = getEl('firstName'); this._showFieldError(el, 'First name is required'); if (!firstError) firstError = el; }
      if (!pax.lastName)  { const el = getEl('lastName');  this._showFieldError(el, 'Last name is required');  if (!firstError) firstError = el; }
      if (!pax.dob)       { const el = getEl('dob');       this._showFieldError(el, 'Date of birth is required'); if (!firstError) firstError = el; }
      if (!pax.nationality){ const el = getEl('nationality'); this._showFieldError(el, 'Nationality is required'); if (!firstError) firstError = el; }
      if (!pax.passport)  { const el = getEl('passport');  this._showFieldError(el, 'Passport number is required'); if (!firstError) firstError = el; }
      if (!pax.passportExpiry){ const el = getEl('passportExpiry'); this._showFieldError(el, 'Passport expiry is required'); if (!firstError) firstError = el; }

      if (i === 0) {
        if (!pax.email || !pax.email.includes('@')) { const el = getEl('email'); this._showFieldError(el, pax.email ? 'Enter a valid email' : 'Email is required'); if (!firstError) firstError = el; }
        if (!pax.phone) { const el = getEl('phone'); this._showFieldError(el, 'Phone is required'); if (!firstError) firstError = el; }
      }
    }

    const agreed = $('#fbAgreeTerms')?.checked;
    if (!agreed) {
      const termsWrap = document.querySelector('.hb-terms');
      if (termsWrap) {
        const errEl = document.createElement('div');
        errEl.className = 'hb-field-error';
        errEl.textContent = 'You must agree to the Terms & Conditions';
        termsWrap.appendChild(errEl);
      }
      if (!firstError) firstError = $('#fbAgreeTerms');
    }

    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError.focus();
      return null;
    }

    return passengers;
  },

  // ══════════════════════════════════════
  // MOUNT (Event Delegation)
  // ══════════════════════════════════════

  mount() {
    Nav.mount();

    // ── Step 1: Search ──
    delegate('#app', 'click', '#swapAirports', () => {
      const fromEl = $('#fbFrom');
      const toEl = $('#fbTo');
      if (fromEl && toEl) {
        const tmp = fromEl.value;
        fromEl.value = toEl.value;
        toEl.value = tmp;
      }
    });

    delegate('#app', 'click', '.fb-quick-filters .request-chip', (e) => {
      e.target.classList.toggle('request-chip--selected');
      if (e.target.dataset.value === 'direct') {
        this._directOnly = e.target.classList.contains('request-chip--selected');
      }
    });

    // ── Step 2: Sort pills ──
    delegate('#app', 'click', '.fb-sort-pill', (e) => {
      const btn = e.target.closest('.fb-sort-pill');
      if (!btn) return;
      this._sortBy = btn.dataset.sort;
      const form = $('#flightBookingForm');
      if (form) form.innerHTML = this._renderStep2();
    });

    // ── Step 2: Filter changes ──
    delegate('#app', 'change', '#filterStops', (e) => {
      this._filterStops = e.target.value;
      const form = $('#flightBookingForm');
      if (form) form.innerHTML = this._renderStep2();
    });

    delegate('#app', 'change', '.fb-airline-check', () => {
      this._filterAirlines = Array.from($$('.fb-airline-check:checked')).map(cb => cb.value);
      const form = $('#flightBookingForm');
      if (form) form.innerHTML = this._renderStep2();
    });

    delegate('#app', 'change', '#filterRefundable', (e) => {
      this._filterRefundable = e.target.checked;
      const form = $('#flightBookingForm');
      if (form) form.innerHTML = this._renderStep2();
    });

    // ── Step 2: Select flight ──
    delegate('#app', 'click', '.fb-select-flight', (e) => {
      const btn = e.target.closest('.fb-select-flight');
      if (!btn) return;
      const flightId = btn.dataset.flightId;
      this._selectedOutbound = this._flightResults.find(f => f.id === flightId);
      if (!this._selectedOutbound) return;

      this._step = 3;
      const form = $('#flightBookingForm');
      if (form) form.innerHTML = this._renderStep3();
      window.scrollTo(0, 0);
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // ── Step 2: Edit search ──
    delegate('#app', 'click', '#editSearch', () => {
      this._step = 1;
      const form = $('#flightBookingForm');
      if (form) form.innerHTML = this._renderStep1();
      window.scrollTo(0, 0);
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // ── Step 3: Title pills ──
    delegate('#app', 'click', '.hb-title-pill', (e) => {
      const btn = e.target.closest('.hb-title-pill');
      if (!btn) return;
      const pills = btn.closest('.hb-title-pills');
      if (pills) {
        pills.querySelectorAll('.hb-title-pill').forEach(p => p.classList.remove('hb-title-pill--active'));
        btn.classList.add('hb-title-pill--active');
      }
    });

    // ── Step 3: Expandable toggles ──
    delegate('#app', 'click', '#fareRulesToggle', () => {
      const content = $('#fareRulesContent');
      const arrow = document.querySelector('#fareRulesToggle .hb-expandable__arrow');
      if (content) { content.style.display = content.style.display === 'none' ? 'block' : 'none'; if (arrow) arrow.textContent = content.style.display === 'none' ? '›' : '⌄'; }
    });

    delegate('#app', 'click', '#specialRequestsToggle', () => {
      const content = $('#specialRequestsContent');
      const arrow = document.querySelector('#specialRequestsToggle .hb-expandable__arrow');
      if (content) { content.style.display = content.style.display === 'none' ? 'block' : 'none'; if (arrow) arrow.textContent = content.style.display === 'none' ? '›' : '⌄'; }
    });

    delegate('#app', 'click', '.fb-extras-toggle', (e) => {
      const btn = e.target.closest('.fb-extras-toggle');
      const pax = btn?.dataset.pax;
      const content = document.querySelector(`.fb-extras-content[data-pax="${pax}"]`);
      const arrow = btn?.querySelector('.hb-expandable__arrow');
      if (content) { content.style.display = content.style.display === 'none' ? 'block' : 'none'; if (arrow) arrow.textContent = content.style.display === 'none' ? '›' : '⌄'; }
    });

    // ── Step 3: Request chips ──
    delegate('#app', 'click', '.request-chip', (e) => {
      e.target.classList.toggle('request-chip--selected');
    });

    // ── Step 3: Coupon ──
    delegate('#app', 'click', '#applyCoupon', () => {
      const input = $('#couponInput');
      if (input && input.value.trim()) {
        this._couponApplied = true;
        this._couponCode = input.value.trim().toUpperCase();
        const form = $('#flightBookingForm');
        if (form) form.innerHTML = this._renderStep3();
      }
    });
    delegate('#app', 'click', '#removeCoupon', () => {
      this._couponApplied = false;
      this._couponCode = '';
      const form = $('#flightBookingForm');
      if (form) form.innerHTML = this._renderStep3();
    });

    // ── Step 3 → Step 4 ──
    delegate('#app', 'click', '#toStep4Btn', () => { this._goToStep4(); });

    // ── Step 4: Back / Confirm ──
    delegate('#app', 'click', '#backToStep3', () => {
      this._step = 3;
      const form = $('#flightBookingForm');
      if (form) form.innerHTML = this._renderStep3();
      window.scrollTo(0, 0);
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    delegate('#app', 'click', '#confirmBookingBtn', () => { this._confirmBooking(); });

    // ── Sticky CTA ──
    delegate('#app', 'click', '#stickyContinueBtn', () => {
      if (this._step === 1) this._doSearch();
      else if (this._step === 2) { /* do nothing until flight selected */ }
      else if (this._step === 3) this._goToStep4();
      else if (this._step === 4) this._confirmBooking();
    });

    this._setupStickyObserver();

    // Auto-search: if landing page passed search params, skip step 1 & loading
    const storedSearch = sessionStorage.getItem('_flight_search');
    if (storedSearch) {
      sessionStorage.removeItem('_flight_search');
      try {
        const params = JSON.parse(storedSearch);
        this._searchParams = params;

        // Generate results and go straight to step 2 (loading already shown on landing page)
        this._flightResults = this._generateFlightResults();
        this._step = 2;
        const form = $('#flightBookingForm');
        if (form) form.innerHTML = this._renderStep2();
        window.scrollTo(0, 0);
        this._updateStickyCta();
        this._setupStickyObserver();
      } catch (e) {
        // ignore parse errors
      }
    }
  },

  // ── Search action ──
  _doSearch() {
    // Clear previous inline errors
    $$('.fb-search-card .hb-field-error').forEach(el => el.remove());
    $$('.fb-search-card .form-input--error').forEach(el => el.classList.remove('form-input--error'));

    const fromEl = $('#fbFrom');
    const toEl = $('#fbTo');
    const departEl = $('#fbDepart');
    const from = fromEl?.value;
    const to = toEl?.value;
    const depart = departEl?.value;
    const ret = $('#fbReturn')?.value;
    const pax = $('#fbPassengers')?.value || '1';
    const cabin = $('#fbCabin')?.value || 'economy';

    let hasError = false;
    let firstError = null;

    if (!from) {
      this._showFieldError(fromEl, 'Please select a departure airport');
      if (!firstError) firstError = fromEl;
      hasError = true;
    }
    if (!to) {
      this._showFieldError(toEl, 'Please select a destination airport');
      if (!firstError) firstError = toEl;
      hasError = true;
    }
    if (from && to && from === to) {
      this._showFieldError(toEl, 'Destination cannot be the same as departure');
      if (!firstError) firstError = toEl;
      hasError = true;
    }
    if (!depart) {
      this._showFieldError(departEl, 'Please select a departure date');
      if (!firstError) firstError = departEl;
      hasError = true;
    }

    if (hasError) {
      if (firstError) { firstError.scrollIntoView({ behavior: 'smooth', block: 'center' }); firstError.focus(); }
      return;
    }

    this._searchParams = { from, to, departureDate: depart, returnDate: ret || null, passengers: pax, cabin };
    if (this._directOnly) this._filterStops = 'direct';

    // Get airport names for the loading screen
    const fromCity = FLIGHT_AIRPORTS.find(a => a.code === from)?.city || from;
    const toCity   = FLIGHT_AIRPORTS.find(a => a.code === to)?.city || to;

    // Show loading animation
    const form = $('#flightBookingForm');
    if (form) {
      form.innerHTML = `
        <div class="fb-loading">
          <div class="fb-loading__clouds">
            <span class="fb-loading__cloud">☁️</span>
            <span class="fb-loading__cloud">☁️</span>
            <span class="fb-loading__cloud">☁️</span>
            <span class="fb-loading__cloud">☁️</span>
            <span class="fb-loading__cloud">☁️</span>
          </div>
          <div class="fb-loading__plane">✈️</div>
          <div class="fb-loading__text">Searching flights<span class="fb-loading__dots"></span></div>
          <div class="fb-loading__sub">Finding the best deals for you</div>
          <div class="fb-loading__progress"><div class="fb-loading__progress-bar"></div></div>
          <div class="fb-loading__route">${from} → ${to} · ${fromCity} to ${toCity}</div>
        </div>
      `;
    }
    window.scrollTo(0, 0);

    // Hide sticky CTA during loading
    const stickyCta = $('#booking-sticky-cta');
    if (stickyCta) stickyCta.classList.remove('booking-sticky-cta--visible');

    // After 5 seconds, generate results and show Step 2
    setTimeout(() => {
      this._flightResults = this._generateFlightResults();
      this._step = 2;
      const f = $('#flightBookingForm');
      if (f) f.innerHTML = this._renderStep2();
      window.scrollTo(0, 0);
      this._updateStickyCta();
      this._setupStickyObserver();
    }, 5000);
  },

  // ── Step 3 → 4 transition ──
  _goToStep4() {
    const passengers = this._validateStep3();
    if (!passengers) return;
    this._passengers = passengers;

    // Collect special requests
    const chipValues = Array.from(document.querySelectorAll('#requestChips .request-chip--selected')).map(c => c.dataset.value);
    const textareaVal = ($('#specialRequests')?.value || '').trim();
    this._specialReqs = [...chipValues, textareaVal].filter(Boolean).join(', ');

    this._step = 4;
    const form = $('#flightBookingForm');
    if (form) form.innerHTML = this._renderStep4();
    window.scrollTo(0, 0);
    this._updateStickyCta();
    this._setupStickyObserver();
  },

  // ── Confirm booking ──
  _confirmBooking() {
    const pax0 = this._passengers[0] || {};
    const priceData = this._calculatePrice();
    const f = this._selectedOutbound;

    const booking = Store.createBooking({
      offerId: this._offer.id,
      type: 'flight',
      bookingDate: this._searchParams.departureDate,
      partySize: parseInt(this._searchParams.passengers),
      timePreference: f.departureTime,
      specialRequests: this._specialReqs || '',
    });

    // Hide sticky CTA
    if (this._stickyObserver) { this._stickyObserver.disconnect(); this._stickyObserver = null; }
    const stickyCta = $('#booking-sticky-cta');
    if (stickyCta) stickyCta.classList.remove('booking-sticky-cta--visible');

    const form = $('#flightBookingForm');
    if (form) {
      form.innerHTML = `
        <div class="hb-card">
          <div class="booking-success">
            <div class="booking-success__icon">${Icons.checkCircle(48)}</div>
            <h2 class="booking-success__title page-title">Booking Confirmed!</h2>
            <p class="booking-success__text">Your flight with ${f.airlineName} (${f.flightNumber}) has been booked.</p>
            <div class="confirmation-code">${booking.confirmationCode}</div>
            <p class="text-sm text-muted" style="margin-top:8px">Save this confirmation code</p>

            <div class="hb-success-summary">
              <div class="hb-success-row"><span>Flight</span><span>${f.airlineName} ${f.flightNumber}</span></div>
              <div class="hb-success-row"><span>Route</span><span>${f.from} → ${f.to}</span></div>
              <div class="hb-success-row"><span>Departure</span><span>${f.departureTime} · ${Format.date(this._searchParams.departureDate)}</span></div>
              <div class="hb-success-row"><span>Passengers</span><span>${this._searchParams.passengers}</span></div>
              <div class="hb-success-row"><span>Total Paid</span><span class="text-semibold">AED ${priceData.toPay.toLocaleString()}</span></div>
            </div>

            <div class="flex gap-md" style="margin-top:24px">
              <button class="btn btn--ghost btn--lg" onclick="Router.navigate('/home')" style="flex:1">Home</button>
              <button class="btn btn--primary btn--lg" onclick="Router.navigate('/my-bookings/${booking.id}')" style="flex:2">View Booking</button>
            </div>
          </div>
        </div>
      `;
    }
  },

  // ══════════════════════════════════════
  // STICKY CTA + OBSERVER
  // ══════════════════════════════════════

  _updateStickyCta() {
    const stickyBtn = $('#stickyContinueBtn');
    if (stickyBtn) stickyBtn.textContent = this._ctaLabels[this._step] || 'Continue';
  },

  _setupStickyObserver() {
    if (this._stickyObserver) { this._stickyObserver.disconnect(); this._stickyObserver = null; }
    const stickyCta = $('#booking-sticky-cta');
    if (!stickyCta) return;

    if (this._step === 1 || this._step === 3) {
      // Always show sticky for search & passenger steps (no inline CTA)
      stickyCta.classList.add('booking-sticky-cta--visible');
    } else if (this._step === 2) {
      // Hide sticky on results (user picks a flight card instead)
      stickyCta.classList.remove('booking-sticky-cta--visible');
    } else {
      // Step 4: observe the inline confirm button
      requestAnimationFrame(() => {
        const inlineBtn = document.querySelector('#flightBookingForm .btn--primary');
        if (inlineBtn) {
          this._stickyObserver = new IntersectionObserver(([entry]) => {
            stickyCta.classList.toggle('booking-sticky-cta--visible', !entry.isIntersecting);
          }, { threshold: 0 });
          this._stickyObserver.observe(inlineBtn);
        }
      });
    }
  },

  unmount() {
    if (this._stickyObserver) { this._stickyObserver.disconnect(); this._stickyObserver = null; }
  },

  // ══════════════════════════════════════
  // NOT FOUND
  // ══════════════════════════════════════

  _notFound() {
    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="empty-state" style="padding-top:80px">
              <div class="empty-state__icon">${Icons.search(48)}</div>
              <h2 class="empty-state__title">Offer Not Found</h2>
              <p class="empty-state__text">This flight offer may have expired or been removed.</p>
              <button class="btn btn--primary" onclick="Router.navigate('/home')">Back to Home</button>
            </div>
          </div>
        </main>
      </div>
    `;
  },
};

window.FlightBookingPage = FlightBookingPage;
