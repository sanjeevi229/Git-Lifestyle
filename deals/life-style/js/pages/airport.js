// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Airport Transfer Landing Page
// ══════════════════════════════════════════════

const AirportPage = {
  render() {
    const user = Auth.getCurrentUser();
    const tierConfig = CONFIG.cardTiers[user.cardTier];
    const tierLevel = tierConfig?.level || 1;
    const quota = Store.getAirportQuota();
    const hasAccess = !!quota.benefit;

    // Build eligibility banner
    let eligibilityBanner = '';
    if (hasAccess) {
      const quotaText = quota.allowed >= 999
        ? 'Unlimited transfers'
        : `${quota.remaining} of ${quota.allowed} remaining`;
      eligibilityBanner = `
        <div class="airport-eligibility airport-eligibility--active">
          <div class="airport-eligibility__icon">${Icons.checkCircle(28)}</div>
          <div class="airport-eligibility__content">
            <div class="airport-eligibility__title">Airport Transfer Included</div>
            <div class="airport-eligibility__text">${quota.benefit}</div>
            <div class="airport-eligibility__quota">${quotaText}</div>
          </div>
          <div class="airport-eligibility__card">
            ${Icons.creditCard(20)}
            <span>${Format.tierLabel(user.cardTier)} Card</span>
          </div>
        </div>
      `;
    } else {
      eligibilityBanner = `
        <div class="airport-eligibility airport-eligibility--locked">
          <div class="airport-eligibility__icon">${Icons.shield(28)}</div>
          <div class="airport-eligibility__content">
            <div class="airport-eligibility__title">Airport Transfer Unavailable</div>
            <div class="airport-eligibility__text">Available with Platinum Card and above. Upgrade your card to unlock complimentary chauffeur transfers to and from UAE airports.</div>
          </div>
          <div class="airport-eligibility__card">
            ${Icons.creditCard(20)}
            <span>${Format.tierLabel(user.cardTier)} Card</span>
          </div>
        </div>
      `;
    }

    // Build vehicle cards
    const vehicleCards = VEHICLE_TYPES.map(vehicle => {
      const vehicleMinLevel = CONFIG.cardTiers[vehicle.minTier]?.level || 1;
      const isAccessible = tierLevel >= vehicleMinLevel;

      const featureChips = vehicle.features.map(f =>
        `<span class="airport-card__feature">${f}</span>`
      ).join('');

      return `
        <div class="airport-card ${isAccessible ? '' : 'airport-card--locked'}" onclick="${isAccessible ? `Router.navigate('/airport/book?vehicle=${vehicle.id}')` : ''}">
          <div class="airport-card__image">
            <img src="${vehicle.image}" alt="${vehicle.name}" loading="lazy" />
            ${!isAccessible ? `
              <div class="airport-card__lock">
                ${Icons.shield(24)}
                <span>Requires ${Format.tierLabel(vehicle.minTier)} Card</span>
              </div>
            ` : ''}
          </div>
          <div class="airport-card__body">
            <div class="airport-card__name">${vehicle.name}</div>
            <div class="airport-card__desc">${vehicle.description}</div>
            <div class="airport-card__meta">
              ${Icons.users(13)} <span>${vehicle.maxPassengers} passengers</span>
              <span class="airport-card__dot">&middot;</span>
              ${Icons.luggage(13)} <span>${vehicle.maxBags} bags</span>
            </div>
            <div class="airport-card__features">
              ${featureChips}
            </div>
            <div class="airport-card__footer">
              <div class="airport-card__price">
                ${isAccessible
                  ? `<span class="airport-card__price-label">Complimentary</span>
                     <span class="airport-card__price-original">AED ${vehicle.basePrice}</span>`
                  : `<span class="airport-card__price-label">AED ${vehicle.basePrice}</span>`
                }
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
            <div class="airport-page__header">
              <div class="breadcrumb">
                <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
                <span class="breadcrumb__sep">&rsaquo;</span>
                <span class="breadcrumb__current">Airport Transfer</span>
              </div>
              <h1 class="page-title">${Icons.plane(28)} Airport Transfer</h1>
              <p class="airport-page__subtitle">Complimentary chauffeur service to and from UAE airports</p>
            </div>

            ${eligibilityBanner}

            <div class="airport-section-header">
              <h2 class="airport-section-header__title">Available Vehicles</h2>
              <p class="airport-section-header__count">${VEHICLE_TYPES.length} vehicles</p>
            </div>

            <div class="airport-grid">
              ${vehicleCards}
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

window.AirportPage = AirportPage;
