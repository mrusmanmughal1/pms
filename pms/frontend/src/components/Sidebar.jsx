import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  Radio,
  LineChart,
  UserCog,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCategories } from "../hooks/project";
import { useQueryClient } from "@tanstack/react-query";
//working
export default function Sidebar() {
  const { data: categories = [], isLoading } = useCategories();
  const {
    user,

    logout,
  } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.clear();
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
        {/* Dashboard — all roles */}
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        {/* All Projects — all roles */}
        <NavLink
          to="/projects"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          <FolderKanban size={20} />
          <span>All Projects</span>
        </NavLink>

        {/* Category links — hidden for Coordinator */}

        <>
          <div className="sidebar-heading">Categories</div>
          {isLoading ? (
            <div
              style={{
                padding: "0.5rem 1.5rem",
                color: "#94a3b8",
                fontSize: "0.875rem",
              }}
            >
              Loading...
            </div>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <NavLink
                key={category._id}
                to={`/category/${category.name}`}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Radio size={20} />
                <span>{category.name}</span>
              </NavLink>
            ))
          ) : (
            <div
              style={{
                padding: "0.5rem 1.5rem",
                color: "#94a3b8",
                fontSize: "0.875rem",
              }}
            >
              No categories
            </div>
          )}
        </>

        {/* Management section — Admin only */}
        {user?.role === "Admin" && (
          <>
            <div className="sidebar-heading">Management</div>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <FolderKanban size={20} />
              <span>Manage Categories</span>
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <UserCog size={20} />
              <span>Manage Users</span>
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <UserCog size={20} />
              <span>Add User</span>
            </NavLink>
          </>
        )}

        {/* Analytics — Admin & PM */}
        {(user?.role === "Admin" || user?.role === "PM") && (
          <NavLink
            to="/analytics"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <LineChart size={20} />
            <span>Analytics</span>
          </NavLink>
        )}
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
