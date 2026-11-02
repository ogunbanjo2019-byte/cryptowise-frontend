'use strict';

(() => {
  const pairPrices = {
    'BTC/USD': 67432.21,
    'ETH/USD': 3245.67,
    'ETH/USDT': 3245.67,
    'BTC/USDT': 67432.21,
    'SOL/USD': 142.36,
    'SOL/USDT': 142.36,
    'BNB/USD': 580.12,
    'BNB/USDT': 580.12,
  };
  let promoShown = false;

  const promoCopy = 'Welcome offer preview only: up to 3× deposit match. This offer is not active and no bonus is credited. Eligibility, caps, and terms require review.';

  function enhance() {
    const content = document.getElementById('pageContent');
    if (!content) return;

    // Existing portfolio market rows get an explicit path into the demo ticket.
    if (content.querySelector('.asset-list') && !content.querySelector('[data-demo-market-trade]')) {
      content.querySelectorAll('.asset-list .asset-line').forEach((row) => {
        const symbol = row.querySelector('.asset-name small')?.textContent?.trim()?.split('/')[0];
        if (!symbol || !['BTC', 'ETH', 'SOL', 'BNB'].includes(symbol)) return;
        const button = document.createElement('button');
        button.className = 'btn btn-secondary demo-market-trade';
        button.type = 'button';
        button.dataset.demoMarketTrade = symbol;
        button.textContent = 'Trade';
        row.append(button);
      });
    }

    if (content.querySelector('#tradeChart') && !content.querySelector('#demoPairSelect')) {
      const title = content.querySelector('.trade-grid .chart-panel .panel-title h2');
      if (title) {
        const select = document.createElement('select');
        select.id = 'demoPairSelect';
        select.className = 'demo-pair-select';
        select.setAttribute('aria-label', 'Select trading pair');
        ['BTC/USD', 'ETH/USD', 'ETH/USDT', 'BTC/USDT', 'SOL/USD', 'SOL/USDT', 'BNB/USD', 'BNB/USDT'].forEach((pair) => {
          const option = document.createElement('option');
          option.value = pair;
          option.textContent = pair;
          option.selected = pair === 'ETH/USDT';
          select.append(option);
        });
        title.replaceWith(select);
        const legend = content.querySelector('.trade-grid .chart-panel .chart-legend');
        if (legend) legend.dataset.demoPrice = 'true';
      }

      const amountLabel = [...content.querySelectorAll('.trade-grid .form-field label')].find((label) => label.textContent.trim() === 'Amount');
      const amountField = amountLabel?.parentElement;
      const amountInput = amountField?.querySelector('input');
      if (amountField && amountInput && !amountField.querySelector('.demo-amount-prefix')) {
        amountInput.type = 'number';
        amountInput.min = '100';
        amountInput.max = '100000000';
        amountInput.step = '0.01';
        amountInput.placeholder = '100.00';
        amountInput.setAttribute('aria-label', 'Demo trade amount in USD');
        const wrap = document.createElement('div');
        wrap.className = 'demo-usd-input';
        const prefix = document.createElement('span');
        prefix.className = 'demo-amount-prefix';
        prefix.textContent = 'USD';
        amountInput.parentElement.insertBefore(wrap, amountInput);
        wrap.append(prefix, amountInput);
        const hint = document.createElement('small');
        hint.className = 'demo-limit-hint';
        hint.textContent = 'Demo order range: $100.00–$100,000,000.00';
        amountField.append(hint);
      }

      const orderButton = content.querySelector('.trade-grid [data-action="notify"]');
      if (orderButton && orderButton.textContent.toLowerCase().includes('preview order')) {
        orderButton.removeAttribute('data-action');
        orderButton.dataset.demoOrder = 'true';
        orderButton.textContent = 'Preview demo trade';
      }
    }

    // The Add funds destination offers the requested amount entry while intake stays paused.
    const depositAsset = content.querySelector('#depositAsset');
    if (depositAsset && !content.querySelector('#demoDepositAmount')) {
      const field = document.createElement('div');
      field.className = 'form-field demo-deposit-amount-field';
      field.style.marginTop = '12px';
      field.innerHTML = '<label for="demoDepositAmount">Amount</label><div class="demo-usd-input"><span class="demo-amount-prefix">USD</span><input id="demoDepositAmount" type="number" min="100" max="100000000" step="0.01" placeholder="100.00" aria-describedby="demoDepositAmountHint" disabled></div><small class="demo-limit-hint" id="demoDepositAmountHint">Minimum $100.00 · maximum $100,000,000.00. Deposits are paused; this amount is not submitted.</small>';
      depositAsset.closest('.form-field')?.after(field);
    }

    // Clarify that the requested promotional copy is a non-active placeholder.
    content.querySelectorAll('.heading-actions .btn-primary').forEach((button) => {
      if (button.textContent.toLowerCase().includes('add funds') && !button.querySelector('.demo-offer-tag')) {
        button.dataset.pageLink = 'deposit';
        const tag = document.createElement('span');
        tag.className = 'demo-offer-tag';
        tag.textContent = 'Offer preview';
        button.append(' ', tag);
      }
    });

    // Show the requested 2×/3× style only as a non-active illustrative offer.
    content.querySelectorAll('.metric-card').forEach((card) => {
      const label = card.querySelector('.metric-label')?.textContent || '';
      if (/balance/i.test(label) && !card.querySelector('.demo-deposit-offer')) {
        const note = document.createElement('small');
        note.className = 'demo-deposit-offer';
        note.textContent = 'Deposit match up to 3× · preview only, not active';
        card.append(note);
      }
    });

    // Withdrawals are not enabled; show requested threshold without implying availability.
    content.querySelectorAll('.wallet-actions').forEach((actions) => {
      actions.querySelectorAll('button').forEach((button) => {
        if (/withdraw/i.test(button.textContent) && !button.dataset.minimumAdded) {
          button.dataset.minimumAdded = 'true';
          const hint = document.createElement('small');
          hint.className = 'demo-withdraw-hint';
          hint.textContent = 'Minimum withdrawal: $3,000 · withdrawals not enabled in preview';
          actions.append(hint);
        }
      });
    });

    const offerPage = content.querySelector('.deposit-callout');
    if (offerPage && !offerPage.dataset.demoCopyUpdated) {
      offerPage.dataset.demoCopyUpdated = 'true';
      const p = offerPage.querySelector('p');
      if (p) p.textContent = promoCopy;
      const button = offerPage.querySelector('button');
      if (button && !button.querySelector('.demo-offer-tag')) {
        const tag = document.createElement('span');
        tag.className = 'demo-offer-tag';
        tag.textContent = 'Preview';
        button.append(' ', tag);
      }
    }
  }

  function showOfferPopup() {
    if (promoShown || sessionStorage.getItem('cwWelcomeOfferSeen')) return;
    promoShown = true;
    sessionStorage.setItem('cwWelcomeOfferSeen', '1');
    const overlay = document.createElement('div');
    overlay.className = 'demo-offer-overlay';
    overlay.setAttribute('role', 'presentation');
    overlay.innerHTML = '<section class="demo-offer-dialog" role="dialog" aria-modal="true" aria-labelledby="demoOfferTitle"><button class="demo-offer-close" type="button" aria-label="Close">×</button><span class="demo-offer-eyebrow">WELCOME OFFER · PREVIEW</span><h2 id="demoOfferTitle">A welcome offer is in preview</h2><p>Illustrative offer: deposit and get up to 3×. <strong>This promotion is not active, no bonus is credited, and deposits are paused.</strong> Eligibility, caps, withdrawal conditions, and official terms must be published before launch.</p><button class="btn btn-primary demo-offer-dismiss" type="button">Got it</button></section>';
    document.body.append(overlay);
    const close = () => overlay.remove();
    overlay.querySelectorAll('.demo-offer-close, .demo-offer-dismiss').forEach((button) => button.addEventListener('click', close));
    overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
  }

  function updateChart(pair) {
    const legend = document.querySelector('#pageContent .trade-grid .chart-legend');
    if (!legend) return;
    const price = pairPrices[pair] || 1;
    legend.textContent = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · sample price`;
    const canvas = document.getElementById('tradeChart');
    if (canvas) {
      const values = Array.from({ length: 40 }, (_, i) => price * (0.965 + (i / 39) * 0.035 + Math.sin(i * 0.72) * 0.009));
      const w = canvas.clientWidth, h = canvas.clientHeight, dpr = window.devicePixelRatio || 1;
      if (!w || !h) return;
      canvas.width = w * dpr; canvas.height = h * dpr;
      const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, i * h / 3); ctx.lineTo(w, i * h / 3); ctx.strokeStyle = 'rgba(210,239,228,.07)'; ctx.stroke(); }
      const min = Math.min(...values) * .995, max = Math.max(...values) * 1.005;
      ctx.beginPath(); values.forEach((value, i) => { const x = i / (values.length - 1) * w, y = h - 8 - (value - min) / (max - min) * (h - 18); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      const gradient = ctx.createLinearGradient(0, 0, 0, h); gradient.addColorStop(0, 'rgba(23,204,149,.27)'); gradient.addColorStop(1, 'rgba(23,204,149,0)'); ctx.fillStyle = gradient; ctx.fill();
      ctx.beginPath(); values.forEach((value, i) => { const x = i / (values.length - 1) * w, y = h - 8 - (value - min) / (max - min) * (h - 18); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.strokeStyle = '#24d09b'; ctx.lineWidth = 2; ctx.stroke();
    }
  }

  document.addEventListener('change', (event) => {
    if (event.target.id === 'demoPairSelect') updateChart(event.target.value);
  });

  document.addEventListener('click', (event) => {
    const trade = event.target.closest('[data-demo-market-trade]');
    if (trade) {
      if (typeof window.navigate === 'function') window.navigate('trade');
      else document.querySelector('[data-page="trade"]')?.click();
      setTimeout(() => {
        const select = document.getElementById('demoPairSelect');
        if (select) {
          const pair = `${trade.dataset.demoMarketTrade}/USD`;
          if ([...select.options].some((option) => option.value === pair)) select.value = pair;
          updateChart(select.value);
        }
      }, 30);
      return;
    }
    if (event.target.closest('[data-demo-order]')) {
      event.preventDefault();
      const input = document.querySelector('.trade-grid .demo-usd-input input');
      const amount = Number(input?.value);
      if (!Number.isFinite(amount) || amount < 100 || amount > 100000000) {
        input?.focus();
        window.alert('Enter a demo amount between $100.00 and $100,000,000.00.');
        return;
      }
      const pair = document.getElementById('demoPairSelect')?.value || 'ETH/USDT';
      window.alert(`Demo only: ${document.querySelector('[data-tab].active')?.textContent || 'Buy'} ${pair} order preview for $${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. No real trade was placed.`);
      return;
    }
  });

  const observer = new MutationObserver((records) => {
    enhance();
    const registrationSucceeded = records.some((record) => [...record.addedNodes].some((node) => /account created successfully/i.test(node.textContent || '')));
    if (registrationSucceeded || window.CryptoWiseAuth?.isSignedIn?.()) showOfferPopup();
  });
  observer.observe(document.getElementById('pageContent') || document.body, { childList: true, subtree: true });
  document.addEventListener('cryptowise-auth-ready', () => {
    if (window.CryptoWiseAuth?.isSignedIn?.()) showOfferPopup();
  });
  const originalPushState = history.pushState;
  // Auth state is checked once the account/profile connects, and once after initial render.
  const accountPoll = setInterval(() => {
    if (window.CryptoWiseAuth?.isSignedIn?.()) {
      showOfferPopup();
      clearInterval(accountPoll);
    }
  }, 750);
  setTimeout(() => clearInterval(accountPoll), 15000);
  enhance();
})();

// Add a requested amount field to the deposit destination without enabling intake.
