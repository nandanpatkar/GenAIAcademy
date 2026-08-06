# Get started with AgentCore Gateway - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-quick-start.html

---

# Get started with AgentCore Gateway

In this quick start guide you’ll learn how to set up a gateway and integrate it into your agents using the AgentCore CLI. For more comprehensive guides and examples, see the [Amazon Bedrock AgentCore Gateway GitHub repository](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-features/07-centralize-and-govern-your-ai-infrastructure/01-gateway>).

###### Note

The AgentCore CLI provides both commands and an interactive TUI wizard for managing AgentCore Gateway resources. For the full AWS SDK API reference, see [AgentCore Control Plane operations](<https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/bedrock-agentcore-control.html>).

###### Topics

  * Prerequisites

  * Step 1: Setup and install

  * Step 2: Create gateway

  * Step 3: Run the setup

  * Step 4: Use the gateway with an agent

  * What you’ve built

  * Troubleshooting

  * Quick validation

  * Cleanup

  * Next steps


## Prerequisites

Before starting, make sure you have the following:

  * **AWS Account** with credentials configured. To configure credentials, you can install and use the AWS Command Line Interface by following the steps at [Getting started with the AWS CLI](<https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html>).

  * **Node.js 18+** installed (for the AgentCore CLI).

  * **Python 3.10+** installed (for the agent script).

  * **IAM permissions** for creating roles, Lambda functions, and using Amazon Bedrock AgentCore.

  * **Model Access** – Enable Anthropic’s Claude Sonnet 3.7 in the Amazon Bedrock console (or another model for the demo agent)


## Step 1: Setup and install

Install the AgentCore CLI globally:

```bash
npm install -g @aws/agentcore
```
Create a new AgentCore project with an agent and a gateway:

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore create --name MyGatewayAgent --defaults
```
 

The `--defaults` flag creates a project with a default Python Strands agent. Alternatively, omit `--defaults` and `--name` to use the interactive wizard to select your preferred framework.


Interactive
    

  1. You can also run `agentcore create` without flags to use the interactive wizard. The wizard guides you through selecting a project name, agent framework, model provider, and other options.


## Step 2: Create gateway

Add a gateway and a target to your project using the AgentCore CLI:

###### Example

AgentCore CLI
    

  1. 
```bash
# Add a gateway with no inbound auth (simplest for getting started)
agentcore add gateway --name TestGateway --authorizer-type NONE --runtimes MyGatewayAgent

# Add a Lambda function target
agentcore add gateway-target --name TestLambdaTarget --type lambda-function-arn \
  --lambda-arn <YOUR_LAMBDA_ARN> \
  --tool-schema-file tools.json \
  --gateway TestGateway
```
 


Interactive
    

  1. Run `agentcore` to open the TUI, then select **add** and choose **Gateway** :

  2. Enter the gateway name:

![Gateway wizard: enter name](/agentcore/images/gateway-add-name.png)

  3. Select the authorizer type. For this quickstart, choose **NONE** :

![Gateway wizard: select NONE authorizer](/agentcore/images/gateway-add-auth-none.png)

  4. Configure advanced options or accept the defaults:

![Gateway wizard: advanced configuration](/agentcore/images/gateway-add-advanced.png)

  5. Review the configuration and press **Enter** to confirm:

![Gateway wizard: review configuration](/agentcore/images/gateway-add-confirm.png)

Next, select **add** again and choose **Gateway Target** to add a Lambda function target:

  6. Enter the target name.

  7. Select **Lambda function** as the target type:

![Gateway target wizard: select Lambda function](/agentcore/images/gateway-target-type-lambda.png)

  8. Enter the Lambda ARN and tool schema file path, then confirm.


To use JWT-based authorization instead, specify `--authorizer-type CUSTOM_JWT` with your OAuth discovery URL:

###### Example

AgentCore CLI
    

  1. 
```bash
agentcore add gateway --name TestGateway \
  --authorizer-type CUSTOM_JWT \
  --discovery-url https://cognito-idp.us-east-1.amazonaws.com/<POOL_ID>/.well-known/openid-configuration \
  --allowed-audience <CLIENT_ID> \
  --runtimes MyGatewayAgent
```
 


Interactive
    

  1. Run `agentcore` to open the TUI, then select **add** and choose **Gateway** . When prompted for the authorizer type, select **Custom JWT** :

  2. Enter the gateway name:

![Gateway wizard: enter name](/agentcore/images/gateway-add-name.png)

  3. Select **Custom JWT** as the authorizer type:

![Gateway wizard: select Custom JWT authorizer](/agentcore/images/gateway-add-auth-jwt.png)

  4. Enter the OAuth discovery URL and allowed audience when prompted.

  5. Configure advanced options or accept the defaults:

![Gateway wizard: advanced configuration](/agentcore/images/gateway-add-advanced.png)

  6. Review the configuration and press **Enter** to confirm:

![Gateway wizard: review configuration](/agentcore/images/gateway-add-confirm.png)


## Step 3: Run the setup

Deploy your project to AWS:

```bash
agentcore deploy
```
The CLI synthesizes a AWS CDK stack and deploys your gateway, targets, and agent to Amazon Bedrock AgentCore. This takes about 2-3 minutes.

## Step 4: Use the gateway with an agent

Retrieve your gateway URL using the AgentCore CLI:

```bash
agentcore status
```
Create a new file called `run_agent.py` and insert the following code. Install the Python dependencies first:


```bash
pip install strands-agents mcp
```
 
```python
"""
Agent script to test the Gateway
Run this after setup: python run_agent.py
"""

from strands import Agent
from strands.models import BedrockModel
from strands.tools.mcp.mcp_client import MCPClient
from mcp.client.streamable_http import streamablehttp_client
import json
import sys

def create_streamable_http_transport(mcp_url: str):
    return streamablehttp_client(mcp_url)

def get_full_tools_list(client):
    """Get all tools with pagination support"""
    more_tools = True
    tools = []
    pagination_token = None
    while more_tools:
        tmp_tools = client.list_tools_sync(pagination_token=pagination_token)
        tools.extend(tmp_tools)
        if tmp_tools.pagination_token is None:
            more_tools = False
        else:
            more_tools = True
            pagination_token = tmp_tools.pagination_token
    return tools

def run_agent():
    # Get the gateway URL from agentcore status
    gateway_url = "<YOUR_GATEWAY_URL>"  # Replace with URL from 'agentcore status'

    # Model configuration - change if needed
    model_id = "anthropic.claude-3-7-sonnet-20250219-v1:0"

    print("Starting AgentCore Gateway Test Agent")
    print(f"Gateway URL: {gateway_url}")
    print(f"Model: {model_id}")
    print("-" * 60)

    # Setup Bedrock model
    bedrockmodel = BedrockModel(
        model_id=model_id,
        streaming=True,
    )

    # Setup MCP client (no auth token needed for NONE authorizer)
    mcp_client = MCPClient(lambda: create_streamable_http_transport(gateway_url))

    with mcp_client:
        # List available tools
        tools = get_full_tools_list(mcp_client)
        print(f"\nAvailable tools: {[tool.tool_name for tool in tools]}")
        print("-" * 60)

        # Create agent
        agent = Agent(model=bedrockmodel, tools=tools)

        # Interactive loop
        print("\nInteractive Agent Ready!")
        print("Try asking: 'What's the weather in Seattle?'")
        print("Type 'exit', 'quit', or 'bye' to end.\n")

        while True:
            user_input = input("You: ")
            if user_input.lower() in ["exit", "quit", "bye"]:
                print("Goodbye!")
                break

            print("\nThinking...\n")
            response = agent(user_input)
            print(f"\nAgent: {response.message.get('content', response)}\n")

if __name__ == "__main__":
    run_agent()
```
 

### Run your agent

Test your gateway by running the agent and interacting with the tools.

```text
python run_agent.py
```
That’s it! The agent will start and you can ask questions like:

  * "What’s the weather in Seattle?"

  * "What time is it in New York?"


## What you’ve built

Through this getting started tutorial, you’ve created the following resources:

  * **MCP Server (Gateway)** : A managed endpoint at `https://gateway-id.gateway.bedrock-agentcore.region.amazonaws.com/mcp`

  * **Lambda tools** : Mock functions that return test data (weather: "72°F, Sunny", time: "2:30 PM")

  * **AI agent** : Claude-powered assistant that can discover and use your tools


## Troubleshooting

The following table shows some possible issues and their solutions:

Issue | Solution  
---|---  
"No module named 'strands'" |  Run: `pip install strands-agents`  
"Model not enabled" |  Enable Claude Sonnet 3.7 in Bedrock console → Model access  
"AccessDeniedException" |  Check IAM permissions for bedrock-agentcore:*  
Gateway not responding |  Wait 30-60 seconds after creation for DNS propagation  
  
## Quick validation

Run the following commands in a terminal to check that your gateway is working.

```bash
# Check your Gateway is working
curl -X POST YOUR_GATEWAY_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'

# Watch live logs
aws logs tail /aws/bedrock-agentcore/gateways/YOUR_GATEWAY_ID --follow
```
## Cleanup

To remove the gateway and its targets from your project:

```bash
agentcore remove gateway --name TestGateway
```
To remove all resources and redeploy:

```bash
agentcore remove all
agentcore deploy
```
## Next steps

  * **Custom Lambda Tools** : Create Lambda functions with your business logic

  * **Add Your Own APIs** : Extend your Gateway with OpenAPI specifications for real services

  * **Production Setup** : Configure VPC endpoints, custom domains, and monitoring



