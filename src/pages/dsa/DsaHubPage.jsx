import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BookOpenCheck,
  Bookmark,
  Boxes,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  ExternalLink,
  Filter,
  GraduationCap,
  House,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Moon,
  PanelLeft,
  Search,
  Shuffle,
  SlidersHorizontal,
  Sun,
  Tag,
  UserCircle2,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import catalog from "../../data/codelab/catalog.json";
import DsaBrandMark from "./DsaBrandMark";
import DsaProblemWorkspace from "./DsaProblemWorkspace";
import DsaHomeLanding from "./DsaHomeLanding";
import DsaGlobalDashboard from "./DsaGlobalDashboard";
import "../../styles/DsaHub.css";

const PAGE_SIZE = 10;
const problems = catalog.problems || [];
const categories = catalog.categories || [];

const readArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const categoryOf = (problem) => problem.patterns?.[0]?.category || problem.topicTags?.[0] || "DSA";
const patternOf = (problem) => problem.patterns?.[0]?.pattern || "Core concepts";
const sourceLabel = (source) => ({ leetcode: "LeetCode", authored: "Code Lab", gfg: "GeeksforGeeks" }[source] || source || "Code Lab");

const FilterChip = ({ active, children, onClick }) => (
  <button type="button" className={`dsa-filter-chip${active ? " is-active" : ""}`} onClick={onClick} aria-pressed={active}>
    {children}
  </button>
);

export default function DsaHubPage({ onClose }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth() || {};
  // Prefer a real display name; fall back to the email local-part, then a generic label.
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name
    || (user?.email ? user.email.split("@")[0] : "") || "Your profile";
  const displayEmail = user?.email || "";
  const [section, setSection] = useState("home");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [query, setQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [patternFilter, setPatternFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [completed, setCompleted] = useState(() => readArray("leetcode_completed"));
  const [bookmarks, setBookmarks] = useState(() => readArray("dsa_dashboard_bookmarks"));
  const [expandedCategories, setExpandedCategories] = useState(false);
  const [expandedPatterns, setExpandedPatterns] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [highlightedSlug, setHighlightedSlug] = useState("");

  const completedSet = useMemo(() => new Set(completed), [completed]);
  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);
  const allPatterns = useMemo(() => [...new Set(categories.flatMap((category) => category.patterns.map((pattern) => pattern.title)))], []);
  const allSources = useMemo(() => [...new Set(problems.map((problem) => problem.source).filter(Boolean))], []);

  const filteredProblems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return problems.filter((problem) => {
      const haystack = [problem.title, categoryOf(problem), patternOf(problem), ...(problem.topicTags || [])]
        .join(" ")
        .toLowerCase();
      return (!normalizedQuery || haystack.includes(normalizedQuery))
        && (activeTab !== "saved" || bookmarkSet.has(problem.slug))
        && (categoryFilter === "all" || categoryOf(problem) === categoryFilter)
        && (patternFilter === "all" || patternOf(problem) === patternFilter)
        && (sourceFilter === "all" || problem.source === sourceFilter)
        && (difficultyFilter === "all" || problem.difficulty?.toLowerCase() === difficultyFilter);
    });
  }, [activeTab, bookmarkSet, categoryFilter, difficultyFilter, patternFilter, query, sourceFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / PAGE_SIZE));
  const visibleProblems = filteredProblems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const completedTotal = problems.filter((problem) => completedSet.has(problem.slug)).length;
  const progress = problems.length ? Math.round((completedTotal / problems.length) * 100) : 0;

  useEffect(() => setPage(1), [activeTab, categoryFilter, difficultyFilter, patternFilter, query, sourceFilter]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  useEffect(() => {
    const refresh = () => setCompleted(readArray("leetcode_completed"));
    window.addEventListener("leetcode-progress", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("leetcode-progress", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const toggleComplete = (slug) => {
    const next = completedSet.has(slug) ? completed.filter((item) => item !== slug) : [...completed, slug];
    setCompleted(next);
    localStorage.setItem("leetcode_completed", JSON.stringify(next));
    window.dispatchEvent(new Event("leetcode-progress"));
  };

  const toggleBookmark = (slug) => {
    const next = bookmarkSet.has(slug) ? bookmarks.filter((item) => item !== slug) : [...bookmarks, slug];
    setBookmarks(next);
    localStorage.setItem("dsa_dashboard_bookmarks", JSON.stringify(next));
  };

  const selectRandomQuestion = () => {
    if (!filteredProblems.length) return;
    const problem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];
    const nextPage = Math.floor(filteredProblems.indexOf(problem) / PAGE_SIZE) + 1;
    setPage(nextPage);
    setHighlightedSlug(problem.slug);
    window.setTimeout(() => document.getElementById(`dsa-row-${problem.slug}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    window.setTimeout(() => setHighlightedSlug(""), 1800);
  };

  const filteredCategoryNames = categories.map((category) => category.title)
    .filter((name) => !filterQuery || name.toLowerCase().includes(filterQuery.toLowerCase()));
  const filteredPatternNames = allPatterns
    .filter((name) => !filterQuery || name.toLowerCase().includes(filterQuery.toLowerCase()));
  const visibleCategoryNames = expandedCategories ? filteredCategoryNames : filteredCategoryNames.slice(0, 6);
  const visiblePatternNames = expandedPatterns ? filteredPatternNames : filteredPatternNames.slice(0, 6);

  const clearFilters = () => {
    setCategoryFilter("all");
    setPatternFilter("all");
    setSourceFilter("all");
    setDifficultyFilter("all");
    setFilterQuery("");
  };

  const navigateTo = (nextSection) => {
    setSection(nextSection);
    setSidebarOpen(false);
    if (nextSection === "problems" || nextSection === "sheet") setPage(1);
  };

  const openProblem = (slug) => setWorkspaceSlug(slug);

  if (workspaceSlug) {
    return <DsaProblemWorkspace initialSlug={workspaceSlug} onBack={() => setWorkspaceSlug("")} onClose={onClose} />;
  }

  if (section === "home") {
    return <DsaHomeLanding onNavigate={navigateTo} onClose={onClose} />;
  }

  const sectionLabel = ({ home: "Home", dashboard: "Dashboard", problems: "Problems", sheet: "Zero to Hero 450" })[section] || "Dashboard";
  const isQuestionView = section === "problems" || section === "sheet";

  return (
    <div className="dsa-shell">
      <a className="dsa-skip-link" href="#dsa-question-table">Skip to questions</a>
      {(sidebarOpen || filtersOpen) && <button type="button" className="dsa-dashboard-scrim" onClick={() => { setSidebarOpen(false); setFiltersOpen(false); }} aria-label="Close open panel" />}

      <aside className={`dsa-dashboard-rail${sidebarOpen ? " is-open" : ""}`} aria-label="DSA dashboard navigation">
        <div className="dsa-rail-brand">
          <DsaBrandMark />
          <strong>DSA</strong>
          <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={17} /></button>
        </div>

        <nav className="dsa-rail-nav">
          <button type="button" className="dsa-rail-item" onClick={() => navigateTo("home")}><House size={17} /><span>Home</span></button>
          <button type="button" className={`dsa-rail-item${section === "dashboard" ? " is-current" : ""}`} onClick={() => navigateTo("dashboard")}><LayoutDashboard size={17} /><span>Dashboard</span></button>
          <div className={`dsa-rail-group${isQuestionView ? " is-active" : ""}`}>
            <div className="dsa-rail-item"><BookOpenCheck size={17} /><span>Practice</span><ChevronDown size={15} /></div>
            <div className="dsa-rail-subnav">
              <button type="button" className={section === "problems" ? "is-active" : ""} onClick={() => navigateTo("problems")}>Problems</button>
              <button type="button" className={section === "sheet" ? "is-active" : ""} onClick={() => navigateTo("sheet")}>Zero to Hero 450</button>
              <button type="button" onClick={() => { setActiveTab("saved"); navigateTo("problems"); }}>Saved questions</button>
            </div>
          </div>
          <div className="dsa-rail-item is-disabled"><GraduationCap size={17} /><span>Learn</span><ChevronRight size={15} /></div>
        </nav>

        <div className="dsa-rail-footer">
          <button type="button" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button type="button"><UserCircle2 size={22} /><span><b>{displayName}</b><small>{displayEmail}</small></span><ChevronRight size={14} /></button>
        </div>
      </aside>

      <section className="dsa-dashboard-stage">
        <header className="dsa-dashboard-topbar">
          <div className="dsa-topbar-left">
            <button type="button" className="dsa-mobile-panel-button" onClick={() => setSidebarOpen(true)} aria-label="Open DSA navigation"><Menu size={18} /></button>
            <PanelLeft size={16} aria-hidden="true" />
            <span>Home</span><ChevronRight size={13} /><b>{sectionLabel}</b>
          </div>
          <div className="dsa-topbar-actions">
            <label className="dsa-global-search">
              <span className="sr-only">Search questions</span>
              <Search size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions" />
              <kbd>⌘ K</kbd>
            </label>
            <button type="button" className="dsa-icon-button" aria-label="Notifications"><Bell size={17} /><i /></button>
            <button type="button" className="dsa-mobile-panel-button" onClick={() => setFiltersOpen(true)} aria-label="Open filters"><Filter size={18} /></button>
            <button type="button" className="dsa-live-dashboard" onClick={() => navigateTo("dashboard")}><LayoutDashboard size={15} /> Live Dashboard</button>
            <button type="button" className="dsa-icon-button" onClick={onClose} aria-label="Close DSA dashboard"><X size={18} /></button>
          </div>
        </header>

        <div className={`dsa-dashboard-body${isQuestionView ? "" : " is-wide"}`}>
          {section === "dashboard" && <DsaGlobalDashboard onNavigate={navigateTo} onOpenProblem={openProblem} userName={displayName} />}
          {isQuestionView && <>
          <main className="dsa-dashboard-main">
            <div className="dsa-page-title">
              <span className="dsa-back-mark" aria-hidden="true"><ChevronLeft size={19} /></span>
              <div><span className="dsa-eyebrow">{section === "sheet" ? "INTERVIEW PREPARATION SHEET" : "PATTERN-WISE DSA"}</span><h1>{section === "sheet" ? "Zero to Hero 450" : "Problems"}</h1></div>
              <span className="dsa-question-total">{problems.length} questions</span>
            </div>

            <section className="dsa-description-card" aria-labelledby="dsa-description-title">
              <div><h2 id="dsa-description-title">Description</h2><p>{section === "sheet" ? "The Zero to Hero 450 practice experience, connected to every question currently available in Code Lab so statements, examples, notes, and test execution stay fully functional." : "A searchable problem bank covering core data structures, algorithms, and recurring interview patterns."}</p></div>
              <span>{section === "sheet" ? "Zero to Hero sheet" : "Code Lab ready"}</span>
            </section>

            <div className="dsa-question-tabs" role="tablist" aria-label="Question views">
              <button type="button" role="tab" aria-selected={activeTab === "all"} className={activeTab === "all" ? "is-active" : ""} onClick={() => setActiveTab("all")}>All Questions</button>
              <button type="button" role="tab" aria-selected={activeTab === "saved"} className={activeTab === "saved" ? "is-active" : ""} onClick={() => setActiveTab("saved")}>Saved Questions <span>{bookmarks.length}</span></button>
            </div>

            <section className="dsa-progress-card" aria-label={`${completedTotal} of ${problems.length} problems complete`}>
              <div><b>Total Progress</b><span>{completedTotal}/{problems.length} Problems</span></div>
              <div className="dsa-progress-track"><span style={{ width: `${progress}%` }} /></div>
            </section>

            <section className="dsa-table-card" id="dsa-question-table" tabIndex="-1" aria-label="DSA questions">
              <div className="dsa-table-scroll">
                <table>
                  <thead><tr><th>Done</th><th>Problem</th><th>Links</th><th>Acceptance</th><th>Difficulty</th><th>Bookmark</th></tr></thead>
                  <tbody>
                    {visibleProblems.map((problem) => {
                      const done = completedSet.has(problem.slug);
                      const saved = bookmarkSet.has(problem.slug);
                      return (
                        <tr id={`dsa-row-${problem.slug}`} className={highlightedSlug === problem.slug ? "is-highlighted" : ""} key={problem.slug}>
                          <td data-label="Done">
                            <label className="dsa-complete-check">
                              <input type="checkbox" checked={done} onChange={() => toggleComplete(problem.slug)} aria-label={`Mark ${problem.title} as ${done ? "incomplete" : "complete"}`} />
                              <span>{done && <Check size={12} />}</span>
                            </label>
                          </td>
                          <td data-label="Problem">
                            <div className="dsa-problem-cell">
                              {!problem.judgeAvailable && <LockKeyhole size={14} aria-label="External practice only" />}
                              <div><button type="button" className="dsa-problem-open" onClick={() => openProblem(problem.slug)}>{problem.title}</button><small>{categoryOf(problem)} · {patternOf(problem)}</small></div>
                            </div>
                          </td>
                          <td data-label="Links"><a className="dsa-problem-link" href={problem.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${problem.title} on ${sourceLabel(problem.source)}`}><Code2 size={15} /><ExternalLink size={11} /></a></td>
                          <td data-label="Acceptance">{problem.acceptanceRate || "—"}</td>
                          <td data-label="Difficulty"><span className={`dsa-difficulty ${problem.difficulty?.toLowerCase()}`}>{problem.difficulty || "Unknown"}</span></td>
                          <td data-label="Bookmark"><button type="button" className={`dsa-bookmark${saved ? " is-saved" : ""}`} onClick={() => toggleBookmark(problem.slug)} aria-label={`${saved ? "Remove" : "Save"} ${problem.title}`} aria-pressed={saved}><Bookmark size={16} fill={saved ? "currentColor" : "none"} /></button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!visibleProblems.length && <div className="dsa-empty-state"><Search size={22} /><strong>No questions found</strong><p>Try another search or clear the active filters.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>}
              </div>
            </section>

            <footer className="dsa-pagination">
              <span aria-live="polite">Showing {visibleProblems.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filteredProblems.length)} of {filteredProblems.length}</span>
              <div>
                <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}><ChevronLeft size={15} /> Previous</button>
                <span>{page} / {totalPages}</span>
                <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages}>Next <ChevronRight size={15} /></button>
              </div>
            </footer>
          </main>

          <aside className={`dsa-filter-panel${filtersOpen ? " is-open" : ""}`} aria-label="Question filters">
            <button type="button" className="dsa-random-button" onClick={selectRandomQuestion} disabled={!filteredProblems.length}><Shuffle size={16} /> Random Question</button>
            <div className="dsa-filter-card">
              <div className="dsa-filter-heading"><div><h2>Filters</h2><p>Filter by category, pattern, source, or difficulty.</p></div><button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><X size={17} /></button></div>
              <label className="dsa-filter-search"><span className="sr-only">Search available filters</span><Search size={15} /><input value={filterQuery} onChange={(event) => setFilterQuery(event.target.value)} placeholder="Search filters" /></label>

              <div className="dsa-filter-section">
                <h3><span><Tag size={14} /></span>Categories</h3>
                <div className="dsa-filter-chips">
                  <FilterChip active={categoryFilter === "all"} onClick={() => setCategoryFilter("all")}>All</FilterChip>
                  {visibleCategoryNames.map((name) => <FilterChip key={name} active={categoryFilter === name} onClick={() => setCategoryFilter(categoryFilter === name ? "all" : name)}>{name}</FilterChip>)}
                  {filteredCategoryNames.length > 6 && <button type="button" className="dsa-more-chip" onClick={() => setExpandedCategories((value) => !value)}>{expandedCategories ? "Show less" : `+${filteredCategoryNames.length - 6} more`}</button>}
                </div>
              </div>

              <div className="dsa-filter-section">
                <h3><span><Boxes size={14} /></span>Patterns</h3>
                <div className="dsa-filter-chips">
                  <FilterChip active={patternFilter === "all"} onClick={() => setPatternFilter("all")}>All</FilterChip>
                  {visiblePatternNames.map((name) => <FilterChip key={name} active={patternFilter === name} onClick={() => setPatternFilter(patternFilter === name ? "all" : name)}>{name}</FilterChip>)}
                  {filteredPatternNames.length > 6 && <button type="button" className="dsa-more-chip" onClick={() => setExpandedPatterns((value) => !value)}>{expandedPatterns ? "Show less" : `+${filteredPatternNames.length - 6} more`}</button>}
                </div>
              </div>

              <div className="dsa-filter-section">
                <h3><span><SlidersHorizontal size={14} /></span>Source</h3>
                <div className="dsa-filter-chips"><FilterChip active={sourceFilter === "all"} onClick={() => setSourceFilter("all")}>All</FilterChip>{allSources.map((source) => <FilterChip key={source} active={sourceFilter === source} onClick={() => setSourceFilter(sourceFilter === source ? "all" : source)}>{sourceLabel(source)}</FilterChip>)}</div>
              </div>

              <div className="dsa-filter-section">
                <h3><span><Filter size={14} /></span>Difficulty</h3>
                <div className="dsa-filter-chips">{["all", "easy", "medium", "hard"].map((value) => <FilterChip key={value} active={difficultyFilter === value} onClick={() => setDifficultyFilter(value)}>{value === "all" ? "All" : value[0].toUpperCase() + value.slice(1)}</FilterChip>)}</div>
              </div>

              <button type="button" className="dsa-clear-filters" onClick={clearFilters}>Clear all filters</button>
            </div>
          </aside>
          </>}
        </div>
      </section>
    </div>
  );
}
