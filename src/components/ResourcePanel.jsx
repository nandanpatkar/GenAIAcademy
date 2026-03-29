import { useState } from "react";
import { Play } from "lucide-react";

const FILE_ICONS = { pdf: "📄", doc: "📝", docx: "📝", ipynb: "📓", pptx: "📊", default: "📁" };

export default function ResourcePanel({ module, pathColor, onClose, onEditModule, isEditMode }) {
  const [tab, setTab] = useState("videos");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
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
        url: data.url, // This is now the S3 public URL
      };
      onEditModule({ ...module, files: [...(module.files || []), newFile] });
      setUploadProgress("✅ Uploaded successfully!");
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
        <div className="rp-tabs">
          {tabs.map((t) => (
            <button
              key={t}
              className={`rp-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
              style={tab === t ? { borderBottomColor: pathColor, color: pathColor } : {}}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <span className="rp-tab-count">
                {tab === "videos" ? (module.videos?.length || 0)
                  : tab === "files" ? (module.files?.length || 0)
                  : (module.links?.length || 0)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="rp-body">
        {tab === "videos" && (
          <div className="rp-list">
            {(module.videos || []).length === 0 && (
              <div style={{ color: "var(--text3)", fontStyle: "italic", fontSize: 13 }}>No videos available.</div>
            )}
            {(module.videos || []).map((v, i) => {
              const ytId = extractYTId(v.url);
              return (
                <a key={i} href={getSafeUrl(v.url)} target="_blank" rel="noopener noreferrer" className="rp-video-card">
                  <div className="rp-thumb">
                    {ytId
                      ? <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt={v.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <Play size={20} color={pathColor} />
                    }
                    <div className="rp-play-overlay"><Play size={16} color="#fff" /></div>
                  </div>
                  <div className="rp-video-info">
                    <div className="rp-video-title">{v.title}</div>
                    <div className="rp-video-meta">{v.channel} · {v.duration}</div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {tab === "files" && (
          <div className="rp-list">
            {(module.files || []).length === 0 && (
              <div style={{ color: "var(--text3)", fontStyle: "italic", fontSize: 13 }}>No files available.</div>
            )}
            {(module.files || []).map((f, i) => (
              <a key={i} href={getSafeUrl(f.url)} target="_blank" rel="noopener noreferrer" className="rp-file-card">
                <span className="rp-file-icon">{FILE_ICONS[f.type] || FILE_ICONS.default}</span>
                <div className="rp-file-info">
                  <div className="rp-file-name">{f.name}</div>
                  <div className="rp-file-meta">{f.type?.toUpperCase()} · {f.size}</div>
                </div>
                <span className="rp-file-dl">↓</span>
              </a>
            ))}
          </div>
        )}

        {tab === "links" && (
          <div className="rp-list">
            {(module.links || []).length === 0 && (
              <div style={{ color: "var(--text3)", fontStyle: "italic", fontSize: 13 }}>No links available.</div>
            )}
            {(module.links || []).map((l, i) => (
              <a key={i} href={getSafeUrl(l.url)} target="_blank" rel="noopener noreferrer" className="rp-link-card">
                <span style={{ fontSize: 16 }}>🔗</span>
                <span className="rp-link-title">{l.title || l.url}</span>
              </a>
            ))}
          </div>
        )}

        {/* Upload controls for edit mode */}
        {isEditMode && (
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px dashed var(--border)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", marginBottom: 12, textTransform: "uppercase" }}>
              Attach Resources
            </div>
            {tab === "videos" && (
              <div className="rp-add-row">
                <input className="rp-input" placeholder="Paste YouTube URL..." value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddVideo()} />
                <button className="rp-add-btn" onClick={handleAddVideo} style={{ background: pathColor, color: "#000" }}>+ Add</button>
              </div>
            )}
            {tab === "links" && (
              <div className="rp-add-row">
                <input className="rp-input" placeholder="Paste External URL..." value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddLink()} />
                <button className="rp-add-btn" onClick={handleAddLink} style={{ background: pathColor, color: "#000" }}>+ Add</button>
              </div>
            )}
            {tab === "files" && (
              <label
                style={{
                  display: "block",
                  border: "1.5px dashed var(--border2)",
                  borderRadius: 9,
                  padding: "16px",
                  textAlign: "center",
                  color: uploading ? pathColor : "var(--text3)",
                  fontSize: 12,
                  cursor: uploading ? "not-allowed" : "pointer",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => { if (!uploading) { e.currentTarget.style.borderColor = pathColor; e.currentTarget.style.color = pathColor; } }}
                onMouseLeave={(e) => { if (!uploading) { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text3)"; } }}
              >
                {uploadProgress || (uploading ? "Uploading..." : "+ Upload File to S3 (.pdf, .png, .ipynb, .docx...)")}
                <input type="file" style={{ display: "none" }} onChange={handleFileUpload} disabled={uploading} />
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
