/**
 * WishlistModel
 * Manages saved products, persistence in localStorage, and reactive subscriptions.
 */
window.Khyber = window.Khyber || {};

window.Khyber.WishlistModel = class WishlistModel {
  static STORAGE_KEY = 'khyber_wishlist_v1';

  constructor() {
    this.memoryBackup = [];
    this.items = this.loadFromStorage();
    this.listeners = [];
  }

  loadFromStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(WishlistModel.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (e) {}

    try {
      if (typeof sessionStorage !== 'undefined') {
        const stored = sessionStorage.getItem(WishlistModel.STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch (e) {}

    try {
      if (typeof window !== 'undefined' && window.name) {
        let nameData = {};
        try { nameData = JSON.parse(window.name); } catch (_) {}
        if (nameData && Array.isArray(nameData[WishlistModel.STORAGE_KEY]) && nameData[WishlistModel.STORAGE_KEY].length > 0) {
          return nameData[WishlistModel.STORAGE_KEY];
        }
      }
    } catch (e) {}

    return this.memoryBackup || [];
  }

  saveToStorage() {
    this.memoryBackup = this.items;
    const json = JSON.stringify(this.items);

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(WishlistModel.STORAGE_KEY, json);
      }
    } catch (e) {}

    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(WishlistModel.STORAGE_KEY, json);
      }
    } catch (e) {}

    try {
      if (typeof window !== 'undefined') {
        let nameData = {};
        try { nameData = JSON.parse(window.name); } catch (_) {}
        if (typeof nameData !== 'object' || nameData === null) nameData = {};
        nameData[WishlistModel.STORAGE_KEY] = this.items;
        window.name = JSON.stringify(nameData);
      }
    } catch (e) {}
  }

  subscribe(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
      listener(this.getItems());
    }
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveToStorage();
    const items = this.getItems();
    this.listeners.forEach(fn => fn(items));
  }

  getItems() {
    return [...this.items];
  }

  getCount() {
    return this.items.length;
  }

  has(productId) {
    return this.items.some(item => item.id === productId);
  }

  toggle(product) {
    if (!product || !product.id) return false;
    const exists = this.has(product.id);
    if (exists) {
      this.items = this.items.filter(item => item.id !== product.id);
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        tagline: product.tagline || '',
        variants: product.variants || []
      });
    }
    this.notify();
    return !exists; // returns true if added, false if removed
  }

  remove(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.notify();
  }
};
