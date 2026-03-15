# 📈 Stoxbox

**Stoxbox** is a high-performance, real-time trading dashboard designed for tracking market trends with clinical precision. Built with a "Vanilla-First" philosophy, it bypasses heavy frontend frameworks to deliver an instant, lag-free data visualization experience.

---

## 🚀 Features

- **Live Market Data:** Real-time fetching of stock data and historical time series via Yahoo Finance.
- **Advanced Visualization:** Interactive line charts and candlestick simulations powered by Chart.js 4.4.0.
- **Technical Indicators:** On-the-fly calculation of EMA (Exponential Moving Average), RSI, and MACD overlays.
- **Zero-Bloat UI:** A clean, typography-focused interface using IBM Plex Mono for data-heavy views.
- **Persistent Portfolio:** Track your positions locally without the need for a complex database, thanks to Browser `localStorage`.

---

## 🛠️ Tech Stack

### Frontend
- **Logic:** Vanilla JavaScript (ES6+) — *Purposefully built without React for maximum performance and direct DOM control.*
- **UI/Layout:** HTML5 & CSS3 (Mobile-first design).
- **Charts:** Chart.js 4.4.0 (Line charts, Candlestick simulation, EMA overlays).
- **Typography:** - `IBM Plex Mono`: For precise, non-shifting price and numerical data.
  - `Manrope`: For clean, modern interface text.

### Backend
- **Language:** Python 3.x
- **Framework:** Flask 3.0.3 (API Routing & Web Server).
- **Data Engine:** - `yfinance`: Institutional-grade data fetching.
  - `Pandas`: Time-series manipulation and technical analysis.
  - `NumPy`: High-speed numerical calculations for indicators.
- **Optimization:** Custom In-memory caching (`cache.py`) to minimize API latency and rate-limiting.

### Storage & Deployment
- **Storage:** Browser `localStorage` (Persists portfolio positions across sessions).
- **Hosting:** GitHub Pages (Frontend) & Flask-ready cloud environment (Backend).

---

## 🏗️ Architecture & Logic

### 1. The Vanilla Advantage
Stoxbox was built to prove that for data-intensive applications, modern Vanilla JavaScript is often more efficient than modern frameworks. By eliminating the Virtual DOM overhead, the app achieves sub-millisecond UI updates even when rendering complex financial charts.

### 2. Financial Computation Engine
Unlike basic dashboards that rely on pre-calculated API data, Stoxbox fetches raw OHLC (Open, High, Low, Close) data. The **Pandas/NumPy** backend then calculates technical indicators (EMA, RSI) on the fly, allowing for a higher degree of customization in the charting logic.

### 3. Data Flow
- **Request:** Frontend sends a ticker symbol to the Flask API.
- **Cache Check:** `cache.py` checks if data for that ticker was fetched in the last 60 seconds.
- **Processing:** If new, `yfinance` pulls data, `Pandas` cleans it, and it's returned as a JSON object.
- **Visualization:** `Chart.js` parses the JSON and renders the time-series graph instantly.

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

