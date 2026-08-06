In the Strands Agents SDK, system prompts and user messages are the primary way to communicate with AI models. The SDK provides a flexible system for managing prompts, including both system prompts and user messages.

## System Prompts

System prompts provide high-level instructions to the model about its role, capabilities, and constraints. They set the foundation for how the model should behave throughout the conversation. You can specify the system prompt when initializing an agent:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\n\nagent = Agent(\n    system_prompt=(\n        \"You are a financial advisor specialized in retirement planning. \"\n        \"Use tools to gather information and provide personalized advice. \"\n        \"Always explain your reasoning and cite sources when possible.\"\n    )\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst agent = new Agent({\n  systemPrompt:\n    'You are a financial advisor specialized in retirement planning. ' +\n    'Use tools to gather information and provide personalized advice. ' +\n    'Always explain your reasoning and cite sources when possible.',\n})\n```"
 }
]
```

If you do not specify a system prompt, the model will behave according to its default settings.

## User Messages

These are your queries or requests to the agent. The SDK supports multiple techniques for prompting.

```sa-tabs
[
 {
  "label": "Python",
  "body": "> [!WARNING] Passing a message list from an untrusted source\n>\n> When you invoke an agent with a full message list rather than plain text, that list can carry tool-call content, and a tool-call block as the last message dispatches a tool directly on the next invocation. If the list was built from a source you do not control, clear tool-call content first. See [Trusted Message History](lc:user-guide/safety-security/trusted-message-history)."
 },
 {
  "label": "TypeScript",
  "body": "> [!WARNING] Passing a message list from an untrusted source\n>\n> When you invoke an agent with a full message list rather than plain text, that list can carry forged tool-result content that misleads the model. If the list was built from a source you do not control, treat it as untrusted. See [Trusted Message History](lc:user-guide/safety-security/trusted-message-history)."
 }
]
```

### Text Prompt

The simplest way to interact with an agent is through a text prompt:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nresponse = agent(\"What is the time in Seattle\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst response = await agent.invoke('What is the time in Seattle')\n```"
 }
]
```

### Multi-Modal Prompting

The SDK supports multi-modal prompts, allowing you to include images, documents, and other content types in your messages:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nwith open(\"path/to/image.png\", \"rb\") as fp:\n    image_bytes = fp.read()\n\nresponse = agent([\n    {\"text\": \"What can you see in this image?\"},\n    {\n        \"image\": {\n            \"format\": \"png\",\n            \"source\": {\n                \"bytes\": image_bytes,\n            },\n        },\n    },\n])\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nconst imageBytes = readFileSync('path/to/image.png')\n\nconst response = await agent.invoke([\n  new TextBlock('What can you see in this image?'),\n  new ImageBlock({\n    format: 'png',\n    source: {\n      bytes: new Uint8Array(imageBytes),\n    },\n  }),\n])\n```"
 }
]
```

For a complete list of supported content types, refer to the API Reference: [Python](lc:api/python/strands.types.content#ContentBlock) | [TypeScript](https://strandsagents.com/docs/api/typescript/ContentBlock/).

### Direct Tool Calls

Prompting is a primary functionality of Strands that allows you to invoke tools through natural language requests. However, if at any point you require more programmatic control, Strands also allows you to invoke tools directly:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nresult = agent.tool.current_time(timezone=\"US/Pacific\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```ts\n// Not supported in TypeScript\n```"
 }
]
```

Direct tool calls bypass the natural language interface and execute the tool using specified parameters. These calls are added to the conversation history by default. However, you can opt out of this behavior by setting `record_direct_tool_call=False``recordDirectToolCall: false`.

## Prompt Engineering

Crafting effective prompts is essential for building useful agents. While simple text instructions work for basic tasks, getting complex behavior out of agents benefits from more structured approaches.

### Prompting with Agent SOPs

[Agent SOPs](https://strandsagents.com/docs/blog/introducing-strands-agent-sops/) (Standard Operating Procedures) are a standardized markdown format for defining agent workflows in natural language. They hit a “determin-ish-tic” sweet spot between fully code-defined workflows and open-ended model-driven agents, providing structure for consistency while preserving the agent’s reasoning ability.

Here is a minimal example of an Agent SOP:

```markdown
# Code Review SOP

## Parameters
- repo_path (REQUIRED): Path to the repository to review

## Steps

### Step 1: Understand the Changes
- MUST read the diff of all changed files
- SHOULD summarize what the changes are doing at a high level

### Step 2: Review for Issues
- MUST check for bugs, security vulnerabilities, and logic errors
- SHOULD flag any style or readability concerns
- MAY suggest alternative approaches where appropriate

### Step 3: Provide Feedback
- MUST output a structured review with file-level comments
- SHOULD categorize findings by severity (critical, warning, suggestion)
```

Following this [Agent SOP format](https://strandsagents.com/docs/blog/introducing-strands-agent-sops/) gives the benefits of understanding the agent’s behavior, debugging it when it does not follow instructions, and steering agents regardless of the underlying model.

> [!TIP] Debugging with SOPs
>
> If an agent follows steps 1 and 2 of your SOP but gets sidetracked, you immediately know which step needs refinement — making debugging targeted rather than guesswork.

Debugging and fixing system prompts is a difficult and expensive problem to face, usually involving costly evaluations to run and validate your agent is working as expected. Turning system prompts into SOPs makes the system prompt editing process straightforward and easy.

For more on authoring and using Agent SOPs, including SOP chaining for multi-phase workflows, see the [Agent SOPs GitHub repository](https://github.com/strands-agents/agent-sop).

### Safety and Security

For guidance on writing safe and responsible prompts, including defending against prompt injection and adversarial attacks, refer to our [Safety & Security - Prompt Engineering](lc:user-guide/safety-security/prompt-engineering) documentation.

### Further Resources

-   [Agent SOPs GitHub Repository](https://github.com/strands-agents/agent-sop)
-   [Prompt Engineering Guide](https://www.promptingguide.ai)
-   [Amazon Bedrock - Prompt engineering concepts](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-engineering-guidelines.html)
-   [Llama - Prompting](https://www.llama.com/docs/how-to-guides/prompting/)
-   [Anthropic - Prompt engineering overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
-   [OpenAI - Prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering/six-strategies-for-getting-better-results)

## Related pages

- [Prompt Engineering](lc:user-guide/safety-security/prompt-engineering) (3 shared tags)
- [Instruction Following Evaluator](lc:user-guide/evals-sdk/evaluators/instruction_following_evaluator) (2 shared tags)
- [Trusted Message History](lc:user-guide/safety-security/trusted-message-history) (2 shared tags)
- [Steering (Plugins)](lc:user-guide/concepts/plugins/steering) (2 shared tags)
- [Coherence Evaluator](lc:user-guide/evals-sdk/evaluators/coherence_evaluator) (1 shared tag)
- [Conciseness Evaluator](lc:user-guide/evals-sdk/evaluators/conciseness_evaluator) (1 shared tag)
- [Goal Success Rate Evaluator](lc:user-guide/evals-sdk/evaluators/goal_success_rate_evaluator) (1 shared tag)
- [Helpfulness Evaluator](lc:user-guide/evals-sdk/evaluators/helpfulness_evaluator) (1 shared tag)
- [Interactions Evaluator](lc:user-guide/evals-sdk/evaluators/interactions_evaluator) (1 shared tag)
- [Output Evaluator](lc:user-guide/evals-sdk/evaluators/output_evaluator) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/agent/agent.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/agent/agent.py)

### TypeScript

- [harness-sdk/strands-ts/src/agent/agent.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/agent/agent.ts)
