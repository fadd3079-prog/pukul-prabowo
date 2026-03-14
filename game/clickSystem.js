// game/clickSystem.js
// Menangani tap/klik pada objek utama
// Menghitung hit, combo, critical, lalu memanggil callback

import gameState from './gameState.js';
import { incrementCombo, resetCombo, getComboMultiplier } from './comboSystem.js';

// ===== CRITICAL CHANCE =====
/**
 * Hitung critical chance berdasarkan combo saat ini
 * Base: 5%, naik 5% tiap 10 combo (max 50%)
 * @returns {number} chance 0.0 - 0.5
 */
function calcCriticalChance() {
  const tier = Math.floor(gameState.combo / 10);
  return Math.min(0.05 + tier * 0.05, 0.5);
}

/**
 * Tentukan apakah hit ini critical
 * @returns {boolean}
 */
function rollCritical() {
  return Math.random() < calcCriticalChance();
}

// ===== HIT VALUE =====
/**
 * Hitung nilai hit
 * Normal : 1
 * Critical: 1 * comboMultiplier * 3
 * @param {boolean} isCritical
 * @returns {number}
 */
function calcHitValue(isCritical) {
  const base = 1;
  if (!isCritical) return base;
  return base * getComboMultiplier() * 3;
}

// ===== INIT =====
/**
 * Pasang event listener tap/klik pada hitObject
 * @param {HTMLElement} hitObject - elemen yang diklik player
 * @param {{ onHit: Function, onComboEvent: Function }} callbacks
 */
export function initClickSystem(hitObject, { onHit, onComboEvent } = {}) {
  if (!hitObject) return;

  // Gunakan pointerdown agar lebih responsif dari click
  hitObject.addEventListener('pointerdown', (e) => {
    e.preventDefault(); // cegah scroll / zoom
    handleHit({ onHit, onComboEvent });
  });
}

// ===== HANDLE HIT =====
/**
 * Logika utama saat objek dipukul
 */
function handleHit({ onHit, onComboEvent }) {
  // --- Waktu ---
  const now = Date.now();
  gameState.lastClickTime = now;

  // --- Critical ---
  const isCritical = rollCritical();
  gameState.isCritical = isCritical;

  // --- Hit Value ---
  const hitValue = calcHitValue(isCritical);

  // --- Update Hit ---
  gameState.hit += hitValue;
  gameState.lastHitValue = hitValue;

  // --- Update Combo ---
  const prevCombo = gameState.combo;
  const { combo, isComboEvent } = incrementCombo();

  // --- Max Combo ---
  if (combo > gameState.maxCombo) {
    gameState.maxCombo = combo;
  }

  // --- Critical Chance (simpan ke state) ---
  gameState.criticalChance = calcCriticalChance();

  // --- Callback onHit ---
  if (onHit) {
    onHit({
      hit:        gameState.hit,
      combo,
      isCritical,
      hitValue,
    });
  }

  // --- Callback onComboEvent (tiap kelipatan 10) ---
  if (isComboEvent && onComboEvent) {
    onComboEvent(combo);
  }
}