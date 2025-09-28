import React from "react";
import styled from "styled-components";

const ProgressContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Step = styled.div`
  flex: 1;
  padding: 0.5rem;
  text-align: center;
  background: ${(props) => (props.active ? "#0077b6" : "#e0e0e0")};
  color: ${(props) => (props.active ? "white" : "black")};
  border-radius: 5px;
`;

export default function StepProgress({ currentStep, totalSteps }) {
  return (
    <ProgressContainer>
      {[...Array(totalSteps)].map((_, i) => (
        <Step key={i} active={i === currentStep}>
          Round {i + 1}
        </Step>
      ))}
    </ProgressContainer>
  );
}
