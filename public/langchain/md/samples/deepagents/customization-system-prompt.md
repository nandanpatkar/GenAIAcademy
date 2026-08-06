> [!NOTE] Where this runs in the docs
>
> [Customization](lc:oss/python/deepagents/customization)

```python customization-system-prompt.py
"""Customization: system prompt example."""

from deepagents import create_deep_agent

research_instructions = """\
You are an expert researcher. Your job is to conduct \
thorough research, and then write a polished report. \
"""

agent = create_deep_agent(
    model="anthropic:claude-sonnet-4-6",
    system_prompt=research_instructions,
)

assert agent is not None
```
