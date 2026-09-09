import { useMemo } from "react";
import { Download, Layers, MapPin } from "lucide-react";
import { useSiteStore } from "../../store/siteStore";
import { exportAllDayPlansToExcel } from "../../utils/exportSites";

function pct(completed, total) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export default function CityPanel() {
  const sites = useSiteStore((s) => s.sites);
  const dayPlans = useSiteStore((s) => s.dayPlans);
  const selectedCity = useSiteStore((s) => s.selectedCity);
  const setSelectedCity = useSiteStore((s) => s.setSelectedCity);

  const cityStats = useMemo(() => {
    const byCity = new Map();
    for (const s of sites) {
      if (!s.city) continue;
      let entry = byCity.get(s.city);
      if (!entry) {
        entry = { city: s.city, total: 0, completed: 0 };
        byCity.set(s.city, entry);
      }
      entry.total++;
      if (s.status === "completed") entry.completed++;
    }
    return Array.from(byCity.values()).sort((a, b) =>
      a.city.localeCompare(b.city),
    );
  }, [sites]);

  const totalSites = sites.length;
  const totalCompleted = useMemo(
    () => sites.filter((s) => s.status === "completed").length,
    [sites],
  );
  const allActive = selectedCity == null;

  if (totalSites === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
      <div className="tool-panel-header">
        <div className="tool-panel-title">
          <Layers size={16} />
          Cities
        </div>
        <span className="tool-count-pill">
          {cityStats.length} {cityStats.length === 1 ? "city" : "cities"}
        </span>
      </div>

      <div style={{ padding: "0.75rem", maxHeight: 320, overflowY: "auto" }}>
        <button
          type="button"
          onClick={() => setSelectedCity(null)}
          className={`city-row${allActive ? " active" : ""}`}
        >
          <div className="flex-between" style={{ margin: 0 }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
              All sites
            </span>
            <span className="tool-muted">
              {totalCompleted} / {totalSites}
            </span>
          </div>
        </button>

        {cityStats.map((c) => {
          const active = c.city === selectedCity;
          const percent = pct(c.completed, c.total);
          return (
            <button
              key={c.city}
              type="button"
              onClick={() => setSelectedCity(c.city)}
              className={`city-row${active ? " active" : ""}`}
            >
              <div className="flex-between" style={{ margin: 0 }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    minWidth: 0,
                  }}
                >
                  <MapPin size={14} />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.city}
                  </span>
                </span>
                <span className="tool-muted">
                  {c.total} {c.total === 1 ? "site" : "sites"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                }}
              >
                <div
                  className="progress-bg"
                  style={{ height: 6, margin: 0, flex: 1 }}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={c.total}
                  aria-valuenow={c.completed}
                  aria-label={`${c.city} completion`}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${percent}%`,
                      background: "var(--success)",
                    }}
                  />
                </div>
                <span className="tool-muted" style={{ minWidth: 42 }}>
                  {c.completed}/{c.total}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {dayPlans.length > 0 && (
        <div className="tool-panel-footer">
          <button
            type="button"
            onClick={() => exportAllDayPlansToExcel(dayPlans)}
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.55rem" }}
          >
            <Download size={14} />
            Export all plans ({dayPlans.length})
          </button>
        </div>
      )}
    </div>
  );
}
