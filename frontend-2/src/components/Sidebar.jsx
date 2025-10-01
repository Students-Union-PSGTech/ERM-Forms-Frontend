import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Side = styled.div`
  width: 200px;
  background: #2563eb;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
`;

const Link = styled(NavLink)`
  color: white;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 6px;

  &.active {
    background: #1e40af;
  }
`;

export default function Sidebar() {
  return (
    <Side>
      <Link to="/">Description</Link>
      <Link to="/items">Items</Link>
      <Link to="/rounds">Rounds</Link>
      <Link to="/review">Review</Link>
    </Side>
  );
}
