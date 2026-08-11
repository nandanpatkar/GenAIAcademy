import { createClient } from '@supabase/supabase-js';

// ─── Supabase Client ─────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://twcsujjshudwgpihkwyz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y3N1ampzaHVkd2dwaWhrd3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NjQ4MTcsImV4cCI6MjA5MDM0MDgxN30.mG65e8fpfquKR8r_GjK_IxSDKPnW6ij80nT_Fknyq80';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Resolve session messages from DB ────────────────────────────────────────
async function getSessionData(sessionId) {
  const { data } = await supabase
    .from('copilot_sessions')
    .select('messages, action, model')
    .eq('session_id', sessionId)
    .maybeSingle();
  return data || { messages: [], action: null, model: null };
}

// ─── Global AI config (same source Admin Panel / Settings write to) ─────────
// AdminManagement.jsx upserts provider/endpoint/key into user_curriculum.paths_data
// for the shared "global" row; every AI feature in the app reads from there.
async function getGlobalAIConfig() {
  const { data } = await supabase
    .from('user_curriculum')
    .select('paths_data')
    .eq('id', '00000000-0000-0000-0000-000000000000')
    .maybeSingle();
  return data?.paths_data || {};
}

// ─── Per-visitor AI config (bring-your-own-key) ──────────────────────────────
// AuthContext.jsx mirrors a signed-in visitor's own Settings-panel key into
// cookies (see AI_SETTINGS_COOKIES there) since the embedded editor's own
// fetch/EventSource calls can't carry custom headers. Cookies ride along on
// same-origin requests automatically, so this is the one channel available
// to let a visitor's own key reach this server-side handler.
function getCookieAIConfig(req) {
  const header = req.headers?.cookie || '';
  const cookies = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  }
  return {
    geminiKey: cookies['genai_gemini_key'] || '',
    aiProvider: cookies['genai_ai_provider'] || '',
    azureEndpoint: cookies['genai_azure_endpoint'] || '',
    azureKey: cookies['genai_azure_key'] || '',
    apiBeamEndpoint: cookies['genai_apibeam_endpoint'] || '',
    apiBeamModel: cookies['genai_apibeam_model'] || '',
  };
}

// ─── SSE Helpers ─────────────────────────────────────────────────────────────
// AFFiNE's event-source.ts listens for named SSE events:
//   - event: message  → data is raw text chunk (NOT JSON)
//   - event: error    → data is JSON {"status": <number>}
// Stream ends when EventSource closes (no explicit finish event)

function sendMessageChunk(res, text) {
  // Send a named 'message' event — AFFiNE reads event.data as plain text
  res.write(`event: message\ndata: ${text}\n\n`);
}

function sendErrorEvent(res, status = 500) {
  // AFFiNE expects error event with JSON {"status": number}
  res.write(`event: error\ndata: ${JSON.stringify({ status })}\n\n`);
}

// ─── AI Providers ─────────────────────────────────────────────────────────────
async function* streamGemini(messages, systemPrompt, apiKey) {
  const model = 'gemini-2.0-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`;

  // Build conversation history for multi-turn context
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content || '' }]
  }));

  const body = {
    system_instruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
    contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini error ${response.status}: ${err}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const raw = line.slice(5).trim();
      if (!raw || raw === '[DONE]') continue;
      try {
        const parsed = JSON.parse(raw);
        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) yield text;
      } catch {
        // skip malformed lines
      }
    }
  }
}

async function* streamAzure(messages, systemPrompt, endpoint, apiKey, deployment, apiVersion) {
  const url = `${endpoint.replace(/\/+$/, '')}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const chatMessages = [];
  if (systemPrompt) chatMessages.push({ role: 'system', content: systemPrompt });
  for (const m of messages) {
    chatMessages.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content || '' });
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({ messages: chatMessages, stream: true, temperature: 0.7, max_tokens: 4096 })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Azure error ${response.status}: ${err}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const raw = line.slice(5).trim();
      if (!raw || raw === '[DONE]') continue;
      try {
        const parsed = JSON.parse(raw);
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // skip malformed lines
      }
    }
  }
}

// ApiBeam completes requests through a browser extension and does not provide
// an SSE response. The Notes editor still receives a standard SSE stream: the
// completed reply is yielded as one chunk before the connection closes.
async function* streamApiBeam(messages, systemPrompt, endpoint, model) {
  let relay;
  try {
    relay = new URL(endpoint.replace(/\/+$/, ''));
  } catch {
    throw new Error('Invalid ApiBeam API URL. Add the full /app/<room-id> URL in Settings.');
  }

  // This handler runs on Vercel in production. Restrict the user-provided URL
  // to HTTPS so the server cannot be used to reach local or metadata services.
  if (relay.protocol !== 'https:') {
    throw new Error('ApiBeam API URL must use HTTPS for Workspace Notes.');
  }

  const chatMessages = [];
  if (systemPrompt) chatMessages.push({ role: 'system', content: systemPrompt });
  for (const message of messages) {
    chatMessages.push({ role: message.role === 'assistant' ? 'assistant' : 'user', content: message.content || '' });
  }

  let response;
  try {
    response = await fetch(`${relay.toString().replace(/\/+$/, '')}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'gpt-4o',
        messages: chatMessages,
        max_tokens: 4096,
        temperature: 0.7,
        stream: false,
      }),
    });
  } catch (error) {
    throw new Error(`Could not reach ApiBeam. Check that its relay and browser extension are connected. ${error.message || ''}`.trim());
  }

  const raw = await response.text();
  let data;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    if (response.ok && raw.trim()) {
      yield raw;
      return;
    }
    throw new Error(`ApiBeam returned an unexpected response (${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(data?.error?.message || data?.message || `ApiBeam error: ${response.status}`);
  }

  const content = typeof data === 'string'
    ? data
    : data?.choices?.[0]?.message?.content
      ?? data?.output?.[0]?.content?.[0]?.text
      ?? data?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('ApiBeam returned no assistant message. Make sure the extension is connected to a supported chat tab.');
  }
  yield content;
}

// ─── Prompt builder ──────────────────────────────────────────────────────────
function buildSystemPrompt(action) {
  if (!action) return 'You are a helpful AI assistant embedded in a note-taking application. Answer clearly and helpfully.';

  const a = action.toLowerCase();
  if (a.includes('summary') || a.includes('summarize'))
    return 'You are an expert summarizer. Summarize the provided content concisely and clearly.';
  if (a.includes('translate'))
    return 'You are a professional translator. Translate the provided text accurately, preserving tone and meaning.';
  if (a.includes('improve') || a.includes('rewrite') || a.includes('polish'))
    return 'You are a skilled writing editor. Improve the clarity, style, and quality of the provided text without changing its meaning.';
  if (a.includes('explain'))
    return 'You are a knowledgeable teacher. Explain the provided content clearly and thoroughly.';
  if (a.includes('mindmap') || a.includes('mind-map') || a.includes('outline') || a.includes('brainstorm'))
    return 'You are an expert at organizing information. Create a detailed mind map or outline from the provided content.';
  if (a.includes('code') || a.includes('debug') || a.includes('fix') || a.includes('refactor'))
    return 'You are an expert software engineer. Help with code analysis, debugging, and improvements.';
  if (a.includes('image') || a.includes('alt') || a.includes('caption'))
    return 'You are an expert at describing and analyzing images and visual content.';
  if (a.includes('chat') || a.includes('ask') || a.includes('search'))
    return 'You are a helpful and knowledgeable AI assistant. Answer questions thoughtfully and accurately.';

  return 'You are a helpful AI assistant embedded in a note-taking application. Answer clearly and helpfully.';
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const rawUrl = req.url || '';

  // Parse sessionId from URL patterns:
  //   /api/copilot/chat/{sessionId}/stream-object
  //   /api/copilot/chat/{sessionId}/images
  //   /api/copilot/actions/{sessionId}/stream
  const sessionMatch = rawUrl.match(/\/api\/copilot\/(?:chat|actions)\/([^/?]+)/);
  const sessionId = sessionMatch ? sessionMatch[1] : null;

  // Set up SSE headers immediately — EventSource requires a 200 with text/event-stream
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.statusCode = 200;

  if (!sessionId) {
    sendErrorEvent(res, 404);
    res.end();
    return;
  }

  // Get AI config. Priority: the visitor's own key (Settings panel, mirrored
  // into cookies by AuthContext.jsx) > the shared global config (Admin Panel,
  // stored in user_curriculum.paths_data) > environment variables.
  const cookieConfig = getCookieAIConfig(req);
  const globalConfig = await getGlobalAIConfig();

  const rawProvider = cookieConfig.aiProvider || globalConfig.aiProvider || process.env.AI_PROVIDER || process.env.VITE_AI_PROVIDER || 'gemini';
  const aiProvider = rawProvider === 'apibeam'
    ? 'apibeam'
    : (rawProvider === 'azure-openai' || rawProvider === 'azure') ? 'azure' : 'gemini';
  const geminiKey = cookieConfig.geminiKey || globalConfig.geminiKey || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  const azureEndpoint = cookieConfig.azureEndpoint || globalConfig.azureEndpoint || process.env.VITE_AZURE_OPENAI_ENDPOINT || '';
  const azureKey = cookieConfig.azureKey || globalConfig.azureKey || process.env.VITE_AZURE_OPENAI_KEY || '';
  const azureDeployment = process.env.VITE_AZURE_OPENAI_DEPLOYMENT || 'gpt-5.2';
  const azureApiVersion = process.env.VITE_AZURE_OPENAI_API_VERSION || '2024-02-15-preview';
  const apiBeamEndpoint = cookieConfig.apiBeamEndpoint;
  const apiBeamModel = cookieConfig.apiBeamModel || 'gpt-4o';

  const hasGemini = !!geminiKey && !geminiKey.includes('your-api-key');
  const hasAzure = !!(azureEndpoint && azureKey);
  const hasApiBeam = !!apiBeamEndpoint;

  if ((aiProvider === 'apibeam' && !hasApiBeam) || (!hasGemini && !hasAzure && !hasApiBeam)) {
    sendMessageChunk(res, aiProvider === 'apibeam'
      ? '⚠️ ApiBeam is not configured. In the GenAI Academy sidebar, save the full ApiBeam API URL from the extension Settings page.'
      : '⚠️ No AI provider configured. Please add a provider connection in the GenAI Academy sidebar.');
    res.end();
    return;
  }

  // Image generation — not supported locally
  if (rawUrl.includes('/images')) {
    sendMessageChunk(res, '⚠️ Image generation is not available in offline mode.');
    res.end();
    return;
  }

  // Fetch session from Supabase
  const session = await getSessionData(sessionId);
  const messages = session.messages || [];
  const systemPrompt = buildSystemPrompt(session.action);

  // If no messages at all, send a helpful fallback
  if (messages.length === 0 || !messages.some(m => m.role === 'user' && m.content)) {
    sendMessageChunk(res, 'Hello! I\'m your AI assistant. How can I help you?');
    res.end();
    return;
  }

  try {
    const effectiveProvider = aiProvider === 'apibeam' && hasApiBeam ? 'apibeam'
      : (aiProvider === 'azure' && hasAzure) ? 'azure'
        : hasGemini ? 'gemini'
          : 'azure';

    if (effectiveProvider === 'apibeam') {
      for await (const chunk of streamApiBeam(messages, systemPrompt, apiBeamEndpoint, apiBeamModel)) {
        sendMessageChunk(res, chunk);
      }
    } else if (effectiveProvider === 'gemini') {
      for await (const chunk of streamGemini(messages, systemPrompt, geminiKey)) {
        sendMessageChunk(res, chunk);
      }
    } else {
      for await (const chunk of streamAzure(messages, systemPrompt, azureEndpoint, azureKey, azureDeployment, azureApiVersion)) {
        sendMessageChunk(res, chunk);
      }
    }

    // Close the stream — AFFiNE detects end via EventSource 'error' with no data (natural close)
    res.end();
  } catch (err) {
    console.error('[copilot handler] Streaming error:', err);
    // Send error in AFFiNE's expected format: event: error, data: {"status": number}
    const status = err.message?.includes('429') ? 429 : 500;
    sendErrorEvent(res, status);
    res.end();
  }
}
