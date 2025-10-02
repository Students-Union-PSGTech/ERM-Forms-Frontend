import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listEvents, getEventPDF } from '../api/api';
import styled from 'styled-components';

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
  position: relative;  /* important: so the back button can anchor here */
  padding: 50px;
  &::before {
    content: '';
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
    content: '';
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
  th, td {
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

// =====================================================================
// Helper Component for displaying a person's details
// =====================================================================

const PersonDetail = ({ title, person }) => (
  <InfoItem>
    <div className="label">{title}</div>
    {person && person.name ? (
      <div className="value">
        {person.name}<br />
        <small>
          {person.roll_number && `Roll: ${person.roll_number} | `}
          {person.mobile && `Mobile: ${person.mobile}`}
          {person.designation && `Designation: ${person.designation}`}
        </small>
      </div>
    ) : (
      <div className="value">Not Specified</div>
    )}
  </InfoItem>
);

// =====================================================================
// New Modal Component for Full Event Details
// =====================================================================

const EventDetailModal = ({ event, onClose }) => {
  if (!event) return null;

  const handleViewPDF = async () => {
    if (!event?.event_id) return;
    try {
      const res = await getEventPDF(event.event_id);
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (err) {
      alert('Failed to load PDF');
    }
  };

  const handleDownloadPDF = async () => {
    if (!event?.event_id) return;
    try {
      const res = await getEventPDF(event.event_id);
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `${event.name || 'event'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <EventHeader>
          <h2>{event.name || 'Untitled Event'}</h2>
          <p>{event.tagline || 'No tagline provided'}</p>
        </EventHeader>

        <div style={{   display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '1rem 2rem 0 2rem' }}>
          <button
            type="button"
            style={{
              background: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '0.5rem 1.25rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={handleViewPDF}
          >
            View PDF
          </button>
          <button
            type="button"
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '0.5rem 1.25rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>

        <Section>
          <SectionTitle>About</SectionTitle>
          <InfoItem>
            <p className="value">{event.about || 'No description provided.'}</p>
          </InfoItem>
        </Section>
        
        <Section>
          <SectionTitle>Contact Persons</SectionTitle>
          <InfoGrid>
            <PersonDetail title="Secretary 1" person={event.details?.secretary1} />
            <PersonDetail title="Secretary 2" person={event.details?.secretary2} />
            <PersonDetail title="Convenor 1" person={event.details?.convenor1} />
            <PersonDetail title="Convenor 2" person={event.details?.convenor2} />
            <PersonDetail title="Volunteer 1" person={event.details?.volunteer1} />
            <PersonDetail title="Volunteer 2" person={event.details?.volunteer2} />
            <PersonDetail title="Faculty Advisor" person={event.details?.faculty_advisor} />
            <PersonDetail title="Judge" person={event.details?.judge} />
          </InfoGrid>
        </Section>

        {event.rounds && event.rounds.length > 0 && (
          <Section>
            <SectionTitle>Rounds ({event.round_count || event.rounds.length})</SectionTitle>
            {event.rounds.map((round, index) => (
              <RoundDetails key={round._id || index}>
                <h4>{round.name || `Round ${index + 1}`}</h4>
                {round.description && <p>{round.description}</p>}
                {round.rules && round.rules.length > 0 && (
                  <>
                    <strong>Rules:</strong>
                    <ul>
                      {round.rules.map((rule, rIndex) => (
                        <li key={rIndex}>{rule}</li>
                      ))}
                    </ul>
                  </>
                )}
              </RoundDetails>
            ))}
          </Section>
        )}

        <Section>
          <SectionTitle>Event Logistics</SectionTitle>
          <InfoGrid>
            <InfoItem><div className="label">Day(s)</div><div className="value">{event.form?.day}{event.form?.two_days === 'true' && ' (2 days)'}</div></InfoItem>
            <InfoItem><div className="label">Slot</div><div className="value">{event.form?.slot}</div></InfoItem>
            <InfoItem><div className="label">Duration</div><div className="value">{event.form?.duration}</div></InfoItem>
            <InfoItem><div className="label">Rounds</div><div className="value">{event.form?.rounds}</div></InfoItem>
            <InfoItem><div className="label">Participant Type</div><div className="value">{event.form?.participant_type}</div></InfoItem>
            <InfoItem>
              <div className="label">Participants</div>
              <div className="value">
                {event.form?.participant_type === 'team' 
                  ? `Min: ${event.form?.team_min || 'N/A'}, Max: ${event.form?.team_max || 'N/A'}` 
                  : event.form?.participants}
              </div>
            </InfoItem>
            <InfoItem><div className="label">Halls Required</div><div className="value">{event.form?.halls_required}</div></InfoItem>
            <InfoItem><div className="label">Preferred Halls</div><div className="value">{event.form?.preferred_halls || 'N/A'}</div></InfoItem>
            <InfoItem><div className="label">Reason for Hall</div><div className="value">{event.form?.hall_reason || 'N/A'}</div></InfoItem>
            <InfoItem><div className="label">Extension Boxes</div><div className="value">{event.form?.extension_boxes || 'N/A'}</div></InfoItem>
            <InfoItem><div className="label">Reason for Extension</div><div className="value">{event.form?.extension_reason || 'N/A'}</div></InfoItem>
          </InfoGrid>
        </Section>

        {event.items && event.items.length > 0 && (
          <Section>
            <SectionTitle>Budget & Items</SectionTitle>
            <ItemsTable>
              <thead>
                <tr><th>Item Name</th><th>Quantity</th><th>Price per Unit</th><th>Total</th></tr>
              </thead>
              <tbody>
                {event.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item_name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price_per_unit?.toLocaleString()}</td>
                    <td>₹{item.total_price?.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan="3">Grand Total</td>
                  <td>₹{event.items.reduce((sum, item) => sum + item.total_price, 0).toLocaleString()}</td>
                </tr>
              </tbody>
            </ItemsTable>
          </Section>
        )}
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
  const [err, setErr] = useState('');
  const [query, setQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const payload = await listEvents();
        const list = Array.isArray(payload) ? payload : payload?.data || [];
        if (active) setEvents(list);
      } catch (e) {
        if (e?.response?.status === 401) {
          navigate('/login');
          return;
        }
        if (active) setErr(e?.response?.data?.message || e?.message || 'Failed to load events');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [navigate]);

  const filteredEvents = useMemo(() => {
    if (!query.trim()) return events;
    const q = query.toLowerCase();
    return events.filter((ev) => 
      (ev.name || '').toLowerCase().includes(q) ||
      (ev.about || '').toLowerCase().includes(q)
    );
  }, [events, query]);

  if (loading) return <PageWrapper><Container>Loading events...</Container></PageWrapper>;
  if (err) return <PageWrapper><Container>Error: {err}</Container></PageWrapper>;

  return (
    <div>
      <Container>
        {/* Back button at the top */}
        <BackButton onClick={() => navigate(-1)}>← Back</BackButton>

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
            {filteredEvents.map(event => (
              <PreviewCard key={event._id} onClick={() => setSelectedEvent(event)}>
                <h2>{event.name || 'Untitled Event'}</h2>
                <p>{event.about || 'No description provided.'}</p>
              </PreviewCard>
            ))}
          </EventsGrid>
        ) : (
          <p>No events found.</p>
        )}
      </Container>

      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
