import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ArrowLeft, Check, X, HelpCircle, ChevronLeft, ChevronRight, Play, BookOpen, Layers, Search } from "lucide-react";
import { MANUAL_STRUCTURE } from "../data/manualData";
import { getCategoryIcon } from "./ManualTree";
import MermaidDiagram from "./MermaidDiagram";
import RunnableCodeBlock from "./RunnableCodeBlock";
import { executeCode } from "../services/jdoodleService";
import "../styles/Manual.css";

// Helper for deep equality in JSON exercise validation
function deepEqual(x, y) {
  if (x === y) return true;
  if (typeof x === "object" && x != null && typeof y === "object" && y != null) {
    if (Object.keys(x).length !== Object.keys(y).length) return false;
    for (let prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false;
      } else {
        return false;
      }
    }
    return true;
  }
  return false;
}

// Helper to extract frontmatter
function parseFrontmatter(text) {
  if (!text.startsWith("---")) return { meta: {}, body: text };
  const parts = text.split("---", 2);
  if (parts.length < 2) return { meta: {}, body: text };
  
  const frontmatterStr = parts[1];
  const body = text.slice(parts[0].length + frontmatterStr.length + 6);
  
  const meta = {};
  frontmatterStr.split("\n").forEach(line => {
    const idx = line.indexOf(":");
    if (idx > -1) {
      const key = line.substring(0, idx).trim();
      let val = line.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      meta[key] = val;
    }
  });
  
  return { meta, body };
}

// ── CODE EXERCISE WIDGET ───────────────────────────────────
function CodeExerciseWidget({ exercise }) {
  const [userCode, setUserCode] = useState(exercise.starterCode || "");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [error, setError] = useState(false);
  const [passed, setPassed] = useState(false);

  const handleRun = async () => {
    setIsExecuting(true);
    setOutput("Running tests...");
    setError(false);
    setPassed(false);
    
    // Combine user code with tests
    const testCode = (exercise.tests || []).map(t => t.code).join("\n");
    const fullScript = `${userCode}\n\n# --- TESTS ---\n${testCode}\nprint("ALL_TESTS_PASSED")`;
    
    // Map language for JDoodle
    const langMap = { python: "python3", js: "nodejs", javascript: "nodejs" };
    const mappedLang = langMap[exercise.language?.toLowerCase()] || "python3";

    try {
      const res = await executeCode({ script: fullScript, language: mappedLang });
      if (res.output && res.output.includes("ALL_TESTS_PASSED")) {
        setPassed(true);
        setOutput("✅ All tests passed!\n" + res.output.replace("ALL_TESTS_PASSED", "").trim());
      } else {
        setError(true);
        let cleanOutput = res.output || "";
        // Clean up JDoodle internal traceback boilerplate
        cleanOutput = cleanOutput.replace(/Traceback \(most recent call last\):\s*/g, '');
        cleanOutput = cleanOutput.replace(/File "\/home\/jdoodle\.py", line \d+, in <module>\s*/g, '');
        setOutput("❌ Tests failed.\n\n" + cleanOutput.trim());
      }
    } catch (err) {
      setError(true);
      setOutput("Error executing code:\n" + err.message);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="exercise-widget-card" style={{ marginBottom: 24 }}>
      <div className="exercise-widget-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Play size={10} fill="currentColor" />
          <span>PRACTICE EXERCISE ({exercise.language?.toUpperCase()})</span>
        </div>
      </div>
      
      {exercise.task && <div className="exercise-task-desc">{exercise.task}</div>}
      
      <div className="exercise-input-area" style={{ position: "relative" }}>
        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          spellCheck="false"
          style={{
            width: "100%",
            minHeight: 150,
            background: "rgba(0,0,0,0.3)",
            color: "#e5e7eb",
            fontFamily: "var(--mono)",
            fontSize: 13,
            padding: 16,
            border: "1px solid var(--border)",
            borderRadius: 8,
            resize: "vertical",
            outline: "none"
          }}
        />
        <button 
          onClick={handleRun}
          disabled={isExecuting}
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            background: isExecuting ? "var(--bg3)" : "rgba(0, 255, 136, 0.2)",
            color: isExecuting ? "var(--text3)" : "var(--neon)",
            border: isExecuting ? "1px solid var(--border)" : "1px solid rgba(0, 255, 136, 0.4)",
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            cursor: isExecuting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <Play size={12} fill="currentColor" /> {isExecuting ? "RUNNING..." : "RUN CODE"}
        </button>
      </div>

      {output && (
        <div style={{ 
          marginTop: 12, 
          padding: 12, 
          background: passed ? "rgba(0,255,136,0.05)" : "rgba(239,68,68,0.05)", 
          border: passed ? "1px solid rgba(0,255,136,0.2)" : "1px solid rgba(239,68,68,0.2)",
          borderRadius: 8,
          color: passed ? "var(--neon)" : "#ef4444",
          fontFamily: "var(--mono)",
          fontSize: 12,
          whiteSpace: "pre-wrap"
        }}>
          {output}
        </div>
      )}

      {exercise.hints && exercise.hints.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {hintIndex < 0 ? (
            <button 
              onClick={() => setHintIndex(0)}
              style={{ background: "transparent", border: "none", color: "var(--text3)", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}
            >
              Need a hint?
            </button>
          ) : (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>
                Hint {hintIndex + 1} of {exercise.hints.length}
              </div>
              <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 12 }}>
                {exercise.hints[hintIndex]}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {hintIndex > 0 && (
                  <button onClick={() => setHintIndex(i => i - 1)} style={{ padding: "4px 8px", background: "transparent", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text2)", fontSize: 11, cursor: "pointer" }}>
                    Previous
                  </button>
                )}
                {hintIndex < exercise.hints.length - 1 && (
                  <button onClick={() => setHintIndex(i => i + 1)} style={{ padding: "4px 8px", background: "rgba(255,255,255,0.1)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 11, cursor: "pointer" }}>
                    Next Hint
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── INTERACTIVE QUIZ COMPONENT ─────────────────────────────
function InteractiveQuiz({ questions }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  
  if (!questions || !questions.length) return null;
  const currentQuestion = questions[currentIdx];
  const selectedChoice = selectedAnswers[currentIdx];
  const hasAnswered = selectedChoice !== undefined;
  
  const handleSelect = (choiceIdx) => {
    if (hasAnswered) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIdx]: choiceIdx
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const isCorrect = selectedChoice === currentQuestion.answer;

  return (
    <div className="quiz-widget-card">
      <div className="quiz-widget-title">
        <HelpCircle size={12} />
        <span>CHECK YOUR UNDERSTANDING ({currentIdx + 1} of {questions.length})</span>
      </div>
      
      <div className="quiz-question-container">
        <div className="quiz-question-text">{currentQuestion.q}</div>
        <div className="quiz-choices-list">
          {currentQuestion.choices.map((choice, i) => {
            let className = "quiz-choice-button";
            if (hasAnswered) {
              if (i === currentQuestion.answer) {
                className += " selected-correct";
              } else if (i === selectedChoice) {
                className += " selected-wrong";
              }
            }
            return (
              <button
                key={i}
                className={className}
                onClick={() => handleSelect(i)}
                disabled={hasAnswered}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </div>

      {hasAnswered && (
        <div className={`quiz-feedback-box ${isCorrect ? "correct" : "wrong"}`}>
          <div style={{ fontWeight: 800, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
            {isCorrect ? <Check size={14} color="var(--neon)" /> : <X size={14} color="#ef4444" />}
            {isCorrect ? "CORRECT!" : "INCORRECT"}
          </div>
          <div>{currentQuestion.explain}</div>
        </div>
      )}

      <div className="quiz-navigation-row">
        <span>Question {currentIdx + 1} of {questions.length}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="quiz-nav-btn" onClick={handlePrev} disabled={currentIdx === 0}>
            <ChevronLeft size={12} style={{ display: "inline", marginRight: 4 }} /> Prev
          </button>
          <button className="quiz-nav-btn" onClick={handleNext} disabled={currentIdx === questions.length - 1}>
            Next <ChevronRight size={12} style={{ display: "inline", marginLeft: 4 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── INTERACTIVE EXERCISE COMPONENT ─────────────────────────
function InteractiveExercise({ exercise }) {
  const [userInput, setUserInput] = useState("");

  if (!exercise) return null;

  const validation = React.useMemo(() => {
    if (!userInput.trim()) return { allPassed: false, results: [] };
    
    if (exercise.type === "regex") {
      try {
        let pattern = userInput;
        if (pattern.startsWith("/") && pattern.endsWith("/")) {
          pattern = pattern.slice(1, -1);
        } else if (pattern.startsWith("/") && pattern.substring(1).includes("/")) {
          const lastSlash = pattern.lastIndexOf("/");
          const flags = pattern.substring(1, lastSlash) ? pattern.substring(lastSlash + 1) : "";
          pattern = pattern.substring(1, lastSlash);
          const rx = new RegExp(pattern, flags);
          const results = [];
          
          (exercise.mustMatch || []).forEach(val => {
            results.push({ val, shouldMatch: true, passed: rx.test(val) });
          });
          (exercise.mustNotMatch || []).forEach(val => {
            results.push({ val, shouldMatch: false, passed: !rx.test(val) });
          });
          const allPassed = results.every(r => r.passed);
          return { allPassed, results };
        }

        const rx = new RegExp(pattern);
        const results = [];
        (exercise.mustMatch || []).forEach(val => {
          results.push({ val, shouldMatch: true, passed: rx.test(val) });
        });
        (exercise.mustNotMatch || []).forEach(val => {
          results.push({ val, shouldMatch: false, passed: !rx.test(val) });
        });
        const allPassed = results.every(r => r.passed);
        return { allPassed, results };
      } catch (err) {
        return { allPassed: false, results: [], error: err.message };
      }
    } else if (exercise.type === "json") {
      try {
        const parsed = JSON.parse(userInput);
        const allPassed = deepEqual(parsed, exercise.expected);
        return { allPassed, results: [] };
      } catch (err) {
        return { allPassed: false, results: [], error: "Invalid JSON format" };
      }
    }

    return { allPassed: false, results: [] };
  }, [userInput, exercise]);

  return (
    <div className="exercise-widget-card">
      <div className="exercise-widget-header">
        <Play size={10} fill="currentColor" />
        <span>PRACTICE EXERCISE ({exercise.type.toUpperCase()})</span>
      </div>
      
      <div className="exercise-task-desc">{exercise.task}</div>
      
      <div className="exercise-input-area">
        {exercise.type === "json" ? (
          <textarea
            placeholder='Type JSON here... e.g. { "name": "Ada", "roles": ["admin", "author"] }'
            className="exercise-text-input"
            style={{ height: 100, resize: "vertical" }}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        ) : (
          <input
            type="text"
            placeholder="Type regex pattern here..."
            className="exercise-text-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        )}
      </div>

      {validation.error && (
        <div style={{ fontSize: 11, color: "#ef4444", marginBottom: 12, fontFamily: "var(--mono)" }}>
          {validation.error}
        </div>
      )}

      {exercise.type === "regex" && validation.results.length > 0 && (
        <div className="exercise-status-grid">
          {validation.results.map((res, i) => (
            <div key={i} className={`exercise-status-item ${res.passed ? "passing" : "failing"}`}>
              <span className="exercise-status-dot" />
              <span style={{ overflow: "hidden", textOutline: "none", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {res.shouldMatch ? "Must Match: " : "Must NOT Match: "} `{res.val}`
              </span>
            </div>
          ))}
        </div>
      )}

      {validation.allPassed && (
        <div className="exercise-success-banner">
          <Check size={16} />
          <span>EXERCISE COMPLETED SUCCESSFULLY! Perfect solution.</span>
        </div>
      )}

      {exercise.hint && !validation.allPassed && (
        <div className="exercise-hint-box">
          <strong>HINT:</strong> {exercise.hint}
        </div>
      )}
    </div>
  );
}

// ── PLAYGROUND JSON COMPONENT ──────────────────────────────
function PlaygroundJson() {
  const [code, setCode] = useState('{\n  "name": "Ada",\n  "age": 30,\n  "role": "engineer"\n}');
  const [feedback, setFeedback] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(code);
      setCode(JSON.stringify(parsed, null, 2));
      setFeedback("Formatted successfully.");
      setIsValid(true);
    } catch (err) {
      setFeedback("Cannot format: " + err.message);
      setIsValid(false);
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(code);
      setCode(JSON.stringify(parsed));
      setFeedback("Minified successfully.");
      setIsValid(true);
    } catch (err) {
      setFeedback("Cannot minify: " + err.message);
      setIsValid(false);
    }
  };

  const handleChange = (val) => {
    setCode(val);
    if (!val.trim()) {
      setFeedback("");
      setIsValid(true);
      return;
    }
    try {
      JSON.parse(val);
      setFeedback("Valid JSON");
      setIsValid(true);
    } catch (err) {
      setFeedback("Invalid: " + err.message);
      setIsValid(false);
    }
  };

  return (
    <div className="playground-json-card">
      <div className="playground-json-header">
        <div className="playground-json-title">LIVE JSON PLAYGROUND</div>
        <div className="playground-json-controls">
          <button className="playground-json-btn" onClick={handleFormat}>Format</button>
          <button className="playground-json-btn" onClick={handleMinify}>Minify</button>
        </div>
      </div>
      <textarea
        className={`playground-json-textarea ${!isValid ? "invalid" : ""}`}
        value={code}
        onChange={(e) => handleChange(e.target.value)}
      />
      <div className={`playground-json-feedback ${isValid ? "success" : "error"}`}>
        {feedback}
      </div>
    </div>
  );
}

const getCategoryColor = (slug) => {
  const colors = {
    "logic": "#e879f9",
    "mathematics": "#0088ff",
    "physics": "#fb923c",
    "operating-systems": "#00ff88",
    "hardware": "#ef4444",
    "networking": "#06b6d4",
    "programming-concepts": "#6366f1",
    "programming-languages": "#10b981",
    "web-fundamentals": "#f43f5e",
    "frameworks": "#8b5cf6",
    "version-control": "#f59e0b",
    "debugging": "#ef4444",
    "testing": "#10b981",
    "databases": "#3b82f6",
    "data-analytics": "#06b6d4",
    "apis": "#8b5cf6",
    "architecture": "#6366f1",
    "devops": "#10b981",
    "infrastructure": "#3b82f6",
    "performance": "#f59e0b",
    "security": "#ef4444",
    "ai-ml": "#8b5cf6",
    "working-with-ai": "#00ff88",
    "no-code": "#6366f1",
    "tooling": "#3b82f6",
    "projects": "#00ff88",
    "working-as-a-developer": "#fb923c",
    "practice": "#00ff88"
  };
  return colors[slug] || "#00ff88";
};

// ── MAIN MANUAL VIEWER PANEL ───────────────────────────────
export default function ManualViewer({ activePhase, onSelectPhase, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fontStyle, setFontStyle] = useState("sans");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollContainerRef = useRef(null);

  // Auto-sync selectedCategory state when activePhase updates (e.g. from Sidebar)
  useEffect(() => {
    if (activePhase) {
      const cat = MANUAL_STRUCTURE.find(c => c.slug === activePhase.categorySlug);
      if (cat) {
        setSelectedCategory(cat);
      }
    }
  }, [activePhase]);

  // Fetch phase content
  useEffect(() => {
    if (!activePhase || !activePhase.filePath) return;
    
    setLoading(true);
    setError(null);
    setContent("");

    fetch(activePhase.filePath)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load file: ${res.statusText}`);
        return res.text();
      })
      .then(text => {
        const { body } = parseFrontmatter(text);
        setContent(body);
        setLoading(false);
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      })
      .catch(err => {
        console.error(err);
        setError(`Error loading guide: ${err.message}`);
        setLoading(false);
      });
  }, [activePhase]);

  // Intercept relative links for SPA navigation
  const handleAnchorClick = useCallback((e, href) => {
    if (!href) return;
    if (href.startsWith("http") || href.startsWith("//")) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    
    e.preventDefault();

    const cleanHref = href.replace(/^\.\//, "");
    if (cleanHref.endsWith(".md")) {
      const phaseSlug = cleanHref.replace(/\.md$/, "");
      const category = MANUAL_STRUCTURE.find(c => c.slug === activePhase.categorySlug);
      if (category) {
        const guide = category.guides.find(g => g.slug === activePhase.guideSlug);
        if (guide) {
          const phase = guide.phases.find(p => p.slug === phaseSlug);
          if (phase) {
            onSelectPhase({
              categorySlug: activePhase.categorySlug,
              guideSlug: activePhase.guideSlug,
              phaseSlug: phase.slug,
              filePath: phase.filePath,
              title: phase.title
            });
            return;
          }
        }
      }
    }
    
    const parts = href.split("/").filter(Boolean);
    const lastSlug = parts[parts.length - 1];
    
    for (let cat of MANUAL_STRUCTURE) {
      const guide = cat.guides.find(g => g.slug === lastSlug || g.slug === lastSlug.replace(".md", ""));
      if (guide && guide.phases.length > 0) {
        const firstPhase = guide.phases[0];
        onSelectPhase({
          categorySlug: cat.slug,
          guideSlug: guide.slug,
          phaseSlug: firstPhase.slug,
          filePath: firstPhase.filePath,
          title: firstPhase.title
        });
        return;
      }
    }

    console.warn("Unhandled manual link routing:", href);
  }, [activePhase, onSelectPhase]);

  const resolveImageSrc = useCallback((src) => {
    if (!src) return "";
    if (src.startsWith("http") || src.startsWith("/") || src.startsWith("data:")) {
      return src;
    }
    const cleanSrc = src.replace(/^\.\//, "");
    return `/guides/${activePhase.categorySlug}/${activePhase.guideSlug}/${cleanSrc}`;
  }, [activePhase]);

  // Determine total guides in a category for Grid display
  const getGuidesCount = (cat) => {
    return cat.guides.length;
  };

  // ── VIEW 1: BENTO GRID OF ALL TOPICS ─────────────────────
  if (!activePhase && !selectedCategory) {
    const filteredCategories = MANUAL_STRUCTURE.map(cat => {
      const q = searchQuery.toLowerCase();
      if (!q) return cat;
      if (cat.name.toLowerCase().includes(q) || cat.blurb.toLowerCase().includes(q)) return cat;
      const matchingGuides = cat.guides.filter(guide => 
        guide.title.toLowerCase().includes(q) || guide.summary.toLowerCase().includes(q)
      );
      if (matchingGuides.length > 0) return { ...cat, guides: matchingGuides };
      return null;
    }).filter(Boolean);

    return (
      <div className="manual-viewer-panel">
        <div className="manual-viewer-header">
          <button className="manual-back-btn" onClick={onClose}>
            <ArrowLeft size={14} /> CLOSE MANUAL
          </button>
          <div className="manual-viewer-meta">
            <span className="manual-badge neon-glow">THE MISSING MANUAL</span>
          </div>
        </div>

        <div className="manual-viewer-body" ref={scrollContainerRef}>
          <div style={{ width: "100%", margin: "0 auto", paddingBottom: 40 }}>
            <div style={{ marginBottom: 24, textAlign: "left" }}>
              <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1px", color: "var(--text)", marginBottom: 8 }}>
                The Missing Manual for Developers
              </h1>
              <p style={{ color: "var(--text3)", fontSize: 14, margin: 0, marginBottom: 16 }}>
                Clear, in-depth guides to how software works — from how computers boot to networks, databases, and AI.
              </p>
              <div style={{ position: "relative", maxWidth: 400 }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text2)" }} />
                <input 
                  type="text" 
                  placeholder="Search guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 16px 10px 36px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg3)",
                    color: "var(--text)",
                    outline: "none",
                    fontFamily: "var(--font-sans)"
                  }}
                />
              </div>
            </div>

            {filteredCategories.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--text3)", padding: "40px 0" }}>
                No guides found matching "{searchQuery}"
              </div>
            ) : (
              <div className="manual-grid">
                {filteredCategories.map((cat) => (
                  <div 
                    key={cat.slug} 
                    className="manual-topic-card"
                    style={{ "--topic-color": getCategoryColor(cat.slug) }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <div className="manual-card-header">
                      <div className="manual-card-icon">
                        {getCategoryIcon(cat.slug)}
                      </div>
                      <span className="manual-card-count">
                        {getGuidesCount(cat)} guides
                      </span>
                    </div>
                    <h3 className="manual-card-title">{cat.name}</h3>
                    <p className="manual-card-blurb">{cat.blurb}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── VIEW 2: CATEGORY VIEW (GUIDES & PHASES LIST) ─────────
  if (!activePhase && selectedCategory) {
    return (
      <div className="manual-viewer-panel">
        <div className="manual-viewer-header">
          <button className="manual-back-btn" onClick={() => setSelectedCategory(null)}>
            <ArrowLeft size={14} /> BACK TO TOPICS
          </button>
          <button className="manual-back-btn" onClick={onClose} style={{ marginLeft: "auto" }}>
            CLOSE MANUAL
          </button>
        </div>

        <div className="manual-viewer-body" ref={scrollContainerRef}>
          <div style={{ width: "100%", margin: "0 auto", paddingBottom: 40 }} className="manual-category-view">
            <div className="manual-category-view-header">
              <div className="manual-category-view-title">
                <span style={{ color: "var(--neon)", display: "flex", alignItems: "center" }}>
                  {getCategoryIcon(selectedCategory.slug)}
                </span>
                <span>{selectedCategory.name}</span>
              </div>
              <p className="manual-category-view-blurb">{selectedCategory.blurb}</p>
            </div>

            <div className="manual-guides-grid">
              {selectedCategory.guides.map((guide) => (
                <div key={guide.slug} className="manual-guide-section">
                  <h3 className="manual-guide-section-title">{guide.title}</h3>
                  {guide.summary && <p className="manual-guide-section-summary">{guide.summary}</p>}
                  
                  <div className="manual-phases-grid">
                    {guide.phases.map((phase) => (
                      <div 
                        key={phase.slug} 
                        className="manual-phase-card"
                        onClick={() => onSelectPhase({
                          categorySlug: selectedCategory.slug,
                          guideSlug: guide.slug,
                          phaseSlug: phase.slug,
                          filePath: phase.filePath,
                          title: phase.title
                        })}
                      >
                        <span className="manual-phase-card-num">Phase {phase.phaseNum}</span>
                        <h4 className="manual-phase-card-title">{phase.title}</h4>
                        {phase.summary && <p className="manual-phase-card-summary">{phase.summary}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── VIEW 3: PHASE CONTENT VIEW (MARKDOWN READING) ────────
  return (
    <div className="manual-viewer-panel">
      <div className="manual-viewer-header">
        <button className="manual-back-btn" onClick={() => onSelectPhase(null)}>
          <ArrowLeft size={14} /> BACK TO GUIDE
        </button>
        <button className="manual-back-btn" onClick={onClose} style={{ marginLeft: 24 }}>
          CLOSE MANUAL
        </button>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px" }}>
          <select 
            value={fontStyle}
            onChange={(e) => setFontStyle(e.target.value)}
            className="manual-font-select"
          >
            <option value="sans">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="mono">Monospace</option>
          </select>
          <div className="manual-viewer-meta">
            <span className="manual-badge neon-glow">{activePhase.categorySlug.replace("-", " ")}</span>
            <span className="manual-badge cobalt-glow">Phase {activePhase.phaseSlug.split("-")[0] || "1"}</span>
          </div>
        </div>
      </div>

      <div className="manual-viewer-body" ref={scrollContainerRef}>
        <div className="manual-content-container">
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 0", gap: 16 }}>
              <div className="loading-orb" style={{ width: 32, height: 32, border: "2px solid var(--neon)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: 13, color: "var(--text3)" }}>Loading manual phase...</span>
            </div>
          ) : error ? (
            <div style={{ padding: "40px 24px", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.2)", background: "rgba(239, 68, 68, 0.02)", borderRadius: 12 }}>
              <X size={32} color="#ef4444" style={{ margin: "0 auto 12px" }} />
              <div style={{ fontSize: 14, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>{error}</div>
              <button 
                onClick={() => setContent("")}
                style={{ padding: "6px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: 11, cursor: "pointer" }}
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <div className={`manual-markdown-body font-${fontStyle}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !match;
                    const text = String(children).replace(/\n$/, "");
                    
                    if (match && match[1] === "quiz") {
                      try {
                        const parsed = JSON.parse(text);
                        return <InteractiveQuiz questions={parsed} />;
                      } catch (err) {
                        return <div style={{ color: "#ef4444", fontSize: 11 }}>Failed to render Quiz JSON: {err.message}</div>;
                      }
                    }
                    
                    if (match && (match[1] === "exercise" || match[1] === "lesson" || match[1] === "json")) {
                      try {
                        const parsed = JSON.parse(text);
                        const exerciseData = Array.isArray(parsed) ? parsed[0] : parsed;
                        
                        if (exerciseData.language && exerciseData.starterCode !== undefined) {
                          return <CodeExerciseWidget exercise={exerciseData} />;
                        } else if (exerciseData.type) {
                          return <InteractiveExercise exercise={exerciseData} />;
                        } else {
                          // Fallback to syntax highlighting if it's just regular JSON
                          return !isInline ? (
                            <RunnableCodeBlock language={match[1]} code={text} {...props} />
                          ) : (
                            <code className={className} {...props}>{children}</code>
                          );
                        }
                      } catch (err) {
                        // If it's not valid JSON, fallback to syntax highlighting
                        return !isInline ? (
                          <RunnableCodeBlock language={match[1]} code={text} {...props} />
                        ) : (
                          <code className={className} {...props}>{children}</code>
                        );
                      }
                    }

                    if (match && match[1] === "playground-json") {
                      return <PlaygroundJson />;
                    }

                    if (match && match[1] === "mermaid") {
                      return <MermaidDiagram chart={text} />;
                    }

                    return !isInline ? (
                      <RunnableCodeBlock
                        language={match[1]}
                        code={text}
                        {...props}
                      />
                    ) : (
                      <code className="manual-inline-code" {...props}>
                        {children}
                      </code>
                    );
                  },
                  a: ({ node, href, children, ...props }) => (
                    <a 
                      href={href} 
                      onClick={(e) => handleAnchorClick(e, href)} 
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  img: ({ node, src, alt, ...props }) => (
                    <img
                      src={resolveImageSrc(src)}
                      alt={alt}
                      {...props}
                    />
                  ),
                  h1: ({ node, ...props }) => <h1 {...props} />,
                  h2: ({ node, ...props }) => <h2 {...props} />,
                  h3: ({ node, ...props }) => <h3 {...props} />,
                  p: ({ node, ...props }) => <p {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote {...props} />,
                  ul: ({ node, ...props }) => <ul {...props} />,
                  ol: ({ node, ...props }) => <ol {...props} />,
                  li: ({ node, ...props }) => <li {...props} />
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
