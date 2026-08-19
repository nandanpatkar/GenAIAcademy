import React, { useState } from "react";
import Icon from "../icons";
import { daily, streak } from "../data";
import { renderStatement, statementMeta } from "../statement";
import StreakHeatmap from "./StreakHeatmap";
import SolutionConsole from "./SolutionConsole";

export default function DailyView() {
  const p = daily.problem ?? {};
  const meta = statementMeta(p.statement);
  const [solving, setSolving] = useState(false);
  const [solved, setSolved] = useState(Boolean(daily.solved));

  return (
    <div className="aw-page aw-daily">
      <header className="aw-band-head">
        <span className="aw-kicker"><Icon name="local_fire_department" size={14} /> Today's Challenge</span>
        <h1>Solve once. Keep the fire alive.</h1>
        <p>Same problem for everyone today. One clean run keeps your daily streak moving.</p>
      </header>

      <div className={`aw-daily-grid${solving ? " is-solving" : ""}`}>
        <section className="aw-card">
          <div className="aw-daily-meta">
            <span className="aw-chip">Challenge #{daily.challengeNumber}</span>
            <span className="aw-chip">{daily.challengeDate}</span>
            <span className={`aw-chip${solved ? " is-good" : ""}`}>{solved ? "Solved" : "Unsolved"}</span>
          </div>
          <h2>{p.title}</h2>

          <div className="aw-daily-facts">
            <div><span>Difficulty</span><strong>{p.difficulty}</strong></div>
            <div><span>Bucket</span><strong>{p.ratingBucket}</strong></div>
            <div><span>Source</span><strong>{p.oj}</strong></div>
            <div><span>Time</span><strong>{meta.timeLimit ?? "—"}</strong></div>
            <div><span>Memory</span><strong>{meta.memoryLimit ?? "—"}</strong></div>
            <div><span>Attempts</span><strong>{daily.attempts ?? 0}</strong></div>
          </div>

          {p.tags?.length > 0 && (
            <div className="aw-tag-row">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
          )}

          {p.statement && (
            <div className="aw-statement problem-statement">
              <div className="aw-html" dangerouslySetInnerHTML={{ __html: renderStatement(p.statement) }} />
            </div>
          )}

          {!solving && (
            <button type="button" className="aw-btn aw-btn-primary aw-solve-btn" onClick={() => setSolving(true)}>
              <Icon name="code" size={17} /> Solve Challenge
            </button>
          )}
        </section>

        {solving ? (
          <SolutionConsole
            storageKey={`daily:${daily.challengeDate}`}
            subtitle={`Submit to keep challenge #${daily.challengeNumber} alive`}
            problem={{ title: p.title, statement: p.statement, examples: [] }}
            onAccepted={() => setSolved(true)}
            footer={
              <button type="button" className="aw-btn aw-btn-ghost" onClick={() => setSolving(false)}>
                Close console
              </button>
            }
          />
        ) : (
          <section className="aw-card">
            <span className="aw-kicker">Streak</span>
            <div className="aw-streak-stats">
              <div><span>Current</span><strong>{streak.current ?? 0}</strong></div>
              <div><span>Best</span><strong>{streak.best ?? 0}</strong></div>
              <div><span>Freezes</span><strong>{streak.freezes ?? 0}</strong></div>
            </div>
            <StreakHeatmap days={streak.days ?? []} />
            <p className="aw-muted-sm">Resets {new Date(daily.resetAt).toLocaleString()}</p>
          </section>
        )}
      </div>
    </div>
  );
}
