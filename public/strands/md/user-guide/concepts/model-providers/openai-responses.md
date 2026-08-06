The [Responses API](https://platform.openai.com/docs/api-reference/responses) is OpenAI’s interface for generating model responses and building agents. It is a superset of the [Chat Completions](lc:user-guide/concepts/model-providers/openai) API, with additional support for [built-in tools](#built-in-tools), server-side conversation state management, and multi-modal inputs.

## Installation

```sa-tabs
[
 {
  "label": "Python",
  "body": "```bash\npip install 'strands-agents[openai]' strands-agents-tools\n```\n\nRequires `openai>=2.0.0`. Install or upgrade with `pip install -U openai`."
 },
 {
  "label": "TypeScript",
  "body": "```bash\nnpm install @strands-agents/sdk openai\n```"
 }
]
```

## Usage

After installing dependencies, you can import and initialize the Responses provider as follows:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.models.openai_responses import OpenAIResponsesModel\n\nmodel = OpenAIResponsesModel(\n    model_id=\"gpt-4o\",\n    client_args={\"api_key\": \"<KEY>\"},\n)\n\nagent = Agent(model=model)\nresponse = agent(\"Hello!\")\nprint(response)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { OpenAIModel } from '@strands-agents/sdk/models/openai'\n\nconst model = new OpenAIModel({\n  modelId: 'gpt-4o',\n  apiKey: '<KEY>',\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke('Hello!')\nconsole.log(response)\n```\n\nIn TypeScript, both the Responses API and Chat Completions API are available through a single `OpenAIModel` class. The Responses API is selected by default. Pass `api: 'chat'` to use [Chat Completions](lc:user-guide/concepts/model-providers/openai) instead."
 }
]
```

### Amazon Bedrock (Mantle)

The Responses provider can connect to [Amazon Bedrock’s OpenAI-compatible endpoints](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html) powered by Mantle. Authenticate with a [Bedrock API key](https://docs.aws.amazon.com/bedrock/latest/userguide/api-key-management.html) and point the client at your region’s Mantle endpoint.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.models.openai_responses import OpenAIResponsesModel\n\nregion = \"us-east-1\"\nmodel = OpenAIResponsesModel(\n    model_id=\"openai.gpt-oss-120b\",\n    client_args={\n        \"api_key\": \"<BEDROCK_API_KEY>\",\n        \"base_url\": f\"https://bedrock-mantle.{region}.api.aws/v1\",\n    },\n)\n\nagent = Agent(model=model)\nresponse = agent(\"What is 2+2?\")\nprint(response)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { OpenAIModel } from '@strands-agents/sdk/models/openai'\n\nconst region = 'us-east-1'\nconst model = new OpenAIModel({\n  modelId: 'openai.gpt-oss-120b',\n  apiKey: '<BEDROCK_API_KEY>',\n  clientConfig: {\n    baseURL: `https://bedrock-mantle.${region}.api.aws/v1`,\n  },\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke('What is 2+2?')\nconsole.log(response)\n```"
 }
]
```

## Configuration

### Client Configuration

```sa-tabs
[
 {
  "label": "Python",
  "body": "The `client_args` configure the underlying OpenAI client. For a complete list of available arguments, refer to the [OpenAI Python SDK](https://github.com/openai/openai-python)."
 },
 {
  "label": "TypeScript",
  "body": "The `clientConfig` configures the underlying OpenAI client. For a complete list of available options, refer to the [OpenAI TypeScript SDK](https://github.com/openai/openai-node)."
 }
]
```

### Model Configuration

The model configuration sets parameters for inference:

```sa-tabs
[
 {
  "label": "Python",
  "body": "| Parameter | Description | Example | Options |\n| --- | --- | --- | --- |\n| `model_id` | ID of a model to use | `gpt-4o` | [reference](https://platform.openai.com/docs/models) |\n| `params` | Model and tool parameters | `{\"tools\": [{\"type\": \"web_search\"}]}` | [reference](https://platform.openai.com/docs/api-reference/responses/create) |\n| `stateful` | Enable server-side conversation state | `True` | `True` / `False` |"
 },
 {
  "label": "TypeScript",
  "body": "| Parameter | Description | Example | Options |\n| --- | --- | --- | --- |\n| `modelId` | ID of a model to use | `'gpt-4o'` | [reference](https://platform.openai.com/docs/models) |\n| `maxTokens` | Maximum tokens to generate | `1000` | [reference](https://platform.openai.com/docs/api-reference/responses/create) |\n| `temperature` | Controls randomness (0-2) | `0.7` | [reference](https://platform.openai.com/docs/api-reference/responses/create) |\n| `topP` | Nucleus sampling (0-1) | `0.9` | [reference](https://platform.openai.com/docs/api-reference/responses/create) |\n| `stateful` | Enable server-side conversation state | `true` | `true` / `false` |\n| `params` | Additional parameters (e.g., built-in tools) | `{ tools: [{ type: 'web_search' }] }` | [reference](https://platform.openai.com/docs/api-reference/responses/create) |"
 }
]
```

## Built-in Tools

Built-in tools run server-side and are passed via the `params` configuration. They work alongside any function tools registered on the agent.

### Web Search

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nmodel = OpenAIResponsesModel(\n    model_id=\"gpt-4o\",\n    params={\"tools\": [{\"type\": \"web_search\"}]},\n    client_args={\"api_key\": \"<KEY>\"},\n)\n\nagent = Agent(model=model)\nresponse = agent(\"What are the latest developments in AI?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst model = new OpenAIModel({\n  modelId: 'gpt-4o',\n  apiKey: '<KEY>',\n  params: {\n    tools: [{ type: 'web_search' }],\n  },\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke('What are the latest developments in AI?')\n```"
 }
]
```

Web search responses include URL citations that are streamed through the SDK’s citation system.

### File Search

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nmodel = OpenAIResponsesModel(\n    model_id=\"gpt-4o\",\n    params={\n        \"tools\": [{\"type\": \"file_search\", \"vector_store_ids\": [\"vs_abc123\"]}],\n    },\n    client_args={\"api_key\": \"<KEY>\"},\n)\n\nagent = Agent(model=model)\nresponse = agent(\"What does the document say about pricing?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst model = new OpenAIModel({\n  modelId: 'gpt-4o',\n  apiKey: '<KEY>',\n  params: {\n    tools: [\n      {\n        type: 'file_search',\n        vector_store_ids: ['vs_abc123'],\n      },\n    ],\n  },\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke('What does the document say about pricing?')\n```"
 }
]
```

File search requires a [vector store](https://platform.openai.com/docs/guides/tools-file-search) with uploaded files. Text responses stream correctly; file citation annotations are not yet mapped to the SDK citation schema.

### Code Interpreter

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nmodel = OpenAIResponsesModel(\n    model_id=\"gpt-4o\",\n    params={\n        \"tools\": [{\"type\": \"code_interpreter\", \"container\": {\"type\": \"auto\"}}],\n    },\n    client_args={\"api_key\": \"<KEY>\"},\n)\n\nagent = Agent(model=model)\nresponse = agent(\"Calculate the SHA-256 hash of 'hello world'\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst model = new OpenAIModel({\n  modelId: 'gpt-4o',\n  apiKey: '<KEY>',\n  params: {\n    tools: [\n      {\n        type: 'code_interpreter',\n        container: { type: 'auto' },\n      },\n    ],\n  },\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke(\"Calculate the SHA-256 hash of 'hello world'\")\n```"
 }
]
```

The model executes code server-side and includes the results in its text response. The executed code and stdout/stderr are not currently surfaced to the caller.

### Remote MCP

The `mcp` built-in tool connects the model to a remote [MCP](https://modelcontextprotocol.io/) server, letting it call tools hosted externally without any local MCP client setup.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nmodel = OpenAIResponsesModel(\n    model_id=\"gpt-4o\",\n    params={\n        \"tools\": [\n            {\n                \"type\": \"mcp\",\n                \"server_label\": \"deepwiki\",\n                \"server_url\": \"https://mcp.deepwiki.com/mcp\",\n                \"require_approval\": \"never\",\n            }\n        ]\n    },\n    client_args={\"api_key\": \"<KEY>\"},\n)\n\nagent = Agent(model=model)\nresponse = agent(\"Using deepwiki, what language is the strands-agents/harness-sdk repo written in?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst model = new OpenAIModel({\n  modelId: 'gpt-4o',\n  apiKey: '<KEY>',\n  params: {\n    tools: [\n      {\n        type: 'mcp',\n        server_label: 'deepwiki',\n        server_url: 'https://mcp.deepwiki.com/mcp',\n        require_approval: 'never',\n      },\n    ],\n  },\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke(\n  'Using deepwiki, what language is the strands-agents/harness-sdk repo written in?'\n)\n```"
 }
]
```

The model discovers and calls tools exposed by the remote MCP server. The approval flow is not currently surfaced, so `require_approval` must be set to `"never"`.

### Shell

The `shell` built-in tool runs shell commands inside a hosted container managed by OpenAI.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nmodel = OpenAIResponsesModel(\n    model_id=\"gpt-4o\",\n    params={\n        \"tools\": [{\"type\": \"shell\", \"environment\": {\"type\": \"container_auto\"}}],\n    },\n    client_args={\"api_key\": \"<KEY>\"},\n)\n\nagent = Agent(model=model)\nresponse = agent(\"Use the shell to compute the md5sum of the string 'hello world'.\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst model = new OpenAIModel({\n  modelId: 'gpt-4o',\n  apiKey: '<KEY>',\n  params: {\n    tools: [\n      {\n        type: 'shell',\n        environment: { type: 'container_auto' },\n      },\n    ],\n  },\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke(\n  'Use the shell to compute the md5sum of the string \"hello world\".'\n)\n```"
 }
]
```

The model executes commands server-side and includes the output in its text response.

## Server-side Conversation State

When `stateful` is enabled, the model manages conversation history server-side using OpenAI’s `previous_response_id` mechanism. The agent’s local message history is cleared after each turn, reducing payload size for multi-turn conversations.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nmodel = OpenAIResponsesModel(\n    model_id=\"gpt-4o\",\n    stateful=True,\n    client_args={\"api_key\": \"<KEY>\"},\n)\n\nagent = Agent(model=model)\nagent(\"My name is Alice.\")\n# agent.messages is empty; conversation state is on the server\n\nresponse = agent(\"What is my name?\")\n# The model remembers \"Alice\" via server-side state\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst model = new OpenAIModel({\n  modelId: 'gpt-4o',\n  apiKey: '<KEY>',\n  stateful: true,\n})\n\nconst agent = new Agent({ model })\nawait agent.invoke('My name is Alice.')\n// agent.messages is empty \u2014 state is on the server\n\nconst response = await agent.invoke('What is my name?')\n// The model remembers \"Alice\" via server-side state\n```"
 }
]
```

When using a stateful model, the agent automatically uses a null conversation manager and throws an error if a conversation manager is also supplied.

## Advanced Features

### Token Counting

Token counting is used by context management strategies to estimate input tokens before each model call.

```sa-tabs
[
 {
  "label": "Python",
  "body": "The OpenAI Responses provider can use the native `responses.input_tokens.count()` API, which provides exact token counts including messages, instructions, and tool specifications.\n\nYou can enable native token counting with:\n\n```python\nmodel = OpenAIResponsesModel(\n    model_id=\"gpt-4.1\",\n    use_native_token_count=True,\n)\n```\n\nWhen disabled (or if the API call fails), falls back to estimation with a character-based heuristic (characters \u00f7 4 for text, characters \u00f7 2 for JSON)."
 },
 {
  "label": "TypeScript",
  "body": "The OpenAI Responses provider does not currently implement native token counting in the TypeScript SDK. It uses estimation with a character-based heuristic (characters \u00f7 4 for text, characters \u00f7 2 for JSON)."
 }
]
```

## References

-   [Python API](lc:api/python/strands.models.openai_responses)
-   [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses)
-   [Amazon Bedrock Mantle](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html)
-   [OpenAI Chat Completions](lc:user-guide/concepts/model-providers/openai) (alternative provider using the Chat Completions API)

## Related pages

- [Build with AI](lc:user-guide/build-with-ai) (1 shared tag)
- [Model Context Protocol (MCP) Tools](lc:user-guide/concepts/tools/mcp-tools) (1 shared tag)
- [Tools Overview](lc:user-guide/concepts/tools) (1 shared tag)
- [Session Management](lc:user-guide/concepts/agents/session-management) (1 shared tag)
- [State Management](lc:user-guide/concepts/agents/state) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/models/openai_responses.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/models/openai_responses.py)

### TypeScript

- [harness-sdk/strands-ts/src/models/openai/responses-adapter.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/models/openai/responses-adapter.ts)
