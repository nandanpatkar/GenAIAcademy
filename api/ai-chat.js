const MAX_REQUEST_BYTES = 1_000_000;

const isPrivateIpv4 = (hostname) => {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;

  const [first, second] = parts;
  return first === 0
    || first === 10
    || first === 127
    || first === 169 && second === 254
    || first === 172 && second >= 16 && second <= 31
    || first === 192 && second === 168;
};

const isPrivateIpv6 = (hostname) => {
  if (!hostname.startsWith("[") || !hostname.endsWith("]")) return false;
  const address = hostname.slice(1, -1).toLowerCase();
  return address === "::1"
    || address.startsWith("fe80:")
    || address.startsWith("fc")
    || address.startsWith("fd");
};

const getRequestBody = (req) => {
  if (typeof req.body === "string") return JSON.parse(req.body);
  return req.body || {};
};

const getChatCompletionUrl = (endpoint) => {
  if (typeof endpoint !== "string" || !endpoint.trim()) {
    throw new Error("A provider Base URL is required.");
  }

  let baseUrl;
  try {
    baseUrl = new URL(endpoint.trim());
  } catch {
    throw new Error("The provider Base URL is invalid.");
  }

  const hostname = baseUrl.hostname.toLowerCase();
  if (
    baseUrl.protocol !== "https:"
    || baseUrl.username
    || baseUrl.password
    || baseUrl.search
    || baseUrl.hash
    || hostname === "localhost"
    || hostname.endsWith(".localhost")
    || isPrivateIpv6(hostname)
    || isPrivateIpv4(hostname)
  ) {
    throw new Error("The provider Base URL must be a public HTTPS endpoint.");
  }

  baseUrl.pathname = `${baseUrl.pathname.replace(/\/+$/, "")}/chat/completions`;
  return baseUrl;
};

const errorMessage = async (response) => {
  const raw = await response.text();
  try {
    const data = raw ? JSON.parse(raw) : {};
    return data?.error?.message || data?.message || raw || `Provider error: ${response.status}`;
  } catch {
    return raw || `Provider error: ${response.status}`;
  }
};

const routesMeModelHint = async (chatCompletionUrl, apiKey) => {
  if (chatCompletionUrl.hostname.toLowerCase() !== "routesme.online") return "";

  const modelsUrl = new URL(chatCompletionUrl);
  modelsUrl.pathname = modelsUrl.pathname.replace(/\/chat\/completions$/, "/models");
  try {
    const response = await fetch(modelsUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) return "";

    const data = await response.json();
    const models = Array.isArray(data?.data) ? data.data : [];
    const glmModels = models
      .map((model) => typeof model === "string" ? model : model?.id || model?.name)
      .filter((model) => typeof model === "string" && /glm|zhipu/i.test(model))
      .slice(0, 8);
    return glmModels.length
      ? ` Available GLM models for this key: ${glmModels.join(", ")}.`
      : "";
  } catch {
    return "";
  }
};

const readOpenAIStream = async (response) => {
  if (!response.body) throw new Error("The provider returned an empty streaming response.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";

  const readEvent = (event) => {
    for (const line of event.split("\n")) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const data = JSON.parse(payload);
        content += data?.choices?.[0]?.delta?.content || "";
      } catch {
        // A malformed SSE event should not discard already received tokens.
      }
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";
    events.forEach(readEvent);
    if (done) break;
  }
  if (buffer) readEvent(buffer);

  if (!content) throw new Error("The provider returned an empty streaming response.");
  return { choices: [{ message: { role: "assistant", content } }] };
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: { message: "Method not allowed." } });

  try {
    const contentLength = Number(req.headers["content-length"] || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return res.status(413).json({ error: { message: "AI request is too large." } });
    }

    const { endpoint, apiKey, model, messages, max_tokens, temperature } = getRequestBody(req);
    if (typeof apiKey !== "string" || !apiKey.trim()) {
      return res.status(400).json({ error: { message: "A provider API key is required." } });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: { message: "At least one chat message is required." } });
    }

    const chatCompletionUrl = getChatCompletionUrl(endpoint);
    // RoutesMe's nginx gateway can time out while waiting for a full
    // non-streaming completion. Its documented OpenAI-compatible SSE mode
    // sends the first token promptly; consume that stream here so callers
    // retain the existing JSON response contract.
    const useStreamingRelay = chatCompletionUrl.hostname.toLowerCase() === "routesme.online";
    const response = await fetch(chatCompletionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens, temperature, stream: useStreamingRelay }),
    });

    if (!response.ok) {
      const providerMessage = await errorMessage(response);
      const modelHint = response.status === 503
        ? await routesMeModelHint(chatCompletionUrl, apiKey)
        : "";
      return res.status(response.status).json({ error: { message: `${providerMessage}${modelHint}` } });
    }

    const data = useStreamingRelay ? await readOpenAIStream(response) : await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("[ai-chat] provider relay failed:", error);
    return res.status(502).json({
      error: { message: error instanceof Error ? error.message : "Could not reach the AI provider." },
    });
  }
}
