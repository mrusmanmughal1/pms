import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Folder,
  Loader,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  ArrowRight,
} from "lucide-react";

import { toast } from "react-hot-toast";
import { useStats } from "../hooks/project";
import { useProjectsHook } from "../hooks/project";
import { formatDate } from "../utils/date";
import { getCatBadge } from "../utils/helpers";
import ProjectCard from "../components/ProjectCard";

const Dashboard = () => {
  const {
    data: projects = [],
    isLoading: projectsLoading,
    isError: projectsError,
  } = useProjectsHook();
  const limitedProjects = projects.slice(0, 6);
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useStats();

  // Loading and error handling
  if (projectsLoading || statsLoading)
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  if (projectsError || statsError)
    return <div className="text-red-500">Failed to load data.</div>;

  // Use stats for aggregated values
  const totalProjects = stats?.totalProjects || 0;
  const inProgressCount = stats?.inProgressCount || 0;
  const completedCount = stats?.completedCount || 0;
  const criticalCount = stats?.criticalCount || 0;
  const totalBudget = stats?.totalBudget || 0;

  // Use stats arrays for charts
  const categoryData = (stats?.categoryData || []).map((c, idx) => ({
    ...c,
    color: ["#f59e0b", "#10b981", "#8b5cf6"][idx % 3],
  }));
  const statusData = (stats?.statusData || []).map((s, idx) => ({
    ...s,
    fill: ["#f59e0b", "#10b981", "#8b5cf6", "#ef4444"][idx % 4],
  }));
  const budgetData = (stats?.budgetData || []).map((p) => ({
    name: p.title?.substring(0, 15) + "...",
    Budget: p.budget || 0,
    Spent: p.spent || 0,
  }));

  // Top Stats Data
  const topStats = [
    {
      title: "Total Projects",
      value: String(totalProjects),
      icon: <Folder size={20} color="#3b82f6" />,
      bg: "#eff6ff",
    },
    {
      title: "In Progress",
      value: String(inProgressCount),
      icon: <Loader size={20} color="#f59e0b" />,
      bg: "#fef3c7",
    },
    {
      title: "Completed",
      value: String(completedCount),
      icon: <ShieldCheck size={20} color="#10b981" />,
      bg: "#d1fae5",
    },
    {
      title: "Critical Priority",
      value: String(criticalCount),
      icon: <AlertTriangle size={20} color="#ef4444" />,
      bg: "#fee2e2",
    },
    {
      title: "Total Budget",
      value: `$${totalBudget.toLocaleString()}`,
      icon: <DollarSign size={20} color="#8b5cf6" />,
      bg: "#ede9fe",
    },
  ];

  const getPriorityBadge = (prio) => {
    if (prio === "Critical") return "priority-critical";
    return "priority-high";
  };

  return (
    <div>
      {/* Top Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {topStats.map((stat, i) => (
          <div
            key={i}
            className="glass-panel"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                background: stat.bg,
                padding: "0.75rem",
                borderRadius: "0.5rem",
                display: "flex",
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  lineHeight: "1.2",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  fontWeight: "500",
                }}
              >
                {stat.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1.5rem",
          height: "320px",
          marginBottom: "2rem",
        }}
      >
        {/* Category Chart */}
        <div
          className="glass-panel"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h3 style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
            Projects by Category
          </h3>
          <div style={{ flex: 1, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="rect"
                  wrapperStyle={{ fontSize: "0.75rem" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div
          className="glass-panel"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h3 style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
            Status Distribution
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  tickCount={5}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget vs Spent */}
        <div
          className="glass-panel"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h3 style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
            Budget vs. Spent
          </h3>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={budgetData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                barGap={0}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 8, fill: "#64748b" }}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    fontSize: "12px",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  iconType="rect"
                  wrapperStyle={{ fontSize: "0.75rem", bottom: -5 }}
                />
                <Bar
                  dataKey="Budget"
                  fill="#c7d2fe"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={20}
                />
                <Bar
                  dataKey="Spent"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Projects Title */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ fontSize: "1.1rem" }}>Recent Projects</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            color: "var(--primary-color)",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          View All <ArrowRight size={16} />
        </div>
      </div>

      {/* Recent Projects Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
        }}
      >
        {limitedProjects.map((proj, i) => (
          <ProjectCard
            proj={proj}
            key={i}
            i={i}
            getCatBadge={getCatBadge}
            getPriorityBadge={getPriorityBadge}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
