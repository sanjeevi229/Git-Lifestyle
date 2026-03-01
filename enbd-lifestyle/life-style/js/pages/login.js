// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Login Page
// ══════════════════════════════════════════════

const LoginPage = {
  render() {
    const userCards = USERS.map(u => {
      const tier = CONFIG.cardTiers[u.cardTier];
      return `
        <div class="login-persona" data-user-id="${u.id}" style="border-left:4px solid ${tier.color}">
          <div class="login-persona__avatar" style="background:${tier.color}">${u.avatar}</div>
          <div class="login-persona__info">
            <div class="login-persona__name">${u.name}</div>
            <div class="login-persona__tier" style="color:${tier.color}">${tier.label} Card</div>
            <div class="login-persona__location">${u.location}</div>
          </div>
          <span class="login-persona__arrow">→</span>
        </div>
      `;
    }).join('');

    return `
      <div class="login-page">
        <div class="login-page__bg"></div>
        <div class="login-card">
          <div class="login-card__header">
            <span class="login-card__logo"></span>
            <h1 class="login-card__title">Lifestyle</h1>
            <p class="login-card__subtitle">Select your card profile to explore exclusive offers</p>
          </div>
          <div class="login-card__personas">
            ${userCards}
          </div>
          <div class="login-card__footer">
            <p class="text-xs text-muted text-center">Prototype — Select a persona to preview tier-based experiences</p>
          </div>
        </div>
      </div>
    `;
  },

  mount() {
    delegate('#app', 'click', '.login-persona', (e, el) => {
      const userId = el.dataset.userId;
      if (Auth.login(userId)) {
        Router.navigate('/home');
      }
    });
  },

  unmount() {}
};

window.LoginPage = LoginPage;
