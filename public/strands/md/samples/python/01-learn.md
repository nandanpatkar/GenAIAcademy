Step-by-step guides from basic agent creation to multi-agent orchestration.

## Index

| Folder | SDK Feature | Description |
|--------|-------------|-------------|
| [`01-first-agent`](https://github.com/strands-agents/samples/tree/main/python/01-learn/01-first-agent) | `Agent` class | Create your first agent with system prompts |
| [`02-tools-and-mcp`](https://github.com/strands-agents/samples/tree/main/python/01-learn/02-tools-and-mcp) | `@tool` decorator, MCP | Build custom tools and connect MCP servers |
| [`03-model-providers`](https://github.com/strands-agents/samples/tree/main/python/01-learn/03-model-providers) | `OllamaModel`, `LiteLLMModel`, `OpenAIResponsesModel` | Run a local Ollama model, reach Azure OpenAI via LiteLLM, and call OpenAI on Amazon Bedrock |
| [`04-streaming`](https://github.com/strands-agents/samples/tree/main/python/01-learn/04-streaming) | `stream_async`, callbacks | Stream responses in async/FastAPI apps |
| [`05-guardrails`](https://github.com/strands-agents/samples/tree/main/python/01-learn/05-guardrails) | `guardrails` parameter | Add content filtering with Bedrock Guardrails |
| [`06-memory`](https://github.com/strands-agents/samples/tree/main/python/01-learn/06-memory) | Memory tools | Persist agent memory across sessions |
| [`07-aws-services`](https://github.com/strands-agents/samples/tree/main/python/01-learn/07-aws-services) | `retrieve` tool, `BedrockModel` | Connect to Knowledge Bases and DynamoDB |
| [`08-observability`](https://github.com/strands-agents/samples/tree/main/python/01-learn/08-observability) | Tracing, evaluation | Trace with Langfuse, evaluate with RAGAS |
| [`09-bidi-streaming`](https://github.com/strands-agents/samples/tree/main/python/01-learn/09-bidi-streaming) | `BidiAgent` | Build real-time voice agents |
| [`10-agents-as-tools`](https://github.com/strands-agents/samples/tree/main/python/01-learn/10-agents-as-tools) | Hierarchical agents | Compose agents as callable tools |
| [`11-swarm`](https://github.com/strands-agents/samples/tree/main/python/01-learn/11-swarm) | `Swarm` class | Build self-organizing agent teams |
| [`12-graph`](https://github.com/strands-agents/samples/tree/main/python/01-learn/12-graph) | `GraphBuilder` | Create deterministic agent workflows |
| [`13-human-in-the-loop`](https://github.com/strands-agents/samples/tree/main/python/01-learn/13-human-in-the-loop) | Interrupts, hooks | Implement approval workflows with human oversight |
| [`14-plugins`](https://github.com/strands-agents/samples/tree/main/python/01-learn/14-plugins) | `Plugin`, `@hook` | Build reusable plugins that bundle hooks, tools, and state |
| [`15-skills`](https://github.com/strands-agents/samples/tree/main/python/01-learn/15-skills) | AgentSkills plugin, Skill dataclass | Load specialized instructions on demand with skills |
| [`16-hooks-lifecycle`](https://github.com/strands-agents/samples/tree/main/python/01-learn/16-hooks-lifecycle) | `HookProvider`, lifecycle events, `cancel_tool`, `retry`, `resume` | Tour the full hook lifecycle and use writable fields to control agent behavior |
| [`17-conversation-management`](https://github.com/strands-agents/samples/tree/main/python/01-learn/17-conversation-management) | `SlidingWindowConversationManager`, `NullConversationManager`, `SummarizingConversationManager` | Control agent message history with sliding window, null, and summarizing strategies |
| [`18-self-improving-agents`](https://github.com/strands-agents/samples/tree/main/python/01-learn/18-self-improving-agents) | `load_tools_from_directory`, dynamic system prompt, AgentCore Memory + Runtime | Build a self-extending, self-modifying, autonomous agent and deploy it (6 steps, AIM308) |
| [`19-structured-output`](https://github.com/strands-agents/samples/tree/main/python/01-learn/19-structured-output) | Structured Output, Pydantic validation, `structured_output_model`, `field_validator` | Get validated, typed Pydantic objects back from agents instead of free-form text |
| [`20-session-management`](https://github.com/strands-agents/samples/tree/main/python/01-learn/20-session-management) | `SessionManager`, `FileSessionManager`, `S3SessionManager`, `SessionRepository` | Persist agent state across restarts with pluggable backends |

## Getting Started

Start with [`01-first-agent`](https://github.com/strands-agents/samples/tree/main/python/01-learn/01-first-agent) if you're new to Strands Agents, then progress in order.

[Strands Agents Documentation](https://strandsagents.com/)
