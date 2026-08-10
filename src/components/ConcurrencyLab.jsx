import React, { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, ChevronLeft,
  ChevronRight, CircleHelp, Cloud, Code2, Copy, Eye, EyeOff, Gauge,
  Layers3, Lightbulb, ListChecks, Play, RotateCcw, Sparkles, Terminal,
  TimerReset, Trophy, X, Zap,
} from "lucide-react";
import { configureMonaco } from "../config/monacoLoader";
import { executeCode } from "../services/jdoodleService";
import { ASYNC_THEORY, MISSION_THEORY, QUEST_MISSIONS, QUICK_REFERENCE } from "../data/concurrencyScenarios";
import "./ConcurrencyLab.css";

configureMonaco();

const PROGRESS_KEY = "genai_python_concurrency_quest_v1";
const VIEW_TABS = [
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "practice", label: "Practice", icon: Code2 },
  { id: "reference", label: "Reference", icon: ListChecks },
];

const loadProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};
  } catch {
    return {};
  }
};

const checkSubmission = (mission, code, output) => {
  const check = mission.check || {};
  const missing = (check.requiredCode || []).find((piece) => !code.includes(piece));
  if (missing) return { passed: false, message: `Your code still needs: ${missing}` };

  const forbidden = (check.forbiddenCode || []).find((piece) => code.includes(piece));
  if (forbidden) return { passed: false, message: `Remove the blocking pattern: ${forbidden}` };

  const absentOutput = (check.outputIncludes || []).find((piece) => !output.includes(piece));
  if (absentOutput) return { passed: false, message: `Expected the output to include: ${absentOutput}` };

  if (check.outputOrder) {
    let cursor = -1;
    for (const piece of check.outputOrder) {
      const next = output.indexOf(piece, cursor + 1);
      if (next === -1) return { passed: false, message: `Expected this next in the output: ${piece}` };
      cursor = next;
    }
  }

  return { passed: true, message: "Mission checks passed. You made the event loop proud." };
};

const inlineCode = (text) => text.split(/(`[^`]+`)/g).map((part, index) =>
  part.startsWith("`") && part.endsWith("`")
    ? <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>
    : part
);

function Timeline({ mission, mode, onModeChange }) {
  const [runKey, setRunKey] = useState(0);
  const reduceMotion = useReducedMotion();
  const tasks = mode === "sync" ? mission.syncTasks : mission.asyncTasks;
  const total = Math.max(...tasks.map((task) => task.start + task.duration), 1);

  useEffect(() => setRunKey((value) => value + 1), [mission.id, mode]);

  return (
    <section className="cq-timeline-card" aria-labelledby="timeline-title">
      <div className="cq-section-head">
        <div>
          <span className="cq-kicker"><Gauge size={14} /> live mental model</span>
          <h2 id="timeline-title">Watch the waiting time move</h2>
        </div>
        <div className="cq-mode-switch" aria-label="Timeline execution mode">
          <button className={mode === "sync" ? "is-active" : ""} onClick={() => onModeChange("sync")}>Sync</button>
          <button className={mode === "async" ? "is-active" : ""} onClick={() => onModeChange("async")}>Async</button>
        </div>
      </div>

      <div className="cq-clock-row">
        <span>0s</span>
        <div className="cq-clock-rule" />
        <span>{total}s</span>
      </div>

      <div className="cq-lanes">
        {tasks.map((task, index) => (
          <div className="cq-lane" key={`${mission.id}-${mode}-${task.name}`}>
            <span className="cq-lane-label">{task.name}</span>
            <div className="cq-lane-track">
              <motion.div
                key={`${runKey}-${task.name}`}
                className={`cq-task-bar cq-${task.color}`}
                style={{ left: `${(task.start / total) * 100}%`, width: `${(task.duration / total) * 100}%` }}
                initial={{ scaleX: reduceMotion ? 1 : 0, opacity: 0.5 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  duration: reduceMotion ? 0 : Math.max(0.32, (task.duration / total) * 1.6),
                  delay: reduceMotion ? 0 : (task.start / total) * 1.1 + index * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span>{task.duration}s</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      <div className="cq-timeline-foot">
        <p>
          <strong>{mode === "sync" ? "One after another." : "Waiting overlaps."}</strong>{" "}
          {mode === "sync"
            ? `This schedule finishes around ${total} seconds.`
            : `The event loop keeps ready tasks moving and finishes around ${total} seconds.`}
        </p>
        <button className="cq-replay" onClick={() => setRunKey((value) => value + 1)}>
          <RotateCcw size={14} /> Replay
        </button>
      </div>
    </section>
  );
}

function TheoryPanel({ mission }) {
  const [topic, setTopic] = useState("plain");
  const chapterTheory = MISSION_THEORY[mission.id];

  useEffect(() => setTopic("plain"), [mission.id]);

  return (
    <section className="cq-theory" aria-labelledby="theory-title">
      <div className="cq-theory-head">
        <div>
          <span className="cq-kicker"><BookOpen size={14} /> theory in easy language</span>
          <h2 id="theory-title">What is asynchronous programming?</h2>
          <p>Build the idea first. The Python words will make more sense afterwards.</p>
        </div>
        <div className="cq-theory-tabs" aria-label="Theory topics">
          <button className={topic === "plain" ? "is-active" : ""} onClick={() => setTopic("plain")}>Plain English</button>
          <button className={topic === "flow" ? "is-active" : ""} onClick={() => setTopic("flow")}>How it works</button>
          <button className={topic === "code" ? "is-active" : ""} onClick={() => setTopic("code")}>Read the code</button>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {topic === "plain" && (
          <motion.div className="cq-theory-plain" key="plain" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <article className="cq-definition-card">
              <span>Simple definition</span>
              <p>{ASYNC_THEORY.definition}</p>
            </article>
            <article className="cq-analogy-card">
              <div className="cq-analogy-visual" aria-hidden="true">
                <span className="cq-kettle">Kettle<small>waiting</small></span>
                <ArrowRight size={18} />
                <span className="cq-toast">Toast<small>working</small></span>
              </div>
              <div><span>Think like a cook</span><p>{ASYNC_THEORY.analogy}</p></div>
            </article>
            <article className="cq-chapter-theory">
              <small>This chapter</small>
              <h3>{chapterTheory.heading}</h3>
              {chapterTheory.paragraphs.map((paragraph) => <p key={paragraph}>{inlineCode(paragraph)}</p>)}
              <div><Lightbulb size={16} /><p><strong>Remember:</strong> {chapterTheory.remember}</p></div>
            </article>
          </motion.div>
        )}

        {topic === "flow" && (
          <motion.div className="cq-theory-flow" key="flow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="cq-theory-steps">
              {ASYNC_THEORY.steps.map((step, index) => (
                <article key={step.title}>
                  <span>0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{inlineCode(step.text)}</p>
                  <code>{step.code}</code>
                </article>
              ))}
            </div>
            <div className="cq-glossary">
              <div><span className="cq-kicker"><Layers3 size={14} /> five words to know</span><h3>The small async dictionary</h3></div>
              <dl>
                {ASYNC_THEORY.glossary.map((item) => (
                  <div key={item.term}><dt>{item.term}</dt><dd>{item.meaning}</dd></div>
                ))}
              </dl>
            </div>
          </motion.div>
        )}

        {topic === "code" && (
          <motion.div className="cq-theory-code" key="code" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="cq-reading-example">
              <div className="cq-reading-code"><div><Code2 size={14} /> first_async_program.py</div><pre><code>{ASYNC_THEORY.exampleCode}</code></pre></div>
              <div className="cq-code-notes">
                <h3>Read it from top to bottom</h3>
                {ASYNC_THEORY.exampleNotes.map((note, index) => <div key={note}><span>{index + 1}</span><p>{inlineCode(note)}</p></div>)}
              </div>
            </div>
            <div className="cq-when-grid">
              <article><h3><CheckCircle2 size={17} /> Async is useful for</h3>{ASYNC_THEORY.useWhen.map((item) => <p key={item}><Check size={13} /> {item}</p>)}</article>
              <article><h3><TimerReset size={17} /> Keep it synchronous when</h3>{ASYNC_THEORY.keepSyncWhen.map((item) => <p key={item}><Check size={13} /> {item}</p>)}</article>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function QuizPanel({ mission, answers, onAnswer, onContinue }) {
  const answered = Object.keys(answers || {}).length;
  const correct = mission.quiz.filter((item, index) => answers?.[index] === item.answer).length;
  const passed = correct === mission.quiz.length;

  return (
    <section className="cq-quiz" aria-labelledby="quiz-title">
      <div className="cq-section-head">
        <div>
          <span className="cq-kicker"><CircleHelp size={14} /> prediction check</span>
          <h2 id="quiz-title">Make the mental model stick</h2>
        </div>
        <span className={`cq-score-chip ${passed ? "is-passed" : ""}`}>{correct}/{mission.quiz.length} correct</span>
      </div>

      <div className="cq-question-stack">
        {mission.quiz.map((question, questionIndex) => {
          const selected = answers?.[questionIndex];
          const hasAnswer = selected !== undefined;
          return (
            <article className="cq-question" key={question.question}>
              <div className="cq-question-number">0{questionIndex + 1}</div>
              <div className="cq-question-body">
                <h3>{question.question}</h3>
                <div className="cq-options">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selected === optionIndex;
                    const isCorrect = hasAnswer && optionIndex === question.answer;
                    const isWrong = isSelected && optionIndex !== question.answer;
                    return (
                      <button
                        key={option}
                        className={`${isSelected ? "is-selected" : ""} ${isCorrect ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""}`}
                        onClick={() => onAnswer(questionIndex, optionIndex)}
                        aria-pressed={isSelected}
                      >
                        <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                        {isCorrect && <Check size={16} />}
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence initial={false}>
                  {hasAnswer && (
                    <motion.div
                      className={`cq-explanation ${selected === question.answer ? "is-correct" : "is-wrong"}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Lightbulb size={15} />
                      <p>{question.explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </article>
          );
        })}
      </div>

      <div className="cq-quiz-footer">
        <span>{answered < mission.quiz.length ? "Answer both questions to continue." : passed ? "Concept unlocked." : "Review the explanations and try again."}</span>
        <button className="cq-primary" disabled={!passed} onClick={onContinue}>
          Open coding mission <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

function PracticePanel({ mission, code, setCode, onPass }) {
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [result, setResult] = useState(null);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOutput("");
    setResult(null);
    setSolutionOpen(false);
  }, [mission.id]);

  const runCode = async () => {
    setRunning(true);
    setResult(null);
    setOutput("Connecting to the Python runner…");
    try {
      const response = await executeCode({ script: code, language: "python3" });
      const nextOutput = response.output || "Program finished without output.";
      setOutput(nextOutput);
      if (response.statusCode && response.statusCode !== 200) {
        setResult({ passed: false, message: "Python reported an error. Read the console, fix it, and run again." });
      } else {
        const nextResult = checkSubmission(mission, code, nextOutput);
        setResult(nextResult);
        if (nextResult.passed) onPass();
      }
    } catch (error) {
      setOutput(error.message || "The runner could not execute this program.");
      setResult({ passed: false, message: "The cloud runner is unavailable. Try again or ask an administrator to check the JDoodle configuration." });
    } finally {
      setRunning(false);
    }
  };

  const resetCode = () => {
    setCode(mission.starterCode);
    setOutput("");
    setResult(null);
  };

  const copySolution = async () => {
    try {
      await navigator.clipboard.writeText(mission.solutionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="cq-practice-layout">
      <section className="cq-code-card" aria-labelledby="practice-title">
        <div className="cq-code-toolbar">
          <div>
            <span className="cq-kicker"><Cloud size={14} /> JDoodle Python 3</span>
            <h2 id="practice-title">Ship the code</h2>
          </div>
          <div className="cq-code-actions">
            <button className="cq-ghost" onClick={resetCode}><RotateCcw size={14} /> Reset</button>
            <button className="cq-run" onClick={runCode} disabled={running}>
              {running ? <TimerReset className="cq-spin" size={15} /> : <Play size={15} fill="currentColor" />}
              {running ? "Running…" : "Run & check"}
            </button>
          </div>
        </div>

        <div className="cq-editor-shell">
          <Editor
            height="390px"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            loading={<div className="cq-editor-loading">Loading the Python editor…</div>}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 22,
              padding: { top: 18, bottom: 18 },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              wordWrap: "on",
            }}
          />
        </div>

        <div className="cq-console" aria-live="polite">
          <div className="cq-console-head"><Terminal size={14} /> Output</div>
          <pre>{output || "Run the program when you are ready. Your output will appear here."}</pre>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              className={`cq-test-result ${result.passed ? "is-passed" : "is-failed"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {result.passed ? <CheckCircle2 size={18} /> : <Lightbulb size={18} />}
              <div><strong>{result.passed ? "Mission passed" : "Keep experimenting"}</strong><p>{result.message}</p></div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <aside className="cq-coach-card">
        <span className="cq-kicker"><Sparkles size={14} /> dispatch coach</span>
        <h2>Your objective</h2>
        <p>{mission.takeaway}</p>
        <div className="cq-check-list">
          {(mission.check.requiredCode || []).map((item) => <span key={item}><Check size={13} /> Use <code>{item}</code></span>)}
          {(mission.check.forbiddenCode || []).map((item) => <span key={item}><X size={13} /> Avoid <code>{item}</code></span>)}
          <span><Terminal size={13} /> Match the expected output</span>
        </div>

        <button className="cq-solution-toggle" onClick={() => setSolutionOpen((value) => !value)} aria-expanded={solutionOpen}>
          {solutionOpen ? <EyeOff size={15} /> : <Eye size={15} />}
          {solutionOpen ? "Hide reference solution" : "Show reference solution"}
          <ChevronDown size={15} />
        </button>

        <AnimatePresence initial={false}>
          {solutionOpen && (
            <motion.div
              className="cq-solution"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="cq-solution-head">
                <span>reference.py</span>
                <button onClick={copySolution}>{copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}</button>
              </div>
              <pre><code>{mission.solutionCode}</code></pre>
              <p>Compare the structure, then close the solution and reproduce it in your own words.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}

function ReferencePanel({ missions }) {
  const [openAnswer, setOpenAnswer] = useState(null);

  return (
    <div className="cq-reference-layout">
      <section className="cq-reference-main">
        <div className="cq-reference-hero">
          <span className="cq-kicker"><Layers3 size={14} /> field guide</span>
          <h1>Sync and async, without the fog</h1>
          <p>Use this page when you need a quick definition, a code shape, or another question to test yourself.</p>
        </div>

        <div className="cq-reference-grid">
          {QUICK_REFERENCE.map((item) => (
            <article key={item.term}>
              <h3>{item.term}</h3>
              <p>{item.meaning}</p>
              <code>{item.code}</code>
            </article>
          ))}
        </div>

        <div className="cq-question-bank">
          <div className="cq-section-head">
            <div>
              <span className="cq-kicker"><ListChecks size={14} /> question bank</span>
              <h2>{missions.reduce((sum, mission) => sum + mission.quiz.length, 0)} reference questions</h2>
            </div>
          </div>
          {missions.flatMap((mission) => mission.quiz.map((question, index) => ({ ...question, mission, index }))).map((item) => {
            const key = `${item.mission.id}-${item.index}`;
            const open = openAnswer === key;
            return (
              <article className="cq-bank-question" key={key}>
                <button onClick={() => setOpenAnswer(open ? null : key)} aria-expanded={open}>
                  <span>{item.mission.chapter}</span>
                  <div><small>{item.mission.shortTitle}</small><strong>{item.question}</strong></div>
                  <ChevronDown size={17} />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div className="cq-bank-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <strong>Answer: {item.options[item.answer]}</strong>
                      <p>{item.explanation}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="cq-decision-card">
        <span className="cq-kicker"><Zap size={14} /> decision shortcut</span>
        <h2>Should this be async?</h2>
        <div className="cq-decision-flow">
          <div><span>01</span><p>Does it spend meaningful time waiting?</p></div>
          <div><span>02</span><p>Can another independent task progress during that wait?</p></div>
          <div><span>03</span><p>Does the library offer a real awaitable API?</p></div>
        </div>
        <div className="cq-decision-verdict"><CheckCircle2 size={18} /><p>If all three are yes, async is probably a good fit.</p></div>
        <a href="https://docs.python.org/3/library/asyncio-task.html" target="_blank" rel="noreferrer">Python coroutine &amp; task reference <ArrowRight size={14} /></a>
      </aside>
    </div>
  );
}

export default function ConcurrencyLab({ onClose }) {
  const [activeId, setActiveId] = useState(() => localStorage.getItem("genai_concurrency_last_mission") || QUEST_MISSIONS[0].id);
  const [view, setView] = useState("learn");
  const [timelineMode, setTimelineMode] = useState("sync");
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState(loadProgress);
  const [codeByMission, setCodeByMission] = useState({});

  const mission = useMemo(() => QUEST_MISSIONS.find((item) => item.id === activeId) || QUEST_MISSIONS[0], [activeId]);
  const activeIndex = QUEST_MISSIONS.findIndex((item) => item.id === mission.id);
  const code = codeByMission[mission.id] ?? mission.starterCode;
  const missionProgress = progress[mission.id] || {};
  const completedCount = QUEST_MISSIONS.filter((item) => progress[item.id]?.quizPassed && progress[item.id]?.codePassed).length;

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem("genai_concurrency_last_mission", mission.id);
    setTimelineMode("sync");
  }, [mission.id]);

  const updateProgress = (patch) => {
    setProgress((current) => ({
      ...current,
      [mission.id]: { ...(current[mission.id] || {}), ...patch },
    }));
  };

  const answerQuestion = (questionIndex, optionIndex) => {
    const nextMissionAnswers = { ...(answers[mission.id] || {}), [questionIndex]: optionIndex };
    setAnswers((current) => ({ ...current, [mission.id]: nextMissionAnswers }));
    const allCorrect = mission.quiz.every((question, index) => nextMissionAnswers[index] === question.answer);
    if (allCorrect) updateProgress({ quizPassed: true });
  };

  const selectMission = (id) => {
    setActiveId(id);
    if (view === "reference") setView("learn");
  };

  const moveMission = (direction) => {
    const nextIndex = Math.min(Math.max(activeIndex + direction, 0), QUEST_MISSIONS.length - 1);
    selectMission(QUEST_MISSIONS[nextIndex].id);
    setView("learn");
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="concurrency-quest">
      <div className="cq-noise" aria-hidden="true" />
      <a className="cq-skip-link" href="#cq-main">Skip to mission content</a>

      <header className="cq-topbar">
        <div className="cq-brand">
          <div className="cq-brand-orbit"><Zap size={18} /></div>
          <div><strong>Concurrency Quest</strong><small>Python Labs · sync → async</small></div>
        </div>

        <nav className="cq-view-tabs" aria-label="Lab views">
          {VIEW_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} className={view === tab.id ? "is-active" : ""} onClick={() => setView(tab.id)}>
                <Icon size={15} /> {tab.label}
                {view === tab.id && <motion.span layoutId="cq-active-tab" />}
              </button>
            );
          })}
        </nav>

        <div className="cq-progress-summary">
          <Trophy size={16} />
          <div><strong>{completedCount}/{QUEST_MISSIONS.length}</strong><small>missions cleared</small></div>
          <div className="cq-progress-ring" style={{ "--progress": `${(completedCount / QUEST_MISSIONS.length) * 360}deg` }} />
        </div>
        {onClose && <button className="cq-close" onClick={onClose} aria-label="Close Python Lab"><X size={18} /></button>}
      </header>

      <div className="cq-shell">
        <aside className="cq-mission-rail" aria-label="Concurrency Quest missions">
          <div className="cq-rail-head"><span>Quest map</span><small>{QUEST_MISSIONS.length} chapters</small></div>
          <div className="cq-mission-list">
            {QUEST_MISSIONS.map((item, index) => {
              const itemProgress = progress[item.id] || {};
              const complete = itemProgress.quizPassed && itemProgress.codePassed;
              return (
                <button key={item.id} className={`${mission.id === item.id ? "is-active" : ""} ${complete ? "is-complete" : ""}`} onClick={() => selectMission(item.id)}>
                  <span className="cq-mission-index">{complete ? <Check size={14} /> : item.chapter}</span>
                  <span><strong>{item.shortTitle}</strong><small>{item.concept}</small></span>
                  {mission.id === item.id && <motion.i layoutId="cq-mission-marker" />}
                </button>
              );
            })}
          </div>
          <div className="cq-rail-note"><Sparkles size={15} /><p>Predict first. Watch the scheduler. Then prove it with code.</p></div>
        </aside>

        <main className="cq-main" id="cq-main">
          <AnimatePresence mode="wait">
            {view === "learn" && (
              <motion.div key={`learn-${mission.id}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }}>
                <section className="cq-hero">
                  <div className="cq-hero-copy">
                    <div className="cq-chapter-row"><span>Chapter {mission.chapter}</span><i /> <span>{mission.difficulty}</span><i /> <span>{mission.duration}</span></div>
                    <span className="cq-eyebrow">{mission.eyebrow}</span>
                    <h1>{mission.title}</h1>
                    <p>{mission.story}</p>
                    <div className="cq-hero-actions">
                      <button className="cq-primary" onClick={() => setTimelineMode(timelineMode === "sync" ? "async" : "sync")}>
                        <Play size={16} fill="currentColor" /> Compare {timelineMode === "sync" ? "async" : "sync"}
                      </button>
                      <button className="cq-ghost" onClick={() => setView("practice")}><Code2 size={16} /> Jump to code</button>
                    </div>
                  </div>

                  <div className="cq-orbit-stage" aria-label="Event loop illustration">
                    <motion.div className="cq-orbit cq-orbit-one" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
                      <span />
                    </motion.div>
                    <motion.div className="cq-orbit cq-orbit-two" animate={{ rotate: -360 }} transition={{ duration: 13, repeat: Infinity, ease: "linear" }}>
                      <span />
                    </motion.div>
                    <div className="cq-loop-core"><Zap size={28} /><strong>event</strong><span>loop</span></div>
                    <div className="cq-floating-ticket ticket-one">ready</div>
                    <div className="cq-floating-ticket ticket-two">waiting</div>
                    <div className="cq-floating-ticket ticket-three">done</div>
                  </div>
                </section>

                <TheoryPanel mission={mission} />

                <section className="cq-lesson-cards">
                  <article><span className="cq-card-icon"><Lightbulb size={17} /></span><small>Core idea</small><p>{mission.takeaway}</p></article>
                  <article><span className="cq-card-icon is-coral"><TimerReset size={17} /></span><small>Common trap</small><p>{mission.misconception}</p></article>
                </section>

                <Timeline mission={mission} mode={timelineMode} onModeChange={setTimelineMode} />
                <QuizPanel mission={mission} answers={answers[mission.id] || {}} onAnswer={answerQuestion} onContinue={() => setView("practice")} />
              </motion.div>
            )}

            {view === "practice" && (
              <motion.div key={`practice-${mission.id}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="cq-practice-intro">
                  <div><span className="cq-eyebrow">Chapter {mission.chapter} · coding mission</span><h1>{mission.title}</h1><p>Edit the starter, run it on Python 3, and satisfy the mission checks.</p></div>
                  {missionProgress.codePassed && <span className="cq-cleared"><CheckCircle2 size={16} /> code cleared</span>}
                </div>
                <PracticePanel
                  mission={mission}
                  code={code}
                  setCode={(value) => setCodeByMission((current) => ({ ...current, [mission.id]: value }))}
                  onPass={() => updateProgress({ codePassed: true })}
                />
              </motion.div>
            )}

            {view === "reference" && (
              <motion.div key="reference" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <ReferencePanel missions={QUEST_MISSIONS} />
              </motion.div>
            )}
          </AnimatePresence>

          {view !== "reference" && (
            <footer className="cq-mission-nav">
              <button disabled={activeIndex === 0} onClick={() => moveMission(-1)}><ChevronLeft size={16} /> Previous</button>
              <div><span>Chapter {mission.chapter}</span><div>{QUEST_MISSIONS.map((item) => <i key={item.id} className={item.id === mission.id ? "is-active" : progress[item.id]?.quizPassed && progress[item.id]?.codePassed ? "is-complete" : ""} />)}</div></div>
              <button disabled={activeIndex === QUEST_MISSIONS.length - 1} onClick={() => moveMission(1)}>Next <ChevronRight size={16} /></button>
            </footer>
          )}
        </main>
      </div>
    </div>
    </MotionConfig>
  );
}
