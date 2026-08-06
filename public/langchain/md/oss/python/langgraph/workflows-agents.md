This guide reviews common workflow and agent patterns.

- Workflows have predetermined code paths and are designed to operate in a certain order.
- Agents are dynamic and define their own processes and tool usage.

![Agent Workflow](/langchain/images/oss/images/agent_workflow.png)

LangGraph offers several benefits when building agents and workflows, including [persistence](lc:oss/python/langgraph/persistence), [streaming](lc:oss/python/langgraph/streaming), and support for debugging as well as [deployment](lc:oss/python/langgraph/deploy).


> [!TIP]
>
> Trace and compare these workflow patterns with [LangSmith](https://smith.langchain.com). Follow the [tracing quickstart](lc:langsmith/trace-with-langgraph) to see how data flows through each step. We recommend you also set up [LangSmith Engine](lc:langsmith/engine) which monitors your traces, detects issues, and proposes fixes.


## Setup

To build a workflow or agent, you can use [any chat model](lc:oss/python/integrations/chat/index) that supports structured outputs and tool calling. The following example uses Anthropic:

1. Install dependencies:
```bash
pip install langchain_core langchain-anthropic langgraph
```

2. Initialize the LLM:

```python

from langchain_anthropic import ChatAnthropic

def _set_env(var: str):
    if not os.environ.get(var):
        os.environ[var] = getpass.getpass(f"{var}: ")

_set_env("ANTHROPIC_API_KEY")

llm = ChatAnthropic(model="claude-sonnet-4-6")
```


## LLMs and augmentations

Workflows and agentic systems are based on LLMs and the various augmentations you add to them. [Tool calling](lc:oss/python/langchain/tools), [structured outputs](lc:oss/python/langchain/structured-output), and [short term memory](lc:oss/python/langchain/short-term-memory) are a few options for tailoring LLMs to your needs.

![LLM augmentations](/langchain/images/oss/images/augmented_llm.png)

```python
# Schema for structured output
from pydantic import BaseModel, Field

class SearchQuery(BaseModel):
    search_query: str = Field(None, description="Query that is optimized web search.")
    justification: str = Field(
        None, description="Why this query is relevant to the user's request."
    )

# Augment the LLM with schema for structured output
structured_llm = llm.with_structured_output(SearchQuery)

# Invoke the augmented LLM
output = structured_llm.invoke("How does Calcium CT score relate to high cholesterol?")

# Define a tool
def multiply(a: int, b: int) -> int:
    return a * b

# Augment the LLM with tools
llm_with_tools = llm.bind_tools([multiply])

# Invoke the LLM with input that triggers the tool call
msg = llm_with_tools.invoke("What is 2 times 3?")

# Get the tool call
msg.tool_calls
```

## Prompt chaining

Prompt chaining is when each LLM call processes the output of the previous call. It's often used for performing well-defined tasks that can be broken down into smaller, verifiable steps. Some examples include:

- Translating documents into different languages
- Verifying generated content for consistency

![Prompt chaining](/langchain/images/oss/images/prompt_chain.png)


```lc-tabs
[
 {
  "label": "Graph API",
  "lang": "python",
  "code": "from typing_extensions import TypedDict\nfrom langgraph.graph import StateGraph, START, END\nfrom IPython.display import Image, display\n\n# Graph state\nclass State(TypedDict):\n    topic: str\n    joke: str\n    improved_joke: str\n    final_joke: str\n\n# Nodes\ndef generate_joke(state: State):\n    \"\"\"First LLM call to generate initial joke\"\"\"\n\n    msg = llm.invoke(f\"Write a short joke about {state['topic']}\")\n    return {\"joke\": msg.content}\n\ndef check_punchline(state: State):\n    \"\"\"Gate function to check if the joke has a punchline\"\"\"\n\n    # Simple check - does the joke contain \"?\" or \"!\"\n    if \"?\" in state[\"joke\"] or \"!\" in state[\"joke\"]:\n        return \"Pass\"\n    return \"Fail\"\n\ndef improve_joke(state: State):\n    \"\"\"Second LLM call to improve the joke\"\"\"\n\n    msg = llm.invoke(f\"Make this joke funnier by adding wordplay: {state['joke']}\")\n    return {\"improved_joke\": msg.content}\n\ndef polish_joke(state: State):\n    \"\"\"Third LLM call for final polish\"\"\"\n    msg = llm.invoke(f\"Add a surprising twist to this joke: {state['improved_joke']}\")\n    return {\"final_joke\": msg.content}\n\n# Build workflow\nworkflow = StateGraph(State)\n\n# Add nodes\nworkflow.add_node(\"generate_joke\", generate_joke)\nworkflow.add_node(\"improve_joke\", improve_joke)\nworkflow.add_node(\"polish_joke\", polish_joke)\n\n# Add edges to connect nodes\nworkflow.add_edge(START, \"generate_joke\")\nworkflow.add_conditional_edges(\n    \"generate_joke\", check_punchline, {\"Fail\": \"improve_joke\", \"Pass\": END}\n)\nworkflow.add_edge(\"improve_joke\", \"polish_joke\")\nworkflow.add_edge(\"polish_joke\", END)\n\n# Compile\nchain = workflow.compile()\n\n# Show workflow\ndisplay(Image(chain.get_graph().draw_mermaid_png()))\n\n# Invoke\nstate = chain.invoke({\"topic\": \"cats\"})\nprint(\"Initial joke:\")\nprint(state[\"joke\"])\nprint(\"\\n--- --- ---\\n\")\nif \"improved_joke\" in state:\n    print(\"Improved joke:\")\n    print(state[\"improved_joke\"])\n    print(\"\\n--- --- ---\\n\")\n\n    print(\"Final joke:\")\n    print(state[\"final_joke\"])\nelse:\n    print(\"Final joke:\")\n    print(state[\"joke\"])"
 },
 {
  "label": "Functional API",
  "lang": "python",
  "code": "from langgraph.func import entrypoint, task\n\n# Tasks\n@task\ndef generate_joke(topic: str):\n    \"\"\"First LLM call to generate initial joke\"\"\"\n    msg = llm.invoke(f\"Write a short joke about {topic}\")\n    return msg.content\n\ndef check_punchline(joke: str):\n    \"\"\"Gate function to check if the joke has a punchline\"\"\"\n    # Simple check - does the joke contain \"?\" or \"!\"\n    if \"?\" in joke or \"!\" in joke:\n        return \"Fail\"\n\n    return \"Pass\"\n\n@task\ndef improve_joke(joke: str):\n    \"\"\"Second LLM call to improve the joke\"\"\"\n    msg = llm.invoke(f\"Make this joke funnier by adding wordplay: {joke}\")\n    return msg.content\n\n@task\ndef polish_joke(joke: str):\n    \"\"\"Third LLM call for final polish\"\"\"\n    msg = llm.invoke(f\"Add a surprising twist to this joke: {joke}\")\n    return msg.content\n\n@entrypoint()\ndef prompt_chaining_workflow(topic: str):\n    original_joke = generate_joke(topic).result()\n    if check_punchline(original_joke) == \"Pass\":\n        return original_joke\n\n    improved_joke = improve_joke(original_joke).result()\n    return polish_joke(improved_joke).result()\n\n# Invoke\nstream = prompt_chaining_workflow.stream_events(\"cats\", version=\"v3\")\nfor snapshot in stream.values:\n    print(snapshot)\n    print(\"\\n\")"
 }
]
```


## Parallelization

With parallelization, LLMs work simultaneously on a task. This is either done by running multiple independent subtasks at the same time, or running the same task multiple times to check for different outputs. Parallelization is commonly used to:

- Split up subtasks and run them in parallel, which increases speed
- Run tasks multiple times to check for different outputs, which increases confidence

Some examples include:

- Running one subtask that processes a document for keywords, and a second subtask to check for formatting errors
- Running a task multiple times that scores a document for accuracy based on different criteria, like the number of citations, the number of sources used, and the quality of the sources

![parallelization.png](/langchain/images/oss/images/parallelization.png)


```lc-tabs
[
 {
  "label": "Graph API",
  "lang": "python",
  "code": "# Graph state\nclass State(TypedDict):\n    topic: str\n    joke: str\n    story: str\n    poem: str\n    combined_output: str\n\n# Nodes\ndef call_llm_1(state: State):\n    \"\"\"First LLM call to generate initial joke\"\"\"\n\n    msg = llm.invoke(f\"Write a joke about {state['topic']}\")\n    return {\"joke\": msg.content}\n\ndef call_llm_2(state: State):\n    \"\"\"Second LLM call to generate story\"\"\"\n\n    msg = llm.invoke(f\"Write a story about {state['topic']}\")\n    return {\"story\": msg.content}\n\ndef call_llm_3(state: State):\n    \"\"\"Third LLM call to generate poem\"\"\"\n\n    msg = llm.invoke(f\"Write a poem about {state['topic']}\")\n    return {\"poem\": msg.content}\n\ndef aggregator(state: State):\n    \"\"\"Combine the joke, story and poem into a single output\"\"\"\n\n    combined = f\"Here's a story, joke, and poem about {state['topic']}!\\n\\n\"\n    combined += f\"STORY:\\n{state['story']}\\n\\n\"\n    combined += f\"JOKE:\\n{state['joke']}\\n\\n\"\n    combined += f\"POEM:\\n{state['poem']}\"\n    return {\"combined_output\": combined}\n\n# Build workflow\nparallel_builder = StateGraph(State)\n\n# Add nodes\nparallel_builder.add_node(\"call_llm_1\", call_llm_1)\nparallel_builder.add_node(\"call_llm_2\", call_llm_2)\nparallel_builder.add_node(\"call_llm_3\", call_llm_3)\nparallel_builder.add_node(\"aggregator\", aggregator)\n\n# Add edges to connect nodes\nparallel_builder.add_edge(START, \"call_llm_1\")\nparallel_builder.add_edge(START, \"call_llm_2\")\nparallel_builder.add_edge(START, \"call_llm_3\")\nparallel_builder.add_edge(\"call_llm_1\", \"aggregator\")\nparallel_builder.add_edge(\"call_llm_2\", \"aggregator\")\nparallel_builder.add_edge(\"call_llm_3\", \"aggregator\")\nparallel_builder.add_edge(\"aggregator\", END)\nparallel_workflow = parallel_builder.compile()\n\n# Show workflow\ndisplay(Image(parallel_workflow.get_graph().draw_mermaid_png()))\n\n# Invoke\nstate = parallel_workflow.invoke({\"topic\": \"cats\"})\nprint(state[\"combined_output\"])"
 },
 {
  "label": "Functional API",
  "lang": "python",
  "code": "@task\ndef call_llm_1(topic: str):\n    \"\"\"First LLM call to generate initial joke\"\"\"\n    msg = llm.invoke(f\"Write a joke about {topic}\")\n    return msg.content\n\n@task\ndef call_llm_2(topic: str):\n    \"\"\"Second LLM call to generate story\"\"\"\n    msg = llm.invoke(f\"Write a story about {topic}\")\n    return msg.content\n\n@task\ndef call_llm_3(topic):\n    \"\"\"Third LLM call to generate poem\"\"\"\n    msg = llm.invoke(f\"Write a poem about {topic}\")\n    return msg.content\n\n@task\ndef aggregator(topic, joke, story, poem):\n    \"\"\"Combine the joke and story into a single output\"\"\"\n\n    combined = f\"Here's a story, joke, and poem about {topic}!\\n\\n\"\n    combined += f\"STORY:\\n{story}\\n\\n\"\n    combined += f\"JOKE:\\n{joke}\\n\\n\"\n    combined += f\"POEM:\\n{poem}\"\n    return combined\n\n# Build workflow\n@entrypoint()\ndef parallel_workflow(topic: str):\n    joke_fut = call_llm_1(topic)\n    story_fut = call_llm_2(topic)\n    poem_fut = call_llm_3(topic)\n    return aggregator(\n        topic, joke_fut.result(), story_fut.result(), poem_fut.result()\n    ).result()\n\n# Invoke\nstream = parallel_workflow.stream_events(\"cats\", version=\"v3\")\nfor snapshot in stream.values:\n    print(snapshot)\n    print(\"\\n\")"
 }
]
```


## Routing

Routing workflows process inputs and then directs them to context-specific tasks. This allows you to define specialized flows for complex tasks. For example, a workflow built to answer product related questions might process the type of question first, and then route the request to specific processes for pricing, refunds, returns, etc.

![routing.png](/langchain/images/oss/images/routing.png)


```lc-tabs
[
 {
  "label": "Graph API",
  "lang": "python",
  "code": "from typing_extensions import Literal\nfrom langchain.messages import HumanMessage, SystemMessage\n\n# Schema for structured output to use as routing logic\nclass Route(BaseModel):\n    step: Literal[\"poem\", \"story\", \"joke\"] = Field(\n        None, description=\"The next step in the routing process\"\n    )\n\n# Augment the LLM with schema for structured output\nrouter = llm.with_structured_output(Route)\n\n# State\nclass State(TypedDict):\n    input: str\n    decision: str\n    output: str\n\n# Nodes\ndef llm_call_1(state: State):\n    \"\"\"Write a story\"\"\"\n\n    result = llm.invoke(state[\"input\"])\n    return {\"output\": result.content}\n\ndef llm_call_2(state: State):\n    \"\"\"Write a joke\"\"\"\n\n    result = llm.invoke(state[\"input\"])\n    return {\"output\": result.content}\n\ndef llm_call_3(state: State):\n    \"\"\"Write a poem\"\"\"\n\n    result = llm.invoke(state[\"input\"])\n    return {\"output\": result.content}\n\ndef llm_call_router(state: State):\n    \"\"\"Route the input to the appropriate node\"\"\"\n\n    # Run the augmented LLM with structured output to serve as routing logic\n    decision = router.invoke(\n        [\n            SystemMessage(\n                content=\"Route the input to story, joke, or poem based on the user's request.\"\n            ),\n            HumanMessage(content=state[\"input\"]),\n        ]\n    )\n\n    return {\"decision\": decision.step}\n\n# Conditional edge function to route to the appropriate node\ndef route_decision(state: State):\n    # Return the node name you want to visit next\n    if state[\"decision\"] == \"story\":\n        return \"llm_call_1\"\n    elif state[\"decision\"] == \"joke\":\n        return \"llm_call_2\"\n    elif state[\"decision\"] == \"poem\":\n        return \"llm_call_3\"\n\n# Build workflow\nrouter_builder = StateGraph(State)\n\n# Add nodes\nrouter_builder.add_node(\"llm_call_1\", llm_call_1)\nrouter_builder.add_node(\"llm_call_2\", llm_call_2)\nrouter_builder.add_node(\"llm_call_3\", llm_call_3)\nrouter_builder.add_node(\"llm_call_router\", llm_call_router)\n\n# Add edges to connect nodes\nrouter_builder.add_edge(START, \"llm_call_router\")\nrouter_builder.add_conditional_edges(\n    \"llm_call_router\",\n    route_decision,\n    {  # Name returned by route_decision : Name of next node to visit\n        \"llm_call_1\": \"llm_call_1\",\n        \"llm_call_2\": \"llm_call_2\",\n        \"llm_call_3\": \"llm_call_3\",\n    },\n)\nrouter_builder.add_edge(\"llm_call_1\", END)\nrouter_builder.add_edge(\"llm_call_2\", END)\nrouter_builder.add_edge(\"llm_call_3\", END)\n\n# Compile workflow\nrouter_workflow = router_builder.compile()\n\n# Show the workflow\ndisplay(Image(router_workflow.get_graph().draw_mermaid_png()))\n\n# Invoke\nstate = router_workflow.invoke({\"input\": \"Write me a joke about cats\"})\nprint(state[\"output\"])"
 },
 {
  "label": "Functional API",
  "lang": "python",
  "code": "from typing_extensions import Literal\nfrom pydantic import BaseModel\nfrom langchain.messages import HumanMessage, SystemMessage\n\n# Schema for structured output to use as routing logic\nclass Route(BaseModel):\n    step: Literal[\"poem\", \"story\", \"joke\"] = Field(\n        None, description=\"The next step in the routing process\"\n    )\n\n# Augment the LLM with schema for structured output\nrouter = llm.with_structured_output(Route)\n\n@task\ndef llm_call_1(input_: str):\n    \"\"\"Write a story\"\"\"\n    result = llm.invoke(input_)\n    return result.content\n\n@task\ndef llm_call_2(input_: str):\n    \"\"\"Write a joke\"\"\"\n    result = llm.invoke(input_)\n    return result.content\n\n@task\ndef llm_call_3(input_: str):\n    \"\"\"Write a poem\"\"\"\n    result = llm.invoke(input_)\n    return result.content\n\ndef llm_call_router(input_: str):\n    \"\"\"Route the input to the appropriate node\"\"\"\n    # Run the augmented LLM with structured output to serve as routing logic\n    decision = router.invoke(\n        [\n            SystemMessage(\n                content=\"Route the input to story, joke, or poem based on the user's request.\"\n            ),\n            HumanMessage(content=input_),\n        ]\n    )\n    return decision.step\n\n# Create workflow\n@entrypoint()\ndef router_workflow(input_: str):\n    next_step = llm_call_router(input_)\n    if next_step == \"story\":\n        llm_call = llm_call_1\n    elif next_step == \"joke\":\n        llm_call = llm_call_2\n    elif next_step == \"poem\":\n        llm_call = llm_call_3\n\n    return llm_call(input_).result()\n\n# Invoke\nstream = router_workflow.stream_events(\"Write me a joke about cats\", version=\"v3\")\nfor snapshot in stream.values:\n    print(snapshot)\n    print(\"\\n\")"
 }
]
```


## Orchestrator-worker

In an orchestrator-worker configuration, the orchestrator:

- Breaks down tasks into subtasks
- Delegates subtasks to workers
- Synthesizes worker outputs into a final result

![worker.png](/langchain/images/oss/images/worker.png)

Orchestrator-worker workflows provide more flexibility and are often used when subtasks cannot be predefined the way they can with [parallelization](#parallelization). This is common with workflows that write code or need to update content across multiple files. For example, a workflow that needs to update installation instructions for multiple Python libraries across an unknown number of documents might use this pattern.


```lc-tabs
[
 {
  "label": "Graph API",
  "lang": "python",
  "code": "from typing import Annotated, List\n\n# Schema for structured output to use in planning\nclass Section(BaseModel):\n    name: str = Field(\n        description=\"Name for this section of the report.\",\n    )\n    description: str = Field(\n        description=\"Brief overview of the main topics and concepts to be covered in this section.\",\n    )\n\nclass Sections(BaseModel):\n    sections: List[Section] = Field(\n        description=\"Sections of the report.\",\n    )\n\n# Augment the LLM with schema for structured output\nplanner = llm.with_structured_output(Sections)"
 },
 {
  "label": "Functional API",
  "lang": "python",
  "code": "from typing import List\n\n# Schema for structured output to use in planning\nclass Section(BaseModel):\n    name: str = Field(\n        description=\"Name for this section of the report.\",\n    )\n    description: str = Field(\n        description=\"Brief overview of the main topics and concepts to be covered in this section.\",\n    )\n\nclass Sections(BaseModel):\n    sections: List[Section] = Field(\n        description=\"Sections of the report.\",\n    )\n\n# Augment the LLM with schema for structured output\nplanner = llm.with_structured_output(Sections)\n\n@task\ndef orchestrator(topic: str):\n    \"\"\"Orchestrator that generates a plan for the report\"\"\"\n    # Generate queries\n    report_sections = planner.invoke(\n        [\n            SystemMessage(content=\"Generate a plan for the report.\"),\n            HumanMessage(content=f\"Here is the report topic: {topic}\"),\n        ]\n    )\n\n    return report_sections.sections\n\n@task\ndef llm_call(section: Section):\n    \"\"\"Worker writes a section of the report\"\"\"\n\n    # Generate section\n    result = llm.invoke(\n        [\n            SystemMessage(content=\"Write a report section.\"),\n            HumanMessage(\n                content=f\"Here is the section name: {section.name} and description: {section.description}\"\n            ),\n        ]\n    )\n\n    # Write the updated section to completed sections\n    return result.content\n\n@task\ndef synthesizer(completed_sections: list[str]):\n    \"\"\"Synthesize full report from sections\"\"\"\n    final_report = \"\\n\\n---\\n\\n\".join(completed_sections)\n    return final_report\n\n@entrypoint()\ndef orchestrator_worker(topic: str):\n    sections = orchestrator(topic).result()\n    section_futures = [llm_call(section) for section in sections]\n    final_report = synthesizer(\n        [section_fut.result() for section_fut in section_futures]\n    ).result()\n    return final_report\n\n# Invoke\nreport = orchestrator_worker.invoke(\"Create a report on LLM scaling laws\")\nfrom IPython.display import Markdown\nMarkdown(report)"
 }
]
```


### Creating workers in LangGraph

Orchestrator-worker workflows are common and LangGraph has built-in support for them. The `Send` API lets you dynamically create worker nodes and send them specific inputs. Each worker has its own state, and all worker outputs are written to a shared state key that is accessible to the orchestrator graph. This gives the orchestrator access to all worker output and allows it to synthesize them into a final output. The example below iterates over a list of sections and uses the `Send` API to send a section to each worker.

```python
from langgraph.types import Send

# Graph state
class State(TypedDict):
    topic: str  # Report topic
    sections: list[Section]  # List of report sections
    completed_sections: Annotated[
        list, operator.add
    ]  # All workers write to this key in parallel
    final_report: str  # Final report

# Worker state
class WorkerState(TypedDict):
    section: Section
    completed_sections: Annotated[list, operator.add]

# Nodes
def orchestrator(state: State):
    """Orchestrator that generates a plan for the report"""

    # Generate queries
    report_sections = planner.invoke(
        [
            SystemMessage(content="Generate a plan for the report."),
            HumanMessage(content=f"Here is the report topic: {state['topic']}"),
        ]
    )

    return {"sections": report_sections.sections}

def llm_call(state: WorkerState):
    """Worker writes a section of the report"""

    # Generate section
    section = llm.invoke(
        [
            SystemMessage(
                content="Write a report section following the provided name and description. Include no preamble for each section. Use markdown formatting."
            ),
            HumanMessage(
                content=f"Here is the section name: {state['section'].name} and description: {state['section'].description}"
            ),
        ]
    )

    # Write the updated section to completed sections
    return {"completed_sections": [section.content]}

def synthesizer(state: State):
    """Synthesize full report from sections"""

    # List of completed sections
    completed_sections = state["completed_sections"]

    # Format completed section to str to use as context for final sections
    completed_report_sections = "\n\n---\n\n".join(completed_sections)

    return {"final_report": completed_report_sections}

# Conditional edge function to create llm_call workers that each write a section of the report
def assign_workers(state: State):
    """Assign a worker to each section in the plan"""

    # Kick off section writing in parallel via Send() API
    return [Send("llm_call", {"section": s}) for s in state["sections"]]

# Build workflow
orchestrator_worker_builder = StateGraph(State)

# Add the nodes
orchestrator_worker_builder.add_node("orchestrator", orchestrator)
orchestrator_worker_builder.add_node("llm_call", llm_call)
orchestrator_worker_builder.add_node("synthesizer", synthesizer)

# Add edges to connect nodes
orchestrator_worker_builder.add_edge(START, "orchestrator")
orchestrator_worker_builder.add_conditional_edges(
    "orchestrator", assign_workers, ["llm_call"]
)
orchestrator_worker_builder.add_edge("llm_call", "synthesizer")
orchestrator_worker_builder.add_edge("synthesizer", END)

# Compile the workflow
orchestrator_worker = orchestrator_worker_builder.compile()

# Show the workflow
display(Image(orchestrator_worker.get_graph().draw_mermaid_png()))

# Invoke
state = orchestrator_worker.invoke({"topic": "Create a report on LLM scaling laws"})

from IPython.display import Markdown
Markdown(state["final_report"])
```

## Evaluator-optimizer

In evaluator-optimizer workflows, one LLM call creates a response and the other evaluates that response. If the evaluator or a [human-in-the-loop](lc:oss/python/langgraph/interrupts) determines the response needs refinement, feedback is provided and the response is recreated. This loop continues until an acceptable response is generated.

Evaluator-optimizer workflows are commonly used when there's particular success criteria for a task, but iteration is required to meet that criteria. For example, there's not always a perfect match when translating text between two languages. It might take a few iterations to generate a translation with the same meaning across the two languages.

![evaluator_optimizer.png](/langchain/images/oss/images/evaluator_optimizer.png)


```lc-tabs
[
 {
  "label": "Graph API",
  "lang": "python",
  "code": "# Graph state\nclass State(TypedDict):\n    joke: str\n    topic: str\n    feedback: str\n    funny_or_not: str\n\n# Schema for structured output to use in evaluation\nclass Feedback(BaseModel):\n    grade: Literal[\"funny\", \"not funny\"] = Field(\n        description=\"Decide if the joke is funny or not.\",\n    )\n    feedback: str = Field(\n        description=\"If the joke is not funny, provide feedback on how to improve it.\",\n    )\n\n# Augment the LLM with schema for structured output\nevaluator = llm.with_structured_output(Feedback)\n\n# Nodes\ndef llm_call_generator(state: State):\n    \"\"\"LLM generates a joke\"\"\"\n\n    if state.get(\"feedback\"):\n        msg = llm.invoke(\n            f\"Write a joke about {state['topic']} but take into account the feedback: {state['feedback']}\"\n        )\n    else:\n        msg = llm.invoke(f\"Write a joke about {state['topic']}\")\n    return {\"joke\": msg.content}\n\ndef llm_call_evaluator(state: State):\n    \"\"\"LLM evaluates the joke\"\"\"\n\n    grade = evaluator.invoke(f\"Grade the joke {state['joke']}\")\n    return {\"funny_or_not\": grade.grade, \"feedback\": grade.feedback}\n\n# Conditional edge function to route back to joke generator or end based upon feedback from the evaluator\ndef route_joke(state: State):\n    \"\"\"Route back to joke generator or end based upon feedback from the evaluator\"\"\"\n\n    if state[\"funny_or_not\"] == \"funny\":\n        return \"Accepted\"\n    elif state[\"funny_or_not\"] == \"not funny\":\n        return \"Rejected + Feedback\"\n\n# Build workflow\noptimizer_builder = StateGraph(State)\n\n# Add the nodes\noptimizer_builder.add_node(\"llm_call_generator\", llm_call_generator)\noptimizer_builder.add_node(\"llm_call_evaluator\", llm_call_evaluator)\n\n# Add edges to connect nodes\noptimizer_builder.add_edge(START, \"llm_call_generator\")\noptimizer_builder.add_edge(\"llm_call_generator\", \"llm_call_evaluator\")\noptimizer_builder.add_conditional_edges(\n    \"llm_call_evaluator\",\n    route_joke,\n    {  # Name returned by route_joke : Name of next node to visit\n        \"Accepted\": END,\n        \"Rejected + Feedback\": \"llm_call_generator\",\n    },\n)\n\n# Compile the workflow\noptimizer_workflow = optimizer_builder.compile()\n\n# Show the workflow\ndisplay(Image(optimizer_workflow.get_graph().draw_mermaid_png()))\n\n# Invoke\nstate = optimizer_workflow.invoke({\"topic\": \"Cats\"})\nprint(state[\"joke\"])"
 },
 {
  "label": "Functional API",
  "lang": "python",
  "code": "# Schema for structured output to use in evaluation\nclass Feedback(BaseModel):\n    grade: Literal[\"funny\", \"not funny\"] = Field(\n        description=\"Decide if the joke is funny or not.\",\n    )\n    feedback: str = Field(\n        description=\"If the joke is not funny, provide feedback on how to improve it.\",\n    )\n\n# Augment the LLM with schema for structured output\nevaluator = llm.with_structured_output(Feedback)\n\n# Nodes\n@task\ndef llm_call_generator(topic: str, feedback: Feedback):\n    \"\"\"LLM generates a joke\"\"\"\n    if feedback:\n        msg = llm.invoke(\n            f\"Write a joke about {topic} but take into account the feedback: {feedback}\"\n        )\n    else:\n        msg = llm.invoke(f\"Write a joke about {topic}\")\n    return msg.content\n\n@task\ndef llm_call_evaluator(joke: str):\n    \"\"\"LLM evaluates the joke\"\"\"\n    feedback = evaluator.invoke(f\"Grade the joke {joke}\")\n    return feedback\n\n@entrypoint()\ndef optimizer_workflow(topic: str):\n    feedback = None\n    while True:\n        joke = llm_call_generator(topic, feedback).result()\n        feedback = llm_call_evaluator(joke).result()\n        if feedback.grade == \"funny\":\n            break\n\n    return joke\n\n# Invoke\nstream = optimizer_workflow.stream_events(\"Cats\", version=\"v3\")\nfor snapshot in stream.values:\n    print(snapshot)\n    print(\"\\n\")"
 }
]
```


## Agents

Agents are typically implemented as an LLM performing actions using [tools](lc:oss/python/langchain/tools). They operate in continuous feedback loops, and are used in situations where problems and solutions are unpredictable. Agents have more autonomy than workflows, and can make decisions about the tools they use and how to solve problems. You can still define the available toolset and guidelines for how agents behave.

![agent.png](/langchain/images/oss/images/agent.png)


> [!NOTE]
>
> To get started with agents, see the [quickstart](lc:oss/python/langchain/quickstart) or read more about [how they work](lc:oss/python/langchain/agents) in LangChain.


```lc-tabs
[
 {
  "label": "Using tools",
  "lang": "python",
  "code": "from langchain.tools import tool\n\n# Define tools\n@tool\ndef multiply(a: int, b: int) -> int:\n    \"\"\"Multiply `a` and `b`.\n\n    Args:\n        a: First int\n        b: Second int\n    \"\"\"\n    return a * b\n\n@tool\ndef add(a: int, b: int) -> int:\n    \"\"\"Adds `a` and `b`.\n\n    Args:\n        a: First int\n        b: Second int\n    \"\"\"\n    return a + b\n\n@tool\ndef divide(a: int, b: int) -> float:\n    \"\"\"Divide `a` and `b`.\n\n    Args:\n        a: First int\n        b: Second int\n    \"\"\"\n    return a / b\n\n# Augment the LLM with tools\ntools = [add, multiply, divide]\ntools_by_name = {tool.name: tool for tool in tools}\nllm_with_tools = llm.bind_tools(tools)"
 },
 {
  "label": "Graph API",
  "lang": "python",
  "code": "from langgraph.graph import MessagesState\nfrom langchain.messages import SystemMessage, HumanMessage, ToolMessage\n\n# Nodes\ndef llm_call(state: MessagesState):\n    \"\"\"LLM decides whether to call a tool or not\"\"\"\n\n    return {\n        \"messages\": [\n            llm_with_tools.invoke(\n                [\n                    SystemMessage(\n                        content=\"You are a helpful assistant tasked with performing arithmetic on a set of inputs.\"\n                    )\n                ]\n                + state[\"messages\"]\n            )\n        ]\n    }\n\ndef tool_node(state: MessagesState):\n    \"\"\"Performs the tool call\"\"\"\n\n    result = []\n    for tool_call in state[\"messages\"][-1].tool_calls:\n        tool = tools_by_name[tool_call[\"name\"]]\n        observation = tool.invoke(tool_call[\"args\"])\n        result.append(ToolMessage(content=observation, tool_call_id=tool_call[\"id\"]))\n    return {\"messages\": result}\n\n# Conditional edge function to route to the tool node or end based upon whether the LLM made a tool call\ndef should_continue(state: MessagesState) -> Literal[\"tool_node\", END]:\n    \"\"\"Decide if we should continue the loop or stop based upon whether the LLM made a tool call\"\"\"\n\n    messages = state[\"messages\"]\n    last_message = messages[-1]\n\n    # If the LLM makes a tool call, then perform an action\n    if last_message.tool_calls:\n        return \"tool_node\"\n\n    # Otherwise, we stop (reply to the user)\n    return END\n\n# Build workflow\nagent_builder = StateGraph(MessagesState)\n\n# Add nodes\nagent_builder.add_node(\"llm_call\", llm_call)\nagent_builder.add_node(\"tool_node\", tool_node)\n\n# Add edges to connect nodes\nagent_builder.add_edge(START, \"llm_call\")\nagent_builder.add_conditional_edges(\n    \"llm_call\",\n    should_continue,\n    [\"tool_node\", END]\n)\nagent_builder.add_edge(\"tool_node\", \"llm_call\")\n\n# Compile the agent\nagent = agent_builder.compile()\n\n# Show the agent\ndisplay(Image(agent.get_graph(xray=True).draw_mermaid_png()))\n\n# Invoke\nmessages = [HumanMessage(content=\"Add 3 and 4.\")]\nmessages = agent.invoke({\"messages\": messages})\nfor m in messages[\"messages\"]:\n    m.pretty_print()"
 },
 {
  "label": "Functional API",
  "lang": "python",
  "code": "from langgraph.graph import add_messages\nfrom langchain.messages import (\n    SystemMessage,\n    HumanMessage,\n    ToolCall,\n)\nfrom langchain_core.messages import BaseMessage\n\n@task\ndef call_llm(messages: list[BaseMessage]):\n    \"\"\"LLM decides whether to call a tool or not\"\"\"\n    return llm_with_tools.invoke(\n        [\n            SystemMessage(\n                content=\"You are a helpful assistant tasked with performing arithmetic on a set of inputs.\"\n            )\n        ]\n        + messages\n    )\n\n@task\ndef call_tool(tool_call: ToolCall):\n    \"\"\"Performs the tool call\"\"\"\n    tool = tools_by_name[tool_call[\"name\"]]\n    return tool.invoke(tool_call)\n\n@entrypoint()\ndef agent(messages: list[BaseMessage]):\n    llm_response = call_llm(messages).result()\n\n    while True:\n        if not llm_response.tool_calls:\n            break\n\n        # Execute tools\n        tool_result_futures = [\n            call_tool(tool_call) for tool_call in llm_response.tool_calls\n        ]\n        tool_results = [fut.result() for fut in tool_result_futures]\n        messages = add_messages(messages, [llm_response, *tool_results])\n        llm_response = call_llm(messages).result()\n\n    messages = add_messages(messages, llm_response)\n    return messages\n\n# Invoke\nmessages = [HumanMessage(content=\"Add 3 and 4.\")]\nstream = agent.stream_events(messages, version=\"v3\")\nfor snapshot in stream.values:\n    print(snapshot)\n    print(\"\\n\")"
 }
]
```


### ToolNode

`ToolNode` is a prebuilt node that executes tools in LangGraph workflows. It handles parallel tool execution, error handling, and state injection automatically.

Use `ToolNode` when you need fine-grained control over how your graph executes tools. This is the building block that powers tool execution in many LangGraph agent patterns.


```python
from langchain.tools import tool
from langgraph.prebuilt import ToolNode
from langgraph.graph import MessagesState, StateGraph

@tool
def search(query: str) -> str:
    """Search for information."""
    return f"Results for: {query}"

@tool
def calculator(expression: str) -> str:
    """Evaluate a math expression."""
    return str(eval(expression))

builder = StateGraph(MessagesState)
builder.add_node("tools", ToolNode([search, calculator]))
# ... add other nodes and edges
graph = builder.compile()
```


#### Access graph state and context from tools

Tools executed by `ToolNode` receive the arguments generated by the model as
their first argument. To read graph-side data that was not generated by the
model, use one of these options:

- In Python, read state and run-scoped context from the injected
  `ToolRuntime` argument.
- In JavaScript, read state and run-scoped context from the tool's second
  argument, typed as `ToolRuntime`.


> [!NOTE]
>
> Tools can only access the state values passed to the `ToolNode`. When
> `ToolNode` is added directly as a `StateGraph` node, that input is the current
> graph state. If you invoke a `ToolNode` manually from another node, pass the
> full state when tools need custom state fields. For example, `tool_node.invoke(state)`
> or `toolNode.invoke(state, config)` exposes the full state, while passing only
> `{"messages": state["messages"]}` or `{ messages: state.messages }` only exposes
> `messages`.


```python
from dataclasses import dataclass

from langchain.messages import AIMessage
from langchain.tools import ToolRuntime, tool
from langgraph.graph import MessagesState, START, StateGraph
from langgraph.prebuilt import ToolNode

class State(MessagesState):
    user_id: str

@dataclass
class Context:
    organization_id: str

@tool
def get_user_info(runtime: ToolRuntime[Context, State]) -> str:
    """Look up user information."""
    # Read the current graph state passed to the ToolNode.
    user_id = runtime.state["user_id"]

    # Read explicit per-run values that are not part of graph state.
    organization_id = runtime.context.organization_id

    return f"User {user_id} in organization {organization_id}"

builder = StateGraph(State, context_schema=Context)
builder.add_node("tools", ToolNode([get_user_info]))
builder.add_edge(START, "tools")
graph = builder.compile()

result = graph.invoke(
    {
        "messages": [
            AIMessage(
                content="",
                tool_calls=[
                    {
                        "name": "get_user_info",
                        "args": {},
                        "id": "call_user_info",
                    }
                ],
            )
        ],
        "user_id": "user_123",
    },
    context=Context(organization_id="org_456"),
)
```
