
const fs = require('fs');
const content = fs.readFileSync('/Users/nandanpatkar/Downloads/genai-roadmap-src/src/components/AimlCompanion.jsx', 'utf8');

// Use regex to extract the CURRICULA array content
// This is a bit tricky with nested objects, but I know the structure.
// Instead of complex regex, I'll just look for the CURRICULA = [ ... ] part.

const startIdx = content.indexOf('const CURRICULA = [');
const endIdx = content.indexOf('];', startIdx) + 2;
const curriculaStr = content.substring(startIdx, endIdx);

// I'll use a hacky evaluation or just clean it up to be valid JSON-like
// Since it uses variables like `${BASE}`, I'll define BASE first.
const BASE = "https://aimlcompanion.ai";

// Evaluate the string to get the actual array
let curricula;
try {
    // Replace ${BASE} with the actual string and remove comments/const
    let evaluatable = curriculaStr.replace(/const CURRICULA = /, '').replace(/url: `\${BASE}(.*)`/g, 'url: "https://aimlcompanion.ai$1"');
    curricula = eval(evaluatable);
} catch (e) {
    console.error("Eval failed", e);
    process.exit(1);
}

const fullRoadmap = {
    id: "aiml-companion-comprehensive",
    title: "AIML Companion: The Complete Roadmap",
    description: "A comprehensive, high-fidelity curriculum covering the entire AI/ML ecosystem—from mathematical foundations to advanced LLM agents and MLOps.",
    color: "#00ff88",
    nodes: curricula.map(curr => ({
        id: curr.id,
        title: curr.label,
        color: curr.color || "#3b82f6",
        modules: curr.modules.map(mod => ({
            id: mod.id,
            title: mod.label,
            status: "pending",
            subtopics: [
                { title: `In-depth: ${mod.label}`, id: `st-${mod.id}-1`, status: "pending" }
            ]
        }))
    }))
};

fs.writeFileSync('/Users/nandanpatkar/Downloads/genai-roadmap-src/aiml_comprehensive_roadmap.json', JSON.stringify(fullRoadmap, null, 2));
console.log("Full Roadmap JSON generated successfully.");
