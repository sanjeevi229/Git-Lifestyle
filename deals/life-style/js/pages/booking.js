// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Booking Page
// ══════════════════════════════════════════════

const BookingPage = {
  _offerId: null,
  _offer: null,
  _event: null,
  _merchant: null,
  _step: 1,
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
    } else {
      this._offer = (Store.get('offers') || []).find(o => o.id === rawId);
      if (!this._offer) return this._notFound();
      this._offerId = rawId;
      this._event = null;
      this._merchant = Store.getMerchant(this._offer.merchantId);
    }

    this._step = 1;
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
              <span class="breadcrumb__item" onclick="Router.navigate('/category/${this._event ? 'events' : this._offer.category}')">${this._event ? 'Events' : Format.categoryLabel(this._offer.category)}</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">${this._event ? title : (this._merchant ? this._merchant.name : title)}</span>
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
                  <div class="booking-summary__detail">${this._merchant ? `${Icons.mapPin(14)} ${this._merchant.location}` : ''}</div>
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

  _renderChips() {
    if (this._event) {
      return `
        <div class="request-chips" id="requestChips">
          <button type="button" class="request-chip" data-value="Front row seating">Front row</button>
          <button type="button" class="request-chip" data-value="Wheelchair access">Wheelchair access</button>
          <button type="button" class="request-chip" data-value="Group seating">Group seating</button>
          <button type="button" class="request-chip" data-value="Parking needed">Parking needed</button>
        </div>
      `;
    }
    return `
      <div class="request-chips" id="requestChips">
        <button type="button" class="request-chip" data-value="Window seating">Window seating</button>
        <button type="button" class="request-chip" data-value="Birthday celebration">Birthday</button>
        <button type="button" class="request-chip" data-value="Anniversary dinner">Anniversary</button>
        <button type="button" class="request-chip" data-value="Business dinner">Business dinner</button>
        <button type="button" class="request-chip" data-value="Quiet area">Quiet area</button>
        <button type="button" class="request-chip" data-value="High chair needed">High chair</button>
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

  _renderStep1() {
    const user = Auth.getCurrentUser();
    const today = new Date().toISOString().split('T')[0];

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgressStep1()}

        <h2 class="booking-form__title page-title">Booking Details</h2>

        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="date" id="bookingDate" class="form-input" min="${today}" value="${this._event ? this._event.date.split('T')[0] : today}" ${this._event ? 'readonly' : ''} />
        </div>

        <div class="form-group">
          <label class="form-label">${this._event ? 'Number of Tickets' : 'Party Size'}</label>
          <select id="partySize" class="form-select">
            ${[1,2,3,4,5,6].map(n => `<option value="${n}" ${n === 2 ? 'selected' : ''}>${n} ${this._event ? (n === 1 ? 'ticket' : 'tickets') : (n === 1 ? 'guest' : 'guests')}</option>`).join('')}
          </select>
        </div>

        ${!this._event ? `
          <div class="form-group">
            <label class="form-label">Time Preference</label>
            <select id="timePref" class="form-select">
              <option value="any">No preference</option>
              <option value="lunch">Lunch (12:00 - 15:00)</option>
              <option value="dinner">Dinner (18:00 - 22:00)</option>
              <option value="brunch">Brunch (10:00 - 14:00)</option>
            </select>
          </div>
        ` : ''}

        <div class="form-group">
          <label class="form-label">Special Requests <span class="text-muted">(optional)</span></label>
          ${this._renderChips()}
          <textarea id="specialRequests" class="form-input" rows="2" placeholder="Add any other requests..."></textarea>
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
    const partySize = this._formData?.partySize || 2;
    const timePref = this._formData?.timePref || 'any';
    const specialReqs = this._formData?.specialReqs || '';

    const title = this._event ? this._event.title : this._offer.title;

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
            <span class="text-muted">Date</span>
            <span>${Format.date(bookingDate)}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">${this._event ? 'Tickets' : 'Party Size'}</span>
            <span>${partySize}</span>
          </div>
          ${!this._event && timePref !== 'any' ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Time</span>
              <span>${timePref.charAt(0).toUpperCase() + timePref.slice(1)}</span>
            </div>
          ` : ''}
          ${specialReqs ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Special Requests</span>
              <span>${specialReqs}</span>
            </div>
          ` : ''}
          ${this._event ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Total</span>
              <span class="text-semibold" style="font-size:18px">AED ${this._event.price * partySize}</span>
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
      // Save form values + selected chips
      const chipValues = this._getSelectedChips();
      const textareaVal = ($('#specialRequests')?.value || '').trim();
      const allRequests = [...chipValues, textareaVal].filter(Boolean).join(', ');

      this._formData = {
        bookingDate: $('#bookingDate')?.value,
        partySize: $('#partySize')?.value,
        timePref: $('#timePref')?.value,
        specialReqs: allRequests,
      };

      const form = $('#bookingForm');
      if (form) form.innerHTML = this._renderStep2();

      // Update sticky CTA text
      const stickyBtn = $('#stickyContinueBtn');
      if (stickyBtn) stickyBtn.textContent = 'Confirm Booking';

      // Re-observe for sticky CTA
      this._setupStickyObserver();
    });

    delegate('#app', 'click', '#backToStep1', () => {
      this._step = 1;
      const form = $('#bookingForm');
      if (form) form.innerHTML = this._renderStep1();

      // Update sticky CTA text
      const stickyBtn = $('#stickyContinueBtn');
      if (stickyBtn) stickyBtn.textContent = 'Continue to Confirmation';

      // Re-observe for sticky CTA
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

    // Initial sticky observer setup
    this._setupStickyObserver();
  },

  _setupStickyObserver() {
    // Disconnect previous
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
      type: this._event ? 'event' : 'offer',
      bookingDate: data.bookingDate || new Date().toISOString().split('T')[0],
      partySize: parseInt(data.partySize) || 2,
      timePreference: data.timePref || 'any',
      specialRequests: data.specialReqs || '',
    });

    // Hide sticky CTA and disconnect observer
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    const stickyCta = $('#booking-sticky-cta');
    if (stickyCta) stickyCta.classList.remove('booking-sticky-cta--visible');

    // Show success overlay
    const form = $('#bookingForm');
    if (form) {
      form.innerHTML = `
        <div class="booking-success">
          <div class="booking-success__icon">${Icons.checkCircle(48)}</div>
          <h2 class="booking-success__title page-title">Booking Confirmed!</h2>
          <p class="booking-success__text">Your booking has been confirmed.</p>
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
              <p class="empty-state__text">This offer may have expired or been removed.</p>
              <button class="btn btn--primary" onclick="Router.navigate('/home')">Back to Home</button>
            </div>
          </div>
        </main>
      </div>
    `;
  },
};

window.BookingPage = BookingPage;
