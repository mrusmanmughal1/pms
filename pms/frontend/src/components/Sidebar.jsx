import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Lock,
  LogOut,
  Radio,
  Gauge,
  ListTodo,
  LineChart,
  UserCog,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
//working
export default function Sidebar() {
  const {
    user,

    logout,
  } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img
          src="https://smart-life.sa/wp-content/uploads/2023/04/w-logo.png"
          alt="Smart life"
          width={120}
        />
      </div>
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "5px",
        }}
      >
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <FolderKanban size={20} />
          <span>All Projects</span>
        </NavLink>

        <div className="sidebar-heading">Categories</div>
        <NavLink
          to="/category/RMS"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Radio size={20} />
          <span>RMS</span>
        </NavLink>
        <NavLink
          to="/category/Smart meter"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Gauge size={20} />
          <span>Smart Meter</span>
        </NavLink>
        <NavLink
          to="/category/Smart Lock"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <Lock size={20} />
          <span>Smart Lock</span>
        </NavLink>

        <div className="sidebar-heading">Management</div>
        <NavLink
          to="/tasks"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <ListTodo size={20} />
          <span>Tasks</span>
        </NavLink>
        {user?.role === "Admin" && (
          <>
            <NavLink
              to="/categories"
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <FolderKanban size={20} />
              <span>Manage Categories</span>
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <UserCog size={20} />
              <span>Manage Users</span>
            </NavLink>
          </>
        )}
        <NavLink
          to="/analytics"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <LineChart size={20} />
          <span>Analytics</span>
        </NavLink>
      </nav>
      <div
        style={{
          marginTop: "auto",
          paddingTop: "1rem",
          borderTop: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            padding: "0.5rem 1.5rem",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
            color: "#94a3b8",
          }}
        >
          Logged in as{" "}
          <strong style={{ color: "#f8fafc" }}>{user?.role}</strong>
        </div>
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
