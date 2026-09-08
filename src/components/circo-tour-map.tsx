import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps, NFIST_MAP_STYLE, NFIST_MAP_STYLE_LIGHT } from "@/lib/google-maps";
import { useTheme } from "@/hooks/use-theme";


type Stop = {
  name: string;
  city: string;
  lat: number;
  lng: number;
  kind: "Escola" | "Feira" | "Universidade" | "Museu";
  note?: string;
};

// Curated selection of representative Circo da Física visits across Portugal.
// Coordinates are approximate to the venue/city — enough for the map to shift
// and communicate the geographic reach.
const STOPS: Stop[] = [
  { name: "Instituto Superior Técnico", city: "Lisboa", lat: 38.7369, lng: -9.1394, kind: "Universidade", note: "Base do Circo — Campus Alameda" },
  { name: "Escola Secundária de Camões", city: "Lisboa", lat: 38.7326, lng: -9.1443, kind: "Escola" },
  { name: "Pavilhão do Conhecimento", city: "Lisboa", lat: 38.7639, lng: -9.0947, kind: "Museu", note: "Ciência Viva" },
  { name: "Escola Secundária Sebastião e Silva", city: "Oeiras", lat: 38.6979, lng: -9.3094, kind: "Escola" },
  { name: "Escola Secundária D. Pedro V", city: "Lisboa", lat: 38.7423, lng: -9.1780, kind: "Escola" },
  { name: "Universidade de Coimbra", city: "Coimbra", lat: 40.2076, lng: -8.4256, kind: "Universidade" },
  { name: "Feira Nacional de Ciência", city: "Aveiro", lat: 40.6405, lng: -8.6538, kind: "Feira" },
  { name: "Escola Secundária Camilo Castelo Branco", city: "Vila Real", lat: 41.3006, lng: -7.7441, kind: "Escola" },
  { name: "Escola Secundária Alexandre Herculano", city: "Porto", lat: 41.1496, lng: -8.6055, kind: "Escola" },
  { name: "Escola Secundária de Évora", city: "Évora", lat: 38.5714, lng: -7.9135, kind: "Escola" },
  { name: "Escola Secundária de Faro", city: "Faro", lat: 37.0194, lng: -7.9304, kind: "Escola" },
  { name: "Escola Secundária Jaime Moniz", city: "Funchal", lat: 32.6519, lng: -16.9146, kind: "Escola", note: "Madeira" },
  { name: "Escola Secundária Antero de Quental", city: "Ponta Delgada", lat: 37.7413, lng: -25.6756, kind: "Escola", note: "Açores" },
];

export function CircoTourMap() {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then((g) => {
      if (cancelled || !g || !mapEl.current) return;
      const isLight = document.documentElement.classList.contains("light");
      const map = new g.maps.Map(mapEl.current, {
        center: { lat: 39.5, lng: -8.5 },
        zoom: 6,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        styles: isLight ? NFIST_MAP_STYLE_LIGHT : NFIST_MAP_STYLE,
        backgroundColor: isLight ? "#fbf9f4" : "#0a0e1a",
      });
      mapRef.current = map;
      const accentInit = isLight ? "#1e3a8a" : "#3B82F6";
      const strokeInit = isLight ? "#fbf9f4" : "#0a0e1a";
      markersRef.current = STOPS.map((s, i) => {
        const marker = new g.maps.Marker({
          position: { lat: s.lat, lng: s.lng },
          map,
          title: `${s.name} — ${s.city}`,
          icon: {
            path: g.maps.SymbolPath.CIRCLE,
            scale: i === 0 ? 10 : 6,
            fillColor: accentInit,
            fillOpacity: 1,
            strokeColor: strokeInit,
            strokeWeight: i === 0 ? 3 : 2,
          },
        });
        marker.addListener("click", () => setActive(i));
        return marker;
      });
      setReady(true);
    });
    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      mapRef.current = null;
    };
  }, []);

  // Theme swap: restyle map + repaint markers when theme or active changes.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const g = (window as any).google;
    const isLight = theme === "light";
    mapRef.current.setOptions({ styles: isLight ? NFIST_MAP_STYLE_LIGHT : NFIST_MAP_STYLE });
    const accent = isLight ? "#1e3a8a" : "#3B82F6";
    const activeAccent = isLight ? "#0b2a6b" : "#60a5fa";
    const stroke = isLight ? "#fbf9f4" : "#0a0e1a";
    markersRef.current.forEach((m, i) => {
      m.setIcon({
        path: g.maps.SymbolPath.CIRCLE,
        scale: i === active ? 10 : 6,
        fillColor: i === active ? activeAccent : accent,
        fillOpacity: 1,
        strokeColor: stroke,
        strokeWeight: i === active ? 3 : 2,
      });
    });
  }, [theme, active, ready]);

  // Pan/zoom when active changes.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const s = STOPS[active];
    mapRef.current.panTo({ lat: s.lat, lng: s.lng });
    mapRef.current.setZoom(13);
  }, [active, ready]);

  const s = STOPS[active];

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-px border border-hairline bg-hairline">
      <div className="relative bg-surface min-h-[420px] lg:min-h-[560px]">
        <div ref={mapEl} className="absolute inset-0" />
        <div className="absolute left-4 bottom-4 max-w-[calc(100%-2rem)] sm:max-w-sm bg-background/95 border border-hairline p-4 pointer-events-none">
          <div className="eyebrow text-[0.65rem]">{s.kind}{s.note ? ` · ${s.note}` : ""}</div>
          <div className="mt-1 font-serif text-lg leading-tight">{s.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{s.city}</div>
        </div>
      </div>

      <div data-lenis-prevent className="bg-background max-h-[560px] overflow-y-auto overscroll-contain">
        <div className="p-4 border-b border-hairline sticky top-0 bg-background z-10">
          <div className="eyebrow">Onde estivemos</div>
          <div className="text-xs text-muted-foreground mt-1">{STOPS.length} paragens · Continente e ilhas</div>
        </div>
        <ul>
          {STOPS.map((stop, i) => (
            <li key={stop.name + stop.city}>
              <button
                onClick={() => setActive(i)}
                className={`w-full text-left px-4 py-3 border-b border-hairline transition-colors ${
                  i === active ? "bg-surface text-foreground" : "text-muted-foreground hover:bg-surface/60 hover:text-foreground"
                }`}
              >
                <div className="font-mono text-[0.65rem] uppercase tracking-wider opacity-70">{stop.kind}</div>
                <div className="font-serif text-base mt-0.5 leading-tight">{stop.name}</div>
                <div className="text-xs opacity-80">{stop.city}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
