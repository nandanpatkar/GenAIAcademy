#### Tab: OpenAI

        👉 Read the [OpenAI chat model integration docs](lc:oss/python/integrations/chat/openai)

        ```shell
        pip install -U "langchain[openai]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"OPENAI_API_KEY\"] = \"sk-...\"\n\nmodel = init_chat_model(\"gpt-5.5\")"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_openai import ChatOpenAI\n\nos.environ[\"OPENAI_API_KEY\"] = \"sk-...\"\n\nmodel = ChatOpenAI(model=\"gpt-5.5\")"
             }
            ]
            ```
        
    
    #### Tab: Anthropic

        👉 Read the [Anthropic chat model integration docs](lc:oss/python/integrations/chat/anthropic)
        ```shell
        pip install -U "langchain[anthropic]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"ANTHROPIC_API_KEY\"] = \"sk-...\"\n\nmodel = init_chat_model(\"claude-sonnet-4-6\")"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_anthropic import ChatAnthropic\n\nos.environ[\"ANTHROPIC_API_KEY\"] = \"sk-...\"\n\nmodel = ChatAnthropic(model=\"claude-sonnet-4-6\")"
             }
            ]
            ```
        
    
    #### Tab: Azure

        👉 Read the [Azure chat model integration docs](lc:oss/python/integrations/chat/azure_chat_openai)
        ```shell
        pip install -U "langchain[openai]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"AZURE_OPENAI_API_KEY\"] = \"...\"\nos.environ[\"AZURE_OPENAI_ENDPOINT\"] = \"...\"\nos.environ[\"OPENAI_API_VERSION\"] = \"2025-03-01-preview\"\n\nmodel = init_chat_model(\n    \"azure_openai:gpt-5.5\",\n    azure_deployment=os.environ[\"AZURE_OPENAI_DEPLOYMENT_NAME\"],\n)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_openai import AzureChatOpenAI\n\nos.environ[\"AZURE_OPENAI_API_KEY\"] = \"...\"\nos.environ[\"AZURE_OPENAI_ENDPOINT\"] = \"...\"\nos.environ[\"OPENAI_API_VERSION\"] = \"2025-03-01-preview\"\n\nmodel = AzureChatOpenAI(\n    model=\"gpt-5.5\",\n    azure_deployment=os.environ[\"AZURE_OPENAI_DEPLOYMENT_NAME\"]\n)"
             }
            ]
            ```
        
    
    #### Tab: Google Gemini

        👉 Read the [Google GenAI chat model integration docs](lc:oss/python/integrations/chat/google_generative_ai)
        ```shell
        pip install -U "langchain[google-genai]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"GOOGLE_API_KEY\"] = \"...\"\n\nmodel = init_chat_model(\"google_genai:gemini-2.5-flash-lite\")"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_google_genai import ChatGoogleGenerativeAI\n\nos.environ[\"GOOGLE_API_KEY\"] = \"...\"\n\nmodel = ChatGoogleGenerativeAI(model=\"gemini-2.5-flash-lite\")"
             }
            ]
            ```
        
    
    #### Tab: AWS Bedrock

        👉 Read the [AWS Bedrock chat model integration docs](lc:oss/python/integrations/chat/bedrock)
        ```shell
        pip install -U "langchain[aws]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\n# Follow the steps here to configure your credentials:\n# https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html\n\nmodel = init_chat_model(\n    \"us.anthropic.claude-sonnet-4-6\",\n    model_provider=\"bedrock_converse\",\n)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_aws import ChatBedrock\n\nmodel = ChatBedrock(model=\"us.anthropic.claude-sonnet-4-6\")"
             }
            ]
            ```
        
    
    #### Tab: HuggingFace

        👉 Read the [HuggingFace chat model integration docs](lc:oss/python/integrations/chat/huggingface)

        ```shell
        pip install -U "langchain[huggingface]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"HUGGINGFACEHUB_API_TOKEN\"] = \"hf_...\"\n\nmodel = init_chat_model(\n    \"microsoft/Phi-3-mini-4k-instruct\",\n    model_provider=\"huggingface\",\n    temperature=0.7,\n    max_tokens=1024,\n)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint\n\nos.environ[\"HUGGINGFACEHUB_API_TOKEN\"] = \"hf_...\"\n\nllm = HuggingFaceEndpoint(\n    repo_id=\"microsoft/Phi-3-mini-4k-instruct\",\n    temperature=0.7,\n    max_length=1024,\n)\nmodel = ChatHuggingFace(llm=llm)"
             }
            ]
            ```
        
    
    #### Tab: OpenRouter

        👉 Read the [OpenRouter chat model integration docs](lc:oss/python/integrations/chat/openrouter)

        ```shell
        pip install -U "langchain-openrouter"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"OPENROUTER_API_KEY\"] = \"sk-...\"\n\nmodel = init_chat_model(\n    \"auto\",\n    model_provider=\"openrouter\",\n)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_openrouter import ChatOpenRouter\n\nos.environ[\"OPENROUTER_API_KEY\"] = \"sk-...\"\n\nmodel = ChatOpenRouter(model=\"auto\")"
             }
            ]
            ```

        
    

The [state machine pattern](lc:oss/python/langchain/multi-agent/handoffs) describes workflows where an agent's behavior changes as it moves through different states of a task. This tutorial shows how to implement a state machine by using tool calls to dynamically change a single agent's configuration—updating its available tools and instructions based on the current state. The state can be determined from multiple sources: the agent's past actions (tool calls), external state (such as API call results), or even initial user input (for example, by running a classifier to determine user intent).

In this tutorial, you'll build a customer support agent that does the following:

- Collects warranty information before proceeding.
- Classifies issues as hardware or software.
- Provides solutions or escalates to human support.
- Maintains conversation state across multiple turns.

Unlike the [subagents pattern](lc:oss/python/langchain/multi-agent/subagents-personal-assistant) where sub-agents are called as tools, the **state machine pattern** uses a single agent whose configuration changes based on workflow progress. Each "step" is just a different configuration (system prompt + tools) of the same underlying agent, selected dynamically based on state.

Here's the workflow we'll build:

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#E5F4FF','primaryTextColor':'#030710','primaryBorderColor':'#006DDD','lineColor':'#40668D','secondaryColor':'#F6FFDB','tertiaryColor':'#FDF3FF'}}}%%
flowchart TD
    %% Start
    Start([💬 Customer reports<br>an issue]) --> Warranty{Is the device<br>under warranty?}

    %% Warranty check
    Warranty -->|✅ Yes| IssueType{What type<br>of issue?}
    Warranty -->|❌ No| OutOfWarranty{What type<br>of issue?}

    %% In-Warranty branch
    IssueType -->|🔩 Hardware| Repair[Provide warranty<br>repair instructions]
    IssueType -->|💻 Software| Troubleshoot[Provide troubleshooting<br>steps]

    %% Out-of-Warranty branch
    OutOfWarranty -->|🔩 Hardware| Escalate[Escalate to human<br>for paid repair options]
    OutOfWarranty -->|💻 Software| Troubleshoot

    %% Troubleshooting follow-up
    Troubleshoot --> Close([✅ Issue Resolved])
    Repair --> Close
    Escalate --> Close

    %% === Styling ===
    classDef startEnd fill:#F6FFDB,stroke:#6E8900,stroke-width:2px,color:#2E3900
    classDef decisionNode fill:#E5F4FF,stroke:#006DDD,stroke-width:2px,color:#030710
    classDef actionNode fill:#FDF3FF,stroke:#7E65AE,stroke-width:2px,color:#504B5F
    classDef escalateNode fill:#F8E8E6,stroke:#B27D75,stroke-width:2px,color:#634643

    class Start,Close startEnd
    class Warranty,IssueType,OutOfWarranty decisionNode
    class Repair,Troubleshoot actionNode
    class Escalate escalateNode
```

## Setup

### Installation

This tutorial requires the `langchain` package:


```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install langchain"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langchain"
 },
 {
  "label": "conda",
  "lang": "bash",
  "code": "conda install langchain -c conda-forge"
 }
]
```


For more details, see our [Installation guide](lc:oss/python/langchain/install).

### LangSmith

Set up [LangSmith](https://smith.langchain.com) to inspect what is happening inside your agent. Then set the following environment variables:


```lc-tabs
[
 {
  "label": "Shell",
  "lang": "bash",
  "code": "export LANGSMITH_TRACING=\"true\"\nexport LANGSMITH_API_KEY=\"...\""
 },
 {
  "label": "Python",
  "lang": "python",
  "code": "os.environ[\"LANGSMITH_TRACING\"] = \"true\"\nos.environ[\"LANGSMITH_API_KEY\"] = getpass.getpass()"
 }
]
```


### Select an LLM

Select a chat model from LangChain's suite of integrations:


## 1. Define custom state

First, define a custom state schema that tracks which step is currently active:

```python
from langchain.agents import AgentState
from typing_extensions import NotRequired
from typing import Literal

# Define the possible workflow steps
SupportStep = Literal["warranty_collector", "issue_classifier", "resolution_specialist"]  # [!code highlight]

class SupportState(AgentState):  # [!code highlight]
    """State for customer support workflow."""
    current_step: NotRequired[SupportStep]  # [!code highlight]
    warranty_status: NotRequired[Literal["in_warranty", "out_of_warranty"]]
    issue_type: NotRequired[Literal["hardware", "software"]]
```


The `current_step` field is the core of the state machine pattern - it determines which configuration (prompt + tools) is loaded on each turn.

## 2. Create tools that manage workflow state

Create tools that update the workflow state. These tools allow the agent to record information and transition to the next step.

The key is using `Command` to update state, including the `current_step` field:

```python
from langchain.tools import tool, ToolRuntime
from langchain.messages import ToolMessage
from langgraph.types import Command

@tool
def record_warranty_status(
    status: Literal["in_warranty", "out_of_warranty"],
    runtime: ToolRuntime[None, SupportState],
) -> Command:  # [!code highlight]
    """Record the customer's warranty status and transition to issue classification."""
    return Command(  # [!code highlight]
        update={  # [!code highlight]
            "messages": [
                ToolMessage(
                    content=f"Warranty status recorded as: {status}",
                    tool_call_id=runtime.tool_call_id,
                )
            ],
            "warranty_status": status,
            "current_step": "issue_classifier",  # [!code highlight]
        }
    )

@tool
def record_issue_type(
    issue_type: Literal["hardware", "software"],
    runtime: ToolRuntime[None, SupportState],
) -> Command:  # [!code highlight]
    """Record the type of issue and transition to resolution specialist."""
    return Command(  # [!code highlight]
        update={  # [!code highlight]
            "messages": [
                ToolMessage(
                    content=f"Issue type recorded as: {issue_type}",
                    tool_call_id=runtime.tool_call_id,
                )
            ],
            "issue_type": issue_type,
            "current_step": "resolution_specialist",  # [!code highlight]
        }
    )

@tool
def escalate_to_human(reason: str) -> str:
    """Escalate the case to a human support specialist."""
    # In a real system, this would create a ticket, notify staff, etc.
    return f"Escalating to human support. Reason: {reason}"

@tool
def provide_solution(solution: str) -> str:
    """Provide a solution to the customer's issue."""
    return f"Solution provided: {solution}"
```


Notice how `record_warranty_status` and `record_issue_type` return `Command` objects that update both the data (`warranty_status`, `issue_type`) AND the `current_step`. This is how the state machine works - tools control workflow progression.

## 3. Define step configurations

Define prompts and tools for each step. First, define the prompts for each step:

### View complete prompt definitions

```python
# Define prompts as constants for easy reference
WARRANTY_COLLECTOR_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STAGE: Warranty verification

At this step, you need to:
1. Greet the customer warmly
2. Ask if their device is under warranty
3. Use record_warranty_status to record their response and move to the next step

Be conversational and friendly. Don't ask multiple questions at once."""

ISSUE_CLASSIFIER_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STAGE: Issue classification
CUSTOMER INFO: Warranty status is {warranty_status}

At this step, you need to:
1. Ask the customer to describe their issue
2. Determine if it's a hardware issue (physical damage, broken parts) or software issue (app crashes, performance)
3. Use record_issue_type to record the classification and move to the next step

If unclear, ask clarifying questions before classifying."""

RESOLUTION_SPECIALIST_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STAGE: Resolution
CUSTOMER INFO: Warranty status is {warranty_status}, issue type is {issue_type}

At this step, you need to:
1. For SOFTWARE issues: provide troubleshooting steps using provide_solution
2. For HARDWARE issues:
   - If IN WARRANTY: explain warranty repair process using provide_solution
   - If OUT OF WARRANTY: escalate_to_human for paid repair options

Be specific and helpful in your solutions."""
```


Then map step names to their configurations using a dictionary:

```python
# Step configuration: maps step name to (prompt, tools, required_state)
STEP_CONFIG = {
    "warranty_collector": {
        "prompt": WARRANTY_COLLECTOR_PROMPT,
        "tools": [record_warranty_status],
        "requires": [],
    },
    "issue_classifier": {
        "prompt": ISSUE_CLASSIFIER_PROMPT,
        "tools": [record_issue_type],
        "requires": ["warranty_status"],
    },
    "resolution_specialist": {
        "prompt": RESOLUTION_SPECIALIST_PROMPT,
        "tools": [provide_solution, escalate_to_human],
        "requires": ["warranty_status", "issue_type"],
    },
}
```


This dictionary-based configuration makes it easy to:
- See all steps at a glance
- Add new steps (just add another entry)
- Understand the workflow dependencies (`requires` field)
- Use prompt templates with state variables (e.g., `{warranty_status}`)

## 4. Create step-based middleware

Create middleware that reads `current_step` from state and applies the appropriate configuration. We'll use the `@wrap_model_call` decorator for a clean implementation:

```python
from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse
from typing import Callable

@wrap_model_call  # [!code highlight]
def apply_step_config(
    request: ModelRequest,
    handler: Callable[[ModelRequest], ModelResponse],
) -> ModelResponse:
    """Configure agent behavior based on the current step."""
    # Get current step (defaults to warranty_collector for first interaction)
    current_step = request.state.get("current_step", "warranty_collector")  # [!code highlight]

    # Look up step configuration
    stage_config = STEP_CONFIG[current_step]  # [!code highlight]

    # Validate required state exists
    for key in stage_config["requires"]:
        if request.state.get(key) is None:
            raise ValueError(f"{key} must be set before reaching {current_step}")

    # Format prompt with state values (supports {warranty_status}, {issue_type}, etc.)
    system_prompt = stage_config["prompt"].format(**request.state)

    # Inject system prompt and step-specific tools
    request = request.override(  # [!code highlight]
        system_prompt=system_prompt,  # [!code highlight]
        tools=stage_config["tools"],  # [!code highlight]
    )

    return handler(request)
```


This middleware:

1. **Reads current step**: Gets `current_step` from state (defaults to "warranty_collector").
2. **Looks up configuration**: Finds the matching entry in `STEP_CONFIG`.
3. **Validates dependencies**: Ensures required state fields exist.
4. **Formats prompt**: Injects state values into the prompt template.
5. **Applies configuration**: Overrides the system prompt and available tools.

The `request.override()` method is key - it allows us to dynamically change the agent's behavior based on state without creating separate agent instances.

## 5. Create the agent

Now create the agent with the step-based middleware and a checkpointer for state persistence:

```python
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

# Collect all tools from all step configurations
all_tools = [
    record_warranty_status,
    record_issue_type,
    provide_solution,
    escalate_to_human,
]

# Create the agent with step-based configuration
agent = create_agent(
    model,
    tools=all_tools,
    state_schema=SupportState,  # [!code highlight]
    middleware=[apply_step_config],  # [!code highlight]
    checkpointer=InMemorySaver(),  # [!code highlight]
)
```


> [!NOTE]
>
> **Why a checkpointer?** The checkpointer maintains state across conversation turns. Without it, the `current_step` state would be lost between user messages, breaking the workflow.


## 6. Test the workflow

Test the complete workflow:

```python
from langchain.messages import HumanMessage
from langchain_core.utils.uuid import uuid7

# Configuration for this conversation thread
thread_id = str(uuid7())
config = {"configurable": {"thread_id": thread_id}}

# Turn 1: Initial message - starts with warranty_collector step
print("=== Turn 1: Warranty Collection ===")
result = agent.invoke(
    {"messages": [HumanMessage("Hi, my phone screen is cracked")]},
    config
)
for msg in result['messages']:
    msg.pretty_print()

# Turn 2: User responds about warranty
print("\n=== Turn 2: Warranty Response ===")
result = agent.invoke(
    {"messages": [HumanMessage("Yes, it's still under warranty")]},
    config
)
for msg in result['messages']:
    msg.pretty_print()
print(f"Current step: {result.get('current_step')}")

# Turn 3: User describes the issue
print("\n=== Turn 3: Issue Description ===")
result = agent.invoke(
    {"messages": [HumanMessage("The screen is physically cracked from dropping it")]},
    config
)
for msg in result['messages']:
    msg.pretty_print()
print(f"Current step: {result.get('current_step')}")

# Turn 4: Resolution
print("\n=== Turn 4: Resolution ===")
result = agent.invoke(
    {"messages": [HumanMessage("What should I do?")]},
    config
)
for msg in result['messages']:
    msg.pretty_print()
```


Expected flow:
1. **Warranty verification step**: Asks about warranty status
2. **Issue classification step**: Asks about the problem, determines it's hardware
3. **Resolution step**: Provides warranty repair instructions

## 7. Understanding state transitions

Let's trace what happens at each turn:

### Turn 1: Initial message

```python
{
    "messages": [HumanMessage("Hi, my phone screen is cracked")],
    "current_step": "warranty_collector"  # Default value
}
```


Middleware applies:
- System prompt: `WARRANTY_COLLECTOR_PROMPT`
- Tools: `[record_warranty_status]`

### Turn 2: After warranty recorded

Tool call: `record_warranty_status("in_warranty")` returns:
```python
Command(update={
    "warranty_status": "in_warranty",
    "current_step": "issue_classifier"  # State transition!
})
```


Next turn, middleware applies:
- System prompt: `ISSUE_CLASSIFIER_PROMPT` (formatted with `warranty_status="in_warranty"`)
- Tools: `[record_issue_type]`

### Turn 3: After issue classified

Tool call: `record_issue_type("hardware")` returns:
```python
Command(update={
    "issue_type": "hardware",
    "current_step": "resolution_specialist"  # State transition!
})
```


Next turn, middleware applies:
- System prompt: `RESOLUTION_SPECIALIST_PROMPT` (formatted with `warranty_status` and `issue_type`)
- Tools: `[provide_solution, escalate_to_human]`

The key insight: **Tools drive the workflow** by updating `current_step`, and **middleware responds** by applying the appropriate configuration on the next turn.

## 8. Manage message history

As the agent progresses through steps, message history grows. Use [summarization middleware](lc:oss/python/langchain/short-term-memory#summarize-messages) to compress earlier messages while preserving conversational context:

```python
from langchain.agents import create_agent
from langchain.agents.middleware import SummarizationMiddleware  # [!code highlight]
from langgraph.checkpoint.memory import InMemorySaver

agent = create_agent(
    model,
    tools=all_tools,
    state_schema=SupportState,
    middleware=[
        apply_step_config,
        SummarizationMiddleware(  # [!code highlight]
            model="gpt-5.4-mini",
            trigger=("tokens", 4000),
            keep=("messages", 10)
        )
    ],
    checkpointer=InMemorySaver(),
)
```


See the [short-term memory guide](lc:oss/python/langchain/short-term-memory) for other memory management techniques.

## 9. Add flexibility: Go back

Some workflows need to allow users to return to previous steps to correct information (e.g., changing warranty status or issue classification). However, not all transitions make sense—for example, you typically can't go back once a refund has been processed. For this support workflow, we'll add tools to return to the warranty verification and issue classification steps.


> [!TIP]
>
> If your workflow requires arbitrary transitions between most steps, consider whether you need a structured workflow at all. This pattern works best when steps follow a clear sequential progression with occasional backwards transitions for corrections.


Add "go back" tools to the resolution step:

```python
@tool
def go_back_to_warranty() -> Command:  # [!code highlight]
    """Go back to warranty verification step."""
    return Command(update={"current_step": "warranty_collector"})  # [!code highlight]

@tool
def go_back_to_classification() -> Command:  # [!code highlight]
    """Go back to issue classification step."""
    return Command(update={"current_step": "issue_classifier"})  # [!code highlight]

# Update the resolution_specialist configuration to include these tools
STEP_CONFIG["resolution_specialist"]["tools"].extend([
    go_back_to_warranty,
    go_back_to_classification
])
```


Update the resolution specialist's prompt to mention these tools:

```python
RESOLUTION_SPECIALIST_PROMPT = """You are a customer support agent helping with device issues.

CURRENT STAGE: Resolution
CUSTOMER INFO: Warranty status is {warranty_status}, issue type is {issue_type}

At this step, you need to:
1. For SOFTWARE issues: provide troubleshooting steps using provide_solution
2. For HARDWARE issues:
   - If IN WARRANTY: explain warranty repair process using provide_solution
   - If OUT OF WARRANTY: escalate_to_human for paid repair options

If the customer indicates any information was wrong, use:
- go_back_to_warranty to correct warranty status
- go_back_to_classification to correct issue type

Be specific and helpful in your solutions."""
```


Now the agent can handle corrections:

```python
result = agent.invoke(
    {"messages": [HumanMessage("Actually, I made a mistake - my device is out of warranty")]},
    config
)
# Agent will call go_back_to_warranty and restart the warranty verification step
```


## Complete example

Here's everything together in a runnable script:


> [!DETAILS] Complete code
>
> ```python
> """
> Customer Support State Machine Example
>
> This example demonstrates the state machine pattern.
> A single agent dynamically changes its behavior based on the current_step state,
> creating a state machine for sequential information collection.
> """
>
> from langchain_core.utils.uuid import uuid7
>
> from langgraph.checkpoint.memory import InMemorySaver
> from langgraph.types import Command
> from typing import Callable, Literal
> from typing_extensions import NotRequired
>
> from langchain.agents import AgentState, create_agent
> from langchain.agents.middleware import wrap_model_call, ModelRequest, ModelResponse, SummarizationMiddleware
> from langchain.chat_models import init_chat_model
> from langchain.messages import HumanMessage, ToolMessage
> from langchain.tools import tool, ToolRuntime
>
> model = init_chat_model("google_genai:gemini-3.6-flash")
>
> # Define the possible workflow steps
> SupportStep = Literal["warranty_collector", "issue_classifier", "resolution_specialist"]
>
> class SupportState(AgentState):
>     """State for customer support workflow."""
>
>     current_step: NotRequired[SupportStep]
>     warranty_status: NotRequired[Literal["in_warranty", "out_of_warranty"]]
>     issue_type: NotRequired[Literal["hardware", "software"]]
>
> @tool
> def record_warranty_status(
>     status: Literal["in_warranty", "out_of_warranty"],
>     runtime: ToolRuntime[None, SupportState],
> ) -> Command:
>     """Record the customer's warranty status and transition to issue classification."""
>     return Command(
>         update={
>             "messages": [
>                 ToolMessage(
>                     content=f"Warranty status recorded as: {status}",
>                     tool_call_id=runtime.tool_call_id,
>                 )
>             ],
>             "warranty_status": status,
>             "current_step": "issue_classifier",
>         }
>     )
>
> @tool
> def record_issue_type(
>     issue_type: Literal["hardware", "software"],
>     runtime: ToolRuntime[None, SupportState],
> ) -> Command:
>     """Record the type of issue and transition to resolution specialist."""
>     return Command(
>         update={
>             "messages": [
>                 ToolMessage(
>                     content=f"Issue type recorded as: {issue_type}",
>                     tool_call_id=runtime.tool_call_id,
>                 )
>             ],
>             "issue_type": issue_type,
>             "current_step": "resolution_specialist",
>         }
>     )
>
> @tool
> def escalate_to_human(reason: str) -> str:
>     """Escalate the case to a human support specialist."""
>     # In a real system, this would create a ticket, notify staff, etc.
>     return f"Escalating to human support. Reason: {reason}"
>
> @tool
> def provide_solution(solution: str) -> str:
>     """Provide a solution to the customer's issue."""
>     return f"Solution provided: {solution}"
>
> # Define prompts as constants
> WARRANTY_COLLECTOR_PROMPT = """You are a customer support agent helping with device issues.
>
> CURRENT STEP: Warranty verification
>
> At this step, you need to:
> 1. Greet the customer warmly
> 2. Ask if their device is under warranty
> 3. Use record_warranty_status to record their response and move to the next step
>
> Be conversational and friendly. Don't ask multiple questions at once."""
>
> ISSUE_CLASSIFIER_PROMPT = """You are a customer support agent helping with device issues.
>
> CURRENT STEP: Issue classification
> CUSTOMER INFO: Warranty status is {warranty_status}
>
> At this step, you need to:
> 1. Ask the customer to describe their issue
> 2. Determine if it's a hardware issue (physical damage, broken parts) or software issue (app crashes, performance)
> 3. Use record_issue_type to record the classification and move to the next step
>
> If unclear, ask clarifying questions before classifying."""
>
> RESOLUTION_SPECIALIST_PROMPT = """You are a customer support agent helping with device issues.
>
> CURRENT STEP: Resolution
> CUSTOMER INFO: Warranty status is {warranty_status}, issue type is {issue_type}
>
> At this step, you need to:
> 1. For SOFTWARE issues: provide troubleshooting steps using provide_solution
> 2. For HARDWARE issues:
>    - If IN WARRANTY: explain warranty repair process using provide_solution
>    - If OUT OF WARRANTY: escalate_to_human for paid repair options
>
> Be specific and helpful in your solutions."""
>
> # Step configuration: maps step name to (prompt, tools, required_state)
> STEP_CONFIG = {
>     "warranty_collector": {
>         "prompt": WARRANTY_COLLECTOR_PROMPT,
>         "tools": [record_warranty_status],
>         "requires": [],
>     },
>     "issue_classifier": {
>         "prompt": ISSUE_CLASSIFIER_PROMPT,
>         "tools": [record_issue_type],
>         "requires": ["warranty_status"],
>     },
>     "resolution_specialist": {
>         "prompt": RESOLUTION_SPECIALIST_PROMPT,
>         "tools": [provide_solution, escalate_to_human],
>         "requires": ["warranty_status", "issue_type"],
>     },
> }
>
> @wrap_model_call
> def apply_step_config(
>     request: ModelRequest,
>     handler: Callable[[ModelRequest], ModelResponse],
> ) -> ModelResponse:
>     """Configure agent behavior based on the current step."""
>     # Get current step (defaults to warranty_collector for first interaction)
>     current_step = request.state.get("current_step", "warranty_collector")
>
>     # Look up step configuration
>     step_config = STEP_CONFIG[current_step]
>
>     # Validate required state exists
>     for key in step_config["requires"]:
>         if request.state.get(key) is None:
>             raise ValueError(f"{key} must be set before reaching {current_step}")
>
>     # Format prompt with state values
>     system_prompt = step_config["prompt"].format(**request.state)
>
>     # Inject system prompt and step-specific tools
>     request = request.override(
>         system_prompt=system_prompt,
>         tools=step_config["tools"],
>     )
>
>     return handler(request)
>
> # Collect all tools from all step configurations
> all_tools = [
>     record_warranty_status,
>     record_issue_type,
>     provide_solution,
>     escalate_to_human,
> ]
>
> # Create the agent with step-based configuration and summarization
> agent = create_agent(
>     model,
>     tools=all_tools,
>     state_schema=SupportState,
>     middleware=[
>         apply_step_config,
>         SummarizationMiddleware(
>             model="gpt-5.4-mini",
>             trigger=("tokens", 4000),
>             keep=("messages", 10)
>         )
>     ],
>     checkpointer=InMemorySaver(),
> )
>
> # ============================================================================
> # Test the workflow
> # ============================================================================
>
> if __name__ == "__main__":
>     thread_id = str(uuid7())
>     config = {"configurable": {"thread_id": thread_id}}
>
>     result = agent.invoke(
>         {"messages": [HumanMessage("Hi, my phone screen is cracked")]},
>         config
>     )
>
>     result = agent.invoke(
>         {"messages": [HumanMessage("Yes, it's still under warranty")]},
>         config
>     )
>
>     result = agent.invoke(
>         {"messages": [HumanMessage("The screen is physically cracked from dropping it")]},
>         config
>     )
>
>     result = agent.invoke(
>         {"messages": [HumanMessage("What should I do?")]},
>         config
>     )
>     for msg in result['messages']:
>         msg.pretty_print()
> ```


## Next steps

- Learn about the [subagents pattern](lc:oss/python/langchain/multi-agent/subagents-personal-assistant) for centralized orchestration
- Explore [middleware](lc:oss/python/langchain/middleware/overview) for more dynamic behaviors
- Read the [multi-agent overview](lc:oss/python/langchain/multi-agent/index) to compare patterns
- Use [LangSmith](https://smith.langchain.com) to debug and monitor your multi-agent system
