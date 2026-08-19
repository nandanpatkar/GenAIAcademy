// Renders each AlgoWars route in headless Chrome and captures what a visitor actually
// sees — visible text, headings, links and rendered HTML — into src/data/algowar/pages/.
// This catches client-rendered pages whose copy never appears in the route's own chunk.
//
//   node scripts/render_algowars_pages.mjs           # public routes
//   node scripts/render_algowars_pages.mjs --auth    # also the signed-in routes
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src/data/algowar/pages");
const MIRROR = path.join(ROOT, ".algowars-mirror/rendered");
const SESSION_FILE = path.join(ROOT, ".algowars-session/session.json");
const SUPABASE_KEY = "sb-mazfpxrquwtevaiirglg-auth-token";
const SITE = process.env.ALGOWARS_SITE ?? "https://arena.algowars.online";
// The apex domain serves the marketing site; the arena subdomain redirects "/" to
// /login (signed out) or /arena (signed in), so the landing page lives on apex.
const WITH_AUTH = process.argv.includes("--auth");

const PUBLIC_ROUTES = [
  "/", "/coding-duels", "/competitive-programming", "/dsa-practice", "/practice",
  "/placement", "/pricing", "/upgrade", "/refer", "/community", "/blog", "/partners",
  "/contact", "/privacy", "/terms", "/try", "/login", "/signup",
];
// NB: /queue and /solo are deliberately absent — loading them joins live matchmaking
// and creates a real match on the account. They are actions, not pages.
const AUTH_ROUTES = [
  "/arena", "/career", "/leaderboard", "/daily", "/dream", "/duo", "/friends",
  "/friend", "/profile",
];

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "-"));

async function chromePath() {
  for (const p of CHROME) { try { await fs.access(p); return p; } catch { /* next */ } }
  throw new Error("No Chrome found.");
}

async function main() {
  const executablePath = await chromePath();
  await fs.mkdir(MIRROR, { recursive: true });
  await fs.mkdir(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath, headless: "new", args: ["--no-sandbox"],
    defaultViewport: { width: 1440, height: 1000 },
  });
  const page = await browser.newPage();

  let routes = [...PUBLIC_ROUTES];
  if (WITH_AUTH) {
    const session = JSON.parse(await fs.readFile(SESSION_FILE, "utf8"));
    const left = Math.round((session.expires_at ?? 0) - Date.now() / 1000);
    if (left <= 0) throw new Error("Session expired — export a fresh one.");
    console.log(`Session valid ~${Math.round(left / 60)} min — including signed-in routes.\n`);
    // Seed the session before any app code runs, so the client boots authenticated.
    await page.evaluateOnNewDocument((k, v) => {
      try { localStorage.setItem(k, v); } catch { /* storage unavailable */ }
    }, SUPABASE_KEY, JSON.stringify(session));
    routes = routes.concat(AUTH_ROUTES);
  }

  const index = [];
  for (const route of routes) {
    const name = slug(route);
    try {
      await page.goto(`${SITE}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForNetworkIdle({ idleTime: 800, timeout: 15000 }).catch(() => {});
    } catch {
      console.log(`  ! ${route}: navigation timeout`);
      continue;
    }
    await sleep(1500); // let client-side data settle

    const captured = await page.evaluate(() => {
      const clean = (s) => s.replace(/\s+/g, " ").trim();
      const visible = (el) => {
        const st = getComputedStyle(el);
        return st.display !== "none" && st.visibility !== "hidden" && el.offsetParent !== null;
      };
      return {
        finalUrl: location.pathname,
        title: document.title,
        headings: [...document.querySelectorAll("h1,h2,h3")]
          .filter(visible).map((h) => ({ tag: h.tagName.toLowerCase(), text: clean(h.innerText) }))
          .filter((h) => h.text),
        text: clean(document.body.innerText).slice(0, 20000),
        links: [...new Set([...document.querySelectorAll("a[href]")]
          .map((a) => a.getAttribute("href")).filter((h) => h && !h.startsWith("#")))],
        buttons: [...new Set([...document.querySelectorAll("button")]
          .filter(visible).map((b) => clean(b.innerText)).filter(Boolean))],
      };
    });

    const redirected = captured.finalUrl !== route && !(route === "/" && captured.finalUrl === "/");
    await fs.writeFile(path.join(MIRROR, `${name}.html`), await page.content());

    const existing = await fs.readFile(path.join(OUT, `${name}.json`), "utf8").then(JSON.parse).catch(() => ({}));
    const record = { ...existing, route, rendered: { ...captured, redirected } };
    await fs.writeFile(path.join(OUT, `${name}.json`), `${JSON.stringify(record, null, 2)}\n`);

    index.push({ route, name, title: captured.title, headings: captured.headings.length, chars: captured.text.length });
    console.log(`  ✓ ${route.padEnd(26)} ${String(captured.text.length).padStart(6)} chars, ${captured.headings.length} headings${redirected ? `  → redirected to ${captured.finalUrl}` : ""}`);
    await sleep(400);
  }

  await fs.writeFile(
    path.join(OUT, "rendered-index.json"),
    `${JSON.stringify({ _source: SITE, renderedAt: new Date().toISOString(), pages: index }, null, 2)}\n`,
  );
  console.log(`\n✓ ${index.length} routes rendered`);
  await browser.close();
}

main().catch((err) => { console.error(`\n✗ ${err.message}`); process.exit(1); });
