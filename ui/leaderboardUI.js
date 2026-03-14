// ui/leaderboardUI.js
// Mengelola tampilan leaderboard pemain dan provinsi

// ===== ELEMENT REFS =====
const lbPlayerList   = document.getElementById('lb-player-list');
const lbProvinceList = document.getElementById('lb-province-list');
const btnMorePlayer  = document.getElementById('btn-more-player');
const btnMoreProvince = document.getElementById('btn-more-province');

// ===== STATE =====
let playerPage   = 1;  // Halaman data pemain saat ini
let provincePage = 1;  // Halaman data provinsi saat ini
const PAGE_SIZE  = 5;  // Jumlah item per halaman

// ===== INIT =====
/**
 * Inisialisasi leaderboard UI
 * Dipanggil dari script.js
 */
export function initLeaderboardUI() {

  // Load data awal
  loadPlayerRanking(1);
  loadProvinceRanking(1);

  // Tombol show more pemain
  btnMorePlayer.addEventListener('click', () => {
    playerPage++;
    loadPlayerRanking(playerPage);
  });

  // Tombol show more provinsi
  btnMoreProvince.addEventListener('click', () => {
    provincePage++;
    loadProvinceRanking(provincePage);
  });
}

// ===== LOAD PLAYER RANKING =====
/**
 * Muat data ranking pemain dari API
 * @param {number} page
 */
async function loadPlayerRanking(page) {
  try {
    const { fetchPlayerLeaderboard } = await import('../api/leaderboardAPI.js');
    const data = await fetchPlayerLeaderboard(page, PAGE_SIZE);
    renderPlayerList(data, page > 1);
  } catch (e) {
    console.warn('Leaderboard pemain gagal dimuat:', e);
  }
}

// ===== LOAD PROVINCE RANKING =====
/**
 * Muat data ranking provinsi dari API
 * @param {number} page
 */
async function loadProvinceRanking(page) {
  try {
    const { fetchProvinceLeaderboard } = await import('../api/leaderboardAPI.js');
    const data = await fetchProvinceLeaderboard(page, PAGE_SIZE);
    renderProvinceList(data, page > 1);
  } catch (e) {
    console.warn('Leaderboard provinsi gagal dimuat:', e);
  }
}

// ===== RENDER PLAYER LIST =====
/**
 * Render item pemain ke dalam list
 * @param {Array<{ rank: number, name: string, score: number }>} data
 * @param {boolean} append - true jika menambah ke list yang ada
 */
function renderPlayerList(data, append = false) {
  if (!lbPlayerList) return;

  if (!append) lbPlayerList.innerHTML = '';

  data.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="lb-rank">#${item.rank}</span>
      <span class="lb-name">${escapeHtml(item.name)}</span>
      <span class="lb-score">${item.score.toLocaleString('id-ID')}</span>
    `;
    lbPlayerList.appendChild(li);
  });
}

// ===== RENDER PROVINCE LIST =====
/**
 * Render item provinsi ke dalam list
 * @param {Array<{ rank: number, province: string, score: number }>} data
 * @param {boolean} append
 */
function renderProvinceList(data, append = false) {
  if (!lbProvinceList) return;

  if (!append) lbProvinceList.innerHTML = '';

  data.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="lb-rank">#${item.rank}</span>
      <span class="lb-name">${escapeHtml(item.province)}</span>
      <span class="lb-score">${item.score.toLocaleString('id-ID')}</span>
    `;
    lbProvinceList.appendChild(li);
  });
}

// ===== REFRESH =====
/**
 * Refresh leaderboard dari awal (dipanggil setelah sesi game selesai)
 */
export function refreshLeaderboard() {
  playerPage   = 1;
  provincePage = 1;
  loadPlayerRanking(1);
  loadProvinceRanking(1);
}

// ===== UTILS =====
/**
 * Escape HTML untuk cegah XSS dari nama pemain
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