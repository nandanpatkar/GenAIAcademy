> [!NOTE] Where this runs in the docs
>
> [Profiles](lc:oss/python/deepagents/profiles)

```python profiles-provider-register.py
"""Profiles: register a provider profile."""

from deepagents import ProviderProfile, register_provider_profile

register_provider_profile(
    "openai",
    ProviderProfile(init_kwargs={"temperature": 0}),
)

print("✓ profiles-provider-register sample validated")
```
