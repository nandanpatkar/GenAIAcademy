#!/usr/bin/env node
/**
 * check_r2.mjs — verify R2 credentials before committing to a 76,000-object upload.
 *
 * Runs the full round trip the real upload script will need: list, put, get,
 * delete. If this passes, `npm run upload:av` will not fail on auth or config.
 * If it fails, it says which of the four env vars is the likely cause.
 *
 *   node scripts/check_r2.mjs
 *
 * Reads credentials from .env.local, which is gitignored. Nothing is printed
 * that could leak a secret — keys are shown fingerprinted, never in full.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

// Minimal .env parser — enough for KEY=value and KEY="value", ignoring comments.
function loadEnv(file) {
  if (!existsSync(file)) return {};
  const out = {};
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    out[m[1]] = v;
  }
  return out;
}

const env = { ...loadEnv(join(ROOT, ".env.local")), ...process.env };

const REQUIRED = [
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
];
const missing = REQUIRED.filter((k) => !env[k]);
if (missing.length) {
  console.error("Missing from .env.local:\n  " + missing.join("\n  "));
  console.error("\nSee AV_ARCHIVE_PLAN.md §Phase 0 for where each value comes from.");
  process.exit(1);
}

const fp = (s) => `${s.slice(0, 4)}…${s.slice(-4)} (${s.length} chars)`;
console.log("Account ID          ", env.R2_ACCOUNT_ID);
console.log("Bucket              ", env.R2_BUCKET);
console.log("Access Key ID       ", fp(env.R2_ACCESS_KEY_ID));
console.log("Secret Access Key   ", fp(env.R2_SECRET_ACCESS_KEY));
console.log("Public base         ", env.VITE_AV_CDN_BASE || "(not set yet — fine for now)");
console.log();

const client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

const KEY = "av/_healthcheck.txt";
const BODY = `ok ${new Date().toISOString()}`;
let failed = false;

async function step(label, fn) {
  process.stdout.write(`  ${label.padEnd(28)}`);
  try {
    const r = await fn();
    console.log("ok" + (typeof r === "string" ? `  ${r}` : ""));
  } catch (err) {
    failed = true;
    console.log("FAILED");
    console.log(`      ${err.name}: ${err.message}`);
    if (err.name === "InvalidAccessKeyId" || err.name === "SignatureDoesNotMatch") {
      console.log("      -> R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY are wrong, or the");
      console.log("         token was created for a different account.");
    } else if (err.name === "NoSuchBucket") {
      console.log(`      -> No bucket named "${env.R2_BUCKET}" in this account.`);
    } else if (err.name === "AccessDenied") {
      console.log("      -> Token exists but lacks permission. It needs");
      console.log("         'Object Read & Write' scoped to this bucket.");
    } else if (/getaddrinfo|ENOTFOUND|EAI_AGAIN/.test(err.message)) {
      console.log("      -> R2_ACCOUNT_ID looks wrong; the endpoint hostname did not resolve.");
    }
  }
}

console.log("Round trip:");
await step("list bucket", async () => {
  const r = await client.send(
    new ListObjectsV2Command({ Bucket: env.R2_BUCKET, MaxKeys: 1 }),
  );
  return `${r.KeyCount ?? 0} object(s) sampled`;
});
await step("write test object", () =>
  client.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET,
      Key: KEY,
      Body: BODY,
      ContentType: "text/plain; charset=utf-8",
    }),
  ),
);
await step("read it back", async () => {
  const r = await client.send(
    new GetObjectCommand({ Bucket: env.R2_BUCKET, Key: KEY }),
  );
  const text = await r.Body.transformToString();
  if (text !== BODY) throw new Error("content mismatch on read-back");
  return `${text.length} bytes match`;
});
await step("delete test object", () =>
  client.send(new DeleteObjectCommand({ Bucket: env.R2_BUCKET, Key: KEY })),
);

console.log();
if (failed) {
  console.log("Not ready. Fix the failure above and re-run.");
  process.exit(1);
}
console.log("R2 is ready. Next: deploy the Worker, then run the archive build.");
