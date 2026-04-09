import { useState, useCallback, useRef, useEffect } from "react";
import { 
  Brain, CheckSquare, Library, Network, AlignLeft,
  Sparkles, CheckCircle2, Maximize2, Minimize2
} from "lucide-react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

export function AIResult({ result, mode, pathColor, flip, setFlip }) {
  if (mode === "quiz" && result.questions) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <CheckSquare size={12} color={pathColor} />
          <div style={{ fontSize: 9, fontWeight: 900, color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase" }}>
            {result.questions.length} Knowledge Checks
          </div>
        </div>
        {!result.questions || !Array.isArray(result.questions) ? (
          <div style={{ padding: 20, opacity: 0.5, fontSize: 11 }}>Malformed knowledge check data. Try regenerating.</div>
        ) : (
          result.questions.map((q, i) => (
            <QuizCard key={i} q={q} i={i} pathColor={pathColor} />
          ))
        )}
      </div>
    );
  }

  if (mode === "flashcards" && result.cards) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Library size={12} color={pathColor} />
          <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text3)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            {result.cards.length} CORE CONCEPTS
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
          {!result.cards || !Array.isArray(result.cards) ? (
            <div style={{ padding: 20, opacity: 0.5, fontSize: 11 }}>Flashcard data unavailable.</div>
          ) : (
            result.cards.map((c, i) => (
              <div
                key={i}
                onClick={() => setFlip((f) => ({ ...f, [i]: !f[i] }))}
                style={{
                  perspective: "1000px",
                  height: "220px",
                  cursor: "pointer",
                  width: "100%",
                  maxWidth: "100%",
                }}
              >
                <div style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transition: "transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)",
                  transformStyle: "preserve-3d",
                  transform: flip[i] ? "rotateY(180deg)" : "rotateY(0deg)",
                }}>
                  {/* Front Face (Term) */}
                  <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                    borderRadius: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px",
                    textAlign: "center",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                    backdropFilter: "blur(10px)",
                  }}>
                    <div style={{ 
                      fontSize: 9, fontWeight: 900, color: pathColor, 
                      letterSpacing: "1px", textTransform: "uppercase",
                      marginBottom: 12, opacity: 0.6
                    }}>
                      Definition
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", letterSpacing: "-0.5px" }}>
                      {c.term}
                    </div>
                    <div style={{ 
                      marginTop: 20, width: 40, height: 2, 
                      background: `linear-gradient(90deg, transparent, ${pathColor}, transparent)` 
                    }} />
                    <div style={{ 
                      position: "absolute", bottom: 12, right: 16, 
                      fontSize: 8, color: "var(--text3)", opacity: 0.4, letterSpacing: "1px" 
                    }}>
                      TAP TO FLIP
                    </div>
                  </div>
  
                  {/* Back Face (Definition) */}
                  <div style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    background: `${pathColor}08`,
                    border: `1px solid ${pathColor}40`,
                    borderRadius: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "32px",
                    textAlign: "center",
                    transform: "rotateY(180deg)",
                    boxShadow: `0 8px 40px ${pathColor}15`,
                    backdropFilter: "blur(15px)",
                  }}>
                    <div style={{ 
                      fontSize: 9, fontWeight: 900, color: pathColor, 
                      letterSpacing: "1px", textTransform: "uppercase",
                      marginBottom: 16, opacity: 0.8
                    }}>
                      Insight
                    </div>
                    <div style={{ 
                      fontSize: 14, fontWeight: 600, color: "var(--text)", 
                      lineHeight: 1.7, maxWidth: 320 
                    }}>
                      {c.definition}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (mode === "mindmap" && result.mindmap) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Network size={12} color={pathColor} />
          <div style={{ fontSize: 9, fontWeight: 900, color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase" }}>
            Topic Architecture
          </div>
        </div>
        <MindMapView data={result.mindmap} pathColor={pathColor} />
      </div>
    );
  }

  if (mode === "summary" && result.summary) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <AlignLeft size={12} color={pathColor} />
          <div style={{ fontSize: 9, fontWeight: 900, color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase" }}>
            Executive Abstract
          </div>
        </div>
        <div style={{
          padding: "24px", borderRadius: 16,
          border: "1px solid var(--border)", background: "rgba(255,255,255,0.02)",
          fontSize: 13, color: "var(--text2)", lineHeight: 1.8,
          whiteSpace: "pre-wrap",
          position: "relative",
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.1)",
        }}>
          <Sparkles size={16} color={pathColor} style={{ position: "absolute", top: 16, right: 16, opacity: 0.2 }} />
          {result.summary}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, textAlign: "center", opacity: 0.5 }}>
      <Brain size={24} style={{ marginBottom: 12, opacity: 0.3 }} />
      <div style={{ fontSize: 11, fontStyle: "italic" }}>Awaiting high-fidelity generation...</div>
    </div>
  );
}

export function QuizCard({ q, i, pathColor }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div style={{
      padding: "20px", borderRadius: 16,
      border: "1px solid var(--border)", 
      background: "rgba(255,255,255,0.02)",
      transition: "all 0.3s ease",
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 16, lineHeight: 1.5 }}>
        <span style={{ color: pathColor, marginRight: 8, opacity: 0.5 }}>{String(i + 1).padStart(2, '0')}</span>
        {q.question}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {!q || !q.options || !Array.isArray(q.options) ? (
          <div style={{ fontSize: 11, fontStyle: "italic", opacity: 0.5 }}>Option data missing for this question.</div>
        ) : (
          q.options.map((opt, oi) => {
            const isCorrect = opt === q.answer;
            const isSelected = selected === oi;
            let bg = "rgba(255,255,255,0.03)", border = "rgba(255,255,255,0.05)", color = "var(--text2)";
            
            if (revealed) {
              if (isCorrect) { 
                bg = "rgba(0,255,136,0.08)"; 
                border = "#00ff8840"; 
                color = "#00ff88"; 
              }
              else if (isSelected && !isCorrect) { 
                bg = "rgba(239,68,68,0.08)"; 
                border = "#ef444440"; 
                color = "#ef4444"; 
              }
            } else if (isSelected) {
              bg = `${pathColor}15`; border = pathColor; color = "var(--text)";
            }

            return (
              <div
                key={oi}
                onClick={() => { if (!revealed) { setSelected(oi); setRevealed(true); } }}
                style={{
                  padding: "12px 16px", borderRadius: 10,
                  border: `1px solid ${border}`, background: bg, color,
                  fontSize: 11, fontWeight: 600, cursor: revealed ? "default" : "pointer",
                  transition: "all 0.2s cubic-bezier(0.19, 1, 0.22, 1)",
                  display: "flex", alignItems: "center", gap: 10,
                }}
              >
                <div style={{ 
                  width: 18, height: 18, borderRadius: 6, 
                  background: isSelected ? pathColor : "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: isSelected ? "black" : "var(--text3)",
                  fontWeight: 900
                }}>
                  {["A", "B", "C", "D"][oi]}
                </div>
                {opt}
                {revealed && isCorrect && <CheckCircle2 size={12} style={{ marginLeft: "auto" }} />}
              </div>
            );
          })
        )}
      </div>
      {revealed && q.explanation && (
        <div style={{
          marginTop: 16, fontSize: 11, color: "var(--text3)", lineHeight: 1.6,
          padding: "12px 16px", borderRadius: 12, background: "rgba(0,0,0,0.2)",
          borderLeft: `3px solid ${pathColor}`,
          fontStyle: "italic",
        }}>
          {q.explanation}
        </div>
      )}
    </div>
  );
}

export function MindMapView({ data, pathColor }) {
  const containerRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const rootLabel = typeof data.root === "object" ? JSON.stringify(data.root) : data.root;
  const rootDesc = data.desc || "Master concept";

  // Sync state with native fullscreen (for Esc key support)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  // Vibrant palette for branches
  const BRANCH_COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335", "#A142F4", "#24C1E0", "#FF6D00"];

  // Helper to render node content
  const renderNode = (label, desc, color, level = 3) => (
    <div style={{ display: "flex", flexDirection: "column", gap: level === 4 ? 1 : 3, padding: level === 4 ? "4px 2px" : "8px 4px" }}>
      <div style={{ 
        fontSize: level === 4 ? "9px" : "11px", 
        fontWeight: "900", 
        color: color || "var(--text)",
        lineHeight: 1.2
      }}>
        {label}
      </div>
      {desc && level < 4 && (
        <div style={{ fontSize: "8px", fontWeight: "600", color: "var(--text3)", lineHeight: 1.3 }}>
          {desc}
        </div>
      )}
    </div>
  );

  const nodes = [];
  const edges = [];

  // 1. Root Node
  nodes.push({
    id: "root",
    type: "input",
    data: { 
      label: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 4px" }}>
          <div style={{ fontSize: "14px", fontWeight: "940", color: pathColor }}>{rootLabel}</div>
          <div style={{ fontSize: "9px", fontWeight: "800", color: "var(--text2)", opacity: 0.8 }}>{rootDesc}</div>
        </div>
      )
    },
    position: { x: 0, y: 0 },
    style: {
      background: "rgba(255, 255, 255, 0.05)",
      border: `2px solid ${pathColor}`,
      borderRadius: "16px",
      width: 220,
      textAlign: "center",
      boxShadow: `0 0 30px ${pathColor}30`,
      backdropFilter: "blur(20px)",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
  });

  const branches = data.branches || [];
  const branchRadius = 350;
  const leafRadius = 650;
  const subLeafRadius = 950;

  branches.forEach((branch, bi) => {
    const bColor = BRANCH_COLORS[bi % BRANCH_COLORS.length];
    const angle = (bi / branches.length) * 2 * Math.PI;
    const bx = Math.cos(angle) * branchRadius;
    const by = Math.sin(angle) * branchRadius;
    const bid = `branch-${bi}`;

    // 2. Branch Node
    nodes.push({
      id: bid,
      data: { label: renderNode(branch.label, branch.desc, bColor, 2) },
      position: { x: bx, y: by },
      style: {
        background: `${bColor}12`,
        border: `1px solid ${bColor}80`,
        borderRadius: "14px",
        width: 180,
        textAlign: "left",
        padding: "4px 10px",
        backdropFilter: "blur(12px)",
        boxShadow: `0 4px 15px ${bColor}15`,
      },
    });

    edges.push({
      id: `e-root-${bid}`,
      source: "root",
      target: bid,
      animated: true,
      style: { stroke: `${bColor}40`, strokeWidth: 2 },
    });

    // 3. Leaf Nodes
    const children = branch.children || [];
    children.forEach((child, ci) => {
      const cLabel = typeof child === "object" ? child.label : child;
      const cDesc = typeof child === "object" ? child.desc : "";
      const lid = `leaf-${bi}-${ci}`;

      // Spread children around branch angle
      const childAngle = angle + (ci - (children.length - 1) / 2) * 0.35;
      const lx = Math.cos(childAngle) * leafRadius;
      const ly = Math.sin(childAngle) * leafRadius;

      nodes.push({
        id: lid,
        data: { label: renderNode(cLabel, cDesc, null, 3) },
        position: { x: lx, y: ly },
        style: {
          background: "rgba(255,255,255,0.02)",
          border: `1px solid ${bColor}30`,
          borderRadius: "10px",
          width: 160,
          textAlign: "left",
          padding: "4px 8px",
          backdropFilter: "blur(6px)",
        },
      });

      edges.push({
        id: `e-${bid}-${lid}`,
        source: bid,
        target: lid,
        style: { stroke: `${bColor}20`, strokeWidth: 1.5, strokeDasharray: "4 2" },
      });

      // 4. Sub-Leaf Nodes
      if (child.subchildren && Array.isArray(child.subchildren)) {
        child.subchildren.forEach((sub, si) => {
          const sLabel = typeof sub === "object" ? sub.label : sub;
          const sid = `sub-${bi}-${ci}-${si}`;

          const subAngle = childAngle + (si - (child.subchildren.length - 1) / 2) * 0.15;
          const sx = Math.cos(subAngle) * subLeafRadius;
          const sy = Math.sin(subAngle) * subLeafRadius;

          nodes.push({
            id: sid,
            type: "output",
            data: { label: renderNode(sLabel, "", null, 4) },
            position: { x: sx, y: sy },
            style: {
              background: "rgba(255,255,255,0.01)",
              border: `1px solid ${bColor}15`,
              borderRadius: "8px",
              width: 110,
              padding: "2px 6px",
              opacity: 0.9,
            },
          });

          edges.push({
            id: `e-${lid}-${sid}`,
            source: lid,
            target: sid,
            style: { stroke: `${bColor}10`, strokeWidth: 1, strokeDasharray: "2 2" },
          });
        });
      }
    });
  });

  const containerStyle = {
    height: isFullScreen ? "100vh" : (window.innerWidth < 768 ? 400 : 560),
    borderRadius: isFullScreen ? 0 : 24,
    border: isFullScreen ? "none" : "1px solid var(--border)",
    background: "radial-gradient(circle at center, #0a0a0f, #000)",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullScreen}
        style={{
          position: "absolute",
          top: 20, right: 20,
          zIndex: 10,
          width: 36, height: 36,
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "rgba(0,0,0,0.6)",
          color: "var(--text)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          transition: "all 0.2s ease",
        }}
        className="hover-node"
        title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.05}
        maxZoom={3}
        proOptions={{ hideAttribution: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Background color="#1a1a1a" gap={30} size={1} />
        <Controls style={{ 
          background: "rgba(0,0,0,0.6)", 
          borderRadius: 10, 
          border: "1px solid var(--border)",
          color: "white"
        }} />
      </ReactFlow>
      <div style={{
        position: "absolute", bottom: 20, left: 24,
        fontSize: 10, color: "var(--text3)", fontWeight: 900,
        textTransform: "uppercase", letterSpacing: "1.5px",
        pointerEvents: "none", opacity: 0.7,
        display: "flex", alignItems: "center", gap: 10
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: pathColor }} />
        Interactive Knowledge Architecture
      </div>
    </div>
  );
}
