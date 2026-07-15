import React, { useState, useEffect } from "react";
import { RefreshCw, AlertTriangle, Play } from "lucide-react";
import { safeFetchJson } from "./apiHelpers";

export default function VideosTab({ exam }) {
  const [videos, setVideos] = useState(null); // null = loading
  const [errorMsg, setErrorMsg] = useState("");
  const [playingId, setPlayingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setVideos(null);
    setErrorMsg("");
    setPlayingId(null);

    safeFetchJson(`/api/exam?resource=videos&exam=${encodeURIComponent(exam.slug)}`)
      .then((data) => { if (!cancelled) setVideos(data.videos || []); })
      .catch((err) => { if (!cancelled) setErrorMsg(err.message || "Could not load videos."); });

    return () => { cancelled = true; };
  }, [exam.slug]);

  if (errorMsg) {
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "var(--danger-bg)", border: "1px solid var(--danger)", borderRadius: 12, padding: 16, color: "var(--text-primary)" }}>
        <AlertTriangle size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{errorMsg}</div>
      </div>
    );
  }

  if (!videos) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
        <RefreshCw size={24} className="spin" style={{ marginBottom: 8 }} />
        <div>Loading videos…</div>
      </div>
    );
  }

  if (videos.length === 0) {
    return <p style={{ textAlign: "center", color: "var(--text-muted)" }}>No video resources found for this exam.</p>;
  }

  return (
    <div className="examhub-videos-layout">
      {playingId && (
        <div className="examhub-video-player-container">
          <iframe
            src={`https://www.youtube.com/embed/${playingId}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title="Exam video"
          />
        </div>
      )}

      <div className="examhub-videos-grid">
        {videos.map((vid) => (
          <div key={vid.youtubeVideoId} className="examhub-video-card" onClick={() => setPlayingId(vid.youtubeVideoId)}>
            <div className="examhub-video-thumbnail-box">
              <img
                className="examhub-video-thumb"
                src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeVideoId}/hqdefault.jpg`}
                alt={vid.title}
              />
              <div className="examhub-video-play-overlay">
                <Play size={40} fill="#fff" color="#fff" />
              </div>
            </div>
            <div className="examhub-video-info">
              <div className="examhub-video-title">{vid.title}</div>
              {vid.description && <div className="examhub-video-desc">{vid.description}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
