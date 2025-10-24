/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listEvents, requestEditAccess } from "../api/api"; // <-- import your API function
import styled from "styled-components";

// =====================================================================
// Styled Components (using the orange theme)
// =====================================================================

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  overflow: hidden;
  position: relative; /* key for absolute positioning */
  padding: 50px;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: var(--gradient-fire);
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2.5rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }

  p {
    margin: 0.5rem 0 0 0;
    color: #6b7280;
    font-size: 1.1rem;
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 0.75rem;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);

  input {
    flex: 1;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    outline: none;
    font-size: 1rem;
    &:focus {
      border-color: var(--flame-orange);
      box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
    }
  }

  span {
    font-size: 0.9rem;
    color: #6b7280;
    white-space: nowrap;
  }
`;

const RefreshButton = styled.button`
  flex-shrink: 0;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    transform: rotate(90deg);
    color: #111827;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const EventCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  margin-bottom: 2.5rem;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: var(--gradient-fire);
  }
`;

const EventHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);

  h2 {
    margin: 0;
    font-size: 1.75rem;
    color: var(--text-primary);
  }
  p {
    margin: 0.25rem 0 0 0;
    color: var(--text-secondary);
    font-style: italic;
  }
`;

const Section = styled.section`
  padding: 1.5rem 2rem;
  &:not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  color: var(--text-primary);
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--flame-orange);
  display: inline-block;
`;

const RoundDetails = styled.div`
  &:not(:last-child) {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px dashed #e5e7eb;
  }

  h4 {
    font-size: 1.1rem;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
  }

  p {
    color: var(--text-secondary);
    margin: 0 0 1rem 0;
    white-space: pre-wrap;
  }

  ul {
    list-style-type: disc;
    padding-left: 20px;
    margin: 0;
    color: var(--text-secondary);
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  .label {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .value {
    color: var(--text-secondary);
    font-size: 1rem;
  }
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }
  th {
    background-color: #f9fafb;
    font-weight: 600;
  }
  .total-row td {
    font-weight: bold;
    background-color: #fef3c7;
  }
`;

// =====================================================================
// New Modal Styled Components
// =====================================================================

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(17, 24, 39, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #e5e7eb;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  &:hover {
    background: #d1d5db;
  }
`;

// =====================================================================
// Preview Card Components
// =====================================================================

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const PreviewCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  padding: 1.5rem;
  border-top: 5px solid var(--flame-orange);
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-large);
  }

  h2 {
    font-size: 1.25rem;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
const BackButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #b45309;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s ease;
  z-index: 10;

  &:hover {
    background: #92400e;
  }
`;

const OverlayBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(17, 24, 39, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const OverlayCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OverlayActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const OverlayInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  font-size: 1rem;
  resize: vertical;
`;

const DropdownSelect = styled.select`
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  font-size: 1rem;
  color: #374151;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;

  &:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
  }
`;

export default function EditView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [overlay, setOverlay] = useState({
    open: false,
    event: null,
    status: "",
    msg: "",
    requestType: "event",
  });
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [refreshEvents, setRefreshEvents] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const payload = await listEvents();
        const list = Array.isArray(payload) ? payload : payload?.data || [];
        if (active) setEvents(list);
      } catch (e) {
        if (active)
          setErr(
            e?.response?.data?.message || e?.message || "Failed to load events"
          );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [navigate, refreshEvents]);

  const filteredEvents = useMemo(() => {
    if (!query.trim()) return events;
    const q = query.toLowerCase();
    return events.filter(
      (ev) =>
        (ev.name || "").toLowerCase().includes(q) ||
        (ev.about || "").toLowerCase().includes(q)
    );
  }, [events, query]);

  if (loading)
    return (
      <PageWrapper>
        <Container>Loading events...</Container>
      </PageWrapper>
    );
  if (err)
    return (
      <PageWrapper>
        <Container>Error: {err}</Container>
      </PageWrapper>
    );

  const handlePreviewClick = (event) => {
    // Check annexure existence and length
    const annexureLength = Array.isArray(event.annexure)
      ? event.annexure.length
      : 0;
    if (
      event.edit_req_status === "idle" ||
      event.edit_req_status === "rejected"
    ) {
      // If no annexure, only show event request and add annexure button
      setOverlay({
        open: true,
        event,
        status: "idle",
        msg: "",
        requestType: "event",
        annexureLength,
      });
    } else if (event.edit_req_status === "approve-annexure") {
      navigate(`/annexure/${event._id}`);
    } else if (event.edit_req_status === "approved") {
      navigate(`/edit/${event._id}`);
    } else if (
      event.edit_req_status === "requested" ||
      event.edit_req_status === "request-annexure"
    ) {
      setOverlay({
        open: true,
        event,
        status: "Requested",
        msg: "",
        requestType: "event",
        annexureLength,
      });
    }
  };

  // Call this to close overlay and refresh events
  const closeOverlayAndRefresh = () => {
    setOverlay({
      open: false,
      event: null,
      status: "",
      msg: "",
      requestType: "event",
    });
    setRefreshEvents((r) => r + 1);
  };

  const handleRequestEdit = async () => {
    setRequestLoading(true);
    setRequestError("");
    try {
      console.log("Requesting edit access with:", { overlay });
      await requestEditAccess({
        eventId: overlay.event._id,
        msg: overlay.msg,
        requestType: overlay.requestType,
      });
      closeOverlayAndRefresh();
    } catch (err) {
      setRequestError(
        err?.response?.data?.message || err?.message || "Failed to send request"
      );
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div>
      <Container>
        <BackButton onClick={() => navigate("/home")}>← Back</BackButton>
        <Header>
          <h1>Edit Events</h1>
          <p>Click on the Events to edit that particular event</p>
        </Header>
        <SearchBar>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events by name or description..."
          />
          <span>{filteredEvents.length} event(s) found</span>
          <RefreshButton
            onClick={() => setRefreshEvents((r) => r + 1)}
            title="Refresh Events"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.18-3.183m-3.181-4.992-3.182-3.182a8.25 8.25 0 0 0-11.664 0l-3.18 3.183"
              />
            </svg>
          </RefreshButton>
        </SearchBar>
        {filteredEvents.length > 0 ? (
          <EventsGrid>
            {filteredEvents.map((event) => (
              <PreviewCard
                key={event._id}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviewClick(event);
                }}
                style={{ position: "relative" }}
              >
                {/* Status badge */}
                {(event.edit_req_status === "requested" ||
                  event.edit_req_status === "rejected" ||
                  event.edit_req_status === "request-annexure") && (
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 16,
                      background: "#fbbf24",
                      color: "#92400e",
                      borderRadius: 8,
                      padding: "0.25rem 0.75rem",
                      fontWeight: 600,
                      fontSize: "0.50rem",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    }}
                  >
                    {event.edit_req_status === "requested" ||
                    event.edit_req_status === "request-annexure"
                      ? "Requested"
                      : "Declined"}
                  </span>
                )}
                {(event.edit_req_status === "approved" ||
                  event.edit_req_status === "approve-annexure") && (
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 16,
                      background: "#34d399",
                      color: "#065f46",
                      borderRadius: 8,
                      padding: "0.25rem 0.75rem",
                      fontWeight: 600,
                      fontSize: "0.50rem",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    }}
                  >
                    Approved
                  </span>
                )}
                <h2>{event.name || "Untitled Event"}</h2>
                <p>{event.about || "No description provided."}</p>
              </PreviewCard>
            ))}
          </EventsGrid>
        ) : (
          <p>No events found.</p>
        )}
      </Container>

      {/* Overlay for edit request */}
      {overlay.open && (
        <OverlayBg>
          <OverlayCard>
            {overlay.status === "idle" && (
              <>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "#b45309",
                  }}
                >
                  Request edit access to the ERM Team
                </div>
                {/* If annexure is empty, only show event request and add annexure button */}
                {overlay.annexureLength === 0 ? (
                  <>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: 500,
                          color: "#4b5563",
                          fontSize: "0.95rem",
                        }}
                      >
                        Request Type
                      </label>
                      <DropdownSelect value="event" disabled>
                        <option value="event">Request to edit event</option>
                      </DropdownSelect>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: 500,
                          color: "#4b5563",
                          fontSize: "0.95rem",
                        }}
                      >
                        Message
                      </label>
                      <OverlayInput
                        placeholder="Enter your request message..."
                        value={overlay.msg}
                        onChange={(e) =>
                          setOverlay((o) => ({ ...o, msg: e.target.value }))
                        }
                        disabled={requestLoading}
                      />
                    </div>
                    {requestError && (
                      <div style={{ color: "#dc2626", fontSize: "0.95rem" }}>
                        {requestError}
                      </div>
                    )}
                    <OverlayActions>
                      <button
                        type="button"
                        style={{
                          background: "#e5e7eb",
                          color: "#374151",
                          border: "none",
                          borderRadius: 8,
                          padding: "0.5rem 1.25rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setOverlay({
                            open: false,
                            event: null,
                            status: "",
                            msg: "",
                            requestType: "event",
                          })
                        }
                        disabled={requestLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "#d97706",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          padding: "0.5rem 1.25rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onClick={handleRequestEdit}
                        disabled={requestLoading || !overlay.msg.trim()}
                      >
                        {requestLoading ? "Requesting..." : "Request"}
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          padding: "0.5rem 1.25rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          navigate(`/annexure/${overlay.event._id}`)
                        }
                        disabled={requestLoading}
                      >
                        Add Annexure
                      </button>
                    </OverlayActions>
                  </>
                ) : (
                  <>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: 500,
                          color: "#4b5563",
                          fontSize: "0.95rem",
                        }}
                      >
                        Request Type
                      </label>
                      <DropdownSelect
                        value={overlay.requestType}
                        onChange={(e) =>
                          setOverlay((o) => ({
                            ...o,
                            requestType: e.target.value,
                          }))
                        }
                        disabled={requestLoading}
                      >
                        <option value="event">Request to edit event</option>
                        <option value="annexure">
                          Request to edit Annexure
                        </option>
                      </DropdownSelect>
                    </div>
                    <div>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontWeight: 500,
                          color: "#4b5563",
                          fontSize: "0.95rem",
                        }}
                      >
                        Message
                      </label>
                      <OverlayInput
                        placeholder="Enter your request message..."
                        value={overlay.msg}
                        onChange={(e) =>
                          setOverlay((o) => ({ ...o, msg: e.target.value }))
                        }
                        disabled={requestLoading}
                      />
                    </div>
                    {requestError && (
                      <div style={{ color: "#dc2626", fontSize: "0.95rem" }}>
                        {requestError}
                      </div>
                    )}
                    <OverlayActions>
                      <button
                        type="button"
                        style={{
                          background: "#e5e7eb",
                          color: "#374151",
                          border: "none",
                          borderRadius: 8,
                          padding: "0.5rem 1.25rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setOverlay({
                            open: false,
                            event: null,
                            status: "",
                            msg: "",
                            requestType: "event",
                          })
                        }
                        disabled={requestLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "#d97706",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          padding: "0.5rem 1.25rem",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        onClick={handleRequestEdit}
                        disabled={requestLoading || !overlay.msg.trim()}
                      >
                        {requestLoading ? "Requesting..." : "Request"}
                      </button>
                    </OverlayActions>
                  </>
                )}
              </>
            )}

            {overlay.status === "Requested" && (
              <>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "#b45309",
                  }}
                >
                  Already requested to edit.
                  <br />
                  Waiting for approval from ERM team to edit the event details.
                </div>
                {overlay.annexureLength === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        background: "#e5e7eb",
                        color: "#374151",
                        border: "none",
                        borderRadius: 8,
                        padding: "0.5rem 1.25rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setOverlay({
                          open: false,
                          event: null,
                          status: "",
                          msg: "",
                          requestType: "event",
                        })
                      }
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      style={{
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        padding: "0.5rem 1.25rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/annexure/${overlay.event._id}`)}
                      disabled={requestLoading}
                    >
                      Add Annexure
                    </button>
                  </div>
                ) : (
                  <OverlayActions>
                    <button
                      type="button"
                      style={{
                        background: "#e5e7eb",
                        color: "#374151",
                        border: "none",
                        borderRadius: 8,
                        padding: "0.5rem 1.25rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginLeft: "auto",
                      }}
                      onClick={() =>
                        setOverlay({
                          open: false,
                          event: null,
                          status: "",
                          msg: "",
                          requestType: "event",
                        })
                      }
                    >
                      Close
                    </button>
                  </OverlayActions>
                )}
              </>
            )}
          </OverlayCard>
        </OverlayBg>
      )}
    </div>
  );
}
