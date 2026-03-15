// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Gift Cards Landing Page
// ══════════════════════════════════════════════

const GiftCardsPage = {
  _activeCategory: 'all',

  render() {
    const categories = window.GIFT_CARD_CATEGORIES || [];
    const cards = window.GIFT_CARDS || [];

    const chips = categories.map(c => `
      <button class="gc-chip ${c.id === this._activeCategory ? 'gc-chip--active' : ''}"
              data-cat="${c.id}">${c.label}</button>
    `).join('');

    const brandCards = cards.map(card => `
      <div class="gc-brand" data-id="${card.id}" data-category="${card.category}" data-name="${card.name.toLowerCase()}">
        <div class="gc-brand__logo" style="background:${card.color}">${card.initials}</div>
        <span class="gc-brand__name">${card.name}</span>
        <span class="gc-brand__points">From ${card.pointsFrom} pts</span>
      </div>
    `).join('');

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">

          <!-- Hero -->
          <section class="gc-hero">
            <div class="gc-hero__confetti"></div>
            <div class="gc-hero__card-visual">
              <div class="gc-hero__bow"></div>
              <div class="gc-hero__chip"></div>
              <div class="gc-hero__card-lines">
                <span></span>
                <span></span>
              </div>
            </div>
            <h1 class="gc-hero__title">The Perfect Gift for<br/>Every Occasion</h1>
            <p class="gc-hero__subtitle">Buy instantly and redeem easily using Plus Points</p>
            <div class="gc-hero__search">
              ${Icons.search(20)}
              <input id="gcSearchInput" type="text" placeholder="Find your favourite brand..." />
            </div>
          </section>

          <!-- Category chips -->
          <div class="gc-chips" id="gcChips">
            ${chips}
          </div>

          <!-- Brand grid -->
          <div class="gc-grid-wrap">
            <div class="gc-grid" id="gcGrid">
              ${brandCards}
            </div>
          </div>

        </main>
      </div>
    `;
  },

  mount() {
    Nav.mount();

    // Search
    const input = document.getElementById('gcSearchInput');
    if (input) {
      input.addEventListener('input', () => this._filterCards());
    }

    // Category chips
    const chipsContainer = document.getElementById('gcChips');
    if (chipsContainer) {
      delegate(chipsContainer, 'click', '.gc-chip', (e, el) => {
        const cat = el.dataset.cat;
        this._filterCategory(cat);
      });
    }
  },

  _filterCategory(id) {
    this._activeCategory = id;
    // Update active chip
    const chips = document.querySelectorAll('.gc-chip');
    chips.forEach(chip => {
      chip.classList.toggle('gc-chip--active', chip.dataset.cat === id);
    });
    this._filterCards();
  },

  _filterCards() {
    const input = document.getElementById('gcSearchInput');
    const searchText = (input ? input.value : '').toLowerCase().trim();
    const cat = this._activeCategory;

    const brands = document.querySelectorAll('.gc-brand');
    let visibleCount = 0;

    brands.forEach(brand => {
      const matchesCat = cat === 'all' || brand.dataset.category === cat;
      const matchesSearch = !searchText || brand.dataset.name.includes(searchText);
      const show = matchesCat && matchesSearch;
      brand.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    // Show/hide empty state
    const grid = document.getElementById('gcGrid');
    let emptyEl = grid ? grid.querySelector('.gc-empty') : null;
    if (visibleCount === 0) {
      if (!emptyEl && grid) {
        emptyEl = document.createElement('div');
        emptyEl.className = 'gc-empty';
        emptyEl.textContent = 'No brands found matching your search.';
        grid.appendChild(emptyEl);
      }
    } else if (emptyEl) {
      emptyEl.remove();
    }
  },
};

window.GiftCardsPage = GiftCardsPage;
