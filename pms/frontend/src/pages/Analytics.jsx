import React, { useState, useMemo } from "react";
import { useProjectsHook } from "../hooks/project";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
};

export default function Analytics() {
  const { data: projects = [], isLoading } = useProjectsHook();
  const [filter, setFilter] = useState("All"); // All, Active, Completed

  // Filter projects based on toggle
  const filteredProjects = useMemo(() => {
    if (filter === "All") return projects;
    if (filter === "Completed")
      return projects.filter((p) => p.status === "Completed");
    if (filter === "Active")
      return projects.filter(
        (p) => p.status !== "Completed" && p.status !== "On Hold",
      );
    return projects;
  }, [projects, filter]);

  // KPIs
  const totalProjects = filteredProjects.length;
  const totalBudget = filteredProjects.reduce(
    (sum, p) => sum + (p.budget || 0),
    0,
  );
  const totalSpent = filteredProjects.reduce(
    (sum, p) => sum + (p.spent || 0),
    0,
  );
  const remaining = totalBudget - totalSpent;
  const totalUtilizedPercent =
    totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // Status Distribution
  const statusCounts = {
    Planning: 0,
    "In Progress": 0,
    Testing: 0,
    Completed: 0,
    "On Hold": 0,
  };

  filteredProjects.forEach((p) => {
    if (statusCounts[p.status] !== undefined) {
      statusCounts[p.status]++;
    }
  });
  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);

  // Category Breakdown
  const categoryMap = {};
  filteredProjects.forEach((p) => {
    if (!categoryMap[p.category]) {
      categoryMap[p.category] = { count: 0, budget: 0, spent: 0 };
    }
    categoryMap[p.category].count++;
    categoryMap[p.category].budget += p.budget || 0;
    categoryMap[p.category].spent += p.spent || 0;
  });

  const categoriesData = Object.keys(categoryMap)
    .map((key) => ({
      name: key,
      ...categoryMap[key],
      percentUsed:
        categoryMap[key].budget > 0
          ? Math.round((categoryMap[key].spent / categoryMap[key].budget) * 100)
          : 0,
    }))
    .sort((a, b) => b.budget - a.budget);

  const maxCategoryBudget = Math.max(...categoriesData.map((c) => c.budget), 1);

  const getStatusColor = (status) => {
    switch (status) {
      case "Planning":
        return "#94a3b8"; // Gray
      case "In Progress":
        return "#5a4af4"; // Purple
      case "Testing":
        return "#0ea5e9"; // Cyan
      case "Completed":
        return "#10b981"; // Green
      case "On Hold":
        return "#f59e0b"; // Orange
      default:
        return "#94a3b8";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return { color: "#ef4444", border: "1px solid #fecaca" };
      case "high":
        return { color: "#f59e0b", border: "1px solid #fde68a" };
      case "medium":
        return { color: "#3b82f6", border: "1px solid #bfdbfe" };
      case "low":
        return { color: "#64748b", border: "1px solid #e2e8f0" };
      default:
        return { color: "#64748b", border: "1px solid #e2e8f0" };
    }
  };

  if (isLoading) {
    return <div style={{ padding: "2rem" }}>Loading Analytics...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        color: "#1e293b",
      }}
    >
      {/* HEADER & TOGGLES */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>
            Analytics
          </h1>
          <p
            style={{
              color: "#64748b",
              marginTop: "0.5rem",
              fontSize: "0.9rem",
            }}
          >
            Track spend against allocated budgets across every project and
            category.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            backgroundColor: "#fff",
            borderRadius: "2rem",
            padding: "0.25rem",
            border: "1px solid #e2e8f0",
          }}
        >
          {["All", "Active", "Completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? "#5a4af4" : "transparent",
                color: filter === f ? "#fff" : "#64748b",
                border: "none",
                borderRadius: "1.5rem",
                padding: "0.5rem 1.25rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {/* PROJECTS */}
        <div className="glass-panel">
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#64748b",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            PROJECTS
          </div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "0.25rem",
            }}
          >
            {totalProjects}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
            In current view
          </div>
        </div>

        {/* TOTAL BUDGET */}
        <div className="glass-panel">
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#64748b",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            TOTAL BUDGET
          </div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "0.25rem",
            }}
          >
            {formatCurrency(totalBudget)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
            Sum of project budgets
          </div>
        </div>

        {/* TOTAL SPENT */}
        <div className="glass-panel">
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#64748b",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            TOTAL SPENT
          </div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "0.25rem",
            }}
          >
            {formatCurrency(totalSpent)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
            {totalUtilizedPercent}% utilized
          </div>
        </div>

        {/* REMAINING */}
        <div className="glass-panel">
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#64748b",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}
          >
            REMAINING
          </div>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "0.25rem",
            }}
          >
            {formatCurrency(remaining)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Available</div>
        </div>
      </div>

      {/* MIDDLE SECTION: Category Breakdown + Status Distribution */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2.5fr 1fr",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {/* Category Budget vs Spend */}
        <div className="glass-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
              Category Budget vs Spend
            </h3>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                fontSize: "0.75rem",
                color: "#64748b",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "2px",
                    border: "1px solid #5a4af4",
                    background: "transparent",
                  }}
                ></div>{" "}
                Allocated
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "2px",
                    background: "#5a4af4",
                  }}
                ></div>{" "}
                Spent
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {categoriesData.map((cat) => (
              <div
                key={cat.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "150px 1fr 80px",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    {cat.name}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                    {cat.count} project{cat.count !== 1 ? "s" : ""} •{" "}
                    {cat.percentUsed}% used
                  </div>
                </div>
                {/* Custom Bar */}
                <div
                  style={{
                    width: "100%",
                    height: "20px",
                    background: "#f8fafc",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  {/* Allocated Bar */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${(cat.budget / maxCategoryBudget) * 100}%`,
                      background: "#eef2ff",
                      borderRadius: "4px",
                    }}
                  ></div>
                  {/* Spent Bar */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${(cat.spent / maxCategoryBudget) * 100}%`,
                      background: "#5a4af4",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    {formatCurrency(cat.budget)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {formatCurrency(cat.spent)}
                  </div>
                </div>
              </div>
            ))}
            {categoriesData.length === 0 && (
              <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                No categories found in this view.
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="glass-panel">
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              margin: "0 0 1.5rem 0",
            }}
          >
            Status Distribution
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flex: 1,
              paddingBottom: "1rem",
              borderBottom: "1px dashed #e2e8f0",
            }}
          >
            {Object.keys(statusCounts).map((status) => {
              const count = statusCounts[status];
              const heightPercent =
                maxStatusCount > 0 ? (count / maxStatusCount) * 100 : 0;
              return (
                <div
                  key={status}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    width: "40px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#1e293b",
                    }}
                  >
                    {count}
                  </div>
                  <div
                    style={{
                      width: "32px",
                      height: `${Math.max(heightPercent, 2)}px`,
                      background: getStatusColor(status),
                      borderRadius: "6px 6px 0 0",
                      transition: "height 0.5s ease",
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "0.75rem",
            }}
          >
            {Object.keys(statusCounts).map((status) => (
              <div
                key={status}
                style={{
                  width: "40px",
                  textAlign: "center",
                  fontSize: "0.6rem",
                  color: "#64748b",
                }}
              >
                {status}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROJECT BREAKDOWN TABLE */}
      <div className="glass-panel">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "1.5rem",
          }}
        >
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
            Project Breakdown
          </h3>
          <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
            ( All {projects.length} projects )
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            >
              <th
                style={{
                  padding: "0.75rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                Project
              </th>
              <th
                style={{
                  padding: "0.75rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                Category
              </th>
              <th
                style={{
                  padding: "0.75rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: "0.75rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                Priority
              </th>
              <th
                style={{
                  padding: "0.75rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                Progress
              </th>
              <th
                style={{
                  padding: "0.75rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                Budget
              </th>
              <th
                style={{
                  padding: "0.75rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                Spent
              </th>
              <th
                style={{
                  padding: "0.75rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                Utilization
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p) => {
              const utilPercent =
                p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
              const utilColor =
                utilPercent > 90
                  ? "#ef4444"
                  : utilPercent > 75
                    ? "#f59e0b"
                    : "#10b981";

              return (
                <tr key={p._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#1e293b",
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#94a3b8",
                        marginTop: "2px",
                      }}
                    >
                      {p.teamLead || "Unassigned"}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "1rem 1.5rem",
                      fontSize: "0.85rem",
                      color: "#475569",
                    }}
                  >
                    {p.category}
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: getStatusColor(p.status),
                        color: "#fff",
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        ...getPriorityColor(p.priority),
                        backgroundColor: "transparent",
                      }}
                    >
                      {p.priority || "Medium"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", width: "120px" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "6px",
                        backgroundColor: "#f1f5f9",
                        borderRadius: "3px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${p.progress || 0}%`,
                          backgroundColor: "#5a4af4",
                          borderRadius: "3px",
                        }}
                      ></div>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "1rem 1.5rem",
                      fontSize: "0.85rem",
                      color: "#475569",
                    }}
                  >
                    {formatCurrency(p.budget)}
                  </td>
                  <td
                    style={{
                      padding: "1rem 1.5rem",
                      fontSize: "0.85rem",
                      color: "#475569",
                    }}
                  >
                    {formatCurrency(p.spent)}
                  </td>
                  <td
                    style={{
                      padding: "1rem 1.5rem",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: utilColor,
                    }}
                  >
                    {utilPercent}%
                  </td>
                </tr>
              );
            })}
            {filteredProjects.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No projects match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
