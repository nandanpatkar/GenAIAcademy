# Strands Agent with Arize Observability on Amazon Bedrock AgentCore Runtime

## Overview

This notebook demonstrates deploying a Strands agent to Amazon Bedrock AgentCore Runtime with Arize observability integration. The implementation uses Amazon Bedrock Claude models and sends telemetry data to Arize through OpenTelemetry (OTEL).

## Key Components

- **Strands Agents**: Python framework for building LLM-powered agents with built-in telemetry support
- **Amazon Bedrock AgentCore Runtime**: Managed runtime service for hosting and scaling agents on AWS
- **Arize**: Observability platform for LLM applications that receives traces via OTEL
- **OpenTelemetry**: Industry-standard protocol for collecting and exporting telemetry data

## Architecture

The agent is containerized and deployed to AgentCore Runtime, which provides HTTP endpoints for invocation. Telemetry data flows from the Strands agent through OTEL exporters to Arize for monitoring and debugging. The implementation disables AgentCore's default observability to use Arize instead.

## Prerequisites

- Python 3.10+
- AWS credentials configured with Bedrock and AgentCore permissions
- [Arize](https://app.arize.com/) account with API and space keys
- Docker installed locally
- Access to Amazon Bedrock Claude models in us-west-2

```python
!pip install --force-reinstall -U -r requirements.txt --quiet
```

## Configure AWS Credentials

## Agent Implementation

The agent file (`strands_claude.py`) implements a travel agent with web search capabilities. Key configuration includes:
- Initializing Strands telemetry

```python
# Arize configuration
import os

os.environ["ARIZE_API_KEY"] = ""  # <--- UPDATE WITH YOUR ARIZE API KEY
os.environ["ARIZE_SPACE_ID"] = ""  # <--- UPDATE WITH YOUR ARIZE SPACE ID
os.environ["ARIZE_ENDPOINT"] = "https://otlp.arize.com:443"
```

```python
%%writefile strands_claude.py
import os
import logging
from bedrock_agentcore.runtime import BedrockAgentCoreApp
from strands import Agent, tool
from strands.models import BedrockModel
from strands.telemetry import StrandsTelemetry
from ddgs import DDGS
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import Resource
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from openinference.instrumentation.strands_agents import StrandsAgentsToOpenInferenceProcessor

#Arize Project Name
os.environ["ARIZE_PROJECT_NAME"] = "agentcore-strands-travel-agent" ## <-- Update with your Arize Project Name


strands_processor = StrandsAgentsToOpenInferenceProcessor()
resource = Resource.create({
  "model_id": os.environ["ARIZE_PROJECT_NAME"], 
})
provider = TracerProvider(resource=resource)
provider.add_span_processor(strands_processor)
otel_exporter = OTLPSpanExporter()
provider.add_span_processor(BatchSpanProcessor(otel_exporter))
trace.set_tracer_provider(provider)

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

During the configure step, your docker file will be generated based on your application code. Please note that when using the `bedrock_agentcore_starter_toolkit` to configure your agent, it configures AgentCore Observability by default so, to use Braintrust, you need to remove configuration for AgentCore Observability as explained below:

<div style="text-align:left">
    <img src="../images/configure.png" width="40%"/>
</div>

```python
from bedrock_agentcore_starter_toolkit import Runtime
from boto3.session import Session

boto_session = Session()
region = boto_session.region_name

agentcore_runtime = Runtime()
agent_name = "strands_agentcore_arize_observability"
response = agentcore_runtime.configure(
    entrypoint="strands_claude.py",
    auto_create_execution_role=True,
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    region=region,
    agent_name=agent_name,
    memory_mode="NO_MEMORY",
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
# Set the Space and API keys as headers for authentication
import os

headers = f"space_id={os.environ['ARIZE_SPACE_ID']},api_key={os.environ['ARIZE_API_KEY']}"

# Launch Runtime (Configure the runtime to send telemetry data to Arize)
launch_result = agentcore_runtime.launch(
    env_vars={
        "BEDROCK_MODEL_ID": "us.anthropic.claude-3-7-sonnet-20250219-v1:0",  # Example model ID
        "OTEL_EXPORTER_OTLP_ENDPOINT": os.environ["ARIZE_ENDPOINT"],  # Use Arize OTEL endpoint
        "OTEL_EXPORTER_OTLP_HEADERS": headers,  # Add Arize auth header
        "DISABLE_ADOT_OBSERVABILITY": "true",  # Bypass Cloudwatch
    }
)
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
    {"prompt": "I'm planning a weekend trip to davos. What are the must-visit places and local food I should try?"}
)
```

```python
from IPython.display import Markdown, display

display(Markdown("".join(invoke_response["response"])))
```

## View Traces in Arize

To view the traces:
1. Go to your Arize dashboard at https://app.arize.com
2. Navigate to your project
3. Click on "Traces" to view the telemetry data

The traces will include:
- Agent invocation details
- Tool calls (web search)
- Model interactions with latency and token usage
- Request/response payloads

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

You have successfully deployed a Strands agent to Amazon Bedrock AgentCore Runtime with Arize observability. The implementation demonstrates:
- Integration of Strands agents with AgentCore Runtime
- Configuration of OpenTelemetry to send traces to Arize
- Proper initialization order to ensure telemetry configuration
- Invocation through both SDK and boto3 client

The agent is now running in a managed, scalable environment with full observability through Arize.
