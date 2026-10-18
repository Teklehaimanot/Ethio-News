#!/usr/bin/env python3
"""Re-fetch image URLs for imported Telegram articles in MongoDB."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from config.settings import DEFAULT_NEWS_IMAGE
from services.mongo_sink import MongoSink
from utils.telegram_image import resolve_telegram_message_image

PLACEHOLDER_HOSTS = ("via.placeholder.com", "placeholder.com")


def is_bad_image(image: str) -> bool:
    if not image:
        return True
    if any(host in image for host in PLACEHOLDER_HOSTS):
        return True
    if not image.startswith(("http://", "https://")):
        return True
    return False


def parse_telegram_post(source_url: str, external_id: str) -> tuple[str, int] | tuple[None, None]:
    if external_id and external_id.startswith("tg_"):
        parts = external_id.split("_", 2)
        if len(parts) == 3:
            try:
                return parts[1], int(parts[2])
            except ValueError:
                pass

    match = re_match_tme(source_url)
    if match:
        return match.group(1), int(match.group(2))
    return None, None


def re_match_tme(url: str):
    import re

    return re.search(r"t\.me/([^/?#]+)/(\d+)", url or "")


def main() -> None:
    sink = MongoSink()
    updated = 0
    skipped = 0
    failed = 0

    try:
        query = {"importedVia": "telegram"}
        for doc in sink.news.find(query):
            current = doc.get("image", "")
            if not is_bad_image(current):
                skipped += 1
                continue

            channel, message_id = parse_telegram_post(
                doc.get("sourceUrl", ""),
                doc.get("externalId", ""),
            )
            if not channel or not message_id:
                failed += 1
                print(f"[failed] no message id: {doc.get('title', '')[:70]}")
                continue

            new_image = resolve_telegram_message_image(channel, message_id)
            if not new_image or is_bad_image(new_image):
                failed += 1
                print(f"[failed] no image: {doc.get('title', '')[:70]}")
                continue

            sink.news.update_one(
                {"_id": doc["_id"]},
                {"$set": {"image": new_image}},
            )
            updated += 1
            print(f"[fixed] {doc.get('title', '')[:70]}")
    finally:
        sink.close()

    print(f"Done — updated: {updated}, skipped: {skipped}, failed: {failed}")


if __name__ == "__main__":
    main()
