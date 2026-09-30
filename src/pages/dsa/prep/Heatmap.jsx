import React from "react";
import { addDays, dayKey, formatDay, weekStart } from "./lib/dates";
import { QUALIFYING_RULES } from "./lib/rewards";

/**
 * GitHub-style activity grid: one column per week (Monday first), one cell per
 * day, shaded by that day's count. Days in the future render empty.
 */
export default function Heatmap({ counts, weeks = 12, label = "Activity" }) {
  const today = dayKey();
  const start = addDays(weekStart(today), -7 * (weeks - 1));
  const max = Math.max(1, ...Object.values(counts || {}));
  const columns = Array.from({ length: weeks }, (_, week) => Array.from({ length: 7 }, (_, day) => addDays(start, week * 7 + day)));
  const level = (value) => (!value ? 0 : Math.min(4, Math.ceil((value / max) * 4)));
  const active = Object.entries(counts || {}).filter(([key, value]) => value > 0 && key >= start && key <= today).length;

  return (
    <figure className="dsp-heatmap" aria-label={`${label}: ${active} active day${active === 1 ? "" : "s"} in the last ${weeks} weeks`}>
      <div className="dsp-heatmap-grid" style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}>
        {columns.map((column) => (
          <div key={column[0]} className="dsp-heatmap-col">
            {column.map((key) => {
              const value = counts?.[key] || 0;
              const future = key > today;
              return <span key={key} className={`lvl-${future ? "x" : level(value)}${key === today ? " is-today" : ""}`} title={future ? "" : `${formatDay(key)} — ${value} ${value === 1 ? "activity" : "activities"}`} />;
            })}
          </div>
        ))}
      </div>
      <figcaption><span>{active} active day{active === 1 ? "" : "s"}</span><span className="dsp-heatmap-legend">Less {[0, 1, 2, 3, 4].map((lvl) => <i key={lvl} className={`lvl-${lvl}`} />)} More</span></figcaption>
    </figure>
  );
}

/** Per-day counts from submissions (accepted and not) plus ledger events. */
export function activityCounts(submissions, ledger) {
  const counts = {};
  submissions.forEach((entry) => { counts[entry.day] = (counts[entry.day] || 0) + 1; });
  ledger.forEach((entry) => { if (QUALIFYING_RULES.has(entry.ruleId)) counts[entry.day] = (counts[entry.day] || 0) + 1; });
  return counts;
}
