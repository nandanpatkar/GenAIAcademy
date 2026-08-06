Strands Agents supports the [Agent-to-Agent (A2A) protocol](https://a2aproject.github.io/A2A/latest/), enabling seamless communication between AI agents across different platforms and implementations.

## What is Agent-to-Agent (A2A)?

The Agent-to-Agent protocol is an open standard that defines how AI agents can discover, communicate, and collaborate with each other.

### Use Cases

A2A protocol support enables several powerful use cases:

-   **Multi-Agent Workflows**: Chain multiple specialized agents together
-   **Agent Marketplaces**: Discover and use agents from different providers
-   **Cross-Platform Integration**: Connect Strands agents with other A2A-compatible systems
-   **Distributed AI Systems**: Build scalable, distributed agent architectures

Learn more about the A2A protocol:

-   [A2A GitHub Organization](https://github.com/a2aproject/A2A)
-   [A2A Python SDK](https://github.com/a2aproject/a2a-python)
-   [A2A Documentation](https://a2aproject.github.io/A2A/latest/)

> [!TIP] Complete Examples Available
>
> Check out the [Native A2A Support samples](https://github.com/strands-agents/samples/tree/main/python/03-integrate/protocols/a2a-native) for complete, ready-to-run client, server and tool implementations.

## Installation

To use A2A functionality with Strands, install the package with the A2A dependencies:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```bash\npip install 'strands-agents[a2a]'\n```\n\nThis installs the core Strands SDK along with the necessary A2A protocol dependencies."
 },
 {
  "label": "TypeScript",
  "body": "```bash\nnpm install @strands-agents/sdk @a2a-js/sdk express\n```\n\n`@a2a-js/sdk` and `express` are optional peer dependencies of `@strands-agents/sdk` and must be installed explicitly."
 }
]
```

## Consuming Remote Agents

The `A2AAgent` class provides the simplest way to consume remote A2A agents. It wraps the A2A protocol communication and presents a familiar interface—you can invoke it just like a regular Strands `Agent`.

Without `A2AAgent`, you need to manually resolve agent cards, configure HTTP clients, build protocol messages, and parse responses. The `A2AAgent` class handles all of this automatically.

### Basic Usage

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.agent.a2a_agent import A2AAgent\n\n# Create an A2AAgent pointing to a remote A2A server\na2a_agent = A2AAgent(endpoint=\"http://localhost:9000\")\n\n# Invoke it just like a regular Agent\nresult = a2a_agent(\"Show me 10 ^ 6\")\nprint(result.message)\n# {'role': 'assistant', 'content': [{'text': '10^6 = 1,000,000'}]}\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { A2AAgent } from '@strands-agents/sdk/a2a'\n\n// Create an A2AAgent pointing to a remote A2A server\nconst a2aAgent = new A2AAgent({ url: 'http://localhost:9000' })\n\n// Invoke it just like a regular Agent\nconst result = await a2aAgent.invoke('Show me 10 ^ 6')\nconsole.log(result.lastMessage.content)\n```"
 }
]
```

The `A2AAgent` returns an `AgentResult` just like a local `Agent`, making it easy to integrate remote agents into your existing code.

### Configuration Options

```sa-tabs
[
 {
  "label": "Python",
  "body": "The `A2AAgent` constructor accepts these parameters.\n\n| Parameter | Type | Default | Description |\n| --- | --- | --- | --- |\n| `endpoint` | `str` | Required | Base URL of the remote A2A agent |\n| `name` | `str` | None | Agent name (auto-populated from agent card if not provided) |\n| `description` | `str` | None | Agent description (auto-populated from agent card if not provided) |\n| `timeout` | `int` | 300 | Timeout for HTTP operations in seconds |\n| `a2a_client_factory` | `ClientFactory` | None | Optional pre-configured A2A client factory |"
 },
 {
  "label": "TypeScript",
  "body": "The `A2AAgent` constructor accepts a config object with these properties.\n\n| Property | Type | Default | Description |\n| --- | --- | --- | --- |\n| `url` | `string` | Required | Base URL of the remote A2A agent |\n| `agentCardPath` | `string` | `/.well-known/agent-card.json` | Path to the agent card endpoint |\n| `id` | `string` | The `url` value | Unique identifier for the agent instance |\n| `name` | `string` | From agent card | Agent name (auto-populated from agent card if not provided) |\n| `description` | `string` | From agent card | Agent description (auto-populated from agent card if not provided) |\n\nThe agent card is fetched lazily on the first `invoke()` or `stream()` call."
 }
]
```

### Asynchronous Invocation

```sa-tabs
[
 {
  "label": "Python",
  "body": "For async workflows, use `invoke_async`:\n\n```python\nimport asyncio\nfrom strands.agent.a2a_agent import A2AAgent\n\nasync def main():\n    a2a_agent = A2AAgent(endpoint=\"http://localhost:9000\")\n    result = await a2a_agent.invoke_async(\"Calculate the square root of 144\")\n    print(result.message)\n\nasyncio.run(main())\n```"
 },
 {
  "label": "TypeScript",
  "body": "In TypeScript, `invoke` is always async:\n\n```typescript\nimport { A2AAgent } from '@strands-agents/sdk/a2a'\n\nconst a2aAgent = new A2AAgent({ url: 'http://localhost:9000' })\nconst result = await a2aAgent.invoke('Calculate the square root of 144')\nconsole.log(result.lastMessage.content)\n```"
 }
]
```

### Streaming Responses

```sa-tabs
[
 {
  "label": "Python",
  "body": "For real-time streaming of responses, use `stream_async`:\n\n```python\nimport asyncio\nfrom strands.agent.a2a_agent import A2AAgent\n\nasync def main():\n    a2a_agent = A2AAgent(endpoint=\"http://localhost:9000\")\n\n    async for event in a2a_agent.stream_async(\"Explain quantum computing\"):\n        if \"data\" in event:\n            print(event[\"data\"], end=\"\", flush=True)\n\nasyncio.run(main())\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst remoteAgent = new A2AAgent({ url: 'http://localhost:9000' })\n\n// stream() yields A2AStreamUpdateEvent for each protocol event,\n// then an AgentResultEvent with the final result\nconst stream = remoteAgent.stream('Explain quantum computing')\nlet next = await stream.next()\nwhile (!next.done) {\n  console.log(next.value)\n  next = await stream.next()\n}\n// Final result\nconsole.log(next.value)\n```\n\n`A2AAgent.stream()` uses `sendMessageStream` from the A2A SDK. It yields `A2AStreamUpdateEvent` for each protocol event (messages, task status updates, artifact updates) followed by an `AgentResultEvent` with the final result."
 }
]
```

### Fetching the Agent Card

```sa-tabs
[
 {
  "label": "Python",
  "body": "You can retrieve the remote agent\u2019s metadata using `get_agent_card`:\n\n```python\nimport asyncio\nfrom strands.agent.a2a_agent import A2AAgent\n\nasync def main():\n    a2a_agent = A2AAgent(endpoint=\"http://localhost:9000\")\n    card = await a2a_agent.get_agent_card()\n    print(f\"Agent: {card.name}\")\n    print(f\"Description: {card.description}\")\n    print(f\"Skills: {card.skills}\")\n\nasyncio.run(main())\n```"
 },
 {
  "label": "TypeScript",
  "body": "The agent card is fetched and cached internally on the first `invoke()` or `stream()` call. There is no separate public method to retrieve it."
 }
]
```

## A2AAgent in Multi-Agent Patterns

The `A2AAgent` class integrates with Strands multi-agent patterns that support it. Currently, you can use remote A2A agents in [Graph](lc:user-guide/concepts/multi-agent/graph) workflows (Python only) and as [tools in an orchestrator agent](#as-a-tool).

### As a Tool

You can wrap an `A2AAgent` as a tool in an orchestrator agent’s toolkit:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, tool\nfrom strands.agent.a2a_agent import A2AAgent\n\ncalculator_agent = A2AAgent(\n    endpoint=\"http://calculator-service:9000\",\n    name=\"calculator\"\n)\n\n@tool\ndef calculate(expression: str) -> str:\n    \"\"\"Perform a mathematical calculation.\"\"\"\n    result = calculator_agent(expression)\n    return str(result.message[\"content\"][0][\"text\"])\n\norchestrator = Agent(\n    system_prompt=\"You are a helpful assistant. Use the calculate tool for math.\",\n    tools=[calculate]\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst calculatorAgent = new A2AAgent({\n  url: 'http://calculator-service:9000',\n})\n\nconst calculate = tool({\n  name: 'calculate',\n  description: 'Perform a mathematical calculation.',\n  inputSchema: z.object({\n    expression: z.string().describe('The math expression to evaluate'),\n  }),\n  callback: async (input) => {\n    const calcResult = await calculatorAgent.invoke(input.expression)\n    return String(calcResult.lastMessage.content[0])\n  },\n})\n\nconst orchestrator = new Agent({\n  systemPrompt: 'You are a helpful assistant. Use the calculate tool for math.',\n  tools: [calculate],\n})\n```"
 }
]
```

### In Graph Workflows

The `A2AAgent` works as a node in [Graph](lc:user-guide/concepts/multi-agent/graph) workflows. See [Remote Agents with A2AAgent](lc:user-guide/concepts/multi-agent/graph#remote-agents-with-a2aagent) for detailed examples of mixing local and remote agents in graph-based pipelines.

### In Swarm Patterns

> [!NOTE] Not yet supported
>
> `A2AAgent` is not currently supported in Swarm patterns in either SDK. Swarm coordination relies on tool-based handoffs that require capabilities not yet available in the A2A protocol. Use [Graph](lc:user-guide/concepts/multi-agent/graph) workflows for multi-agent patterns with remote A2A agents.

## Creating an A2A Server

### Basic Server Setup

Create a Strands agent and expose it as an A2A server:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nimport logging\nfrom strands_tools.calculator import calculator\nfrom strands import Agent\nfrom strands.multiagent.a2a import A2AServer\n\nlogging.basicConfig(level=logging.INFO)\n\n# Build a fresh agent for each A2A context so callers stay isolated\ndef create_agent(context_id: str) -> Agent:\n    return Agent(\n        name=\"Calculator Agent\",\n        description=\"A calculator agent that can perform basic arithmetic operations.\",\n        tools=[calculator],\n        callback_handler=None\n    )\n\n# Create A2A server with a per context agent factory (streaming enabled by default)\na2a_server = A2AServer(agent_factory=create_agent)\n\n# Start the server\na2a_server.serve()\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { A2AExpressServer } from '@strands-agents/sdk/a2a/express'\n\n// Build a fresh agent for each A2A context so callers stay isolated\nconst server = new A2AExpressServer({\n  agentFactory: (contextId) =>\n    new Agent({\n      systemPrompt: 'You are a calculator agent that can perform basic arithmetic.',\n    }),\n  name: 'Calculator Agent',\n  description: 'A calculator agent that can perform basic arithmetic operations.',\n})\n\nawait server.serve()\n```"
 }
]
```

The server serves the agent card at `/.well-known/agent-card.json` and handles JSON-RPC requests at the root path. Streaming is supported by default.

### Conversation Isolation

The A2A protocol identifies each conversation with a `context_id`. The server isolates conversation state per `context_id` so that callers in different contexts never read or influence each other’s history. Two modes control how that isolation works.

The recommended mode is `agent_factory` - you provide a callable that takes a `context_id` and returns a dedicated agent for each conversation, reusing it for later requests in that context. This enables different conversations to run concurrently because each owns an independent agent.

The factory is also where you wire per-conversation concerns such as a `session_manager` to persist that conversation’s history.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.multiagent.a2a import A2AServer\n\ndef create_agent(context_id: str) -> Agent:\n    return Agent(\n        name=\"Calculator Agent\",\n        description=\"A calculator agent.\",\n        callback_handler=None\n    )\n\na2a_server = A2AServer(agent_factory=create_agent)\na2a_server.serve()\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, SessionManager, FileStorage } from '@strands-agents/sdk'\nimport { A2AExpressServer } from '@strands-agents/sdk/a2a/express'\n\n// The factory runs once per contextId and returns a dedicated agent, so each conversation\n// is isolated. Wire an optional sessionManager here to persist that conversation's history,\n// scoped to the contextId.\nconst storage = new FileStorage('./sessions')\n\nconst server = new A2AExpressServer({\n  agentFactory: (contextId) =>\n    new Agent({\n      name: 'Calculator Agent',\n      description: 'A calculator agent.',\n      sessionManager: new SessionManager({\n        sessionId: contextId,\n        storage: { snapshot: storage },\n      }),\n    }),\n  name: 'Calculator Agent',\n  maxContexts: 1000,\n})\n\nawait server.serve()\n```"
 }
]
```

The server retains at most `max_contexts` contexts at once (default 1000). When that cap is exceeded, the server evicts the least recently used context, and a later request that reuses the evicted `context_id` starts a fresh conversation. Tune this cap to bound memory in long running servers.

> [!WARNING] `context_id` is not an authentication boundary
>
> Contexts are keyed on the client supplied `context_id`. A caller who knows another caller’s `context_id` can attach to that conversation. Multi-tenant deployments must enforce authenticated identity at the transport or gateway layer.

> [!WARNING] Passing a single `agent` is deprecated
>
> In single-agent mode the server reuses one agent across every context, swapping each context’s saved state on and off the shared instance under a lock, which serializes all requests. A single `agent` with a configured `session_manager` is rejected, because the session manager would persist every context into one interleaved session. Prefer `agent_factory` for any deployment that serves more than one conversation.

### Answering Interrupts

> [!NOTE] Python only
>
> This feature is currently available in the Python SDK only.

When a tool or hook on the served agent raises an [interrupt](lc:user-guide/concepts/interrupts), the task moves to the A2A `input_required` state and waits. The client answers it, and the task resumes the paused tool exactly where it stopped.

Answering an interrupt is the one flow on this page that needs the raw [`a2a-sdk`](https://github.com/a2aproject/a2a-python) client rather than `A2AAgent`. `A2AAgent` speaks in text, so it raises `ValueError` if you pass it interrupt responses, and it drops the `DataPart` carrying the interrupt ids when it reads the reply. The examples below build A2A messages directly.

Each interrupt has a server-generated id, and an answer is bound to the id of the interrupt that raised it. The server advertises the pending interrupts on the `input_required` status message as a `DataPart`, alongside the human-readable `TextPart`:

```json
{
  "kind": "data",
  "data": {
    "interrupts": [
      {
        "interruptId": "v1:tool_call:tu-1:a71adb48-e65d-55fa-b155-0359c9cd3b66",
        "name": "approve_campaign",
        "reason": {"name": "spring-launch"}
      }
    ]
  }
}
```

To answer, send a new message on the same `taskId` containing a `DataPart` that echoes the `interruptId` back with the response:

```json
{
  "kind": "data",
  "data": {
    "interruptResponse": {
      "interruptId": "v1:tool_call:tu-1:a71adb48-e65d-55fa-b155-0359c9cd3b66",
      "response": {"approved": true}
    }
  }
}
```

The `response` becomes the return value of the `interrupt()` call that paused the tool. It is any JSON value except `null`, which the server refuses — a null answer would leave the interrupt unsatisfied and re-raise it. `false` and `0` are fine. Answer several interrupts in one message by sending one `DataPart` for each.

Reading the ids off the status message and answering them:

```python
from a2a.types import DataPart, Part

# The task parked in input_required; read the interrupts it is waiting on.
pending = next(
    part.root.data["interrupts"]
    for part in task.status.message.parts
    if isinstance(part.root, DataPart) and "interrupts" in part.root.data
)

# Answer each one on the same taskId.
answers = [
    Part(root=DataPart(data={
        "interruptResponse": {"interruptId": item["interruptId"], "response": {"approved": True}}
    }))
    for item in pending
]
```

The server rejects an answer it cannot bind, before the agent runs, so a refused answer leaves the interrupt pending and the task still answerable. An answer is rejected when:

-   its `interruptId` does not match an interrupt the task is waiting on
-   no interrupt is pending
-   the same `interruptId` is answered twice in one message
-   the payload is missing `interruptId`, or its `response` is missing or `null`
-   it is sent alongside other content parts

A task with a pending interrupt also rejects an ordinary conversational message — answer the interrupt, or cancel the task.

A `DataPart` without an `interruptResponse` key is unaffected and continues to reach the agent as structured data.

### Server Configuration Options

```sa-tabs
[
 {
  "label": "Python",
  "body": "The `A2AServer` constructor accepts several configuration options:\n\n-   `agent_factory`: Callable that takes a `context_id` and returns a fresh agent per context (recommended)\n-   `agent`: A single Strands agent reused across contexts (deprecated; prefer `agent_factory`)\n-   `max_contexts`: Maximum number of per context agents to retain concurrently (default: 1000, must be at least 1)\n-   `host`: Hostname or IP address to bind to (default: \u201c127.0.0.1\u201d)\n-   `port`: Port to bind to (default: 9000)\n-   `version`: Version of the agent (default: \u201c0.0.1\u201d)\n-   `skills`: Custom list of agent skills (default: auto-generated from tools)\n-   `http_url`: Public HTTP URL where this agent will be accessible (optional, enables path-based mounting)\n-   `serve_at_root`: Forces server to serve at root path regardless of http\\_url path (default: False)\n-   `task_store`: Custom task storage implementation (defaults to InMemoryTaskStore)\n-   `queue_manager`: Custom message queue management (optional)\n-   `push_config_store`: Custom push notification configuration storage (optional)\n-   `push_sender`: Custom push notification sender implementation (optional)\n\nProvide exactly one of `agent_factory` or `agent`, recommend `agent_factory`."
 },
 {
  "label": "TypeScript",
  "body": "The TypeScript SDK provides two server classes:\n\n-   **`A2AServer`**: Base class that manages the agent card and request handler. Use this when integrating with your own HTTP framework.\n-   **`A2AExpressServer`**: Express based server with `serve()` and `createMiddleware()` methods.\n\nThe `A2AExpressServer` constructor accepts a config object:\n\n-   `agentFactory`: Callable that takes a `contextId` and returns a fresh agent per context (recommended)\n-   `agent`: A single Strands Agent reused across contexts (deprecated; prefer `agentFactory`)\n-   `maxContexts`: Maximum number of per context agents to retain concurrently (default: 1000, must be at least 1)\n-   `name` (required): Human-readable name for the agent\n-   `description`: Description of the agent\u2019s purpose\n-   `host`: Host to bind the server to (default: `'127.0.0.1'`)\n-   `port`: Port to listen on (default: `9000`)\n-   `version`: Version string for the agent card (default: `'0.0.1'`)\n-   `httpUrl`: Public URL override for the agent card\n-   `skills`: Skills to advertise in the agent card\n-   `taskStore`: Task store for persisting task state (defaults to InMemoryTaskStore)\n-   `userBuilder`: User builder for authentication (default: no authentication)\n\nProvide exactly one of `agentFactory` or `agent`, recommend `agentFactory`.\n\n```typescript\nconst server = new A2AExpressServer({\n  agentFactory: (contextId) =>\n    new Agent({\n      systemPrompt: 'You are a helpful agent.',\n    }),\n  name: 'My Agent',\n  description: 'A helpful agent',\n  // Retain at most 1000 per context agents; evict least recently used\n  maxContexts: 1000,\n  host: '0.0.0.0',\n  port: 8080,\n  version: '1.0.0',\n  httpUrl: 'https://my-agent.example.com', // Public URL override\n  skills: [\n    { id: 'math', name: 'Math', description: 'Performs calculations', tags: [] },\n  ],\n})\n\nawait server.serve()\n```"
 }
]
```

### Advanced Server Customization

```sa-tabs
[
 {
  "label": "Python",
  "body": "The `A2AServer` provides access to the underlying FastAPI or Starlette application objects allowing you to further customize server behavior.\n\n```python\nfrom contextlib import asynccontextmanager\nfrom strands import Agent\nfrom strands.multiagent.a2a import A2AServer\nimport uvicorn\n\n# Create your agent factory and A2A server\ndef create_agent(context_id: str) -> Agent:\n    return Agent(name=\"My Agent\", description=\"A customizable agent\", callback_handler=None)\n\na2a_server = A2AServer(agent_factory=create_agent)\n\n@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    \"\"\"Manage application lifespan with proper error handling.\"\"\"\n    # Startup tasks\n    yield  # Application runs here\n    # Shutdown tasks\n\n# Access the underlying FastAPI app\n# Allows passing keyword arguments to FastAPI constructor for further customization\nfastapi_app = a2a_server.to_fastapi_app(app_kwargs={\"lifespan\": lifespan})\n# Add custom middleware, routes, or configuration\nfastapi_app.add_middleware(...)\n\n# Or access the Starlette app\n# Allows passing keyword arguments to FastAPI constructor for further customization\nstarlette_app = a2a_server.to_starlette_app(app_kwargs={\"lifespan\": lifespan})\n# Customize as needed\n\n# You can then serve the customized app directly\nuvicorn.run(fastapi_app, host=\"127.0.0.1\", port=9000)\n```"
 },
 {
  "label": "TypeScript",
  "body": "The `A2AExpressServer` exposes a `createMiddleware()` method that returns an Express Router, which you can mount in your own Express app:\n\n```typescript\nconst express = (await import('express')).default\n\nconst server = new A2AExpressServer({\n  agentFactory: (contextId) =>\n    new Agent({ systemPrompt: 'You are a customizable agent.' }),\n  name: 'My Agent',\n  description: 'A customizable agent',\n})\n\n// Get the A2A middleware as an Express Router\nconst a2aRouter = server.createMiddleware()\n\n// Create your own Express app with custom routes/middleware\nconst app = express()\napp.get('/health', (_req, res) => {\n  res.json({ status: 'ok' })\n})\napp.use(a2aRouter)\n\napp.listen(9000, '127.0.0.1', () => {\n  console.log('Server listening on http://127.0.0.1:9000')\n})\n```\n\nYou can also use an `AbortSignal` for graceful shutdown:\n\n```typescript\nconst server = new A2AExpressServer({\n  agentFactory: (contextId) => new Agent({ systemPrompt: 'You are a helpful agent.' }),\n  name: 'My Agent',\n})\n\nconst controller = new AbortController()\nawait server.serve({ signal: controller.signal })\n\n// Later, to stop the server:\ncontroller.abort()\n```"
 }
]
```

#### Configurable Request Handler Components

```sa-tabs
[
 {
  "label": "Python",
  "body": "The `A2AServer` supports configurable request handler components for advanced customization:\n\n```python\nfrom strands import Agent\nfrom strands.multiagent.a2a import A2AServer\nfrom a2a.server.tasks import TaskStore, PushNotificationConfigStore, PushNotificationSender\nfrom a2a.server.events import QueueManager\n\n# Custom task storage implementation\nclass CustomTaskStore(TaskStore):\n    # Implementation details...\n    pass\n\n# Custom queue manager\nclass CustomQueueManager(QueueManager):\n    # Implementation details...\n    pass\n\n# Create an agent factory with custom components\ndef create_agent(context_id: str) -> Agent:\n    return Agent(name=\"My Agent\", description=\"A customizable agent\", callback_handler=None)\n\na2a_server = A2AServer(\n    agent_factory=create_agent,\n    task_store=CustomTaskStore(),\n    queue_manager=CustomQueueManager(),\n    push_config_store=MyPushConfigStore(),\n    push_sender=MyPushSender()\n)\n```\n\n**Interface Requirements:**\n\nCustom implementations must follow these interfaces:\n\n-   `task_store`: Must implement `TaskStore` interface from `a2a.server.tasks`\n-   `queue_manager`: Must implement `QueueManager` interface from `a2a.server.events`\n-   `push_config_store`: Must implement `PushNotificationConfigStore` interface from `a2a.server.tasks`\n-   `push_sender`: Must implement `PushNotificationSender` interface from `a2a.server.tasks`"
 },
 {
  "label": "TypeScript",
  "body": "The TypeScript `A2AExpressServer` supports a custom `taskStore` for persisting task state:\n\n```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { A2AExpressServer } from '@strands-agents/sdk/a2a/express'\n\nconst server = new A2AExpressServer({\n  agentFactory: (contextId) => new Agent({ systemPrompt: 'You are a helpful agent.' }),\n  name: 'My Agent',\n  taskStore: myCustomTaskStore, // Must implement TaskStore from @a2a-js/sdk/server\n})\n```"
 }
]
```

#### Path-Based Mounting for Containerized Deployments

```sa-tabs
[
 {
  "label": "Python",
  "body": "The `A2AServer` supports automatic path-based mounting for deployment scenarios involving load balancers or reverse proxies. This allows you to deploy agents behind load balancers with different path prefixes.\n\n```python\nfrom strands import Agent\nfrom strands.multiagent.a2a import A2AServer\n\n# Create an agent factory\ndef create_agent(context_id: str) -> Agent:\n    return Agent(\n        name=\"Calculator Agent\",\n        description=\"A calculator agent\",\n        callback_handler=None\n    )\n\n# Deploy with path-based mounting\n# The agent will be accessible at http://my-alb.amazonaws.com/calculator/\na2a_server = A2AServer(\n    agent_factory=create_agent,\n    http_url=\"http://my-alb.amazonaws.com/calculator\"\n)\n\n# For load balancers that strip path prefixes, use serve_at_root=True\na2a_server_with_root = A2AServer(\n    agent_factory=create_agent,\n    http_url=\"http://my-alb.amazonaws.com/calculator\",\n    serve_at_root=True  # Serves at root even though URL has /calculator path\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "Use the `httpUrl` option to set the public URL for the agent card. For custom path mounting, use `createMiddleware()` and mount the router at any path in your Express app:\n\n```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { A2AExpressServer } from '@strands-agents/sdk/a2a/express'\n\nconst server = new A2AExpressServer({\n  agentFactory: (contextId) => new Agent({ systemPrompt: 'A calculator agent.' }),\n  name: 'Calculator Agent',\n  httpUrl: 'http://my-alb.amazonaws.com/calculator',\n})\n\nconst express = (await import('express')).default\nconst app = express()\napp.use('/calculator', server.createMiddleware())\napp.listen(9000)\n```"
 }
]
```

## Strands A2A Tool

### Installation

To use the A2A client tool, install strands-agents-tools with the A2A extra:

```bash
pip install 'strands-agents-tools[a2a_client]'
```

Strands provides this tool for discovering and interacting with A2A agents without manually writing client code:

```python
import asyncio
import logging
from strands import Agent
from strands_tools.a2a_client import A2AClientToolProvider

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create A2A client tool provider with known agent URLs
# Assuming you have an A2A server running on 127.0.0.1:9000
# known_agent_urls is optional
provider = A2AClientToolProvider(known_agent_urls=["http://127.0.0.1:9000"])

# Create agent with A2A client tools
agent = Agent(tools=provider.tools)

# The agent can now discover and interact with A2A servers
# Standard usage
response = agent("pick an agent and make a sample call")
logger.info(response)

# Alternative Async usage
# async def main():
#     response = await agent.invoke_async("pick an agent and make a sample call")
#     logger.info(response)
# asyncio.run(main())
```

The A2A client tool provides three main capabilities:

-   **Agent Discovery**: Automatically discover available A2A agents and their capabilities
-   **Protocol Communication**: Send messages to A2A agents using the standardized protocol
-   **Natural Language Interface**: Interact with remote agents using natural language commands

## Troubleshooting

If you encounter bugs or need to request features for A2A support:

1.  Check the [A2A documentation](https://a2aproject.github.io/A2A/latest/) for protocol-specific issues
2.  Report Strands-specific issues on [GitHub](https://github.com/strands-agents/harness-sdk/issues/new/choose)
3.  Include relevant error messages and code samples in your reports

## Related pages

- [Agent Workflows: Building Multi-Agent Systems with Strands Agents SDK](lc:user-guide/concepts/multi-agent/workflow) (1 shared tag)
- [Graph Multi-Agent Pattern](lc:user-guide/concepts/multi-agent/graph) (1 shared tag)
- [Multi-agent Patterns](lc:user-guide/concepts/multi-agent/multi-agent-patterns) (1 shared tag)
- [Swarm Multi-Agent Pattern](lc:user-guide/concepts/multi-agent/swarm) (1 shared tag)
- [Agents as Tools with Strands Agents SDK](lc:user-guide/concepts/multi-agent/agents-as-tools) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/agent/a2a_agent.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/agent/a2a_agent.py)
- [harness-sdk/strands-py/src/strands/multiagent/a2a/server.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/multiagent/a2a/server.py)
- [harness-sdk/strands-py/src/strands/multiagent/a2a/executor.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/multiagent/a2a/executor.py)

### TypeScript

- [harness-sdk/strands-ts/src/a2a/a2a-agent.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/a2a/a2a-agent.ts)
- [harness-sdk/strands-ts/src/a2a/server.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/a2a/server.ts)
- [harness-sdk/strands-ts/src/a2a/executor.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/a2a/executor.ts)
