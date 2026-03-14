// script.js

import gameState from './game/gameState.js';
import { initEngine, startEngine } from './game/engine.js';
import { initClickSystem } from './game/clickSystem.js';
import { checkComboTimeout } from './game/comboSystem.js';
import { initPopupSystem, spawnHitPopup, spawnCriticalPopup, spawnComboPopup } from './game/popupSystem.js';
import { initAnimationSystem, playHitAnimation, playComboAnimation } from './game/animationSystem.js';
import { initSoundSystem, playHit, playCombo } from './game/soundSystem.js';
import { initLoginUI } from './ui/loginUI.js';
import { initProfileUI, updateProfileDisplay } from './ui/profileUI.js';
import { initLeaderboardUI } from './ui/leaderboardUI.js';
import { initDonorTicker } from './ui/donorTicker.js';
import { populateProvinceSelect } from './data/provinces.js';
import { submitScore } from './services/playerAPI.js';

// ===== REFS =====
const screenGame     = document.getElementById('screen-game');
const selectProvince = document.getElementById('input-province');
const hitObject      = document.getElementById('hit-object');
const popupContainer = document.getElementById('popup-container');
const displayScore   = document.getElementById('display-score');
const btnProfile     = document.getElementById('btn-profile');

// ===== SCREEN =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add('active');
  target.style.display = 'flex';
}

// ===== SCREEN SHAKE =====
function triggerScreenShake() {
  screenGame.classList.remove('shake');
  void screenGame.offsetWidth;
  screenGame.classList.add('shake');
  screenGame.addEventListener('animationend', () => {
    screenGame.classList.remove('shake');
  }, { once: true });
}

// ===== LOGIN =====
populateProvinceSelect(selectProvince);

initLoginUI({
  onPlay(name, province) {
    gameState.player.name     = name;
    gameState.player.province = province;
    gameState.isPlaying       = true;
    gameState.startTime       = Date.now();
    gameState.hit             = 0;
    gameState.combo           = 0;
    gameState.maxCombo        = 0;
    gameState.lastClickTime   = 0;

    displayScore.textContent  = '0';

    // Scroll ke atas saat mulai game
    const gameBody = document.getElementById('game-body');
    if (gameBody) gameBody.scrollTop = 0;

    showScreen('screen-game');
    startEngine();
  }
});

// ===== PROFILE =====
initProfileUI({ onClose() { showScreen('screen-game'); } });

btnProfile.addEventListener('click', () => {
  updateProfileDisplay();
  showScreen('screen-profile');
});

document.getElementById('btn-close-profile').addEventListener('click', () => {
  showScreen('screen-game');
});

// ===== SYSTEMS =====
initAnimationSystem(hitObject);
initPopupSystem(popupContainer, hitObject);
initSoundSystem();

// ===== CLICK =====
initClickSystem(hitObject, {
  onHit({ hit, combo, isCritical, hitValue }) {
    displayScore.textContent = hit;
    playHitAnimation(isCritical);
    spawnHitPopup(hitValue);
    if (isCritical) spawnCriticalPopup();
    playHit(isCritical);
  },
  onComboEvent(combo) {
    spawnComboPopup(combo);
    playComboAnimation();
    playCombo();
    triggerScreenShake();
  }
});

// ===== ENGINE =====
initEngine({
  onTick() {
    checkComboTimeout();
  }
});

// ===== LEADERBOARD & DONOR =====
initLeaderboardUI();
initDonorTicker();

// ===== SUBMIT SKOR =====
window.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'hidden' && gameState.isPlaying) {
    await submitScore();
  }
});

// ===== RESIZE =====
window.addEventListener('resize', () => {
  const container = document.getElementById('popup-container');
  if (container) container.innerHTML = '';
});

