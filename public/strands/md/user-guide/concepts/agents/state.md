Strands Agents state is maintained in several forms:

1.  **Conversation History:** The sequence of messages between the user and the agent.
2.  **Agent State**: Stateful information outside of conversation context, maintained across multiple requests.
3.  **Invocation State**: Contextual information maintained within a single invocation.

Understanding how state works in Strands is essential for building agents that can maintain context across multi-turn interactions and workflows.

## Conversation History

Conversation history is the primary form of context in a Strands agent, directly accessible through the agent:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\n# Create an agent\nagent = Agent()\n\n# Send a message and get a response\nagent(\"Hello!\")\n\n# Access the conversation history\nprint(agent.messages)  # Shows all messages exchanged so far\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Create an agent\nconst agent = new Agent()\n\n// Send a message and get a response\nawait agent.invoke('Hello!')\n\n// Access the conversation history\nconsole.log(agent.messages) // Shows all messages exchanged so far\n```"
 }
]
```

The agent messages contains all user and assistant messages, including tool calls and tool results. This is the primary way to inspect what’s happening in your agent’s conversation.

You can initialize an agent with existing messages to continue a conversation or pre-fill your Agent’s context with information:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\n# Create an agent with initial messages\nagent = Agent(messages=[\n    {\"role\": \"user\", \"content\": [{\"text\": \"Hello, my name is Strands!\"}]},\n    {\"role\": \"assistant\", \"content\": [{\"text\": \"Hi there! How can I help you today?\"}]}\n])\n\n# Continue the conversation\nagent(\"What's my name?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Create an agent with initial messages\nconst agent = new Agent({\n  messages: [\n    { role: 'user', content: [{ text: 'Hello, my name is Strands!' }] },\n    { role: 'assistant', content: [{ text: 'Hi there! How can I help you today?' }] },\n  ],\n})\n\n// Continue the conversation\nawait agent.invoke(\"What's my name?\")\n```"
 }
]
```

Conversation history is automatically:

-   Maintained between calls to the agent
-   Passed to the model during each inference
-   Used for tool execution context
-   Managed to prevent context window overflow

### Direct Tool Calling

Direct tool calls are (by default) recorded in the conversation history:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands_tools import calculator\n\nagent = Agent(tools=[calculator])\n\n# Direct tool call with recording (default behavior)\nagent.tool.calculator(expression=\"123 * 456\")\n\n# Direct tool call without recording\nagent.tool.calculator(expression=\"765 / 987\", record_direct_tool_call=False)\n\nprint(agent.messages)\n```\n\nIn this example we can see that the first `agent.tool.calculator()` call is recorded in the agent\u2019s conversation history.\n\nThe second `agent.tool.calculator()` call is **not** recorded in the history because we specified the `record_direct_tool_call=False` argument."
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// Not supported in TypeScript\n```"
 }
]
```

### Conversation Manager

Strands uses a conversation manager to handle conversation history effectively. The default is the [`SlidingWindowConversationManager`](lc:api/python/strands.agent.conversation_manager.sliding_window_conversation_manager#SlidingWindowConversationManager), which keeps recent messages and removes older ones when needed:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.agent.conversation_manager import SlidingWindowConversationManager\n\n# Create a conversation manager with custom window size\n# By default, SlidingWindowConversationManager is used even if not specified\nconversation_manager = SlidingWindowConversationManager(\n    window_size=10,  # Maximum number of message pairs to keep\n)\n\n# Use the conversation manager with your agent\nagent = Agent(conversation_manager=conversation_manager)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { SlidingWindowConversationManager } from '@strands-agents/sdk'\n// Create a conversation manager with custom window size\n// By default, SlidingWindowConversationManager is used even if not specified\nconst conversationManager = new SlidingWindowConversationManager({\n  windowSize: 10,\n})\n\nconst agent = new Agent({\n  conversationManager,\n})\n```"
 }
]
```

The sliding window conversation manager:

-   Keeps the most recent N message pairs
-   Removes the oldest messages when the window size is exceeded
-   Handles context window overflow exceptions by reducing context
-   Ensures conversations don’t exceed model context limits

See [Conversation Management](lc:user-guide/concepts/agents/conversation-management) for more information about conversation managers.

## Agent State

Agent state (also called app state) provides key-value storage for stateful information that exists outside of the conversation context. Unlike conversation history, agent state is not passed to the model during inference but can be accessed and modified by tools and application logic.

### Basic Usage

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\n# Create an agent with initial state\nagent = Agent(state={\"user_preferences\": {\"theme\": \"dark\"}, \"session_count\": 0})\n\n\n# Access state values\ntheme = agent.state.get(\"user_preferences\")\nprint(theme)  # {\"theme\": \"dark\"}\n\n# Set new state values\nagent.state.set(\"last_action\", \"login\")\nagent.state.set(\"session_count\", 1)\n\n# Get entire state\nall_state = agent.state.get()\nprint(all_state)  # All state data as a dictionary\n\n# Delete state values\nagent.state.delete(\"last_action\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Create an agent with initial state\nconst agent = new Agent({\n  appState: { user_preferences: { theme: 'dark' }, session_count: 0 },\n})\n\n// Access state values\nconst theme = agent.appState.get('user_preferences')\nconsole.log(theme) // { theme: 'dark' }\n\n// Set new state values\nagent.appState.set('last_action', 'login')\nagent.appState.set('session_count', 1)\n\n// Get state values individually\nconsole.log(agent.appState.get('user_preferences'))\nconsole.log(agent.appState.get('session_count'))\n\n// Delete state values\nagent.appState.delete('last_action')\n```"
 }
]
```

### State Validation and Safety

Agent state enforces JSON serialization validation to ensure data can be persisted and restored:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\nagent = Agent()\n\n# Valid JSON-serializable values\nagent.state.set(\"string_value\", \"hello\")\nagent.state.set(\"number_value\", 42)\nagent.state.set(\"boolean_value\", True)\nagent.state.set(\"list_value\", [1, 2, 3])\nagent.state.set(\"dict_value\", {\"nested\": \"data\"})\nagent.state.set(\"null_value\", None)\n\n# Invalid values will raise ValueError\ntry:\n    agent.state.set(\"function\", lambda x: x)  # Not JSON serializable\nexcept ValueError as e:\n    print(f\"Error: {e}\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst agent = new Agent()\n\n// Valid JSON-serializable values\nagent.appState.set('string_value', 'hello')\nagent.appState.set('number_value', 42)\nagent.appState.set('boolean_value', true)\nagent.appState.set('list_value', [1, 2, 3])\nagent.appState.set('dict_value', { nested: 'data' })\nagent.appState.set('null_value', null)\n\n// Invalid values will raise an error\ntry {\n  agent.appState.set('function', () => 'test') // Not JSON serializable\n} catch (error) {\n  console.log(`Error: ${error}`)\n}\n```"
 }
]
```

### Using State in Tools

Note

> [!NOTE]
>
> To use `ToolContext` in your tool function, the parameter must be named `tool_context`. See [ToolContext documentation](lc:user-guide/concepts/tools/custom-tools#toolcontext) for more information.

Agent state is particularly useful for maintaining information across tool executions:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, tool, ToolContext\n\n@tool(context=True)\ndef track_user_action(action: str, tool_context: ToolContext):\n    \"\"\"Track user actions in agent state.\n\n    Args:\n        action: The action to track\n    \"\"\"\n    # Get current action count\n    action_count = tool_context.agent.state.get(\"action_count\") or 0\n\n    # Update state\n    tool_context.agent.state.set(\"action_count\", action_count + 1)\n    tool_context.agent.state.set(\"last_action\", action)\n\n    return f\"Action '{action}' recorded. Total actions: {action_count + 1}\"\n\n@tool(context=True)\ndef get_user_stats(tool_context: ToolContext):\n    \"\"\"Get user statistics from agent state.\"\"\"\n    action_count = tool_context.agent.state.get(\"action_count\") or 0\n    last_action = tool_context.agent.state.get(\"last_action\") or \"none\"\n\n    return f\"Actions performed: {action_count}, Last action: {last_action}\"\n\n# Create agent with tools\nagent = Agent(tools=[track_user_action, get_user_stats])\n\n# Use tools that modify and read state\nagent(\"Track that I logged in\")\nagent(\"Track that I viewed my profile\")\nprint(f\"Actions taken: {agent.state.get('action_count')}\")\nprint(f\"Last action: {agent.state.get('last_action')}\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst trackUserActionTool = tool({\n  name: 'track_user_action',\n  description: 'Track user actions in agent state',\n  inputSchema: z.object({\n    action: z.string().describe('The action to track'),\n  }),\n  callback: (input, context?: ToolContext) => {\n    if (!context) {\n      throw new Error('Context is required')\n    }\n\n    // Get current action count\n    const actionCount = (context.agent.appState.get('action_count') as number) || 0\n\n    // Update state\n    context.agent.appState.set('action_count', actionCount + 1)\n    context.agent.appState.set('last_action', input.action)\n\n    return `Action '${input.action}' recorded. Total actions: ${actionCount + 1}`\n  },\n})\n\nconst getUserStatsTool = tool({\n  name: 'get_user_stats',\n  description: 'Get user statistics from agent state',\n  inputSchema: z.object({}),\n  callback: (input, context?: ToolContext) => {\n    if (!context) {\n      throw new Error('Context is required')\n    }\n\n    const actionCount = (context.agent.appState.get('action_count') as number) || 0\n    const lastAction = (context.agent.appState.get('last_action') as string) || 'none'\n\n    return `Actions performed: ${actionCount}, Last action: ${lastAction}`\n  },\n})\n\n// Create agent with tools\nconst agent = new Agent({\n  tools: [trackUserActionTool, getUserStatsTool],\n})\n\n// Use tools that modify and read state\nawait agent.invoke('Track that I logged in')\nawait agent.invoke('Track that I viewed my profile')\nconsole.log(`Actions taken: ${agent.appState.get('action_count')}`)\nconsole.log(`Last action: ${agent.appState.get('last_action')}`)\n```"
 }
]
```

## Invocation State

Each agent interaction maintains an invocation state dictionary that persists throughout the event loop cycles and is **not** included in the agent’s context:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\ndef custom_callback_handler(**kwargs):\n    # Access request state\n    if \"request_state\" in kwargs:\n        state = kwargs[\"request_state\"]\n        # Use or modify state as needed\n        if \"counter\" not in state:\n            state[\"counter\"] = 0\n        state[\"counter\"] += 1\n        print(f\"Callback handler event count: {state['counter']}\")\n\nagent = Agent(callback_handler=custom_callback_handler)\n\nresult = agent(\"Hi there!\")\n\nprint(result.state)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst agent = new Agent()\n\n// Pass per-invocation state when invoking\nconst result = await agent.invoke('Hi there!', {\n  invocationState: { requestId: 'r-42', userId: 'u-1' },\n})\n\n// Hooks and tools can read and mutate invocationState during\n// the invocation. The same object is returned on the result.\nconsole.log(result.invocationState)\n// { requestId: 'r-42', userId: 'u-1', ... }\n```"
 }
]
```

Invocation state (`invocation_state``invocationState`):

-   Is initialized at the beginning of each agent invocation (defaults to `{}` when omitted)
-   Persists through recursive event loop cycles within a single invocation
-   Is shared by reference across all hook events and tools
-   Mutations by hooks or tools are visible to subsequent hooks, tools, and the final result
-   Is returned on the `AgentResult` (Python: `result.state`, TypeScript: `result.invocationState`)
-   Is **not** included in the agent’s model context

## Persisting State Across Sessions

For automatic persistence of agent state and conversation history across application restarts, see [Session Management](lc:user-guide/concepts/agents/session-management). For manual, point-in-time capture and restore of agent state, see [Snapshots](lc:user-guide/concepts/agents/snapshots).

## Related pages

- [Session Management](lc:user-guide/concepts/agents/session-management) (3 shared tags)
- [Bidirectional Streaming Session Management](lc:user-guide/concepts/bidirectional-streaming/session-management) (2 shared tags)
- [Serialization](lc:user-guide/evals-sdk/how-to/serialization) (1 shared tag)
- [Storage](lc:user-guide/concepts/storage) (1 shared tag)
- [OpenAI Responses API](lc:user-guide/concepts/model-providers/openai-responses) (1 shared tag)
- [Conversation Management](lc:user-guide/concepts/agents/conversation-management) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/agent/state.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/agent/state.py)
- [harness-sdk/strands-py/src/strands/types/json_dict.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/types/json_dict.py)

### TypeScript

- [harness-sdk/strands-ts/src/agent/agent.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/agent/agent.ts)
