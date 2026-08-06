> [!NOTE] Where this runs in the docs
>
> [Deep Agent](lc:oss/python/langchain/deep-agent-from-scratch)

```python deep-agent-from-scratch.py
"""Build a data analysis agent from scratch using create_agent and Deep Agents middleware."""

from langchain.agents import create_agent

agent = create_agent("anthropic:claude-sonnet-4-6", tools=[])

from langchain.agents import create_agent
from deepagents.backends.langsmith import LangSmithSandbox
from deepagents.middleware import FilesystemMiddleware
from langsmith.sandbox import SandboxClient

client = SandboxClient()
import atexit
import time

SANDBOX_NAME = "langchain-docs"


def _named_sandboxes() -> list[object]:
    return [sb for sb in client.list_sandboxes() if getattr(sb, "name", None) == SANDBOX_NAME]


def _delete_named_sandboxes() -> None:
    for existing in _named_sandboxes():
        for identifier in (
            getattr(existing, "sandbox_id", None),
            getattr(existing, "id", None),
            getattr(existing, "name", None),
            SANDBOX_NAME,
        ):
            if not identifier:
                continue
            try:
                client.delete_sandbox(identifier)
                break
            except Exception:
                continue


for _ in range(3):
    _delete_named_sandboxes()
    if not _named_sandboxes():
        break
    time.sleep(1)
sandbox = None

atexit.register(_delete_named_sandboxes)
sandbox = client.create_sandbox(name="langchain-docs", snapshot_name="docs-test-ci")
backend = LangSmithSandbox(sandbox=sandbox)

agent = create_agent(
    "anthropic:claude-sonnet-4-6",
    tools=[],
    middleware=[FilesystemMiddleware(backend=backend)],
)


import csv
import io

rows = [
    ["Date", "Product", "Units", "Revenue"],
    ["2025-08-01", "Widget A", 10, 250],
    ["2025-08-02", "Widget B", 5, 125],
    ["2025-08-03", "Widget A", 7, 175],
    ["2025-08-04", "Widget C", 3, 90],
]
buf = io.StringIO()
csv.writer(buf).writerows(rows)
backend.upload_files([("/sales.csv", buf.getvalue().encode())])

upload_stream = agent.stream_events(
    {
        "messages": [
            {
                "role": "user",
                "content": (
                    "Read /sales.csv and summarize total revenue by product in one "
                    "sentence. Do not run shell commands."
                ),
            }
        ]
    },
    version="v3",
    config={"recursion_limit": 8},
)
for item in upload_stream.messages:
    print(item.text)
upload_stream.output

from deepagents.middleware import FilesystemMiddleware, SummarizationMiddleware

model = "anthropic:claude-sonnet-4-6"

agent = create_agent(
    model=model,
    tools=[],
    middleware=[
        FilesystemMiddleware(backend=backend),
        SummarizationMiddleware(model=model, backend=backend),
    ],
)

from pathlib import Path

skills_dir = (Path(__file__).resolve().parent / "skills").resolve()
skills_dir = Path("src/code-samples/langchain/skills").resolve()
skill_files: list[tuple[str, bytes]] = []
for path in sorted(skills_dir.rglob("*")):
    if not path.is_file():
        continue
    rel = path.resolve().relative_to(skills_dir)
    skill_files.append((f"/skills/{rel.as_posix()}", path.read_bytes()))
backend.upload_files(skill_files)

from deepagents.middleware import FilesystemMiddleware, SkillsMiddleware, SummarizationMiddleware

agent = create_agent(
    model=model,
    tools=[],
    middleware=[
        FilesystemMiddleware(backend=backend),
        SummarizationMiddleware(model=model, backend=backend),
        SkillsMiddleware(backend=backend, sources=["/skills/"]),
    ],
)

from deepagents import SubAgent
from deepagents.middleware import (
    FilesystemMiddleware,
    SkillsMiddleware,
    SubAgentMiddleware,
    SummarizationMiddleware,
)
from langchain.agents.middleware import TodoListMiddleware

visualizer: SubAgent = {
    "name": "visualizer",
    "description": "Generates charts and visualizations from data files in the sandbox.",
    "system_prompt": "You are a data visualization specialist. Write Python scripts using matplotlib and seaborn. Save all figures as PNG files.",
    "tools": [],
    "model": "anthropic:claude-sonnet-4-6",
}

agent = create_agent(
    model=model,
    tools=[],
    middleware=[
        FilesystemMiddleware(backend=backend),
        SummarizationMiddleware(model=model, backend=backend),
        SkillsMiddleware(backend=backend, sources=["/skills/"]),
        TodoListMiddleware(),
        SubAgentMiddleware(backend=backend, subagents=[visualizer]),
    ],
)

try:
    assert backend.read("/sales.csv").error is None
    assert backend.read("/skills/pandas-patterns/SKILL.md").error is None
    assert agent is not None
    print("✓ deep-agent-from-scratch sample completed")
finally:
    _delete_named_sandboxes()
```
