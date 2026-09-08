import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/* ============================================================
   Motion primitives — hand-rolled, no animation dependencies.
   Pairs with the MOTION LAYER block in src/styles.css.

   Everything here is SSR-safe: the server renders the final
   content, and the entrance state is applied on the client only.
   ============================================================ */

export type RevealDir = "up" | "down" | "left" | "right" | "scale" | "blur" | "none";

export function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Fires once, the first time the element crosses into view. */
function onceInView(el: Element, threshold: number, run: () => void, rootMargin = "0px 0px -40px 0px") {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run();
          io.disconnect();
        }
      });
    },
    { threshold, rootMargin },
  );
  io.observe(el);
  return io;
}

/* ---------------------------------------------------------- */
/* Reveal                                                      */
/* ---------------------------------------------------------- */

export function Reveal({
  children,
  as: As = "div",
  delay = 0,
  dir = "up",
  amount = 0.12,
  className = "",
  style,
}: {
  children: ReactNode;
  as?: any;
  delay?: number;
  dir?: RevealDir;
  amount?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.classList.add("in");
      return;
    }
    const io = onceInView(el, amount, () => el.classList.add("in"));
    return () => io.disconnect();
  }, [amount]);

  return (
    <As
      ref={ref}
      data-dir={dir}
      className={"reveal " + className}
      style={{ ...style, "--reveal-delay": delay + "ms" } as CSSProperties}
    >
      {children}
    </As>
  );
}

/* ---------------------------------------------------------- */
/* StaggerChildren                                             */
/* Adds the reveal treatment to each direct child without      */
/* wrapping it, so grid and flex layouts stay intact.          */
/* ---------------------------------------------------------- */

export function StaggerChildren({
  children,
  as: As = "div",
  step = 80,
  start = 0,
  dir = "up",
  amount = 0.08,
  className = "",
  style,
}: {
  children: ReactNode;
  as?: any;
  step?: number;
  start?: number;
  dir?: RevealDir;
  amount?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const kids = Array.prototype.slice.call(el.children) as HTMLElement[];
    kids.forEach((kid, i) => {
      kid.classList.add("reveal");
      kid.setAttribute("data-dir", dir);
      kid.style.setProperty("--reveal-delay", start + i * step + "ms");
    });

    const settle = () => {
      kids.forEach((kid) => {
        kid.classList.add("in");
        window.setTimeout(() => {
          kid.style.willChange = "auto";
        }, 1400);
      });
    };

    if (prefersReducedMotion()) {
      settle();
      return;
    }
    const io = onceInView(el, amount, settle, "0px 0px -60px 0px");
    return () => io.disconnect();
  }, [dir, step, start, amount]);

  return (
    <As ref={ref} className={className} style={style}>
      {children}
    </As>
  );
}

/* ---------------------------------------------------------- */
/* SplitText                                                   */
/* Each word gets its own clipping mask, so the rise reads     */
/* correctly however the copy wraps.                           */
/* ---------------------------------------------------------- */

const MASK_STYLE: CSSProperties = {
  display: "inline-block",
  overflow: "hidden",
  verticalAlign: "bottom",
  paddingBottom: "0.14em",
  marginBottom: "-0.14em",
};

export function SplitText({
  text,
  as: As = "span",
  by = "word",
  delay = 0,
  step = 55,
  amount = 0.2,
  className = "",
}: {
  text: string;
  as?: any;
  by?: "word" | "char";
  delay?: number;
  step?: number;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.classList.add("in");
      return;
    }
    const io = onceInView(el, amount, () => el.classList.add("in"));
    return () => io.disconnect();
  }, [amount]);

  const words = text.split(" ");
  let unit = 0;

  return (
    <As ref={ref} className={"split " + className}>
      {words.map((word, wi) => {
        const tail = wi < words.length - 1 ? " " : "";
        if (by === "char") {
          const chars = Array.from(word);
          return (
            <Fragment key={wi}>
              <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                {chars.map((ch, ci) => {
                  const d = delay + unit * step;
                  unit += 1;
                  return (
                    <span key={ci} style={MASK_STYLE}>
                      <span className="split-char" style={{ "--d": d + "ms" } as CSSProperties}>
                        {ch}
                      </span>
                    </span>
                  );
                })}
              </span>
              {tail}
            </Fragment>
          );
        }
        const d = delay + wi * step;
        return (
          <Fragment key={wi}>
            <span style={MASK_STYLE}>
              <span className="split-word" style={{ "--d": d + "ms" } as CSSProperties}>
                {word}
              </span>
            </span>
            {tail}
          </Fragment>
        );
      })}
    </As>
  );
}

/* ---------------------------------------------------------- */
/* Counter                                                     */
/* Understands values like "40+", "5 000+", "20+", "5".        */
/* ---------------------------------------------------------- */

const DIGITS = "0123456789";

function parseCountable(value: string) {
  let first = -1;
  let last = -1;
  for (let i = 0; i < value.length; i += 1) {
    if (DIGITS.indexOf(value.charAt(i)) !== -1) {
      if (first === -1) first = i;
      last = i;
    }
  }
  if (first === -1) return null;
  const numeric = value.slice(first, last + 1);
  let target = 0;
  for (let i = 0; i < numeric.length; i += 1) {
    const c = numeric.charAt(i);
    if (DIGITS.indexOf(c) !== -1) target = target * 10 + Number(c);
  }
  if (target <= 0) return null;
  return {
    prefix: value.slice(0, first),
    suffix: value.slice(last + 1),
    sep: numeric.indexOf(" ") !== -1 ? " " : "",
    target,
  };
}

function groupDigits(n: number, sep: string) {
  const s = String(n);
  if (!sep) return s;
  let out = "";
  for (let i = 0; i < s.length; i += 1) {
    if (i > 0 && (s.length - i) % 3 === 0) out += sep;
    out += s.charAt(i);
  }
  return out;
}

const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function Counter({
  value,
  duration = 1800,
  delay = 0,
  className = "",
}: {
  value: string;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parsed = parseCountable(value);
    if (!parsed || prefersReducedMotion()) {
      setText(value);
      return;
    }

    let frame = 0;
    let timer = 0;
    let cancelled = false;

    const render = (n: number) => setText(parsed.prefix + groupDigits(n, parsed.sep) + parsed.suffix);
    render(0);

    const run = () => {
      const started = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const p = Math.min(1, (now - started) / duration);
        render(Math.round(parsed.target * easeOutExpo(p)));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const io = onceInView(el, 0.4, () => {
      timer = window.setTimeout(run, delay);
    });

    return () => {
      cancelled = true;
      io.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [value, duration, delay]);

  return (
    <span ref={ref} className={"tabular " + className}>
      {text}
    </span>
  );
}

/* ---------------------------------------------------------- */
/* Magnetic — pointer-following nudge, pointer devices only    */
/* ---------------------------------------------------------- */

export function Magnetic({
  children,
  as: As = "span",
  strength = 0.28,
  className = "",
}: {
  children: ReactNode;
  as?: any;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let frame = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = "translate3d(" + dx.toFixed(2) + "px," + dy.toFixed(2) + "px,0)";
      });
    };
    const onEnter = () => el.setAttribute("data-active", "true");
    const onLeave = () => {
      el.setAttribute("data-active", "false");
      cancelAnimationFrame(frame);
      el.style.transform = "";
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <As ref={ref} className={"magnetic " + className}>
      {children}
    </As>
  );
}

/* ---------------------------------------------------------- */
/* Parallax — scroll-linked drift, optionally fading out       */
/* ---------------------------------------------------------- */

export function Parallax({
  children,
  as: As = "div",
  speed = 18,
  fade = false,
  className = "",
  style,
}: {
  children: ReactNode;
  as?: any;
  /** Pixels of drift per viewport travelled. Negative moves against the scroll. */
  speed?: number;
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let frame = 0;
    let visible = true;

    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const centre = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = "translate3d(0," + (centre * speed).toFixed(2) + "px,0)";
      if (fade) {
        const out = Math.min(1, Math.max(0, -r.top / (r.height || vh)));
        el.style.opacity = String(1 - out * 0.9);
      }
    };

    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      });
    });
    io.observe(el);

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [speed, fade]);

  return (
    <As ref={ref} className={"hero-layer " + className} style={style}>
      {children}
    </As>
  );
}

/* ---------------------------------------------------------- */
/* Tilt — subtle 3D response to the pointer                    */
/* ---------------------------------------------------------- */

export function Tilt({
  children,
  max = 5,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  max?: number;
  className?: string;
  innerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const scene = el.parentElement;
    if (!scene) return;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      const r = scene.getBoundingClientRect();
      const px = (e.clientX - r.left) / (r.width || 1) - 0.5;
      const py = (e.clientY - r.top) / (r.height || 1) - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = "rotateX(" + (-py * max).toFixed(2) + "deg) rotateY(" + (px * max).toFixed(2) + "deg)";
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      el.style.transform = "";
    };

    scene.addEventListener("pointermove", onMove);
    scene.addEventListener("pointerleave", onLeave);
    return () => {
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [max]);

  return (
    <div className={"tilt-scene " + className}>
      <div ref={ref} className={"tilt " + innerClassName}>
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- */
/* ScrollProgress — hairline reading indicator                 */
/* ---------------------------------------------------------- */

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--p", String(p));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
