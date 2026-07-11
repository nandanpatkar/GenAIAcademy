/**
 * LandingPage.jsx — GenAI Academy landing
 *
 * Design language mirrors the AWS System Design Simulator landing:
 * mesh-orb background, glass nav, hero with a Mac browser-chrome mockup
 * running a live animated pipeline, mode cards with mini visuals,
 * a trust strip, and a feature ("arsenal") grid mapped to the app's
 * sidebar sections.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, Sparkles, Terminal, Boxes, Layers, Orbit, GraduationCap,
  Clapperboard, Box, GitCommit, Network, Users, BookMarked, Bot,
  BrainCircuit, Check, ChevronUp, Cpu, Share2,
} from 'lucide-react';
import './LandingPage.css';

// ── Animated pipeline inside the browser mockup ─────────────────────────────
function PipelineCanvas() {
  return (
    <div className="ga-sim-wrapper">
      <div className="ga-browser-chrome">
        <div className="ga-titlebar">
          <div className="ga-traffic-lights">
            <span className="ga-tl red" />
            <span className="ga-tl yellow" />
            <span className="ga-tl green" />
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

          <svg className="ga-sim-svg" viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="ga-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="ga-user-llm" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#00ff88" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="ga-llm-tools" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="ga-llm-rag" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="ga-llm-mem" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#f472b6" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Conduits */}
            <path id="ga-p1" d="M 205 330 C 300 330 340 250 415 245" className="ga-conduit" stroke="url(#ga-user-llm)" />
            <path id="ga-p2" d="M 585 225 C 670 200 700 165 775 155" className="ga-conduit" stroke="url(#ga-llm-tools)" />
            <path id="ga-p3" d="M 585 265 C 670 300 700 380 775 400" className="ga-conduit" stroke="url(#ga-llm-rag)" />
            <path id="ga-p4" d="M 500 300 C 500 360 500 420 500 465" className="ga-conduit" stroke="url(#ga-llm-mem)" />

            {/* Packets */}
            <circle r="5" className="ga-packet" fill="#38bdf8" filter="url(#ga-glow)">
              <animateMotion dur="3.2s" repeatCount="indefinite"><mpath href="#ga-p1" /></animateMotion>
            </circle>
            <circle r="4.5" className="ga-packet" fill="#fbbf24" filter="url(#ga-glow)">
              <animateMotion dur="2.6s" begin="0.8s" repeatCount="indefinite"><mpath href="#ga-p2" /></animateMotion>
            </circle>
            <circle r="4.5" className="ga-packet" fill="#a78bfa" filter="url(#ga-glow)">
              <animateMotion dur="2.9s" begin="0.4s" repeatCount="indefinite"><mpath href="#ga-p3" /></animateMotion>
            </circle>
            <circle r="4" className="ga-packet" fill="#f472b6" filter="url(#ga-glow)">
              <animateMotion dur="3.6s" begin="1.4s" repeatCount="indefinite"><mpath href="#ga-p4" /></animateMotion>
            </circle>
            <circle r="4" className="ga-packet" fill="#00ff88" filter="url(#ga-glow)">
              <animateMotion dur="3.1s" begin="1.9s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                <mpath href="#ga-p3" />
              </animateMotion>
            </circle>

            {/* Nodes */}
            <g className="ga-node" transform="translate(130,300)">
              <rect width="75" height="60" rx="12" className="ga-node-box user" />
              <text x="37" y="26" textAnchor="middle" className="ga-node-icon">👤</text>
              <text x="37" y="47" textAnchor="middle" className="ga-node-label">USER</text>
            </g>

            <g className="ga-node core" transform="translate(415,185)">
              <rect width="170" height="115" rx="16" className="ga-node-box core" filter="url(#ga-glow)" />
              <text x="85" y="42" textAnchor="middle" className="ga-node-icon big">🧠</text>
              <text x="85" y="72" textAnchor="middle" className="ga-node-label core">AGENT CORE</text>
              <text x="85" y="94" textAnchor="middle" className="ga-node-sub">LLM · Reasoning · Orchestration</text>
            </g>

            <g className="ga-node" transform="translate(775,120)">
              <rect width="105" height="66" rx="12" className="ga-node-box tools" />
              <text x="52" y="28" textAnchor="middle" className="ga-node-icon">🛠️</text>
              <text x="52" y="50" textAnchor="middle" className="ga-node-label">TOOLS / APIs</text>
            </g>

            <g className="ga-node" transform="translate(775,368)">
              <rect width="105" height="66" rx="12" className="ga-node-box rag" />
              <text x="52" y="28" textAnchor="middle" className="ga-node-icon">📚</text>
              <text x="52" y="50" textAnchor="middle" className="ga-node-label">VECTOR DB</text>
            </g>

            <g className="ga-node" transform="translate(438,465)">
              <rect width="124" height="62" rx="12" className="ga-node-box mem" />
              <text x="62" y="26" textAnchor="middle" className="ga-node-icon">💾</text>
              <text x="62" y="48" textAnchor="middle" className="ga-node-label">MEMORY</text>
            </g>
          </svg>

          {/* HUD metric chips */}
          <div className="ga-metric-chip chip-a"><span className="ga-chip-dot" /> RAG HIT · 98%</div>
          <div className="ga-metric-chip chip-b"><span className="ga-chip-dot amber" /> TOOL CALL · 122ms</div>
          <div className="ga-metric-chip chip-c"><span className="ga-chip-dot pink" /> TOKENS/s · 512</div>
        </div>
      </div>
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const MODES = [
  {
    id: 'learn',
    badge: 'LEARN',
    icon: <Orbit size={18} />,
    title: 'Guided Learning Tracks',
    description: 'Three structured roadmaps — Gen AI, Agentic AI, and Data Science — visualized as an explorable knowledge galaxy with progress tracking.',
    features: ['Knowledge Galaxy & Study Map', 'Gen AI · Agentic AI · Data Science', 'Curated videos, papers & docs', 'Progress tracking per topic'],
    button: 'Start Learning',
    visual: 'learn',
  },
  {
    id: 'build',
    badge: 'BUILD',
    icon: <Terminal size={18} />,
    title: 'Cloud IDE + AI Assistant',
    description: 'A full in-browser IDE with an AI pair-programmer that writes code straight into your project — run it instantly, sync to GitHub.',
    features: ['Monaco editor · split view · themes', 'AI generates, edits & diffs code', 'Run Python, JS, Java, C++, Go', 'GitHub import, commit & versions'],
    button: 'Open the IDE',
    visual: 'build',
  },
  {
    id: 'prepare',
    badge: 'PREPARE',
    icon: <GraduationCap size={18} />,
    title: 'Interview-Ready Practice',
    description: '22 interview courses, an AI interviewer that grills you in real time, adaptive quizzes, and a DSA practice IDE with live execution.',
    features: ['22 structured interview courses', 'AI Interviewer with feedback', 'DSA Animator & Algo Studio', 'Quizzes & spaced practice'],
    button: 'Start Prepping',
    visual: 'prepare',
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
    <main className="ga-landing" ref={shellRef}>
      {/* Ambient mesh orbs */}
      <div className="ga-mesh-bg" aria-hidden="true">
        <span className="ga-orb ga-orb-a" />
        <span className="ga-orb ga-orb-b" />
        <span className="ga-orb ga-orb-c" />
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
              <div className={`ga-mode-visual ${mode.visual}`} aria-hidden="true">
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
              <button type="button" className="ga-mode-button" onClick={onEnter}>
                <span>{mode.button}</span>
                <ArrowRight size={14} />
              </button>
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
