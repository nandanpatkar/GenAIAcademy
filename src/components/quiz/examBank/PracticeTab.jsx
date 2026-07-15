import React, { useState } from "react";
import { AlertTriangle, ChevronRight, Loader2 } from "lucide-react";

/** Config screen (time limit / marks / AI tutor) + "Start Exam" fetch. */
export default function PracticeTab({ exam, onStartExam }) {
  const [fetching, setFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [config, setConfig] = useState({
    timeLimit: 90,
    marksCorrect: 1,
    marksWrong: 0,
    enableAiTutor: true,
  });

  const handleStartExam = async () => {
    setFetching(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/exam-scrape?exam=${encodeURIComponent(exam.slug)}&name=${encodeURIComponent(exam.name)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      if (!data.questions || data.questions.length === 0) throw new Error("No questions were found for this exam.");

      onStartExam(exam.name, data.questions, config);
    } catch (err) {
      console.error("Exam fetch failed:", err);
      setErrorMsg(err.message || "Could not retrieve or parse questions for this exam.");
      setFetching(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
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
