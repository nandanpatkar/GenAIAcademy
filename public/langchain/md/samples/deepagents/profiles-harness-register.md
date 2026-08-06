> [!NOTE] Where this runs in the docs
>
> [Profiles](lc:oss/python/deepagents/profiles)

```python profiles-harness-register.py
"""Profiles: register a harness profile."""

from deepagents import (
    GeneralPurposeSubagentProfile,
    HarnessProfile,
    register_harness_profile,
)

register_harness_profile(
    "openai:gpt-5.5",
    HarnessProfile(
        system_prompt_suffix="Respond in under 100 words.",
        excluded_tools={"execute"},
        excluded_middleware={"SummarizationMiddleware"},
        general_purpose_subagent=GeneralPurposeSubagentProfile(enabled=False),
    ),
)

print("✓ profiles-harness-register sample validated")
```
