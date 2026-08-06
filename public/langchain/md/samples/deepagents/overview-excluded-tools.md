> [!NOTE] Where this runs in the docs
>
> [Overview](lc:oss/python/deepagents/overview)

```python overview-excluded-tools.py
"""Overview page: harness profile with excluded filesystem tools."""

from deepagents import HarnessProfile, register_harness_profile

register_harness_profile(
    "anthropic:claude-sonnet-4-6",
    HarnessProfile(
        excluded_tools=frozenset(
            {"ls", "read_file", "write_file", "edit_file", "glob", "grep"}
        ),
    ),
)

print("✓ overview-excluded-tools sample validated")
```
