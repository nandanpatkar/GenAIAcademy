import React from "react";
import { Icon } from "@iconify/react";
import { getProviderMeta } from "../config/aiProviders";

// Renders a provider's brand mark. When the registry entry has a reliable
// Iconify logo we render it; otherwise we fall back to a branded monogram
// badge (brand colour + short label) so every model always shows an icon.
export default function ProviderIcon({ providerId, size = 18, radius = 6, className = "" }) {
  const meta = getProviderMeta(providerId);
  const box = size + 8;

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: box,
    height: box,
    minWidth: box,
    borderRadius: radius,
    lineHeight: 1,
    overflow: "hidden",
  };

  if (meta.icon) {
    return (
      <span
        className={`provider-icon ${className}`.trim()}
        style={{ ...baseStyle, background: "#ffffff", border: "1px solid rgba(0,0,0,.08)" }}
        title={meta.label}
      >
        <Icon icon={meta.icon} width={size} height={size} />
      </span>
    );
  }

  // Monogram fallback — brand-coloured badge with the provider's short mark.
  const mono = meta.mono || meta.label?.[0] || "?";
  const fontSize = mono.length > 2 ? Math.round(size * 0.42) : Math.round(size * 0.58);

  return (
    <span
      className={`provider-icon ${className}`.trim()}
      style={{
        ...baseStyle,
        background: meta.color || "#4b5563",
        color: "#ffffff",
        fontSize,
        fontWeight: 700,
        letterSpacing: "-.02em",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
      title={meta.label}
    >
      {mono}
    </span>
  );
}
