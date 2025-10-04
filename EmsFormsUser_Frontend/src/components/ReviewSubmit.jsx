import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
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

const FileUploadSection = styled.div`
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

// Modified FileUploadArea to use $isDragging instead of isDragging
const FileUploadArea = styled.div`
  padding: 2rem;
  border: 2px dashed var(--border-light);
  border-radius: 12px;
  margin: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.$isDragging ? `
    background: rgba(234, 88, 12, 0.05);
    border-color: var(--flame-orange);
  ` : ''}
  
  &:hover {
    background: #f8fafc;
  }
  
  input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;

const UploadIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--flame-orange);
`;

const UploadText = styled.div`
  margin-bottom: 1rem;
  
  h4 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
  
  p {
    color: var(--text-secondary);
  }
`;

const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--gradient-fire);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-flame);
  }
`;

const FilePreviewList = styled.div`
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const FilePreview = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 4px solid var(--flame-orange);
  
  .file-info {
    overflow: hidden;
    
    .file-name {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .file-size {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
  }
  
  .remove-file {
    background: #fee2e2;
    color: #b91c1c;
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    
    &:hover {
      background: #fecaca;
      transform: scale(1.1);
    }
  }
`;

const FileError = styled.div`
  color: #b91c1c;
  background: #fee2e2;
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const ReviewSubmit = ({ formData, setFormData /* ...existing props... */ }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Extract data from different sections
  const eventPreview = formData.eventPreview || {};
  const eventDetails = formData.eventDetails || {};
  const rounds = formData.rounds || [];
  const eventOverview = formData.eventOverview || {};
  const items = formData.items || [];

  const totalCost = items?.reduce((sum, item) => sum + (item.price_per_unit * item.quantity), 0) || 0;
  const totalParticipants = formData.eventDetails.expectedParticipants;

  // Helper to map frontend person fields to backend schema (snake_case)
  const toPerson = (p = {}) => ({
    name: p.name || '',
    roll_number: p.rollNumber || p.roll_number || '',
    mobile: p.mobile || p.contact || '',
    designation: p.designation || '',
    department: p.department || '',
    year: p.year || ''
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
  };

  const validateAndAddFiles = (selectedFiles) => {
    setFileError('');
    
    // Check if adding these files would exceed the limit
    if (files.length + selectedFiles.length > 5) {
      setFileError('Maximum 5 files allowed');
      return;
    }
    
    const validFiles = [];
    
    for (const file of selectedFiles) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setFileError(`File "${file.name}" exceeds the 10MB size limit`);
        continue;
      }
      
      // Validate file type (only allow PDF files)
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!['pdf'].includes(fileExtension)) {
        setFileError(`File "${file.name}" has invalid format. Only PDF files are allowed.`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setFileError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();

    // Ask for confirmation
    const ok = window.confirm('Are you sure you want to submit this event?');
    if (!ok) return;

    try {
      setSubmitting(true);

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
          rules: Array.isArray(r?.rules) ? r.rules.filter(Boolean) : [],
          participants: r?.participants || 0,
          hasTieBreaker: r?.hasTieBreaker || false,
          tieBreaker: r?.hasTieBreaker ? r.tieBreaker : undefined
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
      
      // Create a FormData object with a different name to avoid conflicts
      const uploadFormData = new FormData();
      
      // Append the JSON payload as a string
      uploadFormData.append('payload', JSON.stringify(payload));
      
      // Append each file
      files.forEach((file) => {
        uploadFormData.append('annexure', file);
      });
      
      // Update the API call to send FormData
      await createEvent(uploadFormData);
      
      sessionStorage.removeItem("createEventFormData");
      navigate('/my-events', { state: { success: true, message: 'Event created successfully!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setSubmitting(false);
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
                  <small>Roll: {eventPreview.secretary1?.rollNumber || "N/A"} | Mobile: {eventPreview.secretary1?.mobile || "N/A"} | Dept: {eventPreview.secretary1?.department || "N/A"} | Year: {eventPreview.secretary1?.year || "N/A"}</small>
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Secretary 2</div>
                <div className="value">
                  {eventPreview.secretary2?.name || "Not specified"}<br/>
                  <small>Roll: {eventPreview.secretary2?.rollNumber || "N/A"} | Mobile: {eventPreview.secretary2?.mobile || "N/A"} | Dept: {eventPreview.secretary2?.department || "N/A"} | Year: {eventPreview.secretary2?.year || "N/A"}</small>
                </div>
              </InfoItem>
            </InfoGrid>
            
            <h4 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)'}}>Convenor Details</h4>
            <InfoGrid>
              <InfoItem>
                <div className="label">Convenor 1</div>
                <div className="value">
                  {eventPreview.convenor1?.name || "Not specified"}<br/>
                  <small>Roll: {eventPreview.convenor1?.rollNumber || "N/A"} | Mobile: {eventPreview.convenor1?.mobile || "N/A"} | Dept: {eventPreview.convenor1?.department || "N/A"} | Year: {eventPreview.convenor1?.year || "N/A"}</small>
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Convenor 2</div>
                <div className="value">
                  {eventPreview.convenor2?.name || "Not specified"}<br/>
                  <small>Roll: {eventPreview.convenor2?.rollNumber || "N/A"} | Mobile: {eventPreview.convenor2?.mobile || "N/A"} | Dept: {eventPreview.convenor2?.department || "N/A"} | Year: {eventPreview.convenor2?.year || "N/A"}</small>
                </div>
              </InfoItem>
            </InfoGrid>
            
            <h4 style={{marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)'}}>Volunteer Details</h4>
            <InfoGrid>
              <InfoItem>
                <div className="label">Volunteer 1</div>
                <div className="value">
                  {eventPreview.volunteer1?.name || "Not specified"}<br/>
                  <small>Roll: {eventPreview.volunteer1?.rollNumber || "N/A"} | Mobile: {eventPreview.volunteer1?.mobile || "N/A"} | Dept: {eventPreview.volunteer1?.department || "N/A"} | Year: {eventPreview.volunteer1?.year || "N/A"}</small>
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Volunteer 2</div>
                <div className="value">
                  {eventPreview.volunteer2?.name || "Not specified"}<br/>
                  <small>Roll: {eventPreview.volunteer2?.rollNumber || "N/A"} | Mobile: {eventPreview.volunteer2?.mobile || "N/A"} | Dept: {eventPreview.volunteer2?.department || "N/A"} | Year: {eventPreview.volunteer2?.year || "N/A"}</small>
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
                {rounds.flatMap((round, idx) => {
                  const roundCards = [(
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
                          <div className="count">{round.participants}</div>
                          <div className="label">Participants</div>
                        </div>
                      </div>
                    </RoundCard>
                  )];

                  if (round.hasTieBreaker && round.tieBreaker) {
                    roundCards.push(
                      <RoundCard key={`${idx}-tiebreaker`} style={{borderColor: 'var(--flame-gold)', marginLeft: '2rem'}}>
                        <div className="round-name">{round.tieBreaker.name}</div>
                        <div className="round-info">
                          <div className="description">
                            <strong>Description:</strong><br/>
                            {round.tieBreaker.description || "No description provided"}
                            {round.tieBreaker.rules && round.tieBreaker.rules.length > 0 && (
                              <>
                                <br/><br/><strong>Rules:</strong>
                                <ul style={{margin: '0.5rem 0', paddingLeft: '1.5rem'}}>
                                  {round.tieBreaker.rules.map((rule, ruleIdx) => (
                                    <li key={ruleIdx} style={{marginBottom: '0.25rem'}}>{rule}</li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      </RoundCard>
                    );
                  }
                  
                  return roundCards;
                })}
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

        {/* File Upload Section */}
        <FileUploadSection>
          <SectionHeader>
            <h3>Upload Annexure (Optional)</h3>
          </SectionHeader>
          <SectionContent>
            <FileUploadArea 
              $isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf"
              />
              <UploadIcon>📄</UploadIcon>
              <UploadText>
                <h4>Drag and drop or click to upload</h4>
                <p>Upload up to 5 documents (Max 10MB each)</p>
                <p>Accepted format: PDF</p>
              </UploadText>
              <UploadButton>Choose Files</UploadButton>
            </FileUploadArea>
            
            {fileError && <FileError>{fileError}</FileError>}
            
            {files.length > 0 && (
              <FilePreviewList>
                {files.map((file, index) => (
                  <FilePreview key={index}>
                    <div className="file-info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">{formatFileSize(file.size)}</div>
                    </div>
                    <button 
                      className="remove-file" 
                      onClick={() => removeFile(index)}
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  </FilePreview>
                ))}
              </FilePreviewList>
            )}
          </SectionContent>
        </FileUploadSection>

        {/* Submit Section */}
        <ActionSection>
          {error && (
            <div className="error-message" style={{color: '#b91c1c', marginBottom: '1rem'}}>
              {error}
            </div>
          )}

          <div className="button-container">
            <SubmitButton 
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Event Form'}
            </SubmitButton>
          </div>
        </ActionSection>
      </Container>
    </PageWrapper>
  );
};

export default ReviewSubmit;
