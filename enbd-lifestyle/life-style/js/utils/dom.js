// ══════════════════════════════════════════════
// DEMO LIFESTYLE — DOM Utilities
// ══════════════════════════════════════════════

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'className') e.className = v;
    else if (k === 'innerHTML') e.innerHTML = v;
    else if (k === 'textContent') e.textContent = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (k === 'dataset') Object.entries(v).forEach(([dk, dv]) => e.dataset[dk] = dv);
    else e.setAttribute(k, v);
  });
  children.forEach(c => {
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else if (c) e.appendChild(c);
  });
  return e;
}

function render(container, html) {
  if (typeof container === 'string') container = $(container);
  if (!container) return;
  container.innerHTML = typeof html === 'string' ? html : '';
}

function delegate(parent, event, selector, handler) {
  if (typeof parent === 'string') parent = $(parent);
  if (!parent) return;
  parent.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) handler(e, target);
  });
}

function cardShare(title, route) {
  const url = window.location.origin + window.location.pathname + '#' + route;
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).catch(() => {});
  }
}

window.$ = $;
window.$$ = $$;
window.el = el;
window.render = render;
window.delegate = delegate;
window.cardShare = cardShare;
