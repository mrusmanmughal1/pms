import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ProjectList from "./components/ProjectList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Categories from "./pages/Categories";
import Sidebar from "./components/Sidebar";
import AllProjects from "./pages/AllProjects";
import Users from "./pages/Users";
import ProjectDetails from "./pages/ProjectDetails";
import Unauthorized from "./pages/Unauthorized";

function Header() {
  const location = useLocation();
  const path = location.pathname;
  let title = "Dashboard";
  if (path.startsWith("/category/")) {
    const cat = path.split("/")[2];
    const formatted = cat.charAt(0).toUpperCase() + cat.slice(1);
    title = `${formatted} Projects`;
  } else if (path === "/") {
    title = "Dashboard";
  } else {
    title = "Projects";
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
      }}
    >
      <div>
        <h1 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
          {title}
        </h1>
        <p style={{ fontSize: "0.775rem", color: "var(--text-secondary)" }}>
          {title} overview and details.
        </p>
      </div>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <Header />
        <Routes>
          {/* All authenticated users can see dashboard & projects */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/category/:categoryName" element={<ProjectList />} />

          {/* PM and above: can also access register (add user is admin-only but PM may need it) */}
          <Route
            path="/register"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "PM",
                  "Coordinator",
                  "Integration & Support",
                  "User",
                ]}
              >
                <Register />
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized fallback */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
