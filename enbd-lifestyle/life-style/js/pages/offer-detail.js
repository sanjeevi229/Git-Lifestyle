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
    const tierLabel = Format.tierLabel(offer.minTier);
    const isExclusive = offer.minTier !== 'classic';

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full page__main--od">

          <!-- Hero Carousel -->
          ${this._renderHeroCarousel(offer, merchant, tierLabel, isExclusive)}

          <!-- Experience Highlight Strip -->
          ${this._renderExperienceStrip(offer, merchant)}

          <div class="container">
            <div class="breadcrumb">
              <span class="breadcrumb__item" onclick="Router.navigate('/home')">Home</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__item" onclick="Router.navigate('/category/${offer.category}')">${Format.categoryLabel(offer.category)}</span>
              <span class="breadcrumb__sep">›</span>
              <span class="breadcrumb__current">${offer.title}</span>
            </div>

            <div class="od-body">
              <!-- Left column: About Merchant -->
              ${merchant ? `
                <div class="od-about">
                  <div class="od-about__banner">
                    <img src="${merchant.image}" alt="${merchant.name}" />
                  </div>
                  <div class="od-about__body">
                    <div class="od-about__top">
                      <div>
                        <h3 class="od-about__title">${merchant.name}</h3>
                        <div class="od-about__tags">
                          ${merchant.cuisine ? `<span class="od-about__tag">${merchant.cuisine}</span>` : ''}
                          <span class="od-about__tag">${merchant.area}</span>
                        </div>
                      </div>
                      <div class="od-about__rating">
                        ${Icons.star(12)}
                        <span class="od-about__rating-num">${Number(merchant.rating).toFixed(1)}</span>
                      </div>
                    </div>
                    <p class="od-about__desc">${merchant.description}</p>
                    <div class="od-about__meta">
                      <div class="od-about__meta-item">${Icons.mapPin(14)} <span>${merchant.location}</span></div>
                      <div class="od-about__meta-item">${Icons.clock(14)} <span>${merchant.openingHours}</span></div>
                      <div class="od-about__meta-item">${Icons.phone(14)} <span>${merchant.phone}</span></div>
                    </div>
                    <div class="od-about__actions">
                      <button class="od-about__action-btn" id="merchantCallBtn">
                        ${Icons.phone(14)}
                        <span>Call</span>
                      </button>
                      <button class="od-about__action-btn" id="merchantDirectionsBtn">
                        ${Icons.mapPin(14)}
                        <span>Directions</span>
                      </button>
                    </div>
                  </div>
                  <div class="od-about__map" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merchant.location + ', Dubai, UAE')}', '_blank')">
                    <div class="od-about__map-frame">
                      ${Icons.mapPin(18)}
                      <span class="od-about__map-area">${merchant.location}</span>
                    </div>
                    <div class="od-about__map-link">
                      <span>Open in Google Maps</span>
                    </div>
                  </div>
                </div>
              ` : ''}

              <!-- Right column: Offer details -->
              <div class="od-main">
                <div class="od-panel">
                  <!-- Unified info row -->
                  <div class="od-panel__info-row">
                    <span class="od-panel__info-item">${Icons.tag(14)} ${Format.discountLabel(offer)}</span>
                    <span class="od-panel__info-sep"></span>
                    <span class="od-panel__info-item">${Icons.calendar(14)} Valid until ${Format.date(offer.validUntil)}</span>
                    ${isExclusive ? `
                      <span class="od-panel__info-sep"></span>
                      <span class="od-panel__info-item">${Icons.creditCard(14)} ${tierLabel}+</span>
                    ` : ''}
                  </div>

                  <!-- Title -->
                  <h1 class="od-panel__title">${offer.title}</h1>

                  <!-- Rating (subtle) -->
                  ${merchant ? `
                    <div class="od-panel__rating">
                      ${Icons.star(14)} <span>${Number(merchant.rating).toFixed(1)}</span>
                      <span class="od-panel__rating-sep">&middot;</span>
                      <span class="od-panel__rating-label">${merchant.name}</span>
                    </div>
                  ` : ''}

                  <!-- Description -->
                  <p class="od-panel__desc">${offer.description}</p>

                  <!-- Why you'll love it -->
                  ${merchant ? `
                    <div class="od-highlights-mini">
                      <h4 class="od-highlights-mini__title">Why you'll love it</h4>
                      <ul class="od-highlights-mini__list">
                        <li>${Format.discountLabel(offer)} exclusive offer for Demo cardholders</li>
                        ${merchant.cuisine ? `<li>${merchant.cuisine} dining experience at ${merchant.area}</li>` : ''}
                        ${merchant.rating >= 4.5 ? `<li>Highly rated (${Number(merchant.rating).toFixed(1)}/5) by diners</li>` : ''}
                      </ul>
                    </div>
                  ` : ''}

                  <!-- Desktop CTA -->
                  <div class="od-cta-group">
                    <div class="od-cta-desktop" id="od-cta-desktop">
                      <button class="btn btn--primary btn--lg btn--full od-cta-book" onclick="Router.navigate('/booking/${offer.id}')">
                        Reserve Now
                      </button>
                      <button class="btn btn--ghost btn--lg od-cta-save${savedClass}" onclick="OfferDetailPage._toggleSave('${offer.id}')">
                        ${Icons.heart(18)} Save
                      </button>
                    </div>
                    ${isExclusive ? `<p class="od-cta-note">Available for ${tierLabel} Cardholders and above</p>` : ''}
                    <p class="od-cta-reward">${Icons.gift(14)} Earn reward points on this booking</p>
                  </div>

                  <!-- Terms (collapsible — minimal) -->
                  <div class="od-terms" id="od-terms-block">
                    <button class="od-terms__toggle" id="od-terms-toggle" aria-expanded="false">
                      <span class="od-terms__title">Terms & Conditions</span>
                      <span class="od-terms__chevron">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </span>
                    </button>
                    <div class="od-terms__body" id="od-terms-body">
                      <ul class="od-terms__list">
                        ${(offer.terms || []).map(t => `<li>${t}</li>`).join('')}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- Sticky Mobile CTA -->
        <div class="od-sticky-cta" id="od-sticky-cta">
          <button class="btn btn--primary btn--lg od-sticky-cta__book" onclick="Router.navigate('/booking/${offer.id}')">
            Reserve Now
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

                <button class="btn btn--primary btn--lg btn--full" ${soldOut ? 'disabled' : ''} onclick="Router.navigate('/booking/event-${event.id}')">
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

    // Hero carousel
    this._mountHeroCarousel();

    // Terms toggle
    const termsToggle = $('#od-terms-toggle');
    const termsBlock = $('#od-terms-block');
    if (termsToggle && termsBlock) {
      termsToggle.addEventListener('click', () => {
        termsBlock.classList.toggle('od-terms--expanded');
        const expanded = termsBlock.classList.contains('od-terms--expanded');
        termsToggle.setAttribute('aria-expanded', expanded);
      });
    }

    // Merchant action buttons
    const callBtn = $('#merchantCallBtn');
    if (callBtn) {
      callBtn.addEventListener('click', () => {
        Toast.show('Calling Restaurant', 'Opening your phone dialler now.', 'info');
      });
    }
    const dirBtn = $('#merchantDirectionsBtn');
    if (dirBtn) {
      dirBtn.addEventListener('click', () => {
        Toast.show('Opening Maps', 'Directions will open in your maps app.', 'info');
      });
    }

    // Sticky CTA — on mobile it's always visible via CSS media query.
    // On desktop, IntersectionObserver shows it when the desktop CTA scrolls out.
    const desktopCta = $('#od-cta-desktop');
    const stickyCta = $('#od-sticky-cta');
    if (desktopCta && stickyCta && window.innerWidth > 900) {
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
      this._stickyObserver.observe(desktopCta);
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
  },

  _renderHeroCarousel(offer, merchant, tierLabel, isExclusive) {
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
        ${hasMultiple ? `
          <button class="od-hero__arrow od-hero__arrow--prev" id="od-hero-prev" aria-label="Previous image">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button class="od-hero__arrow od-hero__arrow--next" id="od-hero-next" aria-label="Next image">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div class="od-hero__dots" id="od-hero-dots">
            ${images.map((_, i) => `<span class="od-hero__dot${i === 0 ? ' od-hero__dot--active' : ''}" data-index="${i}"></span>`).join('')}
          </div>
        ` : ''}
        <div class="od-hero__overlay"></div>
        <span class="od-hero__badge">${isExclusive ? `Exclusive ${tierLabel} Privilege` : 'Demo Exclusive'}</span>
        <div class="od-hero__gradient"></div>
        <div class="od-hero__context">
          ${merchant ? `<span class="od-hero__merchant">${merchant.name} · ${merchant.area}</span>` : ''}
          <span class="od-hero__title">${offer.title}</span>
        </div>
        ${hasMultiple ? `<span class="od-hero__counter" id="od-hero-counter">1 / ${images.length}</span>` : ''}
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

    // Track layout: [lastClone] [slide0] [slide1] ... [slideN] [firstClone]
    // trackIndex 0 = lastClone, 1 = slide0, ..., totalReal = slideN, totalReal+1 = firstClone
    const dots = $$('#od-hero-dots .od-hero__dot');
    const counter = $('#od-hero-counter');
    const prevBtn = $('#od-hero-prev');
    const nextBtn = $('#od-hero-next');
    let currentIndex = 0;    // real index (0-based)
    let trackIndex = 1;      // position in track (1 = first real slide)
    let isTransitioning = false;

    const setPosition = (idx, animate) => {
      if (!animate) track.style.transition = 'none';
      track.style.transform = `translateX(-${idx * 100}%)`;
      if (!animate) {
        // Force reflow to apply instant position before re-enabling transition
        track.offsetHeight;
        track.style.transition = '';
      }
    };

    const updateIndicators = () => {
      dots.forEach((dot, i) => {
        dot.classList.toggle('od-hero__dot--active', i === currentIndex);
      });
      if (counter) counter.textContent = `${currentIndex + 1} / ${totalReal}`;
    };

    // Start at real slide 0 (trackIndex 1) — no animation
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

    // After transition ends, silently jump if on a clone
    track.addEventListener('transitionend', (e) => {
      if (e.target !== track || e.propertyName !== 'transform') return;
      isTransitioning = false;
      if (trackIndex === 0) {
        // On lastClone → jump to real last slide
        trackIndex = totalReal;
        setPosition(trackIndex, false);
      } else if (trackIndex === totalReal + 1) {
        // On firstClone → jump to real first slide
        trackIndex = 1;
        setPosition(trackIndex, false);
      }
    });

    // Arrow buttons
    if (prevBtn) prevBtn.addEventListener('click', () => { goPrev(); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goNext(); resetAutoplay(); });

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
        // Snap back
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

    // Pause on hover (desktop)
    const hero = track.closest('.od-hero');
    if (hero) {
      hero.addEventListener('mouseenter', () => clearInterval(this._heroAutoplay));
      hero.addEventListener('mouseleave', () => startAutoplay());
    }
  },

  _renderExperienceStrip(offer, merchant) {
    const chips = [];
    if (merchant) {
      if (merchant.cuisine) chips.push({ emoji: '🍽️', text: `${merchant.cuisine} Cuisine` });
      if (merchant.rating >= 4.5) chips.push({ emoji: '⭐', text: `Top Rated (${Number(merchant.rating).toFixed(1)})` });
      if (merchant.area) chips.push({ emoji: '📍', text: merchant.area });
      const priceLabel = { '$': 'Budget Friendly', '$$': 'Casual Dining', '$$$': 'Upscale Dining', '$$$$': 'Fine Dining' };
      if (merchant.priceRange) chips.push({ emoji: '✨', text: priceLabel[merchant.priceRange] || 'Dining' });
    }
    chips.push({ emoji: '🏷️', text: Format.discountLabel(offer) });
    if (offer.minTier !== 'classic') chips.push({ emoji: '💳', text: `${Format.tierLabel(offer.minTier)}+ Card` });

    if (chips.length === 0) return '';

    return `
      <div class="od-strip">
        <div class="od-strip__inner">
          ${chips.map(c => `<span class="od-strip__chip">${c.emoji} ${c.text}</span>`).join('')}
        </div>
      </div>
    `;
  },

  _toggleSave(offerId) {
    const saved = Store.get('savedOffers') || [];
    const idx = saved.indexOf(offerId);
    if (idx > -1) {
      saved.splice(idx, 1);
      Toast.show('Offer removed from saved', 'info');
    } else {
      saved.push(offerId);
      Toast.show('Offer saved!', 'success');
    }
    Store.set('savedOffers', saved);
    // Update visual state on all save buttons
    $$('.od-cta-save, .od-sticky-cta__save').forEach(btn => {
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
