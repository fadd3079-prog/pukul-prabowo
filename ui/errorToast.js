// Simple toast notifications for API errors
let toastTimeout;

export function showError(message, duration = 5000) {
  // Remove existing toast
  const existing = document.getElementById('error-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'error-toast';
  toast.className = 'error-toast';
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="margin-left: 10px;">&times;</button>
  `;
  document.body.appendChild(toast);

  // Auto remove
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.remove(), duration);
}

// CSS will be injected via style tag or global
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
  }
  @media (max-width: 480px) {
    .error-toast { left: 20px; right: 20px; max-width: none; }
  }
`;
document.head.appendChild(style);

