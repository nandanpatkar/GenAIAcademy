/**
 * manual_path.js — the Missing Manual curriculum path.
 *
 * The derivation from MANUAL_STRUCTURE lives in `manual_path.source.js` and is
 * executed at BUILD time by `scripts/build_manual_path.mjs`, which writes
 * `manual_path.generated.json`.
 *
 * This matters because `roadmap.js` imports this file and `App.jsx` imports
 * roadmap.js — so anything reachable from here lands in the entry chunk. Importing
 * manualData.js at runtime put 848 KB of source plus a nested .map() transform on
 * the startup critical path for every visitor. Only the derived result is needed
 * there, and as JSON the bundler emits it behind JSON.parse rather than an object
 * literal, which the engine parses considerably faster.
 *
 * Regenerate with: npm run build:manual-path
 */
import MANUAL_PATH_DATA from "./manual_path.generated.json";

export const MANUAL_PATH = MANUAL_PATH_DATA;
