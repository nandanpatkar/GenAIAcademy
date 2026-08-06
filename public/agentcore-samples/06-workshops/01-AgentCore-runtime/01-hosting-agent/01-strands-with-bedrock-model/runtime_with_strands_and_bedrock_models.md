# Hosting Strands Agents with Amazon Bedrock models in Amazon Bedrock AgentCore Runtime

## Overview

In this tutorial we will learn how to host your existing agent, using Amazon Bedrock AgentCore Runtime. We will provide examples using Amazon Bedrock models and non-Bedrock models such as Azure OpenAI and Gemini.


### Tutorial Details


| Information         | Details                                                                          |
|:--------------------|:---------------------------------------------------------------------------------|
| Tutorial type       | Conversational                                                                   |
| Agent type          | Single                                                                           |
| Agentic Framework   | Strands Agents                                                                   |
| LLM model           | Anthropic Claude Haiku 4.5                                                        |
| Tutorial components | Hosting agent on AgentCore Runtime. Using Strands Agent and Amazon Bedrock Model |
| Tutorial vertical   | Cross-vertical                                                                   |
| Example complexity  | Easy                                                                             |
| SDK used            | Amazon BedrockAgentCore Python SDK and boto3                                     |

### Tutorial Architecture

In this tutorial we will describe how to deploy an existing agent to AgentCore runtime. 

For demonstration purposes, we will  use a Strands Agent using Amazon Bedrock models

In our example we will use a very simple agent with two tools: `get_weather` and `get_time`. 

<div style="text-align:left">
    <img src="images/architecture_runtime.png" width="50%"/>
</div>

### Tutorial Key Features

* Hosting Agents on Amazon Bedrock AgentCore Runtime
* Using Amazon Bedrock models
* Using Strands Agents

## Prerequisites

To execute this tutorial you will need:
* Python 3.10+
* AWS credentials
* Amazon Bedrock AgentCore SDK
* Strands Agents

```python
!pip install --force-reinstall -U -r requirements.txt --quiet
```

## Creating your agents and experimenting locally

Before we deploy our agents to AgentCore Runtime, let's develop and run them locally for experimentation purposes.

For production agentic applications we will need to decouple the agent creation process from the agent invocation one. With AgentCore Runtime, we will decorate the invocation part of our agent with the `@app.entrypoint` decorator and have it as the entry point for our runtime. Let's first look how each agent is developed during the experimentation phase.

The architecture here will look as following:

<div style="text-align:left">
    <img src="images/architecture_local.png" width="50%"/>
</div>

```python
%%writefile strands_claude.py
from strands import Agent, tool
from strands_tools import calculator # Import the calculator tool
import argparse
import json
from strands.models import BedrockModel

# Create a custom tool 
@tool
def weather(city:str):
    """Get weather information.

    Args:
        city: City for which weather will be returned

    Returns:
        Weather of provided city as a string.
    """
    print(city)
    if city.lower() == "athens":
        weather = "very sunny"
    else:
        weather = "sunny"
    return weather


model_id = "global.anthropic.claude-haiku-4-5-20251001-v1:0"
model = BedrockModel(
    model_id=model_id,
)
agent = Agent(
    model=model,
    tools=[calculator, weather],
    system_prompt="You're a helpful assistant. You can do simple math calculation, and tell the weather."
)

def strands_agent_bedrock(payload):
    """
    Invoke the agent with a payload
    """
    user_input = payload.get("prompt")
    response = agent(user_input)
    return response.message['content'][0]['text']

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("payload", type=str)
    args = parser.parse_args()
    response = strands_agent_bedrock(json.loads(args.payload))
```

#### Invoking local agent

```python
!python strands_claude.py '{"prompt": "What is the weather now in Athens ?"}'
```

## Preparing your agent for deployment on AgentCore Runtime

Let's now deploy our agents to AgentCore Runtime. To do so we need to:
* Import the Runtime App with `from bedrock_agentcore.runtime import BedrockAgentCoreApp`
* Initialize the App in our code with `app = BedrockAgentCoreApp()`
* Decorate the invocation function with the `@app.entrypoint` decorator
* Let AgentCoreRuntime control the running of the agent with `app.run()`

### Strands Agents with Amazon Bedrock model
Let's start with our Strands Agent using Amazon Bedrock model. All the others will work exactly the same.

```python
%%writefile strands_claude.py
from strands import Agent, tool
from strands_tools import calculator # Import the calculator tool
import argparse
import json
from bedrock_agentcore.runtime import BedrockAgentCoreApp
from strands.models import BedrockModel

app = BedrockAgentCoreApp()

# Create a custom tool 
@tool
def weather(city:str):
    """Get weather information.

    Args:
        city: City for which weather will be returned

    Returns:
        Weather of provided city as a string.
    """
    print(city)
    if city.lower() == "athens":
        weather = "very sunny"
    else:
        weather = "sunny"
    return weather


model_id = "global.anthropic.claude-haiku-4-5-20251001-v1:0"
model = BedrockModel(
    model_id=model_id,
)
agent = Agent(
    model=model,
    tools=[calculator, weather],
    system_prompt="You're a helpful assistant. You can do simple math calculation, and tell the weather."
)

@app.entrypoint
def strands_agent_bedrock(payload):
    """
    Invoke the agent with a payload
    """
    user_input = payload.get("prompt")
    print("User input:", user_input)
    response = agent(user_input)
    return response.message['content'][0]['text']

if __name__ == "__main__":
    app.run()
```

## What happens behind the scenes?

When you use `BedrockAgentCoreApp`, it automatically:

* Creates an HTTP server that listens on the port 8080
* Implements the required `/invocations` endpoint for processing the agent's requirements
* Implements the `/ping` endpoint for health checks (very important for asynchronous agents)
* Handles proper content types and response formats
* Manages error handling according to the AWS standards

## Deploying the agent to AgentCore Runtime

The `CreateAgentRuntime` operation supports comprehensive configuration options, letting you specify container images, environment variables and encryption settings. You can also configure protocol settings (HTTP, MCP) and authorization mechanisms to control how your clients communicate with the agent. 

**Note:** Operations best practice is to package code as container and push to ECR using CI/CD pipelines and IaC

In this tutorial can will the Amazon Bedrock AgentCore Python SDK to easily package your artifacts and deploy them to AgentCore runtime.

### Configure AgentCore Runtime deployment

First we will use our starter toolkit to configure the AgentCore Runtime deployment with an entrypoint, the execution role we just created and a requirements file. We will also configure the starter kit to auto create the Amazon ECR repository on launch.

During the configure step, your docker file will be generated based on your application code

<div style="text-align:left">
    <img src="images/configure.png" width="60%"/>
</div>

```python
from bedrock_agentcore_starter_toolkit import Runtime
from boto3.session import Session

boto_session = Session()
region = boto_session.region_name

agentcore_runtime = Runtime()
agent_name = "strands_claude_getting_started"
response = agentcore_runtime.configure(
    entrypoint="strands_claude.py",
    auto_create_execution_role=True,
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    region=region,
    agent_name=agent_name,
)
response
```

### Launching agent to AgentCore Runtime

Now that we've got a docker file, let's launch the agent to the AgentCore Runtime. This will create the Amazon ECR repository and the AgentCore Runtime

<div style="text-align:left">
    <img src="images/launch.png" width="75%"/>
</div>

```python
launch_result = agentcore_runtime.launch()
```

### Checking for the AgentCore Runtime Status
Now that we've deployed the AgentCore Runtime, let's check for it's deployment status

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
    <img src="images/invoke.png" width=75%"/>
</div>

```python
invoke_response = agentcore_runtime.invoke({"prompt": "How is the weather now in Athens ?"})
invoke_response
```

### Processing invocation results

We can now process our invocation results to include it in an application

```python
from IPython.display import Markdown, display
import json

response_text = invoke_response["response"][0]
display(Markdown(response_text))
```

### Invoking AgentCore Runtime with boto3

Now that your AgentCore Runtime was created you can invoke it with any AWS SDK. For instance, you can use the boto3 `invoke_agent_runtime` method for it.

```python
import boto3

agent_arn = launch_result.agent_arn
agentcore_client = boto3.client("bedrock-agentcore", region_name=region)

boto3_response = agentcore_client.invoke_agent_runtime(
    agentRuntimeArn=agent_arn,
    qualifier="DEFAULT",
    payload=json.dumps({"prompt": "What is 2+2?"}),
)

# Capture the runtime session ID for lifecycle management
runtime_session_id = boto3_response.get("runtimeSessionId")
print(f"Runtime Session ID: {runtime_session_id}")

if "text/event-stream" in boto3_response.get("contentType", ""):
    content = []
    for line in boto3_response["response"].iter_lines(chunk_size=1):
        if line:
            line = line.decode("utf-8")
            if line.startswith("data: "):
                line = line[6:]
                print(line)
                content.append(line)
    display(Markdown("\n".join(content)))
else:
    try:
        events = []
        for event in boto3_response.get("response", []):
            events.append(event)
    except Exception as e:
        events = [f"Error reading EventStream: {e}"]
    display(Markdown(json.loads(events[0].decode("utf-8"))))
```

### Stopping a Session

You'll want to stop individual sessions when they're no longer needed.
This releases the microVM resources for that session while keeping the runtime alive
for new sessions. Below we demonstrate `stop_runtime_session`.

```python
# --- Inline Session Lifecycle Demo ---
# stop_runtime_session releases the microVM resources for this specific session while keeping the runtime alive for new sessions.


if runtime_session_id:
    agentcore_client.stop_runtime_session(
        agentRuntimeArn=agent_arn,
        runtimeSessionId=runtime_session_id,
        qualifier="DEFAULT",
    )
    print(f"✅ Session '{runtime_session_id}' stopped — microVM resources released")
else:
    print("⚠️ No session ID available to stop")
```

### Lifecycle Configuration Demo
Now let's demonstrate how to configure a runtime with a shorter idle timeout.
We'll create a second runtime with a 5-minute (300 second) idle timeout to show
how lifecycle configuration affects session behavior. Both runtimes will coexist.

```python
# --- Lifecycle Configuration Demo ---
# In production, choose a timeout appropriate for your workload:
#   - Development/testing: 5-15 minutes
#   - Interactive sessions: 30-60 minutes
#   - Long-running workloads: adjust as needed
#

agentcore_runtime_short = Runtime()
agent_name_short = "strands_claude_short_timeout"

# Configure with shorter idle timeout
response_short = agentcore_runtime_short.configure(
    entrypoint="strands_claude.py",
    auto_create_execution_role=True,
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    region=region,
    agent_name=agent_name_short,
)

# Launch the second runtime
launch_result_short = agentcore_runtime_short.launch()
print(f"Second runtime launched: {launch_result_short.agent_id}")

# Wait for it to be ready
status_response_short = agentcore_runtime_short.status()
status_short = status_response_short.endpoint["status"]
while status_short not in ["READY", "CREATE_FAILED", "DELETE_FAILED", "UPDATE_FAILED"]:
    time.sleep(10)
    status_response_short = agentcore_runtime_short.status()
    status_short = status_response_short.endpoint["status"]
    print(f"Short timeout runtime status: {status_short}")

# Now update the runtime with shorter idle timeout using boto3
# UpdateAgentRuntime is a full-replacement API — we must re-supply all required fields.
# First, retrieve the current runtime configuration.
agentcore_control_client = boto3.client("bedrock-agentcore-control", region_name=region)
current_runtime = agentcore_control_client.get_agent_runtime(agentRuntimeId=launch_result_short.agent_id)

update_response = agentcore_control_client.update_agent_runtime(
    agentRuntimeId=launch_result_short.agent_id,
    agentRuntimeArtifact=current_runtime["agentRuntimeArtifact"],
    roleArn=current_runtime["roleArn"],
    networkConfiguration=current_runtime["networkConfiguration"],
    lifecycleConfiguration={
        "idleRuntimeSessionTimeout": 300  # 5 minutes
    },
)
print("✅ Runtime updated with 5-minute idle timeout")

# Invoke the second runtime to verify it works
invoke_response_short = agentcore_runtime_short.invoke({"prompt": "What is 3+3?"})
print(f"Second runtime response: {invoke_response_short['response'][0]}")
```

## Session Lifecycle Best Practices

AgentCore Runtime costs are based on vCPU and Memory. A best practice to avoid undesired costs is to explicitly stop the session or set up a properly configured idle timeout, so the session will be terminated.

To manage costs effectively:

- **Configure idle timeout**: Set an appropriate idle timeout during session creation to automatically stop inactive sessions. Choose a value based on your use case (e.g., shorter for development/testing, longer for production workloads).
- **Stop sessions when done**: Use `stop_runtime_session` to release the microVM resources for a specific session while keeping the runtime alive for new sessions.

## Cleanup

Let's now clean up the AgentCore Runtime and associated resources. We delete the runtime first to avoid undesired costs, then clean up supporting resources like ECR repositories.

```python
launch_result.ecr_uri, launch_result.agent_id, launch_result.ecr_uri.split("/")[1]
```

```python
# --- Stop active sessions to release microVM resources ---
import boto3

agentcore_client = boto3.client("bedrock-agentcore", region_name=region)
agentcore_control_client = boto3.client("bedrock-agentcore-control", region_name=region)
ecr_client = boto3.client("ecr", region_name=region)

# Stop the active session to release its microVM resources
# In production, this is how you end individual user sessions while keeping the runtime alive
# AgentCore Runtime costs are based on vCPU and Memory — stopping sessions avoids undesired costs
# Note: If the session was already stopped in the earlier demo cell, this will raise a
# ResourceNotFoundException — the except block handles that gracefully.
if "runtime_session_id" in locals() and runtime_session_id:
    try:
        agentcore_client.stop_runtime_session(
            agentRuntimeArn=launch_result.agent_arn,
            runtimeSessionId=runtime_session_id,
            qualifier="DEFAULT",
        )
        print(f"✅ Session '{runtime_session_id}' stopped")
    except Exception as e:
        print(f"⚠️ Failed to stop session '{runtime_session_id}': {e}")

# --- Delete both runtimes ---
# Original runtime
try:
    agentcore_control_client.delete_agent_runtime(
        agentRuntimeId=launch_result.agent_id,
    )
    print(f"✅ Original runtime '{launch_result.agent_id}' deleted")
except Exception as e:
    print(f"⚠️ Failed to delete original runtime: {e}")

# Short-timeout runtime
if "launch_result_short" in locals():
    try:
        agentcore_control_client.delete_agent_runtime(
            agentRuntimeId=launch_result_short.agent_id,
        )
        print(f"✅ Short-timeout runtime '{launch_result_short.agent_id}' deleted")
    except Exception as e:
        print(f"⚠️ Failed to delete short-timeout runtime: {e}")

# --- Delete ECR repositories ---
try:
    ecr_client.delete_repository(repositoryName=launch_result.ecr_uri.split("/")[1], force=True)
    print(f"✅ ECR repository '{launch_result.ecr_uri.split('/')[1]}' deleted")
except Exception as e:
    print(f"⚠️ Failed to delete ECR repository: {e}")

if "launch_result_short" in locals():
    try:
        ecr_client.delete_repository(repositoryName=launch_result_short.ecr_uri.split("/")[1], force=True)
        print(f"✅ Second ECR repository '{launch_result_short.ecr_uri.split('/')[1]}' deleted")
    except Exception as e:
        print(f"⚠️ Failed to delete second ECR repository: {e}")

# --- Delete local file to allow for consequtive executions of the notebook ---
try:
    !rm .bedrock_agentcore.yaml
    print("✅ .bedrock_agentcore.yaml deleted")
except Exception as e:
    print(f"⚠️ Failed to delete .bedrock_agentcore.yaml: {e}")
```

# Congratulations!
