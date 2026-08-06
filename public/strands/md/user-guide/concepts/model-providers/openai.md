[OpenAI](https://platform.openai.com/docs/overview) is an AI research and deployment company that provides a suite of powerful language models. The Strands Agents SDK implements an OpenAI provider, allowing you to run agents against any OpenAI or OpenAI-compatible model.

## Installation

OpenAI is configured as an optional dependency in Strands Agents. To install, run:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```bash\npip install 'strands-agents[openai]' strands-agents-tools\n```"
 },
 {
  "label": "TypeScript",
  "body": "```bash\nnpm install @strands-agents/sdk openai\n```"
 }
]
```

## Usage

After installing dependencies, you can import and initialize the Strands Agents’ OpenAI provider as follows:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.models.openai import OpenAIModel\nfrom strands_tools import calculator\n\nmodel = OpenAIModel(\n    client_args={\n        \"api_key\": \"<KEY>\",\n    },\n    # **model_config\n    model_id=\"gpt-4o\",\n    params={\n        \"max_tokens\": 1000,\n        \"temperature\": 0.7,\n    }\n)\n\nagent = Agent(model=model, tools=[calculator])\nresponse = agent(\"What is 2+2\")\nprint(response)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { OpenAIModel } from '@strands-agents/sdk/models/openai'\n\nconst model = new OpenAIModel({\n  api: 'chat',\n  apiKey: process.env.OPENAI_API_KEY || '<KEY>',\n  modelId: 'gpt-5.4',\n  maxTokens: 1000,\n  temperature: 0.7,\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke('What is 2+2')\nconsole.log(response)\n```"
 }
]
```

To connect to a custom OpenAI-compatible server:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nmodel = OpenAIModel(\n    client_args={\n      \"api_key\": \"<KEY>\",\n      \"base_url\": \"<URL>\",\n    },\n    ...\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst model = new OpenAIModel({\n  api: 'chat',\n  apiKey: '<KEY>',\n  clientConfig: {\n    baseURL: '<URL>',\n  },\n  modelId: 'gpt-5.4',\n})\n\nconst agent = new Agent({ model })\nconst response = await agent.invoke('Hello!')\n```"
 }
]
```

## Configuration

### Client Configuration

```sa-tabs
[
 {
  "label": "Python",
  "body": "The `client_args` configure the underlying OpenAI client. For a complete list of available arguments, please refer to the OpenAI [source](https://github.com/openai/openai-python)."
 },
 {
  "label": "TypeScript",
  "body": "The `clientConfig` configures the underlying OpenAI client. For a complete list of available options, please refer to the [OpenAI TypeScript documentation](https://github.com/openai/openai-node)."
 }
]
```

### Model Configuration

The model configuration sets parameters for inference:

```sa-tabs
[
 {
  "label": "Python",
  "body": "| Parameter | Description | Example | Options |\n| --- | --- | --- | --- |\n| `model_id` | ID of a model to use | `gpt-4o` | [reference](https://platform.openai.com/docs/models) |\n| `params` | Model specific parameters | `{\"max_tokens\": 1000, \"temperature\": 0.7}` | [reference](https://platform.openai.com/docs/api-reference/chat/create) |"
 },
 {
  "label": "TypeScript",
  "body": "| Parameter | Description | Example | Options |\n| --- | --- | --- | --- |\n| `modelId` | ID of a model to use | `gpt-5.4` | [reference](https://platform.openai.com/docs/models) |\n| `maxTokens` | Maximum tokens to generate | `1000` | [reference](https://platform.openai.com/docs/api-reference/chat/create) |\n| `temperature` | Controls randomness (0-2) | `0.7` | [reference](https://platform.openai.com/docs/api-reference/chat/create) |\n| `topP` | Nucleus sampling (0-1) | `0.9` | [reference](https://platform.openai.com/docs/api-reference/chat/create) |\n| `frequencyPenalty` | Reduces repetition (-2.0 to 2.0) | `0.5` | [reference](https://platform.openai.com/docs/api-reference/chat/create) |\n| `presencePenalty` | Encourages new topics (-2.0 to 2.0) | `0.5` | [reference](https://platform.openai.com/docs/api-reference/chat/create) |\n| `params` | Additional parameters not listed above | `{ stop: [\"END\"] }` | [reference](https://platform.openai.com/docs/api-reference/chat/create) |"
 }
]
```

## Troubleshooting

```sa-tabs
[
 {
  "label": "Python",
  "body": "**Module Not Found**\n\nIf you encounter the error `ModuleNotFoundError: No module named 'openai'`, this means you haven\u2019t installed the `openai` dependency in your environment. To fix, run `pip install 'strands-agents[openai]'`.\n\n**GPT-OSS Tool Calling Fails on Non-Managed Endpoints**\n\nIf you are running GPT-OSS on an endpoint that isn\u2019t a managed inference provider and you see errors like `Unexpected token ... while expecting start token ...` during tool calling, your endpoint likely doesn\u2019t have the correct stop tokens configured.\n\nAs an immediate workaround, pass the GPT-OSS stop sequences explicitly via `params`:\n\n```python\nmodel = OpenAIModel(\n    client_args={\n        \"api_key\": \"<KEY>\",\n        \"base_url\": \"http://localhost:8000/v1\",\n    },\n    model_id=\"<MODEL_ID>\",\n    params={\"stop\": [\"<|call|>\", \"<|return|>\", \"<|end|>\"]}\n)\n```\n\nSee the [OpenAI Harmony message format](https://cookbook.openai.com/articles/openai-harmony#message-format) for details on GPT-OSS stop tokens."
 },
 {
  "label": "TypeScript",
  "body": "**Authentication Errors**\n\nIf you encounter authentication errors, ensure your OpenAI API key is properly configured. Set the `OPENAI_API_KEY` environment variable or pass it via the `apiKey` parameter in the model configuration.\n\n**GPT-OSS Tool Calling Fails on Non-Managed Endpoints**\n\nIf you are running GPT-OSS on an endpoint that isn\u2019t a managed inference provider and you see errors like `Unexpected token ... while expecting start token ...` during tool calling, your endpoint likely doesn\u2019t have the correct stop tokens configured.\n\nAs an immediate workaround, pass the GPT-OSS stop sequences explicitly via `params`:\n\n```typescript\nimport { OpenAIModel } from '@strands-agents/sdk/models/openai'\n\nconst model = new OpenAIModel({\n  api: 'chat',\n  apiKey: '<KEY>',\n  clientConfig: {\n    baseURL: 'http://localhost:8000/v1',\n  },\n  modelId: '<MODEL_ID>',\n  params: { stop: ['<|call|>', '<|return|>', '<|end|>'] },\n})\n```\n\nSee the [OpenAI Harmony message format](https://cookbook.openai.com/articles/openai-harmony#message-format) for details on GPT-OSS stop tokens."
 }
]
```

## Advanced Features

### Structured Output

OpenAI models support structured output through their native tool calling capabilities. Pass a schema to the agent, and Strands converts it to OpenAI’s function calling format and validates the response.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Define a Pydantic model and pass it to `agent.structured_output()`:\n\n```python\nfrom pydantic import BaseModel, Field\nfrom strands import Agent\nfrom strands.models.openai import OpenAIModel\n\nclass PersonInfo(BaseModel):\n    \"\"\"Extract person information from text.\"\"\"\n    name: str = Field(description=\"Full name of the person\")\n    age: int = Field(description=\"Age in years\")\n    occupation: str = Field(description=\"Job or profession\")\n\nmodel = OpenAIModel(\n    client_args={\"api_key\": \"<KEY>\"},\n    model_id=\"gpt-4o\",\n)\n\nagent = Agent(model=model)\n\nresult = agent.structured_output(\n    PersonInfo,\n    \"John Smith is a 30-year-old software engineer working at a tech startup.\"\n)\n\nprint(f\"Name: {result.name}\")      # \"John Smith\"\nprint(f\"Age: {result.age}\")        # 30\nprint(f\"Job: {result.occupation}\") # \"software engineer\"\n```"
 },
 {
  "label": "TypeScript",
  "body": "Define a Zod schema and pass it as `structuredOutputSchema`. Validated output is on `result.structuredOutput`:\n\n```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { OpenAIModel } from '@strands-agents/sdk/models/openai'\nimport { z } from 'zod'\n\nconst PersonInfo = z.object({\n  name: z.string().describe('Full name of the person'),\n  age: z.number().describe('Age in years'),\n  occupation: z.string().describe('Job or profession'),\n})\n\nconst model = new OpenAIModel({\n  api: 'chat',\n  apiKey: process.env.OPENAI_API_KEY || '<KEY>',\n  modelId: 'gpt-4o',\n})\n\nconst agent = new Agent({ model, structuredOutputSchema: PersonInfo })\n\nconst result = await agent.invoke(\n  'John Smith is a 30-year-old software engineer working at a tech startup.'\n)\n\nconst person = result.structuredOutput as z.infer<typeof PersonInfo>\nconsole.log(`Name: ${person.name}`) // \"John Smith\"\nconsole.log(`Age: ${person.age}`) // 30\nconsole.log(`Job: ${person.occupation}`) // \"software engineer\"\n```"
 }
]
```

For schema patterns, error handling, and per-invocation overrides, see [Structured Output](lc:user-guide/concepts/agents/structured-output).

### Custom client

Users can pass their own custom OpenAI client to the OpenAIModel for Strands Agents to use directly. Users are responsible for handling the lifecycle (e.g., closing) of the client.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.models.openai import OpenAIModel\nfrom openai import AsyncOpenAI\n\nclient = AsyncOpenAI(\n    api_key= \"<KEY>\",\n)\n\nagent = Agent(\n    model = OpenAIModel(\n        model_id=\"gpt-4o-mini-2024-07-18\",\n        client=client\n    )\n)\n\nasync def chat(prompt: str):\n    result = await agent.invoke_async(prompt)\n    print(result)\n\nasync def main():\n    await chat(\"What is 2+2\")\n    await chat(\"What is 2*2\")\n    # close the client\n    client.close()\n\nif __name__ == \"__main__\":\n    asyncio.run(main())\n```"
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// Custom client capability is not yet supported in the TypeScript SDK\n```"
 }
]
```

## References

-   [Python API](lc:api/python/strands.models.model)
-   [OpenAI](https://platform.openai.com/docs/overview)

## Related pages

- [Writer](lc:user-guide/concepts/model-providers/writer) (2 shared tags)
- [LiteLLM](lc:user-guide/concepts/model-providers/litellm) (1 shared tag)
- [Structured Output](lc:user-guide/concepts/agents/structured-output) (1 shared tag)
- [Google](lc:user-guide/concepts/model-providers/google) (1 shared tag)
- [Vercel](lc:user-guide/concepts/model-providers/vercel) (1 shared tag)
- [Anthropic](lc:user-guide/concepts/model-providers/anthropic) (1 shared tag)
- [Multimodal Correctness Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_correctness_evaluator) (1 shared tag)
- [Multimodal Faithfulness Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_faithfulness_evaluator) (1 shared tag)
- [Multimodal Instruction Following Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_instruction_following_evaluator) (1 shared tag)
- [Multimodal Output Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_output_evaluator) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/models/openai.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/models/openai.py)

### TypeScript

- [harness-sdk/strands-ts/src/models/openai/model.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/models/openai/model.ts)
