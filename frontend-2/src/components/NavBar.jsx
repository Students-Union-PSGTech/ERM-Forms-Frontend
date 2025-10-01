import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  background: var(--gradient-fire);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: var(--shadow-medium);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: auto;
`;

const NavLink = styled(Link)`
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border: 2px solid ${props => props.$active ? 'rgba(255, 255, 255, 0.3)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
`;

const NavBar = () => {
  const location = useLocation();
  
  return (
    <Nav>
      <Logo>Event Resource Management Form</Logo>
      <NavLinks>
        <NavLink $active={location.pathname === "/" || location.pathname === "/preview"} to="/">
          Event Preview
        </NavLink>
        <NavLink $active={location.pathname === "/details"} to="/details">
          Event Details
        </NavLink>
        <NavLink $active={location.pathname === "/items"} to="/items">
          Items
        </NavLink>
        <NavLink $active={location.pathname === "/rounds"} to="/rounds">
          Rounds
        </NavLink>
        <NavLink $active={location.pathname === "/review"} to="/review">
          Review Submit
        </NavLink>
      </NavLinks>
    </Nav>
  );
};

export default NavBar;
