import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Bookmark,
  ChevronDown,
  Clapperboard,
  CircleCheck,
  CircleDashed,
  CircleDot,
  Code2,
  ExternalLink,
  FileText,
  Flame,
  PlayCircle,
  Users,
} from "lucide-react";
import { LEVELS } from "./practiceData";
import visualLinks from "../../../data/practice/visualLinks.json";
import { useLegacyValue } from "../prep/hooks";
import { LEGACY_KEYS } from "../prep/lib/store";
import { patternForProblems } from "../prep/lib/visual";
import "../../../styles/DsaPractice.css";
import "../../../styles/DsaVisual.css";

/**
 * The problem list used everywhere a set of practice problems is shown —
 * Problems, Zero to Hero 450 and the other tracks, and every Prep Hub sheet —
 * so they share one row design, one set of columns and one type scale.
 */

export const levelClass = (level) => String(level || "").toLowerCase();

function StatusIcon({ solved, attempted }) {
  if (solved) return <CircleCheck size={17} className="dpx-status is-solved" aria-label="Solved" />;
  if (attempted) return <CircleDot size={17} className="dpx-status is-attempted" aria-label="Attempted" />;
  return <CircleDashed size={17} className="dpx-status" aria-label="Not solved" />;
}

/**
 * One problem. `problem` is a practice row; `item` carries the sheet/track
 * extras (a tag, a video link) when the row is part of one.
 */
export function ProblemRow({ problem, learner, openProblem, pinned = false, tag = "", video = "", numbered = true }) {
  const solved = learner.completed.has(problem.id);
  const saved = learner.bookmarks.has(problem.id);
  const [firstTopic, ...moreTopics] = problem.topics || [];
  const stop = (handler) => (event) => { event.stopPropagation(); handler(); };
  return (
    <tr className={pinned ? "is-potd" : ""} onClick={() => openProblem(problem.id)}>
      <td className="dpx-cell-first">
        <div className="dpx-cell-problem">
          <button type="button" className="dpx-status-btn" onClick={stop(() => learner.toggleCompleted(problem.id))} aria-pressed={solved} aria-label={`Mark ${problem.title} as ${solved ? "not solved" : "solved"}`} title={solved ? "Solved · click to unmark" : "Mark solved"}>
            <StatusIcon solved={solved} attempted={learner.attempted.has(problem.id)} />
          </button>
          <div className="dpx-title-wrap">
            <button type="button" className="dpx-title" onClick={stop(() => openProblem(problem.id))} title={problem.title}>
              {numbered && problem.n ? `${problem.n}. ` : ""}{problem.title}
            </button>
            {(pinned || tag) && (
              <span className="dpx-title-tags">
                {pinned && <span className="dpx-potd-badge"><Flame size={11} /> POTD</span>}
                {tag && <span className="dpx-row-tag">{tag}</span>}
              </span>
            )}
            <span className="dpx-inline-topics">{(problem.topics || []).slice(0, 2).join(" · ")}</span>
          </div>
        </div>
      </td>
      <td className="dpx-cell-center dpx-col-level"><span className={`dpx-level ${levelClass(problem.difficulty)}`}>{problem.difficulty}</span></td>
      <td className="dpx-cell-center dpx-col-topics">
        {firstTopic && <span className="dpx-topic" title={firstTopic}>{firstTopic}</span>}
        {moreTopics.length > 0 && <span className="dpx-more" title={moreTopics.join(", ")}>+{moreTopics.length}</span>}
      </td>
      <td className="dpx-cell-center dpx-col-resources">
        <span className="dpx-resources">
          <button type="button" className={problem.editorial ? "is-on" : ""} disabled={!problem.editorial} title={problem.editorial ? "Editorial and reference solution" : "No editorial yet"} aria-label="Open the editorial" onClick={stop(() => openProblem(problem.id, { tab: "solution" }))}><FileText size={15} /></button>
          <button type="button" className={problem.peers ? "is-on" : ""} disabled={!problem.peers} title={problem.peers ? `${problem.peers} peer solutions` : "No peer solutions"} aria-label="Open peer solutions" onClick={stop(() => openProblem(problem.id, { tab: "peers" }))}><Users size={15} /></button>
          <span className={problem.judge ? "is-on" : problem.runnable ? "is-half" : ""} title={problem.judge ? "Run and submit with a verdict" : problem.runnable ? "Run shows your output (no verdict yet)" : "Read only — no runnable tests"}><Code2 size={15} /></span>
          {visualLinks.byProblem[problem.id]
            ? <button type="button" className="is-on is-visual" title="Animated Visual Learning lesson" aria-label={`Watch the visual lesson for ${problem.title}`} onClick={stop(() => openProblem(problem.id, { tab: "visualize" }))}><Clapperboard size={15} /></button>
            : <span title="No visual lesson"><Clapperboard size={15} /></span>}
          {video
            ? <a className="is-on" href={video} target="_blank" rel="noopener noreferrer" title="Video walkthrough" aria-label={`Watch the video for ${problem.title}`} onClick={(event) => event.stopPropagation()}><PlayCircle size={15} /></a>
            : <span className={problem.video ? "is-on" : ""} title={problem.video ? "Video walkthrough (in the Solution tab)" : "No video"}><PlayCircle size={15} /></span>}
        </span>
      </td>
      <td className="dpx-cell-center dpx-col-save">
        <button type="button" className={`dpx-bookmark${saved ? " is-saved" : ""}`} aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${problem.title}`} onClick={stop(() => learner.toggleBookmark(problem.id))}>
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
        </button>
      </td>
    </tr>
  );
}

/** A lesson (article or video) in a sheet — read, not solved. */
function LessonRow({ item }) {
  return (
    <tr className="is-lesson">
      <td className="dpx-cell-first" colSpan={4}>
        <div className="dpx-cell-problem">
          <span className="dpx-status-btn" aria-hidden="true"><BookOpen size={16} className="dpx-status" /></span>
          <div className="dpx-title-wrap"><span className="dpx-title is-static">{item.title}</span><span className="dpx-inline-topics is-always">Lesson{item.minutes ? ` · ${item.minutes} min` : ""}</span></div>
        </div>
      </td>
      <td className="dpx-cell-center dpx-col-save">
        {item.video && <a className="dpx-bookmark" href={item.video} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${item.title}`}><PlayCircle size={16} /></a>}
      </td>
    </tr>
  );
}

/** A sheet item that isn't in the practice set: opens where it lives. */
function ExternalRow({ item }) {
  const href = item.lc ? `https://leetcode.com/problems/${item.lc}/` : "";
  return (
    <tr className="is-external">
      <td className="dpx-cell-first">
        <div className="dpx-cell-problem">
          <span className="dpx-status-btn" aria-hidden="true"><CircleDashed size={17} className="dpx-status" /></span>
          <div className="dpx-title-wrap">
            {href ? <a className="dpx-title" href={href} target="_blank" rel="noopener noreferrer">{item.title}</a> : <span className="dpx-title is-static">{item.title}</span>}
            <span className="dpx-inline-topics is-always">{href ? "Opens on LeetCode" : "Not in the practice set yet"}</span>
          </div>
        </div>
      </td>
      <td className="dpx-cell-center dpx-col-level">{item.difficulty && <span className={`dpx-level ${levelClass(item.difficulty)}`}>{item.difficulty}</span>}</td>
      <td className="dpx-cell-center dpx-col-topics" />
      <td className="dpx-cell-center dpx-col-resources" />
      <td className="dpx-cell-center dpx-col-save">{href && <a className="dpx-bookmark" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.title} on LeetCode`}><ExternalLink size={15} /></a>}</td>
    </tr>
  );
}

function TableHead() {
  return (
    <thead>
      <tr>
        <th scope="col">Problem</th>
        <th scope="col" className="dpx-col-level">Difficulty</th>
        <th scope="col" className="dpx-col-topics">Topics</th>
        <th scope="col" className="dpx-col-resources">Resources</th>
        <th scope="col" className="dpx-col-save"><span className="sr-only">Save</span></th>
      </tr>
    </thead>
  );
}

/** Rows are either `{ problem, tag?, video? }` or a sheet item without a problem. */
function Rows({ entries, learner, openProblem, numbered }) {
  return entries.map((entry, index) => {
    // Sheets repeat problems across sections; position keeps keys unique.
    const key = `${entry.problem?.id || entry.item?.title}-${index}`;
    if (entry.problem) return <ProblemRow key={key} problem={entry.problem} learner={learner} openProblem={openProblem} pinned={entry.pinned} tag={entry.tag} video={entry.video} numbered={numbered} />;
    if (entry.item?.kind === "practice") return <ExternalRow key={key} item={entry.item} />;
    return <LessonRow key={key} item={entry.item} />;
  });
}

/** A flat problem table (the Problems page). */
export function ProblemTable({ entries, learner, openProblem, empty, footer, numbered = true }) {
  return (
    <div className="dpx-table-wrap">
      <table className="dpx-table">
        <TableHead />
        <tbody><Rows entries={entries} learner={learner} openProblem={openProblem} numbered={numbered} /></tbody>
      </table>
      {!entries.length && empty}
      {footer}
    </div>
  );
}

const doneOf = (entries, learner) => {
  const problems = entries.filter((entry) => entry.problem && entry.countsTowardProgress !== false);
  return { done: problems.filter((entry) => learner.completed.has(entry.problem.id)).length, total: problems.length };
};

/**
 * A sheet or track: collapsible groups (steps / modules), each with sections,
 * each section a problem table. Groups open while filtering.
 */
/** The Visual Learning pattern a section of problems practises (see lib/visual). */
const sectionPattern = (entries) => patternForProblems(visualLinks, entries.filter((entry) => entry.problem).map((entry) => entry.problem.id));

function VisualIntroStrip({ pattern, watched, onWatch }) {
  return (
    <div className="dsv-intro-strip">
      <span><Clapperboard size={12} /> Watch first · {pattern.title}</span>
      {pattern.intros.slice(0, 3).map(({ path, title }) => (
        <button type="button" key={path} className={watched.has(path) ? "is-watched" : ""} onClick={() => onWatch(path)}>
          {watched.has(path) ? <CircleCheck size={11} /> : <PlayCircle size={11} />} {title}
        </button>
      ))}
    </div>
  );
}

export function GroupedProblemList({ groups, learner, openProblem, forceOpen = false, openKeys, onToggle, onWatchLesson }) {
  const watchedList = useLegacyValue(LEGACY_KEYS.visualRead, []);
  const watched = useMemo(() => new Set(Array.isArray(watchedList) ? watchedList : []), [watchedList]);
  return (
    <div className="dpx-groups">
      {groups.map((group, index) => {
        const all = group.sections.flatMap((section) => section.entries);
        const progress = doneOf(all, learner);
        const open = forceOpen || openKeys.has(group.key);
        return (
          <section key={group.key} className={`dpx-group${open ? " is-open" : ""}`}>
            <button type="button" className="dpx-group-head" aria-expanded={open} onClick={() => onToggle(group.key)}>
              <span className="dpx-group-index">{String(group.index ?? index + 1).padStart(2, "0")}</span>
              <span className="dpx-group-copy"><b>{group.title}</b>{group.subtitle && <small>{group.subtitle}</small>}</span>
              <span className="dpx-group-progress">
                <span>{progress.done} / {progress.total}</span>
                <span className="dpx-bar"><span style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }} /></span>
              </span>
              <ChevronDown size={17} className="dpx-group-chevron" />
            </button>
            {open && group.sections.map((section) => {
              const sectionProgress = doneOf(section.entries, learner);
              const pattern = onWatchLesson ? sectionPattern(section.entries) : null;
              return (
                <div key={section.key || section.title} className="dpx-group-section">
                  {group.sections.length > 1 || section.title !== group.title ? (
                    <header>
                      <h3>{section.title}</h3>
                      {sectionProgress.total > 0 && <span className={sectionProgress.done === sectionProgress.total ? "is-done" : ""}>{sectionProgress.done}/{sectionProgress.total}</span>}
                    </header>
                  ) : null}
                  {pattern && <VisualIntroStrip pattern={pattern} watched={watched} onWatch={onWatchLesson} />}
                  <div className="dpx-table-wrap is-flat">
                    <table className="dpx-table">
                      <TableHead />
                      <tbody><Rows entries={section.visible || section.entries} learner={learner} openProblem={openProblem} numbered={false} /></tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}

/** Open/closed state for grouped lists, with expand/collapse-all. */
export function useOpenGroups(initial) {
  const [openKeys, setOpenKeys] = useState(() => new Set(initial));
  return {
    openKeys,
    toggle: (key) => setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    }),
    openAll: (keys) => setOpenKeys(new Set(keys)),
    closeAll: () => setOpenKeys(new Set()),
  };
}

/** Overall and per-level progress card, as on the Problems page. */
export function LevelProgress({ problems, learner, label = "Your Progress", unit = "problems solved" }) {
  const stats = useMemo(() => {
    const byLevel = Object.fromEntries(LEVELS.map((level) => {
      const list = problems.filter((problem) => problem.difficulty === level);
      return [level, { total: list.length, done: list.filter((problem) => learner.completed.has(problem.id)).length }];
    }));
    const done = LEVELS.reduce((sum, level) => sum + byLevel[level].done, 0);
    return { byLevel, done, total: problems.length };
  }, [learner.completed, problems]);
  const percent = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;
  return (
    <section className="dpx-progress" aria-label={label}>
      <span className="dpx-progress-label">{label}</span>
      <div className="dpx-progress-card">
        <div className="dpx-progress-total"><b>{percent} %</b><span>{stats.done} / {stats.total} {unit}</span></div>
        <div className="dpx-bar"><span style={{ width: `${percent}%` }} /></div>
        <div className="dpx-progress-levels">
          {LEVELS.map((level) => (
            <div key={level}>
              <span>{level}</span>
              <b>{stats.byLevel[level].done} / {stats.byLevel[level].total}</b>
              <div className={`dpx-bar is-${levelClass(level)}`}><span style={{ width: `${stats.byLevel[level].total ? (stats.byLevel[level].done / stats.byLevel[level].total) * 100 : 0}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Page heading used by the Problems page, sheets and tracks. */
export function PracticeHero({ crumbs, title, description, features, actions, aside }) {
  return (
    <header className="dpx-hero">
      <div className="dpx-hero-copy">
        <nav className="dpx-crumbs" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => (
            <React.Fragment key={crumb.label}>
              {index > 0 && <span aria-hidden="true">/</span>}
              {crumb.onClick ? <button type="button" onClick={crumb.onClick}>{crumb.label}</button> : <b>{crumb.label}</b>}
            </React.Fragment>
          ))}
        </nav>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {features?.length > 0 && <ul className="dpx-features">{features.map(({ icon: Icon, label }) => <li key={label}><Icon size={15} /> {label}</li>)}</ul>}
        {actions && <div className="dpx-hero-actions">{actions}</div>}
      </div>
      {aside}
    </header>
  );
}
