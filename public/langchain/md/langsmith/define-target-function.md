There are three main pieces need to run an evaluation:

1. A [dataset](lc:langsmith/evaluation-concepts#datasets) of test inputs and expected outputs.
2. A target function which is what you're evaluating.
3. [Evaluators](lc:langsmith/evaluation-concepts#evaluators) that score your target function's outputs.

This guide shows you how to define the target function depending on the part of your application you are evaluating. See here for [how to create a dataset](lc:langsmith/manage-datasets-programmatically) and [how to define evaluators](lc:langsmith/code-evaluator-ui), and here for an [end-to-end example of running an evaluation](lc:langsmith/evaluate-llm-application).

## Target function signature

In order to evaluate an application in code, we need a way to run the application. When using `evaluate()` (`Python`[Client.evaluate] / [JavaScript](https://reference.langchain.com/javascript/functions/langsmith.evaluation.evaluate.html)) we'll do this by passing in a *target function* argument. This is a function that takes in a dataset [Example's](lc:langsmith/evaluation-concepts#examples) inputs and returns the application output as a dict. Within this function we can call our application however we'd like. We can also format the output however we'd like. The key is that any evaluator functions we define should work with the output format we return in our target function.

```python
from langsmith import Client

# 'inputs' will come from your dataset.
def dummy_target(inputs: dict) -> dict:
    return {"foo": 1, "bar": "two"}

# 'inputs' will come from your dataset.
# 'outputs' will come from your target function.
def evaluator_one(inputs: dict, outputs: dict) -> bool:
    return outputs["foo"] == 2

def evaluator_two(inputs: dict, outputs: dict) -> bool:
    return len(outputs["bar"]) < 3

client = Client()
results = client.evaluate(
    dummy_target,  # <-- target function
    data="your-dataset-name",
    evaluators=[evaluator_one, evaluator_two],
    ...
)
```


> [!TIP]
>
> `evaluate()` will automatically trace your target function. This means that if you run any traceable code within your target function, this will also be traced as child runs of the target trace.


## Example: Single LLM call

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from langsmith import wrappers\nfrom openai import OpenAI\n\n# Optionally wrap the OpenAI client to automatically\n# trace all model calls.\noai_client = wrappers.wrap_openai(OpenAI())\n\ndef target(inputs: dict) -> dict:\n  # This assumes your dataset has inputs with a 'messages' key.\n  # You can update to match your dataset schema.\n  messages = inputs[\"messages\"]\n  response = oai_client.chat.completions.create(\n      messages=messages,\n      model=\"gpt-5.4-mini\",\n  )\n  return {\"answer\": response.choices[0].message.content}"
 },
 {
  "label": "Python (LangChain)",
  "lang": "python",
  "code": "from langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\"gpt-5.4-mini\")\n\ndef target(inputs: dict) -> dict:\n  # This assumes your dataset has inputs with a `messages` key\n  messages = inputs[\"messages\"]\n  response = model.invoke(messages)\n  return {\"answer\": response.content}"
 }
]
```

## Example: Non-LLM component

```python Python
from langsmith import traceable

# Optionally decorate with '@traceable' to trace all invocations of this function.
@traceable
def calculator_tool(operation: str, number1: float, number2: float) -> str:
  if operation == "add":
      return str(number1 + number2)
  elif operation == "subtract":
      return str(number1 - number2)
  elif operation == "multiply":
      return str(number1 * number2)
  elif operation == "divide":
      return str(number1 / number2)
  else:
      raise ValueError(f"Unrecognized operation: {operation}.")

# This is the function you will evaluate.
def target(inputs: dict) -> dict:
  # This assumes your dataset has inputs with `operation`, `num1`, and `num2` keys.
  operation = inputs["operation"]
  number1 = inputs["num1"]
  number2 = inputs["num2"]
  result = calculator_tool(operation, number1, number2)
  return {"result": result}
```

## Example: Application or agent

```python Python
from my_agent import agent

      # This is the function you will evaluate.
def target(inputs: dict) -> dict:
  # This assumes your dataset has inputs with a `messages` key
  messages = inputs["messages"]
  # Replace `invoke` with whatever you use to call your agent
  response = agent.invoke({"messages": messages})
  # This assumes your agent output is in the right format
  return response
```


> [!TIP]
>
> If you have a LangGraph/LangChain agent that accepts the inputs defined in your dataset and that returns the output format you want to use in your evaluators, you can pass that object in as the target directly:
>
> ```python
> from my_agent import agent
> from langsmith import Client
> client = Client()
> client.evaluate(agent, ...)
> ```
