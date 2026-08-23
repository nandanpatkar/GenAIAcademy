import React, { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bookmark,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lock,
  Target,
} from "lucide-react";
import catalog from "../../data/codelab/catalog.json";
import { FireIcon, ScoreboardIcon, TrophyIcon } from "./DsaDashboardIcons";
import "../../styles/DsaGlobalDashboard.css";

const problems = catalog.problems || [];
const problemBySlug = new Map(problems.map((problem) => [problem.slug, problem]));

// Coins per accepted problem, weighted so the score reflects difficulty rather
// than raw volume.
const COIN_VALUE = { easy: 10, medium: 20, hard: 40 };
const coinsFor = (problem) => COIN_VALUE[problem?.difficulty?.toLowerCase()] ?? 10;

const TIERS = [
  { min: 4000, label: "Grandmaster" },
  { min: 2000, label: "Master" },
  { min: 1000, label: "Diamond" },
  { min: 500, label: "Platinum" },
  { min: 250, label: "Gold" },
  { min: 100, label: "Silver" },
  { min: 1, label: "Bronze" },
];
const tierFor = (score) => TIERS.find((tier) => score >= tier.min)?.label || "Unranked";
const nextTierFor = (score) => [...TIERS].reverse().find((tier) => score < tier.min);

const DAY_MS = 86400000;
const dayKey = (date) => {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
};
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const PERIODS = [
  { id: "week", label: "This Week", days: 7 },
  { id: "month", label: "This Month", days: 30 },
  { id: "quarter", label: "Last 90 days", days: 90 },
];

const readArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

/** Longest run of consecutive active days ending today or yesterday. */
const streakFrom = (daySet) => {
  if (!daySet.size) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let cursor = daySet.has(dayKey(today)) ? today.getTime() : today.getTime() - DAY_MS;
  if (!daySet.has(dayKey(cursor))) return 0;
  let run = 0;
  while (daySet.has(dayKey(cursor))) {
    run += 1;
    cursor -= DAY_MS;
  }
  return run;
};

/* ── primitives ─────────────────────────────────────────────────────────── */

const StatCard = ({ icon, label, value, caption, tone = "success", onAction, children }) => (
  <article className="dsa-gd-stat">
    <header>
      <div>{icon}<h3>{label}</h3></div>
      {onAction && <button type="button" onClick={onAction} aria-label={`Open ${label}`}><ArrowUpRight size={16} /></button>}
    </header>
    <footer>
      {children || <p className="dsa-gd-stat-value">{value}</p>}
      <span className={`dsa-gd-stat-caption tone-${tone}`}>{caption}</span>
    </footer>
  </article>
);

const Panel = ({ title, subtitle, actions, children, className = "" }) => (
  <section className={`dsa-gd-panel ${className}`.trim()}>
    <header>
      <div><h3>{title}</h3><p>{subtitle}</p></div>
      {actions && <div className="dsa-gd-panel-actions">{actions}</div>}
    </header>
    {children}
  </section>
);

const EmptyState = ({ icon: Icon, title, body }) => (
  <div className="dsa-gd-empty">
    <span><Icon size={26} /></span>
    <h4>{title}</h4>
    <p>{body}</p>
  </div>
);

function PeriodSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const active = PERIODS.find((period) => period.id === value) || PERIODS[0];
  return (
    <div className="dsa-gd-period-select" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <button type="button" className="dsa-gd-period" onClick={() => setOpen((prev) => !prev)} aria-haspopup="listbox" aria-expanded={open}>
        <Calendar size={15} /> {active.label} <ChevronDown size={15} />
      </button>
      {open && (
        <ul className="dsa-gd-period-menu" role="listbox">
          {PERIODS.map((period) => (
            <li key={period.id}>
              <button type="button" role="option" aria-selected={period.id === value}
                className={period.id === value ? "is-active" : ""}
                onClick={() => { onChange(period.id); setOpen(false); }}>
                {period.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Rounded-top bar chart, matching the reference's recharts bars. When there is
 * no data the same geometry renders as muted ghost bars behind an overlaid
 * empty state, so the panel keeps its shape instead of collapsing.
 */
function ScoreBars({ bars, empty }) {
  const width = 760;
  const height = 300;
  const radius = 8;
  const gap = 10;
  const barWidth = Math.max(8, Math.min(28, width / bars.length - gap));
  const max = Math.max(...bars.map((bar) => bar.value), 1);
  const step = width / bars.length;

  return (
    <svg className="dsa-gd-bars-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img"
         aria-label={empty ? "No score data" : "Coins earned per day"}>
      {bars.map((bar, index) => {
        const ratio = empty ? bar.ghost : bar.value / max;
        const barHeight = Math.max(ratio * (height - 20), empty ? 40 : 3);
        const x = index * step + (step - barWidth) / 2;
        const y = height - barHeight;
        const r = Math.min(radius, barWidth / 2, barHeight);
        return (
          <path
            key={bar.key}
            className={empty ? "is-ghost" : ""}
            d={`M ${x},${y + r} A ${r},${r},0,0,1,${x + r},${y} L ${x + barWidth - r},${y} A ${r},${r},0,0,1,${x + barWidth},${y + r} L ${x + barWidth},${height} L ${x},${height} Z`}
          />
        );
      })}
    </svg>
  );
}

function StreakCalendar({ daySet }) {
  const [offset, setOffset] = useState(0);
  const base = new Date();
  const view = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const year = view.getFullYear();
  const month = view.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const firstWeekday = view.getDay();
  const todayKey = dayKey(base);

  const cells = [];
  for (let i = firstWeekday - 1; i >= 0; i -= 1) cells.push({ day: prevMonthDays - i, outside: true });
  for (let day = 1; day <= daysInMonth; day += 1) cells.push({ day, outside: false });
  let trailing = 1;
  while (cells.length % 7 !== 0 || cells.length < 42) {
    cells.push({ day: trailing, outside: true });
    trailing += 1;
    if (cells.length >= 42) break;
  }

  return (
    <div className="dsa-gd-calendar">
      <div className="dsa-gd-calendar-nav">
        <button type="button" onClick={() => setOffset((value) => value - 1)} aria-label="Previous month"><ChevronLeft size={17} /></button>
        <b>{MONTHS[month]} {year}</b>
        <button type="button" onClick={() => setOffset((value) => value + 1)} disabled={offset >= 0} aria-label="Next month"><ChevronRight size={17} /></button>
      </div>
      <div className="dsa-gd-calendar-grid">
        {WEEKDAYS.map((label) => <span key={label} className="dsa-gd-weekday">{label}</span>)}
        {cells.map((cell, index) => {
          if (cell.outside) return <span key={`out-${index}`} className="dsa-gd-day is-outside">{cell.day}</span>;
          const key = dayKey(new Date(year, month, cell.day));
          const classes = ["dsa-gd-day"];
          if (daySet.has(key)) classes.push("is-active");
          if (key === todayKey) classes.push("is-today");
          return <span key={key} className={classes.join(" ")} title={daySet.has(key) ? `Active on ${key}` : key}>{cell.day}</span>;
        })}
      </div>
    </div>
  );
}

/* ── page ───────────────────────────────────────────────────────────────── */

export default function DsaGlobalDashboard({ onNavigate, onOpenProblem, userName = "" }) {
  const [tab, setTab] = useState("summary");
  const [period, setPeriod] = useState("week");
  const [sheetPeriod, setSheetPeriod] = useState("month");
  const [activityPeriod, setActivityPeriod] = useState("month");

  const completed = useMemo(() => readArray("leetcode_completed"), []);
  const bookmarks = useMemo(() => readArray("dsa_dashboard_bookmarks"), []);
  const submissions = useMemo(
    () => [...readArray("leetcode_submissions")].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
    [],
  );

  const solvedProblems = useMemo(() => completed.map((slug) => problemBySlug.get(slug)).filter(Boolean), [completed]);
  const score = useMemo(() => solvedProblems.reduce((total, problem) => total + coinsFor(problem), 0), [solvedProblems]);
  const rank = tierFor(score);
  const nextTier = nextTierFor(score);

  const daySet = useMemo(() => new Set(submissions.map((submission) => dayKey(submission.submittedAt))), [submissions]);
  const streak = useMemo(() => streakFrom(daySet), [daySet]);

  const periodDays = (PERIODS.find((entry) => entry.id === period) || PERIODS[0]).days;
  const bars = useMemo(() => {
    const byDay = new Map();
    submissions.forEach((submission) => {
      const key = dayKey(submission.submittedAt);
      byDay.set(key, (byDay.get(key) || 0) + coinsFor(problemBySlug.get(submission.problemId)));
    });
    // Fixed ghost heights so the placeholder silhouette is stable between renders.
    const ghosts = [0.62, 0.34, 0.71, 0.45, 0.86, 0.28, 0.54, 0.79, 0.41, 0.66, 0.31, 0.58, 0.74, 0.38];
    return Array.from({ length: periodDays }, (_, index) => {
      const key = dayKey(Date.now() - (periodDays - 1 - index) * DAY_MS);
      return { key, value: byDay.get(key) || 0, ghost: ghosts[index % ghosts.length] };
    });
  }, [submissions, periodDays]);

  const hasChartData = bars.some((bar) => bar.value > 0);

  const activityWindow = (PERIODS.find((entry) => entry.id === activityPeriod) || PERIODS[1]).days;
  const recentActivities = useMemo(() => {
    const cutoff = Date.now() - activityWindow * DAY_MS;
    return submissions.filter((submission) => new Date(submission.submittedAt).getTime() >= cutoff);
  }, [submissions, activityWindow]);

  const sheetWindow = (PERIODS.find((entry) => entry.id === sheetPeriod) || PERIODS[1]).days;
  const sheetSolvedInPeriod = useMemo(() => {
    const cutoff = Date.now() - sheetWindow * DAY_MS;
    return submissions.filter((submission) => new Date(submission.submittedAt).getTime() >= cutoff).length;
  }, [submissions, sheetWindow]);

  const difficultyBreakdown = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0 };
    const totals = { easy: 0, medium: 0, hard: 0 };
    problems.forEach((problem) => {
      const key = problem.difficulty?.toLowerCase();
      if (key in totals) totals[key] += 1;
    });
    solvedProblems.forEach((problem) => {
      const key = problem.difficulty?.toLowerCase();
      if (key in counts) counts[key] += 1;
    });
    return ["easy", "medium", "hard"].map((key) => ({ key, solved: counts[key], total: totals[key] }));
  }, [solvedProblems]);

  const patternBreakdown = useMemo(() => {
    const counts = new Map();
    solvedProblems.forEach((problem) => {
      const pattern = problem.patterns?.[0]?.pattern || problem.topicTags?.[0] || "Core concepts";
      counts.set(pattern, (counts.get(pattern) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [solvedProblems]);

  const dailyChallenge = useMemo(() => {
    const pool = problems.filter((problem) => problem.judgeAvailable);
    const source = pool.length ? pool : problems;
    if (!source.length) return null;
    return source[Math.floor(Date.now() / DAY_MS) % source.length];
  }, []);

  const sheetProgress = problems.length ? Math.round((completed.length / problems.length) * 100) : 0;
  const bookmarkedProblems = bookmarks.map((slug) => problemBySlug.get(slug)).filter(Boolean);
  const initials = userName.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "ME";
  const boardName = userName ? `${userName} (You)` : "You";

  return (
    <main className="dsa-global-dashboard">
      <header className="dsa-gd-head">
        <h1>Global Dashboard</h1>
        <p>Global dashboard reflecting your stats across the DSA track.</p>
      </header>

      <nav className="dsa-gd-tabs" aria-label="Dashboard views">
        {[["summary", "Summary"], ["metrics", "Metrics"], ["bookmarks", "Bookmarks"]].map(([id, label]) => (
          <button key={id} type="button" className={tab === id ? "is-active" : ""} onClick={() => setTab(id)}>{label}</button>
        ))}
      </nav>

      {tab === "summary" && (
        <>
          <section className="dsa-gd-stats">
            <StatCard
              icon={<TrophyIcon size={20} />}
              label="Platform Rank"
              value={rank}
              caption={nextTier ? `${nextTier.min - score} to ${nextTier.label}` : "Top tier"}
              onAction={() => setTab("metrics")}
            />
            <StatCard
              icon={<ScoreboardIcon size={20} />}
              label="Platform Score"
              value={score}
              caption="Total coins earned"
              onAction={() => setTab("metrics")}
            />
            <StatCard
              icon={<FireIcon size={20} />}
              label="Platform Streak"
              value={streak}
              caption="days"
              tone="muted"
            />
            <StatCard
              icon={<FireIcon size={20} />}
              label="Daily Challenge"
              caption={dailyChallenge ? dailyChallenge.difficulty || "Unrated" : "Stay tuned"}
              tone="muted"
            >
              {dailyChallenge
                ? <button type="button" className="dsa-gd-stat-value is-link" onClick={() => onOpenProblem(dailyChallenge.slug)}>{dailyChallenge.title}</button>
                : <p className="dsa-gd-stat-value is-brand">Coming Soon</p>}
            </StatCard>
          </section>

          <div className="dsa-gd-grid">
            <Panel
              className="span-3"
              title="Rank & Score progress"
              subtitle="Coins earned per day across the selected period"
              actions={
                <>
                  <span className="dsa-gd-badge tone-blue"><TrophyIcon size={16} /> Rank : {rank}</span>
                  <span className="dsa-gd-badge tone-purple"><ScoreboardIcon size={16} /> Score : {score}</span>
                  <PeriodSelect value={period} onChange={setPeriod} />
                </>
              }
            >
              <div className="dsa-gd-chart-wrap">
                <ScoreBars bars={bars} empty={!hasChartData} />
                {!hasChartData && (
                  <div className="dsa-gd-chart-overlay">
                    <h4>Nothing to show here</h4>
                    <p>There is no data to show here yet, because you haven&apos;t solved any problems in this period.</p>
                  </div>
                )}
              </div>
            </Panel>

            <Panel className="span-1" title="Streak" subtitle="Days you submitted an accepted solution">
              <StreakCalendar daySet={daySet} />
            </Panel>

            <Panel
              className="span-2"
              title="Sheets"
              subtitle="Your structured practice progress"
              actions={
                <>
                  <PeriodSelect value={sheetPeriod} onChange={setSheetPeriod} />
                  <button type="button" className="dsa-gd-link" onClick={() => onNavigate("sheet")}>See All <Lock size={13} /></button>
                </>
              }
            >
              {completed.length ? (
                <button type="button" className="dsa-gd-sheet" onClick={() => onNavigate("sheet")}>
                  <span><FileText size={22} /></span>
                  <div>
                    <small>INTERVIEW PREPARATION</small>
                    <b>Zero to Hero 450</b>
                    <p>{completed.length} of {problems.length} solved · {sheetSolvedInPeriod} in this period</p>
                    <i><u style={{ width: `${sheetProgress}%` }} /></i>
                  </div>
                  <strong>{sheetProgress}%</strong>
                </button>
              ) : (
                <EmptyState icon={FileText} title="No sheets" body="No sheet progress in this period, or nothing started yet." />
              )}
            </Panel>

            <Panel
              className="span-2"
              title="Monthly Leaderboard"
              subtitle="Ranked by coins earned"
              actions={<button type="button" className="dsa-gd-link" onClick={() => setTab("metrics")}>See All</button>}
            >
              <div className="dsa-gd-board">
                <div className="dsa-gd-board-head"><span>Rank</span><span>Name</span><span>Score</span></div>
                <div className="dsa-gd-board-body">
                  <EmptyState
                    icon={Target}
                    title="Global ranks aren't live yet"
                    body="Leaderboard standings need a shared backend. Your own score is tracked below and will slot in once ranking is enabled."
                  />
                </div>
                <div className="dsa-gd-board-row is-you">
                  <span>–</span>
                  <span><i>{initials}</i><b>{boardName}</b></span>
                  <span>{score}</span>
                </div>
              </div>
            </Panel>

            <Panel
              className="span-4"
              title="Recent Activities"
              subtitle="Your latest accepted submissions"
              actions={<PeriodSelect value={activityPeriod} onChange={setActivityPeriod} />}
            >
              {recentActivities.length ? (
                <ul className="dsa-gd-activity">
                  {recentActivities.slice(0, 6).map((submission) => (
                    <li key={`${submission.problemId}-${submission.submittedAt}`}>
                      <button type="button" onClick={() => onOpenProblem(submission.problemId)}>
                        <span><Activity size={15} /></span>
                        <div>
                          <b>{submission.title}</b>
                          <small>{submission.pattern || "Practice"} · {submission.passedTests || 0}/{submission.totalTests || 0} tests</small>
                        </div>
                        <time>{new Date(submission.submittedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</time>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState icon={Activity} title="No recent activities" body="Start solving to see your activity history here." />
              )}
            </Panel>
          </div>
        </>
      )}

      {tab === "metrics" && (
        <div className="dsa-gd-grid">
          <Panel className="span-2" title="Difficulty breakdown" subtitle="Solved against what the catalog offers">
            <ul className="dsa-gd-bars">
              {difficultyBreakdown.map(({ key, solved, total }) => (
                <li key={key}>
                  <span className={`dsa-gd-diff ${key}`}>{key}</span>
                  <i><u className={key} style={{ width: `${total ? (solved / total) * 100 : 0}%` }} /></i>
                  <b>{solved}<small>/{total}</small></b>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="span-2" title="Strongest patterns" subtitle="Where most of your solves land">
            {patternBreakdown.length ? (
              <ul className="dsa-gd-patterns">
                {patternBreakdown.map(([pattern, count]) => (
                  <li key={pattern}>
                    <b>{pattern}</b>
                    <i><u style={{ width: `${(count / patternBreakdown[0][1]) * 100}%` }} /></i>
                    <small>{count}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={Target} title="No pattern data yet" body="Solve a few problems and your strongest patterns will surface here." />
            )}
          </Panel>

          <Panel className="span-4" title="Coverage" subtitle="How much of the catalog you have worked through">
            <div className="dsa-gd-coverage">
              <div><b>{completed.length}</b><small>Solved</small></div>
              <div><b>{problems.length - completed.length}</b><small>Remaining</small></div>
              <div><b>{score}</b><small>Coins</small></div>
              <div><b>{daySet.size}</b><small>Active days</small></div>
              <div><b>{bookmarks.length}</b><small>Bookmarked</small></div>
            </div>
          </Panel>
        </div>
      )}

      {tab === "bookmarks" && (
        <div className="dsa-gd-grid">
          <Panel
            className="span-4"
            title="Bookmarks"
            subtitle={`${bookmarkedProblems.length} saved ${bookmarkedProblems.length === 1 ? "problem" : "problems"}`}
            actions={<button type="button" className="dsa-gd-link" onClick={() => onNavigate("problems")}>Browse problems</button>}
          >
            {bookmarkedProblems.length ? (
              <ul className="dsa-gd-bookmarks">
                {bookmarkedProblems.map((problem) => (
                  <li key={problem.slug}>
                    <button type="button" onClick={() => onOpenProblem(problem.slug)}>
                      <span><Bookmark size={14} /></span>
                      <b>{problem.title}</b>
                      <small>{problem.patterns?.[0]?.pattern || "Core concepts"}</small>
                      <em className={`dsa-gd-diff ${problem.difficulty?.toLowerCase() || "easy"}`}>{problem.difficulty || "Unrated"}</em>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={Bookmark} title="No bookmarks yet" body="Save a problem from the question list and it will show up here." />
            )}
          </Panel>
        </div>
      )}
    </main>
  );
}
