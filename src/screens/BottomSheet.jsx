import React, { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

function BottomSheet({ inputData, closeModal, currentWordIndex }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const activeWord = scrollRef.current?.querySelector(".active-word");
    if (activeWord) {
      activeWord.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentWordIndex]);

  const words = String(inputData || "").split(" ");

  return (
    <Container>
      <Modal>
        <SubContainer>
          <Title>Result</Title>

          <ResultComponent ref={scrollRef}>
            {words.map((word, index) => (
              <Word
                key={index}
                className={index === currentWordIndex ? "active-word" : ""}
                $isHighlighted={index === currentWordIndex}
              >
                {word}
              </Word>
            ))}
            <Cursor />
          </ResultComponent>

          <CancelButton onClick={closeModal}>Cancel</CancelButton>
        </SubContainer>
      </Modal>
    </Container>
  );
}

export default BottomSheet;

// --- STYLES ---

const Word = styled.span`
  transition: all 0.1s ease-in-out;
  background: ${(props) => (props.$isHighlighted ? "#7227f4" : "transparent")};
  color: ${(props) => (props.$isHighlighted ? "white" : "#999")};
  font-weight: ${(props) => (props.$isHighlighted ? "bold" : "normal")};
  border-radius: 3px;
  padding: 0 2px;
  margin: 2px;
  display: inline-block;
  letter-spacing: ${(props) => (props.$isHighlighted ? "-0.2px" : "normal")};
`;

const ResultComponent = styled.div`
  flex: 1;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  word-break: break-word;
  white-space: normal;
  line-height: 1.6;
  letter-spacing: -0.1px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const slideUp = keyframes`
  0% { transform: translateY(100%); }
  100% { transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 16px;
  background: #7227f4;
  margin-left: 2px;
  animation: ${blink} 0.8s infinite;
  vertical-align: middle;
`;

const Container = styled.div`
  z-index: 9999999;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(55, 54, 54, 0.76);
  width: 100vw;
  height: 100vh;
  animation: ${fadeIn} 0.3s ease;
`;

const Modal = styled.div`
  background: linear-gradient(
    to bottom,
    #020203 0%,
    #020203 20%,
    #020203 40%,
    #020203 60%,
    #020203 65%,
    #8641fe 100%
  );
  width: 100vw;
  position: absolute;
  height: 80%;
  bottom: 0;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  animation: ${slideUp} 0.35s ease-out;
`;

const SubContainer = styled.div`
  padding: 26px;
  display: flex;
  height: 86%;
  flex-direction: column;
  gap: 15px;
`;

const Title = styled.h2`
  color: white;
  font-size: 16px;
  margin-bottom: 5px;
`;

const CancelButton = styled.button`
  color: var(--text-color);
  padding: 15px;
  border: none;
  border-radius: 12px;
  width: 100%;
  font-weight: bold;
  font-size: 16px;
  background: linear-gradient(to top, #7227f4 0%, #8641fe 100%);
  transition: 0.1s ease;
  cursor: pointer;
  &:active {
    transform: scale(0.96);
  }
`;
