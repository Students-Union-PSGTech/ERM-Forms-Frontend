import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useOutletContext } from 'react-router-dom';

const Nav = styled.nav`
    background: #d97706;
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    position: relative;
`;

const StyledNavLink = styled(NavLink)`
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s ease;

    &.active {
        background: #b45309;
    }

    &:hover {
        background: rgba(180, 83, 9, 0.8);
    }

    &.disabled {
        opacity: 0.5;
        pointer-events: none;
        cursor: not-allowed;
    }
`;

const BackButton = styled.button`
    position: absolute;
    left: 1rem;
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
    const { isAuthenticated } = useAuth();
    const context = useOutletContext();
    const { formData, agreedToInstructions } = context || {};

    const getSteps = () => [
        { path: '/create-event/preview', label: 'Event Preview' },
        { path: '/create-event/details', label: 'Event Details' },
        { path: '/create-event/items', label: 'Items' },
        { path: '/create-event/rounds', label: 'Rounds' },
        { path: '/create-event/review', label: 'Review & Submit' }
    ];

    const handleBack = () => {
        // Special case for preview page - go back to home
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

    const canAccessPreview = agreedToInstructions;
    const canAccessDetails = canAccessPreview && formData?.description?.title;
    const canAccessItems = canAccessDetails && formData?.description?.startDate && formData?.description?.endDate;
    const canAccessRounds = canAccessItems && formData?.items?.length > 0;
    const canAccessReview = canAccessRounds && formData?.rounds?.length > 0;

    const handleNavigation = (e, condition, path) => {
        if (!condition) {
            e.preventDefault();
            console.log('Navigation prevented to:', path);
            console.log('Reason: Conditions not met');
            return;
        }

        if (!isAuthenticated) {
            e.preventDefault();
            console.log('Navigation prevented: Not authenticated');
            navigate('/login');
            return;
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
            <StyledNavLink 
                to="/create-event/preview" 
                className={canAccessPreview ? '' : 'disabled'}
                onClick={(e) => handleNavigation(e, canAccessPreview, '/create-event/preview')}
            >
                Event Preview
            </StyledNavLink>
            <StyledNavLink 
                to="/create-event/details" 
                className={canAccessDetails ? '' : 'disabled'}
                onClick={(e) => handleNavigation(e, canAccessDetails, '/create-event/details')}
            >
                Event Details
            </StyledNavLink>
            <StyledNavLink 
                to="/create-event/items" 
                className={canAccessItems ? '' : 'disabled'}
                onClick={(e) => handleNavigation(e, canAccessItems, '/create-event/items')}
            >
                Items
            </StyledNavLink>
            <StyledNavLink 
                to="/create-event/rounds" 
                className={canAccessRounds ? '' : 'disabled'}
                onClick={(e) => handleNavigation(e, canAccessRounds, '/create-event/rounds')}
            >
                Rounds
            </StyledNavLink>
            <StyledNavLink 
                to="/create-event/review" 
                className={canAccessReview ? '' : 'disabled'}
                onClick={(e) => handleNavigation(e, canAccessReview, '/create-event/review')}
            >
                Review & Submit
            </StyledNavLink>
        </Nav>
    );
};

export default NavBar;
