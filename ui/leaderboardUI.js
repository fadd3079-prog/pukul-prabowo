// services/leaderboardAPI.js

const BASE_URL = 'https://pukul-prabowo.vercel.app';

const cache = { player: {}, province: {} };
const CACHE_TTL = 30000;

function isCacheValid(entry) {
  return entry && (Date.now() - entry.timestamp < CACHE_TTL);
}

export async function fetchPlayerLeaderboard(page = 1, size = 5) {
  const key = `${page}_${size}`;
  if (isCacheValid(cache.player[key])) return cache.player[key].data;

  try {
    const params = new URLSearchParams({ page, size });
    const res    = await fetch(`${BASE_URL}/api/leaderboard/players?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cache.player[key] = { data: data.players || [], timestamp: Date.now() };
    return cache.player[key].data;
  } catch (e) {
    console.warn('Gagal leaderboard pemain:', e);
    return []; // kosong kalau gagal
  }
}

export async function fetchProvinceLeaderboard(page = 1, size = 5) {
  const key = `${page}_${size}`;
  if (isCacheValid(cache.province[key])) return cache.province[key].data;

  try {
    const params = new URLSearchParams({ page, size });
    const res    = await fetch(`${BASE_URL}/api/leaderboard/provinces?${params}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cache.province[key] = { data: data.provinces || [], timestamp: Date.now() };
    return cache.province[key].data;
  } catch (e) {
    console.warn('Gagal leaderboard provinsi:', e);
    return []; // kosong kalau gagal
  }
}

export function invalidateLeaderboardCache() {
  cache.player   = {};
  cache.province = {};
}