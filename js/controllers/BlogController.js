/**
 * BlogController
 * Controls editorial stories, category filtering, and reader modal.
 */
window.Khyber = window.Khyber || {};

window.Khyber.BlogController = class BlogController {
  constructor() {
    this.model = new window.Khyber.BlogModel();
    this.view = new window.Khyber.BlogView();
    this.cartController = new window.Khyber.CartController();

    this.currentCategory = 'All';

    this.init();
  }

  init() {
    const featured = this.model.getFeatured();
    this.view.renderFeatured(featured);
    this.view.renderCategories(this.model.getCategories(), this.currentCategory);
    this.updatePosts();

    this.view.onSelectCategory = (category) => {
      this.currentCategory = category;
      this.view.renderCategories(this.model.getCategories(), this.currentCategory);
      this.updatePosts();
    };
  }

  updatePosts() {
    const posts = this.model.filter(this.currentCategory);
    this.view.renderPosts(posts);
  }
};

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('blog-grid-container')) {
    new window.Khyber.BlogController();
  }
});
