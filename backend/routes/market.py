from flask import Blueprint, jsonify
import yfinance as yf

market_bp = Blueprint("market", __name__)

INDICES = {
    "S&P 500": "^GSPC",
    "NASDAQ":  "^IXIC",
    "DOW":     "^DJI",
    "VIX":     "^VIX",
    "BTC":     "BTC-USD",
}

@market_bp.route("/api/market")
def get_market():
    result = []
    for name, sym in INDICES.items():
        try:
            info = yf.Ticker(sym).fast_info
            price   = float(info.last_price)
            prev    = float(info.previous_close)
            chg_pct = round((price - prev) / prev * 100, 2)
            result.append({
                "name": name,
                "value": f"${price:,.2f}" if name == "BTC" else f"{price:,.2f}",
                "change_pct": chg_pct,
                "trend": "bull" if chg_pct >= 0 else "bear",
            })
        except:
            pass
    return jsonify(result)
