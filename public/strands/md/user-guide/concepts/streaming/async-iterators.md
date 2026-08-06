Async iterators provide asynchronous streaming of agent events, allowing you to process events as they occur in real-time. This approach is ideal for asynchronous frameworks where you need fine-grained control over async execution flow.

For a complete list of available events including text generation, tool usage, lifecycle, and reasoning events, see the [streaming overview](lc:user-guide/concepts/streaming#event-types).

## Basic Usage

```sa-tabs
[
 {
  "label": "Python",
  "body": "Python uses the [`stream_async`](lc:api/python/strands.agent.agent#Agent.stream_async), which is a streaming counterpart to the [`invoke_async`](lc:api/python/strands.agent.agent#Agent.invoke_async) method, for asynchronous streaming. This is ideal for frameworks like FastAPI, aiohttp, or Django Channels.\n\n> **Note**: Python also supports synchronous event handling via [callback handlers](lc:user-guide/concepts/streaming/callback-handlers).\n\n```python\nimport asyncio\nfrom strands import Agent\nfrom strands_tools import calculator\n\n# Initialize our agent without a callback handler\nagent = Agent(\n    tools=[calculator],\n    callback_handler=None\n)\n\n# Async function that iterators over streamed agent events\nasync def process_streaming_response():\n    agent_stream = agent.stream_async(\"Calculate 2+2\")\n    async for event in agent_stream:\n        print(event)\n\n# Run the agent\nasyncio.run(process_streaming_response())\n```"
 },
 {
  "label": "TypeScript",
  "body": "TypeScript uses the [`stream`](https://strandsagents.com/docs/api/typescript/Agent/) method for streaming, which is async by default. This is ideal for frameworks like Express.js or NestJS.\n\n```typescript\n// Initialize our agent without a printer\nconst agent = new Agent({\n  tools: [notebook],\n  printer: false,\n})\n\n// Async function that iterates over streamed agent events\nasync function processStreamingResponse(): Promise<void> {\n  for await (const event of agent.stream('Record that my favorite color is blue!')) {\n    console.log(event)\n  }\n}\n\n// Run the agent\nawait processStreamingResponse()\n```"
 }
]
```

## Server examples

Here’s how to integrate streaming with web frameworks to create a streaming endpoint:

```sa-tabs
[
 {
  "label": "Python - FastAPI",
  "body": "```python\nfrom fastapi import FastAPI, HTTPException\nfrom fastapi.responses import StreamingResponse\nfrom pydantic import BaseModel\nfrom strands import Agent\nfrom strands_tools import calculator, http_request\n\napp = FastAPI()\n\nclass PromptRequest(BaseModel):\n    prompt: str\n\n@app.post(\"/stream\")\nasync def stream_response(request: PromptRequest):\n    async def generate():\n        agent = Agent(\n            tools=[calculator, http_request],\n            callback_handler=None\n        )\n\n        try:\n            async for event in agent.stream_async(request.prompt):\n                if \"data\" in event:\n                    # Only stream text chunks to the client\n                    yield event[\"data\"]\n        except Exception as e:\n            yield f\"Error: {str(e)}\"\n\n    return StreamingResponse(\n        generate(),\n        media_type=\"text/plain\"\n    )\n```"
 },
 {
  "label": "TypeScript - Express.js",
  "body": "> **Note**: This is a conceptual example. Install Express.js with `npm install express @types/express` to use it in your project.\n\n```typescript\n// Install Express: npm install express @types/express\n\ninterface PromptRequest {\n  prompt: string\n}\n\nasync function handleStreamRequest(req: any, res: any) {\n  console.log(`Got Request: ${JSON.stringify(req.body)}`)\n  const { prompt } = req.body as PromptRequest\n\n  res.setHeader('Content-Type', 'application/x-ndjson')\n\n  const agent = new Agent({\n    tools: [notebook],\n    printer: false,\n  })\n\n  for await (const event of agent.stream(prompt)) {\n    // Events automatically serialize to compact JSON via toJSON().\n    // Only relevant data fields are included \u2014 the full Agent instance,\n    // Tool classes, and mutable hook flags (cancel/retry) are excluded.\n    res.write(`${JSON.stringify(event)}\\n`)\n  }\n  res.end()\n}\n\nconst app = express()\napp.use(express.json())\napp.post('/stream', handleStreamRequest)\napp.listen(3000)\n```\n\nYou can then curl your local server with:\n\n```bash\ncurl localhost:3000/stream -d '{\"prompt\": \"Hello\"}' -H \"Content-Type: application/json\"\n```"
 }
]
```

### Agentic Loop

This async stream processor illustrates the event loop lifecycle events and how they relate to each other. It’s useful for understanding the flow of execution in the Strands agent:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands_tools import calculator\n\n# Create agent with event loop tracker\nagent = Agent(\n    tools=[calculator],\n    callback_handler=None\n)\n\n# This will show the full event lifecycle in the console\nasync for event in agent.stream_async(\"What is the capital of France and what is 42+7?\"):\n    # Track event loop lifecycle\n    if event.get(\"init_event_loop\", False):\n        print(\"\ud83d\udd04 Event loop initialized\")\n    elif event.get(\"start_event_loop\", False):\n        print(\"\u25b6\ufe0f Event loop cycle starting\")\n    elif \"message\" in event:\n        print(f\"\ud83d\udcec New message created: {event['message']['role']}\")\n    elif \"result\" in event:\n        print(\"\u2705 Agent completed with result\")\n    elif event.get(\"force_stop\", False):\n        print(f\"\ud83d\uded1 Event loop force-stopped: {event.get('force_stop_reason', 'unknown reason')}\")\n\n    # Track tool usage\n    if \"current_tool_use\" in event and event[\"current_tool_use\"].get(\"name\"):\n        tool_name = event[\"current_tool_use\"][\"name\"]\n        print(f\"\ud83d\udd27 Using tool: {tool_name}\")\n\n    # Show only a snippet of text to keep output clean\n    if \"data\" in event:\n        # Only show first 20 chars of each chunk for demo purposes\n        data_snippet = event[\"data\"][:20] + (\"...\" if len(event[\"data\"]) > 20 else \"\")\n        print(f\"\ud83d\udcdf Text: {data_snippet}\")\n```\n\nThe output will show the sequence of events:\n\n1.  First the event loop initializes (`init_event_loop`)\n2.  Then the cycle begins (`start_event_loop`)\n3.  New cycles may start multiple times during execution (`start_event_loop`)\n4.  Text generation and tool usage events occur during the cycle\n5.  Finally, the agent completes with a `result` event or may be force-stopped (`force_stop`)"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nfunction processEvent(event: AgentStreamEvent): void {\n  // Track agent loop lifecycle\n  switch (event.type) {\n    case 'beforeInvocationEvent':\n      console.log('\ud83d\udd04 Agent loop initialized')\n      break\n    case 'beforeModelCallEvent':\n      console.log('\u25b6\ufe0f Agent loop cycle starting')\n      break\n    case 'afterModelCallEvent':\n      console.log(`\ud83d\udcec New message created: ${event.stopData?.message.role}`)\n      break\n    case 'beforeToolsEvent':\n      console.log('About to execute tool!')\n      break\n    case 'afterToolsEvent':\n      console.log('Finished execute tool!')\n      break\n    case 'afterInvocationEvent':\n      console.log('\u2705 Agent loop completed')\n      break\n  }\n\n  // Track tool usage\n  if (\n    event.type === 'modelStreamUpdateEvent' &&\n    event.event.type === 'modelContentBlockStartEvent' &&\n    event.event.start?.type === 'toolUseStart'\n  ) {\n    console.log(`\\n\ud83d\udd27 Using tool: ${event.event.start.name}`)\n  }\n\n  // Show text snippets\n  if (\n    event.type === 'modelStreamUpdateEvent' &&\n    event.event.type === 'modelContentBlockDeltaEvent' &&\n    event.event.delta.type === 'textDelta'\n  ) {\n    process.stdout.write(event.event.delta.text)\n  }\n}\nconst responseGenerator = agent.stream(\n  'What is the capital of France and what is 42+7? Record in the notebook.'\n)\nfor await (const event of responseGenerator) {\n  processEvent(event)\n}\n```\n\nThe output will show the sequence of events:\n\n1.  First the invocation starts (`beforeInvocationEvent`)\n2.  Then the model is called (`beforeModelCallEvent`)\n3.  The model generates content with delta events (wrapped in `modelStreamUpdateEvent`)\n4.  Tools may be executed (`beforeToolsEvent`, `afterToolsEvent`)\n5.  The model may be called again in subsequent cycles\n6.  Finally, the invocation completes (`afterInvocationEvent`)"
 }
]
```

## Related pages

- [Callback Handlers](lc:user-guide/concepts/streaming/callback-handlers) (1 shared tag)
- [Streaming Events](lc:user-guide/concepts/streaming) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/agent/agent.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/agent/agent.py)
- [harness-sdk/strands-py/src/strands/event_loop/streaming.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/event_loop/streaming.py)

### TypeScript

- [harness-sdk/strands-ts/src/agent/agent.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/agent/agent.ts)
- [harness-sdk/strands-ts/src/models/streaming.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/models/streaming.ts)
