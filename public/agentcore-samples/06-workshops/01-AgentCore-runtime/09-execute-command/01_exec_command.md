# AWS Bedrock AgentCore - Execute Command Demo

This notebook demonstrates how to:
1. Create and deploy a Bedrock AgentCore agent
2. Invoke the agent with standard prompts
3. Execute system commands directly in the agent runtime using [`invoke_agent_runtime_command`](https://docs.aws.amazon.com/boto3/latest/reference/services/bedrock-agentcore/client/invoke_agent_runtime_command.html)

### Tutorial Details

| Information         | Details                                                   |
|:--------------------|:----------------------------------------------------------|
| Tutorial type       | Execute command on Runtime                                |
| Tool type           | HTTP server                                               |
| Tutorial components | Hosting on AgentCore Runtime                              |
| Tutorial vertical   | Cross-vertical                                            |
| Example complexity  | Medium                                                    |
| SDK used            | Amazon BedrockAgentCore Python SDK                        |

## Step 1: Install Dependencies

Install the required Python packages using uv package manager.

## Quick Start Guide

**Running this notebook:**
1. Run cells sequentially from top to bottom
2. After creating the agent files (Step 2), **restart the kernel**
3. Continue with Step 3 onwards

**What you'll learn:**
- How to deploy a Bedrock AgentCore agent from a Jupyter notebook
- How to invoke agents using different methods
- **How to execute shell commands directly in the agent runtime** ⭐

```python
!uv pip install -Uq -r requirements.txt
```

**⚠️ Important**

- After running the `pip install cell`, restart the kernel to ensure the libraries are correctly installed.
- `invoke_agent_runtime_command` was introduced in boto3 version `1.42.69`**`, so make sure you're running with proper version.

```python
!uv pip freeze | grep -i boto3
```

## Step 2: Define Agent Code

Create the agent entry point file. This agent uses:
- **BedrockAgentCoreApp**: The framework for building AgentCore applications
- **Strands Agent**: The AI agent that will process user prompts

```python
%%writefile agents/agent.py
# Import required libraries for Bedrock AgentCore
from bedrock_agentcore import BedrockAgentCoreApp
from strands import Agent

# Initialize the AgentCore application
app = BedrockAgentCoreApp()

# Create the AI agent instance
agent = Agent()

@app.entrypoint
def invoke(payload, context):
    """
    Main entry point for the agent.
    
    Args:
        payload: Dictionary containing the 'prompt' key with user input
        context: Runtime context information
    
    Returns:
        Dictionary with the agent's response message
    """
    # Extract the user prompt from the payload
    user_message = payload.get("prompt", "Hello!")
    
    # Process the message with the agent
    result = agent(user_message)
    
    # Return the response in the expected format
    return {"result": result.message}

if __name__ == "__main__":
    # Run the agent application
    app.run()
```

```python
%%writefile agents/requirements.txt
bedrock-agentcore
strands-agents
```

## Step 3: Setup AWS Configuration

Initialize AWS clients and retrieve account information needed for agent deployment.

```python
import boto3
from boto3.session import Session

# Initialize boto3 session with default credentials
boto_session = Session()

# Get AWS account information
sts = boto3.client("sts")
response = sts.get_caller_identity()
account_id = response["Account"]
region = boto_session.region_name

print(f"AWS Account ID: {account_id}")
print(f"AWS Region: {region}")

# Create Bedrock AgentCore client for invoking agents
agentcore_client = boto3.client("bedrock-agentcore", region_name=region)
```

## Step 4: Configure and Deploy Agent

Configure the agent deployment settings. The toolkit handles:
- Creating IAM execution roles automatically
- Setting up ECR repository for container images
- Deploying directly from Python code (no Docker required)

```python
from bedrock_agentcore_starter_toolkit import Runtime

# Initialize the Runtime toolkit
agentcore_runtime_agent = Runtime()

# Define a unique name for the agent
aws_agent_name = "exec_cmd_sample"

# Configure the agent deployment with the following settings:
# - entrypoint: Path to the agent code file
# - auto_create_execution_role: Automatically create IAM role with necessary permissions
# - auto_create_ecr: Automatically create ECR repository for container images
# - requirements_file: Path to Python dependencies
# - region: AWS region for deployment
# - agent_name: Unique identifier for the agent
# - protocol: Communication protocol (HTTP for REST-like interactions)
# - deployment_type: Deploy Python code directly without Docker
# - runtime_type: Python version for the runtime environment
response_aws_agent = agentcore_runtime_agent.configure(
    entrypoint="agents/agent.py",
    auto_create_execution_role=True,
    auto_create_ecr=True,
    requirements_file="agents/requirements.txt",
    region=region,
    agent_name=aws_agent_name,
    protocol="HTTP",
    deployment_type="direct_code_deploy",
    runtime_type="PYTHON_3_13",
)

print("Configuration completed:", response_aws_agent)
```

```python
# Deploy the agent to AWS
# This process:
# 1. Creates/updates IAM execution role
# 2. Packages the agent code and dependencies
# 3. Uploads to S3
# 4. Deploys to Bedrock AgentCore Runtime
# 5. Configures CloudWatch Logs and X-Ray tracing
launch_result = agentcore_runtime_agent.launch()

print("Launch completed:", launch_result.agent_arn)

# Store the agent ARN for later invocations
cmd_agent_arn = launch_result.agent_arn
```

```python
# Check the deployment status
# The agent should be in "READY" state before it can be invoked
status_response = agentcore_runtime_agent.status()
status = status_response.endpoint["status"]

print(f"Final status: {status}")
```

## Step 5: Test Agent Invocation

Test the deployed agent using two methods:
1. **High-level SDK method**: Using the toolkit's simplified invoke method
2. **Direct boto3 method**: Using AWS SDK for more control over the invocation

```python
# Method 1: Invoke using the high-level toolkit method
# This is the simplest way to invoke the agent
invoke_response = agentcore_runtime_agent.invoke({"prompt": "What can u do?"})
invoke_response["response"]
```

## Step 6: Execute System Commands

The **key feature**: Execute arbitrary system commands directly in the agent runtime environment.

This uses `invoke_agent_runtime_command` which:
- Runs shell commands in the agent's containerized runtime
- Streams stdout/stderr output in real-time
- Returns exit codes and execution status
- Useful for debugging, file operations, or running scripts in the agent environment

```python
# Execute a system command in the agent runtime
# Command: List files in /tmp directory with detailed information
response = agentcore_client.invoke_agent_runtime_command(
    agentRuntimeArn=cmd_agent_arn,
    body={
        "command": '/bin/bash -c "ls -l /tmp"',  # Shell command to execute
        "timeout": 300,  # Timeout in seconds (5 minutes)
    },
)

# Stream the command output
for event in response["stream"]:
    if "chunk" in event:
        chunk = event["chunk"]
        print(chunk)
```

## Step 7: Cleanup (Optional)

Clean up AWS resources to avoid ongoing charges. This will:
- Delete the Bedrock AgentCore runtime

**⚠️ Warning**: This is destructive and cannot be undone. Only run if you're done testing.

```python
from pathlib import Path
from bedrock_agentcore_starter_toolkit.operations.runtime.destroy import (
    destroy_bedrock_agentcore,
)

print("🚀 Starting Runtime cleanup...")

# Destroy the agent runtime and all associated resources
# This reads the configuration from the .bedrock_agentcore.yaml file
destroy_bedrock_agentcore(config_path=Path(".bedrock_agentcore.yaml"), agent_name=aws_agent_name)

print("✅ Cleanup completed successfully!")
```

---

## Summary

This notebook demonstrated:

1. ✅ **Agent Creation**: Deployed a Bedrock AgentCore agent with Python code
2. ✅ **Agent Invocation**: Called the agent using both high-level and low-level methods
3. ✅ **Command Execution**: Used `invoke_agent_runtime_command` to execute shell commands in the runtime environment

### Key Takeaways

- **Event Streaming**: The `invoke_agent_runtime_command` returns an event stream with three event types:
  - `contentStart`: Indicates command execution has begun
  - `contentDelta`: Contains streaming stdout/stderr output
  - `contentStop`: Provides final exit code and status
  
- **Use Cases**: This feature is useful for:
  - Running diagnostic commands
  - Executing data processing scripts
  - File system operations in the agent environment
  - Integration testing and debugging
