/**
 * CartModel
 * Manages shopping cart state, items, persistence, and total calculations.
 */
window.Khyber = window.Khyber || {};

window.Khyber.CartModel = class CartModel {
  static STORAGE_KEY = 'khyber_cart_v1';
  static FREE_SHIPPING_THRESHOLD = 150.00;

  constructor() {
    this.memoryBackup = [];
    this.items = this.loadFromStorage();
    this.listeners = [];
  }

  loadFromStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(CartModel.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      }
    } catch (e) {
      console.warn('LocalStorage unavailable in current context; using memory session.', e);
    }
    return this.memoryBackup || [];
  }

  saveToStorage() {
    this.memoryBackup = this.items;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CartModel.STORAGE_KEY, JSON.stringify(this.items));
      }
    } catch (e) {
      // Graceful fallback for sandboxed origins
    }
  }

  subscribe(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
      listener(this.getState());
    }
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveToStorage();
    const state = this.getState();
    this.listeners.forEach(fn => fn(state));
  }

  addItem(product, quantity = 1, variant = null) {
    if (!product || !product.id) return false;

    const variantName = variant ? variant.name : (product.variants?.[0]?.name || 'Standard');
    const existingIndex = this.items.findIndex(
      item => item.product.id === product.id && item.variant === variantName
    );

    const safeQty = Math.max(1, parseInt(quantity, 10) || 1);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += safeQty;
    } else {
      this.items.push({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        },
        variant: variantName,
        quantity: safeQty
      });
    }

    this.notify();
    return true;
  }

  updateQuantity(productId, variantName, quantity) {
    const target = this.items.find(
      item => item.product.id === productId && item.variant === variantName
    );
    if (!target) return;

    // Strict constraint: Quantity in cart cannot be less than 1!
    const newQty = Math.max(1, parseInt(quantity, 10) || 1);
    target.quantity = newQty;
    this.notify();
  }

  removeItem(productId, variantName) {
    this.items = this.items.filter(
      item => !(item.product.id === productId && item.variant === variantName)
    );
    this.notify();
  }

  clear() {
    this.items = [];
    this.notify();
  }

  getState() {
    const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const freeShippingRemaining = Math.max(0, CartModel.FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / CartModel.FREE_SHIPPING_THRESHOLD) * 100);

    return {
      items: [...this.items],
      count,
      subtotal,
      formattedSubtotal: `$${subtotal.toFixed(2)}`,
      freeShippingThreshold: CartModel.FREE_SHIPPING_THRESHOLD,
      freeShippingRemaining,
      formattedRemaining: `$${freeShippingRemaining.toFixed(2)}`,
      freeShippingProgress,
      isFreeShippingEligible: subtotal >= CartModel.FREE_SHIPPING_THRESHOLD
    };
  }
};
