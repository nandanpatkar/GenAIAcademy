/*
 * Browser half of the study assistant.
 *
 * Talks only to this site's own `/api/chat`, never to the model provider — the
 * API key lives in server/chat-proxy.mjs and must stay there. What comes back
 * is a Server-Sent Events stream of OpenAI-style chunks; this module turns it
 * into `onDelta(text)` calls as the words arrive.
 */

const ENDPOINT = '/api/chat';

/* One SSE frame is `data: {...}` lines separated by a blank line. Chunks arrive
   split at arbitrary byte offsets, so the trailing partial frame is handed back
   to be prepended to whatever arrives next. */
function splitFrames(buffer) {
  const frames = [];
  let rest = buffer.replace(/\r\n/g, '\n');
  let boundary = rest.indexOf('\n\n');

  while (boundary !== -1) {
    frames.push(rest.slice(0, boundary));
    rest = rest.slice(boundary + 2);
    boundary = rest.indexOf('\n\n');
  }

  return { frames, rest };
}

/* Returns both kinds of delta a frame can carry.
 *
 * Reasoning models (kimi-k3 among them) stream a long `reasoning_content`
 * monologue before the first token of the actual answer. That text is not the
 * reply and must not be shown as one, but it is proof the model is working —
 * which is worth surfacing when the wait runs to minutes. */
function readDelta(frame) {
  let content = '';
  let reasoning = '';

  for (const line of frame.split('\n')) {
    if (!line.startsWith('data:')) continue;

    const data = line.slice(5).trim();
    if (data === '' || data === '[DONE]') continue;

    try {
      const chunk = JSON.parse(data);
      /* The final usage-only chunk carries an empty `choices` array. */
      const delta = chunk.choices?.[0]?.delta;
      if (delta?.content) content += delta.content;
      if (delta?.reasoning_content) reasoning += delta.reasoning_content;
    } catch {
      /* A frame that is not JSON is not something this client can use. */
    }
  }

  return { content, reasoning };
}

async function readError(response) {
  try {
    const payload = await response.json();
    if (payload?.error) return payload.error;
  } catch {
    /* Fall through to the generic message. */
  }
  return `The assistant is unavailable (HTTP ${response.status}).`;
}

/**
 * Stream one assistant reply.
 *
 * @param {object} options
 * @param {Array<{role: 'user'|'assistant', content: string}>} options.messages
 *   Conversation so far, oldest first. The system prompt is added server-side.
 * @param {string} [options.context] What the learner is currently viewing.
 * @param {(text: string) => void} options.onDelta Called per token batch of the
 *   answer itself.
 * @param {() => void} [options.onReasoning] Called when the model streams
 *   internal reasoning, which precedes the answer on reasoning models.
 * @param {AbortSignal} [options.signal] Aborts the request.
 * @returns {Promise<string>} The full reply text.
 * @throws {Error} With a message safe to show the learner.
 */
export async function streamChat({ messages, context, onDelta, onReasoning, signal }) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages, context }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(await readError(response));
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const parts = [];
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const { frames, rest } = splitFrames(buffer);
    buffer = rest;

    for (const frame of frames) {
      const { content, reasoning } = readDelta(frame);
      if (reasoning) onReasoning?.();
      if (content) {
        parts.push(content);
        onDelta?.(content);
      }
    }
  }

  /* A stream that ends without a trailing blank line still has one usable
     frame left in the buffer. */
  const tail = readDelta(buffer);
  if (tail.content) {
    parts.push(tail.content);
    onDelta?.(tail.content);
  }

  return parts.join('');
}
