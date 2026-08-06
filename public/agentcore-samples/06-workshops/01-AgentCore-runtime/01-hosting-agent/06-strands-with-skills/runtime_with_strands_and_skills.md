# Strands Agent with AgentSkills Plugin on Amazon Bedrock AgentCore Runtime

## Overview

This tutorial demonstrates how to build a Strands agent using the `AgentSkills` plugin for on-demand specialized instructions, run it locally, and deploy it to Amazon Bedrock AgentCore Runtime.

The `AgentSkills` plugin supports two ways to define skills: **file-based** (a `SKILL.md` file with YAML frontmatter) and **programmatic** (a `Skill` object defined inline in Python). Both approaches can be mixed in the same agent.

We will walk through two example skills — a **weather-reporter** skill defined as a file-based `SKILL.md`, and a **math-tutor** skill defined programmatically using the `Skill` class. We will first experiment locally, then deploy the agent to AgentCore Runtime.

### Tutorial Details

| Field | Value |
|---|---|
| Tutorial type | Jupyter Notebook |
| Agent type | Strands Agent with AgentSkills Plugin |
| Agentic Framework | Strands Agents |
| LLM model | Amazon Bedrock (Claude Haiku 4.5) |
| Tutorial components | Skills (SKILL.md), AgentSkills Plugin, Local Experimentation, AgentCore Runtime Deployment |
| Tutorial vertical | General / Developer Education |
| Example complexity | Intermediate |
| SDK used | bedrock-agentcore-starter-toolkit, strands-agents |

### Tutorial Architecture

The agent uses the `AgentSkills` plugin which scans a `skills/` directory. Each skill is a `SKILL.md` file with YAML frontmatter (`name`, `description`, `allowed-tools`) and markdown instructions. The agent selects the appropriate skill based on the user's request.

Two example skills are provided:
- **weather-reporter**: Defined as a file-based `SKILL.md`. Paired with a custom `@tool` weather function, formats weather information with emoji, temperature ranges, and activity recommendations.
- **math-tutor**: Defined programmatically using the `Skill` class (no file needed). Paired with the `calculator` tool from `strands-agents-tools`, solves math problems step-by-step showing all work.

### Tutorial Key Features

* Two skill definition approaches: file-based (`SKILL.md`) and programmatic (`Skill` class)
* Mixing file-based and programmatic skills in a single `AgentSkills` plugin
* On-demand skill activation based on user intent
* Local experimentation before cloud deployment
* Seamless deployment to Amazon Bedrock AgentCore Runtime

## Prerequisites

To execute this tutorial you will need:
* Python 3.10+
* AWS credentials configured (`aws configure`)
* Amazon Bedrock AgentCore SDK (`bedrock-agentcore`, `bedrock-agentcore-starter-toolkit`)
* Strands Agents (`strands-agents`, `strands-agents-tools`)
* Access to Amazon Bedrock models (Claude Haiku 4.5)
* Docker or Finch (for AgentCore Runtime deployment)

```python
%pip install -r requirements.txt
```

## Skill Creation Approaches

The `AgentSkills` plugin supports two ways to define skills. This tutorial demonstrates both.

### Approach 1: File-based skill (SKILL.md)

A file-based skill is a directory containing a `SKILL.md` file with YAML frontmatter and a markdown instruction body. This approach is ideal for skills you want to version-control, share across projects, or edit without touching Python code.

```
skills/
└── weather-reporter/
    └── SKILL.md
```

**SKILL.md format:**
```markdown
---
name: skill-name
description: Short description used by the agent to decide when to activate this skill
allowed-tools:
  - tool_name
---

# Skill Instructions

Markdown body with behavioral instructions for the agent.
```

The YAML frontmatter fields:
- `name`: Unique identifier for the skill (kebab-case)
- `description`: Human-readable description used by the agent to decide when to activate the skill
- `allowed-tools`: List of tool names the skill is permitted to use

```python
import os

os.makedirs("skills/weather-reporter", exist_ok=True)
```

```python
%%writefile skills/weather-reporter/SKILL.md
---
name: weather-reporter
description: Format weather information with emoji, temperature ranges, and activity recommendations
allowed-tools:
  - weather
---

# Weather Reporter Instructions

You are a friendly weather reporter. When presenting weather information:

1. **Use weather emoji** to make the report visually engaging:
   - ☀️ for sunny/clear conditions
   - 🌧️ for rain
   - ⛅ for partly cloudy
   - 🌩️ for thunderstorms
   - ❄️ for snow
   - 🌫️ for fog/mist

2. **Include temperature ranges** in both Fahrenheit and Celsius

3. **Provide activity recommendations** based on the conditions:
   - Suggest outdoor activities for good weather
   - Recommend indoor alternatives for bad weather
   - Include clothing suggestions (e.g., "bring an umbrella", "wear a light jacket")

4. **Format your response** as a friendly weather report with clear sections for current conditions and recommendations.
```

### Approach 2: Programmatic skill (Skill class)

A programmatic skill is defined inline in Python using the `Skill` class — no directory or file needed. This is convenient for simple skills, dynamic skill generation, or when you want to keep everything in one script.

```python
from strands import Skill

math_tutor = Skill(
    name="math-tutor",
    description="Solve math problems step-by-step, showing all work",
    instructions="Break down math problems into clear steps. Show all intermediate calculations and explain your reasoning at each step.",
)
```

Both skill types are passed to `AgentSkills` in the same `skills` list — you can freely mix file-based and programmatic skills:

```python
from strands import AgentSkills

plugin = AgentSkills(skills=["./skills/weather-reporter", math_tutor])
```

The `math-tutor` skill will be defined programmatically in the agent script below.

## Local Agent Experimentation

Before deploying to AgentCore Runtime, we'll run the agent locally to verify that the skills work as expected.

The agent uses `BedrockModel` with Claude Haiku 4.5 and loads skills from the `skills/` directory via the `AgentSkills` plugin. Running locally lets you iterate quickly on skill definitions and agent behavior without a full deployment cycle.

## Deploying to Amazon Bedrock AgentCore Runtime

Now that we've verified the agent works locally, we'll deploy it to Amazon Bedrock AgentCore Runtime. The deployment version of the agent script wraps the same logic with `BedrockAgentCoreApp`, which exposes `/invocations` and `/ping` HTTP endpoints.

The `bedrock-agentcore-starter-toolkit` packages the agent script, the `skills/` directory, and all dependencies into a Docker container, pushes it to Amazon ECR, and creates the AgentCore Runtime endpoint automatically.

> **Note:** Make sure Docker or Finch is running before proceeding with deployment.

```python
import os
import boto3

AWS_PROFILE = "REPLACE-ME"
REGION = "REPLACE-ME"

os.environ["AWS_PROFILE"] = AWS_PROFILE
os.environ["AWS_DEFAULT_REGION"] = REGION

# Force boto3 to use the new profile by resetting the default session
boto3.setup_default_session(profile_name=AWS_PROFILE, region_name=REGION)

# Verify credentials are valid
identity = boto3.client("sts").get_caller_identity()
print(f"Account: {identity['Account']}, Region: {REGION}")
```

```python
%%writefile agent_with_skills.py
from strands import Agent, tool, AgentSkills, Skill
from strands_tools import calculator
from strands.models import BedrockModel
from bedrock_agentcore.runtime import BedrockAgentCoreApp

@tool
def weather() -> dict:
    """Get current weather information."""
    return {
        "condition": "sunny",
        "temp_f": 75,
        "temp_c": 24,
        "humidity": 45,
        "wind_mph": 10
    }

# Programmatic skill — defined inline, no SKILL.md file needed
math_tutor = Skill(
    name="math-tutor",
    description="Solve math problems step-by-step, showing all work and explaining reasoning",
    instructions=(
        "You are a patient and thorough math tutor. When solving math problems:\n"
        "1. Break down the problem into clear, numbered steps.\n"
        "2. Show all intermediate calculations — never skip steps.\n"
        "3. Explain your reasoning at each step, identifying the mathematical concept applied.\n"
        "4. Use the calculator tool for arithmetic to ensure accuracy.\n"
        "5. Verify your answer against the original problem.\n"
        "6. Summarize with a clear final answer."
    ),
)

model = BedrockModel(model_id="global.anthropic.claude-haiku-4-5-20251001-v1:0")
# Mix file-based skill (weather-reporter) with programmatic skill (math_tutor)
skills = AgentSkills(skills=["./skills/weather-reporter", math_tutor])
agent = Agent(model=model, tools=[calculator, weather], plugins=[skills])

app = BedrockAgentCoreApp()

@app.entrypoint
def invoke_agent(payload: dict) -> str:
    response = agent(payload.get("prompt", ""))
    return response.message['content'][0]['text']

if __name__ == "__main__":
    app.run()
```

## Configure and Launch the AgentCore Runtime

Use the `Runtime` class from `bedrock-agentcore-starter-toolkit` to configure the deployment. Setting `auto_create_execution_role=True` and `auto_create_ecr=True` lets the toolkit create the required IAM role and ECR repository automatically.

The `launch()` call builds the Docker image, pushes it to ECR, and creates the AgentCore Runtime endpoint. This may take a few minutes.

```python
import boto3
from bedrock_agentcore_starter_toolkit import Runtime

agentcore_runtime = Runtime()
agentcore_runtime.configure(
    entrypoint="agent_with_skills.py",
    auto_create_execution_role=True,
    auto_create_ecr=True,
    requirements_file="requirements.txt",
    agent_name="strands_skills_tutorial",
    region=REGION,
)
print("Configuration complete.")
```

```python
launch_result = agentcore_runtime.launch()
print("Launch initiated. Waiting for runtime to become READY...")
```

```python
import time

terminal_states = ["READY", "CREATE_FAILED", "UPDATE_FAILED", "DELETE_FAILED"]

status_response = agentcore_runtime.status()
current_status = status_response.endpoint["status"]
print(f"Status: {current_status}")

while current_status not in terminal_states:
    time.sleep(30)
    status_response = agentcore_runtime.status()
    current_status = status_response.endpoint["status"]
    print(f"Status: {current_status}")

if current_status == "READY":
    print("Runtime is READY. Proceeding to invocation.")
else:
    print(f"Deployment ended with status: {current_status}. Check CloudWatch logs for details.")
```

## Test Weather Skill

```python
# Invoke the deployed runtime with a prompt that triggers skill activation
invoke_payload = {
    "prompt": "What's the weather like today? Give me a full report with emoji and activity recommendations."
}
response = agentcore_runtime.invoke(invoke_payload)
response_text = "".join(response["response"])
print(response_text)
```

```python
from IPython.display import Markdown, display

# Extract and display the response text
response_text = "".join(response["response"])
# Strip surrounding quotes and replace escaped newlines
response_text = response_text.strip('"').replace("\\n", "\n")
display(Markdown(response_text))
```

## Test Math Skill

```python
# Invoke the deployed runtime with a prompt that triggers skill activation
invoke_payload = {"prompt": "help me solve 23+458*89"}
response = agentcore_runtime.invoke(invoke_payload)
response_text = "".join(response["response"])
print(response_text)
```

## Cleanup

Let's now clean up the AgentCore Runtime and associated resources. We delete the runtime first to avoid undesired costs, then clean up supporting resources like the ECR repository.

```python
import boto3

agent_name = "strands_skills_tutorial"

agentcore_control_client = boto3.client("bedrock-agentcore-control", region_name=REGION)

# Look up agent_id by name in case this cell runs independently
runtimes = agentcore_control_client.list_agent_runtimes()
agent_id = next(
    (r["agentRuntimeId"] for r in runtimes["agentRuntimes"] if r["agentRuntimeName"] == agent_name),
    None,
)

if not agent_id:
    print(f"⚠️ No runtime found with name '{agent_name}'")
else:
    # Delete the AgentCore Runtime
    try:
        agentcore_control_client.delete_agent_runtime(agentRuntimeId=agent_id)
        print(f"✅ Runtime '{agent_name}' ({agent_id}) deleted")
    except Exception as e:
        print(f"⚠️ Failed to delete runtime: {e}")
```

```python
ecr_client = boto3.client("ecr", region_name=REGION)
REPO_NAME = "bedrock-agentcore-strands_skills_tutorial"
# REPO_NAME = launch_result.ecr_uri.split('/')[1]

# Delete the ECR repository created during deployment
try:
    ecr_client.delete_repository(repositoryName=REPO_NAME, force=True)
    print(f"✅ ECR repository '{REPO_NAME}' deleted")
except Exception as e:
    print(f"⚠️ Failed to delete ECR repository: {e}")
```
