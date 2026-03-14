// game/comboSystem.js
// Mengelola logika combo: increment, reset, timeout, multiplier

import gameState from './gameState.js';

// ===== CONSTANTS =====
const COMBO_EVENT_INTERVAL = 10;    // Combo event tiap kelipatan 10
const COMBO_RESET_DELAY    = 2500;  // Reset jika tidak klik selama 2500ms

// ===== INCREMENT COMBO =====
/**
 * Tambah combo +1
 * Cek apakah ini kelipatan 10 (combo event)
 * @returns {{ combo: number, isComboEvent: boolean }}
 */
export function incrementCombo() {
  gameState.combo += 1;

  const isComboEvent =
    gameState.combo % COMBO_EVENT_INTERVAL === 0 &&
    gameState.combo > 0;

  return {
    combo: gameState.combo,
    isComboEvent,
  };
}

// ===== RESET COMBO =====
/**
 * Reset combo ke 0
 * Dipanggil saat timeout atau kondisi tertentu
 */
export function resetCombo() {
  gameState.combo = 0;
  gameState.criticalChance = 0.05; // kembali ke base chance
}

// ===== CHECK COMBO TIMEOUT =====
/**
 * Dipanggil setiap tick oleh engine
 * Jika player tidak klik selama COMBO_RESET_DELAY ms, reset combo
 */
export function checkComboTimeout() {
  // Belum pernah klik atau game belum mulai
  if (!gameState.lastClickTime) return;

  // Combo sudah 0, tidak perlu cek
  if (gameState.combo === 0) return;

  const elapsed = Date.now() - gameState.lastClickTime;

  if (elapsed >= COMBO_RESET_DELAY) {
    resetCombo();
  }
}

// ===== COMBO MULTIPLIER =====
/**
 * Hitung multiplier berdasarkan tier combo
 * Digunakan clickSystem untuk kalkulasi critical hit value
 *
 * combo  0–9  → 1x
 * combo 10–19 → 1.5x
 * combo 20–29 → 2x
 * combo 30+   → 2.5x
 *
 * @returns {number}
 */
export function getComboMultiplier() {
  const tier = Math.floor(gameState.combo / 10);
  return Math.min(1 + tier * 0.5, 2.5);
}

// ===== GET COMBO STATE =====
/**
 * Ambil info combo untuk keperluan UI / sistem lain
 * @returns {{ combo: number, maxCombo: number, multiplier: number }}
 */
export function getComboState() {
  return {
    combo:      gameState.combo,
    maxCombo:   gameState.maxCombo,
    multiplier: getComboMultiplier(),
  };
}