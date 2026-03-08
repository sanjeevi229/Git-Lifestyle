// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Chatbot Conversation Engine
// ══════════════════════════════════════════════

const ChatEngine = {

  /**
   * Process user input and return a response.
   * @param {string} userText
   * @returns {{ messages: Array, quickActions: string[] }}
   */
  process(userText) {
    const intent = this._matchIntent(userText);
    return this._generateResponse(intent, userText);
  },

  /* ── Intent Matching ── */
  _matchIntent(text) {
    const n = text.toLowerCase().trim();

    // Use word-boundary matching to avoid false positives
    // e.g. "hi" should not match inside "this"
    for (const intent of CHAT_INTENTS) {
      for (const p of intent.patterns) {
        // Multi-word patterns: check if the full phrase exists in the text
        // Single-word patterns: check with word boundaries
        if (p.includes(' ')) {
          if (n.includes(p)) return intent;
        } else {
          const re = new RegExp('(?:^|\\s|[^a-z])' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:$|\\s|[^a-z])', 'i');
          if (re.test(n) || n === p) return intent;
        }
      }
    }

    // Detect "book [specific name]" — strip booking verbs and search
    const bookMatch = n.match(/^(?:book|reserve|book me|get me|i want to book|can you book|please book)\s+(.+)/);
    if (bookMatch) {
      const query = bookMatch[1].trim();
      if (query.length >= 2) {
        const results = Store.searchAll(query);
        const total = results.offers.length + results.events.length + results.merchants.length;
        if (total > 0) return { id: 'book-search', data: results, query };
      }
    }

    // Fallback: try Store keyword search (full text)
    if (n.length >= 2) {
      const results = Store.searchAll(n);
      const total = results.offers.length + results.events.length + results.merchants.length;
      if (total > 0) return { id: 'search-results', data: results, query: n };

      // Also try stripping common prefixes for better matching
      const stripped = n.replace(/^(?:show me|find me|search for|look for|i want|i need|get me)\s+/, '').trim();
      if (stripped !== n && stripped.length >= 2) {
        const strippedResults = Store.searchAll(stripped);
        const strippedTotal = strippedResults.offers.length + strippedResults.events.length + strippedResults.merchants.length;
        if (strippedTotal > 0) return { id: 'search-results', data: strippedResults, query: stripped };
      }
    }

    return { id: 'fallback' };
  },

  /* ── Response Router ── */
  _generateResponse(intent, userText) {
    const user = Auth.getCurrentUser();
    const tier = CONFIG.cardTiers[user.cardTier];
    const name = user.name.split(' ')[0];

    switch (intent.id) {
      case 'greeting':            return this._greeting(name, tier);
      case 'help':                return this._help(name);
      case 'book-dining':         return this._bookCategory(user, tier, 'dining', 'dining');
      case 'book-entertainment':  return this._bookCategory(user, tier, 'entertainment', 'entertainment');
      case 'book-hotel':          return this._bookCategory(user, tier, 'hotels', 'travel');
      case 'book-flight':         return this._bookCategory(user, tier, 'flights', 'travel');
      case 'book-wellness':       return this._bookCategory(user, tier, 'wellness', 'wellness');
      case 'book-travel':         return this._bookCategory(user, tier, 'travel', 'travel');
      case 'book-golf':           return this._bookGolf(user, tier);
      case 'book-airport':        return this._bookAirport(user, tier);
      case 'book-shopping':       return this._bookShopping(user, tier);
      case 'book-search':         return this._bookSearch(intent.data, intent.query);
      case 'dining':              return this._dining(user, tier);
      case 'dining-nearby':       return this._diningNearby(user, tier);
      case 'events':              return this._events(user);
      case 'card-benefits':       return this._benefits(user, tier);
      case 'golf':                return this._golf(user, tier);
      case 'airport':             return this._airport(user, tier);
      case 'concierge':           return this._concierge(user, tier);
      case 'bookings':            return this._bookings();
      case 'expiring':            return this._expiring();
      case 'premium':             return this._premium(user, tier);
      case 'wellness':            return this._category(user, tier, 'wellness', 'wellness');
      case 'shopping':            return this._category(user, tier, 'shopping', 'shopping');
      case 'travel':              return this._category(user, tier, 'travel', 'travel');
      case 'entertainment':       return this._category(user, tier, 'entertainment', 'entertainment');
      case 'search-results':      return this._search(intent.data, intent.query);
      default:                    return this._fallback(name);
    }
  },

  /* ══════════════════════════════════════════════
     Response Generators
     Each returns { messages: [], quickActions: [] }
     ══════════════════════════════════════════════ */

  _greeting(name, tier) {
    return {
      messages: [
        { type: 'text', text: `${Format.greeting()}, ${name}! Welcome to your Visa ${tier.label} Concierge. How can I enhance your day?` }
      ],
      quickActions: ['Top dining deals', 'My card benefits', 'Upcoming events', 'Deals near me']
    };
  },

  _help(name) {
    return {
      messages: [{
        type: 'text',
        text: `${name}, I can help you with:\n\n` +
          '\u2022 **Dining** \u2014 Find restaurants, discover deals\n' +
          '\u2022 **Events** \u2014 Concerts, shows, festivals\n' +
          '\u2022 **Travel** \u2014 Flights, hotels, packages\n' +
          '\u2022 **Wellness** \u2014 Spa, fitness, beauty\n' +
          '\u2022 **Shopping** \u2014 Cashback, brand deals\n' +
          '\u2022 **Card Benefits** \u2014 Your tier privileges\n' +
          '\u2022 **Golf** \u2014 Tee times, courses\n' +
          '\u2022 **Airport** \u2014 Transfer bookings\n' +
          '\u2022 **Concierge** \u2014 Personal assistance\n' +
          '\u2022 **Bookings** \u2014 Your reservations\n\n' +
          'Just ask me anything or tap a suggestion below!'
      }],
      quickActions: ['Dining deals', 'My benefits', 'Events', 'Expiring offers']
    };
  },

  _dining(user, tier) {
    const offers = Store.getOffersByCategory('dining').slice(0, 3);
    const msgs = [{ type: 'text', text: `Here are the top dining experiences for your Visa ${tier.label} card:` }];
    offers.forEach(o => msgs.push({ type: 'offer-card', offer: o, merchant: Store.getMerchant(o.merchantId) }));
    if (offers.length === 0) msgs[0].text = 'No dining offers available right now. Check back soon!';
    return { messages: msgs, quickActions: ['Near me', 'Best discounts', 'Events', 'Card benefits'] };
  },

  _diningNearby(user, tier) {
    const area = user.location;
    const all = Store.getOffersByCategory('dining');
    const nearby = all.filter(o => {
      const m = Store.getMerchant(o.merchantId);
      return m && m.area === area;
    });

    if (nearby.length === 0) {
      const msgs = [{ type: 'text', text: `I couldn't find dining offers specifically in ${area}. Here are some popular options nearby:` }];
      all.slice(0, 3).forEach(o => msgs.push({ type: 'offer-card', offer: o, merchant: Store.getMerchant(o.merchantId) }));
      return { messages: msgs, quickActions: ['All dining', 'Other categories', 'Card benefits'] };
    }

    const msgs = [{ type: 'text', text: `Great news! Here are dining offers near ${area}:` }];
    nearby.slice(0, 3).forEach(o => msgs.push({ type: 'offer-card', offer: o, merchant: Store.getMerchant(o.merchantId) }));
    return { messages: msgs, quickActions: ['More dining', 'Other areas', 'Events'] };
  },

  _events() {
    const events = Store.getUpcomingEvents().slice(0, 3);
    if (events.length === 0) {
      return {
        messages: [{ type: 'text', text: 'No upcoming events at the moment. Check back soon for exciting experiences!' }],
        quickActions: ['Dining deals', 'Card benefits', 'Browse offers']
      };
    }
    const msgs = [{ type: 'text', text: 'Here are upcoming events you have access to:' }];
    events.forEach(e => msgs.push({ type: 'event-card', event: e }));
    return { messages: msgs, quickActions: ['Dining', 'Premium offers', 'Card benefits'] };
  },

  _benefits(user, tier) {
    const b = CARD_BENEFITS[user.cardTier];
    return {
      messages: [
        { type: 'text', text: `Here's a summary of your Visa ${tier.label} Card privileges:` },
        { type: 'benefits-card', benefits: b, tier: user.cardTier, tierLabel: tier.label }
      ],
      quickActions: ['Golf quota', 'Airport transfers', 'Concierge', 'Dining deals']
    };
  },

  _golf(user, tier) {
    const q = Store.getGolfQuota();
    const text = q.benefit
      ? `Your golf benefit: ${q.benefit}. You've used ${q.used} round${q.used !== 1 ? 's' : ''} with ${q.remaining === 999 ? 'unlimited' : q.remaining} remaining.`
      : 'Golf access is not included with your current card tier. Upgrade to Platinum or higher to enjoy complimentary golf rounds.';
    return {
      messages: [{ type: 'text', text }],
      quickActions: q.benefit ? ['Book a tee time', 'View courses', 'Card benefits'] : ['Card benefits', 'Dining deals']
    };
  },

  _airport(user, tier) {
    const q = Store.getAirportQuota();
    const text = q.benefit
      ? `Your airport transfer benefit: ${q.benefit}. ${q.remaining === 999 ? 'Unlimited' : q.remaining} transfers remaining.`
      : 'Airport transfers are not included with your current card tier.';
    return {
      messages: [{ type: 'text', text }],
      quickActions: q.benefit ? ['Book a transfer', 'Card benefits', 'Travel deals'] : ['Card benefits', 'Travel deals']
    };
  },

  _concierge(user, tier) {
    const q = Store.getConciergeQuota();
    const text = q.benefit
      ? `Your concierge benefit: ${q.benefit}. Our team can assist with restaurant reservations, event tickets, travel planning, gift sourcing, and more.`
      : 'Concierge services are available for Platinum and above card tiers.';
    return {
      messages: [{ type: 'text', text }],
      quickActions: q.benefit ? ['Request concierge', 'Dining deals', 'Events'] : ['Card benefits', 'Dining deals']
    };
  },

  _bookings() {
    const bookings = Store.get('bookings') || [];
    const active = bookings.filter(b => b.status === 'confirmed');
    const text = active.length > 0
      ? `You have ${active.length} active booking${active.length !== 1 ? 's' : ''}. Tap below to view them.`
      : 'You don\'t have any active bookings. Would you like to explore some offers?';
    return {
      messages: [{ type: 'text', text }],
      quickActions: active.length > 0 ? ['View bookings', 'Dining deals', 'Events'] : ['Dining deals', 'Events', 'Card benefits']
    };
  },

  _expiring() {
    const expiring = Store.getExpiringOffers(7);
    if (expiring.length === 0) {
      return {
        messages: [{ type: 'text', text: 'No offers expiring in the next 7 days. You\'re all caught up!' }],
        quickActions: ['Featured offers', 'Events', 'Card benefits']
      };
    }
    const msgs = [{ type: 'text', text: `${expiring.length} offer${expiring.length !== 1 ? 's' : ''} expiring within 7 days. Don't miss out!` }];
    expiring.slice(0, 3).forEach(o => msgs.push({ type: 'offer-card', offer: o, merchant: Store.getMerchant(o.merchantId) }));
    return { messages: msgs, quickActions: ['All offers', 'Events', 'Card benefits'] };
  },

  _premium(user, tier) {
    const premium = Store.getPremiumOffers().slice(0, 3);
    const msgs = [{ type: 'text', text: `These exclusive premium offers are curated for your Visa ${tier.label} card:` }];
    premium.forEach(o => msgs.push({ type: 'offer-card', offer: o, merchant: Store.getMerchant(o.merchantId) }));
    if (premium.length === 0) msgs[0].text = 'No premium offers available right now.';
    return { messages: msgs, quickActions: ['Dining', 'Travel', 'Entertainment', 'Card benefits'] };
  },

  _bookCategory(user, tier, catId, benefitKey) {
    const offers = Store.getOffersByCategory(catId).slice(0, 3);
    const label = benefitKey.charAt(0).toUpperCase() + benefitKey.slice(1);

    const msgs = [
      { type: 'text', text: `I'd be happy to help you book! Browse these ${label.toLowerCase()} options and tap **View Offer** to see details and make a booking:` }
    ];
    offers.forEach(o => msgs.push({ type: 'offer-card', offer: o, merchant: Store.getMerchant(o.merchantId) }));
    if (offers.length === 0) {
      msgs[0].text = `No ${label.toLowerCase()} options available for booking right now. Check back soon!`;
    }
    return { messages: msgs, quickActions: ['My bookings', 'Card benefits', 'Concierge', 'Dining deals'] };
  },

  _bookGolf(user, tier) {
    const q = Store.getGolfQuota();
    if (q.benefit) {
      return {
        messages: [
          { type: 'text', text: `Let's book your golf round! Your benefit: **${q.benefit}**. You have ${q.remaining === 999 ? 'unlimited' : q.remaining} rounds remaining. Tap below to browse courses and book your tee time.` }
        ],
        quickActions: ['View courses', 'Golf quota', 'My bookings', 'Card benefits']
      };
    }
    return {
      messages: [{ type: 'text', text: 'Golf access is not included with your current card tier. Upgrade to Platinum or higher to enjoy complimentary golf rounds.' }],
      quickActions: ['Card benefits', 'Dining deals', 'Events']
    };
  },

  _bookAirport(user, tier) {
    const q = Store.getAirportQuota();
    if (q.benefit) {
      return {
        messages: [
          { type: 'text', text: `I'll help you book an airport transfer! Your benefit: **${q.benefit}**. You have ${q.remaining === 999 ? 'unlimited' : q.remaining} transfers remaining. Tap below to schedule your pickup.` }
        ],
        quickActions: ['Book a transfer', 'My bookings', 'Card benefits', 'Travel deals']
      };
    }
    return {
      messages: [{ type: 'text', text: 'Airport transfers are not included with your current card tier. Consider upgrading for this benefit.' }],
      quickActions: ['Card benefits', 'Travel deals', 'Dining deals']
    };
  },

  _bookShopping(user, tier) {
    const offers = Store.getOffersByCategory('shopping').slice(0, 3);
    const msgs = [
      { type: 'text', text: `For shopping assistance, our **Concierge service** can help with personal shopping, gift sourcing, and luxury purchases. Meanwhile, here are some shopping offers you can enjoy:` }
    ];
    offers.forEach(o => msgs.push({ type: 'offer-card', offer: o, merchant: Store.getMerchant(o.merchantId) }));
    if (offers.length === 0) {
      msgs[0].text = 'For shopping assistance, our **Concierge service** can help with personal shopping, gift sourcing, and luxury purchases. Tap below to get in touch.';
    }
    return { messages: msgs, quickActions: ['Request concierge', 'My bookings', 'Card benefits', 'Dining deals'] };
  },

  _bookSearch(results, query) {
    const msgs = [{ type: 'text', text: `I'd be happy to help you book! Here's what I found for "${query}" — tap **View Offer** to see details and make a booking:` }];
    if (results.offers.length > 0) {
      results.offers.slice(0, 3).forEach(o => msgs.push({ type: 'offer-card', offer: o, merchant: Store.getMerchant(o.merchantId) }));
    }
    if (results.events.length > 0) {
      results.events.slice(0, 2).forEach(e => msgs.push({ type: 'event-card', event: e }));
    }
    if (results.offers.length === 0 && results.events.length === 0) {
      msgs[0].text = `I couldn't find "${query}" to book. Try a different name or browse categories below.`;
    }
    return { messages: msgs, quickActions: ['My bookings', 'Dining deals', 'Events', 'Card benefits'] };
  },

  _category(user, tier, catId, benefitKey) {
    const offers = Store.getOffersByCategory(catId).slice(0, 3);
    const benefit = CARD_BENEFITS[user.cardTier][benefitKey];
    const label = benefitKey.charAt(0).toUpperCase() + benefitKey.slice(1);

    const msgs = [];
    if (benefit) {
      msgs.push({ type: 'text', text: `Your ${label} benefit: ${benefit}. Here are current offers:` });
    } else {
      msgs.push({ type: 'text', text: `Here are the latest ${label.toLowerCase()} offers:` });
    }
    offers.forEach(o => msgs.push({ type: 'offer-card', offer: o, merchant: Store.getMerchant(o.merchantId) }));
    if (offers.length === 0) msgs[0].text = `No ${label.toLowerCase()} offers available right now.`;
    return { messages: msgs, quickActions: ['Near me', 'Card benefits', 'Events', 'Dining'] };
  },

  _search(results, query) {
    const msgs = [{ type: 'text', text: `Here's what I found for "${query}":` }];
    if (results.offers.length > 0) {
      results.offers.slice(0, 2).forEach(o => msgs.push({ type: 'offer-card', offer: o, merchant: Store.getMerchant(o.merchantId) }));
    }
    if (results.events.length > 0) {
      results.events.slice(0, 2).forEach(e => msgs.push({ type: 'event-card', event: e }));
    }
    if (results.offers.length === 0 && results.events.length === 0) {
      msgs[0].text = `I couldn't find specific results for "${query}". Can I help with something else?`;
    }
    return { messages: msgs, quickActions: ['Dining', 'Events', 'Card benefits', 'Help'] };
  },

  _fallback(name) {
    const responses = [
      `I'm not quite sure what you're looking for, ${name}. Try asking about dining, events, travel, or your card benefits.`,
      `I'd love to help! Could you try rephrasing that? I can assist with offers, bookings, events, and card benefits.`,
      `Sorry, I didn't catch that. You can ask me about dining deals, upcoming events, your card perks, or anything lifestyle-related.`
    ];
    return {
      messages: [{ type: 'text', text: responses[Math.floor(Math.random() * responses.length)] }],
      quickActions: ['Show help', 'Dining', 'Events', 'Card benefits']
    };
  }
};

window.ChatEngine = ChatEngine;
