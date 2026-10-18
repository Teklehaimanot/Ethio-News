#!/usr/bin/env python3
"""Re-fetch full article body for imported news missing the content field."""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services.mongo_sink import MongoSink
from utils.article_body import extract_article_body, make_teaser
from utils.http import fetch_html, parse_html
from utils.text import content_hash


def needs_refresh(doc: dict) -> bool:
    content = (doc.get("content") or "").strip()
    if not content:
        return True
    description = (doc.get("description") or "").strip()
    if description and len(content) <= len(description) + 20:
        return True
    return len(content) < 400


def main() -> None:
    sink = MongoSink()
    updated = 0
    skipped = 0
    failed = 0

    try:
        query = {"isImported": True, "sourceUrl": {"$exists": True, "$ne": ""}}
        for doc in sink.news.find(query):
            if not needs_refresh(doc):
                skipped += 1
                continue

            source_url = doc.get("sourceUrl", "")
            title = doc.get("title", "")

            html = fetch_html(source_url)
            if not html:
                failed += 1
                print(f"[failed] fetch: {title[:70]}")
                continue

            soup = parse_html(html)
            body = extract_article_body(soup, source_url)
            body = body.strip()
            body = re.sub(r"\n{3,}", "\n\n", body)
            if not body or len(body) < 100:
                failed += 1
                print(f"[failed] short body: {title[:70]}")
                continue

            teaser = make_teaser(body)
            sink.news.update_one(
                {"_id": doc["_id"]},
                {
                    "$set": {
                        "content": body,
                        "description": teaser,
                        "contentHash": content_hash(title, body),
                    }
                },
            )
            updated += 1
            print(f"[updated] {title[:70]} ({len(body)} chars)")
    finally:
        sink.close()

    print(f"Done — updated: {updated}, skipped: {skipped}, failed: {failed}")


if __name__ == "__main__":
    main()
