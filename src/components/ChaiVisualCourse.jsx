import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search, X, ChevronRight, ChevronDown, ArrowLeft, ArrowRight,
  PanelLeft, Flame, Info, RefreshCw, ArrowUpRight,
} from "lucide-react";
import {
  CV_TRACKS, CV_EXTRAS, CV_TOTALS, CV_HOME, CV_LESSON_ORDER, getLesson,
} from "../data/chaiVisualCourseData";
import { useTheme } from "../contexts/ThemeContext";
import { useLegacyValue } from "../pages/dsa/prep/hooks";
import VisualLessonFrame from "./visual/VisualLessonFrame";
import {
  VISUAL_KEYS, bumpStreak, markWatched, readStreak, rememberLastLesson, trackStats,
} from "./visual/visualProgress";
import "../styles/ChaiVisualCourse.css";

/* Visual Learning, read in-app.
 *
 * A mirrored Next.js course — DSA patterns, low-level design, networking and
 * operating systems — served from /chai-visual/. Its lessons are prerendered,
 * but the teaching happens in canvas animations driven by its own bundle, so
 * a lesson renders in a frame (VisualLessonFrame) rather than being rebuilt.
 * The same frame, progress and palette are used by DSA › Learn › Visual
 * Learning, so a lesson watched in either place counts in both.
 *
 * Everything around the frame is native. The shell has two modes, mirroring
 * how the original site is organised: a home screen listing the four tracks
 * (the rail is hidden there — the tracks live on the page, not in the nav),
 * and a track view whose rail holds only that track's own sections.
 */

function ProgressRing({ value, size = 30, stroke = 3 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg className="cv-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--cv-line)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="var(--cv-accent)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - value)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export default function ChaiVisualCourse({ onClose }) {
  const { theme } = useTheme();
  const dark = theme !== "light";

  // No track selected means the home screen; the rail only exists inside one.
  const [trackId, setTrackId] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [extraPath, setExtraPath] = useState(null);
  const [openGroups, setOpenGroups] = useState({});
  const [query, setQuery] = useState("");
  const readList = useLegacyValue(VISUAL_KEYS.read, []);
  const read = useMemo(() => new Set(Array.isArray(readList) ? readList : []), [readList]);
  const [streak, setStreak] = useState(readStreak);
  const [showStreakInfo, setShowStreakInfo] = useState(false);
  const [railOpen, setRailOpen] = useState(true);
  const [frameKey, setFrameKey] = useState(0);

  const searchRef = useRef(null);
  const track = useMemo(() => CV_TRACKS.find((t) => t.id === trackId) || null, [trackId]);
  const lesson = activePath ? getLesson(activePath) : null;
  const extra = extraPath ? CV_EXTRAS.find((e) => e.path === extraPath) : null;

  const openLesson = useCallback((path) => {
    const found = getLesson(path);
    if (!found) return;
    setExtraPath(null);
    setActivePath(path);
    setTrackId(found.track.id);
    setQuery("");
    setStreak(bumpStreak());
  }, []);

  const openTrack = useCallback((id) => {
    const found = CV_TRACKS.find((t) => t.id === id);
    if (!found) return;
    setExtraPath(null);
    setTrackId(id);
    setOpenGroups({ [`${id}:${found.groups[0]?.title}`]: true });
    if (found.entry) openLesson(found.entry);
  }, [openLesson]);

  const goHome = useCallback(() => {
    setTrackId(null);
    setActivePath(null);
    setExtraPath(null);
    setQuery("");
  }, []);

  useEffect(() => {
    if (!activePath) return;
    rememberLastLesson(activePath);
  }, [activePath]);

  useEffect(() => {
    if (!lesson) return;
    setOpenGroups((prev) => ({ ...prev, [`${lesson.track.id}:${lesson.group.title}`]: true }));
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

  const order = CV_LESSON_ORDER;
  const index = activePath ? order.indexOf(activePath) : -1;
  const prev = index > 0 ? getLesson(order[index - 1]) : null;
  const next = index >= 0 && index < order.length - 1 ? getLesson(order[index + 1]) : null;

  /* Search is scoped to the open track — the rail only ever shows one. */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2 || !track) return null;
    const hits = [];
    track.groups.forEach((g) => g.items.forEach((item) => {
      if (`${item.title} ${item.subtitle} ${g.title}`.toLowerCase().includes(q)) {
        hits.push({ ...item, group: g });
      }
    }));
    return hits.slice(0, 60);
  }, [query, track]);

  const stats = track ? trackStats(track, read) : null;
  const inFrame = Boolean(lesson || extra);

  return (
    <section className={`cv-root${dark ? " cv-dark" : ""}${track ? "" : " cv-home-mode"}`}>
      {/* ── navigation rail: only inside a track ── */}
      {track ? (
        <aside className={`cv-rail${railOpen ? "" : " cv-rail--closed"}`}>
          <div className="cv-search">
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

          <div className="cv-streak-row">
            <div className="cv-streak">
              <Flame size={15} className={streak ? "cv-streak-lit" : ""} />
              <strong>{streak}</strong>
              <span>day streak</span>
            </div>
            <button
              type="button"
              className="cv-streak-info"
              aria-label="What counts as a streak"
              onClick={() => setShowStreakInfo((v) => !v)}
            >
              <Info size={15} />
            </button>
          </div>
          {showStreakInfo ? (
            <p className="cv-streak-note">
              Counts each day you open a lesson. Miss a day and it resets.
            </p>
          ) : null}

          <div className="cv-tree">
            {results ? (
              <div className="cv-results">
                <p className="cv-rail-label">{results.length} matches</p>
                {results.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    className="cv-result"
                    onClick={() => openLesson(item.path)}
                  >
                    <strong>{item.title}</strong>
                    <span>{item.group.title}</span>
                  </button>
                ))}
                {!results.length ? <p className="cv-empty">Nothing matches “{query}”.</p> : null}
              </div>
            ) : (
              track.groups.map((group) => {
                const key = `${track.id}:${group.title}`;
                const open = openGroups[key] ?? false;
                return (
                  <div key={key} className="cv-group">
                    <button
                      type="button"
                      className="cv-group-head"
                      aria-expanded={open}
                      onClick={() => setOpenGroups((prevState) => ({ ...prevState, [key]: !open }))}
                    >
                      <span className="cv-caret">{open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
                      <span className="cv-group-title">{group.title}</span>
                      {open ? null : <span className="cv-group-count">({group.items.length})</span>}
                    </button>
                    {open ? (
                      <ol className="cv-items">
                        {group.items.map((item) => (
                          <li key={item.path}>
                            <button
                              type="button"
                              className={`cv-item${item.path === activePath ? " is-active" : ""}${read.has(item.path) ? " is-read" : ""}`}
                              onClick={() => openLesson(item.path)}
                            >
                              <span className="cv-item-title">{item.title}</span>
                              {item.subtitle ? <span className="cv-item-sub">{item.subtitle}</span> : null}
                            </button>
                          </li>
                        ))}
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
      <section className="cv-main">
        <header className="cv-topbar">
          {track ? (
            <button
              type="button"
              className="cv-icon-btn"
              onClick={() => setRailOpen((value) => !value)}
              title="Toggle navigation"
            >
              <PanelLeft size={15} />
            </button>
          ) : null}

          <nav className="cv-crumb" aria-label="Breadcrumb">
            <button type="button" onClick={goHome}>Visual Learning</button>
            {track ? (
              <>
                <ChevronRight size={11} />
                <button type="button" onClick={() => setActivePath(null)}>
                  {track.name.replace(" Visual", "")}
                </button>
              </>
            ) : null}
            {lesson ? (
              <>
                <ChevronRight size={11} />
                <strong>{lesson.title}</strong>
              </>
            ) : null}
            {extra ? (
              <>
                <ChevronRight size={11} />
                <strong>{extra.name}</strong>
              </>
            ) : null}
          </nav>

          <div className="cv-topbar-end">
            {inFrame ? (
              <button
                type="button"
                className="cv-icon-btn"
                onClick={() => setFrameKey((k) => k + 1)}
                title="Reload"
              >
                <RefreshCw size={14} />
              </button>
            ) : null}
            {onClose ? (
              <button type="button" className="cv-icon-btn" onClick={onClose} title="Close">
                <X size={15} />
              </button>
            ) : null}
          </div>
        </header>

        {inFrame ? (
          <>
            {/* No title block here on purpose. The framed lesson has its own
                header — difficulty, the details disclosure, the approach
                switcher and its complexity — and repeating the title above it
                would push all of that below the fold. The toolbar breadcrumb
                already says where you are. */}
            <VisualLessonFrame
              key={`${lesson ? lesson.path : extra.path}:${frameKey}`}
              path={lesson ? lesson.path : extra.path}
              title={lesson ? `${lesson.title} — ${lesson.track.name}` : extra.name}
              dark={dark}
              onNavigate={openLesson}
              onLoaded={lesson ? markWatched : undefined}
            />

            {lesson ? (
              <nav className="cv-pager" aria-label="Lesson navigation">
                {prev ? (
                  <button type="button" onClick={() => openLesson(prev.path)}>
                    <ArrowLeft size={13} />
                    <span><em>Previous</em>{prev.title}</span>
                  </button>
                ) : <span />}
                {next ? (
                  <button type="button" className="cv-pager-next" onClick={() => openLesson(next.path)}>
                    <span><em>Next</em>{next.title}</span>
                    <ArrowRight size={13} />
                  </button>
                ) : <span />}
              </nav>
            ) : null}
          </>
        ) : track ? (
          /* A track opened but no lesson chosen — its sections, as cards. */
          <div className="cv-landing">
            <header className="cv-hero">
              <p className="cv-eyebrow">{track.name}</p>
              <h1>{track.subtitle}</h1>
              <p className="cv-lede">{track.tagline}</p>
              <div className="cv-hero-stats">
                <div><strong>{track.lessonCount}</strong><span>lessons</span></div>
                <div><strong>{track.groupCount}</strong><span>{track.id === "dsa" ? "patterns" : "sections"}</span></div>
                <div className="cv-hero-progress">
                  <ProgressRing value={stats.pct} size={38} />
                  <span>{stats.done}/{stats.total} read</span>
                </div>
              </div>
            </header>

            <div className="cv-groups">
              {track.groups.map((group) => (
                <section key={group.title} className="cv-group-card">
                  <div className="cv-group-card-head">
                    <h2>{group.title}</h2>
                    <span>{group.items.length}</span>
                  </div>
                  <ol>
                    {group.items.map((item) => (
                      <li key={item.path}>
                        <button type="button" className="cv-card" onClick={() => openLesson(item.path)}>
                          <span className="cv-card-body">
                            <strong>{item.title}</strong>
                            {item.subtitle ? <span>{item.subtitle}</span> : null}
                          </span>
                          {item.sections ? <span className="cv-card-meta">{item.sections} sections</span> : null}
                        </button>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </div>
        ) : (
          /* ── home: the tracks live here, not in the rail ── */
          <div className="cv-landing cv-home">
            <header className="cv-home-hero">
              <p className="cv-home-eyebrow">{CV_HOME.eyebrow}</p>
              {/* The site sets the three words on their own lines with the
                  leading letter lifted — D, S, A spelling out the track. */}
              <h1>
                {CV_HOME.title.map((word) => (
                  <span key={word}>
                    <em>{word.charAt(0)}</em>{word.slice(1)}
                  </span>
                ))}
              </h1>
              <p className="cv-home-lede">{CV_HOME.lede}</p>
              <div className="cv-chips cv-home-chips">
                {CV_HOME.chips.map((chip) => <span key={chip}>{chip}</span>)}
              </div>
              <div className="cv-home-cta">
                <button type="button" className="cv-cta" onClick={() => openTrack("dsa")}>
                  Start with DSA <ArrowRight size={15} />
                </button>
                <span className="cv-home-stats">
                  <span><strong>{CV_TOTALS.lessons}</strong> lessons</span>
                  <span><strong>{read.size}</strong> read</span>
                  {streak ? <span><strong>{streak}</strong> day streak</span> : null}
                </span>
              </div>
            </header>

            <section className="cv-pitch">
              <p className="cv-home-eyebrow">{CV_HOME.pitch.eyebrow}</p>
              <h2>{CV_HOME.pitch.title}</h2>
              <p>{CV_HOME.pitch.body}</p>
            </section>

            <div className="cv-section-head">
              <h2>{CV_HOME.tracksTitle}</h2>
              <p>{CV_HOME.tracksLede}</p>
            </div>

            <div className="cv-track-grid">
              {CV_TRACKS.map((t) => {
                const p = trackStats(t, read);
                return (
                  <button key={t.id} type="button" className="cv-track-card" onClick={() => openTrack(t.id)}>
                    <div className="cv-track-card-head">
                      <div>
                        <h2>{t.name}</h2>
                        <p>{t.subtitle}</p>
                      </div>
                      {t.badge ? <span className="cv-badge">{t.badge}</span> : null}
                    </div>
                    <p className="cv-track-tagline">{t.tagline}</p>
                    <div className="cv-chips">
                      {t.chips.map((chip) => <span key={chip}>{chip}</span>)}
                      {t.moreChips ? <span className="cv-chip-more">+{t.moreChips} more</span> : null}
                    </div>
                    <div className="cv-track-card-foot">
                      <span className="cv-track-summary">{t.summary}</span>
                      {p.done ? (
                        <span className="cv-track-progress">
                          <ProgressRing value={p.pct} size={20} stroke={2.5} />
                          {p.done}/{p.total}
                        </span>
                      ) : null}
                      <span className="cv-enter">Enter →</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {CV_EXTRAS.length ? (
              <div className="cv-extras">
                {CV_EXTRAS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="cv-extra-card"
                    onClick={() => setExtraPath(item.path)}
                  >
                    <div className="cv-track-card-head">
                      <div>
                        <h2>{item.name}</h2>
                        <p>{item.subtitle}</p>
                      </div>
                      <span className="cv-badge">{item.badge}</span>
                    </div>
                    <p className="cv-track-tagline">{item.tagline}</p>
                    <div className="cv-chips">
                      {item.chips.map((chip) => <span key={chip}>{chip}</span>)}
                    </div>
                    <div className="cv-track-card-foot">
                      <span className="cv-enter">Open <ArrowUpRight size={13} /></span>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </section>
    </section>
  );
}
