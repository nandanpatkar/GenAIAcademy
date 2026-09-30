import React, { useMemo } from "react";
import {
  ArrowRight,
  CircleCheckBig,
  Clock3,
  ExternalLink,
  Info,
  Layers,
  Route,
} from "lucide-react";
import { categories, problemBySlug } from "../catalog";
import { useStore } from "../hooks";
import { KEYS } from "../keys";
import { useLearnerState } from "../learner";
import { buildAllTracks, enrollmentFor, isDoneStatus, itemStatus, nextItem, trackProgress } from "../lib/curriculum";
import { formatDuration } from "../lib/dates";
import { Badge, Panel, PrepPage, Progress } from "../ui";
import { practiceById, sheetById, sheetItems, sheets } from "../../practice/practiceData";
import SheetView from "./SheetView";
import CollectionView from "../../practice/CollectionView";

const SHEET_GROUPS = [...new Set(sheets.map((sheet) => sheet.group))];

/** A DSA sheet on the Prep Hub landing: progress when its list is available. */
function SheetCard({ sheet, state, onOpen }) {
  const items = sheetItems(sheet).filter((item) => item.id && practiceById.has(item.id));
  const done = items.filter((item) => isDoneStatus(itemStatus(item.id, state))).length;
  if (!sheet.available) {
    return (
      <div className="dsp-tile dsp-track-tile dsp-sheet-tile is-unavailable">
        <header><span className="dsp-track-icon"><Layers size={18} /></span><Badge tone="neutral">Not downloaded</Badge></header>
        <h3>{sheet.title}</h3>
        <p>{sheet.description}</p>
        <small className="dsp-muted">This sheet's problem list isn't in the offline data yet. Save its page to <code>tuf/site/prep-hub/{sheet.id}.html</code> and rerun <code>scripts/build_tuf_practice.py</code>.</small>
        <a className="dsp-track-cta" href={`https://takeuforward.org/prep-hub/${sheet.id}`} target="_blank" rel="noopener noreferrer">View on takeUforward <ExternalLink size={13} /></a>
      </div>
    );
  }
  return (
    <button type="button" className="dsp-tile dsp-track-tile dsp-sheet-tile" onClick={onOpen}>
      <header><span className="dsp-track-icon"><Layers size={18} /></span><Badge tone={done ? "accent" : "neutral"}>{sheetItems(sheet).length} problems</Badge></header>
      <h3>{sheet.title}</h3>
      <p>{sheet.description}</p>
      {done ? <Progress value={done} max={items.length} label="Solved" /> : <span className="dsp-track-cta">Open sheet <ArrowRight size={14} /></span>}
    </button>
  );
}

const tracks = buildAllTracks(categories, problemBySlug);
const trackById = new Map(tracks.map((track) => [track.id, track]));

function TrackCard({ track, enrollment, state, onOpen }) {
  const progress = trackProgress(track, enrollment, state);
  return (
    <button type="button" className="dsp-tile dsp-track-tile" onClick={onOpen}>
      <header>
        <span className="dsp-track-icon"><Route size={18} /></span>
        <Badge tone={enrollment ? "accent" : "neutral"}>{enrollment ? "Enrolled" : track.level}</Badge>
      </header>
      <h3>{track.title}</h3>
      <p>{track.summary}</p>
      <dl className="dsp-track-facts">
        <div><dt>Modules</dt><dd>{track.modules.length}</dd></div>
        <div><dt>Required</dt><dd>{track.counts.required}</dd></div>
        <div><dt>Est. time</dt><dd>{formatDuration(track.estimatedMinutes)}</dd></div>
      </dl>
      {enrollment ? <Progress value={progress.done} max={progress.total} label="Required solved" /> : <span className="dsp-track-cta">View track <ArrowRight size={14} /></span>}
    </button>
  );
}

/**
 * A track (Zero to Hero 450 and the others), in the same layout as the
 * Problems page and the sheets: modules become groups, patterns sections.
 * Optional and repeated items show a tag and don't count toward progress.
 */
function TrackView({ track, embedded, navigate, openProblem }) {
  const state = useLearnerState();
  const [enrollments, setEnrollments] = useStore(KEYS.enrollments, {});
  const enrollment = enrollments[track.id] || null;
  const progress = trackProgress(track, enrollment, state);
  const next = nextItem(track, state);

  const groups = useMemo(() => track.modules.map((module, index) => ({
    key: module.id,
    index: index + 1,
    title: module.title,
    subtitle: module.subtitle,
    sections: module.sections.map((section) => ({
      key: section.id,
      title: section.title,
      entries: section.items
        .map((item) => ({ problem: practiceById.get(item.slug), tag: item.repeat ? "Also listed earlier" : item.required ? "" : "Optional", countsTowardProgress: item.required && !item.repeat }))
        .filter((entry) => entry.problem),
    })).filter((section) => section.entries.length),
  })).filter((group) => group.sections.length), [track]);

  const enroll = () => setEnrollments((prev) => ({ ...prev, [track.id]: enrollmentFor(track) }));
  const leave = () => setEnrollments((prev) => {
    const copy = { ...prev };
    delete copy[track.id];
    return copy;
  });

  return (
    <CollectionView
      key={track.id}
      crumbs={embedded ? [{ label: "Practice" }, { label: track.title }] : [{ label: "Prep Hub", onClick: () => navigate("tracks") }, { label: "Code Lab tracks" }]}
      title={track.title}
      description={track.summary}
      features={[
        { icon: Layers, label: `${track.modules.length} modules · ${track.counts.required} required` },
        { icon: Clock3, label: formatDuration(track.estimatedMinutes) },
        { icon: CircleCheckBig, label: enrollment ? `Enrolled · v${enrollment.version}` : "Not enrolled — progress still counts" },
      ]}
      actions={(
        <>
          {next && <button type="button" className="dpx-btn is-primary" onClick={() => openProblem(next.item.slug)}>{progress.done ? "Continue" : "Start"} <ArrowRight size={15} /></button>}
          {enrollment
            ? <button type="button" className="dpx-btn" onClick={leave}>Leave track</button>
            : <button type="button" className="dpx-btn" onClick={enroll}>Enroll</button>}
        </>
      )}
      notice={progress.outdated && (
        <div className="dsp-notice is-warning">
          <Info size={16} />
          <span>You enrolled in version {enrollment.version}; version {track.version} is available. Your progress is still measured against the {enrollment.requiredSlugs.length} items you signed up for. <button type="button" className="dsp-link" onClick={enroll}>Switch to v{track.version}</button></span>
        </div>
      )}
      groups={groups}
      initialOpen={[next ? next.module.id : track.modules[0]?.id].filter(Boolean)}
      openProblem={openProblem}
      onWatchLesson={(path) => navigate("visual", { path })}
    />
  );
}

export default function PrepHub({ section, params, navigate, openProblem }) {
  const state = useLearnerState();
  const [enrollments] = useStore(KEYS.enrollments, {});
  const sheet = params?.sheetId ? sheetById.get(params.sheetId) : null;
  const trackId = section === "sheet" ? "zero-to-hero" : params?.trackId;
  const track = trackId ? trackById.get(trackId) : null;

  const enrolled = useMemo(() => tracks.filter((entry) => enrollments[entry.id]), [enrollments]);

  if (sheet?.available) return <SheetView key={sheet.id} sheet={sheet} navigate={navigate} openProblem={openProblem} />;
  if (track) return <TrackView key={track.id} track={track} embedded={section === "sheet"} navigate={navigate} openProblem={openProblem} />;

  return (
    <PrepPage
      eyebrow="Prep Hub"
      title="Choose a sheet or track"
      description="Sheets follow well-known interview roadmaps step by step; tracks are built from the Code Lab problems, grouped module → pattern → problem. Both share one practice set, so a problem solved anywhere counts everywhere."
      actions={<button type="button" className="dsp-btn" onClick={() => navigate("articles")}>Browse articles</button>}
    >
      {enrolled.length > 0 && (
        <Panel title="Your tracks" subtitle="Pick up exactly where you stopped.">
          <ul className="dsp-list">
            {enrolled.map((entry) => {
              const progress = trackProgress(entry, enrollments[entry.id], state);
              const next = nextItem(entry, state);
              return (
                <li key={entry.id} className="dsp-list-row dsp-enrolled-row">
                  <span className="dsp-list-icon"><Route size={16} /></span>
                  <div>
                    <b>{entry.title}</b>
                    <small>{next ? `Next: ${problemBySlug.get(next.item.slug)?.title} · ${next.section.title}` : "All required items solved"}</small>
                  </div>
                  <div className="dsp-enrolled-progress"><Progress value={progress.done} max={progress.total} showNumbers /></div>
                  <button type="button" className="dsp-btn is-small" onClick={() => navigate("tracks", { trackId: entry.id })}>Open</button>
                  {next && <button type="button" className="dsp-btn is-small is-primary" onClick={() => openProblem(next.item.slug)}>Continue</button>}
                </li>
              );
            })}
          </ul>
        </Panel>
      )}

      {SHEET_GROUPS.map((group) => (
        <Panel key={group} title={group} className="dsp-sheet-group">
          <div className="dsp-grid cols-2">
            {sheets.filter((entry) => entry.group === group).map((entry) => (
              <SheetCard key={entry.id} sheet={entry} state={state} onOpen={() => navigate("tracks", { sheetId: entry.id })} />
            ))}
          </div>
        </Panel>
      ))}

      <h2 className="dsp-subheading">Code Lab tracks</h2>
      <div className="dsp-grid cols-2">
        {tracks.map((entry) => (
          <TrackCard key={entry.id} track={entry} enrollment={enrollments[entry.id]} state={state} onOpen={() => navigate("tracks", { trackId: entry.id })} />
        ))}
      </div>

      <div className="dsp-notice">
        <Info size={16} />
        <span><b>How statuses work.</b> A run never marks a problem solved — only an accepted submission (or your own tick) does. Solving it again on a later day, or grading it “good” in the review queue, upgrades it to <i>recalled</i>.</span>
      </div>
    </PrepPage>
  );
}
