import time
from typing import Optional

import requests
from bs4 import BeautifulSoup

from config.settings import REQUEST_DELAY_SECONDS, REQUEST_TIMEOUT

_last_request_at: dict[str, float] = {}
SESSION = requests.Session()
SESSION.headers.update(
    {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "am,en-US;q=0.9,en;q=0.8",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
    }
)

JINA_READER_PREFIX = "https://r.jina.ai/"


def throttle(domain: str) -> None:
    now = time.time()
    last = _last_request_at.get(domain, 0)
    wait = REQUEST_DELAY_SECONDS - (now - last)
    if wait > 0:
        time.sleep(wait)
    _last_request_at[domain] = time.time()


def _looks_like_cloudflare_error(html: str) -> bool:
    if not html:
        return True
    lower = html.lower()
    return (
        "cf-error-details" in lower
        or "error code 520" in lower
        or "error code 521" in lower
        or "error code 522" in lower
        or "web server is returning an unknown error" in lower
    )


def fetch_jina_markdown(url: str) -> Optional[str]:
    """Readable markdown via Jina Reader (works when origin returns Cloudflare 5xx)."""
    jina_url = f"{JINA_READER_PREFIX}{url}"
    try:
        throttle("r.jina.ai")
        response = SESSION.get(jina_url, timeout=max(REQUEST_TIMEOUT, 45))
        response.raise_for_status()
        text = response.text or ""
        if "Title:" in text or "Markdown Content:" in text or len(text) > 800:
            return text
    except requests.RequestException as exc:
        print(f"[HTTP] Jina markdown failed for {url}: {exc}")
    return None


def _fetch_via_jina_html(url: str) -> Optional[str]:
    """HTML via Jina Reader when origin/CDN returns 5xx."""
    jina_url = f"{JINA_READER_PREFIX}{url}"
    try:
        throttle("r.jina.ai")
        response = SESSION.get(
            jina_url,
            timeout=max(REQUEST_TIMEOUT, 45),
            headers={"X-Return-Format": "html"},
        )
        response.raise_for_status()
        html = response.text
        if html and not _looks_like_cloudflare_error(html) and len(html) > 500:
            print(f"[HTTP] Jina HTML fallback OK for {url}")
            return html
        print(f"[HTTP] Jina HTML fallback unusable for {url}")
    except requests.RequestException as exc:
        print(f"[HTTP] Jina HTML fallback failed for {url}: {exc}")
    return None


def fetch_html(
    url: str,
    referer: Optional[str] = None,
    *,
    retries: int = 1,
    allow_jina_fallback: bool = True,
) -> Optional[str]:
    parsed = requests.utils.urlparse(url)
    domain = parsed.netloc
    headers = {}
    if referer:
        headers["Referer"] = referer
    elif domain:
        headers["Referer"] = f"{parsed.scheme or 'https'}://{domain}/"

    last_error: Optional[Exception] = None
    for attempt in range(retries + 1):
        throttle(domain)
        try:
            response = SESSION.get(url, timeout=REQUEST_TIMEOUT, headers=headers)
            if response.status_code >= 500 or _looks_like_cloudflare_error(
                response.text
            ):
                last_error = requests.HTTPError(
                    f"{response.status_code} for url: {url}",
                    response=response,
                )
                # Cloudflare 5xx rarely recovers in a second — fail over quickly.
                if response.status_code >= 520 or _looks_like_cloudflare_error(
                    response.text
                ):
                    break
                if attempt < retries:
                    time.sleep(1.2 * (attempt + 1))
                    continue
                break

            response.raise_for_status()
            return response.text
        except requests.RequestException as exc:
            last_error = exc
            if attempt < retries:
                time.sleep(1.2 * (attempt + 1))
                continue

    if allow_jina_fallback:
        fallback = _fetch_via_jina_html(url)
        if fallback:
            return fallback

    print(f"[HTTP] Failed to fetch {url}: {last_error}")
    return None


def parse_html(html: str) -> BeautifulSoup:
    return BeautifulSoup(html, "lxml")


def meta_content(soup: BeautifulSoup, *keys: str) -> str:
    for key in keys:
        tag = soup.find("meta", property=key) or soup.find("meta", attrs={"name": key})
        if tag and tag.get("content"):
            return tag["content"].strip()
    return ""


def is_absolute_url(url: str) -> bool:
    return url.startswith("http://") or url.startswith("https://")
