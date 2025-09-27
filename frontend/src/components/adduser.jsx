import React, { useState } from "react";
import "../components-css/Add.css"; // import css here

function Add() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !password) {
      setMessage("⚠️ Please fill in both fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, password }),
      });

      if (response.ok) {
        setMessage("✅ User registered successfully!");
        setUser("");
        setPassword("");
      } else {
        const errorData = await response.json();
        setMessage(`❌ Error: ${errorData.message || "Something went wrong"}`);
      }
    } catch (error) {
      setMessage("❌ Network error. Try again later.");
    }
  };

  return (
    <div className="form-container">
      <h2>Register User</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Add;
