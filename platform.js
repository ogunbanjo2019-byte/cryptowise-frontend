"use strict";

const assets = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    icon: "₿",
    color: "coin-btc",
    price: 67432.21,
    qty: 0.1842,
    change: "+2.34%",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: "◆",
    color: "coin-eth",
    price: 3245.67,
    qty: 2.84,
    change: "+1.18%",
  },
  {
    symbol: "USDT",
    name: "Tether",
    icon: "₮",
    color: "coin-usdt",
    price: 1,
    qty: 5120,
    change: "+0.01%",
  },
  {
    symbol: "BNB",
    name: "BNB",
    icon: "◆",
    color: "coin-bnb",
    price: 580.12,
    qty: 6.4,
    change: "+1.76%",
  },
];

const money = (n) =>
  "$" +
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const transactions = [
  ["Deposit", "100 USDT", "USDT", "Completed", "Oct 30, 2026"],
  ["Buy ETH", "0.42 ETH", "ETH", "Completed", "Oct 29, 2026"],
  ["Sell BTC", "0.006 BTC", "BTC", "Completed", "Oct 28, 2026"],
  ["Deposit", "250 USDT", "USDT", "Pending", "Oct 27, 2026"],
  ["Buy BTC", "0.01 BTC", "BTC", "Completed", "Oct 25, 2026"],
];

const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};

const rows = (data, keys) =>
  data
    .map(
      (row) =>
        `<tr>${row.map((cell, i) => `<td>${keys?.[i] === "status" ? `<span class="status ${cell.toLowerCase()}">${cell}</span>` : cell}</td>`).join("")}</tr>`,
    )
    .join("");

function heading(title, sub, actions = "") {
  return `<div class="page-heading"><div><h1>${title}</h1><p>${sub}</p></div><div class="heading-actions">${actions}</div></div>`;
}

function metric(label, value, foot, icon = "◫") {
  return `<article class="metric-card"><div class="metric-label">${label}<span class="metric-icon">${icon}</span></div><div class="metric-value">${value}</div><div class="metric-foot">${foot}</div></article>`;
}

function assetList() {
  return `<div class="asset-list">${assets.map((a) => `<div class="asset-line"><i class="coin ${a.color}">${a.icon}</i><div class="asset-name"><b>${a.name}</b><small>${a.symbol}</small></div><div class="asset-holding"><b>${money(a.qty * a.price)}</b><small>${a.qty} ${a.symbol}</small></div><span class="asset-change">${a.change}</span></div>`).join("")}</div>`;
}

function activityRows(data = transactions) {
  return data
    .map(
      (row) =>
        `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td><span class="status ${row[3].toLowerCase()}">${row[3]}</span></td><td>${row[4]}</td></tr>`,
    )
    .join("");
}

// ==========================================
// 2. CHART RENDERING
// ==========================================

function renderChart(canvas) {
  if (!canvas) return;
  const w = canvas.clientWidth,
    h = canvas.clientHeight,
    dpr = window.devicePixelRatio || 1;
  if (!w || !h) return;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const c = canvas.getContext("2d");
  c.scale(dpr, dpr);

  for (let i = 0; i < 4; i++) {
    c.beginPath();
    c.moveTo(0, (i * h) / 3);
    c.lineTo(w, (i * h) / 3);
    c.strokeStyle = "rgba(210,239,228,.07)";
    c.stroke();
  }

  const vals = [
    27, 35, 32, 43, 38, 48, 41, 56, 50, 61, 57, 71, 63, 73, 68, 82, 78, 74, 89,
    81, 94, 87, 102, 97, 109, 101, 119, 111, 127, 118, 137,
  ];
  const lo = 20,
    hi = 145;

  c.beginPath();
  vals.forEach((v, i) => {
    const x = (i / (vals.length - 1)) * w,
      y = h - 8 - ((v - lo) / (hi - lo)) * (h - 18);
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  });
  c.lineTo(w, h);
  c.lineTo(0, h);
  c.closePath();

  const g = c.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "rgba(23,204,149,.27)");
  g.addColorStop(1, "rgba(23,204,149,0)");
  c.fillStyle = g;
  c.fill();

  c.beginPath();
  vals.forEach((v, i) => {
    const x = (i / (vals.length - 1)) * w,
      y = h - 8 - ((v - lo) / (hi - lo)) * (h - 18);
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  });
  c.strokeStyle = "#24d09b";
  c.lineWidth = 2;
  c.stroke();
}

function renderTradeCandles(canvas) {
  if (!canvas) return;
  const w = canvas.clientWidth, h = canvas.clientHeight, dpr = window.devicePixelRatio || 1;
  if (!w || !h) return;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const c = canvas.getContext("2d"); c.scale(dpr, dpr); c.clearRect(0, 0, w, h);
  c.fillStyle = "#07171f"; c.fillRect(0, 0, w, h);
  c.strokeStyle = "rgba(197,224,218,.10)"; c.lineWidth = 1;
  for (let i = 0; i <= 5; i++) { const y = 15 + i * ((h - 30) / 5); c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  for (let i = 0; i <= 7; i++) { const x = i * (w / 7); c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
  const closes = [286,291,289,295,301,298,305,312,309,316,311,319,323,320,327,324,331,337,334,341,338,344,339,346,351,348,355,352,358,354,361,357,365,362,369,366,372,368];
  const min = 280, max = 380, plotH = h - 30, y = (v) => 15 + (max-v)/(max-min)*plotH, step = w / closes.length;
  c.font = "9px DM Sans"; c.fillStyle = "#769295"; c.textAlign = "right";
  [380,360,340,320,300,280].forEach((v) => c.fillText(String(v), w-5, y(v)+3));
  closes.forEach((close, i) => { const open = i ? closes[i-1] : close-3; const high = Math.max(open,close)+[5,8,4,7][i%4]; const low = Math.min(open,close)-[4,6,3][i%3]; const x = i*step+step/2; const up = close >= open; const color = up ? "#18c69a" : "#ee6675"; c.strokeStyle=color; c.fillStyle=color; c.lineWidth=1.2; c.beginPath(); c.moveTo(x,y(high)); c.lineTo(x,y(low)); c.stroke(); const top=y(Math.max(open,close)), bottom=y(Math.min(open,close)); c.fillRect(x-step*.29, top, step*.58, Math.max(2,bottom-top)); });
  const last = closes[closes.length-1]; c.setLineDash([4,4]); c.strokeStyle="#e5b34e"; c.beginPath(); c.moveTo(0,y(last)); c.lineTo(w,y(last)); c.stroke(); c.setLineDash([]); c.fillStyle="#e5b34e"; c.fillRect(w-52,y(last)-9,52,18); c.fillStyle="#07171f"; c.textAlign="center"; c.fillText(last.toFixed(2),w-26,y(last)+3);
}
function dashboard() {
  return `${heading("My accounts", "Manage your real and demo trading accounts.", `<button class="btn btn-primary" data-page-link="trade">Trade now ↗</button>`)}<section class="account-shell"><div class="account-alert"><strong>Secure your funds</strong><span>Use strong authentication and keep withdrawals protected.</span><b>✓</b></div><div class="account-tabs"><button class="active" type="button">Real</button><button type="button">Demo</button><span>＋ Open account</span></div><div class="account-toolbar"><span>☷ &nbsp; Newest</span><span>⌄</span></div><article class="account-card"><div class="account-card-top"><span><i></i> Real &nbsp; <b>CryptoWise</b> &nbsp; Standard</span><span>⌄</span></div><small class="account-number" data-account-number="real">Account ID loading… · Real account</small><strong class="account-balance" data-account-balance="real">Live balance unavailable<em> USD</em></strong><div class="account-actions"><button data-page-link="deposit">＋<small>Deposit</small></button><button data-page-link="trade">⇄<small>Trade</small></button><button data-page-link="wallet">•••<small>More</small></button></div></article><article class="account-card demo-account"><div class="account-card-top"><span><i></i> Demo &nbsp; <b>CryptoWise</b> &nbsp; Practice</span><span>⌄</span></div><small class="account-number" data-account-number="demo">Demo account loading… · Virtual account</small><strong class="account-balance" data-account-balance="demo">10,000.00<em> USDT (virtual)</em></strong><div class="account-actions"><button data-page-link="trade">⇄<small>Trade</small></button><button data-page-link="wallet">▣<small>Wallet</small></button><button data-page-link="history">•••<small>More</small></button></div></article></section><div class="metric-grid">${metric("TOTAL BALANCE", "$24,680.50", "<em>↗ 8.24%</em> this month", "◉")}${metric("TODAY’S CHANGE", "+$384.21", "<em>↗ 1.58%</em> today", "↗")}${metric("ASSETS HELD", "4", "Across 3 asset types", "▣")}</div><div class="overview-grid"><section class="panel chart-panel"><div class="panel-title"><div><h2>Portfolio performance</h2><div class="chart-legend"><span></span> Total value</div></div><div class="period-select"><button>1D</button><button>1W</button><button class="chosen">1M</button><button>1Y</button><button>ALL</button></div></div><canvas class="large-chart" id="portfolioChart" aria-label="Portfolio performance chart"></canvas></section><section class="panel"><div class="panel-title"><h2>Your assets</h2><button data-page-link="wallet">View wallet ↗</button></div>${assetList()}</section></div><div class="dashboard-lower"><section class="panel"><div class="panel-title"><h2>Recent activity</h2><button data-page-link="history">View history ↗</button></div><div class="table-wrap"><table class="activity-table"><thead><tr><th>ACTIVITY</th><th>AMOUNT</th><th>ASSET</th><th>STATUS</th><th>DATE</th></tr></thead><tbody>${activityRows(transactions.slice(0, 4))}</tbody></table></div></section><section class="panel"><div class="panel-title"><h2>Market snapshot</h2><button data-page-link="markets">All markets ↗</button></div>${marketRows(assets.slice(0, 3))}</section></div><div class="deposit-callout"><div><h3>Your first deposit comes with a bonus</h3><p>Eligible deposits may qualify for our welcome promotion. Terms apply.</p></div><button class="btn btn-primary" data-page-link="promotions">Explore bonus ↗</button></div>`;
}

function marketRows(list = assets) {
  return `<div class="asset-list">${list.map((a) => `<div class="asset-line"><i class="coin ${a.color}">${a.icon}</i><div class="asset-name"><b>${a.name}</b><small>${a.symbol}/USD</small></div><div class="asset-holding"><b>${money(a.price)}</b><small>24h price</small></div><span class="asset-change">${a.change}</span></div>`).join("")}</div>`;
}

function marketsPage() {
  return `${heading("Markets", "Explore crypto assets and illustrative prices.", `<button class="btn btn-secondary" data-action="download">↓ &nbsp; Export market</button>`)}<div class="metric-grid">${metric("ASSETS LISTED", "120+", "Illustrative catalog", "◈")}${metric("MARKET SENTIMENT", "Positive", "Market snapshot · sample", "↗")}${metric("CURRENCY", "USD", "Display preference", "＄")}</div><section class="panel"><div class="panel-title"><h2>Popular assets</h2><span class="chart-legend"><span></span> Sample market data</span></div><div class="filter-row"><input class="table-search" placeholder="Search assets..."><select><option>All assets</option><option>Favorites</option><option>Stablecoins</option></select></div><div id="marketTable"></div></section>`;
}

function tradePage() {
  return `${heading("Trade", "Markets move fast. Keep your plan clear.", `<span class="status">Demo mode</span>`)}<div class="trading-workspace"><div class="trade-topbar"><button class="symbol-button">⌘ &nbsp; ETH/USDT <small>Ethereum / Tether</small></button><button>＋</button><span class="trade-price">3,245.67 <em>+1.18%</em></span><button class="icon-tool">⌁</button><button class="icon-tool">↗</button></div><div class="trade-timebar"><button class="active">15m</button><button>1H</button><button>4H</button><button>1D</button><button>1W</button><span></span><button>Indicators⌄</button><button>Alert</button></div><div class="trade-chart-shell"><aside class="chart-tools"><button>＋</button><button>╱</button><button>⌁</button><button>◌</button><button>T</button><button>⌖</button></aside><div class="trade-chart-area"><canvas class="large-chart trade-candles" id="tradeChart" aria-label="ETH USDT candlestick chart"></canvas><div class="trade-volume"><span>Vol</span><i style="height:30%"></i><i style="height:48%"></i><i style="height:22%"></i><i style="height:62%"></i><i style="height:40%"></i><i style="height:74%"></i><i style="height:35%"></i><i style="height:56%"></i></div></div></div><div class="trade-quote-row"><div><b>3,245.61</b><small>SELL</small></div><span>0.11</span><div><b>3,245.72</b><small>BUY</small></div></div><section class="trade-ticket"><div class="mode-tabs"><button type="button" class="active" data-trade-mode="demo">Demo</button><button type="button" disabled aria-disabled="true" title="Live trading is unavailable until a verified exchange adapter and risk controls are configured">Real · Unavailable</button></div><div class="trade-ticket-head"><strong id="tradeModeTitle">Demo order</strong><span id="tradeModeNote">Simulated prices · virtual practice balance</span><small id="tradeAccountNumber">Practice account · virtual only</small></div><form id="demoTradeForm"><input type="hidden" id="demoTradeMode" value="demo"><div class="tabs"><button type="button" class="active" data-tab="buy">Buy</button><button type="button" data-tab="sell">Sell</button></div><input type="hidden" id="demoTradeSide" value="buy"><div class="form-field"><label for="demoTradeAmount">Amount in USDT</label><input id="demoTradeAmount" type="number" min="100" max="100000" step="0.01" placeholder="100.00" required></div><div class="notice-card">Simulated price <strong>3,245.67 USDT / ETH</strong><br>Practice orders use a separate virtual balance. No real order or real asset movement occurs.</div><button class="btn btn-primary trade-submit" type="submit">Place demo order</button><p id="demoTradeMessage" role="status"></p></form></section></div>`;
}
function walletPage() {
  return `${heading("Wallet", "View your crypto balances and deposit availability.", `<button class="btn btn-primary" data-page-link="deposit">＋ &nbsp; Deposit</button>`)}<div class="wallet-grid">${assets
    .filter((a) => ["USDT", "ETH"].includes(a.symbol))
    .map(
      (a) =>
        `<section class="panel"><div class="wallet-asset"><i class="coin ${a.color}">${a.icon}</i><div><b>${a.name}</b><small>${a.symbol} · Ethereum network</small></div></div><div class="wallet-balance">${a.qty.toLocaleString()} ${a.symbol}</div><div class="wallet-equivalent">≈ ${money(a.qty * a.price)} USD</div><div class="wallet-actions"><button class="btn btn-primary" data-page-link="deposit">Deposit status</button><button class="btn btn-secondary" data-action="notify">Withdraw</button><button class="btn btn-secondary" data-action="notify">Transfer</button></div></section>`,
    )
    .join(
      "",
    )}</div><section class="panel" style="margin-top:14px"><div class="panel-title"><h2>Deposit availability</h2></div><div class="notice-card"><strong>ETH and USDT on Ethereum are not currently accepting deposits.</strong><br>Do not send funds to the address shown in an exchange app or any address not displayed as an active CryptoWise instruction. Chain verification, confirmations, reorg recovery, and reconciliation must be operational before deposits open.</div><div class="panel-title" style="margin-top:19px"><h2>Recent wallet activity</h2><button data-page-link="history">Full history ↗</button></div><div class="table-wrap"><table class="activity-table"><thead><tr><th>ACTIVITY</th><th>AMOUNT</th><th>ASSET</th><th>STATUS</th><th>DATE</th></tr></thead><tbody>${activityRows(transactions.slice(0, 3))}</tbody></table></div></section>`;
}

function depositPage() {
  return `${heading("Crypto deposits", "View receiving instructions and track deposit requests. Do not send funds while this page says deposits are paused.")}<section class="panel"><div class="panel-title"><h2>Ethereum deposits · ETH and USDT</h2><span class="status pending" id="depositAvailability">Checking status</span></div><div class="notice-card" id="depositNetworkNote">Loading backend deposit status…</div><div class="form-field" style="margin-top:12px"><label for="depositAsset">Asset</label><select id="depositAsset"><option value="ETH">ETH · native Ethereum</option><option value="USDT">USDT · Ethereum ERC-20</option></select></div><div class="notice-card"><strong>Receiving address</strong><br><code id="depositAddress">No active receiving address</code><button type="button" class="btn btn-secondary" id="copyDepositAddress" style="margin-left:10px" hidden>Copy</button></div><div class="notice-card" id="depositAssetDetails">No verified deposit instructions are active. Never send assets to the address shown in another app unless CryptoWise presents it here as active.</div><form id="depositRequestForm" hidden><div class="form-field"><label for="depositTxHash">Transaction hash</label><input id="depositTxHash" name="txHash" type="text" inputmode="text" autocomplete="off" placeholder="0x…" pattern="0x[a-fA-F0-9]{64}" required></div><button class="btn btn-primary" type="submit" style="margin-top:10px">Submit deposit for tracking</button><p class="metric-foot">Submitting a hash is not proof of payment and does not itself credit a balance.</p></form></section><section class="panel" style="margin-top:14px"><div class="panel-title"><h2>Your deposit requests</h2></div><div id="depositRequestsList" class="notice-card">Sign in to load your deposit requests.</div></section>`;
}

function historyPage() {
  const hist = [...transactions, ...transactions.slice(1, 4)];
  return `${heading("Transaction history", "Review deposits, withdrawals, and trades.", `<button class="btn btn-secondary" data-action="download">↓ &nbsp; Download CSV</button>`)}<section class="panel"><div class="filter-row"><input class="table-search" placeholder="Search transactions..."><select><option>All activity</option><option>Deposits</option><option>Withdrawals</option><option>Trades</option></select><select><option>All statuses</option><option>Completed</option><option>Pending</option></select></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>ACTIVITY</th><th>AMOUNT</th><th>ASSET</th><th>STATUS</th><th>DATE</th></tr></thead><tbody>${activityRows(hist)}</tbody></table></div></section>`;
}

function promotionsPage(admin = false) {
  return `${heading(admin ? "Promotion settings" : "Promotions", admin ? "Configure offer display and terms (preview only)." : "Offers and eligibility information.", admin ? '<button class="btn btn-primary" data-action="notify">＋ &nbsp; New promotion</button>' : "")}<section class="promo-card"><div><div class="eyebrow">WELCOME OFFER · TERMS APPLY</div><h2>Give your first deposit a brighter beginning.</h2><p>Eligible first deposits may qualify for up to a 3× promotional bonus. Offer eligibility, caps, holding periods, and withdrawal terms must be configured and legally reviewed before launch.</p><button class="btn btn-primary" data-action="notify">View offer details ↗</button></div><div class="promo-value">3×</div></section><div class="dashboard-lower"><section class="panel"><div class="panel-title"><h2>How it works</h2></div><div class="notice-card"><strong>1. Check eligibility</strong><br>Confirm the user qualifies based on published terms.</div><div class="notice-card"><strong>2. Make a qualifying deposit</strong><br>Deposit requirements must be verified by the connected backend.</div><div class="notice-card"><strong>3. Bonus is credited</strong><br>Credit only after policy and compliance requirements are met.</div></section><section class="panel"><div class="panel-title"><h2>Offer terms</h2></div><p class="metric-foot" style="font-size:9px;line-height:1.8">This interface uses a placeholder promotion. Define exact eligibility, bonus cap, geographic restrictions, expiry, custody, withdrawal lock-up, consumer disclosures, and applicable legal approvals before publishing an offer.</p></section></div>`;
}

function settingsPage() {
  return `${heading("Settings", "Manage your profile, display currency, and notifications.")}
    <div class="settings-layout">
      <nav class="settings-nav" aria-label="Settings sections">
        <button class="active" type="button" data-settings-tab="profile">Profile</button>
        <button type="button" data-settings-tab="preferences">Preferences</button>
        <button type="button" data-settings-tab="notifications">Notifications</button>
        <button type="button" data-settings-tab="security">Security</button>
      </nav>
      <div class="settings-panels">
        <section class="panel" data-settings-panel="profile">
          <div class="panel-title"><h2>Personal information</h2><span class="status">Account</span></div>
          <div class="form-grid">
            <div class="form-field"><label>First name</label><input data-profile-first readonly value=""></div>
            <div class="form-field"><label>Last name</label><input data-profile-last readonly value=""></div>
            <div class="form-field"><label>Email address</label><input data-profile-email type="email" readonly value=""></div>
            <div class="form-field"><label>Username</label><input data-profile-username-field readonly value=""></div>
            <div class="form-field"><label>Customer ID</label><input data-profile-customer-number readonly value=""></div>
          </div>
          <div class="notice-card" style="margin-top:15px">Your username and Customer ID are assigned by the authenticated backend and stay the same on later logins.</div>
        </section>
        <section class="panel" data-settings-panel="preferences" hidden>
          <div class="panel-title"><h2>Preferences</h2></div>
          <div class="form-grid">
            <div class="form-field"><label for="displayCurrency">Display currency</label>
              <select id="displayCurrency">
                <option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — British Pound</option><option value="CAD">CAD — Canadian Dollar</option><option value="AUD">AUD — Australian Dollar</option><option value="NZD">NZD — New Zealand Dollar</option><option value="JPY">JPY — Japanese Yen</option><option value="INR">INR — Indian Rupee</option><option value="NGN">NGN — Nigerian Naira</option><option value="GHS">GHS — Ghanaian Cedi</option><option value="ZAR">ZAR — South African Rand</option><option value="KES">KES — Kenyan Shilling</option>
              </select>
            </div>
            <div class="form-field"><label for="accountTimeZone">Your device time zone</label><input id="accountTimeZone" readonly value=""></div>
            <div class="form-field"><label><input id="emailNotificationPreference" type="checkbox" checked> Email notifications</label></div>
            <div class="form-field"><label><input id="productNotificationPreference" type="checkbox" checked> Product updates</label></div>
          </div>
          <div class="notice-card" style="margin-top:12px">The greeting follows the time zone set on this device. Currency preference is saved to your account; accurate fiat conversion requires a trusted live crypto-price and FX feed.</div>
          <button class="btn btn-primary" type="button" data-action="save-preferences" style="margin-top:12px">Save preferences</button>
        </section>
        <section class="panel" data-settings-panel="notifications" hidden>
          <div class="panel-title"><h2>Your notifications</h2><button type="button" data-action="refresh-notifications">Refresh</button></div>
          <div id="notificationsList" class="notice-card">Loading your notifications…</div>
          <button class="btn btn-secondary" type="button" data-action="mark-all-notifications" style="margin-top:12px">Mark all as read</button>
        </section>
        <section class="panel" data-settings-panel="security" hidden>
          <div class="panel-title"><h2>Security</h2></div>
          <div class="notice-card">Use Firebase account security and recovery controls for password changes and multi-factor authentication. This app does not change passwords from this page.</div>
        </section>
      </div>
    </div>`;
}

const views = {
  overview: dashboard,
  markets: marketsPage,
  trade: tradePage,
  wallet: walletPage,
  deposit: depositPage,
  history: historyPage,
  promotions: promotionsPage,
  settings: settingsPage,
};

let currentPage = "overview";
let liveWallet = null;
let liveProfile = null;
let liveDepositInstructions = null;
// Display safeguard only; all fund controls must remain enforced by the backend.
const customerDepositUiReleased = false;

function buildMarketTable() {
  const host = document.getElementById("marketTable");
  if (!host) return;
  // Note: ensure table helper is defined if used, or use row strings directly
}

function navigate(page) {
  if (!views[page]) return;
  currentPage = page;
  document
    .querySelectorAll(".side-link")
    .forEach((b) => b.classList.toggle("active", b.dataset.page === page));
  const content = document.getElementById("pageContent");
  content.innerHTML = views[page]();
  buildMarketTable();
  renderChart(document.getElementById("portfolioChart"));
  renderChart(document.getElementById("tradeChart"));
  renderTradeCandles(document.getElementById("tradeChart"));
  document.querySelector(".platform-sidebar").classList.remove("open");
  document.querySelector(".mobile-shade").classList.remove("visible");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (liveProfile) renderConnectedAccount();
  if (currentPage === "deposit") loadDepositPage();
  if (currentPage === "settings") { loadUserPreferences(); loadUserNotifications(); }
}

// ==========================================
// 4. UI TOASTS & EVENT LISTENERS
// ==========================================

let toastTimer;
function toast(message) {
  const box = document.querySelector(".toast");
  if (!box) return;
  box.textContent = message;
  box.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => box.classList.remove("visible"), 3200);
}

document.addEventListener("click", (e) => {
  const settingsTab = e.target.closest("[data-settings-tab]");
  if (settingsTab) {
    document
      .querySelectorAll("[data-settings-tab]")
      .forEach((button) =>
        button.classList.toggle("active", button === settingsTab),
      );
    document.querySelectorAll("[data-settings-panel]").forEach((panel) => {
      panel.hidden =
        panel.dataset.settingsPanel !== settingsTab.dataset.settingsTab;
    });
    if (settingsTab.dataset.settingsTab === "notifications")
      loadUserNotifications();
    if (settingsTab.dataset.settingsTab === "preferences")
      loadUserPreferences();
    return;
  }
  const readNotification = e.target.closest("[data-mark-notification]");
  if (readNotification) {
    window.CryptoWiseAPI.markNotificationRead(
      readNotification.dataset.markNotification,
    )
      .then(loadUserNotifications)
      .catch((error) =>
        toast(error.message || "Could not mark notification as read."),
      );
    return;
  }
  const nav = e.target.closest("[data-page], [data-page-link]");
  if (nav) {
    e.preventDefault();
    navigate(nav.dataset.page || nav.dataset.pageLink);
    return;
  }
  const modeTab = e.target.closest("[data-trade-mode]");
  if (modeTab) {
    document.querySelectorAll("[data-trade-mode]").forEach((b) => b.classList.toggle("active", b === modeTab));
    const mode = modeTab.dataset.tradeMode;
    const input = document.getElementById("demoTradeMode"); if (input) input.value = mode;
    const title = document.getElementById("tradeModeTitle"); if (title) title.textContent = "Demo order";
    const note = document.getElementById("tradeModeNote"); if (note) note.textContent = `Practice account ${liveProfile?.customerNumber ? "DEMO-" + liveProfile.customerNumber.replace(/^CW-/, "") : "· virtual balance"}`;
    const submit = document.querySelector("#demoTradeForm .trade-submit"); if (submit) submit.textContent = "Place demo order";
    return;
  }
  const tradeTab = e.target.closest("#demoTradeForm [data-tab]");
  if (tradeTab) {
    document.querySelectorAll("#demoTradeForm [data-tab]").forEach((b) => b.classList.toggle("active", b === tradeTab));
    const side = document.getElementById("demoTradeSide");
    if (side) side.value = tradeTab.dataset.tab;
    return;
  }
  const action = e.target.closest("[data-action]");
  if (action) {
    if (action.dataset.action === "open-notifications") {
      navigate("settings");
      setTimeout(
        () =>
          document
            .querySelector('[data-settings-tab="notifications"]')
            ?.click(),
        0,
      );
      return;
    }
    if (action.dataset.action === "save-preferences") {
      saveUserPreferences();
      return;
    }
    if (action.dataset.action === "refresh-notifications") {
      loadUserNotifications();
      return;
    }
    if (action.dataset.action === "mark-all-notifications") {
      markAllNotificationsRead();
      return;
    }
    if (action.dataset.action === "download") {
      // Download the authenticated account export generated by the backend.
      (async () => {
        try {
          if (!window.CryptoWiseAPI?.exportAccount) {
            throw new Error(
              "Account export is unavailable. Update the API client first.",
            );
          }
          const blob = await window.CryptoWiseAPI.exportAccount();
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "cryptowise-account-export.csv";
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          toast("Your account export was downloaded.");
        } catch (error) {
          toast(error.message || "Could not export account data.");
        }
      })();
    } else {
      toast("Preview only — connect your backend to enable this action.");
    }
    return;
  }
  const tab = e.target.closest("[data-tab]");
  if (tab) {
    tab.parentElement
      .querySelectorAll("button")
      .forEach((b) => b.classList.toggle("active", b === tab));
    return;
  }
  const filter = e.target.closest("[data-filter]");
  if (filter) {
    filter.parentElement
      .querySelectorAll("button")
      .forEach((b) => b.classList.toggle("active", b === filter));
    return;
  }
  const banner = e.target.closest(".banner-dismiss");
  if (banner) banner.closest(".preview-banner").remove();
  const period = e.target.closest(".period-select button");
  if (period) {
    period.parentElement
      .querySelectorAll("button")
      .forEach((b) => b.classList.toggle("chosen", b === period));
    toast("Chart period updated in preview.");
  }
});

document.querySelector(".menu-toggle")?.addEventListener("click", () => {
  document.querySelector(".platform-sidebar")?.classList.toggle("open");
  document.querySelector(".mobile-shade")?.classList.toggle("visible");
});

document.querySelector(".mobile-shade")?.addEventListener("click", () => {
  document.querySelector(".platform-sidebar")?.classList.remove("open");
  document.querySelector(".mobile-shade")?.classList.remove("visible");
});

document
  .querySelector(".top-search input")
  ?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      navigate("markets");
      document.querySelector(".table-search")?.focus();
    }
  });

document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    document.querySelector(".top-search input")?.focus();
  }
});

window.addEventListener("resize", () => {
  clearTimeout(window.__chartResize);
  window.__chartResize = setTimeout(() => {
    renderChart(document.getElementById("portfolioChart"));
    renderChart(document.getElementById("tradeChart"));
  renderTradeCandles(document.getElementById("tradeChart"));
  }, 120);
});

navigate("overview");

// ==========================================
// 5. AUTHENTICATED BACKEND DATA & SYNC
// ==========================================

function atomicDisplay(raw, decimals, maxFractionDigits = 6) {
  const scale = 10n ** BigInt(decimals);
  const value = BigInt(raw || "0");
  const whole = value / scale;
  const fraction = (value % scale).toString().padStart(decimals, "0").replace(/0+$/, "").slice(0, maxFractionDigits).replace(/0+$/, "");
  const groupedWhole = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${groupedWhole}${fraction ? "." + fraction : ""}`;
}
function compactAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  const abs = Math.abs(amount);
  const divisor = abs >= 1_000_000 ? 1_000_000 : abs >= 1_000 ? 1_000 : 1;
  const suffix = divisor === 1_000_000 ? "M" : divisor === 1_000 ? "K" : "";
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: suffix ? 1 : 2, maximumFractionDigits: suffix ? 2 : 2 }).format(amount / divisor) + suffix;
}
function setAccountBalance(element, amount, unit, exact) {
  if (!element) return;
  element.replaceChildren();
  element.append(document.createTextNode(amount));
  const label = document.createElement("em");
  label.textContent = unit;
  element.append(label);
  if (exact) element.title = `Exact balance: ${exact} ${unit.trim()}`;
}

function getTimeGreeting(name, date = new Date()) {
  const hour = date.getHours();
  const partOfDay =
    hour >= 5 && hour < 12
      ? "Good morning"
      : hour >= 12 && hour < 18
        ? "Good afternoon"
        : hour >= 18 && hour < 22
          ? "Good evening"
          : "Good night";
  return `${partOfDay}, ${name}`;
}
function renderConnectedAccount() {
  const email =
    liveProfile?.email || window.CryptoWiseAuth?.currentUser?.()?.email || "";
  const firebaseName =
    window.CryptoWiseAuth?.currentUser?.()?.displayName || "";
  const displayName =
    liveProfile?.displayName ||
    firebaseName ||
    email.split("@")[0] ||
    "Customer";
  const username = liveProfile?.username || "";
  const profileName = document.querySelector(".profile-text b");
  if (profileName) profileName.textContent = displayName;
  const usernameLabel = document.querySelector(
    ".profile-text [data-profile-username]",
  );
  if (usernameLabel)
    usernameLabel.textContent = username
      ? `@${username}`
      : "Creating username…";
  const usernameField = document.querySelector("[data-profile-username-field]");
  if (usernameField) usernameField.value = username ? `@${username}` : "";
  const customerNumberField = document.querySelector(
    "[data-profile-customer-number]",
  );
  if (customerNumberField)
    customerNumberField.value = liveProfile?.customerNumber || "";
  const realId = document.querySelector('[data-account-number="real"]');
  if (realId) realId.textContent = `${liveProfile?.customerNumber || "Account ID unavailable"} · Real account`;
  const demoId = document.querySelector('[data-account-number="demo"]');
  if (demoId) demoId.textContent = `${liveProfile?.customerNumber ? "DEMO-" + liveProfile.customerNumber.replace(/^CW-/, "") : "Demo account"} · Virtual only`;
  const realBalance = document.querySelector('[data-account-balance="real"]');
  const liveUsdtExact = liveWallet ? atomicDisplay(liveWallet.availableAtomic?.USDT, 6, 6) : null;
  setAccountBalance(realBalance, liveUsdtExact === null ? "Unavailable" : compactAmount(liveUsdtExact), " USDT · live", liveUsdtExact);
  const demoBalance = document.querySelector('[data-account-balance="demo"]');
  const demoUsdtExact = liveWallet?.demo ? atomicDisplay(liveWallet.demo.availableAtomic?.USDT, 6, 6) : "10000.00";
  setAccountBalance(demoBalance, compactAmount(demoUsdtExact), " USDT · virtual", demoUsdtExact);
  const demoNote = document.getElementById("tradeModeNote");
  if (demoNote) demoNote.textContent = `Practice account ${liveProfile?.customerNumber ? "DEMO-" + liveProfile.customerNumber.replace(/^CW-/, "") : "· virtual balance"} · ${compactAmount(demoUsdtExact)} USDT`;
  const tradeAccount = document.getElementById("tradeAccountNumber");
  if (tradeAccount) tradeAccount.textContent = liveProfile?.customerNumber ? `Practice account: DEMO-${liveProfile.customerNumber.replace(/^CW-/, "")}` : "Practice account · virtual only";
  const avatar = document.querySelector(".profile-avatar");
  if (avatar)
    avatar.textContent =
      displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "CW";
  const greeting = document.querySelector("#pageContent .page-heading h1");
  if (currentPage === "overview" && greeting)
    greeting.textContent = getTimeGreeting(displayName);
  const nameParts = displayName.trim().split(/\s+/);
  const firstName = document.querySelector("[data-profile-first]");
  const lastName = document.querySelector("[data-profile-last]");
  const emailField = document.querySelector("[data-profile-email]");
  if (firstName) firstName.value = nameParts.shift() || "";
  if (lastName) lastName.value = nameParts.join(" ");
  if (emailField) emailField.value = email;

  const metricValues = document.querySelectorAll(
    "#pageContent .metric-card .metric-value",
  );
  metricValues.forEach((x) => (x.textContent = "—"));
  document
    .querySelectorAll("#pageContent .metric-card .metric-foot")
    .forEach(
      (x) =>
        (x.textContent =
          "Not available: trusted market pricing is not connected."),
    );

  const assetPanel = document.querySelector(
    ".overview-grid .panel:nth-child(2) .asset-list",
  );
  if (assetPanel) {
    assetPanel.querySelectorAll(".asset-line").forEach((row) => {
      const symbol = row
        .querySelector(".asset-name small")
        ?.textContent?.trim();
      if (!["ETH", "USDT"].includes(symbol)) {
        row.remove();
        return;
      }
      row.querySelector(".asset-holding b").textContent =
        `${atomicDisplay(liveWallet.availableAtomic?.[symbol], symbol === "ETH" ? 18 : 6)} ${symbol}`;
      row.querySelector(".asset-holding small").textContent =
        "Available balance";
      row.querySelector(".asset-change").textContent = "USD value unavailable";
    });
  }

  document.querySelectorAll(".wallet-grid .panel").forEach((panel) => {
    const label = panel.querySelector(".wallet-asset small")?.textContent || "";
    const asset = ["ETH", "USDT"].find((x) => label.includes(x));
    if (!asset) return;
    panel.querySelector(".wallet-balance").textContent =
      `${atomicDisplay(liveWallet.availableAtomic?.[asset], asset === "ETH" ? 18 : 6)} ${asset}`;
    panel.querySelector(".wallet-equivalent").textContent =
      "USD value unavailable until a trusted price feed is connected.";
  });

  const entries = liveWallet.transactions || [];
  document
    .querySelectorAll(".activity-table tbody,.admin-table tbody")
    .forEach((body) => {
      body.replaceChildren();
      if (!entries.length) {
        const row = document.createElement("tr"),
          cell = document.createElement("td");
        cell.colSpan = 5;
        cell.textContent = "No account transactions yet.";
        row.append(cell);
        body.append(row);
        return;
      }
      entries.forEach((entry) => {
        const row = document.createElement("tr");
        const cells = [
          entry.kind || "Transaction",
          `${atomicDisplay(entry.amountAtomic, entry.asset === "ETH" ? 18 : 6)} ${entry.asset || ""}`,
          entry.asset || "—",
          entry.kind?.includes("hold") ? "Reserved" : "Posted",
          entry.createdAt?.seconds
            ? new Date(entry.createdAt.seconds * 1000).toLocaleString()
            : "—",
        ];
        cells.forEach((value) => {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.append(cell);
        });
        body.append(row);
      });
    });
}

function localTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

async function loadUserPreferences() {
  const currency = document.getElementById("displayCurrency");
  const timezone = document.getElementById("accountTimeZone");
  if (timezone) timezone.value = localTimeZone();
  if (!window.CryptoWiseAPI?.preferences) return;
  try {
    const result = await window.CryptoWiseAPI.preferences();
    if (currency && result.preferences?.displayCurrency) {
      currency.value = result.preferences.displayCurrency;
    }
    const emailNotifications = document.getElementById(
      "emailNotificationPreference",
    );
    const productNotifications = document.getElementById(
      "productNotificationPreference",
    );
    if (emailNotifications)
      emailNotifications.checked =
        result.preferences?.notifications?.email ?? true;
    if (productNotifications)
      productNotifications.checked =
        result.preferences?.notifications?.product ?? true;
  } catch (error) {
    toast(error.message || "Could not load your preferences.");
  }
}

async function saveUserPreferences() {
  const currency = document.getElementById("displayCurrency")?.value || "USD";
  const timeZone = localTimeZone();
  const payload = {
    displayCurrency: currency,
    timeZone,
    notifications: {
      email:
        document.getElementById("emailNotificationPreference")?.checked ?? true,
      product:
        document.getElementById("productNotificationPreference")?.checked ??
        true,
    },
  };
  try {
    await window.CryptoWiseAPI.savePreferences(payload);
    toast("Preferences saved to your account.");
  } catch (error) {
    toast(error.message || "Could not save your preferences.");
  }
}

async function loadUserNotifications() {
  const host = document.getElementById("notificationsList");
  if (host) host.textContent = "Loading your notifications…";
  try {
    const result = await window.CryptoWiseAPI.notifications();
    const items = result.notifications || [];
    const unreadCount = items.filter((item) => !item.readAt).length;
    const bell = document.querySelector('[data-action="open-notifications"]');
    let badge = bell?.querySelector("[data-unread-count]");
    if (bell && unreadCount > 0) {
      if (!badge) { badge = document.createElement("span"); badge.dataset.unreadCount = "true"; badge.className = "notification-count"; bell.append(badge); }
      badge.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
      bell.setAttribute("aria-label", `${unreadCount} unread notifications`);
    } else {
      badge?.remove();
      bell?.setAttribute("aria-label", "Notifications");
    }
    if (!host) return;
    host.replaceChildren();
    if (!items.length) {
      host.textContent = "You have no notifications yet.";
      return;
    }
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = `notification-item ${item.readAt ? "" : "unread"}`;
      const title = document.createElement("strong");
      title.textContent = item.title || item.type || "CryptoWise notification";
      const message = document.createElement("p");
      message.textContent = item.message || item.body || "";
      const date = document.createElement("small");
      date.textContent = depositDate(item.createdAt);
      card.append(title, message, date);
      if (!item.readAt) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Mark as read";
        button.dataset.markNotification = item.id;
        card.append(button);
      }
      host.append(card);
    });
  } catch (error) {
    if (host) host.textContent = error.message || "Could not load notifications.";
  }
}

async function markAllNotificationsRead() {
  try {
    const result = await window.CryptoWiseAPI.notifications();
    const unread = (result.notifications || []).filter((item) => !item.readAt);
    await Promise.all(
      unread.map((item) => window.CryptoWiseAPI.markNotificationRead(item.id)),
    );
    await loadUserNotifications();
    toast("Notifications marked as read.");
  } catch (error) {
    toast(error.message || "Could not update notifications.");
  }
}

async function connectCustomerApi() {
  const badge = document.querySelector(".demo-indicator");
  try {
    const health = await window.CryptoWiseAPI.health();
    if (badge) {
      const liveOperationsFlag = health.fundsEnabled === true || health.tradingEnabled === true;
      badge.textContent = health.status !== "ok"
        ? "API unavailable"
        : liveOperationsFlag
          ? "API online · live flags need review"
          : "API connected · preview only";
      if (liveOperationsFlag) {
        badge.setAttribute("title", "The API reports live funds or trading enabled. This frontend keeps customer actions blocked pending verification.");
      }
    }
  } catch {
    if (badge) badge.textContent = "API offline · preview";
  }

  const connect = async (auth) => {
    if (!auth?.configured) return;
    const firebaseUser = auth.currentUser?.() || (await auth.waitForUser());
    if (!firebaseUser) return;
    // Render the user's identity and local-time greeting immediately after Firebase login,
    // even if the backend API is still waking up or temporarily unavailable.
    liveProfile = {
      displayName: firebaseUser?.displayName || null,
      email: firebaseUser?.email || null,
    };
    renderConnectedAccount();
    try {
      window.CryptoWiseAPI.setTokenProvider(auth.getIdToken);
      const profile = await window.CryptoWiseAPI.me();
      liveProfile = {
        ...profile,
        displayName: firebaseUser?.displayName || profile.displayName || null,
        email: firebaseUser?.email || profile.email || null,
        username: profile.username || null,
        customerNumber: profile.customerNumber || null,
      };
      renderConnectedAccount();
      try {
        liveWallet = await window.CryptoWiseAPI.wallet();
        renderConnectedAccount();
      } catch (walletError) {
        if (badge) badge.textContent = "Profile connected · wallet unavailable";
        console.warn("CryptoWise wallet request failed:", walletError.message);
      }
      if (currentPage === "deposit") loadDepositPage();
      await loadUserNotifications();
      if (currentPage === "settings") loadUserPreferences();
    } catch (error) {
      if (badge) badge.textContent = "API error · preview";
      console.warn("CryptoWise API request failed:", error.message);
    }
  };

  if (window.CryptoWiseAuthReady) connect(await window.CryptoWiseAuthReady);
  else
    window.addEventListener(
      "cryptowise-auth-ready",
      () => connect(window.CryptoWiseAuth),
      { once: true },
    );
}

connectCustomerApi();

document.addEventListener("click", (e) => {
  if (e.target.closest("[data-sign-out]")) {
    e.preventDefault();
    Promise.resolve(window.CryptoWiseAuthReady)
      .then((auth) => auth?.signOut())
      .finally(() => window.location.replace("index.html"));
  }
});

// ==========================================
// 6. DEPOSIT MANAGEMENT & API HANDLERS
// ==========================================

function depositDate(value) {
  if (!value) return "—";
  if (typeof value.toDate === "function")
    return value.toDate().toLocaleString();
  const seconds = value.seconds ?? value._seconds;
  if (typeof seconds === "number")
    return new Date(seconds * 1000).toLocaleString();
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "—" : date.toLocaleString();
}

function updateDepositAssetDisplay() {
  const note = document.getElementById("depositNetworkNote");
  const address = document.getElementById("depositAddress");
  const details = document.getElementById("depositAssetDetails");
  const form = document.getElementById("depositRequestForm");
  const copy = document.getElementById("copyDepositAddress");
  const badge = document.getElementById("depositAvailability");
  const select = document.getElementById("depositAsset");

  if (!note || !address || !details || !form || !select) return;

  const asset = (liveDepositInstructions?.assets || []).find(
    (x) => x.asset === select.value,
  );
  const addressConfigured = !!asset?.address;
  const enabled = customerDepositUiReleased && liveDepositInstructions?.enabled === true && addressConfigured;

  note.textContent = enabled
    ? (liveDepositInstructions?.notice || "Deposits are available.")
    : addressConfigured
      ? (liveDepositInstructions?.notice || "An address is configured, but deposits are paused. Do not send funds; transfers are not monitored or credited.")
      : "Deposits are paused and no receiving address is configured.";
  address.textContent = addressConfigured ? asset.address : "No configured receiving address";
  details.textContent = addressConfigured
    ? `${asset.asset} · ${liveDepositInstructions.network} · ${asset.tokenContract ? "Token contract: " + asset.tokenContract : "Native asset"}${enabled ? " · Active" : " · DISPLAY ONLY — deposits paused; no automatic monitoring or crediting"}`
    : "No receiving address is configured for this asset. Do not send funds.";
  form.hidden = !enabled;
  if (copy) copy.hidden = !addressConfigured;
  if (badge) {
    badge.textContent = enabled ? "Available" : addressConfigured ? "Configured · paused" : "Paused";
    badge.className = `status ${enabled ? "" : "pending"}`;
  }
}

function renderDepositRequests(requests) {
  const host = document.getElementById("depositRequestsList");
  if (!host) return;
  host.replaceChildren();

  if (!requests?.length) {
    host.textContent = "No deposit requests yet.";
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = "table-wrap";
  const table = document.createElement("table");
  table.className = "activity-table";

  const thead = document.createElement("thead"),
    head = document.createElement("tr");
  ["ASSET", "TRANSACTION HASH", "STATUS", "UPDATED"].forEach((label) => {
    const th = document.createElement("th");
    th.textContent = label;
    head.append(th);
  });
  thead.append(head);
  table.append(thead);

  const body = document.createElement("tbody");
  requests.forEach((request) => {
    const row = document.createElement("tr");
    const values = [
      request.asset || "—",
      request.txHash || "—",
      request.status || "—",
      depositDate(request.updatedAt),
    ];
    values.forEach((value, index) => {
      const cell = document.createElement("td");
      cell.textContent =
        index === 1 && String(value).length > 18
          ? `${String(value).slice(0, 10)}…${String(value).slice(-8)}`
          : String(value);
      row.append(cell);
    });
    body.append(row);
  });

  table.append(body);
  wrap.append(table);
  host.append(wrap);
}

async function loadDepositPage() {
  const note = document.getElementById("depositNetworkNote");
  const list = document.getElementById("depositRequestsList");
  if (!note || !window.CryptoWiseAPI) return;
  if (!liveProfile) {
    note.textContent = "Sign in to load deposit availability.";
    if (list) list.textContent = "Sign in to load your deposit requests.";
    return;
  }
  try {
    const [instructions, history] = await Promise.all([
      window.CryptoWiseAPI.depositInstructions(),
      window.CryptoWiseAPI.depositRequests(),
    ]);
    liveDepositInstructions = instructions;
    updateDepositAssetDisplay();
    renderDepositRequests(history.requests || []);
  } catch (error) {
    liveDepositInstructions = null;
    updateDepositAssetDisplay();
    note.textContent = `Could not load verified deposit instructions: ${error.message}.`;
    if (list)
      list.textContent = "Deposit request history is temporarily unavailable.";
  }
}

document.addEventListener("submit", async (event) => {
  if (!event.target.matches("#demoTradeForm")) return;
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector("button[type=submit]");
  const message = document.getElementById("demoTradeMessage");
  const amountUsd = document.getElementById("demoTradeAmount")?.value;
  const side = document.getElementById("demoTradeSide")?.value || "buy";
  const mode = document.getElementById("demoTradeMode")?.value || "demo";
  if (mode !== "demo") { if (message) message.textContent = "Live trading is not enabled. Your demo order was not submitted."; return; }
  if (!window.CryptoWiseAPI?.trade) { if (message) message.textContent = "Trading API is not loaded."; return; }
  button.disabled = true;
  if (message) message.textContent = "Submitting demo order…";
  try {
    const result = await window.CryptoWiseAPI.trade({ mode, side, baseAsset: "ETH", quoteAsset: "USDT", amountUsd }, crypto.randomUUID());
    if (message) message.textContent = `Demo ${result.trade.side} order filled: ${Number(result.trade.amountUsd).toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT at ${Number(result.trade.price).toLocaleString("en-US", { maximumFractionDigits: 2 })} USDT/ETH. No real assets were traded.`;
    toast("Demo order filled. Your virtual wallet was updated.");
    liveWallet = await window.CryptoWiseAPI.wallet();
    renderConnectedAccount();
    await loadUserNotifications();
  } catch (error) { if (message) message.textContent = error.message || "Demo order failed."; }
  finally { button.disabled = false; }
});
document.addEventListener("change", (event) => {
  if (event.target.matches("#depositAsset")) updateDepositAssetDisplay();
});

document.addEventListener("submit", async (event) => {
  if (!event.target.matches("#depositRequestForm")) return;
  event.preventDefault();
  const form = event.target,
    button = form.querySelector("button[type=submit]");
  if (!customerDepositUiReleased || !liveDepositInstructions?.enabled) {
    toast("Deposits are paused; no request was submitted.");
    return;
  }
  button.disabled = true;
  try {
    const txHash = document.getElementById("depositTxHash").value.trim();
    const result = await window.CryptoWiseAPI.createDepositRequest({
      asset: document.getElementById("depositAsset").value,
      txHash,
      network: "ethereum",
    });
    toast(result.message || "Deposit request submitted for tracking.");
    form.reset();
    await loadDepositPage();
  } catch (error) {
    toast(error.message || "Deposit request could not be submitted.");
  } finally {
    button.disabled = false;
  }
});

document.addEventListener("click", async (event) => {
  const button = event.target.closest("#copyDepositAddress");
  if (!button) return;
  const value = document.getElementById("depositAddress")?.textContent || "";
  if (!value || value === "No active receiving address") return;
  try {
    await navigator.clipboard.writeText(value);
    toast("Receiving address copied. Verify it carefully before sending.");
  } catch {
    toast("Could not copy the address.");
  }
});
