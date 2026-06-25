import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { formatDate } from "../utils/date";
import { getCatBadge, getPriorityBadge } from "../utils/helpers";

export default function ProjectCard({ proj, i }) {
  return (
    <div
      key={i}
      className="glass-panel"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "700",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          <Link
            to={`/projects/${proj._id}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {proj.title}
          </Link>
        </h3>
        <span className={`badge ${getCatBadge(proj.category)}`}>
          {proj.category}
        </span>
      </div>

      <p
        style={{
          fontSize: "0.8rem",
          color: "var(--text-secondary)",
          marginBottom: "1.5rem",
          minHeight: "40px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {proj.description.slice(0, 100) || "\u00A0"}
      </p>

      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            fontWeight: "600",
            color: "var(--text-secondary)",
          }}
        >
          <span>Progress</span>
          <span>{proj.progress}%</span>
        </div>
        <div className="progress-bg">
          <div
            className="progress-fill progress-bar-color"
            style={{
              width: `${proj.progress}%`,
              // background:
              //   proj.category === "Smart Meter"
              //     ? "#10b981"
              //     : proj.category === "RMS"
              //       ? "#3b82f6"
              //       : "#8b5cf6",
            }}
          ></div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              background: "#f8fafc",
              padding: "0.1rem 0.5rem",
              borderRadius: "9999px",
              fontSize: "0.7rem",
              fontWeight: "500",
              color: "#475569",
            }}
          >
            {proj.status}
          </div>
          <div className={getPriorityBadge(proj.priority)}>{proj.priority}</div>
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid var(--surface-border)",
          paddingTop: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            className="avatar"
            style={{
              background: proj.avatarBg,
            }}
          >
            {/* show badge with name first letter */}
            <span
              className="avatar-letter"
              style={{
                color: "#4f46e5",
                background: "#e0e7ff",
                borderRadius: "9999px",
                padding: "0.3rem 0.5rem",
              }}
            >
              {proj?.teamLead?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            {proj.teamLead}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.75rem",
          }}
        >
          <Calendar size={14} />
          {formatDate(proj.createdAt)}
        </div>
      </div>
    </div>
  );
}
