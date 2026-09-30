import { grant } from "../habit";
import { KEYS } from "../keys";
import { applyModeration, applyVote, appealReport, makeReport, redactContacts, resolveReport } from "../lib/community";
import { RULES } from "../lib/rewards";
import { readStore, uid, updateStore } from "../lib/store";

/**
 * Publish a validated draft. Contact details are redacted from every free-text
 * field before it's stored; the caller shows how many were removed.
 */
export function publishPost(draft, authorName) {
  let removed = 0;
  const clean = (text) => { const result = redactContacts(text); removed += result.count; return result.text; };
  const now = new Date().toISOString();
  const experience = draft.type === "experience" ? {
    ...draft.experience,
    company: draft.experience.company.trim(),
    role: draft.experience.role.trim(),
    tips: clean(draft.experience.tips || ""),
    rounds: draft.experience.rounds.map((round) => ({ ...round, summary: clean(round.summary), topics: (round.topics || []).map((topic) => topic.trim()).filter(Boolean) })),
  } : null;
  const post = {
    id: uid("post"),
    type: draft.type,
    title: clean(draft.title.trim()),
    body: clean(draft.body.trim()),
    tags: draft.tags,
    anonymous: Boolean(draft.anonymous),
    authorId: "me",
    authorName,
    experience,
    status: "published",
    createdAt: now,
    updatedAt: now,
    comments: [],
  };
  updateStore(KEYS.posts, [], (posts) => [post, ...posts]);
  grant("first_post", "first", RULES.first_post.points());
  return { post, removed };
}

export function addComment(postId, { parentId = null, body, anonymous, authorName }) {
  const { text } = redactContacts(body.trim());
  const comment = { id: uid("cmt"), parentId, body: text, anonymous: Boolean(anonymous), authorId: "me", authorName, createdAt: new Date().toISOString(), status: "published" };
  updateStore(KEYS.posts, [], (posts) => posts.map((post) => (post.id === postId ? { ...post, comments: [...post.comments, comment] } : post)));
}

/** Authors remove their own words; the thread keeps a placeholder so replies still make sense. */
export function removeOwnComment(postId, commentId) {
  updateStore(KEYS.posts, [], (posts) => posts.map((post) => (post.id === postId ? { ...post, comments: post.comments.map((comment) => (comment.id === commentId && comment.authorId === "me" ? { ...comment, status: "removed", body: "" } : comment)) } : post)));
}

export function removeOwnPost(postId) {
  updateStore(KEYS.posts, [], (posts) => posts.filter((post) => !(post.id === postId && post.authorId === "me")));
}

export const vote = (targetId, direction) => updateStore(KEYS.votes, {}, (votes) => applyVote(votes, targetId, direction));

export function fileReport(fields) {
  const existing = readStore(KEYS.reports, []).find((report) => report.targetId === fields.targetId && report.status === "open");
  if (existing) return existing;
  const report = makeReport({ id: uid("rpt"), ...fields });
  updateStore(KEYS.reports, [], (reports) => [report, ...reports]);
  return report;
}

export function decideReport(reportId, decision, rationale) {
  let decided = null;
  updateStore(KEYS.reports, [], (reports) => reports.map((report) => {
    if (report.id !== reportId) return report;
    decided = resolveReport(report, decision, rationale);
    return decided;
  }));
  if (decided) updateStore(KEYS.posts, [], (posts) => applyModeration(posts, decided));
  return decided;
}

export function appeal(reportId, text) {
  updateStore(KEYS.reports, [], (reports) => reports.map((report) => (report.id === reportId ? appealReport(report, text) : report)));
}
