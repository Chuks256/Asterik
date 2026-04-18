import React from "react";
import styled, { keyframes } from "styled-components";
import { useState } from "react";

function BottomSheet(props) {
  return (
    <>
      <Container>
        <Modal>
          <SubContainer>
            <Title>Result</Title>
            <ResultComponent>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit
              voluptatibus velit a provident cupiditate similique! Autem rem
              voluptate suscipit necessitatibus sequi. Odio facilis earum
              voluptatum. Optio tempora saepe ea ad.
            </ResultComponent>
            <CancelButton onClick={props.closeModal}>Cancel</CancelButton>
          </SubContainer>
        </Modal>
      </Container>
    </>
  );
}

const slideUp = keyframes`
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  z-index: 9999999;
  position: absolute;
  background: rgba(56, 55, 55, 0.48);
  width: 100vw;
  height: 100vh;
  animation: ${fadeIn} 0.3s ease;
`;

const SubContainer = styled.div`
  padding: 25px;
  display: flex;
  height: 67vh;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
`;
const Title = styled.h2`
  color: var(--text-color);
  font-size: 16px;
`;
const ResultComponent = styled.div`
  padding: 20px;
  background: #101017;
  height: 400px;
  border-radius: 10px;
  color: var(--text-color);
  font-size: 14px;
`;

const Modal = styled.div`
  background: #020203;
  width: 100vw;
  position: absolute;
  height: 75%;
  animation: ${slideUp} 0.35s ease-out;
  bottom: 0;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`;
const CancelButton = styled.button`
  color: var(--text-color);
  padding: 12px;
  border-style: solid;
  border-color: transparent;
  border-radius: 7px;
  width: 100%;
  font-weight: bold;
  transition: linear, 100ms;
  background: linear-gradient(to top, #7227f4 0%, #8641fe 100%);
  &:hover {
    transform: scale(0.95);
  }
`;

export default BottomSheet;
