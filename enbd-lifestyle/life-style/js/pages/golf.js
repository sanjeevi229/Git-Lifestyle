// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Golf Landing Page
// ══════════════════════════════════════════════

const GolfPage = {
  render() {
    const user = Auth.getCurrentUser();
    const tierConfig = CONFIG.cardTiers[user.cardTier];
    const tierLevel = tierConfig?.level || 1;
    const quota = Store.getGolfQuota();
    const hasGolfAccess = !!quota.benefit;

    // Build eligibility banner
    let eligibilityBanner = '';
    if (hasGolfAccess) {
      const quotaText = quota.allowed >= 999
        ? 'Unlimited rounds'
        : `${quota.remaining} of ${quota.allowed} rounds remaining`;
      eligibilityBanner = `
        <div class="golf-eligibility golf-eligibility--active">
          <div class="golf-eligibility__icon">${Icons.checkCircle(28)}</div>
          <div class="golf-eligibility__content">
            <div class="golf-eligibility__title">Golf Access Included</div>
            <div class="golf-eligibility__text">${quota.benefit}</div>
            <div class="golf-eligibility__quota">${quotaText}</div>
          </div>
          <div class="golf-eligibility__card">
            ${Icons.creditCard(20)}
            <span>${Format.tierLabel(user.cardTier)} Card</span>
          </div>
        </div>
      `;
    } else {
      eligibilityBanner = `
        <div class="golf-eligibility golf-eligibility--locked">
          <div class="golf-eligibility__icon">${Icons.shield(28)}</div>
          <div class="golf-eligibility__content">
            <div class="golf-eligibility__title">Golf Access Unavailable</div>
            <div class="golf-eligibility__text">Golf access is available with Platinum, Infinite, and Private cards. Upgrade your card to unlock complimentary rounds at premier golf courses across the UAE.</div>
          </div>
          <div class="golf-eligibility__card">
            ${Icons.creditCard(20)}
            <span>${Format.tierLabel(user.cardTier)} Card</span>
          </div>
        </div>
      `;
    }

    // Build course cards
    const courseCards = GOLF_COURSES.map(course => {
      const courseMinLevel = CONFIG.cardTiers[course.minTier]?.level || 1;
      const isAccessible = tierLevel >= courseMinLevel;

      return `
        <div class="golf-card ${isAccessible ? '' : 'golf-card--locked'}" onclick="${isAccessible ? `Router.navigate('/golf/${course.id}')` : ''}">
          <div class="golf-card__image">
            <img src="${course.image}" alt="${course.name}" loading="lazy" />
            <span class="golf-card__rating">${Icons.star(12)} ${Number(course.rating).toFixed(1)}</span>
            ${!isAccessible ? `
              <div class="golf-card__lock-overlay">
                ${Icons.shield(24)}
                <span>Requires ${Format.tierLabel(course.minTier)} Card</span>
              </div>
            ` : ''}
            ${isAccessible && course.cartIncluded ? `<span class="golf-card__badge">Cart Included</span>` : ''}
          </div>
          <div class="golf-card__body">
            <div class="golf-card__name">${course.name}</div>
            <div class="golf-card__subtitle">${course.subtitle}</div>
            <div class="golf-card__meta">
              ${Icons.mapPin(13)} <span>${course.area}</span>
              <span class="golf-card__dot">·</span>
              ${Icons.golf(13)} <span>${course.holes} Holes</span>
              <span class="golf-card__dot">·</span>
              <span>Par ${course.par}</span>
            </div>
            <div class="golf-card__footer">
              <div class="golf-card__price">
                <span class="golf-card__price-label">${isAccessible ? 'Complimentary' : `AED ${course.greenFee}`}</span>
                ${isAccessible ? `<span class="golf-card__price-note">with your card</span>` : `<span class="golf-card__price-note">green fee</span>`}
              </div>
              <div class="golf-card__difficulty">
                <span class="golf-card__difficulty-badge golf-card__difficulty-badge--${course.difficulty.toLowerCase()}">${course.difficulty}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="page page--no-dark">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="golf-page__header">
              <div class="breadcrumb">
                <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
                <span class="breadcrumb__sep">›</span>
                <span class="breadcrumb__current">Golf Access</span>
              </div>
              <h1 class="page-title">${Icons.golf(28)} Golf Access</h1>
              <p class="golf-page__subtitle">Book complimentary tee times at the UAE's premier golf courses</p>
            </div>

            ${eligibilityBanner}

            <div class="golf-section-header">
              <h2 class="golf-section-header__title">Available Courses</h2>
              <p class="golf-section-header__count">${GOLF_COURSES.length} courses</p>
            </div>

            <div class="golf-grid">
              ${courseCards}
            </div>
          </div>
        </main>
      </div>
    `;
  },

  mount() {
    Nav.mount();
  },

  unmount() {},
};

window.GolfPage = GolfPage;
