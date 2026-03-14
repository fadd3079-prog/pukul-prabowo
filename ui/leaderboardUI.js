async function loadPlayerRanking(page) {
  try {
    const { fetchPlayerLeaderboard } = await import('../services/leaderboardAPI.js');
    const data = await fetchPlayerLeaderboard(page, PAGE_SIZE);
    renderPlayerList(data, page > 1);
  } catch (e) {
    console.warn('Leaderboard pemain gagal:', e);
  }
}

async function loadProvinceRanking(page) {
  try {
    const { fetchProvinceLeaderboard } = await import('../services/leaderboardAPI.js');
    const data = await fetchProvinceLeaderboard(page, PAGE_SIZE);
    renderProvinceList(data, page > 1);
  } catch (e) {
    console.warn('Leaderboard provinsi gagal:', e);
  }
}