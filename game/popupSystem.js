// game/popupSystem.js
// Mengelola spawn, posisi acak, dan lifecycle popup teks di atas objek

// ===== INTERNAL REFS =====
let container  = null;   // #popup-container
let hitObject  = null;   // #hit-object (untuk posisi acak relatif)

const MAX_POPUPS = 20;   // Batas popup aktif — jaga performa HP low-end

// ===== INIT =====
/**
 * @param {HTMLElement} containerEl  - #popup-container
 * @param {HTMLElement} hitObjectEl  - #hit-object
 */
export function initPopupSystem(containerEl, hitObjectEl) {
  container = containerEl;
  hitObject = hitObjectEl;
}

// ===== SPAWN HELPERS =====

/**
 * Posisi acak di sekitar objek
 * x: -40px ~ +40px  |  y: -20px ~ +20px
 * @returns {{ x: number, y: number }}
 */
function randomOffset() {
  const x = Math.floor(Math.random() * 81) - 40;  // -40 ~ +40
  const y = Math.floor(Math.random() * 41) - 20;  // -20 ~ +20
  return { x, y };
}

/**
 * Hitung posisi tengah hitObject relatif terhadap container
 * @returns {{ cx: number, cy: number }}
 */
function getObjectCenter() {
  if (!hitObject || !container) return { cx: 0, cy: 0 };

  const objRect  = hitObject.getBoundingClientRect();
  const conRect  = container.getBoundingClientRect();

  return {
    cx: objRect.left - conRect.left + objRect.width  / 2,
    cy: objRect.top  - conRect.top  + objRect.height / 2,
  };
}

/**
 * Buat elemen popup dan tambahkan ke container
 * @param {string} text      - teks yang ditampilkan
 * @param {string} className - kelas CSS (popup-hit / popup-combo / popup-critical)
 */
function spawnPopup(text, className) {
  if (!container) return;

  // Hapus popup lama jika melebihi batas
  enforcLimit();

  const { cx, cy } = getObjectCenter();
  const { x, y }   = randomOffset();

  const el = document.createElement('div');
  el.className = `popup ${className}`;
  el.textContent = text;

  // Posisi absolut di dalam container
  el.style.left = `${cx + x}px`;
  el.style.top  = `${cy + y}px`;
  el.style.transform = 'translate(-50%, -50%)';

  container.appendChild(el);

  // Hapus otomatis setelah animasi selesai (750ms sesuai CSS)
  el.addEventListener('animationend', () => {
    el.remove();
  }, { once: true });
}

// ===== ENFORCE POPUP LIMIT =====
/**
 * Jika popup melebihi MAX_POPUPS, hapus yang paling lama
 */
function enforcLimit() {
  if (!container) return;
  while (container.children.length >= MAX_POPUPS) {
    container.removeChild(container.firstChild);
  }
}

// ===== PUBLIC API =====

/**
 * Popup angka hit normal
 * @param {number} value - nilai hit (contoh: 1, 3, 9)
 */
export function spawnHitPopup(value) {
  spawnPopup(`${value}`, 'popup-hit');
}

/**
 * Popup combo event (kelipatan 10)
 * @param {number} combo
 */
export function spawnComboPopup(combo) {
  spawnPopup(`COMBO ${combo}x!!`, 'popup-combo');
}

/**
 * Popup critical hit
 */
export function spawnCriticalPopup() {
  spawnPopup('CRITICAL!!', 'popup-critical');
}