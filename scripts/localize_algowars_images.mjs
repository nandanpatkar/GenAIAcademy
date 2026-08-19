// Downloads the images embedded in AlgoWars theory articles (hosted on takeuforward's
// CDN), re-encodes them to WebP, and rewrites the level JSON to point at local files —
// so the mirror renders with no outbound image requests.
//
//   node scripts/localize_algowars_images.mjs
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LEVELS = path.join(ROOT, "src/data/algowar/career/levels");
const OUT = path.join(ROOT, "src/assets/algowar/content");
const TMP = path.join(ROOT, ".algowars-mirror/img-tmp");

const IMG_SRC = /(<img\b[^>]*?\bsrc=)(["'])([^"']+)\2/gi;

const nameFor = (url) => `${crypto.createHash("sha1").update(url).digest("hex").slice(0, 12)}.webp`;

async function fetchAndConvert(url, target) {
  try { await fs.access(target); return "cached"; } catch { /* download it */ }

  let buf;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return `HTTP ${res.status}`;
    buf = Buffer.from(await res.arrayBuffer());
  } catch (err) {
    return `fetch failed: ${err.message}`;
  }

  // Some srcs point at redirects or HTML error pages rather than images.
  if (buf.length < 128) return "too small to be an image";

  const raw = path.join(TMP, `${crypto.createHash("sha1").update(url).digest("hex").slice(0, 12)}.bin`);
  await fs.writeFile(raw, buf);
  try {
    // Cap width at 1000px — these render inside a reading column.
    await run("cwebp", ["-quiet", "-resize", "1000", "0", "-q", "80", raw, "-o", target]);
  } catch {
    await fs.unlink(raw).catch(() => {});
    return "not a decodable image";
  }
  await fs.unlink(raw).catch(() => {});
  return "ok";
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(TMP, { recursive: true });

  const files = (await fs.readdir(LEVELS)).filter((f) => f.endsWith(".json"));
  const urls = new Map();

  for (const file of files) {
    const level = JSON.parse(await fs.readFile(path.join(LEVELS, file), "utf8"));
    for (const m of String(level.statementHtml ?? "").matchAll(IMG_SRC)) {
      const url = m[3];
      if (/^https?:\/\//i.test(url)) urls.set(url, nameFor(url));
    }
  }
  console.log(`${urls.size} distinct images referenced\n`);

  const resolved = new Map();
  let ok = 0, failed = 0;
  for (const [url, name] of urls) {
    const status = await fetchAndConvert(url, path.join(OUT, name));
    if (status === "ok" || status === "cached") { resolved.set(url, name); ok += 1; }
    else { failed += 1; console.log(`  ! ${status} ${url}`); }
  }
  console.log(`\n${ok} localized, ${failed} failed`);

  // Rewrite the level JSON to reference the local copies.
  let touched = 0;
  for (const file of files) {
    const p = path.join(LEVELS, file);
    const level = JSON.parse(await fs.readFile(p, "utf8"));
    const html = String(level.statementHtml ?? "");
    if (!html) continue;
    const next = html.replace(IMG_SRC, (full, prefix, quote, url) => {
      const name = resolved.get(url);
      return name ? `${prefix}${quote}algowar-content:${name}${quote}` : full;
    });
    if (next !== html) {
      level.statementHtml = next;
      await fs.writeFile(p, `${JSON.stringify(level, null, 2)}\n`);
      touched += 1;
    }
  }
  console.log(`${touched} level files rewritten`);
  await fs.rm(TMP, { recursive: true, force: true });
}

main().catch((err) => { console.error(`\n✗ ${err.message}`); process.exit(1); });
