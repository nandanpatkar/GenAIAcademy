import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Search, X, ArrowLeft, ArrowRight, List, FileText, PanelLeft, AlertCircle, BookMarked, ChevronRight,
} from "lucide-react";
import {
  DOC_SECTIONS, DOC_PAGES, DOC_ORDER, DOC_BY_SLUG, DEFAULT_DOC_SLUG, docUrl,
} from "../data/documentationNav";
import { makeLangChainComponents, extractToc, langChainUrlTransform } from "./LangChainMarkdown";
import { useTheme } from "../contexts/ThemeContext";
import { fetchMarkdown } from "../utils/fetchMarkdown";
import "../styles/LangChainDocs.css";
import "../styles/Documentation.css";
import WanderingEyesLoader from "./WanderingEyesLoader";

/* Project documentation, read in-app (About → Documentation).
 *
 * Deliberately the same shape as the LangChain and Strands viewers next door: a
 * nav rail, a measured reading column, an "on this page" rail, prev/next. It
 * reuses their renderer and stylesheet rather than growing a second one — the
 * pages are authored against exactly the contract makeLangChainComponents
 * already handles (mermaid blocks, `> [!NOTE]` callouts, lc-cards, click-to-zoom
 * figures), so the only thing this file adds is the navigation model.
 *
 * Page bodies are fetched from public/project-docs/ on demand and cached for the
 * session. The index in documentationNav.js is the only part that is bundled.
 */

const LS_LAST = "project_docs_last_page";

/* Pages are authored with `doc:<slug>` cross-links, which reads correctly in the
   markdown source. The shared renderer resolves `lc:`, so translate on the way
   in rather than teaching it a second scheme. */
const toRendererLinks = (markdown) => markdown.replace(/\]\(doc:/g, "](lc:");

/* Each file opens with its own `# Title` so it still reads as a standalone
   document on disk, but the reading pane already renders that title from the
   nav index. Drop the first heading rather than showing it twice. */
const dropLeadingH1 = (markdown) => markdown.replace(/^\s*#\s+.*\r?\n+/, "");

export default function Documentation({ onClose }) {
  const { theme } = useTheme();
  const dark = theme !== "light";

  const [activeSlug, setActiveSlug] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_LAST);
      return saved && DOC_BY_SLUG[saved] ? saved : DEFAULT_DOC_SLUG;
    } catch { return DEFAULT_DOC_SLUG; }
  });
  const [query, setQuery] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toc, setToc] = useState([]);
  const [activeHeading, setActiveHeading] = useState(null);
  const [railOpen, setRailOpen] = useState(false);

  const bodyRef = useRef(null);
  const pendingHash = useRef(null);
  /* One fetch per page per session. Twelve short pages, so a plain object is the
     right amount of cache. */
  const cache = useRef({});

  const activePage = DOC_BY_SLUG[activeSlug] || null;
  const activeIndex = DOC_ORDER.indexOf(activeSlug);
  const prevPage = activeIndex > 0 ? DOC_BY_SLUG[DOC_ORDER[activeIndex - 1]] : null;
  const nextPage = activeIndex >= 0 && activeIndex < DOC_ORDER.length - 1
    ? DOC_BY_SLUG[DOC_ORDER[activeIndex + 1]]
    : null;

  const openPage = useCallback((slug, hash) => {
    if (!DOC_BY_SLUG[slug]) return;
    pendingHash.current = hash || null;
    setActiveSlug(slug);
    setRailOpen(false);
    setQuery("");
    try { localStorage.setItem(LS_LAST, slug); } catch { /* private mode */ }
  }, []);

  /* ── page body ── */

  useEffect(() => {
    if (!activePage) return undefined;
    let cancelled = false;

    const apply = (markdown) => {
      if (cancelled) return;
      setContent(markdown);
      setToc(extractToc(markdown));
      setError(null);
      setLoading(false);
    };

    const cached = cache.current[activePage.slug];
    if (cached) { apply(cached); return () => { cancelled = true; }; }

    setLoading(true);
    setContent("");
    setToc([]);
    fetchMarkdown(docUrl(activePage.slug))
      .then((markdown) => {
        const prepared = dropLeadingH1(toRendererLinks(markdown));
        cache.current[activePage.slug] = prepared;
        apply(prepared);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Could not load this page.");
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [activePage]);

  /* Land at the top of a newly opened page, or at the anchor a cross-link asked
     for once the markdown has actually rendered. */
  useEffect(() => {
    if (loading || !bodyRef.current) return;
    const hash = pendingHash.current;
    pendingHash.current = null;
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "auto", block: "start" });
      });
      return;
    }
    bodyRef.current.scrollTop = 0;
  }, [loading, activeSlug]);

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
  }, [toc]);

  /* ── search over titles and blurbs ── */

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return null;
    return DOC_PAGES.filter((page) =>
      page.title.toLowerCase().includes(term) ||
      page.blurb.toLowerCase().includes(term) ||
      page.sectionLabel.toLowerCase().includes(term)
    );
  }, [query]);

  const components = useMemo(() => {
    const base = makeLangChainComponents({
      dark,
      onDocLink: (slug, hash) => openPage(slug, hash),
      resolveDoc: (slug) => Boolean(DOC_BY_SLUG[slug]),
    });
    return {
      ...base,
      /* A lone image is a block-level figure here, but markdown still parses it
         as a paragraph — which nests <figure> inside <p> and trips React's DOM
         validation. Unwrap that one case and leave every other paragraph alone. */
      p({ node, children }) {
        const only = node?.children?.length === 1 ? node.children[0] : null;
        if (only?.tagName === "img") return <>{children}</>;
        return <p>{children}</p>;
      },
    };
  }, [dark, openPage]);

  return (
    <div
      className={`lc-root pd-root${railOpen ? " lc-root--rail" : ""}`}
      data-theme={dark ? "dark" : "light"}
    >
      {/* ── left rail ── */}
      <nav className="lc-rail" aria-label="Project documentation">
        <div className="lc-rail-head">
          <div className="lc-brand">
            <span className="pd-mark"><BookMarked size={16} /></span>
            <div>
              <strong>Documentation</strong>
              <span>GenAI Academy · {DOC_PAGES.length} pages</span>
            </div>
            {onClose ? (
              <button type="button" className="lc-icon-btn lc-rail-close" onClick={onClose} title="Close">
                <X size={15} />
              </button>
            ) : null}
          </div>

          <div className="lc-search">
            <Search size={13} />
            <input
              value={query}
              placeholder="Search documentation…"
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search project documentation"
            />
            {query ? (
              <button type="button" className="lc-icon-btn" onClick={() => setQuery("")}>
                <X size={13} />
              </button>
            ) : null}
          </div>
        </div>

        <div className="lc-rail-body">
          {results ? (
            <div className="lc-results">
              <p className="lc-rail-label">{results.length} result{results.length === 1 ? "" : "s"}</p>
              {results.map((page) => (
                <button key={page.slug} type="button" className="lc-result" onClick={() => openPage(page.slug)}>
                  <span className="lc-result-title">{page.title}</span>
                  <span className="lc-result-meta">{page.sectionLabel}</span>
                </button>
              ))}
              {!results.length ? <p className="lc-empty">Nothing matched “{query}”.</p> : null}
            </div>
          ) : (
            DOC_SECTIONS.map((section) => (
              <div key={section.id} className="lc-nav-section">
                <p className="lc-rail-label">{section.label}</p>
                {section.pages.map((page) => (
                  <button
                    key={page.slug}
                    type="button"
                    className={`pd-nav-link${page.slug === activeSlug ? " pd-nav-link--on" : ""}`}
                    onClick={() => openPage(page.slug)}
                  >
                    {page.title}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </nav>

      {railOpen ? <div className="lc-scrim" onClick={() => setRailOpen(false)} /> : null}

      {/* ── reading pane ── */}
      <section className="lc-main">
        <header className="lc-topbar">
          <button
            type="button"
            className="lc-icon-btn lc-rail-toggle"
            onClick={() => setRailOpen((value) => !value)}
            title="Toggle navigation"
          >
            <PanelLeft size={15} />
          </button>

          <nav className="lc-crumb" aria-label="Breadcrumb">
            <span className="pd-crumb-root">Documentation</span>
            {activePage ? (
              <>
                <ChevronRight size={11} />
                <span>{activePage.sectionLabel}</span>
                <ChevronRight size={11} />
                <strong>{activePage.title}</strong>
              </>
            ) : null}
          </nav>

          <div className="lc-topbar-end">
            {onClose ? (
              <button type="button" className="lc-icon-btn" onClick={onClose} title="Close">
                <X size={15} />
              </button>
            ) : null}
          </div>
        </header>

        <div className="lc-scroll" ref={bodyRef}>
          <article className="lc-article">
            {activePage ? (
              <>
                <p className="lc-eyebrow">
                  <FileText size={12} /> {activePage.sectionLabel}
                </p>
                <h1>{activePage.title}</h1>
                <p className="lc-lede">{activePage.blurb}</p>
              </>
            ) : null}

            {loading ? (
              <p className="lc-status"><WanderingEyesLoader size={13} /> Loading…</p>
            ) : error ? (
              <div className="lc-status lc-status--error" role="alert">
                <AlertCircle size={15} /> <span>{error}</span>
                <button type="button" className="lc-btn" onClick={() => openPage(activeSlug)}>Retry</button>
              </div>
            ) : (
              <div className="lc-prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={components}
                  urlTransform={langChainUrlTransform}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </article>

          <nav className="lc-pager" aria-label="Page navigation">
            {prevPage ? (
              <button type="button" onClick={() => openPage(prevPage.slug)}>
                <ArrowLeft size={13} />
                <span><em>Previous</em>{prevPage.title}</span>
              </button>
            ) : <span />}
            {nextPage ? (
              <button type="button" className="lc-pager-next" onClick={() => openPage(nextPage.slug)}>
                <span><em>Next</em>{nextPage.title}</span>
                <ArrowRight size={13} />
              </button>
            ) : <span />}
          </nav>
        </div>
      </section>

      {/* ── on this page ── */}
      {activePage && toc.length > 1 ? (
        <aside className="lc-toc" aria-label="On this page">
          <p className="lc-rail-label"><List size={12} /> On this page</p>
          {toc.map((item) => (
            <a
              key={item.id + item.label}
              href={`#${item.id}`}
              className={`lc-toc-link lc-toc-link--h${item.level}${activeHeading === item.id ? " lc-toc-link--on" : ""}`}
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
