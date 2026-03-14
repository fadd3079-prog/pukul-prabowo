// game/engine.js
// Game loop utama menggunakan requestAnimationFrame
// Bertugas: cek combo timeout, bersihkan popup lama, update animasi

import gameState from './gameState.js';

// ===== INTERNAL STATE =====
let rafId       = null;   // ID requestAnimationFrame
let isRunning   = false;  // Status loop
let tickCallback = null;  // Callback dari script.js (onTick)

// Interval bersihkan popup (ms) — tidak perlu tiap frame
const CLEANUP_INTERVAL = 500;
let lastCleanupTime = 0;

// ===== INIT =====
/**
 * Daftarkan callback tick dari luar
 * @param {{ onTick: Function }} options
 */
export function initEngine({ onTick } = {}) {
  tickCallback = onTick || null;
}

// ===== START =====
/**
 * Mulai game loop — dipanggil saat player menekan Main
 */
export function startEngine() {
  if (isRunning) return;
  isRunning = true;
  gameState.startTime = Date.now();
  loop(performance.now());
}

// ===== STOP =====
/**
 * Hentikan game loop
 */
export function stopEngine() {
  isRunning = false;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

// ===== MAIN LOOP =====
/**
 * Loop utama — ringan, hanya jalankan logika esensial
 * @param {number} now - timestamp dari rAF
 */
function loop(now) {
  if (!isRunning) return;

  // Panggil tick callback (combo timeout, dll)
  if (tickCallback) tickCallback(now);

  // Bersihkan popup lama setiap CLEANUP_INTERVAL ms
  if (now - lastCleanupTime >= CLEANUP_INTERVAL) {
    cleanupOldPopups();
    lastCleanupTime = now;
  }

  rafId = requestAnimationFrame(loop);
}

// ===== CLEANUP POPUP =====
/**
 * Hapus popup lama jika melebihi batas maksimum (20)
 * Ini penting untuk performa HP low-end
 */
const MAX_POPUPS = 20;

function cleanupOldPopups() {
  const container = document.getElementById('popup-container');
  if (!container) return;

  const popups = container.children;
  // Hapus dari depan (popup paling lama) jika melebihi batas
  while (popups.length > MAX_POPUPS) {
    container.removeChild(popups[0]);
  }
}