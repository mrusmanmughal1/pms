import { useState } from "react";
import toast from "react-hot-toast";
import { useSiteStore } from "../../store/siteStore";
import { buildRoute } from "../../utils/routeOptimizer";
import { mostCommonCity } from "../../utils/geofence";
import { v4 as uuidv4 } from 'uuid';
import {
  getSitePriorityClass,
  getSiteStatusColor,
} from "../../utils/statusColor";

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

/**
 * Floating card at the bottom-left of the map, shown only while a geofence
 * is active. Lets the user name and save the zone, plan it, or clear it.
 *
 * Mounted with a fresh `key` per drawn geofence (see SiteMap), so the
 * unsaved/saved local state resets automatically for each new zone.
 */
export default function GeofencePanel({ polygon, onClearZone }) {
  const geofencedSites = useSiteStore((s) => s.geofencedSites);
  const savedGeofences = useSiteStore((s) => s.savedGeofences);
  const saveGeofence = useSiteStore((s) => s.saveGeofence);
  const addDayPlan = useSiteStore((s) => s.addDayPlan);
  const setSelectedCity = useSiteStore((s) => s.setSelectedCity);
  const setCurrentPlanId = useSiteStore((s) => s.setCurrentPlanId);

  const detectedCity = mostCommonCity(geofencedSites);

  // Pre-fill "{City} Zone {N}", numbered per city. Lazy init runs once on
  // mount — and the panel remounts per geofence, so this is fresh each time.
  const [zoneName, setZoneName] = useState(() => {
    if (!detectedCity) return `Zone ${savedGeofences.length + 1}`;
    const n = savedGeofences.filter((z) => z.city === detectedCity).length + 1;
    return `${detectedCity} Zone ${n}`;
  });
  const [saved, setSaved] = useState(false);

  if (geofencedSites.length === 0) return null;

  const count = geofencedSites.length;

  const handleSave = () => {
    const name = zoneName.trim() || detectedCity || "Zone";
    saveGeofence(name, polygon, geofencedSites);
    setZoneName(name);
    setSaved(true);
    toast.success("Zone saved");
  };

  // Build a day plan from the exact geofenced sites and show it in DayPlanner.
  const handlePlanThese = () => {
    const plan = {
      id: uuidv4(),
      date: todayISO(),
      city: detectedCity || geofencedSites[0].city || "—",
      sites: geofencedSites,
      route: buildRoute(geofencedSites),
    };
    addDayPlan(plan);
    if (detectedCity) setSelectedCity(detectedCity);
    setCurrentPlanId(plan.id);
  };

  return (
    <div className="geofence-panel">
      {saved ? (
        <div style={{ padding: "0.75rem 1rem" }}>
          <div className="geofence-panel-title">
            <span aria-hidden>⬡</span>
            {zoneName}
          </div>
          <p className="tool-muted" style={{ margin: "0.15rem 0 0" }}>
            {count} site{count === 1 ? "" : "s"} inside
          </p>
        </div>
      ) : (
        <div className="geofence-panel-head">
          <div className="geofence-panel-title">
            <span aria-hidden>⬡</span>
            New zone
            <span className="tool-muted" style={{ fontWeight: 400 }}>
              · {count} site{count === 1 ? "" : "s"} inside
            </span>
          </div>

          <label
            className="form-label"
            style={{ marginTop: "0.6rem", fontSize: "0.75rem" }}
          >
            Zone name
          </label>
          <input
            type="text"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            placeholder="Name this zone"
            className="form-input"
            style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
          />

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem" }}>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary"
              style={{ flex: 1, padding: "0.45rem", fontSize: "0.75rem" }}
            >
              Save zone
            </button>
            <button
              type="button"
              onClick={handlePlanThese}
              className="btn btn-outline"
              style={{ flex: 1, padding: "0.45rem", fontSize: "0.75rem" }}
            >
              Plan these sites
            </button>
          </div>
        </div>
      )}

      <ul className="geofence-site-list">
        {geofencedSites.map((site) => (
          <li key={site.id}>
            <span
              className="zone-dot"
              style={{ backgroundColor: getSiteStatusColor(site.status) }}
            />
            <span className="geofence-site-name">{site.name}</span>
            {site.priority && (
              <span className={getSitePriorityClass(site.priority)}>
                {site.priority}
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="geofence-panel-foot">
        {saved && (
          <button
            type="button"
            onClick={handlePlanThese}
            className="btn btn-primary"
            style={{ flex: 1, padding: "0.45rem", fontSize: "0.75rem" }}
          >
            Plan these sites
          </button>
        )}
        <button
          type="button"
          onClick={onClearZone}
          className="btn btn-outline"
          style={{ flex: 1, padding: "0.45rem", fontSize: "0.75rem" }}
        >
          Clear zone
        </button>
      </div>
    </div>
  );
}
