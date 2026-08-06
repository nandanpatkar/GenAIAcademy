# Hosting MCP Server on Amazon Bedrock AgentCore Runtime - AWS IAM Inbound Authentication

## Overview

In this tutorial we will learn how to host MCP (Model Context Protocol) servers on Amazon Bedrock AgentCore Runtime. We will use the Amazon Bedrock AgentCore Python SDK to wrap MCP tools as an MCP server compatible with Amazon Bedrock AgentCore.

The Amazon Bedrock AgentCore Python SDK handles the MCP server implementation details so you can focus on your tools' core functionality. It transforms your code into the AgentCore standardized MCP protocol contracts for direct communication.

While the [MCP protocol](https://modelcontextprotocol.io/docs/getting-started/intro) specification traditionally requires OAuth tokens for authentication, AgentCore runtime allows the ability to configure AWS IAM credentials for inbound requests to their MCP servers, addressing a crucial enterprise requirement.

### Tutorial Details

| Information         | Details                                                   |
|:--------------------|:----------------------------------------------------------|
| Tutorial type       | Hosting Tools                                             |
| Tool type           | MCP server                                                |
| Tutorial components | Hosting MCP server on AgentCore Runtime                  |
| Tutorial vertical   | Cross-vertical                                            |
| Example complexity  | Easy                                                      |
| SDK used            | Amazon BedrockAgentCore Python SDK and MCP               |

### Tutorial Architecture

In this tutorial we will describe how to deploy an MCP server to AgentCore runtime.

For demonstration purposes, we will use a simple MCP server with 3 tools: `add_numbers`, `multiply_numbers` and `greet_user`

<div style="text-align:left">
    <img src="images/hosting_mcp_server.png" width="60%"/>
</div>

### Tutorial Key Features

* Creating MCP servers with custom tools
* Testing MCP servers locally
* Hosting MCP servers on Amazon Bedrock AgentCore Runtime
* Invoking deployed MCP servers with authentication

## Prerequisites

To execute this tutorial you will need:
* Python 3.10+
* AWS credentials configured
* Amazon Bedrock AgentCore SDK
* MCP (Model Context Protocol) library
* Running Docker daemon

```python
!pip install --force-reinstall -U -r requirements.txt --quiet
```

```python
from boto3.session import Session

boto_session = Session()
region = boto_session.region_name

agentcore_control_client = boto_session.client("bedrock-agentcore-control", region_name=region)
ssm_client = boto_session.client("ssm", region_name=region)

tool_name = "mcp_server_iam"
```

## Understanding MCP (Model Context Protocol)

MCP is a protocol that allows AI models to securely access external data and tools. Key concepts:

* **Tools**: Functions that the AI can call to perform actions
* **Streamable HTTP**: Transport protocol used by AgentCore Runtime
* **Session Isolation**: Each client gets isolated sessions via `Mcp-Session-Id` header
* **Stateless Operation**: Servers must support stateless operation for scalability

AgentCore Runtime expects MCP servers to be hosted on `0.0.0.0:8000/mcp` as the default path.

### Project Structure

Let's set up our project with the proper structure:

```
mcp_server_project/
├── mcp_server.py              # Main MCP server code
├── mcp_client.py          # Local testing client
├── mcp_client_remote.py   # Remote testing client
├── requirements.txt          # Dependencies
└── __init__.py              # Python package marker
```

## Creating MCP Server

Now let's create our MCP server with three simple tools. The server uses FastMCP with `stateless_http=True` which is required for AgentCore Runtime compatibility.

```python
%%writefile mcp_server.py
from mcp.server.fastmcp import FastMCP
from starlette.responses import JSONResponse

mcp = FastMCP(host="0.0.0.0", stateless_http=True)

@mcp.tool()
def add_numbers(a: int, b: int) -> int:
    """Add two numbers together"""
    return a + b

@mcp.tool()
def multiply_numbers(a: int, b: int) -> int:
    """Multiply two numbers together"""
    return a * b

@mcp.tool()
def greet_user(name: str) -> str:
    """Greet a user by name"""
    return f"Hello, {name}! Nice to meet you."

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
```

### What This Code Does

* **FastMCP**: Creates an MCP server that can host your tools
* **@mcp.tool()**: Decorator that turns your Python functions into MCP tools
* **stateless_http=True**: Required for AgentCore Runtime compatibility
* **Tools**: Three simple tools demonstrating different types of operations

## Creating Local Testing Client

Before deploying to AgentCore Runtime, let's create a client to test our MCP server locally:

```python
%%writefile mcp_client.py
import asyncio

from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

async def main():
    mcp_url = "http://localhost:8000/mcp"
    headers = {}

    async with streamablehttp_client(mcp_url, headers, timeout=120, terminate_on_close=False) as (
        read_stream,
        write_stream,
        _,
    ):
        async with ClientSession(read_stream, write_stream) as session:
            await session.initialize()
            tool_result = await session.list_tools()
            print("Available tools:")
            for tool in tool_result.tools:
                print(f"  - {tool.name}: {tool.description}")

if __name__ == "__main__":
    asyncio.run(main())
```

 ### Testing Locally

To test your MCP server locally:

1. **Terminal 1**: Start the MCP server
   ```bash
   python mcp_server.py
   ```
   
2. **Terminal 2**: Run the test client
   ```bash
   python mcp_client.py
   ```

You should see your three tools listed in the output.

## Configuring AgentCore Runtime Deployment

Next we will use our starter toolkit to configure the AgentCore Runtime deployment with an entrypoint, the execution role we just created and a requirements file. We will also configure the starter kit to auto create the Amazon ECR repository on launch.

During the configure step, your docker file will be generated based on your application code

<div style="text-align:left">
    <img src="images/configure.png" width="60%"/>
</div>

```python
import os
from bedrock_agentcore_starter_toolkit import Runtime

print(f"Using AWS region: {region}")

required_files = ["mcp_server.py", "requirements.txt"]
for file in required_files:
    if not os.path.exists(file):
        raise FileNotFoundError(f"Required file {file} not found")
print("All required files found ✓")

agentcore_runtime = Runtime()

print("Configuring AgentCore Runtime...")
response = agentcore_runtime.configure(
    entrypoint="mcp_server.py",
    auto_create_execution_role=True,
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    region=region,
    protocol="MCP",
    agent_name=tool_name,
)
print("Configuration completed ✓")
```

## Launching MCP Server to AgentCore Runtime

Now that we've got a docker file, let's launch the MCP server to the AgentCore Runtime. This will create the Amazon ECR repository and the AgentCore Runtime

<div style="text-align:left">
    <img src="images/launch.png" width="85%"/>
</div>

```python
print("Launching MCP server to AgentCore Runtime...")
print("This may take several minutes...")
launch_result = agentcore_runtime.launch()
print("Launch completed ✓")
print(f"Agent ARN: {launch_result.agent_arn}")
print(f"Agent ID: {launch_result.agent_id}")
```

```python
agent_arn_response = ssm_client.put_parameter(
    Name="/mcp_server/runtime_iam/agent_arn",
    Value=launch_result.agent_arn,
    Type="String",
    Description="Agent ARN for MCP server with inbound auth",
    Overwrite=True,
)
print("✓ Agent ARN stored in Parameter Store")

print("\nConfiguration stored successfully!")
print(f"Agent ARN: {launch_result.agent_arn}")
```

### Session Lifecycle Demo : Stopping a Session

Now that the runtime is deployed, let's demonstrate stopping a session. We'll invoke the
MCP server with a custom session ID, then stop it to release the microVM resources while
keeping the runtime alive for new sessions.

```python
import uuid
from streamable_http_sigv4 import streamablehttp_client_with_sigv4
from mcp import ClientSession

# Generate custom session ID
demo1_session_id = str(uuid.uuid4())
print(f"📝 Demo 1 - Generated mcpSessionId: {demo1_session_id}")

# Prepare MCP URL
encoded_arn = launch_result.agent_arn.replace(":", "%3A").replace("/", "%2F")
mcp_url = f"https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{encoded_arn}/invocations?qualifier=DEFAULT"

credentials = boto_session.get_credentials()
headers = {"Mcp-Session-Id": demo1_session_id}


# Invoke with custom session ID
async def test_session():
    async with streamablehttp_client_with_sigv4(
        url=mcp_url,
        credentials=credentials,
        service="bedrock-agentcore",
        region=region,
        headers=headers,
    ) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            print(f"✅ Session active with {len(tools.tools)} tools")


await test_session()

# Stop the session
print(f"\n🛑 Stopping session '{demo1_session_id}'...")
agentcore_client = boto_session.client("bedrock-agentcore", region_name=region)
response = agentcore_client.stop_runtime_session(
    agentRuntimeArn=launch_result.agent_arn,
    runtimeSessionId=demo1_session_id,
    qualifier="DEFAULT",
)
print(f"✅ Session stopped (HTTP {response['ResponseMetadata']['HTTPStatusCode']})")
print(f"   Request ID: {response['ResponseMetadata']['RequestId']}")
print("💡 Runtime remains alive for new sessions")

# Note: You may see 'Session termination failed: 404' in the logs above.
# This is expected - it's the MCP client trying to auto-cleanup after we already stopped the session.
# The important part is the 'HTTP 200' response from our explicit stop_runtime_session call.
```

## Creating Remote Testing Client

Now let's create a client to test our deployed MCP server. This client will retrieve the necessary credentials from AWS and connect to the deployed server:

```python
%%writefile mcp_client_remote.py       
import asyncio
import sys
import logging
import boto3
from boto3.session import Session
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
from streamable_http_sigv4 import streamablehttp_client_with_sigv4


logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def create_streamable_http_transport_sigv4(
    mcp_url: str, service_name: str, region: str
):
    """
    Create a streamable HTTP transport with AWS SigV4 authentication.

    This function creates an MCP client transport that uses AWS Signature Version 4 (SigV4)
    to authenticate requests. This is necessary because standard MCP clients don't natively
    support AWS IAM authentication, and this bridges that gap.

    Args:
        mcp_url (str): The URL of the MCP gateway endpoint
        service_name (str): The AWS service name for SigV4 signing (typically "bedrock-agentcore")
        region (str): The AWS region where the gateway is deployed

    Returns:
        StreamableHTTPTransportWithSigV4: A transport instance configured for SigV4 auth

    Example:
        >>> transport = create_streamable_http_transport_sigv4(
        ...     mcp_url=".../mcp",
        ...     service_name="bedrock-agentcore",
        ...     region="us-west-2"
        ... )
    """
    # Get AWS credentials from the current boto3 session
    # These credentials will be used to sign requests with SigV4
    session = boto3.Session()
    credentials = session.get_credentials()

    # Create and return the custom transport with SigV4 signing capability
    return streamablehttp_client_with_sigv4(
        url=mcp_url,
        credentials=credentials,
        service=service_name,
        region=region,
    )


def get_full_tools_list(client):
    """
    Retrieve the complete list of tools from an MCP client, handling pagination.

    MCP servers may return tools in paginated responses. This function handles the
    pagination automatically and returns all available tools in a single list.

    Args:
        client: An MCP client instance (from strands.tools.mcp.mcp_client.MCPClient)

    Returns:
        list: A complete list of all tools available from the MCP server

    Example:
        >>> mcp_client = MCPClient(lambda: create_transport())
        >>> all_tools = get_full_tools_list(mcp_client)
        >>> print(f"Found {len(all_tools)} tools")
    """
    more_tools = True
    tools = []
    pagination_token = None

    # Loop until we've fetched all pages
    while more_tools:
        tmp_tools = client.list_tools_sync(pagination_token=pagination_token)

        tools.extend(tmp_tools)

        # Check if there are more pages to fetch
        if tmp_tools.pagination_token is None:
            # No more pages - we're done
            more_tools = False
        else:
            # More pages exist - prepare to fetch the next one
            more_tools = True
            pagination_token = tmp_tools.pagination_token

    return tools


async def main():
    boto_session = Session()
    region = boto_session.region_name
    print(f"Using AWS region: {region}")

    ssm_client = boto3.client("ssm", region_name=region)

    agent_arn_response = ssm_client.get_parameter(
        Name="/mcp_server/runtime_iam/agent_arn"
    )
    agent_arn = agent_arn_response["Parameter"]["Value"]
    print(f"Retrieved Agent ARN: {agent_arn}")

    if not agent_arn:
        print("❌ Error: AGENT_ARN not found")
        sys.exit(1)

    encoded_arn = agent_arn.replace(":", "%3A").replace("/", "%2F")
    mcp_url = f"https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{encoded_arn}/invocations?qualifier=DEFAULT"

    try:
        async with create_streamable_http_transport_sigv4(
            mcp_url=mcp_url, service_name="bedrock-agentcore", region=region
        ) as (
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
                    if hasattr(tool, "inputSchema") and tool.inputSchema:
                        properties = tool.inputSchema.get("properties", {})
                        if properties:
                            print(f"   Parameters: {list(properties.keys())}")
                    print()

                print(f"✅ Successfully connected to MCP server!")
                print(f"Found {len(tool_result.tools)} tools available.")

    except Exception as e:
        print(f"❌ Error connecting to MCP server: {e}")
        import traceback

        print("\n🔍 Full error traceback:")
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
```

## Testing Your Deployed MCP Server

Let's test our deployed MCP server using the remote client:

```python
print("Testing deployed MCP server...")
print("=" * 50)
!python mcp_client_remote.py
```

### Invoking MCP Tools Remotely

Now let's create an enhanced client that not only lists tools but also invokes them to demonstrate the full MCP functionality:

```python
%%writefile invoke_mcp_tools.py
import asyncio
import sys
import os
import logging
import boto3
import uuid
from boto3.session import Session
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client
from streamable_http_sigv4 import streamablehttp_client_with_sigv4

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def create_streamable_http_transport_sigv4(
    mcp_url: str, service_name: str, region: str
):
    """Create a streamable HTTP transport with AWS SigV4 authentication."""
    session = boto3.Session()
    credentials = session.get_credentials()
    return streamablehttp_client_with_sigv4(
        url=mcp_url,
        credentials=credentials,
        service=service_name,
        region=region,
    )


async def main():
    boto_session = Session()
    region = boto_session.region_name
    print(f"Using AWS region: {region}")

    ssm_client = boto3.client("ssm", region_name=region)

    agent_arn_response = ssm_client.get_parameter(
        Name="/mcp_server/runtime_iam/agent_arn"
    )
    agent_arn = agent_arn_response["Parameter"]["Value"]
    print(f"Retrieved Agent ARN: {agent_arn}")

    if not agent_arn:
        print("❌ Error: AGENT_ARN not found")
        sys.exit(1)

    encoded_arn = agent_arn.replace(":", "%3A").replace("/", "%2F")
    mcp_url = f"https://bedrock-agentcore.{region}.amazonaws.com/runtimes/{encoded_arn}/invocations?qualifier=DEFAULT"

    # Generate custom session ID
    mcp_session_id = str(uuid.uuid4())
    print(f"\n📝 Generated custom mcpSessionId: {mcp_session_id}")
    
    # Get credentials for SigV4
    credentials = boto_session.get_credentials()
    
    # Pass custom session ID as header
    headers = {"Mcp-Session-Id": mcp_session_id}

    try:
        async with streamablehttp_client_with_sigv4(
                url=mcp_url,
                credentials=credentials,
                service="bedrock-agentcore",
                region=region,
                headers=headers
        ) as (
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
                    print("\n➕ Testing add_numbers(5, 3)...")
                    add_result = await session.call_tool(
                        name="add_numbers", arguments={"a": 5, "b": 3}
                    )
                    print(f"   Result: {add_result.content[0].text}")
                except Exception as e:
                    print(f"   Error: {e}")

                try:
                    print("\n✖️  Testing multiply_numbers(4, 7)...")
                    multiply_result = await session.call_tool(
                        name="multiply_numbers", arguments={"a": 4, "b": 7}
                    )
                    print(f"   Result: {multiply_result.content[0].text}")
                except Exception as e:
                    print(f"   Error: {e}")

                try:
                    print("\n👋 Testing greet_user('Alice')...")
                    greet_result = await session.call_tool(
                        name="greet_user", arguments={"name": "Alice"}
                    )
                    print(f"   Result: {greet_result.content[0].text}")
                except Exception as e:
                    print(f"   Error: {e}")

                print("\n✅ MCP tool testing completed!")
        
        # Demonstrate stopping the session
        print(f"\n🛑 Stopping session '{mcp_session_id}'...")
        agentcore_client = boto3.client('bedrock-agentcore', region_name=region)
        response = agentcore_client.stop_runtime_session(
            agentRuntimeArn=agent_arn,
            runtimeSessionId=mcp_session_id,
            qualifier='DEFAULT'
        )
        print(f"✅ Session stopped (HTTP {response['ResponseMetadata']['HTTPStatusCode']})")
        print(f"   Request ID: {response['ResponseMetadata']['RequestId']}")
        print(f"   MicroVM resources released")
        print(f"💡 Runtime remains alive for new sessions")

    except Exception as e:
        print(f"❌ Error connecting to MCP server: {e}")
        import traceback

        print("\n🔍 Full error traceback:")
        traceback.print_exc()
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

### Session Lifecycle Demo: Stopping Previous Session

Before moving to the Boto3 approach, let's stop the session from the previous MCP client test.
This demonstrates that you can stop sessions at any point in your workflow.

```python
# The previous mcp_client_remote.py test created a session
# We can stop it here to demonstrate session management between different test approaches
print("💡 Note: The previous MCP client test created a session that we could stop here.")
print("   In production, track session IDs from your invocations and stop them when done.")
print("   For this demo, we'll create and stop a new session to show the pattern.")

# Create and immediately stop a session to demonstrate
demo2_session_id = str(uuid.uuid4())
print(f"\n📝 Demo 2 - Generated mcpSessionId: {demo2_session_id}")


async def quick_session():
    async with streamablehttp_client_with_sigv4(
        url=mcp_url,
        credentials=credentials,
        service="bedrock-agentcore",
        region=region,
        headers={"Mcp-Session-Id": demo2_session_id},
    ) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            print(f"✅ Session {demo2_session_id} created")


await quick_session()

# Stop it
print(f"🛑 Stopping session '{demo2_session_id}'...")
response = agentcore_client.stop_runtime_session(
    agentRuntimeArn=launch_result.agent_arn,
    runtimeSessionId=demo2_session_id,
    qualifier="DEFAULT",
)
print(f"✅ Session stopped (HTTP {response['ResponseMetadata']['HTTPStatusCode']})")
print(f"   Request ID: {response['ResponseMetadata']['RequestId']}")
print("   Ready for Boto3 approach test")
```

## Testing remote MCP server - Boto3 Approach

This section demonstrates an alternative approach to testing the deployed MCP server using the Boto3 SDK's `invoke_agent_runtime` API. The SDK handles AWS SigV4 request signing automatically, simplifying IAM authentication for runtime invocations

### Create Remote Testing Client - Boto3

Let's create a client to test our deployed MCP server using the Boto3 API:

```python
%%writefile mcp_client_remote_boto3.py   

import boto3
import json
import traceback
from boto3.session import Session
from botocore.exceptions import ClientError

boto_session = Session()
region = boto_session.region_name
print(f"Using AWS region: {region}")

# Initialize the Bedrock AgentCore and SSM client
client = boto3.client('bedrock-agentcore', region_name=region)
ssm_client = boto3.client("ssm", region_name=region)


agent_arn_response = ssm_client.get_parameter(
        Name="/mcp_server/runtime_iam/agent_arn"
)

runtime_arn = agent_arn_response["Parameter"]["Value"]

print(f"Retrieved Agent ARN: {runtime_arn}")

if not runtime_arn:
        print("❌ Error: AGENT_ARN not found")
        sys.exit(1)
        
def call_mcp(method, params=None):
    """
    Call an MCP method on the agent runtime.
    
    Args:
        method: The MCP method to call (e.g., 'tools/list', 'tools/call')
        params: Optional parameters for the method
    
    Returns:
        The result from the MCP response
    """
    if params is None:
        params = {}

    payload = json.dumps({
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params
    }).encode()

    try:
        response = client.invoke_agent_runtime(
            agentRuntimeArn=runtime_arn,
            payload=payload,
            qualifier='DEFAULT',
            contentType='application/json',
            accept='application/json, text/event-stream'
        )

        raw = response['response'].read().decode()
        json_data = json.loads(raw[raw.find('{'):])
        return json_data['result']

    except ClientError as e:
        print(f"\n{'=' * 60}")
        print("Error Response:")
        print(json.dumps(e.response, indent=2, default=str))
        print(f"{'=' * 60}\n")
        raise


def main():

    try:
        # List available tools
        print("📋 Available MCP Tools:")
        print("=" * 50)
        
        tools_result = call_mcp("tools/list")
        tools = tools_result['tools']
        
        for tool in tools:
            params = list(tool.get('inputSchema', {}).get('properties', {}).keys())
            print(f"🔧 {tool['name']}")
            print(f"   Description: {tool['description']}")
            print(f"   Parameters: {params}")
            print()
        
        print(f"✅ Successfully connected to MCP server!")
        print(f"Found {len(tools)} tools available.")

    except Exception as e:
        print(f"❌ Error connecting to MCP server: {e}")
        import traceback

        print("\n🔍 Full error traceback:")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
```

### Testing Your Deployed MCP Server

Let's test our deployed MCP server using the remote client:

```python
print("Testing deployed MCP server...")
print("=" * 50)
!python mcp_client_remote_boto3.py
```

### Invoke MCP Tools - Boto3

Let's now use the boto3 SDK to create a client that not only lists tools but also invokes them:

```python
%%writefile invoke_mcp_tools_boto3.py

import boto3
import json
import logging
from boto3.session import Session
from botocore.exceptions import ClientError

boto_session = Session()
region = boto_session.region_name
client = boto3.client('bedrock-agentcore', region_name=region)

ssm_client = boto3.client("ssm", region_name=region)
agent_arn_response = ssm_client.get_parameter(Name="/mcp_server/runtime_iam/agent_arn")
runtime_arn = agent_arn_response["Parameter"]["Value"]

def call_mcp(method, params=None):
    if params is None:
        params = {}
    payload = json.dumps({
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params
    }).encode()
    try:
        response = client.invoke_agent_runtime(
            agentRuntimeArn=runtime_arn,
            payload=payload,
            qualifier='DEFAULT',
            contentType='application/json',
            accept='application/json, text/event-stream'
        )
        raw = response['response'].read().decode()
        json_data = json.loads(raw[raw.find('{'):])
        return json_data['result']
    except ClientError as e:
        print(f"❌ Error: {e}")
        raise

def main():
    
    print(f"Using AWS region: {region}")
    print(f"Retrieved Agent ARN: {runtime_arn}")


    print("\n🔄 Listing available tools...")
    try: 
        tools_result = call_mcp("tools/list")

        print("\n📋 Available MCP Tools:")
        print("=" * 50)
        for tool in tools_result['tools']:
            print(f"🔧 {tool['name']}: {tool['description']}")

        print("\n🧪 Testing MCP Tools:")
        print("=" * 50)

        print("\n➕ Testing add_numbers(5, 3)...")
        add_result = call_mcp("tools/call", {"name": "add_numbers", "arguments": {"a": 5, "b": 3}})
        print(f"   Result: {add_result['structuredContent']}")

        print("\n✖️  Testing multiply_numbers(4, 7)...")
        multiply_result = call_mcp("tools/call", {"name": "multiply_numbers", "arguments": {"a": 4, "b": 7}})
        print(f"   Result: {multiply_result['structuredContent']}")

        print("\n👋 Testing greet_user('Alice')...")
        greet_result = call_mcp("tools/call", {"name": "greet_user", "arguments": {"name": "Alice"}})
        print(f"   Result: {greet_result['structuredContent']}")

        print("\n✅ MCP tool testing completed!")

    except Exception as e:
        print(f"❌ Error connecting to MCP server: {e}")
        import traceback

        print("\n🔍 Full error traceback:")
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
```

### Test Tool Invocation

Let's test our MCP tools by invoking our newly created client:

```python
print("Testing MCP tool invocation...")
print("=" * 50)
!python invoke_mcp_tools_boto3.py
```

### Session Lifecycle Demo : Stopping After Boto3 Test

After testing with the Boto3 approach, let's demonstrate stopping another session.
This shows that session management works consistently across different invocation methods.

```python
demo3_session_id = str(uuid.uuid4())
print(f"📝 Demo 3 - Generated mcpSessionId: {demo3_session_id}")


async def test3():
    async with streamablehttp_client_with_sigv4(
        url=mcp_url,
        credentials=credentials,
        service="bedrock-agentcore",
        region=region,
        headers={"Mcp-Session-Id": demo3_session_id},
    ) as (r, w, _):
        async with ClientSession(r, w) as s:
            await s.initialize()
            print("✅ Session created")


await test3()

print(f"🛑 Stopping session '{demo3_session_id}'...")
response = agentcore_client.stop_runtime_session(
    agentRuntimeArn=launch_result.agent_arn,
    runtimeSessionId=demo3_session_id,
    qualifier="DEFAULT",
)
print(f"✅ Session stopped (HTTP {response['ResponseMetadata']['HTTPStatusCode']})")
print(f"   Request ID: {response['ResponseMetadata']['RequestId']}")
print("💡 All demos complete - runtime handled multiple sessions!")
```

## Next Steps

Now that you have successfully deployed an MCP server to AgentCore Runtime, you can:

1. **Add More Tools**: Extend your MCP server with additional tools
2. **Custom Authentication**: Implement AWS IAM inbound authentication
3. **Integration**: Integrate with other AgentCore services

## Session Lifecycle Best Practices

AgentCore Runtime costs are based on vCPU and Memory. A best practice to avoid undesired costs is to explicitly stop the session or set up a properly configured idle timeout, so the session will be terminated.

To manage costs effectively:

- **Configure idle timeout**: Set an appropriate idle timeout during session creation to automatically stop inactive sessions. Choose a value based on your use case (e.g., shorter for development/testing, longer for production workloads).
- **Stop sessions when done**: Use `stop_runtime_session` to release the microVM resources for a specific session while keeping the runtime alive for new sessions.

## Cleanup

Let's now clean up the AgentCore Runtime and associated resources. We delete the runtime first to avoid undesired costs, then clean up supporting resources like ECR repositories.

```python
# --- Cleanup Resources ---
import boto3

agentcore_control_client = boto3.client("bedrock-agentcore-control", region_name=region)
ecr_client = boto3.client("ecr", region_name=region)

# Step 1: Delete Parameter Store parameter first to minimize credential exposure window
try:
    ssm_client.delete_parameter(Name="/mcp_server/runtime_iam/agent_arn")
    print("✅ Parameter Store parameter deleted")
except ssm_client.exceptions.ParameterNotFound:
    print("ℹ️  Parameter Store parameter not found")

# Step 2: Delete the agent runtime to stop incurring costs
# AgentCore Runtime costs are based on vCPU and Memory
try:
    agentcore_control_client.delete_agent_runtime(
        agentRuntimeId=launch_result.agent_id,
    )
    print(f"✅ Agent runtime '{launch_result.agent_id}' deleted")
except Exception as e:
    print(f"⚠️ Failed to delete agent runtime: {e}")

# Step 3: Delete the ECR repository
try:
    ecr_client.delete_repository(repositoryName=launch_result.ecr_uri.split("/")[1], force=True)
    print("✅ ECR repository deleted")
except Exception as e:
    print(f"⚠️ Failed to delete ECR repository: {e}")

print("\n✅ Cleanup completed successfully!")
```

# 🎉 Congratulations!

You have successfully:

✅ **Created an MCP server** with custom tools  
✅ **Tested locally** using MCP client  
✅ **Set up authentication** with Amazon Cognito  
✅ **Deployed to AWS** using AgentCore Runtime  
✅ **Invoked remotely** with proper authentication  
✅ **Learned MCP concepts** and best practices  

Your MCP server is now running on Amazon Bedrock AgentCore Runtime and ready for production use!

## Summary

In this tutorial, you learned how to:
- Build MCP servers using FastMCP
- Configure stateless HTTP transport for AgentCore compatibility
- Set up AWS IAM inbound authentication
- Deploy and manage MCP servers on AWS
- Test both locally and remotely
- Use MCP clients for tool invocation

The deployed MCP server can now be integrated into larger AI applications and workflows!
