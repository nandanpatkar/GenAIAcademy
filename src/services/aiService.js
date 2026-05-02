const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const RETELL_API_KEY = import.meta.env.VITE_RETELL_API_KEY;
const RETELL_AGENT_ID = import.meta.env.VITE_RETELL_AGENT_ID;

const GEMINI_MODEL = "gemini-flash-latest";
let dynamicGeminiKey = "";

// ─── External Controls ──────────────────────────────────────────────────────────
export const setDynamicGeminiKey = (key) => {
  if (key) {
    console.log("AI Service: Dynamic Gemini Key injected.");
    dynamicGeminiKey = key;
  }
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const extractJSON = (raw) => {
  if (!raw) return "";
  let clean = raw.trim();
  
  // Remove markdown blocks if present
  if (clean.includes("```")) {
    const parts = clean.split("```");
    for (const p of parts) {
      const inner = p.trim();
      if (inner.startsWith("{") || inner.startsWith("[")) {
        clean = inner;
        if (clean.startsWith("json")) clean = clean.substring(4).trim();
        break;
      }
    }
  }

  const startIdx = clean.search(/[{\[]/);
  const endIdx = clean.lastIndexOf("}") > clean.lastIndexOf("]") 
    ? clean.lastIndexOf("}") 
    : clean.lastIndexOf("]");
    
  if (startIdx === -1 || endIdx === -1) return clean;
  return clean.substring(startIdx, endIdx + 1);
};

/**
 * Ensures the result is a valid JSON structure or throws a clear error.
 */
const parseSafety = (clean, raw) => {
  try {
    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON Parsing Error. Raw Content:", raw);
    console.error("Cleaned Content:", clean);
    
    // Attempt one last-ditch repair for common truncation issues
    let repaired = clean.trim();
    
    // 1. If it ends inside a string, close the quote
    const quoteCount = (repaired.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      repaired += '"';
    }

    const openBraces = (repaired.match(/\{/g) || []).length;
    const closeBraces = (repaired.match(/\}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/\]/g) || []).length;
    
    // 2. Add missing closers
    if (openBrackets > closeBrackets) repaired += "]".repeat(openBrackets - closeBrackets);
    if (openBraces > closeBraces) repaired += "}".repeat(openBraces - closeBraces);
    
    try {
      return JSON.parse(repaired);
    } catch (e) {
      console.error("JSON repair failed:", repaired);
    }
    
    throw new Error("The AI returned a malformed data format. Please try generating again.");
  }
};

// Normalize AI variations (choices vs options, etc)
const normalizeStudyData = (json) => {
  if (json.questions && Array.isArray(json.questions)) {
    json.questions = json.questions.map(q => ({
      ...q,
      options: q.options || q.choices || q.variants || [],
      answer: q.answer || q.correctAnswer || q.ans || ""
    }));
  }
  if (json.cards && Array.isArray(json.cards)) {
    json.cards = json.cards.map(c => ({
      ...c,
      term: c.term || c.title || c.word || "",
      definition: c.definition || c.description || c.meaning || ""
    }));
  }
  return json;
};

// ─── Internal: call Gemini ──────────────────────────────────────────────────
const callGemini = async (messages, maxTokens = 800, temperature = 0.7, jsonMode = false) => {
  const apiKey = dynamicGeminiKey || GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("your-api-key")) {
    throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to .env or update in Admin portal.");
  }

  const systemMessage = messages.find(m => m.role === 'system')?.content || "";
  const chatMessages = messages.filter(m => m.role !== 'system');

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemMessage + (jsonMode ? "\nIMPORTANT: Return ONLY valid JSON. No markdown." : "") }] },
        contents: chatMessages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens,
          responseMimeType: jsonMode ? "application/json" : "text/plain"
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gemini Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      if (data.candidates?.[0]?.finishReason === "SAFETY") {
        throw new Error("Gemini safety filters blocked the response. Try a less sensitive prompt.");
      }
      throw new Error("Gemini returned an empty response. Check API key or quota.");
    }
    
    return text;
  } catch (error) {
    console.error("Gemini call failed:", error);
    throw error;
  }
};

// ─── Unified AI Caller: Fallback logic ──────────────────────────────────────
export const callAI = async (messages, maxTokens = 800, temperature = 0.7, jsonMode = false, onStatus = null) => {
  return await callGemini(messages, maxTokens, temperature, jsonMode);
};

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

    return await callAI(messages, 800);
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
    const raw = await callAI(messages, 1024, 0.4, true);
    return JSON.parse(extractJSON(raw));
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
      const raw = await callAI(messages, 900, 0.2, true);
    return JSON.parse(extractJSON(raw));
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
    return await callAI(messages, 512, 0.3);
  } catch (error) {
    console.error("TL;DR Generation Error:", error);
    throw new Error("Failed to generate article summary.");
  }
};

// ─── Study Suite Prompts ───────────────────────────────────────────────────
const STUDY_PROMPTS = {
  quiz: (context) => `
You are an expert GenAI instructor.
Given the module context below, generate exactly 6 multiple-choice questions.

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
Generate exactly 6 flashcards for the module context below.

RULES:
- term: 6 words max.
- definition: 1-2 clear sentences.
- Return ONLY valid JSON, no markdown fences, no extra text.

FORMAT:
{"cards":[{"term":"...","definition":"..."}]}

MODULE CONTEXT:
${context}`,

  mindmap: (context) => `
You are an expert GenAI instructor creating a richly detailed, multi-level mind map.

Given the module context below, produce a COMPREHENSIVE mind map with MAXIMUM DETAIL.

STRUCTURE RULES:
- root: the module title (1 node).
- branches: 6 to 8 main branches covering every major subtopic.
- children: each branch must have 4 to 6 leaf nodes — specific concepts, techniques, or examples.
- subchildren: each leaf node must have 2 to 4 sub-leaf nodes — granular details, edge cases, or related terms.
- Every node (root, branch, leaf, sub-leaf) MUST have a "desc" field: a crisp 8-12 word description.

NAMING RULES:
- branch labels: 2-4 words.
- children labels: 2-5 words.
- subchildren labels: 1-4 words.
- Make labels highly specific and educational, not generic (e.g. "Big-O notation" not just "Complexity").

IMPORTANT: Return ONLY valid JSON, no markdown fences, no extra text.

FORMAT:
{"mindmap":{"root":"Title","desc":"Root description","branches":[{"label":"Branch","desc":"Branch description","children":[{"label":"Leaf","desc":"Leaf description","subchildren":[{"label":"SubLeaf","desc":"SubLeaf description"}]}]}]}}

MODULE CONTEXT:
${context}`,

  summary: (context) => `
You are an expert GenAI instructor.
Write a concise study summary for the module context below.

RULES:
- 150-200 words, plain flowing text, in  bullet points.
- Return ONLY valid JSON, no markdown fences, no extra text.

FORMAT:
{"summary":"..."}

MODULE CONTEXT:
${context}`,
};

// ─── Public: Study Content Generation ───────────────────────────────────────
// onStatus(msg) — optional callback to surface retry progress in the UI
export const generateStudyContent = async (mode, moduleData, onStatus = null) => {
  const { title, subtitle, subtopics, overview, links, videos, videoTitle, promptOverride } = moduleData;

  const contextLines = [
    `Module: ${title || "Unknown"}`,
    `Subtitle: ${subtitle || ""}`,
    `Overview: ${overview || ""}`,
    `Subtopics: ${(subtopics || []).map((s) => (typeof s === "object" ? s.title : s)).join(", ")}`,
  ];
  if (links?.length) contextLines.push(`Reference Links: ${links.slice(0, 5).join(", ")}`);
  if (videos?.length) contextLines.push(`YouTube Videos: ${videos.slice(0, 3).join(", ")}`);

  if (videoTitle) contextLines.push(`SPECIFIC VIDEO FOCUS: ${videoTitle}`);

  const context = contextLines.join("\n");
  const prompt = promptOverride || (STUDY_PROMPTS[mode] || STUDY_PROMPTS.summary)(context);

  const messages = [{ role: "user", content: prompt }];
  // Mind maps and detailed quizzes need high token counts to avoid truncation
  const tokenBudget = mode === 'mindmap' ? 4000 : 2000;
  
  const raw = await callAI(messages, tokenBudget, 0.3, true, onStatus);

  // Aggressive JSON extraction (some models wrap in markdown fences or prefix with text)
  const clean = extractJSON(raw);
  const json = parseSafety(clean, raw);
  return normalizeStudyData(json);
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
    const raw = await callAI(messages, 900, 0.2, true);
    
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

// ─── Public: Video Intelligence ──────────────────────────────────────────────
export const generateVideoIntelligence = async (videoTitle, moduleData) => {
  const { title, subtitle, subtopics, overview } = moduleData;

  const context = `
    Video Title: ${videoTitle}
    Module: ${title}
    Subtitle: ${subtitle || ""}
    Overview: ${overview || ""}
    Subtopics: ${(subtopics || []).map((s) => (typeof s === "object" ? s.title : s)).join(", ")}
  `;

  const systemPrompt = `You are an expert AI tutor for the GenAI Academy.
Given the video title and module context, generate a "Smart Learning Hub" dataset.
Return ONLY valid JSON. No markdown fences.

Schema:
{
  "summary": "3-4 concise sentences of what this video likely covers.",
  "keyTakeaways": ["Point 1", "Point 2", "Point 3"],
  "learningObjectives": ["Goal 1", "Goal 2"],
  "technicalKeywords": ["Term 1", "Term 2"]
}`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Module Context: ${context}` }
    ];
    const raw = await callAI(messages, 800, 0.4, true);
    
    // Cleanup
    let clean = raw.trim();
    if (clean.includes("```")) {
      clean = clean.split("```")[1];
      if (clean.startsWith("json")) clean = clean.substring(4);
      clean = clean.split("```")[0];
    }
    
    return JSON.parse(clean.trim());
  } catch (error) {
    console.error("Video Intelligence Error:", error);
    throw new Error("Failed to generate video summary.");
  }
};

// ─── Public: Interview Expert Coach ──────────────────────────────────────────
export const generateInterviewCoachContent = async (videoTitle, moduleData, onStatus = null) => {
  const { title, subtopics, overview } = moduleData;

  const context = `
    Video: ${videoTitle}
    Module: ${title}
    Context: ${overview}
    Subtopics: ${(subtopics || []).map(s => (typeof s === 'object' ? s.title : s)).join(', ')}
  `;

  const systemPrompt = `You are a Senior Data Scientist, ML Engineer, and Interview Coach.
Your task is to help the user prepare for Data Science and GenAI interviews (fresher to experienced level).

CORE RESPONSE RULES:
1. INTERVIEW-FIRST THINKING: Answer as if an interviewer is sitting in front of the user. Focus on follow-up questions and practical understanding.
2. STRUCTURED ANSWERS: For the concept, use: What is it? Why needed? How it works (step-by-step)? Mathematical intuition? Real-world example? Where is it used? Pros/Cons?
3. SIMPLE -> DEEP FLOW: Start simple (5-year-old level) then go deep (PhD/Researcher level).
4. INTERVIEW PREPARATION: Mention Interview traps, "What NOT to say" (Red Flags), and 3-4 deep follow-up questions.
5. NEGATIVE LEARNING: Mention common misconceptions and what the concept is NOT.
6. VISUAL LOGIC: You must also provide a flowchart representing the logic of the concept.

RETURN FORMAT (Return ONLY a valid JSON object):
{
  "fullMarkdown": "The full detailed study guide in Markdown. Use # ## headings, **bold**, and --- separators. Include the Negative Learning and Interview segments clearly.",
  "flowData": {
    "nodes": [
       { "id": "n1", "data": { "label": "Concept Start" }, "position": { "x": 100, "y": 0 }, "type": "input", "style": { "background": "#10b981", "color": "white", "borderRadius": "8px" } },
       { "id": "n2", "data": { "label": "Step 2" }, "position": { "x": 100, "y": 100 }, "style": { "background": "#3b82f6", "color": "white", "borderRadius": "8px" } }
    ],
    "edges": [
       { "id": "e1-2", "source": "n1", "target": "n2", "animated": true, "label": "Transition" }
    ]
  }
}

Use sensible spacing for nodes. Nodes should have a modern look.`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Generate a deep-dive interview guide for the core concept in: "${videoTitle}" (Module: "${title}").` }
    ];
    
    const raw = await callAI(messages, 1500, 0.3, true, onStatus);
    const clean = extractJSON(raw);
    const json = JSON.parse(clean);
    return json;
  } catch (error) {
    console.error("Interview Coach Error:", error);
    throw new Error("Failed to generate interview coaching content.");
  }
};

// ─── Public: Senior AI Detailed Notes (Coach Persona) ─────────────────────────
export const generateDetailedNotes = async (videoTitle, moduleData, onStatus = null) => {
  const { title, subtopics, overview } = moduleData;

  const context = `
    Video Title: ${videoTitle}
    Module: ${title}
    Core Overview: ${overview}
    Keywords/Subtopics: ${(subtopics || []).map(s => (typeof s === 'object' ? s.title : s)).join(', ')}
  `;

  const systemPrompt = `You are a Senior Data Scientist, ML Engineer, and Interview Coach.
Your task is to help a user learn Data Science and GenAI concepts with a focus on preparation for top-tier tech interviews.

CORE RESPONSE RULES:
1. INTERVIEW-FIRST THINKING: Answer as if an interviewer is sitting in front of the user. Focus on follow-up questions and practical depth.
2. STRUCTURED FLOW (MANDATORY): For every core concept mentioned in the video topic, use this exact structure:
   - WHAT IS IT? (Definition)
   - WHY IS IT NEEDED? (The problem it solves)
   - HOW DOES IT WORK? (Step-by-step logic)
   - MATHEMATICAL INTUITION (Simple explanation of the core math/algorithm)
   - REAL-WORLD EXAMPLE (Case study style)
   - PROS & CONS (The trade-offs)
   - INTERVIEW TRAPS (Misconceptions and "What NOT to say")
3. SIMPLE -> DEEP FLOW: Explain for a beginner first, then escalate to Senior/Lead Engineer level.
4. FOLLOW-UP READINESS: Provide 3-4 deep follow-up questions an interviewer might ask.
5. VISUAL LOGIC: You must also provide a flowchart representing the logic of the concept.

RETURN FORMAT:
Return ONLY a valid JSON object. No markdown fences.

Schema:
{
  "title": "Topic Title",
  "content": "Full markdown string with headings, lists, and formatted blocks.",
  "checkpoints": [
    { "time": "Approx timestamp", "instruction": "Visual cue" }
  ],
  "flowData": {
    "nodes": [
       { "id": "n1", "data": { "label": "Start" }, "position": { "x": 100, "y": 0 }, "type": "custom" }
    ],
    "edges": [
       { "id": "e1-2", "source": "n1", "target": "n2", "animated": true }
    ]
  }
}`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Generate detailed, interview-ready study notes for: "${videoTitle}" in the context of "${title}".` }
    ];
    
    const raw = await callAI(messages, 1500, 0.3, true, onStatus);
    const clean = extractJSON(raw);
    return JSON.parse(clean);
  } catch (error) {
    console.error("Detailed Notes Error:", error);
    throw new Error("Failed to generate detailed study notes.");
  }
};
// ─── Public: Retell AI Integration ──────────────────────────────────────────
export const createRetellWebCall = async (config) => {
  const { role, seniority, jobDescription, language, resumeText } = config;
  
  // Use specialized agent for Hindi if requested
  const agentId = language === "Hindi" 
    ? (import.meta.env.VITE_RETELL_HINDI_AGENT_ID || "agent_c3b45b8978dd12ea7400171947")
    : (import.meta.env.VITE_RETELL_AGENT_ID || "agent_f530318a167b9cdefc0de07c24");

  const apiKey = import.meta.env.VITE_RETELL_API_KEY;
  if (!apiKey || apiKey.includes("your-api-key")) {
    throw new Error("Missing Retell API Key. Please add VITE_RETELL_API_KEY to your Vercel/Environment variables.");
  }

  console.log(`Creating ${language || "English"} session with agent: ${agentId}`);

  try {
    const response = await fetch("https://api.retellai.com/v2/create-web-call", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: agentId,
        retell_llm_dynamic_variables: {
          user_role: role,
          seniority: seniority,
          resume_text: resumeText || "Not provided.",
          shared_code: "No code shared yet.",
          shared_output: "No output shared yet.",
          job_description: `Role context: You are Amit, a technical lead. YOU MUST INTRODUCE YOURSELF AS Amit. 
          If the session is in English: Speak in a frank, direct, and conversational manner. 
          If the session is in Hindi: USE COLLOQUIAL HINGLISH (Romanized Hindi). NEVER use formal "Shuddh" Hindi. Speak like a local tech lead.
          Technical terms should remain in English. 
          
          CRITICAL: A resume is provided in 'resume_text'. 
          
          CODE MONITORING:
          The user operates a live Python IDE. Their CURRENT code is always available in the dynamic variable '{{shared_code}}' and its execution result in '{{shared_output}}'.
          WHENEVER the user says they shared code, or you notice '{{shared_code}}' has changed:
          1. Actively READ and CRITIQUE the logic in '{{shared_code}}'.
          2. Acknowledge the specific technical implementation.
          3. Provide immediate feedback or ask follow-up questions.
          
          Context info: ${jobDescription || "General technical interview."}`,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Retell API Error Response:", errorData);
      throw new Error(errorData.error?.message || "Failed to create Retell web call");
    }

    const data = await response.json();
    console.log("Retell Session Data:", data);
    return data; // contains access_token
  } catch (error) {
    console.error("Retell Create Call Error:", error);
    throw error;
  }
};

export const updateRetellCallVariables = async (callId, variables) => {
  try {
    const response = await fetch(`https://api.retellai.com/v2/update-call/${callId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        override_dynamic_variables: variables // Expects key-value strings
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Retell Update Call Variables Error:", error);
    throw error;
  }
};

export const generateInterviewAnalysis = async (transcriptText, config) => {
  const { role, seniority, language } = config;

  const systemPrompt = `You are a world-class Technical Interview Coach.
Analyze the provided interview transcript and generate a high-fidelity performance report.
Role: ${role} (${seniority})
Interview Conducted In: ${language || "English"} (May contain Hindi/Hinglish)

Analyze the candidate's thinking process, technical depth, and communication.
The transcript may wrap English technical terms within Hindi sentences.

Return ONLY a valid JSON object. No explanation.

Schema:
{
  "score": number (Overall 0-100),
  "detailedScores": {
    "technical": number (0-100),
    "communication": number (0-100),
    "confidence": number (0-100)
  },
  "verdict": "string (Short summary of hire/no-hire decision)",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "technicalFeedback": "string (Deep dive into technical precision)",
  "communicationFeedback": "string (Tone, clarity, confidence)",
  "suggestedLearning": ["string (Topic names from roadmap)"]
}`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Please analyze this interview transcript:\n\n${transcriptText}` }
    ];
    // Generate analysis using Gemini
    const raw = await callAI(messages, 900, 0.3, true);
    return JSON.parse(extractJSON(raw));
  } catch (error) {
    console.error("Interview Analysis Error:", error);
    throw new Error("Failed to generate interview analysis.");
  }
};

// ─── Public: Algorithm Template Discovery ──────────────────────────────
export const findAlgorithmTemplates = async (query) => {
  const systemPrompt = `You are a world-class algorithm repository. 
Return exactly 1 high-quality Python algorithm template that matches the user's search query.
Return ONLY a valid JSON object. No explanation or markdown fences.

Schema:
{
  "results": [
    {
      "id": "unique-slug",
      "title": "Algorithm Title",
      "description": "Short 1-sentence logic overview.",
      "category": "Sorting|Searching|Graphs|DP|etc",
      "difficulty": "Easy|Medium|Hard",
      "code": "def algo(arr):\n    # implementation\n    pass"
    }
  ]
}

Rules:
1. Ensure the code is self-contained and visualizable (use standard Python).
2. Use clear variable names (i, j, mid, etc).
3. The code should be clean, concise, and educational.
4. Return exactly 1 result in the list.
5. IMPORTANT: Include a short, visualizable test case at the end of the code (e.g. result = my_func([1, 2, 3])).`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Find/Generate high-quality Python algorithm templates for: "${query}"` }
    ];
    
    const raw = await callAI(messages, 2500, 0.5, true);
    const clean = extractJSON(raw);
    return JSON.parse(clean);
  } catch (error) {
    console.error("Algorithm Template Error:", error);
    throw new Error("Failed to discover algorithm templates.");
  }
};
