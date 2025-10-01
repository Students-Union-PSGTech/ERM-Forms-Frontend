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
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;

const Form = styled.form`
  padding: 0 2rem 2rem;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  .full-width {
    grid-column: 1 / -1;
  }
`;

const PersonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PersonCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  
  h4 {
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: var(--flame-orange);
    box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.1);
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
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: var(--flame-orange);
    box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.1);
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
  cursor: pointer;
  border: 2px solid transparent;
  
  ${props => props.primary ? `
    background: var(--gradient-fire);
    color: white;
    border-color: transparent;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }
  ` : `
    background: white;
    color: var(--text-primary);
    border-color: var(--border-light);
    
    &:hover {
      border-color: var(--flame-orange);
      color: var(--flame-orange);
      transform: translateY(-1px);
    }
  `}
`;

const DescriptionPage = ({ formData: globalFormData, setFormData: setGlobalFormData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Event Details Only
    eventName: '',
    preferredHalls: '',
    reason: '',
    extensions: '',
    slotDetails: ''
  });

  const [errors, setErrors] = useState({});

  // Load data from global state on mount
  useEffect(() => {
    if (globalFormData && globalFormData.eventDetails) {
      setFormData(globalFormData.eventDetails);
    }
  }, [globalFormData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
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
    
    // Basic event details validation
    if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required';
    if (!formData.preferredHalls.trim()) newErrors.preferredHalls = 'Preferred halls is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason for hall selection is required';
    if (!formData.slotDetails.trim()) newErrors.slotDetails = 'Slot details is required';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      // Scroll to first error
      const firstErrorElement = document.querySelector('.error');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Update global form data
    if (setGlobalFormData) {
      setGlobalFormData(prev => ({
        ...prev,
        eventDetails: formData
      }));
    }
    
    console.log('Event details submitted:', formData);
    
    // Navigate to event preview page
    navigate('/preview');
  };

  return (
    <PageWrapper>
      <Container>
        <Header>
          <h2>Event Details</h2>
          <p>Complete all sections to create your event</p>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          {/* Basic Event Details */}
          <SectionTitle>Basic Event Information</SectionTitle>
          <FormGrid>
            <FormGroup className="full-width">
              <Label>Event Name</Label>
              <Input 
                type="text" 
                placeholder="Enter your event name..."
                value={formData.eventName}
                onChange={(e) => handleChange('eventName', e.target.value)}
                className={errors.eventName ? 'error' : ''}
              />
              {errors.eventName && <ErrorMessage>{errors.eventName}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup className="full-width">
              <Label>Preferred Halls</Label>
              <Input 
                type="text" 
                placeholder="Specify your preferred halls..."
                value={formData.preferredHalls}
                onChange={(e) => handleChange('preferredHalls', e.target.value)}
                className={errors.preferredHalls ? 'error' : ''}
              />
              {errors.preferredHalls && <ErrorMessage>{errors.preferredHalls}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup className="full-width">
              <Label>Extensions Required</Label>
              <Input 
                type="text" 
                placeholder="List any extensions needed..."
                value={formData.extensions}
                onChange={(e) => handleChange('extensions', e.target.value)}
              />
            </FormGroup>
            
            <FormGroup className="full-width">
              <Label>Reason for Hall Selection</Label>
              <TextArea 
                placeholder="Tell us why you chose this hall..."
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                className={errors.reason ? 'error' : ''}
              />
              {errors.reason && <ErrorMessage>{errors.reason}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup className="full-width">
              <Label>Slot Details</Label>
              <TextArea 
                placeholder="Specify timing and slot details..."
                value={formData.slotDetails}
                onChange={(e) => handleChange('slotDetails', e.target.value)}
                className={errors.slotDetails ? 'error' : ''}
              />
              {errors.slotDetails && <ErrorMessage>{errors.slotDetails}</ErrorMessage>}
            </FormGroup>
          </FormGrid>

          
          <ButtonGroup>
            <Button type="button" onClick={() => {
              setFormData({
                eventName: '', preferredHalls: '', reason: '', extensions: '', slotDetails: ''
              });
              setErrors({});
            }}>Clear Form</Button>
            <Button type="submit" primary>Save & Continue to Preview</Button>
          </ButtonGroup>
        </Form>
      </Container>
    </PageWrapper>
  );
};

export default DescriptionPage;