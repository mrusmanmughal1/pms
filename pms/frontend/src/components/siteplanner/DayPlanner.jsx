import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  Download,
  Flag,
  MapPin,
  Minus,
  Navigation,
  Plus,
} from "lucide-react";
import { useSiteStore } from "../../store/siteStore";
import {
  buildRoute,
  getNearestSites,
  haversineDistance,
  formatDistance,
  formatDriveTime,
  routeDistance,
} from "../../utils/routeOptimizer";
import { exportDayPlanToExcel } from "../../utils/exportSites";
import { formatDate } from "../../utils/date";
import {
  getSitePriorityClass,
  getSiteStatusColor,
} from "../../utils/statusColor";

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export default function DayPlanner() {
  const sites = useSiteStore((s) => s.sites);
  const dayPlans = useSiteStore((s) => s.dayPlans);
  const selectedCity = useSiteStore((s) => s.selectedCity);
  const setSelectedCity = useSiteStore((s) => s.setSelectedCity);
  const addDayPlan = useSiteStore((s) => s.addDayPlan);
  const updateSiteStatus = useSiteStore((s) => s.updateSiteStatus);
  const currentPlanId = useSiteStore((s) => s.currentPlanId);
  const setCurrentPlanId = useSiteStore((s) => s.setCurrentPlanId);
  const geofencedSites = useSiteStore((s) => s.geofencedSites);

  const [rawSiteCount, setSiteCount] = useState(5);
  const [dateString, setDateString] = useState(todayISO);
  const rootRef = useRef(null);

  const cities = useMemo(() => {
    const set = new Set();
    for (const s of sites) if (s.city) set.add(s.city);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [sites]);

  const citySites = useMemo(
    () => (selectedCity ? sites.filter((s) => s.city === selectedCity) : []),
    [sites, selectedCity],
  );

  // An active geofence overrides the city filter as the planning pool.
  const usingGeofence = geofencedSites.length > 0;
  const maxCount = usingGeofence ? geofencedSites.length : citySites.length;

  // Clamped during render rather than in an effect: the pool size changes
  // whenever the city or the geofence changes, and syncing that through
  // setState would cascade an extra render each time.
  const siteCount =
    maxCount > 0 ? Math.min(Math.max(rawSiteCount, 1), maxCount) : rawSiteCount;

  useEffect(() => {
    if (selectedCity && !cities.includes(selectedCity)) {
      setSelectedCity(null);
      setCurrentPlanId(null);
    }
  }, [cities, selectedCity, setSelectedCity, setCurrentPlanId]);

  // Bring the planner into view whenever a plan becomes active — including
  // a plan handed over by the GeofencePanel's "Plan these sites".
  useEffect(() => {
    if (currentPlanId) {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPlanId]);

  const currentPlan = useMemo(
    () => dayPlans.find((p) => p.id === currentPlanId) ?? null,
    [dayPlans, currentPlanId],
  );

  const canPlan =
    (usingGeofence || selectedCity != null) &&
    maxCount > 0 &&
    siteCount > 0 &&
    dateString !== "";

  const handlePlan = () => {
    if (!canPlan) return;

    if (usingGeofence) {
      const selected = geofencedSites.slice(0, siteCount);
      if (selected.length === 0) return;
      const plan = {
        id: crypto.randomUUID(),
        date: dateString,
        city: selectedCity ?? selected[0].city ?? "—",
        sites: selected,
        route: buildRoute(selected),
      };
      addDayPlan(plan);
      setCurrentPlanId(plan.id);
      return;
    }

    if (!selectedCity) return;
    const cluster = getNearestSites(citySites, Math.min(siteCount, maxCount));
    const plan = {
      id: crypto.randomUUID(),
      date: dateString,
      city: selectedCity,
      sites: cluster,
      route: buildRoute(cluster),
    };
    addDayPlan(plan);
    setCurrentPlanId(plan.id);
  };

  const toggleCompleted = (site) => {
    updateSiteStatus(
      site.id,
      site.status === "completed" ? "pending" : "completed",
    );
  };

  const stepDown = () => setSiteCount((c) => Math.max(1, c - 1));
  const stepUp = () =>
    setSiteCount((c) => Math.min(Math.max(1, maxCount), c + 1));

  if (sites.length === 0) return null;

  const fieldsDisabled = !usingGeofence && (!selectedCity || maxCount === 0);

  return (
    <div
      ref={rootRef}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div className="glass-panel" style={{ padding: 0, overflow: "hidden" }}>
        <div className="tool-panel-header">
          <div className="tool-panel-title">
            <CalendarIcon size={16} />
            Plan a day
          </div>
        </div>

        <div style={{ padding: "1rem" }}>
          {usingGeofence && (
            <div className="tool-alert tool-alert-success" style={{ marginTop: 0 }}>
              <span aria-hidden>⬡</span>
              <p style={{ margin: 0, color: "inherit" }}>
                Using zone selection — {geofencedSites.length} site
                {geofencedSites.length === 1 ? "" : "s"} pre-selected
              </p>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="city-select">
              City
            </label>
            <select
              id="city-select"
              className="form-select"
              value={selectedCity ?? ""}
              onChange={(e) => {
                setSelectedCity(e.target.value || null);
                setCurrentPlanId(null);
              }}
            >
              <option value="">Select a city…</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Sites to visit</label>
            <div className={`stepper${fieldsDisabled ? " disabled" : ""}`}>
              <button
                type="button"
                onClick={stepDown}
                disabled={fieldsDisabled || siteCount <= 1}
                aria-label="Decrease count"
              >
                <Minus size={15} />
              </button>
              <div className="stepper-value">
                {fieldsDisabled ? "–" : siteCount}
              </div>
              <button
                type="button"
                onClick={stepUp}
                disabled={fieldsDisabled || siteCount >= maxCount}
                aria-label="Increase count"
              >
                <Plus size={15} />
              </button>
            </div>
            <p className="tool-muted" style={{ marginTop: "0.4rem" }}>
              {usingGeofence
                ? `${maxCount} in the current zone`
                : selectedCity
                  ? `${maxCount} available in ${selectedCity}`
                  : "Select a city to see availability"}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="date-input">
              Date
            </label>
            <input
              id="date-input"
              type="date"
              className="form-input"
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={handlePlan}
            disabled={!canPlan}
            className="btn btn-primary"
            style={{
              width: "100%",
              opacity: canPlan ? 1 : 0.5,
              cursor: canPlan ? "pointer" : "not-allowed",
            }}
          >
            <Navigation size={15} />
            Plan my day
          </button>
        </div>
      </div>

      {currentPlan && (
        <RouteResult plan={currentPlan} onToggleCompleted={toggleCompleted} />
      )}
    </div>
  );
}

function RouteResult({ plan, onToggleCompleted }) {
  const route = plan.route;
  const totalKm = useMemo(() => routeDistance(route), [route]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div className="glass-panel route-summary">
        <div className="route-summary-title">
          <MapPin size={15} />
          <span>{plan.city}</span>
          <span className="tool-muted">·</span>
          <span>{formatDate(plan.date)}</span>
        </div>
        <div className="route-summary-meta">
          <span>
            {route.length} {route.length === 1 ? "stop" : "stops"}
          </span>
          <span>·</span>
          <span>{formatDistance(totalKm)} total</span>
          <span>·</span>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <Clock size={12} />
            {formatDriveTime(totalKm)}
          </span>
        </div>
      </div>

      <Timeline route={route} onToggleCompleted={onToggleCompleted} />

      <button
        type="button"
        onClick={() => exportDayPlanToExcel(plan)}
        className="btn btn-primary"
        style={{ width: "100%" }}
      >
        <Download size={15} />
        Export day plan to Excel
      </button>
    </div>
  );
}

function Timeline({ route, onToggleCompleted }) {
  if (route.length === 0) return null;

  const firstDone = route[0].status === "completed";
  const lastDone = route[route.length - 1].status === "completed";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <RailLabel variant="start" done={firstDone} />

      {route.map((site, idx) => {
        const isLast = idx === route.length - 1;
        const distance = isLast ? null : haversineDistance(site, route[idx + 1]);

        return (
          <Fragment key={site.id}>
            <StopRow
              site={site}
              index={idx}
              onToggle={() => onToggleCompleted(site)}
            />
            {!isLast && distance != null && (
              <RailSegment
                done={site.status === "completed"}
                distanceKm={distance}
              />
            )}
          </Fragment>
        );
      })}

      <RailLabel variant="end" done={lastDone} />
    </div>
  );
}

function RailLabel({ variant, done }) {
  const isStart = variant === "start";

  const line = (
    <div className="rail-cell">
      <div className={`rail-line short${done ? " done" : ""}`} />
    </div>
  );

  // The pill lives in the content column, not the 28px rail column, so a
  // wider label can never be clipped by the rail.
  const pill = (
    <div className="rail-tag-cell">
      <span className={`rail-tag ${isStart ? "start" : "end"}`}>
        {!isStart && <Flag size={10} />}
        {isStart ? "Start" : "End"}
      </span>
    </div>
  );

  return (
    <div className="rail-grid">
      {isStart ? (
        <>
          <div />
          {pill}
          {line}
          <div />
        </>
      ) : (
        <>
          {line}
          <div />
          <div />
          {pill}
        </>
      )}
    </div>
  );
}

function RailSegment({ done, distanceKm }) {
  return (
    <div className="rail-grid" style={{ alignItems: "center" }}>
      <div className="rail-cell" style={{ height: 40 }}>
        <div className={`rail-line${done ? " done" : ""}`} />
      </div>
      <div className={`rail-distance${done ? " done" : ""}`}>
        <span style={{ fontWeight: 500 }}>{formatDistance(distanceKm)}</span>
        <span className="tool-muted"> · </span>
        <span>{formatDriveTime(distanceKm)} drive</span>
      </div>
    </div>
  );
}

function StopRow({ site, index, onToggle }) {
  const completed = site.status === "completed";

  return (
    <div className="rail-grid">
      <div className="rail-cell" style={{ paddingTop: "1rem" }}>
        <span
          className="stop-marker"
          style={{ background: getSiteStatusColor(site.status) }}
        >
          {completed ? <Check size={14} /> : index + 1}
        </span>
      </div>

      <div className={`stop-card${completed ? " completed" : ""}`}>
        <div className="flex-between" style={{ margin: 0 }}>
          <span className="stop-eyebrow">Stop {index + 1}</span>
          {completed && (
            <span className="stop-done-tag">
              <Check size={11} /> Done
            </span>
          )}
        </div>

        <p className={`stop-name${completed ? " completed" : ""}`}>
          {site.name}
        </p>

        {site.address && (
          <p className="tool-muted" style={{ margin: "0.15rem 0 0" }}>
            {site.address}
          </p>
        )}

        {(site.type || site.priority) && (
          <div className="stop-tags">
            {site.type && <span className="stop-type-tag">{site.type}</span>}
            {site.priority && (
              <span className={getSitePriorityClass(site.priority)}>
                {site.priority}
              </span>
            )}
          </div>
        )}

        <label className="stop-check">
          <input type="checkbox" checked={completed} onChange={onToggle} />
          <span>{completed ? "Completed" : "Mark as completed"}</span>
        </label>
      </div>
    </div>
  );
}
