import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  Polygon,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { AlertCircle } from "lucide-react";
import { useSiteStore } from "../../store/siteStore";
import { getSitesInGeofence, rectanglePath } from "../../utils/geofence";
import { GOOGLE_MAPS_LOADER } from "../../utils/googleMaps";
import { getSiteStatusColor } from "../../utils/statusColor";
import GeofencePanel from "./GeofencePanel";
import Spinner from "../Spinner";

const STATUS_LABELS = {
  completed: "Completed",
  pending: "Pending",
  skipped: "Skipped",
};

const CONTAINER_STYLE = { width: "100%", height: "100%" };
const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 }; // Riyadh
const DEFAULT_ZOOM = 5;

// Radar-style pulse for markers that fall inside the geofence.
const GEOFENCE_COLOR = "#4f46e5";
const GEOFENCE_STROKE = "#3730a3";
const OUTSIDE_COLOR = "#94a3b8";
const HALO_PERIOD_MS = 1500;

// Resolves a CSS custom property to a real hex so the Maps API — which
// cannot read CSS variables — draws markers in the app's palette.
function cssColor(value, fallback) {
  if (!value.startsWith("var(")) return value;
  const name = value.slice(4, -1).trim();
  const resolved = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return resolved || fallback;
}

const ZONE_SHAPE_OPTIONS = {
  fillColor: GEOFENCE_COLOR,
  fillOpacity: 0.15,
  strokeColor: GEOFENCE_STROKE,
  strokeWeight: 2,
  clickable: false,
  editable: true,
  zIndex: 1,
};

export default function SiteMap({ activeDayPlan }) {
  const sites = useSiteStore((s) => s.sites);
  const selectedCity = useSiteStore((s) => s.selectedCity);
  const geofencedSites = useSiteStore((s) => s.geofencedSites);
  const setGeofencedSites = useSiteStore((s) => s.setGeofencedSites);

  const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_LOADER);

  const mapRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [drawMode, setDrawMode] = useState("idle");
  const [geofence, setGeofence] = useState(null);
  // Bumped on every fresh draw so GeofencePanel remounts (resetting its
  // unsaved/saved state) for each new zone.
  const [geofenceNonce, setGeofenceNonce] = useState(0);
  // Vertices of the shape currently being drawn. The Maps `drawing`
  // library was removed in Maps JS 3.65, so zones are drawn by hand.
  const [draft, setDraft] = useState([]);

  const visibleSites = useMemo(
    () =>
      sites.filter(
        (s) =>
          Number.isFinite(s.lat) &&
          Number.isFinite(s.lng) &&
          (selectedCity == null || s.city === selectedCity),
      ),
    [sites, selectedCity],
  );

  const geofencedSet = useMemo(
    () => new Set(geofencedSites.map((s) => s.id)),
    [geofencedSites],
  );

  const fitBoundsToSites = useCallback(
    (map) => {
      if (visibleSites.length === 0) return;
      if (visibleSites.length === 1) {
        map.setCenter({ lat: visibleSites[0].lat, lng: visibleSites[0].lng });
        map.setZoom(13);
        return;
      }
      const bounds = new window.google.maps.LatLngBounds();
      for (const s of visibleSites) bounds.extend({ lat: s.lat, lng: s.lng });
      map.fitBounds(bounds, 64);
    },
    [visibleSites],
  );

  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
      fitBoundsToSites(map);
    },
    [fitBoundsToSites],
  );

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // The live geofence polygon is mirrored into a ref so the store
  // subscription below can read/replace it without a stale closure.
  const geofenceRef = useRef(null);
  const commitGeofence = useCallback((poly) => {
    geofenceRef.current = poly;
    setGeofence(poly);
  }, []);

  useEffect(() => {
    if (mapRef.current) fitBoundsToSites(mapRef.current);
  }, [fitBoundsToSites]);

  // Rebuilds a saved zone's polygon on the map, re-selects the sites inside
  // it, and pans to fit. Triggered from SavedZones via the `loadSavedZone`
  // store action (bridged by the subscription below).
  const loadSavedGeofence = useCallback(
    (saved) => {
      const map = mapRef.current;
      if (!map) return;

      geofenceRef.current?.setMap(null);

      const polygon = new window.google.maps.Polygon({
        ...ZONE_SHAPE_OPTIONS,
        paths: saved.coordinates,
        fillColor: saved.color,
        strokeColor: saved.color,
        map,
      });
      commitGeofence(polygon);
      setGeofenceNonce((n) => n + 1);

      // Re-run containment against the current sites — they may differ from
      // when the zone was saved — and keep doing so on vertex edits.
      const recheck = () => {
        const store = useSiteStore.getState();
        store.setGeofencedSites(getSitesInGeofence(store.sites, polygon));
      };
      recheck();
      polygon.addListener("mouseup", recheck);

      const bounds = new window.google.maps.LatLngBounds();
      for (const c of saved.coordinates) bounds.extend(c);
      map.fitBounds(bounds, 80);
    },
    [commitGeofence],
  );

  // SavedZones requests a load through the store; SiteMap reacts here.
  useEffect(() => {
    return useSiteStore.subscribe((state, prev) => {
      const zone = state.pendingZoneLoad;
      if (!zone || zone === prev.pendingZoneLoad) return;
      useSiteStore.getState().clearPendingZoneLoad();
      loadSavedGeofence(zone);
    });
  }, [loadSavedGeofence]);

  if (!GOOGLE_MAPS_LOADER.googleMapsApiKey) {
    return (
      <div className="glass-panel map-placeholder">
        <AlertCircle size={20} />
        <div>
          <p style={{ margin: 0, fontWeight: 600, color: "var(--text-primary)" }}>
            Google Maps key not configured
          </p>
          <p style={{ margin: 0 }}>
            Set <code>VITE_GOOGLE_MAPS_API_KEY</code> in the frontend{" "}
            <code>.env</code> to show the map.
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="glass-panel map-placeholder">
        <AlertCircle size={20} />
        <p style={{ margin: 0 }}>
          Google Maps failed to load. Check the API key and your connection.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="glass-panel map-placeholder">
        <Spinner />
      </div>
    );
  }

  const selectedSite =
    selectedId == null
      ? null
      : (visibleSites.find((s) => s.id === selectedId) ?? null);

  const toggleMode = (mode) => {
    setDraft([]);
    setDrawMode((m) => (m === mode ? "idle" : mode));
  };

  const clearGeofence = () => {
    geofence?.setMap(null);
    commitGeofence(null);
    setGeofencedSites([]);
    setDraft([]);
    setDrawMode("idle");
  };

  // Records which sites fall inside the geofence so every component
  // (GeofencePanel, DayPlanner, SavedZones) can read the selection from the
  // store. Reads `sites` fresh via getState() so the polygon-edit listener
  // below never works off a stale closure.
  const checkSitesInGeofence = (polygon) => {
    setGeofencedSites(getSitesInGeofence(useSiteStore.getState().sites, polygon));
  };

  const watchGeofenceEdits = (polygon) => {
    polygon.addListener("mouseup", () => checkSitesInGeofence(polygon));
  };

  // Turns a finished ring of vertices into the live editable zone. Every
  // shape becomes a Polygon so geometry.poly.containsLocation() works
  // uniformly and saved zones round-trip through one code path.
  const commitZoneFromPath = (path) => {
    const polygon = new window.google.maps.Polygon({
      ...ZONE_SHAPE_OPTIONS,
      paths: path,
    });
    polygon.setMap(mapRef.current);
    geofence?.setMap(null);
    commitGeofence(polygon);
    setGeofenceNonce((n) => n + 1);
    setDraft([]);
    setDrawMode("idle");
    checkSitesInGeofence(polygon);
    watchGeofenceEdits(polygon);
  };

  const finishPolygon = () => {
    if (draft.length < 3) return;
    commitZoneFromPath(draft);
  };

  const undoPoint = () => setDraft((pts) => pts.slice(0, -1));

  const handleMapClick = (e) => {
    if (drawMode === "idle" || !e.latLng) return;
    const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    if (drawMode === "rectangle") {
      // Two opposite corners: first click anchors, second closes the shape.
      if (draft.length === 0) {
        setDraft([point]);
      } else {
        commitZoneFromPath(rectanglePath(draft[0], point));
      }
      return;
    }

    setDraft((pts) => [...pts, point]);
  };

  // With an active geofence, inside sites read as bold indigo dots and
  // outside sites dim to grey; otherwise plain colour-by-status.
  const hasGeofence = geofencedSet.size > 0;
  const buildMarkerIcon = (site) => {
    if (!hasGeofence) {
      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: cssColor(getSiteStatusColor(site.status), OUTSIDE_COLOR),
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      };
    }
    if (geofencedSet.has(site.id)) {
      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: GEOFENCE_COLOR,
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      };
    }
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 7,
      fillColor: OUTSIDE_COLOR,
      fillOpacity: 0.4,
      strokeColor: OUTSIDE_COLOR,
      strokeWeight: 1,
    };
  };

  const routePath =
    activeDayPlan?.route
      .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng))
      .map((s) => ({ lat: s.lat, lng: s.lng })) ?? [];

  return (
    <div className="site-map-shell">
      <GoogleMap
        mapContainerStyle={CONTAINER_STYLE}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          draggableCursor: drawMode === "idle" ? undefined : "crosshair",
        }}
      >
        {/* Live preview of the shape being drawn */}
        {draft.length > 0 && drawMode === "polygon" && (
          <>
            {draft.length > 2 && (
              <Polygon paths={draft} options={ZONE_SHAPE_OPTIONS} />
            )}
            <Polyline
              path={draft}
              options={{
                strokeColor: GEOFENCE_STROKE,
                strokeOpacity: 0.9,
                strokeWeight: 2,
              }}
            />
            {draft.map((pt, i) => (
              <Marker
                key={`${pt.lat},${pt.lng},${i}`}
                position={pt}
                zIndex={4}
                onClick={i === 0 ? finishPolygon : undefined}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: i === 0 ? 7 : 5,
                  fillColor: i === 0 ? GEOFENCE_STROKE : GEOFENCE_COLOR,
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                }}
              />
            ))}
          </>
        )}

        {draft.length === 1 && drawMode === "rectangle" && (
          <Marker
            position={draft[0]}
            zIndex={4}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: GEOFENCE_STROKE,
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        )}

        {hasGeofence && (
          <GeofenceHalo
            sites={visibleSites.filter((s) => geofencedSet.has(s.id))}
          />
        )}

        {visibleSites.map((site) => (
          <Marker
            key={site.id}
            position={{ lat: site.lat, lng: site.lng }}
            icon={buildMarkerIcon(site)}
            zIndex={2}
            onClick={() => setSelectedId(site.id)}
          />
        ))}

        {routePath.length > 1 && (
          <Polyline
            path={routePath}
            options={{
              strokeColor: GEOFENCE_COLOR,
              strokeOpacity: 0.9,
              strokeWeight: 3,
              geodesic: true,
            }}
          />
        )}

        {selectedSite && (
          <InfoWindow
            position={{ lat: selectedSite.lat, lng: selectedSite.lng }}
            onCloseClick={() => setSelectedId(null)}
          >
            <div style={{ minWidth: 160, padding: "0.15rem 0.25rem" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {selectedSite.name}
              </p>
              {selectedSite.city && (
                <p className="tool-muted" style={{ margin: 0 }}>
                  {selectedSite.city}
                </p>
              )}
              <p
                style={{
                  margin: "0.25rem 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.75rem",
                }}
              >
                <span
                  className="zone-dot"
                  style={{ background: getSiteStatusColor(selectedSite.status) }}
                />
                {STATUS_LABELS[selectedSite.status]}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="map-toolbar">
        <div className="map-toolbar-group">
          <button
            type="button"
            onClick={() => toggleMode("polygon")}
            className={`map-tool-btn${drawMode === "polygon" ? " active" : ""}`}
          >
            <span aria-hidden>⬡</span> Draw zone
          </button>
          <button
            type="button"
            onClick={() => toggleMode("rectangle")}
            className={`map-tool-btn${drawMode === "rectangle" ? " active" : ""}`}
          >
            <span aria-hidden>▭</span> Rectangle
          </button>
          <button
            type="button"
            onClick={clearGeofence}
            disabled={geofence == null && drawMode === "idle" && !draft.length}
            className="map-tool-btn danger"
          >
            <span aria-hidden>✕</span> Clear
          </button>
        </div>

        {drawMode === "polygon" && draft.length > 0 && (
          <div className="map-toolbar-group" style={{ marginTop: "0.4rem" }}>
            <button type="button" onClick={undoPoint} className="map-tool-btn">
              Undo point
            </button>
            <button
              type="button"
              onClick={finishPolygon}
              disabled={draft.length < 3}
              className="map-tool-btn active"
            >
              Finish zone ({draft.length})
            </button>
          </div>
        )}

        {drawMode !== "idle" && (
          <p className="map-toolbar-hint">
            {drawMode === "rectangle"
              ? draft.length === 0
                ? "Click one corner of the rectangle."
                : "Now click the opposite corner."
              : draft.length < 3
                ? "Click the map to add corners — at least three."
                : "Keep clicking, or click the first point to close the zone."}
          </p>
        )}

        {geofencedSites.length > 0 && (
          <p className="map-toolbar-badge">
            {geofencedSites.length} site
            {geofencedSites.length === 1 ? "" : "s"} in zone
          </p>
        )}
      </div>

      {hasGeofence && geofence && (
        <GeofencePanel
          key={geofenceNonce}
          polygon={geofence}
          onClearZone={clearGeofence}
        />
      )}
    </div>
  );
}

/**
 * Renders an expanding, fading ring beneath each in-geofence marker. Runs
 * its own requestAnimationFrame loop so the pulse never re-renders SiteMap
 * or the static status markers.
 */
function GeofenceHalo({ sites }) {
  const [now, setNow] = useState(() => performance.now());

  useEffect(() => {
    let frame = 0;
    const loop = () => {
      setNow(performance.now());
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const progress = (now % HALO_PERIOD_MS) / HALO_PERIOD_MS;
  const haloIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 10 + progress * 18,
    fillColor: GEOFENCE_COLOR,
    fillOpacity: 0.3 * (1 - progress),
    strokeColor: GEOFENCE_COLOR,
    strokeOpacity: 0.45 * (1 - progress),
    strokeWeight: 1,
  };

  return (
    <>
      {sites.map((site) => (
        <Marker
          key={site.id}
          position={{ lat: site.lat, lng: site.lng }}
          icon={haloIcon}
          clickable={false}
          zIndex={1}
        />
      ))}
    </>
  );
}
