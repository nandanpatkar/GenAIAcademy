#!/usr/bin/env node
// dsanew/ (raw scraped LeetCode source) is gitignored and never present on
// deploy hosts like Vercel. Locally, where it exists, this regenerates the
// three committed artefacts (src/data/codelab/catalog.json,
// public/codelab/problems/*.json, api/_data/codelabManifests.json). On a
// host without dsanew/, this is a no-op and the build reuses those
// already-committed artefacts.
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const script = path.join(repoRoot, "dsanew", "tools", "build_codelab.py");

if (!existsSync(script)) {
  console.log("dsanew/tools/build_codelab.py not found (dsanew/ is gitignored, build-input only); skipping codelab build and keeping the committed catalog/payloads/manifest.");
  process.exit(0);
}

const result = spawnSync("python3", [script], { stdio: "inherit", cwd: repoRoot });
process.exit(result.status ?? 1);
