// services/playerAPI.js

import gameState from '../game/gameState.js';

const BASE_URL = 'https://pukul-prabowo.vercel.app';

export async function submitScore() {
  if (!gameState.hit || gameState.hit <= 0) return;
  try {
    const res = await fetch(`${BASE_URL}/api/players/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:     gameState.player.name,
        province: gameState.player.province,
        score:    gameState.hit,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.rank) gameState.player.rank = data.rank;
  } catch (e) {
    console.warn('Gagal submit skor:', e);
  }
}