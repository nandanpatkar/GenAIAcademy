/**
 * LandingPage.jsx — GenAI Academy landing
 *
 * Faithful to the AWS System Design Simulator landing: lavender/indigo light
 * theme + deep-navy dark theme with sun/moon toggle, mesh orbs, glass panels,
 * and a Mac browser mockup running a live agent-pipeline simulation with
 * console logs, telemetry sparkline, and a status badge.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowRight, Sparkles, Terminal, Boxes, Layers, Orbit, GraduationCap,
  Clapperboard, Users, BookMarked, Bot, BrainCircuit, Check, ChevronUp,
  Cpu, Share2, GitCommit,
} from 'lucide-react';
import './LandingPage.css';

const THEME_KEY = 'ga-landing-theme';

// ── Live console log feed ────────────────────────────────────────────────────
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

// ── Node line-art icons (AWS-simulator style, same palette) ──────────────────
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

// ── Browser mockup with pipeline, console, telemetry ─────────────────────────
function PipelineCanvas() {
  const [logs, setLogs] = useState(() =>
    LOG_POOL.slice(0, 4).map(l => ({ ...l, timestamp: ts() }))
  );
  const [metrics, setMetrics] = useState({ latency: 96, tps: 512, errors: 0 });
  const [spark, setSpark] = useState([12, 18, 10, 20, 14, 22, 12, 19, 15, 24, 16, 20]);
  const logIdx = useRef(4);

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

  return (
    <div className="ga-sim-wrapper">
      <div className="ga-browser-chrome">
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

          {/* Conduits + packets (AWS diamond geometry) */}
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

            {/* Packets — forward + echoes + returns */}
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

// ── Content data ─────────────────────────────────────────────────────────────
const MODES = [
  {
    id: 'learn', badge: 'LEARN', icon: <Orbit size={18} />,
    title: 'Guided Learning Tracks',
    description: 'Three structured roadmaps — Gen AI, Agentic AI, and Data Science — visualized as an explorable knowledge galaxy with progress tracking.',
    features: ['Knowledge Galaxy & Study Map', 'Gen AI · Agentic AI · Data Science', 'Curated videos, papers & docs', 'Progress tracking per topic'],
  },
  {
    id: 'build', badge: 'BUILD', icon: <Terminal size={18} />,
    title: 'Cloud IDE + AI Assistant',
    description: 'A full in-browser IDE with an AI pair-programmer that writes code straight into your project — run it instantly, sync to GitHub.',
    features: ['Monaco editor · split view · themes', 'AI generates, edits & diffs code', 'Run Python, JS, Java, C++, Go', 'GitHub import, commit & versions'],
  },
  {
    id: 'prepare', badge: 'PREPARE', icon: <GraduationCap size={18} />,
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
  { icon: <Terminal size={17} />, title: 'Cloud IDE', badge: 'AI-POWERED', description: 'Full project IDE with an AI assistant, GitHub sync, versions, and one-click code execution.' },
  { icon: <Cpu size={17} />, title: 'Practice IDE', description: 'Zero-setup Python environment for DSA drills — write, run, and iterate instantly.' },
  { icon: <Boxes size={17} />, title: 'GenAI Simulator', description: 'Visualize RAG pipelines, embeddings, and agent loops as living, animated systems.' },
  { icon: <Layers size={17} />, title: 'System Design Simulator', badge: 'CHALLENGES', description: 'Drag components, wire them up, and run traffic simulations against design challenges.' },
  { icon: <Share2 size={17} />, title: 'AWS Architecture Simulator', description: 'Model production AWS systems with cost estimation and architecture analysis.' },
  { icon: <Clapperboard size={17} />, title: 'DSA Animator & Algo Studio', description: 'Watch algorithms execute step by step — pointers, recursion, and state, animated.' },
  { icon: <Orbit size={17} />, title: 'Knowledge Galaxy', description: 'Your entire curriculum as an explorable graph — see how every concept connects.' },
  { icon: <Bot size={17} />, title: 'AI Interviewer', badge: 'VOICE', description: 'Mock interviews with an AI that asks follow-ups, probes weak spots, and scores you.' },
  { icon: <GitCommit size={17} />, title: 'Git & K8s Playgrounds', description: 'Interactive Git visualizer and Kubernetes games that make infra muscle memory.' },
  { icon: <GraduationCap size={17} />, title: 'Interview Prep', description: '22 courses across GenAI, RAG, agents, ML, and system design — with notes and an AI tutor.' },
  { icon: <Users size={17} />, title: 'Community', description: 'Discuss, share builds, and learn alongside other AI engineers on the same path.' },
  { icon: <BookMarked size={17} />, title: 'Blog, Notes & Resources', description: 'Curated links, quick notes, and deep-dive posts — everything in one workspace.' },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage({ onEnter }) {
  const shellRef = useRef(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try { return (localStorage.getItem(THEME_KEY) || 'dark') === 'dark'; } catch { return true; }
  });

  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); } catch {}
  }, [isDark]);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const onScroll = () => {
      setNavScrolled(el.scrollTop > 24);
      setShowTop(el.scrollTop > 600);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToModes = () => {
    shellRef.current?.querySelector('.ga-mode-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className={`ga-landing ${isDark ? 'dark' : 'light'}`} ref={shellRef}>
      <div className="ga-grid-overlay" aria-hidden="true" />
      <div className="ga-mesh-bg" aria-hidden="true">
        <span className="ga-orb ga-orb-a" />
        <span className="ga-orb ga-orb-b" />
      </div>

      {/* Glass nav */}
      <nav className={`ga-nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="ga-brand">
          <span className="ga-brand-mark"><BrainCircuit size={17} /></span>
          <span className="ga-brand-name">GenAI Academy</span>
          <small>v2.0</small>
        </div>
        <div className="ga-nav-actions">
          <button type="button" className="ga-nav-link" onClick={scrollToModes}>Explore</button>
          <button
            type="button"
            className={`ga-theme-toggle ${!isDark ? 'show-moon' : ''}`}
            onClick={() => setIsDark(d => !d)}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ga-sunmoon">
              <mask id="ga-moon-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <circle cx={!isDark ? 6 : -10} cy={!isDark ? 18 : 34} r="7" fill="black" />
              </mask>
              <circle cx="12" cy="12" r="5" mask="url(#ga-moon-mask)" fill="currentColor" />
              <g className="ga-sun-rays" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </g>
            </svg>
          </button>
          <button type="button" className="ga-mini-launch" onClick={onEnter}><span>Enter Academy</span></button>
        </div>
      </nav>

      {/* Hero */}
      <section className="ga-hero">
        <div className="ga-hero-copy">
          <div className="ga-eyebrow">
            <span className="ga-eyebrow-dot" /> Think like an Architect &amp; Build like an Engineer
          </div>
          <h1>
            <span className="ga-h1-pre">An interactive platform to</span><br />
            Learn, Build,<br />Simulate and Deploy<br />
            <span className="ga-h1-accent">AI Systems</span>
          </h1>
          <p>
            GenAI Academy pairs guided tracks in Gen AI, Agentic AI, and Data Science with a
            cloud IDE, an AI pair-programmer, live architecture simulators, and interview prep
            that actually runs your code. Every concept has a lab. Every lab runs.
          </p>
          <div className="ga-hero-actions">
            <button type="button" className="ga-cta primary" onClick={onEnter}>
              <span>Enter Academy</span>
              <ArrowRight size={16} />
            </button>
            <button type="button" className="ga-cta ghost" onClick={scrollToModes}>
              <span>See what's inside</span>
            </button>
          </div>
        </div>

        <PipelineCanvas />
      </section>

      {/* Mode cards */}
      <section className="ga-mode-section">
        <div className="ga-section-heading centered">
          <span className="ga-kicker">One Academy — Every Path</span>
          <h2>Built for learners &amp; sharpened for engineers</h2>
          <p>
            Pick up the fundamentals through guided tracks, build real projects in the cloud IDE,
            or drill interviews with an AI that pushes back. Same platform, whichever path you're on.
          </p>
        </div>

        <div className="ga-mode-grid">
          {MODES.map(mode => (
            <article key={mode.id} className={`ga-mode-card ${mode.id}`}>
              <div className="ga-mode-top">
                <span className="ga-mode-badge">{mode.badge}</span>
                <span className="ga-mode-icon">{mode.icon}</span>
              </div>
              <div className="ga-mode-visual" aria-hidden="true">
                <span className="ga-mini-node n1" />
                <span className="ga-mini-node n2" />
                <span className="ga-mini-node n3" />
                <span className="ga-mini-line l1" />
                <span className="ga-mini-line l2" />
                <span className="ga-mini-packet p1" />
                <span className="ga-mini-packet p2" />
              </div>
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>
              <ul>
                {mode.features.map(f => (
                  <li key={f}><Check size={12} />{f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="ga-mode-microcopy">Start simple. Scale infinitely.</p>
      </section>

      {/* Trust strip */}
      <section className="ga-trust-strip" aria-label="Platform highlights">
        {TRUST_PILLS.map(pill => <span key={pill}>{pill}</span>)}
      </section>

      {/* Feature grid */}
      <section className="ga-feature-section">
        <div className="ga-section-heading">
          <span className="ga-kicker">Know your Arsenal</span>
          <h2>
            Everything inside<br /><span className="ga-brand-header">GenAI Academy</span>
          </h2>
        </div>
        <div className="ga-feature-grid">
          {FEATURES.map(f => (
            <article key={f.title} className="ga-feature-card">
              <div className="ga-feature-icon">{f.icon}</div>
              <div className="ga-feature-title">
                <h3>{f.title}</h3>
                {f.badge && <small>{f.badge}</small>}
              </div>
              <p>{f.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="ga-final-cta">
        <Sparkles size={20} className="ga-final-spark" />
        <h2>Your journey from developer to AI Architect starts here.</h2>
        <button type="button" className="ga-cta primary big" onClick={onEnter}>
          <span>Enter Academy</span>
          <ArrowRight size={17} />
        </button>
      </section>

      {showTop && (
        <button className="ga-back-to-top" aria-label="Back to top"
          onClick={() => shellRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ChevronUp size={16} />
        </button>
      )}
    </main>
  );
}
