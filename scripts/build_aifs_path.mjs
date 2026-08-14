/**
 * build_aifs_path.mjs — derive the AI from Scratch study path from the
 * curriculum index, at build time.
 *
 * The path shape (nodes -> modules -> subtopics) is what `data/roadmap.js`
 * hands to the roadmap views and the sidebar's study-path list. Deriving it at
 * runtime would mean pulling all 420 KB of `aiFromScratchData.js` into the
 * roadmap chunk just to read titles off it, so the derived result is baked out
 * here and committed as JSON — the same trade `build_manual_path.mjs` makes.
 *
 *   node     a phase                        (21: 20 curriculum + certification)
 *   module   a lesson                       deep-links into the viewer
 *   subtopic a section heading of a lesson  deep-links to that heading
 *
 * Section headings are read from the generated lesson bodies under
 * public/ai-from-scratch/md/, so this runs after `npm run build:aifs`. Those
 * bodies are gitignored (they are served from R2), which is why the output is
 * committed rather than regenerated during `npm run build`.
 *
 * Run via `npm run build:aifs-path`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const OUT = path.join(root, "src", "data", "aifs_path.generated.json");
const INDEX = path.join(root, "src", "data", "aiFromScratchData.js");
const BODIES = path.join(root, "public", "ai-from-scratch", "md");

const COLOR = "#38bdf8";
const MAX_SUBTOPICS = 6;
/* This file lands in the roadmap chunk, so every repeated key is paid 3,000
   times over. Subtopics therefore carry one packed "slug#heading" field rather
   than two, blurbs are clipped, and nothing is stored twice. */
const MAX_SUBTITLE = 140;

/* Phase emoji, keyed by phase number so the list cannot drift out of step with
   the curriculum the way a positional array would. */
const PHASE_ICONS = {
  0: "🛠️",  1: "🔢",  2: "📊",  3: "🧠",  4: "👁️",
  5: "💬",  6: "🎙️",  7: "🔤",  8: "🎨",  9: "🎮",
  10: "🏗️", 11: "⚙️", 12: "🎬", 13: "🔌", 14: "🤖",
  15: "🚦", 16: "🐝", 17: "☁️", 18: "⚖️", 19: "🚀",
};

/* Bundle the index so Node can evaluate it without resolving Vite's aliases. */
const bundled = await build({
  entryPoints: [INDEX],
  bundle: true,
  format: "esm",
  write: false,
  logLevel: "error",
});
const tmp = path.join(root, "node_modules", ".aifs_path_build.mjs");
fs.writeFileSync(tmp, bundled.outputFiles[0].text);
const { AIFS_PHASES, AIFS_TOTAL_LESSONS } = await import(`file://${tmp}?t=${Date.now()}`);
fs.unlinkSync(tmp);

if (!AIFS_PHASES?.length) {
  throw new Error("build_aifs_path: the curriculum index is empty — run `npm run build:aifs` first");
}

const clip = (value) => {
  const text = String(value || "").trim();
  if (text.length <= MAX_SUBTITLE) return text;
  const cut = text.slice(0, MAX_SUBTITLE);
  return `${cut.slice(0, cut.lastIndexOf(" ")) || cut}…`;
};

const slugify = (value) =>
  String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Level-2 headings of a lesson body, skipping anything inside a code fence. */
function sectionsFor(slug) {
  const file = path.join(BODIES, `${slug}.md`);
  if (!fs.existsSync(file)) return [];
  const out = [];
  let fenced = false;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const match = /^##\s+(.*)$/.exec(line);
    if (!match) continue;
    const label = match[1].replace(/[*_`]/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").trim();
    if (label) out.push(label);
  }
  return out;
}

let missingBodies = 0;

const nodes = AIFS_PHASES
  // The reference track is the roadmap and glossary themselves — a lookup
  // surface, not a sequence anyone studies through.
  .filter((phase) => phase.track !== "guides")
  .map((phase) => ({
    id: `aifs-node-${phase.id}`,
    title: phase.title,
    subtitle: clip(phase.blurb),
    tag: phase.track === "certification" ? "CERTIFICATION" : `PHASE ${String(phase.n).padStart(2, "0")}`,
    tagColor: COLOR,
    icon: phase.track === "certification" ? "🎓" : (PHASE_ICONS[phase.n] || "◈"),
    modules: phase.lessons.map((lesson) => {
      const sections = sectionsFor(lesson.slug);
      if (!sections.length) missingBodies += 1;
      return {
        id: `aifs-module-${lesson.slug.replace(/\//g, "-")}`,
        title: lesson.title,
        subtitle: clip(lesson.blurb),
        status: "default",
        duration: lesson.minutes
          ? (lesson.minutes >= 60
            ? `${Math.round((lesson.minutes / 60) * 10) / 10}h`
            : `${lesson.minutes}m`)
          : "",
        // Every level carries the slug, so wherever the roadmap views expose a
        // click, it can reach the lesson.
        aifsSlug: lesson.slug,
        subtopics: sections.slice(0, MAX_SUBTOPICS).map((title) => ({
          title,
          aifs: `${lesson.slug}#${slugify(title)}`,
        })),
      };
    }),
  }));

const lessonCount = nodes.reduce((sum, node) => sum + node.modules.length, 0);
const minutes = AIFS_PHASES
  .filter((phase) => phase.track !== "guides")
  .reduce((sum, phase) => sum + phase.lessons.reduce((inner, lesson) => inner + (lesson.minutes || 0), 0), 0);

const AIFS_PATH = {
  id: "aifs",
  label: "AI from Scratch",
  title: "AI from Scratch",
  subtitle: "Twenty phases from setup to capstone",
  description:
    "Build the whole stack from first principles — math, ML, deep learning, transformers, "
    + "LLMs, agents, and production infrastructure. Every lesson ships runnable code, a "
    + "reusable artifact, and a quiz.",
  color: COLOR,
  dimColor: "#0284c7",
  bgColor: "rgba(56,189,248,0.08)",
  borderColor: "rgba(56,189,248,0.3)",
  audience: "All levels",
  estimatedHours: `${Math.round(minutes / 60)}+ hours`,
  nodes,
};

fs.writeFileSync(OUT, JSON.stringify(AIFS_PATH));
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(
  `Wrote ${path.relative(root, OUT)} (${kb} KB, ${nodes.length} phases, ${lessonCount} lessons of ${AIFS_TOTAL_LESSONS})`
);
if (missingBodies) {
  console.warn(`  ${missingBodies} lessons had no body under public/ai-from-scratch/md — run \`npm run build:aifs\` for section subtopics.`);
}
