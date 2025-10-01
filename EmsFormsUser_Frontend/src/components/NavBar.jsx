import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

    &.active {
        background: #b45309;
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
    return (
        <Nav>
            <StyledNavLink to="/create-event/preview">Event Preview</StyledNavLink>
            <StyledNavLink to="/create-event/details">Event Details</StyledNavLink>
            <StyledNavLink to="/create-event/items">Items</StyledNavLink>
            <StyledNavLink to="/create-event/rounds">Rounds</StyledNavLink>
            <StyledNavLink to="/create-event/review">Review & Submit</StyledNavLink>
        </Nav>
    );
};

export default NavBar;
