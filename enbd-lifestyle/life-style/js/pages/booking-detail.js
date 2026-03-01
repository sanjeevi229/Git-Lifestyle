// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Booking Detail Page
// ══════════════════════════════════════════════

const BookingDetailPage = {
  render(params) {
    const bookingId = params.id;
    const bookings = Store.get('bookings') || [];
    const booking = bookings.find(b => b.id === bookingId);

    if (!booking) {
      return `
        <div class="page">
          ${Nav.render()}
          <main class="page__main page__main--full">
            <div class="container">
              <div class="empty-state" style="padding-top:80px">
                <div class="empty-state__icon">${Icons.search(48)}</div>
                <h2 class="empty-state__title">Booking Not Found</h2>
                <button class="btn btn--primary" onclick="Router.navigate('/my-bookings')">My Bookings</button>
              </div>
            </div>
          </main>
        </div>
      `;
    }

    // Resolve offer or event
    let title = '', image = '', merchantName = '', location = '', offerDetail = '';
    if (booking.type === 'event') {
      const event = (Store.get('events') || []).find(e => e.id === booking.offerId);
      if (event) {
        title = event.title;
        image = event.image;
        merchantName = event.venue;
        location = event.area;
        offerDetail = `${Format.date(event.date)} · ${Format.timeRange(event.date, event.endDate)}`;
      }
    } else if (booking.type === 'golf') {
      const course = (window.GOLF_COURSES || []).find(c => c.id === booking.offerId);
      if (course) {
        title = course.name + (course.subtitle ? ' — ' + course.subtitle : '');
        image = course.image;
        merchantName = course.name;
        location = course.location;
        offerDetail = `${booking.teeTime || ''} · ${booking.partySize} ${booking.partySize === 1 ? 'Player' : 'Players'}`;
      }
    } else if (booking.type === 'airport') {
      const vehicle = (window.VEHICLE_TYPES || []).find(v => v.id === booking.offerId);
      const airport = (window.AIRPORT_LOCATIONS || []).find(a => a.id === booking.airportId);
      title = `Airport ${booking.transferType === 'pickup' ? 'Pickup' : 'Drop-off'}`;
      image = vehicle ? vehicle.image : '';
      merchantName = vehicle ? vehicle.name + ' — ' + vehicle.description : '';
      location = airport ? airport.name + (booking.terminal ? ' — ' + booking.terminal : '') : '';
      offerDetail = `${booking.bookingTime || ''} · ${booking.partySize} ${booking.partySize === 1 ? 'Passenger' : 'Passengers'}${booking.flightNumber ? ' · Flight ' + booking.flightNumber : ''}`;
    } else if (booking.type === 'courier') {
      const service = (window.COURIER_SERVICE_TYPES || []).find(s => s.id === booking.offerId);
      const courierPkg = (window.COURIER_PACKAGE_TYPES || []).find(p => p.id === booking.packageType);
      const courierPkgName = courierPkg ? courierPkg.name : booking.packageType;
      title = 'Courier Delivery';
      image = service ? service.image : '';
      merchantName = service ? service.name + ' — ' + service.description : '';
      location = `${booking.pickupLocationName || ''} → ${booking.deliveryLocationName || ''}`;
      offerDetail = `${booking.bookingTime || ''} · ${courierPkgName}${booking.estimatedWeight ? ' · ' + booking.estimatedWeight + 'kg' : ''}`;
    } else if (booking.type === 'clubhouse') {
      const clubCat = (window.CLUBHOUSE_CATEGORIES || []).find(c => c.id === booking.offerId);
      const clubVenue = (window.CLUBHOUSE_VENUES || []).find(v => v.id === booking.venueId);
      title = 'Club House — ' + (clubCat ? clubCat.name : '');
      image = clubCat ? clubCat.image : '';
      merchantName = clubVenue ? clubVenue.name : booking.venueName || '';
      location = clubVenue ? clubVenue.area : booking.venueArea || '';
      offerDetail = `${booking.bookingTime || ''} · ${booking.partySize} ${booking.partySize === 1 ? 'Guest' : 'Guests'}`;
    } else {
      const offer = (Store.get('offers') || []).find(o => o.id === booking.offerId);
      if (offer) {
        title = offer.title;
        image = offer.image;
        const merchant = Store.getMerchant(offer.merchantId);
        merchantName = merchant ? merchant.name : '';
        location = merchant ? merchant.location : '';
        offerDetail = `${Format.discountLabel(offer)} · Valid until ${Format.date(offer.validUntil)}`;
      }
    }

    const canCancel = booking.status === 'confirmed';
    const isConfirmed = booking.status === 'confirmed';
    const isCompleted = booking.status === 'completed';
    const showSuccessHero = isConfirmed || isCompleted;
    const heroTitle = isCompleted ? 'Booking Completed' : 'Booking Confirmed';
    const heroIcon = isCompleted ? Icons.checkCircle(32) : Icons.checkCircle(32);
    const guestLabel = booking.type === 'event'
      ? `${booking.partySize} ${booking.partySize === 1 ? 'Ticket' : 'Tickets'}`
      : booking.type === 'golf'
      ? `${booking.partySize} ${booking.partySize === 1 ? 'Player' : 'Players'}`
      : booking.type === 'airport'
      ? `${booking.partySize} ${booking.partySize === 1 ? 'Passenger' : 'Passengers'}`
      : booking.type === 'courier'
      ? '1 Delivery'
      : `${booking.partySize} ${booking.partySize === 1 ? 'Guest' : 'Guests'}`;

    return `
      <div class="page page--no-dark">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="breadcrumb">
              <span class="breadcrumb__item" onclick="Router.navigate('/my-bookings')">My Bookings</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">${booking.id}</span>
            </div>

            ${showSuccessHero ? `
              <div class="booking-detail-success">
                <div class="booking-detail-success__icon">${heroIcon}</div>
                <div class="booking-detail-success__content">
                  <h2 class="booking-detail-success__title">${heroTitle}</h2>
                  <p class="booking-detail-success__meta">${merchantName || title} – ${Format.date(booking.bookingDate)} · ${guestLabel}</p>
                </div>
              </div>
            ` : ''}

            <div class="booking-detail-layout">
              <div class="booking-detail__main">
                <div class="booking-detail__image">
                  ${image ? `<img src="${image}" alt="${title}" />` : ''}
                </div>

                <div class="booking-detail__header">
                  <h1 class="page-title">${title}</h1>
                  <span class="badge badge--${Format.bookingStatusVariant(booking.status)} badge--lg">${Format.bookingStatus(booking.status)}</span>
                </div>

                <div class="booking-detail__info">
                  ${merchantName ? `<div class="booking-detail__row"><span class="text-muted">Venue</span><span>${merchantName}</span></div>` : ''}
                  ${location ? `<div class="booking-detail__row"><span class="text-muted">Location</span><span>${location}</span></div>` : ''}
                  <div class="booking-detail__row"><span class="text-muted">Date</span><span>${Format.date(booking.bookingDate)}</span></div>
                  ${booking.type !== 'courier' ? `<div class="booking-detail__row"><span class="text-muted">${booking.type === 'event' ? 'Tickets' : booking.type === 'golf' ? 'Players' : booking.type === 'airport' ? 'Passengers' : 'Party Size'}</span><span>${booking.partySize}</span></div>` : ''}
                  ${booking.teeTime ? `<div class="booking-detail__row"><span class="text-muted">Tee Time</span><span>${booking.teeTime}</span></div>` : ''}
                  ${booking.transferType ? `<div class="booking-detail__row"><span class="text-muted">Transfer Type</span><span>${booking.transferType === 'pickup' ? 'Airport Pickup' : 'Airport Drop-off'}</span></div>` : ''}
                  ${booking.bookingTime && booking.type === 'airport' ? `<div class="booking-detail__row"><span class="text-muted">Pickup Time</span><span>${booking.bookingTime}</span></div>` : ''}
                  ${booking.flightNumber ? `<div class="booking-detail__row"><span class="text-muted">Flight</span><span>${booking.flightNumber}</span></div>` : ''}
                  ${booking.locationName ? `<div class="booking-detail__row"><span class="text-muted">${booking.transferType === 'pickup' ? 'Drop-off' : 'Pickup'}</span><span>${booking.locationName}</span></div>` : ''}
                  ${booking.bags && booking.type === 'airport' ? `<div class="booking-detail__row"><span class="text-muted">Bags</span><span>${booking.bags}</span></div>` : ''}
                  ${booking.babySeats && parseInt(booking.babySeats) > 0 ? `<div class="booking-detail__row"><span class="text-muted">Baby Seats</span><span>${booking.babySeats}</span></div>` : ''}
                  ${booking.type === 'courier' && booking.packageType ? `<div class="booking-detail__row"><span class="text-muted">Package Type</span><span>${((window.COURIER_PACKAGE_TYPES || []).find(p => p.id === booking.packageType) || {}).name || booking.packageType}</span></div>` : ''}
                  ${booking.type === 'courier' && booking.estimatedWeight ? `<div class="booking-detail__row"><span class="text-muted">Weight</span><span>${booking.estimatedWeight} kg</span></div>` : ''}
                  ${booking.type === 'courier' && booking.pickupLocationName ? `<div class="booking-detail__row"><span class="text-muted">Pickup</span><span>${booking.pickupLocationName}</span></div>` : ''}
                  ${booking.type === 'courier' && booking.deliveryLocationName ? `<div class="booking-detail__row"><span class="text-muted">Delivery</span><span>${booking.deliveryLocationName}</span></div>` : ''}
                  ${booking.type === 'courier' && booking.bookingTime ? `<div class="booking-detail__row"><span class="text-muted">Pickup Time</span><span>${booking.bookingTime}</span></div>` : ''}
                  ${booking.type === 'courier' && booking.recipientName ? `<div class="booking-detail__row"><span class="text-muted">Recipient</span><span>${booking.recipientName}</span></div>` : ''}
                  ${booking.type === 'courier' && booking.recipientPhone ? `<div class="booking-detail__row"><span class="text-muted">Recipient Phone</span><span>${booking.recipientPhone}</span></div>` : ''}
                  ${booking.type === 'courier' && booking.specialHandling ? `<div class="booking-detail__row"><span class="text-muted">Handling</span><span>${booking.specialHandling}</span></div>` : ''}
                  ${booking.type === 'clubhouse' && booking.categoryName ? `<div class="booking-detail__row"><span class="text-muted">Category</span><span>${booking.categoryName}</span></div>` : ''}
                  ${booking.type === 'clubhouse' && booking.venueName ? `<div class="booking-detail__row"><span class="text-muted">Venue</span><span>${booking.venueName}</span></div>` : ''}
                  ${booking.type === 'clubhouse' && booking.venueArea ? `<div class="booking-detail__row"><span class="text-muted">Area</span><span>${booking.venueArea}</span></div>` : ''}
                  ${booking.type === 'clubhouse' && booking.bookingTime ? `<div class="booking-detail__row"><span class="text-muted">Arrival Time</span><span>${booking.bookingTime}</span></div>` : ''}
                  ${booking.type === 'clubhouse' && booking.guestName ? `<div class="booking-detail__row"><span class="text-muted">Guest Name</span><span>${booking.guestName}</span></div>` : ''}
                  ${booking.type === 'clubhouse' && booking.guestPhone ? `<div class="booking-detail__row"><span class="text-muted">Guest Phone</span><span>${booking.guestPhone}</span></div>` : ''}
                  ${booking.type === 'clubhouse' && booking.preferences ? `<div class="booking-detail__row"><span class="text-muted">Preferences</span><span>${booking.preferences}</span></div>` : ''}
                  ${booking.specialRequests ? `<div class="booking-detail__row"><span class="text-muted">Special Requests</span><span>${booking.specialRequests}</span></div>` : ''}
                  <div class="booking-detail__row"><span class="text-muted">Booked On</span><span>${Format.dateTime(booking.createdAt)}</span></div>
                  ${offerDetail ? `<div class="booking-detail__row"><span class="text-muted">Offer</span><span>${offerDetail}</span></div>` : ''}
                </div>

                <div class="booking-detail-reminder">
                  ${Icons.info(14)}
                  <div>
                    <span>Please arrive 10 minutes before your reservation time.</span><br/>
                    <span>Cancellation allowed up to 24 hours in advance.</span>
                  </div>
                </div>
              </div>

              <div class="booking-detail__sidebar">
                <div class="bd-confirmed-header">
                  ${Icons.checkCircle(20)}
                  <span>${heroTitle}</span>
                </div>

                <div class="bd-code-card">
                  <span class="bd-code-card__value">${booking.confirmationCode}</span>
                  <button class="bd-code-card__copy" onclick="event.stopPropagation();navigator.clipboard.writeText('${booking.confirmationCode}')" aria-label="Copy code">
                    ${Icons.copy ? Icons.copy(16) : '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'}
                  </button>
                </div>
                <p class="bd-code-label">Confirmation Code · Show at venue</p>

                <div class="bd-quick-actions">
                  <button class="bd-quick-action" id="getDirectionsBtn">
                    ${Icons.mapPin(18)}
                    <span>Directions</span>
                  </button>
                  <button class="bd-quick-action" id="shareBookingBtn">
                    ${Icons.share(18)}
                    <span>Share</span>
                  </button>
                </div>

                <button class="btn btn--primary btn--lg btn--full" onclick="Router.navigate('/my-bookings')">
                  Back to My Bookings
                </button>
                ${canCancel ? `
                  <button class="bd-cancel-link" id="cancelBookingBtn" data-id="${booking.id}">
                    Cancel Booking
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  },

  mount() {
    Nav.mount();

    delegate('#app', 'click', '#cancelBookingBtn', (e, el) => {
      const id = el.dataset.id;
      if (confirm('Are you sure you want to cancel this booking?')) {
        Store.cancelBooking(id);
        Router.navigate('/my-bookings');
      }
    });

    delegate('#app', 'click', '#getDirectionsBtn', () => {
    });

    delegate('#app', 'click', '#shareBookingBtn', () => {
    });

  },

  unmount() {},
};

window.BookingDetailPage = BookingDetailPage;
