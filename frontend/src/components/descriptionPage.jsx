import React from "react";
import styled from "styled-components";

const Container = styled.div`padding: 2rem; background:white; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);`;

const Input = styled.input`width:100%; padding:0.5rem; margin-bottom:1rem; border-radius:6px; border:1px solid #ccc;`;

const DescriptionPage = () => (
  <Container>
    <h2>Event Details</h2>
    <label>Event Name</label>
    <Input placeholder="Enter event name"/>
    <label>Preferred Halls</label>
    <Input placeholder="Enter hall preferences"/>
    <label>Reason</label>
    <Input placeholder="Reason for hall"/>
    <label>Extension Boxes</label>
    <Input placeholder="Extensions"/>
    <label>Slot Details</label>
    <Input placeholder="Slot timing details"/>
  </Container>
);

export default DescriptionPage;
