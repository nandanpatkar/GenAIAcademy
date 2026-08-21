import React, { useEffect, useMemo, useState } from "react";
import { NinjaEye } from "./NinjaEye";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  Compass,
  FlaskConical,
  Gauge,
  Layers3,
  Loader2,
  Map,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  Trophy,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import "../styles/Pathfinder.css";
import { PATHFINDER_PHASES, PATHFINDER_QUESTIONS, getAssessmentLabel, getAssessmentOption } from "../data/pathfinderAssessment";
import { ROADMAP_CATALOG, SECTION_CATALOG, MANUAL_CATEGORY_CATALOG, REFERENCE_TAG_CATALOG } from "../data/onboardingCatalog";
import { buildFallbackRecommendation, validateAndMergeRecommendation } from "../services/pathfinderService";
import { generateOnboardingRecommendation } from "../services/aiService";

const iconFor = (name) => {
  const icons = {
    spark: <Sparkles size={19} />,
    chart: <BarChart3 size={19} />,
    layers: <Layers3 size={19} />,
    target: <Target size={19} />,
    compass: <Compass size={19} />,
  };
  return icons[name] || <Sparkles size={19} />;
};

const SKILL_LABELS = {
  programming: "Programming",
  foundations: "ML foundations",
  math: "Math & stats",
  genai: "GenAI systems",
  systems: "Architecture",
};

export default function OnboardingChatbot({
  mode = "modal",
  onClose,
  onComplete,
  navigateToSection,
  setActivePath,
  setShowCurriculumMap,
  setShowManual,
  setActiveManualPhase,
  setShowReference,
  setActiveReferenceTopic,
}) {
  const [phase, setPhase] = useState("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [isLocalResult, setIsLocalResult] = useState(false);

  const currentQuestion = PATHFINDER_QUESTIONS[questionIndex];
  const currentAnswer = answers[currentQuestion?.key];
  const answeredCount = Object.keys(answers).filter((key) => answers[key] !== "skipped").length;
  const progress = phase === "results" ? 100 : phase === "intro" ? 0 : Math.round((questionIndex / PATHFINDER_QUESTIONS.length) * 100);

  useEffect(() => {
    if (phase === "assessment" && currentQuestion?.type === "text") {
      setTextInput(answers[currentQuestion.key] && answers[currentQuestion.key] !== "skipped" ? answers[currentQuestion.key] : "");
    }
  }, [phase, questionIndex]);

  const startAssessment = () => {
    setPhase("assessment");
    setQuestionIndex(0);
  };

  const submitAnswer = (value) => {
    const nextAnswers = { ...answers, [currentQuestion.key]: value };
    setAnswers(nextAnswers);
    setTextInput("");
    if (questionIndex === PATHFINDER_QUESTIONS.length - 1) {
      generateRecommendation(nextAnswers);
      return;
    }
    setQuestionIndex((index) => index + 1);
  };

  const generateRecommendation = async (nextAnswers) => {
    const fallback = buildFallbackRecommendation(nextAnswers);
    setPhase("analyzing");
    setIsLoading(true);
    try {
      const raw = await generateOnboardingRecommendation(nextAnswers, {
        roadmapCatalog: ROADMAP_CATALOG,
        sectionCatalog: SECTION_CATALOG,
        manualCategoryCatalog: MANUAL_CATEGORY_CATALOG,
        referenceTagCatalog: REFERENCE_TAG_CATALOG,
      });
      const merged = validateAndMergeRecommendation(raw, fallback);
      setRecommendation(merged);
      setIsLocalResult(false);
      onComplete?.(nextAnswers, merged);
    } catch (error) {
      console.info("Pathfinder is using its local recommendation engine:", error?.message || error);
      setRecommendation(fallback);
      setIsLocalResult(true);
      onComplete?.(nextAnswers, fallback);
    } finally {
      setIsLoading(false);
      setPhase("results");
    }
  };

  const resetAssessment = () => {
    setAnswers({});
    setRecommendation(null);
    setIsLocalResult(false);
    setQuestionIndex(0);
    setTextInput("");
    setPhase("intro");
  };

  const openRoadmap = (roadmapId) => {
    setActivePath?.(roadmapId);
    setShowCurriculumMap?.(true);
    onClose?.();
  };

  const openSection = (sectionId) => {
    navigateToSection?.(sectionId);
    onClose?.();
  };

  const openManual = (match) => {
    setShowManual?.(true);
    setActiveManualPhase?.(match);
    onClose?.();
  };

  const openReference = (sheet) => {
    setShowReference?.(true);
    setActiveReferenceTopic?.(sheet);
    onClose?.();
  };

  return (
    <div className={`pathfinder-overlay pathfinder-overlay-${mode}`} role="dialog" aria-modal="true" aria-label="AI Pathfinder">
      <motion.div
        className={`pathfinder-shell pathfinder-shell-${mode}`}
        initial={{ opacity: 0, y: mode === "modal" ? 18 : 0, x: mode === "panel" ? 30 : 0 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="pathfinder-topbar">
          <div className="pathfinder-brand">
            <span className="pathfinder-brand-mark"><Sparkles size={16} /></span>
            <div><strong>AI PATHFINDER</strong><span>PERSONAL LEARNING SYSTEM</span></div>
          </div>
          <div className="pathfinder-topbar-center"><span className="pathfinder-live-dot" /> calibration mode <span className="pathfinder-topbar-divider" /> v1.0</div>
          <button className="pathfinder-close" onClick={onClose} aria-label="Close AI Pathfinder"><span>ESC</span><X size={17} /></button>
        </header>

        <div className="pathfinder-progress-line"><span style={{ width: `${progress}%` }} /></div>

        <main className="pathfinder-body">
          {phase === "intro" && <IntroView onStart={startAssessment} />}
          {phase === "assessment" && (
            <AssessmentView
              question={currentQuestion}
              questionIndex={questionIndex}
              answers={answers}
              currentAnswer={currentAnswer}
              textInput={textInput}
              setTextInput={setTextInput}
              onSubmit={submitAnswer}
              onBack={() => setQuestionIndex((index) => Math.max(0, index - 1))}
            />
          )}
          {phase === "analyzing" && <AnalyzingView isLoading={isLoading} />}
          {phase === "results" && recommendation && (
            <ResultsView
              recommendation={recommendation}
              answeredCount={answeredCount}
              isLocalResult={isLocalResult}
              answers={answers}
              onReset={resetAssessment}
              onOpenRoadmap={openRoadmap}
              onOpenSection={openSection}
              onOpenManual={openManual}
              onOpenReference={openReference}
            />
          )}
        </main>
      </motion.div>
    </div>
  );
}

function IntroView({ onStart }) {
  return (
    <section className="pathfinder-intro">
      <div className="pathfinder-intro-copy">
        <span className="pathfinder-kicker"><span className="pathfinder-kicker-line" /> YOUR NEXT CHAPTER</span>
        <h1>Find the path that makes your ambition <em>buildable.</em></h1>
        <p className="pathfinder-intro-lede">A short, thoughtful assessment of your goals, technical baseline, and available time. We will turn the signal into a learning path that fits the way you actually want to grow.</p>
        <div className="pathfinder-intro-actions">
          <button className="pathfinder-primary-button" onClick={onStart}>Start readiness scan <ArrowRight size={17} /></button>
          <span className="pathfinder-duration"><Timer size={14} /> 3 minutes · 9 questions</span>
        </div>
        <div className="pathfinder-trust-row"><span><Check size={13} /> No grades</span><span><Check size={13} /> Skip anything</span><span><Check size={13} /> Recalibrate anytime</span></div>
      </div>
      <div className="pathfinder-intro-visual" aria-hidden="true">
        <div className="pathfinder-orbit orbit-one" /><div className="pathfinder-orbit orbit-two" /><div className="pathfinder-orbit orbit-three" />
        <div className="pathfinder-orbit-core"><Sparkles size={35} /><span>YOUR<br /><b>SIGNAL</b></span></div>
        <span className="pathfinder-node node-one"><Code2 size={16} /></span><span className="pathfinder-node node-two"><FlaskConical size={17} /></span><span className="pathfinder-node node-three"><Layers3 size={16} /></span><span className="pathfinder-node node-four"><Target size={15} /></span>
        <span className="pathfinder-visual-label visual-label-one">GOAL</span><span className="pathfinder-visual-label visual-label-two">SKILL</span><span className="pathfinder-visual-label visual-label-three">RHYTHM</span>
      </div>
      <div className="pathfinder-intro-footer">
        <span className="pathfinder-footer-label">WHAT YOU WILL GET</span>
        <div className="pathfinder-intro-benefits"><Benefit icon={<Map size={16} />} title="A clear route" copy="One best-fit roadmap, plus alternatives." /><Benefit icon={<Gauge size={16} />} title="A skill signal" copy="Know where to focus first." /><Benefit icon={<WandSparkles size={16} />} title="Useful momentum" copy="Three actions you can take today." /></div>
      </div>
    </section>
  );
}

function Benefit({ icon, title, copy }) {
  return <div className="pathfinder-benefit"><span className="pathfinder-benefit-icon">{icon}</span><div><strong>{title}</strong><span>{copy}</span></div></div>;
}

function AssessmentView({ question, questionIndex, answers, currentAnswer, textInput, setTextInput, onSubmit, onBack }) {
  const phaseIndex = Math.max(0, PATHFINDER_PHASES.findIndex((phase) => phase.id === question.step));
  const isText = question.type === "text";
  return (
    <section className="pathfinder-assessment">
      <aside className="pathfinder-assessment-rail">
        <div className="pathfinder-rail-heading"><span>ASSESSMENT</span><strong>{String(questionIndex + 1).padStart(2, "0")} <small>/ {String(PATHFINDER_QUESTIONS.length).padStart(2, "0")}</small></strong></div>
        <div className="pathfinder-phase-list">{PATHFINDER_PHASES.map((phase, index) => <div className={`pathfinder-phase ${index === phaseIndex ? "active" : ""} ${index < phaseIndex ? "complete" : ""}`} key={phase.id}><span>{index < phaseIndex ? <Check size={12} /> : String(index + 1).padStart(2, "0")}</span><div><strong>{phase.label}</strong><small>{index === 0 ? "Set your direction" : index === 1 ? "Find your altitude" : "Design your rhythm"}</small></div></div>)}</div>
        <div className="pathfinder-rail-note"><Sparkles size={15} /><span>We look for a promising starting point, not a perfect score.</span></div>
      </aside>
      <div className="pathfinder-question-area">
        <div className="pathfinder-question-meta"><span className="pathfinder-kicker"><span className="pathfinder-kicker-line" /> {question.eyebrow}</span><span className="pathfinder-answer-count">{Object.keys(answers).length} answered</span></div>
        <AnimatePresence mode="wait">
          <motion.div key={question.key} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.22 }}>
            <h2 className="pathfinder-question-title">{question.title}</h2><p className="pathfinder-question-helper">{question.helper}</p>
            {isText ? <form className="pathfinder-text-form" onSubmit={(event) => { event.preventDefault(); onSubmit(textInput.trim() || "skipped"); }}><textarea autoFocus value={textInput} onChange={(event) => setTextInput(event.target.value)} placeholder={question.placeholder} rows={4} /><div className="pathfinder-input-footer"><span>{textInput.length}/240</span><button className="pathfinder-primary-button" type="submit">Continue <ArrowRight size={16} /></button></div></form> : <div className="pathfinder-option-grid">{question.options.map((option, index) => <button key={option.id} className={`pathfinder-option ${currentAnswer === option.id ? "selected" : ""}`} onClick={() => onSubmit(option.id)}><span className="pathfinder-option-icon">{option.icon ? iconFor(option.icon) : <span>{String.fromCharCode(65 + index)}</span>}</span><span className="pathfinder-option-copy"><strong>{option.label}</strong><small>{option.detail}</small></span><span className="pathfinder-option-check">{currentAnswer === option.id ? <Check size={14} /> : <ArrowUpRight size={14} />}</span></button>)}</div>}
            <div className="pathfinder-question-actions"><button className="pathfinder-back-button" onClick={onBack} disabled={questionIndex === 0}><ChevronLeft size={16} /> Back</button><button className="pathfinder-skip-button" onClick={() => onSubmit("skipped")}>I’m not sure <ChevronRight size={15} /></button></div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function AnalyzingView() {
  return <section className="pathfinder-analyzing"><div className="pathfinder-analysis-core"><span /><span /><span /><Sparkles size={24} /></div><span className="pathfinder-kicker"><span className="pathfinder-kicker-line" /> SYNTHESIZING YOUR SIGNAL</span><h2>Connecting the dots.</h2><p>We are matching your baseline and ambition against the paths, labs, manuals, and tools in your workspace.</p><div className="pathfinder-analysis-steps"><span><Check size={13} /> Reading your direction</span><span><NinjaEye size={16} labelled={false} /> Finding the right altitude</span><span><Zap size={13} /> Selecting first actions</span></div></section>;
}

function ResultsView({ recommendation, answeredCount, isLocalResult, answers, onReset, onOpenRoadmap, onOpenSection, onOpenManual, onOpenReference }) {
  const roadmap = recommendation.roadmap || ROADMAP_CATALOG.find((item) => item.id === recommendation.recommendedRoadmap);
  const toolRecommendations = recommendation.toolRecommendations || recommendation.sections || [];
  const profile = recommendation.skillProfile || {};
  const missionQuestion = PATHFINDER_QUESTIONS.find((question) => question.key === "mission");
  const goal = answers.goal && answers.goal !== "skipped" ? answers.goal : "A focused, practical AI learning journey";
  const altRoadmaps = recommendation.alternateRoadmaps || [];
  return (
    <section className="pathfinder-results">
      <div className="pathfinder-results-heading"><div><span className="pathfinder-kicker"><span className="pathfinder-kicker-line" /> YOUR PERSONAL ROUTE</span><h1>Here is where your signal points.</h1><p>{recommendation.message}</p></div><button className="pathfinder-reset-button" onClick={onReset}><RotateCcw size={14} /> Recalibrate</button></div>
      <div className="pathfinder-results-grid">
        <div className="pathfinder-recommendation-hero"><div className="pathfinder-hero-glow" /><div className="pathfinder-card-topline"><span><Sparkles size={14} /> BEST FIT FOR YOU</span><small>{isLocalResult ? "LOCAL ENGINE" : "AI + LOCAL ENGINE"}</small></div><div className="pathfinder-recommendation-icon"><Map size={22} /></div><span className="pathfinder-result-label">PRIMARY LEARNING PATH</span><h2>{roadmap?.label || "Your learning path"}</h2><p>{roadmap?.description || "A structured route through the project’s learning ecosystem."}</p><button className="pathfinder-hero-button" onClick={() => onOpenRoadmap(roadmap?.id)}>Open this path <ArrowUpRight size={16} /></button><div className="pathfinder-fit-line"><span><Check size={13} /> {recommendation.readinessLabel || "Personalized starting point"}</span><span><Clock3 size={13} /> {recommendation.consistency || 50}% rhythm fit</span></div></div>
        <div className="pathfinder-signal-card"><div className="pathfinder-card-topline"><span><Gauge size={14} /> READINESS SIGNAL</span><small>{answeredCount}/9 RESPONDED</small></div><div className="pathfinder-score"><strong>{recommendation.consistency || 50}</strong><span>/ 100<br />momentum</span></div><div className="pathfinder-skill-list">{Object.entries(SKILL_LABELS).map(([key, label]) => <SkillBar key={key} label={label} value={profile[key] || 0} />)}</div></div>
        <div className="pathfinder-actions-card"><div className="pathfinder-card-topline"><span><Zap size={14} /> START HERE</span><small>FIRST 3 MOVES</small></div><div className="pathfinder-action-list">{(recommendation.firstActions || []).slice(0, 3).map((action, index) => <div className="pathfinder-action" key={action}><span>0{index + 1}</span><p>{action}</p><ArrowRight size={14} /></div>)}</div></div>
      </div>
      <div className="pathfinder-section-heading"><div><span className="pathfinder-kicker"><span className="pathfinder-kicker-line" /> YOUR TOOLKIT</span><h2>Use the workspace as your advantage.</h2></div><span className="pathfinder-section-count">{toolRecommendations.length} tools selected</span></div>
      <div className="pathfinder-tools-grid">{toolRecommendations.map((item, index) => { const meta = SECTION_CATALOG.find((section) => section.id === item.sectionId); return <button className="pathfinder-tool-card" key={item.sectionId} onClick={() => onOpenSection(item.sectionId)}><span className="pathfinder-tool-index">0{index + 1}</span><span className="pathfinder-tool-icon">{index === 0 ? <FlaskConical size={18} /> : index === 1 ? <Code2 size={18} /> : index === 2 ? <Layers3 size={18} /> : <BookOpen size={18} />}</span><strong>{meta?.label || item.sectionId}</strong><p>{item.reason || meta?.description}</p><ArrowUpRight className="pathfinder-tool-arrow" size={15} /></button>; })}</div>
      {(altRoadmaps.length > 0 || recommendation.manualMatches?.length > 0 || recommendation.referenceMatches?.length > 0) && <div className="pathfinder-discovery-grid"><div className="pathfinder-alternates"><div className="pathfinder-card-topline"><span><Compass size={14} /> OTHER DIRECTIONS</span><small>IF YOUR GOAL SHIFTS</small></div>{altRoadmaps.map((path) => <button key={path.id} onClick={() => onOpenRoadmap(path.id)}><span><Map size={15} /></span><div><strong>{path.label}</strong><small>{path.description}</small></div><ArrowRight size={15} /></button>)}</div><div className="pathfinder-resources"><div className="pathfinder-card-topline"><span><BookOpen size={14} /> DEEPEN THE SIGNAL</span><small>FROM YOUR LIBRARY</small></div>{(recommendation.manualMatches || []).slice(0, 2).map((match) => <button key={`${match.categorySlug}-${match.guideSlug}`} onClick={() => onOpenManual(match)}><BookOpen size={15} /><span>{match.title}</span><ArrowUpRight size={14} /></button>)}{(recommendation.referenceMatches || []).slice(0, 2).map((sheet) => <button key={sheet.slug} onClick={() => onOpenReference(sheet)}><BookOpen size={15} /><span>{sheet.title}</span><ArrowUpRight size={14} /></button>)}</div></div>}
      <div className="pathfinder-result-footer"><span><Sparkles size={14} /> Built around “{getAssessmentLabel(missionQuestion, answers.mission)}” · You can recalibrate whenever your goals change.</span><button className="pathfinder-primary-button" onClick={() => onOpenRoadmap(roadmap?.id)}>Apply this route <ArrowRight size={16} /></button></div>
    </section>
  );
}

function SkillBar({ label, value }) {
  return <div className="pathfinder-skill"><div><span>{label}</span><b>{value}</b></div><div className="pathfinder-skill-track"><span style={{ width: `${value}%` }} /></div></div>;
}
