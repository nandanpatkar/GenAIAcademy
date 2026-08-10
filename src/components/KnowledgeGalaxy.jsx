import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";
import * as THREE from "three";
import { disposeThreeScene } from "../utils/disposeThreeScene";
import { X, Sparkles, Orbit, Plus, Minus, Link2, Zap, Eye, EyeOff, BookOpen, LibraryBig } from "lucide-react";
import { loadTopics, loadAllTopics } from "../services/avArchiveService";

/** Article titles run long; labels have to stay readable at zoom. */
const ARTICLE_LABEL_MAX = 46;
/** Ceiling on labels drawn per frame in 2D. Beyond this it is noise anyway. */
const LABEL_BUDGET = 320;

export default function KnowledgeGalaxy({ nodes: pathsData, activePath, onNodeClick, onModuleClick, onSubtopicClick, onArticleClick, onTopicClick, onClose, embedded = false }) {
  const canvasRef = useRef(null);
  const threeCanvasRef = useRef(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState("2d");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [edgeEditMode, setEdgeEditMode] = useState(null);
  const [edgeSelection, setEdgeSelection] = useState([]);
  const [edgeOverrides, setEdgeOverrides] = useState({});
  const [showEdges3d, setShowEdges3d] = useState(true);
  const [glowEnabled3d, setGlowEnabled3d] = useState(true);
  const [motionEnabled3d, setMotionEnabled3d] = useState(true);
  const [nodeTint3d, setNodeTint3d] = useState("#8ff5ff");
  const [saturation3d, setSaturation3d] = useState(1.35);
  const [brightness3d, setBrightness3d] = useState(1.28);
  const transformRef = useRef(d3.zoomIdentity);

  // ── Reading constellations (the blog archive's topic tree) ──
  // 457 extra nodes, so the embedded dashboard tile starts without them and the
  // full-screen view starts with them on.
  const [topicTree, setTopicTree] = useState(null);
  const [showTopics, setShowTopics] = useState(!embedded);
  // "ALL": every article instead of six samples per topic. 8,167 more nodes and
  // a 912 KB payload, so it is opt-in and the file is fetched on first use only.
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [loadingAll, setLoadingAll] = useState(false);

  const toggleAllPosts = () => {
    setShowTopics(true);
    setShowAllPosts(showingAll => !showingAll);
    setTooltip(null);
  };

  useEffect(() => {
    let alive = true;
    loadTopics().then(data => { if (alive) setTopicTree(data); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!showAllPosts || allPosts) return undefined;
    let alive = true;
    setLoadingAll(true);
    loadAllTopics().then(data => {
      if (!alive) return;
      // Flattened to `${clusterId}/${topicId}` -> posts so the graph builder
      // does a map lookup per topic instead of a nested search.
      const index = new Map();
      (data.clusters || []).forEach(cluster => {
        (cluster.topics || []).forEach(topic => {
          index.set(`${cluster.id}/${topic.id}`, topic.posts || []);
        });
      });
      setAllPosts(index);
      setLoadingAll(false);
    });
    return () => { alive = false; };
  }, [showAllPosts, allPosts]);

  // Held in refs rather than passed through the render effects' dependency
  // arrays: App passes these as inline arrows, and rebuilding the whole Three.js
  // scene on every parent render would be far more expensive than a ref read.
  const articleClickRef = useRef(onArticleClick);
  const topicClickRef = useRef(onTopicClick);
  useEffect(() => { articleClickRef.current = onArticleClick; }, [onArticleClick]);
  useEffect(() => { topicClickRef.current = onTopicClick; }, [onTopicClick]);

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

    Object.keys(pathsData)
      .filter(pathKey => !["workspace", "videoIntelligence", "saved_algos", "genai-roadmap-campusx"].includes(pathKey))
      .forEach((pathKey) => {
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

    // ── Reading constellations ──
    // The archive's topic tree hangs off the same root as the learning paths,
    // so a concept and the writing about it sit in one map. Depths line up with
    // the path hierarchy on purpose — the label/zoom thresholds and the 3D
    // shell radii below are keyed off depth and need no special cases.
    if (showTopics && topicTree?.clusters?.length) {
      // In ALL mode articles sit at depth 4 rather than 3. That is not cosmetic:
      // the 3D renderer builds a sphere mesh plus a glow sprite for every node
      // above depth 4 and folds depth >= 4 into one Points cloud, and the 2D
      // label thresholds step down at the same boundary. At six samples per
      // topic the heavier treatment is worth it; at 8,167 articles it is not.
      const full = showAllPosts ? allPosts : null;
      const articleDepth = full ? 4 : 3;
      const articleSize = full ? 2 : 3.5;

      topicTree.clusters.forEach((cluster) => {
        const clusterId = `av-cluster-${cluster.id}`;
        nodes.push({
          id: clusterId, type: "reading", label: cluster.label,
          depth: 1, size: 12, color: cluster.color, status: "ready",
          hint: `${cluster.n} ARTICLES`, archive: true,
        });
        links.push({ source: rootId, target: clusterId, depth: 1 });

        cluster.topics.forEach((topic) => {
          const topicNodeId = `av-topic-${cluster.id}-${topic.id}`;
          nodes.push({
            id: topicNodeId, type: "topic", label: topic.label,
            depth: 2, size: 7, color: cluster.color, statusColor: cluster.color,
            status: "ready", hint: `${topic.n} ARTICLES`, archive: true,
            topicLabel: topic.label, topicYear: topic.y,
            z: Math.random() * 40 - 20,
          });
          links.push({ source: clusterId, target: topicNodeId, depth: 2 });

          const posts = full
            ? (full.get(`${cluster.id}/${topic.id}`) || []).map(([s, t]) => ({ s, t }))
            : topic.posts;

          posts.forEach((post) => {
            const postId = `av-post-${post.s}-${cluster.id}-${topic.id}`;
            nodes.push({
              id: postId,
              type: "article",
              label: post.t.length > ARTICLE_LABEL_MAX
                ? `${post.t.slice(0, ARTICLE_LABEL_MAX - 1).trimEnd()}…`
                : post.t,
              depth: articleDepth, size: articleSize,
              color: cluster.color, statusColor: cluster.color,
              status: "ready", hint: "OPEN ARTICLE", archive: true,
              // In ALL mode these are drawn as a point cloud with no SVG hit
              // target of their own; the 2D layer picks them up via
              // simulation.find() instead of 8,167 more DOM nodes.
              leafHit: articleDepth === 4,
              slug: post.s, fullTitle: post.t,
              z: Math.random() * 20 - 10,
            });
            links.push({ source: topicNodeId, target: postId, depth: articleDepth });
          });
        });
      });
    }

    return { nodes, links };
  }, [pathsData, topicTree, showTopics, showAllPosts, allPosts]);

  const edgeKey = (source, target) => [source, target].sort().join("::");
  const graphLinks3d = useMemo(() => {
    const linksByKey = new Map(graphData.links.map(link => {
      const source = typeof link.source === "string" ? link.source : link.source.id;
      const target = typeof link.target === "string" ? link.target : link.target.id;
      return [edgeKey(source, target), { ...link, source, target }];
    }));

    Object.entries(edgeOverrides).forEach(([key, action]) => {
      if (action === "remove") linksByKey.delete(key);
      if (action === "add") {
        const [source, target] = key.split("::");
        linksByKey.set(key, { source, target, depth: 4, custom: true });
      }
    });

    return Array.from(linksByKey.values());
  }, [graphData, edgeOverrides]);

  const handleEdgeEditNode = (node) => {
    if (!edgeEditMode || !node) return false;
    if (!edgeSelection.length) {
      setEdgeSelection([node.id]);
      return true;
    }
    if (edgeSelection[0] === node.id) {
      setEdgeSelection([]);
      return true;
    }
    const key = edgeKey(edgeSelection[0], node.id);
    setEdgeOverrides(previous => ({ ...previous, [key]: edgeEditMode }));
    setEdgeSelection([]);
    return true;
  };

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
    if (viewMode !== "2d" || !dimensions.width || !graphData.nodes.length || !canvasRef.current || !svgRef.current) return;

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
        const isActivePath = activePath && d.pathId === activePath;

        // Glow for Mastered, and for the reading constellations' two upper
        // levels so they read as landmarks rather than as unvisited path nodes.
        if (d.status === "complete" || isActivePath) {
          ctx.shadowBlur = isActivePath ? 20 : 15;
          ctx.shadowColor = isActivePath ? "#22d3ee" : (d.statusColor || d.color);
        } else if (d.archive && d.depth <= 2) {
          ctx.shadowBlur = d.depth === 1 ? 18 : 10;
          ctx.shadowColor = d.color;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = d.depth === 0 ? "#fff" : (isActivePath ? "#22d3ee" : d.color);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();

        if (d.depth === 0 || d.status === "complete" || (isActivePath && d.depth === 1)) {
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
          setTooltip({
            x: mx, y: my, label: d.fullTitle || d.label, type: d.type,
            status: d.status, hint: d.hint, color: d.color,
          });
        })
        .on("mouseleave", () => setTooltip(null))
        .on("click", (event, d) => {
          if (!event.defaultPrevented) {
             if (d.type === "star" && onNodeClick) onNodeClick(d.originalData, d.pathId);
             else if (d.type === "satellite" && onModuleClick) onModuleClick(d.originalNode, d.originalModule, d.pathId);
             else if (d.type === "subtopic" && onSubtopicClick) onSubtopicClick(d.originalNode, d.originalModule, d.originalTopic, d.pathId);
             else if (d.type === "article") articleClickRef.current?.(d.slug);
             else if (d.type === "topic") topicClickRef.current?.(d.topicLabel, d.topicYear);
             // A cluster has nothing to open — it only groups its topics — so
             // clicking one must not dismiss the galaxy.
             else if (d.type === "reading") return;
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
        if (embedded && d.depth === 2 && currentZoom <= 1.45) return false;
        if (embedded && d.depth === 3 && currentZoom <= 3) return false;
        if (embedded && d.depth === 4 && currentZoom <= 5.5) return false;
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
        .attr("font-size", d => ((d.depth === 0 ? 12 : (d.depth === 1 ? 10 : 8)) * (embedded ? 0.58 : 1)) + "px")
        .attr("font-weight", d => d.depth < 2 ? (embedded ? 650 : 800) : 400)
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
  }, [graphData, dimensions, activePath, embedded, viewMode]);

  // ── 3D Effect: Orbitable depth graph ──
  useEffect(() => {
    if (viewMode !== "3d" || !dimensions.width || !graphData.nodes.length || !threeCanvasRef.current) return;

    const { width, height } = dimensions;
    const canvas = threeCanvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020408");
    // Keep emissive nodes equally vivid at every camera distance.
    scene.fog = null;

    const camera = new THREE.PerspectiveCamera(48, width / height, 1, 6000);
    const cameraDistance = embedded ? 920 : 1350;
    camera.position.set(0, 0, cameraDistance);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;

    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    const links = graphLinks3d;
    const positions = new Map();
    const rootNode = graphData.nodes.find(node => node.depth === 0);
    if (rootNode) positions.set(rootNode.id, new THREE.Vector3(0, 0, 0));

    // Obsidian-inspired core-to-surface layout: each depth occupies a calm
    // spherical shell instead of forming bright radial branches.
    const stableHash = value => {
      let hash = 0;
      for (let index = 0; index < value.length; index += 1) hash = (hash * 31 + value.charCodeAt(index)) | 0;
      return Math.abs(hash) / 2147483647;
    };
    const shellRadius = { 1: 250, 2: 430, 3: 570, 4: 680 };
    [1, 2, 3, 4].forEach(depth => {
      const shellNodes = graphData.nodes.filter(node => node.depth === depth);
      shellNodes.forEach((node, index) => {
        const ratio = (index + 0.5) / Math.max(shellNodes.length, 1);
        const phi = Math.acos(1 - 2 * ratio);
        const theta = Math.PI * (3 - Math.sqrt(5)) * index + stableHash(node.id) * Math.PI * 2;
        const radius = shellRadius[depth] + (stableHash(`${node.id}-radius`) - 0.5) * 54;
        positions.set(node.id, new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * radius,
          Math.cos(phi) * radius,
          Math.sin(phi) * Math.sin(theta) * radius
        ));
      });
    });

    // Subtle background star dust gives the graph depth without competing with topic nodes.
    const dustPositions = [];
    for (let index = 0; index < (embedded ? 260 : 520); index += 1) {
      const angle = index * 2.39996;
      const radius = 650 + (index % 17) * 48;
      dustPositions.push(
        Math.cos(angle) * radius,
        ((index % 23) - 11) * 42,
        Math.sin(angle) * radius
      );
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.Float32BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({
      color: "#30404a", size: embedded ? 1.5 : 2, transparent: true, opacity: 0.28,
      sizeAttenuation: true,
    }));
    galaxyGroup.add(dust);

    const linePositions = [];
    const lineColors = [];
    const linePairs = [];
    links.forEach(link => {
      const source = positions.get(link.source);
      const target = positions.get(link.target);
      if (!source || !target) return;
      linePositions.push(source.x, source.y, source.z, target.x, target.y, target.z);
      lineColors.push(0.24, 0.29, 0.33, 0.24, 0.29, 0.33);
      linePairs.push(link);
    });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineColorAttribute = new THREE.Float32BufferAttribute(lineColors, 3);
    lineGeometry.setAttribute("color", lineColorAttribute);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#ffffff", vertexColors: true, transparent: true, opacity: 0.34,
    });
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    lineSegments.visible = showEdges3d;
    galaxyGroup.add(lineSegments);

    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const glowContext = glowCanvas.getContext("2d");
    const glowGradient = glowContext.createRadialGradient(64, 64, 0, 64, 64, 64);
    glowGradient.addColorStop(0, "rgba(255,255,255,1)");
    glowGradient.addColorStop(0.16, "rgba(255,255,255,0.95)");
    glowGradient.addColorStop(0.42, "rgba(255,255,255,0.34)");
    glowGradient.addColorStop(1, "rgba(255,255,255,0)");
    glowContext.fillStyle = glowGradient;
    glowContext.fillRect(0, 0, glowCanvas.width, glowCanvas.height);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    glowTexture.minFilter = THREE.LinearFilter;

    const interactiveObjects = [];
    const labelSprites = [];
    const glowSprites = [];
    const makeLabel = (node, position) => {
      const labelCanvas = document.createElement("canvas");
      const labelContext = labelCanvas.getContext("2d");
      labelCanvas.width = 640;
      labelCanvas.height = 96;
      labelContext.font = `${node.depth === 0 ? 500 : 400} 26px Syne, sans-serif`;
      labelContext.fillStyle = "rgba(235, 242, 246, 0.7)";
      labelContext.textAlign = "center";
      labelContext.textBaseline = "middle";
      labelContext.fillText(node.label.toUpperCase(), labelCanvas.width / 2, labelCanvas.height / 2);
      const texture = new THREE.CanvasTexture(labelCanvas);
      texture.minFilter = THREE.LinearFilter;
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.82 }));
      sprite.userData.nodeId = node.id;
      sprite.position.copy(position);
      sprite.position.y += node.depth === 0 ? -28 : -(node.size * 3 + 11);
      sprite.scale.set(Math.max(42, Math.min(node.label.length * 3.3, 150)), 14, 1);
      galaxyGroup.add(sprite);
      labelSprites.push(sprite);
      return sprite;
    };

    const getNodeColor = node => {
      if (node.depth === 0) return "#f4f6f7";
      const color = new THREE.Color(node.color || node.statusColor || "#8ff5ff");
      color.lerp(new THREE.Color(nodeTint3d), 0.28);
      const hsl = {};
      color.getHSL(hsl);
      hsl.s = Math.min(1, Math.max(0.5, hsl.s * saturation3d));
      hsl.l = Math.min(0.92, Math.max(0.25, hsl.l * brightness3d));
      color.setHSL(hsl.h, hsl.s, hsl.l);
      if (node.status === "complete") color.offsetHSL(0.02, 0.05, 0.04);
      if (node.status === "in_progress") color.offsetHSL(-0.03, 0.06, 0.03);
      if (activePath && node.pathId === activePath) color.offsetHSL(0, 0.04, 0.06);
      return `#${color.getHexString()}`;
    };

    const makeGlow = (node, position, color) => {
      const glowSize = node.depth === 0 ? 150 : node.depth === 1 ? 76 : node.depth === 2 ? 42 : 26;
      const glowMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        color,
        transparent: true,
      opacity: node.depth === 0 ? 1 : node.depth === 1 ? 0.88 : node.depth === 2 ? 0.72 : 0.58,
      blending: THREE.AdditiveBlending,
      alphaTest: 0.02,
      depthTest: false,
      depthWrite: false,
      });
      const glow = new THREE.Sprite(glowMaterial);
      glow.position.copy(position);
      glow.scale.set(glowSize, glowSize, 1);
      glow.renderOrder = -1;
      glow.userData.nodeId = node.id;
      glow.userData.baseColor = color;
      glow.userData.baseOpacity = glowMaterial.opacity;
      glow.userData.baseScale = glowSize;
      galaxyGroup.add(glow);
      glowSprites.push(glow);
      return glow;
    };

    const leafPositions = [];
    const leafColors = [];
    let leafPositionAttribute = null;
    const leafMotion = [];
    const movingNodes = [];
    graphData.nodes.forEach(node => {
      const position = positions.get(node.id);
      if (!position) return;
      const color = getNodeColor(node);
      if (node.depth >= 4) {
        leafMotion.push({
          index: leafPositions.length / 3,
          basePosition: position.clone(),
          phase: stableHash(`${node.id}-phase`) * Math.PI * 2,
          speed: 0.38 + stableHash(`${node.id}-speed`) * 0.34,
          amplitude: 2.5 + stableHash(`${node.id}-amplitude`) * 3,
        });
        leafPositions.push(position.x, position.y, position.z);
        const leafColor = new THREE.Color(color);
        leafColors.push(leafColor.r, leafColor.g, leafColor.b);
        return;
      }
      const glow = glowEnabled3d ? makeGlow(node, position, color) : null;
      const geometry = new THREE.SphereGeometry(node.depth === 0 ? 12 : node.depth === 1 ? 7 : node.depth === 2 ? 4 : 2.2, 10, 10);
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: node.depth <= 2 ? 1 : 0.86 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      mesh.userData.node = node;
      mesh.userData.baseColor = color;
      mesh.userData.baseOpacity = material.opacity;
      galaxyGroup.add(mesh);
      interactiveObjects.push(mesh);
      const label = node.depth <= 2 ? makeLabel(node, position) : null;
      movingNodes.push({
        mesh,
        glow,
        label,
        basePosition: position.clone(),
        phase: stableHash(`${node.id}-phase`) * Math.PI * 2,
        speed: 0.42 + stableHash(`${node.id}-speed`) * 0.3,
        amplitude: node.depth === 0 ? 3 : node.depth === 1 ? 9 : node.depth === 2 ? 5 : 3,
        labelOffset: node.depth === 0 ? -28 : -(node.size * 3 + 11),
      });
    });

    if (leafPositions.length) {
      const leafGeometry = new THREE.BufferGeometry();
      leafPositionAttribute = new THREE.Float32BufferAttribute(leafPositions, 3);
      leafGeometry.setAttribute("position", leafPositionAttribute);
      leafGeometry.setAttribute("color", new THREE.Float32BufferAttribute(leafColors, 3));
      const leafGlowPoints = new THREE.Points(leafGeometry, new THREE.PointsMaterial({
        map: glowTexture, alphaTest: 0.02, size: embedded ? 12 : 16, sizeAttenuation: true, vertexColors: true,
        transparent: true, opacity: 0.46, blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      }));
      leafGlowPoints.visible = glowEnabled3d;
      galaxyGroup.add(leafGlowPoints);
      const leafPoints = new THREE.Points(leafGeometry, new THREE.PointsMaterial({
        map: glowTexture, alphaTest: 0.02, size: embedded ? 3.5 : 5, sizeAttenuation: true, vertexColors: true,
        transparent: true, opacity: 0.98, blending: THREE.AdditiveBlending,
      }));
      leafPoints.userData.leafNodes = graphData.nodes.filter(node => node.depth >= 4 && positions.has(node.id));
      galaxyGroup.add(leafPoints);
      interactiveObjects.push(leafPoints);
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let previousPointer = { x: 0, y: 0 };
    let rotationX = 0;
    let rotationY = 0;
    let hoveredNodeId = null;

    const getPointer = event => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const updateHover = node => {
      hoveredNodeId = node?.id || null;
      const relatedIds = new Set();
      const focusNodeId = hoveredNodeId || edgeSelection[0] || null;
      if (focusNodeId) {
        relatedIds.add(focusNodeId);
        links.forEach(link => {
          if (link.source === focusNodeId) relatedIds.add(link.target);
          if (link.target === focusNodeId) relatedIds.add(link.source);
        });
      }
      edgeSelection.forEach(id => relatedIds.add(id));
      interactiveObjects.forEach(object => {
        const objectNode = object.userData.node;
        if (!objectNode) return;
        const isFocused = objectNode.id === hoveredNodeId || edgeSelection.includes(objectNode.id);
        const isRelated = !focusNodeId || relatedIds.has(objectNode.id);
        object.material.color.set(isFocused ? "#ffffff" : (isRelated ? object.userData.baseColor : "#273039"));
        object.material.opacity = isFocused ? 1 : (isRelated ? object.userData.baseOpacity : 0.16);
      });
      glowSprites.forEach(sprite => {
        const isFocused = sprite.userData.nodeId === hoveredNodeId || edgeSelection.includes(sprite.userData.nodeId);
        const isRelated = !focusNodeId || relatedIds.has(sprite.userData.nodeId);
        sprite.material.color.set(isFocused ? "#ffffff" : (isRelated ? sprite.userData.baseColor : "#172026"));
        sprite.material.opacity = isFocused ? 1.45 : (isRelated ? sprite.userData.baseOpacity : 0.05);
        const scale = sprite.userData.baseScale * (isFocused ? 1.35 : 1);
        sprite.scale.set(scale, scale, 1);
      });
      labelSprites.forEach(sprite => {
        sprite.material.opacity = !focusNodeId || relatedIds.has(sprite.userData.nodeId) ? 0.72 : 0.12;
      });
      linePairs.forEach((link, index) => {
        const isConnected = focusNodeId && (link.source === focusNodeId || link.target === focusNodeId);
        const lineColor = !focusNodeId ? [0.24, 0.29, 0.33] : isConnected ? [0.65, 0.98, 0.82] : [0.08, 0.11, 0.13];
        lineColorAttribute.setXYZ(index * 2, ...lineColor);
        lineColorAttribute.setXYZ(index * 2 + 1, ...lineColor);
      });
      lineColorAttribute.needsUpdate = true;
      lineMaterial.opacity = focusNodeId ? 0.72 : 0.34;
      lineSegments.visible = showEdges3d;
    };

    const getHitNode = hit => hit ? (hit.object.userData.node || hit.object.userData.leafNodes?.[hit.index]) : null;

    const selectNode = node => {
      if (!node) return;
      if (node.type === "star" && onNodeClick) onNodeClick(node.originalData, node.pathId);
      else if (node.type === "satellite" && onModuleClick) onModuleClick(node.originalNode, node.originalModule, node.pathId);
      else if (node.type === "subtopic" && onSubtopicClick) onSubtopicClick(node.originalNode, node.originalModule, node.originalTopic, node.pathId);
      else if (node.type === "article") articleClickRef.current?.(node.slug);
      else if (node.type === "topic") topicClickRef.current?.(node.topicLabel, node.topicYear);
      else if (node.type === "reading") return; // groups topics, opens nothing
      if (node.depth > 0) onClose();
    };

    const onPointerDown = event => {
      isDragging = true;
      previousPointer = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = event => {
      const point = getPointer(event);
      if (isDragging) {
        rotationY += (event.clientX - previousPointer.x) * 0.006;
        rotationX += (event.clientY - previousPointer.y) * 0.004;
        previousPointer = { x: event.clientX, y: event.clientY };
        return;
      }
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(interactiveObjects, false)[0];
      const hitNode = getHitNode(hit);
      updateHover(hitNode);
      canvas.style.cursor = hit ? "pointer" : "grab";
      setTooltip(hit ? {
        x: point.x,
        y: point.y,
        label: hitNode.fullTitle || hitNode.label,
        type: hitNode.type,
        status: hitNode.status,
        hint: hitNode.hint,
        color: hitNode.statusColor || hitNode.color,
      } : null);
    };
    const onPointerUp = event => {
      isDragging = false;
      canvas.releasePointerCapture?.(event.pointerId);
    };
    const onClick = event => {
      getPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(interactiveObjects, false)[0];
      const hitNode = getHitNode(hit);
      if (hitNode && edgeEditMode) {
        handleEdgeEditNode(hitNode);
        return;
      }
      if (hitNode) selectNode(hitNode);
    };
    const onWheel = event => {
      event.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + event.deltaY * 0.7, 520, 2400);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", () => { updateHover(null); setTooltip(null); canvas.style.cursor = "grab"; });
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    updateHover(null);

    let animationFrame;
    const motionClock = new THREE.Clock();
    const animate = () => {
      const delta = motionClock.getDelta();
      const elapsed = motionClock.elapsedTime;
      if (motionEnabled3d) {
        rotationY += delta * 0.075;
        movingNodes.forEach(item => {
          const wave = elapsed * item.speed + item.phase;
          const driftX = Math.sin(wave) * item.amplitude;
          const driftY = Math.cos(wave * 0.82) * item.amplitude * 0.55;
          const driftZ = Math.sin(wave * 0.64 + 1.4) * item.amplitude * 0.72;
          item.mesh.position.set(item.basePosition.x + driftX, item.basePosition.y + driftY, item.basePosition.z + driftZ);
          item.mesh.scale.setScalar(1 + Math.sin(wave * 1.18) * 0.045);
          if (item.glow) {
            item.glow.position.copy(item.mesh.position);
            const glowScale = item.glow.userData.baseScale * (1 + Math.sin(wave * 1.18) * 0.08);
            item.glow.scale.set(glowScale, glowScale, 1);
          }
          if (item.label) {
            item.label.position.copy(item.mesh.position);
            item.label.position.y += item.labelOffset;
          }
        });
        leafMotion.forEach(item => {
          const wave = elapsed * item.speed + item.phase;
          leafPositionAttribute?.setXYZ(
            item.index,
            item.basePosition.x + Math.sin(wave) * item.amplitude,
            item.basePosition.y + Math.cos(wave * 0.84) * item.amplitude * 0.55,
            item.basePosition.z + Math.sin(wave * 0.66 + 1.2) * item.amplitude * 0.7
          );
        });
        if (leafPositionAttribute) leafPositionAttribute.needsUpdate = true;
      }
      galaxyGroup.rotation.y = rotationY;
      galaxyGroup.rotation.x = THREE.MathUtils.clamp(rotationX, -0.9, 0.9);
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("wheel", onWheel);
      glowTexture.dispose();
      labelSprites.forEach(sprite => sprite.material.map?.dispose?.());
      // Replaces the manual traverse: also handles material arrays and textures,
      // and releases the GL context, which renderer.dispose() does not.
      // The canvas is React-owned and reused when graph data changes. Losing
      // its context here leaves the next renderer attached to a dead canvas.
      disposeThreeScene(scene, renderer, containerRef.current, { preserveCanvas: true });
    };
  }, [viewMode, graphData, graphLinks3d, dimensions, embedded, edgeEditMode, edgeSelection, showEdges3d, glowEnabled3d, motionEnabled3d, nodeTint3d, saturation3d, brightness3d, onNodeClick, onModuleClick, onSubtopicClick, onClose]);

  return (
    <div className={`knowledge-galaxy-container ${embedded ? "knowledge-galaxy-embedded" : ""} ${viewMode === "3d" ? "is-3d" : ""}`} ref={containerRef}>
      <div className="galaxy-overlay">
        <div className="galaxy-header">
          <div className="galaxy-title-row">
            <Orbit className="galaxy-icon" size={28} />
            <div className="galaxy-title-text">
              <h1>NEURAL CONSTELLATION</h1>
              <p>GenAI Academy Intelligence Grid</p>
            </div>
          </div>
          <div className="galaxy-header-actions">
            <button
              type="button"
              className={`galaxy-topics-toggle ${showTopics ? "active" : ""}`}
              aria-pressed={showTopics}
              title={showTopics ? "Hide reading constellations" : "Show reading constellations"}
              onClick={() => { setShowTopics(on => !on); setTooltip(null); }}
            >
              <BookOpen size={13} />
              <span>TOPICS</span>
              {topicTree?.total ? <em>{topicTree.total.toLocaleString()}</em> : null}
            </button>
            <button
              type="button"
              className={`galaxy-posts-toggle ${showAllPosts ? "active" : ""}`}
              aria-pressed={showAllPosts}
              aria-label={showAllPosts ? "Show blog categories only" : "Show all blog posts"}
              title={showAllPosts ? "Show blog categories only" : "Show every blog post"}
              disabled={loadingAll}
              onClick={toggleAllPosts}
            >
              <LibraryBig size={13} />
              <span>{loadingAll ? "LOADING" : "ALL BLOGS"}</span>
              {!loadingAll && topicTree?.total ? <em>{topicTree.total.toLocaleString()}</em> : null}
            </button>
            <div className="galaxy-mode-switch" role="group" aria-label="Galaxy visualization mode">
              <button type="button" className={viewMode === "2d" ? "active" : ""} aria-pressed={viewMode === "2d"} onClick={() => { setViewMode("2d"); setEdgeEditMode(null); setEdgeSelection([]); setTooltip(null); }}>2D</button>
              <button type="button" className={viewMode === "3d" ? "active" : ""} aria-pressed={viewMode === "3d"} onClick={() => { setViewMode("3d"); setEdgeSelection([]); setTooltip(null); }}>3D</button>
            </div>
          </div>
          <button className="galaxy-close" onClick={onClose}><X size={20} /></button>
        </div>

        {viewMode === "3d" && (
          <div className="galaxy-3d-controls" aria-label="3D galaxy controls">
            <div className="galaxy-3d-controls-title"><Link2 size={12} /> GRAPH CONTROLS</div>
            <div className="galaxy-3d-control-row">
              <span className="galaxy-3d-control-label">EDGES</span>
              <button type="button" className={`galaxy-3d-control-button ${edgeEditMode === "add" ? "active" : ""}`} aria-pressed={edgeEditMode === "add"} onClick={() => { setEdgeEditMode(edgeEditMode === "add" ? null : "add"); setEdgeSelection([]); }}><Plus size={12} /> ADD</button>
              <button type="button" className={`galaxy-3d-control-button ${edgeEditMode === "remove" ? "active danger" : ""}`} aria-pressed={edgeEditMode === "remove"} onClick={() => { setEdgeEditMode(edgeEditMode === "remove" ? null : "remove"); setEdgeSelection([]); }}><Minus size={12} /> REMOVE</button>
              <button type="button" className="galaxy-3d-control-icon" aria-label={showEdges3d ? "Hide edges" : "Show edges"} aria-pressed={showEdges3d} onClick={() => setShowEdges3d(visible => !visible)}>{showEdges3d ? <Eye size={13} /> : <EyeOff size={13} />}</button>
            </div>
            <div className="galaxy-3d-control-row galaxy-3d-tune-row">
              <button type="button" className={`galaxy-3d-control-button ${glowEnabled3d ? "active" : ""}`} aria-pressed={glowEnabled3d} onClick={() => setGlowEnabled3d(enabled => !enabled)}><Zap size={12} /> GLOW</button>
              <label className="galaxy-color-control" aria-label="Node color">
                <span>COLOR</span>
                <input type="color" value={nodeTint3d} onChange={event => setNodeTint3d(event.target.value)} />
              </label>
            </div>
            <div className="galaxy-3d-control-row">
              <button type="button" className={`galaxy-3d-control-button ${motionEnabled3d ? "active" : ""}`} aria-pressed={motionEnabled3d} onClick={() => setMotionEnabled3d(enabled => !enabled)}><Orbit size={12} /> MOTION</button>
              <span className="galaxy-motion-status">{motionEnabled3d ? "LIVE" : "PAUSED"}</span>
            </div>
            <label className="galaxy-range-control"><span>SAT <strong>{Math.round(saturation3d * 100)}%</strong></span><input type="range" min="0.5" max="2" step="0.05" value={saturation3d} onChange={event => setSaturation3d(Number(event.target.value))} /></label>
            <label className="galaxy-range-control"><span>BRIGHT <strong>{Math.round(brightness3d * 100)}%</strong></span><input type="range" min="0.5" max="1.8" step="0.05" value={brightness3d} onChange={event => setBrightness3d(Number(event.target.value))} /></label>
            {edgeEditMode && <div className="galaxy-edge-hint">{edgeSelection.length ? "SELECT A SECOND NODE" : `SELECT TWO NODES TO ${edgeEditMode.toUpperCase()}`}</div>}
          </div>
        )}

        <div className="galaxy-legend">
          <div className="legend-item"><span className="legend-dot" style={{ background: STATUS_COLORS.mastered, boxShadow: `0 0 10px ${STATUS_COLORS.mastered}` }} /> MASTERED</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: STATUS_COLORS.evolving, boxShadow: `0 0 10px ${STATUS_COLORS.evolving}` }} /> EVOLVING</div>
          <div className="legend-item"><span className="legend-dot" style={{ background: STATUS_COLORS.ready }} /> READY</div>
          {showTopics && topicTree?.clusters?.length > 0 && (
            <div className="legend-item"><span className="legend-dot" style={{ background: "#a78bfa", boxShadow: "0 0 10px #a78bfa" }} /> READING</div>
          )}
        </div>

        <div className="galaxy-footer">
          <Sparkles size={12} />
          <span>60 FPS HYBRID ENGINE • DEEP SUBTOPIC EXPLORATION ENABLED</span>
        </div>
      </div>

      <canvas ref={threeCanvasRef} className="galaxy-three-canvas" aria-label="3D knowledge galaxy" />
      <canvas ref={canvasRef} className="galaxy-canvas" aria-hidden={viewMode === "3d"} />
      <svg ref={svgRef} className="galaxy-interaction-svg" />

      {tooltip && (
        <div className="galaxy-tooltip" style={{ left: tooltip.x + 15, top: tooltip.y + 15, "--tooltip-color": tooltip.color }}>
          <div className="tooltip-type">{tooltip.type.toUpperCase()} • {tooltip.hint || tooltip.status?.toUpperCase() || 'READY'}</div>
          <div className="tooltip-label">{tooltip.label}</div>
          <div className="tooltip-glow" />
        </div>
      )}

      <style>{`
        .knowledge-galaxy-container {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: #020408;
          z-index: 2000;
          overflow: hidden;
          font-family: inherit;
        }
        .knowledge-galaxy-container.knowledge-galaxy-embedded {
          position: relative;
          inset: auto;
          width: 100%;
          height: 100%;
          min-height: 0;
          border: 1px solid rgba(34,211,238,0.2);
          border-radius: 14px;
          background: radial-gradient(circle at 52% 52%, rgba(34,211,238,0.1), transparent 43%), #020408;
          z-index: 0;
        }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-overlay { padding: 16px; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-title-row { gap: 10px; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-icon { width: 20px; height: 20px; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-title-text { transform: scale(0.62); transform-origin: left center; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-title-text h1 { display: none; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-title-text p { margin-top: 3px; font-size: 6px; letter-spacing: 1px; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-close { display: none; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-header-actions { margin-right: 0; transform: scale(0.82); transform-origin: top right; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-topics-toggle span,
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-topics-toggle em,
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-posts-toggle span,
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-posts-toggle em { display: none; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-controls { right: 16px; top: 72px; gap: 6px; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-btn { width: 30px; height: 30px; border-radius: 9px; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-btn svg { width: 14px; height: 14px; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-indicator { font-size: 8px; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-legend { padding: 9px 10px; gap: 7px; border-radius: 9px; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .legend-item { gap: 7px; font-size: 7px; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .legend-dot { width: 6px; height: 6px; }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-footer { bottom: 12px; gap: 6px; font-size: 6px; letter-spacing: 1px; white-space: nowrap; }
        .galaxy-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .galaxy-three-canvas {
          display: none;
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          cursor: grab;
          touch-action: none;
        }
        .knowledge-galaxy-container.is-3d .galaxy-canvas,
        .knowledge-galaxy-container.is-3d .galaxy-interaction-svg {
          display: none;
        }
        .knowledge-galaxy-container.is-3d .galaxy-three-canvas {
          display: block;
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
          padding: 18px 40px 40px;
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

        .galaxy-title-text {
          padding: 8px 14px 9px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025));
          backdrop-filter: blur(18px) saturate(125%);
          -webkit-backdrop-filter: blur(18px) saturate(125%);
          box-shadow: 0 8px 28px rgba(0,0,0,0.18);
        }

        .galaxy-title-text h1 {
          font-size: 18px; font-weight: 800; letter-spacing: 3px; margin: 0;
          background: linear-gradient(to right, rgba(255,255,255,0.78), rgba(142,255,113,0.52));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          opacity: 0.82;
        }
        .galaxy-title-text p { color: rgba(255,255,255,0.34); font-size: 8px; letter-spacing: 1.5px; margin: 3px 0 0 0; }

        .galaxy-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
          margin-right: 14px;
        }
        .galaxy-topics-toggle,
        .galaxy-posts-toggle {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 9px;
          background: rgba(15,23,42,0.48);
          backdrop-filter: blur(14px);
          color: rgba(255,255,255,0.42);
          font: 600 9px var(--font, sans-serif);
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: 160ms ease;
        }
        .galaxy-topics-toggle em,
        .galaxy-posts-toggle em {
          font-style: normal;
          font-size: 8px;
          opacity: 0.6;
        }
        .galaxy-topics-toggle:hover,
        .galaxy-posts-toggle:hover { color: rgba(255,255,255,0.8); }
        .galaxy-topics-toggle.active {
          color: rgba(238,226,255,0.92);
          border-color: rgba(167,139,250,0.5);
          background: rgba(167,139,250,0.14);
          box-shadow: 0 0 14px rgba(167,139,250,0.12);
        }
        .galaxy-posts-toggle.active {
          color: rgba(220,255,231,0.92);
          border-color: rgba(142,255,113,0.52);
          background: rgba(142,255,113,0.13);
          box-shadow: 0 0 14px rgba(142,255,113,0.12);
        }
        .galaxy-posts-toggle:disabled {
          cursor: wait;
          opacity: 0.68;
        }
        .galaxy-topics-toggle:focus-visible,
        .galaxy-posts-toggle:focus-visible,
        .galaxy-mode-switch button:focus-visible {
          outline: 2px solid #8ff5ff;
          outline-offset: 2px;
        }
        .galaxy-mode-switch {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 3px;
          border-radius: 9px;
          background: rgba(15,23,42,0.48);
          backdrop-filter: blur(14px);
          pointer-events: auto;
        }
        .galaxy-mode-switch button {
          border: 0;
          border-radius: 6px;
          padding: 5px 8px;
          color: rgba(255,255,255,0.42);
          background: transparent;
          font: 600 9px var(--font, sans-serif);
          letter-spacing: 0.08em;
          cursor: pointer;
        }
        .galaxy-mode-switch button.active {
          color: rgba(220,255,231,0.9);
          background: rgba(142,255,113,0.13);
          box-shadow: 0 0 14px rgba(142,255,113,0.1);
        }
        @media (max-width: 700px) {
          .galaxy-header-actions { gap: 5px; margin-right: 8px; }
          .galaxy-topics-toggle,
          .galaxy-posts-toggle { padding: 6px 7px; gap: 4px; }
          .galaxy-topics-toggle em,
          .galaxy-posts-toggle em { display: none; }
        }

        .galaxy-3d-controls {
          position: absolute;
          top: 76px;
          right: 40px;
          width: 232px;
          padding: 12px;
          border: 1px solid rgba(143,245,255,0.16);
          border-radius: 13px;
          background: rgba(5,10,16,0.72);
          backdrop-filter: blur(18px) saturate(145%);
          -webkit-backdrop-filter: blur(18px) saturate(145%);
          box-shadow: 0 12px 36px rgba(0,0,0,0.28), 0 0 24px rgba(143,245,255,0.05);
          pointer-events: auto;
          color: rgba(235,248,255,0.72);
        }
        .galaxy-3d-controls-title {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 9px;
          color: rgba(143,245,255,0.82);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.6px;
        }
        .galaxy-3d-control-row {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 8px;
        }
        .galaxy-3d-control-label {
          min-width: 42px;
          color: rgba(255,255,255,0.36);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .galaxy-3d-control-button,
        .galaxy-3d-control-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.035);
          cursor: pointer;
          transition: 160ms ease;
        }
        .galaxy-3d-control-button {
          padding: 5px 6px;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.8px;
        }
        .galaxy-3d-control-icon {
          width: 25px;
          height: 25px;
          margin-left: auto;
        }
        .galaxy-3d-control-button:hover,
        .galaxy-3d-control-icon:hover {
          color: rgba(255,255,255,0.92);
          border-color: rgba(143,245,255,0.48);
          background: rgba(143,245,255,0.1);
        }
        .galaxy-3d-control-button.active {
          color: #b8ffe4;
          border-color: rgba(142,255,113,0.55);
          background: rgba(142,255,113,0.12);
          box-shadow: 0 0 15px rgba(142,255,113,0.1);
        }
        .galaxy-3d-control-button.active.danger {
          color: #ffb6d8;
          border-color: rgba(255,105,175,0.5);
          background: rgba(255,105,175,0.11);
          box-shadow: 0 0 15px rgba(255,105,175,0.1);
        }
        .galaxy-3d-tune-row { gap: 7px; }
        .galaxy-motion-status {
          margin-left: auto;
          color: rgba(142,255,113,0.72);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
        }
        .galaxy-color-control {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: auto;
          color: rgba(255,255,255,0.42);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.9px;
          cursor: pointer;
        }
        .galaxy-color-control input {
          width: 25px;
          height: 20px;
          padding: 0;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 5px;
          background: transparent;
          cursor: pointer;
        }
        .galaxy-range-control {
          display: grid;
          grid-template-columns: 58px 1fr;
          align-items: center;
          gap: 7px;
          margin-top: 7px;
          color: rgba(255,255,255,0.42);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.8px;
        }
        .galaxy-range-control span { display: flex; justify-content: space-between; gap: 4px; }
        .galaxy-range-control strong { color: rgba(143,245,255,0.85); font-weight: 800; }
        .galaxy-range-control input { width: 100%; accent-color: #8ff5ff; cursor: pointer; }
        .galaxy-edge-hint {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,190,226,0.82);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1px;
          text-align: center;
        }
        .knowledge-galaxy-container.knowledge-galaxy-embedded .galaxy-3d-controls {
          top: 60px;
          right: 16px;
          transform: scale(0.82);
          transform-origin: top right;
        }
        @media (max-width: 700px) {
          .galaxy-3d-controls { right: 16px; width: 205px; }
        }

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
