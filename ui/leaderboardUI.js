// ui/leaderboardUI.js

const lbPlayerList    = document.getElementById('lb-player-list');
const lbProvinceList  = document.getElementById('lb-province-list');
const btnMorePlayer   = document.getElementById('btn-more-player');
const btnMoreProvince = document.getElementById('btn-more-province');

let playerPage      = 1;
let provincePage    = 1;
const PAGE_SIZE     = 5;
let playerExpanded  = false;
let provinceExpanded = false;

export function initLeaderboardUI() {
  loadPlayerRanking(1);
  loadProvinceRanking(1);

  btnMorePlayer.addEventListener('click', () => {
    if (!playerExpanded) {
      playerPage++;
      loadPlayerRanking(playerPage);
      btnMorePlayer.textContent = 'show less ▴';
      playerExpanded = true;
    } else {
      playerPage = 1;
      lbPlayerList.innerHTML = '';
      loadPlayerRanking(1);
      btnMorePlayer.textContent = 'show more ▾';
      playerExpanded = false;
    }
  });

  btnMoreProvince.addEventListener('click', () => {
    if (!provinceExpanded) {
      provincePage++;
      loadProvinceRanking(provincePage);
      btnMoreProvince.textContent = 'show less ▴';
      provinceExpanded = true;
    } else {
      provincePage = 1;
      lbProvinceList.innerHTML = '';
      loadProvinceRanking(1);
      btnMoreProvince.textContent = 'show more ▾';
      provinceExpanded = false;
    }
  });
}

async function loadPlayerRanking(page) {
  try {
    const { fetchPlayerLeaderboard } = await import('../services/leaderboardAPI.js');
    const data = await fetchPlayerLeaderboard(page, PAGE_SIZE);
    renderPlayerList(data, page > 1);
  } catch (e) {
    console.warn('Leaderboard pemain gagal:', e);
  }
}

async function loadProvinceRanking(page) {
  try {
    const { fetchProvinceLeaderboard } = await import('../services/leaderboardAPI.js');
    const data = await fetchProvinceLeaderboard(page, PAGE_SIZE);
    renderProvinceList(data, page > 1);
  } catch (e) {
    console.warn('Leaderboard provinsi gagal:', e);
  }
}

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
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}