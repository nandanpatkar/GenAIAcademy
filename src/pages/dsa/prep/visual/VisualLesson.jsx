import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpenCheck, Check, CheckCircle2, Circle, Clapperboard, Maximize2, Minimize2, Sparkles,
} from "lucide-react";
import VisualLessonFrame, { frameLessonMarkdown } from "../../../../components/visual/VisualLessonFrame";
import { toggleWatched } from "../../../../components/visual/visualProgress";
import { useTheme } from "../../../../contexts/ThemeContext";
import { codelabDifficulty } from "../../practice/practiceData";
import LessonCoach, { AskAiChip } from "../../coach/LessonCoach";
import { VISUAL_COURSE } from "../../coach/prompt";
import { useLearnerState } from "../learner";
import { Badge, DifficultyPill, Panel, PrepPage, Progress } from "../ui";
import { markWatched, rememberVisualLesson, useWatched, visualIndex } from "./visualStore";

// Every lesson, for the tutor's lesson search (its "slug" is the lesson path).
const COACH_LESSONS = visualIndex.order.map((path) => {
  const entry = visualIndex.lessonByPath.get(path);
  return { slug: path, title: entry.title, blurb: entry.subtitle, phaseTitle: `${entry.track.name} · ${entry.group.title}` };
});

const VISUAL_INTRO = {
  title: "I'm your AI tutor",
  body: "I've read this lesson's text. Ask about any step of the animation, have me quiz you on the pattern, or get a hint towards the linked problem.",
};

/** "Ask AI" for text selected inside the framed lesson, positioned in the host page. */
function useFrameSelection(frameDoc, hostRef) {
  const [selection, setSelection] = useState(null);
  useEffect(() => {
    if (!frameDoc) return undefined;
    const read = () => {
      const current = frameDoc.getSelection?.();
      const text = current?.toString().trim() || "";
      const frame = hostRef.current?.querySelector("iframe");
      if (!frame || text.length < 3 || !current.rangeCount) { setSelection(null); return; }
      const box = frame.getBoundingClientRect();
      const rect = current.getRangeAt(0).getBoundingClientRect();
      setSelection({
        text: text.slice(0, 3000),
        x: Math.min(Math.max(box.left + rect.left + rect.width / 2, 60), window.innerWidth - 60),
        y: Math.min(box.top + rect.bottom + 8, window.innerHeight - 44),
      });
    };
    const clear = () => setSelection(null);
    frameDoc.addEventListener("mouseup", read);
    frameDoc.addEventListener("keyup", read);
    frameDoc.defaultView?.addEventListener("scroll", clear, true);
    return () => {
      frameDoc.removeEventListener("mouseup", read);
      frameDoc.removeEventListener("keyup", read);
      frameDoc.defaultView?.removeEventListener("scroll", clear, true);
    };
  }, [frameDoc, hostRef]);
  return [selection, () => { setSelection(null); frameDoc?.getSelection?.()?.removeAllRanges(); }];
}

function PracticeRow({ problem, solved, primary, onOpen }) {
  return (
    <li className={`dsv-practice-row${solved ? " is-solved" : ""}`}>
      <span className="dsv-practice-state" aria-label={solved ? "Solved" : "Not solved"}>{solved ? <Check size={13} /> : <BookOpenCheck size={13} />}</span>
      <div>
        <button type="button" className="dsv-practice-title" onClick={() => onOpen(problem.id)}>{problem.title}</button>
        <span className="dsv-practice-meta"><DifficultyPill difficulty={codelabDifficulty(problem.difficulty)} />{problem.minutes ? <span>{problem.minutes} min</span> : null}</span>
      </div>
      <button type="button" className={`dsp-btn is-small${primary && !solved ? " dsv-btn-primary" : ""}`} onClick={() => onOpen(problem.id)}>{solved ? "Revisit" : "Solve"} <ArrowRight size={13} /></button>
    </li>
  );
}

export default function VisualLesson({ path, backLabel = "All lessons", onBack, onOpen, navigate, openProblem }) {
  const { theme } = useTheme() || {};
  const dark = theme !== "light";
  const lesson = visualIndex.lessonByPath.get(path);
  const watched = useWatched();
  const learner = useLearnerState();
  const done = watched.has(path);
  const { previous, next } = visualIndex.neighbours(path);
  const own = useMemo(() => visualIndex.problemsForLesson(path), [path]);
  const pattern = useMemo(() => visualIndex.patternProblems(path).filter((problem) => !own.some((entry) => entry.id === problem.id)), [own, path]);
  const groupDone = lesson.group.items.filter((item) => watched.has(item.path)).length;
  const topics = lesson.track.id === "dsa" ? visualIndex.topicsForGroup(lesson.group.title) : [];
  const [wide, setWide] = useState(false);
  const [text, setText] = useState("");
  const [frameDoc, setFrameDoc] = useState(null);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorRequest, setTutorRequest] = useState(null);
  const stageRef = useRef(null);
  const [selection, clearSelection] = useFrameSelection(frameDoc, stageRef);

  // Escape leaves theatre mode.
  useEffect(() => {
    if (!wide) return undefined;
    const onKey = (event) => { if (event.key === "Escape") setWide(false); };
    window.addEventListener("keydown", onKey);
    frameDoc?.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); frameDoc?.removeEventListener("keydown", onKey); };
  }, [wide, frameDoc]);

  useEffect(() => {
    rememberVisualLesson(lesson);
    document.querySelector(".dsa-dashboard-body")?.scrollTo?.({ top: 0 });
  }, [lesson]);

  const onDocument = useCallback((doc) => {
    setFrameDoc(doc);
    // The lesson text arrives after hydration; read it once it has settled.
    if (doc) window.setTimeout(() => { try { setText(frameLessonMarkdown(doc)); } catch { /* navigated away */ } }, 1200);
  }, []);

  const askAbout = (item) => { setTutorOpen(true); setTutorRequest({ id: Date.now(), context: [item] }); clearSelection(); };

  // What the tutor sees of this lesson: index entry shaped like an AI from Scratch one.
  const coachLesson = useMemo(() => ({
    slug: path,
    title: lesson.title,
    blurb: lesson.subtitle,
    type: "Animated walkthrough",
    practice: own.map((problem) => `${problem.title} (${codelabDifficulty(problem.difficulty)})`).join(", "),
  }), [lesson, own, path]);
  const coachPhase = useMemo(() => ({ title: `${lesson.track.name} · ${lesson.group.title}` }), [lesson]);

  return (
    <PrepPage
      className={`dsv-lesson-page${wide ? " is-wide" : ""}`}
      eyebrow={`${lesson.track.name} · ${lesson.group.title}`}
      title={lesson.title}
      description={lesson.subtitle}
      actions={(
        <>
          <button type="button" className="dsp-btn is-quiet" onClick={onBack}><ArrowLeft size={15} /> {backLabel}</button>
          <button type="button" className={`dsp-btn${tutorOpen ? " is-active" : ""}`} aria-pressed={tutorOpen} onClick={() => setTutorOpen((value) => !value)}><Sparkles size={15} /> AI tutor</button>
          <button type="button" className={`dsp-btn${done ? " is-active dsv-btn-done" : " dsv-btn-primary"}`} aria-pressed={done} onClick={() => toggleWatched(path)}>{done ? <><CheckCircle2 size={15} /> Watched</> : <><Circle size={15} /> Mark watched</>}</button>
        </>
      )}
    >
      <div className="dsp-row dsv-lesson-meta">
        <Badge tone="info"><Clapperboard size={11} /> Lesson {lesson.indexInGroup + 1} of {lesson.group.items.length}</Badge>
        {own.length > 0 && <Badge tone="accent"><BookOpenCheck size={11} /> Teaches {own.length === 1 ? "a practice problem" : `${own.length} practice problems`}</Badge>}
        {visualIndex.isIntro(path) && <Badge>Pattern intro</Badge>}
        {topics.length > 0 && <span className="dsp-muted dsp-small">Practises {topics.join(", ")}</span>}
      </div>

      {/* The lesson is the hero: its canvases need the full width and a tall
          stage (the mirror lays out to the frame's height and never scrolls),
          so the practice panels sit in a row underneath rather than beside. */}
      <div className="dsv-lesson">
        <section className="dsv-stage" ref={stageRef}>
          <header className="dsv-stage-bar">
            <span className="dsv-stage-dot" aria-hidden="true" />
            <span className="dsv-stage-title">{lesson.group.title}<b>{lesson.title}</b></span>
            <button type="button" className="dsp-icon-btn" onClick={() => setWide((value) => !value)} aria-pressed={wide} aria-label={wide ? "Exit theatre mode" : "Theatre mode"} title={wide ? "Exit theatre mode (Esc)" : "Theatre mode"}>{wide ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
          </header>
          <VisualLessonFrame
            path={path}
            title={`${lesson.title} — ${lesson.track.name}`}
            dark={dark}
            onNavigate={onOpen}
            onLoaded={markWatched}
            onDocument={onDocument}
            className="dsv-frame"
          />
          <nav className="dsv-pager" aria-label="Lesson navigation">
            {previous ? <button type="button" onClick={() => onOpen(previous.path)}><ArrowLeft size={14} /><span><em>Previous</em>{previous.title}</span></button> : <span />}
            {next ? <button type="button" className="is-next" onClick={() => onOpen(next.path)}><span><em>Next</em>{next.title}</span><ArrowRight size={14} /></button> : <span />}
          </nav>
        </section>

        <div className="dsv-below">
          {own.length > 0 && (
            <Panel title="Practice this" subtitle="The problem this lesson animates — solve it while the picture is fresh." className="dsv-practice-box">
              <ul className="dsv-practice">
                {own.map((problem) => <PracticeRow key={problem.id} problem={problem} solved={learner.completed.has(problem.id)} primary onOpen={openProblem} />)}
              </ul>
            </Panel>
          )}
          {pattern.length > 0 && (
            <Panel title={own.length ? "Same pattern" : "Practise the pattern"} subtitle={own.length ? `More ${lesson.group.title} problems with a lesson` : `Problems taught elsewhere in ${lesson.group.title}`}>
              <ul className="dsv-practice">
                {pattern.slice(0, 5).map((problem) => <PracticeRow key={problem.id} problem={problem} solved={learner.completed.has(problem.id)} primary={!own.length} onOpen={openProblem} />)}
              </ul>
            </Panel>
          )}
          <Panel title={lesson.group.title}>
            <Progress value={groupDone} max={lesson.group.items.length} label="Lessons watched" tone="info" />
            <ol className="dsv-outline">
              {lesson.group.items.map((item) => (
                <li key={item.path}>
                  <button type="button" className={`${item.path === path ? "is-current" : ""}${watched.has(item.path) ? " is-watched" : ""}`} aria-current={item.path === path ? "true" : undefined} onClick={() => onOpen(item.path)}>
                    <span className="dsv-outline-mark">{watched.has(item.path) ? <Check size={11} /> : null}</span>
                    <span>{item.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </Panel>
          <p className="dsp-muted dsp-small">Watched lessons are shared with Visual Learning in the main sidebar. <button type="button" className="dsp-link" onClick={() => navigate("notes")}>Notes</button> from the tutor link back here.</p>
        </div>
      </div>

      <AskAiChip selection={selection} onAsk={askAbout} />
      <LessonCoach
        lesson={coachLesson}
        phase={coachPhase}
        markdown={text}
        onOpenLesson={onOpen}
        open={tutorOpen}
        onClose={() => setTutorOpen(false)}
        request={tutorRequest}
        isDark={dark}
        lessons={COACH_LESSONS}
        noteType="visual"
        course={VISUAL_COURSE}
        codeFolder="Visual Learning"
        intro={VISUAL_INTRO}
      />
    </PrepPage>
  );
}
