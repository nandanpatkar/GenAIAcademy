# Hosting A2A Agent on Amazon Bedrock AgentCore Runtime - AWS IAM Inbound Authentication

## Overview

In this tutorial, we will learn how to host an A2A (Agent-to-Agent) agent on Amazon Bedrock AgentCore Runtime using AWS IAM for inbound authentication.

The [A2A protocol](https://a2a-protocol.org/dev/specification/) is an open standard designed to facilitate communication between independent AI agent systems. While A2A traditionally uses OAuth/JWT tokens for authentication, AgentCore Runtime allows you to configure AWS IAM credentials for inbound requests, addressing enterprise security requirements.

### Tutorial Details

| Information         | Details                                                   |
|:--------------------|:----------------------------------------------------------|
| Tutorial type       | Hosting Agent                                             |
| Protocol            | A2A (Agent-to-Agent)                                      |
| Authentication      | AWS IAM (SigV4)                                           |
| Tutorial components | Hosting A2A agent on AgentCore Runtime with IAM auth     |
| Tutorial vertical   | Cross-vertical                                            |
| Example complexity  | Intermediate                                              |
| SDK used            | Amazon BedrockAgentCore Python SDK and Strands Agents    |

### Tutorial Architecture

In this tutorial, we will deploy an A2A agent to AgentCore Runtime with IAM authentication.

For demonstration purposes, we will use a simple agent with 2 tools: `greet_user` and `get_agent_info`

### Tutorial Key Features

* Creating A2A agents with Strands framework
* Testing A2A agents locally
* Hosting A2A agents on Amazon Bedrock AgentCore Runtime
* Invoking deployed A2A agents with IAM authentication (SigV4)

## Prerequisites

To execute this tutorial you will need:
* Python 3.10+
* AWS credentials configured
* Amazon Bedrock AgentCore SDK
* Strands Agents framework
* Running Docker daemon

```python
!pip install --force-reinstall -U -r requirements.txt --quiet
```

```python
from bedrock_agentcore_starter_toolkit import Runtime
from bedrock_agentcore_starter_toolkit.operations.runtime import (
    destroy_bedrock_agentcore,
)
from boto3.session import Session
from pathlib import Path
import os
```

```python
boto_session = Session()
region = boto_session.region_name

agentcore_control_client = boto_session.client("bedrock-agentcore-control", region_name=region)

agent_name = "a2a_agent_iam"
```

## Understanding A2A (Agent-to-Agent Protocol)

A2A is a protocol that allows AI agents to communicate with each other. Key concepts:

* **Agent Card**: Metadata describing the agent's capabilities
* **Message Exchange**: Structured communication between agents
* **Tools**: Functions that agents can expose to other agents
* **IAM Authentication**: Using AWS SigV4 for secure authentication

AgentCore Runtime expects A2A agents to be hosted on `0.0.0.0:9000/` as the default path.

### Project Structure

```
agentcore-a2a-iam-sample/
├── agent.py              # Main A2A agent code
├── client.py             # Client for testing with IAM auth
├── requirements.txt      # Dependencies
└── hosting_a2a_iam_auth.ipynb  # This notebook
```

## Review Agent Code

Let's review the agent code that we'll deploy:

```python
!cat agent.py
```

### What This Code Does

* **Strands Agent**: Creates an agent using the Strands framework
* **@tool**: Decorator that turns Python functions into agent tools
* **A2AServer**: Wraps the agent to support A2A protocol
* **FastAPI**: Provides HTTP server for the agent
* **Tools**: Two simple tools demonstrating agent capabilities

## Optional: Testing Locally

Before deploying to AgentCore Runtime, you can test the agent locally:

1. **Terminal 1**: Start the agent
   ```bash
   python agent.py
   ```
   
2. **Terminal 2**: Test the agent card
   ```bash
   curl http://localhost:9000/.well-known/agent-card.json | jq .
   ```

3. **Terminal 2**: Send a test message
   ```bash
   curl -X POST http://localhost:9000 \
     -H "Content-Type: application/json" \
     -d '{
       "jsonrpc": "2.0",
       "id": "req-001",
       "method": "message/send",
       "params": {
         "message": {
           "role": "user",
           "parts": [{
             "kind": "text",
             "text": "Hello! What can you do?"
           }],
           "messageId": "test-001"
         }
       }
     }' | jq .
   ```

## Configuring AgentCore Runtime Deployment

Next we will use the starter toolkit to configure the AgentCore Runtime deployment. We will configure:

* Entrypoint: `agent.py`
* Auto-create execution role
* Auto-create ECR repository
* Protocol: A2A
* Requirements file

During the configure step, your Dockerfile will be generated based on your application code.

```python
print(f"Using AWS region: {region}")

required_files = ["agent.py", "requirements.txt"]
for file in required_files:
    if not os.path.exists(file):
        raise FileNotFoundError(f"Required file {file} not found")
print("All required files found ✓")

agentcore_runtime = Runtime()

print("Configuring AgentCore Runtime...")
response = agentcore_runtime.configure(
    entrypoint="agent.py",
    auto_create_execution_role=True,
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    region=region,
    protocol="A2A",
    agent_name=agent_name,
)
print("Configuration completed ✓")
```

## Launching A2A Agent to AgentCore Runtime

Now that we have a Dockerfile, let's launch the A2A agent to the AgentCore Runtime. This will:

1. Create the Amazon ECR repository
2. Build and push the Docker image
3. Create the AgentCore Runtime
4. Deploy the agent

This may take several minutes...

```python
print("Launching A2A agent to AgentCore Runtime...")
print("This may take several minutes...")
launch_result = agentcore_runtime.launch()
print("Launch completed ✓")
print(f"Agent ARN: {launch_result.agent_arn}")
print(f"Agent ID: {launch_result.agent_id}")
```

## Testing Your Deployed A2A Agent

Now let's test our deployed A2A agent using the client with IAM authentication.

The client will:
1. Use AWS credentials to sign requests with SigV4
2. Fetch the agent card
3. Send test messages to the agent
4. Display responses

```python
import os

os.environ["AGENT_ARN"] = launch_result.agent_arn

from client import *

# Test with a custom message
custom_message = "Please greet me. My name is Bob."
await test_agent(launch_result.agent_arn, custom_message)
```

## Understanding IAM Authentication

### How It Works

1. **Client Side**: The client uses AWS credentials to sign HTTP requests with SigV4
2. **AgentCore Runtime**: Validates the signature using IAM
3. **Agent**: Receives authenticated requests

### SigV4 Authentication Flow

```python
# Client creates SigV4 auth
auth = SigV4HTTPXAuth(credentials, "bedrock-agentcore", region)

# Auth signs each request automatically
async with httpx.AsyncClient(auth=auth) as client:
    response = await client.post(url, json=data)
```

To view the full client code run the following cell:

```python
!cat client.py
```

## Next Steps

Now that you have successfully deployed an A2A agent with IAM authentication, you can:

1. **Add More Tools**: Extend your agent with additional tools
2. **Multi-Agent Systems**: Create orchestrator agents that call this agent
3. **Custom IAM Policies**: Create fine-grained IAM policies for agent access
4. **Integration**: Integrate with other AWS services

### Related Tutorials

* [Hosting MCP Server with IAM Auth](../02-hosting-MCP-server/hosting_mcp_server_iam_auth.ipynb)
* [Hosting A2A with JWT Auth](../05-hosting-a2a/01-a2a-getting-started-agentcore-strands.ipynb)
* [Multi-Agent Systems](../05-hosting-a2a/02-a2a-deploy-orchestrator.ipynb)

## Cleanup (Optional)

If you want to clean up the resources created during this tutorial, run the following cells:

```python
destroy_bedrock_agentcore(config_path=Path(".bedrock_agentcore.yaml"))
print("✓ AgentCore Runtime resources deleted")
```

## Conclusion

In this tutorial, you learned how to:

* Create an A2A agent using Strands framework
* Deploy the agent to AgentCore Runtime
* Configure IAM authentication for inbound requests
* Test the agent using SigV4-signed requests
