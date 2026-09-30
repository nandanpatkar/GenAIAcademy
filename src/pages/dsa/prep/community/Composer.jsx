import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AlertTriangle, ArrowLeft, Eye, Link2, Plus, Save, Send, Trash2, X } from "lucide-react";
import { problemBySlug, problems } from "../catalog";
import { useAutosave, useStore } from "../hooks";
import { KEYS } from "../keys";
import { OUTCOMES, POST_TYPES, ROUND_TYPES, validatePost } from "../lib/community";
import { normalizeTags } from "../lib/notes";
import { writeStore } from "../lib/store";
import { Field, Panel, PrepPage, Tabs } from "../ui";
import { publishPost } from "./communityStore";
import { safeMarkdown } from "./markdown";

const blankRound = () => ({ type: "Technical", durationMinutes: null, topics: [], summary: "", problems: [], outcome: "undisclosed" });
export const blankDraft = (type = "discussion") => ({
  type, title: "", body: "", tags: [], anonymous: false,
  experience: { company: "", role: "", level: "", location: "", month: "", mode: "virtual", outcome: "undisclosed", difficulty: null, rounds: [blankRound()], tips: "", consent: false },
});

function ProblemPicker({ selected, onChange }) {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => (query.trim() ? problems.filter((problem) => problem.title.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6) : []), [query]);
  return (
    <div className="dsp-stack">
      <div className="dsp-chips">
        {selected.map((slug) => <span key={slug} className="dsp-link-chip"><Link2 size={11} /> {problemBySlug.get(slug)?.title || slug}<button type="button" onClick={() => onChange(selected.filter((entry) => entry !== slug))} aria-label="Remove linked problem"><X size={11} /></button></span>)}
      </div>
      <input className="dsp-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Link a similar practice problem (optional)" aria-label="Link a practice problem" />
      {matches.length > 0 && <div className="dsp-chips">{matches.map((problem) => <button type="button" key={problem.slug} className="dsp-chip" onClick={() => { onChange([...new Set([...selected, problem.slug])]); setQuery(""); }}><Plus size={11} /> {problem.title}</button>)}</div>}
    </div>
  );
}

export default function Composer({ initialType, onCancel, onPublished, authorName, existingPosts }) {
  const [saved, setSaved] = useStore(KEYS.postDraft, null);
  // An unfinished draft always wins over the entry point's default type, so
  // starting from another tab can never overwrite it.
  const [draft, setDraft] = useState(() => saved || blankDraft(initialType || "discussion"));
  const [view, setView] = useState("write");
  const [errors, setErrors] = useState([]);
  const [tagText, setTagText] = useState(draft.tags.join(", "));
  const set = (patch) => setDraft((prev) => ({ ...prev, ...patch }));
  const setExp = (patch) => setDraft((prev) => ({ ...prev, experience: { ...prev.experience, ...patch } }));
  const setRound = (index, patch) => setExp({ rounds: draft.experience.rounds.map((round, i) => (i === index ? { ...round, ...patch } : round)) });

  // Drafts survive navigation and reloads.
  useAutosave(draft, (value) => writeStore(KEYS.postDraft, value), 700);

  const publish = () => {
    const withTags = { ...draft, tags: normalizeTags(tagText) };
    const problemsFound = validatePost(withTags, existingPosts);
    setErrors(problemsFound);
    if (problemsFound.length) return;
    const { post, removed } = publishPost(withTags, authorName);
    setSaved(null);
    onPublished(post, removed);
  };

  const isExperience = draft.type === "experience";

  return (
    <PrepPage
      eyebrow="Community"
      title={isExperience ? "Share an interview experience" : "New post"}
      description={isExperience ? "Structured details make your experience searchable and feed the company pages. Paraphrase questions in your own words — don't paste confidential material or interviewers' names." : "Markdown works. Your draft is saved as you type."}
      actions={<button type="button" className="dsp-btn is-quiet" onClick={onCancel}><ArrowLeft size={15} /> Back</button>}
    >
      <Panel className="dsp-stack">
        <div className="dsp-chips" aria-label="Post type">{POST_TYPES.map((type) => <button type="button" key={type.id} className={`dsp-chip${draft.type === type.id ? " is-active" : ""}`} aria-pressed={draft.type === type.id} onClick={() => set({ type: type.id })}>{type.label}</button>)}</div>
        <Field label="Title"><input className="dsp-input" value={draft.title} onChange={(event) => set({ title: event.target.value })} placeholder={isExperience ? "e.g. Acme SDE-1 — four rounds, graphs heavy" : "What's on your mind?"} /></Field>

        {isExperience && (
          <div className="dsp-stack dsp-exp-form">
            <div className="dsp-grid cols-3">
              <Field label="Company"><input className="dsp-input" value={draft.experience.company} onChange={(event) => setExp({ company: event.target.value })} /></Field>
              <Field label="Role"><input className="dsp-input" value={draft.experience.role} onChange={(event) => setExp({ role: event.target.value })} placeholder="SDE-1, Intern…" /></Field>
              <Field label="Interview month"><input type="month" className="dsp-input" value={draft.experience.month} onChange={(event) => setExp({ month: event.target.value })} /></Field>
              <Field label="Format"><select className="dsp-select" value={draft.experience.mode} onChange={(event) => setExp({ mode: event.target.value })}><option value="virtual">Virtual</option><option value="onsite">On-site</option><option value="hybrid">Hybrid</option></select></Field>
              <Field label="Outcome"><select className="dsp-select" value={draft.experience.outcome} onChange={(event) => setExp({ outcome: event.target.value })}>{OUTCOMES.map((outcome) => <option key={outcome.id} value={outcome.id}>{outcome.label}</option>)}</select></Field>
              <Field label="Difficulty (your view)"><select className="dsp-select" value={draft.experience.difficulty ?? ""} onChange={(event) => setExp({ difficulty: event.target.value ? Number(event.target.value) : null })}><option value="">Not saying</option>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} — {["very easy", "easy", "moderate", "hard", "very hard"][value - 1]}</option>)}</select></Field>
            </div>
            <h3 className="dsp-wizard-sub">Rounds</h3>
            {draft.experience.rounds.map((round, index) => (
              <div key={index} className="dsp-round">
                <header><b>Round {index + 1}</b>{draft.experience.rounds.length > 1 && <button type="button" className="dsp-icon-btn" onClick={() => setExp({ rounds: draft.experience.rounds.filter((_, i) => i !== index) })} aria-label={`Remove round ${index + 1}`}><Trash2 size={14} /></button>}</header>
                <div className="dsp-grid cols-3">
                  <Field label="Type"><select className="dsp-select" value={round.type} onChange={(event) => setRound(index, { type: event.target.value })}>{ROUND_TYPES.map((type) => <option key={type}>{type}</option>)}</select></Field>
                  <Field label="Duration (minutes)" hint="Leave blank if you'd rather not say."><input type="number" min={1} className="dsp-input" value={round.durationMinutes ?? ""} onChange={(event) => setRound(index, { durationMinutes: event.target.value === "" ? null : Number(event.target.value) })} /></Field>
                  <Field label="Round outcome"><select className="dsp-select" value={round.outcome} onChange={(event) => setRound(index, { outcome: event.target.value })}>{OUTCOMES.map((outcome) => <option key={outcome.id} value={outcome.id}>{outcome.label}</option>)}</select></Field>
                </div>
                <Field label="Topics" hint="Comma separated — e.g. graphs, sliding window, system design basics."><input className="dsp-input" value={round.topics.join(", ")} onChange={(event) => setRound(index, { topics: event.target.value.split(",").map((topic) => topic.trimStart()) })} /></Field>
                <Field label="What happened" hint="Summarise in your own words; don't reproduce confidential questions verbatim."><textarea className="dsp-textarea" value={round.summary} onChange={(event) => setRound(index, { summary: event.target.value })} /></Field>
                <ProblemPicker selected={round.problems} onChange={(next) => setRound(index, { problems: next })} />
              </div>
            ))}
            <button type="button" className="dsp-btn is-small" onClick={() => setExp({ rounds: [...draft.experience.rounds, blankRound()] })}><Plus size={13} /> Add round</button>
            <Field label="Tips for others (optional)"><textarea className="dsp-textarea" value={draft.experience.tips} onChange={(event) => setExp({ tips: event.target.value })} /></Field>
          </div>
        )}

        <Tabs value={view} onChange={setView} options={[{ id: "write", label: isExperience ? "Anything else" : "Write" }, { id: "preview", label: "Preview", icon: Eye }]} />
        {view === "write"
          ? <textarea className="dsp-textarea dsp-post-body" value={draft.body} onChange={(event) => set({ body: event.target.value })} placeholder={isExperience ? "Preparation, overall impressions, what you'd do differently (optional)…" : "Markdown supported."} aria-label="Post body" />
          : <div className="dsp-markdown dsp-note-preview">{draft.body.trim() ? <ReactMarkdown {...safeMarkdown}>{draft.body}</ReactMarkdown> : <p className="dsp-muted">Nothing to preview.</p>}</div>}
        <Field label="Tags" hint="Comma separated, up to 12."><input className="dsp-input" value={tagText} onChange={(event) => setTagText(event.target.value)} placeholder="graphs, dp, internship" /></Field>
        <label className="dsp-check"><input type="checkbox" checked={draft.anonymous} onChange={(event) => set({ anonymous: event.target.checked })} /> Post anonymously — your name is hidden on the post</label>
        {isExperience && <label className="dsp-check"><input type="checkbox" checked={draft.experience.consent} onChange={(event) => setExp({ consent: event.target.checked })} /> This is my own experience and it contains no confidential or personal information</label>}

        {errors.length > 0 && <div className="dsp-notice is-danger" role="alert"><AlertTriangle size={16} /><ul className="dsp-error-list">{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
        <footer className="dsp-row dsp-wizard-foot">
          <span className="dsp-muted dsp-small"><Save size={12} /> Draft saved on this device. Emails and phone numbers are removed when you publish.</span>
          <div className="dsp-row">
            <button type="button" className="dsp-btn is-quiet" onClick={() => { setSaved(null); setDraft(blankDraft(draft.type)); setTagText(""); }}>Discard draft</button>
            <button type="button" className="dsp-btn is-primary" onClick={publish}><Send size={14} /> Publish</button>
          </div>
        </footer>
      </Panel>
    </PrepPage>
  );
}
