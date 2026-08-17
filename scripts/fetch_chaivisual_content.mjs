#!/usr/bin/env node
/**
 * fetch_chaivisual_content.mjs — capture the Chai Visual lessons that the
 * HTTrack mirror could not reach.
 *
 * dsa.chaicode.com puts all but ten of its 280 lessons behind a paid account,
 * so the offline mirror stored a "This chapter is locked" screen in place of
 * every one of them. This script opens a browser signed in as you, walks the
 * lesson list from src/data/chaiVisualCourseData.js, and saves each rendered
 * page into .chaivisual-fetched/.
 *
 * That directory is an overlay, not the mirror itself: build_chaivisual_mirror.py
 * rebuilds public/chai-visual/ from scratch on every run, so anything written
 * there directly would be wiped. Keeping the two separate lets either step
 * re-run in any order without losing work.
 *
 * The session lives in its own Chrome profile under .chaivisual-session/ — it
 * never touches your main browser profile, so nothing this script can see
 * extends beyond the one site you sign into in its window. Log in once; the
 * profile persists, and later runs reuse it.
 *
 *   node scripts/fetch_chaivisual_content.mjs            # resume: locked pages only
 *   node scripts/fetch_chaivisual_content.mjs --all      # re-fetch everything
 *   node scripts/fetch_chaivisual_content.mjs --limit 5  # try a handful first
 *
 * Fetching is sequential with a pause between pages: this is one reader's
 * account working through a course, and it should look like it.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer-core");

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DATA = join(ROOT, "src", "data", "chaiVisualCourseData.js");
const MIRROR = join(ROOT, "public", "chai-visual");
const OUT = join(ROOT, ".chaivisual-fetched");
const PROFILE = join(ROOT, ".chaivisual-session");
const ORIGIN = "https://dsa.chaicode.com";

const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
].find(existsSync);

const LOCKED = /This (?:chapter|pattern|problem|topic) is locked/;
const PAUSE_MS = 900;

const argv = process.argv.slice(2);
const refetchAll = argv.includes("--all");
const limit = Number(argv[argv.indexOf("--limit") + 1]) || Infinity;

function lessonPaths() {
  const src = readFileSync(DATA, "utf8");
  const tracks = JSON.parse(src.match(/export const CV_TRACKS = (\[[\s\S]*?\]);\n/)[1]);
  return tracks.flatMap((t) => t.groups.flatMap((g) => g.items.map((i) => i.path)));
}

function isLocked(file) {
  if (!existsSync(file)) return true;
  return LOCKED.test(readFileSync(file, "utf8"));
}

if (!CHROME) {
  console.error("No Chrome/Chromium/Brave found in /Applications.");
  process.exit(1);
}
if (!existsSync(MIRROR)) {
  console.error(`${MIRROR} missing — run scripts/build_chaivisual_mirror.py first.`);
  process.exit(1);
}

mkdirSync(PROFILE, { recursive: true });
mkdirSync(OUT, { recursive: true });

const paths = lessonPaths();
// Done means either the overlay already holds an unlocked copy, or the mirror's
// own copy was never locked to begin with (the free sample lessons).
const have = (path) =>
  !isLocked(join(OUT, `${path}.html`)) || !isLocked(join(MIRROR, `${path}.html`));
const todo = (refetchAll ? paths : paths.filter((path) => !have(path))).slice(0, limit);

console.log(`${paths.length} lessons total, ${todo.length} to fetch`);
if (!todo.length) {
  console.log("Nothing locked — already complete.");
  process.exit(0);
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  userDataDir: PROFILE,
  defaultViewport: null,
  // GitHub's sign-in refuses browsers that advertise themselves as automated,
  // so drop the automation banner flag and the CDP-set webdriver bit with it.
  ignoreDefaultArgs: ["--enable-automation"],
  args: [
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-blink-features=AutomationControlled",
    "--window-size=1440,1000",
  ],
});

const signInTab = (await browser.pages())[0] || (await browser.newPage());

// A page that is paid-only, used to tell whether the session is live.
const probePath = paths.find((p) => p.startsWith("computer-network/")) || todo[0];

/* Probe in a tab of its own.
 *
 * The sign-in tab must be left completely alone while OAuth is in flight:
 * navigating it mid-redirect throws the reader back to the login screen, which
 * looks exactly like a login that keeps failing. Cookies are shared across
 * tabs, so a separate tab answers "are we in yet?" without touching it. */
async function sessionLive() {
  const probe = await browser.newPage();
  try {
    await probe.goto(`${ORIGIN}/${probePath}`, { waitUntil: "networkidle2", timeout: 45000 });
    return !LOCKED.test(await probe.content());
  } catch {
    return false;
  } finally {
    await probe.close().catch(() => {});
  }
}

if (!(await sessionLive())) {
  await signInTab.goto(`${ORIGIN}/login`, { waitUntil: "networkidle2", timeout: 60000 });
  console.log("\n  Not signed in yet.");
  console.log("  Sign in with GitHub in the browser window that just opened.");
  console.log("  Take as long as you need — this tab will not be touched.");
  console.log("  Fetching starts by itself once a paid chapter unlocks.\n");

  const deadline = Date.now() + 15 * 60 * 1000;
  let unlocked = false;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 5000));
    if (await sessionLive()) { unlocked = true; break; }
  }
  if (!unlocked) {
    console.error("  Timed out waiting for sign-in. Re-run when you're logged in —");
    console.error("  the profile persists, so a completed login is remembered.");
    await browser.close();
    process.exit(1);
  }
}

console.log("  Signed in. Fetching…\n");
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });

let saved = 0;
let stillLocked = 0;
let failed = 0;

for (const [index, path] of todo.entries()) {
  const target = join(OUT, `${path}.html`);
  try {
    await page.goto(`${ORIGIN}/${path}`, { waitUntil: "networkidle2", timeout: 60000 });
    // The animation canvases mount after hydration settles.
    await new Promise((r) => setTimeout(r, 700));
    const html = await page.content();

    if (LOCKED.test(html)) {
      stillLocked += 1;
      console.log(`  [${index + 1}/${todo.length}] LOCKED  ${path}`);
    } else {
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, html, "utf8");
      saved += 1;
      if ((index + 1) % 10 === 0 || index === 0) {
        console.log(`  [${index + 1}/${todo.length}] ok      ${path}`);
      }
    }
  } catch (error) {
    failed += 1;
    console.log(`  [${index + 1}/${todo.length}] FAILED  ${path} — ${error.message.split("\n")[0]}`);
  }
  await new Promise((r) => setTimeout(r, PAUSE_MS));
}

await browser.close();

console.log(`\n  saved ${saved}, still locked ${stillLocked}, failed ${failed}`);
console.log("  Now re-run: python3 scripts/build_chaivisual_mirror.py");
