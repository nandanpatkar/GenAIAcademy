import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const MODEL_ID = "gemini-1.5-pro-latest"; // or gemini-2.5-pro etc.

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function callGemini(messages: any[], inferenceConfig: any): Promise<string> {
  const contents = messages.map((m) => {
    // Map previous payload structure securely
    const textPart = Array.isArray(m.content) ? m.content[0]?.text : m.content;
    const role = m.role === "assistant" ? "model" : (m.role || "user");
    
    return {
      role: role,
      parts: [{ text: typeof textPart === "string" ? textPart : JSON.stringify(textPart) }]
    };
  });

  const payload = {
    contents,
    generationConfig: {
      maxOutputTokens: inferenceConfig?.max_new_tokens ?? 1024,
      temperature: inferenceConfig?.temperature ?? 0.7,
      topP: inferenceConfig?.top_p ?? 0.9,
    }
  };

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error("No response from Gemini model.");
  }
  
  return text;
}

// ── Main handler ────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages, inferenceConfig } = await req.json();

    const text = await callGemini(messages, inferenceConfig);
    
    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
