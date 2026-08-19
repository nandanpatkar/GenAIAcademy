import { ArrowUpRight, BookOpen } from "lucide-react";
import { TRACKS, POSTS, TOTALS, BASE, imageFor } from "../data";

function TrackCard({ track, onOpen }) {
  const art = imageFor(track.image);
  return (
    <button className="amc-card" style={{ "--amc-accent-soft": `${track.color}88` }} onClick={() => onOpen(track.id)}>
      <div className="amc-thumb">
        {art && <img src={art} alt="" loading="lazy" />}
        <span className="amc-thumb-rule" style={{ background: `linear-gradient(90deg, ${track.color}, ${track.color}22)` }} />
      </div>
      <div className="amc-card-body">
        <div className="amc-card-title">{track.label}</div>
        <div className="amc-card-text">{track.summary}</div>
        <div className="amc-card-foot">
          <span className="amc-dot" style={{ background: track.color }} />
          {track.modules.length} modules
          {track.extras?.length ? ` · ${track.extras.length} paper stories` : ""}
        </div>
      </div>
    </button>
  );
}

export default function ExploreView({ onOpenTrack, onOpenBlog }) {
  const latest = POSTS.slice(0, 3);

  return (
    <div className="amc-view amc-page">
      <div className="amc-hero">
        <div className="amc-hero-kicker">aimlcompanion.ai</div>
        <h2>Every track, every module, one keystroke away.</h2>
        <p>
          The full course map, {TOTALS.tracks} tracks deep. Open a module to study it right here —
          lesson, flashcards and quiz are written by your own AI provider and cached on this device —
          or follow the link through to the same module on aimlcompanion.ai.
        </p>
        <div className="amc-stats">
          {[
            [TOTALS.tracks, "Tracks"],
            [TOTALS.modules, "Modules"],
            [TOTALS.posts, "Posts"],
          ].map(([n, label]) => (
            <div key={label}>
              <div className="amc-stat-n">{n}</div>
              <div className="amc-stat-l">{label}</div>
            </div>
          ))}
        </div>
        <a className="amc-cta" href={BASE} target="_blank" rel="noopener noreferrer">
          <BookOpen size={15} /> Open aimlcompanion.ai <ArrowUpRight size={14} />
        </a>
      </div>

      <div className="amc-section-head">
        <h3>Study paths</h3>
        <span>in the order the course teaches them</span>
      </div>
      <div className="amc-grid amc-stagger">
        {TRACKS.map(track => <TrackCard key={track.id} track={track} onOpen={onOpenTrack} />)}
      </div>

      <div className="amc-section-head">
        <h3>Latest writing</h3>
        <button className="amc-pill" onClick={onOpenBlog}>All {POSTS.length} posts</button>
      </div>
      <div className="amc-grid amc-stagger">
        {latest.map(post => {
          const art = imageFor(post.image);
          return (
            <a key={post.slug} className="amc-card" href={post.url} target="_blank" rel="noopener noreferrer">
              <div className="amc-thumb">{art && <img src={art} alt="" loading="lazy" />}</div>
              <div className="amc-card-body">
                <div className="amc-card-foot" style={{ marginTop: 0 }}>{post.date}</div>
                <div className="amc-card-title">{post.label}</div>
              </div>
            </a>
          );
        })}
      </div>

      <p className="amc-note">
        Track names, module titles and artwork come from aimlcompanion.ai's own published page
        metadata and og: images. Lessons here are written locally by your configured AI provider;
        the links open the real module on aimlcompanion.ai, where you read it with your account.
      </p>
    </div>
  );
}
