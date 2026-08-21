import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Search, X, ChevronRight, ChevronDown, ArrowLeft, ArrowRight, List,
  FileText, Clock, Layers, PanelLeft, AlertCircle,
  BadgeCheck, Sparkles, DatabaseZap, Sigma, Boxes, Bot, ShieldCheck,
  Target, CircleCheck, Circle, Filter, Timer,
} from "lucide-react";
import {
  EXAMS_TRACKS, EXAMS_ALL_PAGES, EXAMS_TOTAL_PAGES, EXAMS_DOMAINS,
  EXAMS_CERTIFICATION, EXAMS_STATUS_LABELS,
} from "../data/examsDocsData";
import { makeExamsComponents, examsUrlTransform } from "./ExamsMarkdown";
import { extractToc } from "./LangChainMarkdown";
import { useTheme } from "../contexts/ThemeContext";
import { fetchMarkdown } from "../utils/fetchMarkdown";
import "../styles/ExamsDocs.css";
import WanderingEyesLoader from "./WanderingEyesLoader";

/* The AWS Machine Learning certification notes, read in-app.
 *
 * Layout follows the LangChain docs viewer: a track-scoped nav rail, a measured
 * reading column, and an "on this page" rail. Unlike that one, the sidebar holds
 * a single entry: all seven tracks (Exam Guide / AI Services / Data Engineering
 * / …) live in the switcher at the top of this rail, which is also what the
 * prose needs, since the notes cross-reference between tracks constantly.
 *
 * Two things the docs viewers do not have, because a certification corpus needs
 * them: every note is tagged with the MLA-C01 task statements it covers, so the
 * rail can filter the whole vault down to one exam domain; and pages can be
 * ticked off, so a track landing can show how much of it has been read.
 *
 * Page bodies are fetched from public/exams/md/ on demand and cached for the
 * session.
 */

const LS_RECENT = "exams_docs_recent";
const LS_READ = "exams_docs_read";
const LS_TRACK = "exams_docs_track";

const TRACK_ICONS = {
  BadgeCheck, Sparkles, DatabaseZap, Sigma, Boxes, Bot, ShieldCheck,
};

const PAGE_BY_SLUG = EXAMS_ALL_PAGES.reduce((acc, page) => {
  acc[page.slug] = page;
  return acc;
}, {});

const TRACK_BY_ID = EXAMS_TRACKS.reduce((acc, track) => {
  acc[track.id] = track;
  return acc;
}, {});

/* Nav order, flattened per track, for prev/next. */
const ORDER_BY_TRACK = {};
EXAMS_TRACKS.forEach((track) => {
  const slugs = [];
  const walk = (items) => items.forEach((item) => {
    if (item.slug) slugs.push(item.slug);
    else if (item.items) walk(item.items);
  });
  track.tabs.forEach((tab) => walk(tab.items));
  ORDER_BY_TRACK[track.id] = slugs;
});

/* Which branch of the tree holds a given page — used to auto-open the branch
   the reader lands on, including when they arrive from a cross-reference. */
const BRANCH_BY_SLUG = {};
EXAMS_TRACKS.forEach((track) => {
  track.tabs.forEach((tab, tabIndex) => {
    const walk = (items, trail) => items.forEach((item, index) => {
      if (item.slug) {
        BRANCH_BY_SLUG[item.slug] = { track: track.id, tab: tabIndex, groups: trail };
      } else if (item.items) {
        const key = `${track.id}:${tabIndex}:${trail.length}:${index}:${item.group}`;
        walk(item.items, [...trail, key]);
      }
    });
    walk(tab.items, []);
  });
});

const TASKS = EXAMS_DOMAINS.flatMap((domain) =>
  domain.tasks.map((task) => ({ ...task, domain: domain.id, weight: domain.weight }))
);

const TASK_BY_ID = TASKS.reduce((acc, task) => {
  acc[task.id] = task;
  return acc;
}, {});

/* Reading time at 210 wpm — the notes are dense, so this rounds up. */
const readingMinutes = (words) => Math.max(1, Math.round((words || 0) / 210));

const loadSet = (key) => {
  try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
  catch { return new Set(); }
};

const cache = new Map();

export default function ExamsDocs({ onClose }) {
  const { theme } = useTheme();
  const dark = theme !== "light";

  // The sidebar is one entry, so the track lives here rather than in App's view
  // state — remembered across sessions so reopening lands where you left off.
  const [trackId, setTrackId] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_TRACK);
      if (saved && TRACK_BY_ID[saved]) return saved;
    } catch { /* ignore */ }
    return EXAMS_TRACKS[0].id;
  });
  const [activeSlug, setActiveSlug] = useState(null);
  const [openGroups, setOpenGroups] = useState({});
  const [openTabs, setOpenTabs] = useState({});
  const [query, setQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toc, setToc] = useState([]);
  const [activeHeading, setActiveHeading] = useState(null);
  const [railOpen, setRailOpen] = useState(false);
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_RECENT) || "[]"); } catch { return []; }
  });
  const [read, setRead] = useState(() => loadSet(LS_READ));

  const bodyRef = useRef(null);
  const searchRef = useRef(null);
  const pendingHash = useRef(null);

  const track = TRACK_BY_ID[trackId] || EXAMS_TRACKS[0];
  const activePage = activeSlug ? PAGE_BY_SLUG[activeSlug] : null;

  /* Cross-references move the rail between tracks too, so persist on change
     rather than only when the switcher is clicked. */
  useEffect(() => {
    try { localStorage.setItem(LS_TRACK, trackId); } catch { /* ignore */ }
  }, [trackId]);

  /* ── navigation ── */

  const openPage = useCallback((slug, hash) => {
    const page = PAGE_BY_SLUG[slug];
    if (!page) return;
    pendingHash.current = hash || null;
    setActiveSlug(slug);
    setRailOpen(false);
    setQuery("");

    const branch = BRANCH_BY_SLUG[slug];
    if (branch) {
      setTrackId(branch.track);
      setOpenTabs((prev) => ({ ...prev, [`${branch.track}:${branch.tab}`]: true }));
      setOpenGroups((prev) => {
        const next = { ...prev };
        branch.groups.forEach((key) => { next[key] = true; });
        return next;
      });
    }

    setRecent((prev) => {
      const next = [slug, ...prev.filter((item) => item !== slug)].slice(0, 8);
      try { localStorage.setItem(LS_RECENT, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggleRead = useCallback((slug) => {
    setRead((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      try { localStorage.setItem(LS_READ, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  }, []);

  /* ⌘K / Ctrl-K focuses search. */
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── page body ── */

  useEffect(() => {
    if (!activePage) { setContent(""); setToc([]); setError(null); return undefined; }
    let alive = true;

    const apply = (text) => {
      if (!alive) return;
      setContent(text);
      setToc(extractToc(text));
      setLoading(false);
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      if (pendingHash.current) {
        const id = pendingHash.current;
        pendingHash.current = null;
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };

    if (cache.has(activePage.slug)) { setError(null); apply(cache.get(activePage.slug)); return undefined; }

    setLoading(true);
    setError(null);
    fetchMarkdown(activePage.file)
      .then((text) => { cache.set(activePage.slug, text); apply(text); })
      .catch((err) => { if (alive) { setError(err.message); setLoading(false); } });

    return () => { alive = false; };
  }, [activePage]);

  /* ── scroll spy for the "on this page" rail ── */

  useEffect(() => {
    if (!toc.length || !bodyRef.current) return undefined;
    const targets = toc.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!targets.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActiveHeading(visible[0].target.id);
      },
      { root: bodyRef.current, rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [toc, content]);

  /* ── search ──
     Titles first, then the note's own aliases (the vault keeps them precisely
     so "SageMaker Feature Store" finds a note filed under another name), then
     tags, slug and description. */

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return null;
    return EXAMS_ALL_PAGES
      .map((page) => {
        const title = page.title.toLowerCase();
        let score = 0;
        if (title === needle) score = 100;
        else if (title.startsWith(needle)) score = 80;
        else if (title.includes(needle)) score = 60;
        else if (page.aliases.some((alias) => alias.toLowerCase().includes(needle))) score = 50;
        else if (page.slug.includes(needle.replace(/\s+/g, "-"))) score = 40;
        else if (page.services.some((service) => service.toLowerCase().includes(needle))) score = 30;
        else if (page.tags.some((tag) => tag.includes(needle.replace(/\s+/g, "-")))) score = 25;
        else if ((page.desc || "").toLowerCase().includes(needle)) score = 20;
        if (score && page.track === trackId) score += 5;
        return score ? { ...page, score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 60);
  }, [query, trackId]);

  const filtered = useMemo(() => {
    if (!domainFilter) return null;
    return EXAMS_ALL_PAGES.filter((page) => page.domains.includes(domainFilter));
  }, [domainFilter]);

  /* ── prev / next within the track ── */

  const order = ORDER_BY_TRACK[trackId] || [];
  const position = activeSlug ? order.indexOf(activeSlug) : -1;
  const prevPage = position > 0 ? PAGE_BY_SLUG[order[position - 1]] : null;
  const nextPage = position > -1 && position < order.length - 1
    ? PAGE_BY_SLUG[order[position + 1]] : null;

  const components = useMemo(
    () => makeExamsComponents({
      dark,
      onDocLink: openPage,
      resolveDoc: (slug) => Boolean(PAGE_BY_SLUG[slug]),
    }),
    [dark, openPage]
  );

  const recentPages = recent.map((slug) => PAGE_BY_SLUG[slug]).filter(Boolean);

  /* The filter lives in the rail, so picking a domain from an article body has
     to open the rail and scroll it back to the top as well. */
  const pickDomain = useCallback((taskId) => {
    setDomainFilter((current) => (current === taskId ? null : taskId));
    setQuery("");
    setFilterOpen(true);
    requestAnimationFrame(() => {
      document.querySelector(".ex-rail-body")?.scrollTo({ top: 0 });
    });
  }, []);

  /* ── rail tree ── */

  const renderItems = (items, tabKey, depth, trail) => items.map((item, index) => {
    if (item.slug) {
      const page = PAGE_BY_SLUG[item.slug];
      if (!page) return null;
      const current = item.slug === activeSlug;
      return (
        <button
          key={item.slug}
          type="button"
          className={`ex-nav-page${current ? " ex-nav-page--on" : ""}${read.has(item.slug) ? " ex-nav-page--read" : ""}`}
          style={{ paddingLeft: 14 + depth * 12 }}
          aria-current={current ? "page" : undefined}
          onClick={() => openPage(item.slug)}
        >
          <span>{item.title}</span>
          {read.has(item.slug) ? <CircleCheck size={12} className="ex-nav-tick" /> : null}
        </button>
      );
    }

    const key = `${tabKey}:${trail.length}:${index}:${item.group}`;
    const open = openGroups[key] ?? item.expanded;
    const count = item.items.length;
    return (
      <div key={key} className="ex-nav-group">
        <button
          type="button"
          className="ex-nav-group-head"
          style={{ paddingLeft: 12 + depth * 12 }}
          aria-expanded={open}
          onClick={() => setOpenGroups((prev) => ({ ...prev, [key]: !open }))}
        >
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          <span>{item.group}</span>
          <em className="ex-count">{count}</em>
        </button>
        {open ? renderItems(item.items, tabKey, depth + 1, [...trail, key]) : null}
      </div>
    );
  });

  const TrackIcon = TRACK_ICONS[track.icon] || Layers;

  return (
    <div className={`ex-root${railOpen ? " ex-root--rail" : ""}`} data-theme={dark ? "dark" : "light"}>
      {/* ── left rail ── */}
      <nav className="ex-rail" aria-label="Exams and certification notes">
        <div className="ex-rail-head">
          <div className="ex-brand">
            <span className="ex-brand-mark"><BadgeCheck size={17} /></span>
            <div>
              <strong>{EXAMS_CERTIFICATION.code}</strong>
              <span>AWS ML Engineer · {EXAMS_TOTAL_PAGES} notes</span>
            </div>
            {onClose ? (
              <button type="button" className="ex-icon-btn ex-rail-close" onClick={onClose} title="Close">
                <X size={15} />
              </button>
            ) : null}
          </div>

          <div className="ex-switch">
            {EXAMS_TRACKS.map((item) => {
              const Icon = TRACK_ICONS[item.icon] || Layers;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`ex-switch-btn${item.id === trackId ? " ex-switch-btn--on" : ""}`}
                  style={{ "--tc": item.accent }}
                  onClick={() => { setTrackId(item.id); setActiveSlug(null); setQuery(""); setDomainFilter(null); }}
                  title={item.blurb}
                >
                  <Icon size={14} />
                  <span>{item.short || item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="ex-search">
            <Search size={13} />
            <input
              ref={searchRef}
              value={query}
              placeholder="Search notes…"
              onChange={(event) => { setQuery(event.target.value); if (event.target.value) setDomainFilter(null); }}
              aria-label="Search the certification notes"
            />
            {query
              ? <button type="button" className="ex-icon-btn" onClick={() => setQuery("")}><X size={13} /></button>
              : <kbd>⌘K</kbd>}
          </div>

          <button
            type="button"
            className={`ex-filter-toggle${domainFilter ? " ex-filter-toggle--on" : ""}`}
            aria-expanded={filterOpen || Boolean(domainFilter)}
            onClick={() => setFilterOpen((value) => !value)}
          >
            <Filter size={12} />
            <span>{domainFilter ? `Domain ${domainFilter} · ${TASK_BY_ID[domainFilter]?.label}` : "Filter by exam domain"}</span>
            {filterOpen || domainFilter ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>

          {filterOpen || domainFilter ? (
            <div className="ex-filter">
              {EXAMS_DOMAINS.map((domain) => (
                <div key={domain.id} className="ex-filter-row">
                  <p className="ex-filter-label">
                    Domain {domain.id} · {domain.short}
                    <em>{domain.weight}%</em>
                  </p>
                  <div className="ex-filter-chips">
                    {domain.tasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        className={`ex-chip-sm${domainFilter === task.id ? " ex-chip-sm--on" : ""}`}
                        title={task.label}
                        onClick={() => pickDomain(task.id)}
                      >
                        {task.id}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {domainFilter ? (
                <button type="button" className="ex-clear" onClick={() => setDomainFilter(null)}>
                  <X size={11} /> Clear filter
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="ex-rail-body">
          {results ? (
            <div className="ex-results">
              <p className="ex-rail-label">{results.length} result{results.length === 1 ? "" : "s"}</p>
              {results.map((page) => (
                <button key={page.slug} type="button" className="ex-result" onClick={() => openPage(page.slug)}>
                  <span className="ex-result-title">{page.title}</span>
                  <span className="ex-result-meta">{TRACK_BY_ID[page.track]?.label} · {page.tab}</span>
                </button>
              ))}
              {!results.length ? <p className="ex-empty">Nothing matched “{query}”.</p> : null}
            </div>
          ) : filtered ? (
            <div className="ex-results">
              <p className="ex-rail-label">
                Task {domainFilter} · {filtered.length} note{filtered.length === 1 ? "" : "s"}
              </p>
              <p className="ex-filter-note">{TASK_BY_ID[domainFilter]?.label}</p>
              {filtered.map((page) => (
                <button key={page.slug} type="button" className="ex-result" onClick={() => openPage(page.slug)}>
                  <span className="ex-result-title">{page.title}</span>
                  <span className="ex-result-meta">{TRACK_BY_ID[page.track]?.label} · {page.tab}</span>
                </button>
              ))}
            </div>
          ) : (
            track.tabs.map((tab, index) => {
              const tabKey = `${trackId}:${index}`;
              const open = openTabs[tabKey] ?? index === 0;
              return (
                <div key={tabKey} className="ex-nav-tab">
                  <button
                    type="button"
                    className={`ex-nav-tab-head${open ? " ex-nav-tab-head--on" : ""}`}
                    aria-expanded={open}
                    onClick={() => setOpenTabs((prev) => ({ ...prev, [tabKey]: !open }))}
                  >
                    {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    <span>{tab.tab}</span>
                  </button>
                  {open ? renderItems(tab.items, tabKey, 0, []) : null}
                </div>
              );
            })
          )}
        </div>
      </nav>

      {railOpen ? <div className="ex-scrim" onClick={() => setRailOpen(false)} /> : null}

      {/* ── reading pane ── */}
      <section className="ex-main">
        <header className="ex-topbar">
          <button type="button" className="ex-icon-btn ex-rail-toggle" onClick={() => setRailOpen((value) => !value)} title="Toggle navigation">
            <PanelLeft size={15} />
          </button>

          <nav className="ex-crumb" aria-label="Breadcrumb">
            <span style={{ "--tc": track.accent }}>{track.label}</span>
            {activePage ? (
              <>
                {/* Single-tab tracks name their one tab after the track, so the
                    crumb would otherwise read "SageMaker AI › SageMaker AI". */}
                {activePage.tab === track.label ? null : (
                  <>
                    <ChevronRight size={11} />
                    <span>{activePage.tab}</span>
                  </>
                )}
                <ChevronRight size={11} />
                <strong>{activePage.title}</strong>
              </>
            ) : null}
          </nav>

          <div className="ex-topbar-end">
            {activePage ? (
              <button
                type="button"
                className={`ex-btn${read.has(activePage.slug) ? " ex-btn--on" : ""}`}
                onClick={() => toggleRead(activePage.slug)}
                title={read.has(activePage.slug) ? "Mark as unread" : "Mark as read"}
              >
                {read.has(activePage.slug) ? <CircleCheck size={12} /> : <Circle size={12} />}
                <span>{read.has(activePage.slug) ? "Read" : "Mark read"}</span>
              </button>
            ) : null}
            {onClose ? (
              <button type="button" className="ex-icon-btn" onClick={onClose} title="Close"><X size={15} /></button>
            ) : null}
          </div>
        </header>

        <div className="ex-scroll" ref={bodyRef}>
          {!activePage ? (
            <Landing
              track={track}
              recentPages={recentPages}
              read={read}
              onOpen={openPage}
              onPickDomain={pickDomain}
            />
          ) : (
            <>
              <article className="ex-article">
                <p className="ex-eyebrow" style={{ "--tc": track.accent }}>
                  {activePage.tab === track.label ? track.label : `${track.label} · ${activePage.tab}`}
                </p>
                <h1>{activePage.title}</h1>
                {activePage.desc ? <p className="ex-lede">{activePage.desc}</p> : null}

                <PageMeta page={activePage} onPickDomain={pickDomain} />

                {loading ? (
                  <p className="ex-status"><WanderingEyesLoader size={13} /> Loading…</p>
                ) : error ? (
                  <div className="ex-status ex-status--error" role="alert">
                    <AlertCircle size={15} /> <span>{error}</span>
                    <button type="button" className="ex-btn" onClick={() => openPage(activeSlug)}>Retry</button>
                  </div>
                ) : (
                  <div className="ex-prose">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={components}
                      urlTransform={examsUrlTransform}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                )}
              </article>

              <nav className="ex-pager" aria-label="Page navigation">
                {prevPage ? (
                  <button type="button" onClick={() => openPage(prevPage.slug)}>
                    <ArrowLeft size={13} />
                    <span><em>Previous</em>{prevPage.title}</span>
                  </button>
                ) : <span />}
                {nextPage ? (
                  <button type="button" className="ex-pager-next" onClick={() => openPage(nextPage.slug)}>
                    <span><em>Next</em>{nextPage.title}</span>
                    <ArrowRight size={13} />
                  </button>
                ) : <span />}
              </nav>
            </>
          )}
        </div>
      </section>

      {/* ── on this page ── */}
      {activePage && toc.length > 1 ? (
        <aside className="ex-toc" aria-label="On this page">
          <p className="ex-rail-label"><List size={12} /> On this page</p>
          {toc.map((item) => (
            <a
              key={item.id + item.label}
              href={`#${item.id}`}
              className={`ex-toc-link ex-toc-link--h${item.level}${activeHeading === item.id ? " ex-toc-link--on" : ""}`}
              onClick={(event) => {
                event.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {item.label}
            </a>
          ))}
        </aside>
      ) : null}
    </div>
  );
}

/* ── article meta ────────────────────────────────────────────────────────
   The vault's frontmatter, surfaced. Which exam tasks a note covers is the
   single most useful thing to know before reading it, and it is invisible in
   the markdown itself. */

function PageMeta({ page, onPickDomain }) {
  const status = EXAMS_STATUS_LABELS[page.status] || page.status;
  return (
    <div className="ex-meta">
      <span className={`ex-pill ex-pill--${page.status}`}>{status}</span>

      {page.domains.length ? (
        page.domains.map((taskId) => (
          <button
            key={taskId}
            type="button"
            className="ex-pill ex-pill--domain"
            title={TASK_BY_ID[taskId]?.label || `Task ${taskId}`}
            onClick={() => onPickDomain(taskId)}
          >
            <Target size={11} /> Task {taskId}
          </button>
        ))
      ) : page.domainScope ? (
        <span className="ex-pill ex-pill--domain-none">
          <Target size={11} /> {page.domainScope === "all" ? "All domains" : page.domainScope}
        </span>
      ) : null}

      {page.services.slice(0, 3).map((service) => (
        <span key={service} className="ex-pill ex-pill--service">{service}</span>
      ))}

      <span className="ex-meta-fact"><Timer size={11} /> {readingMinutes(page.words)} min read</span>
      {page.lastVerified ? (
        <span className="ex-meta-fact"><Clock size={11} /> Verified {page.lastVerified}</span>
      ) : null}
    </div>
  );
}

/* ── track landing ───────────────────────────────────────────────────────── */

function Landing({ track, recentPages, read, onOpen, onPickDomain }) {
  const pages = useMemo(
    () => EXAMS_ALL_PAGES.filter((page) => page.track === track.id),
    [track.id]
  );

  const readCount = pages.filter((page) => read.has(page.slug)).length;
  const percent = pages.length ? Math.round((readCount / pages.length) * 100) : 0;
  const reviewed = pages.filter((page) => page.status === "reviewed").length;

  const perDomain = useMemo(() => {
    const counts = {};
    EXAMS_DOMAINS.forEach((domain) => { counts[domain.id] = 0; });
    pages.forEach((page) => {
      new Set(page.domains.map((task) => task.split(".")[0])).forEach((id) => {
        if (counts[id] !== undefined) counts[id] += 1;
      });
    });
    return counts;
  }, [pages]);

  const Icon = TRACK_ICONS[track.icon] || Layers;

  return (
    <div className="ex-landing">
      <header className="ex-hero" style={{ "--tc": track.accent }}>
        <span className="ex-hero-mark"><Icon size={24} /></span>
        <div>
          <p className="ex-eyebrow" style={{ "--tc": track.accent }}>
            {EXAMS_CERTIFICATION.code} · {EXAMS_CERTIFICATION.name}
          </p>
          <h1>{track.label}</h1>
          <p className="ex-lede">{track.blurb}</p>
          <p className="ex-hero-meta">
            <FileText size={12} /> {pages.length} notes
            <span className="ex-dot" />
            <CircleCheck size={12} /> {reviewed} reviewed
          </p>
        </div>
      </header>

      <section className="ex-progress">
        <div className="ex-progress-head">
          <span>Your progress in {track.label}</span>
          <strong>{readCount} / {pages.length}</strong>
        </div>
        <div className="ex-progress-bar">
          <span style={{ width: `${percent}%`, background: track.accent }} />
        </div>
        <p className="ex-progress-note">
          {readCount === 0
            ? "Tick a note off with “Mark read” in the top bar to start tracking."
            : `${percent}% of this track marked read.`}
        </p>
      </section>

      <section className="ex-landing-block">
        <p className="ex-rail-label"><Target size={12} /> Exam domains covered here</p>
        <div className="ex-domain-grid">
          {EXAMS_DOMAINS.map((domain) => (
            <div key={domain.id} className="ex-domain-card">
              <div className="ex-domain-head">
                <strong>Domain {domain.id}</strong>
                <em>{domain.weight}%</em>
              </div>
              <p className="ex-domain-label">{domain.label}</p>
              <p className="ex-domain-count">{perDomain[domain.id]} note{perDomain[domain.id] === 1 ? "" : "s"} in this track</p>
              <div className="ex-domain-tasks">
                {domain.tasks.map((task) => (
                  <button key={task.id} type="button" className="ex-chip-sm" title={task.label} onClick={() => onPickDomain(task.id)}>
                    {task.id}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {recentPages.length ? (
        <section className="ex-landing-block">
          <p className="ex-rail-label"><Clock size={12} /> Recently read</p>
          <div className="ex-chip-row">
            {recentPages.map((page) => (
              <button key={page.slug} type="button" className="ex-chip" onClick={() => onOpen(page.slug)}>
                {page.title}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {track.tabs.map((tab, index) => {
        const tabPages = [];
        const walk = (items) => items.forEach((item) => {
          if (item.slug) tabPages.push(item);
          else if (item.items) walk(item.items);
        });
        walk(tab.items);
        if (!tabPages.length) return null;

        return (
          <section className="ex-landing-block" key={`${tab.tab}-${index}`}>
            <p className="ex-rail-label">
              <Layers size={12} />
              {tab.tab}
              <em>{tabPages.length}</em>
            </p>
            <div className="ex-grid">
              {tabPages.slice(0, 12).map((item) => {
                const full = PAGE_BY_SLUG[item.slug];
                return (
                  <button
                    key={item.slug}
                    type="button"
                    className={`ex-tile${read.has(item.slug) ? " ex-tile--read" : ""}`}
                    onClick={() => onOpen(item.slug)}
                  >
                    <span className="ex-tile-title">
                      {item.title}
                      {read.has(item.slug) ? <CircleCheck size={12} /> : null}
                    </span>
                    {full?.desc ? <span className="ex-tile-desc">{full.desc}</span> : null}
                    {full?.domains?.length ? (
                      <span className="ex-tile-tasks">
                        {full.domains.map((taskId) => <em key={taskId}>{taskId}</em>)}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            {tabPages.length > 12 ? (
              <p className="ex-more">{tabPages.length - 12} more in the navigation rail.</p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
