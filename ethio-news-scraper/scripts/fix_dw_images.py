#!/usr/bin/env python3
"""Re-fetch and fix image URLs for existing DW Amharic articles in MongoDB."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from config.settings import DEFAULT_NEWS_IMAGE
from services.mongo_sink import MongoSink
from utils.http import fetch_html, meta_content, parse_html
from utils.text import normalize_image_url

SOURCE_NAME = "DW Amharic"
PLACEHOLDER_HOSTS = ("via.placeholder.com", "placeholder.com")


def is_bad_image(image: str) -> bool:
    if not image:
        return True
    if image.startswith("//") or image.startswith("/"):
        return True
    if any(host in image for host in PLACEHOLDER_HOSTS):
        return True
    if not image.startswith(("http://", "https://")):
        return True
    return False


def resolve_image(source_url: str, current_image: str) -> str:
    normalized = normalize_image_url(current_image, source_url)
    if normalized and not is_bad_image(normalized):
        return normalized

    html = fetch_html(source_url)
    if not html:
        return normalized or DEFAULT_NEWS_IMAGE

    soup = parse_html(html)
    og_image = meta_content(soup, "og:image", "twitter:image")
    resolved = normalize_image_url(og_image, source_url)
    return resolved or DEFAULT_NEWS_IMAGE


def main() -> None:
    sink = MongoSink()
    updated = 0
    skipped = 0

    try:
        query = {"source": SOURCE_NAME}
        for doc in sink.news.find(query):
            current = doc.get("image", "")
            if not is_bad_image(current):
                skipped += 1
                continue

            source_url = doc.get("sourceUrl", "")
            if not source_url:
                skipped += 1
                continue

            new_image = resolve_image(source_url, current)
            if new_image == current:
                skipped += 1
                continue

            sink.news.update_one(
                {"_id": doc["_id"]},
                {"$set": {"image": new_image}},
            )
            updated += 1
            print(f"[fixed] {doc.get('title', '')[:70]}")
            print(f"        {current[:80]} -> {new_image[:80]}")
    finally:
        sink.close()

    print(f"Done — updated: {updated}, skipped: {skipped}")


if __name__ == "__main__":
    main()
