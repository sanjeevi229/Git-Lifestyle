// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Plus Points Transfer Page
// ══════════════════════════════════════════════

const PlusPointsPage = {
  render() {
    const programs = window.PLUS_POINTS_PROGRAMS || [];

    const programCards = programs.map(p => {
      const catIcon = p.category === 'airlines' ? Icons.plane(14) : Icons.mapPin(14);
      const catLabel = p.category === 'airlines' ? 'Airlines' : 'Hotels';

      return `
        <div class="pp-card" data-id="${p.id}" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
          <div class="pp-card__logo" style="background:${p.logoBg}">${p.logo}</div>
          <div class="pp-card__info">
            <h3 class="pp-card__name">${p.name}</h3>
            <p class="pp-card__category">${catIcon} ${catLabel}</p>
            <p class="pp-card__conversion">${p.conversion}</p>
          </div>
          <button class="pp-card__link" onclick="event.stopPropagation();">Link</button>
        </div>
      `;
    }).join('');

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">

          <!-- Hero -->
          <section class="pp-hero">
            <img class="pp-hero__bg" src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80" alt="" />
            <div class="pp-hero__overlay"></div>
            <div class="pp-hero__content">
              <h1 class="pp-hero__title">Transfer Plus<br/>Points with Ease</h1>
              <p class="pp-hero__subtitle">Get started by linking your first loyalty program account. It takes less than a minute to set up.</p>
            </div>
            <div class="pp-hero__search">
              ${Icons.search(20)}
              <input id="ppSearchInput" type="text" placeholder="Search loyalty programs..." />
            </div>
          </section>

          <!-- Section title -->
          <div class="pp-section">
            <h2 class="pp-section__title">Popular Programs</h2>
          </div>

          <!-- Program list -->
          <div class="pp-list" id="ppList">
            ${programCards}
          </div>

          <!-- Browse all -->
          <div class="pp-browse">
            <button class="pp-browse__btn">Browse All Programs</button>
          </div>

        </main>
      </div>
    `;
  },

  mount() {
    Nav.mount();

    const input = document.getElementById('ppSearchInput');
    if (input) {
      input.addEventListener('input', () => this._filterCards());
    }
  },

  _filterCards() {
    const input = document.getElementById('ppSearchInput');
    const searchText = (input ? input.value : '').toLowerCase().trim();

    const cards = document.querySelectorAll('.pp-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const match = !searchText || card.dataset.name.includes(searchText);
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });
  },
};

window.PlusPointsPage = PlusPointsPage;
