import React, { useMemo, useState } from "react";
import { ChevronsDownUp, ChevronsUpDown, Layers, Search, X } from "lucide-react";
import { useLearnerState } from "../prep/learner";
import { LEVELS } from "./practiceData";
import { GroupedProblemList, LevelProgress, PracticeHero, useOpenGroups } from "./ProblemTable";

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "todo", label: "To do" },
  { id: "solved", label: "Solved" },
  { id: "saved", label: "Saved" },
];

/**
 * A sheet or a track, laid out like the Problems page: heading and level
 * progress, then a toolbar and the grouped problem list. `groups` is
 * `[{ key, title, subtitle, sections: [{ title, entries }] }]` where each
 * entry is `{ problem, tag?, video?, countsTowardProgress? }` or `{ item }`
 * for a lesson / an item that isn't in the practice set. `onWatchLesson(path)`,
 * when given, adds a "watch first" strip of Visual Learning intros to each
 * section whose problems practise one pattern.
 */
export default function CollectionView({ crumbs, title, description, features, actions, notice, groups, initialOpen, openProblem, onWatchLesson }) {
  const learner = useLearnerState();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [levels, setLevels] = useState([]);
  const open = useOpenGroups(initialOpen ?? groups.slice(0, 1).map((group) => group.key));

  const problems = useMemo(() => {
    const seen = new Map();
    groups.forEach((group) => group.sections.forEach((section) => section.entries.forEach((entry) => {
      if (entry.problem && entry.countsTowardProgress !== false) seen.set(entry.problem.id, entry.problem);
    })));
    return [...seen.values()];
  }, [groups]);

  const needle = query.trim().toLowerCase();
  const filtering = Boolean(needle) || status !== "all" || levels.length > 0;
  const matches = (entry) => {
    const title = entry.problem?.title || entry.item?.title || "";
    if (needle && !title.toLowerCase().includes(needle)) return false;
    if (!entry.problem) return status === "all" && !levels.length;
    if (levels.length && !levels.includes(entry.problem.difficulty)) return false;
    if (status === "todo") return !learner.completed.has(entry.problem.id);
    if (status === "solved") return learner.completed.has(entry.problem.id);
    if (status === "saved") return learner.bookmarks.has(entry.problem.id);
    return true;
  };
  const visibleGroups = groups
    .map((group) => ({ ...group, sections: group.sections.map((section) => ({ ...section, visible: section.entries.filter(matches) })).filter((section) => section.visible.length) }))
    .filter((group) => group.sections.length);
  const toggleLevel = (level) => setLevels((list) => (list.includes(level) ? list.filter((item) => item !== level) : [...list, level]));
  const clear = () => { setQuery(""); setStatus("all"); setLevels([]); };

  return (
    <div className="dsa-practice">
      <div className="dpx-main">
        <PracticeHero
          crumbs={crumbs}
          title={title}
          description={description}
          features={features}
          actions={actions}
          aside={<LevelProgress problems={problems} learner={learner} label="Progress" />}
        />
        {notice}

        <div className="dpx-toolbar">
          <label className="dpx-search">
            <Search size={15} />
            <span className="sr-only">Search {title}</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this list" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}
          </label>
          <div className="dpx-toolbar-actions">
            <div className="dpx-chips" role="group" aria-label="Status">
              {STATUS_FILTERS.map((entry) => <button type="button" key={entry.id} aria-pressed={status === entry.id} className={`dpx-chip ${status === entry.id ? "is-active" : ""}`} onClick={() => setStatus(entry.id)}>{entry.label}</button>)}
            </div>
            <div className="dpx-chips" role="group" aria-label="Difficulty">
              {LEVELS.map((level) => <button type="button" key={level} aria-pressed={levels.includes(level)} className={`dpx-chip ${levels.includes(level) ? "is-active" : ""}`} onClick={() => toggleLevel(level)}>{level}</button>)}
            </div>
            <button type="button" className="dpx-icon-btn" onClick={() => open.openAll(groups.map((group) => group.key))} aria-label="Expand all" title="Expand all"><ChevronsUpDown size={15} /></button>
            <button type="button" className="dpx-icon-btn" onClick={open.closeAll} aria-label="Collapse all" title="Collapse all"><ChevronsDownUp size={15} /></button>
          </div>
        </div>

        {visibleGroups.length ? (
          <GroupedProblemList groups={visibleGroups} learner={learner} openProblem={openProblem} forceOpen={filtering} openKeys={open.openKeys} onToggle={open.toggle} onWatchLesson={onWatchLesson} />
        ) : (
          <div className="dpx-table-wrap">
            <div className="dpx-empty">
              <Layers size={22} />
              <b>Nothing matches these filters</b>
              <p>Clear the search or pick a different status.</p>
              <button type="button" className="dpx-link" onClick={clear}>Clear filters</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
