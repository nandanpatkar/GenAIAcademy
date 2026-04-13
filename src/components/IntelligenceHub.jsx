import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Layers, Users, Sparkles, X, 
  ChevronRight, Boxes, Layout, Globe, Activity, Zap, Search
} from 'lucide-react';
import { CHRONOLOGICAL_DB } from '../data/blogData';
import { ALGO_EXAMPLES } from '../data/algoExamples';

const FlickeringGrid = ({ 
  squareSize = 4, 
  gridGap = 6, 
  flickerChance = 0.3, 
  color = "#00ff88", 
  maxOpacity = 0.3,
  className = "" 
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let memoizedSquares = [];

    const setup = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      const cols = Math.floor(width / (squareSize + gridGap));
      const rows = Math.floor(height / (squareSize + gridGap));

      memoizedSquares = [];
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          memoizedSquares.push({
            x: i * (squareSize + gridGap),
            y: j * (squareSize + gridGap),
            opacity: Math.random() * maxOpacity
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      memoizedSquares.forEach(sq => {
        if (Math.random() < flickerChance) {
          sq.opacity = Math.random() * maxOpacity;
        }
        ctx.fillStyle = color;
        ctx.globalAlpha = sq.opacity;
        ctx.fillRect(sq.x, sq.y, squareSize, squareSize);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    setup();
    draw();

    const handleResize = () => { setup(); };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [squareSize, gridGap, flickerChance, color, maxOpacity]);

  return (
    <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', background: '#020202' }} className={className}>
      <canvas ref={canvasRef} />
    </div>
  );
};

const RESEARCH_BLOGS = [
  { id: 'agents-vs-apps', title: 'AI Agents vs Apps', description: 'Exploring the paradigm shift in software architecture.', category: 'Agents', url: 'https://www.analyticsvidhya.com/blog/2025/04/ai-agents-vs-apps/', icon: <Sparkles size={20} /> },
  { id: 'llm-vs-agents', title: 'LLM vs Agents', description: 'Foundational differences in autonomy and reasoning.', category: 'Foundations', url: 'https://www.analyticsvidhya.com/articles/llm-vs-agents/', icon: <Activity size={20} /> },
  { id: 'deepseek-vs-llama', title: 'DeepSeek v3 vs Llama 4', description: 'The battle for open-source model supremacy.', category: 'Models', url: 'https://www.analyticsvidhya.com/blog/2025/04/deepseek-v3-vs-llama-4/', icon: <Layers size={20} /> },
  { id: 'agentic-rag', title: 'Agentic RAG', description: 'Advanced retrieval augmented generation with GPT-4.', category: 'Agents', url: 'https://www.analyticsvidhya.com/blog/2025/04/agentic-rag-using-gpt-4-1/', icon: <Globe size={20} /> },
  { id: 'mcp-cursor', title: 'MCP with Cursor AI', description: 'Integrating Model Context Protocol in IDEs.', category: 'Tech', url: 'https://www.analyticsvidhya.com/blog/2025/04/mcp-with-cursor-ai/', icon: <Layout size={20} /> },
  { id: 'deep-research', title: 'Deep Research Agent', description: 'Building autonomous agents for technical research.', category: 'Agents', url: 'https://www.analyticsvidhya.com/blog/2025/02/build-your-own-deep-research-agent/', icon: <Boxes size={20} /> },
  { id: 'slm-vs-llm', title: 'SLMs vs LLMs', description: 'Why small language models are winning in production.', category: 'Models', url: 'https://www.analyticsvidhya.com/blog/2024/11/slms-vs-llms/', icon: <Zap size={20} /> },
  { id: 'prompt-engineering', title: 'Prompt Library', description: 'Curated prompt engineering frameworks and books.', category: 'Prompting', url: 'https://www.analyticsvidhya.com/blog/2024/04/top-best-prompt-engineering-books/', icon: <BookOpen size={20} /> },
  { id: 'production-ai', title: 'Production AI Systems', description: 'Architecting reliable intelligence for millions.', category: 'Tech', url: 'https://www.analyticsvidhya.com/blog/2023/09/production-systems-in-ai/', icon: <Globe size={20} /> },
  { id: 'ml-learning-path', title: 'ML Masterclass', description: 'End-to-end roadmap to becoming a Data Scientist.', category: 'Roadmap', url: 'https://www.analyticsvidhya.com/blog/2020/12/a-comprehensive-learning-path-to-become-a-data-scientist/', icon: <Users size={20} /> },
  { id: 'vector-db', title: 'Vector DB Deepdive', description: 'Mastering ChromaDB for semantic search systems.', category: 'Data', url: 'https://www.analyticsvidhya.com/blog/2023/07/guide-to-chroma-db-a-vector-store-for-your-generative-ai-llms/', icon: <Layers size={20} /> },
  { id: 'knowledge-graphs', title: 'Knowledge Graphs', description: 'Theory and application of connected intelligence.', category: 'Data', url: 'https://www.analyticsvidhya.com/blog/2023/01/knowledge-graphs-deep-dive-into-its-theories-and-applications/', icon: <Globe size={20} /> }
];

export default function IntelligenceHub({ 
  paths, 
  onStudyAction, 
  onDesignAction, 
  onInterview, 
  onShowAll,
  initialView = 'main',
  initialYear = null,
  initialAI = false
}) {
  const [view, setView] = useState(initialView); // 'main' | 'design' | 'study' | 'curricula' | 'roadmap' | 'blog'
  const [blogYear, setBlogYear] = useState(initialYear);
  const [blogSearch, setBlogSearch] = useState('');
  const [blogLimit, setBlogLimit] = useState(100);
  const [showAI, setShowAI] = useState(initialAI);
  const [aiQuery, setAiQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Sync with external navigation (e.g. Sidebar clicks)
  useEffect(() => {
    if (initialView) setView(initialView);
    if (initialYear !== undefined) setBlogYear(initialYear);
    if (initialAI !== undefined) setShowAI(initialAI);
    // Reset limit on external jump
    setBlogLimit(100);
  }, [initialView, initialYear, initialAI]);

  const flatBlueprints = useMemo(() => {
    return Object.entries(CHRONOLOGICAL_DB).flatMap(([year, articles]) => 
      articles.map(article => ({ ...article, year }))
    );
  }, []);

  const mainCards = [
    {
      id: 'roadmap',
      title: 'Map',
      icon: <Globe className="hub-icon" size={32} />,
      description: 'Global intelligence topology.',
      color: '#00ccff',
      action: () => setView('roadmap')
    },
    {
      id: 'study',
      title: 'Study',
      icon: <BookOpen className="hub-icon" size={32} />,
      description: 'AI roadmap & concepts.',
      color: '#00ff88',
      action: () => setView('study')
    },
    {
      id: 'design',
      title: 'Design',
      icon: <Layers className="hub-icon" size={32} />,
      description: 'Architect complex systems.',
      color: '#60a5fa',
      action: () => setView('design')
    },
    {
      id: 'interview',
      title: 'Interview',
      icon: <Users className="hub-icon" size={32} />,
      description: 'Elite training sessions.',
      color: '#fbbf24',
      action: onInterview
    }
  ];

  const roadmapCards = [
    {
      id: 'galaxy',
      title: 'Roadmap Galaxy',
      icon: <Globe size={24} />,
      description: 'Immersive 3D knowledge network visualization.',
      action: () => onStudyAction('galaxy'),
      accent: '#00ccff'
    },
    {
      id: 'knowledge_tree',
      title: 'Knowledge Tree',
      icon: <Layers size={24} />,
      description: 'High-level hierarchical curriculum overview.',
      action: () => onStudyAction('knowledge_tree'),
      accent: '#00ccff'
    }
  ];

  const studyCards = [
    {
      id: 'curricula',
      title: 'Curriculum Hub',
      icon: <BookOpen size={20} />,
      description: 'Specialized learning paths for all AI disciplines.',
      action: () => setView('curricula'),
      accent: '#00ff88'
    },
    {
      id: 'algo_studio',
      title: 'Algo Studio',
      icon: <Activity size={20} />,
      description: 'Advanced algorithm visualization and lab.',
      action: () => onStudyAction('algo_studio'),
      accent: '#a855f7'
    },
    {
      id: 'aiml_companion',
      title: 'AIML Companion',
      icon: <Boxes size={20} />,
      description: 'Interactive AI pairing and research node.',
      action: () => onStudyAction('aiml_companion'),
      accent: '#ec4899'
    },
    {
      id: 'blog',
      title: 'Research Blog',
      icon: <Layout size={20} />,
      description: 'Latest deep-dives from Research Repository.',
      action: () => setView('blog'),
      accent: '#3b82f6'
    },
    {
      id: 'ide',
      title: 'Python IDE',
      icon: <Layout size={20} />,
      description: 'Embedded code sandbox and testing lab.',
      action: () => onStudyAction('ide'),
      accent: '#60a5fa'
    },
    {
      id: 'dsa_animator',
      title: 'DSA Animator',
      icon: <Activity size={20} />,
      description: 'Interactive Data Structures & Algos visualizer.',
      action: () => onStudyAction('dsa_animator'),
      accent: '#f59e0b'
    },
    {
      id: 'progress',
      title: 'Skill Progress',
      icon: <Activity size={20} />,
      description: 'Track your expertise across the ecosystem.',
      action: () => onStudyAction('progress'),
      accent: '#00ff88'
    }
  ];

  const curriculaCards = Object.entries(paths || {}).map(([id, path]) => ({
    id,
    title: path.label || id,
    description: path.description || `Master ${path.label}`,
    icon: <BookOpen size={20} />,
    color: path.color || '#00ff88',
    action: () => onStudyAction(id, 'path')
  }));

  const designCards = [
    {
      id: 'playground',
      title: 'Lab Playground',
      icon: <Boxes size={24} />,
      description: 'Open sandbox for rapid prototyping.',
      action: () => onDesignAction('playground')
    },
    {
      id: 'simulator',
      title: 'System Simulator',
      icon: <Layout size={24} />,
      description: 'Interactive high-fidelity simulation.',
      action: () => onDesignAction('simulator')
    },
    {
      id: 'architecture',
      title: 'Arch Design',
      icon: <Globe size={24} />,
      description: 'Next-gen architecture blueprints.',
      action: () => onDesignAction('architecture')
    }
  ];

  const getSubMenuTitle = () => {
    if (view === 'roadmap') return 'Navigation Ecosystem';
    if (view === 'study') return 'Intelligence Pathways';
    if (view === 'design') return 'System Design Matrix';
    if (view === 'curricula') return 'Curriculum Selection';
    if (view === 'blog') return 'Research Repository';
    return '';
  };

  const getActiveCards = () => {
    if (view === 'roadmap') return roadmapCards;
    if (view === 'study') return studyCards;
    if (view === 'design') return designCards;
    if (view === 'curricula') return curriculaCards;
    return [];
  };

  const getBackAction = () => {
    if (view === 'curricula') return () => setView('study');
    if (view === 'blog') return () => { 
      if (showAI) setShowAI(false);
      else if (blogYear) {
        setBlogYear(null);
        setBlogLimit(100);
      } else setView('study');
    };
    return () => setView('main');
  };

  return (
    <div className="hub-overlay">
      <FlickeringGrid 
        className="opacity-40"
        color={view === 'main' ? "#00ff88" : view === 'design' ? "#60a5fa" : "#00ccff"}
      />
      
      {/* --- Header --- */}
      <div className="hub-header">
        <div className="hub-logo">
          <div className="hub-logo-dot" />
          <span>INTELLIGENCE_HUB</span>
        </div>
        <button className="show-all-btn" onClick={onShowAll}>
          <span>SHOW ALL SECTIONS</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="hub-container">
        <AnimatePresence mode="wait">
          {view === 'blog' ? (
            <motion.div 
              key="blog"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="hub-blog-container"
            >
              {showAI ? (
                <div className="hub-sub-layout ai-search-layout">
                  <div className="hub-sub-header">
                    <button className="hub-back-btn" onClick={() => setShowAI(false)}>
                      <X size={20} />
                      <span>EXIT PILOT</span>
                    </button>
                    <h2>Neural Research Pilot</h2>
                    <p className="sub-tagline">Global intelligence scan across 11,000+ blueprints.</p>
                  </div>

                  <div className="ai-search-entry">
                    <div className="ai-input-wrapper">
                      <Sparkles size={24} className="ai-glow-icon" />
                      <input 
                        type="text" 
                        placeholder="Query the global intelligence network..." 
                        value={aiQuery}
                        onChange={(e) => {
                          setAiQuery(e.target.value);
                          if (!isScanning && e.target.value.length > 2) {
                            setIsScanning(true);
                            setTimeout(() => setIsScanning(false), 800);
                          }
                        }}
                      />
                      {isScanning && <div className="scanning-pulse" />}
                    </div>
                  </div>

                  <div className="hub-scroll-area repo-area">
                    <div className="hub-sub-grid">
                      {aiQuery.length > 2 ? (
                        flatBlueprints
                          .filter(item => 
                            item.title.toLowerCase().includes(aiQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(aiQuery.toLowerCase())
                          )
                          .slice(0, 100)
                          .map((article, i) => (
                            <motion.div
                              key={article.url}
                              className="hub-sub-card article-node"
                              whileHover={{ scale: 1.02 }}
                              onClick={() => window.open(article.url, '_blank')}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0, transition: { delay: (i % 20) * 0.02 } }}
                            >
                              <div className="article-meta">
                                <span className="year-pill">{article.year}</span>
                                <Zap size={14} className="emerald-flicker" />
                              </div>
                              <h3>{article.title}</h3>
                              <p>{article.description}</p>
                              <div className="article-foot">
                                <span>OPEN RESEARCH</span>
                                <ChevronRight size={14} />
                              </div>
                            </motion.div>
                          ))
                      ) : (
                        <div className="ai-empty-state">
                          <p>Ready to scan global intelligence...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : !blogYear ? (
                <div className="hub-sub-layout">
                  <div className="hub-sub-header">
                    <button className="hub-back-btn" onClick={() => setView('study')}>
                      <X size={20} />
                      <span>BACK TO STUDY</span>
                    </button>
                    <h2>Research Chronology</h2>
                    <p className="sub-tagline">Select a year to explore the intelligence blueprints.</p>
                    
                    <motion.div 
                      className="hub-landing-search"
                      whileHover={{ scale: 1.01, borderColor: '#00ff88' }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setShowAI(true)}
                    >
                      <Sparkles size={18} className="search-sparkle" />
                      <span>Search 11,000+ blueprints across the global network...</span>
                    </motion.div>
                  </div>
                    <div className="hub-scroll-area">
                      <div className="hub-sub-grid">
                        {Object.keys(CHRONOLOGICAL_DB)
                        .sort((a, b) => {
                          if (a === 'Featured') return 1;
                          if (b === 'Featured') return -1;
                          return b.localeCompare(a);
                        })
                        .map((year, i) => (
                        <motion.div
                          key={year}
                          className="hub-sub-card year-node"
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                          onClick={() => {
                            setBlogYear(year);
                            setBlogLimit(100);
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                          style={{ '--year-accent': year === 'Featured' ? '#00ff88' : '#3b82f6' }}
                        >
                          <div className="year-val">{year}</div>
                          <div className="sub-info">
                            <h3>{year === 'Featured' ? 'Latest / Featured' : `${year} Repository`}</h3>
                            <p>{CHRONOLOGICAL_DB[year].length} Deep-dives found.</p>
                          </div>
                          <div className="year-action">EXPLORE ARCHIVE</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hub-sub-layout">
                  <div className="hub-sub-header repo-header">
                    <div className="header-nav-row">
                      <button className="hub-back-btn" onClick={() => setBlogYear(null)}>
                        <X size={20} />
                        <span>BACK TO YEARS</span>
                      </button>
                      <div className="blog-repo-search">
                        <Search size={18} />
                        <input 
                          type="text" 
                          placeholder={`Search ${blogYear} blueprints...`} 
                          value={blogSearch}
                          onChange={(e) => setBlogSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <h2>{blogYear === 'Featured' ? 'Featured Research' : `${blogYear} blueprints`}</h2>
                  </div>
                  <div className="hub-scroll-area repo-area">
                    <div className="hub-sub-grid">
                      {(() => {
                        const filtered = CHRONOLOGICAL_DB[blogYear].filter(item => 
                          item.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
                          item.description.toLowerCase().includes(blogSearch.toLowerCase())
                        );
                        
                        return (
                          <>
                            {filtered.slice(0, blogLimit).map((article, i) => (
                              <motion.div
                                key={article.url}
                                className="hub-sub-card article-node"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => window.open(article.url, '_blank')}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0, transition: { delay: (i % 20) * 0.02 } }}
                              >
                                <div className="article-meta">
                                  <span className="source-tag">AL_VIDHYA</span>
                                  <Zap size={14} className="emerald-flicker" />
                                </div>
                                <h3>{article.title}</h3>
                                <p>{article.description}</p>
                                <div className="article-foot">
                                  <span>OPEN RESEARCH</span>
                                  <ChevronRight size={14} />
                                </div>
                              </motion.div>
                            ))}
                            
                            {filtered.length > blogLimit && (
                              <motion.button 
                                className="load-more-btn"
                                onClick={() => setBlogLimit(prev => prev + 100)}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <span>LOAD MORE BLUEPRINTS ({filtered.length - blogLimit} REMAINING)</span>
                                <ChevronRight size={14} />
                              </motion.button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : view === 'main' ? (
            <motion.div 
              key="main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="hub-grid"
            >
              {mainCards.map((card, i) => (
                <motion.div
                  key={card.id}
                  className="hub-card"
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={card.action}
                  style={{ '--card-accent': card.color }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                >
                  <div className="hub-card-glow" />
                  <div className="hub-card-inner">
                    <div className="hub-icon-wrapper">
                      {card.icon}
                    </div>
                    <h2>{card.title}</h2>
                    <p>{card.description}</p>
                    <div className="hub-card-foot">
                      <span>INITIALIZE</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="submenu"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="hub-sub-layout"
            >
              <div className="hub-sub-header">
                <button 
                  className="hub-back-btn" 
                  onClick={getBackAction()}
                >
                  <X size={20} />
                  <span>{view === 'curricula' ? 'BACK TO STUDY' : 'BACK TO MODELS'}</span>
                </button>
                <h2>{getSubMenuTitle()}</h2>
              </div>
              <div className="hub-scroll-area">
                <div className="hub-sub-grid">
                  {getActiveCards().map((card, i) => (
                    <motion.div
                      key={card.id}
                      className="hub-sub-card"
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                      onClick={card.action}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                      style={{ '--sub-accent': card.accent || card.color || 
                                             (view === 'design' ? '#60a5fa' : 
                                              view === 'roadmap' ? '#00ccff' : '#00ff88') }}
                    >
                      <div className="sub-icon" style={{ color: 'var(--sub-accent)' }}>{card.icon}</div>
                      <div className="sub-info">
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .hub-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          z-index: 2000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Syne', sans-serif;
        }

        .hub-header {
          position: absolute;
          top: 0; left: 0; width: 100%;
          padding: 30px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
          background: linear-gradient(to bottom, #020202 50%, transparent);
        }

        .hub-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #fff;
          font-size: 11px;
        }

        .hub-logo-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #00ff88;
          box-shadow: 0 0 15px #00ff88;
          animation: hub-pulse 2s infinite;
        }

        @keyframes hub-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .show-all-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 10px 20px;
          border-radius: 30px;
          color: #888;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: 0.3s;
        }

        .show-all-btn:hover {
          background: #fff;
          color: #000;
          border-color: #fff;
        }

        .hub-container {
          width: 100%;
          max-width: 1600px;
          padding: 120px 40px 40px;
          z-index: 5;
          margin-top: 20px;
        }

        .hub-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }

        .hub-card {
          position: relative;
          aspect-ratio: 1;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 24px;
          cursor: pointer;
          overflow: hidden;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: border-color 0.3s;
        }

        .hub-card:hover {
          border-color: var(--card-accent);
        }

        .hub-card-glow {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at center, var(--card-accent) 0%, transparent 70%);
          opacity: 0;
          transition: 0.5s;
          pointer-events: none;
        }

        .hub-card:hover .hub-card-glow {
          opacity: 0.15;
        }

        .hub-icon-wrapper {
          width: 64px; height: 64px;
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: var(--card-accent);
          transition: 0.3s;
        }

        .hub-card:hover .hub-icon-wrapper {
          background: var(--card-accent);
          color: #000;
          transform: translateY(-5px);
        }

        .hub-card h2 {
          font-size: 32px;
          font-weight: 800;
          margin: 0 0 12px;
          color: #fff;
        }

        .hub-card p {
          font-size: 14px;
          color: #888;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .hub-card-foot {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2px;
          color: var(--card-accent);
          opacity: 0;
          transform: translateX(-10px);
          transition: 0.3s;
        }

        .hub-card:hover .hub-card-foot {
          opacity: 1;
          transform: translateX(0);
        }

        /* --- Sub Layout --- */
        .hub-sub-layout {
          width: 100%;
          max-width: 1540px;
          margin: 0 auto;
        }

        .hub-sub-header {
          margin-bottom: 40px;
          text-align: center;
        }

        .hub-back-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 8px 16px;
          border-radius: 20px;
          color: #666;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          margin: 0 auto 20px;
          transition: 0.3s;
        }

        .hub-back-btn:hover { color: #fff; background: rgba(255,255,255,0.1); border-color: #fff; }

        .hub-sub-header h2 { font-size: 48px; font-weight: 800; color: #fff; letter-spacing: -1px; }

        .hub-scroll-area {
          max-height: 400px;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 10px 20px 10px 0;
        }

        .hub-scroll-area::-webkit-scrollbar { width: 4px; }
        .hub-scroll-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        .hub-sub-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .hub-sub-card {
          position: relative;
          flex: 0 1 210px;
          aspect-ratio: 0.85;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          overflow: hidden;
        }

        .hub-sub-card:hover {
          border-color: var(--sub-accent);
          transform: translateY(-5px);
          background: rgba(255,255,255,0.04);
        }

        .sub-icon { 
          margin-bottom: auto;
          width: 40px; height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          transition: 0.3s;
        }

        .hub-sub-card:hover .sub-icon {
          background: var(--sub-accent);
          color: #000 !important;
        }

        .sub-info h3 { font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 6px; }
        .sub-info p { font-size: 12px; color: #555; line-height: 1.4; margin: 0; }

        /* --- Blog Viewer & Gallery --- */
        .year-node {
          border-left: 2px solid var(--year-accent);
          background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.2));
        }

        .year-val {
          font-size: 40px;
          font-weight: 900;
          color: var(--year-accent);
          margin-bottom: auto;
          opacity: 0.5;
        }

        .year-action {
          margin-top: 20px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
          color: var(--year-accent);
        }

        .repo-header {
          text-align: left !important;
        }

        .header-nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
        }

        .header-nav-row .hub-back-btn { margin: 0; }

        .blog-repo-search {
          flex: 1;
          max-width: 600px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 30px;
          height: 44px;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 12px;
          color: #444;
          transition: 0.3s;
        }

        .blog-repo-search:focus-within {
          border-color: #00ff88;
          color: #00ff88;
          background: rgba(0, 255, 136, 0.02);
        }

        .blog-repo-search input {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          width: 100%;
          outline: none;
        }

        .article-node {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          aspect-ratio: auto !important;
          min-height: 160px;
          padding: 16px;
        }

        .article-meta {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-bottom: auto;
        }

        .source-tag { font-size: 8px; font-weight: 900; color: #444; letter-spacing: 1px; }

        .emerald-flicker { color: #00ff88; animation: flicker 3s infinite; }
        @keyframes flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .article-node h3 { font-size: 13px; font-weight: 800; color: #fff; margin: 12px 0 6px; line-height: 1.3; }
        .article-node p { font-size: 10px; color: #555; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 12px; }

        .article-foot {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 9px;
          font-weight: 900;
          color: #00ff88;
          opacity: 0.4;
          transition: 0.3s;
        }

        .article-node:hover .article-foot { opacity: 1; transform: translateX(5px); }

        .repo-area {
          max-height: 720px !important;
        }

        .sub-tagline { font-size: 14px; color: #444; margin-top: -10px; font-weight: 600; }

        .ai-pilot-card {
           background: linear-gradient(135deg, rgba(0, 255, 136, 0.05), rgba(0, 0, 0, 0.2)) !important;
           border-left: 2px solid #00ff88 !important;
        }

        .ai-pilot-icon { margin-bottom: auto; color: #00ff88; filter: drop-shadow(0 0 10px rgba(0,255,136,0.3)); }
        .ai-tag { 
          position: absolute; top: 12px; right: 12px; 
          font-size: 8px; font-weight: 900; color: #00ff88; 
          background: rgba(0,255,136,0.1); padding: 4px 8px; border-radius: 4px; 
        }

        .ai-search-entry {
          margin-bottom: 40px;
          display: flex;
          justify-content: center;
        }

        .ai-input-wrapper {
          position: relative;
          width: 100%;
          max-width: 800px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 40px;
          height: 80px;
          display: flex;
          align-items: center;
          padding: 0 40px;
          gap: 20px;
          transition: 0.3s;
        }

        .ai-input-wrapper:focus-within {
          border-color: #00ff88;
          background: rgba(0, 255, 136, 0.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(0,255,136,0.1);
        }

        .ai-input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 20px;
          font-weight: 700;
          outline: none;
          font-family: 'Syne', sans-serif;
        }

        .ai-glow-icon { color: #00ff88; filter: drop-shadow(0 0 10px #00ff88); }

        .scanning-pulse {
          position: absolute;
          bottom: 0; left: 10%; width: 80%; height: 2px;
          background: linear-gradient(to right, transparent, #00ff88, transparent);
          animation: scan 0.8s ease-in-out infinite;
        }

        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-78px); opacity: 0; }
        }

        .year-pill {
          font-size: 9px; font-weight: 900; color: #00ccff; 
          background: rgba(0,204,255,0.1); padding: 4px 8px; border-radius: 4px;
        }

        .ai-empty-state {
          grid-column: 1 / -1;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          font-weight: 800;
          letter-spacing: 2px;
          font-size: 14px;
          text-transform: uppercase;
        }

        .load-more-btn {
          grid-column: 1 / -1;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #00ff88;
          padding: 24px;
          border-radius: 16px;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          transition: 0.3s;
          margin-top: 20px;
        }

        .load-more-btn:hover {
          background: rgba(0, 255, 136, 0.1);
          border-color: #00ff88;
          box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2);
        }

        /* --- Mobile Optimization --- */
        @media (max-width: 1400px) {
          .hub-sub-grid { grid-template-columns: repeat(4, 1fr); }
        }

        @media (max-width: 1100px) {
          .hub-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .hub-sub-grid { grid-template-columns: repeat(3, 1fr); }
          .hub-container { padding: 100px 30px 40px; }
        }

        @media (max-width: 768px) {
          .hub-header { padding: 20px; }
          .hub-logo span { display: none; }
          .show-all-btn span { display: none; }
          .hub-container { padding: 80px 20px 20px; }
          
          .hub-grid { grid-template-columns: 1fr; }
          .hub-card { padding: 24px; min-height: 200px; aspect-ratio: auto; }
          .hub-card h2 { font-size: 24px; }
          
          .hub-sub-header h2 { font-size: 28px; }
          .hub-sub-grid { grid-template-columns: 1fr; }
          .hub-sub-card { aspect-ratio: auto; min-height: 120px; padding: 20px; }
          
          .header-nav-row { flex-direction: column; align-items: stretch; gap: 16px; }
          .blog-repo-search { max-width: 100%; height: 40px; }
          
          .ai-input-wrapper { height: 60px; padding: 0 20px; }
          .ai-input-wrapper input { font-size: 16px; }
          .scanning-pulse { animation: scan-mobile 0.8s ease-in-out infinite; }
          
          @keyframes scan-mobile {
            0% { transform: translateY(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-58px); opacity: 0; }
          }
          
          .repo-area { max-height: calc(100vh - 300px) !important; }
        }

        /* --- Landing Search --- */
        .hub-landing-search {
          max-width: 600px;
          margin: 32px auto 0;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          height: 56px;
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 16px;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: rgba(255, 255, 255, 0.4);
          font-size: 14px;
          font-weight: 500;
        }

        .hub-landing-search:hover {
          background: rgba(0, 255, 136, 0.05);
          box-shadow: 0 10px 40px rgba(0, 255, 136, 0.1);
        }

        .search-sparkle { color: #00ff88; }
        .search-shortcut {
          margin-left: auto;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
          color: #00ff88;
          border: 1px solid rgba(0, 255, 136, 0.2);
        }

        @media (max-width: 768px) {
          .hub-landing-search { margin-top: 24px; height: 48px; font-size: 12px; }
          .search-shortcut { display: none; }
        }

        /* --- Background & Utilities --- */
        .opacity-40 {
          opacity: 0.4;
        }
      `}</style>
    </div>
  );
}
