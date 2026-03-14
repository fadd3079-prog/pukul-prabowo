// api/leaderboardAPI.js
// Mengelola pengambilan data leaderboard pemain dan provinsi dari server

// ===== CONFIG =====
const BASE_URL = 'https://pukul-prabowo.vercel.app'; // Ganti dengan URL API kamu

// ===== CACHE =====
// Cache ringan untuk kurangi request berulang
const cache = {
  player:   {},  // key: "page_size"
  province: {},  // key: "page_size"
};

const CACHE_TTL = 30000; // 30 detik

/**
 * Cek apakah cache masih valid
 * @param {object} entry
 * @returns {boolean}
 */
function isCacheValid(entry) {
  return entry && (Date.now() - entry.timestamp < CACHE_TTL);
}

// ===== FETCH PLAYER LEADERBOARD =====
/**
 * Ambil ranking pemain dari server
 * @param {number} page
 * @param {number} size - jumlah item per halaman
 * @returns {Promise<Array<{ rank: number, name: string, score: number }>>}
 */
export async function fetchPlayerLeaderboard(page = 1, size = 5) {
  const key = `${page}_${size}`;

  // Gunakan cache jika masih valid
  if (isCacheValid(cache.player[key])) {
    return cache.player[key].data;
  }

  try {
    const params = new URLSearchParams({ page, size });
    const res    = await fetch(`${BASE_URL}/api/leaderboard/players?${params}`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // Simpan ke cache
    cache.player[key] = {
      data:      data.players || [],
      timestamp: Date.now(),
    };

    return cache.player[key].data;

  } catch (e) {
    console.warn('Gagal mengambil leaderboard pemain:', e);
    return getPlaceholderPlayers(page, size);
  }
}

// ===== FETCH PROVINCE LEADERBOARD =====
/**
 * Ambil ranking provinsi dari server
 * @param {number} page
 * @param {number} size
 * @returns {Promise<Array<{ rank: number, province: string, score: number }>>}
 */
export async function fetchProvinceLeaderboard(page = 1, size = 5) {
  const key = `${page}_${size}`;

  // Gunakan cache jika masih valid
  if (isCacheValid(cache.province[key])) {
    return cache.province[key].data;
  }

  try {
    const params = new URLSearchParams({ page, size });
    const res    = await fetch(`${BASE_URL}/api/leaderboard/provinces?${params}`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // Simpan ke cache
    cache.province[key] = {
      data:      data.provinces || [],
      timestamp: Date.now(),
    };

    return cache.province[key].data;

  } catch (e) {
    console.warn('Gagal mengambil leaderboard provinsi:', e);
    return getPlaceholderProvinces(page, size);
  }
}

// ===== INVALIDATE CACHE =====
/**
 * Hapus cache agar data fresh setelah submit skor
 */
export function invalidateLeaderboardCache() {
  cache.player   = {};
  cache.province = {};
}

// ===== PLACEHOLDER DATA =====
/**
 * Data dummy pemain saat API belum tersedia
 */
function getPlaceholderPlayers(page, size) {
  const players = [
    { rank: 1,  name: 'Budi',    score: 98000 },
    { rank: 2,  name: 'Siti',    score: 87500 },
    { rank: 3,  name: 'Agus',    score: 76200 },
    { rank: 4,  name: 'Dewi',    score: 65100 },
    { rank: 5,  name: 'Hendra',  score: 54300 },
    { rank: 6,  name: 'Ratna',   score: 43200 },
    { rank: 7,  name: 'Fajar',   score: 32100 },
    { rank: 8,  name: 'Lestari', score: 21000 },
    { rank: 9,  name: 'Wahyu',   score: 10900 },
    { rank: 10, name: 'Rina',    score: 9800  },
  ];

  const start = (page - 1) * size;
  return players.slice(start, start + size);
}

/**
 * Data dummy provinsi saat API belum tersedia
 */
function getPlaceholderProvinces(page, size) {
  const provinces = [
    { rank: 1, province: 'Jawa Barat',   score: 500000 },
    { rank: 2, province: 'Jawa Timur',   score: 480000 },
    { rank: 3, province: 'Jawa Tengah',  score: 460000 },
    { rank: 4, province: 'DKI Jakarta',  score: 440000 },
    { rank: 5, province: 'Banten',       score: 420000 },
    { rank: 6, province: 'Sumatera Utara', score: 400000 },
    { rank: 7, province: 'Sulawesi Selatan', score: 380000 },
    { rank: 8, province: 'Bali',         score: 360000 },
    { rank: 9, province: 'Kalimantan Timur', score: 340000 },
    { rank: 10, province: 'Riau',        score: 320000 },
  ];

  const start = (page - 1) * size;
  return provinces.slice(start, start + size);
}