> [!NOTE]
>
> * `langchain`: [Python](https://docs.langchain.com/oss/python/langchain/overview) and [JS/TS](https://docs.langchain.com/oss/javascript/langchain/overview)
> * Runnable: [Python](https://reference.langchain.com/python/langchain_core/runnables/) and [JS/TS](https://reference.langchain.com/javascript/classes/_langchain_core.runnables.Runnable.html)


`langchain` [`Runnable`](https://reference.langchain.com/python/langchain_core/runnables/) objects (such as chat models, retrievers, chains, etc.) can be passed directly into `evaluate()` / `aevaluate()`.

## Setup

Let's define a simple chain to evaluate. First, install all the required packages:

```lc-tabs
[
 {
  "label": "Python",
  "lang": "bash",
  "code": "pip install -U langsmith langchain[openai]"
 },
 {
  "label": "TypeScript",
  "lang": "bash",
  "code": "yarn add langsmith @langchain/openai"
 }
]
```

Now define a chain:

```python Python
from langchain.chat_models import init_chat_model
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

instructions = (
    "Please review the user query below and determine if it contains any form "
    "of toxic behavior, such as insults, threats, or highly negative comments. "
    "Respond with 'Toxic' if it does, and 'Not toxic' if it doesn't."
)

prompt = ChatPromptTemplate(
    [("system", instructions), ("user", "{text}")],
)

model = init_chat_model("gpt-5.5")
chain = prompt | model | StrOutputParser()
```

## Evaluate

To evaluate our chain we can pass it directly to the `evaluate()` / `aevaluate()` method. Note that the input variables of the chain must match the keys of the example inputs. In this case, the example inputs should have the form `{"text": "..."}`.

```python Python
from langsmith import Client, aevaluate

client = Client()

# Clone a dataset of texts with toxicity labels.
# Each example input has a "text" key and each output has a "label" key.
dataset = client.clone_public_dataset(
    "https://smith.langchain.com/public/3d6831e6-1680-4c88-94df-618c8e01fc55/d"
)

def correct(outputs: dict, reference_outputs: dict) -> bool:
    # Since our chain outputs a string not a dict, this string
    # gets stored under the default "output" key in the outputs dict:
    actual = outputs["output"]
    expected = reference_outputs["label"]
    return actual == expected

async def main():
    results = await aevaluate(
        chain,
        data=dataset,
        evaluators=[correct],
        experiment_prefix="gpt-5.5, baseline",
        metadata={"models": "openai:gpt-5.5"},  # optional, used to populate model/prompt/tool columns in UI
    )
    print(results)

asyncio.run(main())
```

The runnable is traced appropriately for each output.

![Runnable Evaluation](/langchain/images/langsmith/images/runnable-eval.png)

## Related

* [How to evaluate a `langgraph` graph](lc:langsmith/evaluate-on-intermediate-steps)
