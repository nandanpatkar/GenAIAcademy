import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search, X, ChevronRight, ChevronDown, ArrowLeft, ArrowRight,
  PanelLeft, Trophy, Flame, Info, CheckCircle2, RefreshCw,
} from "lucide-react";
import {
  DS_BASE_PATH, DS_TRACKS, DS_EXERCISES, DS_TOTALS, DS_HOME, DS_LESSON_ORDER,
  getLesson, getLessonExercises,
} from "../data/dataScienceCourseData";
import "../styles/DataScienceCourse.css";

/* Data Science Labs, read in-app.
 *
 * The course is a mirrored React SPA served from /datascience/. Its lesson
 * prose and its 111 step-through animations only exist inside its own bundle,
 * and the exercises are graded by running real Python in a Pyodide worker — so
 * the lesson body itself is rendered in a frame rather than rebuilt here.
 *
 * Everything around the frame is native, in the same two modes as the Visual
 * Learning viewer: a home screen listing the four tracks (no rail — the tracks
 * live on the page), and a track view whose rail holds only that track's own
 * modules. The frame is same-origin (vercel.json rewrites /datascience/* to
 * the R2 worker), which is what lets this component strip the mirror's chrome,
 * follow navigation that happens inside it, and read the real solved-exercise
 * set it writes.
 *
 * The reading surface stays dark in both app themes: the mirror ships no light
 * palette, and a light rail bolted to a dark frame reads as broken. Same call
 * LearnBugEmbed makes.
 */

/* The mirror's own progress key. Values are exercise slugs, globally unique
   across all 382, so they map straight onto the extracted data. */
const SOLVED_KEY = "pandaslabs:solved:v1";
const LS_LAST_LESSON = "ds_labs_last_lesson";
const LS_STREAK = "ds_labs_streak";

/* Injected into the frame once it loads: the mirror's header duplicates this
   component's rail and its footer repeats on every one of the 505 pages. The
   article's own title block goes too — unlike the Visual Learning mirror it
   carries nothing but the title, tagline and tags, which the rail and the
   breadcrumb already give. The decorative art stays: it is a background wash
   behind the lesson, not chrome. */
const FRAME_CHROME_CSS = `
  #root > div > header,
  #root > div > footer,
  #root > div > main > article > header { display: none !important; }
  #root > div > main > article, #root > div > main > div { padding-top: 4px; }
  body { background: transparent !important; }
`;

function readSolved() {
  try {
    const raw = localStorage.getItem(SOLVED_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

/* Consecutive days on which at least one lesson was opened. Stored as the last
   day seen plus a count, so it needs no history and survives a closed tab. */
function bumpStreak() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const saved = JSON.parse(localStorage.getItem(LS_STREAK) || "{}");
    if (saved.day === today) return saved.count || 1;

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const count = saved.day === yesterday ? (saved.count || 0) + 1 : 1;
    localStorage.setItem(LS_STREAK, JSON.stringify({ day: today, count }));
    return count;
  } catch {
    return 0;
  }
}

function readStreak() {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_STREAK) || "{}");
    if (!saved.day) return 0;
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    return saved.day === today || saved.day === yesterday ? saved.count || 0 : 0;
  } catch {
    return 0;
  }
}

function trackProgress(track, solved) {
  const slugs = DS_EXERCISES.filter((e) => e.track === track.id).map((e) => e.slug);
  const done = slugs.filter((s) => solved.has(s)).length;
  return { done, total: slugs.length, pct: slugs.length ? done / slugs.length : 0 };
}

function lessonProgress(trackId, lesson, solved) {
  const slugs = getLessonExercises(trackId, lesson.slug).map((e) => e.slug);
  const done = slugs.filter((s) => solved.has(s)).length;
  return { done, total: slugs.length, complete: slugs.length > 0 && done === slugs.length };
}

function ProgressRing({ value, size = 30, stroke = 3 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg className="ds-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ds-line)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="var(--ds-accent)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - value)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export default function DataScienceCourse({ onClose }) {
  // No track selected means the home screen; the rail only exists inside one.
  const [trackId, setTrackId] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [openModules, setOpenModules] = useState({});
  const [query, setQuery] = useState("");
  const [solved, setSolved] = useState(readSolved);
  const [streak, setStreak] = useState(readStreak);
  const [showStreakInfo, setShowStreakInfo] = useState(false);
  const [railOpen, setRailOpen] = useState(true);
  const [frameLoading, setFrameLoading] = useState(false);
  const [frameKey, setFrameKey] = useState(0);

  const frameRef = useRef(null);
  const searchRef = useRef(null);
  const track = useMemo(() => DS_TRACKS.find((t) => t.id === trackId) || null, [trackId]);
  const lesson = activePath ? getLesson(activePath) : null;

  /* The frame writes the solved set from its own document, so a `storage`
     event does reach this one — same origin, different document. */
  useEffect(() => {
    const sync = (event) => {
      if (!event || event.key === SOLVED_KEY || event.key === null) setSolved(readSolved());
    };
    const onFocus = () => setSolved(readSolved());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    if (!activePath) return;
    try { localStorage.setItem(LS_LAST_LESSON, activePath); } catch { /* private mode */ }
  }, [activePath]);

  /* Open the branch holding the lesson the reader lands on. */
  useEffect(() => {
    if (!lesson) return;
    setOpenModules((prev) => ({ ...prev, [`${lesson.track.id}:${lesson.module.number}`]: true }));
  }, [lesson]);

  /* ⌘K focuses the rail's search, matching the badge shown on it. */
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setRailOpen(true);
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openLesson = useCallback((path) => {
    const found = getLesson(path);
    if (!found) return;
    setActivePath(path);
    setTrackId(found.track.id);
    setFrameLoading(true);
    setQuery("");
    setStreak(bumpStreak());
  }, []);

  const openTrack = useCallback((id) => {
    const found = DS_TRACKS.find((t) => t.id === id);
    if (!found) return;
    setTrackId(id);
    setOpenModules({ [`${id}:1`]: true });
    if (found.entry) openLesson(found.entry);
  }, [openLesson]);

  const goHome = useCallback(() => {
    setTrackId(null);
    setActivePath(null);
    setQuery("");
  }, []);

  /* Strip the mirror's chrome, and follow any navigation that happens inside
     the frame so the rail and pager never fall out of step with it. */
  const onFrameLoad = useCallback(() => {
    setFrameLoading(false);
    let doc;
    try { doc = frameRef.current?.contentDocument; } catch { doc = null; }
    if (!doc) return;

    if (!doc.getElementById("ds-embed-style")) {
      const style = doc.createElement("style");
      style.id = "ds-embed-style";
      style.textContent = FRAME_CHROME_CSS;
      doc.head?.appendChild(style);
    }

    const inner = doc.location?.pathname?.replace(`${DS_BASE_PATH}/`, "").replace(/\.html$/, "");
    if (inner && getLesson(inner) && inner !== activePath) {
      setActivePath(inner);
      setTrackId(inner.split("/")[0]);
    }
    setSolved(readSolved());
  }, [activePath]);

  const order = DS_LESSON_ORDER;
  const index = activePath ? order.indexOf(activePath) : -1;
  const prev = index > 0 ? getLesson(order[index - 1]) : null;
  const next = index >= 0 && index < order.length - 1 ? getLesson(order[index + 1]) : null;

  /* Search is scoped to the open track — the rail only ever shows one. */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2 || !track) return null;
    const lessons = [];
    track.modules.forEach((m) => m.lessons.forEach((l) => {
      if (`${l.title} ${l.tagline} ${l.covers.join(" ")}`.toLowerCase().includes(q)) {
        lessons.push({ ...l, module: m });
      }
    }));
    // Prompts are written as natural tasks ("Return the shape of cups"), so a
    // term like "groupby" appears in the lesson that teaches it but in none of
    // its exercises. Matching the parent title too keeps those reachable.
    const exercises = DS_EXERCISES.filter(
      (e) => e.track === track.id && `${e.prompt} ${e.lessonTitle}`.toLowerCase().includes(q),
    ).slice(0, 30);
    return { lessons: lessons.slice(0, 30), exercises };
  }, [query, track]);

  const overall = useMemo(() => {
    const done = DS_EXERCISES.filter((e) => solved.has(e.slug)).length;
    return { done, total: DS_EXERCISES.length, pct: done / DS_EXERCISES.length };
  }, [solved]);

  const stats = track ? trackProgress(track, solved) : null;

  return (
    <section className={`ds-root${track ? "" : " ds-home-mode"}`}>
      {/* ── navigation rail: only inside a track ── */}
      {track ? (
        <aside className={`ds-rail${railOpen ? "" : " ds-rail--closed"}`}>
          <div className="ds-search">
            <Search size={15} />
            <input
              ref={searchRef}
              type="search"
              value={query}
              placeholder="Search…"
              onChange={(event) => setQuery(event.target.value)}
            />
            {query
              ? <button type="button" onClick={() => setQuery("")} title="Clear"><X size={13} /></button>
              : <kbd>⌘K</kbd>}
          </div>

          <div className="ds-streak-row">
            <div className="ds-streak">
              <Flame size={15} className={streak ? "ds-streak-lit" : ""} />
              <strong>{streak}</strong>
              <span>day streak</span>
            </div>
            <button
              type="button"
              className="ds-streak-info"
              aria-label="What counts as a streak"
              onClick={() => setShowStreakInfo((v) => !v)}
            >
              <Info size={15} />
            </button>
          </div>
          {showStreakInfo ? (
            <p className="ds-streak-note">
              Counts each day you open a lesson. Miss a day and it resets.
            </p>
          ) : null}

          <div className="ds-tree">
            {results ? (
              <div className="ds-results">
                {results.lessons.length ? (
                  <p className="ds-rail-label">{results.lessons.length} lessons</p>
                ) : null}
                {results.lessons.map((l) => (
                  <button key={l.path} type="button" className="ds-result" onClick={() => openLesson(l.path)}>
                    <strong>{l.title}</strong>
                    <span>{l.module.title}</span>
                  </button>
                ))}
                {results.exercises.length ? (
                  <p className="ds-rail-label">{results.exercises.length} exercises</p>
                ) : null}
                {results.exercises.map((e) => (
                  <button
                    key={`${e.track}/${e.slug}`}
                    type="button"
                    className="ds-result ds-result--ex"
                    onClick={() => openLesson(`${e.track}/${e.lessonSlug}`)}
                  >
                    <strong>{e.prompt}</strong>
                    <span>{e.lessonTitle}</span>
                  </button>
                ))}
                {!results.lessons.length && !results.exercises.length ? (
                  <p className="ds-empty">Nothing matches “{query}”.</p>
                ) : null}
              </div>
            ) : (
              track.modules.map((module) => {
                const key = `${track.id}:${module.number}`;
                const open = openModules[key] ?? false;
                return (
                  <div key={key} className="ds-module">
                    <button
                      type="button"
                      className="ds-module-head"
                      aria-expanded={open}
                      onClick={() => setOpenModules((prev) => ({ ...prev, [key]: !open }))}
                    >
                      <span className="ds-caret">
                        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </span>
                      <span className="ds-module-title">{module.title}</span>
                      {open ? null : <span className="ds-module-count">({module.lessons.length})</span>}
                    </button>
                    {open ? (
                      <ol className="ds-lessons">
                        {module.lessons.map((l) => {
                          const p = lessonProgress(track.id, l, solved);
                          return (
                            <li key={l.path}>
                              <button
                                type="button"
                                className={`ds-lesson${l.path === activePath ? " is-active" : ""}${p.complete ? " is-done" : ""}`}
                                onClick={() => openLesson(l.path)}
                              >
                                <span className="ds-lesson-title">
                                  {l.isCapstone ? <Trophy size={12} className="ds-capstone" /> : null}
                                  {l.title}
                                  {p.complete ? <CheckCircle2 size={13} className="ds-done" /> : null}
                                </span>
                                <span className="ds-lesson-sub">
                                  {l.tagline}
                                </span>
                                {p.total ? (
                                  <span className="ds-lesson-meta">{l.minutes} min · {p.done}/{p.total} solved</span>
                                ) : null}
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </aside>
      ) : null}

      {/* ── reading pane ── */}
      <section className="ds-main">
        <header className="ds-topbar">
          {track ? (
            <button
              type="button"
              className="ds-icon-btn"
              onClick={() => setRailOpen((value) => !value)}
              title="Toggle navigation"
            >
              <PanelLeft size={15} />
            </button>
          ) : null}

          <nav className="ds-crumb" aria-label="Breadcrumb">
            <button type="button" onClick={goHome}>Data Science</button>
            {track ? (
              <>
                <ChevronRight size={11} />
                <button type="button" onClick={() => setActivePath(null)}>{track.name}</button>
              </>
            ) : null}
            {lesson ? (
              <>
                <ChevronRight size={11} />
                <strong>{lesson.title}</strong>
              </>
            ) : null}
          </nav>

          <div className="ds-topbar-end">
            {lesson ? (
              <button
                type="button"
                className="ds-icon-btn"
                onClick={() => { setFrameLoading(true); setFrameKey((k) => k + 1); }}
                title="Reload lesson"
              >
                <RefreshCw size={14} />
              </button>
            ) : null}
            {onClose ? (
              <button type="button" className="ds-icon-btn" onClick={onClose} title="Close">
                <X size={15} />
              </button>
            ) : null}
          </div>
        </header>

        {lesson ? (
          <>
            <div className="ds-lesson-head">
              <p className="ds-eyebrow">
                {lesson.isCapstone ? "Capstone" : `Lesson ${lesson.number}`}
                <span className="ds-dot">·</span>
                {lesson.minutes} min
                {lesson.exercises ? (
                  <>
                    <span className="ds-dot">·</span>
                    {lessonProgress(track.id, lesson, solved).done}/{lesson.exercises} exercises
                  </>
                ) : null}
              </p>
              <h1>{lesson.title}</h1>
              <p className="ds-lede">{lesson.tagline}</p>
              {lesson.covers.length ? (
                <div className="ds-covers">
                  {lesson.covers.map((c) => <code key={c}>{c}</code>)}
                </div>
              ) : null}
            </div>

            <div className="ds-frame-wrap">
              {frameLoading ? <div className="ds-frame-loading">Loading lesson…</div> : null}
              <iframe
                key={`${lesson.path}:${frameKey}`}
                ref={frameRef}
                className="ds-frame"
                src={`${DS_BASE_PATH}/${lesson.path}`}
                title={`${lesson.title} — ${track.name}`}
                onLoad={onFrameLoad}
              />
            </div>

            <nav className="ds-pager" aria-label="Lesson navigation">
              {prev ? (
                <button type="button" onClick={() => openLesson(prev.path)}>
                  <ArrowLeft size={13} />
                  <span><em>Previous</em>{prev.title}</span>
                </button>
              ) : <span />}
              {next ? (
                <button type="button" className="ds-pager-next" onClick={() => openLesson(next.path)}>
                  <span><em>Next</em>{next.title}</span>
                  <ArrowRight size={13} />
                </button>
              ) : <span />}
            </nav>
          </>
        ) : track ? (
          /* A track opened but no lesson chosen — its modules, as cards. */
          <div className="ds-landing">
            <header className="ds-hero">
              <p className="ds-eyebrow">{track.name}</p>
              <h1>{track.tagline}</h1>
              <div className="ds-hero-stats">
                <div><strong>{track.lessonCount}</strong><span>lessons</span></div>
                <div><strong>{track.exerciseCount}</strong><span>graded exercises</span></div>
                <div><strong>{track.capstoneCount}</strong><span>capstones</span></div>
                <div><strong>{Math.round(track.minutes / 60)}h</strong><span>of material</span></div>
                <div className="ds-hero-progress">
                  <ProgressRing value={stats.pct} size={38} />
                  <span>{stats.done}/{stats.total} solved</span>
                </div>
              </div>
            </header>

            <div className="ds-modules">
              {track.modules.map((module) => (
                <section key={module.number} className="ds-module-card">
                  <div className="ds-module-card-head">
                    <span className="ds-module-num">Module {module.number}</span>
                    <h2>{module.title}</h2>
                    <p>{module.tagline}</p>
                  </div>
                  <ol>
                    {module.lessons.map((l) => {
                      const p = lessonProgress(track.id, l, solved);
                      return (
                        <li key={l.path}>
                          <button
                            type="button"
                            className={l.isCapstone ? "ds-card ds-card--capstone" : "ds-card"}
                            onClick={() => openLesson(l.path)}
                          >
                            <span className="ds-card-mark">
                              {p.complete ? <CheckCircle2 size={15} className="ds-done" />
                                : l.isCapstone ? <Trophy size={14} />
                                : <span className="ds-num">{l.number}</span>}
                            </span>
                            <span className="ds-card-body">
                              <strong>{l.title}</strong>
                              <span>{l.tagline}</span>
                            </span>
                            <span className="ds-card-meta">
                              <span>{l.minutes} min</span>
                              {l.exercises ? <span>{p.done}/{l.exercises}</span> : null}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              ))}
            </div>
          </div>
        ) : (
          /* ── home: the tracks live here, not in the rail ── */
          <div className="ds-landing ds-home">
            <header className="ds-home-hero">
              {/* The source bleeds the social-card illustration in from the
                  right behind the headline, masked so it never fights the
                  text. Decorative only, hence aria-hidden. */}
              <div className="ds-home-art" aria-hidden="true">
                <img src={`${DS_BASE_PATH}/art/social-card.webp`} alt="" />
              </div>
              <p className="ds-home-eyebrow">{DS_HOME.eyebrow}</p>
              <h1>
                {DS_HOME.title.map((line) => <span key={line}>{line}</span>)}
              </h1>
              <p className="ds-home-lede">{DS_HOME.lede}</p>
              <div className="ds-home-cta">
                <button type="button" className="ds-cta" onClick={() => openTrack("numpy")}>
                  Start with NumPy <ArrowRight size={15} />
                </button>
                <span className="ds-home-stats">
                  <span><strong>{DS_TOTALS.lessons}</strong> lessons</span>
                  <span><strong>{DS_TOTALS.exercises}</strong> graded</span>
                  <span><strong>{overall.done}</strong> solved</span>
                  {streak ? <span><strong>{streak}</strong> day streak</span> : null}
                </span>
              </div>
            </header>

            <div className="ds-section-head">
              <h2>{DS_HOME.tracksTitle}</h2>
              <p>{DS_HOME.tracksLede}</p>
            </div>

            <div className="ds-track-grid">
              {DS_TRACKS.map((t) => {
                const p = trackProgress(t, solved);
                return (
                  <button
                    key={t.id}
                    type="button"
                    className="ds-track-card"
                    style={{ "--card-accent": `var(--ds-c-${t.accent})` }}
                    onClick={() => openTrack(t.id)}
                  >
                    {/* Each track carries its own chapter illustration across
                        the top of the card, faded out downward. */}
                    <img className="ds-card-art" src={`${DS_BASE_PATH}/art/${t.art}`} alt="" aria-hidden="true" />
                    <div className="ds-track-card-head">
                      <h2>{t.name}</h2>
                      <span className="ds-track-lessons">{t.lessonCount} lessons</span>
                    </div>
                    <p className="ds-track-tagline">{t.tagline}</p>
                    {/* The source card names its opening lessons, then counts
                        off the rest — a table of contents in miniature. */}
                    <ol className="ds-track-preview">
                      {t.preview.map((title) => <li key={title}>{title}</li>)}
                      {t.previewMore ? <li className="ds-preview-more">+{t.previewMore} more</li> : null}
                    </ol>
                    <div className="ds-track-card-foot">
                      <span className="ds-track-bar">
                        <span style={{ width: `${Math.round(p.pct * 100)}%` }} />
                      </span>
                      <span className="ds-track-summary">{p.done}/{p.total}</span>
                      <span className="ds-enter">Enter →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
