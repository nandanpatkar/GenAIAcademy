## When To Use

- Use Agents for Amazon Bedrock when you want a managed agent that can break down tasks, call APIs, ask clarifying questions, query knowledge bases, and return a final response.
- Use an action group when the agent must take action through Lambda or an API.
- Use a knowledge base when the agent needs RAG over private or frequently changing data.
- Use multi-agent collaboration when a supervisor agent should coordinate specialist collaborator agents.

## Core Concepts
- Agent
  - A managed runtime configuration with instructions, a model, and optional tools.
- Action groups
  - Define actions an agent can take (often via Lambda) using OpenAPI or function schemas.
- Knowledge bases
  - Attached data sources the agent can query during orchestration.
- Orchestration
  - The agent decides whether to call an action group, query a knowledge base, or respond.
- Alias and versioning
  - Create versions and route production traffic via aliases.
- Traces
  - Orchestration traces show action selection, inputs, outputs, and rationale.
- Multi-agent collaboration
  - A supervisor agent can route work to collaborator agents with their own tools, knowledge bases, and guardrails.

## AWS Services And Features

- Agents for Amazon Bedrock
- Action groups
- Knowledge bases
- Guardrails
- Agent aliases and versions
- Agent traces
- Multi-agent collaboration

## Implementation Patterns

1. User request enters the agent.
2. Orchestration model selects action groups or knowledge bases as needed.
3. Actions run (Lambda/API) or KB retrieval happens.
4. The agent synthesizes a final response.

## Tradeoffs And Pitfalls

- Keep action groups narrowly scoped with clear schemas.
- Associate a knowledge base only when RAG is required.
- Use aliases to promote tested versions safely.
- Review orchestration traces to debug and tune prompts.
- For multi-agent collaboration, minimize overlapping collaborator responsibilities.

## Decision Triggers

- Agents for Bedrock is a **managed** agent service.
- Action groups define tools (often Lambda-backed), knowledge bases provide RAG.
- Orchestration is managed by Bedrock and can be traced.
- Supervisor/collaborator wording points to [Bedrock Multi-Agent Collaboration](ex:13-bedrock/bedrock-multi-agent-collaboration).

## Related Notes

```ex-cards
[{"title": "Bedrock Multi-Agent Collaboration", "href": "ex:13-bedrock/bedrock-multi-agent-collaboration", "body": ""}, {"title": "Amazon Bedrock AgentCore", "href": "ex:13-bedrock/bedrock-agentcore", "body": ""}, {"title": "Bedrock RAG Decision Guide", "href": "ex:13-bedrock/bedrock-rag-decision-guide", "body": ""}, {"title": "Agentic RAG Patterns", "href": "ex:14-agentic-ai/agentic-rag-patterns", "body": ""}, {"title": "Model Context Protocol (MCP)", "href": "ex:14-agentic-ai/model-context-protocol-mcp", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html", "href": "https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html"}, {"title": "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-how.html", "href": "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-how.html"}, {"title": "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-create.html", "href": "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-create.html"}, {"title": "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-multi-agent-collaboration.html", "href": "https://docs.aws.amazon.com/bedrock/latest/userguide/agents-multi-agent-collaboration.html"}, {"title": "https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_OrchestrationTrace.html", "href": "https://docs.aws.amazon.com/bedrock/latest/APIReference/API_agent-runtime_OrchestrationTrace.html"}, {"title": "https://aws.amazon.com/blogs/aws/agents-for-amazon-bedrock-is-now-available-with-improved-control-of-orchestration-and-visibility-into-reasoning", "href": "https://aws.amazon.com/blogs/aws/agents-for-amazon-bedrock-is-now-available-with-improved-control-of-orchestration-and-visibility-into-reasoning"}]
```
