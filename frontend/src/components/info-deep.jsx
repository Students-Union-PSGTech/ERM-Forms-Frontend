import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const InfoDeep = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const card = location.state; // the card passed from EventCards

  const [description, setDescription] = useState("");

  if (!card) {
    return <p>No event data found.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        ⬅ Back
      </button>
      <h2>{card.eventName}</h2>
      <p><strong>Club:</strong> {card.clubName}</p>
      <p><strong>Date:</strong> {card.eventDate}</p>

      <textarea
        placeholder="Enter event description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", height: "120px", padding: "10px", marginTop: "10px" }}
      />

      {description && (
        <p style={{ marginTop: "15px" }}>
          <strong>Description:</strong> {description}
        </p>
      )}
    </div>
  );
};

export default InfoDeep;
