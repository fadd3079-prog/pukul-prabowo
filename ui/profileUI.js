// ui/profileUI.js

import gameState from '../game/gameState.js';

const profileName     = document.getElementById('profile-name');
const profileProvince = document.getElementById('profile-province');
const profileScore    = document.getElementById('profile-score');
const profileRank     = document.getElementById('profile-rank');

// initProfileUI tetap ada tapi kosongkan listener tutup
export function initProfileUI({ onClose } = {}) {
  // listener tutup dihandle di script.js
}

export function updateProfileDisplay() {
  if (profileName)     profileName.textContent     = gameState.player.name     || '-';
  if (profileProvince) profileProvince.textContent = gameState.player.province || '-';
  if (profileScore)    profileScore.textContent    = gameState.hit
    ? gameState.hit.toLocaleString('id-ID') : '0';
  if (profileRank)     profileRank.textContent     = gameState.player.rank
    ? `#${gameState.player.rank}` : '-';
}

export function showProfileScreen() {
  updateProfileDisplay();
  document.getElementById('screen-profile').classList.add('active');
}

export function hideProfileScreen() {
  document.getElementById('screen-profile').classList.remove('active');
}