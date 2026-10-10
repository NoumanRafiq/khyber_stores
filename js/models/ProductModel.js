/**
 * ProductModel
 * Pure business and data logic for products catalog.
 */
window.Khyber = window.Khyber || {};

window.Khyber.ProductModel = class ProductModel {
  constructor() {
    this.products = [...(window.Khyber.products || [])];
  }

  getAll() {
    return this.products;
  }

  getById(id) {
    if (!id) return null;
    return this.products.find(p => p.id.toLowerCase() === id.toLowerCase()) || null;
  }

  getCategories() {
    const categories = new Set(this.products.map(p => p.category));
    return ['All', ...Array.from(categories)];
  }

  filter(category = 'All', searchQuery = '') {
    return this.products.filter(item => {
      const matchesCategory = category === 'All' || item.category.toLowerCase() === category.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = !query || 
        item.name.toLowerCase().includes(query) ||
        item.tagline.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }

  getRelated(currentId, limit = 3) {
    const current = this.getById(currentId);
    if (!current) return this.products.slice(0, limit);
    
    // Prioritize same category, then others
    const others = this.products.filter(p => p.id !== currentId);
    others.sort((a, b) => (b.category === current.category ? 1 : 0) - (a.category === current.category ? 1 : 0));
    return others.slice(0, limit);
  }
};
