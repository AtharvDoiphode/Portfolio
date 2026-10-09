// Next's default image widths; the optimiser only accepts these.
const NEXT_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

/**
 * Asks Cloudinary for a resized, auto-format copy of an uploaded image. Bundled images in /public
 * (the defaults shown until something is uploaded) go through Next's optimiser instead. Other URLs pass through unchanged.
 */
export function img(url: string, width = 1200): string {
  if (url.startsWith("/") && !url.startsWith("//")) {
    const w = NEXT_WIDTHS.find((n) => n >= width) ?? NEXT_WIDTHS[NEXT_WIDTHS.length - 1];
    return `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=80`;
  }
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}

/** A still frame from an uploaded Cloudinary video, used as the video poster. */
export function videoPoster(url: string, width = 1200): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/video/upload/")) return "";
  return url.replace("/video/upload/", `/video/upload/so_0,f_jpg,q_auto,w_${width}/`).replace(/\.[a-z0-9]+$/i, ".jpg");
}
