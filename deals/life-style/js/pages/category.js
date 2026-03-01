// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Category Page
// ══════════════════════════════════════════════

const CategoryPage = {
  _categoryId: null,
  _sort: 'recommended',
  _filterType: 'all',
  _subcategory: null,
  _location: null,

  render(params) {
    this._categoryId = params.id;
    this._sort = 'recommended';
    this._filterType = 'all';
    this._subcategory = null;
    this._location = null;

    const catConfig = CONFIG.categories.find(c => c.id === this._categoryId);
    const catLabel = catConfig ? catConfig.label : this._categoryId;
    const catIcon = catConfig ? catConfig.icon : Icons.package(20);

    // For events category, show events instead
    if (this._categoryId === 'events') {
      return this._renderEvents(catLabel, catIcon);
    }

    // Handle 'your-card' redirect
    if (this._categoryId === 'your-card') {
      setTimeout(() => Router.navigate('/card-benefits'), 0);
      return '<div class="page"></div>';
    }

    const offers = this._getFilteredOffers();
    const hero = CONFIG.categoryHeroes[this._categoryId] || {};
    const heroImage = hero.image || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&q=80';
    const heroVideo = hero.video || null;
    const heroTagline = hero.tagline || `Explore the best ${catLabel.toLowerCase()} offers`;
    const sectionTitle = hero.sectionTitle || `${catLabel} Offers`;
    const sectionDesc = hero.sectionDesc || `Browse all ${catLabel.toLowerCase()} offers available for your card`;

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <!-- Category Hero Banner -->
          <section class="cat-hero${heroVideo ? ' cat-hero--video' : ''}" style="background-image:url('${heroImage}')">
            ${heroVideo ? `<video class="cat-hero__video" autoplay muted loop playsinline poster="${heroImage}"><source src="${heroVideo}" type="video/mp4"></video>` : ''}
            <div class="cat-hero__overlay"></div>
            <div class="cat-hero__content">
              <div class="cat-hero__title-row">
                <span class="cat-hero__icon">${catIcon}</span>
                <h1 class="cat-hero__title">${catLabel}</h1>
              </div>
              <p class="cat-hero__tagline">${heroTagline}</p>
              <p class="cat-hero__count">${offers.length} offer${offers.length !== 1 ? 's' : ''} available</p>
            </div>
            <div class="cat-hero__search">
              ${Icons.search(20)}
              <input id="catSearchInput" type="text" placeholder="Search ${catLabel.toLowerCase()} offers..." />
              <button onclick="CategoryPage._doSearch()" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </section>

          <div class="container">
            <div class="cat-section-header">
              <h2 class="page-title">${sectionTitle}</h2>
              <p class="page-subtitle">${sectionDesc}</p>
            </div>

            ${this._renderFilterSection()}

            ${this._renderCuratedCollections()}

            <div class="curated-header">
              <h3 class="curated-title">${sectionTitle}</h3>
              <button class="curated-show-all" id="showAllOffers">Show all</button>
            </div>
            <div class="offers-grid" id="offersGrid">
              ${this._renderOfferCards(offers)}
            </div>

            ${offers.length === 0 ? `
              <div class="empty-state" style="padding:60px 0">
                <div class="empty-state__icon">${catIcon}</div>
                <h2 class="empty-state__title">No offers available</h2>
                <p class="empty-state__text">There are currently no ${catLabel.toLowerCase()} offers for your card tier.</p>
                <button class="btn btn--primary" onclick="Router.navigate('/home')">Back to Home</button>
              </div>
            ` : ''}
          </div>
        </main>
      </div>
    `;
  },

  mount(params) {
    Nav.mount();

    // Advanced filters toggle
    delegate('#app', 'click', '#catFilterBtn', (e, el) => {
      const panel = $('#catAdvancedPanel');
      if (panel) {
        panel.classList.toggle('open');
        el.classList.toggle('active');
      }
    });

    // Subcategory card click
    delegate('#app', 'click', '.cat-subcat-card', (e, el) => {
      const val = el.dataset.subcat;
      this._subcategory = this._subcategory === val ? null : val;
      $$('.cat-subcat-card').forEach(c => c.classList.toggle('active', c.dataset.subcat === this._subcategory));
      this._refreshGrid();
      // Auto-scroll to location section so user can pick a location next
      const locSection = $('.cat-location-section');
      if (locSection && this._subcategory) {
        setTimeout(() => locSection.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
      }
    });

    // Location pill click
    delegate('#app', 'click', '.cat-location-pill', (e, el) => {
      const val = el.dataset.location;
      this._location = this._location === val ? null : val;
      $$('.cat-location-pill').forEach(p => p.classList.toggle('active', p.dataset.location === this._location));
      this._refreshGrid();
    });

    // Advanced filter selects
    delegate('#app', 'change', '#filterType', (e) => {
      this._filterType = e.target.value;
      this._refreshGrid();
    });

    delegate('#app', 'change', '#sortSelect', (e) => {
      this._sort = e.target.value;
      this._refreshGrid();
    });

    // Curated collection card click — filter by collection
    delegate('#app', 'click', '.curated-card', (e, el) => {
      const collectionId = el.dataset.collection;
      if (!collectionId) return;
      // Scroll to offers grid
      const grid = $('#offersGrid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // "Show all" on curated collections — scroll to offers grid
    delegate('#app', 'click', '.curated-show-all', () => {
      const grid = $('#offersGrid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // "Show all" on offers — clear all filters and show everything
    delegate('#app', 'click', '#showAllOffers', () => {
      this._subcategory = null;
      this._location = null;
      this._filterType = 'all';
      this._sort = 'recommended';
      $$('.cat-subcat-card').forEach(c => c.classList.remove('active'));
      $$('.cat-location-pill').forEach(p => p.classList.remove('active'));
      const sortSel = $('#sortSelect');
      if (sortSel) sortSel.value = 'recommended';
      const typeSel = $('#filterType');
      if (typeSel) typeSel.value = 'all';
      this._refreshGrid();
      const grid = $('#offersGrid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Hero search
    const catInput = $('#catSearchInput');
    if (catInput) {
      catInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._doSearch();
      });
    }

    // Mobile tap-to-reveal overlay on card images
    this._setupTapOverlay();
  },

  _setupTapOverlay() {
    if ('ontouchstart' in window) {
      this._onTapOutside = (e) => {
        if (!e.target.closest('.card-hover-zone')) {
          $$('.card-hover-zone.is-tapped').forEach(z => z.classList.remove('is-tapped'));
        }
      };
      document.addEventListener('touchstart', this._onTapOutside, { passive: true });

      $$('.card-hover-zone').forEach(zone => {
        zone.addEventListener('touchstart', () => {
          $$('.card-hover-zone.is-tapped').forEach(z => { if (z !== zone) z.classList.remove('is-tapped'); });
          zone.classList.add('is-tapped');
        }, { passive: true });
      });
    }
  },

  unmount() {
    if (this._onTapOutside) {
      document.removeEventListener('touchstart', this._onTapOutside);
      this._onTapOutside = null;
    }
  },

  _doSearch() {
    const input = $('#catSearchInput');
    if (input && input.value.trim()) {
      Router.navigate('/search?q=' + encodeURIComponent(input.value.trim()));
    }
  },

  _getFilteredOffers() {
    const allCategoryOffers = Store.getOffersByCategory(this._categoryId);

    // Apply all strict filters
    let filtered = [...allCategoryOffers];
    if (this._filterType === 'expiring-soon') {
      const soon = new Date();
      soon.setDate(soon.getDate() + 14);
      filtered = filtered.filter(o => new Date(o.validUntil) <= soon);
    } else if (this._filterType !== 'all') {
      filtered = filtered.filter(o => o.offerType === this._filterType);
    }
    if (this._subcategory) {
      filtered = filtered.filter(o => {
        const merchant = Store.getMerchant(o.merchantId);
        return merchant && merchant.cuisine === this._subcategory;
      });
    }
    if (this._location) {
      filtered = filtered.filter(o => {
        const merchant = Store.getMerchant(o.merchantId);
        return merchant && merchant.area === this._location;
      });
    }

    // Guarantee at least 3 results: supplement with related offers
    if (filtered.length < 3 && (this._subcategory || this._location)) {
      const shownIds = new Set(filtered.map(o => o.id));

      // Pool of supplementary offers from the same category (not already shown)
      let extras = allCategoryOffers.filter(o => !shownIds.has(o.id));
      if (this._filterType === 'expiring-soon') {
        const soon2 = new Date(); soon2.setDate(soon2.getDate() + 14);
        extras = extras.filter(o => new Date(o.validUntil) <= soon2);
      } else if (this._filterType !== 'all') {
        extras = extras.filter(o => o.offerType === this._filterType);
      }

      // Score extras: prefer partial matches (same cuisine OR same location)
      extras.sort((a, b) => {
        const ma = Store.getMerchant(a.merchantId);
        const mb = Store.getMerchant(b.merchantId);
        let sa = 0, sb = 0;
        if (this._subcategory && ma && ma.cuisine === this._subcategory) sa += 2;
        if (this._location   && ma && ma.area    === this._location)    sa += 1;
        if (this._subcategory && mb && mb.cuisine === this._subcategory) sb += 2;
        if (this._location   && mb && mb.area    === this._location)    sb += 1;
        return sb - sa;
      });

      const needed = 3 - filtered.length;
      filtered = [...filtered, ...extras.slice(0, needed)];
    }

    return this._sortOffers(filtered);
  },

  _sortOffers(offers) {
    switch (this._sort) {
      case 'discount-desc':
        return [...offers].sort((a, b) => (b.discountValue || 0) - (a.discountValue || 0));
      case 'expiry-asc':
        return [...offers].sort((a, b) => new Date(a.validUntil) - new Date(b.validUntil));
      case 'name-asc':
        return [...offers].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return offers;
    }
  },

  _renderOfferCards(offers) {
    return offers.map(o => {
      const merchant = Store.getMerchant(o.merchantId);
      return `
        <div class="offer-card" onclick="Router.navigate('/offer/${o.id}')">
          <div class="offer-card__image card-hover-zone">
            <img src="${o.image}" alt="${o.title}" loading="lazy" />
            <span class="discount-badge ${Format.discountBadgeClass(o)}">${Format.discountLabel(o)}</span>
            ${o.isPremium ? '<span class="offer-card__premium-tag">Premium</span>' : ''}
            <button class="card-share-btn" onclick="event.stopPropagation();cardShare('${o.title.replace(/'/g, "\\'")}','/offer/${o.id}')" aria-label="Share">${Icons.share(15)}</button>
            <div class="card-hover-zone__overlay">
              ${merchant && merchant.area ? `<span class="card-hover-zone__location">${Icons.mapPin(14)} ${merchant.area}</span>` : ''}
              <button class="card-hover-zone__cta" onclick="event.stopPropagation()">Book Now</button>
            </div>
          </div>
          <div class="offer-card__content">
            <div class="offer-card__title">${o.title}</div>
            <div class="offer-card__merchant">${merchant ? merchant.name : 'Demo'}</div>
            <div class="offer-card__desc">${Format.truncate(o.description, 70)}</div>
            <div class="offer-card__footer">
              <span class="badge badge--info">${Format.categoryLabel(o.category)}</span>
              <span class="text-xs text-muted">${Format.daysUntil(o.validUntil)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  _renderEvents(catLabel, catIcon) {
    const events = this._getFilteredEvents();
    const hero = CONFIG.categoryHeroes['events'] || {};
    const heroImage = hero.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80';
    const heroTagline = hero.tagline || 'Exclusive events for cardholders';
    const totalEvents = Store.getUpcomingEvents().length;
    const sectionTitle = hero.sectionTitle || 'Upcoming Events';
    const sectionDesc = hero.sectionDesc || 'Exclusive events for Demo cardholders';

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <!-- Category Hero Banner -->
          <section class="cat-hero" style="background-image:url('${heroImage}')">
            <div class="cat-hero__overlay"></div>
            <div class="cat-hero__content">
              <div class="cat-hero__title-row">
                <span class="cat-hero__icon">${catIcon}</span>
                <h1 class="cat-hero__title">${catLabel}</h1>
              </div>
              <p class="cat-hero__tagline">${heroTagline}</p>
              <p class="cat-hero__count">${totalEvents} upcoming event${totalEvents !== 1 ? 's' : ''}</p>
            </div>
            <div class="cat-hero__search">
              ${Icons.search(20)}
              <input id="catSearchInput" type="text" placeholder="Search events..." />
              <button onclick="CategoryPage._doSearch()" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </section>

          <div class="container">
            <div class="cat-section-header">
              <h2 class="page-title">${sectionTitle}</h2>
              <p class="page-subtitle">${sectionDesc}</p>
            </div>

            ${this._renderEventsFilterSection()}

            <div class="offers-grid" id="offersGrid">
              ${this._renderEventCardsList(events)}
            </div>
            ${events.length === 0 ? `
              <div class="empty-state" style="padding:60px 0">
                <div class="empty-state__icon">${Icons.ticket(48)}</div>
                <h2 class="empty-state__title">No upcoming events</h2>
                <p class="empty-state__text">Check back soon for new events.</p>
                <button class="btn btn--primary" onclick="Router.navigate('/home')">Back to Home</button>
              </div>
            ` : ''}
          </div>
        </main>
      </div>
    `;
  },

  _getFilteredEvents() {
    let events = Store.getUpcomingEvents();

    if (this._subcategory) {
      events = events.filter(e => e.eventType === this._subcategory);
    }
    if (this._location) {
      events = events.filter(e => e.area === this._location);
    }

    // Sort
    switch (this._sort) {
      case 'discount-desc':
        events = [...events].sort((a, b) => {
          const da = a.originalPrice > a.price ? (1 - a.price / a.originalPrice) : 0;
          const db = b.originalPrice > b.price ? (1 - b.price / b.originalPrice) : 0;
          return db - da;
        });
        break;
      case 'expiry-asc':
        events = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'name-asc':
        events = [...events].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return events;
  },

  _renderEventCardsList(events) {
    return events.map(e => `
      <div class="offer-card" onclick="Router.navigate('/offer/event-${e.id}')">
        <div class="offer-card__image card-hover-zone">
          <img src="${e.image}" alt="${e.title}" loading="lazy" />
          ${Format.eventDateBadge(e.date)}
          ${e.originalPrice > e.price ? `<span class="discount-badge discount-badge--red">${Math.round((1 - e.price / e.originalPrice) * 100)}% OFF</span>` : ''}
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
            <span class="text-semibold">AED ${e.price}</span>
            ${e.originalPrice > e.price ? `<span class="text-xs text-muted" style="text-decoration:line-through">AED ${e.originalPrice}</span>` : ''}
            <span style="margin-left:auto">${Format.spotsLeft(e.capacity, e.bookedCount)}</span>
          </div>
        </div>
      </div>
    `).join('');
  },

  _renderEventsFilterSection() {
    const subcats = (CONFIG.categorySubcategories || {}).events || [];
    const locations = (CONFIG.categoryLocations || {}).events || [];

    const subcatHTML = subcats.length ? `
      <div class="cat-subcat-grid">
        ${subcats.map(s => `
          <div class="cat-subcat-card ${this._subcategory === s.id ? 'active' : ''}" data-subcat="${s.id}">
            <span class="cat-subcat-icon">${Icons[s.icon] ? Icons[s.icon](28) : Icons.package(28)}</span>
            <span class="cat-subcat-label">${s.label}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    const locationHTML = locations.length ? `
      <div class="cat-location-section">
        <div class="cat-location-header">By location</div>
        <div class="cat-location-pills">
          <button class="cat-location-pill cat-location-pill--near ${this._location === 'near-me' ? 'active' : ''}" data-location="near-me">${Icons.mapPin(14)} Near Me</button>
          ${locations.map(loc => `
            <button class="cat-location-pill ${this._location === loc ? 'active' : ''}" data-location="${loc}">${loc}</button>
          `).join('')}
        </div>
      </div>
    ` : '';

    return `
      <div class="cat-filter-section">
        <div class="cat-filter-header">
          <span class="cat-filter-title">Categories</span>
          <button class="cat-filter-btn" id="catFilterBtn">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1h16M3 6h10M6 11h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Filters
          </button>
        </div>

        <!-- Advanced filters (sort) — toggled by Filters btn -->
        <div class="cat-advanced-panel" id="catAdvancedPanel">
          <div class="cat-advanced-row">
            <label>Sort by</label>
            <select id="sortSelect" class="form-select">
              ${CONFIG.sortOptions.map(s => `<option value="${s.id}" ${s.id === this._sort ? 'selected' : ''}>${s.label}</option>`).join('')}
            </select>
          </div>
        </div>

        ${subcatHTML}
        ${locationHTML}
      </div>
    `;
  },

  _renderFilterSection() {
    const subcats = (CONFIG.categorySubcategories || {})[this._categoryId];
    const locMap  = CONFIG.categoryLocations || {};
    const locations = locMap[this._categoryId] || locMap['default'] || [];

    const subcatHTML = subcats ? `
      <div class="cat-subcat-grid">
        ${subcats.map(s => `
          <div class="cat-subcat-card ${this._subcategory === s.id ? 'active' : ''}" data-subcat="${s.id}">
            <span class="cat-subcat-icon">${Icons[s.icon] ? Icons[s.icon](28) : Icons.package(28)}</span>
            <span class="cat-subcat-label">${s.label}</span>
          </div>
        `).join('')}
      </div>
    ` : '';

    const locationHTML = locations.length ? `
      <div class="cat-location-section">
        <div class="cat-location-header">By location</div>
        <div class="cat-location-pills">
          <button class="cat-location-pill cat-location-pill--near ${this._location === 'near-me' ? 'active' : ''}" data-location="near-me">${Icons.mapPin(14)} Near Me</button>
          ${locations.map(loc => `
            <button class="cat-location-pill ${this._location === loc ? 'active' : ''}" data-location="${loc}">${loc}</button>
          `).join('')}
        </div>
      </div>
    ` : '';

    return `
      <div class="cat-filter-section">
        <div class="cat-filter-header">
          <span class="cat-filter-title">${subcats ? 'Categories' : 'Filters'}</span>
          <button class="cat-filter-btn" id="catFilterBtn">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1h16M3 6h10M6 11h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            Filters
          </button>
        </div>

        <!-- Advanced filters (sort + type + expiring) — toggled by Filters btn -->
        <div class="cat-advanced-panel" id="catAdvancedPanel">
          <div class="cat-advanced-row">
            <label>Sort by</label>
            <select id="sortSelect" class="form-select">
              ${CONFIG.sortOptions.map(s => `<option value="${s.id}" ${s.id === this._sort ? 'selected' : ''}>${s.label}</option>`).join('')}
            </select>
          </div>
          <div class="cat-advanced-row">
            <label>Offer type</label>
            <select id="filterType" class="form-select">
              <option value="all">All Types</option>
              <option value="expiring-soon" ${this._filterType === 'expiring-soon' ? 'selected' : ''}>Expiring Soon</option>
              ${CONFIG.offerTypes.map(t => `<option value="${t}" ${t === this._filterType ? 'selected' : ''}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('')}
            </select>
          </div>
        </div>

        ${subcatHTML}
        ${locationHTML}
      </div>
    `;
  },

  _renderCuratedCollections() {
    const collections = (CONFIG.curatedCollections || {})[this._categoryId];
    if (!collections || !collections.length) return '';

    return `
      <section class="curated-section">
        <div class="curated-header">
          <h3 class="curated-title">Curated Collections for you</h3>
          <button class="curated-show-all">Show all</button>
        </div>
        <div class="curated-grid">
          ${collections.map(c => `
            <div class="curated-card" data-collection="${c.id}" style="background-image:url('${c.image}')">
              <div class="curated-card__overlay"></div>
              <div class="curated-card__content">
                <span class="curated-card__count">${c.dealCount} Deals</span>
                <span class="curated-card__label">${c.label}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  _refreshGrid() {
    const grid = $('#offersGrid');
    if (!grid) return;

    if (this._categoryId === 'events') {
      const events = this._getFilteredEvents();
      grid.innerHTML = this._renderEventCardsList(events);
    } else {
      const offers = this._getFilteredOffers();
      grid.innerHTML = this._renderOfferCards(offers);
    }
  },
};

window.CategoryPage = CategoryPage;
