import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, BookOpen, Bot, Boxes, CheckSquare, Code2, Compass,
  FlaskConical, GraduationCap, Layers, MessageSquareText, Mic, Network, Pause,
  Play, Share2, ShieldCheck, Sparkles, Target, TrendingUp, X, Zap,
} from "lucide-react";
import { MANUAL_STRUCTURE } from "../data/manualData";
import { HOME_INTERVIEW_QUESTIONS } from "../data/homeInterviewQuestions";
import {
  ChangeStack, ChaosField, ContextGraph, CoverageStrip, ScrambleReel,
} from "./Home3Scenes";
import "../styles/Home3.css";

const INTERNAL_KEYS = new Set([
  "workspace", "videoIntelligence", "saved_algos", "genai-roadmap-campusx",
  "onboarding", "appearance", "leetcode",
]);

const CHAPTER_MS = 7000;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const EASE = [0.16, 1, 0.3, 1];

const displayPathName = (key, path) => {
  if (key === "ds") return "Data Science";
  if (key === "genai") return "Generative AI";
  if (key === "agentic") return "Agentic AI";
  return (path?.title || key || "Learning path").replace(/ Curriculum$/, "");
};

const getPathStats = (path) => {
  const modules = (path?.nodes || []).flatMap(node => node.modules || []);
  const completed = modules.filter(module => module.status === "complete").length;
  return {
    total: modules.length,
    completed,
    remaining: modules.length - completed,
    percent: modules.length ? Math.round((completed / modules.length) * 100) : 0,
  };
};

const localDayKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/* Headline lines rise out of their own clipping mask, one after the next. */
function Line({ children, delay = 0 }) {
  return (
    <span className="h3x-line">
      <motion.span
        initial={{ y: "115%" }}
        animate={{ y: 0 }}
        transition={{ delay, duration: 0.9, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* Counts only once the figure is actually on screen. */
function CountUp({ value, duration = 1100 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion()) { setShown(value); return undefined; }
    let raf = 0;
    const started = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - started) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return <span ref={ref}>{shown}</span>;
}

const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: EASE },
};

const stagger = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, margin: "-60px" },
  variants: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* Pointer-tracked glow, written straight to CSS custom properties so the
   highlight follows the cursor without re-rendering React. */
const trackSpotlight = (event) => {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
};

/* A framed "product surface" — the chrome the reference page puts around
   every in-page demo so a live panel reads as a screenshot of the real app. */
function Surface({ title, tone, children }) {
  return (
    <div className="h3x-surface" style={tone ? { "--h3x-tone": tone } : undefined} onMouseMove={trackSpotlight}>
      <div className="h3x-surface-bar">
        <span className="h3x-surface-dots"><i /><i /><i /></span>
        <span className="h3x-surface-title">{title}</span>
      </div>
      <div className="h3x-surface-body">{children}</div>
    </div>
  );
}

/* Rows inside a panel deal themselves in when the panel opens. */
function Deal({ index = 0, children, className = "", ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.12 + index * 0.07, duration: 0.45, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

function Marquee({ items }) {
  const row = [...items, ...items];
  return (
    <div className="h3x-marquee" aria-hidden="true">
      <div className="h3x-marquee-track">
        {row.map((item, i) => (
          <span className="h3x-marquee-item" key={`${item}-${i}`}>{item}<i /></span>
        ))}
      </div>
    </div>
  );
}

export default function Home3({
  user,
  pathsData,
  activePath,
  setActivePath,
  onContinue,
  onOpenRoadmap,
  onOpenProgress,
  onOpenDiscovery,
  onOpenOnboarding,
  onNavigate,
}) {
  const rootRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: rootRef });
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  // The hero's grid drifts a little slower than the page it sits behind.
  const gridShift = useTransform(scrollYProgress, [0, 0.25], [0, 90]);

  const [activeChapter, setActiveChapter] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [reduced] = useState(() => prefersReducedMotion());

  // The deck auto-advances like a story reel. The countdown *is* the timer:
  // the bar's own animationend drives the next panel, so pausing the bar
  // (hover, or the pin toggle) pauses the advance too and the two can never
  // drift apart the way a separate setTimeout would.
  const paused = pinned || hovering;

  const paths = useMemo(() => Object.entries(pathsData || {})
    .filter(([key, path]) => !INTERNAL_KEYS.has(key) && path?.nodes)
    .map(([key, path]) => ({ key, path, name: displayPathName(key, path), stats: getPathStats(path) })), [pathsData]);

  const current = paths.find(item => item.key === activePath) || paths[0];
  const nextNode = current?.path?.nodes?.find(node => (node.modules || []).some(module => module.status !== "complete"))
    || current?.path?.nodes?.[0];

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const totalCompleted = paths.reduce((sum, item) => sum + item.stats.completed, 0);
  const totalModules = paths.reduce((sum, item) => sum + item.stats.total, 0);
  const overallPercent = totalModules ? Math.round((totalCompleted / totalModules) * 100) : 0;

  const daySeed = Math.floor(Date.now() / 86400000);
  const dailyQuestion = HOME_INTERVIEW_QUESTIONS.length
    ? HOME_INTERVIEW_QUESTIONS[daySeed % HOME_INTERVIEW_QUESTIONS.length]
    : null;

  const dailyManualTopic = useMemo(() => {
    const topics = MANUAL_STRUCTURE.flatMap(category => (category.guides || []).flatMap(guide =>
      (guide.phases || []).map(phase => ({
        title: phase.title || guide.title,
        categorySlug: category.slug,
        categoryName: category.name,
        guideSlug: guide.slug,
        guideTitle: guide.title,
        phaseSlug: phase.slug,
        filePath: phase.filePath,
      }))));
    return topics.length ? topics[daySeed % topics.length] : null;
  }, [daySeed]);

  // The next few stops on the active path, with the module counts that make
  // the "01 Resume" panel read like a changed-files list.
  const stations = useMemo(() => {
    const nodes = current?.path?.nodes || [];
    const currentIdx = nodes.findIndex(node => (node.modules || []).some(module => module.status !== "complete"));
    const startIdx = Math.max(0, (currentIdx === -1 ? nodes.length : currentIdx) - 1);
    return nodes.slice(startIdx, startIdx + 5).map((node, i) => {
      const modules = node.modules || [];
      const done = modules.filter(module => module.status === "complete").length;
      const state = modules.length && done === modules.length
        ? "done"
        : startIdx + i === currentIdx ? "current" : "ahead";
      return { node, done, total: modules.length, state };
    });
  }, [current]);

  // "02 Prioritize" — least-finished paths first, the way the reference page
  // ranks a PR queue. Risk is just how far behind a path has fallen.
  const queue = useMemo(() => [...paths]
    .filter(item => item.stats.total > 0)
    .sort((a, b) => a.stats.percent - b.stats.percent || b.stats.remaining - a.stats.remaining)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
      risk: item.stats.percent < 34 ? "high" : item.stats.percent < 67 ? "medium" : "low",
    })), [paths]);

  const concepts = useMemo(() => (current?.path?.nodes || [])
    .flatMap(node => (node.modules || []).map(module => module.title))
    .filter(Boolean)
    .slice(0, 8), [current]);

  const marqueeItems = useMemo(() => {
    const titles = paths.flatMap(item => (item.path.nodes || []).map(node => node.title)).filter(Boolean);
    return titles.length
      ? titles.slice(0, 16)
      : ["Transformers", "Retrieval", "Agents", "Evaluation", "Fine-tuning", "Vector search", "MLOps", "Prompting"];
  }, [paths]);

  // Study streak: consecutive days back from today with at least one completion.
  const streak = useMemo(() => {
    const days = new Set();
    paths.forEach(({ path }) => (path.nodes || []).forEach(node => (node.modules || []).forEach(module => {
      const stamp = module.status === "complete" ? module.completionDate : null;
      if (stamp) {
        const d = new Date(stamp);
        if (!Number.isNaN(d.getTime())) days.add(localDayKey(d));
      }
      (module.subtopics || []).forEach(sub => {
        if (typeof sub === "object" && sub.status === "complete" && sub.completionDate) {
          const d = new Date(sub.completionDate);
          if (!Number.isNaN(d.getTime())) days.add(localDayKey(d));
        }
      });
    })));
    let count = 0;
    const cursor = new Date();
    while (days.has(localDayKey(cursor))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [paths]);

  const resume = () => (nextNode ? onContinue?.(nextNode, current?.key) : onOpenOnboarding?.());
  const openPath = useCallback((pathKey) => { setActivePath?.(pathKey); onOpenRoadmap?.(); }, [setActivePath, onOpenRoadmap]);

  const chapters = [
    {
      id: "resume",
      label: "Resume",
      rest: "exactly where you stopped",
      accent: "var(--h3x-orange)",
      render: () => (
        <Surface title={`${current?.name || "No path selected"} · next stops`} tone="var(--h3x-orange)">
          <div className="h3x-filelist">
            {stations.map(({ node, done, total, state }, i) => (
              <Deal key={node.id} index={i}>
                <button className={`h3x-file ${state}`} onClick={() => onContinue?.(node, current?.key)}>
                  <span className="h3x-file-glyph">{node.icon || "◈"}</span>
                  <span className="h3x-file-name">{node.title}</span>
                  <span className="h3x-file-counts">
                    <b className="add">+{done}</b>
                    <b className="del">−{Math.max(0, total - done)}</b>
                  </span>
                  <span className="h3x-file-state">
                    {state === "done" ? "cleared" : state === "current" ? "you are here" : "queued"}
                  </span>
                </button>
              </Deal>
            ))}
            {!stations.length && <p className="h3x-empty">Pick a study path and the queue fills itself in.</p>}
          </div>
        </Surface>
      ),
    },
    {
      id: "prioritize",
      label: "Prioritize",
      rest: "what actually needs the hours",
      accent: "var(--h3x-indigo)",
      render: () => (
        <Surface title="Study queue · ranked by drift" tone="var(--h3x-indigo)">
          <div className="h3x-queue">
            <div className="h3x-queue-head">
              <span>#</span><span>Path</span><span>Left</span><span>Risk</span><span />
            </div>
            {queue.map((item, i) => (
              <Deal key={item.key} index={i}>
                <button className="h3x-queue-row" onClick={() => openPath(item.key)}>
                  <span className="h3x-queue-rank">{String(item.rank).padStart(2, "0")}</span>
                  <span className="h3x-queue-name">{item.name}</span>
                  <span className="h3x-queue-left">{item.stats.remaining}</span>
                  <span><span className={`h3x-risk ${item.risk}`}>{item.risk}</span></span>
                  <span className="h3x-queue-go"><ArrowUpRight size={13} /></span>
                </button>
              </Deal>
            ))}
            {!queue.length && <p className="h3x-empty">No paths yet — start one and it lands here.</p>}
          </div>
        </Surface>
      ),
    },
    {
      id: "understand",
      label: "Understand",
      rest: "the theory under the code",
      accent: "var(--h3x-mint)",
      render: () => (
        <Surface title="Deep dive of the day" tone="var(--h3x-mint)">
          <div className="h3x-dive">
            <Deal index={0}><span className="h3x-dive-tag"><BookOpen size={12} /> {dailyManualTopic?.categoryName || "Manual"}</span></Deal>
            <Deal index={1}><h4>{dailyManualTopic?.title || "A new chapter every day"}</h4></Deal>
            <Deal index={2}><p>{dailyManualTopic?.guideTitle || "The manual rotates one lesson into view each morning."}</p></Deal>
            <Deal index={3}>
              <button className="h3x-inline-cta" onClick={() => onOpenDiscovery?.({ type: "manual", phase: dailyManualTopic })}>
                Read the lesson <ArrowRight size={13} />
              </button>
            </Deal>
            <motion.div className="h3x-chips" {...stagger} viewport={{ once: false }}>
              {/* Module titles repeat across nodes, so the index has to be part of the key. */}
              {concepts.map((concept, i) => (
                <motion.span key={`${concept}-${i}`} className="h3x-chip" variants={staggerChild}>{concept}</motion.span>
              ))}
              {!concepts.length && <span className="h3x-chip">Concepts appear once a path is active</span>}
            </motion.div>
          </div>
        </Surface>
      ),
    },
    {
      id: "prove",
      label: "Prove",
      rest: "you can answer it out loud",
      accent: "var(--h3x-amber)",
      render: () => (
        <Surface title="Interview drill" tone="var(--h3x-amber)">
          <div className="h3x-drill">
            <Deal index={0}><span className="h3x-dive-tag"><MessageSquareText size={12} /> Question of the day</span></Deal>
            <Deal index={1}><h4>{dailyQuestion?.lesson_title || "A fresh question lands every day"}</h4></Deal>
            <Deal index={2}>
              <p>{dailyQuestion ? `${dailyQuestion.courseTitle} · ${dailyQuestion.chapterTitle}` : "Come back tomorrow for the next one."}</p>
            </Deal>
            <Deal index={3}>
              <div className="h3x-drill-actions">
                <button className="h3x-inline-cta" onClick={() => onOpenDiscovery?.({ type: "interview", lessonId: dailyQuestion?.id })}>
                  Rehearse it <ArrowRight size={13} />
                </button>
                <button className="h3x-inline-cta ghost" onClick={() => onNavigate?.("gemini_interviewer")}>
                  <Mic size={13} /> Say it out loud
                </button>
              </div>
            </Deal>
            <Deal index={4}>
              <span className="h3x-waveform" aria-hidden="true">
                {Array.from({ length: 28 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 60}ms` }} />)}
              </span>
            </Deal>
          </div>
        </Surface>
      ),
    },
  ];

  // Deliberately spread across the whole academy — paths, agent frameworks,
  // the from-scratch track, the lab bench, the library and career prep — not
  // just the coding-practice corner.
  const bento = [
    { id: "labs", icon: FlaskConical, title: "The lab bench", copy: "130+ simulators for retrieval, agents, training, evaluation and production ops.", span: "wide" },
    { id: "langchain", icon: Bot, title: "Agent frameworks", copy: "LangChain, LangGraph, DeepAgents, LangSmith and Strands, documented end to end." },
    { id: "aifs_curriculum", icon: GraduationCap, title: "AI from Scratch", copy: "Twenty phases from first setup to capstone, each with code and a quiz." },
    { id: "curriculum_map", icon: Network, title: "Paths & roadmaps", copy: "Gen AI, Agentic AI and Data Science as maps you can actually navigate.", span: "wide" },
    { id: "playground", icon: Sparkles, title: "Playground & design", copy: "Build AI systems, architectures and whiteboards straight in the browser." },
    { id: "interview_prep", icon: MessageSquareText, title: "Interview prep", copy: "Structured lessons, an AI interviewer, and a live voice round." },
    { id: "manual", icon: BookOpen, title: "Manual & reference", copy: "Guided lessons, the quick-reference, and the glossary behind all of it." },
    { id: "leetcode", icon: Code2, title: "Code Lab & arenas", copy: "LeetCode-style practice, SQL, algorithms and real-time battles." },
    { id: "knowledge_graph", icon: Share2, title: "Concept connections", copy: "See how every idea in the curriculum hangs off the others." },
    { id: "quiz", icon: CheckSquare, title: "Quizzes & exams", copy: "Practice rounds and full certification papers when you want the score." },
  ];

  return (
    <div className="h3x-root" ref={rootRef}>
      <motion.div className="h3x-progress" style={{ scaleX: progressScale }} />

      {/* ── Announcement strip ───────────────────────────────────────── */}
      {bannerOpen && (
        <motion.div
          className="h3x-banner"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span>
            {overallPercent}% trained across {paths.length} path{paths.length === 1 ? "" : "s"}.
            {nextNode ? ` Next up: ${nextNode.title}.` : " Pick a path to begin."}
          </span>
          <button className="h3x-banner-link" onClick={resume}>Resume <ArrowRight size={12} /></button>
          <button className="h3x-banner-close" onClick={() => setBannerOpen(false)} aria-label="Dismiss"><X size={13} /></button>
        </motion.div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className="h3x-hero">
        <motion.div className="h3x-hero-grid" style={{ y: gridShift }} aria-hidden="true" />
        <div className="h3x-hero-orb" aria-hidden="true" />
        <div className="h3x-wrap h3x-hero-inner">
          <motion.p className="h3x-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <span className="h3x-eyebrow-dot" /> CONTINUOUS LEARNING SYSTEM
          </motion.p>
          <div className="h3x-hero-cols">
            <h1 className="h3x-headline">
              <Line delay={0.1}>The hard part isn&apos;t</Line>
              <Line delay={0.19}>collecting courses.</Line>
              <Line delay={0.28}>
                It&apos;s <ScrambleReel phrases={["finishing them.", "shipping them.", "proving them."]} />
              </Line>
            </h1>
            <motion.div
              className="h3x-hero-aside"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
            >
              <p>
                One place to resume, prioritise, understand and prove what you are learning —
                built on your own progress, not a generic syllabus.
              </p>
              <button className="h3x-cta" onClick={resume}>
                {nextNode ? "Resume where you left off" : "Choose your first path"} <ArrowRight size={15} />
              </button>
              <button className="h3x-textlink" onClick={() => onOpenProgress?.()}>
                <TrendingUp size={13} /> See the full progress report
              </button>
            </motion.div>
          </div>
        </div>
        <Marquee items={marqueeItems} />
      </header>

      {/* ── Chapter deck — the numbered, auto-advancing product strip ── */}
      <section className="h3x-deck-shell">
        <div
          className="h3x-deck"
          role="tablist"
          aria-label="What the academy does for you"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {chapters.map((chapter, index) => {
            const open = index === activeChapter;
            return (
              <div
                key={chapter.id}
                className={`h3x-panel ${open ? "open" : ""}`}
                style={{ "--h3x-accent": chapter.accent }}
                onMouseEnter={() => setActiveChapter(index)}
              >
                <button
                  className="h3x-panel-tab"
                  role="tab"
                  aria-selected={open}
                  onClick={() => { setActiveChapter(index); setPinned(true); }}
                  onFocus={() => setActiveChapter(index)}
                >
                  <span className="h3x-panel-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="h3x-panel-label">
                    <strong>{chapter.label}</strong>
                    <em>{chapter.rest}</em>
                  </span>
                </button>
                {open && !reduced && (
                  <span
                    className={`h3x-panel-timer ${paused ? "paused" : ""}`}
                    style={{ animationDuration: `${CHAPTER_MS}ms` }}
                    onAnimationEnd={() => setActiveChapter(i => (i + 1) % chapters.length)}
                    aria-hidden="true"
                  />
                )}
                <div className="h3x-panel-body">{open && chapter.render()}</div>
              </div>
            );
          })}
        </div>
        <div className="h3x-deck-foot">
          {/* Nothing to pause when the deck never advances on its own. */}
          {!reduced ? (
            <button className="h3x-deck-toggle" onClick={() => setPinned(p => !p)}>
              {pinned ? <><Play size={12} /> Resume auto-play</> : <><Pause size={12} /> Pause auto-play</>}
            </button>
          ) : <span />}
          <span className="h3x-deck-dots" aria-hidden="true">
            {chapters.map((chapter, index) => (
              <i key={chapter.id} className={index === activeChapter ? "on" : ""} />
            ))}
          </span>
        </div>
      </section>

      {/* ── Statement — sources flooding one pipeline ────────────────── */}
      <section className="h3x-statement">
        <ChaosField>
          {/* Centred, so the source swarm on the left edge stays in the clear. */}
          <div className="h3x-chaos-copy">
            <motion.h2 {...reveal}>More to learn.<br /><span>Same twenty-four hours.</span></motion.h2>
            <motion.p className="h3x-statement-lede" {...reveal}>
              Courses, papers, repos, videos and threads arrive faster than anyone can
              read them — let alone finish, practise and remember them.
            </motion.p>
          </div>
        </ChaosField>
        <motion.div className="h3x-wrap h3x-figures" {...stagger}>
          <motion.div variants={staggerChild}><strong><CountUp value={totalCompleted} /></strong><span>modules cleared</span></motion.div>
          <motion.div variants={staggerChild}><strong><CountUp value={totalModules - totalCompleted} /></strong><span>still ahead</span></motion.div>
          <motion.div variants={staggerChild}><strong><CountUp value={streak} /></strong><span>day streak</span></motion.div>
          <motion.div variants={staggerChild}><strong><CountUp value={overallPercent} />%</strong><span>overall</span></motion.div>
        </motion.div>
      </section>

      {/* ── Feature row · roadmap ────────────────────────────────────── */}
      <section className="h3x-wrap h3x-feature">
        <motion.div className="h3x-feature-copy" {...stagger}>
          <motion.span className="h3x-eyebrow" variants={staggerChild}><Target size={12} /> ROADMAP</motion.span>
          <motion.h3 variants={staggerChild}>Your roadmap, already in order.</motion.h3>
          <ul className="h3x-points">
            <motion.li variants={staggerChild}><h4>Every path in one meter</h4><p>Completion is computed from real module state, not a checkbox you ticked.</p></motion.li>
            <motion.li variants={staggerChild}><h4>The next stop is always named</h4><p>No hunting through a tree — the first unfinished node is the one you resume.</p></motion.li>
            <motion.li variants={staggerChild}><h4>Switch tracks without losing place</h4><p>Each path keeps its own position, so jumping between them costs nothing.</p></motion.li>
          </ul>
          <motion.button className="h3x-textlink" variants={staggerChild} onClick={() => onNavigate?.("curriculum_map")}>
            <Compass size={13} /> Open the full roadmap
          </motion.button>
        </motion.div>
        <motion.div className="h3x-feature-visual" {...reveal}>
          <Surface title="Paths · live completion" tone="var(--neon)">
            <div className="h3x-meters">
              {paths.map(item => (
                <button
                  key={item.key}
                  className={`h3x-meter ${item.key === current?.key ? "active" : ""}`}
                  onClick={() => openPath(item.key)}
                >
                  <span className="h3x-meter-top">
                    <b>{item.name}</b>
                    <em>{item.stats.completed}/{item.stats.total}</em>
                  </span>
                  <span className="h3x-meter-track">
                    <motion.i
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.stats.percent}%` }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
                      style={{ background: item.path?.color || "var(--neon)" }}
                    />
                  </span>
                </button>
              ))}
              {!paths.length && (
                <button className="h3x-inline-cta" onClick={onOpenOnboarding}><Sparkles size={13} /> Build my first path</button>
              )}
            </div>
          </Surface>
        </motion.div>
      </section>

      {/* ── Change stack · explainability for a big curriculum ───────── */}
      <section className="h3x-wrap h3x-band">
        <motion.div className="h3x-band-head" {...stagger}>
          <motion.span className="h3x-band-index" variants={staggerChild}>03</motion.span>
          <motion.div variants={staggerChild}>
            <span className="h3x-eyebrow"><Layers size={12} /> CHANGE STACK</span>
            <h3>Explainability for a massive curriculum.</h3>
            <p>A roadmap dumps hundreds of modules on you at once. This stacks them into
              layers you can actually reason about — hover any layer to see what it costs.</p>
          </motion.div>
        </motion.div>
        <motion.div {...reveal}>
          <ChangeStack
            pathName={current?.name}
            nodes={current?.path?.nodes}
            onOpen={(node) => onContinue?.(node, current?.key)}
          />
        </motion.div>
      </section>

      {/* ── Feature row · practice ───────────────────────────────────── */}
      <section className="h3x-wrap h3x-feature reverse">
        <motion.div className="h3x-feature-copy" {...stagger}>
          <motion.span className="h3x-eyebrow" variants={staggerChild}><Zap size={12} /> PRACTICE</motion.span>
          <motion.h3 variants={staggerChild}>Reading is not retention.</motion.h3>
          <ul className="h3x-points">
            <motion.li variants={staggerChild}><h4>Simulators for the parts a video skips</h4><p>Chunking, reranking, agent loops, training stability, evals, rollout — over a hundred of them.</p></motion.li>
            <motion.li variants={staggerChild}><h4>Frameworks documented end to end</h4><p>LangChain, LangGraph, Strands and AgentCore, with the runnable samples sitting beside the prose.</p></motion.li>
            <motion.li variants={staggerChild}><h4>Build the thing, don&apos;t watch it</h4><p>An AI playground, a system-design canvas, an editor and a judge that grades what you wrote.</p></motion.li>
            <motion.li variants={staggerChild}><h4>Then prove it out loud</h4><p>Quizzes, timed arenas, and a live voice interview for when comfortable practice stops teaching.</p></motion.li>
          </ul>
          <motion.button className="h3x-textlink" variants={staggerChild} onClick={() => onNavigate?.("labs")}>
            <FlaskConical size={13} /> Open the lab bench
          </motion.button>
        </motion.div>
        <motion.div className="h3x-feature-visual" {...reveal}>
          <Surface title="console — academy" tone="var(--h3x-indigo)">
            <TypedConsole lines={[
              `$ academy status --user ${firstName.toLowerCase()}`,
              `  paths      ${paths.length}`,
              `  modules    ${totalCompleted}/${totalModules} (${overallPercent}%)`,
              `  streak     ${streak} day${streak === 1 ? "" : "s"}`,
              `  next       ${nextNode?.title || "— choose a path"}`,
              "",
              "$ academy resume",
              "  ✓ ready when you are.",
            ]} />
          </Surface>
        </motion.div>
      </section>

      {/* ── Coverage · the posture board, continuously scanned ───────── */}
      <section className="h3x-wrap h3x-band">
        <motion.div className="h3x-band-head" {...stagger}>
          <motion.span className="h3x-band-index" variants={staggerChild}>04</motion.span>
          <motion.div variants={staggerChild}>
            <span className="h3x-eyebrow"><ShieldCheck size={12} /> COVERAGE</span>
            <h3>Continuous coverage monitoring.</h3>
            <p>Ditch the vague sense that you &ldquo;sort of know&rdquo; a topic. Every module is a
              cell on the board, and the sweep never stops re-reading it.</p>
          </motion.div>
        </motion.div>
        <motion.div {...reveal}>
          <CoverageStrip paths={paths} onOpenPath={openPath} />
        </motion.div>
      </section>

      {/* ── Context · the graph, under the same sweep ────────────────── */}
      <section className="h3x-wrap h3x-band">
        <motion.div className="h3x-band-head" {...stagger}>
          <motion.span className="h3x-band-index" variants={staggerChild}>05</motion.span>
          <motion.div variants={staggerChild}>
            <span className="h3x-eyebrow"><Share2 size={12} /> SHARED INTELLIGENCE</span>
            <h3>Best-in-class context.</h3>
            <p>Every surface here reads from the same graph, so a quiz result changes what
              the roadmap recommends and what the interview drill asks next.</p>
          </motion.div>
        </motion.div>
        <motion.div {...reveal}>
          <ContextGraph overallPercent={overallPercent} />
        </motion.div>
      </section>

      {/* ── Bento ────────────────────────────────────────────────────── */}
      <section className="h3x-wrap h3x-bento-shell">
        <motion.h3 className="h3x-bento-head" {...reveal}>One academy, many surfaces.</motion.h3>
        <motion.div className="h3x-bento" {...stagger}>
          {bento.map(card => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                className={`h3x-tile ${card.span || ""}`}
                onClick={() => onNavigate?.(card.id)}
                onMouseMove={trackSpotlight}
                variants={staggerChild}
              >
                <Icon size={18} />
                <strong>{card.title}</strong>
                <p>{card.copy}</p>
                <span className="h3x-tile-go"><ArrowUpRight size={14} /></span>
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <section className="h3x-outro">
        <div className="h3x-wrap">
          <motion.h2 {...reveal}>Raise the bar.<br />Lower the drift.</motion.h2>
          <motion.div className="h3x-outro-actions" {...reveal}>
            <button className="h3x-cta" onClick={resume}>
              {nextNode ? `Continue: ${nextNode.title}` : "Start learning"} <ArrowRight size={15} />
            </button>
            <button className="h3x-textlink" onClick={() => onNavigate?.("labs")}><Boxes size={13} /> Browse the labs</button>
            <button className="h3x-textlink" onClick={() => onNavigate?.("quiz")}><CheckSquare size={13} /> Take a quiz</button>
          </motion.div>
          <p className="h3x-foot">Home and Home 2.0 are still in the sidebar · GENAI ACADEMY</p>
        </div>
      </section>
    </div>
  );
}

/* Console that types itself out once it scrolls into view. */
function TypedConsole({ lines }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReducedMotion()) { setCount(lines.length); return undefined; }
    setCount(0);
    const timer = window.setInterval(() => {
      setCount(c => {
        if (c >= lines.length) { window.clearInterval(timer); return c; }
        return c + 1;
      });
    }, 210);
    return () => window.clearInterval(timer);
  }, [inView, lines.length]);

  return (
    <pre className="h3x-console" ref={ref}>
      {lines.slice(0, count).map((line, i) => <span key={i}>{line || " "}{"\n"}</span>)}
      {count >= lines.length && <span className="h3x-caret" aria-hidden="true" />}
    </pre>
  );
}
