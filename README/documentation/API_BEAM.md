# Use ApiBeam with GenAI Academy AI tools

ApiBeam lets GenAI Academy AI tools send requests through a browser session that is already signed in to ChatGPT, Claude, or z.ai. It is an optional provider: Gemini, Azure OpenAI, and the other API-based providers continue to work normally.

> ApiBeam automates a provider's web interface. It is best used as a personal, experimental integration. Keep the official API integrations as the supported option, and make sure your intended use follows the provider's current terms.

## Included projects

- [Browser extension source](../../api_beam/apibeam-main) — Chrome/Firefox extension that operates the selected AI chat tab.
- [Relay server source](../../api_beam/apibeam-api-server-main) — NestJS and Socket.IO service between Atlas and the extension.
- [New laptop setup guide](./API_BEAM_NEW_LAPTOP_SETUP.md) — the short, step-by-step process for using the deployed relay from another computer.
- [Oracle relay troubleshooting](./API_BEAM_RELAY_TROUBLESHOOTING.md) — recovery commands for timeouts, 502 responses, WebSocket errors, and a slow VM.
- [Oracle + Vercel production implementation plan](./API_BEAM_ORACLE_VERCEL_IMPLEMENTATION_PLAN.md) — detailed Oracle Free Tier, relay security, DNS/TLS, Vercel, extension-distribution, testing, and operations runbook.
- [Upstream ApiBeam extension](https://github.com/NiteshSingh17/apibeam) — extension repository and release/setup reference.

## Local setup

ApiBeam needs three things running in the same browser profile: the relay server, the browser extension, and a signed-in ChatGPT, Claude, or z.ai session.

### 1. Start the relay server

```bash
cd /Users/nandanpatkar/Downloads/genai-roadmap-src/api_beam/apibeam-api-server-main
yarn
NODE_ENV=dev yarn start:dev
```

The server starts at `http://localhost:3000`.

### 2. Build and load the extension

```bash
cd /Users/nandanpatkar/Downloads/genai-roadmap-src/api_beam/apibeam-main
yarn
yarn build:chrome
```

In Chrome, open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**, and select:

```text
/Users/nandanpatkar/Downloads/genai-roadmap-src/api_beam/apibeam-main/dist_chrome
```

For Firefox, run `yarn build:firefox`, open `about:debugging#/runtime/this-firefox`, and load the generated `dist_firefox/manifest.json` as a temporary add-on.

### 3. Connect the extension

1. Open the ApiBeam extension, then open **Settings**.
2. In **Custom API Base URL**, use `http://localhost:3000/`.
3. Select ChatGPT, Claude, or z.ai as the provider.
4. Click **Connect**.
5. Copy **Your API URL**. It looks like `http://localhost:3000/app/<room-id>`.

The extension opens and controls a provider tab when Atlas sends its first request. Sign in to the selected provider in that browser profile before using it.

### 4. Configure Atlas

1. Open the Atlas chatbot in GenAI Academy.
2. Choose **ApiBeam** in the model selector.
3. Select **Credentials**.
4. Paste the full API URL copied from the extension into **ApiBeam API URL**.
5. Select **Save & use provider** and start a conversation.

The API URL includes the room ID. Treat it like a password and do not put it in source control, screenshots, or shared documentation.

After pulling changes to this project, rebuild the extension and click **Reload** on its card in `chrome://extensions`. Atlas supports both normal Markdown replies and OpenAI-compatible JSON replies, so provider answers no longer need to be JSON-only.

## Use ApiBeam in every built-in AI tool

ApiBeam is the active provider for the whole GenAI Academy session, not only Atlas. After saving the connection above, select **ApiBeam** in the sidebar's **AI Provider** settings. The selection is then used by the built-in client-side AI features, including:

- AI Tutor, AI Study Suite, video summaries, detailed notes, and interview coaching
- Quiz Lab and Interview Prep tutors
- Project Ideas, Algorithm Templates, Blog TL;DR, and onboarding recommendations
- System Design / Flow / Architecture generators and the Project IDE assistant

Tools that generate structured data now ask ApiBeam for JSON-only output and validate the result before rendering it. If the extension is disconnected, each affected tool shows an ApiBeam-specific recovery message instead of a generic generation error.

The **Workspace Notes** copilot also supports ApiBeam when GenAI Academy is deployed. It converts ApiBeam's completed response into the editor's existing stream. For that server-side path, use an HTTPS relay URL; a `localhost` relay can only be used by browser-side tools during local development.

Gemini Live and Retell voice interviews remain separate real-time integrations and do not use ApiBeam.

## Generate images in Atlas with ChatGPT

When ApiBeam is connected to a signed-in ChatGPT tab that has image generation enabled, ask Atlas naturally, for example: `Generate an image of a calm futuristic AI study desk`. Atlas sends the request to ChatGPT through ApiBeam and shows the generated image below ChatGPT's reply. Select the image or **Open** to view it at full size. Image generation can take up to three minutes; leave the ChatGPT tab open until Atlas finishes.

This requires the current ApiBeam extension build: run `yarn build:chrome` in `api_beam/apibeam-main`, then click **Reload** in `chrome://extensions`. The extension captures image URLs from the ChatGPT response, so image availability follows the ChatGPT session and its generated-image links may expire over time.

## Send only the current screen

Atlas has a **Context on / Context off** button beside its model selector. Turn it off before sending a request if you do not want to include the roadmap, current screen, workspace notes, maps, recent activity, saved algorithms, or saved projects. Atlas will send only its generic instructions, the actual conversation, and your new question.

### Legacy hosted relay during local development

If you still use an API URL beginning with `https://apibeam.bitsmall.in`, Atlas now routes it through the Vite development server to avoid the hosted relay's browser CORS restriction. This only applies while running `npm run dev`; use your own HTTPS relay for a deployed GenAI Academy instance.

## Using a hosted relay

Deploy the NestJS server to a host that supports persistent WebSocket connections. Do not use a serverless endpoint that terminates long-lived Socket.IO connections.

Configure the production server with the origins that may call it:

```bash
NODE_ENV=production \
ALLOWED_ORIGINS=https://your-genai-academy.example,chrome-extension://your-extension-id \
PORT=3000 \
yarn build && yarn start:prod
```

For a temporary beta that distributes unpacked extensions with different Chrome IDs, keep the Atlas website in `ALLOWED_ORIGINS` and set `ALLOW_ANY_CHROME_EXTENSION_ORIGIN=true`. This admits any `chrome-extension://` origin, not arbitrary websites. It is a short-term compatibility option; use a stable Chrome Web Store ID or authenticated device pairing before a public launch.

Find `your-extension-id` on the Chrome extensions page after loading the unpacked build. Then use the relay's HTTPS URL in the extension settings and copy the resulting HTTPS API URL into Atlas. A public deployment should add authenticated rooms, rate limiting, request correlation, and connection health checks before it is shared with other people.

## Troubleshooting

- **Atlas says it cannot reach ApiBeam:** confirm the relay is running, the extension says Connected, and the configured API URL is the full `/app/<room-id>` URL.
- **The request times out:** open the selected provider tab, sign in again, and reconnect the extension.
- **A deployed GenAI Academy cannot call localhost:** host the relay over HTTPS and add the app origin to `ALLOWED_ORIGINS`.
- **The provider returns no message:** refresh the provider tab. The extension depends on the provider's current page structure and streaming format.
