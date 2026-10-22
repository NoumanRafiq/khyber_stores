/**
 * HomeController
 * Drives index.html and shop.html catalog interactions:
 * category filters, search, sort, quick view & wishlist.
 */
window.Khyber = window.Khyber || {};

window.Khyber.HomeController = class HomeController {
  constructor() {
    this.model = new window.Khyber.ProductModel();
    this.view = new window.Khyber.ProductListView();
    this.cartController = new window.Khyber.CartController();
    this.wishlistController = new window.Khyber.WishlistController(this.cartController);
    this.quickViewModal = new window.Khyber.QuickViewModal();

    this.currentCategory = 'All';
    this.searchQuery = '';
    this.sortMode = 'default';

    this.init();
  }

  init() {
    // Read URL params if present (supports ?category=X&q=Y)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('q');

    if (categoryParam) this.currentCategory = categoryParam;
    if (searchParam) {
      this.searchQuery = searchParam;
      // Pre-fill search input if present
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = searchParam;
    }

    // Initial renders
    this.view.renderCategories(this.model.getCategories(), this.currentCategory);
    this.updateProductList();

    // Listen to wishlist updates to re-sync hearts
    this.wishlistController.model.subscribe(() => {
      this.updateProductList();
    });

    // View handlers
    this.view.onSelectCategory = (category) => {
      this.currentCategory = category;
      this.view.renderCategories(this.model.getCategories(), this.currentCategory);
      this.updateProductList();
    };

    this.view.onSearch = (query) => {
      this.searchQuery = query;
      this.updateProductList();
    };

    this.view.onQuickAdd = (productId) => {
      const product = this.model.getById(productId);
      if (product) {
        this.cartController.addToCart(product, 1, product.variants?.[0] || null);
      }
    };

    this.view.onQuickView = (productId) => {
      const product = this.model.getById(productId);
      if (product) {
        this.quickViewModal.open(product);
      }
    };

    this.quickViewModal.onAddToCart = (prod, qty, variant) => {
      this.cartController.addToCart(prod, qty, variant);
    };

    this.view.onToggleWishlist = (productId) => {
      const product = this.model.getById(productId);
      if (product) {
        this.wishlistController.toggle(product);
      }
    };

    // Sort selector (shop.html)
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortMode = e.target.value;
        this.updateProductList();
      });
    }
  }

  sortProducts(products) {
    const list = [...products];
    switch (this.sortMode) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list; // Featured order (as defined in data)
    }
  }

  updateProductList() {
    const filtered = this.model.filter(this.currentCategory, this.searchQuery);
    const sorted = this.sortProducts(filtered);
    const wishlistIds = this.wishlistController.getWishlistIds();
    this.view.renderProducts(sorted, wishlistIds);
  }
};

// Auto-boot reliably whether DOM is still loading or already parsed
const bootHomeController = () => {
  if (document.getElementById('products-grid')) {
    new window.Khyber.HomeController();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootHomeController);
} else {
  bootHomeController();
}
