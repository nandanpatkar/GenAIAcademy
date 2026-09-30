import React, { useMemo, useRef, useState } from "react";
import { AlertTriangle, Database, Download, Eye, EyeOff, Globe, HardDrive, Link2, Plus, Trash2, Upload, UserRound, X } from "lucide-react";
import { categories, problemBySlug } from "../catalog";
import { useHabitSummary } from "../habit";
import Heatmap, { activityCounts } from "../Heatmap";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { useLearnerState } from "../learner";
import { achievementStats, evaluateAchievements, titleFor } from "../lib/rewards";
import { categoryOf } from "../lib/problems";
import { LEGACY_KEYS, listOwnedKeys, removeKeys, writeRaw } from "../lib/store";
import { Badge, ConfirmButton, Field, Panel, PrepPage, Progress, downloadFile, readFileText } from "../ui";

// Fields that can appear on the public card. Everything is off until switched on.
const PUBLIC_FIELDS = [
  ["bio", "Bio"],
  ["targetRole", "Target role"],
  ["skills", "Skills (from solved patterns)"],
  ["stats", "Solved, streak and coins"],
  ["achievements", "Achievements"],
  ["links", "Coding profiles"],
  ["projects", "Projects"],
];

const EXPORT_FORMAT = "dsa-prep-backup";

export function exportAllData() {
  const data = {};
  listOwnedKeys().forEach((key) => {
    try { const raw = window.localStorage.getItem(key); data[key] = raw; } catch { /* skip */ }
  });
  return { format: EXPORT_FORMAT, version: 1, exportedAt: new Date().toISOString(), keys: data };
}

const bytes = (value) => (value < 1024 ? `${value} B` : value < 1048576 ? `${(value / 1024).toFixed(1)} KB` : `${(value / 1048576).toFixed(2)} MB`);

export default function Profile({ displayName, displayEmail }) {
  const [profile, setProfile] = useStore(KEYS.profile, {});
  const habit = useHabitSummary();
  const learner = useLearnerState();
  const [linkDraft, setLinkDraft] = useState({ label: "", url: "" });
  const [projectDraft, setProjectDraft] = useState({ title: "", url: "" });
  const [importState, setImportState] = useState({ payload: null, error: "", done: "" });
  const fileRef = useRef(null);
  const visible = profile.visible || {};
  const set = (patch) => setProfile((prev) => ({ ...prev, ...patch }));
  const toggleVisible = (field) => set({ visible: { ...visible, [field]: !visible[field] } });

  const skills = useMemo(() => {
    const byCategory = new Map();
    learner.completed.forEach((slug) => {
      const problem = problemBySlug.get(slug);
      if (problem) byCategory.set(categoryOf(problem), (byCategory.get(categoryOf(problem)) || 0) + 1);
    });
    return categories.map((category) => {
      const total = new Set(category.patterns.flatMap((pattern) => pattern.problems)).size;
      return { name: category.title, solved: byCategory.get(category.title) || 0, total };
    }).filter((entry) => entry.solved > 0).sort((a, b) => b.solved / b.total - a.solved / a.total);
  }, [learner.completed]);

  const achievements = useMemo(() => evaluateAchievements(achievementStats({ completed: learner.completed, recalled: learner.recalled, submissions: habit.submissions, ledger: habit.ledger, categories, problemBySlug })).filter((entry) => entry.earned), [habit.ledger, habit.submissions, learner.completed, learner.recalled]);
  const counts = useMemo(() => activityCounts(habit.submissions, habit.ledger), [habit.ledger, habit.submissions]);

  const handle = profile.handle || displayName || "Learner";
  const publicCard = {
    format: "dsa-prep-public-profile",
    version: 1,
    handle,
    ...(visible.bio && profile.bio ? { bio: profile.bio } : {}),
    ...(visible.targetRole && profile.targetRole ? { targetRole: profile.targetRole } : {}),
    ...(visible.skills ? { skills: skills.slice(0, 8).map((entry) => ({ area: entry.name, solved: entry.solved, of: entry.total })) } : {}),
    ...(visible.stats ? { solved: learner.completed.size, streak: habit.streak.current, coins: habit.points.total, title: titleFor(habit.points.total) } : {}),
    ...(visible.achievements ? { achievements: achievements.map((entry) => entry.title) } : {}),
    ...(visible.links && profile.links?.length ? { links: profile.links.map((link) => ({ ...link, note: "self-reported, not verified" })) } : {}),
    ...(visible.projects && profile.projects?.length ? { projects: profile.projects } : {}),
    generatedAt: new Date().toISOString(),
  };

  const owned = listOwnedKeys();
  // localStorage holds UTF-16, so two bytes per character.
  const used = owned.reduce((sum, key) => {
    let raw = "";
    try { raw = window.localStorage.getItem(key) || ""; } catch { /* unavailable */ }
    return sum + (key.length + raw.length) * 2;
  }, 0);

  const pickImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const payload = JSON.parse(await readFileText(file));
      if (payload?.format !== EXPORT_FORMAT || typeof payload.keys !== "object") throw new Error("That file isn't a DSA prep backup.");
      const unsafe = Object.keys(payload.keys).filter((key) => !(key.startsWith("dsa_prep_v1:") || Object.values(LEGACY_KEYS).includes(key) || key.startsWith("dsa_workspace_code_") || key.startsWith("dsa_workspace_tabs_") || key.startsWith("leetcode_custom_cases_")));
      if (unsafe.length) throw new Error(`The backup contains keys this hub doesn't own (${unsafe.slice(0, 3).join(", ")}), so it wasn't loaded.`);
      setImportState({ payload, error: "", done: "" });
    } catch (error) {
      setImportState({ payload: null, error: error.message, done: "" });
    }
  };

  const applyImport = (mode) => {
    const { payload } = importState;
    if (mode === "replace") removeKeys(listOwnedKeys());
    Object.entries(payload.keys).forEach(([key, raw]) => {
      if (mode === "merge" && window.localStorage.getItem(key) != null) return;
      try { writeRaw(key, JSON.parse(raw)); } catch { try { window.localStorage.setItem(key, raw); } catch { /* skip */ } }
    });
    window.dispatchEvent(new Event("leetcode-progress"));
    setImportState({ payload: null, error: "", done: mode === "replace" ? "Backup restored — everything now matches the file." : "Merged — existing data was kept; only missing items were added." });
  };

  return (
    <PrepPage
      eyebrow="Account"
      title="Profile & data"
      description="Your private settings, an opt-in public card, and everything this hub stores — which you can export, restore or delete at any time."
    >
      <div className="dsp-grid split">
        <div className="dsp-stack">
          <Panel title="Profile" subtitle="Private unless you switch a field on for the public card.">
            <div className="dsp-grid cols-2">
              <Field label="Handle" hint="Shown on community posts and your scorecard."><input className="dsp-input" value={profile.handle ?? ""} onChange={(event) => set({ handle: event.target.value.slice(0, 40) })} placeholder={displayName} /></Field>
              <Field label="Target role"><input className="dsp-input" value={profile.targetRole ?? ""} onChange={(event) => set({ targetRole: event.target.value })} placeholder="SDE-1, backend intern…" /></Field>
            </div>
            <Field label="Bio"><textarea className="dsp-textarea" value={profile.bio ?? ""} onChange={(event) => set({ bio: event.target.value.slice(0, 400) })} placeholder="What you're working towards" /></Field>
            <dl className="dsp-kv">
              <div><dt>Account email</dt><dd>{displayEmail || "Not signed in"} <Badge>private</Badge></dd></div>
              <div><dt>Time zone</dt><dd>{Intl.DateTimeFormat().resolvedOptions().timeZone} · streaks and daily challenges use local days</dd></div>
            </dl>
          </Panel>

          <Panel title="Coding profiles" subtitle="Self-reported links — shown as such; ownership isn't verified.">
            <ul className="dsp-list">{(profile.links || []).map((link, index) => <li key={`${link.url}-${index}`} className="dsp-list-row"><span className="dsp-list-icon"><Link2 size={14} /></span><div><b>{link.label}</b><small>{link.url}</small></div><button type="button" className="dsp-icon-btn" onClick={() => set({ links: profile.links.filter((_, i) => i !== index) })} aria-label={`Remove ${link.label}`}><X size={14} /></button></li>)}</ul>
            <form className="dsp-row" onSubmit={(event) => { event.preventDefault(); if (!/^https?:\/\//i.test(linkDraft.url) || !linkDraft.label.trim()) return; set({ links: [...(profile.links || []), { label: linkDraft.label.trim(), url: linkDraft.url.trim() }] }); setLinkDraft({ label: "", url: "" }); }}>
              <input className="dsp-input dsp-grow" value={linkDraft.label} onChange={(event) => setLinkDraft((prev) => ({ ...prev, label: event.target.value }))} placeholder="GitHub, LeetCode…" aria-label="Link label" />
              <input className="dsp-input dsp-grow" value={linkDraft.url} onChange={(event) => setLinkDraft((prev) => ({ ...prev, url: event.target.value }))} placeholder="https://…" aria-label="Link URL" />
              <button type="submit" className="dsp-btn" disabled={!linkDraft.label.trim() || !/^https?:\/\//i.test(linkDraft.url)}><Plus size={14} /> Add</button>
            </form>
          </Panel>

          <Panel title="Projects">
            <ul className="dsp-list">{(profile.projects || []).map((project, index) => <li key={`${project.title}-${index}`} className="dsp-list-row"><div><b>{project.title}</b><small>{project.url || "No link"}</small></div><button type="button" className="dsp-icon-btn" onClick={() => set({ projects: profile.projects.filter((_, i) => i !== index) })} aria-label={`Remove ${project.title}`}><X size={14} /></button></li>)}</ul>
            <form className="dsp-row" onSubmit={(event) => { event.preventDefault(); if (!projectDraft.title.trim()) return; set({ projects: [...(profile.projects || []), { title: projectDraft.title.trim(), url: projectDraft.url.trim() }] }); setProjectDraft({ title: "", url: "" }); }}>
              <input className="dsp-input dsp-grow" value={projectDraft.title} onChange={(event) => setProjectDraft((prev) => ({ ...prev, title: event.target.value }))} placeholder="Project name" aria-label="Project name" />
              <input className="dsp-input dsp-grow" value={projectDraft.url} onChange={(event) => setProjectDraft((prev) => ({ ...prev, url: event.target.value }))} placeholder="Link (optional)" aria-label="Project link" />
              <button type="submit" className="dsp-btn" disabled={!projectDraft.title.trim()}><Plus size={14} /> Add</button>
            </form>
          </Panel>

          <Panel title="Activity" subtitle="Submissions, reviews and finished tests over the last year.">
            <Heatmap counts={counts} weeks={52} />
          </Panel>

          <Panel title="Skills" subtitle="Derived from the problems you've solved, by module.">
            {skills.length ? <div className="dsp-stack">{skills.map((entry) => <Progress key={entry.name} value={entry.solved} max={entry.total} label={entry.name} />)}</div> : <p className="dsp-muted dsp-small">Solve problems to see your strongest areas here.</p>}
          </Panel>
        </div>

        <aside className="dsp-stack">
          <Panel title="Public card" subtitle="Nothing is public by default. Switch fields on, then download the card to share it." actions={<Globe size={16} className="dsp-muted" />}>
            <ul className="dsp-visibility">
              {PUBLIC_FIELDS.map(([field, label]) => (
                <li key={field}>
                  <span>{label}</span>
                  <button type="button" className={`dsp-btn is-small${visible[field] ? " is-active" : ""}`} aria-pressed={Boolean(visible[field])} onClick={() => toggleVisible(field)}>{visible[field] ? <><Eye size={12} /> Shown</> : <><EyeOff size={12} /> Hidden</>}</button>
                </li>
              ))}
            </ul>
            <pre className="dsp-json-preview">{JSON.stringify(publicCard, null, 2)}</pre>
            <button type="button" className="dsp-btn" onClick={() => downloadFile(`profile-${handle.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`, JSON.stringify(publicCard, null, 2))}><Download size={14} /> Download public card</button>
          </Panel>

          <Panel title="Your data" subtitle="Everything lives in this browser." actions={<HardDrive size={16} className="dsp-muted" />}>
            <dl className="dsp-kv">
              <div><dt>Stored items</dt><dd>{owned.length}</dd></div>
              <div><dt>Approx. size</dt><dd>{bytes(used)}</dd></div>
            </dl>
            <div className="dsp-stack">
              <button type="button" className="dsp-btn" onClick={() => downloadFile(`dsa-prep-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(exportAllData(), null, 2))}><Download size={14} /> Export everything</button>
              <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={pickImport} />
              <button type="button" className="dsp-btn" onClick={() => fileRef.current?.click()}><Upload size={14} /> Restore from a backup</button>
              {importState.error && <div className="dsp-notice is-danger" role="alert"><AlertTriangle size={16} /><span>{importState.error}</span></div>}
              {importState.done && <div className="dsp-notice" role="status"><Database size={16} /><span>{importState.done}</span></div>}
              {importState.payload && (
                <div className="dsp-notice is-warning">
                  <Database size={16} />
                  <div className="dsp-stack">
                    <span>Backup from {new Date(importState.payload.exportedAt).toLocaleString()} with {Object.keys(importState.payload.keys).length} items.</span>
                    <div className="dsp-row">
                      <button type="button" className="dsp-btn is-small" onClick={() => applyImport("merge")}>Merge (keep mine)</button>
                      <ConfirmButton className="dsp-btn is-small is-danger" confirmLabel="Replace all data?" onConfirm={() => applyImport("replace")}>Replace</ConfirmButton>
                      <button type="button" className="dsp-btn is-small is-quiet" onClick={() => setImportState({ payload: null, error: "", done: "" })}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
              <ConfirmButton className="dsp-btn is-danger" confirmLabel="Delete everything? Export first!" onConfirm={() => { removeKeys(listOwnedKeys()); window.dispatchEvent(new Event("leetcode-progress")); }}><Trash2 size={14} /> Delete all hub data</ConfirmButton>
              <p className="dsp-muted dsp-small"><UserRound size={12} /> Deleting removes progress, notes, lists, code, plans, posts and settings from this browser — including AI from Scratch progress, which the main sidebar's viewer shares. It can't be undone.</p>
            </div>
          </Panel>
        </aside>
      </div>
    </PrepPage>
  );
}
