import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`padding:2rem; background:white; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);`;
const Input = styled.input`width:100%; padding:0.5rem; margin-bottom:1rem; border-radius:6px; border:1px solid #ccc;`;
const Button = styled.button`padding:0.5rem 1rem; background:#2563eb; color:white; border:none; border-radius:6px; margin-right:0.5rem; &:hover{background:#1d4ed8;}`;

const RoundBlock = styled.div`margin-bottom:2rem;`;

const RoundsPage = () => {
  const [rounds,setRounds] = useState([
    {name:"Round 1", description:"", participants:" "},
    {name:"Round 2", description:"", participants:" "}
  ]);

  const handleChange=(index,key,value)=>{
    const newRounds=[...rounds];
    newRounds[index][key]=key==="participants"? Number(value):value;
    setRounds(newRounds);
  };

  const handleSubmit=()=>{console.log("Rounds submitted:",rounds); alert("Rounds submitted! Check console.");};

  return (
    <Container>
      <h2>Rounds Details</h2>
      {rounds.map((round,i)=>(
        <RoundBlock key={i}>
          <h3>{round.name}</h3>
          <label>Description</label>
          <Input value={round.description} onChange={e=>handleChange(i,"description",e.target.value)}/>
          <label>No of Participants</label>
          <Input type="number" value={round.participants} onChange={e=>handleChange(i,"participants",e.target.value)}/>
        </RoundBlock>
      ))}
      <Button onClick={handleSubmit}>Submit Rounds</Button>
    </Container>
  );
};

export default RoundsPage;
