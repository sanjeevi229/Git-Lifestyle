// ══════════════════════════════════════════════
// DEMO LIFESTYLE — Chatbot UI Component (Premium)
// ══════════════════════════════════════════════

const Chatbot = {
  _isOpen: false,
  _messages: [],

  /* ── Initialise: inject FAB + overlay into body ── */
  init() {
    // FAB button
    const fab = document.createElement('button');
    fab.className = 'chat-fab chat-fab--pulse';
    fab.id = 'chatFab';
    fab.innerHTML = Icons.chat(24);
    fab.setAttribute('aria-label', 'Open chat assistant');
    document.body.appendChild(fab);

    // Overlay panel
    const overlay = document.createElement('div');
    overlay.className = 'chat-overlay';
    overlay.id = 'chatOverlay';
    overlay.innerHTML = this._overlayHTML();
    document.body.appendChild(overlay);

    // Load persisted history
    const saved = Store.get('chatHistory');
    if (saved && saved.length) this._messages = saved;

    this._bind();
  },

  /* ── Overlay HTML template ── */
  _overlayHTML() {
    return `
      <div class="chat-header">
        <div class="chat-header__avatar">${Icons.sparkles(16)}</div>
        <div class="chat-header__info">
          <div class="chat-header__title">Visa Concierge</div>
          <div class="chat-header__subtitle">AI Lifestyle Assistant</div>
        </div>
        <button class="chat-header__close" id="chatClose">${Icons.close(18)}</button>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-prompts" id="chatPrompts"></div>
      <div class="chat-input-area">
        <div class="chat-input-wrap">
          <span class="chat-input-icon">${Icons.sparkles(16)}</span>
          <input type="text" class="chat-input" id="chatInput"
                 placeholder="Ask your concierge anything..."
                 autocomplete="off" />
          <button class="chat-send-btn" id="chatSend" disabled>${Icons.send(14)}</button>
        </div>
      </div>
    `;
  },

  /* ── Event Bindings ── */
  _bind() {
    const fab = document.getElementById('chatFab');
    const close = document.getElementById('chatClose');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    const prompts = document.getElementById('chatPrompts');

    fab.addEventListener('click', () => this.open());
    close.addEventListener('click', () => this.close());

    // Send on button click
    send.addEventListener('click', () => this._submitInput());

    // Send on Enter
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._submitInput();
      }
    });

    // Enable/disable send button
    input.addEventListener('input', () => {
      send.disabled = input.value.trim().length === 0;
    });

    // Quick prompt clicks (delegated)
    prompts.addEventListener('click', (e) => {
      const chip = e.target.closest('.chat-prompt-chip');
      if (chip) this._sendMessage(chip.dataset.query);
    });

    // Card clicks + action clicks inside messages (delegated)
    document.getElementById('chatMessages').addEventListener('click', (e) => {
      const card = e.target.closest('[data-chat-route]');
      if (card) {
        this.close();
        Router.navigate(card.dataset.chatRoute);
        return;
      }
      // "View bookings" and other actions
      const action = e.target.closest('[data-chat-action]');
      if (action) {
        const act = action.dataset.chatAction;
        if (act === 'view-bookings') { this.close(); Router.navigate('/my-bookings'); }
        else if (act === 'book-golf') { this.close(); Router.navigate('/golf'); }
        else if (act === 'book-transfer') { this.close(); Router.navigate('/airport/book'); }
        else if (act === 'request-concierge') { this.close(); Router.navigate('/concierge'); }
        else if (act === 'view-courses') { this.close(); Router.navigate('/golf'); }
        return;
      }
      // Welcome screen quick action buttons
      const actionBtn = e.target.closest('.chat-welcome__action-btn[data-query]');
      if (actionBtn) {
        this._sendMessage(actionBtn.dataset.query);
      }
    });

    // Close on backdrop (mobile only — click outside panel area)
    document.getElementById('chatOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'chatOverlay') this.close();
    });

    // iOS keyboard fix — resize overlay to match visible viewport
    if (window.visualViewport) {
      const overlay = document.getElementById('chatOverlay');
      const onViewport = () => {
        if (!this._isOpen) return;
        const vv = window.visualViewport;
        // Set overlay to exactly fill the visible viewport (above keyboard)
        overlay.style.height = `${vv.height}px`;
        overlay.style.top = `${vv.offsetTop}px`;
        this._scrollToBottom();
      };
      window.visualViewport.addEventListener('resize', onViewport);
      window.visualViewport.addEventListener('scroll', onViewport);
    }
  },

  /* ── Open / Close ── */
  _scrollBlocker: null,

  open() {
    this._isOpen = true;
    document.getElementById('chatOverlay').classList.add('open');
    document.getElementById('chatFab').style.display = 'none';
    document.body.classList.add('chat-open');

    // Block background scroll on iOS (touch-action alone isn't enough)
    this._scrollBlocker = (e) => {
      // Allow scroll inside chat messages, but block everything else
      if (!e.target.closest('.chat-messages, .chat-prompts, .chat-welcome__offers-row')) {
        e.preventDefault();
      }
    };
    document.body.addEventListener('touchmove', this._scrollBlocker, { passive: false });

    const container = document.getElementById('chatMessages');

    if (this._messages.length === 0) {
      // First open: show rich welcome screen
      this._renderWelcomeScreen();
    } else {
      // Re-render existing messages
      container.innerHTML = '';
      this._messages.forEach(m => this._renderMessageDOM(m, container, false));
      this._scrollToBottom();
    }

    // Focus input after animation (desktop only — avoids keyboard popup on mobile)
    if (window.innerWidth > 900) {
      setTimeout(() => document.getElementById('chatInput').focus(), 400);
    }
  },

  close() {
    this._isOpen = false;
    // Blur input first to dismiss keyboard
    document.getElementById('chatInput').blur();
    const overlay = document.getElementById('chatOverlay');
    overlay.classList.remove('open');
    // Reset keyboard-adjusted dimensions
    overlay.style.height = '';
    overlay.style.top = '';
    const fab = document.getElementById('chatFab');
    fab.style.display = '';
    // Re-trigger pulse animation
    fab.classList.remove('chat-fab--pulse');
    void fab.offsetWidth; // force reflow
    fab.classList.add('chat-fab--pulse');
    // Remove scroll blocker and restore body
    document.body.classList.remove('chat-open');
    if (this._scrollBlocker) {
      document.body.removeEventListener('touchmove', this._scrollBlocker);
      this._scrollBlocker = null;
    }
  },

  /* ── Welcome Screen (Premium) ── */
  _renderWelcomeScreen() {
    const user = Auth.getCurrentUser();
    const tier = CONFIG.cardTiers[user.cardTier];
    const firstName = user.name.split(' ')[0];
    const container = document.getElementById('chatMessages');

    // Gather real data
    const dining = Store.getOffersByCategory('dining').slice(0, 2);
    const entertainment = Store.getOffersByCategory('entertainment').slice(0, 1);
    const recommended = dining.concat(entertainment);
    const expiring = Store.getExpiringOffers(90).slice(0, 2);

    let html = '<div class="chat-welcome" id="chatWelcome">';

    // 1. Greeting
    html += `
      <div class="chat-welcome__greeting">
        <div class="chat-welcome__name">${Format.greeting()}, ${firstName}</div>
        <div class="chat-welcome__tagline">
          ${Icons.sparkles(14)}
          Your Visa ${tier.label} AI Concierge
        </div>
      </div>
    `;

    // 2. Recommended Offers (horizontal scroll)
    if (recommended.length > 0) {
      html += '<div class="chat-welcome__section-title">Recommended for You</div>';
      html += '<div class="chat-welcome__offers-row">';
      recommended.forEach(offer => {
        const merchant = Store.getMerchant(offer.merchantId);
        const badge = Format.discountLabel(offer);
        html += `
          <div class="chat-welcome__offer-card" data-chat-route="/offer/${offer.id}">
            <img class="chat-welcome__offer-img" src="${offer.image}" alt="${offer.title}" loading="eager" />
            <div class="chat-welcome__offer-body">
              <div class="chat-welcome__offer-title">${offer.title}</div>
              <div class="chat-welcome__offer-sub">${merchant ? merchant.name : ''}</div>
              ${badge ? '<span class="chat-welcome__offer-badge">' + badge + '</span>' : ''}
            </div>
          </div>
        `;
      });
      html += '</div>';
    }

    // 3. Ending Soon (compact list)
    if (expiring.length > 0) {
      html += '<div class="chat-welcome__section-title">Ending Soon</div>';
      html += '<div class="chat-welcome__list">';
      expiring.forEach(offer => {
        const merchant = Store.getMerchant(offer.merchantId);
        const daysLeft = Format.daysUntil(offer.validUntil);
        html += `
          <div class="chat-welcome__list-item" data-chat-route="/offer/${offer.id}">
            <img class="chat-welcome__list-img" src="${offer.image}" alt="${offer.title}" loading="eager" />
            <div class="chat-welcome__list-info">
              <div class="chat-welcome__list-title">${offer.title}</div>
              <div class="chat-welcome__list-sub">${merchant ? merchant.name : ''}</div>
            </div>
            <span class="chat-welcome__list-badge">${daysLeft}</span>
          </div>
        `;
      });
      html += '</div>';
    }

    // 4. Quick Action Grid
    html += `
      <div class="chat-welcome__section-title">Quick Actions</div>
      <div class="chat-welcome__actions">
        <button class="chat-welcome__action-btn" data-query="top dining deals">
          ${Icons.utensils(16)} Dining Deals
        </button>
        <button class="chat-welcome__action-btn" data-query="events this week">
          ${Icons.calendar(16)} This Week
        </button>
        <button class="chat-welcome__action-btn" data-query="my card benefits">
          ${Icons.creditCard(16)} My Benefits
        </button>
        <button class="chat-welcome__action-btn" data-query="travel deals">
          ${Icons.plane(16)} Travel
        </button>
      </div>
    `;

    html += '</div>';

    container.innerHTML = html;

    // Update bottom quick prompts
    this._updateQuickPrompts(
      CHAT_WELCOME_PROMPTS.map(p => p.label),
      CHAT_WELCOME_PROMPTS.map(p => p.query)
    );
  },

  /* ── Submit Input ── */
  _submitInput() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    document.getElementById('chatSend').disabled = true;
    this._sendMessage(text);
  },

  /* ── Send Message Flow ── */
  _sendMessage(text) {
    const container = document.getElementById('chatMessages');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Remove welcome screen on first message
    const welcome = document.getElementById('chatWelcome');
    if (welcome) {
      welcome.remove();
    }

    // 1. Render user message
    const userMsg = { role: 'user', type: 'text', text, time };
    this._messages.push(userMsg);
    this._renderMessageDOM(userMsg, container, true);
    this._scrollToBottom();

    // 2. Show typing indicator
    const typing = document.createElement('div');
    typing.className = 'chat-msg chat-msg--bot chat-typing';
    typing.innerHTML = `
      <div class="chat-typing__dots">
        <span class="chat-typing__dot"></span>
        <span class="chat-typing__dot"></span>
        <span class="chat-typing__dot"></span>
      </div>
    `;
    container.appendChild(typing);
    this._scrollToBottom();

    // 3. Process and respond after delay
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      typing.remove();
      const response = ChatEngine.process(text);
      this._renderBotResponse(response, container, time);
      this._persist();
    }, delay);
  },

  /* ── Render Bot Response ── */
  _renderBotResponse(response, container, time) {
    // Separate text messages from card messages
    const textMsgs = response.messages.filter(m => m.type === 'text');
    const cardMsgs = response.messages.filter(m => m.type !== 'text');

    // 1. Render text message(s) immediately
    textMsgs.forEach(msg => {
      const fullMsg = { role: 'bot', ...msg, time };
      this._messages.push(fullMsg);
      this._renderMessageDOM(fullMsg, container, true);
    });
    this._scrollToBottom();

    // 2. Render all cards together after a brief pause
    if (cardMsgs.length > 0) {
      setTimeout(() => {
        cardMsgs.forEach(msg => {
          const fullMsg = { role: 'bot', ...msg, time };
          this._messages.push(fullMsg);
          this._renderMessageDOM(fullMsg, container, true);
        });
        this._scrollToBottom();
      }, 200);
    }

    // 3. Update quick prompts after everything is rendered
    if (response.quickActions) {
      setTimeout(() => {
        this._updateQuickPrompts(response.quickActions, response.quickActions);
      }, cardMsgs.length > 0 ? 250 : 50);
    }
  },

  /* ── Render a Single Message DOM ── */
  _renderMessageDOM(msg, container, animate) {
    const div = document.createElement('div');
    const cls = msg.role === 'user' ? 'chat-msg--user' : 'chat-msg--bot';
    div.className = `chat-msg ${cls}` + (animate ? ' chat-msg--animate' : '');

    switch (msg.type) {
      case 'text':
        div.innerHTML = `
          <div class="chat-msg__bubble">${this._formatText(msg.text)}</div>
          <div class="chat-msg__time">${msg.time}</div>
        `;
        break;

      case 'offer-card':
        div.innerHTML = this._renderOfferCard(msg.offer, msg.merchant);
        break;

      case 'event-card':
        div.innerHTML = this._renderEventCard(msg.event);
        break;

      case 'benefits-card':
        div.innerHTML = this._renderBenefitsCard(msg.benefits, msg.tierLabel);
        break;

      default:
        div.innerHTML = `<div class="chat-msg__bubble">${msg.text || ''}</div>`;
    }

    container.appendChild(div);
  },

  /* ── Card Renderers ── */
  _renderOfferCard(offer, merchant) {
    if (!offer) return '';
    const name = merchant ? merchant.name : '';
    const badge = Format.discountLabel(offer);
    return `
      <div class="chat-card" data-chat-route="/offer/${offer.id}">
        <img class="chat-card__image" src="${offer.image}" alt="${offer.title}" loading="lazy" />
        <div class="chat-card__body">
          <div class="chat-card__title">${offer.title}</div>
          <div class="chat-card__sub">${name}</div>
          ${badge ? `<span class="discount-badge discount-badge--blue" style="font-size:10px;padding:3px 8px;">${badge}</span>` : ''}
        </div>
        <div class="chat-card__cta">View Offer &rarr;</div>
      </div>
    `;
  },

  _renderEventCard(event) {
    if (!event) return '';
    const d = new Date(event.date);
    const day = d.getDate();
    const mon = d.toLocaleString('en', { month: 'short' }).toUpperCase();
    return `
      <div class="chat-card" data-chat-route="/offer/event-${event.id}">
        <img class="chat-card__image" src="${event.image}" alt="${event.title}" loading="lazy" />
        <div class="chat-card__body">
          <div class="chat-card__date-badge">
            <span class="chat-card__date-day">${day}</span>
            <span class="chat-card__date-mon">${mon}</span>
          </div>
          <div class="chat-card__title">${event.title}</div>
          <div class="chat-card__sub">${event.venue}</div>
          <span class="badge badge--info" style="font-size:10px;">AED ${event.price}</span>
        </div>
        <div class="chat-card__cta">View Event &rarr;</div>
      </div>
    `;
  },

  _renderBenefitsCard(benefits, tierLabel) {
    if (!benefits) return '';
    const keys = ['dining', 'entertainment', 'wellness', 'travel', 'shopping', 'lounge', 'golf', 'airport', 'concierge'];
    const items = keys
      .filter(k => benefits[k])
      .map(k => `<li>${Icons.checkCircle(14)} ${benefits[k]}</li>`)
      .join('');

    return `
      <div class="chat-card chat-card--benefits">
        <div class="chat-card__benefits-header">
          ${Icons.creditCard(18)}
          <span>Visa ${tierLabel} Benefits</span>
        </div>
        <ul class="chat-card__benefits-list">${items}</ul>
      </div>
    `;
  },

  /* ── Helpers ── */
  _formatText(text) {
    // Convert **bold** and line breaks
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  },

  _scrollToBottom() {
    const el = document.getElementById('chatMessages');
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  },

  _updateQuickPrompts(labels, queries) {
    const el = document.getElementById('chatPrompts');
    if (!queries) queries = labels;
    el.innerHTML = labels.map((label, i) =>
      `<button class="chat-prompt-chip" data-query="${queries[i] || label}">${label}</button>`
    ).join('');
  },

  _persist() {
    // Keep last 50 messages
    const toSave = this._messages.slice(-50);
    Store.set('chatHistory', toSave);
  }
};

window.Chatbot = Chatbot;
