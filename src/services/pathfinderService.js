import {
  ROADMAP_CATALOG,
  SECTION_CATALOG,
  MANUAL_CATEGORY_CATALOG,
  REFERENCE_TAG_CATALOG,
} from "../data/onboardingCatalog";
import { MANUAL_STRUCTURE } from "../data/manualData";
import { REFERENCE_STRUCTURE } from "../data/referenceData";
import { PATHFINDER_QUESTIONS, getAssessmentOption } from "../data/pathfinderAssessment";
import { matchManualAndReferenceDetails } from "./aiService";

const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));

const getAnswersText = (answers) => {
  return Object.entries(answers || {})
    .map(([key, value]) => {
      const question = PATHFINDER_QUESTIONS.find((item) => item.key === key);
      const option = getAssessmentOption(question, value);
      return `${key}: ${option?.label || value}`;
    })
    .join(" ");
};

const findRoadmap = (preferredIds = []) => {
  for (const id of preferredIds) {
    const path = ROADMAP_CATALOG.find((item) => item.id === id);
    if (path) return path;
  }
  return ROADMAP_CATALOG[0] || null;
};

const findManualCategories = (keywords) => {
  const matches = MANUAL_CATEGORY_CATALOG.filter((category) => {
    const haystack = `${category.name} ${category.blurb}`.toLowerCase();
    return keywords.some((keyword) => haystack.includes(keyword));
  });
  return (matches.length ? matches : MANUAL_CATEGORY_CATALOG).slice(0, 2).map((item) => item.slug);
};

const findReferenceTags = (keywords) => {
  const matches = REFERENCE_TAG_CATALOG.filter((tag) =>
    keywords.some((keyword) => tag.toLowerCase().includes(keyword))
  );
  return (matches.length ? matches : REFERENCE_TAG_CATALOG).slice(0, 3);
};

const tool = (sectionId, reason, priority) => ({ sectionId, reason, priority });

const chooseTools = (mission, format) => {
  const toolSets = {
    "genai-builder": [
      tool("playground", "Prototype prompts, retrieval, and agent behaviour safely.", 1),
      tool("projects", "Turn the experiment into a real, saved project.", 2),
      tool("flow_design", "Map the system before adding complexity.", 3),
      tool("reference", "Keep model and API patterns close while you build.", 4),
    ],
    "data-scientist": [
      tool("ide", "Practice Python and data workflows in a focused environment.", 1),
      tool("manual", "Build the statistics and ML intuition behind the code.", 2),
      tool("quiz", "Check your understanding as concepts become more complex.", 3),
      tool("reference", "Keep the core Python and ML syntax nearby.", 4),
    ],
    "systems-architect": [
      tool("aws_simulator", "Design cloud architecture and see the trade-offs in motion.", 1),
      tool("simulator", "Explore general system design patterns interactively.", 2),
      tool("flow_design", "Sketch AI system boundaries before implementation.", 3),
      tool("projects", "Make the architecture tangible in a working project.", 4),
    ],
    "interview-ready": [
      tool("interview_prep", "Follow structured technical and behavioural preparation.", 1),
      tool("interviewer", "Practice explaining your thinking with live feedback.", 2),
      tool("algo_visualizer", "Build algorithm intuition before timed problem solving.", 3),
      tool("dsa_animator", "Make the mechanics of data structures memorable.", 4),
    ],
    explorer: [
      tool("manual", "Start with first-principles explanations instead of scattered links.", 1),
      tool("galaxy", "See how ideas connect across the AI landscape.", 2),
      tool("knowledge_graph", "Build a durable mental map of the curriculum.", 3),
      tool("reference", "Use compact notes when you need a quick recall loop.", 4),
    ],
  };

  const selected = toolSets[mission] || toolSets.explorer;
  if (format === "build") return selected.sort((a, b) => (a.sectionId === "playground" ? -1 : b.sectionId === "playground" ? 1 : a.priority - b.priority));
  if (format === "practice") return selected.sort((a, b) => (a.sectionId.includes("interview") || a.sectionId.includes("algo") ? -1 : a.priority - b.priority));
  return selected;
};

const getRoadmapForMission = (mission) => {
  const byMission = {
    "genai-builder": ["aicxm_aws", "aicxm_azure", "aicxm_databricks", "manual"],
    "data-scientist": ["ds", "manual"],
    "systems-architect": ["aicxm_aws", "aicxm_azure", "aicxm_databricks"],
    "interview-ready": ["dsa", "manual"],
    explorer: ["manual", "ds"],
  };
  return findRoadmap(byMission[mission] || byMission.explorer);
};

export const buildFallbackRecommendation = (answers) => {
  const mission = answers?.mission || "explorer";
  const selectedOptions = PATHFINDER_QUESTIONS
    .map((question) => getAssessmentOption(question, answers?.[question.key]))
    .filter(Boolean);
  const profile = { programming: 20, foundations: 20, math: 18, genai: 18, systems: 18, consistency: 50 };
  selectedOptions.forEach((option) => {
    Object.entries(option.score || {}).forEach(([key, value]) => {
      profile[key] = Math.max(profile[key] || 0, value);
    });
  });

  const missionBoosts = {
    "genai-builder": { genai: 16 },
    "data-scientist": { foundations: 14, math: 10 },
    "systems-architect": { systems: 18 },
    "interview-ready": { programming: 10, systems: 8 },
    explorer: { foundations: 8 },
  };
  Object.entries(missionBoosts[mission] || {}).forEach(([key, value]) => { profile[key] = clamp(profile[key] + value); });

  const roadmap = getRoadmapForMission(mission);
  const format = answers?.format;
  const tools = chooseTools(mission, format);
  const keywordsByMission = {
    "genai-builder": ["ai", "llm", "agent", "genai", "prompt"],
    "data-scientist": ["data", "machine", "statistics", "python"],
    "systems-architect": ["cloud", "system", "architecture", "aws"],
    "interview-ready": ["algorithm", "data", "python", "interview"],
    explorer: ["fundamentals", "python", "ai", "machine"],
  };
  const keywords = keywordsByMission[mission] || keywordsByMission.explorer;
  const manualCategories = findManualCategories(keywords);
  const referenceTags = findReferenceTags(keywords);
  const { manualMatches, referenceMatches } = matchManualAndReferenceDetails(
    manualCategories,
    referenceTags,
    { ...answers, goal: answers?.goal || "" },
    MANUAL_STRUCTURE,
    REFERENCE_STRUCTURE
  );

  const missionLabels = {
    "genai-builder": "GenAI application builder",
    "data-scientist": "data and ML practitioner",
    "systems-architect": "AI systems architect",
    "interview-ready": "interview-ready engineer",
    explorer: "confident AI learner",
  };
  const goalLine = answers?.goal ? ` Your goal — “${answers.goal}” — is part of the signal.` : "";
  const message = `We are shaping a practical route toward becoming a ${missionLabels[mission] || missionLabels.explorer}.${goalLine}`;

  const actionByMission = {
    "genai-builder": ["Open the recommended roadmap and complete the first foundations module.", "Prototype one small idea in the GenAI Simulator.", "Turn the prototype into a saved Cloud IDE project."],
    "data-scientist": ["Start with Python and statistics foundations.", "Practice one data workflow in the Practice IDE.", "Use a quiz to verify the concepts you just applied."],
    "systems-architect": ["Open the roadmap and identify the first architecture milestone.", "Model a small AI service in the System Simulator.", "Recreate it in the AWS System Design Simulator."],
    "interview-ready": ["Choose one structured Interview Prep lesson.", "Explain the answer aloud in AI Interviewer.", "Visualize and solve one algorithm pattern."],
    explorer: ["Open the first foundations module on your roadmap.", "Explore the linked concepts in Knowledge Galaxy.", "Keep a short note about what you want to investigate next."],
  };

  return {
    version: 1,
    source: "local",
    message,
    recommendedRoadmap: roadmap?.id || null,
    roadmap: roadmap,
    alternateRoadmaps: ROADMAP_CATALOG.filter((item) => item.id !== roadmap?.id).slice(0, 2),
    sections: tools.map(({ sectionId, reason }) => ({ sectionId, reason })),
    toolRecommendations: tools,
    skillProfile: Object.fromEntries(Object.entries(profile).filter(([key]) => key !== "consistency").map(([key, value]) => [key, clamp(value)])),
    consistency: clamp(profile.consistency),
    readinessLabel: profile.programming < 40 && profile.foundations < 40 ? "Explore" : profile.genai > 70 || profile.systems > 70 ? "Build & deepen" : "Build foundations",
    firstActions: actionByMission[mission] || actionByMission.explorer,
    manualCategories,
    referenceTags,
    manualMatches,
    referenceMatches,
  };
};

export const validateAndMergeRecommendation = (raw, fallback) => {
  const validRoadmap = ROADMAP_CATALOG.some((item) => item.id === raw?.recommendedRoadmap)
    ? raw.recommendedRoadmap
    : fallback.recommendedRoadmap;
  const validSections = Array.isArray(raw?.sections)
    ? raw.sections.filter((section) => SECTION_CATALOG.some((item) => item.id === section.sectionId))
    : [];

  return {
    ...fallback,
    source: raw ? "ai+local" : fallback.source,
    message: typeof raw?.message === "string" && raw.message.trim() ? raw.message : fallback.message,
    recommendedRoadmap: validRoadmap,
    roadmap: ROADMAP_CATALOG.find((item) => item.id === validRoadmap) || fallback.roadmap,
    sections: validSections.length ? validSections.slice(0, 4) : fallback.sections,
  };
};
