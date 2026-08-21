import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search, X, ChevronRight, ChevronDown, ArrowLeft, ArrowRight,
  PanelLeft, Flame, Info, RefreshCw, Lock, ArrowUpRight,
} from "lucide-react";
import {
  CV_BASE_PATH, CV_TRACKS, CV_EXTRAS, CV_TOTALS, CV_HOME, CV_LESSON_ORDER, getLesson,
} from "../data/chaiVisualCourseData";
import { useTheme } from "../contexts/ThemeContext";
import "../styles/ChaiVisualCourse.css";
import WanderingEyesLoader from "./WanderingEyesLoader";

/* Visual Learning, read in-app.
 *
 * A mirrored Next.js course — DSA patterns, low-level design, networking and
 * operating systems — served from /chai-visual/. Its lessons are prerendered,
 * but the teaching happens in canvas animations driven by its own bundle, so
 * a lesson renders in a frame rather than being rebuilt here.
 *
 * Everything around the frame is native. The shell has two modes, mirroring
 * how the original site is organised: a home screen listing the four tracks
 * (the rail is hidden there — the tracks live on the page, not in the nav),
 * and a track view whose rail holds only that track's own sections.
 *
 * Two things differ from DataScienceCourse, both because this mirror is a
 * Next.js app rather than a React SPA with a patchable router:
 *
 *   - Its <Link>s rewrite to origin-absolute hrefs on hydration, so a click
 *     inside the frame would navigate out of the mount and into the host app's
 *     routes. Clicks are intercepted in the capture phase instead and turned
 *     into frame loads the shell controls.
 *   - It ships a real light palette as well as a dark one, keyed off
 *     data-theme on <html>. That attribute is set on the framed document to
 *     match the app's theme, so unlike Data Science this one follows along.
 */

const LS_PROGRESS = "chai_visual_read";
const LS_LAST_LESSON = "chai_visual_last_lesson";
const LS_STREAK = "chai_visual_streak";
const LOCKED_MARK = /This (?:chapter|pattern|problem|topic) is locked/;

const FRAME_CHROME_CSS = `
  [data-cv-hidden] { display: none !important; }
  main { padding-top: 4px !important; }
`;

/* Strip the mirror's own chrome from a framed lesson.
 *
 * The site uses two different layouts — DSA and LLD nest the lesson under
 * `div.flex.min-h-screen` with a sidebar, while the networking and OS note
 * tracks use `div.min-h-screen.bg-paper` with none — so matching on class
 * paths would need a rule per layout and would rot on any redeploy. Finding
 * the elements by what they are instead survives both.
 *
 * What goes: the sidebars (the rail already navigates), the sign-in and
 * sign-up links, the floating feedback tab, the footer with its legal links,
 * the dead "back to all tracks" links, and any other anchor that would take a
 * reader off to the original site.
 *
 * What deliberately stays is the lesson's own <header>. It looks like chrome
 * but is not: it carries the difficulty badge, the LeetCode reference, the
 * "details" disclosure holding the problem statement and the companies that
 * ask it, the approach switcher, and the time/space complexity for whichever
 * approach is selected. The shell shows no title of its own precisely so this
 * one can stand — the breadcrumb in the toolbar handles identity. */
function stripFrameChrome(doc) {
  doc.querySelectorAll("aside, footer").forEach((el) => el.setAttribute("data-cv-hidden", ""));

  // Hide the auth links themselves rather than the strip that holds them: the
  // same strip carries "Hide solutions", which is a real reading control.
  doc.querySelectorAll('a[href$="/login"], a[href$="/signup"]')
    .forEach((el) => el.setAttribute("data-cv-hidden", ""));

  // "← All chapters" / "← all tracks" go nowhere once clicks are intercepted.
  doc.querySelectorAll("a").forEach((anchor) => {
    if (/^←?\s*all (tracks|chapters)$/i.test(anchor.textContent?.trim() || "")) {
      anchor.setAttribute("data-cv-hidden", "");
    }
  });

  // The note tracks put a branded masthead above the chapter. Remove the strip
  // it sits in, not just the wordmark, or an empty bar is left behind — but
  // never a strip carrying "Hide solutions", which is a real reading control.
  const brand = [...doc.querySelectorAll("a")]
    .find((a) => /^chai\s*visual$/i.test((a.textContent || "").replace(/\s+/g, " ").trim()));
  if (brand) {
    let row = brand;
    while (row.parentElement && row.parentElement !== doc.body
           && row.parentElement.offsetHeight <= 110) {
      row = row.parentElement;
    }
    const keeps = /hide solutions/i.test(row.textContent || "");
    (keeps ? brand : row).setAttribute("data-cv-hidden", "");
  }

  // The feedback tab is a fixed-position button pinned to the right edge. Its
  // label carries a decorative glyph ("✦ Feedback"), so match on containment
  // rather than equality, and require `position: fixed` so no ordinary prose
  // mentioning the word gets caught.
  const view = doc.defaultView;
  doc.querySelectorAll("button, a, div").forEach((el) => {
    if (el.hasAttribute("data-cv-hidden")) return;
    const text = el.textContent || "";
    if (text.length > 40 || !/feedback/i.test(text)) return;
    if (view?.getComputedStyle(el).position === "fixed") {
      el.setAttribute("data-cv-hidden", "");
    }
  });

  // Anything still pointing off-site — legal pages, pricing, the marketing
  // home — is dead weight in an embedded reader and leaks the reader out.
  doc.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href") || "";
    const offsite = /^https?:\/\//.test(href) && !href.includes("dsa.chaicode.com");
    const legal = /\/(privacy|terms|pricing|refund|about|contact)\b/i.test(href);
    if (offsite || legal) anchor.setAttribute("data-cv-hidden", "");
  });
}

/* Next renders the lesson after hydration, so a single pass on load can run
   against a half-built tree — and on the note tracks it always does. Re-running
   over the first couple of seconds catches whatever arrived late; each pass is
   idempotent, since it only sets an attribute. */
function stripFrameChromeSettled(doc) {
  let tries = 0;
  const tick = () => {
    try { stripFrameChrome(doc); } catch { /* frame navigated away */ }
    if (++tries < 12) setTimeout(tick, 250);
  };
  tick();
}

function readProgress() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LS_PROGRESS) || "[]"));
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
    // A gap of more than a day has already broken it, whatever the stored count.
    return saved.day === today || saved.day === yesterday ? saved.count || 0 : 0;
  } catch {
    return 0;
  }
}

function trackStats(track, read) {
  const items = track.groups.flatMap((group) => group.items);
  const done = items.filter((item) => read.has(item.path)).length;
  return { done, total: items.length, pct: items.length ? done / items.length : 0 };
}

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
  const [read, setRead] = useState(readProgress);
  const [streak, setStreak] = useState(readStreak);
  const [showStreakInfo, setShowStreakInfo] = useState(false);
  const [railOpen, setRailOpen] = useState(true);
  const [frameLoading, setFrameLoading] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [lockedInFrame, setLockedInFrame] = useState(false);

  const frameRef = useRef(null);
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
    setFrameLoading(true);
    setLockedInFrame(false);
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
    try { localStorage.setItem(LS_LAST_LESSON, activePath); } catch { /* private mode */ }
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

  const markRead = useCallback((path) => {
    setRead((prev) => {
      if (prev.has(path)) return prev;
      const next = new Set(prev).add(path);
      try { localStorage.setItem(LS_PROGRESS, JSON.stringify([...next])); } catch { /* full */ }
      return next;
    });
  }, []);

  /* Everything that has to happen inside the framed document once it loads:
     hide its chrome, match the app's theme, keep its links on the mount, and
     notice if the page came back as a paywall rather than a lesson. */
  const onFrameLoad = useCallback(() => {
    setFrameLoading(false);
    const doc = (() => {
      try { return frameRef.current?.contentDocument || null; } catch { return null; }
    })();
    if (!doc) return;

    if (!doc.getElementById("cv-embed-style")) {
      const style = doc.createElement("style");
      style.id = "cv-embed-style";
      style.textContent = FRAME_CHROME_CSS;
      doc.head?.appendChild(style);
    }
    doc.documentElement?.setAttribute("data-theme", dark ? "dark" : "light");
    stripFrameChromeSettled(doc);

    setLockedInFrame(LOCKED_MARK.test(doc.body?.innerText || ""));

    // Next's router owns click handling on its own <Link>s, and by this point
    // their hrefs are origin-absolute — following one would leave the mount and
    // land in the host app. Capture-phase on the frame's window runs before
    // React's delegated listener, so the navigation never reaches the router.
    if (!doc.__cvLinkGuard) {
      doc.__cvLinkGuard = true;
      doc.defaultView?.addEventListener(
        "click",
        (event) => {
          const anchor = event.target?.closest?.("a[href]");
          if (!anchor || event.metaKey || event.ctrlKey || event.shiftKey) return;

          const raw = anchor.getAttribute("href") || "";
          if (raw.startsWith("#") || raw.startsWith("mailto:")) return;

          // Anything leaving the course is swallowed rather than followed.
          if (/^https?:\/\//.test(raw) && !raw.includes("dsa.chaicode.com")) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }

          const path = raw
            .replace(/^https?:\/\/dsa\.chaicode\.com/, "")
            .replace(new RegExp(`^${CV_BASE_PATH}`), "")
            .replace(/^\//, "")
            .replace(/\.html$/, "")
            .split("?")[0];

          event.preventDefault();
          event.stopPropagation();
          if (getLesson(path)) openLesson(path);
        },
        true,
      );
    }

    if (activePath) markRead(activePath);
  }, [dark, activePath, markRead, openLesson]);

  /* Follow the app's light/dark switch without reloading the frame. */
  useEffect(() => {
    try {
      frameRef.current?.contentDocument?.documentElement?.setAttribute(
        "data-theme", dark ? "dark" : "light",
      );
    } catch { /* not loaded yet */ }
  }, [dark]);

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
                onClick={() => { setFrameLoading(true); setFrameKey((k) => k + 1); }}
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
            {lockedInFrame ? (
              <div className="cv-locked">
                <Lock size={22} />
                <h2>This lesson is still locked</h2>
                <p>
                  The mirror holds the paywall screen for this page rather than the lesson.
                  Re-run <code>node scripts/fetch_chaivisual_content.mjs</code> while signed
                  in to capture it.
                </p>
              </div>
            ) : null}

            <div className="cv-frame-wrap" hidden={lockedInFrame}>
              {frameLoading ? <div className="cv-frame-loading"><WanderingEyesLoader size={20} label="Loading…" block showLabel /></div> : null}
              <iframe
                key={`${lesson ? lesson.path : extra.path}:${frameKey}`}
                ref={frameRef}
                className="cv-frame"
                src={`${CV_BASE_PATH}/${lesson ? lesson.path : extra.path}.html`}
                title={lesson ? `${lesson.title} — ${lesson.track.name}` : extra.name}
                onLoad={onFrameLoad}
              />
            </div>

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
                    onClick={() => { setExtraPath(item.path); setFrameLoading(true); }}
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
