import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Brain, Calculator, CheckCircle2, Clock3, Eraser, Flag, History, Info, ListChecks, MessageSquareText, Play, RotateCcw, Send, Target, Timer, XCircle,
} from "lucide-react";
import { useNow } from "../hooks";
import { AREAS, TOPICS, practiceSet } from "../lib/aptitude";
import { formatDuration, relativeTime } from "../lib/dates";
import { Badge, Dialog, EmptyState, Panel, PrepPage, Progress, Stat } from "../ui";
import { finishSession, mockMinutes, patchSession, recordPracticeSet, startMock, useAptitude } from "./aptitudeStore";

const AREA_ICON = { quant: Calculator, logical: Brain, verbal: MessageSquareText };
const clock = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

function Choices({ question, choice, reveal, onChoose }) {
  return (
    <div className="dsp-choices" role="radiogroup" aria-label="Answer options">
      {question.options.map((option, index) => {
        const state = reveal ? (index === question.answer ? "is-correct" : index === choice ? "is-wrong" : "") : index === choice ? "is-chosen" : "";
        return (
          <button key={option} type="button" role="radio" aria-checked={choice === index} className={`dsp-option ${state}`} onClick={() => onChoose(index)} disabled={reveal}>
            <span>{String.fromCharCode(65 + index)}</span>{option}
          </button>
        );
      })}
    </div>
  );
}

/* ── practice: one topic, immediate feedback ───────────────────────────── */

function PracticeRunner({ topicId, setNumber, onExit }) {
  const questions = useMemo(() => practiceSet(topicId, setNumber), [setNumber, topicId]);
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState({});
  const [done, setDone] = useState(false);
  const question = questions[index];
  const choice = choices[question?.id];
  const answered = choice != null;
  const correct = questions.filter((entry) => choices[entry.id] === entry.answer).length;

  const finish = () => { recordPracticeSet(topicId, setNumber, correct, questions.length); setDone(true); };

  if (done) {
    return (
      <PrepPage eyebrow={`Practice · ${TOPICS[topicId].title}`} title={`Set ${setNumber} complete`} actions={<button type="button" className="dsp-btn is-quiet" onClick={onExit}><ArrowLeft size={15} /> Aptitude</button>}>
        <div className="dsp-grid cols-3">
          <Stat icon={CheckCircle2} label="Correct" value={`${correct}/${questions.length}`} tone="success" />
          <Stat icon={Target} label="Accuracy" value={`${Math.round((correct / questions.length) * 100)}%`} hint="From one set — a small sample" />
          <Stat icon={ListChecks} label="Next" value={`Set ${setNumber + 1}`} hint="New numbers, same skills" />
        </div>
        <div className="dsp-row">
          <button type="button" className="dsp-btn" onClick={() => { setIndex(0); setChoices({}); setDone(false); }}><RotateCcw size={14} /> Redo this set</button>
          <button type="button" className="dsp-btn is-primary" onClick={() => onExit({ next: setNumber + 1 })}>Next set <ArrowRight size={14} /></button>
        </div>
      </PrepPage>
    );
  }

  return (
    <PrepPage eyebrow={`Practice · ${TOPICS[topicId].title} · set ${setNumber}`} title={`Question ${index + 1} of ${questions.length}`} actions={<button type="button" className="dsp-btn is-quiet" onClick={() => onExit()}><ArrowLeft size={15} /> Leave set</button>}>
      <Progress value={Object.keys(choices).length} max={questions.length} label="Answered" showNumbers />
      <Panel className="dsp-question">
        <p className="dsp-question-prompt">{question.prompt}</p>
        <Choices question={question} choice={choice} reveal={answered} onChoose={(value) => setChoices((prev) => ({ ...prev, [question.id]: value }))} />
        {answered && (
          <div className={`dsp-verdict ${choice === question.answer ? "is-pass" : "is-fail"}`} role="status">
            {choice === question.answer ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span><b>{choice === question.answer ? "Correct." : `Not quite — the answer is ${question.options[question.answer]}.`}</b> {question.explanation}</span>
          </div>
        )}
        <div className="dsp-row dsp-question-nav">
          <button type="button" className="dsp-btn is-quiet" disabled={index === 0} onClick={() => setIndex(index - 1)}><ArrowLeft size={14} /> Previous</button>
          <span className="dsp-muted dsp-small"><Clock3 size={12} /> Aim for ~{question.seconds}s</span>
          {index < questions.length - 1
            ? <button type="button" className="dsp-btn is-primary" disabled={!answered} onClick={() => setIndex(index + 1)}>Next <ArrowRight size={14} /></button>
            : <button type="button" className="dsp-btn is-primary" disabled={Object.keys(choices).length < questions.length} onClick={finish}>Finish set</button>}
        </div>
      </Panel>
    </PrepPage>
  );
}

/* ── timed test ────────────────────────────────────────────────────────── */

function MockRunner({ session, onExit }) {
  const now = useNow(500);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const enteredRef = useRef({ id: null, at: Date.now() });
  const question = session.questions[session.current];
  const remaining = session.deadline - now;
  const entry = session.answers[question.id] || {};
  const answeredCount = session.questions.filter((item) => session.answers[item.id]?.choice != null).length;
  const markedCount = session.questions.filter((item) => session.answers[item.id]?.marked).length;

  // Time on each question accumulates as you move between them.
  const leaveQuestion = (draft) => {
    const { id, at } = enteredRef.current;
    if (!id) return draft;
    const seconds = Math.round((Date.now() - at) / 1000);
    return { ...draft, answers: { ...draft.answers, [id]: { ...(draft.answers[id] || {}), seconds: (draft.answers[id]?.seconds || 0) + seconds, visited: true } } };
  };
  useEffect(() => {
    enteredRef.current = { id: question.id, at: Date.now() };
    if (!session.answers[question.id]?.visited) patchSession(session.id, (draft) => ({ ...draft, answers: { ...draft.answers, [question.id]: { ...(draft.answers[question.id] || {}), visited: true } } }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  useEffect(() => {
    if (remaining <= 0) finishSession(session.id, "expired");
  }, [remaining, session.id]);

  const go = (index) => patchSession(session.id, (draft) => ({ ...leaveQuestion(draft), current: index }));
  const setAnswer = (patch) => patchSession(session.id, (draft) => ({ ...draft, answers: { ...draft.answers, [question.id]: { ...(draft.answers[question.id] || {}), ...patch } } }));
  const submit = () => { patchSession(session.id, (draft) => leaveQuestion(draft)); finishSession(session.id, "submitted"); setConfirmOpen(false); };

  return (
    <div className="dsp-page dsp-mock">
      <header className="dsp-mock-bar">
        <div><span className="dsp-eyebrow">Timed test · {session.area === "mixed" ? "Mixed" : AREAS.find((area) => area.id === session.area)?.title}</span><b>Question {session.current + 1} of {session.questions.length}</b></div>
        <div className={`dsp-mock-timer${remaining < 60000 ? " is-urgent" : ""}`} role="timer" aria-live="off" aria-label={`Time left ${clock(remaining)}`}><Timer size={16} /> {clock(remaining)}</div>
        <div className="dsp-row">
          <span className="dsp-muted dsp-small">Saved {new Date(session.lastSavedAt).toLocaleTimeString()} · rev {session.revision}</span>
          <button type="button" className="dsp-btn is-quiet" onClick={onExit}>Pause & leave</button>
          <button type="button" className="dsp-btn is-primary" onClick={() => setConfirmOpen(true)}><Send size={14} /> Submit</button>
        </div>
      </header>

      <div className="dsp-mock-layout">
        <Panel className="dsp-question">
          <div className="dsp-row"><Badge>{TOPICS[question.topic]?.title}</Badge>{entry.marked && <Badge tone="warning"><Flag size={11} /> Marked for review</Badge>}</div>
          <p className="dsp-question-prompt">{question.prompt}</p>
          <Choices question={question} choice={entry.choice} reveal={false} onChoose={(value) => setAnswer({ choice: value })} />
          <div className="dsp-row dsp-question-nav">
            <button type="button" className="dsp-btn is-quiet" disabled={session.current === 0} onClick={() => go(session.current - 1)}><ArrowLeft size={14} /> Previous</button>
            <button type="button" className="dsp-btn is-quiet" onClick={() => setAnswer({ choice: null })} disabled={entry.choice == null}><Eraser size={14} /> Clear</button>
            <button type="button" className={`dsp-btn${entry.marked ? " is-active" : ""}`} onClick={() => setAnswer({ marked: !entry.marked })} aria-pressed={Boolean(entry.marked)}><Flag size={14} /> {entry.marked ? "Marked" : "Mark for review"}</button>
            <button type="button" className="dsp-btn is-primary" disabled={session.current === session.questions.length - 1} onClick={() => go(session.current + 1)}>Save & next <ArrowRight size={14} /></button>
          </div>
        </Panel>
        <aside className="dsp-box dsp-palette" aria-label="Question palette">
          <strong>Palette</strong>
          <div className="dsp-palette-grid">
            {session.questions.map((item, index) => {
              const state = session.answers[item.id] || {};
              const cls = [state.choice != null ? "is-answered" : state.visited ? "is-visited" : "", state.marked ? "is-marked" : "", index === session.current ? "is-current" : ""].join(" ");
              return <button type="button" key={item.id} className={cls} onClick={() => go(index)} aria-label={`Question ${index + 1}${state.choice != null ? ", answered" : ""}${state.marked ? ", marked for review" : ""}`}>{index + 1}</button>;
            })}
          </div>
          <ul className="dsp-palette-legend">
            <li><i className="is-answered" /> Answered ({answeredCount})</li>
            <li><i className="is-visited" /> Seen, not answered</li>
            <li><i className="is-marked" /> Marked ({markedCount})</li>
            <li><i /> Not seen</li>
          </ul>
          <p className="dsp-muted dsp-small">Scoring, fixed at start: +{session.policy.correct} correct, {session.policy.wrong} wrong, {session.policy.skipped} skipped. The clock keeps running if you leave.</p>
        </aside>
      </div>

      <Dialog open={confirmOpen} size="sm" title="Submit your test?" onClose={() => setConfirmOpen(false)}
        footer={<><button type="button" className="dsp-btn is-quiet" onClick={() => setConfirmOpen(false)} data-autofocus>Keep working</button><button type="button" className="dsp-btn is-primary" onClick={submit}>Submit now</button></>}
      >
        <dl className="dsp-kv">
          <div><dt>Answered</dt><dd>{answeredCount} of {session.questions.length}</dd></div>
          <div><dt>Unanswered</dt><dd>{session.questions.length - answeredCount}</dd></div>
          <div><dt>Marked for review</dt><dd>{markedCount}</dd></div>
          <div><dt>Time left</dt><dd>{clock(remaining)}</dd></div>
        </dl>
        {session.questions.length - answeredCount > 0 && <p className="dsp-muted dsp-small">Unanswered questions score {session.policy.skipped}; a wrong answer costs {Math.abs(session.policy.wrong)}.</p>}
      </Dialog>
    </div>
  );
}

function MockResults({ session, onExit, onPractice, onRetake }) {
  const [filter, setFilter] = useState("all");
  const { result } = session;
  const used = Math.round((new Date(session.submittedAt) - new Date(session.startedAt)) / 60000);
  const topics = Object.entries(result.byTopic).map(([id, stats]) => ({ id, ...stats, expected: session.questions.filter((q) => q.topic === id).reduce((sum, q) => sum + q.seconds, 0) }));
  // Lowest accuracy first; among equals, the topic with more actual mistakes.
  const weakest = [...topics].filter((topic) => topic.correct + topic.wrong > 0).sort((a, b) => a.correct / a.total - b.correct / b.total || b.wrong - a.wrong)[0];
  const review = session.questions.filter((question) => {
    const choice = session.answers[question.id]?.choice;
    if (filter === "wrong") return choice != null && choice !== question.answer;
    if (filter === "skipped") return choice == null;
    return true;
  });

  return (
    <PrepPage
      eyebrow={`Test results · ${session.status === "expired" ? "time ran out" : "submitted"}`}
      title={`${result.score} / ${result.max}`}
      description={`${result.correct} correct · ${result.wrong} wrong · ${result.skipped} skipped. Scored with the policy fixed when you started (+${session.policy.correct} / ${session.policy.wrong} / ${session.policy.skipped}).`}
      actions={<><button type="button" className="dsp-btn is-quiet" onClick={onExit}><ArrowLeft size={15} /> Aptitude</button><button type="button" className="dsp-btn" onClick={onRetake}><RotateCcw size={14} /> New test</button></>}
    >
      <div className="dsp-grid cols-4">
        <Stat icon={Target} label="Accuracy" value={result.accuracy == null ? "—" : `${Math.round(result.accuracy * 100)}%`} hint="Of the questions you answered" tone="success" />
        <Stat icon={Clock3} label="Time used" value={formatDuration(used)} hint={`of ${mockMinutes(session.questions)}m`} />
        <Stat icon={XCircle} label="Wrong" value={result.wrong} hint={`${result.wrong * Math.abs(session.policy.wrong)} marks lost`} tone="warning" />
        <Stat icon={Flag} label="Weakest topic" value={weakest ? TOPICS[weakest.id]?.title : "—"} hint={weakest ? `${weakest.correct}/${weakest.total} correct — small sample` : ""} />
      </div>
      <Panel title="By topic" subtitle="Pacing compares your time with each question's target. One test is a small sample — treat these as hints, not a diagnosis.">
        <table className="dsp-table">
          <thead><tr><th>Topic</th><th>Correct</th><th>Your time</th><th>Target</th><th /></tr></thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.id}>
                <td>{TOPICS[topic.id]?.title}</td>
                <td>{topic.correct}/{topic.total}</td>
                <td>{topic.seconds}s</td>
                <td>{topic.expected}s</td>
                <td><button type="button" className="dsp-link" onClick={() => onPractice(topic.id)}>Practice</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <Panel title="Review answers" actions={<div className="dsp-chips">{[["all", "All"], ["wrong", "Wrong"], ["skipped", "Skipped"]].map(([id, label]) => <button type="button" key={id} className={`dsp-chip${filter === id ? " is-active" : ""}`} onClick={() => setFilter(id)}>{label}</button>)}</div>}>
        <ol className="dsp-review-answers">
          {review.map((question) => {
            const choice = session.answers[question.id]?.choice;
            const status = choice == null ? "skipped" : choice === question.answer ? "correct" : "wrong";
            return (
              <li key={question.id} className={`is-${status}`}>
                <div className="dsp-row"><Badge tone={status === "correct" ? "success" : status === "wrong" ? "danger" : "neutral"}>{status}</Badge><Badge>{TOPICS[question.topic]?.title}</Badge><span className="dsp-muted dsp-small">{session.answers[question.id]?.seconds || 0}s</span></div>
                <p>{question.prompt}</p>
                <p className="dsp-small">Your answer: <b>{choice == null ? "—" : question.options[choice]}</b> · Correct: <b>{question.options[question.answer]}</b></p>
                <p className="dsp-muted dsp-small">{question.explanation}</p>
              </li>
            );
          })}
        </ol>
      </Panel>
    </PrepPage>
  );
}

/* ── home ──────────────────────────────────────────────────────────────── */

export default function Aptitude() {
  const [state] = useAptitude();
  const [view, setView] = useState(null); // { kind: "practice", topicId, set } | { kind: "session", id }
  const [mockArea, setMockArea] = useState("mixed");
  const [mockCount, setMockCount] = useState(20);
  const active = state.sessions.find((session) => session.status === "in_progress");

  // A test whose deadline passed while the tab was closed is graded on return.
  useEffect(() => {
    state.sessions.filter((session) => session.status === "in_progress" && session.deadline <= Date.now()).forEach((session) => finishSession(session.id, "expired"));
  }, [state.sessions]);

  const openPractice = (topicId, set) => {
    const sets = state.practice[topicId]?.sets || {};
    const nextSet = set || Math.max(0, ...Object.keys(sets).map(Number)) + 1;
    setView({ kind: "practice", topicId, set: nextSet });
  };

  if (view?.kind === "practice") {
    return <PracticeRunner key={`${view.topicId}-${view.set}`} topicId={view.topicId} setNumber={view.set} onExit={(next) => (next?.next ? setView({ ...view, set: next.next }) : setView(null))} />;
  }
  if (view?.kind === "session") {
    const session = state.sessions.find((entry) => entry.id === view.id);
    if (session?.status === "in_progress") return <MockRunner session={session} onExit={() => setView(null)} />;
    if (session) return <MockResults session={session} onExit={() => setView(null)} onPractice={(topicId) => openPractice(topicId)} onRetake={() => setView({ kind: "session", id: startMock(session.area, session.questions.length) })} />;
  }

  const estimate = mockCount * (mockArea === "verbal" ? 0.5 : 1);

  return (
    <PrepPage
      eyebrow="Practice"
      title="Aptitude"
      description="Quantitative, logical and verbal practice. Numeric questions are generated fresh for every set — the answers are computed, so each set is new but always checkable. Practice shows explanations immediately; timed tests hold them back until you submit."
    >
      {active && (
        <div className="dsp-notice is-warning"><Timer size={16} /><span><b>A timed test is running</b> — {clock(active.deadline - Date.now())} left, and the clock doesn't stop. <button type="button" className="dsp-link" onClick={() => setView({ kind: "session", id: active.id })}>Resume</button></span></div>
      )}

      <div className="dsp-grid cols-3">
        {AREAS.map((area) => {
          const Icon = AREA_ICON[area.id];
          return (
            <Panel key={area.id} title={area.title} subtitle={area.summary} actions={<Icon size={18} className="dsp-muted" />}>
              <ul className="dsp-list">
                {area.topics.map((topic) => {
                  const sets = Object.values(state.practice[topic.id]?.sets || {});
                  const correct = sets.reduce((sum, set) => sum + set.correct, 0);
                  const total = sets.reduce((sum, set) => sum + set.total, 0);
                  return (
                    <li key={topic.id}>
                      <button type="button" className="dsp-list-row" onClick={() => openPractice(topic.id)}>
                        <div><b>{topic.title}</b><small>{sets.length ? `${sets.length} set${sets.length === 1 ? "" : "s"} · ${Math.round((correct / total) * 100)}% correct` : topic.generated ? "Generated questions" : `${topic.bankSize}-question bank`}</small></div>
                        <Play size={14} className="dsp-muted" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          );
        })}
      </div>

      <div className="dsp-grid split">
        <Panel title="Timed test" subtitle="Questions from every topic in the area, a fixed deadline, a question palette and review flags. Explanations come after you submit.">
          <div className="dsp-stack">
            <div className="dsp-chips">{[["mixed", "Mixed"], ...AREAS.map((area) => [area.id, area.title])].map(([id, label]) => <button type="button" key={id} className={`dsp-chip${mockArea === id ? " is-active" : ""}`} aria-pressed={mockArea === id} onClick={() => setMockArea(id)}>{label}</button>)}</div>
            <div className="dsp-chips">{[10, 20, 30].map((count) => <button type="button" key={count} className={`dsp-chip${mockCount === count ? " is-active" : ""}`} aria-pressed={mockCount === count} onClick={() => setMockCount(count)}>{count} questions</button>)}</div>
            <ul className="dsp-rules">
              <li>About {Math.round(estimate)}–{Math.round(estimate * 1.3)} minutes, set from each question's target time.</li>
              <li>+1 for correct, −0.25 for wrong, 0 for skipped — fixed when you start.</li>
              <li>Answers save as you go; the deadline holds across refreshes.</li>
            </ul>
            <button type="button" className="dsp-btn is-primary" disabled={Boolean(active)} onClick={() => setView({ kind: "session", id: startMock(mockArea, mockCount) })}><Timer size={14} /> {active ? "Finish the running test first" : "Start test"}</button>
          </div>
        </Panel>
        <Panel title="Past tests" actions={<History size={16} className="dsp-muted" />}>
          {state.sessions.filter((session) => session.status !== "in_progress").length ? (
            <ul className="dsp-list">
              {state.sessions.filter((session) => session.status !== "in_progress").slice(0, 8).map((session) => (
                <li key={session.id}>
                  <button type="button" className="dsp-list-row" onClick={() => setView({ kind: "session", id: session.id })}>
                    <div><b>{session.result.score}/{session.result.max} · {session.area === "mixed" ? "Mixed" : AREAS.find((area) => area.id === session.area)?.title}</b><small>{relativeTime(session.submittedAt)}{session.status === "expired" ? " · time ran out" : ""}</small></div>
                    <ArrowRight size={14} className="dsp-muted" />
                  </button>
                </li>
              ))}
            </ul>
          ) : <EmptyState compact icon={Timer} title="No tests yet" />}
        </Panel>
      </div>
      <div className="dsp-notice"><Info size={16} /><span>Accuracy from a single set or test is a small sample — it's shown to guide what to practise next, not to label you.</span></div>
    </PrepPage>
  );
}
