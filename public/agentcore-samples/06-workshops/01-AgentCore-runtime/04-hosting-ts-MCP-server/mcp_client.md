# Testing MCP Client with Typescript MCP Server on Amazon Bedrock AgentCore Runtime

## Overview

In this tutorial we will learn how to host a TypeScript-based MCP (Model Context Protocol) server using the Amazon Bedrock AgentCore runtime environment.

### Tutorial Details

| Information         | Details                                                   |
|:--------------------|:----------------------------------------------------------|
| Tutorial type       | Hosting typescript MCP server                             |
| Tool type           | MCP server                                                |
| Tutorial components | Hosting typescript MCP server on AgentCore Runtime        |
| Tutorial vertical   | Cross-vertical                                            |
| Example complexity  | Easy                                                      |
| SDK used            | Anthropic's typescript SDK for MCP                        |


### Tutorial Overview

1. The AgentCore Runtime authentication will use Amazon Cognito to provide JWT tokens for accessing our deployed MCP server.

2. The mcp server is written in typescript and will be [deployed using custom flow](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/getting-started-custom.html)

3. The mcp client is written in python.
   _Note the mcp client can be written in any language._

## Prerequisites

To execute this tutorial you will need:
- Node.js v22 or later  (MCP server)
- Python 3.10+ (MCP client)
- Docker (for containerization)  
- Amazon ECR (Elastic Container Registry) for storing Docker images  
- AWS account with access to Bedrock AgentCore  
- MCP (Model Context Protocol) library
- Docker running

```python
#!uv add -r requirements.txt --active
```

## Understanding MCP (Model Context Protocol)

MCP is a protocol that allows AI models to securely access external data and tools. Key concepts:

* **Tools**: Functions that the AI can call to perform actions
* **Prompts**: Prompts allow servers to provide structured messages and instructions for interacting with LLM
* **Streamable HTTP**: Transport protocol used by AgentCore Runtime
* **Session Isolation**: Each client gets isolated sessions via `Mcp-Session-Id` header
* **Stateless Operation**: Servers must support stateless operation for scalability

AgentCore Runtime expects MCP servers to be hosted on `0.0.0.0:8000/mcp` as the default path.

## Step 1: Setting up Amazon Cognito for Authentication

AgentCore Runtime requires authentication. We'll use Amazon Cognito to provide JWT tokens for accessing our deployed MCP server.

```python
import sys
import os

# Get the current notebook's directory
current_dir = os.path.dirname(os.path.abspath("__file__" if "__file__" in globals() else "."))

utils_dir = os.path.join(current_dir, "..")
utils_dir = os.path.abspath(utils_dir)

# Add to sys.path
sys.path.insert(0, utils_dir)
print("sys.path[0]:", sys.path[0])

from utils import create_agentcore_role, setup_cognito_user_pool
```

```python
print("Setting up Amazon Cognito user pool...")
cognito_config = setup_cognito_user_pool()
print("Cognito setup completed ✓")
print(f"User Pool ID: {cognito_config.get('user_pool_id', 'N/A')}")
print(f"Client ID: {cognito_config.get('client_id', 'N/A')}")
```

## Step 2: Create IAM Execution Role

Before starting, let's create an IAM role for our AgentCore Runtime. This role provides the necessary permissions for the runtime to operate.

```python
tool_name = "mcp_server_ac"
print(f"Creating IAM role for {tool_name}...")
agentcore_iam_role = create_agentcore_role(agent_name=tool_name)
print("IAM role created ✓")
print(f"Role ARN: {agentcore_iam_role['Role']['Arn']}")
```

## Step 3: Creating MCP Server

Now let's create our a typescript MCP server with two simple tools and one prompt. Navigate to the src folder under this tutorial.

1. Install dependencies

```
npm install
```

2. Set up AWS credentials
```
aws configure
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1
```

3. Start server (running locally)
```
npm run start
```

## Step 4: MCP Server Deployment through Docker

Note: This are manual steps for deploying an agent or mcp server without the starter toolkit 

https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/getting-started-custom.html

1. Create ECR Repository
```
aws ecr create-repository --repository-name mcp-server --region us-east-1
```
2. Build and Push Image to ECR
```
# Get login token
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin [account-id].dkr.ecr.us-east-1.amazonaws.com

docker buildx --platform linux/arm64 \
  -t [account-id].dkr.ecr.us-east-1.amazonaws.com/mcp-server:latest --push .
```

3. Deploy to Bedrock AgentCore

    - Go to AWS Console → Bedrock → AgentCore → Create Agent
    - Choose MCP as the protocol
    - Configure Agent Runtime:
        - Image URI: [account-id].dkr.ecr.us-east-1.amazonaws.com/mcp-server:latest
        - Set IAM Permissions for Bedrock model access
        - Deploy and test in the Agent Sandbox
    - For Discovery url: Select the url from above, cognito_config['discovery_url']
    - For Client id: Select the client id from above, cognito_config['client_id']
    - For execution role: Select the arn from above, agentcore_iam_role['Role']['Arn']

## Step 5: Storing Configuration for Remote Access

Before we can invoke our deployed MCP server, let's store the Agent ARN (fetch the arn from Step 4) and Cognito configuration in AWS Systems Manager Parameter Store and AWS Secrets Manager for easy retrieval:

```python
import boto3
import json

boto_session = Session()
region = boto_session.region_name

ssm_client = boto3.client("ssm", region_name=region)
secrets_client = boto3.client("secretsmanager", region_name=region)

try:
    cognito_credentials_response = secrets_client.create_secret(
        Name="mcp_server/cognito/credentials",
        Description="Cognito credentials for MCP server",
        SecretString=json.dumps(cognito_config),
    )
    print("✓ Cognito credentials stored in Secrets Manager")
except secrets_client.exceptions.ResourceExistsException:
    secrets_client.update_secret(
        SecretId="mcp_server/cognito/credentials",
        SecretString=json.dumps(cognito_config),
    )
    print("✓ Cognito credentials updated in Secrets Manager")

# NOTE: Add your agent arn that you created in Step 4
agent_arn_response = ssm_client.put_parameter(
    Name="/mcp_server/runtime/agent_arn",
    Value="Add your agent arn that you created in step 4",
    Type="String",
    Description="Agent ARN for MCP server",
    Overwrite=True,
)
print("✓ Agent ARN stored in Parameter Store")
```

## Step 6: Creating Remote Testing Client

Now let's create a client to test our deployed MCP server. This client will retrieve the necessary credentials from AWS and connect to the deployed server:

```python
%%writefile my_mcp_client_remote.py
import asyncio
import boto3
import json
import sys
from boto3.session import Session

from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

async def main():
    boto_session = Session()
    region = boto_session.region_name
    
    print(f"Using AWS region: {region}")
    
    try:
        ssm_client = boto3.client('ssm', region_name=region)
        agent_arn_response = ssm_client.get_parameter(Name='/mcp_server/runtime/agent_arn')
        agent_arn = agent_arn_response['Parameter']['Value']
        print(f"Retrieved Agent ARN: {agent_arn}")
     
        secrets_client = boto3.client('secretsmanager', region_name=region)
        response = secrets_client.get_secret_value(SecretId='mcp_server/cognito/credentials')
        secret_value = response['SecretString']
        parsed_secret = json.loads(secret_value)
        bearer_token = parsed_secret['bearer_token']
        print("✓ Retrieved bearer token from Secrets Manager")
        
    except Exception as e:
        print(f"Error retrieving credentials: {e}")
        sys.exit(1)
    
    if not agent_arn or not bearer_token:
        print("Error: BEARER_TOKEN not retrieved properly")
        sys.exit(1)
    

    encoded_arn = agent_arn.replace(':', '%3A').replace('/', '%2F')
    mcp_url = f"https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{encoded_arn}/invocations?qualifier=DEFAULT"
    headers = {
        "authorization": f"Bearer {bearer_token}",
        "Content-Type": "application/json"
    }
    
    print(f"\nConnecting to: {mcp_url}")
    print("Headers configured ✓")

    try:
        async with streamablehttp_client(mcp_url, headers, timeout=120, terminate_on_close=False) as (
            read_stream,
            write_stream,
            _,
        ):
            async with ClientSession(read_stream, write_stream) as session:
                print("\n🔄 Initializing MCP session...")
                await session.initialize()
                print("✓ MCP session initialized")
                
                print("\n🔄 Listing available tools...")
                tool_result = await session.list_tools()
                
                print("\n📋 Available MCP Tools:")
                print("=" * 50)
                for tool in tool_result.tools:
                    print(f"🔧 {tool.name}")
                    print(f"   Description: {tool.description}")
                    if hasattr(tool, 'inputSchema') and tool.inputSchema:
                        properties = tool.inputSchema.get('properties', {})
                        if properties:
                            print(f"   Parameters: {list(properties.keys())}")
                    print()
                
                print(f"✅ Successfully connected to MCP server!")
                print(f"Found {len(tool_result.tools)} tools available.")
                
    except Exception as e:
        print(f"❌ Error connecting to MCP server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
```

## Step 7: Testing Your Deployed MCP Server

Let's test our deployed MCP server using the remote client:

```python
print("Testing deployed MCP server...")
print("=" * 50)
!python my_mcp_client_remote.py
```

## Step 8: Invoking MCP Tools Remotely

Now let's create an enhanced client that not only lists tools but also invokes them to demonstrate the full MCP functionality:

```python
%%writefile invoke_mcp_tools.py
import asyncio
import boto3
import json
import sys
from boto3.session import Session

from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

async def main():
    boto_session = Session()
    region = boto_session.region_name
    
    print(f"Using AWS region: {region}")
    
    try:
        ssm_client = boto3.client('ssm', region_name=region)
        agent_arn_response = ssm_client.get_parameter(Name='/mcp_server/runtime/agent_arn')
        agent_arn = agent_arn_response['Parameter']['Value']
        print(f"Retrieved Agent ARN: {agent_arn}")

        secrets_client = boto3.client('secretsmanager', region_name=region)
        response = secrets_client.get_secret_value(SecretId='mcp_server/cognito/credentials')
        secret_value = response['SecretString']
        parsed_secret = json.loads(secret_value)
        bearer_token = parsed_secret['bearer_token']
        print("✓ Retrieved bearer token from Secrets Manager")
        
    except Exception as e:
        print(f"Error retrieving credentials: {e}")
        sys.exit(1)
    
    encoded_arn = agent_arn.replace(':', '%3A').replace('/', '%2F')
    mcp_url = f"https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{encoded_arn}/invocations?qualifier=DEFAULT"
    headers = {
        "authorization": f"Bearer {bearer_token}",
        "Content-Type": "application/json"
    }
    
    print(f"\nConnecting to: {mcp_url}")

    try:
        async with streamablehttp_client(mcp_url, headers, timeout=120, terminate_on_close=False) as (
            read_stream,
            write_stream,
            _,
        ):
            async with ClientSession(read_stream, write_stream) as session:
                print("\n🔄 Initializing MCP session...")
                await session.initialize()
                print("✓ MCP session initialized")
                
                print("\n🔄 Listing available tools...")
                tool_result = await session.list_tools()
                
                print("\n📋 Available MCP Tools:")
                print("=" * 50)
                for tool in tool_result.tools:
                    print(f"🔧 {tool.name}: {tool.description}")
                
                print("\n🧪 Testing MCP Tools:")
                print("=" * 50)
                
                try:
                    print("\n➕ Testing add(5, 3)...")
                    add_result = await session.call_tool(
                        name="add",
                        arguments={"a": 5, "b": 3}
                    )
                    print(f"   Result: {add_result.content[0].text}")
                except Exception as e:
                    print(f"   Error: {e}")
                
                try:
                    print("\n✖️  Testing subtract(10, 2)...")
                    substract_result = await session.call_tool(
                        name="subtract",
                        arguments={"a": 10, "b": 2}
                    )
                    print(f"   Result: {substract_result.content[0].text}")
                except Exception as e:
                    print(f"   Error: {e}")
                
                print("\n✅ MCP tool testing completed!")
                
    except Exception as e:
        print(f"❌ Error connecting to MCP server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
```

## Test Tool Invocation

Let's test our MCP tools by actually invoking them:

```python
print("Testing MCP tool invocation...")
print("=" * 50)
!python invoke_mcp_tools.py
```

## Next Steps

Now that you have successfully deployed an MCP server to AgentCore Runtime, you can:

1. **Add More Tools**: Extend your MCP server with additional tools
2. **Custom Authentication**: Implement custom JWT authorizers
3. **Integration**: Integrate with other AgentCore services

# 🎉 Congratulations!

You have successfully:

✅ **Created a typescript MCP server** with custom tools  
✅ **Set up authentication** with Amazon Cognito  
✅ **Deployed to AWS** using AgentCore Runtime  
✅ **Invoked remotely** with proper authentication  
✅ **Learned MCP concepts** and best practices  

Your MCP server is now running on Amazon Bedrock AgentCore Runtime and ready for production use!
