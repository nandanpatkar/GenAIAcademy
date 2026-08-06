[Google Gemini](https://ai.google.dev/api) is Google’s family of multimodal large language models designed for advanced reasoning, code generation, and creative tasks. The Strands Agents SDK implements a Google/Gemini provider, allowing you to run agents against the Gemini models available through Google’s AI API.

## Installation

Gemini is configured as an optional dependency in Strands Agents.

To install it, run:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```bash\npip install 'strands-agents[gemini]' strands-agents-tools\n```"
 },
 {
  "label": "TypeScript",
  "body": "```bash\nnpm install @strands-agents/sdk @google/genai\n```"
 }
]
```

## Usage

After installing dependencies, you can import and initialize the Strands Agents’ Gemini provider as follows:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.models.gemini import GeminiModel\nfrom strands_tools import calculator\n\nmodel = GeminiModel(\n    client_args={\n        \"api_key\": \"<KEY>\",\n    },\n    # **model_config\n    model_id=\"gemini-2.5-flash\",\n    params={\n        # some sample model parameters\n        \"temperature\": 0.7,\n        \"max_output_tokens\": 2048,\n        \"top_p\": 0.9,\n        \"top_k\": 40\n    }\n)\n\nagent = Agent(model=model, tools=[calculator])\nresponse = agent(\"What is 2+2\")\nprint(response)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { GoogleModel } from '@strands-agents/sdk/models/google'\n\nconst model = new GoogleModel({\n  apiKey: '<KEY>',\n  modelId: 'gemini-2.5-flash',\n  params: {\n    temperature: 0.7,\n    maxOutputTokens: 2048,\n    topP: 0.9,\n    topK: 40,\n  },\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke('What is 2+2')\nconsole.log(response)\n```"
 }
]
```

## Configuration

### Client Configuration

```sa-tabs
[
 {
  "label": "Python",
  "body": "The `client_args` configure the underlying Google GenAI client. For a complete list of available arguments, please refer to the [Google GenAI documentation](https://googleapis.github.io/python-genai/)."
 },
 {
  "label": "TypeScript",
  "body": "The `clientConfig` configures the underlying Google GenAI client. You can also pass a pre-configured `client` instance directly. For a complete list of available options, please refer to the [@google/genai documentation](https://github.com/googleapis/js-genai)."
 }
]
```

### Model Configuration

```sa-tabs
[
 {
  "label": "Python",
  "body": "The `model_config` configures the underlying model selected for inference. The supported configurations are:\n\n| Parameter | Description | Example | Options |\n| --- | --- | --- | --- |\n| `model_id` | ID of a Gemini model to use | `\"gemini-2.5-flash\"` | [Available models](#available-models) |\n| `params` | Model specific parameters | `{\"temperature\": 0.7, \"maxOutputTokens\": 2048}` | [Parameter reference](#model-parameters) |"
 },
 {
  "label": "TypeScript",
  "body": "| Parameter | Description | Example | Options |\n| --- | --- | --- | --- |\n| `modelId` | ID of a Gemini model to use | `'gemini-2.5-flash'` | [Available models](#available-models) |\n| `params` | Model specific parameters | `{ temperature: 0.7, maxOutputTokens: 2048 }` | [Parameter reference](#model-parameters) |"
 }
]
```

### Model Parameters

For a complete list of supported parameters, see the [Gemini API documentation](https://ai.google.dev/api/generate-content#generationconfig).

```sa-tabs
[
 {
  "label": "Python",
  "body": "| Parameter | Description | Type |\n| --- | --- | --- |\n| `temperature` | Controls randomness in responses | `float` |\n| `max_output_tokens` | Maximum tokens to generate | `int` |\n| `top_p` | Nucleus sampling parameter | `float` |\n| `top_k` | Top-k sampling parameter | `int` |\n| `candidate_count` | Number of response candidates | `int` |\n| `stop_sequences` | Custom stopping sequences | `list[str]` |\n\n**Example:**\n\n```python\nparams = {\n    \"temperature\": 0.8,\n    \"max_output_tokens\": 4096,\n    \"top_p\": 0.95,\n    \"top_k\": 40,\n    \"candidate_count\": 1,\n    \"stop_sequences\": ['STOP!']\n}\n```"
 },
 {
  "label": "TypeScript",
  "body": "| Parameter | Description | Type |\n| --- | --- | --- |\n| `temperature` | Controls randomness in responses | `number` |\n| `maxOutputTokens` | Maximum tokens to generate | `number` |\n| `topP` | Nucleus sampling parameter | `number` |\n| `topK` | Top-k sampling parameter | `number` |\n| `candidateCount` | Number of response candidates | `number` |\n| `stopSequences` | Custom stopping sequences | `string[]` |\n\n**Example:**\n\n```typescript\nconst params = {\n  temperature: 0.8,\n  maxOutputTokens: 4096,\n  topP: 0.95,\n  topK: 40,\n  candidateCount: 1,\n  stopSequences: ['STOP!'],\n}\n```"
 }
]
```

### Available Models

For a complete list of supported models, see the [Gemini API documentation](https://ai.google.dev/gemini-api/docs/models).

**Popular Models:**

-   `gemini-2.5-pro` - Most advanced model for complex reasoning and thinking
-   `gemini-2.5-flash` - Best balance of performance and cost
-   `gemini-2.5-flash-lite` - Most cost-efficient option
-   `gemini-2.0-flash` - Next-gen features with improved speed
-   `gemini-2.0-flash-lite` - Cost-optimized version of 2.0

### Built-in Tools

```sa-tabs
[
 {
  "label": "Python",
  "body": "Google\u2019s built-in tools (Google Search, Code Execution, URL Context) can be passed via the `gemini_tools` config option. These are appended alongside any function tools registered on the agent.\n\n```python\nfrom google import genai\nfrom strands import Agent\nfrom strands.models.gemini import GeminiModel\n\nmodel = GeminiModel(\n    client_args={\"api_key\": \"<KEY>\"},\n    model_id=\"gemini-2.5-flash\",\n    gemini_tools=[\n        genai.types.Tool(google_search=genai.types.GoogleSearch()),\n    ],\n)\n\nagent = Agent(model=model)\nresponse = agent(\"What are the latest AI news today?\")\nprint(response)\n```"
 },
 {
  "label": "TypeScript",
  "body": "Google\u2019s built-in tools (Google Search, Code Execution, URL Context) can be passed via the `builtInTools` config option. These are appended alongside any function tools registered on the agent.\n\n```typescript\nconst model = new GoogleModel({\n  apiKey: '<KEY>',\n  modelId: 'gemini-2.5-flash',\n  builtInTools: [{ googleSearch: {} }],\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke('What are the latest AI news today?')\nconsole.log(response)\n```"
 }
]
```

For available built-in tools, see the [Gemini tools documentation](https://ai.google.dev/gemini-api/docs/tools).

## Troubleshooting

### Module Not Found

```sa-tabs
[
 {
  "label": "Python",
  "body": "If you encounter the error `ModuleNotFoundError: No module named 'google.genai'`, this means the `google-genai` dependency hasn\u2019t been properly installed in your environment. To fix this, run `pip install 'strands-agents[gemini]'`."
 },
 {
  "label": "TypeScript",
  "body": "If you encounter import errors for `@google/genai`, ensure the package is installed: `npm install @google/genai`."
 }
]
```

### API Key Issues

Make sure your Google AI API key is properly set via `client_args``apiKey`, or as the `GOOGLE_API_KEY` / `GEMINI_API_KEY` environment variable. You can obtain an API key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### Rate Limiting and Safety Issues

The Gemini provider handles several types of errors automatically:

-   **Safety/Content Policy**: When content is blocked due to safety concerns, the model will return a safety message
-   **Rate Limiting**: When quota limits are exceeded, a `ModelThrottledException` is raised
-   **Server Errors**: Temporary server issues are handled with appropriate error messages

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.types.exceptions import ModelThrottledException\n\ntry:\n    response = agent(\"Your query here\")\nexcept ModelThrottledException as e:\n    print(f\"Rate limit exceeded: {e}\")\n    # Implement backoff strategy\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\ntry {\n  const response = await agent.invoke('Your query here')\n} catch (error) {\n  console.error('Error:', error)\n  // Implement backoff strategy\n}\n```"
 }
]
```

## Advanced Features

### Structured Output

Gemini models support structured output through their native JSON schema capabilities. Pass a schema to the agent, and Strands converts it to Gemini’s JSON schema format and validates the response.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Define a Pydantic model and pass it to [`agent.structured_output()`](lc:api/python/strands.agent.agent#Agent.structured_output):\n\n```python\nfrom pydantic import BaseModel, Field\nfrom strands import Agent\nfrom strands.models.gemini import GeminiModel\n\nclass MovieReview(BaseModel):\n    \"\"\"Analyze a movie review.\"\"\"\n    title: str = Field(description=\"Movie title\")\n    rating: int = Field(description=\"Rating from 1-10\", ge=1, le=10)\n    genre: str = Field(description=\"Primary genre\")\n    sentiment: str = Field(description=\"Overall sentiment: positive, negative, or neutral\")\n    summary: str = Field(description=\"Brief summary of the review\")\n\nmodel = GeminiModel(\n    client_args={\"api_key\": \"<KEY>\"},\n    model_id=\"gemini-2.5-flash\",\n    params={\n        \"temperature\": 0.3,\n        \"max_output_tokens\": 1024,\n        \"top_p\": 0.85\n    }\n)\n\nagent = Agent(model=model)\n\nresult = agent.structured_output(\n    MovieReview,\n    \"\"\"\n    Just watched \"The Matrix\" - what an incredible sci-fi masterpiece!\n    The groundbreaking visual effects and philosophical themes make this\n    a must-watch. Keanu Reeves delivers a solid performance. 9/10!\n    \"\"\"\n)\n\nprint(f\"Movie: {result.title}\")\nprint(f\"Rating: {result.rating}/10\")\nprint(f\"Genre: {result.genre}\")\nprint(f\"Sentiment: {result.sentiment}\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "Define a Zod schema and pass it as `structuredOutputSchema`. Validated output is on `result.structuredOutput`:\n\n```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { GoogleModel } from '@strands-agents/sdk/models/google'\nimport { z } from 'zod'\n\nconst MovieReview = z.object({\n  title: z.string().describe('Movie title'),\n  rating: z.number().min(1).max(10).describe('Rating from 1-10'),\n  genre: z.string().describe('Primary genre'),\n  sentiment: z.enum(['positive', 'negative', 'neutral']).describe('Overall sentiment'),\n  summary: z.string().describe('Brief summary of the review'),\n})\n\nconst model = new GoogleModel({\n  apiKey: '<KEY>',\n  modelId: 'gemini-2.5-flash',\n})\n\nconst agent = new Agent({ model, structuredOutputSchema: MovieReview })\n\nconst result = await agent.invoke(\n  `Just watched \"The Matrix\" - what an incredible sci-fi masterpiece!\n   The groundbreaking visual effects and philosophical themes make this\n   a must-watch. Keanu Reeves delivers a solid performance. 9/10!`\n)\n\nconst review = result.structuredOutput as z.infer<typeof MovieReview>\nconsole.log(`Movie: ${review.title}`)\nconsole.log(`Rating: ${review.rating}/10`)\nconsole.log(`Genre: ${review.genre}`)\nconsole.log(`Sentiment: ${review.sentiment}`)\n```"
 }
]
```

For schema patterns, error handling, and per-invocation overrides, see [Structured Output](lc:user-guide/concepts/agents/structured-output).

### Custom client

Users can pass their own custom Gemini client to the GeminiModel for Strands Agents to use directly. Users are responsible for handling the lifecycle (e.g., closing) of the client.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom google import genai\nfrom strands import Agent\nfrom strands.models.gemini import GeminiModel\nfrom strands_tools import calculator\n\nclient = genai.Client(api_key=\"<KEY>\")\n\nmodel = GeminiModel(\n    client=client,\n    # **model_config\n    model_id=\"gemini-2.5-flash\",\n    params={\n        # some sample model parameters\n        \"temperature\": 0.7,\n        \"max_output_tokens\": 2048,\n        \"top_p\": 0.9,\n        \"top_k\": 40\n    }\n)\n\nagent = Agent(model=model, tools=[calculator])\nresponse = agent(\"What is 2+2\")\nprint(response)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { GoogleGenAI } from '@google/genai'\nimport { Agent } from '@strands-agents/sdk'\nimport { GoogleModel } from '@strands-agents/sdk/models/google'\n\nconst client = new GoogleGenAI({ apiKey: '<KEY>' })\n\nconst model = new GoogleModel({\n  client,\n  modelId: 'gemini-2.5-flash',\n  params: {\n    temperature: 0.7,\n    maxOutputTokens: 2048,\n    topP: 0.9,\n    topK: 40,\n  },\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke('What is 2+2')\nconsole.log(response)\n```"
 }
]
```

### Multimodal Capabilities

Gemini models support text, image, document, and video inputs, making them ideal for multimodal applications.

#### Image Input

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.models.gemini import GeminiModel\n\nmodel = GeminiModel(\n    client_args={\"api_key\": \"<KEY>\"},\n    model_id=\"gemini-2.5-flash\",\n    params={\n        \"temperature\": 0.5,\n        \"max_output_tokens\": 2048,\n        \"top_p\": 0.9\n    }\n)\n\nagent = Agent(model=model)\n\n# Process image with text\nresponse = agent([\n    {\n        \"role\": \"user\",\n        \"content\": [\n            {\"text\": \"What do you see in this image?\"},\n            {\"image\": {\"format\": \"png\", \"source\": {\"bytes\": image_bytes}}}\n        ]\n    }\n])\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, ImageBlock, TextBlock } from '@strands-agents/sdk'\nimport { GoogleModel } from '@strands-agents/sdk/models/google'\n\nconst model = new GoogleModel({\n  apiKey: '<KEY>',\n  modelId: 'gemini-2.5-flash',\n})\n\nconst agent = new Agent({ model })\n\n// Process image with text\nconst result = await agent.invoke([\n  new TextBlock('What do you see in this image?'),\n  new ImageBlock({\n    format: 'png',\n    source: { bytes: imageBytes },\n  }),\n])\n```"
 }
]
```

#### Document Input

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nresponse = agent([\n    {\n        \"role\": \"user\",\n        \"content\": [\n            {\"text\": \"Summarize this document\"},\n            {\"document\": {\"format\": \"pdf\", \"source\": {\"bytes\": document_bytes}}}\n        ]\n    }\n])\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { DocumentBlock, TextBlock } from '@strands-agents/sdk'\n\nconst result = await agent.invoke([\n  new TextBlock('Summarize this document'),\n  new DocumentBlock({\n    name: 'my-document',\n    format: 'pdf',\n    source: { bytes: pdfBytes },\n  }),\n])\n```"
 }
]
```

#### Video Input

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nresponse = agent([\n    {\n        \"role\": \"user\",\n        \"content\": [\n            {\"text\": \"Describe what happens in this video\"},\n            {\"video\": {\"format\": \"mp4\", \"source\": {\"bytes\": video_bytes}}}\n        ]\n    }\n])\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { VideoBlock, TextBlock } from '@strands-agents/sdk'\n\nconst result = await agent.invoke([\n  new TextBlock('Describe what happens in this video'),\n  new VideoBlock({\n    format: 'mp4',\n    source: { bytes: videoBytes },\n  }),\n])\n```"
 }
]
```

**Supported formats:**

-   **Images**: PNG, JPEG, GIF, WebP (automatically detected via MIME type)
-   **Documents**: PDF and other binary formats (automatically detected via MIME type)
-   **Video**: MP4 and other video formats (automatically detected via MIME type)

### Token Counting

Token counting is used by context management strategies to estimate input tokens before each model call.

```sa-tabs
[
 {
  "label": "Python",
  "body": "The Google provider can use the native `models.count_tokens()` API for message content. However, the Gemini API does not support counting system instructions or tool specifications natively. These are estimated separately using a character-based heuristic (characters \u00f7 4 for text, characters \u00f7 2 for JSON).\n\nYou can enable native token counting with:\n\n```python\nmodel = GoogleModel(\n    model_id=\"gemini-2.5-flash\",\n    use_native_token_count=True,\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "The Google provider can use the native `models.countTokens()` API for message content. However, the Gemini API does not support counting system instructions or tool specifications natively. These are estimated separately using a character-based heuristic (characters \u00f7 4 for text, characters \u00f7 2 for JSON).\n\nYou can enable native token counting with:\n\n```typescript\nconst model = new GoogleModel({\n  modelId: 'gemini-2.5-flash',\n  useNativeTokenCount: true,\n})\n```\n\nWhen disabled (or if the API call fails), falls back to estimation using the character-based heuristic."
 }
]
```

## References

-   [Python API](lc:api/python/strands.models.model)
-   [Google Gemini](https://ai.google.dev/api)
-   [Google GenAI SDK documentation](https://googleapis.github.io/python-genai/)
-   [Google AI Studio](https://aistudio.google.com/)
-   [@google/genai TypeScript SDK](https://github.com/googleapis/js-genai)

## Related pages

- [Vercel](lc:user-guide/concepts/model-providers/vercel) (1 shared tag)
- [Multimodal Correctness Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_correctness_evaluator) (1 shared tag)
- [Multimodal Faithfulness Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_faithfulness_evaluator) (1 shared tag)
- [Multimodal Instruction Following Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_instruction_following_evaluator) (1 shared tag)
- [Multimodal Output Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_output_evaluator) (1 shared tag)
- [Multimodal Overall Quality Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_overall_quality_evaluator) (1 shared tag)
- [OpenAI](lc:user-guide/concepts/model-providers/openai) (1 shared tag)
- [Writer](lc:user-guide/concepts/model-providers/writer) (1 shared tag)
- [Amazon Nova](lc:user-guide/concepts/model-providers/amazon-nova) (1 shared tag)
- [Amazon Bedrock](lc:user-guide/concepts/model-providers/amazon-bedrock) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/models/gemini.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/models/gemini.py)

### TypeScript

- [harness-sdk/strands-ts/src/models/google/model.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/models/google/model.ts)
