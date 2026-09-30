import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Circle, Clock3, Code2, Copy, FilePenLine, FolderInput, HelpCircle, ListTree, Package, RotateCcw, Sparkles, XCircle,
} from "lucide-react";
import WanderingEyesLoader from "../../../../components/WanderingEyesLoader";
import { AifsCode, aifsUrlTransform, extractToc, makeAifsComponents } from "../../../../components/AiFromScratchMarkdown";
import { useTheme } from "../../../../contexts/ThemeContext";
import { AIFS_CONTENT_BASE } from "../../../../data/aiFromScratchData";
import { fetchMarkdown } from "../../../../utils/fetchMarkdown";
import { getLinkedNote, saveLinkedNote } from "../actions";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { neighbours, PASS_RATIO, scoreQuiz, typeFamily } from "../lib/aifs";
import { languageOf } from "../lib/codespace";
import { relativeTime } from "../lib/dates";
import { RULES } from "../lib/rewards";
import { createCodeFile } from "../spaces/CodeSpace";
import { RunPanel } from "../spaces/CodeTools";
import { Badge, EmptyState, Panel, PrepPage, Tabs } from "../ui";
import { rememberLesson, saveQuizResult, toggleLessonComplete, useAifsProgress } from "./aifsStore";
import LessonCoach, { AskAiChip, useSelectionAsk } from "../../coach/LessonCoach";

const bodyCache = new Map();
const bundleCache = new Map();

function useBundle(slug, needed) {
  const [state, setState] = useState(() => (bundleCache.has(slug) ? { status: "ready", data: bundleCache.get(slug) } : { status: "idle", data: null }));
  useEffect(() => {
    if (!needed) return undefined;
    if (bundleCache.has(slug)) { setState({ status: "ready", data: bundleCache.get(slug) }); return undefined; }
    let alive = true;
    setState({ status: "loading", data: null });
    fetch(`${AIFS_CONTENT_BASE}/bundle/${slug}.json`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
      .then((data) => { bundleCache.set(slug, data); if (alive) setState({ status: "ready", data }); })
      .catch((error) => { if (alive) setState({ status: "error", data: null, error: error.message }); });
    return () => { alive = false; };
  }, [needed, slug]);
  return state;
}

const STAGES = [
  { id: "pre", title: "Warm-up", hint: "Before you read — not graded." },
  { id: "check", title: "Check your understanding", hint: "Graded." },
  { id: "post", title: "After the lesson", hint: "Graded." },
];

function Quiz({ lesson, questions }) {
  const [answers, setAnswers] = useState({});
  const [graded, setGraded] = useState(null);
  const [results] = useStore(KEYS.aifsQuiz, {});
  const previous = results[lesson.slug];
  const score = scoreQuiz(questions, answers);

  if (!questions.length) return <EmptyState icon={HelpCircle} title="No quiz for this lesson" body="Capstones and reference pages don't have one." />;

  const grade = () => setGraded({ result: score, record: saveQuizResult(lesson, score) });
  const retry = () => { setAnswers({}); setGraded(null); };

  return (
    <div className="dsp-stack">
      <div className="dsp-notice">
        <HelpCircle size={16} />
        <span>Answer every graded question; {Math.round(PASS_RATIO * 100)}% or better passes, marks the lesson complete and earns +{RULES.aifs_quiz.points()} coins the first time. {previous ? <>Best so far: <b>{previous.best}/{previous.total}</b>{previous.passedAt ? " · passed" : ""} · {previous.attempts} attempt{previous.attempts === 1 ? "" : "s"}.</> : null}</span>
      </div>
      {STAGES.map((stage) => {
        const inStage = questions.map((question, index) => ({ question, index })).filter(({ question }) => question.stage === stage.id);
        if (!inStage.length) return null;
        return (
          <Panel key={stage.id} title={stage.title} subtitle={stage.hint}>
            <ol className="dsp-aifs-quiz">
              {inStage.map(({ question, index }) => {
                const choice = answers[index];
                const answered = choice != null;
                return (
                  <li key={index}>
                    <p className="dsp-question-prompt">{question.question}</p>
                    <div className="dsp-choices" role="radiogroup" aria-label={question.question}>
                      {question.options.map((option, optionIndex) => {
                        const state = answered ? (optionIndex === question.correct ? "is-correct" : optionIndex === choice ? "is-wrong" : "") : "";
                        return (
                          <button key={option} type="button" role="radio" aria-checked={choice === optionIndex} className={`dsp-option ${state}`} disabled={answered} onClick={() => setAnswers((prev) => ({ ...prev, [index]: optionIndex }))}>
                            <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                          </button>
                        );
                      })}
                    </div>
                    {answered && (
                      <div className={`dsp-verdict ${choice === question.correct ? "is-pass" : "is-fail"}`} role="status">
                        {choice === question.correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        <span>{question.explanation}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </Panel>
        );
      })}
      {graded ? (
        <div className={`dsp-verdict ${graded.result.passed ? "is-pass" : "is-fail"}`} role="status">
          {graded.result.passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          <span><b>{graded.result.graded.correct}/{graded.result.graded.total} graded questions right — {graded.result.passed ? "passed. Lesson marked complete." : `below ${Math.round(PASS_RATIO * 100)}%, re-read and try again.`}</b></span>
          <button type="button" className="dsp-btn is-small" onClick={retry}><RotateCcw size={13} /> Retry</button>
        </div>
      ) : (
        <div className="dsp-row">
          <button type="button" className="dsp-btn is-primary" disabled={!score.complete} onClick={grade}>Grade quiz</button>
          <span className="dsp-muted dsp-small">{score.graded.answered}/{score.graded.total} graded questions answered</span>
        </div>
      )}
    </div>
  );
}

function CodeTab({ lesson, files, dark, navigate }) {
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState("");
  const file = files[active];
  if (!files.length) return <EmptyState icon={Code2} title="No code for this lesson" />;
  const name = file.path.split("/").pop();
  const runLanguage = languageOf(name).run;

  const save = () => {
    const id = createCodeFile({ name, content: file.source, folderName: "AI from Scratch" });
    setSaved(id);
  };

  return (
    <div className="dsp-stack">
      <div className="dsp-chips">{files.map((entry, index) => <button type="button" key={entry.path} className={`dsp-chip${index === active ? " is-active" : ""}`} aria-pressed={index === active} onClick={() => { setActive(index); setSaved(""); }}><Code2 size={12} /> {entry.path}</button>)}</div>
      <div className="dsp-row">
        <button type="button" className="dsp-btn is-small" onClick={save}><FolderInput size={13} /> Copy to CodeSpace</button>
        {saved && <span className="dsp-small">Saved to CodeSpace › AI from Scratch. <button type="button" className="dsp-link" onClick={() => navigate("codespace", { fileId: saved })}>Open it</button></span>}
      </div>
      <AifsCode language={file.lang} code={file.source} filename={file.path} dark={dark} />
      {runLanguage
        ? <RunPanel key={`${lesson.slug}-${file.path}`} code={file.source} runLanguage={runLanguage} />
        : <p className="dsp-muted dsp-small">{file.lang} files can't run in the hub's sandbox — copy it to your machine to run it.</p>}
    </div>
  );
}

function NotesTab({ lesson, navigate }) {
  const link = useMemo(() => ({ type: "aifs", slug: lesson.slug, title: lesson.title }), [lesson.slug, lesson.title]);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("idle");
  const [noteId, setNoteId] = useState("");
  const versionRef = useRef(null);
  const dirtyRef = useRef(false);

  useEffect(() => {
    const note = getLinkedNote(link);
    setBody(note?.body || "");
    setNoteId(note?.id || "");
    versionRef.current = note?.version ?? null;
    setStatus(note ? "saved" : "idle");
    dirtyRef.current = false;
  }, [link]);

  const persist = useCallback((text, force = false) => {
    const outcome = saveLinkedNote(link, text, { expectedVersion: force ? null : versionRef.current });
    if (outcome?.ok) { versionRef.current = outcome.note.version; setNoteId(outcome.note.id); dirtyRef.current = false; setStatus("saved"); }
    else setStatus("conflict");
  }, [link]);

  useEffect(() => {
    if (!dirtyRef.current || status === "conflict") return undefined;
    setStatus("saving");
    const timer = window.setTimeout(() => persist(body), 500);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body]);

  return (
    <div className="dsp-stack">
      {status === "conflict" && (
        <div className="dsp-notice is-warning" role="alert"><span>This note changed in NoteSpace or another tab. Autosave is paused.</span>
          <div className="dsp-row">
            <button type="button" className="dsp-btn is-small" onClick={() => { const note = getLinkedNote(link); setBody(note?.body || ""); versionRef.current = note?.version ?? null; dirtyRef.current = false; setStatus("saved"); }}>Load the newer version</button>
            <button type="button" className="dsp-btn is-small is-quiet" onClick={() => persist(body, true)}>Keep mine</button>
          </div>
        </div>
      )}
      <textarea className="dsp-textarea dsp-note-body" value={body} onChange={(event) => { dirtyRef.current = true; setBody(event.target.value); }} placeholder="Key ideas, formulas, things to try — saved to Notes and linked to this lesson." aria-label="Lesson notes" />
      <div className="dsp-row">
        <span className="dsp-muted dsp-small">{status === "saving" ? "Saving…" : status === "saved" ? <><Check size={12} /> Saved to Notes</> : status === "conflict" ? "Not saved" : "Start typing to create a note"}</span>
        {noteId && <button type="button" className="dsp-link dsp-small" onClick={() => navigate("notes", { noteId })}>Open in Notes</button>}
      </div>
    </div>
  );
}

export default function AifsLesson({ index, slug, onBack, onOpen, navigate }) {
  const { theme } = useTheme() || {};
  const dark = theme !== "light";
  const lesson = index.lessonBySlug.get(slug);
  const phase = index.phaseBySlug.get(slug);
  const progress = useAifsProgress();
  const [results] = useStore(KEYS.aifsQuiz, {});
  const [tab, setTab] = useState("lesson");
  const [body, setBody] = useState({ status: "loading", text: "", error: "" });
  const bundle = useBundle(slug, tab !== "lesson" && tab !== "notes");
  const done = Boolean(progress[slug]);
  const { previous, next } = neighbours(index.order[phase.track] || [], slug);
  // The AI tutor drawer, and "Ask AI" on text selected in the lesson.
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorRequest, setTutorRequest] = useState(null);
  const readerRef = useRef(null);
  const [selection, clearSelection] = useSelectionAsk(readerRef);
  const askAbout = (item) => { setTutorOpen(true); setTutorRequest({ id: Date.now(), context: [item] }); clearSelection(); };

  useEffect(() => { rememberLesson({ lesson, phase }); }, [lesson, phase]);

  useEffect(() => {
    let alive = true;
    setTab("lesson");
    document.querySelector(".dsa-dashboard-body")?.scrollTo?.({ top: 0 });
    if (bodyCache.has(slug)) { setBody({ status: "ready", text: bodyCache.get(slug), error: "" }); return undefined; }
    setBody({ status: "loading", text: "", error: "" });
    fetchMarkdown(`${AIFS_CONTENT_BASE}/md/${slug}.md`)
      .then((text) => { bodyCache.set(slug, text); if (alive) setBody({ status: "ready", text, error: "" }); })
      .catch((error) => { if (alive) setBody({ status: "error", text: "", error: error.message }); });
    return () => { alive = false; };
  }, [slug]);

  const components = useMemo(() => makeAifsComponents({ dark, onLessonLink: (target) => onOpen(target), resolveLesson: (target) => index.lessonBySlug.has(target) }), [dark, index, onOpen]);
  const toc = useMemo(() => (body.text ? extractToc(body.text) : []), [body.text]);
  const quiz = results[slug];

  const tabs = [
    { id: "lesson", label: "Lesson", icon: BookOpen },
    ...(lesson.code ? [{ id: "code", label: "Code", icon: Code2, count: lesson.code }] : []),
    ...(lesson.artifacts ? [{ id: "artifacts", label: "Artifacts", icon: Package, count: lesson.artifacts }] : []),
    ...(lesson.quiz ? [{ id: "quiz", label: "Quiz", icon: HelpCircle, count: lesson.quiz }] : []),
    { id: "notes", label: "Notes", icon: FilePenLine },
  ];

  const bundleBody = (render) => (bundle.status === "loading" || bundle.status === "idle"
    ? <WanderingEyesLoader block label="Loading…" size={22} />
    : bundle.status === "error" ? <EmptyState icon={XCircle} title="Couldn't load this tab" body={bundle.error} /> : render(bundle.data || {}));

  return (
    <PrepPage
      eyebrow={phase.track === "curriculum" ? `Phase ${phase.n} · ${phase.title}` : phase.title}
      title={lesson.title}
      description={lesson.blurb}
      actions={(
        <>
          <button type="button" className="dsp-btn is-quiet" onClick={onBack}><ListTree size={15} /> All lessons</button>
          <button type="button" className={`dsp-btn${tutorOpen ? " is-active" : ""}`} aria-pressed={tutorOpen} onClick={() => setTutorOpen((value) => !value)}><Sparkles size={15} /> AI tutor</button>
          <button type="button" className={`dsp-btn${done ? " is-active" : " is-primary"}`} aria-pressed={done} onClick={() => toggleLessonComplete(slug)}>{done ? <><CheckCircle2 size={15} /> Completed</> : <><Circle size={15} /> Mark complete</>}</button>
        </>
      )}
    >
      <div className="dsp-row">
        {lesson.type && <Badge tone="info">{lesson.type}</Badge>}
        {lesson.time && <Badge><Clock3 size={11} /> {lesson.time.replace(/^~/, "")}</Badge>}
        {lesson.langs && lesson.langs !== "--" && <Badge>{lesson.langs}</Badge>}
        {lesson.prereq && lesson.prereq !== "None" && <span className="dsp-muted dsp-small">Prerequisite: {lesson.prereq}</span>}
        {quiz?.passedAt && <Badge tone="success">Quiz passed</Badge>}
      </div>

      <Tabs value={tab} onChange={setTab} options={tabs} label="Lesson sections" />

      <div className="dsp-grid split">
        <section className="dsp-box dsp-aifs-reader" ref={readerRef}>
          {tab === "lesson" && (body.status === "loading"
            ? <WanderingEyesLoader block label="Loading lesson…" size={22} />
            : body.status === "error"
              ? <EmptyState icon={BookOpen} title="This lesson didn't load" body={body.error} />
              : <div className="aifs-prose dsp-aifs-prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={components} urlTransform={aifsUrlTransform}>{body.text}</ReactMarkdown></div>)}
          {tab === "code" && bundleBody((data) => <CodeTab lesson={lesson} files={data.code || []} dark={dark} navigate={navigate} />)}
          {tab === "artifacts" && bundleBody((data) => ((data.artifacts || []).length ? (
            <div className="dsp-stack">
              {data.artifacts.map((artifact) => (
                <Panel key={artifact.name} title={artifact.name} actions={<button type="button" className="dsp-btn is-small" onClick={() => navigator.clipboard?.writeText(artifact.markdown)}><Copy size={12} /> Copy markdown</button>}>
                  <div className="aifs-prose dsp-aifs-prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={components} urlTransform={aifsUrlTransform}>{artifact.markdown}</ReactMarkdown></div>
                </Panel>
              ))}
            </div>
          ) : <EmptyState icon={Package} title="No artifacts for this lesson" />))}
          {tab === "quiz" && bundleBody((data) => <Quiz key={slug} lesson={lesson} questions={data.quiz || []} />)}
          {tab === "notes" && <NotesTab lesson={lesson} navigate={navigate} />}

          <nav className="dsp-aifs-pager">
            {previous ? <button type="button" className="dsp-btn is-quiet" onClick={() => onOpen(previous)}><ArrowLeft size={14} /> {index.lessonBySlug.get(previous)?.title}</button> : <span />}
            {next && <button type="button" className="dsp-btn is-quiet" onClick={() => onOpen(next)}>{index.lessonBySlug.get(next)?.title} <ArrowRight size={14} /></button>}
          </nav>
        </section>

        <aside className="dsp-stack dsp-aifs-aside">
          {tab === "lesson" && toc.length > 0 && (
            <Panel title="On this page">
              <ul className="dsp-aifs-toc">
                {toc.map((item) => <li key={item.id} className={item.level === 3 ? "is-sub" : ""}><button type="button" onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}>{item.label}</button></li>)}
              </ul>
            </Panel>
          )}
          <Panel title="This lesson">
            <dl className="dsp-kv">
              <div><dt>Kind</dt><dd>{typeFamily(lesson.type)}</dd></div>
              <div><dt>Status</dt><dd>{done ? `Completed ${relativeTime(new Date(progress[slug]).toISOString())}` : "Not completed"}</dd></div>
              {lesson.quiz > 0 && <div><dt>Quiz</dt><dd>{quiz ? `${quiz.best}/${quiz.total} best${quiz.passedAt ? " · passed" : ""}` : "Not attempted"}</dd></div>}
              <div><dt>Includes</dt><dd>{[lesson.code && `${lesson.code} code`, lesson.artifacts && `${lesson.artifacts} artifact${lesson.artifacts === 1 ? "" : "s"}`, lesson.quiz && `${lesson.quiz} questions`].filter(Boolean).join(" · ") || "Reading only"}</dd></div>
            </dl>
            <p className="dsp-muted dsp-small">Completion is shared with AI from Scratch in the main sidebar.</p>
          </Panel>
        </aside>
      </div>

      <AskAiChip selection={selection} onAsk={askAbout} />
      <LessonCoach
        lesson={lesson}
        phase={phase}
        markdown={body.text}
        onOpenLesson={onOpen}
        open={tutorOpen}
        onClose={() => setTutorOpen(false)}
        request={tutorRequest}
        isDark={dark}
      />
    </PrepPage>
  );
}
