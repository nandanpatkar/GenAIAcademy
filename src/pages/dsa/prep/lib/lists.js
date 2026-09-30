// Custom problem lists. A list only references problems — removing an item or
// deleting a whole list never touches the learner's solved state.

export const LIST_PURPOSES = [
  { id: "custom", label: "Custom" },
  { id: "revision", label: "Revision" },
  { id: "company", label: "Target company" },
];

const nowIso = () => new Date().toISOString();

export function makeList({ id, name, purpose = "custom", description = "" }, now = nowIso()) {
  return {
    id,
    name: String(name || "").trim() || "Untitled list",
    purpose: LIST_PURPOSES.some((entry) => entry.id === purpose) ? purpose : "custom",
    description: String(description || "").trim(),
    items: [],
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
}

const touch = (list, patch, now = nowIso()) => ({ ...list, ...patch, updatedAt: now });

/** Idempotent: adding a problem that is already listed is a no-op. */
export function addItem(list, slug, now = nowIso()) {
  if (list.items.some((item) => item.slug === slug)) return list;
  return touch(list, { items: [...list.items, { slug, addedAt: now }] }, now);
}

export function removeItem(list, slug, now = nowIso()) {
  return touch(list, { items: list.items.filter((item) => item.slug !== slug) }, now);
}

export function toggleItem(list, slug, now = nowIso()) {
  return list.items.some((item) => item.slug === slug) ? removeItem(list, slug, now) : addItem(list, slug, now);
}

/** Move an item by `delta` positions, clamped to the list bounds. */
export function moveItem(list, slug, delta, now = nowIso()) {
  const from = list.items.findIndex((item) => item.slug === slug);
  if (from < 0) return list;
  const to = Math.max(0, Math.min(list.items.length - 1, from + delta));
  if (to === from) return list;
  const items = [...list.items];
  const [moved] = items.splice(from, 1);
  items.splice(to, 0, moved);
  return touch(list, { items }, now);
}

/** Move `slug` to sit where `targetSlug` is (drag and drop). */
export function moveItemTo(list, slug, targetSlug, now = nowIso()) {
  const from = list.items.findIndex((item) => item.slug === slug);
  const to = list.items.findIndex((item) => item.slug === targetSlug);
  if (from < 0 || to < 0 || from === to) return list;
  return moveItem(list, slug, to - from, now);
}

export function listProgress(list, completed) {
  const done = list.items.filter((item) => completed.has(item.slug)).length;
  return { done, total: list.items.length };
}

/** Portable export: names and problem slugs only — never notes or code. */
export function exportLists(lists) {
  return {
    format: "dsa-prep-lists",
    version: 1,
    exportedAt: nowIso(),
    lists: lists.map((list) => ({ name: list.name, purpose: list.purpose, description: list.description, items: list.items.map((item) => item.slug) })),
  };
}

/** Parse an export back into fresh lists, keeping only slugs the catalog knows. */
export function importLists(payload, knownSlugs, makeId) {
  if (!payload || payload.format !== "dsa-prep-lists" || !Array.isArray(payload.lists)) throw new Error("This file is not a lists export.");
  return payload.lists.map((entry) => {
    let list = makeList({ id: makeId(), name: entry.name, purpose: entry.purpose, description: entry.description });
    (entry.items || []).filter((slug) => knownSlugs.has(slug)).forEach((slug) => { list = addItem(list, slug); });
    return list;
  });
}
