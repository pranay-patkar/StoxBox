import yfinance as yf
from cache import get as cache_get, set as cache_set

def get_ticker(symbol: str):
    return yf.Ticker(symbol.upper())

def get_history(symbol: str, period: str, interval: str):
    key = f"{symbol}_{period}_{interval}"
    cached = cache_get(key)
    if cached is not None:
        return cached
    data = yf.Ticker(symbol.upper()).history(
        period=period, interval=interval
    )
    cache_set(key, data)
    return data
