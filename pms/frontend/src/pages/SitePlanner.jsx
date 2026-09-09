import { useMemo } from "react";
import { CheckCircle2, MapPinned } from "lucide-react";
import SiteUpload from "../components/siteplanner/SiteUpload";
import CityPanel from "../components/siteplanner/CityPanel";
import SavedZones from "../components/siteplanner/SavedZones";
import DayPlanner from "../components/siteplanner/DayPlanner";
import SiteMap from "../components/siteplanner/SiteMap";
import { useSiteStore } from "../store/siteStore";

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export default function SitePlanner() {
  const sites = useSiteStore((s) => s.sites);
  const dayPlans = useSiteStore((s) => s.dayPlans);

  const today = useMemo(() => todayISO(), []);

  const completedToday = useMemo(() => {
    const seen = new Set();
    for (const plan of dayPlans) {
      if (plan.date !== today) continue;
      for (const s of plan.sites) {
        if (s.status === "completed") seen.add(s.id);
      }
    }
    return seen.size;
  }, [dayPlans, today]);

  const activePlan = dayPlans.length > 0 ? dayPlans[dayPlans.length - 1] : null;

  if (sites.length === 0) {
    return (
      <div className="tool-empty-state">
        <div className="tool-empty-icon">
          <MapPinned size={22} />
        </div>
        <h2 style={{ fontSize: "1.35rem" }}>Plan your sites, one day at a time</h2>
        <p style={{ maxWidth: 460, margin: "0 auto 1.5rem" }}>
          Upload an Excel or CSV of site locations, pick a city and a date, and
          the planner builds an optimised route for the day.
        </p>
        <SiteUpload large />
      </div>
    );
  }

  return (
    <div className="site-planner">
      <div className="tool-stat-bar glass-panel">
        <div className="tool-stat">
          <span className="tool-muted">Total sites</span>
          <strong>{sites.length}</strong>
        </div>
        <span className="tool-stat-divider" />
        <div className="tool-stat">
          <CheckCircle2 size={15} style={{ color: "var(--success)" }} />
          <span className="tool-muted">Completed today</span>
          <strong>{completedToday}</strong>
        </div>
        <span className="tool-stat-divider" />
        <div className="tool-stat">
          <span className="tool-muted">Saved plans</span>
          <strong>{dayPlans.length}</strong>
        </div>
      </div>

      <div className="site-planner-body">
        <aside className="site-planner-aside">
          <SiteUpload />
          <CityPanel />
          <SavedZones />
          <DayPlanner />
        </aside>

        <section className="site-planner-map">
          <SiteMap activeDayPlan={activePlan} />
        </section>
      </div>
    </div>
  );
}
