import { Link } from "react-router-dom";
import { Calendar, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { formatDate } from "../utils/date";
import { getCatBadge, getPriorityBadge } from "../utils/helpers";
import { getStatusColor } from "../utils/statusColor";

export default function ProjectCard({ proj, i }) {
  const now = new Date();
  const endDate = proj.endDate ? new Date(proj.endDate) : null;
  const isCompleted = proj.status === "Completed";

  let isOverdue = false;
  let isApproachingDeadline = false;

  if (endDate && !isCompleted) {
    if (now > endDate) {
      isOverdue = true;
    } else {
      const daysUntil = (endDate - now) / (1000 * 60 * 60 * 24);
      if (daysUntil <= 7 && daysUntil >= 0) {
        isApproachingDeadline = true;
      }
    }
  }

  const isCriticalPriority =
    (proj.priority === "Critical" || proj.priority === "High") && !isCompleted;
  const isReadyForReview = proj.progress >= 90 && !isCompleted;

  let borderColor = "transparent";
  let boxShadow = "0 0 8px rgba(10, 10, 10, 0.2)";
  if (isOverdue) {
    borderColor = "#ef4444";
    boxShadow = "0 0 8px rgba(239, 68, 68, 0.5)";
  } else if (isCriticalPriority) {
    borderColor = "#f97316";
    boxShadow = "0 0 8px rgba(249, 115, 22, 0.4)";
  } else if (isReadyForReview) {
    borderColor = "#10b981";
    boxShadow = "0 0 8px rgba(16, 185, 129, 0.4)";
  }

  return (
    <div
      key={i}
      className="glass-panel"
      style={{
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${borderColor}`,
        boxShadow: boxShadow,
        transition: "all 0.3s ease",
      }}
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
            {proj.title.length > 20
              ? proj.title.slice(0, 20) + "..."
              : proj.title}
          </Link>
        </h3>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {/* Alarms */}
          {isOverdue && (
            <div
              title="Overdue!"
              style={{
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.7rem",

                fontWeight: "600",
              }}
            >
              <Clock size={14} />
              <span>{formatDate(proj.endDate)}</span>
            </div>
          )}
          {isApproachingDeadline && !isOverdue && (
            <div
              title="Approaching Deadline"
              style={{
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Clock size={16} />{" "}
              <span
                style={{
                  fontSize: "0.7rem",
                  margin: "5px",
                  fontWeight: "600",
                }}
              >
                {formatDate(proj.endDate)}
              </span>
            </div>
          )}
          {isCriticalPriority && (
            <div
              title="High/Critical Priority"
              style={{
                color: "#f97316",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AlertTriangle size={16} />
            </div>
          )}
          {isReadyForReview && (
            <div
              title="Ready for Review"
              style={{
                color: "#10b981",
                display: "flex",
                alignItems: "center",
              }}
            >
              <CheckCircle size={16} />
            </div>
          )}

          <span className={`badge ${getCatBadge(proj.category)}`}>
            {proj.category}
          </span>
        </div>
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

      {(() => {
        const statusProgressMap = {
          Initiation: 0,
          Mapping: 20,
          Installation: 40,
          Integration: 65,
          Closeout: 85,
          Completed: 100,
        };
        const computedProgress =
          statusProgressMap[proj.status] !== undefined
            ? statusProgressMap[proj.status]
            : proj.progress || 0;

        return (
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
              <span>{computedProgress}%</span>
            </div>
            <div className="progress-bg">
              <div
                className="progress-fill progress-bar-color"
                style={{
                  width: `${computedProgress}%`,
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
                  background: getStatusColor(proj.status),
                  padding: "0.1rem 0.5rem",
                  borderRadius: "9999px",
                  fontSize: "0.7rem",
                  fontWeight: "500",
                  color: "white",
                }}
              >
                {proj.status}
              </div>
              <div className={getPriorityBadge(proj.priority)}>
                {proj.priority}
              </div>
            </div>
          </div>
        );
      })()}

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
