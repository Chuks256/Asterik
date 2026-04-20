import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaBolt } from "react-icons/fa6";
import { TbPhoto } from "react-icons/tb";
import { FaArrowRotateRight } from "react-icons/fa6";
import { PiSpinnerBold } from "react-icons/pi";
import axios from "axios";
import Capture from "../assets/Capture.png";
import BottomSheet from "./BottomSheet";
import SpeechManager from "../utils/SpeechManager";
import NoInternet from "../components/NoInternet";

function Mainscreen() {
  const [reveal, showReveal] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [direction, setDirection] = useState("environment");
  const [data, setData] = useState("no data at the moment");
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [is_dev, set_is_dev] = useState(false);
  const [no_internet_status, set_no_internet_status] = useState({
    text: "Internet Connection Available",
    status: false,
  });
  const [position, setPosition] = useState("-100");

  //@ FUNCTION TO CHECK INTERNET AVAILABILITY
  const checkInternetAvailability = async () => {
    try {
      const url = "https://asterik-backend.onrender.com/api/v1/checkHealth";
      const response = await axios.get(url);
      if (response) {
        return true;
      }
    } catch (err) {
      return false;
    }
  };

  // 📸 CAMERA (iOS PWA FIXED VERSION)
  useEffect(() => {
    const startCamera = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.setAttribute("webkit-playsinline", true);
        video.muted = true;
        video.onloadedmetadata = async () => {
          try {
            await video.play();
          } catch (err) {
            console.error("Video play failed:", err);
          }
        };
      } catch (err) {
        console.error("Camera error:", err);
      }
    };
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // //////////////////////////////////////////////////////////////////

  // //////////////////////////////////////////////////////////////////
  // 📸 CAPTURE IMAGE
  const handleClickEvent = async () => {
    setSpinner(true);
    await SpeechManager.coldStartSpeechUtterance(); // COLD START SPEECH MANAGER CLASS
    const video = videoRef.current;
    video.pause();
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL("image/jpeg", 0.4);
    const isInternetAvailable = await checkInternetAvailability();
    if (isInternetAvailable === false) {
      video.play();
      set_no_internet_status({
        text: "No Internet Connection",
        status: true,
      });
      setPosition("0");
      setTimeout(() => {
        setSpinner(false);
        set_no_internet_status({
          text: "Internet Connection Available",
          status: false,
        });
        setPosition("-100");
      }, 3000);
      clearTimeout();
      return;
    } else {
      try {
        const payload = { input: imageUrl };
        const response = await axios.post(
          is_dev === true
            ? "http://localhost:3453/api/v1/scanDocument"
            : "https://asterik-backend.onrender.com/api/v1/scanDocument",
          payload,
        );
        console.log(response, payload);
        if (response.data.msg) {
          setData(response.data.msg);
          setTimeout(async () => {
            setSpinner(false);
            showReveal(true);
            SpeechManager.useBrowserInbuiltTTS(
              response.data.msg,
              (index) => setCurrentWordIndex(index), // onWordBoundary
              () => setCurrentWordIndex(-1), // onEnd
            );
          }, 500);
          clearTimeout();
        } else if (response.data.error) {
          alert(response.data.error);
        }
      } catch (err) {
        console.log(err);
        alert("something went wrong");
        try {
          setSpinner(false);
          await video.play();
        } catch (err) {
          console.error("Video play failed:", err);
        }
      }
    }
  };
  // ////////////////////////////////////////////////////////////////////
  return (
    <>
      {/* @ BottomSheet component  */}
      {reveal && (
        <BottomSheet
          inputData={data}
          currentWordIndex={currentWordIndex} // <-- ADD THIS LINE
          closeModal={() => {
            window.speechSynthesis.cancel();
            setCurrentWordIndex(-1); // Reset the highlight
            videoRef.current?.play();
            showReveal(false);
          }}
        />
      )}
      {no_internet_status.status === true ? (
        <NoInternet
          position={position}
          textStatus="No Internet Connection"
          bgColor="red"
        />
      ) : (
        <></>
      )}
      <Container>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <Video ref={videoRef} autoPlay playsInline muted />
        <ParentWrapper>
          <img
            src={Capture}
            alt="overlay"
            style={{ top: "200px", position: "absolute" }}
          />
          <Wrapper>
            <ControlPanelParentContainer>
              <SecondaryIconWrapper>
                <TbPhoto color="var(--text-color)" size={25} />
              </SecondaryIconWrapper>
              <PrimaryIconWrapper onClick={handleClickEvent}>
                {spinner ? <SpinnerIcon /> : <FaBolt size={25} />}
              </PrimaryIconWrapper>
              <SecondaryIconWrapper
                onClick={() => {
                  setDirection(false);
                }}
              >
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

// ⚡ ANIMATIONS
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SpinnerIcon = styled(PiSpinnerBold)`
  font-size: 25px;
  animation: ${rotate} 1s linear infinite;
`;

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
  height: 19vh;
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

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

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
  &:hover {
    transform: scale(0.95);
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
