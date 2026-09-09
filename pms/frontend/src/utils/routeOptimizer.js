// Nearest-neighbour route building for the Site Planner.
// Ported to plain JS to match the rest of the frontend.

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

export function haversineDistance(a, b) {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

function centroid(sites) {
  const sum = sites.reduce(
    (acc, s) => ({ lat: acc.lat + s.lat, lng: acc.lng + s.lng }),
    { lat: 0, lng: 0 },
  );
  return { lat: sum.lat / sites.length, lng: sum.lng / sites.length };
}

function nearestNeighborOrder(sites, start) {
  const remaining = sites.filter((s) => s.id !== start.id);
  const ordered = [start];
  let current = start;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = haversineDistance(current, remaining[0]);
    for (let i = 1; i < remaining.length; i++) {
      const d = haversineDistance(current, remaining[i]);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }
    current = remaining.splice(nearestIdx, 1)[0];
    ordered.push(current);
  }

  return ordered;
}

export function buildRoute(sites) {
  if (sites.length <= 1) return [...sites];
  return nearestNeighborOrder(sites, sites[0]);
}

/**
 * Picks the `count` most central sites and orders them into a route.
 * Pass `sourceSites` to draw from an explicit set (e.g. a geofence
 * selection) instead of the default `sites` pool.
 */
export function getNearestSites(sites, count, sourceSites) {
  const pool = sourceSites ?? sites;
  if (count <= 0 || pool.length === 0) return [];
  if (count >= pool.length) return buildRoute(pool);

  const center = centroid(pool);
  const byDistanceToCenter = [...pool].sort(
    (a, b) => haversineDistance(center, a) - haversineDistance(center, b),
  );
  const cluster = byDistanceToCenter.slice(0, count);

  return nearestNeighborOrder(cluster, cluster[0]);
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

const DRIVE_SPEED_KMH = 30;

export function formatDriveTime(km) {
  const minutes = Math.max(1, Math.round((km / DRIVE_SPEED_KMH) * 60));
  if (minutes < 60) return `~${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `~${h}h` : `~${h}h ${m}m`;
}

export function routeDistance(route) {
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    total += haversineDistance(route[i - 1], route[i]);
  }
  return total;
}
