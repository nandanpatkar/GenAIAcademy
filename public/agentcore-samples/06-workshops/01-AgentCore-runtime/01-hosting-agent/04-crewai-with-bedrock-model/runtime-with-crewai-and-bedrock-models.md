# Hosting CrewAI multi-agent crew with Amazon Bedrock models in Amazon Bedrock AgentCore Runtime

## Overview

In this tutorial we will learn how to host your existing multi-agent crew, using Amazon Bedrock AgentCore Runtime. 

We will focus on a CrewAI with Amazon Bedrock model example. For Strands Agents with Amazon Bedrock model check [here](../01-strands-with-bedrock-model) and for a Strands Agents with an OpenAI model check [here](../03-strands-with-openai-model).


### Tutorial Details

| Information | Details |
|:--------------------|:-----------------------------------------------------------------------------|
| Tutorial type | Conversational |
| Agent type | Multi-agent crew |
| Agentic Framework | CrewAI |
| LLM model | Anthropic Claude Haiku 4.5 |
| Tutorial components | Hosting agent on AgentCore Runtime. Using CrewAI and Amazon Bedrock Model |
| Tutorial vertical | Cross-vertical |
| Example complexity | Easy |
| SDK used | Amazon BedrockAgentCore Python SDK and boto3 |

### Tutorial Architecture

In this tutorial we will describe how to deploy an existing multi-agent crew to AgentCore runtime. 

For demonstration purposes, we will use a CrewAI crew using Amazon Bedrock models

In our example we will use a research crew with two agents: a researcher and an analyst.
<div style="text-align:left">
     width="60%"/>
</div>


### Tutorial Key Features

* Hosting Agents on Amazon Bedrock AgentCore Runtime
* Using Amazon Bedrock models
* Using CrewAI

## Prerequisites

To execute this tutorial you will need:
* Python 3.10+
* uv package manager
* AWS credentials
* Docker running

Further, we need to install a few dependencies: 
* Amazon Bedrock AgentCore SDK
* CrewAI 
* Langchain community package
* Duckduckgo search

We have packaged all necessary dependencies in a pyproject.toml file so they can be installed conveniently.

```python
!uv sync --active --force-reinstall
```

## Creating your multi-agent crew and experimenting locally

Before we deploy our agents to AgentCore Runtime, let's develop and run them locally for experimentation purposes.

In this guide, we’ll walk through creating a research crew that will help us research and analyze a topic, then create a comprehensive report. This practical example demonstrates how AI agents can collaborate to accomplish complex tasks. The example is adapted from a [getting started guide](https://docs.crewai.com/en/guides/crews/first-crew) provided directly by CrewAI.

The local architecture looks as following:

<div style="text-align:left">
     width="60%"/>
</div>


### Defining agents, tasks, crew

We will first create the artifacts defining a local CrewAI agent, including: 
* agents.yaml, defining the two agents involved in our crew
* tasks.yaml, defining the tasks to be executed by the agents in our crew
* crew.py, defining our crew consisting of agents working on tasks as defined
* main.py, our local entrypoint kicking off the crew run

```python
import os

os.makedirs("research_crew/config", exist_ok=True)
```

```python
%%writefile research_crew/config/agents.yaml
researcher:
  role: >
    Senior Research Specialist for {topic}
  goal: >
    Find comprehensive and accurate information about {topic}
    with a focus on recent developments and key insights
  backstory: >
    You are an experienced research specialist with a talent for
    finding relevant information from various sources. You excel at
    organizing information in a clear and structured manner, making
    complex topics accessible to others.
  llm: bedrock/global.anthropic.claude-haiku-4-5-20251001-v1:0

analyst:
  role: >
    Data Analyst and Report Writer for {topic}
  goal: >
    Analyze research findings and create a comprehensive, well-structured
    report that presents insights in a clear and engaging way
  backstory: >
    You are a skilled analyst with a background in data interpretation
    and technical writing. You have a talent for identifying patterns
    and extracting meaningful insights from research data, then
    communicating those insights effectively through well-crafted reports.
  llm: bedrock/global.anthropic.claude-haiku-4-5-20251001-v1:0
```

```python
%%writefile research_crew/config/tasks.yaml
research_task:
  description: >
    Conduct thorough research on {topic}. Focus on:
    1. Key concepts and definitions
    2. Historical development and recent trends
    3. Major challenges and opportunities
    4. Notable applications or case studies
    5. Future outlook and potential developments

    Make sure to organize your findings in a structured format with clear sections.
  expected_output: >
    A comprehensive research document with well-organized sections covering
    all the requested aspects of {topic}. Include specific facts, figures,
    and examples where relevant.
  agent: researcher

analysis_task:
  description: >
    Analyze the research findings and create a comprehensive report on {topic}.
    Your report should:
    1. State the topic and begin with an executive summary
    2. Include all key information from the research
    3. Provide insightful analysis of trends and patterns
    4. Offer recommendations or future considerations
    5. Be formatted in a professional, easy-to-read style with clear headings
  expected_output: >
    A polished, professional report on {topic} that presents the research
    findings with added analysis and insights. The report should be well-structured
    with an executive summary, main sections, and conclusion.
  agent: analyst
  context:
    - research_task
```

```python
%%writefile research_crew/crew.py
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from langchain_community.tools import DuckDuckGoSearchRun
from crewai.tools import BaseTool
from crewai_tools import SerperDevTool
from pydantic import Field


class SearchTool(BaseTool):
     name: str = "Search"
     description: str = "Useful for searching the web for information."
     search: DuckDuckGoSearchRun = Field(default_factory=DuckDuckGoSearchRun)

     def _run(self, query: str) -> str:
         """Execute the search query and return results"""
         try:
             return self.search.invoke(query)
         except Exception as e:
             return f"Error performing search: {str(e)}"

@CrewBase
class ResearchCrew():
    """Research crew for comprehensive topic analysis and reporting"""

    agents: List[BaseAgent]
    tasks: List[Task]

    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config['researcher'], # type: ignore[index]
            verbose=True,
            tools=[
                #SerperDevTool()
                SearchTool()
                ]
        )

    @agent
    def analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['analyst'], # type: ignore[index]
            verbose=True
        )

    @task
    def research_task(self) -> Task:
        return Task(
            config=self.tasks_config['research_task'] # type: ignore[index]
        )

    @task
    def analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config['analysis_task'], # type: ignore[index]
            #output_file='output/report.md'
        )

    @crew
    def crew(self) -> Crew:
        """Creates the research crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
```

```python
%%writefile research_crew/main.py
import os
from research_crew.crew import ResearchCrew

# Create output directory if it doesn't exist
os.makedirs('output', exist_ok=True)

def run():
    """
    Run the research crew.
    """
    inputs = {
        'topic': 'Artificial Intelligence in Healthcare'
    }

    # Create and run the crew
    result = ResearchCrew().crew().kickoff(inputs=inputs)

    # Print the result
    print("\n\n=== FINAL REPORT ===\n\n")
    print(result.raw)


if __name__ == "__main__":
    run()
```

### Invoking crew locally

Finally, we can use the CrewAI CLI to lockally kick off the crew. Alternatively, we could also simply run our local entrypoint main.py. This might take a few minutes.

```python
!crewai run
```

## Deploying multi-agent crew to Amazon Bedrock AgentCore

For production-grade agentic applications we will need to run our crew in the cloud. Therefor we will deploy our crew to Amazon Bedrock AgentCore. 

The architecture here will look as following:

<div style="text-align:left">
      width="60%"/>
</div>

Deploying the crew to AgentCore takes the following steps: 

### Remote entrypoint

First, we create a remote entrypoint. With AgentCore Runtime, we will decorate the invocation part of our agent with the @app.entrypoint decorator and have it as the entry point for our runtime. This also involves: 
* Import the Runtime App with `from bedrock_agentcore.runtime import BedrockAgentCoreApp`
* Initialize the App in our code with `app = BedrockAgentCoreApp()`
* Decorate the invocation function with the `@app.entrypoint` decorator
* Let AgentCoreRuntime control the running of the agent with `app.run()`

### What happens behind the scenes?

When you use `BedrockAgentCoreApp`, it automatically:

* Creates an HTTP server that listens on the port 8080
* Implements the required `/invocations` endpoint for processing the agent's requirements
* Implements the `/ping` endpoint for health checks (very important for asynchronous agents)
* Handles proper content types and response formats
* Manages error handling according to the AWS standards

```python
%%writefile research_crew/research_crew.py
import os
from research_crew.crew import ResearchCrew

# ---------- Agentcore imports --------------------
from bedrock_agentcore.runtime import BedrockAgentCoreApp

app = BedrockAgentCoreApp()
#------------------------------------------------


@app.entrypoint
def agent_invocation(payload, context):
    """Handler for agent invocation"""
    print(f'Payload: {payload}')
    try: 
        # Extract user message from payload with default
        user_message = payload.get("prompt", "Artificial Intelligence in Healthcare")
        print(f"Processing topic: {user_message}")
        
        # Create crew instance and run synchronously
        research_crew_instance = ResearchCrew()
        crew = research_crew_instance.crew()
        
        # Use synchronous kickoff instead of async - this avoids all event loop issues
        result = crew.kickoff(inputs={'topic': user_message})

        print("Context:\n-------\n", context)
        print("Result Raw:\n*******\n", result.raw)
        
        # Safely access json_dict if it exists
        if hasattr(result, 'json_dict'):
            print("Result JSON:\n*******\n", result.json_dict)
        
        return {"result": result.raw}
        
    except Exception as e:
        print(f'Exception occurred: {e}')
        return {"error": f"An error occurred: {str(e)}"}

if __name__ == "__main__":
    app.run()
```

### Deploying the agent to AgentCore Runtime

The `CreateAgentRuntime` operation supports comprehensive configuration options, letting you specify container images, environment variables and encryption settings. You can also configure protocol settings (HTTP, MCP) and authorization mechanisms to control how your clients communicate with the agent. 

**Note:** Operations best practice is to package code as container and push to ECR using CI/CD pipelines and IaC

In this tutorial can will the Amazon Bedrock AgentCode Python SDK to easily package your artifacts and deploy them to AgentCore runtime.

#### Configure AgentCore Runtime deployment

First we will use our starter toolkit to configure the AgentCore Runtime deployment with an entrypoint, the execution role we just created and a requirements file. We will also configure the starter kit to auto create the Amazon ECR repository on launch.

AgentCore configure is required to generate a Dockerfile holding a blueprint for the Docker container the workload will be running in and a .bedrock_agentcore.yaml holding the agentic workload's configuration. During the configure step, your docker file will be generated based on your application code.

<div style="text-align:left">
    <img src="images/configure.png" width="60%"/>
</div>

```python
from bedrock_agentcore_starter_toolkit import Runtime
from boto3.session import Session

boto_session = Session()
region = boto_session.region_name

agentcore_runtime = Runtime()
agent_name = "research_crew_getting_started"
response = agentcore_runtime.configure(
    entrypoint="research_crew/research_crew.py",
    auto_create_execution_role=True,
    auto_create_ecr=True,
    region=region,
    agent_name=agent_name,
)
response
```

#### Launching agent to AgentCore Runtime: deploying the remote agentic workload

Now that we've got a docker file, let's launch the agent to the AgentCore Runtime. This will create the Amazon ECR repository and the AgentCore Runtime. AgentCore launch will then deploy the agentic workload to the cloud. This includes creating a Docker image and pushing it to ECR, as well as getting an endpoint ready for usage.


<div style="text-align:left">
    <img src="images/launch.png" width="85%"/>
</div>

```python
launch_result = agentcore_runtime.launch()
```

#### Checking for the AgentCore Runtime Status

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

### Invoking AgentCore Runtime with boto3

Now that your AgentCore Runtime was created you can invoke it with any AWS SDK. For instance, you can use the boto3 `invoke_agent_runtime` method for it. Since this is a long running agent we are overwriting the default `retries`, `connect_timout`and `read_timeout`.

<div style="text-align:left">
    <img src="images/invoke.png" width=85%"/>
</div>

```python
from botocore.config import Config

# Configure retries and timeout
config = Config(
    retries={
        "max_attempts": 10,  # Increase max retries to 10 (default is 4)
        "mode": "adaptive",  # Options: 'legacy', 'standard', 'adaptive'
    },
    connect_timeout=600,  # Connection timeout in seconds (default is 60)
    read_timeout=3000,  # Read timeout in seconds (default is 60)
)
```

```python
import boto3
import json
from IPython.display import Markdown, display

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
    result = json.loads(events[0].decode("utf-8")) if events else "No response"
    display(Markdown(result if isinstance(result, str) else json.dumps(result, indent=2)))
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

### Lifecycle Configuration Demo (Active)

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
agent_name_short = "crewai_claude_short_timeout"

# Configure with shorter idle timeout
response_short = agentcore_runtime_short.configure(
    entrypoint="research_crew/research_crew.py",
    auto_create_execution_role=True,
    auto_create_ecr=True,
    requirements_file="research_crew/requirements.txt",
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
```

## Congratulations!
