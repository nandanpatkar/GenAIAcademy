import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Search, BookMarked, HelpCircle, X, HelpCircle as InfoIcon } from "lucide-react";
import { REFERENCE_STRUCTURE } from "../data/referenceData";
import RunnableCodeBlock from "./RunnableCodeBlock";
import "../styles/Reference.css";

// Helper to strip and parse YAML frontmatter
function parseFrontmatter(text) {
  if (!text.startsWith("---")) return { meta: {}, body: text };
  const parts = text.split("---", 2);
  if (parts.length < 2) return { meta: {}, body: text };
  
  const frontmatterStr = parts[1];
  const body = text.slice(parts[0].length + frontmatterStr.length + 6);
  
  const meta = {};
  frontmatterStr.split("\n").forEach(line => {
    const idx = line.indexOf(":");
    if (idx > -1) {
      const key = line.substring(0, idx).trim();
      let val = line.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      meta[key] = val;
    }
  });
  
  return { meta, body };
}

export default function ReferenceViewer({ activeTopic, onSelectTopic, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [markdownContent, setMarkdownContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fontStyle, setFontStyle] = useState("sans");
  const scrollContainerRef = useRef(null);

  // Extract all unique categories
  const categoriesList = useMemo(() => {
    const cats = new Set();
    REFERENCE_STRUCTURE.forEach(item => {
      if (item.categories && Array.isArray(item.categories)) {
        item.categories.forEach(c => cats.add(c));
      }
    });
    return ["All", ...Array.from(cats).sort()];
  }, []);

  // Filter reference sheets based on search and category
  const filteredReferences = useMemo(() => {
    return REFERENCE_STRUCTURE.filter(item => {
      const matchesCategory = selectedCategory === "All" || (item.categories && item.categories.includes(selectedCategory));
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) ||
        (item.intro && item.intro.toLowerCase().includes(query)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(query))) ||
        (item.categories && item.categories.some(c => c.toLowerCase().includes(query)));
        
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Fetch reference sheet content when activeTopic changes
  useEffect(() => {
    if (!activeTopic) {
      setMarkdownContent("");
      setError(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(activeTopic.filePath)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch reference sheet: ${res.statusText}`);
        }
        return res.text();
      })
      .then(text => {
        if (isMounted) {
          const { body } = parseFrontmatter(text);
          setMarkdownContent(body);
          setLoading(false);
          // Scroll to top of reading area
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
          }
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error(err);
          setError(err.message || "An error occurred while loading content.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeTopic]);

  const handleAnchorClick = (e, href) => {
    if (!href) return;
    if (href.startsWith("#")) {
      // Allow default hash navigation or scroll
      return;
    }
    e.preventDefault();
    
    // Check if it's an internal reference sheet link (e.g. /python or /python#section)
    const internalMatch = href.match(/^\/([^#?]+)/);
    if (internalMatch) {
      const slug = internalMatch[1];
      const target = REFERENCE_STRUCTURE.find(item => item.slug === slug);
      if (target) {
        onSelectTopic(target);
        return;
      }
    }
    
    // Otherwise open in new window
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="reference-viewer-panel">
      {/* HEADER SECTION */}
      <div className="reference-viewer-header">
        {activeTopic ? (
          <>
            <button className="reference-back-btn" onClick={() => onSelectTopic(null)}>
              <ArrowLeft size={14} /> BACK TO REFERENCES
            </button>
            <button className="reference-back-btn" onClick={onClose}>
              CLOSE
            </button>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px" }}>
              <select 
                value={fontStyle}
                onChange={(e) => setFontStyle(e.target.value)}
                className="reference-font-select"
              >
                <option value="sans">Sans-serif</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
              </select>
              <div className="reference-viewer-meta">
                {activeTopic.categories && activeTopic.categories.map(c => (
                  <span key={c} className="reference-badge neon-glow">{c}</span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <BookMarked size={18} className="neon-text" style={{ color: "var(--neon)" }} />
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 900, letterSpacing: 0.5 }}>QUICK REFERENCES</h2>
            </div>
            <button className="reference-back-btn" onClick={onClose} style={{ marginLeft: "auto" }}>
              CLOSE
            </button>
          </>
        )}
      </div>

      {/* BODY CONTENT */}
      <div className="reference-viewer-body" ref={scrollContainerRef}>
        <div className="reference-content-container">
          {activeTopic ? (
            /* READING VIEW */
            loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 0", gap: 16 }}>
                <div className="loading-orb" style={{ width: 32, height: 32, border: "2px solid var(--neon)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: 13, color: "var(--text3)" }}>Decrypting reference guide...</span>
              </div>
            ) : error ? (
              <div style={{ padding: "40px 24px", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.2)", background: "rgba(239, 68, 68, 0.02)", borderRadius: 12 }}>
                <X size={32} color="#ef4444" style={{ margin: "0 auto 12px" }} />
                <div style={{ fontSize: 14, color: "#ef4444", fontWeight: 700, marginBottom: 8 }}>{error}</div>
                <button 
                  onClick={() => onSelectTopic(activeTopic)} 
                  style={{ padding: "6px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: 11, cursor: "pointer" }}
                >
                  Retry Loading
                </button>
              </div>
            ) : (
              <div className={`reference-markdown-body font-${fontStyle}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !match;
                      const text = String(children).replace(/\n$/, "");
                      
                      return !isInline ? (
                        <RunnableCodeBlock
                          language={match[1]}
                          code={text}
                          {...props}
                        />
                      ) : (
                        <code className="reference-inline-code" {...props}>
                          {children}
                        </code>
                      );
                    },
                    a: ({ node, href, children, ...props }) => (
                      <a 
                        href={href} 
                        onClick={(e) => handleAnchorClick(e, href)} 
                        {...props}
                      >
                        {children}
                      </a>
                    )
                  }}
                >
                  {markdownContent}
                </ReactMarkdown>
              </div>
            )
          ) : (
            /* PORTAL LIST / GRID VIEW */
            <>
              {/* CONTROLS (SEARCH & CATEGORIES) */}
              <div className="reference-portal-controls">
                <div className="reference-search-box">
                  <Search className="reference-search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Search cheat sheets by topic, tags, categories..."
                    className="reference-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="reference-category-pills">
                  {categoriesList.map(cat => (
                    <button
                      key={cat}
                      className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* GRID */}
              {filteredReferences.length > 0 ? (
                <div className="reference-grid">
                  {filteredReferences.map(ref => (
                    <div
                      key={ref.slug}
                      className="reference-card"
                      style={{ "--topic-color": ref.bgColor }}
                      onClick={() => onSelectTopic(ref)}
                    >
                      <div className="reference-card-header">
                        <h3 className="reference-card-title">{ref.title}</h3>
                        <div className="reference-card-color-dot" />
                      </div>
                      <p className="reference-card-intro">
                        {ref.intro || `Developer cheat sheet and quick reference guide for ${ref.title}.`}
                      </p>
                      <div className="reference-card-tags">
                        {ref.categories && ref.categories.map(c => (
                          <span key={c} className="reference-card-tag" style={{ borderLeft: `2px solid ${ref.bgColor}` }}>
                            {c}
                          </span>
                        ))}
                        {ref.tags && ref.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="reference-card-tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="reference-no-results">
                  <InfoIcon size={36} />
                  <p>No cheat sheets match your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
