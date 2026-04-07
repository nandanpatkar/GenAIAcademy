import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Gemini 2.0 Flash (supports browser CORS, fast, free tier) ───────────────
const API_KEY = "AIzaSyDTdGP5-o2HNKNM7ZFyrdgyycWrHUAUAIU";
const genAI   = new GoogleGenerativeAI(API_KEY);
const model   = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ─── Internal: call Gemini with a system prompt + history ────────────────────
async function callGemini(systemPrompt, chatHistory, userMessage, maxTokens = 1024) {
  const history = [
    { role: "user",  parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Understood! I'm ready. Ask me anything." }] },
    ...chatHistory.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  ];

  const chat = model.startChat({
    history,
    generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

// ─── Public: AI Tutor ────────────────────────────────────────────────────────
export const askAITutor = async (userMessage, contextData, chatHistory = []) => {
  try {
    const { topicTitle, moduleTitle, activeCode } = contextData;

    const systemPrompt =
      `You are a deeply encouraging, expert programming tutor for the "GenAI Academy" platform.\n` +
      `The user is studying: module "${moduleTitle}", topic "${topicTitle}".\n` +
      (activeCode ? `Their current code:\n\`\`\`python\n${activeCode}\n\`\`\`\n` : "") +
      `\nBe a Socratic tutor:\n` +
      `- Don't give the final answer directly — give hints and guiding questions.\n` +
      `- Use friendly, encouraging language.\n` +
      `- Respond in clean Markdown with bolding, lists, and code blocks as needed.`;

    return await callGemini(systemPrompt, chatHistory, userMessage, 1024);
  } catch (error) {
    console.error("AI Tutor Error:", error);
    throw new Error("I hit a temporary snag. Please try again.");
  }
};

// ─── Public: Project Ideas ───────────────────────────────────────────────────
export const generateProjectIdeas = async (moduleTitle, subtopics) => {
  const systemPrompt =
    `You are an expert GenAI/ML curriculum designer. ` +
    `When asked, return ONLY a valid JSON array with no markdown, no backticks, no explanation. ` +
    `Schema for each item: { "level": "beginner"|"intermediate"|"advanced", "title": string, "description": string, "stack": string[], "githubQuery": string }`;

  const userMessage =
    `Generate exactly 3 project ideas for learners studying:\n` +
    `Module: "${moduleTitle}"\nSubtopics: ${subtopics}\n\n` +
    `Return ONLY the JSON array. No markdown fences. No explanation.`;

  try {
    const raw   = await callGemini(systemPrompt, [], userMessage, 1024);
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (error) {
    console.error("Project Ideas Error:", error);
    throw new Error("Failed to generate project ideas.");
  }
};

// ─── Public: Flow Architecture ───────────────────────────────────────────────────
export const generateFlowArchitecture = async (description) => {
  const systemPrompt = `You are an expert GenAI system architect. Convert this natural language description into a ReactFlow diagram for a GenAI system design playground.

Description: "${description}"

Return ONLY a valid JSON object. No markdown, no backticks, no explanation.

Schema:
{
  "name": "short architecture name (max 6 words)",
  "description": "one sentence summary",
  "nodes": [
    {
      "id": "unique_string_id",
      "label": "Node Name (max 4 words)",
      "sub": "short subtitle (max 4 words)",
      "icon": "one of: Bot|Brain|Database|Server|Shield|Search|Sparkles|Layers|Network|Cpu|Code2|BarChart2|Zap|MessageSquare|Cloud|Workflow|Filter|FileText|GitBranch|RefreshCw|Mic|Volume2|Eye|Globe|Lock|Key|Webhook|MemoryStick|CircuitBoard|ScanSearch",
      "colorKey": "one of: agent|llm|memory|processing|vectordb|store|datasource|tool|eval|observ|security|workflow|io|multimodal|mcp|aws|azure|databricks|image|audio",
      "inputPort": "one of: text|embeddings|json|tokens|docs|signal|memory|tool_call|any|audio|image",
      "outputPort": "one of: text|embeddings|json|tokens|docs|signal|memory|tool_call|any|audio|image",
      "info": "2-sentence explanation of what this node does and why it's here"
    }
  ],
  "edges": [
    {
      "source": "source_node_id",
      "target": "target_node_id",
      "label": "data type label (1-2 words, e.g. text|embeddings|json|audio|stream)"
    }
  ]
}

Rules:
- Include 5–14 nodes depending on complexity
- Every node must have at least one incoming or outgoing edge (no orphans)
- Edges must only reference node ids that exist in the nodes array
- Use real component names (e.g. "Pinecone", "Gemini 1.5", "LangGraph", "Whisper")
- colorKey must match the node's function category exactly
- Order nodes roughly left-to-right: input → processing → output
- Do NOT include position — it will be computed automatically`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\nTarget description: " + description }] }],
      generationConfig: {
        maxOutputTokens: 8192, // Increased from 2000 to solve JSON cutoff
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    const raw = result.response.text();
    try {
       return JSON.parse(raw);
    } catch (e) {
       console.error("Raw Model Output:", raw);
       throw e;
    }
  } catch (error) {
    console.error("Flow Architecture Error:", error);
    throw new Error("Failed to generate architecture.");
  }
};

// ─── Public: Blog TL;DR Generation ───────────────────────────────────────────
export const generateAI_TLDR = async (htmlContent) => {
  const systemPrompt = `You are a technical writing assistant. 
Create an extremely concise summary (TL;DR) of the following article content.
Return 5-7 sentences max. Use markdown formatting to highlight key terms.
Do not start with "Here is a summary" or similar fluff.

Content:
${htmlContent}
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: {
        maxOutputTokens: 256,
        temperature: 0.3,
      }
    });

    return result.response.text().trim();
  } catch (error) {
    console.error("TL;DR Generation Error:", error);
    throw new Error("Failed to generate article summary.");
  }
};
