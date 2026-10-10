/**
 * CartView
 * Controls slide-out drawer, cart count badges, and checkout trigger.
 */
window.Khyber = window.Khyber || {};

window.Khyber.CartView = class CartView {
  constructor() {
    this.drawer = document.getElementById('cart-drawer');
    this.overlay = document.getElementById('cart-overlay');
    this.badgeElements = document.querySelectorAll('.cart-count-badge');
    this.itemsContainer = document.getElementById('cart-items-container');
    this.subtotalElement = document.getElementById('cart-subtotal');
    this.shippingProgress = document.getElementById('shipping-progress-bar');
    this.shippingText = document.getElementById('shipping-progress-text');
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
    return this.drawer && this.drawer.classList.contains('is-open');
  }

  open() {
    if (this.drawer && this.overlay) {
      this.drawer.classList.add('is-open');
      this.overlay.classList.add('is-open');
      document.body.classList.add('modal-open');
    }
  }

  close() {
    if (this.drawer && this.overlay) {
      this.drawer.classList.remove('is-open');
      this.overlay.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    }
  }

  render(state) {
    const { items, count, formattedSubtotal, isFreeShippingEligible, freeShippingProgress, formattedRemaining } = state;

    // Update count badges
    this.badgeElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    // Update Shipping Bar
    if (this.shippingProgress && this.shippingText) {
      this.shippingProgress.style.width = `${freeShippingProgress}%`;
      if (isFreeShippingEligible) {
        this.shippingText.innerHTML = `🎉 <strong>Complimentary Shipping unlocked!</strong>`;
      } else {
        this.shippingText.innerHTML = `Add <strong>${formattedRemaining}</strong> more for complimentary shipping.`;
      }
    }

    // Update Subtotal
    if (this.subtotalElement) {
      this.subtotalElement.textContent = formattedSubtotal;
    }

    // Enable/disable checkout button
    if (this.checkoutBtn) {
      this.checkoutBtn.disabled = items.length === 0;
    }

    // Render items list
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
          <a href="index.html#catalog" class="btn btn-secondary btn-sm" onclick="document.getElementById('cart-drawer')?.classList.remove('is-open'); document.getElementById('cart-overlay')?.classList.remove('is-open');">
            Explore Collection
          </a>
        </div>
      `;
      return;
    }

    this.itemsContainer.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.product.id}" data-variant="${item.variant}">
        <a href="product.html?id=${item.product.id}" class="cart-item-img-link">
          <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img" />
        </a>
        <div class="cart-item-info">
          <div class="cart-item-header">
            <a href="product.html?id=${item.product.id}" class="cart-item-name">${item.product.name}</a>
            <button class="cart-item-remove" data-action="remove" aria-label="Remove item">&times;</button>
          </div>
          <div class="cart-item-variant">${item.variant}</div>
          <div class="cart-item-footer">
            <div class="cart-qty-control">
              <button class="cart-qty-btn" data-action="decrease" aria-label="Decrease quantity">&minus;</button>
              <span class="cart-qty-val">${item.quantity}</span>
              <button class="cart-qty-btn" data-action="increase" aria-label="Increase quantity">&plus;</button>
            </div>
            <div class="cart-item-price">$${(item.product.price * item.quantity).toFixed(2)}</div>
          </div>
        </div>
      </div>
    `).join('');

    // Attach listeners for remove and quantity updates
    this.itemsContainer.querySelectorAll('.cart-item').forEach(card => {
      const id = card.dataset.id;
      const variant = card.dataset.variant;
      const currentQty = parseInt(card.querySelector('.cart-qty-val').textContent, 10);

      card.querySelector('[data-action="remove"]').addEventListener('click', () => {
        if (this.onRemoveItem) this.onRemoveItem(id, variant);
      });

      card.querySelector('[data-action="decrease"]').addEventListener('click', () => {
        if (this.onUpdateQuantity) this.onUpdateQuantity(id, variant, currentQty - 1);
      });

      card.querySelector('[data-action="increase"]').addEventListener('click', () => {
        if (this.onUpdateQuantity) this.onUpdateQuantity(id, variant, currentQty + 1);
      });
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

    modal.innerHTML = `
      <div class="checkout-modal-card">
        <button class="checkout-modal-close" id="checkout-modal-close">&times;</button>
        <div class="checkout-header">
          <span class="badge badge-accent">Secure Order Preview</span>
          <h3>Khyber Stores Checkout</h3>
          <p>Order Summary (${state.count} items)</p>
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
            <span>$${(state.subtotal + (state.isFreeShippingEligible ? 0 : 12)).toFixed(2)}</span>
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
            Place Order &bull; $${(state.subtotal + (state.isFreeShippingEligible ? 0 : 12)).toFixed(2)}
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
      const submitBtn = modal.querySelector('.checkout-submit-btn');
      submitBtn.textContent = 'Processing Order...';
      submitBtn.disabled = true;

      setTimeout(() => {
        modal.innerHTML = `
          <div class="checkout-modal-card text-center success-card">
            <div class="success-checkmark">✓</div>
            <h3>Thank You for Your Order!</h3>
            <p class="success-order-num">Confirmation #KHYBER-${Math.floor(100000 + Math.random() * 900000)}</p>
            <p class="text-muted">A confirmation with dispatch details has been sent to your email. Your pieces are carefully packaged in recyclable linen wrap.</p>
            <button class="btn btn-primary" id="success-done-btn">Back to Store</button>
          </div>
        `;
        modal.querySelector('#success-done-btn').addEventListener('click', () => {
          closeModal();
          if (onComplete) onComplete();
        });
      }, 1200);
    });
  }
};
