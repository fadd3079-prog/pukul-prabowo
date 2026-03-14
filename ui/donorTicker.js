// services/donorAPI.js

const BASE_URL = 'https://pukul-prabowo.vercel.app';

let donorCache = null;
let cacheTime  = 0;
const CACHE_TTL = 60000;

export async function fetchDonors() {
  if (donorCache && (Date.now() - cacheTime < CACHE_TTL)) return donorCache;

  try {
    const res = await fetch(`${BASE_URL}/api/donors`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const maxAmount = data.donors.length
      ? Math.max(...data.donors.map(d => d.amount))
      : 0;

    donorCache = data.donors.map(d => ({
      name:      d.name,
      amount:    d.amount,
      highlight: d.amount === maxAmount,
    }));
    cacheTime = Date.now();
    return donorCache;
  } catch (e) {
    console.warn('Gagal fetch donors:', e);
    return []; // kosong kalau gagal
  }
}

export async function submitDonation(donorData) {
  try {
    const res = await fetch(`${BASE_URL}/api/donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donorData),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    invalidateDonorCache();
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export function invalidateDonorCache() {
  donorCache = null;
  cacheTime  = 0;
}