import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

const PageWrapper = styled.div`
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  overflow: hidden;
  position: relative;
  
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

const Header = styled.div`
  padding: 2rem 2rem 1rem;
  text-align: center;
  
  h2 {
    font-size: 2.25rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;

const Form = styled.form`
  padding: 0 2rem 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
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
  margin-top: 0.5rem;
  border-radius: 10px;
  border: 2px solid var(--border-light);
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
  
  &:focus {
    border-color: var(--flame-orange);
    background: white;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
    transform: translateY(-1px);
  }
  
  &.error {
    border-color: #dc2626;
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  margin-top: 0.5rem;
  border-radius: 10px;
  border: 2px solid var(--border-light);
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fafafa;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    border-color: var(--flame-orange);
    background: white;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
    transform: translateY(-1px);
  }
  
  &.error {
    border-color: #dc2626;
  }
  
  &::placeholder {
    color: var(--text-secondary);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
`;

const SectionTitle = styled.h3`
  color: var(--text-primary);
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--flame-orange);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background: var(--gradient-fire);
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.75rem;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--flame-orange);
    background: rgba(234, 88, 12, 0.05);
  }
  
  input[type="radio"] {
    width: 18px;
    height: 18px;
    accent-color: var(--flame-orange);
  }
  
  &.selected {
    border-color: var(--flame-orange);
    background: rgba(234, 88, 12, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-light);
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.primary ? `
    background: var(--gradient-fire);
    color: white;
    border: none;
    box-shadow: var(--shadow-soft);
    
    &:hover {
      box-shadow: var(--shadow-flame);
      transform: translateY(-2px);
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

export default function EventDetails({ formData: globalFormData, setFormData: setGlobalFormData }) {
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    // Day Preference
    dayPreferred: '', // 'day1', 'day2', 'twoDays'
    
    // Number of rounds
    numberOfRounds: '',
    
    // Expected number of participants
    expectedParticipants: '',
    
    // Duration of the event
    duration: '',
    
    // Event Type
    eventType: '', // 'individual' or 'team'
    
    // Team details (conditional)
    minTeamSize: '',
    maxTeamSize: '',
    
    // Halls required
    hallsRequired: '',
    
    // Preferred halls
    preferredHalls: '',
    
    // Reason for halls
    reasonForHalls: '',
    
    // Slot Selection
    slot: '', // 'slot1', 'slot2', 'fullDay'
    
    // Extension box
    extensionBox: '',
    
    // Reason for extension boxes
    reasonForExtension: ''
  });

  const [errors, setErrors] = useState({});

  // Load data from global state on mount
  useEffect(() => {
    if (globalFormData?.eventDetails) {
      setDetails(globalFormData.eventDetails);
    }
    
    // Check if Event Preview is completed (compulsory)
    if (!globalFormData?.eventPreview?.eventName) {
      // Redirect to Event Preview if not completed
      navigate('/');
    }
  }, [globalFormData, navigate]);

  const handleChange = (field, value) => {
    setDetails(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Day preferred validation
    if (!details.dayPreferred) newErrors.dayPreferred = 'Please select day preference';
    
    // Number of rounds validation
    if (!details.numberOfRounds.trim()) newErrors.numberOfRounds = 'Number of rounds is required';
    if (details.numberOfRounds && parseInt(details.numberOfRounds) < 1) {
      newErrors.numberOfRounds = 'Number of rounds must be at least 1';
    }
    
    // Expected participants validation
    if (!details.expectedParticipants.trim()) newErrors.expectedParticipants = 'Expected number of participants is required';
    if (details.expectedParticipants && parseInt(details.expectedParticipants) < 1) {
      newErrors.expectedParticipants = 'Expected participants must be at least 1';
    }
    
    // Duration validation
    if (!details.duration.trim()) newErrors.duration = 'Duration is required';
    
    // Event type validation
    if (!details.eventType) newErrors.eventType = 'Please select event type';
    
    // Team size validation (only if team event)
    if (details.eventType === 'team') {
      if (!details.minTeamSize.trim()) newErrors.minTeamSize = 'Minimum team size is required';
      if (!details.maxTeamSize.trim()) newErrors.maxTeamSize = 'Maximum team size is required';
      if (details.minTeamSize && details.maxTeamSize) {
        const min = parseInt(details.minTeamSize);
        const max = parseInt(details.maxTeamSize);
        if (min > max) newErrors.maxTeamSize = 'Maximum size must be greater than minimum';
        if (min < 2) newErrors.minTeamSize = 'Team must have at least 2 members';
      }
    }
    
    // Halls required validation
    if (!details.hallsRequired.trim()) newErrors.hallsRequired = 'Number of halls required is required';
    if (details.hallsRequired && parseInt(details.hallsRequired) < 1) {
      newErrors.hallsRequired = 'At least 1 hall is required';
    }
    
    // Preferred halls validation
    if (!details.preferredHalls.trim()) newErrors.preferredHalls = 'Preferred halls is required';
    
    // Reason for halls validation
    if (!details.reasonForHalls.trim()) newErrors.reasonForHalls = 'Reason for hall selection is required';
    
    // Slot validation
    if (!details.slot) newErrors.slot = 'Please select a slot';
    
    // Extension box validation
    if (!details.extensionBox.trim()) newErrors.extensionBox = 'Extension box details are required';
    
    // Reason for extension validation
    if (!details.reasonForExtension.trim()) newErrors.reasonForExtension = 'Reason for extension is required';

    return newErrors;
  };

  const onSaveAndContinue = () => {
    setGlobalFormData(prev => ({
      ...prev,
      eventDetails: details
    }));
    navigate('/create-event/items'); // absolute path
  };

  // If you submit a form, ensure submit handler uses the same:
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setGlobalFormData(prev => ({
      ...prev,
      eventDetails: details
    }));
    navigate('/create-event/items'); // absolute path
  };

  return (
    <PageWrapper>
      <Container>
        <Header>
          <h2>Event Details</h2>
          <p>Complete all sections to create your event</p>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          <SectionTitle>Event Details</SectionTitle>
          
          <FormGrid>
            {/* Day Preferred */}
            <FormGroup className="full-width">
              <Label>Day Preferred *</Label>
              <RadioGroup>
                <RadioOption className={details.dayPreferred === 'day1' ? 'selected' : ''}>
                  <input 
                    type="radio" 
                    name="dayPreferred" 
                    value="day1"
                    checked={details.dayPreferred === 'day1'}
                    onChange={(e) => handleChange('dayPreferred', e.target.value)}
                  />
                  Day 1
                </RadioOption>
                <RadioOption className={details.dayPreferred === 'day2' ? 'selected' : ''}>
                  <input 
                    type="radio" 
                    name="dayPreferred" 
                    value="day2"
                    checked={details.dayPreferred === 'day2'}
                    onChange={(e) => handleChange('dayPreferred', e.target.value)}
                  />
                  Day 2
                </RadioOption>
                <RadioOption className={details.dayPreferred === 'twoDays' ? 'selected' : ''}>
                  <input 
                    type="radio" 
                    name="dayPreferred" 
                    value="twoDays"
                    checked={details.dayPreferred === 'twoDays'}
                    onChange={(e) => handleChange('dayPreferred', e.target.value)}
                  />
                  Two Days
                </RadioOption>
              </RadioGroup>
              {errors.dayPreferred && <ErrorMessage>{errors.dayPreferred}</ErrorMessage>}
            </FormGroup>
            
            {/* Number of Rounds */}
            <FormGroup>
              <Label>Number of Rounds *</Label>
              <Input 
                type="number" 
                min="1"
                placeholder="e.g., 3"
                value={details.numberOfRounds}
                onChange={(e) => handleChange('numberOfRounds', e.target.value)}
                className={errors.numberOfRounds ? 'error' : ''}
              />
              {errors.numberOfRounds && <ErrorMessage>{errors.numberOfRounds}</ErrorMessage>}
            </FormGroup>
            
            {/* Expected Participants */}
            <FormGroup>
              <Label>Expected Number of Participants *</Label>
              <Input 
                type="number" 
                min="1"
                placeholder="e.g., 50"
                value={details.expectedParticipants}
                onChange={(e) => handleChange('expectedParticipants', e.target.value)}
                className={errors.expectedParticipants ? 'error' : ''}
              />
              {errors.expectedParticipants && <ErrorMessage>{errors.expectedParticipants}</ErrorMessage>}
            </FormGroup>
            
            {/* Duration */}
            <FormGroup>
              <Label>Duration of Event *</Label>
              <Input 
                type="text" 
                placeholder="e.g., 2 hours, 3 hours, 1 day"
                value={details.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                className={errors.duration ? 'error' : ''}
              />
              {errors.duration && <ErrorMessage>{errors.duration}</ErrorMessage>}
            </FormGroup>
            
            {/* Event Type */}
            <FormGroup className="full-width">
              <Label>Event Type *</Label>
              <RadioGroup>
                <RadioOption className={details.eventType === 'individual' ? 'selected' : ''}>
                  <input 
                    type="radio" 
                    name="eventType" 
                    value="individual"
                    checked={details.eventType === 'individual'}
                    onChange={(e) => handleChange('eventType', e.target.value)}
                  />
                  Individual
                </RadioOption>
                <RadioOption className={details.eventType === 'team' ? 'selected' : ''}>
                  <input 
                    type="radio" 
                    name="eventType" 
                    value="team"
                    checked={details.eventType === 'team'}
                    onChange={(e) => handleChange('eventType', e.target.value)}
                  />
                  Team
                </RadioOption>
              </RadioGroup>
              {errors.eventType && <ErrorMessage>{errors.eventType}</ErrorMessage>}
            </FormGroup>
            
            {/* Team Size (conditional) */}
            {details.eventType === 'team' && (
              <>
                <FormGroup>
                  <Label>Min Team Size *</Label>
                  <Input 
                    type="number" 
                    min="2"
                    placeholder="e.g., 2"
                    value={details.minTeamSize}
                    onChange={(e) => handleChange('minTeamSize', e.target.value)}
                    className={errors.minTeamSize ? 'error' : ''}
                  />
                  {errors.minTeamSize && <ErrorMessage>{errors.minTeamSize}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>Max Team Size *</Label>
                  <Input 
                    type="number" 
                    min="2"
                    placeholder="e.g., 5"
                    value={details.maxTeamSize}
                    onChange={(e) => handleChange('maxTeamSize', e.target.value)}
                    className={errors.maxTeamSize ? 'error' : ''}
                  />
                  {errors.maxTeamSize && <ErrorMessage>{errors.maxTeamSize}</ErrorMessage>}
                </FormGroup>
              </>
            )}
            
            {/* Halls Required */}
            <FormGroup>
              <Label>Halls Required *</Label>
              <Input 
                type="number" 
                min="1"
                placeholder="e.g., 2"
                value={details.hallsRequired}
                onChange={(e) => handleChange('hallsRequired', e.target.value)}
                className={errors.hallsRequired ? 'error' : ''}
              />
              {errors.hallsRequired && <ErrorMessage>{errors.hallsRequired}</ErrorMessage>}
            </FormGroup>
            
            {/* Preferred Halls */}
            <FormGroup>
              <Label>Preferred Halls *</Label>
              <Input 
                type="text" 
                placeholder="e.g., Main Auditorium, Hall A"
                value={details.preferredHalls}
                onChange={(e) => handleChange('preferredHalls', e.target.value)}
                className={errors.preferredHalls ? 'error' : ''}
              />
              {errors.preferredHalls && <ErrorMessage>{errors.preferredHalls}</ErrorMessage>}
            </FormGroup>
            
            {/* Reason for Halls */}
            <FormGroup className="full-width">
              <Label>Reason for Hall Selection *</Label>
              <TextArea 
                placeholder="Explain why you selected these halls..."
                value={details.reasonForHalls}
                onChange={(e) => handleChange('reasonForHalls', e.target.value)}
                className={errors.reasonForHalls ? 'error' : ''}
              />
              {errors.reasonForHalls && <ErrorMessage>{errors.reasonForHalls}</ErrorMessage>}
            </FormGroup>
            
            {/* Slot Selection */}
            <FormGroup className="full-width">
              <Label>Select Slot *</Label>
              <RadioGroup>
                <RadioOption className={details.slot === 'slot1' ? 'selected' : ''}>
                  <input 
                    type="radio" 
                    name="slot" 
                    value="slot1"
                    checked={details.slot === 'slot1'}
                    onChange={(e) => handleChange('slot', e.target.value)}
                  />
                  Slot 1 (9:30 AM - 12:30 PM)
                </RadioOption>
                <RadioOption className={details.slot === 'slot2' ? 'selected' : ''}>
                  <input 
                    type="radio" 
                    name="slot" 
                    value="slot2"
                    checked={details.slot === 'slot2'}
                    onChange={(e) => handleChange('slot', e.target.value)}
                  />
                  Slot 2 (1:30 PM - 4:30 PM)
                </RadioOption>
                <RadioOption className={details.slot === 'fullDay' ? 'selected' : ''}>
                  <input 
                    type="radio" 
                    name="slot" 
                    value="fullDay"
                    checked={details.slot === 'fullDay'}
                    onChange={(e) => handleChange('slot', e.target.value)}
                  />
                  Full Day
                </RadioOption>
              </RadioGroup>
              {errors.slot && <ErrorMessage>{errors.slot}</ErrorMessage>}
            </FormGroup>
            
            {/* Extension Box */}
            <FormGroup className="full-width">
              <Label>Extension Box *</Label>
              <TextArea 
                placeholder="List any extension requirements (equipment, power, etc.)..."
                value={details.extensionBox}
                onChange={(e) => handleChange('extensionBox', e.target.value)}
                className={errors.extensionBox ? 'error' : ''}
              />
              {errors.extensionBox && <ErrorMessage>{errors.extensionBox}</ErrorMessage>}
            </FormGroup>
            
            {/* Reason for Extension */}
            <FormGroup className="full-width">
              <Label>Reason for Extension Boxes *</Label>
              <TextArea 
                placeholder="Explain why you need these extensions..."
                value={details.reasonForExtension}
                onChange={(e) => handleChange('reasonForExtension', e.target.value)}
                className={errors.reasonForExtension ? 'error' : ''}
              />
              {errors.reasonForExtension && <ErrorMessage>{errors.reasonForExtension}</ErrorMessage>}
            </FormGroup>
          </FormGrid>
          
          <ButtonGroup>
            <Button type="button" onClick={() => {
              setDetails({
                dayPreferred: '',
                numberOfRounds: '',
                expectedParticipants: '',
                duration: '',
                eventType: '',
                minTeamSize: '',
                maxTeamSize: '',
                hallsRequired: '',
                preferredHalls: '',
                reasonForHalls: '',
                slot: '',
                extensionBox: '',
                reasonForExtension: ''
              });
              setErrors({});
            }}>Clear Form</Button>
            <Button type="submit" primary>Save & Continue to Items</Button>
          </ButtonGroup>
        </Form>
      </Container>
    </PageWrapper>
  );
};