import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowUp, ArrowDown, Building2, CalendarDays, Clock3, Flag, Link2, MessageSquare, Reply, Trash2 } from "lucide-react";
import { problemBySlug } from "../catalog";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { relativeTime } from "../lib/dates";
import { OUTCOMES, POST_TYPES, REPORT_REASONS, buildThread, displayAuthor, scoreOf } from "../lib/community";
import { Badge, ConfirmButton, Dialog, Field, Panel, PrepPage } from "../ui";
import { addComment, fileReport, removeOwnComment, removeOwnPost, vote } from "./communityStore";
import { safeMarkdown } from "./markdown";

const outcomeLabel = (id) => OUTCOMES.find((entry) => entry.id === id)?.label || "Not disclosed";

export function VoteButtons({ targetId, votes, compact = false }) {
  const mine = votes[targetId] || 0;
  return (
    <div className={`dsp-votes${compact ? " is-compact" : ""}`}>
      <button type="button" className={mine === 1 ? "is-up" : ""} onClick={() => vote(targetId, 1)} aria-pressed={mine === 1} aria-label="Upvote"><ArrowUp size={14} /></button>
      <b>{scoreOf(targetId, votes)}</b>
      <button type="button" className={mine === -1 ? "is-down" : ""} onClick={() => vote(targetId, -1)} aria-pressed={mine === -1} aria-label="Downvote"><ArrowDown size={14} /></button>
    </div>
  );
}

export function ReportDialog({ target, onClose }) {
  const [reason, setReason] = useState("spam");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  if (!target) return null;
  return (
    <Dialog open title={`Report this ${target.targetType}`} description="Reports go to the moderation queue with a snapshot of the content. The author sees the decision and can appeal it once." onClose={onClose}
      footer={sent ? <button type="button" className="dsp-btn is-primary" onClick={onClose}>Done</button> : <><button type="button" className="dsp-btn is-quiet" onClick={onClose}>Cancel</button><button type="button" className="dsp-btn is-primary" onClick={() => { fileReport({ ...target, reason, note }); setSent(true); }}>Send report</button></>}
    >
      {sent ? <p>Thanks — it's in the queue. An unpopular opinion alone isn't a reason to remove something; moderators look for rule breaks.</p> : (
        <>
          <div className="dsp-stack" role="radiogroup" aria-label="Reason">
            {REPORT_REASONS.map((entry) => <label key={entry.id} className="dsp-check"><input type="radio" name="report-reason" checked={reason === entry.id} onChange={() => setReason(entry.id)} /> {entry.label}</label>)}
          </div>
          <Field label="Details (optional)"><textarea className="dsp-textarea" value={note} onChange={(event) => setNote(event.target.value)} /></Field>
        </>
      )}
    </Dialog>
  );
}

function CommentNode({ comment, postId, onReply, onReport, votes }) {
  const hidden = comment.status === "hidden";
  const removed = comment.status === "removed";
  return (
    <li className="dsp-comment">
      <div className="dsp-comment-head">
        <b>{removed ? "[deleted]" : displayAuthor(comment)}</b>
        <span className="dsp-muted dsp-small">{relativeTime(comment.createdAt)}</span>
      </div>
      <div className="dsp-markdown dsp-comment-body">
        {removed ? <p className="dsp-muted">Removed by its author.</p> : hidden ? <p className="dsp-muted">Hidden by a moderator.</p> : <ReactMarkdown {...safeMarkdown}>{comment.body}</ReactMarkdown>}
      </div>
      {!removed && !hidden && (
        <div className="dsp-row dsp-comment-actions">
          <VoteButtons targetId={comment.id} votes={votes} compact />
          <button type="button" className="dsp-btn is-quiet is-small" onClick={() => onReply(comment)}><Reply size={12} /> Reply</button>
          {comment.authorId === "me"
            ? <ConfirmButton className="dsp-btn is-quiet is-small" confirmLabel="Delete?" onConfirm={() => removeOwnComment(postId, comment.id)}><Trash2 size={12} /> Delete</ConfirmButton>
            : <button type="button" className="dsp-btn is-quiet is-small" onClick={() => onReport(comment)}><Flag size={12} /> Report</button>}
        </div>
      )}
      {comment.replies.length > 0 && <ul className="dsp-comments">{comment.replies.map((reply) => <CommentNode key={reply.id} comment={reply} postId={postId} onReply={onReply} onReport={onReport} votes={votes} />)}</ul>}
    </li>
  );
}

export default function PostView({ post, onBack, openProblem, authorName, onOpenCompany }) {
  const [votes] = useStore(KEYS.votes, {});
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const thread = useMemo(() => buildThread(post.comments), [post.comments]);
  const exp = post.experience;
  const type = POST_TYPES.find((entry) => entry.id === post.type)?.label;

  const send = () => {
    if (!comment.trim()) return;
    addComment(post.id, { parentId: replyTo?.id || null, body: comment, anonymous, authorName });
    setComment("");
    setReplyTo(null);
  };

  return (
    <PrepPage
      eyebrow={`Community · ${type}`}
      title={post.title}
      description={`${displayAuthor(post)} · ${relativeTime(post.createdAt)}${post.imported ? " · imported" : ""}`}
      actions={<button type="button" className="dsp-btn is-quiet" onClick={onBack}><ArrowLeft size={15} /> Back</button>}
    >
      {post.status === "hidden" && <div className="dsp-notice is-warning"><Flag size={16} /><span>This post was hidden by a moderator. Only you can see it here. Check My posts › Reports for the reason and to appeal.</span></div>}
      <div className="dsp-grid split">
        <div className="dsp-stack">
          {exp && (
            <Panel title={`${exp.company} · ${exp.role}`} subtitle="Self-reported by the author — not verified." actions={<button type="button" className="dsp-btn is-small" onClick={() => onOpenCompany(exp.company)}><Building2 size={13} /> Company page</button>}>
              <div className="dsp-row dsp-exp-meta">
                <Badge tone={exp.outcome === "offer" ? "success" : exp.outcome === "rejected" ? "danger" : "neutral"}>{outcomeLabel(exp.outcome)}</Badge>
                {exp.month && <Badge><CalendarDays size={11} /> {exp.month}</Badge>}
                <Badge>{exp.mode}</Badge>
                {exp.difficulty && <Badge tone="warning">Difficulty {exp.difficulty}/5</Badge>}
              </div>
              <ol className="dsp-rounds">
                {exp.rounds.map((round, index) => (
                  <li key={index}>
                    <header><b>Round {index + 1} · {round.type}</b><span className="dsp-muted dsp-small"><Clock3 size={11} /> {round.durationMinutes ? `${round.durationMinutes} min` : "duration not disclosed"} · {outcomeLabel(round.outcome)}</span></header>
                    {round.topics.length > 0 && <div className="dsp-chips">{round.topics.map((topic) => <Badge key={topic} tone="info">{topic}</Badge>)}</div>}
                    <p>{round.summary}</p>
                    {round.problems.length > 0 && <div className="dsp-row">{round.problems.map((slug) => <button type="button" key={slug} className="dsp-btn is-small is-quiet" onClick={() => openProblem(slug)}><Link2 size={12} /> {problemBySlug.get(slug)?.title || slug}</button>)}</div>}
                  </li>
                ))}
              </ol>
              {exp.tips && <><h3 className="dsp-wizard-sub">Tips</h3><p className="dsp-pre">{exp.tips}</p></>}
            </Panel>
          )}
          {post.body && <Panel><div className="dsp-markdown"><ReactMarkdown {...safeMarkdown}>{post.body}</ReactMarkdown></div></Panel>}
          <div className="dsp-row">
            <VoteButtons targetId={post.id} votes={votes} />
            {post.tags.map((tag) => <Badge key={tag}>#{tag}</Badge>)}
            <span className="dsp-grow" />
            {post.authorId === "me"
              ? <ConfirmButton className="dsp-btn is-small is-danger" confirmLabel="Delete post?" onConfirm={() => { removeOwnPost(post.id); onBack(); }}><Trash2 size={13} /> Delete</ConfirmButton>
              : <button type="button" className="dsp-btn is-small is-quiet" onClick={() => setReportTarget({ targetType: "post", targetId: post.id, postId: post.id, snapshot: `${post.title} — ${post.body}` })}><Flag size={13} /> Report</button>}
          </div>

          <Panel title={`Comments (${post.comments.filter((entry) => entry.status === "published").length})`} actions={<MessageSquare size={16} className="dsp-muted" />}>
            <div className="dsp-stack">
              {replyTo && <div className="dsp-notice"><Reply size={14} /><span>Replying to {displayAuthor(replyTo)} <button type="button" className="dsp-link" onClick={() => setReplyTo(null)}>cancel</button></span></div>}
              <textarea className="dsp-textarea" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add to the discussion — be kind and specific." aria-label="Comment" />
              <div className="dsp-row"><label className="dsp-check"><input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} /> Anonymous</label><span className="dsp-grow" /><button type="button" className="dsp-btn is-primary is-small" disabled={!comment.trim()} onClick={send}>{replyTo ? "Reply" : "Comment"}</button></div>
              {thread.length ? <ul className="dsp-comments">{thread.map((entry) => <CommentNode key={entry.id} comment={entry} postId={post.id} votes={votes} onReply={setReplyTo} onReport={(target) => setReportTarget({ targetType: "comment", targetId: target.id, postId: post.id, snapshot: target.body })} />)}</ul> : <p className="dsp-muted dsp-small">No comments yet.</p>}
            </div>
          </Panel>
        </div>
        <aside className="dsp-stack">
          <Panel title="About this post">
            <dl className="dsp-kv">
              <div><dt>Type</dt><dd>{type}</dd></div>
              <div><dt>Author</dt><dd>{displayAuthor(post)}</dd></div>
              <div><dt>Posted</dt><dd>{new Date(post.createdAt).toLocaleDateString()}</dd></div>
              <div><dt>Replies</dt><dd>{post.comments.length}</dd></div>
            </dl>
            <p className="dsp-muted dsp-small">Anonymous posts hide the author's name from everyone reading; contact details are stripped on publish.</p>
          </Panel>
        </aside>
      </div>
      <ReportDialog target={reportTarget} onClose={() => setReportTarget(null)} />
    </PrepPage>
  );
}
