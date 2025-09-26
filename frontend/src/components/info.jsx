import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EventCards = () => {
  const navigate = useNavigate();

  // Load cards from localStorage
  const [cards, setCards] = useState(() => {
    const stored = localStorage.getItem("eventCards");
    return stored ? JSON.parse(stored) : [];
  });

  const [eventName, setEventName] = useState("");
  const [clubName, setClubName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("eventCards", JSON.stringify(cards));
  }, [cards]);

  const addCard = () => {
    if (!eventName || !clubName || !eventDate) return;

    const newCard = {
      id: Date.now(),
      eventName,
      clubName,
      eventDate,
    };

    setCards([...cards, newCard]);
    setEventName("");
    setClubName("");
    setEventDate("");
  };

  // Filter and sort cards by date
  let filteredCards = cards
    .filter(
      (card) =>
        card.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.clubName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      {/* Header with Add Card Inputs and Search */}
      <h2>ADD EVENT</h2><br></br>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        {/* Left side: Inputs */}
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event Name"
            style={inputStyle}
          />
          <input
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            placeholder="Club Name"
            style={inputStyle}
          />
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            style={inputStyle}
          />
          <button onClick={addCard} style={buttonStyle}>
            Add Card
          </button>
        </div>

        {/* Right side: Search */}
        <input
          type="search"
          placeholder="Search Clubs/Events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...inputStyle, width: "250px", marginLeft: "auto" }}
        />
      </div>

      {/* Display Cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {filteredCards.map((card) => (
          <div
            key={card.id}
            style={cardStyle}
            onClick={() => navigate(`/info-deep/${card.id}`, { state: card })}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h4 style={{ margin: "0 0 5px 0" }}>{card.eventName}</h4>
            <p style={{ margin: "0 0 5px 0" }}>Club: {card.clubName}</p>
            <p style={{ margin: 0 }}>Date: {card.eventDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Styles
const inputStyle = {
  padding: "12px 15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  outline: "none",
};

const buttonStyle = {
  padding: "12px 25px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#007bff",
  color: "#fff",
  cursor: "pointer",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "15px",
  width: "200px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "transform 0.2s",
};

export default EventCards;
