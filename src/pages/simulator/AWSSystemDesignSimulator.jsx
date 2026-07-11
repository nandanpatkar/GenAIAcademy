import React from "react";
import { Activity, X, PanelLeft } from "lucide-react";

export default function AWSSystemDesignSimulator({ onClose, isSidebarCollapsed, setIsSidebarCollapsed }) {
  // Theme colors matching the main app
  const BG = "#0a0c10";
  const BG2 = "#12151c";
  const BG3 = "#1a1e2a";
  const BORDER = "#252a38";
  const TEXT = "#e2e8f0";
  const TEXT3 = "#3e4556";

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", overflow: "hidden", background: BG, fontFamily: "var(--font)" }}>
      {/* ══ TOP BAR ══════════════════════════════════════════════════════════════ */}
      <div style={{ height: 62, background: BG2, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 14, flexShrink: 0 }}>
        {/* Sidebar toggle */}
        {setIsSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(p => !p)}
            title="Toggle Sidebar"
            style={{
              background: !isSidebarCollapsed ? BG3 : "transparent",
              border: `1px solid ${!isSidebarCollapsed ? BORDER : "transparent"}`,
              color: !isSidebarCollapsed ? TEXT : TEXT3,
              cursor: "pointer", borderRadius: 7, width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all .15s",
            }}
          >
            <PanelLeft size={15} />
          </button>
        )}

        {/* Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg,#818cf8,#6366f1)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 18px rgba(99,102,241,0.35)" }}>
            <Activity size={19} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.5px", lineHeight: 1.1 }}>AWS System Design Simulator</div>
            <div style={{ fontSize: 10, color: TEXT3, fontWeight: 600 }}>Drag components · Connect · Run Simulation</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", color: TEXT3, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}>
            <X size={18} />
          </button>
        )}
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <iframe
          src="/aws-simulator/index.html"
          style={{ width: "100%", height: "100%", border: "none" }}
          title="AWS System Design Simulator"
        />
      </div>
    </div>
  );
}
