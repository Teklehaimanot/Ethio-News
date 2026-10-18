import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

MONGO_URI = os.getenv("MONGO_URI", "")
DEFAULT_NEWS_IMAGE = os.getenv(
    "DEFAULT_NEWS_IMAGE",
    "https://via.placeholder.com/800x450?text=Ethio+News",
)
CRON_HOURS = [
    int(h.strip())
    for h in os.getenv("CRON_HOURS", "6,10,14,18,22").split(",")
    if h.strip()
]
RUN_ON_START = os.getenv("RUN_ON_START", "true").lower() == "true"
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "30"))
REQUEST_DELAY_SECONDS = float(os.getenv("REQUEST_DELAY_SECONDS", "1.5"))
FUZZY_TITLE_THRESHOLD = int(os.getenv("FUZZY_TITLE_THRESHOLD", "88"))
DEDUP_LOOKBACK_HOURS = int(os.getenv("DEDUP_LOOKBACK_HOURS", "72"))

TELEGRAM_API_ID = os.getenv("TELEGRAM_API_ID", "")
TELEGRAM_API_HASH = os.getenv("TELEGRAM_API_HASH", "")
TELEGRAM_SESSION_NAME = os.getenv(
    "TELEGRAM_SESSION_NAME", "sessions/ethio_news_scraper"
)
TELEGRAM_CHANNELS = [
    c.strip()
    for c in os.getenv("TELEGRAM_CHANNELS", "").split(",")
    if c.strip()
]
TELEGRAM_MESSAGE_LIMIT = int(os.getenv("TELEGRAM_MESSAGE_LIMIT", "30"))

SOURCES_CONFIG_PATH = BASE_DIR / "config" / "sources.yaml"
