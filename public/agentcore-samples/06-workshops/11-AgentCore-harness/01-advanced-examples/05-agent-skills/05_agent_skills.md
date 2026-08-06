# Agent Skills Integration with harness

| Info | Details |
|---|---|
| Tutorial | harness — Agent Skills for Extended Capabilities |
| SDK | boto3 |
| Model | Claude Haiku 4.5 (Bedrock) |

**What you'll learn:**
- What are **Agent Skills** and why they matter
- How to install skills on the agent's VM
- Using the `skills` parameter in invoke calls
- Working with file format skills (xlsx, pdf, docx)
- Creating complex outputs with skill assistance
- Best practices for skill management

**What are Agent Skills?**

Agent Skills are pre-built capability bundles that extend your agent's abilities with:
- **Specialized instructions** - Step-by-step guidance for complex tasks
- **Code templates** - Proven implementations for file formats, APIs, etc.
- **Tool configurations** - Pre-configured settings and examples
- **Domain knowledge** - Best practices and common patterns

Skills are especially valuable with smaller/cheaper models that lack built-in knowledge of specialized file formats or APIs. The skill provides the instructions and templates the model needs to succeed.

**Available Skills:**
- `xlsx` - Excel spreadsheet creation and manipulation
- `pdf` - PDF generation and processing
- `docx` - Word document creation
- Custom skills from GitHub or local directories

**Prerequisites:**
- AWS account with access to Amazon Bedrock AgentCore
- AWS CLI v2 configured with credentials
- Python 3.10+

## Part 0: Setup

Import helper modules and create the IAM execution role.

```python
import sys
import os
import time
import uuid
from pathlib import Path
import boto3

# helpers
sys.path.insert(0, str(Path.cwd().parent.parent))

# --- Configuration ---
from helper.iam import create_harness_role, delete_harness_role
from helper.client import get_agentcore_control_client, get_agentcore_client

# --- Create boto3 clients ---
control = get_agentcore_control_client()
client = get_agentcore_client()

account_id = boto3.client("sts").get_caller_identity()["Account"]
print(f"Account: {account_id}")
```

```python
role_arn = create_harness_role()
print(f"\nExecution Role ARN: {role_arn}")

print("Waiting for IAM role to propagate...")
time.sleep(10)
print("Ready!")
```

## Part 1: Create Harness

Create a standard Harness that we'll use for all skill examples.

```python
HARNESS_NAME = f"SkillsDemo_{uuid.uuid4().hex[:8]}"

resp = control.create_harness(harnessName=HARNESS_NAME, executionRoleArn=role_arn)
harness = resp["harness"]
harness_id = harness["harnessId"]
harness_arn = harness["arn"]
print(f"Harness ID: {harness_id}")
print(f"Harness ARN: {harness_arn}")
print(f"Status: {harness['status']}")
```

### Wait for Harness to be ready

```python
for i in range(12):
    resp = control.get_harness(harnessId=harness_id)
    status = resp["harness"]["status"]
    print(f"Attempt {i + 1}: {status}")
    if status == "READY":
        print("✅ Harness is ready")
        break
    time.sleep(5)
```

Update container with Node image, so it can install skills

```python
CONTAINER_URI = "public.ecr.aws/docker/library/node:slim"

control.update_harness(
    harnessId=harness_id,
    environmentArtifact={"optionalValue": {"containerConfiguration": {"containerUri": CONTAINER_URI}}},
)
```

```python
for i in range(12):
    resp = control.get_harness(harnessId=harness_id)
    status = resp["harness"]["status"]
    print(f"Attempt {i + 1}: {status}")
    if status == "READY":
        print("✅ Harness is ready")
        break
    time.sleep(5)
```

## Part 2: Install Agent Skills

Skills are installed on the agent's VM using `ExecuteCommand`. The Anthropic skills repository provides a CLI tool that handles installation.

**Installation pattern:**
```bash
npx skills add <github-url> --skill <skill-name> --yes
```

This downloads the skill and installs it to `.agents/skills/<skill-name>` on the VM.

We'll install the `xlsx` skill for Excel spreadsheet creation.

```python
session_id = str(uuid.uuid4()).upper()
print(f"Session ID: {session_id}\n")

# Install the xlsx skill from Anthropic's skills repository
print("Installing xlsx skill...")
resp = client.invoke_agent_runtime_command(
    agentRuntimeArn=harness_arn,
    runtimeSessionId=session_id,
    body={
        "command": "apt-get update && apt-get install git -y && npx skills add https://github.com/anthropics/skills --skill xlsx --yes"
    },
)

output = ""
for event in resp["stream"]:
    if "chunk" in event and "contentDelta" in event["chunk"]:
        delta = event["chunk"]["contentDelta"]
        if "stdout" in delta:
            output += delta["stdout"]
        if "stderr" in delta:
            output += delta["stderr"]

# Show last 500 chars (installation output can be verbose)
print(output[-500:] if len(output) > 500 else output)
print("\n✅ xlsx skill installed")
```

### Verify skill installation

```python
# Check that the skill directory exists
resp = client.invoke_agent_runtime_command(
    agentRuntimeArn=harness_arn,
    runtimeSessionId=session_id,
    body={"command": "ls -la .agents/skills/xlsx/"},
)

for event in resp["stream"]:
    if "chunk" in event and "contentDelta" in event["chunk"]:
        delta = event["chunk"]["contentDelta"]
        if "stdout" in delta:
            print(delta["stdout"], end="")
```

## Part 3: Using Skills in Invocations

To use a skill, pass it in the `skills` parameter when invoking the agent:

```python
skills=[{"path": ".agents/skills/xlsx"}]
```

The agent will automatically load the skill's instructions and use them to complete the task.

### Example: Create a Travel Budget Spreadsheet

Let's ask the agent to create an Excel spreadsheet with a travel budget. With the xlsx skill loaded, the agent knows:
- How to structure xlsx files
- Which npm packages to use
- Common patterns for formulas and formatting

```python
response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=session_id,
    skills=[{"path": ".agents/skills/xlsx"}],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": (
                        "Create an Excel spreadsheet with a 5-day Amsterdam trip budget. "
                        "Include columns for: Day, Category, Item, Cost (EUR), Cost (USD). "
                        "Add rows for accommodation, food, transport, museums, and activities for each day. "
                        "Include a total row with SUM formulas for EUR and USD columns. "
                        "Use currency conversion rate: 1 EUR = 1.10 USD. "
                        "Apply nice formatting: bold headers, currency formatting, alternating row colors. "
                        "Save it as /tmp/amsterdam_budget.xlsx"
                    )
                }
            ],
        }
    ],
    model={"bedrockModelConfig": {"modelId": "global.anthropic.claude-haiku-4-5-20251001-v1:0"}},
)

# Stream the response
for event in response["stream"]:
    if "contentBlockStart" in event:
        start = event["contentBlockStart"].get("start", {})
        if "toolUse" in start:
            tool_name = start["toolUse"].get("name", "?")
            print(f"\n[Tool: {tool_name}]", flush=True)
    elif "contentBlockDelta" in event:
        delta = event["contentBlockDelta"].get("delta", {})
        if "text" in delta:
            print(delta["text"], end="", flush=True)
    elif "messageStop" in event:
        print("\n")
```

### Download and inspect the spreadsheet

```python
import base64

# Read the file as base64 from the agent's VM
b64_data = ""
resp = client.invoke_agent_runtime_command(
    agentRuntimeArn=harness_arn,
    runtimeSessionId=session_id,
    body={"command": "base64 /tmp/amsterdam_budget.xlsx"},
)

for event in resp["stream"]:
    if "chunk" in event and "contentDelta" in event["chunk"]:
        delta = event["chunk"]["contentDelta"]
        if "stdout" in delta:
            b64_data += delta["stdout"]

# Save locally
if b64_data.strip():
    local_path = os.path.expanduser("~/Downloads/amsterdam_budget.xlsx")
    with open(local_path, "wb") as f:
        f.write(base64.b64decode(b64_data))
    print(f"✅ Saved to {local_path}")
    print(f"   Size: {os.path.getsize(local_path):,} bytes")
    print(f"\n   Open it with: open {local_path}")
else:
    print("⚠️  No file generated - check the agent's response above")
```

## Part 4: Installing Multiple Skills

You can install multiple skills on the same VM and use them together. Let's install a few more common skills.

**Note:** This is demonstration only - we won't use all of these in this notebook, but this shows the pattern for building a multi-skill agent.

```python
# Install additional skills (optional - can take a minute)
multi_skill_session = str(uuid.uuid4()).upper()
print(f"Multi-skill session: {multi_skill_session}\n")

# You can install multiple skills from the same repository
skills_to_install = [
    # "pdf",    # PDF generation
    # "docx",   # Word documents
]

for skill_name in skills_to_install:
    print(f"Installing {skill_name} skill...")
    resp = client.invoke_agent_runtime_command(
        agentRuntimeArn=harness_arn,
        runtimeSessionId=multi_skill_session,
        body={"command": f"npx skills add https://github.com/anthropics/skills --skill {skill_name} --yes"},
    )

    output = ""
    for event in resp["stream"]:
        if "chunk" in event and "contentDelta" in event["chunk"]:
            delta = event["chunk"]["contentDelta"]
            if "stdout" in delta:
                output += delta["stdout"]

    print(f"  ✅ {skill_name} installed\n")

if not skills_to_install:
    print("(Skipped - uncomment skills_to_install to try this)")
```

### Using multiple skills in one invocation

When you have multiple skills installed, you can load them all by passing multiple paths:

```python
skills=[
    {"path": ".agents/skills/xlsx"},
    {"path": ".agents/skills/pdf"},
    {"path": ".agents/skills/docx"},
]
```

The agent will use the appropriate skill based on the task.

## Part 5: Advanced Example — Financial Report

Let's create a more complex spreadsheet with multiple sheets, formulas, and formatting.

This demonstrates the power of skills: even a small model can create sophisticated Excel files because the skill provides detailed instructions.

```python
print(f"Report session: {session_id}\n")

# Let's create the report in previous session
response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=session_id,
    skills=[{"path": ".agents/skills/xlsx"}],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": (
                        "Create a professional quarterly sales report Excel file with 3 sheets:\n"
                        "\n"
                        "Sheet 1 - Summary:\n"
                        "- Q1 2024 Sales Overview title\n"
                        "- Table with: Region, Target (USD), Actual (USD), Variance (%), Status\n"
                        "- 4 regions: North America, Europe, Asia Pacific, Latin America\n"
                        "- Use realistic numbers (targets 1M-5M, actual should vary ±20%)\n"
                        "- Variance formula: (Actual-Target)/Target * 100\n"
                        "- Status formula: IF variance >= 0, 'On Track', 'Below Target'\n"
                        "- Total row with SUM formulas\n"
                        "\n"
                        "Sheet 2 - Monthly Breakdown:\n"
                        "- Table with: Month, Region, Sales (USD)\n"
                        "- Data for Jan, Feb, Mar for each region\n"
                        "- Total row\n"
                        "\n"
                        "Sheet 3 - Top Products:\n"
                        "- Table with: Rank, Product, Category, Units Sold, Revenue (USD)\n"
                        "- 10 products with realistic data\n"
                        "\n"
                        "Formatting:\n"
                        "- Bold headers with background color\n"
                        "- Currency formatting for USD columns\n"
                        "- Percentage formatting for Variance column\n"
                        "- Conditional formatting: green for positive variance, red for negative\n"
                        "- Freeze top row in all sheets\n"
                        "\n"
                        "Save as /tmp/q1_sales_report.xlsx"
                    )
                }
            ],
        }
    ],
    model={"bedrockModelConfig": {"modelId": "global.anthropic.claude-haiku-4-5-20251001-v1:0"}},
    timeoutSeconds=300,
)

# Stream the response
for event in response["stream"]:
    if "contentBlockStart" in event:
        start = event["contentBlockStart"].get("start", {})
        if "toolUse" in start:
            tool_name = start["toolUse"].get("name", "?")
            print(f"\n[Tool: {tool_name}]", flush=True)
    elif "contentBlockDelta" in event:
        delta = event["contentBlockDelta"].get("delta", {})
        if "text" in delta:
            print(delta["text"], end="", flush=True)
    elif "messageStop" in event:
        print("\n")
```

### Download the sales report

```python
# Download the report
b64_data = ""
resp = client.invoke_agent_runtime_command(
    agentRuntimeArn=harness_arn,
    runtimeSessionId=session_id,
    body={"command": "base64 /tmp/q1_sales_report.xlsx 2>/dev/null"},
)

for event in resp["stream"]:
    if "chunk" in event and "contentDelta" in event["chunk"]:
        delta = event["chunk"]["contentDelta"]
        if "stdout" in delta:
            b64_data += delta["stdout"]

if b64_data.strip():
    local_path = os.path.expanduser("~/Downloads/q1_sales_report.xlsx")
    with open(local_path, "wb") as f:
        f.write(base64.b64decode(b64_data))
    print(f"✅ Saved to {local_path}")
    print(f"   Size: {os.path.getsize(local_path):,} bytes")
    print("   Sheets: 3 (Summary, Monthly Breakdown, Top Products)")
    print(f"\n   Open it with: open {local_path}")
else:
    print("⚠️  No file generated")
```

## Summary

You've learned how to:
- ✅ Install Agent Skills on the VM using npx
- ✅ Use skills in invoke calls with the `skills` parameter
- ✅ Create complex Excel spreadsheets with the xlsx skill
- ✅ Download and inspect generated files
- ✅ Install multiple skills for different capabilities

### Next Steps:
1. Try other skills from the [Anthropic skills repository](https://github.com/anthropics/skills)
2. Create custom skills for your organization's specific needs
3. Combine skills with MCP, Browser, and Code Interpreter tools
4. Build multi-step workflows using skills across sessions

## Cleanup

Delete the Harness when you're done to avoid charges.

```python
control.delete_harness(harnessId=harness_id)
print(f"Deleted harness: {harness_id}")
```

```python
# Delete IAM role (optional - may be used by other examples)
delete_harness_role()
print("Deleted IAM role")
```
