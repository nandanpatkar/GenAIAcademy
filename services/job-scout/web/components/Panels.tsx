"use client";

/**
 * The contents of the glass slab. Every value here came from the LangGraph
 * checkpoint via /api/state — the console renders facts, it never derives them.
 *
 * The exception, and the point of the panel: `nextStep` derives nothing about
 * the WORLD, only about what the person should do next. That is a UI concern,
 * so it lives in the UI.
 */

import { packUrl, type State } from "@/lib/api";
import type { OrbMode } from "@/lib/orbScene";

export type Step = { now: string; next: string; cue?: string };

/** What is happening, and what to say next. The slab's headline. */
export function nextStep(state: State, mode: OrbMode): Step {
  if (state.run.running) {
    return {
      now: state.run.latest_status || "Working…",
      next: "This takes about a minute. Jobvis will speak up when it lands.",
    };
  }
  if (!state.candidate) {
    return {
      now: "No candidate yet",
      next: "Drop a CV in the wizard once — Jobvis remembers it from then on.",
    };
  }
  if (mode === "idle") {
    return {
      // No cue here on purpose: `cue` is a phrase to SAY, and there is nothing
      // to say to an agent that is not listening yet.
      now: `Ready for ${state.candidate.name || "you"}`,
      next: "Engage Jobvis, top right, to start talking.",
    };
  }
  if (state.pack) {
    return {
      now: "Application ready",
      next: "Ask for the highlights, or take the downloads below.",
      cue: "give me the highlights",
    };
  }
  if (state.jobs.length > 0) {
    return {
      now: `${state.jobs.length} matches ranked`,
      next: "Ask to run through them, or to tailor one.",
      cue: "tailor an application for the first one",
    };
  }
  return { now: "Listening", next: "Ask for jobs whenever you are ready.", cue: "find me jobs" };
}

export function NextPanel({ step }: { step: Step }) {
  return (
    <section className="block now">
      <p className="label">Now</p>
      <p className="now-line">{step.now}</p>
      <p className="next-line">{step.next}</p>
      {step.cue && <p className="cue">&ldquo;{step.cue}&rdquo;</p>}
    </section>
  );
}

export function JobsPanel({ state }: { state: State }) {
  if (state.jobs.length === 0) return null;
  return (
    <section className="block">
      <p className="label">Top matches</p>
      {state.jobs.slice(0, 3).map((job, i) => (
        <div className="row" key={job.job_id} style={{ animationDelay: `${i * 70}ms` }}>
          <span className="rank">{String(job.rank).padStart(2, "0")}</span>
          <span className="job">
            <b>{job.title}</b>
            <span className="meta">
              {job.company} · {job.location}
            </span>
          </span>
          <span className="score">{job.fit_score}</span>
        </div>
      ))}
    </section>
  );
}

export function PackPanel({ state }: { state: State }) {
  const pack = state.pack;
  if (!pack) return null;
  return (
    <section className="block">
      <p className="label">Application</p>
      <b className="headline">{pack.headline}</b>
      <p className={pack.flags === 0 ? "verdict clean" : "verdict flagged"}>
        {pack.flags === 0 ? "✓" : "⚠"} {pack.verdict}
      </p>
      <div className="downloads no-drag">
        <a className="pill solid" href={packUrl("pdf")} download>
          Tailored CV · PDF
        </a>
        <a className="pill" href={packUrl("tex")} download>
          .tex
        </a>
      </div>
    </section>
  );
}

export function ActivityPanel({ lines }: { lines: { role: string; text: string }[] }) {
  if (lines.length === 0) return null;
  return (
    <section className="block activity no-drag">
      <p className="label">Activity</p>
      <div className="feed">
        {lines.slice(-40).map((line, index) => (
          <div key={index} className={`line ${line.role}`}>
            {line.role === "tool" ? (
              <span className="tool">⚙ {line.text}</span>
            ) : line.role === "system" ? (
              <span className="system">{line.text}</span>
            ) : (
              <>
                <span className="who">{line.role === "you" ? "You" : "Jobvis"}</span>
                {line.text}
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
