> [!NOTE] Where this runs in the docs
>
> [Profiles](lc:oss/python/deepagents/profiles)

```python profiles-plugin-register.py
"""Profiles: plugin entry-point registration callables."""

from deepagents import (
    HarnessProfile,
    ProviderProfile,
    register_harness_profile,
    register_provider_profile,
)


def register_harness() -> None:
    register_harness_profile(
        "my_provider",
        HarnessProfile(system_prompt_suffix="Batch independent tool calls in parallel."),
    )


def register_provider() -> None:
    register_provider_profile(
        "my_provider",
        ProviderProfile(init_kwargs={"temperature": 0}),
    )

register_harness()
register_provider()
print("✓ profiles-plugin-register sample validated")
```
