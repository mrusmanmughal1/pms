import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister, useRole } from "../hooks/auth";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const { data: roles } = useRole();
  const { mutateAsync: register } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(
      { name, email, password, role },
      {
        onSuccess: () => {
          navigate("/users");
        },
      },
    );
  };

  return (
    <div
      className="app-container"
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#1c2745ff",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "400px",
          maxHeight: "550px",
          overflowY: "auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2>Create Account</h2>
        </div>

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
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                style={{
                  paddingRight: "40px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a Role
              </option>
              {roles?.length > 0 &&
                roles.map((r) => (
                  <option key={r + 1} value={r}>
                    {r}
                  </option>
                ))}
            </select>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
            }}
          ></div>
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
