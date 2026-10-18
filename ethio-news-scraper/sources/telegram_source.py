import asyncio
import re
from typing import List

from config.settings import (
    TELEGRAM_API_HASH,
    TELEGRAM_API_ID,
    TELEGRAM_CHANNELS,
    TELEGRAM_MESSAGE_LIMIT,
    TELEGRAM_SESSION_NAME,
)
from models.article import Article
from services.normalizer import build_article
from utils.telegram_image import resolve_telegram_post_image
from utils.text import normalize_url


async def _fetch_telegram_async() -> List[Article]:
    from telethon import TelegramClient

    client = TelegramClient(TELEGRAM_SESSION_NAME, int(TELEGRAM_API_ID), TELEGRAM_API_HASH)
    articles: List[Article] = []

    await client.start()
    try:
        for channel in TELEGRAM_CHANNELS:
            channel_name = channel.lstrip("@").replace("https://t.me/", "").split("/")[0]
            print(f"[Telegram] Fetching @{channel_name}")
            async for message in client.iter_messages(channel, limit=TELEGRAM_MESSAGE_LIMIT):
                text = (message.text or message.message or "").strip()
                has_photo = bool(message.photo)

                if not text and not has_photo:
                    continue

                lines = [line.strip() for line in text.splitlines() if line.strip()]
                title = lines[0][:300] if lines else f"Update from @{channel_name}"
                description = "\n".join(lines[1:]) if len(lines) > 1 else (text or title)

                source_url = ""
                link_url = ""
                source_label = f"Telegram @{channel_name}"

                if message.web_preview and message.web_preview.url:
                    link_url = normalize_url(message.web_preview.url)
                    source_url = link_url
                    if message.web_preview.title:
                        title = message.web_preview.title
                    if message.web_preview.description:
                        description = message.web_preview.description

                url_match = re.search(r"https?://[^\s]+", text)
                if url_match:
                    found_url = normalize_url(url_match.group(0).rstrip(").,"))
                    if not link_url:
                        link_url = found_url
                    if not source_url:
                        source_url = found_url

                if not source_url:
                    source_url = f"https://t.me/{channel_name}/{message.id}"

                image = resolve_telegram_post_image(
                    channel_name,
                    message.id,
                    has_photo=has_photo,
                    link_url=link_url,
                )

                article = build_article(
                    title=title,
                    description=description,
                    content=description,
                    image=image,
                    source=source_label,
                    source_url=source_url,
                    published_at=message.date,
                    imported_via="telegram",
                )
                if article:
                    article.external_id = f"tg_{channel_name}_{message.id}"
                    articles.append(article)
    finally:
        await client.disconnect()

    print(f"[Telegram] parsed {len(articles)} messages")
    return articles


def fetch_telegram() -> List[Article]:
    if not TELEGRAM_API_ID or not TELEGRAM_API_HASH or not TELEGRAM_CHANNELS:
        print("[Telegram] Skipped — configure TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_CHANNELS")
        return []
    return asyncio.run(_fetch_telegram_async())
