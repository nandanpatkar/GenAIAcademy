## When To Use

- Use for choosing between direct model invocation, RAG, agents, flows, guardrails, evaluation, and prompt management patterns.
- Use as a map into the canonical `13-bedrock` notes.

## Core Concepts

- Direct invocation handles simple prompt/response tasks.
- RAG uses Knowledge Bases/vector stores for grounded answers.
- Agents use tools/action groups for task execution.
- Guardrails and evaluation control risk and quality.

## AWS Services And Features

- Amazon Bedrock
- Bedrock Knowledge Bases
- Bedrock Agents
- Bedrock Flows
- Bedrock Guardrails
- Bedrock Evaluations

## Implementation Patterns

- Prompt app -> prompt management -> Converse API -> guardrails -> evaluation.
- Enterprise Q&A -> Knowledge Base/RAG -> citations -> guardrails -> model evaluation.

## Tradeoffs And Pitfalls

- Do not use agents for simple static prompt workflows.
- RAG quality depends on ingestion, chunking, retrieval, and evaluation.
- Guardrails reduce risk but do not prove correctness.

## Decision Triggers

- Grounded enterprise Q&A points to RAG/Knowledge Bases.
- Tool use and task execution point to Agents.
- Prompt versioning points to Prompt Management.

## Related Notes

```ex-cards
[{"title": "Amazon Bedrock (deep dive notes)", "href": "ex:13-bedrock/amazon-bedrock", "body": ""}, {"title": "Amazon Bedrock Knowledge Bases (deep dive notes)", "href": "ex:13-bedrock/bedrock-knowledge-base", "body": ""}, {"title": "Agents for Amazon Bedrock", "href": "ex:13-bedrock/bedrock-agents", "body": ""}, {"title": "Bedrock Guardrails", "href": "ex:13-bedrock/bedrock-guardrails", "body": ""}]
```

## Sources

```ex-sources
[{"title": "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html", "href": "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html"}, {"title": "https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-management.html", "href": "https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-management.html"}, {"title": "https://docs.aws.amazon.com/bedrock/latest/userguide/evaluation.html", "href": "https://docs.aws.amazon.com/bedrock/latest/userguide/evaluation.html"}]
```
