import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";
import { SaudiRiyal } from "lucide-react";

export default function Budget_Spent({
  form,
  project,
  editMode,
  isFullEditor,
  setForm,
}) {
  return (
    <div className="  glass-panel">
      <h3 style={{ margin: "0 0 0.5rem 0" }}>Budget & Spent</h3>

      {/* Budget vs Spent chart */}
      {(() => {
        const displayBudget = editMode
          ? Number(form.budget || 0)
          : Number(project.budget || 0);
        const displaySpent = editMode
          ? Number(form.spent || 0)
          : Number(project.spent || 0);
        const chartData = [
          { name: "Budget", value: displayBudget },
          { name: "Spent", value: displaySpent },
        ];

        return (
          <div>
            {editMode && isFullEditor && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <div>
                  <label className="form-label">Budget</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.budget}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        budget: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="form-label">Spent</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.spent}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        spent: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            )}

            <div style={{ height: 140, marginBottom: "0.5rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--text-secondary)" }}
                  />
                  <Tooltip
                    formatter={(val) => `${Number(val).toLocaleString()}`}
                  />
                  <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                    {chartData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={entry.name === "Spent" ? "#10b981" : "#4f46e5"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Budget
                </div>
                <div style={{ fontWeight: 700 }}>
                  <SaudiRiyal size={12} /> {displayBudget.toLocaleString()}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Spent
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: displaySpent > displayBudget ? "#dc2626" : "#10b981",
                  }}
                >
                  <SaudiRiyal size={12} /> {displaySpent.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
