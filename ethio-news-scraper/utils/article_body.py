import re
from typing import Optional

from bs4 import BeautifulSoup

from utils.http import meta_content

TEASER_MAX_LENGTH = 300
CONTENT_MAX_LENGTH = 15000

BODY_CLASS_PATTERN = re.compile(
    r"article-body|story-body|entry-content|post-content|rich-text|text-block|article__body",
    re.I,
)


def _paragraphs_from_element(element) -> list[str]:
    paragraphs = []
    for node in element.find_all("p"):
        text = node.get_text(" ", strip=True)
        if len(text) > 20:
            paragraphs.append(text)
    return paragraphs


def extract_article_body(soup: BeautifulSoup, page_url: str = "") -> str:
    candidates = []

    article = soup.find("article")
    if article:
        candidates.extend(_paragraphs_from_element(article))

    for div in soup.find_all("div", class_=BODY_CLASS_PATTERN):
        candidates.extend(_paragraphs_from_element(div))

    for div in soup.find_all("div", attrs={"data-component": "text-block"}):
        candidates.extend(_paragraphs_from_element(div))

    if not candidates:
        main = soup.find("main")
        if main:
            candidates.extend(_paragraphs_from_element(main))

    if not candidates:
        for paragraph in soup.find_all("p"):
            text = paragraph.get_text(" ", strip=True)
            if len(text) > 40:
                candidates.append(text)

    if not candidates:
        fallback = meta_content(soup, "og:description", "description", "twitter:description")
        return fallback

    seen = set()
    unique = []
    for paragraph in candidates:
        if paragraph not in seen:
            seen.add(paragraph)
            unique.append(paragraph)

    body = "\n\n".join(unique)
    if len(body) > CONTENT_MAX_LENGTH:
        body = body[: CONTENT_MAX_LENGTH - 3].rstrip() + "..."
    return body


def make_teaser(text: str, max_length: int = TEASER_MAX_LENGTH) -> str:
    text = re.sub(r"\s+", " ", (text or "").strip())
    if len(text) <= max_length:
        return text
    return text[: max_length - 3].rstrip() + "..."
