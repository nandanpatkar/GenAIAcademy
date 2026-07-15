import React, { useState, useEffect, useMemo } from "react";
import { Search, RefreshCw, AlertTriangle, ChevronRight, Loader2 } from "lucide-react";

/**
 * Exam Bank — practice questions scraped from open-exam-prep.com.
 *
 * Default tab inside QuizApp (see activeTab initial state in QuizApp.jsx).
 * Renders inside the parent's .quiz-container, so it inherits all the
 * --bg-card / --accent / --text-primary etc. theme vars from QuizApp.css.
 *
 * Flow: browse (cards) -> configure (time/marks/AI tutor, same as custom
 * quizzes) -> onStartExam() hands transformed questions back up to QuizApp,
 * which takes over with its existing quiz-taking UI (timer, question map,
 * flag for review, AI tutor, save & exit, results/review — all reused,
 * nothing duplicated here).
 *
 * Data flow:
 *   public/data/exam-list.json  → browse/search list (static, lazy-fetched)
 *   /api/exam-scrape            → cache-first question fetch (Supabase)
 */
export default function ExamPractice({ onStartExam }) {
  const [allExams, setAllExams] = useState([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [phase, setPhase] = useState("browse"); // browse | configuring | fetching
  const [selected, setSelected] = useState(null); // { slug, name, vendor }
  const [errorMsg, setErrorMsg] = useState("");

  const [config, setConfig] = useState({
    timeLimit: 90,
    marksCorrect: 1,
    marksWrong: 0,
    enableAiTutor: true,
  });

  useEffect(() => {
    fetch("/data/exam-list.json")
      .then((r) => r.json())
      .then((data) => setAllExams(data))
      .catch((err) => console.error("Failed to load exam list:", err))
      .finally(() => setExamsLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = q
      ? allExams.filter((e) => e.name.toLowerCase().includes(q) || e.vendor.toLowerCase().includes(q))
      : allExams;

    const groups = {};
    filtered.forEach((e) => {
      if (!groups[e.vendor]) groups[e.vendor] = [];
      groups[e.vendor].push(e);
    });
    return groups;
  }, [allExams, search]);

  const openConfig = (exam) => {
    setSelected(exam);
    setErrorMsg("");
    setConfig({ timeLimit: 90, marksCorrect: 1, marksWrong: 0, enableAiTutor: true });
    setPhase("configuring");
  };

  const handleStartExam = async () => {
    setPhase("fetching");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/exam-scrape?exam=${encodeURIComponent(selected.slug)}&name=${encodeURIComponent(selected.name)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      if (!data.questions || data.questions.length === 0) throw new Error("No questions were found for this exam.");

      onStartExam(selected.name, data.questions, config);
    } catch (err) {
      console.error("Exam fetch failed:", err);
      setErrorMsg(err.message || "Could not retrieve or parse questions for this exam.");
      setPhase("configuring");
    }
  };

  // ── Configure screen ───────────────────────────────────────
  if (phase === "configuring" || phase === "fetching") {
    const fetching = phase === "fetching";
    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <button
          className="quiz-btn"
          style={{ background: "transparent", border: "none", color: "var(--text-muted)", padding: "0 0 16px", fontSize: 13 }}
          onClick={() => setPhase("browse")}
          disabled={fetching}
        >
          ← Back to Exam Bank
        </button>

        <h2 style={{ margin: "0 0 4px" }}>{selected.name}</h2>
        <p style={{ color: "var(--text-muted)", marginTop: 0, marginBottom: 24 }}>{selected.vendor}</p>

        {errorMsg && (
          <div style={{
            display: "flex", gap: 12, alignItems: "flex-start", background: "var(--danger-bg)",
            border: "1px solid var(--danger)", borderRadius: 12, padding: 16, marginBottom: 24, color: "var(--text-primary)",
          }}>
            <AlertTriangle size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Couldn't load this exam</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{errorMsg}</div>
            </div>
          </div>
        )}

        <div className="quiz-config-panel" style={{ textAlign: 'left', background: 'var(--bg-card)', padding: 24, borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>TIME LIMIT (MINUTES)</label>
              <input
                type="number"
                value={config.timeLimit}
                onChange={(e) => setConfig({ ...config, timeLimit: Number(e.target.value) })}
                disabled={fetching}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>MARKS PER CORRECT</label>
              <input
                type="number"
                value={config.marksCorrect}
                onChange={(e) => setConfig({ ...config, marksCorrect: Number(e.target.value) })}
                disabled={fetching}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: 'var(--text-muted)' }}>PENALTY PER WRONG</label>
              <input
                type="number"
                value={config.marksWrong}
                onChange={(e) => setConfig({ ...config, marksWrong: Number(e.target.value) })}
                disabled={fetching}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="checkbox"
                id="examEnableAiTutor"
                checked={config.enableAiTutor}
                onChange={(e) => setConfig({ ...config, enableAiTutor: e.target.checked })}
                disabled={fetching}
                style={{ width: 18, height: 18 }}
              />
              <label htmlFor="examEnableAiTutor" style={{ fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Enable AI Tutor Assistance</label>
            </div>
            <p style={{ margin: '4px 0 0 30px', fontSize: 13, color: 'var(--text-muted)' }}>Provides real-time hints and explanations during the quiz.</p>
          </div>
        </div>

        <button
          className="quiz-btn quiz-btn-primary"
          onClick={handleStartExam}
          disabled={fetching}
          style={{ padding: '16px 40px', fontSize: 18, width: '100%', justifyContent: 'center' }}
        >
          {fetching ? (
            <><Loader2 size={18} className="spin" style={{ marginRight: 8 }} /> Fetching Questions…</>
          ) : (
            <>Start Exam <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    );
  }

  // ── Browse screen (cards) ───────────────────────────────────
  return (
    <div>
      <div className="quiz-upload-area" style={{ marginBottom: 24, textAlign: "left", padding: 20 }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search exams (AWS, Azure, Databricks...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", background: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "10px 12px 10px 36px", color: "var(--text-primary)", fontSize: 14,
            }}
          />
        </div>
      </div>

      {examsLoading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
          <RefreshCw size={24} className="spin" style={{ marginBottom: 8 }} />
          <div>Loading exam list…</div>
        </div>
      ) : (
        Object.keys(grouped).sort().map((vendor) => (
          <div key={vendor} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--text-muted)", marginBottom: 10, paddingLeft: 4 }}>
              {vendor}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
              {grouped[vendor].map((exam) => (
                <button
                  key={exam.slug}
                  onClick={() => openConfig(exam)}
                  style={{
                    textAlign: "left", background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)", padding: "18px 18px", cursor: "pointer",
                    color: "var(--text-primary)", display: "flex", flexDirection: "column", gap: 10,
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-card-hover)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-card)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>{exam.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)" }}>
                    <span>{exam.vendor}</span>
                    <ChevronRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
