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
      <div class="page page--no-dark">
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
      } else if (b.type === 'golf') {
        const course = (window.GOLF_COURSES || []).find(c => c.id === b.offerId);
        title = course ? course.name : 'Golf';
        image = course ? course.image : '';
        detail = course ? `${course.location}${b.teeTime ? ' · ' + b.teeTime : ''}` : '';
      } else if (b.type === 'airport') {
        const vehicle = (window.VEHICLE_TYPES || []).find(v => v.id === b.offerId);
        const airport = (window.AIRPORT_LOCATIONS || []).find(a => a.id === b.airportId);
        title = vehicle ? `Airport ${b.transferType === 'pickup' ? 'Pickup' : 'Drop-off'} — ${vehicle.name}` : 'Airport Transfer';
        image = vehicle ? vehicle.image : '';
        detail = airport ? `${airport.name}${b.bookingTime ? ' · ' + b.bookingTime : ''}` : '';
      } else if (b.type === 'courier') {
        const service = (window.COURIER_SERVICE_TYPES || []).find(s => s.id === b.offerId);
        title = service ? `Courier — ${service.name}` : 'Courier Delivery';
        image = service ? service.image : '';
        detail = `${b.pickupLocationName || ''} → ${b.deliveryLocationName || ''}${b.bookingTime ? ' · ' + b.bookingTime : ''}`;
      } else if (b.type === 'clubhouse') {
        const clubCat = (window.CLUBHOUSE_CATEGORIES || []).find(c => c.id === b.offerId);
        title = clubCat ? `Club — ${clubCat.name}` : 'Club House';
        image = clubCat ? clubCat.image : '';
        detail = `${b.venueName || ''}${b.bookingTime ? ' · ' + b.bookingTime : ''}`;
      } else {
        const offer = (Store.get('offers') || []).find(o => o.id === b.offerId);
        title = offer ? offer.title : 'Offer';
        image = offer ? offer.image : '';
        const merchant = offer ? Store.getMerchant(offer.merchantId) : null;
        detail = merchant ? merchant.name : '';
      }

      return `
        <div class="booking-card" onclick="Router.navigate('/my-bookings/${b.id}')">
          <div class="booking-card__img">
            ${image ? `<img src="${image}" alt="${title}" loading="lazy" />` : ''}
          </div>
          <div class="booking-card__body">
            <div class="booking-card__top">
              <div class="booking-card__title">${title}</div>
              <span class="booking-card__status booking-card__status--${Format.bookingStatusVariant(b.status)}">${Format.bookingStatus(b.status)}</span>
            </div>
            ${detail ? `<div class="booking-card__detail">${detail}</div>` : ''}
            <div class="booking-card__meta">
              ${Icons.calendar(13)} ${Format.date(b.bookingDate)} · ${b.type === 'courier' ? '1 delivery' : `${b.partySize} ${b.type === 'event' ? 'ticket' : b.type === 'golf' ? 'player' : b.type === 'airport' ? 'passenger' : 'guest'}${b.partySize > 1 ? 's' : ''}`}
            </div>
            <div class="booking-card__code">${b.confirmationCode}</div>
          </div>
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
