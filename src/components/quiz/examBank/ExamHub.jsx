import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import PracticeTab from "./PracticeTab";
import StudyGuideTab from "./StudyGuideTab";
import FlashcardsTab from "./FlashcardsTab";
import VideosTab from "./VideosTab";

const TABS = [
  { id: "practice", label: "Practice", key: "practice" },
  { id: "studyguide", label: "Study Guide", key: "studyguide" },
  { id: "flashcards", label: "Flashcards", key: "flashcards" },
  { id: "videos", label: "Videos", key: "videos" },
];

/**
 * Per-exam hub: checks resource availability once, then shows tabs for
 * whichever of Practice / Study Guide / Flashcards / Videos actually exist.
 * Practice hands off to QuizApp's shared quiz-taking UI via onStartExam;
 * the other three tabs are self-contained.
 */
export default function ExamHub({ exam, onBack, onStartExam }) {
  const [availability, setAvailability] = useState(null); // null while loading
  const [activeTab, setActiveTab] = useState("practice");

  useEffect(() => {
    let cancelled = false;
    setAvailability(null);
    fetch(`/api/exam-resources?exam=${encodeURIComponent(exam.slug)}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) { setAvailability(data); setActiveTab("practice"); } })
      .catch(() => { if (!cancelled) setAvailability({ practice: true, flashcards: false, studyguide: false, videos: false }); });
    return () => { cancelled = true; };
  }, [exam.slug]);

  return (
    <div>
      <button
        className="quiz-btn"
        style={{ background: "transparent", border: "none", color: "var(--text-muted)", padding: "0 0 16px", fontSize: 13 }}
        onClick={onBack}
      >
        ← Back to Exam Bank
      </button>

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px" }}>{exam.name}</h2>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>{exam.vendor}</p>
      </div>

      {availability === null ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <RefreshCw size={24} className="spin" style={{ marginBottom: 8 }} />
          <div>Checking available resources…</div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 12, flexWrap: "wrap" }}>
            {TABS.map((tab) => {
              const enabled = availability[tab.key];
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className="quiz-btn"
                  disabled={!enabled}
                  title={enabled ? undefined : "Not available for this exam"}
                  style={{
                    background: active ? "var(--bg-secondary)" : "transparent",
                    color: enabled ? "var(--text-primary)" : "var(--text-muted)",
                    border: "none", padding: "10px 18px", borderRadius: 8,
                    fontWeight: active ? 600 : 400,
                    opacity: enabled ? 1 : 0.45,
                    cursor: enabled ? "pointer" : "not-allowed",
                  }}
                  onClick={() => enabled && setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "practice" && <PracticeTab exam={exam} onStartExam={onStartExam} />}
          {activeTab === "studyguide" && availability.studyguide && <StudyGuideTab exam={exam} />}
          {activeTab === "flashcards" && availability.flashcards && <FlashcardsTab exam={exam} />}
          {activeTab === "videos" && availability.videos && <VideosTab exam={exam} />}
        </>
      )}
    </div>
  );
}
