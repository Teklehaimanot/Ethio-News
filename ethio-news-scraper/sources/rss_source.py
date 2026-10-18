import re
from datetime import datetime
from email.utils import parsedate_to_datetime
from typing import List, Optional

import feedparser

from models.article import Article
from services.normalizer import build_article
from utils.article_body import extract_article_body
from utils.http import fetch_html, meta_content, parse_html
from utils.image_extract import extract_article_image, simplify_wix_image_url
from utils.text import normalize_image_url, normalize_url

ENRICH_PAGE_SOURCES = {"BBC Amharic", "DW Amharic", "Fana MC"}


def _parse_published(entry) -> Optional[datetime]:
    if hasattr(entry, "published_parsed") and entry.published_parsed:
        try:
            return datetime(*entry.published_parsed[:6])
        except (TypeError, ValueError):
            pass
    if getattr(entry, "published", None):
        try:
            return parsedate_to_datetime(entry.published)
        except (TypeError, ValueError, IndexError):
            pass
    return None


def _image_from_entry(entry) -> str:
    if getattr(entry, "media_content", None):
        for media in entry.media_content:
            url = media.get("url")
            if url:
                return url
    if getattr(entry, "media_thumbnail", None):
        for thumb in entry.media_thumbnail:
            url = thumb.get("url")
            if url:
                return url
    if getattr(entry, "enclosures", None):
        for enc in entry.enclosures:
            if enc.get("type", "").startswith("image") and enc.get("href"):
                return enc["href"]
    summary = getattr(entry, "summary", "") or ""
    match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', summary, re.I)
    if match:
        return match.group(1)
    return ""


def _enrich_from_page(url: str, image: str) -> tuple[str, str]:
    image = simplify_wix_image_url(normalize_image_url(image, url))
    html = fetch_html(url)
    if not html:
        return "", image

    soup = parse_html(html)
    content = extract_article_body(soup, url)
    page_image = extract_article_image(soup, url)
    if page_image:
        image = page_image
    elif not image or not image.startswith(("http://", "https://")):
        image = meta_content(soup, "og:image", "twitter:image")
    image = simplify_wix_image_url(normalize_image_url(image, url))
    return content, image


def fetch_rss(source_name: str, feed_url: str, enrich_pages: bool = False) -> List[Article]:
    print(f"[RSS] Fetching {source_name} from {feed_url}")
    feed_body = fetch_html(feed_url)
    parsed = feedparser.parse(feed_body or feed_url)
    if parsed.bozo and not parsed.entries:
        print(f"[RSS] Feed error for {source_name}: {parsed.bozo_exception}")
        return []

    articles: List[Article] = []
    for entry in parsed.entries[:40]:
        link = normalize_url(getattr(entry, "link", "") or "")
        if not link:
            continue
        if "bbc.com/amharic" in link and "/topics/" in link:
            continue

        title = getattr(entry, "title", "") or ""
        rss_summary = getattr(entry, "summary", "") or getattr(entry, "description", "") or ""
        rss_summary = re.sub(r"<[^>]+>", " ", rss_summary).strip()
        image = simplify_wix_image_url(normalize_image_url(_image_from_entry(entry), link))

        if source_name in ENRICH_PAGE_SOURCES:
            content, image = _enrich_from_page(link, image)
        else:
            content = rss_summary
            image = normalize_image_url(image, link)

        if not content:
            content = rss_summary or title

        article = build_article(
            title=title,
            description=content,
            content=content,
            image=image,
            source=source_name,
            source_url=link,
            published_at=_parse_published(entry),
        )
        if article:
            articles.append(article)

    print(f"[RSS] {source_name}: parsed {len(articles)} articles")
    return articles
