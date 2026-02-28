// ══════════════════════════════════════════════
// DEMO LIFESTYLE — SVG Icon Library
// Consistent line icons (Lucide-style, 24x24 viewBox)
// ══════════════════════════════════════════════

const Icons = {
  // Helper: wraps SVG with consistent attributes
  _svg(paths, size = 20, cls = '') {
    return `<svg class="icon${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="${size}" height="${size}">${paths}</svg>`;
  },

  // ── Navigation & UI ──
  home(s=20)       { return this._svg('<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>', s); },
  menu(s=20)       { return this._svg('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>', s); },
  close(s=20)      { return this._svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', s); },
  search(s=20)     { return this._svg('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>', s); },
  logout(s=20)     { return this._svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>', s); },

  // ── Location, Time, Contact ──
  mapPin(s=20)     { return this._svg('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>', s); },
  clock(s=20)      { return this._svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', s); },
  phone(s=20)      { return this._svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>', s); },
  calendar(s=20)   { return this._svg('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', s); },

  // ── Categories ──
  utensils(s=20)   { return this._svg('<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="22"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>', s); },
  theater(s=20)    { return this._svg('<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>', s); },
  heart(s=20)      { return this._svg('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>', s); },
  plane(s=20)      { return this._svg('<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>', s); },
  shoppingBag(s=20){ return this._svg('<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>', s); },
  bell(s=20)       { return this._svg('<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>', s); },
  tag(s=20)        { return this._svg('<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>', s); },
  ticket(s=20)     { return this._svg('<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><line x1="13" y1="5" x2="13" y2="9"/><line x1="13" y1="15" x2="13" y2="19"/>', s); },
  creditCard(s=20) { return this._svg('<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>', s); },
  clipboard(s=20)  { return this._svg('<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>', s); },
  package(s=20)    { return this._svg('<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>', s); },
  star(s=20)       { return this._svg('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', s); },

  // ── Card Benefits specific ──
  sofa(s=20)       { return this._svg('<path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/>', s); },
  golf(s=20)       { return this._svg('<circle cx="12" cy="18" r="3"/><path d="M12 2v13"/><path d="M12 2l7 4-7 4"/>', s); },
  gem(s=20)        { return this._svg('<polygon points="12 2 2 7 12 22 22 7"/><polyline points="2 7 12 12 22 7"/><line x1="12" y1="12" x2="12" y2="22"/>', s); },

  // ── Rewards ──
  gift(s=20)       { return this._svg('<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>', s); },

  // ── Actions ──
  share(s=20)      { return this._svg('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>', s); },
  wallet(s=20)     { return this._svg('<rect x="1" y="5" width="22" height="16" rx="2"/><path d="M1 10h22"/><rect x="15" y="13" width="4" height="4" rx="1"/>', s); },

  // ── Security & Trust ──
  shield(s=20)     { return this._svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', s); },

  // ── Status & Feedback ──
  checkCircle(s=20){ return this._svg('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>', s); },
  check(s=20)      { return this._svg('<polyline points="20 6 9 17 4 12"/>', s); },
  alertCircle(s=20){ return this._svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>', s); },
  xCircle(s=20)    { return this._svg('<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>', s); },
  info(s=20)       { return this._svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>', s); },
  alertTriangle(s=20){ return this._svg('<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>', s); },
  timer(s=20)      { return this._svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 8 14"/>', s); },
  users(s=20)      { return this._svg('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', s); },
  user(s=20)       { return this._svg('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', s); },

  // ══════════════════════════════════════════════
  // SUBCATEGORY ICONS
  // ══════════════════════════════════════════════

  // ── Dining Subcategories ──
  bowlSteam(s=20)  { return this._svg('<path d="M3 14h18c0 4.4-3.6 8-9 8s-9-3.6-9-8z"/><path d="M9 6c.5 1-.5 2 0 3"/><path d="M12 4c.5 1-.5 2 0 3"/><path d="M15 6c.5 1-.5 2 0 3"/>', s); },
  pot(s=20)        { return this._svg('<path d="M2 12h20"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7"/><line x1="10" y1="5" x2="10" y2="9"/><line x1="14" y1="5" x2="14" y2="9"/>', s); },
  globe(s=20)      { return this._svg('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>', s); },
  wheat(s=20)      { return this._svg('<path d="M2 22 16 8"/><path d="M3.5 12.5 5 11l1.5 1.5a3 3 0 0 1 0 4.24"/><path d="M7.5 8.5 9 7l1.5 1.5a3 3 0 0 1 0 4.24"/><path d="M11.5 4.5 13 3l1.5 1.5a3 3 0 0 1 0 4.24"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4z"/>', s); },
  skewer(s=20)     { return this._svg('<line x1="12" y1="2" x2="12" y2="22"/><rect x="8" y="5" width="8" height="4" rx="2"/><rect x="8" y="12" width="8" height="4" rx="2"/>', s); },
  croissant(s=20)  { return this._svg('<path d="M4.6 13.11 5.8 5.6a2 2 0 0 1 2-1.6h8.4a2 2 0 0 1 2 1.6l1.2 7.51"/><path d="M3 16.5c2-2 5.5-3 9-3s7 1 9 3"/><path d="M3 16.5c0 3 4 5 9 5s9-2 9-5"/>', s); },
  chopsticks(s=20) { return this._svg('<line x1="8" y1="3" x2="13" y2="21"/><line x1="16" y1="3" x2="11" y2="21"/>', s); },
  ramen(s=20)      { return this._svg('<path d="M3 14h18c0 4.4-3.6 8-9 8s-9-3.6-9-8z"/><line x1="8" y1="14" x2="9.5" y2="3"/><line x1="16" y1="14" x2="14.5" y2="3"/>', s); },
  bento(s=20)      { return this._svg('<rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="5" x2="12" y2="12"/>', s); },
  fish(s=20)       { return this._svg('<path d="M6.5 12c3-6 10.5-6 14 0-3.5 6-11 6-14 0z"/><circle cx="17" cy="12" r="1"/><path d="M2.5 12l4-3v6z"/>', s); },
  flatbread(s=20)  { return this._svg('<ellipse cx="12" cy="12" rx="9" ry="7"/><path d="M8 10c2 1 4 1 6 0"/><path d="M7 14c2.5 1 5.5 1 8 0"/>', s); },
  olive(s=20)      { return this._svg('<path d="M2 22 17 7"/><circle cx="12" cy="12" r="4"/><circle cx="7" cy="17" r="3"/>', s); },

  // ── Wellness Subcategories ──
  droplet(s=20)    { return this._svg('<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>', s); },
  dumbbell(s=20)   { return this._svg('<line x1="7" y1="12" x2="17" y2="12"/><rect x="2" y="7" width="5" height="10" rx="1.5"/><rect x="17" y="7" width="5" height="10" rx="1.5"/>', s); },
  lotus(s=20)      { return this._svg('<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5v5"/><path d="M5 21l4-8.5h6l4 8.5"/><path d="M8 12.5l-4 1"/><path d="M16 12.5l4 1"/>', s); },
  sparkles(s=20)   { return this._svg('<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 16l.75 2.25L22 19l-2.25.75L19 22l-.75-2.25L16 19l2.25-.75z"/>', s); },
  stretch(s=20)    { return this._svg('<circle cx="18" cy="4" r="2"/><path d="M2 20l6-6 4-2"/><path d="M12 12l6-6"/><path d="M12 12l4 6"/>', s); },
  handOpen(s=20)   { return this._svg('<path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6"/><path d="M10 10V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8a8 8 0 0 0 16 0v-2a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/>', s); },
  leaf(s=20)       { return this._svg('<path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8-1 3.5-3.5 5-6 6.5"/><path d="M2 21c0-3 1.5-5 4-6.5"/>', s); },
  apple(s=20)      { return this._svg('<path d="M12 3a1 1 0 0 0 2-1"/><path d="M7.5 7.5C5 8.5 3 11 3 14c0 4 2.5 8 5 8 1 0 2-.5 4-.5s3 .5 4 .5c2.5 0 5-4 5-8 0-3-2-5.5-4.5-6.5a5 5 0 0 0-9 0z"/>', s); },

  // ── Entertainment Subcategories ──
  clapperboard(s=20){ return this._svg('<path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M4 11l16 0"/><path d="M4 11l3-8h10l3 8"/><line x1="8" y1="3" x2="10" y2="11"/><line x1="14" y1="3" x2="16" y2="11"/>', s); },
  ferrisWheel(s=20){ return this._svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 4v-2"/><path d="M7 20l5-8 5 8"/>', s); },
  trophy(s=20)     { return this._svg('<path d="M6 3h12v6a6 6 0 0 1-12 0V3z"/><path d="M6 5H3a1 1 0 0 0-1 1v1a4 4 0 0 0 4 4"/><path d="M18 5h3a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4"/><line x1="12" y1="15" x2="12" y2="18"/><path d="M8 21h8"/><path d="M8 18h8"/>', s); },
  music(s=20)      { return this._svg('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>', s); },
  mountain(s=20)   { return this._svg('<path d="m8 3 4 8 5-5 5 16H2z"/>', s); },
  gamepad(s=20)    { return this._svg('<rect x="2" y="6" width="20" height="12" rx="4"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="11" r="1"/><circle cx="18" cy="13" r="1"/>', s); },
  palette(s=20)    { return this._svg('<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.4-.15-.75-.4-1.05-.24-.3-.38-.65-.38-1.05 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-10-10-10z"/><circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r="1.5" fill="currentColor" stroke="none"/><circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none"/>', s); },

  // ── Travel Subcategories ──
  compass(s=20)    { return this._svg('<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>', s); },
  anchor(s=20)     { return this._svg('<circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>', s); },
  palmTree(s=20)   { return this._svg('<path d="M13 8c0-2.76-2.46-5-5.5-5-1.29 0-2.5.4-3.5 1.1"/><path d="M13 8c0-2.76 2.46-5 5.5-5 1.29 0 2.5.4 3.5 1.1"/><path d="M13 7.14A5.82 5.82 0 0 1 16.9 6c.97 0 1.88.26 2.65.7"/><path d="M13 7.14A5.82 5.82 0 0 0 9.1 6c-.97 0-1.88.26-2.65.7"/><path d="M12 22V8"/>', s); },
  luggage(s=20)    { return this._svg('<path d="M6 20V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12"/><rect x="4" y="18" width="16" height="4" rx="1"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>', s); },
  sunrise(s=20)    { return this._svg('<path d="M12 2v4"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="M16 18a4 4 0 0 0-8 0"/>', s); },
  tent(s=20)       { return this._svg('<path d="M3.5 21L12 3l8.5 18"/><path d="M12 3v18"/><path d="M20.5 21h-17"/>', s); },
  ship(s=20)       { return this._svg('<path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 9V3"/>', s); },
  passport(s=20)   { return this._svg('<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="10" r="4"/><path d="M7 18h10"/>', s); },

  // ── Event Subcategories ──
  mic(s=20)        { return this._svg('<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/>', s); },

  // ── Shopping Subcategories ──
  shirt(s=20)      { return this._svg('<path d="M20.38 3.46L16 2l-4 4-4-4-4.38 1.46A2 2 0 0 0 2.26 5.35v3.15l3.74 1V22h12V9.5l3.74-1V5.35a2 2 0 0 0-1.36-1.89z"/>', s); },
  smartphone(s=20) { return this._svg('<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>', s); },
  wand(s=20)       { return this._svg('<path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8l1.2 1.2"/><path d="M17.8 6.2l1.2-1.2"/><path d="M11.2 6.2L10 5"/><path d="M11.2 11.8L10 13"/><circle cx="15" cy="9" r="3"/><path d="m3 21 8.5-8.5"/>', s); },
  ring(s=20)       { return this._svg('<path d="M8 2l4 4 4-4"/><circle cx="12" cy="14" r="7"/><circle cx="12" cy="14" r="3"/>', s); },
  sneaker(s=20)    { return this._svg('<path d="M2 18v-4l3-3 2 2 4-2 3 3 3-1 3 4v1H2z"/><path d="M2 18h20a1 1 0 0 0 1-1v0a1 1 0 0 0-1-1"/>', s); },
  toyBear(s=20)    { return this._svg('<circle cx="8" cy="5" r="3"/><circle cx="16" cy="5" r="3"/><circle cx="12" cy="14" r="7"/><circle cx="10" cy="12" r="1"/><circle cx="14" cy="12" r="1"/><path d="M10 16c1 1 2 1 4 0"/>', s); },
};

window.Icons = Icons;
