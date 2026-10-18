const axios = require("axios");

const ALLOWED_HOSTS = new Set([
  "static.wixstatic.com",
  "ichef.bbci.co.uk",
  "ethiopianreporter.com",
  "www.ethiopianreporter.com",
  "static.dw.com",
  "cdn4.telesco.pe",
  "cdn5.telesco.pe",
  "cdn1.telesco.pe",
  "www.fanamc.com",
  "fanamc.com",
]);

const REFERERS = {
  "static.wixstatic.com": "https://www.shegerfm.com/",
  "ichef.bbci.co.uk": "https://www.bbc.com/",
  "ethiopianreporter.com": "https://ethiopianreporter.com/",
  "www.ethiopianreporter.com": "https://ethiopianreporter.com/",
  "static.dw.com": "https://www.dw.com/",
};

function isAllowedImageUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return false;
    }
    return ALLOWED_HOSTS.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

const proxyImage = async (req, res) => {
  const rawUrl = req.query.url;
  if (!rawUrl || !isAllowedImageUrl(rawUrl)) {
    return res.status(400).json({ error: "Invalid or unsupported image URL" });
  }

  try {
    const parsed = new URL(rawUrl);
    const referer = REFERERS[parsed.hostname.toLowerCase()] || parsed.origin;

    const response = await axios.get(rawUrl, {
      responseType: "stream",
      timeout: 20000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/122.0.0.0 Mobile Safari/537.36",
        Accept: "image/*,*/*",
        Referer: referer,
      },
      maxRedirects: 5,
      validateStatus: (status) => status < 400,
    });

    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "image/jpeg"
    );
    res.setHeader("Cache-Control", "public, max-age=86400");
    response.data.pipe(res);
  } catch (error) {
    console.error("[ImageProxy]", rawUrl, error.message);
    res.status(502).json({ error: "Failed to fetch image" });
  }
};

module.exports = { proxyImage };
