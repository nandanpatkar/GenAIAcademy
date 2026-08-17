#!/usr/bin/env node
/**
 * upload_docs_archive.mjs — push the doc archives to Cloudflare R2 (bucket
 * "docs-archive"), so they can be dropped from the Vercel deployment and
 * served instead by docs-cdn-worker/ via the vercel.json rewrites.
 *
 *   node scripts/upload_docs_archive.mjs --dry-run
 *   node scripts/upload_docs_archive.mjs
 *   node scripts/upload_docs_archive.mjs --only langchain
 *
 * Sources directly from public/<dir>/ (the already-built output of
 * build_agentcore_samples.py, build_langchain_docs.py, build_strands_docs.py,
 * build_manual_data.py) — nothing is regenerated here.
 *
 * Keys mirror the public/ layout exactly, which is the prefix set
 * docs-cdn-worker/src/index.js is willing to serve:
 *   public/langchain/md/x.md  ->  langchain/md/x.md
 *
 * Resumable: each uploaded object's SHA-256 is recorded in
 * scripts/.docs-archive-uploaded.json, so a re-run only pushes what changed.
 */
import { createReadStream, existsSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const BUCKET = "docs-archive";
const STATE = join(ROOT, "scripts", ".docs-archive-uploaded.json");
const CONCURRENCY = 32;
const IMMUTABLE = "public, max-age=31536000, immutable";
const REVALIDATE = "public, max-age=0, must-revalidate";

const DIRS = [
  "agentcore-samples",
  "agentcore",
  "langchain",
  "strands",
  "guides",
  "ai-from-scratch",
  "datascience",
  "chai-visual",
];
const SKIP_FILES = new Set([".DS_Store", "build-report.json"]);

const CONTENT_TYPES = {
  md: "text/markdown; charset=utf-8",
  webp: "image/webp",
  avif: "image/avif",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  json: "application/json; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  py: "text/x-python; charset=utf-8",
  ts: "text/plain; charset=utf-8",
  tsx: "text/plain; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  jsx: "text/plain; charset=utf-8",
  yaml: "text/yaml; charset=utf-8",
  yml: "text/yaml; charset=utf-8",
  sh: "text/x-sh; charset=utf-8",
  toml: "text/plain; charset=utf-8",
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  sql: "text/plain; charset=utf-8",
  cfg: "text/plain; charset=utf-8",
  ini: "text/plain; charset=utf-8",
  tf: "text/plain; charset=utf-8",
  tfvars: "text/plain; charset=utf-8",
  dockerfile: "text/plain; charset=utf-8",
};

// --- args -----------------------------------------------------------------
const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const force = argv.includes("--force");
const onlyFilter = new Set(
  argv.flatMap((a, i) => (a === "--only" ? [argv[i + 1]] : [])).filter(Boolean),
);
const dirs = onlyFilter.size ? DIRS.filter((d) => onlyFilter.has(d)) : DIRS;

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
for (const k of ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"]) {
  if (!env[k]) {
    console.error(`Missing ${k} in .env.local — run \`npm run check:r2\` first.`);
    process.exit(1);
  }
}

// --- collect ----------------------------------------------------------------
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

console.log(`Scanning ${dirs.join(", ")} …`);
const files = [];
for (const dirName of dirs) {
  const dir = join(ROOT, "public", dirName);
  if (!existsSync(dir)) {
    console.log(`  (skipping ${dirName}: public/${dirName} not found)`);
    continue;
  }
  for await (const path of walk(dir)) {
    const rel = `${dirName}/${relative(dir, path).split(sep).join("/")}`;
    files.push({ path, key: rel, size: statSync(path).size });
  }
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
console.log(`  bucket          ${BUCKET}\n`);

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

// --- upload -----------------------------------------------------------------
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
        Bucket: BUCKET,
        Key: file.key,
        Body: readFileSync(file.path),
        ContentType: CONTENT_TYPES[ext] || "application/octet-stream",
        // Prerendered pages are replaced on every mirror rebuild, so they have
        // to revalidate. Hashed assets and images keep the immutable year.
        CacheControl: ext === "html" ? REVALIDATE : IMMUTABLE,
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
