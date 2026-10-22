/**
 * CartView
 * Controls slide-out drawer, cart count badges, checkout trigger, and top-right success popup.
 */
window.Khyber = window.Khyber || {};

window.Khyber.CartView = class CartView {
  constructor() {
    this.drawer = document.getElementById('cart-drawer');
    this.overlay = document.getElementById('cart-overlay');
    this.badgeElements = document.querySelectorAll('.cart-count-badge');
    this.itemsContainer = document.getElementById('cart-items-container');
    this.subtotalElement = document.getElementById('cart-subtotal');
    this.checkoutBtn = document.getElementById('cart-checkout-btn');
    this.closeBtn = document.getElementById('cart-close-btn');

    this.onUpdateQuantity = null;
    this.onRemoveItem = null;
    this.onCheckout = null;

    this.bindDrawerControls();
  }

  bindDrawerControls() {
    // Open triggers across any button with data-action="open-cart"
    document.querySelectorAll('[data-action="open-cart"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }

    // Escape key closes drawer
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        if (this.onCheckout) this.onCheckout();
      });
    }
  }

  isOpen() {
    const drawer = this.drawer || document.getElementById('cart-drawer');
    return drawer && drawer.classList.contains('is-open');
  }

  open() {
    this.drawer = this.drawer || document.getElementById('cart-drawer');
    this.overlay = this.overlay || document.getElementById('cart-overlay');

    // Close wishlist drawer if open to prevent overlay stacking conflicts
    const wishlistDrawer = document.getElementById('wishlist-drawer');
    const wishlistOverlay = document.getElementById('wishlist-overlay');
    if (wishlistDrawer) wishlistDrawer.classList.remove('is-open');
    if (wishlistOverlay) wishlistOverlay.classList.remove('is-open');

    if (this.drawer && this.overlay) {
      this.drawer.classList.add('is-open');
      this.overlay.classList.add('is-open');
      document.body.classList.add('modal-open');
    }
  }

  close() {
    this.drawer = this.drawer || document.getElementById('cart-drawer');
    this.overlay = this.overlay || document.getElementById('cart-overlay');
    if (this.drawer && this.overlay) {
      this.drawer.classList.remove('is-open');
      this.overlay.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    }
  }

  render(state) {
    const { items, count, formattedSubtotal } = state;

    // Dynamically query count badges across current DOM
    const badgeElements = document.querySelectorAll('.cart-count-badge');
    badgeElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    // Update Subtotal
    this.subtotalElement = this.subtotalElement || document.getElementById('cart-subtotal');
    if (this.subtotalElement) {
      this.subtotalElement.textContent = formattedSubtotal;
    }

    // Enable/disable checkout button
    this.checkoutBtn = this.checkoutBtn || document.getElementById('cart-checkout-btn');
    if (this.checkoutBtn) {
      this.checkoutBtn.disabled = items.length === 0;
    }

    // Render items list
    this.itemsContainer = this.itemsContainer || document.getElementById('cart-items-container');
    if (!this.itemsContainer) return;

    if (items.length === 0) {
      this.itemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <p class="cart-empty-title">Your shopping bag is empty</p>
          <p class="cart-empty-sub">Discover thoughtfully crafted objects for your everyday living.</p>
          <a href="shop.html" class="btn btn-secondary btn-sm" onclick="document.getElementById('cart-drawer')?.classList.remove('is-open'); document.getElementById('cart-overlay')?.classList.remove('is-open');">
            Explore Collection
          </a>
        </div>
      `;
      return;
    }

    this.itemsContainer.innerHTML = items.map(item => {
      const variantName = (item.variant || 'Standard').trim();
      const variantDisplay = variantName && variantName !== 'Standard' ? `<div class="cart-item-variant">${variantName}</div>` : '';
      const unitPrice = typeof item.product?.price === 'number' ? item.product.price : parseFloat(item.product?.price) || 0;
      const itemTotal = (unitPrice * item.quantity).toFixed(2);

      return `
        <div class="cart-item" data-id="${item.product.id}" data-variant="${variantName}">
          <a href="product.html?id=${item.product.id}" class="cart-item-img-link">
            <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img" />
          </a>
          <div class="cart-item-info">
            <div class="cart-item-header">
              <a href="product.html?id=${item.product.id}" class="cart-item-name">${item.product.name}</a>
              <button class="cart-item-remove" data-action="remove" aria-label="Remove item">&times;</button>
            </div>
            ${variantDisplay}
            <div class="cart-item-footer">
              <div class="cart-qty-control">
                <button 
                  class="cart-qty-btn" 
                  data-action="decrease" 
                  aria-label="Decrease quantity"
                  ${item.quantity <= 1 ? 'disabled style="opacity: 0.35; cursor: not-allowed;"' : ''}>
                  &minus;
                </button>
                <span class="cart-qty-val">${item.quantity}</span>
                <button class="cart-qty-btn" data-action="increase" aria-label="Increase quantity">&plus;</button>
              </div>
              <div class="cart-item-price">$${itemTotal}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners for remove and quantity updates
    this.itemsContainer.querySelectorAll('.cart-item').forEach(card => {
      const id = card.dataset.id;
      const variant = card.dataset.variant || 'Standard';
      const currentQty = parseInt(card.querySelector('.cart-qty-val')?.textContent || '1', 10);

      const removeBtn = card.querySelector('[data-action="remove"]');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          if (this.onRemoveItem) this.onRemoveItem(id, variant);
        });
      }

      const decBtn = card.querySelector('[data-action="decrease"]');
      if (decBtn) {
        decBtn.addEventListener('click', () => {
          if (currentQty > 1 && this.onUpdateQuantity) {
            this.onUpdateQuantity(id, variant, currentQty - 1);
          }
        });
      }

      const incBtn = card.querySelector('[data-action="increase"]');
      if (incBtn) {
        incBtn.addEventListener('click', () => {
          if (this.onUpdateQuantity) {
            this.onUpdateQuantity(id, variant, currentQty + 1);
          }
        });
      }
    });
  }

  showCheckoutModal(state, onComplete) {
    let modal = document.getElementById('checkout-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'checkout-modal';
      modal.className = 'checkout-modal-overlay';
      document.body.appendChild(modal);
    }

    const shippingCost = state.isFreeShippingEligible ? 0 : 12;
    const finalTotal = state.subtotal + shippingCost;

    modal.innerHTML = `
      <div class="checkout-modal-card">
        <button class="checkout-modal-close" id="checkout-modal-close">&times;</button>
        <div class="checkout-header">
          <span class="badge badge-accent">Secure Order Preview</span>
          <h3>Khyber Stores Checkout</h3>
          <p>Order Summary (${state.count} item${state.count > 1 ? 's' : ''})</p>
        </div>

        <div class="checkout-summary-box">
          <div class="checkout-summary-row">
            <span>Subtotal</span>
            <span>${state.formattedSubtotal}</span>
          </div>
          <div class="checkout-summary-row">
            <span>Shipping</span>
            <span>${state.isFreeShippingEligible ? '<span class="text-free">FREE (Express)</span>' : '$12.00'}</span>
          </div>
          <div class="checkout-summary-row total">
            <span>Estimated Total</span>
            <span>$${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <form id="checkout-form" class="checkout-form">
          <div class="form-group">
            <label for="co-email">Email Address</label>
            <input type="email" id="co-email" class="form-control" placeholder="alex@studio.com" required value="patron@khyber.store" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="co-name">Full Name</label>
              <input type="text" id="co-name" class="form-control" placeholder="Alex Morgan" required value="Alex Morgan" />
            </div>
            <div class="form-group">
              <label for="co-city">City</label>
              <input type="text" id="co-city" class="form-control" placeholder="New York, NY" required value="San Francisco, CA" />
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-block checkout-submit-btn">
            Place Order &bull; $${finalTotal.toFixed(2)}
          </button>
        </form>
        <p class="checkout-guarantee">🔒 256-bit Encrypted Checkout &bull; 30-day Free Global Returns</p>
      </div>
    `;

    modal.classList.add('is-open');

    const closeModal = () => modal.classList.remove('is-open');
    modal.querySelector('#checkout-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    modal.querySelector('#checkout-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = modal.querySelector('#co-name');
      const customerName = nameInput ? nameInput.value : 'Alex Morgan';
      const submitBtn = modal.querySelector('.checkout-submit-btn');
      submitBtn.textContent = 'Processing Order...';
      submitBtn.disabled = true;

      const orderNumber = `${Math.floor(100000 + Math.random() * 900000)}`;

      setTimeout(() => {
        closeModal();
        if (onComplete) onComplete();
        // Display order success popup strictly at the top-right of the screen
        this.showOrderSuccessPopup(orderNumber, customerName, finalTotal, state);
      }, 900);
    });
  }

  showOrderSuccessPopup(orderId, customerName, total, state) {
    // Remove existing if any
    const existing = document.getElementById('order-success-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.id = 'order-success-popup';
    popup.className = 'order-success-popup';
    popup.innerHTML = `
      <div class="osp-header">
        <div class="osp-icon">✓</div>
        <div class="osp-title-group">
          <span class="osp-badge">Order Confirmed</span>
          <h4 class="osp-title">Thank You, ${customerName}!</h4>
        </div>
        <button class="osp-close" id="osp-close-btn" aria-label="Close notification">&times;</button>
      </div>
      <div class="osp-body">
        <p class="osp-num">Order ID: <strong>#KHYBER-${orderId}</strong></p>
        <p class="osp-info">Total: <strong>$${total.toFixed(2)}</strong> &bull; ${state.count} piece${state.count > 1 ? 's' : ''}</p>
        <p class="osp-sub">A receipt with tracking has been sent to your email. Packaged in recyclable linen wrap.</p>
      </div>
      <div class="osp-footer">
        <button class="btn btn-primary btn-sm" id="osp-done-btn">Continue Shopping</button>
      </div>
    `;

    document.body.appendChild(popup);
    requestAnimationFrame(() => {
      popup.classList.add('osp-visible');
    });

    const dismiss = () => {
      popup.classList.remove('osp-visible');
      setTimeout(() => popup.remove(), 350);
    };

    popup.querySelector('#osp-close-btn').addEventListener('click', dismiss);
    popup.querySelector('#osp-done-btn').addEventListener('click', dismiss);

    // Auto-dismiss after 8.5 seconds
    setTimeout(dismiss, 8500);
  }
};
