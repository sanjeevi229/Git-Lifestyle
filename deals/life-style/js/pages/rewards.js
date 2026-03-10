// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Rewards Landing Page
// ══════════════════════════════════════════════

const RewardsPage = {
  render() {
    const user = Auth.getCurrentUser();
    const tier = CONFIG.cardTiers[user?.cardTier] || CONFIG.cardTiers.infinite;
    const partners = CONFIG.rewardPartners || [];

    const partnerCards = partners.map(p => `
      <div class="rw-card" onclick="Router.navigate('/rewards/${p.id}')" style="cursor:pointer;">
        <div class="rw-card__banner" style="background: linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]}); --rc-grad-start: ${p.gradient[0]};">
          <div class="rw-card__glow" style="background: radial-gradient(circle at 90% 80%, ${p.accentColor}33 0%, transparent 60%);"></div>
          <div class="rw-card__banner-content">
            <span class="rw-card__brand-label">${p.brand}</span>
            <p class="rw-card__tagline">${p.tagline}</p>
          </div>
          <div class="rw-card__banner-visual">
            <img src="${p.image}" alt="${p.brand}" loading="lazy" />
          </div>
        </div>
        <div class="rw-card__body">
          <h3 class="rw-card__name">${p.brand}</h3>
          <p class="rw-card__desc">${p.description}</p>
          <button class="rw-card__cta">${p.cta === 'Subscribe' ? 'View my code' : p.cta === 'Activate' ? 'View my code' : p.cta === 'Claim' ? 'View my code' : p.cta === 'Redeem' ? 'View my code' : 'View my code'}</button>
        </div>
      </div>
    `).join('');

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">

          <!-- Hero -->
          <section class="rw-hero">
            <img class="rw-hero__bg" src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80" alt="" />
            <div class="rw-hero__overlay"></div>
            <div class="rw-hero__content">
              <h1 class="rw-hero__title">Exclusive Lifestyle Benefits</h1>
              <p class="rw-hero__subtitle">Curated benefits for our ${tier.label} banking clients</p>
              <p class="rw-hero__count">${partners.length} benefit${partners.length !== 1 ? 's' : ''} available</p>
            </div>
            <div class="rw-hero__search">
              ${Icons.search(20)}
              <input id="rwSearchInput" type="text" placeholder="Search rewards & benefits..." />
              <button onclick="RewardsPage._doSearch()" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </section>

          <!-- Content -->
          <div class="container">
            <div class="rw-section">
              <p class="rw-section__intro">Enjoy exclusive benefits & offers</p>
              <div class="rw-list">
                ${partnerCards}
              </div>
            </div>
          </div>

        </main>
      </div>
    `;
  },

  mount() {
    Nav.mount();

    const input = document.getElementById('rwSearchInput');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._doSearch();
      });
      AutoSuggest.attach(input);
    }
  },

  _doSearch() {
    const input = document.getElementById('rwSearchInput');
    if (input && input.value.trim()) {
      Router.navigate('/search?q=' + encodeURIComponent(input.value.trim()));
    }
  },
};
