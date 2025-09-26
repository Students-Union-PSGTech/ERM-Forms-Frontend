import React from "react";
import "../components-css/login.css";
import bgImage from "../assets/bg2.jpg";
function Login() {
  return (
    <div className="login-container">
      {/* Background image */}
      <img src={bgImage} alt="background" className="bg-image" />

      {/* Login box */}
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="login-input"
        />
        <input
          type="text"
          placeholder="Enter OTP"
          className="login-input"
        />
        <button className="login-btn">Submit</button>
      </div>
    </div>
  );
}

export default Login;
