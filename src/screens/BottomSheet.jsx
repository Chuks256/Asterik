import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

function BottomSheet(props) {
  const [displayText, setDisplayText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!props.inputData) return;

    const text = String(props.inputData); // 🛡️ prevents undefined issues
    let index = 0;

    setDisplayText("");

    const interval = setInterval(() => {
      setDisplayText(text.slice(0, index));
      index++;

      if (index > text.length) {
        clearInterval(interval);
      }
    }, 15); // speed control (lower = faster)

    return () => clearInterval(interval);
  }, [props.inputData]);

  // auto-scroll like chatbot
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayText]);

  return (
    <Container>
      <Modal>
        <SubContainer>
          <Title>Result</Title>

          <ResultComponent ref={scrollRef}>
            {displayText}
            <Cursor />
          </ResultComponent>

          <CancelButton onClick={props.closeModal}>Cancel</CancelButton>
        </SubContainer>
      </Modal>
    </Container>
  );
}

export default BottomSheet;

//
// ✨ ANIMATIONS
//

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

//
// 🧠 CURSOR
//

const Cursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 16px;
  background: white;
  margin-left: 4px;
  animation: ${blink} 0.8s infinite;
`;

//
// 📦 UI
//

const Container = styled.div`
  z-index: 9999999;
  position: absolute;
  background: rgba(56, 55, 55, 0.48);
  width: 100vw;
  height: 100vh;
  animation: ${fadeIn} 0.3s ease;
`;

const Modal = styled.div`
  background: #020203;
  width: 100vw;
  position: absolute;
  height: 75%;
  bottom: 0;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  animation: ${slideUp} 0.35s ease-out;
`;

const SubContainer = styled.div`
  padding: 25px;
  display: flex;
  height: 86%;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h2`
  color: white;
  font-size: 16px;
`;

//
// 📜 RESULT BOX (FIXED SCROLL + NO OVERFLOW)
//

const ResultComponent = styled.div`
  flex: 1;
  padding: 15px;
  background: #101017;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  overflow-y: auto;
  overflow-x: hidden;
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.6;
  scrollbar-width: thin;
`;

//
// 🔘 BUTTON
//

const CancelButton = styled.button`
  color: white;
  padding: 15px;
  border: none;
  border-radius: 7px;
  width: 100%;
  font-weight: bold;
  background: linear-gradient(to top, #7227f4 0%, #8641fe 100%);
  transition: 0.1s ease;

  &:active {
    transform: scale(0.95);
  }
`;
