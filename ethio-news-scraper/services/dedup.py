from datetime import datetime, timedelta, timezone

from pymongo.collection import Collection
from rapidfuzz import fuzz

from config.settings import DEDUP_LOOKBACK_HOURS, FUZZY_TITLE_THRESHOLD
from models.article import Article
from utils.text import normalize_url


class DedupService:
    def __init__(self, news_collection: Collection):
        self.news = news_collection

    def is_duplicate(self, article: Article) -> tuple[bool, str]:
        url = normalize_url(article.source_url)
        if not url:
            return True, "missing_url"

        if self.news.find_one({"sourceUrl": url}, {"_id": 1}):
            return True, "source_url_exists"

        if article.external_id and self.news.find_one(
            {"source": article.source, "externalId": article.external_id},
            {"_id": 1},
        ):
            return True, "external_id_exists"

        if article.content_hash and self.news.find_one(
            {"contentHash": article.content_hash},
            {"_id": 1},
        ):
            return True, "content_hash_exists"

        since = datetime.now(timezone.utc) - timedelta(hours=DEDUP_LOOKBACK_HOURS)
        recent = self.news.find(
            {"date": {"$gte": since}},
            {"title": 1},
        ).limit(500)

        for doc in recent:
            score = fuzz.token_set_ratio(article.title, doc.get("title", ""))
            if score >= FUZZY_TITLE_THRESHOLD:
                return True, f"fuzzy_title:{score}"

        return False, ""
