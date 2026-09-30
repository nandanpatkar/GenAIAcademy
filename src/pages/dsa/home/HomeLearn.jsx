import React from "react";
import { ArrowRight, Binary, Boxes, BrainCircuit, Cpu, DatabaseZap, Network, Play } from "lucide-react";
import { CV_TRACKS } from "../../../data/chaiVisualCourseData";
import { CHALLENGES } from "../../../data/sqlLabContent";
import { TRACK_SECTIONS } from "../prep/visual/sections";

/* Home's "Learn visually" row: one card per Learn section, each with its own
 * progress and the next thing to open. Lazily loaded by DsaHome, since it
 * pulls in the Visual Learning course tree (the AI from Scratch index is far
 * larger, so that card works from the saved progress alone). */

const TRACK_CARDS = {
  dsa: { icon: Binary, label: "DSA Visual", unit: "patterns" },
  lld: { icon: Boxes, label: "Low-Level Design", unit: "modules" },
  os: { icon: Cpu, label: "Operating Systems", unit: "sections" },
  networking: { icon: Network, label: "Computer Networks", unit: "parts" },
};

function LearnCard({ icon: Icon, label, subtitle, done, total, unitLabel, next, nextLabel, active, onOpen, onNext }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <article className={`dsv-tile${active ? " is-active" : ""}`}>
      <button type="button" className="dsv-tile-main" onClick={onOpen}>
        <span className="dsv-tile-icon"><Icon size={17} /></span>
        <span className="dsv-tile-copy">
          <b>{label}</b>
          <small>{subtitle}</small>
        </span>
        {active && <span className="dsv-tile-badge">Continue</span>}
      </button>
      <div className="dsv-tile-progress">
        <span>{done}/{total} {unitLabel}</span>
        <span>{pct}%</span>
      </div>
      <span className="dpx-bar dsv-home-bar"><span style={{ width: `${pct}%` }} /></span>
      {next ? (
        <button type="button" className="dsv-home-next" onClick={onNext}>
          <Play size={11} fill="currentColor" />
          <span><em>{nextLabel}</em>{next}</span>
          <ArrowRight size={13} />
        </button>
      ) : <span className="dsv-home-next is-done">{total ? "All done — revisit any time" : "Open to begin"}</span>}
    </article>
  );
}

export default function HomeLearn({ navigate, watched, visualLast, aifsDone, aifsLast, sqlSolved = {} }) {
  const sqlDone = CHALLENGES.filter((challenge) => sqlSolved[challenge.id]).length;
  const sqlNext = CHALLENGES.find((challenge) => !sqlSolved[challenge.id]);
  const cards = CV_TRACKS.map((track) => {
    const items = track.groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.title })));
    const done = items.filter((item) => watched.has(item.path)).length;
    const resumeHere = visualLast?.path && items.some((item) => item.path === visualLast.path) && !watched.has(visualLast.path);
    const next = resumeHere ? items.find((item) => item.path === visualLast.path) : items.find((item) => !watched.has(item.path));
    const section = TRACK_SECTIONS[track.id];
    const meta = TRACK_CARDS[track.id] || { icon: Binary, label: track.name, unit: "sections" };
    return {
      key: track.id,
      icon: meta.icon,
      label: meta.label,
      subtitle: `${track.subtitle} · ${track.groups.length} ${meta.unit}`,
      done,
      total: items.length,
      unitLabel: "watched",
      next: next?.title,
      nextLabel: resumeHere ? "Resume" : done ? "Up next" : "Start with",
      active: Boolean(visualLast?.path && items.some((item) => item.path === visualLast.path)),
      onOpen: () => navigate(section),
      onNext: () => navigate(section, next ? { path: next.path } : null),
    };
  });

  return (
    <div className="dsv-home-grid">
      {cards.map(({ key, ...card }) => <LearnCard key={key} {...card} />)}
      <LearnCard
        icon={DatabaseZap}
        label="SQL & Query Plans"
        subtitle="Real PostgreSQL in the tab · read EXPLAIN ANALYZE"
        done={sqlDone}
        total={CHALLENGES.length}
        unitLabel="challenges solved"
        next={sqlNext?.title}
        nextLabel={sqlDone ? "Up next" : "Start with"}
        onOpen={() => navigate("sqllab")}
        onNext={() => navigate("sqllab")}
      />
      <article className="dsv-tile">
        <button type="button" className="dsv-tile-main" onClick={() => navigate("aifs")}>
          <span className="dsv-tile-icon is-purple"><BrainCircuit size={17} /></span>
          <span className="dsv-tile-copy">
            <b>AI from Scratch</b>
            <small>AI and ML from first principles · quizzes earn coins</small>
          </span>
        </button>
        <div className="dsv-tile-progress">
          <span>{aifsDone} lesson{aifsDone === 1 ? "" : "s"} complete</span>
        </div>
        {aifsLast ? (
          <button type="button" className="dsv-home-next" onClick={() => navigate("aifs", { slug: aifsLast.slug })}>
            <Play size={11} fill="currentColor" />
            <span><em>Resume</em>{aifsLast.title}</span>
            <ArrowRight size={13} />
          </button>
        ) : (
          <button type="button" className="dsv-home-next" onClick={() => navigate("aifs")}>
            <Play size={11} fill="currentColor" />
            <span><em>Start with</em>The curriculum</span>
            <ArrowRight size={13} />
          </button>
        )}
      </article>
    </div>
  );
}
