'use strict';

// 1. Market Data and Sparklines
const marketData = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿', className: 'coin-btc', price: '$67,432.21', change: '+2.34%', cap: '$1.32T', trend: [6,9,7,13,11,18,15,21,19,24,22,27,24,31,29,35,32,38,36,42] },
  { symbol: 'ETH', name: 'Ethereum', icon: '◆', className: 'coin-eth', price: '$3,245.67', change: '+1.18%', cap: '$389B', trend: [18,15,18,16,22,20,24,19,25,22,28,26,30,27,34,30,35,33,40,39] },
  { symbol: 'USDT', name: 'Tether', icon: '₮', className: 'coin-usdt', price: '$1.00', change: '+0.01%', cap: '$108B', trend: [20,19,21,20,20,22,21,21,20,22,21,23,21,22,21,22,21,24,22,23] },
  { symbol: 'BNB', name: 'BNB', icon: '◆', className: 'coin-bnb', price: '$580.12', change: '+1.76%', cap: '$85B', trend: [8,11,10,14,12,12,18,15,22,20,21,18,25,23,29,26,28,33,30,37] },
  { symbol: 'SOL', name: 'Solana', icon: '≋', className: 'coin-sol', price: '$142.36', change: '+4.09%', cap: '$62B', trend: [6,8,7,12,10,17,12,19,16,24,22,20,28,26,33,29,37,35,41,46] }
];

function drawSparkline(canvas, values) {
  const dpr = window.devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const c = canvas.getContext('2d');
  c.scale(dpr, dpr);
  const lo = Math.min(...values), hi = Math.max(...values), span = hi - lo || 1;
  c.beginPath();
  values.forEach((v, i) => {
    const x = i / (values.length - 1) * w, y = h - 3 - (v - lo) / span * (h - 7);
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  });
  c.strokeStyle = '#28cd98';
  c.lineWidth = 1.6;
  c.stroke();
}

function renderMarkets() {
  const container = document.getElementById('coinRows');
  if (!container) return;
  container.innerHTML = marketData.map((coin, i) => `
    <div class="coin-row">
      <div class="coin-info">
        <i class="coin ${coin.className}">${coin.icon}</i>
        <div><b>${coin.name}</b><small>${coin.symbol}</small></div>
      </div>
      <strong>${coin.price}</strong>
      <span class="positive">${coin.change}</span>
      <span>${coin.cap}</span>
      <canvas class="sparkline" data-index="${i}" aria-label="${coin.name} seven-day price chart"></canvas>
      <button class="table-trade" data-trade="${coin.symbol}">Trade</button>
    </div>
  `).join('');
  container.querySelectorAll('.sparkline').forEach(canvas => 
    drawSparkline(canvas, marketData[Number(canvas.dataset.index)].trend)
  );
}

// 3. Hero Chart Rendering
function drawHeroChart() {
  const canvas = document.getElementById('heroChart');
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const c = canvas.getContext('2d');
  c.scale(dpr, dpr);
  
  const values = [34,30,37,33,38,35,46,40,44,41,54,49,57,52,63,58,62,56,72,64,70,65,78,71,83,77,91,86,100,94,107,101,116,108,124,119,132];
  const min = 25, max = 138;
  
  for (let i = 0; i < 4; i++) {
    const y = i * h / 3;
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(w, y);
    c.strokeStyle = 'rgba(193,226,218,.07)';
    c.lineWidth = 1;
    c.stroke();
  }
  
  c.beginPath();
  values.forEach((v, i) => {
    let x = i / (values.length - 1) * w, y = h - 7 - (v - min) / (max - min) * (h - 16);
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  });
  c.lineTo(w, h);
  c.lineTo(0, h);
  c.closePath();
  
  const gradient = c.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, 'rgba(22,206,151,.32)');
  gradient.addColorStop(1, 'rgba(22,206,151,0)');
  c.fillStyle = gradient;
  c.fill();
  
  c.beginPath();
  values.forEach((v, i) => {
    let x = i / (values.length - 1) * w, y = h - 7 - (v - min) / (max - min) * (h - 16);
    i ? c.lineTo(x, y) : c.moveTo(x, y);
  });
  c.strokeStyle = '#22d29b';
  c.lineWidth = 2;
  c.lineJoin = 'round';
  c.stroke();
  
  const x = w * .86, y = h - 7 - (values[values.length - 5] - min) / (max - min) * (h - 16);
  c.beginPath();
  c.arc(x, y, 3.3, 0, Math.PI * 2);
  c.fillStyle = '#a4ffdc';
  c.fill();
  c.beginPath();
  c.arc(x, y, 6.3, 0, Math.PI * 2);
  c.strokeStyle = 'rgba(109,255,196,.35)';
  c.lineWidth = 1;
  c.stroke();
}

renderMarkets();
drawHeroChart();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    renderMarkets();
    drawHeroChart();
  }, 120);
});

// 4. Modal and Authentication Flow
const modal = document.getElementById('authModal');
const form = document.getElementById('authForm');
let isLogin = false;

function setMode(login) {
  isLogin = login;
  document.getElementById('modalTitle').textContent = login ? 'Welcome back' : 'Create your account';
  document.getElementById('nameLabel').hidden = login;
  document.getElementById('nameField').hidden = login;
  document.getElementById('nameField').required = !login;
  document.getElementById('passwordField').autocomplete = login ? 'current-password' : 'new-password';
  document.getElementById('passwordField').placeholder = login ? 'Your password' : 'At least 8 characters';
  document.getElementById('submitLabel').innerHTML = login ? 'Log in <span>↗</span>' : 'Create account <span>↗</span>';
  document.getElementById('switchCopy').textContent = login ? 'New to CryptoWise?' : 'Already have an account?';
  document.getElementById('switchMode').textContent = login ? 'Create an account' : 'Log in';
  document.getElementById('formMessage').textContent = '';
}

document.querySelectorAll('[data-modal]').forEach(button => 
  button.addEventListener('click', () => {
    setMode(button.dataset.modal === 'login');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('emailField').focus(), 50);
  })
);

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
document.getElementById('switchMode').addEventListener('click', () => setMode(!isLogin));

// 5. Firebase Authentication Form Submit Handler
form.addEventListener('submit', async e => {
  e.preventDefault();
  const message = document.getElementById('formMessage');
  const submit = document.getElementById('submitLabel');
  submit.disabled = true;
  message.textContent = 'Connecting securely…';
  
  try {
    const auth = await window.CryptoWiseWaitForAuth();
    if (!auth?.configured) {
      throw new Error('Firebase configuration is missing. Check js/config.js.');
    }

    const email = document.getElementById('emailField').value.trim();
    const password = document.getElementById('passwordField').value;

    if (isLogin) {
      await auth.signIn(email, password);
      message.textContent = 'Signed in successfully. Opening your account…';
      window.location.href = 'app.html';
    } else {
      const displayName = document.getElementById('nameField').value.trim();
      await auth.signUp({ email, password, displayName });
      setMode(true);
      message.textContent = 'Account created. Check your email for the verification link, then sign in.';
    }
  } catch (error) {
    message.textContent = error.message || 'Authentication failed. Please try again.';
  } finally {
    submit.disabled = false;
  }
});

// 6. General UI Event Listeners
document.querySelectorAll('[data-trade]').forEach(button => 
  button.addEventListener('click', () => {
    setMode(false);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('formMessage').textContent = `Create an account to explore ${button.dataset.trade} trading.`;
  })
);

document.querySelector('.announce-close')?.addEventListener('click', () => document.querySelector('.announcement')?.remove());

document.querySelector('.mobile-menu').addEventListener('click', () => {
  const nav = document.querySelector('.main-nav');
  nav.classList.toggle('is-open');
  document.querySelector('.mobile-menu').setAttribute('aria-expanded', nav.classList.contains('is-open'));
});

document.querySelectorAll('.main-nav a').forEach(link => 
  link.addEventListener('click', () => document.querySelector('.main-nav').classList.remove('is-open'))
);

document.querySelectorAll('.chart-times button').forEach(button => 
  button.addEventListener('click', () => {
    document.querySelector('.chart-times .selected')?.classList.remove('selected');
    button.classList.add('selected');
    const canvas = document.getElementById('heroChart');
    canvas.style.opacity = '.45';
    setTimeout(() => {
      drawHeroChart();
      canvas.style.opacity = '1';
    }, 120);
  })
);
