/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listEvents } from "../api/api";
import styled from "styled-components";
import axios from "axios";
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
  position: relative; /* important: so the back button can anchor here */
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

const AnnexureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;

const AnnexureItem = styled.li`
  margin-bottom: 0.75rem;

  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    color: var(--flame-orange);
    text-decoration: none;
    font-weight: 500;
    transition: background 0.2s ease, border-color 0.2s ease;

    &:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }

    &::before {
      content: "📄";
      font-size: 1.2rem;
    }
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

// =====================================================================
// Helper Component for displaying a person's details
// =====================================================================

const PersonDetail = ({ title, person }) => {
  const isStudent =
    title.toLowerCase().includes("secretary") ||
    title.toLowerCase().includes("convenor") ||
    title.toLowerCase().includes("volunteer");

  return (
    <InfoItem>
      <div className="label">{title}</div>
      {person && person.name ? (
        <div className="value">
          {person.name}
          <br />
          <small>
            {person.roll_number && `Roll: ${person.roll_number} | `}
            {isStudent && person.year && `Year: ${person.year} | `}
            {isStudent && person.department && `Dept: ${person.department} | `}
            {person.mobile && `Mobile: ${person.mobile}`}
            {person.designation && ` | Designation: ${person.designation}`}
          </small>
        </div>
      ) : (
        <div className="value">Not Specified</div>
      )}
    </InfoItem>
  );
};

// =====================================================================
// New Modal Component for Full Event Details
// =====================================================================

const EventDetailModal = ({ event, onClose }) => {
  if (!event) return null;

  const [rollNo, setRollNo] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [attendeesError, setAttendeesError] = useState("");

  const markattendance = async () => {
    try {
      const response = await axios.post(
        "https://ghcc.psgtech.ac.in/backend/cms/attendance/update/true",
        {
          event_name: event.name,
          rollno: rollNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log({
        event_name: event.name,
        rollno: rollNo,
      });
      console.log(response);
      if (response.status === 201) {
        alert("Attendance marked successfully!");
        setRollNo(""); // Clear the input field
      } else {
        alert("Failed to mark attendance. Please try again.");
      }
    } catch (error) {
      alert(
        "Error marking attendance: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Fetch attendees for this event when modal opens
  useEffect(() => {
    let active = true;
    const fetchAttendees = async () => {
      if (!event || !event.name) return;
      setAttendeesLoading(true);
      setAttendeesError("");
      try {
        const url = `https://ghcc.psgtech.ac.in/backend/cms/attendance/attendees/${encodeURIComponent(
          event.name
        )}`;
        const resp = await axios.get(url, { headers: { 'Content-Type': 'application/json' } });
        if (active) setAttendees(Array.isArray(resp.data) ? resp.data : []);
      } catch (err) {
        if (active) setAttendeesError(err.response?.data?.message || err.message || 'Failed to load attendees');
      } finally {
        if (active) setAttendeesLoading(false);
      }
    };

    fetchAttendees();

    return () => {
      active = false;
    };
  }, [event]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <EventHeader>
          <h2>{event.name || "Untitled Event"}</h2>
          <p>{event.tagline || "No tagline provided"}</p>
        </EventHeader>
        <Section>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: 12 }}>
            <input
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="Enter Roll Number"
              style={{ padding: "0.5rem", flex: 1 }}
            />
            <button
              onClick={markattendance}
              style={{
                padding: "0.5rem 1rem",
                background: "#b45309",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Mark Attendance
            </button>
          </div>

          <div>
            <SectionTitle>Registered Attendees</SectionTitle>
            {attendeesLoading ? (
              <p style={{ color: '#6b7280' }}>Loading attendees...</p>
            ) : attendeesError ? (
              <p style={{ color: 'red' }}>{attendeesError}</p>
            ) : attendees.length === 0 ? (
              <p style={{ color: '#6b7280' }}>No registered attendees found.</p>
            ) : (
              <div style={{ marginTop: 12 }}>
                <ItemsTable>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll No</th>
                      <th>Department</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((p) => (
                      <tr key={p._id}>
                        <td>{p.name}</td>
                        <td>{p.rollno}</td>
                        <td>{p.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </ItemsTable>
              </div>
            )}
          </div>
        </Section>
      </ModalContent>
    </ModalOverlay>
  );
};

// =====================================================================
// The Main ViewEvents Component
// =====================================================================

export default function ViewEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
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
  }, [navigate]);

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

  return (
    <div>
      <Container>
        {/* Back button at the top */}
        <BackButton onClick={() => navigate("/home")}>← Back</BackButton>

        <Header>
          <h1>My Submitted Events</h1>
          <p>A detailed overview of all your event submissions.</p>
        </Header>

        <SearchBar>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events by name or description..."
          />
          <span>{filteredEvents.length} event(s) found</span>
        </SearchBar>

        {filteredEvents.length > 0 ? (
          <EventsGrid>
            {filteredEvents.map((event) => (
              <PreviewCard
                key={event._id}
                onClick={() => setSelectedEvent(event)}
              >
                <h2>{event.name || "Untitled Event"}</h2>
                <p>{event.about || "No description provided."}</p>
              </PreviewCard>
            ))}
          </EventsGrid>
        ) : (
          <p>No events found.</p>
        )}
      </Container>

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
