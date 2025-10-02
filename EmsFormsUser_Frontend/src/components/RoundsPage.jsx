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
  border: 1px solid ${props => (props.$invalid ? '#dc2626' : 'var(--border-light)')};
  border-radius: 6px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${props => (props.$invalid ? '#dc2626' : 'var(--flame-orange)')};
    box-shadow: 0 0 0 3px ${props => (props.$invalid ? 'rgba(220,38,38,0.15)' : 'rgba(234,88,12,0.1)')};
  }
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
  border: 2px solid ${props => (props.$invalid ? '#dc2626' : 'var(--border-light)')};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
  
  &:focus {
    border-color: ${props => (props.$invalid ? '#dc2626' : 'var(--flame-orange)')};
    background: white;
    box-shadow: 0 0 0 3px ${props => (props.$invalid ? 'rgba(220,38,38,0.15)' : 'rgba(234, 88, 12, 0.1)')};
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid ${props => (props.$invalid ? '#dc2626' : 'var(--border-light)')};
  border-radius: 10px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #fafafa;
  
  &:focus {
    border-color: ${props => (props.$invalid ? '#dc2626' : 'var(--flame-orange)')};
    background: white;
    box-shadow: 0 0 0 3px ${props => (props.$invalid ? 'rgba(220,38,38,0.15)' : 'rgba(234, 88, 12, 0.1)')};
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const TieBreakerToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid var(--border-light);

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--flame-orange);
  }

  label {
    font-weight: 500;
    color: var(--text-primary);
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
  border: 2px solid ${props => (props.$invalid ? '#dc2626' : 'var(--border-light)')};
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--flame-deep-red);
  min-width: 80px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: ${props => (props.$invalid ? '#dc2626' : 'var(--flame-orange)')};
    box-shadow: 0 0 0 3px ${props => (props.$invalid ? 'rgba(220,38,38,0.15)' : 'rgba(234, 88, 12, 0.1)')};
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

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
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

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  `}
`;

const ErrorText = styled.div`
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 0.4rem;
`;

const parseRules = v => {
  if (Array.isArray(v)) return v.filter(Boolean).map(s => String(s).trim()).filter(Boolean);
  // If using textarea, split by newline or semicolon
  return String(v || '')
    .split(/\r?\n|;/)
    .map(s => s.trim())
    .filter(Boolean);
};

const RoundsPage = ({ formData: globalFormData, setFormData: setGlobalFormData }) => {
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [newRule, setNewRule] = useState({});
  const [newTieBreakerRule, setNewTieBreakerRule] = useState({});
  const [eventOverview, setEventOverview] = useState({
    oneLineDescription: '',
    aboutTheEvent: ''
  });

  // Validation state
  const [errors, setErrors] = useState({ overview: {}, rounds: [] });
  const [isFormValid, setIsFormValid] = useState(false);

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
      participants: 0,
      hasTieBreaker: false,
      tieBreaker: {
        name: `Tie-Breaker for Round ${i + 1}`,
        description: "",
        rules: [],
        participants: 1, // default to 1 so it’s valid by default
      }
    }));
    setRounds(initial);
  }, [globalFormData, navigate]);

  // Build errors for current state
  const buildErrors = () => {
    const overview = {};
    if (!eventOverview.oneLineDescription?.trim()) {
      overview.oneLineDescription = 'This field is required.';
    }
    if (!eventOverview.aboutTheEvent?.trim()) {
      overview.aboutTheEvent = 'This field is required.';
    }

    const roundsErr = rounds.map(r => {
      const e = {};
      if (!r?.name?.trim()) e.name = 'Round name is required.';
      if (!r?.description?.trim()) e.description = 'Description is required.';
      if (!Array.isArray(r?.rules) || r.rules.length === 0) e.rules = 'Add at least one rule.';
      const p = Number(r?.participants);
      if (!Number.isFinite(p) || p < 1) e.participants = 'Participants must be at least 1.';
      
      if (r.hasTieBreaker) {
        e.tieBreaker = {};
        if (!r.tieBreaker?.name?.trim()) e.tieBreaker.name = 'Tie-breaker name is required.';
        if (!r.tieBreaker?.description?.trim()) e.tieBreaker.description = 'Tie-breaker description is required.';
        if (!Array.isArray(r.tieBreaker?.rules) || r.tieBreaker.rules.length === 0) e.tieBreaker.rules = 'Add at least one tie-breaker rule.';
        const tbP = Number(r.tieBreaker?.participants);
        if (!Number.isFinite(tbP) || tbP < 1) e.tieBreaker.participants = 'Participants must be at least 1.';
      }

      return e;
    });

    return { overview, rounds: roundsErr };
  };

  const isEmpty = (obj) => {
    if (!obj) return true;
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // Recursively check nested objects
          if (!isEmpty(obj[key])) return false;
        } else {
          return false;
        }
      }
    }
    return true;
  };

  // Revalidate whenever values change
  useEffect(() => {
    const errs = buildErrors();
    setErrors(errs);
    setIsFormValid(isEmpty(errs.overview) && errs.rounds.every(isEmpty));
  }, [eventOverview, rounds]);

  const focusFirstError = (errs) => {
    const idsInOrder = [
      errs.overview.oneLineDescription ? 'overview-oneLineDescription' : null,
      errs.overview.aboutTheEvent ? 'overview-aboutTheEvent' : null,
    ].filter(Boolean);

    // Round fields in order per round
    errs.rounds.forEach((e, i) => {
      if (e.name) idsInOrder.push(`round-${i}-name`);
      else if (e.description) idsInOrder.push(`round-${i}-description`);
      else if (e.rules) idsInOrder.push(`round-${i}-rule-input`);
      else if (e.participants) idsInOrder.push(`round-${i}-participants`);
      else if (e.tieBreaker?.name) idsInOrder.push(`tiebreaker-${i}-name`);
      else if (e.tieBreaker?.description) idsInOrder.push(`tiebreaker-${i}-description`);
      else if (e.tieBreaker?.rules) idsInOrder.push(`tiebreaker-${i}-rule-input`);
      else if (e.tieBreaker?.participants) idsInOrder.push(`tiebreaker-${i}-participants`);
    });

    const id = idsInOrder[0];
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Slight timeout to ensure scroll completes before focusing
        setTimeout(() => el.focus?.({ preventScroll: true }), 250);
      }
    }
  };

  const handleChange = (index, key, value) => {
    setRounds(prev => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      copy[index] = { ...copy[index], [key]: value };

      // If enabling tie-breaker, ensure participants is at least 1
      if (key === 'hasTieBreaker' && value) {
        const tb = copy[index].tieBreaker || {
          name: `Tie-Breaker for Round ${index + 1}`,
          description: "",
          rules: [],
          participants: 1
        };
        copy[index].tieBreaker = { ...tb, participants: Math.max(1, Number(tb.participants) || 1) };
      }
      return copy;
    });
  };

  const handleTieBreakerChange = (index, key, value) => {
    setRounds(prev => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      copy[index] = {
        ...copy[index],
        tieBreaker: {
          ...copy[index].tieBreaker,
          [key]: value,
        },
      };
      return copy;
    });
  };

  const addRule = (roundIndex) => {
    const rule = (newRule[roundIndex] || "").trim();
    if (!rule) return;
    setRounds(prev => {
      const copy = [...prev];
      const rules = copy[roundIndex].rules || [];
      // Guard: prevent immediate double-adds and duplicates
      if (rules[rules.length - 1] === rule || rules.includes(rule)) return prev;
      copy[roundIndex] = { ...copy[roundIndex], rules: [...rules, rule] };
      return copy;
    });
    setNewRule(prev => ({ ...prev, [roundIndex]: "" }));
  };

  const addTieBreakerRule = (roundIndex) => {
    const rule = (newTieBreakerRule[roundIndex] || "").trim();
    if (!rule) return;
    setRounds(prev => {
      const copy = [...prev];
      const rules = copy[roundIndex].tieBreaker?.rules || [];
      // Guard: prevent immediate double-adds and duplicates
      if (rules[rules.length - 1] === rule || rules.includes(rule)) return prev;
      copy[roundIndex].tieBreaker = {
        ...copy[roundIndex].tieBreaker,
        rules: [...rules, rule]
      };
      return copy;
    });
    setNewTieBreakerRule(prev => ({ ...prev, [roundIndex]: "" }));
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

  const removeTieBreakerRule = (roundIndex, ruleIndex) => {
    setRounds(prev => {
      const copy = [...prev];
      const tieBreakerRules = (copy[roundIndex].tieBreaker.rules || []).filter((_, i) => i !== ruleIndex);
      copy[roundIndex].tieBreaker = {
        ...copy[roundIndex].tieBreaker,
        rules: tieBreakerRules
      };
      return copy;
    });
  };

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
        participants: 0,
        hasTieBreaker: false,
        tieBreaker: {
          name: `Tie-Breaker for Round ${prev.length + 1}`,
          description: "",
          rules: [],
          participants: 1, // default to 1
        }
      }
    ]);
  };

  const removeRound = (index) => {
    setRounds(prev => prev.filter((_, i) => i !== index));
  };

  const updateParticipants = (index, delta, isTieBreaker = false) => {
    setRounds(prev => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      if (isTieBreaker) {
        const current = Number(copy[index].tieBreaker.participants) || 0;
        copy[index].tieBreaker.participants = Math.max(1, current + delta);
      } else {
        const current = Number(copy[index].participants) || 0;
        copy[index].participants = Math.max(1, current + delta);
      }
      return copy;
    });
  };

  const handleParticipantInputChange = (index, value, isTieBreaker = false) => {
    const num = parseInt(value, 10);
    const finalValue = isNaN(num) ? 1 : Math.max(1, num);
    setRounds(prev => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      if (isTieBreaker) {
        copy[index].tieBreaker.participants = finalValue;
      } else {
        copy[index].participants = finalValue;
      }
      return copy;
    });
  };

  // Note: handleRoundChange isn't used; keeping for potential future syncs
  const handleRoundChange = (index, field, value) => {
    setFormData(prev => {
      const list = Array.isArray(prev.rounds) ? [...prev.rounds] : [];
      const current = { ...(list[index] || {}) };

      if (field === 'name') current.name = String(value);
      if (field === 'description') current.description = String(value);
      if (field === 'rules') current.rules = parseRules(value);
      if (field === 'participants') current.participants = value === '' ? '' : Number(value);

      list[index] = current;
      return { ...prev, rounds: list };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = buildErrors();
    setErrors(errs);
    const valid = isEmpty(errs.overview) && errs.rounds.every(isEmpty);
    if (!valid) {
      focusFirstError(errs);
      return;
    }
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
              id="overview-oneLineDescription"
              type="text"
              placeholder="Enter a catchy one-line description for your event..."
              value={eventOverview.oneLineDescription}
              onChange={(e) => handleEventOverviewChange('oneLineDescription', e.target.value)}
              $invalid={!!errors.overview.oneLineDescription}
              aria-invalid={!!errors.overview.oneLineDescription}
            />
            {errors.overview.oneLineDescription && (
              <ErrorText>{errors.overview.oneLineDescription}</ErrorText>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label>About the Event *</Label>
            <TextArea
              id="overview-aboutTheEvent"
              placeholder="Provide detailed information about your event..."
              value={eventOverview.aboutTheEvent}
              onChange={(e) => handleEventOverviewChange('aboutTheEvent', e.target.value)}
              $invalid={!!errors.overview.aboutTheEvent}
              aria-invalid={!!errors.overview.aboutTheEvent}
            />
            {errors.overview.aboutTheEvent && (
              <ErrorText>{errors.overview.aboutTheEvent}</ErrorText>
            )}
          </FormGroup>
        </EventOverviewSection>
        
        <RoundsGrid>
          {rounds.flatMap((round, i) => {
            const rErr = errors.rounds[i] || {};
            const tbErr = rErr.tieBreaker || {};
            const cards = [(
              <RoundCard key={`round-${i}`}>
                <RoundHeader>
                  <h3>
                    {round.name}
                    <span className="round-number">#{i + 1}</span>
                  </h3>
                  
                </RoundHeader>
                
                <RoundContent>
                  <FormGroup>
                    <Label>Round Name *</Label>
                    <Input 
                      id={`round-${i}-name`}
                      value={round.name}
                      placeholder="Enter round name..."
                      onChange={e => handleChange(i, "name", e.target.value)}
                      $invalid={!!rErr.name}
                      aria-invalid={!!rErr.name}
                    />
                    {rErr.name && <ErrorText>{rErr.name}</ErrorText>}
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Description *</Label>
                    <TextArea 
                      id={`round-${i}-description`}
                      value={round.description}
                      placeholder="Describe the rules, objectives, and format of this round..."
                      onChange={e => handleChange(i, "description", e.target.value)}
                      $invalid={!!rErr.description}
                      aria-invalid={!!rErr.description}
                    />
                    {rErr.description && <ErrorText>{rErr.description}</ErrorText>}
                  </FormGroup>

                  {/* Round Rules Section */}
                  <RulesSection>
                    <Label>Round Rules *</Label>
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
                    {rErr.rules && <ErrorText>{rErr.rules}</ErrorText>}
                    <RuleInput>
                      <RuleInputField
                        id={`round-${i}-rule-input`}
                        placeholder="Enter a rule (e.g., No internet, Time limit 30 mins)..."
                        value={newRule[i] || ''}
                        onChange={(e) => setNewRule(prev => ({...prev, [i]: e.target.value}))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addRule(i);
                          }
                        }}
                        $invalid={!!rErr.rules}
                        aria-invalid={!!rErr.rules}
                      />
                      <AddRuleButton type="button" onClick={() => addRule(i)}>
                        Add Rule
                      </AddRuleButton>
                    </RuleInput>
                  </RulesSection>
                  
                  <FormGroup style={{marginTop: '2rem'}}>
                    <Label>Number of Participants *</Label>
                    <ParticipantCounter>
                      <CounterButton 
                        type="button"
                        onClick={() => updateParticipants(i, -1)}
                        disabled={round.participants <= 1}
                        aria-label="Decrease participants"
                      >
                        −
                      </CounterButton>
                      <ParticipantInput
                        id={`round-${i}-participants`}
                        type="number"
                        min="1"
                        value={round.participants}
                        onChange={(e) => handleParticipantInputChange(i, e.target.value)}
                        placeholder="1"
                        $invalid={!!rErr.participants}
                        aria-invalid={!!rErr.participants}
                      />
                      <CounterButton type="button" onClick={() => updateParticipants(i, 1)} aria-label="Increase participants">
                        +
                      </CounterButton>
                    </ParticipantCounter>
                    {rErr.participants && <ErrorText>{rErr.participants}</ErrorText>}
                  </FormGroup>

                  <TieBreakerToggle>
                    <input
                      type="checkbox"
                      id={`tiebreaker-toggle-${i}`}
                      checked={round.hasTieBreaker}
                      onChange={e => handleChange(i, "hasTieBreaker", e.target.checked)}
                    />
                    <label htmlFor={`tiebreaker-toggle-${i}`}>This round has a tie-breaker</label>
                  </TieBreakerToggle>
                </RoundContent>
              </RoundCard>
            )];

            if (round.hasTieBreaker) {
              cards.push(
                <RoundCard key={`tiebreaker-${i}`}>
                  <RoundHeader>
                    <h3>
                      {round.tieBreaker.name}
                      <span className="round-number" style={{background: 'var(--flame-gold)'}}>TIE-BREAKER</span>
                    </h3>
                  </RoundHeader>
                  <RoundContent>
                    <FormGroup>
                      <Label>Tie-Breaker Name *</Label>
                      <Input
                        id={`tiebreaker-${i}-name`}
                        value={round.tieBreaker.name}
                        placeholder="Enter tie-breaker name..."
                        onChange={e => handleTieBreakerChange(i, "name", e.target.value)}
                        $invalid={!!tbErr.name}
                        aria-invalid={!!tbErr.name}
                      />
                      {tbErr.name && <ErrorText>{tbErr.name}</ErrorText>}
                    </FormGroup>
                    <FormGroup>
                      <Label>Tie-Breaker Description *</Label>
                      <TextArea
                        id={`tiebreaker-${i}-description`}
                        value={round.tieBreaker.description}
                        placeholder="Describe the tie-breaker round..."
                        onChange={e => handleTieBreakerChange(i, "description", e.target.value)}
                        $invalid={!!tbErr.description}
                        aria-invalid={!!tbErr.description}
                      />
                      {tbErr.description && <ErrorText>{tbErr.description}</ErrorText>}
                    </FormGroup>
                    <RulesSection>
                      <Label>Tie-Breaker Rules *</Label>
                      <RulesList>
                        {(round.tieBreaker.rules || []).map((rule, ruleIndex) => (
                          <RuleItem key={ruleIndex}>
                            <span>• {rule}</span>
                            <RemoveRuleButton type="button" onClick={() => removeTieBreakerRule(i, ruleIndex)}>
                              Remove
                            </RemoveRuleButton>
                          </RuleItem>
                        ))}
                      </RulesList>
                      {tbErr.rules && <ErrorText>{tbErr.rules}</ErrorText>}
                      <RuleInput>
                        <RuleInputField
                          id={`tiebreaker-${i}-rule-input`}
                          placeholder="Enter a tie-breaker rule..."
                          value={newTieBreakerRule[i] || ''}
                          onChange={(e) => setNewTieBreakerRule(prev => ({...prev, [i]: e.target.value}))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTieBreakerRule(i);
                            }
                          }}
                          $invalid={!!tbErr.rules}
                          aria-invalid={!!tbErr.rules}
                        />
                        <AddRuleButton type="button" onClick={() => addTieBreakerRule(i)}>
                          Add Rule
                        </AddRuleButton>
                      </RuleInput>
                    </RulesSection>
                    <FormGroup style={{marginTop: '2rem'}}>
                      <Label>Number of Participants *</Label>
                      <ParticipantCounter>
                        <CounterButton 
                          type="button"
                          onClick={() => updateParticipants(i, -1, true)}
                          disabled={round.tieBreaker.participants <= 1}
                          aria-label="Decrease tie-breaker participants"
                        >
                        </CounterButton>
                        <ParticipantInput
                          id={`tiebreaker-${i}-participants`}
                          type="number"
                          min="1"
                          value={round.tieBreaker.participants}
                          onChange={(e) => handleParticipantInputChange(i, e.target.value, true)}
                          placeholder="1"
                          $invalid={!!tbErr.participants}
                          aria-invalid={!!tbErr.participants}
                        />
                        <CounterButton type="button" onClick={() => updateParticipants(i, 1, true)} aria-label="Increase tie-breaker participants">
                          +
                        </CounterButton>
                      </ParticipantCounter>
                      {tbErr.participants && <ErrorText>{tbErr.participants}</ErrorText>}
                    </FormGroup>
                  </RoundContent>
                </RoundCard>
              );
            }
            return cards;
          })}
        </RoundsGrid>
        
        <ButtonGroup>
          <ActionButton type="button" onClick={addRound}>
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
