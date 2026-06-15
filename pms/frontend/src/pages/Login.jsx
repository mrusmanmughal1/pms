import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const success = await login(email, password);
    if (success) {
      navigate("/");
    } else {
      setError("Invalid credentials");
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
          <img
            alt="Auth Logo"
            width="150"
            class=" "
            src="https://dev.smart-life.sa/assets/smartlife-text-black-THaafVXq.png"
          />
          <p>Login to your PMS Pro account</p>
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
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
            }}
          >
            <Link
              to="/register"
              style={{ color: "var(--primary-color)", textDecoration: "none" }}
            >
              Create Account
            </Link>
            <Link
              to="/forgotpassword"
              style={{ color: "var(--primary-color)", textDecoration: "none" }}
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
