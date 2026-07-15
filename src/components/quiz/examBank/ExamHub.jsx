import React, { useState, useEffect } from "react";
import PracticeTab from "./PracticeTab";
import StudyGuideTab from "./StudyGuideTab";
import FlashcardsTab from "./FlashcardsTab";
import VideosTab from "./VideosTab";
import { safeFetchJson } from "./apiHelpers";

const TABS = [
  { id: "practice", label: "Practice", key: "practice" },
  { id: "studyguide", label: "Study Guide", key: "studyguide" },
  { id: "flashcards", label: "Flashcards", key: "flashcards" },
  { id: "videos", label: "Videos", key: "videos" },
];

/**
 * Per-exam hub: Practice / Study Guide / Flashcards / Videos.
 *
 * All four tabs are always clickable — availability is fetched in the
 * background purely as a hint (a small dot on tabs known to be empty), it
 * never disables a tab. Each tab does its own fetch and shows its own
 * empty/error state, so a wrong or slow availability signal can never
 * hide content that's actually there — worst case the tab shows "nothing
 * found" instead of being blocked from loading at all.
 *
 * Practice hands off to QuizApp's shared quiz-taking UI via onStartExam;
 * the other three tabs are self-contained.
 */
export default function ExamHub({ exam, onBack, onStartExam }) {
  const [availability, setAvailability] = useState(null); // null while unknown
  const [activeTab, setActiveTab] = useState("practice");

  useEffect(() => {
    let cancelled = false;
    setAvailability(null);
    setActiveTab("practice");
    safeFetchJson(`/api/exam-resources?exam=${encodeURIComponent(exam.slug)}`)
      .then((data) => { if (!cancelled) setAvailability(data); })
      .catch(() => { /* silently ignore — tabs stay fully usable without this hint */ });
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

      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 12, flexWrap: "wrap" }}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          // Only ever used as a subtle hint once resolved false — never gates the click.
          const knownEmpty = availability !== null && tab.key !== "practice" && availability[tab.key] === false;
          return (
            <button
              key={tab.id}
              className="quiz-btn"
              title={knownEmpty ? "May be limited for this exam — click to check" : undefined}
              style={{
                background: active ? "var(--bg-secondary)" : "transparent",
                color: "var(--text-primary)",
                border: "none", padding: "10px 18px", borderRadius: 8,
                fontWeight: active ? 600 : 400,
                opacity: knownEmpty ? 0.6 : 1,
                display: "flex", alignItems: "center", gap: 6,
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "practice" && <PracticeTab exam={exam} onStartExam={onStartExam} />}
      {activeTab === "studyguide" && <StudyGuideTab exam={exam} />}
      {activeTab === "flashcards" && <FlashcardsTab exam={exam} />}
      {activeTab === "videos" && <VideosTab exam={exam} />}
    </div>
  );
}
