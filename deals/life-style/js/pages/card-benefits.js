// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Card Benefits Page
// ══════════════════════════════════════════════

const CardBenefitsPage = {
  render() {
    const currentTier = Auth.getCardTier();
    const tiers = Object.entries(CONFIG.cardTiers);
    const benefitKeys = [
      { key: 'dining', label: 'Dining', icon: Icons.utensils(16) },
      { key: 'entertainment', label: 'Entertainment', icon: Icons.theater(16) },
      { key: 'wellness', label: 'Wellness', icon: Icons.heart(16) },
      { key: 'travel', label: 'Travel', icon: Icons.plane(16) },
      { key: 'shopping', label: 'Shopping', icon: Icons.shoppingBag(16) },
      { key: 'lounge', label: 'Airport Lounge', icon: Icons.sofa(16) },
      { key: 'golf', label: 'Golf', icon: Icons.golf(16) },
      { key: 'points', label: 'Reward Points', icon: Icons.gem(16) },
    ];

    const headerCells = tiers.map(([tier, cfg]) => `
      <th class="tier-header ${tier === currentTier ? 'tier-header--active' : ''}" style="--tier-color:${cfg.color}">
        <div class="tier-header__label">${cfg.label}</div>
        ${tier === currentTier ? '<div class="tier-header__badge">Your Card</div>' : ''}
      </th>
    `).join('');

    const rows = benefitKeys.map(bk => {
      const cells = tiers.map(([tier]) => {
        const value = CARD_BENEFITS[tier]?.[bk.key];
        const isCurrent = tier === currentTier;
        return `
          <td class="${isCurrent ? 'active-tier' : ''} ${!value ? 'benefit-na' : ''}">
            ${value || '—'}
          </td>
        `;
      }).join('');

      return `
        <tr>
          <td class="benefit-label">
            <span class="benefit-label__icon">${bk.icon}</span>
            ${bk.label}
          </td>
          ${cells}
        </tr>
      `;
    }).join('');

    return `
      <div class="page">
        ${Nav.render()}
        <main class="page__main page__main--full">
          <div class="container">
            <div class="benefits-page__header">
              <h1 class="page-title">Card Benefits Comparison</h1>
              <p class="text-muted">See what's included with each Demo card tier</p>
            </div>

            <div class="benefits-table-wrapper">
              <table class="benefits-table">
                <thead>
                  <tr>
                    <th class="benefit-label-header">Benefit</th>
                    ${headerCells}
                  </tr>
                </thead>
                <tbody>
                  ${rows}
                </tbody>
              </table>
            </div>

            <div class="benefits-cta" style="text-align:center;padding:40px 0">
              <h3>Want to upgrade your card?</h3>
              <p class="text-muted" style="margin-top:8px">Contact your relationship manager or visit any Demo branch</p>
              <button class="btn btn--primary btn--lg" style="margin-top:16px" onclick="">Upgrade Your Card</button>
            </div>
          </div>
        </main>
      </div>
    `;
  },

  mount() {
    Nav.mount();
  },

  unmount() {},
};

window.CardBenefitsPage = CardBenefitsPage;
