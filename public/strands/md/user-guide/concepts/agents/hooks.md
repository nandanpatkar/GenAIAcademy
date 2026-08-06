Hooks are a composable extensibility mechanism for extending agent functionality by subscribing to events throughout the agent lifecycle. The hook system enables both built-in components and user code to react to or modify agent behavior through strongly-typed event callbacks.

## Overview

The hooks system is a composable, type-safe system that supports multiple subscribers per event type.

A **Hook Event** is a specific event in the lifecycle that callbacks can be associated with. A **Hook Callback** is a callback function that is invoked when the hook event is emitted.

Hooks enable use cases such as:

-   Monitoring agent execution and tool usage
-   Modifying tool execution behavior
-   Adding validation and error handling
-   Monitoring multi-agent execution flow and node transitions
-   Debugging complex orchestration patterns
-   Implementing custom logging and metrics collection

## Basic Usage

Hook callbacks are registered against specific event types and receive strongly-typed event objects when those events occur during agent execution. Each event carries relevant data for that stage of the agent lifecycle - for example, `BeforeInvocationEvent` includes agent and request details, while `BeforeToolCallEvent` provides tool information and parameters.

### Registering Individual Hook Callbacks

The simplest way to register a hook callback is using the `agent.add_hook()``agent.addHook()` method:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.hooks import BeforeInvocationEvent, BeforeToolCallEvent\n\nagent = Agent()\n\n# Register individual callbacks\ndef my_callback(event: BeforeInvocationEvent) -> None:\n    print(\"Custom callback triggered\")\n\nagent.add_hook(my_callback, BeforeInvocationEvent)\n\n# Type inference: If your callback has a type hint, the event type is inferred\ndef typed_callback(event: BeforeToolCallEvent) -> None:\n    print(f\"Tool called: {event.tool_use['name']}\")\n\nagent.add_hook(typed_callback)  # Event type inferred from type hint\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst agent = new Agent()\n\n// Register individual callback\nconst myCallback = (event: BeforeInvocationEvent) => {\n  console.log('Custom callback triggered')\n}\n\nagent.addHook(BeforeInvocationEvent, myCallback)\n```"
 }
]
```

For multi-agent orchestrators, you can register callbacks for orchestration events:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\n# Create your orchestrator (Graph or Swarm)\norchestrator = Graph(...)\n\n# Register individual callbacks\ndef my_callback(event: BeforeNodeCallEvent) -> None:\n    print(f\"Custom callback triggered\")\n\norchestrator.hooks.add_callback(BeforeNodeCallEvent, my_callback)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst researcher = new Agent({\n  id: 'researcher',\n  systemPrompt: 'You are a research specialist.',\n})\nconst writer = new Agent({\n  id: 'writer',\n  systemPrompt: 'You are a writing specialist.',\n})\n\nconst graph = new Graph({\n  nodes: [researcher, writer],\n  edges: [['researcher', 'writer']],\n})\n\n// Register individual callbacks on the orchestrator\ngraph.addHook(BeforeNodeCallEvent, (event) => {\n  console.log(`Node ${event.nodeId} starting`)\n})\n\ngraph.addHook(AfterNodeCallEvent, (event) => {\n  console.log(`Node ${event.nodeId} completed`)\n})\n```"
 }
]
```

### Using Plugins for Multiple Hooks

For packaging multiple related hooks together, [Plugins](lc:user-guide/concepts/plugins) provide a convenient way to bundle hooks with configuration and tools:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.plugins import Plugin, hook\nfrom strands.hooks import BeforeToolCallEvent, AfterToolCallEvent\n\nclass LoggingPlugin(Plugin):\n    name = \"logging-plugin\"\n\n    @hook\n    def log_before(self, event: BeforeToolCallEvent) -> None:\n        print(f\"Calling: {event.tool_use['name']}\")\n\n    @hook\n    def log_after(self, event: AfterToolCallEvent) -> None:\n        print(f\"Completed: {event.tool_use['name']}\")\n\nagent = Agent(plugins=[LoggingPlugin()])\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nclass LoggingPlugin implements Plugin {\n  name = 'logging-plugin'\n\n  initAgent(agent: LocalAgent): void {\n    agent.addHook(BeforeToolCallEvent, (event) => {\n      console.log(`Calling: ${event.toolUse.name}`)\n    })\n\n    agent.addHook(AfterToolCallEvent, (event) => {\n      console.log(`Completed: ${event.toolUse.name}`)\n    })\n  }\n}\n\nconst agent = new Agent({ plugins: [new LoggingPlugin()] })\n```"
 }
]
```

See [Plugins](lc:user-guide/concepts/plugins) for more information on creating and using plugins.

## Hook Event Lifecycle

### Single-Agent Lifecycle

The following diagram shows when hook events are emitted during a typical agent invocation where tools are invoked:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```mermaid\nflowchart LR\n subgraph Start[\"Request Start Events\"]\n    direction TB\n        BeforeInvocationEvent[\"BeforeInvocationEvent\"]\n        StartMessage[\"MessageAddedEvent\"]\n        BeforeInvocationEvent --> StartMessage\n  end\n subgraph Model[\"Model Events\"]\n    direction TB\n        BeforeModelCallEvent[\"BeforeModelCallEvent\"]\n        AfterModelCallEvent[\"AfterModelCallEvent\"]\n        ModelMessage[\"MessageAddedEvent\"]\n        BeforeModelCallEvent --> AfterModelCallEvent\n        AfterModelCallEvent --> ModelMessage\n  end\n  subgraph Tool[\"Tool Events\"]\n    direction TB\n        BeforeToolCallEvent[\"BeforeToolCallEvent\"]\n        AfterToolCallEvent[\"AfterToolCallEvent\"]\n        ToolMessage[\"MessageAddedEvent\"]\n        BeforeToolCallEvent --> AfterToolCallEvent\n        AfterToolCallEvent --> ToolMessage\n  end\n  subgraph End[\"Request End Events\"]\n    direction TB\n        AfterInvocationEvent[\"AfterInvocationEvent\"]\n  end\nStart --> Model\nModel <--> Tool\nTool --> End\n```"
 },
 {
  "label": "TypeScript",
  "body": "```mermaid\nflowchart LR\n subgraph Start[\"Request Start Events\"]\n    direction TB\n        BeforeInvocationEvent[\"BeforeInvocationEvent\"]\n        StartMessage[\"MessageAddedEvent\"]\n        BeforeInvocationEvent --> StartMessage\n  end\n subgraph Model[\"Model Events\"]\n    direction TB\n        BeforeModelCallEvent[\"BeforeModelCallEvent\"]\n        ModelStreamUpdateEvent[\"ModelStreamUpdateEvent\"]\n        ContentBlockEvent[\"ContentBlockEvent\"]\n        ModelMessageEvent[\"ModelMessageEvent\"]\n        AfterModelCallEvent[\"AfterModelCallEvent\"]\n        ModelMessage[\"MessageAddedEvent\"]\n        BeforeModelCallEvent --> ModelStreamUpdateEvent\n        ModelStreamUpdateEvent --> ContentBlockEvent\n        ContentBlockEvent --> ModelMessageEvent\n        ModelMessageEvent --> AfterModelCallEvent\n        AfterModelCallEvent --> ModelMessage\n  end\n  subgraph Tool[\"Tool Events\"]\n    direction TB\n        BeforeToolCallEvent[\"BeforeToolCallEvent\"]\n        ToolStreamUpdateEvent[\"ToolStreamUpdateEvent\"]\n        ToolResultEvent[\"ToolResultEvent\"]\n        AfterToolCallEvent[\"AfterToolCallEvent\"]\n        ToolMessage[\"MessageAddedEvent\"]\n        BeforeToolCallEvent --> ToolStreamUpdateEvent\n        ToolStreamUpdateEvent --> ToolResultEvent\n        ToolResultEvent --> AfterToolCallEvent\n        AfterToolCallEvent --> ToolMessage\n  end\n  subgraph End[\"Request End Events\"]\n    direction TB\n        AgentResultEvent[\"AgentResultEvent\"]\n        AfterInvocationEvent[\"AfterInvocationEvent\"]\n        InterruptEvent[\"InterruptEvent\"]\n        AgentResultEvent --> AfterInvocationEvent\n        InterruptEvent --> AfterInvocationEvent\n  end\nStart --> Model\nModel <--> Tool\nTool --> End\n```"
 }
]
```

### Multi-Agent Lifecycle

The following diagram shows when multi-agent hook events are emitted during orchestrator execution:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```mermaid\nflowchart LR\nsubgraph Init[\"Initialization\"]\n    direction TB\n    MultiAgentInitializedEvent[\"MultiAgentInitializedEvent\"]\nend\nsubgraph Invocation[\"Invocation Lifecycle\"]\n    direction TB\n    BeforeMultiAgentInvocationEvent[\"BeforeMultiAgentInvocationEvent\"]\n    AfterMultiAgentInvocationEvent[\"AfterMultiAgentInvocationEvent\"]\n    BeforeMultiAgentInvocationEvent --> NodeExecution\n    NodeExecution --> AfterMultiAgentInvocationEvent\nend\nsubgraph NodeExecution[\"Node Execution (Repeated)\"]\n    direction TB\n    BeforeNodeCallEvent[\"BeforeNodeCallEvent\"]\n    AfterNodeCallEvent[\"AfterNodeCallEvent\"]\n    BeforeNodeCallEvent --> AfterNodeCallEvent\nend\nInit --> Invocation\n```"
 },
 {
  "label": "TypeScript",
  "body": "```mermaid\nflowchart LR\nsubgraph Init[\"Initialization\"]\n    direction TB\n    MultiAgentInitializedEvent[\"MultiAgentInitializedEvent\"]\nend\nsubgraph Invocation[\"Invocation Lifecycle\"]\n    direction TB\n    BeforeMultiAgentInvocationEvent[\"BeforeMultiAgentInvocationEvent\"]\n    AfterMultiAgentInvocationEvent[\"AfterMultiAgentInvocationEvent\"]\n    MultiAgentResultEvent[\"MultiAgentResultEvent\"]\n    BeforeMultiAgentInvocationEvent --> NodeExecution\n    NodeExecution --> AfterMultiAgentInvocationEvent\n    AfterMultiAgentInvocationEvent --> MultiAgentResultEvent\nend\nsubgraph NodeExecution[\"Node Execution (Repeated)\"]\n    direction TB\n    BeforeNodeCallEvent[\"BeforeNodeCallEvent\"]\n    NodeStreamUpdateEvent[\"NodeStreamUpdateEvent\"]\n    AfterNodeCallEvent[\"AfterNodeCallEvent\"]\n    NodeResultEvent[\"NodeResultEvent\"]\n    MultiAgentHandoffEvent[\"MultiAgentHandoffEvent\"]\n    BeforeNodeCallEvent --> NodeStreamUpdateEvent\n    NodeStreamUpdateEvent --> AfterNodeCallEvent\n    AfterNodeCallEvent --> NodeResultEvent\n    NodeResultEvent --> MultiAgentHandoffEvent\nend\nInit --> Invocation\n```"
 }
]
```

### Available Events

```sa-tabs
[
 {
  "label": "Python",
  "body": "| Event | Description |\n| --- | --- |\n| `AgentInitializedEvent` | Triggered when an agent has been constructed and finished initialization at the end of the agent constructor. |\n| `BeforeInvocationEvent` | Triggered at the beginning of a new agent invocation request |\n| `AfterInvocationEvent` | Triggered at the end of an agent request, regardless of success or failure. Uses reverse callback ordering |\n| `MessageAddedEvent` | Triggered when a message is added to the agent\u2019s conversation history |\n| `BeforeModelCallEvent` | Triggered before the model is invoked for inference |\n| `AfterModelCallEvent` | Triggered after model invocation completes. Uses reverse callback ordering |\n| `BeforeToolCallEvent` | Triggered before a tool is invoked |\n| `AfterToolCallEvent` | Triggered after tool invocation completes. Uses reverse callback ordering |\n| `MultiAgentInitializedEvent` | Triggered when multi-agent orchestrator is initialized |\n| `BeforeMultiAgentInvocationEvent` | Triggered before orchestrator execution starts |\n| `AfterMultiAgentInvocationEvent` | Triggered after orchestrator execution completes. Uses reverse callback ordering |\n| `BeforeNodeCallEvent` | Triggered before individual node execution starts |\n| `AfterNodeCallEvent` | Triggered after individual node execution completes. Uses reverse callback ordering |"
 },
 {
  "label": "TypeScript",
  "body": "All events extend `HookableEvent`, making them both streamable via `agent.stream()` and subscribable via hook callbacks.\n\n| Event | Description |\n| --- | --- |\n| `AgentInitializedEvent` | Triggered when an agent has been constructed and finished initialization at the end of the agent constructor. |\n| `BeforeInvocationEvent` | Triggered at the beginning of a new agent invocation request |\n| `AfterInvocationEvent` | Triggered at the end of an agent request, regardless of success or failure. Uses reverse callback ordering |\n| `MessageAddedEvent` | Triggered when a message is added to the agent\u2019s conversation history |\n| `BeforeModelCallEvent` | Triggered before the model is invoked for inference |\n| `AfterModelCallEvent` | Triggered after model invocation completes. Uses reverse callback ordering |\n| `ModelStreamUpdateEvent` | Wraps each transient streaming delta from the model during inference. Access via `.event` |\n| `ContentBlockEvent` | Wraps a fully assembled content block (TextBlock, ToolUseBlock, ReasoningBlock). Access via `.contentBlock` |\n| `ModelMessageEvent` | Wraps the complete model message after all blocks are assembled. Access via `.message` |\n| `BeforeToolCallEvent` | Triggered before a tool is invoked |\n| `AfterToolCallEvent` | Triggered after tool invocation completes. Uses reverse callback ordering |\n| `BeforeToolsEvent` | Triggered before tools are executed in a batch |\n| `AfterToolsEvent` | Triggered after tools are executed in a batch. Uses reverse callback ordering |\n| `ToolStreamUpdateEvent` | Wraps streaming progress events from tool execution. Access via `.event` |\n| `ToolResultEvent` | Wraps a completed tool result. Access via `.result` |\n| `AgentResultEvent` | Wraps the final agent result at the end of the invocation. Access via `.result` |\n| `InterruptEvent` | Fires once per unanswered interrupt when the agent halts to wait for responses. Access via `.interrupt` |\n| `MultiAgentInitializedEvent` | Triggered when a multi-agent orchestrator has finished initialization |\n| `BeforeMultiAgentInvocationEvent` | Triggered before orchestrator execution starts |\n| `AfterMultiAgentInvocationEvent` | Triggered after orchestrator execution completes. Uses reverse callback ordering |\n| `BeforeNodeCallEvent` | Triggered before individual node execution starts |\n| `NodeStreamUpdateEvent` | Wraps an inner streaming event from a node with the node\u2019s identity. Access via `.event` |\n| `NodeCancelEvent` | Triggered when a node is cancelled via `BeforeNodeCallEvent.cancel` |\n| `AfterNodeCallEvent` | Triggered after individual node execution completes. Uses reverse callback ordering |\n| `NodeResultEvent` | Wraps a completed node result. Access via `.result` |\n| `MultiAgentHandoffEvent` | Triggered when execution transitions between nodes |\n| `MultiAgentResultEvent` | Wraps the final multi-agent result at the end of orchestration. Access via `.result` |"
 }
]
```

## Hook Behaviors

### Event Properties

Most event properties are read-only to prevent unintended modifications. However, certain properties can be modified to influence agent behavior:

```sa-tabs
[
 {
  "label": "Python",
  "body": "-   [`AfterModelCallEvent`](lc:api/python/strands.hooks.events#AfterModelCallEvent)\n    \n    -   `retry` - Request a retry of the model invocation. See [Model Call Retry](#model-call-retry).\n-   [`BeforeToolCallEvent`](lc:api/python/strands.hooks.events#BeforeToolCallEvent)\n    \n    -   `cancel_tool` - Cancel tool execution with a message. See [Limit Tool Counts](#limit-tool-counts).\n    -   `selected_tool` - Replace the tool to be executed. See [Tool Interception](#tool-interception).\n    -   `tool_use` - Modify tool parameters before execution. See [Fixed Tool Arguments](#fixed-tool-arguments).\n-   [`AfterToolCallEvent`](lc:api/python/strands.hooks.events#AfterToolCallEvent)\n    \n    -   `result` - Modify the tool result. See [Result Modification](#result-modification).\n    -   `retry` - Request a retry of the tool invocation. See [Tool Call Retry](#tool-call-retry).\n    -   `exception` *(read-only)* - The original exception if the tool raised one, otherwise `None`. See [Exception Handling](#exception-handling).\n-   [`AfterInvocationEvent`](lc:api/python/strands.hooks.events#AfterInvocationEvent)\n    \n    -   `resume` - Trigger a follow-up agent invocation with new input. See [Invocation resume](#invocation-resume)."
 },
 {
  "label": "TypeScript",
  "body": "-   `BeforeInvocationEvent`\n    \n    -   `cancel` - Cancel the agent invocation with a message.\n-   `BeforeModelCallEvent`\n    \n    -   `cancel` - Cancel the model call with a message.\n-   `BeforeToolsEvent`\n    \n    -   `cancel` - Cancel all tool calls in a batch with a message. See [Limit Tool Counts](#limit-tool-counts).\n-   `BeforeToolCallEvent`\n    \n    -   `cancel` - Cancel tool execution with a message. See [Limit Tool Counts](#limit-tool-counts).\n    -   `selectedTool` - Replace the tool to be executed with a different `Tool` instance. See [Tool Interception](#tool-interception).\n    -   `toolUse` - Mutable. Rewrite `name`, `toolUseId`, or `input` before execution. Renaming `name` re-resolves the tool from the registry when `selectedTool` is not set. See [Fixed Tool Arguments](#fixed-tool-arguments).\n-   `AfterModelCallEvent`\n    \n    -   `retry` - Request a retry of the model invocation.\n-   `AfterToolCallEvent`\n    \n    -   `retry` - Request a retry of the tool invocation.\n    -   `result` - Mutable. Rewrite the `ToolResultBlock` before it propagates to the model. See [Result Modification](#result-modification).\n-   `AfterInvocationEvent`\n    \n    -   `resume` - Trigger a follow-up agent invocation with new input. Setting it re-enters the agent loop under the same invocation lock. See [Invocation resume](#invocation-resume)."
 }
]
```

### Callback Ordering

```sa-tabs
[
 {
  "label": "Python",
  "body": "By default, After event callbacks run in reverse registration order for cleanup symmetry. You can override this with explicit priority using the `order` option \u2014 lower values run first.\n\nThe SDK exports convenience presets that mark where the SDK\u2019s own hooks run, so you can position yours relative to them:\n\n-   `HookOrder.SDK_FIRST` (-100) \u2014 where the SDK\u2019s earliest hooks run\n-   `HookOrder.DEFAULT` (0) \u2014 implicit when no order is specified\n-   `HookOrder.SDK_LAST` (100) \u2014 where the SDK\u2019s latest hooks run\n\nThese are not enforced bounds \u2014 any numeric value works. Use values beyond them (e.g. `SDK_FIRST - 1`) to run before or after the SDK\u2019s hooks, or `float('-inf')`/`float('inf')` for guaranteed absolute ordering.\n\n```python\nfrom strands import Agent\nfrom strands.hooks import BeforeModelCallEvent, HookOrder\n\nagent = Agent()\n\ndef early_hook(event: BeforeModelCallEvent) -> None:\n    print(\"I run first\")\n\ndef late_hook(event: BeforeModelCallEvent) -> None:\n    print(\"I run last\")\n\nagent.add_hook(early_hook, order=HookOrder.SDK_FIRST)\nagent.add_hook(late_hook, order=HookOrder.SDK_LAST)\n```\n\nWithin the same order group, Before events preserve registration order and After events reverse it."
 },
 {
  "label": "TypeScript",
  "body": "By default, After event callbacks run in reverse registration order for cleanup symmetry. You can override this with explicit priority using the `order` option \u2014 lower values run first.\n\nThe SDK exports convenience presets that mark where the SDK\u2019s own hooks run, so you can position yours relative to them:\n\n-   `HookOrder.SDK_FIRST` (-100) \u2014 where the SDK\u2019s earliest hooks run\n-   `HookOrder.DEFAULT` (0) \u2014 implicit when no order is specified\n-   `HookOrder.SDK_LAST` (100) \u2014 where the SDK\u2019s latest hooks run\n\nThese are not enforced bounds \u2014 any numeric value works. Use values beyond them (e.g. `SDK_FIRST - 1`) to run before or after the SDK\u2019s hooks, or `-Infinity`/`Infinity` for guaranteed absolute ordering.\n\n```typescript\nimport { Agent, HookOrder, BeforeToolCallEvent } from '@strands-agents/sdk'\n\nconst agent = new Agent()\n\nagent.addHook(BeforeToolCallEvent, (event) => {\n  console.log('[logging] Tool called:', event.toolUse.name)\n}) // HookOrder.DEFAULT (0)\n\n// Run before the SDK's earliest hooks\nagent.addHook(\n  BeforeToolCallEvent,\n  (event) => {\n    console.log('[guardrail] Runs before SDK hooks')\n  },\n  { order: HookOrder.SDK_FIRST - 1 }\n)\n\n// Arbitrary numbers for fine-grained control\nagent.addHook(\n  BeforeToolCallEvent,\n  (event) => {\n    console.log('[validation] Validating input')\n  },\n  { order: -50 }\n)\n\n// Use -Infinity/Infinity for guaranteed absolute first/last\nagent.addHook(\n  BeforeToolCallEvent,\n  (event) => {\n    console.log('[absolute] Always runs first, no matter what')\n  },\n  { order: -Infinity }\n)\n```\n\nWithin the same order group, Before events preserve registration order and After events reverse it."
 }
]
```

## Advanced Usage

### Accessing Invocation State in Hooks

Invocation state provides configuration and context data passed through the agent or orchestrator invocation. This is particularly useful for:

1.  **Custom Objects**: Access database client objects, connection pools, or other Python objects
2.  **Request Context**: Access session IDs, user information, settings, or request-specific data
3.  **Multi-Agent Shared State**: In multi-agent patterns, access state shared across all agents - see [Shared State Across Multi-Agent Patterns](lc:user-guide/concepts/multi-agent/multi-agent-patterns#shared-state-across-multi-agent-patterns)
4.  **Custom Parameters**: Pass any additional data that hooks might need

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.hooks import BeforeToolCallEvent\nimport logging\n\ndef log_with_context(event: BeforeToolCallEvent) -> None:\n    \"\"\"Log tool invocations with context from invocation state.\"\"\"\n    # Access invocation state from the event\n    user_id = event.invocation_state.get(\"user_id\", \"unknown\")\n    session_id = event.invocation_state.get(\"session_id\")\n\n    # Access non-JSON serializable objects like database connections\n    db_connection = event.invocation_state.get(\"database_connection\")\n    logger_instance = event.invocation_state.get(\"custom_logger\")\n\n    # Use custom logger if provided, otherwise use default\n    logger = logger_instance if logger_instance else logging.getLogger(__name__)\n\n    logger.info(\n        f\"User {user_id} in session {session_id} \"\n        f\"invoking tool: {event.tool_use['name']} \"\n        f\"with DB connection: {db_connection is not None}\"\n    )\n\n# Register the hook\nagent = Agent(tools=[my_tool])\nagent.hooks.add_callback(BeforeToolCallEvent, log_with_context)\n\n# Execute with context including non-serializable objects\nimport sqlite3\ncustom_logger = logging.getLogger(\"custom\")\ndb_conn = sqlite3.connect(\":memory:\")\n\nresult = agent(\n    \"Process the data\",\n    user_id=\"user123\",\n    session_id=\"sess456\",\n    database_connection=db_conn,  # Non-JSON serializable object\n    custom_logger=custom_logger   # Non-JSON serializable object\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst agent = new Agent()\n\nagent.addHook(BeforeToolCallEvent, (event) => {\n  // Read caller-provided context\n  const userId = event.invocationState.userId as string | undefined\n  const sessionId = event.invocationState.sessionId as string | undefined\n\n  console.log(\n    `User ${userId} (session ${sessionId}) ` + `invoking tool: ${event.toolUse.name}`\n  )\n})\n\n// Pass invocation state when invoking the agent\nconst result = await agent.invoke('Process the data', {\n  invocationState: {\n    userId: 'user123',\n    sessionId: 'sess456',\n  },\n})\n\n// The same object is returned on the result\nconsole.log(result.invocationState.userId) // 'user123'\n```"
 }
]
```

Multi-agent hook events provide access to:

```sa-tabs
[
 {
  "label": "Python",
  "body": "-   **source**: The multi-agent orchestrator instance (for example: Graph/Swarm)\n-   **node\\_id**: Identifier of the node being executed (for node-level events)\n-   **invocation\\_state**: Configuration and context data passed through the orchestrator invocation"
 },
 {
  "label": "TypeScript",
  "body": "-   **orchestrator**: The multi-agent orchestrator instance (for example: Graph/Swarm)\n-   **nodeId**: Identifier of the node being executed (for node-level events)\n-   **state**: The `MultiAgentState` for the current invocation, including an `app` field for custom consumer state"
 }
]
```

### Tool Interception

Modify or replace tools before execution:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nclass ToolInterceptor(HookProvider):\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(BeforeToolCallEvent, self.intercept_tool)\n\n    def intercept_tool(self, event: BeforeToolCallEvent) -> None:\n        if event.tool_use.name == \"sensitive_tool\":\n            # Replace with a safer alternative\n            event.selected_tool = self.safe_alternative_tool\n            event.tool_use[\"name\"] = \"safe_tool\"\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport {\n  BeforeToolCallEvent,\n  type LocalAgent,\n  type Plugin,\n  type FunctionTool,\n} from '@strands-agents/sdk'\n\nclass ToolInterceptor implements Plugin {\n  name = 'tool-interceptor'\n\n  constructor(private readonly safeAlternative: FunctionTool) {}\n\n  initAgent(agent: LocalAgent): void {\n    agent.addHook(BeforeToolCallEvent, (event) => this.interceptTool(event))\n  }\n\n  private interceptTool(event: BeforeToolCallEvent): void {\n    if (event.toolUse.name !== 'sensitive_tool') return\n    // Run a safer tool in place of the registry's match for this call.\n    event.selectedTool = this.safeAlternative\n    // Mirror the rename on toolUse so the model sees the substitution.\n    event.toolUse.name = this.safeAlternative.name\n  }\n}\n```"
 }
]
```

### Result Modification

Modify tool results after execution:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nclass ResultProcessor(HookProvider):\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(AfterToolCallEvent, self.process_result)\n\n    def process_result(self, event: AfterToolCallEvent) -> None:\n        if event.tool_use.name == \"calculator\":\n            # Add formatting to calculator results\n            original_content = event.result[\"content\"][0][\"text\"]\n            event.result[\"content\"][0][\"text\"] = f\"Result: {original_content}\"\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport {\n  AfterToolCallEvent,\n  ToolResultBlock,\n  TextBlock,\n  type LocalAgent,\n  type Plugin,\n} from '@strands-agents/sdk'\n\nclass ResultProcessor implements Plugin {\n  name = 'result-processor'\n\n  initAgent(agent: LocalAgent): void {\n    agent.addHook(AfterToolCallEvent, (event) => this.processResult(event))\n  }\n\n  private processResult(event: AfterToolCallEvent): void {\n    if (event.toolUse.name !== 'calculator') return\n\n    // Prefix calculator output before it propagates to the model.\n    event.result = new ToolResultBlock({\n      toolUseId: event.result.toolUseId,\n      status: event.result.status,\n      content: event.result.content.map((block) =>\n        block.type === 'textBlock' ? new TextBlock(`Result: ${block.text}`) : block\n      ),\n      ...(event.result.error !== undefined ? { error: event.result.error } : {}),\n    })\n  }\n}\n```"
 }
]
```

### Conditional Node Execution

Implement custom logic to modify orchestration behavior in multi-agent systems:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nclass ConditionalExecutionHook(HookProvider):\n    def __init__(self, skip_conditions: dict[str, callable]):\n        self.skip_conditions = skip_conditions\n\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(BeforeNodeCallEvent, self.check_execution_conditions)\n\n    def check_execution_conditions(self, event: BeforeNodeCallEvent) -> None:\n        node_id = event.node_id\n        if node_id in self.skip_conditions:\n            condition_func = self.skip_conditions[node_id]\n            if condition_func(event.invocation_state):\n                print(f\"Skipping node {node_id} due to condition\")\n                # Note: Actual node skipping would require orchestrator-specific implementation\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst researcher = new Agent({\n  id: 'researcher',\n  systemPrompt: 'You are a research specialist.',\n})\nconst writer = new Agent({\n  id: 'writer',\n  systemPrompt: 'You are a writing specialist.',\n})\nconst reviewer = new Agent({\n  id: 'reviewer',\n  systemPrompt: 'You are a review specialist.',\n})\n\nconst graph = new Graph({\n  nodes: [researcher, writer, reviewer],\n  edges: [\n    ['researcher', 'writer'],\n    ['writer', 'reviewer'],\n  ],\n})\n\n// Cancel specific nodes based on custom conditions\ngraph.addHook(BeforeNodeCallEvent, (event) => {\n  if (event.nodeId === 'reviewer') {\n    // Cancel with a custom message\n    event.cancel = 'Skipping review for this run'\n  }\n})\n```"
 }
]
```

## Best Practices

### Composability

Design hooks to be composable and reusable:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nclass RequestLoggingHook(HookProvider):\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(BeforeInvocationEvent, self.log_request)\n        registry.add_callback(AfterInvocationEvent, self.log_response)\n        registry.add_callback(BeforeToolCallEvent, self.log_tool_use)\n\n    ...\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nclass RequestLoggingHook implements Plugin {\n  name = 'request-logging'\n\n  initAgent(agent: LocalAgent): void {\n    agent.addHook(BeforeInvocationEvent, (ev) => this.logRequest(ev))\n    agent.addHook(AfterInvocationEvent, (ev) => this.logResponse(ev))\n    agent.addHook(BeforeToolCallEvent, (ev) => this.logToolUse(ev))\n  }\n\n  // ...\n```"
 }
]
```

### Event Property Modifications

When modifying event properties, log the changes for debugging and audit purposes:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nclass ResultProcessor(HookProvider):\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(AfterToolCallEvent, self.process_result)\n\n    def process_result(self, event: AfterToolCallEvent) -> None:\n        if event.tool_use.name == \"calculator\":\n            original_content = event.result[\"content\"][0][\"text\"]\n            logger.info(f\"Modifying calculator result: {original_content}\")\n            event.result[\"content\"][0][\"text\"] = f\"Result: {original_content}\"\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport {\n  AfterToolCallEvent,\n  ToolResultBlock,\n  TextBlock,\n  type LocalAgent,\n  type Plugin,\n} from '@strands-agents/sdk'\n\nclass ResultProcessor implements Plugin {\n  name = 'result-processor'\n\n  initAgent(agent: LocalAgent): void {\n    agent.addHook(AfterToolCallEvent, (event) => this.processResult(event))\n  }\n\n  private processResult(event: AfterToolCallEvent): void {\n    if (event.toolUse.name !== 'calculator') return\n\n    const original = event.result.content.find((block) => block.type === 'textBlock')\n    if (original?.type !== 'textBlock') return\n\n    // Log the change before mutating so the audit trail captures both states.\n    console.log(`Modifying calculator result: ${original.text}`)\n    event.result = new ToolResultBlock({\n      toolUseId: event.result.toolUseId,\n      status: event.result.status,\n      content: event.result.content.map((block) =>\n        block.type === 'textBlock' ? new TextBlock(`Result: ${block.text}`) : block\n      ),\n      ...(event.result.error !== undefined ? { error: event.result.error } : {}),\n    })\n  }\n}\n```"
 }
]
```

### Orchestrator-Agnostic Design

Design multi-agent hooks to work with different orchestrator types:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nclass UniversalMultiAgentHook(HookProvider):\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(BeforeNodeCallEvent, self.handle_node_execution)\n\n    def handle_node_execution(self, event: BeforeNodeCallEvent) -> None:\n        orchestrator_type = type(event.source).__name__\n        print(f\"Executing node {event.node_id} in {orchestrator_type} orchestrator\")\n\n        # Handle orchestrator-specific logic if needed\n        if orchestrator_type == \"Graph\":\n            self.handle_graph_node(event)\n        elif orchestrator_type == \"Swarm\":\n            self.handle_swarm_node(event)\n\n    def handle_graph_node(self, event: BeforeNodeCallEvent) -> None:\n        # Graph-specific handling\n        pass\n\n    def handle_swarm_node(self, event: BeforeNodeCallEvent) -> None:\n        # Swarm-specific handling\n        pass\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nclass UniversalMultiAgentPlugin implements MultiAgentPlugin {\n  readonly name = 'universal-multi-agent'\n\n  initMultiAgent(orchestrator: MultiAgent): void {\n    orchestrator.addHook(BeforeNodeCallEvent, (event) => {\n      console.log(`Executing node ${event.nodeId} in ${orchestrator.id} orchestrator`)\n\n      // Handle orchestrator-specific logic if needed\n      if (orchestrator instanceof Graph) {\n        this.handleGraphNode(event)\n      } else if (orchestrator instanceof Swarm) {\n        this.handleSwarmNode(event)\n      }\n    })\n  }\n\n  private handleGraphNode(event: BeforeNodeCallEvent): void {\n    // Graph-specific handling\n  }\n\n  private handleSwarmNode(event: BeforeNodeCallEvent): void {\n    // Swarm-specific handling\n  }\n}\n```"
 }
]
```

## Integration with Multi-Agent Systems

Multi-agent hooks complement single-agent hooks. Individual agents within the orchestrator can still have their own hooks, creating a layered monitoring and customization system:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\n# Single-agent hook for individual agents\nclass AgentLevelHook(HookProvider):\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(BeforeToolCallEvent, self.log_tool_use)\n\n    def log_tool_use(self, event: BeforeToolCallEvent) -> None:\n        print(f\"Agent tool call: {event.tool_use['name']}\")\n\n# Multi-agent hook for orchestrator\nclass OrchestratorLevelHook(HookProvider):\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(BeforeNodeCallEvent, self.log_node_execution)\n\n    def log_node_execution(self, event: BeforeNodeCallEvent) -> None:\n        print(f\"Orchestrator node execution: {event.node_id}\")\n\n# Create agents with individual hooks\nagent1 = Agent(tools=[tool1], hooks=[AgentLevelHook()])\nagent2 = Agent(tools=[tool2], hooks=[AgentLevelHook()])\n\n# Create orchestrator with multi-agent hooks\norchestrator = Graph(\n    agents={\"agent1\": agent1, \"agent2\": agent2},\n    hooks=[OrchestratorLevelHook()]\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Agent-level hooks via plugins\nclass AgentLoggingPlugin implements Plugin {\n  name = 'agent-logging'\n\n  initAgent(agent: LocalAgent): void {\n    agent.addHook(BeforeToolCallEvent, (event) => {\n      console.log(`Agent tool call: ${event.toolUse.name}`)\n    })\n  }\n}\n\n// Create agents with individual hooks\nconst agent1 = new Agent({ id: 'agent1', plugins: [new AgentLoggingPlugin()] })\nconst agent2 = new Agent({ id: 'agent2', plugins: [new AgentLoggingPlugin()] })\n\n// Orchestrator-level hooks via MultiAgentPlugin\nclass OrchestratorLoggingPlugin implements MultiAgentPlugin {\n  readonly name = 'orchestrator-logging'\n\n  initMultiAgent(orchestrator: MultiAgent): void {\n    orchestrator.addHook(BeforeNodeCallEvent, (event) => {\n      console.log(`Orchestrator node execution: ${event.nodeId}`)\n    })\n  }\n}\n\n// Create orchestrator with multi-agent hooks\nconst graph = new Graph({\n  nodes: [agent1, agent2],\n  edges: [['agent1', 'agent2']],\n  plugins: [new OrchestratorLoggingPlugin()],\n})\n```"
 }
]
```

This layered approach provides comprehensive observability and control across both individual agent execution and orchestrator-level coordination.

## Cookbook

This section contains practical hook implementations for common use cases.

### Fixed Tool Arguments

Useful for enforcing security policies, maintaining consistency, or overriding agent decisions with system-level requirements. This hook ensures specific tools always use predetermined parameter values regardless of what the agent specifies.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom typing import Any\nfrom strands.hooks import HookProvider, HookRegistry, BeforeToolCallEvent\n\nclass ConstantToolArguments(HookProvider):\n    \"\"\"Use constant argument values for specific parameters of a tool.\"\"\"\n\n    def __init__(self, fixed_tool_arguments: dict[str, dict[str, Any]]):\n        \"\"\"\n        Initialize fixed parameter values for tools.\n\n        Args:\n            fixed_tool_arguments: A dictionary mapping tool names to dictionaries of\n                parameter names and their fixed values. These values will override any\n                values provided by the agent when the tool is invoked.\n        \"\"\"\n        self._tools_to_fix = fixed_tool_arguments\n\n    def register_hooks(self, registry: HookRegistry, **kwargs: Any) -> None:\n        registry.add_callback(BeforeToolCallEvent, self._fix_tool_arguments)\n\n    def _fix_tool_arguments(self, event: BeforeToolCallEvent):\n        # If the tool is in our list of parameters, then use those parameters\n        if parameters_to_fix := self._tools_to_fix.get(event.tool_use[\"name\"]):\n            tool_input: dict[str, Any] = event.tool_use[\"input\"]\n            tool_input.update(parameters_to_fix)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nclass ConstantToolArguments implements Plugin {\n  private fixedToolArguments: Record<string, Record<string, unknown>>\n\n  /**\n   * Initialize fixed parameter values for tools.\n   *\n   * @param fixedToolArguments - A dictionary mapping tool names to dictionaries of\n   *     parameter names and their fixed values. These values will override any\n   *     values provided by the agent when the tool is invoked.\n   */\n  constructor(fixedToolArguments: Record<string, Record<string, unknown>>) {\n    this.fixedToolArguments = fixedToolArguments\n  }\n\n  name = 'constant-tool-arguments'\n\n  initAgent(agent: LocalAgent): void {\n    agent.addHook(BeforeToolCallEvent, (ev) => this.fixToolArguments(ev))\n  }\n\n  private fixToolArguments(event: BeforeToolCallEvent): void {\n    // If the tool is in our list of parameters, then use those parameters\n    const parametersToFix = this.fixedToolArguments[event.toolUse.name]\n    if (parametersToFix) {\n      const toolInput = event.toolUse.input as Record<string, unknown>\n      Object.assign(toolInput, parametersToFix)\n    }\n  }\n}\n```"
 }
]
```

For example, to always force the `calculator` tool to use precision of 1 digit:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfix_parameters = ConstantToolArguments({\n    \"calculator\": {\n        \"precision\": 1,\n    }\n})\n\nagent = Agent(tools=[calculator], hooks=[fix_parameters])\nresult = agent(\"What is 2 / 3?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst fixParameters = new ConstantToolArguments({\n  calculator: {\n    precision: 1,\n  },\n})\n\nconst agent = new Agent({ tools: [calculator], plugins: [fixParameters] })\nconst result = await agent.invoke('What is 2 / 3?')\n```"
 }
]
```

### Limit Tool Counts

Useful for preventing runaway tool usage, implementing rate limiting, or enforcing usage quotas. This hook tracks tool invocations per request and replaces tools with error messages when limits are exceeded.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import tool\nfrom strands.hooks import HookRegistry, HookProvider, BeforeToolCallEvent, BeforeInvocationEvent\nfrom threading import Lock\n\nclass LimitToolCounts(HookProvider):\n    \"\"\"Limits the number of times tools can be called per agent invocation\"\"\"\n\n    def __init__(self, max_tool_counts: dict[str, int]):\n        \"\"\"\n        Initializer.\n\n        Args:\n            max_tool_counts: A dictionary mapping tool names to max call counts for\n                tools. If a tool is not specified in it, the tool can be called as many\n                times as desired\n        \"\"\"\n        self.max_tool_counts = max_tool_counts\n        self.tool_counts = {}\n        self._lock = Lock()\n\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(BeforeInvocationEvent, self.reset_counts)\n        registry.add_callback(BeforeToolCallEvent, self.intercept_tool)\n\n    def reset_counts(self, event: BeforeInvocationEvent) -> None:\n        with self._lock:\n            self.tool_counts = {}\n\n    def intercept_tool(self, event: BeforeToolCallEvent) -> None:\n        tool_name = event.tool_use[\"name\"]\n        with self._lock:\n            max_tool_count = self.max_tool_counts.get(tool_name)\n            tool_count = self.tool_counts.get(tool_name, 0) + 1\n            self.tool_counts[tool_name] = tool_count\n\n        if max_tool_count and tool_count > max_tool_count:\n            event.cancel_tool = (\n                f\"Tool '{tool_name}' has been invoked too many and is now being throttled. \"\n                f\"DO NOT CALL THIS TOOL ANYMORE \"\n            )\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nclass LimitToolCounts implements Plugin {\n  private maxToolCounts: Record<string, number>\n  private toolCounts: Record<string, number> = {}\n\n  /**\n   * Initialize with maximum allowed invocations per tool.\n   *\n   * @param maxToolCounts - A dictionary mapping tool names to their maximum\n   *     allowed invocation counts per agent invocation.\n   */\n  constructor(maxToolCounts: Record<string, number>) {\n    this.maxToolCounts = maxToolCounts\n  }\n\n  name = 'limit-tool-counts'\n\n  initAgent(agent: LocalAgent): void {\n    agent.addHook(BeforeInvocationEvent, () => this.resetCounts())\n    agent.addHook(BeforeToolCallEvent, (event) => this.interceptTool(event))\n  }\n\n  private resetCounts(): void {\n    this.toolCounts = {}\n  }\n\n  private interceptTool(event: BeforeToolCallEvent): void {\n    const toolName = event.toolUse.name\n    const maxToolCount = this.maxToolCounts[toolName]\n    const toolCount = (this.toolCounts[toolName] ?? 0) + 1\n    this.toolCounts[toolName] = toolCount\n\n    if (maxToolCount !== undefined && toolCount > maxToolCount) {\n      event.cancel =\n        `Tool '${toolName}' has been invoked too many times and is now being throttled. ` +\n        `DO NOT CALL THIS TOOL ANYMORE`\n    }\n  }\n}\n```"
 }
]
```

For example, to limit the `sleep` tool to 3 invocations per invocation:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nlimit_hook = LimitToolCounts(max_tool_counts={\"sleep\": 3})\n\nagent = Agent(tools=[sleep], hooks=[limit_hook])\n\n# This call will only have 3 successful sleeps\nagent(\"Sleep 5 times for 10ms each or until you can't anymore\")\n# This will sleep successfully again because the count resets every invocation\nagent(\"Sleep once\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst limitPlugin = new LimitToolCounts({ sleep: 3 })\n\nconst agent = new Agent({ tools: [sleep], plugins: [limitPlugin] })\n\n// This call will only have 3 successful sleeps\nawait agent.invoke(\"Sleep 5 times for 10ms each or until you can't anymore\")\n// This will sleep successfully again because the count resets every invocation\nawait agent.invoke('Sleep once')\n```"
 }
]
```

### Model Call Retry

Useful for implementing custom retry logic for model invocations. The `AfterModelCallEvent.retry` field allows hooks to request retries based on any criteria—exceptions, response validation, content quality checks, or any custom logic. This example demonstrates retrying on exceptions with exponential backoff:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nimport asyncio\nimport logging\nfrom strands.hooks import HookProvider, HookRegistry, BeforeInvocationEvent, AfterModelCallEvent\n\nlogger = logging.getLogger(__name__)\n\nclass RetryOnServiceUnavailable(HookProvider):\n    \"\"\"Retry model calls when ServiceUnavailable errors occur.\"\"\"\n\n    def __init__(self, max_retries: int = 3):\n        self.max_retries = max_retries\n        self.retry_count = 0\n\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(BeforeInvocationEvent, self.reset_counts)\n        registry.add_callback(AfterModelCallEvent, self.handle_retry)\n\n    def reset_counts(self, event: BeforeInvocationEvent = None) -> None:\n        self.retry_count = 0\n\n    async def handle_retry(self, event: AfterModelCallEvent) -> None:\n        if event.exception:\n            if \"ServiceUnavailable\" in str(event.exception):\n                logger.info(\"ServiceUnavailable encountered\")\n                if self.retry_count < self.max_retries:\n                    logger.info(\"Retrying model call\")\n                    self.retry_count += 1\n                    event.retry = True\n                    await asyncio.sleep(2 ** self.retry_count)  # Exponential backoff\n        else:\n            # Reset counts on successful call\n            self.reset_counts()\n```"
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// This feature is not yet available in TypeScript SDK\n```"
 }
]
```

For example, to retry up to 3 times on service unavailable errors:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\nretry_hook = RetryOnServiceUnavailable(max_retries=3)\nagent = Agent(hooks=[retry_hook])\n\nresult = agent(\"What is the capital of France?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// This feature is not yet available in TypeScript SDK\n```"
 }
]
```

### Exception Handling

When a tool raises an exception, the agent converts it to an error result and returns it to the model, allowing the model to adjust its approach and retry. This works well for expected errors like validation failures, but for unexpected errors—assertion failures, configuration errors, or bugs—you may want to fail immediately rather than let the model retry futilely. The `exception` property on `AfterToolCallEvent` provides access to the original exception, enabling hooks to inspect error types and selectively propagate those that shouldn’t be retried:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nclass PropagateUnexpectedExceptions(HookProvider):\n    \"\"\"Re-raise unexpected exceptions instead of returning them to the model.\"\"\"\n\n    def __init__(self, allowed_exceptions: tuple[type[Exception], ...] = (ValueError,)):\n        self.allowed_exceptions = allowed_exceptions\n\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(AfterToolCallEvent, self._check_exception)\n\n    def _check_exception(self, event: AfterToolCallEvent) -> None:\n        if event.exception is None:\n            return  # Tool succeeded\n        if isinstance(event.exception, self.allowed_exceptions):\n            return  # Let model retry these\n        raise event.exception  # Propagate unexpected errors\n```\n\n```python\n# Usage\nagent = Agent(\n    model=model,\n    tools=[my_tool],\n    hooks=[PropagateUnexpectedExceptions(allowed_exceptions=(ValueError, ValidationError))],\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// This feature is not yet available in TypeScript SDK\n```"
 }
]
```

### Tool Call Retry

Useful for implementing custom retry logic for tool invocations. The `AfterToolCallEvent.retry` field allows hooks to request that a tool be re-executed—for example, to handle transient errors, timeouts, or flaky external services. When `retry` is set to `True`, the tool executor discards the current result and invokes the tool again with the same `tool_use_id`.

> [!NOTE] Streaming behavior
>
> When a tool call is retried, intermediate streaming events (`ToolStreamEvent`) from discarded attempts will have already been emitted to callers. Only the final attempt’s `ToolResultEvent` is emitted and added to conversation history. Callers consuming streamed events should be prepared to handle events from discarded attempts.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nimport logging\nfrom strands.hooks import HookProvider, HookRegistry, AfterToolCallEvent\n\nlogger = logging.getLogger(__name__)\n\nclass RetryOnToolError(HookProvider):\n    \"\"\"Retry tool calls that fail with errors.\"\"\"\n\n    def __init__(self, max_retries: int = 1):\n        self.max_retries = max_retries\n        self._attempt_counts: dict[str, int] = {}\n\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(AfterToolCallEvent, self.handle_retry)\n\n    def handle_retry(self, event: AfterToolCallEvent) -> None:\n        tool_use_id = str(event.tool_use.get(\"toolUseId\", \"\"))\n        tool_name = event.tool_use.get(\"name\", \"unknown\")\n\n        # Track attempts per tool_use_id\n        attempt = self._attempt_counts.get(tool_use_id, 0) + 1\n        self._attempt_counts[tool_use_id] = attempt\n\n        if event.result.get(\"status\") == \"error\" and attempt <= self.max_retries:\n            logger.info(f\"Retrying tool '{tool_name}' (attempt {attempt}/{self.max_retries})\")\n            event.retry = True\n        elif event.result.get(\"status\") != \"error\":\n            # Clean up tracking on success\n            self._attempt_counts.pop(tool_use_id, None)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// This feature is not yet available in TypeScript SDK\n```"
 }
]
```

For example, to retry failed tool calls once:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, tool\n\n@tool\ndef flaky_api_call(query: str) -> str:\n    \"\"\"Call an external API that sometimes fails.\n\n    Args:\n        query: The query to send.\n    \"\"\"\n    import random\n    if random.random() < 0.5:\n        raise RuntimeError(\"Service temporarily unavailable\")\n    return f\"Result for: {query}\"\n\nretry_hook = RetryOnToolError(max_retries=1)\nagent = Agent(tools=[flaky_api_call], hooks=[retry_hook])\n\nresult = agent(\"Look up the weather\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// This feature is not yet available in TypeScript SDK\n```"
 }
]
```

### Invocation resume

The `AfterInvocationEvent.resume` property enables a hook to trigger a follow-up agent invocation after the current one completes. When you set `resume` to any valid agent input (a string, content blocks, or messages), the agent automatically re-invokes itself with that input instead of returning to the caller. This starts a full new invocation cycle, including firing `BeforeInvocationEvent`.

This is useful for building autonomous looping patterns where the agent continues processing based on its previous result—for example, re-evaluating after tool execution, injecting additional context, or implementing multi-step workflows within a single call.

> [!NOTE] Resume input types
>
> The `resume` value accepts any valid `AgentInput`: a string, a list of content blocks, a list of messages, or interrupt responses. When the agent is in an interrupt state, you must provide interrupt responses (not a plain string) to resume correctly.

The following example checks the agent result and triggers one follow-up invocation to ask the model to summarize its work:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.hooks import AfterInvocationEvent\n\nresume_count = 0\n\nasync def summarize_after_tools(event: AfterInvocationEvent):\n    \"\"\"Resume once to ask the model to summarize its work.\"\"\"\n    global resume_count\n    if resume_count == 0 and event.result and event.result.stop_reason == \"end_turn\":\n        resume_count += 1\n        event.resume = \"Now summarize what you just did in one sentence.\"\n\nagent = Agent()\nagent.add_hook(summarize_after_tools)\n\n# The agent processes the initial request, then automatically\n# performs a second invocation to generate the summary\nresult = agent(\"Look up the weather in Seattle\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, AfterInvocationEvent } from '@strands-agents/sdk'\n\nlet resumeCount = 0\n\nconst agent = new Agent({})\nagent.addHook(AfterInvocationEvent, (event) => {\n  // Resume once after a clean turn to ask the model for a one-line summary.\n  if (resumeCount === 0) {\n    resumeCount += 1\n    event.resume = 'Now summarize what you just did in one sentence.'\n  }\n})\n\nconst result = await agent.invoke('Look up the weather in Seattle')\n```"
 }
]
```

You can also use `resume` to chain multiple re-invocations. Make sure to include a termination condition to avoid infinite loops:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.hooks import AfterInvocationEvent\n\nMAX_ITERATIONS = 3\niteration = 0\n\nasync def iterative_refinement(event: AfterInvocationEvent):\n    \"\"\"Re-invoke the agent up to MAX_ITERATIONS times for iterative refinement.\"\"\"\n    global iteration\n    if iteration < MAX_ITERATIONS and event.result:\n        iteration += 1\n        event.resume = f\"Review your previous response and improve it. Iteration {iteration} of {MAX_ITERATIONS}.\"\n\nagent = Agent()\nagent.add_hook(iterative_refinement)\n\nresult = agent(\"Draft a haiku about programming\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, AfterInvocationEvent } from '@strands-agents/sdk'\n\nconst MAX_ITERATIONS = 3\nlet iteration = 0\n\nconst agent = new Agent({})\nagent.addHook(AfterInvocationEvent, (event) => {\n  if (iteration >= MAX_ITERATIONS) return\n  iteration += 1\n  event.resume = `Review your previous response and improve it. Iteration ${iteration} of ${MAX_ITERATIONS}.`\n})\n\nconst result = await agent.invoke('Draft a haiku about programming')\n```"
 }
]
```

#### Handling interrupts with resume

The `resume` property integrates with the [interrupt](lc:user-guide/concepts/tools) system. When an agent invocation ends because of an interrupt, a hook can automatically handle the interrupt by resuming with interrupt responses. This avoids returning the interrupt to the caller.

When the agent is in an interrupt state, you must resume with a list of `interruptResponse` objects. Passing a plain string raises a `TypeError`.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, tool\nfrom strands.hooks import AfterInvocationEvent, BeforeToolCallEvent\n\n@tool\ndef send_email(to: str, body: str) -> str:\n    \"\"\"Send an email.\n\n    Args:\n        to: Recipient address.\n        body: Email body.\n    \"\"\"\n    return f\"Email sent to {to}\"\n\ndef require_approval(event: BeforeToolCallEvent):\n    \"\"\"Interrupt before sending emails to require approval.\"\"\"\n    if event.tool_use[\"name\"] == \"send_email\":\n        event.interrupt(\"email_approval\", reason=\"Approve this email?\")\n\nasync def auto_approve(event: AfterInvocationEvent):\n    \"\"\"Automatically approve all interrupted tool calls.\"\"\"\n    if event.result and event.result.stop_reason == \"interrupt\":\n        responses = [\n            {\"interruptResponse\": {\"interruptId\": intr.id, \"response\": \"approved\"}}\n            for intr in event.result.interrupts\n        ]\n        event.resume = responses\n\nagent = Agent(tools=[send_email])\nagent.add_hook(require_approval)\nagent.add_hook(auto_approve)\n\n# The interrupt is handled automatically by the hook\u2014\n# the caller receives the final result directly\nresult = agent(\"Send an email to alice@example.com saying hello\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport {\n  Agent,\n  AfterInvocationEvent,\n  BeforeToolCallEvent,\n  InterruptEvent,\n} from '@strands-agents/sdk'\nimport type { Interrupt } from '@strands-agents/sdk'\n\nconst agent = new Agent({ tools: [] })\n\n// Track interrupts as they fire so AfterInvocationEvent can build resume input.\nconst pendingInterrupts: Interrupt[] = []\n\nagent.addHook(BeforeToolCallEvent, (event) => {\n  if (event.toolUse.name === 'send_email') {\n    event.interrupt({ name: 'email_approval', reason: 'Approve this email?' })\n  }\n})\n\nagent.addHook(InterruptEvent, (event) => {\n  pendingInterrupts.push(event.interrupt)\n})\n\nagent.addHook(AfterInvocationEvent, (event) => {\n  if (pendingInterrupts.length === 0) return\n  // Auto-approve every interrupted tool call so the caller never sees the interrupt.\n  event.resume = pendingInterrupts.map((interrupt) => ({\n    interruptResponse: {\n      interruptId: interrupt.id,\n      response: 'approved',\n    },\n  }))\n  pendingInterrupts.length = 0\n})\n\nconst result = await agent.invoke('Send an email to alice@example.com saying hello')\n```"
 }
]
```

## HookProvider Protocol

For advanced use cases, you can implement the `HookProvider` protocol to create objects that register multiple callbacks at once. This is useful when building reusable hook collections without the full plugin infrastructure:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.hooks import HookProvider, HookRegistry, BeforeInvocationEvent, AfterInvocationEvent\n\nclass RequestLogger(HookProvider):\n    def register_hooks(self, registry: HookRegistry) -> None:\n        registry.add_callback(BeforeInvocationEvent, self.log_start)\n        registry.add_callback(AfterInvocationEvent, self.log_end)\n\n    def log_start(self, event: BeforeInvocationEvent) -> None:\n        print(f\"Request started for agent: {event.agent.name}\")\n\n    def log_end(self, event: AfterInvocationEvent) -> None:\n        print(f\"Request completed for agent: {event.agent.name}\")\n\n# Pass via hooks parameter\nagent = Agent(hooks=[RequestLogger()])\n\n# Or add after creation\nagent.hooks.add_hook(RequestLogger())\n```\n\nFor most use cases, [Plugins](lc:user-guide/concepts/plugins) provide a more convenient way to bundle multiple hooks with additional features like auto-discovery and tool registration."
 },
 {
  "label": "TypeScript",
  "body": "> [!NOTE] TypeScript SDK\n>\n> The TypeScript SDK does not export a `HookProvider` interface. Instead, use the [Plugin](lc:user-guide/concepts/plugins) class to bundle multiple hooks together. The `Plugin` class provides `initAgent()` for registering hooks and `getTools()` for providing tools.\n\n```typescript\nclass LoggingPlugin implements Plugin {\n  name = 'logging-plugin'\n\n  initAgent(agent: LocalAgent): void {\n    agent.addHook(BeforeToolCallEvent, (event) => {\n      console.log(`Calling: ${event.toolUse.name}`)\n    })\n\n    agent.addHook(AfterToolCallEvent, (event) => {\n      console.log(`Completed: ${event.toolUse.name}`)\n    })\n  }\n}\n\nconst agent = new Agent({ plugins: [new LoggingPlugin()] })\n```"
 }
]
```

## Related pages

- [Agent Loop](lc:user-guide/concepts/agents/agent-loop) (3 shared tags)
- [Steering (Interventions)](lc:user-guide/concepts/agents/interventions/steering) (3 shared tags)
- [Interrupts](lc:user-guide/concepts/interrupts) (3 shared tags)
- [Interventions](lc:user-guide/concepts/agents/interventions) (3 shared tags)
- [Plugins](lc:user-guide/concepts/plugins) (2 shared tags)
- [Tool Executors](lc:user-guide/concepts/tools/executors) (2 shared tags)
- [GoalLoop](lc:user-guide/concepts/plugins/goal-loop) (2 shared tags)
- [Creating a Custom Model Provider](lc:user-guide/concepts/model-providers/custom_model_provider) (1 shared tag)
- [Retry Strategies](lc:user-guide/concepts/agents/retry-strategies) (1 shared tag)
- [Bidirectional Streaming Hooks](lc:user-guide/concepts/bidirectional-streaming/hooks) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/hooks/events.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/hooks/events.py)
- [harness-sdk/strands-py/src/strands/hooks/registry.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/hooks/registry.py)

### TypeScript

- [harness-sdk/strands-ts/src/hooks/events.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/hooks/events.ts)
- [harness-sdk/strands-ts/src/hooks/registry.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/hooks/registry.ts)
