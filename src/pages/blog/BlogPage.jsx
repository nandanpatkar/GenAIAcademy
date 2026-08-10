import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, Clock, Tag, Search, BookOpen, Edit3, Sparkles, ArrowUpRight, Activity, Layers3, Database, SlidersHorizontal } from "lucide-react";
import { supabase } from "../../config/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import AdminBlogEditor from "./AdminBlogEditor";
import { generateAI_TLDR } from "../../services/aiService";
import { loadYears, loadYear, monthLabel } from "../../services/avArchiveService";
import AVArticle from "./AVArticle";
import "./BlogPage.css";

const NOTES_TAB = "notes";

/**
 * Map one archive post onto the card shape this page already renders.
 *
 * These used to be outbound link-outs built by Title-Casing a URL
 * slugs, which is why titles read like "Ai Agents Vs Apps" and every
 * description was the same generated sentence. They are now real local
 * articles with real titles, categories and cover images, so `is_external` is
 * gone and selecting one opens it in place.
 */
function toCard(post, year) {
  return {
    id: `av-${post.slug}`,
    slug: post.slug,
    title: post.title,
    description: post.excerpt,
    content: post.excerpt,
    tags: post.categories,
    archive_year: String(year),
    created_at: `${post.month || `${year}-01`}-01T00:00:00.000Z`,
    month: post.month,
    hero: post.hero,
    imageCount: post.imageCount,
    source: "av",
  };
}

export default function BlogPage({ theme, isEditMode, onClose, initialYear, initialSlug, initialTag }) {
  const [notes, setNotes] = useState([]);        // published CMS posts
  const [years, setYears] = useState([]);        // archive year summary
  // A slug carries its own year prefix, so deep-linking to an article needs no
  // extra lookup — it selects the year that must be loaded to find the post.
  const [activeYear, setActiveYear] = useState(
    initialSlug ? initialSlug.slice(0, 4) : (initialYear ? String(initialYear) : null)
  );
  const [pendingSlug, setPendingSlug] = useState(initialSlug || null);
  const [yearPosts, setYearPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState(initialTag ? [initialTag] : []);

  const { user, isAdmin } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // The CMS rows and the archive summary are independent, so they load in
  // parallel rather than paying both latencies in series.
  useEffect(() => { fetchNotes(); }, []);

  useEffect(() => {
    let alive = true;
    loadYears().then((summary) => {
      if (!alive) return;
      const list = summary.years || [];
      setYears(list);
      // Default to the newest year rather than everything: the whole point of
      // the per-year split is that 8,632 posts never load at once.
      setActiveYear((current) => current || (list[0] ? String(list[0].y) : NOTES_TAB));
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!activeYear || activeYear === NOTES_TAB) { setYearPosts([]); setLoading(false); return undefined; }
    let alive = true;
    setLoading(true);
    loadYear(activeYear).then((data) => {
      if (!alive) return;
      const cards = data.posts.map((post) => toCard(post, data.year));
      setYearPosts(cards);
      setLoading(false);
      // Deep link: open the requested article as soon as its year is in hand.
      if (pendingSlug) {
        const match = cards.find((card) => card.slug === pendingSlug);
        if (match) setSelectedBlog(match);
        setPendingSlug(null);
      }
    });
    return () => { alive = false; };
  }, [activeYear, pendingSlug]);

  // Opening a different article from outside while the page is already mounted.
  useEffect(() => {
    if (!initialSlug) return;
    setPendingSlug(initialSlug);
    setActiveYear(initialSlug.slice(0, 4));
  }, [initialSlug]);

  // Same, for a category arriving from a topic node in the galaxy. The year is
  // applied first because switching years clears the chips.
  useEffect(() => {
    if (!initialTag) return;
    setSelectedBlog(null);
    if (initialYear) setActiveYear(String(initialYear));
    setSelectedTags([initialTag]);
  }, [initialTag, initialYear]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Error fetching blogs:", error);
        return;
      }
      setNotes(data || []);
    } catch (err) {
      // The archive is independent of the CMS, so it must still render.
      console.error("Error connecting to Supabase for blogs:", err);
    }
  };

  const sourceBlogs = activeYear === NOTES_TAB ? notes : yearPosts;
  const filteredBlogs = sourceBlogs.filter(b => {
    const search = searchQuery.toLowerCase();
    const matchesSearch = (b.title || '').toLowerCase().includes(search) ||
                          (b.description || '').toLowerCase().includes(search) ||
                          (b.tags && b.tags.some(t => t.toLowerCase().includes(search)));
    const matchesTags = selectedTags.length === 0 || selectedTags.every(t => (b.tags || []).includes(t));
    return matchesSearch && matchesTags;
  });

  return (
    <div className="blog-shell" style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", overflow: "hidden", background: "var(--bg)" }}>
      {/* ══ TOP TAB BAR ══════════════════════════════════════════════════════ */}
      <header className="blog-header">
        
        {/* Placeholder for sidebar toggle alignment */}
        <div className="blog-header-spacer" />

        {/* Logo + Title Stack */}
        <div className="blog-brand">
          <div className="blog-brand-mark">
            <BookOpen size={18} />
          </div>
          <div>
            <h1>GenAI Blog</h1>
            <p>Research repository</p>
          </div>
        </div>

        {/* Context slot. Replaces a purely decorative rule that used to run
            straight through the subtitle at this width. */}
        <div className="blog-header-context">
          {selectedBlog ? (
            <button className="blog-header-back" onClick={() => setSelectedBlog(null)}>
              <ChevronLeft size={15} />
              <span className="blog-header-back-label">All articles</span>
              <span className="blog-header-crumb">{selectedBlog.title}</span>
            </button>
          ) : (
            <div className="blog-header-summary">
              <span className="blog-header-year">
                {activeYear === NOTES_TAB ? "Academy notes" : activeYear}
              </span>
              <span className="blog-header-dot" />
              <span>{filteredBlogs.length.toLocaleString()} articles</span>
            </div>
          )}
        </div>

        <div className="blog-header-actions">
          {isAdmin && !showEditor && !selectedBlog && (
            <button
              onClick={() => { setEditingBlog(null); setShowEditor(true); }}
              className="blog-write-button"
            >
              <Edit3 size={14} /> WRITE ARTICLE
            </button>
          )}

          <div className="blog-header-divider" />

          <button onClick={onClose} className="blog-close-button" aria-label="Close Blogs">
            <X size={20} />
          </button>
        </div>
      </header>

      {/* ══ CONTENT AREA ══════════════════════════════════════════════════════ */}
      <div id="blog-scroll-container" className="blog-scroll-container" style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        {showEditor ? (
          <AdminBlogEditor
            blog={editingBlog}
            onClose={() => { setShowEditor(false); setEditingBlog(null); fetchNotes(); }}
            theme={theme}
          />
        ) : selectedBlog ? (
          <BlogDetail
            blog={selectedBlog}
            allBlogs={sourceBlogs}
            dark={theme !== "light"}
            onBack={() => setSelectedBlog(null)}
            isAdmin={isAdmin}
            onEdit={() => { setEditingBlog(selectedBlog); setShowEditor(true); }}
            onTagClick={(tag) => { setSelectedBlog(null); setSelectedTags([tag]); }}
            onSelectRelated={setSelectedBlog}
          />
        ) : (
          <BlogList
            blogs={filteredBlogs}
            loading={loading}
            years={years}
            activeYear={activeYear}
            setActiveYear={(year) => { setActiveYear(year); setSelectedTags([]); }}
            noteCount={notes.length}
            onSelect={setSelectedBlog}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            isAdmin={isAdmin}
            onWrite={() => { setEditingBlog(null); setShowEditor(true); }}
          />
        )}
      </div>
    </div>
  );
}

function BlogList({ blogs, loading, years, activeYear, setActiveYear, noteCount, onSelect, searchQuery, setSearchQuery, selectedTags, setSelectedTags, isAdmin, onWrite }) {
  const getBlogYear = (blog) => blog.archive_year || (blog.created_at ? new Date(blog.created_at).getFullYear().toString() : "Unsorted");
  const totalArchive = years.reduce((sum, entry) => sum + entry.n, 0);

  // Only one year is ever in memory, so the page renders a single band. The
  // year tabs come from the ~700 byte summary rather than from the loaded
  // posts, so every year is offered without having fetched any of them.
  const yearSections = blogs.length
    ? [{ year: activeYear === NOTES_TAB ? "Notes" : activeYear, posts: blogs }]
    : [];

  // The most common categories in the loaded year, as quick filters. Capped
  // because a year can carry well over a hundred distinct ones.
  const topTags = React.useMemo(() => {
    const counts = new Map();
    for (const blog of blogs) {
      for (const tag of blog.tags || []) counts.set(tag, (counts.get(tag) || 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);
  }, [blogs]);

  if (loading) {
    return (
      <div className="blog-loading-state">
        <div>
           <div className="blog-loading-orbit" />
           <span>Syncing research nodes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-list">
      <section className="blog-hero-panel">
        <div className="blog-hero-grid" aria-hidden="true" />
        <div className="blog-hero-copy">
          <div className="blog-kicker"><span className="blog-live-dot" /> RESEARCH REPOSITORY</div>
          <h2>Signals worth<br /><em>understanding.</em></h2>
          <p>
            {totalArchive.toLocaleString()} data science and machine learning articles,
            {years.length ? ` spanning ${years[years.length - 1].y}–${years[0].y}` : ""},
            readable in full without leaving the app.
          </p>
          <div className="blog-hero-stats">
            <span><strong>{totalArchive.toLocaleString()}</strong> articles</span>
            <span><strong>{years.length}</strong> years</span>
            <span><strong>{noteCount}</strong> academy notes</span>
          </div>
        </div>

        {/* Replaces a purely decorative node diagram. Same space, but it now
            shows how the archive is distributed and doubles as navigation. */}
        <div className="blog-hero-chart">
          <div className="blog-hero-chart-head">
            <span>ARTICLES PER YEAR</span>
            <em>{activeYear === NOTES_TAB ? "notes" : activeYear}</em>
          </div>
          <div className="blog-hero-bars">
            {[...years].reverse().map(({ y, n }) => {
              const peak = Math.max(...years.map((entry) => entry.n), 1);
              return (
                <button
                  key={y}
                  className={activeYear === String(y) ? "hero-bar active" : "hero-bar"}
                  style={{ "--bar": `${Math.max(4, (n / peak) * 100)}%` }}
                  onClick={() => setActiveYear(String(y))}
                  title={`${y} — ${n.toLocaleString()} articles`}
                  aria-label={`${y}, ${n} articles`}
                >
                  <span className="hero-bar-fill" />
                  <em>{String(y).slice(2)}</em>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="blog-toolbar" aria-label="Blog filters">
        <div className="blog-year-filter">
          <span className="toolbar-label"><SlidersHorizontal size={13} /> YEAR VIEW</span>
          {years.map(({ y, n }) => (
            <button
              key={y}
              className={activeYear === String(y) ? "year-filter active" : "year-filter"}
              onClick={() => setActiveYear(String(y))}
              title={`${n.toLocaleString()} articles`}
            >
              {y}<em className="year-filter-count">{n}</em>
            </button>
          ))}
          {noteCount > 0 && (
            <button
              className={activeYear === NOTES_TAB ? "year-filter active" : "year-filter"}
              onClick={() => setActiveYear(NOTES_TAB)}
            >
              Notes<em className="year-filter-count">{noteCount}</em>
            </button>
          )}
        </div>
        <label className="blog-search">
          <Search size={16} />
          <input type="text" placeholder="Search the repository..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </label>
      </section>

      {topTags.length > 0 && (
        <div className="blog-tag-rail" aria-label="Filter by category">
          {topTags.map(([tag, count]) => (
            <button
              key={tag}
              className={selectedTags.includes(tag) ? "blog-tag-chip active" : "blog-tag-chip"}
              onClick={() => setSelectedTags(
                selectedTags.includes(tag)
                  ? selectedTags.filter(t => t !== tag)
                  : [...selectedTags, tag]
              )}
            >
              {tag}<em>{count}</em>
            </button>
          ))}
        </div>
      )}

      {selectedTags.length > 0 && (
        <div className="blog-active-filters">
          <span>FILTERED BY</span>
          {selectedTags.map(tag => (
            <button key={tag} onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}>{tag}<X size={12} /></button>
          ))}
          <button className="clear-filters" onClick={() => setSelectedTags([])}>Clear all</button>
        </div>
      )}

      {yearSections.length === 0 ? (
        <div className="blog-empty-state"><BookOpen size={34} /><div>{searchQuery ? "No nodes match that search." : "No published research nodes yet."}</div></div>
      ) : (
        <div className="blog-year-sections">
          {yearSections.map(({ year, posts }) => (
            <section className="blog-year-section" key={year}>
              <div className="blog-year-heading">
                <div className="year-heading-mark"><span>{year === "Featured" ? "✦" : year.slice(-2)}</span></div>
                <div><p>{year === "Featured" ? "CURATED SIGNALS" : "RESEARCH BAND"}</p><h3>{year === "Featured" ? "Featured research" : `${year} archive`}</h3></div>
                <span className="blog-year-count">{posts.length.toString().padStart(2, "0")} nodes</span>
              </div>
              <div className="blog-card-grid">
                {posts.map((blog, index) => (
                  <article className="blog-card" key={blog.id} onClick={() => onSelect(blog)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelect(blog); }}>
                    <div className="blog-card-glow" />
                    {blog.hero && (
                      <div className="blog-card-cover">
                        <img
                          src={blog.hero}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width={400}
                          height={225}
                          onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
                        />
                      </div>
                    )}
                    <div className="blog-card-top"><span className="blog-card-index">{String(index + 1).padStart(2, "0")}</span><span className="blog-card-source">{blog.source === "av" ? "ARCHIVE / RESEARCH" : "ACADEMY / NOTE"}</span><ArrowUpRight size={15} /></div>
                    {!blog.hero && <div className="blog-card-icon">{blog.source === "av" ? <Database size={17} /> : <BookOpen size={17} />}</div>}
                    <h4>{blog.title}</h4>
                    <p>{(blog.description || blog.content || "").replace(/<[^>]+>/g, "").substring(0, 150)}{(blog.description || blog.content || "").length > 150 ? "…" : ""}</p>
                    <div className="blog-card-footer"><span>READ ARTICLE</span><span className="blog-card-year">{getBlogYear(blog)}</span></div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogDetail({ blog, allBlogs, onBack, isAdmin, onEdit, onTagClick, onSelectRelated, dark = true }) {
  const [progress, setProgress] = useState(0);
  const [toc, setToc] = useState([]);
  const [tldr, setTldr] = useState("");
  const [loadingTldr, setLoadingTldr] = useState(false);
  const contentRef = useRef(null);
  // Archive posts are markdown fetched from R2; CMS posts are stored HTML.
  const isArchive = blog.source === "av";

  useEffect(() => {
    const container = document.getElementById('blog-scroll-container');
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight <= clientHeight) {
        setProgress(100);
        return;
      }
      setProgress((scrollTop / (scrollHeight - clientHeight)) * 100);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setTldr(""); // reset tldr on new blog
    if (isArchive) return; // AVArticle reports its own TOC once markdown lands
    if (contentRef.current) {
      const headings = Array.from(contentRef.current.querySelectorAll('h1, h2, h3'));
      const tocItems = headings.map((h, i) => {
        const id = h.id || `heading-${i}`;
        h.id = id;
        return {
          id,
          text: h.textContent,
          level: Number(h.tagName.substring(1))
        };
      });
      setToc(tocItems);
    }
  }, [blog]);

  // For archive posts this is filled in by AVArticle once the markdown lands,
  // so the summary runs on the real article rather than the card excerpt.
  const [articleText, setArticleText] = useState("");
  useEffect(() => { setArticleText(""); }, [blog?.id]);

  const handleGenerateTLDR = async () => {
    setLoadingTldr(true);
    try {
      const summary = await generateAI_TLDR(articleText || blog.content);
      setTldr(summary);
    } catch (err) {
      alert("Failed to summarize");
    }
    setLoadingTldr(false);
  };

  const relatedPosts = (allBlogs || [])
    .filter(b => b.id !== blog.id)
    .map(b => {
      const shared = (b.tags || []).filter(t => (blog.tags || []).includes(t)).length;
      return { ...b, shared };
    })
    .filter(b => b.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3);

  return (
    <div className="blog-detail-shell" style={{ position: 'relative' }}>
      {/* Reading progress. Anchored to the header's real height via a CSS
          variable — it was hardcoded to 42px and drew straight through the
          68px header's title. */}
      <div className="blog-progress-track">
        <div className="blog-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="blog-detail-layout" style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', alignItems: 'flex-start' }}>
        
        {/* Main Content */}
        <div className="blog-detail-main" style={{ flex: 1, padding: '40px 24px 80px', maxWidth: 860 }}>
          <div className="blog-detail-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <button 
              onClick={onBack}
              style={{
                background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, padding: '8px 12px', borderRadius: 8,
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <ChevronLeft size={18} />
              Back to articles
            </button>

            {isAdmin && !isArchive && (
              <button 
                onClick={onEdit}
                style={{
                  background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '6px 12px', borderRadius: 6,
                  transition: 'background 0.2s', fontWeight: 600
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <Edit3 size={14} />
                Edit Article
              </button>
            )}
          </div>

          {blog.cover_image && (
            <img 
              src={blog.cover_image} 
              alt={blog.title}
              style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 20, marginBottom: 48, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '1px solid var(--border)' }}
            />
          )}

          <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
            {(blog.tags || []).map(tag => (
              <span key={tag} 
                onClick={() => onTagClick(tag)}
                style={{
                  fontSize: 13, background: 'rgba(0, 255, 136, 0.1)', color: 'var(--primary)', cursor: 'pointer',
                  padding: '6px 12px', borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                  border: '1px solid rgba(0, 255, 136, 0.2)'
                }}>
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>

          <h1 className="blog-detail-title" style={{ fontSize: 48, margin: '0 0 24px 0', fontWeight: 800, lineHeight: 1.2, color: 'var(--text)' }}>
            {blog.title}
          </h1>

          <div className="blog-detail-meta" style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text2)', marginBottom: 24, fontSize: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} />
              {isArchive
                ? monthLabel(blog.month)
                : new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            {(articleText || !isArchive) && (
              <>
                <span>•</span>
                <span>{Math.max(1, Math.ceil((articleText || blog.content || '').length / 1100))} min read</span>
              </>
            )}
            {isArchive && blog.imageCount > 0 && (
              <><span>•</span><span>{blog.imageCount} figures</span></>
            )}
          </div>

          {/* AI TLDR Action */}
          <div className="blog-detail-tldr" style={{ paddingBottom: 40, borderBottom: '1px solid var(--border)', marginBottom: 40 }}>
            {!tldr ? (
              <button onClick={handleGenerateTLDR} disabled={loadingTldr}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
                  border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: 8, padding: '10px 16px', color: '#ec4899', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: loadingTldr ? 0.7 : 1
                }}>
                <Sparkles size={16} />
                {loadingTldr ? "Generating TL;DR..." : "✨ Read AI Summary"}
              </button>
            ) : (
              <div style={{ background: 'var(--bg2)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: 12, padding: 24, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ec4899', fontSize: 13, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <Sparkles size={14} /> AI TL;DR
                </div>
                <div style={{ color: 'var(--text)', fontSize: 15, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: tldr }} />
              </div>
            )}
          </div>

          {isArchive ? (
            <AVArticle
              post={blog}
              dark={dark}
              onTocChange={setToc}
              onLoaded={setArticleText}
            />
          ) : (
            <div
              ref={contentRef}
              className="blog-content"
              style={{ fontSize: 18, lineHeight: 1.8, color: 'var(--text)' }}
              dangerouslySetInnerHTML={{ __html: blog.content || '<p>No content available.</p>' }}
            />
          )}

          {/* Related Posts Strip */}
          {relatedPosts.length > 0 && (
            <div className="blog-detail-related" style={{ marginTop: 80, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 32 }}>Related Posts</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
                {relatedPosts.map(post => (
                  <div key={post.id} onClick={() => onSelectRelated(post)} 
                    style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}>
                    {post.cover_image && <div style={{ height: 120, background: `url(${post.cover_image}) center/cover` }} />}
                    <div style={{ padding: 16 }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: 16, color: 'var(--text)' }}>{post.title}</h4>
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>{post.tags.slice(0, 2).join(", ")}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TOC Sidebar */}
        {toc.length > 0 && (
          <div className="blog-detail-toc" style={{ width: 280, padding: '40px 24px', position: 'sticky', top: 0, height: 'calc(100vh - 42px)', overflowY: 'auto', display: 'none', '@media (min-width: 1024px)': { display: 'block' } }}>
            <h4 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text3)', fontWeight: 700, marginBottom: 20 }}>
              On this page
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {toc.map(item => (
                <a 
                  key={item.id} 
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                     fontSize: 14, color: 'var(--text2)', textDecoration: 'none', lineHeight: 1.4,
                     paddingLeft: (item.level - 1) * 12,
                     transition: 'color 0.2s', cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
                >
                  {item.text}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .blog-content h1, .blog-content h2, .blog-content h3 { scroll-margin-top: 60px; }
      `}</style>
    </div>
  );
}
