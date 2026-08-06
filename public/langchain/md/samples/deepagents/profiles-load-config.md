> [!NOTE] Where this runs in the docs
>
> [Profiles](lc:oss/python/deepagents/profiles)

```python profiles-load-config.py
"""Profiles: load harness profile from a YAML config file."""

from pathlib import Path

Path("openai.yaml").write_text(
    """\
base_system_prompt: You are helpful.
system_prompt_suffix: Respond briefly.
excluded_tools:
  - execute
  - grep
excluded_middleware:
  - SummarizationMiddleware
general_purpose_subagent:
  enabled: false
"""
)

import yaml
from deepagents import HarnessProfileConfig, register_harness_profile

with open("openai.yaml") as f:
    register_harness_profile(
        "openai",
        HarnessProfileConfig.from_dict(yaml.safe_load(f)),
    )

print("✓ profiles-load-config sample validated")
```
