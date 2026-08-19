// Mirrors the AlgoWars marketing/app pages and their route bundles into
// .algowars-mirror/ (gitignored), then extracts the visible UI copy from each
// route's JS chunk into src/data/algowar/pages/<route>.json.
//
// These pages are public — no session involved.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIRROR = path.join(ROOT, ".algowars-mirror");
const OUT = path.join(ROOT, "src/data/algowar/pages");
const SITE = "https://arena.algowars.online";
const DELAY = 300;

// Public routes only. /admin/* is deliberately excluded.
const ROUTES = [
  "/", "/arena", "/leaderboard", "/daily", "/dream", "/duo", "/friends", "/friend",
  "/solo", "/queue", "/practice", "/profile", "/placement", "/pricing", "/upgrade",
  "/refer", "/community", "/blog", "/coding-duels", "/competitive-programming",
  "/dsa-practice", "/try", "/partners", "/contact", "/privacy", "/terms",
  "/login", "/signup", "/choose-username", "/career", "/career/unlock",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "-"));

async function get(url) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) return { error: `HTTP ${res.status}` };
      return { body: await res.text() };
    } catch (err) {
      if (attempt === 3) return { error: err.message };
      await sleep(1000 * attempt);
    }
  }
  return { error: "unreachable" };
}

// Pulls human-readable strings out of a compiled route chunk: JSX text children,
// placeholders, labels, titles and descriptions.
function extractCopy(js) {
  const out = [];
  const seen = new Set();
  const re = /children:"([^"\\]{2,160})"|placeholder:"([^"\\]{2,80})"|label:"([^"\\]{2,80})"|title:"([^"\\]{2,120})"|description:"([^"\\]{2,240})"|alt:"([^"\\]{2,80})"/g;
  let m;
  while ((m = re.exec(js))) {
    const v = m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5] ?? m[6];
    // Skip class strings and code fragments that survive minification.
    if (/^[a-z-]+:|^\d+$|[{}<>]|^\.|_$/.test(v)) continue;
    if (/(px-|py-|text-\[|rounded|bg-|flex|grid|gap-|md:|hover:|absolute|translate|tracking-|w-full|h-full)/.test(v)) continue;
    if (!/[A-Za-z]{2}/.test(v)) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function meta(html, name) {
  const m = html.match(new RegExp(`<meta name="${name}" content="([^"]*)"`)) ??
            html.match(new RegExp(`<meta property="${name}" content="([^"]*)"`));
  return m?.[1] ?? null;
}

async function main() {
  await fs.mkdir(MIRROR, { recursive: true });
  const index = [];

  for (const route of ROUTES) {
    const name = slug(route);
    const page = await get(`${SITE}${route}`);
    if (page.error) { console.log(`  ! ${route}: ${page.error}`); await sleep(DELAY); continue; }

    await fs.writeFile(path.join(MIRROR, `${name}.html`), page.body);

    const chunks = [...new Set([...page.body.matchAll(/_next\/static\/chunks\/([^"]+\.js)/g)].map((m) => m[1]))];
    // The route's own chunk lives under app/…; shared vendor chunks are not page copy.
    const routeChunks = chunks.filter((c) => c.startsWith("app/") && !/layout|error|not-found/.test(c));

    let copy = [];
    for (const chunk of routeChunks) {
      const js = await get(`${SITE}/_next/static/chunks/${chunk}`);
      if (js.error) continue;
      await fs.mkdir(path.join(MIRROR, "chunks"), { recursive: true });
      await fs.writeFile(path.join(MIRROR, "chunks", path.basename(chunk)), js.body);
      copy = copy.concat(extractCopy(js.body));
      await sleep(DELAY);
    }

    const record = {
      route,
      title: (page.body.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? null,
      description: meta(page.body, "description"),
      keywords: meta(page.body, "keywords"),
      ogTitle: meta(page.body, "og:title"),
      chunks: routeChunks,
      copy: [...new Set(copy)],
    };
    await fs.mkdir(OUT, { recursive: true });
    await fs.writeFile(path.join(OUT, `${name}.json`), `${JSON.stringify(record, null, 2)}\n`);
    index.push({ route, name, title: record.title, copyLines: record.copy.length });
    console.log(`  ✓ ${route} — ${record.copy.length} copy lines`);
    await sleep(DELAY);
  }

  await fs.writeFile(
    path.join(OUT, "index.json"),
    `${JSON.stringify({ _source: SITE, fetchedAt: new Date().toISOString(), pages: index }, null, 2)}\n`,
  );
  console.log(`\n✓ ${index.length} pages → ${path.relative(ROOT, OUT)}`);
}

main().catch((err) => { console.error(`\n✗ ${err.message}`); process.exit(1); });
