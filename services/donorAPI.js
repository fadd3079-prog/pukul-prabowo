// services/donorAPI.js

let donorCache = null;
let cacheTime = 0;
const CACHE_TTL = 60000;

export async function fetchDonors() {
  if (donorCache && (Date.now() - cacheTime < CACHE_TTL)) return donorCache;
  try {
    const res = await fetch('/api/donors');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error?.message || 'API error');
    const donors = json.data?.donors || [];
    const maxAmount = donors.length ? Math.max(...donors.map(d => d.amount)) : 0;
    donorCache = donors.map(d => ({
      name: d.name,
      amount: d.amount,
      message: d.message || '',
      highlight: d.amount === maxAmount,
    }));
    cacheTime = Date.now();
    return donorCache;
  } catch (e) {
    console.warn('Donor API failed:', e.message);
    return [];
  }
}

export function invalidateDonorCache() {
  donorCache = null;
  cacheTime = 0;
}