Evaluation of existing experiments is currently only supported in the Python SDK.

After running an experiment, you may want to **add new evaluation metrics without re-running your application**. This is useful when you've added new evaluators or want to apply different scoring criteria to existing results. Instead of re-executing your target function on all examples, you can evaluate the existing experiment traces directly.

To add evaluators to an existing experiment, pass the experiment name or ID to `evaluate()` / `aevaluate()` instead of a target function. The evaluators will run on the cached traces from the original experiment, accessing the inputs, outputs, and any intermediate steps that were logged.

## Example

```python
from langsmith import evaluate

def always_half(inputs: dict, outputs: dict) -> float:
    return 0.5

experiment_name = "my-experiment:abc"  # Replace with an actual experiment name or ID

evaluate(experiment_name, evaluators=[always_half])
```

## Related topics

* [Retry failed examples in experiments](lc:langsmith/evaluate-with-retry)
* [Run an evaluation](lc:langsmith/evaluate-llm-application)
* [Run an evaluation asynchronously](lc:langsmith/evaluation-async)
