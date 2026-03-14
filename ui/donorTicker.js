// ui/donorTicker.js

let tickerData = [];
let isLoaded   = false;

export function initDonorTicker() {
  loadDonorData();
}

async function loadDonorData() {
  try {
    const { fetchDonors } = await import('../services/donorAPI.js');
    tickerData = await fetchDonors();
    renderTicker(tickerData);
    isLoaded = true;
  } catch (e) {
    console.warn('Donor API failed:', e);
    renderTicker([]);
  }
}

function renderTicker(data) {
  const tickerEl = document.getElementById('donor-ticker');
  if (!tickerEl) return;

  tickerEl.innerHTML = '';
  if (!data.length) return;

  const rowSize = Math.ceil(data.length / 3);
  const rows = [
    data.slice(0, rowSize),
    data.slice(rowSize, rowSize * 2),
    data.slice(rowSize * 2),
  ];

  rows.forEach((rowData, rowIndex) => {
    if (!rowData.length) return;
    const row = document.createElement('div');
    row.className = 'ticker-row';
    row.classList.add(rowIndex % 2 === 0 ? 'ticker-left' : 'ticker-right');
    const chips = [...rowData, ...rowData, ...rowData, ...rowData];
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

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}