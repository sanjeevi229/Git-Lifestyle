// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Card Benefits Page (Redesign)
// ══════════════════════════════════════════════

const CardBenefitsPage = {
  _selectedTier: null,
  _selectedCategory: 'all',

  render() {
    const userTier = this._selectedTier || Auth.getCardTier();
    const tier = ['infinite', 'private'].includes(userTier) ? userTier : 'infinite';
    this._selectedTier = tier;
    const user = Auth.getCurrentUser();
    const tierCfg = CONFIG.cardTiers[tier];
    const displayName = CARD_DISPLAY_NAMES[tier] || tierCfg.label;

    const allowedTiers = ['infinite', 'private'];
    const tierOptions = Object.entries(CONFIG.cardTiers)
      .filter(([t]) => allowedTiers.includes(t))
      .map(([t, cfg]) =>
        `<option value="${t}" ${t === tier ? 'selected' : ''}>${CARD_DISPLAY_NAMES[t] || cfg.label}</option>`
      ).join('');

    const chips = CARD_BENEFIT_CATEGORIES.map(cat =>
      `<button class="cb-chip ${cat.id === this._selectedCategory ? 'cb-chip--active' : ''}" data-cat="${cat.id}">${cat.label}</button>`
    ).join('');

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">

          <section class="cb-banner" style="background-image:url('assets/card benifts/photos/banner_bg.jpg')">
            <div class="cb-banner__overlay"></div>
            <div class="cb-banner__content">
              <div class="cb-banner__title-row">
                <span class="cb-banner__icon">${Icons.creditCard(28)}</span>
                <h2 class="cb-banner__title">Card Benefits</h2>
              </div>
              <p class="cb-banner__tagline">Explore exclusive privileges for your Visa card</p>
            </div>
            <div class="cb-banner__search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input id="cbSearchInput" type="text" placeholder="Search offers, flights, restaurants..." />
              <button onclick="CardBenefitsPage._doSearch()" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </section>

          <div class="cb-hero">
            <div class="cb-card-wrap">
              <div class="cb-card" data-tier="${tier}" id="cbCardVisual">
                <div class="cb-card__inner">
                  <div class="cb-card__top">
                    <div>
                      <div class="cb-card__visa">VISA</div>
                      <div class="cb-card__tier">${tierCfg.label}</div>
                    </div>
                    <div class="cb-card__chip"></div>
                  </div>
                  <div class="cb-card__bottom">
                    <div class="cb-card__number">**** **** **** 4821</div>
                    <div class="cb-card__holder">${user ? user.name.toUpperCase() : 'CARDHOLDER'}</div>
                  </div>
                </div>
              </div>
            </div>

            <h1 class="cb-hero__title">All benefits. One Smart choice.<br>Your Perfect Card.</h1>
            <p class="cb-hero__subtitle">Explore the complete range of Visa debit and credit cards with all benefits at a glance. Pick the card that fits your lifestyle and spending habits</p>
          </div>

          <div class="cb-selector-wrap">
            <label class="cb-selector-label" for="cbTierSelect">Select Card</label>
            <select class="cb-selector" id="cbTierSelect">
              ${tierOptions}
            </select>
          </div>

          <div class="cb-chips-wrap">
            <div class="cb-chips" id="cbChips">
              ${chips}
            </div>
          </div>

          <div class="cb-grid-wrap">
            <div class="cb-grid" id="cbGrid">
              ${this._renderGridHTML()}
            </div>
          </div>

        </main>
      </div>
    `;
  },

  _renderGridHTML() {
    const tier = this._selectedTier;
    const cat = this._selectedCategory;
    const cards = cat === 'all'
      ? CARD_BENEFIT_CARDS
      : CARD_BENEFIT_CARDS.filter(c => c.category === cat);

    if (!cards.length) {
      return '<div class="cb-empty">No benefits in this category</div>';
    }

    return cards.map(card => {
      const desc = CARD_BENEFITS[tier]?.[card.id] || null;
      const unavailable = !desc;
      const clickable = card.route && !unavailable;
      return `
        <div class="cb-benefit ${unavailable ? 'cb-benefit--unavailable' : ''}"
          ${clickable ? `onclick="Router.navigate('${card.route}')"` : ''}>
          <img class="cb-benefit__img" src="${card.image}" alt="${card.title}" loading="lazy">
          <div class="cb-benefit__overlay"></div>
          <span class="cb-benefit__badge">${card.badge}</span>
          <h3 class="cb-benefit__title">${card.title}</h3>
        </div>
      `;
    }).join('');
  },

  _updateGrid() {
    const grid = $('#cbGrid');
    if (grid) grid.innerHTML = this._renderGridHTML();
  },

  _updateCard() {
    const card = $('#cbCardVisual');
    if (!card) return;
    const tier = this._selectedTier;
    const tierCfg = CONFIG.cardTiers[tier];
    card.setAttribute('data-tier', tier);
    const tierLabel = card.querySelector('.cb-card__tier');
    if (tierLabel) tierLabel.textContent = tierCfg.label;
    const visaLabel = card.querySelector('.cb-card__visa');
    if (visaLabel) visaLabel.textContent = 'VISA';
  },

  _updateHeroSubtitle() {
    // subtitle is now static — no update needed
  },

  _updateChips() {
    const chips = $$('.cb-chip');
    chips.forEach(chip => {
      const cat = chip.getAttribute('data-cat');
      chip.classList.toggle('cb-chip--active', cat === this._selectedCategory);
    });
  },

  _doSearch() {
    const input = $('#cbSearchInput');
    if (input && input.value.trim()) {
      Router.navigate('/search?q=' + encodeURIComponent(input.value.trim()));
    }
  },

  mount() {
    Nav.mount();

    const searchInput = $('#cbSearchInput');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') CardBenefitsPage._doSearch();
      });
      if (typeof AutoSuggest !== 'undefined') AutoSuggest.attach(searchInput);
    }

    delegate('#app', 'change', '#cbTierSelect', (e, target) => {
      this._selectedTier = target.value;
      this._updateCard();
      this._updateHeroSubtitle();
      this._updateGrid();
    });

    delegate('#app', 'click', '.cb-chip', (e, target) => {
      this._selectedCategory = target.getAttribute('data-cat');
      this._updateChips();
      this._updateGrid();
    });
  },

  unmount() {
    this._selectedCategory = 'all';
  },
};

window.CardBenefitsPage = CardBenefitsPage;
