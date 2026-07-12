import React, { useState, useMemo } from "react";
import { 
  ChevronRight, Search, FileText, BookOpen,
  Network, HelpCircle, Atom, Monitor, Cpu, Globe, 
  Sparkles, Code, Boxes, GitBranch, Bug, CheckSquare, 
  Database, BarChart3, Link, Repeat, Cloud, Gauge, 
  Shield, Brain, Bot, Wrench, Rocket, Briefcase, Keyboard
} from "lucide-react";
import { MANUAL_STRUCTURE } from "../data/manualData";

// Helper to get category icons
export function getCategoryIcon(slug) {
  const map = {
    "logic": <Network size={14} />,
    "mathematics": <HelpCircle size={14} />,
    "physics": <Atom size={14} />,
    "operating-systems": <Monitor size={14} />,
    "hardware": <Cpu size={14} />,
    "networking": <Globe size={14} />,
    "programming-concepts": <Sparkles size={14} />,
    "programming-languages": <Code size={14} />,
    "web-fundamentals": <Globe size={14} />,
    "frameworks": <Boxes size={14} />,
    "version-control": <GitBranch size={14} />,
    "debugging": <Bug size={14} />,
    "testing": <CheckSquare size={14} />,
    "databases": <Database size={14} />,
    "data-analytics": <BarChart3 size={14} />,
    "apis": <Link size={14} />,
    "architecture": <Network size={14} />,
    "devops": <Repeat size={14} />,
    "infrastructure": <Cloud size={14} />,
    "performance": <Gauge size={14} />,
    "security": <Shield size={14} />,
    "ai-ml": <Brain size={14} />,
    "working-with-ai": <Bot size={14} />,
    "no-code": <Boxes size={14} />,
    "tooling": <Wrench size={14} />,
    "projects": <Rocket size={14} />,
    "working-as-a-developer": <Briefcase size={14} />,
    "practice": <Keyboard size={14} />
  };
  return map[slug] || <BookOpen size={14} />;
}

export default function ManualTree({ activePhase, onSelectPhase, isCollapsed }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedGuides, setExpandedGuides] = useState(new Set());

  // Handle toggling Category expansion
  const toggleCategory = (slug) => {
    const next = new Set(expandedCategories);
    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
    }
    setExpandedCategories(next);
  };

  // Handle toggling Guide expansion
  const toggleGuide = (slug) => {
    const next = new Set(expandedGuides);
    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
    }
    setExpandedGuides(next);
  };

  // Perform search matching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    const results = [];

    MANUAL_STRUCTURE.forEach(cat => {
      cat.guides.forEach(guide => {
        guide.phases.forEach(phase => {
          const matchCat = cat.name.toLowerCase().includes(query);
          const matchGuide = guide.title.toLowerCase().includes(query);
          const matchPhase = phase.title.toLowerCase().includes(query) || phase.summary.toLowerCase().includes(query);

          if (matchCat || matchGuide || matchPhase) {
            results.push({
              categorySlug: cat.slug,
              categoryName: cat.name,
              guideSlug: guide.slug,
              guideTitle: guide.title,
              phaseSlug: phase.slug,
              phaseTitle: phase.title,
              filePath: phase.filePath,
              summary: phase.summary
            });
          }
        });
      });
    });

    return results;
  }, [searchQuery]);

  if (isCollapsed) return null;

  return (
    <div className="sidebar-manual-container">
      <div className="manual-search-wrapper">
        <Search className="manual-search-icon" size={13} />
        <input
          type="text"
          placeholder="Search manual..."
          className="manual-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="manual-tree-scroll">
        {searchResults !== null ? (
          // Search Results View
          <div className="manual-search-results">
            {searchResults.length === 0 ? (
              <div style={{ padding: "12px 16px", color: "var(--text3)", fontSize: 11, fontStyle: "italic" }}>
                No guides match your search.
              </div>
            ) : (
              searchResults.map((res, i) => {
                const isActive = activePhase && activePhase.filePath === res.filePath;
                return (
                  <div
                    key={i}
                    className={`manual-phase-item ${isActive ? "active" : ""}`}
                    onClick={() => onSelectPhase({
                      categorySlug: res.categorySlug,
                      guideSlug: res.guideSlug,
                      phaseSlug: res.phaseSlug,
                      filePath: res.filePath,
                      title: res.phaseTitle
                    })}
                    style={{ padding: "6px 8px" }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, width: "100%" }}>
                      <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {res.phaseTitle}
                      </span>
                      <span style={{ fontSize: 8, color: "var(--text3)", opacity: 0.8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {res.categoryName} &gt; {res.guideTitle}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          // Standard Collapsible Tree View
          MANUAL_STRUCTURE.map((cat) => {
            const isCatExpanded = expandedCategories.has(cat.slug);
            return (
              <div key={cat.slug} className="manual-category-node">
                <div 
                  className={`manual-category-header ${isCatExpanded ? "expanded" : ""}`}
                  onClick={() => toggleCategory(cat.slug)}
                >
                  <span className="manual-category-icon">
                    {getCategoryIcon(cat.slug)}
                  </span>
                  <span>{cat.name}</span>
                  <ChevronRight 
                    size={11} 
                    className={`manual-category-arrow ${isCatExpanded ? "rotated" : ""}`} 
                  />
                </div>

                {isCatExpanded && (
                  <div className="manual-guides-list">
                    {cat.guides.map((guide) => {
                      const isGuideExpanded = expandedGuides.has(guide.slug);
                      const guideId = `${cat.slug}/${guide.slug}`;
                      return (
                        <div key={guide.slug} className="manual-guide-node">
                          <div 
                            className={`manual-guide-header ${isGuideExpanded ? "expanded" : ""}`}
                            onClick={() => toggleGuide(guideId)}
                          >
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {guide.title}
                            </span>
                            <ChevronRight 
                              size={10} 
                              className={`manual-category-arrow ${isGuideExpanded ? "rotated" : ""}`} 
                            />
                          </div>

                          {isGuideExpanded && (
                            <div className="manual-phases-list">
                              {guide.phases.map((phase) => {
                                const isActive = activePhase && activePhase.filePath === phase.filePath;
                                return (
                                  <div
                                    key={phase.slug}
                                    className={`manual-phase-item ${isActive ? "active" : ""}`}
                                    onClick={() => onSelectPhase({
                                      categorySlug: cat.slug,
                                      guideSlug: guide.slug,
                                      phaseSlug: phase.slug,
                                      filePath: phase.filePath,
                                      title: phase.title
                                    })}
                                    title={phase.title}
                                  >
                                    <span className="manual-phase-dot" />
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      {phase.title}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
