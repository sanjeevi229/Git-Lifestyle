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
    const guestLabel = booking.type === 'event'
      ? `${booking.partySize} ${booking.partySize === 1 ? 'Ticket' : 'Tickets'}`
      : `${booking.partySize} ${booking.partySize === 1 ? 'Guest' : 'Guests'}`;

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="breadcrumb">
              <span class="breadcrumb__item" onclick="Router.navigate('/my-bookings')">My Bookings</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">${booking.id}</span>
            </div>

            ${isConfirmed ? `
              <div class="booking-detail-success">
                <div class="booking-detail-success__icon">${Icons.checkCircle(32)}</div>
                <div class="booking-detail-success__content">
                  <h2 class="booking-detail-success__title">Booking Confirmed</h2>
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
                  <div class="booking-detail__row"><span class="text-muted">${booking.type === 'event' ? 'Tickets' : 'Party Size'}</span><span>${booking.partySize}</span></div>
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
                <div class="confirmation-code">${booking.confirmationCode}</div>
                <p class="text-sm text-muted text-center" style="margin-top:8px">Confirmation Code</p>
                <p class="text-xs text-muted text-center" style="margin-top:4px">Show this at the venue</p>

                <div class="booking-detail-actions">
                  <button class="btn btn--ghost btn--lg btn--full" id="getDirectionsBtn">${Icons.mapPin(16)} Directions</button>
                  <button class="btn btn--ghost btn--lg btn--full" id="shareBookingBtn">${Icons.share(16)} Share</button>
                  <button class="btn btn--primary btn--lg btn--full" onclick="Router.navigate('/my-bookings')">
                    Back to My Bookings
                  </button>
                  ${canCancel ? `
                    <button class="btn btn--ghost btn--lg btn--full booking-detail-cancel" id="cancelBookingBtn" data-id="${booking.id}">
                      Cancel Booking
                    </button>
                  ` : ''}
                </div>
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
        Toast.show('Booking Cancelled', 'Your booking has been cancelled.', 'info');
        Router.navigate('/my-bookings');
      }
    });

    delegate('#app', 'click', '#getDirectionsBtn', () => {
      Toast.show('Opening Maps', 'Directions will open in your maps app.', 'info');
    });

    delegate('#app', 'click', '#shareBookingBtn', () => {
      Toast.show('Link Copied', 'Booking link has been copied to clipboard.', 'success');
    });

  },

  unmount() {},
};

window.BookingDetailPage = BookingDetailPage;
