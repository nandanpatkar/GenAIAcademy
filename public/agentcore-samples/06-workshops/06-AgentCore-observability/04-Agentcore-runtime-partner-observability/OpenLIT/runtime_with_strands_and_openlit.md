# Strands Agent with OpenLIT Observability on Amazon Bedrock AgentCore Runtime

## Overview

This notebook demonstrates deploying a Strands agent to Amazon Bedrock AgentCore Runtime with OpenLIT observability integration. The implementation uses Amazon Bedrock Claude models and sends telemetry data to [OpenLIT](https://github.com/openlit/openlit) through OpenTelemetry (OTEL).

## Key Components

- **Strands Agents**: Python framework for building LLM-powered agents with built-in telemetry support
- **Amazon Bedrock AgentCore Runtime**: Managed runtime service for hosting and scaling agents on AWS
- **OpenLIT**: Open-source observability platform for LLM applications and AI Agents built on OpenTelemetry
- **OpenTelemetry**: Industry-standard protocol for collecting and exporting telemetry data

## Architecture

The agent is containerized and deployed to AgentCore Runtime, which provides HTTP endpoints for invocation. Telemetry data flows from the Strands agent through OTEL exporters to OpenLIT for monitoring and debugging. The implementation disables AgentCore's default observability to use OpenLIT instead.

## Prerequisites

- Python 3.10+
- AWS credentials configured with Bedrock and AgentCore permissions
- [OpenLIT](https://github.com/openlit/openlit) deployed
- Docker installed locally
- Access to Amazon Bedrock Claude models in us-west-2

## OpenLIT Setup

Before proceeding with the agent deployment, you need to set up OpenLIT to receive telemetry data. OpenLIT must be accessible from Amazon Bedrock AgentCore Runtime.

### Deployment Options

You have two main options for deploying OpenLIT:

#### Option 1: Docker Deployment (Quickest for Testing)
Deploy OpenLIT using Docker Compose. This is the simplest approach for getting started:

```bash
# Using Docker Compose (recommended for quick setup)
git clone https://github.com/openlit/openlit.git
cd openlit
docker compose up -d
```

This will start OpenLIT on `http://localhost:3000` (UI) and `http://localhost:4318` (OTEL endpoint). 

For AgentCore to access it, you need to deploy this on a machine (e.g., EC2 instance) that AgentCore can reach:
1. Deploy on an EC2 instance or container service with a public IP
2. Ensure port 4318 is accessible (configure security groups to allow inbound traffic)
3. Use the public endpoint URL (e.g., `http://<ec2-public-ip>:4318`) in your AgentCore configuration

#### Option 2: Kubernetes Deployment (Production-Ready)
For production use, deploy OpenLIT on Kubernetes using Helm:

```bash
# Add OpenLIT Helm repository
helm repo add openlit https://openlit.github.io/helm-charts
helm repo update

# Install OpenLIT
helm install openlit openlit/openlit
```

**Default Configuration:**
- By default, OpenLIT creates a LoadBalancer service with a public IP
- This makes the OTEL endpoint publicly accessible at `http://<load-balancer-ip>:4318`
- The UI will be accessible at `http://<load-balancer-ip>:3000`

**VPC/Private Configuration:**
If you prefer to keep OpenLIT private within a VPC (recommended for production):

1. **Deploy in the same VPC as AgentCore** or configure VPC peering
2. **Change service type to ClusterIP or use internal Load Balancer:**
   ```bash
   helm install openlit openlit/openlit \
     --set service.type=ClusterIP
   ```
   Or for AWS internal load balancer:
   ```bash
   helm install openlit openlit/openlit \
     --set service.annotations."service\.beta\.kubernetes\.io/aws-load-balancer-internal"="true"
   ```
3. **Configure security groups/network policies** to allow traffic between AgentCore and OpenLIT
4. Use the internal endpoint (e.g., `http://openlit.default.svc.cluster.local:4318` or internal load balancer DNS)

### Getting Your OpenLIT Endpoint

Once OpenLIT is deployed, you'll use the OTEL endpoint in the format:
- **Docker with public IP**: `http://<ec2-public-ip-or-domain>:4318`
- **Kubernetes with public LoadBalancer**: `http://<load-balancer-external-ip>:4318`
- **Kubernetes with internal/VPC**: `http://<internal-dns-or-ip>:4318`

📝 **Save this endpoint URL** - you'll need it in the configuration step below.

For detailed deployment instructions, refer to the [OpenLIT Installation Guide](https://docs.openlit.io/latest/openlit/installation).

## Installation

Install required dependencies from the requirements.txt file:

```python
!pip install --force-reinstall -U -r requirements.txt --quiet
```

## Agent Implementation

The agent file (`strands_claude.py`) implements a travel agent with web search capabilities. Key configuration includes:
- Initializing Strands telemetry with OTLP exporter
- Using lazy initialization to ensure environment variables are loaded

```python
%%writefile strands_claude.py
import os
import logging
from bedrock_agentcore.runtime import BedrockAgentCoreApp
from strands import Agent, tool
from strands.models import BedrockModel
from strands.telemetry import StrandsTelemetry
from ddgs import DDGS

logging.basicConfig(level=logging.ERROR, format="[%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)
logger.setLevel(os.getenv("AGENT_RUNTIME_LOG_LEVEL", "INFO").upper())


@tool
def web_search(query: str) -> str:
    """
    Search the web for information using DuckDuckGo.

    Args:
        query: The search query

    Returns:
        A string containing the search results
    """
    try:
        ddgs = DDGS()
        results = ddgs.text(query, max_results=5)

        formatted_results = []
        for i, result in enumerate(results, 1):
            formatted_results.append(
                f"{i}. {result.get('title', 'No title')}\n"
                f"   {result.get('body', 'No summary')}\n"
                f"   Source: {result.get('href', 'No URL')}\n"
            )

        return "\n".join(formatted_results) if formatted_results else "No results found."

    except Exception as e:
        return f"Error searching the web: {str(e)}"

# Function to initialize Bedrock model
def get_bedrock_model():
    region = os.getenv("AWS_DEFAULT_REGION", "us-west-2")
    model_id = os.getenv("BEDROCK_MODEL_ID", "us.anthropic.claude-3-7-sonnet-20250219-v1:0")

    bedrock_model = BedrockModel(
        model_id=model_id,
        region_name=region,
        temperature=0.0,
        max_tokens=1024
    )
    return bedrock_model

# Initialize the Bedrock model
bedrock_model = get_bedrock_model()

# Define the agent's system prompt
system_prompt = """You are an experienced travel agent specializing in personalized travel recommendations 
with access to real-time web information. Your role is to find dream destinations matching user preferences 
using web search for current information. You should provide comprehensive recommendations with current 
information, brief descriptions, and practical travel details."""

app = BedrockAgentCoreApp()

def initialize_agent():
    """Initialize the agent with proper telemetry configuration."""

    # Initialize Strands telemetry with 3P configuration
    strands_telemetry = StrandsTelemetry()
    strands_telemetry.setup_otlp_exporter()
    
    # Create and cache the agent
    agent = Agent(
        model=bedrock_model,
        system_prompt=system_prompt,
        tools=[web_search]
    )
    
    return agent

@app.entrypoint
def strands_agent_bedrock(payload, context=None):
    """
    Invoke the agent with a payload
    """
    user_input = payload.get("prompt")
    logger.info("[%s] User input: %s", context.session_id, user_input)
    
    # Initialize agent with proper configuration
    agent = initialize_agent()
    
    response = agent(user_input)
    return response.message['content'][0]['text']

if __name__ == "__main__":
    app.run()
```

### Configure AgentCore Runtime deployment

Next we will use our starter toolkit to configure the AgentCore Runtime deployment with an entrypoint, the execution role we just created and a requirements file. We will also configure the starter kit to auto create the Amazon ECR repository on launch.

During the configure step, your docker file will be generated based on your application code. Please note that when using the `bedrock_agentcore_starter_toolkit` to configure your agent, it configures AgentCore Observability by default so, to use OpenLIT, you need to remove configuration for AgentCore Observability as explained below:

<div style="text-align:left">
    <img src="../images/configure.png" width="40%"/>
</div>

```python
from bedrock_agentcore_starter_toolkit import Runtime
from boto3.session import Session

boto_session = Session()
region = boto_session.region_name

agentcore_runtime = Runtime()
agent_name = "strands_openlit_observability"
response = agentcore_runtime.configure(
    entrypoint="strands_claude.py",
    auto_create_execution_role=True,
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    region=region,
    agent_name=agent_name,
    disable_otel=True,
)
response
```

## Deploy to AgentCore Runtime

Now that we've got a docker file, let's launch the agent to the AgentCore Runtime. This will create the Amazon ECR repository and the AgentCore Runtime

<div style="text-align:left">
    <img src="../images/launch.png" width="75%"/>
</div>

```python
# OpenLIT configuration
# IMPORTANT: Replace with your actual OpenLIT OTEL endpoint
# Examples:
#   - Public EC2: "http://ec2-XX-XXX-XXX-XXX.compute-1.amazonaws.com:4318"
#   - VPC/Private: "http://10.0.1.100:4318" or "http://openlit.internal:4318"

otel_endpoint = "http://<your-openlit-host>:4318"  # ⚠️ REPLACE THIS with your OpenLIT endpoint

env_vars = {
    "BEDROCK_MODEL_ID": "us.anthropic.claude-3-7-sonnet-20250219-v1:0",  # Example model ID
    "OTEL_EXPORTER_OTLP_ENDPOINT": otel_endpoint,  # Use OpenLIT OTEL endpoint
    "DISABLE_ADOT_OBSERVABILITY": "true",
}

launch_result = agentcore_runtime.launch(env_vars=env_vars)
launch_result
```

## Check Deployment Status

Wait for the runtime to be ready before invoking:

```python
import time

status_response = agentcore_runtime.status()
status = status_response.endpoint["status"]
end_status = ["READY", "CREATE_FAILED", "DELETE_FAILED", "UPDATE_FAILED"]
while status not in end_status:
    time.sleep(10)
    status_response = agentcore_runtime.status()
    status = status_response.endpoint["status"]
    print(status)
status
```

### Invoking AgentCore Runtime

Finally, we can invoke our AgentCore Runtime with a payload

<div style="text-align:left">
    <img src="../images/invoke.png" width=75%"/>
</div>

```python
invoke_response = agentcore_runtime.invoke(
    {"prompt": "I'm planning a weekend trip to Tokyo. What are the must-visit places and local food I should try?"}
)
```

```python
from IPython.display import Markdown, display

display(Markdown("".join(invoke_response["response"])))
```

## View Traces in OpenLIT

To view the traces:
1. Access your OpenLIT dashboard:
   - For self-hosted: Navigate to `http://your-openlit-host:3000`
2. Click on "Requests" section
3. Filter by your service name

The traces will include:
- Agent invocation details with full request/response context
- Tool calls (web search) with execution time
- Model interactions with latency, token usage, and cost estimates
- Request/response payloads
- Error tracking and debugging information
- Performance metrics and analytics

## Cleanup (Optional)

Clean up the deployed resources:

```python
import boto3

agentcore_control_client = boto3.client("bedrock-agentcore-control", region_name=region)

ecr_client = boto3.client("ecr", region_name=region)

runtime_delete_response = agentcore_control_client.delete_agent_runtime(
    agentRuntimeId=launch_result.agent_id,
)

response = ecr_client.delete_repository(repositoryName=launch_result.ecr_uri.split("/")[1], force=True)
```

## Summary

You have successfully deployed a Strands agent to Amazon Bedrock AgentCore Runtime with OpenLIT observability. The implementation demonstrates:
- Integration of Strands agents with AgentCore Runtime
- Configuration of OpenTelemetry to send traces to OpenLIT
- Proper initialization order to ensure telemetry configuration
- Invocation through both SDK and boto3 client

The agent is now running in a managed, scalable environment with full observability through OpenLIT. OpenLIT provides comprehensive monitoring including:
- Real-time trace visualization
- Cost tracking and analysis
- Performance metrics
- Error tracking and debugging
- Token usage analytics
