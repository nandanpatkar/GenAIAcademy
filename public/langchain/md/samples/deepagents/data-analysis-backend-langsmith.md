> [!NOTE] Where this runs in the docs
>
> [Data Analysis](lc:oss/python/deepagents/data-analysis)

```python data-analysis-backend-langsmith.py
"""Data analysis tutorial: LangSmith sandbox backend."""

from deepagents.backends.langsmith import LangSmithSandbox
from langsmith.sandbox import SandboxClient

client = SandboxClient()
ls_sandbox = client.create_sandbox()
backend = LangSmithSandbox(sandbox=ls_sandbox)

try:
    assert backend is not None
    print("✓ data-analysis-backend-langsmith sample validated")
finally:
    client.delete_sandbox(ls_sandbox.name)
```
