/**
 * ToastView
 * Displays subtle, premium floating notifications.
 */
window.Khyber = window.Khyber || {};

window.Khyber.ToastView = class ToastView {
  constructor() {
    this.container = this.getOrCreateContainer();
  }

  getOrCreateContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    return container;
  }

  show({ title, message = '', image = null, duration = 3500, type = 'info' }) {
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    
    toast.innerHTML = `
      ${image ? `<img src="${image}" alt="" class="toast-img" />` : ''}
      <div class="toast-content">
        <h4 class="toast-title">${title}</h4>
        ${message ? `<p class="toast-msg">${message}</p>` : ''}
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 250);
    };

    closeBtn.addEventListener('click', dismiss);
    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }
};
