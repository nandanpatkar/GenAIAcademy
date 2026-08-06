> [!NOTE]
>
> Concept: [Pairwise evaluations](lc:langsmith/evaluation-concepts#pairwise)


LangSmith supports evaluating **existing** experiments in a comparative manner. Instead of evaluating one output at a time, you can score the output from multiple experiments against each other. In this guide, you'll use [`evaluate()`](https://docs.smith.langchain.com/reference/python/evaluation/langsmith.evaluation._runner.evaluate) with two existing experiments to [define an evaluator](#define-a-pairwise-evaluator) and [run a pairwise evaluation](#run-a-pairwise-evaluation). Finally, you'll use the LangSmith UI to [view the pairwise experiments](#view-pairwise-experiments).

## Prerequisites

* If you haven't already created experiments to compare, check out the [quick start](lc:langsmith/evaluation-quickstart) or the [how-to guide](lc:langsmith/evaluate-llm-application) to get started with evaluations.
* This guide requires `langsmith` Python version `>=0.2.0` or JS version `>=0.2.9`.


> [!NOTE]
>
> You can also use [`evaluate_comparative()`](https://docs.smith.langchain.com/reference/python/evaluation/langsmith.evaluation._runner.evaluate_comparative) with more than two existing experiments.


## `evaluate()` comparative args

At its simplest, `evaluate` / `aevaluate` function takes the following arguments:

| Argument     | Description                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `target`     | A list of the two **existing experiments** you would like to evaluate against each other. These can be uuids or experiment names.  |
| `evaluators` | A list of the pairwise evaluators that you would like to attach to this evaluation. See the section below for how to define these. |

Along with these, you can also pass in the following optional args:

| Argument                                 | Description                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `randomize_order` / `randomizeOrder`     | An optional boolean indicating whether the order of the outputs should be randomized for each evaluation. This is a strategy for minimizing positional bias in your prompt: often, the LLM will be biased towards one of the responses based on the order. This should mainly be addressed via prompt engineering, but this is another optional mitigation. Defaults to False. |
| `experiment_prefix` / `experimentPrefix` | A prefix to be attached to the beginning of the pairwise experiment name. Defaults to None.                                                                                                                                                                                                                                                                                    |
| `description`                            | A description of the pairwise experiment. Defaults to None.                                                                                                                                                                                                                                                                                                                    |
| `max_concurrency` / `maxConcurrency`     | The maximum number of concurrent evaluations to run. Defaults to 5.                                                                                                                                                                                                                                                                                                            |
| `client`                                 | The LangSmith client to use. Defaults to None.                                                                                                                                                                                                                                                                                                                                 |
| `metadata`                               | Metadata to attach to your pairwise experiment. Defaults to None.                                                                                                                                                                                                                                                                                                              |
| `load_nested` / `loadNested`             | Whether to load all child runs for the experiment. When False, only the root trace will be passed to your evaluator. Defaults to False.                                                                                                                                                                                                                                        |

## Define a pairwise evaluator

Pairwise evaluators are just functions with an expected signature.

### Evaluator args

Custom evaluator functions must have specific argument names. They can take any subset of the following arguments:

* `inputs: dict`: A dictionary of the inputs corresponding to a single example in a dataset.
* `outputs: list[dict]`: A two-item list of the dict outputs produced by each experiment on the given inputs.
* `reference_outputs` / `referenceOutputs: dict`: A dictionary of the reference outputs associated with the example, if available.
* `runs: list[Run]`: A two-item list of the full [Run](lc:langsmith/run-data-format) objects generated by the two experiments on the given example. Use this if you need access to intermediate steps or metadata about each run.
* `example: Example`: The full dataset [Example](lc:langsmith/example-data-format), including the example inputs, outputs (if available), and metadata (if available).

For most use cases you'll only need `inputs`, `outputs`, and `reference_outputs` / `referenceOutputs`. `runs` and `example` are useful only if you need some extra trace or example metadata outside of the actual inputs and outputs of the application.

### Evaluator output

Custom evaluators are expected to return one of the following types:

Python and JS/TS

* `dict`: dictionary with keys:

  * `key`, which represents the feedback key that will be logged
  * `scores`, which is a mapping from run ID to score for that run.
  * `comment`, which is a string. Most commonly used for model reasoning.

Currently Python only

* `list[int | float | bool]`: a two-item list of scores. The list is assumed to have the same order as the `runs` / `outputs` evaluator args. The evaluator function name is used for the feedback key.

Note that you should choose a feedback key that is distinct from standard feedbacks on your run. We recommend prefixing pairwise feedback keys with `pairwise_` or `ranked_`.

## Run a pairwise evaluation

The following example uses [a prompt](https://smith.langchain.com/hub/langchain-ai/pairwise-evaluation-2) which asks the LLM to decide which is better between two AI assistant responses. It uses structured output to parse the AI's response: 0, 1, or 2.


> [!NOTE]
>
> In the Python example below, we are pulling [this structured prompt](https://smith.langchain.com/hub/langchain-ai/pairwise-evaluation-2) from the [LangChain Hub](lc:langsmith/manage-prompts#public-prompt-hub) and using it with a LangChain chat model wrapper.
>
> **Usage of LangChain is totally optional.** To illustrate this point, the TypeScript example uses the OpenAI SDK directly.


- Python: Requires `langsmith>=0.2.0`
- TypeScript: Requires `langsmith>=0.2.9`

```python Python
from langchain_classic import hub
from langchain.chat_models import init_chat_model
from langsmith import evaluate

# See the prompt: https://smith.langchain.com/hub/langchain-ai/pairwise-evaluation-2
prompt = hub.pull("langchain-ai/pairwise-evaluation-2")
model = init_chat_model("gpt-5.5")
chain = prompt | model

def ranked_preference(inputs: dict, outputs: list[dict]) -> list:
    # Assumes example inputs have a 'question' key and experiment
    # outputs have an 'answer' key.
    response = chain.invoke({
        "question": inputs["question"],
        "answer_a": outputs[0].get("answer", "N/A"),
        "answer_b": outputs[1].get("answer", "N/A"),
    })
    if response["Preference"] == 1:
        scores = [1, 0]
    elif response["Preference"] == 2:
        scores = [0, 1]
    else:
        scores = [0, 0]
    return scores

evaluate(
    ("experiment-1", "experiment-2"),  # Replace with the names/IDs of your experiments
    evaluators=[ranked_preference],
    randomize_order=True,
    max_concurrency=4,
)
```

## View pairwise experiments

Navigate to the "Pairwise Experiments" tab from the dataset page:

![Pairwise Experiments Tab](/langchain/images/langsmith/images/pairwise-from-dataset.png)

Click on a pairwise experiment that you would like to inspect, and you will be brought to the Comparison View:

![Pairwise Comparison View](/langchain/images/langsmith/images/pairwise-comparison-view.png)

You may filter to runs where the first experiment was better or vice versa by clicking the thumbs up/thumbs down buttons in the table header:

![Pairwise Filtering](/langchain/images/langsmith/images/filter-pairwise.png)
