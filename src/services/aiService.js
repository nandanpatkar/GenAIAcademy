import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDm0DxI1Z4yeomlCh4jcLe8yRrBoDv2V3Q"; // Gemini API Key
const TAVILY_API_KEY = "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"; // Tavily Search API Key

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(API_KEY);

// We'll use Gemini Flash Latest for high-quota, fast, reliable tutor responses.
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

/**
 * Perform a web search using Tavily API to get real-time context.
 */
const fetchTavilySearch = async (query) => {
  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query,
        search_depth: "basic",
        include_answer: false,
        max_results: 3
      }),
    });
    const data = await response.json();
    return data.results?.map(r => `[${r.title}](${r.url}): ${r.content}`).join("\n\n") || "No search results found.";
  } catch (error) {
    console.warn("Tavily Search Error:", error);
    return "Could not retrieve real-time data.";
  }
};

export const askAITutor = async (userMessage, contextData, chatHistory = []) => {
  try {
    const { topicTitle, moduleTitle, activeCode } = contextData;

    // Optional: Only search if the message isn't clearly a simple code debug request
    // or if the user asks for something external. For simplicity, we'll perform a quick research.
    let researchContext = "";
    if (userMessage.length > 10) {
        researchContext = await fetchTavilySearch(userMessage);
    }

    const systemInstruction = `You are a deeply encouraging, expert programming tutor for the "GenAI Academy" platform.
The user is currently studying the module: "${moduleTitle}" specifically focusing on "${topicTitle}".
${activeCode ? `Here is the code they currently have in their Practice IDE editor:
\`\`\`python
${activeCode}
\`\`\`` : ""}

${researchContext ? `LATEST RESEARCH DATA (Use this for real-time context if relevant):
${researchContext}

CRITICAL: If you use the research data above, you MUST append a "--- Sources ---" section at the VERY END of your response containing all relevant clickable Markdown links from the research data.` : ""}

Your Goal: act as a Socratic tutor. 
- DO NOT just hand them the final working code.
- Provide hints, ask guiding questions, and explain *why* something is wrong conceptually.
- Use current, up-to-date research data to provide accurate explanations.
- If you cite sources, ensure they are relevant to the user's question.
- Use friendly, highly encouraging language.
- CRITICAL: Provide your entire answer in clean Markdown format. Use bolding, lists, and code blocks as needed.
`;

    // Convert our internal chatHistory [{role: 'user'|'assistant', content: string}] 
    // to Google's expected format [{role: 'user'|'model', parts: [{text: string}]}]
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Start a chat session with history
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "System prompt instructions:\n" + systemInstruction }] },
        { role: "model", parts: [{ text: "Understood! I am ready to be an excellent, encouraging Socratic tutor for the learner!" }] },
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("AI Tutor Error:", error);
    throw new Error("I hit a temporary snag thinking about this. Could you try asking again?");
  }
};
