// Builds the AI-ML Companion catalog that powers the AimlCompanion sidebar from the
// local site mirror in aimlcompanion.ai/ (HTTrack copy). The mirror's pages are SPA
// shells — the teaching content lives in chunks HTTrack never fetched — but every
// route ships prerendered JSON-LD, and that carries the real structure: each track's
// ordered module list with human titles, and each module's one-line tagline.
//
//   node scripts/extract_aimlcompanion_catalog.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIRROR = path.join(ROOT, "aimlcompanion.ai");
const OUT = path.join(ROOT, "src/data/aimlcompanion/catalog.json");
const IMAGES = path.join(ROOT, "src/assets/aimlcompanion");
const BASE = "https://aimlcompanion.ai";

// Track accents carried over from the hand-written list the sidebar used before, so the
// generated catalog keeps the palette people already associate with each track. Tracks
// the old list never had (the four below the divider) get accents picked to stay distinct.
const COLORS = {
  foundations: "#a78bfa", jupyterNotebook: "#f97316", pythonML: "#3b82f6", sql: "#06b6d4",
  linearAlgebra: "#10b981", probability: "#f59e0b", calculus: "#ec4899", optimization: "#8b5cf6",
  statistics: "#14b8a6", infoTheory: "#64748b", mlAlgorithms: "#ef4444", mlPipeline: "#f97316",
  deepLearning: "#6366f1", llm: "#00ff88", gitVersionControl: "#f87171", mlOps: "#fb923c",
  softwareEngAI: "#22d3ee", aiAgents: "#00ff88", interviewScenarios: "#fbbf24", aiTools: "#c084fc",
  dataEngineering: "#38bdf8", cloudGenAI: "#818cf8", forwardDeployment: "#f472b6", aiProduct: "#4ade80",
};

// The mirror's files are alphabetical; the site teaches in this order, so the catalog
// keeps the learning order and the sidebar reads top-to-bottom the way the course does.
const ORDER = [
  "foundations", "jupyterNotebook", "pythonML", "sql", "dataEngineering", "linearAlgebra",
  "probability", "calculus", "optimization", "statistics", "infoTheory", "mlAlgorithms",
  "mlPipeline", "deepLearning", "llm", "gitVersionControl", "mlOps", "cloudGenAI",
  "softwareEngAI", "forwardDeployment", "aiAgents", "aiProduct", "interviewScenarios", "aiTools",
];

// Paper-story routes are linked from the LLM track but live outside /curriculum, so the
// mirror has no page for them. Kept here so regenerating the catalog does not drop them.
const EXTRAS = {
  llm: [
    { id: "paper-attention", label: "Paper: Attention", url: `${BASE}/paper-story/llm/paper-attention` },
    { id: "paper-deepseek", label: "Paper: DeepSeek", url: `${BASE}/paper-story/llm/paper-deepseek` },
    { id: "paper-gpt3", label: "Paper: GPT-3", url: `${BASE}/paper-story/llm/paper-gpt3` },
  ],
};

const SITE_PAGES = [
  { id: "home", label: "Home", url: `${BASE}/` },
  { id: "curriculum", label: "Study Paths", url: `${BASE}/curriculum` },
  { id: "roadmap", label: "Roadmap", url: `${BASE}/roadmap` },
  { id: "blog", label: "Blog", url: `${BASE}/blog` },
  { id: "about", label: "About", url: `${BASE}/about` },
  { id: "community", label: "Community", url: `${BASE}/community` },
  { id: "help", label: "Help", url: `${BASE}/help` },
  { id: "upgrade", label: "Upgrade", url: `${BASE}/upgrade` },
  { id: "founding-members", label: "Founding Members", url: `${BASE}/founding-members` },
];

const decode = (s) => s
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&nbsp;/g, " ").replace(/&hellip;/g, "…").replace(/&mdash;/g, "—")
  .replace(/\s+/g, " ").trim();

async function jsonLd(file) {
  const html = await fs.readFile(file, "utf8");
  const blocks = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const parsed = JSON.parse(m[1]);
      blocks.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch { /* a malformed block should not sink the whole page */ }
  }
  const meta = {};
  for (const m of html.matchAll(/<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]*)"/g)) {
    meta[m[1]] = decode(m[2]);
  }
  return { blocks, meta };
}

// Descriptions are SEO sentences wrapped around the copy we actually want:
//   track:  "Foundations on AI-ML Companion: <summary> 6 interactive modules with ..."
//   module: "Learn <title> with interactive visualizations on AI-ML Companion. <tagline> Part of the ..."
// Two thirds of them are also cut at ~160 chars mid-word, so the tail needs tidying:
// drop the half-written word, drop any half-written "Part of the <track> track", and
// mark what is left with an ellipsis so a clipped tagline never reads as a full sentence.
function tidy(text) {
  const truncated = /(\.\.\.|…)\s*$/.test(text);
  let out = decode(text).replace(/(\.\.\.|…)\s*$/, "").trim();
  if (truncated) out = out.replace(/\s+\S+$/, "");
  out = out.replace(/\s+Part(\s+of(\s+the?)?)?$/, "").replace(/\s*[-–,:;]$/, "").trim();
  out = out.replace(/\?\.$/, "?").replace(/\.\.$/, ".");
  // A cut that landed just after a full stop already reads as finished — leave it alone.
  return truncated && out && !/[.!?]$/.test(out) ? `${out}…` : out;
}
function trackSummary(description = "") {
  const body = description.replace(/^.*? on AI-ML Companion:\s*/, "");
  return tidy(body.replace(/\s*\d+ interactive modules?[\s\S]*$/, ""));
}
function moduleTagline(description = "") {
  const body = description.replace(/^Learn [\s\S]*? on AI-ML Companion\.\s*/, "");
  return tidy(body.replace(/\s*Part of the [\s\S]*$/, ""));
}

const has = async (p) => !!(await fs.stat(p).catch(() => null));

async function buildTracks() {
  const files = (await fs.readdir(path.join(MIRROR, "curriculum"))).filter(f => f.endsWith(".html"));
  const tracks = [];

  for (const file of files.sort()) {
    const id = path.basename(file, ".html");
    const { blocks, meta } = await jsonLd(path.join(MIRROR, "curriculum", file));
    const course = blocks.find(b => b["@type"] === "Course" && Array.isArray(b.hasPart));
    if (!course) { console.warn(`  ! no course JSON-LD in curriculum/${file}`); continue; }

    const modules = [];
    for (const part of course.hasPart) {
      const slug = part.url.split("/").pop();
      const page = path.join(MIRROR, "module", id, `${slug}.html`);
      let tagline = "";
      if (await has(page)) {
        const mod = await jsonLd(page);
        tagline = moduleTagline(mod.meta.description || "");
      }
      modules.push({ id: slug, label: decode(part.name), tagline, url: `${BASE}/module/${id}/${slug}` });
    }

    // The mirror occasionally has module pages the track's hasPart list omits; keep them
    // rather than silently shipping a shorter track than the site actually has.
    const listed = new Set(modules.map(m => m.id));
    const onDisk = (await fs.readdir(path.join(MIRROR, "module", id)).catch(() => []))
      .filter(f => f.endsWith(".html")).map(f => path.basename(f, ".html"));
    for (const slug of onDisk.sort()) {
      if (listed.has(slug)) continue;
      const { blocks: mb, meta: mm } = await jsonLd(path.join(MIRROR, "module", id, `${slug}.html`));
      const res = mb.find(b => b["@type"] === "LearningResource");
      modules.push({
        id: slug,
        label: decode(res?.name || slug),
        tagline: moduleTagline(mm.description || ""),
        url: `${BASE}/module/${id}/${slug}`,
      });
      console.warn(`  + ${id}/${slug} was on disk but missing from the track listing`);
    }

    const image = await webp(`track-${id}`);
    tracks.push({
      id,
      label: decode(meta["og:title"] || course.name).replace(/\s*[-|]\s*AI-ML Companion.*$/, ""),
      color: COLORS[id] || "#94a3b8",
      url: `${BASE}/curriculum/${id}`,
      summary: trackSummary(course.description || meta.description || ""),
      image,
      modules,
      ...(EXTRAS[id] ? { extras: EXTRAS[id] } : {}),
    });
  }
  // Unknown tracks (a new one added to the site since ORDER was written) sort to the end
  // rather than disappearing.
  const rank = (id) => { const i = ORDER.indexOf(id); return i === -1 ? ORDER.length : i; };
  return tracks.sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id));
}

// The site publishes an og: image per track and per post — the picture it asks link
// previews to use. Those are the cards' thumbnails here, re-encoded as webp (7.2MB of
// PNG becomes ~400KB) so the bundle does not carry full-size social images.
async function webp(name) {
  const src = path.join(MIRROR, "og-images", `${name}.png`);
  if (!(await has(src))) return null;
  const out = path.join(IMAGES, `${name}.webp`);
  await fs.mkdir(IMAGES, { recursive: true });
  try {
    await run("cwebp", ["-quiet", "-q", "78", "-resize", "640", "0", src, "-o", out]);
  } catch (err) {
    // cwebp missing (brew install webp) — keep whatever was converted on an earlier run
    // rather than failing the whole catalog build over a thumbnail.
    if (!(await has(out))) { console.warn(`  ! no webp for ${name}: ${err.message}`); return null; }
  }
  return `${name}.webp`;
}

async function buildPosts() {
  const dir = path.join(MIRROR, "blog");
  const files = (await fs.readdir(dir)).filter(f => f.endsWith(".html"));
  const posts = [];
  for (const file of files) {
    const slug = path.basename(file, ".html");
    const { blocks, meta } = await jsonLd(path.join(dir, file));
    const post = blocks.find(b => b["@type"] === "BlogPosting");
    if (!post) continue;
    posts.push({
      slug,
      image: await webp(`blog-${slug}`),
      label: decode(post.headline),
      date: post.datePublished || null,
      summary: tidy(post.description || meta.description || ""),
      tags: (post.keywords || "").split(",").map(s => s.trim()).filter(Boolean).slice(0, 4),
      url: `${BASE}/blog/${slug}`,
    });
  }
  return posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

const [tracks, posts] = await Promise.all([buildTracks(), buildPosts()]);
const moduleCount = tracks.reduce((n, t) => n + t.modules.length + (t.extras?.length || 0), 0);

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, JSON.stringify({
  source: "aimlcompanion.ai site mirror",
  base: BASE,
  generatedAt: new Date().toISOString().slice(0, 10),
  totals: { tracks: tracks.length, modules: moduleCount, posts: posts.length },
  pages: SITE_PAGES,
  tracks,
  posts,
}, null, 2) + "\n");

console.log(`catalog → ${path.relative(ROOT, OUT)}`);
console.log(`  ${tracks.length} tracks · ${moduleCount} modules · ${posts.length} posts`);
console.log(`images  → ${path.relative(ROOT, IMAGES)}`);
