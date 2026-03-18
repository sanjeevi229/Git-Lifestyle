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
  _searchTerm: '',

  render(params) {
    this._step = 1;
    this._selectedCategory = null;
    this._selectedItem = null;
    this._offer = null;
    this._merchant = null;
    this._formData = null;
    this._searchTerm = '';

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

    const hero = CONFIG.categoryHeroes.shopping || {};
    const catConfig = CONFIG.categories.find(c => c.id === 'shopping');
    const catIcon = catConfig ? catConfig.icon : '';
    const allItems = CONFIG.shoppingItems || [];

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full ${this._step > 1 ? 'page__main--booking' : ''}">
          ${this._step === 1 ? `
          <!-- Shop Online Hero Banner -->
          <section class="cat-hero cat-hero--video" style="background-image:url('${hero.image}')">
            <video class="cat-hero__video" autoplay muted loop playsinline preload="auto"><source src="${hero.video}" type="video/mp4"></video>
            <div class="cat-hero__overlay"></div>
            <div class="cat-hero__content">
              <div class="cat-hero__title-row">
                <span class="cat-hero__icon">${catIcon}</span>
                <h1 class="cat-hero__title">Shop Online</h1>
              </div>
              <p class="cat-hero__tagline">${hero.tagline}</p>
              <p class="cat-hero__count">${allItems.length} items available</p>
            </div>
            <div class="cat-hero__search">
              ${Icons.search(20)}
              <input id="shopSearchInput" type="text" placeholder="Search products..." />
              <button onclick="ShoppingBookingPage._doSearch()" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </section>
          ` : ''}

          <div class="container">
            <div class="breadcrumb" style="${this._step === 1 ? 'display:none' : ''}">
              <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="ShoppingBookingPage._goToStep1()">Shop Online</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">${this._getBreadcrumbLabel()}</span>
            </div>

            <div class="booking-form ${this._step === 1 ? 'booking-form--no-border' : ''}" id="bookingForm">
              ${this._renderCurrentStep()}
            </div>
          </div>
        </main>

        <!-- Sticky Mobile CTA -->
        <div class="booking-sticky-cta" id="booking-sticky-cta">
          <button class="btn btn--primary btn--lg booking-sticky-cta__btn" id="stickyContinueBtn">
            ${this._getStickyLabel()}
          </button>
        </div>
      </div>
    `;
  },

  _getBreadcrumbLabel() {
    if (this._step === 1) return 'Browse Items';
    if (this._step === 2) return this._selectedItem ? this._selectedItem.name : 'Product';
    if (this._step === 3) return 'Checkout';
    return 'Confirmation';
  },

  _getStickyLabel() {
    if (this._step === 1) return 'Select an Item';
    if (this._step === 2) return 'Add to Cart & Checkout';
    if (this._step === 3) return 'Continue to Confirmation';
    return 'Confirm Order';
  },

  _renderCurrentStep() {
    if (this._step === 1) return this._renderStep1();
    if (this._step === 2) return this._renderStep2ProductDetail();
    if (this._step === 3) return this._renderStep3Checkout();
    return this._renderStep4Confirmation();
  },

  // ── Step 1: Browse & Select Item ──
  _renderStep1() {
    const categories = CONFIG.categorySubcategories.shopping || [];
    const allItems = CONFIG.shoppingItems || [];
    let filtered = this._selectedCategory
      ? allItems.filter(i => i.subcategory === this._selectedCategory)
      : allItems;

    // Apply search filter
    if (this._searchTerm) {
      const term = this._searchTerm.toLowerCase();
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(term) ||
        i.subcategory.toLowerCase().includes(term)
      );
    }

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
        ${filtered.length > 0 ? filtered.map(item => `
          <div class="booking-item-card" data-item-id="${item.id}">
            <img class="booking-item-card__img" src="${item.image}" alt="${item.name}" loading="lazy" />
            <div class="booking-item-card__info">
              <div class="booking-item-card__name">${item.name}</div>
              <div class="booking-item-card__price">${item.price}</div>
            </div>
          </div>
        `).join('') : `
          <div style="grid-column:1/-1;text-align:center;padding:40px 20px;color:var(--grey)">
            <p style="font-size:16px;font-weight:600;margin-bottom:8px">No items found</p>
            <p style="font-size:14px">Try a different search term or category</p>
          </div>
        `}
      </div>
    `;

    return `
      <div class="shop-browse">
        <div class="shop-browse__header">
          <h2 class="shop-browse__title">${this._searchTerm ? `Results for "${this._searchTerm}"` : 'Browse All Items'}</h2>
          <p class="shop-browse__count">${filtered.length} item${filtered.length !== 1 ? 's' : ''}</p>
        </div>
        ${catPills}
        ${itemGrid}
      </div>
    `;
  },

  // ── Step 2: Product Detail + Add to Cart + Similar Items ──
  _renderStep2ProductDetail() {
    const item = this._selectedItem;
    const merchant = this._merchant;
    const offer = this._offer;
    const allItems = CONFIG.shoppingItems || [];

    // Similar items: same subcategory, exclude current, max 4
    const similarItems = allItems
      .filter(i => i.subcategory === item.subcategory && i.id !== item.id)
      .slice(0, 4);

    // If fewer than 4 similar in same category, fill from other categories
    if (similarItems.length < 4) {
      const more = allItems
        .filter(i => i.id !== item.id && i.subcategory !== item.subcategory)
        .slice(0, 4 - similarItems.length);
      similarItems.push(...more);
    }

    return `
      <div class="booking-step">
        ${this._renderProgress()}

        <div class="product-detail">
          <div class="product-detail__hero">
            <img class="product-detail__image" src="${item.image.replace('w=400', 'w=800')}" alt="${item.name}" />
          </div>

          <div class="product-detail__body">
            <span class="product-detail__category">${item.subcategory}</span>
            <h2 class="product-detail__name">${item.name}</h2>
            <div class="product-detail__price">${item.price}</div>

            ${offer ? `<span class="discount-badge ${Format.discountBadgeClass(offer)}" style="margin-top:8px;display:inline-block">${Format.discountLabel(offer)}</span>` : ''}

            <!-- Merchant Info -->
            ${merchant ? `
            <div class="product-detail__merchant">
              <img class="product-detail__merchant-img" src="${merchant.image}" alt="${merchant.name}" />
              <div class="product-detail__merchant-info">
                <div class="product-detail__merchant-label">Sold by</div>
                <div class="product-detail__merchant-name">${merchant.name}</div>
                <div class="product-detail__merchant-loc">${Icons.mapPin(12)} ${merchant.location || merchant.area || ''}</div>
              </div>
            </div>
            ` : ''}

            <div class="product-detail__features">
              <div class="product-detail__feature">${Icons.shield(14)} <span>Authenticity Guaranteed</span></div>
              <div class="product-detail__feature">${Icons.check(14)} <span>Free Returns within 14 days</span></div>
              <div class="product-detail__feature">${Icons.creditCard(14)} <span>Exclusive card member pricing</span></div>
            </div>

            <button class="btn btn--primary btn--lg btn--full" id="addToCartBtn">
              ${Icons.shoppingBag ? Icons.shoppingBag(18) : ''} Add to Cart & Checkout
            </button>
            <button class="btn btn--ghost btn--lg btn--full" id="backToBrowseBtn" style="margin-top:8px">Continue Shopping</button>
          </div>
        </div>

        ${similarItems.length > 0 ? `
        <div class="product-similar">
          <h3 class="product-similar__title">You May Also Like</h3>
          <div class="product-similar__grid">
            ${similarItems.map(si => `
              <div class="booking-item-card product-similar__card" data-similar-id="${si.id}">
                <img class="booking-item-card__img" src="${si.image}" alt="${si.name}" loading="lazy" />
                <div class="booking-item-card__info">
                  <div class="booking-item-card__name">${si.name}</div>
                  <div class="booking-item-card__price">${si.price}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>
    `;
  },

  // ── Step 3: Checkout (Order Details) ──
  _renderStep3Checkout() {
    const user = Auth.getCurrentUser();
    const item = this._selectedItem;
    const merchant = this._merchant;
    const offer = this._offer;

    return `
      <div class="booking-step">
        ${this._renderProgress()}
        <h2 class="booking-form__title page-title">Checkout</h2>

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

        <!-- Merchant -->
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
        <button class="btn btn--primary btn--lg btn--full" id="toStep4Btn">Continue to Confirmation</button>
      </div>
    `;
  },

  // ── Step 4: Confirmation ──
  _renderStep4Confirmation() {
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
          <button class="btn btn--ghost btn--lg" id="backToStep3" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="confirmBookingBtn" style="flex:2">Confirm Order</button>
        </div>
      </div>
    `;
  },

  _renderProgress() {
    const s = this._step;
    const tap = (n) => s > n ? `data-goto-step="${n}" style="cursor:pointer"` : '';
    return `
      <div class="steps">
        <div class="step ${s === 1 ? 'active' : (s > 1 ? 'completed' : '')}" ${tap(1)}>
          <span class="step__circle">${s > 1 ? Icons.check(14) : '1'}</span>
          <span class="step__label">Select Item</span>
        </div>
        <div class="step__line ${s > 1 ? 'completed' : ''}"></div>
        <div class="step ${s === 2 ? 'active' : (s > 2 ? 'completed' : '')}" ${tap(2)}>
          <span class="step__circle">${s > 2 ? Icons.check(14) : '2'}</span>
          <span class="step__label">Product Info</span>
        </div>
        <div class="step__line ${s > 2 ? 'completed' : ''}"></div>
        <div class="step ${s === 3 ? 'active' : (s > 3 ? 'completed' : '')}" ${tap(3)}>
          <span class="step__circle">${s > 3 ? Icons.check(14) : '3'}</span>
          <span class="step__label">Checkout</span>
        </div>
        <div class="step__line ${s > 3 ? 'completed' : ''}"></div>
        <div class="step ${s === 4 ? 'active' : ''}">
          <span class="step__circle">4</span>
          <span class="step__label">Confirm</span>
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

    // Tap on completed step to go back
    delegate('#app', 'click', '[data-goto-step]', (e, el) => {
      const target = parseInt(el.dataset.gotoStep);
      if (target && target < this._step) {
        this._step = target;
        this._updateView();
      }
    });

    // Search input Enter key
    delegate('#app', 'keydown', '#shopSearchInput', (e) => {
      if (e.key === 'Enter') this._doSearch();
    });

    // Category pill click
    delegate('#app', 'click', '.booking-cat-pill', (e, el) => {
      this._selectedCategory = el.dataset.cat || null;
      this._searchTerm = '';
      const form = $('#bookingForm');
      if (form) form.innerHTML = this._renderStep1();
    });

    // Item card click → go to step 2 (product detail)
    delegate('#app', 'click', '.booking-item-card:not(.product-similar__card)', (e, el) => {
      const itemId = el.dataset.itemId;
      const item = (CONFIG.shoppingItems || []).find(i => i.id === itemId);
      if (!item) return;
      this._selectItem(item);
      this._step = 2;
      this._updateView();
    });

    // Similar item click → switch to that product
    delegate('#app', 'click', '.product-similar__card', (e, el) => {
      const itemId = el.dataset.similarId;
      const item = (CONFIG.shoppingItems || []).find(i => i.id === itemId);
      if (!item) return;
      this._selectItem(item);
      this._step = 2;
      this._updateView();
    });

    // Add to Cart → go to step 3 (checkout)
    delegate('#app', 'click', '#addToCartBtn', () => {
      this._step = 3;
      this._updateView();
    });

    // Continue Shopping → back to step 1
    delegate('#app', 'click', '#backToBrowseBtn', () => {
      this._step = 1;
      this._updateView();
    });

    // Change item from checkout → back to step 1
    delegate('#app', 'click', '#changeItemBtn', () => {
      this._step = 1;
      this._updateView();
    });

    // Step 3 → Step 4
    delegate('#app', 'click', '#toStep4Btn', () => {
      this._step = 4;
      const chipValues = this._getSelectedChips();
      const textareaVal = ($('#specialRequests')?.value || '').trim();
      const allRequests = [...chipValues, textareaVal].filter(Boolean).join(', ');

      this._formData = {
        deliveryMethod: $('#deliveryMethod')?.value,
        quantity: $('#quantity')?.value,
        promoCode: ($('#promoCode')?.value || '').trim(),
        specialReqs: allRequests,
      };

      this._updateView();
    });

    // Step 4 → back to Step 3
    delegate('#app', 'click', '#backToStep3', () => {
      this._step = 3;
      this._updateView();
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
        const btn = $('#addToCartBtn');
        if (btn) btn.click();
      } else if (this._step === 3) {
        const btn = $('#toStep4Btn');
        if (btn) btn.click();
      } else if (this._step === 4) {
        const btn = $('#confirmBookingBtn');
        if (btn) btn.click();
      }
    });

    this._setupStickyObserver();
  },

  _goToStep1() {
    this._step = 1;
    this._updateView();
  },

  _doSearch() {
    const input = $('#shopSearchInput');
    if (!input) return;
    this._searchTerm = input.value.trim();
    const form = $('#bookingForm');
    if (form) form.innerHTML = this._renderStep1();
  },

  _selectItem(item) {
    this._selectedItem = item;
    this._selectedCategory = item.subcategory;
    this._offer = (Store.get('offers') || []).find(o => o.id === item.offerId);
    this._merchant = Store.getMerchant(item.merchantId);
  },

  _updateView() {
    const form = $('#bookingForm');
    if (form) {
      form.innerHTML = this._renderCurrentStep();
      // Toggle border styling based on step
      form.classList.toggle('booking-form--no-border', this._step === 1);
    }

    // Show/hide hero banner based on step
    const hero = document.querySelector('.cat-hero');
    if (hero) {
      hero.style.display = this._step === 1 ? '' : 'none';
    } else if (this._step === 1) {
      // Hero wasn't rendered (e.g. entered via /book-shopping/:offerId), do full re-render
      Router.navigate('/shop-online');
      return;
    }

    // Toggle booking padding class
    const main = document.querySelector('.page__main');
    if (main) main.classList.toggle('page__main--booking', this._step > 1);

    // Show/hide breadcrumb and update label
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
      breadcrumb.style.display = this._step > 1 ? '' : 'none';
      const current = breadcrumb.querySelector('.breadcrumb__current');
      if (current) current.textContent = this._getBreadcrumbLabel();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto-scroll progress bar to active step
    requestAnimationFrame(() => {
      const activeStep = document.querySelector('.booking-step .step.active, .shop-browse .step.active');
      if (activeStep) {
        activeStep.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });

    const stickyBtn = $('#stickyContinueBtn');
    if (stickyBtn) stickyBtn.textContent = this._getStickyLabel();
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
