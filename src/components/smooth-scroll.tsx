import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Only run smooth scroll on desktop non-touch devices — it's the biggest
    // source of scroll jank on mobile and low-end laptops.
    const isDesktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
    if (reduce || !isDesktop) return;

    const lenis = new Lenis({
      duration: 0.6,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.2,
      lerp: 0.14,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}

