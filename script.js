// script.js
// Entry point utama — menghubungkan semua modul

import gameState from './game/gameState.js';
import { initEngine, startEngine, stopEngine } from './game/engine.js';
import { initClickSystem } from './game/clickSystem.js';
import { checkComboTimeout } from './game/comboSystem.js';
import { initPopupSystem, spawnHitPopup, spawnCriticalPopup, spawnComboPopup } from './game/popupSystem.js';
import { initAnimationSystem, playHitAnimation, playComboAnimation } from './game/animationSystem.js';
import { initSoundSystem, playHit, playCombo } from './game/soundSystem.js';
import { initLoginUI } from './ui/loginUI.js';
import { initProfileUI, updateProfileDisplay } from './ui/profileUI.js';
import { initLeaderboardUI, refreshLeaderboard } from './ui/leaderboardUI.js';
import { initDonorTicker } from './ui/donorTicker.js';
import { populateProvinceSelect } from './data/provinces.js';
import { submitScore } from './api/playerAPI.js';

// ===== ELEMENT REFS =====
const screenGame      = document.getElementById('screen-game');
const selectProvince  = document.getElementById('input-province');
const hitObject       = document.getElementById('hit-object');
const popupContainer  = document.getElementById('popup-container');
const displayScore    = document.getElementById('display-score');
const btnProfile      = document.getElementById('btn-profile');

// ===== SCREEN MANAGER =====
/**
 * Tampilkan screen berdasarkan id
 * Sembunyikan semua screen lain
 * @param {string} id
 */
// Ganti fungsi showScreen di script.js
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });

  const target = document.getElementById(id);
  if (!target) return;

  target.classList.add('active');

  // Profile pakai flex center
  if (id === 'screen-profile') {
    target.style.display = 'flex';
  } else {
    target.style.display = 'flex';
  }
}

// ===== SCREEN SHAKE =====
/**
 * Jalankan efek screen shake pada arena game
 */
function triggerScreenShake() {
  screenGame.classList.remove('shake');
  void screenGame.offsetWidth; // reflow
  screenGame.classList.add('shake');
  screenGame.addEventListener('animationend', () => {
    screenGame.classList.remove('shake');
  }, { once: true });
}

// ===== INIT PROVINCE DROPDOWN =====
populateProvinceSelect(selectProvince);

// ===== INIT LOGIN =====
initLoginUI({
  onPlay(name, province) {
    // Simpan data ke gameState
    gameState.player.name     = name;
    gameState.player.province = province;
    gameState.isPlaying       = true;
    gameState.startTime       = Date.now();
    gameState.hit             = 0;
    gameState.combo           = 0;
    gameState.maxCombo        = 0;
    gameState.lastClickTime   = 0;

    // Reset tampilan skor
    displayScore.textContent = '0';

    // Pindah ke game screen
    showScreen('screen-game');

    // Mulai engine loop
    startEngine();

    // Refresh leaderboard saat masuk game
    refreshLeaderboard();
  }
});

// ===== INIT PROFILE =====
initProfileUI({
  onClose() {
    showScreen('screen-game');
  }
});

// ===== PROFILE BUTTON =====
btnProfile.addEventListener('click', () => {
  updateProfileDisplay();
  showScreen('screen-profile');
});
document.getElementById('btn-close-profile').addEventListener('click', () => {
  showScreen('screen-game');
});
// ===== INIT GAME SYSTEMS =====
initAnimationSystem(hitObject);
initPopupSystem(popupContainer, hitObject);
initSoundSystem();

// ===== INIT CLICK SYSTEM =====
initClickSystem(hitObject, {

  // Dipanggil setiap tap
  onHit({ hit, combo, isCritical, hitValue }) {
    // Update skor di header
    displayScore.textContent = hit;

    // Animasi objek
    playHitAnimation(isCritical);

    // Popup hit
    spawnHitPopup(hitValue);

    // Popup & suara critical
    if (isCritical) {
      spawnCriticalPopup();
    }

    // Suara hit
    playHit(isCritical);
  },

  // Dipanggil setiap kelipatan 10 combo
  onComboEvent(combo) {
    spawnComboPopup(combo);
    playComboAnimation();
    playCombo();
    triggerScreenShake();
  }

});

// ===== INIT ENGINE =====
initEngine({
  onTick() {
    // Cek combo timeout setiap frame
    checkComboTimeout();
  }
});

// ===== INIT LEADERBOARD & DONOR =====
initLeaderboardUI();
initDonorTicker();

// ===== SUBMIT SKOR SAAT LEAVE =====
// Kirim skor ke server jika player menutup tab / browser
window.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'hidden' && gameState.isPlaying) {
    await submitScore();
  }
});

// ===== HANDLE RESIZE =====
// Pastikan popup tetap di posisi benar saat orientasi berubah
window.addEventListener('resize', () => {
  const container = document.getElementById('popup-container');
  if (container) container.innerHTML = '';
});