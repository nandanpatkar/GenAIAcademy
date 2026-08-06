> [!NOTE] Where this runs in the docs
>
> [Customization](lc:oss/python/deepagents/customization)

```python customization-overview.py
"""Customization page: overview, prompt assembly, and GP subagent profile examples."""

def search(query: str) -> str:
    """Search the web."""
    return query


def fetch_url(url: str) -> str:
    """Fetch a URL."""
    return url


from deepagents import create_deep_agent

agent = create_deep_agent(
    model="anthropic:claude-sonnet-4-6",
    system_prompt="You are a helpful assistant.",
    tools=[search, fetch_url],
    memory=["./AGENTS.md"],
    skills=["./skills/"],
)

assert agent is not None

from deepagents import create_deep_agent

agent = create_deep_agent(
    model="anthropic:claude-sonnet-4-6",
    system_prompt="You are a customer-support agent for ACME Corp.",
)
# Final = USER + BASE + SUFFIX
#       = "You are a customer-support agent for ACME Corp."
#         + "\n\n"
#         + BASE_AGENT_PROMPT
#         + "\n\n"
#         + <Claude-specific guidance>

assert agent is not None

from deepagents import (
    GeneralPurposeSubagentProfile,
    HarnessProfile,
    register_harness_profile,
)

register_harness_profile(
    "anthropic",
    HarnessProfile(
        base_system_prompt="You are ACME's support orchestrator.",  # main agent
        general_purpose_subagent=GeneralPurposeSubagentProfile(
            system_prompt="You are a research subagent. Cite sources.",  # GP subagent
        ),
        system_prompt_suffix="Always think step by step.",
    ),
)

assert True
```
