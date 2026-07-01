// script.js

import gameState from './game/gameState.js';
import { initEngine, startEngine } from './game/engine.js';
import { initClickSystem } from './game/clickSystem.js';
import { checkComboTimeout } from './game/comboSystem.js';

import {
  initPopupSystem,
  spawnHitPopup,
  spawnCriticalPopup,
  spawnComboPopup
} from './game/popupSystem.js';

import {
  initAnimationSystem,
  playHitAnimation,
  playComboAnimation
} from './game/animationSystem.js';

import {
  initSoundSystem,
  playHit,
  playCombo
} from './game/soundSystem.js';

import { initLoginUI } from './ui/loginUI.js';
import { initProfileUI, updateProfileDisplay } from './ui/profileUI.js';
import { initLeaderboardUI, refreshLeaderboard } from './ui/leaderboardUI.js';
import { initDonorTicker } from './ui/donorTicker.js';

import { submitScore } from './services/playerAPI.js';


// ===== REFS =====
const screenGame     = document.getElementById('screen-game');
const hitObject      = document.getElementById('hit-object');
const popupContainer = document.getElementById('popup-container');
const displayScore   = document.getElementById('display-score');
const displayCombo   = document.getElementById('display-combo');
const btnProfile     = document.getElementById('btn-profile');


// ===== SCREEN SYSTEM =====
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

  if (!screenGame) return;

  screenGame.classList.remove('shake');

  void screenGame.offsetWidth;

  screenGame.classList.add('shake');

  screenGame.addEventListener('animationend', () => {
    screenGame.classList.remove('shake');
  }, { once: true });

}


// ===== PLAYER STORAGE =====
function savePlayer(name, province){

  const player = {
    name,
    province
  };

  localStorage.setItem("player", JSON.stringify(player));

}

function loadPlayer(){

  const saved = localStorage.getItem("player");

  if(!saved) return null;

  try{
    return JSON.parse(saved);
  }catch{
    return null;
  }

}


// ===== SCORE STORAGE =====
function saveScore(score){

  localStorage.setItem("playerScore", score);

}

function loadScore(){

  const saved = localStorage.getItem("playerScore");

  if(!saved) return 0;

  return parseInt(saved) || 0;

}


// ===== LOGIN SYSTEM =====
// populateProvinceSelect sudah dipanggil di dalam initLoginUI

initLoginUI({

  onPlay(name, province){

    gameState.player.name     = name;
    gameState.player.province = province;

    savePlayer(name, province);

    startGame();

  }

});


// ===== START GAME =====
function startGame(){

  gameState.isPlaying = true;

  gameState.startTime = Date.now();

  gameState.hit = loadScore();   // LOAD SCORE DARI STORAGE

  gameState.combo = 0;

  gameState.maxCombo = 0;

  gameState.lastClickTime = 0;

  if (displayScore) displayScore.textContent = gameState.hit;
  if (displayCombo) displayCombo.textContent = '';

  const gameBody = document.getElementById('game-body');

  if (gameBody) gameBody.scrollTop = 0;

  showScreen('screen-game');

  startEngine();

}


// ===== AUTO LOGIN =====
const savedPlayer = loadPlayer();

if(savedPlayer){

  gameState.player.name     = savedPlayer.name;
  gameState.player.province = savedPlayer.province;

  startGame();

}


// ===== PROFILE =====
initProfileUI({
  onClose(){
    showScreen('screen-game');
  }
});

if (btnProfile) {
  btnProfile.addEventListener('click', () => {

    updateProfileDisplay();

    showScreen('screen-profile');

  });
}

const btnCloseProfile = document.getElementById('btn-close-profile');
if (btnCloseProfile) {
  btnCloseProfile.addEventListener('click', () => {

    showScreen('screen-game');

  });
}


// ===== SYSTEM INIT =====
initAnimationSystem(hitObject);

initPopupSystem(popupContainer, hitObject);

initSoundSystem();


// ===== CLICK SYSTEM =====
initClickSystem(hitObject, {

  onHit({ hit, combo, isCritical, hitValue }){

    if (displayScore) displayScore.textContent = hit;

    // Update combo display
    if (displayCombo) {
      displayCombo.textContent = combo > 1 ? `${combo}x COMBO` : '';
    }

    saveScore(hit); // SIMPAN SCORE SETIAP HIT

    playHitAnimation(isCritical);

    spawnHitPopup(hitValue);

    if (isCritical) spawnCriticalPopup();

    playHit(isCritical);

  },

  onComboEvent(combo){

    spawnComboPopup(combo);

    playComboAnimation();

    playCombo();

    triggerScreenShake();

  }

});


// ===== GAME ENGINE =====
initEngine({

  onTick(){

    checkComboTimeout();

  }

});


// ===== LEADERBOARD & DONOR =====
initLeaderboardUI();

initDonorTicker();


// ===== AUTO SUBMIT SCORE KE SERVER =====
let autoSubmitRunning = false;

setInterval(async () => {

  if(gameState.isPlaying && !autoSubmitRunning){
    autoSubmitRunning = true;
    try {
      await submitScore();
      refreshLeaderboard();
    } catch(e) {}
    autoSubmitRunning = false;
  }

}, 10000);


// ===== SUBMIT SAAT TAB DITUTUP =====
window.addEventListener('visibilitychange', async () => {

  if (document.visibilityState === 'hidden' && gameState.isPlaying){

    await submitScore();

  }

});


// ===== RESIZE CLEANUP =====
window.addEventListener('resize', () => {

  const container = document.getElementById('popup-container');

  if(container){

    container.innerHTML = '';

  }

});