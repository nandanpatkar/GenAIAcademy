import React, { useState, useEffect } from "react";
import { RefreshCw, AlertTriangle, FileText } from "lucide-react";

export default function StudyGuideTab({ exam }) {
  const [toc, setToc] = useState(null); // null = loading
  const [errorMsg, setErrorMsg] = useState("");
  const [activePath, setActivePath] = useState(null);
  const [articleHtml, setArticleHtml] = useState(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setToc(null);
    setErrorMsg("");
    setActivePath(null);
    setArticleHtml(null);

    fetch(`/api/exam-studyguide?exam=${encodeURIComponent(exam.slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.toc || data.toc.length === 0) throw new Error("No study guide chapters found for this exam.");
        setToc(data.toc);
      })
      .catch((err) => { if (!cancelled) setErrorMsg(err.message || "Could not load the study guide."); });

    return () => { cancelled = true; };
  }, [exam.slug]);

  const selectTopic = async (path) => {
    setActivePath(path);
    setArticleLoading(true);
    setArticleError("");
    try {
      const res = await fetch(`/api/exam-studyguide-content?exam=${encodeURIComponent(exam.slug)}&path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setArticleHtml(data.html);
    } catch (err) {
      console.error("Study guide article fetch failed:", err);
      setArticleError(err.message || "Failed to load chapter content.");
      setArticleHtml(null);
    } finally {
      setArticleLoading(false);
    }
  };

  if (errorMsg) {
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "var(--danger-bg)", border: "1px solid var(--danger)", borderRadius: 12, padding: 16, color: "var(--text-primary)" }}>
        <AlertTriangle size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{errorMsg}</div>
      </div>
    );
  }

  if (!toc) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
        <RefreshCw size={24} className="spin" style={{ marginBottom: 8 }} />
        <div>Loading study guide…</div>
      </div>
    );
  }

  return (
    <div className="examhub-studyguide-layout">
      <div className="examhub-studyguide-toc">
        {toc.map((cat) => (
          <div key={cat.id}>
            <div className="examhub-sg-cat-title">{cat.title}</div>
            {cat.topics.map((topic) => (
              <div
                key={topic.path}
                className={`examhub-sg-topic-item ${activePath === topic.path ? "active" : ""}`}
                onClick={() => selectTopic(topic.path)}
              >
                {topic.name}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="examhub-studyguide-reader">
        {!activePath && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
            <FileText size={32} style={{ marginBottom: 12, opacity: 0.6 }} />
            <div>Select a chapter from the left to start reading.</div>
          </div>
        )}

        {activePath && articleLoading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
            <RefreshCw size={24} className="spin" style={{ marginBottom: 8 }} />
            <div>Fetching chapter details…</div>
          </div>
        )}

        {activePath && !articleLoading && articleError && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "var(--danger-bg)", border: "1px solid var(--danger)", borderRadius: 12, padding: 16, color: "var(--text-primary)" }}>
            <AlertTriangle size={20} color="var(--danger)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{articleError}</div>
          </div>
        )}

        {activePath && !articleLoading && !articleError && articleHtml && (
          <div className="examhub-article" dangerouslySetInnerHTML={{ __html: articleHtml }} />
        )}
      </div>
    </div>
  );
}
