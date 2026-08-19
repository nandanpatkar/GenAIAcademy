// Pulls the AlgoWars career campaign into src/data/algowar/career/ over plain HTTPS,
// using the Supabase access token exported from your own browser session into
// .algowars-session/session.json (gitignored).
//
//   node scripts/fetch_algowars_career.mjs            # resume, skip what's on disk
//   node scripts/fetch_algowars_career.mjs --refresh  # refetch everything
//
// Access tokens last an hour. The run resumes cleanly, so if it stops on a 401 just
// export a fresh session and start it again — it picks up where it left off.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src/data/algowar/career");
const SESSION_FILE = path.join(ROOT, ".algowars-session/session.json");
const API = "https://api.algowars.online";
const REFRESH = process.argv.includes("--refresh");
const DELAY = 250;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

async function readJson(file) {
  try { return JSON.parse(await fs.readFile(file, "utf8")); } catch { return null; }
}

let token;
async function loadToken() {
  const session = await readJson(SESSION_FILE);
  if (!session?.access_token) throw new Error(`No access_token in ${path.relative(ROOT, SESSION_FILE)}`);
  const left = Math.round((session.expires_at ?? 0) - Date.now() / 1000);
  if (left <= 0) throw new Error("The exported session has expired — export a fresh one.");
  console.log(`Session valid for ~${Math.round(left / 60)} more minutes.\n`);
  token = session.access_token;
}

async function api(endpoint) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    let res;
    try {
      res = await fetch(`${API}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Origin: "https://arena.algowars.online",
        },
      });
    } catch (err) {
      if (attempt === 3) return { __error: err.message };
      await sleep(1000 * attempt);
      continue;
    }
    if (res.status === 401) throw new Error("401 — the session expired mid-run. Export a fresh one and rerun to resume.");
    if (res.status === 429 || res.status >= 500) {
      if (attempt === 3) return { __error: `HTTP ${res.status}` };
      await sleep(2000 * attempt);
      continue;
    }
    const text = await res.text();
    if (!res.ok) return { __error: `HTTP ${res.status}`, status: res.status, body: text.slice(0, 300) };
    try { return JSON.parse(text); } catch { return { __error: "not-json", body: text.slice(0, 300) }; }
  }
  return { __error: "unreachable" };
}

async function main() {
  await loadToken();

  const bootstrap = await api("/career/bootstrap");
  if (bootstrap.__error) throw new Error(`bootstrap: ${bootstrap.__error}`);
  await writeJson(path.join(OUT, "bootstrap.json"), bootstrap);

  const campaign = await api("/career/campaign");
  if (campaign.__error) throw new Error(`campaign: ${campaign.__error}`);
  await writeJson(path.join(OUT, "campaign.json"), campaign);

  const worlds = campaign.worlds ?? [];
  const totalLevels = worlds.reduce((n, w) => n + (w.levelCount ?? 0), 0);
  console.log(`Campaign: ${worlds.length} worlds, ${totalLevels} levels\n`);

  const index = [];
  let fetched = 0;
  let skipped = 0;

  for (const world of worlds) {
    const slug = world.slug;
    const wf = path.join(OUT, "worlds", `${slug}.json`);
    let detail = REFRESH ? null : await readJson(wf);

    if (!detail) {
      // The endpoint keys off worldNumber; the slug is rejected as "Invalid world".
      detail = await api(`/career/worlds/${world.worldNumber}`);
      if (detail.__error) {
        console.log(`  ! ${slug}: ${detail.__error}`);
        detail = { slug, unavailable: detail.__error, world };
      }
      await writeJson(wf, detail);
      await sleep(DELAY);
    }

    const nodes = detail.nodes ?? [];
    const levels = nodes.map((n) => n.level).filter(Boolean);
    console.log(`#${String(world.worldNumber).padStart(2, "0")} ${world.title} — ${nodes.length} nodes, ${levels.length} levels`);
    index.push({
      worldNumber: world.worldNumber, slug, title: world.title, theme: world.theme,
      description: world.description, levelCount: world.levelCount, xpAvailable: world.xpAvailable,
      difficultySummary: world.difficultySummary, contentSummary: world.contentSummary,
      completionReward: world.completionReward, fetchedLevels: levels.length,
    });

    for (const level of levels) {
      const lf = path.join(OUT, "levels", `${level.levelNumber}.json`);
      if (!REFRESH && await readJson(lf)) { skipped += 1; continue; }
      const got = await api(`/career/levels/${level.levelNumber}`);
      if (got.__error) {
        console.log(`   ! level ${level.levelNumber}: ${got.__error}`);
        await writeJson(lf, { levelNumber: level.levelNumber, unavailable: got.__error });
      } else {
        await writeJson(lf, got);
        fetched += 1;
        if (fetched % 10 === 0) process.stdout.write(`   … ${fetched} levels fetched\r`);
      }
      await sleep(DELAY);
    }
  }

  await writeJson(path.join(OUT, "index.json"), {
    _source: `${API}/career — extracted with an authenticated session`,
    fetchedAt: new Date().toISOString(),
    worldCount: worlds.length,
    levelCount: totalLevels,
    worlds: index,
  });

  console.log(`\n✓ ${fetched} levels fetched, ${skipped} already on disk → ${path.relative(ROOT, OUT)}`);
}

main().catch((err) => { console.error(`\n✗ ${err.message}`); process.exit(1); });
