import pandas as pd

def compute_rsi(series, period=14):
    delta    = series.diff()
    gain     = delta.clip(lower=0)
    loss     = -delta.clip(upper=0)
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    rs       = avg_gain / avg_loss
    return round(float((100 - (100 / (1 + rs))).iloc[-1]), 2)

def compute_macd(series, fast=12, slow=26, signal=9):
    ema_fast    = series.ewm(span=fast, adjust=False).mean()
    ema_slow    = series.ewm(span=slow, adjust=False).mean()
    macd_line   = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram   = macd_line - signal_line
    return (
        round(float(macd_line.iloc[-1]),   4),
        round(float(signal_line.iloc[-1]), 4),
        round(float(histogram.iloc[-1]),   4),
    )

def compute_bollinger(series, period=20):
    sma   = series.rolling(window=period).mean()
    std   = series.rolling(window=period).std()
    upper = sma + 2 * std
    lower = sma - 2 * std
    price = series.iloc[-1]
    mid   = sma.iloc[-1]
    up    = upper.iloc[-1]
    lo    = lower.iloc[-1]
    pos   = "Upper" if price > mid + (up-mid)*0.5 else "Lower" if price < mid-(mid-lo)*0.5 else "Mid"
    return round(float(up),2), round(float(mid),2), round(float(lo),2), pos
