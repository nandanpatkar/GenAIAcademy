import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Activity, ArrowRight, ArrowUpRight, Compass, FileText, Flame, MapPin,
  MessageSquareText, Mic, Orbit, Radar, Radio, Rocket, Sparkles, Target, TrendingUp,
} from "lucide-react";
import { MANUAL_STRUCTURE } from "../data/manualData";
import { HOME_INTERVIEW_QUESTIONS } from "../data/homeInterviewQuestions";
import "../styles/Home2.css";

// three.js voyage scene stays in its own chunk so the page shell paints first.
const Home2Voyage = React.lazy(() => import("./Home2Voyage"));

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const INTERNAL_KEYS = new Set([
  "workspace", "videoIntelligence", "saved_algos", "genai-roadmap-campusx",
  "onboarding", "appearance", "leetcode",
]);

const PLANET_PALETTE = ["#00ff88", "#22d3ee", "#a78bfa", "#f59e0b", "#f472b6", "#60a5fa"];

const SKILL_WORDS = [
  "PYTHON", "TRANSFORMERS", "RAG PIPELINES", "AGENTS", "VECTOR SEARCH",
  "KUBERNETES", "SYSTEM DESIGN", "LANGCHAIN", "MLOPS", "FINE-TUNING",
  "EMBEDDINGS", "PROMPT ENGINEERING",
];

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
    percent: modules.length ? Math.round((completed / modules.length) * 100) : 0,
  };
};

const hexToRgb = (hex) => {
  const raw = (hex || "").replace("#", "");
  const value = raw.length === 3 ? raw.split("").map(c => c + c).join("") : raw;
  const n = parseInt(value, 16);
  if (Number.isNaN(n) || value.length !== 6) return [0, 255, 136];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/* Generative synapse field: drifting particles linked when close, gently
   repelled by the pointer. Pure canvas — no textures, no network fetches. */
function NeuralCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;

    const ctx = canvas.getContext("2d");
    const host = canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const [r, g, b] = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue("--neon").trim());
    let width = 0;
    let height = 0;
    let particles = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const seed = () => {
      const count = Math.min(90, Math.floor((width * height) / 20000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() < 0.12 ? 2.6 : 1.4,
      }));
    };

    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      const linkDist = 130;
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const md = Math.hypot(dx, dy);
        if (md < 140 && md > 0.01) {
          p.vx += (dx / md) * 0.045;
          p.vy += (dy / md) * 0.045;
        }
        p.vx = Math.max(-0.6, Math.min(0.6, p.vx));
        p.vy = Math.max(-0.6, Math.min(0.6, p.vy));
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const c = particles[j];
          const d = Math.hypot(a.x - c.x, a.y - c.y);
          if (d < linkDist) {
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / linkDist) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(c.x, c.y);
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.fillStyle = p.size > 2 ? `rgba(${r},${g},${b},0.75)` : `rgba(${r},${g},${b},0.4)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    resize();
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="h2x-neural-canvas" aria-hidden="true" />;
}

function MissionLog({ lines }) {
  const [started, setStarted] = useState(false);
  const [output, setOutput] = useState([]);

  useEffect(() => {
    if (!started) return undefined;
    let lineIndex = 0;
    let charIndex = 0;
    let timer = 0;
    const tick = () => {
      const line = lines[lineIndex];
      if (line === undefined) return;
      charIndex += 1;
      setOutput(prev => {
        const next = [...prev];
        next[lineIndex] = line.slice(0, charIndex);
        return next;
      });
      if (charIndex >= line.length) {
        lineIndex += 1;
        charIndex = 0;
        timer = window.setTimeout(tick, 320);
      } else {
        timer = window.setTimeout(tick, 13);
      }
    };
    timer = window.setTimeout(tick, 350);
    return () => window.clearTimeout(timer);
  }, [started, lines]);

  return (
    <motion.div
      className="h2x-terminal"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 70, damping: 18 }}
      onViewportEnter={() => setStarted(true)}
    >
      <div className="h2x-terminal-bar">
        <span /><span /><span />
        <b>mission_log — genai.academy</b>
      </div>
      <div className="h2x-terminal-body">
        {output.map((line, index) => <div key={index} className={line.startsWith("$") ? "h2x-term-cmd" : "h2x-term-out"}>{line}</div>)}
        <span className="h2x-term-cursor" />
      </div>
    </motion.div>
  );
}

function MarqueeRow({ items, reverse }) {
  const content = items.flatMap((item, index) => [
    <span key={`w-${index}`}>{item}</span>,
    <i key={`s-${index}`} aria-hidden="true">✦</i>,
  ]);
  return (
    <div className={`h2x-marquee-row ${reverse ? "reverse" : ""}`}>
      <div className="h2x-marquee-track">{content}{content}</div>
    </div>
  );
}

const sectionReveal = {
  initial: { opacity: 0, y: 42 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { type: "spring", stiffness: 60, damping: 16 },
};

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#";

/* Matrix-style decode: glyph noise resolves into the heading on first view. */
function ScrambleText({ text }) {
  const [display, setDisplay] = useState(text);
  const [go, setGo] = useState(false);

  useEffect(() => {
    if (!go || prefersReducedMotion()) return undefined;
    let frame = 0;
    let raf = 0;
    const total = 26;
    const tick = () => {
      frame += 1;
      const progress = frame / total;
      setDisplay(text.split("").map((ch, index) => {
        if (ch === " ") return " ";
        return index / text.length < progress ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).join(""));
      if (frame < total) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [go, text]);

  return (
    <motion.span onViewportEnter={() => setGo(true)} viewport={{ once: true }}>{display}</motion.span>
  );
}

function CountUp({ value }) {
  const [n, setN] = useState(prefersReducedMotion() ? value : 0);

  useEffect(() => {
    if (prefersReducedMotion()) { setN(value); return undefined; }
    let raf = 0;
    const t0 = performance.now();
    const duration = 1500;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{n}</>;
}

/* CTA that leans toward the cursor and springs back on leave. */
function MagneticButton({ className, onClick, children }) {
  const x = useSpring(0, { stiffness: 160, damping: 14 });
  const y = useSpring(0, { stiffness: 160, damping: 14 });

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.22);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.32);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button className={className} style={{ x, y }} onMouseMove={handleMove} onMouseLeave={handleLeave} onClick={onClick}>
      {children}
    </motion.button>
  );
}

const localDayKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/* Contribution-style wall of the last 26 weeks of real completions. Cells
   cascade alight the first time the panel scrolls into view. */
function ActivityGrid({ completionsByDay }) {
  const [lit, setLit] = useState(false);

  const { cells, currentStreak, bestStreak, total } = useMemo(() => {
    const today = new Date();
    // Sized so the first cell lands on a Sunday and the last column ends today.
    const dayCount = 25 * 7 + today.getDay() + 1;
    const list = [];
    let sum = 0;
    for (let i = dayCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = localDayKey(d);
      const count = completionsByDay[key] || 0;
      sum += count;
      list.push({ key, count, level: count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : 4 });
    }
    let streak = 0;
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].count > 0) streak += 1;
      else if (i === list.length - 1) continue; // an empty "today" doesn't break the streak
      else break;
    }
    let best = 0;
    let run = 0;
    for (const cell of list) {
      run = cell.count > 0 ? run + 1 : 0;
      best = Math.max(best, run);
    }
    return { cells: list, currentStreak: streak, bestStreak: best, total: sum };
  }, [completionsByDay]);

  return (
    <motion.div className="h2x-heatmap-wrap" viewport={{ once: true, margin: "-40px" }} onViewportEnter={() => setLit(true)}>
      <div className={`h2x-heatmap ${lit ? "lit" : ""}`}>
        {cells.map((cell, index) => (
          <span
            key={cell.key}
            className={`h2x-hm-cell l${cell.level}`}
            style={{ "--d": `${index * 5}ms` }}
            title={`${cell.key} · ${cell.count} completion${cell.count === 1 ? "" : "s"}`}
          />
        ))}
      </div>
      <div className="h2x-heatmap-stats">
        <span><b>{currentStreak}</b> DAY STREAK</span>
        <span><b>{bestStreak}</b> BEST RUN</span>
        <span><b>{total}</b> COMPLETIONS / 26 WKS</span>
      </div>
      {total === 0 && <p className="h2x-heatmap-hint">Complete any module and this wall starts lighting up like a GPU cluster.</p>}
    </motion.div>
  );
}

/* The shape of your skills: one axis per path, polygon grows with progress. */
function SkillRadar({ items }) {
  const cx = 110;
  const cy = 110;
  const R = 76;
  const padded = [...items];
  while (padded.length < 3) padded.push(null);
  const n = padded.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const px = (i, r) => cx + Math.cos(angle(i)) * r;
  const py = (i, r) => cy + Math.sin(angle(i)) * r;
  const ringPoints = (f) => padded.map((_, i) => `${px(i, R * f)},${py(i, R * f)}`).join(" ");
  const valueR = (item) => (Math.max(item?.stats?.percent || 0, 4) / 100) * R;
  const poly = padded.map((item, i) => `${px(i, valueR(item))},${py(i, valueR(item))}`).join(" ");

  return (
    <div className="h2x-radar">
      <svg viewBox="0 0 220 220" role="img" aria-label="Skill radar across your learning paths">
        {[0.25, 0.5, 0.75, 1].map(f => <polygon key={f} className="h2x-radar-ring" points={ringPoints(f)} />)}
        {padded.map((_, i) => <line key={i} className="h2x-radar-axis" x1={cx} y1={cy} x2={px(i, R)} y2={py(i, R)} />)}
        <motion.polygon
          className="h2x-radar-poly"
          points={poly}
          style={{ transformOrigin: "110px 110px" }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.15 }}
        />
        {padded.map((item, i) => item && (
          <circle
            key={item.key}
            className="h2x-radar-dot"
            cx={px(i, valueR(item))}
            cy={py(i, valueR(item))}
            r="3.4"
            fill={item.path?.color || PLANET_PALETTE[i % PLANET_PALETTE.length]}
          />
        ))}
        {padded.map((item, i) => item && (
          <text
            key={`t-${item.key}`}
            className="h2x-radar-label"
            x={px(i, R + 17)}
            y={py(i, R + 17)}
            textAnchor={Math.abs(Math.cos(angle(i))) < 0.35 ? "middle" : Math.cos(angle(i)) > 0 ? "start" : "end"}
            dominantBaseline="middle"
          >
            {item.name.length > 13 ? `${item.name.slice(0, 12)}…` : item.name}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* Perspective tilt that follows the pointer; framer composes the rotation
   with the reveal/hover transforms so they never fight over `transform`. */
function TiltCard({ className, style, onClick, children }) {
  const rotateX = useSpring(0, { stiffness: 180, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 18 });

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    rotateX.set(-(((event.clientY - rect.top) / rect.height) - 0.5) * 10);
    rotateY.set((((event.clientX - rect.left) / rect.width) - 0.5) * 12);
  };
  const handleLeave = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <motion.button
      className={className}
      style={{ ...style, rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ y: -5 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      {...sectionReveal}
    >
      {children}
    </motion.button>
  );
}

export default function Home2Dashboard({
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
  const universeRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: rootRef });
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  const paths = useMemo(() => Object.entries(pathsData || {})
    .filter(([key, path]) => !INTERNAL_KEYS.has(key) && path?.nodes)
    .map(([key, path]) => ({ key, path, name: displayPathName(key, path), stats: getPathStats(path) })), [pathsData]);
  const current = paths.find(item => item.key === activePath) || paths[0];
  const nextNode = current?.path?.nodes?.find(node => (node.modules || []).some(module => module.status !== "complete")) || current?.path?.nodes?.[0];

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "operator";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "good morning" : hour < 18 ? "good afternoon" : "good evening";
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);

  const totalCompleted = paths.reduce((sum, item) => sum + item.stats.completed, 0);
  const totalModules = paths.reduce((sum, item) => sum + item.stats.total, 0);
  const overallPercent = totalModules ? Math.round((totalCompleted / totalModules) * 100) : 0;

  const daySeed = Math.floor(Date.now() / 86400000);
  const dailyQuestion = HOME_INTERVIEW_QUESTIONS.length
    ? HOME_INTERVIEW_QUESTIONS[daySeed % HOME_INTERVIEW_QUESTIONS.length]
    : null;
  const dailyManualTopic = useMemo(() => {
    const topics = MANUAL_STRUCTURE.flatMap(category => (category.guides || []).flatMap(guide => (guide.phases || []).map(phase => ({
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

  const marqueeTitles = useMemo(() => {
    const titles = paths.flatMap(item => (item.path.nodes || []).map(node => node.title)).filter(Boolean);
    return titles.length ? titles.slice(0, 14).map(title => title.toUpperCase()) : SKILL_WORDS;
  }, [paths]);

  const logLines = useMemo(() => [
    `$ boot genai.academy --user ${firstName.toLowerCase()}`,
    `> neural profile loaded · ${paths.length} active path${paths.length === 1 ? "" : "s"}`,
    `> ${totalCompleted}/${totalModules} modules trained (${overallPercent}%)`,
    `> current arc: ${current?.name || "none — awaiting selection"}`,
    `> next mission: ${nextNode?.title || "choose a path to begin"}`,
    "> status: systems online. awaiting operator.",
  ], [firstName, paths.length, totalCompleted, totalModules, overallPercent, current?.name, nextNode?.title]);

  const planets = paths.slice(0, 6);

  // Real study telemetry: every module/subtopic completion is stamped with a
  // date — aggregate them per local day for the activity wall.
  const completionsByDay = useMemo(() => {
    const map = {};
    const add = (dateStr) => {
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return;
      const key = localDayKey(d);
      map[key] = (map[key] || 0) + 1;
    };
    paths.forEach(({ path }) => (path.nodes || []).forEach(node => (node.modules || []).forEach(module => {
      if (module.status === "complete") add(module.completionDate);
      (module.subtopics || []).forEach(sub => {
        if (typeof sub === "object" && sub.status === "complete") add(sub.completionDate);
      });
    })));
    return map;
  }, [paths]);

  // The metro line: last cleared station + the next few stops on the active path.
  const routeStations = useMemo(() => {
    const nodes = current?.path?.nodes || [];
    const currentIdx = nodes.findIndex(node => (node.modules || []).some(module => module.status !== "complete"));
    const startIdx = Math.max(0, (currentIdx === -1 ? nodes.length : currentIdx) - 1);
    return nodes.slice(startIdx, startIdx + 6).map((node, i) => {
      const modules = node.modules || [];
      const done = modules.filter(module => module.status === "complete").length;
      const state = modules.length && done === modules.length
        ? "done"
        : startIdx + i === currentIdx ? "current" : "ahead";
      return { node, done, total: modules.length, state };
    });
  }, [current]);

  const continueLearning = () => nextNode ? onContinue(nextNode, current?.key) : onOpenOnboarding?.();
  const openPath = (pathKey) => { setActivePath?.(pathKey); onOpenRoadmap?.(); };
  const scrollToUniverse = () => universeRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="h2x-root" ref={rootRef}>
      <motion.div className="h2x-scroll-progress" style={{ scaleX: progressScale }} />

      {/* ── ACT I · Hero ─────────────────────────────────────────────── */}
      <section className="h2x-hero">
        <NeuralCanvas />
        <div className="h2x-hero-glow" aria-hidden="true" />
        <div className="h2x-hero-inner">
          <motion.p
            className="h2x-hero-greeting"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <span className="h2x-pulse-dot" /> {`// ${greeting}, ${firstName} — the academy is live`}
          </motion.p>
          <h1 className="h2x-display">
            <motion.span
              className="h2x-display-outline"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 60, damping: 14 }}
            >LEARN.</motion.span>
            <motion.span
              className="h2x-display-gradient"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 60, damping: 14 }}
            >BUILD.</motion.span>
            <motion.span
              className="h2x-display-solid"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 60, damping: 14 }}
            >SHIP INTELLIGENCE<em>.</em></motion.span>
          </h1>
          <motion.div
            className="h2x-hero-actions"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <MagneticButton className="h2x-cta" onClick={continueLearning}>
              <Sparkles size={15} />
              <span className="h2x-cta-label">{nextNode ? `Resume: ${nextNode.title}` : "Choose your first path"}</span>
              <ArrowRight size={15} />
            </MagneticButton>
            <button className="h2x-cta-ghost" onClick={scrollToUniverse}><Orbit size={14} /> Explore my universe</button>
          </motion.div>
          <motion.div
            className="h2x-hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05 }}
          >
            <span>[ <CountUp value={paths.length} /> PATHS ]</span>
            <span>[ <CountUp value={totalCompleted} />/{totalModules} MODULES ]</span>
            <span>[ <CountUp value={overallPercent} />% TRAINED ]</span>
            <span>[ DAY <CountUp value={dayOfYear} /> ]</span>
          </motion.div>
        </div>
        <div className="h2x-scroll-cue" aria-hidden="true"><span>SCROLL</span><i /></div>
      </section>

      {/* ── Marquee band ─────────────────────────────────────────────── */}
      <section className="h2x-marquee" aria-hidden="true">
        <MarqueeRow items={marqueeTitles} />
        <MarqueeRow items={SKILL_WORDS} reverse />
      </section>

      {/* ── ACT II · Mission log ─────────────────────────────────────── */}
      <section className="h2x-act">
        <motion.div className="h2x-act-head" {...sectionReveal}>
          <span className="h2x-act-index">01</span>
          <div>
            <span className="h2x-kicker"><Target size={12} /> MISSION LOG</span>
            <h2><ScrambleText text="The machine knows where you left off." /></h2>
          </div>
        </motion.div>
        <MissionLog lines={logLines} />
      </section>

      {/* ── ACT III · Orbital universe ───────────────────────────────── */}
      <section className="h2x-act" ref={universeRef}>
        <motion.div className="h2x-act-head" {...sectionReveal}>
          <span className="h2x-act-index">02</span>
          <div>
            <span className="h2x-kicker"><Orbit size={12} /> YOUR UNIVERSE</span>
            <h2><ScrambleText text="Every path you study is a planet in motion." /></h2>
          </div>
        </motion.div>
        <motion.div className="h2x-universe" {...sectionReveal}>
          <div className="h2x-orbit-stage" aria-hidden="true">
            <div className="h2x-orbit-core">
              <strong>{overallPercent}%</strong>
              <span>trained</span>
            </div>
            {planets.map((item, index) => {
              const size = 40 + index * (planets.length > 1 ? 56 / (planets.length - 1) : 0);
              const color = item.path?.color || PLANET_PALETTE[index % PLANET_PALETTE.length];
              return (
                <div
                  key={item.key}
                  className={`h2x-ring ${index % 2 ? "h2x-ring-rev" : ""}`}
                  style={{ width: `${size}%`, "--h2x-orbit-dur": `${46 + index * 22}s` }}
                >
                  <button
                    className={`h2x-planet ${item.key === current?.key ? "active" : ""}`}
                    style={{ "--h2x-planet": color }}
                    onClick={() => openPath(item.key)}
                    title={`${item.name} · ${item.stats.percent}%`}
                  >
                    <span className="h2x-planet-inner">
                      <span className="h2x-planet-dot" />
                      <span className="h2x-planet-tag">{item.name} · {item.stats.percent}%</span>
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          <div className="h2x-universe-legend">
            <p className="h2x-legend-lede">Click a planet — or a path below — to warp into its roadmap.</p>
            {planets.map((item, index) => (
              <button key={item.key} className={`h2x-legend-row ${item.key === current?.key ? "active" : ""}`} onClick={() => openPath(item.key)}>
                <span className="h2x-legend-dot" style={{ background: item.path?.color || PLANET_PALETTE[index % PLANET_PALETTE.length] }} />
                <span className="h2x-legend-copy"><strong>{item.name}</strong><small>{item.stats.completed}/{item.stats.total} modules</small></span>
                <span className="h2x-legend-meter"><i style={{ width: `${item.stats.percent}%` }} /></span>
                <b>{item.stats.percent}%</b>
              </button>
            ))}
            <button className="h2x-legend-new" onClick={onOpenOnboarding}><Compass size={14} /> Discover a new path</button>
          </div>
        </motion.div>
      </section>

      {/* ── ACT IV · The voyage (3D) ─────────────────────────────────── */}
      <section className="h2x-act h2x-act-voyage">
        <motion.div className="h2x-act-head" {...sectionReveal}>
          <span className="h2x-act-index">03</span>
          <div>
            <span className="h2x-kicker"><Rocket size={12} /> THE VOYAGE</span>
            <h2><ScrambleText text="Fly the road from learner to builder." /></h2>
          </div>
        </motion.div>
      </section>
      <section className="h2x-voyage">
        <React.Suspense fallback={<div className="h2x-voyage-loading">initializing flight systems…</div>}>
          <Home2Voyage />
        </React.Suspense>
        <div className="h2x-voyage-scan" aria-hidden="true" />
        <div className="h2x-voyage-hud h2x-voyage-hud-tl">NAV // ROUTE: {current?.name || "UNCHARTED"}</div>
        <div className="h2x-voyage-hud h2x-voyage-hud-tr">FUEL {overallPercent}% · VEL 0.98c</div>
        <div className="h2x-voyage-overlay">
          <p>NEXT STOP</p>
          <h3>{nextNode?.title || "Choose a destination"}</h3>
          <MagneticButton className="h2x-cta" onClick={continueLearning}>
            <Rocket size={15} /> Punch it — continue the journey <ArrowRight size={14} />
          </MagneticButton>
        </div>
      </section>

      {/* ── ACT V · The route ahead ──────────────────────────────────── */}
      <section className="h2x-act">
        <motion.div className="h2x-act-head" {...sectionReveal}>
          <span className="h2x-act-index">04</span>
          <div>
            <span className="h2x-kicker"><MapPin size={12} /> THE ROUTE AHEAD</span>
            <h2><ScrambleText text="Next stations on your line." /></h2>
          </div>
        </motion.div>
        <div className="h2x-route">
          {routeStations.map((station, index) => (
            <React.Fragment key={station.node.id}>
              {index > 0 && (
                <motion.span
                  className="h2x-route-link"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.12 }}
                />
              )}
              <motion.button
                className={`h2x-station ${station.state}`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 90, damping: 15, delay: index * 0.12 }}
                onClick={() => onContinue(station.node, current?.key)}
              >
                <span className="h2x-station-icon">{station.node.icon || "◈"}</span>
                <strong>{station.node.title}</strong>
                <small>
                  {station.state === "done" ? "cleared" : station.state === "current" ? "you are here" : `${station.done}/${station.total} modules`}
                </small>
              </motion.button>
            </React.Fragment>
          ))}
          {!routeStations.length && <div className="h2x-empty">Pick a path to chart your route.</div>}
        </div>
      </section>

      {/* ── ACT VI · Pilot telemetry ─────────────────────────────────── */}
      <section className="h2x-act">
        <motion.div className="h2x-act-head" {...sectionReveal}>
          <span className="h2x-act-index">05</span>
          <div>
            <span className="h2x-kicker"><Activity size={12} /> PILOT TELEMETRY</span>
            <h2><ScrambleText text="Your effort leaves a trace." /></h2>
          </div>
        </motion.div>
        <div className="h2x-telemetry">
          <motion.div className="h2x-panel" {...sectionReveal}>
            <div className="h2x-panel-title"><Flame size={13} /> NEURAL ACTIVITY · LAST 26 WEEKS</div>
            <ActivityGrid completionsByDay={completionsByDay} />
          </motion.div>
          <motion.div className="h2x-panel" {...sectionReveal}>
            <div className="h2x-panel-title"><Radar size={13} /> SKILL SHAPE</div>
            <SkillRadar items={planets} />
            <p className="h2x-radar-note">One axis per path — the polygon grows as you train.</p>
          </motion.div>
        </div>
      </section>

      {/* ── ACT VII · Transmissions ──────────────────────────────────── */}
      <section className="h2x-act">
        <motion.div className="h2x-act-head" {...sectionReveal}>
          <span className="h2x-act-index">06</span>
          <div>
            <span className="h2x-kicker"><Radio size={12} /> INCOMING TRANSMISSIONS</span>
            <h2><ScrambleText text="Three signals. Refreshed every day." /></h2>
          </div>
        </motion.div>
        <div className="h2x-transmissions">
          <TiltCard
            className="h2x-signal-card"
            style={{ "--h2x-signal": "#f59e0b" }}
            onClick={() => onOpenDiscovery?.({ type: "interview", lessonId: dailyQuestion?.id })}
          >
            <span className="h2x-signal-head"><span className="h2x-signal-bars"><i /><i /><i /><i /></span> FREQ 01 · INTERVIEW</span>
            <MessageSquareText size={20} />
            <h3>{dailyQuestion?.lesson_title || "Question incoming…"}</h3>
            <p>{dailyQuestion ? `${dailyQuestion.courseTitle} · ${dailyQuestion.chapterTitle}` : "Hold this frequency."}</p>
            <span className="h2x-signal-cta">Rehearse the answer <ArrowUpRight size={13} /></span>
          </TiltCard>
          <TiltCard
            className="h2x-signal-card"
            style={{ "--h2x-signal": "#a78bfa" }}
            onClick={() => onOpenDiscovery?.({ type: "manual", phase: dailyManualTopic })}
          >
            <span className="h2x-signal-head"><span className="h2x-signal-bars"><i /><i /><i /><i /></span> FREQ 02 · DEEP DIVE</span>
            <FileText size={20} />
            <h3>{dailyManualTopic?.title || "Topic incoming…"}</h3>
            <p>{dailyManualTopic ? `${dailyManualTopic.categoryName} · ${dailyManualTopic.guideTitle}` : "Hold this frequency."}</p>
            <span className="h2x-signal-cta">Open the lesson <ArrowUpRight size={13} /></span>
          </TiltCard>
          <TiltCard
            className="h2x-signal-card"
            style={{ "--h2x-signal": "#22d3ee" }}
            onClick={() => onNavigate?.("gemini_interviewer")}
          >
            <span className="h2x-signal-head"><span className="h2x-signal-bars"><i /><i /><i /><i /></span> FREQ 03 · LIVE VOICE</span>
            <Mic size={20} />
            <h3>Talk to the interviewer.</h3>
            <p>A live voice interview with the Gemini orb — speak your answers out loud.</p>
            <span className="h2x-signal-cta">Go live <ArrowUpRight size={13} /></span>
          </TiltCard>
        </div>
      </section>

      {/* ── ACT V · Outro ────────────────────────────────────────────── */}
      <section className="h2x-outro">
        <motion.h2 {...sectionReveal}>Ship something<br /><em>today.</em></motion.h2>
        <motion.div className="h2x-outro-actions" {...sectionReveal}>
          <MagneticButton className="h2x-cta" onClick={() => onNavigate?.("playground")}><Sparkles size={15} /> Open the playground <ArrowRight size={14} /></MagneticButton>
          <button className="h2x-cta-ghost" onClick={() => onOpenProgress?.()}><TrendingUp size={14} /> Review my progress</button>
          <button className="h2x-cta-ghost" onClick={() => onNavigate?.("galaxy")}><Orbit size={14} /> Knowledge galaxy</button>
        </motion.div>
        <p className="h2x-outro-foot">Classic Home still lives in the sidebar · GENAI ACADEMY</p>
      </section>
    </div>
  );
}
