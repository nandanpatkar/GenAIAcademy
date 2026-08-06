# Deploy AG-UI servers in AgentCore Runtime - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-agui.html

---

# Deploy AG-UI servers in AgentCore Runtime  
  
Amazon Bedrock AgentCore Runtime lets you deploy and run Agent User Interface (AG-UI) servers in the AgentCore Runtime. This guide walks you through creating, testing, and deploying your first AG-UI server.

In this section, you learn:

  * How Amazon Bedrock AgentCore supports AG-UI

  * How to create an AG-UI server

  * How to test your server locally

  * How to deploy your server to AWS 

  * How to invoke your deployed server


For more information about AG-UI, see [AG-UI protocol contract](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./runtime-agui-protocol-contract.html>).

###### Topics

  * How Amazon Bedrock AgentCore supports AG-UI

  * Using AG-UI with AgentCore Runtime

  * Appendix


## How Amazon Bedrock AgentCore supports AG-UI

Amazon Bedrock AgentCore’s AG-UI protocol support enables integration with agent user interface servers by acting as a proxy layer. When configured for AG-UI, Amazon Bedrock AgentCore expects containers to run servers on port `8080` at the `/invocations` path for HTTP/SSE or `/ws` for WebSocket connections. Although AG-UI uses the same port and paths as the HTTP protocol, the runtime distinguishes between them based on the `--protocol` flag specified during deployment configuration.

Amazon Bedrock AgentCore acts as a proxy between clients and your AG-UI container. Requests from the [InvokeAgentRuntime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_InvokeAgentRuntime.html>) API are passed through to your container without modification. Amazon Bedrock AgentCore handles authentication (SigV4/OAuth 2.0), session isolation, and scaling.

Key differences from other protocols:

**Port**
    

AG-UI servers run on port 8080 (same as HTTP, vs 8000 for MCP, 9000 for A2A)

**Path**
    

AG-UI servers use `/invocations` for HTTP/SSE and `/ws` for WebSocket (same as HTTP protocol)

**Message Format**
    

Uses event streams via Server-Sent Events (SSE) for streaming, or WebSocket for bidirectional communication

**Protocol Focus**
    

Agent-to-User interaction (vs MCP for tools, A2A for agent-to-agent)

**Authentication**
    

Supports both SigV4 and OAuth 2.0 authentication schemes

For more information, see [https://docs.ag-ui.com/introduction](<https://docs.ag-ui.com/introduction>).

## Using AG-UI with AgentCore Runtime

In this tutorial you create, test, and deploy an AG-UI server.

For complete examples and framework-specific implementations, see [AG-UI Quickstart Documentation](<https://docs.ag-ui.com/quickstart/introduction>) and [AG-UI Dojo](<https://dojo.ag-ui.com/>).

###### Topics

  * Prerequisites

  * Step 1: Create your AG-UI server

  * Step 2: Test your AG-UI server locally

  * Step 3: Deploy your AG-UI server to Bedrock AgentCore Runtime

  * Step 4: Invoke your deployed AG-UI server


### Prerequisites

  * Python 3.12 or higher, or Node.js 18+ for TypeScript, installed with a basic understanding of your chosen language

  * An AWS account with appropriate permissions and local credentials configured

  * Understanding of the AG-UI protocol and event-based agent-to-user communication concepts


### Step 1: Create your AG-UI server

AG-UI is supported by multiple agent frameworks. Choose the framework that best fits your needs. AWS Strands provides first-party AG-UI integrations for both Python and TypeScript.

#### Install required packages

Install packages for AWS Strands with AG-UI support:

###### Example

Python
    

  1. 
```bash
pip install fastapi
pip install uvicorn
pip install ag-ui-strands
```
 


TypeScript
    

  1. Create a `package.json` first:

```json
{
  "name": "my-agui-server",
  "type": "module",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "@ag-ui/aws-strands": "^0.1.0",
    "@strands-agents/sdk": "^1.1.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^22.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```
Then install dependencies:

```bash
npm install
```
For other frameworks, see the [AG-UI framework integrations](<https://docs.ag-ui.com/introduction#supported-integrations>).

#### Create your first AG-UI server

Create your AG-UI server file in the language of your choice. Both examples below produce a server that listens on port `8080` , exposes `/invocations` for AG-UI traffic, and `/ping` for health checks — the contract that AgentCore Runtime expects from AG-UI containers.

###### Example

Python
    

  1. Create a new file called `my_agui_server.py` . This example uses AWS Strands with AG-UI:

```bash
# my_agui_server.py
import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from ag_ui_strands import StrandsAgent
from ag_ui.core import RunAgentInput
from ag_ui.encoder import EventEncoder
from strands import Agent

# Create a simple Strands agent
strands_agent = Agent(
    system_prompt="You are a helpful assistant.",
)

# Wrap with AG-UI protocol support
agui_agent = StrandsAgent(
    agent=strands_agent,
    name="my_agent",
    description="A helpful assistant",
)

# FastAPI server
app = FastAPI()

@app.post("/invocations")
async def invocations(input_data: dict, request: Request):
    """Main AG-UI endpoint that returns event streams."""
    accept_header = request.headers.get("accept")
    encoder = EventEncoder(accept=accept_header)

    async def event_generator():
        run_input = RunAgentInput(**input_data)
        async for event in agui_agent.run(run_input):
            yield encoder.encode(event)

    return StreamingResponse(
        event_generator(),
        media_type=encoder.get_content_type()
    )

@app.get("/ping")
async def ping():
    return JSONResponse({"status": "Healthy"})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
```
TypeScript
    

  1. Create a new file called `my-agui-server.ts` . This example uses AWS Strands with AG-UI:

```python
// my-agui-server.ts
import { Agent } from "@strands-agents/sdk";
import { StrandsAgent } from "@ag-ui/aws-strands";
import { createStrandsApp } from "@ag-ui/aws-strands/server";

async function main(): Promise<void> {
  // Create a simple Strands agent
  const strandsAgent = new Agent({
    systemPrompt: "You are a helpful assistant.",
  });

  // Wrap with AG-UI protocol support
  const aguiAgent = new StrandsAgent({
    agent: strandsAgent,
    name: "my_agent",
    description: "A helpful assistant",
  });

  // Express app exposing the AgentCore-required paths on port 8080
  const app = await createStrandsApp(aguiAgent, {
    path: "/invocations",
    pingPath: "/ping",
  });

  app.listen(8080, () => {
    console.log("AG-UI server running on port 8080");
  });
}

void main();
```
For complete, framework-specific examples, see:

  * [LangGraph + AG-UI](<https://docs.copilotkit.ai/langgraph/>)

  * [CrewAI + AG-UI](<https://docs.copilotkit.ai/crewai-flows>)

  * [AWS Strands + AG-UI](<https://docs.copilotkit.ai/aws-strands>)


#### Understanding the code

**Event Streams**
    

AG-UI uses Server-Sent Events (SSE) to stream typed events to the client

**/invocations Endpoint**
    

Primary endpoint for HTTP/SSE communication (same as HTTP protocol)

**Port 8080**
    

AG-UI servers run on port 8080 by default in AgentCore Runtime

### Step 2: Test your AG-UI server locally

Run and test your AG-UI server in a local development environment.

#### Start your AG-UI server

Run your AG-UI server locally:

###### Example

Python
    

  1. 
```text
python my_agui_server.py
```
 


TypeScript
    

  1. 
```bash
npx tsx my-agui-server.ts
```
 


You should see output indicating the server is running on port `8080`.

#### Test the endpoint

Test the SSE endpoint with a properly formatted AG-UI request:

```bash
curl -N -X POST http://localhost:8080/invocations \
-H "Content-Type: application/json" \
-d '{
  "threadId": "test-123",
  "runId": "run-456",
  "state": {},
  "messages": [{"role": "user", "content": "Hello, agent!", "id": "msg-1"}],
  "tools": [],
  "context": [],
  "forwardedProps": {}
}'
```
You should see AG-UI event streams returned in SSE format, including `RUN_STARTED` , `TEXT_MESSAGE_CONTENT` , and `RUN_FINISHED` events.

### Step 3: Deploy your AG-UI server to Bedrock AgentCore Runtime

Deploy your AG-UI server to AWS using the Amazon Bedrock AgentCore starter toolkit.

#### Install deployment tools

Install the Amazon Bedrock AgentCore starter toolkit:

```bash
pip install bedrock-agentcore-starter-toolkit
```
Start by creating a project folder with the following structure:

###### Example

Python
    

  1. 
```text
## Project Folder Structure
your_project_directory/
├── my_agui_server.py          # Your main agent code
├── requirements.txt           # Dependencies for your agent
```
 

Create a new file called `requirements.txt` with your dependencies:

```text
fastapi
uvicorn
ag-ui-strands
```
TypeScript
    

  1. 
```text
## Project Folder Structure
your_project_directory/
├── my-agui-server.ts          # Your main agent code
├── package.json               # Dependencies for your agent
└── tsconfig.json              # TypeScript compiler configuration
```
 

Create a `tsconfig.json` :

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["*.ts"]
}
```
#### Set up Cognito user pool for authentication

Configure authentication for secure access to your deployed server. For detailed Cognito setup instructions, see Set up Cognito user pool for authentication . This provides the OAuth tokens required for secure access to your deployed server.

#### Configure your AG-UI server for deployment

After setting up authentication, create the deployment configuration. Pass the entrypoint that matches the language you used:

###### Example

Python
    

  1. 
```bash
agentcore configure -e my_agui_server.py --protocol AGUI
```
 


TypeScript
    

  1. 
```bash
agentcore configure -e my-agui-server.ts --protocol AGUI
```
 


  * Select protocol as AGUI

  * Configure with OAuth configuration as setup in the previous step


#### Deploy to AWS

Deploy your agent:

```bash
agentcore deploy
```
After deployment, you’ll receive an agent runtime ARN that looks like:

```text
arn:aws:bedrock-agentcore:us-west-2:accountId:runtime/my_agui_server-xyz123
```
### Step 4: Invoke your deployed AG-UI server

Invoke your deployed Amazon Bedrock AgentCore AG-UI server and interact with the event streams.

#### Set up environment variables

Set up environment variables

  1. Export bearer token as an environment variable. For bearer token setup, see Set up Cognito user pool for authentication.

```bash
export BEARER_TOKEN="<BEARER_TOKEN>"
```
  2. Export the agent ARN.

```bash
export AGENT_ARN="arn:aws:bedrock-agentcore:us-west-2:accountId:runtime/my_agui_server-xyz123"
```
#### Invoke the AG-UI server

To invoke the AG-UI server programmatically, choose the language that matches your client:

###### Example

Python
    

  1. Install the required packages:

```bash
pip install httpx httpx-sse
```
Then use the following client code:

```python
import asyncio
import json
import os
from urllib.parse import quote
from uuid import uuid4

import httpx
from httpx_sse import aconnect_sse

async def invoke_agui_agent(message: str):
    agent_arn = os.environ.get('AGENT_ARN')
    bearer_token = os.environ.get('BEARER_TOKEN')
    escaped_arn = quote(agent_arn, safe='')

    url = f"https://bedrock-agentcore.us-west-2.amazonaws.com/runtimes/{escaped_arn}/invocations?qualifier=DEFAULT"
    headers = {
        "Authorization": f"Bearer {bearer_token}",
        "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id": str(uuid4()),
    }
    payload = {
        "threadId": str(uuid4()),
        "runId": str(uuid4()),
        "messages": [{"id": str(uuid4()), "role": "user", "content": message}],
        "state": {},
        "tools": [],
        "context": [],
        "forwardedProps": {},
    }

    async with httpx.AsyncClient(timeout=300) as client:
        async with aconnect_sse(client, "POST", url, headers=headers, json=payload) as sse:
            async for event in sse.aiter_sse():
                data = json.loads(event.data)
                event_type = data.get("type")
                if event_type == "TEXT_MESSAGE_CONTENT":
                    print(data.get("delta", ""), end="", flush=True)
                elif event_type == "RUN_ERROR":
                    print(f"Error: {data.get('code')} - {data.get('message')}")

asyncio.run(invoke_agui_agent("Hello!"))
```
TypeScript
    

  1. Install the required packages:

```bash
npm install @ag-ui/client
```
Then use the following client code:

```python
import { HttpAgent, AgentSubscriber } from "@ag-ui/client";
import { randomUUID } from "crypto";

async function invokeAguiAgent(message: string): Promise<void> {
  const agentArn = process.env.AGENT_ARN!;
  const bearerToken = process.env.BEARER_TOKEN!;
  const escapedArn = encodeURIComponent(agentArn);

  const agent = new HttpAgent({
    url: `https://bedrock-agentcore.us-west-2.amazonaws.com/runtimes/${escapedArn}/invocations?qualifier=DEFAULT`,
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id": randomUUID(),
    },
  });

  agent.messages = [{ id: randomUUID(), role: "user", content: message }];

  const subscriber: AgentSubscriber = {
    onTextMessageContentEvent: ({ event }) => {
      process.stdout.write(event.delta);
    },
    onRunErrorEvent: ({ event }) => {
      console.error(`Error: ${event.code ?? "RUN_ERROR"} - ${event.message}`);
    },
  };

  await agent.runAgent({}, subscriber);
}

void invokeAguiAgent("Hello!");
```
For building full UI applications, see [CopilotKit](<https://docs.copilotkit.ai/>) or the [AG-UI TypeScript client SDK](<https://docs.ag-ui.com/sdk/js/client/overview>).

## Appendix

###### Topics

  * Set up Cognito user pool for authentication

  * Troubleshooting


### Set up Cognito user pool for authentication

For detailed Cognito setup instructions, see Set up [Cognito user pool for authentication](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-mcp.html#set-up-cognito-user-pool-for-authentication>) in the MCP documentation. The setup process is identical for AG-UI servers.

### Troubleshooting

**Common AG-UI-specific issues**

The following are common issues you might encounter:

Port conflicts
    

AG-UI servers must run on port 8080 in the AgentCore Runtime environment

Authorization method mismatch
    

Make sure your request uses the same authentication method (OAuth or SigV4) that the agent was configured with

Event format errors
    

Ensure your events follow the AG-UI protocol specification. See [AG-UI Events Documentation](<https://docs.ag-ui.com/concepts/events>)

