import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, BriefcaseBusiness, Check, ChevronDown, Code2, Globe2, Loader2, Mic, PhoneOff, Radio, ShieldCheck, Sparkles, Timer, WandSparkles, X } from "lucide-react";
import { buildDataScienceInterviewerPrompt, getFocusChips, getRolePlaybook, INTERVIEW_ROLES } from "../../prompts/dataScienceInterviewerPrompt";
import { GeminiLiveSession } from "../../services/geminiLiveService";
import { generateInterviewAnalysis } from "../../services/aiService";
import VoiceOrb3D from "../../components/VoiceOrb3D";
import { NinjaEye, NinjaLoader } from "../../components/NinjaEye";
import InterviewAnalyticsReport from "./InterviewAnalyticsReport";
import "../../styles/GeminiInterviewer.css";
import "../../styles/GeminiInterviewerFullscreen.css";

const PythonIDE = lazy(() => import("../../components/PythonIDE"));
const LANGUAGES = ["English", "Hindi", "Hinglish", "Spanish", "French", "German", "Japanese"];
const AI_SPEAK_THRESHOLD = 0.035;
const USER_SPEAK_THRESHOLD = 0.05;

export default function GeminiInterviewerPage({ onClose }) {
  const [stage, setStage] = useState("setup"); // setup | call | loading_report | report
  const [form, setForm] = useState({ role: "AI Engineer", seniority: "Mid-level", language: "English", jobDescription: "", resumeText: "" });
  const [status, setStatus] = useState("Ready when you are");
  const [error, setError] = useState("");
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [voicePitch, setVoicePitch] = useState(0);
  const [aiVoiceLevel, setAiVoiceLevel] = useState(0);
  const [aiVoicePitch, setAiVoicePitch] = useState(0);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const sessionRef = useRef(null); const transcriptRef = useRef(null);
  const rolePlaybook = useMemo(() => getRolePlaybook(form.role), [form.role]);
  const focusChips = useMemo(() => getFocusChips(rolePlaybook), [rolePlaybook]);
  const active = stage === "call";

  const aiSpeaking = active && aiVoiceLevel > AI_SPEAK_THRESHOLD;
  const userSpeaking = active && !aiSpeaking && voiceLevel > USER_SPEAK_THRESHOLD;
  const orbState = aiSpeaking ? "speaking" : userSpeaking ? "listening" : "idle";
  const orbAmplitude = aiSpeaking ? aiVoiceLevel : userSpeaking ? voiceLevel : 0;
  const orbPitch = aiSpeaking ? aiVoicePitch : userSpeaking ? voicePitch : 0;
  const orbCaption = isInterrupted ? "Your turn — Atlas is holding the room."
    : aiSpeaking ? "Atlas is speaking."
    : userSpeaking ? "Listening — speak naturally."
    : active ? "A focused voice room for your next breakthrough."
    : "Choose your field and start when you're ready.";

  useEffect(() => () => { sessionRef.current?.stop(); }, []);
  useEffect(() => { const el = transcriptRef.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); }, [transcript]);
  useEffect(() => { if (!active) return undefined; const id = window.setInterval(() => setElapsed((value) => value + 1), 1000); return () => window.clearInterval(id); }, [active]);
  const appendTranscript = ({ role, text }) => setTranscript((items) => { const last = items.at(-1); return last?.role === role ? [...items.slice(0, -1), { ...last, text: `${last.text}${text}` }] : [...items, { role, text }]; });
  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const startInterview = async () => {
    setError(""); setElapsed(0); setTranscript([]); setAnalysis(null); setStatus("Preparing secure voice session…");
    const session = new GeminiLiveSession({
      systemInstruction: buildDataScienceInterviewerPrompt(form),
      onStatus: setStatus,
      onTranscript: appendTranscript,
      onVolume: setVoiceLevel,
      onPitch: setVoicePitch,
      onAiVolume: setAiVoiceLevel,
      onAiPitch: setAiVoicePitch,
      onInterruption: () => { setIsInterrupted(true); setStatus("You're speaking — Atlas paused"); window.setTimeout(() => setIsInterrupted(false), 900); },
      onError: (cause) => { setError(cause.message || "The voice session could not start."); setStatus("Connection problem"); setStage("setup"); },
    });
    sessionRef.current = session;
    try { await session.start(); setStage("call"); } catch (cause) { setError(cause.message || "The voice session could not start."); setStatus("Connection problem"); session.stop(); }
  };

  const stopInterview = async () => {
    sessionRef.current?.stop(); sessionRef.current = null;
    setVoiceLevel(0); setVoicePitch(0); setAiVoiceLevel(0); setAiVoicePitch(0); setIsInterrupted(false); setCodeOpen(false); setStatus("Session ended");
    const hasCandidateTurns = transcript.some((item) => item.role === "candidate");
    if (!hasCandidateTurns) { setStage("setup"); return; }
    setStage("loading_report");
    try {
      const transcriptText = transcript.map((item) => `${item.role === "candidate" ? "CANDIDATE" : "INTERVIEWER"}: ${item.text}`).join("\n");
      const report = await generateInterviewAnalysis(transcriptText, { role: form.role, seniority: form.seniority, language: form.language });
      setAnalysis(report);
      setStage("report");
    } catch (cause) {
      setError(cause.message || "Could not generate the performance report.");
      setStage("setup");
    }
  };

  const restart = () => { setAnalysis(null); setTranscript([]); setElapsed(0); setError(""); setStage("setup"); };
  const submitSolution = ({ code, output }) => { try { sessionRef.current?.sendText(`The candidate submitted this Python solution for the ${form.role} interview. Ask one focused follow-up, then give concise feedback.\n\nCODE:\n${code}\n\nRUN OUTPUT:\n${output || "No output submitted."}`); setCodeOpen(false); } catch (cause) { setError(cause.message); } };
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0"); const seconds = String(elapsed % 60).padStart(2, "0");

  return <main className="gemini-interviewer">
    <header className="gemini-interviewer__header">
      <div className="gemini-interviewer__brand"><span className="gemini-brand-mark"><Sparkles size={16} /></span><span>ATLAS</span><small>ADAPTIVE INTERVIEW LAB</small></div>
      <div className="gemini-header-actions">{active && <span className="gemini-live-chip"><i /> LIVE · {minutes}:{seconds}</span>}<button className="gemini-interviewer__close" onClick={onClose} aria-label="Exit Gemini interviewer"><X size={20} /></button></div>
    </header>

    {(stage === "setup" || stage === "call") && <section className={`gemini-interviewer__workspace ${active ? "is-active" : "is-setup"} ${codeOpen ? "with-code" : ""}`}>
      <aside className="gemini-interviewer__brief">
        <div className="gemini-brief-topline"><p className="gemini-eyebrow"><Radio size={12} /> VOICE INTERVIEW</p><span className="gemini-secure"><ShieldCheck size={13} /> PRIVATE SESSION</span></div>
        <h1>Practice the answers that make you memorable.</h1>
        <p className="gemini-brief-copy">Atlas adapts every question to the field, level, and context you choose — any discipline, not just a fixed list.</p>

        <div className="gemini-role-section">
          <div className="gemini-section-label"><BriefcaseBusiness size={14} /> Target role / field</div>
          <input className="gemini-role-input" type="text" disabled={active} value={form.role} onChange={(event) => updateForm("role", event.target.value)} placeholder="e.g. AI Engineer, Backend Engineer, Product Manager…" />
          <div className="gemini-role-chips">{INTERVIEW_ROLES.map((role) => <button type="button" key={role} disabled={active} className={form.role === role ? "selected" : ""} onClick={() => updateForm("role", role)}>{role}{form.role === role && <Check size={12} />}</button>)}</div>
        </div>

        <div className="gemini-prompt-preview"><WandSparkles size={16} /><div><span>INTERVIEW ENGINE</span><strong>{rolePlaybook.identity.replace("a ", "").replace("an ", "")}</strong></div></div>
        <label className="gemini-language-label"><Globe2 size={14} /> Interview language</label><div className="gemini-language-picker">{LANGUAGES.map((language) => <button key={language} disabled={active} className={form.language === language ? "selected" : ""} onClick={() => updateForm("language", language)}>{language}</button>)}</div>
        <label>Job context <em>optional</em><textarea rows="4" disabled={active} value={form.jobDescription} onChange={(event) => updateForm("jobDescription", event.target.value)} placeholder="Paste the role, company domain, responsibilities, tools, or job description…" /></label>
        <div className="gemini-field-grid"><label>Experience level<select value={form.seniority} disabled={active} onChange={(event) => updateForm("seniority", event.target.value)}><option>Entry-level</option><option>Mid-level</option><option>Senior</option><option>Staff / Lead</option></select><ChevronDown size={14} /></label><label>Interview mode<select disabled><option>Voice + live coding</option></select><ChevronDown size={14} /></label></div>
        <p className="gemini-focus-label">ADAPTIVE FOCUS</p><div className="gemini-focus-list">{focusChips.map((area) => <span key={area}>{area}</span>)}</div>
        {!active ? <button className="gemini-primary-action" onClick={startInterview}><span className="gemini-action-icon"><Mic size={17} /></span> Start interview <ArrowUpRight size={17} /></button> : <button className="gemini-end-action" onClick={stopInterview}><PhoneOff size={17} /> End interview</button>}
        {error && <p className="gemini-interviewer__error">{error}</p>}
      </aside>
      <section className="gemini-interviewer__room">
        <div className="gemini-room-top"><div><span className="gemini-status"><i className={active ? "live" : ""} /> {status}</span><p>{form.role} · {form.seniority}</p></div><div className="gemini-live-controls"><button className="gemini-code-button" onClick={() => setCodeOpen(true)} disabled={!active}><Code2 size={16} /> Open coding lab</button>{active && <button className="gemini-stop-live" onClick={stopInterview}><PhoneOff size={16} /> End</button>}</div></div>
        <div className={`gemini-voice-orb ${orbState} ${isInterrupted ? "is-interrupted" : ""}`} role="img" aria-label={`${orbState}. ${orbCaption}`}>
          <VoiceOrb3D amplitude={orbAmplitude} pitch={orbPitch} state={orbState} />
          <div className="gemini-voice-orb__badge"><Mic size={16} strokeWidth={1.5} /><span>{active ? (aiSpeaking ? "ATLAS" : "VOICE") : "STANDBY"}</span></div>
        </div>
        <p className="gemini-voice-caption">{orbCaption}</p>
        <div className="gemini-interviewer__transcript" ref={transcriptRef} aria-live="polite">{transcript.length === 0 ? <p className="gemini-interviewer__waiting">{active ? "Atlas is joining the room…" : "Your conversation will appear here once you start."}</p> : transcript.map((item, index) => <article key={index} className={`gemini-transcript-line ${item.role}`}><b>{item.role === "candidate" ? "YOU" : "ATLAS"}</b><p>{item.text}</p></article>)}</div>
      </section>
    </section>}

    {stage === "loading_report" && <section className="gemini-loading-report">
      <NinjaEye size={72} labelled={false} />
      <h2>Analyzing your performance…</h2>
      <p>Atlas is scoring your answers and preparing a detailed report.</p>
    </section>}

    {stage === "report" && analysis && <InterviewAnalyticsReport analysis={analysis} transcript={transcript} form={form} elapsedSeconds={elapsed} onRestart={restart} onClose={onClose} />}

    {codeOpen && <div className="gemini-ide-overlay"><div className="gemini-ide-window"><Suspense fallback={<div className="gemini-ide-loading"><NinjaLoader label="Loading coding workspace" /></div>}><PythonIDE onClose={() => setCodeOpen(false)} onSubmitSolution={submitSolution} /></Suspense></div></div>}
  </main>;
}
