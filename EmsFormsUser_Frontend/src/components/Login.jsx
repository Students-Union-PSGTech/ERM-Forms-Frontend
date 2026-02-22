import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components_css/Login.css";
import intramsLogo from '../assets/intrams_logo.jpg';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    
    if (!formData.username || !formData.password) {
      setLoginError("Please enter both username and password");
      return;
    }

    try {
      const response = await login(formData.username, formData.password);
      console.log(response);
      if (response && response.success) {
        // Store association_name in localStorage if available
        if (response.association_name) {
          localStorage.setItem('association_name', response.association_name);
        }
        navigate("/home");
      } else {
        setLoginError(error || "Invalid credentials");
      }
    } catch (err) {
      setLoginError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-orbs orb-1"></div>
        <div className="gradient-orbs orb-2"></div>
        <div className="gradient-orbs orb-3"></div>
        <div className="gradient-orbs orb-4"></div>
      </div>
      
      <div className="login-content">

        <div className="login-left">
          <div className="brand-section">
            <div className="logo-glow">
              <img
                src={intramsLogo}
                alt="Kriya 2026"
                className="event-logo"
              />
            </div>
            <h1 className="event-title">IGNITE THE INFINITE</h1>
            <p className="event-subtitle">Kriya 2026 - Club Portal</p>

            
            <div className="color-strip">
              <div className="color-block color-1"></div>
              <div className="color-block color-2"></div>
              <div className="color-block color-3"></div>
              <div className="color-block color-4"></div>
              <div className="color-block color-5"></div>
            </div>
          </div>
        </div>

        <div className="login-divider">
          <div className="divider-line"></div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="card-header">
              <div className="header-glow">
                <h2 className="login-heading">Club Login</h2>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label htmlFor="username">
                  <span className="label-icon"></span>
                  Username
                </label>
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
                <label htmlFor="password">
                  <span className="label-icon"></span>
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {loginError && <div className="error-message">{loginError}</div>}

              {/*<div className="form-options">
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>*/}

              <button type="submit" className="login-btn" disabled={loading}>
                <span className="btn-sparkle"></span>
                {loading ? "Logging in..." : "Sign In"}
                <span className="btn-arrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
