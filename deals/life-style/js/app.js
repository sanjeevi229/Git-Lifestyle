// ══════════════════════════════════════════════
// DEMO LIFESTYLE — App Bootstrap
// ══════════════════════════════════════════════

(function () {
  // ── Access Gate ──
  // Require ?access=explore1.1 query parameter to view the site.
  // Once validated, store in sessionStorage so hash navigations still work.
  const params = new URLSearchParams(window.location.search);
  const accessKey = params.get('access');
  const VALID_KEY = 'explore1.1';

  if (accessKey === VALID_KEY) {
    sessionStorage.setItem('_demo_access', VALID_KEY);
  }

  if (sessionStorage.getItem('_demo_access') !== VALID_KEY) {
    document.getElementById('app').innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:40px 20px;text-align:center;font-family:'Plus Jakarta Sans',sans-serif;">
        <div style="font-size:72px;font-weight:800;color:#1B2B4B;line-height:1;">404</div>
        <h1 style="font-size:22px;font-weight:700;color:#1B2B4B;margin:16px 0 8px;">Page Not Found</h1>
        <p style="font-size:14px;color:#6B6B6B;max-width:360px;">The page you're looking for doesn't exist or you don't have permission to access it.</p>
      </div>
    `;
    return; // Stop — don't initialise the app
  }

  Store.init();

  // Auto-login as Infinite card holder
  Auth.login('USR-004');

  // Register routes
  Router.register('/home',              HomePage);
  Router.register('/category/:id',      CategoryPage);
  Router.register('/offer/:id',         OfferDetailPage);
  Router.register('/book-dining/:offerId',  BookingPage);
  Router.register('/book-entertainment/:offerId', EntertainmentBookingPage);
  Router.register('/book-hotel/:offerId',         HotelBookingPage);
  Router.register('/book-flight/:offerId',       FlightBookingPage);
  Router.register('/book-shopping/:offerId',     ShoppingBookingPage);
  Router.register('/my-bookings',       MyBookingsPage);
  Router.register('/my-bookings/:id',   BookingDetailPage);
  Router.register('/card-benefits',     CardBenefitsPage);
  Router.register('/search',            SearchResultsPage);
  Router.register('/golf',              GolfPage);
  Router.register('/golf/book/:courseId', GolfBookingPage);
  Router.register('/golf/:courseId',    GolfDetailPage);
  Router.register('/airport',           AirportPage);
  Router.register('/airport/book',      AirportBookingPage);
  Router.register('/courier',           CourierPage);
  Router.register('/courier/book',      CourierBookingPage);
  Router.register('/concierge',         ConciergePage);
  Router.register('/concierge/book',    ConciergeBookingPage);
  Router.register('/gift-cards',          GiftCardsPage);
  Router.register('/plus-points',         PlusPointsPage);
  Router.register('/rewards',            RewardsPage);
  Router.register('/rewards/:id',       RewardDetailPage);
  Router.register('/club',              ClubPage);
  Router.register('/club/register',     ClubRegistrationPage);

  Router.init();

  // Chatbot — global concierge assistant (clear history on refresh for prototype)
  Store.set('chatHistory', null);
  Chatbot.init();
})();
