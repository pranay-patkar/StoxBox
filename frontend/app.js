// ══════════════════════════════════════════════════
//  StoxBox — app.js
//  Full app logic: watchlist, charts, portfolio, news
// ══════════════════════════════════════════════════

// ── Mock Stock Data ───────────────────────────────
const STOCKS = [
  {
    ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ',
    price: 184.92, change: 2.34, changePct: 2.34,
    signal: 'STRONG BUY', signalType: 'buy',
    spark: [178,179,181,180,182,183,184,185,184,184.92],
    open: 181.28, high: 185.40, low: 180.14, vol: '58.3M',
    indicators: {
      rsi:    { val: '62.4',   sub: 'Neutral',       cls: '' },
      macd:   { val: '+1.24',  sub: 'Bullish ✕',     cls: 'bull' },
      ema20:  { val: '$181.4', sub: 'Above ✓',        cls: 'bull' },
      volume: { val: '58.3M',  sub: '+12% avg',       cls: '' },
      high52: { val: '$199.6', sub: '7.4% away',      cls: '' },
      bb:     { val: 'Mid',    sub: 'Neutral Band',   cls: '' },
    },
    fundamentals: { 'P/E': '28.4x', 'Mkt Cap': '$2.87T', 'EPS': '$6.52', 'Revenue': '$385B', 'Div Yield': '0.52%', 'Beta': '1.28' },
    news: [
      { source: 'Bloomberg', headline: 'Apple reports record Q1 earnings; services revenue hits all-time high', time: '2h ago' },
      { source: 'Reuters',   headline: 'iPhone 16 demand surges ahead of analyst expectations in Asia markets', time: '5h ago' },
    ]
  },
  {
    ticker: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ',
    price: 172.63, change: -2.71, changePct: -1.55,
    signal: 'SELL', signalType: 'sell',
    spark: [180,178,179,176,175,177,174,173,172,172.63],
    open: 175.40, high: 176.82, low: 170.14, vol: '102M',
    indicators: {
      rsi:    { val: '38.1',   sub: 'Oversold',       cls: 'bear' },
      macd:   { val: '-2.18',  sub: 'Bearish ✕',      cls: 'bear' },
      ema20:  { val: '$178.2', sub: 'Below ✗',         cls: 'bear' },
      volume: { val: '102M',   sub: '+38% avg',        cls: '' },
      high52: { val: '$278.9', sub: '38% away',        cls: '' },
      bb:     { val: 'Lower',  sub: 'Bearish Band',    cls: 'bear' },
    },
    fundamentals: { 'P/E': '54.2x', 'Mkt Cap': '$550B', 'EPS': '$3.18', 'Revenue': '$97B', 'Div Yield': '—', 'Beta': '2.31' },
    news: [
      { source: 'WSJ',  headline: 'Tesla faces demand headwinds in China amid rising BYD competition', time: '5h ago' },
      { source: 'CNBC', headline: 'Musk sells another $1.5B in Tesla shares amid investor concerns', time: '9h ago' },
    ]
  },
  {
    ticker: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ',
    price: 875.40, change: 28.81, changePct: 3.40,
    signal: 'STRONG BUY', signalType: 'buy',
    spark: [820,830,840,838,855,860,865,870,875,875.40],
    open: 848.00, high: 880.10, low: 845.00, vol: '42.1M',
    indicators: {
      rsi:    { val: '71.8',   sub: 'Near Overbought', cls: '' },
      macd:   { val: '+8.54',  sub: 'Bullish',         cls: 'bull' },
      ema20:  { val: '$838.0', sub: 'Above ✓',          cls: 'bull' },
      volume: { val: '42.1M',  sub: '+5% avg',          cls: '' },
      high52: { val: '$905.0', sub: '3.3% away',        cls: '' },
      bb:     { val: 'Upper',  sub: 'Bullish Band',     cls: 'bull' },
    },
    fundamentals: { 'P/E': '72.1x', 'Mkt Cap': '$2.15T', 'EPS': '$12.14', 'Revenue': '$60B', 'Div Yield': '0.03%', 'Beta': '1.75' },
    news: [
      { source: 'CNBC',      headline: 'NVIDIA data center revenue surges 409% as AI chip demand accelerates', time: '4h ago' },
      { source: 'Bloomberg', headline: 'Jensen Huang announces next-gen Blackwell Ultra GPU architecture', time: '7h ago' },
    ]
  },
  {
    ticker: 'BTC', name: 'Bitcoin', exchange: 'Crypto',
    price: 84210, change: 1510, changePct: 1.82,
    signal: 'RSI: 58', signalType: 'neutral',
    spark: [80000,81000,82000,81500,83000,82800,84000,84100,84210,84210],
    open: 82700, high: 84900, low: 82100, vol: '$38B',
    indicators: {
      rsi:    { val: '58.3',   sub: 'Neutral',         cls: '' },
      macd:   { val: '+340',   sub: 'Bullish',         cls: 'bull' },
      ema20:  { val: '$81.4K', sub: 'Above ✓',          cls: 'bull' },
      volume: { val: '$38B',   sub: 'Normal',           cls: '' },
      high52: { val: '$108K',  sub: '22% away',         cls: '' },
      bb:     { val: 'Mid',    sub: 'Consolidating',   cls: '' },
    },
    fundamentals: { 'Mkt Cap': '$1.66T', 'Dominance': '54.2%', '24h Vol': '$38B', 'Circulating': '19.6M', 'ATH': '$108,364', 'ATL': '$67.81' },
    news: [
      { source: 'CoinDesk', headline: 'Bitcoin ETFs see record $1.2B inflows as institutional adoption grows', time: '6h ago' },
      { source: 'Reuters',  headline: 'MicroStrategy adds another 10,000 BTC to corporate treasury holdings', time: '10h ago' },
    ]
  },
  {
    ticker: 'MSFT', name: 'Microsoft Corp.', exchange: 'NASDAQ',
    price: 415.30, change: 4.58, changePct: 1.12,
    signal: 'BUY', signalType: 'buy',
    spark: [405,407,408,410,411,412,413,414,415,415.30],
    open: 411.00, high: 417.20, low: 409.80, vol: '22.4M',
    indicators: {
      rsi:    { val: '65.7',   sub: 'Neutral-High',    cls: '' },
      macd:   { val: '+2.91',  sub: 'Bullish ✕',       cls: 'bull' },
      ema20:  { val: '$408.1', sub: 'Above ✓',          cls: 'bull' },
      volume: { val: '22.4M',  sub: 'Normal',           cls: '' },
      high52: { val: '$468.3', sub: '11.3% away',       cls: '' },
      bb:     { val: 'Mid-Up', sub: 'Bullish',          cls: 'bull' },
    },
    fundamentals: { 'P/E': '34.8x', 'Mkt Cap': '$3.08T', 'EPS': '$11.93', 'Revenue': '$227B', 'Div Yield': '0.72%', 'Beta': '0.90' },
    news: [
      { source: 'FT',   headline: 'Microsoft Azure growth beats estimates; Copilot AI adds 14M subscribers', time: '8h ago' },
      { source: 'CNBC', headline: 'Microsoft announces $60B AI infrastructure investment for next fiscal year', time: '12h ago' },
    ]
  }
];

// ── Market Banner Data (mock) ──────────────────────
const MARKET_DATA = [
  { name: 'S&P 500', val: '5,842.31', chg: '+0.74%', trend: 'bull' },
  { name: 'NASDAQ',  val: '18,290',   chg: '+1.12%', trend: 'bull' },
  { name: 'DOW',     val: '43,428',   chg: '-0.23%', trend: 'bear' },
  { name: 'VIX',     val: '14.83',    chg: '-3.20%', trend: 'bear' },
  { name: 'BTC',     val: '$84,210',  chg: '+1.82%', trend: 'bull' },
];

// ── Global News ────────────────────────────────────
const GLOBAL_NEWS = [
  { source: 'Reuters',     headline: 'Fed signals rate cuts may be delayed as inflation stays sticky above 3%', time: '14m ago', tag: 'bear', tagLabel: 'MACRO' },
  { source: 'Bloomberg',   headline: 'Apple reports record Q1 earnings; services revenue hits all-time high', time: '2h ago', tag: 'bull', tagLabel: 'AAPL' },
  { source: 'CNBC',        headline: 'NVIDIA data center revenue surges 409% as AI chip demand accelerates', time: '4h ago', tag: 'bull', tagLabel: 'NVDA' },
  { source: 'WSJ',         headline: 'Tesla faces demand headwinds in China amid rising BYD competition', time: '5h ago', tag: 'bear', tagLabel: 'TSLA' },
  { source: 'CoinDesk',    headline: 'Bitcoin ETFs see record $1.2B inflows as institutional adoption grows', time: '6h ago', tag: 'bull', tagLabel: 'BTC' },
  { source: 'FT',          headline: 'Microsoft Azure growth beats estimates; Copilot AI adds 14M subscribers', time: '8h ago', tag: 'bull', tagLabel: 'MSFT' },
  { source: 'MarketWatch', headline: 'S&P 500 approaches all-time high as Q1 earnings season kicks into gear', time: '10h ago', tag: 'bull', tagLabel: 'MARKET' },
  { source: 'Bloomberg',   headline: 'Oil prices drop 2% as OPEC+ signals increased production for Q3 2025', time: '12h ago', tag: 'bear', tagLabel: 'OIL' },
];

// ── App State ──────────────────────────────────────
let watchlist     = [...STOCKS];
let portfolio     = JSON.parse(localStorage.getItem('stoxbox_portfolio') || '[]');
let currentStock  = null;
let chartInstance = null;
let chartType     = 'line';
let activeRange   = '1W';

// ── Save portfolio to localStorage ────────────────
function savePortfolio() {
  localStorage.setItem('stoxbox_portfolio', JSON.stringify(portfolio));
}

// ── Price History Generator ────────────────────────
function generateHistory(basePrice, points, volatility = 0.018) {
  const data = []; let price = basePrice * (1 - volatility * points * 0.4);
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    price = Math.max(price + (Math.random() - 0.47) * volatility * price, price * 0.5);
    const o = +price.toFixed(2);
    const h = +(price * (1 + Math.random() * 0.012)).toFixed(2);
    const l = +(price * (1 - Math.random() * 0.012)).toFixed(2);
    const c = +(l + Math.random() * (h - l)).toFixed(2);
    data.push({ x: d.toISOString().split('T')[0], o, h, l, c });
  }
  return data;
}

function getHistory(stock, range) {
  const pts = { '1D': 78, '1W': 35, '1M': 30, '3M': 90, '1Y': 252 };
  const vol  = stock.ticker === 'BTC' ? 0.038 : 0.016;
  return generateHistory(stock.price, pts[range] || 30, vol);
}

// ── Format helpers ─────────────────────────────────
function fmtPrice(stock, price) {
  return stock.ticker === 'BTC'
    ? `$${Number(price).toLocaleString()}`
    : `$${Number(price).toFixed(2)}`;
}

// ══════════════════════════════════════════════════
//  RENDER: Market Banner
// ══════════════════════════════════════════════════
function renderMarket() {
  const chips = document.getElementById('market-chips');
  chips.innerHTML = MARKET_DATA.map(m => `
    <div class="m-chip">
      <span class="m-name">${m.name}</span>
      <span class="m-val">${m.val}</span>
      <span class="m-chg ${m.trend === 'bull' ? 'bull' : 'bear'}">${m.trend === 'bull' ? '▲' : '▼'} ${m.chg}</span>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════════
//  RENDER: Watchlist
// ══════════════════════════════════════════════════
function renderWatchlist() {
  const container = document.getElementById('watchlist');
  container.innerHTML = '';
  document.getElementById('stock-count').textContent = `${watchlist.length} stock${watchlist.length !== 1 ? 's' : ''}`;

  if (watchlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-title">Watchlist is empty</div>
        <div class="empty-sub">Tap the + button to add stocks</div>
      </div>`;
    return;
  }

  watchlist.forEach((stock, i) => {
    const isUp = stock.changePct >= 0;
    const row  = document.createElement('div');
    row.className = 'wl-row';
    row.style.animationDelay = `${i * 0.04}s`;

    const badgeCls  = stock.signalType === 'buy' ? 'badge-buy' : stock.signalType === 'sell' ? 'badge-sell' : 'badge-neutral';
    const sparkPts  = buildSparkPoints(stock.spark);
    const sparkCol  = isUp ? '#00BFA5' : '#FF5252';
    const pctLabel  = `${isUp ? '▲ +' : '▼ '}${Math.abs(stock.changePct).toFixed(2)}%`;

    row.innerHTML = `
      <div class="wl-main" data-ticker="${stock.ticker}">
        <span class="status-dot ${isUp ? 'dot-bull' : 'dot-bear'}"></span>
        <div class="wl-info">
          <div class="wl-ticker">${stock.ticker} <span class="badge ${badgeCls}">${stock.signal}</span></div>
          <div class="wl-name">${stock.name} · ${stock.exchange}</div>
        </div>
        <svg class="wl-spark" width="60" height="28" viewBox="0 0 60 28" aria-hidden="true">
          <polyline points="${sparkPts}" fill="none" stroke="${sparkCol}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="wl-price-col">
          <div class="wl-price">${fmtPrice(stock, stock.price)}</div>
          <div class="wl-pct ${isUp ? 'pct-bull' : 'pct-bear'}">${pctLabel}</div>
        </div>
      </div>

      <div class="wl-drawer" id="drawer-${stock.ticker}">
        <div class="drawer-inner">
          <div class="mini-ind-grid">
            <div class="mini-ind">
              <div class="mini-label">RSI (14)</div>
              <div class="mini-val ${stock.indicators.rsi.cls}">${stock.indicators.rsi.val}</div>
              <div class="mini-sub">${stock.indicators.rsi.sub}</div>
            </div>
            <div class="mini-ind">
              <div class="mini-label">MACD</div>
              <div class="mini-val ${stock.indicators.macd.cls}">${stock.indicators.macd.val}</div>
              <div class="mini-sub">${stock.indicators.macd.sub}</div>
            </div>
            <div class="mini-ind">
              <div class="mini-label">EMA 20</div>
              <div class="mini-val ${stock.indicators.ema20.cls}">${stock.indicators.ema20.val}</div>
              <div class="mini-sub">${stock.indicators.ema20.sub}</div>
            </div>
          </div>
          <button class="view-chart-btn" data-ticker="${stock.ticker}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            View Full Chart &amp; Analysis
          </button>
          <button class="wl-delete-btn" data-ticker="${stock.ticker}">✕ Remove from Watchlist</button>
        </div>
      </div>
    `;
    container.appendChild(row);
  });

  // Events
  container.querySelectorAll('.wl-main').forEach(el => {
    el.addEventListener('click', () => {
      const drawer = document.getElementById(`drawer-${el.dataset.ticker}`);
      // close all others
      document.querySelectorAll('.wl-drawer.open').forEach(d => { if (d !== drawer) d.classList.remove('open'); });
      drawer.classList.toggle('open');
    });
  });
  container.querySelectorAll('.view-chart-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openChartView(btn.dataset.ticker); });
  });
  container.querySelectorAll('.wl-delete-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); removeStock(btn.dataset.ticker); });
  });
}

function buildSparkPoints(data) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  return data.map((v, i) => {
    const x = (i / (data.length - 1)) * 58;
    const y = 26 - ((v - min) / range) * 22;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

function addStock(ticker) {
  ticker = ticker.toUpperCase().trim();
  if (!ticker) return;
  if (watchlist.find(s => s.ticker === ticker)) {
    alert(`${ticker} is already in your watchlist.`); return;
  }
  const price = +(100 + Math.random() * 400).toFixed(2);
  const pct   = +((Math.random() * 6 - 3)).toFixed(2);
  watchlist.push({
    ticker, name: `${ticker} Corp.`, exchange: 'NASDAQ',
    price, change: +(price * pct / 100).toFixed(2), changePct: pct,
    signal: pct >= 1 ? 'BUY' : pct <= -1 ? 'SELL' : 'HOLD',
    signalType: pct >= 1 ? 'buy' : pct <= -1 ? 'sell' : 'neutral',
    spark: Array.from({ length: 10 }, () => price * (0.94 + Math.random() * 0.12)),
    open: +(price * 0.99).toFixed(2), high: +(price * 1.01).toFixed(2),
    low:  +(price * 0.98).toFixed(2), vol: `${(Math.random() * 40 + 5).toFixed(1)}M`,
    indicators: {
      rsi:    { val: (35 + Math.random() * 35).toFixed(1), sub: 'Neutral',  cls: '' },
      macd:   { val: (Math.random() * 3 - 1.5).toFixed(2), sub: 'Neutral', cls: '' },
      ema20:  { val: `$${(price * 0.97).toFixed(2)}`,      sub: 'Above ✓', cls: 'bull' },
      volume: { val: `${(Math.random() * 40 + 5).toFixed(1)}M`, sub: 'Normal', cls: '' },
      high52: { val: `$${(price * 1.2).toFixed(2)}`,       sub: '20% away', cls: '' },
      bb:     { val: 'Mid', sub: 'Neutral', cls: '' },
    },
    fundamentals: { 'P/E': '—', 'Mkt Cap': '—', 'EPS': '—', 'Revenue': '—', 'Div Yield': '—', 'Beta': '—' },
    news: []
  });
  renderWatchlist();
}

function removeStock(ticker) {
  watchlist = watchlist.filter(s => s.ticker !== ticker);
  renderWatchlist();
}

// ══════════════════════════════════════════════════
//  CHART VIEW
// ══════════════════════════════════════════════════
function openChartView(ticker) {
  currentStock = watchlist.find(s => s.ticker === ticker);
  if (!currentStock) return;

  const isUp    = currentStock.changePct >= 0;
  const pctStr  = `${isUp ? '▲ +' : '▼ '}${Math.abs(currentStock.changePct).toFixed(2)}%`;

  document.getElementById('detail-ticker').textContent = currentStock.ticker;
  document.getElementById('detail-name').textContent   = currentStock.name;
  document.getElementById('detail-price').textContent  = fmtPrice(currentStock, currentStock.price);
  const chgEl = document.getElementById('detail-chg');
  chgEl.textContent = pctStr;
  chgEl.className   = `detail-chg ${isUp ? 'bull' : 'bear'}`;

  document.getElementById('stat-open').textContent = fmtPrice(currentStock, currentStock.open);
  document.getElementById('stat-high').textContent = fmtPrice(currentStock, currentStock.high);
  document.getElementById('stat-low').textContent  = fmtPrice(currentStock, currentStock.low);
  document.getElementById('stat-vol').textContent  = currentStock.vol;

  renderIndicators(currentStock);
  renderFundamentals(currentStock);
  renderStockNews(currentStock);
  renderChart(currentStock, activeRange, chartType);

  showView('chart');
}

function renderIndicators(stock) {
  const LABELS = { rsi: 'RSI (14)', macd: 'MACD', ema20: 'EMA 20', volume: 'Volume', high52: '52W High', bb: 'Bollinger' };
  document.getElementById('ind-grid').innerHTML = Object.keys(LABELS).map(k => `
    <div class="ind-cell ${stock.indicators[k].cls}">
      <div class="ind-label">${LABELS[k]}</div>
      <div class="ind-val ${stock.indicators[k].cls}">${stock.indicators[k].val}</div>
      <div class="ind-sub">${stock.indicators[k].sub}</div>
    </div>
  `).join('');
}

function renderFundamentals(stock) {
  document.getElementById('fund-grid').innerHTML = Object.entries(stock.fundamentals).map(([k, v]) => `
    <div class="fund-cell">
      <span class="fund-label">${k}</span>
      <span class="fund-val">${v}</span>
    </div>
  `).join('');
}

function renderStockNews(stock) {
  const list = document.getElementById('stock-news-list');
  if (!stock.news || stock.news.length === 0) {
    list.innerHTML = '<div style="padding:8px 0;font-size:12px;color:var(--muted);">No recent news available.</div>';
    return;
  }
  list.innerHTML = stock.news.map(n => `
    <div class="stock-news-item">
      <div class="news-source">${n.source}</div>
      <div class="news-headline">${n.headline}</div>
      <div class="news-time">${n.time}</div>
    </div>
  `).join('');
}

// ── EMA Calculator ─────────────────────────────────
function computeEMA(data, period) {
  const k = 2 / (period + 1);
  let ema = [], prev = null;
  return data.map((v, i) => {
    if (i < period - 1) { ema.push(null); return null; }
    if (prev === null) { prev = data.slice(0, period).reduce((a, b) => a + b, 0) / period; }
    const val = v * k + prev * (1 - k);
    prev = val;
    return +val.toFixed(2);
  });
}

// ── Render Chart ───────────────────────────────────
function renderChart(stock, range, type) {
  const canvas = document.getElementById('main-chart');
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

  const history = getHistory(stock, range);
  const isUp    = stock.changePct >= 0;
  const lineCol = isUp ? '#00BFA5' : '#FF5252';

  const chartDefaults = {
    responsive: true, maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1F2937',
        borderColor: '#2d3d52', borderWidth: 1,
        titleColor: '#6B7280', bodyColor: '#F9FAFB',
        padding: 10, cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(45,61,82,0.45)', drawBorder: false },
        ticks: { color: '#6B7280', font: { family: 'IBM Plex Mono', size: 9 }, maxTicksLimit: 6, maxRotation: 0 },
        border: { display: false }
      },
      y: {
        position: 'right',
        grid: { color: 'rgba(45,61,82,0.45)', drawBorder: false },
        ticks: {
          color: '#6B7280', font: { family: 'IBM Plex Mono', size: 9 }, maxTicksLimit: 5,
          callback: v => stock.ticker === 'BTC' ? `$${(v/1000).toFixed(0)}K` : `$${v.toFixed(0)}`
        },
        border: { display: false }
      }
    }
  };

  if (type === 'line') {
    const labels = history.map(d => d.x);
    const prices = history.map(d => d.c);
    const ema    = computeEMA(prices, Math.min(10, Math.floor(prices.length / 3)));

    chartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: stock.ticker,
            data: prices,
            borderColor: lineCol,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.35,
            fill: true,
            backgroundColor: ctx => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200);
              g.addColorStop(0, isUp ? 'rgba(0,191,165,0.22)' : 'rgba(255,82,82,0.22)');
              g.addColorStop(1, 'rgba(0,0,0,0)');
              return g;
            }
          },
          {
            label: 'EMA',
            data: ema,
            borderColor: '#3B82F6',
            borderWidth: 1.5,
            borderDash: [4, 3],
            pointRadius: 0,
            fill: false,
            tension: 0.35,
          }
        ]
      },
      options: {
        ...chartDefaults,
        plugins: {
          ...chartDefaults.plugins,
          tooltip: {
            ...chartDefaults.plugins.tooltip,
            callbacks: {
              label: ctx => ctx.datasetIndex === 0
                ? ` ${fmtPrice(stock, ctx.parsed.y)}`
                : ` EMA: ${ctx.parsed.y != null ? fmtPrice(stock, ctx.parsed.y) : '—'}`
            }
          }
        }
      }
    });

  } else {
    // Candlestick simulation using floating bar
    chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: history.map(d => d.x),
        datasets: [{
          label: 'OHLC',
          data: history.map(d => [d.l, d.h]),
          backgroundColor: history.map(d => d.c >= d.o ? 'rgba(0,191,165,0.75)' : 'rgba(255,82,82,0.75)'),
          borderColor:     history.map(d => d.c >= d.o ? '#00BFA5' : '#FF5252'),
          borderWidth: 1,
          borderRadius: 1,
          borderSkipped: false,
        }]
      },
      options: {
        ...chartDefaults,
        plugins: {
          ...chartDefaults.plugins,
          tooltip: {
            ...chartDefaults.plugins.tooltip,
            callbacks: {
              title: ctx => ctx[0].label,
              label: ctx => {
                const d = history[ctx.dataIndex];
                return [`O: $${d.o}`, `H: $${d.h}`, `L: $${d.l}`, `C: $${d.c}`];
              }
            }
          }
        }
      }
    });
  }
}

// ══════════════════════════════════════════════════
//  PORTFOLIO
// ══════════════════════════════════════════════════
function renderPortfolio() {
  const list     = document.getElementById('portfolio-list');
  const total    = document.getElementById('port-total');
  const pnlEl    = document.getElementById('port-pnl');
  const countEl  = document.getElementById('position-count');

  countEl.textContent = `${portfolio.length} position${portfolio.length !== 1 ? 's' : ''}`;

  if (portfolio.length === 0) {
    total.textContent = '$0.00';
    pnlEl.textContent = '+$0.00 (0.00%)';
    pnlEl.className   = 'port-pnl';
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💼</div>
        <div class="empty-title">No positions yet</div>
        <div class="empty-sub">Tap + to add your first position and track your P&amp;L</div>
      </div>`;
    return;
  }

  let totalValue = 0, totalCost = 0;

  list.innerHTML = portfolio.map((pos, i) => {
    const stock     = watchlist.find(s => s.ticker === pos.ticker) || { price: pos.buyPrice };
    const curPrice  = stock.price;
    const value     = curPrice * pos.shares;
    const cost      = pos.buyPrice * pos.shares;
    const pnl       = value - cost;
    const pnlPct    = ((pnl / cost) * 100).toFixed(2);
    const isUp      = pnl >= 0;

    totalValue += value;
    totalCost  += cost;

    return `
      <div class="position-row" style="animation-delay:${i*0.05}s">
        <div class="pos-top">
          <div>
            <div class="pos-ticker">${pos.ticker}</div>
            <div class="pos-name">${pos.shares} shares</div>
          </div>
          <div>
            <div class="pos-value">$${value.toFixed(2)}</div>
            <div class="pos-pnl ${isUp ? 'bull' : 'bear'}">${isUp ? '+' : ''}$${pnl.toFixed(2)} (${isUp ? '+' : ''}${pnlPct}%)</div>
          </div>
        </div>
        <div class="pos-bottom">
          <div class="pos-stat">
            <div class="pos-stat-label">Buy Price</div>
            <div class="pos-stat-val">$${pos.buyPrice.toFixed(2)}</div>
          </div>
          <div class="pos-stat">
            <div class="pos-stat-label">Cur. Price</div>
            <div class="pos-stat-val">$${curPrice.toFixed(2)}</div>
          </div>
          <div class="pos-stat">
            <div class="pos-stat-label">Cost Basis</div>
            <div class="pos-stat-val">$${cost.toFixed(2)}</div>
          </div>
        </div>
        <button class="pos-delete" data-index="${i}">✕ Remove Position</button>
      </div>
    `;
  }).join('');

  const totalPnl    = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? ((totalPnl / totalCost) * 100).toFixed(2) : '0.00';
  const isOverallUp = totalPnl >= 0;

  total.textContent   = `$${totalValue.toFixed(2)}`;
  pnlEl.textContent   = `${isOverallUp ? '+' : ''}$${totalPnl.toFixed(2)} (${isOverallUp ? '+' : ''}${totalPnlPct}%)`;
  pnlEl.className     = `port-pnl ${isOverallUp ? 'bull' : 'bear'}`;

  list.querySelectorAll('.pos-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      portfolio.splice(parseInt(btn.dataset.index), 1);
      savePortfolio();
      renderPortfolio();
    });
  });
}

function addPosition(ticker, shares, buyPrice) {
  ticker   = ticker.toUpperCase().trim();
  shares   = parseFloat(shares);
  buyPrice = parseFloat(buyPrice);
  if (!ticker || isNaN(shares) || isNaN(buyPrice) || shares <= 0 || buyPrice <= 0) {
    alert('Please fill in all fields correctly.'); return;
  }
  portfolio.push({ ticker, shares, buyPrice });
  savePortfolio();
  renderPortfolio();
}

// ══════════════════════════════════════════════════
//  NEWS
// ══════════════════════════════════════════════════
function renderNews() {
  document.getElementById('news-list').innerHTML = GLOBAL_NEWS.map((n, i) => `
    <div class="news-item" style="animation-delay:${i * 0.05}s">
      <div class="news-source">${n.source} <span class="news-tag tag-${n.tag}">${n.tagLabel}</span></div>
      <div class="news-headline">${n.headline}</div>
      <div class="news-meta">${n.time}</div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════════════
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`view-${name}`)?.classList.add('active');
  document.querySelector(`.nav-item[data-view="${name}"]`)?.classList.add('active');
}

// ══════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  renderMarket();
  renderWatchlist();
  renderPortfolio();
  renderNews();

  // ── Nav ──
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      showView(btn.dataset.view);
      if (btn.dataset.view === 'portfolio') renderPortfolio();
    });
  });

  // ── Back button ──
  document.getElementById('back-btn').addEventListener('click', () => {
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    showView('watchlist');
  });

  // ── Search ──
  const searchBar = document.getElementById('search-bar');
  document.getElementById('search-toggle').addEventListener('click', () => {
    searchBar.classList.toggle('open');
    if (searchBar.classList.contains('open')) document.getElementById('search-input').focus();
  });
  document.getElementById('search-go').addEventListener('click', () => {
    const val = document.getElementById('search-input').value.trim().toUpperCase();
    const found = watchlist.find(s => s.ticker === val);
    if (found) { openChartView(found.ticker); }
    else if (val) { addStock(val); }
    document.getElementById('search-input').value = '';
    searchBar.classList.remove('open');
  });
  document.getElementById('search-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('search-go').click();
  });

  // ── Watchlist FAB / Modal ──
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('fab-add').addEventListener('click', () => overlay.classList.add('open'));
  document.getElementById('modal-cancel').addEventListener('click', () => overlay.classList.remove('open'));
  document.getElementById('modal-confirm').addEventListener('click', () => {
    const val = document.getElementById('modal-input').value;
    addStock(val);
    document.getElementById('modal-input').value = '';
    overlay.classList.remove('open');
  });
  document.getElementById('modal-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('modal-confirm').click();
  });
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

  // ── Portfolio Modal ──
  const posOverlay = document.getElementById('position-modal-overlay');
  document.getElementById('add-position-btn').addEventListener('click', () => posOverlay.classList.add('open'));
  document.getElementById('pos-cancel').addEventListener('click', () => posOverlay.classList.remove('open'));
  document.getElementById('pos-confirm').addEventListener('click', () => {
    addPosition(
      document.getElementById('pos-ticker').value,
      document.getElementById('pos-shares').value,
      document.getElementById('pos-price').value,
    );
    document.getElementById('pos-ticker').value = '';
    document.getElementById('pos-shares').value = '';
    document.getElementById('pos-price').value  = '';
    posOverlay.classList.remove('open');
  });
  posOverlay.addEventListener('click', e => { if (e.target === posOverlay) posOverlay.classList.remove('open'); });

  // ── Range tabs ──
  document.querySelectorAll('.range-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRange = btn.dataset.range;
      if (currentStock) renderChart(currentStock, activeRange, chartType);
    });
  });

  // ── Chart type toggle ──
  document.querySelectorAll('.chart-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chart-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      chartType = btn.dataset.type;
      if (currentStock) renderChart(currentStock, activeRange, chartType);
    });
  });

});
