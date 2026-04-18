import { useEffect, useState } from "react";
import Mainscreen from "./screens/Mainscreen";
import Splashscreen from "./screens/Splashscreen";

function App() {
  const [splash, setSplash] = useState(true);
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const mobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(
      navigator.userAgent,
    );
    setIsMobile(mobile);
    if (!mobile) return;
    const init = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setTimeout(() => {
          setSplash(false);
        }, 3000);
      } catch (err) {
        console.error("Camera blocked:", err);
      }
    };
    init();
  }, []);
  if (!isMobile) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "black",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "20px",
          fontFamily: "sans-serif",
        }}
      >
        📵 This app is only available on mobile devices.
      </div>
    );
  }

  return <>{splash ? <Splashscreen /> : <Mainscreen />}</>;
}

export default App;
