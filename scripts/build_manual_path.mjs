/**
 * build_manual_path.mjs — pre-derive MANUAL_PATH into a JSON module.
 *
 * Why this exists:
 *
 * `src/data/manual_path.js` used to `import { MANUAL_STRUCTURE } from "./manualData"`
 * and transform it at runtime. Because `manual_path` is reached from
 * `data/roadmap.js` → `App.jsx`, that put all 848 KB of `manualData.js` into the
 * ENTRY chunk — downloaded, parsed, and transformed with nested .map()s on every
 * single page load, before anything painted.
 *
 * Only the derived shape is needed at startup. Baking it out at build time means:
 *   - the entry ships 563 KB of JSON instead of 848 KB of JS object literal,
 *   - JSON.parse replaces object-literal evaluation (materially faster to parse),
 *   - the nested transform no longer runs on the startup critical path,
 *   - `manualData.js` leaves the entry graph entirely and is reached only by the
 *     lazy screens that genuinely need the full structure (ManualViewer,
 *     ManualTree, the dashboards, pathfinderService, onboardingCatalog).
 *
 * Run via `npm run build:manual-path` (wired into `npm run build`).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const OUT = path.join(root, "src", "data", "manual_path.generated.json");
const SRC = path.join(root, "src", "data", "manual_path.source.js");

// Bundle the source deriver (which imports manualData.js) so we can execute it
// here without Node needing to resolve extensionless imports.
const bundled = await build({
  entryPoints: [SRC],
  bundle: true,
  format: "esm",
  write: false,
  logLevel: "error",
});

const tmp = path.join(root, "node_modules", ".manual_path_build.mjs");
fs.writeFileSync(tmp, bundled.outputFiles[0].text);
const { MANUAL_PATH } = await import(`file://${tmp}?t=${Date.now()}`);
fs.unlinkSync(tmp);

if (!MANUAL_PATH?.nodes?.length) {
  throw new Error("build_manual_path: derived MANUAL_PATH is empty — refusing to write");
}

fs.writeFileSync(OUT, JSON.stringify(MANUAL_PATH));
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`Wrote ${OUT} (${kb} KB, ${MANUAL_PATH.nodes.length} categories)`);
