import { useRef, useState } from 'react';

export default function NameVoiceInput({ value, onChange, lang = 'ur', placeholder, onError, required = true }) {
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const field = useRef(null);
  const recognition = useRef(null);
  const ur = lang === 'ur';
  const speak = () => {
    if (listening) { recognition.current?.stop(); return; }
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) { onError?.(ur ? 'اس براؤزر میں آواز دستیاب نہیں۔ Chrome استعمال کریں۔' : 'Voice is not available in this browser. Try Chrome.'); return; }
    onError?.('');
    const rec = new Speech();
    recognition.current = rec;
    rec.lang = ur ? 'ur-PK' : 'en-PK';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    rec.onresult = event => {
      const spoken = [...event.results[0]].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))[0]?.transcript?.trim();
      if (spoken) onChange(spoken);
    };
    rec.onerror = () => onError?.(ur ? 'نام واضح نہیں سنا گیا، دوبارہ بولیں۔' : 'Name was unclear. Please try again.');
    rec.onend = () => { setListening(false); recognition.current = null; };
    try { rec.start(); setListening(true); } catch { onError?.(ur ? 'مائیک دوبارہ شروع نہیں ہو سکا۔' : 'Could not start the microphone.'); }
  };
  return <div ref={field} className={`ledger-name-input${focused ? ' is-focused' : ''}`} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <input required={required} maxLength="100" dir="auto" placeholder={placeholder} value={value} onChange={event => onChange(event.target.value)} />
    {focused && <button type="button" className={`ledger-name-mic${listening ? ' is-listening' : ''}`} aria-label={listening ? (ur ? 'سننا بند کریں' : 'Stop listening') : (ur ? 'نام بول کر لکھیں' : 'Speak name')} title={listening ? (ur ? 'سننا بند کریں' : 'Stop listening') : (ur ? 'نام بول کر لکھیں' : 'Speak name')} onMouseDown={event => event.preventDefault()} onClick={speak}>{listening ? '■' : '🎙'}<span>{listening ? (ur ? 'سن رہا ہے' : 'Listening') : (ur ? 'بول کر' : 'Speak')}</span></button>}
  </div>;
}
