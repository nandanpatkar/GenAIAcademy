import { useState } from "react";
import { Play } from "lucide-react";

const FILE_ICONS = { pdf: "📄", doc: "📝", docx: "📝", ipynb: "📓", pptx: "📊", default: "📁" };

export default function ResourcePanel({ module, pathColor, onClose, onEditModule, isEditMode }) {
  const [tab, setTab] = useState("videos");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(""); // ← NEW: S3 progress state
  const tabs = ["videos", "files", "links"];

  const extractYTId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? match[1] : null;
  };

  const getSafeUrl = (url) => {
    if (!url) return "#";
    if (/^https?:\/\//i.test(url) || url.startsWith('/')) return url;
    return `https://${url}`;
  };

  const handleAddVideo = () => {
    if (!urlInput) return;
    const newVideo = { title: "YouTube Video", url: urlInput, channel: "External", duration: "--:--", views: "0" };
    onEditModule({ ...module, videos: [...(module.videos || []), newVideo] });
    setUrlInput("");
  };

  const handleAddLink = () => {
    if (!urlInput) return;
    const newLink = { title: urlInput, url: urlInput };
    onEditModule({ ...module, links: [...(module.links || []), newLink] });
    setUrlInput("");
  };

  // ← NEW: Full S3 upload with progress + proper error handling
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress("Uploading to S3...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-file-name": encodeURIComponent(file.name),
          "content-type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      const ext = file.name.split('.').pop()?.toLowerCase();
      const newFile = {
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        type: ext,
        url: data.url, // S3 public URL
      };
      onEditModule({ ...module, files: [...(module.files || []), newFile] });
      setUploadProgress("Uploaded!");
      setTimeout(() => setUploadProgress(""), 2500);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadProgress("");
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  return (
    <div className="resource-panel">
      {/* Header */}
      <div className="rp-header">
        <div className="rp-title-row">
          <div>
            <div style={{ fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)", letterSpacing: ".5px", marginBottom: 2 }}>
              RESOURCE NODE
            </div>
            <div className="rp-title">{module.title}</div>
          </div>
          <button className="rp-close" onClick={onClose}>✕</button>
        </div>
        <div className="rp-sub">{module.subtitle}</div>
        {/* OLD DESIGN: emoji tabs */}
        <div className="rp-tabs">
          {tabs.map((t) => (
            <button
              key={t}
              className={`rp-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
              style={tab === t ? { borderColor: pathColor, color: pathColor } : {}}
            >
              {t === "videos" ? "🎬 VIDEOS" : t === "files" ? "📁 FILES" : "🔗 LINKS"}
            </button>
          ))}
        </div>
      </div>

      <div className="rp-body">

        {/* VIDEOS — OLD DESIGN */}
        {tab === "videos" && (
          <>
            {module.videos?.length ? module.videos.map((v, i) => (
              <div key={i} className="vid-card" onClick={() => v.url && window.open(getSafeUrl(v.url), '_blank')}>
                <div className="vid-thumb">
                  {v.url && extractYTId(v.url) ? (
                    <>
                      <img src={`https://img.youtube.com/vi/${extractYTId(v.url)}/maxresdefault.jpg`} alt="thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div className="vid-play" style={{ position: "absolute", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Play size={16} fill="currentColor" strokeWidth={0} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="vid-thumb-bg" style={{ color: pathColor }} />
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${pathColor}15 0%, transparent 60%)` }} />
                      <div className="vid-play" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Play size={16} fill="currentColor" strokeWidth={0} />
                      </div>
                    </>
                  )}
                </div>
                <div className="vid-info">
                  <div className="vid-title">{v.title}</div>
                  <div className="vid-meta">
                    <span>{v.channel}</span>
                    <span className="dot">·</span>
                    <span>{v.duration}</span>
                    {v.views !== "0" && (
                      <>
                        <span className="dot">·</span>
                        <span>{v.views} views</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: "center", color: "var(--text3)", fontSize: 11, padding: "24px 0" }}>No videos added yet</div>
            )}

            {isEditMode && (
              <div className="rp-add-row">
                <input
                  className="rp-input"
                  placeholder="Paste YouTube URL..."
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddVideo()}
                />
                <button className="rp-add-btn" onClick={handleAddVideo}>+ Add</button>
              </div>
            )}
          </>
        )}

        {/* FILES — OLD DESIGN + NEW S3 upload */}
        {tab === "files" && (
          <>
            {module.files?.length ? module.files.map((f, i) => (
              <div key={i} className="file-card" onClick={() => f.url && window.open(getSafeUrl(f.url), '_blank')}>
                <div className="file-icon">{FILE_ICONS[f.type] || FILE_ICONS.default}</div>
                <div className="file-info">
                  <div className="file-name">{f.name}</div>
                  <div className="file-size">{f.size}</div>
                </div>
                <div className="file-dl">↓</div>
              </div>
            )) : (
              <div style={{ textAlign: "center", color: "var(--text3)", fontSize: 11, padding: "24px 0" }}>No files attached</div>
            )}

            {isEditMode && (
              <label
                style={{
                  display: "block", border: "1.5px dashed var(--border2)", borderRadius: 9,
                  padding: "16px", textAlign: "center", color: "var(--text3)",
                  fontSize: 11, cursor: uploading ? "not-allowed" : "pointer",
                  marginTop: 8, transition: "all .15s",
                }}
                onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = pathColor; e.currentTarget.style.color = pathColor; } }}
                onMouseLeave={(e) => { if (!uploading) { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text3)"; } }}
              >
                {/* ← NEW: S3 progress messages replace old generic text */}
                {uploadProgress || (uploading ? "Uploading..." : "+ Attach file (PDF, DOC, PNG...)")}
                <input type="file" style={{ display: "none" }} onChange={handleFileUpload} disabled={uploading} />
              </label>
            )}
          </>
        )}

        {/* LINKS — OLD DESIGN */}
        {tab === "links" && (
          <>
            {module.links?.length ? module.links.map((l, i) => (
              <div key={i} className="link-card" onClick={() => l.url && window.open(getSafeUrl(l.url), '_blank')}>
                <div className="link-favicon">🔗</div>
                <div className="link-info">
                  <div className="link-title">{l.title}</div>
                  <div className="link-url">{l.url}</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>↗</div>
              </div>
            )) : (
              <div style={{ textAlign: "center", color: "var(--text3)", fontSize: 11, padding: "24px 0" }}>No links added</div>
            )}

            {isEditMode && (
              <div className="rp-add-row">
                <input
                  className="rp-input"
                  placeholder="Paste a URL..."
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddLink()}
                />
                <button className="rp-add-btn" onClick={handleAddLink}>+ Add</button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}