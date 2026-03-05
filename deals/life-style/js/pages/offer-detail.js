// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Offer Detail Page
// ══════════════════════════════════════════════

const OfferDetailPage = {
  _stickyObserver: null,
  _heroAutoplay: null,

  render(params) {
    const rawId = params.id;

    // Event detail
    if (rawId.startsWith('event-')) {
      const eventId = rawId.replace('event-', '');
      const event = (Store.get('events') || []).find(e => e.id === eventId);
      if (!event) return this._notFound();
      return this._renderEvent(event);
    }

    // Offer detail
    const offer = (Store.get('offers') || []).find(o => o.id === rawId);
    if (!offer) return this._notFound();
    const merchant = Store.getMerchant(offer.merchantId);
    const saved = (Store.get('savedOffers') || []).includes(offer.id);
    const savedClass = saved ? ' is-saved' : '';
    const discountLabel = Format.discountLabel(offer);

    // Eligible card tiers
    const allTiers = ['classic', 'gold', 'platinum', 'infinite', 'private'];
    const minIdx = allTiers.indexOf(offer.minTier);
    const eligibleTiers = allTiers.slice(minIdx >= 0 ? minIdx : 0).map(t => Format.tierLabel(t));

    // Similar offers (same category, different merchant)
    const similarOffers = (Store.get('offers') || [])
      .filter(o => o.category === offer.category && o.id !== offer.id)
      .slice(0, 8);

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full page__main--od">

          <!-- Hero Carousel -->
          ${this._renderHeroCarousel(offer)}

          <!-- Detail Content -->
          <div class="od-content">

            <!-- Breadcrumb -->
            <div class="breadcrumb">
              <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="Router.navigate('/category/${offer.category}')">${Format.categoryLabel(offer.category)}</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">${merchant ? merchant.name : offer.title}</span>
            </div>

            <!-- Header: name + discount -->
            <div class="od-detail__header">
              <h1 class="od-detail__name">${merchant ? merchant.name : offer.title}</h1>
              <span class="od-detail__discount">${discountLabel}</span>
            </div>

            <!-- Info grid -->
            <div class="od-detail__info">
              ${merchant && merchant.cuisine ? `
                <div class="od-detail__info-item">
                  ${Icons.utensils(16)}
                  <span>${merchant.cuisine}</span>
                </div>
              ` : ''}
              ${merchant && merchant.costForTwo ? `
                <div class="od-detail__info-item">
                  ${Icons.creditCard(16)}
                  <span>Cost for two AED ${merchant.costForTwo}</span>
                </div>
              ` : ''}
              ${merchant ? `
                <div class="od-detail__info-item">
                  ${Icons.mapPin(16)}
                  <span>${merchant.area}</span>
                </div>
              ` : ''}
              <div class="od-detail__info-item">
                ${Icons.calendar(16)}
                <span>Until ${Format.date(offer.validUntil)}</span>
              </div>
            </div>

            <!-- Desktop CTA -->
            <div class="od-cta-desktop">
              <button class="btn btn--primary btn--lg od-cta-desktop__book" onclick="Router.navigate('${this._bookingRoute(offer.category, offer.id)}')">
                ${offer.category === 'dining' ? 'Reserve Now' : 'Book Now'}
              </button>
              <button class="btn btn--ghost od-cta-desktop__save${savedClass}" onclick="OfferDetailPage._toggleSave('${offer.id}')">
                ${Icons.heart(18)}
              </button>
            </div>

            <!-- Highlights -->
            <div class="od-section">
              <h3 class="od-section__title">Highlights</h3>
              <ul class="od-section__list">
                <li>${discountLabel} exclusive offer for Visa Infinite cardholders</li>
                ${merchant && merchant.cuisine ? `<li>${merchant.cuisine} dining experience at ${merchant.area}</li>` : ''}
                ${merchant && merchant.rating >= 4.5 ? `<li>Highly rated (${Number(merchant.rating).toFixed(1)}/5) by diners</li>` : ''}
                ${offer.minTier !== 'classic' ? `<li>Available for ${Format.tierLabel(offer.minTier)} cardholders and above</li>` : ''}
              </ul>
            </div>

            <!-- About Merchant -->
            ${merchant ? `
              <div class="od-section">
                <h3 class="od-section__title">About ${merchant.name}</h3>
                <p class="od-section__text">${merchant.description}</p>
              </div>
            ` : ''}

            <!-- About the deal -->
            <div class="od-section">
              <h3 class="od-section__title">About the deal</h3>
              <p class="od-section__text">${offer.description}</p>
            </div>

            <!-- Terms and Conditions -->
            ${offer.terms && offer.terms.length ? `
              <div class="od-section">
                <h3 class="od-section__title">Terms and Conditions</h3>
                <ul class="od-section__list od-section__list--plain">
                  ${offer.terms.map(t => `<li>${t}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- Eligible cards -->
            <div class="od-section">
              <h3 class="od-section__title">Eligible cards</h3>
              <ul class="od-section__list od-section__list--plain">
                ${eligibleTiers.map(t => `<li>${t} Card</li>`).join('')}
              </ul>
            </div>

            <!-- Contact details -->
            ${merchant ? `
              <div class="od-section">
                <h3 class="od-section__title">Contact details</h3>
                <div class="od-contact">
                  <div class="od-contact__item">
                    <div class="od-contact__icon">${Icons.phone(20)}</div>
                    <div class="od-contact__body">
                      <span class="od-contact__label">Mobile</span>
                      <span class="od-contact__value">${merchant.phone}</span>
                    </div>
                  </div>
                  <div class="od-contact__item">
                    <div class="od-contact__icon">${Icons.globe(20)}</div>
                    <div class="od-contact__body">
                      <span class="od-contact__label">Website</span>
                      <span class="od-contact__value">www.demo-lifestyle.ae</span>
                    </div>
                  </div>
                  <div class="od-contact__item">
                    <div class="od-contact__icon">
                      <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div class="od-contact__body">
                      <span class="od-contact__label">Email</span>
                      <span class="od-contact__value">support@demo-lifestyle.ae</span>
                    </div>
                  </div>
                  <div class="od-contact__item">
                    <div class="od-contact__icon">${Icons.clock(20)}</div>
                    <div class="od-contact__body">
                      <span class="od-contact__label">Timing</span>
                      <span class="od-contact__value">${merchant.openingHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}


          </div>

          <!-- Similar places (full-width, outside od-content) -->
          ${similarOffers.length ? `
            <section class="od-similar">
              <div class="carousel-header">
                <div>
                  <h3 class="carousel-header__title">Similar places for you</h3>
                  <p class="carousel-header__subtitle">Steal these deals</p>
                </div>
              </div>
              <div class="carousel-wrapper">
                <button class="carousel-arrow carousel-arrow--left" data-carousel="od-similar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
                <div class="carousel-track od-similar__track" id="od-similar-track">
                  ${similarOffers.map(o => {
                    const m = Store.getMerchant(o.merchantId);
                    return `
                      <div class="od-similar__card" onclick="Router.navigate('/offer/${o.id}')">
                        <div class="od-similar__img card-hover-zone">
                          <img src="${m ? m.image : (o.image || (o.images && o.images[0]))}" alt="${m ? m.name : o.title}" />
                          ${m && m.rating ? `<span class="od-similar__rating">★ ${Number(m.rating).toFixed(1)}</span>` : ''}
                          <button class="card-share-btn" onclick="event.stopPropagation();cardShare('${(m ? m.name : o.title).replace(/'/g, "\\'")}','/offer/${o.id}')" aria-label="Share">${Icons.share(15)}</button>
                          <div class="card-hover-zone__overlay">
                            ${m && m.area ? `<span class="card-hover-zone__location">${Icons.mapPin(14)} ${m.area}</span>` : ''}
                            <button class="card-hover-zone__cta" onclick="event.stopPropagation();Router.navigate('${this._bookingRoute(o.category, o.id)}')">Book Now</button>
                          </div>
                        </div>
                        <div class="od-similar__body">
                          <h4 class="od-similar__name">${m ? m.name : o.title}</h4>
                          <p class="od-similar__meta">${m ? `${m.cuisine || ''} · ${m.area}` : ''}</p>
                          ${m && m.priceRange ? `<p class="od-similar__price">${m.priceRange}</p>` : ''}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
                <button class="carousel-arrow carousel-arrow--right" data-carousel="od-similar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
              </div>
            </section>
          ` : ''}

        </main>

        <!-- Sticky Mobile CTA -->
        <div class="od-sticky-cta" id="od-sticky-cta">
          <button class="btn btn--primary btn--lg od-sticky-cta__book" onclick="Router.navigate('${this._bookingRoute(offer.category, offer.id)}')">
            ${offer.category === 'dining' ? 'Reserve Now' : 'Book Now'}
          </button>
          <button class="btn btn--ghost od-sticky-cta__save${savedClass}" onclick="OfferDetailPage._toggleSave('${offer.id}')">
            ${Icons.heart(18)}
          </button>
        </div>
      </div>
    `;
  },

  _renderEvent(event) {
    const spotsLeft = event.capacity - event.bookedCount;
    const soldOut = spotsLeft <= 0;

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="breadcrumb">
              <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="Router.navigate('/category/events')">Events</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">${event.title}</span>
            </div>

            <div class="od-layout">
              <div class="od-image">
                <img src="${event.image}" alt="${event.title}" />
                ${event.originalPrice > event.price ? `<span class="discount-badge discount-badge--lg discount-badge--red">${Math.round((1 - event.price / event.originalPrice) * 100)}% OFF</span>` : ''}
              </div>

              <div class="od-panel">
                <div class="od-panel__header">
                  <span class="badge badge--danger">Event</span>
                  <span class="badge badge--neutral">${event.eventType}</span>
                </div>

                <h1 class="od-panel__title page-title">${event.title}</h1>
                <p class="od-panel__desc">${event.description}</p>

                <div class="od-event-details">
                  <div class="od-event-details__row">
                    <span>${Icons.calendar(18)}</span>
                    <span>${Format.date(event.date)}</span>
                  </div>
                  <div class="od-event-details__row">
                    <span>${Icons.clock(18)}</span>
                    <span>${Format.timeRange(event.date, event.endDate)}</span>
                  </div>
                  <div class="od-event-details__row">
                    <span>${Icons.mapPin(18)}</span>
                    <span>${event.venue}, ${event.area}</span>
                  </div>
                  <div class="od-event-details__row">
                    <span>${Icons.ticket(18)}</span>
                    <span>${Format.spotsLeft(event.capacity, event.bookedCount)}</span>
                  </div>
                </div>

                <div class="od-event-pricing">
                  <div class="od-event-pricing__current">AED ${event.price}</div>
                  ${event.originalPrice > event.price ? `<div class="od-event-pricing__original">AED ${event.originalPrice}</div>` : ''}
                  <div class="od-event-pricing__per">per person</div>
                </div>

                <button class="btn btn--primary btn--lg btn--full" ${soldOut ? 'disabled' : ''} onclick="Router.navigate('/book-dining/event-${event.id}')">
                  ${soldOut ? 'Sold Out' : 'Book Tickets'}
                </button>

                ${event.minTier !== 'classic' ? `
                  <div class="info-box info-box--info">
                    <strong>Card Requirement:</strong> ${Format.tierLabel(event.minTier)} card or above
                  </div>
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

    // Similar places carousel arrows
    Carousel.mountAll();

    // Hero carousel
    this._mountHeroCarousel();

    // Mobile tap-to-reveal overlay for similar places cards
    this._setupTapOverlay();

    // Sticky CTA — on mobile always visible via CSS. On desktop, show when scrolling past content.
    const stickyCta = $('#od-sticky-cta');
    if (stickyCta && window.innerWidth > 900) {
      const content = $('.od-content');
      if (content) {
        this._stickyObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              stickyCta.classList.remove('od-sticky-cta--visible');
            } else {
              stickyCta.classList.add('od-sticky-cta--visible');
            }
          },
          { threshold: 0 }
        );
        this._stickyObserver.observe(content);
      }
    }
  },

  unmount() {
    if (this._stickyObserver) {
      this._stickyObserver.disconnect();
      this._stickyObserver = null;
    }
    if (this._heroAutoplay) {
      clearInterval(this._heroAutoplay);
      this._heroAutoplay = null;
    }
    if (this._cardObserver) {
      this._cardObserver.disconnect();
      this._cardObserver = null;
    }
  },

  _renderHeroCarousel(offer) {
    const images = offer.images && offer.images.length >= 2
      ? offer.images
      : [offer.image];
    const hasMultiple = images.length > 1;

    return `
      <div class="od-hero">
        <div class="od-hero__track" id="od-hero-track">
          ${images.map((src, i) => `
            <div class="od-hero__slide">
              <img src="${src}" alt="${offer.title} — image ${i + 1}" />
            </div>
          `).join('')}
        </div>
        <!-- Share button -->
        <button class="od-hero__share" onclick="cardShare('${offer.title.replace(/'/g, "\\'")}','/offer/${offer.id}')" aria-label="Share">
          ${Icons.share(18)}
        </button>
        ${hasMultiple ? `
          <div class="od-hero__dots" id="od-hero-dots">
            ${images.map((_, i) => `<span class="od-hero__dot${i === 0 ? ' od-hero__dot--active' : ''}" data-index="${i}"></span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  },

  _mountHeroCarousel() {
    const track = $('#od-hero-track');
    if (!track) return;

    const realSlides = Array.from(track.querySelectorAll('.od-hero__slide'));
    const totalReal = realSlides.length;
    if (totalReal <= 1) return;

    // Clone first and last slides for seamless infinite loop
    const firstClone = realSlides[0].cloneNode(true);
    const lastClone = realSlides[totalReal - 1].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    lastClone.setAttribute('aria-hidden', 'true');
    track.appendChild(firstClone);
    track.insertBefore(lastClone, realSlides[0]);

    const dots = $$('#od-hero-dots .od-hero__dot');
    let currentIndex = 0;
    let trackIndex = 1;
    let isTransitioning = false;

    const setPosition = (idx, animate) => {
      if (!animate) track.style.transition = 'none';
      track.style.transform = `translateX(-${idx * 100}%)`;
      if (!animate) {
        track.offsetHeight;
        track.style.transition = '';
      }
    };

    const updateIndicators = () => {
      dots.forEach((dot, i) => {
        dot.classList.toggle('od-hero__dot--active', i === currentIndex);
      });
    };

    setPosition(1, false);

    const goToSlide = (realIndex) => {
      if (isTransitioning) return;
      trackIndex = realIndex + 1;
      currentIndex = realIndex;
      updateIndicators();
      isTransitioning = true;
      setPosition(trackIndex, true);
    };

    const goNext = () => {
      if (isTransitioning) return;
      trackIndex++;
      currentIndex = (currentIndex + 1) % totalReal;
      updateIndicators();
      isTransitioning = true;
      setPosition(trackIndex, true);
    };

    const goPrev = () => {
      if (isTransitioning) return;
      trackIndex--;
      currentIndex = (currentIndex - 1 + totalReal) % totalReal;
      updateIndicators();
      isTransitioning = true;
      setPosition(trackIndex, true);
    };

    track.addEventListener('transitionend', (e) => {
      if (e.target !== track || e.propertyName !== 'transform') return;
      isTransitioning = false;
      if (trackIndex === 0) {
        trackIndex = totalReal;
        setPosition(trackIndex, false);
      } else if (trackIndex === totalReal + 1) {
        trackIndex = 1;
        setPosition(trackIndex, false);
      }
    });

    // Dot click
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.index));
        resetAutoplay();
      });
    });

    // Touch swipe support
    let touchStartX = 0, touchDeltaX = 0, isSwiping = false;
    track.addEventListener('touchstart', (e) => {
      if (isTransitioning) return;
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
      isSwiping = true;
      track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
      const baseOffset = trackIndex * track.offsetWidth;
      track.style.transform = `translateX(-${baseOffset - touchDeltaX}px)`;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (!isSwiping) return;
      isSwiping = false;
      track.style.transition = '';
      if (Math.abs(touchDeltaX) > 50) {
        if (touchDeltaX < 0) { goNext(); } else { goPrev(); }
        resetAutoplay();
      } else {
        setPosition(trackIndex, true);
      }
    }, { passive: true });

    // Auto-advance every 5 seconds
    const startAutoplay = () => {
      this._heroAutoplay = setInterval(() => goNext(), 5000);
    };
    const resetAutoplay = () => {
      clearInterval(this._heroAutoplay);
      startAutoplay();
    };
    startAutoplay();

    const hero = track.closest('.od-hero');
    if (hero) {
      hero.addEventListener('mouseenter', () => clearInterval(this._heroAutoplay));
      hero.addEventListener('mouseleave', () => startAutoplay());
    }
  },

  _setupTapOverlay() {
    if (window.innerWidth <= 900 && 'IntersectionObserver' in window) {
      this._cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
      }, { threshold: 0.3 });
      $$('.od-similar .card-hover-zone').forEach(zone => this._cardObserver.observe(zone));
    }
  },

  _bookingRoute(category, offerId) {
    const routeMap = {
      dining: '/book-dining/',
      entertainment: '/book-entertainment/',
      travel: '/book-flight/',
      hotels: '/book-hotel/',
      flights: '/book-flight/',
    };
    return (routeMap[category] || '/book-dining/') + offerId;
  },

  _toggleSave(offerId) {
    const saved = Store.get('savedOffers') || [];
    const idx = saved.indexOf(offerId);
    if (idx > -1) {
      saved.splice(idx, 1);
    } else {
      saved.push(offerId);
    }
    Store.set('savedOffers', saved);
    $$('.od-sticky-cta__save, .od-cta-desktop__save').forEach(btn => {
      btn.classList.toggle('is-saved', saved.includes(offerId));
    });
  },

  _notFound() {
    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="empty-state" style="padding-top:80px">
              <div class="empty-state__icon">${Icons.search(48)}</div>
              <h2 class="empty-state__title">Offer Not Found</h2>
              <p class="empty-state__text">This offer may have expired or been removed.</p>
              <button class="btn btn--primary" onclick="Router.navigate('/home')">Back to Home</button>
            </div>
          </div>
        </main>
      </div>
    `;
  },
};

window.OfferDetailPage = OfferDetailPage;
