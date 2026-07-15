import React, { useState, useEffect } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { safeFetchJson } from "./apiHelpers";

export default function FlashcardsTab({ exam }) {
  const [cards, setCards] = useState(null); // null = loading
  const [errorMsg, setErrorMsg] = useState("");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setCards(null);
    setErrorMsg("");
    setIdx(0);
    setFlipped(false);

    safeFetchJson(`/api/exam-flashcards?exam=${encodeURIComponent(exam.slug)}`)
      .then((data) => {
        if (cancelled) return;
        if (!data.flashcards || data.flashcards.length === 0) throw new Error("No flashcards found for this exam.");
        setCards(data.flashcards);
      })
      .catch((err) => { if (!cancelled) setErrorMsg(err.message || "Could not load flashcards."); });

    return () => { cancelled = true; };
  }, [exam.slug]);

  const changeCard = (dir) => {
    const target = idx + dir;
    if (target < 0 || target >= cards.length) return;
    setFlipped(false);
    setIdx(target);
  };

  if (errorMsg) {
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "var(--danger-bg)", border: "1px solid var(--danger)", borderRadius: 12, padding: 16, color: "var(--text-primary)" }}>
        <AlertTriangle size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{errorMsg}</div>
      </div>
    );
  }

  if (!cards) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
        <RefreshCw size={24} className="spin" style={{ marginBottom: 8 }} />
        <div>Loading flashcards…</div>
      </div>
    );
  }

  const card = cards[idx];

  return (
    <div className="examhub-flashcard-wrapper">
      <div className="examhub-flashcard-scene" onClick={() => setFlipped((f) => !f)}>
        <div className={`examhub-flashcard-3d ${flipped ? "flipped" : ""}`}>
          <div className="examhub-flashcard-face examhub-flashcard-front">
            <span className="examhub-card-badge">{card.topic || "Core Concept"}</span>
            <div className="examhub-card-text-front">{card.front}</div>
            <span className="examhub-flip-hint">Click to flip</span>
          </div>
          <div className="examhub-flashcard-face examhub-flashcard-back">
            <span className="examhub-card-badge examhub-card-badge-back">{card.topic || "Explanation"}</span>
            <div className="examhub-card-text-back">{card.back}</div>
          </div>
        </div>
      </div>

      <div className="examhub-flashcard-controls">
        <button className="quiz-btn quiz-btn-secondary" onClick={() => changeCard(-1)} disabled={idx === 0}>
          Previous
        </button>
        <div className="examhub-flashcard-progress">Card {idx + 1} of {cards.length}</div>
        <button className="quiz-btn quiz-btn-secondary" onClick={() => changeCard(1)} disabled={idx === cards.length - 1}>
          Next
        </button>
      </div>
    </div>
  );
}
