/**
 * ProductDetailView
 * Controls product detail page layout, gallery thumbnail switches, variants, and quantity.
 */
window.Khyber = window.Khyber || {};

window.Khyber.ProductDetailView = class ProductDetailView {
  constructor() {
    this.mainContainer = document.getElementById('product-detail-container');
    this.relatedContainer = document.getElementById('related-products-grid');
    this.breadcrumbCategory = document.getElementById('bc-category');
    this.breadcrumbTitle = document.getElementById('bc-title');

    this.selectedVariant = null;
    this.currentQuantity = 1;
    this.onAddToCart = null;
  }

  render(product, relatedProducts = []) {
    if (!product || !this.mainContainer) return;

    // Document Title update
    document.title = `${product.name} — Khyber Stores`;

    // Breadcrumbs
    if (this.breadcrumbCategory) {
      this.breadcrumbCategory.textContent = product.category;
      this.breadcrumbCategory.href = `index.html?category=${encodeURIComponent(product.category)}#catalog`;
    }
    if (this.breadcrumbTitle) {
      this.breadcrumbTitle.textContent = product.name;
    }

    // Set initial variant
    this.selectedVariant = product.variants?.[0] || null;
    this.currentQuantity = 1;

    this.mainContainer.innerHTML = `
      <div class="product-gallery">
        <div class="product-gallery-main">
          <img id="main-product-img" src="${product.image}" alt="${product.name}" class="gallery-hero-img" />
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        </div>
        ${product.images && product.images.length > 1 ? `
          <div class="gallery-thumbs">
            ${product.images.map((img, i) => `
              <button class="gallery-thumb-btn ${i === 0 ? 'active' : ''}" data-src="${img}" aria-label="View photo ${i + 1}">
                <img src="${img}" alt="" class="gallery-thumb-img" />
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="product-info-panel">
        <div class="product-header-meta">
          <span class="product-badge-soft">${product.category}</span>
          <div class="product-rating-row">
            <span class="star-icon">★</span>
            <span class="rating-num"><strong>${product.rating}</strong></span>
            <span class="rating-count">(${product.reviewsCount} customer reviews)</span>
          </div>
        </div>

        <h1 class="product-title">${product.name}</h1>
        <div class="product-price-tag">$${product.price.toFixed(2)}</div>
        <p class="product-short-desc">${product.description}</p>

        <!-- Variants -->
        ${product.variants && product.variants.length > 0 ? `
          <div class="product-option-block">
            <div class="option-header">
              <span class="option-label">Finish / Shade:</span>
              <strong id="variant-name-display">${this.selectedVariant.name}</strong>
            </div>
            <div class="variant-pill-group">
              ${product.variants.map((v, i) => `
                <button 
                  class="variant-pill ${i === 0 ? 'active' : ''} ${!v.inStock ? 'out-of-stock' : ''}" 
                  data-name="${v.name}" 
                  data-color="${v.color}"
                  ${!v.inStock ? 'disabled' : ''}>
                  <span class="color-dot" style="background-color: ${v.color};"></span>
                  <span>${v.name}</span>
                  ${!v.inStock ? '<small>(Sold out)</small>' : ''}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Quantity & Add to Cart -->
        <div class="product-action-block">
          <div class="qty-stepper">
            <button id="qty-decrease" class="qty-btn" aria-label="Decrease quantity">&minus;</button>
            <input type="number" id="qty-input" class="qty-input" value="1" min="1" max="10" readonly />
            <button id="qty-increase" class="qty-btn" aria-label="Increase quantity">&plus;</button>
          </div>

          <button id="btn-add-to-cart" class="btn btn-primary btn-add-bag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span id="btn-add-text">Add to Bag &bull; $${product.price.toFixed(2)}</span>
          </button>
        </div>

        <!-- Trust Badges -->
        <div class="trust-features-grid">
          <div class="trust-item">
            <span class="trust-icon">🌿</span>
            <span>Ethically Sourced Materials</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">📦</span>
            <span>Carbon Neutral Delivery</span>
          </div>
          <div class="trust-item">
            <span class="trust-icon">↺</span>
            <span>30-Day Hassle-Free Returns</span>
          </div>
        </div>

        <!-- Accordion Details -->
        <div class="product-accordion">
          <details class="accordion-item" open>
            <summary class="accordion-header">
              <span>Materials & Specifications</span>
              <span class="accordion-chevron">↓</span>
            </summary>
            <div class="accordion-body">
              <ul class="specs-list">
                <li><strong>Material:</strong> ${product.details?.material || 'Crafted with premium materials'}</li>
                <li><strong>Dimensions:</strong> ${product.details?.dimensions || 'Standard dimensions'}</li>
                <li><strong>Origin:</strong> ${product.details?.origin || 'Ethically made'}</li>
              </ul>
            </div>
          </details>

          <details class="accordion-item">
            <summary class="accordion-header">
              <span>Care Instructions</span>
              <span class="accordion-chevron">↓</span>
            </summary>
            <div class="accordion-body">
              <p class="specs-text">${product.details?.care || 'Clean gently with a soft cloth.'}</p>
            </div>
          </details>

          <details class="accordion-item">
            <summary class="accordion-header">
              <span>Shipping & Guarantee</span>
              <span class="accordion-chevron">↓</span>
            </summary>
            <div class="accordion-body">
              <p class="specs-text">Complimentary standard shipping on orders over $150. Packaged in 100% recyclable, plastic-free molded paper packaging.</p>
            </div>
          </details>
        </div>
      </div>
    `;

    this.bindDetailEvents(product);
    this.renderRelated(relatedProducts);
  }

  bindDetailEvents(product) {
    const mainImg = document.getElementById('main-product-img');
    const thumbBtns = document.querySelectorAll('.gallery-thumb-btn');
    const variantBtns = document.querySelectorAll('.variant-pill');
    const variantDisplay = document.getElementById('variant-name-display');
    const qtyInput = document.getElementById('qty-input');
    const qtyDec = document.getElementById('qty-decrease');
    const qtyInc = document.getElementById('qty-increase');
    const addBtn = document.getElementById('btn-add-to-cart');
    const addText = document.getElementById('btn-add-text');

    // Thumbnail swap
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        thumbBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (mainImg) {
          mainImg.src = btn.dataset.src;
        }
      });
    });

    // Variant switch
    variantBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        variantBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const selectedName = btn.dataset.name;
        this.selectedVariant = product.variants.find(v => v.name === selectedName);
        if (variantDisplay) {
          variantDisplay.textContent = selectedName;
        }
      });
    });

    // Quantity controls
    const updateQtyDisplay = () => {
      if (qtyInput) qtyInput.value = this.currentQuantity;
      if (addText) {
        addText.textContent = `Add to Bag • $${(product.price * this.currentQuantity).toFixed(2)}`;
      }
    };

    if (qtyDec) {
      qtyDec.addEventListener('click', () => {
        if (this.currentQuantity > 1) {
          this.currentQuantity -= 1;
          updateQtyDisplay();
        }
      });
    }

    if (qtyInc) {
      qtyInc.addEventListener('click', () => {
        if (this.currentQuantity < 10) {
          this.currentQuantity += 1;
          updateQtyDisplay();
        }
      });
    }

    // Add to cart click
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addBtn.disabled = true;
        const originalHtml = addBtn.innerHTML;
        addBtn.innerHTML = `<span>Adding...</span>`;

        setTimeout(() => {
          addBtn.innerHTML = `<span>Added to Bag ✓</span>`;
          addBtn.classList.add('btn-success-state');

          if (this.onAddToCart) {
            this.onAddToCart(product, this.currentQuantity, this.selectedVariant);
          }

          setTimeout(() => {
            addBtn.innerHTML = originalHtml;
            addBtn.disabled = false;
            addBtn.classList.remove('btn-success-state');
            updateQtyDisplay();
          }, 1400);
        }, 350);
      });
    }
  }

  renderRelated(relatedProducts) {
    if (!this.relatedContainer) return;

    if (!relatedProducts || relatedProducts.length === 0) {
      this.relatedContainer.parentElement.style.display = 'none';
      return;
    }

    this.relatedContainer.innerHTML = relatedProducts.map(item => `
      <div class="product-card">
        <div class="product-card-media">
          <a href="product.html?id=${item.id}">
            <img src="${item.image}" alt="${item.name}" class="product-card-img" />
          </a>
        </div>
        <div class="product-card-body">
          <div class="product-card-meta">
            <span class="product-card-cat">${item.category}</span>
            <span class="star-icon">★ ${item.rating}</span>
          </div>
          <h4 class="product-card-title">
            <a href="product.html?id=${item.id}">${item.name}</a>
          </h4>
          <div class="product-card-footer">
            <span class="product-card-price">$${item.price.toFixed(2)}</span>
            <a href="product.html?id=${item.id}" class="product-card-link">View &rarr;</a>
          </div>
        </div>
      </div>
    `).join('');
  }
};
