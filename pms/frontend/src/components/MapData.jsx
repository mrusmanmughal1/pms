export default function MapData({ project }) {
  return (
    <div className="glass-panel" style={{ padding: "1.25rem 1.5rem" }}>
      <h4 style={{ margin: "0 0 0.5rem 0" }}>Location</h4>
      <div
        style={{
          width: "100%",
          height: "260px",
          borderRadius: "0.75rem",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}
      >
        <iframe
          title="Project location map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${project.longitude - 0.02}%2C${project.latitude - 0.01}%2C${project.longitude + 0.02}%2C${project.latitude + 0.01}&layer=mapnik&marker=${project.latitude}%2C${project.longitude}`}
        ></iframe>
      </div>
      <div
        style={{
          marginTop: "0.75rem",
          color: "var(--text-secondary)",
          fontSize: "0.9rem",
        }}
      >
        <a
          href={`https://www.openstreetmap.org/?mlat=${project.latitude}&mlon=${project.longitude}#map=15/${project.latitude}/${project.longitude}`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#2563eb" }}
        >
          View on OpenStreetMap
        </a>
      </div>
    </div>
  );
}
