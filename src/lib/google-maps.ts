declare global {
  interface Window {
    google?: any;
    __nfistGmapsCb?: () => void;
  }
}

let loader: Promise<any> | null = null;

export function loadGoogleMaps(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.google?.maps) return Promise.resolve(window.google);
  if (loader) return loader;

  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
  const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;

  loader = new Promise((resolve, reject) => {
    window.__nfistGmapsCb = () => resolve(window.google);
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__nfistGmapsCb${channel ? `&channel=${channel}` : ""}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return loader;
}

export const NFIST_MAP_STYLE: any[] = [
  { elementType: "geometry", stylers: [{ color: "#0f1424" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0a0e1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a93a6" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#1a2138" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#c9d1e2" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#dbe3f5" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#132a1f" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a2138" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0a0e1a" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a93a6" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#243056" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#b8c2db" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1a2138" }] },
  { featureType: "transit.station", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#060912" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3b82f6" }] },
];

// Editorial cream light-mode style matching the site's light palette (#fbf9f4).
export const NFIST_MAP_STYLE_LIGHT: any[] = [
  { elementType: "geometry", stylers: [{ color: "#f3efe6" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#fbf9f4" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4b5563" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#e5dfd1" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#1f2937" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#0d1117" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e0e8d5" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e5dfd1" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#4b5563" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#c9c0ab" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#1e3a8a" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#e5dfd1" }] },
  { featureType: "transit.station", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c8d8ea" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#1e3a8a" }] },
];

