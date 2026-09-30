// Community: posts, structured interview experiences, threaded comments,
// votes, reports and moderation. Everything here is pure; the UI persists it.
//
// There is no shared server behind the hub, so this community lives on the
// device (with JSON export/import to pass posts around). The rules are the
// ones a hosted version would enforce: votes are one-per-person replacements,
// reply depth is bounded, anonymity hides the author publicly, contact details
// are redacted, and moderation decisions are logged and appealable.

export const POST_TYPES = [
  { id: "discussion", label: "Discussion" },
  { id: "experience", label: "Interview experience" },
  { id: "journal", label: "Learning journal" },
];

export const ROUND_TYPES = ["Online assessment", "Phone screen", "Technical", "System design", "Behavioural", "Hiring manager", "HR", "Other"];
export const OUTCOMES = [
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" },
  { id: "pending", label: "Pending" },
  { id: "withdrew", label: "Withdrew" },
  { id: "undisclosed", label: "Not disclosed" },
];
export const REPORT_REASONS = [
  { id: "spam", label: "Spam or advertising" },
  { id: "harassment", label: "Harassment or hate" },
  { id: "confidential", label: "Confidential or personal information" },
  { id: "off-topic", label: "Off-topic" },
  { id: "other", label: "Something else" },
];

export const MAX_REPLY_DEPTH = 3;
export const MAX_LINKS = 5;

/* ── validation & redaction ────────────────────────────────────────────── */

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
// International numbers need a "+"; bare 10-digit mobile-style numbers start
// 6–9. Plain large numbers in DSA talk ("n ≤ 1000000000") are left alone.
const PHONE = /\+\d{1,3}[\s-]?\d[\d\s-]{6,13}\d|\b[6-9]\d{9}\b/g;

/** Strip emails and phone numbers; returns { text, count }. */
export function redactContacts(text) {
  let count = 0;
  const out = String(text || "")
    .replace(EMAIL, () => { count += 1; return "[email removed]"; })
    .replace(PHONE, () => { count += 1; return "[phone removed]"; });
  return { text: out, count };
}

export const countLinks = (text) => (String(text || "").match(/https?:\/\/\S+/gi) || []).length;

export function validatePost(draft, existingPosts = []) {
  const errors = [];
  if (String(draft.title || "").trim().length < 8) errors.push("Give the post a title of at least 8 characters.");
  if (String(draft.body || "").trim().length < 30 && draft.type !== "experience") errors.push("Write at least a few sentences (30+ characters).");
  if (countLinks(draft.body) > MAX_LINKS) errors.push(`Posts can include at most ${MAX_LINKS} links.`);
  const fingerprint = `${String(draft.title).trim().toLowerCase()}|${String(draft.body).trim().toLowerCase()}`;
  if (existingPosts.some((post) => post.id !== draft.id && `${post.title.trim().toLowerCase()}|${post.body.trim().toLowerCase()}` === fingerprint)) errors.push("This looks identical to an existing post.");
  if (draft.type === "experience") errors.push(...validateExperience(draft.experience || {}));
  return errors;
}

export function validateExperience(exp) {
  const errors = [];
  if (!String(exp.company || "").trim()) errors.push("Which company was it?");
  if (!String(exp.role || "").trim()) errors.push("Which role did you interview for?");
  if (exp.month && !/^\d{4}-\d{2}$/.test(exp.month)) errors.push("Use the month picker for the interview date.");
  const rounds = exp.rounds || [];
  if (!rounds.length) errors.push("Add at least one round.");
  rounds.forEach((round, index) => {
    if (!round.type) errors.push(`Round ${index + 1} needs a type.`);
    if (String(round.summary || "").trim().length < 15) errors.push(`Describe round ${index + 1} in your own words (15+ characters).`);
    // null means "not disclosed" — distinct from zero, which is invalid.
    if (round.durationMinutes != null && !(round.durationMinutes > 0)) errors.push(`Round ${index + 1}: leave duration blank if you'd rather not say.`);
  });
  if (!exp.consent) errors.push("Confirm the experience is yours and contains no confidential material.");
  return errors;
}

/* ── ranking ───────────────────────────────────────────────────────────── */

export const scoreOf = (targetId, votes) => votes[targetId] || 0;

/** Idempotent: voting the same way twice removes the vote; switching replaces it. */
export function applyVote(votes, targetId, direction) {
  const current = votes[targetId] || 0;
  const next = current === direction ? 0 : direction;
  const copy = { ...votes };
  if (next) copy[targetId] = next; else delete copy[targetId];
  return copy;
}

const liveComments = (post) => (post.comments || []).filter((comment) => comment.status !== "removed");

export function sortPosts(posts, mode, votes, now = Date.now()) {
  const list = [...posts];
  const age = (post) => Math.max(0, (now - new Date(post.createdAt).getTime()) / 3600000);
  const trending = (post) => (scoreOf(post.id, votes) + liveComments(post).length * 2 + 1) / (age(post) + 2) ** 1.5;
  const by = {
    recent: (a, b) => b.createdAt.localeCompare(a.createdAt),
    top: (a, b) => scoreOf(b.id, votes) - scoreOf(a.id, votes) || b.createdAt.localeCompare(a.createdAt),
    discussed: (a, b) => liveComments(b).length - liveComments(a).length || b.createdAt.localeCompare(a.createdAt),
    trending: (a, b) => trending(b) - trending(a) || b.createdAt.localeCompare(a.createdAt),
  }[mode] || ((a, b) => b.createdAt.localeCompare(a.createdAt));
  return list.sort(by);
}

/**
 * Nest comments by parentId. Replies deeper than MAX_REPLY_DEPTH attach to
 * their deepest allowed ancestor so a thread can't march off the screen.
 */
export function buildThread(comments) {
  const byId = new Map(comments.map((comment) => [comment.id, { ...comment, replies: [] }]));
  const depthOf = (comment) => {
    let depth = 0;
    let cursor = comment;
    while (cursor?.parentId && byId.has(cursor.parentId)) { depth += 1; cursor = byId.get(cursor.parentId); }
    return depth;
  };
  const roots = [];
  [...byId.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt)).forEach((comment) => {
    let parent = comment.parentId ? byId.get(comment.parentId) : null;
    while (parent && depthOf(parent) >= MAX_REPLY_DEPTH - 1) parent = parent.parentId ? byId.get(parent.parentId) : null;
    if (parent) parent.replies.push(comment); else roots.push(comment);
  });
  return roots;
}

/* ── moderation ────────────────────────────────────────────────────────── */

export function makeReport({ id, targetType, targetId, postId, reason, note, snapshot }, now = new Date().toISOString()) {
  return { id, targetType, targetId, postId, reason, note: String(note || "").trim(), snapshot: String(snapshot || "").slice(0, 280), createdAt: now, status: "open", log: [{ at: now, action: "reported" }] };
}

/** Moderator decision. Upheld hides the target; every decision is logged. */
export function resolveReport(report, decision, rationale, now = new Date().toISOString()) {
  if (!["upheld", "dismissed"].includes(decision)) throw new Error("Decide upheld or dismissed.");
  if (!String(rationale || "").trim()) throw new Error("Record a reason — it's shown to the author.");
  return { ...report, status: decision, rationale: rationale.trim(), resolvedAt: now, log: [...report.log, { at: now, action: decision, rationale: rationale.trim() }] };
}

export function appealReport(report, text, now = new Date().toISOString()) {
  if (report.status !== "upheld") throw new Error("Only an upheld report can be appealed.");
  if (report.appeal) throw new Error("This decision has already been appealed.");
  return { ...report, status: "open", appeal: { text: String(text || "").trim(), at: now }, log: [...report.log, { at: now, action: "appealed" }] };
}

/** Apply a resolved report to the post/comment it targets. */
export function applyModeration(posts, report) {
  const hidden = report.status === "upheld";
  return posts.map((post) => {
    if (report.targetType === "post" && post.id === report.targetId) return { ...post, status: hidden ? "hidden" : "published" };
    if (report.targetType === "comment" && post.id === report.postId) {
      return { ...post, comments: post.comments.map((comment) => (comment.id === report.targetId ? { ...comment, status: hidden ? "hidden" : "published" } : comment)) };
    }
    return post;
  });
}

export const displayAuthor = (entry) => (entry.anonymous ? "Anonymous" : entry.authorName || "Member");

/* ── portability ───────────────────────────────────────────────────────── */

export function exportPosts(posts) {
  return { format: "dsa-prep-community", version: 1, exportedAt: new Date().toISOString(), posts: posts.filter((post) => post.status === "published").map(({ authorId, ...post }) => ({ ...post, authorName: post.anonymous ? null : post.authorName })) };
}

export function importPosts(payload, existingIds, makeId) {
  if (!payload || payload.format !== "dsa-prep-community" || !Array.isArray(payload.posts)) throw new Error("This file isn't a community export.");
  return payload.posts
    .filter((post) => post && typeof post.title === "string" && typeof post.body === "string" && !existingIds.has(post.id))
    .map((post) => ({ ...post, id: post.id || makeId(), authorId: "imported", imported: true, status: "published", comments: (post.comments || []).map((comment) => ({ ...comment, authorId: "imported" })) }));
}
