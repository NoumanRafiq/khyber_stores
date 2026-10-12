/**
 * CartController
 * Centralized cart manager for all pages.
 */
window.Khyber = window.Khyber || {};

window.Khyber.CartController = class CartController {
  constructor() {
    this.model = new window.Khyber.CartModel();
    this.view = new window.Khyber.CartView();
    this.toast = new window.Khyber.ToastView();

    this.init();
  }

  init() {
    // Subscribe view to model changes
    this.model.subscribe((state) => {
      this.view.render(state);
    });

    // Handle view callbacks
    this.view.onUpdateQuantity = (id, variant, qty) => {
      this.model.updateQuantity(id, variant, qty);
    };

    this.view.onRemoveItem = (id, variant) => {
      this.model.removeItem(id, variant);
      this.toast.show({
        title: 'Item Removed',
        message: 'The piece was removed from your bag.',
        type: 'info',
        duration: 2500
      });
    };

    this.view.onCheckout = () => {
      const state = this.model.getState();
      if (state.items.length === 0) return;

      this.view.close();
      this.view.showCheckoutModal(state, () => {
        this.model.clear();
        this.toast.show({
          title: 'Order Placed!',
          message: 'Check your email for tracking details.',
          type: 'success',
          duration: 4000
        });
      });
    };
  }

  addToCart(product, quantity = 1, variant = null) {
    const success = this.model.addItem(product, quantity, variant);
    if (success) {
      const variantName = variant ? variant.name : (product.variants?.[0]?.name || '');
      this.toast.show({
        title: 'Added to Bag',
        message: `${quantity}× ${product.name} ${variantName ? `(${variantName})` : ''}`,
        image: product.image,
        type: 'success',
        duration: 3200
      });
      this.view.open();
    }
  }
};
