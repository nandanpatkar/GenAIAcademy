import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, ArrowUpRight, BarChart3, BookOpen, Bookmark, BrainCircuit,
  Check, CheckCircle2, ChevronRight, CircleDashed, Clock3, Code2,
  Command, Compass, Flame, Gauge,
  FileText, Layers3, Lightbulb, Map, MessageSquareText, Network, Orbit, Plus, Play, Search,
  ShieldCheck, Sparkles, Target, Trophy, X, Zap,
} from "lucide-react";
import { searchWeb } from "../services/webSearchService";
import { MANUAL_STRUCTURE } from "../data/manualData";
import { HOME_INTERVIEW_QUESTIONS } from "../data/homeInterviewQuestions";
import KnowledgeGalaxy from "./KnowledgeGalaxy";
import "../styles/HomeDashboard.css";

const INTERNAL_KEYS = new Set([
  "workspace", "videoIntelligence", "saved_algos", "genai-roadmap-campusx",
  "onboarding", "appearance",
]);

const HUB_STORAGE_KEY = "genai_intelligence_hub_v2";

const MODES = [
  { id: "all", label: "All", icon: <Sparkles size={14} /> },
  { id: "learn", label: "Learn", icon: <BookOpen size={14} /> },
  { id: "build", label: "Build", icon: <Layers3 size={14} /> },
  { id: "practice", label: "Practice", icon: <Code2 size={14} /> },
  { id: "research", label: "Research", icon: <Network size={14} /> },
];

const SIGNALS = [
  { mode: "research", label: "RESEARCH", title: "RAG evaluation", body: "Check answer quality, citations, and failure cases.", action: "Open lab", color: "#22d3ee", type: "playground" },
  { mode: "build", label: "BUILD", title: "Build a small agent", body: "Practice tools, results, and recovery.", action: "Open playground", color: "#a78bfa", type: "build" },
  { mode: "practice", label: "PRACTICE", title: "Agents vs workflows", body: "Practice explaining the difference.", action: "Practice answer", color: "#f59e0b", type: "interview" },
  { mode: "learn", label: "LEARN", title: "Vector search", body: "Review embeddings, search, and speed.", action: "Open reference", color: "#34d399", type: "reference" },
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

const readHubState = () => {
  if (typeof window === "undefined") return { missions: [] };
  try {
    const value = JSON.parse(window.localStorage.getItem(HUB_STORAGE_KEY) || "{}");
    return { missions: value.missions || [] };
  } catch {
    return { missions: [] };
  }
};

function ProgressOrbit({ percent, completed, total }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (circumference * percent) / 100;

  return (
    <div className="home-progress-orbit" role="img" aria-label={`${percent}% complete: ${completed} of ${total} modules finished`}>
      <svg viewBox="0 0 160 160" aria-hidden="true">
        <circle className="home-orbit-track" cx="80" cy="80" r={radius} />
        <circle className="home-orbit-progress" cx="80" cy="80" r={radius} style={{ strokeDasharray: circumference, strokeDashoffset: progressOffset }} />
        <circle className="home-orbit-inner-track" cx="80" cy="80" r="47" />
      </svg>
      <div className="home-orbit-value"><strong>{percent}%</strong><span>complete</span></div>
      <span className="home-orbit-satellite home-orbit-satellite-one" aria-hidden="true"><Sparkles size={13} /></span>
      <span className="home-orbit-satellite home-orbit-satellite-two" aria-hidden="true"><Activity size={12} /></span>
    </div>
  );
}

function ExploreConceptPanel({ concepts, pathsData, activePath, setActivePath, onContinue }) {
  const [conceptIndex, setConceptIndex] = useState(0);
  const [conceptQuery, setConceptQuery] = useState("");
  const filteredConcepts = useMemo(() => {
    const value = conceptQuery.trim().toLowerCase();
    if (!value) return concepts;
    return concepts.filter(concept => `${concept.title} ${concept.subtitle} ${concept.description}`.toLowerCase().includes(value));
  }, [concepts, conceptQuery]);
  const concept = filteredConcepts[conceptIndex % Math.max(filteredConcepts.length, 1)] || concepts[0];

  useEffect(() => { setConceptIndex(0); }, [conceptQuery]);
  useEffect(() => {
    if (filteredConcepts.length < 2) return undefined;
    const timer = window.setInterval(() => setConceptIndex(index => (index + 1) % filteredConcepts.length), 7200);
    return () => window.clearInterval(timer);
  }, [filteredConcepts.length]);

  const openGalaxyNode = (node, pathId) => {
    if (pathId) setActivePath?.(pathId);
    onContinue(node, pathId);
  };

  return (
    <section className="hub-panel hub-explore-panel">
      <div className="hub-panel-heading">
        <div><span className="hub-kicker"><Lightbulb size={13} /> EXPLORE</span><h2>Learn something new</h2></div>
        <span className="hub-live-status"><span /> live</span>
      </div>
      <p className="hub-panel-lede">A live stream of concepts from your roadmap. Search, skim, or jump straight into the lesson.</p>
      <div className="hub-explore-search"><Search size={15} /><input value={conceptQuery} onChange={event => setConceptQuery(event.target.value)} placeholder="Search concepts..." /><span>{filteredConcepts.length}</span></div>
      <div className="hub-galaxy-label"><span><Orbit size={12} /> KNOWLEDGE GALAXY</span><small>{activePath ? "active path highlighted" : "drag, zoom, and select a node"}</small></div>
      <div className="hub-galaxy-embed">
        <KnowledgeGalaxy
          nodes={pathsData}
          activePath={activePath}
          embedded
          onNodeClick={openGalaxyNode}
          onModuleClick={(node, _module, pathId) => openGalaxyNode(node, pathId)}
          onSubtopicClick={(node, _module, _topic, pathId) => openGalaxyNode(node, pathId)}
          onClose={() => {}}
        />
      </div>
      {concept ? <>
        <div className="hub-concept-card hub-concept-card-compact">
          <div className="hub-concept-beacon"><BrainCircuit size={25} /><span>LIVE<br />CONCEPT</span></div>
          <div className="hub-concept-copy"><span className="hub-concept-path">{concept.subtitle}</span><h3>{concept.title}</h3><p>{concept.description}</p><div className="hub-concept-tags"><span>from your path</span><span>ready to learn</span></div></div>
        </div>
          <div className="hub-concept-footer"><span>{(conceptIndex % Math.max(filteredConcepts.length, 1)) + 1} / {filteredConcepts.length} ideas</span><div className="hub-carousel-controls"><button onClick={() => setConceptIndex(index => (index - 1 + filteredConcepts.length) % filteredConcepts.length)} aria-label="Previous idea">‹</button><button onClick={() => setConceptIndex(index => (index + 1) % filteredConcepts.length)} aria-label="Next idea">›</button><button className="hub-concept-open" onClick={() => onContinue(concept.node, concept.pathId)}>Open lesson <ArrowRight size={13} /></button></div></div>
      </> : <div className="hub-no-results">No concepts match that search.</div>}
      <div className="hub-concept-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
    </section>
  );
}

function ManualTopicsPanel({ topics, onOpenTopic }) {
  return (
    <section className="hub-panel hub-resource-panel hub-manual-topics-panel">
      <div className="hub-panel-heading">
        <div><span className="hub-kicker"><FileText size={13} /> FROM THE MANUAL</span><h2>One idea worth your time.</h2></div>
        <span className="hub-random-badge"><Sparkles size={11} /> randomised</span>
      </div>
      <p className="hub-panel-lede">Fresh first-principles topics from the Missing Manual. Open any one to jump straight into the lesson.</p>
      <div className="hub-resource-list">
        {topics.length ? topics.map((topic, index) => (
          <button className="hub-resource-row" key={`${topic.categorySlug}-${topic.guideSlug}-${topic.phaseSlug}`} onClick={() => onOpenTopic(topic)}>
            <span className="hub-resource-index">0{index + 1}</span>
            <span className="hub-resource-icon"><FileText size={15} /></span>
            <span className="hub-resource-copy"><strong>{topic.title}</strong><small>{topic.categoryName} · {topic.guideTitle}</small></span>
            <ArrowUpRight size={14} />
          </button>
        )) : <div className="hub-resource-empty">The manual is preparing a few good starting points.</div>}
      </div>
    </section>
  );
}

function InterviewQuestionsPanel({ questions, onOpenQuestion }) {
  return (
    <section className="hub-panel hub-resource-panel hub-interview-questions-panel">
      <div className="hub-panel-heading">
        <div><span className="hub-kicker"><MessageSquareText size={13} /> INTERVIEW RADAR</span><h2>Questions worth rehearsing.</h2></div>
        <span className="hub-random-badge hub-random-badge-purple"><Zap size={11} /> live queue</span>
      </div>
      <p className="hub-panel-lede">Random questions from Interview Prep. Choose one and land directly on its answer.</p>
      <div className="hub-resource-list">
        {questions.length ? questions.map((question, index) => (
          <button className="hub-resource-row hub-interview-row" key={question.id} onClick={() => onOpenQuestion(question)}>
            <span className="hub-resource-index">0{index + 1}</span>
            <span className="hub-resource-icon hub-resource-icon-purple"><MessageSquareText size={15} /></span>
            <span className="hub-resource-copy"><strong>{question.lesson_title}</strong><small>{question.courseTitle} · {question.chapterTitle}</small></span>
            <ArrowUpRight size={14} />
          </button>
        )) : <div className="hub-resource-empty">Interview questions will appear here in a moment.</div>}
      </div>
    </section>
  );
}

export default function HomeDashboard({
  user,
  pathsData,
  activePath,
  setActivePath,
  onContinue,
  onOpenRoadmap,
  onOpenProgress,
  onOpenPractice,
  onOpenPlayground,
  onOpenAwsSystemDesign,
  onOpenOnboarding,
  onOpenShelfItem,
  onOpenDiscovery,
}) {
  const [hubState, setHubState] = useState(readHubState);
  const [query, setQuery] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeMode, setActiveMode] = useState("all");
  const [signalIndex, setSignalIndex] = useState(0);
  const [missionDraft, setMissionDraft] = useState("");
  const [showMissionComposer, setShowMissionComposer] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState("Ask about a topic or your next step.");
  const [webResults, setWebResults] = useState([]);
  const [isResearching, setIsResearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [manualSeed] = useState(() => Math.floor(Math.random() * 100000));
  const [interviewSeed] = useState(() => Math.floor(Math.random() * 100000));

  const paths = useMemo(() => Object.entries(pathsData || {})
    .filter(([key, path]) => !INTERNAL_KEYS.has(key) && path?.nodes)
    .map(([key, path]) => ({ key, path, name: displayPathName(key, path), stats: getPathStats(path) })), [pathsData]);
  const current = paths.find(item => item.key === activePath) || paths[0];
  const nextNode = current?.path?.nodes?.find(node => (node.modules || []).some(module => module.status !== "complete")) || current?.path?.nodes?.[0];
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const recentHistory = (pathsData?.workspace?.history || []).slice(0, 5);
  const totalCompleted = paths.reduce((sum, item) => sum + item.stats.completed, 0);
  const totalModules = paths.reduce((sum, item) => sum + item.stats.total, 0);
  const totalRemaining = Math.max(totalModules - totalCompleted, 0);
  const overallPercent = totalModules ? Math.round((totalCompleted / totalModules) * 100) : 0;

  const systemPath = paths.find(item => /system|aws|architecture/i.test(`${item.key} ${item.name}`)) || paths.find(item => item.key === "aicxm_aws");
  const topStudyPaths = useMemo(() => [...paths].sort((a, b) => b.stats.percent - a.stats.percent || b.stats.total - a.stats.total).slice(0, 3), [paths]);

  const manualTopics = useMemo(() => {
    const topics = MANUAL_STRUCTURE.flatMap(category => (category.guides || []).flatMap(guide => (guide.phases || []).map(phase => ({
      title: phase.title || guide.title,
      summary: phase.summary || guide.summary,
      categorySlug: category.slug,
      categoryName: category.name,
      guideSlug: guide.slug,
      guideTitle: guide.title,
      phaseSlug: phase.slug,
      filePath: phase.filePath,
    }))));
    if (!topics.length) return [];
    const start = manualSeed % topics.length;
    return [...topics.slice(start), ...topics.slice(0, start)].slice(0, 4);
  }, [manualSeed]);

  const randomInterviewQuestions = useMemo(() => {
    const start = interviewSeed % HOME_INTERVIEW_QUESTIONS.length;
    return [...HOME_INTERVIEW_QUESTIONS.slice(start), ...HOME_INTERVIEW_QUESTIONS.slice(0, start)].slice(0, 4);
  }, [interviewSeed]);

  const allSearchItems = useMemo(() => paths.flatMap(path => [
    { kind: "path", title: path.name, subtitle: `${path.stats.completed} of ${path.stats.total} modules complete`, pathId: path.key },
    ...(path.path.nodes || []).flatMap(node => [
      { kind: "node", title: node.title, subtitle: `${path.name} · learning node`, pathId: path.key, node },
      ...(node.modules || []).map(module => ({ kind: "module", title: module.title, subtitle: `${node.title} · ${path.name}`, pathId: path.key, node })),
    ]),
  ]), [paths]);
  const searchResults = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return allSearchItems.slice(0, 6);
    return allSearchItems.filter(item => `${item.title} ${item.subtitle}`.toLowerCase().includes(value)).slice(0, 8);
  }, [allSearchItems, query]);

  const concepts = useMemo(() => paths.flatMap(path => (path.path.nodes || []).flatMap(node => {
    const moduleConcepts = (node.modules || []).map(module => ({
      title: module.title,
      subtitle: `${path.name} · ${node.title}`,
      description: module.description || node.description || "A connected concept from your learning path. Open it to go deeper.",
      pathId: path.key,
      node,
    }));
    return moduleConcepts.length ? moduleConcepts : [{
      title: node.title,
      subtitle: path.name,
      description: node.description || "A connected concept from your learning path. Open it to go deeper.",
      pathId: path.key,
      node,
    }];
  })), [paths]);

  const mastery = useMemo(() => {
    const base = current?.stats.percent || 0;
    return [
      { label: "Understand", value: Math.min(100, base + 14), icon: <Lightbulb size={15} />, color: "#22d3ee" },
      { label: "Recall", value: Math.max(0, base - 6), icon: <Zap size={15} />, color: "#f59e0b" },
      { label: "Apply", value: Math.max(0, base - 17), icon: <Code2 size={15} />, color: "#00ff88" },
      { label: "Explain", value: Math.max(0, base - 3), icon: <MessageSquareText size={15} />, color: "#a78bfa" },
    ];
  }, [current]);

  const activeSignals = useMemo(() => SIGNALS.filter(signal => activeMode === "all" || signal.mode === activeMode), [activeMode]);
  const signal = activeSignals[signalIndex % Math.max(activeSignals.length, 1)] || SIGNALS[0];
  const shelfItems = useMemo(() => [
    ...recentHistory.map(item => ({ type: "roadmap", title: item.title, subtitle: `${item.pathTitle || "Roadmap"} · Continue your topic`, pathId: item.pathId, nodeId: item.id, color: item.pathColor || "#22d3ee" })),
    { type: "manual", title: "The Learning Manual", subtitle: "Guided lessons and practical explanations", color: "#a78bfa" },
    { type: "reference", title: "Quick Reference", subtitle: "Refresh the concepts you need right now", color: "#22d3ee" },
    { type: "quiz", title: "Knowledge Check", subtitle: "Test yourself and strengthen recall", color: "#f59e0b" },
    ...(pathsData?.saved_algos?.length ? [{ type: "dsa", title: pathsData.saved_algos[0].title || "Algorithm practice", subtitle: "Return to your saved visual practice", color: "#34d399" }] : []),
  ], [recentHistory, pathsData?.saved_algos]);
  const [shelfIndex, setShelfIndex] = useState(0);
  const shelfItem = shelfItems[shelfIndex] || shelfItems[0];

  useEffect(() => {
    if (shelfItems.length < 2) return undefined;
    const timer = window.setInterval(() => setShelfIndex(index => (index + 1) % shelfItems.length), 5400);
    return () => window.clearInterval(timer);
  }, [shelfItems.length]);
  useEffect(() => { if (shelfIndex >= shelfItems.length) setShelfIndex(0); }, [shelfIndex, shelfItems.length]);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(HUB_STORAGE_KEY, JSON.stringify(hubState));
  }, [hubState]);
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const openSearchResult = (item) => {
    if (item.kind === "path") {
      setActivePath(item.pathId);
      onOpenRoadmap?.();
      return;
    }
    if (item.node) onContinue(item.node, item.pathId);
  };

  const runCommand = async () => {
    const text = query.trim().toLowerCase();
    if (!text) {
      setAssistantMessage("Try a topic or ask what to learn next.");
      return;
    }
    setSearchError("");
    if (text.includes("research") || text.includes("latest") || text.includes("news") || text.includes("current")) {
      setIsResearching(true);
      try {
        const results = await searchWeb(query, 4);
        setWebResults(results);
        setAssistantMessage(results.length ? `Found ${results.length} fresh sources.` : "No sources found. Try a clearer question.");
      } catch (error) {
        setSearchError(error.message || "Live research is unavailable right now.");
        setAssistantMessage("Live research is not available right now.");
      } finally {
        setIsResearching(false);
      }
    } else if (text.includes("interview") || text.includes("practice answer")) {
      setAssistantMessage("Opening practice.");
      onOpenDiscovery?.({ type: "interview" });
    } else if (text.includes("build") || text.includes("project") || text.includes("agent")) {
      setAssistantMessage("Build mode is ready.");
      onOpenPlayground?.();
    } else if (text.includes("progress") || text.includes("gap") || text.includes("weak")) {
      setAssistantMessage("Your next step is to use what you learned.");
      onOpenProgress?.();
    } else if (searchResults[0]) {
      setAssistantMessage(`Found ${searchResults.length} matches.`);
    } else {
      setAssistantMessage("No match yet. Try RAG, agents, cloud, or system design.");
    }
  };

  const continueLearning = () => nextNode ? onContinue(nextNode, current?.key) : onOpenOnboarding?.();
  const openSystemRoadmap = () => {
    if (systemPath) setActivePath(systemPath.key);
    onOpenRoadmap?.();
  };
  const openManualTopic = (topic) => onOpenDiscovery?.({ type: "manual", phase: topic });
  const openInterviewQuestion = (question) => onOpenDiscovery?.({ type: "interview", lessonId: question.id });
  const createMission = () => {
    const title = missionDraft.trim();
    if (!title) return;
    setHubState(state => ({ ...state, missions: [{ id: `${Date.now()}`, title, progress: 0, goal: "Personal mission", createdAt: new Date().toISOString() }, ...state.missions].slice(0, 8) }));
    setMissionDraft("");
    setShowMissionComposer(false);
  };
  const openShelfItem = (item) => {
    if (item?.type === "roadmap") {
      const path = pathsData[item.pathId];
      const node = path?.nodes?.find(node => node.id === item.nodeId);
      if (node) onContinue(node, item.pathId);
      return;
    }
    onOpenShelfItem?.(item);
  };
  const openSignal = () => {
    if (signal.type === "build" || signal.type === "playground") onOpenPlayground?.(signal);
    else onOpenDiscovery?.(signal);
  };
  const actionItems = [
    { label: "Paths", caption: "See your map", icon: <Map size={18} />, onClick: onOpenRoadmap, modes: ["learn", "research"] },
    { label: "Practice", caption: "Write real code", icon: <Code2 size={18} />, onClick: onOpenPractice, modes: ["build", "practice"] },
    { label: "System design", caption: "Build better systems", icon: <Layers3 size={18} />, onClick: onOpenAwsSystemDesign, modes: ["build"] },
    { label: "Progress", caption: "See your skills", icon: <Trophy size={18} />, onClick: onOpenProgress, modes: ["learn", "practice"] },
  ];
  const researchAction = { label: "Scan research", caption: "Find fresh AI signals", icon: <Network size={18} />, onClick: () => { setQuery("Latest AI research"); setCommandOpen(true); }, modes: ["research"] };
  const visibleActionItems = activeMode === "all" ? actionItems : activeMode === "research" ? [researchAction, ...actionItems.filter(item => item.modes.includes(activeMode))] : actionItems.filter(item => item.modes.includes(activeMode));
  const focusMode = MODES.find(mode => mode.id === activeMode) || MODES[0];
  const focusDescription = activeMode === "all"
    ? "See everything."
    : activeMode === "learn"
      ? "Learn the basics."
      : activeMode === "build"
        ? "Build and test ideas."
        : activeMode === "practice"
          ? "Practice until it sticks."
          : "Find new ideas.";

  return (
    <div className="home-dashboard hub-redesign">
      <div className="home-dashboard-inner">
        <header className="hub-topbar">
          <div className="hub-brand"><span className="hub-brand-mark"><Sparkles size={15} /></span><span>GENAI <b>ACADEMY</b></span><i>INTELLIGENCE HUB</i></div>
          <div className="hub-topbar-actions"><span className="hub-live-status"><span /> synced workspace</span><button className="hub-command-trigger" onClick={() => setCommandOpen(true)}><Command size={14} /> Ask the Hub <kbd>⌘ K</kbd></button><button className="hub-icon-button" onClick={onOpenOnboarding} aria-label="Choose your path"><Compass size={16} /></button></div>
        </header>

        <section className="hub-welcome">
          <div><div className="home-eyebrow"><Sparkles size={13} /> PERSONAL LEARNING OS</div><h1>{greeting}, <span>{firstName}.</span></h1><p>One clear next step. A whole world of AI engineering behind it.</p></div>
          <div className="hub-hero-actions"><span className="hub-context-chip"><Target size={13} /> {current?.name || "Choose a path"}</span><button className="home-guide-button" onClick={onOpenOnboarding}><Compass size={16} /> {current ? "Switch path" : "Choose a path"}</button><button className="home-guide-button hub-system-roadmap-button" onClick={openSystemRoadmap}><Layers3 size={16} /> System roadmap</button></div>
        </section>

        <section className="hub-hero-grid">
          <article className="hub-mission-hero">
            <div className="hub-mission-hero-art" aria-hidden="true"><span /><span /><span /><span /></div>
            <div className="hub-next-copy"><div className="hub-card-kicker"><Play size={13} fill="currentColor" /> YOUR NEXT BUILD</div><div className="hub-trajectory-path">{current?.name || "Your learning path"}</div><h2>{nextNode?.title || "Choose a learning path to begin"}</h2><p>{nextNode ? "Continue the thread, then make the idea real with one small example." : "Start with a path that matches the kind of builder you want to become."}</p><div className="home-trajectory-meta"><span><Clock3 size={14} /> 25 min session</span><span><CheckCircle2 size={14} /> {current?.stats.completed || 0} modules complete</span></div><button className="home-primary-button" onClick={continueLearning}>{nextNode ? "Continue learning" : "Choose a path"} <ArrowRight size={16} /></button></div>
            <div className="hub-hero-orbit"><ProgressOrbit percent={current?.stats.percent || 0} completed={current?.stats.completed || 0} total={current?.stats.total || 0} /><span className="hub-orbit-caption">momentum<br /><b>is built daily</b></span></div>
          </article>
          <aside className="hub-ask-card">
            <div className="hub-ask-card-head"><span className="hub-kicker"><BrainCircuit size={13} /> THINK WITH THE HUB</span><span className="hub-ask-ping" /></div><h2>What are you curious about?</h2><p>{assistantMessage}</p>
            <div className="hub-command-input-wrap"><Search size={17} /><input value={query} onChange={event => { setQuery(event.target.value); setWebResults([]); setSearchError(""); setCommandOpen(true); }} onFocus={() => setCommandOpen(true)} onKeyDown={event => { if (event.key === "Enter") runCommand(); }} placeholder={`Ask about ${activeMode === "all" ? "a topic or next step" : `${focusMode.label.toLowerCase()}...`}`} /><button onClick={runCommand} aria-label="Search"><ArrowRight size={17} /></button></div>
            <div className="hub-command-suggestions"><button onClick={() => { setQuery("What should I learn next?"); setCommandOpen(true); }}><Zap size={13} /> next step</button><button onClick={() => { setQuery("Find my skill gaps"); setCommandOpen(true); }}><Gauge size={13} /> skill gaps</button><button onClick={() => { setQuery("Give me a build project"); setCommandOpen(true); }}><Layers3 size={13} /> project idea</button></div>
            {commandOpen && <div className="hub-command-results"><div className="hub-results-heading"><span>{isResearching ? "SEARCHING WEB" : "SEARCH RESULTS"}</span><button onClick={() => setCommandOpen(false)} aria-label="Close search"><X size={14} /></button></div>{webResults.map(result => <a className="hub-search-result hub-web-result" key={result.url || result.title} href={result.url} target="_blank" rel="noreferrer"><span className="hub-result-icon hub-result-web"><Network size={14} /></span><span><strong>{result.title}</strong><small>{result.content?.slice(0, 110) || "Web result"}</small></span><ChevronRight size={14} /></a>)}{searchResults.map(item => <button className="hub-search-result" key={`${item.kind}-${item.title}`} onClick={() => openSearchResult(item)}><span className={`hub-result-icon hub-result-${item.kind}`}>{item.kind === "path" ? <Map size={14} /> : item.kind === "module" ? <BookOpen size={14} /> : <Network size={14} />}</span><span><strong>{item.title}</strong><small>{item.subtitle}</small></span><ChevronRight size={14} /></button>)}{searchError && <div className="hub-no-results">{searchError}</div>}{!searchResults.length && !webResults.length && !searchError && !isResearching && <div className="hub-no-results">No match. Try RAG, agents, cloud, or system design.</div>}</div>}
          </aside>
        </section>

        <div className="hub-mode-row"><span className="hub-mode-label">I WANT TO</span>{MODES.map(mode => <button key={mode.id} className={`hub-mode-pill ${activeMode === mode.id ? "active" : ""}`} onClick={() => { setActiveMode(mode.id); setSignalIndex(0); }}>{mode.icon}{mode.label}</button>)}<span className="hub-mode-description">{focusDescription}</span></div>

        <section className="hub-stat-strip"><div><span className="hub-stat-icon hub-stat-icon-green"><Activity size={15} /></span><span><b>{overallPercent}%</b><small>overall progress</small></span></div><div><span className="hub-stat-icon hub-stat-icon-cyan"><BookOpen size={15} /></span><span><b>{totalRemaining}</b><small>modules to explore</small></span></div><div><span className="hub-stat-icon hub-stat-icon-purple"><Flame size={15} /></span><span><b>{hubState.missions.length || 0}</b><small>active goals</small></span></div><div><span className="hub-stat-icon hub-stat-icon-amber"><ShieldCheck size={15} /></span><span><b>∞</b><small>ways to practise</small></span></div></section>

        <section className="hub-section hub-system-section"><div className="hub-section-heading"><div><span className="hub-kicker"><Compass size={13} /> YOUR LEARNING SYSTEM</span><h2>Choose the right surface for the moment.</h2></div><span className="hub-section-note">Roadmap → practice → ship.</span></div><div className="hub-system-grid"><article className="hub-path-card-large"><div className="hub-section-card-head"><span className="hub-card-kicker"><Map size={13} /> ACTIVE PATH</span><button className="hub-text-button" onClick={onOpenRoadmap}>Open roadmap <ArrowRight size={14} /></button></div><h3>{current?.name || "Build your first path"}</h3><p>{current ? `${current.stats.completed} of ${current.stats.total} modules complete. Keep the thread moving.` : "Choose a path to make your workspace personal."}</p><div className="hub-path-progress-line"><span style={{ width: `${current?.stats.percent || 0}%` }} /></div><div className="hub-path-card-foot"><span>{current?.stats.percent || 0}% explored</span><button onClick={continueLearning}>{nextNode ? "Continue" : "Get started"} <ArrowRight size={13} /></button></div><div className="hub-mini-path-list">{paths.slice(0, 3).map((item, index) => <button key={item.key} className={item.key === current?.key ? "selected" : ""} onClick={() => { setActivePath(item.key); onOpenRoadmap?.(); }}><span>0{index + 1}</span><strong>{item.name}</strong><small>{item.stats.percent}%</small></button>)}</div></article><div className="hub-surface-grid">{visibleActionItems.map((item, index) => <button className={`hub-surface-card hub-surface-${index + 1}`} key={item.label} onClick={item.onClick}><span className="hub-surface-icon">{item.icon}</span><span><strong>{item.label}</strong><small>{item.caption}</small></span><ArrowRight size={15} /></button>)}</div></div></section>

        <section className="hub-two-column hub-discovery-grid"><ExploreConceptPanel concepts={concepts} pathsData={pathsData} activePath={activePath} setActivePath={setActivePath} onContinue={onContinue} /><section className="hub-panel hub-mastery-panel"><div className="hub-panel-heading"><div><span className="hub-kicker"><Gauge size={13} /> SKILL SIGNAL</span><h2>Turn knowledge into range.</h2></div><button className="hub-text-button" onClick={onOpenProgress}>View all <ArrowRight size={14} /></button></div><p className="hub-panel-lede">The strongest engineers can understand, recall, apply, and explain.</p><div className="hub-mastery-list">{mastery.map(item => <div className="hub-mastery-row" key={item.label}><span className="hub-mastery-icon" style={{ color: item.color }}>{item.icon}</span><span className="hub-mastery-label"><strong>{item.label}</strong><small>{item.label === "Apply" ? "use it" : item.label === "Recall" ? "remember it" : item.label === "Explain" ? "teach it" : "understand it"}</small></span><div className="hub-mastery-bar"><span style={{ width: `${item.value}%`, background: item.color }} /></div><b style={{ color: item.color }}>{item.value}%</b></div>)}</div><div className="hub-mastery-callout"><Lightbulb size={16} /><span><strong>Try this today</strong><small>Explain your next topic in three sentences, then sketch one small example.</small></span></div></section></section>

        <section className="hub-two-column hub-resource-discovery-grid"><ManualTopicsPanel topics={manualTopics} onOpenTopic={openManualTopic} /><InterviewQuestionsPanel questions={randomInterviewQuestions} onOpenQuestion={openInterviewQuestion} /></section>

        <section className="hub-section hub-lab-section"><div className="hub-section-heading"><div><span className="hub-kicker"><Sparkles size={13} /> THE ACADEMY AT A GLANCE</span><h2>Build, think, and stay current.</h2></div><span className="hub-section-note">Different modes. One connected practice.</span></div><div className="hub-lab-grid"><button className="hub-lab-card hub-lab-card-build" onClick={() => onOpenPlayground?.()}><span className="hub-lab-number">01</span><span className="hub-lab-icon"><Layers3 size={18} /></span><span><strong>Build a real system</strong><small>Wire agents, memory, tools, and cloud patterns in the playground.</small></span><ArrowRight size={16} /></button><button className="hub-lab-card hub-lab-card-practice" onClick={() => onOpenDiscovery?.({ type: "interview" })}><span className="hub-lab-number">02</span><span className="hub-lab-icon"><MessageSquareText size={18} /></span><span><strong>Practise your thinking</strong><small>Sharpen the explanation before the interview, review, or launch.</small></span><ArrowRight size={16} /></button><button className="hub-lab-card hub-lab-card-research" style={{ "--signal-accent": signal.color }} onClick={openSignal}><span className="hub-lab-number">03</span><span className="hub-lab-icon"><Network size={18} /></span><span><strong>Follow the signal</strong><small>{signal.title} · {signal.body}</small></span><ArrowRight size={16} /></button></div></section>

        <section className="hub-section hub-mission-section"><div className="hub-section-heading"><div><span className="hub-kicker"><Target size={13} /> PERSONAL MISSIONS</span><h2>Give your curiosity a finish line.</h2></div><button className="hub-secondary-button" onClick={() => setShowMissionComposer(value => !value)}><Plus size={14} /> New goal</button></div>{showMissionComposer && <div className="hub-mission-composer"><input autoFocus value={missionDraft} onChange={event => setMissionDraft(event.target.value)} onKeyDown={event => { if (event.key === "Enter") createMission(); }} placeholder="e.g. Build a RAG assistant" /><button className="home-primary-button" onClick={createMission}>Create goal <ArrowRight size={14} /></button></div>}<div className="hub-mission-grid">{hubState.missions.map(mission => <article className="hub-mission-card" key={mission.id}><div className="hub-mission-card-top"><span className="hub-mission-icon"><Target size={16} /></span><span className="hub-status-dot" /></div><h3>{mission.title}</h3><p>{mission.goal}</p><div className="hub-mission-meter"><span style={{ width: `${mission.progress || 0}%` }} /></div><div className="hub-mission-foot"><span>{mission.progress || 0}% done</span><span className="hub-mission-ready">active</span></div></article>)}<button className="hub-mission-card hub-mission-empty" onClick={() => setShowMissionComposer(true)}><Plus size={20} /><span><strong>Start a goal</strong><small>Turn a project or deadline into a clear plan.</small></span><ArrowRight size={15} /></button></div></section>

        <section className="hub-section hub-shelf-section"><div className="hub-section-heading"><div><span className="hub-kicker"><Bookmark size={13} /> CONTINUE YOUR THREAD</span><h2>Pick up where you left off.</h2></div><span className="hub-section-note">Recent topics and tools, held in one place.</span></div><div className="hub-shelf-card" style={{ "--shelf-accent": shelfItem?.color || "#22d3ee" }}><div className="home-shelf-backdrop" aria-hidden="true" /><div className="home-shelf-content"><div className="home-shelf-type">{shelfItem?.type === "roadmap" ? "RECENTLY OPENED" : "SAVED FOR LATER"}</div><h2>{shelfItem?.title || "Start learning"}</h2><p>{shelfItem?.subtitle || "Choose a path to get started."}</p><button className="home-secondary-button home-shelf-button" onClick={() => openShelfItem(shelfItem)}>Open thread <ArrowRight size={14} /></button></div><div className="home-shelf-controls"><button onClick={() => setShelfIndex(index => (index - 1 + shelfItems.length) % shelfItems.length)} aria-label="Previous saved item">‹</button><button onClick={() => setShelfIndex(index => (index + 1) % shelfItems.length)} aria-label="Next saved item">›</button></div></div></section>

        <section className="hub-section hub-top-paths-section"><div className="hub-section-heading"><div><span className="hub-kicker"><Map size={13} /> TOP STUDY PATHS</span><h2>Choose your next long arc.</h2></div><span className="hub-section-note">Three routes worth exploring next.</span></div><div className="hub-top-paths-grid">{topStudyPaths.map((item, index) => <button className={`hub-top-path-card ${item.key === current?.key ? "selected" : ""}`} key={item.key} onClick={() => { setActivePath(item.key); onOpenRoadmap?.(); }}><span className="hub-top-path-number">0{index + 1}</span><span className="hub-top-path-icon"><Map size={17} /></span><span className="hub-top-path-copy"><strong>{item.name}</strong><small>{item.stats.total} modules · {item.stats.percent}% explored</small><span className="hub-top-path-meter"><i style={{ width: `${item.stats.percent}%` }} /></span></span><ArrowUpRight size={16} /></button>)}</div></section>
      </div>
    </div>
  );
}
