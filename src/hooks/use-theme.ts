import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

/** Reactive theme hook — updates when ThemeToggle dispatches "nfist:theme". */
export function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(readTheme());
    const onChange = () => setTheme(readTheme());
    window.addEventListener("nfist:theme", onChange);
    // Also observe class changes for robustness.
    const obs = new MutationObserver(onChange);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      window.removeEventListener("nfist:theme", onChange);
      obs.disconnect();
    };
  }, []);

  return theme;
}
