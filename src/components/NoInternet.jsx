import React from "react";
import styled, { keyframes } from "styled-components";

//  module to check internet status
function NoInternet(props) {
  return (
    <>
      <Container
        style={{
          transform: `translateY(${props.position}px)`,
          background: `${props.bgColor}`,
        }}
      >
        <Subcontainer>
          <Text>{props.textStatus}</Text>
        </Subcontainer>
      </Container>
    </>
  );
}

const Container = styled.div`
  position: absolute;
  top: 0;
  z-index: 1;
  width: 100%;
  transition: linear, 100ms;
  height: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Subcontainer = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text-color);
`;
const Text = styled.h2`
  margin-top: 20px;
  font-size: 18px;
`;

// const rotate = keyframes`
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// `;

// const SpinnerIcon = styled(PiSpinnerBold)`
//   font-size: 25px;
//   animation: ${rotate} 1s linear infinite;
// `;

export default NoInternet;
