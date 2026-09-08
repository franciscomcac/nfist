// The source photographs are 15–24 megapixel originals straight from the NFIST
// media server. Rendered untouched, a single page decodes ~110 MP (roughly
// 420 MB of bitmap), which is what made scrolling stutter.
//
// A previous proxy was removed for degrading quality. The fix is not to skip
// resizing, it is to resize generously: served at the widths the layout
// actually asks for, at quality 88, and never upscaled. Combined with a real
// srcSet the browser picks the right file for the element size AND the screen
// density, so a 2x display still gets a 2x asset.

const ENDPOINT = "https://wsrv.nl/";
const QUALITY = 88;

/** Widths beyond this are pointless — no layout slot on the site is this wide. */
const MAX_WIDTH = 2400;

function isRemote(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function img(url: string, width?: number, quality: number = QUALITY): string {
  if (!url || !isRemote(url)) return url;

  const params = [
    "url=" + encodeURIComponent(url),
    "q=" + quality,
    // WebP at q88 is visually indistinguishable here and a fraction of the bytes.
    "output=webp",
    // Never enlarge: a small source stays untouched rather than being blown up.
    "we",
  ];

  if (width) params.push("w=" + Math.min(Math.round(width), MAX_WIDTH));

  return ENDPOINT + "?" + params.join("&");
}

/**
 * The call sites describe the widths the *layout* needs. A 2x display needs
 * twice that to look sharp — and a soft image on a Retina screen is exactly
 * what got the previous proxy pulled. So the ladder is extended with 1.5x and
 * 2x rungs and the browser, which knows the real device pixel ratio, picks.
 */
export function imgSrcSet(url: string, widths: number[] = [], quality: number = QUALITY): string {
  if (!url || !isRemote(url) || widths.length === 0) return "";

  const base = widths.map((w) => Math.round(w));
  const largest = Math.max(...base);
  const retina = [Math.round(largest * 1.5), largest * 2];

  const ladder = [...base, ...retina].map((w) => Math.min(w, MAX_WIDTH)).filter((w) => w > 0);

  const unique = [...new Set(ladder)].sort((a, b) => a - b);

  return unique.map((w) => img(url, w, quality) + " " + w + "w").join(", ");
}
