// services/leaderboardAPI.js

async function fetchWithRetry(url, retries = 1) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message || 'API error');
      return json.data;
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

export async function fetchPlayerLeaderboard(page = 1, size = 5) {
  const data = await fetchWithRetry(`/api/leaderboards/players?page=${page}&size=${size}`);
  return data?.players || [];
}

export async function fetchProvinceLeaderboard(page = 1, size = 5) {
  const data = await fetchWithRetry(`/api/leaderboards/provinces?page=${page}&size=${size}`);
  return data?.provinces || [];
}