import React from "react";
import styled, { keyframes } from "styled-components";
import splashscrn from "../assets/splashscrn.png";
import Star from "../assets/Star.png";

function Splashscreen() {
  return (
    <Container>
      <ContentContainer>
        <AsterikLogo src={Star} />
        <InfoContainer>
          <InfoTitle>Asterik</InfoTitle>
          <InfoDesc>
            Snap, discover, analyse, take picture and make sense of the world
            around you
          </InfoDesc>
        </InfoContainer>
      </ContentContainer>
    </Container>
  );
}

export default Splashscreen;

const scaleIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  60% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const floatOrbit = keyframes`
  0% { transform: translate(0px, 0px); }
  25% { transform: translate(4px, -6px); }
  50% { transform: translate(0px, -10px); }
  75% { transform: translate(-4px, -6px); }
  100% { transform: translate(0px, 0px); }
`;

const glowPulse = keyframes`
  0% { filter: drop-shadow(0 0 0px rgba(255,255,255,0.2)); }
  50% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.5)); }
  100% { filter: drop-shadow(0 0 0px rgba(255,255,255,0.2)); }
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bgPulse = keyframes`
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  100% {
    transform: scale(1.05);
    filter: brightness(1.1);
  }
`;

//
// 🌌 Layout
//

const Container = styled.div`
  width: 100vw;
  overflow: hidden;
  height: 100vh;
  background-image: url(${splashscrn});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  animation: ${bgPulse} 6s ease-in-out infinite alternate;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

//
// 🌟 Logo (Phantom feel)
//

const AsterikLogo = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-top: 250px;
  animation:
    ${scaleIn} 1s ease-out,
    ${floatOrbit} 4s ease-in-out infinite,
    ${glowPulse} 3s ease-in-out infinite;

  animation-delay: 0s, 1s, 1s;
`;

//
// 📝 Text
//

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  margin-top: 250px;
  opacity: 0;
  animation: ${fadeUp} 1s ease forwards;
  animation-delay: 1s;
  color: var(--text-color);
`;

const InfoTitle = styled.h1`
  font-size: 16px;
  font-family: var(--secondary-font-family);
  letter-spacing: 1px;
`;

const InfoDesc = styled.p`
  font-size: 10px;
  width: 220px;
  opacity: 0.8;
`;
