// ══════════════════════════════════════════════
// DEMO LIFESTYLE — App Bootstrap
// ══════════════════════════════════════════════

(function () {
  Store.init();

  // Auto-login as Infinite card holder
  Auth.login('USR-004');

  // Register routes
  Router.register('/home',              HomePage);
  Router.register('/category/:id',      CategoryPage);
  Router.register('/offer/:id',         OfferDetailPage);
  Router.register('/booking/:offerId',  BookingPage);
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
  Router.register('/club',              ClubPage);
  Router.register('/club/register',     ClubRegistrationPage);

  Router.init();
})();
