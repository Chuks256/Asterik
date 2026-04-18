import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaBolt } from "react-icons/fa6";
import { TbPhoto } from "react-icons/tb";
import { FaArrowRotateRight } from "react-icons/fa6";
import { PiSpinnerBold } from "react-icons/pi";

import Capture from "../assets/Capture.png";
import BottomSheet from "./BottomSheet";

function Mainscreen() {
  const [reveal, showReveal] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // 📸 START CAMERA (iOS FIXED)
  useEffect(() => {
    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // 🔥 iOS REQUIREMENTS
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;

          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera stream error:", err);
      }
    };

    startStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 📸 CAPTURE IMAGE (iOS SAFE)
  const handleClickEvent = () => {
    setSpinner(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    if (video.readyState < 2) {
      console.warn("Video not ready yet");
      setSpinner(false);
      return;
    }

    const ctx = canvas.getContext("2d");

    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(video, 0, 0, width, height);

    const imageUrl = canvas.toDataURL("image/png");

    console.log("Captured Image:", imageUrl);

    setTimeout(() => {
      setSpinner(false);
      showReveal(true);
    }, 500);
  };

  return (
    <>
      {reveal && <BottomSheet closeModal={() => showReveal(false)} />}

      <Container>
        {/* hidden canvas for capture */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <Video ref={videoRef} autoPlay playsInline />

        <ParentWrapper>
          <img
            src={Capture}
            alt="overlay"
            style={{
              top: "200px",
              position: "absolute",
            }}
          />

          <Wrapper>
            <ControlPanelParentContainer>
              <SecondaryIconWrapper>
                <TbPhoto size={25} color="var(--text-color)" />
              </SecondaryIconWrapper>

              <PrimaryIconWrapper onClick={handleClickEvent}>
                {spinner ? <SpinnerIcon /> : <FaBolt color="black" size={25} />}
              </PrimaryIconWrapper>

              <SecondaryIconWrapper>
                <FaArrowRotateRight color="var(--text-color)" size={25} />
              </SecondaryIconWrapper>
            </ControlPanelParentContainer>
          </Wrapper>
        </ParentWrapper>
      </Container>
    </>
  );
}

export default Mainscreen;

//
// ⚡ ANIMATIONS
//

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SpinnerIcon = styled(PiSpinnerBold)`
  font-size: 25px;
  animation: ${rotate} 1s linear infinite;
`;

//
// 📱 LAYOUT
//

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: black;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
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

//
// 🎥 VIDEO
//

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

//
// 🎛 BUTTONS
//

const PrimaryIconWrapper = styled.button`
  width: 65px;
  height: 65px;
  background: white;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: 0.1s ease;
  &:active {
    transfrom: scale(0.95);
  }
`;

const SecondaryIconWrapper = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);

  border: 1px solid rgba(255, 255, 255, 0.35);
  cursor: pointer;
`;
