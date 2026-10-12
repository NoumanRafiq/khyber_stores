/**
 * ProductController
 * Drives product.html single product view, variant selection, cart, and wishlist.
 */
window.Khyber = window.Khyber || {};

window.Khyber.ProductController = class ProductController {
  constructor() {
    this.model = new window.Khyber.ProductModel();
    this.view = new window.Khyber.ProductDetailView();
    this.cartController = new window.Khyber.CartController();
    this.wishlistController = new window.Khyber.WishlistController(this.cartController);

    this.init();
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '');
    const productId = urlParams.get('id') || hash || 'kh-001';

    const product = this.model.getById(productId);

    if (!product) {
      this.renderNotFound();
      return;
    }

    const related = this.model.getRelated(product.id, 3);
    const isWishlisted = this.wishlistController.model.has(product.id);
    this.view.render(product, related, isWishlisted);

    // Bind Add to Cart
    this.view.onAddToCart = (prod, quantity, variant) => {
      this.cartController.addToCart(prod, quantity, variant);
    };

    // Bind Wishlist
    this.view.onToggleWishlist = (prod) => {
      return this.wishlistController.toggle(prod);
    };
  }

  renderNotFound() {
    const container = document.getElementById('product-detail-container');
    if (container) {
      container.innerHTML = `
        <div class="product-not-found text-center" style="padding: 4rem 0;">
          <h2>Piece Not Found</h2>
          <p class="text-muted" style="margin: 1rem 0 2rem;">The requested object is no longer in our archive or has moved.</p>
          <a href="index.html#catalog" class="btn btn-primary">Return to Collection</a>
        </div>
      `;
    }
  }
};

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-detail-container')) {
    new window.Khyber.ProductController();
  }
});
