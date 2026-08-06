[Anthropic](https://docs.anthropic.com/en/home) is an AI safety and research company focused on building reliable, interpretable, and steerable AI systems. Included in their offerings is the Claude AI family of models, which are known for their conversational abilities, careful reasoning, and capacity to follow complex instructions. The Strands Agents SDK implements an Anthropic provider, allowing users to run agents against Claude models directly.

## Installation

Anthropic is configured as an optional dependency in Strands Agents. To install, run:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```bash\npip install 'strands-agents[anthropic]' strands-agents-tools\n```"
 },
 {
  "label": "TypeScript",
  "body": "```bash\nnpm install @strands-agents/sdk @anthropic-ai/sdk\n```"
 }
]
```

## Usage

After installing dependencies, you can import and initialize the Strands Agents’ Anthropic provider as follows:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.models.anthropic import AnthropicModel\nfrom strands_tools import calculator\n\nmodel = AnthropicModel(\n    client_args={\n        \"api_key\": \"<KEY>\",\n    },\n    # **model_config\n    max_tokens=1028,\n    model_id=\"claude-sonnet-4-6\",\n    params={\n        \"temperature\": 0.7,\n    }\n)\n\nagent = Agent(model=model, tools=[calculator])\nresponse = agent(\"What is 2+2\")\nprint(response)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { AnthropicModel } from '@strands-agents/sdk/models/anthropic'\n\nconst model = new AnthropicModel({\n  apiKey: process.env.ANTHROPIC_API_KEY || '<KEY>',\n  modelId: 'claude-sonnet-4-6',\n  maxTokens: 1028,\n  params: {\n    temperature: 0.7,\n  },\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke('What is 2+2')\nconsole.log(response)\n```"
 }
]
```

## Configuration

### Client Configuration

```sa-tabs
[
 {
  "label": "Python",
  "body": "The `client_args` configure the underlying Anthropic client. For a complete list of available arguments, please refer to the [Anthropic Python SDK docs](https://platform.claude.com/docs/en/api/sdks/python)."
 },
 {
  "label": "TypeScript",
  "body": "The `clientConfig` configures the underlying Anthropic client. You can also pass a pre-configured `client` instance directly (see [Custom Client](#custom-client)). For a complete list of available options, please refer to the [Anthropic TypeScript SDK docs](https://platform.claude.com/docs/en/api/sdks/typescript)."
 }
]
```

### Model Configuration

```sa-tabs
[
 {
  "label": "Python",
  "body": "The `model_config` configures the underlying model selected for inference. The supported configurations are:\n\n| Parameter | Description | Example | Options |\n| --- | --- | --- | --- |\n| `max_tokens` | Maximum number of tokens to generate before stopping | `1028` | [reference](https://platform.claude.com/docs/en/api/messages/create#create.max_tokens) |\n| `model_id` | ID of a model to use | `claude-sonnet-4-6` | [reference](https://platform.claude.com/docs/en/api/messages/create#create.model) |\n| `params` | Additional pass-through parameters | `{\"metadata\": {\"user_id\": \"u1\"}}` | [reference](https://platform.claude.com/docs/en/api/messages/create) |"
 },
 {
  "label": "TypeScript",
  "body": "| Parameter | Description | Example | Options |\n| --- | --- | --- | --- |\n| `modelId` | ID of a model to use | `'claude-sonnet-4-6'` | [reference](https://platform.claude.com/docs/en/api/messages/create#create.model) |\n| `maxTokens` | Maximum tokens to generate | `1028` | [reference](https://platform.claude.com/docs/en/api/messages/create#create.max_tokens) |\n| `stopSequences` | Sequences that stop generation | `['END']` | [reference](https://platform.claude.com/docs/en/api/messages/create#create.stop_sequences) |\n| `params` | Additional pass-through parameters | `{ metadata: { user_id: 'u1' } }` | [reference](https://platform.claude.com/docs/en/api/messages/create) |"
 }
]
```

## Troubleshooting

```sa-tabs
[
 {
  "label": "Python",
  "body": "### Module Not Found\n\nIf you encounter the error `ModuleNotFoundError: No module named 'anthropic'`, this means you haven\u2019t installed the `anthropic` dependency in your environment. To fix, run `pip install 'strands-agents[anthropic]'`."
 },
 {
  "label": "TypeScript",
  "body": "### Import Errors\n\nIf you encounter import errors for `@anthropic-ai/sdk`, ensure the package is installed: `npm install @anthropic-ai/sdk`."
 }
]
```

## Advanced Features

### Custom Client

You can pass a pre-configured Anthropic client directly to `AnthropicModel`. You are responsible for managing the client’s lifecycle.

```sa-tabs
[
 {
  "label": "Python",
  "body": "The Python SDK does not currently support passing a pre-configured client. Use `client_args` to configure the client at initialization."
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport Anthropic from '@anthropic-ai/sdk'\nimport { Agent } from '@strands-agents/sdk'\nimport { AnthropicModel } from '@strands-agents/sdk/models/anthropic'\n\nconst client = new Anthropic({ apiKey: '<KEY>' })\n\nconst model = new AnthropicModel({\n  client,\n  modelId: 'claude-sonnet-4-6',\n  maxTokens: 1028,\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke('What is 2+2')\nconsole.log(response)\n```"
 }
]
```

### Structured Output

Anthropic models support structured output through tool use. Pass a schema to the agent, and Strands generates a tool from it that the model calls to return validated, type-safe data.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Define a Pydantic model and pass it to [`agent.structured_output()`](lc:api/python/strands.agent.agent#Agent.structured_output):\n\n```python\nfrom pydantic import BaseModel, Field\nfrom strands import Agent\nfrom strands.models.anthropic import AnthropicModel\n\nclass MovieReview(BaseModel):\n    \"\"\"Analyze a movie review.\"\"\"\n    title: str = Field(description=\"Movie title\")\n    rating: int = Field(description=\"Rating from 1-10\", ge=1, le=10)\n    genre: str = Field(description=\"Primary genre\")\n    sentiment: str = Field(description=\"Overall sentiment: positive, negative, or neutral\")\n    summary: str = Field(description=\"Brief summary of the review\")\n\nmodel = AnthropicModel(\n    client_args={\"api_key\": \"<KEY>\"},\n    max_tokens=1028,\n    model_id=\"claude-sonnet-4-6\",\n)\n\nagent = Agent(model=model)\n\nresult = agent.structured_output(\n    MovieReview,\n    \"\"\"\n    Just watched \"The Matrix\" - what an incredible sci-fi masterpiece!\n    The groundbreaking visual effects and philosophical themes make this\n    a must-watch. Keanu Reeves delivers a solid performance. 9/10!\n    \"\"\"\n)\n\nprint(f\"Movie: {result.title}\")\nprint(f\"Rating: {result.rating}/10\")\nprint(f\"Genre: {result.genre}\")\nprint(f\"Sentiment: {result.sentiment}\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "Define a Zod schema and pass it as `structuredOutputSchema`. Validated output is on `result.structuredOutput`:\n\n```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { AnthropicModel } from '@strands-agents/sdk/models/anthropic'\nimport { z } from 'zod'\n\nconst MovieReview = z.object({\n  title: z.string().describe('Movie title'),\n  rating: z.number().min(1).max(10).describe('Rating from 1-10'),\n  genre: z.string().describe('Primary genre'),\n  sentiment: z.enum(['positive', 'negative', 'neutral']).describe('Overall sentiment'),\n  summary: z.string().describe('Brief summary of the review'),\n})\n\nconst model = new AnthropicModel({\n  apiKey: '<KEY>',\n  modelId: 'claude-sonnet-4-6',\n  maxTokens: 1028,\n})\n\nconst agent = new Agent({ model, structuredOutputSchema: MovieReview })\n\nconst result = await agent.invoke(\n  `Just watched \"The Matrix\" - what an incredible sci-fi masterpiece!\n   The groundbreaking visual effects and philosophical themes make this\n   a must-watch. Keanu Reeves delivers a solid performance. 9/10!`\n)\n\nconst review = result.structuredOutput as z.infer<typeof MovieReview>\nconsole.log(`Movie: ${review.title}`)\nconsole.log(`Rating: ${review.rating}/10`)\nconsole.log(`Genre: ${review.genre}`)\nconsole.log(`Sentiment: ${review.sentiment}`)\n```"
 }
]
```

For schema patterns, error handling, and per-invocation overrides, see [Structured Output](lc:user-guide/concepts/agents/structured-output).

### Token Counting

Token counting is used by context management strategies to estimate input tokens before each model call.

```sa-tabs
[
 {
  "label": "Python",
  "body": "The Anthropic provider can use the native `messages.count_tokens()` API, which provides exact token counts including system prompts, messages, and tool specifications.\n\nYou can enable native token counting with:\n\n```python\nmodel = AnthropicModel(\n    model_id=\"claude-sonnet-4-6\",\n    use_native_token_count=True,\n)\n```\n\nWhen disabled (or if the API call fails), falls back to estimation with a character-based heuristic (characters \u00f7 4 for text, characters \u00f7 2 for JSON)."
 },
 {
  "label": "TypeScript",
  "body": "The Anthropic provider can use the native `messages.countTokens()` API, which provides exact token counts including system prompts, messages, and tool specifications.\n\nYou can enable native token counting with:\n\n```typescript\nconst model = new AnthropicModel({\n  modelId: 'claude-sonnet-4-6',\n  useNativeTokenCount: true,\n})\n```\n\nWhen disabled (or if the API call fails), falls back to estimation with a character-based heuristic (characters \u00f7 4 for text, characters \u00f7 2 for JSON)."
 }
]
```

## References

-   [Python API](lc:api/python/strands.models.model)
-   [Anthropic](https://platform.claude.com/docs/en/home)

## Related pages

- [Result Caching](lc:user-guide/evals-sdk/how-to/result_caching) (1 shared tag)
- [LiteLLM](lc:user-guide/concepts/model-providers/litellm) (1 shared tag)
- [Structured Output](lc:user-guide/concepts/agents/structured-output) (1 shared tag)
- [OpenAI](lc:user-guide/concepts/model-providers/openai) (1 shared tag)
- [Writer](lc:user-guide/concepts/model-providers/writer) (1 shared tag)
- [Amazon Bedrock](lc:user-guide/concepts/model-providers/amazon-bedrock) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/models/anthropic.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/models/anthropic.py)

### TypeScript

- [harness-sdk/strands-ts/src/models/anthropic.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/models/anthropic.ts)
