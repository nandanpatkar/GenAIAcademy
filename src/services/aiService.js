const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Model priority list — tried in order until one succeeds.
// Fall back to openrouter/auto which always routes to a live free model.
const MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",  // stable, high-quality free model
  "openrouter/auto",                           // OpenRouter's free-model router (always live)
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// ─── Internal: call OpenRouter — model fallback + 429 retry ──────────────────
// onStatus(msg: string) — optional callback for UI status updates during retry
async function callOpenRouter(messages, maxTokens = 1024, temperature = 0.7, jsonMode = false, onStatus = null) {
  if (!API_KEY || API_KEY.includes("your-api-key")) {
    throw new Error("Missing OpenRouter API Key. Please add VITE_OPENROUTER_API_KEY to your .env file.");
  }

  const MAX_RATE_RETRIES = 2;  // per-model 429 retries: 6s then 12s
  const BASE_DELAY_MS    = 6000;

  // Try each model in priority order; fall through on 404
  for (let mi = 0; mi < MODELS.length; mi++) {
    const modelId = MODELS[mi];

    for (let attempt = 1; attempt <= MAX_RATE_RETRIES + 1; attempt++) {
      let response;
      try {
        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "GenAI Academy",
          },
          body: JSON.stringify({
            model: modelId,
            messages,
            max_tokens: maxTokens,
            temperature,
            response_format: jsonMode ? { type: "json_object" } : undefined,
          }),
        });
      } catch (networkError) {
        console.error("OpenRouter Network Error:", networkError);
        throw networkError;
      }

      // ── 404: model not found / deprecated → try next model immediately ──────
      if (response.status === 404) {
        console.warn(`Model "${modelId}" not found (404). Trying next model…`);
        break; // break inner attempt loop, advance to next model
      }

      // ── 429: rate limited → exponential backoff with live countdown ──────────
      if (response.status === 429) {
        if (attempt <= MAX_RATE_RETRIES) {
          const delaySec = (BASE_DELAY_MS / 1000) * Math.pow(2, attempt - 1); // 6s → 12s
          console.warn(`429 rate limit on "${modelId}". Retrying in ${delaySec}s (${attempt}/${MAX_RATE_RETRIES})…`);

          if (onStatus) {
            for (let rem = delaySec; rem > 0; rem--) {
              onStatus(`Rate limited — retrying in ${rem}s… (${attempt}/${MAX_RATE_RETRIES})`);
              await sleep(1000);
            }
            onStatus("Retrying now…");
          } else {
            await sleep(delaySec * 1000);
          }
          continue; // retry same model
        }
        // Rate retries exhausted for this model — try next model
        console.warn(`Rate limit retries exhausted for "${modelId}". Trying next model…`);
        break;
      }

      // ── Other HTTP error ─────────────────────────────────────────────────────
      if (!response.ok) {
        let errMsg = `API error: ${response.status}`;
        try {
          const errorData = await response.json();
          errMsg = errorData.error?.message || errMsg;
        } catch (_) { /* ignore */ }
        console.error(`OpenRouter Error (${modelId}):`, errMsg);
        throw new Error(errMsg);
      }

      // ── Success ──────────────────────────────────────────────────────────────
      const data = await response.json();
      return data.choices[0].message.content;
    }
  }

  // All models exhausted
  throw new Error(
    "All AI models are currently unavailable or rate-limited. Please wait ~30 seconds and try again."
  );
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

    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      })),
      { role: "user", content: userMessage }
    ];

    return await callOpenRouter(messages, 1024);
  } catch (error) {
    console.error("AI Tutor Error:", error);
    throw new Error("I hit a temporary snag. Please try again.");
  }
};

// ─── Public: Project Ideas ───────────────────────────────────────────────────
export const generateProjectIdeas = async (moduleTitle, subtopics) => {
  const systemPrompt =
    `You are an expert GenAI/ML curriculum designer. ` +
    `Return ONLY a valid JSON array with no markdown fences, no explaination. ` +
    `Schema for each item: { "level": "beginner"|"intermediate"|"advanced", "title": string, "description": string, "stack": string[], "githubQuery": string }`;

  const userMessage =
    `Generate exactly 3 project ideas for learners studying:\n` +
    `Module: "${moduleTitle}"\nSubtopics: ${subtopics}\n\n` +
    `Return ONLY the JSON array.`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ];
    const raw = await callOpenRouter(messages, 1024, 0.4, true);
    return JSON.parse(raw);
  } catch (error) {
    console.error("Project Ideas Error:", error);
    throw new Error("Failed to generate project ideas.");
  }
};

// ─── Public: Flow Architecture ───────────────────────────────────────────────────
export const generateFlowArchitecture = async (description) => {
  const systemPrompt = `You are an expert GenAI system architect. Convert this natural language description into a ReactFlow diagram.
Return ONLY a valid JSON object. No explanation.

Schema:
{
  "name": "short architecture name",
  "description": "one sentence summary",
  "nodes": [
    {
      "id": "unique_id",
      "label": "Name",
      "sub": "subtitle",
      "icon": "Bot|Brain|Database|Server|Shield|Search|Sparkles|Layers|Network|Cpu|Code2|BarChart2|Zap|MessageSquare|Cloud|Workflow|Filter|FileText|GitBranch|RefreshCw|Mic|Volume2|Eye|Globe|Lock|Key|Webhook|MemoryStick|CircuitBoard|ScanSearch",
      "colorKey": "agent|llm|memory|processing|vectordb|store|datasource|tool|eval|observ|security|workflow|io|multimodal|mcp|aws|azure|databricks|image|audio",
      "inputPort": "text|embeddings|json|tokens|docs|signal|memory|tool_call|any|audio|image",
      "outputPort": "text|embeddings|json|tokens|docs|signal|memory|tool_call|any|audio|image",
      "info": "description"
    }
  ],
  "edges": [
    {
      "source": "source_id",
      "target": "target_id",
      "label": "data type"
    }
  ]
}`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Target description: ${description}` }
    ];
    const raw = await callOpenRouter(messages, 4096, 0.2, true);
    return JSON.parse(raw);
  } catch (error) {
    console.error("Flow Architecture Error:", error);
    throw new Error("Failed to generate architecture.");
  }
};

// ─── Public: Blog TL;DR Generation ───────────────────────────────────────────
export const generateAI_TLDR = async (htmlContent) => {
  const systemPrompt = `You are a technical writing assistant. 
Create an extremely concise summary (TL;DR) of the article.
Return 5-7 sentences max. Use markdown formatting.`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Content:\n${htmlContent}` }
    ];
    return await callOpenRouter(messages, 512, 0.3);
  } catch (error) {
    console.error("TL;DR Generation Error:", error);
    throw new Error("Failed to generate article summary.");
  }
};

// ─── Study Suite Prompts ───────────────────────────────────────────────────
const STUDY_PROMPTS = {
  quiz: (context) => `
You are an expert GenAI instructor.
Given the module context below, generate exactly 10 multiple-choice questions.

RULES:
- Each question has exactly 4 options.
- Exactly one option is correct.
- Include a short explanation for the correct answer.
- Return ONLY valid JSON, no markdown fences, no extra text.

FORMAT:
{"questions":[{"question":"...","options":["A","B","C","D"],"answer":"A","explanation":"..."}]}

MODULE CONTEXT:
${context}`,

  flashcards: (context) => `
You are an expert GenAI instructor.
Generate exactly 8 flashcards for the module context below.

RULES:
- term: 6 words max.
- definition: 1-2 clear sentences.
- Return ONLY valid JSON, no markdown fences, no extra text.

FORMAT:
{"cards":[{"term":"...","definition":"..."}]}

MODULE CONTEXT:
${context}`,

  mindmap: (context) => `
You are an expert GenAI instructor.
Create a structured mind map for the module context below.

RULES:
- root = module title.
- 3-5 main branches from subtopics.
- Each branch has 2-5 leaf nodes.
- IMPORTANT: Provide a "desc" (description) for the root, each branch, and each leaf node.
- Descriptions should be 10-15 words max.
- Return ONLY valid JSON, no markdown fences, no extra text.

FORMAT:
{"mindmap":{"root":"Title","desc":"Root description","branches":[{"label":"Branch","desc":"Branch description","children":[{"label":"Leaf","desc":"Leaf description"}]}]}}

MODULE CONTEXT:
${context}`,

  summary: (context) => `
You are an expert GenAI instructor.
Write a concise study summary for the module context below.

RULES:
- 150-200 words, plain flowing text, no bullet points.
- Return ONLY valid JSON, no markdown fences, no extra text.

FORMAT:
{"summary":"..."}

MODULE CONTEXT:
${context}`,
};

// ─── Public: Study Content Generation ───────────────────────────────────────
// onStatus(msg) — optional callback to surface retry progress in the UI
export const generateStudyContent = async (mode, moduleData, onStatus = null) => {
  const { title, subtitle, subtopics, overview, links, videos } = moduleData;

  const contextLines = [
    `Module: ${title || "Unknown"}`,
    `Subtitle: ${subtitle || ""}`,
    `Overview: ${overview || ""}`,
    `Subtopics: ${(subtopics || []).map((s) => (typeof s === "object" ? s.title : s)).join(", ")}`,
  ];
  if (links?.length) contextLines.push(`Reference Links: ${links.slice(0, 5).join(", ")}`);
  if (videos?.length) contextLines.push(`YouTube Videos: ${videos.slice(0, 3).join(", ")}`);

  const context = contextLines.join("\n");
  const prompt = (STUDY_PROMPTS[mode] || STUDY_PROMPTS.summary)(context);

  const messages = [{ role: "user", content: prompt }];
  // Pass onStatus so callers get live retry countdown messages
  const raw = await callOpenRouter(messages, 3500, 0.3, true, onStatus);

  // Aggressive JSON cleanup (some models wrap in markdown fences)
  let clean = raw.trim();
  if (clean.includes("```")) {
    clean = clean.split("```")[1];
    if (clean.startsWith("json")) clean = clean.substring(4);
    clean = clean.split("```")[0];
  }

  const json = JSON.parse(clean.trim());
  return json;
};

// ─── Public: Architecture Diagram Generation ─────────────────────────────────
export const generateArchitectureDiagram = async (prompt, availableIconIds) => {
  const systemPrompt = `You are an expert software architect. Convert the user's description into a formal architecture diagram.
Return ONLY a valid JSON object. No explanation or markdown fences.

Schema:
{
  "nodes": [
    { "id": "1", "type": "archNode", "position": {"x": 100, "y": 150}, "data": { "iconId": "aws-lambda", "label": "Lambda", "sub": "Serverless" } }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "type": "labelled", "data": { "label": "invoke" } }
  ]
}

Available iconIds (ONLY use these exact strings): ${availableIconIds}

Rules:
1. Pick the most accurate iconId for each component from the provided list.
2. Space nodes at least 220px apart horizontally and 160px vertically for a clean layout.
3. Max 14 nodes, max 16 edges.
4. Ensure every edge source and target references a valid node ID.
5. Return ONLY the raw JSON object.`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Generate an architecture for: "${prompt}"` }
    ];
    const raw = await callOpenRouter(messages, 2048, 0.2, true);
    
    // Aggressive cleanup for JSON
    let clean = raw.trim();
    if (clean.includes("```")) {
      clean = clean.split("```")[1];
      if (clean.startsWith("json")) clean = clean.substring(4);
      clean = clean.split("```")[0];
    }
    
    return JSON.parse(clean.trim());
  } catch (error) {
    console.error("Architecture Diagram Error:", error);
    throw new Error("Failed to generate architecture diagram.");
  }
};
