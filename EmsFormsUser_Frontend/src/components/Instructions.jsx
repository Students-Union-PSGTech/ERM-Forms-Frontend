import React, { useState } from "react";
import { useNavigate, useOutletContext } from 'react-router-dom';
import styled, { keyframes } from "styled-components";

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${props => props.closing ? slideUp : slideDown} 0.5s ease-in-out;
`;

const InstructionsContainer = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
`;

const Header = styled.div`
  background: var(--gradient-fire);
  color: white;
  padding: 2rem;
  border-radius: 20px 20px 0 0;
  text-align: center;
  
  h1 {
    font-size: 2rem;
    margin: 0;
    color: white;
    font-weight: 700;
  }
  
  p {
    margin: 0.5rem 0 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }
`;

const Content = styled.div`
  padding: 2rem;
`;

const ImportantBox = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid var(--flame-gold);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    color: var(--flame-deep-red);
    font-size: 1.3rem;
    margin: 0 0 1rem 0;
    font-weight: 600;
  }
  
  ul {
    margin: 0;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      font-weight: 500;
      line-height: 1.5;
    }
  }
`;

const InstructionsSection = styled.div`
  h2 {
    color: var(--text-primary);
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      margin-bottom: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 10px;
      border-left: 4px solid var(--flame-orange);
      color: var(--text-primary);
      line-height: 1.6;
      font-size: 1rem;
      
      &:hover {
        background: #f1f5f9;
        transform: translateX(4px);
        transition: all 0.3s ease;
      }
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  border-top: 1px solid var(--border-light);
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  transition: all 0.3s ease;
  cursor: pointer;
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

const ContactInfo = styled.div`
  background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
  border: 2px solid #0284c7;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  text-align: center;
  
  p {
    margin: 0;
    color: #0c4a6e;
    font-weight: 500;
    font-size: 1rem;
  }
`;

const EmailLink = styled.a`
  color: #0284c7;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
  
  &:hover {
    color: #0369a1;
    border-bottom-color: #0369a1;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  padding: 1rem;
  background: white;
  border: 2px solid var(--border-light);
  border-radius: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--flame-orange);
    background: #fefefe;
  }
  
  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: var(--flame-orange);
    cursor: pointer;
  }
  
  label {
    font-weight: 500;
    color: var(--text-primary);
    cursor: pointer;
    font-size: 1rem;
  }
`;

const Instructions = () => {
    const navigate = useNavigate();
    const { setAgreedToInstructions } = useOutletContext() || {};
    const [agreed, setAgreed] = useState(false);
    const [closing, setClosing] = useState(false);

    const handleAgree = () => {
        if (agreed) {
            setAgreedToInstructions?.(true); // persist agreement for guard
            setClosing(true);
            setTimeout(() => {
                navigate('/create-event/preview');
            }, 500);
        }
    };

    return (
        <Overlay closing={closing}>
            <InstructionsContainer>
                <Header>
                    <h1>Instructions to be Read Before Filling the Form</h1>
                    <p>Please read all instructions carefully before proceeding</p>
                </Header>
                
                <Content>
                    <ImportantBox>
                        <h3>Important:</h3>
                        <ul>
                            <li>If two different events are to be conducted, then fill the above form for each event separately and submit it.</li>
                            <li>If the same event continues on both the days (i.e., Preliminary round on the first day and final round on the second day), then fill the needed requirements in the same form.</li>
                        </ul>
                    </ImportantBox>
                    
                    <InstructionsSection>
                        <h2>Instructions:</h2>
                        <ul>
                            <li>Not all the events and workshops submitted will be approved.</li>
                            <li>Maximum of two events, one workshop, one paper presentation can be proposed.</li>
                            <li>Events and workshops should be innovative or based on the trending new technologies relating to the respective stream.</li>
                            <li>Judges must be present throughout the duration of the event.</li>
                            <li>No cash prize, memento, or any other form of prizes should be given by clubs/associations to the event winners.</li>
                            <li>Memento for the external chief guest will be provided by the Students Union if filled in the items required table.</li>
                            <li>Certificates to the winners, runners, convenors, and volunteers of each event will be provided by the Students Union.</li>
                            <li>If any materials are required prior to the day of the event, please mention "Required in advance" near that material in the "Item Name" column.</li>
                            <li>Halls will be allotted based on availability.</li>
                            <li>The projector will not be provided by the Students Union. Use the projector available in the hall.</li>
                            <li>Winner and runner details should be submitted within one hour from the end of the event.</li>
                            <li>HDMI cables/VGA converter will not be provided.</li>
                            <li>Take enough copies of the form for your reference.</li>
                            <li>Further changes are not accepted.</li>
                            <li>Submit it to the point of contact allotted to your club/association.</li>
                            <li>For more details, contact your respective point of contact.</li>
                        </ul>
                    </InstructionsSection>
                    
                    <CheckboxContainer>
                        <input 
                          type="checkbox" 
                          id="agree" 
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <label htmlFor="agree">I agree to the terms and conditions</label>
                    </CheckboxContainer>
                    
                    {!agreed && (
                        <div style={{
                          padding: '1rem',
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: '8px',
                          color: '#991b1b',
                          textAlign: 'center',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>
                          You must agree to the terms and conditions to proceed with the form.
                        </div>
                    )}
                    
                    <ContactInfo>
                      <p>For any clarifications, feel free to <EmailLink href="mailto:studentsunion@psgtech.ac.in">Contact the Students Union</EmailLink>.</p>
                    </ContactInfo>
                </Content>
                
                <ButtonGroup>
                  {agreed && (
                    <Button 
                      primary 
                      onClick={handleAgree}
                    >
                      Proceed
                    </Button>
                  )}
                </ButtonGroup>
            </InstructionsContainer>
        </Overlay>
    );
};

export default Instructions;