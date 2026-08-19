// Extracts the AlgoWars career campaign into src/data/algowar/career/ using the
// signed-in browser session. The API (api.algowars.online) authenticates with the
// Supabase access token the web app stores in localStorage, so this drives a real
// Chrome profile: you log in once, the profile persists, and every later run reuses it.
//
//   node scripts/scrape_algowars_career.mjs            # resume, skip what's on disk
//   node scripts/scrape_algowars_career.mjs --refresh  # refetch everything
//
// Only fetches what the logged-in account is entitled to — locked chapters come back
// from the API as locked and are recorded that way.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src/data/algowar/career");
const PROFILE = path.join(ROOT, ".algowars-session");
const SITE = "https://arena.algowars.online";
const SESSION_FILE = path.join(PROFILE, "session.json");
// Supabase project backing AlgoWars auth, from the app's own OAuth redirect.
const SUPABASE_KEY = "sb-mazfpxrquwtevaiirglg-auth-token";
const REFRESH = process.argv.includes("--refresh");

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function chromePath() {
  for (const p of CHROME) {
    try { await fs.access(p); return p; } catch { /* next */ }
  }
  throw new Error(`No Chrome found. Looked in:\n  ${CHROME.join("\n  ")}`);
}

async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

// Accepts either {k, v} or the raw localStorage value pasted straight out of the
// DevTools Application tab — the raw blob is what you get by copying the value, so
// there is no need to hand-assemble JSON or escape anything.
async function readSession() {
  let raw;
  try { raw = (await fs.readFile(SESSION_FILE, "utf8")).trim(); } catch { return null; }
  if (!raw) return null;

  let parsed;
  try { parsed = JSON.parse(raw); } catch { return null; }

  if (parsed?.k && parsed?.v) return parsed;
  if (parsed?.access_token || parsed?.currentSession?.access_token) {
    return { k: SUPABASE_KEY, v: raw };
  }
  console.log("session.json did not look like a Supabase session — ignoring it.");
  return null;
}

async function readJson(file) {
  try { return JSON.parse(await fs.readFile(file, "utf8")); } catch { return null; }
}

// Runs inside the page so requests carry the app's own origin and Supabase token.
// The page navigates freely while you sign in, which tears down the evaluate context —
// that is expected, so the caller retries rather than failing the run.
async function api(page, endpoint, tries = 4) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await evalApi(page, endpoint);
    } catch (err) {
      const transient = /Execution context was destroyed|Target closed|detached|Session closed|Cannot find context/i.test(err.message);
      if (!transient || attempt >= tries) throw err;
      await sleep(1000);
    }
  }
}

async function evalApi(page, endpoint) {
  return page.evaluate(async (ep) => {
    const key = Object.keys(localStorage).find((k) => /^sb-.*-auth-token$/.test(k));
    if (!key) return { __error: "no-session" };
    let token = null;
    try {
      const raw = JSON.parse(localStorage.getItem(key));
      token = raw?.access_token ?? raw?.currentSession?.access_token ?? null;
    } catch { /* fall through */ }
    if (!token) return { __error: "no-token" };

    const res = await fetch(`https://api.algowars.online${ep}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    const text = await res.text();
    if (!res.ok) return { __error: `HTTP ${res.status}`, status: res.status, body: text.slice(0, 400) };
    try { return JSON.parse(text); } catch { return { __error: "not-json", body: text.slice(0, 400) }; }
  }, endpoint);
}

async function waitForLogin(page) {
  console.log("No usable session yet. Either sign in with EMAIL in the Chrome window,");
  console.log(`or export a session from your normal Chrome into ${path.relative(ROOT, SESSION_FILE)}.\n`);
  process.stdout.write("Waiting for your session");
  for (let i = 0; i < 600; i += 1) { // up to 20 minutes
    let probe;
    try {
      probe = await api(page, "/career/bootstrap");
    } catch {
      // Mid-navigation (sign-in redirect, OAuth hop) — just try again.
      await sleep(2000);
      continue;
    }
    if (!probe.__error) { console.log("\n✓ Signed in — session found.\n"); return probe; }
    if (probe.__error !== "no-session" && probe.__error !== "no-token" && probe.status !== 401) {
      console.log(`\n… ${probe.__error} — still waiting for a valid session.`);
    }
    if (i % 10 === 0) process.stdout.write(".");
    await sleep(2000);
  }
  throw new Error("Timed out waiting for sign-in.");
}

async function main() {
  const executablePath = await chromePath();
  await fs.mkdir(PROFILE, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath,
    headless: false,
    defaultViewport: null,
    userDataDir: PROFILE,
    args: ["--no-first-run", "--no-default-browser-check", "--window-size=1280,900"],
  });

  const page = (await browser.pages())[0] ?? (await browser.newPage());
  await page.goto(`${SITE}/login`, { waitUntil: "domcontentloaded" });

  // Preferred path: reuse a session exported from your own (non-automated) Chrome, so
  // the Google OAuth flow never has to run here — Google blocks that in automation, by
  // design, and this sidesteps it rather than defeating it. Only the AlgoWars session is
  // involved; nothing else from your browser is read.
  const exported = await readSession();
  if (exported) {
    await page.evaluate((s) => { localStorage.setItem(s.k, s.v); }, exported);
    await page.goto(`${SITE}/career`, { waitUntil: "domcontentloaded" });
    console.log("Injected the exported session — the app will refresh it as needed.\n");
  }

  const bootstrap = await waitForLogin(page);
  await writeJson(path.join(OUT, "bootstrap.json"), bootstrap);

  const campaign = await api(page, "/career/campaign");
  if (campaign.__error) throw new Error(`campaign: ${campaign.__error} ${campaign.body ?? ""}`);
  await writeJson(path.join(OUT, "campaign.json"), campaign);

  const worlds = campaign.worlds ?? campaign.data?.worlds ?? [];
  console.log(`Campaign: ${worlds.length} worlds`);

  const index = [];
  for (const world of worlds) {
    const slug = world.slug ?? world.worldSlug;
    const file = path.join(OUT, "worlds", `${slug}.json`);
    let detail = REFRESH ? null : await readJson(file);

    if (!detail) {
      detail = await api(page, `/career/worlds/${encodeURIComponent(slug)}`);
      if (detail.__error) {
        console.log(`  ! ${slug}: ${detail.__error} — recording as unavailable`);
        detail = { slug, unavailable: detail.__error, world };
      }
      await writeJson(file, detail);
      await sleep(400);
    }

    const nodes = detail.nodes ?? detail.world?.nodes ?? [];
    const levels = nodes.map((n) => n.level).filter(Boolean);
    console.log(`  ${slug}: ${nodes.length} nodes, ${levels.length} levels`);
    index.push({ slug, worldNumber: world.worldNumber, title: world.title, levelCount: levels.length });

    for (const level of levels) {
      const lf = path.join(OUT, "levels", `${level.levelNumber}.json`);
      if (!REFRESH && await readJson(lf)) continue;
      const got = await api(page, `/career/levels/${level.levelNumber}`);
      if (got.__error) {
        console.log(`    ! level ${level.levelNumber}: ${got.__error}`);
        await writeJson(lf, { levelNumber: level.levelNumber, unavailable: got.__error });
      } else {
        await writeJson(lf, got);
        process.stdout.write(`    · level ${level.levelNumber}\r`);
      }
      await sleep(350);
    }
  }

  await writeJson(path.join(OUT, "index.json"), {
    _source: `${SITE}/career via api.algowars.online`,
    fetchedAt: new Date().toISOString(),
    worlds: index,
  });

  console.log(`\n✓ Written to ${path.relative(ROOT, OUT)}`);
  await browser.close();
}

main().catch((err) => { console.error(`\n✗ ${err.message}`); process.exit(1); });
