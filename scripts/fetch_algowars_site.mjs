// Pulls the read-only AlgoWars sections (profile, leaderboard, daily, dream, duo,
// friends, referrals, trial) into src/data/algowar/site/ using the session exported
// to .algowars-session/session.json.
//
//   node scripts/fetch_algowars_site.mjs
//
// GET only, and deliberately no /admin/* — those need a role this account does not
// have, and probing them is not something this script should do.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src/data/algowar/site");
const SESSION_FILE = path.join(ROOT, ".algowars-session/session.json");
const API = "https://api.algowars.online";
const DELAY = 250;

const ENDPOINTS = [
  ["profile", "/users/me"],
  ["analytics", "/users/me/analytics"],
  ["streak", "/users/me/streak"],
  ["my-matches", "/users/me/matches?limit=50"],
  ["leaderboard", "/users/leaderboard?limit=100"],
  ["daily", "/daily"],
  ["dream-companies", "/dream/companies"],
  ["duo", "/duo"],
  ["duo-summary", "/duo/summary"],
  ["friends", "/friends"],
  ["friends-pending", "/friends/pending-count"],
  ["friend-usage", "/friend/usage"],
  ["matches-usage", "/matches/usage"],
  ["matches-active", "/matches/active"],
  ["notifications", "/notifications?limit=50"],
  ["career-entitlement", "/payments/career/status"],
  ["referrals", "/referrals"],
  ["trial", "/trial"],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

let token;
async function api(endpoint) {
  const res = await fetch(`${API}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const text = await res.text();
  if (!res.ok) return { __error: `HTTP ${res.status}`, body: text.slice(0, 200) };
  try { return JSON.parse(text); } catch { return { __error: "not-json", body: text.slice(0, 200) }; }
}

async function main() {
  const session = JSON.parse(await fs.readFile(SESSION_FILE, "utf8"));
  token = session.access_token;
  const left = Math.round((session.expires_at ?? 0) - Date.now() / 1000);
  if (left <= 0) throw new Error("Session expired — export a fresh one.");
  console.log(`Session valid ~${Math.round(left / 60)} min\n`);

  for (const [name, endpoint] of ENDPOINTS) {
    const data = await api(endpoint);
    await writeJson(path.join(OUT, `${name}.json`), data);
    const size = JSON.stringify(data).length;
    console.log(data.__error ? `  ! ${name}: ${data.__error}` : `  ✓ ${name} (${size} bytes)`);
    await sleep(DELAY);
  }

  // Dream mode: the question list per company, then each problem's full statement.
  const companies = JSON.parse(await fs.readFile(path.join(OUT, "dream-companies.json"), "utf8"));
  const list = Array.isArray(companies) ? companies : companies.companies ?? [];
  console.log(`\nDream companies: ${list.length}`);
  for (const c of list) {
    const slug = c.slug ?? c.id;
    if (!slug) continue;
    const data = await api(`/dream/companies/${encodeURIComponent(slug)}/questions`);
    await writeJson(path.join(OUT, "dream", `${slug}.json`), data);
    const qs = data.questions ?? data.problems ?? (Array.isArray(data) ? data : []);
    console.log(data.__error ? `  ! ${slug}: ${data.__error}` : `  ✓ ${slug} (${qs.length} questions)`);
    await sleep(DELAY);

    for (const q of qs) {
      const id = q.problemId ?? q.id;
      if (!id) continue;
      const pf = path.join(OUT, "dream-problems", `${id}.json`);
      try { await fs.access(pf); continue; } catch { /* not fetched yet */ }
      const problem = await api(`/dream/problem/${encodeURIComponent(id)}`);
      await writeJson(pf, problem);
      await sleep(DELAY);
    }
  }

  console.log(`\n✓ Written to ${path.relative(ROOT, OUT)}`);
}

main().catch((err) => { console.error(`\n✗ ${err.message}`); process.exit(1); });
