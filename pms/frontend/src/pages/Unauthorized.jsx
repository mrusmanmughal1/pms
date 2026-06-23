import { useNavigate } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "1rem",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <ShieldOff size={64} color="#ef4444" strokeWidth={1.5} />
      <h2 style={{ fontSize: "1.75rem", fontWeight: "700", margin: 0 }}>
        Access Denied
      </h2>
      <p style={{ color: "var(--text-secondary)", maxWidth: "400px" }}>
        Your role (<strong>{user?.role || "Unknown"}</strong>) does not have
        permission to view this page. Please contact an administrator if you
        believe this is a mistake.
      </p>
      <button
        className="btn btn-primary"
        onClick={() => navigate("/")}
        style={{ marginTop: "0.5rem" }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
