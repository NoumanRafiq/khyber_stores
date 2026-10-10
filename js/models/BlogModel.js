/**
 * BlogModel
 * Manages journal/editorial articles and filtering.
 */
window.Khyber = window.Khyber || {};

window.Khyber.BlogModel = class BlogModel {
  constructor() {
    this.posts = [...(window.Khyber.posts || [])];
  }

  getAll() {
    return this.posts;
  }

  getBySlug(slug) {
    if (!slug) return null;
    return this.posts.find(p => p.slug === slug || p.id === slug) || null;
  }

  getCategories() {
    const categories = new Set(this.posts.map(p => p.category));
    return ['All', ...Array.from(categories)];
  }

  filter(category = 'All') {
    if (category === 'All') return this.posts;
    return this.posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  getFeatured() {
    return this.posts[0] || null;
  }
};
