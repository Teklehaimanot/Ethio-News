from typing import Optional

from utils.http import fetch_html, meta_content, parse_html
from utils.text import normalize_image_url


def resolve_telegram_message_image(channel: str, message_id: int) -> str:
    channel = channel.lstrip("@").split("/")[-1]
    url = f"https://t.me/{channel}/{message_id}"
    html = fetch_html(url, referer="https://t.me/")
    if not html:
        return ""

    soup = parse_html(html)
    image = meta_content(soup, "og:image", "twitter:image")
    return normalize_image_url(image, url)


def resolve_link_image(page_url: str) -> str:
    if not page_url or "t.me/" in page_url:
        return ""

    html = fetch_html(page_url)
    if not html:
        return ""

    soup = parse_html(html)
    image = meta_content(soup, "og:image", "twitter:image")
    return normalize_image_url(image, page_url)


def resolve_telegram_post_image(
    channel: str,
    message_id: int,
    *,
    has_photo: bool = False,
    link_url: str = "",
) -> str:
    image = ""
    if has_photo or not link_url:
        image = resolve_telegram_message_image(channel, message_id)

    if not image and link_url:
        image = resolve_link_image(link_url)

    return image
