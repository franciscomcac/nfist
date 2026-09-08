import { useEffect } from "react";
import { EVENTS } from "@/content/events";
import { DIVISIONS } from "@/content/divisions";
import { img, imgSrcSet } from "@/lib/img";
import { loadGoogleMaps } from "@/lib/google-maps";

/**
 * Start all known media requests as soon as the app hydrates. The same srcSet
 * and sizes used by the pages are assigned here, so the browser warms the exact
 * transformed file it will later render rather than an unused original URL.
 */
export function ImagePrefetcher() {
  useEffect(() => {
    const heroUrls = new Set<string>();
    const galleryUrls = new Set<string>();
    for (const e of EVENTS) {
      if (e.hero) heroUrls.add(e.hero);
      e.gallery?.forEach((g) => galleryUrls.add(g));
    }
    for (const d of DIVISIONS) {
      if (d.hero) heroUrls.add(d.hero);
      d.gallery?.forEach((g) => galleryUrls.add(g));
    }

    type Warm = { url: string; hero: boolean; sizes: string; widths: number[]; base: number };
    const list: Warm[] = [
      // Full-bleed detail hero variant.
      ...Array.from(heroUrls, (url) => ({
        url,
        hero: true,
        sizes: "100vw",
        widths: [768, 1200, 1600, 1920],
        base: 1600,
      })),
      // Half-width overview variant.
      ...Array.from(heroUrls, (url) => ({
        url,
        hero: true,
        sizes: "(min-width: 768px) 50vw, 100vw",
        widths: [600, 900, 1200],
        base: 1000,
      })),
      ...Array.from(galleryUrls, (url) => ({
        url,
        hero: false,
        sizes: "(min-width: 640px) 33vw, 50vw",
        widths: [400, 600, 900],
        base: 600,
      })),
    ];
    let cancelled = false;
    let cursor = 0;
    const MAX_CONCURRENT = 30;
    let inflight = 0;

    const pump = () => {
      if (cancelled) return;
      while (inflight < MAX_CONCURRENT && cursor < list.length) {
        const item = list[cursor++];
        inflight++;
        const image = new Image();
        image.loading = "eager";
        image.decoding = "async";
        image.fetchPriority = item.hero ? "high" : "auto";
        image.sizes = item.hero ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 640px) 33vw, 50vw";
        image.srcset = item.hero
          ? imgSrcSet(item.url, [600, 900, 1200])
          : imgSrcSet(item.url, [400, 600, 900]);
        const done = () => {
          inflight--;
          if (!cancelled) pump();
        };
        image.onload = () => {
          if (typeof image.decode === "function") {
            image.decode().then(done, done);
          } else {
            done();
          }
        };
        image.onerror = done;
        image.src = img(item.url, item.hero ? 1000 : 600);
      }
    };

    pump();
    void loadGoogleMaps().catch(() => {
      // Individual map components surface loader failures when they mount.
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
