async function loadDonorData() {
  try {
    const { fetchDonors } = await import('../services/donorAPI.js');
    tickerData = await fetchDonors();
    renderTicker(tickerData);
    isLoaded = true;
  } catch (e) {
    console.warn('Donor API failed:', e);
    renderTicker(getPlaceholderDonors());
  }
}