import { Link2, TriangleAlert } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getProviderMeta, isProviderConfigured } from "../config/aiProviders";

// A compact, reusable status row for every built-in AI surface. Configuration
// stays in the sidebar so the ApiBeam room URL has one source of truth.
export default function ApiBeamConnectionNotice({ compact = false }) {
  const { aiProvider, providerConfigs } = useAuth();
  if (aiProvider !== "apibeam") return null;

  const provider = getProviderMeta("apibeam");
  const connected = isProviderConfigured("apibeam", providerConfigs?.apibeam || {});
  const color = connected ? "#8be9b1" : "#fbbf24";

  return (
    <div
      role="status"
      style={{
        display: "flex", alignItems: "flex-start", gap: 8,
        margin: compact ? "8px 0" : "12px 0",
        padding: compact ? "8px 10px" : "10px 12px",
        borderRadius: 9,
        border: `1px solid ${connected ? "rgba(139,233,177,.25)" : "rgba(251,191,36,.32)"}`,
        background: connected ? "rgba(139,233,177,.07)" : "rgba(251,191,36,.08)",
        color: "var(--text2)", fontSize: compact ? 10 : 11, lineHeight: 1.45,
      }}
    >
      {connected ? <Link2 size={15} color={color} style={{ flexShrink: 0, marginTop: 1 }} /> : <TriangleAlert size={15} color={color} style={{ flexShrink: 0, marginTop: 1 }} />}
      <span>
        <strong style={{ color }}>{connected ? "ApiBeam connected" : "ApiBeam connection required"}</strong>
        {" · "}{connected
          ? "This AI tool is using your connected browser session."
          : `${provider.setupMessage} Open the sidebar’s AI Provider settings to finish setup.`}
      </span>
    </div>
  );
}
