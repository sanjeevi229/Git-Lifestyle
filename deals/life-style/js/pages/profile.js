// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Profile Page
// ══════════════════════════════════════════════

const ProfilePage = {
  render() {
    const user = Auth.getCurrentUser();
    if (!user) return '';
    const tierConfig = CONFIG.cardTiers[user.cardTier];

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">

          <!-- User Header -->
          <section class="prof-header">
            <div class="prof-header__card">
              <div class="prof-header__avatar">${user.avatar}</div>
              <h1 class="prof-header__name">${user.name}</h1>
              <span class="prof-header__tier" style="color:${tierConfig.color}">Visa ${tierConfig.label} Card</span>
            </div>
          </section>

          <!-- Sections -->
          <section class="container prof-body">

            <!-- FAQ -->
            <details class="prof-section">
              <summary class="prof-section__trigger">
                <span class="prof-section__icon">${Icons.alertCircle(20)}</span>
                <span class="prof-section__label">Frequently Asked Questions</span>
                <span class="prof-section__chevron">▾</span>
              </summary>
              <div class="prof-section__content">
                <details class="prof-faq">
                  <summary>What is Visa Lifestyle?</summary>
                  <p>Visa Lifestyle is an exclusive platform for Visa cardholders offering curated deals, experiences, and rewards across dining, travel, entertainment, shopping, and more.</p>
                </details>
                <details class="prof-faq">
                  <summary>How do I earn Plus Points?</summary>
                  <p>You earn Plus Points on every eligible transaction made with your Visa card. Points accumulate automatically and can be viewed in the Plus Points section of the app.</p>
                </details>
                <details class="prof-faq">
                  <summary>How do I redeem offers?</summary>
                  <p>Browse available offers, tap "Book Now" on any deal, and follow the booking steps. Your discount or benefit will be applied automatically at the partner location.</p>
                </details>
                <details class="prof-faq">
                  <summary>Can I use offers internationally?</summary>
                  <p>Yes! Many of our hotel, travel, and shopping offers are available across multiple countries. Use the country filter on the Hotels page to explore international deals.</p>
                </details>
                <details class="prof-faq">
                  <summary>How do I upgrade my card tier?</summary>
                  <p>Card tier upgrades are managed by your issuing bank. Contact your bank to learn about eligibility for Gold, Platinum, or Infinite card upgrades and their additional benefits.</p>
                </details>
                <details class="prof-faq">
                  <summary>What is the Concierge service?</summary>
                  <p>The Concierge service provides personalised assistance for travel bookings, restaurant reservations, event tickets, and lifestyle requests — available exclusively for Platinum and Infinite cardholders.</p>
                </details>
              </div>
            </details>

            <!-- Privacy Policy -->
            <details class="prof-section">
              <summary class="prof-section__trigger">
                <span class="prof-section__icon">${Icons.shield(20)}</span>
                <span class="prof-section__label">Privacy Policy</span>
                <span class="prof-section__chevron">▾</span>
              </summary>
              <div class="prof-section__content">
                <p>Your privacy is important to us. Visa Lifestyle collects and processes personal data in accordance with applicable data protection regulations.</p>
                <p><strong>Data We Collect:</strong> Name, email, card tier, booking history, and usage preferences to personalise your experience.</p>
                <p><strong>How We Use It:</strong> To provide tailored offers, process bookings, manage your Plus Points balance, and improve our services.</p>
                <p><strong>Data Sharing:</strong> We share limited information with partner merchants solely to fulfil your bookings and apply offer benefits. We do not sell personal data to third parties.</p>
                <p><strong>Your Rights:</strong> You may request access, correction, or deletion of your personal data at any time by contacting our support team.</p>
              </div>
            </details>

            <!-- Terms & Conditions -->
            <details class="prof-section">
              <summary class="prof-section__trigger">
                <span class="prof-section__icon">${Icons.clipboard(20)}</span>
                <span class="prof-section__label">Terms & Conditions</span>
                <span class="prof-section__chevron">▾</span>
              </summary>
              <div class="prof-section__content">
                <p><strong>Eligibility:</strong> Visa Lifestyle benefits are available to holders of valid Visa cards issued by participating banks. Benefits vary by card tier.</p>
                <p><strong>Offers:</strong> All offers are subject to availability, merchant terms, and expiry dates as displayed. Visa does not guarantee availability at all times.</p>
                <p><strong>Bookings:</strong> Confirmed bookings are subject to partner cancellation policies. Refund timelines depend on the individual merchant.</p>
                <p><strong>Plus Points:</strong> Points have no cash value and cannot be transferred between accounts. Points expire 24 months from the date of accrual unless otherwise stated.</p>
                <p><strong>Liability:</strong> Visa Lifestyle acts as an intermediary between cardholders and partner merchants. Service quality and delivery are the responsibility of the respective partners.</p>
              </div>
            </details>

            <!-- Contact & Support -->
            <details class="prof-section">
              <summary class="prof-section__trigger">
                <span class="prof-section__icon">${Icons.heart(20)}</span>
                <span class="prof-section__label">Contact & Support</span>
                <span class="prof-section__chevron">▾</span>
              </summary>
              <div class="prof-section__content">
                <div class="prof-contact">
                  <div class="prof-contact__item">
                    <strong>Email</strong>
                    <span>support@visalifestyle.com</span>
                  </div>
                  <div class="prof-contact__item">
                    <strong>Phone</strong>
                    <span>+971 4 123 4567</span>
                  </div>
                  <div class="prof-contact__item">
                    <strong>Hours</strong>
                    <span>Sunday – Thursday, 9 AM – 6 PM (GST)</span>
                  </div>
                  <div class="prof-contact__item">
                    <strong>Concierge Hotline</strong>
                    <span>+971 4 987 6543 (Platinum & Infinite only)</span>
                  </div>
                </div>
              </div>
            </details>

            <!-- About -->
            <details class="prof-section">
              <summary class="prof-section__trigger">
                <span class="prof-section__icon">${Icons.info(20)}</span>
                <span class="prof-section__label">About</span>
                <span class="prof-section__chevron">▾</span>
              </summary>
              <div class="prof-section__content">
                <p><strong>Visa Lifestyle</strong> — Your gateway to exclusive experiences, curated deals, and premium rewards.</p>
                <p>Version 2.0.0</p>
                <p>&copy; 2026 Visa. All rights reserved.</p>
              </div>
            </details>

          </section>
        </main>
      </div>
    `;
  },

  mount() {
    Nav.mount();
  },
};

window.ProfilePage = ProfilePage;
