/**
 * ProductListView
 * Renders product grids, category filter buttons, search results, quick view & wishlist buttons.
 */
window.Khyber = window.Khyber || {};

window.Khyber.ProductListView = class ProductListView {
  constructor() {
    this.gridContainer = document.getElementById('products-grid');
    this.filterContainer = document.getElementById('category-filters');
    this.searchInput = document.getElementById('search-input');
    this.resultCount = document.getElementById('results-count');

    this.onSelectCategory = null;
    this.onSearch = null;
    this.onQuickAdd = null;
    this.onQuickView = null;
    this.onToggleWishlist = null;

    this.bindSearch();
  }

  bindSearch() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        if (this.onSearch) this.onSearch(e.target.value);
      });
    }
  }

  renderCategories(categories, activeCategory) {
    if (!this.filterContainer) return;

    this.filterContainer.innerHTML = categories.map(cat => `
      <button 
        class="filter-pill ${cat.toLowerCase() === activeCategory.toLowerCase() ? 'active' : ''}" 
        data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    this.filterContainer.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.dataset.category;
        if (this.onSelectCategory) this.onSelectCategory(selected);
      });
    });
  }

  renderProducts(products, wishlistIds = []) {
    if (!this.gridContainer) return;

    if (this.resultCount) {
      this.resultCount.textContent = `${products.length} curated piece${products.length === 1 ? '' : 's'}`;
    }

    if (products.length === 0) {
      this.gridContainer.innerHTML = `
        <div class="empty-results">
          <p class="empty-results-title">No matching pieces found</p>
          <p class="empty-results-desc">Try searching for other materials like ceramic, leather, brass, or wool.</p>
        </div>
      `;
      return;
    }

    this.gridContainer.innerHTML = products.map((item, index) => {
      const isWishlisted = wishlistIds.includes(item.id);
      return `
        <article class="product-card" style="animation-delay: ${index * 60}ms;">
          <div class="product-card-media">
            <a href="product.html?id=${item.id}" class="product-media-link" aria-label="View ${item.name}">
              <img src="${item.image}" alt="${item.name}" class="product-card-img" loading="lazy" />
            </a>
            ${item.badge ? `<span class="product-badge">${item.badge}</span>` : ''}

            <!-- Wishlist Heart Button -->
            <button 
              class="btn-wishlist ${isWishlisted ? 'active' : ''}" 
              data-id="${item.id}" 
              aria-label="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>

            <!-- Card Actions Overlay -->
            <div class="card-action-overlay">
              <button class="btn-card-action btn-quick-view" data-id="${item.id}" aria-label="Quick preview">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Quick View</span>
              </button>
              <button class="btn-card-action btn-quick-add" data-id="${item.id}" aria-label="Quick add to bag">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                <span>Add to Bag</span>
              </button>
            </div>
          </div>

          <div class="product-card-body">
            <div class="product-card-meta">
              <span class="product-card-cat">${item.category}</span>
              <div class="product-card-rating">
                <span class="star-icon">★</span>
                <span class="rating-val">${item.rating}</span>
                <span class="reviews-count">(${item.reviewsCount})</span>
              </div>
            </div>

            <h3 class="product-card-title">
              <a href="product.html?id=${item.id}">${item.name}</a>
            </h3>

            <p class="product-card-tagline">${item.tagline}</p>

            <div class="product-card-footer">
              <span class="product-card-price">$${item.price.toFixed(2)}</span>
              <a href="product.html?id=${item.id}" class="product-card-link">View Details &rarr;</a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach listeners
    this.gridContainer.querySelectorAll('.btn-quick-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        const span = btn.querySelector('span');
        if (span) {
          const original = span.textContent;
          span.textContent = 'Added ✓';
          setTimeout(() => { span.textContent = original; }, 1200);
        }
        if (this.onQuickAdd) this.onQuickAdd(id);
      });
    });

    this.gridContainer.querySelectorAll('.btn-quick-view').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        if (this.onQuickView) this.onQuickView(id);
      });
    });

    this.gridContainer.querySelectorAll('.btn-wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        if (this.onToggleWishlist) this.onToggleWishlist(id, btn);
      });
    });
  }
};
