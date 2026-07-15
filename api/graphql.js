import { createClient } from '@supabase/supabase-js';

// ─── Supabase Admin Client ───────────────────────────────────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://twcsujjshudwgpihkwyz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y3N1ampzaHVkd2dwaWhrd3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NjQ4MTcsImV4cCI6MjA5MDM0MDgxN30.mG65e8fpfquKR8r_GjK_IxSDKPnW6ij80nT_Fknyq80';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// ─── Mock responses for queries the client always needs ─────────────────────
function mockServerConfig() {
  return {
    data: {
      serverConfig: {
        version: '0.27.0',
        features: ['LocalWorkspace'],
        initialized: true,
        name: 'Workspace Notes',
        oauthProviders: []
      }
    }
  };
}

function mockCurrentUser() {
  return {
    data: {
      currentUser: {
        id: 'local-user',
        name: 'Local User',
        email: 'local@workspace.notes',
        emailVerified: true,
        hasPassword: false,
        copilot: {
          chats: { edges: [] },
          contexts: []
        }
      }
    }
  };
}

// ─── Session DB helpers ──────────────────────────────────────────────────────
async function createSession({ workspaceId, docId, action, model, promptName }) {
  const sessionId = uuid();
  await supabase.from('copilot_sessions').insert({
    session_id: sessionId,
    workspace_id: workspaceId || 'local',
    doc_id: docId || null,
    action: action || promptName || null,
    model: model || null,
    messages: []
  });
  return sessionId;
}

async function getSession(sessionId) {
  const { data } = await supabase
    .from('copilot_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .maybeSingle();
  return data;
}

async function appendMessage(sessionId, message) {
  const session = await getSession(sessionId);
  if (!session) return;
  const messages = [...(session.messages || []), message];
  await supabase
    .from('copilot_sessions')
    .update({ messages, updated_at: new Date().toISOString() })
    .eq('session_id', sessionId);
}

// ─── GraphQL Operation Dispatcher ───────────────────────────────────────────
async function handleOperation(operationName, variables) {
  // ── Session operations ──
  if (
    operationName === 'CreateCopilotSession' ||
    operationName === 'createCopilotSession'
  ) {
    const opts = variables?.options || {};
    const sessionId = await createSession(opts);
    return { data: { createCopilotSession: sessionId } };
  }

  if (
    operationName === 'CreateCopilotSessionWithHistory' ||
    operationName === 'createCopilotSessionWithHistory'
  ) {
    const opts = variables?.options || {};
    const sessionId = await createSession(opts);
    return { data: { createCopilotSessionWithHistory: sessionId } };
  }

  if (
    operationName === 'UpdateCopilotSession' ||
    operationName === 'updateCopilotSession'
  ) {
    const opts = variables?.options || {};
    if (opts.sessionId) {
      await supabase
        .from('copilot_sessions')
        .update({ action: opts.action, model: opts.model, updated_at: new Date().toISOString() })
        .eq('session_id', opts.sessionId);
    }
    return { data: { updateCopilotSession: opts.sessionId } };
  }

  if (
    operationName === 'ForkCopilotSession' ||
    operationName === 'forkCopilotSession'
  ) {
    const opts = variables?.options || {};
    const newSessionId = uuid();
    if (opts.sessionId) {
      const orig = await getSession(opts.sessionId);
      if (orig) {
        await supabase.from('copilot_sessions').insert({
          session_id: newSessionId,
          workspace_id: orig.workspace_id,
          doc_id: orig.doc_id,
          action: orig.action,
          model: orig.model,
          messages: opts.latestMessageId
            ? (orig.messages || []).slice(
                0,
                (orig.messages || []).findIndex(m => m.id === opts.latestMessageId) + 1
              )
            : (orig.messages || [])
        });
      }
    }
    return { data: { forkCopilotSession: newSessionId } };
  }

  if (
    operationName === 'CleanupCopilotSession' ||
    operationName === 'cleanupCopilotSession'
  ) {
    const opts = variables?.options || {};
    const ids = opts.sessionIds || [];
    if (ids.length) {
      await supabase.from('copilot_sessions').delete().in('session_id', ids);
    }
    return { data: { cleanupCopilotSession: ids } };
  }

  // ── Message operations ──
  if (
    operationName === 'CreateCopilotMessage' ||
    operationName === 'createCopilotMessage'
  ) {
    const opts = variables?.options || {};
    const msgId = uuid();
    if (opts.sessionId) {
      const msgRecord = {
        id: msgId,
        role: 'user',
        content: opts.content || '',
        attachments: opts.attachments || [],
        createdAt: new Date().toISOString()
      };
      await appendMessage(opts.sessionId, msgRecord);
    }
    return { data: { createCopilotMessage: msgId } };
  }

  // ── Context operations (mocked, not needed for basic AI) ──
  if (operationName === 'CreateCopilotContext' || operationName === 'createCopilotContext') {
    return { data: { createCopilotContext: uuid() } };
  }
  if (operationName === 'AddContextDoc' || operationName === 'addContextDoc') {
    return { data: { addContextDoc: uuid() } };
  }
  if (operationName === 'AddContextFile' || operationName === 'addContextFile') {
    return { data: { addContextFile: uuid() } };
  }
  if (operationName === 'RemoveContextDoc' || operationName === 'removeContextDoc') {
    return { data: { removeContextDoc: true } };
  }
  if (operationName === 'RemoveContextFile' || operationName === 'removeContextFile') {
    return { data: { removeContextFile: true } };
  }
  if (operationName === 'AddContextBlob' || operationName === 'addContextBlob') {
    return { data: { addContextBlob: uuid() } };
  }
  if (operationName === 'RemoveContextBlob' || operationName === 'removeContextBlob') {
    return { data: { removeContextBlob: true } };
  }
  if (operationName === 'AddContextCategory' || operationName === 'addContextCategory') {
    return { data: { addContextCategory: uuid() } };
  }
  if (operationName === 'RemoveContextCategory' || operationName === 'removeContextCategory') {
    return { data: { removeContextCategory: true } };
  }

  // ── Query operations ──
  if (
    operationName === 'GetCopilotSessions' ||
    operationName === 'getCopilotSessions'
  ) {
    const { workspaceId, docId } = variables || {};
    let query = supabase
      .from('copilot_sessions')
      .select('*')
      .eq('workspace_id', workspaceId || 'local')
      .order('created_at', { ascending: false })
      .limit(20);
    if (docId) query = query.eq('doc_id', docId);
    const { data: rows = [] } = await query;
    return {
      data: {
        currentUser: {
          copilot: {
            chats: {
              edges: rows.map(r => ({
                node: {
                  sessionId: r.session_id,
                  docId: r.doc_id,
                  messages: r.messages || [],
                  createdAt: r.created_at
                }
              }))
            }
          }
        }
      }
    };
  }

  if (
    operationName === 'GetCopilotSession' ||
    operationName === 'getCopilotSession'
  ) {
    const { sessionId } = variables || {};
    const row = sessionId ? await getSession(sessionId) : null;
    return {
      data: {
        currentUser: {
          copilot: {
            chats: {
              edges: row ? [{
                node: {
                  sessionId: row.session_id,
                  docId: row.doc_id,
                  messages: row.messages || [],
                  createdAt: row.created_at
                }
              }] : []
            }
          }
        }
      }
    };
  }

  if (
    operationName === 'GetCopilotHistories' ||
    operationName === 'getCopilotHistories' ||
    operationName === 'GetCopilotRecentSessions' ||
    operationName === 'getCopilotRecentSessions' ||
    operationName === 'GetCopilotHistoryIds' ||
    operationName === 'getCopilotHistoryIds'
  ) {
    return {
      data: {
        currentUser: {
          copilot: { chats: { edges: [] } }
        }
      }
    };
  }

  // Context queries
  if (
    operationName === 'ListContext' ||
    operationName === 'listContext' ||
    operationName === 'ListContextObject' ||
    operationName === 'listContextObject' ||
    operationName === 'MatchContext' ||
    operationName === 'matchContext'
  ) {
    return {
      data: {
        currentUser: {
          copilot: { contexts: [] }
        }
      }
    };
  }

  // Server config
  if (
    operationName === 'GetServerConfig' ||
    operationName === 'serverConfig' ||
    operationName === 'ServerConfig'
  ) {
    return mockServerConfig();
  }

  // Current user
  if (
    operationName === 'GetCurrentUser' ||
    operationName === 'currentUser' ||
    operationName === 'me'
  ) {
    return mockCurrentUser();
  }

  // Fallback: return empty success
  return { data: {} };
}

// ─── Multipart form-data parsing (graphql-multipart-request-spec) ───────────
// AFFiNE's client sends any mutation that can carry file uploads (e.g.
// createCopilotMessage, even with zero attachments) as multipart/form-data
// instead of JSON. Without parsing this, the request body looks empty and
// the operation silently falls through to the no-op fallback.
function setByPath(obj, path, value) {
  const keys = path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (cur[key] === undefined || cur[key] === null) {
      const nextKey = keys[i + 1];
      cur[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    cur = cur[key];
  }
  cur[keys[keys.length - 1]] = value;
}

function parseMultipartGraphQL(buffer, contentType) {
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/);
  const boundary = boundaryMatch ? (boundaryMatch[1] || boundaryMatch[2]).trim() : null;
  if (!boundary) return {};

  const boundaryBuf = Buffer.from(`--${boundary}`);
  const parts = [];
  let start = buffer.indexOf(boundaryBuf);
  while (start !== -1) {
    const next = buffer.indexOf(boundaryBuf, start + boundaryBuf.length);
    if (next === -1) break;
    parts.push(buffer.slice(start + boundaryBuf.length, next));
    start = next;
  }

  const fields = {};
  const files = {};

  for (let part of parts) {
    if (part.slice(0, 2).toString('utf8') === '\r\n') part = part.slice(2);
    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd === -1) continue;
    const headerText = part.slice(0, headerEnd).toString('utf8');
    let content = part.slice(headerEnd + 4);
    if (content.slice(-2).toString('utf8') === '\r\n') content = content.slice(0, -2);

    const nameMatch = headerText.match(/name="([^"]+)"/);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    const filenameMatch = headerText.match(/filename="([^"]*)"/);

    if (filenameMatch) {
      const contentTypeMatch = headerText.match(/Content-Type:\s*([^\r\n]+)/i);
      files[name] = {
        filename: filenameMatch[1],
        contentType: contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream',
        data: content
      };
    } else {
      fields[name] = content.toString('utf8');
    }
  }

  const operations = fields.operations ? JSON.parse(fields.operations) : {};
  const map = fields.map ? JSON.parse(fields.map) : {};

  for (const [fileKey, paths] of Object.entries(map)) {
    const file = files[fileKey];
    if (!file) continue;
    for (const p of paths) {
      setByPath(operations, p, file);
    }
  }

  return {
    operationName: operations.name,
    query: operations.query,
    variables: operations.variables
  };
}

// ─── Main Handler ────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-affine-version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Collect body for POST
  let body = {};
  if (req.method === 'POST') {
    const contentType = req.headers['content-type'] || '';
    try {
      if (typeof req.body === 'object' && req.body !== null && !Buffer.isBuffer(req.body)) {
        body = req.body;
      } else {
        const chunks = await new Promise((resolve, reject) => {
          const acc = [];
          req.on('data', chunk => acc.push(chunk));
          req.on('end', () => resolve(acc));
          req.on('error', reject);
        });
        const rawBody = Buffer.concat(chunks);

        if (contentType.includes('multipart/form-data')) {
          body = parseMultipartGraphQL(rawBody, contentType);
        } else {
          const text = rawBody.toString('utf8');
          body = text ? JSON.parse(text) : {};
        }
      }
    } catch (err) {
      console.error('[graphql handler] Body parse error:', err);
      body = {};
    }
  }

  const { operationName, query: gqlQuery, variables } = body;

  // Detect operation from the query string if operationName is absent
  let opName = operationName;
  if (!opName && gqlQuery) {
    const m = gqlQuery.match(/(?:mutation|query)\s+(\w+)/i);
    if (m) opName = m[1];
  }

  try {
    const result = await handleOperation(opName, variables);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[graphql handler] Error:', err);
    return res.status(200).json({ data: {}, errors: [{ message: err.message }] });
  }
}
