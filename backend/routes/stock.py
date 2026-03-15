from flask import Blueprint, jsonify
from services.fetcher import get_ticker, get_history
from services.technicals import compute_rsi, compute_macd
from services.signals import compute_signal

stock_bp = Blueprint("stock", __name__)

@stock_bp.route("/api/stock/<ticker>")
def get_stock(ticker):
    try:
        t = get_ticker(ticker)
        info = t.fast_info
        price = round(float(info.last_price), 2)
        prev  = round(float(info.previous_close), 2)
        change = round(price - prev, 2)
        change_pct = round((change / prev) * 100, 2)

        hist = get_history(ticker, "3mo", "1d")
        rsi = compute_rsi(hist["Close"])
        _, _, macd_hist = compute_macd(hist["Close"])
        signal = compute_signal(rsi, macd_hist)
        spark = [round(float(v), 2) for v in hist["Close"].tail(10).values]

        return jsonify({
            "ticker": ticker.upper(),
            "price": price,
            "change": change,
            "change_pct": change_pct,
            "signal": signal,
            "spark": spark,
            "day_high": round(float(info.day_high), 2),
            "day_low":  round(float(info.day_low), 2),
            "volume":   int(info.last_volume),
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
