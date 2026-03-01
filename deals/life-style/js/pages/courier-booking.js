// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Courier Booking Page (3-step)
// ══════════════════════════════════════════════

const CourierBookingPage = {
  _serviceId: null,
  _service: null,
  _step: 1,
  _formData: {},
  _stickyObserver: null,
  _selectedDate: null,
  _selectedTime: null,

  render(params, query) {
    const service = COURIER_SERVICE_TYPES.find(s => s.id === query.service);
    if (!service) return this._notFound();
    this._service = service;
    this._serviceId = service.id;
    this._step = 1;
    this._formData = {};
    this._selectedDate = null;
    this._selectedTime = null;

    return `
      <div class="page page--no-dark">
        ${Nav.render()}
        <main class="page__main page__main--full page__main--booking">
          <div class="container">
            <div class="breadcrumb">
              <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="Router.navigate('/courier')">Local Courier</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">Book Delivery</span>
            </div>

            <div class="booking-layout">
              <!-- Summary Panel -->
              <div class="booking-summary">
                <div class="booking-summary__image">
                  <img src="${service.image}" alt="${service.name}" />
                </div>
                <h3 class="booking-summary__title">${service.name}</h3>
                <div class="booking-summary__detail">${service.description}</div>
                <div class="booking-summary__detail">${Icons.package(14)} Up to ${service.maxWeight} kg</div>
                <div class="booking-summary__badge">
                  <span class="discount-badge discount-badge--green">Complimentary</span>
                </div>
              </div>

              <!-- Booking Form -->
              <div class="booking-form" id="courierBookingForm">
                ${this._renderStep1()}
              </div>
            </div>
          </div>
        </main>

        <!-- Sticky Mobile CTA -->
        <div class="booking-sticky-cta" id="courier-booking-sticky-cta">
          <button class="btn btn--primary btn--lg booking-sticky-cta__btn" id="courierStickyContinueBtn">
            Continue
          </button>
        </div>
      </div>
    `;
  },

  // ── Progress Steps ──
  _renderProgress() {
    const steps = [
      { num: 1, label: 'Package & Pickup' },
      { num: 2, label: 'Recipient' },
      { num: 3, label: 'Confirm' },
    ];
    return `
      <div class="steps">
        ${steps.map((s, i) => {
          let cls = '';
          if (s.num < this._step) cls = 'completed';
          else if (s.num === this._step) cls = 'active';
          const circle = s.num < this._step ? Icons.check(14) : s.num;
          return `
            <div class="step ${cls}">
              <span class="step__circle">${circle}</span>
              <span class="step__label">${s.label}</span>
            </div>
            ${i < steps.length - 1 ? `<div class="step__line ${s.num < this._step ? 'completed' : ''}"></div>` : ''}
          `;
        }).join('')}
      </div>
    `;
  },

  // ── Reminder ──
  _renderReminder() {
    return `
      <div class="booking-reminder">
        <img src="${this._service.image}" alt="" class="booking-reminder__img" />
        <div class="booking-reminder__info">
          <div class="booking-reminder__title">${this._service.name}</div>
          <div class="booking-reminder__meta">${this._service.description}</div>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // STEP 1 — Package & Pickup
  // ══════════════════════════════════════════════
  _renderStep1() {
    const days = this._getNextDays(7);
    const selectedDateStr = this._selectedDate;
    const fd = this._formData;

    const dateTabs = days.map(d => {
      const dateStr = d.toISOString().split('T')[0];
      const isActive = dateStr === selectedDateStr;
      const dayName = this._formatShortDay(d);
      const dayNum = d.getDate();
      const month = d.toLocaleDateString('en-AE', { month: 'short' });
      return `
        <button class="golf-date-tab ${isActive ? 'golf-date-tab--active' : ''}" data-date="${dateStr}">
          <span class="golf-date-tab__day">${dayName}</span>
          <span class="golf-date-tab__num">${dayNum}</span>
          <span class="golf-date-tab__month">${month}</span>
        </button>
      `;
    }).join('');

    // Split time slots into morning / afternoon / evening
    const morningSlots = COURIER_TIME_SLOTS.filter(s => parseInt(s.split(':')[0]) < 12);
    const afternoonSlots = COURIER_TIME_SLOTS.filter(s => {
      const hour = parseInt(s.split(':')[0]);
      return hour >= 12 && hour < 18;
    });
    const eveningSlots = COURIER_TIME_SLOTS.filter(s => parseInt(s.split(':')[0]) >= 18);

    const renderSlots = (slots, label) => {
      if (slots.length === 0) return '';
      return `
        <div class="golf-slot-group">
          <div class="golf-slot-group__label">${label}</div>
          <div class="golf-slot-grid">
            ${slots.map(s => `
              <button class="golf-slot ${this._selectedTime === s ? 'golf-slot--selected' : ''}" data-slot="${s}">
                ${s}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    };

    // Restore form selections if going back
    const savedPackageType = fd.packageType || '';
    const savedWeight = fd.estimatedWeight || '';
    const savedPickup = fd.pickupLocationId || '';
    const savedDelivery = fd.deliveryLocationId || '';
    const savedCustomPickup = fd.customPickupLocation || '';
    const savedCustomDelivery = fd.customDeliveryLocation || '';
    const customPickupStyle = savedPickup === 'other' ? '' : 'display:none';
    const customDeliveryStyle = savedDelivery === 'other' ? '' : 'display:none';

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Package & Pickup</h2>

        <!-- Package Type -->
        <div class="form-group">
          <label class="form-label">${Icons.package(14)} Package Type</label>
          <select id="packageTypeSelect" class="form-select">
            <option value="">Select package type</option>
            ${COURIER_PACKAGE_TYPES.map(p => `<option value="${p.id}" ${p.id === savedPackageType ? 'selected' : ''}>${p.name} — ${p.description}</option>`).join('')}
          </select>
        </div>

        <!-- Estimated Weight -->
        <div class="form-group">
          <label class="form-label">Estimated Weight (kg)</label>
          <input type="number" id="weightEstimate" class="form-input" min="0.1" max="${this._service.maxWeight}" step="0.1" placeholder="e.g. 2.5" value="${savedWeight}" />
        </div>

        <!-- Pickup Location -->
        <div class="form-group">
          <label class="form-label">${Icons.mapPin(14)} Pickup Location</label>
          <select id="pickupLocationSelect" class="form-select">
            <option value="">Select pickup location</option>
            ${COURIER_LOCATIONS.map(l => `<option value="${l.id}" ${l.id === savedPickup ? 'selected' : ''}>${l.name} — ${l.area}</option>`).join('')}
            <option value="other" ${savedPickup === 'other' ? 'selected' : ''}>Other (enter manually)</option>
          </select>
        </div>

        <!-- Custom Pickup -->
        <div class="form-group" id="customPickupGroup" style="${customPickupStyle}">
          <label class="form-label">Enter Pickup Address</label>
          <input type="text" id="customPickupLocation" class="form-input" placeholder="Enter full address or location name" value="${savedCustomPickup}" />
        </div>

        <!-- Delivery Location -->
        <div class="form-group">
          <label class="form-label">${Icons.mapPin(14)} Delivery Location</label>
          <select id="deliveryLocationSelect" class="form-select">
            <option value="">Select delivery location</option>
            ${COURIER_LOCATIONS.map(l => `<option value="${l.id}" ${l.id === savedDelivery ? 'selected' : ''}>${l.name} — ${l.area}</option>`).join('')}
            <option value="other" ${savedDelivery === 'other' ? 'selected' : ''}>Other (enter manually)</option>
          </select>
        </div>

        <!-- Custom Delivery -->
        <div class="form-group" id="customDeliveryGroup" style="${customDeliveryStyle}">
          <label class="form-label">Enter Delivery Address</label>
          <input type="text" id="customDeliveryLocation" class="form-input" placeholder="Enter full address or location name" value="${savedCustomDelivery}" />
        </div>

        <!-- Date Selection -->
        <div class="form-group">
          <label class="form-label">${Icons.calendar(14)} Pickup Date</label>
          <div class="golf-date-tabs" id="courierDateTabs">
            ${dateTabs}
          </div>
        </div>

        <!-- Time Slots -->
        <div class="form-group">
          <label class="form-label">${Icons.clock(14)} Pickup Time</label>
          <div id="courierTimeSlots">
            ${renderSlots(morningSlots, 'Morning')}
            ${renderSlots(afternoonSlots, 'Afternoon')}
            ${renderSlots(eveningSlots, 'Evening')}
          </div>
        </div>

        <button class="btn btn--primary btn--lg btn--full" id="courierToStep2" ${!this._isStep1Valid() ? 'disabled' : ''}>
          Continue to Recipient Details
        </button>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // STEP 2 — Recipient & Handling
  // ══════════════════════════════════════════════
  _renderStep2() {
    const user = Auth.getCurrentUser();
    const fd = this._formData;

    const savedRecipientName = fd.recipientName || '';
    const savedRecipientPhone = fd.recipientPhone || '';

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Recipient & Handling</h2>

        <div class="form-group">
          <label class="form-label">${Icons.users(14)} Recipient Name</label>
          <input type="text" id="recipientName" class="form-input" placeholder="Full name of recipient" value="${savedRecipientName}" />
        </div>

        <div class="form-group">
          <label class="form-label">${Icons.phone ? Icons.phone(14) : Icons.info(14)} Recipient Phone</label>
          <input type="text" id="recipientPhone" class="form-input" placeholder="e.g. +971 50 123 4567" value="${savedRecipientPhone}" />
        </div>

        <div class="form-group">
          <label class="form-label">Special Handling <span class="text-muted">(optional)</span></label>
          <div class="request-chips" id="courierHandlingChips">
            <button type="button" class="request-chip" data-value="Fragile">Fragile</button>
            <button type="button" class="request-chip" data-value="Keep Upright">Keep Upright</button>
            <button type="button" class="request-chip" data-value="Temperature Sensitive">Temperature Sensitive</button>
            <button type="button" class="request-chip" data-value="Do Not Bend">Do Not Bend</button>
          </div>
          <textarea id="courierSpecialInstructions" class="form-input" rows="2" placeholder="Any special delivery instructions..."></textarea>
        </div>

        <div class="booking-card-info">
          <div class="booking-card-info__icon">${Icons.creditCard(24)}</div>
          <div>
            <div class="text-semibold">${user.name}</div>
            <div class="text-sm text-muted">${Format.tierLabel(user.cardTier)} Card ending ${user.cardNumber}</div>
          </div>
        </div>

        <div class="booking-reassurance">
          ${Icons.shield(14)}
          <span>Your card will only be validated. No charge will be made now.</span>
        </div>

        <div class="flex gap-md">
          <button class="btn btn--ghost btn--lg" id="courierBackToStep1" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="courierToStep3" style="flex:2">Continue to Review</button>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // STEP 3 — Review & Confirm
  // ══════════════════════════════════════════════
  _renderStep3() {
    const user = Auth.getCurrentUser();
    const fd = this._formData;
    const service = this._service;

    // Resolve package type name
    const pkg = COURIER_PACKAGE_TYPES.find(p => p.id === fd.packageType);
    const packageName = pkg ? pkg.name : fd.packageType;

    // Resolve pickup name
    let pickupName = fd.pickupLocationName || '';
    if (!pickupName) {
      if (fd.pickupLocationId === 'other') {
        pickupName = fd.customPickupLocation || 'Custom location';
      } else {
        const loc = COURIER_LOCATIONS.find(l => l.id === fd.pickupLocationId);
        pickupName = loc ? loc.name : fd.pickupLocationId;
      }
    }

    // Resolve delivery name
    let deliveryName = fd.deliveryLocationName || '';
    if (!deliveryName) {
      if (fd.deliveryLocationId === 'other') {
        deliveryName = fd.customDeliveryLocation || 'Custom location';
      } else {
        const loc = COURIER_LOCATIONS.find(l => l.id === fd.deliveryLocationId);
        deliveryName = loc ? loc.name : fd.deliveryLocationId;
      }
    }

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Review & Confirm</h2>

        <div class="booking-confirm-details">
          <div class="booking-confirm-row">
            <span class="text-muted">Service</span>
            <span class="text-semibold">${service.name}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Package Type</span>
            <span>${packageName}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Weight</span>
            <span>${fd.estimatedWeight} kg</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Pickup</span>
            <span>${pickupName}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Delivery</span>
            <span>${deliveryName}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Date</span>
            <span>${Format.date(fd.bookingDate)}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Time</span>
            <span class="text-semibold">${fd.bookingTime}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Recipient</span>
            <span>${fd.recipientName}</span>
          </div>
          ${fd.recipientPhone ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Phone</span>
              <span>${fd.recipientPhone}</span>
            </div>
          ` : ''}
          ${fd.specialHandling ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Handling</span>
              <span>${fd.specialHandling}</span>
            </div>
          ` : ''}
          ${fd.specialRequests ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Instructions</span>
              <span>${fd.specialRequests}</span>
            </div>
          ` : ''}
          <div class="booking-confirm-row">
            <span class="text-muted">Price</span>
            <span>
              <span class="text-semibold" style="font-size:18px;color:var(--success)">Complimentary</span>
              <span class="text-muted" style="text-decoration:line-through;margin-left:8px">AED ${service.basePrice}</span>
            </span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted"></span>
            <span class="text-sm" style="color:var(--success)">You save AED ${service.basePrice}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Card</span>
            <span>${Format.tierLabel(user.cardTier)} ${user.cardNumber}</span>
          </div>
        </div>

        <div class="booking-reassurance">
          ${Icons.shield(14)}
          <span>Your card will only be validated. No charge will be made now.</span>
        </div>

        <div class="flex gap-md">
          <button class="btn btn--ghost btn--lg" id="courierBackToStep2" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="courierConfirmBtn" style="flex:2">Confirm Delivery</button>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // Mount — Wire up all event handlers
  // ══════════════════════════════════════════════
  mount() {
    Nav.mount();

    // 1. Package type change
    delegate('#app', 'change', '#packageTypeSelect', () => {
      this._validateStep1();
    });

    // 2. Weight input
    delegate('#app', 'input', '#weightEstimate', () => {
      this._validateStep1();
    });

    // 3. Pickup location change
    delegate('#app', 'change', '#pickupLocationSelect', (e, el) => {
      const customGroup = $('#customPickupGroup');
      if (customGroup) {
        customGroup.style.display = el.value === 'other' ? '' : 'none';
      }
      this._validateStep1();
    });

    // 4. Custom pickup input
    delegate('#app', 'input', '#customPickupLocation', () => {
      this._validateStep1();
    });

    // 5. Delivery location change
    delegate('#app', 'change', '#deliveryLocationSelect', (e, el) => {
      const customGroup = $('#customDeliveryGroup');
      if (customGroup) {
        customGroup.style.display = el.value === 'other' ? '' : 'none';
      }
      this._validateStep1();
    });

    // 6. Custom delivery input
    delegate('#app', 'input', '#customDeliveryLocation', () => {
      this._validateStep1();
    });

    // 7. Date tab click
    delegate('#app', 'click', '.golf-date-tab', (e, el) => {
      this._selectedDate = el.dataset.date;
      this._selectedTime = null;
      $$('.golf-date-tab').forEach(t => t.classList.toggle('golf-date-tab--active', t.dataset.date === this._selectedDate));
      $$('.golf-slot').forEach(s => s.classList.remove('golf-slot--selected'));
      this._validateStep1();
    });

    // 8. Time slot click
    delegate('#app', 'click', '.golf-slot', (e, el) => {
      this._selectedTime = el.dataset.slot;
      $$('.golf-slot').forEach(s => s.classList.toggle('golf-slot--selected', s.dataset.slot === this._selectedTime));
      this._validateStep1();
    });

    // 9. Step 1 → Step 2
    delegate('#app', 'click', '#courierToStep2', () => {
      if (!this._isStep1Valid()) return;

      const pickupId = $('#pickupLocationSelect')?.value || '';
      const deliveryId = $('#deliveryLocationSelect')?.value || '';
      const customPickup = ($('#customPickupLocation')?.value || '').trim();
      const customDelivery = ($('#customDeliveryLocation')?.value || '').trim();

      // Resolve location names
      let pickupName = '';
      if (pickupId === 'other') {
        pickupName = customPickup;
      } else {
        const loc = COURIER_LOCATIONS.find(l => l.id === pickupId);
        pickupName = loc ? loc.name : '';
      }

      let deliveryName = '';
      if (deliveryId === 'other') {
        deliveryName = customDelivery;
      } else {
        const loc = COURIER_LOCATIONS.find(l => l.id === deliveryId);
        deliveryName = loc ? loc.name : '';
      }

      this._formData.packageType = $('#packageTypeSelect')?.value || '';
      this._formData.estimatedWeight = $('#weightEstimate')?.value || '';
      this._formData.pickupLocationId = pickupId;
      this._formData.pickupLocationName = pickupName;
      this._formData.customPickupLocation = customPickup;
      this._formData.deliveryLocationId = deliveryId;
      this._formData.deliveryLocationName = deliveryName;
      this._formData.customDeliveryLocation = customDelivery;
      this._formData.bookingDate = this._selectedDate;
      this._formData.bookingTime = this._selectedTime;

      this._step = 2;
      const form = $('#courierBookingForm');
      if (form) form.innerHTML = this._renderStep2();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 10. Step 2 → Step 3
    delegate('#app', 'click', '#courierToStep3', () => {
      const chipValues = Array.from(document.querySelectorAll('#courierHandlingChips .request-chip--selected'))
        .map(chip => chip.dataset.value);
      const textareaVal = ($('#courierSpecialInstructions')?.value || '').trim();

      this._formData.recipientName = ($('#recipientName')?.value || '').trim();
      this._formData.recipientPhone = ($('#recipientPhone')?.value || '').trim();
      this._formData.specialHandling = chipValues.join(', ');
      this._formData.specialRequests = textareaVal;

      this._step = 3;
      const form = $('#courierBookingForm');
      if (form) form.innerHTML = this._renderStep3();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 11a. Back to Step 1
    delegate('#app', 'click', '#courierBackToStep1', () => {
      this._step = 1;
      const form = $('#courierBookingForm');
      if (form) form.innerHTML = this._renderStep1();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 11b. Back to Step 2
    delegate('#app', 'click', '#courierBackToStep2', () => {
      this._step = 2;
      const form = $('#courierBookingForm');
      if (form) form.innerHTML = this._renderStep2();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 12. Confirm booking
    delegate('#app', 'click', '#courierConfirmBtn', () => {
      this._confirmBooking();
    });

    // 13. Request chip toggle
    delegate('#app', 'click', '.request-chip', (e) => {
      e.target.classList.toggle('request-chip--selected');
    });

    // 14. Sticky CTA delegates to inline button
    delegate('#app', 'click', '#courierStickyContinueBtn', () => {
      if (this._step === 1) {
        const btn = $('#courierToStep2');
        if (btn && !btn.disabled) btn.click();
      } else if (this._step === 2) {
        const btn = $('#courierToStep3');
        if (btn) btn.click();
      } else if (this._step === 3) {
        const btn = $('#courierConfirmBtn');
        if (btn) btn.click();
      }
    });

    // Initial sticky observer setup
    this._setupStickyObserver();
  },

  // ══════════════════════════════════════════════
  // Validation
  // ══════════════════════════════════════════════
  _validateStep1() {
    const btn = $('#courierToStep2');
    if (btn) {
      btn.disabled = !this._isStep1Valid();
    }
  },

  _isStep1Valid() {
    const packageVal = $('#packageTypeSelect')?.value || '';
    const weightVal = parseFloat($('#weightEstimate')?.value || '0');
    const pickupVal = $('#pickupLocationSelect')?.value || '';
    const deliveryVal = $('#deliveryLocationSelect')?.value || '';
    const customPickupVal = ($('#customPickupLocation')?.value || '').trim();
    const customDeliveryVal = ($('#customDeliveryLocation')?.value || '').trim();

    if (!packageVal) return false;
    if (!weightVal || weightVal <= 0 || weightVal > this._service.maxWeight) return false;
    if (!pickupVal) return false;
    if (pickupVal === 'other' && !customPickupVal) return false;
    if (!deliveryVal) return false;
    if (deliveryVal === 'other' && !customDeliveryVal) return false;
    if (!this._selectedDate) return false;
    if (!this._selectedTime) return false;

    return true;
  },

  // ══════════════════════════════════════════════
  // Sticky CTA
  // ══════════════════════════════════════════════
  _updateStickyCta() {
    const stickyBtn = $('#courierStickyContinueBtn');
    if (!stickyBtn) return;
    if (this._step === 1) stickyBtn.textContent = 'Continue';
    else if (this._step === 2) stickyBtn.textContent = 'Continue to Review';
    else if (this._step === 3) stickyBtn.textContent = 'Confirm Delivery';
  },

  _setupStickyObserver() {
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    requestAnimationFrame(() => {
      const inlineCta = document.querySelector('#courierBookingForm .btn--primary');
      const stickyCta = $('#courier-booking-sticky-cta');
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

  // ══════════════════════════════════════════════
  // Confirm Booking
  // ══════════════════════════════════════════════
  _confirmBooking() {
    const fd = this._formData;

    // Resolve pickup location name
    let pickupName = fd.pickupLocationName || '';
    if (!pickupName) {
      if (fd.pickupLocationId === 'other') {
        pickupName = fd.customPickupLocation || 'Custom location';
      } else {
        const loc = COURIER_LOCATIONS.find(l => l.id === fd.pickupLocationId);
        pickupName = loc ? loc.name : fd.pickupLocationId;
      }
    }

    // Resolve delivery location name
    let deliveryName = fd.deliveryLocationName || '';
    if (!deliveryName) {
      if (fd.deliveryLocationId === 'other') {
        deliveryName = fd.customDeliveryLocation || 'Custom location';
      } else {
        const loc = COURIER_LOCATIONS.find(l => l.id === fd.deliveryLocationId);
        deliveryName = loc ? loc.name : fd.deliveryLocationId;
      }
    }

    const booking = Store.createCourierBooking({
      serviceId: this._serviceId,
      packageType: fd.packageType,
      estimatedWeight: fd.estimatedWeight,
      pickupLocationId: fd.pickupLocationId,
      pickupLocationName: pickupName,
      deliveryLocationId: fd.deliveryLocationId,
      deliveryLocationName: deliveryName,
      bookingDate: fd.bookingDate,
      bookingTime: fd.bookingTime,
      recipientName: fd.recipientName || '',
      recipientPhone: fd.recipientPhone || '',
      specialHandling: fd.specialHandling || '',
      specialRequests: fd.specialRequests || '',
    });

    // Hide sticky CTA
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    const stickyCta = $('#courier-booking-sticky-cta');
    if (stickyCta) stickyCta.classList.remove('booking-sticky-cta--visible');

    // Show success
    const form = $('#courierBookingForm');
    if (form) {
      form.innerHTML = `
        <div class="booking-success">
          <div class="booking-success__icon">${Icons.checkCircle(48)}</div>
          <h2 class="booking-success__title page-title">Delivery Confirmed!</h2>
          <p class="booking-success__text">Your courier delivery has been booked. Pickup from ${pickupName} to ${deliveryName}.</p>

          <div class="booking-confirm-details" style="text-align:left;margin:24px 0">
            <div class="booking-confirm-row">
              <span class="text-muted">Date</span>
              <span>${Format.date(fd.bookingDate)}</span>
            </div>
            <div class="booking-confirm-row">
              <span class="text-muted">Time</span>
              <span class="text-semibold">${fd.bookingTime}</span>
            </div>
            <div class="booking-confirm-row">
              <span class="text-muted">Service</span>
              <span>${this._service.name}</span>
            </div>
            <div class="booking-confirm-row">
              <span class="text-muted">Recipient</span>
              <span>${fd.recipientName}</span>
            </div>
          </div>

          <div class="confirmation-code">${booking.confirmationCode}</div>
          <p class="text-sm text-muted" style="margin-top:8px">Save this confirmation code · Track your delivery</p>

          <div class="flex gap-md" style="margin-top:24px">
            <button class="btn btn--ghost btn--lg" onclick="Router.navigate('/courier')" style="flex:1">Back to Courier</button>
            <button class="btn btn--primary btn--lg" onclick="Router.navigate('/my-bookings/${booking.id}')" style="flex:2">View Booking</button>
          </div>
        </div>
      `;
    }
  },

  // ══════════════════════════════════════════════
  // Unmount
  // ══════════════════════════════════════════════
  unmount() {
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
  },

  // ══════════════════════════════════════════════
  // Helpers
  // ══════════════════════════════════════════════
  _getNextDays(count) {
    const days = [];
    const today = new Date();
    for (let i = 0; i < count; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  },

  _formatShortDay(date) {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString('en-AE', { weekday: 'short' });
  },

  _notFound() {
    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="empty-state" style="padding-top:80px">
              <div class="empty-state__icon">${Icons.search(48)}</div>
              <h2 class="empty-state__title">Service Not Found</h2>
              <p class="empty-state__text">This courier service may not be available.</p>
              <button class="btn btn--primary" onclick="Router.navigate('/courier')">Back to Local Courier</button>
            </div>
          </div>
        </main>
      </div>
    `;
  },
};

window.CourierBookingPage = CourierBookingPage;
