import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
    background: #d97706;
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
`;

const StyledNavLink = styled(NavLink)`
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;

    &.active {
        background: #b45309;
    }
`;

const NavBar = () => {
    return (
        <Nav>
            {/* Use absolute nested routes to avoid mis-resolution */}
            <StyledNavLink to="/create-event/preview">Event Preview</StyledNavLink>
            <StyledNavLink to="/create-event/details">Event Details</StyledNavLink>
            <StyledNavLink to="/create-event/items">Items</StyledNavLink>
            <StyledNavLink to="/create-event/rounds">Rounds</StyledNavLink>
            <StyledNavLink to="/create-event/review">Review & Submit</StyledNavLink>
        </Nav>
    );
};

export default NavBar;
