> [!NOTE] Where this runs in the docs
>
> [Agents](lc:oss/python/langchain/agents)

```python agents-harness.py
"""Agents docs: harness examples (execution environment, context management, middleware)."""

from langchain.tools import tool


@tool
def search(query: str) -> str:
    """Search for information."""
    return f"Results for: {query}"

from langchain.agents import create_agent
from deepagents.backends import StateBackend
from deepagents.middleware import FilesystemMiddleware

agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[search],
    middleware=[FilesystemMiddleware(backend=StateBackend())],
)

_execution_environment_agent = agent

from deepagents.backends import StateBackend
from deepagents.middleware import FilesystemMiddleware, MemoryMiddleware, SkillsMiddleware, SummarizationMiddleware

backend = StateBackend()
model = "anthropic:claude-sonnet-4-6"

agent = create_agent(
    model=model,
    tools=[search],
    middleware=[
        FilesystemMiddleware(backend=backend),
        SummarizationMiddleware(model=model, backend=backend),
        MemoryMiddleware(backend=backend, sources=["./AGENTS.md"]),
        SkillsMiddleware(backend=backend, sources=["./skills/"]),
    ],
)

_context_management_agent = agent

from langchain.agents import create_agent
from langchain.agents.middleware import ModelRetryMiddleware, ToolRetryMiddleware
from langchain.tools import tool


@tool
def search(query: str) -> str:
    """Search for a query and return a short summary."""
    return f"Search results for: {query}"


agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[search],
    middleware=[
        ModelRetryMiddleware(max_retries=3),
        ToolRetryMiddleware(max_retries=2),
    ],
)

_fault_tolerance_agent = agent

from langchain.agents import create_agent
from langchain.agents.middleware import PIIMiddleware
from langchain.tools import tool


@tool
def search(query: str) -> str:
    """Search for a query and return a short summary."""
    return f"Search results for: {query}"


agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[search],
    middleware=[PIIMiddleware("email")],
)

_guardrails_agent = agent

from deepagents.backends import StateBackend
from deepagents.middleware import FilesystemMiddleware
from deepagents.middleware.subagents import SubAgentMiddleware
from langchain.agents import create_agent
from langchain.agents.middleware import TodoListMiddleware
from langchain.tools import tool


@tool
def search(query: str) -> str:
    """Search for a query and return a short summary."""
    return f"Search results for: {query}"


backend = StateBackend()

agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[search],
    middleware=[
        FilesystemMiddleware(backend=backend),
        TodoListMiddleware(),
        SubAgentMiddleware(
            backend=backend,
            subagents=[
                {
                    "name": "researcher",
                    "description": "Searches and returns a structured summary.",
                    "system_prompt": "Use the search tool to research the question and summarize key points.",
                    "tools": [search],
                    "model": "anthropic:claude-sonnet-4-6",
                    "middleware": [],
                }
            ],
        ),
    ],
)

_planning_delegation_agent = agent

from langchain.agents import create_agent
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langchain.tools import tool


@tool
def search(query: str) -> str:
    """Search for a query and return a short summary."""
    return f"Search results for: {query}"


agent = create_agent(
    model="anthropic:claude-sonnet-4-6",
    tools=[search],
    middleware=[HumanInTheLoopMiddleware(interrupt_on={"write_file": True})],
)

_steering_agent = agent


def _assistant_text(result: dict) -> str:
    last = result["messages"][-1]
    if last.content_blocks:
        return last.content_blocks[0]["text"]
    return str(last.content)


def _assert_agent_invokes(agent, label: str) -> None:
    result = agent.invoke(
        {
            "messages": [
                {
                    "role": "user",
                    "content": "Use the search tool to look up LangChain agents.",
                }
            ]
        }
    )
    text = _assistant_text(result)
    assert text.strip(), f"{label}: expected non-empty assistant reply"
    print(f"✓ {label} invokes and returns a response")


if __name__ == "__main__":
    _assert_agent_invokes(_execution_environment_agent, "agents execution environment")
    _assert_agent_invokes(_context_management_agent, "agents context management")
    _assert_agent_invokes(_fault_tolerance_agent, "agents fault tolerance")
    _assert_agent_invokes(_guardrails_agent, "agents guardrails")
    _assert_agent_invokes(_planning_delegation_agent, "agents planning/delegation")
    _assert_agent_invokes(_steering_agent, "agents steering")
```
