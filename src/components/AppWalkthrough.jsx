import React, { useState, useCallback, useMemo, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Globe, BookOpen, Layers, Users, Terminal, Boxes,
  Clapperboard, Box, GitCommit, Network, Share2, CircleDashed,
  BookMarked, Bookmark, GitBranch, CheckSquare, GraduationCap,
  LayoutDashboard, ChevronRight, ChevronLeft, Rocket, Orbit,
  Monitor, Zap, Code, Play, Pause, Save, Maximize, Settings,
  Eye, Download, FileText, Video, List, Columns3, MousePointer,
  ZoomIn, Move, Focus, Filter, Search, ExternalLink, ArrowRight,
  Activity, PenTool, Sliders, BarChart, Clock, Target, Server,
  Package, History, Calendar, FolderOpen, Trash, MessageSquare,
  Brain, HelpCircle, Mic, Send, Map, CheckCircle2, Navigation,
  Palette, Gamepad2, Trophy, TreeDeciduous, Workflow, GitMerge
} from 'lucide-react';
import '../styles/AppWalkthrough.css';

// Icon lookup map
const ICON_MAP = {
  Sparkles, Globe, BookOpen, Layers, Users, Terminal, Boxes,
  Clapperboard, Box, GitCommit, Network, Share2, CircleDashed,
  BookMarked, Bookmark, GitBranch, CheckSquare, GraduationCap,
  LayoutDashboard, ChevronRight, ChevronLeft, Rocket, Orbit,
  Monitor, Zap, Code, Play, Pause, Save, Maximize, Settings,
  Eye, Download, FileText, Video, List, Columns3, MousePointer,
  ZoomIn, Move, Focus, Filter, Search, ExternalLink, ArrowRight,
  Activity, PenTool, Sliders, BarChart, Clock, Target, Server,
  Package, History, Calendar, FolderOpen, Trash, MessageSquare,
  Brain, HelpCircle, Mic, Send, Map, CheckCircle2, Navigation,
  Palette, Gamepad2, Trophy, TreeDeciduous, Workflow, GitMerge
};

const getIcon = (name) => ICON_MAP[name] || Sparkles;

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
  },
  exit: (direction) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  })
};

/**
 * AppWalkthrough
 * 
 * Three modes:
 * 1. mode="main"     — Full overview walkthrough (centered modal)
 * 2. mode="section"  — Section-specific walkthrough (smaller modal)
 * 3. mode="floating" — Floating card pointing to a specific element
 * 
 * Props:
 * - steps: array of step objects
 * - mode: "main" | "section" | "floating"
 * - sectionTitle: string (only for section/floating mode)
 * - sectionColor: string (only for section/floating mode)
 * - onComplete: () => void
 */
export default function AppWalkthrough({ steps, mode = 'main', sectionTitle, sectionColor, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [coords, setCoords] = useState({ top: 0, left: 0, arrow: 'left' });
  const cardRef = useRef(null);

  const totalSteps = steps.length;
  const step = steps[currentStep];

  const isSection = mode === 'section';
  const isFloating = mode === 'floating';

  // Resolve icon from string name
  const IconComponent = useMemo(() => getIcon(step.icon), [step.icon]);
  const stepColor = isSection || isFloating ? (sectionColor || step.color || '#00ff88') : (step.color || '#00ff88');

  // Positioning logic for floating mode
  useLayoutEffect(() => {
    if (!isFloating || !step.target) return;

    const updatePosition = () => {
      const targetEl = document.querySelector(step.target);
      if (!targetEl) {
        // Fallback to center if target not found
        setCoords({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', arrow: 'none' });
        return;
      }

      const rect = targetEl.getBoundingClientRect();
      const padding = 24;

      // Default: position to the right of the sidebar item
      let top = rect.top + rect.height / 2;
      let left = rect.right + padding;
      let arrow = 'left';

      // Ensure it stays within viewport
      const cardHeight = cardRef.current?.offsetHeight || 280;
      const cardWidth = cardRef.current?.offsetWidth || 380;

      // Vertical clamping
      if (top + cardHeight / 2 > window.innerHeight - 20) {
        top = window.innerHeight - cardHeight / 2 - 20;
      }
      if (top - cardHeight / 2 < 20) {
        top = cardHeight / 2 + 20;
      }

      // Horizontal flip if it goes off screen
      if (left + cardWidth > window.innerWidth - 20) {
        left = rect.left - cardWidth - padding;
        arrow = 'right';
      }

      setCoords({ top, left, arrow });
    };

    updatePosition();
    // Use a small delay to ensure DOM is ready and animations finished
    const timer = setTimeout(updatePosition, 50);

    // Add highlight class to target
    const targetEl = document.querySelector(step.target);
    if (targetEl) targetEl.classList.add('walkthrough-highlight');

    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      if (targetEl) targetEl.classList.remove('walkthrough-highlight');
      clearTimeout(timer);
    };
  }, [isFloating, step.target, currentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  }, [currentStep, totalSteps, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleDotClick = useCallback((idx) => {
    setDirection(idx > currentStep ? 1 : -1);
    setCurrentStep(idx);
  }, [currentStep]);

  return (
    <motion.div
      className={`walkthrough-backdrop ${isSection ? 'walkthrough-section-mode' : ''} ${isFloating ? 'walkthrough-floating-mode' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        ref={cardRef}
        className={`walkthrough-card ${isSection ? 'walkthrough-card-section' : ''} ${isFloating ? 'walkthrough-card-floating' : ''}`}
        initial={isFloating ? { opacity: 0, scale: 0.95 } : { scale: 0.9, y: 30, opacity: 0 }}
        animate={isFloating ? {
          opacity: 1,
          scale: 1,
          top: coords.top,
          left: coords.left,
          y: '-50%'
        } : { scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{
          '--step-color': stepColor,
          ...(isFloating ? { position: 'fixed', margin: 0, zIndex: 100000 } : {})
        }}
      >
        {isFloating && coords.arrow !== 'none' && (
          <div className={`walkthrough-arrow walkthrough-arrow-${coords.arrow}`} />
        )}

        {/* Header */}
        <div className="walkthrough-header">
          {(isSection || isFloating) ? (
            <span className="walkthrough-step-label" style={{ color: stepColor }}>
              {sectionTitle ? `📖 ${sectionTitle}` : 'GUIDE'}
              {totalSteps > 1 && ` — STEP ${currentStep + 1} / ${totalSteps}`}
            </span>
          ) : (
            <span className="walkthrough-step-label">
              STEP {currentStep + 1} / {totalSteps}
            </span>
          )}
          <button className="walkthrough-skip-btn" onClick={handleSkip}>
            {(isSection || isFloating) ? 'GOT IT' : 'SKIP TOUR'}
          </button>
        </div>

        {/* Body with AnimatePresence for slide transitions */}
        <div className="walkthrough-body">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="walkthrough-step-content"
            >
              {/* Decorative glows */}
              {step.isWelcome && <div className="walkthrough-welcome-glow" />}
              {step.isFinal && <div className="walkthrough-final-glow" />}

              {/* Icon */}
              <div
                className="walkthrough-icon-ring"
                style={{
                  background: `radial-gradient(circle, ${stepColor}15 0%, transparent 70%)`
                }}
              >
                <IconComponent size={(isSection || isFloating) ? 30 : 36} />
              </div>

              {/* Title */}
              <h2 className={`walkthrough-title ${(isSection || isFloating) ? 'walkthrough-title-sm' : ''}`}>
                {step.title[0]}<span>{step.title[1]}</span>
              </h2>

              {/* Description */}
              <p className="walkthrough-subtitle">{step.subtitle}</p>

              {/* Feature chips */}
              {step.features && step.features.length > 0 && (
                <div className="walkthrough-features">
                  {step.features.map((feat, i) => {
                    const FeatIcon = getIcon(feat.icon);
                    return (
                      <motion.div
                        key={i}
                        className="walkthrough-chip"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: 0.15 + i * 0.04 }
                        }}
                      >
                        <FeatIcon size={14} />
                        <span>{feat.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="walkthrough-footer">
          {/* Dots */}
          {totalSteps > 1 && (
            <div className="walkthrough-dots">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`walkthrough-dot ${i === currentStep ? 'active' : ''}`}
                  style={i === currentStep ? { background: stepColor, boxShadow: `0 0 10px ${stepColor}` } : {}}
                  onClick={() => handleDotClick(i)}
                />
              ))}
            </div>
          )}
          {totalSteps <= 1 && <div />}

          {/* Buttons */}
          <div className="walkthrough-nav">
            {currentStep > 0 && (
              <button className="walkthrough-btn walkthrough-btn-prev" onClick={handlePrev}>
                <ChevronLeft size={14} />
                Prev
              </button>
            )}
            {currentStep < totalSteps - 1 ? (
              <button
                className="walkthrough-btn walkthrough-btn-next"
                style={{ background: stepColor }}
                onClick={handleNext}
              >
                Next
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                className={`walkthrough-btn ${(isSection || isFloating) ? 'walkthrough-btn-next' : 'walkthrough-btn-finish'}`}
                style={(isSection || isFloating) ? { background: stepColor } : undefined}
                onClick={handleNext}
              >
                {(isSection || isFloating) ? (
                  <>
                    <CheckCircle2 size={14} />
                    Done
                  </>
                ) : (
                  <>
                    <Rocket size={14} />
                    Start
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
