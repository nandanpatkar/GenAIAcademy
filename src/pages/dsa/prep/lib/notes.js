// NoteSpace model. Notes are private Markdown documents that can link to
// problems. Edits carry an expected version so a stale editor (a second tab,
// or the workspace notes tab open alongside NoteSpace) gets a conflict instead
// of silently overwriting newer text. Deletes go to a 30-day trash.

export const TRASH_DAYS = 30;

const nowIso = () => new Date().toISOString();

export function makeNote({ id, title = "", body = "", tags = [], links = [], source = "manual", draft = false }, now = nowIso()) {
  return {
    id,
    title: title.trim() || "Untitled note",
    body,
    tags: normalizeTags(tags),
    links,
    source, // manual | ai-draft | workspace | migrated
    draft, // AI drafts stay drafts until the learner saves them
    version: 1,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
}

export function normalizeTags(tags) {
  return [...new Set((Array.isArray(tags) ? tags : String(tags || "").split(","))
    .map((tag) => String(tag).trim().toLowerCase().replace(/^#/, "").replace(/\s+/g, "-"))
    .filter(Boolean))].slice(0, 12);
}

/**
 * Apply an edit. Returns { ok: true, note } or { ok: false, conflict: current }
 * when the stored note moved past the version the editor started from.
 */
export function applyEdit(current, patch, expectedVersion, now = nowIso()) {
  if (expectedVersion != null && current.version !== expectedVersion) return { ok: false, conflict: current };
  const next = { ...current, ...patch, version: current.version + 1, updatedAt: now };
  if ("tags" in patch) next.tags = normalizeTags(patch.tags);
  if ("title" in patch) next.title = String(patch.title ?? "").trim() || "Untitled note";
  return { ok: true, note: next };
}

export const trash = (note, now = nowIso()) => ({ ...note, deletedAt: now, version: note.version + 1, updatedAt: now });
export const restore = (note, now = nowIso()) => ({ ...note, deletedAt: null, version: note.version + 1, updatedAt: now });

/** Drop notes whose trash period has elapsed. */
export function purgeExpired(notes, now = Date.now(), days = TRASH_DAYS) {
  const cutoff = now - days * 86400000;
  return notes.filter((note) => !note.deletedAt || new Date(note.deletedAt).getTime() > cutoff);
}

export const linkedProblem = (note) => note.links?.find((link) => link.type === "problem")?.slug || null;

export function searchNotes(notes, query) {
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) return notes;
  return notes.filter((note) => `${note.title}\n${note.body}\n${note.tags.join(" ")}`.toLowerCase().includes(needle));
}

/** Portable Markdown with a small front-matter block. */
export function noteToMarkdown(note, problemTitle = "") {
  const front = [
    "---",
    `title: ${JSON.stringify(note.title)}`,
    note.tags.length ? `tags: [${note.tags.map((tag) => JSON.stringify(tag)).join(", ")}]` : null,
    linkedProblem(note) ? `problem: ${JSON.stringify(problemTitle || linkedProblem(note))}` : null,
    `created: ${note.createdAt}`,
    `updated: ${note.updatedAt}`,
    "---",
    "",
  ].filter((line) => line !== null).join("\n");
  return `${front}${note.body}\n`;
}

export const safeFilename = (value, fallback = "note") => (String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || fallback);
