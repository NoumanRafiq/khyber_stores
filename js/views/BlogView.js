/**
 * BlogView
 * Handles editorial blog listing, category filter, and interactive story modal.
 */
window.Khyber = window.Khyber || {};

window.Khyber.BlogView = class BlogView {
  constructor() {
    this.featuredContainer = document.getElementById('featured-post-container');
    this.gridContainer = document.getElementById('blog-grid-container');
    this.filterContainer = document.getElementById('blog-category-filters');
    this.onSelectCategory = null;
    this.modal = null;
  }

  renderCategories(categories, activeCategory) {
    if (!this.filterContainer) return;

    this.filterContainer.innerHTML = categories.map(cat => `
      <button 
        class="filter-pill ${cat.toLowerCase() === activeCategory.toLowerCase() ? 'active' : ''}" 
        data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    this.filterContainer.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        if (this.onSelectCategory) this.onSelectCategory(cat);
      });
    });
  }

  renderFeatured(post) {
    if (!this.featuredContainer || !post) return;

    this.featuredContainer.innerHTML = `
      <article class="featured-blog-card" data-slug="${post.slug}">
        <div class="featured-blog-media">
          <img src="${post.image}" alt="${post.title}" class="featured-blog-img" />
          <span class="badge badge-accent">Featured Story</span>
        </div>
        <div class="featured-blog-content">
          <div class="blog-meta-row">
            <span class="blog-cat">${post.category}</span>
            <span class="meta-dot">&bull;</span>
            <span class="blog-date">${post.date}</span>
            <span class="meta-dot">&bull;</span>
            <span class="blog-time">${post.readTime}</span>
          </div>
          <h2 class="featured-blog-title">${post.title}</h2>
          <p class="featured-blog-excerpt">${post.excerpt}</p>
          <button class="btn btn-outline read-story-btn" data-slug="${post.slug}">Read Story &rarr;</button>
        </div>
      </article>
    `;

    this.featuredContainer.querySelectorAll('.read-story-btn, .featured-blog-card').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.currentTarget === el) {
          this.openArticleModal(post);
        }
      });
    });
  }

  renderPosts(posts) {
    if (!this.gridContainer) return;

    if (posts.length === 0) {
      this.gridContainer.innerHTML = `
        <div class="empty-results">
          <p class="empty-results-title">No stories found in this section</p>
        </div>
      `;
      return;
    }

    this.gridContainer.innerHTML = posts.map(post => `
      <article class="blog-card" data-slug="${post.slug}">
        <div class="blog-card-media">
          <img src="${post.image}" alt="${post.title}" class="blog-card-img" loading="lazy" />
          <span class="blog-card-cat">${post.category}</span>
        </div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span>${post.date}</span>
            <span class="meta-dot">&bull;</span>
            <span>${post.readTime}</span>
          </div>
          <h3 class="blog-card-title">${post.title}</h3>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          <button class="blog-card-link-btn read-story-btn" data-slug="${post.slug}">
            Read Journal Entry &rarr;
          </button>
        </div>
      </article>
    `).join('');

    this.gridContainer.querySelectorAll('.blog-card').forEach(card => {
      const slug = card.dataset.slug;
      const post = posts.find(p => p.slug === slug);
      if (post) {
        card.addEventListener('click', () => this.openArticleModal(post));
      }
    });
  }

  openArticleModal(post) {
    if (!this.modal) {
      this.modal = document.createElement('div');
      this.modal.id = 'article-modal';
      this.modal.className = 'article-modal-overlay';
      document.body.appendChild(this.modal);
    }

    this.modal.innerHTML = `
      <div class="article-modal-card">
        <button class="article-modal-close" id="article-modal-close" aria-label="Close story">&times;</button>
        <div class="article-modal-hero">
          <img src="${post.image}" alt="${post.title}" class="article-modal-img" />
        </div>
        <div class="article-modal-body">
          <div class="blog-meta-row">
            <span class="blog-cat">${post.category}</span>
            <span class="meta-dot">&bull;</span>
            <span class="blog-date">${post.date}</span>
            <span class="meta-dot">&bull;</span>
            <span class="blog-time">${post.readTime}</span>
          </div>
          <h2 class="article-modal-title">${post.title}</h2>
          <p class="article-modal-subtitle">${post.subtitle}</p>
          <hr class="article-divider" />
          <div class="article-modal-paragraphs">
            ${post.content.map(p => `<p>${p}</p>`).join('')}
          </div>
          <div class="article-modal-footer">
            <div class="article-author-card">
              <span class="author-avatar">K</span>
              <div>
                <strong>Khyber Editorial Bureau</strong>
                <small class="text-muted">Stories on craftsmanship, form & intentional living.</small>
              </div>
            </div>
            <a href="index.html#catalog" class="btn btn-secondary btn-sm">Explore Collection</a>
          </div>
        </div>
      </div>
    `;

    this.modal.classList.add('is-open');
    document.body.classList.add('modal-open');

    const closeModal = () => {
      this.modal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    };

    this.modal.querySelector('#article-modal-close').addEventListener('click', closeModal);
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('is-open')) {
        closeModal();
      }
    }, { once: true });
  }
};
