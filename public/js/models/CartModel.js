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

  static getVariantName(variant, product) {
    if (typeof variant === 'string' && variant.trim()) {
      return variant.trim();
    }
    if (variant && typeof variant === 'object' && variant.name) {
      return String(variant.name).trim();
    }
    if (product && Array.isArray(product.variants) && product.variants.length > 0 && product.variants[0]?.name) {
      return String(product.variants[0].name).trim();
    }
    return 'Standard';
  }

  sanitizeItems(list) {
    if (!Array.isArray(list)) return [];
    return list
      .filter(item => item && item.product && item.product.id)
      .map(item => ({
        product: {
          id: String(item.product.id),
          name: item.product.name || 'Artisan Piece',
          price: typeof item.product.price === 'number' && !isNaN(item.product.price) ? item.product.price : parseFloat(item.product.price) || 0,
          image: item.product.image || '',
          category: item.product.category || 'Living'
        },
        variant: item.variant || 'Standard',
        quantity: Math.max(1, parseInt(item.quantity, 10) || 1)
      }));
  }

  loadFromStorage() {
    // 1. Try localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(CartModel.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return this.sanitizeItems(parsed);
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage unavailable; trying session/window fallbacks.', e);
    }

    // 2. Try sessionStorage
    try {
      if (typeof sessionStorage !== 'undefined') {
        const stored = sessionStorage.getItem(CartModel.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return this.sanitizeItems(parsed);
          }
        }
      }
    } catch (e) {}

    // 3. Try window.name (reliable static file:// fallback across navigations)
    try {
      if (typeof window !== 'undefined' && window.name) {
        let nameData = {};
        try { nameData = JSON.parse(window.name); } catch (_) {}
        if (nameData && Array.isArray(nameData[CartModel.STORAGE_KEY]) && nameData[CartModel.STORAGE_KEY].length > 0) {
          return this.sanitizeItems(nameData[CartModel.STORAGE_KEY]);
        }
      }
    } catch (e) {}

    return this.memoryBackup || [];
  }

  saveToStorage() {
    this.memoryBackup = this.items;
    const json = JSON.stringify(this.items);

    // 1. Save to localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CartModel.STORAGE_KEY, json);
      }
    } catch (e) {}

    // 2. Save to sessionStorage
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(CartModel.STORAGE_KEY, json);
      }
    } catch (e) {}

    // 3. Save to window.name for static file:// transitions
    try {
      if (typeof window !== 'undefined') {
        let nameData = {};
        try { nameData = JSON.parse(window.name); } catch (_) {}
        if (typeof nameData !== 'object' || nameData === null) nameData = {};
        nameData[CartModel.STORAGE_KEY] = this.items;
        window.name = JSON.stringify(nameData);
      }
    } catch (e) {}
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

    const variantName = CartModel.getVariantName(variant, product);
    const safeQty = Math.max(1, parseInt(quantity, 10) || 1);

    const existingIndex = this.items.findIndex(
      item => item.product.id === product.id && (item.variant || 'Standard') === variantName
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += safeQty;
    } else {
      this.items.push({
        product: {
          id: product.id,
          name: product.name,
          price: typeof product.price === 'number' && !isNaN(product.price) ? product.price : parseFloat(product.price) || 0,
          image: product.image || (Array.isArray(product.images) ? product.images[0] : ''),
          category: product.category || 'Living'
        },
        variant: variantName,
        quantity: safeQty
      });
    }

    this.notify();
    return true;
  }

  updateQuantity(productId, variantName, quantity) {
    const safeVariant = (variantName || 'Standard').trim();
    const target = this.items.find(
      item => item.product.id === productId && (item.variant || 'Standard').trim() === safeVariant
    );
    if (!target) return;

    const newQty = Math.max(1, parseInt(quantity, 10) || 1);
    target.quantity = newQty;
    this.notify();
  }

  removeItem(productId, variantName) {
    const safeVariant = (variantName || 'Standard').trim();
    this.items = this.items.filter(
      item => !(item.product.id === productId && (item.variant || 'Standard').trim() === safeVariant)
    );
    this.notify();
  }

  clear() {
    this.items = [];
    this.notify();
  }

  getState() {
    const validItems = this.items || [];
    const count = validItems.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
    const subtotal = validItems.reduce((sum, item) => {
      const price = typeof item.product?.price === 'number' ? item.product.price : parseFloat(item.product?.price) || 0;
      const qty = parseInt(item.quantity, 10) || 1;
      return sum + price * qty;
    }, 0);
    const freeShippingRemaining = Math.max(0, CartModel.FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / CartModel.FREE_SHIPPING_THRESHOLD) * 100);

    return {
      items: [...validItems],
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
