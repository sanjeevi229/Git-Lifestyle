// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Reward Detail Page
// ══════════════════════════════════════════════

const RewardDetailPage = {
  _partner: null,

  render(params) {
    const partner = (CONFIG.rewardPartners || []).find(p => p.id === params.id);
    if (!partner) {
      return `<div class="page">${Nav.render()}<main class="page__main"><div class="container" style="padding-top:120px;text-align:center;"><h2>Reward not found</h2><button class="btn btn--primary" onclick="Router.navigate('/rewards')">Back to Rewards</button></div></main></div>`;
    }
    this._partner = partner;

    const featuresHtml = (partner.features || []).map(f => `
      <div class="rd-feature">
        <img class="rd-feature__img" src="${f.image}" alt="${f.title}" loading="lazy" />
        <p class="rd-feature__title">${f.title}</p>
      </div>
    `).join('');

    const faqsHtml = (partner.faqs || []).map((faq, i) => `
      <div class="rd-faq" data-index="${i}">
        <button class="rd-faq__trigger" onclick="RewardDetailPage._toggleFaq(${i})">
          <span class="rd-faq__question">${faq.q}</span>
          <span class="rd-faq__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </span>
        </button>
        <div class="rd-faq__answer">
          <p>${faq.a}</p>
        </div>
      </div>
    `).join('');

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">

          <!-- Hero Banner -->
          <section class="rd-hero" style="background: linear-gradient(135deg, ${partner.gradient[0]}, ${partner.gradient[1]}); --rc-grad-start: ${partner.gradient[0]};">
            <div class="rd-hero__glow" style="background: radial-gradient(circle at 90% 80%, ${partner.accentColor}33 0%, transparent 60%);"></div>
            <div class="rd-hero__back">
              <button onclick="Router.navigate('/rewards')" aria-label="Back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            </div>
            <div class="rd-hero__content">
              <span class="rd-hero__brand">${partner.brand}</span>
              <p class="rd-hero__tagline">${partner.tagline}</p>
              <p class="rd-hero__savings">${partner.savings || ''}</p>
            </div>
            <div class="rd-hero__visual">
              <img src="${partner.image}" alt="${partner.brand}" loading="eager" />
            </div>
          </section>

          <!-- Content -->
          <div class="container">

            <!-- Highlight -->
            <div class="rd-highlight">
              <h2 class="rd-highlight__title">${partner.highlight || ''}</h2>
              <p class="rd-highlight__desc">${partner.highlightDesc || ''}</p>
            </div>

            <!-- Features Carousel -->
            ${partner.features && partner.features.length ? `
              <div class="rd-features">
                <div class="rd-features__track">
                  ${featuresHtml}
                </div>
              </div>
            ` : ''}

            <!-- FAQ Section -->
            ${partner.faqs && partner.faqs.length ? `
              <div class="rd-faq-section">
                <h3 class="rd-faq-section__title">Find quick answers about our services</h3>
                <p class="rd-faq-section__subtitle">Reach out to us directly for more</p>
                <div class="rd-faq-list" id="rdFaqList">
                  ${faqsHtml}
                </div>
              </div>
            ` : ''}

            <!-- Unique Code -->
            ${partner.code ? `
              <div class="rd-code">
                <p class="rd-code__label">Your unique code</p>
                <div class="rd-code__box">
                  <span class="rd-code__value" id="rdCodeValue">${partner.code}</span>
                  <button class="rd-code__copy" onclick="RewardDetailPage._copyCode()" aria-label="Copy code">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </div>
              </div>
            ` : ''}

          </div>

          </div>

        </main>
      </div>
    `;
  },

  mount(params) {
    Nav.mount();
    // Open first FAQ by default
    this._toggleFaq(0);

    // Inject floating CTA outside .page so it isn't clipped by overflow
    this._injectFloatingCta();
  },

  _injectFloatingCta() {
    // Remove any previous floating CTA
    const old = document.getElementById('rd-floating-cta');
    if (old) old.remove();

    const partner = this._partner;
    if (!partner) return;

    const cta = document.createElement('div');
    cta.id = 'rd-floating-cta';
    cta.className = 'rd-sticky-cta';
    cta.innerHTML = `
      <button class="rd-sticky-cta__btn" onclick="RewardDetailPage._openSmartPass()">
        ${partner.ctaLabel || partner.cta}
      </button>
    `;
    document.body.appendChild(cta);
  },

  _removeFloatingCta() {
    const el = document.getElementById('rd-floating-cta');
    if (el) el.remove();
  },

  unmount() {
    this._removeFloatingCta();
  },

  _toggleFaq(index) {
    const faq = document.querySelector(`.rd-faq[data-index="${index}"]`);
    if (!faq) return;
    const isOpen = faq.classList.contains('open');
    // Close all
    document.querySelectorAll('.rd-faq.open').forEach(el => el.classList.remove('open'));
    // Toggle clicked
    if (!isOpen) faq.classList.add('open');
  },

  _copyCode() {
    const codeEl = document.getElementById('rdCodeValue');
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.textContent).then(() => {
      Toast.show('Code copied to clipboard!', 'success');
    }).catch(() => {
      const range = document.createRange();
      range.selectNodeContents(codeEl);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand('copy');
      sel.removeAllRanges();
      Toast.show('Code copied!', 'success');
    });
  },

  // ── SmartPass Flow ──

  _openSmartPass() {
    const partner = this._partner;
    if (!partner) return;

    const lockIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
    const checkIcon = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

    const overlay = document.createElement('div');
    overlay.className = 'sp-overlay';
    overlay.id = 'spOverlay';
    overlay.innerHTML = `
      <div class="sp-modal">
        <!-- Close button -->
        <button class="sp-close-btn" id="spCancelBtn" aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <!-- PIN Screen -->
        <div class="sp-screen" id="spPinScreen">
          <div class="sp-header__icon">${lockIcon}</div>
          <h2 class="sp-header__title">SmartPass</h2>
          <p class="sp-header__subtitle">Enter your 4-digit PIN to confirm</p>
          <div class="sp-pin-wrap">
            <input class="sp-pin-box" type="tel" maxlength="1" data-index="0" inputmode="numeric" autocomplete="off" />
            <input class="sp-pin-box" type="tel" maxlength="1" data-index="1" inputmode="numeric" autocomplete="off" />
            <input class="sp-pin-box" type="tel" maxlength="1" data-index="2" inputmode="numeric" autocomplete="off" />
            <input class="sp-pin-box" type="tel" maxlength="1" data-index="3" inputmode="numeric" autocomplete="off" />
          </div>
          <button class="sp-verify-btn" id="spVerifyBtn" disabled>Verify &amp; ${partner.cta || 'Subscribe'}</button>
        </div>

        <!-- Loading Screen -->
        <div class="sp-screen sp-screen--hidden" id="spLoadingScreen">
          <div class="sp-loading">
            <div class="sp-spinner"></div>
            <p class="sp-loading__text">Verifying your SmartPass</p>
            <p class="sp-loading__sub">Please wait a moment...</p>
          </div>
        </div>

        <!-- Success Screen -->
        <div class="sp-screen sp-screen--hidden" id="spSuccessScreen">
          <div class="sp-success">
            <div class="sp-success__icon">${checkIcon}</div>
            <h2 class="sp-success__title">Subscription Activated!</h2>
            <p class="sp-success__subtitle">Your benefit has been successfully activated</p>
            <p class="sp-success__brand">${partner.brand}</p>
            <p class="sp-success__desc">${partner.description}</p>
            ${partner.code ? `
              <div class="sp-success__code-box">
                <span class="sp-success__code">${partner.code}</span>
              </div>
            ` : ''}
            <div class="sp-success__actions">
              <button class="sp-success__btn sp-success__btn--ghost" onclick="RewardDetailPage._closeSmartPass(); Router.navigate('/rewards')">Rewards</button>
              <button class="sp-success__btn sp-success__btn--primary" onclick="RewardDetailPage._closeSmartPass(); Router.navigate('/my-bookings')">My Bookings</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('active');
      });
    });

    // Focus first PIN box
    setTimeout(() => {
      const firstPin = overlay.querySelector('.sp-pin-box[data-index="0"]');
      if (firstPin) firstPin.focus();
    }, 350);

    // Bind events
    this._bindSmartPassEvents(overlay);
  },

  _bindSmartPassEvents(overlay) {
    const pins = overlay.querySelectorAll('.sp-pin-box');
    const verifyBtn = overlay.querySelector('#spVerifyBtn');
    const cancelBtn = overlay.querySelector('#spCancelBtn');

    // PIN input handling
    pins.forEach((pin, i) => {
      pin.addEventListener('input', () => {
        const val = pin.value.replace(/\D/g, '');
        pin.value = val.charAt(0) || '';
        if (val && i < 3) {
          pins[i + 1].focus();
        }
        pin.classList.toggle('filled', !!pin.value);
        // Enable/disable verify button
        const allFilled = Array.from(pins).every(p => p.value.length === 1);
        verifyBtn.disabled = !allFilled;
      });

      pin.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !pin.value && i > 0) {
          pins[i - 1].focus();
          pins[i - 1].value = '';
          pins[i - 1].classList.remove('filled');
          verifyBtn.disabled = true;
        }
      });

      pin.addEventListener('focus', () => pin.select());
    });

    // Verify button
    verifyBtn.addEventListener('click', () => this._verifySmartPass());

    // Cancel button
    cancelBtn.addEventListener('click', () => this._closeSmartPass());

    // Backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this._closeSmartPass();
    });
  },

  _verifySmartPass() {
    const overlay = document.getElementById('spOverlay');
    if (!overlay) return;

    // Switch to loading screen
    overlay.querySelector('#spPinScreen').classList.add('sp-screen--hidden');
    overlay.querySelector('#spLoadingScreen').classList.remove('sp-screen--hidden');

    // Mock verification delay
    setTimeout(() => {
      const partner = this._partner;
      if (!partner) return;

      // Create reward booking
      const booking = Store.createRewardBooking({
        rewardId: partner.id,
        brand: partner.brand,
        description: partner.description,
        code: partner.code,
        image: partner.image,
        gradient: partner.gradient,
      });

      // Switch to success screen
      overlay.querySelector('#spLoadingScreen').classList.add('sp-screen--hidden');
      overlay.querySelector('#spSuccessScreen').classList.remove('sp-screen--hidden');

      this._booking = booking;
    }, 2000);
  },

  _closeSmartPass() {
    const overlay = document.getElementById('spOverlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    setTimeout(() => {
      if (overlay.parentNode) overlay.remove();
    }, 350);
  },
};
