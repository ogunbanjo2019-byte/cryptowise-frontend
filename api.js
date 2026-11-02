'use strict';

// Configure your backend URL here:
// Use 'http://localhost:10000' for local testing, or your live Render URL for production.
const API_BASE_URL = 'https://your-cryptowise-backend.onrender.com';

window.CryptoWiseAPI = {
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      console.error('API is offline:', error);
      return { status: 'offline' };
    }
  },

  async preferences() {
    const response = await fetch(`${API_BASE_URL}/v1/preferences`, {
      headers: { 'Authorization': `Bearer ${window.CryptoWiseAuth?.getToken?.() || ''}` }
    });
    return await response.json();
  },

  async markNotificationRead(id) {
    const response = await fetch(`${API_BASE_URL}/v1/notifications/${id}/read`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${window.CryptoWiseAuth?.getToken?.() || ''}` }
    });
    return await response.json();
  }
};

// Automatically verify backend connection on load and remove preview badge if online
window.addEventListener('DOMContentLoaded', async () => {
  const health = await window.CryptoWiseAPI.checkHealth();
  if (health.status === 'ok') {
    console.log('Connected to live backend:', health);
    // Hide the preview warning banners across the UI
    document.querySelectorAll('.preview-banner, .api-offline-badge').forEach(el => el.remove());
  }
});