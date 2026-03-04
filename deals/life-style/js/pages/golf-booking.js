// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Golf Booking Page (4-step)
// ══════════════════════════════════════════════

const GolfBookingPage = {
  _courseId: null,
  _course: null,
  _step: 1,
  _formData: {},
  _stickyObserver: null,
  _selectedDate: null,
  _selectedSlot: null,

  render(params) {
    const course = GOLF_COURSES.find(c => c.id === params.courseId);
    if (!course) return this._notFound();
    this._course = course;
    this._courseId = params.courseId;
    this._step = 1;
    this._formData = {};
    this._selectedDate = new Date().toISOString().split('T')[0];
    this._selectedSlot = null;

    return `
      <div class="page page--no-dark">
        ${Nav.render()}
        <main class="page__main page__main--full page__main--booking">
          <div class="container">
            <div class="breadcrumb">
              <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="Router.navigate('/golf')">Golf Access</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="Router.navigate('/golf/${course.id}')">${course.name}</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">Book Now</span>
            </div>

            <div class="booking-layout">
              <!-- Summary Panel -->
              <div class="booking-summary">
                <div class="booking-summary__image">
                  <img src="${course.image}" alt="${course.name}" />
                </div>
                <h3 class="booking-summary__title">${course.name}</h3>
                <div class="booking-summary__detail">${course.subtitle}</div>
                <div class="booking-summary__detail">${Icons.mapPin(14)} ${course.location}</div>
                <div class="booking-summary__detail">${Icons.golf(14)} ${course.holes} Holes · Par ${course.par}</div>
                <div class="booking-summary__badge">
                  <span class="discount-badge discount-badge--green">Complimentary</span>
                </div>
              </div>

              <!-- Booking Form -->
              <div class="booking-form" id="golfBookingForm">
                ${this._renderStep1()}
              </div>
            </div>
          </div>
        </main>

        <!-- Sticky Mobile CTA -->
        <div class="booking-sticky-cta" id="golf-booking-sticky-cta">
          <button class="btn btn--primary btn--lg booking-sticky-cta__btn" id="golfStickyContinueBtn">
            Continue
          </button>
        </div>
      </div>
    `;
  },

  // ── Progress Steps ──
  _renderProgress() {
    const steps = [
      { num: 1, label: 'Tee Time' },
      { num: 2, label: 'Details' },
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
        <img src="${this._course.image}" alt="" class="booking-reminder__img" />
        <div class="booking-reminder__info">
          <div class="booking-reminder__title">${this._course.name}</div>
          <div class="booking-reminder__meta">${this._course.subtitle} · ${this._course.area}</div>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // STEP 1 — Date & Tee Time Selection
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

    // Split slots into morning / afternoon
    const morningSlots = this._course.availableSlots.filter(s => {
      const hour = parseInt(s.split(':')[0]);
      return hour < 12;
    });
    const afternoonSlots = this._course.availableSlots.filter(s => {
      const hour = parseInt(s.split(':')[0]);
      return hour >= 12;
    });

    const renderSlots = (slots, label) => {
      if (slots.length === 0) return '';
      return `
        <div class="golf-slot-group">
          <div class="golf-slot-group__label">${label}</div>
          <div class="golf-slot-grid">
            ${slots.map(s => `
              <button class="golf-slot ${this._selectedSlot === s ? 'golf-slot--selected' : ''}" data-slot="${s}">
                ${s}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    };

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Select Date</h2>

        <div class="form-group">
          <label class="form-label">Select Date</label>
          <div class="golf-date-tabs" id="golfDateTabs">
            ${dateTabs}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Available Tee Times</label>
          <div id="golfSlots">
            ${renderSlots(morningSlots, 'Morning')}
            ${renderSlots(afternoonSlots, 'Afternoon')}
          </div>
        </div>

        <button class="btn btn--primary btn--lg btn--full" id="golfToStep2" ${!this._selectedSlot ? 'disabled' : ''}>
          Continue to Details
        </button>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // STEP 2 — Guest Details
  // ══════════════════════════════════════════════
  _renderStep2() {
    const user = Auth.getCurrentUser();

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Guest Details</h2>

        <div class="form-group">
          <label class="form-label">Number of Players</label>
          <select id="golfPlayers" class="form-select">
            ${[1,2,3,4].map(n => `<option value="${n}" ${n === 1 ? 'selected' : ''}>${n} ${n === 1 ? 'Player' : 'Players'}</option>`).join('')}
          </select>
        </div>

        ${!this._course.cartIncluded ? `
          <div class="form-group">
            <label class="form-label">Golf Cart</label>
            <div class="golf-toggle-row">
              <span>Add golf cart (AED 150)</span>
              <label class="golf-toggle">
                <input type="checkbox" id="golfCart" />
                <span class="golf-toggle__slider"></span>
              </label>
            </div>
          </div>
        ` : `
          <div class="golf-cart-included">
            ${Icons.checkCircle(16)}
            <span>Golf cart included with your booking</span>
          </div>
        `}

        <div class="form-group">
          <label class="form-label">Special Requests <span class="text-muted">(optional)</span></label>
          <div class="request-chips" id="golfRequestChips">
            <button type="button" class="request-chip" data-value="Caddy required">Caddy required</button>
            <button type="button" class="request-chip" data-value="Right-hand clubs">Right-hand clubs</button>
            <button type="button" class="request-chip" data-value="Left-hand clubs">Left-hand clubs</button>
            <button type="button" class="request-chip" data-value="Buggy for 2">Buggy for 2</button>
          </div>
          <textarea id="golfSpecialRequests" class="form-input" rows="2" placeholder="Any additional requests..."></textarea>
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
          <button class="btn btn--ghost btn--lg" id="golfBackToStep1" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="golfToStep3" style="flex:2">Continue to Review</button>
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

    return `
      <div class="booking-step">
        ${this._renderReminder()}
        ${this._renderProgress()}

        <h2 class="booking-form__title page-title">Review & Confirm</h2>

        <div class="booking-confirm-details">
          <div class="booking-confirm-row">
            <span class="text-muted">Course</span>
            <span class="text-semibold">${this._course.name}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Date</span>
            <span>${Format.date(fd.bookingDate)}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Tee Time</span>
            <span class="text-semibold">${fd.teeTime}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Players</span>
            <span>${fd.players} ${parseInt(fd.players) === 1 ? 'Player' : 'Players'}</span>
          </div>
          <div class="booking-confirm-row">
            <span class="text-muted">Golf Cart</span>
            <span>${fd.cartIncluded ? 'Included' : 'Not included'}</span>
          </div>
          ${fd.specialRequests ? `
            <div class="booking-confirm-row">
              <span class="text-muted">Special Requests</span>
              <span>${fd.specialRequests}</span>
            </div>
          ` : ''}
          <div class="booking-confirm-row">
            <span class="text-muted">Price</span>
            <span class="text-semibold" style="font-size:18px;color:var(--success)">Complimentary</span>
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
          <button class="btn btn--ghost btn--lg" id="golfBackToStep2" style="flex:1">Back</button>
          <button class="btn btn--primary btn--lg" id="golfConfirmBtn" style="flex:2">Confirm Tee Time</button>
        </div>
      </div>
    `;
  },

  // ══════════════════════════════════════════════
  // Mount — Wire up all event handlers
  // ══════════════════════════════════════════════
  mount() {
    Nav.mount();

    // Date tab selection
    delegate('#app', 'click', '.golf-date-tab', (e, el) => {
      this._selectedDate = el.dataset.date;
      this._selectedSlot = null;
      $$('.golf-date-tab').forEach(t => t.classList.toggle('golf-date-tab--active', t.dataset.date === this._selectedDate));
      // Refresh slots (all are same for demo)
      $$('.golf-slot').forEach(s => s.classList.remove('golf-slot--selected'));
      const btn = $('#golfToStep2');
      if (btn) btn.disabled = true;
    });

    // Tee time slot selection
    delegate('#app', 'click', '.golf-slot', (e, el) => {
      this._selectedSlot = el.dataset.slot;
      $$('.golf-slot').forEach(s => s.classList.toggle('golf-slot--selected', s.dataset.slot === this._selectedSlot));
      const btn = $('#golfToStep2');
      if (btn) btn.disabled = false;
    });

    // Step 1 → Step 2
    delegate('#app', 'click', '#golfToStep2', () => {
      if (!this._selectedSlot) return;
      this._formData.bookingDate = this._selectedDate;
      this._formData.teeTime = this._selectedSlot;
      this._step = 2;
      const form = $('#golfBookingForm');
      if (form) form.innerHTML = this._renderStep2();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // Step 2 → Step 3
    delegate('#app', 'click', '#golfToStep3', () => {
      const chipValues = Array.from(document.querySelectorAll('#golfRequestChips .request-chip--selected'))
        .map(chip => chip.dataset.value);
      const textareaVal = ($('#golfSpecialRequests')?.value || '').trim();
      const allRequests = [...chipValues, textareaVal].filter(Boolean).join(', ');

      this._formData.players = $('#golfPlayers')?.value || '1';
      this._formData.cartIncluded = this._course.cartIncluded || !!$('#golfCart')?.checked;
      this._formData.specialRequests = allRequests;
      this._step = 3;
      const form = $('#golfBookingForm');
      if (form) form.innerHTML = this._renderStep3();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // Step 2 ← Back to Step 1
    delegate('#app', 'click', '#golfBackToStep1', () => {
      this._step = 1;
      const form = $('#golfBookingForm');
      if (form) form.innerHTML = this._renderStep1();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // Step 3 ← Back to Step 2
    delegate('#app', 'click', '#golfBackToStep2', () => {
      this._step = 2;
      const form = $('#golfBookingForm');
      if (form) form.innerHTML = this._renderStep2();
      this._updateStickyCta();
      this._setupStickyObserver();
    });

    // Confirm booking
    delegate('#app', 'click', '#golfConfirmBtn', () => {
      this._confirmBooking();
    });

    // Request chip toggle
    delegate('#app', 'click', '.request-chip', (e) => {
      e.target.classList.toggle('request-chip--selected');
    });

    // Sticky CTA delegates to inline button
    delegate('#app', 'click', '#golfStickyContinueBtn', () => {
      if (this._step === 1) {
        const btn = $('#golfToStep2');
        if (btn && !btn.disabled) btn.click();
      } else if (this._step === 2) {
        const btn = $('#golfToStep3');
        if (btn) btn.click();
      } else if (this._step === 3) {
        const btn = $('#golfConfirmBtn');
        if (btn) btn.click();
      }
    });

    // Initial sticky observer setup
    this._setupStickyObserver();
  },

  _updateStickyCta() {
    const stickyBtn = $('#golfStickyContinueBtn');
    if (!stickyBtn) return;
    if (this._step === 1) stickyBtn.textContent = 'Continue';
    else if (this._step === 2) stickyBtn.textContent = 'Continue to Review';
    else if (this._step === 3) stickyBtn.textContent = 'Confirm Tee Time';
  },

  _setupStickyObserver() {
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    requestAnimationFrame(() => {
      const inlineCta = document.querySelector('#golfBookingForm .btn--primary');
      const stickyCta = $('#golf-booking-sticky-cta');
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

  _confirmBooking() {
    const booking = Store.createGolfBooking({
      courseId: this._courseId,
      bookingDate: this._formData.bookingDate,
      teeTime: this._formData.teeTime,
      players: parseInt(this._formData.players) || 1,
      cartIncluded: this._formData.cartIncluded,
      specialRequests: this._formData.specialRequests || '',
    });

    // Hide sticky CTA
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    const stickyCta = $('#golf-booking-sticky-cta');
    if (stickyCta) stickyCta.classList.remove('booking-sticky-cta--visible');

    // Show success
    const form = $('#golfBookingForm');
    if (form) {
      form.innerHTML = `
        <div class="booking-success">
          <div class="booking-success__icon">${Icons.checkCircle(48)}</div>
          <h2 class="booking-success__title page-title">Tee Time Confirmed!</h2>
          <p class="booking-success__text">Your tee time at ${this._course.name} has been booked.</p>

          <div class="booking-confirm-details" style="text-align:left;margin:24px 0">
            <div class="booking-confirm-row">
              <span class="text-muted">Date</span>
              <span>${Format.date(this._formData.bookingDate)}</span>
            </div>
            <div class="booking-confirm-row">
              <span class="text-muted">Tee Time</span>
              <span class="text-semibold">${this._formData.teeTime}</span>
            </div>
            <div class="booking-confirm-row">
              <span class="text-muted">Players</span>
              <span>${this._formData.players}</span>
            </div>
          </div>

          <div class="confirmation-code">${booking.confirmationCode}</div>
          <p class="text-sm text-muted" style="margin-top:8px">Save this confirmation code · Show at course</p>

          <div class="flex gap-md" style="margin-top:24px">
            <button class="btn btn--ghost btn--lg" onclick="Router.navigate('/golf')" style="flex:1">Back to Golf</button>
            <button class="btn btn--primary btn--lg" onclick="Router.navigate('/my-bookings/${booking.id}')" style="flex:2">View Booking</button>
          </div>
        </div>
      `;
    }
  },

  unmount() {
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
  },

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
              <h2 class="empty-state__title">Course Not Found</h2>
              <p class="empty-state__text">This golf course may not be available.</p>
              <button class="btn btn--primary" onclick="Router.navigate('/golf')">Back to Golf</button>
            </div>
          </div>
        </main>
      </div>
    `;
  },
};

window.GolfBookingPage = GolfBookingPage;
