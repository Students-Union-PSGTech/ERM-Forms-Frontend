import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const InfoDeep = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const card = location.state; // the card passed from EventCards

  const [description, setDescription] = useState("");

  if (!card) {
    return <p style={{ textAlign: "center", marginTop: "50px", color: "#555" }}>No event data found.</p>;
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        backgroundColor: "#fefefe",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        ⬅ Back
      </button>

      <h2 style={{ marginBottom: "10px", color: "#333" }}>{card.eventName}</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "20px" }}>
        <p style={{ margin: 0, color: "#555" }}><strong>Club:</strong> {card.clubName}</p>
        <p style={{ margin: 0, color: "#555" }}><strong>Date:</strong> {card.eventDate}</p>
      </div>

      <textarea
        placeholder="Enter event description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: "100%",
          minHeight: "120px",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          resize: "vertical",
          fontSize: "14px",
          fontFamily: "inherit",
        }}
      />

      {description && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#f4f4f4",
            borderLeft: "4px solid #4caf50",
          }}
        >
          <strong>Description:</strong> <span style={{ color: "#333" }}>{description}</span>
        </div>
      )}
    </div>
  );
};

export default InfoDeep;
