import { useEffect, useRef, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** Only for genuinely above-the-fold art. Everything else competes with it. */
  priority?: boolean;
};

/**
 * Never lazy-loaded: the download starts on mount, and — more importantly — the
 * bitmap is decoded ahead of time.
 *
 * src/lib/img.ts intentionally serves the untouched full-resolution originals,
 * so decoding is the expensive part, not the download. Left alone the browser
 * decodes on the frame the image first paints, which is exactly when you are
 * scrolling towards it — that is the stutter. decode() moves that work off the
 * paint path so the image is already rasterised when it arrives on screen.
 */
export function AsyncImg({ className, priority = false, ...rest }: Props) {
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof el.decode !== "function") return;

    let cancelled = false;
    const warm = () => {
      if (cancelled) return;
      el.decode().catch(() => {
        /* decode races a src swap or a broken image — nothing to do */
      });
    };

    if (el.complete) warm();
    else el.addEventListener("load", warm, { once: true });

    return () => {
      cancelled = true;
      el.removeEventListener("load", warm);
    };
  }, []);

  return (
    <img
      ref={ref}
      loading="eager"
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn(className)}
      {...rest}
    />
  );
}
