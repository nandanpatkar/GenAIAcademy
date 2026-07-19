import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, Clock, Tag, Search, BookOpen, Edit3, Sparkles, ArrowUpRight, Activity, Layers3, Database, SlidersHorizontal } from "lucide-react";
import { supabase } from "../../config/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import AdminBlogEditor from "./AdminBlogEditor";
import { generateAI_TLDR } from "../../services/aiService";
import { CHRONOLOGICAL_DB } from "../../data/blogData";
import "./BlogPage.css";

const ARCHIVE_YEARS = Object.keys(CHRONOLOGICAL_DB).sort((a, b) => {
  if (a === "Featured") return 1;
  if (b === "Featured") return -1;
  return b.localeCompare(a);
});

const ARCHIVE_BLOGS = ARCHIVE_YEARS.flatMap(year => CHRONOLOGICAL_DB[year].map((article, index) => ({
    id: `archive-${year}-${index}-${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title: article.title,
    content: article.description || `Read ${article.title} on Analytics Vidya.`,
    description: article.description,
    tags: [year, "Analytics Vidya"],
    url: article.url,
    created_at: `${year === "Featured" ? "2025" : year}-01-01T00:00:00.000Z`,
    is_external: true,
    archive_year: year,
    source: "Intelligence Hub",
  })));

export default function BlogPage({ theme, isEditMode, onClose }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  
  const { user, isAdmin } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) console.error("Error fetching blogs:", error);
      const published = error ? [] : (data || []);
      const archiveUrls = new Set(ARCHIVE_BLOGS.map(blog => blog.url).filter(Boolean));
      // Keep the Intelligence Hub archive as the primary catalogue. Published
      // in-app posts remain available after it without duplicating archive URLs.
      setBlogs([...ARCHIVE_BLOGS, ...published.filter(blog => !blog.url || !archiveUrls.has(blog.url))]);
    } catch (err) {
      console.error("Error connecting to Supabase for blogs:", err);
      // The Hub archive is local, so it should still render if the CMS is offline.
      setBlogs(ARCHIVE_BLOGS);
    }
    setLoading(false);
  };

  const filteredBlogs = blogs.filter(b => {
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
            <p>Intelligence Hub · Research repository</p>
          </div>
        </div>

        <div className="blog-header-rail"><span /><span /><span /></div>

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
            onClose={() => { setShowEditor(false); setEditingBlog(null); fetchBlogs(); }} 
            theme={theme} 
          />
        ) : selectedBlog ? (
          <BlogDetail 
            blog={selectedBlog} 
            allBlogs={blogs}
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
            onSelect={(blog) => {
              if (blog.is_external && blog.url) {
                window.open(blog.url, '_blank', 'noopener,noreferrer');
              } else {
                setSelectedBlog(blog);
              }
            }}
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

function BlogList({ blogs, loading, onSelect, searchQuery, setSearchQuery, selectedTags, setSelectedTags, isAdmin, onWrite }) {
  const [activeYear, setActiveYear] = useState("All");

  const getBlogYear = (blog) => blog.archive_year || (blog.created_at ? new Date(blog.created_at).getFullYear().toString() : "Unsorted");
  const availableYears = ["All", ...Array.from(new Set(blogs.map(getBlogYear))).sort((a, b) => {
    if (a === "Featured") return 1;
    if (b === "Featured") return -1;
    return b.localeCompare(a);
  })];
  const visibleBlogs = activeYear === "All" ? blogs : blogs.filter(blog => getBlogYear(blog) === activeYear);
  const yearSections = Array.from(new Set(visibleBlogs.map(getBlogYear))).map(year => ({
    year,
    posts: visibleBlogs.filter(blog => getBlogYear(blog) === year),
  }));

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
          <div className="blog-kicker"><span className="blog-live-dot" /> INTELLIGENCE HUB / RESEARCH REPOSITORY</div>
          <h2>Signals worth<br /><em>understanding.</em></h2>
          <p>Every article that opens from the Intelligence Hub, organized as an explorable system of research nodes.</p>
          <div className="blog-hero-stats">
            <span><strong>{blogs.filter(blog => blog.is_external).length}</strong> hub articles</span>
            <span><strong>{availableYears.length - 1}</strong> year bands</span>
            <span><strong>01</strong> shared source</span>
          </div>
        </div>
        <div className="blog-hero-diagram" aria-hidden="true">
          <div className="diagram-line diagram-line-one" />
          <div className="diagram-line diagram-line-two" />
          <div className="diagram-node diagram-node-core"><Activity size={18} /><span>RESEARCH</span></div>
          <div className="diagram-node diagram-node-top"><Layers3 size={16} /><span>MODELS</span></div>
          <div className="diagram-node diagram-node-right"><Database size={16} /><span>ARCHIVE</span></div>
          <div className="diagram-node diagram-node-bottom"><BookOpen size={16} /><span>INSIGHTS</span></div>
        </div>
      </section>

      <section className="blog-toolbar" aria-label="Blog filters">
        <div className="blog-year-filter">
          <span className="toolbar-label"><SlidersHorizontal size={13} /> YEAR VIEW</span>
          {availableYears.map(year => (
            <button key={year} className={activeYear === year ? "year-filter active" : "year-filter"} onClick={() => setActiveYear(year)}>
              {year === "All" ? "All years" : year}
            </button>
          ))}
        </div>
        <label className="blog-search">
          <Search size={16} />
          <input type="text" placeholder="Search the repository..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </label>
      </section>

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
                    <div className="blog-card-top"><span className="blog-card-index">{String(index + 1).padStart(2, "0")}</span><span className="blog-card-source">{blog.is_external ? "AL_VIDHYA / HUB" : "ACADEMY / NOTE"}</span><ArrowUpRight size={15} /></div>
                    <div className="blog-card-icon">{blog.is_external ? <Database size={17} /> : <BookOpen size={17} />}</div>
                    <h4>{blog.title}</h4>
                    <p>{(blog.description || blog.content || "").replace(/<[^>]+>/g, "").substring(0, 150)}{(blog.description || blog.content || "").length > 150 ? "…" : ""}</p>
                    <div className="blog-card-footer"><span>{blog.is_external ? "OPEN RESEARCH" : "READ ARTICLE"}</span><span className="blog-card-year">{getBlogYear(blog)}</span></div>
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

function BlogDetail({ blog, allBlogs, onBack, isAdmin, onEdit, onTagClick, onSelectRelated }) {
  const [progress, setProgress] = useState(0);
  const [toc, setToc] = useState([]);
  const [tldr, setTldr] = useState("");
  const [loadingTldr, setLoadingTldr] = useState(false);
  const contentRef = useRef(null);

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

  const handleGenerateTLDR = async () => {
    setLoadingTldr(true);
    try {
      const summary = await generateAI_TLDR(blog.content);
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
      {/* Progress Bar */}
      <div style={{ position: 'fixed', top: 42, left: 0, right: 0, height: 3, background: 'var(--border)', zIndex: 100 }}>
        <div style={{ height: '100%', background: 'var(--primary)', width: `${progress}%`, transition: 'width 0.1s' }} />
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

            {isAdmin && (
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
              {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <span>•</span>
            <span>{Math.max(1, Math.ceil((blog.content || '').length / 1000))} min read</span>
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

          <div 
            ref={contentRef}
            className="blog-content"
            style={{ fontSize: 18, lineHeight: 1.8, color: 'var(--text)' }}
            dangerouslySetInnerHTML={{ __html: blog.content || '<p>No content available.</p>' }}
          />

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
