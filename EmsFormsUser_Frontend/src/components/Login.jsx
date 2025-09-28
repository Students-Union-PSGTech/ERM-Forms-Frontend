import React, { useState } from "react";
import "../components_css/Login.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);  // (----------Remove This-----------)
    // Add login logic here
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
                <label htmlFor="email">
                  <span className="label-icon"></span>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">
                  <span className="label-icon"></span>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/*<div className="form-options">
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>*/}

              <button type="submit" className="login-btn">
                <span className="btn-sparkle"></span>
                Sign In
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