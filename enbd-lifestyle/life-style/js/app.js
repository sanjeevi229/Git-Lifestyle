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

  Router.init();
})();
