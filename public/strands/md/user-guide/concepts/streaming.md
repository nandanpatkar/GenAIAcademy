Strands Agents SDK provides real-time streaming capabilities that allow you to monitor and process events as they occur during agent execution. This enables responsive user interfaces, real-time monitoring, and custom output formatting.

Strands has multiple approaches for handling streaming events:

-   **[Async Iterators](lc:user-guide/concepts/streaming/async-iterators)**: Ideal for asynchronous server frameworks
-   **[Callback Handlers (Python only)](lc:user-guide/concepts/streaming/callback-handlers)**: Perfect for synchronous applications and custom event processing

Both methods receive the same event types but differ in their execution model and use cases.

## Event Types

All streaming methods yield the same set of events:

### Lifecycle Events

```sa-tabs
[
 {
  "label": "Python",
  "body": "-   **`init_event_loop`**: True at the start of agent invocation initializing\n-   **`start_event_loop`**: True when the event loop is starting\n-   **`message`**: Present when a new message is created\n-   **`event`**: Raw event from the model stream\n-   **`force_stop`**: True if the event loop was forced to stop\n    -   **`force_stop_reason`**: Reason for forced stop\n-   **`result`**: The final [`AgentResult`](lc:api/python/strands.agent.agent_result#AgentResult)"
 },
 {
  "label": "TypeScript",
  "body": "Each event emitted from the TypeScript agent is a class with a `type` attribute that has a unique value. When determining an event, you can use `instanceof` on the class, or an equality check on the `event.type` value. All events extend `HookableEvent`, making them both streamable and subscribable via hook callbacks.\n\n-   **`BeforeInvocationEvent`**: Start of agent loop (before any iterations)\n    -   **`cancel`**: Set by hook callbacks to cancel the invocation (`boolean | string`)\n-   **`AfterInvocationEvent`**: End of agent loop (after all iterations complete)\n    -   **`error?`**: Optional error if loop terminated due to exception\n-   **`BeforeModelCallEvent`**: Before model invocation\n    -   **`messages`**: Array of messages being sent to model\n    -   **`cancel`**: Set by hook callbacks to cancel the model call (`boolean | string`)\n-   **`AfterModelCallEvent`**: After model invocation\n    -   **`message`**: Assistant message returned by model\n    -   **`stopReason`**: Why generation stopped\n-   **`BeforeToolsEvent`**: Before tools execution\n    -   **`message`**: Assistant message containing tool use blocks\n-   **`AfterToolsEvent`**: After tools execution\n    -   **`message`**: User message containing tool results\n-   **`AgentResultEvent`**: Final agent result\n    -   **`result`**: The `AgentResult` with `stopReason`, `lastMessage`, and optional `structuredOutput`"
 }
]
```

### Model Stream Events

```sa-tabs
[
 {
  "label": "Python",
  "body": "-   **`data`**: Text chunk from the model\u2019s output\n-   **`delta`**: Raw delta content from the model\n-   **`reasoning`**: True for reasoning events\n    -   **`reasoningText`**: Text from reasoning process\n    -   **`reasoning_signature`**: Signature from reasoning process\n    -   **`redactedContent`**: Reasoning content redacted by the model"
 },
 {
  "label": "TypeScript",
  "body": "-   **`ModelStreamUpdateEvent`**: Wraps transient model streaming deltas. Access the inner event via `.event`:\n    -   **`ModelMessageStartEvent`**: Start of a message from the model\n    -   **`ModelContentBlockStartEvent`**: Start of a content block (text, toolUse, reasoning, etc.)\n    -   **`ModelContentBlockDeltaEvent`**: Content deltas for text, tool input, or reasoning\n    -   **`ModelContentBlockStopEvent`**: End of a content block\n    -   **`ModelMessageStopEvent`**: End of a message\n    -   **`ModelMetadataEvent`**: Usage and metrics metadata\n-   **`ContentBlockEvent`**: Wraps a fully assembled content block (TextBlock, ToolUseBlock, ReasoningBlock). Access via `.contentBlock`\n-   **`ModelMessageEvent`**: Wraps the complete model message after all blocks are assembled. Access via `.message`"
 }
]
```

### Tool Events

```sa-tabs
[
 {
  "label": "Python",
  "body": "-   **`current_tool_use`**: Information about the current tool being used, including:\n    -   **`toolUseId`**: Unique ID for this tool use\n    -   **`name`**: Name of the tool\n    -   **`input`**: Tool input parameters (accumulated as streaming occurs)\n-   **`tool_stream_event`**: Information about [an event streamed from a tool](lc:user-guide/concepts/tools/custom-tools#tool-streaming), including:\n    -   **`tool_use`**: The [`ToolUse`](lc:api/python/strands.types.tools#ToolUse) for the tool that streamed the event\n    -   **`data`**: The data streamed from the tool"
 },
 {
  "label": "TypeScript",
  "body": "-   **`BeforeToolCallEvent`**: Before a tool is executed\n    -   **`toolUse`**: The tool use block with `name` and `input`\n-   **`AfterToolCallEvent`**: After a tool finishes execution\n    -   **`toolUse`**: The tool use block\n    -   **`result`**: The tool result block\n-   **`ToolStreamUpdateEvent`**: Wraps streaming progress events from a tool. Access via `.event`:\n    -   **`data`**: The data streamed from the tool\n-   **`ToolResultEvent`**: Wraps a completed tool result. Access via `.result`"
 }
]
```

### Multi-Agent Events

```sa-tabs
[
 {
  "label": "Python",
  "body": "Multi-agent systems ([Graph](lc:user-guide/concepts/multi-agent/graph) and [Swarm](lc:user-guide/concepts/multi-agent/swarm)) emit additional coordination events:\n\n-   **`multiagent_node_start`**: When a node begins execution\n    -   **`type`**: `\"multiagent_node_start\"`\n    -   **`node_id`**: Unique identifier for the node\n    -   **`node_type`**: Type of node (`\"agent\"`, `\"swarm\"`, `\"graph\"`)\n-   **`multiagent_node_stream`**: Forwarded events from agents/multi-agents with node context\n    -   **`type`**: `\"multiagent_node_stream\"`\n    -   **`node_id`**: Identifier of the node generating the event\n    -   **`event`**: The original agent event (nested)\n-   **`multiagent_node_stop`**: When a node completes execution\n    -   **`type`**: `\"multiagent_node_stop\"`\n    -   **`node_id`**: Unique identifier for the node\n    -   **`node_result`**: Complete NodeResult with execution details, metrics, and status\n-   **`multiagent_handoff`**: When control is handed off between agents (Swarm) or batch transitions (Graph)\n    -   **`type`**: `\"multiagent_handoff\"`\n    -   **`from_node_ids`**: List of node IDs completing execution\n    -   **`to_node_ids`**: List of node IDs beginning execution\n    -   **`message`**: Optional handoff message (typically used in Swarm)\n-   **`multiagent_result`**: Final multi-agent result\n    -   **`type`**: `\"multiagent_result\"`\n    -   **`result`**: The final GraphResult or SwarmResult\n\nSee [Graph streaming](lc:user-guide/concepts/multi-agent/graph#streaming-events) and [Swarm streaming](lc:user-guide/concepts/multi-agent/swarm#streaming-events) for usage examples."
 },
 {
  "label": "TypeScript",
  "body": "Multi-agent systems ([Graph](lc:user-guide/concepts/multi-agent/graph) and [Swarm](lc:user-guide/concepts/multi-agent/swarm)) emit additional coordination events. Each event is a class with a `type` attribute, extending `HookableEvent` for both streaming and hook subscription.\n\n-   **`MultiAgentInitializedEvent`**: When a multi-agent orchestrator has finished initialization\n    -   **`orchestrator`**: The `MultiAgentBase` instance\n-   **`BeforeMultiAgentInvocationEvent`**: Before orchestrator execution starts\n    -   **`orchestrator`**: The `MultiAgentBase` instance\n    -   **`state`**: The current `MultiAgentState`\n-   **`BeforeNodeCallEvent`**: Before a node begins execution\n    -   **`nodeId`**: Unique identifier for the node\n    -   **`orchestrator`**: The `MultiAgentBase` instance\n    -   **`state`**: The current `MultiAgentState`\n    -   **`cancel`**: Set by hook callbacks to cancel node execution (`boolean | string`)\n-   **`NodeStreamUpdateEvent`**: Forwarded events from agents or nested orchestrators with node context\n    -   **`nodeId`**: Identifier of the node generating the event\n    -   **`nodeType`**: Type of node (`\"agentNode\"`, `\"multiAgentNode\"`)\n    -   **`state`**: The current `MultiAgentState`\n    -   **`event`**: The inner `AgentStreamEvent` or `MultiAgentStreamEvent`\n-   **`NodeCancelEvent`**: When a node is cancelled via `BeforeNodeCallEvent.cancel`\n    -   **`nodeId`**: Unique identifier for the node\n    -   **`state`**: The current `MultiAgentState`\n    -   **`message`**: Cancel reason\n-   **`AfterNodeCallEvent`**: After a node completes execution\n    -   **`nodeId`**: Unique identifier for the node\n    -   **`orchestrator`**: The `MultiAgentBase` instance\n    -   **`state`**: The current `MultiAgentState`\n    -   **`error?`**: Optional error if the node failed\n-   **`NodeResultEvent`**: When a node finishes execution\n    -   **`nodeId`**: Unique identifier for the node\n    -   **`nodeType`**: Type of node (`\"agentNode\"`, `\"multiAgentNode\"`)\n    -   **`state`**: The current `MultiAgentState`\n    -   **`result`**: The `NodeResult` with `status`, `duration`, `content`, and optional `error`\n-   **`MultiAgentHandoffEvent`**: When execution transitions between nodes\n    -   **`source`**: Node ID completing execution\n    -   **`targets`**: Array of node IDs beginning execution\n    -   **`state`**: The current `MultiAgentState`\n-   **`AfterMultiAgentInvocationEvent`**: After orchestrator execution completes\n    -   **`orchestrator`**: The `MultiAgentBase` instance\n    -   **`state`**: The current `MultiAgentState`\n-   **`MultiAgentResultEvent`**: Final event in the multi-agent stream\n    -   **`result`**: The `MultiAgentResult` with `status`, `results`, `content`, and `duration`\n\nSee [Graph streaming](lc:user-guide/concepts/multi-agent/graph#streaming-events) and [Swarm streaming](lc:user-guide/concepts/multi-agent/swarm#streaming-events) for usage examples."
 }
]
```

### Event Serialization

```sa-tabs
[
 {
  "label": "Python",
  "body": "Python streaming events are plain dictionaries. The SDK does not include a built-in serialization filter \u2014 you have full control over which events and fields to forward from your processes and servers.\n\nWhen serving streamed responses (for example, over SSE or WebSockets), you can filter the yielded events to keep payloads compact:\n\n```python\nimport json\n\ndef filter_event(event: dict) -> dict | None:\n    \"\"\"Filter streaming events to only forward relevant data over the wire.\"\"\"\n    # Forward text deltas for real-time display\n    if \"data\" in event:\n        return {\"type\": \"text\", \"data\": event[\"data\"]}\n\n    # Forward tool usage for progress indicators\n    if \"current_tool_use\" in event and event[\"current_tool_use\"].get(\"name\"):\n        return {\"type\": \"tool\", \"name\": event[\"current_tool_use\"][\"name\"]}\n\n    # Forward the final result\n    if \"result\" in event:\n        return {\"type\": \"result\", \"stop_reason\": str(event[\"result\"].stop_reason)}\n\n    # Skip everything else (lifecycle signals, raw deltas, reasoning, etc.)\n    return None\n\n\nasync for event in agent.stream_async(\"Hello\"):\n    filtered = filter_event(event)\n    if filtered:\n        await response.write(f\"data: {json.dumps(filtered)}\\n\\n\")\n```\n\nThis approach lets you tailor the streamed output to your use case \u2014 for example, forwarding only text deltas for a chat UI or including tool events for a progress dashboard."
 },
 {
  "label": "TypeScript",
  "body": "Every event class implements a `toJSON()` method that `JSON.stringify()` calls automatically. Each serialized event retains its `type` discriminator and the relevant data fields \u2014 matching the general shape of the class \u2014 while excluding in-memory runtime references (`agent`, `orchestrator`, `state`, `tool`) and mutable hook properties (`cancel`, `retry`). `Error` objects are converted to `{ message: string }`. This applies to single-agent, multi-agent, and A2A events alike.\n\nYou can filter which events to forward to the client:\n\n```typescript\nfor await (const event of agent.stream('Hello')) {\n  switch (event.type) {\n    // Forward text deltas for real-time display\n    case 'modelStreamUpdateEvent':\n      if (\n        event.event.type === 'modelContentBlockDeltaEvent' &&\n        event.event.delta.type === 'textDelta'\n      ) {\n        console.log(\n          `data: ${JSON.stringify({ type: 'text', text: event.event.delta.text })}`\n        )\n      }\n      break\n\n    // Forward tool names for progress indicators\n    case 'beforeToolCallEvent':\n      console.log(`data: ${JSON.stringify({ type: 'tool', name: event.toolUse.name })}`)\n      break\n\n    // Forward the final result\n    case 'agentResultEvent':\n      console.log(`data: ${JSON.stringify(event)}`)\n      break\n  }\n}\n```"
 }
]
```

## Quick Examples

```sa-tabs
[
 {
  "label": "Python",
  "body": "**Async Iterator Pattern**\n\n```python\nasync for event in agent.stream_async(\"Calculate 2+2\"):\n    if \"data\" in event:\n        print(event[\"data\"], end=\"\")\n```\n\n**Callback Handler Pattern**\n\n```python\ndef handle_events(**kwargs):\n    if \"data\" in kwargs:\n        print(kwargs[\"data\"], end=\"\")\n\nagent = Agent(callback_handler=handle_events)\nagent(\"Calculate 2+2\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "**Async Iterator Pattern**\n\n```typescript\nconst agent = new Agent({ tools: [notebook] })\n\nfor await (const event of agent.stream('Calculate 2+2')) {\n  if (\n    event.type === 'modelStreamUpdateEvent' &&\n    event.event.type === 'modelContentBlockDeltaEvent' &&\n    event.event.delta.type === 'textDelta'\n  ) {\n    // Print out the model text delta event data\n    process.stdout.write(event.event.delta.text)\n  }\n}\nconsole.log('\\nDone!')\n```"
 }
]
```

## Identifying Events Emitted from Agent

This example demonstrates how to identify event emitted from an agent:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands_tools import calculator\n\ndef process_event(event):\n    \"\"\"Shared event processor for both async iterators and callback handlers\"\"\"\n    # Track event loop lifecycle\n    if event.get(\"init_event_loop\", False):\n        print(\"\ud83d\udd04 Event loop initialized\")\n    elif event.get(\"start_event_loop\", False):\n        print(\"\u25b6\ufe0f Event loop cycle starting\")\n    elif \"message\" in event:\n        print(f\"\ud83d\udcec New message created: {event['message']['role']}\")\n    elif \"result\" in event:\n        print(\"\u2705 Agent completed with result\")\n    elif event.get(\"force_stop\", False):\n        print(f\"\ud83d\uded1 Event loop force-stopped: {event.get('force_stop_reason', 'unknown reason')}\")\n\n    # Track tool usage\n    if \"current_tool_use\" in event and event[\"current_tool_use\"].get(\"name\"):\n        tool_name = event[\"current_tool_use\"][\"name\"]\n        print(f\"\ud83d\udd27 Using tool: {tool_name}\")\n\n    # Show text snippets\n    if \"data\" in event:\n        data_snippet = event[\"data\"][:20] + (\"...\" if len(event[\"data\"]) > 20 else \"\")\n        print(f\"\ud83d\udcdf Text: {data_snippet}\")\n\nagent = Agent(tools=[calculator], callback_handler=None)\nasync for event in agent.stream_async(\"What is the capital of France and what is 42+7?\"):\n    process_event(event)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nfunction processEvent(event: AgentStreamEvent): void {\n  // Track agent loop lifecycle\n  switch (event.type) {\n    case 'beforeInvocationEvent':\n      console.log('\ud83d\udd04 Agent loop initialized')\n      break\n    case 'beforeModelCallEvent':\n      console.log('\u25b6\ufe0f Agent loop cycle starting')\n      break\n    case 'afterModelCallEvent':\n      console.log(`\ud83d\udcec New message created: ${event.stopData?.message.role}`)\n      break\n    case 'beforeToolsEvent':\n      console.log('About to execute tool!')\n      break\n    case 'afterToolsEvent':\n      console.log('Finished execute tool!')\n      break\n    case 'afterInvocationEvent':\n      console.log('\u2705 Agent loop completed')\n      break\n  }\n\n  // Track tool usage\n  if (\n    event.type === 'modelStreamUpdateEvent' &&\n    event.event.type === 'modelContentBlockStartEvent' &&\n    event.event.start?.type === 'toolUseStart'\n  ) {\n    console.log(`\\n\ud83d\udd27 Using tool: ${event.event.start.name}`)\n  }\n\n  // Show text snippets\n  if (\n    event.type === 'modelStreamUpdateEvent' &&\n    event.event.type === 'modelContentBlockDeltaEvent' &&\n    event.event.delta.type === 'textDelta'\n  ) {\n    process.stdout.write(event.event.delta.text)\n  }\n}\nconst responseGenerator = agent.stream(\n  'What is the capital of France and what is 42+7? Record in the notebook.'\n)\nfor await (const event of responseGenerator) {\n  processEvent(event)\n}\n```"
 }
]
```

## Sub-Agent Streaming Example

Utilizing both [agents as a tool](lc:user-guide/concepts/multi-agent/agents-as-tools) and [tool streaming](lc:user-guide/concepts/tools/custom-tools#tool-streaming), this example shows how to stream events from sub-agents:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom typing import AsyncIterator\nfrom dataclasses import dataclass\nfrom strands import Agent, tool\nfrom strands_tools import calculator\n\n@dataclass\nclass SubAgentResult:\n    agent: Agent\n    event: dict\n\n@tool\nasync def math_agent(query: str) -> AsyncIterator:\n    \"\"\"Solve math problems using the calculator tool.\"\"\"\n    agent = Agent(\n        name=\"Math Expert\",\n        system_prompt=\"You are a math expert. Use the calculator tool for calculations.\",\n        callback_handler=None,\n        tools=[calculator]\n    )\n\n    result = None\n    async for event in agent.stream_async(query):\n        yield SubAgentResult(agent=agent, event=event)\n        if \"result\" in event:\n            result = event[\"result\"]\n\n    yield str(result)\n\ndef process_sub_agent_events(event):\n    \"\"\"Shared processor for sub-agent streaming events\"\"\"\n    tool_stream = event.get(\"tool_stream_event\", {}).get(\"data\")\n\n    if isinstance(tool_stream, SubAgentResult):\n        current_tool = tool_stream.event.get(\"current_tool_use\", {})\n        tool_name = current_tool.get(\"name\")\n\n        if tool_name:\n            print(f\"Agent '{tool_stream.agent.name}' using tool '{tool_name}'\")\n\n    # Also show regular text output\n    if \"data\" in event:\n        print(event[\"data\"], end=\"\")\n\n# Using with async iterators\norchestrator_async_iterator = Agent(\n    system_prompt=\"Route math questions to the math_agent tool.\",\n    callback_handler=None,\n    tools=[math_agent]\n)\n\n\n# With async-iterator\nasync for event in orchestrator_async_iterator.stream_async(\"What is 3+3?\"):\n    process_sub_agent_events(event)\n\n\n# With callback handler\ndef handle_events(**kwargs):\n    process_sub_agent_events(kwargs)\n\norchestrator_callback = Agent(\n    system_prompt=\"Route math questions to the math_agent tool.\",\n    callback_handler=handle_events,\n    tools=[math_agent]\n)\n\norchestrator_callback(\"What is 3+3?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Create the math agent\nconst mathAgent = new Agent({\n  systemPrompt: 'You are a math expert. Answer a math problem in one sentence',\n  printer: false,\n})\n\nconst calculator = tool({\n  name: 'mathAgent',\n  description: 'Agent that calculates the answer to a math problem input.',\n  inputSchema: z.object({ input: z.string() }),\n  callback: async function* (input): AsyncGenerator<string, string, unknown> {\n    // Stream from the sub-agent\n    const generator = mathAgent.stream(input.input)\n    let result = await generator.next()\n    while (!result.done) {\n      // Process events from the sub-agent\n      if (\n        result.value.type === 'modelStreamUpdateEvent' &&\n        result.value.event.type === 'modelContentBlockDeltaEvent' &&\n        result.value.event.delta.type === 'textDelta'\n      ) {\n        yield result.value.event.delta.text\n      }\n      result = await generator.next()\n    }\n    return result.value.lastMessage.content[0]!.type === 'textBlock'\n      ? result.value.lastMessage.content[0]!.text\n      : result.value.lastMessage.content[0]!.toString()\n  },\n})\n\nconst agent = new Agent({ tools: [calculator] })\nfor await (const event of agent.stream('What is 2 * 3? Use your tool.')) {\n  if (event.type === 'toolStreamUpdateEvent') {\n    console.log(`Tool Event: ${JSON.stringify(event.event.data)}`)\n  }\n}\nconsole.log('\\nDone!')\n```"
 }
]
```

## Next Steps

-   Learn about [Async Iterators](lc:user-guide/concepts/streaming/async-iterators) for asynchronous streaming
-   Explore [Callback Handlers](lc:user-guide/concepts/streaming/callback-handlers) for synchronous event processing
-   See the Agent API Reference for complete method documentation: [Python](lc:api/python/strands.agent.agent) | [TypeScript](https://strandsagents.com/docs/api/typescript/Agent/)

## Related pages

- [Async Iterators for Streaming](lc:user-guide/concepts/streaming/async-iterators) (1 shared tag)
- [Callback Handlers](lc:user-guide/concepts/streaming/callback-handlers) (1 shared tag)
