/**
 * nav.js — Shared Navigation Controller
 * Auto-detects current page and sets the active tab indicator.
 * Handles mobile drawer, scroll effects, and shared nav behaviors.
 */
(function () {
  'use strict';

  // Map of page filenames to nav link hrefs
  const PAGE_NAV_MAP = {
    'index.html':   'index.html',
    '':             'index.html',
    'shop.html':    'shop.html',
    'about.html':   'about.html',
    'blog.html':    'blog.html',
    'contact.html': 'contact.html',
    'product.html': 'shop.html', // product pages highlight the Shop tab
  };

  function setActiveNav() {
    // Get current page filename
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    const activeHref = PAGE_NAV_MAP[page] || null;

    // Set active class on all matching nav links
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      link.classList.remove('active');
      if (activeHref && link.getAttribute('href') === activeHref) {
        link.classList.add('active');
      }
    });
  }

  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  function initMobileNav() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const overlay = document.getElementById('mobile-nav-overlay');
    const close = document.getElementById('mobile-nav-close');

    if (!toggle || !drawer || !overlay) return;

    const openNav = () => {
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.classList.add('modal-open');
    };

    const closeNav = () => {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    };

    toggle.addEventListener('click', openNav);
    if (close) close.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeNav();
      }
    });
  }

  function initSearchToggle() {
    const searchTrigger = document.getElementById('nav-search-trigger');
    const searchBar = document.getElementById('nav-search-bar');
    const searchInput = document.getElementById('nav-search-input');
    const searchClose = document.getElementById('nav-search-close');

    if (!searchTrigger || !searchBar) return;

    searchTrigger.addEventListener('click', () => {
      searchBar.classList.toggle('is-open');
      if (searchBar.classList.contains('is-open') && searchInput) {
        searchInput.focus();
      }
    });

    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchBar.classList.remove('is-open');
      });
    }

    // Handle search submission — redirect to shop with query
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
          window.location.href = `shop.html?q=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    initStickyHeader();
    initMobileNav();
    initSearchToggle();
  });
})();
