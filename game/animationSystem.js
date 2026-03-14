// game/animationSystem.js
// Mengelola animasi squash & stretch pada objek utama
// Menggunakan CSS transform scale — ringan untuk HP low-end

// ===== INTERNAL REFS =====
let hitObjectEl = null;   // #hit-object
let isAnimating = false;  // Cegah animasi tumpuk

// ===== TIMING =====
const DURATION_NORMAL   = 120;  // ms — animasi hit biasa
const DURATION_CRITICAL = 180;  // ms — animasi critical lebih dramatis
const DURATION_COMBO    = 200;  // ms — animasi combo event

// ===== INIT =====
/**
 * @param {HTMLElement} el - #hit-object
 */
export function initAnimationSystem(el) {
  hitObjectEl = el;
}

// ===== CORE ANIMATOR =====
/**
 * Jalankan squash & stretch pada hitObject
 * @param {number} squashX   - scale X saat squash (contoh: 0.85)
 * @param {number} squashY   - scale Y saat squash (contoh: 1.15)
 * @param {number} stretchX  - scale X saat stretch (contoh: 1.1)
 * @param {number} stretchY  - scale Y saat stretch (contoh: 0.9)
 * @param {number} duration  - total durasi animasi (ms)
 */
function runSquashStretch(squashX, squashY, stretchX, stretchY, duration) {
  if (!hitObjectEl || isAnimating) return;

  isAnimating = true;

  const half    = duration / 2;
  const quarter = duration / 4;

  // FASE 1 — Squash (mengecil/menyesuaikan arah pukul)
  hitObjectEl.style.transition = `transform ${quarter}ms ease-out`;
  hitObjectEl.style.transform  = `scale(${squashX}, ${squashY})`;

  // FASE 2 — Stretch (memantul)
  setTimeout(() => {
    hitObjectEl.style.transition = `transform ${quarter}ms ease-in`;
    hitObjectEl.style.transform  = `scale(${stretchX}, ${stretchY})`;
  }, quarter);

  // FASE 3 — Kembali normal
  setTimeout(() => {
    hitObjectEl.style.transition = `transform ${half}ms ease-out`;
    hitObjectEl.style.transform  = `scale(1, 1)`;
  }, half);

  // SELESAI — buka lock animasi
  setTimeout(() => {
    isAnimating = false;
    hitObjectEl.style.transition = '';
    hitObjectEl.style.transform  = '';
  }, duration);
}

// ===== PUBLIC API =====

/**
 * Animasi hit normal atau critical
 * Critical lebih kuat & lebih lama
 * @param {boolean} isCritical
 */
export function playHitAnimation(isCritical = false) {
  if (isCritical) {
    // Critical — squash lebih dalam, stretch lebih jauh
    runSquashStretch(0.75, 1.25, 1.2, 0.8, DURATION_CRITICAL);
  } else {
    // Normal
    runSquashStretch(0.88, 1.12, 1.08, 0.93, DURATION_NORMAL);
  }
}

/**
 * Animasi combo event — lebih dramatis dari hit biasa
 */
export function playComboAnimation() {
  if (!hitObjectEl) return;

  // Override lock untuk combo event
  isAnimating = false;
  runSquashStretch(0.7, 1.3, 1.25, 0.75, DURATION_COMBO);
}

/**
 * Reset transform objek ke normal (darurat)
 */
export function resetAnimation() {
  if (!hitObjectEl) return;
  isAnimating = false;
  hitObjectEl.style.transition = '';
  hitObjectEl.style.transform  = '';
}