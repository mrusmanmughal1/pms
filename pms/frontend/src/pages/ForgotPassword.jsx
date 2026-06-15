import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgotpassword",
        { email },
      );
      setMessage(res.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send reset link");
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
              background: "var(--text-secondary)",
              padding: "1rem",
              borderRadius: "50%",
              marginBottom: "1rem",
            }}
          >
            <Mail size={32} color="white" />
          </div>
          <h2>Reset Password</h2>
          <p>Enter your email to receive a reset link</p>
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
        {message && (
          <div
            style={{
              color: "#10b981",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {message}
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
            }}
          >
            <Link
              to="/login"
              style={{ color: "var(--primary-color)", textDecoration: "none" }}
            >
              Back to Login
            </Link>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            Send Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
