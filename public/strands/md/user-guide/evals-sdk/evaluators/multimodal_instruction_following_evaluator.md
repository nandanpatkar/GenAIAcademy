## Overview

The `MultimodalInstructionFollowingEvaluator` assesses whether an agent response satisfies the explicit constraints in the user’s instruction (count, format, scope, order, completeness, and style), independently of factual accuracy.

## Key Features

-   **Output-Level Evaluation**: Scores a single agent response per case
-   **Binary Scoring**: `1.0` if all constraints are satisfied, `0.0` if any constraint is violated
-   **Constraint-Focused**: Evaluates compliance with directives, not overall correctness or quality
-   **Image-Aware**: Verifies image-referential constraints (e.g., “describe only the background”)

## When to Use

Use the `MultimodalInstructionFollowingEvaluator` when you need to:

-   Verify that responses respect format constraints (bullet vs. numbered list, paragraph, JSON)
-   Check count constraints (“exactly N sentences”, “in one paragraph”)
-   Assess scope constraints (“describe only the foreground”, “do not mention people”)
-   Validate order constraints (“left to right”, “largest to smallest”)
-   Evaluate instruction compliance independently from factual correctness

## Evaluation Level

This evaluator operates at the **OUTPUT\_LEVEL**, scoring a single agent response per case.

## Parameters

### `rubric` (optional)

-   **Type**: `str | None`
-   **Default**: `INSTRUCTION_FOLLOWING_RUBRIC_V0`
-   **Description**: Custom rubric. Leave unset to use the default rubric.

### `model` (optional)

-   **Type**: `Model | str | None`
-   **Default**: `None` (uses default Bedrock model)
-   **Description**: Multimodal judge model.

### `include_inputs` (optional)

-   **Type**: `bool`
-   **Default**: `True`

### `system_prompt` (optional)

-   **Type**: `str | None`
-   **Default**: `None` (uses the built-in `MLLM_JUDGE_SYSTEM_PROMPT`)

### `reference_suffix` (optional)

-   **Type**: `str | None`
-   **Default**: `None` (uses the built-in default suffix)

## Scoring System

| Score | Label | Meaning |
| --- | --- | --- |
| 1.0 | Following | All explicit constraints are satisfied |
| 0.0 | Not Following | One or more constraints are violated |

A response passes only if the score is `1.0`.

## Basic Usage

```python
import asyncio

from strands_evals import Case, Experiment
from strands_evals.evaluators import MultimodalInstructionFollowingEvaluator
from strands_evals.types import MultimodalInput
from strands_evals.types.evaluation_report import EvaluationReport


def task_function(case: Case) -> str:
    # Replace with your multimodal agent invocation.
    return "- tree\n- bench\n- lamppost"


cases = [
    Case(
        name="bullet-format",
        input=MultimodalInput(
            media="/path/to/park.jpg",
            instruction="List exactly three objects visible in the background as bullet points.",
        ),
    ),
]

experiment = Experiment(
    cases=cases,
    evaluators=[MultimodalInstructionFollowingEvaluator()],
)

async def main():
    report = await experiment.run_evaluations_async(task_function)
    report.run_display()

asyncio.run(main())
```

## Combining with Other Evaluators

Pair with correctness and faithfulness to assess different failure modes separately. `Experiment.run_evaluations` returns one combined report across all evaluators — each row in `report.cases` carries an `evaluator` key naming the producing evaluator:

```python
from strands_evals import Experiment
from strands_evals.evaluators import (
    MultimodalCorrectnessEvaluator,
    MultimodalFaithfulnessEvaluator,
    MultimodalInstructionFollowingEvaluator,
)
from strands_evals.types.evaluation_report import EvaluationReport

evaluators = [
    MultimodalInstructionFollowingEvaluator(),  # Did it follow the instruction constraints?
    MultimodalCorrectnessEvaluator(),           # Are the listed objects correct?
    MultimodalFaithfulnessEvaluator(),          # Are they actually in the image?
]

experiment = Experiment(cases=cases, evaluators=evaluators)

async def main():
    report = await experiment.run_evaluations_async(task_function)
    report.run_display()

asyncio.run(main())
```

## Related Evaluators

-   [**MultimodalOutputEvaluator**](lc:user-guide/evals-sdk/evaluators/multimodal_output_evaluator): Parent class with full parameter reference
-   [**InstructionFollowingEvaluator**](lc:user-guide/evals-sdk/evaluators/instruction_following_evaluator): Text-only counterpart

## Related pages

- [Multimodal Correctness Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_correctness_evaluator) (2 shared tags)
- [Multimodal Faithfulness Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_faithfulness_evaluator) (2 shared tags)
- [Multimodal Output Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_output_evaluator) (2 shared tags)
- [Multimodal Overall Quality Evaluator](lc:user-guide/evals-sdk/evaluators/multimodal_overall_quality_evaluator) (2 shared tags)
- [Google](lc:user-guide/concepts/model-providers/google) (1 shared tag)
- [Vercel](lc:user-guide/concepts/model-providers/vercel) (1 shared tag)
- [OpenAI](lc:user-guide/concepts/model-providers/openai) (1 shared tag)
- [Writer](lc:user-guide/concepts/model-providers/writer) (1 shared tag)
- [Amazon Nova](lc:user-guide/concepts/model-providers/amazon-nova) (1 shared tag)
- [Amazon Bedrock](lc:user-guide/concepts/model-providers/amazon-bedrock) (1 shared tag)
