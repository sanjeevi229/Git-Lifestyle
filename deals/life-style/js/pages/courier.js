// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Local Courier Landing Page
// ══════════════════════════════════════════════

const CourierPage = {
  render() {
    const user = Auth.getCurrentUser();
    const tierConfig = CONFIG.cardTiers[user.cardTier];
    const tierLevel = tierConfig?.level || 1;
    const quota = Store.getCourierQuota();
    const hasAccess = !!quota.benefit;

    // Build eligibility banner
    let eligibilityBanner = '';
    if (hasAccess) {
      const quotaText = quota.allowed >= 999
        ? 'Unlimited deliveries'
        : `${quota.remaining} of ${quota.allowed} remaining`;
      eligibilityBanner = `
        <div class="courier-eligibility courier-eligibility--active">
          <div class="courier-eligibility__icon">${Icons.checkCircle(28)}</div>
          <div class="courier-eligibility__content">
            <div class="courier-eligibility__title">Local Courier Included</div>
            <div class="courier-eligibility__text">${quota.benefit}</div>
            <div class="courier-eligibility__quota">${quotaText}</div>
          </div>
          <div class="courier-eligibility__card">
            ${Icons.creditCard(20)}
            <span>${Format.tierLabel(user.cardTier)} Card</span>
          </div>
        </div>
      `;
    } else {
      eligibilityBanner = `
        <div class="courier-eligibility courier-eligibility--locked">
          <div class="courier-eligibility__icon">${Icons.shield(28)}</div>
          <div class="courier-eligibility__content">
            <div class="courier-eligibility__title">Local Courier Unavailable</div>
            <div class="courier-eligibility__text">Available with Platinum Card and above. Upgrade your card to unlock complimentary courier services across the UAE.</div>
          </div>
          <div class="courier-eligibility__card">
            ${Icons.creditCard(20)}
            <span>${Format.tierLabel(user.cardTier)} Card</span>
          </div>
        </div>
      `;
    }

    // Build service cards
    const serviceCards = COURIER_SERVICE_TYPES.map(service => {
      const serviceMinLevel = CONFIG.cardTiers[service.minTier]?.level || 1;
      const isAccessible = tierLevel >= serviceMinLevel;

      const featureChips = service.features.map(f =>
        `<span class="courier-card__feature">${f}</span>`
      ).join('');

      return `
        <div class="courier-card ${isAccessible ? '' : 'courier-card--locked'}" onclick="${isAccessible ? `Router.navigate('/courier/book?service=${service.id}')` : ''}">
          <div class="courier-card__image">
            <img src="${service.image}" alt="${service.name}" loading="lazy" />
            ${!isAccessible ? `
              <div class="courier-card__lock">
                ${Icons.shield(24)}
                <span>Requires ${Format.tierLabel(service.minTier)} Card</span>
              </div>
            ` : ''}
          </div>
          <div class="courier-card__body">
            <div class="courier-card__name">${service.name}</div>
            <div class="courier-card__desc">${service.description}</div>
            <div class="courier-card__meta">
              ${Icons.package(13)} <span>Up to ${service.maxWeight} kg</span>
            </div>
            <div class="courier-card__features">
              ${featureChips}
            </div>
          </div>
          <div class="courier-card__footer">
            <div class="courier-card__price">
              ${isAccessible
                ? `<span class="courier-card__price-label">Complimentary</span>
                   <span class="courier-card__price-original">AED ${service.basePrice}</span>`
                : `<span class="courier-card__price-label" style="color:var(--charcoal)">AED ${service.basePrice}</span>`
              }
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
            <div class="courier-page__header">
              <div class="breadcrumb">
                <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
                <span class="breadcrumb__sep">&rsaquo;</span>
                <span class="breadcrumb__current">Local Courier</span>
              </div>
              <h1 class="page-title">${Icons.package(28)} Local Courier</h1>
              <p class="courier-page__subtitle" style="color:var(--grey);font-size:15px;margin-top:4px">Complimentary courier service across the UAE</p>
            </div>

            ${eligibilityBanner}

            <div class="courier-section-header">
              <h2 class="courier-section-header__title">Available Services</h2>
              <p class="courier-section-header__count">${COURIER_SERVICE_TYPES.length} services</p>
            </div>

            <div class="courier-grid">
              ${serviceCards}
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

window.CourierPage = CourierPage;
