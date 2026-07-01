// ui/leaderboardUI.js

const lbPlayerList    = document.getElementById('lb-player-list');
const lbProvinceList  = document.getElementById('lb-province-list');
const btnMorePlayer   = document.getElementById('btn-more-player');
const btnMoreProvince = document.getElementById('btn-more-province');

let playerPage   = 1;
let provincePage = 1;
const PAGE_SIZE  = 5;

let playerExpanded   = false;
let provinceExpanded = false;

export function initLeaderboardUI() {
  loadPlayerRanking(1);
  loadProvinceRanking(1);

  if (btnMorePlayer) {
    btnMorePlayer.addEventListener('click', () => {
      if (!playerExpanded) {
        playerPage++;
        loadPlayerRanking(playerPage);
        btnMorePlayer.textContent = 'show less ▴';
        playerExpanded = true;
      } else {
        playerPage = 1;
        if (lbPlayerList) lbPlayerList.innerHTML = '';
        loadPlayerRanking(1);
        btnMorePlayer.textContent = 'show more ▾';
        playerExpanded = false;
      }
    });
  }

  if (btnMoreProvince) {
    btnMoreProvince.addEventListener('click', () => {
      if (!provinceExpanded) {
        provincePage++;
        loadProvinceRanking(provincePage);
        btnMoreProvince.textContent = 'show less ▴';
        provinceExpanded = true;
      } else {
        provincePage = 1;
        if (lbProvinceList) lbProvinceList.innerHTML = '';
        loadProvinceRanking(1);
        btnMoreProvince.textContent = 'show more ▾';
        provinceExpanded = false;
      }
    });
  }

  // Auto-refresh every 30 seconds
  setInterval(refreshLeaderboard, 30000);
}

async function loadPlayerRanking(page) {
  try {
    const { fetchPlayerLeaderboard } = await import('../services/leaderboardAPI.js');
    const data = await fetchPlayerLeaderboard(page, PAGE_SIZE);
    renderPlayerList(data, page > 1);
  } catch (e) {
    console.error('Player leaderboard failed:', e);
    try {
      const { showError } = await import('./errorToast.js');
      showError('Gagal memuat leaderboard pemain.');
    } catch (_) {}
  }
}

async function loadProvinceRanking(page) {
  try {
    const { fetchProvinceLeaderboard } = await import('../services/leaderboardAPI.js');
    const data = await fetchProvinceLeaderboard(page, PAGE_SIZE);
    renderProvinceList(data, page > 1);
  } catch (e) {
    console.error('Province leaderboard failed:', e);
    try {
      const { showError } = await import('./errorToast.js');
      showError('Gagal memuat leaderboard provinsi.');
    } catch (_) {}
  }
}

function renderPlayerList(data, append = false) {
  if (!lbPlayerList) return;
  if (!append) lbPlayerList.innerHTML = '';

  if (!data || data.length === 0) {
    if (!append) {
      lbPlayerList.innerHTML = '<li class="lb-empty-state">Belum ada data</li>';
    }
    return;
  }

  data.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="lb-rank">#${item.rank}</span>
      <span class="lb-name">${escapeHtml(item.name || '')}</span>
      <span class="lb-score">${(item.score || 0).toLocaleString('id-ID')}</span>
    `;
    lbPlayerList.appendChild(li);
  });
}

function renderProvinceList(data, append = false) {
  if (!lbProvinceList) return;
  if (!append) lbProvinceList.innerHTML = '';

  if (!data || data.length === 0) {
    if (!append) {
      lbProvinceList.innerHTML = '<li class="lb-empty-state">Belum ada data</li>';
    }
    return;
  }

  data.forEach((item, index) => {
    const li = document.createElement('li');
    const rank = item.rank || ((provincePage - 1) * PAGE_SIZE + index + 1);
    li.innerHTML = `
      <span class="lb-rank">#${rank}</span>
      <span class="lb-name">${escapeHtml(item.province_name || '')}</span>
      <span class="lb-score">${(item.total_score || 0).toLocaleString('id-ID')}</span>
    `;
    lbProvinceList.appendChild(li);
  });
}

export function refreshLeaderboard() {
  playerPage       = 1;
  provincePage     = 1;
  playerExpanded   = false;
  provinceExpanded = false;
  if (btnMorePlayer)   btnMorePlayer.textContent   = 'show more ▾';
  if (btnMoreProvince) btnMoreProvince.textContent = 'show more ▾';
  loadPlayerRanking(1);
  loadProvinceRanking(1);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
