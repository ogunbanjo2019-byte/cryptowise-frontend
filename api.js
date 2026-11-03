(() => {
  "use strict";

  const config = window.CW_API_CONFIG || {};
  const baseUrl = String(config.baseUrl || "").replace(/\/+$/, "");
  const timeoutMs = Number(config.requestTimeoutMs) > 0
    ? Number(config.requestTimeoutMs)
    : 12000;

  async function checkHealth() {
    if (!baseUrl) {
      throw new Error("Backend URL is missing. Set CW_API_CONFIG.baseUrl in js/config.js.");
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      let response;
      try {
        response = await fetch(`${baseUrl}/health`, {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "omit",
          cache: "no-store",
          signal: controller.signal,
        });
      } catch (error) {
        if (error?.name === "AbortError") {
          throw new Error("Backend health check timed out. Check that the API service is online.");
        }
        throw new Error("Cannot reach the backend. Check the backend URL and CORS configuration.");
      }

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || `Backend health check failed (${response.status}).`);
      }
      return result;
    } finally {
      window.clearTimeout(timer);
    }
  }

  // The shared client is frozen; copy its methods before adding this compatibility method.
  const api = { ...(window.CryptoWiseAPI || {}) };
  api.checkHealth = checkHealth;
  window.CryptoWiseAPI = Object.freeze(api);

  function runHealthCheck() {
    window.CryptoWiseAPI.checkHealth()
      .then((health) => {
        window.dispatchEvent(new CustomEvent("cryptowise-api-health", { detail: health }));
      })
      .catch((error) => {
        console.warn("CryptoWise backend health check failed:", error.message);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runHealthCheck, { once: true });
  } else {
    runHealthCheck();
  }
})();
