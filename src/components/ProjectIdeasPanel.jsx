import { useState, useCallback } from "react";
import { Lightbulb, RefreshCw, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { generateProjectIdeas } from "../services/aiService";

const LEVELS = [
  { key: "beginner",     label: "Beginner",      color: "#00ff88", bg: "rgba(0,255,136,0.08)",  border: "rgba(0,255,136,0.25)",  icon: "" },
  { key: "intermediate", label: "Intermediate",  color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", icon: "" },
  { key: "advanced",     label: "Advanced",      color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.25)", icon: "" },
];

function githubSearchUrl(query) {
  return `https://github.com/search?q=${encodeURIComponent(query)}&type=repositories&sort=stars`;
}

function ProjectCard({ project, level, pathColor }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: level.bg,
        border: `1px solid ${level.border}`,
        borderRadius: 10,
        padding: "12px 14px",
        transition: "all .2s",
        cursor: "pointer",
      }}
      className="hover-node"
      onClick={() => setExpanded(e => !e)}
    >
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 11 }}>{level.icon}</span>
            <span
              style={{
                fontSize: 9, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase",
                color: level.color, fontFamily: "var(--mono)",
              }}
            >
              {level.label}
            </span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", lineHeight: 1.4 }}>
            {project.title}
          </div>
        </div>
        <div style={{ color: "var(--text3)", flexShrink: 0, marginTop: 2 }}>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div style={{ marginTop: 10, borderTop: `1px solid ${level.border}`, paddingTop: 10 }}>
          <p style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.65, margin: "0 0 10px 0" }}>
            {project.description}
          </p>

          {/* Tech stack */}
          {project.stack && project.stack.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "var(--text3)", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 5, fontFamily: "var(--mono)" }}>
                Stack
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {project.stack.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 9, fontWeight: 700, padding: "2px 7px",
                      background: "var(--bg3)", border: "1px solid var(--border)",
                      borderRadius: 5, color: "var(--text2)", fontFamily: "var(--mono)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GitHub search link */}
          <a
            href={githubSearchUrl(project.githubQuery)}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 10, fontWeight: 700, color: level.color,
              textDecoration: "none", padding: "5px 10px",
              background: level.bg, border: `1px solid ${level.border}`,
              borderRadius: 6, transition: "all .15s",
            }}
          >
            <ExternalLink size={11} />
            Search GitHub examples ↗
          </a>
        </div>
      )}
    </div>
  );
}

export default function ProjectIdeasPanel({ module, pathColor }) {
  const [ideas, setIdeas]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [expanded, setExpanded] = useState(true);

  const generateIdeas = useCallback(async () => {
    if (!module) return;
    setLoading(true);
    setError(null);

    const subtopics = (module.subtopics || [])
      .map(s => (typeof s === "object" ? s.title : s))
      .join(", ");

    try {
      const parsed = await generateProjectIdeas(module.title, subtopics);

      // Sort by level order
      const order = { beginner: 0, intermediate: 1, advanced: 2 };
      parsed.sort((a, b) => (order[a.level] ?? 9) - (order[b.level] ?? 9));

      setIdeas(parsed);
    } catch (err) {
      setError("Failed to generate ideas. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [module]);

  if (!module) return null;

  return (
    <div
      style={{
        marginTop: 20,
        paddingTop: 18,
        borderTop: "1px solid var(--border)",
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: expanded && ideas ? 12 : 0,
          cursor: "pointer",
        }}
        onClick={() => ideas && setExpanded(e => !e)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Lightbulb size={13} color={pathColor || "var(--neon)"} />
          <span
            style={{
              fontSize: 9, fontWeight: 800, letterSpacing: "1px",
              textTransform: "uppercase", color: "var(--text3)",
            }}
          >
            Project Ideas
          </span>
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {ideas && (
            <button
              onClick={e => { e.stopPropagation(); generateIdeas(); }}
              title="Regenerate"
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "3px 8px", borderRadius: 6,
                background: "transparent", border: "1px solid var(--border)",
                color: "var(--text3)", cursor: "pointer",
                fontSize: 9, fontWeight: 700, fontFamily: "var(--mono)",
                transition: "all .15s",
              }}
              className="hover-node"
            >
              <RefreshCw size={9} />
              REGEN
            </button>
          )}
          {!ideas && !loading && (
            <button
              onClick={e => { e.stopPropagation(); generateIdeas(); }}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "4px 10px", borderRadius: 7,
                background: pathColor ? `${pathColor}15` : "rgba(0,255,136,0.1)",
                border: `1px solid ${pathColor ? `${pathColor}40` : "rgba(0,255,136,0.3)"}`,
                color: pathColor || "var(--neon)",
                cursor: "pointer", fontSize: 10, fontWeight: 700,
                fontFamily: "var(--mono)", transition: "all .15s",
              }}
              className="hover-node"
            >
              <Lightbulb size={11} />
              GENERATE IDEAS
            </button>
          )}
          {ideas && (
            <div style={{ color: "var(--text3)" }}>
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "14px 0", color: "var(--text3)", fontSize: 11,
          }}
        >
          <div
            style={{
              width: 14, height: 14, borderRadius: "50%",
              border: `2px solid ${pathColor || "var(--neon)"}`,
              borderTopColor: "transparent",
              animation: "spin 0.7s linear infinite",
            }}
          />
          Generating project ideas…
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div
          style={{
            fontSize: 11, color: "#f87171",
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: 8, padding: "8px 12px", marginTop: 8,
          }}
        >
          {error}
          <button
            onClick={generateIdeas}
            style={{
              marginLeft: 8, background: "none", border: "none",
              color: "#f87171", cursor: "pointer", fontWeight: 700,
              fontSize: 11, textDecoration: "underline",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Ideas list */}
      {ideas && expanded && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ideas.map((project, i) => {
            const level = LEVELS.find(l => l.key === project.level) || LEVELS[i] || LEVELS[0];
            return (
              <ProjectCard
                key={i}
                project={project}
                level={level}
                pathColor={pathColor}
              />
            );
          })}
          <div
            style={{
              fontSize: 9, color: "var(--text3)", textAlign: "center",
              marginTop: 2, fontFamily: "var(--mono)",
            }}
          >
            AI-generated · click any card to expand · click REGEN for new ideas
          </div>
        </div>
      )}
    </div>
  );
}