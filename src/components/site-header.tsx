import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NAV, SITE } from "@/content/site";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuIn, setMenuIn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) {
      setMenuIn(false);
      return;
    }
    const raf = requestAnimationFrame(() => setMenuIn(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={
        "site-header sticky top-0 z-50 " +
        (scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-hairline"
          : "bg-background/80 backdrop-blur-sm border-b border-hairline/50")
      }
    >
      <div className="container-page flex items-center justify-between py-2">
        <Link to="/" className="flex items-center group ml-3 sm:ml-0" aria-label="Início — NFIST">
          <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 flex items-center justify-center overflow-visible">
            <img
              src={SITE.logoWhite}
              alt="NFIST"
              className="h-full w-full object-contain scale-[2] origin-center transition-transform duration-500 ease-out group-hover:scale-[2.15] [.light_&]:invert"
            />
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Navegação principal">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-foreground", "data-active": "true" } as any}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="nav-link text-sm transition-colors"
            >
              {n.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="relative z-[10000] inline-flex h-9 w-9 items-center justify-center rounded-sm border border-hairline transition-colors hover:bg-surface"
          >
            <span className="relative block h-3 w-4">
              <span
                className={
                  "absolute left-0 block h-[1.5px] w-4 bg-current transition-all duration-300 ease-out " +
                  (open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0")
                }
              />
              <span
                className={
                  "absolute left-0 top-1/2 block h-[1.5px] w-4 -translate-y-1/2 bg-current transition-opacity duration-200 " +
                  (open ? "opacity-0" : "opacity-100")
                }
              />
              <span
                className={
                  "absolute left-0 block h-[1.5px] w-4 bg-current transition-all duration-300 ease-out " +
                  (open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0")
                }
              />
            </span>
          </button>
        </div>
      </div>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex min-h-dvh flex-col overflow-y-auto bg-background text-foreground opacity-100 shadow-none animate-fade-in"
            style={{ backgroundColor: "var(--background)" }}
            data-lenis-prevent
          >
            <div className="container-page flex items-center justify-between py-2">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center ml-3"
                aria-label="Início — NFIST"
              >
                <div className="h-10 w-10 shrink-0 flex items-center justify-center overflow-visible">
                  <img
                    src={SITE.logoWhite}
                    alt="NFIST"
                    className="h-full w-full object-contain scale-[2] origin-center [.light_&]:invert"
                  />
                </div>
              </Link>
            </div>
            <nav className="container-page flex flex-col gap-6 pt-16" aria-label="Menu móvel">
              {NAV.map((n, i) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={
                    "font-serif text-4xl tracking-tight text-foreground transition-all duration-500 ease-out " +
                    (menuIn ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-[6px]")
                  }
                  style={{ transitionDelay: 60 + i * 70 + "ms" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>,
          document.body,
        )}
    </header>
  );
}
