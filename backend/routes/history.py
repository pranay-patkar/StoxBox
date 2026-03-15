from flask import Blueprint, jsonify
from services.fetcher import get_history

history_bp = Blueprint("history", __name__)

RANGE_MAP = {
    "1D": ("1d",  "5m"),
    "1W": ("5d",  "30m"),
    "1M": ("1mo", "1d"),
    "3M": ("3mo", "1d"),
    "1Y": ("1y",  "1wk"),
}

@history_bp.route("/api/history/<ticker>/<range_>")
def get_history_route(ticker, range_):
    try:
        period, interval = RANGE_MAP.get(range_, ("1mo", "1d"))
        hist = get_history(ticker, period, interval)
        hist.index = hist.index.tz_localize(None)
        data = []
        for idx, row in hist.iterrows():
            data.append({
                "x": str(idx.date() if interval in ("1d","1wk") else idx),
                "o": round(float(row["Open"]),  2),
                "h": round(float(row["High"]),  2),
                "l": round(float(row["Low"]),   2),
                "c": round(float(row["Close"]), 2),
                "v": int(row["Volume"]),
            })
        return jsonify({"ticker": ticker.upper(), "range": range_, "data": data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
