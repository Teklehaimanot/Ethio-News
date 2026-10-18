import { baseUrl } from "../config";

const PROXY_HOSTS = [
  "static.wixstatic.com",
  "ichef.bbci.co.uk",
  "ethiopianreporter.com",
  "static.dw.com",
  "cdn4.telesco.pe",
  "cdn5.telesco.pe",
  "cdn1.telesco.pe",
];

const REFERERS = {
  "static.wixstatic.com": "https://www.shegerfm.com/",
  "ichef.bbci.co.uk": "https://www.bbc.com/",
  "ethiopianreporter.com": "https://ethiopianreporter.com/",
  "static.dw.com": "https://www.dw.com/",
};

function shouldProxy(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return PROXY_HOSTS.some(
      (allowed) => host === allowed || host.endsWith(`.${allowed}`)
    );
  } catch {
    return false;
  }
}

export function getImageUrl(image) {
  if (!image || typeof image !== "string") return null;

  const trimmed = image.trim();
  if (!trimmed) return null;

  let resolved = trimmed;
  if (trimmed.startsWith("//")) {
    resolved = `https:${trimmed}`;
  } else if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    resolved = trimmed.startsWith("/")
      ? `${baseUrl}${trimmed}`
      : `${baseUrl}/${trimmed.replace(/^\/+/, "")}`;
  }

  if (shouldProxy(resolved)) {
    return `${baseUrl}/api/v1/image/proxy?url=${encodeURIComponent(resolved)}`;
  }

  return resolved;
}

export function getImageHeaders(imageUrl) {
  if (!imageUrl) return undefined;

  try {
    const host = new URL(imageUrl).hostname.toLowerCase();
    const referer = REFERERS[host];
    if (referer) {
      return { Referer: referer };
    }
  } catch {
    return undefined;
  }

  return undefined;
}
