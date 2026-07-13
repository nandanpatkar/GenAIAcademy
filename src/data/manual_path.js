import { MANUAL_STRUCTURE } from "./manualData";

const categoryEmojis = {
  "logic": "🔀",
  "mathematics": "🔢",
  "physics": "⚛️",
  "operating-systems": "💻",
  "hardware": "🔌",
  "networking": "🌐",
  "programming-concepts": "💡",
  "programming-languages": "💻",
  "web-fundamentals": "🕸️",
  "frameworks": "📦",
  "version-control": "🔀",
  "debugging": "🪲",
  "testing": "🧪",
  "databases": "🗄️",
  "data-analytics": "📈",
  "apis": "🔗",
  "architecture": "🏗️",
  "devops": "🔄",
  "infrastructure": "☁️",
  "performance": "⚡",
  "security": "🛡️",
  "ai-ml": "🧠",
  "working-with-ai": "🤖",
  "no-code": "🧩",
  "tooling": "🛠️",
  "projects": "🚀",
  "working-as-a-developer": "💼",
  "practice": "⌨️"
};

export const MANUAL_PATH = {
  id: "manual",
  label: "Missing Manual",
  title: "The Missing Manual",
  subtitle: "First-principles developer handbook & study roadmap",
  description: "Master logic, systems, architecture, and professional engineering concepts from first principles.",
  color: "#00ff88",
  dimColor: "#00cc66",
  bgColor: "rgba(0,255,136,0.08)",
  borderColor: "rgba(0,255,136,0.3)",
  nodes: MANUAL_STRUCTURE.map((category) => {
    return {
      id: `manual-node-${category.slug}`,
      title: category.name,
      subtitle: category.blurb || "",
      tag: "MANUAL",
      tagColor: "#00ff88",
      icon: categoryEmojis[category.slug] || "◈",
      modules: category.guides.map((guide) => {
        return {
          id: `manual-module-${category.slug}-${guide.slug}`,
          title: guide.title,
          subtitle: guide.summary || "",
          status: "pending",
          duration: `${guide.phases?.length || 0} topics`,
          subtopics: (guide.phases || []).map((phase) => {
            return {
              title: phase.title,
              status: "pending",
              // Store metadata so we can open the manual viewer directly when clicked
              categorySlug: category.slug,
              guideSlug: guide.slug,
              phaseSlug: phase.slug,
              filePath: phase.filePath
            };
          }),
          overview: guide.summary || ""
        };
      })
    };
  })
};
