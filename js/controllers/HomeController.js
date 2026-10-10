/**
 * HomeController
 * Drives index.html catalog interactions, category filters, and search.
 */
window.Khyber = window.Khyber || {};

window.Khyber.HomeController = class HomeController {
  constructor() {
    this.model = new window.Khyber.ProductModel();
    this.view = new window.Khyber.ProductListView();
    this.cartController = new window.Khyber.CartController();

    this.currentCategory = 'All';
    this.searchQuery = '';

    this.init();
  }

  init() {
    // Read category from URL params if present
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      this.currentCategory = categoryParam;
    }

    // Initial renders
    this.view.renderCategories(this.model.getCategories(), this.currentCategory);
    this.updateProductList();

    // Bind View handlers
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
  }

  updateProductList() {
    const filtered = this.model.filter(this.currentCategory, this.searchQuery);
    this.view.renderProducts(filtered);
  }
};

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('products-grid')) {
    new window.Khyber.HomeController();
  }
});
