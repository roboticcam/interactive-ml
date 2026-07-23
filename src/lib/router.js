import { useEffect, useState } from "react";

// Minimal hash router for a static host (GitHub Pages).
//   #/            → home (course TOC)
//   #/m/<module>  → module page
//   #/m/<module>/<section> → module page scrolled to a section anchor
// Legacy plain anchors (#dpa … from the PDF back-links and old URLs) are
// redirected by App to #/m/transformer/<anchor>.
export function parseHash() {
  const h = window.location.hash || "#/";
  if (!h.startsWith("#/")) return { legacy: h.slice(1) };
  const seg = h.slice(2).split("/").filter(Boolean);
  return { seg };
}

export function useHashRoute() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function navigate(path) {
  window.location.hash = path.startsWith("#") ? path : "#" + path;
}
