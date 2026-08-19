import { POSTS, imageFor } from "../data";

export default function BlogView() {
  return (
    <div className="amc-view amc-page">
      <div className="amc-hero">
        <div className="amc-hero-kicker">Writing</div>
        <h2>Notes from the AI-ML Companion blog</h2>
        <p>{POSTS.length} posts, newest first. Each one opens on aimlcompanion.ai.</p>
      </div>

      <div className="amc-grid amc-stagger">
        {POSTS.map(post => {
          const art = imageFor(post.image);
          return (
            <a key={post.slug} className="amc-card" href={post.url} target="_blank" rel="noopener noreferrer">
              <div className="amc-thumb">{art && <img src={art} alt="" loading="lazy" />}</div>
              <div className="amc-card-body">
                <div className="amc-card-foot" style={{ marginTop: 0 }}>{post.date}</div>
                <div className="amc-card-title">{post.label}</div>
                <div className="amc-card-text">
                  {post.summary.length > 190 ? `${post.summary.slice(0, 190)}…` : post.summary}
                </div>
                {post.tags.length > 0 && (
                  <div className="amc-card-foot" style={{ flexWrap: "wrap", gap: 6 }}>
                    {post.tags.map(tag => <span key={tag} className="amc-pill">{tag}</span>)}
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
