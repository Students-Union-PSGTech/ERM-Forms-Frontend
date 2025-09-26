import React from "react";
import "../components-css/login.css";
import bgImage from "../assets/bg3.jpg";
function Login() {
  return (
    <div className="login-container">
      {/* Background image */}
      <img src={bgImage} alt="background" className="bg-image" />

      {/* Login box */}
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <input
          type="text"
          placeholder="Enter your username"
          className="login-input"
        />
        <input
          type="text"
          placeholder="Enter password"
          className="login-input"
        />
        <button className="login-btn">Submit</button>
      </div>
    </div>
  );
}

export default Login;
