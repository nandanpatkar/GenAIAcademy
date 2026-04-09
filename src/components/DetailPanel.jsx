import { useState, useCallback, useRef, useEffect } from "react";
import { generateStudyContent } from "../services/aiService";
import { 
  getSavedSets, saveStudySet, deleteSavedSet, MODE_LABELS,
} from "../store/savedStudyStore";
import { 
  Box, BookOpen, Brain, Loader2, ChevronDown, ChevronUp, 
  ExternalLink, X, CheckSquare, Library, Network, AlignLeft,
  Sparkles, Bookmark, Video, FileText, Link2, CheckCircle2, AlertCircle,
  BookmarkCheck, Trash2, FolderOpen, Save, RotateCcw, Clock,
  Maximize2, Minimize2
} from "lucide-react";
import { AIResult } from "./AIStudyContent";

const STATUS_LABELS = { complete: "COMPLETE", in_progress: "IN PROGRESS", locked: "LOCKED", default: "NOT STARTED" };
const STATUS_COLORS = { complete: "#00ff88", in_progress: "#f59e0b", locked: "#555570", default: "#555570" };

// ── NotebookLM helpers ────────────────────────────────────────────────────────

/** Extract a proper https:// URL from whatever format is stored */
function toAbsoluteUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

/** Build the NotebookLM deep-link URL from a module's links + videos */
function buildNotebookLMUrl(module) {
  const sources = [];

  // Collect resource links
  (module.links || []).forEach((l) => {
    const u = toAbsoluteUrl(l.url);
    if (u) sources.push(u);
  });

  // Collect YouTube video URLs
  (module.videos || []).forEach((v) => {
    const u = toAbsoluteUrl(v.url);
    if (u && (u.includes("youtube.com") || u.includes("youtu.be"))) sources.push(u);
  });

  if (sources.length === 0) return "https://notebooklm.google.com/";

  // NotebookLM supports ?source= repeated params to pre-load sources
  const params = sources.map((s) => `source=${encodeURIComponent(s)}`).join("&");
  return `https://notebooklm.google.com/?${params}`;
}

/** Count available sources for display */
function countSources(module) {
  const links = (module.links || []).filter((l) => l.url).length;
  const vids = (module.videos || []).filter(
    (v) => v.url && (v.url.includes("youtube") || v.url.includes("youtu.be"))
  ).length;
  return { links, vids, total: links + vids };
}

// ── AI Study Panel ────────────────────────────────────────────────────────────

const AI_MODES = [
  { id: "quiz",       label: "Quiz",       icon: CheckSquare, desc: "MCQ questions with answers" },
  { id: "flashcards", label: "Flashcards", icon: Library,     desc: "Term ↔ definition cards" },
  { id: "mindmap",    label: "Mind Map",   icon: Network,     desc: "Visual topic breakdown" },
  { id: "summary",    label: "Summary",    icon: AlignLeft,   desc: "Concise module summary" },
];

const MODE_ICONS = { quiz: CheckSquare, flashcards: Library, mindmap: Network, summary: AlignLeft };

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    + " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function AIStudyPanel({ module, pathColor }) {
  const [mode, setMode]           = useState("quiz");
  const [loading, setLoading]     = useState(false);
  const [statusMsg, setStatusMsg] = useState("");     // live retry countdown
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState(null);
  const [flip, setFlip]           = useState({});     // flashcard flip state
  const [expanded, setExpanded]   = useState(true);
  const [savedSets, setSavedSets] = useState(() => getSavedSets());
  const [savedMsg, setSavedMsg]   = useState("");     // brief "Saved!" flash
  const [showSaved, setShowSaved] = useState(false);  // saved-sets browser
  const [browsing, setBrowsing]   = useState(null);   // currently viewed saved set

  // Re-read store (called after save/delete)
  const refreshSaved = useCallback(() => setSavedSets(getSavedSets()), []);

  const generate = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setFlip({});
    setStatusMsg("");
    setBrowsing(null);
    try {
      const data = await generateStudyContent(
        mode,
        {
          title: module.title,
          subtitle: module.subtitle,
          subtopics: module.subtopics || [],
          overview: module.overview || "",
          links: (module.links || []).map((l) => toAbsoluteUrl(l.url)).filter(Boolean),
          videos: (module.videos || [])
            .map((v) => toAbsoluteUrl(v.url))
            .filter((u) => u && (u.includes("youtube") || u.includes("youtu.be"))),
        },
        (msg) => setStatusMsg(msg),
      );
      setResult(data);
    } catch (e) {
      console.error("AI Generation Error:", e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  };

  const handleSave = () => {
    const activeResult = browsing ? browsing.data : result;
    const activeMode   = browsing ? browsing.mode : mode;
    if (!activeResult) return;
    saveStudySet(activeMode, module.title, activeResult);
    refreshSaved();
    setSavedMsg("Saved!");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteSavedSet(id);
    refreshSaved();
    if (browsing?.id === id) setBrowsing(null);
  };

  const handleLoadSaved = (set) => {
    setBrowsing(set);
    setResult(null);
    setError(null);
    setMode(set.mode);
    setFlip({});
    setShowSaved(false);
  };

  // Counts for the header badge
  const moduleSavedCount = savedSets.filter((s) => s.moduleTitle === module.title).length;
  const activeResult = browsing ? browsing.data : result;
  const activeMode   = browsing ? browsing.mode : mode;


  return (
    <div style={{
      margin: "0 0 20px 0",
      border: "1px solid var(--border)",
      borderRadius: 16,
      overflow: "hidden",
      background: "rgba(20,20,25,0.4)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    }}>
      {/* Header row */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", cursor: "pointer",
          borderBottom: expanded ? "1px solid var(--border)" : "none",
          background: `linear-gradient(90deg, ${pathColor}12, transparent)`,
        }}
        onClick={() => setExpanded((e) => !e)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: `${pathColor}20`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Sparkles size={14} color={pathColor} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 900, color: pathColor, letterSpacing: "1px" }}>
            AI STUDY SUITE
          </span>
          <span style={{
            fontSize: 8, background: "rgba(255,255,255,0.05)", color: "var(--text3)",
            padding: "3px 8px", borderRadius: 20, fontWeight: 800, letterSpacing: "0.5px",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            FLASH 2.5
          </span>
          {moduleSavedCount > 0 && (
            <span
              onClick={(e) => { e.stopPropagation(); setShowSaved((v) => !v); }}
              style={{
                fontSize: 8, background: `${pathColor}20`, color: pathColor,
                padding: "3px 8px", borderRadius: 20, fontWeight: 900, letterSpacing: "0.5px",
                border: `1px solid ${pathColor}40`, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <BookmarkCheck size={9} />
              {moduleSavedCount} SAVED
            </span>
          )}
        </div>
        {expanded ? <ChevronUp size={14} color="var(--text3)" /> : <ChevronDown size={14} color="var(--text3)" />}
      </div>

      {expanded && (
        <div style={{ padding: "14px 10px" }}>
          {/* Mode selector */}
          <div style={{ display: "flex", gap: "8px", marginBottom: 16, flexWrap: "wrap" }}>
            {AI_MODES.map((m) => {
              const Icon = m.icon;
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => { setMode(m.id); setResult(null); setError(null); }}
                  style={{
                    flex: "1 1 calc(50% - 8px)", 
                    minWidth: "70px",
                    padding: "10px 4px",
                    borderRadius: 12,
                    border: "1px solid",
                    borderColor: isActive ? pathColor : "var(--border)",
                    background: isActive ? `${pathColor}15` : "rgba(255,255,255,0.02)",
                    color: isActive ? pathColor : "var(--text3)",
                    cursor: "pointer",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
                    boxShadow: isActive ? `0 4px 12px ${pathColor}20` : "none",
                  }}
                >
                  <Icon size={16} strokeWidth={2.5} style={{ opacity: isActive ? 1 : 0.6 }} />
                  <span style={{ fontSize: 9, letterSpacing: "0.5px", textTransform: "uppercase" }}>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Description */}
          <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 10, fontStyle: "italic" }}>
            {AI_MODES.find((m) => m.id === mode)?.desc} — generated from this module's content
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={loading}
            style={{
              width: "100%", padding: "12px", borderRadius: 10,
              border: `1px solid ${pathColor}`,
              background: loading ? `${pathColor}05` : `${pathColor}10`,
              color: pathColor,
              fontSize: 11, fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
              transition: "all .3s ease",
              marginBottom: 12,
              letterSpacing: "0.5px",
              boxShadow: `0 0 20px ${pathColor}10`,
              minHeight: 44,
            }}
          >
            {loading ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                  {statusMsg
                    ? statusMsg.toUpperCase()
                    : `ORCHESTRATING ${AI_MODES.find((m) => m.id === mode)?.label.toUpperCase()}…`}
                </div>
                {statusMsg && (
                  <div style={{
                    fontSize: 9, opacity: 0.7, fontWeight: 600,
                    letterSpacing: "0.3px", color: "#f59e0b",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <span style={{
                      display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                      background: "#f59e0b", animation: "pulse 1s ease-in-out infinite",
                    }} />
                    Auto-retrying — this may take up to 30s
                  </div>
                )}
              </>
            ) : (
              <>
                <Sparkles size={14} />
                GENERATE {AI_MODES.find((m) => m.id === mode)?.label.toUpperCase()}
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div style={{
              padding: "12px 14px", borderRadius: 12,
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
              color: "#ef4444", fontSize: 11,
              animation: "fadeIn 0.3s ease-out"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertCircle size={14} />
                  <span style={{ fontWeight: 800, letterSpacing: "0.5px" }}>GENERATION FAILED</span>
                </div>
                <div style={{ opacity: 0.9, lineHeight: 1.4 }}>{error}</div>
                {error.includes("API Key") && (
                  <div style={{ 
                    marginTop: 6, padding: "8px 10px", background: "rgba(0,0,0,0.15)", 
                    borderRadius: 8, fontSize: 10, border: "1px solid rgba(239,68,68,0.15)",
                    color: "rgba(239,68,68,0.9)", lineHeight: 1.4
                  }}>
                    <strong>Tip:</strong> Ensure your <code>VITE_OPENROUTER_API_KEY</code> is correctly set in <code>.env.local</code>. Refer to <code>.env.example</code> for guidance.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Browsing a saved set ── */}
          {browsing && (
            <div style={{
              marginBottom: 12, padding: "10px 14px", borderRadius: 10,
              background: `${pathColor}08`, border: `1px dashed ${pathColor}40`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              fontSize: 10, color: pathColor, fontWeight: 700,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FolderOpen size={12} />
                VIEWING SAVED · {MODE_LABELS[browsing.mode]?.toUpperCase()} · {fmtDate(browsing.savedAt)}
              </div>
              <button
                onClick={() => { setBrowsing(null); setMode(browsing.mode); }}
                style={{ background: "none", border: "none", color: pathColor, cursor: "pointer", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}
              >
                <RotateCcw size={10} /> CLOSE
              </button>
            </div>
          )}

          {/* ── Save button (shown after result or while browsing) ── */}
          {activeResult && (
            <button
              onClick={handleSave}
              style={{
                width: "100%", padding: "10px 12px", borderRadius: 10, marginBottom: 14,
                border: `1px solid ${savedMsg ? "#00ff88" : pathColor}60`,
                background: savedMsg ? "rgba(0,255,136,0.08)" : "rgba(255,255,255,0.02)",
                color: savedMsg ? "#00ff88" : "var(--text3)",
                fontSize: 10, fontWeight: 800, letterSpacing: "0.5px",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 0.3s ease",
              }}
            >
              {savedMsg
                ? (<><BookmarkCheck size={13} /> SAVED TO LIBRARY!</>)
                : (<><Save size={13} /> SAVE {MODE_LABELS[activeMode]?.toUpperCase()} TO LIBRARY</>)}
            </button>
          )}

          {/* ── Saved Sets Browser ── */}
          {showSaved && (
            <div style={{
              marginBottom: 14, border: "1px solid var(--border)", borderRadius: 12,
              overflow: "hidden", animation: "fadeIn 0.2s ease",
            }}>
              <div style={{
                padding: "10px 14px", background: "rgba(255,255,255,0.03)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid var(--border)",
              }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: pathColor, letterSpacing: "1px", display: "flex", alignItems: "center", gap: 6 }}>
                  <FolderOpen size={12} /> SAVED SETS — {module.title.substring(0, 20)}
                </div>
                <button
                  onClick={() => setShowSaved(false)}
                  style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer" }}
                >
                  <X size={12} />
                </button>
              </div>
              {moduleSavedCount === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", fontSize: 11, color: "var(--text3)", opacity: 0.6 }}>
                  No saved sets for this module yet.
                </div>
              ) : (
                <div style={{ maxHeight: 280, overflowY: "auto" }}>
                  {savedSets
                    .filter((s) => s.moduleTitle === module.title)
                    .map((s) => {
                      const MIcon = MODE_ICONS[s.mode] || Sparkles;
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleLoadSaved(s)}
                          style={{
                            padding: "10px 14px", borderBottom: "1px solid var(--border)",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            cursor: "pointer", background: browsing?.id === s.id ? `${pathColor}08` : "transparent",
                            transition: "background 0.2s",
                          }}
                          className="hover-node"
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: 8,
                              background: `${pathColor}15`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0,
                            }}>
                              <MIcon size={13} color={pathColor} />
                            </div>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>
                                {MODE_LABELS[s.mode]}
                              </div>
                              <div style={{ fontSize: 9, color: "var(--text3)", display: "flex", alignItems: "center", gap: 4 }}>
                                <Clock size={8} /> {fmtDate(s.savedAt)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleDelete(s.id, e)}
                            style={{
                              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                              borderRadius: 6, padding: "4px 7px", cursor: "pointer",
                              color: "#ef4444", display: "flex", alignItems: "center",
                            }}
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* ── Results (live or from saved) ── */}
          {activeResult && (
            <AIResult
              result={activeResult}
              mode={activeMode}
              pathColor={pathColor}
              flip={flip}
              setFlip={setFlip}
            />
          )}
        </div>
      )}
    </div>
  );
}


// ── Main DetailPanel ──────────────────────────────────────────────────────────

export default function DetailPanel({
  node, module, pathColor,
  onMarkDone, onMarkProgress, onMarkModuleStatus, onToggleSubtopicStatus,
  nodeState, onModuleSelect, onTopicSelect, isEditMode,
}) {
  if (!node || !module) return (
    <div className="no-select">
      <div className="no-select-icon"><Box size={48} strokeWidth={1} /></div>
      <h3>Select a node</h3>
      <p>Click any node in the roadmap to explore its modules and resources.</p>
    </div>
  );

  const statusColor = STATUS_COLORS[module.status] || STATUS_COLORS.default;
  const doneCount   = node.modules?.filter((m) => m.status === "complete").length || 0;
  const pct         = Math.round((doneCount / (node.modules?.length || 1)) * 100);
  const titleWords  = module.title.split(" ");
  const firstWord   = titleWords.slice(0, -1).join(" ") || titleWords[0];
  const lastWord    = titleWords.length > 1 ? titleWords[titleWords.length - 1] : "";

  const { links, vids, total } = countSources(module);
  const notebookUrl = buildNotebookLMUrl(module);
  const hasNoSources = total === 0;

  const openNotebookLM = () => {
    if (hasNoSources) {
      window.open("https://notebooklm.google.com/", "_blank");
      return;
    }
    window.open(notebookUrl, "_blank");
  };

  return (
    <div className="detail-panel" style={{ "--dp-color": pathColor }}>
      {/* ── Header ── */}
      <div className="dp-header">
        <div className="dp-breadcrumb" style={{ fontSize: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          DS <span>·</span> {node.title.substring(0, 15).toUpperCase()} <span>·</span> {module.title.toUpperCase()}
        </div>
        <div className="dp-title-row">
          <div>
            <div className="dp-title">
              {firstWord && <span>{firstWord}</span>}
              {lastWord && <span className="highlight">{lastWord}</span>}
            </div>
            <div className="dp-badges">
              <span className="dp-badge" style={{ color: statusColor, borderColor: `${statusColor}40`, background: `${statusColor}10` }}>
                {STATUS_LABELS[module.status]}
              </span>
              <span className="dp-badge" style={{ color: "var(--text2)", borderColor: "var(--border)", background: "var(--bg3)" }}>
                {module.duration}
              </span>
              <span className="dp-badge" style={{ color: "var(--text2)", borderColor: "var(--border)", background: "var(--bg3)" }}>
                {module.subtopics?.length} TOPICS
              </span>
            </div>
          </div>
          <button className="dp-share-btn">↑ SHARE</button>
        </div>
        <div className="dp-progress-bar">
          <div className="dp-progress-fill" style={{ width: `${pct}%`, background: pathColor }} />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="dp-body">
        {/* Overview */}
        <div className="dp-overview">{module.overview}</div>


        {/* All modules in this node */}
        <div className="dp-section-label">All modules in this node</div>
        <div className="dp-module-list">
          {node.modules?.map((m) => {
            const isActive = m.id === module.id;
            return (
              <div key={m.id} style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <div
                  className={`dp-module-row ${isActive ? "active" : ""}`}
                  onClick={() => onModuleSelect && onModuleSelect(m)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={`dp-module-circle ${m.status}`}>
                    {m.status === "complete" ? "✓" : m.status === "in_progress" ? "⟳" : m.status === "locked" ? "🔒" : "◌"}
                  </div>
                  <div className="dp-module-info">
                    <div className="dp-module-name">{m.title}</div>
                    <div className="dp-module-desc">{m.subtitle}</div>
                  </div>
                  <div>
                    {(m.status === "complete" || m.status === "in_progress") && (
                      <span className={`dp-module-status-pill ${m.status}`}>
                        {m.status === "complete" ? "COMPLETE" : "IN PROGRESS"}
                      </span>
                    )}
                  </div>
                </div>

                {isActive && m.subtopics && m.subtopics.length > 0 && (
                  <div style={{
                    marginLeft: 36, paddingLeft: 16,
                    borderLeft: "2px solid var(--border)",
                    display: "flex", flexDirection: "column", gap: 4,
                    marginBottom: 12, marginTop: 4,
                  }}>
                    {m.subtopics.map((s, sidx) => {
                      const st = typeof s === "object" ? s : { title: s, status: "pending" };
                      const isComplete = st.status === "complete";
                      return (
                        <div
                          key={sidx}
                          onClick={(e) => { e.stopPropagation(); onTopicSelect && onTopicSelect(st); }}
                          style={{
                            fontSize: 12, fontWeight: 600,
                            color: isComplete ? "var(--text)" : "var(--text2)",
                            cursor: "pointer",
                            padding: "8px 12px", borderRadius: 6,
                            background: isComplete ? "rgba(0,255,136,0.05)" : "rgba(255,255,255,0.02)",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            transition: "all .15s",
                          }}
                          className="hover-node"
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              onClick={(e) => { e.stopPropagation(); onToggleSubtopicStatus && onToggleSubtopicStatus(st.title); }}
                              style={{
                                width: 12, height: 12, borderRadius: "50%",
                                border: `1.5px solid ${isComplete ? "#00ff88" : "var(--text3)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 8, color: "#00ff88", cursor: "pointer",
                                background: isComplete ? "rgba(0,255,136,0.1)" : "transparent",
                              }}
                            >
                              {isComplete && "✓"}
                            </div>
                            <span>{st.title}</span>
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            {st.companies && st.companies.length > 0 && (
                              <span style={{ fontSize: 8, color: "var(--text3)", background: "var(--bg3)", padding: "2px 6px", borderRadius: 4 }}>
                                {st.companies[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Curriculum Resources ── */}
        {(module.links?.length > 0 || module.videos?.length > 0 || module.files?.length > 0) && (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="dp-section-label" style={{ marginBottom: 4 }}>Curated Resources</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
              {/* Videos */}
              {module.videos?.map((v, i) => (
                <a
                  key={`vid-${i}`}
                  href={toAbsoluteUrl(v.url)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderRadius: 12,
                    background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                    color: "var(--text)", textDecoration: "none", transition: "all .2s",
                  }}
                  className="hover-node"
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(239,68,68,0.1)", display: "flex",
                    alignItems: "center", justifyContent: "center"
                  }}>
                    <Video size={16} color="#ef4444" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{v.title || "Module Video"}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>Watch on YouTube</div>
                  </div>
                  <ExternalLink size={14} color="var(--text3)" style={{ opacity: 0.5 }} />
                </a>
              ))}

              {/* Links */}
              {module.links?.map((l, i) => (
                <a
                  key={`link-${i}`}
                  href={toAbsoluteUrl(l.url)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderRadius: 12,
                    background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                    color: "var(--text)", textDecoration: "none", transition: "all .2s",
                  }}
                  className="hover-node"
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${pathColor}15`, display: "flex",
                    alignItems: "center", justifyContent: "center"
                  }}>
                    <Link2 size={16} color={pathColor} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{l.title || "Reference Link"}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>External Resource</div>
                  </div>
                  <ExternalLink size={14} color="var(--text3)" style={{ opacity: 0.5 }} />
                </a>
              ))}

              {/* Files */}
              {module.files?.map((f, i) => (
                <a
                  key={`file-${i}`}
                  href={toAbsoluteUrl(f.url)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderRadius: 12,
                    background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                    color: "var(--text)", textDecoration: "none", transition: "all .2s",
                  }}
                  className="hover-node"
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(59,130,246,0.1)", display: "flex",
                    alignItems: "center", justifyContent: "center"
                  }}>
                    <FileText size={16} color="#3b82f6" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{f.title || f.name || "Module Document"}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>Download Resource</div>
                  </div>
                  <ExternalLink size={14} color="var(--text3)" style={{ opacity: 0.5 }} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Deep Learning Suite ── */}
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="dp-section-label" style={{ marginBottom: 0 }}>Advanced AI Study Tools</div>
          
          {/* NotebookLM Banner */}
          <div style={{
            padding: "20px 24px",
            borderRadius: 20,
            background: "linear-gradient(135deg, rgba(66,133,244,0.08) 0%, rgba(15,157,88,0.06) 100%)",
            border: "1px solid rgba(66,133,244,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            backdropFilter: "blur(12px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: "linear-gradient(135deg, #4285F4, #34A853)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 15px rgba(66,133,244,0.3), inset 0 0 10px rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}>
                <Bookmark size={22} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text)", marginBottom: 4, letterSpacing: "0.2px" }}>
                  Deep Study in NotebookLM
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)", lineHeight: 1.5, opacity: 0.8, maxWidth: 300 }}>
                  {hasNoSources
                    ? "Open NotebookLM for a contextual research session."
                    : `Analyzing ${links} link${links !== 1 ? "s" : ""} and ${vids} module video${vids !== 1 ? "s" : ""} via AI.`
                  }
                </div>
              </div>
            </div>
            <button
              onClick={openNotebookLM}
              style={{
                padding: "12px 22px",
                borderRadius: 12,
                background: "rgba(66,133,244,0.12)",
                border: "1px solid rgba(66,133,244,0.3)",
                color: "#4285F4",
                fontSize: 11,
                fontWeight: 900,
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all .4s cubic-bezier(0.19, 1, 0.22, 1)",
                letterSpacing: "1px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(66,133,244,0.2)";
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(66,133,244,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(66,133,244,0.12)";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              LAUNCH
              <ExternalLink size={12} />
            </button>
          </div>

          {/* ── AI Study Panel ── */}
          <AIStudyPanel module={module} pathColor={pathColor} />
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          {[
            { label: "Videos", val: module.videos?.length || 0, icon: Video },
            { label: "Files",  val: module.files?.length  || 0, icon: FileText },
            { label: "Links",  val: module.links?.length  || 0, icon: Link2 },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{
                flex: 1, background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "14px 12px", textAlign: "center",
                transition: "all 0.3s ease",
              }}>
                <div style={{ marginBottom: 6, opacity: 0.6 }}><Icon size={20} color={pathColor} /></div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.5px" }}>{s.val}</div>
                <div style={{ fontSize: 8, color: "var(--text3)", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="dp-actions">
        <button
          className={`dp-btn dp-btn-done ${module.status === "complete" ? "active" : ""}`}
          onClick={() => onMarkModuleStatus("complete")}
        >
          {module.status === "complete" ? "✓ MODULE COMPLETED" : "MARK MODULE COMPLETE ✓"}
        </button>
        <button
          className={`dp-btn dp-btn-progress ${module.status === "in_progress" ? "active" : ""}`}
          onClick={() => onMarkModuleStatus("in_progress")}
        >
          {module.status === "in_progress" ? "⟳ MODULE IN PROGRESS" : "MARK MODULE IN PROGRESS"}
        </button>
        <button
          className={`dp-btn dp-btn-done ${nodeState === "done" ? "active" : ""}`}
          style={{
            background: nodeState === "done" ? pathColor : "transparent",
            borderColor: pathColor, borderStyle: "dashed", opacity: 0.8,
          }}
          onClick={onMarkDone}
        >
          {nodeState === "done" ? "NODE COMPLETED 🏆" : "MARK ENTIRE NODE DONE"}
        </button>
      </div>

      {/* Animations for loader and retry indicator */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}