import time

_cache = {}
TTL = 60  # seconds — cache each API call for 60s

def get(key):
    if key in _cache:
        val, ts = _cache[key]
        if time.time() - ts < TTL:
            return val
    return None

def set(key, value):
    _cache[key] = (value, time.time())
