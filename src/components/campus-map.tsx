import { useEffect, useRef } from "react";
import { loadGoogleMaps, NFIST_MAP_STYLE, NFIST_MAP_STYLE_LIGHT } from "@/lib/google-maps";
import { useTheme } from "@/hooks/use-theme";

const LAT = 38.7369;
const LNG = -9.1395;

export function CampusMap() {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const theme = useTheme();

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then((google) => {
      if (cancelled || !ref.current || !google) return;
      const isLight = document.documentElement.classList.contains("light");
      const map = new google.maps.Map(ref.current, {
        center: { lat: LAT, lng: LNG },
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
        gestureHandling: "cooperative",
        styles: isLight ? NFIST_MAP_STYLE_LIGHT : NFIST_MAP_STYLE,
        backgroundColor: isLight ? "#fbf9f4" : "#0a0e1a",
      });
      mapRef.current = map;

      markerRef.current = new google.maps.Marker({
        position: { lat: LAT, lng: LNG },
        map,
        title: "Instituto Superior Técnico",
        label: {
          text: "Instituto Superior Técnico",
          className: "gmap-pin-label",
          color: isLight ? "#0a0e1a" : "#f5f5f0",
          fontSize: "12px",
          fontWeight: "600",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: isLight ? "#1e3a8a" : "#3B82F6",
          fillOpacity: 1,
          strokeColor: isLight ? "#fbf9f4" : "#0a0e1a",
          strokeWeight: 3,
          labelOrigin: new google.maps.Point(0, -2.2),
        },
      });

    }).catch((e) => console.error(e));

    return () => { cancelled = true; };
  }, []);

  // React to theme changes without remounting the map.
  useEffect(() => {
    const g = (window as any).google;
    if (!mapRef.current || !g) return;
    const isLight = theme === "light";
    mapRef.current.setOptions({ styles: isLight ? NFIST_MAP_STYLE_LIGHT : NFIST_MAP_STYLE });
    if (markerRef.current) {
      markerRef.current.setIcon({
        path: g.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: isLight ? "#1e3a8a" : "#3B82F6",
        fillOpacity: 1,
        strokeColor: isLight ? "#fbf9f4" : "#0a0e1a",
        strokeWeight: 3,
      });
    }
  }, [theme]);

  return (
    <div className="relative aspect-[4/3] border border-hairline overflow-hidden bg-surface">
      <div ref={ref} className="absolute inset-0" aria-label="Mapa — Instituto Superior Técnico, Alameda" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/5" />
    </div>
  );
}
