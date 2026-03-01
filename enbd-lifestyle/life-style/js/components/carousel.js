// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Carousel Component
// ══════════════════════════════════════════════

const Carousel = {
  render(id, title, cards, options = {}) {
    const { showViewAll = false, viewAllRoute = '', subtitle = '' } = options;
    return `
      <section class="carousel-section" id="${id}">
        <div class="carousel-header">
          <div>
            <h2 class="carousel-header__title">${title}</h2>
            ${subtitle ? `<p class="carousel-header__subtitle">${subtitle}</p>` : ''}
          </div>
          ${showViewAll ? `<button class="btn btn--ghost btn--sm" onclick="Router.navigate('${viewAllRoute}')">Show All</button>` : ''}
        </div>
        <div class="carousel-wrapper">
          <button class="carousel-arrow carousel-arrow--left" data-carousel="${id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
          <div class="carousel-track" id="${id}-track">
            ${cards}
          </div>
          <button class="carousel-arrow carousel-arrow--right" data-carousel="${id}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
        </div>
      </section>
    `;
  },

  _updateArrows(track) {
    const wrapper = track.closest('.carousel-wrapper');
    if (!wrapper) return;
    const leftArrow = wrapper.querySelector('.carousel-arrow--left');
    const rightArrow = wrapper.querySelector('.carousel-arrow--right');
    if (!leftArrow || !rightArrow) return;

    const hasOverflow = track.scrollWidth > track.clientWidth + 2; // 2px tolerance
    if (!hasOverflow) {
      leftArrow.classList.remove('visible');
      rightArrow.classList.remove('visible');
      return;
    }

    // Show/hide left arrow based on scroll position
    if (track.scrollLeft > 5) {
      leftArrow.classList.add('visible');
    } else {
      leftArrow.classList.remove('visible');
    }

    // Show/hide right arrow based on remaining scroll
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft < maxScroll - 5) {
      rightArrow.classList.add('visible');
    } else {
      rightArrow.classList.remove('visible');
    }
  },

  mountAll() {
    // Reset all carousel scroll positions on every mount
    $$('.carousel-track').forEach(track => { track.scrollLeft = 0; });

    // Arrow click handlers
    $$('.carousel-arrow').forEach(arrow => {
      arrow.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.carousel;
        const track = $(`#${id}-track`);
        if (!track) return;
        const isLeft = e.currentTarget.classList.contains('carousel-arrow--left');
        const scrollAmount = track.clientWidth * 0.7;
        track.scrollBy({ left: isLeft ? -scrollAmount : scrollAmount, behavior: 'smooth' });
      });
    });

    // Listen for scroll on each track to update arrow visibility
    $$('.carousel-track').forEach(track => {
      // Update arrows on scroll
      track.addEventListener('scroll', () => Carousel._updateArrows(track), { passive: true });
      // Initial check after a short delay (let layout settle)
      setTimeout(() => Carousel._updateArrows(track), 100);
    });

    // Re-check arrows on window resize
    window.addEventListener('resize', () => {
      $$('.carousel-track').forEach(track => Carousel._updateArrows(track));
    });

    // Mobile: reveal Book Now when carousel section scrolls into view
    if (window.innerWidth <= 900 && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      $$('.carousel-section').forEach(section => observer.observe(section));
    }
  },
};

window.Carousel = Carousel;
