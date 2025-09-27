import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  background: #2563eb;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  gap: 1.5rem;
`;

const NavBar = () => (
  <Nav>
    <Link style={{ color: "white" }} to="/">Description</Link>
    <Link style={{ color: "white" }} to="/items">Items</Link>
    <Link style={{ color: "white" }} to="/rounds">Rounds</Link>
    <Link style={{ color: "white" }} to="/review">Review</Link>
  </Nav>
);

export default NavBar;
