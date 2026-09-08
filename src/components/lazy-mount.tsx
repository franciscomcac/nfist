import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mount children only when the placeholder scrolls near the viewport.
 * Used to defer heavy third-party scripts (Google Maps) until needed.
 */
export function LazyMount({
  children,
  placeholder,
  rootMargin = "300px",
  minHeight = "auto",
  className = "",
}: {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
  minHeight?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} className={className} style={{ minHeight }}>
      {visible ? children : placeholder ?? null}
    </div>
  );
}
