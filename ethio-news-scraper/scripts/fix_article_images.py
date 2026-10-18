#!/usr/bin/env python3
"""Re-fetch article images for imported news from page sourceUrl."""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services.mongo_sink import MongoSink
from utils.http import fetch_html, parse_html
from utils.image_extract import extract_article_image, simplify_wix_image_url
from utils.text import normalize_image_url

GENERIC = re.compile(r"social-media|placeholder|via\.placeholder", re.I)
SOURCES = ["Sheger FM", "BBC Amharic", "Ethiopian Reporter", "DW Amharic", "Fana MC"]


def is_bad(image: str) -> bool:
    if not image or not image.startswith(("http://", "https://")):
        return True
    if GENERIC.search(image):
        return True
    if "wixstatic.com" in image and "/v1/fill/" in image:
        return True
    return False


def should_refresh(doc: dict) -> bool:
    image = doc.get("image", "")
    if is_bad(image):
        return True
    source = doc.get("source", "")
    source_url = doc.get("sourceUrl", "")
    if source == "Ethiopian Reporter" and not re.search(r"/\d+/?$", source_url):
        return True
    return False


def main() -> None:
    sink = MongoSink()
    updated = 0
    skipped = 0
    failed = 0

    try:
        query = {"source": {"$in": SOURCES}, "sourceUrl": {"$exists": True, "$ne": ""}}
        for doc in sink.news.find(query):
            current = doc.get("image", "")
            if not should_refresh(doc):
                skipped += 1
                continue

            source_url = doc.get("sourceUrl", "")
            if doc.get("source") == "Ethiopian Reporter" and not re.search(
                r"/\d+/?$", source_url
            ):
                sink.news.delete_one({"_id": doc["_id"]})
                updated += 1
                print(f"[deleted] bad Reporter listing page: {doc.get('title', '')[:60]}")
                continue
            html = fetch_html(source_url)
            if not html:
                failed += 1
                continue

            soup = parse_html(html)
            new_image = extract_article_image(soup, source_url)
            new_image = simplify_wix_image_url(normalize_image_url(new_image, source_url))
            if not new_image or GENERIC.search(new_image):
                failed += 1
                print(f"[failed] {doc.get('source')} | {doc.get('title', '')[:60]}")
                continue
            if new_image == current and not (
                "wixstatic.com" in current and "/v1/fill/" in current
            ):
                skipped += 1
                continue

            sink.news.update_one({"_id": doc["_id"]}, {"$set": {"image": new_image}})
            updated += 1
            print(f"[fixed] {doc.get('source')} | {doc.get('title', '')[:60]}")
            print(f"        {new_image[:90]}")
    finally:
        sink.close()

    print(f"Done — updated: {updated}, skipped: {skipped}, failed: {failed}")


if __name__ == "__main__":
    main()
