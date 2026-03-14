// services/leaderboardAPI.js

const BASE_URL = 'https://pukul-prabowo.vercel.app';

export async function fetchPlayerLeaderboard(page = 1, size = 5) {
  try {
    const res  = await fetch(`${BASE_URL}/api/leaderboards/players?page=${page}&size=${size}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.players || [];
  } catch (e) {
    return [];
  }
}

export async function fetchProvinceLeaderboard(page = 1, size = 5) {
  try {
    const res  = await fetch(`${BASE_URL}/api/leaderboards/provinces?page=${page}&size=${size}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.provinces || [];
  } catch (e) {
    return [];
  }
}