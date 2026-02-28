// ══════════════════════════════════════════════
// DEMO LIFESTYLE — My Bookings Page
// ══════════════════════════════════════════════

const MyBookingsPage = {
  _activeTab: 'all',

  render() {
    this._activeTab = 'all';
    const bookings = Store.getUserBookings();
    const tabs = [
      { id: 'all', label: 'All', count: bookings.length },
      { id: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
      { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
      { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
    ];

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="bookings-page__header">
              <a class="back-link" onclick="Router.navigate('/home')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
                Back to Home
              </a>
              <h1 class="page-title">My Bookings</h1>
            </div>

            <div class="tabs" id="bookingTabs">
              ${tabs.map(t => `
                <button class="tab ${t.id === this._activeTab ? 'tab--active' : ''}" data-tab="${t.id}">
                  ${t.label} <span class="tab__count">${t.count}</span>
                </button>
              `).join('')}
            </div>

            <div class="bookings-list" id="bookingsList">
              ${this._renderBookings(bookings)}
            </div>
          </div>
        </main>
      </div>
    `;
  },

  mount() {
    Nav.mount();

    delegate('#app', 'click', '.tab', (e, el) => {
      this._activeTab = el.dataset.tab;
      $$('.tab').forEach(t => t.classList.toggle('tab--active', t.dataset.tab === this._activeTab));
      this._refreshList();
    });
  },

  unmount() {},

  _getFilteredBookings() {
    const bookings = Store.getUserBookings();
    if (this._activeTab === 'all') return bookings;
    return bookings.filter(b => b.status === this._activeTab);
  },

  _renderBookings(bookings) {
    if (bookings.length === 0) {
      return `
        <div class="empty-state" style="padding:60px 0">
          <div class="empty-state__icon">${Icons.clipboard(48)}</div>
          <h2 class="empty-state__title">No bookings yet</h2>
          <p class="empty-state__text">Explore our offers and make your first booking!</p>
          <button class="btn btn--primary" onclick="Router.navigate('/home')">Explore Offers</button>
        </div>
      `;
    }

    return bookings.map(b => {
      // Resolve offer or event
      let title = '', image = '', detail = '';
      if (b.type === 'event') {
        const event = (Store.get('events') || []).find(e => e.id === b.offerId);
        title = event ? event.title : 'Event';
        image = event ? event.image : '';
        detail = event ? `${event.venue} · ${event.area}` : '';
      } else {
        const offer = (Store.get('offers') || []).find(o => o.id === b.offerId);
        title = offer ? offer.title : 'Offer';
        image = offer ? offer.image : '';
        const merchant = offer ? Store.getMerchant(offer.merchantId) : null;
        detail = merchant ? merchant.name : '';
      }

      return `
        <div class="booking-row" onclick="Router.navigate('/my-bookings/${b.id}')">
          <div class="booking-row__image">
            ${image ? `<img src="${image}" alt="${title}" loading="lazy" />` : '<div style="background:var(--light);width:100%;height:100%;display:grid;place-items:center">${Icons.clipboard(28)}</div>'}
          </div>
          <div class="booking-row__content">
            <div class="booking-row__title">${title}</div>
            <div class="booking-row__detail">${detail}</div>
            <div class="booking-row__meta">
              ${Icons.calendar(14)} ${Format.date(b.bookingDate)} · ${b.partySize} ${b.type === 'event' ? 'ticket' : 'guest'}${b.partySize > 1 ? 's' : ''}
            </div>
          </div>
          <div class="booking-row__status">
            <span class="badge badge--${Format.bookingStatusVariant(b.status)}">${Format.bookingStatus(b.status)}</span>
          </div>
          <div class="booking-row__code text-xs text-muted">${b.confirmationCode}</div>
        </div>
      `;
    }).join('');
  },

  _refreshList() {
    const list = $('#bookingsList');
    if (list) {
      list.innerHTML = this._renderBookings(this._getFilteredBookings());
    }
  },
};

window.MyBookingsPage = MyBookingsPage;
