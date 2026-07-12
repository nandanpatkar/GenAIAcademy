import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Terminal, Boxes, Layers, Orbit, GraduationCap,
  Clapperboard, Users, BookMarked, Bot, BrainCircuit, Cpu,
  Share2, ArrowRight, Fingerprint, Sparkles, Check
} from "lucide-react";
import { Icon } from "@iconify/react";
import "./NewLandingPage.css";
import "./LandingPage.css"; // PipelineCanvas styles (ga-* classes)

// ── Content data ─────────────────────────────────────────────────────────────

const MODES = [
  {
    id: 'learn', badge: 'LEARN', color: '#38bdf8',
    title: 'Guided Learning Tracks',
    description: 'Three structured roadmaps — Gen AI, Agentic AI, and Data Science — visualized as an explorable knowledge galaxy with progress tracking.',
    features: ['Knowledge Galaxy & Study Map', 'Gen AI · Agentic AI · Data Science', 'Curated videos, papers & docs', 'Progress tracking per topic'],
  },
  {
    id: 'build', badge: 'BUILD', color: '#ffb03a',
    title: 'Cloud IDE + AI Assistant',
    description: 'A full in-browser IDE with an AI pair-programmer that writes code straight into your project — run it instantly, sync to GitHub.',
    features: ['Monaco editor · split view · themes', 'AI generates, edits & diffs code', 'Run Python, JS, Java, C++, Go', 'GitHub import, commit & versions'],
  },
  {
    id: 'prepare', badge: 'PREPARE', color: '#00f0ff',
    title: 'Interview-Ready Practice',
    description: '22 interview courses, an AI interviewer that grills you in real time, adaptive quizzes, and a DSA practice IDE with live execution.',
    features: ['22 structured interview courses', 'AI Interviewer with feedback', 'DSA Animator & Algo Studio', 'Quizzes & spaced practice'],
  },
];

const TRUST_PILLS = [
  '3 Learning Tracks', '7+ Interactive Simulators', 'Cloud IDE with AI Assistant',
  '22 Interview Courses', '100% In-Browser', 'Free to Start',
];

const FEATURES = [
  { icon: <Terminal size={20} />, title: 'Cloud IDE', badge: 'AI-POWERED', description: 'Full project IDE with an AI assistant, GitHub sync, versions, and one-click code execution.', color: '#38bdf8' },
  { icon: <Cpu size={20} />, title: 'Practice IDE', description: 'Zero-setup Python environment for DSA drills — write, run, and iterate instantly.', color: '#ffb03a' },
  { icon: <Boxes size={20} />, title: 'GenAI Simulator', description: 'Visualize RAG pipelines, embeddings, and agent loops as living, animated systems.', color: '#00f0ff' },
  { icon: <Layers size={20} />, title: 'System Design Simulator', badge: 'CHALLENGES', description: 'Drag components, wire them up, and run traffic simulations against design challenges.', color: '#38bdf8' },
  { icon: <Share2 size={20} />, title: 'AWS Architecture Simulator', description: 'Model production AWS systems with cost estimation and architecture analysis.', color: '#ffb03a' },
  { icon: <Clapperboard size={20} />, title: 'DSA Animator & Algo Studio', description: 'Watch algorithms execute step by step — pointers, recursion, and state, animated.', color: '#00f0ff' },
  { icon: <Orbit size={20} />, title: 'Knowledge Galaxy', description: 'Your entire curriculum as an explorable graph — see how every concept connects.', color: '#38bdf8' },
  { icon: <Bot size={20} />, title: 'AI Interviewer', badge: 'VOICE', description: 'Mock interviews with an AI that asks follow-ups, probes weak spots, and scores you.', color: '#ffb03a' },
  { icon: <GraduationCap size={20} />, title: 'Interview Prep', description: '22 courses across GenAI, RAG, agents, ML, and system design — with notes and an AI tutor.', color: '#00f0ff' },
  { icon: <Users size={20} />, title: 'Community', description: 'Discuss, share builds, and learn alongside other AI engineers on the same path.', color: '#38bdf8' },
  { icon: <BookMarked size={20} />, title: 'Blog, Notes & Resources', description: 'Curated links, quick notes, and deep-dive posts — everything in one workspace.', color: '#ffb03a' },
];

// ── Pipeline canvas data (from LandingPage.jsx) ──────────────────────────────

const LOG_POOL = [
  { service: 'USER',  message: 'prompt received · parsing intent',   status: 'ok' },
  { service: 'AGENT', message: 'plan generated · 3 steps',           status: 'ok' },
  { service: 'RAG',   message: 'top-k=5 retrieved · 42ms',           status: 'ok' },
  { service: 'TOOL',  message: 'web_search invoked · HTTP 200',      status: 'ok' },
  { service: 'LLM',   message: 'streaming · 512 tok/s',              status: 'ok' },
  { service: 'MEM',   message: 'context window compacted',           status: 'ok' },
  { service: 'RAG',   message: 'reranking chunks · cohere-v3',       status: 'ok' },
  { service: 'TOOL',  message: 'code_exec sandbox spawned',          status: 'warn' },
  { service: 'AGENT', message: 'reflection pass · confidence 0.94',  status: 'ok' },
  { service: 'LLM',   message: 'final answer synthesized',           status: 'ok' },
];

const ts = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};

// ── Node line-art icons ──────────────────────────────────────────────────────
const UserArt = () => (
  <svg viewBox="0 0 64 64" className="ga-svg-art">
    <defs><linearGradient id="gaUserG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#0284c7" />
    </linearGradient></defs>
    <rect x="12" y="16" width="40" height="26" rx="3" fill="none" stroke="url(#gaUserG)" strokeWidth="2.5" />
    <line x1="16" y1="36" x2="48" y2="36" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" />
    <path d="M 6 42 L 58 42 L 54 48 L 10 48 Z" fill="none" stroke="url(#gaUserG)" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M 18 24 L 28 24 M 18 28 L 34 28 M 18 32 L 24 32" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 28 10 Q 32 6 36 10" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" className="ga-pulse-sig" />
    <circle cx="32" cy="13" r="1.5" fill="#38bdf8" />
  </svg>
);

const CoreArt = () => (
  <svg viewBox="0 0 64 64" className="ga-svg-art">
    <defs><linearGradient id="gaCoreG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#059669" />
    </linearGradient></defs>
    <circle cx="32" cy="32" r="9" fill="none" stroke="url(#gaCoreG)" strokeWidth="3" />
    <circle cx="32" cy="32" r="3" fill="#34d399" className="ga-pulse-core" />
    <circle cx="32" cy="32" r="18" fill="none" stroke="rgba(52,211,153,0.3)" strokeWidth="1.5" strokeDasharray="4 6" className="ga-spin-ccw" />
    <circle cx="32" cy="32" r="25" fill="none" stroke="url(#gaCoreG)" strokeWidth="1.5" strokeDasharray="16 12" className="ga-spin-cw" />
    <line x1="32" y1="6" x2="32" y2="12" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
    <line x1="32" y1="52" x2="32" y2="58" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="32" x2="12" y2="32" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
    <line x1="52" y1="32" x2="58" y2="32" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ToolsArt = () => (
  <svg viewBox="0 0 64 64" className="ga-svg-art">
    <defs><linearGradient id="gaToolG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#d97706" />
    </linearGradient></defs>
    <path d="M 8 16 L 32 8 L 56 16 L 32 24 Z" fill="none" stroke="url(#gaToolG)" strokeWidth="2" />
    <path d="M 8 16 L 8 20 L 32 28 L 56 20 L 56 16" fill="none" stroke="url(#gaToolG)" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="44" cy="19" r="1.5" fill="#34d399" className="ga-led-fast" />
    <circle cx="48" cy="17" r="1.5" fill="#fbbf24" className="ga-led-slow" />
    <path d="M 8 28 L 8 32 L 32 40 L 56 32 L 56 28" fill="none" stroke="url(#gaToolG)" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="44" cy="31" r="1.5" fill="#34d399" className="ga-led-slow" />
    <circle cx="48" cy="29" r="1.5" fill="#ef4444" className="ga-led-fast" />
    <path d="M 8 40 L 8 44 L 32 52 L 56 44 L 56 40" fill="none" stroke="url(#gaToolG)" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="44" cy="43" r="1.5" fill="#34d399" className="ga-led-fast" />
    <circle cx="48" cy="41" r="1.5" fill="#fbbf24" className="ga-led-slow" />
  </svg>
);

const VectorArt = () => (
  <svg viewBox="0 0 64 64" className="ga-svg-art">
    <defs><linearGradient id="gaDbG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#a78bfa" /><stop offset="100%" stopColor="#7c3aed" />
    </linearGradient></defs>
    <ellipse cx="32" cy="18" rx="20" ry="7" fill="none" stroke="url(#gaDbG)" strokeWidth="2.5" />
    <path d="M 12 18 L 12 30 A 20 7 0 0 0 52 30 L 52 18" fill="none" stroke="url(#gaDbG)" strokeWidth="2.5" />
    <path d="M 12 30 L 12 42 A 20 7 0 0 0 52 42 L 52 30" fill="none" stroke="url(#gaDbG)" strokeWidth="2.5" />
    <path d="M 22 23 C 26 25 38 25 42 23" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
    <path d="M 22 35 C 26 37 38 37 42 35" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
    <ellipse cx="32" cy="48" rx="22" ry="8" fill="none" stroke="rgba(167,139,250,0.4)" strokeWidth="1.5" strokeDasharray="6 12" className="ga-spin-cw" />
    <circle cx="16" cy="44" r="3" fill="#a78bfa" className="ga-pulse-core" />
  </svg>
);

const NODES = [
  { id: 'user',   art: <UserArt />,   badge: 'USER',       label: 'Prompt In',      sub: 'Intent & context',        pos: { left: '25%', top: '52.4%' } },
  { id: 'core',   art: <CoreArt />,   badge: 'AGENT CORE', label: 'LLM Reasoning',  sub: 'Plan · act · reflect',     pos: { left: '50%', top: '32.3%' } },
  { id: 'tools',  art: <ToolsArt />,  badge: 'TOOLS',      label: 'APIs & Actions', sub: 'Search · code · exec',     pos: { left: '75%', top: '52.4%' } },
  { id: 'vector', art: <VectorArt />, badge: 'VECTOR DB',  label: 'RAG Memory',     sub: 'Embeddings · top-k',       pos: { left: '50%', top: '72.6%' } },
];

// ── PipelineCanvas (browser mockup with live simulation) ─────────────────────
function PipelineCanvas() {
  const [logs, setLogs] = useState(() =>
    LOG_POOL.slice(0, 4).map(l => ({ ...l, timestamp: ts() }))
  );
  const [metrics, setMetrics] = useState({ latency: 96, tps: 512, errors: 0 });
  const [spark, setSpark] = useState([12, 18, 10, 20, 14, 22, 12, 19, 15, 24, 16, 20]);
  const logIdx = useRef(4);

  const wrapperRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 2.5, y: -6 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const logTimer = setInterval(() => {
      setLogs(prev => {
        const next = LOG_POOL[logIdx.current % LOG_POOL.length];
        logIdx.current += 1;
        return [...prev.slice(-4), { ...next, timestamp: ts() }];
      });
    }, 1800);
    const metricTimer = setInterval(() => {
      setMetrics({
        latency: 78 + Math.round(Math.random() * 62),
        tps: 420 + Math.round(Math.random() * 240),
        errors: Math.random() > 0.92 ? 1 : 0,
      });
      setSpark(prev => [...prev.slice(1), 8 + Math.round(Math.random() * 18)]);
    }, 1100);
    return () => { clearInterval(logTimer); clearInterval(metricTimer); };
  }, []);

  const sparkPath = useMemo(() => {
    const step = 120 / (spark.length - 1);
    return spark.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(1)},${(30 - v).toFixed(1)}`).join(' ');
  }, [spark]);

  const handleMouseMove = (e) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 2.5, y: -6 });
  };

  return (
    <div
      className={`ga-sim-wrapper ${isHovering ? 'hovering' : ''}`}
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="ga-browser-chrome"
        style={{
          transform: `rotateY(${tilt.y}deg) rotateX(${tilt.x}deg) ${isHovering ? 'scale(1.04) translateY(-12px)' : ''}`
        }}
      >
        <div className="ga-titlebar">
          <div className="ga-traffic-lights">
            <span className="ga-tl red" /><span className="ga-tl yellow" /><span className="ga-tl green" />
          </div>
          <span className="ga-nav-refresh">&#x21bb;</span>
          <div className="ga-url-bar">
            <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
              <path d="M8 1a3.5 3.5 0 0 0-3.5 3.5V7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7V4.5A3.5 3.5 0 0 0 8 1zm-2 3.5a2 2 0 1 1 4 0V7H6V4.5z" />
            </svg>
            <span className="ga-url-text">genai-academy://agent-pipeline.live-view</span>
          </div>
        </div>

        <div className="ga-canvas-wrapper">
          <div className="ga-cyber-grid" aria-hidden="true" />
          <div className="ga-scanline" aria-hidden="true" />

          {/* Conduits + packets (diamond geometry) */}
          <svg className="ga-sim-svg" viewBox="0 0 1000 620" preserveAspectRatio="none">
            <defs>
              <filter id="ga-glow-h" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="ga-glow-s" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <linearGradient id="ga-g1" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" /><stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="ga-g2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" /><stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="ga-g3" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" /><stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Base rails + pulsing conduits */}
            <path d="M 250 325 L 500 200" stroke="rgba(56,189,248,0.15)" strokeWidth="5" fill="none" />
            <path d="M 250 325 L 500 200" stroke="url(#ga-g1)" strokeWidth="1.5" fill="none" strokeDasharray="10 15" className="ga-conduit fast" filter="url(#ga-glow-s)" />
            <path d="M 500 200 L 750 325" stroke="rgba(52,211,153,0.15)" strokeWidth="5" fill="none" />
            <path d="M 500 200 L 750 325" stroke="url(#ga-g2)" strokeWidth="1.5" fill="none" strokeDasharray="8 12" className="ga-conduit med" filter="url(#ga-glow-s)" />
            <path d="M 750 325 L 500 450" stroke="rgba(251,191,36,0.15)" strokeWidth="5" fill="none" />
            <path d="M 750 325 L 500 450" stroke="url(#ga-g3)" strokeWidth="1.5" fill="none" strokeDasharray="6 8" className="ga-conduit slow" filter="url(#ga-glow-s)" />
            {/* Return whisper lines */}
            <path d="M 500 450 L 250 325" stroke="rgba(167,139,250,0.08)" strokeWidth="2" fill="none" strokeDasharray="4 6" />
            <path d="M 750 325 L 500 200" stroke="rgba(251,191,36,0.08)" strokeWidth="2" fill="none" strokeDasharray="4 6" />
            <path d="M 500 200 L 250 325" stroke="rgba(52,211,153,0.08)" strokeWidth="2" fill="none" strokeDasharray="4 6" />

            {/* Packets */}
            <circle r="4.5" fill="#38bdf8" filter="url(#ga-glow-h)"><animateMotion dur="1.6s" repeatCount="indefinite" path="M 250,325 L 500,200" /></circle>
            <circle r="3" fill="#34d399" filter="url(#ga-glow-s)"><animateMotion dur="1.6s" begin="0.8s" repeatCount="indefinite" path="M 250,325 L 500,200" /></circle>
            <circle r="4.5" fill="#34d399" filter="url(#ga-glow-h)"><animateMotion dur="1.2s" begin="0.3s" repeatCount="indefinite" path="M 500,200 L 750,325" /></circle>
            <circle r="3" fill="#fbbf24" filter="url(#ga-glow-s)"><animateMotion dur="1.2s" begin="0.9s" repeatCount="indefinite" path="M 500,200 L 750,325" /></circle>
            <circle r="4.5" fill="#fbbf24" filter="url(#ga-glow-h)"><animateMotion dur="1s" begin="0.6s" repeatCount="indefinite" path="M 750,325 L 500,450" /></circle>
            <circle r="3.5" fill="#a78bfa" filter="url(#ga-glow-h)"><animateMotion dur="0.9s" begin="0.2s" repeatCount="indefinite" path="M 500,450 L 750,325" /></circle>
            <circle r="3.5" fill="#fbbf24" filter="url(#ga-glow-h)"><animateMotion dur="1.1s" begin="0.5s" repeatCount="indefinite" path="M 750,325 L 500,200" /></circle>
            <circle r="4" fill="#38bdf8" filter="url(#ga-glow-h)"><animateMotion dur="1.4s" begin="0.1s" repeatCount="indefinite" path="M 500,200 L 250,325" /></circle>
            <circle r="3" fill="#a78bfa" filter="url(#ga-glow-s)"><animateMotion dur="1.3s" begin="0.7s" repeatCount="indefinite" path="M 500,450 L 250,325" /></circle>
          </svg>

          {/* HTML node layer */}
          <div className="ga-nodes-layer">
            {NODES.map(n => (
              <article key={n.id} className={`ga-sim-node ${n.id}`} style={{ left: n.pos.left, top: n.pos.top }}>
                <div className="ga-node-icon-box">
                  {n.art}
                  <span className="ga-node-badge">{n.badge}</span>
                  <div className="ga-glow-indicator" />
                </div>
                <div className="ga-node-label">
                  <h3>{n.label}</h3>
                  <p>{n.sub}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Console overlay */}
          <div className="ga-console-overlay">
            <div className="ga-console-header">
              <span className="ga-console-dot" />
              <span className="ga-console-title">AGENT_CONSOLE // LIVE_LOGS</span>
              <span className="ga-console-cursor">_</span>
            </div>
            <div className="ga-console-logs">
              {logs.map((log, i) => (
                <div key={`${log.timestamp}-${i}`} className="ga-log-entry">
                  <span className="ga-log-time">{log.timestamp}</span>
                  <span className={`ga-log-tag ${log.service.toLowerCase()}`}>[{log.service}]</span>
                  <span className={`ga-log-msg ${log.status}`}>{log.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry overlay */}
          <div className="ga-metrics-overlay">
            <div className="ga-metrics-header">TELEMETRY // LIVE_FEED</div>
            <div className="ga-metric-row">
              <span className="ga-m-key">latency</span>
              <span className="ga-m-val good">{metrics.latency}ms</span>
            </div>
            <svg width="100%" height="16" viewBox="0 0 120 30" preserveAspectRatio="none" className="ga-sparkline">
              <defs>
                <linearGradient id="ga-spark-g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" /><stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={sparkPath} fill="none" stroke="#38bdf8" strokeWidth="1.8" />
              <path d={`${sparkPath} L 120,30 L 0,30 Z`} fill="url(#ga-spark-g)" />
            </svg>
            <div className="ga-metric-summary">
              <span>TOK/s: <strong>{metrics.tps}</strong></span>
              <span>ERR: <strong className={metrics.errors ? 'warn' : ''}>{metrics.errors}</strong></span>
            </div>
          </div>

          {/* Status badge */}
          <div className="ga-status-badge">
            <span className="ga-status-dot" />
            <span>PIPELINE ACTIVE // LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────
export default function NewLandingPage({ onEnter, onSwitch }) {
  const [revealed, setRevealed] = useState(new Set());
  const heroVideoRef = useRef(null);
  const mainRef = useRef(null);

  const particles = useMemo(
    () => [
      { left: "14%", size: 3, duration: "4.5s", delay: "0s" },
      { left: "39%", size: 2, duration: "3.8s", delay: "1.2s" },
      { left: "67%", size: 4, duration: "5.2s", delay: "2.4s" },
      { left: "83%", size: 2.5, duration: "4.2s", delay: "0.7s" },
      { left: "58%", size: 2, duration: "4.9s", delay: "3.1s" },
    ],
    []
  );

  // Scroll: parallax video + nav glass effect
  useEffect(() => {
    const mainEl = mainRef.current;
    if (!mainEl) return;

    const onScroll = () => {
      const y = mainEl.scrollTop;
      if (heroVideoRef.current) {
        heroVideoRef.current.style.transform = `translateY(${y * 0.3}px)`;
      }
      const nav = document.getElementById("nlp-top-nav");
      if (nav) {
        if (y > 60) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
      }
    };
    onScroll();
    mainEl.addEventListener("scroll", onScroll, { passive: true });
    return () => mainEl.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer for scroll-reveal sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setRevealed((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute("data-reveal-id");
              if (id) next.add(id);
              observer.unobserve(entry.target);
            }
          });
          return next;
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px", root: mainRef.current }
    );
    document.querySelectorAll("[data-reveal-id]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler for anchor links
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const revealClass = (id) => (revealed.has(id) ? "nlp-code-reveal active" : "nlp-code-reveal");

  return (
    <main className="nlp-main" ref={mainRef}>
      {/* ── Background effects ── */}
      <div className="nlp-terminal-grid" />
      <div className="nlp-ambient-lamp" />
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', height: '40vw', width: '40vw', borderRadius: '50%', backgroundColor: 'rgba(56,189,248,0.05)', filter: 'blur(120px)', zIndex: 0 }} />
      {particles.map((p, i) => (
        <div
          key={i}
          className="nlp-particle"
          style={{
            left: p.left,
            width: p.size + "px",
            height: p.size + "px",
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* ── Navigation ── */}
      <nav id="nlp-top-nav" className="nlp-nav">
        <div className="nlp-nav-container">
          <a href="#" className="nlp-brand nlp-font-mono" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'white', textDecoration: 'none' }}>
            <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
              <span style={{ position: 'absolute', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#00f0ff', opacity: 0.75, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
              <span style={{ position: 'relative', height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#00f0ff' }} />
            </span>
            GENAI // ACADEMY
          </a>

          <div className="nlp-nav-links nlp-font-mono">
            <a href="#capabilities">Capabilities</a>
            <a href="#sandbox">Sandbox</a>
            <a href="#arsenal">Arsenal</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={onEnter} className="nlp-btn-primary">
              Enter Academy
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <header className="nlp-header">
        <div className="nlp-absolute nlp-inset-0 nlp-z-0">
          <video
            ref={heroVideoRef}
            autoPlay
            loop
            muted
            playsInline
            className="nlp-video-bg"
            style={{ willChange: "transform" }}
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to top, #080b0e, rgba(8,11,14,0.05), transparent)' }} />
        </div>

        <div className="nlp-hero-content">
          <div className="nlp-hero-text">
            <div className="nlp-eyebrow-badge">
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ffb03a' }} />
              <span className="nlp-font-mono">
                Think like an Architect & Build like an Engineer
              </span>
            </div>

            <h1 className="nlp-h1">
              An interactive platform to<br />
              Learn, Build,<br />Simulate and Deploy<br />
              <span className="nlp-gradient-text nlp-font-mono">
                AI Systems.
              </span>
            </h1>

            <p className="nlp-hero-description">
              GenAI Academy pairs guided tracks in Gen AI, Agentic AI, and Data Science with a
              cloud IDE, an AI pair-programmer, live architecture simulators, and interview prep
              that actually runs your code. Every concept has a lab. Every lab runs.
            </p>

            <div className="nlp-hero-actions">
              <button onClick={onEnter} className="nlp-btn-primary">
                <span>Enter Academy</span>
                <ArrowRight size={16} />
              </button>
              <a href="#capabilities" className="nlp-btn-secondary">
                See what's inside
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="nlp-relative nlp-z-10">

        {/* ── Trust Strip ── */}
        <section data-reveal-id="trust" className={`${revealClass("trust")}`}>
          <div className="nlp-trust-strip">
            {TRUST_PILLS.map(pill => (
              <span key={pill} className="nlp-trust-pill nlp-font-mono">{pill}</span>
            ))}
          </div>
        </section>

        {/* ── Mode Cards (Learn / Build / Prepare) ── */}
        <section
          id="capabilities"
          data-reveal-id="capabilities"
          className={`${revealClass("capabilities")} nlp-section`}
        >
          <div style={{ margin: '0 auto 4rem auto', maxWidth: '42rem', textAlign: 'center' }}>
            <span className="nlp-font-mono nlp-kicker" style={{ color: '#ffb03a' }}>
              One Academy — Every Path
            </span>
            <h2 className="nlp-section-title">
              Built for learners & sharpened for engineers
            </h2>
            <p className="nlp-section-sub">
              Pick up the fundamentals through guided tracks, build real projects in the cloud IDE,
              or drill interviews with an AI that pushes back. Same platform, whichever path you're on.
            </p>
          </div>

          <div className="nlp-grid nlp-md-grid-3">
            {MODES.map((mode, idx) => (
              <div key={mode.id} className="nlp-mode-card">
                <div>
                  <div className="nlp-mode-header">
                    <div className="nlp-mode-icon-wrapper" style={{ borderColor: `${mode.color}33`, backgroundColor: `${mode.color}1a`, color: mode.color }}>
                      {idx === 0 ? <Orbit size={24} /> : idx === 1 ? <Terminal size={24} /> : <GraduationCap size={24} />}
                    </div>
                    <span className="nlp-font-mono nlp-mode-badge" style={{ color: mode.color }}>{mode.badge}</span>
                  </div>
                  <h3 className="nlp-mode-title">{mode.title}</h3>
                  <p className="nlp-mode-description">{mode.description}</p>
                  <ul className="nlp-mode-features">
                    {mode.features.map(f => (
                      <li key={f}><Check size={12} style={{ color: mode.color, flexShrink: 0 }} />{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pipeline Sandbox (Mocked browser with hover effect) ── */}
        <section id="sandbox" data-reveal-id="sandbox" className={`${revealClass("sandbox")} nlp-section-border`}>
          <div style={{ margin: '0 auto', maxWidth: '80rem', padding: '0 1.5rem' }}>
            <div style={{ margin: '0 auto 4rem auto', maxWidth: '42rem', textAlign: 'center' }}>
              <span className="nlp-font-mono nlp-kicker" style={{ color: '#38bdf8' }}>
                Command Override
              </span>
              <h2 className="nlp-section-title">
                Interactive Sandbox Matrix
              </h2>
              <p className="nlp-section-sub">
                A live agent-pipeline simulation running inside a mocked browser. Watch prompts flow through 
                LLM reasoning, RAG memory, and tool execution in real time.
              </p>
            </div>

            <PipelineCanvas />
          </div>
        </section>

        {/* ── Feature Arsenal ── */}
        <section id="arsenal" data-reveal-id="arsenal" className={`${revealClass("arsenal")} nlp-section`}>
          <div style={{ marginBottom: '4rem' }}>
            <span className="nlp-font-mono nlp-kicker" style={{ color: '#ffb03a' }}>
              Know your Arsenal
            </span>
            <h2 className="nlp-section-title">
              Everything inside <span className="nlp-gradient-text">GenAI Academy</span>
            </h2>
          </div>

          <div className="nlp-feature-grid">
            {FEATURES.map((f) => (
              <article key={f.title} className="nlp-feature-item">
                <div className="nlp-feature-icon" style={{ color: f.color }}>
                  {f.icon}
                </div>
                <div className="nlp-feature-info">
                  <h3>
                    {f.title}
                    {f.badge && <span className="nlp-feature-badge">{f.badge}</span>}
                  </h3>
                  <p>{f.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section
          data-reveal-id="subscribe"
          className={`${revealClass("subscribe")} nlp-section`}
          style={{ textAlign: 'center', position: 'relative' }}
        >
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: 'rgba(255,176,58,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <Sparkles size={40} color="#38bdf8" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            <h2 className="nlp-section-title">
              Your journey from developer to<br />AI Architect starts here.
            </h2>
            <p style={{ maxWidth: '36rem', fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8', fontWeight: 300, margin: 0 }}>
              Join the Academy. Get access to all simulators, the cloud IDE, AI interviewer,
              and guided learning tracks — everything runs right in your browser.
            </p>
            <button onClick={onEnter} className="nlp-btn-primary nlp-btn-big">
              <span>Enter Academy</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="nlp-footer">
          <div className="nlp-grid nlp-grid-12" style={{ margin: '0 auto 4rem auto', maxWidth: '80rem', alignItems: 'flex-start' }}>
            <div className="nlp-col-5" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <a href="#" className="nlp-font-mono" style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '0.05em', color: 'white', textDecoration: 'none' }}>
                GENAI // ACADEMY
              </a>
              <p style={{ maxWidth: '24rem', fontSize: '0.875rem', lineHeight: 1.6, color: '#64748b', fontWeight: 300, margin: 0 }}>
                An interactive platform to learn, build, simulate and deploy AI systems.
                Guided tracks, cloud IDE, live simulators, and interview prep — all in-browser.
              </p>
            </div>

            <div className="nlp-col-7 nlp-grid nlp-md-grid-3" style={{ width: '100%' }}>
              <div>
                <h4 className="nlp-footer-heading nlp-font-mono">Tracks</h4>
                <ul className="nlp-footer-links nlp-font-mono">
                  <li><a href="#">Gen AI</a></li>
                  <li><a href="#">Agentic AI</a></li>
                  <li><a href="#">Data Science</a></li>
                  <li><a href="#">Interview Prep</a></li>
                </ul>
              </div>
              <div>
                <h4 className="nlp-footer-heading nlp-font-mono">Simulators</h4>
                <ul className="nlp-footer-links nlp-font-mono">
                  <li><a href="#">System Design</a></li>
                  <li><a href="#">AWS Architecture</a></li>
                  <li><a href="#">GenAI Pipeline</a></li>
                  <li><a href="#">DSA Animator</a></li>
                </ul>
              </div>
              <div>
                <h4 className="nlp-footer-heading nlp-font-mono">Platform</h4>
                <div style={{ display: 'flex', gap: '1rem', color: '#64748b' }}>
                  <a href="#" style={{ color: 'inherit', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#64748b'}><Icon icon="mdi:github" fontSize={20} /></a>
                  <a href="#" style={{ color: 'inherit', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#64748b'}><Terminal size={20} /></a>
                  <a href="#" style={{ color: 'inherit', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#64748b'}><Cpu size={20} /></a>
                </div>
              </div>
            </div>
          </div>

          <div className="nlp-footer-bottom nlp-font-mono">
            <p style={{ margin: 0 }}>© 2026 GENAI // ACADEMY. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>

          {/* Switch button at the very bottom */}
          <div className="nlp-switch-section">
            <button onClick={onSwitch} className="nlp-switch-btn nlp-font-mono">
              Switch to Classic Landing Page
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
