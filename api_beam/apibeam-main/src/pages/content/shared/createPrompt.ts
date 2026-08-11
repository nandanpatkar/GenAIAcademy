// Shared prompt builder used by all providers
export const createPrompt = (selectedLanguage: string, method: string): string => {
  return `from now on talk to me as if I am talking to a ${
    selectedLanguage ? `${selectedLanguage} library` : "programming"
  }${
    method ? ` which is using ${method}` : ""
  } you are a server for it. I will give you a payload. Return ONLY one valid JSON object with this exact OpenAI Chat Completions shape and no markdown fences: {"id":"chatcmpl_local","object":"chat.completion","created":0,"model":"string","choices":[{"index":0,"message":{"role":"assistant","content":"your complete Markdown answer"},"finish_reason":"stop"}]}. Escape all JSON strings correctly. If the payload asks to generate or create an image, use ChatGPT image generation when it is available, then return the accompanying text in the same JSON shape. The GenAI Academy Connector bridge will carry the generated image back to the calling app.`;
};
