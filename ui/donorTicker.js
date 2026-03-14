// ui/donorTicker.js

const tickerEl = document.getElementById('donor-ticker');

let tickerData = [];
let isLoaded   = false;

export function initDonorTicker() {
  loadDonorData();
}

function renderDonorButton() {
  const donorSection = document.getElementById('donor-section');
  if (!donorSection || document.getElementById('btn-donate')) return;

  const btn = document.createElement('a');
  btn.id          = 'btn-donate';
  btn.href        = 'https://tako.id/fadhol_pemula';
  btn.target      = '_blank';
  btn.rel         = 'noopener noreferrer';
  btn.textContent = 'DUKUNG DEVELOPER';

  const wrapper = document.getElementById('donor-ticker-wrapper');
  donorSection.insertBefore(btn, wrapper);
}

async function loadDonorData() {
  try {
    const { fetchDonors } = await import('../services/donorAPI.js');
    tickerData = await fetchDonors();
    renderTicker(tickerData);
    isLoaded = true;
  } catch (e) {
    console.error('Donor API failed:', e);
    const { showError } = await import('./errorToast.js');
    showError('Gagal memuat daftar donor. Menggunakan data sementara.');
    renderTicker(getPlaceholderDonors());
  }
}

/**
 * Render donor chips dalam beberapa baris
 * Tiap baris scroll marquee berlawanan arah
 */
function renderTicker(data) {
  if (!tickerEl) return;

  tickerEl.innerHTML = '';

  // Bagi data jadi 3 baris
  const rowSize  = Math.ceil(data.length / 3);
  const rows     = [
    data.slice(0, rowSize),
    data.slice(rowSize, rowSize * 2),
    data.slice(rowSize * 2),
  ];

  rows.forEach((rowData, rowIndex) => {
    if (!rowData.length) return;

    const row = document.createElement('div');
    row.className = 'ticker-row';

    // Arah bergantian: baris 0 & 2 ke kiri, baris 1 ke kanan
    row.classList.add(rowIndex % 2 === 0 ? 'ticker-left' : 'ticker-right');

    // Duplikat chip agar marquee seamless
    const chips = [...rowData, ...rowData, ...rowData, ...rowData, ...rowData, ...rowData, ...rowData, ...rowData, ...rowData, ...rowData];
    chips.forEach(donor => {
      const chip = document.createElement('div');
      chip.className = donor.highlight ? 'donor-chip highlight' : 'donor-chip';
      chip.innerHTML = `${escapeHtml(donor.name)} <strong>${donor.amount.toLocaleString('id-ID')}</strong>`;
      row.appendChild(chip);
    });

    tickerEl.appendChild(row);
  });
}

export function refreshDonorTicker() {
  if (!isLoaded) return;
  loadDonorData();
}

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

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}