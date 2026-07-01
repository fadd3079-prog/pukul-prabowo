// services/playerAPI.js

import gameState from '../game/gameState.js';
import { getProvinceCode } from '../data/provinces.js';

let isSubmitting = false;

export async function submitScore() {
  if (isSubmitting) return;
  if (!gameState.isPlaying || !gameState.hit || gameState.hit <= 0) return;
  if (!gameState.player.name || !gameState.player.province) return;

  isSubmitting = true;
  try {
    const res = await fetch('/api/players/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: gameState.player.name,
        province: gameState.player.province,
        score: gameState.hit,
        max_combo: gameState.maxCombo || 0,
      }),
    });
    const json = await res.json();
    if (json.ok && json.data) {
      if (json.data.rank) gameState.player.rank = json.data.rank;
      if (json.data.score) gameState.hit = Math.max(gameState.hit, json.data.score);
    }
  } catch (e) {
    console.warn('Gagal submit skor:', e.message);
  } finally {
    isSubmitting = false;
  }
}