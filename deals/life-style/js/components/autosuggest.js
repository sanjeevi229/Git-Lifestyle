// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Auto-Suggest Search Component
// ══════════════════════════════════════════════

const AutoSuggest = {
  _cleanups: [],

  /**
   * Attach auto-suggest to a search input.
   * Creates a fixed-position dropdown that follows the search container.
   */
  attach(inputEl) {
    if (!inputEl) return;

    const dropdown = document.createElement('div');
    dropdown.className = 'autosuggest-dropdown';
    document.body.appendChild(dropdown);

    let debounceTimer = null;

    const getContainerRect = () => {
      const container = inputEl.closest('.hero-search, .cat-hero__search, .sticky-search__inner');
      return (container || inputEl).getBoundingClientRect();
    };

    const positionDropdown = () => {
      const rect = getContainerRect();
      dropdown.style.top = (rect.bottom + 4) + 'px';
      dropdown.style.left = rect.left + 'px';
      dropdown.style.width = rect.width + 'px';
    };

    const onInput = () => {
      clearTimeout(debounceTimer);
      const query = inputEl.value.trim();
      if (query.length < 2) {
        dropdown.classList.remove('open');
        return;
      }
      debounceTimer = setTimeout(() => {
        positionDropdown();
        AutoSuggest._renderResults(query, dropdown);
      }, 250);
    };

    const onFocus = () => {
      if (inputEl.value.trim().length >= 2) {
        positionDropdown();
        AutoSuggest._renderResults(inputEl.value.trim(), dropdown);
      }
    };

    const onBlur = () => {
      setTimeout(() => dropdown.classList.remove('open'), 180);
    };

    const onScroll = () => {
      if (!dropdown.classList.contains('open')) return;
      const rect = getContainerRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        dropdown.classList.remove('open');
        return;
      }
      dropdown.style.top = (rect.bottom + 4) + 'px';
      dropdown.style.left = rect.left + 'px';
      dropdown.style.width = rect.width + 'px';
    };

    inputEl.addEventListener('input', onInput);
    inputEl.addEventListener('focus', onFocus);
    inputEl.addEventListener('blur', onBlur);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Click on dropdown items
    dropdown.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent input blur
      const item = e.target.closest('[data-route]');
      if (item) {
        dropdown.classList.remove('open');
        inputEl.value = '';
        inputEl.blur();
        Router.navigate(item.dataset.route);
      }
    });

    // Touch support for mobile
    dropdown.addEventListener('touchend', (e) => {
      const item = e.target.closest('[data-route]');
      if (item) {
        e.preventDefault();
        dropdown.classList.remove('open');
        inputEl.value = '';
        inputEl.blur();
        Router.navigate(item.dataset.route);
      }
    });

    const cleanup = () => {
      inputEl.removeEventListener('input', onInput);
      inputEl.removeEventListener('focus', onFocus);
      inputEl.removeEventListener('blur', onBlur);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(debounceTimer);
      if (dropdown.parentNode) dropdown.remove();
    };

    this._cleanups.push(cleanup);
    return cleanup;
  },

  /** Remove all active dropdowns (called on page navigation) */
  destroyAll() {
    this._cleanups.forEach(fn => fn());
    this._cleanups = [];
  },

  _renderResults(query, dropdown) {
    const results = Store.searchAll(query);
    const total = results.offers.length + results.events.length + results.merchants.length;

    if (total === 0) {
      const safe = query.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      dropdown.innerHTML = `<div class="autosuggest-empty">No results for "${safe}"</div>`;
      dropdown.classList.add('open');
      return;
    }

    let html = '';

    // Offers (max 4)
    if (results.offers.length) {
      html += '<div class="autosuggest-group"><div class="autosuggest-group__label">Offers</div>';
      results.offers.slice(0, 4).forEach(o => {
        const merchant = Store.getMerchant(o.merchantId);
        html += `
          <div class="autosuggest-item" data-route="/offer/${o.id}">
            <img class="autosuggest-item__img" src="${o.image}" alt="" />
            <div class="autosuggest-item__info">
              <div class="autosuggest-item__title">${o.title}</div>
              <div class="autosuggest-item__sub">${merchant ? merchant.name : ''}</div>
            </div>
            <span class="autosuggest-item__badge">${Format.discountLabel(o)}</span>
          </div>`;
      });
      html += '</div>';
    }

    // Events (max 3)
    if (results.events.length) {
      html += '<div class="autosuggest-group"><div class="autosuggest-group__label">Events</div>';
      results.events.slice(0, 3).forEach(e => {
        html += `
          <div class="autosuggest-item" data-route="/offer/event-${e.id}">
            <img class="autosuggest-item__img" src="${e.image}" alt="" />
            <div class="autosuggest-item__info">
              <div class="autosuggest-item__title">${e.title}</div>
              <div class="autosuggest-item__sub">${e.venue}</div>
            </div>
            <span class="autosuggest-item__badge">AED ${e.price}</span>
          </div>`;
      });
      html += '</div>';
    }

    // Merchants (max 3)
    if (results.merchants.length) {
      html += '<div class="autosuggest-group"><div class="autosuggest-group__label">Restaurants & Venues</div>';
      results.merchants.slice(0, 3).forEach(m => {
        const offers = (Store.get('offers') || []).filter(o => o.merchantId === m.id && o.isActive);
        const bestOffer = offers[0];
        html += `
          <div class="autosuggest-item" data-route="${bestOffer ? '/offer/' + bestOffer.id : '/category/' + m.category}">
            <img class="autosuggest-item__img" src="${m.image}" alt="" />
            <div class="autosuggest-item__info">
              <div class="autosuggest-item__title">${m.name}</div>
              <div class="autosuggest-item__sub">${m.cuisine || m.category} · ${m.area}</div>
            </div>
          </div>`;
      });
      html += '</div>';
    }

    // View all link
    html += `<div class="autosuggest-viewall" data-route="/search?q=${encodeURIComponent(query)}">View all ${total} result${total !== 1 ? 's' : ''} →</div>`;

    dropdown.innerHTML = html;
    dropdown.classList.add('open');
  },
};

window.AutoSuggest = AutoSuggest;
