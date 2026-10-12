/**
 * WishlistView
 * Controls Wishlist drawer, count badge, and heart button states.
 */
window.Khyber = window.Khyber || {};

window.Khyber.WishlistView = class WishlistView {
  constructor() {
    this.drawer = document.getElementById('wishlist-drawer');
    this.overlay = document.getElementById('wishlist-overlay');
    this.badgeElements = document.querySelectorAll('.wishlist-count-badge');
    this.itemsContainer = document.getElementById('wishlist-items-container');
    this.closeBtn = document.getElementById('wishlist-close-btn');

    this.onRemoveItem = null;
    this.onMoveToBag = null;

    this.bindControls();
  }

  bindControls() {
    document.querySelectorAll('[data-action="open-wishlist"]').forEach(btn => {
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

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
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

  render(items) {
    const count = items.length;

    // Badges update
    this.badgeElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    // Update heart icons across the page
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
      const id = btn.dataset.id;
      if (id) {
        const isFavorited = items.some(item => item.id === id);
        if (isFavorited) {
          btn.classList.add('active');
          btn.setAttribute('aria-label', 'Remove from wishlist');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-label', 'Add to wishlist');
        }
      }
    });

    // Render drawer list
    if (!this.itemsContainer) return;

    if (items.length === 0) {
      this.itemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">♡</div>
          <p class="cart-empty-title">Your wishlist is empty</p>
          <p class="cart-empty-sub">Save your favorite artisan pieces to revisit anytime.</p>
          <a href="index.html#catalog" class="btn btn-secondary btn-sm" onclick="document.getElementById('wishlist-drawer')?.classList.remove('is-open'); document.getElementById('wishlist-overlay')?.classList.remove('is-open');">
            Discover Collection
          </a>
        </div>
      `;
      return;
    }

    this.itemsContainer.innerHTML = items.map(item => `
      <div class="cart-item wishlist-item" data-id="${item.id}">
        <a href="product.html?id=${item.id}" class="cart-item-img-link">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
        </a>
        <div class="cart-item-info">
          <div class="cart-item-header">
            <a href="product.html?id=${item.id}" class="cart-item-name">${item.name}</a>
            <button class="cart-item-remove" data-action="remove-wishlist" aria-label="Remove from wishlist">&times;</button>
          </div>
          <div class="cart-item-variant">${item.category}</div>
          <div class="cart-item-footer">
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <button class="btn btn-primary btn-sm btn-move-bag" data-action="move-to-bag">Add to Bag</button>
          </div>
        </div>
      </div>
    `).join('');

    this.itemsContainer.querySelectorAll('.wishlist-item').forEach(card => {
      const id = card.dataset.id;
      const removeBtn = card.querySelector('[data-action="remove-wishlist"]');
      const moveBtn = card.querySelector('[data-action="move-to-bag"]');

      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          if (this.onRemoveItem) this.onRemoveItem(id);
        });
      }

      if (moveBtn) {
        moveBtn.addEventListener('click', () => {
          if (this.onMoveToBag) this.onMoveToBag(id);
        });
      }
    });
  }
};
