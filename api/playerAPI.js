// api/playerAPI.js
// Mengelola komunikasi API untuk data pemain (simpan skor, ambil rank)

import gameState from '../game/gameState.js';

// ===== CONFIG =====
const BASE_URL = 'https://pukul-prabowo.vercel.app'; // Ganti dengan URL API kamu

// ===== SAVE SCORE =====
/**
 * Kirim skor pemain ke server setelah sesi selesai
 * @param {{ name: string, province: string, score: number }} playerData
 * @returns {Promise<{ success: boolean, rank: number }>}
 */
export async function savePlayerScore(playerData) {
  try {
    const res = await fetch(`${BASE_URL}/api/players/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name:     playerData.name,
        province: playerData.province,
        score:    playerData.score,
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return {
      success: true,
      rank:    data.rank || 0,
    };

  } catch (e) {
    console.warn('Gagal menyimpan skor:', e);
    return { success: false, rank: 0 };
  }
}

// ===== GET PLAYER RANK =====
/**
 * Ambil rank terkini pemain berdasarkan nama dan provinsi
 * @param {string} name
 * @param {string} province
 * @returns {Promise<number>} rank pemain
 */
export async function getPlayerRank(name, province) {
  try {
    const params = new URLSearchParams({ name, province });
    const res    = await fetch(`${BASE_URL}/api/players/rank?${params}`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return data.rank || 0;

  } catch (e) {
    console.warn('Gagal mengambil rank:', e);
    return 0;
  }
}

// ===== SUBMIT & UPDATE STATE =====
/**
 * Simpan skor dan update gameState.player.rank
 * Dipanggil di akhir sesi game
 */
export async function submitScore() {
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