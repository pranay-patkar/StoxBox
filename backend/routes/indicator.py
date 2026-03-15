from flask import Blueprint, jsonify
from services.fetcher import get_history
from services.technicals import compute_rsi, compute_macd, compute_bollinger

indicators_bp = Blueprint("indicators", __name__)

@indicators_bp.route("/api/indicators/<ticker>")
def get_indicators(ticker):
    try:
        hist  = get_history(ticker, "1y", "1d")
        close = hist["Close"]
        vol   = hist["Volume"]

        rsi = compute_rsi(close)
        _, _, macd_hist = compute_macd(close)
        ema20 = round(float(close.ewm(span=20).mean().iloc[-1]), 2)
        bb_upper, bb_mid, bb_lower, bb_pos = compute_bollinger(close)

        current    = round(float(close.iloc[-1]), 2)
        high_52w   = round(float(close.max()), 2)
        avg_vol    = int(vol.rolling(20).mean().iloc[-1])
        last_vol   = int(vol.iloc[-1])
        vol_pct    = round((last_vol / avg_vol - 1) * 100, 1)
        dist_pct   = round((high_52w - current) / current * 100, 1)

        rsi_sub  = "Overbought" if rsi >= 70 else "Oversold" if rsi <= 30 else "Neutral"
        macd_sub = "Bullish ✕" if macd_hist > 0 else "Bearish ✕"
        ema_sub  = "Above ✓" if current > ema20 else "Below ✗"
        vol_sub  = f"{'+' if vol_pct >= 0 else ''}{vol_pct}% avg"

        return jsonify({
            "rsi":    {"val": str(rsi),   "sub": rsi_sub,  "cls": "bear" if rsi>=70 or rsi<=30 else ""},
            "macd":   {"val": f"{macd_hist:+.2f}", "sub": macd_sub, "cls": "bull" if macd_hist>0 else "bear"},
            "ema20":  {"val": f"${ema20:,}", "sub": ema_sub, "cls": "bull" if current>ema20 else "bear"},
            "volume": {"val": f"{last_vol/1e6:.1f}M", "sub": vol_sub, "cls": ""},
            "high52": {"val": f"${high_52w:,}", "sub": f"{dist_pct}% away", "cls": ""},
            "bb":     {"val": bb_pos, "sub": f"${bb_upper:,} / ${bb_lower:,}", "cls": ""},
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
