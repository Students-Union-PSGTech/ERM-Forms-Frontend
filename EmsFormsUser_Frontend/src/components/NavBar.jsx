import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
    background: #d97706;
    color: white;
    // Changed padding to make the navbar taller vertically
    padding: 1.5rem 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    position: relative;
`;

const BackButton = styled.button`
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: #b45309;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.2s ease;

    &:hover {
        background: #92400e;
    }
`;

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const getSteps = () => [
        { path: '/create-event/preview', label: 'Event Preview' },
        { path: '/create-event/details', label: 'Event Details' },
        { path: '/create-event/items', label: 'Items' },
        { path: '/create-event/rounds', label: 'Rounds' },
        { path: '/create-event/review', label: 'Review & Submit' }
    ];

    const handleBack = () => {
        if (location.pathname === '/create-event/preview') {
            navigate('/home');
            return;
        }

        const steps = getSteps();
        const currentIndex = steps.findIndex(step => location.pathname === step.path);
        
        if (currentIndex > 0) {
            const prevStep = steps[currentIndex - 1];
            navigate(prevStep.path);
        } else {
            navigate('/home');
        }
    };

    const showBackButton = location.pathname !== '/create-event/instructions';

    return (
        <Nav>
            {showBackButton && (
                <BackButton onClick={handleBack}>
                    ← Back
                </BackButton>
            )}
        </Nav>
    );
};

export default NavBar;