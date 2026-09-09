import { useState } from "react";
import { ChevronDown, Download, MapPin, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSiteStore } from "../../store/siteStore";
import { getSitesInPath } from "../../utils/geofence";
import { exportZonesToExcel } from "../../utils/exportSites";
import { buildRoute } from "../../utils/routeOptimizer";
import { formatDate } from "../../utils/date";
import ConfirmModal from "../ConfirmModal";

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

/**
 * Collapsible panel listing persisted geofences. Each zone can be re-drawn
 * on the map ("Load"), turned into a day plan ("Plan"), or deleted.
 */
export default function SavedZones() {
  const savedGeofences = useSiteStore((s) => s.savedGeofences);
  const sites = useSiteStore((s) => s.sites);
  const deleteGeofence = useSiteStore((s) => s.deleteGeofence);
  const loadSavedZone = useSiteStore((s) => s.loadSavedZone);
  const addDayPlan = useSiteStore((s) => s.addDayPlan);
  const setSelectedCity = useSiteStore((s) => s.setSelectedCity);
  const setCurrentPlanId = useSiteStore((s) => s.setCurrentPlanId);

  const [expanded, setExpanded] = useState(true);
  const [zoneToDelete, setZoneToDelete] = useState(null);

  // Re-runs containment against the *current* sites — they may have changed
  // since the zone was saved — then builds a plan and shows it in DayPlanner.
  const handlePlan = (zone) => {
    const inside = getSitesInPath(sites, zone.coordinates);
    if (inside.length === 0) {
      toast.error(`"${zone.name}" no longer contains any sites.`);
      return;
    }
    const plan = {
      id: crypto.randomBytes(16).toString('hex'),
      date: todayISO(),
      city: zone.city || inside[0].city || "—",
      sites: inside,
      route: buildRoute(inside),
    };
    addDayPlan(plan);
    if (zone.city) setSelectedCity(zone.city);
    setCurrentPlanId(plan.id);
  };

  return (
    <div className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="tool-panel-header"
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <div className="tool-panel-title">
          <MapPin size={16} />
          Saved zones
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="tool-count-pill">{savedGeofences.length}</span>
          <ChevronDown
            size={15}
            style={{
              transition: "transform var(--transition-speed)",
              transform: expanded ? "none" : "rotate(-90deg)",
              color: "var(--text-secondary)",
            }}
          />
        </div>
      </button>

      {expanded && (
        <div style={{ padding: "0.75rem", borderTop: "1px solid var(--surface-border)" }}>
          {savedGeofences.length === 0 ? (
            <p
              className="tool-muted"
              style={{ textAlign: "center", padding: "1.25rem 0.5rem", margin: 0 }}
            >
              No saved zones yet. Draw a zone on the map and save it to reuse
              later.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {savedGeofences.map((zone) => (
                <div key={zone.id} className="zone-card">
                  <div className="flex-between" style={{ margin: 0 }}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        minWidth: 0,
                      }}
                    >
                      <span
                        className="zone-dot"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="zone-name">{zone.name}</span>
                    </span>
                    <span className="tool-muted">
                      {zone.siteCount} site{zone.siteCount === 1 ? "" : "s"}
                    </span>
                  </div>

                  <p
                    className="tool-muted"
                    style={{ margin: "0.15rem 0 0", paddingLeft: 18 }}
                  >
                    {zone.city || "Unknown"} · saved {formatDate(zone.createdAt)}
                  </p>

                  <div className="zone-actions">
                    <button
                      type="button"
                      onClick={() => loadSavedZone(zone)}
                      className="btn btn-outline"
                      style={{ flex: 1, padding: "0.35rem", fontSize: "0.75rem" }}
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePlan(zone)}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: "0.35rem", fontSize: "0.75rem" }}
                    >
                      Plan
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoneToDelete(zone)}
                      aria-label={`Delete ${zone.name}`}
                      className="btn btn-outline zone-delete"
                      style={{ padding: "0.35rem 0.5rem" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {savedGeofences.length > 0 && (
            <button
              type="button"
              onClick={() => exportZonesToExcel(savedGeofences, sites)}
              className="btn btn-primary"
              style={{
                width: "100%",
                marginTop: "0.5rem",
                padding: "0.55rem",
                fontSize: "0.8rem",
              }}
            >
              <Download size={14} />
              Export all zones
            </button>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={zoneToDelete != null}
        title="Delete zone"
        message={
          zoneToDelete
            ? `Delete "${zoneToDelete.name}"? This cannot be undone.`
            : ""
        }
        onConfirm={() => {
          deleteGeofence(zoneToDelete.id);
          setZoneToDelete(null);
        }}
        onClose={() => setZoneToDelete(null)}
      />
    </div>
  );
}
