// services/playerAPI.js

import gameState from '../game/gameState.js';

const BASE_URL = 'https://pukul-prabowo.vercel.app';

export async function savePlayerScore(playerData) {
  try {
    const res = await fetch(`${BASE_URL}/api/players/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:     playerData.name,
        province: playerData.province,
        score:    playerData.score,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { success: true, rank: data.rank || 0 };
  } catch (e) {
    console.warn('Gagal menyimpan skor:', e);
    return { success: false, rank: 0 };
  }
}

export async function getPlayerRank(name, province) {
  try {
    const params = new URLSearchParams({ name, province });
    const res    = await fetch(`${BASE_URL}/api/players/rank?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.rank || 0;
  } catch (e) {
    return 0;
  }
}

export async function submitScore() {
  if (!gameState.hit || gameState.hit <= 0) return;
  const result = await savePlayerScore({
    name:     gameState.player.name,
    province: gameState.player.province,
    score:    gameState.hit,
  });
  if (result.success) {
    gameState.player.rank = result.rank;
  }
  return result;
}