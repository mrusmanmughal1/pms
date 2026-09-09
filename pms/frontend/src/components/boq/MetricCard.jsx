export default function MetricCard({ value, label, accent }) {
  return (
    <div className={`glass-panel metric-card${accent ? " accent" : ""}`}>
      <p className="metric-value">{value}</p>
      <p className="metric-label">{label}</p>
    </div>
  );
}
