from flask import Blueprint, jsonify
from services.fetcher import get_ticker
from datetime import datetime

news_bp = Blueprint("news", __name__)

@news_bp.route("/api/news/<ticker>")
def get_news(ticker):
    try:
        raw = get_ticker(ticker).news[:8]
        articles = [{
            "headline": i.get("title", ""),
            "source":   i.get("publisher", ""),
            "url":      i.get("link", "#"),
            "time":     datetime.fromtimestamp(
                            i.get("providerPublishTime", 0)
                        ).strftime("%b %d, %H:%M"),
        } for i in raw]
        return jsonify({"ticker": ticker.upper(), "articles": articles})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
