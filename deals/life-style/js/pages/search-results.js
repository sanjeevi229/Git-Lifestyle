// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Search Results Page
// ══════════════════════════════════════════════

const SearchResultsPage = {
  render(params, query) {
    const q = query.q || '';
    const results = Store.searchAll(q);
    const totalCount = results.offers.length + results.events.length + results.merchants.length;

    const offerCards = results.offers.map(o => {
      const merchant = Store.getMerchant(o.merchantId);
      return `
        <div class="offer-card" onclick="Router.navigate('/offer/${o.id}')">
          <div class="offer-card__image card-hover-zone">
            <img src="${o.image}" alt="${o.title}" loading="lazy" />
            <span class="discount-badge ${Format.discountBadgeClass(o)}">${Format.discountLabel(o)}</span>
            <button class="card-share-btn" onclick="event.stopPropagation();cardShare('${o.title.replace(/'/g, "\\'")}','/offer/${o.id}')" aria-label="Share">${Icons.share(15)}</button>
            <div class="card-hover-zone__overlay">
              <button class="card-hover-zone__cta" onclick="event.stopPropagation()">Book Now</button>
            </div>
          </div>
          <div class="offer-card__content">
            <div class="offer-card__title">${o.title}</div>
            <div class="offer-card__merchant">${merchant ? merchant.name : 'Visa Infinite'}</div>
            <div class="offer-card__footer">
              <span class="badge badge--info">${Format.categoryLabel(o.category)}</span>
              <span class="text-xs text-muted">${Format.daysUntil(o.validUntil)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const eventCards = results.events.map(e => `
      <div class="offer-card" onclick="Router.navigate('/offer/event-${e.id}')">
        <div class="offer-card__image card-hover-zone">
          <img src="${e.image}" alt="${e.title}" loading="lazy" />
          ${Format.eventDateBadge(e.date)}
          <button class="card-share-btn" onclick="event.stopPropagation();cardShare('${e.title.replace(/'/g, "\\'")}','/offer/event-${e.id}')" aria-label="Share">${Icons.share(15)}</button>
          <div class="card-hover-zone__overlay">
            <span class="card-hover-zone__location">${Icons.mapPin(14)} ${e.venue}</span>
            <button class="card-hover-zone__cta" onclick="event.stopPropagation()">Book Now</button>
          </div>
        </div>
        <div class="offer-card__content">
          <div class="offer-card__title">${e.title}</div>
          <div class="offer-card__merchant">${e.venue} · ${e.area}</div>
          <div class="offer-card__footer">
            <span class="badge badge--danger">Event</span>
            <span class="text-semibold">AED ${e.price}</span>
          </div>
        </div>
      </div>
    `).join('');

    const merchantCards = results.merchants.map(m => {
      const offers = (Store.get('offers') || []).filter(o => o.merchantId === m.id && o.isActive);
      const bestOffer = offers[0];
      return `
        <div class="merchant-card" onclick="${bestOffer ? `Router.navigate('/offer/${bestOffer.id}')` : `Router.navigate('/category/${m.category}')`}">
          <div class="merchant-card__image card-hover-zone">
            <img src="${m.image}" alt="${m.name}" loading="lazy" />
            <button class="card-share-btn" onclick="event.stopPropagation();cardShare('${m.name.replace(/'/g, "\\'")}','${bestOffer ? `/offer/${bestOffer.id}` : `/category/${m.category}`}')" aria-label="Share">${Icons.share(15)}</button>
            <div class="card-hover-zone__overlay">
              <span class="card-hover-zone__rating">${Icons.star(14)} ${Number(m.rating).toFixed(1)}</span>
              <span class="card-hover-zone__location">${Icons.mapPin(14)} ${m.area}</span>
              <button class="card-hover-zone__cta" onclick="event.stopPropagation()">Book Now</button>
            </div>
          </div>
          <div class="merchant-card__content">
            <div class="merchant-card__name">${m.name}</div>
            <div class="merchant-card__cuisine">${m.cuisine || m.category} · ${m.area}</div>
            <div class="merchant-card__footer">
              <span class="text-semibold">${Format.rating(m.rating)}</span>
              ${offers.length ? `<span class="text-xs text-success">${offers.length} offer${offers.length > 1 ? 's' : ''}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="search-results__header">
              <h1 class="page-title">Search Results</h1>
              <p class="text-muted">${totalCount} result${totalCount !== 1 ? 's' : ''} for "${q}"</p>
            </div>

            ${results.offers.length ? `
              <div class="search-results__section">
                <h2 class="search-results__section-title">Offers (${results.offers.length})</h2>
                <div class="offers-grid">${offerCards}</div>
              </div>
            ` : ''}

            ${results.events.length ? `
              <div class="search-results__section">
                <h2 class="search-results__section-title">Events (${results.events.length})</h2>
                <div class="offers-grid">${eventCards}</div>
              </div>
            ` : ''}

            ${results.merchants.length ? `
              <div class="search-results__section">
                <h2 class="search-results__section-title">Merchants (${results.merchants.length})</h2>
                <div class="offers-grid">${merchantCards}</div>
              </div>
            ` : ''}

            ${totalCount === 0 ? `
              <div class="empty-state" style="padding:60px 0">
                <div class="empty-state__icon">${Icons.search(48)}</div>
                <h2 class="empty-state__title">No results found</h2>
                <p class="empty-state__text">Try a different search term or browse our categories.</p>
                <button class="btn btn--primary" onclick="Router.navigate('/home')">Back to Home</button>
              </div>
            ` : ''}
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

window.SearchResultsPage = SearchResultsPage;
