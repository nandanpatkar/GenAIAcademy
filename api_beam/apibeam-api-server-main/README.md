# ApiBeam API Server

> **The bridge between HTTP API clients and your browser's AI capabilities.**

ApiBeam is a lightweight NestJS server that acts as a **WebSocket relay**. It lets any HTTP client (e.g. OpenAI SDK, VS Code extensions, CLI tools) talk to AI models running inside your browser — without sharing API keys or paying for cloud inference.

---

## How It Works

```
HTTP Client (e.g. OpenAI SDK)
        │
        │  POST /app/:roomId/v1/chat/completions
        ▼
┌──────────────────────┐
│  ApiBeam API Server  │  ← You are here
│  (NestJS + Socket.IO)│
└──────────────────────┘
        │
        │  WebSocket  →  serverMessage
        ▼
┌──────────────────────┐
│  ApiBeam Extension   │
│  (Browser / ChatGPT) │
└──────────────────────┘
        │
        │  WebSocket  →  clientResponse
        ▼
┌──────────────────────┐
│  ApiBeam API Server  │
│  (resolves HTTP req) │
└──────────────────────┘
        │
        │  JSON / SSE stream
        ▼
   HTTP Client
```

1. An HTTP client sends a request to the server using a **room ID**.
2. The server holds the request open and forwards it over WebSocket to the browser extension that joined that room.
3. The extension processes the request (e.g. calls ChatGPT) and sends the result back via WebSocket.
4. The server resolves the HTTP response and returns the result to the original caller.

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| Yarn | ≥ 1.x |

### One-command setup & start

```bash
yarn setup-and-start
```

This single command will:
1. Install all dependencies (`yarn`)
2. Start the development server with hot-reload (`yarn start:dev`)

> The server will start on **port 3000** by default.
> You should see:
> ```
> Server started on:  3000
> API URL:  http://localhost:3000/
> ```

---

## All Available Scripts

| Script | Description |
|--------|-------------|
| `yarn setup-and-start` | **Install deps + start dev server** _(recommended for first run / self-hosting)_ |
| `yarn start` | Start in production mode (requires a prior build) |
| `yarn start:dev` | Start with hot-reload (watches for file changes) |
| `yarn start:debug` | Start with hot-reload + Node.js debugger |
| `yarn start:prod` | Run the compiled production build |
| `yarn build` | Compile TypeScript to `dist/` |
| `yarn test` | Run unit tests |
| `yarn test:e2e` | Run end-to-end tests |
| `yarn test:cov` | Run tests with coverage report |
| `yarn lint` | Lint and auto-fix source files |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port the HTTP server listens on |
| `NODE_ENV` | — | Set to `dev` to allow CORS from any origin |
| `ALLOWED_ORIGINS` | — | Comma-separated website origins permitted to call the relay in production |
| `EXTENSION_ID` | — | Optional stable Chrome Web Store extension ID permitted in production |
| `ALLOW_ANY_CHROME_EXTENSION_ORIGIN` | `false` | Temporary beta option to permit any valid `chrome-extension://` origin in production |

**Example: run on a custom port**

```bash
PORT=8080 yarn start:dev
```

### CORS

- In **development** (`NODE_ENV=dev`), all origins are allowed (`*`).
- In **production**, configure `ALLOWED_ORIGINS` and either `EXTENSION_ID` or an explicit Chrome extension origin.
- Set `ALLOW_ANY_CHROME_EXTENSION_ORIGIN=true` only when distributing unpacked builds during a limited beta. It permits `chrome-extension://` origins with valid Chrome extension IDs, but not arbitrary website origins. Disable it when a stable Chrome Web Store ID or authenticated device pairing is available.

---

## API Reference

The base URL path prefix for all routes is `/app/:roomId/`.
Replace `:roomId` with the unique room ID assigned by the ApiBeam extension.

### Health / Test

```
GET /app/:roomId/test-me?message=<your message>
```

Sends a quick test prompt through the relay and returns the AI response.

---

### Generic Relay Endpoints

These routes forward any request to the browser extension and return its response. Use them to proxy any AI API call.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/app/:roomId/*` | Forward a GET request (params via query string) |
| `POST` | `/app/:roomId/*` | Forward a POST request (params via JSON body) |
| `PUT` | `/app/:roomId/*` | Forward a PUT request |
| `PATCH` | `/app/:roomId/*` | Forward a PATCH request |
| `DELETE` | `/app/:roomId/*` | Forward a DELETE request |

**Example — mimic OpenAI chat completions:**

```bash
curl -X POST http://localhost:3000/app/<roomId>/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

### Streaming Support

Add `"stream": true` to any POST body (or `?stream=true` as a query param) to receive a **Server-Sent Events (SSE)** stream instead of a single JSON response.

The server also detects an `Accept: text/event-stream` request header (used by clients like the VS Code Copilot SDK) and streams SSE automatically, even without an explicit `stream` flag.

For `/v1/responses` routes the server emits the full OpenAI Responses API event sequence:

```
response.created → response.output_item.added → response.output_text.delta (×N) → response.output_item.done → response.completed → [DONE]
```

---

### WebSocket — Room Management

```
GET /connect/:roomId?socketId=<socket.io-id>
```

Called by the extension after connecting via Socket.IO to join a relay room. Once joined, the server can forward API requests to that room.

**Socket.IO Events**

| Direction | Event | Payload | Description |
|-----------|-------|---------|-------------|
| Server → Client | `serverMessage` | `{ route, body, model, … }` | Forwarded HTTP request payload |
| Client → Server | `clientResponse` | `{ roomId, message }` | AI response from the browser |
| Server → Client | `roomJoined` | `{ roomId }` | Confirmation after joining a room |

**Timeout:** If no `clientResponse` is received within **60 seconds**, the server returns a `504 Gateway Timeout` HTML response with setup instructions.

---

## Project Structure

```
src/
├── main.ts                          # App bootstrap, port, CORS config
├── app.module.ts                    # Root module (imports Socket, Schedule)
├── app.controller.ts                # HTTP relay routes (GET/POST/PUT/PATCH/DELETE)
├── app.service.ts                   # App-level service
├── socket/
│   ├── socket.gateway.ts            # WebSocket gateway (room management, relay logic)
│   ├── socket.controller.ts         # REST endpoint to join a room
│   └── socket.module.ts             # Socket feature module
└── common/
    └── middlewares/
        └── stream.middleware.ts     # SSE streaming middleware
```

---

## Self-Hosting

To host the server on a VPS or cloud instance:

### 1. Clone the repository

```bash
git clone https://github.com/niteshSingh17/apibeam.git
cd apibeam-api-server
```

### 2. Install & start

```bash
yarn setup-and-start
```

### 3. (Optional) Production build

```bash
yarn build
NODE_ENV=production PORT=3000 yarn start:prod
```

### 4. Configure the extension

In the ApiBeam Chrome extension settings, set the **Custom API Base URL** to your server's public URL:

```
http://<your-server-ip>:3000
```

---

## Related

- [ApiBeam Chrome Extension](https://github.com/niteshSingh17/apibeam/#apibeam) — The browser-side component that pairs with this server.

---

## License

UNLICENSED — private use only.
