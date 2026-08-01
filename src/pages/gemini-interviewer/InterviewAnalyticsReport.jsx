import { useMemo, useState } from "react";
import { AlertTriangle, BookOpen, CheckCircle2, ChevronDown, Clock, MessageSquare, RotateCcw, Sparkles, Timer, X } from "lucide-react";

function Meter({ label, value }) {
  const pct = Math.max(0, Math.min(100, Math.round(value || 0)));
  return <div className="gemini-meter">
    <div className="gemini-meter__head"><span>{label}</span><strong>{pct}</strong></div>
    <div className="gemini-meter__track"><div className="gemini-meter__fill" style={{ width: `${pct}%` }} /></div>
  </div>;
}

function ScoreHero({ score }) {
  const pct = Math.max(0, Math.min(100, Math.round(score || 0)));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);
  return <div className="gemini-score-hero" role="img" aria-label={`Overall score ${pct} out of 100`}>
    <svg viewBox="0 0 120 120" width="120" height="120">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--report-track)" strokeWidth="10" />
      <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--report-accent)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 60 60)" />
    </svg>
    <div className="gemini-score-hero__value"><strong>{pct}</strong><span>/ 100</span></div>
  </div>;
}

function computeSpeechStats(transcript, elapsedSeconds) {
  const candidateWords = transcript
    .filter((item) => item.role === "candidate")
    .reduce((sum, item) => sum + item.text.split(/\s+/).filter(Boolean).length, 0);
  const minutes = Math.max(elapsedSeconds / 60, 0.05);
  return { candidateWords, wpm: Math.round(candidateWords / minutes) };
}

export default function InterviewAnalyticsReport({ analysis, transcript, form, elapsedSeconds, onRestart, onClose }) {
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const { candidateWords, wpm } = useMemo(() => computeSpeechStats(transcript, elapsedSeconds), [transcript, elapsedSeconds]);
  const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");
  const turns = transcript.filter((item) => item.role === "candidate").length;

  return <section className="gemini-report">
    <div className="gemini-report__top">
      <ScoreHero score={analysis.score} />
      <div className="gemini-report__summary">
        <p className="gemini-eyebrow"><Sparkles size={12} /> PERFORMANCE REPORT</p>
        <h1>{form.role} <span>·</span> {form.seniority}</h1>
        <p className="gemini-report__verdict">{analysis.verdict}</p>
      </div>
      <div className="gemini-report__actions">
        <button className="gemini-primary-action" onClick={onRestart}><span className="gemini-action-icon"><RotateCcw size={16} /></span> New interview</button>
        <button className="gemini-end-action" onClick={onClose}><X size={16} /> Close</button>
      </div>
    </div>

    <div className="gemini-report__stats">
      <div className="gemini-stat-tile"><Clock size={14} /><strong>{minutes}:{seconds}</strong><span>Session length</span></div>
      <div className="gemini-stat-tile"><MessageSquare size={14} /><strong>{turns}</strong><span>Turns answered</span></div>
      <div className="gemini-stat-tile"><Timer size={14} /><strong>{wpm || 0}</strong><span>Words / min</span></div>
      <div className="gemini-stat-tile"><CheckCircle2 size={14} /><strong>{candidateWords}</strong><span>Words spoken</span></div>
    </div>

    <div className="gemini-report__meters">
      <Meter label="Technical depth" value={analysis.detailedScores?.technical} />
      <Meter label="Communication" value={analysis.detailedScores?.communication} />
      <Meter label="Confidence" value={analysis.detailedScores?.confidence} />
    </div>

    <div className="gemini-report__grid">
      <div className="gemini-report__card"><h3><CheckCircle2 size={15} /> Key strengths</h3><ul>{(analysis.strengths || []).map((item, index) => <li key={index}>{item}</li>)}</ul></div>
      <div className="gemini-report__card"><h3><AlertTriangle size={15} /> Growth areas</h3><ul>{(analysis.weaknesses || []).map((item, index) => <li key={index}>{item}</li>)}</ul></div>
      {analysis.technicalFeedback && <div className="gemini-report__card gemini-report__card--wide"><h3>Technical feedback</h3><p>{analysis.technicalFeedback}</p></div>}
      {analysis.communicationFeedback && <div className="gemini-report__card gemini-report__card--wide"><h3>Communication feedback</h3><p>{analysis.communicationFeedback}</p></div>}
      {!!analysis.suggestedLearning?.length && <div className="gemini-report__card gemini-report__card--wide">
        <h3><BookOpen size={15} /> Suggested study plan</h3>
        <div className="gemini-focus-list">{analysis.suggestedLearning.map((topic, index) => <span key={index}>{topic}</span>)}</div>
      </div>}
    </div>

    <button type="button" className="gemini-transcript-toggle" onClick={() => setTranscriptOpen((value) => !value)} aria-expanded={transcriptOpen}>
      <MessageSquare size={14} /> Full transcript <ChevronDown size={14} className={transcriptOpen ? "is-open" : ""} />
    </button>
    {transcriptOpen && <div className="gemini-interviewer__transcript gemini-report__transcript">
      {transcript.map((item, index) => <article key={index} className={`gemini-transcript-line ${item.role}`}><b>{item.role === "candidate" ? "YOU" : "ATLAS"}</b><p>{item.text}</p></article>)}
    </div>}
  </section>;
}
