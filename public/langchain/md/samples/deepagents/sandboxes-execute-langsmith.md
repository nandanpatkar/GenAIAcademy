> [!NOTE] Where this runs in the docs
>
> [Sandboxes](lc:oss/python/deepagents/sandboxes)

```python sandboxes-execute-langsmith.py
from deepagents.backends.langsmith import LangSmithSandbox
from langsmith.sandbox import SandboxClient

client = SandboxClient()
ls_sandbox = client.create_sandbox()
backend = LangSmithSandbox(sandbox=ls_sandbox)

result = backend.execute("python --version")
print(result.output)

try:
    assert result.output
    print("✓ deepagents-sandbox-execute-langsmith-py validated")
finally:
    client.delete_sandbox(ls_sandbox.name)
```
