// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Hotel Booking Page
// ══════════════════════════════════════════════

const HotelBookingPage = {
  _offerId: null,
  _offer: null,
  _merchant: null,
  _step: 1,
  _formData: null,
  _stickyObserver: null,
  _couponApplied: false,
  _couponCode: '',
  _selectedTitle: 'Mr',
  _selectedRoom: null,
  _agreedTerms: false,

  // ── Room Types (demo) ──
  _roomTypes: [
    { id: 'classic-double',   name: 'Classic Double',   basePrice: 1940, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=300&q=80', maxGuests: 2 },
    { id: 'deluxe-king',      name: 'Deluxe King',      basePrice: 2450, image: 'https://images.unsplash.com/photo-1590490360182-c33d955e40bf?w=300&q=80', maxGuests: 2 },
    { id: 'premium-suite',    name: 'Premium Suite',    basePrice: 3800, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&q=80', maxGuests: 3 },
    { id: 'family-room',      name: 'Family Room',      basePrice: 2900, image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=300&q=80', maxGuests: 4 },
  ],

  render(params) {
    const rawId = params.offerId;
    this._offer = (Store.get('offers') || []).find(o => o.id === rawId);
    if (!this._offer) return this._notFound();
    this._offerId = rawId;
    this._merchant = Store.getMerchant(this._offer.merchantId);
    this._step = 1;
    this._formData = null;
    this._couponApplied = false;
    this._couponCode = '';
    this._selectedTitle = 'Mr';
    this._selectedRoom = this._roomTypes[0];
    this._agreedTerms = false;

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full page__main--booking">
          <div class="container">
            <div class="breadcrumb">
              <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="Router.navigate('/category/hotels')">Book Hotels</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">${this._merchant ? this._merchant.name : this._offer.title}</span>
            </div>

            <!-- Back + Page Title -->
            <div class="hb-page-header">
              <button class="hb-back-btn" onclick="history.back()">
                ${Icons.chevronLeft ? Icons.chevronLeft(20) : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>'}
              </button>
              <h1 class="hb-page-title">Review booking details</h1>
            </div>

            <div class="hb-layout" id="hotelBookingForm">
              ${this._renderStep1()}
            </div>
          </div>
        </main>

        <!-- Sticky Mobile CTA -->
        <div class="booking-sticky-cta" id="booking-sticky-cta">
          <button class="btn btn--primary btn--lg booking-sticky-cta__btn" id="stickyContinueBtn">
            Go to payment
          </button>
        </div>
      </div>
    `;
  },

  // ── Step 1: Guest Details + Booking Summary ──

  _renderStep1() {
    const user = Auth.getCurrentUser();
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const room = this._selectedRoom;
    const priceData = this._calculatePrice();

    return `
      <!-- Guest Details Card -->
      <div class="hb-card">
        <h2 class="hb-card__title">Guest Details</h2>

        <!-- Title selector pills -->
        <div class="hb-title-pills" id="titlePills">
          <button type="button" class="hb-title-pill ${this._selectedTitle === 'Mr' ? 'hb-title-pill--active' : ''}" data-title="Mr">Mr</button>
          <button type="button" class="hb-title-pill ${this._selectedTitle === 'Ms' ? 'hb-title-pill--active' : ''}" data-title="Ms">Ms</button>
          <button type="button" class="hb-title-pill ${this._selectedTitle === 'Mrs' ? 'hb-title-pill--active' : ''}" data-title="Mrs">Mrs</button>
        </div>

        <div class="form-group">
          <label class="form-label">First Name <span class="hb-required">*</span></label>
          <input type="text" id="hbFirstName" class="form-input" placeholder="Enter your first name" value="${user.name.split(' ')[0] || ''}" />
        </div>

        <div class="form-group">
          <label class="form-label">Last Name <span class="hb-required">*</span></label>
          <input type="text" id="hbLastName" class="form-input" placeholder="Enter your last name" value="${user.name.split(' ').slice(1).join(' ') || ''}" />
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number <span class="hb-required">*</span></label>
          <div class="hb-phone-input">
            <div class="hb-phone-input__prefix">
              <span class="hb-phone-input__flag">🇦🇪</span>
              <span class="hb-phone-input__code">+971</span>
            </div>
            <input type="tel" id="hbPhone" class="form-input hb-phone-input__field" placeholder="50 123 4567" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email address <span class="hb-required">*</span></label>
          <input type="email" id="hbEmail" class="form-input" placeholder="Enter your email" />
        </div>

        <p class="hb-helper-text">We need your email & number to confirm the booking</p>
      </div>

      <!-- Hotel Info Card -->
      <div class="hb-card hb-hotel-info">
        ${this._merchant && this._merchant.rating ? `
          <div class="hb-rating">
            <span class="hb-rating__score">${Number(this._merchant.rating).toFixed(1)}</span>
            <span class="hb-rating__label">${this._merchant.rating >= 4.5 ? 'Excellent' : this._merchant.rating >= 4.0 ? 'Very Good' : 'Good'}</span>
            <span class="hb-rating__count">· ${Math.floor(Math.random() * 3000 + 500).toLocaleString()} reviews</span>
          </div>
        ` : ''}

        <div class="hb-dates">
          <div class="hb-dates__col">
            <span class="hb-dates__label">Check in :</span>
            <div class="hb-dates__picker">
              <input type="date" id="hbCheckIn" class="form-input hb-dates__input" min="${today}" value="${today}" />
            </div>
          </div>
          <div class="hb-dates__col">
            <span class="hb-dates__label">Check Out :</span>
            <div class="hb-dates__picker">
              <input type="date" id="hbCheckOut" class="form-input hb-dates__input" min="${tomorrow}" value="${tomorrow}" />
            </div>
          </div>
        </div>

        <hr class="hb-divider" />

        <!-- Room Selection -->
        <div class="hb-room-select">
          <div class="hb-room-select__current">
            <img src="${room.image}" alt="${room.name}" class="hb-room-select__img" />
            <div class="hb-room-select__info">
              <h4 class="hb-room-select__name">${room.name}</h4>
              <p class="hb-room-select__meta">
                <select id="hbGuests" class="hb-inline-select">
                  ${[1,2,3,4].map(n => `<option value="${n}" ${n === 2 ? 'selected' : ''}>${n} Adult${n > 1 ? 's' : ''}</option>`).join('')}
                </select>
                · Including taxes and fees
              </p>
              <a href="javascript:void(0)" class="hb-room-select__policy" id="showCancellation">Cancellation policy ›</a>
            </div>
          </div>
        </div>

        <!-- Room Type Picker -->
        <div class="hb-room-picker" id="roomPicker" style="display:none;">
          ${this._roomTypes.map(r => `
            <button type="button" class="hb-room-option ${r.id === room.id ? 'hb-room-option--active' : ''}" data-room="${r.id}">
              <img src="${r.image}" alt="${r.name}" class="hb-room-option__img" />
              <div class="hb-room-option__body">
                <span class="hb-room-option__name">${r.name}</span>
                <span class="hb-room-option__price">AED ${r.basePrice.toLocaleString()}</span>
              </div>
            </button>
          `).join('')}
        </div>
        <button type="button" class="hb-change-room-btn" id="changeRoomBtn">Change room type</button>
      </div>

      <!-- Coupon Code Card -->
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

      <!-- Price Breakdown Card -->
      <div class="hb-card hb-price-card">
        <div class="hb-price-header">
          <h3 class="hb-price-header__title">Price break-up</h3>
          ${priceData.discountPercent > 0 ? `
            <span class="hb-price-badge">${Icons.checkCircle ? Icons.checkCircle(14) : '✓'} ${priceData.discountPercent}% off</span>
          ` : ''}
        </div>

        <div class="hb-price-row hb-price-row--room">
          <span>🏨 ${room.name}</span>
        </div>

        <div class="hb-price-row">
          <span>Original price</span>
          <span>AED ${priceData.originalPrice.toLocaleString()}</span>
        </div>

        ${priceData.discount > 0 ? `
          <div class="hb-price-row hb-price-row--discount">
            <span>Discount</span>
            <span>- AED ${priceData.discount.toLocaleString()}</span>
          </div>
        ` : ''}

        ${priceData.offerDiscount > 0 ? `
          <div class="hb-price-row hb-price-row--discount">
            <span>Demo X offer applied</span>
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
          <div class="hb-price-saved">
            You've saved AED ${priceData.totalSaved.toLocaleString()} on this booking!
          </div>
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
            <button type="button" class="request-chip" data-value="Late checkout">Late Checkout</button>
            <button type="button" class="request-chip" data-value="Early check-in">Early Check-in</button>
            <button type="button" class="request-chip" data-value="High floor">High Floor</button>
            <button type="button" class="request-chip" data-value="Sea view">Sea View</button>
            <button type="button" class="request-chip" data-value="Airport transfer">Airport Transfer</button>
            <button type="button" class="request-chip" data-value="Extra bed">Extra Bed</button>
            <button type="button" class="request-chip" data-value="Baby cot">Baby Cot</button>
          </div>
          <textarea id="specialRequests" class="form-input" rows="2" placeholder="Any other requests..." style="margin-top:10px;"></textarea>
        </div>
      </div>

      <!-- Terms Agreement -->
      <div class="hb-terms">
        <label class="hb-terms__label">
          <input type="checkbox" id="hbAgreeTerms" class="hb-terms__checkbox" />
          <span class="hb-terms__check">${Icons.check ? Icons.check(12) : '✓'}</span>
          <span>By proceeding, you agree to Demo's <a href="javascript:void(0)" class="hb-terms__link">Privacy Policy</a> and <a href="javascript:void(0)" class="hb-terms__link">Terms & Conditions</a></span>
        </label>
      </div>

    `;
  },

  // ── Step 2: Confirmation ──

  _renderStep2() {
    const d = this._formData;
    const room = this._selectedRoom;
    const priceData = this._calculatePrice();
    const user = Auth.getCurrentUser();

    return `
      <div class="hb-card">
        <div class="booking-step">
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
        </div>

        <h2 class="hb-card__title" style="margin-top:20px;">Confirm Your Booking</h2>

        <div class="booking-confirm-details">
          <div class="booking-confirm-row">
            <span class="text-muted">Hotel</span>
            <span class="text-semibold">${this._merchant ? this._merchant.name : this._offer.title}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Room</span>
            <span>${room.name}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Guest</span>
            <span>${d.title} ${d.firstName} ${d.lastName}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Check-in</span>
            <span>${Format.date(d.checkIn)}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Check-out</span>
            <span>${Format.date(d.checkOut)}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Guests</span>
            <span>${d.guests} Adult${d.guests > 1 ? 's' : ''}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Phone</span>
            <span>+971 ${d.phone}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Email</span>
            <span>${d.email}</span>
          </div>
          ${d.specialReqs ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Requests</span>
              <span>${d.specialReqs}</span>
            </div>
          ` : ''}
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
            <button class="btn btn--ghost btn--lg" id="backToStep1" style="flex:1">Back</button>
            <button class="btn btn--primary btn--lg" id="confirmBookingBtn" style="flex:2">Confirm Booking</button>
          </div>
        </div>
      </div>
    `;
  },

  // ── Price Calculator ──

  _calculatePrice() {
    const room = this._selectedRoom;
    const originalPrice = room.basePrice;

    // Get discount from offer — always resolve a percentage for the price display
    let discountPercent = 0;
    let discount = 0;

    if (this._offer.discountValue && this._offer.discountUnit === 'percent') {
      // Explicit percentage (e.g. "30% off Weekend Stays")
      discountPercent = this._offer.discountValue;
    } else if (this._offer.discountValue && this._offer.discountUnit === 'aed') {
      // Flat AED discount — convert to nearest percent for badge
      discountPercent = Math.round((this._offer.discountValue / originalPrice) * 100);
    } else {
      // BOGO / complimentary / upgrade — use a default seasonal discount
      const defaults = { bogo: 33, complimentary: 25, upgrade: 20 };
      discountPercent = defaults[this._offer.offerType] || 15;
    }
    discount = Math.round(originalPrice * discountPercent / 100);

    // Demo X card offer (10% of original)
    const offerDiscount = Math.round(originalPrice * 0.10);

    // Coupon discount (flat AED 150 for demo)
    const couponDiscount = this._couponApplied ? 150 : 0;

    const toPay = Math.max(0, originalPrice - discount - offerDiscount - couponDiscount);
    const totalSaved = originalPrice - toPay;

    return { originalPrice, discountPercent, discount, offerDiscount, couponDiscount, toPay, totalSaved };
  },

  // ── Mount ──

  _getSelectedChips() {
    return Array.from(document.querySelectorAll('.request-chip--selected'))
      .map(chip => chip.dataset.value);
  },

  _showFieldError(selector, message) {
    const field = $(selector);
    if (!field) return;
    field.classList.add('form-input--error');
    const errEl = document.createElement('div');
    errEl.className = 'hb-field-error';
    errEl.textContent = message;
    // Insert after the field (or after its parent wrapper for phone input)
    const parent = field.closest('.hb-phone-input') || field;
    parent.parentNode.insertBefore(errEl, parent.nextSibling);
    // Clear error on input
    field.addEventListener('input', function handler() {
      field.classList.remove('form-input--error');
      if (errEl.parentNode) errEl.remove();
      field.removeEventListener('input', handler);
    });
  },

  _goToStep2() {
    // Clear previous inline errors
    $$('.hb-field-error').forEach(el => el.remove());
    $$('.form-input--error, .hb-terms--error').forEach(el => el.classList.remove('form-input--error', 'hb-terms--error'));

    // Validate
    const firstName = ($('#hbFirstName')?.value || '').trim();
    const lastName = ($('#hbLastName')?.value || '').trim();
    const phone = ($('#hbPhone')?.value || '').trim();
    const email = ($('#hbEmail')?.value || '').trim();
    const checkIn = $('#hbCheckIn')?.value || '';
    const checkOut = $('#hbCheckOut')?.value || '';
    const guests = $('#hbGuests')?.value || '2';
    const agreed = $('#hbAgreeTerms')?.checked;

    let firstErrorField = null;

    if (!firstName) {
      this._showFieldError('#hbFirstName', 'First name is required');
      if (!firstErrorField) firstErrorField = '#hbFirstName';
    }
    if (!lastName) {
      this._showFieldError('#hbLastName', 'Last name is required');
      if (!firstErrorField) firstErrorField = '#hbLastName';
    }
    if (!phone) {
      this._showFieldError('#hbPhone', 'Phone number is required');
      if (!firstErrorField) firstErrorField = '#hbPhone';
    }
    if (!email || !email.includes('@')) {
      this._showFieldError('#hbEmail', email ? 'Enter a valid email address' : 'Email address is required');
      if (!firstErrorField) firstErrorField = '#hbEmail';
    }
    if (!agreed) {
      const termsLabel = document.querySelector('.hb-terms__label');
      if (termsLabel) termsLabel.classList.add('hb-terms--error');
      const termsWrap = document.querySelector('.hb-terms');
      if (termsWrap) {
        const errEl = document.createElement('div');
        errEl.className = 'hb-field-error';
        errEl.textContent = 'You must agree to the Terms & Conditions';
        termsWrap.appendChild(errEl);
      }
      if (!firstErrorField) firstErrorField = '#hbAgreeTerms';
    }

    if (firstErrorField) {
      const el = $(firstErrorField);
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
      return;
    }

    const chipValues = this._getSelectedChips();
    const textareaVal = ($('#specialRequests')?.value || '').trim();
    const allRequests = [...chipValues, textareaVal].filter(Boolean).join(', ');

    this._formData = {
      title: this._selectedTitle,
      firstName,
      lastName,
      phone,
      email,
      checkIn,
      checkOut,
      guests: parseInt(guests),
      specialReqs: allRequests,
    };

    this._step = 2;
    const form = $('#hotelBookingForm');
    if (form) form.innerHTML = this._renderStep2();
    window.scrollTo(0, 0);

    const stickyBtn = $('#stickyContinueBtn');
    if (stickyBtn) stickyBtn.textContent = 'Confirm Booking';

    this._setupStickyObserver();
  },

  mount() {
    Nav.mount();

    // Title pill toggle
    delegate('#app', 'click', '.hb-title-pill', (e) => {
      const btn = e.target.closest('.hb-title-pill');
      if (!btn) return;
      this._selectedTitle = btn.dataset.title;
      $$('.hb-title-pill').forEach(p => p.classList.remove('hb-title-pill--active'));
      btn.classList.add('hb-title-pill--active');
    });

    // Change room button
    delegate('#app', 'click', '#changeRoomBtn', () => {
      const picker = $('#roomPicker');
      if (picker) picker.style.display = picker.style.display === 'none' ? 'flex' : 'none';
    });

    // Room option selection
    delegate('#app', 'click', '.hb-room-option', (e) => {
      const btn = e.target.closest('.hb-room-option');
      if (!btn) return;
      const roomId = btn.dataset.room;
      this._selectedRoom = this._roomTypes.find(r => r.id === roomId) || this._roomTypes[0];
      // Re-render to update price
      const form = $('#hotelBookingForm');
      if (form) form.innerHTML = this._renderStep1();
    });

    // Apply coupon
    delegate('#app', 'click', '#applyCoupon', () => {
      const input = $('#couponInput');
      if (input && input.value.trim()) {
        this._couponApplied = true;
        this._couponCode = input.value.trim().toUpperCase();
        const form = $('#hotelBookingForm');
        if (form) form.innerHTML = this._renderStep1();
      }
    });

    // Remove coupon
    delegate('#app', 'click', '#removeCoupon', () => {
      this._couponApplied = false;
      this._couponCode = '';
      const form = $('#hotelBookingForm');
      if (form) form.innerHTML = this._renderStep1();
    });

    // Special requests toggle
    delegate('#app', 'click', '#specialRequestsToggle', () => {
      const content = $('#specialRequestsContent');
      const arrow = document.querySelector('#specialRequestsToggle .hb-expandable__arrow');
      if (content) {
        const show = content.style.display === 'none';
        content.style.display = show ? 'block' : 'none';
        if (arrow) arrow.textContent = show ? '⌄' : '›';
      }
    });

    // Request chip toggle
    delegate('#app', 'click', '.request-chip', (e) => {
      e.target.classList.toggle('request-chip--selected');
    });

    // Cancellation policy (show toast)
    delegate('#app', 'click', '#showCancellation', () => {
      if (window.Toast) {
        Toast.show('Free cancellation up to 48 hours before check-in. After that, one night charge applies.', 'info');
      }
    });

    // Go to step 2 (sticky CTA triggers this directly)
    delegate('#app', 'click', '#toStep2Btn', () => { this._goToStep2(); });

    // Back to step 1
    delegate('#app', 'click', '#backToStep1', () => {
      this._step = 1;
      const form = $('#hotelBookingForm');
      if (form) form.innerHTML = this._renderStep1();
      window.scrollTo(0, 0);

      const stickyBtn = $('#stickyContinueBtn');
      if (stickyBtn) stickyBtn.textContent = 'Go to payment';

      this._setupStickyObserver();
    });

    // Confirm booking
    delegate('#app', 'click', '#confirmBookingBtn', () => {
      this._confirmBooking();
    });

    // Sticky CTA — directly call step logic
    delegate('#app', 'click', '#stickyContinueBtn', () => {
      if (this._step === 1) {
        this._goToStep2();
      } else if (this._step === 2) {
        this._confirmBooking();
      }
    });

    // Check-in date change → auto-update check-out min
    delegate('#app', 'change', '#hbCheckIn', () => {
      const checkIn = $('#hbCheckIn');
      const checkOut = $('#hbCheckOut');
      if (checkIn && checkOut) {
        const nextDay = new Date(new Date(checkIn.value).getTime() + 86400000).toISOString().split('T')[0];
        checkOut.min = nextDay;
        if (checkOut.value <= checkIn.value) checkOut.value = nextDay;
      }
    });

    this._setupStickyObserver();
  },

  _setupStickyObserver() {
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    const stickyCta = $('#booking-sticky-cta');
    if (!stickyCta) return;

    if (this._step === 1) {
      // Step 1: no inline button — always show sticky CTA
      stickyCta.classList.add('booking-sticky-cta--visible');
    } else {
      // Step 2: observe the inline confirm button
      requestAnimationFrame(() => {
        const inlineBtn = document.querySelector('#hotelBookingForm .btn--primary');
        if (inlineBtn) {
          this._stickyObserver = new IntersectionObserver(
            ([entry]) => {
              stickyCta.classList.toggle('booking-sticky-cta--visible', !entry.isIntersecting);
            },
            { threshold: 0 }
          );
          this._stickyObserver.observe(inlineBtn);
        }
      });
    }
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
    const priceData = this._calculatePrice();
    const booking = Store.createBooking({
      offerId: this._offer.id,
      type: 'hotel',
      bookingDate: d.checkIn || new Date().toISOString().split('T')[0],
      partySize: d.guests || 2,
      timePreference: 'check-in',
      specialRequests: d.specialReqs || '',
    });

    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    const stickyCta = $('#booking-sticky-cta');
    if (stickyCta) stickyCta.classList.remove('booking-sticky-cta--visible');

    const form = $('#hotelBookingForm');
    if (form) {
      form.innerHTML = `
        <div class="hb-card">
          <div class="booking-success">
            <div class="booking-success__icon">${Icons.checkCircle(48)}</div>
            <h2 class="booking-success__title page-title">Booking Confirmed!</h2>
            <p class="booking-success__text">Your hotel reservation at ${this._merchant ? this._merchant.name : 'the hotel'} has been confirmed.</p>
            <div class="confirmation-code">${booking.confirmationCode}</div>
            <p class="text-sm text-muted" style="margin-top:8px">Save this confirmation code</p>

            <div class="hb-success-summary">
              <div class="hb-success-row">
                <span>Room</span><span>${this._selectedRoom.name}</span>
              </div>
              <div class="hb-success-row">
                <span>Check-in</span><span>${Format.date(d.checkIn)}</span>
              </div>
              <div class="hb-success-row">
                <span>Check-out</span><span>${Format.date(d.checkOut)}</span>
              </div>
              <div class="hb-success-row">
                <span>Total Paid</span><span class="text-semibold">AED ${priceData.toPay.toLocaleString()}</span>
              </div>
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

  _notFound() {
    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="empty-state" style="padding-top:80px">
              <div class="empty-state__icon">${Icons.search(48)}</div>
              <h2 class="empty-state__title">Offer Not Found</h2>
              <p class="empty-state__text">This hotel offer may have expired or been removed.</p>
              <button class="btn btn--primary" onclick="Router.navigate('/home')">Back to Home</button>
            </div>
          </div>
        </main>
      </div>
    `;
  },
};

window.HotelBookingPage = HotelBookingPage;
