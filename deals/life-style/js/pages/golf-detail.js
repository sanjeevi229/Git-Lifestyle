// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Golf Course Detail Page
// ══════════════════════════════════════════════

const GolfDetailPage = {
  _course: null,

  render(params) {
    const course = GOLF_COURSES.find(c => c.id === params.courseId);
    if (!course) return this._notFound();
    this._course = course;

    const user = Auth.getCurrentUser();
    const tierLevel = CONFIG.cardTiers[user.cardTier]?.level || 1;
    const courseMinLevel = CONFIG.cardTiers[course.minTier]?.level || 1;
    const isAccessible = tierLevel >= courseMinLevel;

    // Next 3 days of tee times
    const teeTimeDays = this._getNextDays(3);
    const teeTimePreview = teeTimeDays.map(day => {
      const dayLabel = this._formatDayLabel(day);
      const slots = course.availableSlots.slice(0, 8); // Show first 8 for preview
      return `
        <div class="golf-teetimes__day">
          <div class="golf-teetimes__day-label">${dayLabel}</div>
          <div class="golf-teetimes__slots">
            ${slots.map(s => `<span class="golf-teetimes__chip">${s}</span>`).join('')}
            ${course.availableSlots.length > 8 ? `<span class="golf-teetimes__more">+${course.availableSlots.length - 8} more</span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Amenities
    const amenityIcons = {
      'Driving Range': Icons.golf(16),
      'Pro Shop': Icons.shoppingBag(16),
      'Restaurant': Icons.utensils(16),
      'Fine Dining': Icons.utensils(16),
      'Locker Room': Icons.shield(16),
      'Caddy Service': Icons.users(16),
      'Golf Cart': Icons.golf(16),
      'Clubhouse': Icons.home(16),
      'Swimming Pool': Icons.droplet(16),
      'Spa': Icons.heart(16),
      'Fitness Centre': Icons.dumbbell(16),
      'Beach Access': Icons.sunrise(16),
      'Yacht Club': Icons.anchor(16),
      'Marina': Icons.anchor(16),
      'Practice Green': Icons.golf(16),
      'Golf Academy': Icons.star(16),
      'Private Beach': Icons.sunrise(16),
    };

    const amenities = course.amenities.map(a => `
      <div class="golf-amenity">
        ${amenityIcons[a] || Icons.checkCircle(16)}
        <span>${a}</span>
      </div>
    `).join('');

    return `
      <div class="page page--no-dark">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="breadcrumb" style="padding-top:var(--space-xl)">
              <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="Router.navigate('/golf')">Golf Access</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">${course.name}</span>
            </div>
          </div>

          <!-- Hero -->
          <div class="golf-detail__hero">
            <img src="${course.image}" alt="${course.name}" />
          </div>

          <div class="container">
            <!-- Header -->
            <div class="golf-detail__header">
              <div>
                <h1 class="golf-detail__name">${course.name}</h1>
                <div class="golf-detail__subtitle">${course.subtitle}</div>
              </div>
              <div class="golf-detail__rating-lg">
                ${Icons.star(16)} ${Number(course.rating).toFixed(1)}
                <span class="golf-detail__reviews">(${course.reviewCount})</span>
              </div>
            </div>

            <!-- Info Grid -->
            <div class="golf-detail__info-grid">
              <div class="golf-detail__info-item">
                ${Icons.golf(18)}
                <div>
                  <span class="golf-detail__info-label">Holes / Par</span>
                  <span class="golf-detail__info-value">${course.holes} Holes · Par ${course.par}</span>
                </div>
              </div>
              <div class="golf-detail__info-item">
                ${Icons.mapPin(18)}
                <div>
                  <span class="golf-detail__info-label">Location</span>
                  <span class="golf-detail__info-value">${course.area}</span>
                </div>
              </div>
              <div class="golf-detail__info-item">
                ${Icons.tag(18)}
                <div>
                  <span class="golf-detail__info-label">Course Type</span>
                  <span class="golf-detail__info-value">${course.courseType} · ${course.difficulty}</span>
                </div>
              </div>
              <div class="golf-detail__info-item">
                ${Icons.creditCard(18)}
                <div>
                  <span class="golf-detail__info-label">Green Fee</span>
                  <span class="golf-detail__info-value">${isAccessible ? 'Complimentary' : `AED ${course.greenFee}`}</span>
                </div>
              </div>
            </div>

            <!-- About -->
            <div class="golf-detail__section">
              <h3 class="golf-detail__section-title">About the Course</h3>
              <p class="golf-detail__description">${course.description}</p>
            </div>

            <!-- Course Stats -->
            <div class="golf-detail__stats">
              <div class="golf-detail__stat">
                <span class="golf-detail__stat-value">${course.length}</span>
                <span class="golf-detail__stat-label">Length</span>
              </div>
              <div class="golf-detail__stat">
                <span class="golf-detail__stat-value">Par ${course.par}</span>
                <span class="golf-detail__stat-label">Course Par</span>
              </div>
              <div class="golf-detail__stat">
                <span class="golf-detail__stat-value">${course.difficulty}</span>
                <span class="golf-detail__stat-label">Difficulty</span>
              </div>
              <div class="golf-detail__stat">
                <span class="golf-detail__stat-value">${course.cartIncluded ? 'Included' : 'Optional'}</span>
                <span class="golf-detail__stat-label">Golf Cart</span>
              </div>
            </div>

            <!-- Amenities -->
            <div class="golf-detail__section">
              <h3 class="golf-detail__section-title">Amenities</h3>
              <div class="golf-amenities-grid">
                ${amenities}
              </div>
            </div>

            <!-- Tee Times Preview -->
            <div class="golf-detail__section">
              <h3 class="golf-detail__section-title">Available Tee Times</h3>
              <div class="golf-teetimes">
                ${teeTimePreview}
              </div>
              ${isAccessible ? `
                <button class="btn btn--primary btn--lg btn--full" style="margin-top:20px" onclick="Router.navigate('/golf/book/${course.id}')">
                  Book Now
                </button>
              ` : `
                <div class="golf-detail__locked-msg">
                  ${Icons.shield(18)}
                  <span>Requires ${Format.tierLabel(course.minTier)} Card or above to book</span>
                </div>
              `}
            </div>

            <!-- Contact -->
            <div class="golf-detail__section">
              <h3 class="golf-detail__section-title">Contact Details</h3>
              <div class="golf-contact">
                <div class="golf-contact__item">
                  ${Icons.phone(18)}
                  <div>
                    <span class="golf-contact__label">Phone</span>
                    <span class="golf-contact__value">${course.phone}</span>
                  </div>
                </div>
                <div class="golf-contact__item">
                  ${Icons.globe(18)}
                  <div>
                    <span class="golf-contact__label">Website</span>
                    <span class="golf-contact__value">${course.website}</span>
                  </div>
                </div>
                ${course.email ? `
                  <div class="golf-contact__item">
                    ${Icons.tag(18)}
                    <div>
                      <span class="golf-contact__label">Email</span>
                      <span class="golf-contact__value">${course.email}</span>
                    </div>
                  </div>
                ` : ''}
                <div class="golf-contact__item">
                  ${Icons.clock(18)}
                  <div>
                    <span class="golf-contact__label">Opening Hours</span>
                    <span class="golf-contact__value">${course.openingHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- Sticky Mobile CTA -->
        ${isAccessible ? `
          <div class="golf-sticky-cta" id="golf-sticky-cta">
            <button class="btn btn--primary btn--lg golf-sticky-cta__btn" onclick="Router.navigate('/golf/book/${course.id}')">
              Book Now
            </button>
          </div>
        ` : ''}
      </div>
    `;
  },

  mount() {
    Nav.mount();

    // Sticky CTA observer
    this._stickyObserver = null;
    requestAnimationFrame(() => {
      const inlineCta = document.querySelector('.golf-detail__section .btn--primary');
      const stickyCta = $('#golf-sticky-cta');
      if (inlineCta && stickyCta) {
        this._stickyObserver = new IntersectionObserver(
          ([entry]) => {
            stickyCta.classList.toggle('golf-sticky-cta--visible', !entry.isIntersecting);
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

  _formatDayLabel(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'short' });
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

window.GolfDetailPage = GolfDetailPage;
