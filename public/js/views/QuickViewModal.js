/**
 * QuickViewModal
 * Renders an instant preview modal with gallery thumbnails, variants, and Add to Bag.
 */
window.Khyber = window.Khyber || {};

window.Khyber.QuickViewModal = class QuickViewModal {
  constructor() {
    this.modal = null;
    this.onAddToCart = null;
  }

  getOrCreateModal() {
    if (!this.modal) {
      this.modal = document.createElement('div');
      this.modal.id = 'quick-view-modal';
      this.modal.className = 'quick-view-overlay';
      document.body.appendChild(this.modal);
    }
    return this.modal;
  }

  open(product) {
    if (!product) return;
    const modal = this.getOrCreateModal();

    let selectedVariant = product.variants?.[0] || null;
    let qty = 1;

    modal.innerHTML = `
      <div class="quick-view-card">
        <button class="quick-view-close" id="qv-close-btn" aria-label="Close modal">&times;</button>
        <div class="qv-grid">
          <div class="qv-media">
            <img id="qv-main-img" src="${product.image}" alt="${product.name}" class="qv-img" />
          </div>
          <div class="qv-details">
            <span class="product-badge-soft">${product.category}</span>
            <h3 class="qv-title">${product.name}</h3>
            <div class="qv-price">$${product.price.toFixed(2)}</div>
            <p class="qv-desc">${product.description}</p>

            ${product.variants && product.variants.length > 0 ? `
              <div class="qv-variants">
                <label class="qv-label">Select Finish: <strong id="qv-var-name">${selectedVariant.name}</strong></label>
                <div class="variant-pill-group">
                  ${product.variants.map((v, i) => `
                    <button class="variant-pill ${i === 0 ? 'active' : ''} ${!v.inStock ? 'out-of-stock' : ''}" data-name="${v.name}" ${!v.inStock ? 'disabled' : ''}>
                      <span class="color-dot" style="background-color: ${v.color};"></span>
                      <span>${v.name}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div class="qv-actions">
              <button class="btn btn-primary btn-block" id="qv-add-btn">
                Add to Bag &bull; $${product.price.toFixed(2)}
              </button>
              <a href="product.html?id=${product.id}" class="qv-full-link">View Full Specifications &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('is-open');
    document.body.classList.add('modal-open');

    const closeModal = () => {
      modal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    };

    modal.querySelector('#qv-close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Variant change
    const varDisplay = modal.querySelector('#qv-var-name');
    modal.querySelectorAll('.variant-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.variant-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const vName = btn.dataset.name;
        selectedVariant = product.variants.find(v => v.name === vName);
        if (varDisplay) varDisplay.textContent = vName;
      });
    });

    // Add to cart
    modal.querySelector('#qv-add-btn').addEventListener('click', () => {
      if (this.onAddToCart) {
        this.onAddToCart(product, qty, selectedVariant);
      }
      closeModal();
    });
  }
};
