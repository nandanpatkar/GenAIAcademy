import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, Maximize, Minimize } from "lucide-react";

export default function CodeFlowViewer({ initialUrl, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [url, setUrl] = useState(initialUrl || "");

  const codeflowUrl = url 
    ? `/codeflow/index.html?repo=${encodeURIComponent(url)}` 
    : `/codeflow/index.html`;

  return (
    <div className={`gh-codeflow-container ${isExpanded ? "expanded" : ""}`} style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "var(--bg0)",
      position: isExpanded ? "fixed" : "relative",
      top: isExpanded ? 0 : "auto",
      left: isExpanded ? 0 : "auto",
      right: isExpanded ? 0 : "auto",
      bottom: isExpanded ? 0 : "auto",
      zIndex: isExpanded ? 9999 : 1,
      width: isExpanded ? "100vw" : "100%",
      height: isExpanded ? "100vh" : "100%",
    }}>
      <div className="gh-file-header" style={{
        padding: "8px 12px",
        background: "var(--bg1)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <button 
          className="gh-icon-btn" 
          onClick={onClose} 
          title="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="gh-file-path" style={{ fontWeight: 600, color: "var(--acc)" }}>
          CodeFlow Architecture Viewer
        </span>
        <div style={{ flex: 1 }} />
        <button 
          className="gh-icon-btn" 
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        {isLoading && (
          <div className="gh-center-msg" style={{ position: "absolute", inset: 0, zIndex: 10, background: "var(--bg0)" }}>
            <Loader2 size={24} className="gh-spin" />
            <span style={{ marginTop: 12 }}>Loading CodeFlow...</span>
          </div>
        )}
        <iframe 
          src={codeflowUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
          onLoad={() => setIsLoading(false)}
          title="CodeFlow Viewer"
          allow="clipboard-write"
        />
      </div>
    </div>
  );
}
