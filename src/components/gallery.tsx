import { useCallback, useEffect, useRef, useState } from "react";
import { AsyncImg } from "@/components/async-img";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { img, imgSrcSet } from "@/lib/img";


export function Gallery({ images, alt = "" }: { images: string[]; alt?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const triggersRef = useRef<(HTMLButtonElement | null)[]>([]);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const returnFocusIndex = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      setOpen((cur) => {
        if (cur === null) return cur;
        const next = (cur + dir + images.length) % images.length;
        return next;
      });
    },
    [images.length],
  );

  // Scroll the strip to keep the active image in view
  useEffect(() => {
    if (open === null || !stripRef.current) return;
    const el = stripRef.current.querySelector<HTMLElement>(
      `[data-idx="${open}"]`,
    );
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      const i = returnFocusIndex.current;
      if (i !== null) triggersRef.current[i]?.focus();
    };
  }, [open, go]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {images.map((src, i) => (
          <button
            key={src + i}
            ref={(el) => {
              triggersRef.current[i] = el;
            }}
            onClick={() => {
              returnFocusIndex.current = i;
              setOpen(i);
            }}
            aria-label={`Abrir imagem ${i + 1}${alt ? ` — ${alt}` : ""}`}
            className="group relative aspect-[4/3] overflow-hidden border border-hairline bg-surface"
          >
            <AsyncImg
              src={img(src, 600)}
              srcSet={imgSrcSet(src, [400, 600, 900])}
              sizes="(min-width: 640px) 33vw, 50vw"
              alt={`${alt} ${i + 1}`.trim()}
              decoding="async"
              className="h-full w-full object-cover duotone transition-transform duration-500 group-hover:scale-[1.03]"
             />

          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visualização de imagem"
          className="fixed inset-0 z-[60] bg-black/95 flex flex-col animate-in fade-in duration-200"
          onClick={() => setOpen(null)}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
            <div className="font-mono text-xs text-white/70">
              {open + 1} / {images.length}
            </div>
            <button
              ref={closeBtnRef}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(null);
              }}
              aria-label="Fechar imagem"
              className="h-11 w-11 rounded-sm border border-white/20 text-white/90 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Main image area with swipe */}
          <div
            className="relative flex-1 flex items-center justify-center px-2 sm:px-6 min-h-0"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
              touchStartX.current = null;
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Imagem anterior"
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-sm border border-white/20 text-white/90 items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <img
              key={open}
              src={img(images[open], 1600, 80)}
              srcSet={imgSrcSet(images[open], [900, 1280, 1600, 1920], 80)}
              sizes="100vw"
              alt={`${alt} ${open + 1}`.trim()}
              className="max-h-full max-w-full object-contain select-none animate-in fade-in zoom-in-95 duration-200"
              draggable={false}
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Imagem seguinte"
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-sm border border-white/20 text-white/90 items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Thumbnail strip — horizontally scrollable */}
          <div
            ref={stripRef}
            className="shrink-0 overflow-x-auto overflow-y-hidden overscroll-contain px-3 sm:px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 scrollbar-none"
            onClick={(e) => e.stopPropagation()}
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex gap-2 snap-x snap-mandatory">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  data-idx={i}
                  onClick={() => setOpen(i)}
                  aria-label={`Ir para imagem ${i + 1}`}
                  aria-current={i === open}
                  className={`snap-center shrink-0 h-16 w-24 sm:h-20 sm:w-28 overflow-hidden border transition-all ${
                    i === open
                      ? "border-white opacity-100"
                      : "border-white/20 opacity-50 hover:opacity-90"
                  }`}
                >
                  <AsyncImg
                    src={img(src, 200, 60)}
                    alt=""
                    decoding="async"
                    className="h-full w-full object-cover"
                   />

                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
