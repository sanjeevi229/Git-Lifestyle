// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Club House Landing Page
// ══════════════════════════════════════════════

const ClubPage = {
  render() {
    const user = Auth.getCurrentUser();
    const tierConfig = CONFIG.cardTiers[user.cardTier];
    const tierLevel = tierConfig?.level || 1;
    const quota = Store.getClubhouseQuota();
    const hasAccess = !!quota.benefit;

    // Build eligibility banner
    let eligibilityBanner = '';
    if (hasAccess) {
      const quotaText = quota.allowed >= 999
        ? 'Unlimited visits'
        : `${quota.remaining} of ${quota.allowed} remaining`;
      eligibilityBanner = `
        <div class="club-eligibility club-eligibility--active">
          <div class="club-eligibility__icon">${Icons.checkCircle(28)}</div>
          <div class="club-eligibility__content">
            <div class="club-eligibility__title">Club Access Included</div>
            <div class="club-eligibility__text">${quota.benefit}</div>
            <div class="club-eligibility__quota">${quotaText}</div>
          </div>
          <div class="club-eligibility__card">
            ${Icons.creditCard(20)}
            <span>${Format.tierLabel(user.cardTier)} Card</span>
          </div>
        </div>
      `;
    } else {
      eligibilityBanner = `
        <div class="club-eligibility club-eligibility--locked">
          <div class="club-eligibility__icon">${Icons.shield(28)}</div>
          <div class="club-eligibility__content">
            <div class="club-eligibility__title">Club Access Unavailable</div>
            <div class="club-eligibility__text">Available with Platinum Card and above. Upgrade your card to unlock complimentary club access across the UAE.</div>
          </div>
          <div class="club-eligibility__card">
            ${Icons.creditCard(20)}
            <span>${Format.tierLabel(user.cardTier)} Card</span>
          </div>
        </div>
      `;
    }

    // Build category cards
    const categoryCards = CLUBHOUSE_CATEGORIES.map(cat => {
      const catMinLevel = CONFIG.cardTiers[cat.minTier]?.level || 1;
      const isAccessible = tierLevel >= catMinLevel;

      const featureChips = cat.features.map(f =>
        `<span class="club-card__feature">${f}</span>`
      ).join('');

      return `
        <div class="club-card ${isAccessible ? '' : 'club-card--locked'}" onclick="${isAccessible ? `Router.navigate('/club/register?category=${cat.id}')` : ''}">
          <div class="club-card__image">
            <img src="${cat.image}" alt="${cat.name}" loading="lazy" />
            ${!isAccessible ? `
              <div class="club-card__lock">
                ${Icons.shield(24)}
                <span>Requires ${Format.tierLabel(cat.minTier)} Card</span>
              </div>
            ` : ''}
          </div>
          <div class="club-card__body">
            <div class="club-card__name">${cat.name}</div>
            <div class="club-card__desc">${cat.description}</div>
            <div class="club-card__meta">
              ${Icons.users(13)} <span>Up to ${cat.maxGuests} guests</span>
            </div>
            <div class="club-card__features">
              ${featureChips}
            </div>
          </div>
          <div class="club-card__footer">
            <div class="club-card__price">
              ${isAccessible
                ? `<span class="club-card__price-label">Complimentary</span>
                   <span class="club-card__price-original">AED ${cat.basePrice}</span>`
                : `<span class="club-card__price-label" style="color:var(--charcoal)">AED ${cat.basePrice}</span>`
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
            <div class="club-page__header">
              <div class="breadcrumb">
                <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
                <span class="breadcrumb__sep">&rsaquo;</span>
                <span class="breadcrumb__current">Club House</span>
              </div>
              <h1 class="page-title">${Icons.users(28)} Club House</h1>
              <p class="club-page__subtitle" style="color:var(--grey);font-size:15px;margin-top:4px">Complimentary access to the UAE's best resorts, hotels, gyms, water sports & dining</p>
            </div>

            ${eligibilityBanner}

            <div class="club-section-header">
              <h2 class="club-section-header__title">Available Categories</h2>
              <p class="club-section-header__count">${CLUBHOUSE_CATEGORIES.length} categories</p>
            </div>

            <div class="club-grid">
              ${categoryCards}
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

window.ClubPage = ClubPage;
