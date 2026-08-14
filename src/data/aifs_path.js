/**
 * aifs_path.js — the AI from Scratch curriculum as a study path.
 *
 * The derivation from the curriculum index runs at BUILD time in
 * `scripts/build_aifs_path.mjs`, which writes `aifs_path.generated.json`.
 * Doing it here instead would pull the whole 420 KB index into the roadmap
 * chunk just to read titles off it, and re-run 3,000 nested maps on every
 * load. As JSON the bundler emits it behind JSON.parse, which the engine
 * handles considerably faster than an object literal of the same size.
 *
 * Node = phase, module = lesson, subtopic = a section of that lesson. Modules
 * carry `aifsSlug` and subtopics carry `aifs` ("<slug>#<heading>"), which is
 * what App.jsx's handleTopicSelect uses to open the reader at the right place.
 *
 * Regenerate with: npm run build:aifs-path   (after npm run build:aifs)
 */
import AIFS_PATH_DATA from "./aifs_path.generated.json";

export const AIFS_PATH = AIFS_PATH_DATA;
