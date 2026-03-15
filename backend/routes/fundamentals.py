from flask import Blueprint, jsonify
from services.fetcher import get_ticker
from utils.formatters import fmt_large

fundamentals_bp = Blueprint("fundamentals", __name__)

@fundamentals_bp.route("/api/fundamentals/<ticker>")
def get_fundamentals(ticker):
    try:
        info = get_ticker(ticker).info
        return jsonify({
            "P/E Ratio":  f"{info.get('trailingPE',0):.1f}x" if info.get("trailingPE") else "—",
            "Market Cap": fmt_large(info.get("marketCap")),
            "EPS":        f"${info.get('trailingEps',0):.2f}" if info.get("trailingEps") else "—",
            "Revenue":    fmt_large(info.get("totalRevenue")),
            "Div Yield":  f"{info.get('dividendYield',0)*100:.2f}%" if info.get("dividendYield") else "—",
            "Beta":       f"{info.get('beta',0):.2f}" if info.get("beta") else "—",
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
