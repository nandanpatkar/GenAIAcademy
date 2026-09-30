// Store-backed actions shared by the workspace and the prep sections. Pure
// rules live in lib/; this file is the thin layer that reads the latest stored
// state, applies a rule and writes it back.
import { KEYS } from "./keys";
import { dayKey } from "./lib/dates";
import { addItem, makeList, toggleItem } from "./lib/lists";
import { applyEdit, makeNote } from "./lib/notes";
import { LEGACY_KEYS, readLegacyArray, readStore, uid, updateStore, writeLegacyArray } from "./lib/store";

const MAX_SUBMISSIONS = 200;
const MAX_CODE_CHARS = 8000;

// Later phases register follow-up work for accepted submissions (rewards,
// review scheduling, daily challenge, plan tasks) without this module having
// to import them — keeps the workspace bundle small.
const acceptedListeners = new Set();
export const onAccepted = (listener) => {
  acceptedListeners.add(listener);
  return () => acceptedListeners.delete(listener);
};

/**
 * Record one judged submission. Only real verdicts reach here — a network or
 * runner failure throws before the workspace calls this, so infrastructure
 * trouble is never counted as a wrong answer.
 */
export function recordSubmission({ problem, result, code, provider }) {
  if (!problem?.slug || !result) return null;
  const at = new Date();
  const accepted = Boolean(result.accepted);
  const verdict = accepted ? "accepted" : (result.status && result.status !== "ok" && result.status !== "completed" ? result.status : "wrong_answer");
  const submission = {
    id: uid("sub"),
    slug: problem.slug,
    title: problem.title,
    verdict,
    passed: result.summary?.passed ?? 0,
    total: result.summary?.total ?? 0,
    runtime: result.runtime ?? null,
    memory: result.memory ?? null,
    code: String(code || "").slice(0, MAX_CODE_CHARS),
    truncated: String(code || "").length > MAX_CODE_CHARS,
    provider: provider || null,
    at: at.toISOString(),
    day: dayKey(at),
  };

  updateStore(KEYS.submissions, [], (list) => [submission, ...list].slice(0, MAX_SUBMISSIONS));

  let firstAccept = false;
  updateStore(KEYS.attempts, {}, (map) => {
    const entry = map[problem.slug] || { attempts: 0, accepted: 0, acceptedDays: [], firstAcceptedAt: null };
    firstAccept = accepted && !entry.accepted;
    return {
      ...map,
      [problem.slug]: {
        ...entry,
        attempts: entry.attempts + 1,
        accepted: entry.accepted + (accepted ? 1 : 0),
        acceptedDays: accepted && !entry.acceptedDays.includes(submission.day) ? [...entry.acceptedDays, submission.day] : entry.acceptedDays,
        firstAcceptedAt: entry.firstAcceptedAt || (accepted ? submission.at : null),
        lastVerdict: verdict,
        lastAt: submission.at,
      },
    };
  });

  if (accepted) {
    const completed = readLegacyArray(LEGACY_KEYS.completed);
    if (!completed.includes(problem.slug)) writeLegacyArray(LEGACY_KEYS.completed, [...completed, problem.slug]);
    acceptedListeners.forEach((listener) => {
      try { listener({ problem, submission, firstAccept }); } catch (error) { console.error("[dsa-prep] accepted listener failed", error); }
    });
  }
  return submission;
}

/* ── notes ─────────────────────────────────────────────────────────────── */

const LEGACY_NOTE_PREFIX = "dsa_workspace_notes_";

/**
 * The note linked to a problem. Notes written by the workspace before
 * NoteSpace existed live under `dsa_workspace_notes_<slug>`; the first read
 * adopts that text into a real note and removes the old key.
 */
export function getProblemNote(slug, problemTitle = "") {
  const notes = readStore(KEYS.notes, []);
  const existing = notes.find((note) => !note.deletedAt && note.links?.some((link) => link.type === "problem" && link.slug === slug) && !note.draft);
  if (existing) return existing;
  // The workspace stored these as raw strings, not JSON.
  let raw = null;
  try { raw = window.localStorage.getItem(LEGACY_NOTE_PREFIX + slug); } catch { raw = null; }
  if (!raw || !raw.trim()) return null;
  const note = makeNote({ id: uid("note"), title: problemTitle ? `${problemTitle} — notes` : "Problem notes", body: raw, links: [{ type: "problem", slug }], source: "migrated" });
  updateStore(KEYS.notes, [], (list) => [note, ...list]);
  try { window.localStorage.removeItem(LEGACY_NOTE_PREFIX + slug); } catch { /* noop */ }
  return note;
}

/** Create or update the problem's note. Returns { ok, note } or { ok: false, conflict }. */
export function saveProblemNote(slug, body, { problemTitle = "", expectedVersion = null } = {}) {
  let outcome = null;
  updateStore(KEYS.notes, [], (list) => {
    const index = list.findIndex((note) => !note.deletedAt && !note.draft && note.links?.some((link) => link.type === "problem" && link.slug === slug));
    if (index < 0) {
      const note = makeNote({ id: uid("note"), title: problemTitle ? `${problemTitle} — notes` : "Problem notes", body, links: [{ type: "problem", slug }], source: "workspace" });
      outcome = { ok: true, note };
      return [note, ...list];
    }
    const result = applyEdit(list[index], { body }, expectedVersion);
    outcome = result;
    if (!result.ok) return list;
    const copy = [...list];
    copy[index] = result.note;
    return copy;
  });
  return outcome;
}

/* Notes linked to something other than a problem (an AI from Scratch lesson).
   `link` is { type, slug, title } — the title is stored so NoteSpace can show
   it without loading that feature's data. */
const matchesLink = (note, link) => !note.deletedAt && !note.draft && note.links?.some((entry) => entry.type === link.type && entry.slug === link.slug);

export function getLinkedNote(link) {
  return readStore(KEYS.notes, []).find((note) => matchesLink(note, link)) || null;
}

export function saveLinkedNote(link, body, { title, expectedVersion = null } = {}) {
  let outcome = null;
  updateStore(KEYS.notes, [], (list) => {
    const index = list.findIndex((note) => matchesLink(note, link));
    if (index < 0) {
      const note = makeNote({ id: uid("note"), title: title || `${link.title} — notes`, body, links: [link], source: "manual" });
      outcome = { ok: true, note };
      return [note, ...list];
    }
    outcome = applyEdit(list[index], { body }, expectedVersion);
    if (!outcome.ok) return list;
    const copy = [...list];
    copy[index] = outcome.note;
    return copy;
  });
  return outcome;
}

export function createNote(fields) {
  const note = makeNote({ id: uid("note"), ...fields });
  updateStore(KEYS.notes, [], (list) => [note, ...list]);
  return note;
}

/** An AI answer saved as a draft note; it stays a draft until the learner saves it. */
export function saveAiDraft({ slug, problemTitle, content }) {
  return createNote({
    title: `AI draft — ${problemTitle || "problem"}`,
    body: content,
    links: slug ? [{ type: "problem", slug }] : [],
    tags: ["ai-draft"],
    source: "ai-draft",
    draft: true,
  });
}

/* ── lists ─────────────────────────────────────────────────────────────── */

export function toggleInList(listId, slug) {
  updateStore(KEYS.lists, [], (lists) => lists.map((list) => (list.id === listId ? toggleItem(list, slug) : list)));
}

export function createListWith(name, slug, purpose = "custom") {
  let list = makeList({ id: uid("list"), name, purpose });
  if (slug) list = addItem(list, slug);
  updateStore(KEYS.lists, [], (lists) => [list, ...lists]);
  return list;
}
