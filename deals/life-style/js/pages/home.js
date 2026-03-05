// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Homepage
// ══════════════════════════════════════════════

const HomePage = {
  _heroInterval: null,
  _activeSlide: 0,
  _onScroll: null,
  _scrollRAF: null,

  render() {
    const user = Auth.getCurrentUser();
    const tierConfig = CONFIG.cardTiers[user.cardTier];
    const firstName = user.name.split(' ')[0];
    const isMobile = window.innerWidth <= 600;

    // Hero slides — cinematic video backgrounds with personalized titles
    const slides = CONFIG.heroSlides.map((s, i) => {
      const personalizedTitle = s.title.replace('{firstName}', firstName);
      const videoSrc = isMobile ? (s.videoSD || s.video) : (s.video || '');

      return `
        <div class="hero__slide ${i === 0 ? 'active' : ''}" data-slide-index="${i}" onclick="Router.navigate('${s.route}')">
          ${videoSrc ? `
            <video class="hero__video"
              src="${videoSrc}"
              poster="${s.image}"
              muted loop playsinline
              preload="${i === 0 ? 'auto' : 'none'}"
              aria-hidden="true"></video>
          ` : ''}
          ${!videoSrc ? `<img class="hero__bg-img" src="${s.image}" alt="" aria-hidden="true" />` : ''}
          <div class="hero__overlay"></div>
          <div class="hero__content">
            ${s.limitedTag ? `<span class="hero__limited-tag">${s.limitedTag}</span>` : ''}
            <h1 class="hero__title">${personalizedTitle}</h1>
            <p class="hero__subtitle">${s.subtitle}</p>
            <button class="hero__cta" onclick="event.stopPropagation(); Router.navigate('${s.route}')">
              ${s.cta}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    const dots = CONFIG.heroSlides.map((s, i) => `
      <span class="hero__dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></span>
    `).join('');

    // Category grid
    const categories = CONFIG.categories.map(c => `
      <div class="category-tile" onclick="Router.navigate('/category/${c.id}')" style="--tile-color:${c.color}">
        <div class="category-tile__icon">${c.iconImg ? `<img src="${c.iconImg}" alt="${c.label}" />` : c.icon}</div>
        <div class="category-tile__label">${c.label}</div>
      </div>
    `).join('');

    // Premium Rewards carousel
    const featuredOffers = Store.getFeaturedOffers();
    const premiumCards = featuredOffers.map(o => {
      const merchant = Store.getMerchant(o.merchantId);
      return `
        <div class="offer-card" onclick="Router.navigate('/offer/${o.id}')">
          <div class="offer-card__image card-hover-zone">
            <img src="${o.image}" alt="${o.title}" loading="lazy" />
            <span class="discount-badge ${Format.discountBadgeClass(o)}">${Format.discountLabel(o)}</span>
            <button class="card-share-btn" onclick="event.stopPropagation();cardShare('${o.title.replace(/'/g, "\\'")}','/offer/${o.id}')" aria-label="Share">${Icons.share(15)}</button>
            <div class="card-hover-zone__overlay">
              ${merchant && merchant.location ? `<span class="card-hover-zone__location">${Icons.mapPin(14)} ${merchant.location}</span>` : ''}
              <button class="card-hover-zone__cta" onclick="event.stopPropagation(); Router.navigate('/offer/${o.id}')">Book Now</button>
            </div>
          </div>
          <div class="offer-card__content">
            <div class="offer-card__title">${o.title}</div>
            <div class="offer-card__merchant">${merchant ? merchant.name : ''}</div>
            <div class="offer-card__footer">
              <span class="badge badge--${Format.bookingStatusVariant('confirmed')}">${Format.categoryLabel(o.category)}</span>
              <span class="text-xs text-muted">${Format.daysUntil(o.validUntil)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Unravel hotel deals — curated luxury destinations
    const unravelDeals = [
      { title: 'Safari Adventure', location: 'Serengeti, Tanzania', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=900&fit=crop', offerId: 'OFR-033' },
      { title: 'Alpine Escape – Four Seasons', location: 'Swiss Alps, Switzerland', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=900&fit=crop', offerId: 'OFR-040' },
      { title: 'Desert Luxury – Burj Al Arab', location: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=900&fit=crop', offerId: 'OFR-041' },
      { title: 'Tropical Retreat – Anantara', location: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=900&fit=crop', offerId: 'OFR-043' },
      { title: 'Beachfront Bliss – Address Resort', location: 'JBR, Dubai', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=900&fit=crop', offerId: 'OFR-042' },
      { title: 'Coastal Serenity – The Palm', location: 'Palm Jumeirah, Dubai', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=900&fit=crop', offerId: 'OFR-022' },
      { title: 'Riviera Romance', location: 'Amalfi Coast, Italy', image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&h=900&fit=crop', offerId: 'OFR-044' },
      { title: 'Spicy Seafood – The Atlantis Paradise Island', location: 'Bora Bora, French Polynesia', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=900&fit=crop', offerId: 'OFR-020' },
    ];
    const unravelCards = unravelDeals.map(d => `
      <div class="unravel-card" onclick="Router.navigate('/offer/${d.offerId}')">
        <img class="unravel-card__img" src="${d.image}" alt="${d.title}" loading="lazy" />
        <button class="card-share-btn" onclick="event.stopPropagation();cardShare('${d.title.replace(/'/g, "\\'")}','/offer/${d.offerId}')" aria-label="Share">${Icons.share(15)}</button>
        <div class="unravel-card__info">
          <div class="unravel-card__title">${d.title}</div>
          <div class="unravel-card__location">${d.location}</div>
        </div>
      </div>
    `).join('');

    // Card Benefits icons
    const benefitIcons = CONFIG.cardBenefitIcons.map(b => `
      <div class="benefit-icon-card" onclick="Router.navigate('${b.id === 'golf' ? '/golf' : b.id === 'airport' ? '/airport' : b.id === 'courier' ? '/courier' : b.id === 'club' ? '/club' : '/card-benefits'}')">
        <div class="benefit-icon-card__icon">${b.iconImg ? `<img src="${b.iconImg}" alt="${b.label}" />` : b.icon}</div>
        <div class="benefit-icon-card__label">${b.label}</div>
      </div>
    `).join('');

    // Events carousel
    const events = Store.getUpcomingEvents();
    const eventCards = events.map(e => {
      const spotsLeft = e.capacity - e.bookedCount;
      return `
        <div class="event-card" onclick="Router.navigate('/offer/event-${e.id}')">
          <div class="event-card__image card-hover-zone">
            <img src="${e.image}" alt="${e.title}" loading="lazy" />
            ${Format.eventDateBadge(e.date)}
            ${e.originalPrice > e.price ? `<span class="discount-badge discount-badge--red">${Math.round((1 - e.price / e.originalPrice) * 100)}% OFF</span>` : ''}
            <button class="card-share-btn" onclick="event.stopPropagation();cardShare('${e.title.replace(/'/g, "\\'")}','/offer/event-${e.id}')" aria-label="Share">${Icons.share(15)}</button>
            <div class="card-hover-zone__overlay">
              <span class="card-hover-zone__location">${Icons.mapPin(14)} ${e.venue}</span>
              <button class="card-hover-zone__cta" onclick="event.stopPropagation(); Router.navigate('/offer/event-${e.id}')">Book Now</button>
            </div>
          </div>
          <div class="event-card__content">
            <div class="event-card__title">${e.title}</div>
            <div class="event-card__venue">${e.venue} · ${e.area}</div>
            <div class="event-card__footer">
              <span class="text-semibold">AED ${e.price}</span>
              ${e.originalPrice > e.price ? `<span class="text-xs text-muted" style="text-decoration:line-through">AED ${e.originalPrice}</span>` : ''}
              <span class="text-xs" style="margin-left:auto">${Format.spotsLeft(e.capacity, e.bookedCount)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Last Chance deals — swipeable individual cards inside banner
    const expiringOffers = Store.getExpiringOffers(60);
    const lastChanceSlides = expiringOffers.map(o => {
      const merchant = Store.getMerchant(o.merchantId);
      return `
        <div class="lc-slide" onclick="event.stopPropagation(); Router.navigate('/offer/${o.id}')">
          <div class="lc-slide__img">
            <img src="${o.image}" alt="${o.title}" loading="lazy" />
          </div>
          <span class="lc-slide__badge">${Format.discountLabel(o)}</span>
          <div class="lc-slide__info">
            <div class="lc-slide__title">${o.title}</div>
            <div class="lc-slide__merchant">${merchant ? merchant.name : ''}</div>
          </div>
        </div>
      `;
    }).join('');

    // Restaurants carousel
    const diningMerchants = Store.getDiningMerchants();
    const restaurantCards = diningMerchants.map(m => {
      // Get best offer for this merchant
      const offers = (Store.get('offers') || []).filter(o => o.merchantId === m.id && o.isActive);
      const bestOffer = offers[0];
      return `
        <div class="merchant-card" onclick="${bestOffer ? `Router.navigate('/offer/${bestOffer.id}')` : `Router.navigate('/category/dining')`}">
          <div class="merchant-card__image card-hover-zone">
            <img src="${m.image}" alt="${m.name}" loading="lazy" />
            ${bestOffer ? `<span class="discount-badge ${Format.discountBadgeClass(bestOffer)}">${Format.discountLabel(bestOffer)}</span>` : ''}
            <span class="merchant-card__rating-badge">${Icons.star(12)} ${Number(m.rating).toFixed(1)}</span>
            <button class="card-share-btn" onclick="event.stopPropagation();cardShare('${m.name.replace(/'/g, "\\'")}','${bestOffer ? `/offer/${bestOffer.id}` : `/category/dining`}')" aria-label="Share">${Icons.share(15)}</button>
            <div class="card-hover-zone__overlay">
              <span class="card-hover-zone__location">${Icons.mapPin(14)} ${m.area}</span>
              <button class="card-hover-zone__cta" onclick="event.stopPropagation(); ${bestOffer ? `Router.navigate('/offer/${bestOffer.id}')` : `Router.navigate('/category/dining')`}">Book Now</button>
            </div>
          </div>
          <div class="merchant-card__content">
            <div class="merchant-card__name">${m.name}</div>
            <div class="merchant-card__cuisine">${m.cuisine} · ${m.area}</div>
            <div class="merchant-card__footer">
              <span class="text-muted text-xs">${m.priceRange}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <!-- Hero -->
          <div class="hero-clip">
            <section class="hero" id="heroCarousel">
              <div class="hero__slides">${slides}</div>
              <div class="hero-search">
                <svg class="hero-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input id="heroSearchInput" type="text" placeholder="Search offers, restaurants, events..." />
                <button onclick="HomePage._doSearch()" aria-label="Search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
              <div class="hero__dots">${dots}</div>
            </section>
          </div>

          <!-- Categories inside container -->
          <div class="container">
            <div class="home-section" style="padding-top:var(--space-xl)">
              <div class="category-grid">${categories}</div>
            </div>
          </div>

          <!-- Unravel Hotel Deals — hero-style carousel with beach background -->
          <section class="unravel-section">
            <div class="unravel-section__bg"></div>
            <div class="unravel-section__content">
              <div class="unravel-header">
                <div>
                  <h2 class="unravel-header__title">Deals for you by Unravel</h2>
                  <p class="unravel-header__subtitle">Indulge in romantic dinners and sweet treats.</p>
                </div>
                <button class="btn btn--ghost btn--sm" onclick="Router.navigate('/category/hotels')">Show all</button>
              </div>
              <div class="unravel-track-wrap">
                <div class="unravel-track" id="unravel-track">
                  ${unravelCards}
                </div>
              </div>
              <div class="unravel-dots" id="unravel-dots"></div>
            </div>
          </section>

          <!-- Premium Rewards carousel — outside container, manages its own padding -->
          ${featuredOffers.length ? `
            <div class="pr-bg-wrap">
              ${Carousel.render('premium-rewards', 'Premium Rewards', premiumCards, { subtitle: 'Exclusive offers for you' })}
              <div class="pr-deco" aria-hidden="true">
                <!-- Purple gift box — top-right -->
                <svg class="pr-gift pr-gift--1" viewBox="0 0 64 64"><rect x="10" y="30" width="44" height="28" rx="4" fill="#CB8BD9"/><rect x="10" y="30" width="44" height="28" rx="4" fill="url(#gB1)" opacity=".3"/><rect x="6" y="24" width="52" height="10" rx="4" fill="#D9A3E5"/><rect x="28" y="24" width="8" height="34" rx="1" fill="#fff" opacity=".65"/><path d="M32 24c-6-12-18-9-14-3s14 3 14 3z" fill="#A864B8" opacity=".85"/><path d="M32 24c6-12 18-9 14-3s-14 3-14 3z" fill="#A864B8" opacity=".85"/><ellipse cx="32" cy="22" rx="5" ry="3" fill="#D9A3E5"/><defs><linearGradient id="gB1" x1="10" y1="30" x2="54" y2="58"><stop stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient></defs></svg>
                <!-- Light blue gift box — bottom-right -->
                <svg class="pr-gift pr-gift--3" viewBox="0 0 64 64"><rect x="12" y="30" width="40" height="26" rx="4" fill="#5B8CFF"/><rect x="12" y="30" width="40" height="26" rx="4" fill="url(#gLB1)" opacity=".35"/><rect x="8" y="24" width="48" height="10" rx="4" fill="#7BA6FF"/><rect x="29" y="24" width="6" height="32" rx="1" fill="#FFFFFF" opacity=".7"/><path d="M32 24c-5-11-16-8-13-3s13 3 13 3z" fill="#FFFFFF" opacity=".8"/><path d="M32 24c5-11 16-8 13-3s-13 3-13 3z" fill="#FFFFFF" opacity=".8"/><ellipse cx="32" cy="22" rx="4.5" ry="2.5" fill="#fff" opacity=".9"/><defs><linearGradient id="gLB1" x1="12" y1="30" x2="52" y2="56"><stop stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient></defs></svg>
                <!-- Small navy gift — mid-right -->
                <svg class="pr-gift pr-gift--5" viewBox="0 0 64 64"><rect x="14" y="32" width="36" height="24" rx="4" fill="#0A3260"/><rect x="14" y="32" width="36" height="24" rx="4" fill="url(#gDN1)" opacity=".3"/><rect x="10" y="26" width="44" height="9" rx="4" fill="#0E3D7A"/><rect x="29" y="26" width="6" height="30" rx="1" fill="#C0D0E8" opacity=".7"/><path d="M32 26c-5-10-14-8-11-3s11 3 11 3z" fill="#C0D0E8" opacity=".8"/><path d="M32 26c5-10 14-8 11-3s-11 3-11 3z" fill="#C0D0E8" opacity=".8"/><defs><linearGradient id="gDN1" x1="14" y1="32" x2="50" y2="56"><stop stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#000" stop-opacity=".1"/></linearGradient></defs></svg>
                <!-- Sparkle stars — right side only -->
                <span class="pr-star pr-star--2">✦</span>
                <span class="pr-star pr-star--4">✦</span>
                <span class="pr-star pr-star--6">✦</span>
                <span class="pr-star pr-star--7">✧</span>
                <span class="pr-star pr-star--8">✧</span>
              </div>
            </div>
          ` : ''}

          <!-- Card Benefits inside container -->
          <div class="container">
            <div class="home-section" style="padding-top:0">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px">
                <div>
                  <h2 class="carousel-header__title">Get the most out of your card</h2>
                  <p class="carousel-header__subtitle">Explore benefits included with your ${tierConfig.label} Card</p>
                </div>
                <button class="btn btn--ghost btn--sm" style="margin-top:4px;flex-shrink:0" onclick="Router.navigate('/card-benefits')">Show All</button>
              </div>
              <div class="benefits-scroll-wrapper">
                <div class="benefits-grid" id="benefitsGrid">${benefitIcons}</div>
                <button class="benefits-scroll-arrow" id="benefitsArrow" onclick="HomePage._scrollBenefits()" aria-label="Scroll right">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--charcoal)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Upcoming Events carousel — with background -->
          ${events.length ? `
            <div class="events-bg-wrap">
              <div class="events-bg-wrap__img"></div>
              ${Carousel.render('upcoming-events', 'Upcoming Events', eventCards, { subtitle: 'Don\'t miss out', showViewAll: true, viewAllRoute: '/category/events' })}
            </div>
          ` : ''}

          <!-- Last Chance Deals — banner with swipeable cards -->
          ${expiringOffers.length ? `
            <div class="container">
              <div class="lc-banner">
                <div class="lc-banner__bg"></div>
                <div class="lc-banner__overlay"></div>
                <div class="lc-banner__header">
                  <div class="lc-banner__text">
                    <h2 class="lc-banner__title">Last chance</h2>
                    <p class="lc-banner__subtitle">Steal these deals</p>
                  </div>
                  <div class="lc-banner__tag">
                    🔥 ${expiringOffers.length} Deal${expiringOffers.length !== 1 ? 's' : ''} Ending Soon
                  </div>
                </div>
                <div class="lc-track" id="lc-track">
                  ${lastChanceSlides}
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Restaurants Near You carousel — with dining background -->
          ${diningMerchants.length ? `
            <div class="rest-bg-wrap">
              <div class="rest-bg-wrap__img"></div>
              ${Carousel.render('restaurants', 'Restaurants Near You', restaurantCards, { subtitle: 'Top dining spots with exclusive offers', showViewAll: true, viewAllRoute: '/category/dining' })}
            </div>
          ` : ''}

          <!-- Footer -->
          <footer class="site-footer">
            <div class="site-footer__inner">
              <div class="site-footer__brand">
                <p class="site-footer__tagline">Your card. Your lifestyle.<br>Exclusive privileges for Demo cardholders.</p>
              </div>
              <div class="site-footer__links">
                <div class="site-footer__col">
                  <h4 class="site-footer__heading">Explore</h4>
                  <a onclick="Router.navigate('/category/dining')">Dining</a>
                  <a onclick="Router.navigate('/category/entertainment')">Entertainment</a>
                  <a onclick="Router.navigate('/category/travel')">Travel</a>
                  <a onclick="Router.navigate('/category/shopping')">Shopping</a>
                </div>
                <div class="site-footer__col">
                  <h4 class="site-footer__heading">Account</h4>
                  <a onclick="Router.navigate('/my-bookings')">My Bookings</a>
                  <a onclick="Router.navigate('/card-benefits')">Card Benefits</a>
                  <a onclick="Router.navigate('/category/events')">Events</a>
                  <a onclick="Router.navigate('/category/promotions')">Promotions</a>
                </div>
                <div class="site-footer__col">
                  <h4 class="site-footer__heading">Support</h4>
                  <a>Help Centre</a>
                  <a>Contact Us</a>
                  <a>Terms & Conditions</a>
                  <a>Privacy Policy</a>
                </div>
              </div>
              <div class="site-footer__app">
                <h4 class="site-footer__heading">Get the App</h4>
                <p class="site-footer__app-text">Manage your lifestyle on the go</p>
                <div class="site-footer__badges">
                  <div class="site-footer__store-badge">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                    App Store
                  </div>
                  <div class="site-footer__store-badge">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/></svg>
                    Google Play
                  </div>
                </div>
              </div>
            </div>
            <div class="site-footer__bottom">
              <p>&copy; ${new Date().getFullYear()} Demo. All rights reserved.</p>
            </div>
          </footer>
        </main>
      </div>
    `;
  },

  mount() {
    Nav.mount();
    Carousel.mountAll();
    this._mountUnravelDots();
    this._startHeroAutoplay();

    // Reset Last Chance track scroll (prevent snap from jumping past padding)
    const lcTrack = $('#lc-track');
    if (lcTrack) lcTrack.scrollLeft = 0;

    // Hero dots
    delegate('#app', 'click', '.hero__dot', (e, el) => {
      this._goToSlide(Number(el.dataset.slide));
    });

    // Hero search
    const heroInput = $('#heroSearchInput');
    if (heroInput) {
      heroInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._doSearch();
      });
    }

    // Benefits scroll arrow visibility (defer to ensure layout is complete)
    requestAnimationFrame(() => this._updateBenefitsArrow());
    const benefitsGrid = $('#benefitsGrid');
    if (benefitsGrid) {
      this._onBenefitsScroll = () => this._updateBenefitsArrow();
      benefitsGrid.addEventListener('scroll', this._onBenefitsScroll, { passive: true });
    }

    // Play first slide video
    this._playActiveVideo();

    // Video error handling
    $$('.hero__video').forEach(video => {
      video.addEventListener('error', () => {
        video.style.display = 'none';
      });
    });

    // Parallax scroll effect (desktop only)
    if (window.innerWidth > 600) {
      this._scrollRAF = null;
      this._onScroll = () => {
        if (this._scrollRAF) return;
        this._scrollRAF = requestAnimationFrame(() => {
          const hero = $('#heroCarousel');
          if (!hero) { this._scrollRAF = null; return; }
          const scrollY = window.scrollY;
          const heroHeight = hero.offsetHeight;
          if (scrollY <= heroHeight) {
            const parallaxOffset = scrollY * 0.4;
            const opacity = 1 - (scrollY / heroHeight) * 0.3;
            hero.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
            hero.style.opacity = opacity;
          }
          this._scrollRAF = null;
        });
      };
      window.addEventListener('scroll', this._onScroll, { passive: true });
    }

    // Mobile: reveal overlay when card scrolls into view
    if (window.innerWidth <= 900 && 'IntersectionObserver' in window) {
      this._cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
      }, { threshold: 0.3 });
      $$('.card-hover-zone').forEach(zone => this._cardObserver.observe(zone));
    }
  },

  unmount() {
    this._stopHeroAutoplay();

    // Clean up parallax
    if (this._onScroll) {
      window.removeEventListener('scroll', this._onScroll);
      this._onScroll = null;
    }
    if (this._scrollRAF) {
      cancelAnimationFrame(this._scrollRAF);
      this._scrollRAF = null;
    }

    // Clean up benefits scroll
    if (this._onBenefitsScroll) {
      const bg = $('#benefitsGrid');
      if (bg) bg.removeEventListener('scroll', this._onBenefitsScroll);
      this._onBenefitsScroll = null;
    }
    // Clean up mobile scroll observer
    if (this._cardObserver) {
      this._cardObserver.disconnect();
      this._cardObserver = null;
    }

    // Pause and release all hero videos
    $$('.hero__video').forEach(v => {
      v.pause();
      v.removeAttribute('src');
      v.load();
    });
  },

  _mountUnravelDots() {
    const track = $('#unravel-track');
    const dotsWrap = $('#unravel-dots');
    if (!track || !dotsWrap) return;

    const cards = track.querySelectorAll('.unravel-card');
    const total = cards.length;
    if (total === 0) return;

    // Build dots
    dotsWrap.innerHTML = Array.from({ length: total }, (_, i) =>
      `<span class="unravel-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>`
    ).join('');

    // Update active dot on scroll
    const updateDots = () => {
      const cardW = cards[0].offsetWidth + 16; // gap 16
      const idx = Math.round(track.scrollLeft / cardW);
      dotsWrap.querySelectorAll('.unravel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    };
    track.addEventListener('scroll', updateDots, { passive: true });

    // Click dot → scroll to card
    dotsWrap.addEventListener('click', (e) => {
      const dot = e.target.closest('.unravel-dot');
      if (!dot) return;
      const idx = Number(dot.dataset.idx);
      const cardW = cards[0].offsetWidth + 16;
      track.scrollTo({ left: idx * cardW, behavior: 'smooth' });
    });
  },

  _startHeroAutoplay() {
    this._heroInterval = setInterval(() => {
      this._activeSlide = (this._activeSlide + 1) % CONFIG.heroSlides.length;
      this._goToSlide(this._activeSlide);
    }, 5000);
  },

  _stopHeroAutoplay() {
    if (this._heroInterval) {
      clearInterval(this._heroInterval);
      this._heroInterval = null;
    }
  },

  _goToSlide(index) {
    this._activeSlide = index;
    const slides = $$('.hero__slide');
    const dots = $$('.hero__dot');
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));

    // Pause all videos, play only the active one
    this._playActiveVideo();
  },

  _playActiveVideo() {
    $$('.hero__video').forEach((video, i) => {
      if (i === this._activeSlide) {
        // Lazy-load: switch preload to auto and attempt play
        if (video.preload === 'none') {
          video.preload = 'auto';
          video.load();
        }
        video.currentTime = 0;
        video.play().catch(() => {
          // Autoplay blocked — video poster will show
        });
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  },

  _doSearch() {
    const input = $('#heroSearchInput');
    if (input && input.value.trim()) {
      Router.navigate('/search?q=' + encodeURIComponent(input.value.trim()));
    }
  },

  _scrollBenefits() {
    const grid = $('#benefitsGrid');
    if (!grid) return;
    grid.scrollBy({ left: 260, behavior: 'smooth' });
  },

  _updateBenefitsArrow() {
    const grid = $('#benefitsGrid');
    const arrow = $('#benefitsArrow');
    if (!grid || !arrow) return;
    const canScroll = grid.scrollWidth > grid.clientWidth;
    const atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4;
    arrow.classList.toggle('hidden', !canScroll || atEnd);
  },

};

window.HomePage = HomePage;
