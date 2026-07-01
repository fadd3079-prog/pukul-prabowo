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

export function showError(message, duration = 5000) {
  // Remove existing toast
  const existing = document.getElementById('error-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'error-toast';
  toast.className = 'error-toast';
  toast.innerHTML = `
    <span>${escapeToastHtml(message)}</span>
    <button onclick="this.parentElement.remove()" style="margin-left:10px;background:none;border:none;color:white;font-size:18px;cursor:pointer;">&times;</button>
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
    <button onclick="this.parentElement.remove()" style="margin-left:10px;background:none;border:none;color:white;font-size:18px;cursor:pointer;">&times;</button>
  `;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), duration);
}

// CSS injected for error toast (success toast CSS is in style.css)
const style = document.createElement('style');
style.textContent = `
  .error-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    font-family: sans-serif;
    font-size: 14px;
    max-width: 350px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: toastSlideIn 0.3s ease;
  }
  @media (max-width: 480px) {
    .error-toast { left: 20px; right: 20px; max-width: none; }
  }
`;
document.head.appendChild(style);
