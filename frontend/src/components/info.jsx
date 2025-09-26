// EventCards.jsx
import React, { useState } from "react";

const EventCards = () => {
  const [cards, setCards] = useState([]);
  const [eventName, setEventName] = useState("");
  const [clubName, setClubName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const addCard = () => {
    if (!eventName || !clubName || !eventDate) return;
    setCards([...cards, { eventName, clubName, eventDate }]);
    setEventName("");
    setClubName("");
    setEventDate("");
  };

  // Unique club and date options for filters
  const clubOptions = [...new Set(cards.map(card => card.clubName))];
  const dateOptions = [...new Set(cards.map(card => card.eventDate))].sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Filter cards by search, club, and date
  let filteredCards = cards.filter(
    (card) =>
      (card.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.clubName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedClub === "" || card.clubName === selectedClub) &&
      (selectedDate === "" || card.eventDate === selectedDate)
  );

  // Sort filtered cards by date ascending
  filteredCards.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      {/* Header with search, club filter, and date filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h2>Add Event Card</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="search"
            placeholder="Search Clubs/Events"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "8px", width: "200px" }}
          />
          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            style={{ padding: "8px" }}
          >
            <option value="">All Clubs</option>
            {clubOptions.map((club, index) => (
              <option key={index} value={club}>
                {club}
              </option>
            ))}
          </select>
          
        </div>
      </div>

      {/* Input fields to add a card */}
      <div
        style={{
          margin: "20px 0",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Club Name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          style={{ padding: "8px" }}
        />
        <button onClick={addCard} style={{ padding: "8px 16px" }}>
          Add Card
        </button>
      </div>

      {/* Display cards side by side */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        {filteredCards.map((card, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              width: "200px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h4 style={{ margin: "0 0 5px 0" }}>{card.eventName}</h4>
            <p style={{ margin: "0 0 5px 0" }}>Club: {card.clubName}</p>
            <p style={{ margin: 0 }}>Date: {card.eventDate}</p>
          </div>
        ))}
      </div>

      {/* Download PDF button at bottom-right */}
      <button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Download as PDF
      </button>
    </div>
  );
};

export default EventCards;
