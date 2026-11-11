(function () {
  "use strict";

  let tokenProvider = null;
  const config = window.CW_API_CONFIG || {
    baseUrl: "http://localhost:10000",
    requestTimeoutMs: 12000,
  };

  function setTokenProvider(provider) {
    tokenProvider = provider;
  }

  async function request(path, { method = "GET", body, auth = true, idempotencyKey } = {}) {
    const baseUrl = String(config.baseUrl || "").replace(/\/$/, "");
    if (!baseUrl) throw new Error("The backend URL is not configured in js/config.js.");

    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      config.requestTimeoutMs || 12000,
    );
    const headers = { Accept: "application/json" };

    try {
      if (auth) {
        if (!tokenProvider) {
          throw new Error("Authentication is not ready. Please sign in again.");
        }
        const token = await tokenProvider();
        if (!token) throw new Error("Please sign in first.");
        headers.Authorization = `Bearer ${token}`;
      }

      if (body !== undefined) headers["Content-Type"] = "application/json";
      if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

      let response;
      try {
        response = await fetch(`${baseUrl}${path}`, {
          method,
          headers,
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: controller.signal,
          credentials: "omit",
          cache: "no-store",
        });
      } catch (error) {
        if (error?.name === "AbortError") {
          throw new Error("The backend request timed out. Check that the API service is awake and reachable.");
        }
        throw new Error(`Could not reach the backend at ${baseUrl}. Check the API URL, service status, and CORS allowlist.`);
      }

      if (response.status === 204) return null;
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.message || `API request failed (${response.status}).`);
      }
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  const api = {
    setTokenProvider,
    health: () => request("/health", { auth: false }),
    me: () => request("/v1/me"),
    wallet: () => request("/v1/wallet"),
    depositInstructions: () => request("/v1/deposit-instructions"),
    depositRequests: () => request("/v1/deposit-requests"),
    createDepositRequest: (body) =>
      request("/v1/deposit-requests", { method: "POST", body }),
    createWithdrawalRequest: (body) =>
      request("/v1/withdrawal-requests", { method: "POST", body }),
    preferences: () => request("/v1/preferences"),
    savePreferences: (body) =>
      request("/v1/preferences", { method: "PATCH", body }),
    notifications: () => request("/v1/notifications"),
    markNotificationRead: (id) =>
      request(`/v1/notifications/${encodeURIComponent(id)}/read`, {
        method: "PATCH",
        body: {},
      }),
    adminOverview: () => request("/v1/admin/overview"),
    adminUsers: () => request("/v1/admin/users"),
    adminDeposits: (status) =>
      request(`/v1/admin/deposits?status=${encodeURIComponent(status || "pending_manual_review")}`),
    adminDepositOperations: () => request("/v1/admin/deposit-operations"),
    adminWithdrawals: (status) =>
      request(`/v1/admin/withdrawals?status=${encodeURIComponent(status || "pending_review")}`),
    adminSubmitWithdrawalToCustody: (id) =>
      request(`/v1/admin/withdrawals/${encodeURIComponent(id)}/submit-to-custody`, { method: "POST", body: {} }),
    auditLogs: () => request("/v1/admin/audit-logs"),
    tradingStatus: () => request("/v1/trading/status"),
    trade: (body, idempotencyKey) => request("/v1/trade", { method: "POST", body, idempotencyKey }),
    exportAccount: async () => {
      const token = await tokenProvider?.();
      if (!token) throw new Error("Please sign in first.");
      const response = await fetch(`${String(config.baseUrl || "").replace(/\/$/, "")}/v1/account-export`, { headers: { Authorization: `Bearer ${token}`, Accept: "text/csv" }, cache: "no-store" });
      if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.error || `Export failed (${response.status}).`); }
      return response.blob();
    },
  };

  window.CryptoWiseAPI = Object.freeze(api);
})();
