import React, { useState, useEffect, useMemo } from "react";
import { Search, Download, RefreshCw, AlertTriangle, Database, Radio } from "lucide-react";

const LETTERS = "ABCDEFGHIJ";

/**
 * Exam Bank — practice questions scraped from open-exam-prep.com.
 *
 * Lives as a tab inside QuizApp (see activeTab === "examBank" in QuizApp.jsx).
 * Renders inside the parent's .quiz-container, so it inherits all the
 * --bg-card / --accent / --text-primary etc. theme vars from QuizApp.css —
 * no separate theme needed here.
 *
 * Data flow:
 *   public/data/exam-list.json  → browse/search list (static, lazy-fetched)
 *   /api/exam-scrape            → cache-first question fetch (Supabase)
 *   /api/exam-export            → JSON/CSV download
 */
export default function ExamPractice() {
  const [allExams, setAllExams] = useState([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null); // { slug, name, vendor }
  const [phase, setPhase] = useState("browse"); // browse | loading | error | practice
  const [errorMsg, setErrorMsg] = useState("");
  const [source, setSource] = useState(null); // "cache" | "live"

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // idx -> { selected, checked }
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

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

  const selectExam = async (exam) => {
    setSelected(exam);
    setPhase("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/exam-scrape?exam=${encodeURIComponent(exam.slug)}&name=${encodeURIComponent(exam.name)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

      setQuestions(data.questions || []);
      setSource(data.source);
      setCurrentIdx(0);
      setUserAnswers({});
      setAnsweredCount(0);
      setCorrectCount(0);
      setPhase("practice");
    } catch (err) {
      console.error("Exam fetch failed:", err);
      setErrorMsg(err.message || "Could not retrieve or parse questions for this exam.");
      setPhase("error");
    }
  };

  const selectOption = (oIdx) => {
    setUserAnswers((prev) => ({ ...prev, [currentIdx]: { selected: oIdx, checked: false } }));
  };

  const checkAnswer = () => {
    const uAns = userAnswers[currentIdx];
    const q = questions[currentIdx];
    if (!uAns || uAns.checked) return;

    const isCorrect = uAns.selected === q.correctAnswer;
    setUserAnswers((prev) => ({ ...prev, [currentIdx]: { ...uAns, checked: true, isCorrect } }));
    setAnsweredCount((c) => c + 1);
    if (isCorrect) setCorrectCount((c) => c + 1);
  };

  const changeQuestion = (dir) => {
    const target = currentIdx + dir;
    if (target >= 0 && target < questions.length) setCurrentIdx(target);
  };

  const exportData = (format) => {
    if (!selected) return;
    window.location.href = `/api/exam-export?exam=${encodeURIComponent(selected.slug)}&name=${encodeURIComponent(selected.name)}&format=${format}`;
  };

  const accuracy = answeredCount === 0 ? 0 : Math.round((correctCount / answeredCount) * 100);

  // ── Browse screen ──────────────────────────────────────────
  if (phase === "browse" || phase === "loading" || phase === "error") {
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

        {phase === "loading" && selected && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>
            <RefreshCw size={28} className="spin" style={{ marginBottom: 12 }} />
            <p>Fetching questions for <strong>{selected.name}</strong>…</p>
          </div>
        )}

        {phase === "error" && (
          <div style={{
            display: "flex", gap: 12, alignItems: "flex-start", background: "var(--danger-bg)",
            border: "1px solid var(--danger)", borderRadius: 12, padding: 16, marginBottom: 24, color: "var(--text-primary)",
          }}>
            <AlertTriangle size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Couldn't load "{selected?.name}"</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>{errorMsg}</div>
              <button className="quiz-btn quiz-btn-secondary" onClick={() => selectExam(selected)}>Try Again</button>
            </div>
          </div>
        )}

        {examsLoading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>Loading exam list…</div>
        ) : (
          Object.keys(grouped).sort().map((vendor) => (
            <div key={vendor} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--text-muted)", marginBottom: 8, paddingLeft: 4 }}>
                {vendor}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                {grouped[vendor].map((exam) => (
                  <button
                    key={exam.slug}
                    onClick={() => selectExam(exam)}
                    className="quiz-btn"
                    style={{
                      justifyContent: "flex-start", textAlign: "left", background: "var(--bg-card)",
                      border: "1px solid var(--border)", color: "var(--text-primary)", padding: "12px 14px",
                    }}
                  >
                    {exam.name}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // ── Practice screen ─────────────────────────────────────────
  const q = questions[currentIdx];
  const uAns = userAnswers[currentIdx];
  const isChecked = !!uAns?.checked;

  return (
    <div>
      <div className="quiz-header" style={{ padding: "0 0 16px", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>{selected.name}</h1>
          <div style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            {source === "cache" ? <Database size={13} /> : <Radio size={13} />}
            {source === "cache" ? "Loaded from cache" : "Freshly scraped"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="quiz-btn quiz-btn-secondary" onClick={() => exportData("json")}>
            <Download size={14} style={{ marginRight: 6 }} /> JSON
          </button>
          <button className="quiz-btn quiz-btn-secondary" onClick={() => exportData("csv")}>
            <Download size={14} style={{ marginRight: 6 }} /> CSV
          </button>
          <button className="quiz-btn quiz-btn-secondary" onClick={() => setPhase("browse")}>
            ← Change Exam
          </button>
        </div>
      </div>

      <div className="quiz-stats-bar">
        <div className="quiz-stat-card">
          <div className="quiz-stat-value">{currentIdx + 1}/{questions.length}</div>
          <div className="quiz-stat-label">Question</div>
        </div>
        <div className="quiz-stat-card">
          <div className="quiz-stat-value success">{correctCount}</div>
          <div className="quiz-stat-label">Correct</div>
        </div>
        <div className="quiz-stat-card">
          <div className="quiz-stat-value">{accuracy}%</div>
          <div className="quiz-stat-label">Accuracy</div>
        </div>
      </div>

      <div className="quiz-progress-container">
        <div className="quiz-progress-info">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="quiz-question-card">
        <div className="quiz-question-meta">
          <span className="quiz-meta-tag number">Q{currentIdx + 1}</span>
          {q.difficulty && <span className="quiz-meta-tag">{q.difficulty}</span>}
          {q.category && <span className="quiz-meta-tag section">{q.category}</span>}
        </div>

        <div className="quiz-question-text">{q.question}</div>

        <div className="quiz-options-list">
          {(q.options || []).map((opt, i) => {
            const isSelected = uAns?.selected === i;
            let className = "quiz-option-btn";
            if (isSelected && !isChecked) className += " selected";
            if (isChecked) {
              className += " disabled";
              if (i === q.correctAnswer) className += " correct";
              else if (isSelected) className += " incorrect";
            }
            return (
              <button key={i} className={className} onClick={() => !isChecked && selectOption(i)} disabled={isChecked}>
                <span className="quiz-option-letter">{LETTERS[i]}</span>
                <span className="quiz-option-text">{opt}</span>
              </button>
            );
          })}
        </div>

        {isChecked && q.explanation && (
          <div className="quiz-explanation-panel">
            <h4>💡 Explanation</h4>
            <p>{q.explanation}</p>
          </div>
        )}

        <div className="quiz-nav-buttons">
          <button className="quiz-btn quiz-btn-secondary" onClick={() => changeQuestion(-1)} disabled={currentIdx === 0}>
            ← Previous
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            {!isChecked && (
              <button className="quiz-btn quiz-btn-success" onClick={checkAnswer} disabled={uAns?.selected === undefined}>
                Check Answer
              </button>
            )}
            <button className="quiz-btn quiz-btn-primary" onClick={() => changeQuestion(1)} disabled={currentIdx === questions.length - 1}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
