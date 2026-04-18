import React, { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { FaBolt } from "react-icons/fa6";
import { TbPhoto } from "react-icons/tb";
import { FaArrowRotateRight } from "react-icons/fa6";
import Capture from "../assets/Capture.png";
import BottomSheet from "./BottomSheet";
import { useState } from "react";
import { PiSpinnerBold } from "react-icons/pi";

function Mainscreen() {
  const [reveal, showReveal] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const videoRef = useRef(null);
  let streamRef = null;
  const canvasRef = useRef(null);

  //   ========= FUNCTION TO HANDLE CLICK EVENY FROM BUTTON AND HANDLE IMAGE CAPCTURING
  const handleClickEvent = () => {
    setSpinner(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL("image/png");
    console.log("Captured Image:", imageUrl);
    setTimeout(() => {
      setSpinner(false);
      showReveal(true);
    }, 500);
    clearTimeout();
  };

  //   start video stream on component load
  useEffect(() => {
    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // back camera (mobile)
          },
          audio: false,
        });
        streamRef = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera stream error:", err);
      }
    };
    startStream();
    return () => {
      if (streamRef) {
        streamRef.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <>
      {reveal == true ? (
        <BottomSheet closeModal={() => showReveal(false)} />
      ) : (
        <></>
      )}
      <Container>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <Video
          style={{
            objectFit: "cover",
          }}
          ref={videoRef}
          autoPlay
          playsInline
        />
        <ParentWrapper>
          <img
            style={{
              top: "200px",
              position: "absolute",
            }}
            src={Capture}
          />
          <Wrapper>
            <ControlPanelParentContainer>
              <SecondaryIconWrapper>
                <TbPhoto size={25} />
              </SecondaryIconWrapper>
              <PrimaryIconWrapper
                onClick={() => {
                  handleClickEvent();
                }}
              >
                {spinner ? <SpinnerIcon /> : <FaBolt color="black" size={25} />}
              </PrimaryIconWrapper>
              <SecondaryIconWrapper>
                <FaArrowRotateRight size={25} />
              </SecondaryIconWrapper>
            </ControlPanelParentContainer>
          </Wrapper>
        </ParentWrapper>
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerIcon = styled(PiSpinnerBold)`
  font-size: 25px;
  animation: ${rotate} 1s linear infinite;
`;

const ParentWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5em;
  height: 100vh;
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 20vh;
  position: absolute;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.6) 40%,
    rgba(0, 0, 0, 0.2) 70%,
    rgba(0, 0, 0, 0) 100%
  );
`;

const ControlPanelParentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
`;
const ControlPanelContentContainer = styled.div``;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PrimaryIconWrapper = styled.button`
  width: 65px;
  height: 65px;
  border-style: solid;
  border-color: transparent;
  background: white;
  display: flex;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  transition: linear, 100ms;
  &:hover {
    transform: translateY(-1px) scale(1.03);
  }
  &:active {
    transform: scale(0.94);
    box-shadow:
      inset 0 1px 4px rgba(0, 0, 0, 0.5),
      0 3px 10px rgba(0, 0, 0, 0.3);
  }
`;

const SecondaryIconWrapper = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  /* ✨ Clear glass (less milk, more transparency) */
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);

  /* sharper edge like real glass */
  border: 1px solid rgba(255, 255, 255, 0.35);

  /* depth but tighter */
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.35),
    inset 0 0.5px 1px rgba(255, 255, 255, 0.5);

  cursor: pointer;
  transition: all 0.2s ease;

  /* 🌟 subtle light reflection (less foggy) */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 40%;
    border-radius: 50%;

    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 0.05)
    );

    opacity: 0.7;
    pointer-events: none;
  }

  /* ✨ crisp edge highlight */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;

    box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.25);
    pointer-events: none;
  }

  /* hover = slight lift (not too soft) */
  &:hover {
    transform: translateY(-1px) scale(1.03);
  }

  /* press = glass compression feel */
  &:active {
    transform: scale(0.94);
    box-shadow:
      inset 0 1px 4px rgba(0, 0, 0, 0.5),
      0 3px 10px rgba(0, 0, 0, 0.3);
  }

  svg {
    color: white;
    font-size: 20px;
    z-index: 1;
  }
`;

export default Mainscreen;
