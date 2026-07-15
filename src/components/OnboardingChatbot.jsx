import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, Loader2, Map, Compass, BookOpen, Bookmark, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { generateOnboardingRecommendation, matchManualAndReferenceDetails } from "../services/aiService";
import { ROADMAP_CATALOG, SECTION_CATALOG, MANUAL_CATEGORY_CATALOG, REFERENCE_TAG_CATALOG } from "../data/onboardingCatalog";
import { MANUAL_STRUCTURE } from "../data/manualData";
import { REFERENCE_STRUCTURE } from "../data/referenceData";

// Fixed, structured questions — no LLM call until the last one is answered.
const QUESTIONS = [
  {
    key: "background",
    prompt: "First up — what's your current background?",
    type: "choice",
    options: ["Complete beginner", "Some coding, new to AI/ML", "Comfortable with Python, new to AI/ML", "Experienced, want to go deeper on GenAI"],
  },
  {
    key: "goal",
    prompt: "What do you want to be able to do? (be as specific as you like)",
    type: "text",
    placeholder: "e.g. build RAG systems, pass AI engineering interviews, understand transformers...",
  },
  {
    key: "time",
    prompt: "How much time can you realistically commit per week?",
    type: "choice",
    options: ["1-3 hrs/week", "5-7 hrs/week", "10+ hrs/week", "Not sure yet"],
  },
  {
    key: "format",
    prompt: "How do you learn best?",
    type: "choice",
    options: ["Hands-on projects over theory", "Structured reading/theory first", "Mix of both", "Interview-style practice"],
  },
];

export default function OnboardingChatbot({
  mode = "modal", // "modal" | "panel"
  onClose,
  onComplete, // (answers, recommendation) => void — App.jsx persists this
  navigateToSection, // (sectionId) => void
  setActivePath,
  setShowCurriculumMap,
  setShowManual,
  setActiveManualPhase,
  setShowReference,
  setActiveReferenceTopic,
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState(null); // stage 1 result (validated)
  const [manualMatches, setManualMatches] = useState([]);
  const [referenceMatches, setReferenceMatches] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [step, isLoading, recommendation]);

  const currentQuestion = QUESTIONS[step];
  const isDone = step >= QUESTIONS.length;

  const submitAnswer = async (value) => {
    const nextAnswers = { ...answers, [currentQuestion.key]: value };
    setAnswers(nextAnswers);
    setTextInput("");

    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
      return;
    }

    // Last question answered — fire the single LLM call.
    setStep(QUESTIONS.length);
    setIsLoading(true);
    setError(null);

    try {
      const raw = await generateOnboardingRecommendation(nextAnswers, {
        roadmapCatalog: ROADMAP_CATALOG,
        sectionCatalog: SECTION_CATALOG,
        manualCategoryCatalog: MANUAL_CATEGORY_CATALOG,
        referenceTagCatalog: REFERENCE_TAG_CATALOG,
      });

      // Validate against the real catalogs — never trust the model's ids directly.
      const validRoadmap = ROADMAP_CATALOG.some((r) => r.id === raw.recommendedRoadmap)
        ? raw.recommendedRoadmap
        : null;
      const validSections = raw.sections.filter((s) =>
        SECTION_CATALOG.some((cat) => cat.id === s.sectionId)
      );
      const validManualCategories = raw.manualCategories.filter((slug) =>
        MANUAL_CATEGORY_CATALOG.some((c) => c.slug === slug)
      );
      const validReferenceTags = raw.referenceTags.filter((tag) =>
        REFERENCE_TAG_CATALOG.includes(tag)
      );

      const validated = {
        message: raw.message,
        recommendedRoadmap: validRoadmap,
        sections: validSections,
      };
      setRecommendation(validated);

      // Stage 2 — local matching, no API call.
      const { manualMatches: mMatches, referenceMatches: rMatches } = matchManualAndReferenceDetails(
        validManualCategories,
        validReferenceTags,
        nextAnswers,
        MANUAL_STRUCTURE,
        REFERENCE_STRUCTURE
      );
      setManualMatches(mMatches);
      setReferenceMatches(rMatches);

      if (onComplete) {
        onComplete(nextAnswers, { ...validated, manualMatches: mMatches, referenceMatches: rMatches });
      }
    } catch (err) {
      console.error("Onboarding recommendation failed:", err);
      setError(err.message || "Something went wrong generating your recommendation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoadmapClick = (roadmapId) => {
    if (setActivePath) setActivePath(roadmapId);
    if (setShowCurriculumMap) setShowCurriculumMap(true);
    if (onClose) onClose();
  };

  const handleSectionClick = (sectionId) => {
    if (navigateToSection) navigateToSection(sectionId);
    if (onClose) onClose();
  };

  const handleManualClick = (match) => {
    if (setShowManual) setShowManual(true);
    if (setActiveManualPhase) setActiveManualPhase(match);
    if (onClose) onClose();
  };

  const handleReferenceClick = (sheet) => {
    if (setShowReference) setShowReference(true);
    if (setActiveReferenceTopic) setActiveReferenceTopic(sheet);
    if (onClose) onClose();
  };

  const roadmapLabel = recommendation?.recommendedRoadmap
    ? ROADMAP_CATALOG.find((r) => r.id === recommendation.recommendedRoadmap)?.label
    : null;

  const containerStyle =
    mode === "modal"
      ? {
          position: "fixed",
          inset: 0,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }
      : {
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "420px",
          maxWidth: "100vw",
          zIndex: 200,
        };

  const panelStyle = {
    width: mode === "modal" ? "min(560px, 92vw)" : "100%",
    height: mode === "modal" ? "min(640px, 88vh)" : "100%",
    background: "var(--bg2, #12121a)",
    border: "1px solid var(--neon, #7c3aed)",
    borderRadius: mode === "modal" ? "16px" : "0",
    boxShadow: "0 0 40px rgba(124,58,237,0.25)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "var(--font, inherit)",
    color: "var(--text, #e5e5e5)",
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, scale: mode === "modal" ? 0.96 : 1, x: mode === "panel" ? 40 : 0 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={panelStyle}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(124,58,237,0.25)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={16} color="var(--neon, #7c3aed)" />
            <span style={{ fontFamily: "var(--mono, monospace)", fontSize: "13px", letterSpacing: "0.5px" }}>
              ONBOARDING_GUIDE
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text2, #999)" }}
            aria-label="Close onboarding chatbot"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Answered questions render as a simple transcript */}
          {QUESTIONS.slice(0, step).map((q) => (
            <div key={q.key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Bubble role="assistant">{q.prompt}</Bubble>
              <Bubble role="user">{answers[q.key]}</Bubble>
            </div>
          ))}

          {/* Current question */}
          {!isDone && currentQuestion && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Bubble role="assistant">{currentQuestion.prompt}</Bubble>
              {currentQuestion.type === "choice" ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => submitAnswer(opt)}
                      style={choiceButtonStyle}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (textInput.trim()) submitAnswer(textInput.trim());
                  }}
                  style={{ display: "flex", gap: "8px" }}
                >
                  <input
                    autoFocus
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    style={textInputStyle}
                  />
                  <button type="submit" style={{ ...choiceButtonStyle, whiteSpace: "nowrap" }}>
                    Send
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Loading state during the single LLM call */}
          {isLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text2, #999)" }}>
              <Loader2 size={16} className="spin" style={{ animation: "spin 1s linear infinite" }} />
              <span>Thinking about the best starting point for you...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div style={{ color: "#f87171", fontSize: "13px" }}>
              {error}{" "}
              <button
                onClick={() => submitAnswer(answers[QUESTIONS[QUESTIONS.length - 1].key])}
                style={{ background: "none", border: "none", color: "var(--neon, #7c3aed)", cursor: "pointer", textDecoration: "underline" }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Recommendation */}
          {recommendation && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Bubble role="assistant">{recommendation.message}</Bubble>

              {roadmapLabel && (
                <RecommendationCard
                  icon={<Map size={16} />}
                  title={roadmapLabel}
                  subtitle="Recommended roadmap"
                  onClick={() => handleRoadmapClick(recommendation.recommendedRoadmap)}
                />
              )}

              {recommendation.sections.length > 0 && (
                <ChipGroup label="Tools & sections">
                  {recommendation.sections.map((s) => {
                    const meta = SECTION_CATALOG.find((c) => c.id === s.sectionId);
                    return (
                      <Chip
                        key={s.sectionId}
                        icon={<Compass size={13} />}
                        label={meta?.label || s.sectionId}
                        title={s.reason}
                        onClick={() => handleSectionClick(s.sectionId)}
                      />
                    );
                  })}
                </ChipGroup>
              )}

              {manualMatches.length > 0 && (
                <ChipGroup label="From the Manual">
                  {manualMatches.map((m) => (
                    <Chip
                      key={`${m.categorySlug}-${m.guideSlug}`}
                      icon={<BookOpen size={13} />}
                      label={m.title}
                      onClick={() => handleManualClick(m)}
                    />
                  ))}
                </ChipGroup>
              )}

              {referenceMatches.length > 0 && (
                <ChipGroup label="From Quick Reference">
                  {referenceMatches.map((sheet) => (
                    <Chip
                      key={sheet.slug}
                      icon={<Bookmark size={13} />}
                      label={sheet.title}
                      onClick={() => handleReferenceClick(sheet)}
                    />
                  ))}
                </ChipGroup>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Bubble({ role, children }) {
  const isAssistant = role === "assistant";
  return (
    <div
      style={{
        alignSelf: isAssistant ? "flex-start" : "flex-end",
        maxWidth: "85%",
        padding: "10px 14px",
        borderRadius: "12px",
        background: isAssistant ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.06)",
        border: isAssistant ? "1px solid rgba(124,58,237,0.3)" : "1px solid rgba(255,255,255,0.1)",
        fontSize: "14px",
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}

function RecommendationCard({ icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "14px 16px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))",
        border: "1px solid rgba(124,58,237,0.4)",
        color: "var(--text, #e5e5e5)",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {icon}
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: "12px", color: "var(--text2, #999)" }}>{subtitle}</div>
        </div>
      </div>
      <ArrowUpRight size={16} />
    </button>
  );
}

function ChipGroup({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text2, #999)", fontFamily: "var(--mono, monospace)" }}>
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>{children}</div>
    </div>
  );
}

function Chip({ icon, label, title, onClick }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "7px 12px",
        borderRadius: "20px",
        background: "rgba(6,182,212,0.1)",
        border: "1px solid rgba(6,182,212,0.35)",
        color: "var(--text, #e5e5e5)",
        fontSize: "12.5px",
        cursor: "pointer",
      }}
    >
      {icon}
      {label}
      <ArrowUpRight size={12} />
    </button>
  );
}

const choiceButtonStyle = {
  padding: "8px 14px",
  borderRadius: "20px",
  background: "rgba(124,58,237,0.1)",
  border: "1px solid rgba(124,58,237,0.4)",
  color: "var(--text, #e5e5e5)",
  fontSize: "13px",
  cursor: "pointer",
};

const textInputStyle = {
  flex: 1,
  padding: "10px 14px",
  borderRadius: "10px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.15)",
  color: "var(--text, #e5e5e5)",
  fontSize: "14px",
  outline: "none",
};
