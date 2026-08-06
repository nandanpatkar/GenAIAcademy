> [!NOTE] Where this runs in the docs
>
> [Sandboxes](lc:oss/python/deepagents/sandboxes)

```python sandboxes-upload-langsmith.py
from deepagents.backends.langsmith import LangSmithSandbox
from langsmith.sandbox import SandboxClient

client = SandboxClient()
ls_sandbox = client.create_sandbox()
backend = LangSmithSandbox(sandbox=ls_sandbox)

backend.upload_files(
    [
        ("/src/index.py", b"print('Hello')\n"),
        ("/pyproject.toml", b"[project]\nname = 'my-app'\n"),
    ]
)

try:
    print("✓ deepagents-sandbox-upload-langsmith-py validated")
finally:
    client.delete_sandbox(ls_sandbox.name)
```
