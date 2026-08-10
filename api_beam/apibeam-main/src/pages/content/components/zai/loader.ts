// z.ai SSE fetch interceptor -- injected into chat.z.ai page world
// z.ai SSE format (standard "data:" prefix):
//   data: {"type":"chat:completion","data":{"delta_content":"...","phase":"thinking"}}
//   data: {"type":"chat:completion","data":{"delta_content":"...","phase":"answer"}}
//   data: {"type":"chat:completion","data":{"phase":"done","done":true}}
(function () {
  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const response = await originalFetch(...args);

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/event-stream')) {
      return response;
    }

    const clone = response.clone();
    const reader = clone.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    let buffer = '';
    let fullAssistantMessage = '';

    async function readStream() {
      while (true) {
        if (!reader) return;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Split by double newline (SSE event separator)
        const parts = buffer.split(/\r?\n\r?\n/);
        buffer = parts.pop() as string;

        for (let part of parts) {
          part = part.trim();
          if (!part) continue;

          // Standard SSE: lines start with "data:"
          const lines = part.split(/\r?\n/);
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const dataStr = line.substring(5).trim(); // 'data:'.length === 5
            if (dataStr === '[DONE]') continue;

            try {
              const obj = JSON.parse(dataStr);

              // z.ai format: { type: "chat:completion", data: { delta_content: "...", phase: "..." } }
              if (obj.type === 'chat:completion' && obj.data) {
                // Collect deltas from any phase so we never miss the answer
                if (typeof obj.data.delta_content === 'string') {
                  fullAssistantMessage += obj.data.delta_content;
                }
                // If phase is "done", stream is complete
                if (obj.data.phase === 'done' || obj.data.done === true) {
                  console.log('[ApiBeam z.ai] Stream complete');
                }
              }
            } catch {
              // skip non-JSON lines
            }
          }
        }
      }

      console.log('[ApiBeam z.ai] Captured response:', fullAssistantMessage.substring(0, 200));

      function extractAndParseJson(str: string, fallback: any = null) {
        if (typeof str !== 'string') return fallback;
        const jsonMatch = str.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return fallback;
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          return fallback;
        }
      }

      const parsed = extractAndParseJson(fullAssistantMessage);
      window.postMessage(
        { data: parsed ?? fullAssistantMessage },
        '*'
      );
    }

    readStream().catch((err) => console.error('[ApiBeam z.ai] SSE read error:', err));
    return response;
  };
})();
