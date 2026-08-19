import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Loader2, RefreshCw, Sparkles, TriangleAlert } from "lucide-react";
import { MODES, buildLesson, readLesson, providerStatus } from "../lesson";

function Summary({ data }) {
  const text = data.summary || "";
  // The prompt asks for bullets but models drift between "- ", "• " and plain paragraphs,
  // so split on lines and render whatever came back as its own row.
  const lines = text.split("\n").map(l => l.replace(/^\s*[-•*]\s*/, "").trim()).filter(Boolean);
  return (
    <div className="amc-lesson-body">
      {lines.map((line, i) => <p key={i}>{line}</p>)}
    </div>
  );
}

function Flashcards({ data }) {
  const cards = data.cards || [];
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  if (cards.length === 0) return <div className="amc-empty">No cards came back — try regenerating.</div>;
  const card = cards[Math.min(i, cards.length - 1)];
  const step = (d) => { setOpen(false); setI(v => (v + d + cards.length) % cards.length); };

  return (
    <div className="amc-flash">
      <button className="amc-flash-card" data-open={String(open)} onClick={() => setOpen(v => !v)}>
        <span className="amc-flash-hint">{open ? "Definition" : "Term"} · tap to flip</span>
        <span className="amc-flash-text">{open ? card.definition : card.term}</span>
      </button>
      <div className="amc-flash-nav">
        <button className="amc-icon-btn" onClick={() => step(-1)}><ChevronLeft size={16} /></button>
        <span>{Math.min(i, cards.length - 1) + 1} / {cards.length}</span>
        <button className="amc-icon-btn" onClick={() => step(1)}><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

function Quiz({ data }) {
  const questions = data.questions || [];
  const [picked, setPicked] = useState({});
  if (questions.length === 0) return <div className="amc-empty">No questions came back — try regenerating.</div>;

  return (
    <div className="amc-quiz">
      {questions.map((q, qi) => {
        const choice = picked[qi];
        return (
          <div key={qi} className="amc-quiz-q">
            <div className="amc-quiz-title">{qi + 1}. {q.question}</div>
            {(q.options || []).map((opt, oi) => {
              const isPicked = choice === oi;
              const isAnswer = String(q.answer).trim() === String(opt).trim();
              const state = choice === undefined ? "idle" : isAnswer ? "right" : isPicked ? "wrong" : "idle";
              return (
                <button key={oi} className="amc-quiz-opt" data-state={state}
                        onClick={() => setPicked(p => ({ ...p, [qi]: oi }))}>
                  {opt}
                </button>
              );
            })}
            {choice !== undefined && q.explanation && (
              <div className="amc-quiz-why">{q.explanation}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ModuleView({ track, module, index, onBack }) {
  const [mode, setMode] = useState("summary");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(null);

  const provider = providerStatus();

  const load = useCallback(async (refresh) => {
    setLoading(true);
    setError(null);
    setStatus("");
    try {
      const res = await buildLesson({ track, module, mode, refresh, onStatus: setStatus });
      setData(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
      setStatus("");
    }
  }, [track, module, mode]);

  // Switching module or tab shows the cached lesson straight away; only a module that has
  // never been generated waits for the provider.
  useEffect(() => {
    setData(readLesson(track.id, module.id, mode));
    setError(null);
  }, [track.id, module.id, mode]);

  return (
    <div className="amc-view amc-page" key={`${track.id}/${module.id}`}>
      <button className="amc-back" onClick={onBack}>
        <ArrowLeft size={13} /> {track.label}
      </button>

      <div className="amc-hero" style={{ marginBottom: 22 }}>
        <div className="amc-hero-kicker" style={{ color: track.color }}>
          {track.label} · module {String(index + 1).padStart(2, "0")}
        </div>
        <h2>{module.label}</h2>
        {module.tagline && <p>{module.tagline}</p>}
        <a className="amc-cta" href={module.url} target="_blank" rel="noopener noreferrer"
           style={{ background: track.color, color: "#08111f" }}>
          Open this module on aimlcompanion.ai <ArrowUpRight size={14} />
        </a>
      </div>

      <div className="amc-tabs">
        {MODES.map(m => (
          <button key={m.id} className="amc-tab" data-active={String(mode === m.id)} onClick={() => setMode(m.id)}>
            {m.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {data && (
          <button className="amc-tab" onClick={() => load(true)} title="Generate again">
            <RefreshCw size={13} /> Regenerate
          </button>
        )}
      </div>

      {loading ? (
        <div className="amc-empty">
          <Loader2 className="amc-spin" size={20} />
          <div style={{ marginTop: 10 }}>{status || "Writing this lesson locally…"}</div>
        </div>
      ) : error ? (
        <div className="amc-alert">
          <TriangleAlert size={15} />
          <div>
            <strong>Could not generate.</strong> {error}
          </div>
        </div>
      ) : data ? (
        mode === "summary" ? <Summary data={data} />
          : mode === "flashcards" ? <Flashcards data={data} />
            : <Quiz data={data} />
      ) : (
        <div className="amc-generate">
          <Sparkles size={22} style={{ color: track.color }} />
          <div className="amc-generate-title">Nothing stored for this module yet</div>
          <div className="amc-generate-text">
            {provider.configured
              ? `${provider.label} will write it here and keep it cached on this device.`
              : provider.setupMessage}
          </div>
          <button className="amc-cta" style={{ background: track.color, color: "#08111f" }}
                  onClick={() => load(false)} disabled={!provider.configured}>
            <Sparkles size={15} /> Generate {MODES.find(m => m.id === mode).label.toLowerCase()}
          </button>
        </div>
      )}
    </div>
  );
}
