// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Entertainment Booking Page
// ══════════════════════════════════════════════

const EntertainmentBookingPage = {
  _offerId: null,
  _offer: null,
  _event: null,
  _merchant: null,
  _step: 1,
  _formData: null,
  _stickyObserver: null,

  render(params) {
    const rawId = params.offerId;

    // Determine if event or offer
    if (rawId.startsWith('event-')) {
      const eventId = rawId.replace('event-', '');
      this._event = (Store.get('events') || []).find(e => e.id === eventId);
      if (!this._event) return this._notFound();
      this._offerId = rawId;
      this._offer = null;
      this._merchant = null;
    } else {
      this._offer = (Store.get('offers') || []).find(o => o.id === rawId);
      if (!this._offer) return this._notFound();
      this._offerId = rawId;
      this._event = null;
      this._merchant = Store.getMerchant(this._offer.merchantId);
    }

    this._step = 1;
    this._formData = null;
    const title = this._event ? this._event.title : this._offer.title;
    const image = this._event ? this._event.image : this._offer.image;

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full page__main--booking">
          <div class="container">
            <div class="breadcrumb">
              <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="Router.navigate('/category/${this._event ? 'events' : 'entertainment'}')">${this._event ? 'Events' : 'Good Times'}</span>
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
                ${this._event ? `
                  <div class="booking-summary__detail">${Icons.calendar(14)} ${Format.date(this._event.date)}</div>
                  <div class="booking-summary__detail">${Icons.clock(14)} ${Format.timeRange(this._event.date, this._event.endDate)}</div>
                  <div class="booking-summary__detail">${Icons.mapPin(14)} ${this._event.venue}, ${this._event.area}</div>
                  <div class="booking-summary__price">AED ${this._event.price} <span class="text-muted text-sm">per person</span></div>
                ` : `
                  <div class="booking-summary__detail">${this._merchant ? this._merchant.name : ''}</div>
                  ${this._merchant ? `<div class="booking-summary__detail">${Icons.mapPin(14)} ${this._merchant.location || this._merchant.area || ''}</div>` : ''}
                  <div class="booking-summary__badge">
                    <span class="discount-badge ${Format.discountBadgeClass(this._offer)}">${Format.discountLabel(this._offer)}</span>
                  </div>
                `}
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

  _renderReminder() {
    const title = this._event ? this._event.title : this._offer.title;
    const image = this._event ? this._event.image : this._offer.image;
    let meta = '';
    if (this._event) {
      meta = `${this._event.venue} · ${Format.date(this._event.date)}`;
    } else if (this._merchant) {
      meta = `${this._merchant.name} · ${Format.discountLabel(this._offer)}`;
    } else {
      meta = Format.discountLabel(this._offer);
    }
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

  _getActivityType() {
    // Determine the type of entertainment from tags or title
    const tags = this._offer ? (this._offer.tags || []) : [];
    const title = (this._event ? this._event.title : this._offer.title).toLowerCase();

    if (tags.includes('cinema') || tags.includes('imax') || title.includes('cinema') || title.includes('movie') || title.includes('imax')) return 'cinema';
    if (tags.includes('opera') || tags.includes('comedy') || tags.includes('shows') || title.includes('show') || title.includes('opera') || title.includes('comedy') || title.includes('concert')) return 'live-show';
    if (tags.includes('waterpark') || tags.includes('theme-park') || title.includes('park') || title.includes('waterpark') || title.includes('theme')) return 'theme-park';
    if (tags.includes('sports') || tags.includes('game') || title.includes('sports') || title.includes('match') || title.includes('game')) return 'sports';
    if (tags.includes('music') || title.includes('music') || title.includes('festival')) return 'music';
    if (tags.includes('outdoor') || title.includes('outdoor') || title.includes('adventure')) return 'outdoor';
    if (tags.includes('backstage') || tags.includes('exclusive') || tags.includes('private')) return 'exclusive';
    return 'general';
  },

  _renderChips() {
    const activityType = this._getActivityType();

    const chipSets = {
      'cinema': [
        { value: 'IMAX preferred', label: 'IMAX' },
        { value: 'VIP seats', label: 'VIP Seats' },
        { value: 'Couple seating', label: 'Couple Seats' },
        { value: 'Wheelchair access', label: 'Wheelchair' },
        { value: 'Parking needed', label: 'Parking' },
      ],
      'live-show': [
        { value: 'Front row seating', label: 'Front Row' },
        { value: 'VIP upgrade', label: 'VIP Upgrade' },
        { value: 'Backstage access', label: 'Backstage' },
        { value: 'Group seating', label: 'Group Seating' },
        { value: 'Wheelchair access', label: 'Wheelchair' },
        { value: 'Parking needed', label: 'Parking' },
      ],
      'theme-park': [
        { value: 'Fast pass', label: 'Fast Pass' },
        { value: 'Locker needed', label: 'Locker' },
        { value: 'Kids group', label: 'Kids Group' },
        { value: 'Wheelchair access', label: 'Wheelchair' },
        { value: 'Parking needed', label: 'Parking' },
      ],
      'sports': [
        { value: 'VIP box', label: 'VIP Box' },
        { value: 'Group seating', label: 'Group Seating' },
        { value: 'Parking needed', label: 'Parking' },
        { value: 'Wheelchair access', label: 'Wheelchair' },
      ],
      'music': [
        { value: 'Front row', label: 'Front Row' },
        { value: 'VIP area', label: 'VIP Area' },
        { value: 'Group booking', label: 'Group Booking' },
        { value: 'Parking needed', label: 'Parking' },
        { value: 'Wheelchair access', label: 'Wheelchair' },
      ],
    };

    const defaultChips = [
      { value: 'VIP upgrade', label: 'VIP Upgrade' },
      { value: 'Group booking', label: 'Group Booking' },
      { value: 'Wheelchair access', label: 'Wheelchair' },
      { value: 'Parking needed', label: 'Parking' },
      { value: 'Special assistance', label: 'Special Assistance' },
    ];

    const chips = chipSets[activityType] || defaultChips;

    return `
      <div class="request-chips" id="requestChips">
        ${chips.map(c => `<button type="button" class="request-chip" data-value="${c.value}">${c.label}</button>`).join('')}
      </div>
    `;
  },

  _getTimeSlots() {
    const activityType = this._getActivityType();

    if (activityType === 'cinema') {
      return [
        { value: 'any', label: 'No preference' },
        { value: 'morning', label: 'Morning (10:00 - 12:00)' },
        { value: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
        { value: 'evening', label: 'Evening (17:00 - 21:00)' },
        { value: 'late-night', label: 'Late Night (21:00+)' },
      ];
    }

    if (activityType === 'theme-park' || activityType === 'outdoor') {
      return [
        { value: 'any', label: 'No preference' },
        { value: 'morning', label: 'Morning Entry (09:00 - 12:00)' },
        { value: 'afternoon', label: 'Afternoon Entry (12:00 - 16:00)' },
        { value: 'full-day', label: 'Full Day Pass' },
      ];
    }

    if (activityType === 'live-show' || activityType === 'music') {
      return [
        { value: 'any', label: 'No preference' },
        { value: 'matinee', label: 'Matinee (14:00 - 17:00)' },
        { value: 'evening', label: 'Evening (18:00 - 21:00)' },
        { value: 'late', label: 'Late Show (21:00+)' },
      ];
    }

    return [
      { value: 'any', label: 'No preference' },
      { value: 'morning', label: 'Morning (09:00 - 12:00)' },
      { value: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
      { value: 'evening', label: 'Evening (17:00 - 21:00)' },
    ];
  },

  _renderReassurance() {
    return `
      <div class="booking-reassurance">
        ${Icons.shield(14)}
        <span>Your card will only be validated. No charge will be made now.</span>
      </div>
    `;
  },

  _renderStep1() {
    const user = Auth.getCurrentUser();
    const today = new Date().toISOString().split('T')[0];
    const isEvent = !!this._event;
    const timeSlots = this._getTimeSlots();

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgressStep1()}

        <h2 class="booking-form__title page-title">Select Your Experience</h2>

        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="date" id="bookingDate" class="form-input" min="${today}" value="${isEvent ? this._event.date.split('T')[0] : today}" ${isEvent ? 'readonly' : ''} />
        </div>

        <div class="form-group">
          <label class="form-label">Number of Tickets</label>
          <select id="ticketCount" class="form-select">
            ${[1,2,3,4,5,6,7,8].map(n => `<option value="${n}" ${n === 2 ? 'selected' : ''}>${n} ${n === 1 ? 'ticket' : 'tickets'}</option>`).join('')}
          </select>
        </div>

        ${!isEvent ? `
          <div class="form-group">
            <label class="form-label">Preferred Time</label>
            <select id="timePref" class="form-select">
              ${timeSlots.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}
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

  _renderStep2() {
    const user = Auth.getCurrentUser();
    const bookingDate = this._formData?.bookingDate || new Date().toISOString().split('T')[0];
    const ticketCount = this._formData?.ticketCount || 2;
    const timePref = this._formData?.timePref || 'any';
    const specialReqs = this._formData?.specialReqs || '';
    const isEvent = !!this._event;

    const title = isEvent ? this._event.title : this._offer.title;

    // Friendly time label
    const timeSlots = this._getTimeSlots();
    const timeLabel = timeSlots.find(s => s.value === timePref)?.label || timePref;

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgressStep2()}

        <h2 class="booking-form__title page-title">Confirm Your Booking</h2>

        <div class="booking-confirm-details">
          <div class="booking-confirm-row">
            <span class="text-muted">Experience</span>
            <span class="text-semibold">${title}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Date</span>
            <span>${Format.date(bookingDate)}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Tickets</span>
            <span>${ticketCount}</span>
          </div>
          ${!isEvent && timePref !== 'any' ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Time</span>
              <span>${timeLabel}</span>
            </div>
          ` : ''}
          ${specialReqs ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Special Requests</span>
              <span>${specialReqs}</span>
            </div>
          ` : ''}
          ${isEvent ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Total</span>
              <span class="text-semibold" style="font-size:18px">AED ${this._event.price * ticketCount}</span>
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
        bookingDate: $('#bookingDate')?.value,
        ticketCount: $('#ticketCount')?.value,
        timePref: $('#timePref')?.value || 'any',
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

    // Request chip toggle
    delegate('#app', 'click', '.request-chip', (e) => {
      e.target.classList.toggle('request-chip--selected');
    });

    // Sticky CTA delegates to inline button
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

  _confirmBooking() {
    const data = this._formData || {};
    const booking = Store.createBooking({
      offerId: this._event ? this._event.id : this._offer.id,
      type: this._event ? 'event' : 'entertainment',
      bookingDate: data.bookingDate || new Date().toISOString().split('T')[0],
      partySize: parseInt(data.ticketCount) || 2,
      timePreference: data.timePref || 'any',
      specialRequests: data.specialReqs || '',
    });

    // Hide sticky CTA
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    const stickyCta = $('#booking-sticky-cta');
    if (stickyCta) stickyCta.classList.remove('booking-sticky-cta--visible');

    // Show success
    const form = $('#bookingForm');
    if (form) {
      form.innerHTML = `
        <div class="booking-success">
          <div class="booking-success__icon">${Icons.checkCircle(48)}</div>
          <h2 class="booking-success__title page-title">Booking Confirmed!</h2>
          <p class="booking-success__text">Your entertainment experience has been booked.</p>
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
              <h2 class="empty-state__title">Experience Not Found</h2>
              <p class="empty-state__text">This experience may have expired or been removed.</p>
              <button class="btn btn--primary" onclick="Router.navigate('/home')">Back to Home</button>
            </div>
          </div>
        </main>
      </div>
    `;
  },
};

window.EntertainmentBookingPage = EntertainmentBookingPage;
