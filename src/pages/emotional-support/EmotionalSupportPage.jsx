import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Globe, Heart, HeartHandshake, Mic, Phone, PhoneOff, Radio, ShieldCheck, Sparkles, X } from "lucide-react";
import VoiceOrb3D from "../../components/VoiceOrb3D";
import { buildEmotionalSupportPrompt, LANGUAGES, PERSONAS } from "../../prompts/emotionalSupportPrompt";
import { GeminiLiveSession } from "../../services/geminiLiveService";
import "../../styles/EmotionalSupport.css";

const AI_SPEAK_THRESHOLD = 0.035;
const USER_SPEAK_THRESHOLD = 0.05;
const PERSONA_ICONS = { solace: HeartHandshake, aria: Heart };

export default function EmotionalSupportPage({ onClose }) {
  const [personaId, setPersonaId] = useState("solace");
  const [language, setLanguage] = useState("en");
  const [stage, setStage] = useState("setup");
  const [status, setStatus] = useState("Ready when you are");
  const [error, setError] = useState("");
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [voicePitch, setVoicePitch] = useState(0);
  const [aiVoiceLevel, setAiVoiceLevel] = useState(0);
  const [aiVoicePitch, setAiVoicePitch] = useState(0);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const sessionRef = useRef(null);
  const transcriptRef = useRef(null);
  const persona = PERSONAS[personaId];
  const PersonaIcon = PERSONA_ICONS[personaId];
  const languageOption = useMemo(() => LANGUAGES.find((item) => item.code === language) || LANGUAGES[0], [language]);
  const active = stage === "call";
  const aiSpeaking = active && aiVoiceLevel > AI_SPEAK_THRESHOLD;
  const userSpeaking = active && !aiSpeaking && voiceLevel > USER_SPEAK_THRESHOLD;
  const orbState = aiSpeaking ? "speaking" : userSpeaking ? "listening" : "idle";
  const orbAmplitude = aiSpeaking ? aiVoiceLevel : userSpeaking ? voiceLevel : 0;
  const orbPitch = aiSpeaking ? aiVoicePitch : userSpeaking ? voicePitch : 0;
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  const orbCaption = isInterrupted ? "I’m listening — take your time."
    : aiSpeaking ? persona.speakingCaption
    : userSpeaking ? "Listening — speak naturally."
    : active ? persona.idlePrompt
    : "Start a voice session when you feel ready.";

  useEffect(() => () => { sessionRef.current?.stop(); }, []);
  useEffect(() => { const element = transcriptRef.current; if (element) element.scrollTo({ top: element.scrollHeight, behavior: "smooth" }); }, [transcript]);
  useEffect(() => { if (!active) return undefined; const interval = window.setInterval(() => setElapsed((value) => value + 1), 1000); return () => window.clearInterval(interval); }, [active]);

  const appendTranscript = ({ role, text }) => setTranscript((items) => {
    const last = items.at(-1);
    return last?.role === role ? [...items.slice(0, -1), { ...last, text: `${last.text}${text}` }] : [...items, { role, text }];
  });

  const startSession = async () => {
    setError(""); setElapsed(0); setTranscript([]); setStatus("Preparing private voice session…");
    const session = new GeminiLiveSession({
      systemInstruction: buildEmotionalSupportPrompt({ persona: personaId, language }),
      initialMessage: persona.greeting,
      transcriptRoles: { assistant: personaId, user: "you" },
      languageCode: languageOption.speech,
      onStatus: setStatus,
      onTranscript: appendTranscript,
      onVolume: setVoiceLevel,
      onPitch: setVoicePitch,
      onAiVolume: setAiVoiceLevel,
      onAiPitch: setAiVoicePitch,
      onInterruption: () => { setIsInterrupted(true); setStatus(`You’re speaking — ${persona.name} is listening`); window.setTimeout(() => setIsInterrupted(false), 900); },
      onError: (cause) => { setError(cause.message || "The voice session could not start."); setStatus("Connection problem"); setStage("setup"); },
    });
    sessionRef.current = session;
    try { await session.start(); setStage("call"); } catch (cause) { setError(cause.message || "The voice session could not start."); setStatus("Connection problem"); session.stop(); }
  };

  const endSession = () => {
    sessionRef.current?.stop(); sessionRef.current = null;
    setVoiceLevel(0); setVoicePitch(0); setAiVoiceLevel(0); setAiVoicePitch(0); setIsInterrupted(false); setStatus("Voice session ended"); setStage("setup");
  };

  return <main className={`support-voice support-voice--${personaId}`}>
    <header className="support-voice__header">
      <div className="support-voice__brand"><span><PersonaIcon size={17} /></span><b>{persona.name.toUpperCase()}</b><small>{persona.tagline}</small></div>
      <div className="support-voice__header-actions">{active && <span className="support-live-chip"><i /> LIVE · {minutes}:{seconds}</span>}<button type="button" className="support-voice__close" onClick={onClose} aria-label="Exit"><X size={20} /></button></div>
    </header>

    <section className={`support-voice__workspace ${active ? "is-active" : "is-setup"}`}>
      <aside className="support-voice__brief">
        <div className="support-voice__topline"><p><Radio size={12} /> LIVE VOICE {persona.role}</p><span><ShieldCheck size={13} /> GENTLE SPACE</span></div>

        {!active && <div className="support-persona-switch" role="tablist" aria-label="Choose who you’re talking to">
          {Object.values(PERSONAS).map((option) => {
            const OptionIcon = PERSONA_ICONS[option.id];
            return <button key={option.id} type="button" role="tab" aria-selected={personaId === option.id} className={`support-persona-switch__option ${personaId === option.id ? "is-active" : ""}`} onClick={() => setPersonaId(option.id)}>
              <OptionIcon size={15} /><span>{option.name}</span><small>{option.role === "COMPANION" ? "AI girlfriend" : "Support"}</small>
            </button>;
          })}
        </div>}

        <h1>{persona.heading}</h1>
        <p className="support-voice__copy">{persona.description}</p>

        {!active && <label className="support-language">
          <Globe size={14} />
          <span>Language</span>
          <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Conversation language">
            {LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
          </select>
        </label>}

        <div className="support-voice__promise"><Sparkles size={16} /><div><span>{persona.promiseLabel}</span><strong>{persona.promiseText}</strong></div></div>
        <div className="support-voice__steps">{persona.steps.map((step, index) => <span key={step}><i>{index + 1}</i> {step}</span>)}</div>
        <div className="support-voice__help"><Phone size={15} /><p><strong>Need immediate help?</strong> If you may hurt yourself or someone else, contact local emergency services. In the U.S. and Canada, call or text <b>988</b>.</p></div>
        {!active ? <button className="support-start" type="button" onClick={startSession}><span><Mic size={17} /></span>{transcript.length ? "Start a new voice session" : `Talk to ${persona.name}`}<ArrowUpRight size={17} /></button> : <button className="support-end" type="button" onClick={endSession}><PhoneOff size={17} /> End voice session</button>}
        {error && <p className="support-voice__error" role="alert">{error}</p>}
      </aside>

      <section className="support-voice__room">
        <div className="support-room__top"><div><span className="support-room__status"><i className={active ? "live" : ""} /> {status}</span><p>Voice conversation · no pressure to be polished</p></div>{active && <button type="button" className="support-room__end" onClick={endSession}><PhoneOff size={16} /> End</button>}</div>
        <div className={`support-orb ${orbState} ${isInterrupted ? "is-interrupted" : ""}`} role="img" aria-label={`${orbState}. ${orbCaption}`}><VoiceOrb3D amplitude={orbAmplitude} pitch={orbPitch} state={orbState} /><div className="support-orb__badge"><Mic size={16} strokeWidth={1.5} /><span>{active ? (aiSpeaking ? persona.name.toUpperCase() : "YOUR VOICE") : "STANDBY"}</span></div></div>
        <p className="support-orb__caption">{orbCaption}</p>
        <div className="support-transcript" ref={transcriptRef} aria-live="polite">{transcript.length === 0 ? <p>{active ? `${persona.name} is joining your voice space…` : "Your voice conversation will appear here once you start."}</p> : transcript.map((item, index) => <article className={item.role === "you" ? "you" : "them"} key={index}><b>{item.role === "you" ? "YOU" : persona.name.toUpperCase()}</b><p>{item.text}</p></article>)}</div>
      </section>
    </section>
  </main>;
}
