import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Compass, Boxes, Rocket, Database, Network, KeyRound, CreditCard, Terminal,
  Globe, Activity, Shield, ClipboardCheck, TrendingUp, Library, BookMarked,
  Lock, Gauge, Search, ArrowLeft, ArrowRight, X, FileText, ChevronRight,
  ChevronDown, List, AlertCircle, Layers, Clock, Code2, BookOpen, Cpu, Headphones,
} from "lucide-react";
import {
  AGENTCORE_SECTIONS, AGENTCORE_ALL_PAGES, AGENTCORE_TOTAL_PAGES,
} from "../data/agentcoreData";
import {
  AGENTCORE_SAMPLES, AGENTCORE_SAMPLE_OVERVIEWS, AGENTCORE_SAMPLES_TOTAL,
  SAMPLE_KINDS, SAMPLE_FRAMEWORKS,
} from "../data/agentcoreSamplesData";
import SampleViewer from "./SampleViewer";
import { makeMarkdownComponents, extractToc } from "./AgentCoreMarkdown";
import { useTheme } from "../contexts/ThemeContext";
import { fetchMarkdown } from "../utils/fetchMarkdown";
import "../styles/AgentCore.css";

// Section icons live in the generated index as names so it stays serializable.
const ICONS = {
  Compass, Boxes, Rocket, Database, Network, KeyRound, CreditCard, Terminal,
  Globe, Activity, Shield, ClipboardCheck, TrendingUp, Library, BookMarked, Lock, Gauge,
};

const LS_RECENT = "agentcore_recent_pages";

const KIND_LABEL = {
  "getting-started": "Getting started", feature: "Feature", "use-case": "Use case",
  integration: "Integration", iac: "IaC", blueprint: "Blueprint",
  workshop: "Workshop", overview: "Overview", other: "Other",
};

// Samples and section overviews browse together; `kind` separates them.
const ALL_ENTRIES = [...AGENTCORE_SAMPLES, ...AGENTCORE_SAMPLE_OVERVIEWS];

const SECTION_BY_ID = AGENTCORE_SECTIONS.reduce((acc, s) => {
  acc[s.id] = s;
  return acc;
}, {});

const SAMPLE_COUNT_BY_SECTION = AGENTCORE_SAMPLES.reduce((acc, s) => {
  if (s.sectionId) acc[s.sectionId] = (acc[s.sectionId] || 0) + 1;
  return acc;
}, {});

const PAGE_STEP = 48;

export default function AgentCoreViewer({ onClose, initialMode = "docs" }) {
  const { theme } = useTheme();
  const [mode, setMode] = useState(initialMode);       // "docs" | "samples" | "connect"
  const [activeSlug, setActiveSlug] = useState(null); // docs page
  const [activeSample, setActiveSample] = useState(null);
  const [openSections, setOpenSections] = useState(() => ({ intro: true }));
  const [query, setQuery] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toc, setToc] = useState([]);
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_RECENT) || "[]"); } catch { return []; }
  });
  // samples filters
  const [fSection, setFSection] = useState(null);
  const [fKind, setFKind] = useState(null);
  const [fFramework, setFFramework] = useState(null);
  const [visible, setVisible] = useState(PAGE_STEP);

  const bodyRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    setMode(initialMode);
    setActiveSlug(null);
    setActiveSample(null);
    setQuery("");
  }, [initialMode]);

  const pageBySlug = useMemo(() => {
    const map = {};
    AGENTCORE_ALL_PAGES.forEach((p) => { map[p.slug] = p; });
    return map;
  }, []);

  const activePage = activeSlug ? pageBySlug[activeSlug] : null;

  /* ── docs search ── */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || mode !== "docs") return null;
    return AGENTCORE_ALL_PAGES
      .map((p) => {
        const title = p.title.toLowerCase();
        let score = 0;
        if (title === q) score = 100;
        else if (title.startsWith(q)) score = 80;
        else if (title.includes(q)) score = 60;
        else if (p.slug.includes(q.replace(/\s+/g, "-"))) score = 40;
        else if (p.desc.toLowerCase().includes(q)) score = 20;
        return score ? { ...p, score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 60);
  }, [query, mode]);

  /* ── samples filtering ── */
  const filteredSamples = useMemo(() => {
    if (mode !== "samples") return [];
    const q = query.trim().toLowerCase();
    return ALL_ENTRIES.filter((s) => {
      if (fSection === "__none__" ? s.sectionId : fSection && s.sectionId !== fSection) return false;
      if (fKind && s.kind !== fKind) return false;
      if (fFramework && !(s.frameworks || []).includes(fFramework)) return false;
      if (!q) return true;
      return s.title.toLowerCase().includes(q)
        || s.slug.toLowerCase().includes(q)
        || (s.desc || "").toLowerCase().includes(q);
    });
  }, [mode, query, fSection, fKind, fFramework]);

  useEffect(() => { setVisible(PAGE_STEP); }, [query, fSection, fKind, fFramework, mode]);

  const openPage = useCallback((slug) => {
    setMode("docs");
    setActiveSample(null);
    setActiveSlug(slug);
    const page = AGENTCORE_ALL_PAGES.find((p) => p.slug === slug);
    if (page) {
      setOpenSections((prev) => ({ ...prev, [page.sectionId]: true }));
      setRecent((prev) => {
        const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, 6);
        try { localStorage.setItem(LS_RECENT, JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
    }
  }, []);

  const openSamples = useCallback((sectionId = null) => {
    setMode("samples");
    setActiveSample(null);
    setActiveSlug(null);
    setQuery("");
    setFSection(sectionId);
    setFKind(null);
    setFFramework(null);
  }, []);

  /* ⌘K / Ctrl-K focuses search */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── fetch doc page ── */
  useEffect(() => {
    if (!activePage) { setContent(""); setToc([]); setError(null); return; }
    let alive = true;
    setLoading(true);
    setError(null);
    fetchMarkdown(activePage.file)
      .then((text) => {
        if (!alive) return;
        const idx = text.indexOf("\n---\n");   // drop generated title/source block
        const body = idx > -1 ? text.slice(idx + 5) : text;
        setContent(body);
        setToc(extractToc(body));
        setLoading(false);
        if (bodyRef.current) bodyRef.current.scrollTop = 0;
      })
      .catch((e) => { if (alive) { setError(e.message); setLoading(false); } });
    return () => { alive = false; };
  }, [activePage]);

  const docComponents = useMemo(() => makeMarkdownComponents({
    resolveDoc: (href) => {
      const m = href.match(/([a-z0-9-]+)\.html(?:#.*)?$/i);
      return m && pageBySlug[m[1]] ? m[1] : null;
    },
    onDocLink: openPage,
  }), [pageBySlug, openPage]);

  const recentPages = recent.map((s) => pageBySlug[s]).filter(Boolean);
  const sectionSamples = activePage ? (SAMPLE_COUNT_BY_SECTION[activePage.sectionId] || 0) : 0;

  /* ── sample detail takes over the whole pane ── */
  if (activeSample) {
    const sec = activeSample.sectionId ? SECTION_BY_ID[activeSample.sectionId] : null;
    return (
      <div className="ac-panel">
        <section className="ac-main">
          <header className="ac-topbar">
            <button className="ac-btn" onClick={() => setActiveSample(null)}>
              <ArrowLeft size={13} /> All samples
            </button>
            <div className="ac-crumb">
              <span className="ac-crumb-sec" style={{ "--sc": sec?.color }}>
                {sec ? sec.label : "Samples"}
              </span>
              <ChevronRight size={11} />
              <span className="ac-crumb-page">{activeSample.title}</span>
            </div>
            <button className="ac-btn ac-close" onClick={onClose}>Close</button>
          </header>
          <div className="ac-body">
            <SampleViewer
              sample={activeSample}
              sectionLabel={sec?.label}
              sectionColor={sec?.color}
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ac-panel">
      {/* ══ left rail ══ */}
      <aside className="ac-rail">
        <div className="ac-rail-head">
          <div className="ac-rail-brand">
            <span className="ac-rail-mark"><Layers size={15} /></span>
            <span className="ac-rail-name">
              AWS Agent Core
              <small>{AGENTCORE_TOTAL_PAGES} pages · {AGENTCORE_SAMPLES_TOTAL} samples</small>
            </span>
          </div>

          <div className="ac-modes" role="tablist">
            <button
              role="tab"
              aria-selected={mode === "docs"}
              className={`ac-mode ${mode === "docs" ? "active" : ""}`}
              onClick={() => { setMode("docs"); setQuery(""); }}
            >
              <BookOpen size={12} /> Docs
            </button>
            <button
              role="tab"
              aria-selected={mode === "samples"}
              className={`ac-mode ${mode === "samples" ? "active" : ""}`}
              onClick={() => openSamples(null)}
            >
              <Code2 size={12} /> Samples
            </button>
            <button
              role="tab"
              aria-selected={mode === "connect"}
              className={`ac-mode ${mode === "connect" ? "active" : ""}`}
              onClick={() => {
                setMode("connect");
                setActiveSlug(null);
                setActiveSample(null);
                setQuery("");
              }}
            >
              <Headphones size={12} /> Connect
            </button>
          </div>

          {mode !== "connect" && (
            <div className="ac-search">
              <Search size={13} className="ac-search-icon" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={mode === "docs" ? "Search the guide" : "Search samples"}
              />
              {query
                ? <button className="ac-search-clear" onClick={() => setQuery("")}><X size={12} /></button>
                : <kbd className="ac-kbd">⌘K</kbd>}
            </div>
          )}
        </div>

        <nav className="ac-tree">
          {mode === "connect" ? (
            <div className="ac-connect-nav">
              <div className="ac-tree-grouplabel">Amazon Connect</div>
              <div className="ac-connect-nav-card">
                <span className="ac-tree-chip"><Headphones size={12} /></span>
                <div><strong>Learning path</strong><small>34 course modules</small></div>
              </div>
              <p>Routing, flows, channels, analytics, AI, development, and administration.</p>
            </div>
          ) : mode === "samples" ? (
            <>
              <div className="ac-tree-grouplabel">Section</div>
              <button
                className={`ac-filter ${!fSection ? "active" : ""}`}
                onClick={() => setFSection(null)}
              >
                All sections <span className="ac-tree-count">{ALL_ENTRIES.length}</span>
              </button>
              {AGENTCORE_SECTIONS.filter((s) => SAMPLE_COUNT_BY_SECTION[s.id]).map((s) => {
                const Icon = ICONS[s.icon] || Layers;
                return (
                  <button
                    key={s.id}
                    className={`ac-filter ${fSection === s.id ? "active" : ""}`}
                    style={{ "--sc": s.color }}
                    onClick={() => setFSection(fSection === s.id ? null : s.id)}
                  >
                    <span className="ac-tree-chip"><Icon size={12} /></span>
                    <span className="ac-tree-label">{s.label}</span>
                    <span className="ac-tree-count">{SAMPLE_COUNT_BY_SECTION[s.id]}</span>
                  </button>
                );
              })}

              <div className="ac-tree-grouplabel">Kind</div>
              <div className="ac-chips">
                {SAMPLE_KINDS.map((k) => (
                  <button
                    key={k}
                    className={`ac-chip ${fKind === k ? "active" : ""}`}
                    onClick={() => setFKind(fKind === k ? null : k)}
                  >{KIND_LABEL[k] || k}</button>
                ))}
              </div>

              <div className="ac-tree-grouplabel">Framework</div>
              <div className="ac-chips">
                {SAMPLE_FRAMEWORKS.map((f) => (
                  <button
                    key={f}
                    className={`ac-chip ${fFramework === f ? "active" : ""}`}
                    onClick={() => setFFramework(fFramework === f ? null : f)}
                  >{f}</button>
                ))}
              </div>
            </>
          ) : results ? (
            <div className="ac-results">
              <div className="ac-tree-grouplabel">
                {results.length} match{results.length === 1 ? "" : "es"}
              </div>
              {results.map((p) => (
                <button
                  key={p.slug}
                  className={`ac-result ${activeSlug === p.slug ? "active" : ""}`}
                  style={{ "--sc": p.color }}
                  onClick={() => openPage(p.slug)}
                >
                  <span className="ac-result-title">{p.title}</span>
                  <span className="ac-result-sec">{p.sectionLabel}</span>
                </button>
              ))}
              {!results.length && (
                <div className="ac-empty">
                  <AlertCircle size={20} />
                  <p>No pages match “{query}”.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {!activeSlug && recentPages.length > 0 && (
                <div className="ac-recent">
                  <div className="ac-tree-grouplabel"><Clock size={10} /> Recent</div>
                  {recentPages.map((p) => (
                    <button
                      key={p.slug}
                      className="ac-tree-page"
                      style={{ "--sc": p.color }}
                      onClick={() => openPage(p.slug)}
                    >
                      <FileText size={11} /> {p.title}
                    </button>
                  ))}
                </div>
              )}
              {AGENTCORE_SECTIONS.map((section) => {
                const Icon = ICONS[section.icon] || Layers;
                const open = !!openSections[section.id];
                const hasActive = section.pages.some((p) => p.slug === activeSlug);
                return (
                  <div
                    key={section.id}
                    className={`ac-tree-section ${open ? "open" : ""}`}
                    style={{ "--sc": section.color }}
                  >
                    <button
                      className={`ac-tree-header ${hasActive ? "has-active" : ""}`}
                      onClick={() => setOpenSections((p) => ({ ...p, [section.id]: !p[section.id] }))}
                    >
                      <ChevronRight size={12} className="ac-tree-chev" />
                      <span className="ac-tree-chip"><Icon size={12} /></span>
                      <span className="ac-tree-label">{section.label}</span>
                      <span className="ac-tree-count">{section.pages.length}</span>
                    </button>
                    {open && (
                      <div className="ac-tree-pages">
                        {section.pages.map((p) => (
                          <button
                            key={p.slug}
                            className={`ac-tree-page ${activeSlug === p.slug ? "active" : ""}`}
                            onClick={() => openPage(p.slug)}
                          >
                            {p.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </nav>
      </aside>

      {/* ══ main pane ══ */}
      <section className="ac-main">
        <header className="ac-topbar">
          {activePage ? (
            <>
              <button className="ac-btn" onClick={() => setActiveSlug(null)}>
                <ArrowLeft size={13} /> All sections
              </button>
              <div className="ac-crumb">
                <span className="ac-crumb-sec" style={{ "--sc": activePage.color }}>
                  {activePage.sectionLabel}
                </span>
                <ChevronRight size={11} />
                <span className="ac-crumb-page">{activePage.title}</span>
              </div>
              {sectionSamples > 0 && (
                <button
                  className="ac-btn ac-btn-accent"
                  style={{ "--sc": activePage.color }}
                  onClick={() => openSamples(activePage.sectionId)}
                >
                  <Code2 size={12} /> {sectionSamples} samples
                </button>
              )}
            </>
          ) : (
            <div className="ac-crumb">
              <span className="ac-crumb-sec">Amazon Bedrock AgentCore</span>
              <ChevronRight size={11} />
              <span className="ac-crumb-page">
                {mode === "connect"
                  ? "Amazon Connect learning path"
                  : mode === "samples"
                  ? `${filteredSamples.length} of ${ALL_ENTRIES.length} entries`
                  : `${AGENTCORE_TOTAL_PAGES} pages`}
              </span>
            </div>
          )}
          <button className="ac-btn ac-close" onClick={onClose}>Close</button>
        </header>

        <div className={`ac-body ${mode === "connect" ? "ac-body--connect" : ""}`} ref={bodyRef}>
          {mode === "connect" ? (
            <section className="ac-connect-workspace" aria-label="Amazon Connect workspace">
              <iframe
                src={`/claude-certificate/index.html?theme=${theme === "light" ? "light" : "dark"}&track=amazon-connect`}
                title="Amazon Connect — course library"
                loading="eager"
              />
            </section>
          ) : mode === "samples" ? (
            <div className="ac-landing">
              <header className="ac-hero ac-hero-compact">
                <span className="ac-hero-badge">Samples · Apache-2.0</span>
                <h1 className="ac-hero-title">AgentCore samples</h1>
                <p className="ac-hero-sub">
                  {AGENTCORE_SAMPLES_TOTAL} runnable samples and {AGENTCORE_SAMPLE_OVERVIEWS.length}{" "}
                  section overviews from the awslabs samples repository, mirrored locally.
                  Notebooks are flattened to Markdown for reading.
                </p>
                {(fSection || fKind || fFramework) && (
                  <button className="ac-btn" onClick={() => { setFSection(null); setFKind(null); setFFramework(null); }}>
                    <X size={12} /> Clear filters
                  </button>
                )}
              </header>

              {filteredSamples.length === 0 ? (
                <div className="ac-empty">
                  <AlertCircle size={22} />
                  <p>No samples match those filters.</p>
                </div>
              ) : (
                <>
                  <div className="ac-samples-grid">
                    {filteredSamples.slice(0, visible).map((s) => {
                      const sec = s.sectionId ? SECTION_BY_ID[s.sectionId] : null;
                      const Icon = sec ? (ICONS[sec.icon] || Layers) : Layers;
                      return (
                        <button
                          key={s.slug}
                          className="ac-scard"
                          style={{ "--sc": sec?.color || "var(--neon)" }}
                          onClick={() => setActiveSample(s)}
                        >
                          <div className="ac-scard-top">
                            <span className="ac-scard-icon"><Icon size={14} /></span>
                            <span className="ac-scard-kind">{KIND_LABEL[s.kind] || s.kind}</span>
                          </div>
                          <h3 className="ac-scard-title">{s.title}</h3>
                          <p className="ac-scard-desc">{s.desc || "No description provided."}</p>
                          <div className="ac-scard-foot">
                            {(s.frameworks || []).slice(0, 2).map((f) => (
                              <span key={f} className="ac-tag"><Cpu size={9} /> {f}</span>
                            ))}
                            {!!s.files?.length && (
                              <span className="ac-tag">
                                {s.files.length} file{s.files.length === 1 ? "" : "s"}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {visible < filteredSamples.length && (
                    <div className="ac-more">
                      <button className="ac-btn" onClick={() => setVisible((v) => v + PAGE_STEP)}>
                        Show more ({filteredSamples.length - visible} remaining)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : !activePage ? (
            <div className="ac-landing">
              <header className="ac-hero">
                <span className="ac-hero-badge">AWS · Developer Guide</span>
                <h1 className="ac-hero-title">Amazon Bedrock AgentCore</h1>
                <p className="ac-hero-sub">
                  Build, deploy, and operate production AI agents — the complete developer
                  guide, mirrored locally for offline reading.
                </p>
                <div className="ac-hero-stats">
                  <span className="ac-stat"><strong>{AGENTCORE_TOTAL_PAGES}</strong> pages</span>
                  <span className="ac-stat-dot" />
                  <span className="ac-stat"><strong>{AGENTCORE_SAMPLES_TOTAL}</strong> samples</span>
                  <span className="ac-stat-dot" />
                  <span className="ac-stat">offline · no external links</span>
                </div>
              </header>

              <div className="ac-grid">
                {AGENTCORE_SECTIONS.map((section, i) => {
                  const Icon = ICONS[section.icon] || Layers;
                  const nSamples = SAMPLE_COUNT_BY_SECTION[section.id] || 0;
                  return (
                    <button
                      key={section.id}
                      className="ac-card"
                      style={{ "--sc": section.color }}
                      onClick={() => {
                        setOpenSections((p) => ({ ...p, [section.id]: true }));
                        const first = section.pages[0];
                        if (first) openPage(first.slug);
                      }}
                    >
                      <span className="ac-card-glow" aria-hidden="true" />
                      <span className="ac-card-index">{String(i + 1).padStart(2, "0")}</span>
                      <span className="ac-card-icon"><Icon size={19} /></span>
                      <h3 className="ac-card-title">{section.label}</h3>
                      <span className="ac-card-count">
                        {section.pages.length} pages
                        {nSamples > 0 && <> · {nSamples} samples</>}
                      </span>
                      <p className="ac-card-blurb">{section.blurb}</p>
                      <span className="ac-card-cta">
                        Explore section <ArrowRight size={13} />
                      </span>
                    </button>
                  );
                })}
                <button
                  className="ac-card"
                  style={{ "--sc": "#00a1c9" }}
                  onClick={() => {
                    setMode("connect");
                    setActiveSlug(null);
                    setQuery("");
                  }}
                >
                  <span className="ac-card-glow" aria-hidden="true" />
                  <span className="ac-card-index">{String(AGENTCORE_SECTIONS.length + 1).padStart(2, "0")}</span>
                  <span className="ac-card-icon"><Headphones size={19} /></span>
                  <h3 className="ac-card-title">Amazon Connect</h3>
                  <span className="ac-card-count">34 course modules</span>
                  <p className="ac-card-blurb">
                    Learn routing, flows, voice and chat channels, analytics, AI,
                    development, and administration for the AWS contact center platform.
                  </p>
                  <span className="ac-card-cta">
                    Open learning path <ArrowRight size={13} />
                  </span>
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="ac-state"><div className="ac-spinner" /><span>Loading page…</span></div>
          ) : error ? (
            <div className="ac-state ac-state-err">
              <AlertCircle size={26} />
              <span>{error}</span>
              <button className="ac-btn" onClick={() => openPage(activeSlug)}>Retry</button>
            </div>
          ) : (
            <article className="ac-article">
              <div className="ac-article-main">
                <div className="ac-md">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={docComponents}>
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
              {toc.length > 2 && (
                <aside className="ac-toc">
                  <div className="ac-toc-head"><List size={12} /> On this page</div>
                  {toc.map((h, i) => (
                    <a
                      key={`${h.id}-${i}`}
                      href={`#${h.id}`}
                      className={`ac-toc-link lvl-${h.level}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      {h.label}
                    </a>
                  ))}
                </aside>
              )}
            </article>
          )}
        </div>
      </section>
    </div>
  );
}
