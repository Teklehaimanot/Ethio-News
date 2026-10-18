import re
from typing import List, Optional, Tuple
from urllib.parse import urljoin

from models.article import Article
from services.normalizer import build_article
from utils.article_body import extract_article_body
from utils.http import (
    fetch_html,
    fetch_jina_markdown,
    is_absolute_url,
    meta_content,
    parse_html,
)
from utils.image_extract import extract_article_image, simplify_wix_image_url
from utils.text import normalize_image_url

SITE_TITLE_SUFFIX = re.compile(
    r"\s*[-|–]\s*(?:ሪፖርተር|Ethiopian Reporter).*$",
    re.I,
)


def _collect_links(html: str, base_url: str, pattern: re.Pattern) -> List[str]:
    soup = parse_html(html)
    links = []
    seen = set()
    for anchor in soup.find_all("a", href=True):
        href = urljoin(base_url, anchor["href"])
        if pattern.search(href) and href not in seen:
            seen.add(href)
            links.append(href)
    return links


def _clean_title(title: str) -> str:
    title = (title or "").strip()
    title = SITE_TITLE_SUFFIX.sub("", title).strip()
    return title


def _parse_jina_markdown(md: str, page_url: str) -> Tuple[str, str, str]:
    """Extract title, body, and image URL from Jina Reader markdown."""
    title = ""
    image = ""
    title_match = re.search(r"^Title:\s*(.+)$", md, re.M)
    if title_match:
        title = _clean_title(title_match.group(1))

    h1_match = re.search(r"^#\s+(.+)$", md, re.M)
    if h1_match:
        title = _clean_title(h1_match.group(1)) or title

    img_match = re.search(
        r"https?://(?:www\.)?ethiopianreporter\.com/files/[^\s\)\"']+",
        md,
        re.I,
    )
    if img_match:
        image = img_match.group(0).rstrip(".,;")

    body_lines: List[str] = []
    in_content = "Markdown Content:" in md
    for raw in md.splitlines():
        line = raw.strip()
        if line.startswith("Markdown Content:"):
            in_content = True
            continue
        if not in_content:
            continue
        if not line or line.startswith("*") or line.startswith("#"):
            continue
        if line.startswith("Title:") or line.startswith("URL Source:"):
            continue
        if line.startswith("Published") or line.startswith("["):
            continue
        if line.startswith("!"):
            continue
        if re.match(r"^https?://", line):
            continue
        if len(line) < 50:
            continue
        # Skip related-story headings that are mostly links already filtered.
        if "ethiopianreporter.com" in line:
            continue
        body_lines.append(line)

    content = "\n\n".join(body_lines)
    return title, content, image


def _parse_article_page(url: str, source_name: str) -> Optional[Article]:
    html = fetch_html(url)
    title = ""
    content = ""
    image = ""

    if html:
        soup = parse_html(html)
        h1 = soup.find("h1")
        title = _clean_title(h1.get_text(" ", strip=True) if h1 else "")
        if not title:
            title = _clean_title(
                meta_content(soup, "og:title", "twitter:title")
                or (soup.title.get_text(strip=True) if soup.title else "")
            )
        content = extract_article_body(soup, url)
        image = extract_article_image(soup, url)
        image = simplify_wix_image_url(normalize_image_url(image, url))

    # Jina HTML often has og:title/image but no <h1>/<p>; use markdown for body.
    needs_markdown = (not title) or (len(content or "") < 120)
    if needs_markdown or not html:
        md = fetch_jina_markdown(url)
        if md:
            md_title, md_content, md_image = _parse_jina_markdown(md, url)
            title = title or md_title
            if len(md_content) > len(content or ""):
                content = md_content
            if not image and md_image:
                image = md_image

    if not title:
        return None

    return build_article(
        title=title,
        description=content,
        content=content,
        image=image,
        source=source_name,
        source_url=url,
    )


def _reporter_article_links(html: str, base_url: str) -> List[str]:
    """Collect numeric article URLs from anchors and raw HTML (JS/JSON embeds)."""
    article_pattern = re.compile(
        r"https?://(?:www\.)?ethiopianreporter\.com/(\d+)/?",
        re.I,
    )
    links: List[str] = []
    seen: set[str] = set()

    for link in _collect_links(
        html,
        base_url,
        re.compile(r"ethiopianreporter\.com/\d+/?(?:$|[?#])", re.I),
    ):
        normalized = re.sub(r"[?#].*$", "", link).rstrip("/") + "/"
        if normalized not in seen:
            seen.add(normalized)
            links.append(normalized)

    for match in article_pattern.finditer(html or ""):
        normalized = f"https://ethiopianreporter.com/{match.group(1)}/"
        if normalized not in seen:
            seen.add(normalized)
            links.append(normalized)

    return links


def fetch_ethiopian_reporter(list_urls: List[str]) -> List[Article]:
    source_name = "Ethiopian Reporter"

    links: List[str] = []
    for list_url in list_urls:
        html = fetch_html(list_url)
        page_links = _reporter_article_links(html or "", list_url) if html else []
        if len(page_links) < 3:
            md = fetch_jina_markdown(list_url)
            if md:
                page_links = _reporter_article_links(md, list_url)
        if not page_links:
            print(f"[Scraper] Ethiopian Reporter: empty list page {list_url}")
            continue
        print(
            f"[Scraper] Ethiopian Reporter: found {len(page_links)} links on {list_url}"
        )
        for link in page_links:
            if link not in links:
                links.append(link)

    print(f"[Scraper] Ethiopian Reporter: {len(links)} unique article links")

    articles: List[Article] = []
    for link in links[:25]:
        article = _parse_article_page(link, source_name)
        if not article:
            continue
        # Keep articles even when image is missing/generic — normalizer fills default.
        articles.append(article)

    print(f"[Scraper] Ethiopian Reporter: parsed {len(articles)} articles")
    return articles


def fetch_sheger(list_urls: List[str]) -> List[Article]:
    source_name = "Sheger FM"
    articles: List[Article] = []

    for list_url in list_urls:
        html = fetch_html(list_url)
        if not html:
            continue
        soup = parse_html(html)

        for block in soup.select("a[href]"):
            href = block.get("href", "")
            if not href or href.startswith("#"):
                continue
            if not is_absolute_url(href):
                href = urljoin(list_url, href)
            if "shegerfm.com" not in href:
                continue
            if any(x in href for x in ["/blog/", "/post/", "/news/"]):
                article = _parse_article_page(href, source_name)
                if article and article.source_url not in {a.source_url for a in articles}:
                    articles.append(article)

        if not articles:
            for heading in soup.find_all(["h2", "h3", "h4"]):
                parent_link = heading.find_parent("a", href=True)
                if not parent_link:
                    continue
                href = urljoin(list_url, parent_link["href"])
                article = _parse_article_page(href, source_name)
                if article and article.source_url not in {a.source_url for a in articles}:
                    articles.append(article)

    print(f"[Scraper] Sheger FM: parsed {len(articles)} articles")
    return articles[:20]
