// ─── Central AI Provider Registry ────────────────────────────────────────────
// Single source of truth for every LLM provider the app can talk to. Add a new
// model by appending one entry here — the service layer (aiService.js), the
// credential store (AuthContext.jsx) and every settings UI read from this list,
// so nothing else needs to change.
//
// Adapters describe HOW we call the provider:
//   - "gemini"  → Google Generative Language REST API (key only)
//   - "azure"   → Azure OpenAI deployment (endpoint + key, optional deployment)
//   - "openai"  → any OpenAI-compatible /chat/completions API (endpoint + key + model)
//
// Most modern providers (GLM, Kimi, Grok, Groq, DeepSeek, OpenAI…) speak the
// OpenAI chat-completions dialect, so they all share the "openai" adapter and
// only differ by their default endpoint / model.

export const AI_PROVIDERS = {
  gemini: {
    id: "gemini",
    label: "Google Gemini",
    sub: "Gemini Flash",
    adapter: "gemini",
    // Reliable Iconify brand logo; UI falls back to the monogram if it fails.
    icon: "logos:google-gemini",
    color: "#1a73e8",
    mono: "G",
    defaultModel: "gemini-flash-latest",
    docsUrl: "https://aistudio.google.com/app/apikey",
    fields: [
      { name: "key", label: "Gemini API key", type: "password", placeholder: "Paste your Gemini API key…", required: true },
    ],
  },

  "azure-openai": {
    id: "azure-openai",
    label: "Azure OpenAI",
    sub: "GPT deployment",
    adapter: "azure",
    icon: "logos:microsoft-azure",
    color: "#0078D4",
    mono: "Az",
    defaultModel: "gpt-4o", // Azure deployment name
    docsUrl: "https://learn.microsoft.com/azure/ai-services/openai/",
    fields: [
      { name: "endpoint", label: "Azure endpoint", type: "text", placeholder: "https://your-resource.openai.azure.com", required: true },
      { name: "key", label: "Azure API key", type: "password", placeholder: "Paste your Azure API key…", required: true },
      { name: "model", label: "Deployment name", type: "text", placeholder: "gpt-4o", required: false },
    ],
  },

  openai: {
    id: "openai",
    label: "OpenAI",
    sub: "GPT models",
    adapter: "openai",
    icon: "logos:openai-icon",
    color: "#10a37f",
    mono: "AI",
    defaultEndpoint: "https://api.openai.com/v1",
    defaultModel: "gpt-4o",
    docsUrl: "https://platform.openai.com/api-keys",
    fields: [
      { name: "endpoint", label: "Base URL", type: "text", placeholder: "https://api.openai.com/v1", required: true },
      { name: "key", label: "API key", type: "password", placeholder: "sk-…", required: true },
      { name: "model", label: "Model", type: "text", placeholder: "gpt-4o", required: false },
    ],
  },

  apibeam: {
    id: "apibeam",
    label: "ApiBeam",
    sub: "Browser AI session",
    adapter: "apibeam",
    icon: null,
    color: "#6366f1",
    mono: "AB",
    defaultModel: "gpt-4o",
    docsUrl: "https://chromewebstore.google.com/detail/apibeam/lppnphjckpnmekbjlciagcebgjempohh?authuser=0&hl=en-GB",
    docsLabel: "Open extension install guide",
    setupMessage: "Install and connect the ApiBeam extension, then add the API URL shown in its Settings page.",
    fields: [
      {
        name: "endpoint",
        label: "ApiBeam API URL",
        type: "text",
        placeholder: "https://your-relay.example/app/your-room-id",
        required: true,
        helpText: "Copy the full API URL from the ApiBeam extension Settings page. Treat it like a password.",
      },
      {
        name: "model",
        label: "Model label",
        type: "text",
        placeholder: "gpt-4o",
        required: false,
        helpText: "This label is sent to the relay; your selected browser provider performs the request.",
      },
    ],
  },

  glm: {
    id: "glm",
    label: "GLM (Zhipu AI)",
    sub: "GLM-4",
    adapter: "openai",
    icon: null, // no reliable brand logo → branded monogram
    color: "#3859ff",
    mono: "GLM",
    defaultEndpoint: "https://open.bigmodel.cn/api/paas/v4",
    defaultModel: "glm-4-plus",
    docsUrl: "https://open.bigmodel.cn/",
    fields: [
      { name: "endpoint", label: "Base URL", type: "text", placeholder: "https://open.bigmodel.cn/api/paas/v4", required: true },
      { name: "key", label: "API key", type: "password", placeholder: "Paste your GLM API key…", required: true },
      { name: "model", label: "Model", type: "text", placeholder: "glm-4-plus", required: false },
    ],
  },

  kimi: {
    id: "kimi",
    label: "Kimi (Moonshot AI)",
    sub: "Moonshot",
    adapter: "openai",
    icon: null,
    color: "#5b3fe8",
    mono: "Kimi",
    defaultEndpoint: "https://api.moonshot.cn/v1",
    defaultModel: "moonshot-v1-8k",
    docsUrl: "https://platform.moonshot.cn/",
    fields: [
      { name: "endpoint", label: "Base URL", type: "text", placeholder: "https://api.moonshot.cn/v1", required: true },
      { name: "key", label: "API key", type: "password", placeholder: "Paste your Moonshot API key…", required: true },
      { name: "model", label: "Model", type: "text", placeholder: "moonshot-v1-8k", required: false },
    ],
  },

  grok: {
    id: "grok",
    label: "Grok (xAI)",
    sub: "Grok",
    adapter: "openai",
    icon: null,
    color: "#111827",
    mono: "Grok",
    defaultEndpoint: "https://api.x.ai/v1",
    defaultModel: "grok-2-latest",
    docsUrl: "https://docs.x.ai/",
    fields: [
      { name: "endpoint", label: "Base URL", type: "text", placeholder: "https://api.x.ai/v1", required: true },
      { name: "key", label: "API key", type: "password", placeholder: "Paste your xAI API key…", required: true },
      { name: "model", label: "Model", type: "text", placeholder: "grok-2-latest", required: false },
    ],
  },

  groq: {
    id: "groq",
    label: "Groq",
    sub: "Fast inference",
    adapter: "openai",
    icon: null,
    color: "#f55036",
    mono: "Groq",
    defaultEndpoint: "https://api.groq.com/openai/v1",
    defaultModel: "llama-3.3-70b-versatile",
    docsUrl: "https://console.groq.com/keys",
    fields: [
      { name: "endpoint", label: "Base URL", type: "text", placeholder: "https://api.groq.com/openai/v1", required: true },
      { name: "key", label: "API key", type: "password", placeholder: "Paste your Groq API key…", required: true },
      { name: "model", label: "Model", type: "text", placeholder: "llama-3.3-70b-versatile", required: false },
    ],
  },

  deepseek: {
    id: "deepseek",
    label: "DeepSeek",
    sub: "DeepSeek Chat",
    adapter: "openai",
    icon: null,
    color: "#4d6bfe",
    mono: "DS",
    defaultEndpoint: "https://api.deepseek.com/v1",
    defaultModel: "deepseek-chat",
    docsUrl: "https://platform.deepseek.com/api_keys",
    fields: [
      { name: "endpoint", label: "Base URL", type: "text", placeholder: "https://api.deepseek.com/v1", required: true },
      { name: "key", label: "API key", type: "password", placeholder: "Paste your DeepSeek API key…", required: true },
      { name: "model", label: "Model", type: "text", placeholder: "deepseek-chat", required: false },
    ],
  },
};

// Stable ordering for dropdowns / menus.
export const AI_PROVIDER_IDS = Object.keys(AI_PROVIDERS);

export const AI_PROVIDER_LIST = AI_PROVIDER_IDS.map((id) => AI_PROVIDERS[id]);

export const getProviderMeta = (id) => AI_PROVIDERS[id] || AI_PROVIDERS.gemini;

// A provider is "ready" once every required field for its adapter has a value.
export const isProviderConfigured = (id, config = {}) => {
  const meta = AI_PROVIDERS[id];
  if (!meta) return false;
  return meta.fields
    .filter((f) => f.required)
    .every((f) => {
      const value = (config[f.name] || "").trim();
      return value && !value.includes("your-api-key");
    });
};
