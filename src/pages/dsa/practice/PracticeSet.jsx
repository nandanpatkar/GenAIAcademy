import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bookmark,
  CircleDashed,
  EllipsisVertical,
  Filter,
  Flame,
  Layers,
  Search,
  Shuffle,
  SquareDashedBottomCode,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { todaysChallenge } from "../prep/habit";
import { useLearnerState } from "../prep/learner";
import { LEVELS, practiceProblems, practiceTopics, sheetItems, sheets } from "./practiceData";
import { LevelProgress, PracticeHero, ProblemTable, levelClass } from "./ProblemTable";
import visualLinks from "../../../data/practice/visualLinks.json";

const PAGE = 50;

const RESOURCE_FILTERS = [
  { id: "judge", label: "Judge ready", test: (problem) => problem.judge },
  { id: "video", label: "Video", test: (problem) => problem.video },
  { id: "peers", label: "Peer solutions", test: (problem) => problem.peers > 0 },
  { id: "visual", label: "Visual lesson", test: (problem) => Boolean(visualLinks.byProblem[problem.id]) },
];

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "unsolved", label: "Unsolved" },
  { id: "attempted", label: "Attempted" },
  { id: "solved", label: "Solved" },
];

const sheetMembers = new Map(sheets.filter((sheet) => sheet.available).map((sheet) => [sheet.id, new Set(sheetItems(sheet).map((item) => item.id).filter(Boolean))]));

function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => { if (!ref.current?.contains(event.target)) setOpen(false); };
    const onKey = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);
  return { open, setOpen, ref };
}

/**
 * Problems section: the whole practice set (Code Lab + takeUforward) with
 * progress by level, search, filters, shuffle, and a topic/sheet side panel.
 */
export default function PracticeSet({ query, onQueryChange, savedOnly, onSavedOnlyChange, openProblem }) {
  const learner = useLearnerState();
  const { completed, bookmarks, attempted } = learner;
  const [levels, setLevels] = useState([]);
  const [status, setStatus] = useState("all");
  const [topic, setTopic] = useState("");
  const [sheet, setSheet] = useState("");
  const [resources, setResources] = useState([]);
  const [sidePanel, setSidePanel] = useState("topics");
  const [topicQuery, setTopicQuery] = useState("");
  const [shown, setShown] = useState(PAGE);
  const filterMenu = usePopover();
  const moreMenu = usePopover();
  const sentinelRef = useRef(null);
  const potdId = todaysChallenge();
  const potd = practiceProblems.find((problem) => problem.id === potdId || problem.codelab === potdId);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const members = sheet ? sheetMembers.get(sheet) : null;
    return practiceProblems.filter((problem) => (
      (!needle || `${problem.n || ""} ${problem.title} ${problem.topics.join(" ")} ${problem.patterns.join(" ")}`.toLowerCase().includes(needle))
      && (!levels.length || levels.includes(problem.difficulty))
      && (!topic || problem.topics.includes(topic))
      && (!members || members.has(problem.id))
      && resources.every((id) => RESOURCE_FILTERS.find((filter) => filter.id === id).test(problem))
      && (!savedOnly || bookmarks.has(problem.id))
      && (status === "all"
        || (status === "solved" && completed.has(problem.id))
        || (status === "attempted" && attempted.has(problem.id) && !completed.has(problem.id))
        || (status === "unsolved" && !completed.has(problem.id)))
    ));
  }, [attempted, bookmarks, completed, levels, query, resources, savedOnly, sheet, status, topic]);

  useEffect(() => setShown(PAGE), [levels, query, resources, savedOnly, sheet, status, topic]);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setShown((value) => value + PAGE);
    }, { rootMargin: "400px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [filtered.length]);

  const activeFilterCount = levels.length + resources.length + (status !== "all") + Boolean(topic) + Boolean(sheet);
  const pinPotd = potd && !query && !activeFilterCount && !savedOnly;
  const rows = pinPotd ? filtered.filter((problem) => problem.id !== potd.id) : filtered;
  const entries = [
    ...(pinPotd ? [{ problem: potd, pinned: true }] : []),
    ...rows.slice(0, shown).map((problem) => ({ problem })),
  ];

  const clearFilters = () => { setLevels([]); setStatus("all"); setTopic(""); setSheet(""); setResources([]); onSavedOnlyChange(false); };
  const toggle = (list, setList, value) => setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  const shuffle = () => {
    const pool = filtered.filter((problem) => !completed.has(problem.id));
    const pick = (pool.length ? pool : filtered)[Math.floor(Math.random() * (pool.length || filtered.length))];
    if (pick) openProblem(pick.id);
  };
  const sheetCounts = useMemo(() => sheets.filter((entry) => entry.available).map((entry) => ({ ...entry, count: sheetMembers.get(entry.id)?.size || 0 })), []);
  const topicList = practiceTopics.filter((entry) => !topicQuery || entry.name.toLowerCase().includes(topicQuery.toLowerCase()));

  return (
    <div className="dsa-practice">
      <div className="dpx-layout">
        <div className="dpx-area-hero">
          <PracticeHero
            crumbs={[{ label: "Practice" }, { label: savedOnly ? "Saved" : "DSA" }]}
            title={savedOnly ? "Saved Questions" : "DSA Practice Set"}
            description="Build your problem-solving skills with DSA practice organised by topic, pattern, and sheet. Work through different approaches, revisit challenging problems, and prepare for coding interviews."
            features={[{ icon: Workflow, label: "Pattern Based" }, { icon: Layers, label: "Sheet Mapped" }, { icon: Users, label: "Peer Solutions" }]}
            aside={<LevelProgress problems={practiceProblems} learner={learner} />}
          />
        </div>

        <div className="dpx-main">

          <div className="dpx-toolbar">
            <label className="dpx-search">
              <Search size={15} />
              <span className="sr-only">Search problems</span>
              <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search problems" />
              {query && <button type="button" onClick={() => onQueryChange("")} aria-label="Clear search"><X size={14} /></button>}
            </label>
            <div className="dpx-toolbar-actions">
              <span className="dpx-count">{filtered.length.toLocaleString()} problems</span>
              <div className="dpx-popover-root" ref={filterMenu.ref}>
                <button type="button" className={`dpx-icon-btn${activeFilterCount ? " is-active" : ""}`} aria-haspopup="dialog" aria-expanded={filterMenu.open} onClick={() => filterMenu.setOpen((value) => !value)} aria-label="Filters" title="Filters">
                  <Filter size={15} />{activeFilterCount > 0 && <i>{activeFilterCount}</i>}
                </button>
                {filterMenu.open && (
                  <div className="dpx-popover" role="dialog" aria-label="Filters">
                    <div className="dpx-popover-group"><span>Difficulty</span><div>{LEVELS.map((level) => <button type="button" key={level} aria-pressed={levels.includes(level)} className={`dpx-chip ${levels.includes(level) ? "is-active" : ""}`} onClick={() => toggle(levels, setLevels, level)}>{level}</button>)}</div></div>
                    <div className="dpx-popover-group"><span>Status</span><div>{STATUS_FILTERS.map((entry) => <button type="button" key={entry.id} aria-pressed={status === entry.id} className={`dpx-chip ${status === entry.id ? "is-active" : ""}`} onClick={() => setStatus(entry.id)}>{entry.label}</button>)}</div></div>
                    <div className="dpx-popover-group"><span>Resources</span><div>{RESOURCE_FILTERS.map((entry) => <button type="button" key={entry.id} aria-pressed={resources.includes(entry.id)} className={`dpx-chip ${resources.includes(entry.id) ? "is-active" : ""}`} onClick={() => toggle(resources, setResources, entry.id)}>{entry.label}</button>)}</div></div>
                    <div className="dpx-popover-group"><span>Sheet</span><div><button type="button" aria-pressed={!sheet} className={`dpx-chip ${!sheet ? "is-active" : ""}`} onClick={() => setSheet("")}>Any</button>{sheetCounts.map((entry) => <button type="button" key={entry.id} aria-pressed={sheet === entry.id} className={`dpx-chip ${sheet === entry.id ? "is-active" : ""}`} onClick={() => setSheet(sheet === entry.id ? "" : entry.id)}>{entry.title}</button>)}</div></div>
                    <button type="button" className="dpx-link" onClick={clearFilters}>Clear all filters</button>
                  </div>
                )}
              </div>
              <button type="button" className="dpx-icon-btn" onClick={shuffle} disabled={!filtered.length} aria-label="Open a random unsolved problem" title="Random unsolved problem"><Shuffle size={15} /></button>
              <div className="dpx-popover-root" ref={moreMenu.ref}>
                <button type="button" className="dpx-icon-btn" aria-haspopup="menu" aria-expanded={moreMenu.open} onClick={() => moreMenu.setOpen((value) => !value)} aria-label="More options"><EllipsisVertical size={15} /></button>
                {moreMenu.open && (
                  <div className="dpx-popover is-menu" role="menu">
                    <button type="button" role="menuitemcheckbox" aria-checked={savedOnly} onClick={() => { onSavedOnlyChange(!savedOnly); moreMenu.setOpen(false); }}><Bookmark size={14} /> {savedOnly ? "Show all problems" : "Saved questions only"}</button>
                    <button type="button" role="menuitemcheckbox" aria-checked={status === "unsolved"} onClick={() => { setStatus(status === "unsolved" ? "all" : "unsolved"); moreMenu.setOpen(false); }}><CircleDashed size={14} /> {status === "unsolved" ? "Show solved too" : "Hide solved"}</button>
                    <button type="button" role="menuitem" onClick={() => { clearFilters(); moreMenu.setOpen(false); }}><X size={14} /> Reset filters</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {(activeFilterCount > 0 || savedOnly) && (
            <div className="dpx-active-filters">
              {savedOnly && <button type="button" onClick={() => onSavedOnlyChange(false)}>Saved only <X size={12} /></button>}
              {levels.map((level) => <button type="button" key={level} onClick={() => toggle(levels, setLevels, level)}>{level} <X size={12} /></button>)}
              {status !== "all" && <button type="button" onClick={() => setStatus("all")}>{STATUS_FILTERS.find((entry) => entry.id === status)?.label} <X size={12} /></button>}
              {topic && <button type="button" onClick={() => setTopic("")}>{topic} <X size={12} /></button>}
              {sheet && <button type="button" onClick={() => setSheet("")}>{sheets.find((entry) => entry.id === sheet)?.title} <X size={12} /></button>}
              {resources.map((id) => <button type="button" key={id} onClick={() => toggle(resources, setResources, id)}>{RESOURCE_FILTERS.find((entry) => entry.id === id)?.label} <X size={12} /></button>)}
            </div>
          )}

          <ProblemTable
            entries={entries}
            learner={learner}
            openProblem={openProblem}
            empty={(
              <div className="dpx-empty">
                <SquareDashedBottomCode size={22} />
                <b>No problems match</b>
                <p>Try a different search or clear the filters.</p>
                <button type="button" className="dpx-link" onClick={() => { clearFilters(); onQueryChange(""); }}>Clear search and filters</button>
              </div>
            )}
            footer={shown < rows.length && <div ref={sentinelRef} className="dpx-sentinel">Loading more…</div>}
          />
        </div>

        <aside className="dpx-side" aria-label="Practice shortcuts">
          {potd && (
            <section className="dpx-potd-card">
              <span className="dpx-pill"><Flame size={13} /> Problem of the Day</span>
              <h2>{potd.title}</h2>
              <p>{potd.topics.slice(0, 2).join(" · ")} · <span className={`dpx-level ${levelClass(potd.difficulty)}`}>{potd.difficulty}</span></p>
              <button type="button" className="dpx-primary" onClick={() => openProblem(potd.id)}>{completed.has(potd.id) ? "Solved — review it" : "Solve today's problem"}</button>
            </section>
          )}

          <section className="dpx-side-card">
            <header>
              <h2>{sidePanel === "topics" ? "Top Topics" : "Sheets"}</h2>
              <span>{sidePanel === "topics" ? `${practiceTopics.length} total` : `${sheetCounts.length} available`}</span>
            </header>
            <div className="dpx-segment" role="tablist" aria-label="Side panel">
              <button type="button" role="tab" aria-selected={sidePanel === "topics"} className={sidePanel === "topics" ? "is-active" : ""} onClick={() => setSidePanel("topics")}>Topics</button>
              <button type="button" role="tab" aria-selected={sidePanel === "sheets"} className={sidePanel === "sheets" ? "is-active" : ""} onClick={() => setSidePanel("sheets")}>Sheets</button>
            </div>
            {sidePanel === "topics" && (
              <label className="dpx-search is-small">
                <Search size={14} />
                <span className="sr-only">Search topics</span>
                <input value={topicQuery} onChange={(event) => setTopicQuery(event.target.value)} placeholder="Search topics…" />
              </label>
            )}
            <div className="dpx-tag-cloud">
              {sidePanel === "topics" && topicList.map((entry) => (
                <button type="button" key={entry.name} aria-pressed={topic === entry.name} className={topic === entry.name ? "is-active" : ""} onClick={() => setTopic(topic === entry.name ? "" : entry.name)}>
                  {entry.name} <b>{entry.count}</b>
                </button>
              ))}
              {sidePanel === "sheets" && sheetCounts.map((entry) => (
                <button type="button" key={entry.id} aria-pressed={sheet === entry.id} className={sheet === entry.id ? "is-active" : ""} onClick={() => setSheet(sheet === entry.id ? "" : entry.id)}>
                  {entry.title} <b>{entry.count}</b>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
