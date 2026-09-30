import React, { useMemo, useRef, useState } from "react";
import { Building2, Download, Flag, Gavel, Info, MessageSquare, PenSquare, Upload, UsersRound } from "lucide-react";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { relativeTime } from "../lib/dates";
import { OUTCOMES, POST_TYPES, REPORT_REASONS, displayAuthor, exportPosts, importPosts, sortPosts } from "../lib/community";
import { uid, updateStore } from "../lib/store";
import { Badge, EmptyState, Field, Panel, PrepPage, SearchInput, Tabs, downloadFile, readFileText } from "../ui";
import Composer from "./Composer";
import PostView, { VoteButtons } from "./PostView";
import { appeal, decideReport } from "./communityStore";
import { excerpt } from "./markdown";

const SORTS = [{ id: "trending", label: "Trending" }, { id: "recent", label: "Recent" }, { id: "top", label: "Top" }, { id: "discussed", label: "Most discussed" }];
const typeLabel = (id) => POST_TYPES.find((entry) => entry.id === id)?.label;
const reasonLabel = (id) => REPORT_REASONS.find((entry) => entry.id === id)?.label || id;

function PostCard({ post, votes, onOpen }) {
  const exp = post.experience;
  const comments = post.comments.filter((comment) => comment.status === "published").length;
  return (
    <article className="dsp-post-tile">
      <VoteButtons targetId={post.id} votes={votes} compact />
      <button type="button" className="dsp-post-main" onClick={onOpen}>
        <div className="dsp-row"><Badge tone={post.type === "experience" ? "info" : post.type === "journal" ? "accent" : "neutral"}>{typeLabel(post.type)}</Badge>{post.status === "hidden" && <Badge tone="warning">Hidden</Badge>}{post.imported && <Badge>Imported</Badge>}</div>
        <h3>{post.title}</h3>
        {exp && <p className="dsp-post-exp"><Building2 size={12} /> {exp.company} · {exp.role} · {OUTCOMES.find((entry) => entry.id === exp.outcome)?.label} · {exp.rounds.length} round{exp.rounds.length === 1 ? "" : "s"}</p>}
        {post.body && <p className="dsp-post-excerpt">{excerpt(post.body)}</p>}
        <footer><span>{displayAuthor(post)}</span><span>{relativeTime(post.createdAt)}</span><span><MessageSquare size={12} /> {comments}</span>{post.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}</footer>
      </button>
    </article>
  );
}

function ModerationQueue({ reports, posts }) {
  const [rationale, setRationale] = useState({});
  const [error, setError] = useState("");
  const open = reports.filter((report) => report.status === "open");
  const decide = (report, decision) => {
    try { decideReport(report.id, decision, rationale[report.id] || ""); setError(""); } catch (err) { setError(err.message); }
  };
  return (
    <div className="dsp-stack">
      <div className="dsp-notice"><Gavel size={16} /><span>This community lives on this device, so you're its moderator. Decisions need a written reason, are logged, and can be appealed once.</span></div>
      {error && <p className="dsp-error" role="alert">{error}</p>}
      {open.length ? open.map((report) => {
        const post = posts.find((entry) => entry.id === report.postId);
        return (
          <Panel key={report.id} title={`${reasonLabel(report.reason)} · ${report.targetType}`} subtitle={`Reported ${relativeTime(report.createdAt)}${report.appeal ? " · appealed by the author" : ""}${post ? ` · on “${post.title}”` : ""}`}>
            <blockquote className="dsp-snapshot">{report.snapshot || "(no text)"}</blockquote>
            {report.note && <p className="dsp-small">Reporter's note: {report.note}</p>}
            {report.appeal && <p className="dsp-small">Appeal: {report.appeal.text}</p>}
            <Field label="Reason for your decision (shown to the author)"><input className="dsp-input" value={rationale[report.id] || ""} onChange={(event) => setRationale((prev) => ({ ...prev, [report.id]: event.target.value }))} /></Field>
            <div className="dsp-row">
              <button type="button" className="dsp-btn is-small is-danger" onClick={() => decide(report, "upheld")}>Uphold — hide it</button>
              <button type="button" className="dsp-btn is-small" onClick={() => decide(report, "dismissed")}>Dismiss — keep it</button>
            </div>
          </Panel>
        );
      }) : <EmptyState compact icon={Gavel} title="Queue is clear" body="Nothing waiting for a decision." />}
      {reports.filter((report) => report.status !== "open").length > 0 && (
        <Panel title="Decision log">
          <ul className="dsp-list">{reports.filter((report) => report.status !== "open").map((report) => <li key={report.id} className="dsp-list-row"><div><b>{report.status === "upheld" ? "Upheld" : "Dismissed"} · {reasonLabel(report.reason)}</b><small>{report.rationale} · {relativeTime(report.resolvedAt)}</small></div></li>)}</ul>
        </Panel>
      )}
    </div>
  );
}

function MyReports({ reports, posts }) {
  const [appealText, setAppealText] = useState({});
  const mineHidden = reports.filter((report) => report.status === "upheld" && (posts.find((post) => post.id === report.postId)?.authorId === "me"));
  return mineHidden.length ? (
    <div className="dsp-stack">
      {mineHidden.map((report) => (
        <Panel key={report.id} title={`Your ${report.targetType} was hidden`} subtitle={`${reasonLabel(report.reason)} · ${relativeTime(report.resolvedAt)}`}>
          <p className="dsp-small">Moderator's reason: <b>{report.rationale}</b></p>
          {report.appeal ? <p className="dsp-muted dsp-small">You appealed on {new Date(report.appeal.at).toLocaleDateString()}.</p> : (
            <div className="dsp-row">
              <input className="dsp-input dsp-grow" value={appealText[report.id] || ""} onChange={(event) => setAppealText((prev) => ({ ...prev, [report.id]: event.target.value }))} placeholder="Why should this be restored?" aria-label="Appeal" />
              <button type="button" className="dsp-btn is-small" disabled={!(appealText[report.id] || "").trim()} onClick={() => appeal(report.id, appealText[report.id])}>Appeal</button>
            </div>
          )}
        </Panel>
      ))}
    </div>
  ) : <EmptyState compact icon={Flag} title="Nothing of yours has been moderated" />;
}

export default function Community({ section, params, openProblem, navigate, displayName }) {
  const [posts] = useStore(KEYS.posts, []);
  const [votes] = useStore(KEYS.votes, {});
  const [reports] = useStore(KEYS.reports, []);
  const [profile] = useStore(KEYS.profile, {});
  const [draft] = useStore(KEYS.postDraft, null);
  const [sort, setSort] = useState("trending");
  const [type, setType] = useState(section === "experiences" ? "experience" : "all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(params?.postId || "");
  const [composing, setComposing] = useState(false);
  const [mineTab, setMineTab] = useState("posts");
  const [flash, setFlash] = useState("");
  const [importError, setImportError] = useState("");
  const fileRef = useRef(null);
  const authorName = profile.handle || displayName || "Member";

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = posts.filter((post) => (section === "my-posts" ? post.authorId === "me" : post.status === "published")
      && (type === "all" || post.type === type)
      && (!needle || `${post.title} ${post.body} ${post.tags.join(" ")} ${post.experience?.company || ""} ${post.experience?.role || ""}`.toLowerCase().includes(needle)));
    return sortPosts(list, section === "my-posts" ? "recent" : sort, votes);
  }, [posts, query, section, sort, type, votes]);

  const open = posts.find((post) => post.id === openId);
  if (composing) {
    return <Composer initialType={section === "experiences" ? "experience" : "discussion"} authorName={authorName} existingPosts={posts} onCancel={() => setComposing(false)} onPublished={(post, removed) => { setComposing(false); setOpenId(post.id); setFlash(removed ? `Published. ${removed} contact detail${removed === 1 ? " was" : "s were"} removed.` : "Published."); }} />;
  }
  if (open) {
    return (
      <>
        {flash && <div className="dsp-flash" role="status">{flash}</div>}
        <PostView post={open} onBack={() => { setOpenId(""); setFlash(""); }} openProblem={openProblem} authorName={authorName} onOpenCompany={(company) => navigate("companies", { company })} />
      </>
    );
  }

  const importFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const imported = importPosts(JSON.parse(await readFileText(file)), new Set(posts.map((post) => post.id)), () => uid("post"));
      updateStore(KEYS.posts, [], (list) => [...imported, ...list]);
      setImportError("");
      setFlash(`Imported ${imported.length} post${imported.length === 1 ? "" : "s"}.`);
    } catch (error) { setImportError(error.message); }
  };

  const title = { community: "Community", experiences: "Interview experiences", "my-posts": "My posts" }[section];
  const description = {
    community: "Discussions, interview experiences and learning journals.",
    experiences: "Structured, first-hand interview write-ups — company, role, rounds, topics. They power the company pages. Every one is self-reported and unverified.",
    "my-posts": "Everything you've written, your draft, and any moderation decisions about your posts.",
  }[section];

  return (
    <PrepPage
      eyebrow="Community"
      title={title}
      description={description}
      actions={(
        <>
          {section === "experiences" && <button type="button" className="dsp-btn" onClick={() => navigate("companies")}><Building2 size={14} /> Companies</button>}
          <button type="button" className="dsp-btn is-primary" onClick={() => setComposing(true)}><PenSquare size={14} /> {draft ? "Continue draft" : section === "experiences" ? "Share an experience" : "New post"}</button>
        </>
      )}
    >
      {flash && <div className="dsp-flash" role="status">{flash}</div>}
      <div className="dsp-notice"><UsersRound size={16} /><span><b>Local community.</b> This hub has no shared server, so posts live on this device. Export them to share with your study group and import theirs — imported posts are marked as such. <span className="dsp-row dsp-inline-actions"><button type="button" className="dsp-link" onClick={() => downloadFile("community-posts.json", JSON.stringify(exportPosts(posts.filter((post) => post.authorId === "me")), null, 2))}><Download size={12} /> Export mine</button><input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importFile} /><button type="button" className="dsp-link" onClick={() => fileRef.current?.click()}><Upload size={12} /> Import</button></span></span></div>
      {importError && <div className="dsp-notice is-danger" role="alert"><Info size={16} /><span>{importError}</span></div>}

      {section === "my-posts" && <Tabs value={mineTab} onChange={setMineTab} options={[{ id: "posts", label: "Posts", count: posts.filter((post) => post.authorId === "me").length }, { id: "moderation", label: "Moderation queue", count: reports.filter((report) => report.status === "open").length }, { id: "decisions", label: "Decisions about me" }]} />}

      {section === "my-posts" && mineTab === "moderation" && <ModerationQueue reports={reports} posts={posts} />}
      {section === "my-posts" && mineTab === "decisions" && <MyReports reports={reports} posts={posts} />}

      {(section !== "my-posts" || mineTab === "posts") && (
        <>
          <div className="dsp-toolbar">
            <SearchInput value={query} onChange={setQuery} placeholder={section === "experiences" ? "Search company, role, topic" : "Search posts"} />
            {section !== "my-posts" && <Tabs value={sort} onChange={setSort} options={SORTS} label="Sort" />}
            {section === "community" && <div className="dsp-chips">{[{ id: "all", label: "All" }, ...POST_TYPES].map((entry) => <button type="button" key={entry.id} className={`dsp-chip${type === entry.id ? " is-active" : ""}`} aria-pressed={type === entry.id} onClick={() => setType(entry.id)}>{entry.label}</button>)}</div>}
          </div>
          {section === "my-posts" && draft && <div className="dsp-notice"><PenSquare size={16} /><span>You have an unpublished draft: <b>{draft.title || "untitled"}</b>. <button type="button" className="dsp-link" onClick={() => setComposing(true)}>Continue it</button></span></div>}
          {visible.length ? (
            <div className="dsp-post-list">{visible.map((post) => <PostCard key={post.id} post={post} votes={votes} onOpen={() => setOpenId(post.id)} />)}</div>
          ) : (
            <Panel><EmptyState icon={MessageSquare} title={section === "experiences" ? "No interview experiences yet" : section === "my-posts" ? "You haven't posted yet" : "Nothing here yet"} body={section === "experiences" ? "Share one of yours, or import a file from your study group." : "Start the conversation."} action={<button type="button" className="dsp-btn" onClick={() => setComposing(true)}><PenSquare size={14} /> Write something</button>} /></Panel>
          )}
        </>
      )}
      {section === "my-posts" && mineTab === "posts" && posts.some((post) => post.authorId === "me" && post.status === "hidden") && <p className="dsp-muted dsp-small">Hidden posts are visible only to you here. See “Decisions about me” to appeal.</p>}
    </PrepPage>
  );
}
