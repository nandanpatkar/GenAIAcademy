import { ArrowLeft, ArrowUpRight, BookOpen, ChevronRight } from "lucide-react";
import { imageFor } from "../data";

export default function TrackView({ track, onBack, onOpenModule }) {
  const art = imageFor(track.image);

  return (
    <div className="amc-view amc-page" key={track.id}>
      <button className="amc-back" onClick={onBack}>
        <ArrowLeft size={13} /> All study paths
      </button>

      <div className="amc-hero amc-track-hero" style={{ marginBottom: 26 }}>
        {art && (
          <div className="amc-track-art">
            <img src={art} alt="" />
          </div>
        )}
        <div className="amc-track-copy">
          <div className="amc-hero-kicker" style={{ color: track.color }}>Study path</div>
          <h2>{track.label}</h2>
          <p>{track.summary}</p>
          <div className="amc-stats">
            <div>
              <div className="amc-stat-n">{track.modules.length}</div>
              <div className="amc-stat-l">Modules</div>
            </div>
          </div>
          <a className="amc-cta" href={track.url} target="_blank" rel="noopener noreferrer"
             style={{ background: track.color, color: "#08111f" }}>
            <BookOpen size={15} /> Open this track on the site <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <div className="amc-section-head">
        <h3>Modules</h3>
        <span>open one to study locally, or jump to it on the site</span>
      </div>
      <div className="amc-modules">
        {track.modules.map((mod, i) => (
          <div key={mod.id} className="amc-module">
            <button className="amc-module-open" onClick={() => onOpenModule(mod.id)}>
              <span className="amc-module-n">{String(i + 1).padStart(2, "0")}</span>
              <span style={{ minWidth: 0 }}>
                <span className="amc-module-title" style={{ display: "block" }}>{mod.label}</span>
                {mod.tagline && <span className="amc-module-tag">{mod.tagline}</span>}
              </span>
              <span className="amc-module-go"><ChevronRight size={16} /></span>
            </button>
            <a className="amc-module-out" href={mod.url} target="_blank" rel="noopener noreferrer"
               title="Open on aimlcompanion.ai">
              <ArrowUpRight size={14} />
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}
