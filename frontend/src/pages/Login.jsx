import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8083/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      // Always try to read the response body (even on 401)
      const data = await response.json();

      if (!response.ok || data.message !== "Login Successful") {
        setError(data.message || "Invalid username or password.");
        setLoading(false);
        return;
      }

      // Save user details to localStorage
      localStorage.setItem("employeeId", data.employeeId);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      // Navigate based on role (case-insensitive comparison)
      if (data.role?.toUpperCase() === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Government Identity Band */}
      <div className="login-gov-band">
        <span className="band-icon">🏛️</span>
        <span className="band-text">Government of India — Secure Portal</span>
      </div>

      {/* Main Login Content */}
      <div className="login-content">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-emblem">🏛️</div>
            <h1 className="login-title">APAR Portal</h1>
            <p className="login-subtitle">Annual Performance Appraisal Report System</p>
          </div>

          {/* Error */}
          {error && <div className="login-error" id="login-error">{error}</div>}

          {/* Form */}
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                className="form-input"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={`login-btn ${loading ? "loading" : ""}`}
              disabled={loading}
              id="login-btn"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p className="login-footer-text">
              This system is for authorized Government personnel only.<br />
              Powered by National Informatics Centre (NIC)
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Band */}
      <div className="login-bottom-band">
        <span>© {new Date().getFullYear()} Department of Personnel &amp; Training, Government of India. All rights reserved.</span>
      </div>
    </div>
  );
}