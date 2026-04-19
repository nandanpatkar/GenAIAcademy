import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, Clock, Tag, Search, BookOpen, Edit3, Sparkles } from "lucide-react";
import { supabase } from "../../config/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import AdminBlogEditor from "./AdminBlogEditor";
import { generateAI_TLDR } from "../../services/aiService";

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

      if (error) {
        console.error("Error fetching blogs:", error);
      } else {
        setBlogs(data || []);
      }
    } catch (err) {
      console.error("Error connecting to Supabase for blogs:", err);
    }
    setLoading(false);
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (b.tags && b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesTags = selectedTags.length === 0 || selectedTags.every(t => (b.tags || []).includes(t));
    return matchesSearch && matchesTags;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", overflow: "hidden", background: "var(--bg)" }}>
      {/* ══ TOP TAB BAR ══════════════════════════════════════════════════════ */}
      <header className="blog-header" style={{ height: 62, background: 'var(--bg2)', borderBottom: `1px solid var(--border)`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, flexShrink: 0 }}>
        
        {/* Placeholder for sidebar toggle alignment */}
        <div style={{ width: 30, height: 30, flexShrink: 0 }} />

        {/* Logo + Title Stack */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, #6366f1, #4f46e5)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 18px rgba(99, 102, 241, 0.35)' }}>
            <BookOpen size={19} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1.1, margin: 0 }}>GenAI Blog</h1>
            <p style={{ margin: 0, fontSize: 10, color: 'var(--text3)', fontWeight: 600 }}>Intelligence Hub · Latest Insights · Research Papers</p>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isAdmin && !showEditor && !selectedBlog && (
            <button 
              onClick={() => { setEditingBlog(null); setShowEditor(true); }}
              style={{
                background: 'var(--primary)', color: '#000', border: 'none', borderRadius: 8, padding: '8px 16px',
                fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 0 18px rgba(0, 255, 136, 0.35)'
              }}
            >
              <Edit3 size={14} /> WRITE ARTICLE
            </button>
          )}
          
          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '4px 8px' }}>
            <X size={20} />
          </button>
        </div>
      </header>

      {/* ══ CONTENT AREA ══════════════════════════════════════════════════════ */}
      <div id="blog-scroll-container" style={{ flex: 1, overflowY: "auto", position: "relative" }}>
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

function BlogList({ blogs, loading, onSelect, searchQuery, setSearchQuery, selectedTags, setSelectedTags, isAdmin, onWrite }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text2)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
           <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
           Loading articles...
        </div>
        <style>
          {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 48px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 12 }}>
              Latest Articles
            </h1>
            {isAdmin && (
              <button 
                onClick={onWrite}
                style={{
                  background: 'var(--primary)', color: '#000', border: 'none', borderRadius: 6, padding: '8px 16px',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
              >
                Write Article
              </button>
            )}
          </div>
          {selectedTags.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selectedTags.map(tag => (
                <span key={tag} style={{
                  fontSize: 12, background: 'rgba(0, 255, 136, 0.1)', color: 'var(--primary)',
                  padding: '4px 8px', borderRadius: 6, fontWeight: 600, border: '1px solid rgba(0, 255, 136, 0.2)',
                  display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer'
                }} onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}>
                  {tag} <X size={12} />
                </span>
              ))}
              <span style={{ fontSize: 12, color: 'var(--text3)', cursor: 'pointer', padding: '4px 8px' }} onClick={() => setSelectedTags([])}>
                Clear All
              </span>
            </div>
          )}
        </div>
        
        <div style={{
          display: 'flex', alignItems: 'center', background: 'var(--bg2)',
          border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', width: 320,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <Search size={16} color="var(--text2)" style={{ marginRight: 8 }} />
          <input 
            type="text" 
            placeholder="Search articles or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none', width: '100%', fontSize: 14
            }}
          />
        </div>
      </div>

      {blogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text3)' }}>
          <BookOpen size={48} opacity={0.3} style={{ marginBottom: 16 }} />
          <div>{searchQuery ? "No articles found matching your search." : "No published articles yet."}</div>
        </div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32
        }}>
          {blogs.map(blog => (
            <div 
              key={blog.id} 
              onClick={() => onSelect(blog)}
              style={{
                background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16,
                overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.3)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              {blog.cover_image ? (
                <div style={{ height: 200, width: '100%', background: `url(${blog.cover_image}) center/cover`, borderBottom: '1px solid var(--border)' }} />
              ) : (
                <div style={{ height: 200, width: '100%', background: 'linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--border)' }}>
                  <BookOpen size={48} color="var(--text3)" opacity={0.4} />
                </div>
              )}
              
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  {(blog.tags || []).map(tag => (
                    <span key={tag} 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (!selectedTags.includes(tag)) setSelectedTags([...selectedTags, tag]); 
                      }}
                      style={{
                        fontSize: 12, background: 'rgba(0, 255, 136, 0.1)', color: 'var(--primary)',
                        padding: '4px 8px', borderRadius: 6, fontWeight: 600, border: '1px solid rgba(0, 255, 136, 0.2)'
                      }}>
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h3 style={{ margin: '0 0 12px 0', fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>
                  {blog.title}
                </h3>
                
                <p style={{ margin: 0, fontSize: 15, color: 'var(--text2)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {blog.content ? blog.content.replace(/<[^>]+>/g, '').substring(0, 180) + '...' : ''}
                </p>
                
                <div style={{ marginTop: 'auto', paddingTop: 24, display: 'flex', alignItems: 'center', color: 'var(--text3)', fontSize: 13, fontWeight: 500 }}>
                  <Clock size={14} style={{ marginRight: 6 }} />
                  {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
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
    <div style={{ position: 'relative' }}>
      {/* Progress Bar */}
      <div style={{ position: 'fixed', top: 42, left: 0, right: 0, height: 3, background: 'var(--border)', zIndex: 100 }}>
        <div style={{ height: '100%', background: 'var(--primary)', width: `${progress}%`, transition: 'width 0.1s' }} />
      </div>

      <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', alignItems: 'flex-start' }}>
        
        {/* Main Content */}
        <div style={{ flex: 1, padding: '40px 24px 80px', maxWidth: 860 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
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

          <h1 style={{ fontSize: 48, margin: '0 0 24px 0', fontWeight: 800, lineHeight: 1.2, color: 'var(--text)' }}>
            {blog.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text2)', marginBottom: 24, fontSize: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} />
              {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <span>•</span>
            <span>{Math.max(1, Math.ceil((blog.content || '').length / 1000))} min read</span>
          </div>

          {/* AI TLDR Action */}
          <div style={{ paddingBottom: 40, borderBottom: '1px solid var(--border)', marginBottom: 40 }}>
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
            <div style={{ marginTop: 80, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
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
          <div style={{ width: 280, padding: '40px 24px', position: 'sticky', top: 0, height: 'calc(100vh - 42px)', overflowY: 'auto', display: 'none', '@media (min-width: 1024px)': { display: 'block' } }}>
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
