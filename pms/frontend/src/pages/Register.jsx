import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const success = await register(name, email, password);
    if (success) {
      navigate("/");
    } else {
      setError("Registration failed");
    }
  };

  return (
    <div
      className="app-container"
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#231d48ff",
      }}
    >
      <div className="glass-panel" style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "1rem",
              borderRadius: "50%",
              marginBottom: "1rem",
            }}
          >
            <img
              alt="Auth Logo"
              width="150"
              class=" "
              src="https://dev.smart-life.sa/assets/smartlife-text-black-THaafVXq.png"
            />
          </div>
          <h2>Create Account</h2>
        </div>

        {error && (
          <div
            style={{
              color: "#ef4444",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              style={{
                color: "var(--primary-color)",
                textDecoration: "none",
                marginLeft: "0.5rem",
              }}
            >
              Login
            </Link>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
