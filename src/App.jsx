import { useState } from "react";
import Mainscreen from "./screens/Mainscreen";
import Splashscreen from "./screens/Splashscreen";

function App() {
  const [splash, setSplash] = useState(true);
  window.onload = () => {
    setTimeout(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setSplash(false);
    }, 4000);
  };
  return <>{splash ? <Splashscreen /> : <Mainscreen />}</>;
}

export default App;
