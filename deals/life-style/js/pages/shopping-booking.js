// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Shopping Booking Page (Item-First Flow)
// ══════════════════════════════════════════════

const ShoppingBookingPage = {
  _step: 1,
  _selectedCategory: null,
  _selectedItem: null,
  _offer: null,
  _merchant: null,
  _formData: null,
  _stickyObserver: null,

  render(params) {
    this._step = 1;
    this._selectedCategory = null;
    this._selectedItem = null;
    this._offer = null;
    this._merchant = null;
    this._formData = null;

    // If accessed via /book-shopping/:offerId, pre-select the linked item
    if (params && params.offerId) {
      const offerId = params.offerId;
      const item = (CONFIG.shoppingItems || []).find(i => i.offerId === offerId);
      if (item) {
        this._selectedItem = item;
        this._selectedCategory = item.subcategory;
        this._offer = (Store.get('offers') || []).find(o => o.id === item.offerId);
        this._merchant = Store.getMerchant(item.merchantId);
        this._step = 2;
      }
    }

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
              <span class="breadcrumb__current">${this._step === 1 ? 'Browse Items' : (this._selectedItem ? this._selectedItem.name : 'Order')}</span>
            </div>

            <div class="booking-form" id="bookingForm">
              ${this._step === 1 ? this._renderStep1() : this._renderStep2()}
            </div>
          </div>
        </main>

        <!-- Sticky Mobile CTA -->
        <div class="booking-sticky-cta" id="booking-sticky-cta">
          <button class="btn btn--primary btn--lg booking-sticky-cta__btn" id="stickyContinueBtn">
            ${this._step === 1 ? 'Select an Item' : (this._step === 2 ? 'Continue to Confirmation' : 'Confirm Order')}
          </button>
        </div>
      </div>
    `;
  },

  // ── Step 1: Browse & Select Item ──
  _renderStep1() {
    const categories = CONFIG.categorySubcategories.shopping || [];
    const allItems = CONFIG.shoppingItems || [];
    const filtered = this._selectedCategory
      ? allItems.filter(i => i.subcategory === this._selectedCategory)
      : allItems;

    const catPills = `
      <div class="booking-cat-pills">
        <button class="booking-cat-pill ${!this._selectedCategory ? 'active' : ''}" data-cat="">All</button>
        ${categories.map(c => `
          <button class="booking-cat-pill ${this._selectedCategory === c.id ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>
        `).join('')}
      </div>
    `;

    const itemGrid = `
      <div class="booking-items-grid">
        ${filtered.map(item => `
          <div class="booking-item-card" data-item-id="${item.id}">
            <img class="booking-item-card__img" src="${item.image}" alt="${item.name}" loading="lazy" />
            <div class="booking-item-card__info">
              <div class="booking-item-card__name">${item.name}</div>
              <div class="booking-item-card__price">${item.price}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    return `
      <div class="booking-step">
        ${this._renderProgress()}
        <h2 class="booking-form__title page-title">What would you like to buy?</h2>
        <p class="text-muted" style="margin-bottom:16px">Browse items by category — select one to proceed</p>
        ${catPills}
        ${itemGrid}
      </div>
    `;
  },

  // ── Step 2: Order Details (Merchant Revealed) ──
  _renderStep2() {
    const user = Auth.getCurrentUser();
    const item = this._selectedItem;
    const merchant = this._merchant;
    const offer = this._offer;

    return `
      <div class="booking-step">
        ${this._renderProgress()}
        <h2 class="booking-form__title page-title">Order Details</h2>

        <!-- Selected Item -->
        <div class="booking-item-selected">
          <img class="booking-item-selected__img" src="${item.image}" alt="${item.name}" />
          <div class="booking-item-selected__info">
            <div class="booking-item-selected__name">${item.name}</div>
            <div class="booking-item-selected__price">${item.price}</div>
            <div class="booking-item-selected__cat">${item.subcategory}</div>
          </div>
          <button class="booking-item-selected__change" id="changeItemBtn">Change</button>
        </div>

        <!-- Merchant Revealed -->
        ${merchant ? `
        <div class="booking-merchant-reveal">
          <img class="booking-merchant-reveal__img" src="${merchant.image}" alt="${merchant.name}" />
          <div class="booking-merchant-reveal__info">
            <div class="booking-merchant-reveal__name">${merchant.name}</div>
            <div class="booking-merchant-reveal__loc">${Icons.mapPin(13)} ${merchant.location || merchant.area || ''}</div>
            ${offer ? `<span class="discount-badge ${Format.discountBadgeClass(offer)}" style="margin-top:6px;display:inline-block">${Format.discountLabel(offer)}</span>` : ''}
          </div>
        </div>
        ` : ''}

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
        <button class="btn btn--primary btn--lg btn--full" id="toStep3Btn">Continue to Confirmation</button>
      </div>
    `;
  },

  // ── Step 3: Confirmation ──
  _renderStep3() {
    const user = Auth.getCurrentUser();
    const item = this._selectedItem;
    const merchant = this._merchant;
    const d = this._formData || {};

    const deliveryLabels = {
      'online': 'Online / Digital Delivery',
      'home-delivery': 'Home Delivery',
      'store-pickup': 'Store Pickup',
    };

    return `
      <div class="booking-step">
        ${this._renderProgress()}
        <h2 class="booking-form__title page-title">Confirm Your Order</h2>

        <div class="booking-confirm-details">
          <div class="booking-confirm-row">
            <span class="text-muted">Item</span>
            <span class="text-semibold">${item.name}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Price</span>
            <span>${item.price}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Merchant</span>
            <span>${merchant ? merchant.name : '—'}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Delivery</span>
            <span>${deliveryLabels[d.deliveryMethod] || d.deliveryMethod}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Quantity</span>
            <span>${d.quantity} ${d.quantity == 1 ? 'item' : 'items'}</span>
          </div>
          ${d.promoCode ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Promo Code</span>
              <span>${d.promoCode}</span>
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
          <button class="btn btn--ghost btn--lg" id="backToStep2" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="confirmBookingBtn" style="flex:2">Confirm Order</button>
        </div>
      </div>
    `;
  },

  _renderProgress() {
    const s = this._step;
    return `
      <div class="steps">
        <div class="step ${s === 1 ? 'active' : (s > 1 ? 'completed' : '')}">
          <span class="step__circle">${s > 1 ? Icons.check(14) : '1'}</span>
          <span class="step__label">Select Item</span>
        </div>
        <div class="step__line ${s > 1 ? 'completed' : ''}"></div>
        <div class="step ${s === 2 ? 'active' : (s > 2 ? 'completed' : '')}">
          <span class="step__circle">${s > 2 ? Icons.check(14) : '2'}</span>
          <span class="step__label">Details</span>
        </div>
        <div class="step__line ${s > 2 ? 'completed' : ''}"></div>
        <div class="step ${s === 3 ? 'active' : ''}">
          <span class="step__circle">3</span>
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

  _getSelectedChips() {
    return Array.from(document.querySelectorAll('.request-chip--selected'))
      .map(chip => chip.dataset.value);
  },

  mount() {
    Nav.mount();

    // Category pill click
    delegate('#app', 'click', '.booking-cat-pill', (e, el) => {
      this._selectedCategory = el.dataset.cat || null;
      const form = $('#bookingForm');
      if (form) form.innerHTML = this._renderStep1();
    });

    // Item card click → go to step 2
    delegate('#app', 'click', '.booking-item-card', (e, el) => {
      const itemId = el.dataset.itemId;
      const item = (CONFIG.shoppingItems || []).find(i => i.id === itemId);
      if (!item) return;

      this._selectedItem = item;
      this._offer = (Store.get('offers') || []).find(o => o.id === item.offerId);
      this._merchant = Store.getMerchant(item.merchantId);
      this._step = 2;

      const form = $('#bookingForm');
      if (form) form.innerHTML = this._renderStep2();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const stickyBtn = $('#stickyContinueBtn');
      if (stickyBtn) stickyBtn.textContent = 'Continue to Confirmation';
      this._setupStickyObserver();
    });

    // Change item → back to step 1
    delegate('#app', 'click', '#changeItemBtn', () => {
      this._step = 1;
      const form = $('#bookingForm');
      if (form) form.innerHTML = this._renderStep1();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const stickyBtn = $('#stickyContinueBtn');
      if (stickyBtn) stickyBtn.textContent = 'Select an Item';
    });

    // Step 2 → Step 3
    delegate('#app', 'click', '#toStep3Btn', () => {
      this._step = 3;
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
      if (form) form.innerHTML = this._renderStep3();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const stickyBtn = $('#stickyContinueBtn');
      if (stickyBtn) stickyBtn.textContent = 'Confirm Order';
      this._setupStickyObserver();
    });

    // Step 3 → back to Step 2
    delegate('#app', 'click', '#backToStep2', () => {
      this._step = 2;
      const form = $('#bookingForm');
      if (form) form.innerHTML = this._renderStep2();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const stickyBtn = $('#stickyContinueBtn');
      if (stickyBtn) stickyBtn.textContent = 'Continue to Confirmation';
      this._setupStickyObserver();
    });

    // Confirm order
    delegate('#app', 'click', '#confirmBookingBtn', () => {
      this._confirmBooking();
    });

    // Request chip toggle
    delegate('#app', 'click', '.request-chip', (e) => {
      e.target.classList.toggle('request-chip--selected');
    });

    // Sticky CTA delegates to inline button
    delegate('#app', 'click', '#stickyContinueBtn', () => {
      if (this._step === 2) {
        const btn = $('#toStep3Btn');
        if (btn) btn.click();
      } else if (this._step === 3) {
        const btn = $('#confirmBookingBtn');
        if (btn) btn.click();
      }
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
    const item = this._selectedItem;
    const booking = Store.createBooking({
      offerId: this._offer ? this._offer.id : (item ? item.offerId : ''),
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
          <p class="booking-success__text">Your order for <strong>${item ? item.name : 'your item'}</strong> has been placed successfully.</p>
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
};

window.ShoppingBookingPage = ShoppingBookingPage;
