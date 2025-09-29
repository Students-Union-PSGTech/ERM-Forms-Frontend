import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const EventOverviewSection = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  padding: 2rem;
  margin-bottom: 3rem;
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

const SectionTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--flame-orange);
`;

const EventNameDisplay = styled.div`
  background: linear-gradient(135deg, var(--flame-orange) 0%, var(--flame-deep-red) 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const RulesSection = styled.div`
  margin-top: 1rem;
`;

const RulesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
`;

const RuleItem = styled.li`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RuleInput = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const RuleInputField = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 0.9rem;
`;

const AddRuleButton = styled.button`
  padding: 0.5rem 1rem;
  background: var(--flame-orange);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background: var(--flame-deep-red);
  }
`;

const RemoveRuleButton = styled.button`
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background: #b91c1c;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h2 {
    font-size: 2.25rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;

const RoundsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const RoundCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-flame);
  }
  
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

const RoundHeader = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid var(--border-light);
  
  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    margin: 0;
    color: var(--text-primary);
  }
  
  .round-number {
    background: var(--gradient-fire);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-left: auto;
  }
`;

const RoundContent = styled.div`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 30px;
    height: 2px;
    background: var(--gradient-fire);
    border-radius: 1px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-light);
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
  
  &:focus {
    border-color: var(--flame-orange);
    background: white;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-light);
  border-radius: 10px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #fafafa;
  
  &:focus {
    border-color: var(--flame-orange);
    background: white;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const ParticipantCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const CounterButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--gradient-fire);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-soft);
  }
  
  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const ParticipantInput = styled.input`
  background: white;
  border: 2px solid var(--border-light);
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--flame-deep-red);
  min-width: 80px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--flame-orange);
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
`;

const ActionButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.primary ? `
    background: var(--gradient-fire);
    color: white;
    
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
  ` : `
    background: transparent;
    color: var(--text-secondary);
    border: 2px solid var(--border-light);
    
    &:hover {
      border-color: var(--flame-orange);
      color: var(--flame-orange);
      transform: translateY(-1px);
    }
  `}
`;

const RoundsPage = ({ formData: globalFormData, setFormData: setGlobalFormData }) => {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [newRule, setNewRule] = useState({});
  const [eventOverview, setEventOverview] = useState({
    oneLineDescription: '',
    aboutTheEvent: ''
  });

  // Load data from global state on mount
  useEffect(() => {
    // If details missing, route back to complete prerequisites
    if (!globalFormData?.eventDetails?.numberOfRounds) {
      navigate('/create-event/details');
      return;
    }

    // Load overview
    if (globalFormData?.eventOverview) {
      setEventOverview(globalFormData.eventOverview);
    }

    // Load rounds if already present
    if (Array.isArray(globalFormData?.rounds) && globalFormData.rounds.length > 0) {
      setRounds(globalFormData.rounds);
      return;
    }

    // Initialize rounds if not present yet
    const count = parseInt(globalFormData.eventDetails.numberOfRounds) || 0;
    const initial = Array.from({ length: count }, (_, i) => ({
      name: `Round ${i + 1}`,
      description: "",
      rules: [],
      participants: 0
    }));
    setRounds(initial);
  }, [globalFormData, navigate]);

  // Auto-sync local edits into global formData so navbar navigation also preserves state
  

  const handleChange = (index, key, value) => {
    setRounds(prev => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const addRule = (roundIndex) => {
    const rule = (newRule[roundIndex] || "").trim();
    if (!rule) return;
    setRounds(prev => {
      const copy = [...prev];
      copy[roundIndex] = { ...copy[roundIndex], rules: [...(copy[roundIndex].rules || []), rule] };
      return copy;
    });
    setNewRule(prev => ({ ...prev, [roundIndex]: "" }));
  };

  const removeRule = (roundIndex, ruleIndex) => {
    setRounds(prev => {
      const copy = [...prev];
      copy[roundIndex] = {
        ...copy[roundIndex],
        rules: (copy[roundIndex].rules || []).filter((_, i) => i !== ruleIndex)
      };
      return copy;
    });
  };

  // NEW: handlers that were missing
  const handleEventOverviewChange = (key, value) => {
    setEventOverview(prev => ({ ...prev, [key]: value }));
  };

  const addRound = () => {
    setRounds(prev => [
      ...prev,
      {
        name: `Round ${prev.length + 1}`,
        description: "",
        rules: [],
        participants: 0
      }
    ]);
  };

  const removeRound = (index) => {
    setRounds(prev => prev.filter((_, i) => i !== index));
  };

  const updateParticipants = (index, delta) => {
    setRounds(prev => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      const current = Number(copy[index].participants) || 0;
      copy[index] = { ...copy[index], participants: Math.max(0, current + delta) };
      return copy;
    });
  };

  const handleParticipantInputChange = (index, value) => {
    const num = parseInt(value, 10);
    setRounds(prev => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      copy[index] = { ...copy[index], participants: isNaN(num) ? 0 : Math.max(0, num) };
      return copy;
    });
  };

  const onSaveAndContinue = () => {
    setGlobalFormData(prev => ({
      ...prev,
      eventOverview,
      rounds
    }));
    navigate('/create-event/review');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGlobalFormData(prev => ({
      ...prev,
      eventOverview,
      rounds
    }));
    navigate('/create-event/review');
  };

  return (
    <PageWrapper>
      <Container>
        <Header>
          <h2>Competition Rounds</h2>
          <p>Configure rounds and participant details for your event</p>
        </Header>

        {/* Event Overview Section */}
        <EventOverviewSection>
          <SectionTitle>Event Overview</SectionTitle>
          
          {/* Display Event Name from Event Preview */}
          <EventNameDisplay>
            EVENT NAME: {globalFormData?.eventPreview?.eventName || 'Not Set'}
          </EventNameDisplay>
          
          <FormGroup>
            <Label>One Line Description (Tag Line) *</Label>
            <Input
              type="text"
              placeholder="Enter a catchy one-line description for your event..."
              value={eventOverview.oneLineDescription}
              onChange={(e) => handleEventOverviewChange('oneLineDescription', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>About the Event *</Label>
            <TextArea
              placeholder="Provide detailed information about your event..."
              value={eventOverview.aboutTheEvent}
              onChange={(e) => handleEventOverviewChange('aboutTheEvent', e.target.value)}
            />
          </FormGroup>
        </EventOverviewSection>
        
        <RoundsGrid>
          {rounds.map((round, i) => (
            <RoundCard key={i}>
              <RoundHeader>
                <h3>
                  {round.name}
                  <span className="round-number">#{i + 1}</span>
                </h3>
                {rounds.length > 2 && (
                  <button 
                    onClick={() => removeRound(i)}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '1rem',
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      color: '#dc2626'
                    }}
                  >
                    ×
                  </button>
                )}
              </RoundHeader>
              
              <RoundContent>
                <FormGroup>
                  <Label>Round Name</Label>
                  <Input 
                    value={round.name}
                    placeholder="Enter round name..."
                    onChange={e => handleChange(i, "name", e.target.value)}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Description</Label>
                  <TextArea 
                    value={round.description}
                    placeholder="Describe the rules, objectives, and format of this round..."
                    onChange={e => handleChange(i, "description", e.target.value)}
                  />
                </FormGroup>

                {/* Round Rules Section */}
                <RulesSection>
                  <Label>Round Rules</Label>
                  <RulesList>
                    {round.rules.map((rule, ruleIndex) => (
                      <RuleItem key={ruleIndex}>
                        <span>• {rule}</span>
                        <RemoveRuleButton onClick={() => removeRule(i, ruleIndex)}>
                          Remove
                        </RemoveRuleButton>
                      </RuleItem>
                    ))}
                  </RulesList>
                  <RuleInput>
                    <RuleInputField
                      placeholder="Enter a rule (e.g., No internet, Time limit 30 mins)..."
                      value={newRule[i] || ''}
                      onChange={(e) => setNewRule(prev => ({...prev, [i]: e.target.value}))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRule(i);
                        }
                      }}
                    />
                    <AddRuleButton onClick={() => addRule(i)}>
                      Add Rule
                    </AddRuleButton>
                  </RuleInput>
                </RulesSection>
                
                <FormGroup style={{marginTop: '2rem'}}>
                  <Label>Number of Participants</Label>
                  <ParticipantCounter>
                    <CounterButton 
                      onClick={() => updateParticipants(i, -1)}
                      disabled={round.participants <= 0}
                    >
                      −
                    </CounterButton>
                    <ParticipantInput
                      type="number"
                      min="0"
                      value={round.participants}
                      onChange={(e) => handleParticipantInputChange(i, e.target.value)}
                      placeholder="0"
                    />
                    <CounterButton onClick={() => updateParticipants(i, 1)}>
                      +
                    </CounterButton>
                  </ParticipantCounter>
                </FormGroup>
              </RoundContent>
            </RoundCard>
          ))}
        </RoundsGrid>
        
        <ButtonGroup>
          <ActionButton onClick={addRound}>
            Add Round
          </ActionButton>
          <ActionButton primary onClick={handleSubmit}>
            Save & Continue
          </ActionButton>
        </ButtonGroup>
      </Container>
    </PageWrapper>
  );
};

export default RoundsPage;
