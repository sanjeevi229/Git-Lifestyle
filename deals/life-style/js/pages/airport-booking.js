// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Airport Booking Page (3-step)
// ══════════════════════════════════════════════

const AirportBookingPage = {
  _vehicleId: null,
  _vehicle: null,
  _step: 1,
  _formData: {},
  _stickyObserver: null,
  _selectedDate: null,
  _selectedTime: null,
  _transferType: 'pickup',

  render(params, query) {
    const vehicle = VEHICLE_TYPES.find(v => v.id === query.vehicle);
    if (!vehicle) return this._notFound();
    this._vehicle = vehicle;
    this._vehicleId = vehicle.id;
    this._step = 1;
    this._formData = {};
    this._selectedDate = null;
    this._selectedTime = null;
    this._transferType = 'pickup';

    return `
      <div class="page page--no-dark">
        ${Nav.render()}
        <main class="page__main page__main--full page__main--booking">
          <div class="container">
            <div class="breadcrumb">
              <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="Router.navigate('/airport')">Airport Transfer</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">Book Transfer</span>
            </div>

            <div class="booking-layout">
              <!-- Summary Panel -->
              <div class="booking-summary">
                <div class="booking-summary__image">
                  <img src="${vehicle.image}" alt="${vehicle.name}" />
                </div>
                <h3 class="booking-summary__title">${vehicle.name}</h3>
                <div class="booking-summary__detail">${vehicle.description}</div>
                <div class="booking-summary__detail">${Icons.users(14)} Up to ${vehicle.maxPassengers} passengers</div>
                <div class="booking-summary__detail">${Icons.luggage(14)} Up to ${vehicle.maxBags} bags</div>
                <div class="booking-summary__badge">
                  <span class="discount-badge discount-badge--green">Complimentary</span>
                </div>
              </div>

              <!-- Booking Form -->
              <div class="booking-form" id="airportBookingForm">
                ${this._renderStep1()}
              </div>
            </div>
          </div>
        </main>

        <!-- Sticky Mobile CTA -->
        <div class="booking-sticky-cta" id="airport-booking-sticky-cta">
          <button class="btn btn--primary btn--lg booking-sticky-cta__btn" id="airportStickyContinueBtn">
            Continue
          </button>
        </div>
      </div>
    `;
  },

  // ── Progress Steps ──
  _renderProgress() {
    const steps = [
      { num: 1, label: 'Trip Details' },
      { num: 2, label: 'Passengers' },
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
        <img src="${this._vehicle.image}" alt="" class="booking-reminder__img" />
        <div class="booking-reminder__info">
          <div class="booking-reminder__title">${this._vehicle.name}</div>
          <div class="booking-reminder__meta">${this._vehicle.description}</div>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // STEP 1 — Trip Details
  // ══════════════════════════════════════════════
  _renderStep1() {
    const days = this._getNextDays(7);
    const selectedDateStr = this._selectedDate;

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
    const morningSlots = AIRPORT_TIME_SLOTS.filter(s => {
      const hour = parseInt(s.split(':')[0]);
      return hour < 12;
    });
    const afternoonSlots = AIRPORT_TIME_SLOTS.filter(s => {
      const hour = parseInt(s.split(':')[0]);
      return hour >= 12 && hour < 18;
    });
    const eveningSlots = AIRPORT_TIME_SLOTS.filter(s => {
      const hour = parseInt(s.split(':')[0]);
      return hour >= 18;
    });

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

    const locationLabel = this._transferType === 'pickup' ? 'Drop-off Location' : 'Pickup Location';

    // Restore form selections if going back
    const fd = this._formData;
    const savedAirport = fd.airportId || '';
    const savedTerminal = fd.terminal || '';
    const savedLocation = fd.locationId || '';
    const savedCustomLocation = fd.customLocation || '';

    // Build terminal options if airport was previously selected
    let terminalOptions = '';
    let terminalGroupStyle = 'display:none';
    if (savedAirport) {
      const airport = AIRPORT_LOCATIONS.find(a => a.id === savedAirport);
      if (airport) {
        terminalGroupStyle = '';
        terminalOptions = `<option value="">Select terminal</option>` +
          airport.terminals.map(t => `<option value="${t}" ${t === savedTerminal ? 'selected' : ''}>${t}</option>`).join('');
      }
    }

    // Custom location visibility
    const customLocationStyle = savedLocation === 'other' ? '' : 'display:none';

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Trip Details</h2>

        <!-- Transfer Type Toggle -->
        <div class="form-group">
          <label class="form-label">Transfer Type</label>
          <div class="airport-transfer-toggle">
            <button type="button" class="airport-transfer-toggle__btn ${this._transferType === 'pickup' ? 'airport-transfer-toggle__btn--active' : ''}" data-type="pickup">
              ${Icons.plane(16)} Airport Pickup
            </button>
            <button type="button" class="airport-transfer-toggle__btn ${this._transferType === 'dropoff' ? 'airport-transfer-toggle__btn--active' : ''}" data-type="dropoff">
              ${Icons.plane(16)} Airport Drop-off
            </button>
          </div>
        </div>

        <!-- Airport Select -->
        <div class="form-group">
          <label class="form-label">Airport</label>
          <select id="airportSelect" class="form-select">
            <option value="">Select airport</option>
            ${AIRPORT_LOCATIONS.map(a => `<option value="${a.id}" ${a.id === savedAirport ? 'selected' : ''}>${a.name} (${a.code})</option>`).join('')}
          </select>
        </div>

        <!-- Terminal Select -->
        <div class="form-group" id="terminalGroup" style="${terminalGroupStyle}">
          <label class="form-label">Terminal</label>
          <select id="terminalSelect" class="form-select">
            ${terminalOptions || '<option value="">Select terminal</option>'}
          </select>
        </div>

        <!-- Location Select -->
        <div class="form-group">
          <label class="form-label" id="locationLabel">${locationLabel}</label>
          <select id="locationSelect" class="form-select">
            <option value="">Select location</option>
            ${POPULAR_LOCATIONS.map(l => `<option value="${l.id}" ${l.id === savedLocation ? 'selected' : ''}>${l.name} — ${l.area}</option>`).join('')}
            <option value="other" ${savedLocation === 'other' ? 'selected' : ''}>Other (enter manually)</option>
          </select>
        </div>

        <!-- Custom Location -->
        <div class="form-group" id="customLocationGroup" style="${customLocationStyle}">
          <label class="form-label">Enter Location</label>
          <input type="text" id="customLocation" class="form-input" placeholder="Enter full address or location name" value="${savedCustomLocation}" />
        </div>

        <!-- Date Selection -->
        <div class="form-group">
          <label class="form-label">${Icons.calendar(14)} Select Date</label>
          <div class="golf-date-tabs" id="airportDateTabs">
            ${dateTabs}
          </div>
        </div>

        <!-- Time Slots -->
        <div class="form-group">
          <label class="form-label">${Icons.clock(14)} Select Time</label>
          <div id="airportTimeSlots">
            ${renderSlots(morningSlots, 'Morning')}
            ${renderSlots(afternoonSlots, 'Afternoon')}
            ${renderSlots(eveningSlots, 'Evening')}
          </div>
        </div>

        <button class="btn btn--primary btn--lg btn--full" id="airportToStep2" ${!this._isStep1Valid() ? 'disabled' : ''}>
          Continue to Passenger Details
        </button>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // STEP 2 — Passenger & Flight Details
  // ══════════════════════════════════════════════
  _renderStep2() {
    const user = Auth.getCurrentUser();
    const vehicle = this._vehicle;
    const fd = this._formData;

    // Restore previous selections
    const savedFlight = fd.flightNumber || '';
    const savedPassengers = fd.passengers || '1';
    const savedBags = fd.bags || '1';
    const savedBabySeats = fd.babySeats || '0';

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Passenger & Flight Details</h2>

        <div class="form-group">
          <label class="form-label">${Icons.plane(14)} Flight Number <span class="text-muted">(optional)</span></label>
          <input type="text" id="flightNumber" class="form-input" placeholder="e.g. EK 203" value="${savedFlight}" />
        </div>

        <div class="form-group">
          <label class="form-label">${Icons.users(14)} Number of Passengers</label>
          <select id="passengerCount" class="form-select">
            ${Array.from({length: vehicle.maxPassengers}, (_, i) => i + 1).map(n =>
              `<option value="${n}" ${String(n) === String(savedPassengers) ? 'selected' : ''}>${n} ${n === 1 ? 'Passenger' : 'Passengers'}</option>`
            ).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">${Icons.luggage(14)} Number of Bags</label>
          <select id="bagCount" class="form-select">
            ${Array.from({length: vehicle.maxBags + 1}, (_, i) => i).map(n =>
              `<option value="${n}" ${String(n) === String(savedBags) ? 'selected' : ''}>${n} ${n === 1 ? 'Bag' : 'Bags'}</option>`
            ).join('')}
          </select>
        </div>

        ${vehicle.babySeatAvailable ? `
          <div class="form-group">
            <label class="form-label">Baby Seats</label>
            <select id="babySeatCount" class="form-select">
              ${[0, 1, 2].map(n =>
                `<option value="${n}" ${String(n) === String(savedBabySeats) ? 'selected' : ''}>${n} ${n === 1 ? 'Baby Seat' : 'Baby Seats'}</option>`
              ).join('')}
            </select>
          </div>
        ` : ''}

        <div class="form-group">
          <label class="form-label">Special Requests <span class="text-muted">(optional)</span></label>
          <div class="request-chips" id="airportRequestChips">
            <button type="button" class="request-chip" data-value="Name board at arrival">Name board at arrival</button>
            <button type="button" class="request-chip" data-value="Meet at gate">Meet at gate</button>
            <button type="button" class="request-chip" data-value="Child seat">Child seat</button>
            <button type="button" class="request-chip" data-value="Wheelchair accessible">Wheelchair accessible</button>
          </div>
          <textarea id="airportSpecialRequests" class="form-input" rows="2" placeholder="Any additional requests..."></textarea>
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
          <button class="btn btn--ghost btn--lg" id="airportBackToStep1" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="airportToStep3" style="flex:2">Continue to Review</button>
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
    const vehicle = this._vehicle;

    // Resolve airport name
    const airport = AIRPORT_LOCATIONS.find(a => a.id === fd.airportId);
    const airportName = airport ? `${airport.name} (${airport.code})` : fd.airportId;

    // Resolve location name
    let locationName = fd.locationName || '';
    if (!locationName) {
      if (fd.locationId === 'other') {
        locationName = fd.customLocation || 'Custom location';
      } else {
        const loc = POPULAR_LOCATIONS.find(l => l.id === fd.locationId);
        locationName = loc ? loc.name : fd.locationId;
      }
    }

    const transferLabel = fd.transferType === 'pickup' ? 'Airport Pickup' : 'Airport Drop-off';

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Review & Confirm</h2>

        <div class="booking-confirm-details">
          <div class="booking-confirm-row">
            <span class="text-muted">Transfer Type</span>
            <span class="text-semibold">${transferLabel}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Vehicle</span>
            <span class="text-semibold">${vehicle.name}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Airport</span>
            <span>${airportName}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Terminal</span>
            <span>${fd.terminal}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">${fd.transferType === 'pickup' ? 'Drop-off' : 'Pickup'} Location</span>
            <span>${locationName}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Date</span>
            <span>${Format.date(fd.bookingDate)}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Time</span>
            <span class="text-semibold">${fd.bookingTime}</span>
          </div>
          ${fd.flightNumber ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Flight</span>
              <span>${fd.flightNumber}</span>
            </div>
          ` : ''}
          <div class="booking-confirm-row">
            <span class="text-muted">Passengers</span>
            <span>${fd.passengers} ${parseInt(fd.passengers) === 1 ? 'Passenger' : 'Passengers'}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Bags</span>
            <span>${fd.bags} ${parseInt(fd.bags) === 1 ? 'Bag' : 'Bags'}</span>
          </div>
          ${parseInt(fd.babySeats) > 0 ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Baby Seats</span>
              <span>${fd.babySeats}</span>
            </div>
          ` : ''}
          ${fd.specialRequests ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Special Requests</span>
              <span>${fd.specialRequests}</span>
            </div>
          ` : ''}
          <div class="booking-confirm-row">
            <span class="text-muted">Price</span>
            <span>
              <span class="text-semibold" style="font-size:18px;color:var(--success)">Complimentary</span>
              <span class="text-muted" style="text-decoration:line-through;margin-left:8px">AED ${vehicle.basePrice}</span>
            </span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted"></span>
            <span class="text-sm" style="color:var(--success)">You save AED ${vehicle.basePrice}</span>
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
          <button class="btn btn--ghost btn--lg" id="airportBackToStep2" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="airportConfirmBtn" style="flex:2">Confirm Transfer</button>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // Mount — Wire up all event handlers
  // ══════════════════════════════════════════════
  mount() {
    Nav.mount();

    // 1. Transfer type toggle
    delegate('#app', 'click', '.airport-transfer-toggle__btn', (e, el) => {
      this._transferType = el.dataset.type;
      $$('.airport-transfer-toggle__btn').forEach(btn =>
        btn.classList.toggle('airport-transfer-toggle__btn--active', btn.dataset.type === this._transferType)
      );
      // Update location label
      const locationLabel = $('#locationLabel');
      if (locationLabel) {
        locationLabel.textContent = this._transferType === 'pickup' ? 'Drop-off Location' : 'Pickup Location';
      }
      this._validateStep1();
    });

    // 2. Airport change — populate terminal dropdown
    delegate('#app', 'change', '#airportSelect', (e, el) => {
      const airportId = el.value;
      const airport = AIRPORT_LOCATIONS.find(a => a.id === airportId);
      const terminalGroup = $('#terminalGroup');
      const terminalSelect = $('#terminalSelect');

      if (airport && terminalGroup && terminalSelect) {
        terminalSelect.innerHTML = `
          <option value="">Select terminal</option>
          ${airport.terminals.map(t => `<option value="${t}">${t}</option>`).join('')}
        `;
        terminalGroup.style.display = '';
      } else if (terminalGroup) {
        terminalGroup.style.display = 'none';
        if (terminalSelect) terminalSelect.innerHTML = '<option value="">Select terminal</option>';
      }
      this._validateStep1();
    });

    // 3. Terminal change
    delegate('#app', 'change', '#terminalSelect', () => {
      this._validateStep1();
    });

    // 4. Location change — show/hide custom input
    delegate('#app', 'change', '#locationSelect', (e, el) => {
      const customGroup = $('#customLocationGroup');
      if (customGroup) {
        customGroup.style.display = el.value === 'other' ? '' : 'none';
      }
      this._validateStep1();
    });

    // 5. Custom location input
    delegate('#app', 'input', '#customLocation', () => {
      this._validateStep1();
    });

    // 6. Date tab click
    delegate('#app', 'click', '.golf-date-tab', (e, el) => {
      this._selectedDate = el.dataset.date;
      this._selectedTime = null;
      $$('.golf-date-tab').forEach(t => t.classList.toggle('golf-date-tab--active', t.dataset.date === this._selectedDate));
      $$('.golf-slot').forEach(s => s.classList.remove('golf-slot--selected'));
      this._validateStep1();
    });

    // 7. Time slot click
    delegate('#app', 'click', '.golf-slot', (e, el) => {
      this._selectedTime = el.dataset.slot;
      $$('.golf-slot').forEach(s => s.classList.toggle('golf-slot--selected', s.dataset.slot === this._selectedTime));
      this._validateStep1();
    });

    // 8. Step 1 → Step 2
    delegate('#app', 'click', '#airportToStep2', () => {
      if (!this._isStep1Valid()) return;

      const airportId = $('#airportSelect')?.value || '';
      const terminal = $('#terminalSelect')?.value || '';
      const locationId = $('#locationSelect')?.value || '';
      const customLocation = $('#customLocation')?.value?.trim() || '';

      // Resolve location name
      let locationName = '';
      if (locationId === 'other') {
        locationName = customLocation;
      } else {
        const loc = POPULAR_LOCATIONS.find(l => l.id === locationId);
        locationName = loc ? loc.name : '';
      }

      this._formData.transferType = this._transferType;
      this._formData.airportId = airportId;
      this._formData.terminal = terminal;
      this._formData.locationId = locationId;
      this._formData.locationName = locationName;
      this._formData.customLocation = customLocation;
      this._formData.bookingDate = this._selectedDate;
      this._formData.bookingTime = this._selectedTime;

      this._step = 2;
      const form = $('#airportBookingForm');
      if (form) form.innerHTML = this._renderStep2();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 9. Step 2 → Step 3
    delegate('#app', 'click', '#airportToStep3', () => {
      const chipValues = Array.from(document.querySelectorAll('#airportRequestChips .request-chip--selected'))
        .map(chip => chip.dataset.value);
      const textareaVal = ($('#airportSpecialRequests')?.value || '').trim();
      const allRequests = [...chipValues, textareaVal].filter(Boolean).join(', ');

      this._formData.flightNumber = ($('#flightNumber')?.value || '').trim();
      this._formData.passengers = $('#passengerCount')?.value || '1';
      this._formData.bags = $('#bagCount')?.value || '1';
      this._formData.babySeats = $('#babySeatCount')?.value || '0';
      this._formData.specialRequests = allRequests;

      this._step = 3;
      const form = $('#airportBookingForm');
      if (form) form.innerHTML = this._renderStep3();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 10a. Back to Step 1
    delegate('#app', 'click', '#airportBackToStep1', () => {
      this._step = 1;
      const form = $('#airportBookingForm');
      if (form) form.innerHTML = this._renderStep1();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 10b. Back to Step 2
    delegate('#app', 'click', '#airportBackToStep2', () => {
      this._step = 2;
      const form = $('#airportBookingForm');
      if (form) form.innerHTML = this._renderStep2();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 11. Confirm booking
    delegate('#app', 'click', '#airportConfirmBtn', () => {
      this._confirmBooking();
    });

    // 12. Request chip toggle
    delegate('#app', 'click', '.request-chip', (e) => {
      e.target.classList.toggle('request-chip--selected');
    });

    // 13. Sticky CTA delegates to inline button
    delegate('#app', 'click', '#airportStickyContinueBtn', () => {
      if (this._step === 1) {
        const btn = $('#airportToStep2');
        if (btn && !btn.disabled) btn.click();
      } else if (this._step === 2) {
        const btn = $('#airportToStep3');
        if (btn) btn.click();
      } else if (this._step === 3) {
        const btn = $('#airportConfirmBtn');
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
    const btn = $('#airportToStep2');
    if (btn) {
      btn.disabled = !this._isStep1Valid();
    }
  },

  _isStep1Valid() {
    const airportVal = $('#airportSelect')?.value || '';
    const terminalVal = $('#terminalSelect')?.value || '';
    const locationVal = $('#locationSelect')?.value || '';
    const customVal = ($('#customLocation')?.value || '').trim();

    if (!airportVal) return false;
    if (!terminalVal) return false;
    if (!locationVal) return false;
    if (locationVal === 'other' && !customVal) return false;
    if (!this._selectedDate) return false;
    if (!this._selectedTime) return false;

    return true;
  },

  // ══════════════════════════════════════════════
  // Sticky CTA
  // ══════════════════════════════════════════════
  _updateStickyCta() {
    const stickyBtn = $('#airportStickyContinueBtn');
    if (!stickyBtn) return;
    if (this._step === 1) stickyBtn.textContent = 'Continue';
    else if (this._step === 2) stickyBtn.textContent = 'Continue to Review';
    else if (this._step === 3) stickyBtn.textContent = 'Confirm Transfer';
  },

  _setupStickyObserver() {
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    requestAnimationFrame(() => {
      const inlineCta = document.querySelector('#airportBookingForm .btn--primary');
      const stickyCta = $('#airport-booking-sticky-cta');
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

    // Resolve location name
    let locationName = fd.locationName || '';
    if (!locationName) {
      if (fd.locationId === 'other') {
        locationName = fd.customLocation || 'Custom location';
      } else {
        const loc = POPULAR_LOCATIONS.find(l => l.id === fd.locationId);
        locationName = loc ? loc.name : fd.locationId;
      }
    }

    const booking = Store.createAirportBooking({
      vehicleId: this._vehicleId,
      transferType: fd.transferType,
      airportId: fd.airportId,
      terminal: fd.terminal,
      locationId: fd.locationId,
      locationName: locationName,
      bookingDate: fd.bookingDate,
      bookingTime: fd.bookingTime,
      flightNumber: fd.flightNumber || '',
      passengers: parseInt(fd.passengers) || 1,
      bags: parseInt(fd.bags) || 1,
      babySeats: parseInt(fd.babySeats) || 0,
      specialRequests: fd.specialRequests || '',
    });

    // Hide sticky CTA
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    const stickyCta = $('#airport-booking-sticky-cta');
    if (stickyCta) stickyCta.classList.remove('booking-sticky-cta--visible');

    // Resolve airport name for display
    const airport = AIRPORT_LOCATIONS.find(a => a.id === fd.airportId);
    const airportDisplay = airport ? airport.name : fd.airportId;
    const transferLabel = fd.transferType === 'pickup' ? 'Pickup from' : 'Drop-off at';

    // Show success
    const form = $('#airportBookingForm');
    if (form) {
      form.innerHTML = `
        <div class="booking-success">
          <div class="booking-success__icon">${Icons.checkCircle(48)}</div>
          <h2 class="booking-success__title page-title">Transfer Confirmed!</h2>
          <p class="booking-success__text">Your airport transfer has been booked. ${transferLabel} ${airportDisplay}.</p>

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
              <span class="text-muted">Vehicle</span>
              <span>${this._vehicle.name}</span>
            </div>
            <div class="booking-confirm-row">
              <span class="text-muted">Passengers</span>
              <span>${fd.passengers}</span>
            </div>
          </div>

          <div class="confirmation-code">${booking.confirmationCode}</div>
          <p class="text-sm text-muted" style="margin-top:8px">Save this confirmation code · Show to driver</p>

          <div class="flex gap-md" style="margin-top:24px">
            <button class="btn btn--ghost btn--lg" onclick="Router.navigate('/airport')" style="flex:1">Back to Transfers</button>
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
              <h2 class="empty-state__title">Vehicle Not Found</h2>
              <p class="empty-state__text">This vehicle type may not be available.</p>
              <button class="btn btn--primary" onclick="Router.navigate('/airport')">Back to Airport Transfer</button>
            </div>
          </div>
        </main>
      </div>
    `;
  },
};

window.AirportBookingPage = AirportBookingPage;
