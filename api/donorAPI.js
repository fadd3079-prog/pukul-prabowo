// api/donorAPI.js
// Mengelola pengambilan data donor dari server

// ===== CONFIG =====
const BASE_URL = 'https://your-api.com'; // Ganti dengan URL API kamu

// ===== CACHE =====
let donorCache = null;
let cacheTime  = 0;
const CACHE_TTL = 60000; // 60 detik

// ===== FETCH DONORS =====
/**
 * Ambil daftar donor dari server
 * @returns {Promise<Array<{ name: string, amount: number, highlight?: boolean }>>}
 */
export async function fetchDonors() {
  // Gunakan cache jika masih valid
  if (donorCache && (Date.now() - cacheTime < CACHE_TTL)) {
    return donorCache;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/donors`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const donors = normalizeDonors(data.donors || []);

    // Simpan ke cache
    donorCache = donors;
    cacheTime  = Date.now();

    return donors;

  } catch (e) {
    console.warn('Gagal mengambil data donor:', e);
    return getPlaceholderDonors();
  }
}

// ===== SUBMIT DONOR =====
/**
 * Kirim data donasi baru ke server
 * @param {{ name: string, amount: number, message?: string }} donorData
 * @returns {Promise<{ success: boolean }>}
 */
export async function submitDonation(donorData) {
  try {
    const res = await fetch(`${BASE_URL}/api/donors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name:    donorData.name,
        amount:  donorData.amount,
        message: donorData.message || '',
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Invalidate cache agar data fresh
    invalidateDonorCache();

    return { success: true };

  } catch (e) {
    console.warn('Gagal mengirim donasi:', e);
    return { success: false };
  }
}

// ===== NORMALIZE =====
/**
 * Normalisasi data donor dari server
 * Tandai donor dengan amount tertinggi sebagai highlight
 * @param {Array} raw
 * @returns {Array<{ name: string, amount: number, highlight: boolean }>}
 */
function normalizeDonors(raw) {
  if (!raw.length) return [];

  // Cari amount tertinggi
  const maxAmount = Math.max(...raw.map(d => d.amount || 0));

  return raw.map(d => ({
    name:      d.name      || 'Anonim',
    amount:    d.amount    || 0,
    highlight: d.amount === maxAmount,
  }));
}

// ===== INVALIDATE CACHE =====
/**
 * Hapus cache donor agar data fresh
 */
export function invalidateDonorCache() {
  donorCache = null;
  cacheTime  = 0;
}

// ===== PLACEHOLDER =====
/**
 * Data dummy donor saat API belum tersedia
 * @returns {Array}
 */
function getPlaceholderDonors() {
  return [
    { name: 'Sandy',       amount: 10000, highlight: false },
    { name: 'Sandikagali', amount: 10000, highlight: false },
    { name: 'Sandy',       amount: 10000, highlight: false },
    { name: 'Sandikagali', amount: 50000, highlight: true  },
    { name: 'Sandy',       amount: 10000, highlight: false },
    { name: 'Sandikagali', amount: 10000, highlight: false },
    { name: 'Sandy',       amount: 10000, highlight: false },
    { name: 'Sandikagali', amount: 10000, highlight: false },
    { name: 'Sandy',       amount: 10000, highlight: false },
    { name: 'Sandikagali', amount: 10000, highlight: false },
    { name: 'Sandy',       amount: 10000, highlight: false },
    { name: 'Sandikagali', amount: 10000, highlight: false },
  ];
}