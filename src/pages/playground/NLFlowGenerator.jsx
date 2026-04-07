import { useState, useRef, useEffect } from "react";
import { Sparkles, X, ArrowRight, Loader, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { MarkerType } from "reactflow";
import { generateFlowArchitecture } from "../../services/aiService";

// ── Shared edge style (mirrors DEFAULT_EDGE_OPTS in useFlowStore) ─────────────
const EDGE_DEFAULTS = {
  animated: true,
  style: { stroke: "#818cf8", strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "#818cf8", width: 14, height: 14 },
  labelStyle: { fill: "#94a3b8", fontSize: 9, fontFamily: "'DM Mono',monospace" },
  labelBgStyle: { fill: "#161b22", fillOpacity: 0.9 },
  labelBgPadding: [4, 2],
  labelBgBorderRadius: 3,
};

// ── Valid colorKeys that GenAINode understands ────────────────────────────────
const VALID_COLOR_KEYS = new Set([
  "agent","llm","memory","processing","vectordb","store","datasource","tool",
  "eval","observ","security","workflow","io","multimodal","mcp","aws","azure",
  "databricks","image","audio","websocket","http","database","transform",
  "conditional","error","notification","store","embed","rerank",
]);

const SAFE_COLOR = (c) => (VALID_COLOR_KEYS.has(c) ? c : "processing");

// ── Prompt examples ───────────────────────────────────────────────────────────
const EXAMPLES = [
  "RAG pipeline with Gemini and Pinecone vector store",
  "Multi-agent customer support system with AWS Bedrock",
  "Voice assistant with Whisper, GPT-4o, and ElevenLabs TTS",
  "LangGraph research agent with web search and memory",
  "Production RAG with hybrid search, reranker, and Langfuse observability",
  "Azure AI Foundry multi-agent with content safety and monitoring",
];

let _uid = Date.now();
const mkId = () => `gen_${_uid++}`;

// ── Auto-layout: left-to-right, multi-row when many nodes ────────────────────
function layoutNodes(rawNodes) {
  const COL_W = 240;
  const ROW_H = 130;
  const COLS  = Math.ceil(Math.sqrt(rawNodes.length * 1.5)); // slightly wider than tall

  return rawNodes.map((n, i) => ({
    ...n,
    position: {
      x: 60 + (i % COLS) * COL_W,
      y: 60 + Math.floor(i / COLS) * ROW_H,
    },
  }));
}



// ── Main component ────────────────────────────────────────────────────────────
export default function NLFlowGenerator({ onClose, onApply, hasExistingNodes }) {
  const [prompt,   setPrompt]   = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [preview,  setPreview]  = useState(null); // { name, description, nodes, edges }
  const [mode,     setMode]     = useState("replace"); // "replace" | "append"
  const textareaRef = useRef(null);

  // Auto-focus textarea on mount
  useEffect(() => { textareaRef.current?.focus(); }, []);

  // Handle Ctrl/Cmd+Enter to generate
  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") generate();
  };

  const generate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const parsed = await generateFlowArchitecture(trimmed);

      // Validate & sanitise
      if (!parsed.nodes?.length) throw new Error("No nodes returned — try a more specific description.");

      const nodeIds = new Set(parsed.nodes.map(n => n.id));
      const validEdges = (parsed.edges || []).filter(
        e => nodeIds.has(e.source) && nodeIds.has(e.target)
      );

      setPreview({ ...parsed, edges: validEdges });
    } catch (err) {
      setError(err.message?.includes("JSON")
        ? "Couldn't parse the response. Please try again."
        : err.message || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyToCanvas = () => {
    if (!preview) return;

    // Build ReactFlow nodes
    const rfNodes = layoutNodes(
      preview.nodes.map(n => ({
        id: mkId(),
        _origId: n.id, // keep for edge mapping
        type: "genai",
        position: { x: 0, y: 0 }, // replaced by layoutNodes
        data: {
          label:     n.label,
          icon:      n.icon || "Cpu",
          sub:       n.sub  || "",
          colorKey:  SAFE_COLOR(n.colorKey),
          nodeType:  SAFE_COLOR(n.colorKey),
          status:    "planned",
          collapsed: false,
          info:      n.info || "",
          docsUrl:   null,
          cost:      null,
          inputPort:  n.inputPort  || "any",
          outputPort: n.outputPort || "any",
        },
      }))
    );

    // Map original ids → new ReactFlow ids for edges
    const idMap = {};
    preview.nodes.forEach((orig, i) => { idMap[orig.id] = rfNodes[i].id; });

    const rfEdges = (preview.edges || [])
      .filter(e => idMap[e.source] && idMap[e.target])
      .map(e => ({
        id: mkId(),
        source: idMap[e.source],
        target: idMap[e.target],
        label:  e.label || "",
        ...EDGE_DEFAULTS,
      }));

    // Strip internal _origId
    const cleanNodes = rfNodes.map(({ _origId, ...n }) => n);

    onApply({ nodes: cleanNodes, edges: rfEdges, name: preview.name, mode });
    onClose();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Mono','Fira Code',monospace",
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        width: 620, maxWidth: "95vw", maxHeight: "90vh",
        background: "var(--pg-sidebar)",
        border: "1px solid var(--pg-border)",
        borderRadius: 12,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", borderBottom: "1px solid var(--pg-border)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "rgba(129,140,248,0.15)", border: "1px solid rgba(129,140,248,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={13} color="#818cf8" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--pg-text)", letterSpacing: "0.03em" }}>
                AI Flow Generator
              </div>
              <div style={{ fontSize: 9, color: "var(--pg-text3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Describe your architecture · Gemini builds the diagram
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 26, height: 26, borderRadius: 6,
            background: "transparent", border: "1px solid var(--pg-border)",
            color: "var(--pg-text3)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={13} />
          </button>
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px 0" }}>

          {/* Prompt input */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--pg-text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>
              Describe your system
            </div>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="e.g. RAG pipeline with Gemini 1.5, Pinecone vector store, Cohere reranker, and Langfuse observability"
              rows={3}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "var(--pg-bg)",
                border: "1px solid var(--pg-border)",
                borderRadius: 8, padding: "10px 12px",
                color: "var(--pg-text)", fontSize: 11,
                fontFamily: "'DM Mono',monospace",
                resize: "vertical", outline: "none",
                lineHeight: 1.6,
                transition: "border-color 0.15s",
              }}
              onFocus={e => e.target.style.borderColor = "#818cf8"}
              onBlur={e => e.target.style.borderColor = "var(--pg-border)"}
            />
            <div style={{ fontSize: 9, color: "var(--pg-text3)", marginTop: 4 }}>
              ⌘↵ to generate
            </div>
          </div>

          {/* Example chips */}
          {!preview && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "var(--pg-text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>
                Try an example
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {EXAMPLES.map((ex, i) => (
                  <button key={i} onClick={() => setPrompt(ex)} style={{
                    background: "var(--pg-bg)",
                    border: "1px solid var(--pg-border)",
                    borderRadius: 20, padding: "4px 10px",
                    color: "var(--pg-text2)", fontSize: 9.5,
                    cursor: "pointer", fontFamily: "'DM Mono',monospace",
                    transition: "all 0.12s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#818cf8"; e.currentTarget.style.color = "#818cf8"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--pg-border)"; e.currentTarget.style.color = "var(--pg-text2)"; }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "16px 14px", marginBottom: 14,
              background: "rgba(129,140,248,0.06)",
              border: "1px solid rgba(129,140,248,0.2)",
              borderRadius: 8,
            }}>
              <Loader size={14} color="#818cf8" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: "#818cf8", fontWeight: 700 }}>Generating architecture…</div>
                <div style={{ fontSize: 9, color: "var(--pg-text3)", marginTop: 2 }}>Gemini is designing your system</div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "12px 14px", marginBottom: 14,
              background: "rgba(248,113,113,0.06)",
              border: "1px solid rgba(248,113,113,0.2)",
              borderRadius: 8,
            }}>
              <AlertCircle size={13} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ fontSize: 10, color: "#f87171", lineHeight: 1.6 }}>{error}</div>
            </div>
          )}

          {/* Preview */}
          {preview && !loading && (
            <div style={{ marginBottom: 14 }}>
              {/* Success header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 14px", marginBottom: 12,
                background: "rgba(52,211,153,0.06)",
                border: "1px solid rgba(52,211,153,0.2)",
                borderRadius: 8,
              }}>
                <CheckCircle2 size={13} color="#34d399" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#34d399" }}>{preview.name}</div>
                  <div style={{ fontSize: 9, color: "var(--pg-text3)", marginTop: 1 }}>{preview.description}</div>
                </div>
                <button
                  onClick={generate}
                  title="Regenerate"
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    background: "transparent", border: "1px solid var(--pg-border)",
                    borderRadius: 5, padding: "3px 8px",
                    color: "var(--pg-text3)", fontSize: 9, cursor: "pointer",
                    fontFamily: "'DM Mono',monospace",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#818cf8"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--pg-border)"}
                >
                  <RefreshCw size={9} /> REGEN
                </button>
              </div>

              {/* Node list preview */}
              <div style={{ fontSize: 9, fontWeight: 700, color: "var(--pg-text3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>
                {preview.nodes.length} nodes · {preview.edges.length} connections
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 5,
                maxHeight: 220, overflowY: "auto",
              }}>
                {preview.nodes.map((n, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 10px",
                    background: "var(--pg-bg)",
                    border: "1px solid var(--pg-border)",
                    borderRadius: 6,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                      background: colorDot(n.colorKey),
                    }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--pg-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {n.label}
                      </div>
                      <div style={{ fontSize: 8, color: "var(--pg-text3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {n.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Apply mode selector (only shown if canvas already has nodes) */}
              {hasExistingNodes && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {[
                    { key: "replace", label: "Replace canvas", desc: "Clear existing nodes first" },
                    { key: "append",  label: "Add to canvas",  desc: "Merge with existing nodes" },
                  ].map(opt => (
                    <button key={opt.key} onClick={() => setMode(opt.key)} style={{
                      flex: 1, padding: "8px 10px", borderRadius: 7, cursor: "pointer",
                      fontFamily: "'DM Mono',monospace", textAlign: "left",
                      background: mode === opt.key ? "rgba(129,140,248,0.1)" : "var(--pg-bg)",
                      border: `1px solid ${mode === opt.key ? "#818cf8" : "var(--pg-border)"}`,
                      color: mode === opt.key ? "#818cf8" : "var(--pg-text3)",
                      transition: "all 0.12s",
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700 }}>{opt.label}</div>
                      <div style={{ fontSize: 8.5, marginTop: 1, opacity: 0.75 }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div style={{
          padding: "14px 18px", borderTop: "1px solid var(--pg-border)",
          display: "flex", gap: 8, flexShrink: 0,
        }}>
          {!preview ? (
            <>
              <button onClick={onClose} style={{
                flex: 1, padding: "8px 12px", borderRadius: 7,
                background: "transparent", border: "1px solid var(--pg-border)",
                color: "var(--pg-text3)", cursor: "pointer",
                fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700,
              }}>
                Cancel
              </button>
              <button
                onClick={generate}
                disabled={!prompt.trim() || loading}
                style={{
                  flex: 2, padding: "8px 12px", borderRadius: 7,
                  background: prompt.trim() && !loading ? "rgba(129,140,248,0.15)" : "var(--pg-bg)",
                  border: `1px solid ${prompt.trim() && !loading ? "#818cf8" : "var(--pg-border)"}`,
                  color: prompt.trim() && !loading ? "#818cf8" : "var(--pg-text3)",
                  cursor: prompt.trim() && !loading ? "pointer" : "not-allowed",
                  fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.12s",
                }}
              >
                {loading ? <><Loader size={11} style={{ animation: "spin 0.8s linear infinite" }} /> GENERATING…</> : <><Sparkles size={11} /> GENERATE FLOW</>}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setPreview(null)} style={{
                flex: 1, padding: "8px 12px", borderRadius: 7,
                background: "transparent", border: "1px solid var(--pg-border)",
                color: "var(--pg-text3)", cursor: "pointer",
                fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700,
              }}>
                ← Back
              </button>
              <button onClick={applyToCanvas} style={{
                flex: 2, padding: "8px 12px", borderRadius: 7,
                background: "rgba(52,211,153,0.12)",
                border: "1px solid rgba(52,211,153,0.4)",
                color: "#34d399", cursor: "pointer",
                fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <ArrowRight size={11} />
                APPLY TO CANVAS
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Helper: colorKey → dot color for preview list ────────────────────────────
function colorDot(key) {
  const MAP = {
    agent: "#34d399", llm: "#818cf8", memory: "#f472b6", processing: "#22d3ee",
    vectordb: "#fbbf24", store: "#fbbf24", datasource: "#fbbf24", tool: "#fb923c",
    eval: "#a78bfa", observ: "#94a3b8", security: "#f87171", workflow: "#60a5fa",
    io: "#6b7280", multimodal: "#8b5cf6", mcp: "#06b6d4", aws: "#f59e0b",
    azure: "#3b82f6", databricks: "#e11d48", image: "#2dd4bf", audio: "#c084fc",
  };
  return MAP[key] || "#6b7280";
}