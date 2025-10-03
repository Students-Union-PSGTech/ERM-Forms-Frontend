import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
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

const Content = styled.div`
  padding: 0 2rem 2rem;
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
  min-height: 100px;
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

const EventPreview = ({ formData: globalFormData, setFormData: setGlobalFormData }) => {
  const navigate = useNavigate();
  const ctx = useOutletContext?.(); // if you rely on outlet context inside too
  const [formData, setFormData] = useState({
    // Event Name
    eventName: '',
    
    // Secretary Details
    secretary1: { name: '', rollNumber: '', mobile: '', department: '' },
    secretary2: { name: '', rollNumber: '', mobile: '', department: '' },
    
    // Convenor Details
    convenor1: { name: '', rollNumber: '', mobile: '', department: '' },
    convenor2: { name: '', rollNumber: '', mobile: '', department: '' },
    
    // Volunteer Details
    volunteer1: { name: '', rollNumber: '', mobile: '', department: '' },
    volunteer2: { name: '', rollNumber: '', mobile: '', department: '' },
    
    // Faculty Advisor Details
    facultyAdvisor: { name: '', designation: '', contact: '' },
    
    // Judge Details
    judge: { name: '', designation: '', contact: '' }
  });

  const [errors, setErrors] = useState({});

  // Load data from global state on mount
  useEffect(() => {
    if (globalFormData && globalFormData.eventPreview) {
      setFormData(globalFormData.eventPreview);
    }
  }, [globalFormData, navigate]);

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

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    // Clear error when user starts typing
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  // Ensure setFormData is available via props/context
  const normalizePerson = (p = {}) => ({
    name: p.name || '',
    rollNumber: p.rollNumber || p.roll_number || p.roll || '',
    mobile: p.mobile || p.contact || '',
    designation: p.designation || '',
    department: p.department || ''
  });

  const handlePersonChange = (roleKey, field, value) => {
    // field should be one of: 'name' | 'rollNumber' | 'mobile' | 'designation' | 'department'
    setFormData(prev => {
      const ep = prev.eventPreview || {};
      const person = normalizePerson(ep[roleKey] || {});
      const updated = { ...person, [field]: value };
      return {
        ...prev,
        eventPreview: {
          ...ep,
          [roleKey]: updated
        }
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Event Name validation
    if (!formData.eventName.trim()) newErrors['eventName'] = 'Event name is required';
    
    // Secretary validation
    if (!formData.secretary1.name.trim()) newErrors['secretary1.name'] = 'Secretary 1 name is required';
    if (!formData.secretary1.rollNumber.trim()) newErrors['secretary1.rollNumber'] = 'Secretary 1 roll number is required';
    if (!formData.secretary1.mobile.trim()) newErrors['secretary1.mobile'] = 'Secretary 1 mobile is required';
    
    if (!formData.secretary2.name.trim()) newErrors['secretary2.name'] = 'Secretary 2 name is required';
    if (!formData.secretary2.rollNumber.trim()) newErrors['secretary2.rollNumber'] = 'Secretary 2 roll number is required';
    if (!formData.secretary2.mobile.trim()) newErrors['secretary2.mobile'] = 'Secretary 2 mobile is required';
    
    // Convenor validation
    if (!formData.convenor1.name.trim()) newErrors['convenor1.name'] = 'Convenor 1 name is required';
    if (!formData.convenor1.rollNumber.trim()) newErrors['convenor1.rollNumber'] = 'Convenor 1 roll number is required';
    if (!formData.convenor1.mobile.trim()) newErrors['convenor1.mobile'] = 'Convenor 1 mobile is required';
    
    if (!formData.convenor2.name.trim()) newErrors['convenor2.name'] = 'Convenor 2 name is required';
    if (!formData.convenor2.rollNumber.trim()) newErrors['convenor2.rollNumber'] = 'Convenor 2 roll number is required';
    if (!formData.convenor2.mobile.trim()) newErrors['convenor2.mobile'] = 'Convenor 2 mobile is required';
    
    // Volunteer validation
    if (!formData.volunteer1.name.trim()) newErrors['volunteer1.name'] = 'Volunteer 1 name is required';
    if (!formData.volunteer1.rollNumber.trim()) newErrors['volunteer1.rollNumber'] = 'Volunteer 1 roll number is required';
    if (!formData.volunteer1.mobile.trim()) newErrors['volunteer1.mobile'] = 'Volunteer 1 mobile is required';
    
    if (!formData.volunteer2.name.trim()) newErrors['volunteer2.name'] = 'Volunteer 2 name is required';
    if (!formData.volunteer2.rollNumber.trim()) newErrors['volunteer2.rollNumber'] = 'Volunteer 2 roll number is required';
    if (!formData.volunteer2.mobile.trim()) newErrors['volunteer2.mobile'] = 'Volunteer 2 mobile is required';
    
    // Faculty Advisor validation
    if (!formData.facultyAdvisor.name.trim()) newErrors['facultyAdvisor.name'] = 'Faculty advisor name is required';
    if (!formData.facultyAdvisor.designation.trim()) newErrors['facultyAdvisor.designation'] = 'Faculty advisor designation is required';
    if (!formData.facultyAdvisor.contact.trim()) newErrors['facultyAdvisor.contact'] = 'Faculty advisor contact is required';
    
    // Judge validation
    if (!formData.judge.name.trim()) newErrors['judge.name'] = 'Judge name is required';
    if (!formData.judge.designation.trim()) newErrors['judge.designation'] = 'Judge designation is required';
    if (!formData.judge.contact.trim()) newErrors['judge.contact'] = 'Judge contact is required';
    
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
        eventPreview: formData
      }));
    }
    
    console.log('Event preview submitted:', formData);
    
    // Navigate to event details page
    navigate('/create-event/details'); // CHANGED from navigate('/details')
  };

  const onSaveAndContinue = () => {
    // persist any local edits into setFormData(...) first
    navigate('/create-event/details'); // absolute path prevents falling into catch-all
  };

  return (
    <PageWrapper>
      <Container>
        <Header>
          <h2>Event Preview</h2>
          <p>Enter secretary, convenor, volunteer, faculty advisor and judge details</p>
        </Header>
        
        <Form onSubmit={handleSubmit}>
          {/* Event Name */}
          <FormGrid>
            <FormGroup className="full-width">
              <Label>Event Name</Label>
              <Input 
                type="text" 
                placeholder="Enter event name..."
                value={formData.eventName}
                onChange={(e) => handleChange('eventName', e.target.value)}
                className={errors['eventName'] ? 'error' : ''}
              />
              {errors['eventName'] && <ErrorMessage>{errors['eventName']}</ErrorMessage>}
            </FormGroup>
          </FormGrid>

          {/* Secretary Details */}
          <SectionTitle>Secretary Details</SectionTitle>
          <PersonGrid>
            <PersonCard>
              <h4>Secretary 1</h4>
              <FormGroup>
                <Label>Name</Label>
                <Input 
                  type="text" 
                  placeholder="Enter name..."
                  value={formData.secretary1.name}
                  onChange={(e) => handleNestedChange('secretary1', 'name', e.target.value)}
                  className={errors['secretary1.name'] ? 'error' : ''}
                />
                {errors['secretary1.name'] && <ErrorMessage>{errors['secretary1.name']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Roll Number</Label>
                <Input 
                  type="text" 
                  placeholder="Enter roll number..."
                  value={formData.secretary1.rollNumber}
                  onChange={(e) => handleNestedChange('secretary1', 'rollNumber', e.target.value)}
                  className={errors['secretary1.rollNumber'] ? 'error' : ''}
                />
                {errors['secretary1.rollNumber'] && <ErrorMessage>{errors['secretary1.rollNumber']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Mobile No</Label>
                <Input 
                  type="tel" 
                  placeholder="Enter mobile number..."
                  value={formData.secretary1.mobile}
                  onChange={(e) => handleNestedChange('secretary1', 'mobile', e.target.value)}
                  className={errors['secretary1.mobile'] ? 'error' : ''}
                />
                {errors['secretary1.mobile'] && <ErrorMessage>{errors['secretary1.mobile']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Department</Label>
                <Input 
                  type="text" 
                  placeholder="Enter department..."
                  value={formData.secretary1.department}
                  onChange={(e) => handleNestedChange('secretary1', 'department', e.target.value)}
                />
              </FormGroup>
            </PersonCard>

            <PersonCard>
              <h4>Secretary 2</h4>
              <FormGroup>
                <Label>Name</Label>
                <Input 
                  type="text" 
                  placeholder="Enter name..."
                  value={formData.secretary2.name}
                  onChange={(e) => handleNestedChange('secretary2', 'name', e.target.value)}
                  className={errors['secretary2.name'] ? 'error' : ''}
                />
                {errors['secretary2.name'] && <ErrorMessage>{errors['secretary2.name']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Roll Number</Label>
                <Input 
                  type="text" 
                  placeholder="Enter roll number..."
                  value={formData.secretary2.rollNumber}
                  onChange={(e) => handleNestedChange('secretary2', 'rollNumber', e.target.value)}
                  className={errors['secretary2.rollNumber'] ? 'error' : ''}
                />
                {errors['secretary2.rollNumber'] && <ErrorMessage>{errors['secretary2.rollNumber']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Mobile No</Label>
                <Input 
                  type="tel" 
                  placeholder="Enter mobile number..."
                  value={formData.secretary2.mobile}
                  onChange={(e) => handleNestedChange('secretary2', 'mobile', e.target.value)}
                  className={errors['secretary2.mobile'] ? 'error' : ''}
                />
                {errors['secretary2.mobile'] && <ErrorMessage>{errors['secretary2.mobile']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Department</Label>
                <Input 
                  type="text" 
                  placeholder="Enter department..."
                  value={formData.secretary2.department}
                  onChange={(e) => handleNestedChange('secretary2', 'department', e.target.value)}
                />
              </FormGroup>
            </PersonCard>
          </PersonGrid>

          {/* Convenor Details */}
          <SectionTitle>Convenor Details</SectionTitle>
          <PersonGrid>
            <PersonCard>
              <h4>Convenor 1</h4>
              <FormGroup>
                <Label>Name</Label>
                <Input 
                  type="text" 
                  placeholder="Enter name..."
                  value={formData.convenor1.name}
                  onChange={(e) => handleNestedChange('convenor1', 'name', e.target.value)}
                  className={errors['convenor1.name'] ? 'error' : ''}
                />
                {errors['convenor1.name'] && <ErrorMessage>{errors['convenor1.name']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Roll Number</Label>
                <Input 
                  type="text" 
                  placeholder="Enter roll number..."
                  value={formData.convenor1.rollNumber}
                  onChange={(e) => handleNestedChange('convenor1', 'rollNumber', e.target.value)}
                  className={errors['convenor1.rollNumber'] ? 'error' : ''}
                />
                {errors['convenor1.rollNumber'] && <ErrorMessage>{errors['convenor1.rollNumber']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Mobile No</Label>
                <Input 
                  type="tel" 
                  placeholder="Enter mobile number..."
                  value={formData.convenor1.mobile}
                  onChange={(e) => handleNestedChange('convenor1', 'mobile', e.target.value)}
                  className={errors['convenor1.mobile'] ? 'error' : ''}
                />
                {errors['convenor1.mobile'] && <ErrorMessage>{errors['convenor1.mobile']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Department</Label>
                <Input 
                  type="text" 
                  placeholder="Enter department..."
                  value={formData.convenor1.department}
                  onChange={(e) => handleNestedChange('convenor1', 'department', e.target.value)}
                />
              </FormGroup>
            </PersonCard>

            <PersonCard>
              <h4>Convenor 2</h4>
              <FormGroup>
                <Label>Name</Label>
                <Input 
                  type="text" 
                  placeholder="Enter name..."
                  value={formData.convenor2.name}
                  onChange={(e) => handleNestedChange('convenor2', 'name', e.target.value)}
                  className={errors['convenor2.name'] ? 'error' : ''}
                />
                {errors['convenor2.name'] && <ErrorMessage>{errors['convenor2.name']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Roll Number</Label>
                <Input 
                  type="text" 
                  placeholder="Enter roll number..."
                  value={formData.convenor2.rollNumber}
                  onChange={(e) => handleNestedChange('convenor2', 'rollNumber', e.target.value)}
                  className={errors['convenor2.rollNumber'] ? 'error' : ''}
                />
                {errors['convenor2.rollNumber'] && <ErrorMessage>{errors['convenor2.rollNumber']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Mobile No</Label>
                <Input 
                  type="tel" 
                  placeholder="Enter mobile number..."
                  value={formData.convenor2.mobile}
                  onChange={(e) => handleNestedChange('convenor2', 'mobile', e.target.value)}
                  className={errors['convenor2.mobile'] ? 'error' : ''}
                />
                {errors['convenor2.mobile'] && <ErrorMessage>{errors['convenor2.mobile']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Department</Label>
                <Input 
                  type="text" 
                  placeholder="Enter department..."
                  value={formData.convenor2.department}
                  onChange={(e) => handleNestedChange('convenor2', 'department', e.target.value)}
                />
              </FormGroup>
            </PersonCard>
          </PersonGrid>

          {/* Volunteer Details */}
          <SectionTitle>Volunteer Details</SectionTitle>
          <PersonGrid>
            <PersonCard>
              <h4>Volunteer 1</h4>
              <FormGroup>
                <Label>Name</Label>
                <Input 
                  type="text" 
                  placeholder="Enter name..."
                  value={formData.volunteer1.name}
                  onChange={(e) => handleNestedChange('volunteer1', 'name', e.target.value)}
                  className={errors['volunteer1.name'] ? 'error' : ''}
                />
                {errors['volunteer1.name'] && <ErrorMessage>{errors['volunteer1.name']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Roll Number</Label>
                <Input 
                  type="text" 
                  placeholder="Enter roll number..."
                  value={formData.volunteer1.rollNumber}
                  onChange={(e) => handleNestedChange('volunteer1', 'rollNumber', e.target.value)}
                  className={errors['volunteer1.rollNumber'] ? 'error' : ''}
                />
                {errors['volunteer1.rollNumber'] && <ErrorMessage>{errors['volunteer1.rollNumber']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Mobile No</Label>
                <Input 
                  type="tel" 
                  placeholder="Enter mobile number..."
                  value={formData.volunteer1.mobile}
                  onChange={(e) => handleNestedChange('volunteer1', 'mobile', e.target.value)}
                  className={errors['volunteer1.mobile'] ? 'error' : ''}
                />
                {errors['volunteer1.mobile'] && <ErrorMessage>{errors['volunteer1.mobile']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Department</Label>
                <Input 
                  type="text" 
                  placeholder="Enter department..."
                  value={formData.volunteer1.department}
                  onChange={(e) => handleNestedChange('volunteer1', 'department', e.target.value)}
                />
              </FormGroup>
            </PersonCard>

            <PersonCard>
              <h4>Volunteer 2</h4>
              <FormGroup>
                <Label>Name</Label>
                <Input 
                  type="text" 
                  placeholder="Enter name..."
                  value={formData.volunteer2.name}
                  onChange={(e) => handleNestedChange('volunteer2', 'name', e.target.value)}
                  className={errors['volunteer2.name'] ? 'error' : ''}
                />
                {errors['volunteer2.name'] && <ErrorMessage>{errors['volunteer2.name']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Roll Number</Label>
                <Input 
                  type="text" 
                  placeholder="Enter roll number..."
                  value={formData.volunteer2.rollNumber}
                  onChange={(e) => handleNestedChange('volunteer2', 'rollNumber', e.target.value)}
                  className={errors['volunteer2.rollNumber'] ? 'error' : ''}
                />
                {errors['volunteer2.rollNumber'] && <ErrorMessage>{errors['volunteer2.rollNumber']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Mobile No</Label>
                <Input 
                  type="tel" 
                  placeholder="Enter mobile number..."
                  value={formData.volunteer2.mobile}
                  onChange={(e) => handleNestedChange('volunteer2', 'mobile', e.target.value)}
                  className={errors['volunteer2.mobile'] ? 'error' : ''}
                />
                {errors['volunteer2.mobile'] && <ErrorMessage>{errors['volunteer2.mobile']}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Department</Label>
                <Input 
                  type="text" 
                  placeholder="Enter department..."
                  value={formData.volunteer2.department}
                  onChange={(e) => handleNestedChange('volunteer2', 'department', e.target.value)}
                />
              </FormGroup>
            </PersonCard>
          </PersonGrid>

          {/* Faculty Advisor Details */}
          <SectionTitle>Faculty Advisor Details</SectionTitle>
          <PersonCard style={{marginBottom: '2rem'}}>
            <FormGroup>
              <Label>Name</Label>
              <Input 
                type="text" 
                placeholder="Enter faculty advisor name..."
                value={formData.facultyAdvisor.name}
                onChange={(e) => handleNestedChange('facultyAdvisor', 'name', e.target.value)}
                className={errors['facultyAdvisor.name'] ? 'error' : ''}
              />
              {errors['facultyAdvisor.name'] && <ErrorMessage>{errors['facultyAdvisor.name']}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>Designation</Label>
              <Input 
                type="text" 
                placeholder="Enter designation..."
                value={formData.facultyAdvisor.designation}
                onChange={(e) => handleNestedChange('facultyAdvisor', 'designation', e.target.value)}
                className={errors['facultyAdvisor.designation'] ? 'error' : ''}
              />
              {errors['facultyAdvisor.designation'] && <ErrorMessage>{errors['facultyAdvisor.designation']}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>Contact Details</Label>
              <Input 
                type="text" 
                placeholder="Enter contact details..."
                value={formData.facultyAdvisor.contact}
                onChange={(e) => handleNestedChange('facultyAdvisor', 'contact', e.target.value)}
                className={errors['facultyAdvisor.contact'] ? 'error' : ''}
              />
              {errors['facultyAdvisor.contact'] && <ErrorMessage>{errors['facultyAdvisor.contact']}</ErrorMessage>}
            </FormGroup>
          </PersonCard>

          {/* Judge Details */}
          <SectionTitle>Judge Details</SectionTitle>
          <PersonCard style={{marginBottom: '2rem'}}>
            <FormGroup>
              <Label>Name</Label>
              <Input 
                type="text" 
                placeholder="Enter judge name..."
                value={formData.judge.name}
                onChange={(e) => handleNestedChange('judge', 'name', e.target.value)}
                className={errors['judge.name'] ? 'error' : ''}
              />
              {errors['judge.name'] && <ErrorMessage>{errors['judge.name']}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>Designation</Label>
              <Input 
                type="text" 
                placeholder="Enter designation..."
                value={formData.judge.designation}
                onChange={(e) => handleNestedChange('judge', 'designation', e.target.value)}
                className={errors['judge.designation'] ? 'error' : ''}
              />
              {errors['judge.designation'] && <ErrorMessage>{errors['judge.designation']}</ErrorMessage>}
            </FormGroup>
            <FormGroup>
              <Label>Contact Details</Label>
              <Input 
                type="text" 
                placeholder="Enter contact details..."
                value={formData.judge.contact}
                onChange={(e) => handleNestedChange('judge', 'contact', e.target.value)}
                className={errors['judge.contact'] ? 'error' : ''}
              />
              {errors['judge.contact'] && <ErrorMessage>{errors['judge.contact']}</ErrorMessage>}
            </FormGroup>
          </PersonCard>
          
          <ButtonGroup>
            <Button type="button" onClick={() => {
              setFormData({
                secretary1: { name: '', rollNumber: '', mobile: '', department: '' },
                secretary2: { name: '', rollNumber: '', mobile: '', department: '' },
                convenor1: { name: '', rollNumber: '', mobile: '', department: '' },
                convenor2: { name: '', rollNumber: '', mobile: '', department: '' },
                volunteer1: { name: '', rollNumber: '', mobile: '', department: '' },
                volunteer2: { name: '', rollNumber: '', mobile: '', department: '' },
                facultyAdvisor: { name: '', designation: '', contact: '' },
                judge: { name: '', designation: '', contact: '' }
              });
              setErrors({});
            }}>Clear Form</Button>
            <Button type="submit" primary>Save & Continue</Button>
          </ButtonGroup>
        </Form>
      </Container>
    </PageWrapper>
  );
};

export default EventPreview;