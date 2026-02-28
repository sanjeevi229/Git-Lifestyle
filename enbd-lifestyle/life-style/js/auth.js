// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Auth Module
// ══════════════════════════════════════════════

const Auth = {
  login(userId) {
    const user = USERS.find(u => u.id === userId);
    if (!user) return false;
    Store.set('auth', { isLoggedIn: true, currentUser: user });
    AuditLog.log('LOGIN', `${user.name} logged in with ${CONFIG.cardTiers[user.cardTier].label} card.`);
    return true;
  },

  logout() {
    const user = Store.get('auth.currentUser');
    if (user) AuditLog.log('LOGOUT', `${user.name} logged out.`);
    // Re-login as default user (Infinite card)
    this.login('USR-004');
    Router.navigate('/home');
  },

  isLoggedIn() {
    return Store.get('auth.isLoggedIn') === true;
  },

  getCurrentUser() {
    return Store.get('auth.currentUser');
  },

  getCardTier() {
    const user = this.getCurrentUser();
    return user ? user.cardTier : null;
  },

  getTierLevel() {
    const tier = this.getCardTier();
    return tier ? (CONFIG.cardTiers[tier]?.level || 1) : 0;
  },

  getTierConfig() {
    const tier = this.getCardTier();
    return tier ? CONFIG.cardTiers[tier] : null;
  },

  canAccessOffer(offer) {
    const minLevel = CONFIG.cardTiers[offer.minTier]?.level || 1;
    return this.getTierLevel() >= minLevel;
  },
};

window.Auth = Auth;
