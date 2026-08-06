# MCP (Model Context Protocol) Integration with harness

| Info | Details |
|---|---|
| Tutorial | harness — MCP Integration Examples |
| SDK | boto3 |
| Model | Claude Haiku 4.5 (Bedrock) |

**What you'll learn:**
- How to connect Harness agents to **MCP servers**
- Working with different MCP providers (Exa search, Brave search, etc.)
- Passing headers and configuration to MCP servers
- Error handling and debugging MCP connections
- Best practices for MCP integration

**What is MCP?**

The Model Context Protocol (MCP) is an open standard that enables AI agents to securely connect to external data sources and tools. With MCP, your agent can:
- Search the web (Exa, Brave)
- Access databases
- Interact with APIs
- Use custom tools

**Prerequisites:**
- AWS account with access to Amazon Bedrock AgentCore
- AWS CLI v2 configured with credentials
- Python 3.10+
- (Optional) MCP server API keys for some examples

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

Create IAM Role

```python
role_arn = create_harness_role()
print(f"\nExecution Role ARN: {role_arn}")

print("Waiting for IAM role to propagate...")
time.sleep(10)
print("Ready!")
```

## Part 1: Create Harness

Create a Harness that we'll use for all MCP examples.

```python
HARNESS_NAME = f"MCPIntegration_{uuid.uuid4().hex[:8]}"

resp = control.create_harness(
    harnessName=HARNESS_NAME,
    executionRoleArn=role_arn,
)
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

## Part 2: Basic MCP Integration — Exa Search

**Exa** is an AI-powered search engine that provides high-quality, structured web search results.

### How to use MCP with Harness:

```python
tools=[{
    "type": "remote_mcp",
    "name": "exa",  # Tool name the agent will see
    "config": {
        "remoteMcp": {
            "url": "https://mcp.exa.ai/mcp"  # MCP server endpoint
        }
    }
}]
```

The agent will automatically discover available tools from the MCP server and use them as needed.

```python
session_id = str(uuid.uuid4()).upper()
print(f"Session ID: {session_id}\n")

response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=session_id,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": "Search for the latest developments in quantum computing in 2024. "
                    "Find 3-5 recent articles and summarize the key breakthroughs."
                }
            ],
        }
    ],
    tools=[
        {
            "type": "remote_mcp",
            "name": "exa",
            "config": {"remoteMcp": {"url": "https://mcp.exa.ai/mcp"}},
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
    elif "internalServerException" in event:
        print(f"\nError: {event['internalServerException']}")
```

## Part 3: Multiple MCP Tools — Combining Search Providers

You can provide multiple MCP tools in a single invocation. The agent will choose which tool(s) to use based on the task.

In this example, we give the agent access to both Exa and another MCP server, and let it decide which to use.

```python
multi_session_id = str(uuid.uuid4()).upper()
print(f"Multi-tool session: {multi_session_id}\n")

response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=multi_session_id,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "text": "Compare the search results from different sources about 'AWS re:Invent 2024 announcements'. "
                    "What were the major announcements?"
                }
            ],
        }
    ],
    tools=[
        {
            "type": "remote_mcp",
            "name": "exa_search",
            "config": {"remoteMcp": {"url": "https://mcp.exa.ai/mcp"}},
        },
        # Note: Add other MCP servers here as needed
        # {
        #     "type": "remote_mcp",
        #     "name": "brave_search",
        #     "config": {"remoteMcp": {"url": "https://mcp.brave.com/api"}}
        # }
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
    elif "internalServerException" in event:
        print(f"\nError: {event['internalServerException']}")
```

## Part 4: MCP with Authentication — Passing Headers

Some MCP servers require authentication via headers (API keys, tokens, etc.).

**Note:** The current API may pass headers via the `config` object. Check the latest API documentation for the exact format.

```python
{
    "type": "remote_mcp",
    "name": "authenticated_mcp",
    "config": {
        "remoteMcp": {
            "url": "https://api.example.com/mcp",
            "headers": {
                "Authorization": "Bearer YOUR_API_KEY",
                "X-Custom-Header": "value"
            }
        }
    }
}
```

**Security Best Practice:** Never hardcode API keys. Use environment variables or AWS Secrets Manager.

```python
# Example: Using environment variable for API key

# Uncomment and set your API key as an environment variable
# export MCP_API_KEY="your-api-key-here"

api_key = os.getenv("MCP_API_KEY", "")

if api_key:
    auth_session_id = str(uuid.uuid4()).upper()
    print(f"Authenticated session: {auth_session_id}\n")

    # Example configuration (adjust based on your MCP server requirements)
    tools_config = [
        {
            "type": "remote_mcp",
            "name": "authenticated_search",
            "config": {
                "remoteMcp": {
                    "url": "https://mcp.exa.ai/mcp",
                    # Note: Header format may vary - check latest API docs
                    # "headers": {
                    #     "Authorization": f"Bearer {api_key}"
                    # }
                }
            },
        }
    ]

    print("✅ MCP tool configured with authentication")
    print(f"Tool config: {json.dumps(tools_config, indent=2)}")
else:
    print("⚠️  No MCP_API_KEY found in environment. Skipping authenticated example.")
    print("   Set it with: export MCP_API_KEY='your-key-here'")
```

## Part 5: Error Handling and Debugging

When working with MCP, several things can go wrong:
- Invalid MCP server URL
- Network timeouts
- Authentication failures
- MCP server errors

Here's how to handle errors gracefully.

```python
def invoke_with_error_handling(harness_arn, session_id, prompt, tools, timeout=300):
    """
    Invoke harness with comprehensive error handling for MCP tools.
    """
    try:
        response = client.invoke_harness(
            harnessArn=harness_arn,
            runtimeSessionId=session_id,
            messages=[{"role": "user", "content": [{"text": prompt}]}],
            tools=tools,
            model={"bedrockModelConfig": {"modelId": "global.anthropic.claude-haiku-4-5-20251001-v1:0"}},
            timeoutSeconds=timeout,
        )

        result = {"text": "", "tool_uses": [], "errors": []}

        for event in response["stream"]:
            if "contentBlockStart" in event:
                start = event["contentBlockStart"].get("start", {})
                if "toolUse" in start:
                    tool_info = start["toolUse"]
                    result["tool_uses"].append(tool_info.get("name", "unknown"))
                    print(f"\n[Tool: {tool_info.get('name', '?')}]", flush=True)

            elif "contentBlockDelta" in event:
                delta = event["contentBlockDelta"].get("delta", {})
                if "text" in delta:
                    result["text"] += delta["text"]
                    print(delta["text"], end="", flush=True)

            elif "messageStop" in event:
                print("\n")
                stop_reason = event["messageStop"].get("stopReason")
                if stop_reason:
                    print(f"Stop reason: {stop_reason}")

            elif "internalServerException" in event:
                error = event["internalServerException"]
                result["errors"].append(error)
                print(f"\n❌ Error: {error}")

        return result

    except Exception as e:
        print(f"\n❌ Exception: {type(e).__name__}: {str(e)}")
        return {"text": "", "tool_uses": [], "errors": [str(e)]}


# Test with valid MCP
debug_session = str(uuid.uuid4()).upper()
print("Testing error handling with valid MCP...\n")

result = invoke_with_error_handling(
    harness_arn=harness_arn,
    session_id=debug_session,
    prompt="Search for 'Amazon Bedrock new features' and summarize the top result.",
    tools=[
        {
            "type": "remote_mcp",
            "name": "exa",
            "config": {"remoteMcp": {"url": "https://mcp.exa.ai/mcp"}},
        }
    ],
    timeout=300,
)

print("\n✅ Invocation complete")
print(f"Tools used: {result['tool_uses']}")
print(f"Errors encountered: {len(result['errors'])}")
```

### Test with invalid MCP URL (demonstrates error handling)

```python
# This will likely fail - demonstrating error handling
invalid_session = str(uuid.uuid4()).upper()
print("Testing error handling with invalid MCP URL...\n")

result = invoke_with_error_handling(
    harness_arn=harness_arn,
    session_id=invalid_session,
    prompt="Search for 'test query'",
    tools=[
        {
            "type": "remote_mcp",
            "name": "invalid",
            "config": {"remoteMcp": {"url": "https://invalid-mcp-url.example.com/mcp"}},
        }
    ],
    timeout=60,
)

print(f"\nErrors encountered: {result['errors']}")
```

## Part 6: Best Practices for MCP Integration

### 1. **Always set timeouts**
MCP calls can take time, especially for web searches. Set appropriate `timeoutSeconds`:
```python
timeoutSeconds=300  # 5 minutes for complex searches
```

### 2. **Handle authentication securely**
```python
# ❌ DON'T: Hardcode API keys
api_key = "sk-abc123..."

# ✅ DO: Use environment variables
api_key = os.getenv("MCP_API_KEY")

# ✅ BETTER: Use AWS Secrets Manager
import boto3
secrets = boto3.client('secretsmanager')
api_key = secrets.get_secret_value(SecretId='mcp-api-key')['SecretString']
```

### 3. **Provide clear tool names**
```python
# ❌ Generic name
"name": "search"

# ✅ Descriptive name
"name": "exa_web_search"
```

### 4. **Monitor and log MCP usage**
Track which tools are being used and their success rates:
```python
tool_uses = []
for event in response["stream"]:
    if "contentBlockStart" in event:
        tool_name = event["contentBlockStart"].get("start", {}).get("toolUse", {}).get("name")
        if tool_name:
            tool_uses.append(tool_name)
            print(f"Tool used: {tool_name}")
```

### 5. **Test MCP servers independently**
Before integrating with Harness, verify the MCP server works:
```bash
curl -X POST https://mcp.exa.ai/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/list"}'
```

### 6. **Combine MCP with other tools**
MCP tools work great with built-in Harness tools:
```python
tools=[
    {"type": "remote_mcp", "name": "exa", "config": {...}},
    {"type": "agentcore_code_interpreter", "name": "code_interpreter"},
    {"type": "agentcore_browser", "name": "browser"},
]
```

## Part 7: Advanced Example — Research Assistant

Let's build a complete research assistant that:
1. Searches for information using MCP
2. Analyzes the results
3. Saves a structured report

This demonstrates a real-world MCP use case.

```python
research_session = str(uuid.uuid4()).upper()
print(f"Research session: {research_session}\n")

research_prompt = """
Research topic: "Generative AI trends in enterprise adoption for 2024"

Please:
1. Search for recent articles and reports about enterprise AI adoption
2. Identify the top 5 trends
3. For each trend, provide:
   - Brief description
   - Key statistics or data points
   - Notable companies or use cases
4. Save the report as a structured JSON file at /tmp/ai_trends_report.json

Format the JSON as:
{
  "topic": "...",
  "date": "...",
  "trends": [
    {
      "name": "...",
      "description": "...",
      "statistics": [...],
      "examples": [...]
    }
  ],
  "sources": [...]
}
"""

response = client.invoke_harness(
    harnessArn=harness_arn,
    runtimeSessionId=research_session,
    messages=[{"role": "user", "content": [{"text": research_prompt}]}],
    tools=[
        {
            "type": "remote_mcp",
            "name": "exa",
            "config": {"remoteMcp": {"url": "https://mcp.exa.ai/mcp"}},
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
            print(f"\n[Tool: {start['toolUse'].get('name', '?')}]", flush=True)
    elif "contentBlockDelta" in event:
        delta = event["contentBlockDelta"].get("delta", {})
        if "text" in delta:
            print(delta["text"], end="", flush=True)
    elif "messageStop" in event:
        print("\n")
```

### Retrieve and display the research report

```python
import json

# Fetch the report from the agent's VM
report_data = ""
resp = client.invoke_agent_runtime_command(
    agentRuntimeArn=harness_arn,
    runtimeSessionId=research_session,
    body={"command": "cat /tmp/ai_trends_report.json 2>/dev/null || echo '{}'"},
)

for event in resp["stream"]:
    if "chunk" in event:
        chunk = event["chunk"]
        if "contentDelta" in chunk and "stdout" in chunk["contentDelta"]:
            report_data += chunk["contentDelta"]["stdout"]

try:
    report = json.loads(report_data)
    print("✅ Research Report Generated:\n")
    print(json.dumps(report, indent=2))
except json.JSONDecodeError:
    print("⚠️  Could not parse report as JSON")
    print(f"Raw output:\n{report_data}")
```

## Summary

You've learned how to:
- ✅ Connect Harness agents to MCP servers
- ✅ Use multiple MCP tools in a single invocation
- ✅ Handle authentication and headers
- ✅ Implement error handling for MCP calls
- ✅ Follow best practices for MCP integration
- ✅ Build a complete research assistant using MCP

### Next Steps:
1. Explore other MCP servers (Brave Search, custom MCP servers, etc.)
2. Build custom MCP servers for your own APIs
3. Combine MCP with other Harness features (Memory, Browser, Code Interpreter)
4. Monitor MCP usage and costs in CloudWatch

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
