// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Audit Logger
// ══════════════════════════════════════════════

const AuditLog = {
  log(action, details) {
    const user = Store.get('auth.currentUser');
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
      action,
      userId: user ? user.id : 'SYSTEM',
      userName: user ? user.name : 'System',
      details
    };
    const logs = Store.get('auditLog') || [];
    logs.unshift(entry);
    if (logs.length > 500) logs.length = 500;
    Store.set('auditLog', logs);
    return entry;
  },

  getRecent(count = 20) {
    const logs = Store.get('auditLog') || [];
    return logs.slice(0, count);
  },

  getByBooking(bookingId) {
    const logs = Store.get('auditLog') || [];
    return logs.filter(l => l.details && l.details.includes(bookingId));
  }
};

window.AuditLog = AuditLog;
