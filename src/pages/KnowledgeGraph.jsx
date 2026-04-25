// src/pages/KnowledgeGraph.jsx
// Personal Knowledge Graph — D3 force-directed visualization
// Tab 1 CURRICULUM: edges from module title + subtopic title keywords
// Tab 2 MY NOTES:   edges only from subtopic.content + module_notes (Supabase)
//                   dashed purple lines, modules with no notes float grey & isolated

import React, { useEffect, useRef, useMemo, useState, useCallback } from "react";
import * as d3 from "d3";
import {
  X, ZoomIn, ZoomOut, Maximize2, RotateCcw,
  BookOpen, Layers, GitBranch, FileText, Loader2
} from "lucide-react";
import { supabase } from "../config/supabaseClient";

// ── Constants ─────────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  "the","a","an","of","in","for","to","with","and","or","on","at","by",
  "from","into","using","via","how","what","when","why","this","that",
  "your","our","its","is","are","was","be","can","will","has","have",
  "more","over","data","learn","basic","advanced","intro","introduction",
  "write","python","solution","here","problem","given","return","find",
  "array","list","output","input","example","note","approach","code",
]);

const PATH_LABELS = {
  ds: "Data Science", genai: "Gen AI", agentic: "Agentic AI",
  dsa: "DSA", aicxm_aws: "AWS", aicxm_azure: "Azure",
  aicxm_databricks: "Databricks",
};
const STATUS_COLOR = { complete: "#00ff88", in_progress: "#f59e0b" };
const STATUS_LABEL = { complete: "Complete", in_progress: "In Progress" };

// ── TipTap JSON → plain text ──────────────────────────────────────────────────
function tiptapToText(json) {
  if (!json) return "";
  if (typeof json === "string") return json;
  const walk = (node) => {
    if (!node) return "";
    if (node.type === "text") return node.text || "";
    if (node.content) return node.content.map(walk).join(" ");
    return "";
  };
  return walk(json);
}

// ── Keyword extractor ─────────────────────────────────────────────────────────
function extractKeywords(text) {
  if (!text) return new Set();
  return new Set(
    text.toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 3 && !STOPWORDS.has(w))
  );
}

// ── Keyword pool builders ─────────────────────────────────────────────────────
function getCurriculumKeywords(module) {
  const parts = [
    module.title || "",
    module.subtitle || "",
    ...(module.subtopics || []).map(s => typeof s === "object" ? s.title : s),
  ];
  return extractKeywords(parts.join(" "));
}

function getNotesKeywords(module, moduleNoteText) {
  const subtopicContent = (module.subtopics || [])
    .map(s => (typeof s === "object" ? s.content || "" : ""))
    .join(" ");
  return extractKeywords([subtopicContent, moduleNoteText || ""].join(" "));
}

// ── Build edges from nodes + keyword function ─────────────────────────────────
function buildEdges(nodes, keywordFn) {
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const kA = keywordFn(nodes[i]);
      const kB = keywordFn(nodes[j]);
      const shared = [...kA].filter(k => kB.has(k));
      if (shared.length >= 2) {
        edges.push({
          id: `${nodes[i].id}--${nodes[j].id}`,
          source: nodes[i].id,
          target: nodes[j].id,
          strength: Math.min(shared.length, 6),
          sharedTerms: shared.slice(0, 5),
        });
      }
    }
  }
  return edges;
}

// ── Build flat module list from pathsData ─────────────────────────────────────
function buildNodes(pathsData, filterPaths, filterStatuses) {
  const nodes = [];
  Object.entries(pathsData).forEach(([pathKey, path]) => {
    if (!path?.nodes) return;
    if (filterPaths.length > 0 && !filterPaths.includes(pathKey)) return;
    (path.nodes || []).forEach(node => {
      (node.modules || []).forEach(module => {
        if (!filterStatuses.includes(module.status)) return;
        const completedSubs = (module.subtopics || [])
          .filter(s => typeof s === "object" && s.status === "complete").length;
        nodes.push({
          id: module.id || `${pathKey}-${node.id}-${module.title}`,
          label: module.title,
          pathKey, nodeId: node.id, nodeTitle: node.title, moduleId: module.id,
          status: module.status, color: path.color || "#3b82f6",
          completedSubs, totalSubs: (module.subtopics || []).length,
          radius: Math.max(8, Math.min(22, 8 + completedSubs * 1.4)),
          _module: module,
        });
      });
    });
  });
  return nodes;
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
function Tooltip({ data, pos, isNotesTab }) {
  if (!data || !pos) return null;
  const statusC = STATUS_COLOR[data.status] || "#888";
  return (
    <div style={{
      position: "fixed", left: pos.x + 16, top: pos.y - 8,
      background: "var(--bg2,#0d1117)", border: `1px solid ${data.color}60`,
      borderRadius: 10, padding: "12px 16px", pointerEvents: "none", zIndex: 1000,
      minWidth: 200, maxWidth: 280,
      boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${data.color}20`,
    }}>
      <div style={{ fontSize: 11, fontWeight: 900, color: data.color, letterSpacing: "0.5px", marginBottom: 4 }}>
        {(PATH_LABELS[data.pathKey] || data.pathKey || "").toUpperCase()}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text,#e6edf3)", lineHeight: 1.3, marginBottom: 8 }}>
        {data.label}
      </div>
      <div style={{ fontSize: 10, color: "var(--text3,#8b949e)", marginBottom: 6 }}>📁 {data.nodeTitle}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: data.sharedTerms?.length ? 8 : 0 }}>
        <span style={{ fontSize: 9, fontWeight: 800, color: statusC, background: `${statusC}18`, border: `1px solid ${statusC}40`, borderRadius: 4, padding: "2px 6px" }}>
          {STATUS_LABEL[data.status]}
        </span>
        {data.totalSubs > 0 && <span style={{ fontSize: 10, color: "var(--text3,#8b949e)" }}>{data.completedSubs}/{data.totalSubs} topics</span>}
        {isNotesTab && (
          <span style={{
            fontSize: 9, fontWeight: 800,
            color: data.hasNotes ? "#a78bfa" : "var(--text3,#8b949e)",
            background: data.hasNotes ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${data.hasNotes ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 4, padding: "2px 6px",
          }}>
            {data.hasNotes ? "📝 HAS NOTES" : "NO NOTES YET"}
          </span>
        )}
      </div>
      {data.sharedTerms?.length > 0 && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 8, marginTop: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text3,#8b949e)", letterSpacing: "0.5px", marginBottom: 4 }}>
            {isNotesTab ? "CONNECTED VIA YOUR NOTES" : "CONNECTED VIA"}
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {data.sharedTerms.map(t => (
              <span key={t} style={{
                fontSize: 9, padding: "2px 6px", borderRadius: 4,
                background: isNotesTab ? "rgba(167,139,250,0.15)" : `${data.color}20`,
                color: isNotesTab ? "#a78bfa" : data.color,
                border: `1px solid ${isNotesTab ? "rgba(167,139,250,0.3)" : `${data.color}30`}`,
                fontWeight: 700,
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop: 8, fontSize: 9, color: "var(--text3,#8b949e)", opacity: 0.6 }}>Click to open module →</div>
    </div>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
function StatsBar({ nodes, edges, isNotesTab }) {
  const parent = {};
  nodes.forEach(n => { parent[n.id] = n.id; });
  const find = (x) => parent[x] === x ? x : (parent[x] = find(parent[x]));
  edges.forEach(e => {
    const ps = find(typeof e.source === "object" ? e.source.id : e.source);
    const pt = find(typeof e.target === "object" ? e.target.id : e.target);
    if (ps !== pt) parent[ps] = pt;
  });
  const clusters = new Set(nodes.map(n => find(n.id))).size;
  const stats = [
    { icon: <BookOpen size={11} />, label: "Concepts",    value: nodes.length },
    { icon: <GitBranch size={11}/>, label: "Connections", value: edges.length },
    { icon: <Layers size={11} />,   label: "Clusters",    value: clusters },
    ...(isNotesTab
      ? [{ icon: <FileText size={11}/>, label: "With Notes", value: nodes.filter(n => n.hasNotes).length }]
      : []),
  ];
  return (
    <div style={{
      position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
      display: "flex", gap: 2,
      background: "rgba(13,17,23,0.85)",
      border: `1px solid ${isNotesTab ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 12, padding: "8px 4px",
      backdropFilter: "blur(12px)", zIndex: 10,
    }}>
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 && <div style={{ width: 1, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px" }}>
            <span style={{ color: isNotesTab ? "#a78bfa" : "var(--text3,#8b949e)" }}>{s.icon}</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: "var(--text,#e6edf3)", fontFamily: "monospace" }}>{s.value}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text3,#8b949e)", letterSpacing: "0.5px" }}>{s.label.toUpperCase()}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ── D3 Graph Canvas ───────────────────────────────────────────────────────────
function GraphCanvas({ nodes, edges, isNotesTab, onNavigate, highlightedIds }) {
  const svgRef  = useRef(null);
  const zoomRef = useRef(null);
  const [tooltip, setTooltip] = useState({ data: null, pos: null });

  const zoomIn    = () => d3.select(svgRef.current).transition().call(zoomRef.current?.scaleBy, 1.4);
  const zoomOut   = () => d3.select(svgRef.current).transition().call(zoomRef.current?.scaleBy, 0.7);
  const resetView = () => {
    const w = svgRef.current?.clientWidth || 900;
    const h = svgRef.current?.clientHeight || 700;
    d3.select(svgRef.current).transition().duration(600)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(w / 2, h / 2).scale(0.85));
  };
  const fitAll = () => {
    if (!svgRef.current || nodes.length === 0) return;
    const w = svgRef.current.clientWidth;
    const h = svgRef.current.clientHeight;
    const simNodes = [];
    d3.select(svgRef.current).selectAll(".node-grp").each(function(d) { if (d) simNodes.push(d); });
    if (!simNodes.length) return;
    const xs = simNodes.map(n => n.x || 0), ys = simNodes.map(n => n.y || 0);
    const scale = Math.min(0.9, 0.8 / Math.max(
      (Math.max(...xs) - Math.min(...xs)) / w,
      (Math.max(...ys) - Math.min(...ys)) / h, 0.01
    ));
    const tx = w / 2 - scale * (Math.min(...xs) + Math.max(...xs)) / 2;
    const ty = h / 2 - scale * (Math.min(...ys) + Math.max(...ys)) / 2;
    d3.select(svgRef.current).transition().duration(700)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  };

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width  = svgRef.current.clientWidth  || 900;
    const height = svgRef.current.clientHeight || 700;
    const g = svg.append("g").attr("class", "zoom-g");

    const zoom = d3.zoom().scaleExtent([0.1, 4])
      .on("zoom", ev => g.attr("transform", ev.transform));
    svg.call(zoom);
    zoomRef.current = zoom;
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85));

    if (!nodes.length) return;

    const simNodes = nodes.map(n => ({ ...n, x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400 }));
    const nodeById = Object.fromEntries(simNodes.map(n => [n.id, n]));
    const simEdges = edges.map(e => ({
      ...e,
      source: nodeById[e.source] || e.source,
      target: nodeById[e.target] || e.target,
    }));

    // Defs: glow
    const defs = svg.append("defs");
    const glow = defs.append("filter").attr("id", "kg-glow")
      .attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const fm = glow.append("feMerge");
    fm.append("feMergeNode").attr("in", "coloredBlur");
    fm.append("feMergeNode").attr("in", "SourceGraphic");

    // Edges
    const edgeSel = g.append("g").selectAll("line")
      .data(simEdges).join("line")
      .attr("stroke", d => {
        if (isNotesTab) return "#a78bfa";
        return (typeof d.source === "object" ? d.source : nodeById[d.source])?.color || "#444";
      })
      .attr("stroke-width", d => 0.5 + d.strength * 0.3)
      .attr("stroke-opacity", 0.15)
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", isNotesTab ? "5 3" : "none");

    // Node groups
    const nodeSel = g.append("g").selectAll("g")
      .data(simNodes).join("g")
      .attr("class", "node-grp")
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", (ev, d) => { if (!ev.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag",  (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
        .on("end",   (ev)    => { if (!ev.active) sim.alphaTarget(0); })
      );

    // Glow ring
    nodeSel.filter(d => d.status === "complete" || (isNotesTab && d.hasNotes))
      .append("circle")
      .attr("r", d => d.radius + 5).attr("fill", "none")
      .attr("stroke", d => (isNotesTab && d.hasNotes) ? "#a78bfa" : d.color)
      .attr("stroke-width", 1).attr("stroke-opacity", 0.2)
      .attr("filter", "url(#kg-glow)");

    // Main circle
    nodeSel.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => {
        if (isNotesTab && !d.hasNotes) return "rgba(255,255,255,0.03)";
        if (isNotesTab && d.hasNotes)  return "rgba(167,139,250,0.12)";
        return `${d.color}22`;
      })
      .attr("stroke", d => {
        if (isNotesTab && !d.hasNotes) return "rgba(255,255,255,0.12)";
        if (isNotesTab && d.hasNotes)  return "#a78bfa";
        return d.color;
      })
      .attr("stroke-width", d => (isNotesTab && d.hasNotes) ? 2 : (d.status === "complete" ? 2 : 1.5))
      .attr("stroke-opacity", d => (isNotesTab && !d.hasNotes) ? 0.25 : 0.85);

    // Notes dot (purple) / status dot (green/amber)
    if (isNotesTab) {
      nodeSel.filter(d => d.hasNotes)
        .append("circle").attr("r", 3.5)
        .attr("cx", d => d.radius - 3).attr("cy", d => -d.radius + 3)
        .attr("fill", "#a78bfa");
    } else {
      nodeSel.append("circle").attr("r", 3)
        .attr("cx", d => d.radius - 3).attr("cy", d => -d.radius + 3)
        .attr("fill", d => STATUS_COLOR[d.status] || "#888");
    }

    // Label
    nodeSel.append("text")
      .text(d => { const w = d.label.split(" "); return w.length > 2 ? w.slice(0, 2).join(" ") + "…" : d.label; })
      .attr("text-anchor", "middle").attr("dy", d => d.radius + 14)
      .attr("font-size", 9).attr("font-weight", 700)
      .attr("fill", d => (isNotesTab && !d.hasNotes) ? "rgba(255,255,255,0.18)" : "var(--text2,#8b949e)")
      .attr("font-family", "system-ui,sans-serif")
      .style("pointer-events", "none").style("user-select", "none");

    // Hover
    nodeSel
      .on("mouseenter", function(event, d) {
        const connected = new Set([d.id]);
        simEdges.forEach(e => {
          const s = typeof e.source === "object" ? e.source.id : e.source;
          const t = typeof e.target === "object" ? e.target.id : e.target;
          if (s === d.id || t === d.id) { connected.add(s); connected.add(t); }
        });
        edgeSel
          .attr("stroke-opacity", e => {
            const s = typeof e.source === "object" ? e.source.id : e.source;
            const t = typeof e.target === "object" ? e.target.id : e.target;
            return (s === d.id || t === d.id) ? 0.8 : 0.04;
          })
          .attr("stroke-width", e => {
            const s = typeof e.source === "object" ? e.source.id : e.source;
            const t = typeof e.target === "object" ? e.target.id : e.target;
            return (s === d.id || t === d.id) ? 2.5 : 0.5 + e.strength * 0.3;
          });
        nodeSel.select("circle")
          .attr("stroke-opacity", nd => connected.has(nd.id) ? 0.9 : 0.1)
          .attr("fill-opacity",   nd => connected.has(nd.id) ? 1   : 0.2);

        const allShared = [...new Set(
          simEdges
            .filter(e => { const s = typeof e.source==="object"?e.source.id:e.source; const t=typeof e.target==="object"?e.target.id:e.target; return s===d.id||t===d.id; })
            .flatMap(e => e.sharedTerms)
        )].slice(0, 6);
        setTooltip({ data: { ...d, sharedTerms: allShared }, pos: { x: event.clientX, y: event.clientY } });
      })
      .on("mousemove", function(event) {
        setTooltip(prev => prev.data ? { ...prev, pos: { x: event.clientX, y: event.clientY } } : prev);
      })
      .on("mouseleave", function() {
        edgeSel.attr("stroke-opacity", 0.15).attr("stroke-width", d => 0.5 + d.strength * 0.3);
        nodeSel.select("circle")
          .attr("stroke-opacity", d => (isNotesTab && !d.hasNotes) ? 0.25 : 0.85)
          .attr("fill-opacity", 1);
        setTooltip({ data: null, pos: null });
      })
      .on("click", (ev, d) => { ev.stopPropagation(); onNavigate?.(d.pathKey, d.nodeId, d.moduleId); });

    // Simulation
    const sim = d3.forceSimulation(simNodes)
      .force("link",    d3.forceLink(simEdges).id(d => d.id).distance(d => 80 + (6 - Math.min(d.strength, 6)) * 10).strength(d => 0.15 + d.strength * 0.05))
      .force("charge",  d3.forceManyBody().strength(-160))
      .force("collide", d3.forceCollide().radius(d => d.radius + 16))
      .force("x",       d3.forceX(0).strength(0.04))
      .force("y",       d3.forceY(0).strength(0.04))
      .alphaDecay(0.025);

    sim.on("tick", () => {
      edgeSel
        .attr("x1", d => (typeof d.source==="object"?d.source:nodeById[d.source])?.x||0)
        .attr("y1", d => (typeof d.source==="object"?d.source:nodeById[d.source])?.y||0)
        .attr("x2", d => (typeof d.target==="object"?d.target:nodeById[d.target])?.x||0)
        .attr("y2", d => (typeof d.target==="object"?d.target:nodeById[d.target])?.y||0);
      nodeSel.attr("transform", d => `translate(${d.x||0},${d.y||0})`);
    });

    return () => sim.stop();
  }, [nodes, edges, isNotesTab]);

  // Search highlight
  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll(".node-grp circle:first-of-type")
      .attr("stroke", function(d) {
        if (!d) return "#888";
        if (highlightedIds.size > 0 && highlightedIds.has(d.id)) return "#fff";
        if (isNotesTab && !d.hasNotes) return "rgba(255,255,255,0.12)";
        if (isNotesTab && d.hasNotes)  return "#a78bfa";
        return d.color || "#888";
      })
      .attr("stroke-width", function(d) {
        if (!d) return 1.5;
        if (highlightedIds.size > 0 && highlightedIds.has(d.id)) return 3.5;
        return (isNotesTab && d.hasNotes) ? 2 : (d?.status === "complete" ? 2 : 1.5);
      });
  }, [highlightedIds, isNotesTab]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%", display: "block" }} />

      {/* Zoom controls */}
      <div style={{ position: "absolute", right: 20, top: 20, display: "flex", flexDirection: "column", gap: 4 }}>
        {[
          { icon: <ZoomIn size={13}/>,    action: zoomIn,    title: "Zoom in"  },
          { icon: <ZoomOut size={13}/>,   action: zoomOut,   title: "Zoom out" },
          { icon: <Maximize2 size={13}/>, action: fitAll,    title: "Fit all"  },
          { icon: <RotateCcw size={13}/>, action: resetView, title: "Reset"    },
        ].map(({ icon, action, title }) => (
          <button key={title} onClick={action} title={title} style={{
            width: 30, height: 30, borderRadius: 8,
            background: "rgba(13,17,23,0.85)", border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--text2,#8b949e)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)", transition: "all .15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.3)"; e.currentTarget.style.color="var(--text,#e6edf3)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="var(--text2,#8b949e)"; }}
          >{icon}</button>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        position: "absolute", left: 20, top: 20,
        background: "rgba(13,17,23,0.85)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10, padding: "10px 14px", backdropFilter: "blur(8px)",
      }}>
        <div style={{ fontSize: 8, fontWeight: 900, color: "var(--text3,#8b949e)", letterSpacing: "0.8px", marginBottom: 8 }}>LEGEND</div>
        {isNotesTab ? (
          <>
            {[
              { fill: "rgba(167,139,250,0.12)", border: "#a78bfa",               label: "Has notes"    },
              { fill: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", label: "No notes yet", dim: true },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: l.fill, border: `1.5px solid ${l.border}`, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "var(--text2,#8b949e)", fontWeight: 600, opacity: l.dim ? 0.45 : 1 }}>{l.label}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 6, marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 22, height: 0, borderTop: "1.5px dashed #a78bfa", opacity: 0.7 }} />
                <span style={{ fontSize: 10, color: "var(--text2,#8b949e)", fontWeight: 600 }}>Note connection</span>
              </div>
              <div style={{ fontSize: 9, color: "var(--text3,#8b949e)", marginTop: 4, lineHeight: 1.4 }}>
                Thicker = more shared<br/>note keywords
              </div>
            </div>
          </>
        ) : (
          <>
            {[{ color: "#00ff88", label: "Complete" }, { color: "#f59e0b", label: "In Progress" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: `${l.color}20`, border: `1.5px solid ${l.color}`, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "var(--text2,#8b949e)", fontWeight: 600 }}>{l.label}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 6, marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 20, height: 1.5, background: "rgba(255,255,255,0.3)", borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: "var(--text2,#8b949e)", fontWeight: 600 }}>Shared keywords</span>
              </div>
              <div style={{ fontSize: 9, color: "var(--text3,#8b949e)", marginTop: 4, lineHeight: 1.4 }}>Thicker = more overlap</div>
            </div>
          </>
        )}
      </div>

      <Tooltip data={tooltip.data} pos={tooltip.pos} isNotesTab={isNotesTab} />
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function KnowledgeGraph({ pathsData, userId, onClose, onNavigate }) {
  const [activeTab,      setActiveTab]      = useState("curriculum");
  const [search,         setSearch]         = useState("");
  const [filterPaths,    setFilterPaths]    = useState([]);
  const [filterStatuses, setFilterStatuses] = useState(["complete", "in_progress"]);
  const [moduleNotesMap, setModuleNotesMap] = useState({});
  const [notesLoading,   setNotesLoading]   = useState(false);

  const availablePaths = useMemo(() => Object.keys(pathsData).filter(k => pathsData[k]?.nodes), [pathsData]);

  // Load Supabase module_notes once when MY NOTES tab opens
  useEffect(() => {
    if (activeTab !== "notes" || !userId || Object.keys(moduleNotesMap).length > 0) return;
    setNotesLoading(true);
    (async () => {
      try {
        const { data, error } = await supabase
          .from("module_notes").select("module_id, content").eq("user_id", userId);
        if (error) throw error;
        const map = {};
        (data || []).forEach(row => { map[row.module_id] = tiptapToText(row.content); });
        setModuleNotesMap(map);
      } catch (err) {
        console.error("KnowledgeGraph notes load error:", err);
      } finally {
        setNotesLoading(false);
      }
    })();
  }, [activeTab, userId]);

  const baseNodes = useMemo(
    () => buildNodes(pathsData, filterPaths, filterStatuses),
    [pathsData, filterPaths, filterStatuses]
  );

  // CURRICULUM tab
  const curriculumEdges = useMemo(
    () => buildEdges(baseNodes, n => getCurriculumKeywords(n._module)),
    [baseNodes]
  );

  // MY NOTES tab — annotate nodes with hasNotes, build edges only from note keywords
  const notesNodes = useMemo(() => baseNodes.map(n => {
    const noteText      = moduleNotesMap[n.moduleId] || moduleNotesMap[n.id] || "";
    const subtopicText  = (n._module?.subtopics || []).map(s => typeof s === "object" ? s.content || "" : "").join(" ");
    const hasNotes      = noteText.trim().length > 20 || subtopicText.trim().length > 20;
    return { ...n, hasNotes, _noteText: noteText, _subtopicText: subtopicText };
  }), [baseNodes, moduleNotesMap]);

  const notesEdges = useMemo(
    () => buildEdges(notesNodes.filter(n => n.hasNotes), n => getNotesKeywords(n._module, n._noteText)),
    [notesNodes]
  );

  const isNotesTab   = activeTab === "notes";
  const activeNodes  = isNotesTab ? notesNodes : baseNodes;
  const activeEdges  = isNotesTab ? notesEdges : curriculumEdges;

  const highlightedIds = useMemo(() => {
    if (!search.trim()) return new Set();
    const q = search.toLowerCase();
    return new Set(activeNodes.filter(n => n.label.toLowerCase().includes(q)).map(n => n.id));
  }, [search, activeNodes]);

  const togglePath   = k => setFilterPaths(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);
  const toggleStatus = s => setFilterStatuses(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const isEmpty      = activeNodes.length === 0;

  return (
    <div style={{
      flex: 1,
      background: "var(--bg,#0d1117)",
      display: "flex", flexDirection: "column",
      minWidth: 0,
      height: "100%",
    }}>

      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 20px",
        borderBottom: "1px solid var(--border,rgba(255,255,255,0.08))",
        background: "rgba(13,17,23,0.95)", backdropFilter: "blur(12px)",
        flexShrink: 0, flexWrap: "wrap",
      }}>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 4 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GitBranch size={14} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text,#e6edf3)" }}>Knowledge Graph</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text3,#8b949e)", letterSpacing: "0.5px" }}>
              {activeNodes.length} CONCEPTS · {activeEdges.length} CONNECTIONS
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 2, padding: 3, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9 }}>
          {[
            { id: "curriculum", label: "CURRICULUM", icon: <BookOpen size={11}/> },
            { id: "notes",      label: "MY NOTES",   icon: <FileText size={11}/> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer",
              fontSize: 10, fontWeight: 800, letterSpacing: "0.5px",
              background: activeTab === tab.id
                ? (tab.id === "notes" ? "rgba(167,139,250,0.15)" : "rgba(99,102,241,0.15)")
                : "transparent",
              color: activeTab === tab.id
                ? (tab.id === "notes" ? "#a78bfa" : "#818cf8")
                : "var(--text3,#8b949e)",
              transition: "all .15s",
            }}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />

        {/* Path filters */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text3,#8b949e)", letterSpacing: "0.5px" }}>PATH</span>
          {availablePaths.map(key => {
            const active = filterPaths.length === 0 || filterPaths.includes(key);
            const color  = pathsData[key]?.color || "#3b82f6";
            return (
              <button key={key} onClick={() => togglePath(key)} style={{
                padding: "3px 9px", borderRadius: 6, fontSize: 9, fontWeight: 800, cursor: "pointer",
                background: active ? `${color}22` : "transparent",
                border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`,
                color: active ? color : "var(--text3,#8b949e)", transition: "all .15s",
              }}>
                {(PATH_LABELS[key] || key).toUpperCase().slice(0, 8)}
              </button>
            );
          })}
        </div>

        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />

        {/* Status filters */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text3,#8b949e)", letterSpacing: "0.5px" }}>SHOW</span>
          {[["complete","Complete","#00ff88"],["in_progress","In Progress","#f59e0b"]].map(([s,label,color]) => (
            <button key={s} onClick={() => toggleStatus(s)} style={{
              padding: "3px 9px", borderRadius: 6, fontSize: 9, fontWeight: 800, cursor: "pointer",
              background: filterStatuses.includes(s) ? `${color}18` : "transparent",
              border: `1px solid ${filterStatuses.includes(s) ? color : "rgba(255,255,255,0.1)"}`,
              color: filterStatuses.includes(s) ? color : "var(--text3,#8b949e)", transition: "all .15s",
            }}>{label}</button>
          ))}
        </div>

        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />

        <input type="text" placeholder="Search concepts…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: "5px 12px", borderRadius: 8, fontSize: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text,#e6edf3)", outline: "none", width: 160 }} />

        <button onClick={onClose} style={{ marginLeft: "auto", padding: "6px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "var(--text2,#8b949e)", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <X size={15} />
        </button>
      </div>

      {/* MY NOTES hint banner */}
      {isNotesTab && (
        <div style={{
          padding: "7px 20px", background: "rgba(167,139,250,0.07)",
          borderBottom: "1px solid rgba(167,139,250,0.15)",
          fontSize: 10, color: "#a78bfa", fontWeight: 700, letterSpacing: "0.3px",
          display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
        }}>
          <FileText size={11} />
          Connections come from your subtopic notes &amp; module notes. Write more to strengthen the graph.
          {notesLoading && <><Loader2 size={11} style={{ animation: "spin 1s linear infinite", marginLeft: 6 }} /> Loading notes…</>}
        </div>
      )}

      {/* Canvas */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {isEmpty ? (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: isNotesTab ? "rgba(167,139,250,0.08)" : "rgba(99,102,241,0.08)",
              border: `1px solid ${isNotesTab ? "rgba(167,139,250,0.2)" : "rgba(99,102,241,0.2)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {isNotesTab ? <FileText size={32} color="#a78bfa" strokeWidth={1.5}/> : <GitBranch size={32} color="#6366f1" strokeWidth={1.5}/>}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text,#e6edf3)", marginBottom: 8 }}>
                {isNotesTab ? "No note connections yet" : "Your knowledge graph is empty"}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.7, color: "var(--text3,#8b949e)", maxWidth: 340 }}>
                {isNotesTab
                  ? <>Open any module → MY NOTES tab and start writing.<br/>Open subtopics and add notes there too.<br/>Connections appear automatically as you write.</>
                  : <>Complete or start modules in the roadmap.<br/>Each module becomes a node — edges form<br/>automatically from shared concepts.</>}
              </div>
            </div>
          </div>
        ) : (
          <GraphCanvas
            key={`${activeTab}-${filterPaths.join()}-${filterStatuses.join()}`}
            nodes={activeNodes}
            edges={activeEdges}
            isNotesTab={isNotesTab}
            onNavigate={onNavigate}
            highlightedIds={highlightedIds}
          />
        )}
        {!isEmpty && <StatsBar nodes={activeNodes} edges={activeEdges} isNotesTab={isNotesTab} />}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}