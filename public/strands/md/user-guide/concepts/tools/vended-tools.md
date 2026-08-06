Vended tools are pre-built tools included directly in the Strands SDK for common agent tasks like file operations, shell commands, HTTP requests, and persistent notes.

They ship as part of the SDK package and are updated alongside it — see [Versioning & Maintenance](#versioning--maintenance) for details on how changes are communicated and what level of backwards compatibility they maintain.

## Quick Start

Each tool is imported from its own subpath under `@strands-agents/sdk/vended-tools` — no additional packages required:

```typescript
import { Agent } from '@strands-agents/sdk'
import { bash } from '@strands-agents/sdk/vended-tools/bash'
import { fileEditor } from '@strands-agents/sdk/vended-tools/file-editor'
import { httpRequest } from '@strands-agents/sdk/vended-tools/http-request'
import { notebook } from '@strands-agents/sdk/vended-tools/notebook'

const agent = new Agent({
  tools: [bash, fileEditor, httpRequest, notebook],
})
```

## Available Tools

| Tool | Description | Supported in |
| --- | --- | --- |
| [File Editor](#file-editor) | View, create, and edit files | Python, TypeScript (Node.js) |
| [HTTP Request](#http-request) | Make HTTP requests to external APIs | Python, TypeScript (Node.js 20+, browsers) |
| [Notebook](#notebook) | Manage persistent text notebooks | TypeScript (Node.js, browsers) |
| [Bash](#bash) | Execute shell commands with persistent sessions | Python, TypeScript (Node.js, Unix/Linux/macOS) |
| [Sleep](#sleep) | Pause execution for a bounded, cancellable duration | Python, TypeScript (Node.js, browsers) |
| [Stop](#stop-experimental) | Gracefully end the agent loop when the task is complete | Python, TypeScript (Node.js, browsers) |

### File Editor

Gives your agent the ability to read and modify files on disk — useful for coding agents, config management, or any workflow where the agent needs to inspect output and make targeted edits.

> [!WARNING] Security Warning
>
> This tool reads and writes files at arbitrary absolute paths with the full permissions of the process. Only use with trusted input and consider running in a [sandboxed environment](lc:user-guide/concepts/sandbox) for production.

**Example:**

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { fileEditor } from '@strands-agents/sdk/vended-tools/file-editor'\n\nconst agent = new Agent({\n  tools: [fileEditor],\n})\n\n// Create, view, and edit files\nawait agent.invoke('Create a file /tmp/config.json with {\"debug\": false}')\nawait agent.invoke('Replace \"debug\": false with \"debug\": true in /tmp/config.json')\nawait agent.invoke('View lines 1-10 of /tmp/config.json')\n```"
 },
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.vended_tools import file_editor\n\nagent = Agent(tools=[file_editor])\nagent(\"Create a file at /tmp/hello.txt with the contents 'Hello, world!'\")\n```"
 }
]
```

📖 [Full API Reference](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-tools/file-editor/README.md)

---

### HTTP Request

Lets your agent call external APIs and fetch web content. Supports all HTTP methods, custom headers, and request bodies. Default timeout is 30 seconds.

*Supported in: Python; Node.js 20+, modern browsers (TypeScript).*

```sa-tabs
[
 {
  "label": "Python",
  "body": "The Python tool delegates all networking to an `httpx.AsyncClient`. Use the `make_http_request` factory to supply a pre-configured client with authentication, timeouts, redirects, proxies, or other transport-level configuration."
 }
]
```

**Example:**

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { httpRequest } from '@strands-agents/sdk/vended-tools/http-request'\n\nconst agent = new Agent({\n  tools: [httpRequest],\n})\n\n// Make API requests\nawait agent.invoke('Get data from https://api.example.com/users')\nawait agent.invoke('Post {\"name\": \"John\"} to https://api.example.com/users')\n```"
 },
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.vended_tools import http_request\n\nagent = Agent(tools=[http_request])\nagent(\"Get data from https://api.example.com/data\")\n```\n\nCustom configuration with a pre-configured client:\n\n```python\nimport httpx\nfrom strands import Agent\nfrom strands.vended_tools import make_http_request\n\nclient = httpx.AsyncClient(\n    headers={\"Authorization\": \"Bearer token\"},\n)\ntool = make_http_request(client=client)\nagent = Agent(tools=[tool])\n```"
 }
]
```

📖 Full API Reference: [TypeScript](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-tools/http-request/README.md) · [Python](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_tools/http_request/README.md)

---

### Notebook

A scratchpad the agent can read and write across invocations. The most effective use is giving the agent a notebook at the start of a task and instructing it to plan its work there — it can break the task into steps, check things off as it goes, and always have a clear picture of what’s left. Notebook state is part of the agent’s state, so it persists automatically with [Session Management](lc:user-guide/concepts/agents/session-management).

*Supported in: Node.js, browsers.*

**Example - Task Management:**

```typescript
import { Agent } from '@strands-agents/sdk'
import { notebook } from '@strands-agents/sdk/vended-tools/notebook'

const agent = new Agent({
  tools: [notebook],
  systemPrompt:
    'Before starting any multi-step task, create a notebook with a checklist of steps. ' +
    'Check off each step as you complete it.',
})

// The agent uses the notebook to plan and track its work
await agent.invoke('Write a project plan for building a personal budget tracker app')
```

**Example - State Persistence:**

```typescript
import { Agent, SessionManager, FileStorage } from '@strands-agents/sdk'
import { notebook } from '@strands-agents/sdk/vended-tools/notebook'

const session = new SessionManager({
  sessionId: 'my-session',
  storage: { snapshot: new FileStorage('./sessions') },
})

const agent = new Agent({ tools: [notebook], sessionManager: session })

// Notebooks are automatically persisted as part of the session
await agent.invoke('Create a notebook called "ideas" with "# Project Ideas"')
await agent.invoke('Add "- Build a web scraper" to the ideas notebook')

// ...

// Later, a new agent with the same session restores notebooks automatically
const restoredAgent = new Agent({ tools: [notebook], sessionManager: session })
await restoredAgent.invoke('Read the ideas notebook')
```

📖 [Full API Reference](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-tools/notebook/README.md)

---

### Bash

Lets your agent run shell commands and act on the output. Shell state — variables, working directory, exported functions — persists across invocations within the same session, so the agent can build up context incrementally. Sessions can be restarted to clear state.

*Supported in: Node.js on Unix/Linux/macOS (TypeScript), all platforms (Python).*

Security Warning

This tool executes arbitrary bash commands. Without a [Sandbox](lc:user-guide/concepts/sandbox), commands run with the full permissions of the process. Only use with trusted input and consider running in a [sandboxed environment](lc:user-guide/concepts/sandbox) for production.

**Example - File Operations:**

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { bash } from '@strands-agents/sdk/vended-tools/bash'\n\nconst agent = new Agent({\n  tools: [bash],\n})\n\n// List files and create a new file\nawait agent.invoke('List all files in the current directory')\nawait agent.invoke('Create a new file called notes.txt with \"Hello World\"')\n```"
 },
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.vended_tools import bash\n\nagent = Agent(tools=[bash])\nagent(\"List all Python files in the current directory and count them\")\n```"
 }
]
```

**Example - Session Persistence (TypeScript):**

```typescript
import { Agent } from '@strands-agents/sdk'
import { bash } from '@strands-agents/sdk/vended-tools/bash'

const agent = new Agent({
  tools: [bash],
})

// Variables persist across invocations within the same session
await agent.invoke('Run: export MY_VAR="hello"')
await agent.invoke('Run: echo $MY_VAR') // Will show "hello"

// Restart session to clear state
await agent.invoke('Restart the bash session')
await agent.invoke('Run: echo $MY_VAR') // Variable will be empty
```

📖 [Full API Reference](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-tools/bash/README.md)

---

### Sleep

Pauses the agent for a bounded number of seconds. Cancelling the enclosing invocation aborts the sleep immediately rather than waiting for the full duration, so a long timer never ties up a session the caller has moved on from.

*Supported in: Node.js, modern browsers (TypeScript); all platforms (Python).*

The maximum duration is configurable at construction (default: 60 seconds) and cannot be raised by the model. Negative, `NaN`, infinite, non-numeric, and boolean durations are rejected at the tool boundary.

**Example:**

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { sleep } from '@strands-agents/sdk/vended-tools/sleep'\n\nconst agent = new Agent({\n  tools: [sleep],\n})\nawait agent.invoke('Pause for two seconds, then continue.')\n```"
 },
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.vended_tools import sleep\n\nagent = Agent(tools=[sleep])\nagent(\"Pause for two seconds, then continue.\")\n```"
 }
]
```

**Custom maximum:**

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { makeSleep } from '@strands-agents/sdk/vended-tools/sleep'\n\nconst shortSleep = makeSleep({ maxDuration: 5 })\nconst agent = new Agent({ tools: [shortSleep] })\n```"
 },
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.vended_tools import make_sleep\n\nshort_sleep = make_sleep(max_duration=5)\nagent = Agent(tools=[short_sleep])\n```"
 }
]
```

📖 [Full API Reference](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-tools/sleep/README.md)

---

### Stop (Experimental)

> This tool is experimental and subject to change in future revisions without notice.

Lets the model gracefully end the agent loop with an optional final message. The default loop already terminates when the model returns without any tool call; the stop tool is useful when you want an explicit “I am done” affordance, when a workflow enforces that termination is a deliberate model decision, or when a sub-agent needs to signal completion back to a coordinator via the loop’s last assistant message.

*Supported in: Node.js, modern browsers (TypeScript); all platforms (Python).*

This is a cooperative stop, not an abort. Any other tools the model requested in the same turn still run to completion; the loop halts after that batch without calling the model again. The final message defaults to a 4096-character cap; pass `max_message_length` / `maxMessageLength` to `make_stop` / `makeStop` when a longer summary is legitimate.

The two SDKs shim onto different loop-termination primitives, which produces a small difference in the final `AgentResult`. TypeScript halts via `AfterToolsEvent.endTurn` and returns `stopReason: "endTurn"` with the stop text as the last assistant message. Python halts via `invocation_state["request_state"]["stop_event_loop"]` and returns `stop_reason: "tool_use"` with the model’s tool-use message as the final message; the stop text lives in history as the tool result, not as a new assistant turn.

**Example:**

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { stop } from '@strands-agents/sdk/experimental/vended-tools/stop'\n\nconst agent = new Agent({\n  tools: [stop],\n  systemPrompt: 'Complete the task. Call stop with a short summary when you are done.',\n})\nawait agent.invoke('Summarize the changes in ./CHANGELOG.md')\n```"
 },
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.experimental.tools import stop\n\nagent = Agent(\n    tools=[stop],\n    system_prompt=\"Complete the task. Call stop with a short summary when you are done.\",\n)\nresult = agent(\"Summarize the changes in ./CHANGELOG.md\")\n```"
 }
]
```

📖 [Full API Reference](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/experimental/vended-tools/stop/README.md)

---

## Using Multiple Tools Together

Combine vended tools to build powerful agent workflows:

```typescript
import { Agent } from '@strands-agents/sdk'
import { bash } from '@strands-agents/sdk/vended-tools/bash'
import { fileEditor } from '@strands-agents/sdk/vended-tools/file-editor'
import { notebook } from '@strands-agents/sdk/vended-tools/notebook'

const agent = new Agent({
  tools: [bash, fileEditor, notebook],
  systemPrompt: [
    'You are a software development assistant.',
    'When given a feature to implement:',
    '1. Use the notebook tool to create a plan with a checklist of steps',
    '2. Work through each step, checking them off as you go',
    '3. Use the bash tool to run tests and verify your changes',
  ].join('\n'),
})

// Agent plans the work, implements it, and tracks progress
await agent.invoke(
  'Add input validation to the createUser function in src/users.ts. ' +
    'It should reject empty names and invalid email formats.'
)
```

## Versioning & Maintenance

Vended tools ship as part of the SDK and are updated alongside it. Report bugs and feature requests in the [GitHub repository](https://github.com/strands-agents/harness-sdk/issues).

Tool names are stable and will not change. In minor versions, a tool’s description, spec, or parameters may be updated to improve effectiveness — these changes are noted in SDK release notes. Pin your SDK version and test after upgrades if your workflows depend on specific tool behavior.

## See also

-   [Custom Tools](lc:user-guide/concepts/tools/custom-tools) — Build your own tools
-   [Community Tools Package](lc:user-guide/concepts/tools/community-tools-package) — Python tools package with 30+ tools
-   [Session Management](lc:user-guide/concepts/agents/session-management) — Persist agent state including notebooks
-   [Interrupts](lc:user-guide/concepts/interrupts) — Implement approval workflows for sensitive operations
-   [Hooks](lc:user-guide/concepts/agents/hooks) — Intercept and customize tool execution

## Related pages

- [Community Built Tools](lc:user-guide/concepts/tools/community-tools-package) (1 shared tag)
- [Creating Custom Tools](lc:user-guide/concepts/tools/custom-tools) (1 shared tag)
- [Build with AI](lc:user-guide/build-with-ai) (1 shared tag)
- [Model Context Protocol (MCP) Tools](lc:user-guide/concepts/tools/mcp-tools) (1 shared tag)
- [Tools Overview](lc:user-guide/concepts/tools) (1 shared tag)
- [Agents as Tools with Strands Agents SDK](lc:user-guide/concepts/multi-agent/agents-as-tools) (1 shared tag)
- [Agent Configuration](lc:user-guide/concepts/experimental/agent-config) (1 shared tag)


## Implementation

### TypeScript

- [harness-sdk/strands-ts/src/vended-tools/file-editor/file-editor.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-tools/file-editor/file-editor.ts)
- [harness-sdk/strands-ts/src/vended-tools/bash/bash.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-tools/bash/bash.ts)
- [harness-sdk/strands-ts/src/vended-tools/http-request/http-request.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-tools/http-request/http-request.ts)
- [harness-sdk/strands-ts/src/vended-tools/notebook/notebook.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-tools/notebook/notebook.ts)
- [harness-sdk/strands-ts/src/vended-tools/sleep/sleep.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-tools/sleep/sleep.ts)
- [harness-sdk/strands-ts/src/experimental/vended-tools/stop/stop.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/experimental/vended-tools/stop/stop.ts)

### Python

- [harness-sdk/strands-py/src/strands/vended_tools/http_request/http_request.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_tools/http_request/http_request.py)
- [harness-sdk/strands-py/src/strands/vended_tools/sleep/sleep.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_tools/sleep/sleep.py)
- [harness-sdk/strands-py/src/strands/experimental/tools/stop/stop.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/experimental/tools/stop/stop.py)
