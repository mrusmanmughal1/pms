import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Optional role checking
  if (
    requiredRole &&
    user &&
    user.role !== requiredRole &&
    user.role !== "Admin"
  ) {
    return <Navigate to="/" replace />; // Redirect if not authorized
  }

  return children;
};

export default ProtectedRoute;
