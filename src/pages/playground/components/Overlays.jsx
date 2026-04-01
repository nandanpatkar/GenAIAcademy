import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

// ─── Validation Panel ─────────────────────────────────────────────────────────
export function ValidationPanel({ issues, onClose }) {
  const errors   = issues.filter(i => i.type === "error");
  const warnings = issues.filter(i => i.type === "warning");
  const infos    = issues.filter(i => i.type === "info");

  const Row = ({ issue, i }) => {
    const cfg = {
      error:   { color: "#f87171", bg: "#f8717111", border: "#f8717133", Icon: AlertCircle },
      warning: { color: "#fbbf24", bg: "#fbbf2411", border: "#fbbf2433", Icon: AlertCircle },
      info:    { color: "var(--pg-accent)", bg: "var(--pg-accent)11", border: "var(--pg-accent)33", Icon: Info        },
    }[issue.type];
    return (
      <div style={{ display: "flex", gap: 8, padding: "7px 9px", background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 5, marginBottom: 5 }}>
        <cfg.Icon size={11} color={cfg.color} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 9.5, color: "var(--pg-text)", lineHeight: 1.5 }}>{issue.message}</div>
      </div>
    );
  };

  return (
    <div style={{ position: "absolute", bottom: 60, right: 16, width: 300, background: "var(--pg-sidebar)", border: "1px solid var(--pg-border)", borderRadius: 10, zIndex: 100, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", fontFamily: "'DM Mono',monospace", overflow: "hidden" }}>
      <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--pg-border2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--pg-text)" }}>Flow Validation</div>
          <div style={{ fontSize: 8.5, color: "var(--pg-text3)", marginTop: 1 }}>
            {errors.length} errors · {warnings.length} warnings · {infos.length} suggestions
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pg-text3)" }}><X size={12} /></button>
      </div>
      <div style={{ padding: "10px 12px", maxHeight: 260, overflowY: "auto" }}>
        {issues.length === 0
          ? <div style={{ textAlign: "center", padding: "16px 0", color: "var(--pg-text3)" }}>
              <CheckCircle size={20} color="#34d399" style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 10 }}>All clear — no issues found</div>
            </div>
          : <>
              {errors.map((i, idx)   => <Row key={idx} issue={i} />)}
              {warnings.map((i, idx) => <Row key={idx} issue={i} />)}
              {infos.map((i, idx)    => <Row key={idx} issue={i} />)}
            </>
        }
      </div>
    </div>
  );
}

// ─── Node Info Popover ────────────────────────────────────────────────────────
export function NodePopover({ node, position, onClose }) {
  if (!node) return null;
  const { data } = node;
  return (
    <div style={{ position: "fixed", top: position.y + 10, left: position.x + 10, zIndex: 9000, width: 260, background: "var(--pg-sidebar)", border: "1px solid var(--pg-border)", borderRadius: 9, padding: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", fontFamily: "'DM Mono',monospace", pointerEvents: "none" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--pg-text)", marginBottom: 6 }}>{data.label}</div>
      <div style={{ fontSize: 9.5, color: "var(--pg-text2)", lineHeight: 1.65, marginBottom: 8 }}>{data.info || data.sub}</div>
      {data.cost && <div style={{ fontSize: 8.5, color: "#34d399", background: "#34d3991a", border: "1px solid #34d39933", padding: "2px 6px", borderRadius: 3, display: "inline-block", marginBottom: 6 }}>💰 {data.cost}</div>}
      <div style={{ fontSize: 8, color: "var(--pg-text3)", borderTop: "1px solid var(--pg-border2)", paddingTop: 6, marginTop: 4 }}>Click to inspect · Right-click for actions</div>
    </div>
  );
}
