import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { loadGoogleMaps, NFIST_MAP_STYLE, NFIST_MAP_STYLE_LIGHT } from "@/lib/google-maps";
import { useTheme } from "@/hooks/use-theme";
import { EVENTS } from "@/content/events";

type EventPin = {
  key: string;
  eventSlug: string;
  eventName: string;
  place: string;
  lat: number;
  lng: number;
  note?: string;
};

const COORDS: Record<string, { lat: number; lng: number }> = {
  "IST — Campus Alameda": { lat: 38.7369, lng: -9.1395 },
  "IST — Alameda": { lat: 38.7369, lng: -9.1395 },
  "IST — Lisboa": { lat: 38.7369, lng: -9.1395 },
  "Viana do Castelo": { lat: 41.6946, lng: -8.8317 },
  "Fafe": { lat: 41.4519, lng: -8.1706 },
  "Mondim de Basto": { lat: 41.4111, lng: -7.95 },
  "Vila Real": { lat: 41.3006, lng: -7.7442 },
  "Vila Flor": { lat: 41.3061, lng: -7.1522 },
  "Estarreja": { lat: 40.7581, lng: -8.5711 },
  "Murtosa": { lat: 40.7381, lng: -8.6394 },
  "Terceira, Açores": { lat: 38.6555, lng: -27.2208 },
  "São Miguel, Açores": { lat: 37.7412, lng: -25.6756 },
  "Funchal, Madeira": { lat: 32.6669, lng: -16.9241 },
  "Calheta, Madeira": { lat: 32.7182, lng: -17.1728 },
  "Machico, Madeira": { lat: 32.7178, lng: -16.7739 },
};

function buildPins(): EventPin[] {
  const pins: EventPin[] = [];
  for (const ev of EVENTS) {
    if (ev.locations && ev.locations.length) {
      for (const p of ev.locations) {
        const label = p in COORDS ? p : `${p}`;
        const c = COORDS[label];
        if (!c) continue;
        pins.push({ key: `${ev.slug}-${p}`, eventSlug: ev.slug, eventName: ev.name, place: p, lat: c.lat, lng: c.lng, note: ev.period });
      }
    } else if (ev.slug === "estrelas-sobre-o-atlantico") {
      for (const p of ["Terceira, Açores", "São Miguel, Açores", "Funchal, Madeira", "Calheta, Madeira", "Machico, Madeira"]) {
        const c = COORDS[p];
        pins.push({ key: `${ev.slug}-${p}`, eventSlug: ev.slug, eventName: ev.name, place: p, lat: c.lat, lng: c.lng, note: "Açores 2024 · Madeira 2026" });
      }
    } else {
      const primary = COORDS[ev.location] ?? COORDS["IST — Campus Alameda"];
      pins.push({ key: ev.slug, eventSlug: ev.slug, eventName: ev.name, place: ev.location, lat: primary.lat, lng: primary.lng, note: ev.period });
    }
  }
  return pins;
}

function circleIcon(g: any, color: string, strokeColor: string, active: boolean) {
  return {
    path: g.maps.SymbolPath.CIRCLE,
    scale: active ? 10 : 6,
    fillColor: color,
    fillOpacity: 1,
    strokeColor,
    strokeWeight: active ? 3 : 2,
  };
}

export function EventsMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInst = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const theme = useTheme();

  const pins = useMemo(buildPins, []);
  const active = pins.find((p) => p.key === activeKey) ?? null;

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then((google) => {
      if (cancelled || !mapRef.current || !google) return;
      const isLight = document.documentElement.classList.contains("light");

      const bounds = new google.maps.LatLngBounds();
      pins.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 39.5, lng: -12 },
        zoom: 6,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
        gestureHandling: "cooperative",
        styles: isLight ? NFIST_MAP_STYLE_LIGHT : NFIST_MAP_STYLE,
        backgroundColor: isLight ? "#fbf9f4" : "#0a0e1a",
      });
      mapInst.current = map;
      map.fitBounds(bounds, 60);

      const isLightInit = document.documentElement.classList.contains("light");
      const initAccent = isLightInit ? "#1e3a8a" : "#3B82F6";
      const initStroke = isLightInit ? "#fbf9f4" : "#0a0e1a";
      markersRef.current = pins.map((p) => {
        const marker = new google.maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map,
          title: `${p.eventName} — ${p.place}`,
          icon: circleIcon(google, initAccent, initStroke, false),
        });
        marker.addListener("click", () => {
          setActiveKey(p.key);
          map.panTo({ lat: p.lat, lng: p.lng });
        });
        return marker;
      });
    }).catch((e) => console.error(e));

    return () => { cancelled = true; };
  }, [pins]);

  // Repaint style + markers on theme or selection change.
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).google || !mapInst.current) return;
    const g = (window as any).google;
    const isLight = theme === "light";
    mapInst.current.setOptions({ styles: isLight ? NFIST_MAP_STYLE_LIGHT : NFIST_MAP_STYLE });
    const accent = isLight ? "#1e3a8a" : "#3B82F6";
    const highlight = "#F5A524";
    const stroke = isLight ? "#fbf9f4" : "#0a0e1a";
    markersRef.current.forEach((m, i) => {
      const p = pins[i];
      const isActive = p.key === activeKey;
      m.setIcon(circleIcon(g, isActive ? highlight : accent, stroke, isActive));
      m.setZIndex(isActive ? 999 : 1);
    });
  }, [activeKey, pins, theme]);

  function focusPin(key: string) {
    const p = pins.find((x) => x.key === key);
    if (!p) return;
    setActiveKey(key);
    if (mapInst.current) mapInst.current.panTo({ lat: p.lat, lng: p.lng });
  }

  const grouped = useMemo(() => {
    const g = new Map<string, { name: string; slug: string; items: EventPin[] }>();
    for (const p of pins) {
      const prev = g.get(p.eventSlug) ?? { name: p.eventName, slug: p.eventSlug, items: [] };
      prev.items.push(p);
      g.set(p.eventSlug, prev);
    }
    return Array.from(g.values());
  }, [pins]);

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-0 border border-hairline overflow-hidden bg-surface">
      <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
        <div ref={mapRef} className="absolute inset-0" aria-label="Mapa de eventos NFIST em Portugal" />
        {active && (
          <div className="absolute left-4 bottom-4 right-4 sm:right-auto sm:max-w-sm bg-background border border-hairline p-4 shadow-2xl">
            <div className="eyebrow text-[0.65rem]">{active.note}</div>
            <div className="font-serif text-lg mt-1 leading-tight">{active.eventName}</div>
            <div className="text-sm text-muted-foreground mt-1">{active.place}</div>
            <div className="mt-3 flex gap-3">
              <Link
                to="/eventos/$slug"
                params={{ slug: active.eventSlug }}
                className="font-mono text-[11px] uppercase tracking-wider border-b border-foreground/40 hover:border-accent hover:text-accent transition-colors pb-0.5"
              >
                Ver evento →
              </Link>
              <button
                onClick={() => setActiveKey(null)}
                className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
      <aside data-lenis-prevent className="border-t lg:border-t-0 lg:border-l border-hairline bg-surface text-foreground max-h-[520px] overflow-y-auto overscroll-contain">
        <div className="p-4 border-b border-hairline">
          <div className="eyebrow text-[0.65rem]">Locais</div>
          <div className="font-serif text-lg mt-1">{pins.length} pontos no mapa</div>
        </div>
        <ul className="divide-y divide-hairline">
          {grouped.map((g) => (
            <li key={g.slug} className="p-4">
              <div className="font-serif text-base mb-2">{g.name}</div>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => focusPin(p.key)}
                    className={`font-mono text-[11px] uppercase tracking-wider px-2 py-1 border transition-colors ${
                      activeKey === p.key
                        ? "border-accent text-accent"
                        : "border-hairline text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {p.place}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
