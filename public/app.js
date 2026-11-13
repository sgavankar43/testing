import { AuraClient } from './aura-sdk.js';

// ============================================================================
// Curated Hardware Catalog
// ============================================================================
const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Nova Split Ergo 65% Mechanical Keyboard',
    category: 'Keyboards & Input',
    price: 229.00,
    rating: '4.9 ★ (128)',
    description: 'Split ortholinear layout in solid CNC aluminum with hot-swappable switches and per-key acoustics.',
    badge: 'Staff Pick',
    specs: ['CNC Aluminum', 'Gateron Oil Kings', 'Hot-Swap PCB', 'QMK/VIA'],
    image: '⌨️'
  },
  {
    id: 'prod-2',
    name: 'Nova Horizon 38" Curved IPS Developer Display',
    category: 'Displays',
    price: 899.00,
    rating: '4.9 ★ (86)',
    description: 'Ultrawide 3840×1600 resolution with 144Hz refresh rate, 90W USB-C Power Delivery, and built-in KVM.',
    badge: 'Flagship',
    specs: ['3840×1600', '144Hz 1ms', '90W USB-C PD', 'Hardware KVM'],
    image: '🖥️'
  },
  {
    id: 'prod-3',
    name: 'Nova Reference Planar Studio Headphones',
    category: 'Audio',
    price: 349.00,
    rating: '4.8 ★ (94)',
    description: 'Open-back planar magnetic drivers delivering ultra-neutral acoustic response for deep focus.',
    badge: 'Audiophile',
    specs: ['Open-Back', 'Planar Drivers', 'Detachable XLR', 'Velour Pads'],
    image: '🎧'
  },
  {
    id: 'prod-4',
    name: 'Nova Precision Machined Rotary Macro Pad',
    category: 'Keyboards & Input',
    price: 119.00,
    rating: '5.0 ★ (62)',
    description: 'Custom machined brass encoder knob with 12 programmable mechanical keys for IDE shortcuts.',
    badge: 'Best Seller',
    specs: ['Brass Rotary Dial', '12 Hot-Swap Keys', 'RGB Backlit', 'Anodized'],
    image: '🎛️'
  },
  {
    id: 'prod-5',
    name: 'Grade 5 Titanium Artisan Keycap Set',
    category: 'Desk Accessories',
    price: 85.00,
    rating: '4.9 ★ (41)',
    description: 'Precision wire-EDM cut from aerospace-grade titanium alloy with laser-etched geometric legends.',
    badge: 'Limited Run',
    specs: ['Titanium Alloy', 'Laser Etched', 'Cherry Profile', 'Anodized'],
    image: '💎'
  },
  {
    id: 'prod-6',
    name: 'Digital PID Thermal Soldering Station',
    category: 'Desk Accessories',
    price: 165.00,
    rating: '4.7 ★ (39)',
    description: 'Rapid 8-second thermal heat-up to 450°C with digital PID stabilization and auto-sleep motion sensor.',
    badge: 'Lab Grade',
    specs: ['PID Stabilization', '450°C Rapid Heat', 'Motion Sensor', 'OLED UI'],
    image: '⚡'
  }
];

// ============================================================================
// Predefined User Personas (1-Click Instant Sign In)
// ============================================================================
const USER_PROFILES = {
  bob: {
    key: 'bob',
    name: 'Bob Chen',
    email: 'bob@company.com',
    role: 'Enterprise',
    tier: 'Enterprise Client',
    initials: 'BC',
    userId: 'usr_bob',
    attributes: { role: 'editor', tier: 'enterprise', domain: 'company.com' }
  },
  alice: {
    key: 'alice',
    name: 'Alice Sterling',
    email: 'alice@aura.dev',
    role: 'Staff',
    tier: 'Internal Staff',
    initials: 'AS',
    userId: 'usr_alice',
    attributes: { role: 'admin', tier: 'enterprise', domain: 'aura.dev' }
  },
  charlie: {
    key: 'charlie',
    name: 'Charlie Vance',
    email: 'charlie@gmail.com',
    role: 'Beta Cohort',
    tier: 'Beta Program',
    initials: 'CV',
    userId: 'usr_charlie',
    attributes: { role: 'viewer', betaUser: true }
  },
  diana: {
    key: 'diana',
    name: 'Diana Prince',
    email: 'diana@startup.io',
    role: 'Shopper',
    tier: 'Public Shopper',
    initials: 'DP',
    userId: 'usr_diana',
    attributes: { role: 'viewer', tier: 'standard' }
  },
  anonymous: {
    key: 'anonymous',
    name: 'Guest Visitor',
    email: 'Unauthenticated',
    role: 'Guest',
    tier: 'Public Tier',
    initials: 'G',
    userId: 'usr_guest_' + Math.floor(Math.random() * 1000),
    attributes: {}
  }
};

// Retrieve persisted user or default to Bob Chen
let currentPersonaKey = localStorage.getItem('novastore_user') || 'bob';
let currentUser = USER_PROFILES[currentPersonaKey] || USER_PROFILES.bob;

// Active Category Filter & Search
let activeCategory = 'all';
let searchQuery = '';

// Shopping Cart State
let cart = [
  { ...PRODUCTS[0], quantity: 1 }
];

// ============================================================================
// Aura Client SDK Initialization
// ============================================================================
const urlParams = new URLSearchParams(window.location.search);
const defaultEndpoint = 'https://aura-spring.onrender.com/api/v1/evaluate';

const API_ENDPOINT = urlParams.get('endpoint') || defaultEndpoint;
const API_KEY = urlParams.get('apiKey') || 'aura_pk_live_0093095c729447f9876683f353a7b9a1';
const INITIAL_ENV = urlParams.get('env') || 'development';

const aura = new AuraClient({
  endpoint: API_ENDPOINT,
  apiKey: API_KEY,
  environment: INITIAL_ENV,
  context: {
    userId: currentUser.userId,
    email: currentUser.email !== 'Unauthenticated' ? currentUser.email : null,
    attributes: currentUser.attributes
  },
  enableStream: true,
  pollIntervalMs: 2500
});

// ============================================================================
// UI Rendering Functions
// ============================================================================

// Render Products Catalog
function renderProducts() {
  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('product-results-count');
  if (!grid) return;

  const isFastCheckoutEnabled = aura.isEnabled('fast-checkout-v2');

  const filtered = PRODUCTS.filter(prod => {
    const matchesCategory = activeCategory === 'all' || prod.category === activeCategory;
    const matchesSearch = !searchQuery || 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (countEl) {
    countEl.innerText = `Showing ${filtered.length} of ${PRODUCTS.length} products`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-primary);">No products match your search</p>
        <p style="font-size: 0.85rem;">Try adjusting your search terms or selecting another category.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(prod => `
    <article class="product-card" data-id="${prod.id}">
      <div class="product-image-wrap">
        <span>${prod.image}</span>
        <span class="product-tag">${prod.badge}</span>
        <span class="product-rating">${prod.rating}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${prod.category}</span>
        <h3 class="product-title">${prod.name}</h3>
        <p class="product-desc">${prod.description}</p>
        
        <div class="product-specs">
          ${prod.specs.map(s => `<span class="spec-chip">${s}</span>`).join('')}
        </div>

        <div class="product-footer">
          <div class="product-price">$${prod.price.toFixed(2)}</div>
          <button class="btn-add-cart" onclick="window.addToCart('${prod.id}')">
            + Add to Bag
          </button>
        </div>

        <button class="btn-fast-checkout ${isFastCheckoutEnabled ? '' : 'hidden'}" onclick="window.triggerFastCheckout('${prod.id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          <span>Instant 1-Click Buy</span>
        </button>
      </div>
    </article>
  `).join('');
}

// Render Cart Drawer
function renderCart() {
  const countEl = document.getElementById('cart-count');
  const itemsContainer = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal-amount');
  const totalEl = document.getElementById('cart-total-amount');

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (countEl) countEl.innerText = totalCount;
  if (subtotalEl) subtotalEl.innerText = `$${totalPrice.toFixed(2)}`;
  if (totalEl) totalEl.innerText = `$${totalPrice.toFixed(2)}`;

  if (itemsContainer) {
    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 4rem 1rem;">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🛍️</div>
          <p style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.25rem;">Your bag is empty</p>
          <p style="font-size: 0.8125rem;">Add precision hardware to your cart to begin.</p>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item-row">
          <div class="cart-item-thumb">${item.image}</div>
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="window.updateQuantity('${item.id}', -1)" aria-label="Decrease quantity">−</button>
            <span class="qty-count">${item.quantity}</span>
            <button class="qty-btn" onclick="window.updateQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
      `).join('');
    }
  }

  // Update Cart Fast Checkout Button visibility based on flag
  const cartFastBtn = document.getElementById('cart-fast-checkout-btn');
  if (cartFastBtn) {
    const isFast = aura.isEnabled('fast-checkout-v2');
    cartFastBtn.classList.toggle('hidden', !isFast);
  }
}

// Update Navbar User Account Pill
function updateNavbarUser() {
  const avatarEl = document.getElementById('user-avatar-initials');
  const nameEl = document.getElementById('user-display-name');
  const roleEl = document.getElementById('user-role-badge');

  if (avatarEl) avatarEl.innerText = currentUser.initials;
  if (nameEl) nameEl.innerText = currentUser.name;
  if (roleEl) roleEl.innerText = currentUser.role;
}

// ============================================================================
// Core Feature Flag Application (Sub-15ms Dynamic Reactivity)
// ============================================================================
function applyFeatureFlags(state) {
  // 1. Dark Mode Theme Flag (0ms instant toggle on root & body)
  const isDark = aura.isEnabled('dark-mode');
  document.documentElement.classList.toggle('dark', isDark);
  document.body.classList.toggle('dark', isDark);

  // 2. Promotional Announcement Banner Flag
  const isBanner = aura.isEnabled('announcement-banner', true);
  const bannerEl = document.getElementById('announcement-banner');
  if (bannerEl) bannerEl.classList.toggle('hidden', !isBanner);

  // 3. AI Shopping Copilot Widget Flag
  const isCopilot = aura.isEnabled('ai-copilot-beta');
  const copilotEl = document.getElementById('copilot-widget-container');
  if (copilotEl) copilotEl.classList.toggle('hidden', !isCopilot);

  // 4. Products & Cart Fast Checkout (direct DOM class toggle without innerHTML rebuild)
  const isFast = aura.isEnabled('fast-checkout-v2');
  const cartFastBtn = document.getElementById('cart-fast-checkout-btn');
  if (cartFastBtn) cartFastBtn.classList.toggle('hidden', !isFast);

  const fastButtons = document.querySelectorAll('.btn-fast-checkout');
  if (fastButtons.length > 0) {
    fastButtons.forEach(btn => btn.classList.toggle('hidden', !isFast));
  } else {
    renderProducts();
  }

  // Persist flags to localStorage cache
  try {
    localStorage.setItem('aura_flags_cache', JSON.stringify(aura.flags));
  } catch (e) {}
}

// ============================================================================
// Global User Persona Switcher & Login Logic
// ============================================================================
window.openLoginModal = () => {
  document.getElementById('login-overlay')?.classList.add('open');
  document.getElementById('user-login-modal')?.classList.add('open');
};

window.closeLoginModal = () => {
  document.getElementById('login-overlay')?.classList.remove('open');
  document.getElementById('user-login-modal')?.classList.remove('open');
};

window.selectPersona = async (personaKey) => {
  const profile = USER_PROFILES[personaKey];
  if (!profile) return;

  currentPersonaKey = personaKey;
  currentUser = profile;
  localStorage.setItem('novastore_user', personaKey);

  updateNavbarUser();
  window.closeLoginModal();

  // Re-evaluate feature flags with the new user context in real time
  await aura.setContext({
    userId: profile.userId,
    email: profile.email !== 'Unauthenticated' ? profile.email : null,
    attributes: profile.attributes
  });

  window.showToast(`Signed in as ${profile.name} (${profile.role})`);
};

// ============================================================================
// Global Cart & Checkout Actions
// ============================================================================
window.addToCart = (productId) => {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;
  const existing = cart.find(p => p.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...prod, quantity: 1 });
  }
  renderCart();
  window.openCart();
  window.showToast(`Added ${prod.name} to bag`);
};

window.updateQuantity = (productId, delta) => {
  const item = cart.find(p => p.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== productId);
  }
  renderCart();
};

window.openCart = () => {
  document.getElementById('cart-overlay')?.classList.add('open');
  document.getElementById('cart-drawer')?.classList.add('open');
};

window.closeCart = () => {
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.getElementById('cart-drawer')?.classList.remove('open');
};

window.triggerFastCheckout = (productId) => {
  const prod = PRODUCTS.find(p => p.id === productId) || cart[0] || PRODUCTS[0];
  window.showToast(`⚡ 1-Click Fast Checkout approved for ${currentUser.name}!`);
  alert(`⚡ INSTANT 1-CLICK PURCHASE COMPLETE!\n\nUser: ${currentUser.name} (${currentUser.email})\nItem: ${prod.name}\nTotal: $${prod.price.toFixed(2)}\nPayment: Apple Pay (Instant Authorization)\nShipping: Express Priority Dispatch`);
};

window.triggerStandardCheckout = () => {
  alert(`Standard Multi-Step Checkout initiated for ${currentUser.name}.\nTotal: $${cart.reduce((a, b) => a + b.price * b.quantity, 0).toFixed(2)}`);
};

// ============================================================================
// Filters & Search
// ============================================================================
window.filterCategory = (category, btnElement) => {
  activeCategory = category;
  document.querySelectorAll('.nav-link, .filter-tab').forEach(b => {
    b.classList.remove('active');
  });
  if (btnElement) btnElement.classList.add('active');
  renderProducts();
};

window.handleSearch = (query) => {
  searchQuery = query.trim();
  renderProducts();
};

// ============================================================================
// AI Copilot Chat Assistant
// ============================================================================
window.toggleCopilotModal = () => {
  const modal = document.getElementById('copilot-modal');
  if (modal) {
    modal.classList.toggle('open');
  }
};

window.sendCopilotQuery = (queryText) => {
  const chatBody = document.getElementById('copilot-chat-body');
  const input = document.getElementById('copilot-input-field');
  const query = queryText || input?.value?.trim();
  if (!query) return;

  const userDiv = document.createElement('div');
  userDiv.className = 'chat-bubble user';
  userDiv.innerText = query;
  chatBody.appendChild(userDiv);

  if (input) input.value = '';

  setTimeout(() => {
    let response = "I'm your NovaStore AI Assistant. All our hardware is calibrated for professional builders.";
    const q = query.toLowerCase();
    if (q.includes('keyboard') || q.includes('switch')) {
      response = "The Nova Split Ergo 65% is our most popular keyboard, featuring hot-swappable Gateron Oil Kings in a solid CNC aluminum chassis.";
    } else if (q.includes('display') || q.includes('monitor') || q.includes('curved')) {
      response = "The Nova Horizon 38\" Curved IPS gives you 3840×1600 resolution with built-in hardware KVM and 90W USB-C charging for your laptop.";
    } else if (q.includes('shipping') || q.includes('return') || q.includes('warranty')) {
      response = "All orders include complimentary global express delivery (2-3 business days) and an unconditional 2-year warranty.";
    }

    const botDiv = document.createElement('div');
    botDiv.className = 'chat-bubble bot';
    botDiv.innerText = response;
    chatBody.appendChild(botDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 350);
};

// Toast Notifications
window.showToast = (message) => {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2800);
};

// ============================================================================
// Initialization Lifecycle
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  updateNavbarUser();

  // Subscribe to real-time Aura SSE stream updates
  aura.onUpdate((state) => {
    applyFeatureFlags(state);
  });

  // Apply initial flag state immediately
  applyFeatureFlags({
    flags: aura.flags,
    environment: aura.environment,
    context: aura.context,
    isInitial: true
  });

  // Initial renders
  renderProducts();
  renderCart();

  // Evaluate flags from cloud backend immediately
  aura.evaluate().then(flags => {
    applyFeatureFlags({
      flags,
      environment: aura.environment,
      context: aura.context,
      isInitial: true
    });
  });
});
