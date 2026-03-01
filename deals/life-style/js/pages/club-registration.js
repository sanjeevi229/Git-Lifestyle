// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Club Registration Page (3-step)
// ══════════════════════════════════════════════

const ClubRegistrationPage = {
  _categoryId: null,
  _category: null,
  _step: 1,
  _formData: {},
  _stickyObserver: null,
  _selectedDate: null,
  _selectedTime: null,

  render(params, query) {
    const category = CLUBHOUSE_CATEGORIES.find(c => c.id === query.category);
    if (!category) return this._notFound();
    this._category = category;
    this._categoryId = category.id;
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
              <span class="breadcrumb__item" onclick="Router.navigate('/club')">Club House</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">Register</span>
            </div>

            <div class="booking-layout">
              <!-- Summary Panel -->
              <div class="booking-summary">
                <div class="booking-summary__image">
                  <img src="${category.image}" alt="${category.name}" />
                </div>
                <h3 class="booking-summary__title">${category.name}</h3>
                <div class="booking-summary__detail">${category.description}</div>
                <div class="booking-summary__detail">${Icons.users(14)} Up to ${category.maxGuests} guests</div>
                <div class="booking-summary__badge">
                  <span class="discount-badge discount-badge--green">Complimentary</span>
                </div>
              </div>

              <!-- Registration Form -->
              <div class="booking-form" id="clubRegistrationForm">
                ${this._renderStep1()}
              </div>
            </div>
          </div>
        </main>

        <!-- Sticky Mobile CTA -->
        <div class="booking-sticky-cta" id="club-registration-sticky-cta">
          <button class="btn btn--primary btn--lg booking-sticky-cta__btn" id="clubStickyContinueBtn">
            Continue
          </button>
        </div>
      </div>
    `;
  },

  // ── Progress Steps ──
  _renderProgress() {
    const steps = [
      { num: 1, label: 'Venue & Schedule' },
      { num: 2, label: 'Guest Details' },
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
        <img src="${this._category.image}" alt="" class="booking-reminder__img" />
        <div class="booking-reminder__info">
          <div class="booking-reminder__title">${this._category.name}</div>
          <div class="booking-reminder__meta">${this._category.description}</div>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // STEP 1 — Venue & Schedule
  // ══════════════════════════════════════════════
  _renderStep1() {
    const days = this._getNextDays(7);
    const selectedDateStr = this._selectedDate;
    const fd = this._formData;

    // Filter venues for this category
    const venues = CLUBHOUSE_VENUES.filter(v => v.categoryId === this._categoryId);

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
    const morningSlots = CLUBHOUSE_TIME_SLOTS.filter(s => parseInt(s.split(':')[0]) < 12);
    const afternoonSlots = CLUBHOUSE_TIME_SLOTS.filter(s => {
      const hour = parseInt(s.split(':')[0]);
      return hour >= 12 && hour < 18;
    });
    const eveningSlots = CLUBHOUSE_TIME_SLOTS.filter(s => parseInt(s.split(':')[0]) >= 18);

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

    // Restore saved values
    const savedVenue = fd.venueId || '';
    const savedGuests = fd.partySize || '';

    // Guest options (1 to maxGuests)
    const guestOptions = [];
    for (let i = 1; i <= this._category.maxGuests; i++) {
      guestOptions.push(`<option value="${i}" ${parseInt(savedGuests) === i ? 'selected' : ''}>${i} ${i === 1 ? 'Guest' : 'Guests'}</option>`);
    }

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Venue & Schedule</h2>

        <!-- Venue -->
        <div class="form-group">
          <label class="form-label">${Icons.mapPin(14)} Select Venue</label>
          <select id="clubVenueSelect" class="form-select">
            <option value="">Choose a venue</option>
            ${venues.map(v => `<option value="${v.id}" ${v.id === savedVenue ? 'selected' : ''}>${v.name} — ${v.area}</option>`).join('')}
          </select>
        </div>

        <!-- Number of Guests -->
        <div class="form-group">
          <label class="form-label">${Icons.users(14)} Number of Guests</label>
          <select id="clubGuestCount" class="form-select">
            <option value="">Select guests</option>
            ${guestOptions.join('')}
          </select>
        </div>

        <!-- Date Selection -->
        <div class="form-group">
          <label class="form-label">${Icons.calendar(14)} Visit Date</label>
          <div class="golf-date-tabs" id="clubDateTabs">
            ${dateTabs}
          </div>
        </div>

        <!-- Time Slots -->
        <div class="form-group">
          <label class="form-label">${Icons.clock(14)} Arrival Time</label>
          <div id="clubTimeSlots">
            ${renderSlots(morningSlots, 'Morning')}
            ${renderSlots(afternoonSlots, 'Afternoon')}
            ${renderSlots(eveningSlots, 'Evening')}
          </div>
        </div>

        <button class="btn btn--primary btn--lg btn--full" id="clubToStep2" ${!this._isStep1Valid() ? 'disabled' : ''}>
          Continue to Guest Details
        </button>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // STEP 2 — Guest Details & Preferences
  // ══════════════════════════════════════════════
  _renderStep2() {
    const user = Auth.getCurrentUser();
    const fd = this._formData;

    const savedGuestName = fd.guestName || '';
    const savedGuestPhone = fd.guestPhone || '';

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Guest Details & Preferences</h2>

        <div class="form-group">
          <label class="form-label">${Icons.users(14)} Guest Name</label>
          <input type="text" id="clubGuestName" class="form-input" placeholder="Full name of primary guest" value="${savedGuestName}" />
        </div>

        <div class="form-group">
          <label class="form-label">${Icons.phone ? Icons.phone(14) : Icons.info(14)} Guest Phone</label>
          <input type="text" id="clubGuestPhone" class="form-input" placeholder="e.g. +971 50 123 4567" value="${savedGuestPhone}" />
        </div>

        <div class="form-group">
          <label class="form-label">Preferences <span class="text-muted">(optional)</span></label>
          <div class="request-chips" id="clubPreferenceChips">
            ${CLUBHOUSE_PREFERENCE_CHIPS.map(chip => `
              <button type="button" class="request-chip" data-value="${chip}">${chip}</button>
            `).join('')}
          </div>
          <textarea id="clubSpecialRequests" class="form-input" rows="2" placeholder="Any special requests or requirements..."></textarea>
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
          <button class="btn btn--ghost btn--lg" id="clubBackToStep1" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="clubToStep3" style="flex:2">Continue to Review</button>
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
    const category = this._category;

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Review & Confirm</h2>

        <div class="booking-confirm-details">
          <div class="booking-confirm-row">
            <span class="text-muted">Category</span>
            <span class="text-semibold">${category.name}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Venue</span>
            <span>${fd.venueName}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Guests</span>
            <span>${fd.partySize} ${parseInt(fd.partySize) === 1 ? 'Guest' : 'Guests'}</span>
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
            <span class="text-muted">Guest Name</span>
            <span>${fd.guestName}</span>
          </div>
          ${fd.guestPhone ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Phone</span>
              <span>${fd.guestPhone}</span>
            </div>
          ` : ''}
          ${fd.preferences ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Preferences</span>
              <span>${fd.preferences}</span>
            </div>
          ` : ''}
          ${fd.specialRequests ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Requests</span>
              <span>${fd.specialRequests}</span>
            </div>
          ` : ''}
          <div class="booking-confirm-row">
            <span class="text-muted">Price</span>
            <span>
              <span class="text-semibold" style="font-size:18px;color:var(--success)">Complimentary</span>
              <span class="text-muted" style="text-decoration:line-through;margin-left:8px">AED ${category.basePrice}</span>
            </span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted"></span>
            <span class="text-sm" style="color:var(--success)">You save AED ${category.basePrice}</span>
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
          <button class="btn btn--ghost btn--lg" id="clubBackToStep2" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="clubConfirmBtn" style="flex:2">Confirm Registration</button>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // Mount — Wire up all event handlers
  // ══════════════════════════════════════════════
  mount() {
    Nav.mount();

    // 1. Venue change
    delegate('#app', 'change', '#clubVenueSelect', () => {
      this._validateStep1();
    });

    // 2. Guest count change
    delegate('#app', 'change', '#clubGuestCount', () => {
      this._validateStep1();
    });

    // 3. Date tab click
    delegate('#app', 'click', '.golf-date-tab', (e, el) => {
      this._selectedDate = el.dataset.date;
      this._selectedTime = null;
      $$('.golf-date-tab').forEach(t => t.classList.toggle('golf-date-tab--active', t.dataset.date === this._selectedDate));
      $$('.golf-slot').forEach(s => s.classList.remove('golf-slot--selected'));
      this._validateStep1();
    });

    // 4. Time slot click
    delegate('#app', 'click', '.golf-slot', (e, el) => {
      this._selectedTime = el.dataset.slot;
      $$('.golf-slot').forEach(s => s.classList.toggle('golf-slot--selected', s.dataset.slot === this._selectedTime));
      this._validateStep1();
    });

    // 5. Step 1 → Step 2
    delegate('#app', 'click', '#clubToStep2', () => {
      if (!this._isStep1Valid()) return;

      const venueId = $('#clubVenueSelect')?.value || '';
      const venue = CLUBHOUSE_VENUES.find(v => v.id === venueId);

      this._formData.venueId = venueId;
      this._formData.venueName = venue ? venue.name : '';
      this._formData.venueArea = venue ? venue.area : '';
      this._formData.partySize = $('#clubGuestCount')?.value || '1';
      this._formData.bookingDate = this._selectedDate;
      this._formData.bookingTime = this._selectedTime;

      this._step = 2;
      const form = $('#clubRegistrationForm');
      if (form) form.innerHTML = this._renderStep2();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 6. Step 2 → Step 3
    delegate('#app', 'click', '#clubToStep3', () => {
      const chipValues = Array.from(document.querySelectorAll('#clubPreferenceChips .request-chip--selected'))
        .map(chip => chip.dataset.value);
      const textareaVal = ($('#clubSpecialRequests')?.value || '').trim();

      this._formData.guestName = ($('#clubGuestName')?.value || '').trim();
      this._formData.guestPhone = ($('#clubGuestPhone')?.value || '').trim();
      this._formData.preferences = chipValues.join(', ');
      this._formData.specialRequests = textareaVal;

      this._step = 3;
      const form = $('#clubRegistrationForm');
      if (form) form.innerHTML = this._renderStep3();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 7a. Back to Step 1
    delegate('#app', 'click', '#clubBackToStep1', () => {
      this._step = 1;
      const form = $('#clubRegistrationForm');
      if (form) form.innerHTML = this._renderStep1();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 7b. Back to Step 2
    delegate('#app', 'click', '#clubBackToStep2', () => {
      this._step = 2;
      const form = $('#clubRegistrationForm');
      if (form) form.innerHTML = this._renderStep2();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // 8. Confirm registration
    delegate('#app', 'click', '#clubConfirmBtn', () => {
      this._confirmRegistration();
    });

    // 9. Preference chip toggle
    delegate('#app', 'click', '.request-chip', (e) => {
      e.target.classList.toggle('request-chip--selected');
    });

    // 10. Sticky CTA delegates to inline button
    delegate('#app', 'click', '#clubStickyContinueBtn', () => {
      if (this._step === 1) {
        const btn = $('#clubToStep2');
        if (btn && !btn.disabled) btn.click();
      } else if (this._step === 2) {
        const btn = $('#clubToStep3');
        if (btn) btn.click();
      } else if (this._step === 3) {
        const btn = $('#clubConfirmBtn');
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
    const btn = $('#clubToStep2');
    if (btn) {
      btn.disabled = !this._isStep1Valid();
    }
  },

  _isStep1Valid() {
    const venueVal = $('#clubVenueSelect')?.value || '';
    const guestVal = $('#clubGuestCount')?.value || '';
    if (!venueVal) return false;
    if (!guestVal) return false;
    if (!this._selectedDate) return false;
    if (!this._selectedTime) return false;
    return true;
  },

  // ══════════════════════════════════════════════
  // Sticky CTA
  // ══════════════════════════════════════════════
  _updateStickyCta() {
    const stickyBtn = $('#clubStickyContinueBtn');
    if (!stickyBtn) return;
    if (this._step === 1) stickyBtn.textContent = 'Continue';
    else if (this._step === 2) stickyBtn.textContent = 'Continue to Review';
    else if (this._step === 3) stickyBtn.textContent = 'Confirm Registration';
  },

  _setupStickyObserver() {
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    requestAnimationFrame(() => {
      const inlineCta = document.querySelector('#clubRegistrationForm .btn--primary');
      const stickyCta = $('#club-registration-sticky-cta');
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
  // Confirm Registration
  // ══════════════════════════════════════════════
  _confirmRegistration() {
    const fd = this._formData;

    const booking = Store.createClubhouseBooking({
      categoryId: this._categoryId,
      categoryName: this._category.name,
      venueId: fd.venueId,
      venueName: fd.venueName,
      venueArea: fd.venueArea,
      bookingDate: fd.bookingDate,
      bookingTime: fd.bookingTime,
      partySize: parseInt(fd.partySize) || 1,
      guestName: fd.guestName || '',
      guestPhone: fd.guestPhone || '',
      preferences: fd.preferences || '',
      specialRequests: fd.specialRequests || '',
    });

    // Hide sticky CTA
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    const stickyCta = $('#club-registration-sticky-cta');
    if (stickyCta) stickyCta.classList.remove('booking-sticky-cta--visible');

    // Show success
    const form = $('#clubRegistrationForm');
    if (form) {
      form.innerHTML = `
        <div class="booking-success">
          <div class="booking-success__icon">${Icons.checkCircle(48)}</div>
          <h2 class="booking-success__title page-title">Registration Confirmed!</h2>
          <p class="booking-success__text">Your club visit has been registered. ${fd.venueName} on ${Format.date(fd.bookingDate)} at ${fd.bookingTime}.</p>

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
              <span class="text-muted">Venue</span>
              <span>${fd.venueName}</span>
            </div>
            <div class="booking-confirm-row">
              <span class="text-muted">Guests</span>
              <span>${fd.partySize} ${parseInt(fd.partySize) === 1 ? 'Guest' : 'Guests'}</span>
            </div>
          </div>

          <div class="confirmation-code">${booking.confirmationCode}</div>
          <p class="text-sm text-muted" style="margin-top:8px">Save this confirmation code · Show at venue</p>

          <div class="flex gap-md" style="margin-top:24px">
            <button class="btn btn--ghost btn--lg" onclick="Router.navigate('/club')" style="flex:1">Back to Club House</button>
            <button class="btn btn--primary btn--lg" onclick="Router.navigate('/my-bookings/${booking.id}')" style="flex:2">View Registration</button>
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
              <h2 class="empty-state__title">Category Not Found</h2>
              <p class="empty-state__text">This club category may not be available.</p>
              <button class="btn btn--primary" onclick="Router.navigate('/club')">Back to Club House</button>
            </div>
          </div>
        </main>
      </div>
    `;
  },
};

window.ClubRegistrationPage = ClubRegistrationPage;
