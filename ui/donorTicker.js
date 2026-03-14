// ui/donorTicker.js
// Mengelola tampilan ticker nama donor yang bergerak

// ===== ELEMENT REFS =====
const tickerEl = document.getElementById('donor-ticker');

// ===== STATE =====
let tickerData   = [];   // Data donor dari API
let isLoaded     = false;

// ===== INIT =====
/**
 * Inisialisasi donor ticker
 * Dipanggil dari script.js
 */
export function initDonorTicker() {
  loadDonorData();
}

// ===== LOAD DATA =====
/**
 * Ambil data donor dari API lalu render
 */
async function loadDonorData() {
  try {
    const { fetchDonors } = await import('../api/donorAPI.js');
    tickerData = await fetchDonors();
    renderTicker(tickerData);
    isLoaded = true;
  } catch (e) {
    console.warn('Data donor gagal dimuat:', e);
    // Tampilkan placeholder jika API gagal
    renderTicker(getPlaceholderDonors());
  }
}

// ===== RENDER =====
/**
 * Render chip donor ke dalam ticker container
 * @param {Array<{ name: string, amount: number, highlight?: boolean }>} data
 */
function renderTicker(data) {
  if (!tickerEl) return;

  tickerEl.innerHTML = '';

  data.forEach(donor => {
    const chip = document.createElement('div');
    chip.className = donor.highlight
      ? 'donor-chip highlight'
      : 'donor-chip';

    chip.textContent = `${escapeHtml(donor.name)}  ${donor.amount.toLocaleString('id-ID')}`;
    tickerEl.appendChild(chip);
  });
}

// ===== REFRESH =====
/**
 * Refresh data donor (dipanggil berkala jika diperlukan)
 */
export function refreshDonorTicker() {
  if (!isLoaded) return;
  loadDonorData();
}

// ===== PLACEHOLDER =====
/**
 * Data dummy saat API belum tersedia
 * @returns {Array}
 */
function getPlaceholderDonors() {
  return [
    { name: 'Sandy',      amount: 10000 },
    { name: 'Sandikagali', amount: 10000 },
    { name: 'Sandy',      amount: 10000 },
    { name: 'Sandikagali', amount: 10000, highlight: true },
    { name: 'Sandy',      amount: 10000 },
    { name: 'Sandikagali', amount: 10000 },
    { name: 'Sandy',      amount: 10000 },
    { name: 'Sandikagali', amount: 10000 },
    { name: 'Sandy',      amount: 10000 },
    { name: 'Sandikagali', amount: 10000, highlight: true },
    { name: 'Sandy',      amount: 10000 },
    { name: 'Sandikagali', amount: 10000 },
  ];
}

// ===== UTILS =====
/**
 * Escape HTML untuk cegah XSS
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}