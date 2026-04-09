import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function BentoCard({ title, description, icon, onClick, glowColor = "var(--neon)" }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "16px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
      }}
      className="bento-card group"
    >
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
        opacity: 0.3,
        transition: "opacity 0.3s ease"
      }} className="bento-glow" />
      
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ 
          width: "36px", height: "36px", borderRadius: "10px", 
          background: "rgba(0, 255, 136, 0.08)", color: glowColor,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(0, 255, 136, 0.2)"
        }}>
          {icon || <Sparkles size={18} />}
        </div>
        <ArrowRight size={14} color="var(--text3)" style={{ opacity: 0.5 }} className="bento-arrow" />
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ color: "white", fontSize: "14px", fontWeight: "800", letterSpacing: "0.5px" }}>
          {title || "Upgrade to Pro"}
        </div>
        <div style={{ color: "var(--text3)", fontSize: "11px", fontWeight: "600", lineHeight: "1.4" }}>
          {description || "Unlock advanced AI features and unlimited generation."}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .bento-card:hover .bento-glow { opacity: 1 !important; }
        .bento-card:hover .bento-arrow { opacity: 1 !important; color: ${glowColor} !important; transform: translateX(2px); transition: all 0.2s ease; }
      `}} />
    </motion.div>
  );
}
