// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Toast Notifications
// ══════════════════════════════════════════════

const Toast = {
  _container: null,

  _ensureContainer() {
    if (!this._container || !document.body.contains(this._container)) {
      this._container = document.createElement('div');
      this._container.className = 'toast-container';
      document.body.appendChild(this._container);
    }
  },

  show(message, type = 'info', duration = 3000) {
    this._ensureContainer();
    const iconMap = { success: Icons.check(16), danger: Icons.close(16), warning: Icons.alertTriangle(16), info: Icons.info(16) };
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast__icon">${iconMap[type] || Icons.info(16)}</span>
      <span class="toast__message">${message}</span>
      <span class="toast__close" onclick="this.parentElement.remove()">${Icons.close(14)}</span>
    `;
    this._container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'danger'); },
  warning(msg) { this.show(msg, 'warning'); },
  info(msg) { this.show(msg, 'info'); }
};

window.Toast = Toast;
