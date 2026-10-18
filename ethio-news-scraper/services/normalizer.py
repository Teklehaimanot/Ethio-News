from datetime import datetime, timezone
import re
from typing import Optional

from config.settings import DEFAULT_NEWS_IMAGE
from models.article import Article
from utils.article_body import make_teaser
from utils.text import (
    content_hash,
    extract_external_id,
    normalize_image_url,
    normalize_text,
    normalize_url,
)


def build_article(
    *,
    title: str,
    description: str,
    image: str,
    source: str,
    source_url: str,
    content: Optional[str] = None,
    published_at: Optional[datetime] = None,
    imported_via: Optional[str] = None,
) -> Optional[Article]:
    title = normalize_text(title)
    source_url = normalize_url(source_url)

    if not title or not source_url:
        return None

    full_content = (content or description or "").strip()
    full_content = re.sub(r"\n{3,}", "\n\n", full_content)
    if not full_content:
        full_content = title

    teaser = make_teaser(re.sub(r"\s+", " ", full_content))

    if not image or not image.strip():
        image = DEFAULT_NEWS_IMAGE
    else:
        image = normalize_image_url(image.strip(), source_url) or DEFAULT_NEWS_IMAGE

    external_id = extract_external_id(source_url)
    return Article(
        title=title,
        description=teaser,
        content=full_content,
        image=image,
        source=source,
        source_url=source_url,
        external_id=external_id or None,
        published_at=published_at or datetime.now(timezone.utc),
        imported_via=imported_via,
        content_hash=content_hash(title, full_content),
    )
