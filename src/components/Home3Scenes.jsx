import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen, Boxes, Braces, CheckSquare, Clapperboard, Code2, Compass,
  Database, FileText, GitBranch, GraduationCap, Layers, Mic, Network,
  Newspaper, Orbit, Radio, Share2, Sparkles, Terminal, Video, Workflow,
} from "lucide-react";

/* ── Home 3.0 scenes ─────────────────────────────────────────────────────
   The four animated set-pieces the reference homepage is built around,
   rebuilt against the academy's own data:

     ScrambleReel  — the hero verb that keeps re-spelling itself
     ChaosField    — the "too many sources, one pipeline" backdrop
     CoverageStrip — the posture heat-strip with sweeping scan beams
     ContextGraph  — the knowledge graph, scanned by the same beam
     ChangeStack   — the layered explorer with pop-out hover cards          */

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ═══ 1. The hero reel ══════════════════════════════════════════════════
   Faithful to the reference's construction. Every character is its own
   clipped column that sizes itself to the *incoming* letter, so kerning
   stays exactly as the font intends. Inside a column: a decoy glyph that
   drops away, and the real letter riding in from above or below with a
   coloured duplicate trailing it — the chromatic split that makes the
   phrase look like it is being retyped by a machine. */

const GLYPHS = "abcdefghijklmnopqrstuvwxyz";
const SPLIT_TONES = ["var(--h3x-mint)", "var(--h3x-red)", "var(--h3x-indigo)"];

function ReelChar({ char, index, turn }) {
  // Seeded off the character position and the turn number so a re-render
  // never reshuffles a letter mid-flight.
  const seed = (index * 37 + turn * 101) % 97;
  const fromBelow = seed % 2 === 0;
  const decoy = GLYPHS[seed % GLYPHS.length];
  const tone = SPLIT_TONES[seed % SPLIT_TONES.length];

  if (char === " ") return <span className="h3x-rc-space">&nbsp;</span>;

  return (
    <span
      className="h3x-rc"
      style={{ "--rc-delay": `${index * 34}ms`, "--rc-from": fromBelow ? "115%" : "-115%" }}
    >
      {/* Sizes the column to the letter that is arriving. */}
      <span className="h3x-rc-size">{char}</span>
      <span className="h3x-rc-decoy">{decoy}</span>
      <span className="h3x-rc-in">
        {char}
        <span className="h3x-rc-ghost" style={{ color: tone }}>{char}</span>
      </span>
    </span>
  );
}

export function ScrambleReel({ phrases, interval = 3600 }) {
  const [turn, setTurn] = useState(0);
  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (reduced || phrases.length < 2) return undefined;
    const timer = window.setInterval(() => setTurn(t => t + 1), interval);
    return () => window.clearInterval(timer);
  }, [phrases.length, interval, reduced]);

  const phrase = phrases[turn % phrases.length];
  if (reduced) return <span className="h3x-reel-static">{phrases[0]}</span>;

  return (
    <span className="h3x-reel">
      {/* Every phrase stacked invisibly: the widest one fixes the box so the
          line never reflows as shorter phrases cycle through. */}
      {phrases.map(p => <span className="h3x-reel-size" key={p} aria-hidden="true">{p}</span>)}
      <span className="h3x-sr-only">{phrase}</span>
      <span className="h3x-reel-row" key={turn} aria-hidden="true">
        {phrase.split("").map((char, i) => (
          <ReelChar key={i} char={char} index={i} turn={turn} />
        ))}
      </span>
    </span>
  );
}

/* ═══ 2. ChaosField ═════════════════════════════════════════════════════
   Rebuilt against the live section rather than its reduced-motion fallback.
   What the reference actually renders is a WebGL canvas: thin coloured
   strands spawn among the source icons on the left, curve rightward, and
   merge into one tight horizontal bundle that stops exactly where the copy
   begins. Strands fade in and out on their own cycles, so the bundle is
   permanent while its tributaries keep changing.

   (The three static pipes in their markup are only what shows under
   prefers-reduced-motion — copying those was the earlier mistake.)          */

const SOURCES = [
  [Video, "Lecture"], [FileText, "Paper"], [GitBranch, "Repo"], [BookOpen, "Textbook"],
  [Clapperboard, "Course"], [Newspaper, "Newsletter"], [Terminal, "Shell"], [GraduationCap, "Lesson"],
  [Braces, "Snippet"], [Database, "Dataset"], [Mic, "Podcast"], [Radio, "Livestream"],
  [Boxes, "Package"], [Code2, "Sample"], [Workflow, "Pipeline"], [Layers, "Stack"],
  [Orbit, "Concept"], [Share2, "Thread"], [Network, "Graph"], [CheckSquare, "Checklist"],
  [Compass, "Guide"], [Sparkles, "Release"],
];

const STRAND_TOKENS = ["--h3x-mint", "--h3x-orange", "--h3x-red", "--h3x-amber", "--text3"];

const hexToRgb = (value) => {
  const raw = (value || "").trim().replace("#", "");
  const full = raw.length === 3 ? raw.split("").map(c => c + c).join("") : raw;
  const n = parseInt(full, 16);
  if (Number.isNaN(n) || full.length !== 6) return [140, 140, 150];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/* The strand field. Canvas rather than SVG: these are dozens of overlapping
   soft gradient curves whose opacity changes every frame, which is exactly
   the workload a 2D context is cheap at and a DOM tree is not. */
function ChaosStreams() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return undefined;
    const host = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const styles = getComputedStyle(host);
    const palette = STRAND_TOKENS.map(token => hexToRgb(styles.getPropertyValue(token)));

    let width = 0;
    let height = 0;
    let raf = 0;
    let last = performance.now();

    // Enough that the bundle never empties out between spawns, which reads as
    // a glitch rather than as a lull.
    const strands = Array.from({ length: 13 }, () => ({}));

    const spawn = (strand, seeded) => {
      strand.sx = 0.07 + Math.random() * 0.22;      // origin, as a fraction
      strand.sy = 0.16 + Math.random() * 0.68;
      strand.offset = (Math.random() - 0.5) * 9;    // thickness of the bundle
      strand.rgb = palette[Math.floor(Math.random() * palette.length)];
      strand.span = 3.4 + Math.random() * 3.6;      // seconds of life
      strand.life = seeded ? Math.random() * strand.span : 0;
      strand.weight = 0.75 + Math.random() * 0.85;
      // How far the strand runs flat before bending. Low values make the fan
      // radiate out of the source like a starburst; the reference keeps every
      // strand horizontal for most of its length and folds it in late.
      strand.bow = 0.52 + Math.random() * 0.26;
    };
    strands.forEach(strand => spawn(strand, true));

    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, width, height);

      // Where every tributary meets, and where the bundle stops — just shy of
      // the copy, the way the reference lands it against its headline.
      const mergeX = width * 0.47;
      const endX = width * 0.53;
      const mergeY = height * 0.5;

      for (const strand of strands) {
        strand.life += dt;
        if (strand.life >= strand.span) spawn(strand, false);

        const t = strand.life / strand.span;
        const alpha = t < 0.22 ? t / 0.22 : t > 0.72 ? (1 - t) / 0.28 : 1;
        const sx = strand.sx * width;
        const sy = strand.sy * height;
        const ey = mergeY + strand.offset;
        const run = mergeX - sx;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(
          sx + run * strand.bow, sy,
          mergeX - run * 0.16, ey,   // arrives flat, so the bundle reads as one line
          mergeX, ey,
        );
        ctx.lineTo(endX, ey);

        const [r, g, b] = strand.rgb;
        const gradient = ctx.createLinearGradient(sx, 0, endX, 0);
        gradient.addColorStop(0, `rgba(${r},${g},${b},0)`);
        gradient.addColorStop(0.45, `rgba(${r},${g},${b},${0.42 * alpha})`);
        gradient.addColorStop(0.86, `rgba(${r},${g},${b},${0.85 * alpha})`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},${0.28 * alpha})`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = strand.weight;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      raf = requestAnimationFrame(frame);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, []);

  return <canvas className="h3x-chaos-canvas" ref={canvasRef} aria-hidden="true" />;
}

export function ChaosField({ children }) {
  // Scattered through the left band, each on its own offset point of one
  // shared 16s cycle — the reference's actors blink individually rather than
  // pulsing together, which is what keeps the field feeling alive.
  const actors = useMemo(() => SOURCES.map(([Icon, label], i) => {
    const column = i % 4;
    const row = Math.floor(i / 4);
    return {
      Icon,
      label,
      x: 6 + column * 6.5 + (row % 2) * 3.2,
      y: 7 + (i / SOURCES.length) * 86,
      delay: -(i * 16) / SOURCES.length,
    };
  }), []);

  return (
    <div className="h3x-chaos">
      <div className="h3x-chaos-grid" aria-hidden="true" />
      <ChaosStreams />
      <div className="h3x-chaos-sources">
        {actors.map(({ Icon, label, x, y, delay }, i) => (
          <span
            className="h3x-chaos-actor"
            key={i}
            style={{ "--ax": `${x}%`, "--ay": `${y}%`, "--adelay": `${delay}s` }}
          >
            <Icon className="h3x-chaos-icon" aria-hidden="true" />
            <span className="h3x-chaos-label">{label}</span>
          </span>
        ))}
      </div>
      <div className="h3x-chaos-content">{children}</div>
    </div>
  );
}

/* ═══ 3. CoverageStrip ══════════════════════════════════════════════════
   The security section's posture strip: one lane per unit, each lane a row
   of small state cells grouped into blocks, with two beams sweeping across
   the whole board on an offset loop. Cells here are modules. */

const chunk = (items, size) => {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
};

export function CoverageStrip({ paths, onOpenPath }) {
  const lanes = useMemo(() => paths.slice(0, 5).map(item => {
    const modules = (item.path.nodes || []).flatMap(node => node.modules || []).slice(0, 42);
    let seenPending = false;
    const cells = modules.map(module => {
      if (module.status === "complete") return "done";
      // The first unfinished module is where the reader actually is.
      if (!seenPending) { seenPending = true; return "active"; }
      return "todo";
    });
    return { key: item.key, name: item.name, stats: item.stats, cells: chunk(cells, 7) };
  }), [paths]);

  return (
    <div className="h3x-posture">
      <div className="h3x-posture-head">
        <span className="h3x-posture-title">
          <span className="h3x-live-dot" /> CURRICULUM COVERAGE
        </span>
        <span className="h3x-posture-legend">
          <i data-tone="done" /> Cleared
          <i data-tone="active" /> In progress
          <i data-tone="todo" /> Untouched
        </span>
      </div>
      <div className="h3x-posture-body">
        {lanes.map(lane => (
          <button className="h3x-lane" key={lane.key} onClick={() => onOpenPath?.(lane.key)}>
            <span className="h3x-lane-meta">
              <span>{lane.name}</span>
              <small>{lane.stats.completed}/{lane.stats.total}</small>
            </span>
            <span className="h3x-lane-groups">
              {lane.cells.map((group, gi) => (
                <span className="h3x-lane-group" key={gi}>
                  {group.map((tone, ci) => <i className="h3x-cell" data-tone={tone} key={ci} />)}
                </span>
              ))}
            </span>
          </button>
        ))}
        {!lanes.length && <p className="h3x-empty">Start a path and its coverage board appears here.</p>}
        <span className="h3x-scan-track" aria-hidden="true">
          <span className="h3x-scan" />
          <span className="h3x-scan" data-staggered="true" />
        </span>
      </div>
    </div>
  );
}

/* ═══ 4. ContextGraph ═══════════════════════════════════════════════════
   Redesigned around standard knowledge-graph visualisation practice rather
   than the bare hub-and-spoke it started as:

     · radial ego-layout, since every edge is "what the learner knows"
     · nodes typed by colour and sized by rank (hub > source > nothing else)
     · names rendered on the nodes, not left to a legend
     · ring edges between neighbouring sources, because a pure star reads as
       empty space with dots in it — the cross-links are what make it a graph
     · focus dimming: the active source and its links saturate while the rest
       drop back, the alpha-blending trick these tools use to show a centre
       concept plus its neighbourhood
     · the graph and the list drive each other, and hovering either pins it   */

const CONTEXT_SOURCES = [
  { id: "graph", icon: Network, short: "Roadmap", title: "Roadmap graph", tone: "var(--h3x-mint)", copy: "Maps every node your path touches and what each one depends on." },
  { id: "memory", icon: Database, short: "Progress", title: "Progress memory", tone: "var(--h3x-indigo)", copy: "Knows what you finished, when you finished it, and what you skipped." },
  { id: "practice", icon: Terminal, short: "Practice", title: "Practice signals", tone: "var(--h3x-amber)", copy: "Pulls results out of Code Lab, the quizzes, and every simulator." },
  { id: "library", icon: BookOpen, short: "Library", title: "Reference library", tone: "var(--h3x-orange)", copy: "Brings in the manual, the glossary, and the links you saved." },
  { id: "ensemble", icon: Workflow, short: "Ensemble", title: "Ensemble of surfaces", tone: "var(--h3x-violet)", copy: "Routes each gap to whichever surface actually closes it fastest." },
];

const VIEW = { w: 460, h: 300, cx: 230, cy: 150, rx: 126, ry: 88 };

// Five evenly spaced points on the ellipse, first one straight up.
const RING = CONTEXT_SOURCES.map((source, i) => {
  const angle = (-90 + i * 72) * (Math.PI / 180);
  const x = VIEW.cx + VIEW.rx * Math.cos(angle);
  const y = VIEW.cy + VIEW.ry * Math.sin(angle);
  const outward = Math.cos(angle);
  return {
    ...source,
    x,
    y,
    // Labels sit on whichever side faces away from the hub.
    lx: x + (Math.abs(outward) < 0.25 ? 0 : outward > 0 ? 24 : -24),
    ly: y + (Math.abs(outward) < 0.25 ? (y < VIEW.cy ? -26 : 30) : 4),
    anchor: Math.abs(outward) < 0.25 ? "middle" : outward > 0 ? "start" : "end",
  };
});

export function ContextGraph({ overallPercent }) {
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(null);
  const [reduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (reduced || pinned !== null) return undefined;
    const timer = window.setInterval(
      () => setActive(i => (i + 1) % CONTEXT_SOURCES.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, [reduced, pinned]);

  const current = pinned ?? active;
  const neighbours = new Set([
    (current + 1) % RING.length,
    (current - 1 + RING.length) % RING.length,
  ]);
  // Saturated / mid / dimmed — the three tiers of the focus treatment.
  const rank = (i) => (i === current ? "on" : neighbours.has(i) ? "near" : "off");

  const focus = (i) => setPinned(i);
  const release = () => setPinned(null);

  return (
    <div className="h3x-context">
      <div className="h3x-context-stage">
        <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h3x-graph" role="img"
          aria-label="How the academy builds context about you">
          {/* Ring edges first, so nodes always sit on top of them. */}
          <g className="h3x-graph-ring">
            {RING.map((node, i) => {
              const next = RING[(i + 1) % RING.length];
              const live = i === current || (i + 1) % RING.length === current;
              return (
                <line key={`r${node.id}`} x1={node.x} y1={node.y} x2={next.x} y2={next.y}
                  className={live ? "on" : ""} />
              );
            })}
          </g>

          <g className="h3x-graph-spokes">
            {RING.map((node, i) => (
              <g key={`s${node.id}`} className={rank(i)} style={{ "--tone": node.tone }}>
                <line x1={VIEW.cx} y1={VIEW.cy} x2={node.x} y2={node.y} className="h3x-spoke" />
                {i === current && (
                  <line x1={node.x} y1={node.y} x2={VIEW.cx} y2={VIEW.cy} className="h3x-spoke-pulse" />
                )}
              </g>
            ))}
          </g>

          <g className="h3x-graph-nodes">
            {RING.map((node, i) => (
              <g
                key={node.id}
                className={`h3x-gnode ${rank(i)}`}
                style={{ "--tone": node.tone }}
                onMouseEnter={() => focus(i)}
                onMouseLeave={release}
              >
                <circle cx={node.x} cy={node.y} r="21" className="h3x-gnode-hit" />
                <circle cx={node.x} cy={node.y} r="17" className="h3x-gnode-halo" />
                <circle cx={node.x} cy={node.y} r="11" className="h3x-gnode-core" />
                <text x={node.lx} y={node.ly} textAnchor={node.anchor} className="h3x-gnode-label">
                  {node.short}
                </text>
              </g>
            ))}
          </g>

          <g className="h3x-graph-core">
            <circle cx={VIEW.cx} cy={VIEW.cy} r="41" className="h3x-core-ring" />
            <circle cx={VIEW.cx} cy={VIEW.cy} r="31" className="h3x-core-disc" />
            <text x={VIEW.cx} y={VIEW.cy + 2} textAnchor="middle" className="h3x-core-label">{overallPercent}%</text>
            <text x={VIEW.cx} y={VIEW.cy + 17} textAnchor="middle" className="h3x-core-sub">TRAINED</text>
          </g>
        </svg>
        <span className="h3x-scan-track" aria-hidden="true">
          <span className="h3x-scan" />
          <span className="h3x-scan" data-staggered="true" />
        </span>
      </div>

      <ul className="h3x-context-list">
        {CONTEXT_SOURCES.map((source, i) => {
          const Icon = source.icon;
          return (
            <li
              key={source.id}
              className={rank(i)}
              style={{ "--tone": source.tone }}
              onMouseEnter={() => focus(i)}
              onMouseLeave={release}
            >
              <span className="h3x-context-icon"><Icon size={14} /></span>
              <span>
                <h4>{source.title}</h4>
                <p>{source.copy}</p>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ═══ 5. ChangeStack ════════════════════════════════════════════════════
   The reference's explainability panel: a rail of layers on the left, the
   selected layer's detail in the middle, a live feed on the right, and a
   hover card that pops out of whichever row the pointer is on. */

export function ChangeStack({ pathName, nodes, onOpen }) {
  const layers = useMemo(() => (nodes || []).slice(0, 6).map(node => {
    const modules = node.modules || [];
    const done = modules.filter(module => module.status === "complete").length;
    return {
      node,
      done,
      total: modules.length,
      state: modules.length && done === modules.length ? "done" : done ? "active" : "todo",
      modules: modules.slice(0, 6),
    };
  }), [nodes]);

  const firstOpen = layers.findIndex(layer => layer.state !== "done");
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(null);

  // Land on the layer the reader is actually in once the path resolves.
  useEffect(() => { setSelected(firstOpen === -1 ? 0 : firstOpen); }, [firstOpen, pathName]);

  const current = layers[selected];
  if (!layers.length) return <p className="h3x-empty">Pick a path to open its change stack.</p>;

  return (
    <div className="h3x-stack">
      <span className="h3x-colorbar" aria-hidden="true">
        {["deep", "green", "mint", "mauve", "navy", "indigo", "brown", "orange", "peach", "cream"]
          .map(tone => <i key={tone} data-tone={tone} />)}
      </span>
      <div className="h3x-stack-grid">
        <div className="h3x-stack-rail">
          <span className="h3x-stack-railhead">{pathName || "No path"} · layers</span>
          {layers.map((layer, i) => (
            <div
              className="h3x-layer-row"
              key={layer.node.id}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <button
                className={`h3x-layer ${i === selected ? "sel" : ""} ${layer.state}`}
                onClick={() => setSelected(i)}
              >
                <span className="h3x-layer-dot" />
                <span className="h3x-layer-name">{layer.node.title}</span>
                <span className="h3x-layer-count">{layer.done}/{layer.total}</span>
              </button>
              {hovered === i && (
                <span className="h3x-layer-card" role="tooltip">
                  <strong>{layer.node.title}</strong>
                  <em>
                    {layer.state === "done" ? "Every module cleared."
                      : layer.state === "active" ? `${layer.total - layer.done} module${layer.total - layer.done === 1 ? "" : "s"} left in this layer.`
                        : "Not started — opens once you get here."}
                  </em>
                  <span className="h3x-layer-card-go">Open this layer →</span>
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="h3x-stack-center">
          <span className="h3x-stack-centerhead">{current.node.title}</span>
          {current.modules.map((module, i) => (
            <span className={`h3x-stack-line ${module.status === "complete" ? "done" : ""}`} key={i}>
              <i>{module.status === "complete" ? "✓" : String(i + 1).padStart(2, "0")}</i>
              {module.title}
            </span>
          ))}
          {!current.modules.length && <span className="h3x-stack-line">No modules recorded on this layer.</span>}
          <button className="h3x-stack-open" onClick={() => onOpen?.(current.node)}>
            Open {current.node.title} →
          </button>
        </div>

        <div className="h3x-stack-feed">
          <span className="h3x-stack-feedhead">Signals</span>
          {layers.slice(0, 5).map(layer => (
            <span className={`h3x-feed-item ${layer.state}`} key={layer.node.id}>
              <i />
              <b>{layer.node.title}</b>
              <em>{layer.state === "done" ? "cleared" : layer.state === "active" ? "in progress" : "queued"}</em>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
