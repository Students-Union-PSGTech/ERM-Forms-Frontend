import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components_css/Login.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!formData.username || !formData.password) {
      setLoginError("Please enter both username and password");
      return;
    }

    const success = await login(formData.username, formData.password);
    if (success) navigate("/home");
    else setLoginError(error || "Invalid credentials");
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Left Section */}
        <div className="login-left">
          <div className="brand-section">
            <div className="logo-glow">
              <img
                src="/intro_logo.png"
                alt="INTRAMS 2K25"
                className="event-logo"
              />
            </div>
            <h1 className="event-title">IGNITE THE INFINITE</h1>
            <p className="event-subtitle">INTRAMS 2025 - Club Portal</p>

            <div className="color-strip">
              <div className="color-block color-1"></div>
              <div className="color-block color-2"></div>
              <div className="color-block color-3"></div>
              <div className="color-block color-4"></div>
              <div className="color-block color-5"></div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="login-divider">
          <div className="divider-line"></div>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <div className="login-card">
            <div className="card-header">
              <div className="header-glow">
                <h2 className="login-heading">Club Login</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {loginError && <div className="error-message">{loginError}</div>}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Logging in..." : "Sign In"} → 
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
