import { useState, useRef, useCallback } from "react";
import { Pin, PinOff, GripVertical, Star, GitFork, ExternalLink, Trash2, Copy, Search, X, FolderOpen, Eye, Tag, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { formatCount, timeAgo, LANG_COLORS } from "../../services/githubService";

const CATEGORIES = [
  { value: "", label: "No Category", color: "#666" },
  { value: "rag", label: "RAG", color: "#06b6d4" },
  { value: "agents", label: "Agents", color: "#8b5cf6" },
  { value: "fine-tuning", label: "Fine-tuning", color: "#f97316" },
  { value: "llm", label: "LLM", color: "#eab308" },
  { value: "mlops", label: "MLOps", color: "#10b981" },
  { value: "tools", label: "Tools", color: "#3b82f6" },
  { value: "data", label: "Data", color: "#ef4444" },
  { value: "other", label: "Other", color: "#6b7280" },
];

const STATUS_OPTIONS = [
  { value: "to_study", label: "📋 To Study", color: "#6b7280" },
  { value: "studying", label: "📖 Studying", color: "#eab308" },
  { value: "completed", label: "✅ Completed", color: "#10b981" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function RepoManager({ repos, onUpdateRepos, onSelectRepo, onExploreRepo }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dragIdx, setDragIdx] = useState(null);
  const [dropIdx, setDropIdx] = useState(null);

  const pinned = repos.filter(r => r.pinned);
  const unpinned = repos.filter(r => !r.pinned);

  const togglePin = (id) => {
    onUpdateRepos(repos.map(r => r.id === id ? { ...r, pinned: !r.pinned } : r));
  };

  const setCategory = (id, cat) => {
    onUpdateRepos(repos.map(r => r.id === id ? { ...r, category: cat } : r));
  };

  const setStatus = (id, status) => {
    onUpdateRepos(repos.map(r => r.id === id ? { ...r, studyStatus: status } : r));
  };

  const deleteRepo = (id) => {
    if (window.confirm("Remove this repository?")) onUpdateRepos(repos.filter(r => r.id !== id));
  };

  const handleDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e, idx) => { e.preventDefault(); setDropIdx(idx); };
  const handleDragEnd = () => {
    if (dragIdx !== null && dropIdx !== null && dragIdx !== dropIdx) {
      const items = [...repos];
      const [moved] = items.splice(dragIdx, 1);
      items.splice(dropIdx, 0, moved);
      onUpdateRepos(items.map((r, i) => ({ ...r, order: i })));
    }
    setDragIdx(null); setDropIdx(null);
  };

  const q = search.toLowerCase();
  const filterList = (list) => list.filter(r => {
    if (q && !(r.label || "").toLowerCase().includes(q) && !(r.url || "").toLowerCase().includes(q) && !(r.description || "").toLowerCase().includes(q)) return false;
    if (filterCat && r.category !== filterCat) return false;
    if (filterStatus && r.studyStatus !== filterStatus) return false;
    return true;
  });

  const RepoCard = ({ repo, idx }) => {
    const [showCatMenu, setShowCatMenu] = useState(false);
    const cat = CATEGORIES.find(c => c.value === repo.category) || CATEGORIES[0];
    const status = STATUS_OPTIONS.find(s => s.value === repo.studyStatus) || STATUS_OPTIONS[0];
    const langColor = LANG_COLORS[repo.language] || "#666";
    const isDragging = dragIdx === idx;
    const isDropTarget = dropIdx === idx;

    return (
      <motion.div 
        layout
        variants={cardVariants}
        className={`gh-repo-card ${isDragging ? "dragging" : ""} ${isDropTarget ? "drop-target" : ""}`}
        draggable onDragStart={e => handleDragStart(e, idx)} onDragOver={e => handleDragOver(e, idx)} onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
      >
        <div className="gh-repo-drag"><GripVertical size={14} /></div>
        <div className="gh-repo-body">
          <div className="gh-repo-top">
            <span className="gh-repo-name" title={repo.label}>{repo.label}</span>
            <div className="gh-repo-actions">
              <button className="gh-icon-btn" onClick={() => togglePin(repo.id)} title={repo.pinned ? "Unpin" : "Pin"}>
                {repo.pinned ? <PinOff size={13} /> : <Pin size={13} />}
              </button>
              <button className="gh-icon-btn" onClick={() => onExploreRepo(repo.url)} title="Explore files"><FolderOpen size={13} /></button>
              <button className="gh-icon-btn" onClick={() => onSelectRepo(repo.url)} title="View README"><Eye size={13} /></button>
              <a href={repo.url} target="_blank" rel="noopener noreferrer" className="gh-icon-btn" title="Open on GitHub"><ExternalLink size={13} /></a>
              <button className="gh-icon-btn" onClick={() => navigator.clipboard.writeText(`git clone ${repo.url}.git`)} title="Copy clone"><Copy size={13} /></button>
              <button className="gh-icon-btn danger" onClick={() => deleteRepo(repo.id)} title="Remove"><Trash2 size={13} /></button>
            </div>
          </div>
          {repo.description && <div className="gh-repo-desc">{repo.description}</div>}
          <div className="gh-repo-meta">
            {repo.language && <span className="gh-lang-badge"><span className="gh-lang-dot" style={{ background: langColor }} />{repo.language}</span>}
            {repo.stars > 0 && <span className="gh-stat"><Star size={11} /> {formatCount(repo.stars)}</span>}
            {repo.forks > 0 && <span className="gh-stat"><GitFork size={11} /> {formatCount(repo.forks)}</span>}
          </div>
          <div className="gh-repo-bottom">
            {/* Category */}
            <div className="gh-cat-wrapper">
              <button className="gh-cat-btn" style={{ "--cat-color": cat.color }} onClick={() => setShowCatMenu(v => !v)}>
                <Tag size={10} /> {cat.label} <ChevronDown size={10} />
              </button>
              <AnimatePresence>
                {showCatMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="gh-dropdown"
                  >
                    {CATEGORIES.map(c => (
                      <button key={c.value} className="gh-dropdown-item" onClick={() => { setCategory(repo.id, c.value); setShowCatMenu(false); }}>
                        <span className="gh-cat-dot" style={{ background: c.color }} /> {c.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Status */}
            <select className="gh-status-select" value={repo.studyStatus || "to_study"} onChange={e => setStatus(repo.id, e.target.value)} style={{ color: status.color }}>
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="gh-repo-manager">
      {/* Search + Filters */}
      <div className="gh-rm-controls">
        <div className="gh-rm-search">
          <Search size={14} style={{ color: "var(--text3)" }} />
          <input placeholder="Search repos…" value={search} onChange={e => setSearch(e.target.value)} className="gh-rm-search-input" />
          {search && <button onClick={() => setSearch("")} className="gh-clear-btn"><X size={12} /></button>}
        </div>
        <select className="gh-select small" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select className="gh-select small" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="gh-rm-list">
        <AnimatePresence>
          {/* Pinned section */}
          {filterList(pinned).length > 0 && (
            <motion.div 
              layout 
              key="pinned-section"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="gh-rm-section-label"><Pin size={12} /> Pinned</div>
              {filterList(pinned).map((r, i) => <RepoCard key={r.id} repo={r} idx={repos.indexOf(r)} />)}
            </motion.div>
          )}

          {/* Unpinned section */}
          {filterList(unpinned).length > 0 && (
            <motion.div 
              layout 
              key="unpinned-section"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filterList(pinned).length > 0 && <div className="gh-rm-section-label">All Repos</div>}
              {filterList(unpinned).map((r, i) => <RepoCard key={r.id} repo={r} idx={repos.indexOf(r)} />)}
            </motion.div>
          )}

          {filterList(repos).length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="gh-center-msg" 
              style={{ paddingTop: 60 }}
              key="empty-state"
            >
              <Star size={36} style={{ opacity: 0.15 }} />
              <span>{repos.length === 0 ? "No repos saved yet" : "No repos match your filters"}</span>
              <span style={{ fontSize: 11, opacity: 0.5 }}>Save repos from the Trending tab or add them manually</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

