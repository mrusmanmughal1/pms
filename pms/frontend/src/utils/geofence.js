/**
 * Returns the sites whose coordinates fall inside the given polygon.
 * Relies on the Google Maps `geometry` library, so the Maps loader must
 * include 'geometry' in its libraries list (see utils/googleMaps.js).
 */
export function getSitesInGeofence(sites, polygon) {
  return sites.filter((site) => {
    if (!Number.isFinite(site.lat) || !Number.isFinite(site.lng)) return false;
    const point = new window.google.maps.LatLng(site.lat, site.lng);
    return window.google.maps.geometry.poly.containsLocation(point, polygon);
  });
}

/** Ray-casting point-in-polygon test against a ring of lat/lng points. */
function isPointInPath(lat, lng, path) {
  let inside = false;
  for (let i = 0, j = path.length - 1; i < path.length; j = i++) {
    const yi = path[i].lat;
    const xi = path[i].lng;
    const yj = path[j].lat;
    const xj = path[j].lng;
    const intersect =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Sites whose coordinates fall inside the given polygon path. Pure — unlike
 * getSitesInGeofence it needs no live google.maps.Polygon or the Maps API,
 * so it is safe to call from the sidebar (e.g. a saved zone's coordinates).
 */
export function getSitesInPath(sites, path) {
  if (path.length < 3) return [];
  return sites.filter(
    (site) =>
      Number.isFinite(site.lat) &&
      Number.isFinite(site.lng) &&
      isPointInPath(site.lat, site.lng, path),
  );
}

/** Most frequent non-empty city among the given sites. */
export function mostCommonCity(sites) {
  const counts = new Map();
  for (const s of sites) {
    if (!s.city) continue;
    counts.set(s.city, (counts.get(s.city) ?? 0) + 1);
  }
  let best = "";
  let bestCount = 0;
  for (const [city, count] of counts) {
    if (count > bestCount) {
      bestCount = count;
      best = city;
    }
  }
  return best;
}

/**
 * Builds a closed rectangle ring from two opposite corners, in clockwise
 * order. Pure, so the drawing tools need no Maps `drawing` library.
 */
export function rectanglePath(a, b) {
  const north = Math.max(a.lat, b.lat);
  const south = Math.min(a.lat, b.lat);
  const east = Math.max(a.lng, b.lng);
  const west = Math.min(a.lng, b.lng);
  return [
    { lat: north, lng: west },
    { lat: north, lng: east },
    { lat: south, lng: east },
    { lat: south, lng: west },
  ];
}
