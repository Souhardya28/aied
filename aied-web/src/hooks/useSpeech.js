import { useEffect, useRef, useState } from 'react';

/** Browser speech synthesis — demo-mode narration when Gemini-TTS is not connected. */
export function useNarration() {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const speak = (text, lang) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.95;
    u.onend = u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };
  const stop = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  return { speak, stop, speaking, supported };
}

/** Voice input for doubts, in the student's language. */
export function useVoiceInput(lang, onText) {
  const [listening, setListening] = useState(false);
  const rec = useRef(null);
  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const start = () => {
    if (!SR) return;
    rec.current = new SR();
    rec.current.lang = lang;
    rec.current.interimResults = false;
    rec.current.onresult = (e) => onText(e.results[0][0].transcript);
    rec.current.onend = () => setListening(false);
    setListening(true);
    rec.current.start();
  };
  const stop = () => rec.current?.stop();
  return { start, stop, listening, supported: !!SR };
}
