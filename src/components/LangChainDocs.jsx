import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Search, X, ChevronRight, ChevronDown, ArrowLeft, ArrowRight, List,
  ExternalLink, FileText, Clock, Layers, PanelLeft, AlertCircle,
} from "lucide-react";
import {
  LANGCHAIN_PRODUCTS, LANGCHAIN_ALL_PAGES, LANGCHAIN_TOTAL_PAGES,
  LANGCHAIN_SOURCE_URL,
} from "../data/langchainDocsData";
import { makeLangChainComponents, extractToc, langChainUrlTransform } from "./LangChainMarkdown";
import { useTheme } from "../contexts/ThemeContext";
import { fetchMarkdown } from "../utils/fetchMarkdown";
import "../styles/LangChainDocs.css";
import WanderingEyesLoader from "./WanderingEyesLoader";

/* The LangChain Python documentation, read in-app.
 *
 * Layout follows docs.langchain.com: a product-scoped nav rail, a measured
 * reading column, and an "on this page" rail. The sidebar's Agents section
 * enters here already scoped to one product (LangChain / LangGraph / Deep
 * Agents / LangSmith); the switcher at the top of the rail crosses between
 * them, since the prose links across products constantly.
 *
 * Page bodies are fetched from public/langchain/md/ on demand and cached for
 * the session — 1001 pages is far too much to bundle.
 */

const LS_RECENT = "langchain_docs_recent";
const PAGE_BY_SLUG = LANGCHAIN_ALL_PAGES.reduce((acc, page) => {
  acc[page.slug] = page;
  return acc;
}, {});

/* Nav order, flattened per product, for prev/next. */
const ORDER_BY_PRODUCT = {};
LANGCHAIN_PRODUCTS.forEach((product) => {
  const slugs = [];
  const walk = (items) => items.forEach((item) => {
    if (item.slug) slugs.push(item.slug);
    else if (item.items) walk(item.items);
  });
  product.tabs.forEach((tab) => walk(tab.items));
  ORDER_BY_PRODUCT[product.id] = slugs;
});

const PRODUCT_BY_ID = LANGCHAIN_PRODUCTS.reduce((acc, product) => {
  acc[product.id] = product;
  return acc;
}, {});

/* Which group in the tree holds a given page — used to auto-open the branch
   the reader lands on, including when they arrive from a cross-reference. */
const BRANCH_BY_SLUG = {};
LANGCHAIN_PRODUCTS.forEach((product) => {
  product.tabs.forEach((tab, tabIndex) => {
    const walk = (items, trail) => items.forEach((item, index) => {
      if (item.slug) {
        BRANCH_BY_SLUG[item.slug] = { product: product.id, tab: tabIndex, groups: trail };
      } else if (item.items) {
        const key = `${product.id}:${tabIndex}:${trail.length}:${index}:${item.group}`;
        walk(item.items, [...trail, key]);
      }
    });
    walk(tab.items, []);
  });
});

const cache = new Map();

export default function LangChainDocs({ product: initialProduct = "langchain", onClose }) {
  const { theme } = useTheme();
  const dark = theme !== "light";

  const [productId, setProductId] = useState(initialProduct);
  const [activeSlug, setActiveSlug] = useState(null);
  const [openGroups, setOpenGroups] = useState({});
  const [openTabs, setOpenTabs] = useState({});
  const [query, setQuery] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toc, setToc] = useState([]);
  const [activeHeading, setActiveHeading] = useState(null);
  const [railOpen, setRailOpen] = useState(false);
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_RECENT) || "[]"); } catch { return []; }
  });

  const bodyRef = useRef(null);
  const searchRef = useRef(null);
  const pendingHash = useRef(null);

  const product = PRODUCT_BY_ID[productId] || LANGCHAIN_PRODUCTS[0];
  const activePage = activeSlug ? PAGE_BY_SLUG[activeSlug] : null;

  useEffect(() => { setProductId(initialProduct); setActiveSlug(null); }, [initialProduct]);

  /* ── navigation ── */

  const openPage = useCallback((slug, hash) => {
    let page = PAGE_BY_SLUG[slug];
    if (!page) return;
    // 18 pages are redirect stubs upstream. Follow them so the nav never lands
    // the reader on a "this page has moved" placeholder.
    for (let hop = 0; page.redirect && PAGE_BY_SLUG[page.redirect] && hop < 4; hop += 1) {
      slug = page.redirect;
      page = PAGE_BY_SLUG[slug];
    }
    pendingHash.current = hash || null;
    setActiveSlug(slug);
    setRailOpen(false);
    setQuery("");

    const branch = BRANCH_BY_SLUG[slug];
    if (branch) {
      setProductId(branch.product);
      setOpenTabs((prev) => ({ ...prev, [`${branch.product}:${branch.tab}`]: true }));
      setOpenGroups((prev) => {
        const next = { ...prev };
        branch.groups.forEach((key) => { next[key] = true; });
        return next;
      });
    }

    setRecent((prev) => {
      const next = [slug, ...prev.filter((item) => item !== slug)].slice(0, 6);
      try { localStorage.setItem(LS_RECENT, JSON.stringify(next)); } catch { /* ignore */ }
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
    if (!activePage) { setContent(""); setToc([]); setError(null); return; }
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

  /* ── search ── */

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return null;
    return LANGCHAIN_ALL_PAGES
      .map((page) => {
        const title = page.title.toLowerCase();
        let score = 0;
        if (title === needle) score = 100;
        else if (title.startsWith(needle)) score = 80;
        else if (title.includes(needle)) score = 60;
        else if (page.slug.includes(needle.replace(/\s+/g, "-"))) score = 40;
        else if ((page.desc || "").toLowerCase().includes(needle)) score = 20;
        if (score && page.product === productId) score += 5;
        return score ? { ...page, score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 50);
  }, [query, productId]);

  /* ── prev / next within the product ── */

  const order = ORDER_BY_PRODUCT[productId] || [];
  const position = activeSlug ? order.indexOf(activeSlug) : -1;
  const prevPage = position > 0 ? PAGE_BY_SLUG[order[position - 1]] : null;
  const nextPage = position > -1 && position < order.length - 1
    ? PAGE_BY_SLUG[order[position + 1]] : null;

  const components = useMemo(
    () => makeLangChainComponents({
      dark,
      onDocLink: openPage,
      resolveDoc: (slug) => Boolean(PAGE_BY_SLUG[slug]),
    }),
    [dark, openPage]
  );

  const recentPages = recent.map((slug) => PAGE_BY_SLUG[slug]).filter(Boolean);

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
          className={`lc-nav-page${current ? " lc-nav-page--on" : ""}`}
          style={{ paddingLeft: 14 + depth * 12 }}
          aria-current={current ? "page" : undefined}
          onClick={() => openPage(item.slug)}
        >
          <span>{item.title}</span>
          {item.tag ? <em className="lc-tag">{item.tag}</em> : null}
        </button>
      );
    }

    const key = `${tabKey}:${trail.length}:${index}:${item.group}`;
    const open = openGroups[key] ?? item.expanded;
    return (
      <div key={key} className="lc-nav-group">
        <button
          type="button"
          className="lc-nav-group-head"
          style={{ paddingLeft: 12 + depth * 12 }}
          aria-expanded={open}
          onClick={() => setOpenGroups((prev) => ({ ...prev, [key]: !open }))}
        >
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          <span>{item.group}</span>
          {item.tag ? <em className="lc-tag">{item.tag}</em> : null}
        </button>
        {open ? renderItems(item.items, tabKey, depth + 1, [...trail, key]) : null}
      </div>
    );
  });

  const sections = useMemo(() => {
    const out = [];
    product.tabs.forEach((tab, index) => {
      const label = tab.section || "";
      const last = out[out.length - 1];
      if (last && last.label === label) last.tabs.push({ ...tab, index });
      else out.push({ label, tabs: [{ ...tab, index }] });
    });
    return out;
  }, [product]);

  return (
    <div className={`lc-root${railOpen ? " lc-root--rail" : ""}`} data-theme={dark ? "dark" : "light"}>
      {/* ── left rail ── */}
      <nav className="lc-rail" aria-label="LangChain documentation">
        <div className="lc-rail-head">
          <div className="lc-brand">
            <img src="/langchain/images/images/brand/langchain-icon.png" alt="" />
            <div>
              <strong>LangChain</strong>
              <span>Python docs · {LANGCHAIN_TOTAL_PAGES} pages</span>
            </div>
            {onClose ? (
              <button type="button" className="lc-icon-btn lc-rail-close" onClick={onClose} title="Close">
                <X size={15} />
              </button>
            ) : null}
          </div>

          <div className="lc-switch">
            {LANGCHAIN_PRODUCTS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`lc-switch-btn${item.id === productId ? " lc-switch-btn--on" : ""}`}
                style={{ "--pc": item.accent }}
                onClick={() => { setProductId(item.id); setActiveSlug(null); setQuery(""); }}
                title={item.blurb}
              >
                <img src={item.icon} alt="" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="lc-search">
            <Search size={13} />
            <input
              ref={searchRef}
              value={query}
              placeholder="Search docs…"
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search LangChain documentation"
            />
            {query
              ? <button type="button" className="lc-icon-btn" onClick={() => setQuery("")}><X size={13} /></button>
              : <kbd>⌘K</kbd>}
          </div>
        </div>

        <div className="lc-rail-body">
          {results ? (
            <div className="lc-results">
              <p className="lc-rail-label">{results.length} result{results.length === 1 ? "" : "s"}</p>
              {results.map((page) => (
                <button key={page.slug} type="button" className="lc-result" onClick={() => openPage(page.slug)}>
                  <span className="lc-result-title">{page.title}</span>
                  <span className="lc-result-meta">{PRODUCT_BY_ID[page.product]?.label} · {page.tab}</span>
                </button>
              ))}
              {!results.length ? <p className="lc-empty">Nothing matched “{query}”.</p> : null}
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.label || "root"} className="lc-nav-section">
                {section.label ? <p className="lc-rail-label">{section.label}</p> : null}
                {section.tabs.map((tab) => {
                  const tabKey = `${productId}:${tab.index}`;
                  const open = openTabs[tabKey] ?? (section.tabs.length === 1 && !section.label);
                  return (
                    <div key={tabKey} className="lc-nav-tab">
                      <button
                        type="button"
                        className={`lc-nav-tab-head${open ? " lc-nav-tab-head--on" : ""}`}
                        aria-expanded={open}
                        onClick={() => setOpenTabs((prev) => ({ ...prev, [tabKey]: !open }))}
                      >
                        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        <span>{tab.tab}</span>
                      </button>
                      {open ? renderItems(tab.items, tabKey, 0, []) : null}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </nav>

      {railOpen ? <div className="lc-scrim" onClick={() => setRailOpen(false)} /> : null}

      {/* ── reading pane ── */}
      <section className="lc-main">
        <header className="lc-topbar">
          <button type="button" className="lc-icon-btn lc-rail-toggle" onClick={() => setRailOpen((value) => !value)} title="Toggle navigation">
            <PanelLeft size={15} />
          </button>

          {activePage ? (
            <nav className="lc-crumb" aria-label="Breadcrumb">
              <span style={{ "--pc": product.accent }}>{product.label}</span>
              <ChevronRight size={11} />
              <span>{activePage.tab}</span>
              <ChevronRight size={11} />
              <strong>{activePage.title}</strong>
            </nav>
          ) : (
            <nav className="lc-crumb" aria-label="Breadcrumb">
              <span style={{ "--pc": product.accent }}>{product.label}</span>
            </nav>
          )}

          <div className="lc-topbar-end">
            {activePage ? (
              <a className="lc-btn" href={activePage.source} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={12} /> <span>docs.langchain.com</span>
              </a>
            ) : null}
            {onClose ? (
              <button type="button" className="lc-icon-btn" onClick={onClose} title="Close"><X size={15} /></button>
            ) : null}
          </div>
        </header>

        <div className="lc-scroll" ref={bodyRef}>
          {!activePage ? (
            <Landing
              product={product}
              recentPages={recentPages}
              onOpen={openPage}
            />
          ) : (
            <>
              <article className="lc-article">
                <p className="lc-eyebrow">{product.label} · {activePage.tab}</p>
                <h1>{activePage.title}</h1>
                {activePage.desc ? <p className="lc-lede">{activePage.desc}</p> : null}

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
            </>
          )}
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

/* ── product landing ─────────────────────────────────────────────────────── */

function Landing({ product, recentPages, onOpen }) {
  const count = ORDER_BY_PRODUCT[product.id]?.length || 0;

  return (
    <div className="lc-landing">
      <header className="lc-hero" style={{ "--pc": product.accent }}>
        <img src={product.icon} alt="" />
        <div>
          <p className="lc-eyebrow">LangChain documentation · Python</p>
          <h1>{product.label}</h1>
          <p className="lc-lede">{product.blurb}</p>
          <p className="lc-hero-meta">
            <FileText size={12} /> {count} pages
            <span className="lc-dot" />
            <a href={LANGCHAIN_SOURCE_URL} target="_blank" rel="noopener noreferrer">
              docs.langchain.com <ExternalLink size={10} />
            </a>
          </p>
        </div>
      </header>

      {recentPages.length ? (
        <section className="lc-landing-block">
          <p className="lc-rail-label"><Clock size={12} /> Recently read</p>
          <div className="lc-chip-row">
            {recentPages.map((page) => (
              <button key={page.slug} type="button" className="lc-chip" onClick={() => onOpen(page.slug)}>
                {page.title}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {product.tabs.map((tab, index) => {
        const pages = [];
        const walk = (items) => items.forEach((item) => {
          if (item.slug) pages.push(item);
          else if (item.items) walk(item.items);
        });
        walk(tab.items);
        if (!pages.length) return null;

        return (
          <section className="lc-landing-block" key={`${tab.tab}-${index}`}>
            <p className="lc-rail-label">
              <Layers size={12} />
              {tab.section ? `${tab.section} · ${tab.tab}` : tab.tab}
              <em>{pages.length}</em>
            </p>
            <div className="lc-grid">
              {pages.slice(0, 9).map((page) => {
                const full = PAGE_BY_SLUG[page.slug];
                return (
                  <button key={page.slug} type="button" className="lc-tile" onClick={() => onOpen(page.slug)}>
                    <span className="lc-tile-title">{page.title}</span>
                    {full?.desc ? <span className="lc-tile-desc">{full.desc}</span> : null}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
