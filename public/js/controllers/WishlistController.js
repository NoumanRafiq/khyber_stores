/**
 * WishlistController
 * Manages wishlist model, wishlist drawer view, and user actions across all pages.
 */
window.Khyber = window.Khyber || {};

window.Khyber.WishlistController = class WishlistController {
  constructor(cartController) {
    this.model = new window.Khyber.WishlistModel();
    this.view = new window.Khyber.WishlistView();
    this.toast = new window.Khyber.ToastView();
    this.cartController = cartController;

    this.init();
  }

  init() {
    this.model.subscribe((items) => {
      this.view.render(items);
    });

    this.view.onRemoveItem = (id) => {
      this.model.remove(id);
      this.toast.show({
        title: 'Removed from Wishlist',
        message: 'Item removed from your favorites list.',
        type: 'info'
      });
    };

    this.view.onMoveToBag = (id) => {
      const items = this.model.getItems();
      const product = items.find(p => p.id === id);
      if (product) {
        let fullProduct = product;
        if (window.Khyber && Array.isArray(window.Khyber.products)) {
          const matched = window.Khyber.products.find(p => p.id === id);
          if (matched) fullProduct = matched;
        }

        const cartCtrl = this.cartController || window.Khyber.cartController;
        if (cartCtrl) {
          cartCtrl.addToCart(fullProduct, 1, fullProduct.variants?.[0] || null);
          this.model.remove(id);
          this.view.close();
        }
      }
    };
  }

  toggle(product) {
    const isAdded = this.model.toggle(product);
    if (isAdded) {
      this.toast.show({
        title: 'Saved to Wishlist',
        message: `${product.name} saved to your favorites.`,
        image: product.image,
        type: 'success'
      });
    } else {
      this.toast.show({
        title: 'Removed from Wishlist',
        message: `${product.name} removed from your favorites.`,
        type: 'info'
      });
    }
    return isAdded;
  }

  getWishlistIds() {
    return this.model.getItems().map(item => item.id);
  }
};
