// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Format Utilities
// ══════════════════════════════════════════════

const Format = {
  greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  },

  currency(amount, currency = 'AED') {
    return `${currency} ${Number(amount).toFixed(2)}`;
  },

  date(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  dateTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-AE', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  },

  time(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' });
  },

  relativeTime(dateStr) {
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return Format.date(dateStr);
  },

  truncate(str, max = 80) {
    if (!str) return '';
    if (str.length <= max) return str;
    return str.slice(0, max) + '...';
  },

  // ── Lifestyle-specific helpers ──

  bookingId() {
    const num = Math.floor(Math.random() * 90000) + 10000;
    return `BKG-2026-${num}`;
  },

  confirmationCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'ENBD-';
    for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  },

  tierLabel(tier) {
    return CONFIG.cardTiers[tier]?.label || tier;
  },

  tierBadge(tier) {
    const config = CONFIG.cardTiers[tier];
    if (!config) return '';
    return `<span class="tier-badge" style="background:${config.color};color:#fff">${config.label}</span>`;
  },

  discountLabel(offer) {
    if (!offer) return '';
    switch (offer.offerType) {
      case 'discount':
        if (offer.discountValue == null) return 'Special Offer';
        if (offer.discountUnit === 'percent') return `${offer.discountValue}% OFF`;
        if (offer.discountUnit === 'aed') return `AED ${offer.discountValue} OFF`;
        if (offer.discountValue === 0) return '0% Installment';
        return `${offer.discountValue}% OFF`;
      case 'bogo': return 'Buy 1 Get 1';
      case 'cashback': return `${offer.discountValue}% Cashback`;
      case 'complimentary': return 'Complimentary';
      case 'upgrade': return 'Free Upgrade';
      default: return 'Special Offer';
    }
  },

  discountBadgeClass(offer) {
    switch (offer.offerType) {
      case 'discount': return 'discount-badge--red';
      case 'bogo': return 'discount-badge--blue';
      case 'cashback': return 'discount-badge--green';
      case 'complimentary': return 'discount-badge--gold';
      case 'upgrade': return 'discount-badge--purple';
      default: return 'discount-badge--blue';
    }
  },

  daysUntil(dateStr) {
    const now = new Date();
    const target = new Date(dateStr);
    const diff = Math.ceil((target - now) / 86400000);
    if (diff < 0) return 'Expired';
    if (diff === 0) return 'Ends today';
    if (diff === 1) return '1 day left';
    return `${diff} days left`;
  },

  rating(num) {
    return `${Number(num).toFixed(1)} ★`;
  },

  ratingStars(num) {
    const full = Math.floor(num);
    const half = num % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  },

  timeRange(start, end) {
    return `${Format.time(start)} — ${Format.time(end)}`;
  },

  bookingStatus(status) {
    const map = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      completed: 'Completed',
      cancelled: 'Cancelled',
      expired: 'Expired',
    };
    return map[status] || status;
  },

  bookingStatusVariant(status) {
    const map = {
      pending: 'warning',
      confirmed: 'info',
      completed: 'success',
      cancelled: 'danger',
      expired: 'neutral',
    };
    return map[status] || 'neutral';
  },

  categoryIcon(catId) {
    const cat = CONFIG.categories.find(c => c.id === catId);
    return cat ? cat.icon : Icons.package(20);
  },

  categoryLabel(catId) {
    const cat = CONFIG.categories.find(c => c.id === catId);
    return cat ? cat.label : catId;
  },

  offerImage(offer) {
    if (offer.image) return `<img src="${offer.image}" alt="${offer.title}" loading="lazy" />`;
    return `<div style="font-size:48px;text-align:center;padding:40px">${Format.categoryIcon(offer.category)}</div>`;
  },

  eventDateBadge(dateStr) {
    const d = new Date(dateStr);
    const month = d.toLocaleDateString('en-AE', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    return `<div class="event-date-badge"><span class="event-date-badge__month">${month}</span><span class="event-date-badge__day">${day}</span></div>`;
  },

  spotsLeft(capacity, booked) {
    const left = capacity - booked;
    if (left <= 0) return '<span class="text-danger text-semibold">Sold Out</span>';
    if (left <= 10) return `<span class="text-warning text-semibold">${left} spots left</span>`;
    return `<span class="text-success">${left} spots available</span>`;
  },
};

window.Format = Format;
