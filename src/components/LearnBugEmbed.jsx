import { useState } from "react";
import { ExternalLink, Monitor, RefreshCw, X } from "lucide-react";

const LEARNBUG_URL = "https://www.learnbug.in/";

export default function LearnBugEmbed({ onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [frameKey, setFrameKey] = useState(0);

  const reload = () => {
    setIsLoading(true);
    setFrameKey((current) => current + 1);
  };

  return (
    <section style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header style={{ minHeight: 64, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0 }}>
        <div style={{ width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: 10, background: "rgba(118,216,255,.12)", border: "1px solid rgba(118,216,255,.3)", color: "#76d8ff" }}>
          <Monitor size={18} />
        </div>
        <div>
          <h1 style={{ margin: 0, color: "var(--text)", font: "700 19px var(--font)", letterSpacing: "-.03em" }}>LearnBug</h1>
          <p style={{ margin: "2px 0 0", color: "var(--text3)", font: "10px var(--mono)" }}>Visual code debugger · embedded workspace</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <a href={LEARNBUG_URL} target="_blank" rel="noreferrer" title="Open LearnBug in a new tab" style={{ display: "grid", placeItems: "center", width: 34, height: 34, border: "1px solid var(--border)", borderRadius: 7, color: "var(--text2)", background: "var(--bg3)" }}>
            <ExternalLink size={16} />
          </a>
          <button onClick={reload} title="Reload LearnBug" style={{ display: "grid", placeItems: "center", width: 34, height: 34, cursor: "pointer", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text2)", background: "var(--bg3)" }}>
            <RefreshCw size={16} />
          </button>
          <button onClick={onClose} title="Close LearnBug" style={{ display: "grid", placeItems: "center", width: 34, height: 34, cursor: "pointer", border: "1px solid var(--border)", borderRadius: 7, color: "var(--text2)", background: "transparent" }}>
            <X size={18} />
          </button>
        </div>
      </header>
      <div style={{ position: "relative", flex: 1, minHeight: 0, background: "#0d1117" }}>
        {isLoading && (
          <div style={{ position: "absolute", inset: 0, zIndex: 1, display: "grid", placeItems: "center", color: "var(--text3)", font: "11px var(--mono)", background: "#0d1117" }}>
            Loading LearnBug…
          </div>
        )}
        <iframe
          key={frameKey}
          src={LEARNBUG_URL}
          title="LearnBug visual code debugger"
          onLoad={() => setIsLoading(false)}
          style={{ display: "block", width: "100%", height: "100%", border: 0 }}
        />
      </div>
    </section>
  );
}
