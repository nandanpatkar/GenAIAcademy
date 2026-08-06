## Lab 4: Deploy to Production - Use AgentCore Runtime with Observability

### Overview

In Lab 3 we scaled our Customer Support Agent by centralizing tools through AgentCore Gateway with secure authentication. Now we'll complete the production journey by deploying our agent to AgentCore Runtime with comprehensive observability. This will transform our prototype into a production-ready system that can handle real-world traffic with full monitoring and automatic scaling.

[Amazon Bedrock AgentCore Runtime](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/agents-tools-runtime.html) is a secure, fully managed runtime that empowers organizations to deploy and scale AI agents in production, regardless of framework, protocol, or model choice. It provides enterprise-grade reliability, automatic scaling, and comprehensive monitoring capabilities.

**Workshop Journey:**

- **Lab 1 (Done):** Create Agent Prototype - Built a functional customer support agent
- **Lab 2 (Done):** Enhance with Memory - Added conversation context and personalization
- **Lab 3 (Done):** Scale with Gateway & Identity - Shared tools across agents securely
- **Lab 4 (Current):** Deploy to Production - Used AgentCore Runtime with observability
- **Lab 5:** Evaluate Agent Performance - Monitor quality with online evaluations
- **Lab 6:** Build User Interface - Create a customer-facing application

### Why AgentCore Runtime & Production Deployment Matter

Current State (Lab 1-3): Agent runs locally with centralized tools but faces production challenges:

- Agent runs locally in a single session
- No comprehensive monitoring or debugging capabilities
- Cannot handle multiple concurrent users reliably

After this lab, we will have a production-ready agent infrastructure with:

- Serverless auto-scaling to handle variable demand
- Comprehensive observability with traces, metrics, and logging
- Enterprise reliability with automatic error recovery
- Secure deployment with proper access controls
- Easy management through AWS console and APIs and support for real-world production workloads.


### Adding comprehensive observability with AgentCore Observability

Additionally, AgentCore Runtime integrates seamlessly with [AgentCore Observability](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html) to provide full visibility into your agent's behavior in production. AgentCore Observability automatically captures traces, metrics, and logs from your agent interactions, tool usage, and memory access patterns. In this lab we will see how AgentCore Runtime integrates with CloudWatch GenAI Observability to provide comprehensive monitoring and debugging capabilities.

For request tracing, AgentCore Observability captures the complete conversation flow including tool invocations, memory retrievals, and model interactions. For performance monitoring, it tracks response times, success rates, and resource utilization to help optimize your agent's performance.

During the observability flow, AgentCore Runtime automatically instruments your agent code and sends telemetry data to CloudWatch. You can then use CloudWatch dashboards and GenAI Observability features to analyze patterns, identify bottlenecks, and troubleshoot issues in real-time.

### Architecture for Lab 4
<div style="text-align:left"> 
    <img src="images/architecture_lab4_runtime.png" width="75%"/> 
</div>

*Agent now runs in AgentCore Runtime with full observability through CloudWatch, serving production traffic with auto-scaling and comprehensive monitoring. Memory and Gateway integrations from previous labs remain fully functional in the production environment.*

### Key Features

- **Serverless Agent Deployment:** Transform your local agent into a scalable production service using AgentCore Runtime with minimal code changes
- **Comprehensive Observability:** Full request tracing, performance metrics, and debugging capabilities through CloudWatch GenAI Observability

### Prerequisites

- Python 3.12+
- AWS account with appropriate permissions
- Docker, Finch or Podman installed and running
- Amazon Bedrock AgentCore SDK
- Strands Agents framework
- **Lab 3 Completion:** This lab builds on Lab 3 (AgentCore Gateway). You MUST run [lab-03-agentcore-gateway](lab-03-agentcore-gateway.ipynb) to provision the gateway before running this lab.

**Note: You MUST enable [CloudWatch Transaction Search](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html) to be able to see AgentCore Observability traces in CloudWatch.**

### Step 1: Import Required Libraries

```python
# Import required libraries
import boto3
from lab_helpers.utils import get_ssm_parameter
from bedrock_agentcore_starter_toolkit.operations.memory.manager import MemoryManager
from bedrock_agentcore.memory.constants import StrategyType
from lab_helpers.lab2_memory import ACTOR_ID

boto_session = boto3.Session()
REGION = boto_session.region_name


memory_name = "CustomerSupportMemory"
memory_manager = MemoryManager(region_name=REGION)
memory = memory_manager.get_or_create_memory(  # Just in case the memory lab wasn't executed
    name=memory_name,
    strategies=[
        {
            StrategyType.USER_PREFERENCE.value: {
                "name": "CustomerPreferences",
                "description": "Captures customer preferences and behavior",
                "namespaces": ["support/customer/{actorId}/preferences/"],
            }
        },
        {
            StrategyType.SEMANTIC.value: {
                "name": "CustomerSupportSemantic",
                "description": "Stores facts from conversations",
                "namespaces": ["support/customer/{actorId}/semantic/"],
            }
        },
    ],
)
memory_id = memory["id"]
```

### Step 2: Preparing Your Agent for AgentCore Runtime

#### Creating the Runtime-Ready Agent

Let's first define the necessary AgentCore Runtime components via Python SDK within our previous local agent implementation.

Observe the #### AGENTCORE RUNTIME - LINE 1 #### comments below to see where is the relevant deployment code added. You'll find 4 such lines that prepare the runtime-ready agent:

1. Import the Runtime App with `from bedrock_agentcore.runtime import BedrockAgentCoreApp`
2. Initialize the App with `app = BedrockAgentCoreApp()`
3. Decorate our invocation function with `@app.entrypoint`
4. Let AgentCore Runtime control the execution with `app.run()`

##### Key Implementation Details:

The runtime-ready agent uses an entrypoint function that extracts user prompts from the payload and JWT tokens from request headers via 
context.request_headers.get('Authorization', ''). The authorization token is then propagated directly to the AgentCore Gateway by passing it in the 
MCP client headers: headers={"Authorization": auth_header}. The implementation includes error handling for missing authentication and returns plain 
text responses from synchronous agent invocation while preserving all memory and tool functionality from previous labs.

```python
%%writefile ./lab_helpers/lab4_runtime.py
import os
from bedrock_agentcore.runtime import (
    BedrockAgentCoreApp,
)  #### AGENTCORE RUNTIME - LINE 1 ####
from strands import Agent
from strands.tools.mcp import MCPClient
from mcp.client.streamable_http import streamablehttp_client
import requests
import boto3
from strands.models import BedrockModel
from lab_helpers.utils import get_ssm_parameter
from lab_helpers.lab1_strands_agent import (
    get_return_policy,
    get_product_info,
    get_technical_support,
    SYSTEM_PROMPT,
    MODEL_ID,
)

from lab_helpers.lab2_memory import (
    ACTOR_ID,
    SESSION_ID,
)
from bedrock_agentcore_starter_toolkit.operations.memory.manager import MemoryManager
from bedrock_agentcore.memory.integrations.strands.config import AgentCoreMemoryConfig, RetrievalConfig
from bedrock_agentcore.memory.integrations.strands.session_manager import AgentCoreMemorySessionManager

# Initialize boto3 client
sts_client = boto3.client('sts')

# Get AWS account details
REGION = boto3.session.Session().region_name

# Lab1 import: Create the Bedrock model
model = BedrockModel(model_id=MODEL_ID)

# Lab2 import: Memory
memory_id = os.environ.get("MEMORY_ID")
if not memory_id:
    raise Exception("Environment variable MEMORY_ID is required")

# Initialize the AgentCore Runtime App
app = BedrockAgentCoreApp()  #### AGENTCORE RUNTIME - LINE 2 ####

@app.entrypoint  #### AGENTCORE RUNTIME - LINE 3 ####
async def invoke(payload, context=None):
    """AgentCore Runtime entrypoint function"""
    user_input = payload.get("prompt", "")
    session_id = context.session_id # Get session_id from context
    actor_id = payload.get("actor_id", ACTOR_ID) 
    # Access request headers - handle None case
    request_headers = context.request_headers or {}

    # Get Client JWT token
    auth_header = request_headers.get('Authorization', '')

    print(f"Authorization header: {auth_header}")
    # Get Gateway ID
    existing_gateway_id = get_ssm_parameter("/app/customersupport/agentcore/gateway_id")
    
    # Initialize Bedrock AgentCore Control client
    gateway_client = boto3.client(
        "bedrock-agentcore-control",
        region_name=REGION,
    )
    # Get existing gateway details
    gateway_response = gateway_client.get_gateway(gatewayIdentifier=existing_gateway_id)

    # Get gateway url
    gateway_url = gateway_response['gatewayUrl']

    # Create MCP client and agent within context manager if JWT token available
    if gateway_url and auth_header:
        try:
                mcp_client = MCPClient(lambda: streamablehttp_client(
                    url=gateway_url,
                    headers={"Authorization": auth_header}  
                ))
                
                with mcp_client:
                    tools = (
                        [
                            get_product_info,
                            get_return_policy,
                            get_technical_support
                        ]
                        + mcp_client.list_tools_sync()
                    )

                    memory_config = AgentCoreMemoryConfig(
                        memory_id=memory_id,
                        session_id=str(session_id),
                        actor_id=actor_id,
                        retrieval_config={
                            "support/customer/{actorId}/semantic/": RetrievalConfig(top_k=3, relevance_score=0.2),
                            "support/customer/{actorId}/preferences/": RetrievalConfig(top_k=3, relevance_score=0.2)
                        }
                    )

                    # Create the agent with all customer support tools
                    agent = Agent(
                        model=model,
                        tools=tools,
                        system_prompt=SYSTEM_PROMPT,
                        session_manager=AgentCoreMemorySessionManager(memory_config, REGION),
                    )
                    # Invoke the agent
                    response = agent(user_input)
                    return response.message["content"][0]["text"]
        except Exception as e:
                print(f"MCP client error: {str(e)}")
                return f"Error: {str(e)}"
    else:
        return "Error: Missing gateway URL or authorization header"

if __name__ == "__main__":
    app.run()  #### AGENTCORE RUNTIME - LINE 4 ####
```

#### What happens behind the scenes?

When you use `BedrockAgentCoreApp`, it automatically:

- Creates an HTTP server that listens on port 8080
- Implements the required `/invocations` endpoint for processing requests
- Implements the `/ping` endpoint for health checks
- Handles proper content types and response formats
- Manages error handling according to AWS standards

### Step 3: Deploying to AgentCore Runtime

Now let's deploy our agent to AgentCore Runtime using the [AgentCore Starter Toolkit](https://github.com/aws/bedrock-agentcore-starter-toolkit).

#### Configure the Secure Runtime Deployment (AgentCore Runtime + AgentCore Identity)

First we will use our starter toolkit to configure the AgentCore Runtime deployment with an entrypoint, the execution role we will create and a requirements file. We will also configure the identity authorization using an Amazon Cognito user pool and we will configure the starter kit to auto create the Amazon ECR repository on launch.

During the configure step, your docker file will be generated based on your application code

<div style="text-align:left"> 
    <img src="images/configure.png" width="75%"/> 
</div>

**Note**: The Cognito access_token is valid for 2 hours only. If the access_token expires you can vend another access_token by using the `reauthenticate_user` method.

```python
from lab_helpers.utils import get_or_create_cognito_pool

access_token = get_or_create_cognito_pool(refresh_token=True)
print(f"Access token: {access_token['bearer_token']}")
```

#### AgentCore Runtime Configuration Summary:

Below code configures the AgentCore Runtime deployment using the starter toolkit. It creates an execution role for the runtime, then configures the 
deployment with the agent entrypoint file (lab_helpers/lab4_runtime.py), enables automatic ECR repository creation, and sets up JWT-based authentication using 
Cognito. The configuration specifies allowed client IDs and discovery URLs retrieved from SSM parameters, establishing secure access control for the 
production agent deployment. This step automatically generates the Dockerfile and .bedrock_agentcore.yaml configuration files needed for 
containerized deployment.

**Runtime Header Configuration** : Below code configures custom header allowlists for the deployed AgentCore Runtime. It extracts the runtime ID from the agent ARN, retrieves the 
current runtime configuration to preserve existing settings, then updates the runtime with a request header allowlist that includes the Authorization
header (required for OAuth token propagation) and custom headers. This ensures JWT tokens and other necessary headers are properly forwarded from 
client requests to the agent runtime code.

**Note: For the scope of the workshop, you can safely ignore the Platform Mismatch warning.**

```python
from bedrock_agentcore_starter_toolkit import Runtime
from lab_helpers.utils import create_agentcore_runtime_execution_role

# Initialize the runtime toolkit
boto_session = boto3.session.Session()
region = boto_session.region_name

execution_role_arn = create_agentcore_runtime_execution_role()

agentcore_runtime = Runtime()

# Configure the deployment
response = agentcore_runtime.configure(
    entrypoint="lab_helpers/lab4_runtime.py",
    execution_role=execution_role_arn,
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    region=region,
    agent_name="customer_support_agent",
    authorizer_configuration={
        "customJWTAuthorizer": {
            "allowedClients": [get_ssm_parameter("/app/customersupport/agentcore/client_id")],
            "discoveryUrl": get_ssm_parameter("/app/customersupport/agentcore/cognito_discovery_url"),
        }
    },
    # Add custom header allowlist for Authorization and custom headers
    request_header_configuration={
        "requestHeaderAllowlist": [
            "Authorization",  # Required for OAuth propogation
            "X-Amzn-Bedrock-AgentCore-Runtime-Custom-H1",  # Custom header
        ]
    },
)

print("Configuration completed:", response)
```

#### Launch the Agent

Now let's launch our agent to AgentCore Runtime. This will create an AWS CodeBuild pipeline, the Amazon ECR repository and the AgentCore Runtime components.

<div style="text-align:left"> 
    <img src="images/launch.png" width="100%"/> 
</div>

*Note: This step might fail if the agent with the same name already exists. If you want to overwrite the existing Runtime, use this instead:*

``` launch_result = agentcore_runtime.launch(auto_update_on_conflict=True)```

```python
# Launch the agent (this will build and deploy the container)
from lab_helpers.utils import put_ssm_parameter

launch_result = agentcore_runtime.launch(env_vars={"MEMORY_ID": memory_id})
print("Launch completed:", launch_result.agent_arn)

agent_arn = put_ssm_parameter("/app/customersupport/agentcore/runtime_arn", launch_result.agent_arn)
```

#### Check Deployment Status

Let's wait for the deployment to complete:

```python
import time

# Wait for the agent to be ready
status_response = agentcore_runtime.status()
status = status_response.endpoint["status"]

end_status = ["READY", "CREATE_FAILED", "DELETE_FAILED", "UPDATE_FAILED"]
while status not in end_status:
    print(f"Waiting for deployment... Current status: {status}")
    time.sleep(10)
    status_response = agentcore_runtime.status()
    status = status_response.endpoint["status"]

print(f"Final status: {status}")
```

### Step 4: Invoking Your Deployed Agent

Now that our agent is deployed and ready, let's test it with some queries. We invoke the agent with the right authorization token type. In out case it'll be Cognito access token. Copy the access token from the cell above

<div style="text-align:left"> 
    <img src="images/invoke.png" width="100%"/> 
</div>

#### Using the AgentCore Starter Toolkit

We can validate that the agent works using the AgentCore Starter Toolkit for invocation. The starter toolkit can automatically create a session id for us to query our agent. Alternatively, you can also pass the session id as a parameter during invocation. For demonstration purpose, we will create our own session id.

```python
# Initialize the AgentCore Control client
client = boto3.client("bedrock-agentcore-control")

# Extract runtime ID from the ARN (format: arn:aws:bedrock-agentcore:region:account:runtime/runtime-id)
runtime_id = launch_result.agent_arn.split(":")[-1].split("/")[-1]

print(f"Runtime ID: {runtime_id}")
```

```python
import uuid
from IPython.display import display, Markdown

# Create a session ID for demonstrating session continuity
session_id = uuid.uuid4()

# Test different customer support scenarios
user_query = "List all of your tools"

response = agentcore_runtime.invoke(
    {"prompt": user_query, "actor_id": ACTOR_ID},
    bearer_token=access_token["bearer_token"],
    session_id=str(session_id),
)

display(Markdown(response["response"].replace("\\n", "\n")))
```

#### Invoking the agent with session continuity

Since we are using AgentCore Runtime, we can easily continue our conversation with the same `session id` and the same `Actor_id`

```python
user_query = "Tell me detailed information about the technical documentation on installing a new CPU"
response = agentcore_runtime.invoke(
    {"prompt": user_query, "actor_id": ACTOR_ID},
    bearer_token=access_token["bearer_token"],
    session_id=str(session_id),
)
display(Markdown(response["response"].replace("\\n", "\n")))
```

#### Invoking the agent with a new user
In the example below our agent still has the context of the Gaming Console Pro that the user bought. This is due to the AgentCore Memory persistence. The agent won't know the context for a new user.

```python
# Creating a new session ID for demonstrating new customer
session_id2 = uuid.uuid4()

user_query = (
    "I have a Gaming Console Pro device , I want to check my warranty status, warranty serial number is MNO33333333."
)
response = agentcore_runtime.invoke(
    {"prompt": user_query, "actor_id": ACTOR_ID},
    bearer_token=access_token["bearer_token"],
    session_id=str(session_id2),
)
display(Markdown(response["response"].replace("\\n", "\n")))
```

In this case our agent does not have the context anymore and needs more information. 

And it is all it takes to have a secure and scalable endpoint for our Agent with no need to manage all the underlying infrastructure!

### Step 5: AgentCore Observability

[AgentCore Observability](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability.html) provides monitoring and tracing capabilities for AI agents using Amazon OpenTelemetry Python Instrumentation and Amazon CloudWatch GenAI Observability.

#### Agents

Default AgentCore Runtime configuration allows for logging our agent's traces on CloudWatch by means of **AgentCore Observability**. These traces can be seen on the AWS CloudWatch GenAI Observability dashboard. Navigate to Cloudwatch &rarr; GenAI Observability &rarr; Bedrock AgentCore.

![Agents Overview on CloudWatch](images/observability_agents.png)

#### Sessions

The Sessions view shows the list of all the sessions associated with all agents in your account.

![sessions](images/sessions_lab5_observability.png)

#### Traces

Trace view lists all traces from your agents in this account. To work with traces:

- Choose Filter traces to search for specific traces.
- Sort by column name to organize results.
- Under Actions, select Logs Insights to refine your search by querying across your log and span data or select Export selected traces to export.

![traces](images/traces_lab4_observability.png)

### Congratulations! 🎉

You have successfully completed **Lab 4: Deploy to Production - Use AgentCore Runtime with Observability!**

Here is what you accomplished:

##### Production-Ready Deployment:

- Prepared your agent for production with minimal code changes (only 4 lines added)
- Validated proper session isolation between different customers
- Confirmed session continuity + memory persistence and context awareness per session

##### Enterprise-Grade Security & Identity:

- Implemented secure authentication using Cognito integration with JWT tokens
- Configured proper IAM roles and execution permissions for production workloads
- Established identity-based access control for secure agent invocation

##### Comprehensive Observability:

- Enabled AgentCore Observability for full request tracing across all customer sessions
- Configured CloudWatch GenAI Observability dashboard monitoring

##### Current Limitations (We'll fix these next!):

- **Developer Focused Interaction** - Agent accessible via SDK/API calls but no user-friendly web interface
- **Manual Session Management** - Requires programmatic session creation rather than intuitive user experience

##### Next Up [Lab 5: Evaluate Agent Performance →](lab-05-agentcore-evals.ipynb)
In Lab 5, you'll set up continuous quality monitoring with AgentCore Evaluations to ensure your production agent maintains high performance standards!
