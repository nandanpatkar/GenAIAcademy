# Strands Agent with Honeycomb Observability on Amazon Bedrock AgentCore Runtime

## Overview

This notebook demonstrates deploying a Strands agent to Amazon Bedrock AgentCore Runtime with Honeycomb integration. The implementation uses Amazon Bedrock Claude models and sends telemetry data to Honeycomb through OpenTelemetry (OTEL).

## Key Components

- **Strands Agents**: Python framework for building LLM-powered agents with built-in telemetry support
- **Amazon Bedrock AgentCore Runtime**: Managed runtime service for hosting and scaling agents on AWS
- **Honeycomb**: Observability platform for modern applications with trace views
- **OpenTelemetry**: Industry-standard protocol for collecting and exporting telemetry data

## Architecture

The agent is containerized and deployed to AgentCore Runtime, which provides HTTP endpoints for invocation. Telemetry data flows from the Strands agent through an OTLP exporter directly to Honeycomb's trace endpoint for monitoring and debugging. The implementation disables AgentCore's default ADOT observability to use Honeycomb instead.

## Prerequisites

- Python 3.10+
- AWS credentials configured with Bedrock and AgentCore permissions
- [Honeycomb](https://honeycomb.io/) account with API key
- Docker installed locally
- Access to Amazon Bedrock Claude models in your configured region

```python
!pip install --force-reinstall -U -r requirements.txt
```

## Configure Credentials

Create a `.env` file in this directory with your API keys:

```
AWS_DEFAULT_REGION=us-east-1
HONEYCOMB_API_KEY=your-honeycomb-api-key
HONEYCOMB_DATASET=llmobs
```

You can obtain your Honeycomb API key from **Environment Settings → API Keys** in the [Honeycomb UI](https://ui.honeycomb.io/).

```python
%load_ext dotenv
%dotenv
```

```python
# Safe verification (no secrets printed)
import boto3

try:
    resp = boto3.client("sts").get_caller_identity()
    print("AWS identity:", {k: resp[k] for k in ("Account", "Arn", "UserId") if k in resp})
except Exception as e:
    print("Credential check failed:", type(e).__name__, str(e))
```

## Agent Implementation

The agent file (`strands_claude.py`) implements a travel assistant with calculator and weather tools. Key configuration includes:
- **`DISABLE_ADOT_OBSERVABILITY=true`**: Disables AgentCore's built-in ADOT pipeline so we can set our own TracerProvider ([AgentCore observability docs](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html))
- **Direct OTLP export**: Configures an OpenTelemetry TracerProvider that exports traces to Honeycomb's OTLP HTTP endpoint (`https://api.honeycomb.io/v1/traces`)
- **Exporter headers / dataset**: Set the OTLP exporter headers to include your Honeycomb API key and dataset, e.g. `{'x-honeycomb-team': '<HONEYCOMB_API_KEY>', 'x-honeycomb-dataset': '<DATASET_NAME>'}`. Use the dataset name you want to view traces under in Honeycomb ([Honeycomb LLM docs](https://docs.honeycomb.io/send-data/llm/)).
- **`OTEL_SEMCONV_STABILITY_OPT_IN=gen_ai_latest_experimental`**: Enables OpenTelemetry v1.37+ GenAI semantic conventions required by Strands Agents ([Honeycomb LLM docs](https://docs.honeycomb.io/send-data/llm/))
- **Automatic trace export**: All agent invocations, tool calls, and LLM interactions are automatically traced and sent to Honeycomb once the exporter is configured

```python
%%writefile strands_claude.py
import os
import logging

logging.basicConfig(level=logging.ERROR, format="[%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)
logger.setLevel(os.getenv("AGENT_RUNTIME_LOG_LEVEL", "INFO").upper())

# =============================================================================
# Honeycomb - OpenTelemetry Configuration
# Must be configured BEFORE any other OpenTelemetry imports
# =============================================================================

# Disable AgentCore's built-in ADOT so we can set our own TracerProvider
# See: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html
os.environ["DISABLE_ADOT_OBSERVABILITY"] = "true"

# Required for strands-agents GenAI semantic conventions (v1.37+)
os.environ["OTEL_SEMCONV_STABILITY_OPT_IN"] = "gen_ai_latest_experimental"

honeycomb_api_key = os.environ.get("HONEYCOMB_API_KEY")
honeycomb_dataset = os.environ.get("HONEYCOMB_DATASET", "llmobs")
honeycomb_endpoint = os.environ.get("HONEYCOMB_OTLP_ENDPOINT", "https://api.honeycomb.io/v1/traces")
service_name = os.environ.get("OTEL_SERVICE_NAME", "agentcore-honeycomb-demo")

if honeycomb_api_key:
    from opentelemetry import trace
    from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
    from opentelemetry.sdk.trace import TracerProvider
    from opentelemetry.sdk.trace.export import SimpleSpanProcessor
    from opentelemetry.sdk.resources import Resource
    from opentelemetry.instrumentation.bedrock import BedrockInstrumentor

    resource = Resource.create({"service.name": service_name})
    exporter = OTLPSpanExporter(
        endpoint=honeycomb_endpoint,
        headers={"x-honeycomb-team": honeycomb_api_key, "x-honeycomb-dataset": honeycomb_dataset},
    )
    provider = TracerProvider(resource=resource)
    provider.add_span_processor(SimpleSpanProcessor(exporter))
    trace.set_tracer_provider(provider)
    BedrockInstrumentor().instrument(capture_content=True)
    logger.info("Honeycomb & Bedrock instrumentation configured (service: %s)", service_name)
else:
    logger.warning("HONEYCOMB_API_KEY not set. Traces will not be sent to Honeycomb.")

# =============================================================================
# Agent
# =============================================================================

from bedrock_agentcore.runtime import BedrockAgentCoreApp
from strands import Agent, tool
from strands.models import BedrockModel
from strands_tools import calculator


def get_bedrock_model():
    region = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
    model_id = os.getenv("BEDROCK_MODEL_ID", "us.anthropic.claude-sonnet-4-5-20250929-v1:0")
    return BedrockModel(
        model_id=model_id,
        region_name=region,
        max_tokens=1024,
    )


bedrock_model = get_bedrock_model()

system_prompt = """You are a helpful travel assistant. You can perform mathematical calculations 
and check weather information. Always provide helpful, accurate responses and use tools when appropriate."""


@tool
def weather():
    """Get current weather."""
    return "sunny and 72F"


app = BedrockAgentCoreApp()


def initialize_agent():
    """Initialize the agent (telemetry is already configured at module level)."""
    return Agent(
        model=bedrock_model,
        system_prompt=system_prompt,
        tools=[calculator, weather],
    )


@app.entrypoint
def strands_agent_bedrock(payload, context=None):
    """Invoke the agent with a payload."""
    user_input = payload.get("prompt", payload.get("text", payload.get("message", "Hello")))
    logger.info("[%s] User input: %s", getattr(context, 'session_id', 'local'), user_input)

    agent = initialize_agent()
    response = agent(user_input)
    return response.message['content'][0]['text']


if __name__ == "__main__":
    app.run()
```

### Configure AgentCore Runtime deployment

Next we will use our starter toolkit to configure the AgentCore Runtime deployment with an entrypoint, the execution role we just created and a requirements file. We will also configure the starter kit to auto create the Amazon ECR repository on launch.

During the configure step, your docker file will be generated based on your application code. Please note that when using the `bedrock_agentcore_starter_toolkit` to configure your agent, it configures AgentCore Observability by default so, to use Honeycomb, you need to remove configuration for AgentCore Observability as explained below:

<div style="text-align:left">
    <img src="../images/configure.png" width="40%"/>
</div>

```python
from bedrock_agentcore_starter_toolkit import Runtime
from boto3.session import Session

boto_session = Session()
region = boto_session.region_name

agentcore_runtime = Runtime()
agent_name = "strands_honeycomb_agent"
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

Now that we've got a docker file, let's launch the agent to the AgentCore Runtime. This will create the Amazon ECR repository and the AgentCore Runtime.

### Honeycomb Configuration

To send traces to Honeycomb, you need:
- **Honeycomb API Key**: Get this from your Honeycomb account at Organization Settings → API Keys

The agent code (`strands_claude.py`) automatically configures all OTLP settings when `HONEYCOMB_API_KEY` is provided:
- **Endpoint**: `https://api.honeycomb.io/v1/traces` (override with `HONEYCOMB_OTLP_ENDPOINT`)
- **Headers**: `x-honeycomb-team={key}, x-honeycomb-dataset={dataset}` — set `HONEYCOMB_DATASET` to the dataset where traces should appear (e.g. `llmobs`).
- **Semantic Conventions**: `gen_ai_latest_experimental` (for LLM Observability)

You can override the OTLP endpoint or dataset using the `HONEYCOMB_OTLP_ENDPOINT` and `HONEYCOMB_DATASET` environment variables when launching the runtime.

<div style="text-align:left">
    <img src="../images/launch.png" width="75%"/>
</div>

```python
%load_ext dotenv
%dotenv
import os

# Honeycomb configuration
honeycomb_api_key = os.environ.get("HONEYCOMB_API_KEY")  # Replace with your Honeycomb API key

launch_result = agentcore_runtime.launch(
    env_vars={
        "HONEYCOMB_API_KEY": honeycomb_api_key,
        "HONEYCOMB_DATASET": "llmobs",  # Dataset to store traces in
        # Optionally override endpoint: "HONEYCOMB_OTLP_ENDPOINT": "https://api.honeycomb.io/v1/traces",
        "OTEL_SERVICE_NAME": "agentcore-honeycomb-demo",
        "DISABLE_ADOT_OBSERVABILITY": "true",  # Disable AgentCore's default observability
    },
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
    <img src="../images/invoke.png" width="75%"/>
</div>

```python
invoke_response = agentcore_runtime.invoke(
    {"prompt": "What is 25 + 17 and what's the weather like for a trip to Paris?"}
)
```

```python
from IPython.display import Markdown, display

display(Markdown("".join(invoke_response["response"])))
```

## View Traces in Honeycomb

After invoking the agent, traces appear in Honeycomb within a few minutes:

1. Go to [Honeycomb Observability](https://ui.honeycomb.io/)
2. Search for `ml_app:agentcore-Honeycomb-demo`

The traces will include:
- Agent invocation details with full request/response context
- Tool calls (calculator, weather) with execution time
- Model interactions with latency and token usage
- Prompt and completion content

<div style="text-align:left">
     width="75%"/>
</div>

### Honeycomb Features

Honeycomb provides purpose-built views for GenAI applications:

- **Trace Explorer**: View end-to-end agent traces with prompt/response content, tool calls, and model interactions in a single timeline
- **Token Usage Tracking**: Monitor input and output token consumption across models to optimize costs and performance
- **Latency Analysis**: Track time-to-first-token and total response time for each model invocation
- **Error Monitoring**: Identify failed model calls, tool errors, and agent exceptions with full context
- **Evaluations**: Attach quality scores and custom evaluations to traces for continuous improvement

For more information, see the [Honeycomb documentation](https://docs.honeycomb.io/send-data/llm/).

## Cleanup (Optional)

Clean up the deployed resources:

```python
!agentcore destroy --delete-ecr-repo --force --dry-run
```

## Summary

You have successfully deployed a Strands agent to Amazon Bedrock AgentCore Runtime with Honeycomb. The implementation demonstrates:
- Disabling AgentCore's built-in ADOT to use a custom observability provider
- Configuring an OpenTelemetry TracerProvider to export traces directly to Honeycomb
- Using `HONEYCOMB_DATASET` (or the `x-honeycomb-dataset` header) to route traces to a Honeycomb dataset.
- Enabling GenAI semantic conventions for LLM-specific trace views
- Invocation through the AgentCore starter toolkit SDK

### Resources

- [AgentCore Observability docs](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html)
- [Honeycomb For LLMs](https://docs.honeycomb.io/send-data/llm)
- [Strands Agents Observability](https://strandsagents.com/latest/documentation/docs/user-guide/observability-evaluation/observability/)
- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
