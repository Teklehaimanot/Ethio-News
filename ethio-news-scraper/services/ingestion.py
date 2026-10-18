from pathlib import Path
from typing import Dict, List

import yaml

from config.settings import SOURCES_CONFIG_PATH
from models.article import Article
from services.mongo_sink import MongoSink
from sources.rss_source import fetch_rss
from sources.scrapers import fetch_ethiopian_reporter, fetch_sheger
from sources.telegram_source import fetch_telegram


def load_sources_config() -> List[dict]:
    with open(SOURCES_CONFIG_PATH, encoding="utf-8") as handle:
        data = yaml.safe_load(handle)
    return [s for s in data.get("sources", []) if s.get("enabled", True)]


def collect_articles(sources: List[dict]) -> List[Article]:
    articles: List[Article] = []

    for source in sources:
        source_type = source.get("type")
        name = source.get("name", "Unknown")

        try:
            if source_type == "rss":
                articles.extend(fetch_rss(name, source["url"]))
            elif source_type == "scraper":
                scraper = source.get("scraper")
                list_urls = source.get("list_urls", [])
                if scraper == "ethiopian_reporter":
                    articles.extend(fetch_ethiopian_reporter(list_urls))
                elif scraper == "sheger":
                    articles.extend(fetch_sheger(list_urls))
                else:
                    print(f"[Ingest] Unknown scraper: {scraper}")
            elif source_type == "telegram":
                articles.extend(fetch_telegram())
            else:
                print(f"[Ingest] Unknown source type: {source_type}")
        except Exception as exc:
            print(f"[Ingest] Error from {name}: {exc}")

    return articles


def run_ingestion() -> Dict[str, int]:
    print("=" * 60)
    print("Starting news ingestion")
    sources = load_sources_config()
    articles = collect_articles(sources)

    sink = MongoSink()
    stats = {"created": 0, "skipped": 0, "errors": 0}

    try:
        for article in articles:
            status, detail = sink.save_article(article)
            if status == "inserted":
                stats["created"] += 1
                print(f"[+] {article.source}: {article.title[:80]}")
            elif status == "skipped":
                stats["skipped"] += 1
            else:
                stats["errors"] += 1
                print(f"[!] {article.source}: {detail}")
    finally:
        sink.close()

    print(
        f"Done — created: {stats['created']}, "
        f"skipped: {stats['skipped']}, errors: {stats['errors']}"
    )
    print("=" * 60)
    return stats


if __name__ == "__main__":
    run_ingestion()
