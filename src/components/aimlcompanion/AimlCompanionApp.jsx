import { useMemo, useState } from "react";
import { X, Search, PanelLeft, GraduationCap, Compass, Newspaper, ChevronRight, ArrowUpRight, ExternalLink } from "lucide-react";
import ExploreView from "./views/ExploreView";
import TrackView from "./views/TrackView";
import ModuleView from "./views/ModuleView";
import BlogView from "./views/BlogView";
import { TRACKS, POSTS, PAGES, TOTALS, BASE, trackById, moduleIn, searchCatalog, imageFor } from "./data";
import "../../styles/aimlcompanion.css";

function SearchResults({ results, onOpenTrack, onOpenModule }) {
  if (results.total === 0) {
    return <div className="amc-view amc-page"><div className="amc-empty">Nothing matches “{results.query}”.</div></div>;
  }
  return (
    <div className="amc-view amc-page">
      <div className="amc-section-head" style={{ marginTop: 0 }}>
        <h3>{results.total} results for “{results.query}”</h3>
      </div>

      {results.tracks.length > 0 && (
        <>
          <div className="amc-section-head"><h3>Study paths</h3><span>{results.tracks.length}</span></div>
          <div className="amc-grid">
            {results.tracks.map(track => (
              <button key={track.id} className="amc-card" onClick={() => onOpenTrack(track.id)}
                      style={{ "--amc-accent-soft": `${track.color}88` }}>
                <div className="amc-thumb">
                  {imageFor(track.image) && <img src={imageFor(track.image)} alt="" loading="lazy" />}
                  <span className="amc-thumb-rule" style={{ background: track.color }} />
                </div>
                <div className="amc-card-body">
                  <div className="amc-card-title">{track.label}</div>
                  <div className="amc-card-text">{track.summary}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {results.posts.length > 0 && (
        <>
          <div className="amc-section-head"><h3>Posts</h3><span>{results.posts.length}</span></div>
          <div className="amc-results">
            {results.posts.map(post => (
              <a key={post.slug} className="amc-module" href={post.url} target="_blank" rel="noopener noreferrer">
                <span className="amc-module-n">{post.date?.slice(0, 4)}</span>
                <span className="amc-module-title">{post.label}</span>
                <ArrowUpRight className="amc-module-go" size={15} />
              </a>
            ))}
          </div>
        </>
      )}

      {results.modules.length > 0 && (
        <>
          <div className="amc-section-head"><h3>Modules</h3><span>{results.modules.length}</span></div>
          <div className="amc-results">
            {results.modules.slice(0, 80).map(mod => (
              <button key={`${mod.track.id}/${mod.id}`} className="amc-module"
                      onClick={() => onOpenModule(mod.track.id, mod.id)}>
                <span className="amc-dot" style={{ background: mod.track.color }} />
                <span style={{ minWidth: 0 }}>
                  <span className="amc-module-title" style={{ display: "block" }}>{mod.label}</span>
                  <span className="amc-module-tag">{mod.track.label}{mod.tagline ? ` · ${mod.tagline}` : ""}</span>
                </span>
                <ChevronRight className="amc-module-go" size={16} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AimlCompanionApp({ onClose }) {
  const [view, setView] = useState({ kind: "explore" });
  const [search, setSearch] = useState("");
  const [showNav, setShowNav] = useState(true);

  const results = useMemo(() => searchCatalog(search), [search]);
  const track = view.trackId ? trackById(view.trackId) : null;
  const found = view.kind === "module" ? moduleIn(track, view.moduleId) : null;

  // Opening anything from the results list clears the query, so the destination is not
  // rendered underneath a stale search.
  const openExplore = () => { setSearch(""); setView({ kind: "explore" }); };
  const openTrack = (trackId) => { setSearch(""); setView({ kind: "track", trackId }); };
  const openModule = (trackId, moduleId) => { setSearch(""); setView({ kind: "module", trackId, moduleId }); };
  const openBlog = () => { setSearch(""); setView({ kind: "blog" }); };

  return (
    <div className="amc">
      <header className="amc-header">
        <button className="amc-icon-btn" data-on={String(showNav)} onClick={() => setShowNav(v => !v)} title="Toggle navigation">
          <PanelLeft size={16} />
        </button>
        <button className="amc-mark" onClick={openExplore} title="AI-ML Companion">
          <GraduationCap size={20} />
        </button>
        <div style={{ minWidth: 0 }}>
          <div className="amc-wordmark">AI-ML Companion</div>
          <div className="amc-tagline">{TOTALS.tracks} tracks · {TOTALS.modules} modules · {TOTALS.posts} posts</div>
        </div>

        <div style={{ flex: 1 }} />

        <label className="amc-search">
          <Search size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tracks and modules…"
          />
          {search && (
            <button className="amc-icon-btn" style={{ width: 20, height: 20 }} onClick={() => setSearch("")}>
              <X size={13} />
            </button>
          )}
        </label>

        <a className="amc-icon-btn" href={BASE} target="_blank" rel="noopener noreferrer" title="Open aimlcompanion.ai">
          <ExternalLink size={16} />
        </a>
        <button className="amc-icon-btn" onClick={onClose} title="Close"><X size={18} /></button>
      </header>

      <div className="amc-body">
        {showNav && (
          <nav className="amc-nav">
            <div className="amc-nav-scroll">
              <button className="amc-nav-item" data-active={String(view.kind === "explore" && !results)} onClick={openExplore}>
                <Compass size={15} /> Explore
              </button>

              <button className="amc-nav-item" data-active={String(view.kind === "blog" && !results)} onClick={openBlog}>
                <Newspaper size={15} /> Blog
                <span className="amc-nav-count">{POSTS.length}</span>
              </button>

              <div className="amc-nav-label">Study paths</div>
              {TRACKS.map(t => (
                <button key={t.id} className="amc-nav-item amc-nav-track"
                        data-active={String(track?.id === t.id && !results)}
                        onClick={() => openTrack(t.id)}>
                  <span className="amc-dot" style={{ background: t.color }} />
                  {t.label}
                  <span className="amc-nav-count">{t.modules.length}</span>
                </button>
              ))}

              <div className="amc-nav-label">On the site</div>
              {PAGES.map(page => (
                <a key={page.id} className="amc-nav-item amc-nav-track" href={page.url} target="_blank" rel="noopener noreferrer">
                  {page.label}
                  <ArrowUpRight className="amc-nav-count" size={12} />
                </a>
              ))}
            </div>
            <div className="amc-nav-foot">
              Lessons generated on this device · links open aimlcompanion.ai
            </div>
          </nav>
        )}

        <main className="amc-main">
          {results
            ? <SearchResults results={results} onOpenTrack={openTrack} onOpenModule={openModule} />
            : view.kind === "blog"
            ? <BlogView />
            : found && track
              ? <ModuleView track={track} module={found.module} index={found.index}
                            onBack={() => openTrack(track.id)} />
              : track
                ? <TrackView track={track} onBack={openExplore}
                             onOpenModule={(moduleId) => openModule(track.id, moduleId)} />
                : <ExploreView onOpenTrack={openTrack} onOpenBlog={openBlog} />}
        </main>
      </div>
    </div>
  );
}
