import React, { useMemo } from "react";

// GitHub-style contribution grid: weeks run left to right, weekdays top to bottom, with
// activity shown as escalating red.
const DAY_LABELS = ["Mon", "Wed", "Fri"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function levelFor(day) {
  const count = day.count ?? (day.active || day.solved ? 1 : 0);
  if (!count) return 0;
  if (count >= 4) return 4;
  if (count >= 3) return 3;
  if (count >= 2) return 2;
  return 1;
}

export default function StreakHeatmap({ days }) {
  const { weeks, months, total } = useMemo(() => {
    if (!days.length) return { weeks: [], months: [], total: 0 };

    // Pad the first week so column 0 starts on a Monday, as GitHub does.
    const first = new Date(`${days[0].date}T00:00:00`);
    const lead = (first.getDay() + 6) % 7;
    const cells = [...Array.from({ length: lead }, () => null), ...days];

    const grouped = [];
    for (let i = 0; i < cells.length; i += 7) grouped.push(cells.slice(i, i + 7));

    const labels = [];
    let lastMonth = -1;
    grouped.forEach((week, i) => {
      const day = week.find(Boolean);
      if (!day) return;
      const month = new Date(`${day.date}T00:00:00`).getMonth();
      if (month !== lastMonth) {
        labels.push({ index: i, label: MONTHS[month] });
        lastMonth = month;
      }
    });

    return { weeks: grouped, months: labels, total: days.filter((d) => levelFor(d) > 0).length };
  }, [days]);

  if (!weeks.length) return <p className="aw-muted-sm">No streak history yet.</p>;

  return (
    <div className="aw-heatmap">
      <div className="aw-heatmap-months" style={{ "--weeks": weeks.length }}>
        {months.map((m) => (
          <span key={`${m.label}-${m.index}`} style={{ gridColumnStart: m.index + 1 }}>{m.label}</span>
        ))}
      </div>

      <div className="aw-heatmap-body">
        <div className="aw-heatmap-days">
          {DAY_LABELS.map((d) => <span key={d}>{d}</span>)}
        </div>
        <div className="aw-heatmap-grid" style={{ "--weeks": weeks.length }} role="img"
          aria-label={`${total} active days in the last ${days.length} days`}>
          {weeks.map((week, wi) => (
            <div key={wi} className="aw-heatmap-week">
              {Array.from({ length: 7 }, (_, di) => {
                const day = week[di];
                if (!day) return <span key={di} className="aw-cell is-empty" />;
                const level = levelFor(day);
                return (
                  <span
                    key={di}
                    className={`aw-cell lv-${level}`}
                    title={`${day.date} — ${level ? "active" : "no activity"}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="aw-heatmap-legend">
        <span>{total} active {total === 1 ? "day" : "days"}</span>
        <span className="aw-heatmap-scale">
          Less{[0, 1, 2, 3, 4].map((l) => <i key={l} className={`aw-cell lv-${l}`} />)}More
        </span>
      </div>
    </div>
  );
}
