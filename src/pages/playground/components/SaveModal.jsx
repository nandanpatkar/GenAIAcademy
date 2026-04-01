import { useState } from "react";
import { X, Save } from "lucide-react";

const TAG_OPTIONS = ["rag", "agent", "multi-agent", "aws", "azure", "databricks", "mcp", "prototype", "production"];
const TAG_COLORS  = { rag:"#22d3ee", agent:"#818cf8", "multi-agent":"#a78bfa", aws:"#fb923c", azure:"#60a5fa", databricks:"#fc8181", mcp:"#c084fc", prototype:"#fbbf24", production:"#34d399" };

export default function SaveModal({ initialName = "", initialDesc = "", initialTags = [], onSave, onClose }) {
  const [name, setName]     = useState(initialName);
  const [desc, setDesc]     = useState(initialDesc);
  const [tags, setTags]     = useState(initialTags);

  const toggleTag = (t) => setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const inputStyle = {
    width: "100%", background: "var(--pg-panel)", border: "1px solid var(--pg-border)", borderRadius: 6,
    color: "var(--pg-text)", fontSize: 11, padding: "7px 9px", fontFamily: "'DM Mono',monospace", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9995, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 400, background: "var(--pg-sidebar)", border: "1px solid var(--pg-border)", borderRadius: 10, fontFamily: "'DM Mono',monospace", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
        <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--pg-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--pg-text)" }}>Save Flow</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pg-text3)" }}><X size={14} /></button>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 8.5, color: "var(--pg-text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Flow Name *</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Production RAG Pipeline" style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--pg-accent)"} onBlur={e => e.target.style.borderColor = "var(--pg-border)"} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 8.5, color: "var(--pg-text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Description</div>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="What does this architecture do?"
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={e => e.target.style.borderColor = "var(--pg-accent)"} onBlur={e => e.target.style.borderColor = "var(--pg-border)"} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 8.5, color: "var(--pg-text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Tags</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {TAG_OPTIONS.map(t => (
                <button key={t} onClick={() => toggleTag(t)}
                  style={{ background: tags.includes(t) ? (TAG_COLORS[t] + "22") : "transparent", border: `1px solid ${tags.includes(t) ? TAG_COLORS[t] : "var(--pg-border)"}`, borderRadius: 4, color: tags.includes(t) ? TAG_COLORS[t] : "var(--pg-text3)", fontSize: 9, padding: "3px 8px", cursor: "pointer", fontFamily: "'DM Mono',monospace", transition: "all 0.12s" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose}
              style={{ flex: 1, background: "transparent", border: "1px solid var(--pg-border)", borderRadius: 6, color: "var(--pg-text2)", fontSize: 10, padding: "8px", cursor: "pointer", fontFamily: "'DM Mono',monospace" }}>
              Cancel
            </button>
            <button onClick={() => name.trim() && onSave(name.trim(), desc.trim(), tags)} disabled={!name.trim()}
              style={{ flex: 2, background: name.trim() ? "var(--pg-accent)" : "var(--pg-border)", border: "none", borderRadius: 6, color: name.trim() ? "#fff" : "var(--pg-text3)", fontSize: 10, fontWeight: 700, padding: "8px", cursor: name.trim() ? "pointer" : "not-allowed", fontFamily: "'DM Mono',monospace", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <Save size={11} /> Save Flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
