import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/api";

const PageWrapper = styled.div`
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.2rem;
  }
`;

const ReviewCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  margin-bottom: 2rem;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-fire);
  }
`;

const SectionHeader = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-light);
  
  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    margin: 0;
    color: var(--text-primary);
  }
`;

const SectionContent = styled.div`
  padding: 2rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  padding: 1rem;
  background: #f8fafc;
  border-radius: 10px;
  border-left: 4px solid var(--flame-orange);
  
  .label {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }
  
  .value {
    color: var(--text-secondary);
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
`;

const Th = styled.th`
  padding: 1rem;
  background: var(--gradient-ember);
  color: white;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
  background: white;
  
  &:last-child {
    font-weight: 600;
    color: var(--flame-deep-red);
  }
`;

const RoundCard = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid var(--flame-orange);
  transition: all 0.3s ease;
  
  &:hover {
    background: #f1f5f9;
    transform: translateX(4px);
  }
  
  .round-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .round-info {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .description {
    color: var(--text-secondary);
    line-height: 1.5;
  }
  
  .participants {
    background: white;
    padding: 0.75rem;
    border-radius: 8px;
    text-align: center;
    border: 2px solid var(--border-light);
    
    .count {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--flame-deep-red);
    }
    
    .label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h4 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
  
  p {
    font-size: 1rem;
  }
`;

const ActionSection = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  padding: 2rem;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-fire);
  }
`;

const PermissionBanner = styled.div`
  background: ${props => props.allowed ? 
    'linear-gradient(135deg, #dcfdf4 0%, #d1fae5 100%)' : 
    'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'};
  border: 2px solid ${props => props.allowed ? '#10b981' : '#ef4444'};
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .icon {
    font-size: 1.5rem;
  }
  
  .text {
    font-weight: 500;
    color: ${props => props.allowed ? '#065f46' : '#991b1b'};
  }
`;

const SubmitButton = styled.button`
  padding: 1.25rem 3rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.2rem;
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.disabled ? `
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  ` : `
    background: var(--gradient-fire);
    color: white;
    cursor: pointer;
    
    &:hover {
      box-shadow: var(--shadow-flame);
      transform: translateY(-2px);
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }
    
    &:hover::before {
      left: 100%;
    }
  `}
`;

const TotalSummary = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid var(--flame-gold);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  text-align: center;
  
  .amount {
    font-size: 2rem;
    font-weight: 700;
    color: var(--flame-deep-red);
    margin-bottom: 0.5rem;
  }
  
  .label {
    color: var(--flame-deep-red);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

export default function ReviewSubmit({ formData = {} }) {
  const { isAuthenticated, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Extract data from different sections
  const eventPreview = formData.eventPreview || {};
  const eventDetails = formData.eventDetails || {};
  const rounds = formData.rounds || [];
  const eventOverview = formData.eventOverview || {};
  const items = formData.items || [];

  const totalCost = items?.reduce((sum, item) => sum + (item.price_per_unit * item.quantity), 0) || 0;
  const totalParticipants = rounds?.reduce((sum, round) => sum + (round.participants || 0), 0) || 0;

  // Helper to map frontend person fields to backend schema (snake_case)
  const toPerson = (p = {}) => ({
    name: p.name || '',
    roll_number: p.rollNumber || p.roll_number || '',
    mobile: p.mobile || p.contact || '',
    designation: p.designation || ''
  });

  async function submitForm() {
    setIsSubmitting(true);
    setError(null);

    try {
      const {
        eventPreview = {},
        eventDetails = {},
        items = [],
        rounds = [],
        eventOverview = {}
      } = formData || {};

      const payload = {
        // Core event fields
        name: eventPreview?.eventName?.trim() || '',
        tagline: eventOverview?.oneLineDescription?.trim() || '',
        about: eventOverview?.aboutTheEvent?.trim() || '',
        round_count: Number(eventDetails?.numberOfRounds) || Number(rounds?.length) || 0,

        // Rounds (backend expects name, description, rules only)
        rounds: (rounds || []).map(r => ({
          name: r?.name || '',
          description: r?.description || '',
          rules: Array.isArray(r?.rules) ? r.rules.filter(Boolean) : []
        })),

        // Event details (people) with snake_case keys
        details: {
          secretary1: toPerson(eventPreview?.secretary1),
          secretary2: toPerson(eventPreview?.secretary2),
          convenor1: toPerson(eventPreview?.convenor1),
          convenor2: toPerson(eventPreview?.convenor2),
          volunteer1: toPerson(eventPreview?.volunteer1),
          volunteer2: toPerson(eventPreview?.volunteer2),
          faculty_advisor: toPerson(eventPreview?.facultyAdvisor),
          judge: toPerson(eventPreview?.judge)
        },

        // Items with required total_price and numeric fields
        items: (items || [])
          .filter(it => (it?.item_name || '').trim())
          .map(it => {
            const quantity = Number(it.quantity) || 0;
            const price = Number(it.price_per_unit) || 0;
            return {
              item_name: String(it.item_name).trim(),
              quantity,
              price_per_unit: price,
              total_price: quantity * price
            };
          }),

        // Form section (all strings per schema)
        form: {
          day: eventDetails?.dayPreferred || '',
          two_days: eventDetails?.dayPreferred === 'twoDays' ? 'true' : 'false',
          rounds: eventDetails?.numberOfRounds != null ? String(eventDetails.numberOfRounds) : '',
          participants: eventDetails?.expectedParticipants != null ? String(eventDetails.expectedParticipants) : '',
          duration: eventDetails?.duration != null ? String(eventDetails.duration) : '',
          participant_type: eventDetails?.eventType || '',
          team_min: eventDetails?.minTeamSize != null ? String(eventDetails.minTeamSize) : '',
          team_max: eventDetails?.maxTeamSize != null ? String(eventDetails.maxTeamSize) : '',
          halls_required: eventDetails?.hallsRequired != null ? String(eventDetails.hallsRequired) : '',
          preferred_halls: eventDetails?.preferredHalls || '',
          hall_reason: eventDetails?.reasonForHalls || '',
          slot: eventDetails?.slot || '',
          extension_boxes: eventDetails?.extensionBox != null ? String(eventDetails.extensionBox) : '',
          extension_reason: eventDetails?.reasonForExtension || ''
        }
      };

      // Optional: include association_name if available from auth
      if (user?.association_name) payload.association_name = user.association_name;

      console.log("Submitting final payload:", payload);
      await createEvent(payload);
      navigate('/home', { state: { success: true, message: 'Event created successfully!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageWrapper>
      <Container>
        <Header>
          <h2>Review & Submit</h2>
          <p>Review all your event details before final submission</p>
        </Header>

        {/* Event Preview */}
        <ReviewCard>
          <SectionHeader>
            <h3>Event Preview</h3>
          </SectionHeader>
          <SectionContent>
            <InfoGrid>
              <InfoItem>
                <div className="label">Event Name</div>
                <div className="value">{eventPreview.eventName || "Not specified"}</div>
              </InfoItem>
            </InfoGrid>
            
            <h4 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)'}}>Secretary Details</h4>
            <InfoGrid>
              <InfoItem>
                <div className="label">Secretary 1</div>
                <div className="value">
                  {eventPreview.secretary1?.name || "Not specified"}<br/>
                  <small>Roll: {eventPreview.secretary1?.rollNumber || "N/A"} | Mobile: {eventPreview.secretary1?.mobile || "N/A"}</small>
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Secretary 2</div>
                <div className="value">
                  {eventPreview.secretary2?.name || "Not specified"}<br/>
                  <small>Roll: {eventPreview.secretary2?.rollNumber || "N/A"} | Mobile: {eventPreview.secretary2?.mobile || "N/A"}</small>
                </div>
              </InfoItem>
            </InfoGrid>
            
            <h4 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)'}}>Convenor Details</h4>
            <InfoGrid>
              <InfoItem>
                <div className="label">Convenor 1</div>
                <div className="value">
                  {eventPreview.convenor1?.name || "Not specified"}<br/>
                  <small>Roll: {eventPreview.convenor1?.rollNumber || "N/A"} | Mobile: {eventPreview.convenor1?.mobile || "N/A"}</small>
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Convenor 2</div>
                <div className="value">
                  {eventPreview.convenor2?.name || "Not specified"}<br/>
                  <small>Roll: {eventPreview.convenor2?.rollNumber || "N/A"} | Mobile: {eventPreview.convenor2?.mobile || "N/A"}</small>
                </div>
              </InfoItem>
            </InfoGrid>
            
            <h4 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)'}}>Volunteer Details</h4>
            <InfoGrid>
              <InfoItem>
                <div className="label">Volunteer 1</div>
                <div className="value">
                  {eventPreview.volunteer1?.name || "Not specified"}<br/>
                  <small>Roll: {eventPreview.volunteer1?.rollNumber || "N/A"} | Mobile: {eventPreview.volunteer1?.mobile || "N/A"}</small>
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Volunteer 2</div>
                <div className="value">
                  {eventPreview.volunteer2?.name || "Not specified"}<br/>
                  <small>Roll: {eventPreview.volunteer2?.rollNumber || "N/A"} | Mobile: {eventPreview.volunteer2?.mobile || "N/A"}</small>
                </div>
              </InfoItem>
            </InfoGrid>
            
            <h4 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)'}}>Faculty Advisor & Judge</h4>
            <InfoGrid>
              <InfoItem>
                <div className="label">Faculty Advisor</div>
                <div className="value">
                  {eventPreview.facultyAdvisor?.name || "Not specified"}<br/>
                  <small>Designation: {eventPreview.facultyAdvisor?.designation || "N/A"} | Contact: {eventPreview.facultyAdvisor?.contact || "N/A"}</small>
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Judge</div>
                <div className="value">
                  {eventPreview.judge?.name || "Not specified"}<br/>
                  <small>Designation: {eventPreview.judge?.designation || "N/A"} | Contact: {eventPreview.judge?.contact || "N/A"}</small>
                </div>
              </InfoItem>
            </InfoGrid>
          </SectionContent>
        </ReviewCard>

        {/* Event Details */}
        <ReviewCard>
          <SectionHeader>
            <h3>Event Details</h3>
          </SectionHeader>
          <SectionContent>
            <InfoGrid>
              <InfoItem>
                <div className="label">Day Preferred</div>
                <div className="value">
                  {eventDetails.dayPreferred === 'day1' ? 'Day 1' : 
                   eventDetails.dayPreferred === 'day2' ? 'Day 2' : 
                   eventDetails.dayPreferred === 'twoDays' ? 'Two Days' : 'Not specified'}
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Number of Rounds</div>
                <div className="value">{eventDetails.numberOfRounds || "Not specified"}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Expected Participants</div>
                <div className="value">{eventDetails.expectedParticipants || "Not specified"}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Duration</div>
                <div className="value">{eventDetails.duration || "Not specified"} hours</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Event Type</div>
                <div className="value">
                  {eventDetails.eventType === 'individual' ? 'Individual' : 
                   eventDetails.eventType === 'team' ? 'Team' : 'Not specified'}
                  {eventDetails.eventType === 'team' && eventDetails.minTeamSize && 
                    ` (Team Size: ${eventDetails.minTeamSize}-${eventDetails.maxTeamSize})`}
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Halls Required</div>
                <div className="value">{eventDetails.hallsRequired || "Not specified"}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Preferred Halls</div>
                <div className="value">{eventDetails.preferredHalls || "Not specified"}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Reason for Halls</div>
                <div className="value">{eventDetails.reasonForHalls || "Not specified"}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Slot Selection</div>
                <div className="value">
                  {eventDetails.slot === 'slot1' ? 'Slot 1 (9 AM - 1 PM)' : 
                   eventDetails.slot === 'slot2' ? 'Slot 2 (2 PM - 6 PM)' : 
                   eventDetails.slot === 'fullDay' ? 'Full Day (9 AM - 6 PM)' : 'Not specified'}
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Extension Box Required</div>
                <div className="value">{eventDetails.extensionBox || "Not specified"}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Reason for Extension</div>
                <div className="value">{eventDetails.reasonForExtension || "Not specified"}</div>
              </InfoItem>
            </InfoGrid>
          </SectionContent>
        </ReviewCard>

        {/* Items */}
        <ReviewCard>
          <SectionHeader>
            <h3>Items & Budget</h3>
          </SectionHeader>
          <SectionContent>
            {items && items.length > 0 && items.some(item => item.item_name?.trim()) ? (
              <>
                <Table>
                  <thead>
                    <tr>
                      <Th>Item Name</Th>
                      <Th>Price per Unit</Th>
                      <Th>Quantity</Th>
                      <Th>Total</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.filter(item => item.item_name?.trim()).map((item, idx) => (
                      <tr key={idx}>
                        <Td>{item.item_name}</Td>
                        <Td>₹{item.price_per_unit?.toLocaleString()}</Td>
                        <Td>{item.quantity}</Td>
                        <Td>₹{(item.price_per_unit * item.quantity)?.toLocaleString()}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <TotalSummary>
                  <div className="amount">₹{totalCost.toLocaleString()}</div>
                  <div className="label">Total Estimated Budget</div>
                </TotalSummary>
              </>
            ) : (
              <EmptyState>
                <h4>No Items Added</h4>
                <p>Go back to the Items page to add event items and budget details.</p>
              </EmptyState>
            )}
          </SectionContent>
        </ReviewCard>

        {/* Event Overview */}
        <ReviewCard>
          <SectionHeader>
            <h3>Event Overview</h3>
          </SectionHeader>
          <SectionContent>
            <InfoGrid>
              <InfoItem>
                <div className="label">One Line Description</div>
                <div className="value">{eventOverview.oneLineDescription || "Not specified"}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">About the Event</div>
                <div className="value">{eventOverview.aboutTheEvent || "Not specified"}</div>
              </InfoItem>
            </InfoGrid>
          </SectionContent>
        </ReviewCard>

        {/* Rounds */}
        <ReviewCard>
          <SectionHeader>
            <h3>Competition Rounds ({rounds?.length || 0})</h3>
          </SectionHeader>
          <SectionContent>
            {rounds && rounds.length > 0 ? (
              <>
                {rounds.map((round, idx) => (
                  <RoundCard key={idx}>
                    <div className="round-name">{round.name}</div>
                    <div className="round-info">
                      <div className="description">
                        <strong>Description:</strong><br/>
                        {round.description || "No description provided"}
                        {round.rules && round.rules.length > 0 && (
                          <>
                            <br/><br/><strong>Rules:</strong>
                            <ul style={{margin: '0.5rem 0', paddingLeft: '1.5rem'}}>
                              {round.rules.map((rule, ruleIdx) => (
                                <li key={ruleIdx} style={{marginBottom: '0.25rem'}}>{rule}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                      <div className="participants">
                        <div className="count">{round.participants || 0}</div>
                        <div className="label">Participants</div>
                      </div>
                    </div>
                  </RoundCard>
                ))}
                <TotalSummary>
                  <div className="amount">{totalParticipants}</div>
                  <div className="label">Total Expected Participants</div>
                </TotalSummary>
              </>
            ) : (
              <EmptyState>
                <h4>No Rounds Configured</h4>
                <p>Go back to the Rounds page to set up your competition rounds.</p>
              </EmptyState>
            )}
          </SectionContent>
        </ReviewCard>

        {/* Submit Section */}
        <ActionSection>
          

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="button-container">
            <button
              className="back-button"
              onClick={() => navigate('/create-event/rounds')}
              disabled={isSubmitting}
            >
              Back
            </button>
            <SubmitButton 
              onClick={submitForm}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Event Form'}
            </SubmitButton>
          </div>
        </ActionSection>
      </Container>
    </PageWrapper>
  );
}
