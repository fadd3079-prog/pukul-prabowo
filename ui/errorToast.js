// ui/errorToast.js — Toast notifications for API feedback

let toastTimeout;

function escapeToastHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const closeSvg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: block; opacity: 0.85;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

export function showError(message, duration = 5000) {
  // Remove existing toast
  const existing = document.getElementById('error-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'error-toast';
  toast.className = 'error-toast';
  toast.innerHTML = `
    <span>${escapeToastHtml(message)}</span>
    <button onclick="this.parentElement.remove()" class="toast-close-btn" aria-label="Tutup">${closeSvg}</button>
  `;
  document.body.appendChild(toast);

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.remove(), duration);
}

export function showSuccess(message, duration = 3000) {
  const existing = document.getElementById('success-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'success-toast';
  toast.className = 'toast-success';
  toast.innerHTML = `
    <span>${escapeToastHtml(message)}</span>
    <button onclick="this.parentElement.remove()" class="toast-close-btn" aria-label="Tutup">${closeSvg}</button>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), duration);
}

// CSS injected for error toast (success toast CSS is in style.css)
const style = document.createElement('style');
style.textContent = `
  .error-toast {
    position: fixed;
    top: 24px;
    right: 24px;
    background: rgba(239, 68, 68, 0.95);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    padding: 14px 22px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3), 0 0 50px rgba(0,0,0,0.2);
    z-index: 10000;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    max-width: 380px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  .toast-close-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s, transform 0.2s;
  }
  
  .toast-close-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.05);
  }
  
  .toast-close-btn:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    .error-toast { left: 20px; right: 20px; max-width: none; }
  }
`;
document.head.appendChild(style);
