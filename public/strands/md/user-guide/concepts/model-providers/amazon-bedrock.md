Amazon Bedrock is a fully managed service that offers a choice of high-performing foundation models from leading AI companies through a unified API. Strands provides native support for Amazon Bedrock, allowing you to use these powerful models in your agents with minimal configuration.

The `BedrockModel` class in Strands enables seamless integration with Amazon Bedrock’s API, supporting:

-   Text generation
-   Multi-Modal understanding (Image, Document, etc.)
-   Tool/function calling
-   Guardrail configurations
-   System Prompt, Tool, and/or Message caching

## Getting Started

### Prerequisites

1.  **AWS Account**: You need an AWS account with access to Amazon Bedrock
2.  **AWS Credentials**: Configure AWS credentials with appropriate permissions

#### Required IAM Permissions

To use Amazon Bedrock with Strands, your IAM user or role needs the following permissions:

-   `bedrock:InvokeModelWithResponseStream` (for streaming mode)
-   `bedrock:InvokeModel` (for non-streaming mode)

Here’s a sample IAM policy that grants the necessary permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModelWithResponseStream",
                "bedrock:InvokeModel"
            ],
            "Resource": "*"
        }
    ]
}
```

For production environments, it’s recommended to scope down the `Resource` to specific model ARNs.

#### Setting Up AWS Credentials

```sa-tabs
[
 {
  "label": "Python",
  "body": "Strands uses [boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/index.html) (the AWS SDK for Python) to make calls to Amazon Bedrock. Boto3 has its own credential resolution system that determines which credentials to use when making requests to AWS.\n\nFor development environments, configure credentials using one of these methods:\n\n**Option 1: AWS CLI**\n\n```bash\naws configure\n```\n\n**Option 2: Environment Variables**\n\n```bash\nexport AWS_ACCESS_KEY_ID=your_access_key\nexport AWS_SECRET_ACCESS_KEY=your_secret_key\nexport AWS_SESSION_TOKEN=your_session_token  # If using temporary credentials\nexport AWS_REGION=\"us-west-2\"  # Used if a custom Boto3 Session is not provided\n```\n\n> [!WARNING] Region Resolution Priority\n>\n> Due to boto3\u2019s behavior, the region resolution follows this priority order:\n>\n> 1.  Region explicitly passed to `BedrockModel(region_name=\"...\")`\n> 2.  Region from boto3 session (AWS\\_DEFAULT\\_REGION or profile region from ~/.aws/config)\n> 3.  AWS\\_REGION environment variable\n> 4.  Default region (us-west-2)\n>\n> This means `AWS_REGION` has lower priority than regions set in AWS profiles. If you\u2019re experiencing unexpected region behavior, check your AWS configuration files and consider using `AWS_DEFAULT_REGION` or explicitly passing `region_name` to the BedrockModel constructor.\n>\n> For more details, see the [boto3 issue discussion](https://github.com/boto/boto3/issues/2574).\n\n**Option 3: Custom Boto3 Session**\n\nYou can configure a custom [boto3 Session](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/core/session.html) and pass it to the `BedrockModel`:\n\n```python\nimport boto3\nfrom strands.models import BedrockModel\n\n# Create a custom boto3 session\nsession = boto3.Session(\n    aws_access_key_id='your_access_key',\n    aws_secret_access_key='your_secret_key',\n    aws_session_token='your_session_token',  # If using temporary credentials\n    region_name='us-west-2',\n    profile_name='your-profile'  # Optional: Use a specific profile\n)\n\n# Create a Bedrock model with the custom session\nbedrock_model = BedrockModel(\n    model_id=\"global.anthropic.claude-sonnet-4-6\",\n    boto_session=session\n)\n```\n\nFor complete details on credential configuration and resolution, see the [boto3 credentials documentation](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html#configuring-credentials).\n\n**Option 4: aws login**\n\n`aws login` provides browser-based authentication for temporary credentials. Requires AWS CLI version 2.32.0 or later.\n\n```bash\naws login\n```\n\nTo use `aws login` with enhanced performance, install botocore with CRT support:\n\n```bash\npip install botocore[crt]\n```\n\nSee the [Login for AWS local development using console credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sign-in.html) documentation for more details."
 },
 {
  "label": "TypeScript",
  "body": "The TypeScript SDK uses the [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html) to make calls to Amazon Bedrock. The SDK has its own credential resolution system that determines which credentials to use when making requests to AWS.\n\nFor development environments, configure credentials using one of these methods:\n\n**Option 1: AWS CLI**\n\n```bash\naws configure\n```\n\n**Option 2: Environment Variables**\n\n```bash\nexport AWS_ACCESS_KEY_ID=your_access_key\nexport AWS_SECRET_ACCESS_KEY=your_secret_key\nexport AWS_SESSION_TOKEN=your_session_token  # If using temporary credentials\nexport AWS_REGION=\"us-west-2\"\n```\n\n**Option 3: Custom Credentials**\n\n```typescript\nimport { BedrockModel } from '@strands-agents/sdk/models/bedrock'\n\n// AWS credentials are configured through the clientConfig parameter\n// See AWS SDK for JavaScript documentation for all credential options:\n// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html\n\nconst bedrockModel = new BedrockModel({\n  modelId: 'global.anthropic.claude-sonnet-4-6',\n  region: 'us-west-2',\n  clientConfig: {\n    credentials: {\n      accessKeyId: 'your_access_key',\n      secretAccessKey: 'your_secret_key',\n      sessionToken: 'your_session_token', // If using temporary credentials\n    },\n  },\n})\n```\n\nFor complete details on credential configuration, see the [AWS SDK for JavaScript documentation](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html)."
 }
]
```

## Basic Usage

```sa-tabs
[
 {
  "label": "Python",
  "body": "The [`BedrockModel`](lc:api/python/strands.models.bedrock) provider is used by default when creating a basic Agent, and uses the [Claude Sonnet 4](https://aws.amazon.com/blogs/aws/claude-opus-4-anthropics-most-powerful-model-for-coding-is-now-in-amazon-bedrock/) model by default. This basic example creates an agent using this default setup:\n\n```python\nfrom strands import Agent\n\nagent = Agent()\n\nresponse = agent(\"Tell me about Amazon Bedrock.\")\n```\n\nYou can specify which Bedrock model to use by passing in the model ID string directly to the Agent constructor:\n\n```python\nfrom strands import Agent\n\n# Create an agent with a specific model by passing the model ID string\nagent = Agent(model=\"global.anthropic.claude-sonnet-4-6\")\n\nresponse = agent(\"Tell me about Amazon Bedrock.\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "The [`BedrockModel`](https://strandsagents.com/docs/api/typescript/BedrockModel/) provider is used by default when creating a basic Agent, and uses [Claude Sonnet 4.6](https://www.anthropic.com/claude/sonnet) by default. This basic example creates an agent using this default setup:\n\n```typescript\nimport { Agent } from '@strands-agents/sdk'\n\nconst agent = new Agent()\n\nconst response = await agent.invoke('Tell me about Amazon Bedrock.')\n```\n\nYou can specify which Bedrock model to use by passing in the model ID string directly to the Agent constructor:\n\n```typescript\nimport { Agent } from '@strands-agents/sdk'\n\n// Create an agent using the model\nconst agent = new Agent({ model: 'global.anthropic.claude-sonnet-4-6' })\n\nconst response = await agent.invoke('Tell me about Amazon Bedrock.')\n```"
 }
]
```

> **Note:** See [Bedrock troubleshooting](lc:user-guide/concepts/model-providers/amazon-bedrock#troubleshooting) if you encounter any issues.

### Custom Configuration

```sa-tabs
[
 {
  "label": "Python",
  "body": "For more control over model configuration, you can create an instance of the [`BedrockModel`](lc:api/python/strands.models.bedrock) class:\n\n```python\nfrom strands import Agent\nfrom strands.models import BedrockModel\n\n# Create a Bedrock model instance\nbedrock_model = BedrockModel(\n    model_id=\"us.amazon.nova-premier-v1:0\",\n    temperature=0.3,\n    top_p=0.8,\n)\n\n# Create an agent using the BedrockModel instance\nagent = Agent(model=bedrock_model)\n\n# Use the agent\nresponse = agent(\"Tell me about Amazon Bedrock.\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "For more control over model configuration, you can create an instance of the [`BedrockModel`](https://strandsagents.com/docs/api/typescript/BedrockModel/) class:\n\n```typescript\n// Create a Bedrock model instance\nconst bedrockModel = new BedrockModel({\n  modelId: 'us.amazon.nova-premier-v1:0',\n  temperature: 0.3,\n  topP: 0.8,\n})\n\n// Create an agent using the BedrockModel instance\nconst agent = new Agent({ model: bedrockModel })\n\n// Use the agent\nconst response = await agent.invoke('Tell me about Amazon Bedrock.')\n```"
 }
]
```

## Configuration Options

```sa-tabs
[
 {
  "label": "Python",
  "body": "The [`BedrockModel`](lc:api/python/strands.models.bedrock) supports various configuration parameters. For a complete list of available options, see the [BedrockModel API reference](lc:api/python/strands.models.bedrock).\n\nCommon configuration parameters include:\n\n-   `model_id` - The Bedrock model identifier\n-   `temperature` - Controls randomness (higher = more random)\n-   `max_tokens` - Maximum number of tokens to generate\n-   `streaming` - Enable/disable streaming mode\n-   `guardrail_id` - ID of the guardrail to apply\n-   `cache_prompt` - Cache point type for the system prompt (deprecated, use `cache_config`)\n-   `cache_config` - Configuration for prompt caching (e.g., `CacheConfig(strategy=\"auto\")`)\n-   `cache_tools` - Enable tool caching\n-   `strict_tools` - Enforce structured output on tool definitions. Bedrock\u2019s strict mode restricts which JSON Schema features tool input schemas may use (for example, `oneOf` is unsupported), so a schema that uses an unsupported feature fails at request time. See the [Bedrock structured output documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/structured-output.html)\n-   `boto_session` - Custom boto3 session for AWS credentials\n-   `additional_request_fields` - Additional model-specific parameters"
 },
 {
  "label": "TypeScript",
  "body": "The [`BedrockModel`](https://strandsagents.com/docs/api/typescript/BedrockModelOptions/) supports various configuration parameters. For a complete list of available options, see the [BedrockModelOptions API reference](https://strandsagents.com/docs/api/typescript/BedrockModelOptions/).\n\nCommon configuration parameters include:\n\n-   `modelId` - The Bedrock model identifier\n-   `temperature` - Controls randomness (higher = more random)\n-   `maxTokens` - Maximum number of tokens to generate\n-   `stream` - Enable/disable streaming mode\n-   `cacheConfig` - Enable prompt caching with `{ strategy: 'auto' }` or `{ strategy: 'anthropic' }`\n-   `region` - AWS region to use\n-   `apiKey` - Bedrock API key for bearer token authentication (alternative to SigV4 signing)\n-   `clientConfig` - AWS SDK client configuration\n-   `additionalArgs` - Additional model-specific parameters"
 }
]
```

### Example with Configuration

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.models import BedrockModel\nfrom botocore.config import Config as BotocoreConfig\n\n# Create a boto client config with custom settings\nboto_config = BotocoreConfig(\n    retries={\"max_attempts\": 3, \"mode\": \"standard\"},\n    connect_timeout=5,\n    read_timeout=60\n)\n\n# Create a configured Bedrock model\nbedrock_model = BedrockModel(\n    model_id=\"global.anthropic.claude-sonnet-4-6\",\n    region_name=\"us-east-1\",  # Specify a different region than the default\n    temperature=0.3,\n    stop_sequences=[\"###\", \"END\"],\n    boto_client_config=boto_config,\n)\n\n# Create an agent with the configured model\nagent = Agent(model=bedrock_model)\n\n# Use the agent\nresponse = agent(\"Write a short story about an AI assistant.\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Create a configured Bedrock model\nconst bedrockModel = new BedrockModel({\n  modelId: 'global.anthropic.claude-sonnet-4-6',\n  region: 'us-east-1', // Specify a different region than the default\n  temperature: 0.3,\n  stopSequences: ['###', 'END'],\n  clientConfig: {\n    retryMode: 'standard',\n    maxAttempts: 3,\n  },\n})\n\n// Create an agent with the configured model\nconst agent = new Agent({ model: bedrockModel })\n\n// Use the agent\nconst response = await agent.invoke('Write a short story about an AI assistant.')\n```"
 }
]
```

#### TypeScript Request Timeout

The TypeScript SDK applies a default `requestTimeout` of 120000 ms (120 seconds) when constructing the Bedrock Runtime client, since the underlying AWS SDK defaults to `0` (disabled), which lets a stuck connection hang. Override it by passing your own value through `clientConfig.requestHandler`:

```typescript
import { BedrockModel } from '@strands-agents/sdk/models/bedrock'

const bedrockModel = new BedrockModel({
  modelId: 'global.anthropic.claude-sonnet-4-6',
  clientConfig: {
    requestHandler: { requestTimeout: 60_000 },
  },
})
```

Passing a fully-constructed handler instance (rather than an options bag) bypasses the default; the handler’s own timeouts apply unchanged.

## Advanced Features

### Streaming vs Non-Streaming Mode

Certain Amazon Bedrock models only support non-streaming tool use, so you can set the streaming configuration to false in order to use these models. Both modes provide the same event structure and functionality in your agent, as the non-streaming responses are converted to the streaming format internally.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\n# Streaming model (default)\nstreaming_model = BedrockModel(\n    model_id=\"global.anthropic.claude-sonnet-4-6\",\n    streaming=True,  # This is the default\n)\n\n# Non-streaming model\nnon_streaming_model = BedrockModel(\n    model_id=\"us.meta.llama3-2-90b-instruct-v1:0\",\n    streaming=False,  # Disable streaming\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Streaming model (default)\nconst streamingModel = new BedrockModel({\n  modelId: 'global.anthropic.claude-sonnet-4-6',\n  stream: true, // This is the default\n})\n\n// Non-streaming model\nconst nonStreamingModel = new BedrockModel({\n  modelId: 'us.meta.llama3-2-90b-instruct-v1:0',\n  stream: false, // Disable streaming\n})\n```"
 }
]
```

See the Amazon Bedrock documentation for [Supported models and model features](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference-supported-models-features.html) to learn about the streaming support for different models.

### Multimodal Support

Some Bedrock models support multimodal inputs (Documents, Images, etc.). Here’s how to use them:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.models import BedrockModel\n\n# Create a Bedrock model that supports multimodal inputs\nbedrock_model = BedrockModel(\n    model_id=\"global.anthropic.claude-sonnet-4-6\"\n)\nagent = Agent(model=bedrock_model)\n\n# Send the multimodal message to the agent\nresponse = agent(\n    [\n        {\n            \"document\": {\n                \"format\": \"txt\",\n                \"name\": \"example\",\n                \"source\": {\n                    \"bytes\": b\"Once upon a time...\"\n                }\n            }\n        },\n        {\n            \"text\": \"Tell me about the document.\"\n        }\n    ]\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst bedrockModel = new BedrockModel({\n  modelId: 'global.anthropic.claude-sonnet-4-6',\n})\n\nconst agent = new Agent({ model: bedrockModel })\n\nconst documentBytes = Buffer.from('Once upon a time...')\n\n// Send multimodal content directly to invoke\nconst response = await agent.invoke([\n  new DocumentBlock({\n    format: 'txt',\n    name: 'example',\n    source: { bytes: documentBytes },\n  }),\n  'Tell me about the document.',\n])\n```"
 }
]
```

For a complete list of input types, please refer to the [API Reference](lc:api/python/strands.types.content).

#### S3 Location Support

As an alternative to providing media content as bytes, Amazon Bedrock supports referencing documents, images, and videos stored in Amazon S3 directly. This is useful when working with large files or when your content is already stored in S3.

> [!NOTE] IAM Permissions Required
>
> To use S3 locations, the IAM role or user making the Bedrock API call must have `s3:GetObject` permission on the S3 bucket and objects being referenced.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.models import BedrockModel\n\nagent = Agent(model=BedrockModel())\n\nresponse = agent(\n    [\n        {\n            \"document\": {\n                \"format\": \"pdf\",\n                \"name\": \"report.pdf\",\n                \"source\": {\n                    \"location\": {\n                        \"type\": \"s3\",\n                        \"uri\": \"s3://my-bucket/documents/report.pdf\",\n                        \"bucketOwner\": \"123456789012\"  # Optional: for cross-account access\n                    }\n                }\n            }\n        },\n        {\n            \"text\": \"Summarize this document.\"\n        }\n    ]\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst agent = new Agent({ model: new BedrockModel() })\n\nconst response = await agent.invoke([\n  new DocumentBlock({\n    format: 'pdf',\n    name: 'report.pdf',\n    source: {\n      location: {\n        type: 's3',\n        uri: 's3://my-bucket/documents/report.pdf',\n        bucketOwner: '123456789012', // Optional: for cross-account access\n      },\n    },\n  }),\n  'Summarize this document.',\n])\n```"
 }
]
```

> [!TIP] Supported Media Types
>
> The same `location` pattern also works for images and videos.

### Guardrails

```sa-tabs
[
 {
  "label": "Python",
  "body": "Amazon Bedrock supports guardrails to help ensure model outputs meet your requirements. Strands allows you to configure guardrails with your [`BedrockModel`](lc:api/python/strands.models.bedrock):\n\n```python\nfrom strands import Agent\nfrom strands.models import BedrockModel\n\n# Using guardrails with BedrockModel\nbedrock_model = BedrockModel(\n    model_id=\"global.anthropic.claude-sonnet-4-6\",\n    guardrail_id=\"your-guardrail-id\",\n    guardrail_version=\"DRAFT\",\n    guardrail_trace=\"enabled\",  # Options: \"enabled\", \"disabled\", \"enabled_full\"\n    guardrail_stream_processing_mode=\"sync\",  # Options: \"sync\", \"async\"\n    guardrail_redact_input=True,  # Default: True\n    guardrail_redact_input_message=\"Blocked Input!\", # Default: [User input redacted.]\n    guardrail_redact_output=False,  # Default: False\n    guardrail_redact_output_message=\"Blocked Output!\", # Default: [Assistant output redacted.]\n    guardrail_latest_message=True,  # Only evaluate the latest user message (default: False)\n)\n\nguardrail_agent = Agent(model=bedrock_model)\n\nresponse = guardrail_agent(\"Can you tell me about the Strands SDK?\")\n```\n\nAmazon Bedrock supports guardrails to help ensure model outputs meet your requirements. Strands allows you to configure guardrails with your [`BedrockModel`](https://strandsagents.com/docs/api/typescript/BedrockModel/).\n\nWhen a guardrail is triggered:\n\n-   Input redaction (enabled by default): If a guardrail policy is triggered, the input is redacted\n-   Output redaction (disabled by default): If a guardrail policy is triggered, the output is redacted\n-   Custom redaction messages can be specified for both input and output redactions\n\n> [!NOTE] Latest Message Evaluation\n>\n> When `guardrail_latest_message=True`, only the most recent user message is sent to guardrails for evaluation instead of the entire conversation. This can improve performance and reduce costs in multi-turn conversations where earlier messages have already been validated."
 },
 {
  "label": "TypeScript",
  "body": "Amazon Bedrock supports guardrails to help ensure model outputs meet your requirements. Strands allows you to configure guardrails with your [`BedrockModel`](https://strandsagents.com/docs/api/typescript/BedrockModel/):\n\n```typescript\n// Using guardrails with BedrockModel\nconst bedrockModel = new BedrockModel({\n  modelId: 'global.anthropic.claude-sonnet-4-6',\n  guardrailConfig: {\n    guardrailIdentifier: 'your-guardrail-id',\n    guardrailVersion: 'DRAFT',\n    trace: 'enabled', // Options: 'enabled', 'disabled', 'enabled_full'\n    streamProcessingMode: 'sync', // Options: 'sync', 'async'\n    redaction: {\n      input: true, // Default: true\n      inputMessage: '[User input redacted.]', // Custom redaction message\n      output: false, // Default: false\n      outputMessage: '[Assistant output redacted.]', // Custom redaction message\n    },\n    guardLatestUserMessage: true, // Only evaluate the latest user message (default: false)\n  },\n})\n\nconst guardrailAgent = new Agent({ model: bedrockModel })\n\nconst response = await guardrailAgent.invoke('Can you tell me about the Strands SDK?')\n```\n\nWhen a guardrail is triggered:\n\n-   Input redaction (enabled by default): If a guardrail policy is triggered, the input is redacted\n-   Output redaction (disabled by default): If a guardrail policy is triggered, the output is redacted\n-   Custom redaction messages can be specified for both input and output redactions\n\n> [!NOTE] Latest Message Evaluation\n>\n> When `guardLatestUserMessage: true`, only the most recent user message is sent to guardrails for evaluation instead of the entire conversation. This can improve performance and reduce costs in multi-turn conversations where earlier messages have already been validated."
 }
]
```

### Caching

Strands supports caching system prompts, tools, and messages to improve performance and reduce costs. Caching allows you to reuse parts of previous requests, which can significantly reduce token usage and latency.

When you enable prompt caching, Amazon Bedrock creates a cache composed of **cache checkpoints**. These are markers that define the contiguous subsection of your prompt that you wish to cache. Cached content must remain unchanged between requests - any alteration invalidates the cache.

Prompt caching is supported for Anthropic Claude and Amazon Nova models on Bedrock. Each model has a minimum token requirement (e.g., 1,024 tokens for Claude Sonnet, 4,096 tokens for Claude Haiku), and cached content expires after 5 minutes of inactivity. Cache writes cost more than regular input tokens, but cache reads cost significantly less - see [Amazon Bedrock pricing](https://aws.amazon.com/bedrock/pricing/) for model-specific rates.

For complete details on supported models, token requirements, and cache field support, see the [Amazon Bedrock prompt caching documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html#prompt-caching-models).

#### System Prompt Caching

Cache system prompts that remain static across multiple requests. This is useful when your system prompt contains no variables, timestamps, or dynamic content, exceeds the minimum cacheable token threshold for your model, and you make multiple requests with the same system prompt.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.types.content import SystemContentBlock\n\nsystem_content = [\n    SystemContentBlock(\n        text=\"You are a helpful assistant...\" * 1600  # Must exceed minimum tokens\n    ),\n    SystemContentBlock(cachePoint={\"type\": \"default\"})\n]\n\n# Create an agent with SystemContentBlock array\nagent = Agent(system_prompt=system_content)\n\n# First request will cache the system prompt\nresponse1 = agent(\"Tell me about Python\")\nprint(f\"Cache write tokens: {response1.metrics.accumulated_usage.get('cacheWriteInputTokens')}\")\nprint(f\"Cache read tokens: {response1.metrics.accumulated_usage.get('cacheReadInputTokens')}\")\n\n# Second request will reuse the cached system prompt\nresponse2 = agent(\"Tell me about JavaScript\")\nprint(f\"Cache write tokens: {response2.metrics.accumulated_usage.get('cacheWriteInputTokens')}\")\nprint(f\"Cache read tokens: {response2.metrics.accumulated_usage.get('cacheReadInputTokens')}\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst systemContent = [\n  'You are a helpful assistant that provides concise answers. ' +\n    'This is a long system prompt with detailed instructions...' +\n    '...'.repeat(1600), // needs to be at least 1,024 tokens\n  new CachePointBlock({ cacheType: 'default' }),\n]\n\nconst agent = new Agent({ systemPrompt: systemContent })\n\n// First request will cache the system prompt\nlet cacheWriteTokens = 0\nlet cacheReadTokens = 0\n\nfor await (const event of agent.stream('Tell me about Python')) {\n  if (event.type === 'modelMetadataEvent' && event.usage) {\n    cacheWriteTokens = event.usage.cacheWriteInputTokens || 0\n    cacheReadTokens = event.usage.cacheReadInputTokens || 0\n  }\n}\nconsole.log(`Cache write tokens: ${cacheWriteTokens}`)\nconsole.log(`Cache read tokens: ${cacheReadTokens}`)\n\n// Second request will reuse the cached system prompt\nfor await (const event of agent.stream('Tell me about JavaScript')) {\n  if (event.type === 'modelMetadataEvent' && event.usage) {\n    cacheWriteTokens = event.usage.cacheWriteInputTokens || 0\n    cacheReadTokens = event.usage.cacheReadInputTokens || 0\n  }\n}\nconsole.log(`Cache write tokens: ${cacheWriteTokens}`)\nconsole.log(`Cache read tokens: ${cacheReadTokens}`)\n```"
 }
]
```

#### Tool Caching

Tool caching allows you to reuse a cached tool definition across multiple requests:

```sa-tabs
[
 {
  "label": "Python",
  "body": "In Python, use the `cache_tools` parameter to enable tool caching independently:\n\n```python\nfrom strands import Agent, tool\nfrom strands.models import BedrockModel\nfrom strands_tools import calculator, current_time\n\n# Using tool caching with BedrockModel\nbedrock_model = BedrockModel(\n    model_id=\"global.anthropic.claude-sonnet-4-6\",\n    cache_tools=\"default\"\n)\n\n# Create an agent with the model and tools\nagent = Agent(\n    model=bedrock_model,\n    tools=[calculator, current_time]\n)\n# First request will cache the tools\nresponse1 = agent(\"What time is it?\")\nprint(f\"Cache write tokens: {response1.metrics.accumulated_usage.get('cacheWriteInputTokens')}\")\nprint(f\"Cache read tokens: {response1.metrics.accumulated_usage.get('cacheReadInputTokens')}\")\n\n# Second request will reuse the cached tools\nresponse2 = agent(\"What is the square root of 1764?\")\nprint(f\"Cache write tokens: {response2.metrics.accumulated_usage.get('cacheWriteInputTokens')}\")\nprint(f\"Cache read tokens: {response2.metrics.accumulated_usage.get('cacheReadInputTokens')}\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "In TypeScript, tool caching is enabled through `cacheConfig`. When `cacheConfig` is set, the SDK automatically appends a cache point after the tool definitions in each request. There is no separate `cacheTools` option \u2014 `cacheConfig` handles both tool and message caching together.\n\n```typescript\nconst bedrockModel = new BedrockModel({\n  modelId: 'global.anthropic.claude-sonnet-4-6',\n  cacheConfig: { strategy: 'auto' },\n})\n\nconst agent = new Agent({\n  model: bedrockModel,\n  // Add your tools here\n})\n\n// First request will cache the tools\nlet cacheWriteTokens = 0\nlet cacheReadTokens = 0\n\nfor await (const event of agent.stream('What time is it?')) {\n  if (event.type === 'modelMetadataEvent' && event.usage) {\n    cacheWriteTokens = event.usage.cacheWriteInputTokens || 0\n    cacheReadTokens = event.usage.cacheReadInputTokens || 0\n  }\n}\nconsole.log(`Cache write tokens: ${cacheWriteTokens}`)\nconsole.log(`Cache read tokens: ${cacheReadTokens}`)\n\n// Second request will reuse the cached tools\nfor await (const event of agent.stream('What is the square root of 1764?')) {\n  if (event.type === 'modelMetadataEvent' && event.usage) {\n    cacheWriteTokens = event.usage.cacheWriteInputTokens || 0\n    cacheReadTokens = event.usage.cacheReadInputTokens || 0\n  }\n}\nconsole.log(`Cache write tokens: ${cacheWriteTokens}`)\nconsole.log(`Cache read tokens: ${cacheReadTokens}`)\n```"
 }
]
```

#### Messages Caching

Messages caching allows you to reuse cached conversation context across multiple requests. By default, message caching is not enabled. To enable it, choose Option A for automatic cache management in agent workflows, or Option B for manual control over cache placement.

**Option A: Automatic Cache Strategy (Claude models only)**

Enable automatic cache point management for agent workflows with multi-turn conversations. The SDK automatically places a cache point at the end of the last user message to maximize cache hits without requiring manual management.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, tool\nfrom strands.models import BedrockModel, CacheConfig\n\n@tool\ndef web_search(query: str) -> str:\n    \"\"\"Search the web for information.\"\"\"\n    return f\"\"\"\n    Search results for '{query}':\n    1. Comprehensive Guide - [Long article with detailed explanations...]\n    2. Research Paper - [Detailed findings and methodology...]\n    3. Stack Overflow - [Multiple answers and code snippets...]\n    \"\"\"\n\nmodel = BedrockModel(\n    model_id=\"global.anthropic.claude-sonnet-4-6\",\n    cache_config=CacheConfig(strategy=\"auto\")\n)\nagent = Agent(model=model, tools=[web_search])\n\n# Agent call with tool uses - cache write and read occur as context accumulates\nresponse1 = agent(\"Search for Python async patterns, then compare with error handling\")\nprint(f\"Cache write tokens: {response1.metrics.accumulated_usage.get('cacheWriteInputTokens')}\")\nprint(f\"Cache read tokens: {response1.metrics.accumulated_usage.get('cacheReadInputTokens')}\")\n\n# Follow-up reuses cached context from previous conversation\nresponse2 = agent(\"Summarize the key differences\")\nprint(f\"Cache write tokens: {response2.metrics.accumulated_usage.get('cacheWriteInputTokens')}\")\nprint(f\"Cache read tokens: {response2.metrics.accumulated_usage.get('cacheReadInputTokens')}\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst bedrockModel = new BedrockModel({\n  modelId: 'global.anthropic.claude-sonnet-4-6',\n  cacheConfig: { strategy: 'auto' },\n})\n\nconst agent = new Agent({ model: bedrockModel })\n\n// Agent call - cache write and read occur as context accumulates\nlet cacheWriteTokens = 0\nlet cacheReadTokens = 0\n\nfor await (const event of agent.stream(\n  'Search for Python async patterns, then compare with error handling'\n)) {\n  if (event.type === 'modelMetadataEvent' && event.usage) {\n    cacheWriteTokens = event.usage.cacheWriteInputTokens || 0\n    cacheReadTokens = event.usage.cacheReadInputTokens || 0\n  }\n}\nconsole.log(`Cache write tokens: ${cacheWriteTokens}`)\nconsole.log(`Cache read tokens: ${cacheReadTokens}`)\n\n// Follow-up reuses cached context from previous conversation\nfor await (const event of agent.stream('Summarize the key differences')) {\n  if (event.type === 'modelMetadataEvent' && event.usage) {\n    cacheWriteTokens = event.usage.cacheWriteInputTokens || 0\n    cacheReadTokens = event.usage.cacheReadInputTokens || 0\n  }\n}\nconsole.log(`Cache write tokens: ${cacheWriteTokens}`)\nconsole.log(`Cache read tokens: ${cacheReadTokens}`)\n```"
 }
]
```

> **Note**: Cache misses occur if you intentionally modify past conversation context (e.g., summarization or editing previous messages).

**Option B: Manual Cache Points**

Place cache points explicitly at specific locations in your conversation when you need fine-grained control over cache placement based on your workload characteristics. This is useful for static use cases with repeated query patterns where you want to cache only up to a specific point. For agent loops or multi-turn conversations with manual cache control, use [Hooks](https://strandsagents.com/latest/documentation/docs/api-reference/python/hooks/events/) to dynamically control cache points based on specific events.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\nmessages = [\n    {\n        \"role\": \"user\",\n        \"content\": [\n            {\"text\": \"\"\"Here is a technical document:\n            [Long document content with multiple sections covering architecture,\n            implementation details, code examples, and best practices spanning\n            over 1000 tokens...]\"\"\"},\n            {\"cachePoint\": {\"type\": \"default\"}}  # Cache only up to this point\n        ]\n    }\n]\n\nagent = Agent(messages=messages)\n\n# First request writes the document to cache\nresponse1 = agent(\"Summarize the key points from the document\")\nprint(f\"Cache write tokens: {response1.metrics.accumulated_usage.get('cacheWriteInputTokens')}\")\nprint(f\"Cache read tokens: {response1.metrics.accumulated_usage.get('cacheReadInputTokens')}\")\n\n# Subsequent requests read the cached document\nresponse2 = agent(\"What are the implementation recommendations?\")\nprint(f\"Cache write tokens: {response2.metrics.accumulated_usage.get('cacheWriteInputTokens')}\")\nprint(f\"Cache read tokens: {response2.metrics.accumulated_usage.get('cacheReadInputTokens')}\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst documentBytes = Buffer.from('This is a sample document!')\n\nconst userMessage = new Message({\n  role: 'user',\n  content: [\n    new DocumentBlock({\n      format: 'txt',\n      name: 'example',\n      source: { bytes: documentBytes },\n    }),\n    'Use this document in your response.',\n    new CachePointBlock({ cacheType: 'default' }),\n  ],\n})\n\nconst assistantMessage = new Message({\n  role: 'assistant',\n  content: ['I will reference that document in my following responses.'],\n})\n\nconst agent = new Agent({\n  messages: [userMessage, assistantMessage],\n})\n\n// First request will cache the message\nlet cacheWriteTokens = 0\nlet cacheReadTokens = 0\n\nfor await (const event of agent.stream('What is in that document?')) {\n  if (event.type === 'modelMetadataEvent' && event.usage) {\n    cacheWriteTokens = event.usage.cacheWriteInputTokens || 0\n    cacheReadTokens = event.usage.cacheReadInputTokens || 0\n  }\n}\nconsole.log(`Cache write tokens: ${cacheWriteTokens}`)\nconsole.log(`Cache read tokens: ${cacheReadTokens}`)\n\n// Second request will reuse the cached message\nfor await (const event of agent.stream('How long is the document?')) {\n  if (event.type === 'modelMetadataEvent' && event.usage) {\n    cacheWriteTokens = event.usage.cacheWriteInputTokens || 0\n    cacheReadTokens = event.usage.cacheReadInputTokens || 0\n  }\n}\nconsole.log(`Cache write tokens: ${cacheWriteTokens}`)\nconsole.log(`Cache read tokens: ${cacheReadTokens}`)\n```"
 }
]
```

#### Cache Metrics

When using prompt caching, Amazon Bedrock provides cache statistics to help you monitor cache performance:

-   `CacheWriteInputTokens`: Number of input tokens written to the cache (occurs on first request with new content)
-   `CacheReadInputTokens`: Number of input tokens read from the cache (occurs on subsequent requests with cached content)

Strands automatically captures these metrics and makes them available:

```sa-tabs
[
 {
  "label": "Python",
  "body": "Cache statistics are automatically included in `AgentResult.metrics.accumulated_usage`:\n\n```python\nfrom strands import Agent\n\nagent = Agent()\nresponse = agent(\"Hello!\")\n\n# Access cache metrics\ncache_write = response.metrics.accumulated_usage.get('cacheWriteInputTokens', 0)\ncache_read = response.metrics.accumulated_usage.get('cacheReadInputTokens', 0)\n\nprint(f\"Cache write tokens: {cache_write}\")\nprint(f\"Cache read tokens: {cache_read}\")\n```\n\nCache metrics are also automatically recorded in OpenTelemetry traces when telemetry is enabled."
 },
 {
  "label": "TypeScript",
  "body": "Cache statistics are included in `modelMetadataEvent.usage` during streaming:\n\n```typescript\nimport { Agent } from '@strands-agents/sdk'\n\nconst agent = new Agent()\n\nfor await (const event of agent.stream('Hello!')) {\n  if (event.type === 'modelMetadataEvent' && event.usage) {\n    console.log(`Cache write tokens: ${event.usage.cacheWriteInputTokens || 0}`)\n    console.log(`Cache read tokens: ${event.usage.cacheReadInputTokens || 0}`)\n  }\n}\n```"
 }
]
```

### Updating Configuration at Runtime

You can update the model configuration during runtime:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\n# Create the model with initial configuration\nbedrock_model = BedrockModel(\n    model_id=\"global.anthropic.claude-sonnet-4-6\",\n    temperature=0.7\n)\n\n# Update configuration later\nbedrock_model.update_config(\n    temperature=0.3,\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\n// Create the model with initial configuration\nconst bedrockModel = new BedrockModel({\n  modelId: 'global.anthropic.claude-sonnet-4-6',\n  temperature: 0.7,\n})\n\n// Update configuration later\nbedrockModel.updateConfig({\n  temperature: 0.3,\n})\n```"
 }
]
```

This is especially useful for tools that need to update the model’s configuration:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\n@tool\ndef update_model_id(model_id: str, agent: Agent) -> str:\n    \"\"\"\n    Update the model id of the agent\n\n    Args:\n      model_id: Bedrock model id to use.\n    \"\"\"\n    print(f\"Updating model_id to {model_id}\")\n    agent.model.update_config(model_id=model_id)\n    return f\"Model updated to {model_id}\"\n\n\n@tool\ndef update_temperature(temperature: float, agent: Agent) -> str:\n    \"\"\"\n    Update the temperature of the agent\n\n    Args:\n      temperature: Temperature value for the model to use.\n    \"\"\"\n    print(f\"Updating Temperature to {temperature}\")\n    agent.model.update_config(temperature=temperature)\n    return f\"Temperature updated to {temperature}\"\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { tool } from '@strands-agents/sdk'\nimport { z } from 'zod'\n\n// Define a tool that updates model configuration\nconst updateTemperature = tool({\n  name: 'update_temperature',\n  description: 'Update the temperature of the agent',\n  inputSchema: z.object({\n    temperature: z.number().describe('Temperature value for the model to use'),\n  }),\n  callback: async ({ temperature }, context) => {\n    if (context.agent?.model && 'updateConfig' in context.agent.model) {\n      context.agent.model.updateConfig({ temperature })\n      return `Temperature updated to ${temperature}`\n    }\n    return 'Failed to update temperature'\n  },\n})\n\nconst agent = new Agent({\n  model: new BedrockModel({ modelId: 'global.anthropic.claude-sonnet-4-6' }),\n  tools: [updateTemperature],\n})\n```"
 }
]
```

### Reasoning Support

Amazon Bedrock models can provide detailed reasoning steps when generating responses. For detailed information about supported models and reasoning token configuration, see the [Amazon Bedrock documentation on inference reasoning](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-reasoning.html).

```sa-tabs
[
 {
  "label": "Python",
  "body": "Strands allows you to enable and configure reasoning capabilities with your [`BedrockModel`](lc:api/python/strands.models.bedrock):\n\n```python\nfrom strands import Agent\nfrom strands.models import BedrockModel\n\n# Create a Bedrock model with reasoning configuration\nbedrock_model = BedrockModel(\n    model_id=\"global.anthropic.claude-sonnet-4-6\",\n    additional_request_fields={\n        \"thinking\": {\n            \"type\": \"enabled\",\n            \"budget_tokens\": 4096 # Minimum of 1,024\n        }\n    }\n)\n\n# Create an agent with the reasoning-enabled model\nagent = Agent(model=bedrock_model)\n\n# Ask a question that requires reasoning\nresponse = agent(\"If a train travels at 120 km/h and needs to cover 450 km, how long will the journey take?\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "Strands allows you to enable and configure reasoning capabilities with your [`BedrockModel`](https://strandsagents.com/docs/api/typescript/BedrockModel/):\n\n```typescript\n// Create a Bedrock model with reasoning configuration\nconst bedrockModel = new BedrockModel({\n  modelId: 'global.anthropic.claude-sonnet-4-6',\n  additionalRequestFields: {\n    thinking: {\n      type: 'enabled',\n      budget_tokens: 4096, // Minimum of 1,024\n    },\n  },\n})\n\n// Create an agent with the reasoning-enabled model\nconst agent = new Agent({ model: bedrockModel })\n\n// Ask a question that requires reasoning\nconst response = await agent.invoke(\n  'If a train travels at 120 km/h and needs to cover 450 km, how long will the journey take?'\n)\n```"
 }
]
```

> **Note**: Not all models support structured reasoning output. Check the [inference reasoning documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-reasoning.html) for details on supported models.

### Structured Output

Amazon Bedrock models support structured output through their tool calling capabilities. Pass a schema to the agent, and Strands converts it to Bedrock’s tool specification format and validates the response.

```sa-tabs
[
 {
  "label": "Python",
  "body": "Define a Pydantic model and pass it to `agent.structured_output()`:\n\n```python\nfrom pydantic import BaseModel, Field\nfrom strands import Agent\nfrom strands.models import BedrockModel\nfrom typing import List, Optional\n\nclass ProductAnalysis(BaseModel):\n    \"\"\"Analyze product information from text.\"\"\"\n    name: str = Field(description=\"Product name\")\n    category: str = Field(description=\"Product category\")\n    price: float = Field(description=\"Price in USD\")\n    features: List[str] = Field(description=\"Key product features\")\n    rating: Optional[float] = Field(description=\"Customer rating 1-5\", ge=1, le=5)\n\nbedrock_model = BedrockModel()\n\nagent = Agent(model=bedrock_model)\n\nresult = agent.structured_output(\n    ProductAnalysis,\n    \"\"\"\n    Analyze this product: The UltraBook Pro is a premium laptop computer\n    priced at $1,299. It features a 15-inch 4K display, 16GB RAM, 512GB SSD,\n    and 12-hour battery life. Customer reviews average 4.5 stars.\n    \"\"\"\n)\n\nprint(f\"Product: {result.name}\")\nprint(f\"Category: {result.category}\")\nprint(f\"Price: ${result.price}\")\nprint(f\"Features: {result.features}\")\nprint(f\"Rating: {result.rating}\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "Define a Zod schema and pass it as `structuredOutputSchema`. Validated output is on `result.structuredOutput`:\n\n```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { BedrockModel } from '@strands-agents/sdk/models/bedrock'\nimport { z } from 'zod'\n\nconst ProductAnalysis = z.object({\n  name: z.string().describe('Product name'),\n  category: z.string().describe('Product category'),\n  price: z.number().describe('Price in USD'),\n  features: z.array(z.string()).describe('Key product features'),\n  rating: z.number().min(1).max(5).optional().describe('Customer rating 1-5'),\n})\n\nconst bedrockModel = new BedrockModel()\nconst agent = new Agent({\n  model: bedrockModel,\n  structuredOutputSchema: ProductAnalysis,\n})\n\nconst result = await agent.invoke(\n  `Analyze this product: The UltraBook Pro is a premium laptop computer\n   priced at $1,299. It features a 15-inch 4K display, 16GB RAM, 512GB SSD,\n   and 12-hour battery life. Customer reviews average 4.5 stars.`\n)\n\nconst product = result.structuredOutput as z.infer<typeof ProductAnalysis>\nconsole.log(`Product: ${product.name}`)\nconsole.log(`Category: ${product.category}`)\nconsole.log(`Price: $${product.price}`)\nconsole.log(`Features: ${product.features.join(', ')}`)\nconsole.log(`Rating: ${product.rating}`)\n```"
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
  "body": "The Bedrock provider can use the native `count_tokens` API via the `CountTokens` action in the Converse API. This includes system prompts, messages, and tool specifications in the count.\n\nNot all Bedrock models support the `CountTokens` API. When a model doesn\u2019t support it or the caller doesn\u2019t have the required IAM permissions, the provider caches this result and falls back to estimation with a character-based heuristic (characters \u00f7 4 for text, characters \u00f7 2 for JSON) for subsequent calls.\n\nYou can enable native token counting with:\n\n```python\nmodel = BedrockModel(\n    model_id=\"global.anthropic.claude-sonnet-4-6\",\n    use_native_token_count=True,\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "The Bedrock provider can use the native `CountTokensCommand` API. This includes system prompts, messages, and tool specifications in the count.\n\nNot all Bedrock models support the `CountTokens` API. When a model doesn\u2019t support it or the caller doesn\u2019t have the required IAM permissions, the provider caches this result and falls back to estimation with a character-based heuristic (characters \u00f7 4 for text, characters \u00f7 2 for JSON) for subsequent calls.\n\nYou can enable native token counting with:\n\n```typescript\nconst model = new BedrockModel({\n  modelId: 'global.anthropic.claude-sonnet-4-6',\n  useNativeTokenCount: true,\n})\n```"
 }
]
```

## Troubleshooting

### On-demand throughput isn’t supported

If you encounter the error:

> Invocation of model ID XXXX with on-demand throughput isn’t supported. Retry your request with the ID or ARN of an inference profile that contains this model.

This typically indicates that the model requires Cross-Region Inference, as documented in the [Amazon Bedrock documentation on inference profiles](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html#inference-profiles-support-system). To resolve this issue, prefix your model ID with the appropriate regional identifier (`us.`or `eu.`) based on where your agent is running. For example:

Instead of:

```plaintext
anthropic.claude-sonnet-4-6
```

Use:

```plaintext
us.anthropic.claude-sonnet-4-6
```

### Model identifier is invalid

If you encounter the error:

> ValidationException: An error occurred (ValidationException) when calling the ConverseStream operation: The provided model identifier is invalid

This is very likely due to calling Bedrock with an inference model id, such as: `us.anthropic.claude-sonnet-4-6` from a region that does not [support inference profiles](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html). If so, pass in a valid model id, as follows:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nagent = Agent(model=\"anthropic.claude-3-5-sonnet-20241022-v2:0\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst agent = new Agent({\n  model: 'anthropic.claude-3-5-sonnet-20241022-v2:0'\n})\n```"
 }
]
```

> [!NOTE] Default Inference Model
>
> Strands uses a default Claude 4 Sonnet inference model from the region of your credentials when no model is provided. So if you did not pass in any model id and are getting the above error, it’s very likely due to the `region` from the credentials not supporting inference profiles.

### CacheConfig with ARN-based inference profiles

If you’re using an ARN-based application inference profile as your `model_id` (e.g., `arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/abc123`), `CacheConfig(strategy="auto")` will not automatically enable prompt caching.

The `strategy="auto"` detection checks the model ID string for `"claude"` or `"anthropic"` substrings. Cross-region inference profile IDs like `us.anthropic.claude-sonnet-4-6` contain `"anthropic"` and are detected correctly, but application inference profiles use opaque resource IDs (`application-inference-profile/abc123`) that carry no model name information, so detection returns `None`, caching is skipped, and Strands logs a warning: `model_id=<your-arn> | cache_config is enabled but this model does not support automatic caching`.

Use `strategy="anthropic"` explicitly to fix this:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.models import BedrockModel, CacheConfig\n\nbedrock_model = BedrockModel(\n    model_id=\"arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/abc123\",\n    cache_config=CacheConfig(strategy=\"anthropic\")\n)\n\nagent = Agent(model=bedrock_model)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent } from '@strands-agents/sdk'\nimport { BedrockModel } from '@strands-agents/sdk/models/bedrock'\n\nconst bedrockModel = new BedrockModel({\n  modelId: 'arn:aws:bedrock:us-east-1:123456789012:application-inference-profile/abc123',\n  cacheConfig: { strategy: 'anthropic' },\n})\n\nconst agent = new Agent({ model: bedrockModel })\n```"
 }
]
```

`strategy="anthropic"` has identical performance to `strategy="auto"` and requires no additional API calls or IAM permissions.

## Related Resources

-   [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
-   [Bedrock Model IDs Reference](https://docs.aws.amazon.com/bedrock/latest/userguide/model-ids.html)
-   [Bedrock Pricing](https://aws.amazon.com/bedrock/pricing/)

## Related pages

- [Amazon Nova](lc:user-guide/concepts/model-providers/amazon-nova) (3 shared tags)
- [Guardrails](lc:user-guide/safety-security/guardrails) (3 shared tags)
- [Nova Sonic](lc:user-guide/concepts/bidirectional-streaming/models/nova_sonic) (2 shared tags)
- [Bedrock Knowledge Base Store](lc:user-guide/concepts/memory/bedrock-knowledge-base) (2 shared tags)
- [Deploying Strands Agents to Amazon Bedrock AgentCore Runtime](lc:user-guide/deploy/deploy_to_bedrock_agentcore) (2 shared tags)
- [Python Deployment to Amazon Bedrock AgentCore Runtime](lc:user-guide/deploy/deploy_to_bedrock_agentcore/python) (2 shared tags)
- [TypeScript Deployment to Amazon Bedrock AgentCore Runtime](https://strandsagents.com/docs/user-guide/deploy/deploy_to_bedrock_agentcore/typescript/) (2 shared tags)
- [AgentCore Evaluation Dashboard Configuration](lc:user-guide/evals-sdk/how-to/agentcore_evaluation_dashboard) (2 shared tags)
- [PII Redaction](lc:user-guide/safety-security/pii-redaction) (2 shared tags)
- [Result Caching](lc:user-guide/evals-sdk/how-to/result_caching) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/models/bedrock.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/models/bedrock.py)

### TypeScript

- [harness-sdk/strands-ts/src/models/bedrock.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/models/bedrock.ts)
