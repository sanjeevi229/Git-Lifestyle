// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Concierge Landing Page
// ══════════════════════════════════════════════

const ConciergePage = {
  render() {
    const user = Auth.getCurrentUser();
    const tierConfig = CONFIG.cardTiers[user.cardTier];
    const tierLevel = tierConfig?.level || 1;
    const quota = Store.getConciergeQuota();
    const hasAccess = !!quota.benefit;

    // Build eligibility banner
    let eligibilityBanner = '';
    if (hasAccess) {
      const quotaText = quota.allowed >= 999
        ? 'Unlimited requests'
        : `${quota.remaining} of ${quota.allowed} remaining`;
      eligibilityBanner = `
        <div class="concierge-eligibility concierge-eligibility--active">
          <div class="concierge-eligibility__icon">${Icons.checkCircle(28)}</div>
          <div class="concierge-eligibility__content">
            <div class="concierge-eligibility__title">Concierge Included</div>
            <div class="concierge-eligibility__text">${quota.benefit}</div>
            <div class="concierge-eligibility__quota">${quotaText}</div>
          </div>
          <div class="concierge-eligibility__card">
            ${Icons.creditCard(20)}
            <span>${Format.tierLabel(user.cardTier)} Card</span>
          </div>
        </div>
      `;
    } else {
      eligibilityBanner = `
        <div class="concierge-eligibility concierge-eligibility--locked">
          <div class="concierge-eligibility__icon">${Icons.shield(28)}</div>
          <div class="concierge-eligibility__content">
            <div class="concierge-eligibility__title">Concierge Unavailable</div>
            <div class="concierge-eligibility__text">Available with Platinum Card and above. Upgrade your card to unlock complimentary concierge services.</div>
          </div>
          <div class="concierge-eligibility__card">
            ${Icons.creditCard(20)}
            <span>${Format.tierLabel(user.cardTier)} Card</span>
          </div>
        </div>
      `;
    }

    // Build service cards
    const serviceCards = CONCIERGE_SERVICE_TYPES.map(service => {
      const serviceMinLevel = CONFIG.cardTiers[service.minTier]?.level || 1;
      const isAccessible = tierLevel >= serviceMinLevel;

      const featureChips = service.features.map(f =>
        `<span class="concierge-card__feature">${f}</span>`
      ).join('');

      return `
        <div class="concierge-card ${isAccessible ? '' : 'concierge-card--locked'}" onclick="${isAccessible ? `Router.navigate('/concierge/book?service=${service.id}')` : ''}">
          <div class="concierge-card__image">
            <img src="${service.image}" alt="${service.name}" loading="lazy" />
            ${!isAccessible ? `
              <div class="concierge-card__lock">
                ${Icons.shield(24)}
                <span>Requires ${Format.tierLabel(service.minTier)} Card</span>
              </div>
            ` : ''}
          </div>
          <div class="concierge-card__body">
            <div class="concierge-card__name">${service.name}</div>
            <div class="concierge-card__desc">${service.description}</div>
            <div class="concierge-card__meta">
              ${Icons.clock(13)} <span>Response within ${service.turnaround}</span>
            </div>
            <div class="concierge-card__features">
              ${featureChips}
            </div>
          </div>
          <div class="concierge-card__footer">
            <div class="concierge-card__price">
              ${isAccessible
                ? `<span class="concierge-card__price-label">Complimentary</span>`
                : `<span class="concierge-card__price-label" style="color:var(--charcoal)">Upgrade Required</span>`
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
            <div class="concierge-page__header">
              <div class="breadcrumb">
                <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
                <span class="breadcrumb__sep">&rsaquo;</span>
                <span class="breadcrumb__current">Concierge</span>
              </div>
              <h1 class="page-title">${Icons.star(28)} Concierge</h1>
              <p class="concierge-page__subtitle" style="color:var(--grey);font-size:15px;margin-top:4px">Your personal luxury lifestyle assistant</p>
            </div>

            ${eligibilityBanner}

            <div class="concierge-section-header">
              <h2 class="concierge-section-header__title">Our Services</h2>
              <p class="concierge-section-header__count">${CONCIERGE_SERVICE_TYPES.length} services</p>
            </div>

            <div class="concierge-grid">
              ${serviceCards}
            </div>

            <!-- How It Works -->
            <div class="concierge-how-it-works">
              <h2 class="concierge-how-it-works__title">How It Works</h2>
              <div class="concierge-how-it-works__steps">
                <div class="concierge-how-step">
                  <div class="concierge-how-step__num">1</div>
                  <div class="concierge-how-step__label">Choose a Service</div>
                  <div class="concierge-how-step__desc">Select from our range of luxury lifestyle services above</div>
                </div>
                <div class="concierge-how-step__line"></div>
                <div class="concierge-how-step">
                  <div class="concierge-how-step__num">2</div>
                  <div class="concierge-how-step__label">Describe Your Request</div>
                  <div class="concierge-how-step__desc">Tell us what you need — dates, preferences, and any special requirements</div>
                </div>
                <div class="concierge-how-step__line"></div>
                <div class="concierge-how-step">
                  <div class="concierge-how-step__num">3</div>
                  <div class="concierge-how-step__label">We Handle It</div>
                  <div class="concierge-how-step__desc">Our team takes care of every detail and confirms your arrangement</div>
                </div>
              </div>
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

window.ConciergePage = ConciergePage;
