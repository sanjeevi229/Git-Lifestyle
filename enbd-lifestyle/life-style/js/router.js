// ══════════════════════════════════════════════
// DEMO LIFESTYLE — SPA Router
// ══════════════════════════════════════════════

const Router = {
  _routes: {},
  _currentPage: null,

  register(path, handler) {
    this._routes[path] = handler;
  },

  init() {
    window.addEventListener('hashchange', () => this._resolve());
    this._resolve();
  },

  navigate(path) {
    window.location.hash = '#' + path;
  },

  _resolve() {
    const hash = window.location.hash.slice(1) || '/home';
    const [path, queryStr] = hash.split('?');
    const query = {};
    if (queryStr) {
      queryStr.split('&').forEach(p => {
        const [k, v] = p.split('=');
        query[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }

    // Ensure user is always logged in
    if (!Auth.isLoggedIn()) {
      Auth.login('USR-004');
    }

    if (this._routes[path]) {
      this._render(path, this._routes[path], {}, query);
      return;
    }

    for (const [routePath, handler] of Object.entries(this._routes)) {
      const params = this._matchRoute(routePath, path);
      if (params) {
        this._render(path, handler, params, query);
        return;
      }
    }

    this._render404(path);
  },

  _matchRoute(routePath, actualPath) {
    const routeParts = routePath.split('/');
    const actualParts = actualPath.split('/');
    if (routeParts.length !== actualParts.length) return null;
    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = actualParts[i];
      } else if (routeParts[i] !== actualParts[i]) {
        return null;
      }
    }
    return params;
  },

  _render(path, handler, params, query) {
    if (this._currentPage && this._currentPage.unmount) {
      this._currentPage.unmount();
    }
    const app = $('#app');
    if (!app) return;
    app.innerHTML = handler.render(params, query);
    this._currentPage = handler;
    if (handler.mount) {
      handler.mount(params, query);
    }
    window.scrollTo(0, 0);
  },

  _render404(path) {
    const app = $('#app');
    if (!app) return;
    app.innerHTML = `
      <div class="page">
        ${Nav.render()}
        <div class="container">
          <div class="empty-state" style="padding-top:120px">
            <div class="empty-state__icon">🔍</div>
            <h2 class="empty-state__title">Page Not Found</h2>
            <p class="empty-state__text">The page "${path}" doesn't exist.</p>
            <button class="btn btn--primary" onclick="Router.navigate('/home')">Go Home</button>
          </div>
        </div>
      </div>
    `;
  },

  getHash() {
    return window.location.hash.slice(1) || '/home';
  }
};

window.Router = Router;
