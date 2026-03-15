import os

class Config:
    DEBUG = os.getenv("DEBUG", "true").lower() == "true"
    PORT  = int(os.getenv("PORT", 5000))
