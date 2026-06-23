import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

/**
 * ProtectedRoute — wraps routes that require authentication.
 * Optionally accepts `allowedRoles` (array of role strings).
 * Admin always has access regardless of allowedRoles.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Admin bypasses all role restrictions
  if (allowedRoles && user?.role !== "Admin") {
    if (!allowedRoles.includes(user?.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
