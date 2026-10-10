/**
 * ProductListView
 * Renders product grids, category filter buttons, and search results.
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

  renderProducts(products) {
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

    this.gridContainer.innerHTML = products.map((item, index) => `
      <article class="product-card" style="animation-delay: ${index * 60}ms;">
        <div class="product-card-media">
          <a href="product.html?id=${item.id}" class="product-media-link" aria-label="View ${item.name}">
            <img src="${item.image}" alt="${item.name}" class="product-card-img" loading="lazy" />
          </a>
          ${item.badge ? `<span class="product-badge">${item.badge}</span>` : ''}
          <button 
            class="btn-quick-add" 
            data-id="${item.id}" 
            aria-label="Quick add ${item.name} to bag">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            <span>Quick Add</span>
          </button>
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
    `).join('');

    // Attach quick add listeners
    this.gridContainer.querySelectorAll('.btn-quick-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        
        // Quick visual feedback on button
        const span = btn.querySelector('span');
        const originalText = span.textContent;
        span.textContent = 'Added ✓';
        btn.classList.add('added');
        setTimeout(() => {
          span.textContent = originalText;
          btn.classList.remove('added');
        }, 1200);

        if (this.onQuickAdd) this.onQuickAdd(id);
      });
    });
  }
};
