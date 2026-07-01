// data/provinces.js
export const PROVINCES = [
  { code: 'aceh', name: 'Aceh' },
  { code: 'sumatera-utara', name: 'Sumatera Utara' },
  { code: 'sumatera-barat', name: 'Sumatera Barat' },
  { code: 'riau', name: 'Riau' },
  { code: 'kepulauan-riau', name: 'Kepulauan Riau' },
  { code: 'jambi', name: 'Jambi' },
  { code: 'sumatera-selatan', name: 'Sumatera Selatan' },
  { code: 'bangka-belitung', name: 'Bangka Belitung' },
  { code: 'bengkulu', name: 'Bengkulu' },
  { code: 'lampung', name: 'Lampung' },
  { code: 'dki-jakarta', name: 'DKI Jakarta' },
  { code: 'jawa-barat', name: 'Jawa Barat' },
  { code: 'jawa-tengah', name: 'Jawa Tengah' },
  { code: 'di-yogyakarta', name: 'DI Yogyakarta' },
  { code: 'jawa-timur', name: 'Jawa Timur' },
  { code: 'banten', name: 'Banten' },
  { code: 'bali', name: 'Bali' },
  { code: 'nusa-tenggara-barat', name: 'Nusa Tenggara Barat' },
  { code: 'nusa-tenggara-timur', name: 'Nusa Tenggara Timur' },
  { code: 'kalimantan-barat', name: 'Kalimantan Barat' },
  { code: 'kalimantan-tengah', name: 'Kalimantan Tengah' },
  { code: 'kalimantan-selatan', name: 'Kalimantan Selatan' },
  { code: 'kalimantan-timur', name: 'Kalimantan Timur' },
  { code: 'kalimantan-utara', name: 'Kalimantan Utara' },
  { code: 'sulawesi-utara', name: 'Sulawesi Utara' },
  { code: 'sulawesi-tengah', name: 'Sulawesi Tengah' },
  { code: 'sulawesi-selatan', name: 'Sulawesi Selatan' },
  { code: 'sulawesi-tenggara', name: 'Sulawesi Tenggara' },
  { code: 'gorontalo', name: 'Gorontalo' },
  { code: 'sulawesi-barat', name: 'Sulawesi Barat' },
  { code: 'maluku', name: 'Maluku' },
  { code: 'maluku-utara', name: 'Maluku Utara' },
  { code: 'papua', name: 'Papua' },
  { code: 'papua-barat', name: 'Papua Barat' },
  { code: 'papua-selatan', name: 'Papua Selatan' },
  { code: 'papua-tengah', name: 'Papua Tengah' },
  { code: 'papua-pegunungan', name: 'Papua Pegunungan' },
  { code: 'papua-barat-daya', name: 'Papua Barat Daya' },
];

// Keep backward compat — flat array of names
export const provinces = PROVINCES.map(p => p.name);

export function getProvinceCode(name) {
  const found = PROVINCES.find(p => p.name === name);
  return found ? found.code : name.toLowerCase().replace(/\s+/g, '-');
}

export function isValidProvince(name) {
  return PROVINCES.some(p => p.name === name);
}

export function populateProvinceSelect(selectEl) {
  if (!selectEl) return;
  PROVINCES.forEach(prov => {
    const opt = document.createElement('option');
    opt.value = prov.name;
    opt.textContent = prov.name;
    selectEl.appendChild(opt);
  });
}