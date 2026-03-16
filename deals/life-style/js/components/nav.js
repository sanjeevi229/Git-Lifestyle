// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Navigation
// ══════════════════════════════════════════════

const Nav = {
  render() {
    const user = Auth.getCurrentUser();
    if (!user) return '';

    const tierConfig = CONFIG.cardTiers[user.cardTier];
    const bookingCount = Store.getBookingCount();

    return `
      <nav class="topnav">
        <a class="topnav__logo" onclick="Router.navigate('/home')">
          <span></span>
        </a>

        <div class="topnav__center">
          <span class="topnav__link ${this._isActive('/home')}" onclick="Router.navigate('/home')">Home</span>
          <span class="topnav__link ${this._isActive('/category/dining')}" onclick="Router.navigate('/category/dining')">Dining</span>
          <span class="topnav__link ${this._isActive('/category/entertainment')}" onclick="Router.navigate('/category/entertainment')">Entertainment</span>
          <span class="topnav__link ${this._isActive('/category/travel') || this._isActive('/category/flights')}" onclick="Router.navigate('/category/travel')">Travel</span>
          <span class="topnav__link ${this._isActive('/category/hotels')}" onclick="Router.navigate('/category/hotels')">Book Hotels</span>
          <span class="topnav__link ${this._isActive('/category/shopping')}" onclick="Router.navigate('/category/shopping')">Shopping</span>
          <div class="topnav__more">
            <span class="topnav__link topnav__more-trigger" id="moreMenuTrigger">More ▾</span>
            <div class="topnav__more-dropdown" id="moreDropdown">
              <span class="topnav__dropdown-item" onclick="Router.navigate('/category/wellness')">${Icons.heart(16)} Live Well</span>
              <span class="topnav__dropdown-item" onclick="Router.navigate('/category/events')">${Icons.ticket(16)} Events</span>
              <span class="topnav__dropdown-item" onclick="Router.navigate('/category/promotions')">${Icons.tag(16)} Promotions</span>
              <span class="topnav__dropdown-item" onclick="Router.navigate('/card-benefits')">${Icons.creditCard(16)} Card Benefits</span>
            </div>
          </div>
        </div>

        <div class="topnav__right">
          <div class="topnav__bookings" onclick="Router.navigate('/my-bookings')" title="My Bookings">
            <span style="display:flex">${Icons.bell(18)}</span>
            ${bookingCount > 0 ? `<span class="topnav__bookings-count">${bookingCount}</span>` : ''}
          </div>

          <div class="user-menu" id="userMenu">
            <div class="avatar avatar--gold">${user.avatar}</div>
            <div>
              <div class="user-menu__name">${user.name}</div>
              <div class="user-menu__tier" style="color:${tierConfig.color}">Visa ${tierConfig.label} Card</div>
            </div>
            <span class="user-menu__chevron">▾</span>
            <div class="user-menu__dropdown" id="userDropdown">
              <span class="user-menu__dropdown-item" onclick="Router.navigate('/profile')">${Icons.users(16)} Profile</span>
              <span class="user-menu__dropdown-item" onclick="Router.navigate('/faq')">${Icons.helpCircle(16)} FAQ</span>
              <span class="user-menu__dropdown-item" onclick="Router.navigate('/policy')">${Icons.shield(16)} Policy</span>
            </div>
          </div>
        </div>
      </nav>

      <!-- Floating mobile toolbar (hamburger) -->
      <div class="mobile-toolbar">
        <div class="mobile-fab" id="hamburgerBtn">${Icons.menu(22)}</div>
      </div>

      <!-- Backdrop overlay -->
      <div class="mobile-backdrop" id="mobileBackdrop"></div>

      <!-- Mobile Menu (right-side off-canvas drawer) -->
      <div class="mobile-menu" id="mobileMenu">
        <div class="mobile-menu__header">
          <span></span>
          <span class="mobile-menu__close" id="mobileMenuClose">${Icons.close(22)}</span>
        </div>
        <div class="mobile-menu__user">
          <div class="avatar avatar--gold">${user.avatar}</div>
          <div class="mobile-menu__user-info">
            <span class="mobile-menu__user-name">${user.name}</span>
            <span class="mobile-menu__user-tier" style="color:${tierConfig.color}">Visa ${tierConfig.label} Card</span>
          </div>
          <div class="mobile-menu__bell" onclick="event.stopPropagation();Nav._closeMobile();Router.navigate('/my-bookings');" title="My Bookings">
            ${Icons.bell(20)}
            ${bookingCount > 0 ? `<span class="mobile-menu__bell-count">${bookingCount}</span>` : ''}
          </div>
        </div>
        <div class="mobile-menu__grid">
          <div class="mobile-menu__item" onclick="Router.navigate('/home'); Nav._closeMobile();">
            <span class="mobile-menu__item-icon">${Icons.home(24)}</span>
            <span class="mobile-menu__item-label">Home</span>
          </div>
          <div class="mobile-menu__item" onclick="Router.navigate('/my-bookings'); Nav._closeMobile();">
            <span class="mobile-menu__item-icon">${Icons.clipboard(24)}</span>
            <span class="mobile-menu__item-label">Bookings</span>
          </div>
          <div class="mobile-menu__item" onclick="Router.navigate('/plus-points'); Nav._closeMobile();">
            <span class="mobile-menu__item-icon">${Icons.star(24)}</span>
            <span class="mobile-menu__item-label">Plus Points</span>
          </div>
          <div class="mobile-menu__item" onclick="Router.navigate('/profile'); Nav._closeMobile();">
            <span class="mobile-menu__item-icon">${Icons.user(24)}</span>
            <span class="mobile-menu__item-label">Profile</span>
          </div>
          <div class="mobile-menu__item" onclick="Router.navigate('/faq'); Nav._closeMobile();">
            <span class="mobile-menu__item-icon">${Icons.helpCircle(24)}</span>
            <span class="mobile-menu__item-label">FAQ</span>
          </div>
          <div class="mobile-menu__item" onclick="Router.navigate('/policy'); Nav._closeMobile();">
            <span class="mobile-menu__item-icon">${Icons.shield(24)}</span>
            <span class="mobile-menu__item-label">Policy</span>
          </div>
        </div>
      </div>

      <!-- Sticky mobile search (all pages) -->
      <div class="sticky-search" id="stickySearch">
        <div class="sticky-search__inner">
          <svg class="sticky-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input id="stickySearchInput" type="text" placeholder="Search offers, flights, restaurants..." />
          <button class="sticky-search__go" onclick="Nav._doStickySearch()" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    `;
  },

  mount() {
    // More dropdown
    const trigger = $('#moreMenuTrigger');
    const dropdown = $('#moreDropdown');
    if (trigger && dropdown) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        if (userDropdown) userDropdown.classList.remove('open');
      });
    }

    // User profile dropdown
    const userMenu = $('#userMenu');
    const userDropdown = $('#userDropdown');
    if (userMenu && userDropdown) {
      userMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('open');
        if (dropdown) dropdown.classList.remove('open');
      });
    }

    document.addEventListener('click', () => {
      if (dropdown) dropdown.classList.remove('open');
      if (userDropdown) userDropdown.classList.remove('open');
    });

    // Mobile menu
    const hamburger = $('#hamburgerBtn');
    const mobileClose = $('#mobileMenuClose');
    const backdrop = $('#mobileBackdrop');
    if (hamburger) hamburger.addEventListener('click', () => Nav._openMobile());
    if (mobileClose) mobileClose.addEventListener('click', () => Nav._closeMobile());
    if (backdrop) backdrop.addEventListener('click', () => Nav._closeMobile());

    // Swipe-to-dismiss on drawer
    const mobileMenu = $('#mobileMenu');
    if (mobileMenu) {
      let startX = 0, currentX = 0, isSwiping = false;

      mobileMenu.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        currentX = startX;
        isSwiping = false;
        mobileMenu.style.transition = 'none';
      }, { passive: true });

      mobileMenu.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        // Only track rightward swipes past 15px threshold
        if (deltaX > 15) {
          isSwiping = true;
          mobileMenu.style.transform = `translateX(${deltaX}px)`;
        }
      }, { passive: true });

      mobileMenu.addEventListener('touchend', () => {
        mobileMenu.style.transition = '';
        const deltaX = currentX - startX;
        if (isSwiping && deltaX > 80) {
          Nav._closeMobile();
        } else {
          // Snap back
          if (mobileMenu.classList.contains('open')) {
            mobileMenu.style.transform = 'translateX(0)';
          }
        }
        isSwiping = false;
      }, { passive: true });
    }

    // Sticky search — shows on scroll past hero/cat search, or immediately on pages without one
    if (this._onStickyScroll) {
      window.removeEventListener('scroll', this._onStickyScroll);
    }
    const heroTrigger = $('.hero-search') || $('.cat-hero__search');
    const stickyEl = $('#stickySearch');
    if (!heroTrigger && stickyEl) {
      // No hero search on this page — show sticky search after a small scroll
      this._onStickyScroll = () => {
        if (window.scrollY > 80) {
          stickyEl.classList.add('sticky-search--visible');
        } else {
          stickyEl.classList.remove('sticky-search--visible');
        }
      };
    } else {
      this._onStickyScroll = () => {
        const t = $('.hero-search') || $('.cat-hero__search');
        const s = $('#stickySearch');
        if (!t || !s) return;
        if (t.getBoundingClientRect().bottom < 0) {
          s.classList.add('sticky-search--visible');
        } else {
          s.classList.remove('sticky-search--visible');
        }
      };
    }
    window.addEventListener('scroll', this._onStickyScroll, { passive: true });

    const stickyInput = $('#stickySearchInput');
    if (stickyInput) {
      stickyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') Nav._doStickySearch();
      });
      AutoSuggest.attach(stickyInput);
    }
  },

  _isActive(path) {
    const hash = Router.getHash().split('?')[0];
    return hash === path || hash.startsWith(path + '/') ? 'active' : '';
  },

  _openMobile() {
    const menu = $('#mobileMenu');
    const backdrop = $('#mobileBackdrop');
    if (menu) {
      menu.classList.add('open');
      menu.style.transform = '';
    }
    if (backdrop) backdrop.classList.add('visible');
    document.body.classList.add('menu-open');
  },

  _closeMobile() {
    const menu = $('#mobileMenu');
    const backdrop = $('#mobileBackdrop');
    if (menu) {
      menu.classList.remove('open');
      menu.style.transform = '';
    }
    if (backdrop) backdrop.classList.remove('visible');
    document.body.classList.remove('menu-open');
  },

  _doStickySearch() {
    const input = $('#stickySearchInput');
    if (input && input.value.trim()) {
      Router.navigate('/search?q=' + encodeURIComponent(input.value.trim()));
    }
  },
};

window.Nav = Nav;
