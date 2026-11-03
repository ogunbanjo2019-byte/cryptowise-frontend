(() => {
  "use strict";

  // Prevent duplicate initialization if this file is accidentally included twice.
  if (window.__cryptoWiseLandingInitialized) return;
  window.__cryptoWiseLandingInitialized = true;

  function initializeLandingPage() {
    const marketData = [
      { symbol: "BTC", name: "Bitcoin", icon: "₿", className: "coin-btc", price: "$67,432.21", change: "+2.34%", cap: "$1.32T", trend: [6, 9, 7, 13, 11, 18, 15, 21, 19, 24, 22, 27, 24, 31, 29, 35, 32, 38, 36, 42] },
      { symbol: "ETH", name: "Ethereum", icon: "◆", className: "coin-eth", price: "$3,245.67", change: "+1.18%", cap: "$389B", trend: [18, 15, 18, 16, 22, 20, 24, 19, 25, 22, 28, 26, 30, 27, 34, 30, 35, 33, 40, 39] },
      { symbol: "USDT", name: "Tether", icon: "₮", className: "coin-usdt", price: "$1.00", change: "+0.01%", cap: "$108B", trend: [20, 19, 21, 20, 20, 22, 21, 21, 20, 22, 21, 23, 21, 22, 21, 22, 21, 24, 22, 23] },
      { symbol: "BNB", name: "BNB", icon: "◆", className: "coin-bnb", price: "$580.12", change: "+1.76%", cap: "$85B", trend: [8, 11, 10, 14, 12, 12, 18, 15, 22, 20, 21, 18, 25, 23, 29, 26, 28, 33, 30, 37] },
      { symbol: "SOL", name: "Solana", icon: "≋", className: "coin-sol", price: "$142.36", change: "+4.09%", cap: "$62B", trend: [6, 8, 7, 12, 10, 17, 12, 19, 16, 24, 22, 20, 28, 26, 33, 29, 37, 35, 41, 46] },
    ];

    const byId = (id) => document.getElementById(id);
    const select = (selector) => document.querySelector(selector);
    const listen = (element, eventName, handler) => {
      element?.addEventListener(eventName, handler);
    };

    function drawSparkline(canvas, values) {
      if (!canvas || !values?.length) return;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.scale(dpr, dpr);

      const low = Math.min(...values);
      const high = Math.max(...values);
      const span = high - low || 1;
      context.beginPath();
      values.forEach((value, index) => {
        const x = (index / (values.length - 1)) * width;
        const y = height - 3 - ((value - low) / span) * (height - 7);
        if (index) context.lineTo(x, y);
        else context.moveTo(x, y);
      });
      context.strokeStyle = "#28cd98";
      context.lineWidth = 1.6;
      context.stroke();
    }

    function renderMarkets() {
      const container = byId("coinRows");
      if (!container) return;

      container.innerHTML = marketData.map((coin, index) => `
        <div class="coin-row">
          <div class="coin-info">
            <i class="coin ${coin.className}">${coin.icon}</i>
            <div><b>${coin.name}</b><small>${coin.symbol}</small></div>
          </div>
          <strong>${coin.price}</strong>
          <span class="positive">${coin.change}</span>
          <span>${coin.cap}</span>
          <canvas class="sparkline" data-index="${index}" aria-label="${coin.name} seven-day price chart"></canvas>
          <button class="table-trade" type="button" data-trade="${coin.symbol}">Trade</button>
        </div>
      `).join("");

      container.querySelectorAll(".sparkline").forEach((canvas) => {
        const coin = marketData[Number(canvas.dataset.index)];
        if (coin) drawSparkline(canvas, coin.trend);
      });
    }

    function drawHeroChart() {
      const canvas = byId("heroChart");
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.scale(dpr, dpr);

      const values = [34, 30, 37, 33, 38, 35, 46, 40, 44, 41, 54, 49, 57, 52, 63, 58, 62, 56, 72, 64, 70, 65, 78, 71, 83, 77, 91, 86, 100, 94, 107, 101, 116, 108, 124, 119, 132];
      const minimum = 25;
      const maximum = 138;
      const pointY = (value) => height - 7 - ((value - minimum) / (maximum - minimum)) * (height - 16);

      for (let index = 0; index < 4; index += 1) {
        const y = (index * height) / 3;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.strokeStyle = "rgba(193,226,218,.07)";
        context.lineWidth = 1;
        context.stroke();
      }

      context.beginPath();
      values.forEach((value, index) => {
        const x = (index / (values.length - 1)) * width;
        if (index) context.lineTo(x, pointY(value));
        else context.moveTo(x, pointY(value));
      });
      context.lineTo(width, height);
      context.lineTo(0, height);
      context.closePath();

      const gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(22,206,151,.32)");
      gradient.addColorStop(1, "rgba(22,206,151,0)");
      context.fillStyle = gradient;
      context.fill();

      context.beginPath();
      values.forEach((value, index) => {
        const x = (index / (values.length - 1)) * width;
        if (index) context.lineTo(x, pointY(value));
        else context.moveTo(x, pointY(value));
      });
      context.strokeStyle = "#22d29b";
      context.lineWidth = 2;
      context.lineJoin = "round";
      context.stroke();

      const markerX = width * 0.86;
      const markerY = pointY(values[values.length - 5]);
      context.beginPath();
      context.arc(markerX, markerY, 3.3, 0, Math.PI * 2);
      context.fillStyle = "#a4ffdc";
      context.fill();
      context.beginPath();
      context.arc(markerX, markerY, 6.3, 0, Math.PI * 2);
      context.strokeStyle = "rgba(109,255,196,.35)";
      context.lineWidth = 1;
      context.stroke();
    }

    renderMarkets();
    drawHeroChart();

    let resizeTimer;
    listen(window, "resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        renderMarkets();
        drawHeroChart();
      }, 120);
    });

    const modal = byId("authModal");
    const form = byId("authForm");
    let isLogin = false;

    function setMode(login) {
      isLogin = login;
      const title = byId("modalTitle");
      const nameLabel = byId("nameLabel");
      const nameField = byId("nameField");
      const passwordField = byId("passwordField");
      const submit = byId("submitLabel");
      const switchCopy = byId("switchCopy");
      const switchMode = byId("switchMode");
      const message = byId("formMessage");

      if (title) title.textContent = login ? "Welcome back" : "Create your account";
      if (nameLabel) nameLabel.hidden = login;
      if (nameField) {
        nameField.hidden = login;
        nameField.required = !login;
      }
      if (passwordField) {
        passwordField.autocomplete = login ? "current-password" : "new-password";
        passwordField.placeholder = login ? "Your password" : "At least 8 characters";
      }
      if (submit) submit.innerHTML = login ? "Log in <span>↗</span>" : "Create account <span>↗</span>";
      if (switchCopy) switchCopy.textContent = login ? "New to CryptoWise?" : "Already have an account?";
      if (switchMode) switchMode.textContent = login ? "Create an account" : "Log in";
      if (message) message.textContent = "";
    }

    function openModal(login = false) {
      if (!modal) return;
      setMode(login);
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      if (document.body) document.body.style.overflow = "hidden";
      window.setTimeout(() => byId("emailField")?.focus(), 50);
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      if (document.body) document.body.style.overflow = "";
    }

    document.querySelectorAll("[data-modal]").forEach((button) => {
      listen(button, "click", () => openModal(button.dataset.modal === "login"));
    });
    listen(select(".modal-close"), "click", closeModal);
    listen(modal, "click", (event) => {
      if (event.target === modal) closeModal();
    });
    listen(document, "keydown", (event) => {
      if (event.key === "Escape") closeModal();
    });
    listen(byId("switchMode"), "click", () => setMode(!isLogin));

    listen(form, "submit", async (event) => {
      event.preventDefault();
      const message = byId("formMessage");
      const submit = byId("submitLabel");
      if (!message || !submit) return;

      submit.disabled = true;
      message.textContent = "Connecting securely…";
      try {
        if (typeof window.CryptoWiseWaitForAuth !== "function") {
          throw new Error("Firebase authentication did not initialize. Check the Firebase script and js/config.js.");
        }
        const auth = await window.CryptoWiseWaitForAuth();
        if (!auth?.configured) {
          throw new Error("Firebase configuration is missing. Check js/config.js.");
        }

        const email = byId("emailField")?.value.trim() || "";
        const password = byId("passwordField")?.value || "";
        if (isLogin) {
          await auth.signIn(email, password);
          message.textContent = "Signed in successfully. Opening your account…";
          window.location.href = "app.html";
        } else {
          const displayName = byId("nameField")?.value.trim() || "";
          await auth.signUp({ email, password, displayName });
          setMode(true);
          const successMessage = byId("formMessage");
          if (successMessage) successMessage.textContent = "Account created. Check your email for the verification link, then sign in.";
        }
      } catch (error) {
        message.textContent = error?.message || "Authentication failed. Please try again.";
      } finally {
        submit.disabled = false;
      }
    });

    document.querySelectorAll("[data-trade]").forEach((button) => {
      listen(button, "click", () => {
        openModal(false);
        const message = byId("formMessage");
        if (message) message.textContent = `Create an account to explore ${button.dataset.trade} trading.`;
      });
    });

    listen(select(".announce-close"), "click", () => select(".announcement")?.remove());

    const mobileMenu = select(".mobile-menu");
    const nav = select(".main-nav");
    listen(mobileMenu, "click", () => {
      if (!nav) return;
      nav.classList.toggle("is-open");
      mobileMenu.setAttribute("aria-expanded", String(nav.classList.contains("is-open")));
    });
    document.querySelectorAll(".main-nav a").forEach((link) => {
      listen(link, "click", () => nav?.classList.remove("is-open"));
    });

    document.querySelectorAll(".chart-times button").forEach((button) => {
      listen(button, "click", () => {
        select(".chart-times .selected")?.classList.remove("selected");
        button.classList.add("selected");
        const canvas = byId("heroChart");
        if (!canvas) return;
        canvas.style.opacity = ".45";
        window.setTimeout(() => {
          drawHeroChart();
          canvas.style.opacity = "1";
        }, 120);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLandingPage, { once: true });
  } else {
    initializeLandingPage();
  }
})();
