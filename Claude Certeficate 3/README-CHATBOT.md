# Study assistant

A docked chat panel, available on every screen, that answers questions about
whatever the learner is currently reading. It calls an OpenAI-compatible model
endpoint (TokenRouter) through a proxy that runs inside the Vite server.

## Pieces

| File | Role |
| --- | --- |
| [server/chat-proxy.mjs](server/chat-proxy.mjs) | Vite plugin. Mounts `POST /api/chat`, attaches the API key, streams the reply back as SSE. Node-side only. |
| [src/utils/chatClient.js](src/utils/chatClient.js) | Browser-side SSE reader. Turns the stream into `onDelta(text)` calls. |
| [src/components/Chatbot.jsx](src/components/Chatbot.jsx) | The panel and its launcher button. |
| [src/App.jsx](src/App.jsx) | Mounts the panel and builds the "what am I looking at" context. |
| `.env` | The API key. Git-ignored. |

## Setup

```
cp .env.example .env      # then fill in TOKENROUTER_API_KEY
npm run dev
```

Restart the dev server after editing `.env` — Vite reads it once at startup.

With no key set, the dev server logs a warning and the panel reports itself as
unconfigured rather than failing silently.

## Why the key is not in the browser

Anything in the client bundle is public: `view-source` shows it, and so does
`dist/`. So `TOKENROUTER_API_KEY` is deliberately **not** prefixed with `VITE_`
— Vite only inlines `VITE_*` vars into the bundle. `vite.config.js` reads the
full env with `loadEnv(mode, cwd, '')` and hands it to the proxy plugin, which
runs in Node. The browser only ever posts to this site's own `/api/chat`.

To confirm after a build:

```powershell
Select-String -Path dist\assets\*.js -Pattern "sk-" -SimpleMatch
```

That should find nothing.

## Deploying

`/api/chat` exists because a Node process is serving the site. `npm run dev` and
`npm run preview` both have it.

A plain static host for `dist/` **does not** — the panel will get a 404 and show
an error. To deploy, port the handler in `server/chat-proxy.mjs` to whatever
serverless function your host provides (Vercel/Netlify functions, a Worker, an
Express route) at the path `/api/chat`, and set `TOKENROUTER_API_KEY` in that
host's environment settings. The request/response contract is small:

- **Request**: `POST /api/chat` with `{ messages: [{role, content}], context: string }`
- **Response**: an OpenAI-style SSE stream, passed through unchanged.

## Notes on behaviour

- The conversation lives in React state only and resets on refresh, matching how
  the rest of the app treats progress (see the persistence note at the top of
  `App.jsx`).
- The system prompt is fixed server-side. The client's `context` is appended as
  background information and explicitly labelled as page content, not
  instructions, so the page cannot repurpose the key.
- The proxy caps body size, message count, and per-message length, and aborts the
  upstream call as soon as the browser disconnects — closing the panel or hitting
  Stop stops the token spend.
- Free-tier models can be slow to the first token; the panel shows a typing
  indicator until content arrives and stays cancellable throughout.
- Change the model with `TOKENROUTER_MODEL` in `.env`.
