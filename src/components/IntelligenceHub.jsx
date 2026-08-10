import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Layers, Users, Sparkles, X, 
  ChevronRight, Boxes, Layout, Globe, Activity, Zap, Search, Monitor,
  Share2, CheckSquare, Bookmark, Network, GitBranch
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { loadBlogCatalog, flattenCatalog } from '../services/blogCatalogService';
import { ALGO_EXAMPLES } from '../data/algoExamples';

const FlickeringGrid = ({ 
  squareSize = 4, 
  gridGap = 6, 
  flickerChance = 0.3, 
  color = "#00ff88", 
  maxOpacity = 0.3,
  className = "",
  transitionColor = true
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
    <div ref={containerRef} style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, 
      pointerEvents: 'none', background: '#020202',
      transition: transitionColor ? 'background 1s ease' : 'none'
    }} className={className}>
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        background: color, opacity: 0.05,
        transition: transitionColor ? 'background 0.8s ease' : 'none'
      }} />
      <canvas ref={canvasRef} style={{ 
        mixBlendMode: 'screen',
        transition: transitionColor ? 'filter 0.8s ease' : 'none'
      }} />
    </div>
  );
};

const RESEARCH_BLOGS = [
  { id: 'agents-vs-apps', title: 'AI Agents vs Apps', description: 'Exploring the paradigm shift in software architecture.', category: 'Agents', slug: '2025-04-ai-agents-vs-apps', icon: <Sparkles size={20} /> },
  { id: 'llm-vs-agents', title: 'LLM vs Agents', description: 'Foundational differences in autonomy and reasoning.', category: 'Foundations', slug: '2024-11-slms-vs-llms', icon: <Activity size={20} /> },
  { id: 'deepseek-vs-llama', title: 'DeepSeek v3 vs Llama 4', description: 'The battle for open-source model supremacy.', category: 'Models', slug: '2025-04-deepseek-v3-vs-llama-4', icon: <Layers size={20} /> },
  { id: 'agentic-rag', title: 'Agentic RAG', description: 'Advanced retrieval augmented generation with GPT-4.', category: 'Agents', slug: '2025-04-agentic-rag-using-gpt-4-1', icon: <Globe size={20} /> },
  { id: 'mcp-cursor', title: 'MCP with Cursor AI', description: 'Integrating Model Context Protocol in IDEs.', category: 'Tech', slug: '2025-04-mcp-with-cursor-ai', icon: <Layout size={20} /> },
  { id: 'deep-research', title: 'Deep Research Agent', description: 'Building autonomous agents for technical research.', category: 'Agents', slug: '2025-02-build-your-own-deep-research-agent', icon: <Boxes size={20} /> },
  { id: 'slm-vs-llm', title: 'SLMs vs LLMs', description: 'Why small language models are winning in production.', category: 'Models', slug: '2024-11-slms-vs-llms', icon: <Zap size={20} /> },
  { id: 'prompt-engineering', title: 'Prompt Library', description: 'Curated prompt engineering frameworks and books.', category: 'Prompting', slug: '2024-04-top-best-prompt-engineering-books', icon: <BookOpen size={20} /> },
  { id: 'production-ai', title: 'Production AI Systems', description: 'Architecting reliable intelligence for millions.', category: 'Tech', slug: '2023-09-production-systems-in-ai', icon: <Globe size={20} /> },
  { id: 'ml-learning-path', title: 'ML Masterclass', description: 'End-to-end roadmap to becoming a Data Scientist.', category: 'Roadmap', slug: '2020-12-a-comprehensive-learning-path-to-become-a-data-scientist', icon: <Users size={20} /> },
  { id: 'vector-db', title: 'Vector DB Deepdive', description: 'Mastering ChromaDB for semantic search systems.', category: 'Data', slug: '2023-07-guide-to-chroma-db-a-vector-store-for-your-generative-ai-llms', icon: <Layers size={20} /> },
  { id: 'knowledge-graphs', title: 'Knowledge Graphs', description: 'Theory and application of connected intelligence.', category: 'Data', slug: '2023-01-knowledge-graphs-deep-dive-into-its-theories-and-applications', icon: <Globe size={20} /> }
];

export default function IntelligenceHub({ 
  onOpenArticle,
  paths, 
  onStudyAction, 
  onDesignAction, 
  onInterview, 
  onShowAll,
  onTour,
  pathsData = {},
  activePath = 'ds',
  initialView = 'main',
  initialYear = null,
  initialAI = false
}) {
  const [viewStack, setViewStack] = useState(['main']);
  const view = viewStack[viewStack.length - 1]; // Current view is top of stack

  // Breadcrumb helper
  const navigateTo = (newView) => {
    setViewStack(prev => [...prev, newView]);
  };

  const goBack = () => {
    if (viewStack.length > 1) {
      setViewStack(prev => prev.slice(0, -1));
    } else {
      onShowAll();
    }
  };

  const { isAdmin, isAdminView } = useAuth();
  const [blogYear, setBlogYear] = useState(initialYear);
  const [blogSearch, setBlogSearch] = useState('');
  const [blogLimit, setBlogLimit] = useState(100);
  const [showAI, setShowAI] = useState(initialAI);
  const [aiQuery, setAiQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Escape key listener for Issue 01
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onShowAll();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onShowAll]);

  // Sync with external navigation (e.g. Sidebar clicks)
  useEffect(() => {
    if (initialView && initialView !== view) setViewStack(['main', initialView]);
    if (initialYear !== undefined) setBlogYear(initialYear);
    if (initialAI !== undefined) setShowAI(initialAI);
    // Reset limit on external jump
    setBlogLimit(100);
  }, [initialView, initialYear, initialAI]);



  // The 2.9 MB blog catalog is fetched only once the Research Repository view is
  // actually opened. It used to be a static import in this file — a home screen —
  // so every visitor downloaded and parsed the whole archive to render a dashboard
  // that may never show it. See services/blogCatalogService.
  const [blogCatalog, setBlogCatalog] = useState({});
  useEffect(() => {
    if (view !== 'blog') return;
    let cancelled = false;
    loadBlogCatalog().then(catalog => { if (!cancelled) setBlogCatalog(catalog); });
    return () => { cancelled = true; };
  }, [view]);

  const flatBlueprints = useMemo(() => flattenCatalog(blogCatalog), [blogCatalog]);

  const getOverallProgress = () => {
    const EXCLUDED = ["workspace", "videoIntelligence", "saved_algos", "genai-roadmap-campusx"];
    let total = 0;
    let complete = 0;
    Object.keys(pathsData).forEach(k => {
      if (EXCLUDED.includes(k)) return;
      const p = pathsData[k];
      if (!p || !p.nodes) return;
      p.nodes.forEach(n => {
        if (n.modules) {
          n.modules.forEach(m => {
            total++;
            if (m.status === 'complete') complete++;
          });
        }
      });
    });
    return total > 0 ? Math.round((complete / total) * 100) : 0;
  };

  const activePathTitle = pathsData[Object.keys(pathsData).find(k => !["workspace", "videoIntelligence", "saved_algos", "genai-roadmap-campusx"].includes(k))]?.title || "Active Roadmap";

  const mainCards = [
    {
      id: 'roadmap',
      title: 'Map',
      subtitle: 'Knowledge Galaxy',
      icon: <Globe className="hub-icon" size={24} />,
      description: 'Explore the 3D topology of global intelligence.',
      footerLabel: 'OPEN GALAXY →',
      color: '#00ccff',
      action: () => navigateTo('roadmap'),
      progress: getOverallProgress() // Map shows overall across all paths
    },
    {
      id: 'study',
      title: 'Study',
      subtitle: 'Study Hub',
      icon: <BookOpen className="hub-icon" size={24} />,
      description: 'Master AI concepts through structured pathways.',
      footerLabel: 'START LEARNING →',
      color: '#00ff88',
      action: () => navigateTo('study'),
      progress: getOverallProgress() // Study shows overall completion
    },
    {
      id: 'design',
      title: 'Design',
      subtitle: 'System Playground',
      icon: <Layers className="hub-icon" size={24} />,
      description: 'Architect complex intelligence systems in a lab.',
      footerLabel: 'INITIALIZE LAB →',
      color: '#60a5fa',
      action: () => navigateTo('design')
    },
    {
      id: 'interview',
      title: 'Interview',
      subtitle: 'Training Agent',
      icon: <Users className="hub-icon" size={24} />,
      description: 'Prepare for elite AI engineering roles.',
      footerLabel: 'START SESSION →',
      color: '#fbbf24',
      action: onInterview
    },
    {
      id: 'community',
      title: 'Community',
      subtitle: 'Global Network',
      icon: <Users className="hub-icon" size={24} />,
      description: 'Connect with elite AI engineers and researchers.',
      footerLabel: 'JOIN NETWORK →',
      color: '#a855f7',
      action: () => onStudyAction('community')
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
      description: 'High-level hierarchical study path overview.',
      action: () => onStudyAction('knowledge_tree'),
      accent: '#00ccff'
    },
    {
      id: 'knowledge_graph',
      title: 'Knowledge Graph',
      icon: <Share2 size={24} />,
      description: 'Dynamic interactive node-link visualization.',
      action: () => onStudyAction('knowledge_graph'),
      accent: '#00ccff'
    }
  ];

  const studyCards = [
    {
      id: 'curriculum_map',
      title: 'Study Map',
      subtitle: 'Visual Blueprint',
      icon: <Network size={20} />,
      description: 'Interactive map of all learning pathways.',
      action: () => onStudyAction('curriculum_map'),
      accent: '#00ccff',
      category: 'Intelligence Paths'
    },
    {
      id: 'study_paths',
      title: 'Study Paths',
      subtitle: 'Path Library',
      icon: <Layers size={20} />,
      description: 'Explore specialized learning pathways.',
      action: () => navigateTo('study_paths'),
      accent: '#00ccff',
      category: 'Intelligence Paths'
    },
    ...(isAdmin && isAdminView ? [{
      id: 'algo_studio',
      title: 'Algo Studio',
      icon: <Activity size={20} />,
      description: 'Advanced algorithm visualization and lab.',
      action: () => onStudyAction('algo_studio'),
      accent: '#a855f7',
      category: 'Operational Labs'
    }] : []),
    {
      id: 'algo_visualizer',
      title: 'Algo Visualizer',
      subtitle: 'PRO Engine',
      icon: <Monitor size={20} />,
      description: 'Embedded professional code simulation engine.',
      action: () => onStudyAction('algo_visualizer'),
      accent: '#ef4444',
      category: 'Operational Labs'
    },
    {
      id: 'aiml_companion',
      title: 'AIML Companion',
      icon: <Boxes size={20} />,
      description: 'Interactive AI pairing and research node.',
      action: () => onStudyAction('aiml_companion'),
      accent: '#ec4899',
      category: 'Operational Labs'
    },
    {
      id: 'blog',
      title: 'Research',
      subtitle: 'Blog Archive',
      icon: <Layout size={20} />,
      description: 'Deep-dives from the global research repository.',
      action: () => navigateTo('blog'),
      accent: '#3b82f6',
      category: 'Intelligence Paths'
    },
    {
      id: 'ide',
      title: 'Python IDE',
      icon: <Layout size={20} />,
      description: 'Embedded code sandbox and testing lab.',
      action: () => onStudyAction('ide'),
      accent: '#60a5fa',
      category: 'Operational Labs'
    },
    {
      id: 'dsa_animator',
      title: 'DSA Animator',
      icon: <Activity size={20} />,
      description: 'Interactive Data Structures & Algos visualizer.',
      action: () => onStudyAction('dsa_animator'),
      accent: '#f59e0b',
      category: 'Operational Labs'
    },
    {
      id: 'progress',
      title: 'Skill Progress',
      icon: <Activity size={20} />,
      description: 'Track your expertise across the ecosystem.',
      action: () => onStudyAction('progress'),
      accent: '#00ff88',
      category: 'Intelligence Paths'
    },
    {
      id: 'tasks',
      title: 'Quick Notes',
      icon: <CheckSquare size={20} />,
      description: 'Manage your learning tasks and session notes.',
      action: () => onStudyAction('tasks'),
      accent: '#fbbf24',
      category: 'Operational Labs'
    },
    {
      id: 'github_hub',
      title: 'GitHub Hub',
      subtitle: 'Version Control',
      icon: <GitBranch size={20} />,
      description: 'Manage your GitHub repositories and projects.',
      action: () => onStudyAction('github'),
      accent: '#60a5fa',
      category: 'Operational Labs'
    },
    {
      id: 'links',
      title: 'Links',
      icon: <Bookmark size={20} />,
      description: 'Curated learning resources and bookmarks.',
      action: () => onStudyAction('links'),
      accent: '#10b981',
      category: 'Intelligence Paths'
    },
    {
      id: 'resources',
      title: 'Resources',
      icon: <BookOpen size={20} />,
      description: 'Central repository for learning materials.',
      action: () => onStudyAction('resources'),
      accent: '#3b82f6',
      category: 'Intelligence Paths'
    },
    {
      id: 'k8s_games',
      title: 'K8s Games',
      subtitle: 'Chaos Engine',
      icon: <Boxes size={20} />,
      description: 'Master Kubernetes clusters through gamified chaos.',
      action: () => onStudyAction('k8s_games'),
      accent: '#10b981',
      category: 'Operational Labs'
    },
    {
      id: 'git_visualizer',
      title: 'Git Visualizer',
      subtitle: 'Version Control',
      icon: <Monitor size={20} />,
      description: 'Visualize Git branching and commit history.',
      action: () => onStudyAction('git_visualizer'),
      accent: '#a855f7',
      category: 'Operational Labs'
    }
  ];

  const studyPathCards = Object.entries(paths || {}).map(([id, path]) => ({
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
      title: 'GenAI Simulator',
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
    if (view === 'roadmap') return 'Navigation Galaxy';
    if (view === 'study') return 'Study Paths';
    if (view === 'design') return 'Architectural Labs';
    if (view === 'study_paths') return 'Select Study Path';
    if (view === 'blog') return 'Research Repository';
    return '';
  };

  const getActiveCards = () => {
    if (view === 'roadmap') return roadmapCards;
    if (view === 'study') return studyCards;
    if (view === 'design') return designCards;
    if (view === 'study_paths') return studyPathCards;
    return [];
  };

  const getBackAction = () => {
    if (view === 'study_paths') return () => setViewStack(['main', 'study']);
    if (view === 'blog') return () => { 
      if (showAI) setShowAI(false);
      else if (blogYear) {
        setBlogYear(null);
        setBlogLimit(100);
      } else setViewStack(['main', 'study']);
    };
    return () => setViewStack(['main']);
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
        
        <div className="hub-breadcrumbs">
          {viewStack.map((v, i) => (
            <React.Fragment key={v}>
              <span 
                className={`breadcrumb-pill ${i === viewStack.length - 1 ? 'active' : ''}`}
                onClick={() => setViewStack(viewStack.slice(0, i + 1))}
              >
                {v.toUpperCase()}
              </span>
              {i < viewStack.length - 1 && <ChevronRight size={10} className="breadcrumb-sep" />}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="show-all-btn exit-btn" onClick={onShowAll}>
            <span>EXIT HUB</span>
            <X size={16} />
          </button>
        </div>
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
                    <button className="hub-back-btn" onClick={goBack}>
                      <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
                      <span>BACK</span>
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
                              key={article.slug}
                              className="hub-sub-card article-node"
                              whileHover={{ scale: 1.02 }}
                              onClick={() => onOpenArticle?.(article.slug)}
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
                    <button className="hub-back-btn" onClick={goBack}>
                      <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
                      <span>BACK</span>
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
                        {Object.keys(blogCatalog)
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
                            <p>{(blogCatalog[year] || []).length} Deep-dives found.</p>
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
                        const filtered = (blogCatalog[blogYear] || []).filter(item => 
                          item.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
                          item.description.toLowerCase().includes(blogSearch.toLowerCase())
                        );
                        
                        return (
                          <>
                            {filtered.slice(0, blogLimit).map((article, i) => (
                              <motion.div
                                key={article.slug}
                                className="hub-sub-card article-node"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => onOpenArticle?.(article.slug)}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0, transition: { delay: (i % 20) * 0.02 } }}
                              >
                                <div className="article-meta">
                                  <span className="source-tag">ARCHIVE</span>
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
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="hub-command-center"
            >
              <div className="hub-command-intro">
                <div>
                  <div className="hub-command-eyebrow"><span /> ADMIN INTELLIGENCE CONTROL PLANE</div>
                  <h1>Shape the systems<br /><em>behind the intelligence.</em></h1>
                  <p>One operating surface for learning paths, system design, research, and the people building what comes next.</p>
                </div>
                <div className="hub-command-summary">
                  <div className="hub-summary-status"><span /> ALL SYSTEMS NOMINAL</div>
                  <div className="hub-summary-copy"><span>ACADEMY SIGNAL</span><strong>Connected intelligence</strong><small>Paths, labs, and practice are ready.</small></div>
                </div>
              </div>

              <div className="hub-command-layout">
                <motion.button
                  className="hub-command-feature"
                  onClick={mainCards[0].action}
                  style={{ '--card-accent': mainCards[0].color }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="hub-feature-orbit hub-feature-orbit-one" /><div className="hub-feature-orbit hub-feature-orbit-two" /><div className="hub-feature-node hub-feature-node-one" /><div className="hub-feature-node hub-feature-node-two" />
                  <div className="hub-feature-top"><span className="hub-feature-index">01 / ORIENTATION</span><span className="hub-feature-live"><span /> LIVE MAP</span></div>
                  <div className="hub-feature-content"><span className="hub-feature-icon">{mainCards[0].icon}</span><span className="hub-feature-kicker">KNOWLEDGE GALAXY</span><h2>See the whole system.</h2><p>Trace the relationships between concepts, paths, and the next capability to unlock.</p><div className="hub-feature-progress"><span><b>ACADEMY PROGRESS</b><strong>{mainCards[0].progress}%</strong></span><i><em style={{ width: `${mainCards[0].progress}%` }} /></i></div><span className="hub-feature-action">OPEN KNOWLEDGE GALAXY <ChevronRight size={15} /></span></div>
                </motion.button>
                <div className="hub-command-briefing">
                  <div className="hub-briefing-head"><span className="hub-command-eyebrow"><Zap size={12} /> OPERATING BRIEF</span><span className="hub-briefing-time">NOW</span></div>
                  <div className="hub-briefing-item"><span className="hub-briefing-icon hub-briefing-icon-green"><BookOpen size={15} /></span><span><b>Learning paths</b><small>Continue the roadmap thread</small></span><button onClick={mainCards[1].action} aria-label="Open study hub"><ChevronRight size={15} /></button></div>
                  <div className="hub-briefing-item"><span className="hub-briefing-icon hub-briefing-icon-blue"><Layers size={15} /></span><span><b>System lab</b><small>Turn a concept into architecture</small></span><button onClick={mainCards[2].action} aria-label="Open system design"><ChevronRight size={15} /></button></div>
                  <div className="hub-briefing-item"><span className="hub-briefing-icon hub-briefing-icon-amber"><Users size={15} /></span><span><b>Readiness signal</b><small>Practice the explanation next</small></span><button onClick={mainCards[3].action} aria-label="Open interview practice"><ChevronRight size={15} /></button></div>
                  <div className="hub-briefing-footer"><span><Activity size={13} /> 5 connected surfaces</span><span><Network size={13} /> admin view</span></div>
                </div>
              </div>

              <div className="hub-surface-header"><span className="hub-command-eyebrow"><Sparkles size={12} /> ACADEMY SURFACES</span><span>Choose where to move the work forward.</span></div>
              <div className="hub-surface-grid">
                {mainCards.slice(1).map((card, i) => (
                  <motion.button
                    key={card.id}
                    className="hub-surface-card"
                    onClick={card.action}
                    style={{ '--card-accent': card.color }}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="hub-surface-index">0{i + 2}</span><span className="hub-surface-icon">{card.icon}</span><span className="hub-surface-copy"><b>{card.title}</b><strong>{card.subtitle}</strong><small>{card.description}</small></span><span className="hub-surface-arrow"><ChevronRight size={15} /></span>
                  </motion.button>
                ))}
              </div>
              <div className="hub-command-footer"><span><span className="hub-footer-dot" /> Intelligence Hub online</span><span>Admin workspace · {activePathTitle}</span><button onClick={onTour}><Sparkles size={13} /> TAKE THE TOUR</button></div>
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
                  onClick={goBack}
                >
                  <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />
                  <span>BACK</span>
                </button>
                <h2>{getSubMenuTitle()}</h2>
              </div>
              <div className="hub-scroll-area">
                {view === 'study' ? (
                  ['Intelligence Paths', 'Operational Labs'].map(category => (
                    <div key={category} className="category-section">
                      <div className="category-header">
                        <div className="category-line" />
                        <span className="category-title">{category.toUpperCase()}</span>
                        <div className="category-line" />
                      </div>
                      <div className="hub-sub-grid">
                        {studyCards
                          .filter(card => card.category === category)
                          .map((card, i) => (
                            <motion.div
                              key={card.id}
                              className="hub-sub-card"
                              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                              onClick={card.action}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                              style={{ '--sub-accent': card.accent || card.color || '#00ff88' }}
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
                  ))
                ) : (
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
                )}
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
          font-family: inherit;
        }

        .hub-header {
          position: absolute;
          top: 0; left: 0; width: 100%;
          padding: 10px 40px;
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
          padding: 10px 40px 40px;
          z-index: 10;
          position: relative;
          pointer-events: auto;
          margin-top: 0;
        }

        .hub-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: 40px;
        }

        .breadcrumb-pill {
          font-size: 9px;
          font-weight: 800;
          color: #666;
          cursor: pointer;
          transition: 0.3s;
          letter-spacing: 1px;
        }

        .breadcrumb-pill:hover { color: #fff; }
        .breadcrumb-pill.active { color: #00ff88; }
        .breadcrumb-sep { color: #333; }

        .exit-btn { border-radius: 12px; border-color: rgba(255,255,255,0.15); }
        .exit-btn:hover { background: #ff4444; border-color: #ff4444; }

        .card-subtitle {
          font-size: 10px;
          font-weight: 900;
          color: var(--card-accent);
          letter-spacing: 2px;
          margin: 0 0 8px;
          text-transform: uppercase;
          opacity: 0.7;
        }

        .card-description {
          font-size: 13px;
          color: #888;
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .card-progress-container {
          margin-top: auto;
          margin-bottom: 24px;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 8px;
          font-weight: 900;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }

        .progress-bar-bg {
          width: 100%; height: 2px;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--card-accent);
          box-shadow: 0 0 10px var(--card-accent);
          transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hub-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
          width: 100%;
        }

        .hub-card {
          position: relative;
          aspect-ratio: 0.85;
          background: rgba(255,255,255,0.015);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          cursor: pointer;
          overflow: hidden;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
          width: 44px; height: 44px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          color: var(--card-accent);
          transition: 0.3s;
        }

        .hub-card:hover .hub-icon-wrapper {
          background: var(--card-accent);
          color: #000;
          transform: translateY(-3px);
        }

        .hub-card h2 {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 6px;
          color: #fff;
        }

        .hub-card p {
          font-size: 11px;
          color: #888;
          line-height: 1.4;
          margin-bottom: 12px;
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
          position: relative;
          z-index: 10;
          pointer-events: auto;
        }

        .hub-sub-header {
          margin-bottom: 8px;
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
          margin: 0 auto 8px;
          transition: 0.3s;
        }

        .hub-back-btn:hover { color: #fff; background: rgba(255,255,255,0.1); border-color: #fff; }

        .hub-sub-header h2 { font-size: 32px; font-weight: 800; color: #fff; letter-spacing: -1px; margin: 4px 0; }

        .hub-scroll-area {
          max-height: 75vh;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 10px 20px 10px 0;
        }

        .hub-scroll-area::-webkit-scrollbar { width: 4px; }
        .hub-scroll-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        .hub-sub-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .hub-sub-card {
          position: relative;
          aspect-ratio: 0.85;
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(10px) saturate(140%);
          -webkit-backdrop-filter: blur(10px) saturate(140%);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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
          background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.15));
          backdrop-filter: blur(12px) saturate(150%);
          -webkit-backdrop-filter: blur(12px) saturate(150%);
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
          backdrop-filter: blur(8px) saturate(130%);
          -webkit-backdrop-filter: blur(8px) saturate(130%);
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
          font-family: inherit;
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

        /* --- Shared submenu card system --- */
        .hub-sub-layout {
          width: 100%;
          max-width: 1370px;
        }

        .hub-sub-header {
          margin: 0 auto 25px;
          text-align: center;
        }

        .hub-sub-header h2 {
          margin: 10px 0 7px;
          color: #f2fff9;
          font-size: clamp(30px, 4vw, 46px);
          font-weight: 600;
          letter-spacing: -2.5px;
        }

        .hub-sub-header .sub-tagline {
          margin: 0;
          color: #76968c;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .1px;
        }

        .hub-sub-header .hub-back-btn {
          margin: 0 auto;
          padding: 8px 13px;
          border-color: rgba(111, 241, 191, .16);
          background: rgba(255,255,255,.035);
          color: #8ca69e;
          font-size: 8px;
          letter-spacing: 1.5px;
        }

        .hub-sub-header .hub-back-btn:hover {
          border-color: #74f2bd;
          background: rgba(111,241,191,.09);
          color: #dffff1;
        }

        .hub-scroll-area {
          max-height: calc(100vh - 205px);
          padding: 8px 6px 22px;
          scrollbar-color: rgba(110, 234, 181, .32) transparent;
          scrollbar-width: thin;
        }

        .hub-sub-grid {
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
          max-width: none;
        }

        .hub-sub-card {
          --sub-accent: #66e8ef;
          position: relative;
          min-height: 184px;
          aspect-ratio: auto;
          padding: 17px;
          overflow: hidden;
          border: 1px solid rgba(162, 255, 222, .1);
          border-radius: 17px;
          background: linear-gradient(145deg, rgba(22, 37, 38, .72), rgba(6, 15, 16, .92));
          box-shadow: inset 0 1px rgba(255,255,255,.035), 0 12px 24px rgba(0,0,0,.08);
          transition: transform .28s cubic-bezier(.16,1,.3,1), border-color .28s ease, background .28s ease, box-shadow .28s ease;
        }

        .hub-sub-card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 2px;
          background: linear-gradient(90deg, var(--sub-accent), transparent 72%);
          opacity: .8;
        }

        .hub-sub-card::after {
          content: "";
          position: absolute;
          right: -55px;
          bottom: -75px;
          width: 175px;
          height: 175px;
          border: 1px solid color-mix(in srgb, var(--sub-accent) 21%, transparent);
          border-radius: 50%;
          box-shadow: 0 0 0 22px color-mix(in srgb, var(--sub-accent) 4%, transparent);
          opacity: .65;
          pointer-events: none;
        }

        .hub-sub-card:hover {
          transform: translateY(-6px);
          border-color: color-mix(in srgb, var(--sub-accent) 68%, white 5%);
          background: linear-gradient(145deg, color-mix(in srgb, var(--sub-accent) 10%, rgba(22, 37, 38, .86)), rgba(7, 17, 18, .96));
          box-shadow: inset 0 1px rgba(255,255,255,.07), 0 20px 36px rgba(0,0,0,.2), 0 0 24px color-mix(in srgb, var(--sub-accent) 11%, transparent);
        }

        .sub-icon {
          position: relative;
          z-index: 1;
          width: 36px;
          height: 36px;
          margin: 0;
          border: 1px solid color-mix(in srgb, var(--sub-accent) 18%, transparent);
          border-radius: 10px;
          background: color-mix(in srgb, var(--sub-accent) 9%, rgba(255,255,255,.02));
          color: var(--sub-accent) !important;
          transition: transform .28s ease, background .28s ease, color .28s ease;
        }

        .hub-sub-card:hover .sub-icon {
          transform: translateY(-2px);
          background: var(--sub-accent);
          color: #061313 !important;
        }

        .sub-info {
          position: relative;
          z-index: 1;
          margin-top: auto;
          padding-top: 22px;
        }

        .sub-info h3 {
          margin: 0 0 6px;
          color: #f0fff8;
          font-size: 16px;
          font-weight: 650;
          letter-spacing: -.45px;
        }

        .sub-info p {
          max-width: 220px;
          margin: 0;
          color: #78938b;
          font-size: 10px;
          line-height: 1.45;
        }

        .hub-sub-card:not(.year-node):not(.article-node) .sub-info::after {
          content: "OPEN SURFACE  →";
          display: block;
          margin-top: 12px;
          color: var(--sub-accent);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.3px;
          opacity: .55;
          transition: opacity .25s ease, transform .25s ease;
        }

        .hub-sub-card:not(.year-node):not(.article-node):hover .sub-info::after {
          opacity: 1;
          transform: translateX(4px);
        }

        .category-section { margin-bottom: 31px; }
        .category-header { gap: 15px; margin-bottom: 14px; padding: 0 2px; }
        .category-line { background: linear-gradient(to right, transparent, rgba(111,241,191,.18), transparent); }
        .category-title { color: #6b887e; font-size: 9px; letter-spacing: 2.7px; }
        .category-section:hover .category-title { color: #75f3bd; }

        .year-node { min-height: 160px; border-left: 2px solid var(--year-accent); background: linear-gradient(145deg, color-mix(in srgb, var(--year-accent) 7%, rgba(22,37,38,.72)), rgba(6,15,16,.94)); }
        .year-val { position: relative; z-index: 1; margin: 0; color: var(--year-accent); font-size: 32px; letter-spacing: -1.5px; opacity: .9; }
        .year-node .sub-info { padding-top: 14px; }.year-node .sub-info h3 { font-size: 14px; }.year-node .sub-info p { color: #759188; }.year-action { position: relative; z-index: 1; margin-top: 13px; color: var(--year-accent); font-size: 8px; letter-spacing: 1.3px; }

        .article-node { min-height: 175px; padding: 16px; border-left: 2px solid #56dcb4; background: linear-gradient(145deg, rgba(46, 112, 94, .15), rgba(6,15,16,.94)); }
        .article-node h3 { position: relative; z-index: 1; margin: 14px 0 7px; color: #effff7; font-size: 13px; }.article-node p { position: relative; z-index: 1; color: #78938b; }.article-foot { position: relative; z-index: 1; color: #6ce9b7; }
        .source-tag, .year-pill { border: 1px solid rgba(105,243,185,.16); border-radius: 5px; color: #70caaa; background: rgba(105,243,185,.06); font-size: 7px; letter-spacing: 1.2px; }

        @media (max-width: 1400px) { .hub-sub-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
        @media (max-width: 1100px) { .hub-sub-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }.hub-scroll-area { max-height: calc(100vh - 185px); } }
        @media (max-width: 768px) { .hub-sub-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }.hub-sub-card { min-height: 168px; }.hub-scroll-area { max-height: calc(100vh - 170px); } }
        @media (max-width: 560px) { .hub-sub-grid { grid-template-columns: 1fr; }.hub-sub-card { min-height: 145px; }.hub-sub-header h2 { font-size: 34px; }.hub-scroll-area { padding-right: 2px; } }

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

        /* --- Category Sections --- */
        .category-section {
          margin-bottom: 40px;
          width: 100%;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          padding: 0 40px;
        }

        .category-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
        }

        .category-title {
          font-size: 11px;
          font-weight: 900;
          color: #444;
          letter-spacing: 4px;
          white-space: nowrap;
          text-shadow: 0 0 10px rgba(255,255,255,0.05);
        }

        .category-section:hover .category-title {
          color: #00ff88;
          text-shadow: 0 0 15px rgba(0,255,136,0.3);
          transition: 0.3s;
        }

        /* --- Background & Utilities --- */
        .opacity-40 {
          opacity: 0.4;
        }

        /* --- Admin control plane landing --- */
        .hub-command-center {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          color: #f2fff9;
        }

        .hub-command-intro {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 48px;
          margin-bottom: 28px;
        }

        .hub-command-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #69f9bd;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2.3px;
        }

        .hub-command-eyebrow > span:first-child {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #69f9bd;
          box-shadow: 0 0 14px #69f9bd;
        }

        .hub-command-intro h1 {
          margin: 15px 0 11px;
          color: #effff8;
          font-size: clamp(37px, 4.5vw, 64px);
          font-weight: 600;
          letter-spacing: -3.4px;
          line-height: .96;
        }

        .hub-command-intro h1 em {
          color: #72f7c1;
          font-style: normal;
        }

        .hub-command-intro p {
          max-width: 610px;
          margin: 0;
          color: rgba(187, 211, 202, .64);
          font-size: 13px;
          line-height: 1.6;
        }

        .hub-command-summary {
          width: 245px;
          flex: 0 0 245px;
          padding: 16px;
          border: 1px solid rgba(109, 255, 193, .15);
          border-radius: 15px;
          background: linear-gradient(145deg, rgba(67, 220, 163, .08), rgba(255,255,255,.018));
        }

        .hub-summary-status {
          display: flex;
          align-items: center;
          gap: 7px;
          padding-bottom: 13px;
          border-bottom: 1px solid rgba(255,255,255,.08);
          color: #75f9c1;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .hub-summary-status > span, .hub-feature-live > span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #75f9c1;
          box-shadow: 0 0 11px #75f9c1;
        }

        .hub-summary-copy {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding-top: 14px;
        }

        .hub-summary-copy span { color: #6d8f84; font-size: 8px; font-weight: 900; letter-spacing: 1.5px; }
        .hub-summary-copy strong { color: #e7fff4; font-size: 14px; letter-spacing: -.3px; }
        .hub-summary-copy small { color: #78958c; font-size: 10px; }

        .hub-command-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(310px, .75fr);
          gap: 16px;
        }

        .hub-command-feature {
          position: relative;
          min-height: 354px;
          overflow: hidden;
          padding: 23px 25px 25px;
          border: 1px solid rgba(95, 238, 183, .2);
          border-radius: 20px;
          background: radial-gradient(circle at 77% 50%, rgba(0, 255, 180, .13), transparent 32%), linear-gradient(132deg, rgba(16, 54, 44, .92), rgba(6, 21, 19, .97) 66%);
          color: #f2fff9;
          cursor: pointer;
          text-align: left;
          transition: border-color .25s ease, box-shadow .25s ease;
        }

        .hub-command-feature:hover { border-color: rgba(105, 255, 194, .62); box-shadow: 0 22px 55px rgba(0,0,0,.25), 0 0 35px rgba(82, 244, 183, .08); }
        .hub-command-feature::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, transparent 0 67%, rgba(122,255,209,.05) 67.1%, transparent 67.25%), linear-gradient(0deg, transparent 0 75%, rgba(122,255,209,.04) 75.1%, transparent 75.25%); }
        .hub-feature-top { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; }
        .hub-feature-index { color: #7fb9a2; font-size: 8px; font-weight: 900; letter-spacing: 1.8px; }
        .hub-feature-live { display: inline-flex; align-items: center; gap: 6px; color: #70f5bc; font-size: 8px; font-weight: 900; letter-spacing: 1.4px; }
        .hub-feature-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: flex-start; max-width: 430px; height: 100%; padding-top: 34px; }
        .hub-feature-icon { display: grid; place-items: center; width: 43px; height: 43px; border: 1px solid rgba(100, 221, 255, .4); border-radius: 12px; background: rgba(55, 185, 226, .13); color: #52dff3; }
        .hub-feature-kicker { margin-top: 19px; color: #6bdbeb; font-size: 8px; font-weight: 900; letter-spacing: 1.8px; }
        .hub-command-feature h2 { margin: 7px 0 8px; color: #f5fffb; font-size: 30px; letter-spacing: -1.3px; }
        .hub-command-feature p { max-width: 390px; margin: 0; color: #8db1a6; font-size: 11px; line-height: 1.55; }
        .hub-feature-progress { width: min(100%, 365px); margin-top: 24px; }
        .hub-feature-progress > span { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }
        .hub-feature-progress b { color: #658d7c; font-size: 8px; letter-spacing: 1.5px; }
        .hub-feature-progress strong { color: #73f6c1; font-size: 10px; }
        .hub-feature-progress > i { display: block; height: 4px; overflow: hidden; border-radius: 99px; background: rgba(255,255,255,.12); }
        .hub-feature-progress > i em { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #5fdcf0, #73f6c1); box-shadow: 0 0 12px rgba(112,244,193,.5); }
        .hub-feature-action { display: inline-flex; align-items: center; gap: 7px; margin-top: auto; color: #74ddf0; font-size: 9px; font-weight: 900; letter-spacing: 1.7px; }
        .hub-feature-orbit { position: absolute; z-index: 1; right: -48px; top: 42px; border: 1px solid rgba(80, 231, 206, .18); border-radius: 50%; transform: rotate(-17deg); pointer-events: none; }
        .hub-feature-orbit-one { width: 310px; height: 152px; }.hub-feature-orbit-two { width: 440px; height: 212px; right: -105px; top: 9px; opacity: .55; }
        .hub-feature-node { position: absolute; z-index: 2; width: 8px; height: 8px; border-radius: 50%; background: #68f7c1; box-shadow: 0 0 16px #68f7c1; }.hub-feature-node-one { right: 170px; top: 95px; }.hub-feature-node-two { right: 84px; top: 255px; background: #5bd9ee; box-shadow: 0 0 16px #5bd9ee; }

        .hub-command-briefing { min-height: 354px; padding: 22px 21px 17px; border: 1px solid rgba(255,255,255,.1); border-radius: 20px; background: linear-gradient(150deg, rgba(25,43,45,.84), rgba(8,19,20,.96)); }
        .hub-briefing-head { display: flex; align-items: center; justify-content: space-between; padding-bottom: 19px; border-bottom: 1px solid rgba(255,255,255,.08); }.hub-briefing-head .hub-command-eyebrow { color: #89a7a0; }.hub-briefing-head .hub-command-eyebrow svg { color: #78e7d6; }.hub-briefing-time { color: #6ce8bb; font-size: 8px; font-weight: 900; letter-spacing: 1.4px; }
        .hub-briefing-item { display: grid; grid-template-columns: 33px minmax(0,1fr) 22px; align-items: center; gap: 10px; padding: 17px 0; border-bottom: 1px solid rgba(255,255,255,.065); }.hub-briefing-icon { display: grid; place-items: center; width: 33px; height: 33px; border-radius: 10px; }.hub-briefing-icon-green { color: #71f6c0; background: rgba(113,246,192,.1); }.hub-briefing-icon-blue { color: #6cddf4; background: rgba(108,221,244,.1); }.hub-briefing-icon-amber { color: #f5ca73; background: rgba(245,202,115,.1); }.hub-briefing-item span:nth-child(2) { display: flex; min-width: 0; flex-direction: column; gap: 4px; }.hub-briefing-item b { color: #e9fff7; font-size: 11px; }.hub-briefing-item small { overflow: hidden; color: #78958e; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }.hub-briefing-item button { display: grid; place-items: center; width: 22px; height: 22px; border: 1px solid rgba(255,255,255,.1); border-radius: 50%; background: transparent; color: #80a59b; cursor: pointer; }.hub-briefing-item button:hover { border-color: #74f2bd; color: #74f2bd; }.hub-briefing-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 17px; color: #6d8a83; font-size: 8px; letter-spacing: .5px; }.hub-briefing-footer span { display: inline-flex; align-items: center; gap: 5px; }.hub-briefing-footer svg { color: #6eeabb; }

        .hub-surface-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 28px 2px 13px; }.hub-surface-header > span:last-child { color: #69867e; font-size: 10px; }.hub-surface-header .hub-command-eyebrow { color: #71988a; }.hub-surface-header .hub-command-eyebrow svg { color: #70e8ba; }
        .hub-command-center .hub-surface-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .hub-command-center .hub-surface-card { position: relative; display: grid; grid-template-columns: auto auto 1fr auto; grid-template-rows: auto 1fr; align-items: start; gap: 13px; min-height: 154px; padding: 17px; overflow: hidden; border: 1px solid rgba(255,255,255,.09); border-radius: 16px; background: rgba(255,255,255,.028); color: #fff; cursor: pointer; text-align: left; transition: .25s ease; }
        .hub-command-center .hub-surface-card::after { content: ""; position: absolute; right: -38px; bottom: -59px; width: 145px; height: 145px; border: 1px solid color-mix(in srgb, var(--card-accent) 25%, transparent); border-radius: 50%; opacity: .7; }
        .hub-command-center .hub-surface-card:hover { border-color: color-mix(in srgb, var(--card-accent) 70%, white 5%); background: color-mix(in srgb, var(--card-accent) 8%, rgba(255,255,255,.03)); box-shadow: 0 16px 36px rgba(0,0,0,.18); }
        .hub-surface-index { color: #5d7970; font-size: 8px; font-weight: 900; letter-spacing: 1.5px; }.hub-command-center .hub-surface-icon { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 9px; color: var(--card-accent); background: color-mix(in srgb, var(--card-accent) 12%, transparent); }.hub-surface-copy { grid-column: 1 / -1; display: flex; flex-direction: column; gap: 5px; }.hub-surface-copy b { color: #edfdf6; font-size: 14px; letter-spacing: -.2px; }.hub-surface-copy strong { color: var(--card-accent); font-size: 8px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; }.hub-surface-copy small { max-width: 220px; color: #78968d; font-size: 10px; line-height: 1.45; }.hub-surface-arrow { grid-column: 4; grid-row: 1; display: grid; place-items: center; color: #76978d; }
        .hub-command-footer { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 19px; color: #5f7c73; font-size: 8px; letter-spacing: .8px; }.hub-command-footer > span:first-child { display: inline-flex; align-items: center; gap: 7px; }.hub-footer-dot { width: 6px; height: 6px; border-radius: 50%; background: #6df4bc; box-shadow: 0 0 10px #6df4bc; }.hub-command-footer button { display: inline-flex; align-items: center; gap: 6px; padding: 0; border: 0; background: transparent; color: #72e9bc; cursor: pointer; font-size: 8px; font-weight: 900; letter-spacing: 1.2px; }

        @media (max-width: 1100px) { .hub-command-layout { grid-template-columns: 1fr; }.hub-command-briefing { min-height: auto; }.hub-briefing-item { padding: 13px 0; }.hub-command-center .hub-surface-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-height: 800px) and (min-width: 769px) { .hub-command-intro { margin-bottom: 18px; }.hub-command-intro h1 { margin: 10px 0 8px; font-size: 46px; }.hub-command-intro p { font-size: 11px; }.hub-command-feature, .hub-command-briefing { min-height: 280px; }.hub-command-feature { padding: 18px 20px; }.hub-feature-content { padding-top: 18px; }.hub-command-feature h2 { font-size: 25px; }.hub-feature-progress { margin-top: 14px; }.hub-briefing-item { padding: 10px 0; }.hub-briefing-footer { padding-top: 10px; }.hub-surface-header { margin-top: 16px; margin-bottom: 8px; }.hub-command-center .hub-surface-card { min-height: 112px; padding: 13px; }.hub-command-footer { margin-top: 10px; } }
        @media (max-width: 768px) { .hub-command-intro { align-items: stretch; flex-direction: column; gap: 22px; }.hub-command-summary { width: auto; flex-basis: auto; }.hub-command-intro h1 { font-size: 42px; }.hub-command-center .hub-surface-grid { grid-template-columns: 1fr; }.hub-command-footer { align-items: flex-start; flex-direction: column; }.hub-feature-orbit-one { right: -90px; }.hub-feature-orbit-two { right: -160px; } }
        @media (max-width: 560px) { .hub-command-intro h1 { font-size: 34px; letter-spacing: -2px; }.hub-container { padding: 80px 16px 24px; }.hub-header { padding: 14px 16px; }.hub-breadcrumbs { display: none; }.hub-command-feature { min-height: 390px; padding: 18px; }.hub-command-feature h2 { font-size: 26px; }.hub-command-briefing { padding: 18px 16px 14px; }.hub-surface-header { align-items: flex-start; flex-direction: column; gap: 8px; } }
      `}</style>
    </div>
  );
}
