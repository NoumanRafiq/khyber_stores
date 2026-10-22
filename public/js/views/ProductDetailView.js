/**
 * ProductDetailView
 * Controls product detail page layout, gallery thumbnails, variants, quantity stepper,
 * wishlist toggle, and interactive customer review submissions.
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
    this.onToggleWishlist = null;
    this.reviews = [];
  }

  render(product, relatedProducts = [], isWishlisted = false) {
    if (!product || !this.mainContainer) return;

    // Document Title update
    document.title = `${product.name} — Khyber Stores`;

    // Breadcrumbs
    if (this.breadcrumbCategory) {
      this.breadcrumbCategory.textContent = product.category;
      this.breadcrumbCategory.href = `index.html#catalog`;
    }
    if (this.breadcrumbTitle) {
      this.breadcrumbTitle.textContent = product.name;
    }

    // Set initial variant
    this.selectedVariant = product.variants?.[0] || null;
    this.currentQuantity = 1;

    // Sample default reviews
    this.reviews = [
      {
        author: "Eleanor Vance",
        date: "2 weeks ago",
        rating: 5,
        title: "Transcendent tactile presence",
        comment: "The craftsmanship exceeds every expectation. The texture feels organic yet sculptural. Packaged with extraordinary care."
      },
      {
        author: "Julian Chen",
        date: "1 month ago",
        rating: 5,
        title: "A permanent staple in my studio",
        comment: "Subtle, unpretentious luxury. It catches natural afternoon light in the most tranquil way."
      }
    ];

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
            <button id="qty-decrease" class="qty-btn" aria-label="Decrease quantity" disabled style="opacity: 0.35; cursor: not-allowed;">&minus;</button>
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

          <button id="btn-detail-wishlist" class="btn btn-secondary btn-icon-round ${isWishlisted ? 'active' : ''}" aria-label="Save to Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
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
                <li><strong>Origin:</strong> ${product.details?.origin || 'Ethically made in Europe'}</li>
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
              <p class="specs-text">Complimentary standard express shipping on orders over $150. Packaged in 100% recyclable, plastic-free molded paper packaging.</p>
            </div>
          </details>
        </div>
      </div>
    `;

    this.bindDetailEvents(product);
    this.renderRelated(relatedProducts);
    this.renderReviewsSection(product);
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
    const wishlistBtn = document.getElementById('btn-detail-wishlist');

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

    // Quantity controls - Strictly minimum 1
    const updateQtyDisplay = () => {
      const currentQtyInput = document.getElementById('qty-input');
      const currentAddText = document.getElementById('btn-add-text');
      const currentQtyDec = document.getElementById('qty-decrease');

      if (currentQtyInput) currentQtyInput.value = this.currentQuantity;
      if (currentAddText) {
        currentAddText.textContent = `Add to Bag • $${(product.price * this.currentQuantity).toFixed(2)}`;
      }
      if (currentQtyDec) {
        if (this.currentQuantity <= 1) {
          currentQtyDec.disabled = true;
          currentQtyDec.style.opacity = '0.35';
          currentQtyDec.style.cursor = 'not-allowed';
        } else {
          currentQtyDec.disabled = false;
          currentQtyDec.style.opacity = '1';
          currentQtyDec.style.cursor = 'pointer';
        }
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
        const textSpan = addBtn.querySelector('#btn-add-text') || addBtn.querySelector('span');
        const originalText = textSpan ? textSpan.textContent : 'Add to Bag';
        if (textSpan) textSpan.textContent = 'Adding...';

        setTimeout(() => {
          if (textSpan) textSpan.textContent = 'Added to Bag ✓';
          addBtn.classList.add('btn-success-state');

          if (this.onAddToCart) {
            this.onAddToCart(product, this.currentQuantity, this.selectedVariant);
          }

          setTimeout(() => {
            addBtn.disabled = false;
            addBtn.classList.remove('btn-success-state');
            updateQtyDisplay();
          }, 1400);
        }, 200);
      });
    }

    // Wishlist click
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        if (this.onToggleWishlist) {
          const isAdded = this.onToggleWishlist(product);
          wishlistBtn.classList.toggle('active', isAdded);
          const svg = wishlistBtn.querySelector('svg');
          if (svg) svg.setAttribute('fill', isAdded ? 'currentColor' : 'none');
        }
      });
    }
  }

  renderReviewsSection(product) {
    let reviewsSection = document.getElementById('product-reviews-section');
    if (!reviewsSection) {
      reviewsSection = document.createElement('section');
      reviewsSection.id = 'product-reviews-section';
      reviewsSection.className = 'product-reviews-section container';
      this.mainContainer.parentNode.insertBefore(reviewsSection, this.relatedContainer.closest('.related-section'));
    }

    reviewsSection.innerHTML = `
      <div class="reviews-header-block">
        <div>
          <h3>Client Perspectives</h3>
          <p class="text-muted">Unfiltered impressions on material honesty and enduring form.</p>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-open-review-modal">Write an Impression</button>
      </div>

      <div class="reviews-grid" id="reviews-list-container">
        ${this.reviews.map(r => `
          <div class="review-card">
            <div class="review-stars">${'★'.repeat(r.rating)}</div>
            <h4 class="review-title">${r.title}</h4>
            <p class="review-text">"${r.comment}"</p>
            <div class="review-author-meta">
              <strong>${r.author}</strong>
              <span>&bull;</span>
              <span>${r.date}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    const openBtn = reviewsSection.querySelector('#btn-open-review-modal');
    if (openBtn) {
      openBtn.addEventListener('click', () => this.showReviewModal(product));
    }
  }

  showReviewModal(product) {
    let modal = document.getElementById('review-form-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'review-form-modal';
      modal.className = 'checkout-modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="checkout-modal-card">
        <button class="checkout-modal-close" id="rfm-close-btn">&times;</button>
        <div class="checkout-header">
          <span class="badge badge-accent">Community Chronicle</span>
          <h3>Share Your Experience</h3>
          <p>${product.name}</p>
        </div>

        <form id="review-submit-form" class="checkout-form">
          <div class="form-group">
            <label>Rating</label>
            <div class="star-rating-picker" id="star-picker">
              <span class="star-pick active" data-rating="1">★</span>
              <span class="star-pick active" data-rating="2">★</span>
              <span class="star-pick active" data-rating="3">★</span>
              <span class="star-pick active" data-rating="4">★</span>
              <span class="star-pick active" data-rating="5">★</span>
            </div>
          </div>

          <div class="form-group">
            <label for="rf-name">Your Name</label>
            <input type="text" id="rf-name" class="form-control" placeholder="e.g. Maya Lin" required />
          </div>

          <div class="form-group">
            <label for="rf-headline">Headline</label>
            <input type="text" id="rf-headline" class="form-control" placeholder="e.g. Sculptural perfection" required />
          </div>

          <div class="form-group">
            <label for="rf-comment">Impression & Comments</label>
            <textarea id="rf-comment" class="form-control" rows="3" placeholder="Tell us how the material feels and looks in your space..." required></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-block">Publish Impression</button>
        </form>
      </div>
    `;

    modal.classList.add('is-open');
    document.body.classList.add('modal-open');

    let currentPickRating = 5;
    const stars = modal.querySelectorAll('.star-pick');
    stars.forEach(s => {
      s.addEventListener('click', () => {
        currentPickRating = parseInt(s.dataset.rating, 10);
        stars.forEach(st => {
          st.classList.toggle('active', parseInt(st.dataset.rating, 10) <= currentPickRating);
        });
      });
    });

    const closeModal = () => {
      modal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    };

    modal.querySelector('#rfm-close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    modal.querySelector('#review-submit-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const author = modal.querySelector('#rf-name').value;
      const title = modal.querySelector('#rf-headline').value;
      const comment = modal.querySelector('#rf-comment').value;

      this.reviews.unshift({
        author,
        date: "Just now",
        rating: currentPickRating,
        title,
        comment
      });

      closeModal();
      this.renderReviewsSection(product);

      if (window.Khyber.ToastView) {
        new window.Khyber.ToastView().show({
          title: "Impression Published",
          message: "Thank you for contributing to our community chronicle.",
          type: "success"
        });
      }
    });
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
