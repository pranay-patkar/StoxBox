def compute_signal(rsi: float, macd_hist: float) -> dict:
    if rsi > 60 and macd_hist > 0:
        return {"label": "STRONG BUY", "type": "buy"}
    elif rsi > 50 and macd_hist > 0:
        return {"label": "BUY",        "type": "buy"}
    elif rsi < 40 and macd_hist < 0:
        return {"label": "SELL",       "type": "sell"}
    elif rsi < 30:
        return {"label": "OVERSOLD",   "type": "sell"}
    elif rsi > 70:
        return {"label": "OVERBOUGHT", "type": "neutral"}
    else:
        return {"label": f"RSI: {rsi}", "type": "neutral"}
