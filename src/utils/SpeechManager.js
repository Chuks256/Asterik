class SpeechManager {
  constructor() {
    this.globalSynth = window.speechSynthesis;
  }

  async coldStartSpeechUtterance(_word = "") {
    try {
      const primer = new SpeechSynthesisUtterance(_word);
      this.globalSynth.speak(primer);
    } catch (err) {
      console.error("TTS Cold Start Error:", err);
    }
  }

  async useBrowserInbuiltTTS(words = "", onWordBoundary, onEnd, config = {}) {
    try {
      this.globalSynth.cancel();
      // 1. Sanitize text
      const sanitizeText = words.replace(/[*#_]/g, "");
      const utteranceObject = new SpeechSynthesisUtterance(sanitizeText);
      // 2. Configuration
      utteranceObject.rate = config.rate || 0.8;
      utteranceObject.volume = config.volume || 1; // Standard volume is 0 to 1
      utteranceObject.pitch = config.pitch || 1;

      // 3. Voice Selection (Filtering for English)
      const voices = this.globalSynth.getVoices();
      utteranceObject.voice =
        voices.find((v) => v.lang.startsWith("en-")) || voices[0];

      // 4. Boundary Logic
      utteranceObject.onboundary = (ev) => {
        if (ev.name === "word") {
          const spokenTextSoFar = sanitizeText.substring(0, ev.charIndex);
          const wordIndex = spokenTextSoFar.trim().split(/\s+/).length;
          if (onWordBoundary) {
            onWordBoundary(ev.charIndex === 0 ? 0 : wordIndex);
          }
        }
      };
      utteranceObject.onend = () => {
        if (onEnd) onEnd();
      };
      this.globalSynth.speak(utteranceObject);
    } catch (err) {
      console.error("TTS Error:", err);
    }
  }
}

export default new SpeechManager();
