# Use ApiBeam with the GenAI Academy chatbot

ApiBeam lets the Atlas chatbot send requests through a browser session that is already signed in to ChatGPT, Claude, or z.ai. It is an optional provider: Gemini, Azure OpenAI, and the other API-based providers continue to work normally.

> ApiBeam automates a provider's web interface. It is best used as a personal, experimental integration. Keep the official API integrations as the supported option, and make sure your intended use follows the provider's current terms.

## Included projects

- [Browser extension source](./apibeam-main) — Chrome/Firefox extension that operates the selected AI chat tab.
- [Relay server source](./apibeam-api-server-main) — NestJS and Socket.IO service between Atlas and the extension.
- [New laptop setup guide](./NEW_LAPTOP_SETUP.md) — the short, step-by-step process for using the deployed relay from another computer.
- [Oracle + Vercel production integration plan](./ORACLE_VERCEL_INTEGRATION_PLAN.md) — detailed Oracle Free Tier, relay security, DNS/TLS, Vercel, extension-distribution, testing, and operations runbook.
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

Find `your-extension-id` on the Chrome extensions page after loading the unpacked build. Then use the relay's HTTPS URL in the extension settings and copy the resulting HTTPS API URL into Atlas. A public deployment should add authenticated rooms, rate limiting, request correlation, and connection health checks before it is shared with other people.

## Troubleshooting

- **Atlas says it cannot reach ApiBeam:** confirm the relay is running, the extension says Connected, and the configured API URL is the full `/app/<room-id>` URL.
- **The request times out:** open the selected provider tab, sign in again, and reconnect the extension.
- **A deployed GenAI Academy cannot call localhost:** host the relay over HTTPS and add the app origin to `ALLOWED_ORIGINS`.
- **The provider returns no message:** refresh the provider tab. The extension depends on the provider's current page structure and streaming format.
