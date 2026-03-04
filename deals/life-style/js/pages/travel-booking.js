// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Travel Booking Page
// ══════════════════════════════════════════════

const TravelBookingPage = {
  _offerId: null,
  _offer: null,
  _event: null,
  _merchant: null,
  _step: 1,
  _formData: null,
  _stickyObserver: null,

  render(params) {
    const rawId = params.offerId;

    this._offer = (Store.get('offers') || []).find(o => o.id === rawId);
    if (!this._offer) return this._notFound();
    this._offerId = rawId;
    this._event = null;
    this._merchant = Store.getMerchant(this._offer.merchantId);

    this._step = 1;
    this._formData = null;
    const title = this._offer.title;
    const image = this._offer.image;

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full page__main--booking">
          <div class="container">
            <div class="breadcrumb">
              <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="Router.navigate('/category/travel')">Travel</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">${title}</span>
            </div>

            <div class="booking-layout">
              <!-- Summary Panel -->
              <div class="booking-summary">
                <div class="booking-summary__image">
                  <img src="${image}" alt="${title}" />
                </div>
                <h3 class="booking-summary__title">${title}</h3>
                <div class="booking-summary__detail">${this._merchant ? this._merchant.name : ''}</div>
                ${this._merchant ? `<div class="booking-summary__detail">${Icons.mapPin(14)} ${this._merchant.location || this._merchant.area || ''}</div>` : ''}
                <div class="booking-summary__badge">
                  <span class="discount-badge ${Format.discountBadgeClass(this._offer)}">${Format.discountLabel(this._offer)}</span>
                </div>
              </div>

              <!-- Booking Form -->
              <div class="booking-form" id="bookingForm">
                ${this._renderStep1()}
              </div>
            </div>
          </div>
        </main>

        <!-- Sticky Mobile CTA -->
        <div class="booking-sticky-cta" id="booking-sticky-cta">
          <button class="btn btn--primary btn--lg booking-sticky-cta__btn" id="stickyContinueBtn">
            Continue to Confirmation
          </button>
        </div>
      </div>
    `;
  },

  // ── Helpers ──

  _getTravelType() {
    const tags = this._offer ? (this._offer.tags || []) : [];
    const title = (this._offer ? this._offer.title : '').toLowerCase();

    if (tags.includes('flights') || tags.includes('flight') || title.includes('flight')) return 'flight';
    if (tags.includes('hotel') || tags.includes('staycation') || title.includes('hotel') || title.includes('night') || title.includes('staycation') || title.includes('stay')) return 'hotel';
    if (tags.includes('holidays') || tags.includes('packages') || title.includes('holiday') || title.includes('package')) return 'holiday';
    if (tags.includes('cruise') || title.includes('cruise')) return 'cruise';
    if (tags.includes('desert') || tags.includes('safari') || tags.includes('adventure') || title.includes('safari') || title.includes('adventure') || title.includes('tour')) return 'adventure';
    if (tags.includes('airport') || tags.includes('lounge') || title.includes('lounge') || title.includes('airport')) return 'lounge';
    return 'general';
  },

  _renderReminder() {
    const title = this._offer.title;
    const image = this._offer.image;
    const meta = this._merchant
      ? `${this._merchant.name} · ${Format.discountLabel(this._offer)}`
      : Format.discountLabel(this._offer);
    return `
      <div class="booking-reminder">
        <img src="${image}" alt="" class="booking-reminder__img" />
        <div class="booking-reminder__info">
          <div class="booking-reminder__title">${title}</div>
          <div class="booking-reminder__meta">${meta}</div>
        </div>
      </div>
    `;
  },

  _renderProgressStep1() {
    return `
      <div class="steps">
        <div class="step active">
          <span class="step__circle">1</span>
          <span class="step__label">Details</span>
        </div>
        <div class="step__line"></div>
        <div class="step">
          <span class="step__circle">2</span>
          <span class="step__label">Confirmation</span>
        </div>
      </div>
    `;
  },

  _renderProgressStep2() {
    return `
      <div class="steps">
        <div class="step completed">
          <span class="step__circle">${Icons.check(14)}</span>
          <span class="step__label">Details</span>
        </div>
        <div class="step__line completed"></div>
        <div class="step active">
          <span class="step__circle">2</span>
          <span class="step__label">Confirmation</span>
        </div>
      </div>
    `;
  },

  _renderReassurance() {
    return `
      <div class="booking-reassurance">
        ${Icons.shield(14)}
        <span>Your card will only be validated. No charge will be made now.</span>
      </div>
    `;
  },

  _renderChips() {
    const travelType = this._getTravelType();

    const chipSets = {
      'flight': [
        { value: 'Window seat', label: 'Window Seat' },
        { value: 'Extra legroom', label: 'Extra Legroom' },
        { value: 'Meal preference', label: 'Meal Pref' },
        { value: 'Wheelchair assistance', label: 'Wheelchair' },
        { value: 'Travel insurance', label: 'Insurance' },
      ],
      'hotel': [
        { value: 'Late checkout', label: 'Late Checkout' },
        { value: 'Early check-in', label: 'Early Check-in' },
        { value: 'High floor', label: 'High Floor' },
        { value: 'Sea view', label: 'Sea View' },
        { value: 'Airport transfer', label: 'Airport Transfer' },
        { value: 'Extra bed', label: 'Extra Bed' },
      ],
      'holiday': [
        { value: 'Airport transfer', label: 'Airport Transfer' },
        { value: 'Travel insurance', label: 'Insurance' },
        { value: 'Guided tours', label: 'Guided Tours' },
        { value: 'All-inclusive', label: 'All-Inclusive' },
        { value: 'Kids club', label: 'Kids Club' },
      ],
      'cruise': [
        { value: 'Balcony cabin', label: 'Balcony Cabin' },
        { value: 'Dining package', label: 'Dining Package' },
        { value: 'Excursion package', label: 'Excursions' },
        { value: 'Wheelchair access', label: 'Wheelchair' },
        { value: 'Anniversary celebration', label: 'Anniversary' },
      ],
      'adventure': [
        { value: 'Hotel pickup', label: 'Hotel Pickup' },
        { value: 'Photography package', label: 'Photography' },
        { value: 'VIP upgrade', label: 'VIP Upgrade' },
        { value: 'Kids friendly', label: 'Kids Friendly' },
        { value: 'Vegetarian meal', label: 'Veg Meal' },
      ],
      'lounge': [
        { value: 'Extra guest', label: 'Extra Guest' },
        { value: 'Shower access', label: 'Shower Access' },
        { value: 'Quiet zone', label: 'Quiet Zone' },
        { value: 'Wheelchair access', label: 'Wheelchair' },
      ],
    };

    const defaultChips = [
      { value: 'Travel insurance', label: 'Insurance' },
      { value: 'Airport transfer', label: 'Airport Transfer' },
      { value: 'Wheelchair assistance', label: 'Wheelchair' },
      { value: 'Special occasion', label: 'Special Occasion' },
      { value: 'Flexible dates', label: 'Flexible Dates' },
    ];

    const chips = chipSets[travelType] || defaultChips;

    return `
      <div class="request-chips" id="requestChips">
        ${chips.map(c => `<button type="button" class="request-chip" data-value="${c.value}">${c.label}</button>`).join('')}
      </div>
    `;
  },

  // ── Step 1 ──

  _renderStep1() {
    const user = Auth.getCurrentUser();
    const today = new Date().toISOString().split('T')[0];
    const travelType = this._getTravelType();

    // Labels adapt based on travel type
    const dateLabel = travelType === 'hotel' ? 'Check-in Date'
                    : travelType === 'flight' ? 'Departure Date'
                    : travelType === 'cruise' ? 'Sailing Date'
                    : 'Travel Date';

    const showReturnDate = ['flight', 'hotel', 'holiday', 'cruise'].includes(travelType);
    const returnLabel = travelType === 'hotel' ? 'Check-out Date'
                      : travelType === 'cruise' ? 'Return Date'
                      : 'Return Date';

    const travellersLabel = travelType === 'flight' ? 'Passengers'
                          : travelType === 'hotel' ? 'Guests'
                          : 'Travellers';

    const maxTravellers = travelType === 'adventure' ? 10 : 6;

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgressStep1()}

        <h2 class="booking-form__title page-title">Plan Your Trip</h2>

        <div class="form-group">
          <label class="form-label">${dateLabel}</label>
          <input type="date" id="travelDate" class="form-input" min="${today}" value="${today}" />
        </div>

        ${showReturnDate ? `
          <div class="form-group">
            <label class="form-label">${returnLabel} <span class="text-muted">${travelType === 'flight' ? '(optional for one-way)' : ''}</span></label>
            <input type="date" id="returnDate" class="form-input" min="${today}" value="" />
          </div>
        ` : ''}

        <div class="form-group">
          <label class="form-label">${travellersLabel}</label>
          <select id="travellerCount" class="form-select">
            ${Array.from({length: maxTravellers}, (_, i) => i + 1).map(n => `<option value="${n}" ${n === 2 ? 'selected' : ''}>${n} ${n === 1 ? (travelType === 'flight' ? 'passenger' : 'guest') : (travelType === 'flight' ? 'passengers' : 'guests')}</option>`).join('')}
          </select>
        </div>

        ${travelType === 'flight' ? `
          <div class="form-group">
            <label class="form-label">Class Preference</label>
            <select id="classPref" class="form-select">
              <option value="economy">Economy</option>
              <option value="business">Business Class</option>
              <option value="first">First Class</option>
            </select>
          </div>
        ` : ''}

        ${travelType === 'hotel' ? `
          <div class="form-group">
            <label class="form-label">Rooms</label>
            <select id="roomCount" class="form-select">
              ${[1,2,3,4].map(n => `<option value="${n}" ${n === 1 ? 'selected' : ''}>${n} ${n === 1 ? 'room' : 'rooms'}</option>`).join('')}
            </select>
          </div>
        ` : ''}

        ${travelType === 'holiday' ? `
          <div class="form-group">
            <label class="form-label">Duration Preference</label>
            <select id="durationPref" class="form-select">
              <option value="3-4">3 – 4 nights</option>
              <option value="5-7" selected>5 – 7 nights</option>
              <option value="8-10">8 – 10 nights</option>
              <option value="10+">10+ nights</option>
            </select>
          </div>
        ` : ''}

        ${travelType === 'adventure' ? `
          <div class="form-group">
            <label class="form-label">Preferred Time</label>
            <select id="adventureTime" class="form-select">
              <option value="morning">Morning (8:00 – 12:00)</option>
              <option value="afternoon" selected>Afternoon (14:00 – 18:00)</option>
              <option value="evening">Evening / Sunset (16:00 – 21:00)</option>
            </select>
          </div>
        ` : ''}

        <div class="form-group">
          <label class="form-label">Special Requests <span class="text-muted">(optional)</span></label>
          ${this._renderChips()}
          <textarea id="specialRequests" class="form-input" rows="2" placeholder="Any special requirements or preferences..."></textarea>
        </div>

        <div class="booking-card-info">
          <div class="booking-card-info__icon">${Icons.creditCard(24)}</div>
          <div>
            <div class="text-semibold">${user.name}</div>
            <div class="text-sm text-muted">${Format.tierLabel(user.cardTier)} Card ending ${user.cardNumber}</div>
          </div>
        </div>

        ${this._renderReassurance()}
        <button class="btn btn--primary btn--lg btn--full" id="toStep2Btn">Continue to Confirmation</button>
      </div>
    `;
  },

  // ── Step 2 ──

  _renderStep2() {
    const user = Auth.getCurrentUser();
    const d = this._formData || {};
    const title = this._offer.title;
    const travelType = this._getTravelType();

    const dateLabel = travelType === 'hotel' ? 'Check-in'
                    : travelType === 'flight' ? 'Departure'
                    : travelType === 'cruise' ? 'Sailing'
                    : 'Travel Date';

    const returnLabel = travelType === 'hotel' ? 'Check-out' : 'Return';

    const travellersLabel = travelType === 'flight' ? 'Passengers'
                          : travelType === 'hotel' ? 'Guests'
                          : 'Travellers';

    const classLabels = { economy: 'Economy', business: 'Business Class', first: 'First Class' };
    const durationLabels = { '3-4': '3 – 4 nights', '5-7': '5 – 7 nights', '8-10': '8 – 10 nights', '10+': '10+ nights' };
    const timeLabels = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening / Sunset' };

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgressStep2()}

        <h2 class="booking-form__title page-title">Confirm Your Booking</h2>

        <div class="booking-confirm-details">
          <div class="booking-confirm-row">
            <span class="text-muted">Offer</span>
            <span class="text-semibold">${title}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">${dateLabel}</span>
            <span>${Format.date(d.travelDate)}</span>
          </div>
          ${d.returnDate ? `
            <div class="booking-confirm-row">
              <span class="text-muted">${returnLabel}</span>
              <span>${Format.date(d.returnDate)}</span>
            </div>
          ` : ''}
          <div class="booking-confirm-row">
            <span class="text-muted">${travellersLabel}</span>
            <span>${d.travellerCount}</span>
          </div>
          ${d.classPref ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Class</span>
              <span>${classLabels[d.classPref] || d.classPref}</span>
            </div>
          ` : ''}
          ${d.roomCount ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Rooms</span>
              <span>${d.roomCount}</span>
            </div>
          ` : ''}
          ${d.durationPref ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Duration</span>
              <span>${durationLabels[d.durationPref] || d.durationPref}</span>
            </div>
          ` : ''}
          ${d.adventureTime ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Time</span>
              <span>${timeLabels[d.adventureTime] || d.adventureTime}</span>
            </div>
          ` : ''}
          ${d.specialReqs ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Special Requests</span>
              <span>${d.specialReqs}</span>
            </div>
          ` : ''}
          <div class="booking-confirm-row">
            <span class="text-muted">Card</span>
            <span>${Format.tierLabel(user.cardTier)} ${user.cardNumber}</span>
          </div>
        </div>

        ${this._renderReassurance()}
        <div class="flex gap-md">
          <button class="btn btn--ghost btn--lg" id="backToStep1" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="confirmBookingBtn" style="flex:2">Confirm Booking</button>
        </div>
      </div>
    `;
  },

  // ── Mount / Unmount ──

  _getSelectedChips() {
    return Array.from(document.querySelectorAll('.request-chip--selected'))
      .map(chip => chip.dataset.value);
  },

  mount() {
    Nav.mount();

    delegate('#app', 'click', '#toStep2Btn', () => {
      this._step = 2;
      const chipValues = this._getSelectedChips();
      const textareaVal = ($('#specialRequests')?.value || '').trim();
      const allRequests = [...chipValues, textareaVal].filter(Boolean).join(', ');

      this._formData = {
        travelDate: $('#travelDate')?.value,
        returnDate: $('#returnDate')?.value || '',
        travellerCount: $('#travellerCount')?.value,
        classPref: $('#classPref')?.value || '',
        roomCount: $('#roomCount')?.value || '',
        durationPref: $('#durationPref')?.value || '',
        adventureTime: $('#adventureTime')?.value || '',
        specialReqs: allRequests,
      };

      const form = $('#bookingForm');
      if (form) form.innerHTML = this._renderStep2();

      const stickyBtn = $('#stickyContinueBtn');
      if (stickyBtn) stickyBtn.textContent = 'Confirm Booking';

      this._setupStickyObserver();
    });

    delegate('#app', 'click', '#backToStep1', () => {
      this._step = 1;
      const form = $('#bookingForm');
      if (form) form.innerHTML = this._renderStep1();

      const stickyBtn = $('#stickyContinueBtn');
      if (stickyBtn) stickyBtn.textContent = 'Continue to Confirmation';

      this._setupStickyObserver();
    });

    delegate('#app', 'click', '#confirmBookingBtn', () => {
      this._confirmBooking();
    });

    delegate('#app', 'click', '.request-chip', (e) => {
      e.target.classList.toggle('request-chip--selected');
    });

    delegate('#app', 'click', '#stickyContinueBtn', () => {
      const step1Btn = $('#toStep2Btn');
      const step2Btn = $('#confirmBookingBtn');
      if (step1Btn) step1Btn.click();
      else if (step2Btn) step2Btn.click();
    });

    this._setupStickyObserver();
  },

  _setupStickyObserver() {
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    requestAnimationFrame(() => {
      const inlineCta = document.querySelector('#bookingForm .btn--primary');
      const stickyCta = $('#booking-sticky-cta');
      if (inlineCta && stickyCta) {
        this._stickyObserver = new IntersectionObserver(
          ([entry]) => {
            stickyCta.classList.toggle('booking-sticky-cta--visible', !entry.isIntersecting);
          },
          { threshold: 0 }
        );
        this._stickyObserver.observe(inlineCta);
      }
    });
  },

  unmount() {
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
  },

  // ── Confirm ──

  _confirmBooking() {
    const d = this._formData || {};
    const booking = Store.createBooking({
      offerId: this._offer.id,
      type: 'travel',
      bookingDate: d.travelDate || new Date().toISOString().split('T')[0],
      partySize: parseInt(d.travellerCount) || 2,
      timePreference: d.classPref || d.adventureTime || 'any',
      specialRequests: d.specialReqs || '',
    });

    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    const stickyCta = $('#booking-sticky-cta');
    if (stickyCta) stickyCta.classList.remove('booking-sticky-cta--visible');

    const form = $('#bookingForm');
    if (form) {
      form.innerHTML = `
        <div class="booking-success">
          <div class="booking-success__icon">${Icons.checkCircle(48)}</div>
          <h2 class="booking-success__title page-title">Booking Confirmed!</h2>
          <p class="booking-success__text">Your travel booking has been confirmed. You'll receive details shortly.</p>
          <div class="confirmation-code">${booking.confirmationCode}</div>
          <p class="text-sm text-muted" style="margin-top:8px">Save this confirmation code</p>
          <div class="flex gap-md" style="margin-top:24px">
            <button class="btn btn--ghost btn--lg" onclick="Router.navigate('/home')" style="flex:1">Home</button>
            <button class="btn btn--primary btn--lg" onclick="Router.navigate('/my-bookings/${booking.id}')" style="flex:2">View Booking</button>
          </div>
        </div>
      `;
    }
  },

  _notFound() {
    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="empty-state" style="padding-top:80px">
              <div class="empty-state__icon">${Icons.search(48)}</div>
              <h2 class="empty-state__title">Offer Not Found</h2>
              <p class="empty-state__text">This travel offer may have expired or been removed.</p>
              <button class="btn btn--primary" onclick="Router.navigate('/home')">Back to Home</button>
            </div>
          </div>
        </main>
      </div>
    `;
  },
};

window.TravelBookingPage = TravelBookingPage;
