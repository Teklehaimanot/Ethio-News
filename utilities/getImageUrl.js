import { baseUrl } from "../config";

export function getImageUrl(image) {
  if (!image) return null;
  if (image.startsWith("//")) {
    return `https:${image}`;
  }
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${baseUrl}/${image}`;
}
