// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Shopping Booking Page
// ══════════════════════════════════════════════

const ShoppingBookingPage = {
  _offerId: null,
  _offer: null,
  _merchant: null,
  _step: 1,
  _formData: null,
  _stickyObserver: null,

  render(params) {
    const rawId = params.offerId;
    this._offer = (Store.get('offers') || []).find(o => o.id === rawId);
    if (!this._offer) return this._notFound();
    this._offerId = rawId;
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
              <span class="breadcrumb__item" onclick="Router.navigate('/category/shopping')">Shop Online</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">${this._merchant ? this._merchant.name : title}</span>
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

  _renderReminder() {
    const title = this._offer.title;
    const image = this._offer.image;
    let meta = '';
    if (this._merchant) {
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

  _renderChips() {
    return `
      <div class="request-chips" id="requestChips">
        <button type="button" class="request-chip" data-value="Gift wrapping">Gift Wrapping</button>
        <button type="button" class="request-chip" data-value="Express delivery">Express Delivery</button>
        <button type="button" class="request-chip" data-value="Price match guarantee">Price Match</button>
        <button type="button" class="request-chip" data-value="Gift receipt included">Gift Receipt</button>
        <button type="button" class="request-chip" data-value="Fragile items">Fragile Items</button>
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

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgressStep1()}

        <h2 class="booking-form__title page-title">Order Details</h2>

        <div class="form-group">
          <label class="form-label">Delivery Method</label>
          <select id="deliveryMethod" class="form-select">
            <option value="online">Online / Digital Delivery</option>
            <option value="home-delivery">Home Delivery</option>
            <option value="store-pickup">Store Pickup</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Quantity</label>
          <select id="quantity" class="form-select">
            ${[1,2,3,4,5].map(n => `<option value="${n}" ${n === 1 ? 'selected' : ''}>${n} ${n === 1 ? 'item' : 'items'}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Promo Code <span class="text-muted">(optional)</span></label>
          <input type="text" id="promoCode" class="form-input" placeholder="Enter promo code if available" />
        </div>

        <div class="form-group">
          <label class="form-label">Special Requests <span class="text-muted">(optional)</span></label>
          ${this._renderChips()}
          <textarea id="specialRequests" class="form-input" rows="2" placeholder="Add any other preferences..."></textarea>
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
    const deliveryMethod = this._formData?.deliveryMethod || 'online';
    const quantity = this._formData?.quantity || 1;
    const promoCode = this._formData?.promoCode || '';
    const specialReqs = this._formData?.specialReqs || '';

    const title = this._offer.title;

    const deliveryLabels = {
      'online': 'Online / Digital Delivery',
      'home-delivery': 'Home Delivery',
      'store-pickup': 'Store Pickup',
    };

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgressStep2()}

        <h2 class="booking-form__title page-title">Confirm Your Order</h2>

        <div class="booking-confirm-details">
          <div class="booking-confirm-row">
            <span class="text-muted">Offer</span>
            <span class="text-semibold">${title}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Delivery</span>
            <span>${deliveryLabels[deliveryMethod] || deliveryMethod}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Quantity</span>
            <span>${quantity} ${quantity == 1 ? 'item' : 'items'}</span>
          </div>
          ${promoCode ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Promo Code</span>
              <span>${promoCode}</span>
            </div>
          ` : ''}
          ${specialReqs ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Special Requests</span>
              <span>${specialReqs}</span>
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
          <button class="btn btn--primary btn--lg" id="confirmBookingBtn" style="flex:2">Confirm Order</button>
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
        deliveryMethod: $('#deliveryMethod')?.value,
        quantity: $('#quantity')?.value,
        promoCode: ($('#promoCode')?.value || '').trim(),
        specialReqs: allRequests,
      };

      const form = $('#bookingForm');
      if (form) form.innerHTML = this._renderStep2();

      const stickyBtn = $('#stickyContinueBtn');
      if (stickyBtn) stickyBtn.textContent = 'Confirm Order';

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
      offerId: this._offer.id,
      type: 'shopping',
      bookingDate: new Date().toISOString().split('T')[0],
      partySize: parseInt(data.quantity) || 1,
      timePreference: data.deliveryMethod || 'online',
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
          <h2 class="booking-success__title page-title">Order Confirmed!</h2>
          <p class="booking-success__text">Your shopping offer has been activated successfully.</p>
          <div class="confirmation-code">${booking.confirmationCode}</div>
          <p class="text-sm text-muted" style="margin-top:8px">Save this confirmation code</p>
          <div class="flex gap-md" style="margin-top:24px">
            <button class="btn btn--ghost btn--lg" onclick="Router.navigate('/home')" style="flex:1">Home</button>
            <button class="btn btn--primary btn--lg" onclick="Router.navigate('/my-bookings/${booking.id}')" style="flex:2">View Order</button>
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

window.ShoppingBookingPage = ShoppingBookingPage;
