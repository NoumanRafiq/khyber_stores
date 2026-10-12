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
        return stored ? JSON.parse(stored) : [];
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for wishlist; using session backup.', e);
    }
    return this.memoryBackup || [];
  }

  saveToStorage() {
    this.memoryBackup = this.items;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(WishlistModel.STORAGE_KEY, JSON.stringify(this.items));
      }
    } catch (e) {
      // fallback
    }
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
        tagline: product.tagline || ''
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
