This tutorial will show you how to use LangSmith's integrations with popular testing tools (Pytest, Vitest, and Jest) to evaluate your LLM application. We will create a ReAct agent that answers questions about publicly traded stocks and write a comprehensive test suite for it.

## Setup

This tutorial uses [LangGraph](https://langchain-ai.github.io/langgraph/tutorials/introduction/) for agent orchestration, [OpenAI's GPT-4o](https://platform.openai.com/docs/models#gpt-4o), [Tavily](https://tavily.com/) for search, [E2B's](https://e2b.dev/) code interpreter, and [Polygon](https://polygon.io/stocks) to retrieve stock data but it can be adapted for other frameworks, models and tools with minor modifications. Tavily, E2B and Polygon are free to sign up for.

### Installation

First, install the packages required for making the agent:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "bash",
  "code": "pip install -U langgraph langchain[openai] langchain-community e2b-code-interpreter"
 },
 {
  "label": "TypeScript",
  "lang": "bash",
  "code": "yarn add @langchain/openai @langchain/community @langchain/langgraph @langchain/core @e2b/code-interpreter @polygon.io/client-js openai zod"
 }
]
```

Next, install the testing framework:

```lc-tabs
[
 {
  "label": "Pytest",
  "lang": "bash",
  "code": "# Make sure you have langsmith>=0.3.1\npip install -U \"langsmith[pytest]\""
 },
 {
  "label": "Vitest",
  "lang": "bash",
  "code": "yarn add -D langsmith vitest"
 },
 {
  "label": "Jest",
  "lang": "bash",
  "code": "yarn add -D langsmith jest"
 }
]
```

### Environment variables

Set the following environment variables:

```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY=<YOUR_LANGSMITH_API_KEY>
export OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
export TAVILY_API_KEY=<YOUR_TAVILY_API_KEY>
export E2B_API_KEY=<YOUR_E2B_API_KEY>
export POLYGON_API_KEY=<YOUR_POLYGON_API_KEY>
```

## Create your app

To define our React agent, we will use LangGraph/LangGraph.js for the orchestation and LangChain for the LLM and tools.

### Define tools

First we are going to define the tools we are going to use in our agent. There are going to be 3 tools:

* A search tool using Tavily
* A code interpreter tool using E2B
* A stock information tool using Polygon


> [!WARNING]
>
> The `langchain-community` package is no longer maintained. Examples that import from `langchain_community` may be outdated or broken. Use with caution.


```python Python
from langchain_community.tools import TavilySearchResults
from e2b_code_interpreter import Sandbox
from langchain_community.tools.polygon.aggregates import PolygonAggregates
from langchain_community.utilities.polygon import PolygonAPIWrapper
from typing_extensions import Annotated, TypedDict, Optional, Literal

# Define search tool
search_tool = TavilySearchResults(
  max_results=5,
  include_raw_content=True,
)

# Define code tool
def code_tool(code: str) -> str:
  """Execute python code and return the result."""
  sbx = Sandbox()
  execution = sbx.run_code(code)

  if execution.error:
      return f"Error: {execution.error}"
  return f"Results: {execution.results}, Logs: {execution.logs}"

# Define input schema for stock ticker tool
class TickerToolInput(TypedDict):
  """Input format for the ticker tool.
    The tool will pull data in aggregate blocks (timespan_multiplier * timespan) from the from_date to the to_date
  """
  ticker: Annotated[str, ..., "The ticker symbol of the stock"]
  timespan: Annotated[Literal["minute", "hour", "day", "week", "month", "quarter", "year"], ..., "The size of the time window."]
  timespan_multiplier: Annotated[int, ..., "The multiplier for the time window"]
  from_date: Annotated[str, ..., "The date to start pulling data from, YYYY-MM-DD format - ONLY include the year month and day"]
  to_date: Annotated[str, ..., "The date to stop pulling data, YYYY-MM-DD format - ONLY include the year month and day"]

api_wrapper = PolygonAPIWrapper()
polygon_aggregate = PolygonAggregates(api_wrapper=api_wrapper)

# Define stock ticker tool
def ticker_tool(query: TickerToolInput) -> str:
  """Pull data for the ticker."""
  return polygon_aggregate.invoke(query)
```

### Define agent

Now that we have defined all of our tools, we can use `create_agent` to create our agent.

```python Python
from typing_extensions import Annotated, TypedDict
from langchain.agents import create_agent

class AgentOutputFormat(TypedDict):
    numeric_answer: Annotated[float | None, ..., "The numeric answer, if the user asked for one"]
    text_answer: Annotated[str | None, ..., "The text answer, if the user asked for one"]
    reasoning: Annotated[str, ..., "The reasoning behind the answer"]

agent = create_agent(
    model="gpt-5.4-mini",
    tools=[code_tool, search_tool, polygon_aggregates],
    response_format=AgentOutputFormat,
    system_prompt="You are a financial expert. Respond to the users query accurately",
)
```

## Write tests

Now that we have defined our agent, let's write a few tests to ensure basic functionality. In this tutorial we are going to test whether the agent's tool calling abilities are working, whether the agent knows to ignore irrelevant questions, and whether it is able to answer complex questions that involve using all of the tools.

We need to first set up a test file and add the imports needed at the top of the file.

```python Pytest
Create a `tests/test_agent.py` file.

from app import agent, polygon_aggregates, search_tool # import from wherever your agent is defined

from langsmith import testing as t
```

### Test 1: Handle off-topic questions

The first test will be a simple check that the agent does not use tools on irrelevant queries.

```python Pytest
@pytest.mark.langsmith
@pytest.mark.parametrize(
  # <-- Can still use all normal pytest markers
  "query",
  ["Hello!", "How are you doing?"],
)
def test_no_tools_on_offtopic_query(query: str) -> None:
  """Test that the agent does not use tools on offtopic queries."""
  # Log the test example
  t.log_inputs({"query": query})
  expected = []
  t.log_reference_outputs({"tool_calls": expected})
  # Call the agent's model node directly instead of running the ReACT loop.
  result = agent.nodes["agent"].invoke(
      {"messages": [{"role": "user", "content": query}]}
  )
  actual = result["messages"][0].tool_calls
  t.log_outputs({"tool_calls": actual})
  # Check that no tool calls were made.
  assert actual == expected
```

### Test 2: Simple tool calling

For tool calling, we are going to verify that the agent calls the correct tool with the correct parameters.

```python Pytest
@pytest.mark.langsmith
def test_searches_for_correct_ticker() -> None:
  """Test that the model looks up the correct ticker on simple query."""
  # Log the test example
  query = "What is the price of Apple?"
  t.log_inputs({"query": query})
  expected = "AAPL"
  t.log_reference_outputs({"ticker": expected})
  # Call the agent's model node directly instead of running the full ReACT loop.
  result = agent.nodes["agent"].invoke(
      {"messages": [{"role": "user", "content": query}]}
  )
  tool_calls = result["messages"][0].tool_calls
  if tool_calls[0]["name"] == polygon_aggregates.name:
      actual = tool_calls[0]["args"]["ticker"]
  else:
      actual = None
  t.log_outputs({"ticker": actual})
  # Check that the right ticker was queried
  assert actual == expected
```

### Test 3: Complex tool calling

Some tool calls are easier to test than others. With the ticker lookup, we can assert that the correct ticker is searched. With the coding tool, the inputs and outputs of the tool are much less constrained, and there are lots of ways to get to the right answer. In this case, it's simpler to test that the tool is used correctly by running the full agent and asserting that it both calls the coding tool and that it ends up with the right answer.

```python Pytest
@pytest.mark.langsmith
def test_executes_code_when_needed() -> None:
  query = (
      "In the past year Facebook stock went up by 66.76%, "
      "Apple by 25.24%, Google by 37.11%, Amazon by 47.52%, "
      "Netflix by 78.31%. What's the avg return in the past "
      "year of the FAANG stocks, expressed as a percentage?"
  )
  t.log_inputs({"query": query})
  expected = 50.988
  t.log_reference_outputs({"response": expected})
  # Test that the agent executes code when needed
  result = agent.invoke({"messages": [{"role": "user", "content": query}]})
  t.log_outputs({"result": result["structured_response"].get("numeric_answer")})
  # Grab all the tool calls made by the LLM
  tool_calls = [
      tc["name"]
      for msg in result["messages"]
      for tc in getattr(msg, "tool_calls", [])
  ]
  # This will log the number of steps taken by the agent, which is useful for
  # determining how efficiently the agent gets to an answer.
  t.log_feedback(key="num_steps", score=len(result["messages"]) - 1)
  # Assert that the code tool was used
  assert "code_tool" in tool_calls
  # Assert that a numeric answer was provided:
  assert result["structured_response"].get("numeric_answer") is not None
  # Assert that the answer is correct
  assert abs(result["structured_response"]["numeric_answer"] - expected) <= 0.01
```

### Test 4: LLM-as-a-judge

We are going to ensure that the agent's answer is grounded in the search results by running an LLM-as-a-judge evaluation. In order to trace the LLM-as-a-Judge call separately from our agent, we will use the LangSmith provided `trace_feedback` context manager in Python and `wrapEvaluator` function in JS/TS.

```python Pytest
from typing_extensions import Annotated, TypedDict
from langchain.chat_models import init_chat_model

class Grade(TypedDict):
  """Evaluate the groundedness of an answer in source documents."""
  score: Annotated[
      bool,
      ...,
      "Return True if the answer is fully grounded in the source documents, otherwise False.",
  ]

judge_llm = init_chat_model("gpt-5.5").with_structured_output(Grade)

@pytest.mark.langsmith
def test_grounded_in_source_info() -> None:
  """Test that response is grounded in the tool outputs."""
  query = "How did Nvidia stock do in 2024 according to analysts?"
  t.log_inputs({"query": query})
  result = agent.invoke({"messages": [{"role": "user", "content": query}]})
  # Grab all the search calls made by the LLM
  search_results = "\n\n".join(
      msg.content
      for msg in result["messages"]
      if msg.type == "tool" and msg.name == search_tool.name
  )
  t.log_outputs(
      {
          "response": result["structured_response"].get("text_answer"),
          "search_results": search_results,
      }
  )
  # Trace the feedback LLM run separately from the deployment run.
  with t.trace_feedback():
      # Instructions for the LLM judge
      instructions = (
          "Grade the following ANSWER. "
          "The ANSWER should be fully grounded in (i.e. supported by) the source DOCUMENTS. "
          "Return True if the ANSWER is fully grounded in the DOCUMENTS. "
          "Return False if the ANSWER is not grounded in the DOCUMENTS."
      )
      answer_and_docs = (
          f"ANSWER: {result['structured_response'].get('text_answer', '')}\n"
          f"DOCUMENTS:\n{search_results}"
      )
      # Run the judge LLM
      grade = judge_llm.invoke(
          [
              {"role": "system", "content": instructions},
              {"role": "user", "content": answer_and_docs},
          ]
      )
      t.log_feedback(key="groundedness", score=grade["score"])
  assert grade['score']
```

## Run tests

Once you have setup your config files (if you are using Vitest or Jest), you can run your tests using the following commands:

### Config files for Vitest/Jest

    

  ```lc-tabs
  [
   {
    "label": "Vitest",
    "lang": "typescript",
    "code": "Create a `ls.vitest.config.ts` file:\n\nexport default defineConfig({\n  test: {\n    include: [\"**/*.eval.?(c|m)[jt]s\"],\n    reporters: [\"langsmith/vitest/reporter\"],\n    setupFiles: [\"dotenv/config\"],\n    testTimeout: 30000,\n  },\n});"
   },
   {
    "label": "Jest",
    "lang": "javascript",
    "code": "Create a `ls.jest.config.ts` file:\n\nrequire('dotenv').config();\n\nmodule.exports = {\n  preset: 'ts-jest',\n  testEnvironment: 'node',\n  testMatch: [\n    '<rootDir>/tests/jest/**/*.jest.eval.ts'\n  ],\n  testPathIgnorePatterns: [\n    '<rootDir>/tests/vitest/.*.vitest.eval.ts$'\n  ],\n  reporters: [\"langsmith/jest/reporter\"],\n  testTimeout: 30000,\n};"
   }
  ]
  ```

    

```lc-tabs
[
 {
  "label": "Pytest",
  "lang": "bash",
  "code": "pytest --langsmith-output tests"
 },
 {
  "label": "Vitest",
  "lang": "bash",
  "code": "yarn vitest --config ls.vitest.config.ts"
 },
 {
  "label": "Jest",
  "lang": "bash",
  "code": "yarn jest --config ls.jest.config.ts"
 }
]
```

## Reference code

Remember to also add the config files for Vitest and Jest to your project.

### Agent

### Agent code

    

    


> [!WARNING]
>
> The `langchain-community` package is no longer maintained. Examples that import from `langchain_community` may be outdated or broken. Use with caution.


    ```python Python
    from e2b_code_interpreter import Sandbox
    from langchain_community.tools import PolygonAggregates, TavilySearchResults
    from langchain_community.utilities.polygon import PolygonAPIWrapper
    from langchain.agents import create_agent
    from typing_extensions import Annotated, TypedDict
    
    search_tool = TavilySearchResults(
        max_results=5,
        include_raw_content=True,
    )
    
    def code_tool(code: str) -> str:
        """Execute python code and return the result."""
        sbx = Sandbox()
        execution = sbx.run_code(code)
    
        if execution.error:
            return f"Error: {execution.error}"
        return f"Results: {execution.results}, Logs: {execution.logs}"
    
    polygon_aggregates = PolygonAggregates(api_wrapper=PolygonAPIWrapper())
    
    class AgentOutputFormat(TypedDict):
        numeric_answer: Annotated[
            float | None, ..., "The numeric answer, if the user asked for one"
        ]
        text_answer: Annotated[
            str | None, ..., "The text answer, if the user asked for one"
        ]
        reasoning: Annotated[str, ..., "The reasoning behind the answer"]
    
    agent = create_agent(
        model="gpt-5.4-mini",
        tools=[code_tool, search_tool, polygon_aggregates],
        response_format=AgentOutputFormat,
        system_prompt="You are a financial expert. Respond to the users query accurately",
    )
    ```

    

### Tests

### Test code

    

  ```python Pytest
  # from app import agent, polygon_aggregates, search_tool # import from wherever your agent is defined
  
  from langchain.chat_models import init_chat_model
  from langsmith import testing as t
  from typing_extensions import Annotated, TypedDict
  
  @pytest.mark.langsmith
  @pytest.mark.parametrize(
    # <-- Can still use all normal pytest markers
    "query",
    ["Hello!", "How are you doing?"],
  )
  def test_no_tools_on_offtopic_query(query: str) -> None:
    """Test that the agent does not use tools on offtopic queries."""
    # Log the test example
    t.log_inputs({"query": query})
    expected = []
    t.log_reference_outputs({"tool_calls": expected})
    # Call the agent's model node directly instead of running the ReACT loop.
    result = agent.nodes["agent"].invoke(
        {"messages": [{"role": "user", "content": query}]}
    )
    actual = result["messages"][0].tool_calls
    t.log_outputs({"tool_calls": actual})
    # Check that no tool calls were made.
    assert actual == expected
  
  @pytest.mark.langsmith
  def test_searches_for_correct_ticker() -> None:
    """Test that the model looks up the correct ticker on simple query."""
    # Log the test example
    query = "What is the price of Apple?"
    t.log_inputs({"query": query})
    expected = "AAPL"
    t.log_reference_outputs({"ticker": expected})
    # Call the agent's model node directly instead of running the full ReACT loop.
    result = agent.nodes["agent"].invoke(
        {"messages": [{"role": "user", "content": query}]}
    )
    tool_calls = result["messages"][0].tool_calls
    if tool_calls[0]["name"] == polygon_aggregates.name:
        actual = tool_calls[0]["args"]["ticker"]
    else:
        actual = None
    t.log_outputs({"ticker": actual})
    # Check that the right ticker was queried
    assert actual == expected
  
  @pytest.mark.langsmith
  def test_executes_code_when_needed() -> None:
    query = (
        "In the past year Facebook stock went up by 66.76%, "
        "Apple by 25.24%, Google by 37.11%, Amazon by 47.52%, "
        "Netflix by 78.31%. What's the avg return in the past "
        "year of the FAANG stocks, expressed as a percentage?"
    )
    t.log_inputs({"query": query})
    expected = 50.988
    t.log_reference_outputs({"response": expected})
    # Test that the agent executes code when needed
    result = agent.invoke({"messages": [{"role": "user", "content": query}]})
    t.log_outputs({"result": result["structured_response"].get("numeric_answer")})
    # Grab all the tool calls made by the LLM
    tool_calls = [
        tc["name"]
        for msg in result["messages"]
        for tc in getattr(msg, "tool_calls", [])
    ]
    # This will log the number of steps taken by the agent, which is useful for
    # determining how efficiently the agent gets to an answer.
    t.log_feedback(key="num_steps", score=len(result["messages"]) - 1)
    # Assert that the code tool was used
    assert "code_tool" in tool_calls
    # Assert that a numeric answer was provided:
    assert result["structured_response"].get("numeric_answer") is not None
    # Assert that the answer is correct
    assert abs(result["structured_response"]["numeric_answer"] - expected) <= 0.01
  
  class Grade(TypedDict):
    """Evaluate the groundedness of an answer in source documents."""
    score: Annotated[
        bool,
        ...,
        "Return True if the answer is fully grounded in the source documents, otherwise False.",
    ]
  
  judge_llm = init_chat_model("gpt-5.5").with_structured_output(Grade)
  
  @pytest.mark.langsmith
  def test_grounded_in_source_info() -> None:
    """Test that response is grounded in the tool outputs."""
    query = "How did Nvidia stock do in 2024 according to analysts?"
    t.log_inputs({"query": query})
    result = agent.invoke({"messages": [{"role": "user", "content": query}]})
    # Grab all the search calls made by the LLM
    search_results = "\n\n".join(
        msg.content
        for msg in result["messages"]
        if msg.type == "tool" and msg.name == search_tool.name
    )
    t.log_outputs(
        {
            "response": result["structured_response"].get("text_answer"),
            "search_results": search_results,
        }
    )
    # Trace the feedback LLM run separately from the deployment run.
    with t.trace_feedback():
        # Instructions for the LLM judge
        instructions = (
            "Grade the following ANSWER. "
            "The ANSWER should be fully grounded in (i.e. supported by) the source DOCUMENTS. "
            "Return True if the ANSWER is fully grounded in the DOCUMENTS. "
            "Return False if the ANSWER is not grounded in the DOCUMENTS."
        )
        answer_and_docs = (
            f"ANSWER: {result['structured_response'].get('text_answer', '')}\n"
            f"DOCUMENTS:\n{search_results}"
        )
        # Run the judge LLM
        grade = judge_llm.invoke(
            [
                {"role": "system", "content": instructions},
                {"role": "user", "content": answer_and_docs},
            ]
        )
        t.log_feedback(key="groundedness", score=grade["score"])
    assert grade["score"]
  ```
