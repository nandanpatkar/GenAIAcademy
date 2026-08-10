import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { disposeThreeScene } from "../../utils/disposeThreeScene";
import { ArrowRight, Compass, Flag, Layers3, Target } from "lucide-react";
import "./Roadmap3.css";

// ============================================================================
// Roadmap 3.0 — "fly through the world"
//
// Built on the scroll-world method: scroll does not scroll the page, it drives
// a camera. The camera flies from OUTSIDE a scene INTO its interior, then pulls
// up and out and hops across the miniature world to the next scene, with no
// cuts — one continuous connected flight.
//
// Where scroll-world pre-renders that flight as video clips and scrubs
// `video.currentTime`, we render the world live (the same three.js the 3.0
// landing page already uses), so the "clips" are camera POSES and scroll maps
// to a position along the chain. Everything else is ported straight over:
//
//   chain     = dive_0, conn_0, dive_1, conn_1, … dive_{N-1}   (2N-1 legs)
//   seam law  = a leg's end pose IS the next leg's start pose (same object,
//               never a re-derived one) — the analogue of "hand off the ACTUAL
//               rendered frame, never a fresh render of the still". This is the
//               one rule that makes or breaks the effect.
//   pacing    = per-scene `scroll` (dwell) + `linger` (the camera settles
//               mid-scene exactly while the copy peaks, then picks up speed
//               toward the seam). Seams stay untouched: f(0)=0, f(1)=1.
//
// Same props as Roadmap2, so App.jsx wires it identically.
// ============================================================================

const PATH_LABELS = {
  dsa: "DSA",
  manual: "MANUAL",
  aicxm_aws: "AICXM AWS",
  aicxm_azure: "AICXM AZURE",
  aicxm_databricks: "AICXM DATABRICKS",
  ds: "DATA SCIENCE",
  genai: "GEN AI",
  agentic: "AGENTIC AI",
};

const NON_PATH_KEYS = [
  "workspace", "videoIntelligence", "saved_algos",
  "genai-roadmap-campusx", "onboarding", "appearance", "leetcode",
];

// World geometry (three.js units). An island is 14 across, so every camera
// distance below is quoted against that.
const ISLAND_R = 7;
const PROP_SCALE = 1.32;     // how big the hero object stands on its island
const HOP = 34;              // baseline distance between consecutive islands
const MEANDER = 15;          // how far the route drifts sideways
const LIFT = 2.6;            // how much islands float above/below each other

// Camera framing. These four numbers ARE the look of the film.
const EST_BACK = 25;         // establishing shot: how far outside the island
const EST_UP = 19;           // …and how high — atan(19/25) ≈ 37°, a miniature
                             //   diorama angle rather than a flat side-on view
const INT_BACK = 12.8;       // interior: far enough that the island fills the
const INT_UP = 7.4;          //   frame instead of one prop filling it
const INT_SWING = 3.6;       // lateral offset so the dive swoops in rather than
                             //   dollying dead-straight down its own axis

// Scroll pacing, in viewport-heights per leg (scroll-world's diveScroll/connScroll).
const DIVE_SCROLL = 1.2;
const CONN_SCROLL = 0.75;
const MAX_LINGER = 0.55;     // the engine's documented ceiling — beyond it the middle stalls

// Deterministic single-hash PRNG — same seed, same float. Shared idiom with
// Roadmap 2.0's road builder so both versions lay out from the same maths.
function hashRand(seed) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// f'(0) = f'(1) = 0 — the camera settles into every seam instead of snapping
// through it. Architecture B reverses direction at each seam by design (dive
// forward, then pull back out); easing to zero there is what keeps that
// reversal reading as an intentional "rise up to the map" beat rather than a
// rewind stutter.
const smoothstep = (t) => t * t * (3 - 2 * t);

// Slows the middle of a leg without touching its endpoints: f(0)=0, f(1)=1,
// f'(0.5) = 1 - k. Monotonic for k < 1.
function lingerRemap(t, k) {
  if (!k) return t;
  return t + (k * Math.sin(2 * Math.PI * t)) / (2 * Math.PI);
}

// ---------------------------------------------------------------------------
// Route: where the islands sit
// ---------------------------------------------------------------------------

function buildRoute(count) {
  const sites = [];
  let drift = 0;
  for (let i = 0; i < count; i += 1) {
    const r = (k) => hashRand(i * 191 + k);
    // Meander like Roadmap 2.0's road: sustained drift rather than a zigzag,
    // so the aerial hops sweep across the world instead of ping-ponging.
    drift = THREE.MathUtils.clamp(drift + (r(1) - 0.45) * 2 * MEANDER * 0.7, -MEANDER, MEANDER);
    sites.push(new THREE.Vector3(
      drift,
      (r(2) - 0.5) * 2 * LIFT,
      -i * HOP * (0.9 + r(3) * 0.25),
    ));
  }
  return sites;
}

// ---------------------------------------------------------------------------
// The props — one recognisable object per roadmap stop
// ---------------------------------------------------------------------------

// First match wins, so the specific patterns sit above the general ones.
const ARCHETYPE_ROUTES = [
  ["vectorDb",        /vector|pinecone|chroma|faiss|similarity/i],
  ["crystal",         /embedding|token|bpe|vocabulary/i],
  ["scanner",         /\brag\b|retriev|document|ingest|context window/i],
  ["scrollCard",      /prompt|few.?shot|chain.of.thought|react\b|instruction/i],
  ["trainingChamber", /fine.?tun|lora|peft|training|distill/i],
  ["radar",           /llmops|eval|monitor|observab|metric|statistic|logging/i],
  ["console",         /multi.?agent|orchestrat|crew|swarm|langgraph|workflow/i],
  ["robotHead",       /agent|autonom|assistant|copilot|tool use|function call/i],
  ["brain",           /neural|deep learning|\bnlp\b|\bcnn\b|\brnn\b|lstm|transformer|attention|bert/i],
  ["gpuServer",       /\bgpu\b|compute|cluster|inference|serving|hardware/i],
  ["portal",          /\bapi\b|gateway|endpoint|fastapi|flask|rest|integration/i],
  ["rocket",          /cloud|deploy|production|launch|kubernetes|docker|ship/i],
  ["lbTower",         /load.?balanc|scal|throughput|traffic|concurren/i],
  ["queue",           /queue|stream|kafka|conveyor|linked list|buffer|pipeline/i],
  ["vault",           /\bsql\b|database|nosql|mongo|storage|warehouse|persist|hash|heap/i],
  ["blueprint",       /system design|architect|blueprint|pattern|design principle/i],
  ["microservice",    /microservice|service|module|component|package/i],
  ["gitTree",         /\bgit\b|branch|version|\btree\b|\btrie\b|\bbst\b|recursion|backtrack/i],
  ["hourglass",       /algorithm|sort|search|complexity|greedy|dynamic programming|\bdp\b|two.?pointer|sliding window/i],
  ["telescope",       /explor|\beda\b|research|discover|analys|visuali|insight/i],
  ["terminal",        /python|syntax|\boop\b|code|editor|script|notebook|shell|file i\/o/i],
  ["dataCube",        /array|matrix|dataframe|numpy|pandas|\bdata\b|feature|set\b|string/i],
  ["cloudLab",        /lab|experiment|playground|sandbox|simulat/i],
  ["mic",             /interview|voice|speech|audio|communicat/i],
  ["helmet",          /roadmap|foundation|fundamental|getting started|overview|intro/i],
  ["compass",         /math|linear algebra|probabilit|calculus|logic|graph/i],
];

function pickArchetype(node, index, total) {
  // The finale always reads as the mastery scene — it carries the CTA.
  if (index === total - 1) return "gradCap";
  const hay = `${node.title || ""} ${node.subtitle || ""} ${node.id || ""}`;
  const hit = ARCHETYPE_ROUTES.find(([, re]) => re.test(hay));
  if (hit) return hit[0];
  // No keyword match: spread the leftovers deterministically rather than
  // stamping the same object on every unmatched stop.
  const spares = ["aiCore", "dataCube", "microservice", "terminal", "compass"];
  return spares[index % spares.length];
}

// A tiny build context that remembers every geometry/material it hands out so
// the whole world can be disposed in one pass when the path switches.
function createKit(accentHex) {
  const owned = { geometries: new Set(), materials: new Set() };
  const accent = new THREE.Color(accentHex);

  const track = (thing, bucket) => { owned[bucket].add(thing); return thing; };

  // Matte clay: high roughness, zero metalness, emissive only on accents.
  const clay = (color, { emissive = 0, rough = 0.95, opacity = 1 } = {}) => track(new THREE.MeshStandardMaterial({
    color,
    roughness: rough,
    metalness: 0,
    emissive: emissive ? new THREE.Color(color) : 0x000000,
    emissiveIntensity: emissive,
    flatShading: true,
    transparent: opacity < 1,
    opacity,
  }), "materials");

  // Warm clay against the app's deep-navy sky. The path colour is used
  // sparingly — screens, cores, status rims — so it reads as light in the
  // scene rather than as paint over everything.
  const mats = {
    accent: clay(accent.getHex(), { emissive: 0.6, rough: 0.7 }),
    accentSoft: clay(accent.clone().lerp(new THREE.Color(0xd8c9b4), 0.5).getHex(), { emissive: 0.12 }),
    holo: clay(accent.getHex(), { emissive: 1.4, rough: 0.4, opacity: 0.5 }),
    shell: clay(0xe0d3bf),
    shellDark: clay(0x9a8974),
    ink: clay(0x4a4133),
    ground: clay(0xbda98e),
    groundDeep: clay(0x6d5c4a),
    pale: clay(0xf4efe4),
    warm: clay(0xd9a066),
  };

  const geo = (g) => track(g, "geometries");

  const put = (parent, geometry, material, pos = [0, 0, 0], rot = [0, 0, 0]) => {
    const m = new THREE.Mesh(geo(geometry), material);
    m.position.set(...pos);
    m.rotation.set(...rot);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };

  const box = (parent, size, pos, material, rot) => put(parent, new THREE.BoxGeometry(...size), material, pos, rot);
  const cyl = (parent, rt, rb, h, seg, pos, material, rot) => put(parent, new THREE.CylinderGeometry(rt, rb, h, seg), material, pos, rot);
  const ring = (parent, radius, tube, pos, material, rot, spin) => {
    const m = put(parent, new THREE.TorusGeometry(radius, tube, 8, 44), material, pos, rot);
    if (spin) m.userData.spin = spin;
    return m;
  };
  const float = (mesh, speed, amount) => {
    mesh.userData.float = { base: mesh.position.y, speed, amount };
    return mesh;
  };

  return { mats, geo, put, box, cyl, ring, float, owned };
}

// Every builder returns the island's focal point — the spot in its interior the
// dive lands on. Islands are open-topped on purpose: a roof would be a wall
// between the camera and the scene it is flying into. The prop stands roughly
// 4–7 units tall so it reads from the establishing shot as well as up close.
const BUILDERS = {
  // Floating AI core orb
  aiCore(g, k) {
    const { mats: m, put, cyl, ring, float } = k;
    cyl(g, 2.5, 3.2, 1.4, 10, [0, 1.7, 0], m.shell);
    [[-4, -3.2], [4, -3.2], [-4, 3.2], [4, 3.2]].forEach(([x, z]) => cyl(g, 0.34, 0.44, 4, 8, [x, 3, z], m.pale));
    float(put(g, new THREE.IcosahedronGeometry(1.7, 1), m.accent, [0, 5.4, 0]), 0.65, 0.26).userData.spin = 0.12;
    [2.6, 3.5].forEach((r, i) => ring(g, r, 0.07, [0, 5.4, 0], m.accentSoft, [Math.PI / 2 + i * 0.5, 0, i * 0.7], i ? -0.18 : 0.16));
    return new THREE.Vector3(0, 4.4, 0);
  },

  // Isometric GPU server
  gpuServer(g, k) {
    const { mats: m, box, put, cyl } = k;
    [-2.6, 0, 2.6].forEach((x, rack) => {
      box(g, [2.1, 5, 3.4], [x, 3.5, 0], m.shell);
      for (let slot = 0; slot < 5; slot += 1) {
        box(g, [1.85, 0.42, 0.12], [x, 1.6 + slot * 0.95, 1.76], slot === rack ? m.accent : m.shellDark);
      }
      cyl(g, 0.5, 0.5, 0.12, 12, [x, 6.1, -0.7], m.shellDark, [0, 0, 0]);
    });
    [-1.3, 1.3].forEach((x) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, 6, 1.4), new THREE.Vector3(x * 2.2, 7.4, 2.4), new THREE.Vector3(x * 0.6, 5.4, 3.6),
      ]);
      put(g, new THREE.TubeGeometry(curve, 18, 0.1, 6, false), m.accentSoft);
    });
    return new THREE.Vector3(0, 4, 1.2);
  },

  // Robot assistant head
  robotHead(g, k) {
    const { mats: m, box, put, cyl, float } = k;
    cyl(g, 2.2, 2.9, 1.5, 8, [0, 1.75, 0], m.shellDark);
    box(g, [4.2, 3.4, 3.4], [0, 4.3, 0], m.shell);
    box(g, [3.5, 0.9, 0.3], [0, 4.7, 1.8], m.accent);
    box(g, [0.5, 0.5, 0.5], [-2.4, 4.4, 0], m.shellDark);
    box(g, [0.5, 0.5, 0.5], [2.4, 4.4, 0], m.shellDark);
    cyl(g, 0.1, 0.1, 1.4, 6, [0, 6.6, 0], m.pale);
    float(put(g, new THREE.SphereGeometry(0.34, 12, 12), m.accent, [0, 7.5, 0]), 1.1, 0.16);
    return new THREE.Vector3(0, 4.6, 1.2);
  },

  // Holographic terminal / floating code editor
  terminal(g, k) {
    const { mats: m, box, cyl, float } = k;
    box(g, [6.4, 0.4, 3.2], [0, 1.7, 0.4], m.warm);
    [-2.7, 2.7].forEach((x) => cyl(g, 0.22, 0.28, 1.4, 6, [x, 1.1, 0.4], m.shellDark));
    box(g, [3, 0.16, 1.3], [0, 1.98, 1.4], m.shellDark);
    const panel = float(box(g, [5.2, 3.1, 0.14], [0, 4.4, -0.5], m.holo, [-0.12, 0, 0]), 0.5, 0.16);
    for (let line = 0; line < 5; line += 1) {
      box(panel, [3.6 - line * 0.5, 0.16, 0.06], [-0.6 + line * 0.22, 1 - line * 0.5, 0.12], line === 1 ? m.accent : m.pale);
    }
    return new THREE.Vector3(0, 4, 0.4);
  },

  // Vector database cylinder
  vectorDb(g, k) {
    const { mats: m, put, cyl, float } = k;
    for (let disc = 0; disc < 4; disc += 1) {
      cyl(g, 2.5, 2.5, 0.85, 16, [0, 1.9 + disc * 1.05, 0], disc % 2 ? m.shell : m.pale);
      cyl(g, 2.56, 2.56, 0.12, 16, [0, 2.35 + disc * 1.05, 0], m.accentSoft);
    }
    for (let point = 0; point < 14; point += 1) {
      const a = point * 2.4;
      const r = 3.4 + (point % 3) * 0.6;
      float(put(g, new THREE.OctahedronGeometry(0.22, 0), m.accent, [Math.cos(a) * r, 3 + (point % 5) * 0.85, Math.sin(a) * r]), 0.5 + (point % 4) * 0.1, 0.2);
    }
    return new THREE.Vector3(0, 4.2, 0);
  },

  // Neural-network brain
  brain(g, k) {
    const { mats: m, put, cyl, float } = k;
    cyl(g, 2, 2.7, 1.3, 10, [0, 1.65, 0], m.shellDark);
    [-1, 1].forEach((side) => put(g, new THREE.IcosahedronGeometry(1.9, 1), m.warm, [side * 1.05, 3.9, 0]));
    const nodes = [[-2.6, 6.2, 0], [0, 7, 0.7], [2.6, 6.2, 0], [-1.4, 5.6, 2], [1.4, 5.6, -2]];
    nodes.forEach(([x, y, z], i) => float(put(g, new THREE.SphereGeometry(0.3, 10, 10), m.accent, [x, y, z]), 0.6 + i * 0.09, 0.14));
    [[0, 1], [1, 2], [0, 3], [2, 4], [1, 3]].forEach(([a, b]) => {
      const curve = new THREE.LineCurve3(new THREE.Vector3(...nodes[a]), new THREE.Vector3(...nodes[b]));
      put(g, new THREE.TubeGeometry(curve, 6, 0.05, 5, false), m.accentSoft);
    });
    return new THREE.Vector3(0, 4.6, 0);
  },

  // Glowing data cube
  dataCube(g, k) {
    const { mats: m, box, cyl, float } = k;
    cyl(g, 2.7, 3.3, 1.1, 4, [0, 1.55, 0], m.shellDark, [0, Math.PI / 4, 0]);
    const cube = float(box(g, [3.4, 3.4, 3.4], [0, 4.4, 0], m.holo), 0.45, 0.22);
    cube.userData.spin = 0.09;
    for (let cell = 0; cell < 8; cell += 1) {
      box(cube, [0.9, 0.9, 0.9], [((cell % 2) - 0.5) * 1.5, (Math.floor(cell / 4) - 0.5) * 1.5, ((Math.floor(cell / 2) % 2) - 0.5) * 1.5], cell % 3 === 0 ? m.accent : m.pale);
    }
    [-3.6, 3.6].forEach((x) => box(g, [0.6, 1.8, 0.6], [x, 2.1, 0], m.shell));
    return new THREE.Vector3(0, 4.2, 0);
  },

  // Agent command console
  console(g, k) {
    const { mats: m, box, put, cyl } = k;
    for (let seg = -1; seg <= 1; seg += 1) {
      const a = seg * 0.55;
      box(g, [3, 0.42, 1.6], [Math.sin(a) * 3.4, 2, -Math.cos(a) * 3.4 + 3.4], m.shell, [0, -a, 0]);
      const screen = box(g, [2.7, 1.9, 0.14], [Math.sin(a) * 4.4, 3.5, -Math.cos(a) * 4.4 + 3.4], m.holo, [-0.16, -a, 0]);
      box(screen, [2, 0.14, 0.06], [0, 0.4, 0.1], seg === 0 ? m.accent : m.pale);
      box(screen, [1.3, 0.14, 0.06], [-0.3, 0, 0.1], m.pale);
    }
    [-2.2, 2.2].forEach((x) => cyl(g, 0.75, 0.95, 1.1, 10, [x, 1.65, -1.6], m.warm));
    put(g, new THREE.OctahedronGeometry(0.8, 0), m.accent, [0, 5.4, 1]).userData.spin = 0.2;
    return new THREE.Vector3(0, 3.8, 1.4);
  },

  // Cloud deployment rocket
  rocket(g, k) {
    const { mats: m, put, cyl, ring, float } = k;
    cyl(g, 3.2, 3.7, 0.8, 14, [0, 1.5, 0], m.shellDark);
    const r = new THREE.Group();
    r.position.set(0, 1.9, 0);
    float(r, 0.55, 0.3);
    cyl(r, 0.8, 1, 4.4, 14, [0, 2.7, 0], m.pale);
    put(r, new THREE.ConeGeometry(1, 2, 14), m.accent, [0, 5.9, 0]);
    put(r, new THREE.ConeGeometry(0.62, 1.8, 12), m.accentSoft, [0, -0.2, 0], [Math.PI, 0, 0]);
    [0, Math.PI / 2].forEach((rot) => put(r, new THREE.BoxGeometry(0.18, 1.3, 1.7), m.shellDark, [0, 1.4, 0], [0, rot, 0]));
    g.add(r);
    [2.4, 3.3].forEach((radius, i) => ring(g, radius, 0.06, [0, 2, 0], m.accent, [Math.PI / 2, 0, 0], i ? -0.19 : 0.16));
    [[-4.2, 2.4], [4.2, -2.4]].forEach(([x, z]) => {
      put(g, new THREE.SphereGeometry(1.1, 10, 8), m.shell, [x, 2.1, z]);
      put(g, new THREE.SphereGeometry(0.8, 10, 8), m.shell, [x + 1.1, 1.9, z]);
    });
    return new THREE.Vector3(0, 4.4, 0);
  },

  // RAG document scanner
  scanner(g, k) {
    const { mats: m, box, float } = k;
    box(g, [6, 0.5, 3.6], [0, 1.75, 0], m.shell);
    [-3.1, 3.1].forEach((x) => box(g, [0.4, 3.4, 0.4], [x, 3.4, 0], m.shellDark));
    const bar = float(box(g, [6.4, 0.34, 0.9], [0, 3.6, 0], m.accent), 0.7, 0.5);
    bar.userData.float.base = 3.6;
    for (let doc = 0; doc < 5; doc += 1) {
      float(box(g, [1.5, 0.1, 2], [-2.4 + doc * 1.2, 4.9 + doc * 0.42, -0.4 + doc * 0.2], doc === 2 ? m.accentSoft : m.pale, [0, doc * 0.24, 0.1]), 0.4 + doc * 0.11, 0.18);
    }
    box(g, [1.6, 1.1, 1.6], [0, 2.55, -2.6], m.warm);
    return new THREE.Vector3(0, 4.2, 0);
  },

  // Embedding crystal
  crystal(g, k) {
    const { mats: m, put, cyl, ring, float } = k;
    cyl(g, 2.2, 3, 1.5, 6, [0, 1.75, 0], m.shellDark);
    float(put(g, new THREE.OctahedronGeometry(2.1, 0), m.holo, [0, 4.9, 0]), 0.45, 0.24).userData.spin = 0.1;
    put(g, new THREE.OctahedronGeometry(0.8, 0), m.accent, [0, 4.9, 0]);
    [[-2.6, 3.6], [2.6, 3.9], [0.4, 3.3]].forEach(([x, y], i) => {
      float(put(g, new THREE.OctahedronGeometry(0.55 + i * 0.12, 0), m.accentSoft, [x, y, i === 2 ? 2.6 : -1.4]), 0.5 + i * 0.15, 0.2);
    });
    ring(g, 3.2, 0.06, [0, 4.9, 0], m.accentSoft, [Math.PI / 2, 0, 0], 0.14);
    return new THREE.Vector3(0, 4.4, 0);
  },

  // Prompt scroll / card
  scrollCard(g, k) {
    const { mats: m, box, cyl, float } = k;
    box(g, [4.6, 0.4, 2.8], [0, 2.5, 0], m.warm, [-0.3, 0, 0]);
    [-1.9, 1.9].forEach((x) => box(g, [0.34, 2.4, 0.34], [x, 1.3, 0.6], m.shellDark));
    cyl(g, 0.42, 0.42, 4.4, 10, [0, 3.15, 0.5], m.pale, [0, 0, Math.PI / 2]);
    box(g, [4.2, 0.12, 2.4], [0, 3.05, -0.5], m.pale, [-0.3, 0, 0]);
    box(g, [2.8, 0.1, 0.14], [0, 3.3, -0.5], m.accent, [-0.3, 0, 0]);
    for (let card = 0; card < 3; card += 1) {
      float(box(g, [1.5, 1.9, 0.1], [-2.6 + card * 2.6, 5.4 + card * 0.3, -1.6], card === 1 ? m.accent : m.holo, [0, card * 0.3 - 0.3, 0]), 0.45 + card * 0.14, 0.24);
    }
    return new THREE.Vector3(0, 4, -0.2);
  },

  // API gateway portal
  portal(g, k) {
    const { mats: m, put, box, cyl, ring, float } = k;
    box(g, [7, 0.5, 2.4], [0, 1.7, 0], m.shell);
    ring(g, 2.6, 0.36, [0, 4.6, 0], m.shellDark, [0, 0, 0]);
    ring(g, 2.15, 0.1, [0, 4.6, 0.1], m.accent, [0, 0, 0], 0.22);
    put(g, new THREE.CircleGeometry(2.1, 24), m.holo, [0, 4.6, 0]);
    [-3.4, 3.4].forEach((x) => cyl(g, 0.34, 0.44, 3.6, 8, [x, 3.4, 0], m.pale));
    for (let packet = 0; packet < 4; packet += 1) {
      float(box(g, [0.42, 0.42, 0.42], [-2.4 + packet * 1.6, 2.6 + (packet % 2) * 0.7, 2.4], m.accentSoft), 0.6 + packet * 0.12, 0.2);
    }
    return new THREE.Vector3(0, 4.4, 0.6);
  },

  // System-design blueprint
  blueprint(g, k) {
    const { mats: m, box, cyl } = k;
    box(g, [6.2, 0.36, 3.8], [0, 2.3, 0], m.warm, [-0.42, 0, 0]);
    [-2.6, 2.6].forEach((x) => cyl(g, 0.24, 0.3, 2.2, 6, [x, 1.3, 0.5], m.shellDark));
    const board = box(g, [5.4, 0.1, 3.2], [0, 2.6, -0.1], m.holo, [-0.42, 0, 0]);
    [[-1.5, 0.8], [0.4, 0.2], [1.7, -0.7]].forEach(([bx, bz], i) => {
      box(board, [1.1, 0.08, 0.8], [bx, 0.12, bz], i === 1 ? m.accent : m.pale);
    });
    [[-3.9, 1.9], [3.9, -1.4]].forEach(([x, z], i) => box(g, [1.2, 1.6 + i * 0.8, 1.2], [x, 2 + i * 0.4, z], m.shell));
    return new THREE.Vector3(0, 3.6, 0.4);
  },

  // Microservice building
  microservice(g, k) {
    const { mats: m, box, put } = k;
    const towers = [[-2.8, -1.6, 4.4], [0.2, 1.8, 6], [2.9, -0.8, 3.2], [-0.6, -3.2, 2.6]];
    towers.forEach(([x, z, h], i) => {
      box(g, [2, h, 2], [x, 1.2 + h / 2, z], i === 1 ? m.shell : m.shellDark);
      box(g, [2.2, 0.2, 2.2], [x, 1.3 + h, z], m.accentSoft);
      for (let floorIndex = 0; floorIndex < Math.floor(h / 1.4); floorIndex += 1) {
        box(g, [1.2, 0.22, 0.06], [x, 2.1 + floorIndex * 1.3, z + 1.04], i === 1 ? m.accent : m.pale);
      }
    });
    put(g, new THREE.TorusGeometry(3.4, 0.06, 6, 40), m.accentSoft, [0, 1.4, 0.6], [Math.PI / 2, 0, 0]).userData.spin = 0.08;
    return new THREE.Vector3(0, 4.2, 0.6);
  },

  // Message-queue conveyor
  queue(g, k) {
    const { mats: m, box, cyl, put } = k;
    box(g, [9.4, 0.42, 2], [0, 2.1, 0], m.shellDark);
    for (let roller = 0; roller < 8; roller += 1) {
      cyl(g, 0.36, 0.36, 2.3, 10, [-4 + roller * 1.15, 2.42, 0], m.pale, [Math.PI / 2, 0, 0]).userData.spin = 0.6;
    }
    [-3.4, 0.2, 3.4].forEach((x, i) => box(g, [1.05, 1.05, 1.05], [x, 3.2, 0], i === 1 ? m.accent : m.warm));
    [-4.6, 4.6].forEach((x) => box(g, [0.6, 2.6, 2.4], [x, 3.2, 0], m.shell));
    put(g, new THREE.TorusGeometry(1.5, 0.14, 6, 24, Math.PI), m.accentSoft, [0, 4.2, 0], [0, 0, 0]);
    return new THREE.Vector3(0, 3.4, 0.6);
  },

  // Database vault
  vault(g, k) {
    const { mats: m, box, cyl, ring } = k;
    box(g, [5.4, 4.6, 4], [0, 3.6, -0.5], m.shell);
    cyl(g, 1.9, 1.9, 0.5, 20, [0, 3.9, 1.6], m.shellDark, [Math.PI / 2, 0, 0]);
    ring(g, 1.55, 0.13, [0, 3.9, 1.9], m.accent, [0, 0, 0], 0.18);
    [0, Math.PI / 2].forEach((rot) => box(g, [2.6, 0.24, 0.24], [0, 3.9, 2], m.pale, [0, 0, rot + 0.5]));
    for (let disc = 0; disc < 3; disc += 1) {
      cyl(g, 1.15, 1.15, 0.3, 14, [0, 6.4 + disc * 0.42, -0.5], disc === 1 ? m.accentSoft : m.pale);
    }
    return new THREE.Vector3(0, 4, 1.6);
  },

  // Load-balancer tower
  lbTower(g, k) {
    const { mats: m, box, cyl, put, float } = k;
    cyl(g, 1.1, 1.9, 6.4, 8, [0, 4.3, 0], m.shell);
    float(put(g, new THREE.OctahedronGeometry(0.9, 0), m.accent, [0, 8.2, 0]), 0.8, 0.16);
    const feet = [[-3.6, 2.4], [0, -3.8], [3.6, 2.4]];
    feet.forEach(([x, z], i) => {
      box(g, [1.5, 1.3, 1.5], [x, 1.95, z], i === 1 ? m.accentSoft : m.shellDark);
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 7.2, 0), new THREE.Vector3(x * 0.6, 5, z * 0.6), new THREE.Vector3(x, 2.7, z),
      ]);
      put(g, new THREE.TubeGeometry(curve, 16, 0.07, 5, false), m.accentSoft);
    });
    return new THREE.Vector3(0, 4.6, 0);
  },

  // Monitoring radar dish
  radar(g, k) {
    const { mats: m, box, cyl, put } = k;
    cyl(g, 1.3, 2.1, 3.2, 10, [0, 2.6, -0.6], m.shell);
    const dish = put(g, new THREE.SphereGeometry(2.6, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2.5), m.pale, [0, 4.8, -0.6], [-0.6, 0.3, 0]);
    dish.userData.spin = 0.07;
    cyl(g, 0.11, 0.11, 2.2, 6, [0, 5.7, 0.5], m.accent, [-0.6, 0, 0]);
    for (let bar = 0; bar < 5; bar += 1) {
      const h = 0.7 + bar * 0.62;
      box(g, [0.7, h, 0.7], [-3.6 + bar * 0.95, 1.45 + h / 2, 3.4], bar === 4 ? m.accent : m.accentSoft);
    }
    return new THREE.Vector3(0, 4.2, 0.6);
  },

  // Interview microphone
  mic(g, k) {
    const { mats: m, box, cyl, put, float } = k;
    cyl(g, 1.7, 2.3, 0.7, 12, [0, 1.55, 0], m.shellDark);
    cyl(g, 0.13, 0.13, 4.4, 8, [0, 3.6, 0], m.pale, [0, 0, -0.24]);
    cyl(g, 0.14, 0.14, 2.2, 8, [-0.9, 5.5, 0], m.pale, [0, 0, Math.PI / 2 - 0.4]);
    float(put(g, new THREE.CapsuleGeometry(0.52, 1, 8, 14), m.accent, [-1.9, 5.1, 0], [0, 0, 0.35]), 0.7, 0.1);
    put(g, new THREE.CircleGeometry(0.85, 20), m.holo, [-1.9, 5.1, 1.1]);
    [[-3.4, 2.2], [3.2, -2], [2.6, 2.8]].forEach(([x, z]) => box(g, [1.2, 0.4, 1.1], [x, 1.6, z], m.warm));
    return new THREE.Vector3(-0.8, 4.4, 0.6);
  },

  // Algorithm hourglass
  hourglass(g, k) {
    const { mats: m, put, cyl } = k;
    cyl(g, 2.4, 2.8, 0.6, 12, [0, 1.5, 0], m.warm);
    cyl(g, 2.4, 2.8, 0.6, 12, [0, 6.6, 0], m.warm);
    [0, Math.PI / 2].forEach((rot) => {
      [-1, 1].forEach((side) => cyl(g, 0.16, 0.16, 5.2, 6, [Math.cos(rot) * side * 2.2, 4.05, Math.sin(rot) * side * 2.2], m.shellDark));
    });
    put(g, new THREE.ConeGeometry(1.8, 2.3, 16), m.holo, [0, 3, 0]);
    put(g, new THREE.ConeGeometry(1.8, 2.3, 16), m.holo, [0, 5.1, 0], [Math.PI, 0, 0]);
    put(g, new THREE.ConeGeometry(1.5, 1.6, 16), m.accent, [0, 2.75, 0]);
    return new THREE.Vector3(0, 4.2, 0);
  },

  // Knowledge telescope
  telescope(g, k) {
    const { mats: m, put, cyl, float } = k;
    [[-1.8, 1.2], [1.8, 1.2], [0, -2.2]].forEach(([x, z]) => cyl(g, 0.14, 0.2, 3.4, 6, [x, 2.6, z], m.shellDark, [x ? (x > 0 ? -0.25 : 0.25) : 0, 0, 0]));
    cyl(g, 0.55, 0.85, 5, 12, [0, 5, 0.4], m.pale, [-0.75, 0.3, 0]);
    cyl(g, 0.92, 0.92, 0.4, 12, [1.2, 6.5, -1.2], m.accent, [-0.75, 0.3, 0]);
    cyl(g, 0.9, 1.2, 0.7, 12, [0, 3.9, 0.2], m.shell);
    for (let star = 0; star < 6; star += 1) {
      float(put(g, new THREE.OctahedronGeometry(0.2, 0), m.accentSoft, [-3 + star * 1.2, 7.4 + (star % 3) * 0.6, -2 + (star % 2) * 1.4]), 0.4 + star * 0.1, 0.24);
    }
    return new THREE.Vector3(0.4, 4.8, 0);
  },

  // Git branch tree
  gitTree(g, k) {
    const { mats: m, put, cyl } = k;
    cyl(g, 0.42, 0.62, 3.4, 8, [0, 2.7, 0], m.warm);
    const commits = [[0, 4.4, 0], [-2.1, 5.6, 0.6], [2.2, 5.4, -0.6], [-3.2, 7, 1.2], [3.1, 7.2, -1.1], [0.2, 7.6, 0.2]];
    commits.forEach(([x, y, z], i) => put(g, new THREE.SphereGeometry(0.42, 12, 12), i === 0 || i === 5 ? m.accent : m.accentSoft, [x, y, z]));
    [[0, 1], [0, 2], [1, 3], [2, 4], [1, 5], [2, 5]].forEach(([a, b]) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(...commits[a]),
        new THREE.Vector3((commits[a][0] + commits[b][0]) / 2, (commits[a][1] + commits[b][1]) / 2 + 0.4, (commits[a][2] + commits[b][2]) / 2),
        new THREE.Vector3(...commits[b]),
      ]);
      put(g, new THREE.TubeGeometry(curve, 14, 0.075, 5, false), m.pale);
    });
    return new THREE.Vector3(0, 4.8, 0);
  },

  // Circuit-board compass
  compass(g, k) {
    const { mats: m, box, put, cyl, ring, float } = k;
    cyl(g, 3.4, 3.6, 0.6, 24, [0, 1.7, 0], m.shellDark);
    ring(g, 3.1, 0.12, [0, 2.05, 0], m.accentSoft, [Math.PI / 2, 0, 0]);
    for (let trace = 0; trace < 6; trace += 1) {
      const a = (trace / 6) * Math.PI * 2;
      box(g, [0.14, 0.08, 2], [Math.cos(a) * 2, 2.05, Math.sin(a) * 2], m.accentSoft, [0, -a, 0]);
      box(g, [0.4, 0.24, 0.4], [Math.cos(a) * 2.8, 2.15, Math.sin(a) * 2.8], trace % 2 ? m.pale : m.accent);
    }
    const needle = float(put(g, new THREE.ConeGeometry(0.55, 3.4, 4), m.accent, [0, 3.4, 0], [Math.PI / 2, 0, 0]), 0.5, 0.12);
    needle.userData.spin = 0.25;
    cyl(g, 0.5, 0.7, 1.4, 10, [0, 2.6, 0], m.shell);
    return new THREE.Vector3(0, 3.6, 0);
  },

  // Model-training chamber
  trainingChamber(g, k) {
    const { mats: m, box, put, cyl, ring, float } = k;
    cyl(g, 2, 2.4, 0.8, 14, [0, 1.7, 0], m.shellDark);
    put(g, new THREE.CapsuleGeometry(1.7, 2.4, 8, 18), m.holo, [0, 4.3, 0]);
    float(put(g, new THREE.IcosahedronGeometry(1, 1), m.accent, [0, 4.3, 0]), 0.75, 0.2).userData.spin = 0.18;
    [2.9, 3.7, 4.5].forEach((y, i) => ring(g, 2.1, 0.09, [0, y, 0], m.accentSoft, [Math.PI / 2, 0, 0], i % 2 ? -0.2 : 0.2));
    box(g, [1.8, 1.4, 1.2], [3.6, 2.3, 1.4], m.shell);
    box(g, [1.3, 0.7, 0.1], [3.6, 2.6, 2.05], m.accent);
    [-3.6, 3.6].forEach((x) => cyl(g, 0.22, 0.3, 3.4, 6, [x, 3, -2.2], m.pale));
    return new THREE.Vector3(0, 4.4, 0.6);
  },

  // Miniature cloud laboratory
  cloudLab(g, k) {
    const { mats: m, put, cyl, float } = k;
    cyl(g, 3, 3.4, 0.7, 14, [0, 1.55, 0], m.shell);
    put(g, new THREE.SphereGeometry(2.7, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), m.holo, [0, 1.9, 0]);
    [[-1.2, 0.6], [0.4, -0.8], [1.4, 0.9]].forEach(([x, z], i) => {
      cyl(g, 0.35, 0.5, 1.4, 10, [x, 2.6, z], m.pale);
      cyl(g, 0.3, 0.3, 0.5, 10, [x, 2.4, z], i === 1 ? m.accent : m.accentSoft);
    });
    [[-3.4, 2, 4.6], [3.6, -1.8, 5.4], [0.2, 4.2, 5]].forEach(([x, z, y]) => {
      const puff = float(put(g, new THREE.SphereGeometry(1, 10, 8), m.pale, [x, y, z]), 0.4, 0.24);
      put(puff, new THREE.SphereGeometry(0.7, 10, 8), m.pale, [0.9, -0.2, 0.1]);
      put(puff, new THREE.SphereGeometry(0.6, 10, 8), m.pale, [-0.9, -0.3, -0.1]);
    });
    return new THREE.Vector3(0, 3.8, 0);
  },

  // AI architect helmet
  helmet(g, k) {
    const { mats: m, box, put, cyl } = k;
    cyl(g, 1.4, 2, 1.4, 10, [0, 1.9, 0], m.shellDark);
    put(g, new THREE.SphereGeometry(2.1, 20, 14, 0, Math.PI * 2, 0, Math.PI / 1.75), m.warm, [0, 4.2, 0]);
    put(g, new THREE.SphereGeometry(1.85, 20, 14, -0.9, 1.8, 0.55, 0.85), m.holo, [0, 4.2, 0.15]);
    cyl(g, 0.14, 0.14, 1.6, 6, [1.6, 5.4, -0.4], m.pale, [0, 0, -0.5]);
    put(g, new THREE.SphereGeometry(0.26, 10, 10), m.accent, [2.2, 6, -0.4]);
    [[-3.4, 2.4], [3.4, 2.4]].forEach(([x, z]) => box(g, [0.9, 0.9, 0.9], [x, 1.85, z], m.accentSoft));
    return new THREE.Vector3(0, 4.2, 1);
  },

  // Cybernetic graduation cap — the finale
  gradCap(g, k) {
    const { mats: m, box, put, cyl, ring, float } = k;
    cyl(g, 2.2, 3, 1.5, 10, [0, 1.75, 0], m.shellDark);
    cyl(g, 1.5, 1.9, 1.5, 12, [0, 3.5, 0], m.warm);
    const board = float(box(g, [5.4, 0.34, 5.4], [0, 4.6, 0], m.accent, [0, 0.4, 0]), 0.45, 0.18);
    put(board, new THREE.SphereGeometry(0.3, 10, 10), m.pale, [0, 0.3, 0]);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 4.8, 0), new THREE.Vector3(2.4, 4.4, 1.6), new THREE.Vector3(3.2, 3, 2.2),
    ]);
    put(g, new THREE.TubeGeometry(curve, 18, 0.09, 5, false), m.pale);
    put(g, new THREE.ConeGeometry(0.4, 1, 8), m.pale, [3.2, 2.4, 2.2]);
    [3, 4].forEach((radius, i) => ring(g, radius, 0.07, [0, 2.2, 0], m.accentSoft, [Math.PI / 2, 0, 0], i ? -0.16 : 0.13));
    return new THREE.Vector3(0, 4.2, 0);
  },
};

function createIsland(kit, site, node, archetype, state) {
  const { mats, put } = kit;
  const group = new THREE.Group();
  group.position.copy(site);

  put(group, new THREE.CylinderGeometry(ISLAND_R, ISLAND_R * 0.93, 1.2, 10), mats.ground, [0, 0.4, 0]);
  put(group, new THREE.CylinderGeometry(ISLAND_R * 0.84, ISLAND_R * 0.34, 3.4, 10), mats.groundDeep, [0, -1.9, 0]);

  // Status rim: the roadmap's progress state, read at a glance from the air.
  const rim = put(
    group,
    new THREE.TorusGeometry(ISLAND_R * 0.94, 0.09, 8, 52),
    state === "done" ? mats.accent : mats.accentSoft,
    [0, 0.98, 0],
    [Math.PI / 2, 0, 0],
  );
  rim.userData.spin = state === "progress" ? 0.14 : 0.03;

  // Props are authored at a comfortable modelling scale and then sized up as a
  // group, so the object — not the clay disc it stands on — is the subject from
  // the establishing shot onward.
  const props = new THREE.Group();
  props.scale.setScalar(PROP_SCALE);
  group.add(props);
  const focal = (BUILDERS[archetype] || BUILDERS.aiCore)(props, kit).multiplyScalar(PROP_SCALE);

  // Kerb markers, denser on completed stops so finished islands read busier.
  const markerCount = state === "done" ? 14 : 9;
  for (let marker = 0; marker < markerCount; marker += 1) {
    const angle = (marker / markerCount) * Math.PI * 2;
    const radius = ISLAND_R * 0.78;
    put(
      group,
      new THREE.CylinderGeometry(0.1, 0.18, 0.55 + (marker % 3) * 0.2, 6),
      marker % 3 === 0 ? mats.accentSoft : mats.shellDark,
      [Math.cos(angle) * radius, 1.2, Math.sin(angle) * radius],
    );
  }

  group.userData.focal = focal;
  group.userData.nodeId = node.id;
  return group;
}

// ---------------------------------------------------------------------------
// The flight chain — dive_0, conn_0, dive_1, … dive_{N-1}
// ---------------------------------------------------------------------------

const pose = (pos, look) => ({ pos, look });

function buildChain(sites, islands, pacing) {
  // Two poses per island: the establishing shot from outside and above, and the
  // interior the dive lands in.
  const establish = [];
  const interior = [];

  sites.forEach((site, i) => {
    // Approach along the route so a connector arrives facing forward rather
    // than swinging around the island to get into position.
    const prev = sites[i - 1] || site.clone().add(new THREE.Vector3(0, 0, HOP));
    const approach = site.clone().sub(prev).setY(0).normalize();
    const side = new THREE.Vector3(-approach.z, 0, approach.x);
    const swing = (hashRand(i * 37 + 5) - 0.5) * 2 * INT_SWING;
    const focal = islands[i].userData.focal;

    // High and outside, angled down onto the whole island — the miniature
    // diorama read, not a flat side-on view.
    establish.push(pose(
      site.clone()
        .addScaledVector(approach, -EST_BACK)
        .addScaledVector(side, swing * 1.6)
        .add(new THREE.Vector3(0, EST_UP, 0)),
      site.clone().add(new THREE.Vector3(0, 1.6, 0)),
    ));

    // Down among the props at a three-quarter angle, far enough back that the
    // island fills the frame rather than one object filling the lens.
    interior.push(pose(
      site.clone()
        .addScaledVector(approach, -INT_BACK)
        .addScaledVector(side, swing)
        .add(new THREE.Vector3(0, INT_UP, 0)),
      site.clone().add(focal),
    ));
  });

  // The seam law: a leg's `to` and the next leg's `from` are the SAME pose
  // object, never two separately-computed ones. Drift is impossible by
  // construction — this is what "hand off the actual frame" means here.
  const legs = [];
  sites.forEach((_, i) => {
    legs.push({
      kind: "dive",
      scene: i,
      from: establish[i],
      to: interior[i],
      weight: DIVE_SCROLL * pacing[i].scroll,
      linger: pacing[i].linger,
    });
    if (i < sites.length - 1) {
      legs.push({
        kind: "connector",
        scene: i,
        from: interior[i],        // === the previous leg's `to`
        to: establish[i + 1],     // === the next dive's `from`
        weight: CONN_SCROLL,
        linger: 0,
      });
    }
  });

  // Cheap continuity assertion — cheap enough to always run, and it catches the
  // one mistake that ruins the whole effect if the chain is ever rebuilt.
  for (let i = 1; i < legs.length; i += 1) {
    if (legs[i].from !== legs[i - 1].to) {
      console.error("[Roadmap3] seam broken between legs", i - 1, i);
    }
  }

  const total = legs.reduce((sum, leg) => sum + leg.weight, 0);
  let acc = 0;
  legs.forEach((leg) => {
    leg.start = acc / total;
    acc += leg.weight;
    leg.end = acc / total;
  });

  return { legs, total };
}

const _up = new THREE.Vector3();
const _c1 = new THREE.Vector3();
const _c2 = new THREE.Vector3();

function bezier(out, p0, c1, c2, p3, t) {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return out.set(
    a * p0.x + b * c1.x + c * c2.x + d * p3.x,
    a * p0.y + b * c1.y + c * c2.y + d * p3.y,
    a * p0.z + b * c1.z + c * c2.z + d * p3.z,
  );
}

// Samples the whole chain at global progress g ∈ [0,1] into `outPos`/`outLook`.
function sampleChain(legs, g, outPos, outLook) {
  let index = legs.length - 1;
  for (let i = 0; i < legs.length; i += 1) {
    if (g < legs[i].end || i === legs.length - 1) { index = i; break; }
  }
  const leg = legs[index];
  const span = Math.max(1e-6, leg.end - leg.start);
  const local = THREE.MathUtils.clamp((g - leg.start) / span, 0, 1);
  const t = lingerRemap(smoothstep(local), leg.linger);

  if (leg.kind === "dive") {
    // Swoop rather than dolly: the camera holds its altitude a beat, then drops
    // in, so the island opens up beneath it instead of sliding toward the lens.
    // Both control points stay ABOVE the straight line: the camera descends
    // onto the island from over it and never undershoots into the deck.
    _c1.lerpVectors(leg.from.pos, leg.to.pos, 0.42).addScaledVector(_up.set(0, 1, 0), 3.2);
    _c2.lerpVectors(leg.from.pos, leg.to.pos, 0.82).addScaledVector(_up.set(0, 1, 0), 0.9);
    bezier(outPos, leg.from.pos, _c1, _c2, leg.to.pos, t);
  } else {
    // The aerial hop: rise straight up out of the interior, glide across the
    // world, then descend into the next establishing shot.
    _c1.copy(leg.from.pos).add(_up.set(0, 24, 0));
    _c2.copy(leg.to.pos).add(_up.set(0, 20, 0));
    bezier(outPos, leg.from.pos, _c1, _c2, leg.to.pos, t);
  }

  // Hard floor: whatever the curve does, the camera stays clear of the island
  // deck it is flying over. Both of this leg's look targets sit on islands, so
  // the lower of the two is the surface to keep above.
  outPos.y = Math.max(outPos.y, Math.min(leg.from.look.y, leg.to.look.y) + 1.4);

  outLook.lerpVectors(leg.from.look, leg.to.look, t);
  if (leg.kind === "connector") {
    // Look down at the miniature world at the top of the arc — the "zoom out to
    // the map" beat that makes the hop read as travel rather than a cut.
    outLook.y -= Math.sin(t * Math.PI) * 9;
  }
  return { leg, local };
}

// ---------------------------------------------------------------------------
// Canvas
// ---------------------------------------------------------------------------

function WorldCanvas({ scrollRef, scenes, accent, onFrame, reducedMotion, apiRef }) {
  const mountRef = useRef(null);
  const frameRef = useRef(onFrame);
  frameRef.current = onFrame;

  useEffect(() => {
    const mount = mountRef.current;
    const scroller = scrollRef.current;
    if (!mount || !scroller || !scenes.length) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07101d);
    scene.fog = new THREE.FogExp2(0x07101d, 0.011);

    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 460);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(mount.clientWidth || 1, mount.clientHeight || 1, false);
    renderer.shadowMap.enabled = !reducedMotion;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    // Warm key over a cool sky fill — clay-diorama light. The path colour is
    // carried by the per-island point lights rather than the key.
    scene.add(new THREE.HemisphereLight(0xa8ccff, 0x2a2418, 1.75));
    const key = new THREE.DirectionalLight(0xffeacc, 3.1);
    key.castShadow = !reducedMotion;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -26;
    key.shadow.camera.right = 26;
    key.shadow.camera.top = 26;
    key.shadow.camera.bottom = -26;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 120;
    key.shadow.bias = -0.0012;
    scene.add(key);
    scene.add(key.target);

    const kit = createKit(accent);
    const sites = buildRoute(scenes.length);
    const world = new THREE.Group();
    scene.add(world);

    const islands = scenes.map((s, i) => {
      const island = createIsland(kit, sites[i], s.node, s.archetype, s.state);
      world.add(island);
      return island;
    });

    // One accent light per island, so the interior is lit by the path's colour
    // once the camera is down inside it.
    const lights = sites.map((site) => {
      const light = new THREE.PointLight(new THREE.Color(accent), 22, 32, 2);
      light.position.copy(site).add(new THREE.Vector3(0, 6.5, 0));
      scene.add(light);
      return light;
    });

    // The route itself, a glowing ribbon between the islands — the thing the
    // camera is following, visible from the top of every hop.
    const routeCurve = new THREE.CatmullRomCurve3(sites.map((s) => s.clone().setY(s.y + 0.9)));
    const routeGeo = new THREE.TubeGeometry(routeCurve, Math.max(40, sites.length * 26), 0.085, 7, false);
    const routeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(accent),
      emissive: new THREE.Color(accent),
      emissiveIntensity: 1.25,
      transparent: true,
      opacity: 0.42,
    });
    kit.owned.geometries.add(routeGeo);
    kit.owned.materials.add(routeMat);
    world.add(new THREE.Mesh(routeGeo, routeMat));

    // Dust motes — miniature-world atmosphere. Dropped on reduced motion and on
    // touch, where they cost more than they add.
    let motes = null;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (!reducedMotion && !coarse) {
      const positions = [];
      const depth = sites.length * HOP + 60;
      for (let i = 0; i < 620; i += 1) {
        const r = hashRand(i * 7 + 3);
        positions.push((r - 0.5) * 130, 2 + ((i * 13) % 40), 30 - ((i * 29) % depth));
      }
      const moteGeo = new THREE.BufferGeometry();
      moteGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      const moteMat = new THREE.PointsMaterial({ color: 0xd8c4a4, size: 0.1, transparent: true, opacity: 0.38 });
      kit.owned.geometries.add(moteGeo);
      kit.owned.materials.add(moteMat);
      motes = new THREE.Points(moteGeo, moteMat);
      scene.add(motes);
    }

    const pacing = scenes.map((s) => s.pacing);
    const chain = buildChain(sites, islands, pacing);

    const progress = { target: 0, current: 0 };
    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();
    const pull = new THREE.Vector3();
    let narrow = mount.clientWidth <= 860;
    let lastWidth = mount.clientWidth;
    let frameId = 0;
    let lastScene = -1;
    const startedAt = performance.now();

    const readScroll = () => {
      const max = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
      progress.target = THREE.MathUtils.clamp(scroller.scrollTop / max, 0, 1);
    };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      narrow = width <= 860;
      camera.fov = narrow ? 60 : 44;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    // A phone's URL bar collapsing fires `resize` with the same width. Re-running
    // layout there is what makes a page jump mid-scroll, so height-only resizes
    // are ignored on touch (rotation still comes through orientationchange).
    const onResize = () => {
      const width = mount.clientWidth;
      if (coarse && width === lastWidth) return;
      lastWidth = width;
      resize();
    };

    const draw = (timestamp = performance.now()) => {
      const elapsed = (timestamp - startedAt) / 1000;
      progress.current = reducedMotion
        ? progress.target
        : THREE.MathUtils.lerp(progress.current, progress.target, 0.085);

      const { leg, local } = sampleChain(chain.legs, progress.current, camPos, camLook);
      if (narrow) {
        // Phones see a taller, narrower slice of the same shot — pull back and
        // lift so the island still reads inside the frame.
        pull.copy(camPos).sub(camLook).setY(0).normalize().multiplyScalar(5.5);
        camPos.add(pull);
        camPos.y += 2.6;
      }
      camera.position.copy(camPos);
      camera.lookAt(camLook);

      // The shadow camera only covers ±26 units, so the key light travels with
      // the flight. A world-anchored light would leave every island past the
      // first few unshadowed.
      key.position.copy(camLook).add(_up.set(16, 30, 14));
      key.target.position.copy(camLook);

      if (!reducedMotion) {
        world.traverse((object) => {
          if (object.userData.spin) object.rotation.y += object.userData.spin * 0.01;
          if (object.userData.float) {
            const { base, speed, amount } = object.userData.float;
            object.position.y = base + Math.sin(elapsed * speed) * amount;
          }
        });
        lights.forEach((light) => {
          const near = 1 - THREE.MathUtils.clamp(camPos.distanceTo(light.position) / 46, 0, 1);
          light.intensity = 8 + near * 30;
        });
        if (motes) motes.rotation.y = elapsed * 0.006;
      }

      // The copy is pinned per scene: it holds through a dive and hands over in
      // the middle of the connector, while the camera is highest and the world
      // is the subject rather than any one island.
      const sceneIndex = leg.kind === "dive" ? leg.scene : (local < 0.5 ? leg.scene : leg.scene + 1);
      const copy = leg.kind === "dive"
        ? 1
        : Math.abs(local - 0.5) > 0.22 ? THREE.MathUtils.clamp((Math.abs(local - 0.5) - 0.22) / 0.24, 0, 1) : 0;

      if (frameRef.current) {
        frameRef.current({ progress: progress.current, sceneIndex, copy, changed: sceneIndex !== lastScene });
      }
      lastScene = sceneIndex;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(draw);
    };

    // Scrolls the flight to the middle of a scene's dive — the equivalent of
    // Roadmap 2.0's "drive to current".
    apiRef.current = {
      flyTo(sceneIndex, smooth = true) {
        const leg = chain.legs.find((l) => l.kind === "dive" && l.scene === sceneIndex);
        if (!leg) return;
        const max = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
        scroller.scrollTo({
          top: (leg.start + (leg.end - leg.start) * 0.62) * max,
          behavior: smooth && !reducedMotion ? "smooth" : "auto",
        });
      },
    };

    readScroll();
    resize();
    scroller.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", resize, { passive: true });
    draw();

    return () => {
      cancelAnimationFrame(frameId);
      scroller.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", resize);
      apiRef.current = null;
      kit.owned.geometries.forEach((g) => g.dispose());
      kit.owned.materials.forEach((m) => m.dispose());
      // Sweeps anything the kit didn't own, disposes textures, and releases the
      // GL context — renderer.dispose() leaves the context live.
      disposeThreeScene(scene, renderer, mountRef.current);
    };
  }, [scenes, accent, reducedMotion, scrollRef, apiRef]);

  return <div className="r3-canvas" ref={mountRef} />;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const STATUS = {
  done: { label: "COMPLETED", color: "#00ff88" },
  progress: { label: "IN PROGRESS", color: "#a855f7" },
  default: { label: "READY", color: "#ffffff" },
};

export default function Roadmap3({
  path, activePath, setActivePath, pathsData,
  onNodeClick, getNodeState, completedCount,
}) {
  const scrollRef = useRef(null);
  const copyRef = useRef(null);
  const barRef = useRef(null);
  const apiRef = useRef(null);
  const [active, setActive] = useState(0);

  const reducedMotion = useMemo(
    () => typeof window !== "undefined"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const nodes = path?.nodes || [];
  const accent = path?.color || "#a855f7";

  // Roadmap nodes → scroll-world sections. Dwell is earned: a node with more
  // modules is a bigger stop, so the camera lingers in it longer.
  const scenes = useMemo(() => nodes.map((node, i) => {
    const moduleCount = node.modules?.length || 0;
    const isFinale = i === nodes.length - 1;
    return {
      node,
      state: getNodeState ? getNodeState(node.id) : "default",
      archetype: pickArchetype(node, i, nodes.length),
      tags: (node.modules || []).slice(0, 3).map((m) => m.title).filter(Boolean),
      moduleCount,
      pacing: {
        scroll: 1 + Math.min(0.55, moduleCount * 0.11) + (i === 0 || isFinale ? 0.3 : 0),
        linger: Math.min(MAX_LINGER, i === 0 || isFinale ? 0.42 : 0.24),
      },
    };
    // getNodeState is rebuilt on every progress change; keying on the path and
    // node count is what keeps the whole world from being torn down mid-flight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [activePath, nodes.length, completedCount]);

  const scrollLength = useMemo(() => {
    if (!scenes.length) return 1;
    const dives = scenes.reduce((sum, s) => sum + DIVE_SCROLL * s.pacing.scroll, 0);
    return dives + CONN_SCROLL * (scenes.length - 1);
  }, [scenes]);

  const tabs = Object.keys(pathsData || {})
    .filter((key) => !NON_PATH_KEYS.includes(key))
    .map((key) => ({ key, label: PATH_LABELS[key] || (pathsData[key]?.title || key).toUpperCase() }));

  const currentIndex = useMemo(() => {
    if (!getNodeState) return 0;
    let idx = nodes.findIndex((n) => getNodeState(n.id) === "progress");
    if (idx === -1) idx = nodes.findIndex((n) => getNodeState(n.id) !== "done");
    return idx === -1 ? Math.max(0, nodes.length - 1) : idx;
  }, [nodes, getNodeState]);

  // Per-frame updates go straight to the DOM; React state only moves when the
  // pinned scene actually changes, so scrubbing never re-renders the tree.
  const handleFrame = useCallback(({ progress, sceneIndex, copy, changed }) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    if (copyRef.current) {
      copyRef.current.style.opacity = copy;
      copyRef.current.style.transform = `translateY(${(1 - copy) * 18}px)`;
    }
    if (changed) setActive(sceneIndex);
  }, []);

  // Landing on a path parks the flight at whatever the learner is actually
  // working on, rather than always at scene one.
  useEffect(() => {
    if (!scenes.length) return undefined;
    const timer = setTimeout(() => apiRef.current?.flyTo(currentIndex, false), 120);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePath, scenes.length]);

  if (!path) {
    return (
      <div className="r3-root r3-fallback">
        <h2>Loading roadmap data…</h2>
        <p>If this stays here, reset defaults from the sidebar.</p>
      </div>
    );
  }

  const total = scenes.length;
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  const activeScene = scenes[Math.min(active, total - 1)];
  const status = activeScene ? (STATUS[activeScene.state] || STATUS.default) : STATUS.default;
  const pathLabel = PATH_LABELS[activePath] || (path.title || activePath || "").toUpperCase();

  if (!total) {
    return (
      <div className="r3-root r3-fallback" style={{ "--r3-accent": accent }}>
        <Flag size={28} />
        <h2>This path has no scenes yet.</h2>
        <p>Add nodes to the path and the world builds itself.</p>
      </div>
    );
  }

  return (
    <div className="r3-root" style={{ "--r3-accent": accent, "--r3-length": scrollLength }}>
      <div className="r3-progress" aria-hidden="true"><span ref={barRef} /></div>

      <header className="r3-hud">
        <div className="r3-tabs" role="tablist" aria-label="Learning paths">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activePath === t.key}
              className={`r3-tab ${activePath === t.key ? "active" : ""}`}
              onClick={() => setActivePath && setActivePath(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="r3-meters">
          <div className="r3-meter">
            <span className="r3-meter-value">{pct}<i>%</i></span>
            <span className="r3-meter-label">{completedCount} / {total} scenes</span>
          </div>
          <div className="r3-meter">
            <span className="r3-meter-value">{String(Math.min(active + 1, total)).padStart(2, "0")}</span>
            <span className="r3-meter-label">{path.estimatedHours || "—"} of flight</span>
          </div>
          <button className="r3-fly" onClick={() => apiRef.current?.flyTo(currentIndex)}>
            <Target size={14} /> FLY TO CURRENT
          </button>
        </div>
      </header>

      <div className="r3-scroll" ref={scrollRef}>
        <div className="r3-track">
          <div className="r3-stage">
            <WorldCanvas
              scrollRef={scrollRef}
              scenes={scenes}
              accent={accent}
              onFrame={handleFrame}
              reducedMotion={reducedMotion}
              apiRef={apiRef}
            />
            {/* Tilt-shift: the miniature look comes from throwing the top and
                bottom of the frame out of focus, exactly like a shifted lens. */}
            <div className="r3-tiltshift" aria-hidden="true" />
            <div className="r3-vignette" aria-hidden="true" />

            {activeScene && (
              <div className="r3-copy" ref={copyRef} style={{ "--r3-status": status.color }}>
                <span className="r3-eyebrow">
                  {String(active + 1).padStart(2, "0")} / {pathLabel}
                </span>
                <h2 className="r3-title">{activeScene.node.title}</h2>
                <p className="r3-body">{activeScene.node.subtitle || activeScene.node.description}</p>
                {activeScene.tags.length > 0 && (
                  <ul className="r3-tags">
                    {activeScene.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                )}
                <div className="r3-copy-foot">
                  <span className="r3-status"><i /> {status.label}</span>
                  <span className="r3-modules">
                    <Layers3 size={13} /> {activeScene.moduleCount} modules
                  </span>
                  <button className="r3-cta" onClick={() => onNodeClick && onNodeClick(activeScene.node)}>
                    {active === total - 1 ? "Finish the track" : "Land here"} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            <nav className="r3-rail" aria-label="Scenes">
              {scenes.map((s, i) => (
                <button
                  key={s.node.id}
                  className={`r3-rail-dot ${i === active ? "active" : ""} ${s.state === "done" ? "done" : ""}`}
                  onClick={() => apiRef.current?.flyTo(i)}
                  title={s.node.title}
                >
                  <span className="r3-rail-label">{s.node.title}</span>
                </button>
              ))}
            </nav>

            <div className="r3-hint" aria-hidden="true">
              <Compass size={13} /> scroll to fly
            </div>
          </div>
        </div>
      </div>

      {reducedMotion && (
        <div className="r3-reduced" role="note">
          Reduced motion is on — ambient drift is paused. Use the scene rail to jump between stops.
        </div>
      )}
    </div>
  );
}
