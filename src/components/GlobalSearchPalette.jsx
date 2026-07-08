// src/components/GlobalSearchPalette.jsx
//
// Self-contained Cmd+K / Ctrl+K command palette. Mount it ONCE, anywhere
// near the top of App.jsx's returned JSX — it manages its own open/close
// state via a global keydown listener, so no parent state is needed.
//
// Usage in App.jsx:
//   <GlobalSearchPalette items={searchItems} onNavigate={handleSearchNavigate} />

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Search, X, Map, PieChart, FlaskConical, Code2, StickyNote, Mic,
  PenTool, Users, GitBranch, BookOpen, Layers, FileText,
  CornerDownLeft, ArrowUp, ArrowDown,
} from "lucide-react";
import { searchIndex } from "../utils/buildSearchIndex";

const ICONS = {
  Map, PieChart, FlaskConical, Code2, StickyNote, Mic, PenTool, Users,
  GitBranch, BookOpen, Layers, FileText,
};

const TYPE_LABELS = {
  section: "SECTIONS",
  module: "CURRICULUM",
  subtopic: "SUBTOPICS",
  "interview-course": "INTERVIEW PREP",
  "interview-lesson": "INTERVIEW LESSONS",
};

export default function GlobalSearchPalette({ items, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => searchIndex(items, query, 30), [items, query]);

  const grouped = useMemo(() => {
    const groups = {};
    results.forEach((r, i) => {
      const key = r.type;
      if (!groups[key]) groups[key] = [];
      groups[key].push({ ...r, _flatIndex: i });
    });
    return groups;
  }, [results]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  // Global Cmd+K / Ctrl+K toggles open; Escape closes.
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 30);
  }, [isOpen]);

  useEffect(() => setSelectedIndex(0), [query]);

  const handleSelect = useCallback(
    (item) => {
      onNavigate(item);
      close();
    },
    [onNavigate, close]
  );

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={close}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "12vh",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(600px, 92vw)", maxHeight: "70vh",
          background: "var(--bg2)", border: "1px solid var(--bg3)",
          borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          fontFamily: "var(--mono, monospace)",
        }}
      >
        {/* Input row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid var(--bg3)" }}>
          <Search size={16} color="var(--neon, #00ff88)" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search curriculum, sections, interview prep…"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--text)", fontSize: 14, fontFamily: "inherit",
            }}
          />
          <button
            onClick={close}
            style={{ background: "transparent", border: "none", color: "var(--text2, #888)", cursor: "pointer", display: "flex" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div style={{ overflowY: "auto", padding: "6px 0" }}>
          {query.trim() === "" && (
            <div style={{ padding: "24px 16px", color: "var(--text2, #888)", fontSize: 12, textAlign: "center" }}>
              Type to search across your entire curriculum, sections, and interview prep.
            </div>
          )}

          {query.trim() !== "" && results.length === 0 && (
            <div style={{ padding: "24px 16px", color: "var(--text2, #888)", fontSize: 12, textAlign: "center" }}>
              No results for "{query}"
            </div>
          )}

          {Object.entries(grouped).map(([type, groupItems]) => (
            <div key={type} style={{ marginBottom: 4 }}>
              <div style={{ padding: "8px 16px 4px", fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: "var(--text2, #888)" }}>
                {TYPE_LABELS[type] || type.toUpperCase()}
              </div>
              {groupItems.map((item) => {
                const Icon = ICONS[item.icon] || FileText;
                const isSelected = item._flatIndex === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(item._flatIndex)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 16px", cursor: "pointer",
                      background: isSelected ? "var(--bg3)" : "transparent",
                      borderLeft: isSelected ? "2px solid var(--neon, #00ff88)" : "2px solid transparent",
                    }}
                  >
                    <Icon size={14} color={isSelected ? "var(--neon, #00ff88)" : "var(--text2, #888)"} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.label}
                      </div>
                      {item.subtitle && (
                        <div style={{ fontSize: 11, color: "var(--text2, #888)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 16px", borderTop: "1px solid var(--bg3)", fontSize: 10, color: "var(--text2, #888)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ArrowUp size={10} /><ArrowDown size={10} /> navigate</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CornerDownLeft size={10} /> select</span>
          <span style={{ marginLeft: "auto" }}>esc to close</span>
        </div>
      </div>
    </div>
  );
}
