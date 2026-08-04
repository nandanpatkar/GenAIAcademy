import { AI_PROVIDERS, getProviderMeta } from "../config/aiProviders";

const RETELL_API_KEY = import.meta.env.VITE_RETELL_API_KEY;
const RETELL_AGENT_ID = import.meta.env.VITE_RETELL_AGENT_ID;

const GEMINI_MODEL = "gemini-flash-latest";
let currentAiProvider = "gemini";
// Per-provider credentials, keyed by provider id:
//   { gemini: { key }, "azure-openai": { endpoint, key, model }, glm: {...}, ... }
let providerConfigs = {};

// ─── External Controls ──────────────────────────────────────────────────────────
export const setAiProvider = (provider) => {
  currentAiProvider = provider || "gemini";
};

// Preferred API: push the whole credential map (used by App.jsx / AuthContext).
export const setProviderConfigs = (configs) => {
  providerConfigs = configs && typeof configs === "object" ? configs : {};
};

export const setProviderConfig = (providerId, config) => {
  if (!providerId) return;
  providerConfigs = { ...providerConfigs, [providerId]: { ...(config || {}) } };
};

const getProviderConfig = (providerId) => providerConfigs[providerId] || {};

// ─── Backward-compatible setters (legacy call sites) ─────────────────────────
export const setDynamicGeminiKey = (key) => {
  setProviderConfig("gemini", { ...getProviderConfig("gemini"), key: key || "" });
};

export const setAzureEndpoint = (endpoint) => {
  setProviderConfig("azure-openai", { ...getProviderConfig("azure-openai"), endpoint: endpoint || "" });
};

export const setAzureKey = (key) => {
  setProviderConfig("azure-openai", { ...getProviderConfig("azure-openai"), key: key || "" });
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
  const cfg = getProviderConfig("gemini");
  const apiKey = cfg.key || "";
  const model = cfg.model || GEMINI_MODEL;
  if (!apiKey || apiKey.includes("your-api-key")) {
    throw new Error("Missing personal Gemini API key. Add it in Settings before using AI.");
  }

  const systemMessage = messages.find(m => m.role === 'system')?.content || "";
  const chatMessages = messages.filter(m => m.role !== 'system');

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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

// Ensures a JSON instruction is present in the chat when jsonMode is on, so
// OpenAI-style providers that don't support response_format still return JSON.
const ensureJsonInstruction = (chatMessages) => {
  const sysMsg = chatMessages.find((m) => m.role === "system");
  if (sysMsg) {
    if (!sysMsg.content.toLowerCase().includes("json")) {
      sysMsg.content += "\nIMPORTANT: Return ONLY valid JSON.";
    }
  } else {
    chatMessages.unshift({ role: "system", content: "IMPORTANT: Return ONLY valid JSON." });
  }
  return chatMessages;
};

const callAzureOpenAI = async (messages, maxTokens = 800, temperature = 0.7, jsonMode = false) => {
  const cfg = getProviderConfig("azure-openai");
  const apiKey = cfg.key || "";
  const endpoint = cfg.endpoint || "";
  const deployment = cfg.model || getProviderMeta("azure-openai").defaultModel || "gpt-4o";
  if (!apiKey || !endpoint) {
    throw new Error("Missing Azure OpenAI Key or Endpoint. Add them in Settings before using AI.");
  }

  // Ensure JSON instructions exist in system prompt if jsonMode is true
  let chatMessages = messages.map(m => ({ role: m.role === 'model' ? 'assistant' : m.role, content: m.content }));
  if (jsonMode) chatMessages = ensureJsonInstruction(chatMessages);

  try {
    const url = `${endpoint.replace(/\/+$/, '')}/openai/deployments/${deployment}/chat/completions?api-version=2024-02-15-preview`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify({
        messages: chatMessages,
        max_tokens: maxTokens,
        temperature: temperature,
        response_format: jsonMode ? { type: "json_object" } : { type: "text" }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Azure OpenAI Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Azure OpenAI call failed:", error);
    throw error;
  }
};

// Generic caller for any OpenAI-compatible /chat/completions endpoint.
// Covers OpenAI, GLM (Zhipu), Kimi (Moonshot), Grok (xAI), Groq, DeepSeek, etc.
const callOpenAICompatible = async (providerId, messages, maxTokens = 800, temperature = 0.7, jsonMode = false) => {
  const meta = getProviderMeta(providerId);
  const cfg = getProviderConfig(providerId);
  const apiKey = cfg.key || "";
  const endpoint = (cfg.endpoint || meta.defaultEndpoint || "").replace(/\/+$/, "");
  const model = cfg.model || meta.defaultModel;
  if (!apiKey || !endpoint) {
    throw new Error(`Missing ${meta.label} API key or Base URL. Add them in Settings before using AI.`);
  }

  let chatMessages = messages.map((m) => ({ role: m.role === "model" ? "assistant" : m.role, content: m.content }));
  // Rely on a prompt-level JSON instruction rather than response_format so we
  // stay compatible with providers that don't implement the OpenAI json_object mode.
  if (jsonMode) chatMessages = ensureJsonInstruction(chatMessages);

  try {
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: chatMessages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `${meta.label} Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error(`${meta.label} returned an empty response. Check your key, model, or quota.`);
    return text;
  } catch (error) {
    console.error(`${meta.label} call failed:`, error);
    throw error;
  }
};

// ─── Unified AI Caller: routes to the active provider by its adapter ─────────
const dispatchProvider = async (providerId, messages, maxTokens, temperature, jsonMode) => {
  const meta = getProviderMeta(providerId);
  if (meta.adapter === "azure") return callAzureOpenAI(messages, maxTokens, temperature, jsonMode);
  if (meta.adapter === "openai") return callOpenAICompatible(providerId, messages, maxTokens, temperature, jsonMode);
  return callGemini(messages, maxTokens, temperature, jsonMode);
};

export const callAI = async (messages, maxTokens = 800, temperature = 0.7, jsonMode = false, onStatus = null) => {
  return await dispatchProvider(currentAiProvider, messages, maxTokens, temperature, jsonMode);
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

// ─── Public: Emotional Support Companion ───────────────────────────────────
export const askEmotionalSupport = async (userMessage, chatHistory = []) => {
  const systemPrompt = `You are Solace, a warm, grounded emotional-support companion inside GenAI Academy.
Your role is to help a learner feel heard, steady themselves, and consider one kind next step. You are not a therapist, doctor, or emergency service.

Conversation principles:
- Lead with empathy and reflect what the user seems to be feeling. Do not minimize, judge, or rush into fixing.
- Ask at most one gentle, optional follow-up question when it would help; otherwise offer one or two small, realistic options.
- Keep your tone natural, calm, non-clinical, and concise. Avoid platitudes, forced positivity, and claims that you understand exactly how they feel.
- You may offer simple grounding, rest, journaling, communication, or study-burnout suggestions, but never present them as medical treatment or diagnosis.
- Respect the user's autonomy. Do not tell them what they must do unless immediate safety is involved.
- If the user mentions self-harm, suicide, harming someone else, being unable to stay safe, or an immediate danger: respond with care and directness. Encourage contacting local emergency services now, moving to a safer place if possible, and reaching out to a trusted person who can be with them. Mention that in the U.S. and Canada they can call or text 988. Keep the response focused on immediate safety; do not provide instructions for self-harm.
- If the user asks for professional mental-health help, encourage a licensed mental-health professional or local support service, while remaining supportive.
- Do not claim to remember anything outside this conversation or that the session is medically confidential.

Use clean Markdown sparingly. Never call yourself a replacement for human support.`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content,
      })),
      { role: "user", content: userMessage },
    ];
    return await callAI(messages, 700, 0.7);
  } catch (error) {
    console.error("Emotional support companion error:", error);
    throw new Error("I couldn't reply just now. Please try again in a moment.");
  }
};

// ─── Public: Full-project context copilot ────────────────────────────────────
// Kept separate from the topic tutor so the global copilot can choose its
// provider per conversation without mutating the rest of the application.
export const askContextCopilot = async ({
  userMessage,
  projectContext,
  chatHistory = [],
  provider = currentAiProvider,
  webResults = [],
}) => {
  const webContext = webResults.length > 0
    ? `\n\nLIVE WEB SOURCES (use these when relevant and cite them as [1], [2], etc.):\n${webResults.map((source, index) => `[${index + 1}] ${source.title}\nURL: ${source.url}\n${source.content}`).join("\n\n")}`
    : "";

  const systemPrompt = `You are Atlas, the full-project AI copilot inside GenAI Academy.
You have access to the learner's current curriculum, roadmap progress, workspace notes, saved projects, and the active screen below.
Answer directly and practically. Use clean Markdown, short sections, bullets, and code blocks when useful.
When the question is about the learner's roadmap or progress, ground the answer in the supplied project context instead of inventing details.
When live web sources are supplied, use them for current facts and add numbered citations like [1] next to the relevant claim. Never invent a citation.
If the context does not contain enough information, say what is missing and then give the best general guidance.

PROJECT CONTEXT:
${projectContext}${webContext}`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...chatHistory.map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content,
    })),
    { role: "user", content: userMessage },
  ];

  return await dispatchProvider(provider, messages, 1200, 0.65, false);
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
const flowText = (value) => String(value ?? "").trim();
const flowSlug = (value) => flowText(value).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

const flowEdgeLabel = (source, target, fallback = "flow") => {
  const sourceText = `${flowText(source?.label)} ${flowText(source?.sub)} ${flowText(source?.info)}`.toLowerCase();
  const targetText = `${flowText(target?.label)} ${flowText(target?.sub)} ${flowText(target?.info)}`.toLowerCase();
  if (/human|agent|transfer|escalat/.test(targetText)) return "fallback";
  if (/tool|function|action|executor|api/.test(targetText)) return "tool call";
  if (/knowledge|retriev|search|vector|document|rag/.test(targetText)) return "retrieve";
  if (/monitor|metric|trace|log|observ/.test(targetText)) return "telemetry";
  if (/audio|speech|telephony|call/.test(sourceText) && /audio|speech|telephony|call/.test(targetText)) return "audio";
  return fallback;
};

const inferFlowRole = (label = "") => {
  const text = flowText(label).toLowerCase();
  if (/log|metric|trace|telemetry|monitor|observ/.test(text)) return "observability";
  if (/retry|response|state retrieval|state update|error|timeout/.test(text)) return "feedback";
  if (/branch|fallback|escalat|human|tool|retriev|approved|denied|condition/.test(text)) return "branch";
  return "primary";
};

const isFlowObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const expandFlowEdge = (rawEdge) => {
  if (typeof rawEdge === "string") {
    const parts = rawEdge.split(/\s*(?:->|=>|→)\s*/);
    return parts.length >= 2
      ? parts.slice(0, -1).map((source, index) => ({ source, target: parts[index + 1], label: "flow", role: null }))
      : [];
  }
  if (!isFlowObject(rawEdge)) return [];

  const source = rawEdge.source ?? rawEdge.from ?? rawEdge.start ?? rawEdge.sourceId ?? rawEdge.fromId ?? rawEdge.upstream;
  const targetValue = rawEdge.target ?? rawEdge.to ?? rawEdge.end ?? rawEdge.targetId ?? rawEdge.toId ?? rawEdge.downstream ?? rawEdge.targets ?? rawEdge.outputs;
  const label = rawEdge.label ?? rawEdge.condition ?? rawEdge.when ?? rawEdge.branch ?? rawEdge.data?.label ?? rawEdge.metadata?.label ?? "flow";
  const role = rawEdge.role ?? rawEdge.data?.role ?? null;
  const targets = Array.isArray(targetValue) ? targetValue : [targetValue];
  const expanded = targets.filter((target) => target !== undefined && target !== null).map((target) => ({ source, target, label, role }));

  if (Array.isArray(rawEdge.branches)) {
    rawEdge.branches.forEach((branch) => {
      if (!isFlowObject(branch)) return;
      expanded.push({ source, target: branch.target ?? branch.to ?? branch.node ?? branch.id, label: branch.condition ?? branch.label ?? "branch", role: "branch" });
    });
  }
  return expanded;
};

const recoverFlowEdges = (nodes, existingEdges, description = "") => {
  const edges = [...existingEdges];
  const keys = new Set(edges.map((edge) => `${edge.source}->${edge.target}`));
  const degree = new Map(nodes.map((node) => [String(node.id), 0]));
  edges.forEach((edge) => {
    degree.set(edge.source, (degree.get(edge.source) || 0) + 1);
    degree.set(edge.target, (degree.get(edge.target) || 0) + 1);
  });

  const add = (sourceNode, targetNode, label, role = "primary") => {
    if (!sourceNode || !targetNode || sourceNode.id === targetNode.id) return;
    const key = `${sourceNode.id}->${targetNode.id}`;
    if (keys.has(key)) return;
    keys.add(key);
    edges.push({ source: String(sourceNode.id), target: String(targetNode.id), label: label || flowEdgeLabel(sourceNode, targetNode), role });
    degree.set(String(sourceNode.id), (degree.get(String(sourceNode.id)) || 0) + 1);
    degree.set(String(targetNode.id), (degree.get(String(targetNode.id)) || 0) + 1);
  };

  // A truncated model response commonly contains all nodes but no edges. Keep
  // the architecture usable by recovering an ordered backbone from the nodes.
  if (!edges.length) {
    for (let index = 0; index < nodes.length - 1; index += 1) add(nodes[index], nodes[index + 1], flowEdgeLabel(nodes[index], nodes[index + 1]));
  } else {
    // If the model returned only a few relationships, connect isolated nodes
    // to their nearest neighbor without overwriting the model's graph.
    nodes.forEach((node, index) => {
      if ((degree.get(String(node.id)) || 0) > 0) return;
      add(node, nodes[index + 1] || nodes[index - 1], "flow");
    });
  }

  const branchPattern = /branch|condition|decision|router|route|orchestrat|workflow|classif|intent|policy|guardrail|fallback|gateway|transfer/i;
  const branchNodes = nodes.filter((node) => branchPattern.test(`${flowText(node.label)} ${flowText(node.sub)} ${flowText(node.info)}`));
  branchNodes.forEach((branchNode) => {
    const outgoingCount = edges.filter((edge) => edge.source === String(branchNode.id)).length;
    if (outgoingCount >= 2) return;
    const index = nodes.indexOf(branchNode);
    const candidates = nodes.slice(index + 1, index + 5).filter((node) => node && node.id !== branchNode.id).slice(0, 2);
    candidates.forEach((targetNode, branchIndex) => {
      const text = `${flowText(targetNode.label)} ${flowText(targetNode.sub)} ${flowText(targetNode.info)}`.toLowerCase();
      const label = /human|agent|transfer|escalat|fallback/.test(text)
        ? "fallback"
        : /tool|function|action|executor|api/.test(text)
          ? "tool call"
          : /knowledge|retriev|search|vector|document|rag/.test(text)
            ? "retrieve"
            : branchIndex === 0 ? "primary" : `branch ${branchIndex + 1}`;
      add(branchNode, targetNode, label, "branch");
    });
  });

  // Make sure a prompt that explicitly asks for a decision tree gets at least
  // one fan-out even when the model omitted the decision node's edges.
  if (/if\s*-?else|branch|conditional|fallback|route|escalat/i.test(description) && nodes.length >= 3 && !branchNodes.length) {
    add(nodes[0], nodes[1], "primary", "branch");
    add(nodes[0], nodes[2], "fallback", "branch");
  }
  const nodeById = new Map(nodes.map((node) => [String(node.id), node]));
  const compacted = [];
  const bySource = new Map();
  edges.forEach((edge) => {
    if (!bySource.has(edge.source)) bySource.set(edge.source, []);
    bySource.get(edge.source).push(edge);
  });
  bySource.forEach((outgoing) => {
    const keepCount = Math.min(4, outgoing.length);
    outgoing
      .map((edge, index) => {
        const targetText = `${flowText(nodeById.get(edge.target)?.label)} ${flowText(nodeById.get(edge.target)?.sub)} ${flowText(nodeById.get(edge.target)?.info)}`.toLowerCase();
        const roleScore = edge.role === "primary" ? 5 : edge.role === "branch" ? 4 : edge.role === "feedback" ? 3 : 1;
        const targetScore = /human|transfer|escalat|llm|model|speech|audio|tool|retriev|knowledge|error|fallback/.test(targetText) ? 2 : 0;
        return { edge, index, score: roleScore + targetScore };
      })
      .sort((left, right) => right.score - left.score || left.index - right.index)
      .slice(0, keepCount)
      .sort((left, right) => left.index - right.index)
      .forEach(({ edge }) => compacted.push(edge));
  });
  const compactedKeys = new Set(compacted.map((edge) => `${edge.source}->${edge.target}`));
  const readableEdges = edges.filter((edge) => compactedKeys.has(`${edge.source}->${edge.target}`));
  const maxEdges = Math.max(nodes.length - 1, Math.min(24, nodes.length + 5));
  if (readableEdges.length <= maxEdges) return readableEdges;
  return readableEdges
    .map((edge, index) => ({ edge, index, score: edge.role === "primary" ? 4 : edge.role === "branch" ? 3 : edge.role === "feedback" ? 2 : 1 }))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, maxEdges)
    .sort((left, right) => left.index - right.index)
    .map(({ edge }) => edge);
};

export const normalizeFlowArchitecture = (architecture, description = "") => {
  const sourceNodes = Array.isArray(architecture?.nodes) ? architecture.nodes.filter(isFlowObject) : [];
  const nodes = sourceNodes.map((node, index) => ({ ...node, id: flowText(node.id) || flowSlug(node.label) || `node_${index + 1}` }));
  const aliases = new Map();
  const addAlias = (value, id) => {
    const text = flowText(value);
    if (!text) return;
    aliases.set(text, id);
    aliases.set(text.toLowerCase(), id);
    aliases.set(flowSlug(text), id);
  };
  nodes.forEach((node, index) => {
    const id = String(node.id);
    [node.id, index, node.label, node.name, node.title, node.sub].forEach((value) => addAlias(value, id));
  });

  const resolveEndpoint = (value) => {
    if (isFlowObject(value)) return resolveEndpoint(value.id ?? value.nodeId ?? value.label ?? value.name ?? value.title);
    const text = flowText(value);
    return aliases.get(text) || aliases.get(text.toLowerCase()) || aliases.get(flowSlug(text)) || null;
  };
  const rawEdges = [architecture?.edges, architecture?.connections, architecture?.links, architecture?.relationships]
    .filter(Array.isArray)
    .flatMap((collection) => collection.flatMap(expandFlowEdge));
  const edges = [];
  const edgeKeys = new Set();
  rawEdges.forEach((edge) => {
    const source = resolveEndpoint(edge.source);
    const target = resolveEndpoint(edge.target);
    if (!source || !target || source === target) return;
    const key = `${source}->${target}`;
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ source, target, label: flowText(edge.label) || "flow", role: edge.role || inferFlowRole(edge.label) });
  });

  return {
    ...architecture,
    nodes,
    edges: recoverFlowEdges(nodes, edges, description),
  };
};

export const generateFlowArchitecture = async (description, diagramFormat = "architecture") => {
const FORMAT_RULES = {
  architecture: "Show system boundaries, runtime services, data stores, security and observability. Prefer a dominant request path with supporting branches.",
  flowchart: "Model the procedure in order. Use decision nodes with clearly labelled yes/no or condition branches and terminal outcomes.",
  dataflow: "Emphasize data sources, transformations, movement, persistence and consumers. Every edge label must name the payload or data operation.",
  sequence: "Model participants or services as nodes and label edges with ordered message/action names. Keep one chronological interaction path, including failure or retry messages when material.",
  erd: "Model entities, attributes in each node subtitle, and relationships. Label relationship edges with cardinality such as 1:1, 1:N, or N:M and a relationship verb.",
  mindmap: "Start with one central idea and create concise themed branches. Use relationship labels sparingly and avoid forcing a linear request path.",
  journey: "Model the journey left to right with stages, user actions, touchpoints, emotions or friction, and opportunities. Label transitions with the action that moves the person forward.",
  wireframe: "Model screens, key interface regions, controls, and navigation links. Keep node labels concrete such as 'Checkout screen' or 'Primary CTA', and label edges with the user interaction.",
  state: "Model explicit states and labelled transitions, including initial, success, failure and recovery states. Use guards or triggering events on transition labels.",
  bpmn: "Model start/end events, activities, gateways, actors and exception paths. Label gateway branches with their conditions and make responsibilities concrete.",
  userflow: "Model user goals, screens, actions, decisions, alternate paths and completion outcomes. Keep the flow readable from entry to success or abandonment.",
  kubernetes: "Model clusters, namespaces, workloads, services, ingress, configuration, secrets, storage, scaling and observability boundaries.",
  terraform: "Model infrastructure modules, providers, resources, dependencies, remote state and environment boundaries. Label edges with dependency or data relationships.",
  network: "Model zones, networks, subnets, gateways, load balancers, compute and data tiers, trust boundaries, protocols and traffic direction.",
};
const formatRule = FORMAT_RULES[diagramFormat] || FORMAT_RULES.architecture;
const systemPrompt = `You are an expert GenAI system architect. Convert this natural language description into a ReactFlow ${diagramFormat} diagram.
Return ONLY a valid JSON object. No explanation.

Selected diagram format: ${diagramFormat}
Format-specific requirements: ${formatRule}

Architecture rules:
- Build a concrete end-to-end ${diagramFormat} from the requirements, not a generic chain of boxes.
- Return 6-18 nodes and connect the primary path plus the relationships that make the design understandable.
- Edges are mandatory: return at least one edge for every primary stage and at least 10 meaningful edges when the architecture has 8 or more nodes.
- Create real fan-out/fan-in paths for routers, orchestrators, classifiers, policy checks, if/else conditions, fallbacks, and human escalation. A branching node should have 2-4 outgoing edges when the requirements imply multiple outcomes.
- Prefer one dominant left-to-right primary path. Keep supporting systems as short side branches that rejoin the primary path; do not connect every node to every other node.
- Return no more than 24 edges. Remove redundant, duplicate, and low-value telemetry links; observability should usually be a single branch from the orchestrator or service boundary.
- Use edge roles: "primary" for the main path, "branch" for conditional/tool/escalation paths, "feedback" for retries or state responses, and "observability" for logs and metrics.
- Every edge must use the exact IDs from the nodes array. Put the path condition in the edge label, such as "approved", "fallback", "tool call", "no match", or "human escalation".
- Never return an empty edges array. If a relationship is implied by the prompt, model it explicitly.
- Every node label must be a descriptive 2-6 word component name. Never use one-letter labels, abbreviations such as "C" or "R", or generic repeated labels.
- Include the components, stages, relationships, constraints, and supporting details that the chosen format requires. For architecture diagrams, include runtime stages, integrations, failure boundaries, state stores, security, and observability as appropriate.
- When the request calls for frames, regions, zones, boundaries, lanes, VPCs, tiers, hot/warm/cold paths, or grouped sections, return 2-4 clearly named regions only. Each node ID may belong to one region only; every region must contain at least two nodes; never create nested or overlapping regions.
- When the request asks for icon-only nodes, use provider-specific component names where possible; the canvas will render their service icon without a card.
- For voice/contact-center prompts, explicitly model telephony ingress, streaming audio/WebSocket handling, VAD or barge-in, STT, conversation orchestration, session state, LLM/tool execution, RAG when requested, TTS, human transfer, call summary, and monitoring.

Schema:
{
  "name": "short architecture name",
  "description": "one sentence summary",
  "diagramFormat": "${diagramFormat}",
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
      "label": "data type or condition",
      "role": "primary|branch|feedback|observability"
    }
  ],
  "regions": [
    { "label": "Private application VPC", "subtitle": "optional short context", "nodeIds": ["node_id_1", "node_id_2"], "color": "#f59e0b" }
  ]
}`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Target description: ${description}` }
    ];
    const raw = await callAI(messages, 2600, 0.2, true);
    const clean = extractJSON(raw);

    try {
      const parsed = parseSafety(clean, raw);
      if (!Array.isArray(parsed?.nodes)) throw new Error("AI architecture response is missing nodes.");
      return normalizeFlowArchitecture(parsed, description);
    } catch (parseError) {
      // Models occasionally omit a comma or add a partial JSON fragment even
      // when responseMimeType is JSON. Give the same provider one bounded,
      // JSON-only repair pass before surfacing an error to the playground.
      const repairMessages = [
        {
          role: "system",
          content: `${systemPrompt}\nYou are repairing an invalid response. Return ONLY corrected valid JSON. Preserve the architecture and schema. Do not add markdown or commentary.`,
        },
        {
          role: "user",
          content: `Repair this malformed architecture JSON and return only valid JSON:\n${clean}`,
        },
      ];
      const repairedRaw = await callAI(repairMessages, 2600, 0.05, true);
      const repaired = parseSafety(extractJSON(repairedRaw), repairedRaw);
      if (!Array.isArray(repaired?.nodes)) throw parseError;
      return normalizeFlowArchitecture(repaired, description);
    }
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

// ─── Public: Quiz Chatbot ──────────────────────────────────────────────────
export const askQuizBot = async (questionContext, conversationHistory, newQuery) => {
  const systemPrompt = `You are an expert AI tutor assisting a student taking a practice quiz.
Here is the context of the current question they are looking at:
Question: ${questionContext.q}
Options: ${JSON.stringify(questionContext.options)}
Correct Answer(s): ${JSON.stringify(questionContext.answer)}
Explanation: ${questionContext.explanation || "None provided"}

Your goal is to answer the student's question clearly, concisely, and accurately based on this context. 
If they ask for a hint, provide a subtle nudge without giving away the answer directly.
If they ask why an answer is wrong, explain it based on the concepts involved.
Maintain an encouraging and educational tone.`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: "user", content: newQuery }
    ];
    
    // Using callAI from the shared helper
    return await callAI(messages, 1000, 0.6, false);
  } catch (error) {
    console.error("Quiz Chatbot Error:", error);
    throw new Error("Failed to get answer from AI tutor.");
  }
};

// ─── Public: Interview Prep Chatbot ──────────────────────────────────────────
// Mirrors askQuizBot's pattern: system prompt carries the context of
// whichever lesson/question the learner currently has open, so follow-up
// questions ("why is this the answer?", "give me a simpler example") stay
// grounded in that specific interview question rather than answering blind.
export const askInterviewPrepBot = async (lessonContext, conversationHistory, newQuery, extraContext = {}) => {
  const { webResults = [], courseNotes = [] } = extraContext;

  const webSection = webResults.length
    ? `\n\nRECENT WEB SEARCH RESULTS (use these for anything current/factual — cite the source title inline when you use one, and note if a result seems outdated or irrelevant):\n${webResults.map((r, i) => `[${i + 1}] ${r.title} (${r.url})\n${r.content}`).join("\n\n")}`
    : "";

  const notesSection = courseNotes.length
    ? `\n\nSTUDENT'S OWN COURSE NOTES (from their curriculum — prioritize connecting the answer back to concepts they've already written about here):\n${courseNotes.map((n) => `From "${n.moduleTitle}":\n${n.text}`).join("\n\n")}`
    : "";

  const systemPrompt = `You are an expert Senior Data Scientist / ML Engineer acting as an interview prep coach.
Here is the interview question the student currently has open:

Course: ${lessonContext.courseTitle}
Chapter: ${lessonContext.chapterTitle}
Question: ${lessonContext.lessonTitle}
Reference Answer: ${lessonContext.answerText || "None provided"}
${webSection}${notesSection}

Your goal is to help the student truly understand this question, not just read the
reference answer. Rules:
1. Answer clearly and concisely, grounded in the reference answer above — don't contradict it.
2. If web search results are provided above, only use them when they add real value
   (e.g. a recent development, a current best practice, a real-world example) — don't
   force them in if the reference answer already covers it fully.
3. If course notes are provided above, prefer connecting your answer to the student's
   own notes over generic explanations — it reinforces what they've already studied.
4. If they ask for a simpler explanation, explain it at a beginner level first, then add depth.
5. If they ask a follow-up an interviewer might realistically ask next, answer it directly.
6. If they ask for a hint instead of the full answer, nudge them without giving everything away.
7. If they ask something unrelated to this question or general interview strategy, gently
   steer back to the topic at hand.
Maintain an encouraging, senior-mentor tone.`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: "user", content: newQuery }
    ];

    return await callAI(messages, 1200, 0.6, false);
  } catch (error) {
    console.error("Interview Prep Chatbot Error:", error);
    throw new Error("Failed to get answer from AI tutor.");
  }
};

// ─── Public: Onboarding Chatbot ──────────────────────────────────────────────
// Stage 1 — ONE LLM call. Given the user's onboarding answers plus compact
// catalogs (roadmaps, sidebar sections, manual categories, reference tags),
// ask the model to pick broad recommendations. Uses callAI so it automatically
// follows whatever provider (Gemini or Azure OpenAI) is currently active —
// same fallback logic every other generator in this file already uses.
//
// Stage 2 (matchManualAndReferenceDetails, below) resolves those broad picks
// down to specific manual guides / reference sheets entirely client-side —
// no second API call, so onboarding always costs exactly one LLM request.
export const generateOnboardingRecommendation = async (answers, catalogs) => {
  const { roadmapCatalog, sectionCatalog, manualCategoryCatalog, referenceTagCatalog } = catalogs;

  const systemPrompt = `You are the onboarding guide for GenAI Academy, an AI/ML learning platform.
A new user just answered a short questionnaire. Based on their answers, recommend where they
should start.

AVAILABLE ROADMAPS:
${JSON.stringify(roadmapCatalog)}

AVAILABLE SIDEBAR SECTIONS:
${JSON.stringify(sectionCatalog)}

AVAILABLE MANUAL CATEGORIES (long-form guides, pick 1-3 most relevant):
${JSON.stringify(manualCategoryCatalog)}

AVAILABLE REFERENCE TAGS (quick cheat sheets, pick 1-3 most relevant):
${JSON.stringify(referenceTagCatalog)}

Rules:
1. "recommendedRoadmap" MUST be exactly one "id" value from AVAILABLE ROADMAPS.
2. "sections" MUST use exactly the "id" values from AVAILABLE SIDEBAR SECTIONS. Pick 2-4 sections.
3. "manualCategories" MUST use exactly the "slug" values from AVAILABLE MANUAL CATEGORIES. Pick 1-3.
4. "referenceTags" MUST use exactly values from AVAILABLE REFERENCE TAGS. Pick 1-3.
5. Never invent an id/slug/tag that isn't in the lists above.
6. "message" should be a short (1-2 sentence), warm, direct explanation of the recommendation.
7. Return ONLY valid JSON, no markdown fences, no explanation outside the JSON.

Schema:
{
  "message": string,
  "recommendedRoadmap": string,
  "sections": [{"sectionId": string, "reason": string}],
  "manualCategories": [string],
  "referenceTags": [string]
}`;

  const userMessage = `User's onboarding answers:\n${JSON.stringify(answers, null, 2)}`;

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ];
    const raw = await callAI(messages, 1024, 0.4, true);
    const parsed = JSON.parse(extractJSON(raw));

    // Defensive defaults — never let a malformed response crash the UI.
    return {
      message: typeof parsed.message === "string" ? parsed.message : "Here's where I'd start:",
      recommendedRoadmap: typeof parsed.recommendedRoadmap === "string" ? parsed.recommendedRoadmap : null,
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
      manualCategories: Array.isArray(parsed.manualCategories) ? parsed.manualCategories : [],
      referenceTags: Array.isArray(parsed.referenceTags) ? parsed.referenceTags : [],
    };
  } catch (error) {
    console.error("Onboarding Recommendation Error:", error);
    throw new Error("Couldn't generate a recommendation right now. Please try again.");
  }
};

// Stage 2 — local keyword matching, no API call.
// Takes the broad manualCategories/referenceTags picks from Stage 1 and the
// user's raw answers, and finds specific guides/sheets to deep-link to.
// manualStructure / referenceStructure are passed in (rather than imported
// here) so this stays a pure function that's easy to test independently.
const STOPWORDS = new Set(["a", "an", "the", "and", "or", "but", "to", "of", "in", "on", "for", "with", "i", "want", "learn", "get", "good", "at", "my", "is", "am", "be", "do"]);

const tokenize = (text) =>
  String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

const scoreOverlap = (keywords, text) => {
  const textTokens = new Set(tokenize(text));
  let score = 0;
  for (const kw of keywords) {
    if (textTokens.has(kw)) score += 1;
  }
  return score;
};

export const matchManualAndReferenceDetails = (
  manualCategorySlugs,
  referenceTags,
  answers,
  manualStructure,
  referenceStructure
) => {
  const answerText = Object.values(answers || {}).join(" ");
  const keywords = tokenize(answerText);

  // Manual: search guides within the LLM-picked categories only.
  const manualMatches = [];
  for (const catSlug of manualCategorySlugs || []) {
    const category = (manualStructure || []).find((c) => c.slug === catSlug);
    if (!category) continue;

    const scoredGuides = (category.guides || [])
      .map((guide) => ({
        guide,
        score: scoreOverlap(keywords, `${guide.title} ${guide.summary}`),
      }))
      .sort((a, b) => b.score - a.score);

    // Take the best guide from each matched category (falls back to the
    // first guide if nothing scored, so we still surface something relevant
    // to the category itself).
    const best = scoredGuides[0]?.guide || category.guides?.[0];
    if (best && best.phases && best.phases.length > 0) {
      const firstPhase = best.phases[0];
      manualMatches.push({
        categorySlug: category.slug,
        guideSlug: best.slug,
        phaseSlug: firstPhase.slug,
        filePath: firstPhase.filePath,
        title: best.title,
      });
    }
  }

  // Reference: search sheets whose tags overlap the LLM-picked tags, ranked
  // by keyword relevance to the user's own answers.
  const taggedSheets = (referenceStructure || []).filter((sheet) =>
    (sheet.tags || []).some((t) => (referenceTags || []).includes(t))
  );
  const referenceMatches = taggedSheets
    .map((sheet) => ({
      sheet,
      score: scoreOverlap(keywords, `${sheet.title} ${sheet.intro}`),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((m) => m.sheet);

  return { manualMatches, referenceMatches };
};
