#!/usr/bin/env node
/**
 * upload_av_archive.mjs — push .av-build/ to Cloudflare R2.
 *
 *   node scripts/upload_av_archive.mjs --dry-run    # report, upload nothing
 *   node scripts/upload_av_archive.mjs              # upload the delta
 *   node scripts/upload_av_archive.mjs --year 2024  # one year only
 *
 * Resumable by design. Every uploaded object's SHA-256 is recorded in
 * .av-build/.uploaded.json, so an interrupted run picks up where it stopped and
 * a re-run after a content fix pushes only what changed. That matters here:
 * the first push is ~71,000 objects and ~2.2 GB, which is a long time to be one
 * dropped connection away from starting over.
 *
 * Keys mirror the build layout under an `av/` prefix, which is the only prefix
 * the Worker will serve:
 *   .av-build/2024/md/<slug>.md  ->  av/2024/md/<slug>.md
 *
 * Objects are immutable — a given key's bytes never change, because a changed
 * image produces a changed body that references it. So Cache-Control is set to
 * one year and the browser never revalidates.
 */
import { createReadStream, existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BUILD = join(ROOT, ".av-build");
const STATE = join(BUILD, ".uploaded.json");
const PREFIX = "av";
const CONCURRENCY = 32;
const IMMUTABLE = "public, max-age=31536000, immutable";

const SKIP_FILES = new Set([".cache.json", ".uploaded.json", "build-report.json", ".DS_Store"]);

const CONTENT_TYPES = {
  md: "text/markdown; charset=utf-8",
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  json: "application/json; charset=utf-8",
  mp4: "video/mp4",
  txt: "text/plain; charset=utf-8",
};

// --- args -----------------------------------------------------------------
const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const force = argv.includes("--force");
const yearFilter = new Set(
  argv.flatMap((a, i) => (a === "--year" ? [argv[i + 1]] : [])).filter(Boolean),
);

// --- env ------------------------------------------------------------------
function loadEnv(file) {
  if (!existsSync(file)) return {};
  const out = {};
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}
const env = { ...loadEnv(join(ROOT, ".env.local")), ...process.env };
for (const k of ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"]) {
  if (!env[k]) {
    console.error(`Missing ${k} in .env.local — run \`npm run check:r2\` first.`);
    process.exit(1);
  }
}
if (!existsSync(BUILD)) {
  console.error(`${BUILD} not found. Run: python3 scripts/build_av_archive.py`);
  process.exit(1);
}

// --- collect --------------------------------------------------------------
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (entry.isFile() && !SKIP_FILES.has(entry.name)) yield path;
  }
}

function sha256(path) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    createReadStream(path)
      .on("data", (c) => hash.update(c))
      .on("end", () => resolve(hash.digest("hex")))
      .on("error", reject);
  });
}

const state = existsSync(STATE) && !force ? JSON.parse(readFileSync(STATE, "utf8")) : {};

console.log("Scanning .av-build …");
const files = [];
for await (const path of walk(BUILD)) {
  const rel = relative(BUILD, path).split(sep).join("/");
  if (yearFilter.size && !yearFilter.has(rel.split("/")[0])) continue;
  files.push({ path, key: `${PREFIX}/${rel}`, size: statSync(path).size });
}
files.sort((a, b) => a.key.localeCompare(b.key));

let pending = [];
let skipped = 0;
let skippedBytes = 0;
for (const f of files) {
  const digest = await sha256(f.path);
  if (state[f.key] === digest) {
    skipped++;
    skippedBytes += f.size;
  } else {
    pending.push({ ...f, digest });
  }
}

const totalBytes = pending.reduce((n, f) => n + f.size, 0);
const fmt = (n) => (n > 1e9 ? `${(n / 1e9).toFixed(2)} GB` : `${(n / 1e6).toFixed(1)} MB`);

console.log(`\n  files found     ${files.length}`);
console.log(`  already up      ${skipped}  (${fmt(skippedBytes)})`);
console.log(`  to upload       ${pending.length}  (${fmt(totalBytes)})`);
console.log(`  bucket          ${env.R2_BUCKET}\n`);

if (dryRun) {
  console.log("--dry-run: nothing uploaded.");
  if (pending.length) {
    console.log("\nfirst few keys:");
    for (const f of pending.slice(0, 8)) console.log(`   ${f.key}`);
  }
  process.exit(0);
}
if (!pending.length) {
  console.log("Everything is already uploaded.");
  process.exit(0);
}

// --- upload ---------------------------------------------------------------
const client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

let done = 0;
let sentBytes = 0;
let failed = 0;
const started = Date.now();
let lastSave = Date.now();

async function put(file, attempt = 0) {
  const ext = file.key.split(".").pop().toLowerCase();
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET,
        Key: file.key,
        // Read fully rather than streaming: these are small objects (the
        // median is ~30 KB) and a Buffer lets the SDK retry a failed PUT
        // without us having to rebuild the stream.
        Body: readFileSync(file.path),
        ContentType: CONTENT_TYPES[ext] || "application/octet-stream",
        CacheControl: IMMUTABLE,
      }),
    );
    state[file.key] = file.digest;
    sentBytes += file.size;
  } catch (err) {
    if (attempt < 4) {
      await new Promise((r) => setTimeout(r, 2 ** attempt * 500 + Math.random() * 400));
      return put(file, attempt + 1);
    }
    failed++;
    console.error(`\n  FAILED ${file.key}: ${err.name}: ${err.message}`);
  } finally {
    done++;
    if (done % 200 === 0 || done === pending.length) {
      const elapsed = (Date.now() - started) / 1000;
      const rate = done / elapsed;
      const eta = (pending.length - done) / Math.max(rate, 0.01);
      process.stdout.write(
        `\r  ${done}/${pending.length}  ${fmt(sentBytes)}  ` +
          `${rate.toFixed(0)}/s  eta ${(eta / 60).toFixed(1)}m   `,
      );
    }
    // Checkpoint periodically so a crash costs at most a few seconds of work.
    if (Date.now() - lastSave > 10000) {
      lastSave = Date.now();
      writeFileSync(STATE, JSON.stringify(state));
    }
  }
}

console.log(`Uploading with ${CONCURRENCY} parallel requests…`);
const queue = pending[Symbol.iterator]();
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (const file of queue) await put(file);
  }),
);

writeFileSync(STATE, JSON.stringify(state));
const elapsed = (Date.now() - started) / 1000;
console.log(`\n\nUploaded ${done - failed}/${pending.length} objects (${fmt(sentBytes)}) in ${(elapsed / 60).toFixed(1)}m`);
if (failed) {
  console.log(`${failed} failed — re-run to retry only those.`);
  process.exit(1);
}
console.log("Done. Re-running is safe and will upload nothing.");
