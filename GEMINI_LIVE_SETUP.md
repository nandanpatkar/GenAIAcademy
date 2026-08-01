# Gemini Live data-science interviewer

## Run locally

1. Create `.env.local` in the project root:

   ```bash
   GEMINI_API_KEY=your_google_ai_studio_key
   ```

2. Start the app with `npm run dev` and open the **AI Interviewer** tool.

The browser never receives `GEMINI_API_KEY`. `api/gemini-live-token.js` exchanges it for a one-use, 30-minute Gemini Live ephemeral token. On Vercel, add the same `GEMINI_API_KEY` environment variable to the project settings.

## Architecture

```text
React UI -> POST /api/gemini-live-token -> Gemini token endpoint
React UI -> direct secure WebSocket with ephemeral token -> Gemini Flash Live
```

The direct browser-to-Gemini audio route reduces voice latency while the long-lived key remains on the server. The interviewer prompt is in `src/prompts/dataScienceInterviewerPrompt.js` and is assembled with the target role, seniority, job description, and optional candidate background.

## Notes

- The starter uses `gemini-3.1-flash-live-preview`, the current Gemini Flash Live model identifier at the time of writing. Change `MODEL` in `src/services/geminiLiveService.js` when you upgrade models.
- Browser microphone permission and an HTTPS origin are required in production.
- Secure `/api/gemini-live-token` with your application's authentication and rate limiting before public deployment.
