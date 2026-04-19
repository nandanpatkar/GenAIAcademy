import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles, Brain, Cpu, Globe, Map, FlaskConical, BookOpen, Layers, Search, Database, Server, Zap, ArrowRight, MousePointer2 } from 'lucide-react';
import './LandingPage.css';

const DESCRIPTIONS = [
  "From Prompt Engineering to Autonomous Agents.",
  "Interactive Labs for the Modern AI Engineer.",
  "Blueprints to build the future of intelligence.",
  "Zero to Hero in Generative AI Architecture."
];

// Interactive neural visual component
const NeuralArchitecture = () => {
  return (
    <div className="neural-architecture-viz">
      <svg viewBox="0 0 400 400" className="neural-svg">
        {[
          "M 50 150 L 150 100", "M 50 200 L 150 200", "M 50 250 L 150 300",
          "M 150 100 L 250 150", "M 150 200 L 250 200", "M 150 300 L 250 250",
          "M 250 150 L 350 200", "M 250 200 L 350 200", "M 250 250 L 350 200"
        ].map((path, i) => (
          <motion.path
            key={i}
            d={path}
            stroke="rgba(0, 255, 136, 0.4)"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 1], 
              opacity: [0, 1, 0],
              strokeDashoffset: [0, -40]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}

        {[
          { x: 50, y: 150 }, { x: 50, y: 200 }, { x: 50, y: 250 },
          { x: 150, y: 100 }, { x: 150, y: 200 }, { x: 150, y: 300 },
          { x: 250, y: 150 }, { x: 250, y: 200 }, { x: 250, y: 250 },
          { x: 350, y: 200 }
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x}
            cy={node.y}
            r="4.5"
            fill={i === 9 ? "#00ff88" : "#3b82f6"}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
            filter={`drop-shadow(0 0 8px ${i === 9 ? "#00ff88" : "#3b82f6"})`}
          />
        ))}

        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="200" cy="200" r="45" fill="transparent" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" strokeDasharray="4 4" />
          <defs>
            <radialGradient id="coreGlow">
              <stop offset="0%" stopColor="rgba(0, 255, 136, 0.5)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <motion.circle 
            cx="200" cy="200" r="30" 
            fill="url(#coreGlow)"
            animate={{ r: [25, 35, 25], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </motion.g>
      </svg>
      <div className="core-label">SYSTEM_CORE//ACTIVE</div>
    </div>
  );
};

export default function LandingPage({ onEnter }) {
  const [descIndex, setDescIndex] = useState(0);
  const containerRef = useRef(null);
  const { scrollY } = useScroll({ container: containerRef });
  
  // Refined scroll behavior for a 2-page flow
  // We assume the total scrollable height is approx 200% of viewport
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.9]);
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);

  // Mission page becomes visible earlier and stays prominent
  const missionOpacity = useTransform(scrollY, [300, 800], [0, 1]);
  const missionScale = useTransform(scrollY, [300, 800], [0.85, 1]);
  const missionY = useTransform(scrollY, [300, 800], [100, 0]);

  // Background visual aesthetics
  const glowColor = useTransform(
    scrollY,
    [0, 800],
    ["rgba(0, 255, 136, 0.1)", "rgba(59, 130, 246, 0.15)"]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDescIndex((prev) => (prev + 1) % DESCRIPTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page apple-style" ref={containerRef}>
      {/* Cinematic Background Technical Art */}
      <div className="hero-visual-container">
        <motion.div 
          className="ambient-glow" 
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }} 
        />
        <div className="vignette-overlay" />
        
        <div className="tech-art-layer">
          {[...Array(6)].map((_, i) => (
            <motion.div 
              key={i}
              className="floating-tech-element"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.03, 0.08, 0.03],
                y: [0, -120, 0],
                rotate: [0, 90, 0]
              }}
              transition={{ 
                duration: 25 + i * 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{
                left: `${10 + i * 18}%`,
                top: `${15 + (i % 3) * 25}%`
              }}
            >
              {i % 2 === 0 ? "0x" + (i * 255).toString(16) : "ARCH_LOG_0" + i}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grain-overlay" />

      <div className="scroll-container">
        {/* Section 1: Hero */}
        <section className="scroll-section hero-section">
          <motion.div 
            className="hero-content"
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="apple-title">
              <span className="title-top">MASTER THE</span>
              <span className="title-main generative-text">GENERATIVE</span>
              <span className="title-bottom">FRONTIER</span>
            </h1>

            <div className="dynamic-description-wrapper">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={descIndex}
                  className="apple-description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.8 }}
                >
                  {DESCRIPTIONS[descIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            
            <motion.div 
              className="scroll-indicator"
              animate={{ opacity: [0.2, 0.6, 0.2], y: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="mouse-wheel" />
              <span>Explore Content</span>
            </motion.div>
          </motion.div>
        </section>

        {/* Section 2: Mission Section - The Final Destination */}
        <section className="scroll-section mission-section">
          <motion.div 
            className="mission-grid"
            style={{ opacity: missionOpacity, scale: missionScale, y: missionY }}
          >
            {/* Left Col: The Message */}
            <div className="mission-content-glass">
              <h2 className="mission-title">
                <span className="mission-accent">INTELLIGENCE</span>
                <span className="mission-main">BEYOND CODE</span>
              </h2>
              <div className="mission-body">
                <p>
                  GenAI Academy is a dedicated engine for those who refuse to be left behind by the LLM revolution. 
                  We provide the <strong>interactive labs</strong>, <strong>autonomous agent blueprints</strong>, 
                  and <strong>architecture simulators</strong> required to build true intelligence.
                </p>
                <p className="mission-highlight">
                  Your journey from developer to AI Architect starts here.
                </p>
              </div>

              <motion.button 
                className="apple-cta primary-action stunning-btn"
                onClick={onEnter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Enter Academy <ChevronRight size={20} />
              </motion.button>
            </div>

            {/* Right Col: The Interactive Visual */}
            <div className="mission-visual-wrapper">
              <NeuralArchitecture />
              {/* Ultra-High-Fidelity Signal Trails */}
              <div className="signal-trails">
                {[...Array(6)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="signal-trail"
                    animate={{ x: ["-100%", "300%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 5 + i, repeat: Infinity, ease: "linear", delay: i * 0.8 }}
                    style={{ top: `${15 * i}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      <div className="landing-grid-overlay minimalist" />
    </div>
  );
}
