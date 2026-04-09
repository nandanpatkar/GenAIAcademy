import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import { X, ZoomIn, ZoomOut, Maximize2, Sparkles, Layers, Info, Orbit } from "lucide-react";

export default function KnowledgeGalaxy({ nodes: pathsData, activePath, onNodeClick, onModuleClick, onSubtopicClick, onClose }) {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const transformRef = useRef(d3.zoomIdentity);

  // ── Neural Galaxy Status Colors ──
  const STATUS_COLORS = {
    mastered: "#8eff71",
    evolving: "#d873ff",
    ready: "#8ff5ff",
  };

  const getStatusColor = (item) => {
    if (item.status === "complete") return STATUS_COLORS.mastered;
    if (item.status === "in_progress") return STATUS_COLORS.evolving;
    return STATUS_COLORS.ready;
  };

  // ── Data Transformation ──
  const graphData = useMemo(() => {
    const nodes = [];
    const links = [];
    const rootId = "root-genai";

    nodes.push({
      id: rootId, type: "root", label: "GenAI Academy",
      depth: 0, size: 20, color: "#fff", status: "complete"
    });

    Object.keys(pathsData).forEach((pathKey) => {
      const pathValue = pathsData[pathKey];
      const nebulaId = `path-${pathKey}`;
      
      nodes.push({
        id: nebulaId, type: "path", label: pathValue.label || pathKey,
        depth: 1, pathId: pathKey, size: 14, color: pathValue.color || "#00ff88", status: "ready"
      });

      links.push({ source: rootId, target: nebulaId, depth: 1 });

      (pathValue.nodes || []).forEach((node) => {
        const starId = `star-${node.id}`;
        nodes.push({
          id: starId, type: "star", label: node.title,
          depth: 2, pathId: pathKey, size: 9, 
          color: pathValue.color || STATUS_COLORS.ready,
          statusColor: getStatusColor(node),
          status: node.status || "ready",
          originalData: node,
          z: Math.random() * 40 - 20
        });

        links.push({ source: nebulaId, target: starId, depth: 2 });

        (node.modules || []).forEach((mod) => {
          const satelliteId = `sat-${mod.id}`;
          nodes.push({
            id: satelliteId, type: "satellite", label: mod.title,
            depth: 3, pathId: pathKey, size: 4,
            color: pathValue.color || STATUS_COLORS.ready,
            statusColor: getStatusColor(mod),
            status: mod.status || "ready",
            originalNode: node,
            originalModule: mod,
            z: Math.random() * 20 - 10
          });

          links.push({ source: starId, target: satelliteId, depth: 3 });

          (mod.subtopics || []).forEach((topic, tidx) => {
            const topicLabel = typeof topic === "object" ? topic.title : topic;
            const topicId = `topic-${mod.id}-${tidx}`;
            nodes.push({
              id: topicId, type: "subtopic", label: topicLabel,
              depth: 4, pathId: pathKey, size: 1.5,
              color: pathValue.color || STATUS_COLORS.ready,
              statusColor: typeof topic === "object" && topic.status === "complete" ? STATUS_COLORS.mastered : "rgba(255,255,255,0.1)",
              status: typeof topic === "object" ? topic.status : "ready",
              originalNode: node,
              originalModule: mod,
              originalTopic: topicLabel,
              z: Math.random() * 10 - 5
            });

            links.push({ source: satelliteId, target: topicId, depth: 4 });
          });
        });
      });
    });

    return { nodes, links };
  }, [pathsData]);

  // ── Resize Observer ──
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Main Effect: Simulation & High Performance Hybrid Rendering ──
  useEffect(() => {
    if (!dimensions.width || !graphData.nodes.length || !canvasRef.current || !svgRef.current) return;

    const { width, height } = dimensions;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const interactionGroup = svg.append("g").attr("class", "interaction-group");
    const labelGroup = svg.append("g").attr("class", "label-group");

    // Initialize positions
    graphData.nodes.forEach(n => {
      if (!n.x) {
        n.x = width / 2 + (Math.random() - 0.5) * 100;
        n.y = height / 2 + (Math.random() - 0.5) * 100;
      }
    });

    const simulation = d3.forceSimulation(graphData.nodes)
      .alphaDecay(0.02)
      .velocityDecay(0.6)
      .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(d => d.target.depth === 4 ? 40 : 220 / (d.target.depth + 1)).strength(1.2))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(d => d.size + 15));

    // ── DRAWING LOGIC (The Performance Secret) ──
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(transformRef.current.x, transformRef.current.y);
      ctx.scale(transformRef.current.k, transformRef.current.k);

      // 1. Draw Links
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      graphData.links.forEach(l => {
        ctx.moveTo(l.source.x, l.source.y);
        ctx.lineTo(l.target.x, l.target.y);
      });
      ctx.stroke();

      // 2. Draw Nodes (Static stars)
      graphData.nodes.forEach(d => {
        const parallax = (transformRef.current.k - 1) * (d.z || 0) * 0.1;
        const x = d.x + parallax;
        const y = d.y + parallax;
        const size = d.size * (1 + (d.z || 0) * 0.005);

        // Glow for Mastered
        if (d.status === "complete") {
          ctx.shadowBlur = 15;
          ctx.shadowColor = d.statusColor || d.color;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = d.depth === 0 ? "#fff" : d.color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();

        if (d.depth === 0 || d.status === "complete") {
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
      ctx.restore();

      // update labels and interaction points (Sync with Canvas)
      updateInteractiveLayers();
    };

    // ── Interaction Layer ──
    const updateInteractiveLayers = () => {
      const transform = transformRef.current;
      const currentZoom = transform.k;

      // 1. Interactive points (SVG circles with fill-opacity="0")
      // We only update those actually moving or visible to save DOM ops
      const interactionCircles = interactionGroup.selectAll("circle")
        .data(graphData.nodes, d => d.id);

      interactionCircles.enter()
        .append("circle")
        .attr("fill", "transparent")
        .attr("cursor", d => d.depth > 0 ? "pointer" : "default")
        .call(d3.drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x; d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null; d.fy = null;
          })
        )
        .on("mouseenter", (event, d) => {
          if (d.depth === 0) return;
          const [mx, my] = d3.pointer(event, containerRef.current);
          setTooltip({ x: mx, y: my, label: d.label, type: d.type, status: d.status, color: d.color });
        })
        .on("mouseleave", () => setTooltip(null))
        .on("click", (event, d) => {
          if (!event.defaultPrevented) {
             if (d.type === "star" && onNodeClick) onNodeClick(d.originalData, d.pathId);
             else if (d.type === "satellite" && onModuleClick) onModuleClick(d.originalNode, d.originalModule, d.pathId);
             else if (d.type === "subtopic" && onSubtopicClick) onSubtopicClick(d.originalNode, d.originalModule, d.originalTopic, d.pathId);
             if (d.depth > 0) onClose();
          }
        })
        .merge(interactionCircles)
        .attr("cx", d => transform.applyX(d.x + (currentZoom - 1) * (d.z || 0) * 0.1))
        .attr("cy", d => transform.applyY(d.y + (currentZoom - 1) * (d.z || 0) * 0.1))
        .attr("r", d => d.size * currentZoom * 1.5); // Oversized for better hit area

      // 2. Optimized Labels
      const visibleLabels = graphData.nodes.filter(d => {
        if (d.depth < 2) return true;
        if (d.depth === 2 && currentZoom > 0.45) return true;
        if (d.depth === 3 && currentZoom > 1.8) return true;
        if (d.depth === 4 && currentZoom > 4.5) return true;
        return false;
      });

      const labels = labelGroup.selectAll("text")
        .data(visibleLabels, d => d.id);

      labels.exit().remove();

      labels.enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("text-shadow", "0 2px 4px rgba(0,0,0,0.8)")
        .style("pointer-events", "none")
        .merge(labels)
        .attr("x", d => transform.applyX(d.x + (currentZoom - 1) * (d.z || 0) * 0.1))
        .attr("y", d => transform.applyY(d.y + (currentZoom - 1) * (d.z || 0) * 0.1 + d.size * 2))
        .attr("font-size", d => (d.depth === 0 ? 14 : (d.depth === 1 ? 12 : 10)) + "px")
        .attr("font-weight", d => d.depth < 2 ? 800 : 400)
        .attr("opacity", d => d.depth < 2 ? 0.8 : (d.depth === 2 ? 0.6 : (d.depth === 3 ? 0.5 : 0.4)))
        .text(d => d.label.toUpperCase());
    };

    // ── Zoom Logic ──
    const zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .on("zoom", (event) => {
        transformRef.current = event.transform;
        setZoomLevel(event.transform.k);
        draw();
      });

    svg.call(zoom);
    simulation.on("tick", draw);

    return () => {
      simulation.stop();
    };
  }, [graphData, dimensions]);

  const handleZoom = (delta) => {
    const svg = d3.select(svgRef.current);
    svg.transition().duration(400).call(d3.zoom().scaleBy, delta);
  };

  return (
    <div className="knowledge-galaxy-container" ref={containerRef}>
      <div className="galaxy-overlay">
        <div className="galaxy-header">
          <div className="galaxy-title-row">
            <Orbit className="galaxy-icon" size={28} />
            <div className="galaxy-title-text">
              <h1>NEURAL CONSTELLATION</h1>
              <p>GenAI Academy Intelligence Grid</p>
            </div>
          </div>
          <button className="galaxy-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="galaxy-controls">
          <button className="galaxy-btn" onClick={() => handleZoom(1.5)}><ZoomIn size={18} /></button>
          <button className="galaxy-btn" onClick={() => handleZoom(0.7)}><ZoomOut size={18} /></button>
          <button className="galaxy-btn" onClick={() => d3.select(svgRef.current).transition().duration(500).call(d3.zoom().transform, d3.zoomIdentity)}><Maximize2 size={18} /></button>
          <div className="galaxy-indicator">{Math.round(zoomLevel * 100)}%</div>
        </div>

        <div className="galaxy-legend">
          <div className="legend-item"><span className="legend-dot" style={{ background: STATUS_COLORS.mastered, boxShadow: `0 0 10px ${STATUS_COLORS.mastered}` }} /> MASTERED</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: STATUS_COLORS.evolving, boxShadow: `0 0 10px ${STATUS_COLORS.evolving}` }} /> EVOLVING</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: STATUS_COLORS.ready }} /> READY</div>
        </div>

        <div className="galaxy-footer">
          <Sparkles size={12} />
          <span>60 FPS HYBRID ENGINE • DEEP SUBTOPIC EXPLORATION ENABLED</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="galaxy-canvas" />
      <svg ref={svgRef} className="galaxy-interaction-svg" />

      {tooltip && (
        <div className="galaxy-tooltip" style={{ left: tooltip.x + 15, top: tooltip.y + 15, "--tooltip-color": tooltip.color }}>
          <div className="tooltip-type">{tooltip.type.toUpperCase()} • {tooltip.status?.toUpperCase() || 'READY'}</div>
          <div className="tooltip-label">{tooltip.label}</div>
          <div className="tooltip-glow" />
        </div>
      )}

      <style jsx>{`
        .knowledge-galaxy-container {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: #020408;
          z-index: 2000;
          overflow: hidden;
          font-family: 'Syne', sans-serif;
        }
        .galaxy-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .galaxy-interaction-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
        }
        .galaxy-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .galaxy-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          pointer-events: auto;
        }
        .galaxy-title-row {
          display: flex; align-items: center; gap: 20px;
        }
        .galaxy-icon { color: #fff; animation: orbit 15s linear infinite; }
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .galaxy-title-text h1 {
          font-size: 32px; font-weight: 800; letter-spacing: 6px; margin: 0;
          background: linear-gradient(to right, #fff, #8eff71);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .galaxy-title-text p { color: rgba(255,255,255,0.4); font-size: 11px; letter-spacing: 3px; margin: 5px 0 0 0; }

        .galaxy-close {
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
          color: #fff; cursor: pointer; transition: all 0.3s;
        }
        .galaxy-close:hover { background: rgba(239, 68, 68, 0.2); border-color: #ef4444; transform: rotate(90deg); }

        .galaxy-controls {
          position: absolute; right: 40px; top: 130px;
          display: flex; flex-direction: column; gap: 12px;
          pointer-events: auto;
        }
        .galaxy-btn {
          width: 44px; height: 44px; border-radius: 14px;
          background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.8);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .galaxy-btn:hover { background: rgba(255,255,255,0.1); color: #8eff71; border-color: #8eff71; }

        .galaxy-indicator { font-size: 10px; color: rgba(255,255,255,0.4); text-align: center; font-weight: 800; }

        .galaxy-legend {
          background: rgba(5,7,10,0.8); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1); padding: 24px;
          border-radius: 20px; display: flex; flex-direction: column; gap: 16px;
          width: fit-content; pointer-events: auto;
        }
        .legend-item { display: flex; align-items: center; gap: 14px; font-size: 11px; color: rgba(255,255,255,0.6); letter-spacing: 1px; }
        .legend-dot { width: 8px; height: 8px; border-radius: 50%; }

        .galaxy-footer {
          position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 12px;
          color: rgba(255,255,255,0.3); font-size: 9px; letter-spacing: 2px;
        }

        .galaxy-tooltip {
          position: fixed; background: rgba(10,12,16,0.95); backdrop-filter: blur(20px);
          border: 1px solid var(--tooltip-color); padding: 16px 24px;
          border-radius: 16px; pointer-events: none; z-index: 100;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
        }
        .tooltip-type { font-size: 9px; letter-spacing: 3px; color: var(--tooltip-color); font-weight: 800; margin-bottom: 6px; }
        .tooltip-label { color: #fff; font-size: 15px; font-weight: 800; }
      `}</style>
    </div>
  );
}
