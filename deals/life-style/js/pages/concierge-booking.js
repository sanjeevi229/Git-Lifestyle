// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Concierge Booking Page (3-step)
// ══════════════════════════════════════════════

const ConciergeBookingPage = {
  _serviceId: null,
  _service: null,
  _step: 1,
  _formData: {},
  _stickyObserver: null,
  _selectedDate: null,
  _selectedTime: null,

  render(params, query) {
    const service = CONCIERGE_SERVICE_TYPES.find(s => s.id === query.service);
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
              <span class="breadcrumb__item" onclick="Router.navigate('/concierge')">Concierge</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">Submit Request</span>
            </div>

            <div class="booking-layout">
              <!-- Summary Panel -->
              <div class="booking-summary">
                <div class="booking-summary__image">
                  <img src="${service.image}" alt="${service.name}" />
                </div>
                <h3 class="booking-summary__title">${service.name}</h3>
                <div class="booking-summary__detail">${service.description}</div>
                <div class="booking-summary__detail">${Icons.clock(14)} Response within ${service.turnaround}</div>
                <div class="booking-summary__badge">
                  <span class="discount-badge discount-badge--green">Complimentary</span>
                </div>
              </div>

              <!-- Booking Form -->
              <div class="booking-form" id="conciergeBookingForm">
                ${this._renderStep1()}
              </div>
            </div>
          </div>
        </main>

        <!-- Sticky Mobile CTA -->
        <div class="booking-sticky-cta" id="concierge-booking-sticky-cta">
          <button class="btn btn--primary btn--lg booking-sticky-cta__btn" id="conciergeStickyContinueBtn">
            Continue
          </button>
        </div>
      </div>
    `;
  },

  // ── Progress Steps ──
  _renderProgress() {
    const steps = [
      { num: 1, label: 'Request Details' },
      { num: 2, label: 'Preferences' },
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
  // STEP 1 — Request Details
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

    // Split time slots
    const morningSlots = CONCIERGE_TIME_SLOTS.filter(s => parseInt(s.split(':')[0]) < 12);
    const afternoonSlots = CONCIERGE_TIME_SLOTS.filter(s => {
      const hour = parseInt(s.split(':')[0]);
      return hour >= 12 && hour < 18;
    });
    const eveningSlots = CONCIERGE_TIME_SLOTS.filter(s => parseInt(s.split(':')[0]) >= 18);

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

    // Show guests field only for restaurant, spa, events
    const showGuests = ['restaurant', 'spa', 'events'].includes(this._serviceId);
    const savedDescription = fd.requestDescription || '';
    const savedBudget = fd.budgetRange || '';
    const savedGuests = fd.guests || '';

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Request Details</h2>

        <!-- Request Description -->
        <div class="form-group">
          <label class="form-label">${Icons.edit ? Icons.edit(14) : Icons.info(14)} Describe Your Request</label>
          <textarea id="conciergeDescription" class="form-input" rows="4" placeholder="Tell us what you need — the more detail, the better we can help...">${savedDescription}</textarea>
        </div>

        <!-- Preferred Date -->
        <div class="form-group">
          <label class="form-label">${Icons.calendar(14)} Preferred Date</label>
          <div class="golf-date-tabs" id="conciergeDateTabs">
            ${dateTabs}
          </div>
        </div>

        <!-- Preferred Time -->
        <div class="form-group">
          <label class="form-label">${Icons.clock(14)} Preferred Time</label>
          <div id="conciergeTimeSlots">
            ${renderSlots(morningSlots, 'Morning')}
            ${renderSlots(afternoonSlots, 'Afternoon')}
            ${renderSlots(eveningSlots, 'Evening')}
          </div>
        </div>

        <!-- Budget Range -->
        <div class="form-group">
          <label class="form-label">Budget Range <span class="text-muted">(optional)</span></label>
          <select id="conciergeBudget" class="form-select">
            <option value="" ${!savedBudget ? 'selected' : ''}>No preference</option>
            <option value="under-500" ${savedBudget === 'under-500' ? 'selected' : ''}>Under AED 500</option>
            <option value="500-1000" ${savedBudget === '500-1000' ? 'selected' : ''}>AED 500 – 1,000</option>
            <option value="1000-5000" ${savedBudget === '1000-5000' ? 'selected' : ''}>AED 1,000 – 5,000</option>
            <option value="5000+" ${savedBudget === '5000+' ? 'selected' : ''}>AED 5,000+</option>
          </select>
        </div>

        ${showGuests ? `
        <!-- Number of Guests -->
        <div class="form-group">
          <label class="form-label">${Icons.users(14)} Number of Guests</label>
          <select id="conciergeGuests" class="form-select">
            ${[1,2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${n == savedGuests ? 'selected' : ''}>${n} ${n === 1 ? 'guest' : 'guests'}</option>`).join('')}
          </select>
        </div>
        ` : ''}

        <button class="btn btn--primary btn--lg btn--full" id="conciergeToStep2" ${!this._isStep1Valid() ? 'disabled' : ''}>
          Continue to Preferences
        </button>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // STEP 2 — Preferences
  // ══════════════════════════════════════════════
  _renderStep2() {
    const user = Auth.getCurrentUser();
    const fd = this._formData;

    const savedContactMethod = fd.contactMethod || '';
    const savedContactTime = fd.contactTime || '';
    const savedOccasion = fd.occasion || '';
    const savedSpecialRequests = fd.specialRequests || '';

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Preferences</h2>

        <!-- Contact Method -->
        <div class="form-group">
          <label class="form-label">Preferred Contact Method</label>
          <div class="request-chips" id="conciergeContactChips">
            <button type="button" class="request-chip ${savedContactMethod === 'Phone' ? 'request-chip--selected' : ''}" data-value="Phone">Phone</button>
            <button type="button" class="request-chip ${savedContactMethod === 'WhatsApp' ? 'request-chip--selected' : ''}" data-value="WhatsApp">WhatsApp</button>
            <button type="button" class="request-chip ${savedContactMethod === 'Email' ? 'request-chip--selected' : ''}" data-value="Email">Email</button>
            <button type="button" class="request-chip ${savedContactMethod === 'SMS' ? 'request-chip--selected' : ''}" data-value="SMS">SMS</button>
          </div>
        </div>

        <!-- Preferred Contact Time -->
        <div class="form-group">
          <label class="form-label">${Icons.clock(14)} Preferred Contact Time</label>
          <select id="conciergeContactTime" class="form-select">
            <option value="anytime" ${savedContactTime === 'anytime' || !savedContactTime ? 'selected' : ''}>Anytime</option>
            <option value="morning" ${savedContactTime === 'morning' ? 'selected' : ''}>Morning (9 AM – 12 PM)</option>
            <option value="afternoon" ${savedContactTime === 'afternoon' ? 'selected' : ''}>Afternoon (12 PM – 5 PM)</option>
            <option value="evening" ${savedContactTime === 'evening' ? 'selected' : ''}>Evening (5 PM – 9 PM)</option>
          </select>
        </div>

        <!-- Occasion -->
        <div class="form-group">
          <label class="form-label">Occasion <span class="text-muted">(optional)</span></label>
          <select id="conciergeOccasion" class="form-select">
            <option value="" ${!savedOccasion ? 'selected' : ''}>None</option>
            <option value="birthday" ${savedOccasion === 'birthday' ? 'selected' : ''}>Birthday</option>
            <option value="anniversary" ${savedOccasion === 'anniversary' ? 'selected' : ''}>Anniversary</option>
            <option value="business" ${savedOccasion === 'business' ? 'selected' : ''}>Business</option>
            <option value="wedding" ${savedOccasion === 'wedding' ? 'selected' : ''}>Wedding</option>
            <option value="other" ${savedOccasion === 'other' ? 'selected' : ''}>Other</option>
          </select>
        </div>

        <!-- Special Requests -->
        <div class="form-group">
          <label class="form-label">Special Requests <span class="text-muted">(optional)</span></label>
          <textarea id="conciergeSpecialRequests" class="form-input" rows="3" placeholder="Any additional preferences or requirements...">${savedSpecialRequests}</textarea>
        </div>

        <!-- Card Info -->
        <div class="booking-card-info">
          <div class="booking-card-info__icon">${Icons.creditCard(24)}</div>
          <div>
            <div class="text-semibold">${user.name}</div>
            <div class="text-sm text-muted">${Format.tierLabel(user.cardTier)} Card ending ${user.cardNumber}</div>
          </div>
        </div>

        <div class="booking-reassurance">
          ${Icons.shield(14)}
          <span>This is a complimentary service. No charge will be made.</span>
        </div>

        <div class="flex gap-md">
          <button class="btn btn--ghost btn--lg" id="conciergeBackToStep1" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="conciergeToStep3" style="flex:2">Continue to Review</button>
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

    // Format budget
    const budgetLabels = {
      '': 'No preference',
      'under-500': 'Under AED 500',
      '500-1000': 'AED 500 – 1,000',
      '1000-5000': 'AED 1,000 – 5,000',
      '5000+': 'AED 5,000+',
    };
    const budgetDisplay = budgetLabels[fd.budgetRange] || 'No preference';

    // Format contact time
    const contactTimeLabels = {
      'anytime': 'Anytime',
      'morning': 'Morning (9 AM – 12 PM)',
      'afternoon': 'Afternoon (12 PM – 5 PM)',
      'evening': 'Evening (5 PM – 9 PM)',
    };
    const contactTimeDisplay = contactTimeLabels[fd.contactTime] || 'Anytime';

    // Format occasion
    const occasionLabels = {
      '': '—',
      'birthday': 'Birthday',
      'anniversary': 'Anniversary',
      'business': 'Business',
      'wedding': 'Wedding',
      'other': 'Other',
    };
    const occasionDisplay = occasionLabels[fd.occasion] || '—';

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
            <span class="text-muted">Request</span>
            <span>${fd.requestDescription}</span>
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
            <span class="text-muted">Budget</span>
            <span>${budgetDisplay}</span>
          </div>
          ${fd.guests && fd.guests > 0 ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Guests</span>
              <span>${fd.guests}</span>
            </div>
          ` : ''}
          <div class="booking-confirm-row">
            <span class="text-muted">Contact</span>
            <span>${fd.contactMethod || 'Not specified'}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Contact Time</span>
            <span>${contactTimeDisplay}</span>
          </div>
          ${fd.occasion ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Occasion</span>
              <span>${occasionDisplay}</span>
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
            </span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Response</span>
            <span>Within ${service.turnaround}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Card</span>
            <span>${Format.tierLabel(user.cardTier)} ${user.cardNumber}</span>
          </div>
        </div>

        <div class="booking-reassurance">
          ${Icons.shield(14)}
          <span>This is a complimentary service. No charge will be made.</span>
        </div>

        <div class="flex gap-md">
          <button class="btn btn--ghost btn--lg" id="conciergeBackToStep2" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="conciergeConfirmBtn" style="flex:2">Submit Request</button>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // Mount — Wire up all event handlers
  // ══════════════════════════════════════════════
  mount() {
    Nav.mount();

    // 1. Description input
    delegate('#app', 'input', '#conciergeDescription', () => {
      this._validateStep1();
    });

    // 2. Date tab click
    delegate('#app', 'click', '.golf-date-tab', (e, el) => {
      this._selectedDate = el.dataset.date;
      this._selectedTime = null;
      $$('.golf-date-tab').forEach(t => t.classList.toggle('golf-date-tab--active', t.dataset.date === this._selectedDate));
      $$('.golf-slot').forEach(s => s.classList.remove('golf-slot--selected'));
      this._validateStep1();
    });

    // 3. Time slot click
    delegate('#app', 'click', '.golf-slot', (e, el) => {
      this._selectedTime = el.dataset.slot;
      $$('.golf-slot').forEach(s => s.classList.toggle('golf-slot--selected', s.dataset.slot === this._selectedTime));
      this._validateStep1();
    });

    // 4. Budget change
    delegate('#app', 'change', '#conciergeBudget', () => {
      this._validateStep1();
    });

    // 5. Guests change
    delegate('#app', 'change', '#conciergeGuests', () => {
      this._validateStep1();
    });

    // 6. Step 1 → Step 2
    delegate('#app', 'click', '#conciergeToStep2', () => {
      if (!this._isStep1Valid()) return;

      this._formData.requestDescription = ($('#conciergeDescription')?.value || '').trim();
      this._formData.bookingDate = this._selectedDate;
      this._formData.bookingTime = this._selectedTime;
      this._formData.budgetRange = $('#conciergeBudget')?.value || '';
      this._formData.guests = $('#conciergeGuests')?.value || '';

      this._step = 2;
      const form = $('#conciergeBookingForm');
      if (form) form.innerHTML = this._renderStep2();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 7. Contact chip toggle (single select)
    delegate('#app', 'click', '#conciergeContactChips .request-chip', (e, el) => {
      $$('#conciergeContactChips .request-chip').forEach(c => c.classList.remove('request-chip--selected'));
      el.classList.add('request-chip--selected');
    });

    // 8. Step 2 → Step 3
    delegate('#app', 'click', '#conciergeToStep3', () => {
      const selectedContact = document.querySelector('#conciergeContactChips .request-chip--selected');
      this._formData.contactMethod = selectedContact ? selectedContact.dataset.value : '';
      this._formData.contactTime = $('#conciergeContactTime')?.value || 'anytime';
      this._formData.occasion = $('#conciergeOccasion')?.value || '';
      this._formData.specialRequests = ($('#conciergeSpecialRequests')?.value || '').trim();

      this._step = 3;
      const form = $('#conciergeBookingForm');
      if (form) form.innerHTML = this._renderStep3();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 9a. Back to Step 1
    delegate('#app', 'click', '#conciergeBackToStep1', () => {
      this._step = 1;
      const form = $('#conciergeBookingForm');
      if (form) form.innerHTML = this._renderStep1();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 9b. Back to Step 2
    delegate('#app', 'click', '#conciergeBackToStep2', () => {
      this._step = 2;
      const form = $('#conciergeBookingForm');
      if (form) form.innerHTML = this._renderStep2();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 10. Confirm booking
    delegate('#app', 'click', '#conciergeConfirmBtn', () => {
      this._confirmBooking();
    });

    // 11. Sticky CTA delegates to inline button
    delegate('#app', 'click', '#conciergeStickyContinueBtn', () => {
      if (this._step === 1) {
        const btn = $('#conciergeToStep2');
        if (btn && !btn.disabled) btn.click();
      } else if (this._step === 2) {
        const btn = $('#conciergeToStep3');
        if (btn) btn.click();
      } else if (this._step === 3) {
        const btn = $('#conciergeConfirmBtn');
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
    const btn = $('#conciergeToStep2');
    if (btn) {
      btn.disabled = !this._isStep1Valid();
    }
  },

  _isStep1Valid() {
    const descVal = ($('#conciergeDescription')?.value || '').trim();
    if (!descVal) return false;
    if (!this._selectedDate) return false;
    if (!this._selectedTime) return false;
    return true;
  },

  // ══════════════════════════════════════════════
  // Sticky CTA
  // ══════════════════════════════════════════════
  _updateStickyCta() {
    const stickyBtn = $('#conciergeStickyContinueBtn');
    if (!stickyBtn) return;
    if (this._step === 1) stickyBtn.textContent = 'Continue';
    else if (this._step === 2) stickyBtn.textContent = 'Continue to Review';
    else if (this._step === 3) stickyBtn.textContent = 'Submit Request';
  },

  _setupStickyObserver() {
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    requestAnimationFrame(() => {
      const inlineCta = document.querySelector('#conciergeBookingForm .btn--primary');
      const stickyCta = $('#concierge-booking-sticky-cta');
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

    const booking = Store.createConciergeBooking({
      serviceId: this._serviceId,
      serviceName: this._service.name,
      requestDescription: fd.requestDescription,
      bookingDate: fd.bookingDate,
      bookingTime: fd.bookingTime,
      budgetRange: fd.budgetRange || '',
      guests: fd.guests || 1,
      contactMethod: fd.contactMethod || '',
      contactTime: fd.contactTime || '',
      occasion: fd.occasion || '',
      specialRequests: fd.specialRequests || '',
    });

    // Hide sticky CTA
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    const stickyCta = $('#concierge-booking-sticky-cta');
    if (stickyCta) stickyCta.classList.remove('booking-sticky-cta--visible');

    // Show success
    const form = $('#conciergeBookingForm');
    if (form) {
      form.innerHTML = `
        <div class="booking-success">
          <div class="booking-success__icon">${Icons.checkCircle(48)}</div>
          <h2 class="booking-success__title page-title">Request Submitted!</h2>
          <p class="booking-success__text">Your concierge request has been received. Our team will get back to you within ${this._service.turnaround}.</p>

          <div class="booking-confirm-details" style="text-align:left;margin:24px 0">
            <div class="booking-confirm-row">
              <span class="text-muted">Service</span>
              <span>${this._service.name}</span>
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
              <span class="text-muted">Contact</span>
              <span>${fd.contactMethod || 'Not specified'}</span>
            </div>
          </div>

          <div class="confirmation-code">${booking.confirmationCode}</div>
          <p class="text-sm text-muted" style="margin-top:8px">Save this confirmation code for your records</p>

          <div class="flex gap-md" style="margin-top:24px">
            <button class="btn btn--ghost btn--lg" onclick="Router.navigate('/concierge')" style="flex:1">Back to Concierge</button>
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
              <p class="empty-state__text">This concierge service may not be available.</p>
              <button class="btn btn--primary" onclick="Router.navigate('/concierge')">Back to Concierge</button>
            </div>
          </div>
        </main>
      </div>
    `;
  },
};

window.ConciergeBookingPage = ConciergeBookingPage;
