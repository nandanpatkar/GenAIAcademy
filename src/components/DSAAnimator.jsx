import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ChevronDown, ChevronUp, PanelLeft, Clapperboard, PlaySquare, Lightbulb, AlertTriangle, BookMarked, Terminal } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ── Full sitemap mapping ──────────────────────────────────────────────────────
import { CATEGORIES } from "./dsaData";
import { CODE_TRICKS_SECTIONS } from "./dsaTricks";
import { EDGE_CASE_SECTIONS } from "./dsaEdgeCases";

const BASE_URL = "https://dsaanimator.com/viz/problems";

const DIFF_COLORS = {
  Easy:   { text: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.2)"  },
  Medium: { text: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.2)"  },
  Hard:   { text: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)" },
};

function DiffBadge({ diff }) {
  const c = DIFF_COLORS[diff] || DIFF_COLORS.Medium;
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 4,
      color: c.text, background: c.bg, border: `1px solid ${c.border}`,
      letterSpacing: ".4px", textTransform: "uppercase", flexShrink: 0,
    }}>{diff}</span>
  );
}

export default function DSAAnimator({ onClose }) {
  const totalProblems = CATEGORIES.reduce((s, c) => s + c.problems.length, 0);

  const [search, setSearch]           = useState("");
  const [activeCat, setActiveCat]     = useState(null);   // null = all
  const [activeProblem, setActiveProblem] = useState(null);
  const [activeTab, setActiveTab] = useState("problems"); // "problems", "tricks", "edge_cases"
  const [hoveredTab, setHoveredTab] = useState(null);
  const [expanded, setExpanded]       = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
  const iframeRef = useRef(null);

  // Compute filtered list
  const filtered = CATEGORIES.map(cat => ({
    ...cat,
    problems: cat.problems.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => {
    if (activeCat && cat.id !== activeCat) return false;
    return cat.problems.length > 0;
  });

  const iframeUrl = activeProblem
    ? `${BASE_URL}/${activeProblem.catId}/${activeProblem.id}`
    : null;

  const handleProblemClick = (cat, problem) => {
    setActiveProblem({ ...problem, catId: cat.id, catLabel: cat.label, catColor: cat.color });
  };

  const toggleCat = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
      background: "var(--bg)", color: "var(--text)",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }}>

      {/* ── Top Header ───────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 20px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg2)", flexShrink: 0,
      }}>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          title="Toggle Sidebar"
          style={{
            background: showSidebar ? "var(--bg3)" : "transparent",
            border: "1px solid " + (showSidebar ? "var(--border)" : "transparent"),
            color: showSidebar ? "var(--text)" : "var(--text3)",
            cursor: "pointer", borderRadius: 6, width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .15s",
          }}
          onMouseEnter={e=>{ e.currentTarget.style.color="var(--text)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.color=showSidebar ? "var(--text)" : "var(--text3)"; }}
        >
          <PanelLeft size={16} />
        </button>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fbbf24", flexShrink: 0,
        }}>
          <Clapperboard size={18} strokeWidth={2.5} />
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.5px", fontFamily: "var(--font)", color: "var(--text)" }}>
            DSA Animator
          </div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>
            {totalProblems} animated visualizations
          </div>
        </div>

        {/* Stats pills */}
        <div style={{ marginLeft: 16, display: "flex", gap: 6 }}>
          {[
            { label: "Easy",   color: "#34d399", count: CATEGORIES.flatMap(c=>c.problems).filter(p=>p.difficulty==="Easy").length },
            { label: "Medium", color: "#fbbf24", count: CATEGORIES.flatMap(c=>c.problems).filter(p=>p.difficulty==="Medium").length },
            { label: "Hard",   color: "#f87171", count: CATEGORIES.flatMap(c=>c.problems).filter(p=>p.difficulty==="Hard").length },
          ].map(s => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 5,
              background: s.color + "11", border: `1px solid ${s.color}33`,
              color: s.color,
            }}>
              <span>{s.count}</span>
              <span style={{ opacity: .6, fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div 
          style={{ 
            marginLeft: "auto", 
            display: "flex", 
            background: "rgba(255, 255, 255, 0.03)", 
            padding: "4px", 
            borderRadius: "12px", 
            gap: "4px", 
            border: "1px solid rgba(255, 255, 255, 0.08)",
            position: "relative",
            backdropFilter: "blur(10px)"
          }}
          onMouseLeave={() => setHoveredTab(null)}
        >
          {/* Ghost Hover Indicator */}
          <AnimatePresence>
            {hoveredTab && (
              <motion.div
                layoutId="hoverIndicator_dsa"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  position: "absolute",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                  zIndex: 0,
                  pointerEvents: "none"
                }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {[
            { id: "problems", label: "Problems", icon: <PlaySquare size={14} />, color: "#fbbf24" },
            { id: "tricks", label: "Code Tricks", icon: <Lightbulb size={14} />, color: "#34d399" },
            { id: "edge_cases", label: "Edge Cases", icon: <AlertTriangle size={14} />, color: "#f87171" }
          ].map(t => {
            const active = activeTab === t.id;
            return (
              <motion.button 
                key={t.id} 
                onClick={() => setActiveTab(t.id)}
                onMouseEnter={() => setHoveredTab(t.id)}
                style={{
                  background: "transparent",
                  color: active ? "#fff" : "rgba(255, 255, 255, 0.4)",
                  border: "none",
                  padding: "6px 16px", 
                  borderRadius: "8px", 
                  fontSize: 12, 
                  fontWeight: 700,
                  cursor: "pointer", 
                  transition: "color .3s ease", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 6,
                  position: "relative",
                  zIndex: 1
                }}
              >
                {active && (
                  <motion.div
                    layoutId="activeTabPill_dsa"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)`,
                      borderRadius: "8px",
                      boxShadow: `0 4px 12px ${t.color}33`,
                      zIndex: -1
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.span 
                  animate={{ 
                    scale: active ? 1.1 : 1,
                    color: active ? "#fff" : "rgba(255, 255, 255, 0.4)"
                  }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {t.icon}
                </motion.span> 
                {t.label}
              </motion.button>
            );
          })}
        </div>

        <div style={{ marginLeft: 16, display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7,
            background: "var(--bg4)", border: "1px solid var(--border)",
            color: "var(--text3)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .15s",
          }}
            onMouseEnter={e=>{ e.currentTarget.style.background="var(--bg5)"; e.currentTarget.style.color="var(--text)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="var(--bg4)"; e.currentTarget.style.color="var(--text3)"; }}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {activeTab !== "problems" ? (
          <div style={{ flex: 1, overflowY: "auto", padding: 32, background: "var(--bg)" }}>
             <CustomDataGrid sections={activeTab === "tricks" ? CODE_TRICKS_SECTIONS : EDGE_CASE_SECTIONS} />
          </div>
        ) : (
          <>
            {/* ── Left Panel: Problem Browser ─────────────────────────────── */}
            {showSidebar && (
          <div style={{
            width: 300, minWidth: 300, background: "var(--bg2)",
            borderRight: "1px solid var(--border)",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>

          {/* Search + filter */}
          <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "var(--bg3)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "6px 10px", marginBottom: 8,
            }}>
              <Search size={12} style={{ color: "var(--text3)", flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search problems…"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "var(--text)", fontSize: 12, fontFamily: "inherit",
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{
                  background: "none", border: "none", color: "var(--text3)",
                  cursor: "pointer", display: "flex", alignItems: "center",
                }}>
                  <X size={11} />
                </button>
              )}
            </div>

          </div>

          {/* Problem list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
            {filtered.length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: "var(--text3)", fontSize: 12 }}>
                No problems match "{search}"
              </div>
            )}
            {filtered.map(cat => (
              <div key={cat.id}>
                {/* Category header */}
                <button
                  onClick={() => toggleCat(cat.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 16px", background: "transparent",
                    border: "none", borderBottom: "1px solid var(--border)",
                    cursor: "pointer", color: "var(--text2)", textAlign: "left",
                  }}
                >
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: "var(--text)", fontFamily: "var(--font)" }}>
                    {cat.label}
                  </span>
                  <span style={{
                    fontSize: 9, color: "var(--text3)", fontWeight: 600,
                    background: "var(--bg4)", padding: "1px 6px", borderRadius: 4,
                  }}>{cat.problems.length}</span>
                  {expanded[cat.id]
                    ? <ChevronUp size={11} style={{ color: "var(--text3)" }} />
                    : <ChevronDown size={11} style={{ color: "var(--text3)" }} />
                  }
                </button>

                {/* Problems */}
                {expanded[cat.id] && cat.problems.map(prob => {
                  const isActive = activeProblem?.id === prob.id && activeProblem?.catId === cat.id;
                  return (
                    <button
                      key={prob.id}
                      onClick={() => handleProblemClick(cat, prob)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 8,
                        padding: "8px 14px 8px 24px",
                        background: isActive ? "var(--bg3)" : "transparent",
                        border: "none",
                        borderLeft: isActive ? `3px solid var(--neon)` : "3px solid transparent",
                        cursor: "pointer", textAlign: "left",
                        transition: "all .12s",
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg3)"; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{
                        flex: 1, fontSize: 11, fontWeight: isActive ? 700 : 500,
                        color: isActive ? "var(--text)" : "var(--text2)",
                        lineHeight: 1.35, transition: "color .12s",
                      }}>{prob.title}</span>
                      <DiffBadge diff={prob.difficulty} />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        )}

        {/* ── Right: iframe / placeholder ─────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {activeProblem ? (
            <>
              {/* Problem header bar */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 16px", borderBottom: "1px solid var(--border)",
                background: "var(--bg2)", flexShrink: 0,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{activeProblem.title}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)" }}>{activeProblem.catLabel}</div>
                </div>
                <DiffBadge diff={activeProblem.difficulty} />
              </div>

              {/* iframe container with negative margin to hide external header */}
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <iframe
                  ref={iframeRef}
                  key={iframeUrl}
                  src={iframeUrl}
                  title={activeProblem.title}
                  style={{
                    width: "100%",
                    height: "calc(100% + 62px)",
                    marginTop: -62,
                    border: "none",
                    background: "#0a0a0c",
                  }}
                  allow="fullscreen"
                />
              </div>
            </>
          ) : (
            /* Empty state */
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 16, color: "var(--text3)",
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: "rgba(251,191,36,0.07)",
                border: "1px solid rgba(251,191,36,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fbbf24",
              }}>
                <Clapperboard size={34} strokeWidth={1.5} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text2)", marginBottom: 6, fontFamily: "var(--font)" }}>
                  Select a Problem to Animate
                </div>
                <div style={{ fontSize: 12, maxWidth: 320, lineHeight: 1.6 }}>
                  Choose any of the <strong style={{ color: "var(--text)" }}>{totalProblems} problems</strong> from the left panel
                  to watch a step-by-step visual animation.
                </div>
              </div>

              {/* Quick start: featured problems */}
              <div style={{
                marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 480
              }}>
                {[
                  { catId: "arrays", id: "1-two-sum", title: "Two Sum", diff: "Easy" },
                  { catId: "linkedlist", id: "206-reverse-linked-list", title: "Reverse Linked List", diff: "Easy" },
                  { catId: "dp", id: "70-climbing-stairs", title: "Climbing Stairs", diff: "Easy" },
                  { catId: "tree", id: "226-invert-binary-tree", title: "Invert Binary Tree", diff: "Easy" },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => handleProblemClick({ id: f.catId }, f)}
                    style={{
                      display: "flex", alignItems: "center", gap: 7,
                      padding: "8px 12px", borderRadius: 9,
                      background: "var(--bg3)", border: "1px solid var(--border)",
                      color: "var(--text2)", cursor: "pointer", fontSize: 11,
                      fontWeight: 600, fontFamily: "inherit", transition: "all .15s",
                    }}
                    onMouseEnter={e=>{ e.currentTarget.style.background="var(--bg4)"; e.currentTarget.style.color="var(--text)"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="var(--bg3)"; e.currentTarget.style.color="var(--text2)"; }}
                  >
                    <span>{f.title}</span>
                    <DiffBadge diff={f.diff} />
                  </button>
                ))}
              </div>

            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
}

function CustomDataGrid({ sections }) {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32, paddingBottom: 64 }}>
      {sections.map(sec => (
        <div key={sec.id}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ color: "var(--neon)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg3)", width: 40, height: 40, borderRadius: 10, border: "1px solid var(--border)" }}>
              <BookMarked size={20} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>{sec.title}</div>
              <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>{sec.subtitle}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {sec.cards.map((card, i) => (
              <div key={i} style={{
                background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12,
                overflow: "hidden", display: "flex", flexDirection: "column", height: "100%"
              }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg3)", display: "flex", alignItems: "center", gap: 8 }}>
                  <Terminal size={14} style={{ color: "var(--text3)" }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", flex: 1 }}>{card.title}</span>
                  {card.tag && <span style={{ fontSize: 10, background: "rgba(255,255,255,0.05)", padding: "2px 6px", borderRadius: 4, color: "var(--text3)" }}>{card.tag}</span>}
                </div>
                <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                  {card.bug && (
                    <div style={{ fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
                      <span style={{ color: "#f87171", fontWeight: 700 }}>Bug:</span> {card.bug}
                    </div>
                  )}
                  {card.fix && (
                    <div style={{ fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
                      <span style={{ color: "#34d399", fontWeight: 700 }}>Fix:</span> {card.fix}
                    </div>
                  )}
                  <SyntaxHighlighter
                    language="python"
                    style={atomDark}
                    customStyle={{
                      margin: 0, padding: 12, background: "#060608",
                      borderRadius: 6, fontSize: 11, fontFamily: "monospace", overflowX: "auto",
                      border: "1px solid rgba(255,255,255,0.05)"
                    }}
                  >
                    {card.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
