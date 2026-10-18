import re
import hashlib
from urllib.parse import parse_qs, urlencode, urljoin, urlparse, urlunparse


def normalize_url(url: str) -> str:
    if not url:
        return ""
    parsed = urlparse(url.strip())
    query = parse_qs(parsed.query)
    filtered = {
        k: v
        for k, v in query.items()
        if not k.lower().startswith("utm_") and k.lower() not in {"fbclid", "mc_cid", "mc_eid"}
    }
    clean_query = urlencode(filtered, doseq=True)
    path = parsed.path.rstrip("/") or "/"
    netloc = parsed.netloc.lower()
    if netloc.startswith("www."):
        netloc = netloc[4:]
    return urlunparse((parsed.scheme.lower(), netloc, path, "", clean_query, ""))


def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text.strip())
    return text


def content_hash(title: str, description: str) -> str:
    payload = f"{normalize_text(title)}|{normalize_text(description)[:200]}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def normalize_image_url(image: str, page_url: str = "") -> str:
    if not image:
        return ""
    image = image.strip()
    if image.startswith("//"):
        return f"https:{image}"
    if image.startswith("/"):
        if page_url:
            return urljoin(page_url, image)
        return ""
    if image.startswith("http://") or image.startswith("https://"):
        return image
    return image


def simplify_wix_image_url(image: str) -> str:
    if not image or "wixstatic.com" not in image:
        return image
    match = re.match(
        r"(https?://static\.wixstatic\.com/media/[^/]+~mv2\.(?:jpg|jpeg|png|webp))",
        image,
        re.I,
    )
    return match.group(1) if match else image


def extract_external_id(url: str) -> str:
    if not url:
        return ""
    path = urlparse(url).path.rstrip("/")
    if not path:
        return ""
    return path.split("/")[-1]
