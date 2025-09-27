import React from "react";
import { useAuth } from "../context/AuthContext";

export default function ReviewSubmit({ form }) {
  const user = useAuth();
  const canEdit = user?.isAuthenticated && user.role === "club_member";

  function submitForm() {
    if (!canEdit) {
      alert("Only club members can submit.");
      return;
    }
    console.log("Submitting form:", form);
    alert("Form submitted successfully!");
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Review & Submit
      </h2>

      {/* Description */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontWeight: "bold" }}>Event Description</h3>
        <p><strong>Title:</strong> {form.description.title || "N/A"}</p>
        <p><strong>Reason:</strong> {form.description.reason || "N/A"}</p>
        <p><strong>Preferred Halls:</strong> {form.description.halls || "N/A"}</p>
        <p><strong>Slot Details:</strong> {form.description.slot || "N/A"}</p>
      </section>

      {/* Items */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontWeight: "bold" }}>Items</h3>
        {form.items.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Item Name</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Cost</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Count</th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{item.name}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>₹{item.cost}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{item.count}</td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>₹{item.cost * item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items added.</p>
        )}
      </section>

      {/* Rounds */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontWeight: "bold" }}>Rounds</h3>
        {form.rounds.length > 0 ? (
          form.rounds.map((round, idx) => (
            <div key={idx} style={{ marginBottom: "0.5rem", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "5px" }}>
              <p><strong>Round Name:</strong> {round.name}</p>
              <p><strong>Description:</strong> {round.description}</p>
              <p><strong>No of Participants:</strong> {round.participants}</p>
            </div>
          ))
        ) : (
          <p>No rounds added.</p>
        )}
      </section>

      <button
        onClick={submitForm}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </div>
  );
}
