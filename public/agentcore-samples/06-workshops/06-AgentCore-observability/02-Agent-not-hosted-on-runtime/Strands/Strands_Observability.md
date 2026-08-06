# Amazon Bedrock AgentCore Observability with Strands Agent SDK hosted outside of AgentCore Runtime

This notebook demonstrates how to use setup observability for a [Strands Agent SDK](https://strandsagents.com/latest/)  agent hosted outside of Amazon Bedrock AgentCore Runtime. Once you have completed the setup, you will be able to view the internal decision making process of Strands agent in GenAI Observability dashboard in Amazon CloudWatch.

## What you'll learn
- How to set up Strands Agent SDK with Amazon OpenTelemetry Python Instrumentation
- How to visualize and analyze agent traces in Amazon CloudWatch GenAI Observability


## Prerequisites
- Enable transaction search on Amazon CloudWatch. First-time users must enable CloudWatch Transaction Search to view Bedrock AgentCore spans and traces. To enable transaction search, please refer to the our [documentation](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Enable-TransactionSearch.html).
- Log group and Log stream configured on Amazon Cloudwatch to be added to the environment variables.
- AWS account with Amazon Bedrock Model access to Claude Haiku 4.5 with Model ID: global.anthropic.claude-haiku-4-5-20251001-v1:0
- AWS credentials configured using `aws configure` 
- .env file updated with environment variables variables. An example is provided in `Strands/.env.example`

## 1. Setup and Installation

First, let's install the required dependencies. Please check that `aws-opentelemetry-distro` in your requirements.txt file.

```python
!pip install --force-reinstall -U -r requirements.txt --quiet
```

#### Deploying pre-requisites

Before starting let's create a log group and a log stream for AgentCore observability

```python
import boto3

cloudwatch_client = boto3.client("logs")
response = cloudwatch_client.create_log_group(logGroupName="agents/strands-agent-logs")
response
```

```python
response = cloudwatch_client.create_log_stream(logGroupName="agents/strands-agent-logs", logStreamName="default")
response
```

#### Enabling transactional search

To run this example you first need to enable transactional search. You can do so in the AWS console following this [link](https://console.aws.amazon.com/cloudwatch/home#xray:settings/transaction-search).

Once in this page, click on edit and set the option to ingest spans as structured logs in the OpenTelemetry format 
![image.png](./images/transactional_search.png)
![image.png](./images/transactional_search2.png)

## 2. Environment Configuration
To enable observability for your Strands agent and send telemetry data to Amazon CloudWatch, you'll need to configure the following environment variables. We use a `.env` file to manage these settings securely, keeping sensitive AWS credentials separate from your code while making it easy to switch between different environments.

**Ensure your AWS credentials are configured**

We will create a `.env` file for configuring the environment variables. Use `Strands/.env.example` as a template.

Required Environment Variables:

| Variable | Value | Purpose |
|----------|-------|---------|
| `OTEL_PYTHON_DISTRO` | `aws_distro` | Use AWS Distro for OpenTelemetry (ADOT) |
| `OTEL_PYTHON_CONFIGURATOR` | `aws_configurator` | Set AWS configurator for ADOT SDK |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | `http/protobuf` | Configure export protocol |
| `OTEL_EXPORTER_OTLP_LOGS_HEADERS` | `x-aws-log-group=<YOUR-LOG-GROUP>,x-aws-log-stream=<YOUR-LOG-STREAM>,x-aws-metric-namespace=<YOUR-NAMESPACE>` | Direct logs to CloudWatch groups |
| `OTEL_RESOURCE_ATTRIBUTES` | `service.name=<YOUR-AGENT-NAME>` | Identify your agent in observability data |
| `AGENT_OBSERVABILITY_ENABLED` | `true` | Activate ADOT pipeline |
| `AWS_REGION` | `<YOUR-REGION>` | AWS Region |

```python
%%writefile .env
# AWS OpenTelemetry Distribution
OTEL_PYTHON_DISTRO=aws_distro
OTEL_PYTHON_CONFIGURATOR=aws_configurator

# Export Protocol
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_TRACES_EXPORTER=otlp

# CloudWatch Integration (uncomment and configure as needed)
OTEL_EXPORTER_OTLP_LOGS_HEADERS=x-aws-log-group=agents/strands-agent-logs,x-aws-log-stream=default,x-aws-metric-namespace=bedrock-agentcore

# Service Identification
OTEL_RESOURCE_ATTRIBUTES=service.name=agentic-travel-strands

# Enable Agent Observability
AGENT_OBSERVABILITY_ENABLED=true
```

## 3. Load Environment Variables

Let's load the environment variables from the `.env` file:

```python
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Display the OTEL-related environment variables
otel_vars = [
    "OTEL_PYTHON_DISTRO",
    "OTEL_PYTHON_CONFIGURATOR",
    "OTEL_EXPORTER_OTLP_PROTOCOL",
    "OTEL_EXPORTER_OTLP_LOGS_HEADERS",
    "OTEL_RESOURCE_ATTRIBUTES",
    "AGENT_OBSERVABILITY_ENABLED",
    "OTEL_TRACES_EXPORTER",
]

print("OpenTelemetry Configuration:")
for var in otel_vars:
    value = os.getenv(var)
    if value:
        print(f"{var}={value}")
```

## 4. Create a Strands Agent in a python file

Strands Travzel Agent implementation is provided in `strands_travel_agent.py`. It is a Travel Agent set up with the model from Amazon Bedrock. The AWS OpenTelemetry distro will automatically handle tracer provider setup when using `opentelemetry-instrument` command.

The agent is a simple travel recommendation agent that:

- Creates a single AI agent called "Travel Destination Researcher" using AWS Bedrock's Claude Haiku model
- Assigns this agent the goal of finding destinations that match user preferences
- Gives the agent a task to research and recommend travel destinations specifically for someone interested in "cowboy vibes, rodeos, and museums"
- Runs the agent and returns a list of recommended destinations with brief descriptions

The Agent is Configured with the following: 

- A system prompt that defines the agent's role as an experienced travel agent
- A web search tool for finding current information
- Amazon Bedrock's Claude Haiku model as it's Large Language Model.

The agent is executed directly using the agent call method.

```python
%%writefile strands_travel_agent.py
###########################
#### Agent Code below: ####
###########################
import os
import logging
from strands import Agent, tool
from strands.models import BedrockModel
from ddgs import DDGS

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Strands logging
logging.getLogger("strands").setLevel(logging.INFO)


@tool
def web_search(query: str) -> str:
    """Search the web for current information about travel destinations, attractions, and events."""
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
        return f"Search error: {str(e)}"

def get_bedrock_model():
    model_id = os.getenv("BEDROCK_MODEL_ID", "global.anthropic.claude-haiku-4-5-20251001-v1:0")
    region = os.getenv("AWS_DEFAULT_REGION", "us-west-2")
    
    try:
        bedrock_model = BedrockModel(
            model_id=model_id,
            region_name=region,
            temperature=0.0,
            max_tokens=1024
        )
        logger.info(f"Successfully initialized Bedrock model: {model_id} in region: {region}")
        return bedrock_model
    except Exception as e:
        logger.error(f"Failed to initialize Bedrock model: {str(e)}")
        logger.error("Please ensure you have proper AWS credentials configured and access to the Bedrock model")
        raise

# Initialize the model
bedrock_model = get_bedrock_model()

# Create the travel agent
travel_agent = Agent(
    model=bedrock_model,
    system_prompt="""You are an experienced travel agent specializing in personalized travel recommendations 
    with access to real-time web information. Your role is to find dream destinations matching user preferences 
    using web search for current information. You should provide comprehensive recommendations with current 
    information, brief descriptions, and practical travel details.""",
    tools=[web_search]
)

# Execute the travel research task
query = """Research and recommend suitable travel destinations for someone looking for cowboy vibes, 
rodeos, and museums in New York city. Use web search to find current information about venues, 
events, and attractions."""

result = travel_agent(query)
print("Result:", result)
```

## 5. AWS OpenTelemetry Python Distro

Now that your environment is configured, let's understand how the observability happens. The [AWS OpenTelemetry Python Distro](https://pypi.org/project/aws-opentelemetry-distro/) automatically instruments your Strands agent to capture telemetry data without requiring code changes.

This distribution provides:
- **Auto-instrumentation** for your Strands Agent hosted outside of AgentCore Runtime (i.e. EC2, Lambda etc..)
- **AWS-optimized configuration** for seamless CloudWatch integration  

### Running Your Instrumented Agent

To capture traces from your Strands agent, use the `opentelemetry-instrument` command instead of running Python directly. This automatically applies instrumentation using the environment variables from your `.env` file:

```bash
opentelemetry-instrument python strands_travel_agent.py
```

This command will:

- Load your OTEL configuration from the .env file
- Automatically instrument Strands, Amazon Bedrock calls, agent tool and databases, and other requests made by agent
- Send traces to CloudWatch
- Enable you to visualize the agent's decision-making process in the GenAI Observability dashboard

```python
!opentelemetry-instrument python strands_travel_agent.py
```

## 6. Adding Session Tracking

To correlate traces across multiple agent runs, you can associate a session ID with your telemetry data using OpenTelemetry baggage:

```python
from opentelemetry import baggage, context
ctx = baggage.set_baggage("session.id", session_id)
```

Run the session-enabled version:
```bash
opentelemetry-instrument python strands_travel_agent_with_session.py --session-id "user-session-123"
```

## 7. Custom Metadata for Analysis
Add custom attributes to enable filtering, offline evaluations, and performance analysis. You would need to modify your agent code to accept additional parameters:
```python
ctx = baggage.set_baggage("user.type", "premium")
ctx = baggage.set_baggage("experiment.id", "travel-agent-v2")
ctx = baggage.set_baggage("conversation.topic", "business-travel")
```

Example commands with custom metadata:

```bash
# A/B testing different experiments
opentelemetry-instrument python agent.py --session-id "session-123" --experiment-id "model-a"
opentelemetry-instrument python agent.py --session-id "session-124" --experiment-id "model-b"

# Tracking different user types
opentelemetry-instrument python agent.py --session-id "session-125" --user-type "premium"
opentelemetry-instrument python agent.py --session-id "session-126" --user-type "free"

# Offline evaluation runs
opentelemetry-instrument python agent.py --session-id "eval-001" --dataset "golden-set-v1"
```
These attributes appear in CloudWatch traces for advanced filtering and analysis.

```python
%%writefile strands_travel_agent_with_session.py
import os
import logging
import sys
import argparse
from opentelemetry import baggage, context

def parse_arguments():
    parser = argparse.ArgumentParser(description='Strands Travel Agent with Session Tracking')
    parser.add_argument('--session-id', 
                       type=str, 
                       required=True,
                       help='Session ID to associate with this agent run')
    return parser.parse_args()

def set_session_context(session_id):
    """Set the session ID in OpenTelemetry baggage for trace correlation"""
    ctx = baggage.set_baggage("session.id", session_id)
    token = context.attach(ctx)
    logging.info(f"Session ID '{session_id}' attached to telemetry context")
    return token

###########################
#### Agent Code below: ####
###########################

from strands import Agent, tool
from strands.models import BedrockModel
from ddgs import DDGS

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Strands logging
logging.getLogger("strands").setLevel(logging.INFO)

@tool
def web_search(query: str) -> str:
    """Search the web for current information about travel destinations, attractions, and events."""
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
        return f"Search error: {str(e)}"

def get_bedrock_model():
    model_id = os.getenv("BEDROCK_MODEL_ID", "global.anthropic.claude-haiku-4-5-20251001-v1:0")
    region = os.getenv("AWS_DEFAULT_REGION", "us-west-2")
    
    try:
        bedrock_model = BedrockModel(
            model_id=model_id,
            region_name=region,
            temperature=0.7,
            max_tokens=1024
        )
        logger.info(f"Successfully initialized Bedrock model: {model_id} in region: {region}")
        return bedrock_model
    except Exception as e:
        logger.error(f"Failed to initialize Bedrock model: {str(e)}")
        logger.error("Please ensure you have proper AWS credentials configured and access to the Bedrock model")
        raise

def main():
    # Parse command line arguments
    args = parse_arguments()
    
    # Set session context for telemetry
    context_token = set_session_context(args.session_id)
    
    try:
        # Initialize Bedrock model
        bedrock_model = get_bedrock_model()

        # Create travel agent
        travel_agent = Agent(
            model=bedrock_model,
            system_prompt="""You are an experienced travel agent specializing in personalized travel recommendations 
            with access to real-time web information. Your role is to find dream destinations matching user preferences 
            using web search for current information. You should provide comprehensive recommendations with current 
            information, brief descriptions, and practical travel details.""",
            tools=[web_search],
            trace_attributes={
                "user.id": "user@domain.com",
                "tags": ["Strands", "Observability"],
            }
        )

        # Execute the travel research task
        query = """Research and recommend suitable travel destinations for someone looking for cowboy vibes, 
        rodeos, and museums in New York city. Use web search to find current information about venues, 
        events, and attractions."""

        result = travel_agent(query)
        print("Result:", result)
        
    finally:
        # Detach context when done
        context.detach(context_token)
        logger.info(f"Session context for '{args.session_id}' detached")

if __name__ == "__main__":
    main()
```

```python
!opentelemetry-instrument python strands_travel_agent_with_session.py --session-id "session-1234"
```

## 8. Gen AI Observability Dashboard Understanding the Traces in AWS CloudWatch

Once your Strands agent runs with OpenTelemetry instrumentation, you can visualize and analyze the traces in AWS CloudWatch's GenAI Observability dashboard. Navigate to Bedrock Agentcore and click on the Agent you just created.

#### Sessions View Page:




#### Trace View Page:
Trace View:




Trace details:



## 9. Troubleshooting

If you're not seeing traces in Amazon CloudWatch or X-Ray, check the following:

1. **AWS Credentials**: Ensure your AWS credentials are properly configured
2. **IAM Permissions**: Make sure your IAM user/role has permissions for CloudWatch
3. **Region**: Confirm you're looking in the correct AWS region
4. **Environment Variables**: Verify all OTEL_* environment variables are set correctly

## 10. Conclusion 

Congratulations you implemented and instrumented a Strands Agent SDK with Amazon Bedrock Model which has observability through Amazon CloudWatch.

- Strands travel agent.
- Full OpenTelemetry tracing
- Traces for Amazon Bedrock calls, Strands operations, etc.
- Service name: agentic-travel-agent

## 11. Next Steps

Now that you have CrewAI with OpenTelemetry set up, you can:

1. **Add More Agents**: Create a multi-agent architectures with different patterns
2. **Add Tools to your agent**: Integrate search tools, API tools, or custom tools
3. **[Set Up Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)**: Create alarms on the metrics that are important to your business like `latency`, `token input`, and `token output` etc..
