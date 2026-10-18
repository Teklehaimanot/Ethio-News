import re
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup

from utils.http import meta_content
from utils.text import normalize_image_url

GENERIC_IMAGES = (
    "ethiopian-reporter-social-media.jpg",
    "ethiopianreporter-social-media.jpg",
    "via.placeholder.com",
    "placeholder.com",
)

SKIP_IMAGE_PATTERNS = re.compile(
    r"logo|icon|avatar|banner|advert|ad-|/ads/|728x90|728x89|300x250|"
    r"ezgif|master-card|reporter-ad|social-media|favicon|emoji|"
    r"w_34,h_34|w_140,h_1|400x400|300x300|slider-|td-a-rec|td_spot",
    re.I,
)


def _is_generic_image(url: str) -> bool:
    if not url:
        return True
    lower = url.lower()
    return any(token in lower for token in GENERIC_IMAGES)


def _is_usable_image(url: str) -> bool:
    if not url or url.startswith("data:"):
        return False
    if _is_generic_image(url):
        return False
    if SKIP_IMAGE_PATTERNS.search(url):
        return False
    return True


def simplify_wix_image_url(url: str) -> str:
    if not url or "wixstatic.com" not in url:
        return url
    match = re.match(
        r"(https?://static\.wixstatic\.com/media/[^/]+~mv2\.(?:jpg|jpeg|png|webp))",
        url,
        re.I,
    )
    if match:
        return match.group(1)
    return url


def _score_image(url: str, width: int = 0, height: int = 0) -> int:
    score = 0
    lower = url.lower()
    if "photo_" in lower or "image_" in lower:
        score += 100
    if width and height:
        score += min(width * height, 500_000) // 1000
    if "files/" in lower:
        score += 40
    if "wixstatic.com/media/" in lower:
        score += 40
    if "ichef.bbci.co.uk" in lower or "static.dw.com" in lower:
        score += 40
    if re.search(r"w_\d+,h_\d+", lower):
        score += 20
    return score


def extract_article_image(soup: BeautifulSoup, page_url: str = "") -> str:
    for key in ("og:image", "twitter:image", "image"):
        url = meta_content(soup, key)
        url = simplify_wix_image_url(normalize_image_url(url, page_url))
        if _is_usable_image(url):
            return url

    candidates: list[tuple[int, str]] = []
    selectors = [
        "article img",
        ".entry-content img",
        ".post-content img",
        ".jeg_post_featured img",
        ".featured_image img",
        "figure img",
        "main img",
    ]
    for selector in selectors:
        for img in soup.select(selector):
            src = (
                img.get("src")
                or img.get("data-src")
                or img.get("data-lazy-src")
                or img.get("data-original")
                or ""
            )
            src = simplify_wix_image_url(normalize_image_url(src, page_url))
            if not _is_usable_image(src):
                continue
            parent_classes = " ".join(
                cls
                for parent in img.parents
                if parent.get("class")
                for cls in parent.get("class", [])
            )
            if re.search(r"slider|td-a-rec|td_spot|sidebar|widget", parent_classes, re.I):
                continue
            width = int(img.get("width") or 0)
            height = int(img.get("height") or 0)
            candidates.append((_score_image(src, width, height), src))

    if not candidates:
        return ""

    candidates.sort(key=lambda item: item[0], reverse=True)
    return candidates[0][1]
