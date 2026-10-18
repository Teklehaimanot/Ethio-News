from datetime import datetime, timezone
from urllib.parse import urlparse

from pymongo import ASCENDING, MongoClient
from pymongo.collection import Collection

from config.settings import MONGO_URI
from models.article import Article
from services.dedup import DedupService
from utils.text import normalize_url


class MongoSink:
    def __init__(self):
        if not MONGO_URI:
            raise ValueError("MONGO_URI is not set. Copy .env.example to .env and configure it.")
        self.client = MongoClient(MONGO_URI)
        db_name = urlparse(MONGO_URI).path.lstrip("/").split("?")[0]
        if not db_name:
            raise ValueError("MONGO_URI must include a database name.")
        self.db = self.client[db_name]
        self.news: Collection = self.db["news"]
        self.import_logs: Collection = self.db["import_logs"]
        self.dedup = DedupService(self.news)
        self._ensure_indexes()

    def _ensure_indexes(self) -> None:
        self.news.create_index([("sourceUrl", ASCENDING)], unique=True, sparse=True)
        self.news.create_index([("source", ASCENDING), ("externalId", ASCENDING)], sparse=True)
        self.news.create_index([("contentHash", ASCENDING)], sparse=True)
        self.news.create_index([("date", ASCENDING)])

    def save_article(self, article: Article) -> tuple[str, str]:
        is_dup, reason = self.dedup.is_duplicate(article)
        if is_dup:
            self._log(article, "skipped_duplicate", reason)
            return "skipped", reason

        now = datetime.now(timezone.utc)
        published = article.published_at or now
        if published.tzinfo is None:
            published = published.replace(tzinfo=timezone.utc)

        doc = {
            "title": article.title,
            "description": article.description,
            "content": article.content or article.description,
            "image": article.image,
            "source": article.source,
            "sourceUrl": normalize_url(article.source_url),
            "date": published,
            "likes": 0,
            "likedBy": [],
            "comments": [],
            "isImported": True,
            "importedAt": now,
            "externalId": article.external_id,
            "contentHash": article.content_hash,
            "importedVia": article.imported_via,
        }

        try:
            result = self.news.insert_one(doc)
            self._log(article, "inserted", str(result.inserted_id))
            return "inserted", str(result.inserted_id)
        except Exception as exc:
            self._log(article, "error", str(exc))
            return "error", str(exc)

    def _log(self, article: Article, status: str, detail: str) -> None:
        self.import_logs.insert_one(
            {
                "title": article.title,
                "source": article.source,
                "sourceUrl": normalize_url(article.source_url),
                "status": status,
                "detail": detail,
                "seenAt": datetime.now(timezone.utc),
            }
        )

    def close(self) -> None:
        self.client.close()
