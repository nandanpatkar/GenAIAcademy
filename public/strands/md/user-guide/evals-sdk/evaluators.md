## Overview

Evaluators assess the quality and performance of conversational agents by analyzing their outputs, behaviors, and goal achievement. The Strands Evals SDK provides a comprehensive set of evaluators that can assess different aspects of agent performance, from individual response quality to multi-turn conversation success.

## Why Evaluators?

Evaluating conversational agents requires more than simple accuracy metrics. Agents must be assessed across multiple dimensions:

**Traditional Metrics:**

-   Limited to exact match or similarity scores
-   Don’t capture subjective qualities like helpfulness
-   Can’t assess multi-turn conversation flow
-   Miss goal-oriented success patterns

**Strands Evaluators:**

-   Assess subjective qualities using LLM-as-a-judge
-   Evaluate multi-turn conversations and trajectories
-   Measure goal completion and user satisfaction
-   Provide structured reasoning for evaluation decisions
-   Support both synchronous and asynchronous evaluation

## When to Use Evaluators

Use evaluators when you need to:

-   **Assess Response Quality**: Evaluate helpfulness, faithfulness, and appropriateness
-   **Measure Goal Achievement**: Determine if user objectives were met
-   **Analyze Tool Usage**: Evaluate tool selection and parameter accuracy
-   **Track Conversation Success**: Assess multi-turn interaction effectiveness
-   **Compare Agent Configurations**: Benchmark different prompts or models
-   **Monitor Production Performance**: Continuously evaluate deployed agents

## Evaluation Levels

Evaluators operate at different levels of granularity:

| Level | Scope | Use Case |
| --- | --- | --- |
| **OUTPUT\_LEVEL** | Single response | Quality of individual outputs |
| **TRACE\_LEVEL** | Single turn | Turn-by-turn conversation analysis |
| **SESSION\_LEVEL** | Full conversation | End-to-end goal achievement |

## Built-in Evaluators

### Response Quality Evaluators

**[OutputEvaluator](lc:user-guide/evals-sdk/evaluators/output_evaluator)**

-   **Level**: OUTPUT\_LEVEL
-   **Purpose**: Flexible LLM-based evaluation with custom rubrics
-   **Use Case**: Assess any subjective quality (safety, relevance, tone)

**[HelpfulnessEvaluator](lc:user-guide/evals-sdk/evaluators/helpfulness_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate response helpfulness from user perspective
-   **Use Case**: Measure user satisfaction and response utility

**[FaithfulnessEvaluator](lc:user-guide/evals-sdk/evaluators/faithfulness_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Assess factual accuracy and groundedness
-   **Use Case**: Verify responses are truthful and well-supported

**[CorrectnessEvaluator](lc:user-guide/evals-sdk/evaluators/correctness_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate factual correctness with optional reference comparison
-   **Use Case**: Verify agent answers are correct, with or without ground truth

**[CoherenceEvaluator](lc:user-guide/evals-sdk/evaluators/coherence_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Assess logical consistency and reasoning quality
-   **Use Case**: Detect contradictions, logical gaps, and disorganized responses

**[ConcisenessEvaluator](lc:user-guide/evals-sdk/evaluators/conciseness_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate response brevity and efficiency
-   **Use Case**: Ensure agents communicate without unnecessary verbosity

**[ResponseRelevanceEvaluator](lc:user-guide/evals-sdk/evaluators/response_relevance_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate relevance of responses to user questions
-   **Use Case**: Detect off-topic or tangential responses

**[HarmfulnessEvaluator](lc:user-guide/evals-sdk/evaluators/harmfulness_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Binary evaluation for harmful content detection
-   **Use Case**: Screen responses for dangerous or offensive content

**[RefusalEvaluator](lc:user-guide/evals-sdk/evaluators/refusal_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Binary evaluation for refusal detection
-   **Use Case**: Detect when agents inappropriately refuse to address valid requests

**[StereotypingEvaluator](lc:user-guide/evals-sdk/evaluators/stereotyping_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Binary evaluation for bias and stereotyping detection
-   **Use Case**: Screen responses for biased or stereotypical content against groups

**[InstructionFollowingEvaluator](lc:user-guide/evals-sdk/evaluators/instruction_following_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Binary evaluation for instruction compliance
-   **Use Case**: Verify that agents follow explicit format, length, style, and content constraints

### Multimodal Evaluators

**[MultimodalOutputEvaluator](lc:user-guide/evals-sdk/evaluators/multimodal_output_evaluator)**

-   **Level**: OUTPUT\_LEVEL
-   **Purpose**: MLLM-as-a-Judge evaluation with custom rubrics for image/document-to-text tasks
-   **Use Case**: Evaluate responses for VQA, chart/document QA, image captioning, and OCR-style tasks

**[MultimodalOverallQualityEvaluator](lc:user-guide/evals-sdk/evaluators/multimodal_overall_quality_evaluator)**

-   **Level**: OUTPUT\_LEVEL
-   **Purpose**: Likert-5 overall quality scoring across visual accuracy, instruction adherence, completeness, and coherence
-   **Use Case**: Track single-score quality trends for image-to-text responses

**[MultimodalCorrectnessEvaluator](lc:user-guide/evals-sdk/evaluators/multimodal_correctness_evaluator)**

-   **Level**: OUTPUT\_LEVEL
-   **Purpose**: Strict binary fact-check of a response against the image content
-   **Use Case**: Verify factual accuracy of VQA or chart-QA answers

**[MultimodalFaithfulnessEvaluator](lc:user-guide/evals-sdk/evaluators/multimodal_faithfulness_evaluator)**

-   **Level**: OUTPUT\_LEVEL
-   **Purpose**: Strict binary hallucination detection that flags claims not verifiable from the image
-   **Use Case**: Catch invented details, assumptions, and ungrounded inferences in image captions

**[MultimodalInstructionFollowingEvaluator](lc:user-guide/evals-sdk/evaluators/multimodal_instruction_following_evaluator)**

-   **Level**: OUTPUT\_LEVEL
-   **Purpose**: Strict binary evaluation of constraint compliance (count, format, scope, order, completeness, style)
-   **Use Case**: Verify that multimodal responses respect explicit instructions independently of correctness

### Tool Usage Evaluators

**[ToolSelectionAccuracyEvaluator](lc:user-guide/evals-sdk/evaluators/tool_selection_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate whether correct tools were selected
-   **Use Case**: Assess tool choice accuracy in multi-tool scenarios

**[ToolParameterAccuracyEvaluator](lc:user-guide/evals-sdk/evaluators/tool_parameter_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate accuracy of tool parameters
-   **Use Case**: Verify correct parameter values for tool calls

### Conversation Flow Evaluators

**[TrajectoryEvaluator](lc:user-guide/evals-sdk/evaluators/trajectory_evaluator)**

-   **Level**: SESSION\_LEVEL
-   **Purpose**: Assess sequence of actions and tool usage patterns
-   **Use Case**: Evaluate multi-step reasoning and workflow adherence

**[InteractionsEvaluator](lc:user-guide/evals-sdk/evaluators/interactions_evaluator)**

-   **Level**: SESSION\_LEVEL
-   **Purpose**: Analyze conversation patterns and interaction quality
-   **Use Case**: Assess conversation flow and engagement patterns

### Goal Achievement Evaluators

**[GoalSuccessRateEvaluator](lc:user-guide/evals-sdk/evaluators/goal_success_rate_evaluator)**

-   **Level**: SESSION\_LEVEL
-   **Purpose**: Determine if user goals were successfully achieved
-   **Use Case**: Measure end-to-end task completion success

### Resilience Evaluators

**[FailureCommunicationEvaluator](lc:user-guide/evals-sdk/evaluators/failure_communication_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Assess how well agents communicate failures to users
-   **Use Case**: Evaluate transparency, clarity, and actionability of error messages under chaos testing

**[PartialCompletionEvaluator](lc:user-guide/evals-sdk/evaluators/partial_completion_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Measure what fraction of a goal was achieved despite failures
-   **Use Case**: Quantify graceful degradation and partial progress under tool failures

**[RecoveryStrategyEvaluator](lc:user-guide/evals-sdk/evaluators/recovery_strategy_evaluator)**

-   **Level**: TRACE\_LEVEL
-   **Purpose**: Evaluate the quality of agent recovery actions when tools fail
-   **Use Case**: Assess retry discipline, exploration breadth, and approach variation under chaos

### Deterministic Evaluators

**[Deterministic Evaluators](lc:user-guide/evals-sdk/evaluators/deterministic_evaluators)**

-   **Level**: OUTPUT\_LEVEL / SESSION\_LEVEL
-   **Purpose**: Fast, code-based evaluation without LLM judges
-   **Use Case**: Regression testing, CI/CD pipelines, exact match checks
-   **Includes**: `Equals`, `Contains`, `StartsWith`, `ToolCalled`, `StateEquals`

## Custom Evaluators

Create domain-specific evaluators by extending the base `Evaluator` class:

**[CustomEvaluator](lc:user-guide/evals-sdk/evaluators/custom_evaluator)**

-   **Purpose**: Implement specialized evaluation logic
-   **Use Case**: Domain-specific requirements not covered by built-in evaluators

## Evaluators vs Simulators

Understanding when to use evaluators versus simulators:

| Aspect | Evaluators | Simulators |
| --- | --- | --- |
| **Role** | Assess quality | Generate interactions |
| **Timing** | Post-conversation | During conversation |
| **Purpose** | Score/judge | Drive/participate |
| **Output** | Evaluation scores | Conversation turns |
| **Use Case** | Quality assessment | Interaction generation |

**Use Together:** Evaluators and simulators complement each other. Use simulators to generate realistic multi-turn conversations, then use evaluators to assess the quality of those interactions.

## Integration with Simulators

Evaluators work seamlessly with simulator-generated conversations:

> [!WARNING] Required: Session ID Trace Attributes
>
> When using `StrandsInMemorySessionMapper`, you **must** include session ID trace attributes in your agent configuration. This prevents spans from different test cases from being mixed together in the memory exporter.

```python
import asyncio

from strands import Agent
from strands_evals import Case, Experiment, ActorSimulator
from strands_evals.evaluators import HelpfulnessEvaluator, GoalSuccessRateEvaluator
from strands_evals.mappers import StrandsInMemorySessionMapper
from strands_evals.telemetry import StrandsEvalsTelemetry

def task_function(case: Case) -> dict:
    # Generate multi-turn conversation with simulator
    simulator = ActorSimulator.from_case_for_user_simulator(case=case, max_turns=10)
    agent = Agent(trace_attributes={"session.id": case.session_id})

    # Collect conversation data
    all_spans = []
    user_message = case.input

    while simulator.has_next():
        agent_response = agent(user_message)
        turn_spans = list(memory_exporter.get_finished_spans())
        all_spans.extend(turn_spans)

        user_result = simulator.act(str(agent_response))
        user_message = str(user_result.structured_output.message)

    # Map to session for evaluation
    mapper = StrandsInMemorySessionMapper()
    session = mapper.map_to_session(all_spans, session_id=case.session_id)

    return {"output": str(agent_response), "trajectory": session}

# Use multiple evaluators to assess different aspects
from strands_evals.evaluators import (
    ToolSelectionAccuracyEvaluator,
    TrajectoryEvaluator,
)

evaluators = [
    HelpfulnessEvaluator(),                  # Response quality
    GoalSuccessRateEvaluator(),              # Goal achievement
    ToolSelectionAccuracyEvaluator(),        # Tool usage
    TrajectoryEvaluator(rubric="..."),       # Action sequences
]

experiment = Experiment(cases=test_cases, evaluators=evaluators)

async def main():
    report = await experiment.run_evaluations_async(task_function)

asyncio.run(main())
```

## Best Practices

### 1\. Choose Appropriate Evaluation Levels

Match evaluator level to your assessment needs:

```python
# For individual response quality
evaluators = [OutputEvaluator(rubric="Assess response clarity")]

# For turn-by-turn analysis
evaluators = [HelpfulnessEvaluator(), FaithfulnessEvaluator()]

# For end-to-end success
evaluators = [GoalSuccessRateEvaluator(), TrajectoryEvaluator(rubric="...")]
```

### 2\. Combine Multiple Evaluators

Assess different aspects comprehensively:

```python
evaluators = [
    HelpfulnessEvaluator(),              # User experience
    FaithfulnessEvaluator(),             # Accuracy
    ToolSelectionAccuracyEvaluator(),    # Tool usage
    GoalSuccessRateEvaluator(),          # Success rate
]
```

### 3\. Use Clear Rubrics

For custom evaluators, define specific criteria:

```python
rubric = """
Score 1.0 if the response:
- Directly answers the user's question
- Provides accurate information
- Uses appropriate tone

Score 0.5 if the response partially meets criteria
Score 0.0 if the response fails to meet criteria
"""

evaluator = OutputEvaluator(rubric=rubric)
```

### 4\. Leverage Async Evaluation

For better performance with multiple evaluators, run them concurrently via `evaluate_async`:

```python
import asyncio

async def run_evaluations(data):
    evaluators = [HelpfulnessEvaluator(), FaithfulnessEvaluator()]
    tasks = [evaluator.evaluate_async(data) for evaluator in evaluators]
    results = await asyncio.gather(*tasks)  # list[list[EvaluationOutput]]
    return results
```

## Common Patterns

### Pattern 1: Quality Assessment Pipeline

`Evaluator.evaluate` returns `list[EvaluationOutput]`. Each `EvaluationOutput` has `score`, `test_pass`, and `reason` (not `reasoning`). `EvaluationData` field names are `actual_output`/`actual_trajectory`/`actual_interactions` (not `output`/`trajectory`).

```python
from strands_evals.types import EvaluationData

def assess_response_quality(case: Case, agent_output: str) -> dict:
    evaluators = [
        HelpfulnessEvaluator(),
        FaithfulnessEvaluator(),
        OutputEvaluator(rubric="Assess professional tone")
    ]

    data = EvaluationData(input=case.input, actual_output=agent_output)
    results = {}
    for evaluator in evaluators:
        outputs = evaluator.evaluate(data)
        # Average across this evaluator's outputs (usually a single one)
        results[evaluator.__class__.__name__] = sum(o.score for o in outputs) / len(outputs)

    return results
```

### Pattern 2: Tool Usage Analysis

```python
from strands_evals.evaluators import (
    ToolSelectionAccuracyEvaluator,
    ToolParameterAccuracyEvaluator,
    TrajectoryEvaluator,
)
from strands_evals.types import EvaluationData

def analyze_tool_usage(session: Session) -> dict:
    evaluators = [
        ToolSelectionAccuracyEvaluator(),
        ToolParameterAccuracyEvaluator(),
        TrajectoryEvaluator(rubric="Assess tool usage efficiency")
    ]

    data = EvaluationData(actual_trajectory=session)
    results = {}
    for evaluator in evaluators:
        outputs = evaluator.evaluate(data)
        # Take the first output (most evaluators emit one)
        result = outputs[0]
        results[evaluator.__class__.__name__] = {
            "score": result.score,
            "reason": result.reason,
        }

    return results
```

### Pattern 3: Comparative Evaluation

```python
from strands_evals.types import EvaluationData

def compare_agent_versions(cases: list, agents: dict) -> dict:
    evaluators = [HelpfulnessEvaluator(), GoalSuccessRateEvaluator()]
    results = {}

    for agent_name, agent in agents.items():
        agent_scores = []
        for case in cases:
            output = agent(case.input)
            data = EvaluationData(input=case.input, actual_output=str(output))
            for evaluator in evaluators:
                outputs = evaluator.evaluate(data)
                agent_scores.extend(o.score for o in outputs)

        results[agent_name] = {
            "average_score": sum(agent_scores) / len(agent_scores),
            "scores": agent_scores
        }

    return results
```

## Next Steps

-   [OutputEvaluator](lc:user-guide/evals-sdk/evaluators/output_evaluator): Start with flexible custom evaluation
-   [HelpfulnessEvaluator](lc:user-guide/evals-sdk/evaluators/helpfulness_evaluator): Assess response helpfulness
-   [MultimodalOutputEvaluator](lc:user-guide/evals-sdk/evaluators/multimodal_output_evaluator): Evaluate image/document-to-text responses with an MLLM judge
-   [CustomEvaluator](lc:user-guide/evals-sdk/evaluators/custom_evaluator): Create domain-specific evaluators
-   [Detectors](lc:user-guide/evals-sdk/detectors): Understand *why* cases fail with automatic failure detection and root cause analysis

## Related Documentation

-   [Quickstart Guide](lc:user-guide/evals-sdk/quickstart): Get started with Strands Evals
-   [Simulators Overview](lc:user-guide/evals-sdk/simulators): Learn about simulators
-   [Detectors Overview](lc:user-guide/evals-sdk/detectors): Automatic failure diagnosis for agent traces
-   [Experiment Generator](lc:user-guide/evals-sdk/experiment_generator): Generate test cases automatically
